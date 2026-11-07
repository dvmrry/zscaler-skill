// scripts/kb-surface.mjs — look up the generated API, SDK and Terraform surface layer.
//
// The layer (references/_meta/surfaces/<product>.json, written by gen-surfaces.mjs) links each
// Terraform resource and data source to the Go SDK packages it imports and the OpenAPI paths those
// packages call, with its arguments (and the provider's own, as provider:<product>), and lists each
// Python SDK module's methods and paths. A lookup returns every entry
// whose name or path matches, joined with what reaches the same API paths; a product lookup also lists the
// legacy operations an SDK still calls that the OneAPI spec lacks (`legacy_not_in_spec`).
import fs from "node:fs";
import path from "node:path";

const shape = (p) => p.replace(/\{[^}]*\}|%[dsv]|(?<=\/):\w+/g, "{}").replace(/\/+$/, "");

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

/** Look up a product key, a Terraform name, an API path, a Go SDK package, or a Python module, class or method. */
export function lookupSurface(root, query) {
  const q = query.trim();
  const out = [];
  for (const [product, s] of Object.entries(loadSurfaces(root))) {
    // A product key lists its whole surface by name: API paths, Go packages, Python modules, Terraform types.
    if (product === q) {
      out.push({
        product, match: "product", base: s.base,
        api: Object.keys(s.api).sort(),
        sdk_go: Object.fromEntries(Object.entries(s.sdk_go).map(([k, e]) => [k, e.functions])),
        sdk_python: Object.fromEntries(Object.entries(s.sdk_python).map(([k, e]) => [k, { class: e.class, methods: e.methods }])),
        terraform: Object.keys(s.terraform).sort(),
        legacy_operations: Object.values(s.legacy?.operations || {}).reduce((n, o) => n + Object.keys(o).length, 0),
        ...specGaps(s),
      });
      continue;
    }
    for (const t of Object.values(s.terraform)) {
      if (t.name === q || `${t.kind}:${t.name}` === q) out.push({ product, match: "terraform", ...t, operations: pick(s.api, t.api) });
    }
    if (q.startsWith("/")) {
      const rel = shape(s.base && q.startsWith(s.base + "/") ? q.slice(s.base.length) : q.replace(/^\/[a-z]+\/api\/v\d+/, ""));
      const paths = Object.keys(s.api).filter((p) => shape(p) === rel || shape(p).startsWith(rel + "/"));
      if (paths.length) out.push({ product, match: "api", operations: pick(s.api, paths), reached_by: reaching(s, paths) });
      // A legacy page writes its paths relative to its own base; the query may be written either way.
      const L = s.legacy;
      const wants = new Set([shape(q), rel]);
      const legacy = Object.entries(L?.operations || {}).filter(([p, ops]) =>
        Object.values(ops).some((e) => e.pages.some((f) => wants.has(shape(p)) || wants.has(shape(L.pages[f].base + p)))));
      if (legacy.length) out.push({ product, match: "legacy", operations: Object.fromEntries(legacy) });
    }
    if (s.sdk_go[q]) out.push({ product, match: "sdk_go", package: q, ...s.sdk_go[q], reached_by: reaching(s, s.sdk_go[q].api) });
    for (const [mod, e] of Object.entries(s.sdk_python)) {
      if (mod === q || e.class === q || e.methods.includes(q)) out.push({ product, match: "sdk_python", module: mod, ...e, reached_by: reaching(s, e.api) });
    }
  }
  return out;
}

/**
 * The legacy operations an SDK calls that the captured OneAPI spec has no operation for, as "METHOD path" -> the
 * calling Go packages and Python modules. Only a product with a captured spec has any: without one, every
 * operation would be listed.
 */
function specGaps(s) {
  if (!Object.keys(s.inputs || {}).some((k) => k.startsWith("zscaler-api-specs/"))) return {};
  const gaps = {};
  for (const [p, ops] of Object.entries(s.legacy?.operations || {})) {
    for (const [m, e] of Object.entries(ops)) {
      if (e.oneapi || !(e.sdk_go || e.sdk_python)) continue;
      gaps[`${m.toUpperCase()} ${p}`] = { ...(e.sdk_go ? { sdk_go: e.sdk_go } : {}), ...(e.sdk_python ? { sdk_python: e.sdk_python } : {}) };
    }
  }
  return Object.keys(gaps).length ? { legacy_not_in_spec: gaps } : {};
}

function pick(api, paths) {
  return Object.fromEntries(paths.filter((p) => api[p]).map((p) => [p, api[p]]));
}
