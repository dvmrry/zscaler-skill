#!/usr/bin/env node
/**
 * investigator-mcp-server.test.mjs
 *
 * Tests for the MCP stdio server. Spawns the server as a child process and
 * communicates via newline-delimited JSON-RPC 2.0 over stdio.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
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
 * Usage:
 *   const server = spawnServer();
 *   const result = await server.call({ jsonrpc: "2.0", id: 1, method: "ping" });
 *   server.close();
 */
function spawnServer() {
  const child = spawn(process.execPath, [SERVER_SCRIPT], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdoutBuffer = "";
  const pending = new Map(); // id -> { resolve, reject, timer }

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk;
    let newlineIndex = stdoutBuffer.indexOf("\n");
    while (newlineIndex !== -1) {
      const line = stdoutBuffer.slice(0, newlineIndex).trim();
      stdoutBuffer = stdoutBuffer.slice(newlineIndex + 1);
      if (line.length > 0) {
        let msg;
        try {
          msg = JSON.parse(line);
        } catch {
          // Skip unparseable lines.
          newlineIndex = stdoutBuffer.indexOf("\n");
          continue;
        }
        const entry = pending.get(msg.id);
        if (entry) {
          clearTimeout(entry.timer);
          pending.delete(msg.id);
          entry.resolve(msg);
        }
      }
      newlineIndex = stdoutBuffer.indexOf("\n");
    }
  });

  child.stderr.setEncoding("utf8");
  // Discard stderr (server logs go there).

  let nextId = 1;

  function call(request) {
    return new Promise((resolve, reject) => {
      const id = request.id !== undefined ? request.id : nextId++;
      const fullRequest = { ...request, id };
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timeout waiting for response to method: ${request.method}`));
      }, REQUEST_TIMEOUT_MS);
      pending.set(id, { resolve, reject, timer });
      child.stdin.write(`${JSON.stringify(fullRequest)}\n`);
    });
  }

  function sendNotification(notification) {
    child.stdin.write(`${JSON.stringify(notification)}\n`);
  }

  function close() {
    child.stdin.end();
  }

  return { call, sendNotification, close, child };
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

test("tools/list returns all 13 tools with inputSchemas", async () => {
  const server = spawnServer();
  try {
    await server.call({ jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {} } });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const tools = resp.result.tools;
    assert.equal(tools.length, 13, `expected 13 tools, got ${tools.length}: ${tools.map((t) => t.name).join(", ")}`);
    for (const tool of tools) {
      assert.ok(tool.name, "tool missing name");
      assert.ok(tool.inputSchema, `tool ${tool.name} missing inputSchema`);
      assert.equal(tool.inputSchema.type, "object", `tool ${tool.name} inputSchema.type is not object`);
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
    // A tools/call for an unknown tool returns isError in result, not a crash.
    const errResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "nonexistent_tool", arguments: {} },
    });
    assert.ok(errResp.result, "expected a result (not a top-level error)");
    assert.equal(errResp.result.isError, true);

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

test("tools/call for unknown tool returns isError result", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "totally_unknown_tool", arguments: {} },
    });
    assert.ok(resp.result, "expected a result object");
    assert.equal(resp.result.isError, true);
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
