# `_data/` — fork-customization and runtime data

Single home for everything that becomes per-fork or per-tenant. The kit-internal docs (methodologies, playbooks, registers) live under `references/_meta/`; runtime data (tenant snapshots, script outputs, fork-specific IaC) lives here.

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

**Tenant config dumps for offline analysis.** Gitignored except `.gitkeep`. Real deployments split per Zscaler cloud:

```
_data/snapshot/
├── zs2/
│   ├── url-filtering-rules.json
│   └── ...
├── zs3/
│   ├── url-filtering-rules.json
│   └── ...
└── zspreview/
    └── ...
```

Each tenant lives on a specific Zscaler cloud (zs1, zs2, zs3, zspreview, zscalergov, etc.); per-cloud subdirs prevent cross-tenant snapshot collisions when a fork serves multiple tenants. The cloud name comes from the tenant's API base URL (e.g., a tenant on `zsapi.zscaler.net` is on `zs1`; on `zsapi.zscalerthree.net` is on `zs3`).

`scripts/snapshot-refresh.py` writes here. `scripts/simulate-policy.py` and other config-replay tools read from here.

**Note on path conventions in scripts**: existing scripts (e.g., `simulate-policy.py`) reference paths like `_data/snapshot/zia/url-filtering-rules.json` — that's per-product, NOT per-cloud. Real-fork operators using the per-cloud convention should adjust those paths to `_data/snapshot/<cloud>/<product>/...` or similar in their fork.

## Privacy

Everything under `_data/` (other than `iac/README.md` and `.gitkeep` files) is gitignored by default. Forks that want to commit `iac/` content do so deliberately by adjusting `.gitignore`. **Tenant snapshots and operational logs should generally not be committed**, even to private forks, unless the org has explicit guidance otherwise (see `iac/README.md` § Sanitization).

## Why this dir exists

Top-level cleanliness. Before consolidation, `iac/`, `logs/`, and `snapshot/` were three separate top-level dirs encoding three different but related concepts. Consolidating mirrors the `_meta/` pattern under `references/`: anything not under `_data/` is content/infrastructure; anything under `_data/` is fork/tenant/runtime.
