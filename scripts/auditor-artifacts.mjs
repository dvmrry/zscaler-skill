#!/usr/bin/env node
/**
 * auditor-artifacts.mjs
 *
 * Deterministic helper for auditor role artifacts.
 * Pure Node stdlib — zero external dependencies, no imports from
 * investigator-artifacts.mjs (both are standalone single files per repo ethos).
 *
 * Primitives adapted from investigator-artifacts.mjs (assertSafeSlug,
 * resolveRepoRoot, safeRepoPath, sha256Text, sha256File, atomicWriteFile,
 * atomicWriteJson, readJsonl, appendJsonl). Marked with
 * "ADAPTED FROM investigator-artifacts.mjs" comments so a future
 * shared-utility extraction is discoverable.
 *
 * Audit lifecycle is intentionally lighter than the investigator:
 *   open -> record findings -> report
 * No turn ledger, no hypothesis chain.
 */
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";

// ── Version ───────────────────────────────────────────────────────────────────
let HELPER_VERSION = "unknown";
try {
  const versionFile = new URL("../VERSION", import.meta.url);
  HELPER_VERSION = fs.readFileSync(versionFile, "utf8").trim();
} catch {
  // Fall back to "unknown" — capabilities() must keep working in odd deployments.
}

// ── Constants ─────────────────────────────────────────────────────────────────

const AUDIT_DATA_DIR = "_data/audits";
const AUDIT_INTAKE_BASENAME = "audit-intake";
const REGISTER_BASENAME = "register";
const FINDINGS_BASENAME = "findings.jsonl";
const CHECKS_DIR_BASENAME = "checks";

// Grep-able markers required in audit-intake.md (mirrors investigator's REQUIRED_CASE_INTAKE_FIELDS).
export const REQUIRED_INTAKE_MARKERS = ["Status:", "Blocking Issues:"];

// Canonical findings table header (the register.md derives from findings.jsonl; must match here).
export const REGISTER_TABLE_HEADER =
  "| ID | Description | Source | Severity | Status | Remediation | Notes |";

// Valid severity values per methodology.md.
const VALID_SEVERITIES = new Set(["Critical", "High", "Medium", "Low", "Info"]);

// Valid status values per methodology.md status lifecycle.
const VALID_STATUSES = new Set(["Open", "Acknowledged", "Resolved", "Acceptable", "Wontfix"]);

// Severities that require a strong source (file:line or recorded check).
const STRONG_SOURCE_REQUIRED_SEVERITIES = new Set(["Critical", "High"]);

const SUPPORTED_OPERATIONS = [
  "open-audit",
  "record-finding",
  "record-check-output",
  "render-audit-report",
  "audit-status",
  "capabilities",
];

const SUPPORTED_OPTIONS = {
  "open-audit": ["--root", "--audit-slug", "--scope-json", "--force"],
  "record-finding": ["--root", "--audit-slug", "--finding-json"],
  "record-check-output": ["--root", "--audit-slug", "--check-name", "--output-file", "--exit-code"],
  "render-audit-report": ["--root", "--audit-slug"],
  "audit-status": ["--root", "--audit-slug"],
};

// ── ADAPTED FROM investigator-artifacts.mjs: primitive utilities ───────────────

/** Validate a slug is filesystem-safe (letters, numbers, dot, underscore, hyphen). */
function assertSafeSlug(slug) {
  if (!slug || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) {
    throw new Error("audit slug must use only letters, numbers, dot, underscore, or hyphen");
  }
  if (slug.includes("..")) {
    throw new Error("audit slug cannot contain '..'");
  }
}

/** Resolve and validate a repo root directory path. */
function resolveRepoRoot(rootArg) {
  if (!rootArg) throw new Error("--root is required");
  const root = path.resolve(rootArg);
  const stat = fs.statSync(root, { throwIfNoEntry: false });
  if (!stat || !stat.isDirectory()) {
    throw new Error(`repo root does not exist or is not a directory: ${root}`);
  }
  return root;
}

/** Resolve a repo-relative path safely (cannot escape the root). */
function safeRepoPath(root, relativePath) {
  if (!relativePath || path.isAbsolute(relativePath) || relativePath.includes("\0")) {
    throw new Error(`unsafe relative path: ${relativePath}`);
  }
  const normalized = path.normalize(relativePath);
  if (normalized.startsWith("..") || path.isAbsolute(normalized)) {
    throw new Error(`path escapes repo root: ${relativePath}`);
  }
  return path.join(root, normalized);
}

