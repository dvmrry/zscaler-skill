import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  FULL_CHECKS,
  exitCodeForResults,
  gitFailure,
  gitlinkPaths,
  missingSubmoduleStatusPaths,
  resultStatus,
  submodulePreflight,
  submoduleStatusPaths,
  uninitializedSubmodulePaths,
} from "./check-full.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// A git hook (check-fast runs from pre-push) sets GIT_DIR for a linked worktree; the scratch repository below would
// then be the outer one, and its 15,000 entries would land in that index. submodulePreflight inherits process.env.
for (const key of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete process.env[key];

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

test("a git listing cut short fails the preflight with the error, not the listing", () => {
  const cut = { status: 0, error: new Error("spawnSync git ENOBUFS"), stdout: "100644 abc 0\tREADME.md\0".repeat(1000), stderr: "" };
  assert.deepEqual(gitFailure(cut, "git ls-files"), { code: 1, detail: "spawnSync git ENOBUFS" });
  assert.deepEqual(gitFailure({ status: null, stdout: "", stderr: "" }, "git ls-files"), { code: 1, detail: "git ls-files failed" });
  assert.equal(gitFailure({ status: 0, stdout: "", stderr: "" }, "git ls-files"), null);
});

test("submodule preflight reads an index listing past a megabyte", () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "check-full-index-"));
  try {
    execFileSync("git", ["init", "-q", repo]);
    const blob = execFileSync("git", ["-C", repo, "hash-object", "-w", "--stdin"], { input: "" }).toString().trim();
    const entries = Array.from({ length: 15000 }, (_, i) => `100644 ${blob}\treferences/_meta/text/product/subject-${i}.md`);
    execFileSync("git", ["-C", repo, "update-index", "--add", "--index-info"], { input: `${entries.join("\n")}\n` });
    assert.ok(execFileSync("git", ["-C", repo, "ls-files", "--stage", "-z"], { maxBuffer: 256 << 20 }).length > 1 << 20);
    assert.deepEqual(submodulePreflight(repo), { code: 0, detail: "all indexed submodules are initialized" });
  } finally {
    fs.rmSync(repo, { recursive: true, force: true });
  }
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
