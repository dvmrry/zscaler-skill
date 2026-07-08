#!/usr/bin/env node
/**
 * investigator-mcp-server.test.mjs
 *
 * Tests for the MCP stdio server. Spawns the server as a child process and
 * communicates via newline-delimited JSON-RPC 2.0 over stdio.
 */
import assert from "node:assert/strict";
import { spawnMcpServer } from "./mcp-stdio-client.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPTS_DIR, "..");
const SERVER_SCRIPT = path.join(SCRIPTS_DIR, "investigator-mcp-server.mjs");

// ── Minimal fixture helpers (inlined; do not import from other test files) ────

function makeRepoFiles(root, relativePaths) {
  for (const relativePath of relativePaths) {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `# ${path.basename(relativePath)}\n`, "utf8");
  }
}

function tempFixtureRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "inv-mcp-test-"));
  makeRepoFiles(root, [
    "agents/investigator/prompt.md",
    "agents/investigator/harness.md",
  ]);
  return root;
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const VALID_JOURNAL_CONTENT = `# Discovery Journal

ISSUE: ZPA users cannot reach wiki.internal
STATUS: Investigating

## Framing

| Field | Value |
|---|---|
| Symptom | ZPA users cannot reach wiki.internal |

## Proposed Loads

- agents/investigator/prompt.md
- agents/investigator/harness.md

## Claims

| Claim | Source | Status | Next evidence needed | Timestamp | Notes |
|---|---|---|---|---|---|
| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |

## Resolution

Open.
`;

// Keep Open (uncertain) — the run_turn happy-path action type is load-file, which records
// no evidence.  Transitioning to Confirmed (high) here would require a verifiable evidenceRef
// in priorEvidenceRefs(events), which does not exist on the first turn (Change 3 gate).
const UPDATED_JOURNAL_CONTENT = VALID_JOURNAL_CONTENT.replace(
  "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Check app segment | 2026-06-10T00:00:00Z | reference-grounded |",
  "| H1: Segment missing | references/zpa/app-segments.md | Open (uncertain) | Review connector group | 2026-06-10T01:00:00Z | snapshot-checked |",
);

// ── Server spawn + JSON-RPC helper ────────────────────────────────────────────

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Spawn the server, send requests, collect responses, then close.
 *
 * Thin wrapper over the shared stdio client (scripts/mcp-stdio-client.mjs) so
 * every existing `spawnServer()` call site keeps working unchanged.
 *
 * Usage:
 *   const server = spawnServer();
 *   const result = await server.call({ jsonrpc: "2.0", id: 1, method: "ping" });
 *   server.close();
 */
function spawnServer() {
  return spawnMcpServer(SERVER_SCRIPT, { requestTimeoutMs: REQUEST_TIMEOUT_MS });
}

// ── initialize handshake ──────────────────────────────────────────────────────

test("initialize returns serverInfo.name and version matching VERSION file", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test", version: "0.0.1" },
      },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    assert.equal(resp.result.serverInfo.name, "zscaler-investigator");

    const versionFile = path.join(REPO_ROOT, "VERSION");
    const expected = fs.readFileSync(versionFile, "utf8").trim();
    assert.equal(resp.result.serverInfo.version, expected);
    assert.equal(resp.result.protocolVersion, "2024-11-05");
    assert.ok(resp.result.capabilities);
  } finally {
    server.close();
  }
});

test("tools/list returns all 14 tools with inputSchemas and annotations", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const tools = resp.result.tools;
    assert.equal(tools.length, 14, `expected 14 tools, got ${tools.length}: ${tools.map((t) => t.name).join(", ")}`);
    for (const tool of tools) {
      assert.ok(tool.name, "tool missing name");
      assert.ok(tool.inputSchema, `tool ${tool.name} missing inputSchema`);
      assert.equal(tool.inputSchema.type, "object", `tool ${tool.name} inputSchema.type is not object`);
      // A2: every tool must have annotations with all four boolean hints.
      assert.ok(tool.annotations, `tool ${tool.name} missing annotations`);
      assert.equal(typeof tool.annotations.readOnlyHint, "boolean", `tool ${tool.name} annotations.readOnlyHint is not boolean`);
      assert.equal(typeof tool.annotations.destructiveHint, "boolean", `tool ${tool.name} annotations.destructiveHint is not boolean`);
      assert.equal(typeof tool.annotations.idempotentHint, "boolean", `tool ${tool.name} annotations.idempotentHint is not boolean`);
      assert.equal(typeof tool.annotations.openWorldHint, "boolean", `tool ${tool.name} annotations.openWorldHint is not boolean`);
      // A2: every tool must have a title.
      assert.ok(tool.title, `tool ${tool.name} missing title`);
    }
  } finally {
    server.close();
  }
});

