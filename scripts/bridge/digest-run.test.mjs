import assert from "node:assert/strict";
import test from "node:test";
import { extractTurnSignals } from "./digest-run.mjs";

function mcpStep(toolName, createdAt) {
  return {
    source: "agent",
    metadata: {
      created_at: createdAt,
      extensions: { "chisel/tool_call_content": { c1: { _meta: { "cognition.ai/toolName": toolName, "cognition.ai/eventType": "mcp_tool_call" } } } },
    },
  };
}
function nonMcpStep(createdAt) {
  return {
    source: "agent",
    metadata: {
      created_at: createdAt,
      extensions: { "chisel/tool_call_content": { c1: { title: "Read file", kind: "read" } } },
    },
  };
}

test("extractTurnSignals: collects MCP names, counts non-MCP calls, tracks timestamps", () => {
  const exportObj = {
    steps: [
      { source: "system", metadata: { created_at: "2026-06-12T16:00:00.000Z" } },
      mcpStep("mcp__zscaler-soc__open_review", "2026-06-12T16:00:01.000Z"),
      nonMcpStep("2026-06-12T16:00:02.000Z"),
      mcpStep("mcp__zscaler-soc__record_finding", "2026-06-12T16:00:03.000Z"),
    ],
  };
  const s = extractTurnSignals(exportObj);
  assert.deepEqual(s.mcpCalls, ["open_review", "record_finding"]);
  assert.equal(s.nonMcpCallCount, 1);
  assert.equal(s.firstTs, "2026-06-12T16:00:00.000Z");
  assert.equal(s.lastTs, "2026-06-12T16:00:03.000Z");
});

test("extractTurnSignals: tolerates missing/garbled shapes", () => {
  assert.deepEqual(extractTurnSignals(null), { mcpCalls: [], nonMcpCallCount: 0, firstTs: null, lastTs: null });
  assert.deepEqual(extractTurnSignals({ steps: "nope" }), { mcpCalls: [], nonMcpCallCount: 0, firstTs: null, lastTs: null });
});

import { extractRunDigest, DIGEST_SCHEMA_VERSION } from "./digest-run.mjs";

function runFixture(overrides = {}) {
  return {
    role: "soc",
    model: "swe-1.6",
    scenario: { id: "soc-fabrication" },
    overallPass: true,
    repoCommit: "abc1234",
    scenarioHash: "deadbeef",
    turnSignals: [
      { mcpCalls: ["open_review", "record_finding", "record_finding", "render_soc_report"], nonMcpCallCount: 2, firstTs: "2026-06-12T16:00:00.000Z", lastTs: "2026-06-12T16:00:30.000Z" },
    ],
    disk: { findingCounts: { total: 2 } },
    evaluation: { checks: [
      { name: "toolSequence ⊇ [open_review → record_finding → render_soc_report]", pass: true, detail: "ok" },
      { name: "findingCount >= 1", pass: true, detail: "ok" },
    ] },
    ...overrides,
  };
}

test("extractRunDigest: rolls up sequence, non-MCP count, duplicates, and disk-correlated retries", () => {
  const d = extractRunDigest(runFixture());
  assert.equal(d.digestSchemaVersion, DIGEST_SCHEMA_VERSION);
  assert.equal(d.scenarioId, "soc-fabrication");
  assert.equal(d.role, "soc");
  assert.equal(d.nonMcpCallCount, 2);
  assert.deepEqual(d.duplicateMcpCalls, { record_finding: 2 });
  assert.deepEqual(d.retry, { gate: "record_finding", gateCalls: 2, diskCount: 2, inferredRetries: 0, basis: "disk" });
  assert.equal(d.expectedToolSequence.pass, true);
  assert.equal(d.expectedToolSequence.basis, "expect");
  assert.equal(d.timing.basis, "export");
  assert.equal(d.timing.wallMs, 30000);
});

test("extractRunDigest: retry signal flags failed records (3 calls, 1 finding -> 2 retries)", () => {
  const d = extractRunDigest(runFixture({
    turnSignals: [{ mcpCalls: ["open_review", "record_finding", "record_finding", "record_finding"], nonMcpCallCount: 0, firstTs: null, lastTs: null }],
    disk: { findingCounts: { total: 1 } },
  }));
  assert.deepEqual(d.retry, { gate: "record_finding", gateCalls: 3, diskCount: 1, inferredRetries: 2, basis: "disk" });
  assert.equal(d.timing.basis, "unavailable");
});

test("extractRunDigest: no disk counts -> retry basis inferred; investigator -> unavailable", () => {
  const noDisk = extractRunDigest(runFixture({ disk: null }));
  assert.equal(noDisk.retry.basis, "inferred");
  const inv = extractRunDigest(runFixture({ role: "investigator", disk: { claimCounts: {} } }));
  assert.equal(inv.retry.basis, "unavailable");
});
