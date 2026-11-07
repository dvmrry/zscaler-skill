import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

// The cases live in test-release-version.sh, beside the script the PR check and the release workflow both run.
test("release-version.sh accepts exactly one next-version notes file and keeps released notes immutable", () => {
  const script = fileURLToPath(new URL("./test-release-version.sh", import.meta.url));
  const result = spawnSync("bash", [script], { encoding: "utf8" });
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  assert.match(result.stdout, /test-release-version: PASS/);
});
