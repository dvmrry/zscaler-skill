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
  - "scripts/prepare-overlay-submission.mjs"
  - "docs/data-contract/README.md"
dependencies: []
adapters: []
author-status: draft
---

# Zscaler Skill Setup

Use this workflow when setting up or repairing the repo's runtime-data mount.
The default mount path is `_data`, but a local `zscaler-skill-setup.json` may
set `runtimeData.mountPath` to another relative path. Keep the setup operation
deterministic: collect inputs, print the exact command, run the helper, then
run the contract check. Do not reimplement mount logic in prose.

## Inputs

Collect these values before running commands:

- **Repo root**: default to the current repository root.
- **Data URL or local path**: required. Do not invent a default.
- **Mode**: one of `auto`, `checkout`, `copy`, or `submodule`. Default to
  `checkout` unless the user explicitly needs a materialized copy or a parent
  repo submodule.
- **Data ref**: optional, default `main`.
- **Mount path**: optional, default `_data`. If a root config sets
  `runtimeData.mountPath`, use that configured mount path in commands and path
  examples.
- **Tracking**: optional, default `ignored`. Use `tracked` only for a private
  work mirror that intentionally commits the runtime-data mount in this repo.
- **Config file**: optional. If `zscaler-skill-setup.json` exists at the repo
  root, the helper reads it automatically. CLI flags override config values.
- **Force**: optional. Use only when the user confirms replacing populated
  runtime-data content.

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
  --mount-path <optional-runtime-data-path> \
  --tracking <ignored|tracked> \
  --data-url <git-url-or-local-path> \
  --data-ref <ref> \
  --mode <auto|checkout|copy|submodule>
```

Then verify:

```bash
node scripts/check-data-contract.mjs --root <repo-root> --mount-path <runtime-data-path>
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

## Work Mirror Tracking

The preferred private-mirror model is to commit the runtime-data mount directly
to the work mirror. In that case, the root config should set:

```json
{
  "runtimeData": {
    "mountPath": "tenant-data",
    "tracking": "tracked"
  }
}
```

This mode tells the checker not to require a local ignore for the mount. If
`tracking` is omitted or set to `ignored`, setup protects custom mounts by
adding the mount path to the local Git exclude before writing runtime data.

## Overlay Submission

Legacy/optional path only.

Use this only when the user explicitly wants to prepare runtime-data artifacts
for a configured overlay repository. Submission is opt-in. Do not push or
create a PR unless the user asks for that follow-up.

Collect:

- **Artifact path**: one or more selected paths under `<mount>/cases`,
  `<mount>/schemas`, or `<mount>/iac`.
- **Overlay repo URL or local path**: from `zscaler-skill-setup.json` or the
  `--repo-url` flag.
- **Approval**: required. The helper expects `--approve`.

Command shape:

```bash
node scripts/prepare-overlay-submission.mjs \
  --root <repo-root> \
  --case-path <mount>/cases/<case-slug> \
  --approve
```

The helper validates allowed roots, scans for obvious secret material, copies
selected artifacts into a temporary overlay checkout, commits to a named branch,
and prints JSON with status, branch, files, warnings, and next action.
Input paths use runtime mount paths; submitted overlay paths are relative to
the overlay repo root, for example `_data/cases/foo` or
`tenant-data/cases/foo` becomes `cases/foo`.

## Capability Report

After the contract check, distinguish setup state from live integration state:

- No `<mount>/snapshot` content means snapshot-backed reasoning is unavailable.
- No `<mount>/schemas` content means tenant schema hints are unavailable.
- Missing cloud, SIEM, or Zscaler credentials may block live refresh or live
  validation, but they do not mean the `_data` mount contract failed.

Do not print secrets. Do not record private URLs in committed files. If the data
source is private, keep it in the user's command or local root config.
