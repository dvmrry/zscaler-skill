#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { checkNodeVersion } from "./doctor.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const referenceFreshnessBase = process.env.REFERENCE_FRESHNESS_BASE || "origin/main";
const PYTEST_FILES = [
  "scripts/automate-capture/test_extract_docusaurus_blobs.py",
  "scripts/automate-capture/test_build_openapi_from_blobs.py",
  "scripts/automate-capture/test_reconcile_contract.py",
  "scripts/automate-capture/test_rosetta.py",
];

const FULL_CHECKS = [
  {
    name: "Biome lint",
    command: "npx",
    args: ["--yes", "@biomejs/biome@1.9.4", "lint", "docs", "scripts"],
  },
  {
    name: "Ruff lint",
    command: "uvx",
    args: ["ruff@0.6.9", "check", "scripts/"],
  },
  {
    name: "fast gate",
    command: process.execPath,
    args: ["scripts/check-fast.mjs"],
    env: { MCP_CONFORMANCE_OFFLINE: "1" },
  },
  { name: "documentation hygiene", command: "./scripts/check-hygiene.py", args: [] },
  {
    name: "pure agent-pattern regression tests",
    command: "uv",
    args: ["run", "python", "scripts/agent_patterns.test.py"],
  },
  {
    name: "reference freshness semantics",
    command: process.execPath,
    args: [
      "scripts/check-reference-freshness.mjs",
      "--base",
      referenceFreshnessBase,
      "--strict",
    ],
    advisory: true,
  },
  {
    name: "automate-capture regression tests",
    command: "uv",
    args: ["run", "--with", "pytest", "python", "-m", "pytest", ...PYTEST_FILES],
  },
  { name: "documentation links", command: "./scripts/check-doc-links.py", args: [] },
  {
    name: "citation-density regression tests",
    command: "./scripts/check-citation-density.test.py",
    args: [],
  },
  {
    name: "citation source audit",
    command: "./scripts/check-citation-density.py",
    args: ["--audit-source-quality", "--include-source-style", "--strict-sources", "--top", "25"],
  },
  {
    name: "semantic citation evidence coverage",
    command: "./scripts/check-citation-density.py",
    args: [
      "--audit-source-quality",
      "--include-semantic",
      "--strict-sources",
      "--top",
      "10",
    ],
    advisory: true,
  },
  {
    name: "citation inventory",
    command: "./scripts/check-citation-density.py",
    args: [
      "--compare-citation-inventory",
      "references/_meta/citation-inventory.json",
      "--strict-inventory",
      "--top",
      "25",
    ],
  },
  { name: "orphan references", command: "./scripts/check-orphans.py", args: [] },
  {
    name: "vendor family coverage",
    command: "./scripts/check-family-coverage.py",
    args: [],
    advisory: true,
  },
  {
    name: "vendor-source drift",
    command: "./scripts/check-vendor-drift.py",
    args: [],
    advisory: true,
  },
  { name: "help-article scrape freshness", command: "./scripts/check-scrape-freshness.py", args: [] },
];

function uninitializedSubmodulePaths(output) {
  return output
    .split("\n")
    .filter((line) => line.startsWith("-"))
    .map((line) => line.trim().split(/\s+/)[1])
    .filter(Boolean);
}

function submoduleStatusPaths(output) {
  return output
    .split("\n")
    .map((line) => line.trim().split(/\s+/)[1])
    .filter(Boolean);
}

function gitlinkPaths(output) {
  return output
    .split("\0")
    .map((entry) => entry.match(/^160000\s+[0-9a-f]+\s+\d+\t(.+)$/)?.[1])
    .filter(Boolean);
}

function missingSubmoduleStatusPaths(indexOutput, statusOutput) {
  const reported = new Set(submoduleStatusPaths(statusOutput));
  return gitlinkPaths(indexOutput).filter((submodulePath) => !reported.has(submodulePath));
}

