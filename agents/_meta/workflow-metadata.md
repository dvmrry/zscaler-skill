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

A workflow metadata file records the command, required reads, supporting
scripts, and maintained adapter runtimes for a workflow.

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
- `supporting-scripts`

Keep adapter details out of this metadata except for file paths used by the
metadata check.

## Validator scope

`scripts/check-workflow-metadata.mjs` checks required metadata fields,
referenced read/script paths, and known adapter pointers.
