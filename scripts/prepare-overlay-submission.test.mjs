import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { RUNTIME_CONFIG_ENV, SETUP_CONFIG_ENV } from "./lib.mjs";
import { prepareOverlaySubmission, runtimePathToOverlayPath } from "./prepare-overlay-submission.mjs";

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function git(root, args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function commitAll(root, message) {
  git(root, ["add", "."]);
  git(root, [
    "-c",
    "user.name=Zscaler Skill Test",
    "-c",
    "user.email=zscaler-skill-test@example.invalid",
    "commit",
    "-m",
    message,
  ]);
}

function makeRootWithCase(mountPath = "_data") {
  const root = tempDir("zscaler-overlay-root-");
  const caseDir = path.join(root, mountPath, "cases", "2026-05-18-example");
  fs.mkdirSync(caseDir, { recursive: true });
  fs.writeFileSync(path.join(caseDir, "case-intake.json"), "{\"status\":\"pass\"}\n", "utf8");
  fs.writeFileSync(path.join(caseDir, "journal.md"), "# Journal\n", "utf8");
  return { root, caseDir };
}

function makeRootWithKnowledge(mountPath = "_data") {
  const root = tempDir("zscaler-overlay-knowledge-");
  const knowledgeDir = path.join(root, mountPath, "knowledge", "zpa");
  fs.mkdirSync(knowledgeDir, { recursive: true });
  const recordPath = path.join(knowledgeDir, "browser-access-cookie.md");
  fs.writeFileSync(recordPath, "---\ntitle: Browser Access cookie\n---\n", "utf8");
  return { root, recordPath };
}

function makeOverlayRepo() {
  const repo = tempDir("zscaler-overlay-repo-");
  git(repo, ["init", "-b", "main"]);
  fs.writeFileSync(path.join(repo, "README.md"), "# overlay\n", "utf8");
  commitAll(repo, "initial overlay");
  return repo;
}

function runPrepareCommand(args, options = {}) {
  const env = { ...process.env };
  delete env[RUNTIME_CONFIG_ENV];
  delete env[SETUP_CONFIG_ENV];
  return childProcess.execFileSync(
    process.execPath,
    [path.join(import.meta.dirname, "prepare-overlay-submission.mjs"), ...args],
    {
      encoding: "utf8",
      env: { ...env, ...options.env },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
}

test("prepareOverlaySubmission requires explicit approval by default", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();

  assert.throws(
    () => prepareOverlaySubmission({
      approve: false,
      artifacts: [caseDir],
      branchPrefix: "case-submission/",
      defaultBranch: "main",
      dryRun: false,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
    /explicit approval required/,
  );
});

test("prepareOverlaySubmission rejects artifacts outside allowed roots", () => {
  const root = tempDir("zscaler-overlay-outside-");
  const overlay = makeOverlayRepo();
  const outside = path.join(root, "README.md");
  fs.writeFileSync(outside, "# public\n", "utf8");

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [outside],
      branchPrefix: "case-submission/",
      defaultBranch: "main",
      dryRun: true,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
    /outside allowed roots/,
  );
});

test("prepareOverlaySubmission rejects obvious secret material", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();
  fs.writeFileSync(
    path.join(caseDir, "bad.pem"),
    "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n",
    "utf8",
  );

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [caseDir],
      branchPrefix: "case-submission/",
      defaultBranch: "main",
      dryRun: true,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
    /possible private key material/,
  );
});

test("prepareOverlaySubmission rejects Azure DevOps PAT-shaped material", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();
  fs.writeFileSync(
    path.join(caseDir, "ado.env"),
    "AZURE_DEVOPS_EXT_PAT=aaaaaaaaaaaaaaaaaaaaaaaaAZDOaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n",
    "utf8",
  );

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [caseDir],
      branchPrefix: "case-submission/",
      defaultBranch: "main",
      dryRun: true,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
    /possible Azure DevOps token/,
  );
});

test("prepareOverlaySubmission rejects credential assignment material", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();
  fs.writeFileSync(
    path.join(caseDir, "credentials.json"),
    "{\"client_secret\":\"super-secret-client-value\"}\n",
    "utf8",
  );

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [caseDir],
      branchPrefix: "case-submission/",
      defaultBranch: "main",
      dryRun: true,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
    /possible credential assignment/,
  );
});

