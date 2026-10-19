// tf-schema.go — read a Terraform provider's resource and data source schemas from its Go source.
//
// gen-surfaces.mjs runs this with the provider package's files (read at the submodule pin) on stdin and
// the registered types to resolve; it prints each type's arguments as JSON on stdout. It parses the code
// with go/ast and needs no network, no build of the provider and no third-party modules (stdlib only:
// `go run scripts/tf-schema.go`).
//
// The schema-building functions are interpreted, not pattern-matched: each function's statements run in
// order with its parameters bound to the call's arguments, so locals, field assignments after construction
// (`ids.MaxItems = *maxItems`), map writes (`m["k"] = ...`), `delete(m, "k")` and the returned value all
// count, and a *schema.Schema or schema map is shared by reference as in Go. Both branches of an `if` run;
// loops do not, except a merge helper (a function whose last parameter is a variadic map), whose maps are
// merged in order. MaxItems or MinItems 0 means no limit, as in the SDK. Enum values come from
// validation.StringInSlice, through helper functions and package variables; other validators are named;
// EnvDefaultFunc / MultiEnvDefaultFunc give `env`. What cannot be followed is listed under `unresolved`
// rather than guessed.
//
// Input:  {"files": {"zpa/x.go": "<source>"}, "types": {"resource:zpa_x": "resourceX"}}
// Output: {"resource:zpa_x": {"arguments": {...}, "customize_diff": "...", "unresolved": [...]}}
package main

import (
	"encoding/json"
	"fmt"
	"go/ast"
	"go/parser"
	"go/printer"
	"go/token"
	"os"
	"sort"
	"strconv"
	"strings"
)

type Validator struct {
	Enum       []string     `json:"enum,omitempty"`
	IgnoreCase bool         `json:"ignore_case,omitempty"`
	Range      []string     `json:"range,omitempty"`    // IntBetween, StringLenBetween, FloatBetween: [min, max]
	AtLeast    string       `json:"at_least,omitempty"` // IntAtLeast
	All        []*Validator `json:"all,omitempty"`
	Any        []*Validator `json:"any,omitempty"`
	Func       string       `json:"func,omitempty"` // any other validator, by name
}

type Arg struct {
	Type          string          `json:"type,omitempty"`
	Required      bool            `json:"required,omitempty"`
	Optional      bool            `json:"optional,omitempty"`
	Computed      bool            `json:"computed,omitempty"`
	ForceNew      bool            `json:"force_new,omitempty"`
	Sensitive     bool            `json:"sensitive,omitempty"`
	Default       *string         `json:"default,omitempty"`
	Env           []string        `json:"env,omitempty"` // DefaultFunc: EnvDefaultFunc / MultiEnvDefaultFunc
	Deprecated    string          `json:"deprecated,omitempty"`
	Description   string          `json:"description,omitempty"`
	MaxItems      string          `json:"max_items,omitempty"`
	MinItems      string          `json:"min_items,omitempty"`
	ConflictsWith []string        `json:"conflicts_with,omitempty"`
	ExactlyOneOf  []string        `json:"exactly_one_of,omitempty"`
	AtLeastOneOf  []string        `json:"at_least_one_of,omitempty"`
	RequiredWith  []string        `json:"required_with,omitempty"`
	Validate      *Validator      `json:"validate,omitempty"`
	ElemType      string          `json:"elem_type,omitempty"`
	ElemValidate  *Validator      `json:"elem_validate,omitempty"`
	Block         map[string]*Arg `json:"block,omitempty"`
	ConfigMode    string          `json:"config_mode,omitempty"`
	StateFunc     string          `json:"state_func,omitempty"`
	DiffSuppress  string          `json:"diff_suppress,omitempty"`
}

type Result struct {
	Arguments     map[string]*Arg `json:"arguments"`
	CustomizeDiff string          `json:"customize_diff,omitempty"`
	Unresolved    []string        `json:"unresolved,omitempty"`
}

// ---------------------------------------------------------------- values

// A value is a *Arg (a *schema.Schema), a schemaMap, a *resource (schema.Resource or schema.Provider), or a
// raw expression with the scope it is read in.
type value any

type schemaMap map[string]*Arg

type resource struct {
	schema        schemaMap
	customizeDiff string
}

