import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  FULL_CHECKS,
  exitCodeForResults,
  gitlinkPaths,
  missingSubmoduleStatusPaths,
  resultStatus,
  submoduleStatusPaths,
  uninitializedSubmodulePaths,
} from "./check-full.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("full gate includes both Node and Python checks", () => {
  assert.ok(FULL_CHECKS.some((check) => check.args.includes("scripts/check-fast.mjs")));
  assert.ok(FULL_CHECKS.some((check) => check.command.endsWith(".py")));
  assert.ok(FULL_CHECKS.some((check) => check.args.includes("scripts/agent_patterns.test.py")));
  assert.ok(FULL_CHECKS.some((check) => check.args.join(" ") === "scripts/kb.mjs validate"));
  assert.ok(FULL_CHECKS.some((check) => check.args.join(" ") === "scripts/kb.mjs lint --strict"));
});

test("hygiene CI runs the full gate and nothing else", () => {
  const workflow = fs.readFileSync(path.join(repositoryRoot, ".github", "workflows", "check-hygiene.yml"), "utf8");
  assert.match(workflow, /run: node scripts\/check-full\.mjs/);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
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

test("required failures fail the aggregate gate", () => {
  const results = [
    { code: 1, advisory: true },
    { code: 1 },
  ];
  assert.equal(resultStatus(results[1]), "FAIL");
  assert.equal(exitCodeForResults(results), 1);
});
