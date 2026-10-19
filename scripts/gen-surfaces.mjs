#!/usr/bin/env node
// gen-surfaces.mjs — generate the API, SDK and Terraform surface layer for a product.
//
// The surface layer answers "which endpoint, SDK call or Terraform resource handles this object"
// mechanically from the pinned sources, so no reference doc has to list it by hand:
//   - api:        OpenAPI paths and operations (vendor/zscaler-api-specs, automate-zscaler/openapi)
//   - sdk_go:     each Go SDK service package's endpoint constants and exported functions
//   - sdk_python: each Python SDK module's API class, public methods and endpoints
//   - terraform:  each provider resource and data source, the Go SDK packages it imports, the
//                 OpenAPI paths those packages call, and its arguments (type, required/optional/
//                 computed, ForceNew, default, enum and other validators, nested blocks) from the
//                 schema literals via scripts/tf-schema.go (go/ast)
// Code is read at the submodule pin (HEAD); the spec is a committed capture, identified by its hash.
// The output changes only when a pin or the captured spec changes.
//
// Usage: node scripts/gen-surfaces.mjs [zia|zpa|zcc] [--check]
//   --check  exit 1 if the committed file differs from what the pins generate.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const check = args.includes("--check");
const product = args.find((a) => !a.startsWith("--")) || "zia";

const PRODUCTS = {
  zia: {
    spec: "automate-zscaler/openapi/zia.openapi.json",
    base: "/zia/api/v1",
    provider: "terraform-provider-zia",
    providerDir: "zia",
    goServices: "zscaler/zia/services",
    pyModules: "zscaler/zia",
  },
  // ZPA paths are assembled from pieces: a service prefix, the customer ID, then an endpoint
  // (`mgmtConfig + GetCustomerID() + appSegmentEndpoint` in Go, `{self._zpa_base_endpoint}/application`
  // in Python); `assembled` rebuilds the full path before matching it to the spec.
  zpa: {
    spec: "automate-zscaler/openapi/zpa.openapi.json",
    base: "/zpa",
    provider: "terraform-provider-zpa",
    providerDir: "zpa",
    goServices: "zscaler/zpa/services",
    pyModules: "zscaler/zpa",
    assembled: true,
    pyBases: true,
  },
  // ZCC: Go services carry full literal paths; Python modules template one base
  // (`self._zcc_base_endpoint = "/zcc/papi/public/v1"`). The provider is a Plugin Framework provider.
  zcc: {
    spec: "automate-zscaler/openapi/zcc.openapi.json",
    base: "/zcc",
    provider: "terraform-provider-zcc",
    providerDir: "internal/framework",
    goServices: "zscaler/zcc/services",
    pyModules: "zscaler/zcc",
    pyBases: true,
    framework: true,
  },
};
const P = PRODUCTS[product];
if (!P) throw new Error(`unknown product ${product}; known: ${Object.keys(PRODUCTS).join(", ")}`);

const git = (repo, ...a) => execFileSync("git", ["-C", path.join(ROOT, "vendor", repo), ...a], { encoding: "utf8", maxBuffer: 256 << 20 });
const show = (repo, file) => git(repo, "show", `HEAD:${file}`);
const list = (repo, dir) => git(repo, "ls-tree", "-r", "--name-only", "HEAD", dir).split("\n").filter(Boolean);
const pin = (repo) => git(repo, "rev-parse", "HEAD").trim();

// Path parameters are named differently in each source ({ruleId}, %d, {rule_id}); compare shapes.
const shape = (p) => p.replace(/\{[^}]*\}|%[dsv]/g, "{}").replace(/\/+$/, "");

// ---------------------------------------------------------------- API
const specText = fs.readFileSync(path.join(ROOT, "vendor/zscaler-api-specs", P.spec), "utf8");
const spec = JSON.parse(specText);
const api = {};
for (const [p, ops] of Object.entries(spec.paths)) {
  api[p] = {};
  for (const [m, op] of Object.entries(ops)) {
    if (!["get", "post", "put", "patch", "delete"].includes(m)) continue;
    api[p][m] = { ...(op.operationId ? { operationId: op.operationId } : {}), ...(op.summary ? { summary: op.summary } : {}) };
  }
}
const apiByShape = new Map();
for (const p of Object.keys(api)) apiByShape.set(shape(p), [...(apiByShape.get(shape(p)) || []), p]);
/** Spec paths an SDK endpoint reaches: the path itself and any sub-path under it. */
function apiPaths(endpoint) {
  const rel = shape(endpoint.startsWith(P.base) ? endpoint.slice(P.base.length) : endpoint);
  if (!rel.startsWith("/")) return [];
  return [...apiByShape.entries()].filter(([s]) => s === rel || s.startsWith(rel + "/")).flatMap(([, ps]) => ps).sort();
}

