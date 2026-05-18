---
id: z-auditor
title: Zscaler Auditor
role: auditor
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: medium
sources:
  - agents/auditor/prompt.md
  - agents/auditor/harness.md
  - agents/auditor/grounding/index.md
  - agents/auditor/methodology.md
author-status: draft
summary: Editorial and structural audit of skill references
primary-command: /z-auditor
known-runtimes:
  - codex
  - windsurf
  - claude
required-reads:
  - agents/auditor/prompt.md
  - agents/auditor/harness.md
  - agents/auditor/grounding/index.md
  - agents/auditor/methodology.md
supporting-scripts:
  - scripts/check-hygiene.py
---

# Zscaler Auditor Workflow

Load and follow the files listed in `required-reads`.

Use this workflow for read-only editorial, structural, and hygiene review. Parse
the requested scope, run the applicable mechanical checks, then perform the
editorial pass and output an audit register grouped by severity.

Do not edit files during an audit unless the user explicitly changes the task
from review to implementation.

Supporting script: `scripts/check-hygiene.py`
