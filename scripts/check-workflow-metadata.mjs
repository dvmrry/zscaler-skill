#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AGENTS_ROOT = path.join(REPO_ROOT, "agents");

const REQUIRED_FIELDS = [
  "id",
  "title",
  "summary",
  "primary-command",
  "known-runtimes",
  "required-reads",
  "supporting-scripts",
];

const ADAPTER_POINTER_FILES = {
  "z-architect": [
    ".claude/commands/z-architect.md",
    ".windsurf/workflows/z-architect.md",
  ],
  "z-auditor": [
    ".claude/commands/z-auditor.md",
    ".windsurf/workflows/z-auditor.md",
  ],
  "z-investigator": [
    ".agents/skills/zscaler-investigator/SKILL.md",
    ".claude/commands/z-investigator.md",
    ".claude/commands/z-investigator-resume.md",
    ".windsurf/workflows/z-investigator.md",
    ".windsurf/workflows/z-investigator-resume.md",
  ],
  "z-researcher": [
    ".claude/commands/z-researcher.md",
    ".windsurf/workflows/z-researcher.md",
  ],
  "z-retro": [
    ".claude/commands/z-retro.md",
    ".windsurf/workflows/z-retro.md",
  ],
  "z-soc": [
    ".claude/commands/z-soc.md",
    ".windsurf/workflows/z-soc.md",
  ],
  zscaler: [
    "zscaler",
    ".windsurf/rules/zscaler.md",
  ],
  "zscaler-skill-setup": [
    ".agents/skills/zscaler-skill-setup/SKILL.md",
  ],
};

function rel(absPath) {
  return path.relative(REPO_ROOT, absPath) || ".";
}

function finding(file, message) {
  return { file, message };
}

function safePath(relativePath, owner, findings, label = "path") {
  if (!relativePath || path.isAbsolute(relativePath) || relativePath.includes("\0")) {
    findings.push(finding(owner, `unsafe ${label}: ${relativePath}`));
    return null;
  }
  const normalized = path.normalize(relativePath);
  if (normalized.startsWith("..")) {
    findings.push(finding(owner, `${label} escapes repo root: ${relativePath}`));
    return null;
  }
  return path.join(REPO_ROOT, normalized);
}

function requireExists(relativePath, owner, findings, label = "path") {
  const absPath = safePath(relativePath, owner, findings, label);
  if (!absPath) return false;
  if (!fs.existsSync(absPath)) {
    findings.push(finding(owner, `${label} does not exist: ${relativePath}`));
    return false;
  }
  return true;
}

function parseFrontmatter(filePath, findings) {
  const text = fs.readFileSync(filePath, "utf8");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) {
    findings.push(finding(rel(filePath), "missing YAML frontmatter"));
    return null;
  }

  const data = {};
  let currentList = null;
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;
    const itemMatch = /^\s*-\s+(.+)$/.exec(line);
    if (itemMatch) {
      if (!currentList) {
        findings.push(finding(rel(filePath), `list item without field: ${line.trim()}`));
        continue;
      }
      data[currentList].push(itemMatch[1].trim().replace(/^["']|["']$/g, ""));
      continue;
    }
    const fieldMatch = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line);
    if (!fieldMatch) {
      findings.push(finding(rel(filePath), `unsupported frontmatter line: ${line}`));
      continue;
    }
    const key = fieldMatch[1];
    const value = (fieldMatch[2] || "").trim();
    if (value) {
      data[key] = value.replace(/^["']|["']$/g, "");
      currentList = null;
    } else {
      data[key] = [];
      currentList = key;
    }
  }
  return { data, body: text.slice(match[0].length) };
}

function workflowFiles() {
  if (!fs.existsSync(AGENTS_ROOT)) return [];
  return fs
    .readdirSync(AGENTS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => path.join(AGENTS_ROOT, entry.name, "workflow.md"))
    .filter((candidate) => fs.existsSync(candidate))
    .sort();
}

function checkWorkflow(filePath, findings) {
  const owner = rel(filePath);
  const parsed = parseFrontmatter(filePath, findings);
  if (!parsed) return;
  const { data, body } = parsed;

  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      findings.push(finding(owner, `missing required frontmatter field: ${field}`));
    }
  }

  for (const field of ["known-runtimes", "required-reads", "optional-reads", "supporting-scripts"]) {
    if (field in data && !Array.isArray(data[field])) {
      findings.push(finding(owner, `${field} must be a YAML list`));
    }
  }

  const workflowId = String(data.id || "");
  if (!/^[a-z][a-z0-9-]*$/.test(workflowId)) {
    findings.push(finding(owner, "id must be lower-kebab-case"));
  }
  if (!/^(\/|@)[a-z][a-z0-9-]*$/.test(String(data["primary-command"] || ""))) {
    findings.push(finding(owner, "primary-command must be a slash command or @ command"));
  }

  for (const target of Array.isArray(data["required-reads"]) ? data["required-reads"] : []) {
    requireExists(target, owner, findings, "required read");
  }
  for (const target of Array.isArray(data["optional-reads"]) ? data["optional-reads"] : []) {
    requireExists(target, owner, findings, "optional read");
  }
  for (const helper of Array.isArray(data["supporting-scripts"]) ? data["supporting-scripts"] : []) {
    requireExists(helper, owner, findings, "supporting script");
    if (!body.includes(helper)) {
      findings.push(finding(owner, `body should mention supporting script: ${helper}`));
    }
  }

  for (const target of ADAPTER_POINTER_FILES[workflowId] || []) {
    if (!requireExists(target, owner, findings, "adapter pointer")) continue;
    const text = fs.readFileSync(path.join(REPO_ROOT, target), "utf8");
    if (!text.includes(owner) && !text.includes(workflowId)) {
      findings.push(
        finding(owner, `adapter pointer should mention workflow metadata or id: ${target}`),
      );
    }
  }
}

function main() {
  const findings = [];
  const files = workflowFiles();
  if (files.length === 0) {
    findings.push(finding("agents", "no workflow metadata files found"));
  }
  for (const file of files) {
    checkWorkflow(file, findings);
  }

  console.log("Workflow metadata report");
  console.log("========================");
  console.log(`Workflow metadata files: ${files.length}`);

  if (findings.length === 0) {
    console.log("Errors: 0");
    return 0;
  }

  console.log(`Errors: ${findings.length}`);
  for (const item of findings) {
    console.log(`[ERROR] ${item.file}: ${item.message}`);
  }
  return 1;
}

process.exit(main());
