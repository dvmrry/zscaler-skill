import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkWorktreeWhitespace, listUntrackedFiles } from "./check-worktree-whitespace.mjs";

function git(root, args) {
  execFileSync("git", args, { cwd: root, stdio: "ignore" });
}

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-whitespace-"));
  git(root, ["init", "--quiet"]);
  git(root, ["config", "user.name", "Whitespace Test"]);
  git(root, ["config", "user.email", "whitespace@example.invalid"]);
  fs.writeFileSync(path.join(root, "tracked.md"), "clean\n", "utf8");
  git(root, ["add", "tracked.md"]);
  git(root, ["commit", "--quiet", "-m", "initial"]);
  return root;
}

test("accepts clean tracked and untracked files", () => {
  const root = makeRepo();
  fs.writeFileSync(path.join(root, "new file.md"), "also clean\n", "utf8");

  assert.deepEqual(listUntrackedFiles(root), ["new file.md"]);
  assert.deepEqual(checkWorktreeWhitespace(root), { ok: true, failures: [] });
});

test("rejects whitespace errors in unstaged tracked changes", () => {
  const root = makeRepo();
  fs.writeFileSync(path.join(root, "tracked.md"), "trailing space \n", "utf8");

  const report = checkWorktreeWhitespace(root);
  assert.equal(report.ok, false);
  assert.match(report.failures.join("\n"), /tracked\.md:1: trailing whitespace/);
});

test("rejects whitespace errors in staged changes", () => {
  const root = makeRepo();
  fs.writeFileSync(path.join(root, "tracked.md"), "staged tab\t\n", "utf8");
  git(root, ["add", "tracked.md"]);

  const report = checkWorktreeWhitespace(root);
  assert.equal(report.ok, false);
  assert.match(report.failures.join("\n"), /tracked\.md:1: trailing whitespace/);
});

test("rejects whitespace errors in untracked files", () => {
  const root = makeRepo();
  fs.writeFileSync(path.join(root, "new.md"), "untracked space \n", "utf8");

  const report = checkWorktreeWhitespace(root);
  assert.equal(report.ok, false);
  assert.match(report.failures.join("\n"), /new\.md:1: trailing whitespace/);
});
