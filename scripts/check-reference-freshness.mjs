#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STRICT_CODES = new Set(["fresh-date-stale-pin", "cited-root-uninitialized"]);

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/check-reference-freshness.mjs --base <ref> [--head <ref>] [--root <path>] [--strict]

Checks changed reference documents independently of researcher extraction reports:
  - a newer last-verified date must use current submodule pins;
  - every cited vendor submodule root must be initialized;
  - substantive body changes with current pins and an unchanged date are warned.

Without --head, the current index and working tree are checked, including
untracked reference documents. Pass --head explicitly for a committed range.

Findings are advisory by default. --strict makes the first two classes blocking;
the substantive-content review prompt remains informational.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const options = {
    base: null,
    head: null,
    root: DEFAULT_ROOT,
    strict: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--strict") {
      options.strict = true;
      continue;
    }
    if (["--base", "--head", "--root"].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      if (arg === "--base") options.base = value;
      if (arg === "--head") options.head = value;
      if (arg === "--root") options.root = path.resolve(value);
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }
  if (!options.base) throw new Error("--base is required");
  for (const [label, value] of [["--base", options.base], ["--head", options.head]]) {
    if (value === null) continue;
    if (value.startsWith("-")) throw new Error(`${label} must not begin with '-'`);
  }
  return options;
}

function runGit(root, args, allowFailure = false) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `git ${args[0]} exited ${result.status}`).trim());
  }
  return result;
}

function unquote(value) {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed.at(-1);
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function splitFlowEntries(value) {
  const entries = [];
  let current = "";
  let quote = null;
  let depth = 0;
  for (const character of value) {
    if (quote) {
      current += character;
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      current += character;
      continue;
    }
    if (["(", "[", "{"].includes(character)) depth += 1;
    if ([")", "]", "}"].includes(character)) depth -= 1;
    if (character === "," && depth === 0) {
      entries.push(current);
      current = "";
      continue;
    }
    current += character;
  }
  if (current.trim()) entries.push(current);
  return entries;
}

function parseMappingEntry(raw) {
  const separator = raw.indexOf(":");
  if (separator < 0) return null;
  const key = unquote(raw.slice(0, separator));
  const value = unquote(raw.slice(separator + 1));
  return key ? [key, value] : null;
}

function extractFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) {
    return { body: text, lastVerified: null, lastVerifiedLine: null, verifiedAgainst: new Map() };
  }
  const lines = match[1].split(/\r?\n/);
  let lastVerified = null;
  let lastVerifiedLine = null;
  const verifiedAgainst = new Map();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lastVerifiedMatch = /^last-verified:\s*(.*?)\s*$/.exec(line);
    if (lastVerifiedMatch) {
      lastVerified = unquote(lastVerifiedMatch[1]);
      lastVerifiedLine = index + 2;
      continue;
    }

    const verifiedMatch = /^verified-against:\s*(.*?)\s*$/.exec(line);
    if (!verifiedMatch) continue;
    const inline = verifiedMatch[1];
    if (inline.startsWith("{") && inline.endsWith("}")) {
      for (const rawEntry of splitFlowEntries(inline.slice(1, -1))) {
        const entry = parseMappingEntry(rawEntry);
        if (entry) verifiedAgainst.set(entry[0], { value: entry[1], line: index + 2 });
      }
      continue;
    }
    if (inline) continue;

    for (let childIndex = index + 1; childIndex < lines.length; childIndex += 1) {
      const child = lines[childIndex];
      if (!child.trim() || /^\s*#/.test(child)) continue;
      if (!/^\s/.test(child)) break;
      const entry = parseMappingEntry(child.trim());
      if (entry) verifiedAgainst.set(entry[0], { value: entry[1], line: childIndex + 2 });
    }
  }

  return {
    body: text.slice(match[0].length),
    lastVerified,
    lastVerifiedLine,
    verifiedAgainst,
  };
}

function parseGitmodules(text) {
  const paths = [];
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*path\s*=\s*(.*?)\s*$/.exec(line);
    if (match?.[1]) paths.push(match[1]);
  }
  return [...new Set(paths)].sort();
}

function showFile(root, ref, file, allowMissing = false) {
  const result = runGit(root, ["show", `${ref}:${file}`], allowMissing);
  if (allowMissing && result.status !== 0) return null;
  return result.stdout;
}

function changedReferences(root, base, head) {
  const diffArgs = [
    "diff",
    "--name-only",
    "--diff-filter=ACMR",
    base,
  ];
  if (head !== null) diffArgs.push(head);
  diffArgs.push("--", "references");
  const result = runGit(root, diffArgs);
  const files = result.stdout.split(/\r?\n/);
  if (head === null) {
    const untracked = runGit(root, ["ls-files", "--others", "--exclude-standard", "--", "references"]);
    files.push(...untracked.stdout.split(/\r?\n/));
  }
  return [...new Set(files)]
    .filter((file) => file.startsWith("references/") && file.endsWith(".md"))
    .sort();
}

function currentFile(root, head, file) {
  if (head !== null) return showFile(root, head, file);
  const absolute = path.join(root, file);
  return fs.existsSync(absolute) ? fs.readFileSync(absolute, "utf8") : null;
}

