#!/usr/bin/env node
import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REQUIRED_DIRS = ["cases", "schemas", "snapshot", "iac"];
const IGNORED_SKELETON_FILES = new Set([".gitkeep", "README.md"]);

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/check-data-contract.mjs [--root <repo-root>]

Verifies the _data runtime mount contract without reading tenant contents.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = {
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--root") {
      args.root = path.resolve(argv[i + 1] || "");
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function listUsefulEntries(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries
    .filter((entry) => !IGNORED_SKELETON_FILES.has(entry.name))
    .map((entry) => entry.name);
}

function gitLsTree(root, targetPath) {
  try {
    return childProcess.execFileSync(
      "git",
      ["ls-tree", "HEAD", targetPath],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
  } catch {
    return "";
  }
}

function detectDataSubmodule(root) {
  const dataGit = path.join(root, "_data", ".git");
  const gitmodules = path.join(root, ".gitmodules");
  const lsTree = gitLsTree(root, "_data");

  const gitFileLooksLikeSubmodule = fs.existsSync(dataGit) && fs.statSync(dataGit).isFile();
  const gitmodulesMentionsData = fs.existsSync(gitmodules)
    && fs.readFileSync(gitmodules, "utf8").includes("path = _data");
  const treeMatch = /^160000 commit ([0-9a-f]{40})\t_data$/m.exec(lsTree);

  if (!gitFileLooksLikeSubmodule && !gitmodulesMentionsData && !treeMatch) {
    return { isSubmodule: false };
  }

  return {
    isSubmodule: true,
    pinnedCommit: treeMatch ? treeMatch[1] : null,
  };
}

function checkDataContract(root) {
  const dataDir = path.join(root, "_data");
  const errors = [];
  const warnings = [];
  const info = [];

  if (!fs.existsSync(dataDir) || !fs.statSync(dataDir).isDirectory()) {
    errors.push("_data/ directory is missing");
    return { errors, warnings, info };
  }

  const readmePath = path.join(dataDir, "README.md");
  if (!fs.existsSync(readmePath) || !fs.statSync(readmePath).isFile()) {
    warnings.push("_data/README.md is missing");
  }

  for (const dirname of REQUIRED_DIRS) {
    const dir = path.join(dataDir, dirname);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      errors.push(`_data/${dirname}/ directory is missing`);
      continue;
    }
    const usefulEntries = listUsefulEntries(dir);
    if (usefulEntries.length === 0) {
      warnings.push(`_data/${dirname}/ contains only skeleton files`);
    }
  }

  const submodule = detectDataSubmodule(root);
  if (submodule.isSubmodule) {
    if (submodule.pinnedCommit) {
      info.push(`_data appears to be a git submodule pinned at ${submodule.pinnedCommit}`);
    } else {
      info.push("_data appears to be a git submodule; pinned commit unavailable from current HEAD");
    }
  } else {
    info.push("_data appears to be an ordinary directory");
  }

  if (warnings.some((warning) => warning.includes("_data/snapshot/"))) {
    warnings.push("no _data/snapshot content: snapshot-backed reasoning unavailable");
  }
  if (warnings.some((warning) => warning.includes("_data/schemas/"))) {
    warnings.push("no _data/schemas content: tenant schema hints unavailable");
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
    const report = checkDataContract(args.root);
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
