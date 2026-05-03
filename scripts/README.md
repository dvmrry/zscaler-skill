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

## Convention

- **Shebang**: `#!/usr/bin/env -S uv run --quiet --script`
- **PEP 723 block**: declares `requires-python` and `dependencies`
- **Stdlib-only scripts** still use the uv shebang (with `dependencies = []`) for consistency — direct invocation works the same way regardless of whether deps are external.
- **Library files** (no shebang) are imported by other scripts: `agent_patterns.py`, `policy_simulator.py`.
- **Bash scripts** (`check-citations.sh`, `check-staleness.sh`, etc.) are direct-invokable (`./scripts/<name>.sh`).

## What's here

| Category | Scripts |
|---|---|
| **Hygiene / CI** | `check-hygiene.py`, `check-citations.sh`, `check-doc-links.py`, `check-orphans.py`, `check-staleness.sh`, `check-vendor-drift.py`, `check-scrape-freshness.py` |
| **Eval suite** | `run-evals.py` |
| **Tenant API operations** | `access-check.py`, `connector-health.py`, `diagnose-tenant.py`, `sandbox-check.py`, `snapshot-refresh.py`, `ssl-audit.py`, `url-lookup.py`, `zpa-app-check.py` |
| **Reasoning helpers** | `agent_patterns.py` (lib), `policy_simulator.py` (lib), `simulate-policy.py`, `ab-test-prompt.py`, `find-asymmetries.py` |
| **Maintenance** | `issue-watch.py`, `refresh-postman.sh`, `refresh-automate-zscaler.sh`, `snapshot-refresh.py`, `splunk-query.sh` |
| **Build** | `render-skill-pdf.py` |

## Aggregated dependencies

Listed in [`../pyproject.toml`](../pyproject.toml) under `[project.optional-dependencies] scripts`. Mirrors the union of per-script PEP 723 declarations for discoverability.

Currently used:

- `pyyaml>=6` — frontmatter parsing
- `zscaler-sdk-python>=1.7` — SDK-calling scripts
- `httpx>=0.27` — async HTTP (issue-watch)
- `markdown>=3.5`, `pymdown-extensions>=10` — PDF rendering

## When to add a new script

- Use the uv-script shebang
- Declare deps in PEP 723 inline metadata
- If introducing a new third-party dep, add it to `pyproject.toml` `[project.optional-dependencies] scripts` for aggregated visibility
- Make it executable: `chmod +x scripts/<name>.py`
