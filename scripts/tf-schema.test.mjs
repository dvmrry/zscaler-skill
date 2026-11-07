import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (files, types) =>
  JSON.parse(execFileSync("go", ["run", path.join(ROOT, "scripts/tf-schema.go")], { input: JSON.stringify({ files, types }), encoding: "utf8" }));

// A provider package in the shapes the ZIA and ZPA providers use.
const PROVIDER = `package p

const kindA = "A"

func idsSchema(desc string, key string) *schema.Schema {
	ids := &schema.Schema{Type: schema.TypeList, Required: true, Elem: &schema.Schema{Type: schema.TypeInt}}
	if desc != "" {
		ids.MaxItems = 3
	}
	return &schema.Schema{
		Type: schema.TypeSet, Optional: true, Description: desc,
		Elem: &schema.Resource{Schema: map[string]*schema.Schema{key: ids}},
	}
}

func common() map[string]*schema.Schema {
	return map[string]*schema.Schema{"name": {Type: schema.TypeString, Required: true}}
}

func MergeSchema(schemas ...map[string]*schema.Schema) map[string]*schema.Schema { return nil }

func resourceX() *schema.Resource {
	return &schema.Resource{
		Schema: MergeSchema(common(), map[string]*schema.Schema{
			"kind": {
				Type: schema.TypeString, Optional: true, Default: kindA, ForceNew: true,
				Deprecated: "use " + "other",
				ValidateFunc: validation.StringInSlice([]string{kindA, "B", sdk.KindC}, false),
			},
			"order": {Type: schema.TypeInt, Required: true, ValidateFunc: validation.IntAtLeast(1)},
			"tags":  {Type: schema.TypeList, Computed: true, Elem: schema.TypeString},
			"apps":  idsSchema("the apps", "app_id"),
			"lat":   {Type: schema.TypeString, Optional: true, ValidateFunc: ValidateLatitude},
		}),
	}
}
`;

test("Terraform arguments come from the schema literals, through helpers, merges and constants", () => {
  const out = run({ "p/x.go": PROVIDER }, { "resource:p_x": "resourceX" })["resource:p_x"];
  assert.equal(out.unresolved, undefined);
  const a = out.arguments;
  assert.deepEqual(a.name, { type: "string", required: true }, "a merged helper map is followed");
  assert.deepEqual(a.kind, {
    type: "string", optional: true, force_new: true, default: "A", deprecated: "use other",
    validate: { enum: ["A", "B", "sdk.KindC"] },
  }, "constants and concatenations are evaluated; an SDK constant is kept by name");
  assert.deepEqual(a.order.validate, { at_least: "1", func: "validation.IntAtLeast" });
  assert.equal(a.tags.elem_type, "string", "Elem: schema.TypeString is an element type");
  assert.deepEqual(a.lat.validate, { func: "ValidateLatitude" }, "other validators are named, not interpreted");
  // A helper's parameters take the call's values; a field set after construction applies.
  assert.equal(a.apps.description, "the apps");
  assert.deepEqual(a.apps.block, { app_id: { type: "list", required: true, max_items: "3", elem_type: "int" } });
});

test("the function body runs in order: a Schema built in a local, deletes, pointers and element validators", () => {
  const src = `package p

var agentTypes = []string{"FIREFOX", "CHROME"}

func intPtr(n int) *int { return &n }

func getAgents() *schema.Schema {
	return &schema.Schema{Type: schema.TypeString, ValidateFunc: validation.StringInSlice(agentTypes, false)}
}

func idsCustom(maxItems *int) *schema.Schema {
	ids := &schema.Schema{Type: schema.TypeSet, Optional: true, Elem: &schema.Schema{Type: schema.TypeInt}}
	if maxItems != nil {
		ids.MaxItems = *maxItems
	}
	return ids
}

func dataSourceZ() *schema.Resource {
	inner := map[string]*schema.Schema{"id": {Type: schema.TypeInt, Computed: true}}
	top := map[string]*schema.Schema{
		"id":     {Type: schema.TypeInt, Computed: true},
		"rules":  {Type: schema.TypeList, Computed: true, Elem: &schema.Resource{Schema: inner}},
		"agents": {Type: schema.TypeList, Optional: true, StateFunc: normalize, Elem: getAgents()},
		"labels": idsCustom(intPtr(1)),
		"locale": {Type: schema.TypeString, Optional: true, Default: ""},
	}
	delete(top, "id")
	top["rule_id"] = &schema.Schema{Type: schema.TypeInt, Optional: true}
	return &schema.Resource{ReadContext: read, CustomizeDiff: checkPlan, Schema: top}
}`;
  const out = run({ "p/z.go": src }, { "data-source:p_z": "dataSourceZ" })["data-source:p_z"];
  assert.equal(out.unresolved, undefined);
  assert.equal(out.customize_diff, "checkPlan");
  const a = out.arguments;
  assert.deepEqual(Object.keys(a).sort(), ["agents", "labels", "locale", "rule_id", "rules"], "the returned Schema, not the first nested one; delete applies");
  assert.deepEqual(a.agents, { type: "list", optional: true, elem_type: "string", elem_validate: { enum: ["FIREFOX", "CHROME"] }, state_func: "normalize" });
  assert.equal(a.labels.max_items, "1", "intPtr(n) through *maxItems");
  assert.equal(a.locale.default, "", "an empty default is kept");
});

