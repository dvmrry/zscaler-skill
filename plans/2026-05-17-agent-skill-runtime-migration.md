---
title: "Agent Skill Runtime Migration Review Packet"
date: "2026-05-17"
status: implemented-0.2.0-foundation
scope: ".agents skills, runtime adapters, z-investigator migration"
intended-reviewers: "Opus, Gemini, DeepSeek, Codex, or similar architecture reviewers"
implemented-in: "0.2.0"
---

# Agent Skill Runtime Migration Review Packet

> Resolution: the 0.2.0 foundation shipped. Runtime surfaces now load canonical
> `agents/<role>/workflow.md` entrypoints, with thin `.claude`, `.devin`,
> `.agents/skills`, and repo-root loader surfaces. Early candidate skill-loader
> ideas below that were not needed for 0.2.0 remain roadmap, not release scope.

## Executive Summary

This repo is moving toward open, file-based agent primitives while preserving
the existing Windsurf `/z-investigator` workflow. The migration is risky because
the mature Windsurf investigator command is not just a small alias: it is a
large runtime-specific harness that reinforces sequencing, grounding, journal
creation, checkpointing, and anti-fabrication behavior.

The immediate plan is to add portable `.agents/skills` loaders and validation
checks without replacing the current Windsurf `/z-investigator`. A later phase
can create a parallel `z-investigator-v2` candidate and compare it against the
current baseline.

Reviewers should evaluate whether the primitive distinctions, migration
boundary, and test strategy are rigorous enough to prevent breaking the
investigator workflow.

## Why This Matters

The project currently supports multiple agentic runtimes and surfaces:

- Codex
- Devin
- Windsurf Cascade
- Claude Code
- local/open-model or other agent harnesses in the future

These runtimes use similar words for different primitives. A "skill" in one
runtime may not behave like a "skill" in another. A slash command may be a
workflow in one runtime and a skill invocation in another. Treating these
surfaces as interchangeable would break the workflows.

The specific hazard:

> We add `.agents/skills`, assume it replaces runtime-specific workflows, thin
> or delete `.devin/workflows/z-investigator.md`, and then discover that
> Windsurf no longer follows the step gates, grounding discipline, journal
> behavior, or anti-fabrication rules that made `/z-investigator` useful.

This packet defines the problem carefully so review agents do not optimize for
the wrong target.

## Primitive Definitions

Use these terms precisely.

### Canonical Workflow

The actual procedure an agent follows. This is the source of truth for behavior.

Examples:

- `agents/zscaler/prompt.md`
- `agents/investigator/prompt.md`
- `agents/architect/prompt.md`
- `agents/soc/prompt.md`
- `agents/retro/prompt.md`
- `agents/researcher/prompt.md`
- future `agents/drift-review/prompt.md`
- future `agents/agent-review/prompt.md`

Canonical workflows live under `agents/**`.

### Portable Agent Skill

A discoverable capability package under:

```text
.agents/skills/<name>/SKILL.md
```

Purpose:

- Give compatible runtimes a stable capability entrypoint.
- Tell the runtime when to use the workflow.
- Point to the canonical workflow under `agents/**`.
- Avoid copying the workflow body.

Portable skills are loader packages, not the source of workflow truth.

### Runtime Command / Workflow Adapter

A runtime-specific command wrapper that exposes a workflow to users.

Examples:

```text
.claude/commands/z-investigator.md
.devin/workflows/z-investigator.md
```

These files define UX and loading behavior for a specific runtime. They should
remain thin when possible, but may need runtime-specific reinforcement when
evidence shows the runtime requires it.

### Workflow Harness

A workflow harness is the checkpoint/state-machine layer that makes a role
followable across turns: phase order, halt-and-wait behavior, output shape,
journal creation timing, snapshot-load caps, and other anti-drift controls.

This is distinct from the role prompt. A prompt can define the role and still
depend on a harness for turn sequencing. When a harness is required for
correctness, the canonical harness should live under `agents/**` so portable
skills and runtime adapters can load the same contract.

`/z-investigator` is the current hard case: `agents/investigator/prompt.md`
explicitly says to halt at checkpoints "per the workflow harness", and the
current Windsurf command contains much of that harness. That makes the large
Windsurf file a preserved baseline, not proof of accidental duplication.

### Windsurf Skill vs Windsurf Workflow

Do not conflate these:

```text
.devin/skills/**/SKILL.md
.devin/workflows/*.md
```

`.devin/skills/**` is a Windsurf skill surface. `.devin/workflows/*.md`
is the Windsurf slash workflow surface.

For Windsurf operator usage, the intended interface remains `/z-*` workflows,
not `@zscaler-*` skills. The observed `@skill` UX was frictional and did not
autocomplete as cleanly as slash workflows. The only established exception is
the existing `@zscaler` Q&A shim.

