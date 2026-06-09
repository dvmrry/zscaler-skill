---
id: z-soc
title: Zscaler SOC
role: soc
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: medium
sources:
  - agents/soc/prompt.md
  - agents/soc/harness.md
  - agents/soc/grounding/index.md
  - agents/auditor/methodology.md
  - agents/investigator/methodology.md
  - agents/siem-emission-discipline.md
  - agents/clarification-pattern.md
author-status: reviewed
summary: Security posture review workflow
primary-command: /z-soc
known-runtimes:
  - codex
  - devin
  - claude
required-reads:
  - agents/soc/prompt.md
  - agents/soc/harness.md
  - agents/soc/grounding/index.md
  - agents/auditor/methodology.md
  - agents/investigator/methodology.md
  - agents/siem-emission-discipline.md
  - agents/clarification-pattern.md
supporting-scripts:
---

# Zscaler SOC Workflow

Load and follow the files listed in `required-reads`.

Use this workflow for security posture review of tenant configuration,
telemetry, and access state. Parse scope, subtype, and threat model. Ground
before reasoning, apply the relevant subtype check-set, and output a posture
register grouped by severity.

Do not change tenant state. If scope is ambiguous, ask one targeted clarifying
question.
