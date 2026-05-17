#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const CASE_INTAKE_BASENAME = "case-intake";
const REQUIRED_CASE_INTAKE_FIELDS = ["Status:", "Blocking Issues:", "Next Step:"];
const REQUIRED_JOURNAL_MARKERS = [
  "# Discovery Journal",
  "## Framing",
  "## Proposed Loads",
  "## Claims",
  "## Resolution",
];

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/investigator-artifacts.mjs open-case --root <repo> --case-slug <slug> --framing-json <file> [--proposed-load <path> ...]
  node scripts/investigator-artifacts.mjs verify-case --root <repo> --case-slug <slug>

Creates and verifies _data/cases/<slug>/case-intake.md,
case-intake.json, and journal.md.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const command = argv[2];
  if (!command || command === "--help" || command === "-h") usage(0);

  const args = {
    command,
    proposedLoads: [],
  };

  for (let i = 3; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--root") {
      args.root = value;
      i += 1;
    } else if (key === "--case-slug") {
      args.caseSlug = value;
      i += 1;
    } else if (key === "--framing-json") {
      args.framingJson = value;
      i += 1;
    } else if (key === "--proposed-load") {
      args.proposedLoads.push(value);
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${key}`);
    }
  }

  return args;
}

function assertSafeSlug(slug) {
  if (!slug || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) {
    throw new Error("case slug must use only letters, numbers, dot, underscore, or hyphen");
  }
  if (slug.includes("..")) {
    throw new Error("case slug cannot contain '..'");
  }
}

function resolveRepoRoot(rootArg) {
  if (!rootArg) throw new Error("--root is required");
  const root = path.resolve(rootArg);
  const stat = fs.statSync(root, { throwIfNoEntry: false });
  if (!stat || !stat.isDirectory()) {
    throw new Error(`repo root does not exist or is not a directory: ${root}`);
  }
  return root;
}

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

function loadFraming(root, framingJson) {
  if (!framingJson) throw new Error("--framing-json is required for open-case");
  const framingPath = path.isAbsolute(framingJson)
    ? framingJson
    : safeRepoPath(root, framingJson);
  const raw = fs.readFileSync(framingPath, "utf8");
  const framing = JSON.parse(raw);
  if (!framing || typeof framing !== "object" || Array.isArray(framing)) {
    throw new Error("framing JSON must be an object");
  }
  return framing;
}

function asArray(value) {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (value === undefined || value === null || value === "") return [];
  return [String(value)];
}

function normalizeProposedLoads(loads) {
  const seen = new Set();
  const normalized = [];
  for (const item of loads) {
    if (!item) continue;
    if (path.isAbsolute(item) || item.includes("\0")) {
      throw new Error(`proposed load must be repo-relative: ${item}`);
    }
    const clean = path.normalize(item);
    if (clean.startsWith("..")) {
      throw new Error(`proposed load escapes repo root: ${item}`);
    }
    if (!seen.has(clean)) {
      seen.add(clean);
      normalized.push(clean);
    }
  }
  return normalized;
}

function hasLogContext(framing) {
  if (asArray(framing.evidencePaths).length > 0) return true;

  const fields = [
    framing.symptom,
    framing.scope,
    framing.whatWorks,
    framing.alreadyTried,
    framing.recency,
  ];
  const haystack = fields.join(" ").toLowerCase();
  const separatedLogToken = /(^|[\s/_.:;()[\],])logs?($|[\s/_.:;()[\],])/;
  const telemetryToken = /\b(siem|lss|nss|splunk|evidence|events?|trace|packet|pcap|metric|metrics|telemetry)\b/;
  return separatedLogToken.test(haystack) || telemetryToken.test(haystack);
}

function isTelemetryReferencePath(relativePath) {
  return /^references\/(zia|zpa|zcc)\/logs\/.+\.md$/.test(relativePath);
}

function caseIntakeStatus(framing, proposedLoads) {
  const issues = [];
  if (!String(framing.workingDirectory || "").trim()) {
    issues.push("workingDirectory is required");
  }
  if (!String(framing.symptom || "").trim()) {
    issues.push("symptom is required");
  }
  if (!String(framing.scope || "").trim()) {
    issues.push("scope is required");
  }
  if (!proposedLoads.includes("agents/investigator/prompt.md")) {
    issues.push("proposed loads must include agents/investigator/prompt.md");
  }
  if (!proposedLoads.includes("agents/investigator/harness.md")) {
    issues.push("proposed loads must include agents/investigator/harness.md");
  }
  if (proposedLoads.some((load) => load.startsWith("_data/snapshot/"))) {
    issues.push("Step 1 proposed loads must not include tenant snapshot files");
  }
  if (proposedLoads.some((load) => load.startsWith("_data/cases/"))) {
    issues.push("Step 1 proposed loads must not browse case artifacts");
  }
  if (proposedLoads.some(isTelemetryReferencePath) && !hasLogContext(framing)) {
    issues.push("telemetry proposed loads require log, metric, SIEM, or evidence context in the framing");
  }

  return {
    status: issues.length === 0 ? "pass" : "blocked",
    blockingIssues: issues,
  };
}

function bulletList(items) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${item}`).join("\n");
}

