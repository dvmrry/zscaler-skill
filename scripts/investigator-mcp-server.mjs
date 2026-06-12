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
import os from "node:os";
import path from "node:path";
import process from "node:process";

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
} from "./investigator-artifacts.mjs";

// ── Root validation ───────────────────────────────────────────────────────────

function resolveRepoRoot(rootArg) {
  if (!rootArg) throw new Error("root is required");
  const root = path.resolve(rootArg);
  const stat = fs.statSync(root, { throwIfNoEntry: false });
  if (!stat || !stat.isDirectory()) {
    throw new Error(`repo root does not exist or is not a directory: ${root}`);
  }
  return root;
}

// ── Version ───────────────────────────────────────────────────────────────────
let SERVER_VERSION = "unknown";
try {
  const versionFile = new URL("../VERSION", import.meta.url);
  SERVER_VERSION = fs.readFileSync(versionFile, "utf8").trim();
} catch {
  // Fall back to "unknown".
}

// ── Tool definitions ──────────────────────────────────────────────────────────

// Change 1: error returned when force is passed over MCP.
const FORCE_OVER_MCP_ERROR =
  "force is not available over MCP. Repair flows: run status and follow its nextCommands/nextActions; abandon_turn clears a blocked pending turn. Replacing existing artifacts is a human decision — use the CLI with explicit user approval.";

const TOOLS = [
  {
    name: "status",
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
  },
  {
    name: "open_case",
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
  },
  {
    name: "verify_case",
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
  },
  {
    name: "record_loads",
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
  },
  {
    name: "verify_loads",
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
  },
  {
    name: "save_journal",
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
  },
  {
    name: "initialize_turn_ledger",
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
  },
  {
    name: "begin_turn",
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
  },
  {
    name: "run_turn",
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
  },
  {
    name: "complete_turn",
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
  },
  {
    name: "abandon_turn",
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
  },
  {
    name: "import_evidence",
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
  },
  {
    name: "helper_capabilities",
    description: "Returns the helper capabilities object: version, supported operations, and supported options.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

// ── Tmp-file helpers ──────────────────────────────────────────────────────────

function writeTmpFile(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "inv-mcp-"));
  const filePath = path.join(dir, "content");
  fs.writeFileSync(filePath, content, "utf8");
  return { dir, filePath };
}

function writeTmpJson(value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "inv-mcp-"));
  const filePath = path.join(dir, "content.json");
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return { dir, filePath };
}

function cleanupTmp(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup.
  }
}

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

    default: {
      return null; // signals unknown tool
    }
  }
}

// ── JSON-RPC protocol ─────────────────────────────────────────────────────────

function makeResponse(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function makeError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

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
    const clientVersion = params && params.protocolVersion ? params.protocolVersion : "2024-11-05";
    const response = makeResponse(id, {
      protocolVersion: clientVersion,
      capabilities: { tools: {} },
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
      const errResult = {
        content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
        isError: true,
      };
      process.stdout.write(`${JSON.stringify(makeResponse(id, errResult))}\n`);
      return;
    }

    let result;
    try {
      result = dispatchTool(toolName, toolParams);
    } catch (err) {
      const errResult = {
        content: [{ type: "text", text: err.message }],
        isError: true,
      };
      process.stdout.write(`${JSON.stringify(makeResponse(id, errResult))}\n`);
      return;
    }

    const okResult = {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
    process.stdout.write(`${JSON.stringify(makeResponse(id, okResult))}\n`);
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