type raw struct {
	expr ast.Expr
	sc   *scope
}

type scope struct {
	vars   map[string]value
	parent *scope // nil: package level
}

var (
	fset   = token.NewFileSet()
	funcs  = map[string]*ast.FuncDecl{}
	values = map[string]ast.Expr{} // package-level var and const values
	pkg    = &scope{vars: map[string]value{}}
	notes  []string
	depth  int
)

func note(format string, a ...any) { notes = append(notes, fmt.Sprintf(format, a...)) }

func src(e ast.Node) string {
	var b strings.Builder
	printer.Fprint(&b, fset, e)
	return b.String()
}

func trim(s string) string {
	s = strings.Join(strings.Fields(s), " ")
	if len(s) > 80 {
		return s[:80] + "..."
	}
	return s
}

func (s *scope) get(name string) (value, bool) {
	for c := s; c != nil; c = c.parent {
		if v, ok := c.vars[name]; ok {
			return v, true
		}
	}
	if e, ok := values[name]; ok {
		return eval(e, pkg), true
	}
	return nil, false
}

func unparen(e ast.Expr) ast.Expr {
	for {
		switch v := e.(type) {
		case *ast.ParenExpr:
			e = v.X
		case *ast.UnaryExpr:
			if v.Op != token.AND {
				return e
			}
			e = v.X
		case *ast.StarExpr: // *maxItems where maxItems is intPtr(n): the pointer and its value are one
			e = v.X
		default:
			return e
		}
	}
}

// eval evaluates an expression in a scope.
func eval(e ast.Expr, sc *scope) value {
	e = unparen(e)
	switch v := e.(type) {
	case *ast.Ident:
		if val, ok := sc.get(v.Name); ok {
			return val
		}
	case *ast.CompositeLit:
		t := ""
		if v.Type != nil {
			t = src(v.Type)
		}
		switch {
		case strings.HasPrefix(t, "map[string]"):
			m := schemaMap{}
			for _, el := range v.Elts {
				kv, ok := el.(*ast.KeyValueExpr)
				if !ok {
					continue
				}
				k, ok := str(kv.Key, sc)
				if !ok {
					note("argument with a computed name %s", src(kv.Key))
					continue
				}
				m[k] = argOf(kv.Value, sc, k)
			}
			return m
		case strings.HasSuffix(t, "Resource") || strings.HasSuffix(t, "Provider"):
			r := &resource{}
			for _, el := range v.Elts {
				if kv, ok := el.(*ast.KeyValueExpr); ok {
					switch src(kv.Key) {
					case "Schema":
						r.schema = mapOf(kv.Value, sc, "schema")
					case "CustomizeDiff":
						r.customizeDiff = "inline"
						if _, lit := unparen(kv.Value).(*ast.FuncLit); !lit {
							r.customizeDiff = trim(src(kv.Value))
						}
					}
				}
			}
			return r
		case t == "" || strings.HasSuffix(t, "Schema"):
			a := &Arg{}
			for _, el := range v.Elts {
				if kv, ok := el.(*ast.KeyValueExpr); ok {
					setField(a, src(kv.Key), kv.Value, sc)
				}
			}
			return a
		}
	case *ast.CallExpr:
		if id, ok := v.Fun.(*ast.Ident); ok {
			if fd := funcs[id.Name]; fd != nil {
				return call(fd, v.Args, sc)
			}
		}
	}
	return raw{e, sc}
}

// call interprets a package function with its parameters bound to the arguments.
func call(fd *ast.FuncDecl, args []ast.Expr, caller *scope) value {
	if depth > 40 {
		note("call nesting too deep at %s", fd.Name.Name)
		return nil
	}
	depth++
	defer func() { depth-- }()
	params := fd.Type.Params.List
	// A merge helper: every argument is a schema map; later ones win.
	if n := len(params); n > 0 {
		if el, ok := params[n-1].Type.(*ast.Ellipsis); ok {
			if _, isMap := el.Elt.(*ast.MapType); isMap {
				out := schemaMap{}
				for _, a := range args {
					for k, v := range mapOf(a, caller, "merge") {
						out[k] = v
					}
				}
				return out
			}
		}
	}
	sc := &scope{vars: map[string]value{}, parent: pkg}
	i := 0
	for _, f := range params {
		for _, name := range f.Names {
			if i < len(args) {
				sc.vars[name.Name] = eval(args[i], caller)
			}
			i++
		}
	}
	var ret value
	run(fd.Body.List, sc, &ret)
	return ret
}

