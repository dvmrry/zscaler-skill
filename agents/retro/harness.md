---
role: retro
artifact: harness
title: "Retro - journal-first gate contract"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "agents/retro/methodology.md"
  - "docs/data-contract/cases.md"
dependencies:
  - "methodology.md"
author-status: draft
---

# Retro - journal-first gate contract

This harness defines the hard stops for `/z-retro`. It is intentionally lighter than the investigator turn ledger: retro is a postmortem workflow over existing case artifacts, not an active multi-turn investigation loop.

## Required input

Retro requires exactly one case directory and a readable `journal.md`.

If either is missing or ambiguous, stop before drafting:

- Missing case directory: ask for the `_data/cases/<slug>/` path.
- Multiple matching case directories: ask one multiple-choice clarification.
- Missing `journal.md`: recommend `/z-investigator` or ask for the correct case directory.

Do not build a retro from chat memory.

## Gate 1 - Artifact gate

Before warning extraction, load only:

1. `agents/retro/methodology.md`
2. `docs/data-contract/cases.md`
3. `<case>/journal.md`
4. `<case>/timeline.md`, if present
5. `<case>/evidence/MANIFEST.md`, if present
6. Existing `<case>/postmortem.md`, only when reviewing or revising it

Do not load raw evidence files unless a journal claim, timeline row, or manifest row needs verification.

## Gate 2 - Warning ledger gate

Before drafting postmortem prose, create a warning ledger that includes every material warning from the journal.

Allowed dispositions:

- `Resolved`
- `Ruled out`
- `Accepted risk`
- `Deferred`
- `Still open`

Allowed gate impacts:

- `Proceed`
- `Proceed with guardrail`
- `Stop`

If a material warning has no disposition, the final gate cannot be `Proceed`.

## Gate 3 - Evidence map gate

Every settled conclusion must map to a source:

- `journal.md`
- `timeline.md`
- `evidence/MANIFEST.md`
- a specific evidence file loaded for verification
- a commit or PR reference supplied by the user

Unsupported conclusions stay out of the final root cause. Mark them as `Unsupported` or keep them in follow-up work.

## Gate 4 - Postmortem write gate

Only write or update `<case>/postmortem.md` after Gates 1-3 pass.

The postmortem must include:

- Summary
- What happened
- Impact
- Root cause
- Detection
- What changed
- Warning ledger
- Follow-ups
- Final gate

If the user asked for review only, render findings in the response and do not write the file.

## Final gate

End with exactly one:

- `Proceed`
- `Proceed with accepted risk`
- `Stop / do not proceed`

`Proceed` requires all material warnings to be `Resolved` or `Ruled out`.

`Proceed with accepted risk` requires an owner, guardrail, or rollback path for every accepted risk.

`Stop / do not proceed` is required when a material warning remains `Still open` and the user has not explicitly accepted the risk.

## Prohibitions

- Do not browse sibling case contents. Directory names are allowed only for disambiguation.
- Do not close warnings by omission.
- Do not use unresolved `Open (likely)` or `Open (uncertain)` investigation claims as settled root cause.
- Do not recommend forward motion from a postmortem that lacks a warning ledger.
