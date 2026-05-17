import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { isSkeletonTree, setupDataMount } from "./setup-data-mount.mjs";

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function makeDataSkeleton(root) {
  const dataDir = path.join(root, "_data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, "README.md"), "# _data\n", "utf8");
  for (const dir of ["cases", "schemas", "snapshot", "iac"]) {
    const target = path.join(dataDir, dir);
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, ".gitkeep"), "", "utf8");
  }
}

function makeOverlaySource() {
  const source = tempDir("zscaler-data-source-");
  fs.writeFileSync(path.join(source, "README.md"), "# overlay data\n", "utf8");
  for (const dir of ["cases", "schemas", "snapshot", "iac"]) {
    fs.mkdirSync(path.join(source, dir), { recursive: true });
  }
  fs.mkdirSync(path.join(source, "snapshot", "zs1"), { recursive: true });
  fs.writeFileSync(path.join(source, "schemas", "fields.json"), "{}\n", "utf8");
  fs.writeFileSync(path.join(source, "snapshot", "zs1", "_manifest.json"), "{}\n", "utf8");
  return source;
}

test("isSkeletonTree accepts only README and .gitkeep files", () => {
  const root = tempDir("zscaler-data-skeleton-");
  makeDataSkeleton(root);
  assert.equal(isSkeletonTree(path.join(root, "_data")), true);

  fs.writeFileSync(path.join(root, "_data", "schemas", "fields.json"), "{}\n", "utf8");
  assert.equal(isSkeletonTree(path.join(root, "_data")), false);
});

test("setupDataMount copies a local data source and runs the contract check", () => {
  const root = tempDir("zscaler-data-mount-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();

  const result = setupDataMount({
    root,
    dataUrl: source,
    dataRef: null,
    dryRun: false,
    force: false,
  });

  assert.equal(result.plan.mode, "copy");
  assert.deepEqual(result.report.errors, []);
  assert.equal(fs.existsSync(path.join(root, "_data", "schemas", "fields.json")), true);
  assert.equal(fs.existsSync(path.join(root, "_data", "snapshot", "zs1", "_manifest.json")), true);
  assert.ok(!result.report.warnings.some((warning) => warning.includes("snapshot-backed reasoning unavailable")));
});

test("setupDataMount refuses to replace populated data without force", () => {
  const root = tempDir("zscaler-data-populated-");
  makeDataSkeleton(root);
  fs.writeFileSync(path.join(root, "_data", "schemas", "fields.json"), "{}\n", "utf8");
  const source = makeOverlaySource();

  assert.throws(
    () => setupDataMount({
      root,
      dataUrl: source,
      dataRef: null,
      dryRun: false,
      force: false,
    }),
    /non-skeleton files/,
  );
});

test("setupDataMount dry-run reports the plan without replacing files", () => {
  const root = tempDir("zscaler-data-dry-run-");
  makeDataSkeleton(root);
  const source = makeOverlaySource();

  const result = setupDataMount({
    root,
    dataUrl: source,
    dataRef: "main",
    dryRun: true,
    force: false,
  });

  assert.equal(result.plan.mode, "copy");
  assert.equal(result.plan.dataRef, "main");
  assert.equal(result.report, null);
  assert.equal(fs.existsSync(path.join(root, "_data", "snapshot", "zs1", "_manifest.json")), false);
});