// ── protocol surface ──────────────────────────────────────────────────────────

test("ping responds with empty result", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({ jsonrpc: "2.0", method: "ping", params: {} });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    assert.deepEqual(resp.result, {});
  } finally {
    server.close();
  }
});

test("unknown method returns -32601 error", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({ jsonrpc: "2.0", method: "no/such/method", params: {} });
    assert.ok(resp.error, "expected a JSON-RPC error");
    assert.equal(resp.error.code, -32601);
  } finally {
    server.close();
  }
});

test("server survives an error call and serves the next request", async () => {
  const server = spawnServer();
  try {
    // A tools/call for an unknown tool now returns a JSON-RPC protocol error (-32602), not a crash.
    const errResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "nonexistent_tool", arguments: {} },
    });
    assert.ok(errResp.error, "expected a JSON-RPC error for unknown tool");
    assert.equal(errResp.error.code, -32602, `expected -32602, got ${errResp.error.code}`);

    // Server must still respond to subsequent requests.
    const pingResp = await server.call({ jsonrpc: "2.0", method: "ping", params: {} });
    assert.deepEqual(pingResp.result, {});
  } finally {
    server.close();
  }
});

test("server survives a helper throw and serves the next request (dispatchTool catch path)", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });

    // Call a real, known tool (status) with a non-existent root — this routes through
    // dispatchTool and hits the catch branch when the helper throws.
    const errResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "status",
        arguments: { root: "/nonexistent-path-that-cannot-exist-abc123", case_slug: "any-slug" },
      },
    });
    assert.ok(errResp.result, "expected a result object, not a top-level error");
    assert.equal(errResp.result.isError, true, "expected isError:true from dispatchTool catch");
    // The helper error message should be passed through verbatim.
    assert.match(
      errResp.result.content[0].text,
      /does not exist or is not a directory/,
      `expected actionable root-not-found message, got: ${errResp.result.content[0].text}`,
    );

    // Server must still respond to subsequent requests — proving it didn't crash.
    const pingResp = await server.call({ jsonrpc: "2.0", method: "ping", params: {} });
    assert.deepEqual(pingResp.result, {});
  } finally {
    server.close();
  }
});

test("notifications/initialized is accepted silently (no response expected)", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    server.sendNotification({ jsonrpc: "2.0", method: "notifications/initialized" });
    // Confirm the server still responds to subsequent requests.
    const pingResp = await server.call({ jsonrpc: "2.0", method: "ping", params: {} });
    assert.deepEqual(pingResp.result, {});
  } finally {
    server.close();
  }
});

// ── Happy path: open_case -> record_loads -> initialize_turn_ledger -> status -> run_turn ──

