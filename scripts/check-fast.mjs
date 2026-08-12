#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { checkNodeVersion, MIN_NODE_VERSION } from "./doctor.mjs";

const nodeCheck = checkNodeVersion();
if (nodeCheck.status === "FAIL") {
  console.error(`check-fast: ${nodeCheck.detail}`);
  console.error(`Minimum supported Node.js version is ${MIN_NODE_VERSION}; see ${nodeCheck.next}.`);
  process.exit(1);
}

// Auto-discover every scripts/**/*.test.mjs (recursively, so suites in subdirs
// like scripts/bridge/ are never silently skipped) — a new test file is picked
// up without registering it here.
const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const testFiles = fs
  .readdirSync(scriptsDir, { recursive: true })
  .filter((name) => name.endsWith(".test.mjs"))
  .sort()
  .map((name) => `scripts/${name.split(path.sep).join("/")}`);
if (testFiles.length === 0) {
  console.error("check-fast: no scripts/*.test.mjs files discovered");
  process.exit(1);
}

const CHECKS = [
  {
    name: "release state",
    command: "node",
    args: ["scripts/check-release-state.mjs"],
  },
  {
    name: "verified-against provenance",
    command: "./scripts/check-verified-against.py",
    args: [],
  },
  {
    name: "workflow metadata",
    command: "node",
    args: ["scripts/check-workflow-metadata.mjs"],
  },
  {
    name: "workflow eval shapes",
    command: "./scripts/check-workflow-evals.py",
    args: [],
  },
  {
    name: "portable Agent Skill contracts",
    command: "./scripts/check-agent-skills.py",
    args: [],
  },
  {
    name: "citation links",
    command: "node",
    args: ["scripts/check-citations.mjs"],
  },
  {
    name: "helper command refs",
    command: "node",
    args: ["scripts/check-helper-command-refs.mjs"],
  },
  {
    name: "node helper tests",
    command: "node",
    args: ["--test", ...testFiles],
  },
  {
    name: "MCP conformance",
    command: "node",
    args: ["scripts/check-mcp-conformance.mjs"],
  },
  { name: "capability registry", command: "node", args: ["scripts/check-capability-registry.mjs"] },
  { name: "AGENTS routing block", command: "node", args: ["scripts/gen-capability-routing.mjs", "--check"] },
  {
    name: "worktree whitespace",
    command: "node",
    args: ["scripts/check-worktree-whitespace.mjs"],
  },
];

function runCheck(check) {
  const started = Date.now();
  return new Promise((resolve) => {
    const child = spawn(check.command, check.args, {
      cwd: process.cwd(),
      env: process.env,
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
    child.on("close", (code) => {
      resolve({
        ...check,
        code,
        stdout,
        stderr,
        durationMs: Date.now() - started,
      });
    });
  });
}

function printResult(result) {
  const status = result.code === 0 ? "PASS" : "FAIL";
  const seconds = (result.durationMs / 1000).toFixed(2);
  console.log(`[${status}] ${result.name} (${seconds}s)`);
  if (result.code !== 0) {
    if (result.stdout.trim()) {
      console.log(result.stdout.trimEnd());
    }
    if (result.stderr.trim()) {
      console.error(result.stderr.trimEnd());
    }
  }
}

const results = await Promise.all(CHECKS.map(runCheck));
for (const result of results) {
  printResult(result);
}

const failures = results.filter((result) => result.code !== 0);
if (failures.length > 0) {
  console.error(`\n${failures.length} fast check(s) failed.`);
  process.exit(1);
}

console.log("\nFast checks passed.");
