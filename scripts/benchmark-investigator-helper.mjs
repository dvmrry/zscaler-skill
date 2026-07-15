#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import {
  beginTurn,
  completeTurn,
  importEvidence,
  initializeTurnLedger,
  openCase,
} from "./investigator-artifacts.mjs";
import { runtimeDataPath } from "./lib.mjs";

const DEFAULT_CONFIGS = [
  { name: "small", priorTurns: 5, runs: 10 },
  { name: "medium", priorTurns: 25, runs: 10 },
  { name: "large", priorTurns: 75, runs: 5 },
];

const args = parseArgs(process.argv.slice(2));
const configs = args.quick
  ? [
      { name: "small", priorTurns: 5, runs: 3 },
      { name: "medium", priorTurns: 25, runs: 3 },
      { name: "large", priorTurns: 75, runs: 2 },
    ]
  : DEFAULT_CONFIGS;

const rows = [];
const tempRoots = [];

try {
  for (const config of configs) {
    const buckets = {
      "initialize-turn-ledger": [],
      "begin-turn": [],
      "import-evidence": [],
      "complete-turn-json": [],
      "complete-turn-input": [],
      "evidence-cycle": [],
    };

    for (let run = 0; run < config.runs; run++) {
      const initCase = makeCase(`bench-init-${config.name}-${run}`);
      tempRoots.push(initCase.root);
      buckets["initialize-turn-ledger"].push(
        timed(() => initializeTurnLedger({ root: initCase.root, caseSlug: initCase.caseSlug })),
      );

      const c = makeReadyCase(`bench-${config.name}-${run}`, config.priorTurns);
      tempRoots.push(c.root);

      buckets["begin-turn"].push(
        timed(() => beginTurn({ root: c.root, caseSlug: c.caseSlug, userAction: "record-user-evidence" })),
      );

      let importedRefs = [];
      buckets["import-evidence"].push(
        timed(() => {
          importedRefs = doImport(c.root, c.caseSlug, run);
        }),
      );

      const turnInputPath = writeEvidenceTurnInput(c.root, c.caseSlug, c.journalPath, run, importedRefs);
      buckets["complete-turn-input"].push(
        timed(() => completeTurn({ root: c.root, caseSlug: c.caseSlug, turnInputJson: turnInputPath })),
      );

      const cJson = makeReadyCase(`bench-json-${config.name}-${run}`, config.priorTurns);
      tempRoots.push(cJson.root);
      beginTurn({ root: cJson.root, caseSlug: cJson.caseSlug, userAction: "record-user-evidence" });
      const jsonRefs = doImport(cJson.root, cJson.caseSlug, run);
      const turnJsonPath = writeEvidenceTurnJson(cJson.root, cJson.caseSlug, cJson.journalPath, run, jsonRefs);
      buckets["complete-turn-json"].push(
        timed(() => completeTurn({ root: cJson.root, caseSlug: cJson.caseSlug, turnJson: turnJsonPath })),
      );

      const c2 = makeReadyCase(`bench-cycle-${config.name}-${run}`, config.priorTurns);
      tempRoots.push(c2.root);
      buckets["evidence-cycle"].push(
        timed(() => {
          beginTurn({ root: c2.root, caseSlug: c2.caseSlug, userAction: "record-user-evidence" });
          const refs = doImport(c2.root, c2.caseSlug, run);
          const turnInputPath = writeEvidenceTurnInput(c2.root, c2.caseSlug, c2.journalPath, run, refs);
          completeTurn({ root: c2.root, caseSlug: c2.caseSlug, turnInputJson: turnInputPath });
        }),
      );
    }

    for (const [command, values] of Object.entries(buckets)) {
      const summary = summarize(values);
      rows.push({
        caseSize: config.name,
        priorTurns: config.priorTurns,
        runs: config.runs,
        command,
        p50Ms: round(summary.p50),
        p95Ms: round(summary.p95),
        maxMs: round(summary.max),
      });
    }
  }

  if (args.json) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.table(rows);
  }
} finally {
  if (!args.keepTemp) {
    for (const root of tempRoots) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
}

function parseArgs(argv) {
  const parsed = { json: false, keepTemp: false, quick: false };
  for (const arg of argv) {
    if (arg === "--json") parsed.json = true;
    else if (arg === "--keep-temp") parsed.keepTemp = true;
    else if (arg === "--quick") parsed.quick = true;
    else if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}

function printHelp() {
  console.log(`Usage: node scripts/benchmark-investigator-helper.mjs [--json] [--quick] [--keep-temp]

Benchmarks deterministic /z-investigator helper mechanics on synthetic cases.

Commands measured:
  initialize-turn-ledger
  begin-turn
  import-evidence
  complete-turn-json      complete-turn with a full hand-authored turn JSON
  complete-turn-input     complete-turn with helper-assisted agent-owned input JSON
  evidence-cycle          begin-turn + import-evidence + complete-turn-input

Case sizes seed 5, 25, and 75 completed prior ledger turns before timing the
post-Step-3 evidence path. Results are wall-clock milliseconds inside one Node
process, so they isolate helper logic from agent/tool-launch overhead.`);
}

function makeCase(caseSlug) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "zskill-helper-bench-"));
  makeRepoFiles(root, [
    "agents/investigator/prompt.md",
    "agents/investigator/harness.md",
    "references/zpa/app-segments.md",
  ]);
  const framingPath = writeJson(root, "framing.json", {
    workingDirectory: root,
    symptom: "ZPA users cannot reach wiki.internal",
    tenantCloud: "zs2",
    products: ["zpa"],
    scope: "many users",
  });
  const opened = openCase({
    root,
    caseSlug,
    framingJson: framingPath,
    proposedLoads: [
      "agents/investigator/prompt.md",
      "agents/investigator/harness.md",
    ],
  });
  writeDiscoveryJournal(opened.journalPath);
  return { root, caseSlug, journalPath: opened.journalPath };
}