/** SHA-256 of a text string, prefixed with "sha256:". */
function sha256Text(text) {
  return `sha256:${crypto.createHash("sha256").update(text).digest("hex")}`;
}

/** SHA-256 of a file's contents, prefixed with "sha256:". */
function sha256File(filePath) {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
}

/** Atomic write: write to a .tmp file, then rename. */
function atomicWriteFile(filePath, content) {
  const tempPath = `${filePath}.tmp-${process.pid}-${crypto.randomUUID()}`;
  fs.writeFileSync(tempPath, content, "utf8");
  fs.renameSync(tempPath, filePath);
}

/** Atomic write of a JSON value (pretty-printed, newline-terminated). */
function atomicWriteJson(filePath, value) {
  atomicWriteFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

/** Read a JSONL file, returning an array of parsed objects. */
function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return [];
  return raw.split("\n").map((line) => JSON.parse(line));
}

/** Append one JSON value (as a JSONL line) to a file. */
function appendJsonl(filePath, value) {
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

// ── Audit path helpers ────────────────────────────────────────────────────────

function auditPaths(root, auditSlug) {
  assertSafeSlug(auditSlug);
  const auditDir = path.join(root, AUDIT_DATA_DIR, auditSlug);
  return {
    auditDir,
    auditIntakePath: path.join(auditDir, `${AUDIT_INTAKE_BASENAME}.md`),
    auditIntakeJsonPath: path.join(auditDir, `${AUDIT_INTAKE_BASENAME}.json`),
    registerPath: path.join(auditDir, `${REGISTER_BASENAME}.md`),
    findingsPath: path.join(auditDir, FINDINGS_BASENAME),
    checksDir: path.join(auditDir, CHECKS_DIR_BASENAME),
  };
}

// ── Source resolution (the evidence gate) ────────────────────────────────────

/**
 * Parse a source string and classify it.
 *
 * Source forms:
 *   (a) file:line reference      "path/to/file.md:42" or "path:10-20"
 *       Resolves if: file exists under root AND has >= line lines.
 *   (b) cross-file reference     "path/a.md + path/b.md" (2+ comma/plus-delimited paths)
 *       Resolves if: all listed files exist under root.
 *   (c) recorded-check reference "check:<name>"
 *       Resolves if: the named check's output file exists under checksDir.
 *
 * Returns { type: "file-line"|"cross-file"|"check"|"unknown", resolves: boolean, error?: string }
 */
function resolveSource(root, checksDir, source) {
  const s = String(source || "").trim();
  if (!s) return { type: "unknown", resolves: false, error: "source is empty" };

  // (c) check:<name>
  if (s.startsWith("check:")) {
    const checkName = s.slice("check:".length).trim();
    if (!checkName) return { type: "check", resolves: false, error: "check name is empty" };
    const checkFile = path.join(checksDir, `${checkName}.txt`);
    if (!fs.existsSync(checkFile)) {
      return {
        type: "check",
        resolves: false,
        error: `check output not recorded: ${checkName}. Record it first with record-check-output.`,
      };
    }
    return { type: "check", resolves: true };
  }

  // (b) cross-file: source contains comma or " + " separating 2+ paths.
  // We detect by presence of comma or literal " + " as separator.
  const crossFileSep = /,|\s\+\s/;
  if (crossFileSep.test(s)) {
    const rawParts = s.split(/,|\s\+\s/).map((p) => p.trim()).filter(Boolean);
    if (rawParts.length >= 2) {
      const missing = [];
      for (const part of rawParts) {
        // Strip optional :linespec suffix for cross-file form.
        const filePart = part.replace(/:\d[\d-]*$/, "").trim();
        try {
          const abs = safeRepoPath(root, filePart);
          if (!fs.existsSync(abs)) missing.push(filePart);
        } catch {
          missing.push(filePart);
        }
      }
      if (missing.length > 0) {
        return {
          type: "cross-file",
          resolves: false,
          error: `cross-file source references files that do not exist: ${missing.join(", ")}`,
        };
      }
      return { type: "cross-file", resolves: true };
    }
  }

  // (a) file:line — "path/to/file.md:42" or "path:10-20"
  // Split on the LAST colon that is followed by a digit.
  const fileLineMatch = /^(.+):(\d+)(?:-(\d+))?$/.exec(s);
  if (fileLineMatch) {
    const filePart = fileLineMatch[1].trim();
    const lineStart = parseInt(fileLineMatch[2], 10);
    // lineEnd defaults to lineStart if not given.
    const lineEnd = fileLineMatch[3] !== undefined ? parseInt(fileLineMatch[3], 10) : lineStart;
    if (lineEnd < lineStart) {
      return { type: "file-line", resolves: false, error: `line range end (${lineEnd}) < start (${lineStart})` };
    }
    let abs;
    try {
      abs = safeRepoPath(root, filePart);
    } catch (err) {
      return { type: "file-line", resolves: false, error: err.message };
    }
    if (!fs.existsSync(abs)) {
      return { type: "file-line", resolves: false, error: `file does not exist: ${filePart}` };
    }
    const content = fs.readFileSync(abs, "utf8");
    const lineCount = content.split(/\r?\n/).length;
    if (lineEnd > lineCount) {
      return {
        type: "file-line",
        resolves: false,
        error: `line ${lineEnd} beyond EOF (file has ${lineCount} lines): ${filePart}`,
      };
    }
    return { type: "file-line", resolves: true };
  }

  // Could be a bare file path (no line number). Treat as file:line with type "unknown"
  // for now — it won't satisfy the strong-source requirement.
  // Try to resolve it as a file to give a useful error.
  try {
    const abs = safeRepoPath(root, s);
    if (fs.existsSync(abs)) {
      return {
        type: "unknown",
        resolves: false,
        error: `source "${s}" is a bare file path without a line reference. Use path:line format (e.g. ${s}:1).`,
      };
    }
  } catch {
    // Not a file path — fall through.
  }

  return {
    type: "unknown",
    resolves: false,
    error: `source "${s}" does not match any recognized format (path:line, path:lineStart-lineEnd, "path + path", or check:<name>)`,
  };
}

/**
 * Validate a finding's source against the evidence gate rules.
 *
 * Rules:
 * 1. Every finding must have a resolving source of any type.
 * 2. Critical/High severity OR Resolved status requires type "file-line" or "check"
 *    (cross-file alone is too weak for high-impact assertions).
 */
function validateFindingSource(root, checksDir, finding) {
  const source = finding.source;
  const severity = finding.severity;
  const status = finding.status;

  const parsed = resolveSource(root, checksDir, source);

  if (!parsed.resolves) {
    const repair = "Cite a real file:line under the repo (e.g. path/to/file.md:42), " +
      "a cross-file reference whose files exist (e.g. path/a.md + path/b.md), " +
      "or a check recorded via record-check-output (check:<name>). " +
      "Findings cannot be asserted without resolving evidence.";
    throw new Error(
      `finding source does not resolve: ${source}. ${parsed.error ? parsed.error + ". " : ""}${repair}`,
    );
  }

  // Rule 2: Critical/High or Resolved requires a strong source.
  const needsStrong =
    STRONG_SOURCE_REQUIRED_SEVERITIES.has(severity) || status === "Resolved";
  if (needsStrong && parsed.type !== "file-line" && parsed.type !== "check") {
    throw new Error(
      `finding ${finding.findingId} has severity ${severity} or status Resolved and requires a file:line or recorded-check source (cross-file reference alone is too weak for a high-severity assertion). ` +
      "Record a check with record-check-output and cite it as check:<name>, or add a specific file:line citation.",
    );
  }
}

// ── register.md rendering (derived from findings.jsonl) ──────────────────────

function renderRegister(findings) {
  const lines = [];
  lines.push("# Audit Register");
  lines.push("");
  lines.push(REGISTER_TABLE_HEADER);
  lines.push("|---|---|---|---|---|---|---|");
  for (const f of findings) {
    const cells = [
      f.findingId,
      f.description,
      f.source,
      f.severity,
      f.status,
      f.remediation || "",
      f.notes || "",
    ].map((v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim());
    lines.push(`| ${cells.join(" | ")} |`);
  }
  lines.push("");
  return lines.join("\n");
}

// ── CLI usage ─────────────────────────────────────────────────────────────────

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/auditor-artifacts.mjs open-audit --root <repo> --audit-slug <slug> --scope-json <file> [--force]
  node scripts/auditor-artifacts.mjs record-finding --root <repo> --audit-slug <slug> --finding-json <file>
  node scripts/auditor-artifacts.mjs record-check-output --root <repo> --audit-slug <slug> --check-name <name> --output-file <path> [--exit-code <n>]
  node scripts/auditor-artifacts.mjs render-audit-report --root <repo> --audit-slug <slug>
  node scripts/auditor-artifacts.mjs audit-status --root <repo> --audit-slug <slug>
  node scripts/auditor-artifacts.mjs capabilities

Creates and manages _data/audits/<slug>/ : audit-intake.md, audit-intake.json,
register.md (derived), findings.jsonl (append-only).
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const command = argv[2];
  if (!command || command === "--help" || command === "-h") usage(0);

  const args = { command, force: false };

  for (let i = 3; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--root") {
      args.root = value;
      i += 1;
    } else if (key === "--audit-slug") {
      args.auditSlug = value;
      i += 1;
    } else if (key === "--scope-json") {
      args.scopeJson = value;
      i += 1;
    } else if (key === "--finding-json") {
      args.findingJson = value;
      i += 1;
    } else if (key === "--check-name") {
      args.checkName = value;
      i += 1;
    } else if (key === "--output-file") {
      args.outputFile = value;
      i += 1;
    } else if (key === "--exit-code") {
      args.exitCode = parseInt(value, 10);
      i += 1;
    } else if (key === "--force") {
      args.force = true;
    } else {
      throw new Error(`Unknown argument: ${key}`);
    }
  }

  return args;
}