test("full happy path: open_case -> record_loads -> initialize_turn_ledger -> status turn-ready -> run_turn advances sequence", async () => {
  const root = tempFixtureRepo();
  const caseSlug = `mcp-happy-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });

    // Step 1: open_case
    const openResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_case",
        arguments: {
          root,
          case_slug: caseSlug,
          framing: {
            workingDirectory: root,
            symptom: "ZPA users cannot reach wiki.internal",
            tenantCloud: "zs2",
            products: ["zpa"],
            scope: "many users",
          },
          proposed_loads: [
            "agents/investigator/prompt.md",
            "agents/investigator/harness.md",
          ],
        },
      },
    });
    assert.ok(!openResp.error, `open_case error: ${JSON.stringify(openResp.error)}`);
    assert.ok(!openResp.result.isError, `open_case isError: ${openResp.result.content[0].text}`);
    const openResult = JSON.parse(openResp.result.content[0].text);
    assert.equal(openResult.status, "pass");

    // Step 2: record_loads
    const recordResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_loads",
        arguments: {
          root,
          case_slug: caseSlug,
          loaded: [
            "agents/investigator/prompt.md",
            "agents/investigator/harness.md",
          ],
          deferred: [],
        },
      },
    });
    assert.ok(!recordResp.result.isError, `record_loads isError: ${recordResp.result.content[0].text}`);
    const recordResult = JSON.parse(recordResp.result.content[0].text);
    assert.equal(recordResult.status, "pass");

    // Step 3: initialize_turn_ledger with journal_content
    const initResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "initialize_turn_ledger",
        arguments: {
          root,
          case_slug: caseSlug,
          journal_content: VALID_JOURNAL_CONTENT,
        },
      },
    });
    assert.ok(!initResp.result.isError, `initialize_turn_ledger isError: ${initResp.result.content[0].text}`);
    const initResult = JSON.parse(initResp.result.content[0].text);
    assert.equal(initResult.status, "pass");

    // status should show turn-ready
    const statusResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "status",
        arguments: { root, case_slug: caseSlug },
      },
    });
    assert.ok(!statusResp.result.isError, `status isError: ${statusResp.result.content[0].text}`);
    const statusResult = JSON.parse(statusResp.result.content[0].text);
    assert.equal(statusResult.ledger.present, true);
    assert.equal(statusResult.ledger.consistent, true);
    assert.equal(statusResult.ledger.pendingTurn, null);

    // run_turn: single atomic turn (load-file action — journal must change)
    const runResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "run_turn",
        arguments: {
          root,
          case_slug: caseSlug,
          user_action: "continue-top-open",
          journal_content: UPDATED_JOURNAL_CONTENT,
          turn_input: {
            actionType: "load-file",
            actionSummary: "Checked app segment references.",
            touchedClaims: ["H1: Segment missing"],
            evidenceRefs: [],
            allowedNext: ["continue-top-open", "pause"],
          },
        },
      },
    });
    assert.ok(!runResp.result.isError, `run_turn isError: ${runResp.result.content[0].text}`);
    const runResult = JSON.parse(runResp.result.content[0].text);
    assert.equal(runResult.status, "pass");
    assert.equal(runResult.event.sequence, 1);
  } finally {
    server.close();
  }
});

// ── Gate equivalence tests ─────────────────────────────────────────────────────

test("initialize_turn_ledger WITHOUT record_loads returns isError mentioning record-loads", async () => {
  const root = tempFixtureRepo();
  const caseSlug = `mcp-gate-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });

    // open_case (no record_loads after)
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_case",
        arguments: {
          root,
          case_slug: caseSlug,
          framing: {
            workingDirectory: root,
            symptom: "ZPA users cannot reach wiki.internal",
            tenantCloud: "zs2",
            products: ["zpa"],
            scope: "many users",
          },
          proposed_loads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
        },
      },
    });

    // initialize_turn_ledger without record_loads
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "initialize_turn_ledger",
        arguments: {
          root,
          case_slug: caseSlug,
          journal_content: VALID_JOURNAL_CONTENT,
        },
      },
    });
    assert.equal(resp.result.isError, true);
    const msg = resp.result.content[0].text;
    assert.match(msg, /record-loads/i, `error message should mention record-loads, got: ${msg}`);
  } finally {
    server.close();
  }
});

test("run_turn with invalid actionType returns isError listing valid actionType values", async () => {
  const root = tempFixtureRepo();
  const caseSlug = `mcp-badaction-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });

    // Set up a fully-initialized case.
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_case",
        arguments: {
          root,
          case_slug: caseSlug,
          framing: {
            workingDirectory: root,
            symptom: "ZPA users cannot reach wiki.internal",
            tenantCloud: "zs2",
            products: ["zpa"],
            scope: "many users",
          },
          proposed_loads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
        },
      },
    });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_loads",
        arguments: {
          root,
          case_slug: caseSlug,
          loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
        },
      },
    });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "initialize_turn_ledger",
        arguments: { root, case_slug: caseSlug, journal_content: VALID_JOURNAL_CONTENT },
      },
    });

    // run_turn with invalid actionType
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "run_turn",
        arguments: {
          root,
          case_slug: caseSlug,
          user_action: "continue-top-open",
          journal_content: UPDATED_JOURNAL_CONTENT,
          turn_input: {
            actionType: "invent-new-action",
            actionSummary: "bad",
            touchedClaims: ["H1: Segment missing"],
          },
        },
      },
    });
    assert.equal(resp.result.isError, true);
    const msg = resp.result.content[0].text;
    // Error must list valid actionType values.
    assert.match(msg, /load-file|query-request|pause/, `error should list valid actionTypes, got: ${msg}`);
  } finally {
    server.close();
  }
});

test("open_case with telemetry proposed load and no telemetry framing produces blocked status in result", async () => {
  const root = tempFixtureRepo();
  // Add the telemetry reference file to the fixture.
  makeRepoFiles(root, ["references/zia/logs/web-log-schema.md"]);
  const caseSlug = `mcp-telemetry-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });

    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_case",
        arguments: {
          root,
          case_slug: caseSlug,
          framing: {
            workingDirectory: root,
            symptom: "ZIA block page appears for payroll site",
            tenantCloud: "zs1",
            products: ["zia"],
            scope: "one user",
            // No telemetry evidence in framing.
          },
          proposed_loads: [
            "agents/investigator/prompt.md",
            "agents/investigator/harness.md",
            "references/zia/logs/web-log-schema.md",
          ],
        },
      },
    });
    // The tool should NOT be isError — it returns a blocked result, not a thrown error.
    assert.ok(!resp.result.isError, `unexpected isError: ${resp.result.content[0].text}`);
    const result = JSON.parse(resp.result.content[0].text);
    assert.equal(result.status, "blocked", `expected blocked, got: ${result.status}`);
    const issues = result.blockingIssues.join(" ");
    assert.match(issues, /telemetry/i, `expected telemetry mention in blockingIssues: ${issues}`);
  } finally {
    server.close();
  }
});

