import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";
import {
  FULL_CHECKS,
  exitCodeForResults,
  gitlinkPaths,
  isMainModule,
  missingSubmoduleStatusPaths,
  resultStatus,
  submoduleStatusPaths,
  uninitializedSubmodulePaths,
} from "./check-full.mjs";

test("full gate includes both Node and Python checks", () => {
  assert.ok(FULL_CHECKS.some((check) => check.args.includes("scripts/check-fast.mjs")));
  assert.ok(FULL_CHECKS.some((check) => check.command.endsWith(".py")));
  assert.ok(FULL_CHECKS.some((check) => check.args.includes("--strict-inventory")));
  const freshness = FULL_CHECKS.find((check) =>
    check.args.includes("scripts/check-reference-freshness.mjs"),
  );
  const baseFlag = freshness.args.indexOf("--base");
  assert.ok(baseFlag >= 0);
  assert.ok(freshness.args[baseFlag + 1]);
  assert.ok(freshness.args.includes("--strict"));
  const semantic = FULL_CHECKS.find((check) => check.name === "semantic citation evidence coverage");
  assert.ok(semantic.args.includes("--strict-sources"));
});

test("submodule preflight identifies only uninitialized entries", () => {
  const status = [
    "-abc123 vendor/not-ready",
    " def456 vendor/ready (v1.0.0)",
    "+789abc vendor/advanced (heads/main)",
  ].join("\n");
  assert.deepEqual(uninitializedSubmodulePaths(status), ["vendor/not-ready"]);
});

test("submodule preflight detects indexed gitlinks omitted from status", () => {
  const index = [
    "160000 abc123 0\tvendor/ready",
    "160000 def456 0\tvendor/gone",
    "100644 789abc 0\tREADME.md",
    "",
  ].join("\0");
  const status = [
    " abc123 vendor/ready (v1.0.0)",
    " fedcba vendor/nested (heads/main)",
  ].join("\n");

  assert.deepEqual(gitlinkPaths(index), ["vendor/ready", "vendor/gone"]);
  assert.deepEqual(submoduleStatusPaths(status), ["vendor/ready", "vendor/nested"]);
  assert.deepEqual(missingSubmoduleStatusPaths(index, status), ["vendor/gone"]);
});

test("advisory failures warn without failing the aggregate gate", () => {
  const results = [
    { code: 0 },
    { code: 1, advisory: true },
  ];
  assert.equal(resultStatus(results[1]), "WARN");
  assert.equal(exitCodeForResults(results), 0);
});

test("successful advisory commands pass without prose-output inference", () => {
  const result = { code: 0, advisory: true, stdout: "advisory: 12\n", stderr: "" };
  assert.equal(resultStatus(result), "PASS");
  assert.equal(exitCodeForResults([result]), 0);
});

test("main-module detection handles encoded paths", () => {
  for (const scriptPath of ["/tmp/dir with space/check-full.mjs", "/tmp/café/check-full.mjs"]) {
    assert.equal(isMainModule(scriptPath, pathToFileURL(scriptPath).href), true);
  }
  assert.equal(
    isMainModule("/tmp/other/check-full.mjs", pathToFileURL("/tmp/check-full.mjs").href),
    false,
  );
});

test("required failures fail the aggregate gate", () => {
  const results = [
    { code: 1, advisory: true },
    { code: 1 },
  ];
  assert.equal(resultStatus(results[1]), "FAIL");
  assert.equal(exitCodeForResults(results), 1);
});
