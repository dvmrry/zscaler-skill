# DeepSeek Review: Investigator Evidence Batching Plan

## Bottom Line

The plan is correctly scoped, the slicing order is sound, and the safety
invariants are preserved. Slice 0 and Shape A should proceed without
reservation. Shape B (`record-evidence-batch`) is gated behind measurement,
which is the right call. Two blockers below should be resolved before any
helper code lands; the rest are recommendations.

## Blockers

1. **No helper capability discovery mechanism.** The plan says "The helper is
   either available for a step or it is not" but does not specify how the agent
   discovers this. Weak runtimes following the current manual protocol won't
   know whether `add-evidence` exists unless there's an explicit check. Add a
   `capabilities` subcommand or a `--help` output that agents can grep for
   supported commands. Without this, the "use helper when available, otherwise
   follow current manual protocol" policy is untestable.

2. **Evidence file collision handling is unspecified.** The plan says the
   helper copies/renames files into `evidence/` but does not define behavior
   when an evidence file with the same name already exists. The current
   `open-case` has a no-clobber policy; the evidence import helper needs one
   too. At minimum: reject duplicate names unless `--force` is passed, and
   record the collision as a blocking issue in the turn event.

## Recommendations

1. **Allow helper-owned `## Evidence Timeline` append in Shape A, not just
   batching.** The plan defers this to "if helper-owned journal patching ever
   lands" but an append-only timeline section is deterministic, auditable, and
   directly reduces journal friction. The agent still owns the claims table and
   resolution. Scoping this to Slice 1 (not just batching) would give more
   measurement signal on whether journal shape changes alone help.

2. **Add a concrete benchmark harness.** The plan correctly identifies that
   process spawn, repeated file reads, and JSONL parsing may dominate hashing
   cost, but does not describe how to measure it. Add a `--benchmark` mode or a
   simple wrapper script that times `begin-turn`, `complete-turn`,
   `add-evidence`, and combined flows. The 250ms target is aspirational without
   measurement machinery.

3. **Specify the helper output contract explicitly.** The plan says the helper
   should emit "compact machine-readable result" and the agent should summarize
   for the user. The current helper outputs JSON to stdout; `add-evidence`
   should follow the same pattern with a `status`, `evidenceRefs`, and
   `manifestRows` field. Without a concrete output shape, runtime adapters will
   diverge on how to consume helper results.

4. **The cross-runtime test matrix should be a soft gate, not a hard one.** The
   plan requires verification across Codex, Claude Code, DeepSeek, Cascade, and
   a weak model baseline before changing the canonical harness. This risks
   blocking Slice 0 indefinitely. Recommend: Slice 0 lands on any two-runtime
   verification; Slice 1-2 land on Codex + Claude Code + the local test suite;
   Slice 3-4 require the full matrix.

5. **Add a "helper silently overwrites evidence" eval to the blocking list.**
   The current blocking evals cover missing metadata, mark-resolved mixing, and
   evidence locality, but do not cover the case where the helper overwrites an
   existing evidence file with the same name without warning.

## Answers To Focus Questions

### 1. Is the plan correctly scoped as a soft refactor rather than a new workflow?

Yes. The plan explicitly preserves all safety invariants (resume verification,
case-local evidence, manifest requirements, pendingTurn detection, hash-chain
consistency, resolution gate) and has a strong non-goals section. The decision
during review convergence to drop three named canonical modes (Strict /
Assisted / Strong-Runtime) was correct — those modes would have multiplied the
drift surface between canonical workflow, portable skill, and runtime adapters.
The single-workflow-with-helper-availability model is simpler and more
auditable.

### 2. Are the artifact visibility tiers correct? What should remain visible in chat, and what should be disk-only?

The three-tier model (user-visible, review-visible, machine-visible) is sound.
The plan correctly identifies that turn JSON, hash values, and helper internals
should be disk-only unless repair is needed.

