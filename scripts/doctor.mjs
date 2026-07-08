#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { checkDataContract } from "./check-data-contract.mjs";
import { gitTryOutput } from "./lib.mjs";

const MIN_NODE_VERSION = "18.0.0";
const REQUIRED_LAYOUT = [
  { path: "SKILL.md", type: "file" },
  { path: "references", type: "directory" },
  { path: "agents", type: "directory" },
  { path: "scripts", type: "directory" },
];
const DEFAULT_VENDOR_SPOT_CHECKS = 3;

function defaultRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/doctor.mjs [--json]

Runs a local setup health check against the skill install this script belongs
to, and prints the next command or doc pointer for anything missing. An absent
_data/ mount is optional (skip); a present-but-invalid one fails. No network
calls are made.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = {
    json: false,
    root: defaultRoot(),
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--json") {
      args.json = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function parseVersion(version) {
  const cleaned = String(version).trim().replace(/^v/, "");
  const parts = cleaned.split(/[.-]/).slice(0, 3).map((part) => Number.parseInt(part, 10));
  if (parts.length === 0 || parts.some((part) => Number.isNaN(part))) {
    throw new Error(`invalid version: ${version}`);
  }
  while (parts.length < 3) parts.push(0);
  return parts;
}

function compareVersions(left, right) {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  for (let i = 0; i < 3; i += 1) {
    if (leftParts[i] > rightParts[i]) return 1;
    if (leftParts[i] < rightParts[i]) return -1;
  }
  return 0;
}

function versionAtLeast(version, minimum = MIN_NODE_VERSION) {
  return compareVersions(version, minimum) >= 0;
}

function checkNodeVersion(version = process.versions.node) {
  try {
    if (versionAtLeast(version, MIN_NODE_VERSION)) {
      return {
        name: "Node version",
        status: "ok",
        detail: `${version} >= ${MIN_NODE_VERSION}`,
      };
    }
  } catch (error) {
    return {
      name: "Node version",
      status: "FAIL",
      detail: error.message,
      next: "docs/getting-started.md#prerequisites",
    };
  }

  return {
    name: "Node version",
    status: "FAIL",
    detail: `${version} < ${MIN_NODE_VERSION}`,
    next: "docs/getting-started.md#prerequisites",
  };
}

function pathMatchesType(root, entry) {
  const target = path.join(root, entry.path);
  if (!fs.existsSync(target)) return false;
  const stat = fs.statSync(target);
  return entry.type === "file" ? stat.isFile() : stat.isDirectory();
}

function checkRepoLayout(root) {
  const missing = REQUIRED_LAYOUT
    .filter((entry) => !pathMatchesType(root, entry))
    .map((entry) => `${entry.path}${entry.type === "directory" ? "/" : ""}`);

  if (missing.length === 0) {
    return {
      name: "Repo layout",
      status: "ok",
      detail: "SKILL.md, references/, agents/, and scripts/ present",
    };
  }

  return {
    name: "Repo layout",
    status: "FAIL",
    detail: `missing or wrong type: ${missing.join(", ")}`,
    next: "docs/getting-started.md#clone-with-submodules",
  };
}

function parseGitmodulesPaths(content) {
  const paths = [];
  const pattern = /^\s*path\s*=\s*(.+?)\s*$/gm;
  let match = pattern.exec(content);
  while (match) {
    paths.push(match[1]);
    match = pattern.exec(content);
  }
  return paths;
}

function isNonEmptyCheckout(root, relativePath) {
  const target = path.join(root, relativePath);
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) return false;
  return fs.readdirSync(target).some((entry) => entry !== ".git");
}

function isGitWorkingTree(root) {
  return gitTryOutput(root, ["rev-parse", "--is-inside-work-tree"]) === "true";
}

// Emitted commands embed the resolved root so they are safe to copy-paste
// from any cwd (the operator may run the doctor from outside the repo).
function submoduleNext(root) {
  if (isGitWorkingTree(root)) return `git -C ${root} submodule update --init --recursive`;
  return "docs/getting-started.md#clone-with-submodules";
}

function checkVendorSubmodules(root, spotCheckCount = DEFAULT_VENDOR_SPOT_CHECKS) {
  const gitmodulesPath = path.join(root, ".gitmodules");
  if (!fs.existsSync(gitmodulesPath) || !fs.statSync(gitmodulesPath).isFile()) {
    return {
      name: "Vendor submodules",
      status: "FAIL",
      detail: ".gitmodules is missing",
      next: "docs/getting-started.md#clone-with-submodules",
    };
  }

  const paths = parseGitmodulesPaths(fs.readFileSync(gitmodulesPath, "utf8"));
  const checked = paths.slice(0, spotCheckCount);
  if (checked.length === 0) {
    return {
      name: "Vendor submodules",
      status: "FAIL",
      detail: ".gitmodules contains no paths",
      next: "docs/getting-started.md#clone-with-submodules",
    };
  }

  const missing = checked.filter((entry) => !isNonEmptyCheckout(root, entry));
  if (missing.length === 0) {
    return {
      name: "Vendor submodules",
      status: "ok",
      detail: `${checked.length} spot-checks present: ${checked.join(", ")}`,
    };
  }

  return {
    name: "Vendor submodules",
    status: "FAIL",
    detail: `missing or empty: ${missing.join(", ")}`,
    next: submoduleNext(root),
  };
}

