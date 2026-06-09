#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

// Auto-discover every scripts/*.test.mjs so a new test file is never silently
// skipped by forgetting to register it here.
const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const testFiles = fs
  .readdirSync(scriptsDir)
  .filter((name) => name.endsWith(".test.mjs"))
  .sort()
  .map((name) => `scripts/${name}`);
if (testFiles.length === 0) {
  console.error("check-fast: no scripts/*.test.mjs files discovered");
  process.exit(1);
}

const CHECKS = [
  {
    name: "workflow metadata",
    command: "node",
    args: ["scripts/check-workflow-metadata.mjs"],
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
    name: "node helper tests",
    command: "node",
    args: ["--test", ...testFiles],
  },
  {
    name: "diff whitespace",
    command: "git",
    args: ["diff", "--check"],
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