### Workflow Artifact Contract

A future reliability layer using structured artifacts such as:

```text
_data/cases/<slug>/workflow/01-frame.json
_data/cases/<slug>/workflow/02-grounding.json
_data/cases/<slug>/workflow/03-hypotheses.json
_data/cases/<slug>/workflow/04-evidence-*.json
_data/cases/<slug>/workflow/05-decision.json
```

Artifacts are not commands or skills. They are phase/state checkpoints that can
be validated independently of the runtime that produced them.

## Observed Runtime Behavior

These observations came from local tests and downstream runtime checks.

### Codex

- Saw `.agents/skills`.
- Invoked portable skills with `$skill-name`.
- Example: `$agent-skill-smoke-test` loaded the smoke-test skill.

### Devin

- Picked up `.agents/skills` after a quick restart.
- Surfaced the skill as slash-style `/skill-name`.
- This means portable skill names may appear in Devin's slash namespace.

### Windsurf

- Saw `.agents/skills` in a skill registry.
- Also saw `.devin/skills`.
- Same-name skills in `.agents/skills` and `.devin/skills` both appeared as
  duplicate entries rather than clean directory precedence.
- Skill invocation/autocomplete was frictional compared with slash workflows.
- Windsurf operator UX should remain `.devin/workflows` slash commands.

### Claude Code

- Did not pick up `.agents/skills`.
- Uses `.claude/commands` or `.claude/skills` for its own command/skill
  surfaces.

## Current Repo State

### Canonical Workflows

Current canonical workflows:

```text
agents/zscaler/prompt.md
agents/investigator/prompt.md
agents/architect/prompt.md
agents/auditor/prompt.md
agents/soc/prompt.md
agents/retro/prompt.md
```

Cross-cutting agent infrastructure:

```text
agents/clarification-pattern.md
agents/loading-discipline.md
agents/siem-emission-discipline.md
agents/tenant-schema-derivation.md
```

### Existing Runtime Adapters

Claude commands:

```text
.claude/commands/z-researcher.md
.claude/commands/z-architect.md
.claude/commands/z-auditor.md
.claude/commands/z-investigator.md
.claude/commands/z-retro.md
.claude/commands/z-soc.md
```

Windsurf workflows:

```text
.devin/workflows/z-architect.md
.devin/workflows/z-auditor.md
.devin/workflows/z-investigator.md
.devin/workflows/z-retro.md
.devin/workflows/z-soc.md
```

Line-count evidence:

```text
.devin/workflows/z-architect.md      29 lines
.devin/workflows/z-auditor.md        30 lines
.devin/workflows/z-investigator.md  548 lines
.devin/workflows/z-retro.md          27 lines
.devin/workflows/z-soc.md            32 lines
```

Most Windsurf workflows are already loader-shaped. `/z-investigator` is the
exception and likely contains runtime-specific reinforcement that may be
important to preserve.

### Current `.agents/skills` Pilot

Current pilot:

```text
.agents/skills/zscaler-investigator/SKILL.md
```

This is a thin portable loader that points to:

```text
agents/investigator/prompt.md
```

and lists on-demand dependencies.

Temporary smoke-test skills were used to validate runtime discovery and
precedence. They should not ship as production workflow surface.

### Current Local Validation

New local checker:

```text
scripts/check-agent-skills.py
```

It validates:

- `.agents/skills/*/SKILL.md` discovery.
- frontmatter `name` and `description`.
- canonical `agents/**/prompt.md` path resolution.
- routing docs mention portable skill layer.
- runtime-local skill collision warnings.
- large runtime adapter warnings for known harnesses.
- committed smoke-test skill warnings unless explicitly allowed.

Current expected warning:

```text
.devin/workflows/z-investigator.md: runtime adapter is large; confirm it is a deliberate harness or lift the procedure into agents/**
```

This warning is useful but should not fail the first migration PR.

## Problem Statement

We want portable skill entrypoints without losing runtime-specific behavior
currently necessary for Windsurf Cascade, especially in `/z-investigator`.

The migration must preserve distinctions between:

- canonical workflows
- portable skills
- runtime slash commands / workflow adapters
- runtime-local skill packages
- workflow harnesses
- future artifact contracts

The migration must not assume that a runtime's skill primitive and command
primitive are equivalent.

## Goals

### Immediate Goals

1. Preserve current `/z-investigator` behavior as the baseline.
2. Add portable `.agents/skills` loaders that point to canonical `agents/**`
   workflows.
3. Keep Windsurf `/z-*` as the operator UX.
4. Keep Claude `.claude/commands/*` as Claude's command UX.
5. Add checks that validate skill shape, path resolution, routing docs, and
   runtime-skill collision risks.
6. Define a reviewable migration strategy before replacing any mature runtime
   adapter.

