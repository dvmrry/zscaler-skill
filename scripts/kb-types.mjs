// scripts/kb-types.mjs
//
// Generates config object types (references/_meta/types/<scope>.json) from two
// pinned public tools, never by hand:
//   - zscalerctl-dev: the offline, credential-free resource catalogue (names,
//     fields, reviewed field semantics, reference edges, command paths), exported
//     to references/_meta/imports/zscalerctl.json by exportZscalerctl().
//   - infrawright-dev packs: Terraform names, API fetch paths, and the fields or
//     values the adoption tooling cannot carry.
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

/** Build the pinned zscalerctl and export its offline catalogue. Needs Go; no credentials, no network. */
export function exportZscalerctl(root) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kb-zscalerctl-"));
  const bin = path.join(tmp, "zscalerctl");
  execFileSync("go", ["build", "-o", bin, "./cmd/zscalerctl"], { cwd: path.join(root, ZSCALERCTL), stdio: "inherit" });
  // An empty environment guarantees the export can never read credentials.
  const run = (...args) => JSON.parse(execFileSync(bin, args, { env: { PATH: process.env.PATH, HOME: tmp }, encoding: "utf8", maxBuffer: 64 << 20 }));
  const introspect = run("introspect");
  const resources = introspect.catalog.resources.map((r) => ({ product: r.product, name: r.name, ops: r.ops, fields: r.fields }));
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
      unmatched.push(id);
    }
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
