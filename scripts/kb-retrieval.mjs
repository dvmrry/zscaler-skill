#!/usr/bin/env node
// kb-retrieval.mjs — how well a plain-question resolve finds each eval's gold subjects.
//
// For every eval with `must_cite`, the eval's prompt is resolved as text (no overlay) and each gold ID gets a
// level:
//   top        its subject is the resolved subject or among the ranked candidates
//   neighbor   a candidate is its parent, child or sibling: the gold is in that candidate's `neighbors`
//   miss       neither
// The levels are pinned in scripts/fixtures/kb-retrieval-baseline.json; kb-retrieval.test.mjs fails when any
// gold gets worse, so ranking changes cannot quietly lose recall. After an intended change, rewrite the
// baseline with --write and review its diff.
//
// Usage: node scripts/kb-retrieval.mjs [--write]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGraph, loadPublic } from "./kb-lib.mjs";
import { resolve } from "./kb-resolve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const BASELINE = "scripts/fixtures/kb-retrieval-baseline.json";
export const RANK = { top: 2, neighbor: 1, miss: 0 };

const subjectOf = (id) => id.split(/[:#]/)[0];
const parentOf = (id) => id.split(".").slice(0, -1).join(".");

function level(gold, found) {
  const g = subjectOf(gold);
  if (found.includes(g)) return "top";
  const near = found.some((s) => s.startsWith(`${g}.`) || g.startsWith(`${s}.`) || (parentOf(s).includes(".") && parentOf(s) === parentOf(g)));
  return near ? "neighbor" : "miss";
}

/** { "<eval id>:<gold id>": level } for every eval with must_cite. */
export function retrievalLevels(g, evals) {
  const out = {};
  for (const e of evals) {
    if (!e.must_cite?.length) continue;
    const b = resolve(g, e.prompt);
    const found = [...(b.resolved ? [b.resolved.id] : []), ...(b.candidates || []).map((c) => c.id)].map(subjectOf);
    for (const gold of e.must_cite) out[`${e.id}:${gold}`] = level(gold, found);
  }
  return out;
}

export function measure(root = ROOT) {
  const g = buildGraph(loadPublic(root));
  const evals = JSON.parse(fs.readFileSync(path.join(root, "references/_meta/evals/evals.json"), "utf8")).evals;
  return retrievalLevels(g, evals);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const levels = measure();
  const count = (l) => Object.values(levels).filter((x) => x === l).length;
  for (const [k, l] of Object.entries(levels)) if (l !== "top") console.log(`${l}: ${k}`);
  console.log(`retrieval: ${count("top")} top, ${count("neighbor")} neighbor, ${count("miss")} miss of ${Object.keys(levels).length}`);
  if (process.argv.includes("--write")) {
    fs.writeFileSync(path.join(ROOT, BASELINE), `${JSON.stringify(levels, null, 2)}\n`);
    console.log(`wrote ${BASELINE}`);
  }
}
