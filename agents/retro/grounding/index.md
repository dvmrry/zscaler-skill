---
role: retro
artifact: grounding
title: "Retro grounding - postmortem and decision-gate discipline"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "https://sre.google/sre-book/postmortem-culture/"
  - "https://sre.google/workbook/postmortem-culture/"
  - "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final"
  - "agents/retro/methodology.md"
  - "agents/retro/harness.md"
  - "docs/data-contract/cases.md"
  - "agents/investigator/methodology.md"
dependencies: []
author-status: draft
---

# Retro grounding - postmortem and decision-gate discipline

Use this grounding index before `/z-retro` drafts or reviews a postmortem.

## Public retro anchors

Use public incident-review practice as discipline, not as evidence:

- Write for learning and recurrence prevention, not blame assignment.
- Separate timeline facts, contributing factors, detection/response gaps, and corrective actions.
- A root cause statement should be supported by evidence and should not erase contributing conditions.
- Action items should be specific, owned, testable, and tied to a failure mode observed in the journal.

## Always load

- [`agents/retro/harness.md`](../harness.md) - artifact, warning, evidence, and final gates
- [`agents/retro/methodology.md`](../methodology.md) - postmortem shape and warning ledger
- [`docs/data-contract/cases.md`](../../../docs/data-contract/cases.md) - case artifact layout
- [`agents/investigator/methodology.md`](../../investigator/methodology.md) - claim-status semantics from the journal

## Retro discipline

- The journal is the primary input. Chat memory is not evidence.
- Warnings, objections, failed checks, and unresolved claims get ledger rows.
- Root cause statements need evidence map entries.
- Follow-ups must be specific enough to assign or test later.
- The final gate says whether the evidence supports proceeding, proceeding with accepted risk, or stopping.

## Decision-gate checks

Before saying `Proceed`, verify:

- Every material warning is `Resolved` or `Ruled out`.
- Every settled conclusion cites a journal, timeline, evidence, commit, or PR source.
- Any accepted risk has an owner, guardrail, or rollback path.

If those checks fail, use `Proceed with accepted risk` or `Stop / do not proceed`.