function makeReadyCase(caseSlug, priorTurns) {
  const c = makeCase(caseSlug);
  initializeTurnLedger({ root: c.root, caseSlug: c.caseSlug });
  for (let i = 0; i < priorTurns; i++) {
    beginTurn({ root: c.root, caseSlug: c.caseSlug, userAction: "continue-top-open" });
    const turnPath = writePriorTurnJson(c.root, c.caseSlug, c.journalPath, i);
    completeTurn({ root: c.root, caseSlug: c.caseSlug, turnJson: turnPath });
  }
  return c;
}

function makeRepoFiles(root, relativePaths) {
  for (const relativePath of relativePaths) {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `# ${path.basename(relativePath)}\n`, "utf8");
  }
}

function writeDiscoveryJournal(journalPath) {
  fs.writeFileSync(journalPath, `# Discovery Journal

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
| H1: Application segment may not include the app | references/zpa/app-segments.md | Open (uncertain) | Check application segment snapshot | 2026-05-17T00:00:00.000Z | reference-grounded |

## Resolution

Open.
`, "utf8");
}

function writePriorTurnJson(root, caseSlug, journalPath, index) {
  fs.appendFileSync(journalPath, `\nTurn update ${index}: checked one benchmark source.\n`, "utf8");
  const pending = readPendingTurn(root, caseSlug);
  return writeJson(root, `prior-turn-${index}.json`, {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "load-file",
    actionSummary: "Checked one benchmark source.",
    touchedClaims: ["H1"],
    evidenceRefs: [],
    journalHashBefore: pending.journalHashBefore,
    allowedNext: [
      "continue-top-open",
      "investigate-different-claim",
      "request-user-evidence",
      "record-user-evidence",
      "add-evidence",
      "mark-resolved",
      "pause",
    ],
  });
}

function writeEvidenceTurnInput(root, caseSlug, journalPath, index, evidenceRefs) {
  fs.appendFileSync(journalPath, `\nTurn update: recorded benchmark evidence ${index}.\n`, "utf8");
  return writeJson(root, `evidence-turn-input-${index}.json`, {
    actionType: "record-user-evidence",
    actionSummary: "Recorded benchmark evidence.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs,
    allowedNext: ["pause"],
  });
}

function writeEvidenceTurnJson(root, caseSlug, journalPath, index, evidenceRefs) {
  fs.appendFileSync(journalPath, `\nTurn update: recorded benchmark evidence ${index}.\n`, "utf8");
  const pending = readPendingTurn(root, caseSlug);
  return writeJson(root, `evidence-turn-${index}.json`, {
    sequence: pending.sequence,
    previousHash: pending.priorLatestTurnHash,
    turnToken: pending.turnToken,
    userAction: pending.userAction,
    actionType: "record-user-evidence",
    actionSummary: "Recorded benchmark evidence.",
    touchedClaims: ["H1: Application segment may not include the app"],
    evidenceRefs,
    journalHashBefore: pending.journalHashBefore,
    allowedNext: ["pause"],
  });
}

function doImport(root, caseSlug, index) {
  const sourceFile = path.join(root, `result-${index}.json`);
  fs.writeFileSync(sourceFile, JSON.stringify({ rows: [{ event: "allowed" }] }), "utf8");
  const result = importEvidence({
    root,
    caseSlug,
    sourceFile,
    name: `result-${index}`,
    source: "Splunk",
    query: "index=zscaler_proxy sourcetype=zscalernss-web host=wiki.internal",
    summary: "Allowed proxy event observed.",
    capturedAt: "2026-05-21T00:00:00Z",
    touchedClaims: ["H1: Application segment may not include the app"],
  });
  return result.evidenceRefs;
}

function readPendingTurn(root, caseSlug) {
  const statePath = runtimeDataPath(root, "cases", caseSlug, "workflow", "02-turn-state.json");
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  if (!state.pendingTurn) throw new Error(`No pending turn for ${caseSlug}`);
  return state.pendingTurn;
}

function writeJson(root, name, value) {
  const target = path.join(root, name);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return target;
}

function timed(fn) {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

function summarize(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  return {
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    max: sorted[sorted.length - 1],
  };
}

function percentile(sorted, p) {
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

function round(value) {
  return Number(value.toFixed(2));
}
