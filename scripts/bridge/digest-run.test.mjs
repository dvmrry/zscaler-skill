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
