# zscaler-skill

[![Doc hygiene](https://github.com/dvmrry/zscaler-skill/actions/workflows/check-hygiene.yml/badge.svg)](https://github.com/dvmrry/zscaler-skill/actions/workflows/check-hygiene.yml)

A Claude skill for reasoning about Zscaler environments: ZIA, ZPA, ZCC, ZDX,
ZBI, ZIdentity, Cloud & Branch Connector, ZWA, ZPA AppProtection, and the
broader Zscaler portfolio.

The core value is codified behavior: policy evaluation order, rule precedence,
wildcard semantics, source confidence, product-fit framing, and cross-product
interactions that raw LLMs often hallucinate.

## What this is

This repository is a knowledge skill and workflow base for grounded Zscaler
answers. It helps an agent answer simple lookups, policy-order questions,
tenant-specific questions backed by snapshots, and structured investigations.
API access is useful, but it is not the point; an agent with API access and no
behavioral model can still answer confidently and wrong.

The repo follows the [Anthropic skill conventions](https://github.com/anthropics/skills):
`SKILL.md` at the root, progressive disclosure through `references/`, helper
scripts in `scripts/`, and eval prompts in `references/_meta/evals/`.

## Entry points

Default to `@zscaler`; use procedural roles when the task has a defined output.

- **Cascade always-on guidance**: Windsurf discovers [`AGENTS.md`](./AGENTS.md)
  and [`.windsurf/rules/zscaler.md`](./.windsurf/rules/zscaler.md). These are
  thin adapters that load canonical logic under `agents/`.
- **`@zscaler`**: ad-hoc grounded Q&A. The canonical playbook is
  [`agents/zscaler/prompt.md`](./agents/zscaler/prompt.md); the repo-root
  [`zscaler`](./zscaler) file is a thin runtime loader.
- **`/z-investigator`**: evidence-based troubleshooting; produces a discovery
  journal.
- **`/z-architect`**: capacity and scaling review; produces a recommendation
  register.
- **`/z-auditor`**: editorial and structural skill audit; produces an audit
  register.
- **`/z-soc`**: security-posture review; produces a posture register.

## Quick start

Full setup details, including ZIdentity auth, legacy auth, and snapshot
behavior, live in [docs/getting-started.md](./docs/getting-started.md).

```bash
git clone --recursive <fork-url> zscaler-skill
cd zscaler-skill

git config core.hooksPath .githooks
ln -s "$(pwd)" ~/.claude/skills/zscaler
```

Create Zscaler API credentials, export the `ZSCALER_*` environment variables,
then pull a first snapshot:

```bash
./scripts/snapshot-refresh.py
```

With a snapshot in place, try the public-safe operational path:

```bash
./scripts/url-lookup.py https://www.reddit.com
./scripts/simulate-policy.py --url https://www.reddit.com
```

The public repo treats snapshot-backed scripts and reference-hygiene tooling as
operational. Live-tenant diagnostic sketches such as `access-check.py`,
`ssl-audit.py`, `sandbox-check.py`, `connector-health.py`, and
`zpa-app-check.py` are private-overlay scaffolds until an adopter validates the
SDK response shapes against their own tenant.

## Documentation

- [Getting started](./docs/getting-started.md): private fork setup, credentials,
  first snapshot, first script run.
- [Scripts](./scripts/README.md): script inventory, support boundary,
  dependencies, and script conventions.
- [Maintenance](./docs/maintenance.md): CI, sticky issues, submodule updates,
  contribution rules, testing, and known gaps.
- [PLAN.md](./PLAN.md): crash-recovery and roadmap state.
- [Portfolio map](./references/_meta/portfolio-map.md): coverage tiers across
  Zscaler products.
- [Clarifications](./references/_meta/clarifications.md): open, partial, and
  resolved ambiguity register.

## Repository map

```text
SKILL.md                 skill routing hub
AGENTS.md                repo runtime guide for coding agents
agents/                  canonical prompts, diagnostics, and role workflows
references/              sourced Zscaler behavior and product references
references/_meta/        portfolio map, clarifications, evals, templates
scripts/                 public tooling, maintenance checks, private scaffolds
vendor/                  pinned upstream Zscaler sources as git submodules
_data/snapshot/          tenant config dumps; empty upstream, populated locally
_data/iac/               tenant IaC overlay; empty upstream, populated per fork
docs/                    project docs and rendered static docs assets
```

Every reference file carries YAML frontmatter (`product`, `topic`,
`content-type`, `last-verified`, `confidence`, `source-tier`, `sources`,
`author-status`). See [`references/_meta/template.md`](./references/_meta/template.md).

## Known boundaries

- Malware Protection and ATP blocks have no API coverage; diagnosis of specific
  blocks still requires the ZIA Admin Console.
- Several clarifications remain open because they require tenant-specific lab
  tests; see [`PLAN.md`](./PLAN.md).
- Snapshot schema docs are deferred until real tenant output exists.
- Z-Tunnel wire-format internals are not customer-documented.
- Tier 3 and Tier 4 portfolio areas can be routed and explained, but the skill
  must not invent SDK, Terraform, or API behavior for them.

## License

Licensed under FSL-1.1-Apache-2.0. See [`LICENSE.md`](./LICENSE.md).
