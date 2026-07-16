#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/check-vendor-refresh.mjs --base <ref> [--output <path>] [--max-commits <n>]

Runs the reference-focused doctor, generates a worktree-aware vendor impact
summary, and runs the fast repository gate. The summary defaults to a temporary
file; pass --output to retain it in an explicitly selected artifact location.
`);
  process.exit(exitCode);
}

function parseArgs(argv, options = {}) {
  const args = {
    base: null,
    maxCommits: 8,
    output: options.defaultOutput
      || path.join(os.tmpdir(), `zscaler-vendor-impact-${process.pid}.md`),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") usage(0);
    if (["--base", "--output", "--max-commits"].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      if (arg === "--base") args.base = value;
      if (arg === "--output") args.output = value;
      if (arg === "--max-commits") {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isInteger(parsed) || parsed < 1 || String(parsed) !== value) {
          throw new Error("--max-commits must be a positive integer");
        }
        args.maxCommits = parsed;
      }
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.base) throw new Error("--base is required");
  if (args.base.startsWith("-")) throw new Error("--base must not begin with '-'");
  return args;
}

function gateSteps(args) {
  return [
    {
      name: "reference preflight",
      command: process.execPath,
      args: ["scripts/doctor.mjs", "--profile", "references"],
    },
    {
      name: "vendor impact summary",
      command: process.execPath,
      args: [
        "scripts/vendor-impact-summary.mjs",
        "--base",
        args.base,
        "--worktree",
        "--output",
        args.output,
        "--max-commits",
        String(args.maxCommits),
        "--strict",
      ],
    },
    {
      name: "fast repository gate",
      command: process.execPath,
      args: ["scripts/check-fast.mjs"],
    },
  ];
}

function defaultRunner(step, root) {
  return spawnSync(step.command, step.args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
}

function runVendorRefreshGate(args, options = {}) {
  const root = options.root || REPO_ROOT;
  const runner = options.runner || defaultRunner;
  for (const step of gateSteps(args)) {
    options.onStep?.(step);
    const result = runner(step, root);
    if (result.error) throw result.error;
    if (result.status !== 0) {
      return { ok: false, failedStep: step.name, output: args.output };
    }
  }
  return { ok: true, failedStep: null, output: args.output };
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const report = runVendorRefreshGate(args, {
      onStep: (step) => process.stdout.write(`\n==> ${step.name}\n`),
    });
    if (!report.ok) {
      process.stderr.write(`vendor refresh gate failed at: ${report.failedStep}\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(
      `\nVendor refresh mechanical gate passed. Review the impact queue before commit: ${report.output}\n`,
    );
  } catch (error) {
    process.stderr.write(`check-vendor-refresh: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

export { gateSteps, parseArgs, runVendorRefreshGate };
