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
  - "agents/architect/prompt.md"
  - "agents/auditor/prompt.md"
  - "agents/soc/prompt.md"
  - "agents/retro/harness.md"
  - "agents/retro/prompt.md"
author-status: draft
---

# Agent workflows

This directory holds the agent infrastructure for the skill — playbooks, methodologies, grounding cards, and diagnostics templates that drive role-specific agent workflows. The directory is product-agnostic: content here defines *how* an agent operates, not *what* it knows about Zscaler products. Product knowledge lives in `references/`.

## Why this is separate from `references/`

| Directory | Holds | Audience |
|---|---|---|
| `agents/` | Agent infrastructure: how to operate (playbooks, methodologies, grounding cards, diagnostics templates) | AI agents executing role-specific workflows |
| `references/` | Product knowledge: what to know (Zscaler product docs, schemas, log refs) | Both agents (as evidence) and human readers |
| `_data/` | Evidence and state: tenant snapshots, IaC overlays, local case artifacts, and eval outputs | Agents and operators investigating current state |
| `.agents/skills/` | Agent Skills: trigger metadata and loaders for canonical workflows | Codex, Windsurf, and other compatible runtimes |
| `_meta/` | Repo-level meta-documentation (clarifications, portfolio map, audits) | Maintainers and auditing agents |

The split keeps `references/` focused as a knowledge base, lets agent personas route to predictable paths, and makes it easier to add new agent workflows without touching product docs.

## Available workflows

| Role | Slash command | Artifacts | Description |
|---|---|---|---|
| **Investigator** | `/z-investigator` | [`prompt`](./investigator/prompt.md) · [`harness`](./investigator/harness.md) · [`case intake`](./investigator/case-intake.md) · [`methodology`](./investigator/methodology.md) · [`grounding`](./investigator/grounding/) · [`diagnostics template`](./investigator/diagnostics/template.md) | Evidence-based troubleshooting — discovery journal, claim status, anti-fabrication |
| **Setup** | `zscaler-skill-setup` | [`prompt`](./setup/prompt.md) | `_data` runtime-data mount setup and repair using deterministic helper scripts |
| **Researcher** | `/z-researcher` | [`prompt`](./researcher/prompt.md) | Citation-backed reference expansion with extraction, isolated writing, and verification checkpoints |
| **Architect** | `/z-architect` | [`prompt`](./architect/prompt.md) · [`methodology`](./architect/methodology.md) · [`diagnostics template`](./architect/diagnostics/template.md) | Capacity, scaling, and structural-risk review with recommendation register |
| **Auditor** | `/z-auditor` | [`prompt`](./auditor/prompt.md) · [`methodology`](./auditor/methodology.md) | Editorial / structural / hygiene lint of references and tenant configuration |
| **SOC** | `/z-soc` | [`prompt`](./soc/prompt.md) | Security posture review — RBAC least-privilege, telemetry coverage, threat-model-anchored findings |
| **Retro** | `/z-retro` | [`prompt`](./retro/prompt.md) · [`harness`](./retro/harness.md) · [`methodology`](./retro/methodology.md) | Journal-first incident postmortem — warning ledger, source map, proceed/stop decision gate |

Each role's `prompt.md` is the playbook the slash command activates. `harness.md` is the canonical phase/checkpoint contract when a workflow needs strict turn sequencing. `case-intake.md` defines a deterministic phase artifact when prose-only checkpoints are not reliable enough. `methodology.md` is the discipline the playbook references. `grounding/` holds lightweight symptom-to-context profiles. `diagnostics/template.md` is an authoring template for verified ordered diagnostics; it is not a runtime dependency for ordinary first responses.

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

1. Create `agents/{role}/` directory with at minimum `prompt.md` (the playbook).
2. Add `harness.md` when the role needs strict phase order, checkpoints, output shapes, or cross-turn state handling.
3. Add `methodology.md` if the role has a distinct evidence/finding discipline; otherwise reference an existing role's methodology.
4. Add `grounding/` only when the role needs symptom-to-context profiles that normal topic loading misses.
5. Add `diagnostics/template.md` only when the role needs an authoring template for verified ordered diagnostics.
6. Update this README's "Available workflows" table.
7. Add a portable skill under `.agents/skills/` when the workflow should be natively discoverable by Codex, Windsurf, or another Agent Skills-compatible runtime.
8. Wire optional runtime adapters (`.claude/commands/<role>.md` for Claude Code, `.windsurf/workflows/<role>.md` for Windsurf) that invoke the canonical prompt. Keep adapters thin when the runtime can follow the canonical workflow directly; allow explicit reinforcement only when it points back to a canonical harness under `agents/**`.
