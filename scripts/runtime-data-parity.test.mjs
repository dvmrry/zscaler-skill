import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  RUNTIME_CONFIG_ENV,
  runtimeDataMountSettings,
  SETUP_CONFIG_ENV,
} from "./lib.mjs";

const PYTHON_SNIPPET = `
import json
import sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
from runtime_data import runtime_data_mount_settings
print(json.dumps(runtime_data_mount_settings(Path(sys.argv[2]))))
`;

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function cleanEnv(overrides = {}) {
  const env = { ...process.env, ...overrides };
  delete env[RUNTIME_CONFIG_ENV];
  delete env[SETUP_CONFIG_ENV];
  return { ...env, ...overrides };
}

function pythonSettings(root, overrides = {}) {
  const output = childProcess.execFileSync(
    "python3",
    ["-c", PYTHON_SNIPPET, import.meta.dirname, root],
    {
      encoding: "utf8",
      env: cleanEnv(overrides),
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  return JSON.parse(output);
}

function comparable(settings) {
  return {
    mountPath: settings.mountPath,
    tracking: settings.tracking,
    runtimeConfigSelectedBy: settings.runtimeConfigSelectedBy,
    setupConfigSelectedBy: settings.setupConfigSelectedBy,
  };
}

test("JavaScript and Python select the same downstream runtime and setup configs", () => {
  const root = tempDir("zskill-runtime-parity-");
  fs.writeFileSync(
    path.join(root, "zscaler-skill-runtime.json"),
    JSON.stringify({ runtimeData: { mountPath: "root-data", tracking: "ignored" } }),
    "utf8",
  );
  fs.writeFileSync(
    path.join(root, "selected-runtime.json"),
    JSON.stringify({ runtimeData: { mountPath: "selected-data", tracking: "tracked" } }),
    "utf8",
  );
  fs.writeFileSync(
    path.join(root, "selected-setup.json"),
    JSON.stringify({ runtimeData: { mountPath: "local-data", tracking: "ignored" } }),
    "utf8",
  );
  const env = {
    [RUNTIME_CONFIG_ENV]: "selected-runtime.json",
    [SETUP_CONFIG_ENV]: "selected-setup.json",
  };

  const js = runtimeDataMountSettings(root, { env });
  const python = pythonSettings(root, env);

  assert.deepEqual(comparable(python), comparable(js));
  assert.equal(js.mountPath, "local-data");
});

test("JavaScript and Python both fail for a missing selected runtime config", () => {
  const root = tempDir("zskill-runtime-parity-missing-");
  const env = { [RUNTIME_CONFIG_ENV]: "missing.json" };

  assert.throws(() => runtimeDataMountSettings(root, { env }), /selects a missing file/);
  assert.throws(() => pythonSettings(root, env), /Command failed/);
});

test("JavaScript and Python both reject relative config traversal", () => {
  const root = tempDir("zskill-runtime-parity-traversal-");
  const env = { [RUNTIME_CONFIG_ENV]: "../outside.json" };

  assert.throws(() => runtimeDataMountSettings(root, { env }), /must stay inside the repo/);
  assert.throws(() => pythonSettings(root, env), /Command failed/);
});

test("JavaScript and Python both reject a non-object runtimeData section", () => {
  const root = tempDir("zskill-runtime-parity-shape-");
  fs.writeFileSync(
    path.join(root, "selected-runtime.json"),
    JSON.stringify({ runtimeData: [] }),
    "utf8",
  );
  const env = { [RUNTIME_CONFIG_ENV]: "selected-runtime.json" };

  assert.throws(() => runtimeDataMountSettings(root, { env }), /runtimeData must be a JSON object/);
  assert.throws(() => pythonSettings(root, env), /Command failed/);
});