test("tools/call for unknown tool returns JSON-RPC -32602 protocol error", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "totally_unknown_tool", arguments: {} },
    });
    // Per MCP spec 2025-11-25: unknown tool is a Protocol Error, not an isError result.
    assert.ok(resp.error, "expected a JSON-RPC error object");
    assert.equal(resp.error.code, -32602, `expected -32602, got ${resp.error.code}`);
    assert.match(resp.error.message, /Unknown tool/, `error message should name the tool, got: ${resp.error.message}`);
  } finally {
    server.close();
  }
});

// ── Change 1: force removed from MCP schemas ──────────────────────────────────

test("tools/list: no tool schema contains a force property", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const tools = resp.result.tools;
    for (const tool of tools) {
      const schema = tool.inputSchema || {};
      const properties = schema.properties || {};
      assert.ok(
        !Object.prototype.hasOwnProperty.call(properties, "force"),
        `tool ${tool.name} inputSchema.properties must not contain 'force'`,
      );
    }
  } finally {
    server.close();
  }
});

test("passing force to open_case returns isError with MCP repair message", async () => {
  const root = tempFixtureRepo();
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_case",
        arguments: {
          root,
          case_slug: "2026-06-12-force-test",
          framing: {
            workingDirectory: root,
            symptom: "ZPA users cannot reach wiki.internal",
            tenantCloud: "zs2",
            products: ["zpa"],
            scope: "many users",
          },
          proposed_loads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
          force: true,
        },
      },
    });
    assert.equal(resp.result.isError, true, "expected isError:true when force is passed over MCP");
    const text = resp.result.content[0].text;
    assert.match(text, /force is not available over MCP/, `error must include force-rejection message, got: ${text}`);
    assert.match(
      text,
      /Repair flows: run status and follow its nextCommands\/nextActions\./,
      `error must point to status nextCommands/nextActions, got: ${text}`,
    );
    assert.match(text, /Replacing existing artifacts is a human decision/, `error must include human-decision repair text, got: ${text}`);
  } finally {
    server.close();
  }
});

test("passing force to record_loads returns isError with MCP repair message", async () => {
  const root = tempFixtureRepo();
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_loads",
        arguments: {
          root,
          case_slug: "2026-06-12-force-test",
          loaded: ["agents/investigator/prompt.md"],
          deferred: [],
          force: true,
        },
      },
    });
    assert.equal(resp.result.isError, true, "expected isError:true when force is passed to record_loads over MCP");
    const text = resp.result.content[0].text;
    assert.match(text, /force is not available over MCP/, `error must include force-rejection message, got: ${text}`);
    assert.match(text, /Repair flows: run status and follow its nextCommands\/nextActions\./);
  } finally {
    server.close();
  }
});

test("passing force to initialize_turn_ledger returns isError with MCP repair message", async () => {
  const root = tempFixtureRepo();
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "initialize_turn_ledger",
        arguments: {
          root,
          case_slug: "2026-06-12-force-test",
          force: true,
        },
      },
    });
    assert.equal(resp.result.isError, true, "expected isError:true when force is passed to initialize_turn_ledger over MCP");
    const text = resp.result.content[0].text;
    assert.match(text, /force is not available over MCP/, `error must include force-rejection message, got: ${text}`);
    assert.match(text, /Repair flows: run status and follow its nextCommands\/nextActions\./);
  } finally {
    server.close();
  }
});

