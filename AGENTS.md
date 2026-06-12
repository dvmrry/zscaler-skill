# Zscaler Skill Runtime Guide

This repository is a Zscaler skill and workflow knowledge base. When working in
this repo, treat the product references, agent playbooks, scripts, and runtime
adapters as separate layers.

Canonical workflow logic lives under `agents/`. Portable Agent Skills under
`.agents/skills/` are open-standard loaders for those canonical workflows.
Runtime-specific files under `.claude/`, `.devin/`, or other adapter
directories should stay thin where the runtime can follow the canonical
workflow directly. Adapters may reinforce a canonical harness when a weaker
runtime needs explicit checkpoint or output-shape discipline, but the harness
contract belongs under `agents/`.

For Zscaler questions:

- Do not answer Zscaler policy, API, log, or tenant-specific questions from
  memory.
- For ad-hoc Q&A, read `agents/zscaler/prompt.md` and follow it.
- For setup or repair of the `_data` runtime-data mount, use the
  `zscaler-skill-setup` skill.
- For troubleshooting with symptom, affected scope, and timeframe, use the
  `zscaler-investigator` skill or suggest `/z-investigator`.
- For security posture review, use the `zscaler-soc` skill or suggest `/z-soc`.
- For capacity or scaling review, suggest `/z-architect`.
- For skill/reference audit, suggest `/z-auditor`.
- For incident retrospectives / postmortems after a journal exists, suggest
  `/z-retro`.
- For citation-backed reference expansion, suggest `/z-researcher`.
- Load only the files needed for the current question.
- Tenant-specific truth lives in `_data/snapshot/` and `_data/iac/`.
- Do not read `vendor/` unless the loaded prompt or current question
  specifically requires it.

Downstream installations may generate, replace, or omit runtime adapter files.
Do not treat generated adapter files as the source of truth.
