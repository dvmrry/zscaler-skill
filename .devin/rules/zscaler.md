---
trigger: model_decision
description: Use for Zscaler, ZIA, ZPA, ZCC, ZDX, ZIdentity, Cloud Connector, AI Guard, ZMS, EASM, ZCell, Business Insights, Zscaler logs, policy evaluation, URL filtering, app segments, tenant IaC or live state, Zscaler API, SDK, or Terraform questions.
---

# Zscaler Skill Loader

When the user asks a Zscaler-related question, use your file-read tool to load
`agents/zscaler/workflow.md` before answering, then follow that workflow.

For procedural tasks, prefer the existing Devin workflows:

- Troubleshooting with symptom, affected scope, and timeframe: `/z-investigator`
- Security posture review: `/z-soc`
- Capacity or scaling review: `/z-architect`
- Skill/reference audit: `/z-auditor`
- Incident retrospective / postmortem after a journal exists: `/z-retro`
- Citation-backed reference expansion: `/z-researcher`
- `_data` runtime-data setup or repair: `zscaler-skill-setup`

Do not answer Zscaler policy, API, log, or tenant-specific questions from
memory. Load only the files needed for the current question. Tenant-specific
truth comes from the knowledge graph (read the spine under `references/_meta/spine/` with your file tools, then one bare `node scripts/kb.mjs read <area | subject | type#field> ...` from the repo root for the subjects and company records you picked; each shell command needs approval), then the overlay's IaC, then live read-only `zscalerctl`. Do not read `vendor/` unless
the loaded prompt or current question specifically requires it.
