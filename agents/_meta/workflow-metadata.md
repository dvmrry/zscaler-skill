---
topic: "workflow-metadata"
title: "Workflow metadata"
content-type: reference
last-verified: "2026-05-18"
confidence: medium
source-tier: practice
sources:
  - "agents/_meta/workflow-artifacts.md"
  - "agents/_meta/runtime-adapters.md"
  - "agents/investigator/workflow.md"
  - "scripts/check-workflow-metadata.mjs"
author-status: draft
---

# Workflow metadata

A workflow metadata file records the command, required reads, optional reads,
supporting scripts, and maintained adapter runtimes for a workflow.

The metadata lives beside the canonical workflow:

- `agents/<workflow>/workflow.md` — human-readable workflow metadata with YAML
  frontmatter.

Runtime-specific files under `.claude/`, `.windsurf/`, or future adapter roots
may add local loading or UI instructions. They should point back to the
workflow metadata so the shared workflow shape stays easy to check.

## Metadata fields

Use only portable concepts:

- `id`
- `title`
- `summary`
- `primary-command`
- `known-runtimes`
- `required-reads`
- `optional-reads`
- `supporting-scripts`

`required-reads` is the workflow bootstrap contract: files that must be loaded
before the role answers. If a role has `agents/<role>/grounding/index.md`, that
index belongs in `required-reads`; it is the role-level grounding entrypoint.
Child grounding files, such as investigator symptom cards, remain conditional
and are loaded only when their trigger applies. `optional-reads` is for other
conditional workflow support files that must exist and be available when their
trigger applies.

Grounding describes public domain discipline, evidence framing, and
context-loading maps for reasoning. Workflow metadata describes which
agent-control files the runtime must load to execute the role correctly.

## Validator scope

`scripts/check-workflow-metadata.mjs` checks required metadata fields,
referenced read/script paths, optional read paths, and known adapter pointers.
