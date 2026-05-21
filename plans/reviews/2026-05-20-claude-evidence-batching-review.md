# Claude Review: Investigator Evidence Batching Plan

## Bottom Line

Approve Slice 0 and Slice 1 (Shape A's evidence-import half) as-is. Hold
Slice 2's helper-generated turn JSON behind one specific concern. Treat
Shape B / `record-evidence-batch` as not yet justified — the plan agrees but
the document still spends enough time on it that it reads as a near-term
deliverable. Tighten the language so the only thing actively in flight is
Slice 0 plus the evidence-import helper.

The framing as a soft refactor is correct. The diagnosis (clerical
per-evidence ceremony, not safety overhead, is the drag) matches what the
harness actually requires today: every post-Step-3 action does
`begin-turn` → journal edit → hand-authored turn JSON → `complete-turn`,
and that JSON must thread `turnToken`, `sequence`, `previousHash`,
`journalHashBefore`, and `touchedClaims` correctly. That is exactly the
clerical surface a helper can absorb without weakening the invariants.

## Blockers

1. **Naming collision with the existing `add-evidence` action type.** The
   helper already validates `add-evidence` as a turn `actionType`
   (`scripts/investigator-artifacts.mjs:37`, `:46`). Slice 1 proposes a
   helper *command* also called `add-evidence`. Two `add-evidence`s — one
   a workflow action recorded in the ledger, one a CLI subcommand that
   imports a file and may generate the turn JSON for that same action —
   will confuse both readers and prompts. Pick distinct names before
   Slice 1 lands. Suggested: keep `actionType: "add-evidence"` for the
   ledger, name the helper subcommand `import-evidence` (or
   `stage-evidence`). The Open Decision "`add-evidence`,
   `add-evidence-batch`, `record-evidence-batch`?" should be resolved
   with this collision in mind, not deferred.

2. **The "helper appends `## Evidence Timeline`" option is under-specified
   and should be off in Slice 1.** The plan lists `## Evidence Timeline`
   appends as both allowed helper behavior (Helper Direction) and an
   Open Decision (defer to batching?). Allowing the helper to mutate
   `journal.md` — even append-only — adds a second writer to the file
   the ledger hashes (`journalHashBefore`/`journalHashAfter` in
   `completeTurn`). If the helper writes the timeline entry inside the
   same transaction that generates the turn JSON, fine; if it writes
   *before* the agent has finalized the rest of the journal mutation,
   the agent's edit invalidates the hash the helper just captured. Either
   require the helper to be the *only* writer for the duration of a
   transaction (and document the ordering), or defer all `journal.md`
   mutation to the agent until Shape B. Default to the latter.

3. **Slice 2's helper-generated turn JSON needs an explicit
   journal-hash-after-write rule.** The current contract requires
   `journalHashAfter` in the turn JSON to equal the on-disk hash at
   `complete-turn` time. If the helper generates turn JSON *before* the
   agent has finished journaling, the hash mismatches; if *after*, the
   helper is the last step and the agent has lost its chance to amend.
   The plan implies "agent journals, then runs helper to generate turn
   JSON, then `complete-turn`," which is the right ordering, but it
   should be stated as a hard rule in Slice 2, and the helper should
   re-hash the journal at generation time rather than accept a stored
   `journalHashBefore`+claimed-after value.

## Recommendations

- **Land Slice 0 alone first and re-measure.** Slice 0 is the cheapest
  intervention, has zero state-machine risk, and the plan already says
  it might remove most repeated-context friction. Run a second
  investigation against the new journal sections, retro it, and only
  *then* decide what shape the import helper takes. The plan says this;
  the Implementation Slices list could state it more explicitly as
  "Slice 0 is a release point, not just a prelude."

- **Constrain Shape A to evidence import only.** Slice 1 (file copy +
  hash + manifest append + JSON ref emission) is the part with the
  clearest payoff and the smallest blast radius. Slice 2 (turn JSON
  generation) compounds risk because it touches the integrity surface
  the ledger relies on. Treat them as separate releases with a real
  pause between them.

- **Spell out the manifest row schema before coding.** The plan
  references `evidence/MANIFEST.md` repeatedly but the existing
  references that mention it (`agents/investigator/prompt.md:196`,
  `:216`) point at `docs/data-contract/cases.md` for the convention. The
  helper will codify whatever it writes; that schema should be reviewed
  before Slice 1, not discovered during it. Otherwise the helper's row
  shape becomes the canonical shape by accident.

- **Drop `record-evidence-batch` from the active plan.** The document
  already says "decide whether `record-evidence-batch` is still needed"
  in Slice 3. Match that by moving the entire Shape B / Batch
  Input / Partial Batch Recovery section under a clearly labelled
  "Deferred — re-open after Slice 0 + Slice 1 retros" heading. Right
  now those sections read as planned work, and they're the largest
  chunk of the document. The plan is more honest if Shape B is one
  paragraph saying "if Slice 0 + Slice 1 do not bring turn count under
  X, re-open these sections."

- **Add an integration test that exercises the helper-generated turn
  JSON through `complete-turn` end-to-end** before Slice 2 is allowed
  to update the canonical harness. Unit tests on the generator alone
  will not catch the hash-ordering issue in Blocker 3.

- **Treat "verbose helper output" as default-off, not opt-in.** The
  plan says this in multiple places; make it a single explicit rule
  near the performance budget: helper stdout is one JSON line on
  success, full diagnostics only on `--verbose` or on failure. Otherwise
  agents will paste helper output into chat by reflex and the chat
  noise that the plan is trying to reduce returns through a different
  door.

## Answers To Focus Questions

1. **Soft refactor scoping** — yes, correctly scoped. The plan
   preserves the resolution gate, pending-turn detection, hash chain,
   case-local evidence, and the one-action-per-turn contract. The
   refactor is mechanical, not semantic. Watch that Shape B does not
   quietly drift back into "new workflow" territory — see
   Recommendations.

2. **Artifact visibility tiers** — the three tiers (user, review,
   machine) are the right cut. The user-visible list is close to right.
   Two adjustments: (a) `pendingTurn` *existence* should be user-visible
   when it blocks the next turn, even though `pendingTurn` details
   stay machine-only — the user needs to know they're wedged. (b)
   Evidence *paths* should be user-visible at least once when imported,
   so the user can verify the file landed where they expected; the
   one-liner summary form ("Recorded 3 evidence files") is right for
   subsequent references but not for first record.

3. **Performance budget** — the 250 ms target is plausible for
   bookkeeping commands on a small case but unproven. Two concerns: (a)
   the budget should be measured per `node` invocation, including
   process spawn; small Node scripts on macOS regularly burn 80-150 ms
   before user code runs, which leaves very little headroom. (b) The
   budget should explicitly cover the *worst* operation on a
   realistically-aged case (50+ turns, large `02-turns.jsonl`), not
   just a fresh one. What should block a helper change from landing:
   the blocking eval list at the end is mostly correct; add "ledger
   replay (read all of `02-turns.jsonl`) under 100 ms for a 100-event
   ledger" as a regression guard, because every `begin-turn`/
   `complete-turn` parses the full ledger today.

4. **Load-bearing integrity checks** — load-bearing: SHA-256 of
   `journal.md` for `journalHashBefore`/`journalHashAfter`,
   `previousHash` chain in `02-turns.jsonl`, `turnToken` matching
   between state and turn JSON, source-file hashes for evidence (these
   are the artifact that may be exported / cited externally).
   Cheaper-detection-eligible: the *intra-turn* journal-changed check
   inside one `begin-turn`/`complete-turn` pair could be `mtime + size`
   if and only if the cross-turn chain still uses SHA-256. Do not
   weaken evidence-file hashing. Do not weaken the chain.

5. **Slice 0 first** — yes. It is the only slice that ships value
   without touching the helper's integrity surface. It is also the
   only slice that tests the actual hypothesis (repeated stable
   context is the dominant noise source) before any code is written.
   If Slice 0 does not visibly shorten the journal in a fresh case,
   the helper plan needs rethinking, not extending.

6. **Shape A sufficient before considering Shape B** — yes, with the
   Slice 1 / Slice 2 split above. Shape A captures the per-item
   clerical work (file copy, naming, manifest, JSON refs, optionally
   turn JSON). What Shape A does *not* solve is the
   one-action-per-turn cost itself — N evidence items still means N
   completed turns. The right way to answer "is Shape B needed?" is
   to count remaining turns after Shape A in a real case, not to
   pre-build it.

7. **Failure mode that would make batching unsafe** — partial-batch
   ambiguity. If a batch transaction copies 3 of 5 files, writes 2
   manifest rows, and is interrupted, the case is now in a state
   where: (a) the manifest references files that exist, (b) two
   evidence files exist with no manifest row, (c) the ledger has no
   event, (d) `journal.md` may or may not have an evidence-timeline
   entry. The plan's pending-batch file and per-step boundaries are
   the right shape, but the canonical answer to "did this batch
   land?" must be the ledger event, not the manifest. If the ledger
   event isn't written, the batch did not happen, and resume must
   either roll forward to the ledger event or roll back the file
   copies — never half-commit. The plan's "resume detects pending
   batch and reports a repair path" is acceptable; "silently
   continue" is not, and the plan correctly forbids it.

   A second unsafe mode: a batch that bundles evidence for *different*
   active hypotheses. The plan restricts a batch to the same active
   hypothesis or a clearly named claim set; that constraint is
   load-bearing. Weakening it (e.g., "any related evidence") turns
   the batch into a free-form journal mutation and erodes the
   per-claim audit trail.

8. **Minimal eval to block merging helper changes** — three:
   - Helper records evidence without `sourceFileHash`, `capturedAt`,
     `source`, `query`/`evidenceRequest` text, `summary`, or
     `touchedClaims` → must fail.
   - Helper-generated turn JSON that mixes `mark-resolved` with
     evidence recording → must fail.
   - Helper leaves a pending transaction file that a subsequent
     `begin-turn` / `verify-case` does not detect and surface →
     must fail.

   These three cover metadata completeness, the resolution-gate
   separation invariant, and the resume-corruption invariant —
   each of which is a property the current prose-only flow already
   enforces and must not regress.

## Minor Notes

- The Executive Summary uses both "soft refactor" and "soft-refactor"
  and "soft mechanical refactor" (the latter from the review prompt).
  Pick one phrase.
- "Shape A" / "Shape B" naming is fine in this document, but if the
  language survives into `harness.md` it should be replaced with
  concrete command names. Reviewers a year from now will not remember
  the Shape A/B mapping.
- The Estimated Impact section honestly flags that "removed 8-12
  turns" is self-measured from the same run that diagnosed the
  problem. Keep that disclaimer in any future version; do not drop
  it once a second case is measured, because the second case will
  be measured under the new shape and is therefore also not an
  independent confirmation. Wait for a third case.
- The Test Matrix row "Weak model baseline: batching instructions
  are not accidentally followed without support" is important and
  under-specified. Concretely: a weak agent that sees the helper
  command in `harness.md` but cannot run Node should fall back to
  the current manual protocol, not invent a JSON file. State that
  explicitly in Slice 4.
- `references/shared/splunk-queries.md` is enforced today by
  `validateQueryRequest`. Any helper-generated turn JSON for
  `query-request` must round-trip that validation. Worth an
  explicit test.
- The plan's Open Decision "record helper command/version in each
  ledger event" is the right answer. Do it from Slice 1 onward
  rather than retrofitting later — the ledger schema is already
  stable enough that adding a `helper` field with `{command,
  version}` is cheap, and it makes future provenance questions
  ("which helper version recorded this?") answerable from disk.
