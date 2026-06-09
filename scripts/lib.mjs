// Shared helpers for the Node (.mjs) workflow/CI scripts.
//
// Consolidates logic that was previously copy-pasted across
// setup-data-mount, check-data-contract, prepare-overlay-submission,
// check-workflow-metadata, and investigator-artifacts: the _data contract
// constants, JSON-config reading, git invocation, repo-root path containment,
// and git-argument safety validation.

import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// The _data runtime-mount contract: top-level dirs and the files that count
// as an empty "skeleton" tree (safe to replace without --force).
export const DATA_REQUIRED_DIRS = ["cases", "schemas", "snapshot", "iac"];
export const DATA_SKELETON_FILES = new Set([".gitkeep", "README.md"]);

// Git ref names we are willing to hand to git as a --branch value. Deliberately
// stricter than git's own rules: a conservative charset that cannot be read as
// an option and cannot carry shell-meaningful characters.
const SAFE_REF = /^[A-Za-z0-9._/-]+$/;

export function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

// Reject a value that git could interpret as an option rather than a positional
// (URL / path) argument. Pair with a `--` end-of-options guard at the call site.
export function assertNotOption(value, label = "value") {
  if (typeof value !== "string" || value === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (value.startsWith("-")) {
    throw new Error(`${label} must not start with '-' (looks like an option): ${value}`);
  }
  return value;
}

// Validate a value used as a git ref (--branch). Rejects option-like and
// shell/ref-unsafe input.
export function assertSafeRef(value, label = "ref") {
  if (typeof value !== "string" || value === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (value.startsWith("-")) {
    throw new Error(`${label} must not start with '-': ${value}`);
  }
  if (!SAFE_REF.test(value)) {
    throw new Error(`${label} contains characters that are not allowed in a ref: ${value}`);
  }
  return value;
}

// Resolve `target` against `root` and return its POSIX relative path if it stays
// inside `root`, else null. Empty string means target === root.
export function containedRelative(root, target) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.isAbsolute(target) ? path.resolve(target) : path.resolve(resolvedRoot, target);
  const relative = path.relative(resolvedRoot, resolved);
  if (relative === "") return "";
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return toPosix(relative);
}

// Read a JSON file that must contain an object. Missing file -> {}.
export function readJsonObject(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return {};
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`config must be a JSON object: ${filePath}`);
  }
  return parsed;
}

// Validate and normalize overlay allowed-root entries: each must be a relative
// path under _data/ with no traversal. Trailing slashes are stripped.
export function normalizeAllowedRoots(roots) {
  if (!Array.isArray(roots) || roots.length === 0) {
    throw new Error("allowed roots must be a non-empty array");
  }
  return roots.map((entry) => {
    if (typeof entry !== "string" || entry === "") {
      throw new Error(`allowed root must be a non-empty string: ${entry}`);
    }
    const normalized = entry.replace(/\/+$/, "");
    if (path.isAbsolute(normalized)) {
      throw new Error(`allowed root must be relative: ${entry}`);
    }
    if (normalized.split("/").includes("..")) {
      throw new Error(`allowed root must not contain '..': ${entry}`);
    }
    if (!normalized.startsWith("_data/")) {
      throw new Error(`allowed root must be under _data/: ${entry}`);
    }
    return normalized;
  });
}

// Run git, returning trimmed stdout; throws on non-zero exit.
export function runGit(cwd, args) {
  return childProcess
    .execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })
    .trim();
}

// Run git, returning trimmed stdout or "" on any failure (stderr suppressed).
export function gitTryOutput(cwd, args) {
  try {
    return childProcess
      .execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .trim();
  } catch {
    return "";
  }
}
