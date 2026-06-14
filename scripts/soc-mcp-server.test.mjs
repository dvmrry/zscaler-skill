#!/usr/bin/env node
/**
 * soc-mcp-server.test.mjs
 *
 * Tests for the SOC MCP stdio server. Spawns the server as a child process
 * and communicates via newline-delimited JSON-RPC 2.0 over stdio.
 *
 * Coverage:
 * - initialize: advertises tools, resources, prompts, and protocolVersion
 * - tools/list: 6 tools with annotations and titles; readOnly flags correct
 * - record_finding with framework-only source returns isError with framework-not-evidence message
 * - record_finding with non-existent file source returns isError with repair message
 * - force param rejected over MCP (FORCE_OVER_MCP_ERROR)
 * - unknown tool: -32602
 * - resources/read report for a fixture review returns register-derived markdown
 * - resources/read missing-review status kind -> -32002
 * - soc-review prompt drift-guard: served text matches agents/soc/mcp-entrypoint.md on disk
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
const SERVER_SCRIPT = path.join(SCRIPTS_DIR, "soc-mcp-server.mjs");

// ── Fixture helpers ───────────────────────────────────────────────────────────

/**
 * Create a minimal fixture review dir at root/_data/soc-reviews/<slug>
 * with review-intake.md, review-intake.json, register.md, and
 * optionally one finding in findings.jsonl.
 */
function makeFixtureReview(root, slug, { withFinding = false } = {}) {
  const reviewDir = path.join(root, "_data", "soc-reviews", slug);
  fs.mkdirSync(reviewDir, { recursive: true });

  const timestamp = "2026-06-12T00:00:00.000Z";

  // Real file to use as file:line source evidence.
  const readmeRelPath = "README.md";
  const readmePath = path.join(root, readmeRelPath);
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, "# Test repo\nLine 2\nLine 3\n", "utf8");
  }

  const intakeMd = `Status: pass
Blocking Issues: none

# SOC Review Intake

Review Slug: ${slug}
Review Directory: ${reviewDir}
Working Directory: ${root}
Created At: ${timestamp}

## Scope

Topic: test scope

Description: A test review for MCP server tests

## Threat Model

(general posture review)

## Subtype

(not specified)
`;
  fs.writeFileSync(path.join(reviewDir, "review-intake.md"), intakeMd, "utf8");
  fs.writeFileSync(
    path.join(reviewDir, "review-intake.json"),
    JSON.stringify(
      {
        status: "pass",
        blockingIssues: [],
        reviewSlug: slug,
        reviewDir,
        workingDirectory: root,
        scope: { topic: "test scope" },
        description: "A test review for MCP server tests",
        threatModel: "",
        subtype: "",
        evidenceRecorded: [],
        createdAt: timestamp,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  const registerHeader =
    "| ID | Title | Category | Taxonomy | Source | Severity | Confidence | Status | Remediation | Notes |";
  let registerContent = `# SOC Review Register\n\n${registerHeader}\n|---|---|---|---|---|---|---|---|---|---|\n`;
  if (withFinding) {
    registerContent += `| SOC-001 | Test finding | access |  | ${readmeRelPath}:1 | Low | medium | Open |  |  |\n`;
  }
  registerContent += "\n";
  fs.writeFileSync(path.join(reviewDir, "register.md"), registerContent, "utf8");

  if (withFinding) {
    const finding = JSON.stringify({
      findingId: "SOC-001",
      title: "Test finding",
      category: "access",
      taxonomy: [],
      source: `${readmeRelPath}:1`,
      severity: "Low",
      confidence: "medium",
      status: "Open",
      remediation: "",
      notes: "",
      recordedAt: timestamp,
    });
    fs.writeFileSync(path.join(reviewDir, "findings.jsonl"), `${finding}\n`, "utf8");
  }
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "soc-mcp-test-"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

// ── Server spawn + JSON-RPC helper ────────────────────────────────────────────

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Spawn the SOC MCP server via the shared stdio client
 * (scripts/mcp-stdio-client.mjs); existing `spawnServer()` call sites are
 * unchanged.
 */
function spawnServer() {
  return spawnMcpServer(SERVER_SCRIPT, { requestTimeoutMs: REQUEST_TIMEOUT_MS });
}

// ── initialize ────────────────────────────────────────────────────────────────

test("initialize returns serverInfo.name zscaler-soc and version matching VERSION file", async () => {
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
    assert.equal(resp.result.serverInfo.name, "zscaler-soc");

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
    assert.ok(!resp.error);
    assert.equal(resp.result.protocolVersion, "2025-06-18");
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
    assert.ok(caps.resources);
    assert.equal(caps.resources.listChanged, false);
    assert.equal(caps.resources.subscribe, false);
    assert.ok(caps.prompts);
    assert.equal(caps.prompts.listChanged, false);
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
    assert.ok(!resp.error);
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
      assert.equal(typeof tool.annotations.readOnlyHint, "boolean", `tool ${tool.name} readOnlyHint not boolean`);
      assert.equal(typeof tool.annotations.destructiveHint, "boolean", `tool ${tool.name} destructiveHint not boolean`);
      assert.equal(typeof tool.annotations.idempotentHint, "boolean", `tool ${tool.name} idempotentHint not boolean`);
      assert.equal(typeof tool.annotations.openWorldHint, "boolean", `tool ${tool.name} openWorldHint not boolean`);
      assert.ok(tool.title, `tool ${tool.name} missing title`);
    }
  } finally {
    server.close();
  }
});

test("tools/list: readOnly annotations correct (soc_status, render_soc_report, helper_capabilities are readOnly)", async () => {
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

    for (const name of ["soc_status", "render_soc_report", "helper_capabilities"]) {
      assert.equal(byName[name].annotations.readOnlyHint, true, `expected ${name} to be readOnly`);
    }
    for (const name of ["open_review", "record_evidence", "record_finding"]) {
      assert.equal(byName[name].annotations.readOnlyHint, false, `expected ${name} to NOT be readOnly`);
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
    assert.ok(!resp.error);
    assert.deepEqual(resp.result, {});
  } finally {
    server.close();
  }
});

test("unknown method returns -32601 error", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({ jsonrpc: "2.0", method: "no/such/method", params: {} });
    assert.ok(resp.error);
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
    assert.ok(resp.error);
    assert.equal(resp.error.code, -32602);
    assert.match(resp.error.message, /Unknown tool/);
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
    assert.ok(errResp.error);
    assert.equal(errResp.error.code, -32602);

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

    const errResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "soc_status",
        arguments: {
          root: "/nonexistent-path-that-cannot-exist-abc123",
          review_slug: "any-slug",
        },
      },
    });
    assert.ok(errResp.result);
    assert.equal(errResp.result.isError, true);
    assert.match(errResp.result.content[0].text, /does not exist or is not a directory/);

    const pingResp = await server.call({ jsonrpc: "2.0", method: "ping", params: {} });
    assert.deepEqual(pingResp.result, {});
  } finally {
    server.close();
  }
});

