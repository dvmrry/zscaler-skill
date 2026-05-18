---
role: setup
artifact: prompt
title: "Zscaler skill setup workflow"
content-type: prompt
last-verified: "2026-05-17"
confidence: high
source-tier: practice
sources:
  - "scripts/setup-data-mount.mjs"
  - "scripts/check-data-contract.mjs"
  - "docs/data-contract/README.md"
dependencies: []
adapters: []
author-status: draft
---

# Zscaler Skill Setup

Use this workflow when setting up or repairing the repo's `_data` runtime-data
mount. Keep the setup operation deterministic: collect inputs, print the exact
command, run the helper, then run the contract check. Do not reimplement mount
logic in prose.

## Inputs

Collect these values before running commands:

- **Repo root**: default to the current repository root.
- **Data URL or local path**: required. Do not invent a default.
- **Mode**: one of `auto`, `checkout`, `copy`, or `submodule`. Default to
  `checkout` unless the user explicitly needs a materialized copy or a parent
  repo submodule.
- **Data ref**: optional, default `main`.
- **Config file**: optional. If `zscaler-skill-setup.json` exists at the repo
  root, the helper reads it automatically. CLI flags override config values.
- **Force**: optional. Use only when the user confirms replacing populated
  `_data` content.

## Procedure

1. State the resolved inputs.
2. Print the exact setup command before running it.
3. Run `scripts/setup-data-mount.mjs`.
4. Run `scripts/check-data-contract.mjs`.
5. Report the resulting mode, errors, warnings, and remaining capability gaps.

The command shape is:

```bash
node scripts/setup-data-mount.mjs \
  --root <repo-root> \
  --config <optional-config-json> \
  --data-url <git-url-or-local-path> \
  --data-ref <ref> \
  --mode <auto|checkout|copy|submodule>
```

Then verify:

```bash
node scripts/check-data-contract.mjs --root <repo-root>
```

Add `--force` to the setup command only after explicit confirmation that
existing populated `_data` content may be replaced.

When a root-level `zscaler-skill-setup.json` exists, this shorter command is
valid:

```bash
node scripts/setup-data-mount.mjs --root <repo-root>
```

The public example file is `zscaler-skill-setup.example.json`. The real
`zscaler-skill-setup.json` is ignored because it may contain private data source
URLs.

## Capability Report

After the contract check, distinguish setup state from live integration state:

- No `_data/snapshot` content means snapshot-backed reasoning is unavailable.
- No `_data/schemas` content means tenant schema hints are unavailable.
- Missing cloud, SIEM, or Zscaler credentials may block live refresh or live
  validation, but they do not mean the `_data` mount contract failed.

Do not print secrets. Do not record private URLs in committed files. If the data
source is private, keep it in the user's command or local root config.