// ── Change 4: premise-challenge descriptions ──────────────────────────────────

test("open_case description contains premise-challenge text", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const tool = resp.result.tools.find((t) => t.name === "open_case");
    assert.ok(tool, "open_case tool not found");
    assert.match(
      tool.description,
      /presumes facts not in evidence/,
      `open_case description must contain premise-challenge text, got: ${tool.description}`,
    );
    assert.match(
      tool.description,
      /let evidence decide/,
      `open_case description must contain 'let evidence decide', got: ${tool.description}`,
    );
  } finally {
    server.close();
  }
});

test("run_turn description contains premise-challenge text", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const tool = resp.result.tools.find((t) => t.name === "run_turn");
    assert.ok(tool, "run_turn tool not found");
    assert.match(
      tool.description,
      /Never invent.*simulate.*assume evidence/,
      `run_turn description must prohibit inventing evidence, got: ${tool.description}`,
    );
    assert.match(
      tool.description,
      /Claim statuses only move on recorded evidence/,
      `run_turn description must mention server enforcement, got: ${tool.description}`,
    );
  } finally {
    server.close();
  }
});

test("run_turn description contains evidence-recording import_evidence requirement", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const tool = resp.result.tools.find((t) => t.name === "run_turn");
    assert.ok(tool, "run_turn tool not found");
    assert.match(
      tool.description,
      /record-user-evidence and add-evidence turns require evidenceRefs backed by import_evidence/,
      `run_turn description must require import_evidence-backed refs for evidence-recording turns, got: ${tool.description}`,
    );
    assert.match(
      tool.description,
      /narrative summaries are not evidence/,
      `run_turn description must state narrative summaries are not evidence, got: ${tool.description}`,
    );
  } finally {
    server.close();
  }
});

test("save_journal description contains initial-journal Open-only text", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const tool = resp.result.tools.find((t) => t.name === "save_journal");
    assert.ok(tool, "save_journal tool not found");
    assert.match(
      tool.description,
      /initial journal starts with Open claims only/,
      `save_journal description must state initial journal is Open-only, got: ${tool.description}`,
    );
  } finally {
    server.close();
  }
});

test("initialize_turn_ledger description contains force-not-available and archive text", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const tool = resp.result.tools.find((t) => t.name === "initialize_turn_ledger");
    assert.ok(tool, "initialize_turn_ledger tool not found");
    assert.match(
      tool.description,
      /force is not available over MCP/,
      `initialize_turn_ledger description must state force unavailable over MCP, got: ${tool.description}`,
    );
    assert.match(
      tool.description,
      /archives the prior ledger to workflow\/ledger-archive/,
      `initialize_turn_ledger description must mention ledger-archive, got: ${tool.description}`,
    );
  } finally {
    server.close();
  }
});

// ── Part A conformance tests ──────────────────────────────────────────────────

test("A1: initialize without protocolVersion defaults to 2025-06-18", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { capabilities: {}, clientInfo: { name: "test", version: "0.0.1" } },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    assert.equal(resp.result.protocolVersion, "2025-06-18", `expected default 2025-06-18, got ${resp.result.protocolVersion}`);
  } finally {
    server.close();
  }
});

test("A1: initialize echoes client protocolVersion when present", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    assert.ok(!resp.error);
    assert.equal(resp.result.protocolVersion, "2024-11-05");
  } finally {
    server.close();
  }
});

test("A5: initialize advertises resources and prompts capabilities", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {} },
    });
    assert.ok(!resp.error);
    const caps = resp.result.capabilities;
    assert.ok(caps.resources, "capabilities.resources missing");
    assert.equal(caps.resources.listChanged, false, "resources.listChanged should be false");
    assert.equal(caps.resources.subscribe, false, "resources.subscribe should be false");
    assert.ok(caps.prompts, "capabilities.prompts missing");
    assert.equal(caps.prompts.listChanged, false, "prompts.listChanged should be false");
  } finally {
    server.close();
  }
});

