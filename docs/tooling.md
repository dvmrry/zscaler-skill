# Tooling contract — zscaler-skill and zscalerctl

This is the pre-release integration contract between the Zscaler knowledge base
and `zscalerctl`. It deliberately describes the shape without making
`zscalerctl` a hard requirement before its 1.0 release.

## Layer split

| Layer | Responsibility | Not responsible for |
|---|---|---|
| `zscaler-skill` | Source-backed Zscaler reasoning: policy semantics, product behavior, source confidence, clarification boundaries, and interpretation of observed tenant state. | Live tenant reads, credential handling, raw API execution, or write tests. |
| `zscalerctl` | Read-only tenant observation: inventory, config reads, sanitized dumps, local diffs, and deterministic JSON for agents and pipelines. | Policy reasoning, precedence interpretation, or deciding whether a tenant state is correct. |
| `_data/` overlay | Fast local cache of tenant observations and case artifacts, usually generated out-of-band. | Being globally current unless its manifest or diff cadence proves freshness. |

Short version: **`zscalerctl` observes; `zscaler-skill` reasons.**

## Pre-release stance

Until `zscalerctl` is formally adopted as the companion 1.0 tenant-observation
tool, use soft language:

- "when `zscalerctl` is installed"
- "if `@zscalerctl` is available"
- "prefer `zscalerctl` output or dumps when provided"
- "draft a bounded read-only command for the operator to run"

Do not make live `zscalerctl` execution mandatory for general Zscaler behavior
answers. The skill must still answer from `references/` when no tenant data is
needed.

## Tenant-observation precedence

When a question needs tenant facts, use this order:

1. **Knowledge** — `node scripts/kb.mjs resolve <id | text>` (public index plus
   the company overlay's records). Its `tiers` block says which of 2 and 3 are
   available.
2. **IaC** — the overlay's IaC files, when `overlay.json` declares `iac`. The
   normal fast path; it reflects the last backfill.
3. **Explicit fresh command output** — user-provided `zscalerctl --format json`
   output; for a case, save it under `_data/cases/<slug>/evidence/`.
4. **On-demand read-only `zscalerctl` command** — when `overlay.json` declares
   `live` and IaC does not cover the type, field or value, is too stale for the
   question, or the question is about drift (including "what changed?" and
   regression questions).
5. **Static references** — always used to interpret the observed state; never a
   substitute for tenant facts.

Live results are never kept as a standing tenant cache; a case saves them under its own `evidence/` and cites them in the journal. The overlay lives at
`$ZSCALER_KB_OVERLAY` or `<runtime-data mount>/overlay/`.

## Handoff pattern

When `@zscaler` receives a tenant-specific question and no usable tenant
observation is already present, use this shape:

> This needs tenant observation. If `@zscalerctl` is installed, use it for the
> read-only fetch, then return the JSON here; I will apply the Zscaler policy
> semantics. If you prefer, I can draft the bounded read-only `zscalerctl` command
> for you to run.

Keep the handoff narrow:

- enumerate before guessing resource names;
- pass `--format json` explicitly;
- prefer `list`, `get`, `show`, `dump`, and `diff`;
- do not propose create, update, delete, activate, rotate, move, or raw API
  execution;
- do not ask the operator to paste secrets or full unsanitized tenant dumps.

## IaC and live-read model

For routine use, the company overlay's IaC (declared in `overlay.json` as `iac`)
answers "what is our configuration, as of the last backfill." Agents should
prefer it for normal Q&A because it is free and local. Use live `zscalerctl`
reads (declared as `live`) only when IaC cannot answer or for drift. There is no
saved snapshot or dump tier: a live result is piped into the session for one
use; a case may save it under its own `evidence/` as part of the investigation record, but it is not a standing cache.

## Issue-routing and validation

The rosetta-stone and clarification worklists can propose read-only validation
commands, but they must not file vendor issues or run write-lane tests — those
steps are outside this skill's read-only contract and belong to the human
operator. A good validation packet includes:

- the read-only command;
- the field or enum being observed;
- the expected evidence shape;
- how the result would narrow a clarification or support an upstream issue;
- a reminder to keep tenant payloads sanitized before sharing.

## Later 1.0 flip

When `zscalerctl` is official, revisit this file and promote the language from
"optional/pre-release companion" to "canonical tenant-observation companion."
At that point, update the install docs with release-specific install commands
and make the provenance rule explicit:

> `zscalerctl` is the primary live tenant-observation authority; the overlay's
> IaC is the declared configuration it is compared against.
