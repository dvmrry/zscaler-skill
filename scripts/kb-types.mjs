// scripts/kb-types.mjs
//
// Generates config object types (references/_meta/types/<scope>.json) from two
// pinned public tools, never by hand:
//   - zscalerctl-dev: the offline, credential-free resource catalogue (names,
//     fields, reviewed field semantics, reference edges, command paths), exported
//     to references/_meta/imports/zscalerctl.json by exportZscalerctl().
//   - infrawright-dev packs: Terraform names, API fetch paths, and the fields or
//     values the adoption tooling cannot carry.
//   - the generated surface layer (references/_meta/surfaces/<product>.json): for a type
//     infrawright does not pack, the provider resource that imports the same Go SDK package
//     as zscalerctl's reader (see TF_JOIN).
// zscalerctl owns field shape and descriptions; the KB owns behavior (claims).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { META, gitlink } from "./kb-lib.mjs";

const ZSCALERCTL = "vendor/zscalerctl-dev";
const INFRAWRIGHT = "vendor/infrawright-dev";
export const EXPORT_FILE = `${META}/imports/zscalerctl.json`;

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const stable = (value) => JSON.stringify(value, null, 2) + "\n";

/**
 * The Go SDK packages each zscalerctl resource's reader uses, from the pinned reader source: every entry of
 * the handler tables (`{product: resources.ProductZIA, name: resourceLocations}: newListGetHandler(...)`)
 * names the SDK types it reads (`locationmanagement.Locations`), and the file's imports give their paths.
 * Returns { "zia/locations": ["zia/location/locationmanagement"], ... }, paths as the surface layer writes
 * them after the product.
 */
export function handlerPackages(root) {
  const dir = path.join(root, ZSCALERCTL, "internal/zscaler");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".go") && !f.endsWith("_test.go")).map((f) => fs.readFileSync(path.join(dir, f), "utf8"));
  const names = {};
  for (const t of files) for (const m of t.matchAll(/\b(resource\w+)\s*=\s*"([a-z0-9-]+)"/g)) names[m[1]] = m[2];
  const out = {};
  for (const t of files) {
    const imports = {};
    for (const m of t.matchAll(/^\s*(?:(\w+)\s+)?"github\.com\/zscaler\/zscaler-sdk-go\/v3\/zscaler\/(\w+)\/services\/([^"]+)"/gm)) {
      imports[m[1] || m[3].split("/").pop()] = `${m[2]}/${m[3]}`;
    }
    const parts = t.split(/\{product:\s*resources\.Product(\w+),\s*name:\s*(resource\w+)\}:/);
    for (let i = 1; i + 2 < parts.length; i += 3) {
      const name = names[parts[i + 1]];
      if (!name) continue;
      const body = parts[i + 2];
      const pkgs = [...body.matchAll(/\b([a-z]\w*)\.[A-Z]/g)].map((m) => imports[m[1]]).filter(Boolean);
      out[`${parts[i].toLowerCase()}/${name}`] = [...new Set(pkgs)].sort();
    }
  }
  return out;
}

/**
 * Joining a type to a provider resource by SDK package. A package can back several resources, so a
 * candidate must also share a name token with the type (ignoring a plural s), and the most tokens win. The
 * joins below were reviewed against the provider and reader source: `exclude` drops a join that shares a
 * package and a word but manages something else, `pick` names the resource when several fit.
 */
const TF_JOIN = {
  exclude: {
    "zia/eusa-status": "zia_activation_status activates staged config; it does not set EUSA acceptance",
    "zia/supported-browser-versions": "a read-only listing; zia_browser_control_policy manages the policy",
    "zpa/service-edges": "edges enroll themselves; zpa_service_edge_group manages their groups",
    "zcc/devices": "devices enroll themselves; zcc_device_cleanup sets the cleanup policy",
  },
  pick: {
    "zcc/trusted-networks": "zcc_trusted_network", // zscalerctl reads trusted_network, the provider trusted_network_v2
    "zia/sublocations": "zia_location_management", // a sublocation is a location with parent_id set
    "zia/url-allow-list": "zia_security_settings",
    "zia/url-deny-list": "zia_security_settings",
    "zpa/app-servers": "zpa_application_server",
    "zpa/application-segments": "zpa_application_segment",
    "zpa/user-portals": "zpa_user_portal_controller",
  },
  // Data sources: the same rule, joined separately (a read-only object often has only a data source).
  pick_data_source: {
    "zcc/devices": "zcc_devices",
    "zcc/trusted-networks": "zcc_trusted_network",
    "zia/devices": "zia_devices",
    "zia/locations-lite": "zia_location_lite",
  },
  exclude_data_source: {
    "zia/eusa-status": "zia_activation_status reads activation state, not EUSA acceptance",
  },
};

