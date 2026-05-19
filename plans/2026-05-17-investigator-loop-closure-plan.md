---
title: "Investigator Loop Closure Plan"
date: "2026-05-17"
status: implemented-0.2.0-foundation
scope: "hardening post-Step-3 investigator loop drift without overstating verifier power"
source-review: "PR #24 downstream runtime smoke tests and loop-closure review round"
implemented-in: "0.2.0"
---

# Investigator Loop Closure Plan

> Resolution: the 0.2.0 foundation shipped. The investigator has helper-owned
> turn transactions (`initialize-turn-ledger`, `begin-turn`, `complete-turn`,
> `abandon-turn`), pending-turn recovery, and completion-gate checks. Longer
> loop expansion and future workflow ports remain roadmap work.

## Executive Summary

PR #24 made the investigator runtime materially more reliable by moving Step 1
case intake into deterministic artifacts:

- `_data/cases/<slug>/case-intake.md`
- `_data/cases/<slug>/case-intake.json`
- `_data/cases/<slug>/journal.md`

The `open-case` / `verify-case` helper gives Step 1 a real hard gate because it
does not trust an agent-authored `Status: pass`. It recomputes status from the
framing, proposed loads, path constraints, telemetry guardrails, and file
existence.

Downstream tests are encouraging, but they are still smoke tests. They show
that weak runtimes can follow the new Step 1/2/3 harness in short runs:

- Step 1 created and verified durable artifacts.
- Step 2 respected snapshot boundaries.
- Step 3 saved the journal and halted.
- The tested weak runtime did not invent tenant ZPA state when snapshots were
  missing.

The next reliability gap is long-run drift after Step 3. Investigations are not
really three steps; they are repeated loops:

```text
frame -> ground -> journal -> turn -> turn -> turn -> close
```

The plan below reframes loop closure around verifier power. A gate is only hard
closed when a helper can verify something from helper-owned or externally
observable state. If the helper can only validate an artifact written by the
same agent, call it an audit or attestation gate, not closure.

## Review Convergence

The review round agreed on several corrections to the first draft:

- **Verifier-first design.** Start with what the helper can recompute or own;
  then choose the artifact shape that enables that check.
- **Do not overclaim loaded-set proof.** A helper can validate a declared load
  set, paths, and scope. It cannot prove a runtime actually read a file unless
  the helper performs the read or captures helper-observable metadata.
- **Avoid split-brain state.** `journal.md` and any future JSON state must have
  an explicit source-of-truth relationship. Two parallel agent-authored
  representations are a drift trap.
- **Long-run turn drift is the main next failure mode.** The highest-value next
  slice is a post-Step-3 turn verifier / turn ledger, not a large workflow
  engine.
- **A halt needs a mechanism.** "Run verifier, then halt" is still prose unless
  the next phase requires helper-owned ordering/state, a user checkpoint
  response, or another runtime-observable boundary.

## Gate Classes

Use these terms precisely.

### Structural Gate

A structural gate verifies helper-owned or externally observable state. The
agent cannot make it pass by writing `status: pass`.

Examples:

- `verify-case` recomputes case intake status from known inputs.
- A helper-owned turn token must match the previous verified state.
- A saved artifact hash must match the file read back from disk.

### Audit Gate

An audit gate checks declared agent state against deterministic rules, but it
cannot prove the agent actually performed every claimed action.

Examples:

- A declared loaded-set says a file was loaded. The helper can check the file
  exists and was allowed; it cannot prove the model read the content unless the
  helper did the read.
- A claim says it is `snapshot-grounded`. The helper can require a cited source
  that appears in the selected snapshot set; it cannot prove the prose reasoning
  used that evidence correctly.

Audit gates are still useful. They just must not be sold as hard closure.

### Attestation

An attestation is agent-authored state that is useful for handoff but not
strong enough to constrain a weak runtime by itself.

Examples:

- `actionSummary`
- `notes`
- `reason`

Attestations should be cross-checked where possible, but they are not a gate.

