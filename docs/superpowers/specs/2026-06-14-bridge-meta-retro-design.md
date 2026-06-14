# Bridge meta-retro: a role-runtime feedback loop

**Status:** design (pre-implementation, v3 after cross-model review) ·
**Date:** 2026-06-14 · **Origin:** DAV-11 workflow-improvement follow-up

**Review provenance:** v1 reviewed by Claude (Sonnet) and Codex (GPT), both
ground-truthing against real `_data/bridge-runs/` telemetry → "revise". v2
reviewed by Gemini → "reconsider" (it challenged the *architecture*, not the
fields). All factual claims were independently verified against the artifacts
before acceptance (see "Ground truth"). v3 folds in what survived that
evaluation, including push-backs where reviewers overstated or conflicted.

## Problem

The role workflows (investigator, auditor, SOC) are exercised by the bridge
harness against real models and scenarios; each run self-evaluates (disk truth +
`expect`, incl. PR4's `expectedToolSequence`). But there is **no mechanism to
learn from runs** — where a role struggled, which gates fought the agent, what
would have helped. Today that reflection is manual. We want it **answerable from
artifacts, not memory** — the roles' own evidence-gating turned on their runs.

**Constraint (operator):** keep the derived insight *without* carrying bulky /
private raw telemetry in the repo.

## Guiding decision (from review): prove actionability before building a pipeline

The leanest thing that changes behavior is to make the bridge run **emit
deterministic quality signals in its own output**, immediately. A decoupled,
manually-run, committed digest pipeline is premature at today's run volume (~4
runs) and would sit unread. So v3 inverts v1/v2: the **MVP is an inline digest
emitted by `run-investigation.mjs` itself**; aggregation, public promotion, and
LLM reflection are explicitly deferred until the inline signals prove useful.

## Ground truth about the telemetry (verified)

- `transcript.json`: scenario metadata, per-turn `agentResponses[]`, `toolCalls[]`
  (**bare MCP names only**), `disk` status (incl. `findingCounts.total`),
  `evaluation`, `overallPass`. **0 absolute paths** (verified). Older runs lack
  `toolCalls`.
- `turn-N.json` (raw export): per-step `created_at` (monotonic) + `num_tokens`;
  `chisel/tool_call_content`. **No tool *results*** — every entry is
  `status: "pending"`, no `isError`/`content` (verified). `rawInput` carries full
  payloads incl. journal prose + absolute `root`. Both MCP and **non-MCP calls**
  present (sampled run: 8 MCP, 3 non-MCP file reads — verified).
- `report.md`: embeds absolute paths (verified) — not a digest source.

**Consequences:** no per-call success/blocked signal exists; gate friction is
*inferred* (duplicate calls) and *disambiguated by disk truth* (e.g.
`record_finding` called 3× with `findingCounts.total == 3` ⇒ legit batch; `== 1`
⇒ 2 retries). Every digest field declares an `outcomeBasis`
(`export`|`disk`|`expect`|`inferred`|`unavailable`) so observed vs inferred is
never confused. The digest is computed from the **in-memory export object** at
end-of-run (no re-reading `report.md`; `rawInput` values are never copied).

## MVP — inline deterministic digest (build this, only this, first)

Extend `scripts/bridge/run-investigation.mjs` so that at end-of-run it:

1. Computes a digest via a **pure, unit-tested function** `extractRunDigest(...)`
   (in `scripts/bridge/digest-run.mjs`, importable standalone for re-processing).
2. Prints a short **"run quality"** section to stdout and into `report.md`.
3. Writes the per-run digest **JSON** to `_data/bridge-digests/<run>.json`
   (gitignored / private — no public commit yet).

**Digest fields (all `outcomeBasis`-tagged, self-contained — no telemetry
hydration dependency):**
- **Identity:** `digestSchemaVersion`, repo commit, scenario-file hash, role +
  template version-or-hash, model, timestamp, overall pass/fail.