test("notifications/initialized is accepted silently", async () => {
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

test("passing force to open_review returns isError with FORCE_OVER_MCP_ERROR message", async () => {
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
        name: "open_review",
        arguments: {
          root,
          review_slug: "2026-06-12-force-test",
          scope: { scope: { topic: "test" }, description: "test" },
          force: true,
        },
      },
    });
    assert.equal(resp.result.isError, true);
    const text = resp.result.content[0].text;
    assert.match(text, /force is not available over MCP/);
    assert.match(text, /Replacing existing review artifacts is a human decision/);
  } finally {
    server.close();
  }
});

// ── SOC-specific: framework-not-evidence guard through the protocol ───────────

test("record_finding with framework-only source (CWE-269) returns isError with framework-not-evidence repair message", async () => {
  const root = tempDir();
  const slug = `mcp-fw-gate-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureReview(root, slug);

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
          review_slug: slug,
          finding: {
            findingId: "SOC-BAD",
            title: "Framework-only source finding",
            source: "CWE-269",
            severity: "High",
            confidence: "medium",
            status: "Open",
          },
        },
      },
    });
    assert.equal(resp.result.isError, true, "expected isError for framework-only source");
    const msg = resp.result.content[0].text;
    assert.match(msg, /framework tag classifies a finding; it does not prove it/);
    assert.match(msg, /taxonomy field/);
  } finally {
    server.close();
  }
});

test("record_finding with MITRE:T1078 framework-only source returns isError with repair message", async () => {
  const root = tempDir();
  const slug = `mcp-mitre-gate-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureReview(root, slug);

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
          review_slug: slug,
          finding: {
            findingId: "SOC-BAD",
            title: "MITRE-only source finding",
            source: "MITRE:T1078",
            severity: "High",
            confidence: "medium",
            status: "Open",
          },
        },
      },
    });
    assert.equal(resp.result.isError, true);
    const msg = resp.result.content[0].text;
    assert.match(msg, /framework tag classifies a finding; it does not prove it/);
  } finally {
    server.close();
  }
});

