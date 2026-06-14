# Bridge meta-retro: a role-runtime feedback loop

**Status:** design (pre-implementation) · **Date:** 2026-06-14 · **Origin:** DAV-11 workflow-improvement follow-up

## Problem

The role workflows (investigator, auditor, SOC) are exercised by the bridge
harness against real models and scenarios. Each run self-evaluates — disk-truth
verification plus the `expect` checks, including PR4's `expectedToolSequence`.
But there is **no mechanism to learn from runs**: where a role struggled, which
gates got bypassed or fought the agent, which steps were frictional, and what
information would have helped. Today that reflection happens by hand — the
operator reads a transcript and asks, investigator-style, *"which steps gave the
most trouble and why, and what piece of information would have helped?"*

We want that loop made durable and **answerable from artifacts instead of
memory** — the same evidence-gating the roles enforce, turned on the roles' own
runs — so it can drive concrete improvements to prompts, gates, and templates.

**Constraint (operator-stated):** keep the derived insight *without* carrying
bulky, possibly-private raw telemetry in the repo.

## Non-goals

- **Not** the domain incident-retro (`agents/retro/`). That postmortems a
  Zscaler incident from a case `journal.md` — feedback about the *tenant*. This
  is **meta**: feedback about how the *roles/workflows* performed.
- **Not** a new Zscaler role or MCP server. It is dev tooling over bridge
  artifacts; it lives under `scripts/bridge/`.
- **No LLM-fabricated learnings.** The reflective layer must cite digest
  evidence; a feedback loop for a fabrication-resistant skill must not itself
  fabricate.

## Architecture — three layers, digest-first

### Layer 1 — Deterministic run digest (build first)

- **Input:** one bridge run dir `_data/bridge-runs/<run>/` (`transcript.json`,
  `turn-N.json`, `report.md`).
- **Output:** a compact **digest** (JSON + a short markdown "run card") of the
  objective signals only:
  - **Metadata:** role, scenario id, model, template-variant (if tagged),
    timestamp, overall pass/fail.
  - **Tool trace:** the ordered MCP tool sequence (PR4's `extractToolCalls`) +
    per-gate outcome (succeeded / blocked / isError).
  - **Bad / blocked tool calls:** unknown-tool (`-32602`), force-over-MCP
    attempts, `isError` results, calls out of expected order, and
    repeated-identical calls (retry loops).
  - **Evaluation:** which `expect` checks passed/failed.
  - **Friction markers:** per-turn retry counts, blocked-gate→retry loops,
    entrypoint re-reads, turn count (timing if the export carries it).
  - **Fabrication signals:** `forbidTranscriptStrings` hits, findings with
    unresolvable sources.
- Deterministic, unit-tested, **no LLM**. The digest is a *summary of signals +
  citations*, never a copy of the telemetry — that is what makes it small enough
  to keep after the telemetry is discarded.
- **Script:** `scripts/bridge/digest-run.mjs` exporting `extractRunDigest(runDir)`.

### Layer 2 — Grounded reflection

- Answers the investigator-style questions, per-run ("island") and across runs:
  *which steps were most frictional and why; what information would have helped.*
- **LLM, but constrained:** input is the digest plus only the transcript
  excerpts the digest's citations point to. Every claim must cite a specific
  digest signal or transcript line — **no claim without a cited signal**, the
  same answer-from-artifact gate the roles use.
- **Output:** a reflection artifact (markdown) — cited friction findings +
  improvement hypotheses (candidate prompt / gate / template edits).

### Layer 3 — Aggregate + A/B

- Roll digests up across runs, grouped by role / model / template-variant.
- **Surfaces:** consistently-frictional steps, per-gate bypass rates, model-tier
  differences (the adversary-fleet practice), and A/B comparison of two template
  variants (run variant A vs B, diff the digests).
- **Output:** an aggregate scorecard + an A/B comparison report.

## Data / telemetry boundary  *(key decision — flagged for review)*

- **Raw telemetry** (`transcript.json`, `turn-N.json`): stays under
  `_data/bridge-runs/` (already gitignored). Ephemeral / fork-private.
- **Digests:** **public-safe by construction** — run metadata + structural
  gate/tool signals + repo-relative citations (paths, line refs), and at most
  short quoted excerpts the citations point to. **No tenant-snapshot content, no
  raw findings prose payloads.** Recommended home: committed under
  `references/_meta/bridge-digests/` as institutional memory, so trends and A/B
  live in version control.
- **Sanitization:** the extractor records *signals + citations, not payloads*.
  For forks running the bridge against tenant data, digests stay structural
  (mirrors the `_data` data-contract sanitization posture).
- **Recommendation:** commit public-safe digests; gitignore telemetry. That is
  exactly "keep the insight without the telemetry weight." (Alternative to weigh
  in review: keep digests in `_data/` gitignored — fork-private, not shared.)

## Build sequence (MVP → roadmap)

1. **Layer 1** digest extractor + tests — the MVP and the telemetry-shedding win
   on its own.
2. **Layer 3** aggregate / A-B over digests — needs ≥ a few digests to be useful.
3. **Layer 2** grounded reflection — after the deterministic evidence base proves
   out, so reflection has something solid to cite.

## Testing

- Layer 1: unit tests with fixture telemetry (mirror
  `run-investigation.test.mjs`'s `os.tmpdir()` fixtures) asserting digest fields;
  a determinism test (same telemetry → identical digest). Gated by the
  now-recursive `check-fast` (PR4) which runs `scripts/bridge/*.test.mjs`.

## Risks / guardrails

- **Reflection fabrication (Layer 2):** hard-gate on citations; reject claims
  without a cited signal.
- **Digest bloat:** the digest must be a *summary*, not a telemetry copy — else
  it defeats the keep-without-telemetry purpose.
- **Privacy:** digest sanitization for tenant-running forks.
- **YAGNI:** ship Layer 1 alone; do not build 2/3 until 1 proves useful.

## Open questions for review

1. Digest home: committed `references/_meta/bridge-digests/` (public-safe) vs
   `_data/` (gitignored, fork-private)?
2. Is the deterministic/reflective split correct, or should some "friction"
   detection that looks judgmental (e.g. "this step was confusing") be pushed
   into Layer 2 rather than faked deterministically?
3. Layer-1 digest field set — is anything missing that the reflective questions
   ("what would have helped") will need, or anything included that bloats it?
4. Does this belong under `scripts/bridge/` (extends the harness) or as its own
   `scripts/retro/` namespace?
