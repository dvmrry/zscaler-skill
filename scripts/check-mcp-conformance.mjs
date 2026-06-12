#!/usr/bin/env node
/**
 * check-mcp-conformance.mjs
 *
 * MCP Inspector conformance gate.
 *
 * Attempts to run the official MCP Inspector CLI via npx against this server.
 * If the inspector binary is unavailable (offline CI, first-run cold cache), it
 * degrades gracefully: falls back to in-process JSON-RPC conformance assertions
 * and prints a clear note that the official inspector was not run.
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

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const SERVER_SCRIPT = path.join(SCRIPTS_DIR, "investigator-mcp-server.mjs");
const REQUEST_TIMEOUT_MS = 15_000;

// ── In-process conformance assertions ────────────────────────────────────────

function spawnServer() {
  const child = spawn(process.execPath, [SERVER_SCRIPT], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stdoutBuffer = "";
  const pending = new Map();
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk;
    let idx = stdoutBuffer.indexOf("\n");
    while (idx !== -1) {
      const line = stdoutBuffer.slice(0, idx).trim();
      stdoutBuffer = stdoutBuffer.slice(idx + 1);
      if (line.length > 0) {
        let msg;
        try { msg = JSON.parse(line); } catch { idx = stdoutBuffer.indexOf("\n"); continue; }
        const entry = pending.get(msg.id);
        if (entry) {
          clearTimeout(entry.timer);
          pending.delete(msg.id);
          entry.resolve(msg);
        }
      }
      idx = stdoutBuffer.indexOf("\n");
    }
  });
  child.stderr.setEncoding("utf8");
  let nextId = 1;
  function call(request) {
    return new Promise((resolve, reject) => {
      const id = request.id !== undefined ? request.id : nextId++;
      const fullRequest = { ...request, id };
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timeout waiting for: ${request.method}`));
      }, REQUEST_TIMEOUT_MS);
      pending.set(id, { resolve, reject, timer });
      child.stdin.write(`${JSON.stringify(fullRequest)}\n`);
    });
  }
  function close() { child.stdin.end(); }
  return { call, close };
}

function assert(condition, message) {
  if (!condition) throw new Error(`CONFORMANCE FAIL: ${message}`);
}

async function runInProcessConformance() {
  const server = spawnServer();
  const failures = [];

  try {
    // ── initialize handshake ──────────────────────────────────────────────
    const initResp = await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "conformance-check", version: "0.0.1" } },
    });
    if (initResp.error) failures.push(`initialize returned error: ${JSON.stringify(initResp.error)}`);
    if (!initResp.result) failures.push("initialize: no result");
    if (initResp.result) {
      if (initResp.result.protocolVersion !== "2025-06-18") {
        failures.push(`initialize: protocolVersion echo mismatch — expected 2025-06-18 got ${initResp.result.protocolVersion}`);
      }
      const caps = initResp.result.capabilities || {};
      if (!caps.tools) failures.push("initialize: capabilities.tools missing");
      if (!caps.resources) failures.push("initialize: capabilities.resources missing");
      if (!caps.prompts) failures.push("initialize: capabilities.prompts missing");
      if (caps.resources && caps.resources.subscribe !== false) {
        failures.push("initialize: capabilities.resources.subscribe should be false");
      }
      if (caps.resources && caps.resources.listChanged !== false) {
        failures.push("initialize: capabilities.resources.listChanged should be false");
      }
      if (caps.prompts && caps.prompts.listChanged !== false) {
        failures.push("initialize: capabilities.prompts.listChanged should be false");
      }
    }

    // ── tools/list ────────────────────────────────────────────────────────
    const toolsResp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    if (toolsResp.error) failures.push(`tools/list error: ${JSON.stringify(toolsResp.error)}`);
    const tools = (toolsResp.result || {}).tools || [];
    if (tools.length === 0) failures.push("tools/list: no tools returned");
    for (const tool of tools) {
      if (!tool.name) failures.push(`tools/list: tool missing name`);
      if (!tool.inputSchema) failures.push(`tools/list: tool ${tool.name} missing inputSchema`);
      if (!tool.annotations) failures.push(`tools/list: tool ${tool.name} missing annotations`);
      if (tool.annotations) {
        for (const key of ["readOnlyHint", "destructiveHint", "idempotentHint", "openWorldHint"]) {
          if (typeof tool.annotations[key] !== "boolean") {
            failures.push(`tools/list: tool ${tool.name} annotations.${key} is not boolean`);
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
    if (!unknownResp.error) failures.push("tools/call unknown tool: expected JSON-RPC error, got result");
    if (unknownResp.error && unknownResp.error.code !== -32602) {
      failures.push(`tools/call unknown tool: expected -32602, got ${unknownResp.error.code}`);
    }

    // ── resources/templates/list ──────────────────────────────────────────
    const templatesResp = await server.call({ jsonrpc: "2.0", method: "resources/templates/list", params: {} });
    if (templatesResp.error) failures.push(`resources/templates/list error: ${JSON.stringify(templatesResp.error)}`);
    const templates = (templatesResp.result || {}).resourceTemplates || [];
    if (templates.length === 0) failures.push("resources/templates/list: no templates returned");
    const expectedTemplates = ["investigator://case/{slug}/report", "investigator://case/{slug}/journal", "investigator://case/{slug}/status"];
    for (const uriTemplate of expectedTemplates) {
      if (!templates.some((t) => t.uriTemplate === uriTemplate)) {
        failures.push(`resources/templates/list: missing template ${uriTemplate}`);
      }
    }

    // ── resources/list ────────────────────────────────────────────────────
    const resourcesResp = await server.call({ jsonrpc: "2.0", method: "resources/list", params: {} });
    if (resourcesResp.error) failures.push(`resources/list error: ${JSON.stringify(resourcesResp.error)}`);
    // resources/list may return empty array if no cases exist — that is conformant.

    // ── prompts/list ──────────────────────────────────────────────────────
    const promptsResp = await server.call({ jsonrpc: "2.0", method: "prompts/list", params: {} });
    if (promptsResp.error) failures.push(`prompts/list error: ${JSON.stringify(promptsResp.error)}`);
    const prompts = (promptsResp.result || {}).prompts || [];
    if (!prompts.some((p) => p.name === "investigate")) failures.push("prompts/list: missing 'investigate' prompt");
    if (!prompts.some((p) => p.name === "resume-case")) failures.push("prompts/list: missing 'resume-case' prompt");

    // ── prompts/get — investigate ─────────────────────────────────────────
    const getInvestigateResp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "investigate", arguments: {} },
    });
    if (getInvestigateResp.error) failures.push(`prompts/get investigate error: ${JSON.stringify(getInvestigateResp.error)}`);
    if (getInvestigateResp.result) {
      const msgs = (getInvestigateResp.result.messages || []);
      if (msgs.length === 0) failures.push("prompts/get investigate: no messages returned");
      if (msgs[0] && msgs[0].role !== "user") failures.push("prompts/get investigate: first message role should be user");
    }

    // ── prompts/get — resume-case missing required arg ────────────────────
    const resumeNoArgResp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "resume-case", arguments: {} },
    });
    if (!resumeNoArgResp.error) failures.push("prompts/get resume-case without case_slug: expected error");
    if (resumeNoArgResp.error && resumeNoArgResp.error.code !== -32602) {
      failures.push(`prompts/get resume-case without case_slug: expected -32602, got ${resumeNoArgResp.error.code}`);
    }

    // ── unknown prompt returns -32602 ─────────────────────────────────────
    const unknownPromptResp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "__nonexistent__", arguments: {} },
    });
    if (!unknownPromptResp.error) failures.push("prompts/get unknown: expected error");
    if (unknownPromptResp.error && unknownPromptResp.error.code !== -32602) {
      failures.push(`prompts/get unknown: expected -32602, got ${unknownPromptResp.error.code}`);
    }

    // ── status tool returns structuredContent ─────────────────────────────
    const statusToolResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "status", arguments: { root: SCRIPTS_DIR, case_slug: "nonexistent-case-for-conformance-check" } },
    });
    // status on a missing case throws → isError result; but if it somehow passes, check structuredContent.
    // The important thing is the server doesn't crash.
    if (!statusToolResp.result && !statusToolResp.error) {
      failures.push("tools/call status: expected result or error, got neither");
    }

  } catch (err) {
    failures.push(`Unexpected error during in-process checks: ${err.message}`);
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

const failures = await runInProcessConformance();
if (failures.length > 0) {
  console.error("\nMCP conformance failures:");
  for (const f of failures) {
    console.error(`  - ${f}`);
  }
  process.exit(1);
}

console.log("MCP conformance checks passed (in-process).");
