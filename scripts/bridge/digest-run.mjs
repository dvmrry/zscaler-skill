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

// The record-gate tool per role whose call count is correlated against the disk
// artifact count to disambiguate retries from legitimate batch recording.
const RECORD_GATE = { auditor: "record_finding", soc: "record_finding" };

function computeRetrySignal(role, counts, disk) {
  const gate = RECORD_GATE[role];
  if (!gate) return { basis: "unavailable" }; // e.g. investigator (ledger-shaped, different gate)
  const gateCalls = counts[gate] || 0;
  const diskCount = disk && disk.findingCounts && typeof disk.findingCounts.total === "number" ? disk.findingCounts.total : null;
  if (diskCount === null) return { gate, gateCalls, diskCount: null, inferredRetries: null, basis: "inferred" };
  return { gate, gateCalls, diskCount, inferredRetries: Math.max(0, gateCalls - diskCount), basis: "disk" };
}

/**
 * Assemble a self-contained, deterministic digest from the run's in-memory data.
 * Every signal that is not directly observed declares its outcomeBasis.
 *
 * @param {object} run - { role, model, scenario, overallPass, repoCommit,
 *   scenarioHash, turnSignals: ReturnType<extractTurnSignals>[], disk, evaluation }
 */
export function extractRunDigest(run) {
  const turnSignals = Array.isArray(run.turnSignals) ? run.turnSignals : [];
  const toolSequence = turnSignals.flatMap((t) => t.mcpCalls || []);
  const nonMcpCallCount = turnSignals.reduce((n, t) => n + (t.nonMcpCallCount || 0), 0);

  const counts = {};
  for (const name of toolSequence) counts[name] = (counts[name] || 0) + 1;
  const duplicateMcpCalls = Object.fromEntries(Object.entries(counts).filter(([, c]) => c > 1));

  const checks = (run.evaluation && Array.isArray(run.evaluation.checks)) ? run.evaluation.checks : [];
  const seqCheck = checks.find((c) => typeof c.name === "string" && c.name.startsWith("toolSequence"));
  const expectedToolSequence = seqCheck
    ? { pass: seqCheck.pass, detail: seqCheck.detail, basis: "expect" }
    : { pass: null, basis: "unavailable" };

  const stamps = turnSignals.flatMap((t) => [t.firstTs, t.lastTs]).filter((x) => typeof x === "string" && x.length > 0).sort();
  const timing = stamps.length >= 2
    ? { wallMs: Date.parse(stamps[stamps.length - 1]) - Date.parse(stamps[0]), basis: "export" }
    : { wallMs: null, basis: "unavailable" };

  return {
    digestSchemaVersion: DIGEST_SCHEMA_VERSION,
    scenarioId: (run.scenario && run.scenario.id) || null,
    role: run.role || null,
    model: run.model || null,
    repoCommit: run.repoCommit || null,
    scenarioHash: run.scenarioHash || null,
    overallPass: run.overallPass === true,
    turnCount: turnSignals.length,
    toolSequence,
    nonMcpCallCount,
    duplicateMcpCalls,
    retry: computeRetrySignal(run.role, counts, run.disk),
    expectedToolSequence,
    timing,
    expectChecks: checks.map((c) => ({ name: c.name, pass: c.pass })),
  };
}

/** Render a compact, human-facing run-quality section from a digest. */
export function renderRunQuality(d) {
  const seq = d.expectedToolSequence.basis === "unavailable"
    ? "n/a"
    : (d.expectedToolSequence.pass ? "pass" : "FAIL");
  const retry = d.retry.basis === "disk"
    ? `${d.retry.inferredRetries} (calls ${d.retry.gateCalls} vs ${d.retry.diskCount} on disk)`
    : `n/a (${d.retry.basis})`;
  const dups = Object.keys(d.duplicateMcpCalls).length
    ? Object.entries(d.duplicateMcpCalls).map(([k, v]) => `${k}×${v}`).join(", ")
    : "none";
  const wall = d.timing.basis === "export" ? `${Math.round(d.timing.wallMs / 1000)}s` : "n/a";
  return [
    "## Run quality",
    "",
    `- overall: ${d.overallPass ? "PASS" : "FAIL"} · role: ${d.role} · model: ${d.model}`,
    `- expectedToolSequence: ${seq}`,
    `- non-MCP tool calls (bypass signal): ${d.nonMcpCallCount}`,
    `- inferred retries: ${retry}`,
    `- duplicate MCP calls: ${dups}`,
    `- wall time: ${wall} · turns: ${d.turnCount}`,
    "",
  ].join("\n");
}
