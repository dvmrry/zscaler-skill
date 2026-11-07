import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildGraph, loadPublic, validateGraph } from "./kb-lib.mjs";
import { requote, respace } from "./kb-requote.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** A throwaway repo: the real schemas and registries plus one help capture and the given subject. */
function tmpRepo(blocks, claim) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-requote-"));
  fs.cpSync(path.join(ROOT, "references/_meta/schema"), path.join(root, "references/_meta/schema"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "references/_meta/products.json"), path.join(root, "references/_meta/products.json"));
  const write = (rel, data) => {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), `${JSON.stringify(data, null, 2)}\n`);
  };
  write("references/_meta/sources.json", { schema_version: 1, sources: { "zscaler-help": { kind: "capture", root: "vendor/zscaler-help", rank: 5, title: "Help" } } });
  write("vendor/zscaler-help/a.json", { schema_version: 1, kind: "help-article", title: "T", source: { url: "https://help.zscaler.com/zia/a", node: "1", revision: "2" }, captured_at: "2026-10-18", blocks });
  write("references/zia/zia.example.json", { schema_version: 1, id: "zia.example", title: "Example", claims: { c: { statement: "S.", tier: "A", evidence: [{ source: "zscaler-help", path: "a.json", ...claim }] } }, prose: [{ text: "{{c}}" }] });
  return root;
}

const graphOf = (root) => buildGraph(loadPublic(root));
// The fixture has no capture manifest; only anchoring errors matter here.
const anchorErrors = (root) => validateGraph(graphOf(root)).errors.map((e) => e.message).filter((m) => /quote|anchor/.test(m));
const evidence = (root) => JSON.parse(fs.readFileSync(path.join(root, "references/zia/zia.example.json"), "utf8")).claims.c.evidence[0];

test("respace finds the one span equal up to whitespace, ignoring bold", () => {
  assert.equal(respace("Select Allow and then Save.", "Select Allowand then Save"), "Select Allow and then Save");
  assert.equal(respace("Select **Allow** then Save.", "Select Allow then", { emphasis: true }), "Select Allow then");
  assert.equal(respace("ab ab", "ab"), null, "two spans: ambiguous");
  assert.equal(respace("ab", "cd"), null);
});

test("requote rewrites a quote and an after-anchor a re-render respaced, and leaves a reworded one", () => {
  // The re-render split one cell into two blocks: "Allowall traffic" now reads "Allow all traffic".
  const root = tmpRepo([{ text: "Action column" }, { text: "Allow all traffic to the destination." }], { after: "Actioncolumn", quotes: ["Allowall traffic"] });
  assert.equal(anchorErrors(root).length, 2, "broken before");
  const dry = requote(graphOf(root));
  assert.deepEqual(dry.fixed.map((f) => f.to), ["Action column", "Allow all traffic"]);
  assert.equal(evidence(root).quotes[0], "Allowall traffic", "a dry run writes nothing");
  const r = requote(graphOf(root), { write: true });
  assert.deepEqual(r.files, ["references/zia/zia.example.json"]);
  assert.deepEqual(evidence(root), { source: "zscaler-help", path: "a.json", after: "Action column", quotes: ["Allow all traffic"] });
  assert.deepEqual(anchorErrors(root), []);

  const reworded = tmpRepo([{ text: "Permit all traffic." }], { quotes: ["Allow all traffic"] });
  const left = requote(graphOf(reworded), { write: true });
  assert.equal(left.fixed.length, 0);
  assert.equal(left.broken.length, 1);
  assert.equal(evidence(reworded).quotes[0], "Allow all traffic");
});
