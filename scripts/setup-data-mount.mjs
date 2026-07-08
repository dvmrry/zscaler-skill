#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { checkDataContract } from "./check-data-contract.mjs";
import {
  assertNotOption,
  assertSafeRef,
  DEFAULT_DATA_MOUNT,
  DATA_REQUIRED_DIRS,
  DATA_SKELETON_FILES,
  ensureRuntimeMountExcluded,
  expandConfigString,
  gitTryOutput,
  normalizeMountPath,
  normalizeRuntimeDataTracking,
  readRuntimeDataConfigs,
  runGit,
  runtimeDataMountSettings,
  SETUP_CONFIG_FILE,
} from "./lib.mjs";

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/setup-data-mount.mjs [--config <json>] [--mount-path <path>] [--tracking ignored|tracked] [--data-url <git-url-or-local-path>] [--data-ref <ref>] [--mode auto|checkout|copy|submodule] [--root <repo-root>] [--force] [--dry-run]

Creates or replaces the runtime data mount. Defaults to _data.

Mode checkout clones a git repository or local git checkout into the mount
without registering a parent-repo submodule. Mode copy materializes a local directory.
Mode submodule is only for flows that deliberately want a parent-repo gitlink.
Mount path/tracking come from zscaler-skill-runtime.json, optionally overridden
by ./zscaler-skill-setup.json or CLI flags. If --config is omitted, the setup
helper reads ./zscaler-skill-setup.json for private bootstrap source settings
when it exists.
CLI flags override config values.
The helper never knows private URLs unless the caller provides one at runtime.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = {
    config: null,
    dataUrl: null,
    dataRef: null,
    dryRun: false,
    force: false,
    forceSet: false,
    mode: null,
    mountPath: null,
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
    tracking: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--config") {
      args.config = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (arg === "--data-url") {
      args.dataUrl = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (arg === "--data-ref") {
      args.dataRef = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (arg === "--root") {
      args.root = path.resolve(argv[i + 1] || "");
      i += 1;
      continue;
    }
    if (arg === "--mode") {
      args.mode = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--mount-path") {
      args.mountPath = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--tracking") {
      args.tracking = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (arg === "--force") {
      args.force = true;
      args.forceSet = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  const defaultConfig = path.join(args.root, SETUP_CONFIG_FILE);
  const configPath = args.config ? path.resolve(args.root, args.config) : defaultConfig;
  const {
    setupConfig: config,
    setupRuntimeData: runtimeData,
  } = readRuntimeDataConfigs(args.root, configPath);
  const mountSettings = runtimeDataMountSettings(args.root, {
    configPath,
    mountPath: args.mountPath,
    tracking: args.tracking,
  });
  const configValue = (value) => typeof value === "string" ? expandConfigString(value) : value;
  const merged = {
    configPath: fs.existsSync(configPath) ? configPath : null,
    dataUrl: args.dataUrl ?? configValue(runtimeData.source ?? runtimeData.dataUrl ?? config.dataUrl) ?? null,
    dataRef: args.dataRef ?? configValue(runtimeData.ref ?? runtimeData.dataRef ?? config.dataRef) ?? "main",
    dryRun: args.dryRun,
    force: args.forceSet ? args.force : Boolean(runtimeData.force ?? config.force),
    mode: args.mode ?? configValue(runtimeData.mode ?? config.mode) ?? "checkout",
    mountPath: mountSettings.mountPath,
    root: args.root,
    tracking: mountSettings.tracking,
  };

  if (!merged.dataUrl) {
    throw new Error("--data-url is required");
  }
  if (!["auto", "checkout", "copy", "submodule"].includes(merged.mode)) {
    throw new Error("--mode must be one of: auto, checkout, copy, submodule");
  }

  return merged;
}

function isSkeletonTree(targetPath) {
  if (!fs.existsSync(targetPath)) return true;
  if (!fs.statSync(targetPath).isDirectory()) return false;

  const stack = [targetPath];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === ".git") return false;
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
        continue;
      }
      if (!entry.isFile() || !DATA_SKELETON_FILES.has(entry.name)) {
        return false;
      }
    }
  }
  return true;
}

function resolveLocalSource(root, dataUrl) {
  if (dataUrl.startsWith("file://")) {
    return path.resolve(fileURLToPath(dataUrl));
  }
  const absolute = path.resolve(root, dataUrl);
  if (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()) {
    return absolute;
  }
  if (path.isAbsolute(dataUrl) && fs.existsSync(dataUrl) && fs.statSync(dataUrl).isDirectory()) {
    return dataUrl;
  }
  return null;
}

function assertNoSymlinks(dir) {
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === ".git") continue;
      const entryPath = path.join(current, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`data source must not contain symlinks: ${entryPath}`);
      }
      if (entry.isDirectory()) stack.push(entryPath);
    }
  }
}

function copyDirectory(source, target) {
  assertNoSymlinks(source);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, {
    recursive: true,
    dereference: false,
    filter: (entryPath) => path.basename(entryPath) !== ".git",
  });
}

function isGitRepo(root) {
  return gitTryOutput(root, ["rev-parse", "--show-toplevel"]) !== "";
}

function isGitSource(root, dataUrl, localSource) {
  if (!localSource) return true;
  return isGitRepo(localSource) || fs.existsSync(path.join(localSource, ".git"));
}

