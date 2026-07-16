#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;

function runGit(root, args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  });

  if (result.error) throw result.error;
  return result;
}

function commandFailure(label, result) {
  const detail = [result.stdout, result.stderr]
    .filter(Boolean)
    .join("")
    .trimEnd();
  return detail || `${label} exited ${result.status ?? "without a status"}`;
}

function listUntrackedFiles(root) {
  const result = runGit(root, ["ls-files", "--others", "--exclude-standard", "-z"]);
  if (result.status !== 0) {
    throw new Error(commandFailure("git ls-files", result));
  }
  return result.stdout.split("\0").filter(Boolean);
}

function trackedWhitespaceFailures(root) {
  const checks = [
    ["unstaged changes", ["diff", "--check", "--"]],
    ["staged changes", ["diff", "--cached", "--check", "--"]],
  ];
  const failures = [];

  for (const [label, args] of checks) {
    const result = runGit(root, args);
    if (result.status !== 0) failures.push(commandFailure(label, result));
  }

  return failures;
}

function untrackedWhitespaceFailures(root) {
  const failures = [];
  for (const filename of listUntrackedFiles(root)) {
    const result = runGit(root, [
      "diff",
      "--no-index",
      "--no-ext-diff",
      "--check",
      "--",
      "/dev/null",
      filename,
    ]);

    // A clean new file is still different from /dev/null, so status 1 is
    // expected. Whitespace diagnostics are emitted on stdout; status >1 is a
    // real invocation error.
    if (result.status > 1 || result.status === null || result.stdout || result.stderr) {
      failures.push(commandFailure(`untracked file ${filename}`, result));
    }
  }
  return failures;
}

function checkWorktreeWhitespace(root = process.cwd()) {
  const failures = [
    ...trackedWhitespaceFailures(root),
    ...untrackedWhitespaceFailures(root),
  ];
  return {
    ok: failures.length === 0,
    failures,
  };
}

function main() {
  try {
    const report = checkWorktreeWhitespace();
    if (!report.ok) {
      process.stderr.write(`${report.failures.join("\n")}\n`);
      process.exitCode = 1;
    }
  } catch (error) {
    process.stderr.write(`check-worktree-whitespace: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}

export { checkWorktreeWhitespace, listUntrackedFiles };
