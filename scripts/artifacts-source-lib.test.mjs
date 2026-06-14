// Tests for the shared finding-source resolution primitives.
//
// These cover the role-agnostic forms (file:line incl. the off-by-one EOF
// correction, cross-file, bare path, and safe path containment) directly, now
// that the logic is single-sourced for the auditor and SOC generators. The
// role-specific forms (check:, evidence:, framework-not-evidence) are covered by
// the per-role artifact suites.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  safeRepoPath,
  resolveCrossFileSource,
  resolveFileLineSource,
  resolveBareFilePath,
} from "./artifacts-source-lib.mjs";

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "src-lib-"));
}

function writeFile(root, rel, content) {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, "utf8");
  return abs;
}

// ── safeRepoPath ──────────────────────────────────────────────────────────────

test("safeRepoPath joins a clean relative path under root", () => {
  const root = makeRoot();
  assert.equal(safeRepoPath(root, "a/b.md"), path.join(root, "a/b.md"));
});

test("safeRepoPath rejects absolute paths, NUL bytes, and escapes", () => {
  const root = makeRoot();
  assert.throws(() => safeRepoPath(root, "/etc/passwd"), /unsafe relative path/);
  assert.throws(() => safeRepoPath(root, "a\0b"), /unsafe relative path/);
  assert.throws(() => safeRepoPath(root, "../outside.md"), /escapes repo root/);
});

// ── resolveFileLineSource ─────────────────────────────────────────────────────

test("resolveFileLineSource returns null for non-file:line input", () => {
  const root = makeRoot();
  assert.equal(resolveFileLineSource(root, "evidence:foo"), null);
  assert.equal(resolveFileLineSource(root, "just-a-word"), null);
});

test("resolveFileLineSource resolves a valid line and range", () => {
  const root = makeRoot();
  writeFile(root, "doc.md", "l1\nl2\nl3\nl4\nl5\n");
  assert.deepEqual(resolveFileLineSource(root, "doc.md:3"), { type: "file-line", resolves: true });
  assert.deepEqual(resolveFileLineSource(root, "doc.md:2-4"), { type: "file-line", resolves: true });
});

test("resolveFileLineSource: off-by-one — last visible line resolves, trailing-newline line does not", () => {
  const root = makeRoot();
  // 3 visible lines + trailing newline. lineCount must be 3, not 4.
  writeFile(root, "trailing.md", "a\nb\nc\n");
  assert.equal(resolveFileLineSource(root, "trailing.md:3").resolves, true);
  const beyond = resolveFileLineSource(root, "trailing.md:4");
  assert.equal(beyond.resolves, false);
  assert.match(beyond.error, /beyond EOF \(file has 3 lines\)/);
});

test("resolveFileLineSource: file with no trailing newline counts correctly", () => {
  const root = makeRoot();
  writeFile(root, "notrail.md", "a\nb\nc");
  assert.equal(resolveFileLineSource(root, "notrail.md:3").resolves, true);
  assert.equal(resolveFileLineSource(root, "notrail.md:4").resolves, false);
});

test("resolveFileLineSource rejects line < 1 and inverted ranges", () => {
  const root = makeRoot();
  writeFile(root, "doc.md", "a\nb\n");
  assert.match(resolveFileLineSource(root, "doc.md:0").error, /must be >= 1/);
  assert.match(resolveFileLineSource(root, "doc.md:5-2").error, /end \(2\) < start \(5\)/);
});

test("resolveFileLineSource reports missing files and unsafe paths", () => {
  const root = makeRoot();
  assert.match(resolveFileLineSource(root, "nope.md:1").error, /file does not exist/);
  assert.equal(resolveFileLineSource(root, "../escape.md:1").resolves, false);
});

// ── resolveCrossFileSource ────────────────────────────────────────────────────

test("resolveCrossFileSource returns null when not cross-file-shaped", () => {
  const root = makeRoot();
  assert.equal(resolveCrossFileSource(root, "single.md:1"), null);
  assert.equal(resolveCrossFileSource(root, "a,"), null); // only one real part
});

test("resolveCrossFileSource resolves when all listed files exist", () => {
  const root = makeRoot();
  writeFile(root, "a.md", "x\n");
  writeFile(root, "b.md", "y\n");
  assert.deepEqual(resolveCrossFileSource(root, "a.md + b.md"), { type: "cross-file", resolves: true });
  assert.deepEqual(resolveCrossFileSource(root, "a.md, b.md"), { type: "cross-file", resolves: true });
});

test("resolveCrossFileSource lists missing files", () => {
  const root = makeRoot();
  writeFile(root, "a.md", "x\n");
  const r = resolveCrossFileSource(root, "a.md + gone.md");
  assert.equal(r.resolves, false);
  assert.match(r.error, /files that do not exist: gone\.md/);
});

// ── resolveBareFilePath ───────────────────────────────────────────────────────

test("resolveBareFilePath flags an existing file lacking a line reference", () => {
  const root = makeRoot();
  writeFile(root, "bare.md", "x\n");
  const r = resolveBareFilePath(root, "bare.md");
  assert.equal(r.resolves, false);
  assert.match(r.error, /bare file path without a line reference/);
});

test("resolveBareFilePath returns null for a non-existent path", () => {
  const root = makeRoot();
  assert.equal(resolveBareFilePath(root, "ghost.md"), null);
  assert.equal(resolveBareFilePath(root, "../escape"), null);
});
