---
trigger: model_decision
description: Use for Zscaler, ZIA, ZPA, ZCC, ZDX, ZIdentity, Cloud Connector, Zscaler logs, policy evaluation, URL filtering, app segments, tenant snapshots, Zscaler API, SDK, or Terraform questions.
---

# Zscaler Skill Loader

When the user asks a Zscaler-related question, use your file-read tool to load
`agents/zscaler/workflow.md` before answering, then follow that workflow.

For procedural tasks, prefer the existing Windsurf workflows:

- Troubleshooting with symptom, affected scope, and timeframe: `/z-investigator`
- Security posture review: `/z-soc`
- Capacity or scaling review: `/z-architect`
- Skill/reference audit: `/z-auditor`
- Incident retrospective / postmortem after a journal exists: `/z-retro`
- Citation-backed reference expansion: `/z-researcher`
- `_data` runtime-data setup or repair: `zscaler-skill-setup`

Do not answer Zscaler policy, API, log, or tenant-specific questions from
memory. Load only the files needed for the current question. Tenant-specific
truth lives in `_data/snapshot/` and `_data/iac/`. Do not read `vendor/` unless
the loaded prompt or current question specifically requires it.