/**
 * Full paths a ZPA Go service file calls: each `PREFIX + <customer ID> + ENDPOINT (+ "/literal")`
 * concatenation, with the string constants substituted and the customer ID written as `{}`.
 */
function assembledGo(src) {
  const consts = Object.fromEntries([...src.matchAll(/^\s*(\w+)\s*=\s*"(\/[^"]*)"/gm)].map((m) => [m[1], m[2]]));
  const out = new Set();
  const expr = /(\w+)\s*\+\s*[\w.]*GetCustomerID\(\)(?:\s*\+\s*(\w+))?(?:\s*\+\s*"(\/[^"]*)")?/g;
  for (const m of src.matchAll(expr)) {
    if (!consts[m[1]]) continue;
    const prefix = consts[m[1]].replace(/\/$/, "");
    out.add(`${prefix}/{}${m[2] && consts[m[2]] ? consts[m[2]] : ""}${m[3] || ""}`);
  }
  // A path with no customer ID (`mgmtConfigV2 + lssEndpoint`).
  for (const m of src.matchAll(/(\w+)\s*\+\s*(\w+)(?!\s*\()/g)) {
    if (consts[m[1]]?.startsWith(P.base) && consts[m[2]] && !consts[m[2]].startsWith(P.base)) out.add(consts[m[1]] + consts[m[2]]);
  }
  return [...out];
}

// ---------------------------------------------------------------- Go SDK
const sdkGo = {};
for (const file of list("zscaler-sdk-go", P.goServices)) {
  if (!file.endsWith(".go") || file.endsWith("_test.go")) continue;
  const pkg = path.posix.dirname(file).slice(P.goServices.length + 1);
  const src = show("zscaler-sdk-go", file);
  if (!sdkGo[pkg]) sdkGo[pkg] = { endpoints: new Set(), functions: new Set() };
  const entry = sdkGo[pkg];
  if (P.assembled) for (const e of assembledGo(src)) entry.endpoints.add(e);
  else for (const m of src.matchAll(/"(\/(?:zia\/api\/v1)?\/?[A-Za-z][\w./{}%-]*)"/g)) {
    if (m[1].startsWith(P.base) || /^\/[a-z][A-Za-z]+(\/|$)/.test(m[1])) entry.endpoints.add(m[1]);
  }
  for (const m of src.matchAll(/^func ([A-Z]\w*)\(/gm)) entry.functions.add(m[1]);
}
for (const e of Object.values(sdkGo)) {
  e.endpoints = [...e.endpoints].sort();
  e.functions = [...e.functions].sort();
  e.api = [...new Set(e.endpoints.flatMap(apiPaths))].sort();
}

// ---------------------------------------------------------------- Python SDK
const sdkPython = {};
for (const file of list("zscaler-sdk-python", P.pyModules)) {
  if (!file.endsWith(".py") || path.posix.dirname(file) !== P.pyModules || file.endsWith("__init__.py")) continue;
  const src = show("zscaler-sdk-python", file);
  const cls = src.match(/^class (\w+API)\b/m);
  if (!cls) continue;
  // ZPA modules template their base (`self._zpa_base_endpoint = f"/zpa/.../customers/{customer_id}"`).
  const bases = Object.fromEntries([...src.matchAll(/self\.(_\w*base_endpoint\w*)\s*=\s*f?"([^"]+)"/g)].map((m) => [m[1], m[2]]));
  const endpoints = [...new Set([...src.matchAll(/\{self\.(_\w*base_endpoint\w*)\}\s*(\/[A-Za-z][^\s"'`)]*)/g)].map((m) =>
    P.pyBases && bases[m[1]] ? bases[m[1]] + m[2] : m[2]))].sort();
  const methods = [...new Set([...src.matchAll(/^    def ([a-z]\w*)\(/gm)].map((m) => m[1]))].sort();
  sdkPython[path.posix.basename(file, ".py")] = { class: cls[1], methods, endpoints, api: [...new Set(endpoints.flatMap(apiPaths))].sort() };
}

// ---------------------------------------------------------------- Terraform
const providerGo = show(P.provider, `${P.providerDir}/provider.go`);
const providerFiles = list(P.provider, P.providerDir).filter((f) => f.endsWith(".go") && !f.endsWith("_test.go"));
const funcFile = new Map();
const fileImports = new Map();
const providerSrc = {};
for (const f of providerFiles) {
  const src = show(P.provider, f);
  providerSrc[f] = src;
  for (const m of src.matchAll(/^func (\w+)\(/gm)) funcFile.set(m[1], f);
  const pkgs = [...src.matchAll(new RegExp(`"github\\.com/zscaler/zscaler-sdk-go/v\\d+/${P.goServices}/([^"]+)"`, "g"))].map((m) => m[1]);
  fileImports.set(f, [...new Set(pkgs)].sort());
}
const terraform = {};
const registered = {};
for (const [kind, mapName] of P.framework ? [] : [["resource", "ResourcesMap"], ["data-source", "DataSourcesMap"]]) {
  const block = providerGo.slice(providerGo.indexOf(`${mapName}:`));
  // A commented-out registration (`//"zpa_x": resourceX(),`) is not registered.
  const body = block.slice(0, block.indexOf("\n\t\t},")).replace(/\/\/.*$/gm, "");
  for (const m of body.matchAll(/"(\w+)":\s*(\w+)\(\)/g)) {
    const file = funcFile.get(m[2]);
    const sdk = file ? fileImports.get(file) : [];
    registered[`${kind}:${m[1]}`] = m[2];
    terraform[`${kind}:${m[1]}`] = {
      kind, name: m[1], file: file || null, sdk_go: sdk,
      api: [...new Set(sdk.flatMap((p) => sdkGo[p]?.api || []))].sort(),
    };
  }
}
// The provider's own configuration (credentials, cloud, retries and their environment variables).
if (!P.framework) {
  const providerFunc = providerGo.match(/^func (\w+)\(\) \*schema\.Provider \{/m)?.[1];
  if (!providerFunc) throw new Error(`no func returning *schema.Provider in ${P.providerDir}/provider.go`);
  registered[`provider:${product}`] = providerFunc;
  terraform[`provider:${product}`] = { kind: "provider", name: product, file: `${P.providerDir}/provider.go`, sdk_go: [], api: [] };
}
// Arguments come from the schema literals, read with go/ast by scripts/tf-schema.go (stdlib only; needs
// the go toolchain). What it cannot follow is listed per type under `unresolved`, never guessed. A Plugin
// Framework provider's types are discovered there, from its Resources() and DataSources() lists.
const schemas = JSON.parse(execFileSync("go", ["run", path.join(ROOT, "scripts/tf-schema.go")], {
  input: JSON.stringify({ files: providerSrc, ...(P.framework ? { framework: true } : { types: registered }) }),
  encoding: "utf8", maxBuffer: 256 << 20,
}));
if (P.framework) {
  for (const [id, s] of Object.entries(schemas)) {
    const [kind, name] = id.split(":");
    const sdk = (s.file && fileImports.get(s.file)) || [];
    terraform[id] = { kind, name, file: s.file || null, sdk_go: sdk, api: [...new Set(sdk.flatMap((p) => sdkGo[p]?.api || []))].sort() };
  }
}
for (const [id, t] of Object.entries(terraform)) {
  const s = schemas[id];
  t.arguments = s?.arguments || {};
  if (s?.customize_diff) t.customize_diff = s.customize_diff; // plan-time checks beyond the schema
  if (s?.unresolved?.length) t.unresolved = s.unresolved;
}

// ---------------------------------------------------------------- write
const out = {
  schema_version: 1,
  generated_by: "scripts/gen-surfaces.mjs",
  product,
  inputs: {
    [`zscaler-api-specs/${P.spec}`]: `sha256:${createHash("sha256").update(specText).digest("hex")}`,
    ...Object.fromEntries(["zscaler-sdk-go", "zscaler-sdk-python", P.provider].map((r) => [r, pin(r)])),
  },
  api,
  sdk_go: Object.fromEntries(Object.entries(sdkGo).sort()),
  sdk_python: Object.fromEntries(Object.entries(sdkPython).sort()),
  terraform: Object.fromEntries(Object.entries(terraform).sort()),
};
const text = JSON.stringify(out, null, 1) + "\n";
const target = path.join(ROOT, "references/_meta/surfaces", `${product}.json`);
if (check) {
  const cur = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (cur !== text) {
    console.error(`${path.relative(ROOT, target)} is stale; run node scripts/gen-surfaces.mjs ${product}`);
    process.exit(1);
  }
  console.log(`${path.relative(ROOT, target)} is current`);
} else {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  const n = (o) => Object.keys(o).length;
  const linked = Object.values(terraform).filter((t) => t.api.length).length;
  console.log(`wrote ${path.relative(ROOT, target)}: ${n(api)} API paths, ${n(sdkGo)} Go packages, ${n(sdkPython)} Python modules, ${n(terraform)} Terraform types (${linked} linked to API paths)`);
}
