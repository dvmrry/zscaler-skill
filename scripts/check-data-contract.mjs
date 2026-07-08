#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_DATA_MOUNT,
  DATA_REQUIRED_DIRS,
  DATA_SKELETON_FILES,
  gitTryOutput,
  normalizeMountPath,
  normalizeRuntimeDataTracking,
  runtimeMountIgnoreStatus,
  runtimeDataMountSettings,
} from "./lib.mjs";

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/check-data-contract.mjs [--root <repo-root>] [--config <json>] [--mount-path <path>] [--tracking ignored|tracked]

Verifies the runtime data mount contract without reading tenant contents.
Defaults to _data unless zscaler-skill-runtime.json, zscaler-skill-setup.json,
or --mount-path says otherwise.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = {
    config: null,
    mountPath: null,
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
    tracking: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--root") {
      args.root = path.resolve(argv[i + 1] || "");
      i += 1;
      continue;
    }
    if (arg === "--config") {
      args.config = argv[i + 1] || "";
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
    throw new Error(`Unknown argument: ${arg}`);
  }

  const settings = runtimeDataMountSettings(args.root, {
    configPath: args.config,
    mountPath: args.mountPath,
    tracking: args.tracking,
  });

  return {
    root: args.root,
    mountPath: settings.mountPath,
    tracking: settings.tracking,
  };
}

function listUsefulEntries(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries
    .filter((entry) => !DATA_SKELETON_FILES.has(entry.name))
    .map((entry) => entry.name);
}

function gitLsTree(root, targetPath) {
  return gitTryOutput(root, ["ls-tree", "HEAD", targetPath]);
}

function detectDataSubmodule(root, mountPath = DEFAULT_DATA_MOUNT) {
  const mount = normalizeMountPath(mountPath);
  const dataGit = path.join(root, mount, ".git");
  const gitmodules = path.join(root, ".gitmodules");
  const lsTree = gitLsTree(root, mount);

  const gitFileLooksLikeSubmodule = fs.existsSync(dataGit) && fs.statSync(dataGit).isFile();
  const gitmodulesMentionsData = fs.existsSync(gitmodules)
    && fs.readFileSync(gitmodules, "utf8").includes(`path = ${mount}`);
  const escapedMount = mount.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const treeMatch = new RegExp(`^160000 commit ([0-9a-f]{40})\\t${escapedMount}$`, "m").exec(lsTree);

  if (!gitFileLooksLikeSubmodule && !gitmodulesMentionsData && !treeMatch) {
    return { isSubmodule: false };
  }

  return {
    isSubmodule: true,
    pinnedCommit: treeMatch ? treeMatch[1] : null,
  };
}

function checkDataContract(root, mountPath = DEFAULT_DATA_MOUNT, options = {}) {
  const mount = normalizeMountPath(mountPath);
  const tracking = normalizeRuntimeDataTracking(options.tracking);
  const dataDir = path.join(root, mount);
  const errors = [];
  const warnings = [];
  const info = [];

  if (!fs.existsSync(dataDir) || !fs.statSync(dataDir).isDirectory()) {
    errors.push(`${mount}/ directory is missing`);
    return { errors, warnings, info };
  }

  const readmePath = path.join(dataDir, "README.md");
  if (!fs.existsSync(readmePath) || !fs.statSync(readmePath).isFile()) {
    warnings.push(`${mount}/README.md is missing`);
  }

  for (const dirname of DATA_REQUIRED_DIRS) {
    const dir = path.join(dataDir, dirname);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      errors.push(`${mount}/${dirname}/ directory is missing`);
      continue;
    }
    const usefulEntries = listUsefulEntries(dir);
    if (usefulEntries.length === 0) {
      warnings.push(`${mount}/${dirname}/ contains only skeleton files`);
    }
  }

  const submodule = detectDataSubmodule(root, mount);
  if (submodule.isSubmodule) {
    if (submodule.pinnedCommit) {
      info.push(`${mount} appears to be a git submodule pinned at ${submodule.pinnedCommit}`);
    } else {
      info.push(`${mount} appears to be a git submodule; pinned commit unavailable from current HEAD`);
    }
  } else {
    info.push(`${mount} appears to be an ordinary directory`);
    const ignoreStatus = runtimeMountIgnoreStatus(root, mount);
    if (tracking === "tracked") {
      info.push(`${mount} is configured as tracked runtime data`);
      if (ignoreStatus.isGitRepo && ignoreStatus.ignored) {
        warnings.push(
          `${mount}/ is configured as tracked runtime data but is ignored by git; remove the ignore rule before committing work-mirror data`,
        );
      }
    } else if (ignoreStatus.isGitRepo && !ignoreStatus.ignored) {
      const subject = mount === DEFAULT_DATA_MOUNT
        ? `${mount}/ is configured for ignored runtime data`
        : `${mount}/ is a custom runtime-data mount`;
      warnings.push(
        `${subject} but is not ignored by git; run setup-data-mount.mjs or add ${ignoreStatus.pattern} to .git/info/exclude`,
      );
    }
  }

  if (warnings.some((warning) => warning.includes(`${mount}/snapshot/`))) {
    warnings.push(`no ${mount}/snapshot content: snapshot-backed reasoning unavailable`);
  }
  if (warnings.some((warning) => warning.includes(`${mount}/schemas/`))) {
    warnings.push(`no ${mount}/schemas content: tenant schema hints unavailable`);
  }

  return { errors, warnings, info };
}

function printReport(report) {
  process.stdout.write("Data contract report\n");
  process.stdout.write("====================\n");
  for (const line of report.info) process.stdout.write(`INFO: ${line}\n`);
  for (const line of report.warnings) process.stdout.write(`WARN: ${line}\n`);
  for (const line of report.errors) process.stdout.write(`ERROR: ${line}\n`);
  process.stdout.write(`Errors: ${report.errors.length}\n`);
  process.stdout.write(`Warnings: ${report.warnings.length}\n`);
}

function main() {
  try {
    const args = parseArgs(process.argv);
    const report = checkDataContract(args.root, args.mountPath, { tracking: args.tracking });
    printReport(report);
    process.exit(report.errors.length === 0 ? 0 : 1);
  } catch (error) {
    process.stderr.write(`check-data-contract: ${error.message}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  checkDataContract,
  detectDataSubmodule,
};
