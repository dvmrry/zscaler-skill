import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  checkDataRuntimeMount,
  checkGitHooksPath,
  checkNodeVersion,
  checkRepoLayout,
  compareVersions,
  exitCodeForChecks,
  formatJsonReport,
  MIN_NODE_VERSION,
  parseArgs,
  runChecks,
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

test("version comparison and doctor enforce the Node 24.19 boundary", () => {
  assert.equal(compareVersions("24.19.0", MIN_NODE_VERSION), 0);
  assert.equal(compareVersions("24.20.0", MIN_NODE_VERSION), 1);
  assert.equal(compareVersions("24.18.9", MIN_NODE_VERSION), -1);
  assert.equal(versionAtLeast("v25.0.0"), true);
  assert.equal(versionAtLeast("24.18.9"), false);
  assert.equal(checkNodeVersion("24.19.0").status, "ok");
  assert.equal(checkNodeVersion("24.18.9").status, "FAIL");
});

test("Node runtime declarations match the doctor minimum", () => {
  const root = path.resolve(import.meta.dirname, "..");
  const versionFile = fs.readFileSync(path.join(root, ".node-version"), "utf8").trim();
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

  assert.equal(versionFile, MIN_NODE_VERSION);
  assert.equal(packageJson.engines.node, `>=${MIN_NODE_VERSION}`);
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
    { name: "Node version", status: "ok", detail: "24.19.0 >= 24.19.0" },
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
        detail: "24.19.0 >= 24.19.0",
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

test("doctor honors the committed runtime-data mount path", () => {
  const root = tempDir();
  fs.writeFileSync(
    path.join(root, "zscaler-skill-runtime.json"),
    `${JSON.stringify({
      runtimeData: {
        mountPath: "tenant-data",
        tracking: "tracked",
      },
    }, null, 2)}\n`,
    "utf8",
  );
  const mount = path.join(root, "tenant-data");
  fs.mkdirSync(mount, { recursive: true });
  fs.writeFileSync(path.join(mount, "README.md"), "# tenant-data\n", "utf8");
  for (const dirname of ["cases", "schemas", "snapshot", "iac", "audits", "soc-reviews"]) {
    fs.mkdirSync(path.join(mount, dirname), { recursive: true });
    fs.writeFileSync(path.join(mount, dirname, ".gitkeep"), "", "utf8");
  }

  const result = checkDataRuntimeMount(root);
  assert.equal(result.name, "tenant-data runtime mount");
  assert.equal(result.status, "ok");
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
  const parsed = parseArgs(["node", "doctor.mjs", "--json"]);
  assert.equal(parsed.json, true);
  assert.equal(parsed.profile, "full");
});

test("parseArgs accepts only supported doctor profiles", () => {
  assert.equal(
    parseArgs(["node", "doctor.mjs", "--profile", "references"]).profile,
    "references",
  );
  assert.throws(
    () => parseArgs(["node", "doctor.mjs", "--profile"]),
    /--profile requires one of: full, references/,
  );
  assert.throws(
    () => parseArgs(["node", "doctor.mjs", "--profile", "tenant"]),
    /Unknown doctor profile: tenant/,
  );
});

test("references profile skips local runtime and hook checks", () => {
  const root = tempDir();
  makeLayout(root);
  fs.writeFileSync(
    path.join(root, ".gitmodules"),
    '[submodule "vendor/example"]\n\tpath = vendor/example\n\turl = https://example.invalid/vendor.git\n',
    "utf8",
  );
  fs.mkdirSync(path.join(root, "vendor/example"), { recursive: true });
  fs.writeFileSync(path.join(root, "vendor/example/README.md"), "present\n", "utf8");

  const checks = runChecks({ root, profile: "references", nodeVersion: "24.19.0" });
  assert.deepEqual(checks.map((check) => check.name), [
    "Node version",
    "Repo layout",
    "Vendor submodules",
  ]);
  assert.equal(exitCodeForChecks(checks), 0);
});

test("runChecks rejects unknown profiles", () => {
  assert.throws(() => runChecks({ profile: "tenant" }), /Unknown doctor profile: tenant/);
});
