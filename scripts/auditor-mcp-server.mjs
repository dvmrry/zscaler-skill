#!/usr/bin/env node
/**
 * auditor-mcp-server.mjs
 *
 * Local stdio MCP server for the auditor helper gates.
 * Transport: newline-delimited JSON-RPC 2.0 on stdin/stdout.
 * Logs only to stderr. Never exits on a request error.
 *
 * Conformance-clean from the start (MCP 2025-11-25):
 * - Every tool has annotations (readOnlyHint/destructiveHint/idempotentHint/openWorldHint).
 * - Every tool has a title.
 * - Object results include structuredContent alongside the serialized-JSON text block.
 * - audit_status carries an outputSchema matching auditStatus's real shape.
 * - Unknown tool -> JSON-RPC -32602.
 * - initialize echoes client protocolVersion (default "2025-06-18").
 * - Capabilities declare { tools:{}, resources:{listChanged:false,subscribe:false}, prompts:{listChanged:false} }.
 * - No force param on any MCP tool.
 *
 * Pure Node stdlib — no SDK, no external deps.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import {
  openAudit,
  recordFinding,
  recordCheckOutput,
  renderAuditReport,
  auditStatus,
  capabilities,
} from "./auditor-artifacts.mjs";

// ── Version ───────────────────────────────────────────────────────────────────
let SERVER_VERSION = "unknown";
try {
  const versionFile = new URL("../VERSION", import.meta.url);
  SERVER_VERSION = fs.readFileSync(versionFile, "utf8").trim();
} catch {
  // Fall back to "unknown".
}

// ── MCP entrypoint prompt path ────────────────────────────────────────────────
// Canonical prompt content lives on disk — not as a string literal — to avoid drift.
const MCP_ENTRYPOINT_PATH = new URL("../agents/auditor/mcp-entrypoint.md", import.meta.url);

function readMcpEntrypoint() {
  return fs.readFileSync(MCP_ENTRYPOINT_PATH, "utf8");
}

// ── Root resolution (repo root from server script location) ───────────────────
function resolveRepoRoot(rootArg) {
  if (!rootArg) throw new Error("root is required");
  const root = path.resolve(rootArg);
  const stat = fs.statSync(root, { throwIfNoEntry: false });
  if (!stat || !stat.isDirectory()) {
    throw new Error(`repo root does not exist or is not a directory: ${root}`);
  }
  return root;
}

// ── Error constant ────────────────────────────────────────────────────────────
// force is not available over MCP; repair flows use audit_status -> open_audit.
const FORCE_OVER_MCP_ERROR =
  "force is not available over MCP. Repair flow: run audit_status and follow its nextActions. " +
  "Replacing existing audit artifacts is a human decision — use the CLI with explicit user approval.";

// ── Resource URI helpers ──────────────────────────────────────────────────────

const RESOURCE_TEMPLATES = [
  {
    uriTemplate: "auditor://audit/{slug}/report",
    name: "audit-report",
    title: "Audit report (artifact-derived)",
    description:
      "Human-readable markdown audit report rendered strictly from on-disk artifacts (findings.jsonl + audit-intake.json). Final answer surface — no free narrative.",
    mimeType: "text/markdown",
  },
  {
    uriTemplate: "auditor://audit/{slug}/register",
    name: "audit-register",
    title: "Audit register (raw)",
    description: "Raw register.md content for the audit (derived from findings.jsonl).",
    mimeType: "text/markdown",
  },
  {
    uriTemplate: "auditor://audit/{slug}/status",
    name: "audit-status",
    title: "Audit status (JSON)",
    description: "JSON output of auditStatus() for the audit.",
    mimeType: "application/json",
  },
];

// Parse auditor://audit/<slug>/<kind> URIs.
function parseAuditUri(uri) {
  const match = /^auditor:\/\/audit\/([^/]+)\/(report|register|status)$/.exec(uri);
  if (!match) return null;
  return { slug: match[1], kind: match[2] };
}

function resolveResourceContent(uri) {
  const parsed = parseAuditUri(uri);
  if (!parsed) return null;
  const { slug, kind } = parsed;

  // Derive the repo root from the server script location (scripts/../ = repo root).
  // DESIGN NOTE: this is intentional — the resource root is always the repo the server
  // is installed in, regardless of any tool call's `root` parameter. Tool calls forward
  // `root` explicitly to the helper; resource reads use this server-relative root.
  // Consequence: auditor://audit/<slug>/... URIs only resolve audits stored under the
  // repo this server binary lives in. Cross-repo resource reads are NOT supported by
  // design. Operators running the server from a different repo will get -32002 for any
  // audit that does not exist under that repo's _data/audits/. See workflow.md or
  // runtime-adapters.md for deployment notes.
  const root = path.resolve(new URL("..", import.meta.url).pathname);

  if (kind === "report") {
    // Throws if audit does not exist — caught by caller -> -32002.
    const text = renderAuditReport({ root, auditSlug: slug });
    return { uri, mimeType: "text/markdown", text };
  }
  if (kind === "register") {
    const registerPath = path.join(root, "_data", "audits", slug, "register.md");
    if (!fs.existsSync(registerPath)) {
      throw new Error(`no such audit: ${slug}`);
    }
    const text = fs.readFileSync(registerPath, "utf8");
    return { uri, mimeType: "text/markdown", text };
  }
  if (kind === "status") {
    // A resource read of a missing audit must 404 consistently with report/register kinds.
    // auditStatus() returns phase "no-audit" rather than throwing — assert existence first.
    const auditIntakePath = path.join(root, "_data", "audits", slug, "audit-intake.md");
    if (!fs.existsSync(auditIntakePath)) {
      throw new Error(`no such audit: ${slug}`);
    }
    const result = auditStatus({ root, auditSlug: slug });
    return { uri, mimeType: "application/json", text: JSON.stringify(result, null, 2) };
  }
  return null;
}

// ── Output schema for audit_status ───────────────────────────────────────────

const AUDIT_STATUS_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    operation: { type: "string" },
    auditSlug: { type: "string" },
    phase: {
      type: "string",
      enum: ["no-audit", "open", "has-findings"],
    },
    intake: {
      type: "object",
      properties: {
        present: { type: "boolean" },
        pass: { type: "boolean" },
      },
      required: ["present", "pass"],
    },
    findingCounts: {
      type: "object",
      properties: {
        bySeverity: { type: "object", additionalProperties: { type: "integer" } },
        byStatus: { type: "object", additionalProperties: { type: "integer" } },
        total: { type: "integer" },
      },
      required: ["bySeverity", "byStatus", "total"],
    },
    checksRecorded: { type: "array", items: { type: "string" } },
    blockingIssues: { type: "array", items: { type: "string" } },
    nextActions: { type: "array", items: { type: "string" } },
  },
  required: [
    "operation",
    "auditSlug",
    "phase",
    "intake",
    "findingCounts",
    "checksRecorded",
    "blockingIssues",
    "nextActions",
  ],
};

// ── Tool definitions ──────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "audit_status",
    title: "Audit status (read-only doctor)",
    description:
      "Run FIRST when resuming an audit, after any gate failure, or whenever audit state is uncertain. " +
      "Reports phase (no-audit|open|has-findings), intake state, finding counts, checks recorded, and nextActions. " +
      "Never mutates. " +
      "Discipline: open the audit to record scope before recording findings; " +
      "every finding needs a resolving source (no fabricated findings).",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        audit_slug: {
          type: "string",
          description: "Audit slug (letters, numbers, dot, underscore, hyphen).",
        },
      },
      required: ["root", "audit_slug"],
    },
    outputSchema: AUDIT_STATUS_OUTPUT_SCHEMA,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "open_audit",
    title: "Open audit (create audit intake)",
    description:
      "Create the audit intake and register stub. " +
      "scope must include at least one path or a topic, and a description. " +
      "Premise-challenge: if asked to open an audit that presumes findings with no evidence in scope, " +
      "open the audit with the scope as given and let evidence decide — do not adopt the premise. " +
      "Force is not available over MCP; if the audit already exists, use audit_status to diagnose.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        audit_slug: { type: "string", description: "Audit slug." },
        scope: {
          type: "object",
          description:
            "Scope object: { workingDir?, scope: { paths?: string[], topic?: string }, description: string, checksRun?: string[] }.",
        },
      },
      required: ["root", "audit_slug", "scope"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "record_finding",
    title: "Record a validated finding",
    description:
      "Record a finding into findings.jsonl and re-derive register.md. " +
      "Every finding MUST carry a resolving source: " +
      "(a) path:line — a file:line reference that exists under the repo root; " +
      "(b) cross-file — two or more paths that all exist (path/a.md + path/b.md); " +
      "(c) check:<name> — a check recorded via record_check_output. " +
      "High/Critical severity or Resolved status requires type (a) or (c) — cross-file alone is too weak. " +
      "If asked to confirm a problem with no evidence in scope, record it as an Open finding " +
      "citing what you actually read — do not assert severity you cannot support. " +
      "Duplicate findingId is rejected. " +
      "The final answer is render_audit_report, not narration.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        audit_slug: { type: "string", description: "Audit slug." },
        finding: {
          type: "object",
          description:
            "Finding object: { findingId, description, source, severity (Critical|High|Medium|Low|Info), status (Open|Acknowledged|Resolved|Acceptable|Wontfix), remediation?, notes? }.",
        },
      },
      required: ["root", "audit_slug", "finding"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "record_check_output",
    title: "Record CI/check output as evidence",
    description:
      "Store a check script's captured output under _data/audits/<slug>/checks/<name>.txt " +
      "and register it in audit-intake.json.checksRun. " +
      "A finding can then cite 'check:<name>' as its resolving source. " +
      "Equivalent to import-evidence in the investigator — this is how deterministic " +
      "check output becomes verifiable evidence for findings.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        audit_slug: { type: "string", description: "Audit slug." },
        check_name: { type: "string", description: "Filesystem-safe check name." },
        output_file: {
          type: "string",
          description: "Absolute path to the file containing the check output.",
        },
        exit_code: {
          type: "integer",
          description: "Exit code of the check script (optional).",
        },
      },
      required: ["root", "audit_slug", "check_name", "output_file"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "render_audit_report",
    title: "Render audit report from artifacts",
    description:
      "Render a human-readable markdown audit report derived strictly from on-disk artifacts " +
      "(findings.jsonl + audit-intake.json): scope, findings grouped by severity, severity tally, " +
      "and checks recorded. No free narrative — every field in the report comes from a recorded artifact. " +
      "Use this tool to produce the final answer to the user — never narrate findings from memory.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        audit_slug: { type: "string", description: "Audit slug." },
      },
      required: ["root", "audit_slug"],
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "helper_capabilities",
    title: "Helper capabilities (version + operations)",
    description:
      "Returns the auditor helper capabilities object: version, supported operations, and supported options.",
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
];

// ── Tmp-file helpers ──────────────────────────────────────────────────────────

function writeTmpJson(value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "aud-mcp-"));
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
  // Reject force if passed over MCP regardless of which tool it came with.
  if (Object.prototype.hasOwnProperty.call(params, "force")) {
    throw new Error(FORCE_OVER_MCP_ERROR);
  }

  switch (name) {
    case "audit_status": {
      return auditStatus({ root: params.root, auditSlug: params.audit_slug });
    }

    case "open_audit": {
      let tmpDir = null;
      try {
        const tmp = writeTmpJson(params.scope);
        tmpDir = tmp.dir;
        return openAudit({
          root: params.root,
          auditSlug: params.audit_slug,
          scopeJson: tmp.filePath,
          force: false,
        });
      } finally {
        if (tmpDir) cleanupTmp(tmpDir);
      }
    }

    case "record_finding": {
      let tmpDir = null;
      try {
        const tmp = writeTmpJson(params.finding);
        tmpDir = tmp.dir;
        return recordFinding({
          root: params.root,
          auditSlug: params.audit_slug,
          findingJson: tmp.filePath,
        });
      } finally {
        if (tmpDir) cleanupTmp(tmpDir);
      }
    }

    case "record_check_output": {
      return recordCheckOutput({
        root: params.root,
        auditSlug: params.audit_slug,
        checkName: params.check_name,
        outputFile: params.output_file,
        exitCode: typeof params.exit_code === "number" ? params.exit_code : undefined,
      });
    }

    case "render_audit_report": {
      const root = resolveRepoRoot(params.root);
      const report = renderAuditReport({ root, auditSlug: params.audit_slug });
      // Wrap in a result object so structuredContent path stays consistent.
      return { status: "ok", report };
    }

    case "helper_capabilities": {
      return capabilities();
    }

    default: {
      // Should be unreachable — unknown tools are caught before dispatchTool is called.
      throw new Error(`Unknown tool: ${name}`);
    }
  }
}

// ── JSON-RPC protocol ─────────────────────────────────────────────────────────

function makeResponse(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function makeError(id, code, message, data) {
  const error = { code, message };
  if (data !== undefined) error.data = data;
  return { jsonrpc: "2.0", id, error };
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
    // Echo the client's requested version when present; default to a current stable version.
    const clientVersion =
      params && params.protocolVersion ? params.protocolVersion : "2025-06-18";
    const response = makeResponse(id, {
      protocolVersion: clientVersion,
      capabilities: {
        tools: {},
        resources: { listChanged: false, subscribe: false },
        prompts: { listChanged: false },
      },
      serverInfo: { name: "zscaler-auditor", version: SERVER_VERSION },
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
      process.stdout.write(
        `${JSON.stringify(makeError(id, -32602, `Unknown tool: ${toolName}`))}\n`,
      );
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

    // Per spec: include structuredContent alongside the serialized-JSON text block.
    const okResult = {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
    process.stdout.write(`${JSON.stringify(makeResponse(id, okResult))}\n`);
    return;
  }

  // ── resources/templates/list ──────────────────────────────────────────────
  if (method === "resources/templates/list") {
    process.stdout.write(
      `${JSON.stringify(makeResponse(id, { resourceTemplates: RESOURCE_TEMPLATES }))}\n`,
    );
    return;
  }

  // ── resources/list ────────────────────────────────────────────────────────
  if (method === "resources/list") {
    const auditsDir = path.join(
      path.resolve(new URL("..", import.meta.url).pathname),
      "_data",
      "audits",
    );
    const resources = [];
    try {
      const entries = fs.readdirSync(auditsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const slug = entry.name;
        resources.push(
          { uri: `auditor://audit/${slug}/report`, name: `${slug} — report`, mimeType: "text/markdown" },
          { uri: `auditor://audit/${slug}/register`, name: `${slug} — register`, mimeType: "text/markdown" },
          { uri: `auditor://audit/${slug}/status`, name: `${slug} — status`, mimeType: "application/json" },
        );
      }
    } catch {
      // _data/audits absent — return empty list; templates remain the discovery surface.
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
      process.stdout.write(
        `${JSON.stringify(makeError(id, -32002, `Resource not found: ${err.message}`, { uri }))}\n`,
      );
      return;
    }
    if (!content) {
      process.stdout.write(
        `${JSON.stringify(makeError(id, -32002, `Resource not found: ${uri}`, { uri }))}\n`,
      );
      return;
    }
    process.stdout.write(`${JSON.stringify(makeResponse(id, { contents: [content] }))}\n`);
    return;
  }

  // ── prompts/list ──────────────────────────────────────────────────────────
  if (method === "prompts/list") {
    const promptList = [
      {
        name: "audit",
        description:
          "Start a new Zscaler audit with the auditor role entrypoint. " +
          "Drives the evidence-gated audit workflow: audit_status -> open_audit -> record_finding -> render_audit_report.",
        arguments: [
          {
            name: "scope",
            description: "The audit scope (directory, file, topic, or problem statement).",
            required: false,
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

    if (promptName === "audit") {
      let entrypointText;
      try {
        entrypointText = readMcpEntrypoint();
      } catch (err) {
        process.stdout.write(
          `${JSON.stringify(makeError(id, -32603, `Failed to read entrypoint: ${err.message}`))}\n`,
        );
        return;
      }
      const scope = args.scope ? args.scope : "";
      const text = scope ? `${entrypointText}\n\n---\n\n**Scope:**\n\n${scope}` : entrypointText;
      const resp = makeResponse(id, {
        description:
          "Auditor role entrypoint with evidence-gated workflow and answer-from-artifact rule.",
        messages: [{ role: "user", content: { type: "text", text } }],
      });
      process.stdout.write(`${JSON.stringify(resp)}\n`);
      return;
    }

    // Unknown prompt name.
    process.stdout.write(
      `${JSON.stringify(makeError(id, -32602, `Unknown prompt: ${promptName}`))}\n`,
    );
    return;
  }

  // Unknown method.
  process.stdout.write(
    `${JSON.stringify(makeError(id, -32601, `Method not found: ${method}`))}\n`,
  );
}

// ── Stdin reader ──────────────────────────────────────────────────────────────

// Log the resource root at startup so operators can confirm which repo the
// server resolves audit resource URIs against (see resolveResourceContent).
const _RESOURCE_ROOT = path.resolve(new URL("..", import.meta.url).pathname);
process.stderr.write(`[auditor-mcp-server] resource root: ${_RESOURCE_ROOT}\n`);

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
        process.stderr.write(`[auditor-mcp-server] unhandled error: ${err.message}\n`);
      }
    }
    newlineIndex = buffer.indexOf("\n");
  }
});

process.stdin.on("end", () => {
  process.exit(0);
});
