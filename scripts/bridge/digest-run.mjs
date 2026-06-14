// scripts/bridge/digest-run.mjs
//
// Pure, deterministic digest of one bridge run. No file I/O, no LLM. Computed
// from the in-memory Devin export + disk truth + evaluation that
// run-investigation.mjs already has at end-of-run. Never copies rawInput values.

export const DIGEST_SCHEMA_VERSION = 1;

/**
 * Extract per-turn signals from one parsed Devin export object.
 * Counts/order only — no payloads. MCP tool calls live in
 * step.metadata.extensions["chisel/tool_call_content"][*]._meta; everything else
 * that is a tool call (file reads, list-tools) counts as non-MCP.
 */
export function extractTurnSignals(exportObj) {
  const out = { mcpCalls: [], nonMcpCallCount: 0, firstTs: null, lastTs: null };
  if (!exportObj || !Array.isArray(exportObj.steps)) return out;
  for (const step of exportObj.steps) {
    const ts = step && step.metadata && step.metadata.created_at;
    if (typeof ts === "string" && ts.length > 0) {
      if (out.firstTs === null) out.firstTs = ts;
      out.lastTs = ts;
    }
    if (!step || step.source !== "agent") continue;
    const content =
      step.metadata && step.metadata.extensions && step.metadata.extensions["chisel/tool_call_content"];
    if (!content || typeof content !== "object") continue;
    for (const call of Object.values(content)) {
      const meta = call && call._meta;
      const toolName = meta && meta["cognition.ai/toolName"];
      if (meta && meta["cognition.ai/eventType"] === "mcp_tool_call" && typeof toolName === "string") {
        const parts = toolName.split("__");
        out.mcpCalls.push(parts.length >= 3 ? parts.slice(2).join("__") : toolName);
      } else {
        out.nonMcpCallCount += 1;
      }
    }
  }
  return out;
}
