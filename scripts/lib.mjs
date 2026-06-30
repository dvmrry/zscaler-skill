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

// The runtime-data mount contract: top-level dirs and the files that count
// as an empty "skeleton" tree (safe to replace without --force). _data is the
// default mount name, but local installations may configure a different mount.
export const DEFAULT_DATA_MOUNT = "_data";
export const DATA_REQUIRED_DIRS = ["cases", "schemas", "snapshot", "iac", "audits", "soc-reviews"];
export const DATA_SKELETON_FILES = new Set([".gitkeep", "README.md"]);

// Git ref names we are willing to hand to git as a --branch value. Deliberately
// stricter than git's own rules: a conservative charset that cannot be read as
// an option and cannot carry shell-meaningful characters.
const SAFE_REF = /^[A-Za-z0-9._/-]+$/;

export function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

export function expandConfigString(value, env = process.env) {
  if (typeof value !== "string") return value;
  return value.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g, (match, braced, bare) => {
    const name = braced || bare;
    if (!Object.prototype.hasOwnProperty.call(env, name)) {
      throw new Error(`environment variable ${name} is not set for config value ${match}`);
    }
    return env[name];
  });
}

export function expandConfigObject(value, env = process.env) {
  if (typeof value === "string") return expandConfigString(value, env);
  if (Array.isArray(value)) return value.map((item) => expandConfigObject(item, env));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, expandConfigObject(nested, env)]),
    );
  }
  return value;
}

export function normalizeMountPath(value = DEFAULT_DATA_MOUNT) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("runtime data mount path must be a non-empty string");
  }
  const raw = value.trim();
  if (path.isAbsolute(raw)) {
    throw new Error(`runtime data mount path must be relative: ${value}`);
  }
  if (raw.split(/[\\/]+/).includes("..")) {
    throw new Error(`runtime data mount path must not contain '..': ${value}`);
  }
  const normalized = toPosix(path.normalize(raw)).replace(/\/+$/, "");
  if (normalized === "" || normalized === "." || normalized === ".." || normalized.startsWith("../")) {
    throw new Error(`runtime data mount path must stay inside the repo: ${value}`);
  }
  if (normalized.startsWith("-")) {
    throw new Error(`runtime data mount path must not start with '-': ${value}`);
  }
  if (normalized === ".git" || normalized.startsWith(".git/")) {
    throw new Error("runtime data mount path must not be inside .git");
  }
  return normalized;
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
// path under the runtime data mount with no traversal. Trailing slashes are
// stripped.
export function normalizeAllowedRoots(roots, mountPath = DEFAULT_DATA_MOUNT) {
  if (!Array.isArray(roots) || roots.length === 0) {
    throw new Error("allowed roots must be a non-empty array");
  }
  const mount = normalizeMountPath(mountPath);
  return roots.map((entry) => {
    if (typeof entry !== "string" || entry === "") {
      throw new Error(`allowed root must be a non-empty string: ${entry}`);
    }
    const raw = entry.replace(/\/+$/, "");
    if (path.isAbsolute(raw)) {
      throw new Error(`allowed root must be relative: ${entry}`);
    }
    if (raw.split(/[\\/]+/).includes("..")) {
      throw new Error(`allowed root must not contain '..': ${entry}`);
    }
    const normalized = toPosix(path.normalize(raw)).replace(/\/+$/, "");
    if (normalized !== mount && !normalized.startsWith(`${mount}/`)) {
      throw new Error(`allowed root must be under ${mount}/: ${entry}`);
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
