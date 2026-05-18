---
id: z-researcher
title: Zscaler Researcher
role: researcher
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: medium
sources:
  - agents/researcher/prompt.md
  - agents/researcher/grounding/index.md
author-status: draft
summary: Citation-backed reference expansion workflow
primary-command: /z-researcher
known-runtimes:
  - codex
  - windsurf
  - claude
required-reads:
  - agents/researcher/prompt.md
  - agents/researcher/grounding/index.md
supporting-scripts:
  - scripts/check-hygiene.py
---

# Zscaler Researcher Workflow

Load and follow the files listed in `required-reads`.

Use this workflow to expand reference docs from source material. Follow the
parse, extract, write, and verify checkpoints in `agents/researcher/prompt.md`.
The checkpoints are audit/attestation gates, not helper-enforced structural
gates.

Supporting script: `scripts/check-hygiene.py`
