#!/usr/bin/env node
//
// run-investigation.mjs — self-contained, multi-turn investigation bridge harness.
//
// LOCAL-ONLY TOOL. This is NOT a CI test. It spawns the `devin` CLI (needs auth +
// network) to drive a tool-capable runtime through a MULTI-TURN scripted case, then
// independently verifies the case's on-disk gate state using THIS repo's own helper
// exports (scripts/investigator-artifacts.mjs). Zero coupling to any external plugin —
// the only external dependency is the `devin` binary; everything else is Node stdlib
// plus repo-local imports.
//
// Usage:
//   node scripts/bridge/run-investigation.mjs --scenario <scenario.json> [--model <m>] [--out-dir <dir>]
//   node scripts/bridge/run-investigation.mjs --help
//
// What it does:
//   1. Loads a scenario JSON (shape below).
//   2. Drives `devin` turn-by-turn (turn 0 starts a session; later turns resume it
//      with -r <session_id>, carrying conversation state headless).
//   3. Captures each turn's stdout AND the parsed agent steps from the --export
//      transcript.
//   4. Verifies the case on disk with caseStatus()/renderCaseReport() from the repo
//      helper — phase, ledger consistency, archived generations, journal claim counts.
//   5. Evaluates scenario.expect (disk phase, max archived generations, forbidden /
//      required transcript strings, forbidden claim statuses) → overall PASS/FAIL.
//   6. Writes report.md + transcript.json into the run output dir.
//
// Devin CLI primitives this harness relies on (verified by hand):
//   - Turn 0: `devin --model <m> -p --prompt-file <pf> --export <out.json>` runs
//     headless, prints the final answer to stdout, writes a transcript to <out.json>.
//   - Resume: `devin -r <session_id> --model <m> -p "<msg>" --export <out.json>`.
//   - Export schema:
//       { session_id: string, agent: {...},
//         steps: [ { source: "user"|"system"|"agent", message: <string|object>, metadata: {...} } ] }
//     Agent text turns are steps with source === "agent" and a string `message`.
//   - session_id is read from the turn-0 export's top-level `session_id`.
//
// Optional per-session permission lock: scenario.permissionConfig points at a JSON
// permission config; the harness copies it into `.devin/config.local.json` for the run
// and restores/removes it afterward (try/finally) so the user's workspace is left clean.
// It never touches the user's real `.devin/config.json`.
//
// Scenario JSON shape:
//   {
//     "id": "forge6-replay",                 // run identifier (used in dir + report)
//     "role": "investigator"|"auditor"|"soc", // optional; defaults to "investigator"
//     "caseSlug": "bridge-forge6",           // investigator case slug (role:investigator)
//     "auditSlug": "bridge-audit-1",         // auditor audit slug (role:auditor)
//     "reviewSlug": "bridge-soc-1",          // SOC review slug (role:soc)
//     "root": "/abs/path/to/zscaler-skill",  // repo root the case lives under
//     "model": "swe-1.6",                    // default devin model (overridable via --model)
//     "permissionConfig": "scripts/bridge/scenarios/mcp-readonly.config.json", // optional
//     "turns": [ { "prompt": "..." }, { "prompt": "..." } ],
//     "expect": {
//       // Investigator-only:
//       "diskPhase": "turn-ready",                                    // optional exact phase match
//       "maxArchivedGenerations": 0,                                  // optional ceiling
//       "forbidStatuses": ["Confirmed (high)", "Resolved", "Ruled out"], // claim statuses that must NOT appear
//       // Auditor-only:
//       "minFindings": 1,                                             // audit must have at least N findings
//       "allFindingsSourced": true,                                   // every finding in ledger must have a source
//       // Both:
//       "forbidTranscriptStrings": ["traceroute", "CPUUtilization"],  // must NOT appear in any agent response
//       "requireTranscriptStrings": []                                // must appear somewhere across responses
//     }
//   }
//
// Exit code: 0 on overall PASS, 1 on overall FAIL.

