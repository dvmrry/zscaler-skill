---
id: z-retro
title: Zscaler Retro
role: retro
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: medium
sources:
  - agents/retro/prompt.md
  - agents/retro/harness.md
  - agents/retro/grounding/index.md
  - agents/retro/methodology.md
  - agents/investigator/methodology.md
  - agents/clarification-pattern.md
author-status: reviewed
summary: Journal-first incident retro and postmortem workflow
primary-command: /z-retro
known-runtimes:
  - codex
  - devin
  - claude
required-reads:
  - agents/retro/prompt.md
  - agents/retro/harness.md
  - agents/retro/grounding/index.md
  - agents/retro/methodology.md
  - agents/investigator/methodology.md
  - agents/clarification-pattern.md
supporting-scripts:
---

# Zscaler Retro Workflow

Load and follow the files listed in `required-reads`.

Use this workflow after an investigation has produced a journal. Load
`journal.md` first, extract material warnings, produce or review
`postmortem.md`, and close with the final decision gate.

No journal means no retro. Do not use chat memory as evidence.
