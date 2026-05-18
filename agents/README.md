---
topic: "agents-index"
title: "Agent workflows — index and conventions"
content-type: reference
last-verified: "2026-05-17"
confidence: high
source-tier: practice
sources:
  - "agents/investigator/harness.md"
  - "agents/investigator/prompt.md"
  - "agents/researcher/prompt.md"
  - "agents/architect/harness.md"
  - "agents/architect/prompt.md"
  - "agents/auditor/harness.md"
  - "agents/auditor/prompt.md"
  - "agents/soc/harness.md"
  - "agents/soc/prompt.md"
  - "agents/retro/harness.md"
  - "agents/retro/prompt.md"
author-status: draft
---

# Agent workflows

This directory holds the agent infrastructure for the skill — playbooks, methodologies, grounding cards/indexes, and diagnostics templates that drive role-specific agent workflows. The directory is product-agnostic: content here defines *how* an agent operates, not *what* it knows about Zscaler products. Product knowledge lives in `references/`.

## Why this is separate from `references/`

| Directory | Holds | Audience |
|---|---|---|
| `agents/` | Agent infrastructure: how to operate (playbooks, methodologies, grounding cards/indexes, diagnostics templates) | AI agents executing role-specific workflows |
| `references/` | Product knowledge: what to know (Zscaler product docs, schemas, log refs) | Both agents (as evidence) and human readers |
| `_data/` | Evidence and state: tenant snapshots, IaC overlays, local case artifacts, and eval outputs | Agents and operators investigating current state |
| `.agents/skills/` | Agent Skills: trigger metadata and loaders for canonical workflows | Codex, Windsurf, and other compatible runtimes |
| `_meta/` | Repo-level meta-documentation (clarifications, portfolio map, audits) | Maintainers and auditing agents |

The split keeps `references/` focused as a knowledge base, lets agent personas route to predictable paths, and makes it easier to add new agent workflows without touching product docs.

## Available workflows

| Role | Slash command | Artifacts | Description |
|---|---|---|---|
| **Zscaler Q&A** | `@zscaler` | [`workflow`](./zscaler/workflow.md) · [`prompt`](./zscaler/prompt.md) | Ad-hoc grounded Q&A with citations and handoff detection |
| **Investigator** | `/z-investigator` | [`workflow`](./investigator/workflow.md) · [`prompt`](./investigator/prompt.md) · [`harness`](./investigator/harness.md) · [`case intake`](./investigator/case-intake.md) · [`methodology`](./investigator/methodology.md) · [`grounding`](./investigator/grounding/) · [`diagnostics template`](./investigator/diagnostics/template.md) | Evidence-based troubleshooting — discovery journal, claim status, anti-fabrication |
| **Setup** | `zscaler-skill-setup` | [`workflow`](./setup/workflow.md) · [`prompt`](./setup/prompt.md) | `_data` runtime-data mount setup and repair using deterministic helper scripts |
| **Researcher** | `/z-researcher` | [`workflow`](./researcher/workflow.md) · [`prompt`](./researcher/prompt.md) · [`grounding`](./researcher/grounding/) | Citation-backed reference expansion with extraction, isolated writing, and verification checkpoints |
| **Architect** | `/z-architect` | [`workflow`](./architect/workflow.md) · [`prompt`](./architect/prompt.md) · [`harness`](./architect/harness.md) · [`grounding`](./architect/grounding/) · [`methodology`](./architect/methodology.md) · [`diagnostics template`](./architect/diagnostics/template.md) | Capacity, scaling, and structural-risk review with recommendation register |
| **Auditor** | `/z-auditor` | [`workflow`](./auditor/workflow.md) · [`prompt`](./auditor/prompt.md) · [`harness`](./auditor/harness.md) · [`methodology`](./auditor/methodology.md) | Editorial / structural / hygiene lint of references and tenant configuration |
| **SOC** | `/z-soc` | [`workflow`](./soc/workflow.md) · [`prompt`](./soc/prompt.md) · [`harness`](./soc/harness.md) · [`grounding`](./soc/grounding/) | Security posture review — RBAC least-privilege, telemetry coverage, threat-model-anchored findings |
| **Retro** | `/z-retro` | [`workflow`](./retro/workflow.md) · [`prompt`](./retro/prompt.md) · [`harness`](./retro/harness.md) · [`grounding`](./retro/grounding/) · [`methodology`](./retro/methodology.md) | Journal-first incident postmortem — warning ledger, source map, proceed/stop decision gate |