## Current Loop State

### Hard-Closed

- **Case intake creation** — helper owns artifact creation.
- **Case intake verification** — helper recomputes status from inputs.
- **Proposed-load validation** — helper blocks missing files and invalid Step 1
  load types.
- **No-clobber resume discipline** — helper refuses existing artifacts unless
  `--force` is explicit.

### Soft-Closed

- **Step 2 loaded-file discipline** — bounded by harness prose and smoke tests,
  but not machine-proven.
- **Step 3 journal generation** — write/readback/marker discipline exists, but
  no helper verifies claim quality or transition integrity.
- **Subsequent turns** — one-action cadence is documented, but long-run drift
  remains possible.
- **Completion / RCA handoff** — still mostly prose.

## Remaining Escape Hatches

1. **Step-skipping**
   A runtime may jump from Step 1 to Step 3 without a verified Step 2 state.

2. **Self-certified loads**
   A runtime may claim a file was loaded when it only listed the path.

3. **Extra or forbidden loads**
   A runtime may load or cite files outside the proposed/approved set.

4. **Snapshot overreach**
   A runtime may infer tenant state from sibling product subtrees, another
   cloud, broad `_data/`, or references when the expected product snapshot is
   missing.

5. **Journal save claims**
   A runtime may claim `Journal saved` without changing the file or may write a
   malformed journal.

6. **Evidence-basis inflation**
   A runtime may mark a hypothesis `Open (likely)` or imply tenant-specific
   state from product references alone.

7. **Multi-action drift**
   A runtime may update several hypotheses in one turn.

8. **Mutable history**
   A runtime may silently rewrite prior claims, delete alternatives, or change
   earlier statuses.

9. **Resume drift**
   A runtime may resume from `journal.md` alone and lose `case-intake.json`
   framing/proposed-load discipline.

10. **Completion shortcut**
    A runtime may treat a plausible hypothesis as resolved without cited
    evidence, ruled-out alternatives, a saved journal, and user confirmation.

## Verifier-First Design Principle

Every fragile phase should answer these in order:

1. **Verifier power** — what can the helper recompute, observe, or own?
2. **Halt mechanism** — what helper-owned ordering/state or runtime-observable
   input is required before the next phase?
3. **Inputs** — what existing artifacts must verify first?
4. **Allowed reads/actions** — what is in bounds?
5. **Forbidden reads/actions** — what is out of bounds?
6. **Artifact** — what file is written or updated to make state durable?
7. **Status invariant** — `status` is derived from `blockingIssues.length === 0`;
   never trust a stored `status` alone.
8. **Recovery transition** — what should the runtime do when verification
   returns `blocked` or `fail`?

If a phase has no independent verifier power, call it an audit gate and keep
the claims modest.

## Artifact Layout

Use the existing workflow artifact direction under
`agents/_meta/workflow-artifacts.md`: human-readable case files at the case
root, machine-readable phase artifacts under `workflow/`.

```text
_data/cases/<slug>/
  case-intake.md
  case-intake.json
  journal.md
  workflow/
    01-loaded-set.json
    02-turns.jsonl
    02-turn-state.json
    03-journal-state.json
    04-completion.json
```

This keeps the root readable while making machine artifacts easy to validate,
archive, or replace later.

## Source Of Truth Rule

Do not allow two independent agent-authored representations of the same state.

Near-term rule:

- `journal.md` remains the human-facing investigation artifact.
- Machine JSON is the verifier/audit state.
- If both contain the same claim data, the helper must reconcile them or derive
  one from the other.

Preferred future rule:

- Helper-owned machine state is canonical for claims/turns.
- `journal.md` is either rendered from that state or verified against it with
  stable claim IDs, statuses, sources, and evidence-basis labels.

Until that exists, avoid pretending `journal-state.json` fully closes the loop.

## Phase 1 — Turn Transaction / Turn Ledger

### Goal

