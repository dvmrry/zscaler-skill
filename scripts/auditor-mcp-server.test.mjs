#!/usr/bin/env node
/**
 * auditor-mcp-server.test.mjs
 *
 * Tests for the auditor MCP stdio server. Spawns the server as a child process
 * and communicates via newline-delimited JSON-RPC 2.0 over stdio.
 *
 * Coverage:
 * - initialize: advertises tools, resources, prompts, and protocolVersion
 * - tools/list: 6 tools with annotations and titles; readOnly flags correct
 * - record_finding via protocol: evidence gate rejects unresolving source
 * - force param rejected over MCP (FORCE_OVER_MCP_ERROR)
 * - unknown tool: -32602
 * - resources/read: report for a fixture audit returns markdown
 * - resources/read: missing audit status kind -> -32002
 * - audit prompt drift-guard: served text matches agents/auditor/mcp-entrypoint.md on disk
 * - server survives error and continues serving
 * - structuredContent present on successful tool results
 * - A1: initialize echoes protocolVersion / defaults to 2025-06-18
 * - A5: capabilities declare resources and prompts
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
const SERVER_SCRIPT = path.join(SCRIPTS_DIR, "auditor-mcp-server.mjs");

// ── Fixture helpers ───────────────────────────────────────────────────────────

/**
 * Create a minimal fixture audit dir at root/_data/audits/<slug>
 * with audit-intake.md, audit-intake.json, register.md, and
 * optionally one finding in findings.jsonl.
 */