// ── open-audit ────────────────────────────────────────────────────────────────

/**
 * Open a new audit.
 *
 * scope JSON shape: { workingDir?, scope: {paths?:[], topic?}, description, checksRun:[] }
 * Required: at least one path in scope.paths OR scope.topic, and description.
 *
 * Writes:
 *   audit-intake.md   (Status:/Blocking Issues: grep-able markers)
 *   audit-intake.json
 *   register.md       (canonical table header stub)
 * Uses atomic write + readback like investigator's open-case.
 */
export function openAudit(args) {
  const root = resolveRepoRoot(args.root);
  assertSafeSlug(args.auditSlug);

  // Load and validate scope JSON.
  if (!args.scopeJson) throw new Error("--scope-json is required");
  const scopeJsonPath = path.isAbsolute(args.scopeJson)
    ? args.scopeJson
    : safeRepoPath(root, args.scopeJson);
  let scope;
  try {
    scope = JSON.parse(fs.readFileSync(scopeJsonPath, "utf8"));
  } catch (err) {
    throw new Error(`failed to read scope JSON: ${err.message}`);
  }
  if (!scope || typeof scope !== "object" || Array.isArray(scope)) {
    throw new Error("scope JSON must be an object");
  }

  const description = String(scope.description || "").trim();
  if (!description) {
    throw new Error("scope JSON must include a non-empty description");
  }

  const scopeObj = scope.scope || {};
  const scopePaths = Array.isArray(scopeObj.paths) ? scopeObj.paths.filter(Boolean) : [];
  const scopeTopic = String(scopeObj.topic || "").trim();

  if (scopePaths.length === 0 && !scopeTopic) {
    throw new Error(
      "scope JSON must include scope.paths (at least one path) or scope.topic (a topic string)",
    );
  }

  const checksRun = Array.isArray(scope.checksRun) ? scope.checksRun : [];
  const workingDir = String(scope.workingDir || "").trim();
  const timestamp = new Date().toISOString();

  const paths = auditPaths(root, args.auditSlug);

  // Refuse to overwrite without --force.
  const existingArtifacts = [
    paths.auditIntakePath,
    paths.auditIntakeJsonPath,
    paths.registerPath,
  ].filter((p) => fs.existsSync(p));

  if (existingArtifacts.length > 0 && !args.force) {
    throw new Error(
      `audit artifacts already exist for slug "${args.auditSlug}"; use --force to overwrite (CLI only, requires explicit user approval)`,
    );
  }

  fs.mkdirSync(paths.auditDir, { recursive: true });

  const issues = [];
  // (No blocking issues at open time beyond the above validation — the audit starts open.)
  const statusLine = issues.length === 0 ? "pass" : "blocked";
  const issueLine = issues.length === 0 ? "none" : issues.join("; ");

  const intakeMd = `Status: ${statusLine}
Blocking Issues: ${issueLine}

# Audit Intake

Audit Slug: ${args.auditSlug}
Audit Directory: ${paths.auditDir}
Audit Intake JSON: ${paths.auditIntakeJsonPath}
Register: ${paths.registerPath}
Findings: ${paths.findingsPath}
Working Directory: ${workingDir || "(not set)"}
Created At: ${timestamp}

## Scope

${scopeTopic ? `Topic: ${scopeTopic}\n` : ""}${scopePaths.length > 0 ? `Paths:\n${scopePaths.map((p) => `- ${p}`).join("\n")}\n` : ""}
Description: ${description}

## Checks Run

${checksRun.length === 0 ? "- (none at open time)" : checksRun.map((c) => `- ${c}`).join("\n")}
`;

  const intakeJson = {
    status: statusLine,
    blockingIssues: issues,
    auditSlug: args.auditSlug,
    auditDir: paths.auditDir,
    workingDir,
    scope: scopeObj,
    description,
    checksRun,
    createdAt: timestamp,
  };

  // Atomic write of all three artifacts.
  atomicWriteFile(paths.auditIntakePath, intakeMd);
  atomicWriteJson(paths.auditIntakeJsonPath, intakeJson);
  atomicWriteFile(paths.registerPath, renderRegister([]));

  // Readback verification.
  const readbackMd = fs.readFileSync(paths.auditIntakePath, "utf8");
  if (!readbackMd.includes("Status:")) {
    throw new Error("audit-intake.md readback missing Status: marker; filesystem may be unreliable");
  }
  const readbackJson = JSON.parse(fs.readFileSync(paths.auditIntakeJsonPath, "utf8"));
  if (readbackJson.auditSlug !== args.auditSlug) {
    throw new Error("audit-intake.json readback slug mismatch; filesystem may be unreliable");
  }

  return {
    status: statusLine,
    operation: "open-audit",
    auditSlug: args.auditSlug,
    auditDir: paths.auditDir,
    auditIntakePath: paths.auditIntakePath,
    auditIntakeJsonPath: paths.auditIntakeJsonPath,
    registerPath: paths.registerPath,
    findingsPath: paths.findingsPath,
    blockingIssues: issues,
  };
}

