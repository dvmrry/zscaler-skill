import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assertNotOption,
  assertSafeRef,
  containedRelative,
  normalizeAllowedRoots,
  readJsonObject,
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

test("normalizeAllowedRoots keeps valid _data roots and strips trailing slashes", () => {
  assert.deepEqual(
    normalizeAllowedRoots(["_data/cases/", "_data/schemas", "_data/iac"]),
    ["_data/cases", "_data/schemas", "_data/iac"],
  );
});

test("normalizeAllowedRoots rejects absolute, traversal, and non-_data roots", () => {
  for (const bad of [["/etc"], ["_data/../secret"], ["cases"], ["_data/cases/../../etc"]]) {
    assert.throws(() => normalizeAllowedRoots(bad), /allowed root/i);
  }
});
