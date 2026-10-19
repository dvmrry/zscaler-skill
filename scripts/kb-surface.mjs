// scripts/kb-surface.mjs — look up the generated API, SDK and Terraform surface layer.
//
// The layer (references/_meta/surfaces/<product>.json, written by gen-surfaces.mjs) links each
// Terraform resource and data source to the Go SDK packages it imports and the OpenAPI paths those
// packages call, with its arguments (and the provider's own, as provider:<product>), and lists each
// Python SDK module's methods and paths. A lookup returns every entry
// whose name or path matches, joined with what reaches the same API paths.
import fs from "node:fs";
import path from "node:path";

const shape = (p) => p.replace(/\{[^}]*\}|%[dsv]/g, "{}").replace(/\/+$/, "");

export function loadSurfaces(root) {
  const dir = path.join(root, "references/_meta/surfaces");
  if (!fs.existsSync(dir)) return {};
  return Object.fromEntries(
    fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => [path.basename(f, ".json"), JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))]),
  );
}

/** Everything in one product's layer that reaches any of these API paths. */
function reaching(s, paths) {
  const want = new Set(paths);
  const hit = (api) => api.some((p) => want.has(p));
  return {
    terraform: Object.values(s.terraform).filter((t) => hit(t.api)).map((t) => `${t.kind}:${t.name}`),
    sdk_go: Object.entries(s.sdk_go).filter(([, e]) => hit(e.api)).map(([k]) => k),
    sdk_python: Object.entries(s.sdk_python).filter(([, e]) => hit(e.api)).map(([k, e]) => `${k} (${e.class})`),
  };
}

/** Look up a Terraform name, an API path, a Go SDK package, or a Python module, class or method. */
export function lookupSurface(root, query) {
  const q = query.trim();
  const out = [];
  for (const [product, s] of Object.entries(loadSurfaces(root))) {
    for (const t of Object.values(s.terraform)) {
      if (t.name === q || `${t.kind}:${t.name}` === q) out.push({ product, match: "terraform", ...t, operations: pick(s.api, t.api) });
    }
    if (q.startsWith("/")) {
      const rel = shape(s.base && q.startsWith(s.base + "/") ? q.slice(s.base.length) : q.replace(/^\/[a-z]+\/api\/v\d+/, ""));
      const paths = Object.keys(s.api).filter((p) => shape(p) === rel || shape(p).startsWith(rel + "/"));
      if (paths.length) out.push({ product, match: "api", operations: pick(s.api, paths), reached_by: reaching(s, paths) });
    }
    if (s.sdk_go[q]) out.push({ product, match: "sdk_go", package: q, ...s.sdk_go[q], reached_by: reaching(s, s.sdk_go[q].api) });
    for (const [mod, e] of Object.entries(s.sdk_python)) {
      if (mod === q || e.class === q || e.methods.includes(q)) out.push({ product, match: "sdk_python", module: mod, ...e, reached_by: reaching(s, e.api) });
    }
  }
  return out;
}

function pick(api, paths) {
  return Object.fromEntries(paths.filter((p) => api[p]).map((p) => [p, api[p]]));
}