// run executes statements in order; both branches of an if run, loops do not. The first non-nil return wins.
func run(stmts []ast.Stmt, sc *scope, ret *value) {
	for _, st := range stmts {
		if *ret != nil {
			return
		}
		switch s := st.(type) {
		case *ast.AssignStmt:
			for i, l := range s.Lhs {
				if i >= len(s.Rhs) {
					break
				}
				assign(l, s.Rhs[i], sc)
			}
		case *ast.DeclStmt:
			if g, ok := s.Decl.(*ast.GenDecl); ok {
				for _, spec := range g.Specs {
					if vs, ok := spec.(*ast.ValueSpec); ok {
						for i, n := range vs.Names {
							if i < len(vs.Values) {
								sc.vars[n.Name] = eval(vs.Values[i], sc)
							}
						}
					}
				}
			}
		case *ast.ExprStmt:
			if c, ok := s.X.(*ast.CallExpr); ok && src(c.Fun) == "delete" && len(c.Args) == 2 {
				if m, ok := eval(c.Args[0], sc).(schemaMap); ok {
					if k, ok := str(c.Args[1], sc); ok {
						delete(m, k)
					}
				}
			}
		case *ast.IfStmt:
			run(s.Body.List, sc, ret)
			if blk, ok := s.Else.(*ast.BlockStmt); ok {
				run(blk.List, sc, ret)
			} else if elif, ok := s.Else.(*ast.IfStmt); ok {
				run([]ast.Stmt{elif}, sc, ret)
			}
		case *ast.BlockStmt:
			run(s.List, sc, ret)
		case *ast.ReturnStmt:
			if len(s.Results) == 1 && src(s.Results[0]) != "nil" {
				*ret = eval(s.Results[0], sc)
			}
		}
	}
}

func assign(l, r ast.Expr, sc *scope) {
	switch lv := l.(type) {
	case *ast.Ident:
		if lv.Name != "_" {
			sc.vars[lv.Name] = eval(r, sc)
		}
	case *ast.SelectorExpr: // s.MaxItems = n on a schema built earlier; a nil value (an unset pointer) sets nothing
		if a, ok := eval(lv.X, sc).(*Arg); ok && !isNil(r, sc) {
			setField(a, lv.Sel.Name, r, sc)
		}
	case *ast.IndexExpr: // m["k"] = &schema.Schema{...}
		if m, ok := eval(lv.X, sc).(schemaMap); ok {
			if k, ok := str(lv.Index, sc); ok {
				m[k] = argOf(r, sc, k)
			}
		}
	}
}

func isNil(e ast.Expr, sc *scope) bool {
	r, ok := eval(e, sc).(raw)
	id, isIdent := r.expr.(*ast.Ident)
	return ok && isIdent && id.Name == "nil"
}

func argOf(e ast.Expr, sc *scope, where string) *Arg {
	if a, ok := eval(e, sc).(*Arg); ok {
		return a
	}
	note("%s: argument not followed: %s", where, trim(src(e)))
	return &Arg{}
}

func mapOf(e ast.Expr, sc *scope, where string) schemaMap {
	if m, ok := eval(e, sc).(schemaMap); ok {
		return m
	}
	note("%s: schema not followed: %s", where, trim(src(e)))
	return schemaMap{}
}

// ---------------------------------------------------------------- scalars

// str evaluates a string or number literal, a concatenation, or a constant, in a scope.
func str(e ast.Expr, sc *scope) (string, bool) {
	switch v := eval(e, sc).(type) {
	case raw:
		switch x := v.expr.(type) {
		case *ast.BasicLit:
			if x.Kind == token.STRING {
				s, err := strconv.Unquote(x.Value)
				return s, err == nil
			}
			return x.Value, true
		case *ast.BinaryExpr:
			if x.Op == token.ADD {
				a, ok1 := str(x.X, v.sc)
				b, ok2 := str(x.Y, v.sc)
				return a + b, ok1 && ok2
			}
		case *ast.CallExpr: // intPtr(n) and similar one-argument wrappers around a literal
			if len(x.Args) == 1 && strings.HasSuffix(src(x.Fun), "Ptr") {
				return str(x.Args[0], v.sc)
			}
		}
	}
	return "", false
}