// ── record-finding ────────────────────────────────────────────────────────────

/**
 * Record a validated finding into findings.jsonl and re-derive register.md.
 *
 * Finding JSON shape (per methodology.md declared-records):
 *   { findingId, description, source, severity, status, remediation?, notes? }
 *
 * Evidence gate:
 *   - source must resolve (see resolveSource).
 *   - Critical/High severity or Resolved status → file:line or check source required.
 *   - Duplicate findingId rejected.
 */
export function recordFinding(args) {
  const root = resolveRepoRoot(args.root);
  const paths = auditPaths(root, args.auditSlug);

  // Audit must exist.
  if (!fs.existsSync(paths.auditIntakePath)) {
    throw new Error(
      `audit does not exist: ${args.auditSlug}. Run open-audit first.`,
    );
  }

  // Load finding JSON.
  if (!args.findingJson) throw new Error("--finding-json is required");
  const findingJsonPath = path.isAbsolute(args.findingJson)
    ? args.findingJson
    : safeRepoPath(root, args.findingJson);
  let finding;
  try {
    finding = JSON.parse(fs.readFileSync(findingJsonPath, "utf8"));
  } catch (err) {
    throw new Error(`failed to read finding JSON: ${err.message}`);
  }
  if (!finding || typeof finding !== "object" || Array.isArray(finding)) {
    throw new Error("finding JSON must be an object");
  }

  // Validate required fields.
  const findingId = String(finding.findingId || "").trim();
  if (!findingId) throw new Error("finding.findingId is required");

  const description = String(finding.description || "").trim();
  if (!description) throw new Error("finding.description is required");

  const source = String(finding.source || "").trim();
  if (!source) throw new Error("finding.source is required");

  const severity = String(finding.severity || "").trim();
  if (!VALID_SEVERITIES.has(severity)) {
    throw new Error(
      `finding.severity must be one of: ${[...VALID_SEVERITIES].join(", ")}. Got: ${severity}`,
    );
  }

  const status = String(finding.status || "").trim();
  if (!VALID_STATUSES.has(status)) {
    throw new Error(
      `finding.status must be one of: ${[...VALID_STATUSES].join(", ")}. Got: ${status}`,
    );
  }

  const remediation = String(finding.remediation || "").trim();
  const notes = String(finding.notes || "").trim();

  // Check for duplicate findingId.
  if (fs.existsSync(paths.findingsPath)) {
    const existing = readJsonl(paths.findingsPath);
    const dup = existing.find((f) => f.findingId === findingId);
    if (dup) {
      throw new Error(
        `duplicate findingId: ${findingId}. Each finding must have a unique ID. Update the existing finding or choose a new ID.`,
      );
    }
  }

  // Evidence gate: validate the source.
  fs.mkdirSync(paths.checksDir, { recursive: true });
  validateFindingSource(root, paths.checksDir, { findingId, source, severity, status });

  const normalizedFinding = {
    findingId,
    description,
    source,
    severity,
    status,
    remediation,
    notes,
    recordedAt: new Date().toISOString(),
  };

  // Append to findings.jsonl.
  appendJsonl(paths.findingsPath, normalizedFinding);

  // Re-derive register.md from findings.jsonl (never hand-appended).
  const allFindings = readJsonl(paths.findingsPath);
  atomicWriteFile(paths.registerPath, renderRegister(allFindings));

  return {
    status: "ok",
    operation: "record-finding",
    auditSlug: args.auditSlug,
    findingId,
    findingsPath: paths.findingsPath,
    registerPath: paths.registerPath,
    findingCount: allFindings.length,
  };
}

