#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { capabilities as investigatorCapabilities } from "./investigator-artifacts.mjs";
import { capabilities as auditorCapabilities } from "./auditor-artifacts.mjs";
import { capabilities as socCapabilities } from "./soc-artifacts.mjs";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Glob-like patterns for tracked files to scan. Directories are walked
// recursively; plain file entries are checked directly.
const SCAN_PATHS = [
  "AGENTS.md",
  "SKILL.md",
  "README.md",
  "agents",
  ".devin",
  ".claude/commands",
  ".agents/skills",
  "docs",
  "plans",
];

// Matches any token following "investigator-artifacts.mjs " in prose or code.
const COMMAND_REF_RE = /investigator-artifacts\.mjs\s+([a-z][a-z-]*)/g;

// Matches any token following "auditor-artifacts.mjs " in prose or code.
const AUDITOR_COMMAND_REF_RE = /auditor-artifacts\.mjs\s+([a-z][a-z-]*)/g;

// Matches any token following "soc-artifacts.mjs " in prose or code.
const SOC_COMMAND_REF_RE = /soc-artifacts\.mjs\s+([a-z][a-z-]*)/g;

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/check-helper-command-refs.mjs [--root <repo-root>]

Scans tracked docs for investigator-artifacts.mjs, auditor-artifacts.mjs, and
soc-artifacts.mjs <command> mentions and reports any token not in the respective
supported command sets.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = { root: DEFAULT_ROOT };
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

/** Walk a directory recursively and collect .md files. */
function walkMarkdown(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMarkdown(full, results);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

/** Collect all markdown files to scan given the repo root and scan paths. */
function collectFiles(root, scanPaths) {
  const files = [];
  for (const rel of scanPaths) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkMarkdown(full, files);
    } else if (stat.isFile() && full.endsWith(".md")) {
      files.push(full);
    }
  }
  // Deduplicate (a file could be matched by both a direct entry and a walk).
  return [...new Set(files)].sort();
}

/**
 * Scan the given files for investigator-artifacts.mjs, auditor-artifacts.mjs,
 * and soc-artifacts.mjs command references. Reports any token not in the
 * respective supported command sets.
 *
 * @param {string} root                 Repo root (for relative path display).
 * @param {string[]} files              Absolute paths to scan.
 * @param {Set<string>} validCommands   Valid investigator command tokens.
 * @param {Set<string>} validAuditorCommands  Valid auditor command tokens.
 * @param {Set<string>} validSocCommands      Valid SOC command tokens.
 * @returns {{ errors: string[], mentionCount: number }}
 *
 * Exported so the test file can call it directly against a temp directory.
 */
export function scanFiles(root, files, validCommands, validAuditorCommands = new Set(), validSocCommands = new Set()) {
  const errors = [];
  let mentionCount = 0;

  for (const filePath of files) {
    let text;
    try {
      text = fs.readFileSync(filePath, "utf8");
    } catch (err) {
      errors.push(`${path.relative(root, filePath)}: could not read file — ${err.message}`);
      continue;
    }

    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];

      // Investigator command references.
      for (const match of line.matchAll(COMMAND_REF_RE)) {
        const token = match[1];
        mentionCount += 1;
        if (!validCommands.has(token)) {
          const rel = path.relative(root, filePath);
          errors.push(
            `${rel}:${i + 1}: unknown investigator-artifacts.mjs command "${token}" — valid commands: ${[...validCommands].join(", ")}`,
          );
        }
      }

      // Auditor command references.
      for (const match of line.matchAll(AUDITOR_COMMAND_REF_RE)) {
        const token = match[1];
        mentionCount += 1;
        if (validAuditorCommands.size > 0 && !validAuditorCommands.has(token)) {
          const rel = path.relative(root, filePath);
          errors.push(
            `${rel}:${i + 1}: unknown auditor-artifacts.mjs command "${token}" — valid commands: ${[...validAuditorCommands].join(", ")}`,
          );
        }
      }

      // SOC command references.
      for (const match of line.matchAll(SOC_COMMAND_REF_RE)) {
        const token = match[1];
        mentionCount += 1;
        if (validSocCommands.size > 0 && !validSocCommands.has(token)) {
          const rel = path.relative(root, filePath);
          errors.push(
            `${rel}:${i + 1}: unknown soc-artifacts.mjs command "${token}" — valid commands: ${[...validSocCommands].join(", ")}`,
          );
        }
      }
    }
  }

  return { errors, mentionCount };
}

function main() {
  const args = parseArgs(process.argv);
  const invCap = investigatorCapabilities();
  const validCommands = new Set(invCap.supported);
  const audCap = auditorCapabilities();
  const validAuditorCommands = new Set(audCap.supported);
  const socCap = socCapabilities();
  const validSocCommands = new Set(socCap.supported);

  const files = collectFiles(args.root, SCAN_PATHS);
  const { errors, mentionCount } = scanFiles(args.root, files, validCommands, validAuditorCommands, validSocCommands);

  if (errors.length > 0) {
    for (const err of errors) {
      process.stderr.write(`ERROR: ${err}\n`);
    }
    process.exit(1);
  }

  process.stdout.write(
    `checked ${files.length} files, ${mentionCount} command mentions, all valid\n`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