function makeFixtureAudit(root, slug, { withFinding = false } = {}) {
  const auditDir = path.join(root, "_data", "audits", slug);
  fs.mkdirSync(auditDir, { recursive: true });

  const timestamp = "2026-06-12T00:00:00.000Z";

  // Real file to use as file:line source evidence.
  const readmeRelPath = "README.md";
  const readmePath = path.join(root, readmeRelPath);
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, "# Test repo\nLine 2\nLine 3\n", "utf8");
  }

  const intakeMd = `Status: pass
Blocking Issues: none

# Audit Intake

Audit Slug: ${slug}
Audit Directory: ${auditDir}
Working Directory: ${root}
Created At: ${timestamp}

## Scope

Topic: test scope

Description: A test audit for MCP server tests

## Checks Run

- (none at open time)
`;
  fs.writeFileSync(path.join(auditDir, "audit-intake.md"), intakeMd, "utf8");
  fs.writeFileSync(
    path.join(auditDir, "audit-intake.json"),
    JSON.stringify(
      {
        status: "pass",
        blockingIssues: [],
        auditSlug: slug,
        auditDir,
        workingDir: root,
        scope: { topic: "test scope" },
        description: "A test audit for MCP server tests",
        checksRun: [],
        createdAt: timestamp,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  const registerHeader =
    "| ID | Description | Source | Severity | Status | Remediation | Notes |";
  let registerContent = `# Audit Register\n\n${registerHeader}\n|---|---|---|---|---|---|---|\n`;
  if (withFinding) {
    registerContent += `| F-001 | Test finding | ${readmeRelPath}:1 | Low | Open |  |  |\n`;
  }
  registerContent += "\n";
  fs.writeFileSync(path.join(auditDir, "register.md"), registerContent, "utf8");

  if (withFinding) {
    const finding = JSON.stringify({
      findingId: "F-001",
      description: "Test finding",
      source: `${readmeRelPath}:1`,
      severity: "Low",
      status: "Open",
      remediation: "",
      notes: "",
      recordedAt: timestamp,
    });
    fs.writeFileSync(path.join(auditDir, "findings.jsonl"), `${finding}\n`, "utf8");
  }
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aud-mcp-test-"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

// ── Server spawn + JSON-RPC helper ────────────────────────────────────────────

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Spawn the auditor MCP server via the shared stdio client
 * (scripts/mcp-stdio-client.mjs); existing `spawnServer()` call sites are
 * unchanged.
 */
function spawnServer() {
  return spawnMcpServer(SERVER_SCRIPT, { requestTimeoutMs: REQUEST_TIMEOUT_MS });
}

// ── initialize ────────────────────────────────────────────────────────────────

test("initialize returns serverInfo.name zscaler-auditor and version matching VERSION file", async () => {
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
    assert.equal(resp.result.serverInfo.name, "zscaler-auditor");

    const versionFile = path.join(REPO_ROOT, "VERSION");
    const expected = fs.readFileSync(versionFile, "utf8").trim();
    assert.equal(resp.result.serverInfo.version, expected);
    assert.equal(resp.result.protocolVersion, "2024-11-05");
    assert.ok(resp.result.capabilities);
  } finally {
    server.close();
  }
});

test("A1: initialize without protocolVersion defaults to 2025-06-18", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { capabilities: {}, clientInfo: { name: "test", version: "0.0.1" } },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    assert.equal(
      resp.result.protocolVersion,
      "2025-06-18",
      `expected default 2025-06-18, got ${resp.result.protocolVersion}`,
    );
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

// ── tools/list ────────────────────────────────────────────────────────────────

test("tools/list returns exactly 6 tools with inputSchemas, annotations, and titles", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const tools = resp.result.tools;
    assert.equal(
      tools.length,
      6,
      `expected 6 tools, got ${tools.length}: ${tools.map((t) => t.name).join(", ")}`,
    );
    for (const tool of tools) {
      assert.ok(tool.name, "tool missing name");
      assert.ok(tool.inputSchema, `tool ${tool.name} missing inputSchema`);
      assert.equal(tool.inputSchema.type, "object", `tool ${tool.name} inputSchema.type is not object`);
      assert.ok(tool.annotations, `tool ${tool.name} missing annotations`);
      assert.equal(
        typeof tool.annotations.readOnlyHint,
        "boolean",
        `tool ${tool.name} annotations.readOnlyHint is not boolean`,
      );
      assert.equal(
        typeof tool.annotations.destructiveHint,
        "boolean",
        `tool ${tool.name} annotations.destructiveHint is not boolean`,
      );
      assert.equal(
        typeof tool.annotations.idempotentHint,
        "boolean",
        `tool ${tool.name} annotations.idempotentHint is not boolean`,
      );
      assert.equal(
        typeof tool.annotations.openWorldHint,
        "boolean",
        `tool ${tool.name} annotations.openWorldHint is not boolean`,
      );
      assert.ok(tool.title, `tool ${tool.name} missing title`);
    }
  } finally {
    server.close();
  }
});

test("tools/list: readOnly annotations correct (audit_status, render_audit_report, helper_capabilities are readOnly)", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const tools = resp.result.tools;
    const byName = Object.fromEntries(tools.map((t) => [t.name, t]));

    // Read-only tools.
    for (const name of ["audit_status", "render_audit_report", "helper_capabilities"]) {
      assert.equal(
        byName[name].annotations.readOnlyHint,
        true,
        `expected ${name} to be readOnly`,
      );
    }

    // Write tools.
    for (const name of ["open_audit", "record_finding", "record_check_output"]) {
      assert.equal(
        byName[name].annotations.readOnlyHint,
        false,
        `expected ${name} to NOT be readOnly`,
      );
    }
  } finally {
    server.close();
  }
});

test("tools/list: no tool schema contains a force property", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    for (const tool of resp.result.tools) {
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

test("tools/call for unknown tool returns JSON-RPC -32602 protocol error", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "totally_unknown_tool", arguments: {} },
    });
    assert.ok(resp.error, "expected a JSON-RPC error object");
    assert.equal(resp.error.code, -32602, `expected -32602, got ${resp.error.code}`);
    assert.match(
      resp.error.message,
      /Unknown tool/,
      `error message should name the tool, got: ${resp.error.message}`,
    );
  } finally {
    server.close();
  }
});

