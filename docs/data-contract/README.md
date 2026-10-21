# Runtime data contract

Single home for everything that becomes per-fork or per-tenant. The
skill-internal docs (methodologies, playbooks, registers) live under
`references/_meta/`; runtime data (company overlay, script outputs,
fork-specific IaC) lives here.

Public upstream does not track `_data/`; it tracks this contract and the
non-secret layout file [`../../zscaler-skill-runtime.json`](../../zscaler-skill-runtime.json)
instead. `_data/` is the default mount path. Private work mirrors may commit a
different layout there, for example `runtimeData.mountPath: "tenant-data"` and
`runtimeData.tracking: "tracked"`, then commit the runtime files directly in the
mirror. When a different mount path is configured, substitute that path anywhere
this contract says `_data/`.

## Downstream selection

Select a downstream-owned, non-secret runtime config without rewriting the
upstream root file:

```bash
export ZSCALER_SKILL_RUNTIME_CONFIG=deployments/acme-zscaler-runtime.json
node scripts/runtime-data-path.mjs --json
node scripts/check-data-contract.mjs
```

`--runtime-config <path>` takes precedence over the environment selector. A
selected config replaces the root config rather than merging with it. Relative
config and mount paths must stay inside the repository, and an explicitly
selected missing, malformed, or structurally invalid config is an error.

Private setup can likewise select a local config through
`ZSCALER_SKILL_SETUP_CONFIG` or `--config`. Resolution precedence is explicit
CLI values, selected setup config, selected runtime config, then defaults.

The ignored root `zscaler-skill-setup.json` is only for local bootstrap/source
settings such as a private data repository URL. It may locally override
mount/tracking for one workstation, but shared layout belongs in
`zscaler-skill-runtime.json`.

Expected top-level directories:

- `_data/cases/`
- `_data/schemas/`
- `_data/overlay/`
- `_data/iac/`
- `_data/audits/`
- `_data/soc-reviews/`

Company knowledge records live in the overlay (`_data/overlay/knowledge/`); see
[`./knowledge.md`](./knowledge.md). The former `_data/knowledge/` Markdown records
are retired: the contract check warns while any remain.

Run the public contract check after creating or replacing `_data`:

```bash
node scripts/check-data-contract.mjs
```

If you configured a different mount path, either let the checker read the root
config or pass it explicitly:

```bash
node scripts/check-data-contract.mjs --mount-path <runtime-data-path>
```

The checker verifies the directory shape, reports whether `_data` appears to be
a submodule, and warns when runtime data is missing enough that overlay-backed (IaC or live)
or tenant-schema-backed reasoning will be unavailable.

The `_data/README.md` marker is recommended because it makes accidental runtime
mount replacement obvious to humans. The checker warns when it is missing but
does not fail the contract solely for that marker.

To create `_data` from a user-supplied runtime-data source, use the generic
setup helper:

```bash
node scripts/setup-data-mount.mjs \
  --data-url <git-url-or-local-path> \
  --data-ref <branch-or-tag> \
  --mode checkout
```

Use the actual branch or tag for your runtime-data source.

Mode `checkout` clones a data repository or local path into `_data` without
registering a parent-repo submodule. Use `--mode copy` for a materialized copy,
or `--mode submodule` only when a release/build flow deliberately wants a
pinned `_data` gitlink. The helper refuses to replace populated `_data`
contents unless `--force` is explicit, then runs the same public contract check.

If a root-level `zscaler-skill-setup.json` exists, the helper reads private
bootstrap defaults from it. Use [`../../zscaler-skill-setup.example.json`](../../zscaler-skill-setup.example.json)
as the public-safe template. The real config is gitignored because it may
contain a private data source URL. Preferred setup-config shape:

```json
{
  "runtimeData": {
    "source": "${ZSCALER_SKILL_RUNTIME_SOURCE}",
    "ref": "main",
    "mode": "checkout"
  }
}
```

For a private work mirror that commits runtime data directly in this repo,
commit the shared layout in `zscaler-skill-runtime.json`:

```json
{
  "runtimeData": {
    "mountPath": "tenant-data",
    "tracking": "tracked"
  }
}
```

The older top-level `dataUrl`, `dataRef`, and `mode` keys still work for
compatibility, but new installs should use `runtimeData`.

For installations that submit selected artifacts to a separate overlay
repository, non-secret policy may also live in the selected runtime config:

```json
{
  "overlaySubmission": {
    "allowedRoots": ["cases", "schemas", "iac", "knowledge"],
    "defaultBranch": "main",
    "branchPrefix": "runtime-data/",
    "requireExplicitApproval": true
  }
}
```

The overlay repository URL remains private. Put `overlaySubmission.repoUrl` in
the ignored setup config or pass `--repo-url`; the helper rejects it in a
committed runtime config.

## Subdirectories

### `_data/iac/`

**Where a company checks out its IaC repositories**, one per directory (`_data/iac/<repo>/`), each declared in `overlay.json` `iac` with its kind (`terraform` or `infrawright`). Empty in the public upstream skill.

