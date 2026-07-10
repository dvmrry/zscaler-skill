import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { RUNTIME_CONFIG_ENV, SETUP_CONFIG_ENV } from "./lib.mjs";
import { resolveRuntimeDataOutput } from "./runtime-data-path.mjs";

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function runCli(root, args = [], env = {}) {
  const cleanEnv = { ...process.env };
  delete cleanEnv[RUNTIME_CONFIG_ENV];
  delete cleanEnv[SETUP_CONFIG_ENV];
  return childProcess.execFileSync(
    process.execPath,
    [path.join(import.meta.dirname, "runtime-data-path.mjs"), "--root", root, ...args],
    {
      encoding: "utf8",
      env: { ...cleanEnv, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    },
  ).trim();
}

test("runtime-data-path resolves repository-relative and absolute paths", () => {
  const root = tempDir("zskill-runtime-path-");
  fs.writeFileSync(
    path.join(root, "zscaler-skill-runtime.json"),
    JSON.stringify({ runtimeData: { mountPath: "tenant-data", tracking: "tracked" } }),
    "utf8",
  );

  assert.equal(runCli(root, ["schemas", "report.md"]), "tenant-data/schemas/report.md");
  assert.equal(
    runCli(root, ["--absolute", "schemas", "report.md"]),
    path.join(root, "tenant-data", "schemas", "report.md"),
  );
});

test("runtime-data-path honors a downstream-selected runtime config", () => {
  const root = tempDir("zskill-runtime-path-selected-");
  fs.writeFileSync(
    path.join(root, "downstream.json"),
    JSON.stringify({ runtimeData: { mountPath: "downstream-data", tracking: "ignored" } }),
    "utf8",
  );

  assert.equal(
    runCli(root, ["cases", "example"], { [RUNTIME_CONFIG_ENV]: "downstream.json" }),
    "downstream-data/cases/example",
  );
});

test("runtime-data-path JSON output reports config provenance without tenant contents", () => {
  const root = tempDir("zskill-runtime-path-json-");
  fs.writeFileSync(
    path.join(root, "runtime.json"),
    JSON.stringify({ runtimeData: { mountPath: "private-data", tracking: "tracked" } }),
    "utf8",
  );
  const result = JSON.parse(runCli(root, ["--runtime-config", "runtime.json", "--json"]));

  assert.equal(result.mountPath, "private-data");
  assert.equal(result.path, "private-data");
  assert.equal(result.runtimeConfigSelectedBy, "option");
  assert.equal(result.tracking, "tracked");
});

test("runtime-data-path rejects traversal outside the mount", () => {
  const root = tempDir("zskill-runtime-path-traversal-");
  assert.throws(
    () => resolveRuntimeDataOutput({ root, segments: ["..", "outside"] }),
    /stay inside the configured mount/,
  );
});