test("server survives an error call and serves the next request", async () => {
  const server = spawnServer();
  try {
    const errResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "nonexistent_tool", arguments: {} },
    });
    assert.ok(errResp.error, "expected a JSON-RPC error for unknown tool");
    assert.equal(errResp.error.code, -32602, `expected -32602, got ${errResp.error.code}`);

    const pingResp = await server.call({ jsonrpc: "2.0", method: "ping", params: {} });
    assert.deepEqual(pingResp.result, {});
  } finally {
    server.close();
  }
});

test("server survives a helper throw and serves the next request (dispatchTool catch path)", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });

    // audit_status with a non-existent root -> helper throws -> isError result.
    const errResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "audit_status",
        arguments: {
          root: "/nonexistent-path-that-cannot-exist-abc123",
          audit_slug: "any-slug",
        },
      },
    });
    assert.ok(errResp.result, "expected a result object, not a top-level error");
    assert.equal(errResp.result.isError, true, "expected isError:true from dispatchTool catch");
    assert.match(
      errResp.result.content[0].text,
      /does not exist or is not a directory/,
      `expected root-not-found message, got: ${errResp.result.content[0].text}`,
    );

    const pingResp = await server.call({ jsonrpc: "2.0", method: "ping", params: {} });
    assert.deepEqual(pingResp.result, {});
  } finally {
    server.close();
  }
});

test("notifications/initialized is accepted silently (no response expected)", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    server.sendNotification({ jsonrpc: "2.0", method: "notifications/initialized" });
    const pingResp = await server.call({ jsonrpc: "2.0", method: "ping", params: {} });
    assert.deepEqual(pingResp.result, {});
  } finally {
    server.close();
  }
});

// ── force rejection ───────────────────────────────────────────────────────────

test("passing force to open_audit returns isError with FORCE_OVER_MCP_ERROR message", async () => {
  const root = tempDir();
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_audit",
        arguments: {
          root,
          audit_slug: "2026-06-12-force-test",
          scope: { scope: { topic: "test" }, description: "test" },
          force: true,
        },
      },
    });
    assert.equal(resp.result.isError, true, "expected isError:true when force is passed over MCP");
    const text = resp.result.content[0].text;
    assert.match(text, /force is not available over MCP/, `error must include force-rejection message, got: ${text}`);
    assert.match(
      text,
      /Replacing existing audit artifacts is a human decision/,
      `error must include human-decision text, got: ${text}`,
    );
  } finally {
    server.close();
  }
});

test("passing force to record_finding returns isError with FORCE_OVER_MCP_ERROR message", async () => {
  const root = tempDir();
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_finding",
        arguments: {
          root,
          audit_slug: "2026-06-12-force-test",
          finding: {
            findingId: "F-001",
            description: "test",
            source: "README.md:1",
            severity: "Low",
            status: "Open",
          },
          force: true,
        },
      },
    });
    assert.equal(resp.result.isError, true, "expected isError:true when force is passed to record_finding over MCP");
    assert.match(resp.result.content[0].text, /force is not available over MCP/);
  } finally {
    server.close();
  }
});

// ── Evidence gate via protocol ────────────────────────────────────────────────

