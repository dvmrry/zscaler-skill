#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";

const CASE_INTAKE_BASENAME = "case-intake";
const WORKFLOW_DIR = "workflow";
const TURN_LOG_BASENAME = "02-turns.jsonl";
const TURN_STATE_BASENAME = "02-turn-state.json";
const EVIDENCE_DIR_BASENAME = "evidence";
const EVIDENCE_MANIFEST_BASENAME = "MANIFEST.md";
const HELPER_VERSION = "0.2.0";
const SUPPORTED_OPERATIONS = [
  "open-case",
  "verify-case",
  "initialize-turn-ledger",
  "begin-turn",
  "complete-turn",
  "abandon-turn",
  "import-evidence",
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
  node scripts/investigator-artifacts.mjs initialize-turn-ledger --root <repo> --case-slug <slug> [--force]
  node scripts/investigator-artifacts.mjs begin-turn --root <repo> --case-slug <slug> --user-action <action>
  node scripts/investigator-artifacts.mjs complete-turn --root <repo> --case-slug <slug> --turn-json <file>
  node scripts/investigator-artifacts.mjs abandon-turn --root <repo> --case-slug <slug> --reason <text>
  node scripts/investigator-artifacts.mjs capabilities
  node scripts/investigator-artifacts.mjs import-evidence --root <repo> --case-slug <slug> --source-file <file> --name <name> --source <source> (--query <text>|--query-file <file>|--request-text <text>) --summary <text> --captured-at <ISO-UTC> --touched-claim <claim> [--active-hypothesis <tag>]
  node scripts/investigator-artifacts.mjs import-evidence --root <repo> --case-slug <slug> --input-json <file>

Creates and verifies _data/cases/<slug>/case-intake.md,
case-intake.json, journal.md, and optional workflow turn state.
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
    } else if (key === "--force") {
      args.force = true;
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

function verifyJournalHasClaimTable(journalPath) {
  const journal = fs.readFileSync(journalPath, "utf8");
  if (!journal.includes("# Discovery Journal")) {
    throw new Error("journal.md missing marker: # Discovery Journal");
  }
  if (!journal.includes(REQUIRED_CLAIM_TABLE_HEADER)) {
    throw new Error("journal.md missing claim table header");
  }
  const lines = journal.split(/\r?\n/);
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

function journalClaimStatuses(journalPath) {
  const journal = fs.readFileSync(journalPath, "utf8");
  const statuses = new Map();
  const lines = journal.split(/\r?\n/);
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

function validateActionType(actionType) {
  if (!VALID_ACTION_TYPES.has(actionType)) {
    throw new Error(`turn-json actionType is not allowed: ${actionType}`);
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

function validateMarkResolved(journalPath, turnInput, actionType, priorEvents) {
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

  const statuses = journalClaimStatuses(journalPath);
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

function validateEvidenceHandoffTurn(journalPath, turnInput, actionType) {
  if (!EVIDENCE_REQUEST_ACTION_TYPES.has(actionType)) return;
  const statuses = journalClaimStatuses(journalPath);
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

function validateTouchedClaimsExist(journalPath, touchedClaims, context) {
  const claims = asArray(touchedClaims).map((claim) => claim.trim()).filter(Boolean);
  if (claims.length === 0) {
    throw new Error(`${context} must include at least one touched claim`);
  }
  const statuses = journalClaimStatuses(journalPath);
  for (const claim of claims) {
    if (!statuses.has(claim)) {
      throw new Error(`${context} touched claim is not present in journal.md: ${claim}`);
    }
  }
  return claims;
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

function initializeTurnLedger(args) {
  const root = resolveRepoRoot(args.root);
  const verified = verifyCaseFiles(root, args.caseSlug);
  const paths = casePaths(root, args.caseSlug);
  verifyJournalHasClaimTable(paths.journalPath);

  fs.mkdirSync(paths.workflowDir, { recursive: true });
  if (!args.force && (fs.existsSync(paths.turnLogPath) || fs.existsSync(paths.turnStatePath))) {
    throw new Error("turn ledger already exists; rerun initialize-turn-ledger with --force only to replace it");
  }

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

function completeTurn(args) {
  const root = resolveRepoRoot(args.root);
  verifyCaseFiles(root, args.caseSlug);
  const paths = casePaths(root, args.caseSlug);
  verifyJournalHasClaimTable(paths.journalPath);
  const turnInput = loadJson(root, args.turnJson, "--turn-json");
  const state = readTurnState(paths);
  const pending = state.pendingTurn;
  if (!pending) {
    throw new Error("no pendingTurn exists; run begin-turn before complete-turn");
  }

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
    touchedClaims: asArray(turnInput.touchedClaims),
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
    return displayPath(root, queryFile);
  }
  const query = String(item.query ?? "").trim();
  if (query) return query;
  const requestText = String(item.requestText ?? "").trim();
  if (requestText) return requestText;
  const queryRef = String(item.queryRef ?? "").trim();
  if (queryRef) return queryRef;
  throw new Error("evidence item must include queryFile, query, requestText, or queryRef");
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
  readTurnState(paths);

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
    ? "Run verify-case, then load only the proposed files."
    : "Resolve the blocking issue, then rerun open-case.";

  fs.mkdirSync(caseDir, { recursive: true });
  const existingArtifacts = [caseIntakePath, caseIntakeJsonPath, journalPath]
    .filter((artifactPath) => fs.existsSync(artifactPath));
  if (existingArtifacts.length && !args.force) {
    throw new Error(
      `case artifacts already exist; use verify-case or rerun open-case with --force: ${existingArtifacts.join(", ")}`,
    );
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

function main() {
  try {
    const args = parseArgs(process.argv);
    if (args.command === "capabilities") {
      process.stdout.write(`${JSON.stringify({
        status: "ok",
        operation: "capabilities",
        version: HELPER_VERSION,
        supported: SUPPORTED_OPERATIONS,
      }, null, 2)}\n`);
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
  initializeTurnLedger,
  beginTurn,
  abandonTurn,
  completeTurn,
  importEvidence,
};
