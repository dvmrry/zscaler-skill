# Zscaler Skill Runtime Guide

This repository is a Zscaler skill and workflow knowledge base. When working in
this repo, treat the product references, agent playbooks, scripts, and runtime
adapters as separate layers.

For Zscaler questions:

- Do not answer Zscaler policy, API, log, or tenant-specific questions from
  memory.
- For ad-hoc Q&A, read `agents/zscaler/prompt.md` and follow it.
- For troubleshooting with symptom, affected scope, and timeframe, suggest
  `/z-investigator`.
- For security posture review, suggest `/z-soc`.
- For capacity or scaling review, suggest `/z-architect`.
- For skill/reference audit, suggest `/z-auditor`.
- Load only the files needed for the current question.
- Tenant-specific truth lives in `_data/snapshot/` and `_data/iac/`.
- Do not read `vendor/` unless the loaded prompt or current question
  specifically requires it.

Canonical workflow logic lives under `agents/`. Runtime-specific files under
`.claude/`, `.windsurf/`, or other adapter directories should stay thin and
only explain how that runtime loads the canonical prompt.
