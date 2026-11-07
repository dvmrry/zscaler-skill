import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkDataContract, detectDataSubmodule } from "./check-data-contract.mjs";
import { DATA_REQUIRED_DIRS, RUNTIME_CONFIG_ENV, SETUP_CONFIG_ENV } from "./lib.mjs";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

function tempRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-data-contract-"));
}

for (const [entry, expected] of [
  ["path = tenant-data/iac/module", false],
  ["path = tenant-data-backup", false],
  ["# path = tenant-data", false],
  ["path = tenant-data", true],
  ['path = "tenant-data" # actual mount', true],
  ["path=tenant-data", true],
]) {
  test(`submodule detection matches exact Git config path: ${entry}`, (t) => {
    const root = tempRepo();
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.writeFileSync(path.join(root, ".gitmodules"), `[submodule "fixture"]\n\t${entry}\n`);
    assert.equal(detectDataSubmodule(root, "tenant-data").isSubmodule, expected);
  });
}

function runCheckCommand(args, options = {}) {
  const env = { ...process.env };
  delete env[RUNTIME_CONFIG_ENV];
  delete env[SETUP_CONFIG_ENV];
  return childProcess.execFileSync(
    process.execPath,
    [path.join(import.meta.dirname, "check-data-contract.mjs"), ...args],
    {
      encoding: "utf8",
      env: { ...env, ...options.env },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
}

function git(root, args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function makeDataSkeleton(root, mountPath = "_data") {
  const dataDir = path.join(root, mountPath);
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, "README.md"), `# ${mountPath}\n`, "utf8");
  for (const dir of DATA_REQUIRED_DIRS) {
    const target = path.join(dataDir, dir);
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, ".gitkeep"), "", "utf8");
  }
}

test("checkDataContract accepts an empty runtime mount with warnings", () => {
  const root = tempRepo();
  makeDataSkeleton(root);

  const report = checkDataContract(root);
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((warning) => warning.includes("_data/overlay/ contains only skeleton files")));
  assert.ok(report.warnings.some((warning) => warning.includes("no _data/overlay/overlay.json")));
  assert.ok(report.info.some((line) => line.includes("ordinary directory")));
});

test("checkDataContract accepts a configured runtime mount path", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "tenant-data");

  const report = checkDataContract(root, "tenant-data");
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((warning) => warning.includes("tenant-data/overlay/ contains only skeleton files")));
  assert.ok(report.warnings.some((warning) => warning.includes("no tenant-data/overlay/overlay.json")));
  assert.ok(report.info.some((line) => line.includes("tenant-data appears to be an ordinary directory")));
});

test("checkDataContract warns when a custom runtime mount is not ignored", () => {
  const root = tempRepo();
  git(root, ["init", "-b", "main"]);
  makeDataSkeleton(root, "tenant-data");

  const report = checkDataContract(root, "tenant-data");

  assert.ok(report.warnings.some((warning) => warning.includes("tenant-data/ is a custom runtime-data mount")));
  assert.ok(report.warnings.some((warning) => warning.includes(".git/info/exclude")));
});

test("checkDataContract accepts a custom runtime mount that is locally ignored", () => {
  const root = tempRepo();
  git(root, ["init", "-b", "main"]);
  makeDataSkeleton(root, "tenant-data");
  const excludePath = path.join(root, ".git", "info", "exclude");
  fs.appendFileSync(excludePath, "tenant-data/\n", "utf8");

  const report = checkDataContract(root, "tenant-data");

  assert.ok(!report.warnings.some((warning) => warning.includes("custom runtime-data mount")));
});

test("checkDataContract accepts a tracked work-mirror runtime mount", () => {
  const root = tempRepo();
  git(root, ["init", "-b", "main"]);
  makeDataSkeleton(root, "tenant-data");

  const report = checkDataContract(root, "tenant-data", { tracking: "tracked" });

  assert.ok(report.info.some((line) => line.includes("tenant-data is configured as tracked runtime data")));
  assert.ok(!report.warnings.some((warning) => warning.includes("not ignored by git")));
});

test("checkDataContract warns when tracked runtime data is ignored", () => {
  const root = tempRepo();
  git(root, ["init", "-b", "main"]);
  makeDataSkeleton(root, "tenant-data");
  fs.appendFileSync(path.join(root, ".git", "info", "exclude"), "tenant-data/\n", "utf8");

  const report = checkDataContract(root, "tenant-data", { tracking: "tracked" });

  assert.ok(report.warnings.some((warning) => warning.includes("configured as tracked runtime data but is ignored")));
});

test("check-data-contract CLI reads mountPath without expanding unrelated private source", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "tenant-data");
  fs.writeFileSync(
    path.join(root, "zscaler-skill-setup.json"),
    `${JSON.stringify({
      runtimeData: {
        mountPath: "tenant-data",
        tracking: "tracked",
        source: "$ZSCALER_TEST_UNSET_PRIVATE_SOURCE",
      },
    }, null, 2)}\n`,
    "utf8",
  );

  const output = runCheckCommand(["--root", root]);
  assert.match(output, /tenant-data appears to be an ordinary directory/);
  assert.match(output, /tenant-data is configured as tracked runtime data/);
  assert.match(output, /Errors: 0/);
});

