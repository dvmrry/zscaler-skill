# Getting Started

This walkthrough is for a private fork or local checkout that will use tenant
snapshots and local overlays. Public upstream does not track `_data/`; create a
local runtime-data mount before using snapshot-backed workflows.

## Prerequisites

- **Claude Code**: the skill is loaded by Claude Code (`claude` CLI) reading
  `SKILL.md`. Install per https://claude.com/claude-code if you do not have it.
  The skill can also be loaded by any agent harness that honors the Anthropic
  skill conventions, but Claude Code is what this walkthrough assumes.
- **Python 3.10+** with [`uv`](https://docs.astral.sh/uv/) on `PATH`. Every
  script uses the uv single-file-script pattern; dependencies install on first
  run, no virtualenv setup needed.
- **Node 18+** for deterministic workflow helpers such as case-intake,
  runtime-data setup, data-contract checks, and overlay submission.
- **Git** for submodule fetch.
- **ZIA and ZPA admin access** to create the API client credentials used below.

## Clone with Submodules

```bash
git clone --recursive <fork-url> zscaler-skill
cd zscaler-skill

# or if you already cloned without --recursive:
git submodule update --init --recursive
```

The `vendor/` tree holds upstream SDKs, Terraform providers, deployment
modules, and tool references as git submodules. Without them, reference docs
that cite paths such as `vendor/zscaler-sdk-python/...`,
`vendor/terraform-provider-zia/...`, or `vendor/splunk-sdk-python/...` point to
nothing.

Activate the pre-push hook so hygiene runs locally before any push:

```bash
git config core.hooksPath .githooks
```

The hook (`.githooks/pre-push`) runs the local hygiene suite before push.
Failures block the push; bypass with `git push --no-verify` if you really need
to. CI runs the same hygiene family on PRs and pushes to `main`.

## Read PLAN.md

[`PLAN.md`](../PLAN.md) is the crash-recovery and onboarding artifact. It lists:

- The roadmap that built this skill, with per-step state.
- Pending lab tests for open clarifications.
- Crash-recovery hints if an agent session dies mid-work.

If you need to know where the skill stands or what is safe to extend, start
there.

## Install as a Claude Skill

Symlink or copy this repo into your Claude skills directory:

```bash
mkdir -p ~/.claude/skills
ln -s "$(pwd)" ~/.claude/skills/zscaler
```

Start a Claude Code session and confirm the skill loads with `/skills`.

## Set Up ZIA and ZPA Credentials

The operational scripts use `zscaler-sdk-python` via OneAPI OAuth through
ZIdentity.

Create the API client in ZIdentity. This is a one-time setup and requires
ZIdentity admin access. Zscaler can move console navigation over time, so treat
the path below as the expected shape and fall back to the pinned SDK docs or
live OneAPI docs if your tenant UI differs:

1. Sign in to the ZIdentity Admin Portal at
   `https://admin.<your-vanity-domain>.zslogin.net` or the gov/ten equivalent.
2. Find the API client management page, commonly under
   **Integrations -> API Clients -> Add Client**.
3. Grant the client read scopes for ZIA (`zia.*`), ZPA (`zpa.*`), and ZCC
   (`zcc.*`). `snapshot-refresh.py` needs read access across URL categories,
   URL filtering, CAC, SSL inspection, advanced settings, app segments, segment
   groups, server groups, access policies, ZCC forwarding profiles, trusted
   networks, fail-open policies, and web policies. ZDX, ZBI, CBC, and ZWA scopes
   are only needed if you extend snapshot coverage for those products.
4. On save, copy the **Client ID** and either the **Client Secret** or the
   downloadable private key PEM.
5. Your **Vanity Domain** is the subdomain you use to sign in to ZIdentity. If
   your admin portal URL is `https://admin.acme.zslogin.net`, the vanity domain
   is `acme`.

If the portal path above does not match your tenant,
`vendor/zscaler-sdk-python/README.md` has Zscaler's pinned walkthrough. Zscaler's
live OneAPI docs are at https://help.zscaler.com/oneapi.

Export the env vars:

```bash
export ZSCALER_CLIENT_ID=...
export ZSCALER_CLIENT_SECRET=...
export ZSCALER_VANITY_DOMAIN=...
export ZSCALER_CLOUD=...            # optional; omit for default commercial cloud
```

For JWT auth, set `ZSCALER_PRIVATE_KEY` instead of `ZSCALER_CLIENT_SECRET`.

The pinned SDK docs list these `ZSCALER_CLOUD` values:

- **Commercial**: omit the var for the default path. Explicit commercial values
  include `zscaler.net`, `zscalertwo.net`, `zscalerthree.net`, `zscloud.net`,
  `zscalerbeta.net`, and `zscalerone.net`.
- **Gov**: `zscalergov` and `zscalerten`.
- **ZPA-only gov values** also exist (`GOV`, `GOVUS`); use the legacy path if
  your ZPA tenant uses these.

For this repo's SDK path, default commercial-cloud tenants usually leave
`ZSCALER_CLOUD` unset. Per `tf-zia#552`, hard-requiring it via
`getEnvVarOrFail` was a bug; the SDK's expected production behavior is empty or
unset. Set `ZSCALER_CLOUD` when running against gov clouds, beta clouds, or a
non-default commercial cloud where the tenant is explicitly on a
non-`zscaler.net` cloud.

## Legacy Auth

Use this path when your tenant is pre-ZIdentity, or a gov tenant that has not
migrated:

```bash
export ZSCALER_USE_LEGACY=true
```

Legacy auth needs product-specific env vars. At minimum:

- ZIA: `ZIA_USERNAME`, `ZIA_PASSWORD`, `ZIA_API_KEY`, `ZIA_CLOUD`.
- ZPA: `ZPA_CLIENT_ID`, `ZPA_CLIENT_SECRET`, `ZPA_CUSTOMER_ID`, `ZPA_CLOUD`.

The full list is in `vendor/zscaler-sdk-python/README.md` under the legacy API
framework section. If you are on legacy, the skill can still answer most of its
reasoning questions from `references/` without the scripts running; credentials
are only needed for tenant-specific lookups.

See [`references/zia/api.md`](../references/zia/api.md) for Python client
instantiation patterns.

## Set Up Runtime Data

`_data/` is an ignored runtime-data mount. Create it from a private data
repository or local directory before relying on tenant snapshots, schema hints,
or case history:

```bash
node scripts/setup-data-mount.mjs \
  --data-url <git-url-or-local-path> \
  --data-ref <branch-or-tag> \
  --mode checkout

node scripts/check-data-contract.mjs
```

Use the actual branch or tag for your runtime-data source. Mode `checkout`
clones the runtime data directly into `_data/` without registering a parent-repo
submodule.

## Pull the First Snapshot

```bash
./scripts/snapshot-refresh.py                 # full ZIA + ZPA + ZCC dump
./scripts/snapshot-refresh.py --zia-only      # just ZIA
./scripts/snapshot-refresh.py --zpa-only      # just ZPA
./scripts/snapshot-refresh.py --zcc-only      # just ZCC
```

The script writes to `_data/snapshot/<cloud>/zia/*.json`,
`_data/snapshot/<cloud>/zpa/*.json`, and `_data/snapshot/<cloud>/zcc/*.json`, plus a
`_manifest.json` with timestamps and per-resource counts.

The public snapshot layout is cloud-first. `ZSCALER_CLOUD` or `--cloud`
selects the directory under `_data/snapshot/<cloud>/`; if neither is provided,
the script writes to `_data/snapshot/default/`. Multi-tenant or multi-cloud
forks should keep one directory per tenant cloud or tenant slug.

Populate `_data/snapshot/` locally, or in a private runtime-data repository if
your org explicitly allows committing sanitized tenant snapshots. The skill
cites `_data/snapshot/` when answering tenant-specific questions. Without it,
most tenant-specific answers revert to "I can't verify, here's the general
mechanism."

## Try Public-Safe Scripts

With a snapshot in place:

```bash
./scripts/url-lookup.py https://www.reddit.com
./scripts/simulate-policy.py --url https://www.reddit.com
```

The public repo treats snapshot-backed and reference-hygiene scripts as
operational. Credentialed live-tenant diagnostics are out of scope here — use
the read-only `zscalerctl` CLI for tenant reads.

See [`scripts/README.md`](../scripts/README.md) for the full inventory.

## Run Evals

```bash
cat references/_meta/evals/evals.json | jq '.evals[] | {id, prompt}'
```

Each eval entry includes `assertions`, `must_cite_files`, `must_not_say`, and
`expected_confidence` so an eval harness can grade structurally, not just on
prose. Tenant-specific prompts use `tenant_data_required: true` so the harness
can expect a decline-with-helpful-pointers when `_data/snapshot/` is empty.
