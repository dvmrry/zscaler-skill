# `scripts/` — skill tooling

Python executables that need third-party packages use [uv](https://docs.astral.sh/uv/) with [PEP 723 inline script metadata](https://peps.python.org/pep-0723/). Library modules, test modules, and some stdlib-only executables intentionally omit inline metadata. The top-level `pyproject.toml` records the aggregate executable dependency set; `pytest` is test-only tooling supplied ephemerally by the full gate and CI.

## Running

Common local checks:

```bash
npm run check:fast
npm run check:full
node scripts/doctor.mjs --profile references
node scripts/check-vendor-refresh.mjs --base origin/main
./scripts/check-hygiene.py
./scripts/check-orphans.py
./scripts/run-evals.py list
```

Use the fast gate while iterating. The full gate runs all locally reproducible
required CI checks plus advisories behind one command, including the Python
checks; advisory findings remain non-blocking. Node helpers use only the
standard library. It compares reference freshness against `origin/main` by
default; set `REFERENCE_FRESHNESS_BASE` to use a different base ref.

Optionally install all executable script dependencies once via `uv sync --extra scripts` (reads the aggregated list from the top-level `pyproject.toml`). The Python regression suite still supplies `pytest` per run with `uv run --with pytest`; it is not part of the executable dependency aggregate.

The public support boundary is functional, snapshot-backed tooling plus
reference hygiene. Credentialed live-tenant diagnostics are out of scope here —
use the read-only `zscalerctl` CLI for tenant reads.

## Convention

- **Shebang**: `#!/usr/bin/env -S uv run --quiet --script`
- **PEP 723 block**: used by dependency-bearing executables to declare
  `requires-python` and `dependencies`
- **Stdlib-only executables** may use the uv shebang with an empty dependency
  list or a direct Python shebang; library and test modules omit script metadata.
- **Library files** (no shebang) are imported by other scripts:
  `agent_patterns.py` contains pure classification and error-interpretation
  helpers only, while `runtime_data.py` is the Python runtime-data path library
  kept aligned with `lib.mjs` by `runtime-data-parity.test.mjs`; credentialed
  tenant reads belong to `zscalerctl`.
- **Bash scripts** (`check-citations.sh`, `check-staleness.sh`, etc.) are direct-invokable (`./scripts/<name>.sh`).
- **Node helpers** use only Node standard libraries when they exist to support
  runtime workflow gates without adding a project install step.

## What's here

| Category | Scripts |
|---|---|
| **Hygiene / CI** | `check-full.mjs` (single mixed-toolchain pre-merge gate with CI-matching advisories), `check-fast.mjs` (parallel local and pre-push gate), `check-vendor-refresh.mjs` (one-command reference preflight, worktree impact report, and fast gate), `check-worktree-whitespace.mjs` (checks unstaged, staged, and untracked files), `check-hygiene.py`, `check-citations.sh` / `check-citations.mjs`, `check-citation-density.py` (density advisory; source-line audit + citation inventory regression strict in CI), `check-agent-skills.py` (portable Agent Skill contract and adapter-shape check), `check-workflow-metadata.mjs` (workflow metadata and adapter-reference check), `check-verified-against.py` (validates all source-pin mappings, paths, and SHA syntax plus locally available submodule commit objects; with `--base`, also proves exact changed Help/API capture sources existed at the recorded superproject pin), `check-reference-freshness.mjs` (diff-aware advisory for fresh dates over stale pins, cited uninitialized submodules, and content changes with unchanged verification dates), `check-helper-command-refs.mjs` (scans tracked docs for stale investigator-artifacts.mjs, auditor-artifacts.mjs, and soc-artifacts.mjs command tokens), `check-doc-links.py`, `check-orphans.py`, `check-workflow-evals.py`, `check-vendor-drift.py`, `check-scrape-freshness.py`, `vendor-impact-summary.mjs` (committed-ref or worktree vendor bump summary with MCP review lenses), `find-asymmetries.py` |
| **Manual hygiene** | `check-staleness.sh`, `check-data-contract.mjs`, `runtime-data-path.mjs`, `setup-data-mount.mjs`, `prepare-overlay-submission.mjs` |
| **Eval suite** | `run-evals.py`, `benchmark-investigator-helper.mjs` |
| **Reasoning helpers** | `agent_patterns.py` (lib), `ab-test-prompt.py` (experimental placeholder), `investigator-artifacts.mjs` (exports `renderCaseReport` — artifact-derived report, no free narrative), `investigator-mcp-server.mjs` (MCP stdio transport for the helper gates; registered in `.mcp.json`; exposes resources `investigator://case/{slug}/report\|journal\|status` and prompts `investigate`/`resume-case`), `investigator-mcp-server.test.mjs` (node:test suite for the MCP server), `check-mcp-conformance.mjs` (in-process JSON-RPC conformance gate; wired into `check-fast.mjs`; degrades gracefully if official inspector unavailable), `auditor-artifacts.mjs` (deterministic helper for the auditor role; exports `openAudit`, `recordFinding`, `updateFinding`, `recordCheckOutput`, `renderAuditReport`, `auditStatus`, `capabilities`; evidence-gated findings and append-only stable-ID closure with verified `Resolved` updates; standalone zero-dependency), `auditor-mcp-server.mjs` (MCP stdio transport for the auditor helper gates; registered in `.mcp.json` and `.devin/config.json`; exposes resources `auditor://audit/{slug}/report\|register\|status` and prompt `audit`; conformant from the start — annotations, outputSchema, structuredContent, -32602 for unknown tools), `auditor-artifacts.test.mjs` (node:test suite for the auditor helper), `auditor-mcp-server.test.mjs` (node:test suite for the auditor MCP server), `soc-artifacts.mjs` (deterministic helper for the SOC role; exports `openReview`, `recordEvidence`, `recordFinding`, `renderSocReport`, `socStatus`, `resolveSource`, `capabilities`; evidence-gated findings with file:line, cross-file, and evidence:<name> source types; SOC-specific framework-not-evidence guard that rejects CWE/OWASP/NIST/MITRE/ATT&CK/CISA tags as standalone source; standalone zero-dependency), `soc-mcp-server.mjs` (MCP stdio transport for the SOC helper gates; registered in `.mcp.json` and `.devin/config.json`; exposes resources `soc://review/{slug}/report\|register\|status` and prompt `soc-review`; conformant from the start — annotations, outputSchema on soc_status, structuredContent, -32602 for unknown tools/prompts), `soc-artifacts.test.mjs` (node:test suite for the SOC helper), `soc-mcp-server.test.mjs` (node:test suite for the SOC MCP server), `agents/soc/mcp-entrypoint.md` (SOC role entrypoint served by the MCP prompt; carries gated workflow, framework-not-evidence rule, status-first recovery, and answer-from-artifact discipline) |
| **Bridge harness (LOCAL-ONLY)** | `bridge/run-investigation.mjs` — drives the `devin` CLI through a multi-turn scripted investigation or audit and independently verifies the artifact state via this repo's own helper exports (`caseStatus`/`renderCaseReport` for role `investigator`; `auditStatus`/`renderAuditReport` for role `auditor`; `socStatus`/`renderSocReport` for role `soc`); **needs `devin` auth + network, not run in CI** and deliberately not wired into `check-fast.mjs`. Scenarios under `bridge/scenarios/` include auditor fabrication resistance, auditor diff readiness, and SOC fabrication resistance; pure-logic fixtures in `bridge/run-investigation.test.mjs` require no `devin` spawn. See `bridge/README.md`. |
| **Maintenance** | `issue-watch.py`, `maintenance-digest.py`, `refresh-postman.sh`, `refresh-automate-zscaler.sh`, `convert-pdf-sources.sh`, `splunk-query.sh` (stub) |
| **Build** | `render-skill-pdf.py` |

`issue-watch.py` loads its upstream repository set from
`fixtures/issue-watch-repos.json`. `test_issue_watch.py` requires every
vendored `github.com/zscaler/*` repository to be classified as either watched
or intentionally issue-disabled, so adding a submodule or shrinking coverage
cannot silently leave a repository unclassified.
Sticky mode is fail-closed: any watched-repository HTTP or network failure
leaves the digest and global `last_check` marker unchanged and exits nonzero.
Local mode retains the failed repository's own marker while advancing markers
for repositories that completed successfully.

### Provider and Cloud Connector module drift snapshot (2026-08-12)

The checked-in gitlinks below remain authoritative for reference claims. The
reviewed upstream heads are maintenance evidence only; this snapshot does not
change a pin.

| Upstream | Authoritative pin | Reviewed head and tag state | Disposition |
|---|---|---|---|
| ZIA provider | [`cfe618f` (v4.8.3)](https://github.com/zscaler/terraform-provider-zia/commit/cfe618fa7cb6f88939ec703520cfa230ec35bf0a) | [`d4eef8a`](https://github.com/zscaler/terraform-provider-zia/commit/d4eef8ab7ed69f575e4dfc94effcf9879e90469e), two commits ahead and tagged [v4.8.5](https://github.com/zscaler/terraform-provider-zia/releases/tag/v4.8.5) | Defer the pin until the CAC source predicate and stress race gate pass and `zia-72` resolves the advanced-settings Creative Commons backend effect. |
| AWS Cloud Connector modules | [`d991f87`](https://github.com/zscaler/terraform-aws-cloud-connector-modules/commit/d991f875dfdcd470af2f2fa4e94f1cf96278c6ab) | [`6f8318d`](https://github.com/zscaler/terraform-aws-cloud-connector-modules/commit/6f8318d759e72a7cb8194d6efb9f18c55e6528f4), three commits ahead and untagged; newest listed tag is [`v1.4.3` at `26de1a1`](https://github.com/zscaler/terraform-aws-cloud-connector-modules/releases/tag/v1.4.3) | Issues are disabled. Monitor tags/releases separately; review the ASG, Terraform 1.1.9, and FIPS changes together before any pin proposal. |
| Azure Cloud Connector modules | [`8714f88`](https://github.com/zscaler/terraform-azurerm-cloud-connector-modules/commit/8714f88d1ac2827b40900b11bd52243919af2ae5) | [`abdd217`](https://github.com/zscaler/terraform-azurerm-cloud-connector-modules/commit/abdd217051e014544de376442521a4d20934ef5a), six commits ahead and untagged; newest listed tag is [`v0.8.0` at `4c65a1c`](https://github.com/zscaler/terraform-azurerm-cloud-connector-modules/releases/tag/v0.8.0) | Issues are disabled. Monitor tags/releases separately; defer pending a tagged release and combined limits, VM-size, Terraform 1.1.9, FIPS, and provider-constraint review. |
| GCP Cloud Connector modules | [`0e8a8b8`](https://github.com/zscaler/terraform-gcp-cloud-connector-modules/commit/0e8a8b82c45c7317d00f052a0b036396a1a184d8) | [`a2d31dc`](https://github.com/zscaler/terraform-gcp-cloud-connector-modules/commit/a2d31dca952f1b82906a31a1a818a1829baf2e6f), six commits ahead and untagged; newest listed tag is [`v0.4.1` at `51f84bf`](https://github.com/zscaler/terraform-gcp-cloud-connector-modules/releases/tag/v0.4.1) | Issue-watch covers Issues, not tags/releases. Defer pending a tagged release and review of the untagged IAM/default, download-integrity, ASG, Terraform 1.1.9, and FIPS changes; assign no remediation status to untagged head. |

The ZIA-provider CAC gate is source-plus-stress. The helper must eliminate its
post-unlock `rules.reorderDone` map read by removing the shared access, keeping
it under lock, or copying `doneCh` before unlock; then the documented
`go test -race` suite must pass with `-count=20` or a higher repeat count. One
clean `-count=1` run is insufficient and does not override the source predicate.
See the exact command and current failure evidence in
[`references/zia/api-divergences.md`](../references/zia/api-divergences.md#terraform-provider-release-gate--cac-type-key-isolation-passes-but-the-shared-reorder-helper-races).

For module-head review, use Terraform 1.1.9 as the compatibility-test floor:
all three pinned READMEs say their deployment scripts leverage 1.1.9 while
0.13.7 should generally remain supported
(`vendor/terraform-aws-cloud-connector-modules/README.md:20-23`;
`vendor/terraform-azurerm-cloud-connector-modules/README.md:19-21`;
`vendor/terraform-gcp-cloud-connector-modules/README.md:20-23`), and each
reviewed head contains an explicit fix for expressions that accidentally
required Terraform 1.9 or later
([AWS `34eb909`](https://github.com/zscaler/terraform-aws-cloud-connector-modules/commit/34eb90938143118060320d57592db9a3096e3b20),
[Azure `497d990`](https://github.com/zscaler/terraform-azurerm-cloud-connector-modules/commit/497d99088e4bad03b80e8212a6c72e075f0755de),
[GCP `c035b8b`](https://github.com/zscaler/terraform-gcp-cloud-connector-modules/commit/c035b8b87829c648cdb9c3dce27553393a73a8c2)).
This is a maintenance validation floor, not a rewrite of the modules' declared
`required_version`, which remains `>= 0.13.7, < 2.0.0` in the pinned module
sources
(`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-workload-aws/versions.tf:12`;
`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/versions.tf:16`;
`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-iam-service-account-gcp/versions.tf:9`).

`issue-watch.py` now covers GitHub Issues for the ZIA provider and GCP modules,
but it does not poll tags or releases. AWS and Azure are intentionally
classified as issue-disabled rather than errors. Their tag/release drift—and
tag/release drift for watched repositories—requires a separate monitor or
manual sweep.

## Aggregated dependencies

Listed in [`../pyproject.toml`](../pyproject.toml) under `[project.optional-dependencies] scripts`. Mirrors the union of executable per-script PEP 723 declarations for discoverability. The test-only `pytest` runner is intentionally supplied ephemerally with `uv run --with pytest` by CI and `check-full.mjs`.

Currently used:

- `pyyaml>=6` — frontmatter parsing
- `httpx>=0.27` — GitHub API calls (issue-watch and maintenance digest sticky issues)
- `markdown>=3.5`, `pymdown-extensions>=11.0.1` — PDF rendering

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
The current fast gate covers release and provenance state, workflow metadata
and eval shapes, portable-skill contracts, citation links, Node helper tests,
MCP conformance, routing, and staged/unstaged/untracked whitespace. It is a
local acceleration path, not a replacement for the full CI hygiene workflow.

For reference-only or vendor-refresh work, use the scoped doctor before the
fast gate:

```bash
node scripts/doctor.mjs --profile references
```

That profile checks Node, repository layout, and vendor submodule availability
without reporting unrelated local hook, runtime-data mount, or companion-CLI
state. The default `node scripts/doctor.mjs` remains the full installation
doctor.

Before committing a local vendor refresh, run the combined gate:

```bash
node scripts/check-vendor-refresh.mjs --base origin/main
```

It runs the reference-focused doctor, generates a worktree-aware impact summary
in a temporary file, and runs `check-fast.mjs` as one top-level command. Pass
`--output <path>` when the impact summary should be retained as a durable audit
artifact. The mechanical gate stops on high-priority cited-file drift, failed
MCP change enumeration, or MCP paths outside the review classifier; a passing
gate still leaves the generated semantic review queue for human inspection.

To inspect verification-date and source-materialization semantics independently
of an extraction report, run the diff-aware advisory:

```bash
node scripts/check-reference-freshness.mjs --base origin/main
```

The default mode reports three warning classes without failing: a newer
`last-verified` date over a stale submodule pin, a changed document citing an
uninitialized vendor submodule, and an informational review prompt for
substantive body changes whose current submodule pins were retained while the
date stayed unchanged. With no `--head`, the checker includes committed,
staged, unstaged, and untracked reference changes; CI passes `--head HEAD` for
a deterministic committed range. `--strict`
promotes the first two deterministic classes to failures; the content/date
heuristic remains advisory.

To prove that exact Help and Automate capture files declared by changed
references existed at those documents' recorded superproject pins, run:

```bash
./scripts/check-verified-against.py --base origin/main
```

With no `--head`, this includes committed, staged, unstaged, and untracked
reference changes. CI passes `--head HEAD`. The check is blocking because it
only evaluates exact `sources:` paths under `vendor/zscaler-help` and
`vendor/zscaler-api-specs`, requires the matching root's `verified-against` pin,
and proves the pinned object is a file;
URLs, submodule sources, globs, root sentinels, and descriptive source strings
are deliberately outside this predicate.

To generate only the same impact summary used by CI:

```bash
node scripts/vendor-impact-summary.mjs \
  --base origin/main \
  --worktree \
  --output "$(node scripts/runtime-data-path.mjs schemas vendor-impact-summary.md)"
```

For an MCP pointer change, the report adds path-based review lenses for tools,
prompts, authentication and safety, output shaping, lifecycle, shared helpers,
documentation, and tests. These are a review queue; they do not assert that a
changed behavior is safe or sufficiently documented.

Benchmark investigator helper mechanics without involving an agent runtime:

```bash
node scripts/benchmark-investigator-helper.mjs
```

This creates synthetic case directories in the OS temp directory, seeds actual
turn-ledger events, and reports p50/p95/max timings for the post-Step-3 helper
path. Use it to separate deterministic helper overhead from agent workflow
latency.

Validate workflow metadata and runtime adapter pointers:

```bash
node scripts/check-workflow-metadata.mjs
```

The runtime data mount contract check verifies a runtime data mount without
reading tenant contents. `_data` is the default mount path, configured by the
tracked `zscaler-skill-runtime.json`:

```bash
node scripts/check-data-contract.mjs
```

Resolve the effective mount or a contained path for scripts and workflows:

```bash
node scripts/runtime-data-path.mjs
node scripts/runtime-data-path.mjs schemas hygiene-digest.md
node scripts/runtime-data-path.mjs --json
```

Output is repository-relative by default. `--absolute` emits an absolute path,
and traversal outside the configured mount is rejected.

If `zscaler-skill-runtime.json` or local `zscaler-skill-setup.json` sets
`runtimeData.mountPath`, the checker reads that automatically. You can also
pass `--mount-path <path>`.

A downstream installation may select another committed runtime config with
`ZSCALER_SKILL_RUNTIME_CONFIG=<path>` or `--runtime-config <path>`. A local
setup config may be selected with `ZSCALER_SKILL_SETUP_CONFIG=<path>` or
`--config <path>`. Explicit flags win over environment selectors. Explicit
mount/tracking values then override setup config, which overrides runtime
config, which overrides defaults. Selected configs replace the root file and
fail loudly when missing, malformed, or structurally invalid.

To create the runtime data mount from a user-supplied data source:

```bash
node scripts/setup-data-mount.mjs \
  --data-url <git-url-or-local-path> \
  --data-ref <branch-or-tag> \
  --mode checkout
```

Use the actual branch or tag for your runtime-data source.

Mode `checkout` clones a repository or local path into the mount without
registering a parent-repo submodule. Mode `copy` materializes a local directory
copy. Use `--mode submodule` only when a release/build flow deliberately wants
a pinned runtime-data gitlink. The setup helper refuses to replace populated
runtime data unless `--force` is explicit and runs the data contract check
after setup.

If `zscaler-skill-setup.json` exists at the repo root, the setup helper reads
private bootstrap defaults from it. CLI flags override config values. The public template is
[`../zscaler-skill-setup.example.json`](../zscaler-skill-setup.example.json);
the real config is gitignored because it may contain a private data source URL.
Preferred local setup-config shape:

```json
{
  "runtimeData": {
    "source": "${ZSCALER_SKILL_RUNTIME_SOURCE}",
    "ref": "main",
    "mode": "checkout"
  }
}
```

The setup helper also accepts `--mount-path <path>` and
`--tracking ignored|tracked` for one-off runs. Keep `tracking: "ignored"` for
public/local checkouts; setup will protect a custom ignored mount with a local
Git exclude. In a private work mirror that intentionally commits runtime data
directly in this repo, commit this in `zscaler-skill-runtime.json`:

```json
{
  "runtimeData": {
    "mountPath": "tenant-data",
    "tracking": "tracked"
  }
}
```

Missing required directories are errors. Empty runtime directories are warnings,
because snapshot-backed reasoning and tenant schema hints are unavailable.

Most private mirrors should commit runtime-data artifacts directly to the
configured tracked mount. The separate overlay-submission helper remains for
installations that still use a second repository:

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
Non-secret overlay policy (`allowedRoots`, `defaultBranch`, `branchPrefix`, and
approval requirements) may be committed under `overlaySubmission` in the
selected runtime config. Keep `repoUrl` in the ignored setup config; the helper
rejects repository URLs in committed runtime configs.
The overlay repository is treated as the runtime-data content root, so runtime
paths are copied without the mount prefix (`_data/cases/foo` or
`tenant-data/cases/foo` → `cases/foo`; `_data/knowledge/zpa/foo.md` →
`knowledge/zpa/foo.md`). The default allowed roots are `cases`, `schemas`,
`iac`, and `knowledge`. If `runtimeData.mountPath` is set, the submission helper
reads it automatically; otherwise pass `--mount-path`.

## When to add a new script

- Use the uv-script shebang
- Declare third-party deps in PEP 723 inline metadata
- If introducing a new third-party dep, add it to `pyproject.toml` `[project.optional-dependencies] scripts` for aggregated visibility
- Make it executable: `chmod +x scripts/<name>.py`