test("the provider's own schema gives its arguments and environment variable defaults", () => {
  const src = `package p
func XProvider() *schema.Provider {
	p := &schema.Provider{Schema: map[string]*schema.Schema{
		"client_id": {Type: schema.TypeString, Optional: true, DefaultFunc: schema.EnvDefaultFunc("X_CLIENT_ID", nil)},
		"cloud": {Type: schema.TypeString, Optional: true, DefaultFunc: schema.MultiEnvDefaultFunc([]string{"X_CLOUD", "Y_CLOUD"}, "PROD")},
	}}
	return p
}`;
  const a = run({ "p/provider.go": src }, { "provider:p": "XProvider" })["provider:p"].arguments;
  assert.deepEqual(a.client_id, { type: "string", optional: true, env: ["X_CLIENT_ID"] });
  assert.deepEqual(a.cloud, { type: "string", optional: true, env: ["X_CLOUD", "Y_CLOUD"], default: "PROD" });
});

test("a Plugin Framework provider: types discovered from Resources/DataSources, attributes, blocks, validators", () => {
  const provider = `package framework
func (p *XProvider) Metadata(_ context.Context, req provider.MetadataRequest, resp *provider.MetadataResponse) {
	resp.TypeName = "x"
}
func (p *XProvider) Schema(_ context.Context, _ provider.SchemaRequest, resp *provider.SchemaResponse) {
	resp.Schema = schema.Schema{Attributes: map[string]schema.Attribute{"cloud": schema.StringAttribute{Optional: true}}}
}
func (p *XProvider) Resources(ctx context.Context) []func() resource.Resource {
	return []func() resource.Resource{resources.NewThingResource}
}
func (p *XProvider) DataSources(ctx context.Context) []func() datasource.DataSource {
	return []func() datasource.DataSource{}
}`;
  const res = `package resources
var fields = []struct {
	name string
	get  func() string
}{{"alpha", nil}, {"beta", nil}}

func NewThingResource() resource.Resource { return &ThingResource{} }

func (r *ThingResource) Metadata(_ context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_thing"
}

func extra() map[string]schema.Attribute {
	out := make(map[string]schema.Attribute, len(fields))
	for _, f := range fields {
		out[f.name] = schema.StringAttribute{Computed: true}
	}
	return out
}

func (r *ThingResource) Schema(_ context.Context, _ resource.SchemaRequest, resp *resource.SchemaResponse) {
	list := func(desc string) schema.Attribute {
		return schema.ListAttribute{Optional: true, Description: desc, ElementType: types.StringType}
	}
	resp.Schema = schema.Schema{
		Attributes: map[string]schema.Attribute{
			"mode": schema.StringAttribute{
				Required:      true,
				Validators:    []validator.String{stringvalidator.OneOfCaseInsensitive("ON", "OFF")},
				PlanModifiers: []planmodifier.String{stringplanmodifier.RequiresReplace()},
			},
			"enabled": schema.BoolAttribute{Optional: true, Computed: true, Default: booldefault.StaticBool(true)},
			"ips":     list("IP list."),
			"config":  schema.SingleNestedAttribute{Computed: true, Attributes: extra()},
		},
		Blocks: map[string]schema.Block{
			"rule": schema.ListNestedBlock{NestedObject: schema.NestedBlockObject{Attributes: map[string]schema.Attribute{
				"id": schema.Int64Attribute{Required: true, Validators: []validator.Int64{int64validator.OneOf(1, 2)}},
			}}},
		},
	}
}`;
  const out = JSON.parse(execFileSync("go", ["run", path.join(ROOT, "scripts/tf-schema.go")], {
    input: JSON.stringify({ files: { "internal/framework/provider.go": provider, "internal/framework/resources/thing.go": res }, framework: true }),
    encoding: "utf8",
  }));
  assert.deepEqual(Object.keys(out).sort(), ["provider:x", "resource:x_thing"]);
  const t = out["resource:x_thing"];
  assert.equal(t.file, "internal/framework/resources/thing.go");
  assert.equal(t.unresolved, undefined);
  const a = t.arguments;
  assert.deepEqual(a.mode, { type: "string", required: true, force_new: true, validate: { enum: ["ON", "OFF"], ignore_case: true } });
  assert.deepEqual(a.enabled, { type: "bool", optional: true, computed: true, default: "true" });
  assert.deepEqual(a.ips, { type: "list", optional: true, description: "IP list.", elem_type: "string" }, "a closure held in a local");
  assert.deepEqual(Object.keys(a.config.block), ["alpha", "beta"], "a range over a literal slice of structs");
  assert.deepEqual(a.rule.block.id, { type: "int", required: true, validate: { enum: ["1", "2"] } });
  assert.deepEqual(out["provider:x"].arguments.cloud, { type: "string", optional: true });
});

test("what the extractor cannot follow is listed, never guessed", () => {
  const src = `package p
func resourceY() *schema.Resource {
	return &schema.Resource{Schema: buildAtRuntime()}
}`;
  const out = run({ "p/y.go": src }, { "resource:p_y": "resourceY", "resource:p_z": "resourceZ" });
  assert.deepEqual(out["resource:p_y"].arguments, {});
  assert.match(out["resource:p_y"].unresolved[0], /schema not followed: buildAtRuntime\(\)/);
  assert.match(out["resource:p_z"].unresolved[0], /function resourceZ not found/);
});