function fieldValue(value, fallback = "not specified") {
  if (Array.isArray(value)) return value.length ? value.join(", ") : fallback;
  const text = String(value ?? "").trim();
  return text || fallback;
}

function buildCaseIntakeMd({ status, blockingIssues, nextStep, root, caseDir, caseIntakeJsonPath, journalPath, framing, proposedLoads }) {
  const issueLine = blockingIssues.length ? blockingIssues.join("; ") : "none";
  return `Status: ${status}
Blocking Issues: ${issueLine}
Next Step: ${nextStep}

# Investigator Case Intake

Case Directory: ${caseDir}
Case Intake JSON: ${caseIntakeJsonPath}
Journal Path: ${journalPath}
Working Directory: ${fieldValue(framing.workingDirectory, root)}

## Framing

| Field | Value |
|---|---|
| Symptom | ${fieldValue(framing.symptom)} |
| Tenant cloud | ${fieldValue(framing.tenantCloud, "unknown/not needed")} |
| Products / features | ${fieldValue(framing.products)} |
| Scope | ${fieldValue(framing.scope)} |
| Recency | ${fieldValue(framing.recency)} |
| What works | ${fieldValue(framing.whatWorks)} |
| Already tried | ${fieldValue(framing.alreadyTried)} |
| User-flagged specifics | ${fieldValue(framing.userFlaggedSpecifics, "none")} |
| Evidence paths | ${fieldValue(framing.evidencePaths, "none")} |

## Proposed Loads

${bulletList(proposedLoads)}
`;
}

function buildJournalMd({ status, caseDir, caseIntakePath, caseIntakeJsonPath, journalPath, framing, proposedLoads, timestamp }) {
  return `# Discovery Journal - ${fieldValue(framing.symptom, "unframed investigation")}

ISSUE: ${fieldValue(framing.symptom)}
STATUS: ${status === "pass" ? "Investigating" : "Blocked at case intake phase"}
TIMESTAMP: ${timestamp}
WORKING DIRECTORY: ${fieldValue(framing.workingDirectory)}
CASE DIRECTORY: ${caseDir}
CASE INTAKE PATH: ${caseIntakePath}
CASE INTAKE JSON: ${caseIntakeJsonPath}
JOURNAL PATH: ${journalPath}

## Framing

| Field | Value |
|---|---|
| Symptom | ${fieldValue(framing.symptom)} |
| Tenant cloud | ${fieldValue(framing.tenantCloud, "unknown/not needed")} |
| Products / features | ${fieldValue(framing.products)} |
| Scope | ${fieldValue(framing.scope)} |
| Recency | ${fieldValue(framing.recency)} |
| User-flagged specifics | ${fieldValue(framing.userFlaggedSpecifics, "none")} |

## Proposed Loads

${bulletList(proposedLoads)}

## Claims

(Hypotheses populated after case intake verification and Step 2 grounding.)

## Resolution

${status === "pass" ? "Open." : "Blocked before grounding."}
`;
}

