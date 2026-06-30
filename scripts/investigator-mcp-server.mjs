#!/usr/bin/env node
/**
 * investigator-mcp-server.mjs
 *
 * Local stdio MCP server for the investigator helper gates.
 * Transport: newline-delimited JSON-RPC 2.0 on stdin/stdout.
 * Logs only to stderr. Never exits on a request error.
 *
 * Pure Node stdlib — no SDK, no deps.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  makeResponse,
  makeError,
  resolveRepoRoot,
  cleanupTmp,
  readServerVersion,
  writeTmpJson as writeTmpJsonWithPrefix,
  writeTmpFile as writeTmpFileWithPrefix,
} from "./mcp-server-lib.mjs";
import { runtimeDataPath } from "./lib.mjs";

import {
  openCase,
  verifyCaseFiles,
  capabilities,
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
  renderCaseReport,
} from "./investigator-artifacts.mjs";

// ── Version ───────────────────────────────────────────────────────────────────
const SERVER_VERSION = readServerVersion(import.meta.url);

// ── MCP entrypoint prompt path ────────────────────────────────────────────────
// Canonical prompt content lives on disk — not as a string literal — to avoid drift.
const MCP_ENTRYPOINT_PATH = new URL("../agents/investigator/mcp-entrypoint.md", import.meta.url);

function readMcpEntrypoint() {
  return fs.readFileSync(MCP_ENTRYPOINT_PATH, "utf8");
}

// ── Resource URI helpers ──────────────────────────────────────────────────────

const RESOURCE_TEMPLATES = [
  {
    uriTemplate: "investigator://case/{slug}/report",
    name: "case-report",
    title: "Investigation report (artifact-derived)",
    description: "Human-readable markdown investigation report rendered strictly from on-disk artifacts. Final answer surface — no free narrative.",
    mimeType: "text/markdown",
  },
  {
    uriTemplate: "investigator://case/{slug}/journal",
    name: "case-journal",
    title: "Discovery journal (raw)",
    description: "Raw journal.md content for the case.",
    mimeType: "text/markdown",
  },
  {
    uriTemplate: "investigator://case/{slug}/status",
    name: "case-status",
    title: "Case status (JSON)",
    description: "JSON output of caseStatus() for the case.",
    mimeType: "application/json",
  },
];

// Parse investigator://case/<slug>/<kind> URIs.
function parseCaseUri(uri) {
  const match = /^investigator:\/\/case\/([^/]+)\/(report|journal|status)$/.exec(uri);
  if (!match) return null;
  return { slug: match[1], kind: match[2] };
}

function resolveResourceContent(uri) {
  const parsed = parseCaseUri(uri);
  if (!parsed) return null;
  const { slug, kind } = parsed;

  // Derive the repo root from the server script location.
  const root = path.resolve(new URL("..", import.meta.url).pathname);

  if (kind === "report") {
    const text = renderCaseReport({ root, caseSlug: slug });
    return { uri, mimeType: "text/markdown", text };
  }
  if (kind === "journal") {
    const journalPath = runtimeDataPath(root, "cases", slug, "journal.md");
    const text = fs.readFileSync(journalPath, "utf8");
    return { uri, mimeType: "text/markdown", text };
  }
  if (kind === "status") {
    // A resource read of a specific case URI must 404 for a missing case,
    // consistent with the report/journal kinds. caseStatus() itself returns
    // phase "no-case" rather than throwing (correct for the doctor tool, wrong
    // for a resource read), so assert the case directory exists first.
    const caseDir = runtimeDataPath(root, "cases", slug);
    if (!fs.existsSync(path.join(caseDir, "case-intake.md"))) {
      throw new Error(`no such case: ${slug}`);
    }
    const result = caseStatus({ root, caseSlug: slug });
    return { uri, mimeType: "application/json", text: JSON.stringify(result, null, 2) };
  }
  return null;
}

// ── Tool definitions ──────────────────────────────────────────────────────────

// Change 1: error returned when force is passed over MCP.
const FORCE_OVER_MCP_ERROR =
  "force is not available over MCP. Repair flows: run status and follow its nextCommands/nextActions. abandon_turn clears a blocked pending turn. Replacing existing artifacts is a human decision — use the CLI with explicit user approval.";

// Output schema for the status tool — describes caseStatus() return shape.
const STATUS_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    operation: { type: "string" },
    caseSlug: { type: "string" },
    phase: {
      type: "string",
      enum: [
        "no-case",
        "intake",
        "loads",
        "journal-pending",
        "ledger-pending",
        "turn-open",
        "turn-ready",
        "resolved",
      ],
    },
    intake: {
      type: "object",
      properties: {
        present: { type: "boolean" },
        pass: { type: "boolean" },
        issues: { type: "array", items: { type: "string" } },
      },
      required: ["present", "pass", "issues"],
    },
    loads: {
      type: "object",
      properties: {
        present: { type: "boolean" },
        pass: { type: "boolean" },
        issues: { type: "array", items: { type: "string" } },
      },
      required: ["present", "pass", "issues"],
    },
    ledger: {
      type: "object",
      properties: {
        present: { type: "boolean" },
        consistent: { type: "boolean" },
        currentSequence: { type: ["integer", "null"] },
        pendingTurn: {
          oneOf: [
            { type: "null" },
            {
              type: "object",
              properties: {
                sequence: { type: "integer" },
                userAction: { type: "string" },
                journalChangedSinceBegin: { type: "boolean" },
              },
              required: ["sequence", "userAction", "journalChangedSinceBegin"],
            },
          ],
        },
        archivedGenerations: { type: "integer" },
        issues: { type: "array", items: { type: "string" } },
      },
      required: ["present", "consistent", "currentSequence", "pendingTurn", "archivedGenerations", "issues"],
    },
    journal: {
      type: "object",
      properties: {
        present: { type: "boolean" },
        claimCounts: { type: "object", additionalProperties: { type: "integer" } },
      },
      required: ["present", "claimCounts"],
    },
    blockingIssues: { type: "array", items: { type: "string" } },
    nextCommands: { type: "array", items: { type: "string" } },
    nextActions: { type: "array", items: { type: "string" } },
  },
  required: [
    "operation",
    "caseSlug",
    "phase",
    "intake",
    "loads",
    "ledger",
    "journal",
    "blockingIssues",
    "nextCommands",
    "nextActions",
  ],
};

const TOOLS = [
  {
    name: "status",
    title: "Case status (read-only doctor)",
    description:
      "Run FIRST when resuming a case, after any gate failure, or whenever turn state is uncertain. Reports phase, intake/loads/ledger/journal state, dangling pendingTurn, and the exact legal nextCommands/nextActions. Never mutates.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug (letters, numbers, dot, underscore, hyphen)." },
      },
      required: ["root", "case_slug"],
    },
    outputSchema: STATUS_OUTPUT_SCHEMA,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "open_case",
    title: "Open investigation case (Step 1 gate)",
    description:
      "Step 1 gate. Proposed loads must be docs-only (prompt.md + harness.md are mandatory). A passing open_case IS the verification — verify_case is for resuming or repair only. The telemetry guardrail blocks telemetry reference loads unless the framing contains explicit telemetry evidence. If the user's framing presumes facts not in evidence (e.g. asks you to write up THE root cause with no tenant data), do not adopt the presumption — open the case with the symptom as reported and let evidence decide.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
        framing: {
          type: "object",
          description: "Framing object (workingDirectory, symptom, tenantCloud, products, scope, and optional fields).",
        },
        proposed_loads: {
          type: "array",
          items: { type: "string" },
          description: "Repo-relative paths to proposed loads. Must include agents/investigator/prompt.md and agents/investigator/harness.md.",
        },
      },
      required: ["root", "case_slug", "framing", "proposed_loads"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "verify_case",
    title: "Verify case intake artifacts (resume/repair)",
    description:
      "Resume/repair check only. Verifies that the case intake artifacts are present and passing. A passing open_case already performs this check; call verify_case only when resuming an existing case or after a repair.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
      },
      required: ["root", "case_slug"],
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "record_loads",
    title: "Record file loads (Step 2 gate)",
    description:
      "Step 2 gate. Run after loading files, before Step 3 (initialize_turn_ledger). Every file displayed to the model must be listed in loaded or deferred. Deferred items require a reason.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
        loaded: {
          type: "array",
          items: { type: "string" },
          description: "Repo-relative paths to files actually loaded.",
        },
        deferred: {
          type: "array",
          items: {
            type: "object",
            properties: {
              path: { type: "string", description: "Repo-relative path to the deferred file." },
              reason: { type: "string", description: "Reason the file was deferred." },
            },
            required: ["path", "reason"],
          },
          description: "Files proposed but not loaded, each with a reason.",
        },
        allow_additional: {
          type: "boolean",
          description: "Allow loads beyond the proposed list.",
        },
      },
      required: ["root", "case_slug", "loaded"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "verify_loads",
    title: "Verify recorded-loads artifact (resume/repair)",
    description:
      "Resume/repair check only. Verifies the recorded-loads artifact is present and passing.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
      },
      required: ["root", "case_slug"],
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "save_journal",
    title: "Write discovery journal",
    description:
      "Write the discovery journal. Content must match the full stub skeleton: # Discovery Journal heading, ## Framing, ## Proposed Loads, ## Claims with a canonical claim table (| Claim | Source | Status | Next evidence needed | Timestamp | Notes |), and ## Resolution. The initial journal starts with Open claims only. save_journal rejects Confirmed, Ruled out, and Resolved claims whether this is the first write or a subsequent overwrite — do not use save_journal to transition claim statuses. Call run_turn or complete_turn instead; evidence-gated transitions must go through a turn.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
        journal_content: { type: "string", description: "Full journal markdown content." },
      },
      required: ["root", "case_slug", "journal_content"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      // Writing the same journal content twice produces the same file bytes
      // and the same case state — safe for a client to retry on failure.
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "initialize_turn_ledger",
    title: "Initialize turn ledger (Step 3 gate)",
    description:
      "One-press Step 3. Writes the genesis turn event. Refuses unless recorded-loads artifact is passing. If journal_content is provided, writes the journal atomically before initializing (saves a separate save_journal call). The initial journal starts with Open claims only — claims cannot reach Confirmed or Ruled out without recorded evidence through turns. CLI force re-initialization archives the prior ledger to workflow/ledger-archive/; force is not available over MCP.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
        journal_content: {
          type: "string",
          description: "Optional full journal markdown content to write before initializing.",
        },
      },
      required: ["root", "case_slug"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "begin_turn",
    title: "Begin investigation turn (split-form start)",
    description:
      "Split-form turn start. Opens a pending turn for the given user_action. Prefer run_turn for single-shot turns; use begin_turn + complete_turn only when import_evidence must run mid-turn or for repair.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
        user_action: { type: "string", description: "User action label from the allowedNext list (e.g. continue-top-open, pause)." },
      },
      required: ["root", "case_slug", "user_action"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "run_turn",
    title: "Run investigation turn (atomic)",
    description:
      "Canonical per-turn command. Atomic begin + save-journal + complete in one call; all-or-nothing — a failed run_turn leaves no pending turn. Fix the reported problem and rerun. actionType must be one of: load-file, query-request, request-user-evidence, record-user-evidence, add-evidence, mark-resolved, pause. Never invent, simulate, or assume evidence. With no tenant data, the correct action is request-user-evidence. Claim statuses only move on recorded evidence — the server enforces this. record-user-evidence and add-evidence turns require evidenceRefs backed by import_evidence — narrative summaries are not evidence.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
        user_action: { type: "string", description: "User action label from the allowedNext list." },
        journal_content: { type: "string", description: "Full updated journal markdown content for this turn." },
        turn_input: {
          type: "object",
          description: "Turn input object (actionType required; may include touchedClaims, actionSummary, evidenceRefs, allowedNext, etc.). Must not include helper-owned fields (sequence, previousHash, turnToken, userAction, journalHashBefore, journalHashAfter).",
        },
      },
      required: ["root", "case_slug", "user_action", "journal_content", "turn_input"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "complete_turn",
    title: "Complete investigation turn (split-form finish)",
    description:
      "Split-form turn completion. Completes an open pending turn. Provide turn_input as an object (the helper fills in all helper-owned fields automatically). The legacy --turn-json full-object mode is CLI-only.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
        turn_input: {
          type: "object",
          description: "Turn input object (actionType required; must not include helper-owned fields).",
        },
      },
      required: ["root", "case_slug", "turn_input"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "abandon_turn",
    title: "Abandon open pending turn",
    description:
      "Abandon an open pending turn. Requires a non-empty reason. The journal must not have changed since begin_turn.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
        reason: { type: "string", description: "Reason for abandoning the turn." },
      },
      required: ["root", "case_slug", "reason"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "import_evidence",
    title: "Import evidence file into case",
    description:
      "Import one evidence file into the case evidence directory. Requires an open pending turn (begin_turn first). source_file must be an absolute path to the file to import. Supply either (a) source_file + name + source + summary + captured_at + touched_claim for single-item mode, or (b) items object for batch mode. root and case_slug are always required.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
        source_file: { type: "string", description: "Single-item mode: absolute path to the source file to import." },
        name: { type: "string", description: "Single-item mode: short name for the evidence artifact." },
        source: { type: "string", description: "Single-item mode: evidence source label (e.g. tool name, system name)." },
        query: { type: "string", description: "Query text used to obtain this evidence (one of query, query_file, or request_text)." },
        query_file: { type: "string", description: "Path to a file containing the query text." },
        request_text: { type: "string", description: "Free-text request description (for request-user-evidence turns)." },
        summary: { type: "string", description: "Single-item mode: human-readable summary of what was found." },
        captured_at: { type: "string", description: "Single-item mode: ISO-UTC timestamp when evidence was captured." },
        touched_claim: {
          type: "array",
          items: { type: "string" },
          description: "Single-item mode: claims touched by this evidence (H-tag or full claim text from the journal claim table).",
        },
        active_hypothesis: { type: "string", description: "Optional active hypothesis tag." },
        items: {
          type: "object",
          description: "Batch mode: pass an object with an items array for multi-item import. When present, overrides all single-item params.",
        },
      },
      required: ["root", "case_slug"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "helper_capabilities",
    title: "Helper capabilities (version + operations)",
    description: "Returns the helper capabilities object: version, supported operations, and supported options.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "render_report",
    title: "Render investigation report from artifacts",
    description:
      "Render a human-readable markdown investigation report derived strictly from on-disk artifacts (journal claims table, turn ledger history, evidence manifest). Use this tool to produce the final answer to the user — never narrate findings from memory. The report contains only journal-derived claim statuses and ledger-recorded turns; no free narrative.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        case_slug: { type: "string", description: "Case slug." },
      },
      required: ["root", "case_slug"],
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
];

// ── Tmp-file helpers ──────────────────────────────────────────────────────────

const writeTmpFile = (content) => writeTmpFileWithPrefix(content, "inv-mcp-");
const writeTmpJson = (value) => writeTmpJsonWithPrefix(value, "inv-mcp-");

// ── Tool dispatch ─────────────────────────────────────────────────────────────

function dispatchTool(name, params) {
  // Change 1: reject force if passed over MCP regardless of which tool it came with.
  if (Object.prototype.hasOwnProperty.call(params, "force")) {
    throw new Error(FORCE_OVER_MCP_ERROR);
  }

  switch (name) {
    case "status": {
      return caseStatus({ root: params.root, caseSlug: params.case_slug });
    }

    case "open_case": {
      let tmpDir = null;
      try {
        const tmp = writeTmpJson(params.framing);
        tmpDir = tmp.dir;
        return openCase({
          root: params.root,
          caseSlug: params.case_slug,
          framingJson: tmp.filePath,
          proposedLoads: params.proposed_loads || [],
          force: false,
        });
      } finally {
        if (tmpDir) cleanupTmp(tmpDir);
      }
    }

    case "verify_case": {
      const root = resolveRepoRoot(params.root);
      return verifyCaseFiles(root, params.case_slug);
    }

    case "record_loads": {
      const deferred = (params.deferred || []).map((item) => `${item.path}=${item.reason}`);
      return recordLoads({
        root: params.root,
        caseSlug: params.case_slug,
        loaded: params.loaded || [],
        deferred,
        allowAdditional: params.allow_additional || false,
        force: false,
      });
    }

    case "verify_loads": {
      const root = resolveRepoRoot(params.root);
      return verifyLoads(root, params.case_slug);
    }

    case "save_journal": {
      let tmpDir = null;
      try {
        const tmp = writeTmpFile(params.journal_content);
        tmpDir = tmp.dir;
        return saveJournal({
          root: params.root,
          caseSlug: params.case_slug,
          contentFile: tmp.filePath,
        });
      } finally {
        if (tmpDir) cleanupTmp(tmpDir);
      }
    }

    case "initialize_turn_ledger": {
      let tmpDir = null;
      try {
        const args = {
          root: params.root,
          caseSlug: params.case_slug,
          force: false,
        };
        if (params.journal_content !== undefined && params.journal_content !== null) {
          const tmp = writeTmpFile(params.journal_content);
          tmpDir = tmp.dir;
          args.journalFile = tmp.filePath;
        }
        return initializeTurnLedger(args);
      } finally {
        if (tmpDir) cleanupTmp(tmpDir);
      }
    }

    case "begin_turn": {
      return beginTurn({
        root: params.root,
        caseSlug: params.case_slug,
        userAction: params.user_action,
      });
    }

    case "run_turn": {
      let journalTmpDir = null;
      let turnInputTmpDir = null;
      try {
        const journalTmp = writeTmpFile(params.journal_content);
        journalTmpDir = journalTmp.dir;
        const turnInputTmp = writeTmpJson(params.turn_input);
        turnInputTmpDir = turnInputTmp.dir;
        return runTurn({
          root: params.root,
          caseSlug: params.case_slug,
          userAction: params.user_action,
          journalFile: journalTmp.filePath,
          turnInputJson: turnInputTmp.filePath,
        });
      } finally {
        if (journalTmpDir) cleanupTmp(journalTmpDir);
        if (turnInputTmpDir) cleanupTmp(turnInputTmpDir);
      }
    }

    case "complete_turn": {
      let tmpDir = null;
      try {
        const tmp = writeTmpJson(params.turn_input);
        tmpDir = tmp.dir;
        return completeTurn({
          root: params.root,
          caseSlug: params.case_slug,
          turnInputJson: tmp.filePath,
        });
      } finally {
        if (tmpDir) cleanupTmp(tmpDir);
      }
    }

    case "abandon_turn": {
      return abandonTurn({
        root: params.root,
        caseSlug: params.case_slug,
        reason: params.reason,
      });
    }

    case "import_evidence": {
      if (params.items) {
        let tmpDir = null;
        try {
          const tmp = writeTmpJson(params.items);
          tmpDir = tmp.dir;
          return importEvidence({
            root: params.root,
            caseSlug: params.case_slug,
            inputJson: tmp.filePath,
          });
        } finally {
          if (tmpDir) cleanupTmp(tmpDir);
        }
      }
      return importEvidence({
        root: params.root,
        caseSlug: params.case_slug,
        sourceFile: params.source_file,
        name: params.name,
        source: params.source,
        query: params.query,
        queryFile: params.query_file,
        requestText: params.request_text,
        summary: params.summary,
        capturedAt: params.captured_at,
        touchedClaims: params.touched_claim,
        activeHypothesis: params.active_hypothesis,
      });
    }

    case "helper_capabilities": {
      return capabilities();
    }

    case "render_report": {
      const root = resolveRepoRoot(params.root);
      const report = renderCaseReport({ root, caseSlug: params.case_slug });
      // render_report returns a markdown string; wrap in a result object so the
      // structuredContent path stays consistent.
      return { status: "pass", report };
    }

    default: {
      // Should be unreachable — unknown tools are caught before dispatchTool is called.
      throw new Error(`Unknown tool: ${name}`);
    }
  }
}

// ── JSON-RPC protocol ─────────────────────────────────────────────────────────

function handleRequest(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    process.stdout.write(`${JSON.stringify(makeError(null, -32700, `Parse error: ${err.message}`))}\n`);
    return;
  }

  const { id, method, params } = parsed;

  // Notifications (no id) — accept and ignore.
  if (id === undefined) {
    if (method === "notifications/initialized") {
      // Accept silently.
    }
    // All other notifications are silently dropped.
    return;
  }

  if (method === "initialize") {
    // Echo the client's requested version when present; default to a current stable version.
    // Per MCP spec 2025-11-25: the server should echo the client version for negotiation.
    const clientVersion = params && params.protocolVersion ? params.protocolVersion : "2025-06-18";
    const response = makeResponse(id, {
      protocolVersion: clientVersion,
      capabilities: {
        tools: {},
        // Declare resources and prompts capabilities (A5).
        // subscribe and listChanged are not implemented; declare them false.
        resources: { listChanged: false, subscribe: false },
        prompts: { listChanged: false },
      },
      serverInfo: { name: "zscaler-investigator", version: SERVER_VERSION },
    });
    process.stdout.write(`${JSON.stringify(response)}\n`);
    return;
  }

  if (method === "ping") {
    process.stdout.write(`${JSON.stringify(makeResponse(id, {}))}\n`);
    return;
  }

  if (method === "tools/list") {
    process.stdout.write(`${JSON.stringify(makeResponse(id, { tools: TOOLS }))}\n`);
    return;
  }

  if (method === "tools/call") {
    const toolName = params && params.name ? params.name : "";
    const toolParams = params && params.arguments ? params.arguments : {};

    const knownTool = TOOLS.some((t) => t.name === toolName);
    if (!knownTool) {
      // Per MCP spec 2025-11-25: unknown tool is a Protocol Error (-32602), not isError result.
      process.stdout.write(`${JSON.stringify(makeError(id, -32602, `Unknown tool: ${toolName}`))}\n`);
      return;
    }

    let result;
    try {
      result = dispatchTool(toolName, toolParams);
    } catch (err) {
      // Tool Execution Error — keep as isError result per spec (load-bearing for actionable gate errors).
      const errResult = {
        content: [{ type: "text", text: err.message }],
        isError: true,
      };
      process.stdout.write(`${JSON.stringify(makeResponse(id, errResult))}\n`);
      return;
    }

    // Per spec A3: include structuredContent alongside the serialized-JSON text block
    // for tool results that are JSON objects (backwards-compat text block is kept).
    const okResult = {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
    process.stdout.write(`${JSON.stringify(makeResponse(id, okResult))}\n`);
    return;
  }

  // ── resources/templates/list ──────────────────────────────────────────────
  if (method === "resources/templates/list") {
    process.stdout.write(`${JSON.stringify(makeResponse(id, { resourceTemplates: RESOURCE_TEMPLATES }))}\n`);
    return;
  }

  // ── resources/list ────────────────────────────────────────────────────────
  if (method === "resources/list") {
    // Enumerate existing cases if the runtime data cases dir exists; degrade gracefully if absent.
    const root = path.resolve(new URL("..", import.meta.url).pathname);
    const casesDir = runtimeDataPath(root, "cases");
    const resources = [];
    try {
      const entries = fs.readdirSync(casesDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const slug = entry.name;
        resources.push(
          { uri: `investigator://case/${slug}/report`, name: `${slug} — report`, mimeType: "text/markdown" },
          { uri: `investigator://case/${slug}/journal`, name: `${slug} — journal`, mimeType: "text/markdown" },
          { uri: `investigator://case/${slug}/status`, name: `${slug} — status`, mimeType: "application/json" },
        );
      }
    } catch {
      // Runtime data cases dir absent — return empty list; templates remain the discovery surface.
    }
    process.stdout.write(`${JSON.stringify(makeResponse(id, { resources }))}\n`);
    return;
  }

  // ── resources/read ────────────────────────────────────────────────────────
  if (method === "resources/read") {
    const uri = params && params.uri ? params.uri : "";
    let content;
    try {
      content = resolveResourceContent(uri);
    } catch (err) {
      process.stdout.write(`${JSON.stringify(makeError(id, -32002, `Resource not found: ${err.message}`, { uri }))}\n`);
      return;
    }
    if (!content) {
      process.stdout.write(`${JSON.stringify(makeError(id, -32002, `Resource not found: ${uri}`, { uri }))}\n`);
      return;
    }
    process.stdout.write(`${JSON.stringify(makeResponse(id, { contents: [content] }))}\n`);
    return;
  }

  // ── prompts/list ──────────────────────────────────────────────────────────
  if (method === "prompts/list") {
    const promptList = [
      {
        name: "investigate",
        description: "Start a new Zscaler investigation with the investigator role entrypoint.",
        arguments: [
          {
            name: "framing",
            description: "The user's troubleshooting report or problem statement.",
            required: false,
          },
        ],
      },
      {
        name: "resume-case",
        description: "Resume an existing investigation case. Runs status first, follows nextCommands/nextActions.",
        arguments: [
          {
            name: "case_slug",
            description: "The case slug to resume.",
            required: true,
          },
        ],
      },
    ];
    process.stdout.write(`${JSON.stringify(makeResponse(id, { prompts: promptList }))}\n`);
    return;
  }

  // ── prompts/get ───────────────────────────────────────────────────────────
  if (method === "prompts/get") {
    const promptName = params && params.name ? params.name : "";
    const args = params && params.arguments ? params.arguments : {};

    if (promptName === "investigate") {
      let entrypointText;
      try {
        entrypointText = readMcpEntrypoint();
      } catch (err) {
        process.stdout.write(`${JSON.stringify(makeError(id, -32603, `Failed to read entrypoint: ${err.message}`))}\n`);
        return;
      }
      const framing = args.framing ? args.framing : "";
      const text = framing ? `${entrypointText}\n\n---\n\n**Framing:**\n\n${framing}` : entrypointText;
      const resp = makeResponse(id, {
        description: "Investigator role entrypoint with gated workflow and answer-from-artifact rule.",
        messages: [{ role: "user", content: { type: "text", text } }],
      });
      process.stdout.write(`${JSON.stringify(resp)}\n`);
      return;
    }

    if (promptName === "resume-case") {
      const caseSlug = args.case_slug ? args.case_slug : "";
      if (!caseSlug) {
        process.stdout.write(`${JSON.stringify(makeError(id, -32602, "Missing required argument: case_slug"))}\n`);
        return;
      }
      const text = `Run \`status\` for case \`${caseSlug}\` first. Follow its nextCommands/nextActions exactly. Do not start a new case. If the case is already resolved, report using render_report — do not narrate from memory.`;
      const resp = makeResponse(id, {
        description: `Resume investigation case ${caseSlug}.`,
        messages: [{ role: "user", content: { type: "text", text } }],
      });
      process.stdout.write(`${JSON.stringify(resp)}\n`);
      return;
    }

    // Unknown prompt name.
    process.stdout.write(`${JSON.stringify(makeError(id, -32602, `Unknown prompt: ${promptName}`))}\n`);
    return;
  }

  // Unknown method.
  process.stdout.write(`${JSON.stringify(makeError(id, -32601, `Method not found: ${method}`))}\n`);
}

// ── Stdin reader ──────────────────────────────────────────────────────────────

let buffer = "";

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let newlineIndex = buffer.indexOf("\n");
  while (newlineIndex !== -1) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (line.length > 0) {
      try {
        handleRequest(line);
      } catch (err) {
        process.stderr.write(`[investigator-mcp-server] unhandled error: ${err.message}\n`);
      }
    }
    newlineIndex = buffer.indexOf("\n");
  }
});

process.stdin.on("end", () => {
  process.exit(0);
});