Each role's `workflow.md` is the runtime-neutral entrypoint. It owns the
`required-reads` bootstrap list, optional workflow support files, command name,
and adapter pointer checks. `prompt.md` is the playbook. `harness.md` is the
canonical phase/checkpoint contract when a workflow needs strict turn
sequencing. `case-intake.md` defines a deterministic phase artifact when
prose-only checkpoints are not reliable enough. `methodology.md` is the
discipline the playbook references. `grounding/` holds lightweight
scope-to-context profiles and conditional reference load maps. Investigator
grounding files are symptom cards; other role grounding files are pre-flight
load and discipline indexes. `diagnostics/template.md` is an authoring template
for verified ordered diagnostics; it is not a runtime dependency for ordinary
first responses.

## Cross-cutting agent infrastructure

Files at the root of `agents/` apply across roles:

- [`siem-emission-discipline.md`](./siem-emission-discipline.md) — execution modes (agent-direct / user-handoff / coworking), placeholder plumbing, public/private boundary for SIEM queries
- [`tenant-schema-derivation.md`](./tenant-schema-derivation.md) — canonical-vs-tenant schema distinction, derivation recipes per SIEM, storage template

## Frontmatter conventions

Files in `agents/` use a slightly different frontmatter shape than `references/`:

```yaml
---
role: investigator                    # role this artifact belongs to (omit for cross-cutting)
artifact: prompt                       # prompt | harness | case-intake | methodology | grounding | diagnostics-template
title: "..."
content-type: prompt                   # prompt | reference
last-verified: "YYYY-MM-DD"
confidence: high
source-tier: practice
sources:
  - "<path or descriptor>"
dependencies:                          # other agent artifacts this loads alongside
  - "methodology.md"
  - "../siem-emission-discipline.md"
author-status: draft
---
```

- **`role`** + **`artifact`** replace the `product:` + `topic:` pair used in `references/`. Role identifies the workflow family (investigator, setup, researcher, architect, auditor, soc, retro); artifact identifies the file's role within that family. Cross-cutting files at `agents/` root drop `role` and use `topic:` directly.
- **`dependencies:`** lists other agent artifacts this file relies on or expects to be loaded alongside. Distinct from `sources:` (where content comes from). The dependencies field is machine-readable and forms the basis for future artifact-graph tooling.

## Runtime notes

- [`_meta/windsurf-runtime-notes.md`](./_meta/windsurf-runtime-notes.md) — Windsurf-specific behavior for `.windsurf/workflows/` and `.windsurf/rules/`. Operational guidance, not workflow content.
- [`_meta/runtime-adapters.md`](./_meta/runtime-adapters.md) — canonical workflow vs portable skill vs runtime adapter policy.
- [`_meta/workflow-artifacts.md`](./_meta/workflow-artifacts.md) — future artifact-gated workflow contract notes.
- [`_meta/workflow-metadata.md`](./_meta/workflow-metadata.md) — neutral workflow metadata and validator notes.

## Adding a new role

1. Create `agents/{role}/` directory with at minimum `workflow.md` and `prompt.md`.
2. Add `harness.md` when the role needs strict phase order, checkpoints, output shapes, or cross-turn state handling.
3. Add `methodology.md` if the role has a distinct evidence/finding discipline; otherwise reference an existing role's methodology.
4. Add `grounding/` only when the role needs symptom-to-context profiles that normal topic loading misses.
5. Add `diagnostics/template.md` only when the role needs an authoring template for verified ordered diagnostics.
6. Declare first-turn files in `workflow.md` `required-reads`; use `optional-reads` for conditional workflow support files.
7. Update this README's "Available workflows" table.
8. Add a portable skill under `.agents/skills/` when the workflow should be natively discoverable by Codex, Windsurf, or another Agent Skills-compatible runtime.
9. Wire optional runtime adapters (`.claude/commands/<role>.md` for Claude Code, `.windsurf/workflows/<role>.md` for Windsurf) that invoke `agents/{role}/workflow.md`. Keep adapters thin; move workflow logic back into `agents/**`.
