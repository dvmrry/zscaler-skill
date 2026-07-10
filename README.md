# zscaler-skill

[![Doc hygiene](https://github.com/dvmrry/zscaler-skill/actions/workflows/check-hygiene.yml/badge.svg)](https://github.com/dvmrry/zscaler-skill/actions/workflows/check-hygiene.yml)
[![Release](https://img.shields.io/github/v/release/dvmrry/zscaler-skill)](https://github.com/dvmrry/zscaler-skill/releases)
[![License](https://img.shields.io/badge/license-FSL--1.1--Apache--2.0-blue)](LICENSE.md)

> An agent skill that makes AI assistants reason **correctly** about Zscaler — rule precedence, matching semantics, and policy evaluation order — instead of answering confidently and wrong.

The product is **codified behavior**, not API access. An agent with live API keys and no behavioral model will still tell you the wrong rule won, that `*.foo.com` matches `foo.com`, or that SSL inspection happens once. This skill encodes how Zscaler actually behaves, with every claim graded by source and confidence. Unofficial; not affiliated with, endorsed by, or sponsored by Zscaler.

## What it knows

- **The behavior LLMs hallucinate** — URL-filter rule order and first-match semantics, the wildcard-vs-exact specificity gotcha, the two-pass SSL inspection model, Cloud App Control ↔ URL Filtering interaction, ZPA app-segment matching, and cross-product policy evaluation.
- **Honest coverage tiers** — deep operational depth (SDK / Terraform / OneAPI) on ZIA, ZPA, ZCC, ZDX, ZIdentity, and Cloud & Branch Connector; awareness-level on the rest of the portfolio — and it tells you which tier it's standing on before it answers.
- **Source-graded answers** — every reference carries `confidence`, `source-tier`, and `sources`; a [verification protocol](./references/_meta/verification-protocol.md) gates what earns a place, so unverified claims don't get dressed up as fact.
- **Tenant-aware, fail-closed** — answers tenant-specific questions ("is `reddit.com` blocked in *our* tenant?") from observed tenant state: mounted runtime-data snapshots/diffs (`_data/` by default, configurable in `zscaler-skill-runtime.json`), explicit command output, or the read-only `zscalerctl` companion when available. It declines rather than guesses when there is no tenant observation.
- **Structured workflows** — repeatable, evidence-based roles for investigation, research, audit, and review when a task needs a defined output, not just a chat answer.

[`SKILL.md`](./SKILL.md) is the routing surface — the question-shape table that sends each query to the right reference. [`references/_meta/portfolio-map.md`](./references/_meta/portfolio-map.md) is the per-product coverage index.

## Install

The skill is a directory Claude (or any file-based agent) loads. Symlink it into your skills path:

```bash
git clone <fork-url> zscaler-skill
cd zscaler-skill

git config core.hooksPath .githooks
mkdir -p ~/.claude/skills
ln -s "$(pwd)" ~/.claude/skills/zscaler
```

That is enough for grounded Q&A from the committed reference corpus. Maintainers
who audit source provenance, refresh references, or run the researcher workflow
should also initialize the pinned upstream source repositories:

```bash
git submodule update --init --recursive
```

Install Node 18+ for the deterministic workflow helpers. Full private-fork
setup — source checkout, credentials, runtime data, and snapshot behavior — is
in [docs/getting-started.md](./docs/getting-started.md).

## Quick start

Ask grounded questions directly:

```
@zscaler why does my deny rule lose to a lower allow rule?
@zscaler does *.example.com cover app.example.com?
```

For tenant-specific answers, mount a runtime-data snapshot into `_data/`
or the configured work-mirror runtime mount. The committed
`zscaler-skill-runtime.json` controls the public, non-secret mount layout; the
ignored `zscaler-skill-setup.json` is only needed when the setup helper should
clone or copy from a private source.

```bash
node scripts/setup-data-mount.mjs --data-url <git-url-or-path> --data-ref <branch> --mode checkout
node scripts/check-data-contract.mjs
```

The snapshot itself is populated out of band — e.g. a private work mirror, a local runtime-data checkout, or a sanitized dump from the read-only [`zscalerctl`](https://github.com/dvmrry/zscalerctl) CLI. Pre-release companion model: `zscalerctl` observes tenant state, the runtime-data mount stores fast local snapshots/diffs, and this skill interprets the observed state with policy semantics. Credentialed tenant reads are out of scope for this repo.

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
- [docs/getting-started.md](./docs/getting-started.md) — fork setup, credentials, first snapshot, first script run
- [scripts/README.md](./scripts/README.md) — script inventory, support boundary, conventions
- [docs/maintenance.md](./docs/maintenance.md) — CI, automated weekly upstream refresh, sticky issues, contribution rules

**Reference**
- [references/_meta/portfolio-map.md](./references/_meta/portfolio-map.md) — product coverage tiers
- [references/_meta/clarifications.md](./references/_meta/clarifications.md) — open / partial / resolved ambiguity register
- [references/_meta/tooling.md](./references/_meta/tooling.md) — pre-release `zscalerctl` companion contract and runtime-data cache model
- [references/_meta/verification-protocol.md](./references/_meta/verification-protocol.md) — how a finding earns its place
- [docs/data-contract/](./docs/data-contract/) — expected runtime-data layout

**Project**
- [CHANGELOG.md](./CHANGELOG.md) · [PLAN.md](./PLAN.md)

## Known boundaries

- Malware Protection and ATP blocks have no API coverage — diagnosing a specific block still needs the ZIA Admin Console.
- Some clarifications stay open pending tenant-specific lab tests (see [PLAN.md](./PLAN.md)).
- Snapshot schema docs are deferred until real tenant output exists.
- Z-Tunnel wire-format internals are not customer-documented.
- Tier 3 / Tier 4 portfolio areas can be routed and explained, but the skill will not invent SDK, Terraform, or API behavior for them.

## License

Licensed under [FSL-1.1-Apache-2.0](./LICENSE.md).
