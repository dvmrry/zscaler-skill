# `_data/` — replaceable runtime data mount

Single home for everything that becomes per-fork or per-tenant. The
skill-internal docs (methodologies, playbooks, registers) live under
`references/_meta/`; runtime data (tenant snapshots, script outputs,
fork-specific IaC) lives here.

The public upstream ships a minimal `_data` skeleton. Private or internal
deployments may replace `_data` with an overlay repository, submodule, or local
mount that follows the same directory contract. Public upstream does not ship
tenant data.

Expected top-level directories:

- `_data/cases/`
- `_data/schemas/`
- `_data/snapshot/`
- `_data/iac/`

Run the public contract check after replacing or mounting `_data`:

```bash
node scripts/check-data-contract.mjs
```

The checker verifies the directory shape, reports whether `_data` appears to be
a submodule, and warns when the skeleton is empty enough that snapshot-backed
or tenant-schema-backed reasoning will be unavailable.

## Subdirectories

### `_data/iac/`

**Fork-customization placeholder for production Infrastructure-as-Code.** Empty in the public upstream skill. Each fork populates this with their org's actual deployed IaC for Zscaler resources — Terraform, CloudFormation, Pulumi, whatever the org uses.

The skill's vendored reference IaC lives separately at `vendor/terraform-provider-zia/`, `vendor/terraform-provider-zpa/`, `vendor/terraform-provider-ztc/` — those show *one valid way* to deploy each resource per Zscaler's published modules. When `_data/iac/` is populated, agents treat it as **production truth** for "how is X actually deployed in our environment" while vendor IaC stays useful for "what's possible / what fields exist."

See [`./iac/README.md`](./iac/README.md) for the full convention, structure options, and sanitization guidance.

### `_data/schemas/`

Runtime schema, query-skeleton, and generated-report workspace. Gitignored
except `.gitkeep`.

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

**Tenant config dumps for offline analysis.** Gitignored except `.gitkeep`.
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

**Default-private posture**: `_data/cases/*` is gitignored except for `README.md`
and `.gitkeep`. Engineers explicitly opt-in to publish a skill-internal case by
adding `!`-overrides per-case. Internal forks are expected to override the
gitignore so case artifacts can be committed there for institutional memory.

See [`./cases/README.md`](./cases/README.md) for the full convention.

## Privacy

Everything under `_data/` (other than tracked README files and `.gitkeep` files)
is gitignored by default. Forks that want to commit `iac/`, `schemas/`, or
case content do so deliberately by adjusting `.gitignore`. **Tenant snapshots
and raw operational logs should generally not be committed**, even to private
forks, unless the org has explicit guidance otherwise (see `iac/README.md` §
Sanitization).

Release artifacts may pre-populate `_data` from a private source. Public
upstream does not ship tenant data.

## Why this dir exists

Top-level cleanliness. Before consolidation, `iac/`, `logs/` (now
`schemas/`), and `snapshot/` were three separate top-level dirs encoding three
different but related concepts. Consolidating mirrors the `_meta/` pattern under
`references/`: anything not under `_data/` is content/infrastructure; anything
under `_data/` is fork/tenant/runtime.
