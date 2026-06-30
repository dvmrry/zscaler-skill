import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkDataContract } from "./check-data-contract.mjs";
import { DATA_REQUIRED_DIRS } from "./lib.mjs";

function tempRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-data-contract-"));
}

function runCheckCommand(args) {
  return childProcess.execFileSync(
    process.execPath,
    [path.join(import.meta.dirname, "check-data-contract.mjs"), ...args],
    {
      encoding: "utf8",
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
  assert.ok(report.warnings.some((warning) => warning.includes("_data/snapshot/ contains only skeleton files")));
  assert.ok(report.warnings.some((warning) => warning.includes("snapshot-backed reasoning unavailable")));
  assert.ok(report.info.some((line) => line.includes("ordinary directory")));
});

test("checkDataContract accepts a configured runtime mount path", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "tenant-data");

  const report = checkDataContract(root, "tenant-data");
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((warning) => warning.includes("tenant-data/snapshot/ contains only skeleton files")));
  assert.ok(report.warnings.some((warning) => warning.includes("no tenant-data/snapshot content")));
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

test("check-data-contract CLI reads mountPath without expanding unrelated private source", () => {
  const root = tempRepo();
  makeDataSkeleton(root, "tenant-data");
  fs.writeFileSync(
    path.join(root, "zscaler-skill-setup.json"),
    `${JSON.stringify({
      runtimeData: {
        mountPath: "tenant-data",
        source: "$ZSCALER_TEST_UNSET_PRIVATE_SOURCE",
      },
    }, null, 2)}\n`,
    "utf8",
  );

  const output = runCheckCommand(["--root", root]);
  assert.match(output, /tenant-data appears to be an ordinary directory/);
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
  fs.mkdirSync(path.join(root, "_data", "snapshot", "zs2"), { recursive: true });
  fs.writeFileSync(path.join(root, "_data", "schemas", "fields.json"), "{}\n", "utf8");

  const report = checkDataContract(root);
  assert.deepEqual(report.errors, []);
  assert.ok(!report.warnings.some((warning) => warning.includes("snapshot-backed reasoning unavailable")));
  assert.ok(!report.warnings.some((warning) => warning.includes("tenant schema hints unavailable")));
});
