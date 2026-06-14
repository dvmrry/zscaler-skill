#!/usr/bin/env node
/**
 * check-mcp-conformance.mjs
 *
 * MCP Inspector conformance gate for ALL role servers (investigator, auditor,
 * SOC). Previously this gate ran against the investigator server only, leaving
 * the two newer shipped servers ungated; it now runs the same in-process
 * JSON-RPC conformance suite against every role, parameterized by a small
 * per-role config (URI templates, prompt names, status tool).
 *
 * Attempts to run the official MCP Inspector CLI via npx first. If the inspector
 * binary is unavailable (offline CI, first-run cold cache), it degrades
 * gracefully: falls back to in-process JSON-RPC conformance assertions and
 * prints a clear note that the official inspector was not run.
 *
 * Wire this into check-fast.mjs as a check that degrades on inspector absence
 * but hard-fails on any conformance violation the in-process checks catch.
 *
 * Zero-dependency: uses only Node stdlib + npx (runtime, not a package.json dep).
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { spawnMcpServer } from "./mcp-stdio-client.mjs";

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REQUEST_TIMEOUT_MS = 15_000;
const PROTOCOL_VERSION = "2025-06-18";

// ── Per-role conformance config ──────────────────────────────────────────────
//
// Everything that diverges per role lives here; the assertion suite below is
// role-agnostic. `requiredArgPrompt` is null for roles whose single prompt has
// no required argument (auditor, SOC) — the missing-required-arg check is
// skipped for them rather than asserting a prompt they do not have.
const ROLE_CONFIGS = [
  {
    role: "investigator",
    serverName: "zscaler-investigator",
    serverScript: path.join(SCRIPTS_DIR, "investigator-mcp-server.mjs"),
    expectedTemplates: [
      "investigator://case/{slug}/report",
      "investigator://case/{slug}/journal",
      "investigator://case/{slug}/status",
    ],
    promptNames: ["investigate", "resume-case"],
    primaryPrompt: "investigate",
    requiredArgPrompt: { name: "resume-case", arg: "case_slug" },
    statusTool: { name: "status", slugParam: "case_slug" },
  },
  {
    role: "auditor",
    serverName: "zscaler-auditor",
    serverScript: path.join(SCRIPTS_DIR, "auditor-mcp-server.mjs"),
    expectedTemplates: [
      "auditor://audit/{slug}/report",
      "auditor://audit/{slug}/register",
      "auditor://audit/{slug}/status",
    ],
    promptNames: ["audit"],
    primaryPrompt: "audit",
    requiredArgPrompt: null,
    statusTool: { name: "audit_status", slugParam: "audit_slug" },
  },
  {
    role: "soc",
    serverName: "zscaler-soc",
    serverScript: path.join(SCRIPTS_DIR, "soc-mcp-server.mjs"),
    expectedTemplates: [
      "soc://review/{slug}/report",
      "soc://review/{slug}/register",
      "soc://review/{slug}/status",
    ],
    promptNames: ["soc-review"],
    primaryPrompt: "soc-review",
    requiredArgPrompt: null,
    statusTool: { name: "soc_status", slugParam: "review_slug" },
  },
];

// ── In-process conformance assertions ────────────────────────────────────────

async function runInProcessConformance(config) {
  const server = spawnMcpServer(config.serverScript, { requestTimeoutMs: REQUEST_TIMEOUT_MS });
  const failures = [];
  const fail = (msg) => failures.push(`[${config.role}] ${msg}`);

  try {
    // ── initialize handshake ──────────────────────────────────────────────
    const initResp = await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: "conformance-check", version: "0.0.1" } },
    });
    if (initResp.error) fail(`initialize returned error: ${JSON.stringify(initResp.error)}`);
    if (!initResp.result) fail("initialize: no result");
    if (initResp.result) {
      if (initResp.result.protocolVersion !== PROTOCOL_VERSION) {
        fail(`initialize: protocolVersion echo mismatch — expected ${PROTOCOL_VERSION} got ${initResp.result.protocolVersion}`);
      }
      const serverInfo = initResp.result.serverInfo || {};
      if (serverInfo.name !== config.serverName) {
        fail(`initialize: serverInfo.name mismatch — expected ${config.serverName} got ${serverInfo.name}`);
      }
      const caps = initResp.result.capabilities || {};
      if (!caps.tools) fail("initialize: capabilities.tools missing");
      if (!caps.resources) fail("initialize: capabilities.resources missing");
      if (!caps.prompts) fail("initialize: capabilities.prompts missing");
      if (caps.resources && caps.resources.subscribe !== false) {
        fail("initialize: capabilities.resources.subscribe should be false");
      }
      if (caps.resources && caps.resources.listChanged !== false) {
        fail("initialize: capabilities.resources.listChanged should be false");
      }
      if (caps.prompts && caps.prompts.listChanged !== false) {
        fail("initialize: capabilities.prompts.listChanged should be false");
      }
    }

    // ── tools/list ────────────────────────────────────────────────────────
    const toolsResp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    if (toolsResp.error) fail(`tools/list error: ${JSON.stringify(toolsResp.error)}`);
    const tools = (toolsResp.result || {}).tools || [];
    if (tools.length === 0) fail("tools/list: no tools returned");
    for (const tool of tools) {
      if (!tool.name) fail(`tools/list: tool missing name`);
      if (!tool.inputSchema) fail(`tools/list: tool ${tool.name} missing inputSchema`);
      if (!tool.annotations) fail(`tools/list: tool ${tool.name} missing annotations`);
      if (tool.annotations) {
        for (const key of ["readOnlyHint", "destructiveHint", "idempotentHint", "openWorldHint"]) {
          if (typeof tool.annotations[key] !== "boolean") {
            fail(`tools/list: tool ${tool.name} annotations.${key} is not boolean`);
          }
        }
      }
    }

    // ── unknown tool returns -32602 ───────────────────────────────────────
    const unknownResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "__nonexistent__", arguments: {} },
    });
    if (!unknownResp.error) fail("tools/call unknown tool: expected JSON-RPC error, got result");
    if (unknownResp.error && unknownResp.error.code !== -32602) {
      fail(`tools/call unknown tool: expected -32602, got ${unknownResp.error.code}`);
    }

    // ── resources/templates/list ──────────────────────────────────────────
    const templatesResp = await server.call({ jsonrpc: "2.0", method: "resources/templates/list", params: {} });
    if (templatesResp.error) fail(`resources/templates/list error: ${JSON.stringify(templatesResp.error)}`);
    const templates = (templatesResp.result || {}).resourceTemplates || [];
    if (templates.length === 0) fail("resources/templates/list: no templates returned");
    for (const uriTemplate of config.expectedTemplates) {
      if (!templates.some((t) => t.uriTemplate === uriTemplate)) {
        fail(`resources/templates/list: missing template ${uriTemplate}`);
      }
    }

    // ── resources/list ────────────────────────────────────────────────────
    const resourcesResp = await server.call({ jsonrpc: "2.0", method: "resources/list", params: {} });
    if (resourcesResp.error) fail(`resources/list error: ${JSON.stringify(resourcesResp.error)}`);
    // resources/list may return an empty array if no artifacts exist — conformant.

    // ── prompts/list ──────────────────────────────────────────────────────
    const promptsResp = await server.call({ jsonrpc: "2.0", method: "prompts/list", params: {} });
    if (promptsResp.error) fail(`prompts/list error: ${JSON.stringify(promptsResp.error)}`);
    const prompts = (promptsResp.result || {}).prompts || [];
    for (const name of config.promptNames) {
      if (!prompts.some((p) => p.name === name)) fail(`prompts/list: missing '${name}' prompt`);
    }

    // ── prompts/get — primary prompt (no required args) ───────────────────
    const getPrimaryResp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: config.primaryPrompt, arguments: {} },
    });
    if (getPrimaryResp.error) fail(`prompts/get ${config.primaryPrompt} error: ${JSON.stringify(getPrimaryResp.error)}`);
    if (getPrimaryResp.result) {
      const msgs = getPrimaryResp.result.messages || [];
      if (msgs.length === 0) fail(`prompts/get ${config.primaryPrompt}: no messages returned`);
      if (msgs[0] && msgs[0].role !== "user") fail(`prompts/get ${config.primaryPrompt}: first message role should be user`);
    }

    // ── prompts/get — missing required arg returns -32602 (if applicable) ──
    if (config.requiredArgPrompt) {
      const { name, arg } = config.requiredArgPrompt;
      const missingArgResp = await server.call({
        jsonrpc: "2.0",
        method: "prompts/get",
        params: { name, arguments: {} },
      });
      if (!missingArgResp.error) fail(`prompts/get ${name} without ${arg}: expected error`);
      if (missingArgResp.error && missingArgResp.error.code !== -32602) {
        fail(`prompts/get ${name} without ${arg}: expected -32602, got ${missingArgResp.error.code}`);
      }
    }

    // ── unknown prompt returns -32602 ─────────────────────────────────────
    const unknownPromptResp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "__nonexistent__", arguments: {} },
    });
    if (!unknownPromptResp.error) fail("prompts/get unknown: expected error");
    if (unknownPromptResp.error && unknownPromptResp.error.code !== -32602) {
      fail(`prompts/get unknown: expected -32602, got ${unknownPromptResp.error.code}`);
    }

    // ── status tool returns result or error (does not crash) ──────────────
    const statusToolResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: config.statusTool.name,
        arguments: { root: SCRIPTS_DIR, [config.statusTool.slugParam]: "nonexistent-slug-for-conformance-check" },
      },
    });
    // status on a missing slug throws → isError result; but the important thing
    // is the server returns *something* and does not crash.
    if (!statusToolResp.result && !statusToolResp.error) {
      fail(`tools/call ${config.statusTool.name}: expected result or error, got neither`);
    }

  } catch (err) {
    fail(`Unexpected error during in-process checks: ${err.message}`);
  } finally {
    server.close();
  }

  return failures;
}

// ── Official inspector attempt ────────────────────────────────────────────────

async function tryOfficialInspector() {
  return new Promise((resolve) => {
    // Verify the CLI flag: npx @modelcontextprotocol/inspector --cli
    // We first check --help to discover available flags without running a full session.
    const child = spawn(
      "npx",
      ["--yes", "@modelcontextprotocol/inspector", "--help"],
      { stdio: ["pipe", "pipe", "pipe"], timeout: 30_000 },
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (c) => { stdout += c; });
    child.stderr.on("data", (c) => { stderr += c; });
    child.on("error", () => resolve({ available: false, reason: "npx/inspector not reachable" }));
    child.on("close", (code) => {
      // If --help exits 0 or 1 but produced output, the inspector is present.
      const output = stdout + stderr;
      if (output.length > 10) {
        resolve({ available: true, helpOutput: output });
      } else {
        resolve({ available: false, reason: `inspector --help produced no output (exit ${code})` });
      }
    });
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

const inspectorCheck = await tryOfficialInspector();
if (!inspectorCheck.available) {
  console.log(`NOTE: Official MCP Inspector not run — ${inspectorCheck.reason}`);
  console.log("Falling back to in-process JSON-RPC conformance assertions.");
} else {
  console.log("MCP Inspector available. Running in-process conformance assertions (inspector --cli integration pending).");
  // The inspector CLI flags vary by version; fall through to in-process checks
  // which are deterministic and do not require a specific inspector version.
}

const allFailures = [];
for (const config of ROLE_CONFIGS) {
  const failures = await runInProcessConformance(config);
  if (failures.length === 0) {
    console.log(`  ✓ ${config.role}: conformance checks passed`);
  } else {
    console.log(`  ✗ ${config.role}: ${failures.length} conformance failure(s)`);
    allFailures.push(...failures);
  }
}

if (allFailures.length > 0) {
  console.error("\nMCP conformance failures:");
  for (const f of allFailures) {
    console.error(`  - ${f}`);
  }
  process.exit(1);
}

console.log(`\nMCP conformance checks passed (in-process) for ${ROLE_CONFIGS.length} role servers.`);
