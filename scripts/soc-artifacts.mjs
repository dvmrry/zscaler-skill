#!/usr/bin/env node
/**
 * soc-artifacts.mjs
 *
 * Deterministic helper for SOC posture-review artifacts.
 * Pure Node stdlib — zero external dependencies, no imports from
 * auditor-artifacts.mjs or investigator-artifacts.mjs (all three are
 * standalone single files per repo ethos).
 *
 * Primitives adapted from auditor-artifacts.mjs (assertSafeSlug,
 * resolveRepoRoot, safeRepoPath, sha256Text, sha256File, atomicWriteFile,
 * atomicWriteJson, readJsonl, appendJsonl). Marked with
 * "ADAPTED FROM auditor-artifacts.mjs" comments so a future
 * shared-utility extraction is discoverable.
 *
 * The markdown-cell escaping primitive is ADAPTED FROM auditor-artifacts.mjs
 * (which fixed a CodeQL js/incomplete-sanitization; backslash is escaped
 * before pipe: .replace(/\\/g,"\\\\").replace(/\|/g,"\\|")).
 *
 * SOC posture-review lifecycle:
 *   open-review -> record-evidence (optional) -> record-finding -> render-soc-report
 * The SOC role asks "is this DEFENSIBLE?" (posture); the auditor asks
 * "is this well-formed?" (hygiene).
 */
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";
import {
  safeRepoPath,
  resolveCrossFileSource,
  resolveFileLineSource,
  resolveBareFilePath,
} from "./artifacts-source-lib.mjs";