// ── record-check-output ───────────────────────────────────────────────────────

/**
 * Store a CI/check script's captured output under _data/audits/<slug>/checks/<name>.txt.
 * Registers the check in audit-intake.json.checksRun.
 *
 * This is the evidence-recording step that allows a finding to cite "check:<name>"
 * as its resolving source.
 */
export function recordCheckOutput(args) {
  const root = resolveRepoRoot(args.root);
  const paths = auditPaths(root, args.auditSlug);

  if (!fs.existsSync(paths.auditIntakePath)) {
    throw new Error(
      `audit does not exist: ${args.auditSlug}. Run open-audit first.`,
    );
  }

  // Validate check name is filesystem-safe.
  const checkName = String(args.checkName || "").trim();
  if (!checkName || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(checkName)) {
    throw new Error(
      "check name must use only letters, numbers, dot, underscore, or hyphen and must not be empty",
    );
  }

  // Resolve output file.
  if (!args.outputFile) throw new Error("--output-file is required");
  const outputFilePath = path.isAbsolute(args.outputFile)
    ? path.resolve(args.outputFile)
    : safeRepoPath(root, args.outputFile);
  const stat = fs.statSync(outputFilePath, { throwIfNoEntry: false });
  if (!stat || !stat.isFile()) {
    throw new Error(`--output-file does not exist or is not a file: ${outputFilePath}`);
  }

  fs.mkdirSync(paths.checksDir, { recursive: true });

  const destPath = path.join(paths.checksDir, `${checkName}.txt`);
  fs.copyFileSync(outputFilePath, destPath);

  // Update checksRun in audit-intake.json.
  const intakeJson = JSON.parse(fs.readFileSync(paths.auditIntakeJsonPath, "utf8"));
  const checksRun = Array.isArray(intakeJson.checksRun) ? intakeJson.checksRun : [];
  if (!checksRun.includes(checkName)) {
    checksRun.push(checkName);
  }
  intakeJson.checksRun = checksRun;
  atomicWriteJson(paths.auditIntakeJsonPath, intakeJson);

  const exitCode = typeof args.exitCode === "number" ? args.exitCode : null;

  return {
    status: "ok",
    operation: "record-check-output",
    auditSlug: args.auditSlug,
    checkName,
    destPath,
    exitCode,
    checksRun,
  };
}