function submodulePreflight(root = repoRoot) {
  const statusResult = spawnSync("git", ["submodule", "status", "--recursive"], {
    cwd: root,
    encoding: "utf8",
  });
  if (statusResult.status !== 0) {
    return {
      code: statusResult.status ?? 1,
      detail: (statusResult.stderr || statusResult.stdout || "git submodule status failed").trim(),
    };
  }

  const indexResult = spawnSync("git", ["ls-files", "--stage", "-z"], {
    cwd: root,
    encoding: "utf8",
  });
  if (indexResult.status !== 0) {
    return {
      code: indexResult.status ?? 1,
      detail: (indexResult.stderr || indexResult.stdout || "git ls-files failed").trim(),
    };
  }

  const uninitialized = uninitializedSubmodulePaths(statusResult.stdout);
  const missing = missingSubmoduleStatusPaths(indexResult.stdout, statusResult.stdout);
  const problems = [];
  if (uninitialized.length > 0) problems.push(`uninitialized: ${uninitialized.join(", ")}`);
  if (missing.length > 0) problems.push(`missing from submodule status: ${missing.join(", ")}`);
  if (problems.length > 0) {
    return {
      code: 1,
      detail: `${problems.join("\n")}\nRun: git submodule update --init --recursive`,
    };
  }
  return { code: 0, detail: "all indexed submodules are initialized" };
}

function runCheck(check, root = repoRoot) {
  const started = Date.now();
  return new Promise((resolve) => {
    const child = spawn(check.command, check.args, {
      cwd: root,
      env: { ...process.env, ...check.env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      resolve({ ...check, code: 1, stdout, stderr: `${stderr}${error.message}\n`, durationMs: Date.now() - started });
    });
    child.on("close", (code) => {
      resolve({ ...check, code: code ?? 1, stdout, stderr, durationMs: Date.now() - started });
    });
  });
}

function resultStatus(result) {
  if (result.code === 0) return "PASS";
  return result.advisory ? "WARN" : "FAIL";
}

function exitCodeForResults(results) {
  return results.some((result) => result.code !== 0 && !result.advisory) ? 1 : 0;
}

function printResult(result) {
  const status = resultStatus(result);
  const seconds = (result.durationMs / 1000).toFixed(2);
  console.log(`[${status}] ${result.name} (${seconds}s)`);
  if (status !== "PASS") {
    if (result.stdout.trim()) console.log(result.stdout.trimEnd());
    if (result.stderr.trim()) console.error(result.stderr.trimEnd());
  }
}

async function main() {
  const nodeCheck = checkNodeVersion();
  if (nodeCheck.status === "FAIL") {
    console.error(`check-full: ${nodeCheck.detail}`);
    process.exit(1);
  }

  const preflight = submodulePreflight();
  if (preflight.code !== 0) {
    console.error(`[FAIL] vendor submodules\n${preflight.detail}`);
    process.exit(1);
  }
  console.log(`[PASS] vendor submodules (${preflight.detail})`);

  const results = [];
  for (const check of FULL_CHECKS) {
    const result = await runCheck(check);
    results.push(result);
    printResult(result);
  }

  const advisoryCount = results.filter((result) => resultStatus(result) === "WARN").length;
  const failureCount = results.filter((result) => result.code !== 0 && !result.advisory).length;
  if (exitCodeForResults(results) !== 0) {
    console.error(`\n${failureCount} required full-gate check(s) failed; ${advisoryCount} advisory warning(s).`);
    process.exit(1);
  }
  console.log(`\nFull gate passed with ${advisoryCount} advisory warning(s).`);
}

function isMainModule(argvPath, moduleUrl) {
  return Boolean(argvPath) && path.resolve(argvPath) === fileURLToPath(moduleUrl);
}

if (isMainModule(process.argv[1], import.meta.url)) {
  await main();
}

export {
  FULL_CHECKS,
  exitCodeForResults,
  gitlinkPaths,
  isMainModule,
  missingSubmoduleStatusPaths,
  resultStatus,
  submoduleStatusPaths,
  submodulePreflight,
  uninitializedSubmodulePaths,
};