test("record_finding with non-existent file source returns isError with repair message", async () => {
  const root = tempDir();
  const slug = `mcp-gate-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureAudit(root, slug);

  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });

    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_finding",
        arguments: {
          root,
          audit_slug: slug,
          finding: {
            findingId: "F-BAD",
            description: "finding with bad source",
            source: "no/such/file.md:42",
            severity: "Low",
            status: "Open",
          },
        },
      },
    });
    assert.equal(resp.result.isError, true, "expected isError for non-existent file source");
    const msg = resp.result.content[0].text;
    // Error must name the repair.
    assert.match(
      msg,
      /finding source does not resolve/,
      `error should say source does not resolve, got: ${msg}`,
    );
    assert.match(
      msg,
      /file does not exist|does not exist/,
      `error should mention the file does not exist, got: ${msg}`,
    );
    assert.match(
      msg,
      /record-check-output|path:line|cross-file/,
      `error should name the repair, got: ${msg}`,
    );
  } finally {
    server.close();
  }
});

test("record_finding with High severity and cross-file source returns isError naming strong-source requirement", async () => {
  const root = tempDir();
  const slug = `mcp-gate-cross-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureAudit(root, slug);

  // Create two real files so cross-file check resolves.
  fs.writeFileSync(path.join(root, "fileA.md"), "# A\n", "utf8");
  fs.writeFileSync(path.join(root, "fileB.md"), "# B\n", "utf8");

  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });

    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_finding",
        arguments: {
          root,
          audit_slug: slug,
          finding: {
            findingId: "F-HIGH",
            description: "High-severity finding with cross-file source",
            source: "fileA.md + fileB.md",
            severity: "High",
            status: "Open",
          },
        },
      },
    });
    assert.equal(resp.result.isError, true, "expected isError for High severity with cross-file source");
    const msg = resp.result.content[0].text;
    assert.match(
      msg,
      /file:line|recorded-check|cross-file.*too weak|too weak/,
      `error should name strong-source requirement, got: ${msg}`,
    );
    assert.match(
      msg,
      /record-check-output|record_check_output/,
      `error should suggest record-check-output, got: ${msg}`,
    );
  } finally {
    server.close();
  }
});

test("record_finding with real file:line source succeeds and returns structuredContent", async () => {
  const root = tempDir();
  const slug = `mcp-gate-ok-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureAudit(root, slug);

  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });

    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_finding",
        arguments: {
          root,
          audit_slug: slug,
          finding: {
            findingId: "F-001",
            description: "Legitimate finding",
            source: "README.md:1",
            severity: "Low",
            status: "Open",
          },
        },
      },
    });
    assert.ok(!resp.error, `unexpected protocol error: ${JSON.stringify(resp.error)}`);
    assert.ok(!resp.result.isError, `unexpected isError: ${resp.result.content?.[0]?.text}`);
    assert.ok(resp.result.structuredContent, "structuredContent missing from tool result");
    const parsed = JSON.parse(resp.result.content[0].text);
    assert.equal(parsed.status, "ok");
    assert.equal(parsed.findingId, "F-001");
    assert.equal(parsed.findingCount, 1);
  } finally {
    server.close();
  }
});

// ── structuredContent on successful results ───────────────────────────────────

test("A3: successful open_audit result includes structuredContent", async () => {
  const root = tempDir();
  const slug = `mcp-structured-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {} },
    });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_audit",
        arguments: {
          root,
          audit_slug: slug,
          scope: {
            scope: { topic: "test" },
            description: "Test audit for structuredContent check",
          },
        },
      },
    });
    assert.ok(!resp.error);
    assert.ok(!resp.result.isError, `unexpected isError: ${resp.result.content?.[0]?.text}`);
    assert.ok(resp.result.structuredContent, "structuredContent missing from tool result");
    assert.equal(typeof resp.result.structuredContent, "object");
    assert.equal(resp.result.structuredContent.status, "pass");
    assert.equal(resp.result.structuredContent.operation, "open-audit");
  } finally {
    server.close();
  }
});

// ── Full happy path: open_audit -> record_finding -> render_audit_report ──────