// ── render-audit-report ───────────────────────────────────────────────────────

/**
 * Render a human-readable audit report from on-disk artifacts only.
 *
 * Content: scope, findings grouped by severity (each with id, description, source,
 * status, remediation), severity tally, and checks recorded list.
 * NO free narrative, NO field absent from the artifacts.
 *
 * Throws an actionable error if the audit does not exist.
 */
export function renderAuditReport({ root, auditSlug }) {
  const resolvedRoot = resolveRepoRoot(root);
  assertSafeSlug(auditSlug);
  const paths = auditPaths(resolvedRoot, auditSlug);

  if (!fs.existsSync(paths.auditIntakePath)) {
    throw new Error(
      `Audit not found: ${auditSlug}. Run open_audit to create it, or check the audit slug spelling.`,
    );
  }

  let intakeJson = null;
  try {
    intakeJson = JSON.parse(fs.readFileSync(paths.auditIntakeJsonPath, "utf8"));
  } catch (err) {
    throw new Error(`Failed to read audit-intake.json for ${auditSlug}: ${err.message}`);
  }

  // Load findings from findings.jsonl (the single source of truth).
  let findings = [];
  if (fs.existsSync(paths.findingsPath)) {
    try {
      findings = readJsonl(paths.findingsPath);
    } catch (err) {
      throw new Error(`Failed to read findings.jsonl for ${auditSlug}: ${err.message}`);
    }
  }

  const lines = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push(`# Audit Report: ${auditSlug}`);
  lines.push("");

  // ── Scope (from audit-intake.json) ───────────────────────────────────────
  lines.push("## Scope");
  lines.push("");
  if (intakeJson.description) lines.push(`**Description:** ${intakeJson.description}`);
  const scopeObj = intakeJson.scope || {};
  if (scopeObj.topic) lines.push(`**Topic:** ${scopeObj.topic}`);
  if (Array.isArray(scopeObj.paths) && scopeObj.paths.length > 0) {
    lines.push(`**Paths:** ${scopeObj.paths.join(", ")}`);
  }
  lines.push(`**Created At:** ${intakeJson.createdAt || "(unknown)"}`);
  lines.push("");

  // ── Severity tally ────────────────────────────────────────────────────────
  const tallies = { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 };
  for (const f of findings) {
    if (Object.prototype.hasOwnProperty.call(tallies, f.severity)) {
      tallies[f.severity] += 1;
    }
  }
  lines.push("## Summary");
  lines.push("");
  lines.push(
    `**Findings by severity:** Critical: ${tallies.Critical} | High: ${tallies.High} | Medium: ${tallies.Medium} | Low: ${tallies.Low} | Info: ${tallies.Info}`,
  );
  lines.push(`**Total findings:** ${findings.length}`);
  lines.push("");

  // ── Findings grouped by severity ─────────────────────────────────────────
  lines.push("## Findings");
  lines.push("");

  const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low", "Info"];
  for (const severity of SEVERITY_ORDER) {
    const group = findings.filter((f) => f.severity === severity);
    if (group.length === 0) continue;
    lines.push(`### ${severity}`);
    lines.push("");
    for (const f of group) {
      lines.push(`**${f.findingId}** — ${f.description}`);
      lines.push(`- **Source:** ${f.source}`);
      lines.push(`- **Status:** ${f.status}`);
      if (f.remediation) lines.push(`- **Remediation:** ${f.remediation}`);
      if (f.notes) lines.push(`- **Notes:** ${f.notes}`);
      lines.push("");
    }
  }

  if (findings.length === 0) {
    lines.push("No findings recorded.");
    lines.push("");
  }

  // ── Checks recorded (from audit-intake.json.checksRun) ──────────────────
  lines.push("## Checks Recorded");
  lines.push("");
  const checksRun = Array.isArray(intakeJson.checksRun) ? intakeJson.checksRun : [];
  if (checksRun.length === 0) {
    lines.push("None.");
  } else {
    for (const c of checksRun) {
      lines.push(`- ${c}`);
    }
  }
  lines.push("");

  return lines.join("\n");
}

