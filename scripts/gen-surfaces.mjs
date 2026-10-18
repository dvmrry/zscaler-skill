#!/usr/bin/env node
// gen-surfaces.mjs — generate the API, SDK and Terraform surface layer for a product.
//
// The surface layer answers "which endpoint, SDK call or Terraform resource handles this object"
// mechanically from the pinned sources, so no reference doc has to list it by hand:
//   - api:        OpenAPI paths and operations (vendor/zscaler-api-specs, automate-zscaler/openapi)
//   - sdk_go:     each Go SDK service package's endpoint constants and exported functions
//   - sdk_python: each Python SDK module's API class, public methods and endpoints
//   - terraform:  each provider resource and data source, the Go SDK packages it imports, and the
//                 OpenAPI paths those packages call
// Code is read at the submodule pin (HEAD); the spec is a committed capture, identified by its hash.
// The output changes only when a pin or the captured spec changes.
//
// Usage: node scripts/gen-surfaces.mjs [zia] [--check]
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

// ---------------------------------------------------------------- Go SDK
const sdkGo = {};
for (const file of list("zscaler-sdk-go", P.goServices)) {
  if (!file.endsWith(".go") || file.endsWith("_test.go")) continue;
  const pkg = path.posix.dirname(file).slice(P.goServices.length + 1);
  const src = show("zscaler-sdk-go", file);
  if (!sdkGo[pkg]) sdkGo[pkg] = { endpoints: new Set(), functions: new Set() };
  const entry = sdkGo[pkg];
  for (const m of src.matchAll(/"(\/(?:zia\/api\/v1)?\/?[A-Za-z][\w./{}%-]*)"/g)) {
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
  const endpoints = [...new Set([...src.matchAll(/\{self\._\w*base_endpoint\}\s*(\/[A-Za-z][^\s"'`)]*)/g)].map((m) => m[1]))].sort();
  const methods = [...new Set([...src.matchAll(/^    def ([a-z]\w*)\(/gm)].map((m) => m[1]))].sort();
  sdkPython[path.posix.basename(file, ".py")] = { class: cls[1], methods, endpoints, api: [...new Set(endpoints.flatMap(apiPaths))].sort() };
}

// ---------------------------------------------------------------- Terraform
const providerGo = show(P.provider, `${P.providerDir}/provider.go`);
const providerFiles = list(P.provider, P.providerDir).filter((f) => f.endsWith(".go") && !f.endsWith("_test.go"));
const funcFile = new Map();
const fileImports = new Map();
for (const f of providerFiles) {
  const src = show(P.provider, f);
  for (const m of src.matchAll(/^func (\w+)\(/gm)) funcFile.set(m[1], f);
  const pkgs = [...src.matchAll(new RegExp(`"github\\.com/zscaler/zscaler-sdk-go/v\\d+/${P.goServices}/([^"]+)"`, "g"))].map((m) => m[1]);
  fileImports.set(f, [...new Set(pkgs)].sort());
}
const terraform = {};
for (const [kind, mapName] of [["resource", "ResourcesMap"], ["data-source", "DataSourcesMap"]]) {
  const block = providerGo.slice(providerGo.indexOf(`${mapName}:`));
  const body = block.slice(0, block.indexOf("\n\t\t},"));
  for (const m of body.matchAll(/"(\w+)":\s*(\w+)\(\)/g)) {
    const file = funcFile.get(m[2]);
    const sdk = file ? fileImports.get(file) : [];
    terraform[`${kind}:${m[1]}`] = {
      kind, name: m[1], file: file || null, sdk_go: sdk,
      api: [...new Set(sdk.flatMap((p) => sdkGo[p]?.api || []))].sort(),
    };
  }
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