// ── Evidence gate via protocol ────────────────────────────────────────────────

test("record_finding with non-existent file source returns isError with repair message", async () => {
  const root = tempDir();
  const slug = `mcp-gate-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureReview(root, slug);

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
          review_slug: slug,
          finding: {
            findingId: "SOC-BAD",
            title: "finding with bad source",
            source: "no/such/file.md:42",
            severity: "Low",
            confidence: "medium",
            status: "Open",
          },
        },
      },
    });
    assert.equal(resp.result.isError, true);
    const msg = resp.result.content[0].text;
    assert.match(msg, /finding source does not resolve/);
    assert.match(msg, /file does not exist|does not exist/);
    assert.match(msg, /record-evidence|file:line|cross-file/);
  } finally {
    server.close();
  }
});

test("record_finding with real file:line source succeeds and returns structuredContent", async () => {
  const root = tempDir();
  const slug = `mcp-gate-ok-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureReview(root, slug);

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
          review_slug: slug,
          finding: {
            findingId: "SOC-001",
            title: "Legitimate finding",
            source: "README.md:1",
            severity: "Low",
            confidence: "medium",
            status: "Open",
          },
        },
      },
    });
    assert.ok(!resp.error);
    assert.ok(!resp.result.isError, `unexpected isError: ${resp.result.content?.[0]?.text}`);
    assert.ok(resp.result.structuredContent, "structuredContent missing from tool result");
    const parsed = JSON.parse(resp.result.content[0].text);
    assert.equal(parsed.status, "ok");
    assert.equal(parsed.findingId, "SOC-001");
    assert.equal(parsed.findingCount, 1);
  } finally {
    server.close();
  }
});

// ── structuredContent on successful results ───────────────────────────────────

test("A3: successful open_review result includes structuredContent", async () => {
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
        name: "open_review",
        arguments: {
          root,
          review_slug: slug,
          scope: {
            scope: { topic: "test" },
            description: "Test review for structuredContent check",
          },
        },
      },
    });
    assert.ok(!resp.error);
    assert.ok(!resp.result.isError, `unexpected isError: ${resp.result.content?.[0]?.text}`);
    assert.ok(resp.result.structuredContent);
    assert.equal(resp.result.structuredContent.status, "pass");
    assert.equal(resp.result.structuredContent.operation, "open-review");
  } finally {
    server.close();
  }
});

// ── Full happy path: open_review -> record_finding -> render_soc_report ───────

