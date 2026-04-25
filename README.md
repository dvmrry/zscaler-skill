# zscaler-skill

A Claude skill for reasoning about Zscaler environments — deep-dive coverage of ZIA, ZPA, ZCC, ZDX, ZBI, ZIdentity, Cloud & Branch Connector, ZWA, Deception, ZPA AppProtection, Risk360, the AI Security family (AI Guard / AI Guardrails / AI Red Teaming), and ZMS (workload microsegmentation), plus Tier 2 awareness of the broader portfolio (ZINS, EASM, Federal Cloud, ITDR, DSPM, Posture Control) — covering the policy evaluation, rule precedence, and cross-product interactions that raw LLMs hallucinate on.

## What this is

A knowledge skill that helps engineers and non-technical users answer questions about Zscaler — from simple lookups ("is this URL covered by a category?") to subtle reasoning ("why does rule A beat rule B, and does SSL inspection happen before or after?") to portfolio breadth ("what is Risk360?", "does Zscaler do microsegmentation?"). The core value is **codified behavior** — rule precedence, wildcard semantics, policy evaluation order, product-fit framing — not API access. An agent with the API but without this knowledge will answer confidently and wrong.

Follows the [Anthropic skill conventions](https://github.com/anthropics/skills) — `SKILL.md` at the root, progressive disclosure through `references/`, helper scripts in `scripts/`, and test prompts in `evals/`.

## Fork-admin first-run walkthrough

If you just forked this privately for your own tenant and this is your first time setting it up, follow this path.

### Prerequisites

- **Claude Code** — the skill is loaded by Claude Code (`claude` CLI) reading `SKILL.md`. Install per https://claude.com/claude-code if you don't have it. The skill can also be loaded by any agent harness that honors the Anthropic skill conventions, but Claude Code is what the walkthrough assumes.
- **Python 3.10+** with [`uv`](https://docs.astral.sh/uv/) on PATH. Every script uses the uv single-file-script pattern — dependencies install on first run, no virtual-env setup needed.
- **Git** (for submodule fetch).
- **ZIA and ZPA admin access** (to create the API client credentials used below).

### 1. Clone with submodules

```bash
git clone --recursive <fork-url> zscaler-skill
cd zscaler-skill

# or if you already cloned without --recursive:
git submodule update --init --recursive
```

The `vendor/` tree holds upstream Zscaler sources as git submodules. Without them, reference docs that cite `vendor/zscaler-sdk-python/...` or `vendor/terraform-provider-zia/...` point to nothing.

### 2. Read `PLAN.md`

[`PLAN.md`](./PLAN.md) is the crash-recovery and onboarding artifact. It lists:

- The 7-step roadmap that built this skill, with per-step state (what's done, what's deferred)
- Pending lab tests for open clarifications
- Crash-recovery hints if an agent session dies mid-work

If you need to know where the skill stands or what's safe to extend, start there.

### 3. Install as a Claude skill

Symlink or copy this repo into your Claude skills directory:

```bash
ln -s "$(pwd)" ~/.claude/skills/zscaler
```

Start a Claude Code session and confirm the skill loads with `/skills`.

### 4. Set up ZIA + ZPA credentials

The operational scripts use `zscaler-sdk-python` via OneAPI (OAuth 2.0 via ZIdentity).

**Create the API client in ZIdentity** (one-time setup, requires ZIdentity admin):

1. Sign in to the ZIdentity Admin Portal at `https://admin.<your-vanity-domain>.zslogin.net` (or the gov/ten equivalent).
2. Navigate **Integrations → API Clients → Add Client**.
3. Grant the client scopes for ZIA (`zia.*`), ZPA (`zpa.*`), and ZCC (`zcc.*`). `snapshot-refresh.py` needs read scopes across URL categories, URL filtering, CAC, SSL inspection, advanced settings, app segments, segment groups, server groups, access policies, plus ZCC forwarding profiles, trusted networks, fail-open policies, and web policies. Grant `...:read` for each — no writes are needed. ZDX / ZBI / CBC / ZWA scopes are only needed if you extend the snapshot script to cover those products.
4. On save, the portal shows the **Client ID** (use as `ZSCALER_CLIENT_ID`) and either a **Client Secret** (`ZSCALER_CLIENT_SECRET`) or a downloadable private key PEM (`ZSCALER_PRIVATE_KEY`, JWT auth). The secret is shown once — copy it immediately.
5. Your **Vanity Domain** is the subdomain you use to sign in to ZIdentity — e.g. if your admin portal URL is `https://admin.acme.zslogin.net`, the vanity domain is `acme`.

If the portal path above doesn't match your tenant, `vendor/zscaler-sdk-python/README.md` has the authoritative walkthrough as documented by Zscaler (the submodule is pinned and will drift; Zscaler's help site at https://help.zscaler.com/oneapi has the current live guide).

**Export the env vars:**

```bash
export ZSCALER_CLIENT_ID=...        # from ZIdentity portal
export ZSCALER_CLIENT_SECRET=...    # from ZIdentity portal (or use ZSCALER_PRIVATE_KEY for JWT)
export ZSCALER_VANITY_DOMAIN=...    # your org's ZIdentity subdomain (e.g. "acme")
export ZSCALER_CLOUD=...            # optional — omit for default commercial cloud
```

**Valid `ZSCALER_CLOUD` values** (per `vendor/zscaler-sdk-python/`):

- **Commercial** (default — omit the var): `zscaler.net`, `zscalertwo.net`, `zscalerthree.net`, `zscloud.net`, `zscalerbeta.net`, `zscalerone.net` — pick the cloud your tenant was provisioned on (visible in the ZIA admin console URL, e.g. `admin.zscalertwo.net` → `zscalertwo.net`).
- **Gov**: `zscalergov` (US Gov), `zscalerten` (US Gov 10).
- **ZPA-only gov values** also exist (`GOV`, `GOVUS`) — use the legacy path below if your ZPA tenant uses these.

**Legacy path** — use when your tenant is pre-ZIdentity, or a gov tenant that hasn't migrated:

```bash
export ZSCALER_USE_LEGACY=true
```

Legacy auth needs product-specific env vars (separate ZIA and ZPA credentials — no unified ZIdentity client). The full list is in `vendor/zscaler-sdk-python/README.md § Legacy API Framework` — at minimum, ZIA needs `ZIA_USERNAME` + `ZIA_PASSWORD` + `ZIA_API_KEY` + `ZIA_CLOUD`, and ZPA needs `ZPA_CLIENT_ID` + `ZPA_CLIENT_SECRET` + `ZPA_CUSTOMER_ID` + `ZPA_CLOUD`. If you're on legacy, the skill can still answer most of its reasoning questions from `references/` without the scripts running — credentials are only needed for tenant-specific lookups.

See [`references/zia/api.md § Authentication`](./references/zia/api.md) for the Python client instantiation patterns.

### 5. Pull the first snapshot

```bash
./scripts/snapshot-refresh.py                 # full ZIA + ZPA + ZCC dump
./scripts/snapshot-refresh.py --zia-only     # just ZIA
./scripts/snapshot-refresh.py --zpa-only     # just ZPA
./scripts/snapshot-refresh.py --zcc-only     # just ZCC
```

Writes to `snapshot/zia/*.json`, `snapshot/zpa/*.json`, and `snapshot/zcc/*.json` plus a `_manifest.json` with timestamps and per-resource counts. The public upstream repo keeps `snapshot/` empty via `.gitkeep` — **your fork is expected to commit real snapshots.** The skill cites `snapshot/` when answering tenant-specific questions; without it, most tenant-specific answers revert to "I can't verify, here's the general mechanism."

### 6. Try an operational script

With snapshot in place:

```bash
# "What rules reference the category this URL falls into?"
./scripts/url-lookup.py https://www.reddit.com

# "What SSL bypasses are we running, and which are risky?"
./scripts/ssl-audit.py --min-risk MEDIUM

# "Can user alice@corp.example.com access hr.internal.example.com?"
./scripts/access-check.py --user alice@corp.example.com hr.internal.example.com
```

Full inventory under [Helper scripts](#helper-scripts) below.

### 7. Run the evals

```bash
# Uses Anthropic's skill-creator harness (if available) to run each prompt
# with and without the skill loaded, and diff the outputs.
# evals/evals.json contains 14 canonical Q→A prompts with structured assertions.
cat evals/evals.json | jq '.evals[] | {id, prompt}'
```

Each eval entry now includes `assertions`, `must_cite_files`, `must_not_say`, and `expected_confidence` to let an eval harness grade structurally, not just on prose. See `evals/evals.json § schema_notes` for the format.

## Helper scripts

All scripts use the [uv single-file script](https://docs.astral.sh/uv/guides/scripts/) pattern — `#!/usr/bin/env -S uv run --quiet --script` shebang, inline dependency declarations, no virtual-env setup needed. Each reads credentials from the env vars above.

Each script's header comment carries a **Status** line — `functional`, `scaffold`, or `stub`. Scaffolds have docstrings, argument parsing, auth wiring, and logical structure in place but leave TODOs where live-API response shape needs to be confirmed against a real tenant; they won't produce useful output until the fork admin fills those in. Stubs are placeholders.

| Script | Status | Question it answers | Notes |
|---|---|---|---|
| `scripts/url-lookup.py <url>` | functional | Which URL categories cover this URL, and which rules reference those categories? | Implements MCP `investigate-url` workflow. |
| `scripts/snapshot-refresh.py` | functional | Bulk dump ZIA + ZPA + ZCC config to `snapshot/` | Foundation for all tenant-specific skill answers. Dumps ZIA (URL categories, URL-filter rules, CAC rules, SSL-inspection rules, advanced settings), ZPA (app-segments, segment groups, server groups, access policies), and ZCC (forwarding profiles, trusted networks, fail-open policies, web policies). `--zia-only` / `--zpa-only` / `--zcc-only` flags limit scope. |
| `scripts/access-check.py --user X <url>` | scaffold | Can user X access URL, and which policy layer decides? | Walks SSL → URL Filter → CAC → DLP → Firewall. Flags DLP-not-effective under SSL bypass. Pre-checks activation status. TODOs where per-layer SDK response traversal needs real tenant output to confirm. |
| `scripts/ssl-audit.py` | scaffold | Which SSL Inspection rules are bypassing what, with what risk? | CRITICAL/HIGH/MEDIUM/LOW classification per `ssl-inspection.md` rubric. `--min-risk`, `--forwarding`, `--with-dlp` flags. |
| `scripts/sandbox-check.py --md5 <hash> --url <url>` | scaffold | Why was this file blocked / unanalyzed / stuck in quarantine? | Detects static-analysis fast-path, SSL-bypass-prevents-Sandbox, Basic-vs-Advanced tier mismatch. Surfaces the "Malware Protection / ATP have no API" limit. |
| `scripts/connector-health.py [--group <name>]` | scaffold | Is connector group X healthy? | Checks provisioning-key exhaustion (#1 enrollment failure), runtime status, version lag, cert expiry. |
| `scripts/zpa-app-check.py --fqdn <fqdn>` | scaffold | Is this app properly onboarded in ZPA end-to-end? | Validates segment → server group → connector group → access policy chain. Flags port-mismatch-as-dropped. |
| `scripts/splunk-query.sh <spl>` | stub | Run an SPL query against Zscaler logs | Placeholder; implement for your SIEM. |

All Python scripts accept `--json` for machine-readable output where appropriate.

### Expected first-run output (`snapshot-refresh.py`)

A successful run against a small tenant looks like:

```
$ ./scripts/snapshot-refresh.py --zia-only
zia:
  ✓ url-categories: 142 records → snapshot/zia/url-categories.json
  ✓ url-filtering-rules: 37 records → snapshot/zia/url-filtering-rules.json
  ✓ cloud-app-control-rules: 12 records → snapshot/zia/cloud-app-control-rules.json
  ✓ ssl-inspection-rules: 8 records → snapshot/zia/ssl-inspection-rules.json
  ✓ advanced-settings: 1 records → snapshot/zia/advanced-settings.json

manifest → snapshot/_manifest.json
```

Lines prefixed `!` indicate a per-resource fetch failure (the run continues). Lines prefixed `-` indicate the SDK surface for that resource wasn't found (likely an SDK version lag) — those don't block the rest of the run.

## Layout

```
SKILL.md                   routing hub Claude reads on every invocation
PLAN.md                    crash-recovery / hand-off artifact (roadmap, pending lab tests, gaps)
references/                lazy-loaded reference docs
    _portfolio-map.md      single-page index of every Zscaler product (Tier 1 deep-dive / Tier 2 awareness / Tier 3 out-of-scope)
    _primer/               prerequisite concepts (networking, zero trust, identity, Zscaler platform shape)
    _layering-model.md     three-layer framing: general docs / tenant config / SME tribal knowledge
    _clarifications.md     canonical index of open / partial / resolved ambiguities
    _template.md           YAML front-matter template for new reference files
    zia/                   ZIA (Internet & SaaS) topics
    zpa/                   ZPA (Private Access), including AppProtection (inline WAF/IPS) and Browser Access
    zcc/                   ZCC (Client Connector) topics
    zdx/                   ZDX (Digital Experience) topics
    zbi/                   ZBI (Cloud Browser Isolation / Zero Trust Browser) topics
    zidentity/             ZIdentity (unified auth / step-up) topics
    cloud-connector/       Cloud & Branch Connector (ZTW / ZTC / CBC) topics
    zwa/                   ZWA (Workflow Automation — DLP incidents) topics
    deception/             Zscaler Deception (decoys, honeypots, post-perimeter detection)
    risk360/               Risk360 (cyber risk quantification, Monte Carlo, CISO board reporting)
    ai-security/           AI Security family (AI Guard / AI Guardrails / AI Red Teaming / governance pillars)
    zms/                   ZMS — Microsegmentation (workload east-west, host-agent + WFP/nftables)
    shared/                cross-product topics (policy evaluation, terminology, activation, SIPA, SCIM, cloud architecture, OneAPI)
vendor/                    upstream sources as git submodules (SDKs, TF providers, MCP server)
    zscaler-help/          Zscaler help-site PDFs + Playwright-captured markdown (pinned bibliography)
scripts/                   operational tooling (URL lookup, access check, SSL audit, etc.)
evals/                     canonical Q→A test prompts with structured assertions
snapshot/                  tenant config dumps — empty upstream, populated per-fork
```

Every reference file carries YAML front-matter (`product`, `topic`, `content-type`, `last-verified`, `confidence`, `source-tier`, `sources`, `author-status`). See [`references/_template.md`](./references/_template.md).

## Submodule management

To bump an individual submodule to upstream HEAD:

```bash
git submodule update --remote vendor/zscaler-sdk-python
git add vendor/zscaler-sdk-python && git commit -m "bump sdk-python"
```

Expect to do this periodically — upstream SDK / TF provider releases add new resource types and validator enums that `references/zia/api.md` and `references/zpa/api.md` should track.

## Contributing

- Reference files start as `author-status: stub` with TODO headings. Pick one, fill it in, bump to `draft`, add sources.
- Keep hand-authored reasoning (`content-type: reasoning`) separate from reproduced/paraphrased API docs (`content-type: reference`). The distinction matters for later training use.
- When you change Zscaler behavior docs, update `last-verified` to today's date.
- Resolving a clarification: update the entry in `references/_clarifications.md` in place — set `Status: resolved`, add an `Answer:` paragraph, cite sources. Don't delete resolved entries; other docs link to them by anchor.
- Adding a new clarification: pick the next `<area>-<num>` ID, link both ways (from the origin reference doc to the clarification, and from the clarification back to the origin).

## Testing the skill

`evals/evals.json` has the canonical prompts with structured assertions. The format is compatible with Anthropic's `skill-creator` eval harness (runs each prompt with and without the skill loaded, diffs the outputs). For tenant-specific prompts (e.g., eval #1), `tenant_data_required: true` signals that the harness should expect a decline-with-helpful-pointers when `snapshot/` is empty.

## Known gaps (read before filing issues)

- **Malware Protection and ATP blocks have NO API coverage.** `scripts/sandbox-check.py` surfaces this explicitly. `references/zia/malware-and-atp.md` covers the operational/console-only layer; diagnosis of specific blocks still requires the ZIA Admin Console.
- **Five operational scripts are scaffolds.** `access-check.py`, `ssl-audit.py`, `sandbox-check.py`, `connector-health.py`, `zpa-app-check.py` have auth wiring and structure but leave TODOs where SDK response shape needs confirmation against a real tenant. `url-lookup.py` and `snapshot-refresh.py` are complete end-to-end.
- **Several clarifications remain open** because they require tenant-specific lab tests — see `PLAN.md § Pending lab tests` (6 items including ZCC int-enum semantic mappings).
- **Snapshot schema docs deferred** — will be written against real tenant output post-fork, not inferred pre-fork. See `PLAN.md § 4. Snapshot schema docs`.
- **Z-Tunnel wire-format internals are not customer-documented.** `references/zcc/z-tunnel.md` covers the operational layer (CONNECT-vs-DTLS, single-IP-NAT requirement, GRE incompatibility, 4-layer bypass architecture). Protocol-level questions (framing, cipher, fallback triggers) remain Zscaler Support territory.
- **Tier 2 awareness only** (one-paragraph treatment in [`references/_portfolio-map.md`](./references/_portfolio-map.md), no deep-dive): ZINS (shadow-IT NSS Collector), EASM, Federal Cloud variants (`zscalergov`, `zscalerten`, ZPA GOV/GOVUS), plus ITDR, Resilience, DSPM, Posture Control, and others. Promoted from former "out of scope" on 2026-04-24 — the skill can route these, answer breadth questions, and redirect to Zscaler's help site, but won't claim operational depth. AI Security family and ZMS were also re-promoted to Tier 2 in that pass and have since been promoted further to Tier 1 (2026-04-25), though their coverage is marketing-grounded with no SDK module.
- **Truly out-of-scope products:** currently none — Tier 3 is reserved for deprecated / internal / unshipped products.

## License

Licensed under FSL-1.1-Apache-2.0 (Functional Source License, Apache 2.0 Future License). See [`LICENSE.md`](./LICENSE.md). Personal, internal, educational, and non-commercial use is permitted; commercial bundling into products or services that compete with this work requires a separate license. Each version converts to Apache 2.0 two years after release.