The skill's vendored provider source lives separately at `vendor/terraform-provider-zia/`, `vendor/terraform-provider-zpa/`, `vendor/terraform-provider-zcc/`, and `vendor/terraform-provider-ztc/`; vendored deployment examples or modules live separately under `vendor/terraform-*-modules/` when present. When `_data/iac/` is populated, agents treat it as **production truth** for "how is X actually deployed in our environment" while vendor source stays useful for "what's possible / what fields exist."

See [`./iac.md`](./iac.md) for the declaration, pointer rules, and sanitization guidance.

### `_data/schemas/`

Runtime schema, query-skeleton, and generated-report workspace. Ignored in the
public repo.

This directory is for artifacts that make vendor-specific log/query work easier:
deconstructed log schemas, field maps, query skeletons, and generated reports
that are useful to agents but are not reference docs themselves. It is **not**
where raw incident logs should live; raw evidence belongs under the operative
case directory's `evidence/` folder.

Current generated files written here:

- `_data/schemas/asymmetry-candidates.md` — `scripts/find-asymmetries.py` output
- `_data/schemas/hygiene-digest.md` — `scripts/check-hygiene.py --digest` output

No subdir convention — flat. Scripts that want their own scratch namespace can create subdirs at will (e.g., `_data/schemas/sweeps/<date>/`).

Issue-watch output lives under `_data/logs/`:

- `_data/logs/issues-new.md` — `scripts/issue-watch.py` weekly digest output
- `_data/logs/issue-watch-state.json` — `scripts/issue-watch.py` cursor state

### `_data/overlay/`

**The company overlay: company knowledge records plus the pointers to tenant
sources.** Ignored in the public repo. `overlay.json` declares which answer
tiers exist beyond the public knowledge graph: `iac` (the IaC repositories; see
`_data/iac/` and [`./iac.md`](./iac.md)) and `live` (the read-only `zscalerctl`
tool). Its `knowledge/<scope>/<id>.json` records are the company's knowledge
([`./knowledge.md`](./knowledge.md)). `node scripts/kb.mjs resolve <id | text>` reads it and reports the
available tiers in the bundle's `tiers` block. The overlay is found at
`$ZSCALER_KB_OVERLAY`, or else at `<runtime-data mount>/overlay/` when it has an
`overlay.json` (`node scripts/runtime-data-path.mjs overlay`).

There is no saved tenant-snapshot directory. Tenant facts come from three answer
tiers: the knowledge graph (public index plus the overlay's records), the
overlay's IaC, then live read-only `zscalerctl` (only when IaC cannot answer or
for drift; results are never kept as a standing tenant cache; a case may save them under its own `evidence/`). For field
shapes of a type, run `node scripts/kb.mjs resolve <type-id>` (for example
`zia/url-filtering-rules`).

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

### `_data/knowledge/` (retired)

The former Markdown operational-knowledge records. They are no longer read; move
them to overlay records using the field mapping in [`./knowledge.md`](./knowledge.md).

### `_data/audits/`

**Saved `/z-auditor` audit artifacts (register-shaped).** Each audit gets its own
dir: `<slug>/` containing `audit-intake.json`, `register.md`, `findings.jsonl`,
and a `checks/` dir of recorded check outputs. Written by the auditor helper
(`scripts/auditor-artifacts.mjs`) and the auditor MCP server. Individual audit
dirs are created on demand; the `audits/` parent is part of the contract so the
MCP server's `resources/list` resolves instead of silently returning empty.

### `_data/soc-reviews/`

**Saved `/z-soc` posture-review artifacts (register-shaped).** Each review gets
its own dir: `<slug>/` containing `review-intake.json`, `register.md`,
`findings.jsonl`, and an `evidence/` dir of recorded evidence. Written by the SOC
helper (`scripts/soc-artifacts.mjs`) and the SOC MCP server. Individual review
dirs are created on demand; the `soc-reviews/` parent is part of the contract.

> Note: the SOC *prompt* (non-MCP) path can instead co-locate a narrative
> `posture.md` under `_data/cases/<slug>/` when a review crosses into incident
> territory and shares a directory with an investigation — see
> [`agents/soc/prompt.md`](../../agents/soc/prompt.md). `_data/soc-reviews/` is
> the register-shaped store used by the MCP/helper path.

## Privacy

Everything under `_data/` is gitignored by default in the public template.
Forks that want to commit `iac/`, `schemas`, or case content do so deliberately
by either adjusting `.gitignore` or using a separate mount with
`runtimeData.tracking: "tracked"` in the private work mirror. **Raw tenant exports
and raw operational logs should generally not be committed**, even to private
forks, unless the org has explicit guidance otherwise (see `iac.md` §
Sanitization).

Automation may pre-populate `_data` before use. Public upstream does not ship
tenant data.

## Why this dir exists

Top-level cleanliness. Before consolidation, `iac/`, `logs/` (now
`schemas/`), and `snapshot/` were three separate top-level dirs encoding three
different but related concepts. Consolidating mirrors the `_meta/` pattern under
`references/`: anything not under `_data/` is content/infrastructure; anything
under `_data/` is fork/tenant/runtime.
