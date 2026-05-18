# `_data/` runtime data contract

Single home for everything that becomes per-fork or per-tenant. The
skill-internal docs (methodologies, playbooks, registers) live under
`references/_meta/`; runtime data (tenant snapshots, script outputs,
fork-specific IaC) lives here.

Public upstream does not track `_data/`; it tracks this contract instead.
Runtime deployments create `_data/` from a local checkout, copied data
directory, or explicit submodule that follows the same directory shape.

Expected top-level directories:

- `_data/cases/`
- `_data/schemas/`
- `_data/snapshot/`
- `_data/iac/`

Run the public contract check after creating or replacing `_data`:

```bash
node scripts/check-data-contract.mjs
```

The checker verifies the directory shape, reports whether `_data` appears to be
a submodule, and warns when runtime data is missing enough that snapshot-backed
or tenant-schema-backed reasoning will be unavailable.

To create `_data` from a user-supplied runtime-data source, use the generic
setup helper:

```bash
node scripts/setup-data-mount.mjs \
  --data-url <git-url-or-local-path> \
  --data-ref main \
  --mode checkout
```

Mode `checkout` clones a data repository or local path into `_data` without
registering a parent-repo submodule. Use `--mode copy` for a materialized copy,
or `--mode submodule` only when a release/build flow deliberately wants a
pinned `_data` gitlink. The helper refuses to replace populated `_data`
contents unless `--force` is explicit, then runs the same public contract check.

If a root-level `zscaler-skill-setup.json` exists, the helper reads setup
defaults from it. Use [`../../zscaler-skill-setup.example.json`](../../zscaler-skill-setup.example.json)
as the public-safe template. The real config is gitignored because it may
contain a private data source URL.

## Subdirectories

### `_data/iac/`

**Fork-customization placeholder for production Infrastructure-as-Code.** Empty in the public upstream skill. Each fork populates this with their org's actual deployed IaC for Zscaler resources — Terraform, CloudFormation, Pulumi, whatever the org uses.

The skill's vendored reference IaC lives separately at `vendor/terraform-provider-zia/`, `vendor/terraform-provider-zpa/`, `vendor/terraform-provider-ztc/` — those show *one valid way* to deploy each resource per Zscaler's published modules. When `_data/iac/` is populated, agents treat it as **production truth** for "how is X actually deployed in our environment" while vendor IaC stays useful for "what's possible / what fields exist."

See [`./iac.md`](./iac.md) for the full convention, structure options, and sanitization guidance.

### `_data/schemas/`

Runtime schema, query-skeleton, and generated-report workspace. Ignored in the
public repo.

This directory is for artifacts that make vendor-specific log/query work easier:
deconstructed log schemas, field maps, query skeletons, and generated reports
that are useful to agents but are not reference docs themselves. It is **not**
where raw incident logs should live; raw evidence belongs under the operative
case directory's `evidence/` folder.

Current generated files written here:

- `_data/schemas/issues-new.md` — `scripts/issue-watch.py` weekly digest output
- `_data/schemas/issue-watch-state.json` — `scripts/issue-watch.py` cursor state
- `_data/schemas/asymmetry-candidates.md` — `scripts/find-asymmetries.py` output
- `_data/schemas/hygiene-digest.md` — `scripts/check-hygiene.py --digest` output

No subdir convention — flat. Scripts that want their own scratch namespace can create subdirs at will (e.g., `_data/schemas/sweeps/<date>/`).

### `_data/snapshot/`

**Tenant config dumps for offline analysis.** Ignored in the public repo.
The public scripts use a cloud-first layout:

```
_data/snapshot/
└── <cloud>/
    ├── zia/
    │   ├── url-categories.json
    │   ├── url-filtering-rules.json
    │   └── ...
    ├── zpa/
    │   ├── app-segments.json
    │   ├── server-groups.json
    │   └── ...
    ├── zcc/
    │   ├── forwarding-profiles.json
    │   └── ...
    └── _manifest.json
```

`scripts/snapshot-refresh.py` uses `--cloud`, `ZSCALER_CLOUD`, or `default`
as the `<cloud>` slug and records that slug in `_manifest.json`.

`scripts/snapshot-refresh.py` writes here. `scripts/simulate-policy.py` and other config-replay tools read from here.

**Multi-tenant / multi-cloud forks** should keep one directory per tenant cloud
or tenant slug under `_data/snapshot/`. Do not mix multiple clouds into a
product-first directory.

### `_data/cases/`

**Saved investigation, review, and incident artifacts.** Each case gets its own
dir: `<YYYY-MM-DD>-<slug>/`. Every case has at least `journal.md` (the discovery
journal from `/z-investigator` or a related workflow). Incident-shaped cases can
also contain `timeline.md` (chronological events), `postmortem.md` (root cause +
lessons), and `evidence/` (raw artifacts — CI logs, command output, API dumps;
gitignored by default).

**Default-private posture**: `_data/cases/*` is ignored in the public repo.
Engineers explicitly opt in to publishing a skill-internal case by adding
`!`-overrides per-case. Forks can override the gitignore when case artifacts
are safe to commit for institutional memory.

See [`./cases.md`](./cases.md) for the full convention.

## Privacy

Everything under `_data/` is gitignored by default. Forks that want to commit
`iac/`, `schemas/`, or case content do so deliberately by adjusting
`.gitignore`. **Tenant snapshots and raw operational logs should generally not
be committed**, even to private forks, unless the org has explicit guidance
otherwise (see `iac.md` §
Sanitization).

Automation may pre-populate `_data` before use. Public upstream does not ship
tenant data.

## Why this dir exists

Top-level cleanliness. Before consolidation, `iac/`, `logs/` (now
`schemas/`), and `snapshot/` were three separate top-level dirs encoding three
different but related concepts. Consolidating mirrors the `_meta/` pattern under
`references/`: anything not under `_data/` is content/infrastructure; anything
under `_data/` is fork/tenant/runtime.
