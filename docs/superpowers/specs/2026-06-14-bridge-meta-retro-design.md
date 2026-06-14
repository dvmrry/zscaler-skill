# Bridge meta-retro: a role-runtime feedback loop

**Status:** design (pre-implementation, revised after cross-model review) ·
**Date:** 2026-06-14 · **Origin:** DAV-11 workflow-improvement follow-up

**Review provenance:** v1 of this spec was reviewed by Claude (Sonnet) and Codex
(GPT), both ground-truthing against real `_data/bridge-runs/` telemetry. Both
returned "revise" and converged on two corrections — the digest claimed
gate-outcome signals the Devin export does not contain, and the privacy boundary
missed `rawInput`. This v2 folds in their findings. (A Goose run on a local 7B
model was too weak to review and is excluded; a Devin review was dispatched but
did not return synchronously.)

## Problem

The role workflows (investigator, auditor, SOC) are exercised by the bridge
harness against real models and scenarios. Each run self-evaluates — disk-truth
verification plus the `expect` checks, including PR4's `expectedToolSequence`.
But there is **no mechanism to learn from runs**: where a role struggled, which
gates fought the agent, which steps were frictional, and what information would
have helped. Today that reflection happens by hand — the operator reads a
transcript and asks, investigator-style, *"which steps gave the most trouble and
why, and what would have helped?"*

We want that loop made durable and **answerable from artifacts instead of
memory** — the same evidence-gating the roles enforce, turned on the roles' own
runs — to drive concrete improvements to prompts, gates, and templates.

**Constraint (operator-stated):** keep the derived insight *without* carrying
bulky, possibly-private raw telemetry in the repo.

## Non-goals

- **Not** the domain incident-retro (`agents/retro/`), which postmortems a
  Zscaler incident from a case `journal.md`. This is **meta**: feedback about how
  the *roles/workflows* performed. (Naming guard: keep this under
  `scripts/bridge/`, never `scripts/retro/`, to avoid colliding with the tenant
  incident retro.)
- **Not** a new Zscaler role or MCP server.
- **No LLM-fabricated learnings**, and **no auto-editing of prompts** — Layer 2
  emits a report a human acts on; the prompt files stay the human-reviewed source
  of truth.

## Ground truth about the telemetry (verified by review)

Established against four real runs under `_data/bridge-runs/`:

- `transcript.json`: scenario metadata, per-turn `agentResponses[]`, `toolCalls[]`
  (**bare MCP tool names only** — non-MCP calls excluded), `disk` status,
  `evaluation` checks, `overallPass`. **No absolute paths.** Older runs predate
  `toolCalls` and lack it.
- `turn-N.json` (raw Devin export): per-step `created_at` (real, monotonic) and
  `num_tokens`; `chisel/tool_call_content` keyed by call id. **Tool *results* are
  never recorded** — every entry is `status: "pending"`, no `isError`, no
  `content`. `rawInput` carries full payloads (finding prose, `journal_content`,
  scope text, absolute `root`).
- `report.md`: embeds absolute local paths — **not public-safe**; not a digest source.

**Consequences baked into this design:** there is no per-call success/blocked
signal to read; gate friction is *inferred* (duplicate calls = retries) and
*confirmed* by disk truth. Every digest field therefore declares its
`outcomeBasis` (below). The extractor reads `turn-N.json` when present (richer:
timing, non-MCP calls), falls back to `transcript.json`, tolerates older lossy
transcripts, and **never copies `rawInput` values**.

## Architecture — three layers, digest-first

### Layer 1 — Deterministic run digest (build first)

- **Input:** one bridge run dir `_data/bridge-runs/<run>/`.
- **Output:** a compact per-run digest **JSON** (one file per run; never an
  appended ledger) + a short markdown "run card". Fields:
  - **Identity / provenance:** `digestSchemaVersion`, repo commit, scenario-file
    hash, role + template version-or-hash, model, source-artifact hashes,
    timestamp, overall pass/fail.
  - **Tool trace:** ordered MCP tool sequence; **non-MCP call counts** (file
    reads etc. — a bypass signal when a scenario says "MCP only"); per-tool
    **duplicate-call counts** (the retry proxy); call fingerprints.
  - **Sequence:** `expectedToolSequence` pass/fail explicitly (highest-value
    friction signal), and where it broke.
  - **Timing:** per-turn and per-call latency from `created_at`; turn count;
    per-turn step + agent-response counts.
  - **Outcomes:** which `expect` checks passed/failed; disk-truth status;
    source-resolution failures; export parse failures / missing exports.
  - **Sanitized arg shape:** for each tool call, the *shape* of `rawInput` (keys
    present, value lengths/types) — **never the values**.
  - **`outcomeBasis` per signal:** one of `export` | `disk` | `expect` |
    `inferred` | `unavailable`, so a consumer knows whether a signal is observed
    or inferred (this is how the absent gate-outcome is represented honestly).
