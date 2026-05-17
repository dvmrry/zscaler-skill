---
name: zscaler-investigator
description: >
  Use for evidence-based Zscaler troubleshooting investigations, including
  questions normally routed to /z-investigator: symptoms with affected scope,
  tenant cloud, timeframe, ZIA/ZPA/ZCC/ZDX/ZIdentity/Cloud Connector context,
  logs, snapshots, policy behavior, connector health, or root-cause analysis.
---

# Zscaler Investigator

Use this skill when the user wants a structured troubleshooting investigation,
not a quick factual answer.

## Canonical Workflow

Load and follow:

- `../../../agents/investigator/prompt.md`

Load these only when their trigger applies:

- `../../../agents/investigator/methodology.md` — when stuck, drifting, or preparing handoff.
- `../../../agents/investigator/diagnostics/template.md` — only when authoring or reviewing a verified reusable diagnostic.
- `../../../agents/siem-emission-discipline.md` — before emitting or running SIEM queries.
- `../../../agents/tenant-schema-derivation.md` — when canonical-vs-tenant field mismatch appears.
- `../../../agents/loading-discipline.md` — if stage-announcement cadence drifts.
- `../../../agents/clarification-pattern.md` — if clarification format drifts.

## Runtime Policy

The files above are the source of truth. Runtime-specific command files may add
UI affordances or local save-path details, but must not redefine the workflow.

If the user invokes `/z-investigator`, treat that as an explicit request to use
this skill.
