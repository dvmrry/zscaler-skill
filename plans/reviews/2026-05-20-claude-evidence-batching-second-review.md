# Claude Second-Pass Review: Investigator Evidence Batching Plan

## Bottom Line

The revision resolves all three blockers from the first pass and adopts the
narrowing the reviewers asked for. Slice 0 and Shape A (import) are safe to
proceed; Shape A2 (turn JSON generation) is correctly scoped behind one
explicit hash-ordering rule. Shape B is now clearly deferred as an annex.

No new blockers. A small number of clarifications below would close the
remaining ambiguity before Slice 1 coding begins.

## Blockers Resolved

- `import-evidence` adopted in Review Convergence, Shape A, Slice 1, and
  blocking evals. Collision with `actionType: "add-evidence"` is gone.
- Helper is explicitly forbidden from mutating `journal.md` in Slice 1.
  Timeline-append behavior is deferred and gated on "explicit hash ordering
  and tests."
- Slice 2 turn-JSON generation now has a hard rule: agent journals first,
  helper re-hashes `journal.md` at generation time, helper must not accept a
  caller-supplied `journalHashAfter`. This is the right ordering and the
  right place to enforce it.

## Net-New Wins From This Revision

- Capability discovery is required (subcommand or stable `--help` section)
  and is in the blocking evals.
- Helper output schema is specified with `status: ok | partial` envelopes,
  and agents are required to check exit status and `status` before
  summarizing success. This is the right shape and removes the
  "agents paste helper internals" failure mode.
- Performance budget now has three real targets: 250 ms normal,
  100 ms ledger replay on a 100-event ledger, no unexamined regression
  above 500 ms on a 50+ turn case.
- User-visible tier now includes evidence destination paths on import and
  `pendingTurn` existence when it blocks progress — both correct.
- Blocking eval list now covers capability discovery, output envelope,
  non-UTC `capturedAt`, silent destination overwrite, and
  generated-turn-JSON rejection by `complete-turn`. Good coverage.

## Remaining Clarifications (Not Blockers)

1. **State the manifest row schema and destination naming before Slice 1
   merges.** The plan says "define before coding" and lists both as Open
   Decisions. Land those two decisions in this document (or a linked
   ADR / data-contract section) before the first `import-evidence` PR
   opens — not during it. They become canonical by accident otherwise.

2. **Clarify whether `import-evidence` is allowed inside an open
   `pendingTurn` or only outside one.** The Shape A2 flow shows
   `begin-turn` → journal edit → `import-evidence` → generate turn JSON →
   `complete-turn`, which implies the helper *reads* turn state but does
   not require a pending turn. State this explicitly: `import-evidence`
   verifies the case and reads turn state but does not require or mutate
   `pendingTurn`. Otherwise a future change might quietly couple them.

3. **Move the "interrupted batch after each step boundary" scenario test
   under a Shape B heading.** Scenario tests in the Test Matrix mix
   Slice 1 cases (duplicate name, unsafe path, missing `capturedAt`) with
   Shape B cases (interrupted batch boundaries). With Shape B deferred,
   the batch scenario tests should sit under Shape B too, so a reader of
   the active scope is not led to think they block Slice 1.

4. **Tighten "no unexamined helper regression above 500 ms."** "Unexamined"
   is the right idea but soft. Either spell it as a CI gate ("regression
   above 500 ms on the 50-turn fixture fails CI without an explanatory
   note in the PR") or move it under the same wording the 250 ms / 100 ms
   bullets use ("under 500 ms ... where practical"). As written it is
   advisory but framed as a target.

5. **Capability-discovery output shape is still an Open Decision.** Lock
   it before Slice 1 coding for the same reason as the manifest row:
   downstream adapters will read whatever the helper emits and the first
   shape becomes load-bearing. The output envelope already specifies
   `status`, `operation`, `warnings` — `capabilities` can mirror that
   ({`status`, `operation: "capabilities"`, `supported: [...]`,
   `version`}).

6. **Slice 1 should also assert that `import-evidence` is purely
   additive: it must not modify `02-turns.jsonl`, `02-turn-state.json`,
   or `journal.md`.** This is implied by "the helper should not mutate
   `journal.md` at all" and by the ledger event being written by
   `complete-turn`. Stating it as a positive invariant ("Slice 1
   `import-evidence` writes only `evidence/` and `evidence/MANIFEST.md`")
   makes the invariant testable.

## Answers To Focus Questions

- **import-evidence naming**: resolved. No further concern.
- **Helper output schema**: spec is in the plan; lock the
  `capabilities` envelope before Slice 1 codes. Otherwise sufficient.
- **Manifest row / naming contracts**: correctly flagged as
  "define before coding"; needs to actually be defined in the plan
  before the PR opens.
- **Capability discovery**: required and in blocking evals; final shape
  still open. Lock it before code.
- **Journal-hash ordering for generated turn JSON**: resolved by the
  hard rule in Shape A2 / Slice 2. Add an integration test that runs
  the full `begin-turn` → journal edit → `import-evidence` →
  generate-turn-json → `complete-turn` chain and asserts the on-disk
  `journalHashAfter` matches.
- **Shape B deferral**: clear. The annex labelling and the
  "re-open only if" gate are explicit. Recommend the small scenario-test
  reshuffle above so the active scope reads cleanly.
- **Artifact visibility**: tiers are correct and the additions
  (destination paths, `pendingTurn` blocking state) close the gaps I
  raised. One subtlety worth a sentence: helper `warnings[]` should
  surface to the user as plain prose, not raw JSON, even though the
  envelope itself is machine-only.
- **Performance budget**: realistic. Lock the 500 ms wording
  (see clarification 4) and the targets become enforceable.

## Minor Notes

- The Estimated Impact section still references "Shape B" as the
  measurement target ("8-12 user-visible turns"). With Shape B
  deferred, that estimate is now hypothetical for an unscheduled slice.
  Either re-state it as "if Shape B were ever built" or replace it
  with an Slice-0 + Shape A target so the only live numbers in the
  plan describe live work.
- The Test Matrix row "Weak model baseline: batching instructions are
  not accidentally followed without support" should now read more
  narrowly — "helper-bracketed instructions are not accidentally
  followed without capability discovery" — since batching is no
  longer active.
- "Helper command/version in each ledger event" is the right call and
  should move from Open Decisions to Slice 1 scope.
- The Reviewer Questions Still Open are now precise enough to send to
  the next reviewer without ambiguity. Good revision.