- Deterministic, unit-tested, **no LLM**. A summary of *signals + evidence IDs*,
  never a telemetry copy.
- **Evidence IDs:** durable digest-internal refs (`turn:<n> step:<n> call:<id>` +
  counts/hashes), so citations survive after raw telemetry is discarded.
- **Script:** `scripts/bridge/digest-run.mjs` → `extractRunDigest(runDir)`.

### Layer 2 — Grounded reflection

- Answers the investigator-style questions per-run and across runs: *which steps
  were most frictional and why; what would have helped.*
- **LLM, constrained.** Input is the digest (and, only while telemetry still
  exists, the excerpts its evidence IDs point to). Hard rules:
  - Every claim cites a digest evidence ID. No claim without a cited signal.
  - **Label observations vs hypotheses.** "What would have helped" is
    counterfactual — it must be a *hypothesis* with a proposed experiment (e.g. an
    A/B variant), never stated as fact.
  - Treat agent self-narration (`agentResponses`) as weak evidence, distinct from
    objective signals; do not launder narration into a finding.
- **Output:** a report (markdown) — cited friction observations + improvement
  *hypotheses*. Never edits prompt/gate files.

### Layer 3 — Aggregate + A/B

- Roll digests up by role / model / template-variant: consistently-frictional
  steps, per-gate retry rates, model-tier differences, and A/B comparison of two
  template variants.
- **Reject cross-`digestSchemaVersion` aggregation** rather than silently
  comparing incompatible digests.
- **Script:** `scripts/bridge/aggregate-digests.mjs`.

## Data / telemetry boundary — two-tier (resolves open Q1)

- **Raw telemetry** (`transcript.json`, `turn-N.json`, `report.md`): stays under
  `_data/bridge-runs/` (gitignored). Ephemeral / fork-private.
- **Digests default to private:** `_data/bridge-digests/` (gitignored).
- **Public promotion is explicit and linted:** `--public` copies a digest to
  `references/_meta/bridge-digests/` only if it passes a **privacy lint** that
  rejects: any `_data` path, absolute roots, session IDs, raw prompts, raw
  findings/`rawInput` values, and excerpts sourced from tenant/private artifacts.
  "Public-safe" is *defined by the lint*, not assumed by construction.

## Build sequence (MVP → roadmap)

1. **Layer 1** digest extractor + privacy lint + tests — the MVP and the
   telemetry-shedding win.
2. **Layer 3** aggregate / A-B over digests — once ≥ a few digests exist.
3. **Layer 2** grounded reflection — after the deterministic base proves out.

**Trigger:** run manually (or batched after N runs of a role/scenario); a single
run is weak signal. Not wired into the bridge hot path.

## Testing

- Layer 1: unit tests with fixture telemetry (mirror `run-investigation.test.mjs`
  `os.tmpdir()` fixtures), asserting digest fields, `outcomeBasis` tagging, and a
  determinism check (same telemetry → identical digest). Privacy lint gets its own
  tests (rejects abs paths / `rawInput` / session IDs). Gated by the recursive
  `check-fast` (PR4) which runs `scripts/bridge/*.test.mjs`.

## Risks / guardrails

- **Phantom signals:** never emit a gate-outcome the export lacks; represent it as
  `outcomeBasis: inferred|unavailable`.
- **Privacy:** digest never copies `rawInput` values; public promotion only via
  the lint; build from `transcript.json`/`turn-N.json`, never `report.md`.
- **Layer-2 fabrication:** citation hard-gate + observation/hypothesis labeling +
  no prompt auto-edits.
- **Digest bloat:** signals + evidence IDs only, not a telemetry copy.
- **YAGNI:** ship Layer 1 + lint alone; defer 2/3.

## Resolved decisions (were open questions)

1. **Digest home →** two-tier: private `_data/bridge-digests/` default, explicit
   linted `--public` promotion to `references/_meta/bridge-digests/`.
2. **Deterministic/reflective split →** Layer 1 strictly structural/countable;
   all judgmental ("confusing", "frictional-why") claims live in Layer 2.
3. **Field set →** corrected above: removed phantom per-call success/blocked;
   added non-MCP counts, duplicate-call counts, timing, explicit
   `expectedToolSequence` result, provenance/identity, `outcomeBasis`, evidence IDs.
4. **Namespace →** `scripts/bridge/` (`digest-run.mjs`, `aggregate-digests.mjs`);
   never `scripts/retro/`.
