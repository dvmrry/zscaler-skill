#!/usr/bin/env node
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const DEFAULT_ALLOWED_ROOTS = ["_data/cases", "_data/schemas", "_data/iac"];
const DEFAULT_BRANCH_PREFIX = "artifact-submission/";
const MAX_SCAN_BYTES = 1024 * 1024;

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/prepare-overlay-submission.mjs [--root <repo-root>] [--config <json>] [--repo-url <git-url-or-local-path>] [--default-branch <branch>] [--branch-prefix <prefix>] [--artifact <path>]... [--case-path <path>] [--approve] [--dry-run]

Validates selected runtime artifacts and prepares a submission branch in the
configured overlay repository. The helper never pushes by default.

If --config is omitted, ./zscaler-skill-setup.json is used when it exists.
The config may contain overlaySubmission.repoUrl, defaultBranch, branchPrefix,
allowedRoots, and requireExplicitApproval.
`);
  process.exit(exitCode);
}

function scriptRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

function readJsonIfExists(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return {};
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`config must be a JSON object: ${filePath}`);
  }
  return parsed;
}

function parseArgs(argv) {
  const args = {
    approve: false,
    artifacts: [],
    branchPrefix: null,
    config: null,
    defaultBranch: null,
    dryRun: false,
    repoUrl: null,
    root: scriptRoot(),
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--approve") {
      args.approve = true;
      continue;
    }
    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (arg === "--artifact" || arg === "--case-path") {
      args.artifacts.push(argv[i + 1] || "");
      i += 1;
      continue;
    }
    if (arg === "--branch-prefix") {
      args.branchPrefix = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--config") {
      args.config = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--default-branch") {
      args.defaultBranch = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--repo-url") {
      args.repoUrl = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--root") {
      args.root = path.resolve(argv[i + 1] || "");
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  const configPath = args.config
    ? path.resolve(args.root, args.config)
    : path.join(args.root, "zscaler-skill-setup.json");
  const config = readJsonIfExists(configPath);
  const overlay = config.overlaySubmission || {};

  return {
    approve: args.approve,
    artifacts: args.artifacts.filter(Boolean),
    branchPrefix: args.branchPrefix ?? overlay.branchPrefix ?? DEFAULT_BRANCH_PREFIX,
    configPath: fs.existsSync(configPath) ? configPath : null,
    defaultBranch: args.defaultBranch ?? overlay.defaultBranch ?? "main",
    dryRun: args.dryRun,
    mode: overlay.mode ?? "pull-request",
    repoUrl: args.repoUrl ?? overlay.repoUrl ?? null,
    requireExplicitApproval: overlay.requireExplicitApproval !== false,
    root: args.root,
    allowedRoots: Array.isArray(overlay.allowedRoots) && overlay.allowedRoots.length
      ? overlay.allowedRoots
      : DEFAULT_ALLOWED_ROOTS,
  };
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function validateArtifact(root, artifact, allowedRoots) {
  const absolute = path.resolve(root, artifact);
  if (!isInside(absolute, root)) {
    throw new Error(`artifact must be inside repo root: ${artifact}`);
  }
  if (!fs.existsSync(absolute)) {
    throw new Error(`artifact does not exist: ${artifact}`);
  }
  if (fs.lstatSync(absolute).isSymbolicLink()) {
    throw new Error(`artifact must not be a symlink: ${artifact}`);
  }
  const relative = toPosix(path.relative(root, absolute));
  const allowed = allowedRoots.some((allowedRoot) => {
    const normalized = allowedRoot.replace(/\/+$/, "");
    return relative === normalized || relative.startsWith(`${normalized}/`);
  });
  if (!allowed) {
    throw new Error(`artifact is outside allowed roots: ${relative}`);
  }
  return { absolute, relative, overlayRelative: runtimePathToOverlayPath(relative) };
}

function runtimePathToOverlayPath(runtimePath) {
  if (!runtimePath.startsWith("_data/")) {
    throw new Error(`runtime artifact path must start with _data/: ${runtimePath}`);
  }
  const overlayPath = runtimePath.slice("_data/".length);
  if (!overlayPath || overlayPath.startsWith("../") || path.isAbsolute(overlayPath)) {
    throw new Error(`invalid overlay artifact path: ${runtimePath}`);
  }
  return overlayPath;
}

function listFiles(targetPath) {
  if (fs.lstatSync(targetPath).isSymbolicLink()) {
    throw new Error(`symlink artifacts are not allowed: ${targetPath}`);
  }
  if (fs.statSync(targetPath).isFile()) return [targetPath];
  const files = [];
  const stack = [targetPath];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === ".git") continue;
      const entryPath = path.join(current, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`symlink artifacts are not allowed: ${entryPath}`);
      }
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (entry.isFile()) {
        files.push(entryPath);
      }
    }
  }
  return files.sort();
}

function readTextForScan(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.includes(0)) return null;
  return buffer.toString("utf8");
}

function scanArtifacts(artifacts) {
  const warnings = [];
  const errors = [];
  const rejectPatterns = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key material"],
    [/\bBearer\s+[A-Za-z0-9._~+/=-]{20,}\b/i, "bearer token"],
    [/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/, "AWS access key"],
    [/\bgh[pousr]_[A-Za-z0-9_]{20,}\b/, "GitHub token"],
    [/\b(?:AZURE_DEVOPS_EXT_PAT|AZDO_PAT|ADO_PAT|SYSTEM_ACCESSTOKEN)\s*[:=]\s*["']?[A-Za-z0-9._~+/=-]{20,}/i, "Azure DevOps token"],
    [/\b[A-Za-z0-9._~+/=-]{8,}AZDO[A-Za-z0-9._~+/=-]{20,}\b/, "Azure DevOps token"],
    [/["']?\b(?:client_secret|refresh_token|access_token|id_token)\b["']?\s*[:=]\s*["'][^"'\s]{12,}["']/i, "credential assignment"],
  ];
  const warnPatterns = [
    [/\/Users\/[A-Za-z0-9._-]+/, "local macOS user path"],
    [/\/home\/[A-Za-z0-9._-]+/, "local Linux user path"],
    [/[A-Za-z]:\\Users\\[A-Za-z0-9._-]+/i, "local Windows user path"],
  ];

  for (const artifact of artifacts) {
    for (const filePath of listFiles(artifact.absolute)) {
      const relativeFile = toPosix(path.relative(artifact.root, filePath));
      const stat = fs.statSync(filePath);
      if (stat.size > MAX_SCAN_BYTES) {
        errors.push(`${relativeFile}: exceeds scan limit (${MAX_SCAN_BYTES} bytes)`);
        continue;
      }
      const text = readTextForScan(filePath);
      if (text === null) {
        warnings.push(`${relativeFile}: not scanned as text`);
        continue;
      }
      for (const [pattern, label] of rejectPatterns) {
        if (pattern.test(text)) errors.push(`${relativeFile}: possible ${label}`);
      }
      for (const [pattern, label] of warnPatterns) {
        if (pattern.test(text)) warnings.push(`${relativeFile}: contains ${label}`);
      }
    }
  }

  return { warnings, errors };
}

function runGit(cwd, args) {
  return childProcess.execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function slugFromArtifacts(artifacts) {
  const first = artifacts[0]?.relative || "submission";
  const parts = first.split("/");
  const useful = parts.findLast((part) => part && !part.startsWith("_")) || "submission";
  return useful.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "submission";
}

function copyArtifactToOverlay(artifact, overlayRoot) {
  const target = path.join(overlayRoot, artifact.overlayRelative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(artifact.absolute, target, {
    recursive: true,
    dereference: false,
    force: true,
    filter: (entryPath) => path.basename(entryPath) !== ".git",
  });
}

function gitStatusShort(root) {
  return runGit(root, ["status", "--short"]);
}

function prepareOverlaySubmission(options) {
  const root = path.resolve(options.root);
  if (options.artifacts.length === 0) {
    throw new Error("at least one --artifact or --case-path is required");
  }
  if (!options.repoUrl) {
    throw new Error("overlaySubmission.repoUrl or --repo-url is required");
  }
  if (options.mode && options.mode !== "pull-request") {
    throw new Error("overlaySubmission.mode must be pull-request");
  }
  if (options.requireExplicitApproval && !options.approve) {
    throw new Error("explicit approval required; re-run with --approve");
  }

  const artifacts = options.artifacts.map((artifactPath) => ({
    ...validateArtifact(root, artifactPath, options.allowedRoots),
    root,
  }));
  const scan = scanArtifacts(artifacts);
  if (scan.errors.length > 0) {
    throw new Error(`artifact scan failed:\n${scan.errors.map((error) => `- ${error}`).join("\n")}`);
  }

  const branchName = `${options.branchPrefix}${slugFromArtifacts(artifacts)}-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
  const result = {
    status: options.dryRun ? "dry-run" : "prepared",
    mode: "pull-request",
    branch: branchName,
    files: artifacts.map((artifact) => artifact.overlayRelative),
    sourceFiles: artifacts.map((artifact) => artifact.relative),
    warnings: scan.warnings,
    nextAction: options.dryRun ? "review dry-run output" : "review the overlay branch and push/create a PR if approved",
  };

  if (options.dryRun) return result;

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-overlay-submission-"));
  const overlayRoot = path.join(tempRoot, "overlay");
  runGit(tempRoot, ["clone", "--branch", options.defaultBranch, options.repoUrl, overlayRoot]);
  runGit(overlayRoot, ["checkout", "-b", branchName]);
  for (const artifact of artifacts) copyArtifactToOverlay(artifact, overlayRoot);

  const status = gitStatusShort(overlayRoot);
  if (!status) {
    throw new Error("selected artifacts produced no overlay changes");
  }
  runGit(overlayRoot, ["add", "--", ...artifacts.map((artifact) => artifact.overlayRelative)]);
  runGit(overlayRoot, [
    "-c",
    "user.name=Zscaler Skill",
    "-c",
    "user.email=zscaler-skill@example.invalid",
    "commit",
    "-m",
    `Add overlay artifacts for ${slugFromArtifacts(artifacts)}`,
  ]);

  result.overlayCheckout = overlayRoot;
  result.commit = runGit(overlayRoot, ["rev-parse", "--short", "HEAD"]);
  result.nextAction = `git -C ${overlayRoot} push origin ${branchName}`;
  return result;
}

function printResult(result) {
  process.stdout.write("Overlay submission preparation\n");
  process.stdout.write("==============================\n");
  process.stdout.write(`Status: ${result.status}\n`);
  process.stdout.write(`Branch: ${result.branch}\n`);
  if (result.commit) process.stdout.write(`Commit: ${result.commit}\n`);
  if (result.overlayCheckout) process.stdout.write(`Overlay checkout: ${result.overlayCheckout}\n`);
  for (const file of result.files) process.stdout.write(`FILE: ${file}\n`);
  if (result.sourceFiles) {
    for (const file of result.sourceFiles) process.stdout.write(`SOURCE: ${file}\n`);
  }
  for (const warning of result.warnings) process.stdout.write(`WARN: ${warning}\n`);
  process.stdout.write(`Next action: ${result.nextAction}\n`);
  process.stdout.write("\nJSON:\n");
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

function main() {
  try {
    const args = parseArgs(process.argv);
    const result = prepareOverlaySubmission(args);
    printResult(result);
  } catch (error) {
    process.stderr.write(`prepare-overlay-submission: ${error.message}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  prepareOverlaySubmission,
  runtimePathToOverlayPath,
  scanArtifacts,
  validateArtifact,
};