// text is str, or the expression's source when it cannot be evaluated (an SDK constant, a parameter).
func text(e ast.Expr, sc *scope) string {
	if s, ok := str(e, sc); ok {
		return s
	}
	if r, ok := eval(e, sc).(raw); ok {
		return src(r.expr)
	}
	return src(e)
}

func list(e ast.Expr, sc *scope) []string {
	r, ok := eval(e, sc).(raw)
	if !ok {
		return []string{src(e)}
	}
	cl, ok := r.expr.(*ast.CompositeLit)
	if !ok {
		return []string{src(r.expr)}
	}
	out := []string{}
	for _, el := range cl.Elts {
		out = append(out, text(el, r.sc))
	}
	return out
}

func isTrue(e ast.Expr, sc *scope) bool {
	r, ok := eval(e, sc).(raw)
	if !ok {
		return false
	}
	id, ok := r.expr.(*ast.Ident)
	return ok && id.Name == "true"
}

var typeNames = map[string]string{"TypeString": "string", "TypeInt": "int", "TypeFloat": "float", "TypeBool": "bool", "TypeList": "list", "TypeSet": "set", "TypeMap": "map"}

func typeName(e ast.Expr, sc *scope) string {
	if r, ok := eval(e, sc).(raw); ok {
		if sel, ok := r.expr.(*ast.SelectorExpr); ok && typeNames[sel.Sel.Name] != "" {
			return typeNames[sel.Sel.Name]
		}
		return src(r.expr)
	}
	return src(e)
}

func validator(e ast.Expr, sc *scope) *Validator {
	r, ok := eval(e, sc).(raw)
	if !ok {
		return &Validator{Func: trim(src(e))}
	}
	c, ok := r.expr.(*ast.CallExpr)
	if !ok {
		if _, lit := r.expr.(*ast.FuncLit); lit {
			// A helper returning a closure (intAtMost(100)) is named by its call; a literal is inline.
			if _, own := unparen(e).(*ast.FuncLit); !own {
				return &Validator{Func: trim(src(e))}
			}
			return &Validator{Func: "inline"}
		}
		return &Validator{Func: src(r.expr)}
	}
	name := src(c.Fun)
	args := c.Args
	switch name {
	case "validation.StringInSlice":
		v := &Validator{Enum: list(args[0], r.sc)}
		if len(args) > 1 {
			v.IgnoreCase = isTrue(args[1], r.sc)
		}
		return v
	case "validation.IntBetween", "validation.StringLenBetween", "validation.FloatBetween":
		return &Validator{Range: []string{text(args[0], r.sc), text(args[1], r.sc)}, Func: name}
	case "validation.IntAtLeast":
		return &Validator{AtLeast: text(args[0], r.sc), Func: name}
	case "validation.All", "validation.Any":
		vs := []*Validator{}
		for _, a := range args {
			vs = append(vs, validator(a, r.sc))
		}
		if name == "validation.All" {
			return &Validator{All: vs}
		}
		return &Validator{Any: vs}
	case "validation.ToDiagFunc":
		return validator(args[0], r.sc)
	}
	return &Validator{Func: trim(src(r.expr))}
}