Close the most likely long-run drift path after Step 3: repeated turns that
skip the journal, batch multiple actions, forget uncertainty, or resume from
memory.

This is the first recommended implementation slice.

### New Artifact

```text
_data/cases/<slug>/workflow/02-turns.jsonl
_data/cases/<slug>/workflow/02-turn-state.json
```

Use append-only JSON Lines so turn history is not silently overwritten.
`02-turn-state.json` stores only the latest helper-owned ordering state needed
to resume safely.

### Proposed Event Shape

```json
{
  "sequence": 4,
  "previousHash": "sha256:<previous-turn-or-journal-state-hash>",
  "turnToken": "helper-owned-ordering-token",
  "nextTurnToken": "helper-owned-next-ordering-token",
  "userAction": "continue-top-open",
  "activeHypothesis": "H2",
  "actionType": "load-file",
  "actionSummary": "Loaded server-groups.json and checked referenced connector groups.",
  "evidenceRefs": ["E3"],
  "touchedClaims": ["H2"],
  "journalHashBefore": "sha256:<before>",
  "journalHashAfter": "sha256:<after>",
  "allowedNext": [
    "continue-top-open",
    "investigate-different-claim",
    "add-evidence",
    "mark-resolved",
    "pause"
  ],
  "blockingIssues": []
}
```

### Current State Shape

```json
{
  "caseSlug": "2026-05-17-example",
  "currentSequence": 4,
  "latestTurnHash": "sha256:<latest-turn-event-hash>",
  "journalHash": "sha256:<latest-journal-hash>",
  "nextTurnToken": "helper-owned-next-ordering-token",
  "pendingTurn": null,
  "allowedNext": [
    "continue-top-open",
    "investigate-different-claim",
    "add-evidence",
    "mark-resolved",
    "pause"
  ],
  "blockingIssues": []
}
```

### Helper Transaction

```bash
node scripts/investigator-artifacts.mjs begin-turn \
  --root <repo-root> \
  --case-slug <slug> \
  --user-action <allowed-next-action>

node scripts/investigator-artifacts.mjs complete-turn \
  --root <repo-root> \
  --case-slug <slug> \
  --turn-json <file>
```

Bootstrap matters. The first post-Step-3 turn has no previous turn event.
Provide one explicit genesis path:

```bash
node scripts/investigator-artifacts.mjs initialize-turn-ledger \
  --root <repo-root> \
  --case-slug <slug>
```

`initialize-turn-ledger` verifies `verify-case`, verifies the saved
`journal.md` exists with the claim table, records the initial journal hash,
writes a sequence `0` genesis event to `02-turns.jsonl`, writes
`02-turn-state.json`, and issues the first helper-owned `nextTurnToken` plus
the initial `allowedNext` set.

`begin-turn` and `complete-turn` must be treated as one transaction boundary:

1. `begin-turn` verifies the prior state in `02-turn-state.json`, records the
   current `journal.md` hash, validates that the requested user action is in the
   prior `allowedNext` set, consumes the persisted `nextTurnToken`, and issues a
   one-use helper-owned `turnToken`. It must persist a `pendingTurn` object in
   `02-turn-state.json` containing the `turnToken`, `userAction`,
   `journalHashBefore`, next `sequence`, and prior `latestTurnHash`.
2. The runtime performs exactly one investigation action and updates
   `journal.md`.
3. `complete-turn` validates the `turnToken`, expected prior hash, changed
   journal hash, monotonic sequence, touched claims, and allowed next actions;
   only then does it append to `02-turns.jsonl` and issue the next helper-owned
   ordering token by writing both the turn event and `02-turn-state.json`.
   Completion must clear `pendingTurn`; stale pending state blocks a new
   `begin-turn` until repaired or explicitly abandoned.

Do not model this as "agent writes event, then verifier checks it later." The
helper owns the transition from previous state to next state.

### Verifier Power

The helper can verify:

