import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { run } from "./check-citations.mjs";

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-citations-"));
  fs.mkdirSync(path.join(root, "references", "foo"), { recursive: true });
  fs.mkdirSync(path.join(root, "agents", "investigator"), { recursive: true });
  return root;
}

function write(root, relativePath, content) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

test("check-citations resolves markdown links without code-fence noise", async () => {
  const root = makeRepo();
  write(root, "references/foo/target.md", "# Target\n");
  write(
    root,
    "references/foo/source.md",
    [
      "# Source",
      "",
      "Good link: [target](target.md#heading).",
      "",
      "```",
      "Ignored bad link: [missing](missing.md)",
      "```",
      "",
    ].join("\n"),
  );

  const result = await run({ root, checkUrls: false });

  assert.equal(result.totalPaths, 1);
  assert.deepEqual(result.brokenPaths, []);
  assert.deepEqual(result.inferenceHits, []);
});

test("check-citations reports broken paths", async () => {
  const root = makeRepo();
  write(root, "references/foo/source.md", "Broken link: [missing](missing.md).\n");

  const result = await run({ root, checkUrls: false });

  assert.equal(result.totalPaths, 1);
  assert.equal(result.brokenPaths.length, 1);
  assert.match(result.brokenPaths[0], /references\/foo\/source\.md -> missing\.md/);
});

test("check-citations flags inference-shaped paragraphs without citations", async () => {
  const root = makeRepo();
  write(
    root,
    "references/foo/source.md",
    [
      "# Source",
      "",
      "This is operationally significant because it changes the outcome.",
      "",
      "This is operationally significant too; see `references/foo/target.md`.",
      "",
    ].join("\n"),
  );

  const result = await run({ root, checkUrls: false });

  assert.equal(result.inferenceHits.length, 1);
  assert.match(result.inferenceHits[0], /operationally significant/);
});
