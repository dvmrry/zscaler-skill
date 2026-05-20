# OpenCode-Qwen Review: Investigator Evidence Batching Plan

## Bottom Line

Approve Slice 0. Hold Slice 1 behind three unresolved specifics: helper output
schema, evidence naming convention, and manifest row format. The plan's
direction is sound but underspecifies the surfaces where runtime adapters will
diverge. Shape B should be moved to a deferred annex as Claude recommends.

## Blockers

1. **No helper output schema.** The plan says "compact machine-readable result"
   but does not define fields. Without a concrete contract (at minimum:
   `status`, `evidenceRefs[]`, `manifestPath`, optional `turnJsonPath`), each
   runtime adapter will parse stdout differently. This is a silent divergence
   vector. Define the JSON envelope before Slice 1.

2. **Evidence destination naming is unspecified.** The `--name` flag is passed
   but the helper's mapping to a filename in `evidence/` is not defined.
   Without a deterministic convention (e.g., `<case-slug>-<source>-<name>.ext`
   with collision rejection), duplicate names and cross-case collisions are
   inevitable. Specify before coding.

3. **Manifest row schema is undefined.** Multiple reviewers noted this; it bears
   repeating as a blocker. The helper codifies whatever it writes; that shape
   must be reviewed and locked before Slice 1, not discovered during it.

## Recommendations

- **Add a capability probe.** The plan says "use helper when available" but
  does not specify discovery. A `--capabilities` flag or stable `--help` output
  that agents can grep is needed. Without it, weak runtimes cannot reliably
  fall back to the manual protocol.

- **Define the journal-hash ordering rule for Slice 2 explicitly.** The helper
  must re-hash `journal.md` at turn-JSON generation time, not accept a
  pre-captured `journalHashAfter`. The agent journals first, then runs the
  helper, then runs `complete-turn`. State this as a hard rule.

- **Move Shape B to a deferred annex.** The document spends ~100 lines on
  batching semantics that may never be needed. Move Batch Input Shape, Partial
  Batch Recovery, and the `record-evidence-batch` action spec under a
  "Deferred — re-open after Slice 0 + Slice 1 retros" heading.

- **Add a ledger-read performance guard.** Every `begin-turn`/`complete-turn`
  parses the full `02-turns.jsonl`. As cases age past 50+ turns, this becomes
  the dominant cost. Add "ledger replay under 100 ms for 100 events" to the
  blocking evals.

- **Treat helper stdout as default-silent.** One JSON line on success, full
  diagnostics only on `--verbose` or failure. Otherwise agents will paste
  helper output into chat and the noise returns.

## Answers To Focus Questions

1. **Soft refactor scope** — correctly scoped. Watch that helper-generated turn
   JSON does not quietly become the agent's reasoning surface.

2. **Artifact visibility** — three tiers are right. Add: `pendingTurn` existence
   should be user-visible when it blocks progress, even if details stay
   machine-only.

3. **Performance budget** — 250 ms is unproven on aged cases. The real cost is
   process spawn + JSONL parse, not hashing. Block if helper exceeds 500 ms on
   a 50+ turn case without documented explanation.

4. **Load-bearing integrity** — hash-chain between state and ledger, evidence
   file SHA-256, `turnToken` match, and resolution-gate separation. Cheaper
   detection is acceptable only for intra-turn journal-change checks.

5. **Slice 0 first** — yes. Zero state-machine risk, directly targets the
   dominant noise source.

6. **Shape A before Shape B** — yes, with the output schema and naming
   convention resolved first.

7. **Unsafe batching failure mode** — partial batch with undetected manifest/
   ledger divergence. The ledger event must be the canonical answer to "did
   this batch land?"

8. **Minimal eval** — add "helper-generated turn JSON rejected by
   `complete-turn` due to schema mismatch" to the existing three.

## Minor Notes

- `--active-hypothesis` (CLI) vs `activeHypothesis` (JSON) — pick one casing
  convention and apply it consistently.
- `allowedNext` in the batch input JSON is turn-event policy, not batch input.
  Separate these concerns.
- `capturedAt` must be validated as ISO 8601 UTC, not accepted as any string.
- The plan should state that Slice 0 is a release point, not just a prelude.
- Record helper `{command, version}` in each ledger event from Slice 1 onward.
