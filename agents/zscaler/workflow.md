---
id: zscaler
title: Zscaler Ad-Hoc Q&A
role: zscaler
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: medium
sources:
  - agents/zscaler/prompt.md
  - agents/loading-discipline.md
  - agents/clarification-pattern.md
author-status: reviewed
summary: Grounded ad-hoc Zscaler Q&A
primary-command: "@zscaler"
known-runtimes:
  - windsurf
  - claude
required-reads:
  - agents/zscaler/prompt.md
  - agents/loading-discipline.md
  - agents/clarification-pattern.md
supporting-scripts:
---

# Zscaler Ad-Hoc Q&A Workflow

Load and follow the files listed in `required-reads`.

Use this workflow for conversational, citation-backed Zscaler Q&A. Read only the
specific references or tenant snapshot files needed for the current question.
If the question becomes procedural, offer the relevant `/z-*` handoff instead of
silently switching modes.