test("prepareOverlaySubmission rejects symlink artifacts", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();
  const outside = path.join(root, "outside.txt");
  fs.writeFileSync(outside, "outside\n", "utf8");
  fs.symlinkSync(outside, path.join(caseDir, "linked-outside.txt"));

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [caseDir],
      branchPrefix: "case-submission/",
      defaultBranch: "main",
      dryRun: true,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
    /symlink artifacts are not allowed/,
  );
});

test("prepareOverlaySubmission rejects files that exceed the scan limit", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();
  fs.writeFileSync(path.join(caseDir, "large.log"), Buffer.alloc(5 * 1024 * 1024 + 1, "a"));

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [caseDir],
      branchPrefix: "case-submission/",
      defaultBranch: "main",
      dryRun: true,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
    /exceeds scan limit/,
  );
});

test("prepareOverlaySubmission reports binary files as unscanned text", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();
  fs.writeFileSync(path.join(caseDir, "artifact.bin"), Buffer.from([0, 1, 2, 3]));

  const result = prepareOverlaySubmission({
    approve: true,
    artifacts: [caseDir],
    branchPrefix: "case-submission/",
    defaultBranch: "main",
    dryRun: true,
    repoUrl: overlay,
    requireExplicitApproval: true,
    root,
    allowedRoots: ["_data/cases"],
  });

  assert.deepEqual(result.warnings, ["_data/cases/2026-05-18-example/artifact.bin: not scanned as text"]);
});

test("prepareOverlaySubmission accepts artifacts under a configured runtime mount", () => {
  const { root, caseDir } = makeRootWithCase("tenant-data");
  const overlay = makeOverlayRepo();

  const result = prepareOverlaySubmission({
    approve: true,
    artifacts: [caseDir],
    branchPrefix: "case-submission/",
    defaultBranch: "main",
    dryRun: true,
    mountPath: "tenant-data",
    repoUrl: overlay,
    requireExplicitApproval: true,
    root,
    allowedRoots: ["tenant-data/cases"],
  });

  assert.equal(result.files[0], "cases/2026-05-18-example");
  assert.equal(result.sourceFiles[0], "tenant-data/cases/2026-05-18-example");
});

test("prepare-overlay-submission CLI merges shared policy with a private repo target", () => {
  const { root, caseDir } = makeRootWithCase("tenant-data");
  const overlay = makeOverlayRepo();
  fs.writeFileSync(
    path.join(root, "downstream-runtime.json"),
    JSON.stringify({
      runtimeData: { mountPath: "tenant-data", tracking: "tracked" },
      overlaySubmission: {
        allowedRoots: ["cases"],
        branchPrefix: "shared-submission/",
        defaultBranch: "main",
        requireExplicitApproval: false,
      },
    }),
    "utf8",
  );
  fs.writeFileSync(
    path.join(root, "zscaler-skill-setup.json"),
    JSON.stringify({ overlaySubmission: { repoUrl: overlay } }),
    "utf8",
  );

  const output = runPrepareCommand([
    "--root",
    root,
    "--runtime-config",
    "downstream-runtime.json",
    "--case-path",
    path.relative(root, caseDir),
    "--dry-run",
  ]);

  assert.match(output, /Status: dry-run/);
  assert.match(output, /Branch: shared-submission\/2026-05-18-example-/);
  assert.match(output, /FILE: cases\/2026-05-18-example/);
});

test("prepare-overlay-submission accepts knowledge under the default allowed roots", () => {
  const { root, recordPath } = makeRootWithKnowledge();
  const overlay = makeOverlayRepo();

  const output = runPrepareCommand([
    "--root",
    root,
    "--repo-url",
    overlay,
    "--artifact",
    path.relative(root, recordPath),
    "--approve",
    "--dry-run",
  ]);

  assert.match(output, /Status: dry-run/);
  assert.match(output, /FILE: knowledge\/zpa\/browser-access-cookie\.md/);
});

