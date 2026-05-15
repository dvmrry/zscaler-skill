---
role: retro
artifact: methodology
title: "Retro methodology — journal-first postmortem discipline"
content-type: reference
last-verified: "2026-05-14"
confidence: high
source-tier: practice
sources:
  - "_data/incidents/README.md"
  - "agents/investigator/methodology.md"
dependencies:
  - "../investigator/methodology.md"
  - "../clarification-pattern.md"
author-status: draft
---

# Retro methodology — journal-first postmortem discipline

A retro turns a completed investigation into an accountable postmortem. It is **journal-first**: the retro explains what the investigation established, which warnings were raised, how each warning was disposed, and whether the evidence supports moving forward.

The retro does **not** replace the journal, and it does **not** smooth over warning signs. If the journal contains unresolved material warnings, the retro's decision gate is **Stop / do not proceed** or **Proceed only with explicitly accepted risk** — never "push forward anyway."

## Inputs

Required:

- `_data/incidents/<slug>/journal.md` — source of claims, hypotheses, warning signs, and status transitions.

Usually present:

- `_data/incidents/<slug>/timeline.md` — chronological event ordering.
- `_data/incidents/<slug>/evidence/MANIFEST.md` — raw artifact index.
- `_data/incidents/<slug>/evidence/*` — raw evidence, loaded only when needed to verify a claim.

Optional:

- `_data/incidents/<slug>/audit.md` / `posture.md` — follow-on review artifacts.
- Git commits, PRs, or CI runs tied to the incident.

## Non-negotiable invariants

1. **No journal, no retro.** If `journal.md` is missing, stop and ask whether to run `/z-investigator` or provide the journal path.
2. **No uncited conclusions.** Every root cause, lesson, and decision gate cites a journal claim, timeline entry, evidence manifest row, command output, or commit.
3. **Warnings are first-class.** Extract material warnings from the journal before drafting prose. Do not bury them under lessons learned.
4. **Decision gate before forward motion.** The retro must say whether it is safe to proceed, unsafe to proceed, or safe only with accepted risk.
5. **Blameless, not toothless.** Avoid personal blame; keep the technical and process accountability sharp.

## Warning ledger

Before drafting the postmortem, build a warning ledger. A warning is material when it could have changed the decision to continue, ship, merge, deploy, or close the incident.

Use this table shape:

| ID | Warning from journal | Source | Disposition | Gate impact |
|---|---|---|---|---|
| W1 | <warning / risk / unresolved claim> | `journal.md` claim / line, timeline entry, evidence row | Resolved / Ruled out / Accepted risk / Deferred / Still open | Proceed / Proceed with guardrail / Stop |

Disposition meanings:

- **Resolved** — evidence closed the warning; cite the closing evidence.
- **Ruled out** — falsifying evidence showed the warning does not apply; cite it.
- **Accepted risk** — the team intentionally proceeded despite the warning; name the owner / rationale if available.
- **Deferred** — not closed now; must create or cite a follow-up.
- **Still open** — no valid basis to proceed unless the user explicitly accepts risk.

## Decision gate

Every retro has exactly one final decision gate:

| Gate | Meaning |
|---|---|
| **Proceed** | All material warnings resolved or ruled out; follow-ups are non-blocking. |
| **Proceed with accepted risk** | One or more warnings remain, but the user/team explicitly accepted them with owner, guardrail, or rollback path. |
| **Stop / do not proceed** | A material warning remains unresolved or unowned. Further forward motion would be unsupported by the journal. |

The gate is evidence-derived. If the evidence is incomplete, choose the more conservative gate.

## Postmortem format

Write `_data/incidents/<slug>/postmortem.md` with these sections:

```markdown
# Postmortem — <incident title>

## Summary

<one paragraph: what happened, impact, current state, final gate>

## Evidence map

- Journal: `journal.md`
- Timeline: `timeline.md` (if present)
- Evidence manifest: `evidence/MANIFEST.md` (if present)
- Related commits / PRs: <list or "none found">

## Root cause

- <cause> — Source: <journal/evidence/timeline citation>

## Warnings and decision gates

| ID | Warning from journal | Source | Disposition | Gate impact |
|---|---|---|---|---|
| W1 | ... | ... | ... | ... |

**Final gate:** Proceed / Proceed with accepted risk / Stop / do not proceed

## Why it wasn't caught earlier

- <systemic gap> — Source: <citation>

## What changed

- <edit / config / process change> — Source: <commit / PR / journal citation>

## Lessons

- <generalized lesson> — Source: <citation>

## Follow-ups

- [ ] <owner if known> — <work item> — Source: <warning or lesson>
```

## Handoff rules

- If the final gate is **Stop / do not proceed**, the retro's closing message must say what evidence or fix would change the gate.
- Deferred warnings become `IMPROVEMENTS.md` items or explicit incident follow-ups; do not leave them only in prose.
- If a later turn provides new evidence, update the warning ledger and final gate instead of appending contradictory notes.
- On a subsequent turn, reload `journal.md`, the current `postmortem.md`, and any newly cited timeline or evidence manifest entries before changing the gate.
- When new evidence changes a warning disposition, update the ledger row first, then update the summary, follow-ups, and final gate to match.

## Cross-links

- [`./prompt.md`](./prompt.md) — executable `/z-retro` playbook and first-turn output shape
- [`../investigator/methodology.md`](../investigator/methodology.md) — claim status semantics inherited from investigation journals
- [`../../_data/incidents/README.md`](../../_data/incidents/README.md) — incident directory convention, privacy posture, and evidence manifest shape
