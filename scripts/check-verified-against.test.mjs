import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const checker = path.join(path.dirname(fileURLToPath(import.meta.url)), "check-verified-against.py");
const sha = "a".repeat(40);

function temporaryRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "verified-against-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "references"), { recursive: true });
  fs.mkdirSync(path.join(root, "vendor", "zscaler-help"), { recursive: true });
  fs.mkdirSync(path.join(root, "vendor", "zscaler-api-specs"), { recursive: true });
  fs.writeFileSync(path.join(root, "vendor", "README.md"), "Vendor sources\n");
  fs.writeFileSync(
    path.join(root, ".gitmodules"),
    '[submodule "vendor/example"]\n\tpath = vendor/example\n\turl = https://example.invalid/example.git\n',
  );
  return root;
}

function writeReference(root, frontmatter) {
  fs.writeFileSync(path.join(root, "references", "example.md"), `---\n${frontmatter}\n---\n`);
}

function runCheck(root) {
  return spawnSync(checker, [root], { encoding: "utf8" });
}

function assertPass(result) {
  assert.equal(result.status, 0, result.stdout + result.stderr);
}

function assertFails(result, pattern) {
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, pattern);
}

function git(cwd, ...args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function initializeSubmoduleRepository(root) {
  const repository = path.join(root, "vendor", "example");
  fs.mkdirSync(repository, { recursive: true });
  git(repository, "init", "--quiet");
  git(repository, "config", "user.name", "Test User");
  git(repository, "config", "user.email", "test@example.invalid");
  fs.writeFileSync(path.join(repository, "source.txt"), "first\n");
  git(repository, "add", "source.txt");
  git(repository, "commit", "--quiet", "-m", "first");
  const first = git(repository, "rev-parse", "HEAD");
  fs.appendFileSync(path.join(repository, "source.txt"), "second\n");
  git(repository, "commit", "--quiet", "-am", "second");
  return first;
}

test("parses a flow-style verified-against mapping", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, `title: Example\nverified-against: {vendor/zscaler-help: ${sha}}`);
  const result = runCheck(root);
  assertPass(result);
  assert.match(result.stdout, /1 entries/);
});

test("parses a verified-against mapping indented with four spaces", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, `title: Example\nverified-against:\n    vendor/zscaler-help: ${sha}`);
  const result = runCheck(root);
  assertPass(result);
  assert.match(result.stdout, /1 entries/);
});

test("requires verified-against to be a mapping", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, "title: Example\nverified-against: [vendor/zscaler-help]");
  assertFails(runCheck(root), /verified-against must be a mapping/);
});

test("rejects non-scalar and malformed SHA values", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, "verified-against:\n  vendor/zscaler-help: [not, a, sha]");
  assertFails(runCheck(root), /must contain a scalar 40-hex commit SHA/);

  writeReference(root, `verified-against:\n  vendor/zscaler-help: ${sha} trailing-junk`);
  assertFails(runCheck(root), /with only an optional parenthetical label/);
});

test("validates pins for tracked non-submodule vendor sources", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, `verified-against:\n  vendor/zscaler-help: ${sha} (v1.2.3)`);
  const valid = runCheck(root);
  assertPass(valid);
  assert.match(valid.stdout, /1 entries, 0 unique commit object/);

  writeReference(root, "verified-against:\n  vendor/zscaler-help: abcdef0");
  assertFails(runCheck(root), /40-hex commit SHA/);
});

test("rejects unsafe and nonexistent vendor paths", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, "verified-against:\n  vendor/../outside: abcdef0");
  const unsafe = runCheck(root);
  assertFails(unsafe, /safe repository-relative vendor path/);
  assert.match(unsafe.stdout + unsafe.stderr, /40-hex commit SHA/);

  fs.rmSync(path.join(root, "vendor", "zscaler-help"), { recursive: true });
  writeReference(root, `verified-against:\n  vendor/zscaler-help: ${sha}`);
  assertFails(runCheck(root), /recognized verified-against root vendor\/zscaler-help does not exist/);

  writeReference(root, `verified-against:\n  vendor/zscaler-helps: ${sha}`);
  assertFails(runCheck(root), /is not a recognized provenance root/);
});

test("rejects descendants of submodule roots and ordinary vendor files", (t) => {
  const root = temporaryRoot(t);
  fs.mkdirSync(path.join(root, "vendor", "example"), { recursive: true });
  fs.writeFileSync(path.join(root, "vendor", "example", "source.txt"), "source\n");
  writeReference(root, `verified-against:\n  vendor/example/source.txt: ${sha}`);
  assertFails(runCheck(root), /must equal the provenance root vendor\/example/);

  writeReference(root, `verified-against:\n  vendor/README.md: ${sha}`);
  assertFails(runCheck(root), /is not a recognized provenance root/);
});

test("rejects duplicate verified-against fields with source lines", (t) => {
  const root = temporaryRoot(t);
  writeReference(
    root,
    `verified-against:\n  vendor/zscaler-help: ${sha}\nverified-against:\n  vendor/zscaler-api-specs: ${sha}`,
  );
  assertFails(runCheck(root), /example\.md:4: duplicate top-level verified-against field \(first declared at line 2\)/);
});

test("rejects duplicate vendor keys with source lines", (t) => {
  const root = temporaryRoot(t);
  writeReference(
    root,
    `verified-against:\n  vendor/zscaler-help: ${sha}\n  vendor/zscaler-help: ${"b".repeat(40)}`,
  );
  assertFails(runCheck(root), /example\.md:4: duplicate verified-against key 'vendor\/zscaler-help' \(first declared at line 3\)/);
});

test("allows a declared but uninitialized submodule path", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, `verified-against:\n  vendor/example: ${sha}`);
  const result = runCheck(root);
  assertPass(result);
  assert.match(result.stdout, /skipped 1 uninitialized submodule/);
});

test("accepts a historical commit available in an initialized submodule", (t) => {
  const root = temporaryRoot(t);
  const first = initializeSubmoduleRepository(root);
  writeReference(root, `verified-against:\n  vendor/example: ${first}`);
  const result = runCheck(root);
  assertPass(result);
  assert.match(result.stdout, /1 unique commit object/);
});

test("rejects a missing commit in an initialized submodule", (t) => {
  const root = temporaryRoot(t);
  initializeSubmoduleRepository(root);
  const missing = "f".repeat(40);
  writeReference(root, `verified-against:\n  vendor/example: ${missing}`);
  assertFails(runCheck(root), new RegExp(`${missing} does not resolve to a commit`));
});