// ── audit-status ──────────────────────────────────────────────────────────────

/**
 * Read-only doctor: returns a status summary for the audit.
 *
 * Returns:
 *   { operation, auditSlug, phase, intake, findingCounts, checksRecorded, blockingIssues, nextActions }
 *
 * phase values:
 *   "no-audit"    — audit does not exist
 *   "open"        — audit exists, no findings yet
 *   "has-findings" — audit exists with at least one finding
 */
export function auditStatus({ root, auditSlug }) {
  const resolvedRoot = resolveRepoRoot(root);
  assertSafeSlug(auditSlug);
  const paths = auditPaths(resolvedRoot, auditSlug);

  if (!fs.existsSync(paths.auditIntakePath)) {
    return {
      operation: "audit-status",
      auditSlug,
      phase: "no-audit",
      intake: { present: false, pass: false },
      findingCounts: { bySeverity: {}, byStatus: {}, total: 0 },
      checksRecorded: [],
      blockingIssues: [],
      nextActions: [
        `Run: node scripts/auditor-artifacts.mjs open-audit --root ${resolvedRoot} --audit-slug ${auditSlug} --scope-json <path-to-scope-json>`,
      ],
    };
  }

  // Read intake.
  const intakeResult = { present: true, pass: false };
  let intakeJson = null;
  const blockingIssues = [];

  try {
    const intakeMd = fs.readFileSync(paths.auditIntakePath, "utf8");
    for (const marker of REQUIRED_INTAKE_MARKERS) {
      if (!intakeMd.includes(marker)) {
        blockingIssues.push(`audit-intake.md missing marker: ${marker}`);
      }
    }
    if (!/^Status: pass$/m.test(intakeMd)) {
      blockingIssues.push("audit-intake.md status is not pass");
    }
    intakeJson = JSON.parse(fs.readFileSync(paths.auditIntakeJsonPath, "utf8"));
    intakeResult.pass = blockingIssues.length === 0;
  } catch (err) {
    blockingIssues.push(`intake read error: ${err.message}`);
  }

  // Count findings.
  const bySeverity = {};
  const byStatus = {};
  let total = 0;

  if (fs.existsSync(paths.findingsPath)) {
    try {
      const findings = readJsonl(paths.findingsPath);
      total = findings.length;
      for (const f of findings) {
        bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
        byStatus[f.status] = (byStatus[f.status] || 0) + 1;
      }
    } catch (_) {
      // Non-fatal for status.
    }
  }

  const checksRecorded = Array.isArray(intakeJson && intakeJson.checksRun) ? intakeJson.checksRun : [];

  const phase = total > 0 ? "has-findings" : "open";

  const nextActions = [];
  const baseCmd = "node scripts/auditor-artifacts.mjs";
  const rootFlag = `--root ${resolvedRoot}`;
  const slugFlag = `--audit-slug ${auditSlug}`;

  if (phase === "open") {
    nextActions.push(
      `${baseCmd} record-finding ${rootFlag} ${slugFlag} --finding-json <path-to-finding-json>`,
    );
  } else {
    nextActions.push(
      `${baseCmd} render-audit-report ${rootFlag} ${slugFlag}`,
    );
    nextActions.push(
      `${baseCmd} record-finding ${rootFlag} ${slugFlag} --finding-json <path-to-finding-json>`,
    );
  }

  return {
    operation: "audit-status",
    auditSlug,
    phase,
    intake: intakeResult,
    findingCounts: { bySeverity, byStatus, total },
    checksRecorded,
    blockingIssues,
    nextActions,
  };
}

