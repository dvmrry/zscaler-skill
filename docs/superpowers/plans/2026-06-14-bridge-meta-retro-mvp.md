# Bridge meta-retro MVP (inline digest) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Teach the bridge run to emit deterministic role-runtime quality signals in its own output (a "run quality" section in `report.md`/stdout + a private per-run digest JSON), so workflow friction is answerable from artifacts.

**Architecture:** A pure module `scripts/bridge/digest-run.mjs` computes a self-contained digest from the in-memory Devin export + disk truth + evaluation already available at end-of-run. `run-investigation.mjs` calls it inline, prints a summary, and writes `_data/bridge-digests/<run>.json` (gitignored). No aggregation, no public promotion, no LLM — those are deferred per the spec.

**Tech Stack:** Node.js (ESM `.mjs`), `node:test`, no dependencies. Gated by the recursive `check-fast` (runs `scripts/bridge/*.test.mjs`).

**Spec:** [docs/superpowers/specs/2026-06-14-bridge-meta-retro-design.md](../specs/2026-06-14-bridge-meta-retro-design.md) (§ "MVP — inline deterministic digest").

**Scope note (explicitly deferred, per spec — "prove actionability first"):** `rawInput` arg-shape capture, call fingerprints, and per-call latency are a fast-follow. Durable evidence IDs and full disk/export-parse-failure fields are deferred *with their consumer* (Layer 2 reflection) — they have no reader in the MVP. This plan implements the core actionable signals only: bypass count, disk-correlated retry, `expectedToolSequence` result, wall timing, and pass/fail. (Run identity is captured via the digest filename + `timing.firstTs`; a separate `timestamp` field is unnecessary and would force impurity into `extractRunDigest`.)

---

### Task 1: Per-turn signal extractor

**Files:**
- Create: `scripts/bridge/digest-run.mjs`
- Test: `scripts/bridge/digest-run.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// scripts/bridge/digest-run.test.mjs
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/bridge/digest-run.test.mjs`
Expected: FAIL — `Cannot find module './digest-run.mjs'`.

- [ ] **Step 3: Write minimal implementation**

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/bridge/digest-run.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/bridge/digest-run.mjs scripts/bridge/digest-run.test.mjs
git commit -m "feat(bridge): per-turn signal extractor for run digest"
```

---

### Task 2: Assemble the run digest (with disk-correlated retry)

**Files:**
- Modify: `scripts/bridge/digest-run.mjs`
- Test: `scripts/bridge/digest-run.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// append to scripts/bridge/digest-run.test.mjs
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
  // 2 record_finding calls, 2 findings on disk -> 0 inferred retries, disk basis
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/bridge/digest-run.test.mjs`
Expected: FAIL — `extractRunDigest is not a function`.

- [ ] **Step 3: Write minimal implementation**

```js
// append to scripts/bridge/digest-run.mjs

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/bridge/digest-run.test.mjs`
Expected: PASS (5 tests total).

- [ ] **Step 5: Commit**

```bash
git add scripts/bridge/digest-run.mjs scripts/bridge/digest-run.test.mjs
git commit -m "feat(bridge): assemble run digest with disk-correlated retry signal"
```

---

### Task 3: Render the human-facing "run quality" summary

**Files:**
- Modify: `scripts/bridge/digest-run.mjs`
- Test: `scripts/bridge/digest-run.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// append to scripts/bridge/digest-run.test.mjs
import { renderRunQuality } from "./digest-run.mjs";

