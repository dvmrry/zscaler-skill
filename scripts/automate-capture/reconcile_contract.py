#!/usr/bin/env python3
"""reconcile_contract.py — diff the captured automate.zscaler.com contract against
client surfaces and report real divergences.

This is the DAV-21 payoff: the rendered contract is the vendor's actual per-operation
schema (required/readonly/enum). Diffing it against the client-side sources surfaces
where they disagree — numeric-vs-string fields, required/readonly drift, enum drift,
and coverage gaps.

Inputs:
  - normalized contract  : vendor/zscaler-api-specs/automate-zscaler/<product>-api-reference.json
  - Go SDK struct        : vendor/zscaler-sdk-go/... (json tags + Go type)
  - Terraform schema     : vendor/terraform-provider-*... (Required/Optional/Computed + enum)
  - Python SDK model     : vendor/zscaler-sdk-python/... (wire-key model/request fields)

High-signal axes (conservative — exact names; TF snake_case→camelCase is the only
alias, derived from the TF key itself; anything unmatched is reported, never guessed):
  - presence        : field in one source but not the other
  - type drift      : contract numeric vs Go string (and vice versa)
  - required drift  : contract (request-body required) vs TF Required
  - readonly        : the contract's readonly fields vs TF Computed (narrowed — TF's
                      Optional+Computed server-defaults are NOT treated as readonly)
  - enum            : match / value-conflict (both list values, they differ) /
                      one-sided (only one side constrains)
  - Python presence : model/request payload keys only; the Python SDK mostly accepts
                      dynamic **kwargs and does not generally encode required/enum
                      constraints, so those are not inferred.

Extractors take source TEXT (pure, unit-tested in test_reconcile_contract.py); thin
file wrappers read from disk. Run from the repo root:
  python3 scripts/automate-capture/reconcile_contract.py
"""
import ast
import json
import os
import re

ROOT = os.environ.get("REPO_ROOT", ".")

# ---- Go SDK struct extraction ---------------------------------------------

_GO_NUM = {"int", "int8", "int16", "int32", "int64", "uint", "uint8", "uint16",
           "uint32", "uint64", "float32", "float64"}


def go_category(t):
    t = t.lstrip("*")
    if t.startswith("[]"):
        return "array"
    if t.startswith("map["):
        return "object"
    if t in _GO_NUM:
        return "number"
    if t == "bool":
        return "boolean"
    if t == "string":
        return "string"
    return "object"


def extract_go_struct_fields(src, struct_name):
    """Top-level fields of a Go struct -> {json_name: {go_type, category}}.
    Brace-aware so nested anonymous structs don't leak. Pure (takes source text)."""
    m = re.search(r"type\s+" + re.escape(struct_name) + r"\s+struct\s*\{", src)
    if not m:
        return {}
    i = m.end()
    depth = 1
    start = i
    while i < len(src) and depth:
        if src[i] == "{":
            depth += 1
        elif src[i] == "}":
            depth -= 1
        i += 1
    body = src[start:i - 1]
    fields = {}
    # Only depth-1 lines: Name  Type  `json:"name,..."`. Skip lines inside nested
    # struct{...} blocks by tracking braces on the field-type position.
    bdepth = 0
    fre = re.compile(r"^\s*([A-Z]\w*)\s+([^\s`]+)\s+`[^`]*json:\"([^\",]+)")
    for line in body.split("\n"):
        if bdepth == 0:
            fm = fre.match(line)
            if fm:
                _, go_type, json_name = fm.groups()
                if json_name != "-":
                    fields[json_name] = {"go_type": go_type, "category": go_category(go_type)}
        bdepth += line.count("{") - line.count("}")
    return fields


# ---- Terraform schema extraction ------------------------------------------

def snake_to_camel(s):
    parts = s.split("_")
    return parts[0] + "".join(p[:1].upper() + p[1:] for p in parts[1:])


def _scan_blocks_depth1(src, open_marker):
    """Yield (key, block_text) for "key": { ... } at depth 1 inside open_marker.
    Brace-aware; skips strings and // comments."""
    mi = src.find(open_marker)
    if mi == -1:
        return
    i = mi + len(open_marker)
    depth = 1
    n = len(src)
    cur_key = None
    block_start = None
    while i < n and depth:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j == -1 else j
            continue
        if c == '"':
            i += 1
            while i < n and src[i] != '"':
                if src[i] == "\\":
                    i += 1
                i += 1
            i += 1
            continue
        if c == "`":
            i += 1
            while i < n and src[i] != "`":
                i += 1
            i += 1
            continue
        if c == "{":
            if depth == 1:
                pre = src[max(0, i - 80):i]
                km = re.search(r'"([a-z0-9_]+)"\s*:\s*$', pre)
                if km:
                    cur_key = km.group(1)
                    block_start = i + 1
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 1 and cur_key is not None:
                yield cur_key, src[block_start:i]
                cur_key = None
        i += 1


def _strip_go_comments(s):
    """Drop /* */ and // comments so commented-out attributes (Computed,
    ValidateFunc, ...) are never read as live schema. Adequate for schema blocks:
    the flags and StringInSlice values we read never appear inside string literals."""
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
    s = re.sub(r"//[^\n]*", "", s)
    return s


_TF_MARKER = "Schema: map[string]*schema.Schema{"
_TF_FRAMEWORK_ATTR_MARKER = "Attributes: map[string]schema.Attribute{"
_TF_FRAMEWORK_BLOCK_MARKER = "Blocks: map[string]schema.Block{"
_RESOURCE_FUNC_RE = re.compile(r"func\s+resource\w+\s*\(\)\s*\*schema\.Resource\s*\{")
_FRAMEWORK_RESOURCE_SCHEMA_RE = re.compile(
    r"func\s+\(r\s+\*\w+Resource\)\s+Schema\s*\([^)]*\)\s*\{"
)


def _go_block_end(src, open_idx):
    """Return the matching brace index for a Go block, skipping comments/strings."""
    i = open_idx + 1
    depth = 1
    n = len(src)
    while i < n and depth:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j == -1 else j + 1
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i)
            i = n if j == -1 else j + 2
            continue
        if c == '"':
            i += 1
            while i < n and src[i] != '"':
                if src[i] == "\\":
                    i += 1
                i += 1
            i += 1
            continue
        if c == "`":
            i += 1
            while i < n and src[i] != "`":
                i += 1
            i += 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return n


def _tf_resource_func_source(src):
    """Prefer the actual Terraform resource function over helper schemas in the file."""
    m = _RESOURCE_FUNC_RE.search(src)
    if not m:
        return src
    open_idx = src.find("{", m.start(), m.end())
    if open_idx == -1:
        return src
    return src[open_idx + 1:_go_block_end(src, open_idx)]


def _tf_framework_schema_source(src):
    """Prefer the Plugin Framework resource Schema method over helper block builders."""
    m = _FRAMEWORK_RESOURCE_SCHEMA_RE.search(src)
    if not m:
        return src
    open_idx = src.find("{", m.start(), m.end())
    if open_idx == -1:
        return src
    return src[open_idx + 1:_go_block_end(src, open_idx)]


def _drop_nested_schema_maps(src):
    """Remove nested schema maps from a top-level field block before flag/enum reads."""
    out = []
    i = 0
    while True:
        mi = src.find(_TF_MARKER, i)
        if mi == -1:
            out.append(src[i:])
            break
        out.append(src[i:mi])
        open_idx = mi + len(_TF_MARKER) - 1
        i = _go_block_end(src, open_idx) + 1
    return "".join(out)


def _tf_top_level_keys(src, open_marker=_TF_MARKER):
    """Every depth-1 key in a Terraform schema map — including helper-valued keys
    (`"k": resourceFooSchema()`), which inline-block scanning misses. String/comment
    aware so braces and colons in literals/comments don't confuse depth or key
    detection."""
    mi = src.find(open_marker)
    if mi == -1:
        return []
    i = mi + len(open_marker)
    n = len(src)
    depth = 1
    keys = []
    while i < n and depth:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j == -1 else j
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i)
            i = n if j == -1 else j + 2
            continue
        if c == "`":
            j = src.find("`", i + 1)
            i = n if j == -1 else j + 1
            continue
        if c == '"':
            k = i + 1
            while k < n and src[k] != '"':
                if src[k] == "\\":
                    k += 1
                k += 1
            token = src[i + 1:k]
            j = k + 1
            while j < n and src[j] in " \t":
                j += 1
            if depth == 1 and j < n and src[j] == ":" and re.fullmatch(r"[a-z0-9_]+", token):
                keys.append(token)
            i = k + 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        i += 1
    return keys


def _scan_value_blocks_depth1(src, open_marker):
    """Yield (key, block_text) for depth-1 `"key": schema.XAttribute{...}` values.

    Terraform Plugin Framework attributes include the concrete attribute type before
    the opening brace (`schema.StringAttribute{...}`), so the SDKv2 block scanner's
    `"key": { ... }` assumption is too narrow. Helper-valued attributes are left for
    `_tf_top_level_keys` and reported as present with unknown flags.
    """
    mi = src.find(open_marker)
    if mi == -1:
        return
    i = mi + len(open_marker)
    n = len(src)
    depth = 1
    while i < n and depth:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j == -1 else j
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i)
            i = n if j == -1 else j + 2
            continue
        if c == "`":
            j = src.find("`", i + 1)
            i = n if j == -1 else j + 1
            continue
        if c == '"':
            k = i + 1
            while k < n and src[k] != '"':
                if src[k] == "\\":
                    k += 1
                k += 1
            token = src[i + 1:k]
            j = k + 1
            while j < n and src[j] in " \t\n":
                j += 1
            if depth == 1 and j < n and src[j] == ":" and re.fullmatch(r"[a-z0-9_]+", token):
                j += 1
                while j < n and src[j] in " \t\n":
                    j += 1
                open_idx = src.find("{", j)
                comma_idx = src.find(",", j)
                if open_idx != -1 and (comma_idx == -1 or open_idx < comma_idx):
                    end_idx = _go_block_end(src, open_idx)
                    yield token, src[open_idx + 1:end_idx]
                    i = end_idx + 1
                    continue
            i = k + 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        i += 1


def _extract_tf_enum(cb):
    em = re.search(r"StringInSlice\(\s*\[\]string\{([^}]*)\}", cb)
    if em:
        return re.findall(r'"([^"]+)"', em.group(1))
    em = re.search(r"(?:string|int64)validator\.OneOf(?:CaseInsensitive)?\(([^)]*)\)", cb)
    if em and "..." not in em.group(1):
        strings = re.findall(r'"([^"]+)"', em.group(1))
        if strings:
            return strings
        numbers = re.findall(r"\b-?\d+\b", em.group(1))
        if numbers:
            return numbers
    return None


def extract_tf_framework_schema_fields(src):
    """Top-level Terraform Plugin Framework attributes/blocks -> TF field map.

    Only the resource's Schema method and its top-level Attributes / Blocks maps are
    scanned, so nested child Attributes cannot bleed into the resource surface.
    Helper-valued attributes and top-level nested blocks are present with unknown
    flags.
    """
    src = _tf_framework_schema_source(src)
    blocks = dict(_scan_value_blocks_depth1(src, _TF_FRAMEWORK_ATTR_MARKER))
    out = {}
    for key in _tf_top_level_keys(src, _TF_FRAMEWORK_ATTR_MARKER):
        block = blocks.get(key)
        if block is None:
            out[snake_to_camel(key)] = {"tf_key": key, "inline": False, "required": None,
                                        "optional": None, "computed": None, "enum": None}
            continue
        cb = _strip_go_comments(block)
        out[snake_to_camel(key)] = {
            "tf_key": key,
            "inline": True,
            "required": bool(re.search(r"\bRequired:\s*true", cb)),
            "optional": bool(re.search(r"\bOptional:\s*true", cb)),
            "computed": bool(re.search(r"\bComputed:\s*true", cb)),
            "enum": _extract_tf_enum(cb),
        }
    for key in _tf_top_level_keys(src, _TF_FRAMEWORK_BLOCK_MARKER):
        out.setdefault(snake_to_camel(key), {
            "tf_key": key,
            "inline": False,
            "required": None,
            "optional": None,
            "computed": None,
            "enum": None,
        })
    return out


def extract_tf_schema_fields(src):
    """Top-level TF schema keys -> {camel_key: {tf_key, inline, required, optional,
    computed, enum}}. Pure (takes source text). Helper-valued keys are recorded as
    present (inline=False) with unknown flags (None) — we don't resolve helper bodies,
    so we never claim a flag/enum divergence we can't see. Comments are stripped
    before flag/enum reads so commented-out attributes don't count."""
    src = _tf_resource_func_source(src)
    blocks = dict(_scan_blocks_depth1(src, _TF_MARKER))
    out = {}
    for key in _tf_top_level_keys(src):
        block = blocks.get(key)
        if block is None:
            out[snake_to_camel(key)] = {"tf_key": key, "inline": False, "required": None,
                                        "optional": None, "computed": None, "enum": None}
            continue
        cb = _strip_go_comments(_drop_nested_schema_maps(block))
        out[snake_to_camel(key)] = {
            "tf_key": key, "inline": True,
            "required": bool(re.search(r"\bRequired:\s*true", cb)),
            "optional": bool(re.search(r"\bOptional:\s*true", cb)),
            "computed": bool(re.search(r"\bComputed:\s*true", cb)),
            "enum": _extract_tf_enum(cb),
        }
    return out or extract_tf_framework_schema_fields(src)


# ---- Ansible module argument_spec extraction -------------------------------

_ANSIBLE_MODULE_ONLY_FIELDS = {"state"}


def ansible_category(t):
    if t in ("int", "float"):
        return "number"
    if t == "bool":
        return "boolean"
    if t == "list":
        return "array"
    if t in ("dict", "jsonarg"):
        return "object"
    return "string"


def _ansible_literal(node, names):
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, (ast.List, ast.Tuple)):
        return [_ansible_literal(x, names) for x in node.elts]
    if isinstance(node, ast.Name):
        return names.get(node.id)
    return None


