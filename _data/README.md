# `_data/` — fork-customization and runtime data

Single home for everything that becomes per-fork or per-tenant. The skill-internal docs (methodologies, playbooks, registers) live under `references/_meta/`; runtime data (tenant snapshots, script outputs, fork-specific IaC) lives here.

## Subdirectories

### `_data/iac/`

**Fork-customization placeholder for production Infrastructure-as-Code.** Empty in the public upstream skill. Each fork populates this with their org's actual deployed IaC for Zscaler resources — Terraform, CloudFormation, Pulumi, whatever the org uses.

The skill's vendored reference IaC lives separately at `vendor/terraform-provider-zia/`, `vendor/terraform-provider-zpa/`, `vendor/terraform-provider-ztc/` — those show *one valid way* to deploy each resource per Zscaler's published modules. When `_data/iac/` is populated, agents treat it as **production truth** for "how is X actually deployed in our environment" while vendor IaC stays useful for "what's possible / what fields exist."

See [`./iac/README.md`](./iac/README.md) for the full convention, structure options, and sanitization guidance.

### `_data/logs/`

Script-output dumping ground. Gitignored except `.gitkeep`. Files written here:

- `_data/logs/issues-new.md` — `scripts/issue-watch.py` weekly digest output
- `_data/logs/issue-watch-state.json` — `scripts/issue-watch.py` cursor state
- `_data/logs/asymmetry-candidates.md` — `scripts/find-asymmetries.py` output
- `_data/logs/hygiene-digest.md` — `scripts/check-hygiene.py --digest` output

No subdir convention — flat. Scripts that want their own scratch namespace can create subdirs at will (e.g., `_data/logs/sweeps/<date>/`).

### `_data/snapshot/`

**Tenant config dumps for offline analysis.** Gitignored except `.gitkeep`.
The public scripts use a product-first layout:

```
_data/snapshot/
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

`scripts/snapshot-refresh.py` records the selected `ZSCALER_CLOUD` in
`_manifest.json`; it does not create per-cloud directories.

`scripts/snapshot-refresh.py` writes here. `scripts/simulate-policy.py` and other config-replay tools read from here.

**Multi-tenant / multi-cloud forks** can add a private overlay such as
`_data/snapshot/<tenant>/zia/...` or `_data/snapshot/<cloud>/zia/...`, but
that is not the public repo convention. If a fork adds such an overlay, update
its local agent prompts and scripts to match.

### `_data/incidents/`

**Incident artifacts and post-mortems.** Each incident gets its own dir: `<YYYY-MM-DD>-<slug>/` containing `journal.md` (the discovery journal from `/z-investigator`), `timeline.md` (chronological events), `postmortem.md` (root cause + lessons), and `evidence/` (raw artifacts — CI logs, command output, API dumps; gitignored by default).

**Default-private posture**: `_data/incidents/*` is gitignored except for `README.md` and `.gitkeep`. Engineers explicitly opt-in to publish a skill-internal incident by adding `!`-overrides per-incident. Internal forks are expected to override the gitignore so incident artifacts can be committed there for institutional memory.

See [`./incidents/README.md`](./incidents/README.md) for the full convention.

## Privacy

Everything under `_data/` (other than `iac/README.md` and `.gitkeep` files) is gitignored by default. Forks that want to commit `iac/` content do so deliberately by adjusting `.gitignore`. **Tenant snapshots and operational logs should generally not be committed**, even to private forks, unless the org has explicit guidance otherwise (see `iac/README.md` § Sanitization).

## Why this dir exists

Top-level cleanliness. Before consolidation, `iac/`, `logs/`, and `snapshot/` were three separate top-level dirs encoding three different but related concepts. Consolidating mirrors the `_meta/` pattern under `references/`: anything not under `_data/` is content/infrastructure; anything under `_data/` is fork/tenant/runtime.
