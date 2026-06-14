import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkDataContract } from "./check-data-contract.mjs";
import { DATA_REQUIRED_DIRS } from "./lib.mjs";

function tempRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-data-contract-"));
}

function makeDataSkeleton(root) {
  const dataDir = path.join(root, "_data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, "README.md"), "# _data\n", "utf8");
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
  assert.ok(report.errors.includes("_data/cases/ directory is missing"));
  assert.ok(report.errors.includes("_data/schemas/ directory is missing"));
  assert.ok(report.errors.includes("_data/snapshot/ directory is missing"));
  assert.ok(report.errors.includes("_data/iac/ directory is missing"));
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