test("check-data-contract CLI reads committed runtime layout config", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "tenant-data");
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

  const output = runCheckCommand(["--root", root]);
  assert.match(output, /tenant-data appears to be an ordinary directory/);
  assert.match(output, /tenant-data is configured as tracked runtime data/);
  assert.match(output, /Errors: 0/);
});

test("check-data-contract CLI honors the downstream runtime config selector", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "downstream-data");
  fs.writeFileSync(
    path.join(root, "root-runtime.json"),
    JSON.stringify({ runtimeData: { mountPath: "downstream-data", tracking: "tracked" } }),
    "utf8",
  );

  const output = runCheckCommand(["--root", root], {
    env: { ZSCALER_SKILL_RUNTIME_CONFIG: "root-runtime.json" },
  });

  assert.match(output, /downstream-data appears to be an ordinary directory/);
  assert.match(output, /downstream-data is configured as tracked runtime data/);
  assert.match(output, /Errors: 0/);
});

test("checkDataContract warns when runtime README is missing", () => {
  const root = tempRepo();
  const dataDir = path.join(root, "_data");
  fs.mkdirSync(dataDir, { recursive: true });
  for (const dir of DATA_REQUIRED_DIRS) {
    fs.mkdirSync(path.join(dataDir, dir), { recursive: true });
  }

  const report = checkDataContract(root);
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.includes("_data/README.md is missing"));
});

test("checkDataContract errors when required directories are missing", () => {
  const root = tempRepo();
  fs.mkdirSync(path.join(root, "_data"), { recursive: true });
  fs.writeFileSync(path.join(root, "_data", "README.md"), "# _data\n", "utf8");

  const report = checkDataContract(root);
  for (const dir of DATA_REQUIRED_DIRS) {
    assert.ok(report.errors.includes(`_data/${dir}/ directory is missing`));
  }
});

test("checkDataContract treats populated directories as available", () => {
  const root = tempRepo();
  makeDataSkeleton(root);
  fs.writeFileSync(path.join(root, "_data", "overlay", "overlay.json"), '{ "schema_version": 1 }\n', "utf8");
  fs.writeFileSync(path.join(root, "_data", "schemas", "fields.json"), "{}\n", "utf8");

  const report = checkDataContract(root);
  assert.deepEqual(report.errors, []);
  assert.ok(!report.warnings.some((warning) => warning.includes("overlay/overlay.json")));
  assert.ok(!report.warnings.some((warning) => warning.includes("tenant schema hints unavailable")));
});

test("company knowledge: retired Markdown records under knowledge/ are flagged, never read", () => {
  const root = tempRepo();
  makeDataSkeleton(root);
  fs.mkdirSync(path.join(root, "_data", "knowledge", "zpa"), { recursive: true });
  fs.writeFileSync(path.join(root, "_data", "knowledge", "README.md"), "# Local knowledge\n", "utf8");
  fs.writeFileSync(path.join(root, "_data", "knowledge", "zpa", "claim.md"), "---\ntitle: x\n---\n", "utf8");
  const report = checkDataContract(root);
  assert.ok(report.warnings.some((w) => /1 Markdown knowledge record\(s\) under _data\/knowledge\/ use the retired format/.test(w)));
  assert.deepEqual(report.errors, []);
});

test("company knowledge: the overlay is validated against the public graph", () => {
  const root = tempRepo();
  makeDataSkeleton(root);
  fs.cpSync(path.join(REPO_ROOT, "references"), path.join(root, "references"), { recursive: true });
  const overlay = path.join(root, "_data", "overlay");
  fs.rmSync(overlay, { recursive: true, force: true });
  fs.cpSync(path.join(REPO_ROOT, "scripts", "fixtures", "kb-overlay"), overlay, { recursive: true });
  assert.deepEqual(checkDataContract(root).errors, [], "the synthetic overlay is valid");

  const rec = path.join(overlay, "knowledge", "zia", "company.zia.first-pass-user-context.json");
  const data = JSON.parse(fs.readFileSync(rec, "utf8"));
  delete data.validated;
  fs.writeFileSync(rec, JSON.stringify(data));
  const errors = checkDataContract(root).errors;
  assert.ok(errors.some((e) => /_data\/overlay\/knowledge\/zia\/company\.zia\.first-pass-user-context\.json: a claim needs validated/.test(e)));
});

test("company knowledge: an overlay is reported unvalidated when the public graph is unavailable", () => {
  const root = tempRepo();
  makeDataSkeleton(root);
  fs.writeFileSync(path.join(root, "_data", "overlay", "overlay.json"), '{ "schema_version": 1 }\n', "utf8");
  const report = checkDataContract(root);
  assert.ok(report.warnings.some((w) => w.startsWith("company overlay not validated")));
});