function checkGitHooksPath(root) {
  const actual = gitTryOutput(root, ["config", "core.hooksPath"]);
  if (actual === ".githooks") {
    return {
      name: "Git hooks path",
      status: "ok",
      detail: "core.hooksPath is .githooks",
    };
  }

  return {
    name: "Git hooks path",
    status: "FAIL",
    detail: `core.hooksPath is ${actual || "<unset>"}; expected .githooks`,
    next: isGitWorkingTree(root)
      ? `git -C ${root} config core.hooksPath .githooks`
      : "docs/getting-started.md#clone-with-submodules",
  };
}

function dataSetupNext(root) {
  const configPath = path.join(root, "zscaler-skill-setup.json");
  if (fs.existsSync(configPath) && fs.statSync(configPath).isFile()) {
    return `node ${path.join(root, "scripts/setup-data-mount.mjs")}`;
  }
  return "docs/getting-started.md#set-up-runtime-data";
}

// _data/ is optional: absent -> skip (never affects the exit code). But a
// _data/ that EXISTS and violates the contract is broken state, not an
// optional absence — it FAILs and the doctor exits 1 (fail-closed, matching
// the skill's tenant-answer discipline).
function checkDataRuntimeMount(root) {
  const dataDir = path.join(root, "_data");
  if (!fs.existsSync(dataDir)) {
    return {
      name: "_data runtime mount",
      status: "skip",
      detail: "_data/ not present; runtime data is optional",
      next: dataSetupNext(root),
    };
  }
  if (!fs.statSync(dataDir).isDirectory()) {
    return {
      name: "_data runtime mount",
      status: "FAIL",
      detail: "_data exists but is not a directory",
      next: dataSetupNext(root),
    };
  }

  const report = checkDataContract(root);
  if (report.errors.length > 0) {
    return {
      name: "_data runtime mount",
      status: "FAIL",
      detail: `${report.errors.length} contract error(s): ${report.errors.join("; ")}`,
      next: dataSetupNext(root),
    };
  }

  const detailParts = [`contract valid`, `${report.warnings.length} warning(s)`];
  return {
    name: "_data runtime mount",
    status: "ok",
    detail: detailParts.join("; "),
  };
}

function commandCandidates(command, platform = process.platform) {
  if (platform === "win32") {
    const extensions = (process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM")
      .split(";")
      .filter(Boolean);
    return extensions.map((extension) => `${command}${extension.toLowerCase()}`);
  }
  return [command];
}

function findOnPath(command, env = process.env, platform = process.platform) {
  const pathValue = env.PATH || "";
  const directories = pathValue.split(path.delimiter).filter(Boolean);
  const candidates = commandCandidates(command, platform);

  for (const directory of directories) {
    for (const candidate of candidates) {
      const target = path.join(directory, candidate);
      try {
        fs.accessSync(target, fs.constants.X_OK);
        if (fs.statSync(target).isFile()) return target;
      } catch {
        // Keep scanning PATH.
      }
    }
  }
  return null;
}

function checkZscalerCtl(env = process.env, platform = process.platform) {
  const found = findOnPath("zscalerctl", env, platform);
  if (found) {
    return {
      name: "zscalerctl companion",
      status: "ok",
      detail: `found at ${found}`,
    };
  }

  return {
    name: "zscalerctl companion",
    status: "skip",
    detail: "not found on PATH; optional companion unavailable",
  };
}

function runChecks(options = {}) {
  const root = path.resolve(options.root || defaultRoot());
  return [
    checkNodeVersion(options.nodeVersion || process.versions.node),
    checkRepoLayout(root),
    checkVendorSubmodules(root),
    checkGitHooksPath(root),
    checkDataRuntimeMount(root),
    checkZscalerCtl(options.env || process.env, options.platform || process.platform),
  ];
}

function publicChecks(checks) {
  return checks.map((check) => ({
    name: check.name,
    status: check.status,
    detail: check.detail,
    next: check.next || null,
  }));
}

function checksOk(checks) {
  return !checks.some((check) => check.status === "FAIL");
}

function exitCodeForChecks(checks) {
  return checksOk(checks) ? 0 : 1;
}

function formatJsonReport(checks) {
  return `${JSON.stringify({ checks: publicChecks(checks), ok: checksOk(checks) }, null, 2)}\n`;
}

function formatTextReport(checks) {
  const lines = [];
  for (const check of checks) {
    lines.push(`${check.status} ${check.name} (${check.detail})`);
    if (check.next) lines.push(`  next: ${check.next}`);
  }
  return `${lines.join("\n")}\n`;
}

function main() {
  try {
    const args = parseArgs(process.argv);
    const checks = runChecks({ root: args.root });
    process.stdout.write(args.json ? formatJsonReport(checks) : formatTextReport(checks));
    process.exit(exitCodeForChecks(checks));
  } catch (error) {
    process.stderr.write(`doctor: ${error.message}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  checkDataRuntimeMount,
  checkGitHooksPath,
  checkNodeVersion,
  checkRepoLayout,
  checkVendorSubmodules,
  checkZscalerCtl,
  checksOk,
  compareVersions,
  exitCodeForChecks,
  findOnPath,
  formatJsonReport,
  formatTextReport,
  parseArgs,
  parseGitmodulesPaths,
  runChecks,
  versionAtLeast,
};
