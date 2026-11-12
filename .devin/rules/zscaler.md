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
truth comes from the knowledge graph (read the spine under `references/_meta/spine/`, then the text files of the subjects and log types you picked under `references/_meta/text/`, all with your file and search tools, which need no approval; then once per answer one bare `node scripts/kb.mjs read --company <ids>` from the repo root for company records (and a second only for the records it lists by line that the answer needs, all their IDs in that call), skipped for the rest of the conversation once it says no overlay is configured, since each shell command needs approval), then the overlay's IaC, then live read-only `zscalerctl`. Do not read `vendor/` unless
the loaded prompt or current question specifically requires it.