test("full happy path: open_review -> record_finding -> render_soc_report", async () => {
  const root = tempDir();
  const slug = `mcp-happy-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  fs.writeFileSync(path.join(root, "README.md"), "# Test\nLine 2\n", "utf8");

  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });

    // Step 1: open_review
    const openResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "open_review",
        arguments: {
          root,
          review_slug: slug,
          scope: {
            scope: { topic: "MCP integration test", paths: ["README.md"] },
            description: "Test review via MCP for integration",
            threatModel: "compromised admin",
            subtype: "access",
          },
        },
      },
    });
    assert.ok(!openResp.error);
    assert.ok(!openResp.result.isError, `open_review isError: ${openResp.result.content[0].text}`);
    const openResult = JSON.parse(openResp.result.content[0].text);
    assert.equal(openResult.status, "pass");
    assert.equal(openResult.operation, "open-review");

    // Step 2: record_finding
    const recordResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_finding",
        arguments: {
          root,
          review_slug: slug,
          finding: {
            findingId: "SOC-001",
            title: "Line 1 of README is a bare H1",
            source: "README.md:1",
            severity: "Info",
            confidence: "high",
            status: "Open",
          },
        },
      },
    });
    assert.ok(!recordResp.result.isError, `record_finding isError: ${recordResp.result.content[0].text}`);
    const recordResult = JSON.parse(recordResp.result.content[0].text);
    assert.equal(recordResult.status, "ok");
    assert.equal(recordResult.findingCount, 1);

    // Step 3: soc_status should show has-findings
    const statusResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "soc_status",
        arguments: { root, review_slug: slug },
      },
    });
    assert.ok(!statusResp.result.isError, `soc_status isError: ${statusResp.result.content[0].text}`);
    const statusResult = JSON.parse(statusResp.result.content[0].text);
    assert.equal(statusResult.phase, "has-findings");
    assert.equal(statusResult.findingCounts.total, 1);

    // Step 4: render_soc_report
    const reportResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "render_soc_report",
        arguments: { root, review_slug: slug },
      },
    });
    assert.ok(!reportResp.result.isError, `render_soc_report isError: ${reportResp.result.content[0].text}`);
    const reportResult = JSON.parse(reportResp.result.content[0].text);
    assert.equal(reportResult.status, "ok");
    assert.match(reportResult.report, /SOC Posture Report:/);
    assert.match(reportResult.report, /SOC-001/);
    assert.match(reportResult.report, /README\.md:1/);
  } finally {
    server.close();
  }
});

// ── resources/read ────────────────────────────────────────────────────────────

test("resources/read report for a fixture review returns artifact-derived markdown", async () => {
  const root = REPO_ROOT; // Server derives root from script location.
  const slug = `mcp-resource-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureReview(root, slug, { withFinding: true });

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
      params: { uri: `soc://review/${slug}/report` },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const contents = resp.result.contents;
    assert.ok(Array.isArray(contents) && contents.length > 0);
    const content = contents[0];
    assert.match(content.text, /SOC Posture Report:/);
    assert.match(content.text, /SOC-001/);
    assert.equal(content.mimeType, "text/markdown");
  } finally {
    server.close();
    const reviewDir = path.join(root, "_data", "soc-reviews", slug);
    try { fs.rmSync(reviewDir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});

test("resources/read report for a missing review returns -32002 error", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "soc://review/no-such-review-xyz789/report" },
    });
    assert.ok(resp.error);
    assert.equal(resp.error.code, -32002);
  } finally {
    server.close();
  }
});

test("resources/read status for a missing review returns -32002 (not phase no-review)", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "soc://review/no-such-review-for-status-999/status" },
    });
    assert.ok(resp.error);
    assert.equal(resp.error.code, -32002);
  } finally {
    server.close();
  }
});

test("resources/read register for a missing review returns -32002", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/read",
      params: { uri: "soc://review/no-such-review-for-register-999/register" },
    });
    assert.ok(resp.error);
    assert.equal(resp.error.code, -32002);
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
    assert.ok(resp.error);
    assert.equal(resp.error.code, -32002);
  } finally {
    server.close();
  }
});

// ── resources/templates/list ──────────────────────────────────────────────────

test("resources/templates/list returns 3 SOC URI templates", async () => {
  const server = spawnServer();
  try {
    const resp = await server.call({
      jsonrpc: "2.0",
      method: "resources/templates/list",
      params: {},
    });
    assert.ok(!resp.error);
    const templates = resp.result.resourceTemplates;
    assert.equal(templates.length, 3, `expected 3 templates, got ${templates.length}`);
    const uris = templates.map((t) => t.uriTemplate);
    assert.ok(uris.includes("soc://review/{slug}/report"), "missing report template");
    assert.ok(uris.includes("soc://review/{slug}/register"), "missing register template");
    assert.ok(uris.includes("soc://review/{slug}/status"), "missing status template");
  } finally {
    server.close();
  }
});

// ── prompts ───────────────────────────────────────────────────────────────────

test("prompts/list returns the 'soc-review' prompt with scope argument", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });
    const resp = await server.call({ jsonrpc: "2.0", method: "prompts/list", params: {} });
    assert.ok(!resp.error);
    const prompts = resp.result.prompts;
    assert.ok(Array.isArray(prompts));
    const socPrompt = prompts.find((p) => p.name === "soc-review");
    assert.ok(socPrompt, "'soc-review' prompt not found");
    const argNames = (socPrompt.arguments || []).map((a) => a.name);
    assert.ok(argNames.includes("scope"), "soc-review prompt should advertise 'scope' argument");
  } finally {
    server.close();
  }
});

