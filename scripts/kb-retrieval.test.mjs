import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { BASELINE, RANK, measure } from "./kb-retrieval.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("no eval's gold subject ranks worse than the pinned baseline", () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, BASELINE), "utf8"));
  const now = measure(ROOT);
  const worse = Object.entries(baseline)
    .filter(([k, was]) => k in now && RANK[now[k]] < RANK[was])
    .map(([k, was]) => `${k}: ${was} -> ${now[k]}`);
  const missing = Object.keys(now).filter((k) => !(k in baseline));
  assert.deepEqual(worse, [], "retrieval got worse; fix the ranking, or rewrite the baseline with node scripts/kb-retrieval.mjs --write if intended");
  assert.deepEqual(missing, [], "new eval gold IDs; run node scripts/kb-retrieval.mjs --write");
});
