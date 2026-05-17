# `scripts/` — skill tooling

All Python scripts use [uv](https://docs.astral.sh/uv/) with [PEP 723 inline script metadata](https://peps.python.org/pep-0723/). Each script declares its own deps in a `# /// script` block at the top of the file; uv resolves and caches them on first run. No project-level install needed.

## Running

Direct invocation (uv reads the inline metadata):

```bash
./scripts/check-hygiene.py
./scripts/check-orphans.py
./scripts/run-evals.py list
```

Optionally install all script deps once via `uv sync --extra scripts` (reads the aggregated list from the top-level `pyproject.toml`).

The public support boundary is functional, snapshot-backed tooling plus
reference hygiene. Live-tenant diagnostic scaffolds are private-overlay
templates: they exit by default and should only be run with `--allow-scaffold`
while finishing a tenant-specific implementation.

## Convention

- **Shebang**: `#!/usr/bin/env -S uv run --quiet --script`
- **PEP 723 block**: declares `requires-python` and `dependencies`
- **Stdlib-only scripts** still use the uv shebang (with `dependencies = []`) for consistency — direct invocation works the same way regardless of whether deps are external.
- **Library files** (no shebang) are imported by other scripts: `agent_patterns.py`, `policy_simulator.py`.
- **Bash scripts** (`check-citations.sh`, `check-staleness.sh`, etc.) are direct-invokable (`./scripts/<name>.sh`).
- **Node helpers** use only Node standard libraries when they exist to support
  runtime workflow gates without adding a project install step.

## What's here

| Category | Scripts |
|---|---|
| **Hygiene / CI** | `check-hygiene.py`, `check-citations.sh`, `check-citation-density.py` (density advisory; source-line audit + citation inventory regression strict in CI), `check-agent-skills.py` (portable Agent Skill contract and adapter-shape check), `check-doc-links.py`, `check-orphans.py`, `check-workflow-evals.py`, `check-vendor-drift.py`, `check-scrape-freshness.py`, `maintenance-digest.py`, `vendor-impact-summary.py` |
| **Manual hygiene** | `check-staleness.sh`, `check-data-contract.mjs`, `setup-data-mount.mjs` |
| **Eval suite** | `run-evals.py` |
| **Tenant API operations** | `diagnose-tenant.py`, `snapshot-refresh.py`, `url-lookup.py` |
| **Private-overlay scaffolds** | `access-check.py`, `connector-health.py`, `sandbox-check.py`, `ssl-audit.py`, `zpa-app-check.py` |
| **Reasoning helpers** | `agent_patterns.py` (lib), `policy_simulator.py` (lib), `simulate-policy.py`, `find-asymmetries.py`, `ab-test-prompt.py` (experimental placeholder), `investigator-artifacts.mjs` |
| **Maintenance** | `issue-watch.py`, `maintenance-digest.py`, `vendor-impact-summary.py`, `refresh-postman.sh`, `refresh-automate-zscaler.sh`, `snapshot-refresh.py`, `convert-pdf-sources.sh`, `scaffold_guard.py`, `splunk-query.sh` (stub) |
| **Build** | `render-skill-pdf.py` |

## Aggregated dependencies

Listed in [`../pyproject.toml`](../pyproject.toml) under `[project.optional-dependencies] scripts`. Mirrors the union of per-script PEP 723 declarations for discoverability.

Currently used:

- `pyyaml>=6` — frontmatter parsing
- `zscaler-sdk-python>=1.7` — SDK-calling scripts
- `httpx>=0.27` — GitHub API calls (issue-watch and maintenance digest sticky issues)
- `markdown>=3.5`, `pymdown-extensions>=10` — PDF rendering

## Expected first-run output

A successful `snapshot-refresh.py` run against a small tenant looks like:

```text
$ ./scripts/snapshot-refresh.py --zia-only
zia:
  ✓ url-categories: 142 records -> _data/snapshot/zs2/zia/url-categories.json
  ✓ url-filtering-rules: 37 records -> _data/snapshot/zs2/zia/url-filtering-rules.json
  ✓ cloud-app-control-rules: 12 records -> _data/snapshot/zs2/zia/cloud-app-control-rules.json
  ✓ ssl-inspection-rules: 8 records -> _data/snapshot/zs2/zia/ssl-inspection-rules.json
  ✓ advanced-settings: 1 records -> _data/snapshot/zs2/zia/advanced-settings.json

manifest -> _data/snapshot/zs2/_manifest.json
```

The public snapshot layout is cloud-first: `_data/snapshot/<cloud>/zia/`,
`_data/snapshot/<cloud>/zpa/`, and `_data/snapshot/<cloud>/zcc/`. The manifest
records the selected cloud or tenant slug.

`simulate-policy.py` reads the cloud-first layout by default. Pass
`--cloud <name>` or set `ZSCALER_CLOUD` to select a specific snapshot. Legacy
product-first snapshots remain a read fallback for older local exports.
Pass `--snapshot-root <path>` when the snapshot directory is not
`_data/snapshot`.

When a reference doc intentionally adds, removes, or restructures visible
`Source:` coverage, regenerate the citation inventory in the same PR:

```bash
./scripts/check-citation-density.py --write-citation-inventory references/_meta/citation-inventory.json
```

Semantic source coverage is advisory and surfaces prose that names evidence
families without a matching section-level `Source:` family. For example, if a
paragraph says "the underlying SDK checks..." but the section source list cites
only help docs, run:

```bash
./scripts/check-citation-density.py --audit-source-quality --include-semantic
```

Portable Agent Skill contract checks validate repo-local skill metadata,
canonical `agents/**` loader paths, routing-doc mentions, and obvious runtime
adapter drift before downstream runtime testing:

```bash
./scripts/check-agent-skills.py
```

The `_data` mount contract check verifies the public skeleton or a private
overlay/submodule shape without reading tenant contents:

```bash
node scripts/check-data-contract.mjs
```

To replace the public `_data` skeleton with a user-supplied data source:

```bash
node scripts/setup-data-mount.mjs \
  --data-url <git-url-or-local-path> \
  --data-ref main \
  --mode auto
```

Mode `auto` copies local directories and adds other URLs as a git submodule.
Use `--mode submodule` when a local repository path should be mounted as a real
`_data` submodule instead of copied. The setup helper refuses to replace
populated `_data` unless `--force` is explicit, removes tracked skeleton files
through git before submodule setup, and runs the data contract check after
setup.

Missing required directories are errors. Empty public-skeleton directories are
warnings, because the upstream repo intentionally does not ship tenant data.

Lines prefixed `!` indicate a per-resource fetch failure; the run continues.
Lines prefixed `-` indicate that the SDK surface for that resource was not
found, likely due to SDK version lag; those do not block the rest of the run.

## When to add a new script

- Use the uv-script shebang
- Declare deps in PEP 723 inline metadata
- If introducing a new third-party dep, add it to `pyproject.toml` `[project.optional-dependencies] scripts` for aggregated visibility
- Make it executable: `chmod +x scripts/<name>.py`