function verifyCaseFiles(root, caseSlug) {
  assertSafeSlug(caseSlug);
  const caseDir = path.join(root, "_data", "cases", caseSlug);
  const caseIntakePath = path.join(caseDir, `${CASE_INTAKE_BASENAME}.md`);
  const caseIntakeJsonPath = path.join(caseDir, `${CASE_INTAKE_BASENAME}.json`);
  const journalPath = path.join(caseDir, "journal.md");

  const caseIntakeMd = fs.readFileSync(caseIntakePath, "utf8");
  const caseIntakeJson = JSON.parse(fs.readFileSync(caseIntakeJsonPath, "utf8"));
  const journalMd = fs.readFileSync(journalPath, "utf8");

  for (const marker of REQUIRED_CASE_INTAKE_FIELDS) {
    if (!caseIntakeMd.includes(marker)) {
      throw new Error(`${CASE_INTAKE_BASENAME}.md missing marker: ${marker}`);
    }
  }
  if (!/^Status: pass$/m.test(caseIntakeMd)) {
    throw new Error(`${CASE_INTAKE_BASENAME}.md status is not pass`);
  }
  if (!/^Blocking Issues: none$/m.test(caseIntakeMd)) {
    throw new Error(`${CASE_INTAKE_BASENAME}.md blocking issues are not none`);
  }
  for (const marker of REQUIRED_JOURNAL_MARKERS) {
    if (!journalMd.includes(marker)) {
      throw new Error(`journal.md missing marker: ${marker}`);
    }
  }
  if (caseIntakeJson.status !== "pass" || !Array.isArray(caseIntakeJson.blockingIssues) || caseIntakeJson.blockingIssues.length) {
    throw new Error(`${CASE_INTAKE_BASENAME}.json does not describe a passing case intake`);
  }
  const recomputed = caseIntakeStatus(
    caseIntakeJson.framing || {},
    normalizeProposedLoads(caseIntakeJson.proposedLoads || []),
  );
  if (recomputed.status !== "pass") {
    throw new Error(`${CASE_INTAKE_BASENAME}.json recomputes to ${recomputed.status}: ${recomputed.blockingIssues.join("; ")}`);
  }

  return { caseDir, caseIntakePath, caseIntakeJsonPath, journalPath };
}

function openCase(args) {
  const root = resolveRepoRoot(args.root);
  assertSafeSlug(args.caseSlug);
  const framing = loadFraming(root, args.framingJson);
  const proposedLoads = normalizeProposedLoads(args.proposedLoads);
  const { status, blockingIssues } = caseIntakeStatus(framing, proposedLoads);

  const caseDir = path.join(root, "_data", "cases", args.caseSlug);
  const caseIntakePath = path.join(caseDir, `${CASE_INTAKE_BASENAME}.md`);
  const caseIntakeJsonPath = path.join(caseDir, `${CASE_INTAKE_BASENAME}.json`);
  const journalPath = path.join(caseDir, "journal.md");
  const timestamp = new Date().toISOString();
  const nextStep = status === "pass"
    ? "Run verify-case, then load only the proposed files."
    : "Resolve the blocking issue, then rerun open-case.";

  fs.mkdirSync(caseDir, { recursive: true });

  const caseIntakeJson = {
    status,
    blockingIssues,
    nextStep,
    caseSlug: args.caseSlug,
    caseDir,
    caseIntakePath,
    caseIntakeJsonPath,
    journalPath,
    createdAt: timestamp,
    framing,
    proposedLoads,
  };

  fs.writeFileSync(caseIntakeJsonPath, `${JSON.stringify(caseIntakeJson, null, 2)}\n`, "utf8");
  fs.writeFileSync(caseIntakePath, buildCaseIntakeMd({
    status,
    blockingIssues,
    nextStep,
    root,
    caseDir,
    caseIntakeJsonPath,
    journalPath,
    framing,
    proposedLoads,
  }), "utf8");
  fs.writeFileSync(journalPath, buildJournalMd({
    status,
    caseDir,
    caseIntakePath,
    caseIntakeJsonPath,
    journalPath,
    framing,
    proposedLoads,
    timestamp,
  }), "utf8");

  if (status === "pass") {
    verifyCaseFiles(root, args.caseSlug);
  }

  return caseIntakeJson;
}

function main() {
  try {
    const args = parseArgs(process.argv);
    if (args.command === "open-case") {
      const result = openCase(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      process.exit(result.status === "pass" ? 0 : 2);
    }
    if (args.command === "verify-case") {
      const root = resolveRepoRoot(args.root);
      const result = verifyCaseFiles(root, args.caseSlug);
      process.stdout.write(`${JSON.stringify({ status: "pass", ...result }, null, 2)}\n`);
      return;
    }
    usage(1);
  } catch (error) {
    process.stderr.write(`investigator-artifacts: ${error.message}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  openCase,
  hasLogContext,
  isTelemetryReferencePath,
  caseIntakeStatus,
  verifyCaseFiles,
};
