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

Credentials are consumed by external tooling — preferably the read-only
`zscalerctl` companion once it is available, or a private data-repo populator —
that produces the `_data/snapshot/` dumps this skill reads. No script in this
repo connects to Zscaler directly.

Create the API client in ZIdentity. This is a one-time setup and requires
ZIdentity admin access. Zscaler can move console navigation over time, so treat
the path below as the expected shape and fall back to the pinned SDK docs or
live OneAPI docs if your tenant UI differs:

1. Sign in to the ZIdentity Admin Portal at
   `https://admin.<your-vanity-domain>.zslogin.net` or the gov/ten equivalent.
2. Find the API client management page, commonly under
   **Integrations -> API Clients -> Add Client**.
3. Grant the client read scopes for the products whose configuration you snapshot
   — typically ZIA (`zia.*`), ZPA (`zpa.*`), and ZCC (`zcc.*`).
4. On save, copy the **Client ID** and either the **Client Secret** or the
   downloadable private key PEM.
5. Your **Vanity Domain** is the subdomain you use to sign in to ZIdentity. If
   your admin portal URL is `https://admin.acme.zslogin.net`, the vanity domain
   is `acme`.

If the portal path above does not match your tenant, Zscaler's live OneAPI docs
are at https://help.zscaler.com/oneapi.

Configure the env vars for your external tooling (`zscalerctl` or equivalent):

```bash
export ZSCALER_CLIENT_ID=...
export ZSCALER_CLIENT_SECRET=...
export ZSCALER_VANITY_DOMAIN=...
export ZSCALER_CLOUD=...            # optional; omit for default commercial cloud
```

For JWT auth, set `ZSCALER_PRIVATE_KEY` instead of `ZSCALER_CLIENT_SECRET`.

Known `ZSCALER_CLOUD` values:

- **Commercial**: omit the var for the default path. Explicit commercial values
  include `zscaler.net`, `zscalertwo.net`, `zscalerthree.net`, `zscloud.net`,
  `zscalerbeta.net`, and `zscalerone.net`.
- **Gov**: current OneAPI-capable SDKs and the ZIA Terraform provider use
  `gov` / `govus`; legacy ZIA provider paths use `zscalergov` /
  `zscalerten`.
- **ZPA-only gov values** also exist (`GOV`, `GOVUS`); the ZPA Terraform
  provider still documents those as legacy-only.

Default commercial-cloud tenants usually leave `ZSCALER_CLOUD` unset. Set it
when running against gov clouds, beta clouds, or a non-default commercial cloud,
but check the selected client/provider docs before assuming a gov value means
OneAPI or legacy.

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

After the setup steps, run `node scripts/doctor.mjs` to confirm the local
install and get the next command or doc pointer for anything missing.

## Populate the snapshot

`_data/snapshot/` holds sanitized tenant configuration the skill cites when
answering tenant-specific questions, in a cloud-first layout —
`_data/snapshot/<cloud>/<product>/*.json` (see [`docs/data-contract/`](./data-contract/)).

Populate it out of band: a private runtime-data repository, or a sanitized dump
from the read-only [`zscalerctl`](https://github.com/dvmrry/zscalerctl) CLI.
The intended pre-release companion model is: `zscalerctl` observes tenant state,
`_data/` stores its fast local snapshots and diffs, and this skill interprets
that observed state. Credentialed tenant reads are out of scope for this repo.
Without a snapshot or explicit command output, most tenant-specific answers
revert to "I can't verify, here's the general mechanism."

See [`scripts/README.md`](../scripts/README.md) for the full inventory.

## Run Evals

```bash
cat references/_meta/evals/evals.json | jq '.evals[] | {id, prompt}'
```

Each eval entry includes `assertions`, `must_cite_files`, `must_not_say`, and
`expected_confidence` so an eval harness can grade structurally, not just on
prose. Tenant-specific prompts use `tenant_data_required: true` so the harness
can expect a decline-with-helpful-pointers when `_data/snapshot/` is empty.