function surfaceTerraform(root, product) {
  const file = path.join(root, META, "surfaces", `${product}.json`);
  return fs.existsSync(file) ? Object.values(readJson(file).terraform || {}) : [];
}

const tokens = (s) => new Set(s.split(/[-_]/).filter(Boolean).map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w)));

/** The provider resource (or, with kind "data-source", data source) a type joins to by SDK package, or undefined. */
export function joinTerraform(id, sdkGo, entries, kind = "resource") {
  const pick = kind === "resource" ? TF_JOIN.pick : TF_JOIN.pick_data_source;
  if (pick[id]) return pick[id];
  if ((kind === "resource" ? TF_JOIN.exclude : TF_JOIN.exclude_data_source)[id]) return undefined;
  const resources = entries.filter((r) => (r.kind || "resource") === kind);
  const pkgs = new Set((sdkGo || []).map((p) => p.split("/").slice(1).join("/")));
  const want = tokens(id.split("/")[1]);
  const overlap = (r) => [...tokens(r.name.split("_").slice(1).join("_"))].filter((w) => want.has(w)).length;
  const hits = resources.filter((r) => (r.sdk_go || []).some((p) => pkgs.has(p)) && overlap(r) > 0);
  const best = Math.max(0, ...hits.map(overlap));
  const top = hits.filter((r) => overlap(r) === best);
  return top.length === 1 ? top[0].name : undefined;
}

/** Build the pinned zscalerctl and export its offline catalogue. Needs Go; no credentials, no network. */
export function exportZscalerctl(root) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kb-zscalerctl-"));
  const bin = path.join(tmp, "zscalerctl");
  execFileSync("go", ["build", "-o", bin, "./cmd/zscalerctl"], { cwd: path.join(root, ZSCALERCTL), stdio: "inherit" });
  // An empty environment guarantees the export can never read credentials.
  const run = (...args) => JSON.parse(execFileSync(bin, args, { env: { PATH: process.env.PATH, HOME: tmp }, encoding: "utf8", maxBuffer: 64 << 20 }));
  const introspect = run("introspect");
  const packages = handlerPackages(root);
  const resources = introspect.catalog.resources.map((r) => ({
    product: r.product, name: r.name, ops: r.ops, fields: r.fields, sdk_go: packages[`${r.product}/${r.name}`] || [],
  }));
  const references = [];
  const semantics = {};
  for (const r of resources) {
    const refs = run("schema", "references", r.product, r.name, "--format", "json");
    for (const by of refs.referred_by || []) {
      references.push({ from: `${by.product}/${by.resource}`, field: by.field, to: `${r.product}/${r.name}` });
    }
    const desc = run("schema", "describe", r.product, r.name, "--format", "json");
    if (desc.review_status === "reviewed") {
      semantics[`${r.product}/${r.name}`] = desc.fields.map((f) => ({
        name: f.name, type: f.type, description: f.description, classification: f.classification,
      }));
    }
  }
  const out = {
    schema_version: 1,
    zscalerctl_commit: gitlink(root, ZSCALERCTL),
    resources,
    commands: introspect.commands.map((c) => c.path).filter(Boolean).sort(),
    references: references.sort((a, b) => `${a.from}#${a.field}>${a.to}`.localeCompare(`${b.from}#${b.field}>${b.to}`)),
    semantics,
    gaps: run("schema", "gaps", "--format", "json").gaps,
  };
  fs.mkdirSync(path.join(root, META, "imports"), { recursive: true });
  fs.writeFileSync(path.join(root, EXPORT_FILE), stable(out));
  fs.rmSync(tmp, { recursive: true, force: true });
  return out;
}

export const snakeToCamel = (p) => p.split(".").map((seg) => seg.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())).join(".");

function loadPack(root, product) {
  const dir = path.join(root, INFRAWRIGHT, "packs", product);
  if (!fs.existsSync(dir)) return null;
  const overrides = {};
  const odir = path.join(dir, "overrides");
  if (fs.existsSync(odir)) {
    for (const name of fs.readdirSync(odir)) if (name.endsWith(".json")) overrides[name.slice(0, -5)] = readJson(path.join(odir, name));
  }
  return { registry: readJson(path.join(dir, "registry.json")), pack: readJson(path.join(dir, "pack.json")), overrides };
}

