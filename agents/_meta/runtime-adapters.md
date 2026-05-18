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

Portable skills assume this repository layout:

```text
.agents/skills/<skill-name>/SKILL.md
agents/<role>/prompt.md
```

Relative links from a portable skill are validated against that layout. If a
downstream fork moves `.agents/skills/` or `agents/`, it must update the loader
paths as part of that fork.

## Harness layer

Some workflows need an explicit runtime-neutral harness: checkpoint sequencing,
halt-and-wait rules, phase output shapes, journal creation order, snapshot load
caps, or other state-machine behavior that is more procedural than the role
prompt itself.

When that behavior is required for correctness, it belongs under `agents/**`
next to the role prompt, not only inside one runtime adapter. Runtime adapters
may reinforce the harness where a weaker runtime needs explicit wording, but
the canonical contract should name the harness file that both portable skills
and runtime adapters load.

`/z-investigator` is the known hard case. Its checkpoint discipline lives in
[`investigator/harness.md`](../investigator/harness.md) and the helper-backed
intake contract lives in [`investigator/case-intake.md`](../investigator/case-intake.md).
Runtime adapters should load those canonical files and reinforce the helper
commands, not carry their own copy of the full procedure.

## Artifact-gated phases

For unreliable runtimes, adapter prose is not a strong enough boundary by
itself. Use helper-backed artifacts for any phase transition where skipping the
gate would create false confidence.

The adapter pattern is:

1. Load the canonical prompt and harness.
2. Call the canonical helper command for the current phase.
3. Verify the artifact the helper produced.
4. Read back the verified artifact.
5. Continue only when the artifact says `Status: pass` and
   `Blocking Issues: none`.

Adapters should keep exact helper commands load-bearing. Do not say only "run
the deterministic helper" or "create the phase artifact." Weak runtimes may
understand that text after the fact while still failing to execute the gate.
Put the literal command shape near the instruction that requires it. If a
runtime invents an adjacent command, skips verification, or prints the next
checkpoint before the helper passes, the adapter should treat the phase as
blocked rather than continuing from chat memory.

The investigator case-intake gate is the current concrete example:

```bash
node scripts/investigator-artifacts.mjs open-case ...
node scripts/investigator-artifacts.mjs verify-case ...
```

New investigations still start with `/z-investigator`. Resume-oriented
adapters such as `/z-investigator-resume` may exist, but they must verify the
case-intake artifact before continuing.

## Adapter layer

Runtime adapters may live under directories such as:

- `.claude/`
- `.windsurf/`
- future runtime-specific directories

Adapters may add runtime conveniences, such as slash-command arguments,
clickable-question support, UI-specific wording, local save-path details, or
model-specific reinforcement of a canonical harness. They must not invent a
separate workflow contract that is absent from `agents/**`.

Downstream installations may generate, replace, or omit adapter files. Generated
adapter files should not be treated as canonical source.

Runtime-specific skill mirrors must not reuse names from `.agents/skills/`.
Some runtimes register both portable and runtime-local skills when names collide,
which makes selection ambiguous. If a downstream installation needs to generate
runtime-local skill wrappers, use a distinct runtime/local prefix until that
runtime can consume the portable skill directly.

Some runtimes surface portable skills as slash-style commands. Do not assume
that a `/name` entry in one runtime is equivalent to a hand-authored
`.windsurf/workflows/name.md` or `.claude/commands/name.md` adapter. If both a
portable skill and a runtime adapter are visible, prefer the known-good runtime
adapter until parity has been tested.

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
