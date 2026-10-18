import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { driftReview } from "./kb-drift.mjs";
import { buildGraph, loadPublic } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function repo(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-drift-"));
  fs.cpSync(path.join(ROOT, "references/_meta/schema"), path.join(root, "references/_meta/schema"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "references/_meta/products.json"), path.join(root, "references/_meta/products.json"));
  for (const [rel, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), JSON.stringify(body, null, 2));
  }
  return root;
}

test("a drifted page sorts the evidence citing it into broken, in-change and untouched", () => {
  const cite = (quote) => ({ statement: "S.", tier: "A", evidence: [{ source: "zscaler-help", path: "page.json", quotes: [quote] }] });
  const root = repo({
    "references/_meta/sources.json": { schema_version: 1, sources: { "zscaler-help": { kind: "capture", root: "vendor/zscaler-help", rank: 5, title: "Help" } } },
    // The page as rewritten by `check --replace`: line 2 is the one that changed.
    "vendor/zscaler-help/page.json": {
      schema_version: 1, kind: "help-article", title: "Page", source: { url: "https://help.zscaler.com/zia/page", node: "1", revision: "3" },
      captured_at: "2026-10-18",
      blocks: [{ text: "Intro line." }, { text: "Rules stop at the last match." }, { text: "A middle line." }, { text: "Far from the change." }],
    },
    "references/zia/zia.example.json": {
      schema_version: 1, id: "zia.example", title: "Example",
      claims: { gone: cite("Rules stop at the first match."), near: cite("Rules stop at the last match."), far: cite("Far from the change.") },
    },
  });
  const report = { pages: [{ file: "page.json", status: "drift", from: "2", to: "3", changed_lines: [2], removed: ["Rules stop at the first match."] }] };
  const [page] = driftReview(buildGraph(loadPublic(root)), report);
  const byClaim = Object.fromEntries(page.evidence.map((e) => [e.where.match(/(gone|near|far)/)[1], e.state]));
  assert.deepEqual(byClaim, { gone: "broken", near: "in-change", far: "untouched" });
});