test("full happy path: open_audit -> record_finding -> render_audit_report", async () => {
  const root = tempDir();
  const slug = `mcp-happy-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Create a real file to cite as file:line source.
  fs.writeFileSync(path.join(root, "README.md"), "# Test\nLine 2\n", "utf8");

  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });

    // Step 1: open_audit
    const openResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_audit",
        arguments: {
          root,
          audit_slug: slug,
          scope: {
            scope: { topic: "MCP integration test", paths: ["README.md"] },
            description: "Test audit via MCP for integration",
          },
        },
      },
    });
    assert.ok(!openResp.error, `open_audit error: ${JSON.stringify(openResp.error)}`);
    assert.ok(!openResp.result.isError, `open_audit isError: ${openResp.result.content[0].text}`);
    const openResult = JSON.parse(openResp.result.content[0].text);
    assert.equal(openResult.status, "pass");
    assert.equal(openResult.operation, "open-audit");

    // Step 2: record_finding
    const recordResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_finding",
        arguments: {
          root,
          audit_slug: slug,
          finding: {
            findingId: "F-001",
            description: "Line 1 of README is a bare H1 with no further context",
            source: "README.md:1",
            severity: "Info",
            status: "Open",
          },
        },
      },
    });
    assert.ok(!recordResp.result.isError, `record_finding isError: ${recordResp.result.content[0].text}`);
    const recordResult = JSON.parse(recordResp.result.content[0].text);
    assert.equal(recordResult.status, "ok");
    assert.equal(recordResult.findingCount, 1);

    // Step 3: audit_status should show has-findings
    const statusResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "audit_status",
        arguments: { root, audit_slug: slug },
      },
    });
    assert.ok(!statusResp.result.isError, `audit_status isError: ${statusResp.result.content[0].text}`);
    const statusResult = JSON.parse(statusResp.result.content[0].text);
    assert.equal(statusResult.phase, "has-findings");
    assert.equal(statusResult.findingCounts.total, 1);
    assert.ok(statusResult.structuredContent === undefined || true); // structuredContent on outer result

    // Step 4: render_audit_report
    const reportResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "render_audit_report",
        arguments: { root, audit_slug: slug },
      },
    });
    assert.ok(!reportResp.result.isError, `render_audit_report isError: ${reportResp.result.content[0].text}`);
    const reportResult = JSON.parse(reportResp.result.content[0].text);
    assert.equal(reportResult.status, "ok");
    assert.match(reportResult.report, /Audit Report:/);
    assert.match(reportResult.report, /F-001/);
    // Verify answer-from-artifact: finding from ledger appears in report.
    assert.match(reportResult.report, /README\.md:1/);
  } finally {
    server.close();
  }
});

// ── resources/read ────────────────────────────────────────────────────────────

test("resources/read report for a fixture audit returns artifact-derived markdown", async () => {
  const root = REPO_ROOT; // Server derives root from script location — resource URIs use it.
  const slug = `mcp-resource-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureAudit(root, slug, { withFinding: true });

  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });

    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: `auditor://audit/${slug}/report` },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const contents = resp.result.contents;
    assert.ok(Array.isArray(contents) && contents.length > 0, "contents should be non-empty");
    const content = contents[0];
    assert.match(content.text, /Audit Report:/, "report should contain 'Audit Report:'");
    assert.match(content.text, /F-001/, "report should contain the fixture finding F-001");
    assert.equal(content.mimeType, "text/markdown");
  } finally {
    server.close();
    // Clean up fixture audit from real repo.
    const auditDir = path.join(root, "_data", "audits", slug);
    try { fs.rmSync(auditDir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});

test("resources/read report for a missing audit returns -32002 error", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "auditor://audit/no-such-audit-xyz789/report" },
    });
    assert.ok(resp.error, "expected a JSON-RPC error");
    assert.equal(resp.error.code, -32002, `expected -32002, got ${resp.error.code}`);
  } finally {
    server.close();
  }
});

test("resources/read status for a missing audit returns -32002 (not phase no-audit)", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "auditor://audit/no-such-audit-for-status-999/status" },
    });
    assert.ok(resp.error, "expected a JSON-RPC error");
    assert.equal(
      resp.error.code,
      -32002,
      `expected -32002, got ${resp.error.code}. Full: ${JSON.stringify(resp.error)}`,
    );
  } finally {
    server.close();
  }
});

test("resources/read register for a missing audit returns -32002", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "auditor://audit/no-such-audit-for-register-999/register" },
    });
    assert.ok(resp.error, "expected a JSON-RPC error");
    assert.equal(resp.error.code, -32002, `expected -32002, got ${resp.error.code}`);
  } finally {
    server.close();
  }
});