test("A3: successful tool result includes structuredContent", async () => {
  const root = tempFixtureRepo();
  const caseSlug = `mcp-structured-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_case",
        arguments: {
          root,
          case_slug: caseSlug,
          framing: {
            workingDirectory: root,
            symptom: "ZPA users cannot reach wiki.internal",
            tenantCloud: "zs2",
            products: ["zpa"],
            scope: "many users",
          },
          proposed_loads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
        },
      },
    });
    assert.ok(!resp.error);
    assert.ok(!resp.result.isError, `unexpected isError: ${resp.result.content?.[0]?.text}`);
    assert.ok(resp.result.structuredContent, "structuredContent missing from tool result");
    assert.equal(typeof resp.result.structuredContent, "object", "structuredContent should be an object");
    assert.equal(resp.result.structuredContent.status, "pass", "structuredContent.status should be pass");
  } finally {
    server.close();
  }
});

test("A3: status tool outputSchema is present on the tool definition", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const statusTool = resp.result.tools.find((t) => t.name === "status");
    assert.ok(statusTool, "status tool not found");
    assert.ok(statusTool.outputSchema, "status tool missing outputSchema");
    assert.equal(statusTool.outputSchema.type, "object");
    // Phase enum must include known values.
    const phaseEnum = statusTool.outputSchema.properties?.phase?.enum || [];
    assert.ok(phaseEnum.includes("no-case"), "outputSchema.phase enum missing no-case");
    assert.ok(phaseEnum.includes("turn-ready"), "outputSchema.phase enum missing turn-ready");
    assert.ok(phaseEnum.includes("resolved"), "outputSchema.phase enum missing resolved");
  } finally {
    server.close();
  }
});

// ── Part B: resources ─────────────────────────────────────────────────────────

test("resources/templates/list returns three case templates", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "resources/templates/list", params: {} });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const templates = resp.result.resourceTemplates;
    assert.ok(Array.isArray(templates), "resourceTemplates should be an array");
    assert.equal(templates.length, 3, `expected 3 templates, got ${templates.length}`);
    const uris = templates.map((t) => t.uriTemplate);
    assert.ok(uris.includes("investigator://case/{slug}/report"), "missing report template");
    assert.ok(uris.includes("investigator://case/{slug}/journal"), "missing journal template");
    assert.ok(uris.includes("investigator://case/{slug}/status"), "missing status template");
    for (const t of templates) {
      assert.ok(t.name, `template missing name`);
      assert.ok(t.mimeType, `template ${t.uriTemplate} missing mimeType`);
    }
  } finally {
    server.close();
  }
});

test("resources/list returns empty array when _data/cases absent (graceful degrade)", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({ jsonrpc: "2.0", method: "resources/list", params: {} });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    assert.ok(Array.isArray(resp.result.resources), "resources should be an array");
  } finally {
    server.close();
  }
});

test("resources/read returns -32002 for unknown URI", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "investigator://case/nonexistent-slug-xyz/report" },
    });
    assert.ok(resp.error, "expected error for unknown case URI");
    assert.equal(resp.error.code, -32002, `expected -32002, got ${resp.error.code}`);
  } finally {
    server.close();
  }
});

test("resources/read returns -32002 for the status kind of a missing case (consistent with report/journal)", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "investigator://case/nonexistent-slug-xyz/status" },
    });
    assert.ok(resp.error, "status read of a missing case must error, not return phase no-case");
    assert.equal(resp.error.code, -32002, `expected -32002, got ${resp.error.code}`);
  } finally {
    server.close();
  }
});

test("resources/read returns -32002 for unparseable URI", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "https://example.com/not-an-investigator-uri" },
    });
    assert.ok(resp.error, "expected error for non-investigator URI");
    assert.equal(resp.error.code, -32002);
  } finally {
    server.close();
  }
});

test("resources/read returns markdown report for an existing initialized case (in repo _data)", async () => {
  // resources/read uses the server's own _data/cases path (repo-relative).
  // We create the case under REPO_ROOT so the server can find it.
  const caseSlug = `mcp-resource-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const caseDir = path.join(REPO_ROOT, "_data", "cases", caseSlug);
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    // Create a case using the actual REPO_ROOT so resources/read can find it.
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_case",
        arguments: {
          root: REPO_ROOT,
          case_slug: caseSlug,
          framing: { workingDirectory: REPO_ROOT, symptom: "ZPA test symptom", tenantCloud: "zs2", products: ["zpa"], scope: "one user" },
          proposed_loads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
        },
      },
    });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_loads",
        arguments: { root: REPO_ROOT, case_slug: caseSlug, loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"] },
      },
    });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "initialize_turn_ledger",
        arguments: { root: REPO_ROOT, case_slug: caseSlug, journal_content: VALID_JOURNAL_CONTENT },
      },
    });

    // Read the report resource.
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: `investigator://case/${caseSlug}/report` },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const contents = resp.result.contents;
    assert.ok(Array.isArray(contents) && contents.length > 0, "contents should be non-empty");
    assert.equal(contents[0].mimeType, "text/markdown");
    const reportText = contents[0].text;
    // Report must contain journal-derived claim status.
    assert.match(reportText, /Open/, "report should contain Open claim status from journal");
    // Must NOT contain Confirmed (journal has only Open claims).
    assert.doesNotMatch(reportText, /Confirmed/, "report must not claim Confirmed status when journal has only Open claims");
  } finally {
    server.close();
    // Clean up the test case from the real _data directory.
    try { fs.rmSync(caseDir, { recursive: true, force: true }); } catch { /* best-effort */ }
  }
});