- **Tool trace:** ordered MCP sequence; **non-MCP call count** (bypass signal);
  per-tool **duplicate-call count** (`inferred`); call fingerprints.
- **Retry disambiguation:** duplicate gate-call count vs disk artifact count
  (`record_finding` calls vs `findingCounts.total`) → `retriesInferred` (`disk`
  basis where countable, else `inferred`/`unavailable`). **Never a friction
  verdict** — a counted signal only.
- **Sequence:** `expectedToolSequence` pass/fail + where it broke (`expect` basis).
- **Timing:** per-turn / per-call latency from `created_at`; turn count; per-turn
  step + agent-response counts.
- **Outcomes:** `expect` results; disk status; source-resolution failures; export
  parse failures / missing exports.
- **Sanitized arg shape:** per call, the *shape* of `rawInput` (keys present,
  value lengths/types) — **never values.**
- **Evidence IDs:** durable provenance refs (`turn:<n> step:<n> call:<id>` +
  counts/hashes) carried inline as metadata — **not** a pointer the loop must
  resolve back to (possibly-deleted) telemetry.

Deterministic, no LLM. Tests mirror `run-investigation.test.mjs`'s `os.tmpdir()`
fixtures (assert fields + `outcomeBasis` + determinism), gated by the recursive
`check-fast` (PR4). This is the whole MVP.

## Roadmap — deferred until the inline signals prove useful

- **Aggregate + A/B** (`aggregate-digests.mjs`): roll digests by
  role/model/template-variant. **Deferred — needs volume**; ~4 runs cannot yield
  A/B significance (Gemini). Reject cross-`digestSchemaVersion` aggregation.
- **Public promotion + privacy lint:** `--public` copies a digest to
  `references/_meta/bridge-digests/` only if a lint passes (rejects abs paths,
  session IDs, raw prompts/findings/`rawInput`, tenant excerpts). Deferred with
  aggregation; until then digests stay private in `_data/`.
- **Grounded reflection (Layer 2):** answers "which steps were frictional / what
  would have helped" from the digest. LLM, constrained: every claim cites a
  digest evidence ID; **observations vs hypotheses labeled** ("what would have
  helped" is a hypothesis + proposed experiment, never a stated cause); agent
  self-narration treated as weak evidence; **output must map to specific
  `prompt.md`/schema lines** (else it is unactionable — Gemini's meta-fatigue
  risk); **never auto-edits prompts.** Runs on the richer *private* digest, so
  privacy stripping does not starve it of context. Deferred — build after the
  deterministic base exists and is proven.

## Risks / guardrails

- **Phantom signals:** never emit a gate outcome the export lacks; use
  `outcomeBasis: inferred|unavailable`.
- **Friction-fallacy:** duplicate counts are a signal, not a verdict; disambiguate
  with disk truth; leave judgment to (deferred) Layer 2.
- **Write-only trap:** the MVP emits inline (stdout + `report.md`), not a separate
  script nobody runs.
- **Bit-rot:** digest is self-contained; deleting raw telemetry never breaks it.
- **Privacy:** never copy `rawInput` values; build from the in-memory export, not
  `report.md`; public promotion is deferred and lint-gated.
- **YAGNI:** ship the inline digest only; defer aggregate / promotion / reflection.

## Resolved decisions

1. **Digest home →** private `_data/bridge-digests/` for the MVP; public
   promotion (linted) deferred to the roadmap.
2. **Deterministic/reflective split →** Layer 1 strictly structural/countable;
   all judgment deferred to Layer 2.
3. **Field set →** corrected: no phantom success/blocked; added non-MCP counts,
   disk-correlated retry signal, timing, explicit `expectedToolSequence`,
   provenance/identity, `outcomeBasis`, self-contained evidence IDs.
4. **Namespace →** `scripts/bridge/` (`digest-run.mjs`, later
   `aggregate-digests.mjs`); never `scripts/retro/`.