function trackedDataPaths(root, mountPath) {
  const output = gitTryOutput(root, ["ls-files", "--", mountPath]);
  return output ? output.split("\n").filter(Boolean) : [];
}

function removeDataForSubmodule(root, dataDir, mountPath) {
  if (isGitRepo(root) && trackedDataPaths(root, mountPath).length > 0) {
    runGit(root, ["rm", "-r", "--quiet", mountPath]);
    fs.rmSync(dataDir, { recursive: true, force: true });
    return;
  }
  fs.rmSync(dataDir, { recursive: true, force: true });
}

function removeDataForRuntimeMount(dataDir) {
  fs.rmSync(dataDir, { recursive: true, force: true });
}

function cloneCheckout(root, options, dataDir, mountPath) {
  removeDataForRuntimeMount(dataDir);
  const cloneArgs = ["clone"];
  if (options.dataRef) {
    cloneArgs.push("--branch", options.dataRef);
  }
  cloneArgs.push("--", options.dataUrl, mountPath);
  runGit(root, cloneArgs);
}

function ensureRequiredDirs(dataDir) {
  for (const dirname of DATA_REQUIRED_DIRS) {
    fs.mkdirSync(path.join(dataDir, dirname), { recursive: true });
  }
}

function setupDataMount(options) {
  const root = path.resolve(options.root);
  assertNotOption(options.dataUrl, "data url");
  if (options.dataRef) assertSafeRef(options.dataRef, "data ref");
  const mountPath = normalizeMountPath(options.mountPath || DEFAULT_DATA_MOUNT);
  const dataDir = path.join(root, mountPath);
  const localSource = resolveLocalSource(root, options.dataUrl);
  const requestedMode = options.mode || "checkout";
  const mode = requestedMode === "auto"
    ? (localSource && !isGitSource(root, options.dataUrl, localSource) ? "copy" : "checkout")
    : requestedMode;
  const safeToReplace = isSkeletonTree(dataDir);

  if (mode === "copy" && !localSource) {
    throw new Error("--mode copy requires --data-url to resolve to a local directory");
  }
  if (mode === "checkout" && localSource && !isGitSource(root, options.dataUrl, localSource)) {
    throw new Error("--mode checkout requires --data-url to resolve to a git repository or use a git URL");
  }

  if (!safeToReplace && !options.force) {
    throw new Error(`${mountPath} contains non-skeleton files; re-run with --force to replace it`);
  }

  const plan = {
    root,
    dataDir,
    mountPath,
    dataUrl: options.dataUrl,
    dataRef: options.dataRef || null,
    mode,
    requestedMode,
    configPath: options.configPath || null,
    dryRun: Boolean(options.dryRun),
    force: Boolean(options.force),
    localExclude: null,
    tracking: normalizeRuntimeDataTracking(options.tracking),
  };

  if (options.dryRun) {
    return { plan, report: null };
  }

  if (mode !== "submodule" && plan.tracking === "ignored") {
    plan.localExclude = ensureRuntimeMountExcluded(root, mountPath);
  }

  if (mode === "copy") {
    removeDataForRuntimeMount(dataDir);
    copyDirectory(localSource, dataDir);
  } else if (mode === "checkout") {
    cloneCheckout(root, options, dataDir, mountPath);
  } else {
    removeDataForSubmodule(root, dataDir, mountPath);
    const submoduleArgs = ["-c", "protocol.file.allow=always", "submodule", "add", "--force"];
    if (options.dataRef) {
      submoduleArgs.push("--branch", options.dataRef);
    }
    submoduleArgs.push("--", options.dataUrl, mountPath);
    runGit(root, submoduleArgs);
  }

  ensureRequiredDirs(dataDir);
  const report = checkDataContract(root, mountPath, { tracking: plan.tracking });
  return { plan, report };
}

function printResult(result) {
  process.stdout.write("Data mount setup\n");
  process.stdout.write("================\n");
  process.stdout.write(`Mode: ${result.plan.mode}\n`);
  process.stdout.write(`Target: ${result.plan.dataDir}\n`);
  process.stdout.write(`Source: ${result.plan.dataUrl}\n`);
  if (result.plan.configPath) process.stdout.write(`Config: ${result.plan.configPath}\n`);
  if (result.plan.dataRef) process.stdout.write(`Ref: ${result.plan.dataRef}\n`);
  process.stdout.write(`Tracking: ${result.plan.tracking}\n`);
  if (result.plan.dryRun) {
    process.stdout.write("Dry run: no files changed\n");
    return;
  }
  if (result.plan.localExclude?.changed) {
    process.stdout.write(
      `Local exclude: added ${result.plan.localExclude.pattern} to ${result.plan.localExclude.excludePath}\n`,
    );
  }
  for (const line of result.report.info) process.stdout.write(`INFO: ${line}\n`);
  for (const line of result.report.warnings) process.stdout.write(`WARN: ${line}\n`);
  for (const line of result.report.errors) process.stdout.write(`ERROR: ${line}\n`);
  process.stdout.write(`Errors: ${result.report.errors.length}\n`);
  process.stdout.write(`Warnings: ${result.report.warnings.length}\n`);
}

function main() {
  try {
    const args = parseArgs(process.argv);
    const result = setupDataMount(args);
    printResult(result);
    process.exit(result.report && result.report.errors.length ? 1 : 0);
  } catch (error) {
    process.stderr.write(`setup-data-mount: ${error.message}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  isSkeletonTree,
  setupDataMount,
};
