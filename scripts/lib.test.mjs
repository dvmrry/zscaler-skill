import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assertNotOption,
  assertSafeRef,
  containedRelative,
  expandConfigObject,
  normalizeMountPath,
  normalizeAllowedRoots,
  normalizeRuntimeDataTracking,
  readJsonObject,
  RUNTIME_CONFIG_ENV,
  runtimeDataMountSettings,
  SETUP_CONFIG_ENV,
} from "./lib.mjs";

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

test("assertSafeRef accepts ordinary branch/ref names", () => {
  for (const ref of ["main", "v0.4.1", "feature/role-grounding-split", "release/0.2.0"]) {
    assert.equal(assertSafeRef(ref, "ref"), ref);
  }
});

test("assertSafeRef rejects option-like, empty, and unsafe refs", () => {
  for (const bad of ["", "-c", "--upload-pack=evil", "a b", "a;rm -rf /", "a~b", "a:b"]) {
    assert.throws(() => assertSafeRef(bad, "ref"), /ref/);
  }
});

test("assertNotOption accepts URLs and paths but rejects leading dash", () => {
  for (const ok of ["https://example.com/x.git", "git@host:repo.git", "/abs/path", "./rel/path", "file:///tmp/x"]) {
    assert.equal(assertNotOption(ok, "url"), ok);
  }
  for (const bad of ["", "-c", "--upload-pack=/evil"]) {
    assert.throws(() => assertNotOption(bad, "url"), /url/);
  }
});

test("containedRelative returns posix relative for paths inside root", () => {
  const root = tempDir("zskill-lib-contained-");
  assert.equal(containedRelative(root, path.join(root, "a", "b.txt")), "a/b.txt");
  assert.equal(containedRelative(root, root), "");
});

test("containedRelative returns null for traversal or absolute escapes", () => {
  const root = tempDir("zskill-lib-escape-");
  assert.equal(containedRelative(root, path.join(root, "..", "outside")), null);
  assert.equal(containedRelative(root, "/etc/passwd"), null);
});

test("readJsonObject returns {} for a missing file", () => {
  assert.deepEqual(readJsonObject(path.join(tempDir("zskill-lib-json-"), "nope.json")), {});
});

test("readJsonObject parses an object and rejects non-objects", () => {
  const dir = tempDir("zskill-lib-json2-");
  const objPath = path.join(dir, "obj.json");
  fs.writeFileSync(objPath, JSON.stringify({ a: 1 }), "utf8");
  assert.deepEqual(readJsonObject(objPath), { a: 1 });

  const arrPath = path.join(dir, "arr.json");
  fs.writeFileSync(arrPath, JSON.stringify([1, 2]), "utf8");
  assert.throws(() => readJsonObject(arrPath), /object/);
});

test("readJsonObject leaves environment variables raw", () => {
  const dir = tempDir("zskill-lib-json-env-");
  const objPath = path.join(dir, "obj.json");
  fs.writeFileSync(
    objPath,
    JSON.stringify({
      runtimeData: {
        source: "$ZSCALER_TEST_SOURCE",
        ref: "${ZSCALER_TEST_REF}",
      },
    }),
    "utf8",
  );

  assert.deepEqual(readJsonObject(objPath), {
    runtimeData: {
      source: "$ZSCALER_TEST_SOURCE",
      ref: "${ZSCALER_TEST_REF}",
    },
  });
});

test("expandConfigObject expands environment variables on demand", () => {
  const previousSource = process.env.ZSCALER_TEST_SOURCE;
  const previousRef = process.env.ZSCALER_TEST_REF;
  process.env.ZSCALER_TEST_SOURCE = "/tmp/runtime-data";
  process.env.ZSCALER_TEST_REF = "main";
  try {
    assert.deepEqual(expandConfigObject({
      runtimeData: {
        source: "$ZSCALER_TEST_SOURCE",
        ref: "${ZSCALER_TEST_REF}",
      },
    }), {
      runtimeData: {
        source: "/tmp/runtime-data",
        ref: "main",
      },
    });
  } finally {
    if (previousSource === undefined) {
      delete process.env.ZSCALER_TEST_SOURCE;
    } else {
      process.env.ZSCALER_TEST_SOURCE = previousSource;
    }
    if (previousRef === undefined) {
      delete process.env.ZSCALER_TEST_REF;
    } else {
      process.env.ZSCALER_TEST_REF = previousRef;
    }
  }
});