// ── Version ───────────────────────────────────────────────────────────────────
let HELPER_VERSION = "unknown";
try {
  const versionFile = new URL("../VERSION", import.meta.url);
  HELPER_VERSION = fs.readFileSync(versionFile, "utf8").trim();
} catch {
  // Fall back to "unknown" — capabilities() must keep working in odd deployments.
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SOC_DATA_DIR = "_data/soc-reviews";
const REVIEW_INTAKE_BASENAME = "review-intake";
const REGISTER_BASENAME = "register";
const FINDINGS_BASENAME = "findings.jsonl";
const EVIDENCE_DIR_BASENAME = "evidence";

// Grep-able markers required in review-intake.md.
export const REQUIRED_INTAKE_MARKERS = ["Status:", "Blocking Issues:"];

// Canonical findings table header (register.md is derived from findings.jsonl).
export const REGISTER_TABLE_HEADER =
  "| ID | Title | Category | Taxonomy | Source | Severity | Confidence | Status | Remediation | Notes |";

// Valid severity values.
const VALID_SEVERITIES = new Set(["Critical", "High", "Medium", "Low", "Info"]);

// Valid status values.
const VALID_STATUSES = new Set(["Open", "Acknowledged", "Resolved", "Acceptable", "Wontfix"]);

// Valid confidence values.
const VALID_CONFIDENCES = new Set(["high", "medium", "low", "open"]);

// Valid subtype values (optional on scope).
const VALID_SUBTYPES = new Set(["policy", "access", "coverage", "config", "activity"]);

// Severities that require a strong source (file:line or evidence:<name>).
const STRONG_SOURCE_REQUIRED_SEVERITIES = new Set(["Critical", "High"]);

// Framework-tag patterns: a source that ONLY matches these is not evidence.
// ADAPTED FROM auditor-artifacts.mjs (SOC-specific extension: adds the framework guard).
const FRAMEWORK_ONLY_RE = /^(CWE-\d+|OWASP[:\-][^\s]+|NIST[\s:][^\s]+|MITRE[:\s][^\s]+|ATT&CK[:\s][^\s]+|T\d{4}|CISA[:\s]?[^\s]*)$/i;
// Multi-word framework references ("MITRE ATT&CK T1078", "NIST SP 800-53",
// "OWASP A01:2021") start with a framework keyword but have no file shape
// (no "/" and no ".ext"[:line] suffix). hasFileShape distinguishes them from a
// real path that happens to start with a framework word ("nist-controls.md:10").
const FRAMEWORK_PREFIX_RE = /^(CWE|OWASP|NIST|MITRE|ATT&CK|CISA)\b/i;
function hasFileShape(s) {
  return s.includes("/") || /\.[a-z0-9]+(:\d+(-\d+)?)?$/i.test(s);
}

const SUPPORTED_OPERATIONS = [
  "open-review",
  "record-evidence",
  "record-finding",
  "render-soc-report",
  "soc-status",
  "capabilities",
];

const SUPPORTED_OPTIONS = {
  "open-review": ["--root", "--review-slug", "--scope-json", "--force"],
  "record-evidence": ["--root", "--review-slug", "--name", "--source-file", "--evidence-type"],
  "record-finding": ["--root", "--review-slug", "--finding-json"],
  "render-soc-report": ["--root", "--review-slug"],
  "soc-status": ["--root", "--review-slug"],
};

// ── ADAPTED FROM auditor-artifacts.mjs: primitive utilities ──────────────────

/** Validate a slug is filesystem-safe (letters, numbers, dot, underscore, hyphen). */
function assertSafeSlug(slug) {
  if (!slug || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) {
    throw new Error("review slug must use only letters, numbers, dot, underscore, or hyphen");
  }
  if (slug.includes("..")) {
    throw new Error("review slug cannot contain '..'");
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

/** SHA-256 of a text string, prefixed with "sha256:". */
// ADAPTED FROM auditor-artifacts.mjs
function sha256Text(text) {
  return `sha256:${crypto.createHash("sha256").update(text).digest("hex")}`;
}

/** SHA-256 of a file's contents, prefixed with "sha256:". */
// ADAPTED FROM auditor-artifacts.mjs
function sha256File(filePath) {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
}

/** Atomic write: write to a .tmp file, then rename. */
// ADAPTED FROM auditor-artifacts.mjs
function atomicWriteFile(filePath, content) {
  const tempPath = `${filePath}.tmp-${process.pid}-${crypto.randomUUID()}`;
  fs.writeFileSync(tempPath, content, "utf8");
  fs.renameSync(tempPath, filePath);
}

/** Atomic write of a JSON value (pretty-printed, newline-terminated). */
// ADAPTED FROM auditor-artifacts.mjs
function atomicWriteJson(filePath, value) {
  atomicWriteFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

/** Read a JSONL file, returning an array of parsed objects. */
// ADAPTED FROM auditor-artifacts.mjs
function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return [];
  return raw.split("\n").map((line) => JSON.parse(line));
}

/** Append one JSON value (as a JSONL line) to a file. */
// ADAPTED FROM auditor-artifacts.mjs
function appendJsonl(filePath, value) {
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

// ── SOC review path helpers ───────────────────────────────────────────────────

function reviewPaths(root, reviewSlug) {
  assertSafeSlug(reviewSlug);
  const reviewDir = path.join(root, SOC_DATA_DIR, reviewSlug);
  return {
    reviewDir,
    reviewIntakePath: path.join(reviewDir, `${REVIEW_INTAKE_BASENAME}.md`),
    reviewIntakeJsonPath: path.join(reviewDir, `${REVIEW_INTAKE_BASENAME}.json`),
    registerPath: path.join(reviewDir, `${REGISTER_BASENAME}.md`),
    findingsPath: path.join(reviewDir, FINDINGS_BASENAME),
    evidenceDir: path.join(reviewDir, EVIDENCE_DIR_BASENAME),
  };
}

// ── Source resolution (evidence gate) ────────────────────────────────────────

/**
 * Parse and classify a SOC finding source.
 *
 * Source forms:
 *   (a) file:line reference      "path/to/file.md:42" or "path:10-20"
 *       Resolves if: file exists under root AND has >= line lines.
 *   (b) cross-file reference     "path/a.md + path/b.md" (2+ comma/plus-delimited paths)
 *       Resolves if: all listed files exist under root.
 *   (c) evidence:<name>          "evidence:<name>"
 *       Resolves if: the named evidence file exists under evidenceDir.
 *
 * Returns { type: "file-line"|"cross-file"|"evidence"|"framework-only"|"unknown",
 *           resolves: boolean, error?: string }
 *
 * FRAMEWORK-NOT-EVIDENCE guard (SOC-specific): a source that is ONLY a framework
 * tag (CWE-N, OWASP:, NIST:, MITRE:, ATT&CK:, T\d{4}, CISA) is classified as
 * type "framework-only" with resolves:false and an actionable error.
 */
export function resolveSource(root, evidenceDir, source) {
  const s = String(source || "").trim();
  if (!s) return { type: "unknown", resolves: false, error: "source is empty" };

  // FRAMEWORK-NOT-EVIDENCE guard: framework references (single-token or
  // multi-word) are not evidence. Skip path/evidence-shaped sources so a real
  // file that starts with a framework word still resolves normally.
  if (
    !hasFileShape(s) &&
    !/^evidence:/i.test(s) &&
    (FRAMEWORK_ONLY_RE.test(s) || FRAMEWORK_PREFIX_RE.test(s))
  ) {
    return {
      type: "framework-only",
      resolves: false,
      error:
        `a framework tag classifies a finding; it does not prove it. ` +
        `Cite tenant evidence — a snapshot path, recorded SIEM/API/log evidence ` +
        `(evidence:<name> via record-evidence), or a file:line. ` +
        `Frameworks go in the taxonomy field, not the source.`,
    };
  }

  // (c) evidence:<name>
  if (s.startsWith("evidence:")) {
    const evidenceName = s.slice("evidence:".length).trim();
    if (!evidenceName) return { type: "evidence", resolves: false, error: "evidence name is empty" };
    // Evidence files may be stored with any extension; check for <name>.* in evidenceDir.
    // We look for exact basename match (any extension) under evidenceDir.
    let found = false;
    try {
      if (fs.existsSync(evidenceDir)) {
        const entries = fs.readdirSync(evidenceDir);
        for (const entry of entries) {
          const base = path.basename(entry, path.extname(entry));
          if (base === evidenceName) {
            found = true;
            break;
          }
        }
      }
    } catch {
      // Fall through to not-found.
    }
    if (!found) {
      return {
        type: "evidence",
        resolves: false,
        error: `evidence not recorded: ${evidenceName}. Record it first with record-evidence --name ${evidenceName}.`,
      };
    }
    return { type: "evidence", resolves: true };
  }

  // (b) cross-file, (a) file:line, and bare-file-path are role-agnostic —
  // resolved by the shared primitives in scripts/artifacts-source-lib.mjs.
  const cross = resolveCrossFileSource(root, s);
  if (cross) return cross;

  const fileLine = resolveFileLineSource(root, s);
  if (fileLine) return fileLine;

  const bare = resolveBareFilePath(root, s);
  if (bare) return bare;

  return {
    type: "unknown",
    resolves: false,
    error: `source "${s}" does not match any recognized format (path:line, path:lineStart-lineEnd, "path + path", evidence:<name>)`,
  };
}

/**
 * Validate a SOC finding's source against the evidence gate rules.
 *
 * Rules:
 * 1. Every finding must have a resolving source of any type.
 * 2. Framework-only source is always rejected (SOC-specific guard).
 * 3. Critical/High severity OR Resolved status requires type "file-line" or "evidence"
 *    (cross-file alone is too weak for high-impact assertions, mirroring the auditor).
 */
function validateFindingSource(root, evidenceDir, finding) {
  const source = finding.source;
  const severity = finding.severity;
  const status = finding.status;

  const parsed = resolveSource(root, evidenceDir, source);

  // Framework-only is a distinct SOC guard — provide the specific message.
  if (parsed.type === "framework-only") {
    throw new Error(
      `finding source rejected: ${source}. ${parsed.error}`,
    );
  }

  if (!parsed.resolves) {
    const repair =
      "Cite a real file:line under the repo (e.g. path/to/file.md:42), " +
      "a cross-file reference whose files exist (e.g. path/a.md + path/b.md), " +
      "or evidence recorded via record-evidence (evidence:<name>). " +
      "Findings cannot be asserted without resolving evidence.";
    throw new Error(
      `finding source does not resolve: ${source}. ${parsed.error ? parsed.error + ". " : ""}${repair}`,
    );
  }

  // Rule 3: Critical/High or Resolved requires a strong source.
  const needsStrong =
    STRONG_SOURCE_REQUIRED_SEVERITIES.has(severity) || status === "Resolved";
  if (needsStrong && parsed.type !== "file-line" && parsed.type !== "evidence") {
    throw new Error(
      `finding ${finding.findingId} has severity ${severity} or status Resolved and requires a file:line or recorded-evidence source (cross-file reference alone is too weak for a high-severity assertion). ` +
      "Record evidence with record-evidence and cite it as evidence:<name>, or add a specific file:line citation.",
    );
  }
}

// ── register.md rendering (derived from findings.jsonl) ──────────────────────

function renderRegister(findings) {
  const lines = [];
  lines.push("# SOC Review Register");
  lines.push("");
  lines.push(REGISTER_TABLE_HEADER);
  lines.push("|---|---|---|---|---|---|---|---|---|---|");
  for (const f of findings) {
    const taxonomy = Array.isArray(f.taxonomy) ? f.taxonomy.join(", ") : String(f.taxonomy || "");
    const cells = [
      f.findingId,
      f.title,
      f.category || "",
      taxonomy,
      f.source,
      f.severity,
      f.confidence || "",
      f.status,
      f.remediation || "",
      f.notes || "",
      // ADAPTED FROM auditor-artifacts.mjs — backslash escaped before pipe (CodeQL fix).
    ].map((v) => String(v ?? "").replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim());
    lines.push(`| ${cells.join(" | ")} |`);
  }
  lines.push("");
  return lines.join("\n");
}

// ── CLI usage ─────────────────────────────────────────────────────────────────

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/soc-artifacts.mjs open-review --root <repo> --review-slug <slug> --scope-json <file> [--force]
  node scripts/soc-artifacts.mjs record-evidence --root <repo> --review-slug <slug> --name <name> --source-file <path> [--evidence-type snapshot|siem|api|log]
  node scripts/soc-artifacts.mjs record-finding --root <repo> --review-slug <slug> --finding-json <file>
  node scripts/soc-artifacts.mjs render-soc-report --root <repo> --review-slug <slug>
  node scripts/soc-artifacts.mjs soc-status --root <repo> --review-slug <slug>
  node scripts/soc-artifacts.mjs capabilities

Creates and manages _data/soc-reviews/<slug>/ : review-intake.md, review-intake.json,
register.md (derived), findings.jsonl (append-only), evidence/ (recorded evidence).
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
    } else if (key === "--review-slug") {
      args.reviewSlug = value;
      i += 1;
    } else if (key === "--scope-json") {
      args.scopeJson = value;
      i += 1;
    } else if (key === "--finding-json") {
      args.findingJson = value;
      i += 1;
    } else if (key === "--name") {
      args.name = value;
      i += 1;
    } else if (key === "--source-file") {
      args.sourceFile = value;
      i += 1;
    } else if (key === "--evidence-type") {
      args.evidenceType = value;
      i += 1;
    } else if (key === "--force") {
      args.force = true;
    } else {
      throw new Error(`Unknown argument: ${key}`);
    }
  }

  return args;
}

// ── open-review ───────────────────────────────────────────────────────────────

/**
 * Open a new SOC posture review.
 *
 * scope JSON shape:
 *   {
 *     workingDirectory?,
 *     description (required),
 *     scope: { paths?: string[], topic?: string },
 *     threatModel?,    // optional string e.g. "compromised admin account"
 *     subtype?         // optional, one of: policy|access|coverage|config|activity
 *   }
 *
 * Writes:
 *   review-intake.md   (Status:/Blocking Issues: grep-able markers)
 *   review-intake.json
 *   register.md        (canonical table header stub)
 */
export function openReview(args) {
  const root = resolveRepoRoot(args.root);
  assertSafeSlug(args.reviewSlug);

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

  const threatModel = String(scope.threatModel || "").trim();
  const subtype = String(scope.subtype || "").trim();
  if (subtype && !VALID_SUBTYPES.has(subtype)) {
    throw new Error(
      `scope.subtype must be one of: ${[...VALID_SUBTYPES].join(", ")} (or omitted). Got: ${subtype}`,
    );
  }

  const workingDirectory = String(scope.workingDirectory || "").trim();
  const timestamp = new Date().toISOString();

  const paths = reviewPaths(root, args.reviewSlug);

  // Refuse to overwrite without --force.
  const existingArtifacts = [
    paths.reviewIntakePath,
    paths.reviewIntakeJsonPath,
    paths.registerPath,
  ].filter((p) => fs.existsSync(p));

  if (existingArtifacts.length > 0 && !args.force) {
    throw new Error(
      `review artifacts already exist for slug "${args.reviewSlug}"; use --force to overwrite (CLI only, requires explicit user approval)`,
    );
  }

  fs.mkdirSync(paths.reviewDir, { recursive: true });

  const issues = [];
  const statusLine = issues.length === 0 ? "pass" : "blocked";
  const issueLine = issues.length === 0 ? "none" : issues.join("; ");

  const intakeMd = `Status: ${statusLine}
Blocking Issues: ${issueLine}

# SOC Review Intake

Review Slug: ${args.reviewSlug}
Review Directory: ${paths.reviewDir}
Review Intake JSON: ${paths.reviewIntakeJsonPath}
Register: ${paths.registerPath}
Findings: ${paths.findingsPath}
Working Directory: ${workingDirectory || "(not set)"}
Created At: ${timestamp}

## Scope

${scopeTopic ? `Topic: ${scopeTopic}\n` : ""}${scopePaths.length > 0 ? `Paths:\n${scopePaths.map((p) => `- ${p}`).join("\n")}\n` : ""}
Description: ${description}

## Threat Model

${threatModel || "(general posture review)"}

## Subtype

${subtype || "(not specified — infer from scope)"}
`;

  const intakeJson = {
    status: statusLine,
    blockingIssues: issues,
    reviewSlug: args.reviewSlug,
    reviewDir: paths.reviewDir,
    workingDirectory,
    scope: scopeObj,
    description,
    threatModel,
    subtype,
    evidenceRecorded: [],
    createdAt: timestamp,
  };

  // Atomic write of all three artifacts.
  atomicWriteFile(paths.reviewIntakePath, intakeMd);
  atomicWriteJson(paths.reviewIntakeJsonPath, intakeJson);
  atomicWriteFile(paths.registerPath, renderRegister([]));

  // Readback verification.
  const readbackMd = fs.readFileSync(paths.reviewIntakePath, "utf8");
  if (!readbackMd.includes("Status:")) {
    throw new Error("review-intake.md readback missing Status: marker; filesystem may be unreliable");
  }
  const readbackJson = JSON.parse(fs.readFileSync(paths.reviewIntakeJsonPath, "utf8"));
  if (readbackJson.reviewSlug !== args.reviewSlug) {
    throw new Error("review-intake.json readback slug mismatch; filesystem may be unreliable");
  }

  return {
    status: statusLine,
    operation: "open-review",
    reviewSlug: args.reviewSlug,
    reviewDir: paths.reviewDir,
    reviewIntakePath: paths.reviewIntakePath,
    reviewIntakeJsonPath: paths.reviewIntakeJsonPath,
    registerPath: paths.registerPath,
    findingsPath: paths.findingsPath,
    blockingIssues: issues,
  };
}

// ── record-evidence ───────────────────────────────────────────────────────────

/**
 * Store tenant evidence under _data/soc-reviews/<slug>/evidence/<name>.*
 * and register it in review-intake.json.evidenceRecorded.
 *
 * This is the SOC analog of the auditor's record-check-output.
 * A finding can then cite "evidence:<name>" as its resolving source.
 *
 * evidenceType: snapshot | siem | api | log (optional, defaults to "snapshot")
 */
export function recordEvidence(args) {
  const root = resolveRepoRoot(args.root);
  const paths = reviewPaths(root, args.reviewSlug);

  if (!fs.existsSync(paths.reviewIntakePath)) {
    throw new Error(
      `review does not exist: ${args.reviewSlug}. Run open-review first.`,
    );
  }

  const evidenceName = String(args.name || "").trim();
  if (!evidenceName || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(evidenceName)) {
    throw new Error(
      "evidence name must use only letters, numbers, dot, underscore, or hyphen and must not be empty",
    );
  }

  const evidenceType = String(args.evidenceType || "snapshot").trim();
  const validEvidenceTypes = new Set(["snapshot", "siem", "api", "log"]);
  if (!validEvidenceTypes.has(evidenceType)) {
    throw new Error(
      `--evidence-type must be one of: ${[...validEvidenceTypes].join(", ")}. Got: ${evidenceType}`,
    );
  }

  if (!args.sourceFile) throw new Error("--source-file is required");
  const sourceFilePath = path.isAbsolute(args.sourceFile)
    ? path.resolve(args.sourceFile)
    : safeRepoPath(root, args.sourceFile);
  const stat = fs.statSync(sourceFilePath, { throwIfNoEntry: false });
  if (!stat || !stat.isFile()) {
    throw new Error(`--source-file does not exist or is not a file: ${sourceFilePath}`);
  }

  fs.mkdirSync(paths.evidenceDir, { recursive: true });

  // Preserve original extension.
  const originalExt = path.extname(sourceFilePath) || ".txt";
  const destPath = path.join(paths.evidenceDir, `${evidenceName}${originalExt}`);
  fs.copyFileSync(sourceFilePath, destPath);

  // Update evidenceRecorded in review-intake.json.
  const intakeJson = JSON.parse(fs.readFileSync(paths.reviewIntakeJsonPath, "utf8"));
  const evidenceRecorded = Array.isArray(intakeJson.evidenceRecorded) ? intakeJson.evidenceRecorded : [];
  const existing = evidenceRecorded.find((e) => e.name === evidenceName);
  if (!existing) {
    evidenceRecorded.push({ name: evidenceName, type: evidenceType, recordedAt: new Date().toISOString() });
  }
  intakeJson.evidenceRecorded = evidenceRecorded;
  atomicWriteJson(paths.reviewIntakeJsonPath, intakeJson);

  return {
    status: "ok",
    operation: "record-evidence",
    reviewSlug: args.reviewSlug,
    evidenceName,
    evidenceType,
    destPath,
    evidenceRecorded: evidenceRecorded.map((e) => e.name),
  };
}

// ── record-finding ────────────────────────────────────────────────────────────

/**
 * Record a validated SOC posture finding into findings.jsonl and re-derive register.md.
 *
 * Finding JSON shape (declared-records + taxonomy shape from security-taxonomy.md):
 *   {
 *     findingId,
 *     title,
 *     category?,         // subtype/finding-family
 *     taxonomy?,         // OPTIONAL array of framework tags e.g. ["CWE-269","MITRE:T1078","NIST:AC-6"]
 *     source,            // REQUIRED — must resolve via resolveSource()
 *     severity,          // Critical|High|Medium|Low|Info
 *     confidence,        // high|medium|low|open
 *     status,            // Open|Acknowledged|Acceptable|Resolved|Wontfix
 *     remediation?,
 *     notes?
 *   }
 *
 * Evidence gate (SOC):
 *   - source must resolve.
 *   - source that is ONLY a framework tag is REJECTED (framework-not-evidence guard).
 *   - Critical/High severity or Resolved status → file:line or evidence:<name> required.
 *   - Duplicate findingId rejected.
 *   - taxonomy field is metadata (framework tags allowed there).
 */
export function recordFinding(args) {
  const root = resolveRepoRoot(args.root);
  const paths = reviewPaths(root, args.reviewSlug);

  if (!fs.existsSync(paths.reviewIntakePath)) {
    throw new Error(
      `review does not exist: ${args.reviewSlug}. Run open-review first.`,
    );
  }

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

  const title = String(finding.title || "").trim();
  if (!title) throw new Error("finding.title is required");

  const source = String(finding.source || "").trim();
  if (!source) throw new Error("finding.source is required");

  const severity = String(finding.severity || "").trim();
  if (!VALID_SEVERITIES.has(severity)) {
    throw new Error(
      `finding.severity must be one of: ${[...VALID_SEVERITIES].join(", ")}. Got: ${severity}`,
    );
  }

  const confidence = String(finding.confidence || "").trim();
  if (!VALID_CONFIDENCES.has(confidence)) {
    throw new Error(
      `finding.confidence must be one of: ${[...VALID_CONFIDENCES].join(", ")}. Got: ${confidence}`,
    );
  }

  const status = String(finding.status || "").trim();
  if (!VALID_STATUSES.has(status)) {
    throw new Error(
      `finding.status must be one of: ${[...VALID_STATUSES].join(", ")}. Got: ${status}`,
    );
  }

  const category = String(finding.category || "").trim();
  const remediation = String(finding.remediation || "").trim();
  const notes = String(finding.notes || "").trim();

  // taxonomy is metadata — array of framework tags is allowed.
  const taxonomy = Array.isArray(finding.taxonomy)
    ? finding.taxonomy.map((t) => String(t)).filter(Boolean)
    : [];

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
  fs.mkdirSync(paths.evidenceDir, { recursive: true });
  validateFindingSource(root, paths.evidenceDir, { findingId, source, severity, status });

  const normalizedFinding = {
    findingId,
    title,
    category,
    taxonomy,
    source,
    severity,
    confidence,
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
    reviewSlug: args.reviewSlug,
    findingId,
    findingsPath: paths.findingsPath,
    registerPath: paths.registerPath,
    findingCount: allFindings.length,
  };
}

// ── render-soc-report ─────────────────────────────────────────────────────────

/**
 * Render a human-readable SOC posture report from on-disk artifacts only.
 *
 * Content: scope + threat model + subtype; findings grouped by severity (each with
 * id, title, category, taxonomy tags, source, confidence, status, remediation);
 * severity tally; evidence recorded list. NO free narrative.
 *
 * Throws an actionable error if the review does not exist.
 */
export function renderSocReport({ root, reviewSlug }) {
  const resolvedRoot = resolveRepoRoot(root);
  assertSafeSlug(reviewSlug);
  const paths = reviewPaths(resolvedRoot, reviewSlug);

  if (!fs.existsSync(paths.reviewIntakePath)) {
    throw new Error(
      `SOC review not found: ${reviewSlug}. Run open_review to create it, or check the review slug spelling.`,
    );
  }

  let intakeJson = null;
  try {
    intakeJson = JSON.parse(fs.readFileSync(paths.reviewIntakeJsonPath, "utf8"));
  } catch (err) {
    throw new Error(`Failed to read review-intake.json for ${reviewSlug}: ${err.message}`);
  }

  // Load findings from findings.jsonl (the single source of truth).
  let findings = [];
  if (fs.existsSync(paths.findingsPath)) {
    try {
      findings = readJsonl(paths.findingsPath);
    } catch (err) {
      throw new Error(`Failed to read findings.jsonl for ${reviewSlug}: ${err.message}`);
    }
  }

  const lines = [];

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push(`# SOC Posture Report: ${reviewSlug}`);
  lines.push("");

  // ── Scope (from review-intake.json) ──────────────────────────────────────────
  lines.push("## Scope");
  lines.push("");
  if (intakeJson.description) lines.push(`**Description:** ${intakeJson.description}`);
  const scopeObj = intakeJson.scope || {};
  if (scopeObj.topic) lines.push(`**Topic:** ${scopeObj.topic}`);
  if (Array.isArray(scopeObj.paths) && scopeObj.paths.length > 0) {
    lines.push(`**Paths:** ${scopeObj.paths.join(", ")}`);
  }
  if (intakeJson.threatModel) lines.push(`**Threat Model:** ${intakeJson.threatModel}`);
  if (intakeJson.subtype) lines.push(`**Subtype:** ${intakeJson.subtype}`);
  lines.push(`**Created At:** ${intakeJson.createdAt || "(unknown)"}`);
  lines.push("");

  // ── Severity tally ────────────────────────────────────────────────────────────
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

  // ── Findings grouped by severity ─────────────────────────────────────────────
  lines.push("## Findings");
  lines.push("");

  const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low", "Info"];
  for (const severity of SEVERITY_ORDER) {
    const group = findings.filter((f) => f.severity === severity);
    if (group.length === 0) continue;
    lines.push(`### ${severity}`);
    lines.push("");
    for (const f of group) {
      lines.push(`**${f.findingId}** — ${f.title}`);
      if (f.category) lines.push(`- **Category:** ${f.category}`);
      const taxonomy = Array.isArray(f.taxonomy) ? f.taxonomy : [];
      if (taxonomy.length > 0) lines.push(`- **Taxonomy:** ${taxonomy.join(", ")}`);
      lines.push(`- **Source:** ${f.source}`);
      lines.push(`- **Confidence:** ${f.confidence}`);
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

  // ── Evidence recorded ─────────────────────────────────────────────────────────
  lines.push("## Evidence Recorded");
  lines.push("");
  const evidenceRecorded = Array.isArray(intakeJson.evidenceRecorded) ? intakeJson.evidenceRecorded : [];
  if (evidenceRecorded.length === 0) {
    lines.push("None.");
  } else {
    for (const e of evidenceRecorded) {
      const name = typeof e === "string" ? e : e.name;
      const type = typeof e === "object" && e.type ? ` (${e.type})` : "";
      lines.push(`- ${name}${type}`);
    }
  }
  lines.push("");

  return lines.join("\n");
}

// ── soc-status ────────────────────────────────────────────────────────────────

/**
 * Read-only doctor: returns a status summary for the SOC review.
 *
 * Returns:
 *   { operation, reviewSlug, phase, intake, findingCounts, evidenceRecorded, blockingIssues, nextCommands, nextActions }
 *
 * phase values:
 *   "no-review"    — review does not exist
 *   "open"         — review exists, no findings yet
 *   "has-findings" — review exists with at least one finding
 */
export function socStatus({ root, reviewSlug }) {
  const resolvedRoot = resolveRepoRoot(root);
  assertSafeSlug(reviewSlug);
  const paths = reviewPaths(resolvedRoot, reviewSlug);

  if (!fs.existsSync(paths.reviewIntakePath)) {
    const baseCmd = "node scripts/soc-artifacts.mjs";
    const rootFlag = `--root ${resolvedRoot}`;
    const slugFlag = `--review-slug ${reviewSlug}`;
    return {
      operation: "soc-status",
      reviewSlug,
      phase: "no-review",
      intake: { present: false, pass: false },
      findingCounts: { bySeverity: {}, byStatus: {}, total: 0 },
      evidenceRecorded: [],
      blockingIssues: [],
      nextCommands: [
        `${baseCmd} open-review ${rootFlag} ${slugFlag} --scope-json <path-to-scope-json>`,
      ],
      nextActions: [
        "Call open_review with a scope object to create the SOC review intake.",
      ],
    };
  }

  // Read intake.
  const intakeResult = { present: true, pass: false };
  let intakeJson = null;
  const blockingIssues = [];

  try {
    const intakeMd = fs.readFileSync(paths.reviewIntakePath, "utf8");
    for (const marker of REQUIRED_INTAKE_MARKERS) {
      if (!intakeMd.includes(marker)) {
        blockingIssues.push(`review-intake.md missing marker: ${marker}`);
      }
    }
    if (!/^Status: pass$/m.test(intakeMd)) {
      blockingIssues.push("review-intake.md status is not pass");
    }
    intakeJson = JSON.parse(fs.readFileSync(paths.reviewIntakeJsonPath, "utf8"));
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

  const evidenceRecorded = (intakeJson && Array.isArray(intakeJson.evidenceRecorded))
    ? intakeJson.evidenceRecorded.map((e) => (typeof e === "string" ? e : e.name))
    : [];

  const phase = total > 0 ? "has-findings" : "open";

  const nextCommands = [];
  const nextActions = [];
  const baseCmd = "node scripts/soc-artifacts.mjs";
  const rootFlag = `--root ${resolvedRoot}`;
  const slugFlag = `--review-slug ${reviewSlug}`;

  if (phase === "open") {
    nextCommands.push(
      `${baseCmd} record-evidence ${rootFlag} ${slugFlag} --name <name> --source-file <path>`,
    );
    nextCommands.push(
      `${baseCmd} record-finding ${rootFlag} ${slugFlag} --finding-json <path-to-finding-json>`,
    );
    nextActions.push(
      "Call record_evidence when a finding will cite tenant-captured evidence.",
    );
    nextActions.push(
      "Call record_finding with an evidence-backed posture finding.",
    );
  } else {
    nextCommands.push(
      `${baseCmd} render-soc-report ${rootFlag} ${slugFlag}`,
    );
    nextCommands.push(
      `${baseCmd} record-finding ${rootFlag} ${slugFlag} --finding-json <path-to-finding-json>`,
    );
    nextActions.push(
      "Call render_soc_report to produce the final artifact-derived answer.",
    );
    nextActions.push(
      "Call record_finding to add another evidence-backed posture finding before rendering.",
    );
  }

  return {
    operation: "soc-status",
    reviewSlug,
    phase,
    intake: intakeResult,
    findingCounts: { bySeverity, byStatus, total },
    evidenceRecorded,
    blockingIssues,
    nextCommands,
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
    if (args.command === "open-review") {
      const result = openReview(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      process.exit(result.status === "pass" ? 0 : 2);
    }
    if (args.command === "record-evidence") {
      const result = recordEvidence(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "record-finding") {
      const result = recordFinding(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "render-soc-report") {
      const report = renderSocReport({ root: args.root, reviewSlug: args.reviewSlug });
      process.stdout.write(`${JSON.stringify({ status: "ok", operation: "render-soc-report", report }, null, 2)}\n`);
      return;
    }
    if (args.command === "soc-status") {
      const result = socStatus({ root: args.root, reviewSlug: args.reviewSlug });
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