### Long-Term Goals

1. Make `.agents/skills` the portable discovery layer for Codex, Devin, and
   other compatible runtimes.
2. Keep `agents/**` as canonical workflow source.
3. Keep runtime adapters thin where the runtime can handle it.
4. Lift load-bearing harness behavior into `agents/**` before expecting a
   portable skill to preserve it.
5. Retain runtime-specific reinforcement where evidence shows a runtime needs
   stricter wording to follow the canonical harness.
6. Add workflow artifacts for high-risk workflows so behavior can be validated
   through structured phase outputs rather than prose compliance.
7. Allow downstream installations to generate runtime-specific adapters without
   creating ambiguous duplicate skill names.

## Non-Goals

Do not:

- Rename `/z-*` slash commands to `/zscaler-*`.
- Treat Windsurf `@skill` UX as the operator workflow interface.
- Move all canonical workflow logic under `.agents/`.
- Replace `.devin/workflows/z-investigator.md` in the first pass.
- Assume a runtime's skill primitive and command primitive are equivalent.
- Add private implementation details or private tooling names to public docs.
- Use successful tests of thin workflows as proof that the mature investigator
  migration is safe.

## Proposed Naming

### Portable Skills

```text
zscaler-qna
zscaler-investigator
zscaler-architect
zscaler-soc
zscaler-retro
zscaler-researcher
skill-auditor
skill-drift-review
skill-agent-review
```

### Runtime Slash Commands

```text
/z-investigator
/z-architect
/z-soc
/z-retro
/z-researcher
/z-config-auditor        # later tenant config lint role
/skill-auditor           # maintainer runtimes only
/skill-drift-review      # future
/skill-agent-review      # future
```

### Rationale

- `zscaler-*` is explicit enough for shared skill registries.
- `/z-*` remains compact and user-friendly for operator slash workflows.
- `skill-*` clearly denotes repo-maintainer workflows, not tenant operations.
- Devin may surface `.agents/skills` as slash commands, so portable skill names
  should avoid colliding with `/z-*` runtime commands.

## Immediate Implementation Plan

### 1. Keep the Pilot and Checker

Keep:

```text
.agents/skills/zscaler-investigator/SKILL.md
agents/_meta/runtime-adapters.md
agents/_meta/workflow-artifacts.md
scripts/check-agent-skills.py
```

Remove temporary smoke-test skills from committed output.

### 2. Add Portable Skill Loaders

Add thin `.agents/skills` loaders for:

```text
zscaler-qna             -> agents/zscaler/prompt.md
zscaler-investigator    -> agents/investigator/prompt.md
zscaler-architect       -> agents/architect/prompt.md
zscaler-soc             -> agents/soc/prompt.md
zscaler-retro           -> agents/retro/prompt.md
skill-auditor           -> agents/auditor/prompt.md for now
zscaler-researcher      -> agents/researcher/prompt.md
skill-drift-review      -> agents/drift-review/prompt.md
skill-agent-review      -> agents/agent-review/prompt.md
```

Each skill must:

- Have clear `name` and `description` frontmatter.
- Point to the canonical workflow path.
- List dependencies only as needed.
- Avoid copying the workflow body.
- State that runtime adapters are not source of truth.

### 3. Add Canonical Maintainer Workflows

If missing, add canonical prompts for:

```text
agents/researcher/prompt.md
agents/drift-review/prompt.md
agents/agent-review/prompt.md
```

These should be concise and may initially adapt existing command text:

- `zscaler-researcher` can load `agents/researcher/prompt.md` and expose `/z-researcher`.
- `skill-drift-review` should cover upstream/vendor/submodule/source drift.
- `skill-agent-review` should review `agents/**`, `.agents/skills/**`, and
  runtime adapter coherence.

Do not overbuild these in the first PR.

### 4. Do Not Replace `/z-investigator`

Keep:

```text
.devin/workflows/z-investigator.md
```

unchanged during the first PR except for obvious stale references or comments.

Create a parallel candidate later:

```text
.devin/workflows/z-investigator-v2.md
```

Do not overwrite current `/z-investigator` until candidate behavior is tested
against baseline.

### 5. Define Investigator A/B Rubric

Before creating `z-investigator-v2`, define pass/fail criteria.

Candidate must preserve:

- one blocking clarification per turn
- no parsed framing before blocking unknowns are resolved
- required reads before hypotheses
- visible stage announcement before each phase transition
- no silent continuation after asking a blocking clarification
- correct `_data/cases/<slug>/journal.md` handling
- early journal stub creation when the baseline requires an on-disk artifact
- correct `_data/snapshot/<cloud>/` handling
- no hallucinated case slugs, snapshot paths, or evidence file paths
- no sibling case browsing unless user points to it
- hypothesis table with claim status and next evidence
- halt at checkpoint
- no unsupported RCA jump
- no broad snapshot overloading
- rigid output shape when the baseline defines one
- visible grounding-files-loaded / loaded-files signal