test("expandConfigObject rejects missing environment variables", () => {
  assert.throws(
    () => expandConfigObject({ source: "$ZSCALER_TEST_MISSING_RUNTIME_SOURCE" }, {}),
    /environment variable ZSCALER_TEST_MISSING_RUNTIME_SOURCE is not set/,
  );
});

test("normalizeMountPath keeps safe relative mount paths", () => {
  assert.equal(normalizeMountPath("_data/"), "_data");
  assert.equal(normalizeMountPath("tenant-data"), "tenant-data");
  assert.equal(normalizeMountPath("private/runtime-data"), "private/runtime-data");
});

test("normalizeMountPath rejects unsafe mount paths", () => {
  for (const bad of ["", "/abs", "../secret", "tenant/../secret", "-option", ".git", ".git/private"]) {
    assert.throws(() => normalizeMountPath(bad), /runtime data mount path/);
  }
});

test("normalizeRuntimeDataTracking accepts explicit tracking modes", () => {
  assert.equal(normalizeRuntimeDataTracking(), "ignored");
  assert.equal(normalizeRuntimeDataTracking("ignored"), "ignored");
  assert.equal(normalizeRuntimeDataTracking("tracked"), "tracked");
  assert.throws(() => normalizeRuntimeDataTracking("public"), /runtime data tracking/);
});

test("runtimeDataMountSettings reads committed runtime layout config", () => {
  const root = tempDir("zskill-lib-runtime-config-");
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

  assert.deepEqual(
    {
      mountPath: runtimeDataMountSettings(root).mountPath,
      tracking: runtimeDataMountSettings(root).tracking,
    },
    {
      mountPath: "tenant-data",
      tracking: "tracked",
    },
  );
});

test("runtimeDataMountSettings lets ignored setup config override layout only", () => {
  const root = tempDir("zskill-lib-runtime-setup-override-");
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
  fs.writeFileSync(
    path.join(root, "zscaler-skill-setup.json"),
    `${JSON.stringify({
      runtimeData: {
        mountPath: "local-data",
        tracking: "ignored",
        source: "$ZSCALER_TEST_UNSET_PRIVATE_SOURCE",
      },
    }, null, 2)}\n`,
    "utf8",
  );

  const settings = runtimeDataMountSettings(root);
  assert.equal(settings.mountPath, "local-data");
  assert.equal(settings.tracking, "ignored");
});

test("runtimeDataMountSettings lets a downstream runtime config replace the root config", () => {
  const root = tempDir("zskill-lib-runtime-selected-");
  fs.writeFileSync(
    path.join(root, "zscaler-skill-runtime.json"),
    JSON.stringify({ runtimeData: { mountPath: "root-data", tracking: "ignored" } }),
    "utf8",
  );
  fs.mkdirSync(path.join(root, "deployments"));
  fs.writeFileSync(
    path.join(root, "deployments", "private.json"),
    JSON.stringify({ runtimeData: { mountPath: "selected-data", tracking: "tracked" } }),
    "utf8",
  );

  const settings = runtimeDataMountSettings(root, {
    env: { [RUNTIME_CONFIG_ENV]: "deployments/private.json" },
  });

  assert.equal(settings.mountPath, "selected-data");
  assert.equal(settings.tracking, "tracked");
  assert.equal(settings.runtimeConfigSelectedBy, RUNTIME_CONFIG_ENV);
});

