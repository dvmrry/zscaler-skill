# `scripts/` — skill tooling

All Python scripts use [uv](https://docs.astral.sh/uv/) with [PEP 723 inline script metadata](https://peps.python.org/pep-0723/). Each script declares its own deps in a `# /// script` block at the top of the file; uv resolves and caches them on first run. No project-level install needed.

## Running

Common local checks:

```bash
node scripts/check-fast.mjs
./scripts/check-hygiene.py
./scripts/check-orphans.py
./scripts/run-evals.py list
```

Python scripts use uv to read their inline metadata; Node helpers use only the
standard library.

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
| **Hygiene / CI** | `check-fast.mjs` (parallel local fast gate), `check-hygiene.py`, `check-citations.sh` / `check-citations.mjs`, `check-citation-density.py` (density advisory; source-line audit + citation inventory regression strict in CI), `check-agent-skills.py` (portable Agent Skill contract and adapter-shape check), `check-workflow-metadata.mjs` (workflow metadata and adapter-reference check), `check-doc-links.py`, `check-orphans.py`, `check-workflow-evals.py`, `check-vendor-drift.py`, `check-scrape-freshness.py`, `vendor-impact-summary.py`, `find-asymmetries.py` |
| **Manual hygiene** | `check-staleness.sh`, `check-data-contract.mjs`, `setup-data-mount.mjs`, `prepare-overlay-submission.mjs` |
| **Eval suite** | `run-evals.py` |
| **Tenant API operations** | `diagnose-tenant.py`, `snapshot-refresh.py`, `url-lookup.py` |
| **Private-overlay scaffolds** | `access-check.py`, `connector-health.py`, `sandbox-check.py`, `ssl-audit.py`, `zpa-app-check.py` |
| **Reasoning helpers** | `agent_patterns.py` (lib), `policy_simulator.py` (lib), `simulate-policy.py`, `ab-test-prompt.py` (experimental placeholder), `investigator-artifacts.mjs` |
| **Maintenance** | `issue-watch.py`, `maintenance-digest.py`, `refresh-postman.sh`, `refresh-automate-zscaler.sh`, `snapshot-refresh.py`, `convert-pdf-sources.sh`, `splunk-query.sh` (stub) |
| **Libraries** | `scaffold_guard.py` |
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
adapter-reference mismatches before runtime testing:

```bash
./scripts/check-agent-skills.py
```

Run the fast local gate when iterating on workflow helpers or references:

```bash
node scripts/check-fast.mjs
```

It runs independent cheap checks in parallel and prints buffered output only
for failures, so local validation does not become a wall of interleaved logs.
The current fast gate covers workflow metadata, citation links, and the Node
helper test suite; it is a local acceleration path, not a replacement for the
full CI hygiene workflow.

Validate workflow metadata and runtime adapter pointers:

```bash
node scripts/check-workflow-metadata.mjs
```

The `_data` mount contract check verifies a runtime data mount without reading
tenant contents:

```bash
node scripts/check-data-contract.mjs
```

To create `_data` from a user-supplied data source:

```bash
node scripts/setup-data-mount.mjs \
  --data-url <git-url-or-local-path> \
  --data-ref <branch-or-tag> \
  --mode checkout
```

Use the actual branch or tag for your runtime-data source.

Mode `checkout` clones a repository or local path into `_data` without
registering a parent-repo submodule. Mode `copy` materializes a local directory
copy. Use `--mode submodule` only when a release/build flow deliberately wants
a pinned `_data` gitlink. The setup helper refuses to replace populated `_data`
unless `--force` is explicit and runs the data contract check after setup.

If `zscaler-skill-setup.json` exists at the repo root, the setup helper reads
defaults from it. CLI flags override config values. The public template is
[`../zscaler-skill-setup.example.json`](../zscaler-skill-setup.example.json);
the real config is gitignored because it may contain a private data source URL.

Missing required directories are errors. Empty runtime directories are warnings,
because snapshot-backed reasoning and tenant schema hints are unavailable.

To prepare selected runtime artifacts for a configured overlay repository:

```bash
node scripts/prepare-overlay-submission.mjs \
  --case-path _data/cases/<case-slug> \
  --approve
```

The helper validates that selected paths are under allowed `_data` roots, scans
for obvious secret material, creates a branch in a temporary overlay checkout,
commits the selected files, and prints the next `git push` command. It does not
push by default. Configure the overlay target in local
`zscaler-skill-setup.json` under `overlaySubmission`, or pass `--repo-url`.
The overlay repository is treated as the `_data` content root, so runtime paths
are copied without the `_data/` prefix (`_data/cases/foo` → `cases/foo`).

For `snapshot-refresh.py` output, lines prefixed `!` indicate a per-resource
fetch failure; the run continues. Lines prefixed `-` indicate that the SDK
surface for that resource was not found, likely due to SDK version lag; those
do not block the rest of the run.

## When to add a new script

- Use the uv-script shebang
- Declare deps in PEP 723 inline metadata
- If introducing a new third-party dep, add it to `pyproject.toml` `[project.optional-dependencies] scripts` for aggregated visibility
- Make it executable: `chmod +x scripts/<name>.py`
