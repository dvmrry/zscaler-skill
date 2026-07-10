---
id: zscaler-skill-setup
title: Zscaler Skill Setup
role: setup
artifact: workflow
content-type: reference
last-verified: "2026-07-10"
confidence: high
sources:
  - agents/setup/prompt.md
  - scripts/setup-data-mount.mjs
  - scripts/check-data-contract.mjs
  - scripts/runtime-data-path.mjs
  - scripts/prepare-overlay-submission.mjs
author-status: reviewed
summary: Select, set up, verify, and resolve a runtime data mount
primary-command: "@zscaler-skill-setup"
known-runtimes:
  - codex
required-reads:
  - agents/setup/prompt.md
supporting-scripts:
  - scripts/setup-data-mount.mjs
  - scripts/check-data-contract.mjs
  - scripts/runtime-data-path.mjs
  - scripts/prepare-overlay-submission.mjs
---

# Zscaler Skill Setup Workflow

Load and follow the files listed in `required-reads`.

Use this workflow when setting up or repairing the runtime-data mount. `_data`
is the default mount path, but committed `zscaler-skill-runtime.json` may set a
different shared mount path and tracking mode. A downstream installation may
select another committed runtime config with `ZSCALER_SKILL_RUNTIME_CONFIG` or
`--runtime-config`; selection replaces the root config rather than merging with
it. Local `zscaler-skill-setup.json` (or a file selected with
`ZSCALER_SKILL_SETUP_CONFIG`) is for private bootstrap/source settings and
workstation-only overrides. Explicit flags override setup config, which
overrides runtime config, which overrides defaults. An explicitly selected
missing or malformed config is an error. The public/local default is
`runtimeData.tracking: "ignored"`. Private work mirrors that intentionally
commit runtime data may set tracking to `"tracked"`. Collect inputs, print the
exact command, run the deterministic helper, then run the data-contract check.
Keep private source and overlay repository URLs out of committed runtime files.

Use the overlay submission helper only when the user explicitly asks to prepare
runtime artifacts for a separate overlay repository. The preferred private
work-mirror model is to commit the runtime-data mount directly in the work
mirror instead.

Supporting scripts:

- `scripts/setup-data-mount.mjs`
- `scripts/check-data-contract.mjs`
- `scripts/runtime-data-path.mjs`
- `scripts/prepare-overlay-submission.mjs`