- `verify-case` passes first.
- `journal.md` exists.
- `journal.md` contains the required claim table header.
- The journal file hash changed when an action claims to update it.
- The previous turn hash matches the latest appended turn.
- Sequence numbers are monotonic.
- Only one turn event is appended per helper invocation.
- `touchedClaims` is not empty for an investigative action.
- The event records a turn token issued by `begin-turn`.
- `02-turn-state.json` agrees with the last event in `02-turns.jsonl`.
- `complete-turn` validates against the helper-persisted `pendingTurn`, not
  against agent-authored prior-hash fields alone.

The helper cannot prove the model reasoned correctly. This is a structural
guard against turn drift, not a truth oracle.

### Halt Mechanism

Each verified turn should produce a helper-owned ordering token and an
`allowedNext` set and persist both in `02-turn-state.json`. The next turn
selects a user-facing action from `allowedNext`; the helper consumes the
persisted prior token from `02-turn-state.json` when `begin-turn` starts.

This is not perfect in a generic chat runtime because an agent could still
fabricate a user selection. It is still stronger than prose because the helper
owns monotonic turn state and can reject stale, missing, or out-of-order tokens.
Runtimes with stronger tool/user-event separation can make this a true
runtime-enforced user boundary.

### Recovery Transition

If `begin-turn` or `complete-turn` fails:

- Emit `Turn not verified: <reason>`.
- Do not continue the investigation.
- Offer only:
  - repair journal state;
  - rerun the previous turn action;
  - pause for human review.

## Phase 2 — Loaded-Set Audit

### Goal

Make Step 2 auditable without overstating what can be proven. The loaded-set
artifact records the declared in-bounds file set and makes forbidden or missing
paths visible before Step 3.

This is an audit gate unless the helper itself performs the reads.

### New Artifact

```text
_data/cases/<slug>/workflow/01-loaded-set.json
```

### Proposed JSON Shape

```json
{
  "caseSlug": "2026-05-17-example",
  "status": "pass",
  "inputs": {
    "caseIntake": "_data/cases/2026-05-17-example/case-intake.json"
  },
  "docs": [
    {
      "path": "agents/investigator/prompt.md",
      "reason": "canonical investigator prompt",
      "status": "loaded",
      "sha256": "sha256:<file-hash>"
    }
  ],
  "snapshotEnumeration": {
    "cloud": "zs2",
    "canonicalPath": "_data/snapshot/zs2/",
    "fallbackPath": "_data/zs2/",
    "status": "empty",
    "files": []
  },
  "selectedSnapshot": [],
  "existingEvidence": [],
  "userFlaggedSpecifics": [
    {
      "token": "salesforce-prod",
      "status": "found",
      "locations": [
        {
          "path": "references/zpa/app-segments.md",
          "selector": "section: Application segment matching"
        }
      ]
    }
  ],
  "waivers": [],
  "blockingIssues": []
}
```

### Helper Commands

```bash
node scripts/investigator-artifacts.mjs record-loaded-set \
  --root <repo-root> \
  --case-slug <slug> \
  --loaded-set-json <file>

node scripts/investigator-artifacts.mjs verify-loaded-set \
  --root <repo-root> \
  --case-slug <slug>
```

### Verification Rules

`verify-loaded-set` should check:

- `verify-case` passes first.
- Every Step 1 proposed load appears as `docs[].path` with `status: loaded`
  unless an explicit user waiver exists.
- Failed required docs block `status: pass` unless waived by the user.
- Every `docs[].path` is either a Step 1 proposed load or a canonical required
  investigator file.
- No snapshot/evidence file appears in `docs`.
- Snapshot enumeration is cloud-scoped only.
- Fork fallback is used only when `_data/snapshot/<cloud>/` is absent or empty.
- Missing product subtrees are recorded as missing, not inferred.
- Every selected snapshot path came from snapshot enumeration.
- Existing evidence paths stay inside the operative case directory unless the
  user supplied another path.
- `status` is recomputed from `blockingIssues`, not trusted from disk.

### Optional Stronger Mode