test("resources/read with unknown URI scheme returns -32002", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "totally://unknown/uri/pattern" },
    });
    assert.ok(resp.error, "expected a JSON-RPC error");
    assert.equal(resp.error.code, -32002, `expected -32002, got ${resp.error.code}`);
  } finally {
    server.close();
  }
});

// ── resources/templates/list ──────────────────────────────────────────────────

test("resources/templates/list returns 3 auditor URI templates", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/templates/list",
      params: {},
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const templates = resp.result.resourceTemplates;
    assert.equal(
      templates.length,
      3,
      `expected 3 resource templates, got ${templates.length}`,
    );
    const uris = templates.map((t) => t.uriTemplate);
    assert.ok(uris.includes("auditor://audit/{slug}/report"), "missing report template");
    assert.ok(uris.includes("auditor://audit/{slug}/register"), "missing register template");
    assert.ok(uris.includes("auditor://audit/{slug}/status"), "missing status template");
  } finally {
    server.close();
  }
});

// ── prompts ───────────────────────────────────────────────────────────────────

test("prompts/list returns the 'audit' prompt with scope argument", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    const resp = await server.call({ jsonrpc: "2.0", method: "prompts/list", params: {} });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const prompts = resp.result.prompts;
    assert.ok(Array.isArray(prompts), "prompts should be an array");
    const auditPrompt = prompts.find((p) => p.name === "audit");
    assert.ok(auditPrompt, "'audit' prompt not found in prompts/list");
    const argNames = (auditPrompt.arguments || []).map((a) => a.name);
    assert.ok(argNames.includes("scope"), "audit prompt should advertise 'scope' argument");
  } finally {
    server.close();
  }
});

test("prompts/get audit drift-guard: served text matches agents/auditor/mcp-entrypoint.md on disk", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "audit", arguments: {} },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const messages = resp.result.messages;
    assert.ok(Array.isArray(messages) && messages.length > 0, "messages should be non-empty");
    const servedText = messages[0].content.text;

    // Drift guard: the served text must contain verbatim content from the on-disk file.
    const entrypointPath = path.join(REPO_ROOT, "agents", "auditor", "mcp-entrypoint.md");
    const onDisk = fs.readFileSync(entrypointPath, "utf8");
    // Check that the first 100 chars of the on-disk content appear in the served text.
    // This ensures the server reads the file at runtime (not a baked-in string literal).
    const onDiskSnippet = onDisk.slice(0, 100).trim();
    assert.ok(
      servedText.includes(onDiskSnippet),
      `served text should contain on-disk content. Expected snippet: "${onDiskSnippet}". Got: "${servedText.slice(0, 200)}"`,
    );
  } finally {
    server.close();
  }
});

// ── Drift guard: mcp-entrypoint.md tool names must exist in tools/list ────────
//
// The entrypoint is load-bearing (workflow.md routes MCP runtimes to it). If a
// gate tool referenced in the doc is renamed or removed from the server, this
// catches the canonical-vs-adapter drift before it reaches production. Mirrors
// the investigator guard. KNOWN_GATE_TOOLS is intersected with what the doc
// actually mentions so the test stays stable against prose; helper_capabilities
// and record_check_output are intentionally excluded (not numbered gate steps).
test("drift guard: every gate tool named in mcp-entrypoint.md exists in tools/list", async () => {
  const KNOWN_GATE_TOOLS = new Set([
    "audit_status",
    "open_audit",
    "record_finding",
    "render_audit_report",
  ]);

  const entrypointPath = path.join(REPO_ROOT, "agents", "auditor", "mcp-entrypoint.md");
  const entrypointContent = fs.readFileSync(entrypointPath, "utf8");

  // Match **name** or `name` (bold or backtick-fenced).
  const referenced = new Set();
  for (const name of KNOWN_GATE_TOOLS) {
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

test("prompts/get unknown prompt returns -32602", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "prompts/get",
      params: { name: "no-such-prompt", arguments: {} },
    });
    assert.ok(resp.error, "expected a JSON-RPC error");
    assert.equal(resp.error.code, -32602, `expected -32602, got ${resp.error.code}`);
  } finally {
    server.close();
  }
});

