---
id: z-investigator
title: Zscaler Investigator
role: investigator
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: medium
sources:
  - agents/investigator/prompt.md
  - agents/investigator/harness.md
  - agents/investigator/case-intake.md
  - scripts/investigator-artifacts.mjs
author-status: draft
summary: Evidence-based Zscaler troubleshooting investigation
primary-command: /z-investigator
known-runtimes:
  - codex
  - windsurf
  - claude
required-reads:
  - agents/investigator/prompt.md
  - agents/investigator/harness.md
  - agents/investigator/case-intake.md
supporting-scripts:
  - scripts/investigator-artifacts.mjs
---

# Zscaler Investigator Workflow

Load and follow the canonical investigator files listed in `required-reads`.

Runtime adapters must preserve:

- Step 1 case intake gate
- Step 2 file-load checkpoint
- Step 3 journal and turn-ledger initialization
- Post-Step-3 begin/complete/abandon turn transaction
- One action per turn
- Resolution completion gate

The metadata gives adapter docs and repo checks a stable place to point.

Supporting script: `scripts/investigator-artifacts.mjs`