def _ansible_dict(node, names):
    """Evaluate the static subset used by Ansible argument_spec declarations."""
    out = {}
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "dict":
        for kw in node.keywords:
            if kw.arg is not None:
                out[kw.arg] = _ansible_literal(kw.value, names)
        return out
    if isinstance(node, ast.Dict):
        for key, value in zip(node.keys, node.values, strict=False):
            k = _ansible_literal(key, names)
            if isinstance(k, str):
                out[k] = _ansible_literal(value, names)
        return out
    return out


def _ansible_top_level_choices(tree):
    names = {}
    for node in tree.body:
        if isinstance(node, ast.Assign):
            value = _ansible_literal(node.value, names)
            if isinstance(value, list) and all(isinstance(x, str) for x in value):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        names[target.id] = value
    return names


def _ansible_update_entries(call):
    entries = []
    for arg in call.args:
        if isinstance(arg, ast.Call) and isinstance(arg.func, ast.Name) and arg.func.id == "dict":
            entries.extend((kw.arg, kw.value) for kw in arg.keywords if kw.arg is not None)
        elif isinstance(arg, ast.Dict):
            entries.extend((k, v) for k, v in zip(arg.keys, arg.values, strict=False))
    entries.extend((kw.arg, kw.value) for kw in call.keywords if kw.arg is not None)
    return entries


def extract_ansible_argument_spec_fields(src):
    """Top-level Ansible argument_spec fields -> {camel_key: {ansible_key, type,
    category, required, enum}}. Pure (takes source text). Nested options= blocks
    are deliberately not traversed, so sub-options cannot bleed into the top-level
    API field comparison."""
    tree = ast.parse(src)
    names = _ansible_top_level_choices(tree)
    out = {}
    for node in ast.walk(tree):
        if not (
            isinstance(node, ast.Call)
            and isinstance(node.func, ast.Attribute)
            and node.func.attr == "update"
            and isinstance(node.func.value, ast.Name)
            and node.func.value.id == "argument_spec"
        ):
            continue
        for raw_key, spec_node in _ansible_update_entries(node):
            key = _ansible_literal(raw_key, names) if isinstance(raw_key, ast.AST) else raw_key
            if not isinstance(key, str) or key in _ANSIBLE_MODULE_ONLY_FIELDS:
                continue
            spec = _ansible_dict(spec_node, names)
            ansible_type = spec.get("type") or "str"
            enum = spec.get("choices")
            out[snake_to_camel(key)] = {
                "ansible_key": key,
                "type": ansible_type,
                "category": ansible_category(ansible_type),
                "required": bool(spec.get("required")),
                "enum": enum if isinstance(enum, list) else None,
            }
    return out


def extract_ansible_sdk_calls(src):
    calls = re.findall(r"\bclient\.([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)", src)
    return sorted({f"client.{service}.{method}" for service, method in calls})


def ansible_repo(path):
    if path.startswith("vendor/ziacloud-ansible/"):
        return "ziacloud-ansible"
    if path.startswith("vendor/zpacloud-ansible/"):
        return "zpacloud-ansible"
    return None


# ---- Python SDK model/service extraction -----------------------------------

_PYTHON_MODEL_ONLY_FIELDS = set()


def _ast_string(node):
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value
    return None


def _python_config_key(node):
    if not (isinstance(node, ast.Subscript) and isinstance(node.value, ast.Name) and node.value.id == "config"):
        return None
    return _ast_string(node.slice)


def _python_dict_top_level_keys(node):
    if not isinstance(node, ast.Dict):
        return []
    return [k.value for k in node.keys if isinstance(k, ast.Constant) and isinstance(k.value, str)]


def _python_value_category(node):
    if isinstance(node, (ast.List, ast.ListComp)):
        return "array"
    if isinstance(node, ast.Constant):
        if isinstance(node.value, bool):
            return "boolean"
        if isinstance(node.value, (int, float)):
            return "number"
        if isinstance(node.value, str):
            return "string"
    if isinstance(node, ast.Call):
        if isinstance(node.func, ast.Attribute) and node.func.attr == "form_list":
            return "array"
        return "object"
    return None


def _python_class(tree, class_name):
    return next((n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == class_name), None)


def extract_python_model_fields(src, class_name):
    """Top-level Python SDK model/request fields -> {wire_key: {category, source}}.
    Pure (takes source text). Only the named class is inspected, and request_format
    collection reads only top-level dict literals assigned/returned by that method,
    so nested helper model fields cannot bleed into the resource surface."""
    tree = ast.parse(src)
    cls = _python_class(tree, class_name)
    if cls is None:
        return {}
    fields = {}
    attr_category = {}

    for fn in (n for n in cls.body if isinstance(n, ast.FunctionDef) and n.name == "__init__"):
        for node in ast.walk(fn):
            key = _python_config_key(node)
            if isinstance(key, str) and key not in _PYTHON_MODEL_ONLY_FIELDS:
                fields.setdefault(key, {"category": None, "source": set()})["source"].add("config")
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Attribute) and isinstance(target.value, ast.Name) and target.value.id == "self":
                        category = _python_value_category(node.value)
                        if category:
                            attr_category[target.attr] = category

    for fn in (n for n in cls.body if isinstance(n, ast.FunctionDef) and n.name == "request_format"):
        for stmt in fn.body:
            dict_node = None
            if isinstance(stmt, ast.Assign) and isinstance(stmt.value, ast.Dict):
                dict_node = stmt.value
            elif isinstance(stmt, ast.Return) and isinstance(stmt.value, ast.Dict):
                dict_node = stmt.value
            if dict_node is None:
                continue
            for key, value in zip(dict_node.keys, dict_node.values, strict=False):
                wire_key = _ast_string(key)
                if not wire_key or wire_key in _PYTHON_MODEL_ONLY_FIELDS:
                    continue
                category = _python_value_category(value)
                if category is None and isinstance(value, ast.Attribute):
                    category = attr_category.get(value.attr)
                rec = fields.setdefault(wire_key, {"category": None, "source": set()})
                rec["source"].add("request_format")
                if category:
                    rec["category"] = category

    return {k: {"category": v["category"], "source": sorted(v["source"])} for k, v in fields.items()}


def _python_service_field_key(raw):
    if "_" in raw and not any(c.isupper() for c in raw):
        return snake_to_camel(raw)
    return raw


def extract_python_service_methods(src):
    tree = ast.parse(src)
    methods = []
    for cls in (n for n in tree.body if isinstance(n, ast.ClassDef)):
        for fn in (n for n in cls.body if isinstance(n, ast.FunctionDef)):
            if any(
                isinstance(node, ast.Call)
                and isinstance(node.func, ast.Attribute)
                and node.func.attr == "create_request"
                for node in ast.walk(fn)
            ):
                methods.append(fn.name)
    return sorted(set(methods))


def _python_direct_dicts(stmts):
    for stmt in stmts:
        if isinstance(stmt, ast.Assign) and isinstance(stmt.value, ast.Dict):
            yield stmt.value
        elif isinstance(stmt, ast.Return) and isinstance(stmt.value, ast.Dict):
            yield stmt.value
        elif isinstance(stmt, (ast.If, ast.For, ast.While, ast.With)):
            yield from _python_direct_dicts(stmt.body)
            yield from _python_direct_dicts(stmt.orelse)
        elif isinstance(stmt, ast.Try):
            yield from _python_direct_dicts(stmt.body)
            for handler in stmt.handlers:
                yield from _python_direct_dicts(handler.body)
            yield from _python_direct_dicts(stmt.orelse)
            yield from _python_direct_dicts(stmt.finalbody)


def extract_python_service_fields(src, method_names):
    """Top-level literal dict keys inside selected Python SDK service methods.
    This covers service-only wrappers that build request/response dictionaries but
    have no dedicated model class. The scan is method-scoped so sibling endpoints in
    large shared service files cannot pollute a resource's field surface."""
    wanted = set(method_names or [])
    if not wanted:
        return {}
    tree = ast.parse(src)
    fields = {}
    for cls in (n for n in tree.body if isinstance(n, ast.ClassDef)):
        for fn in (n for n in cls.body if isinstance(n, ast.FunctionDef) and n.name in wanted):
            for node in _python_direct_dicts(fn.body):
                for key in _python_dict_top_level_keys(node):
                    if key in _PYTHON_MODEL_ONLY_FIELDS:
                        continue
                    fields.setdefault(_python_service_field_key(key), {"category": None, "source": set()})[
                        "source"
                    ].add(fn.name)
    return {k: {"category": v["category"], "source": sorted(v["source"])} for k, v in fields.items()}


def python_repo(path):
    if path and path.startswith("vendor/zscaler-sdk-python/"):
        return "zscaler-sdk-python"
    return None


# ---- MCP tool extraction ----------------------------------------------------

_MCP_CONTROL_FIELDS = {
    "confirmed",
    "customer_id",
    "kwargs",
    "locale",
    "microtenant_id",
    "page",
    "page_size",
    "payload",
    "query",
    "query_params",
    "search",
    "service",
    "settings",
}
_MCP_BODY_NAMES = {"body", "payload"}
_MCP_WRITE_PREFIXES = ("add", "bulk_update", "create", "replace", "set", "update")
_MCP_REQUEST_FIELD_TOOL_PREFIXES = (
    "zia_create_",
    "zia_update_",
    "zia_add_",
    "zia_bulk_update_",
    "zpa_create_",
    "zpa_update_",
    "ztw_create_",
    "zcc_update_",
)


def _mcp_field_key(raw):
    if "_" in raw and not any(c.isupper() for c in raw):
        return snake_to_camel(raw)
    return raw


def _mcp_is_control_field(name, routing=()):
    return name in _MCP_CONTROL_FIELDS or _mcp_field_key(name) in routing


def _mcp_public_functions(tree):
    return {
        n.name: n
        for n in tree.body
        if isinstance(n, ast.FunctionDef) and not n.name.startswith("_")
    }


def extract_mcp_tool_functions(src):
    """Public MCP tool functions in a tool module."""
    return sorted(_mcp_public_functions(ast.parse(src)))


def _mcp_selected_functions(tree, method_names):
    public = _mcp_public_functions(tree)
    wanted = set(method_names or public)
    selected = {name: fn for name, fn in public.items() if name in wanted}
    helpers = {n.name: n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name.startswith("_")}
    helper_names = set()
    for fn in selected.values():
        for node in ast.walk(fn):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in helpers:
                helper_names.add(node.func.id)
    selected.update({name: helpers[name] for name in helper_names})
    return selected


def _mcp_attr_chain(node):
    if isinstance(node, ast.Name):
        return [node.id]
    if isinstance(node, ast.Attribute):
        chain = _mcp_attr_chain(node.value)
        return [*chain, node.attr] if chain else None
    return None


def _mcp_tool_input_model(fn):
    """Return the local name selected by ``@tool(input_model=...)``."""
    for decorator in fn.decorator_list:
        if not isinstance(decorator, ast.Call):
            continue
        chain = _mcp_attr_chain(decorator.func)
        if not chain or chain[-1] != "tool":
            continue
        for keyword in decorator.keywords:
            if keyword.arg != "input_model":
                continue
            model_chain = _mcp_attr_chain(keyword.value)
            return model_chain[-1] if model_chain else None
    return None


def _mcp_pydantic_field_alias(node):
    if node is None:
        return None
    for child in ast.walk(node):
        if not isinstance(child, ast.Call):
            continue
        chain = _mcp_attr_chain(child.func)
        if not chain or chain[-1] != "Field":
            continue
        aliases = {
            keyword.arg: keyword.value.value
            for keyword in child.keywords
            if keyword.arg in {"alias", "validation_alias"}
            and isinstance(keyword.value, ast.Constant)
            and isinstance(keyword.value.value, str)
        }
        if "validation_alias" in aliases:
            return aliases["validation_alias"]
        if "alias" in aliases:
            return aliases["alias"]
    return None


def _mcp_pydantic_model_fields(tree, model_name):
    """Top-level fields exposed by a local Pydantic input model.

    The v0.13.1 MCP layout wraps each tool in a single ``args`` parameter and
    declares the real agent-facing schema through ``@tool(input_model=...)``.
    Resolve local inheritance and string aliases without importing vendor code.
    """
    if not model_name:
        return {}
    classes = {node.name: node for node in tree.body if isinstance(node, ast.ClassDef)}
    resolved = {}
    visiting = set()

    def collect(name):
        if name in resolved:
            return resolved[name]
        cls = classes.get(name)
        if cls is None or name in visiting:
            return {}
        visiting.add(name)
        fields = {}
        for base in cls.bases:
            chain = _mcp_attr_chain(base)
            if chain and chain[-1] in classes:
                fields.update(collect(chain[-1]))
        for stmt in cls.body:
            if not isinstance(stmt, ast.AnnAssign) or not isinstance(stmt.target, ast.Name):
                continue
            raw_name = stmt.target.id
            if raw_name.startswith("_"):
                continue
            alias = _mcp_pydantic_field_alias(stmt.annotation)
            if alias is None:
                alias = _mcp_pydantic_field_alias(stmt.value)
            fields[raw_name] = alias or raw_name
        visiting.remove(name)
        resolved[name] = fields
        return fields

    return collect(model_name)


def _mcp_model_wrapper_args(fn, model_name):
    if not model_name:
        return set()
    wrappers = set()
    args = fn.args.args
    for arg in args:
        if arg.annotation is None:
            continue
        annotation_names = {
            chain[-1]
            for node in ast.walk(arg.annotation)
            if (chain := _mcp_attr_chain(node))
        }
        if model_name in annotation_names:
            wrappers.add(arg.arg)
    if not wrappers and len(args) == 1 and args[0].arg == "args":
        wrappers.add("args")
    return wrappers


def _mcp_wrapper_field(node, wrappers):
    if (
        isinstance(node, ast.Attribute)
        and isinstance(node.value, ast.Name)
        and node.value.id in wrappers
    ):
        return node.attr
    return None


