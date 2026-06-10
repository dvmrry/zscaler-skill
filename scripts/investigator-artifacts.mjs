#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";

const CASE_INTAKE_BASENAME = "case-intake";
const WORKFLOW_DIR = "workflow";
const LOADS_BASENAME = "01-loads.json";
const TURN_LOG_BASENAME = "02-turns.jsonl";
const TURN_STATE_BASENAME = "02-turn-state.json";
const EVIDENCE_DIR_BASENAME = "evidence";
const EVIDENCE_MANIFEST_BASENAME = "MANIFEST.md";
const HELPER_VERSION = "0.4.0";
const MAX_EVIDENCE_SLUG_PART_LENGTH = 80;
const MANDATORY_LOADS = [
  "agents/investigator/prompt.md",
  "agents/investigator/harness.md",
];
const SUPPORTED_OPERATIONS = [
  "open-case",
  "verify-case",
  "record-loads",
  "verify-loads",
  "initialize-turn-ledger",
  "begin-turn",
  "complete-turn",
  "abandon-turn",
  "import-evidence",
  "save-journal",
  "run-turn",
  "status",
];
const SUPPORTED_OPTIONS = {
  "complete-turn": ["--turn-json", "--turn-input-json"],
  "record-loads": ["--loaded", "--deferred", "--allow-additional", "--force"],
  "save-journal": ["--content-file"],
  "run-turn": ["--user-action", "--journal-file", "--turn-input-json"],
  "initialize-turn-ledger": ["--journal-file", "--force"],
};
const HELPER_OWNED_TURN_FIELDS = [
  "sequence",
  "previousHash",
  "turnToken",
  "userAction",
  "journalHashBefore",
  "journalHashAfter",
];
const REQUIRED_CASE_INTAKE_FIELDS = ["Status:", "Blocking Issues:", "Next Step:"];
const REQUIRED_JOURNAL_MARKERS = [
  "# Discovery Journal",
  "## Framing",
  "## Proposed Loads",
  "## Claims",
  "## Resolution",
];
const REQUIRED_CLAIM_TABLE_HEADER = "| Claim | Source | Status | Next evidence needed | Timestamp | Notes |";
const VALID_CLAIM_STATUSES = new Set([
  "Open (likely)",
  "Open (uncertain)",
  "Confirmed (high)",
  "Confirmed (medium)",
  "Ruled out",
  "Stale",
  "Resolved",
]);
const OPEN_CLAIM_STATUSES = new Set(["Open (likely)", "Open (uncertain)"]);
const EVIDENCE_REQUEST_ACTION_TYPES = new Set(["query-request", "request-user-evidence"]);
const QUERY_REQUEST_ACTION_TYPES = new Set(["query-request"]);
const VALID_ACTION_TYPES = new Set([
  "load-file",
  "query-request",
  "request-user-evidence",
  "record-user-evidence",
  "add-evidence",
  "mark-resolved",
  "pause",
]);
const DEFAULT_ALLOWED_NEXT = [
  "continue-top-open",
  "investigate-different-claim",
  "request-user-evidence",
  "record-user-evidence",
  "add-evidence",
  "mark-resolved",
  "pause",
];

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/investigator-artifacts.mjs open-case --root <repo> --case-slug <slug> --framing-json <file> [--proposed-load <path> ...] [--force]
  node scripts/investigator-artifacts.mjs verify-case --root <repo> --case-slug <slug>
  node scripts/investigator-artifacts.mjs record-loads --root <repo> --case-slug <slug> --loaded <path> [--loaded <path> ...] [--deferred <path>=<reason> ...] [--allow-additional] [--force]
  node scripts/investigator-artifacts.mjs verify-loads --root <repo> --case-slug <slug>
  node scripts/investigator-artifacts.mjs initialize-turn-ledger --root <repo> --case-slug <slug> [--journal-file <path>] [--force]
  node scripts/investigator-artifacts.mjs begin-turn --root <repo> --case-slug <slug> --user-action <action>
  node scripts/investigator-artifacts.mjs complete-turn --root <repo> --case-slug <slug> (--turn-json <file>|--turn-input-json <file>)
  node scripts/investigator-artifacts.mjs abandon-turn --root <repo> --case-slug <slug> --reason <text>
  node scripts/investigator-artifacts.mjs save-journal --root <repo> --case-slug <slug> --content-file <path>
  node scripts/investigator-artifacts.mjs run-turn --root <repo> --case-slug <slug> --user-action <action> --journal-file <path> --turn-input-json <file>
  node scripts/investigator-artifacts.mjs status --root <repo> --case-slug <slug>
  node scripts/investigator-artifacts.mjs capabilities
  node scripts/investigator-artifacts.mjs import-evidence --root <repo> --case-slug <slug> --source-file <file> --name <name> --source <source> (--query <text>|--query-file <file>|--request-text <text>) --summary <text> --captured-at <ISO-UTC> --touched-claim <claim> [--active-hypothesis <tag>] [--allow-placeholder-query]
  node scripts/investigator-artifacts.mjs import-evidence --root <repo> --case-slug <slug> --input-json <file>

