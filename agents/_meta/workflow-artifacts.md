---
topic: "workflow-artifacts"
title: "Workflow artifacts and phase gates"
content-type: reference
last-verified: "2026-06-12"
confidence: medium
source-tier: practice
sources:
  - "agents/investigator/prompt.md"
  - "agents/investigator/case-intake.md"
  - "agents/_meta/runtime-adapters.md"
  - "scripts/investigator-artifacts.mjs"
author-status: draft
---

# Workflow artifacts and phase gates

Runtime loaders and portable skills make workflows discoverable, but they do
not guarantee that each runtime interprets the same prose contract the same
way. For workflows where correctness matters, use structured artifacts as the
portable execution contract.

The principle:

> Runtime adapters may vary. Workflow phase artifacts should not.

This is not primarily a prompt-quality pattern. Treat reliability-sensitive
workflows as state machines. A phase transition is valid only when a helper or
checker has created a small artifact, verified its required fields, read it
back, and reported a passing state.

## General shape

Each workflow phase should emit a small machine-checkable artifact before the
next phase begins. The next phase reads the prior artifact and validates that it
has enough state to proceed.

The load-bearing unit should be:

1. Create a small artifact.
2. Verify required fields and values.
3. Read the artifact back from disk.
4. Allow the next phase only after verification passes.

If a runtime skips the helper, invents a command, ignores verification, or
prints a checkpoint before verification completes, treat that as a failed state
transition. Do not treat it as a harmless formatting mistake.

Useful phase artifacts have stable top-level fields:

```text
Status: pass | blocked | fail
Blocking Issues: none | <one-line issue summary>
Next Step: <next command or phase>
```

Prefer deterministic helper commands for brittle boundaries. Runtime adapters
should call helpers and report their output; they should not reimplement helper
logic in prose.

Name the exact command at the boundary. Phrases like "run the deterministic
Step 1 helper" are not enough for runtimes that follow instructions literally.
The adapter must preserve the literal command shape and required arguments near
the phase instruction so the model does not have to infer the executable step.

For code-maintenance workflows, this often maps to:

1. Plan
2. Apply/edit
3. Validate
4. Review
5. Commit
6. Pull request

For investigation workflows, this maps better to evidence state:

1. Frame the issue.
2. Load grounding context.
3. Propose hypotheses.
4. Record one evidence source.
5. Update claim status.
6. Repeat evidence/decision until RCA is justified.
7. Draft RCA or retrospective.

## Investigator artifact contract

The current `/z-investigator` Step 1 gate writes:

```text
_data/cases/<slug>/
  case-intake.md
  case-intake.json
  journal.md
```

`case-intake.md` carries the human-readable phase state. `case-intake.json`
carries the machine-readable framing and proposed loads. `journal.md` is the
durable investigation artifact that later phases update.

The Step 1 helper command is:

```bash
node scripts/investigator-artifacts.mjs open-case \
  --root <repo-root> \
  --case-slug <slug> \
  --framing-json <path-to-framing-json> \
  --proposed-load agents/investigator/prompt.md \
  --proposed-load agents/investigator/harness.md
```

The `open-case` verification command is available for resume or repair:

```bash
node scripts/investigator-artifacts.mjs verify-case \
  --root <repo-root> \
  --case-slug <slug>
```

A passing `open-case` response IS the verification. Run `verify-case` only
when resuming an existing case or re-checking after repair — not as a
required second step after a passing `open-case`.

## Shipped Step 2+ artifact contract

The shipped artifact contract extends the Step 1 case directory with
workflow state written by deterministic helpers:

```text
_data/cases/<slug>/
  case-intake.md
  case-intake.json
  journal.md
  workflow/
    01-loads.json          ← written by record-loads; recomputed by
                              initialize-turn-ledger gate
    02-turns.jsonl         ← hash-chained turn ledger; written via
                              initialize-turn-ledger / run-turn / complete-turn
    02-turn-state.json     ← current turn state (written with 02-turns.jsonl)
    ledger-archive/        ← created by --force re-init; prior ledger files
      <UTC-timestamp>/     ←   are moved here (never overwritten in place)
        02-turns.jsonl
        02-turn-state.json
  evidence/
    MANIFEST.md            ← written by import-evidence
    <slug>-<name>.<ext>    ← individual evidence files
```

Journal saves are written by `save-journal` and verified against required
section markers before the write is accepted.

The initial journal (produced at Step 3) must contain only `Open` claim
statuses. The `save-journal` helper enforces this on first write. Subsequent
writes are gated by the evidence-gated transition predicate in `run-turn` /
`complete-turn` instead.

Force re-initialization of the turn ledger (`--force` flag on CLI only) archives
the existing `02-turns.jsonl` and `02-turn-state.json` into a timestamped
subdirectory of `workflow/ledger-archive/` before writing fresh genesis files.
The prior chain is never destroyed. `caseStatus` reports `archivedGenerations`
and emits a `nextActions` warning when any archived generation is found.
`force` is not available over MCP; use the CLI with explicit user approval.

## Superseded design sketch (kept for history)

The block below was an earlier speculative contract that was never built.
The shipped contract above supersedes it.

```text
_data/cases/<slug>/
  journal.md
  workflow/
    01-frame.json
    02-grounding.json
    03-hypotheses.json
    04-evidence-001.json
    05-decision.json
```

Long investigations may use either one evidence artifact per source
(`04-evidence-001.json`, `04-evidence-002.json`) or a single append-only
`04-evidence.json` array. The invariant is stable evidence IDs and checkable
source links, not the file-count pattern.

The JSON artifacts should stay language-neutral. Local validators may be
implemented in Python, Node, shell, or another runtime appropriate for the
installing team, but the artifact shapes should not depend on one toolchain.

## Minimum useful invariants

For an investigation case, a checker should eventually be able to verify:

- The case slug is consistent across artifacts.
- Blocking framing fields are resolved before grounding begins.
- Grounding artifacts list the files actually loaded.
- Hypothesis IDs are stable and unique.
- Evidence records cite a source path, query, test, or external observation.
- Decisions cite existing evidence IDs.
- Claim status changes do not jump to confirmed without evidence.
- RCA output cites evidence IDs rather than only prose assertions.

This should begin as a lightweight contract, not a heavy framework. The goal is
portable workflow reliability: a weaker runtime may differ in UI and prompt
following, but it must leave comparable artifacts that can be checked.