test("prompts/get soc-review drift-guard: served text matches agents/soc/mcp-entrypoint.md on disk", async () => {
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
      params: { name: "soc-review", arguments: {} },
    });
    assert.ok(!resp.error, `unexpected error: ${JSON.stringify(resp.error)}`);
    const messages = resp.result.messages;
    assert.ok(Array.isArray(messages) && messages.length > 0);
    const servedText = messages[0].content.text;

    // Drift guard: served text must contain verbatim content from the on-disk file.
    const entrypointPath = path.join(REPO_ROOT, "agents", "soc", "mcp-entrypoint.md");
    const onDisk = fs.readFileSync(entrypointPath, "utf8");
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
// is intentionally excluded (not a numbered gate step).
test("drift guard: every gate tool named in mcp-entrypoint.md exists in tools/list", async () => {
  const KNOWN_GATE_TOOLS = new Set([
    "soc_status",
    "open_review",
    "record_evidence",
    "record_finding",
    "render_soc_report",
  ]);

  const entrypointPath = path.join(REPO_ROOT, "agents", "soc", "mcp-entrypoint.md");
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
    assert.ok(resp.error);
    assert.equal(resp.error.code, -32602);
  } finally {
    server.close();
  }
});

// ── soc_status outputSchema ───────────────────────────────────────────────────

test("tools/list: soc_status has outputSchema with required phase field", async () => {
  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {} },
    });
    const resp = await server.call({ jsonrpc: "2.0", method: "tools/list", params: {} });
    const socStatusTool = resp.result.tools.find((t) => t.name === "soc_status");
    assert.ok(socStatusTool, "soc_status tool not found");
    assert.ok(socStatusTool.outputSchema, "soc_status missing outputSchema");
    assert.ok(
      Array.isArray(socStatusTool.outputSchema.required) &&
        socStatusTool.outputSchema.required.includes("phase"),
      "outputSchema.required should include 'phase'",
    );
    const phaseEnum = socStatusTool.outputSchema.properties?.phase?.enum;
    assert.ok(Array.isArray(phaseEnum));
    assert.ok(phaseEnum.includes("no-review"));
    assert.ok(phaseEnum.includes("open"));
    assert.ok(phaseEnum.includes("has-findings"));
  } finally {
    server.close();
  }
});

// ── record_evidence via protocol ──────────────────────────────────────────────

test("record_evidence stores evidence and allows it to be cited in a finding", async () => {
  const root = tempDir();
  const slug = `mcp-evidence-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  makeFixtureReview(root, slug);

  const evidenceFile = path.join(root, "api-output.json");
  fs.writeFileSync(evidenceFile, '{"admins":[{"role":"SuperAdmin"}]}\n', "utf8");

  const server = spawnServer();
  try {
    await server.call({
      jsonrpc: "2.0",
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    });

    // Record evidence.
    const evidenceResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_evidence",
        arguments: {
          root,
          review_slug: slug,
          name: "admin-api",
          source_file: evidenceFile,
          evidence_type: "api",
        },
      },
    });
    assert.ok(!evidenceResp.result.isError, `record_evidence isError: ${evidenceResp.result.content[0].text}`);
    const evResult = JSON.parse(evidenceResp.result.content[0].text);
    assert.equal(evResult.status, "ok");
    assert.ok(evResult.evidenceRecorded.includes("admin-api"));

    // Record finding citing evidence.
    const findingResp = await server.call({
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "record_finding",
        arguments: {
          root,
          review_slug: slug,
          finding: {
            findingId: "SOC-001",
            title: "Super Admin over-provisioning",
            source: "evidence:admin-api",
            severity: "High",
            confidence: "high",
            status: "Open",
          },
        },
      },
    });
    assert.ok(!findingResp.result.isError, `record_finding with evidence source isError: ${findingResp.result.content[0].text}`);
    const fResult = JSON.parse(findingResp.result.content[0].text);
    assert.equal(fResult.status, "ok");
    assert.equal(fResult.findingId, "SOC-001");
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
    assert.ok(!resp.result.isError);
    const caps = JSON.parse(resp.result.content[0].text);
    assert.equal(caps.status, "ok");
    assert.ok(typeof caps.version === "string");
    assert.ok(Array.isArray(caps.supported));
    assert.ok(caps.supported.includes("open-review"));
    assert.ok(caps.supported.includes("record-finding"));
    assert.ok(caps.supported.includes("render-soc-report"));
  } finally {
    server.close();
  }
});
