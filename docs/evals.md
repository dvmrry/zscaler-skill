---
product: shared
topic: "evals-index"
title: "Eval suite — behavioral specifications and runner usage"
content-type: reference
last-verified: "2026-07-20"
confidence: high
sources: []
author-status: draft
---

# Eval suite — `evals.json`

Hand-written behavioral specifications: 31 entries shaped as `{prompt, expected_output, assertions, must_cite, must_not_say, expected_confidence, tenant_data_required}`, where `must_cite` lists graph IDs (a few entries also carry `must_cite_files` paths). Captures concrete examples of "what a correct answer looks like" for the skill across URL filtering, ZPA segments and API-publication drift, ZCC forwarding, SSL inspection, AI Security source-boundary handling, SDK/accessor lifecycle boundaries, SOC evidence-first taxonomy mapping, and other high-value areas.

## What this is — and isn't

**It is** a structured specification of expected skill behavior. Each entry encodes a realistic prompt plus the assertions / citations / traps / confidence level that a correct answer must satisfy.

**It isn't** an automated test harness. The eval suite *can* be exercised by `scripts/run-evals.py`, but execution is manual: the runner emits prompts for human-driven runs through Claude Code (or any session that loads the skill), then validates pasted-back responses against the eval criteria.

The separation keeps the runner cheap (no API key required) and lets the operator pick which model / session / fork to evaluate against.

## Running the suite

```bash
# Print all prompts for manual run
./scripts/run-evals.py list

# Print one specific eval
./scripts/run-evals.py list --id 2

# Validate captured responses (file format: {"<id>": "<response_text>", ...})
./scripts/run-evals.py validate responses.json
```

The validate command emits a markdown report to stdout and saves it under `_data/schemas/eval-results-<UTC-date>.md`. Exit code: 0 if all responses pass, 1 if any fail validation, 2 on usage errors.

## Validation rules

Per eval, a response must:

- Contain each `assertions` substring (case-insensitive)
- Cite each `must_cite` graph ID, and mention each `must_cite_files` path or filename (case-insensitive)
- NOT contain any `must_not_say` substring (case-insensitive)
- Claim a confidence level matching `expected_confidence` (advisory — not mechanically checked)

Failure on any of those four → eval fails.

## Maintenance

When a reference doc is materially updated, the corresponding eval (if one exists) should be re-run to confirm behavior didn't drift. New high-confidence ref content without a matching eval is a coverage gap — see `IMPROVEMENTS.md` "Eval coverage as a freshness signal."

The auditor has an additional diff-readiness regression contract in
[`auditor-diff-readiness.json`](../references/_meta/evals/auditor-diff-readiness.json). Its inert
candidate/remediation pairs capture release-workflow and provenance-parser
failure modes from PR #214. `scripts/auditor-diff-readiness-evals.test.mjs`
guards the fixture contract in CI, while
`scripts/bridge/scenarios/auditor-diff-readiness.json` provides an optional
local live-agent discovery run.

`node scripts/kb.mjs validate` checks that every `must_cite` ID resolves, and `scripts/check-hygiene.py` that every `must_cite_files` path exists, to catch eval-references-deleted-file rot. If you delete or rename a referenced file, update the eval too.

## Schema

See `evals.json` § `schema_notes` for field-level documentation.

## Retrieval eval — `facts.json` and `scripts/kb-eval.mjs`

The behavioral specs above say what a correct answer contains. The retrieval eval measures whether an agent that
follows `SKILL.md` gets there: each question in `references/_meta/evals/facts.json` lists the gold facts a correct
answer states and the claim that holds each (`kb.mjs validate` checks those claims exist).

```bash
node scripts/kb-eval.mjs run --ref HEAD --out /tmp/kb-eval/head --reps 3   # headless Claude Code sessions
node scripts/kb-eval.mjs judge --out /tmp/kb-eval/head                      # does each answer state each fact
node scripts/kb-eval.mjs report /tmp/kb-eval/main /tmp/kb-eval/head         # per rep, side by side
```

`report` gives, per rep: facts stated, holders reached (the holder claim's ID entered the context), context tokens
per answer, shell calls a corporate runtime would stop to approve, and runs over the 8-call guardrail. Read it like
this:

- **Same harness only.** `run` records the Claude Code version, model, effort, tools and the prompt and question
  hashes in `<out>/meta.json`. It will not add runs to a directory recorded under different ones, and `report`
  will not compare such directories. A Claude Code upgrade changes how agents explore, so re-run the baseline
  ref under the new version before comparing.
- **Noise.** Rep-to-rep noise is several points: run 3 reps and read a gap under about 5 points as no change.
- **Cost.** Every run and judgement is a model call on your Claude quota; it never runs in CI. Results and the
  worktree of the ref go in `--out`, outside the checkout (`git worktree remove <out>/worktree` when done).
- **Coverage.** The 20 public questions are written close to the graph's own wording, so they saturate; questions
  phrased the way users ask, with facts the graph holds, are the most useful addition.

## Cross-links

- [`scripts/run-evals.py`](../scripts/run-evals.py) — the runner
- [`scripts/check-hygiene.py`](../scripts/check-hygiene.py) — validates `must_cite_files` paths
- [`scripts/auditor-diff-readiness-evals.test.mjs`](../scripts/auditor-diff-readiness-evals.test.mjs) — validates the auditor diff fixture contract
- [`../../../IMPROVEMENTS.md`](../IMPROVEMENTS.md) — eval-coverage and runner improvements