test("render_report tool returns report text for an initialized case", async () => {
  const root = tempFixtureRepo();
  const caseSlug = `mcp-render-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_case",
        arguments: {
          root,
          case_slug: caseSlug,
          framing: { workingDirectory: root, symptom: "ZPA render test", tenantCloud: "zs2", products: ["zpa"], scope: "one user" },
          proposed_loads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
        },
      },
    });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_loads",
        arguments: { root, case_slug: caseSlug, loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"] },
      },
    });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "initialize_turn_ledger",
        arguments: { root, case_slug: caseSlug, journal_content: VALID_JOURNAL_CONTENT },
      },
    });

    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "render_report", arguments: { root, case_slug: caseSlug } },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    assert.ok(!resp.result.isError, `unexpected isError: ${resp.result.content?.[0]?.text}`);
    const text = resp.result.content[0].text;
    // Result should contain the report (wrapped in { status, report } object).
    const result = JSON.parse(text);
    assert.equal(result.status, "pass");
    assert.ok(result.report, "report field missing");
    assert.match(result.report, /# Investigation Report/, "report should start with heading");
    // Journal-derived: Open status present.
    assert.match(result.report, /Open/, "report should reflect journal claim status");
  } finally {
    server.close();
  }
});

// ── Part B: renderCaseReport artifact-derivation guard ────────────────────────

test("renderCaseReport: journal says Open, report does not say Confirmed", async () => {
  // This test verifies the artifact-derivation guarantee of renderCaseReport directly
  // through the tool (render_report) using a case whose journal has only Open claims.
  const root = tempFixtureRepo();
  const caseSlug = `mcp-claimguard-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_case",
        arguments: {
          root,
          case_slug: caseSlug,
          framing: { workingDirectory: root, symptom: "Claim guard test", tenantCloud: "zs2", products: ["zpa"], scope: "one user" },
          proposed_loads: ["agents/investigator/prompt.md", "agents/investigator/harness.md"],
        },
      },
    });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_loads",
        arguments: { root, case_slug: caseSlug, loaded: ["agents/investigator/prompt.md", "agents/investigator/harness.md"] },
      },
    });
    await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "initialize_turn_ledger",
        arguments: { root, case_slug: caseSlug, journal_content: VALID_JOURNAL_CONTENT },
      },
    });

    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "render_report", arguments: { root, case_slug: caseSlug } },
    });
    const result = JSON.parse(resp.result.content[0].text);
    // Journal has only "Open (uncertain)" — report must not claim Confirmed.
    assert.doesNotMatch(result.report, /Confirmed/, "report must not say Confirmed when journal has only Open claims");
    // And no fabricated free-text claims can appear because renderCaseReport takes no free text.
    assert.match(result.report, /H1: Segment missing/, "report should contain the journal claim text");
  } finally {
    server.close();
  }
});

// ── Part C: prompts ───────────────────────────────────────────────────────────

test("prompts/list returns investigate and resume-case", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "prompts/list", params: {} });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const prompts = resp.result.prompts;
    assert.ok(Array.isArray(prompts), "prompts should be array");
    const investigate = prompts.find((p) => p.name === "investigate");
    assert.ok(investigate, "investigate prompt missing");
    const resumeCase = prompts.find((p) => p.name === "resume-case");
    assert.ok(resumeCase, "resume-case prompt missing");
    // resume-case must declare case_slug as required.
    const slugArg = resumeCase.arguments?.find((a) => a.name === "case_slug");
    assert.ok(slugArg, "resume-case missing case_slug argument");
    assert.equal(slugArg.required, true, "case_slug should be required");
  } finally {
    server.close();
  }
});

