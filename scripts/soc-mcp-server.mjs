#!/usr/bin/env node
/**
 * soc-mcp-server.mjs
 *
 * Local stdio MCP server for the SOC posture-review helper gates.
 * Transport: newline-delimited JSON-RPC 2.0 on stdin/stdout.
 * Logs only to stderr. Never exits on a request error.
 *
 * Conformance-clean from the start (MCP 2025-11-25):
 * - Every tool has annotations (readOnlyHint/destructiveHint/idempotentHint/openWorldHint).
 * - Every tool has a title.
 * - Object results include structuredContent alongside the serialized-JSON text block.
 * - soc_status carries an outputSchema matching socStatus's real shape.
 * - Unknown tool -> JSON-RPC -32602.
 * - initialize echoes client protocolVersion (default "2025-06-18").
 * - Capabilities declare { tools:{}, resources:{listChanged:false,subscribe:false}, prompts:{listChanged:false} }.
 * - No force param on any MCP tool.
 *
 * Pure Node stdlib — no SDK, no external deps.
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
} from "./mcp-server-lib.mjs";

import {
  openReview,
  recordEvidence,
  recordFinding,
  renderSocReport,
  socStatus,
  capabilities,
} from "./soc-artifacts.mjs";

// ── Version ───────────────────────────────────────────────────────────────────
const SERVER_VERSION = readServerVersion(import.meta.url);

// ── MCP entrypoint prompt path ────────────────────────────────────────────────
// Canonical prompt content lives on disk — not as a string literal — to avoid drift.
const MCP_ENTRYPOINT_PATH = new URL("../agents/soc/mcp-entrypoint.md", import.meta.url);

function readMcpEntrypoint() {
  return fs.readFileSync(MCP_ENTRYPOINT_PATH, "utf8");
}

// ── Error constant ────────────────────────────────────────────────────────────
// force is not available over MCP; repair flows use soc_status -> open_review.
const FORCE_OVER_MCP_ERROR =
  "force is not available over MCP. Repair flows: run soc_status and follow its nextCommands/nextActions. " +
  "Replacing existing review artifacts is a human decision — use the CLI with explicit user approval.";

// ── Resource URI helpers ──────────────────────────────────────────────────────

const RESOURCE_TEMPLATES = [
  {
    uriTemplate: "soc://review/{slug}/report",
    name: "soc-report",
    title: "SOC posture report (artifact-derived)",
    description:
      "Human-readable markdown SOC posture report rendered strictly from on-disk artifacts (findings.jsonl + review-intake.json). Final answer surface — no free narrative.",
    mimeType: "text/markdown",
  },
  {
    uriTemplate: "soc://review/{slug}/register",
    name: "soc-register",
    title: "SOC register (raw)",
    description: "Raw register.md content for the review (derived from findings.jsonl).",
    mimeType: "text/markdown",
  },
  {
    uriTemplate: "soc://review/{slug}/status",
    name: "soc-status",
    title: "SOC review status (JSON)",
    description: "JSON output of socStatus() for the review.",
    mimeType: "application/json",
  },
];

// Parse soc://review/<slug>/<kind> URIs.
function parseSocUri(uri) {
  const match = /^soc:\/\/review\/([^/]+)\/(report|register|status)$/.exec(uri);
  if (!match) return null;
  return { slug: match[1], kind: match[2] };
}

function resolveResourceContent(uri) {
  const parsed = parseSocUri(uri);
  if (!parsed) return null;
  const { slug, kind } = parsed;

  // Derive the repo root from the server script location (scripts/../ = repo root).
  // Resource URIs only resolve reviews stored under the repo this server binary lives in.
  const root = path.resolve(new URL("..", import.meta.url).pathname);

  if (kind === "report") {
    // Throws if review does not exist — caught by caller -> -32002.
    const text = renderSocReport({ root, reviewSlug: slug });
    return { uri, mimeType: "text/markdown", text };
  }
  if (kind === "register") {
    const registerPath = path.join(root, "_data", "soc-reviews", slug, "register.md");
    if (!fs.existsSync(registerPath)) {
      throw new Error(`no such review: ${slug}`);
    }
    const text = fs.readFileSync(registerPath, "utf8");
    return { uri, mimeType: "text/markdown", text };
  }
  if (kind === "status") {
    // A resource read of a missing review must 404 consistently with report/register kinds.
    // socStatus() returns phase "no-review" rather than throwing — assert existence first.
    const reviewIntakePath = path.join(root, "_data", "soc-reviews", slug, "review-intake.md");
    if (!fs.existsSync(reviewIntakePath)) {
      throw new Error(`no such review: ${slug}`);
    }
    const result = socStatus({ root, reviewSlug: slug });
    return { uri, mimeType: "application/json", text: JSON.stringify(result, null, 2) };
  }
  return null;
}

// ── Output schema for soc_status ─────────────────────────────────────────────

const SOC_STATUS_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    operation: { type: "string" },
    reviewSlug: { type: "string" },
    phase: {
      type: "string",
      enum: ["no-review", "open", "has-findings"],
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
    evidenceRecorded: { type: "array", items: { type: "string" } },
    blockingIssues: { type: "array", items: { type: "string" } },
    nextCommands: { type: "array", items: { type: "string" } },
    nextActions: { type: "array", items: { type: "string" } },
  },
  required: [
    "operation",
    "reviewSlug",
    "phase",
    "intake",
    "findingCounts",
    "evidenceRecorded",
    "blockingIssues",
    "nextCommands",
    "nextActions",
  ],
};

// ── Tool definitions ──────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "soc_status",
    title: "SOC review status (read-only doctor)",
    description:
      "Run FIRST when resuming a review, after any gate failure, or whenever review state is uncertain. " +
      "Reports phase (no-review|open|has-findings), intake state, finding counts, evidence recorded, and the exact legal nextCommands/nextActions. " +
      "Never mutates. " +
      "Discipline: open the review to declare scope before recording findings; " +
      "every finding needs a resolving source — framework tags (CWE, NIST, MITRE, OWASP, CISA) classify findings but do NOT prove them; " +
      "cite tenant evidence (file:line, evidence:<name>) in the source field. Final answer = render_soc_report.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        review_slug: {
          type: "string",
          description: "Review slug (letters, numbers, dot, underscore, hyphen).",
        },
      },
      required: ["root", "review_slug"],
    },
    outputSchema: SOC_STATUS_OUTPUT_SCHEMA,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "open_review",
    title: "Open SOC review (create review intake)",
    description:
      "Create the SOC review intake and register stub. " +
      "scope must include at least one path or a topic, and a description. " +
      "Optional: threatModel (e.g. 'compromised admin account') and subtype (policy|access|coverage|config|activity). " +
      "Premise-challenge: if asked to open a review that presumes findings with no evidence in scope, " +
      "open the review with the scope as given and let evidence decide — do not adopt the premise. " +
      "Force is not available over MCP; if the review already exists, use soc_status to diagnose.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        review_slug: { type: "string", description: "Review slug." },
        scope: {
          type: "object",
          description:
            "Scope object: { workingDirectory?, scope: { paths?: string[], topic?: string }, description: string, threatModel?: string, subtype?: string }.",
        },
      },
      required: ["root", "review_slug", "scope"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "record_evidence",
    title: "Record tenant evidence",
    description:
      "Store recorded tenant evidence (a snapshot excerpt, SIEM query result, API response, log) " +
      "under _data/soc-reviews/<slug>/evidence/<name>.* and note it in review-intake.json.evidenceRecorded. " +
      "A finding can then cite 'evidence:<name>' as its resolving source. " +
      "evidence_type: snapshot|siem|api|log (default: snapshot). " +
      "This is the SOC analog of the auditor's record_check_output — recorded evidence becomes " +
      "verifiable proof that lets a finding cite 'evidence:<name>' instead of a raw file:line.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        review_slug: { type: "string", description: "Review slug." },
        name: { type: "string", description: "Filesystem-safe evidence name." },
        source_file: {
          type: "string",
          description: "Absolute path to the file containing the evidence.",
        },
        evidence_type: {
          type: "string",
          enum: ["snapshot", "siem", "api", "log"],
          description: "Evidence type (default: snapshot).",
        },
      },
      required: ["root", "review_slug", "name", "source_file"],
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
    title: "Record a validated SOC posture finding",
    description:
      "Record a SOC posture finding into findings.jsonl and re-derive register.md. " +
      "Every finding MUST carry a resolving source: " +
      "(a) path:line — a file:line reference that exists under the repo root; " +
      "(b) cross-file — two or more paths that all exist (path/a.md + path/b.md); " +
      "(c) evidence:<name> — evidence recorded via record_evidence. " +
      "FRAMEWORK-NOT-EVIDENCE GUARD: a source that is ONLY a framework tag " +
      "(CWE-N, OWASP:, NIST:, MITRE:, ATT&CK:, T\\d{4}, CISA) is REJECTED. " +
      "A framework tag classifies a finding; it does not prove it. " +
      "Cite tenant evidence in the source field. Framework tags belong in the taxonomy field. " +
      "High/Critical severity or Resolved status requires type (a) or (c) — cross-file alone is too weak. " +
      "taxonomy field (array of framework tags) is metadata and is always accepted. " +
      "Duplicate findingId is rejected. " +
      "The final answer is render_soc_report, not narration.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        review_slug: { type: "string", description: "Review slug." },
        finding: {
          type: "object",
          description:
            "Finding object: { findingId, title, category?, taxonomy?: string[], source, severity (Critical|High|Medium|Low|Info), confidence (high|medium|low|open), status (Open|Acknowledged|Resolved|Acceptable|Wontfix), remediation?, notes? }.",
        },
      },
      required: ["root", "review_slug", "finding"],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: "render_soc_report",
    title: "Render SOC posture report from artifacts",
    description:
      "Render a human-readable markdown SOC posture report derived strictly from on-disk artifacts " +
      "(findings.jsonl + review-intake.json): scope, threat model, subtype, findings grouped by severity " +
      "(each with id, title, category, taxonomy tags, source, confidence, status, remediation), " +
      "severity tally, and evidence recorded. No free narrative — every field in the report comes from a recorded artifact. " +
      "Use this tool to produce the final answer to the user — never narrate findings from memory.",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Absolute path to the repo root." },
        review_slug: { type: "string", description: "Review slug." },
      },
      required: ["root", "review_slug"],
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
      "Returns the SOC helper capabilities object: version, supported operations, and supported options.",
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

const writeTmpJson = (value) => writeTmpJsonWithPrefix(value, "soc-mcp-");

// ── Tool dispatch ─────────────────────────────────────────────────────────────

function dispatchTool(name, params) {
  // Reject force if passed over MCP regardless of which tool it came with.
  if (Object.prototype.hasOwnProperty.call(params, "force")) {
    throw new Error(FORCE_OVER_MCP_ERROR);
  }

  switch (name) {
    case "soc_status": {
      return socStatus({ root: params.root, reviewSlug: params.review_slug });
    }

    case "open_review": {
      let tmpDir = null;
      try {
        const tmp = writeTmpJson(params.scope);
        tmpDir = tmp.dir;
        return openReview({
          root: params.root,
          reviewSlug: params.review_slug,
          scopeJson: tmp.filePath,
          force: false,
        });
      } finally {
        if (tmpDir) cleanupTmp(tmpDir);
      }
    }

    case "record_evidence": {
      return recordEvidence({
        root: params.root,
        reviewSlug: params.review_slug,
        name: params.name,
        sourceFile: params.source_file,
        evidenceType: params.evidence_type,
      });
    }

    case "record_finding": {
      let tmpDir = null;
      try {
        const tmp = writeTmpJson(params.finding);
        tmpDir = tmp.dir;
        return recordFinding({
          root: params.root,
          reviewSlug: params.review_slug,
          findingJson: tmp.filePath,
        });
      } finally {
        if (tmpDir) cleanupTmp(tmpDir);
      }
    }

    case "render_soc_report": {
      const root = resolveRepoRoot(params.root);
      const report = renderSocReport({ root, reviewSlug: params.review_slug });
      return { status: "ok", report };
    }

    case "helper_capabilities": {
      return capabilities();
    }

    default: {
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
    return;
  }

  if (method === "initialize") {
    const clientVersion =
      params && params.protocolVersion ? params.protocolVersion : "2025-06-18";
    const response = makeResponse(id, {
      protocolVersion: clientVersion,
      capabilities: {
        tools: {},
        resources: { listChanged: false, subscribe: false },
        prompts: { listChanged: false },
      },
      serverInfo: { name: "zscaler-soc", version: SERVER_VERSION },
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
      process.stdout.write(
        `${JSON.stringify(makeError(id, -32602, `Unknown tool: ${toolName}`))}\n`,
      );
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
    const reviewsDir = path.join(
      path.resolve(new URL("..", import.meta.url).pathname),
      "_data",
      "soc-reviews",
    );
    const resources = [];
    try {
      const entries = fs.readdirSync(reviewsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const slug = entry.name;
        resources.push(
          { uri: `soc://review/${slug}/report`, name: `${slug} — report`, mimeType: "text/markdown" },
          { uri: `soc://review/${slug}/register`, name: `${slug} — register`, mimeType: "text/markdown" },
          { uri: `soc://review/${slug}/status`, name: `${slug} — status`, mimeType: "application/json" },
        );
      }
    } catch {
      // _data/soc-reviews absent — return empty list.
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
        name: "soc-review",
        description:
          "Start a new Zscaler SOC posture review with the SOC role entrypoint. " +
          "Drives the evidence-gated posture-review workflow: soc_status -> open_review -> record_evidence (as needed) -> record_finding (evidence-gated, frameworks classify not prove) -> render_soc_report.",
        arguments: [
          {
            name: "scope",
            description: "The review scope (directory, file, topic, or problem statement).",
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

    if (promptName === "soc-review") {
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
          "SOC role entrypoint with evidence-gated posture-review workflow, framework-not-evidence guard, and answer-from-artifact rule.",
        messages: [{ role: "user", content: { type: "text", text } }],
      });
      process.stdout.write(`${JSON.stringify(resp)}\n`);
      return;
    }

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

const _RESOURCE_ROOT = path.resolve(new URL("..", import.meta.url).pathname);
process.stderr.write(`[soc-mcp-server] resource root: ${_RESOURCE_ROOT}\n`);

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
        process.stderr.write(`[soc-mcp-server] unhandled error: ${err.message}\n`);
      }
    }
    newlineIndex = buffer.indexOf("\n");
  }
});

process.stdin.on("end", () => {
  process.exit(0);
});
