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
  node scripts/setup-data-mount.mjs --data-url <git-url-or-local-path> [--data-ref <ref>] [--mode auto|copy|submodule] [--root <repo-root>] [--force] [--dry-run]

Replaces the public _data skeleton with a user-supplied runtime data mount.

Mode auto copies local directories into _data and adds other URLs as a git
submodule. Use --mode submodule when a local repository path should be mounted
as a real _data submodule instead of copied.
The helper never knows private URLs unless the caller provides one at runtime.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = {
    dataUrl: null,
    dataRef: null,
    dryRun: false,
    force: false,
    mode: "auto",
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") usage(0);
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
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.dataUrl) {
    throw new Error("--data-url is required");
  }
  if (!["auto", "copy", "submodule"].includes(args.mode)) {
    throw new Error("--mode must be one of: auto, copy, submodule");
  }

  return args;
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

function ensureRequiredDirs(dataDir) {
  for (const dirname of REQUIRED_DIRS) {
    fs.mkdirSync(path.join(dataDir, dirname), { recursive: true });
  }
}

function setupDataMount(options) {
  const root = path.resolve(options.root);
  const dataDir = path.join(root, "_data");
  const localSource = resolveLocalSource(root, options.dataUrl);
  const requestedMode = options.mode || "auto";
  const mode = requestedMode === "auto"
    ? (localSource ? "copy" : "submodule")
    : requestedMode;
  const safeToReplace = isSkeletonTree(dataDir);

  if (mode === "copy" && !localSource) {
    throw new Error("--mode copy requires --data-url to resolve to a local directory");
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
    dryRun: Boolean(options.dryRun),
    force: Boolean(options.force),
  };

  if (options.dryRun) {
    return { plan, report: null };
  }

  if (mode === "copy") {
    fs.rmSync(dataDir, { recursive: true, force: true });
    copyDirectory(localSource, dataDir);
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