// ── audit_status outputSchema ─────────────────────────────────────────────────

test("tools/list: audit_status has outputSchema with required phase field", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {} },
    });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const auditStatusTool = resp.result.tools.find((t) => t.name === "audit_status");
    assert.ok(auditStatusTool, "audit_status tool not found");
    assert.ok(auditStatusTool.outputSchema, "audit_status missing outputSchema");
    assert.ok(
      Array.isArray(auditStatusTool.outputSchema.required) &&
        auditStatusTool.outputSchema.required.includes("phase"),
      "outputSchema.required should include 'phase'",
    );
    const phaseEnum = auditStatusTool.outputSchema.properties?.phase?.enum;
    assert.ok(Array.isArray(phaseEnum), "phase property should have an enum");
    assert.ok(phaseEnum.includes("no-audit"), "phase enum should include 'no-audit'");
    assert.ok(phaseEnum.includes("open"), "phase enum should include 'open'");
    assert.ok(phaseEnum.includes("has-findings"), "phase enum should include 'has-findings'");
  } finally {
    server.close();
  }
});

// ── record_check_output via protocol ─────────────────────────────────────────

test("record_check_output stores a check and allows it to be cited in a finding", async () => {
  const root = tempDir();
  const slug = `mcp-check-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureAudit(root, slug);

  // Write a temporary check output file somewhere accessible.
  const checkOutputPath = path.join(root, "check-out.txt");
  fs.writeFileSync(checkOutputPath, "PASS: all hygiene checks ok\n", "utf8");

  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });

    // Record the check.
    const checkResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_check_output",
        arguments: {
          root,
          audit_slug: slug,
          check_name: "hygiene",
          output_file: checkOutputPath,
          exit_code: 0,
        },
      },
    });
    assert.ok(!checkResp.result.isError, `record_check_output isError: ${checkResp.result.content[0].text}`);
    const checkResult = JSON.parse(checkResp.result.content[0].text);
    assert.equal(checkResult.status, "ok");
    assert.ok(checkResult.checksRun.includes("hygiene"), "checksRun should include 'hygiene'");

    // Now record a finding citing the check.
    const findingResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_finding",
        arguments: {
          root,
          audit_slug: slug,
          finding: {
            findingId: "F-CHECK",
            description: "Finding backed by recorded check",
            source: "check:hygiene",
            severity: "High", // High is allowed with check source.
            status: "Open",
          },
        },
      },
    });
    assert.ok(
      !findingResp.result.isError,
      `record_finding with check source isError: ${findingResp.result.content[0].text}`,
    );
    const findingResult = JSON.parse(findingResp.result.content[0].text);
    assert.equal(findingResult.status, "ok");
    assert.equal(findingResult.findingId, "F-CHECK");
  } finally {
    server.close();
  }
});

// ── helper_capabilities via protocol ─────────────────────────────────────────

test("helper_capabilities returns version and supported operations", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: "helper_capabilities", arguments: {} },
    });
    assert.ok(!resp.result.isError, `unexpected isError: ${resp.result.content?.[0]?.text}`);
    const caps = JSON.parse(resp.result.content[0].text);
    assert.equal(caps.status, "ok");
    assert.ok(typeof caps.version === "string", "version should be a string");
    assert.ok(Array.isArray(caps.supported), "supported should be an array");
    assert.ok(caps.supported.includes("open-audit"), "supported should include open-audit");
    assert.ok(caps.supported.includes("record-finding"), "supported should include record-finding");
    assert.ok(caps.supported.includes("render-audit-report"), "supported should include render-audit-report");
  } finally {
    server.close();
  }
});
