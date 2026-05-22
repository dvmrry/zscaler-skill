---
title: "Investigator Benchmark Tests"
date: "2026-05-22"
status: draft
scope: "measure /z-investigator helper mechanics and agent workflow friction"
---

# Investigator Benchmark Tests

This benchmark suite separates deterministic helper overhead from agent
workflow overhead. The goal is to learn which refinements actually reduce
long-run investigation latency without weakening evidence, journal, or ledger
discipline.

## Benchmark Layers

### Layer 1: Local Helper Mechanics

Run:

```bash
node scripts/benchmark-investigator-helper.mjs
```

The script builds synthetic case directories in the OS temp directory and
seeds actual completed turn-ledger events before timing the next evidence turn.

Case sizes:

| Size | Prior ledger turns | Runs |
|---|---:|---:|
| small | 5 | 10 |
| medium | 25 | 10 |
| large | 75 | 5 |

Measured commands:

- `initialize-turn-ledger`
- `begin-turn`
- `import-evidence`
- `complete-turn-json`: legacy completion with a full hand-authored turn JSON
- `complete-turn-input`: helper-assisted completion with agent-owned input JSON
- `evidence-cycle`: `begin-turn` + `import-evidence` +
  `complete-turn --turn-input-json`

This layer answers: "Is the helper itself slow?" It does not measure model
latency, shell process startup, tmux interaction, agent-owned journal editing
time, or user-visible narration.

Pass target:

- `evidence-cycle` p95 and max stay under 250 ms for the large synthetic case.
- Any regression above 500 ms needs a measured explanation before merging a
  mechanical helper change.
- Helper-assisted completion must not add a new external command boundary. The
  safe win is reducing handwritten JSON inside the existing `complete-turn`
  command, not adding another tool round trip.

### Layer 2: Agent Workflow Scenarios

Run each scenario with the same prompt and scoring sheet across target
runtimes:

- SWE-1.6
- Codex GPT-5.4 mini or the current weaker Codex target
- Claude Code
- Optional OpenCode/Ollama weak-agent stress test

Record:

- wall time;
- visible turns;
- tool/script invocations;
- files read;
- files written;
- whether the correct helper commands were used;
- whether the journal stayed concise;
- whether turn ledger invariants held;
- whether raw helper JSON, hashes, or turn JSON were pasted into chat.

Save results under `_data/benchmarks/<run-id>/` when running against a real
workspace. For PR review, summarize only the scorecard and omit tenant data.

## Agent Scenarios

### Scenario A: Returned Evidence Import

Setup:

- A case has completed Step 3.
- `initialize-turn-ledger` has run.
- A `begin-turn` is open with `--user-action record-user-evidence`.
- The user supplies one result file plus complete source/query metadata.
- `capabilities` reports `import-evidence`.

Expected behavior:

- Use `import-evidence`.
- Keep helper output out of normal chat except for a compact summary.
- Update `journal.md` with the evidence interpretation.
- Complete the turn.
- Do not mark resolved in the same turn.

Hard failures:

- evidence left outside case-local `evidence/`;
- missing manifest row;
- raw helper JSON/hash/turn JSON pasted to user on success;
- `pendingTurn` left open;
- evidence recording mixed with `mark-resolved`.

### Scenario B: Request / Result Split

Setup:

- A previous `request-user-evidence` or `query-request` turn was completed.
- The user now returns the result file.

Expected behavior:

- Start a fresh `begin-turn` with `--user-action record-user-evidence`.
- Do not reuse the old request turn.
- Do not hold `pendingTurn` open across the user checkpoint.

Hard failures:

- reused prior request turn;
- stale `pendingTurn`;
- skipped turn ledger;
- imported evidence without a completed record turn.

### Scenario C: Mass-Read Discipline

Setup:

- The prompt names one operative case directory.
- Sibling case directories exist.
- The journal and manifest already name the next evidence action.

Expected behavior:

- Read only the operative case journal/manifest plus required workflow files.
- Do not browse sibling cases.
- Do not mass-read unrelated `references/` files unless the journal's next
  evidence requires it.

Hard failures:

- reads sibling `_data/cases/*`;
- substitutes broad reference scanning for the case evidence trail;
- chooses a next action not supported by the journal/manifest.

### Scenario D: Premature Resolution Gate

Setup:

- The user asks to mark the case resolved after some evidence has ruled out
  alternatives.
- No prior completed turn has recorded positive supporting evidence for the
  proposed root cause.

Expected behavior:

- Refuse or defer `mark-resolved`.
- Ask for or record positive evidence first.
- Preserve `mark-resolved` as a separate completed turn.

Hard failures:

- resolves by elimination alone;
- records evidence and marks resolved in the same turn;
- skips the completion gate.

## Scorecard

| Dimension | Score |
|---|---|
| Load efficiency | number of reads and elapsed time to find the needed files |
| Load selectivity | avoided unrelated repo areas and sibling cases |
| Evidence discipline | used journal, manifest, and current evidence correctly |
| State discipline | respected pending turn, one action per turn, request/result split |
| Mechanical overhead | avoided manual JSON and unnecessary repeated helper calls |
| Output quality | compact summary, no raw helper artifacts unless repair was needed |
| Correctness | chose the expected next action and avoided premature resolution |

Use `pass`, `minor issue`, `major issue`, or `fail` for each dimension, plus
one short note. Wall time alone is not a pass condition.

## Trial Prompt Template

Use this for quick agent runs:

```text
Benchmark trial. Do not improve the repo. Do not inspect unrelated files.

Scenario: <paste one scenario setup>

Use the repo workflow docs/scripts as needed. Answer with:
1. elapsed wall time;
2. files read;
3. commands run or proposed;
4. expected files written;
5. scorecard: load efficiency, load selectivity, evidence discipline, state discipline, mechanical overhead, output quality, correctness;
6. any benchmark design issue.

Keep the answer concise and do not modify files unless the scenario explicitly
requires a real run.
```

## Initial Interpretation

The first quick local trial showed helper mechanics are millisecond-scale when
called in process. That suggests the next optimization target is not hash
choice or ledger replay. The likely costs are agent ceremony, shell/tool
launches, repeated context reads, hand-written turn JSON, and verbose
user-facing artifact narration.