func setField(a *Arg, key string, val ast.Expr, sc *scope) {
	switch key {
	case "Type":
		a.Type = typeName(val, sc)
	case "Required":
		a.Required = isTrue(val, sc)
	case "Optional":
		a.Optional = isTrue(val, sc)
	case "Computed":
		a.Computed = isTrue(val, sc)
	case "ForceNew":
		a.ForceNew = isTrue(val, sc)
	case "Sensitive":
		a.Sensitive = isTrue(val, sc)
	case "Default":
		d := text(val, sc)
		a.Default = &d
	case "DefaultFunc":
		if r, ok := eval(val, sc).(raw); ok {
			if c, ok := r.expr.(*ast.CallExpr); ok && len(c.Args) > 0 {
				switch src(c.Fun) {
				case "schema.EnvDefaultFunc":
					a.Env = []string{text(c.Args[0], r.sc)}
				case "schema.MultiEnvDefaultFunc":
					a.Env = list(c.Args[0], r.sc)
				default:
					note("default function not followed: %s", trim(src(val)))
					return
				}
				if len(c.Args) > 1 && src(c.Args[1]) != "nil" {
					d := text(c.Args[1], r.sc)
					a.Default = &d
				}
			}
		}
	case "Deprecated":
		a.Deprecated = text(val, sc)
	case "Description":
		a.Description = text(val, sc)
	case "MaxItems", "MinItems":
		n := text(val, sc)
		if n == "0" {
			n = "" // 0 is no limit in the SDK
		}
		if key == "MaxItems" {
			a.MaxItems = n
		} else {
			a.MinItems = n
		}
	case "ConflictsWith":
		a.ConflictsWith = list(val, sc)
	case "ExactlyOneOf":
		a.ExactlyOneOf = list(val, sc)
	case "AtLeastOneOf":
		a.AtLeastOneOf = list(val, sc)
	case "RequiredWith":
		a.RequiredWith = list(val, sc)
	case "ValidateFunc", "ValidateDiagFunc":
		a.Validate = validator(val, sc)
	case "DiffSuppressFunc", "StateFunc":
		name := "inline"
		if _, lit := unparen(val).(*ast.FuncLit); !lit {
			name = trim(src(val))
		}
		if key == "StateFunc" {
			a.StateFunc = name
		} else {
			a.DiffSuppress = name
		}
	case "ConfigMode":
		a.ConfigMode = trim(src(val))
	case "Elem":
		switch e := eval(val, sc).(type) {
		case *resource:
			a.Block = e.schema
		case *Arg:
			a.ElemType = e.Type
			a.ElemValidate = e.Validate
		case raw:
			if t := typeName(val, sc); typeNames[strings.TrimPrefix(t, "schema.")] != "" || isTypeName(t) {
				a.ElemType = t
			} else {
				note("element not followed: %s", trim(src(val)))
			}
		default:
			note("element not followed: %s", trim(src(val)))
		}
	}
}

func isTypeName(t string) bool {
	for _, v := range typeNames {
		if v == t {
			return true
		}
	}
	return false
}

// ---------------------------------------------------------------- main

func main() {
	var in struct {
		Files map[string]string `json:"files"`
		Types map[string]string `json:"types"`
	}
	if err := json.NewDecoder(os.Stdin).Decode(&in); err != nil {
		fmt.Fprintln(os.Stderr, "tf-schema:", err)
		os.Exit(1)
	}
	names := make([]string, 0, len(in.Files))
	for n := range in.Files {
		names = append(names, n)
	}
	sort.Strings(names)
	for _, n := range names {
		f, err := parser.ParseFile(fset, n, in.Files[n], parser.ParseComments)
		if err != nil {
			fmt.Fprintln(os.Stderr, "tf-schema:", err)
			os.Exit(1)
		}
		for _, d := range f.Decls {
			switch v := d.(type) {
			case *ast.FuncDecl:
				if v.Recv == nil {
					funcs[v.Name.Name] = v
				}
			case *ast.GenDecl:
				for _, s := range v.Specs {
					if vs, ok := s.(*ast.ValueSpec); ok {
						for i, id := range vs.Names {
							if i < len(vs.Values) {
								values[id.Name] = vs.Values[i]
							}
						}
					}
				}
			}
		}
	}
	out := map[string]*Result{}
	for typ, fn := range in.Types {
		notes = nil
		res := &Result{Arguments: map[string]*Arg{}}
		fd := funcs[fn]
		if fd == nil {
			note("function %s not found", fn)
		} else if r, ok := call(fd, nil, pkg).(*resource); ok {
			res.Arguments = r.schema
			res.CustomizeDiff = r.customizeDiff
		} else {
			note("%s returns no schema.Resource or schema.Provider", fn)
		}
		for i := range notes {
			notes[i] = typ + ": " + notes[i]
		}
		sort.Strings(notes)
		res.Unresolved = notes
		out[typ] = res
	}
	enc := json.NewEncoder(os.Stdout)
	enc.SetEscapeHTML(false)
	if err := enc.Encode(out); err != nil {
		fmt.Fprintln(os.Stderr, "tf-schema:", err)
		os.Exit(1)
	}
}