test("runtimeDataMountSettings keeps explicit paths above environment selectors", () => {
  const root = tempDir("zskill-lib-runtime-explicit-");
  fs.writeFileSync(
    path.join(root, "env.json"),
    JSON.stringify({ runtimeData: { mountPath: "env-data" } }),
    "utf8",
  );
  fs.writeFileSync(
    path.join(root, "explicit.json"),
    JSON.stringify({ runtimeData: { mountPath: "explicit-data" } }),
    "utf8",
  );

  const settings = runtimeDataMountSettings(root, {
    env: { [RUNTIME_CONFIG_ENV]: "env.json" },
    runtimeConfigPath: "explicit.json",
  });

  assert.equal(settings.mountPath, "explicit-data");
  assert.equal(settings.runtimeConfigSelectedBy, "option");
});

test("runtimeDataMountSettings lets a selected local setup config override shared layout", () => {
  const root = tempDir("zskill-lib-setup-selected-");
  fs.writeFileSync(
    path.join(root, "runtime.json"),
    JSON.stringify({ runtimeData: { mountPath: "shared-data", tracking: "tracked" } }),
    "utf8",
  );
  fs.writeFileSync(
    path.join(root, "local.json"),
    JSON.stringify({ runtimeData: { mountPath: "workstation-data", tracking: "ignored" } }),
    "utf8",
  );

  const settings = runtimeDataMountSettings(root, {
    env: {
      [RUNTIME_CONFIG_ENV]: "runtime.json",
      [SETUP_CONFIG_ENV]: "local.json",
    },
  });

  assert.equal(settings.mountPath, "workstation-data");
  assert.equal(settings.tracking, "ignored");
  assert.equal(settings.setupConfigSelectedBy, SETUP_CONFIG_ENV);
});

test("runtimeDataMountSettings fails loudly for selected missing configs", () => {
  const root = tempDir("zskill-lib-runtime-missing-");
  assert.throws(
    () => runtimeDataMountSettings(root, {
      env: { [RUNTIME_CONFIG_ENV]: "missing.json" },
    }),
    /selects a missing file/,
  );
  assert.throws(
    () => runtimeDataMountSettings(root, {
      env: { [SETUP_CONFIG_ENV]: "missing-local.json" },
    }),
    /selects a missing file/,
  );
});

test("runtimeDataMountSettings rejects relative config traversal", () => {
  const root = tempDir("zskill-lib-runtime-traversal-");
  assert.throws(
    () => runtimeDataMountSettings(root, {
      env: { [RUNTIME_CONFIG_ENV]: "../outside.json" },
    }),
    /relative config path must stay inside the repo/,
  );
});

test("runtimeDataMountSettings rejects a non-object runtimeData section", () => {
  const root = tempDir("zskill-lib-runtime-shape-");
  fs.writeFileSync(
    path.join(root, "zscaler-skill-runtime.json"),
    JSON.stringify({ runtimeData: [] }),
    "utf8",
  );
  assert.throws(() => runtimeDataMountSettings(root), /runtimeData must be a JSON object/);
});

test("normalizeAllowedRoots keeps valid _data roots and strips trailing slashes", () => {
  assert.deepEqual(
    normalizeAllowedRoots(["_data/cases/", "_data/schemas", "_data/iac"]),
    ["_data/cases", "_data/schemas", "_data/iac"],
  );
});

test("normalizeAllowedRoots supports a configured runtime mount", () => {
  assert.deepEqual(
    normalizeAllowedRoots(["cases/", "tenant-data/schemas"], "tenant-data"),
    ["tenant-data/cases", "tenant-data/schemas"],
  );
});

test("normalizeAllowedRoots rejects absolute, traversal, and unsupported roots", () => {
  for (const bad of [["/etc"], ["_data/../secret"], ["logs"], ["_data/cases/../../etc"]]) {
    assert.throws(() => normalizeAllowedRoots(bad), /allowed root/i);
  }
});

test("normalizeAllowedRoots rejects roots outside a configured runtime mount", () => {
  assert.throws(() => normalizeAllowedRoots(["_data/cases"], "tenant-data"), /under tenant-data/);
});
