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
  - agents/declared-records.md
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
  - agents/siem-emission-discipline.md
optional-reads:
  - agents/architect/methodology.md
  - agents/declared-records.md
supporting-scripts:
---

# Zscaler Architect Workflow

Load and follow the files listed in `required-reads`. Load files listed in
`optional-reads` only when the recommendation subtype needs them.

Use this workflow for capacity, scaling, and structural architecture review. Map
scope, planning horizon, and evidence access. Review configuration first, layer
metrics when available, and output a recommendation register grouped by risk.

Do not change tenant state. If scope or evidence access is unclear, ask one
targeted clarifying question.

Available on demand:

- `agents/architect/diagnostics/template.md` — load only when authoring or reviewing a verified reusable diagnostic.
- `agents/architect/methodology.md` — load when writing the full recommendation
  register or resolving a structural-risk judgment.
- `agents/declared-records.md` — load when persisting durable warnings,
  recommendations, decisions, or action items.

`agents/siem-emission-discipline.md` is a **required** read (see `required-reads`),
not optional: it is the SIEM / tenant-data leak boundary and must be loaded before
any telemetry emission, never deferred to "when remembered."
