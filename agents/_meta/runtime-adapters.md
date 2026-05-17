---
topic: "runtime-adapters"
title: "Runtime adapters and portable skills"
content-type: reference
last-verified: "2026-05-17"
confidence: high
source-tier: practice
sources:
  - "AGENTS.md"
  - "SKILL.md"
  - "agents/README.md"
author-status: draft
---

# Runtime adapters and portable skills

This repo separates canonical workflow logic from runtime-specific adapter
files.

## Canonical layer

These files are source of truth:

- `AGENTS.md` — repository operating contract for coding agents.
- `SKILL.md` — high-level Zscaler skill entrypoint and routing surface.
- `agents/**` — canonical workflow playbooks, methodologies, grounding cards,
  diagnostics templates, and role conventions.
- `references/**` — Zscaler product and behavior references.
- `scripts/**` — deterministic checks and utility tooling.

## Portable skill layer

Portable Agent Skills live under `.agents/skills/`.

Each skill should be a thin loader that:

1. Declares trigger metadata in its `SKILL.md` frontmatter.
2. Points to the canonical workflow under `agents/**`.
3. Lists on-demand dependencies without re-stating the whole workflow.

The skill should not copy long command bodies from `.claude/`, `.windsurf/`, or
other runtime folders.

## Adapter layer

Runtime adapters may live under directories such as:

- `.claude/`
- `.windsurf/`
- future runtime-specific directories

Adapters may add runtime conveniences, such as slash-command arguments,
clickable-question support, UI-specific wording, or local save-path details.
They must not redefine workflow logic that belongs under `agents/**`.

Downstream installations may generate, replace, or omit adapter files. Generated
adapter files should not be treated as canonical source.

Runtime-specific skill mirrors must not reuse names from `.agents/skills/`.
Some runtimes register both portable and runtime-local skills when names collide,
which makes selection ambiguous. If a downstream installation needs to generate
runtime-local skill wrappers, use a distinct runtime/local prefix until that
runtime can consume the portable skill directly.

## Migration rule

When adding or revising a workflow:

1. Update the canonical workflow under `agents/**`.
2. Add or update a portable skill under `.agents/skills/` if the workflow should
   be natively discoverable by open-standard agent runtimes.
3. Keep Claude, Windsurf, and other runtime wrappers thin.
4. Remove copied workflow text from adapters whenever the same behavior is
   already expressed canonically.
5. Avoid same-name skill wrappers across `.agents/skills/` and runtime-specific
   skill directories.