test("prepare-overlay-submission rejects private repoUrl in shared runtime config", () => {
  const { root, caseDir } = makeRootWithCase();
  fs.writeFileSync(
    path.join(root, "downstream-runtime.json"),
    JSON.stringify({
      runtimeData: { mountPath: "_data", tracking: "ignored" },
      overlaySubmission: { repoUrl: "https://example.invalid/private-overlay.git" },
    }),
    "utf8",
  );

  assert.throws(
    () => runPrepareCommand([
      "--root",
      root,
      "--runtime-config",
      "downstream-runtime.json",
      "--case-path",
      path.relative(root, caseDir),
      "--dry-run",
    ]),
    /private bootstrap data/,
  );
});

test("prepareOverlaySubmission rejects allowed roots with traversal", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [caseDir],
      branchPrefix: "case-submission/",
      defaultBranch: "main",
      dryRun: true,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases/../../etc"],
    }),
    /allowed root must not contain/,
  );
});

test("prepareOverlaySubmission rejects an option-like default branch", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [caseDir],
      branchPrefix: "case-submission/",
      defaultBranch: "--upload-pack=/evil",
      dryRun: true,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
    /branch/,
  );
});

test("prepareOverlaySubmission rejects an option-like branch prefix", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [caseDir],
      branchPrefix: "-evil/",
      defaultBranch: "main",
      dryRun: true,
      repoUrl: overlay,
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
    /branch name/,
  );
});

test("prepareOverlaySubmission cleans up the temp clone when the clone fails", () => {
  const { root, caseDir } = makeRootWithCase();
  const leaked = () => fs.readdirSync(os.tmpdir()).filter((n) => n.startsWith("zscaler-overlay-submission-"));
  const before = leaked();

  assert.throws(
    () => prepareOverlaySubmission({
      approve: true,
      artifacts: [caseDir],
      branchPrefix: "case-submission/",
      defaultBranch: "main",
      dryRun: false,
      repoUrl: path.join(root, "no-such-overlay-repo.git"),
      requireExplicitApproval: true,
      root,
      allowedRoots: ["_data/cases"],
    }),
  );

  assert.deepEqual(leaked(), before);
});

test("runtimePathToOverlayPath maps runtime _data paths to overlay-root paths", () => {
  assert.equal(runtimePathToOverlayPath("_data/cases/example"), "cases/example");
  assert.equal(runtimePathToOverlayPath("_data/schemas/fields.json"), "schemas/fields.json");
  assert.equal(runtimePathToOverlayPath("_data/iac/main.tf"), "iac/main.tf");
  assert.equal(runtimePathToOverlayPath("_data/knowledge/zpa/claim.md"), "knowledge/zpa/claim.md");
  assert.equal(runtimePathToOverlayPath("tenant-data/cases/example", "tenant-data"), "cases/example");
  assert.throws(() => runtimePathToOverlayPath("references/zpa/app-segments.md"), /must start with _data/);
  assert.throws(
    () => runtimePathToOverlayPath("_data/cases/example", "tenant-data"),
    /must start with tenant-data/,
  );
});

test("prepareOverlaySubmission creates an overlay branch and commit without pushing", () => {
  const { root, caseDir } = makeRootWithCase();
  const overlay = makeOverlayRepo();

  const result = prepareOverlaySubmission({
    approve: true,
    artifacts: [caseDir],
    branchPrefix: "case-submission/",
    defaultBranch: "main",
    dryRun: false,
    repoUrl: overlay,
    requireExplicitApproval: true,
    root,
    allowedRoots: ["_data/cases", "_data/schemas", "_data/iac"],
  });

  assert.equal(result.status, "prepared");
  assert.match(result.branch, /^case-submission\/2026-05-18-example-/);
  assert.equal(result.files[0], "cases/2026-05-18-example");
  assert.equal(result.sourceFiles[0], "_data/cases/2026-05-18-example");
  assert.equal(fs.existsSync(path.join(result.overlayCheckout, "cases", "2026-05-18-example", "journal.md")), true);
  assert.equal(fs.existsSync(path.join(result.overlayCheckout, "_data", "cases", "2026-05-18-example", "journal.md")), false);
  assert.equal(git(result.overlayCheckout, ["rev-parse", "--abbrev-ref", "HEAD"]), result.branch);
  assert.match(result.nextAction, /^git -C .* push origin case-submission\/2026-05-18-example-/);
});
