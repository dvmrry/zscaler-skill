---
id: z-architect
title: Zscaler Architect
role: architect
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: medium
sources:
  - agents/architect/prompt.md
  - agents/architect/harness.md
  - agents/architect/grounding/index.md
  - agents/architect/methodology.md
  - agents/siem-emission-discipline.md
author-status: reviewed
summary: Capacity and scaling architecture review
primary-command: /z-architect
known-runtimes:
  - codex
  - devin
  - claude
required-reads:
  - agents/architect/prompt.md
  - agents/architect/harness.md
  - agents/architect/grounding/index.md
  - agents/architect/methodology.md
  - agents/siem-emission-discipline.md
supporting-scripts:
---

# Zscaler Architect Workflow

Load and follow the files listed in `required-reads`.

Use this workflow for capacity, scaling, and structural architecture review. Map
scope, planning horizon, and evidence access. Review configuration first, layer
metrics when available, and output a recommendation register grouped by risk.

Do not change tenant state. If scope or evidence access is unclear, ask one
targeted clarifying question.

Available on demand:

- `agents/architect/diagnostics/template.md` — load only when authoring or reviewing a verified reusable diagnostic.