If needed later, add helper-owned reads:

```bash
node scripts/investigator-artifacts.mjs load-file \
  --root <repo-root> \
  --case-slug <slug> \
  --path <repo-relative-path>
```

That would let the helper record hashes for files it actually read. Until then,
loaded-set is an audit artifact, not proof of model attention.

## Phase 3 — Journal State / Claim Ledger

### Goal

Make claim status and evidence basis checkable without creating split-brain
between `journal.md` and JSON state.

### New Artifact

```text
_data/cases/<slug>/workflow/03-journal-state.json
```

### Proposed JSON Shape

```json
{
  "caseSlug": "2026-05-17-example",
  "status": "pass",
  "journalPath": "_data/cases/2026-05-17-example/journal.md",
  "journalHash": "sha256:<journal-hash>",
  "loadedSet": "_data/cases/2026-05-17-example/workflow/01-loaded-set.json",
  "evidence": [
    {
      "id": "E1",
      "type": "reference",
      "path": "references/zpa/app-segments.md",
      "selector": "section: Segment matching",
      "basis": "reference-grounded"
    }
  ],
  "claims": [
    {
      "id": "H1",
      "claim": "The application segment may not include the target app.",
      "sourceRefs": ["E1"],
      "status": "Open (uncertain)",
      "nextEvidenceNeeded": "Check _data/snapshot/zs2/zpa/application-segments.json for the app name.",
      "evidenceBasis": "reference-grounded",
      "notes": "No tenant snapshot or runtime evidence available."
    }
  ],
  "rootCauseHypothesis": null,
  "nextStep": "Investigate H1",
  "blockingIssues": []
}
```

### Verification Rules

`verify-journal` should check:

- `verify-case` passes.
- `verify-loaded-set` passes, if the loaded-set artifact exists.
- `journal.md` exists and its hash matches `journalHash`.
- `journal.md` contains the required sections and claim table header.
- Every claim has stable `id`, `status`, `sourceRefs`, `nextEvidenceNeeded`,
  and `evidenceBasis`.
- Every `sourceRefs[]` ID exists in `evidence[]`.
- Every evidence path is reachable from the loaded-set or explicitly recorded
  as user-supplied evidence.
- `snapshot-grounded` claims cite snapshot evidence.
- `runtime-evidence grounded` claims cite runtime/log/API/user evidence.
- `reference-grounded` claims cannot be `Open (likely)`.
- `Open (likely)` requires at least one claim-relevant snapshot, runtime, API,
  or user evidence reference.
- `Resolved` requires cited supporting evidence, disposition of competing
  hypotheses, and user confirmation or explicit uncertainty.
- `status` is recomputed from `blockingIssues`.

### Source-Of-Truth Decision

Do not implement this phase until the source-of-truth strategy is explicit.

Acceptable strategies:

1. **JSON canonical, Markdown rendered or reconciled.**
   The helper verifies `journal.md` against `journal-state.json` using stable
   claim IDs/status/source fields.

2. **Markdown canonical, JSON derived.**
   The helper parses a strict journal table into JSON. This couples the helper
   to Markdown shape but avoids dual-authored state.

The current preference is JSON canonical with Markdown reconciliation, but that
should be reviewed before implementation.

## Phase 4 — Completion / RCA Gate

### Goal

Prevent weak runtimes from turning a plausible hypothesis into a final RCA too
early.

### New Artifact

```text
_data/cases/<slug>/workflow/04-completion.json
```

### Completion Requirements

Before an investigation emits RCA/retro output, require:

- `verify-case` passes.
- `verify-journal` passes, if journal-state exists.
- One claim is marked root cause or the output explicitly says no root cause
  was confirmed.
- Supporting evidence IDs are cited.
- Competing plausible hypotheses are ruled out or explicitly left open.
- The user confirmed resolution or explicitly requested RCA with remaining
  uncertainty.

### Possible Command

```bash
node scripts/investigator-artifacts.mjs verify-completion \
  --root <repo-root> \
  --case-slug <slug>
```

