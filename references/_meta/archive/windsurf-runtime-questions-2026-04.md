# Windsurf runtime — questions and answers

**Status**: resolved — work framework agent answered all six.
**Last updated**: 2026-04-29
**Permanent reference**: see [`../../shared/windsurf-runtime-notes.md`](../../shared/windsurf-runtime-notes.md) for the conventions distilled from these answers.

## Context

This skill kit (`references/`, `.claude/commands/`, `.windsurf/workflows/`) is consumed by both Windsurf and Claude Code — same references, parallel slash command surfaces.

We've designed the workflows / playbooks to maximize determinism for weaker models (e.g., SWE-1.6) — explicit status enums, numbered procedures, gated fields, "will NOT do" sections. Initial Windsurf testing is encouraging but we want to align with how Windsurf's runtime actually processes these files, rather than reinventing patterns it already supports.

Each question below has space for an inline answer. Append the answer directly under each `**Answer**:` line. Where a question depends on Windsurf version, note the version observed.

---

## Q1. File-path reference resolution in `.windsurf/workflows/*.md`

Our workflow files (e.g., `.windsurf/workflows/z-investigate.md`) contain instructions like:

> Load and follow the playbook at `references/shared/investigate-prompt.md` (relative to the Zscaler skill repo root). Read it now before responding.

**Question**: Does the Windsurf runtime resolve and inline file-path references like this when the workflow is invoked? Or does the model see only the workflow body and need to make a separate file-read tool call to load the referenced playbook?

If the latter, we may need to be more explicit in the workflow body — e.g., explicit "first invoke the read tool on this path, then..." vs. trusting the model to figure it out.

**Answer**:

The Windsurf runtime does **not** automatically resolve and inline file-path references. The model must make explicit tool calls to load referenced files. → Workflow bodies should explicitly direct the model to use its read tool.

---

## Q2. Argument-passing convention

Our Claude Code commands use `$ARGUMENTS` substitution: a user types `/z-investigate <free text>` and `<free text>` lands at a specific point in the prompt body before being sent to the model.

**Question**: Does Windsurf have a parallel `$ARGUMENTS`-style mechanism for workflow files? Or does the user's input just arrive as the next chat turn, and the model has to parse "everything after the slash command" from chat context?

This affects how we structure workflow bodies — placeholder substitution vs. "the user's input follows in the chat" framing.

**Answer**:

Windsurf does **not** have `$ARGUMENTS`-style substitution. User input arrives as the next chat turn. → Workflow bodies must use the "user's input follows in the chat" framing; no placeholder syntax.

---

## Q3. The "structure for determinism" pattern

We were told Windsurf has a good structure for squeezing determinism out of fuzzy input — patterns it relies on to make weak-model behavior more reliable.

**Question**: What's the pattern? Specifically:

- Are there specific field names Windsurf's runtime parses out of workflow / rules frontmatter (e.g., `description`, `argument-hint`, `category`, etc.) that change agent behavior?
- Does Windsurf prefer a particular ordering convention for sections inside a workflow (e.g., trigger → context → instructions → output format)?
- Are there reserved keywords or tags that the runtime treats specially (e.g., `RULES:`, `OUTPUT:`, `STEPS:`)?

We'd like to align our workflows to whatever Windsurf is already optimized to consume, rather than building parallel structure.

**Answer**:

Windsurf parses YAML frontmatter fields like `description` for display, but does not have special reserved keywords. There is no strict ordering convention for sections inside a workflow body. → Our existing structure (numbered steps, status enums, "will NOT do" sections) is up to us; Windsurf doesn't impose conventions to align with.

---

## Q4 (bonus). Workflow-to-workflow invocation

**Question**: Can a Windsurf workflow invoke another workflow? E.g., could `/z-investigate` call into a sub-workflow for "run mechanical CI checks" rather than inlining that step?

If supported, what's the syntax / mechanism?

**Answer**:

Workflows **cannot** directly invoke other workflows. Sub-workflows must be inlined or referenced via file paths (which the model then loads). → Mechanical-checks-style steps stay inlined in the calling workflow; we can't compose workflow chains.

---

## Q5 (bonus). Workflow vs. rules vs. memory

Windsurf supports several persistence / loading mechanisms — `.windsurf/workflows/`, `.windsurf/rules/`, possibly memory.

**Question**: When does each fire? Specifically:

- Are rules in `.windsurf/rules/` always loaded into context, or do they have glob-pattern or context-trigger semantics (only fire on certain file types / question shapes)?
- Are workflows always available as slash commands, or do they need to be activated?
- Is there a memory layer the model can write to / read from across sessions?

**Answer**:

- Rules in `.windsurf/rules/` are always loaded into context.
- Workflows are always available as slash commands.
- Memory is a separate persistence layer.

→ `.windsurf/rules/` is the analog of CLAUDE.md (auto-loaded global context); use sparingly to avoid context bloat. Workflows are on-demand. Memory is separate from both.

---

## Q6 (bonus, optional). Model pinning

**Question**: Can a workflow pin to a specific model (e.g., "this workflow always runs on the strong model") or is that purely a session-level setting?

This came up because the user is currently routed to SWE-1.6 and our `/z-investigate` playbook is detailed enough that a stronger model would extract more from it.

**Answer**:

Model pinning is a session-level setting, not workflow-level. Workflows cannot pin to specific models. → The user controls model selection at session start; the workflow body has to work for whatever model is currently active. Tightening for the weaker model (explicit steps, enums, "will NOT do" sections) is the right move since the strong-model session won't be hurt by it.

---

## How answers get used

Once answered, the relevant points feed back into:

- `.windsurf/workflows/*.md` — adjust workflow body if file-path resolution / argument-passing needs explicit handling
- `references/shared/investigate-prompt.md`, `audit-prompt.md`, `architect-prompt.md` — adjust if Windsurf has reserved keywords / preferred section ordering
- New file: a `references/shared/windsurf-runtime-notes.md` capturing the long-term reference, if the answers reveal substantial conventions worth documenting alongside the SIEM emission discipline / methodology files

Reply directly under each `**Answer**:` line. Answers don't need to be exhaustive — concise and version-aware is more useful than long.
