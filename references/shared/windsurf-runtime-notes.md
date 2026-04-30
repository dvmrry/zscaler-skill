---
product: shared
topic: "windsurf-runtime-notes"
title: "Windsurf runtime — conventions for workflow / rules authoring"
content-type: reference
last-verified: "2026-04-29"
confidence: high
source-tier: practice
sources:
  - "Windsurf work framework agent (relayed via windsurf-runtime-questions.md handoff, 2026-04-29)"
author-status: draft
---

# Windsurf runtime — conventions for workflow / rules authoring

How Windsurf processes the files in `.windsurf/`, distilled from the work framework agent's answers. These are the load-bearing facts for anyone editing workflow / rules content in this repo.

## File-path references in workflows are not auto-resolved

The Windsurf runtime does **not** automatically inline files referenced from inside a workflow body. The model must make explicit tool calls to load referenced files.

**Implication**: workflow bodies should give the model a direct instruction to use its read tool. Fuzzy phrasing like "see the playbook at X" can be skipped by a weaker model (e.g., SWE-1.6); explicit phrasing like "Use the read tool to load X before responding" reliably triggers the file load.

```markdown
# Good
Use your file-read tool to load `references/shared/investigate-prompt.md`,
then follow its instructions.

# Less good (ambiguous — runtime might or might not load; model might or might not act)
See the playbook at `references/shared/investigate-prompt.md`.
```

## No `$ARGUMENTS`-style argument substitution

User input arrives as the next chat turn. There is no placeholder syntax that gets substituted into the workflow body before the prompt is sent to the model.

**Implication**: workflow bodies use the "user's input follows in the chat" framing. The Claude Code shim (`.claude/commands/*.md`) uses `$ARGUMENTS`; the Windsurf shim (`.windsurf/workflows/*.md`) cannot, and tells the model to read the user's framing from the next message.

```markdown
# Claude Code (.claude/commands/audit.md)
The user's audit scope:

$ARGUMENTS

Parse the scope, ...

# Windsurf (.windsurf/workflows/z-audit.md)
The user's audit scope follows this command in the chat. Parse it, ...
```

## Frontmatter is parsed for display only

The runtime parses YAML frontmatter (notably `description`) for display purposes — what shows in the slash-command picker. There are **no reserved keywords** that change agent behavior, and **no required ordering** of sections inside the workflow body.

**Implication**: structural conventions (numbered first-response steps, status enums, "will NOT do" sections, severity scales) are entirely up to us. Whatever produces deterministic agent behavior is the right choice; the runtime doesn't have an opinion.

## Workflows cannot invoke other workflows

There is no workflow-to-workflow chaining. Sub-workflows must be inlined into the calling workflow body, OR referenced via file path (with the model loading the referenced file via its read tool, per the first rule above).

**Implication**: composability is "load this file" not "invoke this workflow." `/z-audit`'s mechanical-checks step stays inlined; we don't try to factor it into a separate `z-mechanical-checks` workflow.

## Rules are always loaded; workflows are slash commands; memory is separate

Three persistence / loading mechanisms in Windsurf:

| Mechanism | Loading | Use case |
|---|---|---|
| `.windsurf/rules/*.md` | Always loaded into session context | Persistent global guidance — analog of CLAUDE.md |
| `.windsurf/workflows/*.md` | On-demand (slash commands) | Invokable procedures — analog of `.claude/commands/` |
| Memory | Persistence layer separate from both | Cross-session state |

**Implication for `.windsurf/rules/`**: use sparingly. Anything in rules adds to every session's context budget. Reserve rules for high-leverage facts that genuinely apply to every conversation in this repo (e.g., "this is a Zscaler skill kit; canonical references live under `references/`; never commit tenant-specific identifiers").

## Model pinning is session-level, not workflow-level

Workflows cannot pin to a specific model. The user's session model (e.g., SWE-1.6) is what the workflow runs under.

**Implication**: design workflows for the **weakest model in routine rotation**. Tightening for SWE-1.6 (explicit numbered steps, status enums, "will NOT do" sections, gating fields) doesn't penalize stronger-model sessions — they extract the same procedural value, plus headroom — but failing to tighten penalizes weaker-model sessions immediately.

This is also why bundles (per [`investigation-bundles.md`](./investigation-bundles.md), [`architect-bundles.md`](./architect-bundles.md)) matter: a verified bundle is more procedural than a playbook, leaving even less room for weak-model drift.

## Cross-links

- [`../_meta/archive/windsurf-runtime-questions-2026-04.md`](../_meta/archive/windsurf-runtime-questions-2026-04.md) — original questions and inline answers (historical record)
- Windsurf workflow files — `.windsurf/workflows/z-investigate.md`, `z-audit.md`, `z-architect.md`
- Claude Code parallels — `.claude/commands/z-investigate.md`, `z-audit.md`, `z-architect.md`
- [`siem-emission-discipline.md`](./siem-emission-discipline.md) — the broader "agent-direct vs. user-handoff vs. coworking" framework these workflows operate under