However, there is an unresolved tension: the current harness.md mandates
verbatim checkpoints with full claim tables at every turn. The plan proposes
summary-level chat output ("Recorded 3 evidence files, advanced H3 to
Confirmed"). The plan should clarify whether the harness checkpoint shapes
change alongside Slice 0, or whether the summary is an additional layer on top
of the existing checkpoint structure. I recommend the summary _replaces_ the
full claim table in chat for subsequent turns, with the full journal always
available on disk.

### 3. Is the performance budget realistic? What should block a helper change from landing?

The 250ms target for turn bookkeeping is aggressive but useful as an initial
bar. The plan correctly identifies that process spawn, repeated file reads,
JSONL parsing, and journal hashing may dominate cost before the hash primitive
itself is material. The recommendation to benchmark before replacing integrity
primitives is prudent.

What should block landing: any helper command that exceeds 500ms for normal
bookkeeping on small cases without a measured, documented explanation. The
budget should also include a ceiling on total helper invocations per turn — the
plan correctly notes "fewer helper invocations per evidence item, not more."

### 4. Which integrity checks are load-bearing, and which could be cheaper local change detection?

Load-bearing and must remain:
- Hash-chain consistency between `02-turn-state.json` and `02-turns.jsonl`
  (caught a real mistake during the audited run — this is the highest-value
  integrity check)
- File digests for durable evidence and exported learning packets (cross-machine
  review needs strong digests)
- `pendingTurn` detection and journal-hash-before/after verification
- Manifest completeness verification

Could use cheaper local change detection:
- Purely local turn-state consistency checks within a single session could use
  file size + mtime + an optional fast content digest instead of SHA-256
- The `journalHash` stored in turn-state that gates `begin-turn` could use a
  cheaper change token, since its purpose is accidental-change detection within
  one investigation session, not cross-machine verification

The plan's approach of keeping SHA-256 for durable evidence and considering
cheaper tokens for local checks after benchmarking is correct. Do not optimize
the hash primitive before measuring whether it's actually the bottleneck.

### 5. Is Slice 0 (journal shape first) the right first step?

Yes. Slice 0 is zero-risk (no helper behavior changes, no state-machine
changes) and directly targets the largest friction source: repeated claim-row
prose. The plan wisely requires running a second investigation against the new
journal shape before implementing helper code. If journal discipline alone
removes most of the repeated context, the later helper can stay narrower.

One refinement: the proposed journal sections (Claims, Evidence Timeline,
Dismissed Hypotheses, Resolution) should be codified in `REQUIRED_JOURNAL_MARKERS`
in the helper code when they land, so `verify-case` can enforce the new shape.

### 6. Is Shape A (evidence import + generated turn JSON) enough before considering `record-evidence-batch`?

Yes. Shape A adds helper-owned evidence import and generated turn JSON without
changing the one-action-per-turn contract. This is the safest place to measure
whether helper support alone solves enough latency. The plan correctly gates
Shape B behind measurement after Slices 0-2, with explicit re-measurement
questions (journal shape churn reduction, manual backfill elimination, turn
count acceptability).

The `add-evidence` command fits cleanly into the existing `actionType` and
`allowedNext` model — it maps to the already-defined `add-evidence` actionType
and is already in `DEFAULT_ALLOWED_NEXT`. The implementation surface is narrow.

### 7. What failure mode would make batching unsafe?

The plan identifies the key failure modes well. The most dangerous ones:

- **Holding `pendingTurn` open across a user checkpoint** — the plan's
  request/result collapse rule correctly defaults to the narrow safe form.
- **Recording evidence and marking resolved in the same transaction** — the
  batch schema intentionally excludes `mark-resolved` from `allowedNext`.
- **Interrupted batch with unrecoverable state** — the partial batch recovery
  design with `pending-evidence-batch.json` and step boundaries is sound.
  Scenario tests that interrupt at every boundary are correctly specified.

Additional failure mode the plan should cover: **the agent claiming a batch
recorded successfully when the helper partially failed and the agent didn't
check the exit code**. The helper should output a machine-readable `status:
"partial"` with completed vs. failed items, and the agent must be instructed to
check this before summarizing to the user.

### 8. What minimal eval should block merging helper changes?

The plan's blocking evals list is good. I would add:

- Helper overwrites an existing evidence file without warning (silent data loss)
- Helper produces a turn JSON that `complete-turn` rejects due to schema
  mismatch (integration test, not unit test)
- Helper accepts an evidence file path outside the case or repo root (path
  traversal)
- Helper `add-evidence` succeeds but `complete-turn` with the generated turn
  JSON fails because `touchedClaims` don't match journal.md (end-to-end flow
  test)

## Minor Notes

- The `add-evidence` shell invocation in the plan uses `--active-hypothesis`
  but the batch JSON shape uses `activeHypothesis`. Pick one and use it
  consistently.
- The plan says `add-evidence` should "optionally generate a valid turn JSON
  file from the current pendingTurn." If this is optional, the plan should
  specify what the agent must do when it opts out (hand-write turn JSON as
  today, or the helper always generates it).
- The `capturedAt` field should be validated as ISO 8601 UTC, not just any
  string — the helper should reject non-conforming timestamps.
- The evidence file naming convention (how the helper derives the destination
  filename from `--name`) is unspecified. Consider: `<slug>-<source>-<name>-<timestamp>.ext`.
- The plan mentions "append-only evidence timeline entries" but doesn't specify
  the format of those entries. Should they be keyed by timestamp and evidence
  ref, or free-text? I recommend structured: `- <ISO-timestamp> — <source>: <summary> (<evidence-ref>)`.
- The batch schema includes `allowedNext` and `evidenceTimelineEntries` at the
  top level of the batch JSON, but `evidenceTimelineEntries` are helper-owned
  while `allowedNext` determines the next checkpoint menu. These should be
  separate concerns — `allowedNext` belongs in the turn event, not the batch
  input.