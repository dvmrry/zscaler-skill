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
export const DEFAULT_RUNTIME_DATA_TRACKING = "ignored";
export const RUNTIME_CONFIG_FILE = "zscaler-skill-runtime.json";
export const SETUP_CONFIG_FILE = "zscaler-skill-setup.json";
export const RUNTIME_CONFIG_ENV = "ZSCALER_SKILL_RUNTIME_CONFIG";
export const SETUP_CONFIG_ENV = "ZSCALER_SKILL_SETUP_CONFIG";

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

export function normalizeRuntimeDataTracking(value = DEFAULT_RUNTIME_DATA_TRACKING) {
  const tracking = value ?? DEFAULT_RUNTIME_DATA_TRACKING;
  if (tracking !== "ignored" && tracking !== "tracked") {
    throw new Error("runtime data tracking must be one of: ignored, tracked");
  }
  return tracking;
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

function objectConfig(value, label) {
  if (value === undefined || value === null) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;
  throw new Error(`${label} must be a JSON object`);
}

function selectedConfigPath(root, optionValue, envName, defaultFile, env) {
  const configuredOption = typeof optionValue === "string" && optionValue.trim()
    ? optionValue.trim()
    : null;
  const envValue = typeof env[envName] === "string" && env[envName].trim()
    ? env[envName].trim()
    : null;
  const selected = configuredOption ?? envValue;
  const expanded = selected ? expandConfigString(selected, env) : null;
  const configPath = expanded ? path.resolve(root, expanded) : path.join(root, defaultFile);
  if (expanded && !path.isAbsolute(expanded) && containedRelative(root, configPath) === null) {
    throw new Error(`${envName} or explicit relative config path must stay inside the repo: ${selected}`);
  }
  if (selected && !fs.existsSync(configPath)) {
    throw new Error(`${envName} or explicit config path selects a missing file: ${configPath}`);
  }
  return {
    configPath,
    selected: Boolean(selected),
    selectedBy: configuredOption ? "option" : envValue ? envName : "default",
  };
}

export function readRuntimeDataConfigs(root, options = {}) {
  const env = options.env ?? process.env;
  const runtimeSelection = selectedConfigPath(
    root,
    options.runtimeConfigPath,
    RUNTIME_CONFIG_ENV,
    RUNTIME_CONFIG_FILE,
    env,
  );
  const setupSelection = selectedConfigPath(
    root,
    options.setupConfigPath,
    SETUP_CONFIG_ENV,
    SETUP_CONFIG_FILE,
    env,
  );
  const runtimeConfigPath = runtimeSelection.configPath;
  const resolvedSetupConfigPath = setupSelection.configPath;
  const runtimeConfig = readJsonObject(runtimeConfigPath);
  const setupConfig = readJsonObject(resolvedSetupConfigPath);
  return {
    runtimeConfig,
    setupConfig,
    runtimeData: objectConfig(runtimeConfig.runtimeData, `${runtimeConfigPath}: runtimeData`),
    setupRuntimeData: objectConfig(setupConfig.runtimeData, `${resolvedSetupConfigPath}: runtimeData`),
    runtimeConfigPath,
    setupConfigPath: resolvedSetupConfigPath,
    runtimeConfigSelectedBy: runtimeSelection.selectedBy,
    setupConfigSelectedBy: setupSelection.selectedBy,
  };
}

export function runtimeDataMountSettings(root, options = {}) {
  const {
    runtimeConfig,
    setupConfig,
    runtimeData,
    setupRuntimeData,
    runtimeConfigPath,
    setupConfigPath,
    runtimeConfigSelectedBy,
    setupConfigSelectedBy,
  } = readRuntimeDataConfigs(root, {
    env: options.env,
    runtimeConfigPath: options.runtimeConfigPath,
    setupConfigPath: options.setupConfigPath ?? options.configPath,
  });
  const env = options.env ?? process.env;
  const configValue = (value) => typeof value === "string" ? expandConfigString(value, env) : value;
  return {
    mountPath: normalizeMountPath(
      options.mountPath
        ?? configValue(setupRuntimeData.mountPath ?? setupConfig.mountPath)
        ?? configValue(runtimeData.mountPath ?? runtimeConfig.mountPath)
        ?? DEFAULT_DATA_MOUNT,
    ),
    tracking: normalizeRuntimeDataTracking(
      options.tracking
        ?? configValue(setupRuntimeData.tracking ?? setupConfig.tracking)
        ?? configValue(runtimeData.tracking ?? runtimeConfig.tracking)
        ?? DEFAULT_RUNTIME_DATA_TRACKING,
    ),
    runtimeConfigPath,
    setupConfigPath,
    runtimeConfigSelectedBy,
    setupConfigSelectedBy,
    runtimeConfigExists: fs.existsSync(runtimeConfigPath),
    setupConfigExists: fs.existsSync(setupConfigPath),
  };
}

export function runtimeDataMountPath(root, options = {}) {
  return runtimeDataMountSettings(root, options).mountPath;
}

export function runtimeDataPath(root, ...segments) {
  return path.join(root, runtimeDataMountPath(root), ...segments);
}

export function runtimeDataRelative(root, ...segments) {
  return path.join(runtimeDataMountPath(root), ...segments);
}

export function runtimeMountIgnorePattern(mountPath) {
  return `${normalizeMountPath(mountPath)}/`;
}

function gitPath(root, gitPathArg) {
  const output = gitTryOutput(root, ["rev-parse", "--git-path", gitPathArg]);
  if (!output) return null;
  return path.isAbsolute(output) ? output : path.resolve(root, output);
}

export function runtimeMountIgnoreStatus(root, mountPath) {
  const mount = normalizeMountPath(mountPath);
  const pattern = runtimeMountIgnorePattern(mount);
  const isGitRepo = gitTryOutput(root, ["rev-parse", "--show-toplevel"]) !== "";

  if (!isGitRepo) {
    return { mountPath: mount, pattern, isGitRepo: false, ignored: false };
  }

  try {
    childProcess.execFileSync("git", ["check-ignore", "-q", "--", mount], {
      cwd: root,
      stdio: ["ignore", "ignore", "ignore"],
    });
    return { mountPath: mount, pattern, isGitRepo: true, ignored: true };
  } catch {
    return { mountPath: mount, pattern, isGitRepo: true, ignored: false };
  }
}

export function ensureRuntimeMountExcluded(root, mountPath) {
  const mount = normalizeMountPath(mountPath);
  const status = runtimeMountIgnoreStatus(root, mount);
  if (mount === DEFAULT_DATA_MOUNT) {
    return { ...status, changed: false, skipped: true, reason: "default-mount" };
  }
  if (!status.isGitRepo) {
    return { ...status, changed: false, skipped: true, reason: "not-git-repo" };
  }
  if (status.ignored) {
    return { ...status, changed: false, skipped: false, reason: "already-ignored" };
  }

  const excludePath = gitPath(root, "info/exclude");
  if (!excludePath) {
    return { ...status, changed: false, skipped: true, reason: "git-exclude-unavailable" };
  }

  fs.mkdirSync(path.dirname(excludePath), { recursive: true });
  const existing = fs.existsSync(excludePath) ? fs.readFileSync(excludePath, "utf8") : "";
  const separator = existing === "" || existing.endsWith("\n") ? "" : "\n";
  fs.appendFileSync(
    excludePath,
    `${separator}# zscaler-skill runtime data mount (local)\n${status.pattern}\n`,
    "utf8",
  );

  return {
    ...runtimeMountIgnoreStatus(root, mount),
    changed: true,
    skipped: false,
    excludePath,
  };
}

// Validate and normalize overlay allowed-root entries. Entries may be written
// relative to the mount ("cases") or include the mount ("_data/cases") for
// backward compatibility. Trailing slashes are stripped.
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
    if (normalized === mount || normalized.startsWith(`${mount}/`)) {
      return normalized;
    }
    if (["cases", "schemas", "iac"].includes(normalized.split("/")[0])) {
      return `${mount}/${normalized}`;
    }
    throw new Error(`allowed root must be mount-relative or under ${mount}/: ${entry}`);
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