/** Generate every product's types file. Returns { written: [file], unmatched: [type id without a Terraform name] }. */
export function importTypes(root) {
  const exp = readJson(path.join(root, EXPORT_FILE));
  const products = readJson(path.join(root, META, "products.json")).products;
  const scopeOf = new Map(Object.entries(products).map(([id, p]) => [p.type_scope || id, id]));
  const byScope = new Map();
  const unmatched = [];
  const packs = new Map();
  const surfaces = new Map();

  for (const r of exp.resources) {
    if (!scopeOf.has(r.product)) throw new Error(`kb-types: zscalerctl product "${r.product}" has no product or type_scope in products.json`);
    if (!packs.has(r.product)) packs.set(r.product, loadPack(root, r.product === "ztw" ? "ztc" : r.product));
    const pk = packs.get(r.product);
    const id = `${r.product}/${r.name}`;
    const tfName = `${r.product === "ztw" ? "ztc" : r.product}_${r.name.replace(/-/g, "_")}`;
    const reg = pk?.registry[tfName];
    const t = {
      id, kind: "config", product: scopeOf.get(r.product),
      names: { zscalerctl: `${r.product} ${r.name}` },
      live: { command: `zscalerctl ${r.product} ${r.name} ${r.ops.includes("list") ? "list" : r.ops[0]}` },
      fields: {},
    };
    for (const f of r.fields) t.fields[f] = {};
    for (const s of exp.semantics[id] || []) {
      t.fields[s.name] = { ...t.fields[s.name], type: s.type, description: s.description, classification: s.classification };
    }
    if (reg) {
      t.names.terraform = tfName;
      if (reg.fetch?.path) t.names.api = reg.fetch.path;
      t.iac = { generate: reg.generate !== false, adopt: Boolean(reg.adopt) };
      if (reg.fetch?.query) t.iac.fetch_query = reg.fetch.query;
      const unsupported = (reg.adopt?.unsupported_if || []).map((u) => ({
        ...(u.match ? { match: u.match } : {}),
        ...(u.match_any_nonempty ? { match_any_nonempty: u.match_any_nonempty } : {}),
        provider: `${u.provider.source}@${u.provider.version}`, reason: u.reason, evidence: u.evidence,
      }));
      if (unsupported.length) t.iac.unsupported_if = unsupported;
      const ov = pk.overrides[tfName];
      if (ov?.skip_if) t.iac.skip_if = ov.skip_if;
      for (const drop of ov?.acknowledged_drops || []) {
        const fpath = snakeToCamel(drop);
        t.fields[fpath] = { ...t.fields[fpath], terraform: { status: "adoption-omitted", source: `infrawright overrides/${tfName}.json acknowledged_drops` } };
      }
      for (const omit of pk.pack.drift_policy?.resource_types?.[tfName]?.projection_omit || []) {
        const fpath = snakeToCamel(omit.path);
        t.fields[fpath] = { ...t.fields[fpath], terraform: { status: "adoption-omitted", source: "infrawright pack.json drift_policy", reason: omit.reason } };
      }
    } else {
      if (!surfaces.has(r.product)) surfaces.set(r.product, surfaceTerraform(root, r.product));
      const joined = joinTerraform(id, r.sdk_go, surfaces.get(r.product));
      if (joined) t.names.terraform = joined;
      else unmatched.push(id);
    }
    if (!surfaces.has(r.product)) surfaces.set(r.product, surfaceTerraform(root, r.product));
    const dataSource = joinTerraform(id, r.sdk_go, surfaces.get(r.product), "data-source");
    if (dataSource) t.names.terraform_data_source = dataSource;
    if (!byScope.has(r.product)) byScope.set(r.product, {});
    byScope.get(r.product)[id] = t;
  }
  for (const ref of exp.references) {
    const [scope] = ref.from.split("/");
    const t = byScope.get(scope)?.[ref.from];
    if (!t) continue;
    if (!t.fields[ref.field]) t.fields[ref.field] = {};
    const f = t.fields[ref.field];
    f.references = [...new Set([...(f.references || []), ref.to])].sort();
  }
  const written = [];
  for (const [scope, types] of [...byScope.entries()].sort()) {
    const sorted = Object.fromEntries(Object.entries(types).sort().map(([id, t]) => [id, { ...t, fields: Object.fromEntries(Object.entries(t.fields).sort()) }]));
    const file = `${META}/types/${scope}.json`;
    fs.mkdirSync(path.join(root, META, "types"), { recursive: true });
    fs.writeFileSync(path.join(root, file), stable({
      schema_version: 1,
      generated_by: "node scripts/kb.mjs import-types",
      inputs: { zscalerctl: exp.zscalerctl_commit, infrawright: gitlink(root, INFRAWRIGHT) },
      types: sorted,
    }));
    written.push(file);
  }
  return { written, unmatched };
}