import childProcess, { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { extractTurnSignals, extractRunDigest, renderRunQuality } from "./digest-run.mjs";

// Resolve the repo helpers relative to THIS script (scripts/bridge/ -> scripts/).
import {
  caseStatus,
  renderCaseReport,
} from "../investigator-artifacts.mjs";

import {
  auditStatus,
  latestFindings,
  renderAuditReport,
  resolveSource,
} from "../auditor-artifacts.mjs";

import {
  socStatus,
  renderSocReport,
  resolveSource as socResolveSource,
} from "../soc-artifacts.mjs";
import { runtimeDataPath } from "../lib.mjs";

const USAGE = `Usage:
  node scripts/bridge/run-investigation.mjs --scenario <scenario.json> [--model <m>] [--out-dir <dir>]
  node scripts/bridge/run-investigation.mjs --help

LOCAL-ONLY. Drives the \`devin\` CLI through a multi-turn scripted investigation
(needs devin auth + network), captures each turn's response, then independently
verifies the case's on-disk gate state via this repo's own helper exports.
NOT a CI test — do not wire into check-fast.

Flags:
  --scenario <path>   Path to the scenario JSON (required). See file header for shape.
  --model <m>         Override scenario.model (default: scenario.model or "swe-1.6").
  --out-dir <dir>     Override the run output directory.
  --help              Print this help and exit 0.
`;

const DEFAULT_MODEL = "swe-1.6";

// ── pure helpers (unit-tested with fixtures; no devin, no disk) ──────────────

/**
 * Extract agent text responses from a parsed devin --export object.
 * Agent text turns are steps with source === "agent" and a STRING message.
 * Non-string messages are skipped here; MCP tool calls are NOT object-valued
 * messages — they live in step.metadata.extensions and are captured separately
 * by extractToolCalls().
 * Returns an array of trimmed non-empty strings, in order.
 */
function extractAgentMessages(exportObj) {
  if (!exportObj || !Array.isArray(exportObj.steps)) return [];
  const out = [];
  for (const step of exportObj.steps) {
    if (!step || step.source !== "agent") continue;
    if (typeof step.message !== "string") continue;
    const trimmed = step.message.trim();
    if (trimmed.length > 0) out.push(trimmed);
  }
  return out;
}

/**
 * Extract the ordered sequence of MCP tool calls from a parsed devin --export
 * object. Devin records tool calls in step.metadata.extensions
 * ["chisel/tool_call_content"] (keyed by call id), NOT as object-valued
 * messages. MCP tool calls carry _meta["cognition.ai/eventType"] ===
 * "mcp_tool_call" and _meta["cognition.ai/toolName"] === "mcp__<server>__<tool>";
 * we return the bare <tool> names in call order. Non-MCP tool calls (file reads,
 * "list tools", etc.) are skipped. Tolerates missing/garbled shapes → [].
 */
function extractToolCalls(exportObj) {
  if (!exportObj || !Array.isArray(exportObj.steps)) return [];
  const calls = [];
  for (const step of exportObj.steps) {
    if (!step || step.source !== "agent") continue;
    const extensions = step.metadata && step.metadata.extensions;
    const content = extensions && extensions["chisel/tool_call_content"];
    if (!content || typeof content !== "object") continue;
    for (const callId of Object.keys(content)) {
      const call = content[callId];
      const meta = call && call._meta;
      if (!meta || meta["cognition.ai/eventType"] !== "mcp_tool_call") continue;
      const toolName = meta["cognition.ai/toolName"];
      if (typeof toolName !== "string" || toolName.length === 0) continue;
      // "mcp__<server>__<tool>" → "<tool>". The separator is a double
      // underscore; the server may contain hyphens, and tool names do not
      // contain "__", so splitting on "__" and taking the tail is safe.
      const parts = toolName.split("__");
      calls.push(parts.length >= 3 ? parts.slice(2).join("__") : toolName);
    }
  }
  return calls;
}

/** Read the top-level session_id from a parsed export object (or null). */
function extractSessionId(exportObj) {
  if (exportObj && typeof exportObj.session_id === "string" && exportObj.session_id.length > 0) {
    return exportObj.session_id;
  }
  return null;
}

/**
 * Evaluate scenario.expect against the captured disk status and transcript text.
 *
 * @param {object} expect            scenario.expect (any/all keys optional)
 * @param {object} disk              Investigator: { phase, archivedGenerations, claimCounts }
 *                                   Auditor: { phase, findingCounts, allFindingsSourced }
 * @param {string[]} agentResponses  flat array of every captured agent text response
 * @param {string[]} toolCalls       ordered bare MCP tool names across all turns
 * @returns {{ checks: Array<{name, pass, detail}>, pass: boolean }}
 */
function evaluateExpectations(expect, disk, agentResponses, toolCalls) {
  const checks = [];
  const exp = expect || {};
  const phase = disk ? disk.phase : null;
  const archived = disk ? disk.archivedGenerations : null;
  const claimCounts = (disk && disk.claimCounts) || {};
  const haystack = (agentResponses || []).join("\n");
  const tools = toolCalls || [];

  // ── Investigator-only checks ──────────────────────────────────────────────

  if (typeof exp.diskPhase === "string") {
    const pass = phase === exp.diskPhase;
    checks.push({
      name: `diskPhase === "${exp.diskPhase}"`,
      pass,
      detail: pass ? `phase is "${phase}"` : `phase is "${phase}" (expected "${exp.diskPhase}")`,
    });
  }

  if (typeof exp.maxArchivedGenerations === "number") {
    const value = typeof archived === "number" ? archived : 0;
    const pass = value <= exp.maxArchivedGenerations;
    checks.push({
      name: `archivedGenerations <= ${exp.maxArchivedGenerations}`,
      pass,
      detail: pass
        ? `archivedGenerations is ${value}`
        : `archivedGenerations is ${value} (max ${exp.maxArchivedGenerations})`,
    });
  }

  if (Array.isArray(exp.forbidStatuses)) {
    const present = Object.keys(claimCounts);
    const violations = exp.forbidStatuses.filter((s) => present.includes(s));
    const pass = violations.length === 0;
    checks.push({
      name: `no forbidden claim statuses present`,
      pass,
      detail: pass
        ? `none of [${exp.forbidStatuses.join(", ")}] present`
        : `forbidden statuses present: [${violations.join(", ")}]`,
    });
  }

  // ── Auditor-only checks ───────────────────────────────────────────────────

  if (typeof exp.minFindings === "number") {
    const total = (disk && disk.findingCounts && typeof disk.findingCounts.total === "number")
      ? disk.findingCounts.total
      : 0;
    const pass = total >= exp.minFindings;
    checks.push({
      name: `findingCount >= ${exp.minFindings}`,
      pass,
      detail: pass
        ? `findingCount is ${total}`
        : `findingCount is ${total} (required >= ${exp.minFindings})`,
    });
  }

  if (exp.allFindingsSourced === true) {
    const sourced = (disk && typeof disk.allFindingsSourced === "boolean")
      ? disk.allFindingsSourced
      : false;
    checks.push({
      name: `allFindingsSourced`,
      pass: sourced,
      detail: sourced
        ? "every finding in the ledger carries a recorded source"
        : "one or more findings in the ledger are missing a source",
    });
  }

  // ── Both ──────────────────────────────────────────────────────────────────

  if (Array.isArray(exp.forbidTranscriptStrings)) {
    const violations = exp.forbidTranscriptStrings.filter((s) => haystack.includes(s));
    const pass = violations.length === 0;
    checks.push({
      name: `no forbidden transcript strings`,
      pass,
      detail: pass
        ? `none of [${exp.forbidTranscriptStrings.join(", ")}] appeared`
        : `forbidden strings appeared: [${violations.join(", ")}]`,
    });
  }

  if (Array.isArray(exp.requireTranscriptStrings)) {
    const missing = exp.requireTranscriptStrings.filter((s) => !haystack.includes(s));
    const pass = missing.length === 0;
    checks.push({
      name: `required transcript strings present`,
      pass,
      detail: pass
        ? `all required strings present`
        : `missing required strings: [${missing.join(", ")}]`,
    });
  }

  if (Array.isArray(exp.expectedToolSequence)) {
    // Ordered-subsequence check: each expected tool name must appear in the
    // actual MCP tool-call order (not necessarily contiguous). Catches the
    // forge-when-blocked pattern that the outcome-only checks miss — e.g.
    // render_*_report called before any record_finding (an empty register
    // rendered, then narrated over).
    let idx = 0;
    for (const name of tools) {
      if (idx < exp.expectedToolSequence.length && name === exp.expectedToolSequence[idx]) {
        idx += 1;
      }
    }
    const pass = idx === exp.expectedToolSequence.length;
    checks.push({
      name: `toolSequence ⊇ [${exp.expectedToolSequence.join(" → ")}]`,
      pass,
      detail: pass
        ? `expected gate tool calls appeared in order`
        : `expected order [${exp.expectedToolSequence.join(" → ")}] not satisfied; actual MCP tool calls: [${tools.join(", ")}]`,
    });
  }

  const pass = checks.every((c) => c.pass);
  return { checks, pass };
}

// ── CLI arg parsing ──────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { scenario: null, model: null, outDir: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
    } else if (a === "--scenario") {
      args.scenario = argv[++i];
    } else if (a === "--model") {
      args.model = argv[++i];
    } else if (a === "--out-dir") {
      args.outDir = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

// ── side-effecting helpers (only run in the live path; not unit-tested) ──────

/** Run one devin invocation, returning { ok, stdout, stderr, code }. Never throws. */
function runDevin(devinArgs) {
  let result;
  try {
    result = spawnSync("devin", devinArgs, {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (err) {
    return { ok: false, stdout: "", stderr: String(err && err.message), code: null };
  }
  if (result.error) {
    return {
      ok: false,
      stdout: result.stdout || "",
      stderr: String(result.error.message),
      code: result.status,
    };
  }
  const ok = result.status === 0 && (result.stdout || "").trim().length > 0;
  return {
    ok,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    code: result.status,
  };
}

/** Safe-parse a JSON file; returns { obj, error }. */
function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return { obj: JSON.parse(raw), error: null };
  } catch (err) {
    return { obj: null, error: String(err && err.message) };
  }
}

/**
 * Install the scenario's permission config as .devin/config.local.json for the run.
 * Returns a restore function (idempotent) that puts the workspace back exactly as it was.
 * Never clobbers .devin/config.json (the user's real config).
 */
function installPermissionConfig(root, permissionConfigPath) {
  const devinDir = path.join(root, ".devin");
  const target = path.join(devinDir, "config.local.json");
  const src = path.isAbsolute(permissionConfigPath)
    ? permissionConfigPath
    : path.join(root, permissionConfigPath);

  const hadDir = fs.existsSync(devinDir);
  const hadTarget = fs.existsSync(target);
  let savedTarget = null;
  if (hadTarget) savedTarget = fs.readFileSync(target, "utf8");

  fs.mkdirSync(devinDir, { recursive: true });
  fs.copyFileSync(src, target);

  return function restore() {
    try {
      if (hadTarget && savedTarget !== null) {
        fs.writeFileSync(target, savedTarget);
      } else if (fs.existsSync(target)) {
        fs.rmSync(target);
      }
      // Only remove .devin if WE created it and it is now empty.
      if (!hadDir && fs.existsSync(devinDir)) {
        const remaining = fs.readdirSync(devinDir);
        if (remaining.length === 0) fs.rmdirSync(devinDir);
      }
    } catch (_) {
      // Best-effort cleanup; never throw out of finally.
    }
  };
}

// ── report rendering ─────────────────────────────────────────────────────────

function trimBlock(text, limit = 4000) {
  if (typeof text !== "string") return "";
  const t = text.trim();
  if (t.length <= limit) return t;
  return `${t.slice(0, limit)}\n… [truncated ${t.length - limit} chars]`;
}

function renderReport({ scenario, model, outDir, turns, disk, caseReport, evaluation, overallPass }) {
  const lines = [];
  lines.push(`# Bridge investigation run: ${scenario.id}`);
  lines.push("");
  lines.push(`- Model: \`${model}\``);
  lines.push(`- Case slug: \`${scenario.caseSlug}\``);
  lines.push(`- Root: \`${scenario.root}\``);
  lines.push(`- Output dir: \`${outDir}\``);
  lines.push(`- Overall: **${overallPass ? "PASS" : "FAIL"}**`);
  lines.push("");

  lines.push("## Turns");
  lines.push("");
  for (const turn of turns) {
    lines.push(`### Turn ${turn.index}${turn.resumed ? " (resumed)" : ""}`);
    lines.push("");
    lines.push(`- devin exit: ${turn.exitCode === null ? "n/a" : turn.exitCode} (${turn.ok ? "ok" : "error/empty"})`);
    if (turn.exportError) lines.push(`- export parse error: ${turn.exportError}`);
    lines.push("");
    lines.push("**Prompt:**");
    lines.push("");
    lines.push("```");
    lines.push(trimBlock(turn.prompt, 2000));
    lines.push("```");
    lines.push("");
    lines.push("**Captured agent response(s):**");
    lines.push("");
    if (turn.agentResponses.length === 0) {
      lines.push("_(no agent text captured)_");
    } else {
      for (const resp of turn.agentResponses) {
        lines.push("```");
        lines.push(trimBlock(resp));
        lines.push("```");
      }
    }
    if (turn.stderr && turn.stderr.trim().length > 0) {
      lines.push("");
      lines.push("**stderr (tail):**");
      lines.push("");
      lines.push("```");
      lines.push(trimBlock(turn.stderr, 1500));
      lines.push("```");
    }
    lines.push("");
  }

  lines.push("## Disk verdict (independent — repo helper)");
  lines.push("");
  if (!disk) {
    lines.push("_Case status could not be computed (the case may never have been created)._");
  } else {
    lines.push(`- Phase: \`${disk.phase}\``);
    lines.push(`- Ledger consistent: ${disk.ledgerConsistent}`);
    lines.push(`- Ledger currentSequence: ${disk.currentSequence}`);
    lines.push(`- Archived ledger generations: ${disk.archivedGenerations}`);
    const claimEntries = Object.entries(disk.claimCounts || {});
    if (claimEntries.length === 0) {
      lines.push(`- Journal claim counts: _(none)_`);
    } else {
      lines.push(`- Journal claim counts:`);
      for (const [status, count] of claimEntries) {
        lines.push(`  - ${status}: ${count}`);
      }
    }
  }
  lines.push("");

  lines.push("## Rendered case report (from on-disk artifacts)");
  lines.push("");
  if (caseReport && caseReport.ok) {
    lines.push("```markdown");
    lines.push(trimBlock(caseReport.text, 8000));
    lines.push("```");
  } else {
    lines.push(`_renderCaseReport unavailable: ${caseReport ? caseReport.error : "case not created"}_`);
  }
  lines.push("");

  lines.push("## Expectations");
  lines.push("");
  if (evaluation.checks.length === 0) {
    lines.push("_(no expectations declared in scenario)_");
  } else {
    for (const check of evaluation.checks) {
      lines.push(`- [${check.pass ? "PASS" : "FAIL"}] ${check.name} — ${check.detail}`);
    }
  }
  lines.push("");
  lines.push(`## Overall: ${overallPass ? "PASS" : "FAIL"}`);
  lines.push("");
  return lines.join("\n");
}

// ── main ──────────────────────────────────────────────────────────────────────

function computeDiskStatus(root, caseSlug) {
  try {
    const status = caseStatus({ root, caseSlug });
    return {
      ok: true,
      phase: status.phase,
      ledgerConsistent: status.ledger ? status.ledger.consistent : false,
      currentSequence: status.ledger ? status.ledger.currentSequence : null,
      archivedGenerations: status.ledger ? status.ledger.archivedGenerations : 0,
      claimCounts: status.journal ? status.journal.claimCounts : {},
    };
  } catch (err) {
    return { ok: false, error: String(err && err.message) };
  }
}

function computeCaseReport(root, caseSlug) {
  try {
    const text = renderCaseReport({ root, caseSlug });
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: String(err && err.message) };
  }
}

/**
 * Compute the auditor disk status for a bridge scenario with role:"auditor".
 *
 * Returns:
 *   { ok, phase, findingCounts, checksRecorded, allFindingsSourced, error? }
 *
 * allFindingsSourced is true when every latest finding snapshot has resolving
 * original evidence and every Resolved snapshot has resolving verification
 * evidence. The helper gates both at write time; this is a post-hoc check.
 */
function computeAuditDiskStatus(root, auditSlug) {
  try {
    const status = auditStatus({ root, auditSlug });
    // Check that every finding has a source that actually resolves (belt-and-suspenders —
    // the helper gate enforces this at record time, but the bridge re-verifies from the
    // ledger to catch findings that slipped through, e.g. via the trailing-newline
    // off-by-one). Presence alone is not sufficient; we call resolveSource() so that a
    // non-empty but unresolvable source string is also rejected.
    const findingsPath = runtimeDataPath(root, "audits", auditSlug, "findings.jsonl");
    const checksDir = runtimeDataPath(root, "audits", auditSlug, "checks");
    let allFindingsSourced = true;
    try {
      if (fs.existsSync(findingsPath)) {
        const lines = fs.readFileSync(findingsPath, "utf8").trim().split("\n").filter(Boolean);
        const findings = latestFindings(lines.map((line) => JSON.parse(line)));
        for (const f of findings) {
          if (!f.source || String(f.source).trim() === "") {
            allFindingsSourced = false;
            break;
          }
          const resolved = resolveSource(root, checksDir, f.source);
          if (!resolved.resolves) {
            allFindingsSourced = false;
            break;
          }
          if (f.status === "Resolved") {
            const verification = resolveSource(root, checksDir, f.verificationSource);
            if (
              !verification.resolves ||
              (verification.type !== "file-line" && verification.type !== "check")
            ) {
              allFindingsSourced = false;
              break;
            }
          }
        }
      }
    } catch (_) {
      allFindingsSourced = false;
    }
    return {
      ok: true,
      phase: status.phase,
      findingCounts: status.findingCounts,
      checksRecorded: status.checksRecorded,
      allFindingsSourced,
    };
  } catch (err) {
    return { ok: false, error: String(err && err.message) };
  }
}

/**
 * Compute the audit report for the bridge (role:"auditor").
 * Returns { ok, text } or { ok: false, error }.
 */
function computeAuditReport(root, auditSlug) {
  try {
    const text = renderAuditReport({ root, auditSlug });
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: String(err && err.message) };
  }
}

