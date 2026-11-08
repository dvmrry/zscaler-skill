#!/usr/bin/env node
// regen-goldens.mjs — rewrite the resolve goldens in scripts/fixtures/kb-golden/ from the graph as it stands.
//
// kb-lib.test.mjs compares three resolve bundles (a config type, a subject, a log type, each with the synthetic
// overlay) against these files, ignoring the fields that move with every vendor bump or overlay commit. A change to
// the resolver, the config types (a zscalerctl pin), or the subjects those bundles read changes them on purpose:
// regenerate, then read the diff before committing it.
//
// Usage: node scripts/regen-goldens.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGraph, loadPublic } from "./kb-lib.mjs";
import { loadOverlay, resolve } from "./kb-resolve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GOLDEN = path.join(ROOT, "scripts/fixtures/kb-golden");
// The same queries and the same ignored fields as the golden test in kb-lib.test.mjs.
const QUERIES = ["zia/url-filtering-rules", "zia.url-filtering.rule-order", "zia/web-log"];
const VOLATILE = new Set(["line", "lines", "committed", "as_of"]);

const g = buildGraph(loadPublic(ROOT));
const overlay = loadOverlay(g, path.join(ROOT, "scripts/fixtures/kb-overlay"));
for (const q of QUERIES) {
  const bundle = resolve(g, q, { overlay });
  const file = path.join(GOLDEN, `${q.replace("/", "_")}.json`);
  fs.writeFileSync(file, `${JSON.stringify(bundle, (k, v) => (VOLATILE.has(k) ? undefined : v), 2)}\n`);
  console.log(`wrote ${path.relative(ROOT, file)}`);
}
