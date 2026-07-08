import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  checkGitHooksPath,
  checkRepoLayout,
  compareVersions,
  exitCodeForChecks,
  formatJsonReport,
  parseArgs,
  versionAtLeast,
} from "./doctor.mjs";

function tempDir(prefix = "zscaler-doctor-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function makeLayout(root) {
  fs.writeFileSync(path.join(root, "SKILL.md"), "# Test Skill\n", "utf8");
  for (const dirname of ["references", "agents", "scripts"]) {
    fs.mkdirSync(path.join(root, dirname), { recursive: true });
  }
}

test("version comparison handles Node 18 boundary", () => {
  assert.equal(compareVersions("18.0.0", "18.0.0"), 0);
  assert.equal(compareVersions("18.1.0", "18.0.0"), 1);
  assert.equal(compareVersions("17.9.9", "18.0.0"), -1);
  assert.equal(versionAtLeast("v20.3.1", "18.0.0"), true);
  assert.equal(versionAtLeast("16.20.2", "18.0.0"), false);
});

test("repo layout check accepts the expected top-level files and directories", () => {
  const root = tempDir();
  makeLayout(root);

  const result = checkRepoLayout(root);
  assert.equal(result.status, "ok");
  assert.equal(result.next, undefined);
});

test("repo layout check reports missing entries against a temp dir", () => {
  const root = tempDir();
  makeLayout(root);
  fs.rmSync(path.join(root, "references"), { recursive: true, force: true });

  const result = checkRepoLayout(root);
  assert.equal(result.status, "FAIL");
  assert.match(result.detail, /references\//);
  assert.equal(result.next, "docs/getting-started.md#clone-with-submodules");
});

test("JSON report includes checks array and overall ok flag", () => {
  const checks = [
    { name: "Node version", status: "ok", detail: "20.0.0 >= 18.0.0" },
    {
      name: "_data runtime mount",
      status: "skip",
      detail: "_data/ not present; runtime data is optional",
      next: "docs/getting-started.md#set-up-runtime-data",
    },
  ];

  const parsed = JSON.parse(formatJsonReport(checks));
  assert.deepEqual(parsed, {
    checks: [
      {
        name: "Node version",
        status: "ok",
        detail: "20.0.0 >= 18.0.0",
        next: null,
      },
      {
        name: "_data runtime mount",
        status: "skip",
        detail: "_data/ not present; runtime data is optional",
        next: "docs/getting-started.md#set-up-runtime-data",
      },
    ],
    ok: true,
  });
});

test("exit-code logic ignores skips and fails on required failures", () => {
  assert.equal(exitCodeForChecks([
    { name: "Node version", status: "ok", detail: "ok" },
    { name: "_data runtime mount", status: "skip", detail: "optional" },
  ]), 0);
  assert.equal(exitCodeForChecks([
    { name: "Git hooks path", status: "FAIL", detail: "wrong hooks path" },
  ]), 1);
});

test("a present-but-invalid _data mount fails the run (deliberate fail-closed)", () => {
  // Absent _data is a skip (exit 0, covered above); a _data that exists but
  // violates the contract must surface as FAIL and flip the exit code.
  assert.equal(exitCodeForChecks([
    { name: "Node version", status: "ok", detail: "ok" },
    { name: "_data runtime mount", status: "FAIL", detail: "2 contract error(s)" },
  ]), 1);
});

test("next commands embed the repo root so they are cwd-safe", () => {
  const root = tempDir();
  fs.mkdirSync(path.join(root, ".git")); // enough for git to treat it as a repo dir
  const result = checkGitHooksPath(root);
  assert.equal(result.status, "FAIL");
  if (result.next.startsWith("git ")) {
    assert.match(result.next, new RegExp(`git -C ${root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} config`));
  } else {
    assert.equal(result.next, "docs/getting-started.md#clone-with-submodules");
  }
});

test("parseArgs rejects the removed --root flag and unknown arguments", () => {
  assert.throws(() => parseArgs(["node", "doctor.mjs", "--root", "/tmp"]), /Unknown argument: --root/);
  assert.deepEqual(parseArgs(["node", "doctor.mjs", "--json"]).json, true);
});
