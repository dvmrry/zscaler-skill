---
id: zscaler-skill-setup
title: Zscaler Skill Setup
role: setup
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: high
sources:
  - agents/setup/prompt.md
  - scripts/setup-data-mount.mjs
  - scripts/check-data-contract.mjs
  - scripts/prepare-overlay-submission.mjs
author-status: reviewed
summary: Runtime data mount setup and repair workflow
primary-command: "@zscaler-skill-setup"
known-runtimes:
  - codex
required-reads:
  - agents/setup/prompt.md
supporting-scripts:
  - scripts/setup-data-mount.mjs
  - scripts/check-data-contract.mjs
  - scripts/prepare-overlay-submission.mjs
---

# Zscaler Skill Setup Workflow

Load and follow the files listed in `required-reads`.

Use this workflow when setting up or repairing the runtime-data mount. `_data`
is the default mount path, but committed `zscaler-skill-runtime.json` may set a
different shared mount path and tracking mode. Local `zscaler-skill-setup.json`
is for private bootstrap/source settings and workstation-only overrides. The
public/local default is `runtimeData.tracking: "ignored"`. Private work mirrors
that intentionally commit runtime data may set tracking to `"tracked"`. Collect
inputs, print the exact command, run the deterministic helper, then run the
data-contract check. Keep private data source defaults out of committed files.

Use the overlay submission helper only when the user explicitly asks to prepare
runtime artifacts for a separate overlay repository. The preferred private
work-mirror model is to commit the runtime-data mount directly in the work
mirror instead.

Supporting scripts:

- `scripts/setup-data-mount.mjs`
- `scripts/check-data-contract.mjs`
- `scripts/prepare-overlay-submission.mjs`