test("renderRunQuality: surfaces the actionable signals in markdown", () => {
  const md = renderRunQuality(extractRunDigest(runFixture({
    turnSignals: [{ mcpCalls: ["open_review", "record_finding", "record_finding", "record_finding"], nonMcpCallCount: 3, firstTs: "2026-06-12T16:00:00.000Z", lastTs: "2026-06-12T16:00:30.000Z" }],
    disk: { findingCounts: { total: 1 } },
  })));
  assert.match(md, /## Run quality/);
  assert.match(md, /non-MCP tool calls.*3/);        // bypass signal surfaced
  assert.match(md, /inferred retries.*2/);          // retry signal surfaced
  assert.match(md, /expectedToolSequence/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/bridge/digest-run.test.mjs`
Expected: FAIL — `renderRunQuality is not a function`.

- [ ] **Step 3: Write minimal implementation**

```js
// append to scripts/bridge/digest-run.mjs

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/bridge/digest-run.test.mjs`
Expected: PASS (6 tests total).

- [ ] **Step 5: Commit**

```bash
git add scripts/bridge/digest-run.mjs scripts/bridge/digest-run.test.mjs
git commit -m "feat(bridge): render run-quality summary from digest"
```

---

### Task 4: Wire the digest into the bridge run (inline emission)

**Files:**
- Modify: `scripts/bridge/run-investigation.mjs` (import; capture per-turn signals in the parse loop; write digest + append run-quality at end-of-run)
- Test: `scripts/bridge/run-investigation.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// append to scripts/bridge/run-investigation.test.mjs
import { buildRunDigest } from "./run-investigation.mjs";

test("buildRunDigest: assembles a digest from turns + disk + evaluation", () => {
  const turns = [{
    signals: { mcpCalls: ["open_review", "render_soc_report"], nonMcpCallCount: 0, firstTs: null, lastTs: null },
  }];
  const digest = buildRunDigest({
    scenario: { id: "soc-fabrication", role: "soc" },
    role: "soc",
    model: "swe-1.6",
    turns,
    disk: { findingCounts: { total: 0 } },
    evaluation: { checks: [], pass: true },
    overallPass: true,
    repoCommit: "abc1234",
    scenarioHash: "hash",
  });
  assert.equal(digest.scenarioId, "soc-fabrication");
  assert.deepEqual(digest.toolSequence, ["open_review", "render_soc_report"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/bridge/run-investigation.test.mjs`
Expected: FAIL — `buildRunDigest is not a function`.

- [ ] **Step 3: Write minimal implementation**

In `scripts/bridge/run-investigation.mjs`, add the import near the other local imports (top of file):

```js
import { extractTurnSignals, extractRunDigest, renderRunQuality } from "./digest-run.mjs";
```

In the per-turn parse loop, where `toolCalls = extractToolCalls(exportObj);` is set, add directly after it:

```js
          signals = extractTurnSignals(exportObj);
```

and declare `let signals = { mcpCalls: [], nonMcpCallCount: 0, firstTs: null, lastTs: null };` next to `let toolCalls = [];`, and add `signals,` to the `turns.push({ ... })` object.

Add a thin wrapper near the other exported helpers (so it is unit-testable without spawning Devin):

```js
// Assemble the run digest from collected turns + disk truth + evaluation.
function buildRunDigest({ scenario, role, model, turns, disk, evaluation, overallPass, repoCommit, scenarioHash }) {
  return extractRunDigest({
    scenario, role, model, disk, evaluation, overallPass, repoCommit, scenarioHash,
    turnSignals: turns.map((t) => t.signals || { mcpCalls: [], nonMcpCallCount: 0, firstTs: null, lastTs: null }),
  });
}
```

and add `buildRunDigest,` to the `export { ... }` block.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/bridge/run-investigation.test.mjs`
Expected: PASS (new test green; existing tests unaffected).

- [ ] **Step 5: Emit the digest + run-quality at end-of-run**

In `main()`, after `const evaluation = evaluateExpectations(...)` and `const overallPass = evaluation.pass;`, add:

```js
  // ── run digest (deterministic, inline) ──
  const repoCommit = (() => {
    try { return childProcess.execFileSync("git", ["-C", root, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim(); }
    catch { return null; }
  })();
  const scenarioHash = (() => {
    try { return crypto.createHash("sha256").update(fs.readFileSync(args.scenario)).digest("hex").slice(0, 12); }
    catch { return null; }
  })();
  const digest = buildRunDigest({
    scenario, role, model, turns, disk, evaluation, overallPass, repoCommit, scenarioHash,
  });
  const digestsDir = path.join(root, "_data", "bridge-digests");
  fs.mkdirSync(digestsDir, { recursive: true });
  fs.writeFileSync(path.join(digestsDir, `${path.basename(outDir)}.json`), `${JSON.stringify(digest, null, 2)}\n`);
  const runQuality = renderRunQuality(digest);
```

Ensure `childProcess` and `crypto` are imported at the top (add `import childProcess from "node:child_process";` and `import crypto from "node:crypto";` if absent).

Append `runQuality` to the report: in the `report` string write, add `runQuality` to the rendered output (append after the existing report body before `fs.writeFileSync(reportPath, report)`):

```js
  fs.writeFileSync(reportPath, `${report}\n${runQuality}`);
```

And print it to stdout before the final PASS/FAIL line:

```js
  process.stdout.write(`${runQuality}\n`);
```

- [ ] **Step 6: Verify end-to-end against a real captured run (manual smoke)**

Run (re-digests an existing run dir is out of scope; instead verify the function path via the test added above, then a lint/test sweep):
`node --test scripts/bridge/run-investigation.test.mjs scripts/bridge/digest-run.test.mjs`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/bridge/run-investigation.mjs scripts/bridge/run-investigation.test.mjs
git commit -m "feat(bridge): emit run digest + run-quality inline at end-of-run"
```

---

### Task 5: Docs + full gate

**Files:**
- Modify: `scripts/bridge/README.md`

- [ ] **Step 1: Document the output**

Add a section to `scripts/bridge/README.md` after the `expect` documentation:

```markdown
## Run quality digest

Every run prints a **Run quality** section (also appended to `report.md`) and
writes a per-run digest JSON to `_data/bridge-digests/<run>.json` (gitignored).
The digest is deterministic and self-contained — objective signals only, every
inferred signal tagged with an `outcomeBasis`. The Devin export records tool
*calls* but not *results*, so gate friction is inferred from duplicate calls and
**disambiguated against disk truth** (e.g. `record_finding` call count vs the
finding count on disk → inferred retries). Aggregation across runs, public
promotion, and LLM reflection are intentionally not built yet — see
`docs/superpowers/specs/2026-06-14-bridge-meta-retro-design.md`.
```

- [ ] **Step 2: Run the full fast gate**

Run: `node scripts/check-fast.mjs`
Expected: PASS (the new `scripts/bridge/digest-run.test.mjs` is auto-discovered by the recursive check-fast).

- [ ] **Step 3: Lint**

Run: `npx --yes @biomejs/biome@1.9.4 lint scripts`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add scripts/bridge/README.md
git commit -m "docs(bridge): document the run-quality digest"
```

---

## Verification (whole feature)

- `node scripts/check-fast.mjs` green (digest tests auto-discovered).
- Biome clean.
- A real `node scripts/bridge/run-investigation.mjs --scenario scripts/bridge/scenarios/soc-fabrication.json` (when a Devin run is performed) prints a **Run quality** block and writes `_data/bridge-digests/<run>.json`.