def _mcp_wrapped_target_id(fn, wrappers):
    """Infer an update target ID from the first SDK write-call argument.

    This is the input-model equivalent of the legacy leading ``thing_id``
    parameter heuristic. It deliberately stops at the first non-control keyword
    so foreign-key body fields later in the call remain part of the field surface.
    """
    if not wrappers:
        return None
    for node in ast.walk(fn):
        if not isinstance(node, ast.Call) or not isinstance(node.func, ast.Attribute):
            continue
        chain = _mcp_attr_chain(node.func)
        if not chain or not chain[-1].startswith(("edit", "replace", "set", "update")):
            continue
        if node.args:
            candidate = _mcp_wrapper_field(node.args[0], wrappers)
            if candidate and candidate.endswith("_id"):
                return candidate
        for keyword in node.keywords:
            if keyword.arg is None:
                continue
            candidate = _mcp_wrapper_field(keyword.value, wrappers) or keyword.arg
            if candidate.endswith("_id"):
                return candidate
            if not _mcp_is_control_field(keyword.arg):
                break
    return None


def extract_mcp_sdk_calls(src, method_names=None):
    """SDK call chains from selected MCP tools, resolving local aliases such as
    `api = client.zpa.server_groups` so wrapper edges remain auditable."""
    tree = ast.parse(src)
    calls = set()
    for fn in _mcp_selected_functions(tree, method_names).values():
        aliases = {}
        for node in ast.walk(fn):
            if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
                chain = _mcp_attr_chain(node.value)
                if chain and chain[0] == "client":
                    aliases[node.targets[0].id] = chain
            elif isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
                chain = _mcp_attr_chain(node.func)
                if not chain:
                    continue
                if chain[0] == "client":
                    calls.add(".".join(chain))
                elif chain[0] in aliases:
                    calls.add(".".join([*aliases[chain[0]], *chain[1:]]))
    return sorted(calls)


def _mcp_literal_body_keys(fn, routing=()):
    keys = set()
    loop_vars = {}
    for node in ast.walk(fn):
        if isinstance(node, ast.Assign) and isinstance(node.value, ast.Dict):
            if any(isinstance(t, ast.Name) and t.id in _MCP_BODY_NAMES for t in node.targets):
                keys.update(k.value for k in node.value.keys if isinstance(k, ast.Constant) and isinstance(k.value, str))
        elif isinstance(node, ast.Assign):
            for target in node.targets:
                if (
                    isinstance(target, ast.Subscript)
                    and isinstance(target.value, ast.Name)
                    and target.value.id in _MCP_BODY_NAMES
                    and isinstance(target.slice, ast.Constant)
                    and isinstance(target.slice.value, str)
                ):
                    keys.add(target.slice.value)
        elif isinstance(node, ast.For) and isinstance(node.iter, (ast.List, ast.Tuple)):
            loop_key_var = None
            if isinstance(node.target, ast.Name):
                loop_key_var = node.target.id
            elif (
                isinstance(node.target, (ast.List, ast.Tuple))
                and node.target.elts
                and isinstance(node.target.elts[0], ast.Name)
            ):
                loop_key_var = node.target.elts[0].id
            values = []
            for elt in node.iter.elts:
                if isinstance(elt, (ast.List, ast.Tuple)) and elt.elts and isinstance(elt.elts[0], ast.Constant):
                    values.append(elt.elts[0].value)
            if loop_key_var and values:
                loop_vars[loop_key_var] = [v for v in values if isinstance(v, str)]
        elif isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
            chain = _mcp_attr_chain(node.func)
            if chain and chain[-1].startswith(_MCP_WRITE_PREFIXES):
                keys.update(kw.arg for kw in node.keywords if kw.arg and not _mcp_is_control_field(kw.arg, routing))

    for node in ast.walk(fn):
        if (
            isinstance(node, ast.Assign)
            and isinstance(node.targets[0] if node.targets else None, ast.Subscript)
            and isinstance(node.targets[0].value, ast.Name)
            and node.targets[0].value.id in _MCP_BODY_NAMES
            and isinstance(node.targets[0].slice, ast.Name)
            and node.targets[0].slice.id in loop_vars
        ):
            keys.update(loop_vars[node.targets[0].slice.id])
    return keys


def extract_mcp_request_fields(src, method_names=None, routing=()):
    """MCP write-tool request fields -> {camel_key: {mcp_key, source}}.

    This is intentionally presence-only. MCP wrappers encode agent-facing tool
    parameters and payload builders; they do not authoritatively encode API
    required/readonly/enum constraints the way Terraform/Ansible sometimes do.
    Read-only tools are therefore a present resource surface with zero field
    surface unless a selected write tool exposes request fields.
    """
    tree = ast.parse(src)
    fields = {}
    for name, fn in _mcp_selected_functions(tree, method_names).items():
        input_model = _mcp_tool_input_model(fn)
        model_fields = _mcp_pydantic_model_fields(tree, input_model)
        wrapper_args = _mcp_model_wrapper_args(fn, input_model)
        # A tool that operates on an EXISTING object (update/get/delete/edit/set/
        # replace) takes that object's own id as its leading parameter. The contract
        # models it as the generic `:id` path param, so it is absent from `routing`
        # and would otherwise be counted as a request-body field — and it reaches the
        # field set through several paths (the arg list, write-call kwargs, or a body
        # dict). Treat it as routing for THIS tool so it is dropped everywhere. The
        # `_id` guard leaves singleton updates (leading param is a real field) and all
        # create/list tools untouched; per-tool scope keeps a legitimate FK body field
        # of the same name on another tool (e.g. create) intact.
        fn_routing = set(routing)
        obj_ops = ("_update_", "_get_", "_delete_", "_edit_", "_set_", "_replace_")
        args = fn.args.args
        if any(op in name for op in obj_ops) and args and args[0].arg.endswith("_id"):
            fn_routing.add(_mcp_field_key(args[0].arg))
        wrapped_target = _mcp_wrapped_target_id(fn, wrapper_args)
        if any(op in name for op in obj_ops) and wrapped_target:
            fn_routing.add(_mcp_field_key(wrapped_target))
            if wrapped_target in model_fields:
                fn_routing.add(_mcp_field_key(model_fields[wrapped_target]))
        raw_keys = set()
        if name.startswith(_MCP_REQUEST_FIELD_TOOL_PREFIXES):
            raw_keys.update(
                arg.arg
                for arg in args
                if arg.arg not in wrapper_args
                and not _mcp_is_control_field(arg.arg, fn_routing)
            )
            raw_keys.update(model_fields.values())
        raw_keys.update(_mcp_literal_body_keys(fn, fn_routing))
        if "action" in raw_keys:
            raw_keys.discard("rule_action")
        for key in raw_keys:
            if not isinstance(key, str) or _mcp_is_control_field(key, fn_routing):
                continue
            fields.setdefault(_mcp_field_key(key), {"mcp_key": key, "source": set()})["source"].add(name)
    if "action" in fields and fields.get("ruleAction", {}).get("mcp_key") == "rule_action":
        fields.pop("ruleAction")
    return {k: {"mcp_key": v["mcp_key"], "source": sorted(v["source"])} for k, v in fields.items()}


def mcp_repo(path):
    if path and path.startswith("vendor/zscaler-mcp-server/"):
        return "zscaler-mcp-server"
    return None


# ---- contract type category ------------------------------------------------

def contract_category(t):
    if t is None:
        return None
    arr = t.endswith("[]")
    base = t[:-2] if arr else t
    alias = re.fullmatch(
        r"[A-Z][A-Za-z0-9_]* \((string|boolean|number|integer|int32|int64|object|float|double|long|byte|date|date-time)\)",
        base,
    )
    if alias:
        base = alias.group(1)
    if arr:
        return "array"
    if base in ("int32", "int64", "integer", "number", "float", "double", "long", "byte"):
        return "number"
    if base == "boolean":
        return "boolean"
    if base in ("string", "date", "date-time"):
        return "string"
    return "object"


def _generic_response_placeholder(field):
    """The parser represents bare primitive/object responses as a synthetic field
    named after the type (`object`, `string`, `integer`, ...). Those are response
    shapes, not API object fields, so they should not create presence drift when a
    write operation returns a generic wrapper while the read operation has the real
    schema."""
    name = field.get("name")
    return name in {"object", "string", "boolean", "integer", "number"} and contract_category(field.get("type")) == contract_category(name)


def _contract_top_level_name(field):
    """Project contract and blob-flattened fields to the resource
    field universe used by the reconciler.

    The durable Docusaurus snapshot includes both top-level fields and nested
    paths (`connectors[].id`, `[].active`, ...). Multi-surface reconciliation is
    still a top-level comparison, so keep `city` and list item roots like
    `[].active` -> `active`, but do not let nested child paths become
    client-missing-field divergences.
    """
    name = field.get("name")
    if not isinstance(name, str) or not name:
        return None
    top_name = field.get("top_name")
    if isinstance(top_name, str) and top_name and top_name != "$":
        normalized = name
        while normalized.startswith("[]."):
            normalized = normalized[3:]
        if normalized in {top_name, f"{top_name}[]"}:
            return top_name
        return None

    normalized = name
    while normalized.startswith("[]."):
        normalized = normalized[3:]
    if "." in normalized:
        return None
    if normalized.endswith("[]"):
        normalized = normalized[:-2]
    return normalized or None


def _contract_reconcile_field(field):
    """Return a contract field suitable for top-level reconciliation, or None."""
    if _generic_response_placeholder(field):
        return None
    name = _contract_top_level_name(field)
    if not name:
        return None
    projected = dict(field)
    projected["name"] = name
    return projected


DISPLAY_PATH_PREFIXES = {
    "zcc": "/zcc",
    "zcloudconnector": "/ztw/api/v1",
    "zia": "/zia/api/v1",
    "zpa": "/zpa",
}


def display_contract_path(product, path):
    """Human-facing product-relative path for generated reports.

    The Docusaurus operation object often stores the path relative to the
    product server (`/locations` with server `/zia/api/v1`). Matching should use
    the embedded path, but the report/worklist should keep the product prefix so
    operators do not have to infer which `/locations` or `/ipGroups` API is meant.
    """
    if not path:
        return path
    normalized = str(path)
    if not normalized.startswith("/"):
        normalized = "/" + normalized
    prefix = DISPLAY_PATH_PREFIXES.get(product)
    if prefix and normalized != prefix and not normalized.startswith(prefix + "/"):
        return prefix.rstrip("/") + normalized
    return normalized


# ---- registry --------------------------------------------------------------

