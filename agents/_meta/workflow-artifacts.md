---
topic: "workflow-artifacts"
title: "Workflow artifacts and phase gates"
content-type: reference
last-verified: "2026-05-17"
confidence: medium
source-tier: practice
sources:
  - "agents/investigator/prompt.md"
  - "agents/_meta/runtime-adapters.md"
author-status: draft
---

# Workflow artifacts and phase gates

Runtime loaders and portable skills make workflows discoverable, but they do
not guarantee that each runtime interprets the same prose contract the same
way. For workflows where correctness matters, use structured artifacts as the
portable execution contract.

The principle:

> Runtime adapters may vary. Workflow phase artifacts should not.

## General shape

Each workflow phase should emit a small machine-checkable artifact before the
next phase begins. The next phase reads the prior artifact and validates that it
has enough state to proceed.

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

## Investigator artifact sketch

A future `/z-investigator` artifact contract could write:

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
