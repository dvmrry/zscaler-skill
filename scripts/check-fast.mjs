#!/usr/bin/env node
import { spawn } from "node:child_process";
import process from "node:process";

const CHECKS = [
  {
    name: "workflow metadata",
    command: "node",
    args: ["scripts/check-workflow-metadata.mjs"],
  },
  {
    name: "citation links",
    command: "node",
    args: ["scripts/check-citations.mjs"],
  },
  {
    name: "node helper tests",
    command: "node",
    args: [
      "--test",
      "scripts/investigator-artifacts.test.mjs",
      "scripts/check-data-contract.test.mjs",
      "scripts/prepare-overlay-submission.test.mjs",
      "scripts/setup-data-mount.test.mjs",
      "scripts/check-citations.test.mjs",
    ],
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