test("prompts/get investigate returns mcp-entrypoint.md content as user message", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "investigate", arguments: {} },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    assert.ok(resp.result.messages, "messages missing");
    const msg = resp.result.messages[0];
    assert.equal(msg.role, "user");
    assert.equal(msg.content.type, "text");
    // Drift guard: served text must match on-disk mcp-entrypoint.md.
    const entrypointPath = path.join(REPO_ROOT, "agents", "investigator", "mcp-entrypoint.md");
    const entrypointContent = fs.readFileSync(entrypointPath, "utf8");
    assert.equal(
      msg.content.text,
      entrypointContent,
      "investigate prompt text must match agents/investigator/mcp-entrypoint.md (drift guard)",
    );
  } finally {
    server.close();
  }
});

test("prompts/get investigate appends framing when provided", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "investigate", arguments: { framing: "ZPA users cannot reach wiki.internal since 09:00 UTC." } },
    });
    assert.ok(!resp.error);
    const text = resp.result.messages[0].content.text;
    assert.match(text, /ZPA users cannot reach wiki\.internal/, "framing should be appended to prompt text");
  } finally {
    server.close();
  }
});

test("prompts/get resume-case without case_slug returns -32602", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "resume-case", arguments: {} },
    });
    assert.ok(resp.error, "expected error when case_slug is missing");
    assert.equal(resp.error.code, -32602, `expected -32602, got ${resp.error.code}`);
  } finally {
    server.close();
  }
});

test("prompts/get resume-case with case_slug returns status-first instruction", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "resume-case", arguments: { case_slug: "2026-06-12-test" } },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const msg = resp.result.messages[0];
    assert.equal(msg.role, "user");
    assert.match(msg.content.text, /status/, "resume-case prompt must instruct running status first");
    assert.match(msg.content.text, /2026-06-12-test/, "resume-case prompt must include the case slug");
  } finally {
    server.close();
  }
});

test("prompts/get unknown prompt name returns -32602", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "__nonexistent_prompt__", arguments: {} },
    });
    assert.ok(resp.error, "expected error for unknown prompt");
    assert.equal(resp.error.code, -32602);
  } finally {
    server.close();
  }
});

// ── Drift guard: mcp-entrypoint.md tool names must exist in tools/list ────────
//
// The entrypoint is now load-bearing (workflow.md routes MCP runtimes to it).
// If a tool referenced in the doc is renamed or removed from the server, this
// test catches the canonical-vs-adapter drift before it reaches production.

test("drift guard: every gate tool named in mcp-entrypoint.md exists in tools/list", async () => {
  // The known gate tool names.  We intersect this set with what the doc
  // actually mentions so the test is stable against prose that naturally
  // contains words like "status" in other contexts.
  const KNOWN_GATE_TOOLS = new Set([
    "status",
    "open_case",
    "record_loads",
    "initialize_turn_ledger",
    "run_turn",
    "render_report",
  ]);

  const entrypointPath = path.join(REPO_ROOT, "agents", "investigator", "mcp-entrypoint.md");
  const entrypointContent = fs.readFileSync(entrypointPath, "utf8");

  // Extract tool tokens: bold (**name**) or inline-code (`name`) sequences
  // that match a known gate tool name.
  const referenced = new Set();
  for (const name of KNOWN_GATE_TOOLS) {
    // Match **name** or `name` (backtick-fenced)
    const boldPattern = new RegExp(`\\*\\*${name}\\*\\*`);
    const codePattern = new RegExp(`\`${name}\``);
    if (boldPattern.test(entrypointContent) || codePattern.test(entrypointContent)) {
      referenced.add(name);
    }
  }

  assert.ok(
    referenced.size > 0,
    `mcp-entrypoint.md must reference at least one known gate tool name (bold or backtick); found none among: ${[...KNOWN_GATE_TOOLS].join(", ")}`,
  );

  // Get the actual tool list from the server.
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    assert.ok(!resp.error, `tools/list error: ${JSON.stringify(resp.error)}`);
    const servedNames = new Set(resp.result.tools.map((t) => t.name));

    const missing = [...referenced].filter((name) => !servedNames.has(name));
    assert.equal(
      missing.length,
      0,
      `mcp-entrypoint.md references tool(s) not in tools/list: ${missing.join(", ")}. ` +
        `Served tools: ${[...servedNames].join(", ")}`,
    );
  } finally {
    server.close();
  }
});