Run the same Windsurf prompt through the current baseline plus both candidate
load paths:

```text
/z-investigator
/z-investigator-v2-loads-skill
/z-investigator-v2-loads-prompt
```

Only one candidate should ship. Test both so the review can determine whether
the portable skill body carries load-bearing instructions that are lost when a
runtime treats the skill only as discovery metadata.

Only replace baseline after evidence shows parity or improvement.

### 6. Keep Local Contract Tests

`scripts/check-agent-skills.py` should remain advisory/blocking as follows:

- Fail on malformed portable skills.
- Fail on missing canonical prompt path.
- Fail on missing routing docs.
- Warn on large runtime adapters for now.
- Warn on known stale runtime adapter path patterns.
- Warn or fail on runtime-local skill name collisions depending on strictness.

The large `z-investigator` warning is expected until the migration has a tested
replacement.

## Long-Term Direction

### Artifact-Gated Workflows

For mature workflows, especially investigator, move reliability checks toward
structured phase artifacts.

Investigator artifact sketch:

```text
_data/cases/<slug>/
  journal.md
  workflow/
    01-frame.json
    02-grounding.json
    03-hypotheses.json
    04-evidence-001.json
    05-decision.json
```

The artifact contract should be language-neutral JSON/Markdown. Validators may
be Python, Node, shell, or runtime-specific depending on the installing team,
but artifact shapes should not depend on one toolchain.

### Runtime Adapter Generation

Downstream installs may generate runtime-specific adapters. Public docs should
describe this generically as downstream/local adapter generation.

Generated runtime-local skill mirrors must avoid same-name collisions with
`.agents/skills` until the target runtime cleanly supports portable skills
without ambiguous duplicate entries.

### Maintainer Workflows

Repo-maintainer workflows should become first-class portable skills:

```text
skill-auditor
zscaler-researcher
skill-drift-review
skill-agent-review
```

These are likely the highest-value workflows for Codex/Devin/Claude-style
developer agents.

## Proposed First PR Boundary

Include:

- Portable skill pilot. Add additional skill loaders only when their canonical
  `agents/**/prompt.md` files exist in the same PR.
- Runtime adapter policy docs.
- Workflow artifact future-direction note.
- Agent skill contract checker.
- CI integration for the checker.
- This plan file.
- Canonical maintainer workflow stubs/prompts where they are needed for any
  loader included in the PR.

Exclude:

- Replacing `.devin/workflows/z-investigator.md`.
- Adding `.devin/workflows/z-investigator-v2.md`.
- Implementing JSON artifact schemas.
- Runtime-specific generated adapter mirrors.
- Any private tooling names or implementation details.

The first PR should make the direction testable without changing existing
operator workflow behavior.

## Open Design Questions

Reviewers should answer these directly.

1. Are the primitive definitions precise enough to prevent confusing skills,
   workflows, slash commands, runtime-local skills, and artifact contracts?
2. Is `/z-investigator` correctly identified as the first meaningful migration
   target because it is the only mature hard case?
3. Is the plan correct to preserve current `/z-investigator` as baseline while
   developing a parallel `z-investigator-v2` later?
4. After the investigator harness is canonical, should `z-investigator-v2` load
   the canonical prompt+harness directly, or route through
   `.agents/skills/zscaler-investigator/SKILL.md`?
5. Are the pass/fail criteria for Windsurf investigator parity sufficient?
6. Are any important behaviors missing from the baseline preservation list?
7. Is the `zscaler-*` skill naming vs `/z-*` command naming clear enough,
   especially given Devin surfaces skills as slash commands?
8. Are the proposed maintainer skills scoped correctly?
9. Should runtime-specific skill mirrors ever be committed upstream, or should
   they remain generated/downstream-only?
10. Should the large `z-investigator` adapter warning remain non-blocking until
   a candidate wrapper exists?
11. What should block the first PR?
12. What should be deferred to later artifact-gated workflow work?

## Reviewer Instructions

When reviewing this plan:

1. Do not suggest replacing the current `/z-investigator` unless you also
   provide a parity test strategy.
2. Do not treat `.agents/skills` as equivalent to `.devin/workflows`.
3. Do not treat Windsurf `@skill` invocation as acceptable replacement for
   `/z-*` operator UX unless you address the observed autocomplete friction.
4. Focus on primitive boundaries, migration safety, and testability.
5. Identify any missing constraints before suggesting implementation details.

Preferred review output:

```text
Verdict: approve / approve with changes / do not proceed

Blocking issues:
- ...

Non-blocking improvements:
- ...

Answers to reviewer questions:
1. ...
2. ...
```