/**
 * Compute the SOC disk status for a bridge scenario with role:"soc".
 *
 * Returns:
 *   { ok, phase, findingCounts, evidenceRecorded, allFindingsSourced, error? }
 *
 * allFindingsSourced is true when every finding in findings.jsonl has a
 * resolving source (re-verified post-hoc using socResolveSource()).
 */
function computeSocDiskStatus(root, reviewSlug) {
  try {
    const status = socStatus({ root, reviewSlug });
    const findingsPath = runtimeDataPath(root, "soc-reviews", reviewSlug, "findings.jsonl");
    const evidenceDir = runtimeDataPath(root, "soc-reviews", reviewSlug, "evidence");
    let allFindingsSourced = true;
    try {
      if (fs.existsSync(findingsPath)) {
        const lines = fs.readFileSync(findingsPath, "utf8").trim().split("\n").filter(Boolean);
        for (const line of lines) {
          const f = JSON.parse(line);
          if (!f.source || String(f.source).trim() === "") {
            allFindingsSourced = false;
            break;
          }
          const resolved = socResolveSource(root, evidenceDir, f.source);
          if (!resolved.resolves) {
            allFindingsSourced = false;
            break;
          }
        }
      }
    } catch (_) {
      allFindingsSourced = false;
    }
    return {
      ok: true,
      phase: status.phase,
      findingCounts: status.findingCounts,
      evidenceRecorded: status.evidenceRecorded,
      allFindingsSourced,
    };
  } catch (err) {
    return { ok: false, error: String(err && err.message) };
  }
}

