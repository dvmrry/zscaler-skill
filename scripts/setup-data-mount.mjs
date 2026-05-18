#!/usr/bin/env node
import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { checkDataContract } from "./check-data-contract.mjs";

const REQUIRED_DIRS = ["cases", "schemas", "snapshot", "iac"];
const SKELETON_NAMES = new Set([".gitkeep", "README.md"]);

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/setup-data-mount.mjs [--config <json>] [--data-url <git-url-or-local-path>] [--data-ref <ref>] [--mode auto|checkout|copy|submodule] [--root <repo-root>] [--force] [--dry-run]

Creates or replaces the _data runtime data mount.

Mode checkout clones a git repository or local git checkout into _data without
registering a parent-repo submodule. Mode copy materializes a local directory.
Mode submodule is only for flows that deliberately want a parent-repo gitlink.
If --config is omitted, ./zscaler-skill-setup.json is used when it exists.
CLI flags override config values.
The helper never knows private URLs unless the caller provides one at runtime.
`);
  process.exit(exitCode);
}

function readConfig(configPath) {
  if (!configPath || !fs.existsSync(configPath)) return {};
  const data = JSON.parse(fs.readFileSync(configPath, "utf8"));
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`config must be a JSON object: ${configPath}`);
  }
  return data;
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
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
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

  const defaultConfig = path.join(args.root, "zscaler-skill-setup.json");
  const configPath = args.config ? path.resolve(args.root, args.config) : defaultConfig;
  const config = readConfig(configPath);
  const merged = {
    configPath: fs.existsSync(configPath) ? configPath : null,
    dataUrl: args.dataUrl ?? config.dataUrl ?? null,
    dataRef: args.dataRef ?? config.dataRef ?? "main",
    dryRun: args.dryRun,
    force: args.forceSet ? args.force : Boolean(config.force),
    mode: args.mode ?? config.mode ?? "checkout",
    root: args.root,
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
      if (!entry.isFile() || !SKELETON_NAMES.has(entry.name)) {
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

function copyDirectory(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, {
    recursive: true,
    dereference: false,
    filter: (entryPath) => path.basename(entryPath) !== ".git",
  });
}

function runGit(root, args) {
  childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function gitOutput(root, args) {
  try {
    return childProcess.execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function isGitRepo(root) {
  return gitOutput(root, ["rev-parse", "--show-toplevel"]) !== "";
}

function isGitSource(root, dataUrl, localSource) {
  if (!localSource) return true;
  return isGitRepo(localSource) || fs.existsSync(path.join(localSource, ".git"));
}

function trackedDataPaths(root) {
  const output = gitOutput(root, ["ls-files", "--", "_data"]);
  return output ? output.split("\n").filter(Boolean) : [];
}

function removeDataForSubmodule(root, dataDir) {
  if (isGitRepo(root) && trackedDataPaths(root).length > 0) {
    runGit(root, ["rm", "-r", "--quiet", "_data"]);
    fs.rmSync(dataDir, { recursive: true, force: true });
    return;
  }
  fs.rmSync(dataDir, { recursive: true, force: true });
}

function removeDataForRuntimeMount(dataDir) {
  fs.rmSync(dataDir, { recursive: true, force: true });
}

function cloneCheckout(root, options, dataDir) {
  removeDataForRuntimeMount(dataDir);
  const cloneArgs = ["clone"];
  if (options.dataRef) {
    cloneArgs.push("--branch", options.dataRef);
  }
  cloneArgs.push(options.dataUrl, "_data");
  runGit(root, cloneArgs);
}

function ensureRequiredDirs(dataDir) {
  for (const dirname of REQUIRED_DIRS) {
    fs.mkdirSync(path.join(dataDir, dirname), { recursive: true });
  }
}

function setupDataMount(options) {
  const root = path.resolve(options.root);
  const dataDir = path.join(root, "_data");
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
    throw new Error("_data contains non-skeleton files; re-run with --force to replace it");
  }

  const plan = {
    root,
    dataDir,
    dataUrl: options.dataUrl,
    dataRef: options.dataRef || null,
    mode,
    requestedMode,
    configPath: options.configPath || null,
    dryRun: Boolean(options.dryRun),
    force: Boolean(options.force),
  };

  if (options.dryRun) {
    return { plan, report: null };
  }

  if (mode === "copy") {
    removeDataForRuntimeMount(dataDir);
    copyDirectory(localSource, dataDir);
  } else if (mode === "checkout") {
    cloneCheckout(root, options, dataDir);
  } else {
    removeDataForSubmodule(root, dataDir);
    const submoduleArgs = ["-c", "protocol.file.allow=always", "submodule", "add", "--force"];
    if (options.dataRef) {
      submoduleArgs.push("--branch", options.dataRef);
    }
    submoduleArgs.push(options.dataUrl, "_data");
    runGit(root, submoduleArgs);
  }

  ensureRequiredDirs(dataDir);
  const report = checkDataContract(root);
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
  if (result.plan.dryRun) {
    process.stdout.write("Dry run: no files changed\n");
    return;
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
