# zscaler-skill

[![Doc hygiene](https://github.com/dvmrry/zscaler-skill/actions/workflows/check-hygiene.yml/badge.svg)](https://github.com/dvmrry/zscaler-skill/actions/workflows/check-hygiene.yml)
[![Release](https://img.shields.io/github/v/release/dvmrry/zscaler-skill)](https://github.com/dvmrry/zscaler-skill/releases)
[![License](https://img.shields.io/badge/license-FSL--1.1--Apache--2.0-blue)](LICENSE.md)

> An agent skill that makes AI assistants reason **correctly** about Zscaler — rule precedence, matching semantics, and policy evaluation order — instead of answering confidently and wrong.

The product is **codified behavior**, not API access. An agent with live API keys and no behavioral model will still tell you the wrong rule won, that `*.foo.com` matches `foo.com`, or that SSL inspection happens once. This skill encodes how Zscaler actually behaves as a knowledge graph of claims, each quoting the pinned vendor source it rests on. Unofficial; not affiliated with, endorsed by, or sponsored by Zscaler.

## What it knows

- **The behavior LLMs hallucinate** — URL-filter rule order and first-match semantics, the wildcard-vs-exact specificity gotcha, the two-pass SSL inspection model, Cloud App Control ↔ URL Filtering interaction, ZPA app-segment matching, and cross-product policy evaluation.
- **The whole portfolio, at the depth the sources allow** — ZIA, ZPA, Client Connector, ZDX, ZIdentity and Cloud & Branch Connector in operational depth (help, API contracts, Python and Go SDKs, Terraform providers, deployment modules, log formats), and every other product as far as Zscaler's own material goes. Where no source says, the graph says that instead of guessing.
- **Source-graded answers** — every claim is Tier A (it quotes a pinned source, and the quote is re-anchored on every change) or Tier B (an inference with stated conditions); what no source settles is an explicit gap, so unverified claims don't get dressed up as fact.
- **Tenant-aware, fail-closed** — answers tenant-specific questions ("is `reddit.com` blocked in *our* tenant?") from the knowledge graph plus the company overlay's records, the overlay's IaC when it declares `iac`, or live read-only `zscalerctl` when it declares `live` (runtime-data mount `_data/` by default, configurable in `zscaler-skill-runtime.json`). It declines rather than guesses when there is no tenant observation.
- **Structured workflows** — repeatable, evidence-based roles for investigation, research, audit, and review when a task needs a defined output, not just a chat answer.

## How it works

About 1,000 subjects hold 8,000 claims, 1,600 open gaps and 390 divergences (where two vendor sources disagree), plus 190 tenant object types and their fields. Agents read them through one resolver, never by opening files:

```bash
node scripts/kb.mjs resolve "why does a lower allow rule win?"   # ranked subjects for a question
node scripts/kb.mjs resolve --compact --each zia.url-filtering.rule-order zia.cloud-app-control.precedence
node scripts/kb.mjs resolve zia                                     # a product's areas
node scripts/kb.mjs surface zia_url_filtering_rules                 # API, SDK and Terraform surface
```

Each bundle carries the subject's prose, claims with their quotes, gaps, divergences, neighbors, the tenant object types it binds (with their IaC coverage and read-only `zscalerctl` command) and, when a company overlay is configured, the company's own records. [`SKILL.md`](./SKILL.md) is the agent's entry point; `node scripts/kb.mjs resolve portfolio.overview` maps each customer need to its product.

The sources are pinned: vendor repositories as git submodules, and help pages, API references and triaged GitHub issues as captures under `vendor/`. A gate re-anchors every quote on every change. The refresh loop ([docs/maintenance.md](./docs/maintenance.md)) refetches the captures and reviews which claims a source change touched, including quotes that still match beside changed code; new and changed claims also go through a model-graded audit before they land.

## Install

The skill is a directory Claude (or any file-based agent) loads. Symlink it into your skills path:

```bash
git clone <fork-url> zscaler-skill
cd zscaler-skill

git config core.hooksPath .githooks
mkdir -p ~/.claude/skills
ln -s "$(pwd)" ~/.claude/skills/zscaler
```

That is enough for grounded Q&A from the committed knowledge graph. Maintainers
who audit source provenance, refresh references, or run the researcher workflow
should also initialize the pinned upstream source repositories:

```bash
git submodule update --init --recursive
```

Install Node 24.19+ (Node 24 LTS) for the deterministic workflow helpers. Full
private-fork setup — source checkout, credentials, runtime data, and overlay
behavior — is in [docs/getting-started.md](./docs/getting-started.md).

## Quick start

Ask grounded questions directly:

```
@zscaler why does my deny rule lose to a lower allow rule?
@zscaler does *.example.com cover app.example.com?
```

For tenant-specific answers, mount the company overlay (and IaC) into `_data/`
or the configured work-mirror runtime mount. The committed
`zscaler-skill-runtime.json` controls the public, non-secret mount layout; the
ignored `zscaler-skill-setup.json` is only needed when the setup helper should
clone or copy from a private source. Downstream installations can select their
own committed runtime config without rewriting the upstream root file.

```bash
# Optional downstream selector:
export ZSCALER_SKILL_RUNTIME_CONFIG=deployments/acme-zscaler-runtime.json
node scripts/runtime-data-path.mjs --json
node scripts/setup-data-mount.mjs --data-url <git-url-or-path> --data-ref <branch> --mode checkout
node scripts/check-data-contract.mjs
```

The overlay is provided out of band — e.g. a private work mirror or a local runtime-data checkout; live reads come from the read-only [`zscalerctl`](https://github.com/dvmrry/zscalerctl) CLI. Pre-release companion model: `zscalerctl` observes tenant state (never kept as a standing tenant cache; case evidence is saved only in the case), and this skill interprets the observed state with policy semantics. Credentialed tenant reads are out of scope for this repo.

## Entry points

Default to `@zscaler`; reach for a procedural role when the task has a defined deliverable.

| Command | Use it for | Produces |
| --- | --- | --- |
| `@zscaler` | Ad-hoc grounded Q&A and lookups | A sourced answer with confidence |
| `zscaler-skill-setup` | Set up or repair the configured runtime-data mount | A verified data mount |
| `/z-investigator` (`/z-investigator-resume`) | Evidence-based troubleshooting | A discovery journal behind a case-intake + turn-ledger gate |
| `/z-researcher` | Citation-backed reference expansion | New reference content with verification checkpoints |
| `/z-architect` | Capacity and scaling review | A recommendation register |
| `/z-auditor` | Editorial / structural skill audit | An audit register |
| `/z-soc` | Security-posture review | A posture register |
| `/z-retro` | Journal-first incident postmortem | A warning ledger + proceed/stop decision |

Each role's canonical logic lives in `agents/<role>/workflow.md`; the loaders
under `.agents/skills/`, `.claude/commands/`, and `.devin/workflows/` (plus the
repo-root [`zscaler`](./zscaler) file) are thin pointers at those workflows,
not copies.

Portable Agent Skill names are `zscaler`, `zscaler-skill-setup`,
`zscaler-investigator`, `zscaler-researcher`, `zscaler-architect`,
`zscaler-auditor`, `zscaler-soc`, and `zscaler-retro`. Claude and Devin expose
the `/z-*` command names shown above; setup is a portable skill rather than a
slash-command adapter. See [`AGENTS.md`](./AGENTS.md) for the runtime model.

## Documentation

**Usage**
- [docs/getting-started.md](./docs/getting-started.md) — fork setup, credentials, overlay setup, first script run
- [scripts/README.md](./scripts/README.md) — script inventory, support boundary, conventions
- [docs/maintenance.md](./docs/maintenance.md) — the refresh loop, CI, sticky issues, contribution rules

**Reference**
- [docs/tooling.md](./docs/tooling.md) — pre-release `zscalerctl` companion contract and runtime-data cache model
- [docs/kb-layout.md](./docs/kb-layout.md) — what lives where in the knowledge graph
- [docs/data-contract/](./docs/data-contract/) — expected runtime-data layout

**Project**
- [CHANGELOG.md](./CHANGELOG.md) · [PLAN.md](./PLAN.md)

## Known boundaries

- Malware Protection and ATP **settings** are queryable/configurable through the SDK/API; diagnosing which engine blocked a specific transaction still requires Web Insights or equivalent transaction logs.
- Open questions are gaps in the graph, each with what would resolve it; some need tenant-specific lab tests.
- Field shapes for tenant types come from `node scripts/kb.mjs resolve <type-id>` (for example `zia/url-filtering-rules`); validate them against real tenant output before treating them as tenant-confirmed.
- Z-Tunnel wire-format internals are not customer-documented.
- Products Zscaler documents only in marketing material are explained as marketed; the skill will not invent SDK, Terraform or API behavior for them.

## License

Licensed under [FSL-1.1-Apache-2.0](./LICENSE.md).
