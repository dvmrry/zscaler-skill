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

Workflow metadata: `../../../agents/investigator/workflow.md`

## Canonical Workflow

Load and follow these files:

- `../../../agents/investigator/prompt.md`
- `../../../agents/investigator/harness.md`
- `../../../agents/investigator/case-intake.md`

`prompt.md` defines investigator reasoning, grounding, and evidence discipline.
`harness.md` defines phase order, checkpoint halts, output shape, journal
creation timing, turn-transaction gates, and snapshot-load discipline.
`case-intake.md` defines the deterministic helper contract for case intake,
journal creation, and post-Step-3 turn ledger initialization.

Load these only when their trigger applies:

- `../../../agents/investigator/methodology.md` — when stuck, drifting, or preparing handoff.
- `../../../agents/investigator/diagnostics/template.md` — only when authoring or reviewing a verified reusable diagnostic.
- `../../../agents/siem-emission-discipline.md` — before emitting or running SIEM queries.
- `../../../agents/tenant-schema-derivation.md` — when canonical-vs-tenant field mismatch appears.
- `../../../agents/loading-discipline.md` — if stage-announcement cadence drifts.
- `../../../agents/clarification-pattern.md` — if clarification format drifts.

## Runtime Policy

The canonical files above are the workflow source of truth. Runtime-specific
command files may add UI handling, local save-path details, or checkpoint
reinforcement.

If a runtime has a dedicated `/z-investigator` adapter, preserve that adapter's
behavior and let it decide whether to delegate through this skill. In runtimes
without a dedicated adapter, an explicit `/z-investigator`-style request may be
treated as a request to use `zscaler-investigator`.
