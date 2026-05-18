---
id: zscaler-skill-setup
title: Zscaler Skill Setup
role: setup
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: high
sources:
  - agents/setup/prompt.md
  - scripts/setup-data-mount.mjs
  - scripts/check-data-contract.mjs
author-status: draft
summary: Runtime data mount setup and repair workflow
primary-command: /zscaler-skill-setup
known-runtimes:
  - codex
required-reads:
  - agents/setup/prompt.md
supporting-scripts:
  - scripts/setup-data-mount.mjs
  - scripts/check-data-contract.mjs
---

# Zscaler Skill Setup Workflow

Load and follow the files listed in `required-reads`.

Use this workflow when setting up or repairing `_data`. Collect inputs, print
the exact command, run the deterministic helper, then run the data-contract
check. Keep private data source defaults out of committed files.

Supporting scripts:

- `scripts/setup-data-mount.mjs`
- `scripts/check-data-contract.mjs`