ZPA_RESOURCES = [
    {"name": "app_connector_group", "group": "app-connector-group-management",
     "create": "adds-a-new-app-connector-group-for-the-specified-customer",
     "get": "gets-the-app-connector-group-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go", "AppConnectorGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/app_connector_groups.py", "AppConnectorGroup"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py",
                "methods": ["list_connector_groups", "get_connector_group", "add_connector_group", "update_connector_group"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_app_connector_groups.py"},
    {"name": "application_server", "group": "server-management",
     "create": "adds-a-new-server-for-the-specified-customer",
     "get": "gets-the-server-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/appservercontroller/zpa_app_server_controller.go", "ApplicationServer"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_app_server_controller.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/application_servers.py", "AppServers"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/servers.py",
                "methods": ["list_servers", "get_server", "add_server", "update_server"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_application_server.py"},
    {"name": "application_segment", "group": "application-segment-management",
     "create": "adds-a-new-application-segment-for-the-specified-customer",
     "get": "gets-the-application-segment-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go", "ApplicationSegmentResource"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py", "ApplicationSegments"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py",
                "methods": ["list_segments", "get_segment", "add_segment", "update_segment"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_application_segment.py"},
    {"name": "ba_certificate", "group": "certificate-management",
     "create": "adds-a-certificate-with-a-private-key-for-the-specified-customer",
     "get": "gets-the-certificate-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate.go", "BaCertificate"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_ba_certificate.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/certificates.py", "Certificate"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/certificates.py",
                "methods": ["list_certificates", "get_certificate", "add_certificate", "update_certificate"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_ba_certificate.py"},
    {"name": "emergency_access", "group": "emergency-access-management",
     "create": "add-emergency-access-user",
     "get": "get-emergency-access-user",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/emergencyaccess/emergencyaccess.go", "EmergencyAccess"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_emergency_access.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/emergency_access.py", "EmergencyAccessUser"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/emergency_access.py",
                "methods": ["list_users", "get_user", "add_user", "update_user"]}},
    {"name": "inspection_custom_control", "group": "appprotection-control-management",
     "create": "create-custom-control",
     "get": "get-custom-control-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_custom_controls/zpa_inspection_custom_controls.go", "InspectionCustomControl"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_inspection_custom_controls.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/app_protection_profile.py", "CustomControls"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/app_protection.py",
                "methods": ["list_custom_controls", "get_custom_control", "add_custom_control", "update_custom_control"]}},
    {"name": "inspection_profile", "group": "appprotection-profile-management",
     "create": "add-inspection-profile",
     "get": "get-inspection-profile",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go", "InspectionProfile"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_inspection_profile.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/app_protection_profile.py", "AppProtectionProfile"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/app_protection.py",
                "methods": ["list_profiles", "get_profile", "add_profile", "update_profile"]}},
    {"name": "lss_config", "group": "log-streaming-service-lss-configuration",
     "create": "add-a-new-lss-configuration-for-the-specified-customer",
     "get": "gets-the-lss-configuration-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go", "LSSResource"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py", "LSSResourceModel"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/lss.py",
                "methods": ["list_configs", "get_config", "add_lss_config", "update_lss_config"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_lss_config_controller.py"},
    {"name": "pra_approval", "group": "privileged-approval-management",
     "create": "add-privileged-approval",
     "get": "get-privileged-approval",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praapproval/praapproval.go", "PrivilegedApproval"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_pra_approval.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/pra_approval.py", "PrivilegedRemoteAccessApproval"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py",
                "methods": ["list_approval", "get_approval", "add_approval", "update_approval"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_pra_approval.py"},
    {"name": "pra_console", "group": "privileged-console-management",
     "create": "add-pra-console",
     "get": "get-pra-console",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praconsole/praconsole.go", "PRAConsole"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_pra_console_controller.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/pra_console.py", "PrivilegedRemoteAccessConsole"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/pra_console.py",
                "methods": ["list_consoles", "get_console", "add_console", "update_console"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_pra_console_controller.py"},
    {"name": "pra_credential", "group": "privileged-credential-management",
     "create": "add-credential",
     "get": "get-credential",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredential/credential_controller.go", "Credential"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_pra_credential_controller.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/pra_credential.py", "PrivilegedRemoteAccessCredential"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py",
                "methods": ["list_credentials", "get_credential", "add_credential", "update_credential"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_pra_credential_controller.py"},
    {"name": "pra_portal", "group": "privileged-portal-management",
     "create": "add",
     "get": "get-pra-portal",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praportal/praportal.go", "PRAPortal"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_pra_portal_controller.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/pra_portal.py", "PrivilegedRemoteAccessPortal"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/pra_portal.py",
                "methods": ["list_portals", "get_portal", "add_portal", "update_portal"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_pra_portal_controller.py"},
    {"name": "server_group", "group": "server-group-management",
     "create": "add-a-new-server-group",
     "get": "gets-the-server-group-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go", "ServerGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_server_group.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/server_group.py", "ServerGroup"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py",
                "methods": ["list_groups", "get_group", "add_group", "update_group"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_server_group.py"},
    {"name": "segment_group", "group": "segment-group-management",
     "create": "adds-a-new-segment-group-for-the-specified-customer",
     "get": "gets-the-segment-group-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/segmentgroup/zpa_segment_group.go", "SegmentGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_segment_group.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/segment_group.py", "SegmentGroup"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/segment_groups.py",
                "methods": ["list_groups", "get_group", "add_group", "update_group"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_segment_group.py"},
    {"name": "provisioning_key", "group": "provisioning-key-management",
     "create": "adds-a-new-provisioning-key-for-the-specified-customer",
     "get": "gets-details-of-the-provisioning-key-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go", "ProvisioningKey"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_provisioning_key.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py", "ProvisioningKey"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py",
                "methods": ["list_provisioning_keys", "get_provisioning_key", "add_provisioning_key",
                            "update_provisioning_key"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_provisioning_key.py"},
    {"name": "service_edge_group", "group": "private-service-edge-group-management",
     "create": "add-private-broker-group",
     "get": "get-private-broker-group",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgegroup/zpa_service_edge_group.go", "ServiceEdgeGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zpa/models/service_edge_groups.py", "ServiceEdgeGroup"),
                "service": "vendor/zscaler-sdk-python/zscaler/zpa/service_edge_group.py",
                "methods": ["list_service_edge_groups", "get_service_edge_group", "add_service_edge_group",
                            "update_service_edge_group"]},
     "ansible": "vendor/zpacloud-ansible/plugins/modules/zpa_service_edge_groups.py"},
]

ZIA_RESOURCES = [
    {"name": "advanced_settings", "group": "advanced-settings",
     "update": "advanced-settings-resource-update-advanced-settings",
     "get": "advanced-settings-resource-get-advanced-settings",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/advanced_settings/advanced_settings.go", "AdvancedSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_advanced_settings.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/advanced_settings.py", "AdvancedSettings"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/advanced_settings.py",
                "methods": ["get_advanced_settings", "update_advanced_settings"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_advanced_settings.py"},
    {"name": "advanced_threat_settings", "group": "advanced-threat-protection-policy",
     "update": "cyber-threat-protection-resource-update-config",
     "get": "cyber-threat-protection-resource-get-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/advancedthreatsettings/advancedthreatsettings.go", "AdvancedThreatSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_settings.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/advanced_threat_settings.py",
                          "AdvancedThreatProtectionSettings"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/atp_policy.py",
                "methods": ["get_atp_settings", "update_atp_settings"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_atp_settings.py"},
    {"name": "admin_role", "group": "admin-role-management",
     "create": "admin-role-resource-add-role",
     "get": "admin-role-resource-get-role",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/adminuserrolemgmt/roles/adminroles.go", "AdminRoles"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_admin_roles.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/admin_roles.py", "AdminRoles"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/admin_roles.py",
                "methods": ["list_roles", "get_role", "add_role", "update_role"]}},
    {"name": "alerts", "group": "alerts",
     "create": "alert-subscription-resource-add-alert-subscription",
     "get": "alert-subscription-resource-get-alert-subscription",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/alerts/alerts.go", "AlertSubscriptions"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_alerts.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/alert_subscriptions.py", "AlertSubscriptions"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/alert_subscriptions.py",
                "methods": ["list_alert_subscriptions", "get_alert_subscription", "add_alert_subscription",
                            "update_alert_subscription"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_alerts.py"},
    {"name": "atp_malicious_urls", "group": "advanced-threat-protection-policy",
     "update": "cyber-threat-protection-resource-update-malicious-urls",
     "get": "cyber-threat-protection-resource-get-malicious-urls",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/advancedthreatsettings/advancedthreatsettings.go", "MaliciousURLs"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malicious_urls.go",
     "python": {"service": "vendor/zscaler-sdk-python/zscaler/zia/atp_policy.py",
                "methods": ["get_atp_malicious_urls", "add_atp_malicious_urls"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_atp_malicious_urls.py"},
    {"name": "atp_malware_inspection", "group": "malware-protection-policy",
     "update": "cyber-threat-protection-resource-update-atp-malware-inspection-config",
     "get": "cyber-threat-protection-resource-get-atp-malware-inspection-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/malware_protection/malware_protection.go", "ATPMalwareInspection"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malware_inspection.go",
     "python": {"service": "vendor/zscaler-sdk-python/zscaler/zia/malware_protection_policy.py",
                "methods": ["get_atp_malware_inspection", "update_atp_malware_inspection"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_atp_malware_inspection.py"},
    {"name": "atp_malware_policy", "group": "malware-protection-policy",
     "update": "cyber-threat-protection-resource-update-malware-policy-config",
     "get": "cyber-threat-protection-resource-get-malware-policy-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/malware_protection/malware_protection.go", "MalwarePolicy"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malware_policy.go",
     "python": {"service": "vendor/zscaler-sdk-python/zscaler/zia/malware_protection_policy.py",
                "methods": ["get_atp_malware_policy", "update_atp_malware_policy"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_atp_malware_policy.py"},
    {"name": "atp_malware_protocols", "group": "malware-protection-policy",
     "update": "cyber-threat-protection-resource-update-atp-malware-protocols-config",
     "get": "cyber-threat-protection-resource-get-atp-malware-protocols-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/malware_protection/malware_protection.go", "ATPMalwareProtocols"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malware_protocols.go",
     "python": {"service": "vendor/zscaler-sdk-python/zscaler/zia/malware_protection_policy.py",
                "methods": ["get_atp_malware_protocols", "update_atp_malware_protocols"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_atp_malware_protocols.py"},
    {"name": "atp_malware_settings", "group": "malware-protection-policy",
     "get": "cyber-threat-protection-resource-get-malware-settings-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/malware_protection/malware_protection.go", "MalwareSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malware_settings.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/malware_protection_settings.py", "MalwareSettings"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/malware_protection_policy.py",
                "methods": ["get_malware_settings", "update_malware_settings"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_atp_malware_settings.py"},
    {"name": "atp_security_exceptions", "group": "advanced-threat-protection-policy",
     "update": "cyber-threat-protection-resource-update-security-exceptions",
     "get": "cyber-threat-protection-resource-get-security-exceptions",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/advancedthreatsettings/advancedthreatsettings.go", "SecurityExceptions"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_security_exceptions.go",
     "python": {"service": "vendor/zscaler-sdk-python/zscaler/zia/atp_policy.py",
                "methods": ["get_atp_security_exceptions", "update_atp_security_exceptions"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_atp_security_exceptions.py"},
    {"name": "auth_settings_urls", "group": "user-authentication-settings",
     "update": "update-auth-exempted-urls",
     "get": "get-auth-exempted-urls",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/user_authentication_settings/user_authentication_settings.go", "ExemptedUrls"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_auth_settings_urls.go",
     "python": {"service": "vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py",
                "methods": ["get_exempted_urls", "add_urls_to_exempt_list"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_auth_settings_urls.py"},
    {"name": "bandwidth_class", "group": "bandwidth-control-classes",
     "create": "bandwidth-class-resource-add-bandwidth-class",
     "get": "bandwidth-class-resource-get-bandwidth-class",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/bandwidth_control/bandwidth_classes/bandwidth_classes.go", "BandwidthClasses"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_bandwidth_classes.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/bandwidth_classes.py", "BandwidthClasses"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/bandwidth_classes.py",
                "methods": ["list_classes", "get_class", "add_class", "update_class"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_bandwidth_classes.py"},
    {"name": "bandwidth_control_rule", "group": "bandwidth-control-classes",
     "create": "bandwidth-control-rule-resource-add-rule",
     "get": "bandwidth-control-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/bandwidth_control/bandwidth_control_rules/bandwidth_control_rules.go", "BandwidthControlRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_bandwidth_control_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/bandwidth_control_rules.py", "BandwidthControlRules"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/bandwidth_control_rules.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_bandwidth_control_rules.py"},
    {"name": "casb_dlp_rule", "group": "saas-security-api",
     "create": "casb-dlp-rule-resource-add-rule",
     "get": "casb-dlp-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/saas_security_api/casb_dlp_rules/casb_dlp_rules.go", "CasbDLPRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_casb_dlp_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/casb_dlp_rules.py", "CasbdDlpRules"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/casb_dlp_rules.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_casb_dlp_rules.py"},
    {"name": "casb_malware_rule", "group": "saas-security-api",
     "create": "casb-malware-rule-resource-add-rule",
     "get": "casb-malware-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/saas_security_api/casb_malware_rules/casb_malware_rules.go", "CasbMalwareRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_casb_malware_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/casb_malware_rules.py", "CasbMalwareRules"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/casb_malware_rules.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_casb_malware_rules.py"},
    {"name": "cloud_app_control_rule", "group": "cloud-app-control-policy",
     "create": "web-application-rule-resource-add-rule",
     "get": "web-application-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go", "WebApplicationRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_cloud_app_control_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py", "CloudApplicationControl"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_cloud_app_control_rules.py"},
    {"name": "browser_control_policy", "group": "browser-control-policy",
     "update": "browser-control-settings-resource-update-config",
     "get": "browser-control-settings-resource-get-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/browser_control_settings/browser_control_settings.go", "BrowserControlSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/browser_control_settings.py", "BrowserControlSettings"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/browser_control_settings.py",
                "methods": ["get_browser_control_settings", "update_browser_control_settings"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_browser_control_policy.py"},
    {"name": "custom_file_type", "group": "file-type-control-policy",
     "create": "custom-file-type-resource-create-custom-file-type",
     "get": "custom-file-type-resource-get-custom-file-type-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/filetypecontrol/custom_file_types/custom_file_types.go", "CustomFileTypes"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_custom_file_types.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/custom_file_types.py", "CustomFileTypes"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/custom_file_types.py",
                "methods": ["list_custom_file_types", "get_custom_file_tytpe", "add_custom_file_type",
                            "update_custom_file_type"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_custom_file_types.py"},
    {"name": "dc_exclusion", "group": "traffic-forwarding",
     "create": "tenant-dc-exclusion-resource-create-datacenter-exclusions",
     "get": "tenant-dc-exclusion-resource-get-datacenter-exclusions",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/dc_exclusions/dc_exclusions.go", "DCExclusions"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_dc_exclusions.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/traffic_dc_exclusions.py", "TrafficDcExclusions"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/traffic_datacenters.py",
                "methods": ["list_datacenters"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_dc_exclusions.py"},
    {"name": "dlp_dictionary", "group": "data-loss-prevention",
     "create": "dlp-dictionary-resource-add-custom-dlp-dictionary",
     "get": "dlp-dictionary-resource-get-dlp-dictionary-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlpdictionaries/dlpdictionaries.go", "DlpDictionary"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_dlp_dictionaries.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/dlp_dictionary.py", "DLPDictionary"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/dlp_dictionary.py",
                "methods": ["list_dicts", "get_dict", "add_dict", "update_dict"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_dlp_dictionaries.py"},
    {"name": "dlp_engine", "group": "data-loss-prevention",
     "create": "dlp-engine-resource-add-custom-dlp-engine",
     "get": "dlp-engine-resource-get-dlp-engine-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_engines/dlp_engines.go", "DLPEngines"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_dlp_engines.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/dlp_engine.py", "DLPEngine"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/dlp_engine.py",
                "methods": ["list_dlp_engines", "get_dlp_engines", "add_dlp_engine", "update_dlp_engine"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_dlp_engine.py"},
    {"name": "dlp_notification_template", "group": "data-loss-prevention",
     "create": "dlp-notification-template-resource-addtemplate",
     "get": "dlp-notification-template-resource-get-template-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_notification_templates/dlp_notification_templates.go", "DlpNotificationTemplates"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_dlp_notification_templates.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/dlp_templates.py", "DLPTemplates"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/dlp_templates.py",
                "methods": ["list_dlp_templates", "get_dlp_templates", "add_dlp_template", "update_dlp_template"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_dlp_notification_template.py"},
    {"name": "end_user_notification", "group": "end-user-notifications",
     "update": "end-user-notification-resource-update-eun-details",
     "get": "end-user-notification-resource-get-eun-details",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/end_user_notification/end_user_notification.go", "UserNotificationSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_end_user_notification.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/endusernotification.py", "EndUserNotification"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/end_user_notification.py",
                "methods": ["get_eun_settings", "update_eun_settings"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_end_user_notification.py"},
    {"name": "extranet", "group": "traffic-forwarding",
     "create": "extranet-resource-add-extranet",
     "get": "extranet-resource-get-extranet-with-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/extranet/extranet.go", "Extranet"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_extranet.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/traffic_extranet.py", "TrafficExtranet"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/traffic_extranet.py",
                "methods": ["list_extranets", "get_extranet", "add_extranet", "update_extranet"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_extranet.py"},
    {"name": "file_type_rule", "group": "file-type-control-policy",
     "create": "file-type-rule-resource-add-rule",
     "get": "file-type-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/filetypecontrol/filetypecontrol.go", "FileTypeRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_file_type_control_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/filetyperules.py", "FileTypeControlRules"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_file_type_control_rules.py"},
    {"name": "firewall_dns_rule", "group": "dns-control-policy",
     "create": "firewall-dns-rules-resource-create-firewall-dns-rule",
     "get": "firewall-dns-rules-resource-get-firewall-dns-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go", "FirewallDNSRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_firewall_dns_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_dns_rules.py", "FirewallDNSRules"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_dns_rules.py"},
    {"name": "firewall_filtering_rule", "group": "firewall-policies",
     "create": "firewall-filtering-rules-resource-create-firewall-filtering-rule",
     "get": "firewall-filtering-rules-resource-get-firewall-filtering-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/filteringrules/filteringrules.go", "FirewallFilteringRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_rules.py", "FirewallRule"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_rules.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_rule.py"},
    {"name": "firewall_ips_rule", "group": "ips-control-policy",
     "create": "firewall-ips-rules-resource-create-firewall-ips-rule",
     "get": "firewall-ips-rules-resource-get-firewall-ips-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/ips_control_policies/ips_policies/ips_policies.go", "FirewallIPSRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_firewall_ips_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_ips_rules.py", "FirewallIPSrules"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_ips.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_ips_rules.py"},
    {"name": "forwarding_rule", "group": "forwarding-control-policy",
     "create": "forwarding-rules-resource-create-forwarding-rule",
     "get": "forwarding-rules-resource-get-forwarding-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/forwarding_control_policy/forwarding_rules/forwarding_rules.go", "ForwardingRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_forwarding_control_rule.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/forwarding_control_policy.py",
                          "ForwardingControlRule"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/forwarding_control.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_forwarding_control_rule.py"},
    {"name": "ftp_control_policy", "group": "ftp-control-policy",
     "update": "ftp-settings-resource-update-ftp-settings",
     "get": "ftp-settings-resource-get-ftp-settings",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/ftp_control_policy/ftp_control_policy.go", "FTPControlPolicy"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_ftp_control_policy.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/ftp_control_policy.py", "FTPControlPolicy"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/ftp_control_policy.py",
                "methods": ["get_ftp_settings", "update_ftp_settings"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_ftp_control_policy.py"},
    {"name": "gre_tunnel", "group": "traffic-forwarding",
     "create": "gre-tunnel-resource-add-gre-tunnel",
     "get": "gre-tunnel-resource-get-gre-tunel-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/gretunnels/gretunnels.go", "GreTunnels"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_gre_tunnels.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/gre_tunnels.py", "TrafficGRETunnel"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/gre_tunnel.py",
                "methods": ["list_gre_tunnels", "get_gre_tunnel", "add_gre_tunnel", "update_gre_tunnel"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_traffic_forwarding_gre_tunnels.py"},
    {"name": "ip_destination_group", "group": "firewall-policies",
     "create": "ip-destination-group-resource-add-destination-ip-group",
     "get": "ip-destination-group-resource-get-destination-ip-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go", "IPDestinationGroups"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_ip_destination_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_destination_groups.py",
                          "IPDestinationGroups"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py",
                "methods": ["list_ip_destination_groups", "get_ip_destination_group", "add_ip_destination_group",
                            "update_ip_destination_group"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_ip_destination_groups.py"},
    {"name": "ip_source_group", "group": "firewall-policies",
     "create": "ip-source-group-resource-add-source-ip-group",
     "get": "ip-source-group-resource-get-source-ip-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipsourcegroups/ipsourcegroups.go", "IPSourceGroups"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_ip_source_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_source_groups.py", "IPSourceGroup"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py",
                "methods": ["list_ip_source_groups", "get_ip_source_group", "add_ip_source_group",
                            "update_ip_source_group"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_ip_source_groups.py"},
    {"name": "location", "group": "location-management",
     "create": "add-location",
     "get": "get-location",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/location/locationmanagement/locationmanagement.go", "Locations"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_location_management.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/location_management.py", "LocationManagement"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/locations.py",
                "methods": ["list_locations", "get_location", "add_location", "update_location"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_location_management.py"},
    {"name": "network_application_group", "group": "firewall-policies",
     "create": "network-application-group-resource-create-network-application-group",
     "get": "network-application-group-resource-get-network-application-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkapplicationgroups/networkapplicationgroups.go", "NetworkApplicationGroups"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_network_application_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_application_groups.py",
                          "NetworkApplicationGroups"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py",
                "methods": ["list_network_app_groups", "get_network_app_group", "add_network_app_group",
                            "update_network_app_group"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_network_application_group.py"},
    {"name": "network_service", "group": "firewall-policies",
     "create": "network-service-resource-add-custom-network-service",
     "get": "network-service-resource-get-network-service-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go", "NetworkServices"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_network_services.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py", "NetworkServices"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py",
                "methods": ["list_network_services", "get_network_service", "add_network_service",
                            "update_network_service"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_network_services.py"},
    {"name": "network_service_group", "group": "firewall-policies",
     "create": "network-service-group-resource-add-custom-network-service-group",
     "get": "network-service-group-resource-get-network-service-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservicegroups/networkservicegroups.go", "NetworkServiceGroups"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_network_services_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service_groups.py",
                          "NetworkServiceGroups"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py",
                "methods": ["list_network_svc_groups", "get_network_svc_group", "add_network_svc_group",
                            "update_network_svc_group"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_cloud_firewall_network_services_groups.py"},
    {"name": "nat_control_rule", "group": "nat-control-policy",
     "create": "dnat-rule-resource-add-rule",
     "get": "dnat-rule-resource-update-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/nat_control_policies/nat_control_policies.go", "NatControlPolicies"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_nat_control_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/nat_control_policy.py", "NatControlPolicy"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_nat_control_policy.py"},
    {"name": "mobile_malware_protection_policy", "group": "mobile-malware-protection-policy",
     "update": "mobile-malware-protection-resource-update-mobile-malware-protection-config",
     "get": "mobile-malware-protection-resource-get-mobile-malware-protection-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/mobile_threat_settings/mobile_threat_settings.go", "MobileAdvanceThreatSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_mobile_malware_protection_policy.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/mobile_threat_settings.py",
                          "MobileAdvancedThreatSettings"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/mobile_threat_settings.py",
                "methods": ["get_mobile_advanced_settings", "update_mobile_advanced_settings"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_mobile_advanced_threat_settings.py"},
    {"name": "nss_server", "group": "cloud-nanolog-streaming-service-nss",
     "create": "nss-resource-add-nss-server",
     "get": "nss-resource-get-nss-server",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/cloudnss/nss_servers/nss_servers.go", "NSSServers"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_nss_server.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/nss_servers.py", "Nssservers"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/nss_servers.py",
                "methods": ["list_nss_servers", "get_nss_server", "add_nss_server", "update_nss_server"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_nss_servers.py"},
    {"name": "proxy", "group": "forwarding-control-policy",
     "create": "proxy-resource-add-proxy",
     "get": "proxy-resource-get-proxy-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/forwarding_control_policy/proxies/proxies.go", "Proxies"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_forwarding_control_proxies.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/proxies.py", "Proxies"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/proxies.py",
                "methods": ["list_proxies", "get_proxy", "add_proxy", "update_proxy"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_third_party_proxy_service.py"},
    {"name": "risk_profile", "group": "cloud-applications",
     "create": "cloud-application-risk-profile-resource-add-risk-profile",
     "get": "cloud-application-risk-profile-resource-get-risk-profile-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/cloudapplications/risk_profiles/risk_profiles.go", "RiskProfiles"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_risk_profiles.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/risk_profiles.py", "RiskProfiles"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/risk_profiles.py",
                "methods": ["list_risk_profiles", "get_risk_profile", "add_risk_profile", "update_risk_profile"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_risk_profiles.py"},
    {"name": "rule_label", "group": "rule-labels",
     "create": "rule-label-resource-add-rule-label",
     "get": "rule-label-resource-get-rule-label-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/rule_labels/rule_labels.go", "RuleLabels"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_rule_labels.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/rule_labels.py", "RuleLabels"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/rule_labels.py",
                "methods": ["list_labels", "get_label", "add_label", "update_label"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_rule_labels.py"},
    {"name": "sandbox_rule", "group": "sandbox-policy-settings",
     "create": "ba-rule-resource-add-rule",
     "get": "ba-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/sandbox/sandbox_rules/sandbox_rules.go", "SandboxRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_sandbox_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/sandboxrules.py", "SandboxRules"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/sandbox_rules.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_sandbox_rules.py"},
    {"name": "security_policy_settings", "group": "security-policy-settings",
     "update": "create-whitelist",
     "extra_updates": ["manage-blacklist"],
     "get": "get-config",
     "extra_gets": ["get-advanced-policy"],
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/security_policy_settings/security_policy_settings.go", "ListUrls"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_security_policy_settings.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/security_policy_settings.py",
                          "SecurityPolicySettings"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/security_policy_settings.py",
                "methods": ["get_whitelist", "get_blacklist", "replace_whitelist", "replace_blacklist"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_security_policy_settings.py"},
    {"name": "ssl_inspection_rule", "group": "ssl-inspection-policy",
     "create": "ssl-inspection-rule-resource-add-ssl-inspection-rule",
     "get": "ssl-inspection-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/sslinspection/sslinspection.go", "SSLInspectionRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_ssl_inspection_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/ssl_inspection_rules.py", "SSLInspectionRules"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/ssl_inspection_rules.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_ssl_inspection_rules.py"},
    {"name": "static_ip", "group": "traffic-forwarding",
     "create": "static-ip-resource-add-static-ip",
     "get": "static-ip-resource-get-static-ip-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/staticips/staticips.go", "StaticIP"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_static_ips.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/traffic_static_ip.py", "TrafficStaticIP"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/traffic_static_ip.py",
                "methods": ["list_static_ips", "get_static_ip", "add_static_ip", "update_static_ip"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_traffic_forwarding_static_ip.py"},
    {"name": "url_category", "group": "url-categories",
     "create": "add-custom-category",
     "get": "get-url-categories",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/urlcategories/urlcategories.go", "URLCategory"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_url_categories.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/urlcategory.py", "URLCategory"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/url_categories.py",
                "methods": ["list_categories", "get_category", "add_url_category", "update_url_category"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_url_categories.py"},
    {"name": "url_filtering_and_cloud_app_settings", "group": "url-cloud-app-control-policy-settings",
     "update": "advanced-url-filtering-cloud-app-resource-update-advanced-url-filt-options",
     "get": "advanced-url-filtering-cloud-app-resource-get-advanced-url-filt-options",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go", "URLAdvancedPolicySettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_url_filtering_and_cloud_app_settings.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/url_filter_cloud_app_settings.py",
                          "AdvancedUrlFilterAndCloudAppSettings"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py",
                "methods": ["get_url_and_app_settings", "update_url_and_app_settings"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_url_filtering_and_cloud_app_settings.py"},
    {"name": "user", "group": "user-management",
     "create": "add-user",
     "get": "get-user",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/usermanagement/users/users.go", "Users"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_user_management_users.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/user_management.py", "UserManagement"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/user_management.py",
                "methods": ["list_users", "get_user", "add_user", "update_user"]}},
    {"name": "url_filtering_rule", "group": "url-filtering-policy",
     "create": "add-rule",
     "get": "get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go", "URLFilteringRule"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_url_filtering_rules.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/url_filtering_rules.py", "URLFilteringRule"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py",
                "methods": ["list_rules", "get_rule", "add_rule", "update_rule"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_url_filtering_rules.py"},
    {"name": "vpn_credential", "group": "traffic-forwarding",
     "create": "add-vpn-credential",
     "get": "get-vpn-credential",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/vpncredentials/vpncredentials.go", "VPNCredentials"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_vpn_credentials.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/traffic_vpn_credentials.py",
                          "TrafficVPNCredentials"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/traffic_vpn_credentials.py",
                "methods": ["list_vpn_credentials", "get_vpn_credential", "add_vpn_credential",
                            "update_vpn_credential"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_traffic_forwarding_vpn_credentials.py"},
    {"name": "workload_group", "group": "workload-groups",
     "create": "workload-group-resource-add-workload-group",
     "get": "workload-group-resource-get-workload-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go", "WorkloadGroup"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_workload_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/workload_groups.py", "WorkloadGroups"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/workload_groups.py",
                "methods": ["list_groups", "get_group", "add_group", "update_group"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_workload_groups.py"},
    {"name": "zpa_gateway", "group": "forwarding-control-policy",
     "create": "zpa-gateway-resource-add-zpa-gateway",
     "get": "zpa-gateway-resource-get-zpa-gateway-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/forwarding_control_policy/zpa_gateways/zpa_gateways.go", "ZPAGateways"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_forwarding_control_zpa_gateway.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zia/models/zpa_gateway.py", "ZPAGateway"),
                "service": "vendor/zscaler-sdk-python/zscaler/zia/zpa_gateway.py",
                "methods": ["list_gateways", "get_gateway", "add_gateway", "update_gateway"]},
     "ansible": "vendor/ziacloud-ansible/plugins/modules/zia_ip_source_anchoring_zpa_gateway.py"},
]

ZCC_RESOURCES = [
    {"name": "device_cleanup", "group": "public-api-controller",
     "update": "adds-or-updates-the-configuration-for-device-cleanup",
     "get": "gets-the-configuration-for-device-cleanup",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zcc/services/devices/devices.go", "DeviceCleanupInfo"),
     "tf": "vendor/terraform-provider-zcc/internal/framework/resources/device_cleanup.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py", "SetDeviceCleanupInfo"),
                "service": "vendor/zscaler-sdk-python/zscaler/zcc/devices.py",
                "methods": ["get_device_cleanup_info", "update_device_cleanup_info"]}},
    {"name": "failopen_policy", "group": "public-api-controller",
     "update": "updates-a-specific-fail-open-policy-for-the-company",
     "get": "gets-the-list-of-fail-open-policies-for-the-company",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zcc/services/failopen_policy/failopen_policy.go", "WebFailOpenPolicy"),
     "tf": "vendor/terraform-provider-zcc/internal/framework/resources/failopen_policy.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zcc/models/failopenpolicy.py", "FailOpenPolicy"),
                "service": "vendor/zscaler-sdk-python/zscaler/zcc/fail_open_policy.py",
                "methods": ["list_by_company", "update_failopen_policy"]}},
    {"name": "forwarding_profile", "group": "public-api-controller",
     "create": "updates-a-forwarding-profile",
     "get": "gets-the-list-of-forwarding-profiles-by-company",
     "go": ("vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go",
            "ForwardingProfile"),
     "tf": "vendor/terraform-provider-zcc/internal/framework/resources/forwarding_profile.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py",
                          "ForwardingProfile"),
                "service": "vendor/zscaler-sdk-python/zscaler/zcc/forwarding_profile.py",
                "methods": ["list_by_company", "update_forwarding_profile"]}},
    {"name": "web_privacy", "group": "public-api-controller",
     "update": "adds-or-updates-the-configuration-information-for-end-user-and-device-related-pii",
     "get": "gets-the-configuration-information-for-end-user-and-device-related-pii",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zcc/services/web_privacy/web_privacy.go", "WebPrivacyInfo"),
     "tf": "vendor/terraform-provider-zcc/internal/framework/resources/web_privacy.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py", "WebPrivacy"),
                "service": "vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py",
                "methods": ["get_web_privacy", "set_web_privacy_info"]}},
]

ZCC_SCOPE_NOTES = [
    "`zcc_trusted_network` is not reconciled here because Terraform uses the Go SDK v2 trusted-network API "
    "(`/zcc/papi/public/v2/trusted-networks`) while the captured Automate contract currently exposes only the "
    "older v1 `webTrustedNetwork` operations.",
    "`zcc_notification_template` and `zcc_zia_posture` are Terraform Plugin Framework resources, but no matching "
    "captured Automate contract operations are present in `zcc-api-reference.json`.",
]

ZTW_RESOURCES = [
    {"name": "activation_status", "group": "activation",
     "update": "ec-activate-z-resource-activate",
     "get": "ec-activate-z-resource-get-org-edit-activate-status",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/activation/activation.go", "ECAdminActivation"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_activation_status.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/activation.py", "Activation"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/activation.py",
                "methods": ["activate", "get_status"]}},
    {"name": "account_group", "group": "partner-integrations",
     "create": "aws-account-group-z-resource-create-account-group",
     "get": "aws-account-group-z-resource-get-account-group-by-id",
     "update": "aws-account-group-z-resource-update-account-group",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/account_groups/account_groups.go",
            "AccountGroups"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_account_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/account_groups.py", "AccountGroups"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/account_groups.py",
                "methods": ["list_account_groups", "get_account_group", "add_account_group", "update_account_group"]}},
    {"name": "dns_forwarding_gateway", "group": "dns-gateway",
     "create": "ec-dns-gateway-z-resource-add-dns-gateway",
     "get": "ec-dns-gateway-z-resource-get-gateway-by-id",
     "update": "ec-dns-gateway-z-resource-update-dns-gateway",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/dns_forwarding_gateway/"
            "dns_forwarding_gateway.go", "DNSGateway"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_dns_forwarding_gateway.go"},
    {"name": "dns_gateway", "group": "dns-gateway",
     "create": "ec-dns-gateway-z-resource-add-dns-gateway",
     "get": "ec-dns-gateway-z-resource-get-gateway-by-id",
     "update": "ec-dns-gateway-z-resource-update-dns-gateway",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/dns_gateway/dns_gateway.go", "DNSGateway"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_dns_gateway.go"},
    {"name": "forwarding_gateway", "group": "forwarding-gateways",
     "create": "ec-gateway-z-resource-add-gateway",
     "get": "ec-gateway-z-resource-get-gateway-by-id",
     "update": "ec-gateway-z-resource-edit-gateway",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/zia_forwarding_gateway/"
            "zia_forwarding_gateway.go", "ECGateway"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_forwarding_gateway.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/forwarding_gateways.py",
                          "ForwardingGateways"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/forwarding_gateways.py",
                "methods": ["list_gateways", "list_gateway_lite", "add_gateway"]}},
    {"name": "ip_destination_group", "group": "policy-resources",
     "create": "ip-destination-group-z-resource-add-destination-ip-group",
     "get": "ip-destination-group-z-resource-get-destination-ip-group-by-id",
     "update": "ip-destination-group-z-resource-edit-destination-ip-group",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/ipdestinationgroups/"
            "ipdestinationgroups.go", "IPDestinationGroups"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_ip_destination_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/ip_destination_groups.py",
                          "IPDestinationGroups"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/ip_destination_groups.py",
                "methods": ["list_ip_destination_groups", "add_ip_destination_group",
                            "update_ip_destination_group"]}},
    {"name": "ip_pool_group", "group": "policy-resources",
     "create": "ip-group-z-resource-add-ip-group",
     "get": "ip-group-z-resource-get-ip-group-by-id",
     "update": "ip-group-z-resource-edit-ip-group",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/ipgroups/ipgroups.go", "IPGroups"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_ip_pool_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/ip_groups.py", "IPGroups"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/ip_groups.py",
                "methods": ["list_ip_groups", "add_ip_group"]}},
    {"name": "ip_source_group", "group": "policy-resources",
     "create": "ip-source-group-z-resource-add-source-ip-group",
     "get": "ip-source-group-z-resource-get-source-ip-group-by-id",
     "update": "ip-source-group-z-resource-edit-source-ip-group",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/ipsourcegroups/ipsourcegroups.go",
            "IPSourceGroups"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_ip_source_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/ip_source_groups.py",
                          "IPSourceGroup"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/ip_source_groups.py",
                "methods": ["list_ip_source_groups", "add_ip_source_group"]}},
    {"name": "location_template", "group": "location-management",
     "create": "location-template-z-resource-create-location-template",
     "get": "location-template-z-resource-get-location-template",
     "update": "location-template-z-resource-update-location-template",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/locationmanagement/locationtemplate/"
            "locationtemplates.go", "LocationTemplate"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_location_template.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/location_templates.py",
                          "LocationTemplate"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/location_template.py",
                "methods": ["list_location_templates", "add_location_template", "update_location_template"]}},
    {"name": "network_service", "group": "policy-resources",
     "create": "network-service-resource-add-custom-network-service",
     "get": "network-service-z-resource-get-network-service-by-id",
     "update": "network-service-resource-edit-network-service",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/networkservices/networkservices.go",
            "NetworkServices"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_network_services.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/nw_service.py", "NetworkServices"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/nw_service.py",
                "methods": ["list_network_services", "add_network_service", "update_network_service"]}},
    {"name": "network_service_group", "group": "policy-resources",
     "create": "network-service-group-z-resource-add-custom-network-service-group",
     "get": "zcloudconnector/all/network-service-group-z-resource-get-network-service-group-by-id",
     "update": "zcloudconnector/all/network-service-group-z-resource-edit-network-service-group",
     "extra_gets": ["network-service-group-z-resource-get-network-service-groups"],
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/networkservicegroups/"
            "networkservicegroups.go", "NetworkServiceGroups"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_network_services_groups.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/nw_service_groups.py",
                          "NetworkServiceGroups"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/nw_service_groups.py",
                "methods": ["list_network_svc_groups"]}},
    {"name": "provisioning_url", "group": "private",
     "create": "ec-prov-url-z-resource-create-prov-url",
     "get": "zcloudconnector/provisioning/ec-prov-url-z-resource-get-prov-url-by-id",
     "update": "ec-prov-url-z-resource-update-ec-group",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/provisioning_url/"
            "provisioning_url.go", "ProvisioningURL"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_provisioning_url.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/provisioning_url.py",
                          "ProvisioningURL"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/provisioning_url.py",
                "methods": ["list_provisioning_url", "get_provisioning_url", "add_provisioning_url",
                            "update_provisioning_url"]}},
    {"name": "public_cloud_info", "group": "partner-integrations",
     "create": "aws-account-z-resource-create-aws-account",
     "get": "aws-account-z-resource-get-aws-account-by-id",
     "update": "aws-account-z-resource-update-aws-account",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/public_cloud_info/"
            "public_cloud_info.go", "PublicCloudInfo"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_public_cloud_info.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/public_cloud_info.py",
                          "PublicCloudInfo"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py",
                "methods": ["list_public_cloud_info", "get_public_cloud_info", "add_public_cloud_info",
                            "update_public_cloud_info"]}},
    {"name": "traffic_forwarding_dns_rule", "group": "dns-control-forwarding-rule",
     "create": "ec-rule-z-resource-create-ec-dns-forwarding-rule",
     "get": "ec-rule-z-resource-get-ec-dns-by-id",
     "update": "ec-rule-z-resource-update-ec-dns-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_dns_rules/"
            "traffic_dns_rules.go", "ECDNSRules"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go"},
    {"name": "traffic_forwarding_rule", "group": "policy-management",
     "create": "ec-rule-z-resource-create-rdr-rule",
     "get": "ec-rule-z-resource-get-forwarding-rule-by-id",
     "update": "ec-rule-z-resource-update-ec-rdr-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/"
            "forwarding_rules.go", "ForwardingRules"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go",
     "python": {"model": ("vendor/zscaler-sdk-python/zscaler/ztw/models/forwarding_rules.py",
                          "ForwardingControlRule"),
                "service": "vendor/zscaler-sdk-python/zscaler/ztw/forwarding_rules.py",
                "methods": ["list_rules", "add_rule", "update_rule"]}},
    {"name": "traffic_forwarding_log_rule", "group": "log-and-control-forwarding",
     "create": "ec-rule-z-resource-create-self-rule",
     "get": "ec-rule-z-resource-get-ec-self-rule-by-id",
     "update": "ec-rule-z-resource-update-self-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_log_rules/"
            "traffic_log_rules.go", "ECTrafficLogRules"),
     "tf": "vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_log_forwarding_rule.go"},
]

ZTW_CONTRACT_ONLY_GROUPS = [
    "admin-and-role-management",
    "authentication",
    "cloud-branch-connector-groups",
    "public",
    "workload-groups",
]

ZTW_SCOPE_NOTES = [
    "`resource_ztc_location_management.go` is not reconciled because "
    "`terraform-provider-ztc` does not register `ztc_location_management` in `ResourcesMap`; it is exposed only "
    "as a data source in the captured provider map.",
]

ZIA_CONTRACT_ONLY_GROUPS = [
    "api-authentication",
    "authentication-settings",
    "event-logs",
    "intermediate-ca-certificates",
    "iot-report",
    "organization-details",
    "pac-files",
    "policy-export",
    "remote-assistance-support",
    "service-edges",
    "shadow-it-report",
    "system-audit-report",
    "time",
    "time-intervals",
]

PRODUCTS = {
    "zcc": {
        "contract_json": "vendor/zscaler-api-specs/automate-zscaler/zcc-api-reference.json",
        "resources": ZCC_RESOURCES,
        "scope_notes": ZCC_SCOPE_NOTES,
    },
    "zcloudconnector": {
        "display": "ZTW",
        "contract_json": "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json",
        "resources": ZTW_RESOURCES,
        "contract_only_groups": ZTW_CONTRACT_ONLY_GROUPS,
        "scope_notes": ZTW_SCOPE_NOTES,
    },
    "zpa": {
        "contract_json": "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        "resources": ZPA_RESOURCES,
    },
    "zia": {
        "contract_json": "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        "resources": ZIA_RESOURCES,
        "contract_only_groups": ZIA_CONTRACT_ONLY_GROUPS,
    },
}


_MCP_PACKAGE_ROOTS = (
    "vendor/zscaler-mcp-server/src/zscaler_mcp",
    "vendor/zscaler-mcp-server/zscaler_mcp",
)


def _mcp_package_root(repo_root=ROOT):
    """Return the vendored MCP package root for src or legacy layouts.

    The upstream project adopted a src layout in v0.13.1. Keep the legacy
    candidate for older pinned submodules and use the current src layout as the
    deterministic fallback when vendor sources are not initialized.
    """
    for candidate in _MCP_PACKAGE_ROOTS:
        if os.path.isdir(os.path.join(repo_root, candidate)):
            return candidate
    return _MCP_PACKAGE_ROOTS[0]


def _mcp(tool_path, *functions):
    cfg = {"paths": [f"{_mcp_package_root()}/tools/{tool_path}"]}
    if functions:
        cfg["functions"] = list(functions)
    return cfg


MCP_MAPPINGS = {
    "zcc": {
        "forwarding_profile": _mcp("zcc/list_forwarding_profiles.py", "zcc_list_forwarding_profiles"),
    },
    "zcloudconnector": {
        "ip_destination_group": _mcp("ztw/ip_destination_groups.py"),
        "ip_pool_group": _mcp("ztw/ip_groups.py"),
        "ip_source_group": _mcp("ztw/ip_source_groups.py"),
        "network_service": _mcp("ztw/network_services.py"),
        "network_service_group": _mcp("ztw/network_service_groups.py"),
        "public_cloud_info": _mcp("ztw/public_cloud_info.py"),
    },
    "zpa": {
        "app_connector_group": _mcp("zpa/app_connector_groups.py"),
        "application_server": _mcp("zpa/application_servers.py"),
        "application_segment": _mcp("zpa/app_segments.py"),
        "ba_certificate": _mcp("zpa/ba_certificate.py"),
        "inspection_profile": _mcp("zpa/get_app_protection_profile.py"),
        "lss_config": _mcp("zpa/lss.py", "zpa_list_lss_configs", "zpa_get_lss_config"),
        "pra_credential": _mcp("zpa/pra_credential.py"),
        "pra_portal": _mcp("zpa/pra_portal.py"),
        "provisioning_key": _mcp("zpa/provisioning_key.py"),
        "segment_group": _mcp("zpa/segment_groups.py"),
        "server_group": _mcp("zpa/server_groups.py"),
        "service_edge_group": _mcp("zpa/service_edge_groups.py"),
    },
    "zia": {
        "advanced_settings": _mcp("zia/advanced_settings.py"),
        "advanced_threat_settings": _mcp("zia/atp_settings.py", "zia_get_atp_settings", "zia_update_atp_settings"),
        "atp_malicious_urls": _mcp(
            "zia/atp_settings.py", "zia_list_atp_malicious_urls", "zia_add_atp_malicious_urls",
            "zia_delete_atp_malicious_urls"
        ),
        "atp_malware_inspection": _mcp(
            "zia/atp_malware_protection.py", "zia_get_atp_malware_inspection",
            "zia_update_atp_malware_inspection"
        ),
        "atp_malware_policy": _mcp(
            "zia/atp_malware_protection.py", "zia_get_atp_malware_policy",
            "zia_update_atp_malware_policy"
        ),
        "atp_malware_protocols": _mcp(
            "zia/atp_malware_protection.py", "zia_get_atp_malware_protocols",
            "zia_update_atp_malware_protocols"
        ),
        "atp_malware_settings": _mcp(
            "zia/atp_malware_protection.py", "zia_get_malware_settings", "zia_update_malware_settings"
        ),
        "atp_security_exceptions": _mcp(
            "zia/atp_settings.py", "zia_get_atp_security_exceptions", "zia_update_atp_security_exceptions"
        ),
        "auth_settings_urls": _mcp("zia/auth_exempt_urls.py"),
        "cloud_app_control_rule": _mcp("zia/cloud_app_control.py"),
        "dlp_dictionary": _mcp("zia/list_dlp_dictionaries.py"),
        "dlp_engine": _mcp("zia/list_dlp_engines.py"),
        "file_type_rule": _mcp(
            "zia/file_type_control_rules.py", "zia_list_file_type_control_rules", "zia_get_file_type_control_rule",
            "zia_create_file_type_control_rule", "zia_update_file_type_control_rule",
            "zia_delete_file_type_control_rule"
        ),
        "firewall_dns_rule": _mcp("zia/cloud_firewall_dns_rules.py"),
        "firewall_filtering_rule": _mcp("zia/cloud_firewall_rules.py"),
        "firewall_ips_rule": _mcp("zia/cloud_firewall_ips_rules.py"),
        "gre_tunnel": _mcp("zia/gre_tunnels.py"),
        "ip_destination_group": _mcp("zia/ip_destination_groups.py"),
        "ip_source_group": _mcp("zia/ip_source_groups.py"),
        "location": _mcp("zia/location_management.py"),
        "mobile_malware_protection_policy": _mcp("zia/mobile_threat_settings.py"),
        "network_application_group": _mcp("zia/network_app_groups.py"),
        "network_service": _mcp("zia/network_services.py"),
        "network_service_group": _mcp("zia/network_services_group.py"),
        "rule_label": _mcp("zia/rule_labels.py"),
        "sandbox_rule": _mcp("zia/sandbox_rules.py"),
        "ssl_inspection_rule": _mcp("zia/ssl_inspection.py"),
        "static_ip": _mcp("zia/static_ips.py"),
        "url_category": _mcp("zia/url_categories.py"),
        "url_filtering_rule": _mcp("zia/url_filtering_rules.py"),
        "user": _mcp("zia/list_users.py"),
        "vpn_credential": _mcp("zia/vpn_credentials.py"),
        "workload_group": _mcp("zia/workload_groups.py"),
    },
}


for product, mapping in MCP_MAPPINGS.items():
    for resource in PRODUCTS[product]["resources"]:
        if resource["name"] in mapping:
            resource["mcp"] = mapping[resource["name"]]


def _read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def _contract_key(product, res, ref):
    """Resolve an operation reference.

    Most registry entries live under one contract group and can use bare slugs.
    Some products split create/update/read across groups (for example ZTW
    provisioning URLs), so entries may also pin the full
    `product/group/operation` key.
    """
    if "/" in ref:
        return ref if ref.startswith(f"{product}/") else f"{product}/{ref}"
    return f"{product}/{res['group']}/{ref}"


def _contract_ops(res, contracts, product):
    read_slugs = [res["get"], *res.get("extra_gets", [])]
    write_slugs = [x for x in (res.get("create"), res.get("update"), *res.get("extra_updates", [])) if x]
    op_keys = [(slug, _contract_key(product, res, slug)) for slug in read_slugs + write_slugs]
    missing = [key for _, key in op_keys if key not in contracts]
    if missing:
        raise KeyError(f"missing contract operation(s) for {res['name']}: {', '.join(missing)}")
    reads = [contracts[_contract_key(product, res, slug)] for slug in read_slugs]
    writes = [contracts[_contract_key(product, res, slug)] for slug in write_slugs]
    return reads, writes


def reconcile_ansible(res, cfields, required_names):
    if not res.get("ansible"):
        return {"surface": "none"}

    path = res["ansible"]
    src = _read(path)
    fields = extract_ansible_argument_spec_fields(src)
    repo = ansible_repo(path)
    matched = {name for name in cfields if name in fields}
    rep = {
        "surface": "present",
        "repo": repo,
        "path": path,
        "sdk_calls": extract_ansible_sdk_calls(src),
        "counts": {"ansible": len(fields)},
        "presence": {
            "contract_unmatched_in_ansible": sorted(set(cfields) - matched),
            "ansible_only_vs_contract": sorted(set(fields) - set(cfields)),
        },
        "required_drift": [],
        "enum": {"match": [], "value_conflict": [], "one_sided": []},
    }

    if res.get("compare_required", True) and res.get("create"):
        for name in sorted(matched):
            contract_required = name in required_names
            ansible_required = fields[name]["required"]
            if contract_required != ansible_required:
                rep["required_drift"].append({
                    "field": name,
                    "contract_required": contract_required,
                    "ansible_required": ansible_required,
                    "direction": "ansible_stricter" if ansible_required and not contract_required else "contract_stricter",
                    "repo": repo,
                    "path": path,
                })

    for name in sorted(matched):
        ce, ae = cfields[name].get("enum"), fields[name]["enum"]
        if not ce and not ae:
            continue
        if ce and ae:
            (rep["enum"]["match"] if set(ce) == set(ae) else rep["enum"]["value_conflict"]).append(
                name if set(ce) == set(ae) else {
                    "field": name,
                    "contract": ce,
                    "ansible": ae,
                    "repo": repo,
                    "path": path,
                })
        else:
            rep["enum"]["one_sided"].append({
                "field": name,
                "contract": ce,
                "ansible": ae,
                "repo": repo,
                "path": path,
            })
    return rep


def _python_cfg_paths(cfg):
    paths = []
    if cfg.get("model"):
        paths.append(cfg["model"][0])
    if cfg.get("service"):
        paths.append(cfg["service"])
    return paths


def reconcile_python(res, cfields):
    cfg = res.get("python")
    if not cfg:
        return {"surface": "none"}

    fields = {}
    if cfg.get("model"):
        model_path, class_name = cfg["model"]
        model_fields = extract_python_model_fields(_read(model_path), class_name)
        fields.update(model_fields)
    service_methods = []
    if cfg.get("service"):
        service_src = _read(cfg["service"])
        service_methods = [m for m in extract_python_service_methods(service_src) if not cfg.get("methods") or m in cfg["methods"]]
        fields.update(extract_python_service_fields(service_src, cfg.get("methods") or service_methods))

    matched = {name for name in cfields if name in fields}
    return {
        "surface": "present",
        "repo": "zscaler-sdk-python",
        "paths": _python_cfg_paths(cfg),
        "methods": service_methods,
        "counts": {"python": len(fields)},
        "presence": {
            "contract_unmatched_in_python": sorted(set(cfields) - matched),
            "python_only_vs_contract": sorted(set(fields) - set(cfields)),
        },
    }


def reconcile_mcp(res, cfields, routing=()):
    cfg = res.get("mcp")
    if not cfg:
        return {"surface": "none"}

    fields = {}
    tools = []
    sdk_calls = []
    for path in cfg["paths"]:
        src = _read(path)
        available = set(extract_mcp_tool_functions(src))
        functions = cfg.get("functions") or sorted(available)
        missing = sorted(set(functions) - available)
        if missing:
            raise KeyError(f"missing MCP tool function(s) in {path}: {', '.join(missing)}")
        tools.extend(functions)
        sdk_calls.extend(extract_mcp_sdk_calls(src, functions))
        for name, rec in extract_mcp_request_fields(src, functions, routing).items():
            fields.setdefault(name, {"mcp_key": rec["mcp_key"], "source": set(), "paths": set()})
            fields[name]["source"].update(rec["source"])
            fields[name]["paths"].add(path)

    fields = {
        name: {
            "mcp_key": rec["mcp_key"],
            "source": sorted(rec["source"]),
            "paths": sorted(rec["paths"]),
        }
        for name, rec in fields.items()
    }
    matched = {name for name in cfields if name in fields}
    field_surface = "present" if fields else "none"
    return {
        "surface": "present",
        "field_surface": field_surface,
        "repo": "zscaler-mcp-server",
        "paths": cfg["paths"],
        "tools": sorted(set(tools)),
        "sdk_calls": sorted(set(sdk_calls)),
        "counts": {"mcp_tools": len(set(tools)), "mcp_fields": len(fields)},
        "presence": {
            "contract_unmatched_in_mcp": sorted(set(cfields) - matched) if fields else [],
            "mcp_only_vs_contract": sorted(set(fields) - set(cfields)) if fields else [],
        },
    }


def reconcile_one(res, contracts, product="zpa"):
    reads, writes = _contract_ops(res, contracts, product)
    operation = writes[0] if writes else reads[0]
    routing = {p["name"] for op in [*reads, *writes] for p in op.get("path_params", []) + op.get("query_params", [])}
    # field universe = response schema (fullest); required comes from create bodies
    # only. Update-only singletons often reuse PUT/POST request bodies with product
    # semantics that are not creation requirements, so they opt out via
    # compare_required=False and still get type/presence/readonly/enum coverage.
    cfields = {}
    for op in [*reads, *writes]:
        for raw in op.get("response_schema") or []:
            f = _contract_reconcile_field(raw)
            if not f:
                continue
            cfields.setdefault(f["name"], dict(f))
    creq = {}
    if res.get("compare_required", True) and res.get("create"):
        create_op = contracts[_contract_key(product, res, res["create"])]
        creq = {
            f["name"]: f
            for raw in create_op.get("request_body", [])
            if (f := _contract_reconcile_field(raw))
        }
        for name, f in creq.items():
            cfields.setdefault(name, dict(f))
    required_names = {n for n, f in creq.items() if f["required"]}

    go_path, struct = res["go"]
    go = extract_go_struct_fields(_read(go_path), struct)
    tf = extract_tf_schema_fields(_read(res["tf"]))

    # Case-insensitive TF lookup recovers the acronym casing the snake->camel alias
    # loses (extranet_dto -> extranetDto vs the contract's extranetDTO). Go json tags
    # are the wire names, so Go is matched exactly — a Go casing mismatch is a real
    # divergence we want to keep surfacing.
    tf_ci = {}
    for k, v in tf.items():
        tf_ci.setdefault(k.lower(), v)

    def tf_get(name):
        return tf.get(name) or tf_ci.get(name.lower())

    cset, goset = set(cfields), set(go)
    matched_tf = {name for name in cset if tf_get(name)}
    rep = {
        "resource": res["name"],
        "method": operation.get("method"),
        "path": display_contract_path(product, operation.get("path")),
        "contract_path": operation.get("path"),
        "counts": {"contract": len(cset), "go": len(goset), "tf": len(tf)},
        "presence": {
            "contract_only_vs_go": sorted(cset - goset),
            "go_only_vs_contract": sorted(goset - cset),
            # contract fields not matched to a TF key by conservative naming — this is
            # "unmatched", NOT proof of absence (a helper schema or an unmapped alias).
            "contract_unmatched_in_tf": sorted(cset - matched_tf),
        },
        "type_drift": [],
        "required_drift": [],
        "readonly": [],
        "enum": {"match": [], "value_conflict": [], "one_sided": []},
    }

    for name in sorted(cset & goset):
        cc = contract_category(cfields[name].get("type"))
        gc = go[name]["category"]
        if cc and cc != gc and {cc, gc} <= {"number", "string", "boolean"}:
            rep["type_drift"].append({"field": name, "contract": cfields[name]["type"], "go": go[name]["go_type"]})

    # required / readonly / enum: only where the matched TF key is an inline block, so
    # its flags are actually readable. Helper-valued keys are present but their flags
    # are unresolved -> we never claim a divergence we cannot see.
    for name in sorted(matched_tf):
        tff = tf_get(name)
        if not tff["inline"]:
            continue
        creq_flag = name in required_names
        if creq_flag != tff["required"]:
            rep["required_drift"].append({
                "field": name, "contract_required": creq_flag, "tf_required": tff["required"],
                "direction": "tf_stricter" if tff["required"] and not creq_flag else "contract_stricter",
            })

    # readonly NARROWED: only fields the contract marks readonly; report TF treatment
    for name in sorted(matched_tf):
        tff = tf_get(name)
        if cfields[name].get("readonly") and tff["inline"]:
            rep["readonly"].append({"field": name, "tf_computed": tff["computed"],
                                    "agree": tff["computed"]})

    for name in sorted(matched_tf):
        tff = tf_get(name)
        if not tff["inline"]:
            continue
        ce, te = cfields[name].get("enum"), tff["enum"]
        if not ce and not te:
            continue
        if ce and te:
            (rep["enum"]["match"] if set(ce) == set(te) else rep["enum"]["value_conflict"]).append(
                name if set(ce) == set(te) else {"field": name, "contract": ce, "tf": te})
        else:
            rep["enum"]["one_sided"].append({"field": name, "contract": ce, "tf": te})

    rep["ansible"] = reconcile_ansible(res, cfields, required_names)
    rep["python"] = reconcile_python(res, cfields)
    rep["mcp"] = reconcile_mcp(res, cfields, routing)
    return rep


def build_report(contracts, product="zpa"):
    resources = PRODUCTS[product]["resources"]
    reports = [reconcile_one(r, contracts, product) for r in resources]
    totals = {
        "type_drift": sum(len(r["type_drift"]) for r in reports),
        "required_drift": sum(len(r["required_drift"]) for r in reports),
        "enum_match": sum(len(r["enum"]["match"]) for r in reports),
        "enum_value_conflict": sum(len(r["enum"]["value_conflict"]) for r in reports),
        "enum_one_sided": sum(len(r["enum"]["one_sided"]) for r in reports),
        "readonly_fields": sum(len(r["readonly"]) for r in reports),
        "readonly_disagree": sum(1 for r in reports for x in r["readonly"] if not x["agree"]),
        "ansible_resources": sum(1 for r in reports if r["ansible"]["surface"] == "present"),
        "ansible_no_surface": sum(1 for r in reports if r["ansible"]["surface"] == "none"),
        "ansible_required_drift": sum(len(r["ansible"].get("required_drift", [])) for r in reports),
        "ansible_enum_match": sum(len(r["ansible"].get("enum", {}).get("match", [])) for r in reports),
        "ansible_enum_value_conflict": sum(
            len(r["ansible"].get("enum", {}).get("value_conflict", [])) for r in reports
        ),
        "ansible_enum_one_sided": sum(len(r["ansible"].get("enum", {}).get("one_sided", [])) for r in reports),
        "python_resources": sum(1 for r in reports if r["python"]["surface"] == "present"),
        "python_no_surface": sum(1 for r in reports if r["python"]["surface"] == "none"),
        "python_contract_unmatched": sum(
            len(r["python"].get("presence", {}).get("contract_unmatched_in_python", [])) for r in reports
        ),
        "python_only": sum(len(r["python"].get("presence", {}).get("python_only_vs_contract", [])) for r in reports),
        "mcp_resources": sum(1 for r in reports if r["mcp"]["surface"] == "present"),
        "mcp_no_surface": sum(1 for r in reports if r["mcp"]["surface"] == "none"),
        "mcp_field_resources": sum(1 for r in reports if r["mcp"].get("field_surface") == "present"),
        "mcp_contract_unmatched": sum(
            len(r["mcp"].get("presence", {}).get("contract_unmatched_in_mcp", [])) for r in reports
        ),
        "mcp_only": sum(len(r["mcp"].get("presence", {}).get("mcp_only_vs_contract", [])) for r in reports),
    }
    report = {
        "product": product,
        "contract_json": PRODUCTS[product]["contract_json"],
        "resources": reports,
        "totals": totals,
    }
    if PRODUCTS[product].get("display"):
        report["display"] = PRODUCTS[product]["display"]
    if PRODUCTS[product].get("contract_only_groups"):
        report["contract_only_groups"] = PRODUCTS[product]["contract_only_groups"]
    if PRODUCTS[product].get("scope_notes"):
        report["scope_notes"] = PRODUCTS[product]["scope_notes"]
    return report


# ---- markdown rendering ----------------------------------------------------

def render_markdown(report):
    t = report["totals"]
    product_label = report.get("display", report["product"].upper())
    out = []
    out.append("---")
    out.append(f'title: "DAV-21 automate.zscaler.com contract reconciliation — {product_label}"')
    out.append("status: generated")
    out.append('generator: "scripts/automate-capture/reconcile_contract.py"')
    out.append("---\n")
    out.append(f"# automate.zscaler.com contract vs Go SDK / Python SDK / Terraform / Ansible / MCP — {product_label}\n")
    out.append("> Generated by `scripts/automate-capture/reconcile_contract.py`. Do not edit by hand; "
               "re-run after re-capturing the contract or bumping the vendor submodules.\n")
    out.append("Diffs the rendered per-operation contract "
               f"(`{report['contract_json']}`) against the Go SDK struct, Python SDK model/request fields, "
               "Terraform provider schema, "
               "Ansible module argument specs, "
               "and Zscaler MCP server tools "
               "for each resource.\n")
    out.append("## Totals\n")
    out.append(f"- Type drift (contract vs Go primitive category): **{t['type_drift']}**")
    out.append(f"- Required drift (contract vs TF): **{t['required_drift']}**")
    out.append(f"- Enum: **{t['enum_match']}** match / **{t['enum_value_conflict']}** value-conflict / "
               f"**{t['enum_one_sided']}** one-sided")
    out.append(f"- Contract readonly fields checked: **{t['readonly_fields']}** "
               f"(TF disagreement: {t['readonly_disagree']})\n")
    out.append(f"- Ansible module surface: **{t['ansible_resources']}** present / "
               f"**{t['ansible_no_surface']}** no surface")
    out.append(f"- Ansible required drift: **{t['ansible_required_drift']}**")
    out.append(f"- Ansible enum: **{t['ansible_enum_match']}** match / "
               f"**{t['ansible_enum_value_conflict']}** value-conflict / "
               f"**{t['ansible_enum_one_sided']}** one-sided\n")
    out.append(f"- Python SDK surface: **{t['python_resources']}** present / "
               f"**{t['python_no_surface']}** no surface")
    out.append(f"- Python SDK presence: **{t['python_contract_unmatched']}** contract-unmatched / "
               f"**{t['python_only']}** python-only fields\n")
    out.append(f"- MCP tool surface: **{t['mcp_resources']}** present / "
               f"**{t['mcp_no_surface']}** no surface "
               f"(**{t['mcp_field_resources']}** with request-field surface)")
    out.append(f"- MCP request-field presence: **{t['mcp_contract_unmatched']}** contract-unmatched / "
               f"**{t['mcp_only']}** MCP-only fields\n")
    if report.get("contract_only_groups"):
        out.append("## Contract Groups Outside Terraform Scope\n")
        out.append("Captured contract groups with no Terraform resource mapping in this report:\n")
        for group in report["contract_only_groups"]:
            out.append(f"- `{group}`")
        out.append("")
    if report.get("scope_notes"):
        out.append("## Scope Notes\n")
        for note in report["scope_notes"]:
            out.append(f"- {note}")
        out.append("")
    for r in report["resources"]:
        out.append(f"## {r['resource']}\n")
        ansible = r["ansible"]
        python = r["python"]
        mcp = r["mcp"]
        ansible_label = (
            f"Ansible {ansible['counts']['ansible']} fields"
            if ansible["surface"] == "present"
            else "no Ansible surface"
        )
        python_label = (
            f"Python {python['counts']['python']} fields"
            if python["surface"] == "present"
            else "no Python surface"
        )
        mcp_label = (
            f"MCP {mcp['counts']['mcp_tools']} tools"
            if mcp["surface"] == "present"
            else "no MCP surface"
        )
        out.append(f"`{r['method']} {r['path']}` — "
                   f"contract {r['counts']['contract']} / Go {r['counts']['go']} / TF {r['counts']['tf']} fields / "
                   f"{ansible_label} / {python_label} / {mcp_label}\n")
        if r["type_drift"]:
            out.append("**Type drift** — contract and Go SDK disagree on the primitive field category:\n")
            for d in r["type_drift"]:
                out.append(f"- `{d['field']}`: contract `{d['contract']}` vs Go `{d['go']}`")
            out.append("")
        if r["required_drift"]:
            out.append("**Required drift:**\n")
            for d in r["required_drift"]:
                note = "TF stricter than API" if d["direction"] == "tf_stricter" else "contract stricter than TF"
                out.append(f"- `{d['field']}`: contract required={d['contract_required']}, "
                           f"TF required={d['tf_required']} ({note})")
            out.append("")
        if r["enum"]["value_conflict"]:
            out.append("**Enum value conflicts:**\n")
            for d in r["enum"]["value_conflict"]:
                out.append(f"- `{d['field']}`: contract {d['contract']} vs TF {d['tf']}")
            out.append("")
        if ansible["surface"] == "present" and ansible["required_drift"]:
            out.append("**Ansible required drift:**\n")
            for d in ansible["required_drift"]:
                note = "Ansible stricter than API" if d["direction"] == "ansible_stricter" else "contract stricter than Ansible"
                out.append(f"- `{d['field']}`: contract required={d['contract_required']}, "
                           f"Ansible required={d['ansible_required']} ({note}; {d['repo']})")
            out.append("")
        if ansible["surface"] == "present" and ansible["enum"]["value_conflict"]:
            out.append("**Ansible enum value conflicts:**\n")
            for d in ansible["enum"]["value_conflict"]:
                out.append(f"- `{d['field']}`: contract {d['contract']} vs Ansible {d['ansible']} ({d['repo']})")
            out.append("")
        if ansible["surface"] == "present" and ansible["presence"]["contract_unmatched_in_ansible"]:
            out.append(f"**Contract fields unmatched in the Ansible module:** "
                       f"{', '.join('`%s`' % x for x in ansible['presence']['contract_unmatched_in_ansible'])}\n")
        if ansible["surface"] == "present" and ansible["presence"]["ansible_only_vs_contract"]:
            out.append(f"**Ansible module fields absent from the contract:** "
                       f"{', '.join('`%s`' % x for x in ansible['presence']['ansible_only_vs_contract'])}\n")
        if python["surface"] == "present" and python["presence"]["contract_unmatched_in_python"]:
            out.append(f"**Contract fields unmatched in the Python SDK model/request surface:** "
                       f"{', '.join('`%s`' % x for x in python['presence']['contract_unmatched_in_python'])}\n")
        if python["surface"] == "present" and python["presence"]["python_only_vs_contract"]:
            out.append(f"**Python SDK fields absent from the contract:** "
                       f"{', '.join('`%s`' % x for x in python['presence']['python_only_vs_contract'])}\n")
        if mcp["surface"] == "present" and mcp["presence"]["contract_unmatched_in_mcp"]:
            out.append(f"**Contract fields unmatched in MCP request tools:** "
                       f"{', '.join('`%s`' % x for x in mcp['presence']['contract_unmatched_in_mcp'])}\n")
        if mcp["surface"] == "present" and mcp["presence"]["mcp_only_vs_contract"]:
            out.append(f"**MCP request fields absent from the contract:** "
                       f"{', '.join('`%s`' % x for x in mcp['presence']['mcp_only_vs_contract'])}\n")
        if r["presence"]["contract_only_vs_go"]:
            out.append(f"**Contract fields absent from the Go SDK struct:** "
                       f"{', '.join('`%s`' % x for x in r['presence']['contract_only_vs_go'])}\n")
        if r["presence"]["go_only_vs_contract"]:
            out.append(f"**Go SDK fields absent from the contract:** "
                       f"{', '.join('`%s`' % x for x in r['presence']['go_only_vs_contract'])}\n")
    out.append("## Scope\n")
    out.append("Reconciles the contract against the Go SDK, Python SDK, Terraform provider, Ansible modules, "
               "and Zscaler MCP server tools "
               "where those surfaces exist. Python SDK comparison is presence-only because most mutable wrappers "
               "accept dynamic `**kwargs` and do not generally encode required or enum constraints. MCP comparison "
               "is also presence-only: it records resource/tool coverage and request fields the wrapper exposes, "
               "but does not infer required/readonly/enum constraints from natural-language tool descriptions. Resources "
               "without a mapped surface are marked explicitly. Field matching is conservative: exact names, with "
               "TF/Ansible/Python/MCP snake_case→camelCase derived from the source key; unmatched fields are reported "
               "as presence differences, never guessed.\n")
    return "\n".join(out)


def main():
    out_dir = os.path.join(ROOT, "vendor/zscaler-api-specs/automate-zscaler")
    for product, cfg in PRODUCTS.items():
        contracts = json.load(open(os.path.join(ROOT, cfg["contract_json"]), encoding="utf-8"))
        report = build_report(contracts, product)
        json_out = os.path.join(out_dir, f"{product}-divergences.json")
        md_out = os.path.join(out_dir, f"{product}-divergences.md")
        with open(json_out, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
            f.write("\n")
        with open(md_out, "w", encoding="utf-8") as f:
            # exactly one trailing newline (sections already embed their own blank lines)
            f.write(render_markdown(report).rstrip("\n") + "\n")
        t = report["totals"]
        print(f"reconciled {product}: {len(report['resources'])} resources")
        print(f"  type_drift={t['type_drift']} required_drift={t['required_drift']} "
              f"enum(match/conflict/one-sided)={t['enum_match']}/{t['enum_value_conflict']}/{t['enum_one_sided']} "
              f"readonly={t['readonly_fields']}(disagree {t['readonly_disagree']})")
        print(f"  ansible surface={t['ansible_resources']} present/{t['ansible_no_surface']} none "
              f"required_drift={t['ansible_required_drift']} "
              f"enum(match/conflict/one-sided)="
              f"{t['ansible_enum_match']}/{t['ansible_enum_value_conflict']}/{t['ansible_enum_one_sided']}")
        print(f"  python surface={t['python_resources']} present/{t['python_no_surface']} none "
              f"presence(contract-unmatched/python-only)="
              f"{t['python_contract_unmatched']}/{t['python_only']}")
        print(f"  mcp surface={t['mcp_resources']} present/{t['mcp_no_surface']} none "
              f"field_resources={t['mcp_field_resources']} "
              f"presence(contract-unmatched/mcp-only)={t['mcp_contract_unmatched']}/{t['mcp_only']}")
        print(f"  -> {json_out}")
        print(f"  -> {md_out}")


if __name__ == "__main__":
    main()