// ── capabilities ──────────────────────────────────────────────────────────────

export function capabilities() {
  return {
    status: "ok",
    operation: "capabilities",
    version: HELPER_VERSION,
    supported: SUPPORTED_OPERATIONS,
    supportedOptions: SUPPORTED_OPTIONS,
  };
}

// ── CLI main ──────────────────────────────────────────────────────────────────

function main() {
  try {
    const args = parseArgs(process.argv);
    if (args.command === "capabilities") {
      process.stdout.write(`${JSON.stringify(capabilities(), null, 2)}\n`);
      return;
    }
    if (args.command === "open-audit") {
      const result = openAudit(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      process.exit(result.status === "pass" ? 0 : 2);
    }
    if (args.command === "record-finding") {
      const result = recordFinding(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "record-check-output") {
      const result = recordCheckOutput(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "render-audit-report") {
      const report = renderAuditReport({ root: args.root, auditSlug: args.auditSlug });
      process.stdout.write(`${JSON.stringify({ status: "ok", operation: "render-audit-report", report }, null, 2)}\n`);
      return;
    }
    if (args.command === "audit-status") {
      const result = auditStatus({ root: args.root, auditSlug: args.auditSlug });
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    process.stderr.write(`Unknown command: ${args.command}\n`);
    usage(1);
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