function currentSubmoduleSha(root, head, submodulePath) {
  if (head !== null) {
    const result = runGit(root, ["rev-parse", `${head}:${submodulePath}`], true);
    return result.status === 0 ? result.stdout.trim().toLowerCase() : null;
  }
  if (fs.existsSync(path.join(root, submodulePath, ".git"))) {
    const result = runGit(root, ["-C", submodulePath, "rev-parse", "HEAD"], true);
    if (result.status === 0) return result.stdout.trim().toLowerCase();
  }
  const recorded = runGit(root, ["rev-parse", `HEAD:${submodulePath}`], true);
  return recorded.status === 0 ? recorded.stdout.trim().toLowerCase() : null;
}

function shaFromPin(value) {
  return /^([0-9a-f]{40})(?:\s|$)/i.exec(value)?.[1]?.toLowerCase() || null;
}

function firstLineContaining(text, needle) {
  const lines = text.split(/\r?\n/);
  const index = lines.findIndex((line) => line.includes(needle));
  return index < 0 ? 1 : index + 1;
}

function citedSubmoduleRoots(text, submodulePaths) {
  return submodulePaths.filter((submodulePath) => {
    const escaped = submodulePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^A-Za-z0-9_.-])${escaped}(?=/|\\b)`, "m").test(text);
  });
}

function analyze(options) {
  const root = options.root;
  runGit(root, ["rev-parse", "--verify", `${options.base}^{commit}`]);
  if (options.head !== null) {
    runGit(root, ["rev-parse", "--verify", `${options.head}^{commit}`]);
  }
  const gitmodules = options.head === null
    ? fs.readFileSync(path.join(root, ".gitmodules"), "utf8")
    : showFile(root, options.head, ".gitmodules", true) || "";
  const submodulePaths = parseGitmodules(gitmodules);
  const submoduleSet = new Set(submodulePaths);
  const currentShas = new Map();
  for (const submodulePath of submodulePaths) {
    const sha = currentSubmoduleSha(root, options.head, submodulePath);
    if (sha !== null) currentShas.set(submodulePath, sha);
  }

  const files = changedReferences(root, options.base, options.head);
  const findings = [];
  for (const file of files) {
    const currentText = currentFile(root, options.head, file);
    if (currentText === null) continue;
    const previousText = showFile(root, options.base, file, true);
    const current = extractFrontmatter(currentText);
    const previous = previousText === null ? null : extractFrontmatter(previousText);
    const previousDate = previous?.lastVerified ?? null;
    const dateAdvanced = current.lastVerified !== null
      && (previousDate === null || current.lastVerified > previousDate);
    const dateUnchanged = previous !== null && current.lastVerified === previousDate;

    const submodulePins = [];
    for (const [vendorPath, pin] of current.verifiedAgainst) {
      if (!submoduleSet.has(vendorPath)) continue;
      const declaredSha = shaFromPin(pin.value);
      const currentSha = currentShas.get(vendorPath);
      submodulePins.push({ vendorPath, declaredSha, currentSha, line: pin.line });
      if (dateAdvanced && declaredSha !== currentSha) {
        findings.push({
          code: "fresh-date-stale-pin",
          file,
          line: pin.line,
          message: `last-verified advanced to ${current.lastVerified}, but ${vendorPath} pins ${declaredSha || "an invalid SHA"}; current tree SHA is ${currentSha || "unresolvable"}`,
        });
      }
    }

    for (const vendorPath of citedSubmoduleRoots(currentText, submodulePaths)) {
      if (!fs.existsSync(path.join(root, vendorPath, ".git"))) {
        findings.push({
          code: "cited-root-uninitialized",
          file,
          line: firstLineContaining(currentText, vendorPath),
          message: `${vendorPath} is cited by this changed document but is not initialized`,
        });
      }
    }

    const allPinsCurrent = submodulePins.length > 0
      && submodulePins.every((pin) => pin.declaredSha !== null && pin.declaredSha === pin.currentSha);
    if (previous && current.body !== previous.body && dateUnchanged && allPinsCurrent) {
      findings.push({
        code: "content-date-unchanged",
        level: "REVIEW",
        file,
        line: current.lastVerifiedLine || 1,
        message: `substantive body content changed with current submodule pins, but last-verified remains ${current.lastVerified || "unset"}`,
      });
    }
  }

  return { base: options.base, head: options.head || "worktree", files, findings };
}

function printReport(report) {
  process.stdout.write("Reference freshness advisory\n");
  process.stdout.write(`Base: ${report.base}\nHead: ${report.head}\n`);
  process.stdout.write(`Changed reference docs: ${report.files.length}\n\n`);
  for (const finding of report.findings) {
    process.stdout.write(`[${finding.level || "WARN"} ${finding.code}] ${finding.file}:${finding.line}: ${finding.message}\n`);
  }
  const counts = new Map();
  for (const finding of report.findings) counts.set(finding.code, (counts.get(finding.code) || 0) + 1);
  process.stdout.write("\nSummary:\n");
  for (const code of ["fresh-date-stale-pin", "cited-root-uninitialized", "content-date-unchanged"]) {
    process.stdout.write(`  ${code}: ${counts.get(code) || 0}\n`);
  }
  if (counts.get("content-date-unchanged")) {
    process.stdout.write(
      "Content/date items are review prompts, not a cleanup queue; advance a date only after whole-document re-verification.\n",
    );
  }
  if (report.findings.length === 0) process.stdout.write("No reference freshness advisories.\n");
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = analyze(options);
    printReport(report);
    if (options.strict && report.findings.some((finding) => STRICT_CODES.has(finding.code))) {
      process.exitCode = 1;
    }
  } catch (error) {
    process.stderr.write(`check-reference-freshness: ${error.message}\n`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { analyze, extractFrontmatter, parseArgs, parseGitmodules };