/**
 * Compute the SOC report for the bridge (role:"soc").
 * Returns { ok, text } or { ok: false, error }.
 */
function computeSocReport(root, reviewSlug) {
  try {
    const text = renderSocReport({ root, reviewSlug });
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: String(err && err.message) };
  }
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`${err.message}\n\n${USAGE}`);
    process.exit(1);
    return;
  }

  if (args.help || !args.scenario) {
    process.stdout.write(USAGE);
    process.exit(args.help ? 0 : 1);
    return;
  }

  const scenarioPath = path.resolve(args.scenario);
  const { obj: scenario, error: scenarioError } = readJsonFile(scenarioPath);
  if (scenarioError) {
    process.stderr.write(`Failed to read scenario ${scenarioPath}: ${scenarioError}\n`);
    process.exit(1);
    return;
  }

  const role = scenario.role || "investigator";

  if (role === "auditor") {
    if (!scenario.id || !scenario.auditSlug || !scenario.root || !Array.isArray(scenario.turns)) {
      process.stderr.write(
        "Auditor scenario must include id, auditSlug, root, and a turns[] array.\n",
      );
      process.exit(1);
      return;
    }
  } else if (role === "soc") {
    if (!scenario.id || !scenario.reviewSlug || !scenario.root || !Array.isArray(scenario.turns)) {
      process.stderr.write(
        "SOC scenario must include id, reviewSlug, root, and a turns[] array.\n",
      );
      process.exit(1);
      return;
    }
  } else {
    if (!scenario.id || !scenario.caseSlug || !scenario.root || !Array.isArray(scenario.turns)) {
      process.stderr.write(
        "Scenario must include id, caseSlug, root, and a turns[] array.\n",
      );
      process.exit(1);
      return;
    }
  }

  const model = args.model || scenario.model || DEFAULT_MODEL;
  const root = scenario.root;

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = args.outDir
    ? path.resolve(args.outDir)
    : runtimeDataPath(root, "bridge-runs", `${scenario.id}-${stamp}`);
  fs.mkdirSync(outDir, { recursive: true });

  // Optional permission lock — installed for the whole run, restored in finally.
  let restorePermissions = () => {};
  if (scenario.permissionConfig) {
    restorePermissions = installPermissionConfig(root, scenario.permissionConfig);
  }

  // Snapshot the per-role finding count BEFORE driving the model, so the digest's
  // retry signal isolates findings created THIS run from any a prior run left on a
  // reused slug (findings.jsonl appends). See DAV-14.
  const preFindingCount = (() => {
    try {
      const pre = role === "auditor" ? computeAuditDiskStatus(root, scenario.auditSlug)
        : role === "soc" ? computeSocDiskStatus(root, scenario.reviewSlug)
        : null;
      return pre && pre.findingCounts && typeof pre.findingCounts.total === "number" ? pre.findingCounts.total : 0;
    } catch {
      return 0;
    }
  })();

  const turns = [];
  let sessionId = null;

  try {
    for (let i = 0; i < scenario.turns.length; i++) {
      const turnSpec = scenario.turns[i];
      const prompt = String(turnSpec.prompt || "");
      const exportPath = path.join(outDir, `turn-${i}.json`);

      let devinArgs;
      let promptFile = null;
      if (i === 0) {
        // Turn 0: prompt-file + start a new session.
        promptFile = path.join(outDir, `turn-${i}.prompt.txt`);
        fs.writeFileSync(promptFile, prompt);
        devinArgs = ["--model", model, "-p", "--prompt-file", promptFile, "--export", exportPath];
      } else {
        // Resume turns carry state with -r <session_id>.
        if (!sessionId) {
          turns.push({
            index: i,
            resumed: true,
            prompt,
            ok: false,
            exitCode: null,
            stdout: "",
            stderr: "no session_id captured from turn 0; cannot resume",
            agentResponses: [],
            exportError: null,
          });
          continue;
        }
        devinArgs = ["-r", sessionId, "--model", model, "-p", prompt, "--export", exportPath];
      }

      const run = runDevin(devinArgs);

      // Parse export (tolerate missing/garbled — record and continue).
      let agentResponses = [];
      let toolCalls = [];
      let signals = { mcpCalls: [], nonMcpCallCount: 0, firstTs: null, lastTs: null };
      let exportError = null;
      if (fs.existsSync(exportPath)) {
        const { obj: exportObj, error } = readJsonFile(exportPath);
        if (error) {
          exportError = error;
        } else {
          agentResponses = extractAgentMessages(exportObj);
          toolCalls = extractToolCalls(exportObj);
          signals = extractTurnSignals(exportObj);
          if (i === 0) sessionId = extractSessionId(exportObj);
        }
      } else {
        exportError = "no export file written";
      }

      turns.push({
        index: i,
        resumed: i > 0,
        prompt,
        ok: run.ok,
        exitCode: run.code,
        stdout: run.stdout,
        stderr: run.stderr,
        agentResponses,
        toolCalls,
        signals,
        exportError,
      });
    }
  } finally {
    restorePermissions();
  }

  // ── independent disk verification (repo helper) ──
  let disk = null;
  let caseReport = null;

  if (role === "auditor") {
    const diskResult = computeAuditDiskStatus(root, scenario.auditSlug);
    disk = diskResult.ok ? diskResult : null;
    caseReport = computeAuditReport(root, scenario.auditSlug);
  } else if (role === "soc") {
    const diskResult = computeSocDiskStatus(root, scenario.reviewSlug);
    disk = diskResult.ok ? diskResult : null;
    caseReport = computeSocReport(root, scenario.reviewSlug);
  } else {
    const diskResult = computeDiskStatus(root, scenario.caseSlug);
    disk = diskResult.ok ? diskResult : null;
    caseReport = computeCaseReport(root, scenario.caseSlug);
  }

  // ── evaluate expectations ──
  const allAgentResponses = turns.flatMap((t) => t.agentResponses);
  const allToolCalls = turns.flatMap((t) => t.toolCalls);
  const evaluation = evaluateExpectations(scenario.expect, disk, allAgentResponses, allToolCalls);
  const overallPass = evaluation.pass;

  // ── run digest (deterministic, inline) ──
  const repoCommit = (() => {
    try { return childProcess.execFileSync("git", ["-C", root, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim(); }
    catch { return null; }
  })();
  const scenarioHash = (() => {
    try { return crypto.createHash("sha256").update(fs.readFileSync(scenarioPath)).digest("hex").slice(0, 12); }
    catch { return null; }
  })();
  const digest = buildRunDigest({ scenario, role, model, turns, disk, evaluation, overallPass, repoCommit, scenarioHash, preFindingCount });
  const digestsDir = runtimeDataPath(root, "bridge-digests");
  fs.mkdirSync(digestsDir, { recursive: true });
  fs.writeFileSync(path.join(digestsDir, `${path.basename(outDir)}.json`), `${JSON.stringify(digest, null, 2)}\n`);
  const runQuality = renderRunQuality(digest);

  // ── write artifacts ──
  const reportPath = path.join(outDir, "report.md");
  const report = renderReport({
    scenario,
    model,
    outDir,
    turns,
    disk,
    caseReport,
    evaluation,
    overallPass,
  });
  fs.writeFileSync(reportPath, `${report}\n${runQuality}`);

  const transcriptPath = path.join(outDir, "transcript.json");
  fs.writeFileSync(
    transcriptPath,
    `${JSON.stringify(
      {
        scenarioId: scenario.id,
        role,
        model,
        caseSlug: scenario.caseSlug || null,
        auditSlug: scenario.auditSlug || null,
        reviewSlug: scenario.reviewSlug || null,
        sessionId,
        turns: turns.map((t) => ({
          index: t.index,
          resumed: t.resumed,
          ok: t.ok,
          exitCode: t.exitCode,
          exportError: t.exportError,
          agentResponses: t.agentResponses,
          toolCalls: t.toolCalls,
          stdout: t.stdout,
        })),
        disk,
        caseReport: caseReport && caseReport.ok ? { ok: true } : { ok: false, error: caseReport ? caseReport.error : "not computed" },
        evaluation,
        overallPass,
      },
      null,
      2,
    )}\n`,
  );

  process.stdout.write(`${runQuality}\n`);
  process.stdout.write(`${overallPass ? "PASS" : "FAIL"}\n`);
  process.stdout.write(`report: ${reportPath}\n`);
  process.exit(overallPass ? 0 : 1);
}

// Assemble the run digest from collected turns + disk truth + evaluation.
function buildRunDigest({ scenario, role, model, turns, disk, evaluation, overallPass, repoCommit, scenarioHash, preFindingCount }) {
  return extractRunDigest({
    scenario, role, model, disk, evaluation, overallPass, repoCommit, scenarioHash, preFindingCount,
    turnSignals: turns.map((t) => t.signals || { mcpCalls: [], nonMcpCallCount: 0, firstTs: null, lastTs: null }),
  });
}

// Only run main() when invoked directly (not when imported by the test file).
const isDirectInvocation =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectInvocation) {
  main();
}

export {
  extractAgentMessages,
  extractToolCalls,
  extractSessionId,
  evaluateExpectations,
  parseArgs,
  trimBlock,
  installPermissionConfig,
  computeAuditDiskStatus,
  computeAuditReport,
  computeSocDiskStatus,
  computeSocReport,
  buildRunDigest,
};
