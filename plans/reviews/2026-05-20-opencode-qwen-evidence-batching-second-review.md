# OpenCode/Qwen Second Review: Investigator Evidence Batching Plan (Revised)

## Bottom Line

The revision resolves most prior blockers. Shape B is correctly deferred to an
annex. The helper output schema and `import-evidence` naming are now specified.
Capability discovery is included. Slice 0 remains safe to land first.

Three residual concerns remain, none of which block Slice 0 but two of which
should be locked before Slice 1 coding begins.

## Prior Blocker Resolution

| Prior Blocker | Status | Notes |
|---|---|---|
| No helper output schema | **Resolved** | Lines 307-331 define success, partial, and failure envelopes with `status`, `operation`, `evidenceRefs`, `manifestPath`, `manifestRows`, `turnJsonPath`, `warnings`, `completed`, `failed`, `repair`. |
| Evidence destination naming unspecified | **Resolved** | Lines 366-369 specify derivation from `--name`, `--source`, and original extension with slug normalization and collision rejection. |
| Manifest row schema undefined | **Resolved** | Lines 373-375 define minimum fields: evidence ref, source, captured timestamp, source file hash, query/request ref, summary, touched claims. |
| Shape B too prominent | **Resolved** | Lines 403-406 explicitly mark it as a deferred annex; re-open only after Slice 0 + A/A2 measurement. |
| No capability discovery | **Resolved** | Lines 302-305 specify either a `capabilities` subcommand or stable parseable `--help` section. |
| Journal-hash ordering for Shape A2 | **Resolved** | Lines 394-396 state the hard rule: agent journals first, helper re-hashes at generation time, no caller-supplied `journalHashAfter`. |
| Three workflow modes | **Resolved** | Lines 69-74 reject Strict/Assisted/Strong-Runtime modes; single workflow with helper-availability gating. |
| `add-evidence` vs `import-evidence` naming | **Resolved** | Lines 66-67 confirm `import-evidence` to avoid collision with ledger `actionType: "add-evidence"`. |

## Residual Concerns

### 1. Manifest row schema needs a concrete field list (pre-Slice 1)

Lines 373-375 define the minimum fields in prose but do not lock the exact
manifest row format. The current script (`investigator-artifacts.mjs`) does not
yet write MANIFEST.md, so there is no canonical example to match. Before Slice
1, specify:

- Exact column order and delimiter for MANIFEST.md rows.
- Whether `capturedAt` in the manifest row matches the evidence filename
  timestamp component or is a separate column.
- How `touchedClaims` is represented in a single table row (truncated,
  claim tag, or full text).

This is not a Slice 0 blocker. It is a Slice 1 prerequisite.

### 2. `import-evidence` CLI flag casing inconsistency (minor)

The plan uses kebab-case for CLI flags (`--case-slug`, `--source-file`,
`--touched-claim`) but the batch input JSON (lines 449-472) uses camelCase
(`activeHypothesis`, `sourceFile`, `touchedClaims`). The prior review noted
this; the revision does not address it. Not a blocker, but pick a convention
and note the mapping (e.g., CLI kebab-case maps to JSON camelCase) to prevent
adapter divergence.

### 3. Performance budget measurement scope

Lines 195-217 set targets (250 ms normal turn, 100 ms ledger replay for 100
events, 500 ms ceiling on 50+ turn cases). The plan correctly identifies
process spawn + JSONL parse as the likely bottleneck, not hashing. However,
the budget does not explicitly include the `import-evidence` helper's own
overhead in the per-turn measurement. When Shape A lands, the combined
`begin-turn` + `import-evidence` + `complete-turn` path should be measured as
a unit, not just individual commands. Add this to the Slice 1 test matrix.

## Focus Area Assessment

### Slice 0 safety
Safe. No helper code, no state-machine change, no runtime adapter branching.
Purely a journal discipline change. The proposed sections (Claims table,
Evidence Timeline, Dismissed Hypotheses, Resolution) are well-scoped.

### Shape A/A2 safety
Safe to implement once the manifest row format is locked (concern 1 above).
The helper output schema is concrete enough for adapter parsing. The
`import-evidence` naming avoids the collision with `add-evidence`. The
journal-hash ordering rule for Shape A2 is explicit and correct.

### Capability discovery
Adequately specified. Either `capabilities` subcommand or grepable `--help`
gives weak runtimes a reliable fallback path.

### Artifact visibility
Three-tier model (user-visible, review-visible, machine-visible) is correct.
The plan correctly keeps `pendingTurn` user-visible when it blocks progress
(line 155). Helper stdout defaults to quiet with `--verbose` opt-in.

### Shape B deferral
Correctly handled. The annex is clearly marked, re-open conditions are stated,
and the batch input/recovery specs are preserved for future reference without
polluting the active implementation scope.

### Performance budget
Targets are reasonable. The 500 ms ceiling on 50+ turn cases is the right
blocking threshold. The plan correctly warns against replacing primitives
before measuring. Add the combined-path measurement note (concern 3 above).

## Verdict

**Approve Slice 0 to land.** Slice 1 may proceed once the manifest row format
is locked as a concrete schema. No other blockers identified. The revision
successfully narrowed scope and resolved all prior blockers.
