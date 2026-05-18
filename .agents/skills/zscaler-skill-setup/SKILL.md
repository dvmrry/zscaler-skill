---
name: zscaler-skill-setup
description: >
  Use when setting up or repairing this repo's _data runtime-data mount,
  including mounting a user-supplied data repository or local directory,
  choosing setup-data-mount mode, and verifying the public data contract.
---

# Zscaler Skill Setup

Use this skill when the user wants help setting up or repairing `_data`.

## Canonical Workflow

Load and follow:

- `../../../agents/setup/prompt.md`

The prompt defines the input collection, command echoing, deterministic helper
execution, and post-setup capability report.

## Runtime Policy

The canonical prompt is the source of truth for setup workflow behavior.

The deterministic implementation lives in these repo-root scripts:

- `scripts/setup-data-mount.mjs`
- `scripts/check-data-contract.mjs`

Do not reimplement setup logic in the skill body. The skill is a thin loader
for the canonical setup workflow and public helper scripts.

This upstream skill must not contain private data URLs, private organization
names, or internal release defaults. If a downstream environment has preferred
defaults, keep them in a local `zscaler-skill-setup.json`, a private wrapper, or
pass them at invocation time.