Creates and verifies _data/cases/<slug>/case-intake.md,
case-intake.json, journal.md, workflow/01-loads.json, and optional workflow turn state.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const command = argv[2];
  if (!command || command === "--help" || command === "-h") usage(0);

  const args = {
    command,
    force: false,
    proposedLoads: [],
    touchedClaims: [],
    loaded: [],
    deferred: [],
    allowAdditional: false,
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
    } else if (key === "--turn-json") {
      args.turnJson = value;
      i += 1;
    } else if (key === "--turn-input-json") {
      args.turnInputJson = value;
      i += 1;
    } else if (key === "--user-action") {
      args.userAction = value;
      i += 1;
    } else if (key === "--reason") {
      args.reason = value;
      i += 1;
    } else if (key === "--source-file") {
      args.sourceFile = value;
      i += 1;
    } else if (key === "--name") {
      args.name = value;
      i += 1;
    } else if (key === "--source") {
      args.source = value;
      i += 1;
    } else if (key === "--query") {
      args.query = value;
      i += 1;
    } else if (key === "--query-file") {
      args.queryFile = value;
      i += 1;
    } else if (key === "--request-text") {
      args.requestText = value;
      i += 1;
    } else if (key === "--summary") {
      args.summary = value;
      i += 1;
    } else if (key === "--captured-at") {
      args.capturedAt = value;
      i += 1;
    } else if (key === "--active-hypothesis") {
      args.activeHypothesis = value;
      i += 1;
    } else if (key === "--input-json") {
      args.inputJson = value;
      i += 1;
    } else if (key === "--touched-claim") {
      args.touchedClaims.push(value);
      i += 1;
    } else if (key === "--proposed-load") {
      args.proposedLoads.push(value);
      i += 1;
    } else if (key === "--loaded") {
      args.loaded.push(value);
      i += 1;
    } else if (key === "--deferred") {
      args.deferred.push(value);
      i += 1;
    } else if (key === "--force") {
      args.force = true;
    } else if (key === "--allow-additional") {
      args.allowAdditional = true;
    } else if (key === "--allow-placeholder-query") {
      args.allowPlaceholderQuery = true;
    } else if (key === "--content-file") {
      args.contentFile = value;
      i += 1;
    } else if (key === "--journal-file") {
      args.journalFile = value;
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

function sha256Text(text) {
  return `sha256:${crypto.createHash("sha256").update(text).digest("hex")}`;
}

function sha256File(filePath) {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
}

function hashTurnEvent(event) {
  return sha256Text(JSON.stringify(event));
}

function atomicWriteFile(filePath, content) {
  const tempPath = `${filePath}.tmp-${process.pid}-${crypto.randomUUID()}`;
  fs.writeFileSync(tempPath, content, "utf8");
  fs.renameSync(tempPath, filePath);
}

function atomicWriteJson(filePath, value) {
  atomicWriteFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function loadJson(root, jsonPath, requiredArgName) {
  if (!jsonPath) throw new Error(`${requiredArgName} is required`);
  const resolved = path.isAbsolute(jsonPath)
    ? jsonPath
    : safeRepoPath(root, jsonPath);
  return JSON.parse(fs.readFileSync(resolved, "utf8"));
}

function casePaths(root, caseSlug) {
  assertSafeSlug(caseSlug);
  const caseDir = path.join(root, "_data", "cases", caseSlug);
  const workflowDir = path.join(caseDir, WORKFLOW_DIR);
  return {
    caseDir,
    workflowDir,
    caseIntakePath: path.join(caseDir, `${CASE_INTAKE_BASENAME}.md`),
    caseIntakeJsonPath: path.join(caseDir, `${CASE_INTAKE_BASENAME}.json`),
    journalPath: path.join(caseDir, "journal.md"),
    evidenceDir: path.join(caseDir, EVIDENCE_DIR_BASENAME),
    evidenceManifestPath: path.join(caseDir, EVIDENCE_DIR_BASENAME, EVIDENCE_MANIFEST_BASENAME),
    loadsPath: path.join(workflowDir, LOADS_BASENAME),
    turnLogPath: path.join(workflowDir, TURN_LOG_BASENAME),
    turnStatePath: path.join(workflowDir, TURN_STATE_BASENAME),
  };
}

function makeTurnToken() {
  return crypto.randomUUID();
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return [];
  return raw.split("\n").map((line) => JSON.parse(line));
}

function appendJsonl(filePath, value) {
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function normalizeAllowedNext(allowedNext) {
  if (!Array.isArray(allowedNext) || allowedNext.length === 0) {
    throw new Error("allowedNext must be a non-empty array");
  }
  const normalized = [];
  const seen = new Set();
  for (const item of allowedNext) {
    const action = String(item || "").trim();
    if (!action) throw new Error("allowedNext cannot contain empty actions");
    if (!seen.has(action)) {
      seen.add(action);
      normalized.push(action);
    }
  }
  return normalized;
}

function normalizeBlockingIssues(blockingIssues) {
  if (blockingIssues === undefined) return [];
  if (!Array.isArray(blockingIssues)) {
    throw new Error("blockingIssues must be an array");
  }
  return blockingIssues.map((issue) => String(issue));
}

function requiresTouchedClaims(actionType) {
  return actionType !== "pause";
}

function markdownTableCells(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function journalHasClaimTable(journalPath) {
  try {
    const journal = fs.readFileSync(journalPath, "utf8");
    return journal.includes("# Discovery Journal") && journal.includes(REQUIRED_CLAIM_TABLE_HEADER);
  } catch (_) {
    return false;
  }
}

function verifyJournalContentHasClaimTable(content) {
  if (!content.includes("# Discovery Journal")) {
    throw new Error("journal.md missing marker: # Discovery Journal");
  }
  if (!content.includes(REQUIRED_CLAIM_TABLE_HEADER)) {
    throw new Error("journal.md missing claim table header");
  }
  const lines = content.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim() === REQUIRED_CLAIM_TABLE_HEADER);
  for (const line of lines.slice(headerIndex + 1)) {
    const trimmed = line.trim();
    if (!trimmed) break;
    if (trimmed.startsWith("## ")) break;
    if (/^\|\s*-+/.test(trimmed)) continue;
    if (!trimmed.startsWith("|")) continue;
    const cells = markdownTableCells(trimmed);
    if (cells.length < 3) continue;
    const status = cells[2];
    if (!VALID_CLAIM_STATUSES.has(status)) {
      throw new Error(`journal.md claim status is not allowed: ${status}`);
    }
  }
}

function verifyJournalHasClaimTable(journalPath) {
  const content = fs.readFileSync(journalPath, "utf8");
  verifyJournalContentHasClaimTable(content);
}

function journalClaimStatusesFromContent(content) {
  const statuses = new Map();
  const lines = content.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim() === REQUIRED_CLAIM_TABLE_HEADER);
  if (headerIndex === -1) return statuses;
  for (const line of lines.slice(headerIndex + 1)) {
    const trimmed = line.trim();
    if (!trimmed) break;
    if (trimmed.startsWith("## ")) break;
    if (/^\|\s*-+/.test(trimmed)) continue;
    if (!trimmed.startsWith("|")) continue;
    const cells = markdownTableCells(trimmed);
    if (cells.length < 3) continue;
    statuses.set(cells[0], cells[2]);
  }
  return statuses;
}

function journalClaimStatuses(journalPath) {
  const content = fs.readFileSync(journalPath, "utf8");
  return journalClaimStatusesFromContent(content);
}

function validateActionType(actionType) {
  if (!VALID_ACTION_TYPES.has(actionType)) {
    throw new Error(
      `turn-json actionType is not allowed: ${actionType}. Valid actionType values: ${[...VALID_ACTION_TYPES].join(", ")}. actionType is not the begin-turn --user-action value.`,
    );
  }
}

function priorEvidenceRefs(events) {
  const refs = new Set();
  for (const event of events) {
    for (const ref of asArray(event.evidenceRefs)) {
      refs.add(ref);
    }
  }
  return refs;
}

function validateMarkResolved(journalPath, turnInput, actionType, priorEvents, journalContent) {
  if (actionType !== "mark-resolved") return;

  const completionGate = turnInput.completionGate;
  if (!completionGate || typeof completionGate !== "object" || Array.isArray(completionGate)) {
    throw new Error("mark-resolved turns must include completionGate");
  }

  const rootCauseClaim = String(completionGate.rootCauseClaim || "").trim();
  if (!rootCauseClaim) {
    throw new Error("mark-resolved completionGate.rootCauseClaim is required");
  }
  if (completionGate.userConfirmedResolution !== true) {
    throw new Error("mark-resolved requires completionGate.userConfirmedResolution: true");
  }

  const supportingEvidenceRefs = asArray(completionGate.supportingEvidenceRefs);
  if (supportingEvidenceRefs.length === 0) {
    throw new Error("mark-resolved requires completionGate.supportingEvidenceRefs");
  }

  const statuses = journalContent
    ? journalClaimStatusesFromContent(journalContent)
    : journalClaimStatuses(journalPath);
  if (statuses.size === 0) {
    throw new Error("mark-resolved requires at least one claim in journal.md");
  }
  const openClaims = [...statuses.entries()]
    .filter(([, status]) => OPEN_CLAIM_STATUSES.has(status))
    .map(([claim]) => claim);
  if (openClaims.length > 0) {
    throw new Error(`mark-resolved requires no open claims; still open: ${openClaims.join("; ")}`);
  }
  const rootStatus = statuses.get(rootCauseClaim);
  if (!rootStatus) {
    throw new Error(`mark-resolved rootCauseClaim is not present in journal.md: ${rootCauseClaim}`);
  }
  if (!new Set(["Resolved", "Confirmed (high)"]).has(rootStatus)) {
    throw new Error(`mark-resolved root cause claim must be Resolved or Confirmed (high), not ${rootStatus}`);
  }
  const recordedRefs = priorEvidenceRefs(priorEvents);
  const unrecordedRefs = supportingEvidenceRefs.filter((ref) => !recordedRefs.has(ref));
  if (unrecordedRefs.length > 0) {
    throw new Error(`mark-resolved supporting evidence must be recorded in a prior turn: ${unrecordedRefs.join("; ")}`);
  }
}

function splunkPatternNames(root) {
  const catalogPath = path.join(root, "references", "shared", "splunk-queries.md");
  const catalog = fs.readFileSync(catalogPath, "utf8");
  const names = new Set();
  for (const match of catalog.matchAll(/^### `([^`]+)`/gm)) {
    names.add(match[1]);
  }
  return names;
}

function validateQueryRequest(root, turnInput, actionType) {
  if (!QUERY_REQUEST_ACTION_TYPES.has(actionType)) return [];
  const queryPatterns = asArray(turnInput.queryPatterns);
  if (queryPatterns.length === 0) {
    throw new Error(`${actionType} turns must include queryPatterns from references/shared/splunk-queries.md`);
  }
  const catalogNames = splunkPatternNames(root);
  for (const pattern of queryPatterns) {
    if (!catalogNames.has(pattern)) {
      throw new Error(`query pattern is not in references/shared/splunk-queries.md: ${pattern}`);
    }
  }
  return queryPatterns;
}

function validateUserEvidenceRequest(turnInput, actionType) {
  if (actionType !== "request-user-evidence") return null;
  const evidenceRequest = String(turnInput.evidenceRequest || "").trim();
  if (!evidenceRequest) {
    throw new Error("request-user-evidence turns must include evidenceRequest");
  }
  return evidenceRequest;
}

function validateEvidenceHandoffTurn(journalPath, turnInput, actionType, journalContent) {
  if (!EVIDENCE_REQUEST_ACTION_TYPES.has(actionType)) return;
  const statuses = journalContent
    ? journalClaimStatusesFromContent(journalContent)
    : journalClaimStatuses(journalPath);
  for (const claim of asArray(turnInput.touchedClaims)) {
    const status = statuses.get(claim);
    if (!status) {
      throw new Error(`${actionType} touched claim is not present in journal.md: ${claim}`);
    }
    if (!OPEN_CLAIM_STATUSES.has(status)) {
      throw new Error(`${actionType} must not record returned evidence or close claims; use record-user-evidence in a new turn`);
    }
  }
}

function validateTouchedClaimsExist(journalPath, touchedClaims, context, journalContent) {
  const claims = asArray(touchedClaims).map((claim) => claim.trim()).filter(Boolean);
  if (claims.length === 0) {
    throw new Error(`${context} must include at least one touched claim`);
  }
  const statuses = journalContent
    ? journalClaimStatusesFromContent(journalContent)
    : journalClaimStatuses(journalPath);
  const claimKeys = [...statuses.keys()];
  const resolved = [];
  for (const claim of claims) {
    if (statuses.has(claim)) {
      // Exact match — current behavior.
      resolved.push(claim);
      continue;
    }
    // Short H-tag match: claim is like "H1" or "h12" with no colon.
    // A cell matches if it starts with the tag (case-insensitive) followed by ":".
    const shortTagMatch = /^[Hh]\d+$/.test(claim);
    if (shortTagMatch) {
      const tagPrefix = claim.toLowerCase() + ":";
      const matches = claimKeys.filter((k) => k.toLowerCase().startsWith(tagPrefix));
      if (matches.length === 1) {
        resolved.push(matches[0]);
        continue;
      }
      // Zero or multiple matches — ambiguous; fall through to error.
    }
    const claimSummary = claimKeys.map((k) => k.slice(0, 60)).join(" | ");
    throw new Error(
      `${context} touched claim is not present in journal.md: ${claim}. Journal claims: ${claimSummary}`,
    );
  }
  return resolved;
}

function normalizeCompletionGate(turnInput, actionType) {
  if (actionType !== "mark-resolved") return null;
  const completionGate = turnInput.completionGate || {};
  return {
    rootCauseClaim: String(completionGate.rootCauseClaim || "").trim(),
    userConfirmedResolution: completionGate.userConfirmedResolution === true,
    supportingEvidenceRefs: asArray(completionGate.supportingEvidenceRefs),
  };
}

function readTurnState(paths) {
  if (!fs.existsSync(paths.turnStatePath)) {
    throw new Error(`missing ${TURN_STATE_BASENAME}; run initialize-turn-ledger first`);
  }
  const state = JSON.parse(fs.readFileSync(paths.turnStatePath, "utf8"));
  if (fs.existsSync(paths.turnLogPath)) {
    const events = readJsonl(paths.turnLogPath);
    const lastEvent = events.at(-1);
    if (lastEvent) {
      const lastHash = hashTurnEvent(lastEvent);
      if (state.latestTurnHash !== lastHash) {
        throw new Error(`${TURN_STATE_BASENAME} does not agree with last ${TURN_LOG_BASENAME} event`);
      }
      if (state.currentSequence !== lastEvent.sequence) {
        throw new Error(`${TURN_STATE_BASENAME} sequence does not agree with last ${TURN_LOG_BASENAME} event`);
      }
    }
  }
  return state;
}

// ── record-loads / verify-loads helpers ──────────────────────────────────────

function parseDeferredEntry(entry) {
  // Split on first '=' only; reason may itself contain '='.
  const eqIndex = String(entry).indexOf("=");
  if (eqIndex === -1) {
    return { path: String(entry).trim(), reason: "" };
  }
  return {
    path: String(entry).slice(0, eqIndex).trim(),
    reason: String(entry).slice(eqIndex + 1).trim(),
  };
}

/**
 * Pure-ish predicate for the Step 2 loads gate. Returns
 *   { status: "pass"|"blocked", blockingIssues: [] }
 *
 * Inputs must already be normalised (normalizeProposedLoads-style paths).
 * `root` is required for filesystem existence checks on `loaded` paths.
 */
function loadsStatus(root, proposedLoads, loaded, deferred, additionalAllowed) {
  const issues = [];

  // Mandatory docs may not be deferred.
  const deferredPaths = new Set(deferred.map((d) => d.path));
  for (const mandatory of MANDATORY_LOADS) {
    if (!loaded.includes(mandatory)) {
      if (deferredPaths.has(mandatory)) {
        issues.push(`${mandatory} is mandatory and must be loaded, not deferred`);
      } else {
        issues.push(`${mandatory} must be in loaded`);
      }
    }
  }

  // Every proposed load must appear in exactly one of loaded or deferred.
  const loadedSet = new Set(loaded);
  for (const proposed of proposedLoads) {
    const inLoaded = loadedSet.has(proposed);
    const inDeferred = deferredPaths.has(proposed);
    if (!inLoaded && !inDeferred) {
      issues.push(`proposed load not accounted for (add to --loaded or --deferred): ${proposed}`);
    }
  }

  // Every deferred entry must carry a non-empty reason.
  for (const entry of deferred) {
    if (!entry.reason) {
      issues.push(`deferred entry missing reason: ${entry.path}`);
    }
  }

  // A path must not appear in both loaded and deferred.
  const overlap = loaded.filter((p) => deferredPaths.has(p));
  if (overlap.length > 0) {
    issues.push(`path(s) appear in both loaded and deferred: ${overlap.join(", ")}`);
  }

  // Every loaded path must exist under the repo root.
  for (const loadedPath of loaded) {
    try {
      const abs = safeRepoPath(root, loadedPath);
      if (!fs.existsSync(abs)) {
        issues.push(`loaded path does not exist: ${loadedPath}`);
      }
    } catch (err) {
      issues.push(`loaded path is unsafe: ${loadedPath} (${err.message})`);
    }
  }

  // Additional loads (loaded but not in proposedLoads) require the flag.
  const proposedSet = new Set(proposedLoads);
  const additionalLoads = loaded.filter((p) => !proposedSet.has(p));
  if (additionalLoads.length > 0 && !additionalAllowed) {
    issues.push(
      `loaded paths not in proposedLoads require --allow-additional: ${additionalLoads.join(", ")}`,
    );
  }

  return {
    status: issues.length === 0 ? "pass" : "blocked",
    blockingIssues: issues,
    additionalLoads,
  };
}

function recordLoads(args) {
  const root = resolveRepoRoot(args.root);
  const verified = verifyCaseFiles(root, args.caseSlug);
  const paths = casePaths(root, args.caseSlug);

  // Read proposedLoads from the verified case-intake.json.
  const caseIntakeJson = JSON.parse(fs.readFileSync(paths.caseIntakeJsonPath, "utf8"));
  const proposedLoads = normalizeProposedLoads(caseIntakeJson.proposedLoads || []);

  // Normalize inputs.
  const loaded = normalizeProposedLoads(args.loaded || []);
  const deferred = (args.deferred || []).map((entry) => {
    const parsed = parseDeferredEntry(entry);
    // Validate the path part is a safe relative path.
    try {
      const clean = path.normalize(parsed.path);
      if (!parsed.path || path.isAbsolute(parsed.path) || clean.startsWith("..")) {
        throw new Error(`deferred path escapes repo root or is absolute: ${parsed.path}`);
      }
      parsed.path = clean;
    } catch (err) {
      throw new Error(`deferred path is invalid: ${parsed.path} — ${err.message}`);
    }
    return parsed;
  });

  const additionalAllowed = Boolean(args.allowAdditional);

  // Refuse to overwrite without --force.
  fs.mkdirSync(paths.workflowDir, { recursive: true });
  if (!args.force && fs.existsSync(paths.loadsPath)) {
    throw new Error(`${LOADS_BASENAME} already exists; rerun record-loads with --force only to replace it`);
  }

  const { status, blockingIssues, additionalLoads } = loadsStatus(
    root, proposedLoads, loaded, deferred, additionalAllowed,
  );

  const artifact = {
    status,
    caseSlug: args.caseSlug,
    loaded,
    deferred,
    additionalLoads,
    additionalApproved: additionalAllowed && additionalLoads.length > 0,
    blockingIssues,
    recordedAt: new Date().toISOString(),
  };

  atomicWriteJson(paths.loadsPath, artifact);

  // Readback verification: re-read and check structure matches.
  const readback = JSON.parse(fs.readFileSync(paths.loadsPath, "utf8"));
  if (readback.status !== status) {
    throw new Error(`${LOADS_BASENAME} readback status mismatch; filesystem may be unreliable`);
  }

  return {
    status,
    operation: "record-loads",
    caseSlug: args.caseSlug,
    loadsPath: paths.loadsPath,
    loaded,
    deferred,
    additionalLoads,
    additionalApproved: artifact.additionalApproved,
    blockingIssues,
    ...verified,
  };
}

function verifyLoads(root, caseSlug) {
  assertSafeSlug(caseSlug);
  const paths = casePaths(root, caseSlug);

  if (!fs.existsSync(paths.loadsPath)) {
    throw new Error(
      `${LOADS_BASENAME} not found; run: node scripts/investigator-artifacts.mjs record-loads --root <root> --case-slug ${caseSlug} --loaded <path> ...`,
    );
  }

  const artifact = JSON.parse(fs.readFileSync(paths.loadsPath, "utf8"));

  // Re-read proposedLoads from current case-intake.json (recompute, never trust stored status).
  const caseIntakeJson = JSON.parse(fs.readFileSync(paths.caseIntakeJsonPath, "utf8"));
  const proposedLoads = normalizeProposedLoads(caseIntakeJson.proposedLoads || []);

  const loaded = Array.isArray(artifact.loaded) ? artifact.loaded : [];
  const deferred = Array.isArray(artifact.deferred) ? artifact.deferred : [];
  const additionalAllowed = artifact.additionalApproved === true;

  const { status, blockingIssues, additionalLoads } = loadsStatus(
    root, proposedLoads, loaded, deferred, additionalAllowed,
  );

  if (artifact.status === "pass" && status !== "pass") {
    throw new Error(
      `${LOADS_BASENAME} stored status is "pass" but recomputes to "${status}": ${blockingIssues.join("; ")}`,
    );
  }

  return {
    status,
    operation: "verify-loads",
    caseSlug,
    loadsPath: paths.loadsPath,
    loaded,
    deferred,
    additionalLoads,
    blockingIssues,
  };
}

function requirePassingLoads(root, caseSlug) {
  const paths = casePaths(root, caseSlug);
  if (!fs.existsSync(paths.loadsPath)) {
    throw new Error(
      `Step 2 loads not recorded; run: node scripts/investigator-artifacts.mjs record-loads --root ${root} --case-slug ${caseSlug} --loaded <path> ...`,
    );
  }
  // Recompute — never trust the stored status field.
  const artifact = JSON.parse(fs.readFileSync(paths.loadsPath, "utf8"));
  const caseIntakeJson = JSON.parse(fs.readFileSync(paths.caseIntakeJsonPath, "utf8"));
  const proposedLoads = normalizeProposedLoads(caseIntakeJson.proposedLoads || []);
  const loaded = Array.isArray(artifact.loaded) ? artifact.loaded : [];
  const deferred = Array.isArray(artifact.deferred) ? artifact.deferred : [];
  const additionalAllowed = artifact.additionalApproved === true;
  const { status, blockingIssues } = loadsStatus(root, proposedLoads, loaded, deferred, additionalAllowed);
  if (status !== "pass") {
    throw new Error(
      `${LOADS_BASENAME} recomputes to blocked: ${blockingIssues.join("; ")}; fix loads and rerun record-loads before initialize-turn-ledger`,
    );
  }
}

// ── status (doctor) ───────────────────────────────────────────────────────────

function caseStatus(args) {
  const root = resolveRepoRoot(args.root);
  assertSafeSlug(args.caseSlug);
  const caseSlug = args.caseSlug;
  const paths = casePaths(root, caseSlug);

  // ── intake ──
  const intakeResult = { present: false, pass: false, issues: [] };
  let intakeJson = null;
  try {
    if (fs.existsSync(paths.caseIntakeJsonPath) && fs.existsSync(paths.caseIntakePath)) {
      intakeResult.present = true;
      intakeJson = JSON.parse(fs.readFileSync(paths.caseIntakeJsonPath, "utf8"));
      // Recompute — don't trust stored status.
      verifyCaseFiles(root, caseSlug);
      intakeResult.pass = true;
    }
  } catch (err) {
    intakeResult.pass = false;
    intakeResult.issues.push(err.message);
  }

  // ── loads ──
  const loadsResult = { present: false, pass: false, issues: [] };
  let loadsArtifact = null;
  if (intakeResult.pass) {
    try {
      if (fs.existsSync(paths.loadsPath)) {
        loadsResult.present = true;
        loadsArtifact = JSON.parse(fs.readFileSync(paths.loadsPath, "utf8"));
        const verifyResult = verifyLoads(root, caseSlug);
        loadsResult.pass = verifyResult.status === "pass";
        if (!loadsResult.pass) {
          loadsResult.issues.push(...verifyResult.blockingIssues);
        }
      }
    } catch (err) {
      loadsResult.pass = false;
      loadsResult.issues.push(err.message);
    }
  }

  // ── ledger ──
  const ledgerResult = {
    present: false,
    consistent: false,
    currentSequence: null,
    pendingTurn: null,
    issues: [],
  };
  let turnState = null;
  if (loadsResult.pass) {
    try {
      if (fs.existsSync(paths.turnStatePath)) {
        ledgerResult.present = true;
        turnState = readTurnState(paths);
        ledgerResult.consistent = true;
        ledgerResult.currentSequence = turnState.currentSequence;
        if (turnState.pendingTurn) {
          const pending = turnState.pendingTurn;
          const currentJournalHash = fs.existsSync(paths.journalPath)
            ? sha256File(paths.journalPath)
            : null;
          const journalChangedSinceBegin =
            currentJournalHash !== null &&
            pending.journalHashBefore !== undefined &&
            currentJournalHash !== pending.journalHashBefore;
          ledgerResult.pendingTurn = {
            sequence: pending.sequence,
            userAction: pending.userAction,
            journalChangedSinceBegin,
          };
        }
      }
    } catch (err) {
      ledgerResult.consistent = false;
      ledgerResult.issues.push(err.message);
    }
  }

  // ── journal ──
  const journalResult = { present: false, claimCounts: {} };
  if (fs.existsSync(paths.journalPath)) {
    journalResult.present = true;
    try {
      const statuses = journalClaimStatuses(paths.journalPath);
      for (const [, statusVal] of statuses) {
        journalResult.claimCounts[statusVal] = (journalResult.claimCounts[statusVal] || 0) + 1;
      }
    } catch (_) {
      // Non-fatal for status command.
    }
  }

  // ── derive phase ──
  let phase;
  const RESOLVED_STATUSES = new Set(["Resolved", "Confirmed (high)", "Ruled out", "Stale"]);
  if (!intakeResult.present) {
    phase = "no-case";
  } else if (!intakeResult.pass) {
    phase = "intake";
  } else if (!loadsResult.present || !loadsResult.pass) {
    phase = "loads";
  } else if (!ledgerResult.present) {
    // Distinguish between a stub journal (Step 3 not yet done) and a real journal.
    if (!journalHasClaimTable(paths.journalPath)) {
      phase = "journal-pending";
    } else {
      phase = "ledger-pending";
    }
  } else if (!ledgerResult.consistent) {
    phase = "ledger-pending";
  } else if (ledgerResult.pendingTurn) {
    phase = "turn-open";
  } else {
    // Check if all claims are resolved.
    const allStatuses = Object.keys(journalResult.claimCounts);
    const allResolved =
      allStatuses.length > 0 &&
      allStatuses.every((s) => RESOLVED_STATUSES.has(s));
    // Check for a completed mark-resolved turn.
    let hasMarkResolvedTurn = false;
    if (allResolved && fs.existsSync(paths.turnLogPath)) {
      try {
        const events = readJsonl(paths.turnLogPath);
        hasMarkResolvedTurn = events.some((e) => e.actionType === "mark-resolved");
      } catch (_) {
        // If log is unreadable, don't claim resolved.
      }
    }
    if (allResolved && hasMarkResolvedTurn) {
      phase = "resolved";
    } else {
      phase = "turn-ready";
    }
  }

  // ── blocking issues ──
  const blockingIssues = [
    ...intakeResult.issues,
    ...loadsResult.issues,
    ...ledgerResult.issues,
  ];

  // ── nextCommands ──
  const baseCmd = `node scripts/investigator-artifacts.mjs`;
  const rootFlag = `--root ${root}`;
  const slugFlag = `--case-slug ${caseSlug}`;
  const nextCommands = [];

  if (phase === "no-case" || (!intakeResult.present && !intakeResult.pass)) {
    nextCommands.push(
      `${baseCmd} open-case ${rootFlag} ${slugFlag} --framing-json <path-to-framing-json> --proposed-load agents/investigator/prompt.md --proposed-load agents/investigator/harness.md`,
    );
  } else if (phase === "intake") {
    // Intake present but failing — show re-run with --force; approval requirement goes in blockingIssues.
    nextCommands.push(
      `${baseCmd} open-case ${rootFlag} ${slugFlag} --framing-json <path-to-framing-json> --proposed-load agents/investigator/prompt.md --proposed-load agents/investigator/harness.md --force`,
    );
    blockingIssues.push(
      "Replacing existing intake artifacts requires explicit user approval (repo policy: --force on open-case only when the user asked)",
    );
  } else if (phase === "loads") {
    const forceFlag = loadsResult.present ? " --force" : "";
    nextCommands.push(
      `${baseCmd} record-loads ${rootFlag} ${slugFlag} --loaded agents/investigator/prompt.md --loaded agents/investigator/harness.md${forceFlag}`,
    );
  } else if (phase === "journal-pending") {
    // journal-pending: no helper command can fix this — the agent must generate the
    // Step 3 discovery journal.  nextCommands stays empty.
  } else if (phase === "ledger-pending") {
    nextCommands.push(
      `${baseCmd} initialize-turn-ledger ${rootFlag} ${slugFlag}`,
    );
  } else if (phase === "turn-ready") {
    const actionList = [
      "continue-top-open",
      "investigate-different-claim",
      "request-user-evidence",
      "record-user-evidence",
      "add-evidence",
      "mark-resolved",
      "pause",
    ].join("|");
    nextCommands.push(
      `${baseCmd} run-turn ${rootFlag} ${slugFlag} --user-action <${actionList}> --journal-file <path-to-rendered-updated-journal> --turn-input-json <path-to-agent-owned-turn-fields>`,
    );
    nextCommands.push(
      `${baseCmd} begin-turn ${rootFlag} ${slugFlag} --user-action <${actionList}>`,
    );
  } else if (phase === "turn-open") {
    const pending = ledgerResult.pendingTurn;
    if (pending && pending.journalChangedSinceBegin) {
      // Journal changed — complete only; abandon is blocked.
      blockingIssues.push(
        "Pending turn requires repair: journal.md changed after begin-turn; complete the turn with a valid turn JSON or manually reconcile.",
      );
      nextCommands.push(
        `${baseCmd} complete-turn ${rootFlag} ${slugFlag} --turn-input-json <path-to-turn-input-json>`,
      );
    } else {
      nextCommands.push(
        `${baseCmd} complete-turn ${rootFlag} ${slugFlag} --turn-input-json <path-to-turn-input-json>`,
      );
      nextCommands.push(
        `${baseCmd} abandon-turn ${rootFlag} ${slugFlag} --reason "<why the turn was blocked before mutation>"`,
      );
    }
  }
  // phase === "resolved" → nextCommands stays empty.

  // ── nextActions ──
  // Agent-performed (non-helper-command) steps that must happen before the next
  // helper command can run.  Present in every response; usually empty.
  const nextActions = [];
  if (phase === "journal-pending") {
    nextActions.push(
      `Generate the Step 3 discovery journal per agents/investigator/harness.md, render the full journal to a temp file, then run \`node scripts/investigator-artifacts.mjs initialize-turn-ledger --root ${root} --case-slug ${caseSlug} --journal-file <temp-path>\` (one press: saves journal + initializes ledger). Alternatively run save-journal then initialize-turn-ledger as separate steps. Do not hand-edit the stub's Claims section to satisfy the ledger gate.`,
    );
  }

  return {
    operation: "status",
    caseSlug,
    phase,
    intake: intakeResult,
    loads: loadsResult,
    ledger: ledgerResult,
    journal: journalResult,
    blockingIssues,
    nextCommands,
    nextActions,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

function initializeTurnLedger(args) {
  const root = resolveRepoRoot(args.root);
  const verified = verifyCaseFiles(root, args.caseSlug);
  const paths = casePaths(root, args.caseSlug);

  // ── Read and validate --journal-file content FIRST if provided ──────────────
  // Spec: validate content before any write (fail-fast before loads gate).
  let journalContentFromFile = null;
  if (args.journalFile) {
    const journalFilePath = path.isAbsolute(args.journalFile)
      ? path.resolve(args.journalFile)
      : safeRepoPath(root, args.journalFile);
    const journalFileStat = fs.statSync(journalFilePath, { throwIfNoEntry: false });
    if (!journalFileStat || !journalFileStat.isFile()) {
      throw new Error(`--journal-file does not exist or is not a file: ${journalFilePath}`);
    }
    journalContentFromFile = fs.readFileSync(journalFilePath, "utf8");
    validateJournalContentForSave(journalContentFromFile);
  }

  // ── Check the on-disk journal (or supply --journal-file as a stand-in) ─────
  // When --journal-file is provided, the on-disk journal may still be a stub —
  // validate the file content, not the stub. Without --journal-file, the journal
  // must already be on disk and valid (original behavior).
  if (journalContentFromFile !== null) {
    // Validate the new content structurally (validateJournalContentForSave already ran above,
    // but verifyJournalContentHasClaimTable also checks status values — already included).
    // If the file content is valid, we'll write it after the loads gate passes.
  } else {
    try {
      verifyJournalHasClaimTable(paths.journalPath);
    } catch (err) {
      if (err.message.includes("missing claim table header") || err.message.includes("missing marker")) {
        throw new Error(
          `journal.md still contains the Step 1 stub (missing claim table). Generate the Step 3 discovery journal per agents/investigator/harness.md, render it to a temp file, and run save-journal to save it to ${paths.journalPath} first. Do not hand-edit the stub's Claims header to satisfy this gate.`,
        );
      }
      throw err;
    }
  }

  // Gate: Step 2 loads must be recorded and passing before the ledger can be initialized.
  // Fires unconditionally — including on --force re-initialization — so a weak agent
  // cannot learn that --force bypasses the gate.
  requirePassingLoads(root, args.caseSlug);

  // Pre-write guard: check for existing ledger before any journal write or mkdir.
  // Must run here so a no-force re-run with --journal-file throws without mutating anything.
  if (!args.force && (fs.existsSync(paths.turnLogPath) || fs.existsSync(paths.turnStatePath))) {
    throw new Error("turn ledger already exists; rerun initialize-turn-ledger with --force only to replace it");
  }

  // If --journal-file provided, write the journal now (after loads gate and ledger guard pass, before ledger init).
  if (journalContentFromFile !== null) {
    atomicWriteFile(paths.journalPath, journalContentFromFile);
    // Verify the written journal.
    verifyJournalHasClaimTable(paths.journalPath);
    if (!fs.readFileSync(paths.journalPath, "utf8").includes("## Resolution")) {
      throw new Error("journal.md readback missing ## Resolution; filesystem may be unreliable");
    }
  }

  fs.mkdirSync(paths.workflowDir, { recursive: true });

  const journalHash = sha256File(paths.journalPath);
  const nextTurnToken = makeTurnToken();
  const genesisEvent = {
    sequence: 0,
    type: "genesis",
    caseSlug: args.caseSlug,
    previousHash: null,
    turnToken: null,
    nextTurnToken,
    userAction: "initialize",
    activeHypothesis: null,
    actionType: "initialize",
    actionSummary: "Initialized investigator turn ledger from saved journal.",
    evidenceRefs: [],
    touchedClaims: [],
    journalHashBefore: journalHash,
    journalHashAfter: journalHash,
    allowedNext: DEFAULT_ALLOWED_NEXT,
    blockingIssues: [],
  };
  const latestTurnHash = hashTurnEvent(genesisEvent);
  const state = {
    caseSlug: args.caseSlug,
    currentSequence: 0,
    latestTurnHash,
    journalHash,
    nextTurnToken,
    pendingTurn: null,
    allowedNext: DEFAULT_ALLOWED_NEXT,
    blockingIssues: [],
  };

  atomicWriteFile(paths.turnLogPath, `${JSON.stringify(genesisEvent)}\n`);
  atomicWriteJson(paths.turnStatePath, state);
  readTurnState(paths);
  return { status: "pass", ...verified, turnLogPath: paths.turnLogPath, turnStatePath: paths.turnStatePath, state };
}

function beginTurn(args) {
  const root = resolveRepoRoot(args.root);
  verifyCaseFiles(root, args.caseSlug);
  const paths = casePaths(root, args.caseSlug);
  verifyJournalHasClaimTable(paths.journalPath);
  if (!args.userAction) throw new Error("--user-action is required for begin-turn");

  const state = readTurnState(paths);
  if (state.caseSlug !== args.caseSlug) {
    throw new Error(`${TURN_STATE_BASENAME} caseSlug does not match requested case`);
  }
  if (state.pendingTurn) {
    throw new Error("pendingTurn already exists; complete, repair, or abandon it before begin-turn");
  }
  if (!state.nextTurnToken) {
    throw new Error(`${TURN_STATE_BASENAME} missing nextTurnToken; reinitialize or repair the turn ledger`);
  }
  const allowedNext = normalizeAllowedNext(state.allowedNext);
  if (!allowedNext.includes(args.userAction)) {
    throw new Error(`user action is not allowed by current turn state: ${args.userAction}`);
  }

  const journalHashBefore = sha256File(paths.journalPath);
  if (state.journalHash && state.journalHash !== journalHashBefore) {
    throw new Error(`${TURN_STATE_BASENAME} journalHash does not match journal.md`);
  }
  const pendingTurn = {
    turnToken: state.nextTurnToken,
    userAction: args.userAction,
    journalHashBefore,
    sequence: Number(state.currentSequence) + 1,
    priorLatestTurnHash: state.latestTurnHash,
  };
  const nextState = {
    ...state,
    nextTurnToken: null,
    pendingTurn,
  };
  atomicWriteJson(paths.turnStatePath, nextState);
  return { status: "pass", caseSlug: args.caseSlug, turnStatePath: paths.turnStatePath, pendingTurn };
}

function abandonTurn(args) {
  const root = resolveRepoRoot(args.root);
  verifyCaseFiles(root, args.caseSlug);
  const paths = casePaths(root, args.caseSlug);
  verifyJournalHasClaimTable(paths.journalPath);
  const state = readTurnState(paths);
  const pending = state.pendingTurn;
  if (!pending) {
    throw new Error("no pendingTurn exists; nothing to abandon");
  }
  const journalHash = sha256File(paths.journalPath);
  if (journalHash !== pending.journalHashBefore) {
    throw new Error("cannot abandon pendingTurn after journal.md changed; complete the turn or manually reconcile the journal first");
  }
  const reason = String(args.reason || "").trim();
  if (!reason) {
    throw new Error("--reason is required for abandon-turn");
  }

  const nextState = {
    ...state,
    journalHash,
    nextTurnToken: pending.turnToken,
    pendingTurn: null,
    abandonedTurn: {
      sequence: pending.sequence,
      userAction: pending.userAction,
      reason,
      abandonedAt: new Date().toISOString(),
    },
  };
  atomicWriteJson(paths.turnStatePath, nextState);
  readTurnState(paths);
  return { status: "pass", caseSlug: args.caseSlug, turnStatePath: paths.turnStatePath, abandonedTurn: nextState.abandonedTurn, state: nextState };
}

function loadTurnInputForCompletion(root, args, paths, pending) {
  if (args.turnJson && args.turnInputJson) {
    throw new Error("provide only one of --turn-json or --turn-input-json");
  }
  if (!args.turnJson && !args.turnInputJson) {
    throw new Error("complete-turn requires --turn-json or --turn-input-json");
  }
  if (args.turnJson) {
    return loadJson(root, args.turnJson, "--turn-json");
  }
  const input = loadJson(root, args.turnInputJson, "--turn-input-json");
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("turn input JSON must be an object");
  }
  const suppliedHelperFields = HELPER_OWNED_TURN_FIELDS.filter((field) => Object.prototype.hasOwnProperty.call(input, field));
  if (suppliedHelperFields.length) {
    throw new Error(`turn input must not include helper-owned fields: ${suppliedHelperFields.join(", ")}`);
  }
  return {
    ...input,
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    journalHashBefore: pending.journalHashBefore,
    journalHashAfter: sha256File(paths.journalPath),
  };
}

function completeTurn(args) {
  const root = resolveRepoRoot(args.root);
  verifyCaseFiles(root, args.caseSlug);
  const paths = casePaths(root, args.caseSlug);
  verifyJournalHasClaimTable(paths.journalPath);
  const state = readTurnState(paths);
  const pending = state.pendingTurn;
  if (!pending) {
    throw new Error("no pendingTurn exists; run begin-turn before complete-turn");
  }
  const turnInput = loadTurnInputForCompletion(root, args, paths, pending);

  const actionType = String(turnInput.actionType || "").trim();
  if (!actionType) throw new Error("turn-json actionType is required");
  validateActionType(actionType);
  const priorEvents = fs.existsSync(paths.turnLogPath) ? readJsonl(paths.turnLogPath) : [];
  const blockingIssues = normalizeBlockingIssues(turnInput.blockingIssues);
  if (blockingIssues.length) {
    throw new Error(`turn-json contains blocking issues: ${blockingIssues.join("; ")}`);
  }
  if (turnInput.turnToken !== pending.turnToken) {
    throw new Error("turn-json turnToken does not match pendingTurn");
  }
  if (turnInput.sequence !== pending.sequence) {
    throw new Error("turn-json sequence does not match pendingTurn");
  }
  if (turnInput.previousHash !== pending.priorLatestTurnHash) {
    throw new Error("turn-json previousHash does not match pendingTurn");
  }
  if (turnInput.userAction !== pending.userAction) {
    throw new Error("turn-json userAction does not match pendingTurn");
  }
  if (turnInput.journalHashBefore !== undefined && turnInput.journalHashBefore !== pending.journalHashBefore) {
    throw new Error("turn-json journalHashBefore does not match pendingTurn");
  }

  const journalHashAfter = sha256File(paths.journalPath);
  if (requiresTouchedClaims(actionType) && journalHashAfter === pending.journalHashBefore) {
    throw new Error("journal.md hash did not change for investigative action");
  }
  if (turnInput.journalHashAfter !== undefined && turnInput.journalHashAfter !== journalHashAfter) {
    throw new Error("turn-json journalHashAfter does not match journal.md");
  }
  if (requiresTouchedClaims(actionType) && (!Array.isArray(turnInput.touchedClaims) || turnInput.touchedClaims.length === 0)) {
    throw new Error("turn-json touchedClaims is required for investigative actions");
  }
  const queryPatterns = validateQueryRequest(root, turnInput, actionType);
  const evidenceRequest = validateUserEvidenceRequest(turnInput, actionType);
  // Validate and resolve touched claims so short H-tags expand to their full cell text.
  let resolvedTouchedClaims = asArray(turnInput.touchedClaims);
  if (requiresTouchedClaims(actionType)) {
    resolvedTouchedClaims = validateTouchedClaimsExist(paths.journalPath, turnInput.touchedClaims, "complete-turn");
  }
  validateEvidenceHandoffTurn(paths.journalPath, turnInput, actionType);
  validateMarkResolved(paths.journalPath, turnInput, actionType, priorEvents);
  const completionGate = normalizeCompletionGate(turnInput, actionType);

  const allowedNext = normalizeAllowedNext(turnInput.allowedNext || DEFAULT_ALLOWED_NEXT);
  const nextTurnToken = makeTurnToken();
  const event = {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    nextTurnToken,
    userAction: pending.userAction,
    activeHypothesis: turnInput.activeHypothesis ?? null,
    actionType,
    actionSummary: fieldValue(turnInput.actionSummary, "not specified"),
    evidenceRefs: asArray(turnInput.evidenceRefs),
    touchedClaims: resolvedTouchedClaims,
    queryPatterns,
    evidenceRequest,
    completionGate,
    journalHashBefore: pending.journalHashBefore,
    journalHashAfter,
    allowedNext,
    blockingIssues: [],
  };
  const latestTurnHash = hashTurnEvent(event);
  appendJsonl(paths.turnLogPath, event);
  const nextState = {
    caseSlug: args.caseSlug,
    currentSequence: event.sequence,
    latestTurnHash,
    journalHash: journalHashAfter,
    nextTurnToken,
    pendingTurn: null,
    allowedNext,
    blockingIssues: [],
  };
  atomicWriteJson(paths.turnStatePath, nextState);
  readTurnState(paths);
  return { status: "pass", caseSlug: args.caseSlug, turnLogPath: paths.turnLogPath, turnStatePath: paths.turnStatePath, event, state: nextState };
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

const BARE_TELEMETRY_KEYWORDS = new Set([
  "log", "logs", "lss", "nss", "siem", "splunk", "syslog", "weblog", "log4j",
  "pcap", "telemetry", "metric", "metrics", "trace", "event", "events",
]);

// userFlaggedSpecifics entries are usually identifiers (hostnames, IDs, domains)
// whose substrings must not count as telemetry context (e.g. log.example.invalid).
// Multi-word phrases ("LSS shows connector status log gap") and bare telemetry
// keywords are genuine framing context and do count.
function telemetryFlaggedSpecifics(framing) {
  return asArray(framing.userFlaggedSpecifics).filter((token) => {
    const value = String(token).trim();
    if (/\s/.test(value)) return true;
    return BARE_TELEMETRY_KEYWORDS.has(value.toLowerCase());
  });
}

function hasLogContext(framing) {
  if (asArray(framing.evidencePaths).length > 0) return true;

  const fields = [
    framing.symptom,
    framing.scope,
    framing.whatWorks,
    framing.alreadyTried,
    framing.recency,
    ...telemetryFlaggedSpecifics(framing),
  ];
  const haystack = fields.join(" ").toLowerCase();
  const separatedLogToken = /(^|[\s/_.:;()[\],])logs?($|[\s/_.:;()[\],])/;
  const telemetryToken = /\b(siem|lss|nss|splunk|syslog|weblog|log4j|evidence|events?|trace|packet|pcap|metric|metrics|telemetry)\b/;
  return separatedLogToken.test(haystack) || telemetryToken.test(haystack);
}

function isTelemetryReferencePath(relativePath) {
  return /^references\/(zia|zpa|zcc)\/logs\/.+\.md$/.test(relativePath);
}

function caseIntakeStatus(framing, proposedLoads, root = null) {
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
  if (root) {
    for (const load of proposedLoads) {
      if (!fs.existsSync(safeRepoPath(root, load))) {
        issues.push(`proposed load does not exist: ${load}`);
      }
    }
  }
  if (proposedLoads.some(isTelemetryReferencePath) && !hasLogContext(framing)) {
    issues.push("telemetry proposed loads require log, metric, SIEM, or evidence context in the framing (checked: symptom, scope, whatWorks, alreadyTried, recency, evidencePaths, and phrase-form or bare-keyword userFlaggedSpecifics; bare host/ID tokens do not count)");
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

function basicUtcTimestamp(capturedAt) {
  const text = String(capturedAt || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(text)) {
    throw new Error("capturedAt must be an ISO 8601 UTC timestamp ending in Z");
  }
  const date = new Date(text);
  const normalizedInput = text.replace(/\.000Z$/, "Z");
  const normalizedParsed = date.toISOString().replace(/\.000Z$/, "Z");
  if (Number.isNaN(date.getTime()) || normalizedParsed !== normalizedInput) {
    throw new Error(`capturedAt is not a valid UTC timestamp: ${text}`);
  }
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function slugPart(value, label) {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) throw new Error(`${label} must contain at least one alphanumeric character`);
  if (slug.length > MAX_EVIDENCE_SLUG_PART_LENGTH) {
    throw new Error(`${label} slug is too long; maximum ${MAX_EVIDENCE_SLUG_PART_LENGTH} characters`);
  }
  return slug;
}

function markdownCell(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function displayPath(root, filePath) {
  const relative = path.relative(root, filePath);
  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
    return relative;
  }
  return filePath;
}

function resolveReadableFile(root, filePath, label) {
  if (!filePath || String(filePath).includes("\0")) {
    throw new Error(`${label} is required`);
  }
  const resolved = path.isAbsolute(filePath)
    ? path.resolve(filePath)
    : safeRepoPath(root, filePath);
  const stat = fs.statSync(resolved, { throwIfNoEntry: false });
  if (!stat || !stat.isFile()) {
    throw new Error(`${label} does not exist or is not a file: ${resolved}`);
  }
  return resolved;
}

function normalizeQueryRef(root, item) {
  if (item.queryFile) {
    const queryFile = resolveReadableFile(root, item.queryFile, "queryFile");
    const queryRef = displayPath(root, queryFile);
    if (path.isAbsolute(queryRef)) {
      throw new Error("queryFile must be inside the repository; use query or requestText for external queries");
    }
    validateConcreteQueryMetadata(fs.readFileSync(queryFile, "utf8"), item);
    return queryRef;
  }
  const query = String(item.query ?? "").trim();
  if (query) {
    validateConcreteQueryMetadata(query, item);
    return query;
  }
  const requestText = String(item.requestText ?? "").trim();
  if (requestText) {
    validateConcreteQueryMetadata(requestText, item);
    return requestText;
  }
  const queryRef = String(item.queryRef ?? "").trim();
  if (queryRef) {
    validateConcreteQueryMetadata(queryRef, item);
    return queryRef;
  }
  throw new Error("evidence item must include queryFile, query, requestText, or queryRef");
}

function validateConcreteQueryMetadata(text, item) {
  if (item.allowPlaceholderQuery === true) return;
  const value = String(text || "");
  const placeholderPatterns = [
    /\$INDEX(?:_[A-Z0-9_]+|\b)/i,
    /<\s*your[-_\s][^>]*>/i,
    /\bindex\s*=\s*(?:$|[|\s])/i,
    /\bsourcetype\s*=\s*(?:$|[|\s])/i,
  ];
  if (placeholderPatterns.some((pattern) => pattern.test(value))) {
    throw new Error("query/request metadata contains unresolved SIEM placeholder; replace it or use allowPlaceholderQuery only for invalidated/corrective evidence");
  }
}

function normalizeEvidenceItems(root, args) {
  if (args.inputJson) {
    const input = loadJson(root, args.inputJson, "--input-json");
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new Error("input JSON must be an object");
    }
    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new Error("input JSON must include a non-empty items array");
    }
    return input.items.map((item) => ({
      activeHypothesis: item.activeHypothesis ?? input.activeHypothesis,
      ...item,
    }));
  }
  return [{
    sourceFile: args.sourceFile,
    name: args.name,
    source: args.source,
    query: args.query,
    queryFile: args.queryFile,
    requestText: args.requestText,
    allowPlaceholderQuery: args.allowPlaceholderQuery,
    summary: args.summary,
    capturedAt: args.capturedAt,
    touchedClaims: args.touchedClaims,
    activeHypothesis: args.activeHypothesis,
  }];
}

function ensureManifestHeader(manifestPath) {
  const header = "| Evidence Ref | Source | Captured At | Source File Hash | Query/Request Ref | Summary | Touched Claims |\n|---|---|---|---|---|---|---|\n";
  if (!fs.existsSync(manifestPath) || fs.readFileSync(manifestPath, "utf8").trim() === "") {
    atomicWriteFile(manifestPath, header);
    return;
  }
  const manifest = fs.readFileSync(manifestPath, "utf8");
  if (!manifest.includes("| Evidence Ref | Source | Captured At | Source File Hash | Query/Request Ref | Summary | Touched Claims |")) {
    throw new Error(`${EVIDENCE_MANIFEST_BASENAME} does not use the expected evidence manifest schema`);
  }
}

function importEvidence(args) {
  const root = resolveRepoRoot(args.root);
  verifyCaseFiles(root, args.caseSlug);
  const paths = casePaths(root, args.caseSlug);
  verifyJournalHasClaimTable(paths.journalPath);
  const state = readTurnState(paths);
  const pending = state.pendingTurn;
  if (!pending) {
    throw new Error("import-evidence requires an open pendingTurn; run begin-turn first");
  }

  fs.mkdirSync(paths.evidenceDir, { recursive: true });
  const rawItems = normalizeEvidenceItems(root, args);
  const prepared = [];
  const destinations = new Set();
  for (const [index, item] of rawItems.entries()) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`evidence item ${index + 1} must be an object`);
    }
    const sourceFile = resolveReadableFile(root, item.sourceFile, "sourceFile");
    const source = String(item.source || "").trim();
    if (!source) throw new Error(`evidence item ${index + 1} source is required`);
    const name = String(item.name || "").trim();
    if (!name) throw new Error(`evidence item ${index + 1} name is required`);
    const summary = String(item.summary || "").trim();
    if (!summary) throw new Error(`evidence item ${index + 1} summary is required`);
    const capturedAt = String(item.capturedAt || "").trim();
    const capturedAtBasic = basicUtcTimestamp(capturedAt);
    const touchedClaims = validateTouchedClaimsExist(paths.journalPath, item.touchedClaims, `evidence item ${index + 1}`);
    const queryRef = normalizeQueryRef(root, item);
    const sourceFileHash = sha256File(sourceFile);
    const ext = path.extname(sourceFile).toLowerCase();
    const filename = `${slugPart(source, "source")}-${slugPart(name, "name")}-${capturedAtBasic}${ext}`;
    const destination = path.join(paths.evidenceDir, filename);
    if (!destination.startsWith(`${paths.evidenceDir}${path.sep}`)) {
      throw new Error("computed evidence destination escapes evidence directory");
    }
    if (destinations.has(destination)) {
      throw new Error(`duplicate evidence destination in input: ${filename}`);
    }
    if (fs.existsSync(destination)) {
      throw new Error(`evidence destination already exists: ${destination}`);
    }
    destinations.add(destination);
    const evidenceRef = path.join("_data", "cases", args.caseSlug, EVIDENCE_DIR_BASENAME, filename);
    const manifestRow = `| ${markdownCell(evidenceRef)} | ${markdownCell(source)} | ${markdownCell(capturedAt)} | ${markdownCell(sourceFileHash)} | ${markdownCell(queryRef)} | ${markdownCell(summary)} | ${markdownCell(touchedClaims.join("; "))} |`;
    prepared.push({
      sourceFile,
      destination,
      evidenceRef,
      source,
      name,
      capturedAt,
      sourceFileHash,
      queryRef,
      summary,
      touchedClaims,
      activeHypothesis: item.activeHypothesis ?? null,
      manifestRow,
    });
  }

  ensureManifestHeader(paths.evidenceManifestPath);
  const copied = [];
  try {
    for (const item of prepared) {
      fs.copyFileSync(item.sourceFile, item.destination, fs.constants.COPYFILE_EXCL);
      copied.push(item.destination);
    }
    fs.appendFileSync(paths.evidenceManifestPath, `${prepared.map((item) => item.manifestRow).join("\n")}\n`, "utf8");
  } catch (error) {
    for (const destination of copied) {
      fs.rmSync(destination, { force: true });
    }
    throw error;
  }

  return {
    status: "ok",
    operation: "import-evidence",
    evidenceRefs: prepared.map((item) => item.evidenceRef),
    manifestPath: path.join("_data", "cases", args.caseSlug, EVIDENCE_DIR_BASENAME, EVIDENCE_MANIFEST_BASENAME),
    manifestRows: prepared.map((item) => item.manifestRow),
    turnJsonPath: null,
    warnings: [],
    pendingTurn: {
      sequence: pending.sequence,
      turnToken: pending.turnToken,
      userAction: pending.userAction,
    },
    items: prepared.map((item) => ({
      evidenceRef: item.evidenceRef,
      sourceFileHash: item.sourceFileHash,
      source: item.source,
      capturedAt: item.capturedAt,
      touchedClaims: item.touchedClaims,
      activeHypothesis: item.activeHypothesis,
    })),
  };
}

// ── validateJournalContentForSave (shared by saveJournal and runTurn) ─────────
//
// Single-source predicate for journal content.  Every marker checked here is
// derived from the same REQUIRED_JOURNAL_MARKERS constant that verifyCaseFiles
// uses, plus the canonical claim-table header checked by
// verifyJournalContentHasClaimTable.  The two can never drift apart.
//
// The saved file always keeps the stub's full section skeleton:
//   # Discovery Journal - <issue>
//   ## Framing, ## Proposed Loads, ## Claims (with canonical table), ## Resolution
// The chat turn shape (Issue / claims table / Next step) is NOT the file shape.
// See "Journal file template" in agents/investigator/harness.md Step 3 Details.

function validateJournalContentForSave(content) {
  // Collect ALL missing markers in one pass so the error names all of them.
  const missingMarkers = REQUIRED_JOURNAL_MARKERS.filter((marker) => !content.includes(marker));
  const missingClaimTable = !content.includes(REQUIRED_CLAIM_TABLE_HEADER);

  if (missingMarkers.length > 0 || missingClaimTable) {
    const parts = [];
    if (missingMarkers.length > 0) {
      parts.push(missingMarkers.join(", "));
    }
    if (missingClaimTable) {
      parts.push(`canonical claim table header (${REQUIRED_CLAIM_TABLE_HEADER})`);
    }
    throw new Error(
      `journal content missing required sections: ${parts.join(", ")}. The saved journal file keeps the stub's full shape (# Discovery Journal heading, ## Framing, ## Proposed Loads, ## Claims with the canonical table, ## Resolution) — see the journal file template in agents/investigator/harness.md. The chat turn shape and the saved file shape are not the same.`,
    );
  }
  // Full claim table structural validation (validates status values, etc.).
  verifyJournalContentHasClaimTable(content);
}

// ── runTurn: atomic begin + journal save + complete ───────────────────────────

function runTurn(args) {
  const root = resolveRepoRoot(args.root);
  verifyCaseFiles(root, args.caseSlug);
  const paths = casePaths(root, args.caseSlug);

  if (!args.userAction) throw new Error("--user-action is required for run-turn");
  if (!args.journalFile) throw new Error("--journal-file is required for run-turn");
  if (!args.turnInputJson) throw new Error("--turn-input-json is required for run-turn");

  // ── Phase 1: validate everything BEFORE any write ─────────────────────────

  // 1a. Read current state and refuse if pendingTurn already open.
  const state = readTurnState(paths);
  if (state.caseSlug !== args.caseSlug) {
    throw new Error(`${TURN_STATE_BASENAME} caseSlug does not match requested case`);
  }
  if (state.pendingTurn) {
    throw new Error(
      `a pending turn is already open (sequence ${state.pendingTurn.sequence}); run status and follow its nextCommands to complete, repair, or abandon it before run-turn`,
    );
  }
  if (!state.nextTurnToken) {
    throw new Error(`${TURN_STATE_BASENAME} missing nextTurnToken; reinitialize or repair the turn ledger`);
  }
  const allowedNext = normalizeAllowedNext(state.allowedNext);
  if (!allowedNext.includes(args.userAction)) {
    throw new Error(`user action is not allowed by current turn state: ${args.userAction}`);
  }

  // 1b. Read and validate the turn input JSON.
  const rawTurnInput = loadJson(root, args.turnInputJson, "--turn-input-json");
  if (!rawTurnInput || typeof rawTurnInput !== "object" || Array.isArray(rawTurnInput)) {
    throw new Error("turn input JSON must be an object");
  }
  const suppliedHelperFields = HELPER_OWNED_TURN_FIELDS.filter(
    (field) => Object.prototype.hasOwnProperty.call(rawTurnInput, field),
  );
  if (suppliedHelperFields.length) {
    throw new Error(`turn input must not include helper-owned fields: ${suppliedHelperFields.join(", ")}`);
  }
  const actionType = String(rawTurnInput.actionType || "").trim();
  if (!actionType) throw new Error("turn-json actionType is required");
  validateActionType(actionType);
  const blockingIssues = normalizeBlockingIssues(rawTurnInput.blockingIssues);
  if (blockingIssues.length) {
    throw new Error(`turn-json contains blocking issues: ${blockingIssues.join("; ")}`);
  }

  // 1c. Read and validate the new journal content from --journal-file.
  const journalFilePath = path.isAbsolute(args.journalFile)
    ? path.resolve(args.journalFile)
    : safeRepoPath(root, args.journalFile);
  const journalFileStat = fs.statSync(journalFilePath, { throwIfNoEntry: false });
  if (!journalFileStat || !journalFileStat.isFile()) {
    throw new Error(`--journal-file does not exist or is not a file: ${journalFilePath}`);
  }
  const newJournalContent = fs.readFileSync(journalFilePath, "utf8");
  validateJournalContentForSave(newJournalContent);

  // 1d. Verify the on-disk journal is valid (begin-turn would also check this).
  verifyJournalHasClaimTable(paths.journalPath);

  // 1e. Compute journalHashBefore (hash of current on-disk journal — what begin-turn would have captured).
  const journalHashBefore = sha256File(paths.journalPath);
  if (state.journalHash && state.journalHash !== journalHashBefore) {
    throw new Error(`${TURN_STATE_BASENAME} journalHash does not match journal.md`);
  }

  // 1f. Build the pending turn context (as begin-turn would).
  const sequence = Number(state.currentSequence) + 1;
  const turnToken = state.nextTurnToken;
  const priorLatestTurnHash = state.latestTurnHash;

  // 1g. Compute journalHashAfter from the new content.
  const newJournalHash = `sha256:${crypto.createHash("sha256").update(newJournalContent).digest("hex")}`;

  // 1h. journal must change for investigative actions.
  if (requiresTouchedClaims(actionType) && newJournalHash === journalHashBefore) {
    throw new Error("journal.md hash did not change for investigative action");
  }

  // 1i. Run all completion validations against the NEW journal content.
  const priorEvents = fs.existsSync(paths.turnLogPath) ? readJsonl(paths.turnLogPath) : [];
  if (requiresTouchedClaims(actionType) && (!Array.isArray(rawTurnInput.touchedClaims) || rawTurnInput.touchedClaims.length === 0)) {
    throw new Error("turn-json touchedClaims is required for investigative actions");
  }
  const queryPatterns = validateQueryRequest(root, rawTurnInput, actionType);
  const evidenceRequest = validateUserEvidenceRequest(rawTurnInput, actionType);
  // Validate touched claims against the NEW journal content, not the old on-disk journal.
  // Capture resolved claims so short H-tags (e.g. "H1") expand to their full cell text.
  let resolvedTouchedClaims = asArray(rawTurnInput.touchedClaims);
  if (requiresTouchedClaims(actionType)) {
    resolvedTouchedClaims = validateTouchedClaimsExist(paths.journalPath, rawTurnInput.touchedClaims, "run-turn", newJournalContent);
  }
  validateEvidenceHandoffTurn(paths.journalPath, rawTurnInput, actionType, newJournalContent);
  validateMarkResolved(paths.journalPath, rawTurnInput, actionType, priorEvents, newJournalContent);

  // ── Phase 2: all validations passed — write atomically ───────────────────

  // 2a. Write the new journal atomically.
  atomicWriteFile(paths.journalPath, newJournalContent);

  // 2b. Build and append the turn event.
  const completionGate = normalizeCompletionGate(rawTurnInput, actionType);
  const allowedNextOut = normalizeAllowedNext(rawTurnInput.allowedNext || DEFAULT_ALLOWED_NEXT);
  const nextTurnToken = makeTurnToken();
  const event = {
    sequence,
    previousHash: priorLatestTurnHash,
    turnToken,
    nextTurnToken,
    userAction: args.userAction,
    activeHypothesis: rawTurnInput.activeHypothesis ?? null,
    actionType,
    actionSummary: fieldValue(rawTurnInput.actionSummary, "not specified"),
    evidenceRefs: asArray(rawTurnInput.evidenceRefs),
    touchedClaims: resolvedTouchedClaims,
    queryPatterns,
    evidenceRequest,
    completionGate,
    journalHashBefore,
    journalHashAfter: newJournalHash,
    allowedNext: allowedNextOut,
    blockingIssues: [],
  };
  const latestTurnHash = hashTurnEvent(event);
  appendJsonl(paths.turnLogPath, event);

  // 2c. Update turn state.
  const nextState = {
    caseSlug: args.caseSlug,
    currentSequence: sequence,
    latestTurnHash,
    journalHash: newJournalHash,
    nextTurnToken,
    pendingTurn: null,
    allowedNext: allowedNextOut,
    blockingIssues: [],
  };
  atomicWriteJson(paths.turnStatePath, nextState);
  readTurnState(paths);

  return {
    status: "pass",
    operation: "run-turn",
    caseSlug: args.caseSlug,
    journalPath: paths.journalPath,
    journalHash: newJournalHash,
    turnLogPath: paths.turnLogPath,
    turnStatePath: paths.turnStatePath,
    event,
    state: nextState,
  };
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
  const missingJournalMarkers = REQUIRED_JOURNAL_MARKERS.filter((marker) => !journalMd.includes(marker));
  if (missingJournalMarkers.length > 0) {
    throw new Error(`journal.md missing marker: ${missingJournalMarkers.join(", ")}`);
  }
  if (caseIntakeJson.status !== "pass" || !Array.isArray(caseIntakeJson.blockingIssues) || caseIntakeJson.blockingIssues.length) {
    throw new Error(`${CASE_INTAKE_BASENAME}.json does not describe a passing case intake`);
  }
  const recomputed = caseIntakeStatus(
    caseIntakeJson.framing || {},
    normalizeProposedLoads(caseIntakeJson.proposedLoads || []),
    root,
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
  const { status, blockingIssues } = caseIntakeStatus(framing, proposedLoads, root);

  const caseDir = path.join(root, "_data", "cases", args.caseSlug);
  const caseIntakePath = path.join(caseDir, `${CASE_INTAKE_BASENAME}.md`);
  const caseIntakeJsonPath = path.join(caseDir, `${CASE_INTAKE_BASENAME}.json`);
  const journalPath = path.join(caseDir, "journal.md");
  const timestamp = new Date().toISOString();
  const nextStep = status === "pass"
    ? "Load only the proposed files (open-case already verified this intake)."
    : "Resolve the blocking issue, then rerun open-case.";

  fs.mkdirSync(caseDir, { recursive: true });
  const existingArtifacts = [caseIntakePath, caseIntakeJsonPath, journalPath]
    .filter((artifactPath) => fs.existsSync(artifactPath));
  if (existingArtifacts.length && !args.force) {
    // Allow overwriting a blocked intake without --force — that IS the repair path.
    let existingIntakeIsBlocked = false;
    try {
      const existingIntakeMd = fs.readFileSync(caseIntakePath, "utf8");
      existingIntakeIsBlocked = /^Status: blocked$/m.test(existingIntakeMd);
    } catch (_) {
      // Unreadable or missing — treat as not-blocked; fall through to refusal.
    }
    if (!existingIntakeIsBlocked) {
      throw new Error(
        `case artifacts already exist with a passing intake; use verify-case to resume, or rerun open-case with --force only if the user asked to replace them; to start a NEW investigation, choose a different --case-slug: ${existingArtifacts.join(", ")}`,
      );
    }
    // existingIntakeIsBlocked — allow the overwrite silently.
  }

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

function saveJournal(args) {
  const root = resolveRepoRoot(args.root);

  // Slug safety + case dir existence check (cheapest gate).
  assertSafeSlug(args.caseSlug);
  const paths = casePaths(root, args.caseSlug);
  if (!fs.existsSync(paths.caseIntakePath) || !fs.existsSync(paths.caseIntakeJsonPath)) {
    throw new Error(
      `case directory not found or missing intake artifacts for slug: ${args.caseSlug}`,
    );
  }

  // Resolve and read the content file (absolute paths are accepted — runtimes stage to /tmp).
  if (!args.contentFile || String(args.contentFile).includes("\0")) {
    throw new Error("--content-file is required");
  }
  const contentFilePath = path.isAbsolute(args.contentFile)
    ? path.resolve(args.contentFile)
    : safeRepoPath(root, args.contentFile);
  const contentStat = fs.statSync(contentFilePath, { throwIfNoEntry: false });
  if (!contentStat || !contentStat.isFile()) {
    throw new Error(`--content-file does not exist or is not a file: ${contentFilePath}`);
  }
  const content = fs.readFileSync(contentFilePath, "utf8");

  // Validate the journal content BEFORE writing.
  validateJournalContentForSave(content);

  // Write atomically to the case journal path.
  atomicWriteFile(paths.journalPath, content);

  // Read back and re-verify.
  verifyJournalHasClaimTable(paths.journalPath);
  if (!fs.readFileSync(paths.journalPath, "utf8").includes("## Resolution")) {
    throw new Error("journal.md readback missing ## Resolution; filesystem may be unreliable");
  }

  const bytesWritten = Buffer.byteLength(content, "utf8");
  const journalHash = sha256File(paths.journalPath);

  return {
    status: "pass",
    operation: "save-journal",
    caseSlug: args.caseSlug,
    journalPath: paths.journalPath,
    bytesWritten,
    journalHash,
  };
}

function capabilities() {
  return {
    status: "ok",
    operation: "capabilities",
    version: HELPER_VERSION,
    supported: SUPPORTED_OPERATIONS,
    supportedOptions: SUPPORTED_OPTIONS,
  };
}

function main() {
  try {
    const args = parseArgs(process.argv);
    if (args.command === "capabilities") {
      process.stdout.write(`${JSON.stringify(capabilities(), null, 2)}\n`);
      return;
    }
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
    if (args.command === "record-loads") {
      const result = recordLoads(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      process.exit(result.status === "pass" ? 0 : 2);
    }
    if (args.command === "verify-loads") {
      const root = resolveRepoRoot(args.root);
      const result = verifyLoads(root, args.caseSlug);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      process.exit(result.status === "pass" ? 0 : 2);
    }
    if (args.command === "status") {
      const result = caseStatus(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "initialize-turn-ledger") {
      const result = initializeTurnLedger(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "begin-turn") {
      const result = beginTurn(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "abandon-turn") {
      const result = abandonTurn(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "complete-turn") {
      const result = completeTurn(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "import-evidence") {
      const result = importEvidence(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "save-journal") {
      const result = saveJournal(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (args.command === "run-turn") {
      const result = runTurn(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      process.exit(0);
    }
    usage(1);
  } catch (error) {
    if (process.argv[2] === "import-evidence") {
      process.stderr.write(`${JSON.stringify({
        status: "error",
        operation: "import-evidence",
        completed: [],
        failed: ["validation-or-import"],
        repair: error.message,
        warnings: [],
      }, null, 2)}\n`);
      process.exit(1);
    }
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
  capabilities,
  loadsStatus,
  recordLoads,
  verifyLoads,
  initializeTurnLedger,
  beginTurn,
  abandonTurn,
  completeTurn,
  importEvidence,
  saveJournal,
  runTurn,
  caseStatus,
  // Exported for drift-guard tests only — do not use in application code.
  REQUIRED_JOURNAL_MARKERS,
  validateJournalContentForSave,
};
