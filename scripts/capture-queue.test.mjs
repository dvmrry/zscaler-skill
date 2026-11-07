import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { captureQueue, helpKey, markdown } from "./capture-queue.mjs";

function tmpRepo(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "capture-queue-"));
  for (const [rel, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), typeof body === "string" ? body : JSON.stringify(body));
  }
  return root;
}

test("a help path is one key: case, trailing slash and punctuation fold; roots and files are not pages", () => {
  assert.equal(helpKey("/ZIA/About-Admin-Rank/"), "https://help.zscaler.com/zia/about-admin-rank");
  assert.equal(helpKey("/zia/about-admin-rank)."), "https://help.zscaler.com/zia/about-admin-rank");
  assert.equal(helpKey("/zia"), null);
  assert.equal(helpKey("/sites/default/files/x"), null);
  assert.equal(helpKey("/zia/guide.pdf"), null);
});

test("the queue lists linked pages not captured, by URL or alias, ranked by the cited files that link them", () => {
  const root = tmpRepo({
    "vendor/zscaler-help/kept.json": { kind: "help-article", source: { url: "https://help.zscaler.com/unified/kept", aliases: ["https://help.zscaler.com/zia/kept-old"] } },
    "vendor/zscaler-help/spec.json": { kind: "help-api-spec", spec: { description: '<a href="/zpa/relative-page">x</a>' } },
    "vendor/tf/docs/a.md": "See https://help.zscaler.com/zia/missing and https://help.zscaler.com/zia/kept-old and https://help.zscaler.com/unified/kept.",
    "vendor/tf/docs/b.md": "Also https://help.zscaler.com/zia/missing/ and https://help.zscaler.com/zia/other.",
    "vendor/sdk/c.py": "# https://help.zscaler.com/zia/other",
  });
  const q = captureQueue(root, new Set(["vendor/sdk/c.py"]));
  assert.deepEqual(q.map((x) => x.url), ["https://help.zscaler.com/zia/other", "https://help.zscaler.com/zia/missing", "https://help.zscaler.com/zpa/relative-page"]);
  assert.deepEqual(q[0], { url: "https://help.zscaler.com/zia/other", cited_linkers: 1, linking_files: 2, links: 2, examples: ["vendor/sdk/c.py", "vendor/tf/docs/b.md"] });
  assert.match(markdown(q, 1), /^3 help pages are linked from vendor material but not captured \(top 1\)\./);
});