This can be deferred until RCA/retro behavior becomes the next weak point.

## Minimal Public Workflow Registry

After the investigator loop proves stable, add a tiny public workflow registry
for discovery and review tooling. Call it what it is: a lightweight registry,
not a renderer.

Candidate path:

```text
agents/_meta/workflows.yaml
```

Candidate entry:

```yaml
- name: zscaler-investigator
  kind: workflow
  description: Evidence-based Zscaler troubleshooting investigation workflow.
  version: 1
  tags:
    - zscaler
    - investigation
    - evidence
  source:
    root: agents/investigator
    entrypoints:
      - agents/investigator/prompt.md
      - agents/investigator/harness.md
  runtime:
    skill: .agents/skills/zscaler-investigator/SKILL.md
    adapters:
      - .windsurf/workflows/z-investigator.md
      - .claude/commands/z-investigator.md
  artifacts:
    root: _data/cases/{caseSlug}
    workflowRoot: _data/cases/{caseSlug}/workflow
    required:
      - case-intake.json
      - case-intake.md
      - journal.md
  helpers:
    - scripts/investigator-artifacts.mjs
  gates:
    - case-intake
    - proposed-load-validation
    - no-clobber-resume
```

If this ships, add a checker that validates the registry against filesystem
reality. Otherwise it becomes another drift surface.

## Recommended Implementation Order

1. **Do not block PR #24 on this whole plan.**
   PR #24 can merge if downstream smoke tests remain positive. Step 1 is
   hard-gated; Step 2/3 are documented and tested enough for the current PR.

2. **Next PR: turn transaction minimal.**
   Add post-Step-3 turn drift checks around existing `journal.md`: verify case,
   verify journal exists, verify claim table, hash before/after, monotonic turn
   ledger, one touched claim/action, and helper-owned ordering token. Implement
   this as a `begin-turn` / `complete-turn` helper transaction rather than
   separate post-hoc verification.

3. **Then loaded-set audit.**
   Close Step 2-to-Step-3 visibility without pretending the helper proved model
   attention.

4. **Then journal-state.**
   Only after choosing JSON-canonical vs Markdown-canonical.

5. **Then completion/RCA verification.**
   Add after real RCA/retro tests expose the next weak point.

6. **Then workflow registry.**
   Add once the investigator artifact pattern stabilizes and include a checker.

## Review Questions

- Is the structural/audit/attestation distinction clear enough to prevent
  overclaiming?
- Is the `begin-turn` / `complete-turn` transaction the right next
  implementation slice, or should loaded-set still come first?
- What is the smallest useful helper-owned ordering token?
- Should `journal-state.json` be JSON-canonical or Markdown-derived?
- Is the `workflow/` subdirectory the right artifact home for future phases?
- Which checks are actually verifier-observable, and which should be labeled
  as audit-only?
- What should be the standard recovery transition for `blocked` and `fail`?

## Non-Goals

- Do not build a full workflow renderer.
- Do not introduce private export schema or private naming.
- Do not require a package manager or external runtime beyond existing Node
  stdlib helpers.
- Do not claim that an agent-authored JSON file proves the agent performed an
  action.
- Do not force every agent into this pattern before investigator proves it.
- Do not replace runtime adapters in the same PR as the artifact model.

## Success Criteria

The loop-closure work is successful when a weak runtime can run multiple
investigation turns and an external reviewer can answer, from files alone:

- What framing was accepted?
- Which files were declared loaded, and which of those declarations are
  helper-observable versus agent-attested?
- Which snapshot/evidence paths were unavailable?
- Which hypotheses were generated?
- What evidence IDs support each hypothesis?
- What single action happened on the last turn?
- What changed in `journal.md` on the last turn?
- What is the next allowed step?
- Was the journal actually saved?

That is the durable framework shape: phase artifacts with small deterministic
checks, plus honest labels where the helper can audit but not fully prove the
agent's behavior.
