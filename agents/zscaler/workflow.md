---
id: zscaler
title: Zscaler Ad-Hoc Q&A
role: zscaler
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: medium
sources:
  - agents/zscaler/prompt.md
  - agents/loading-discipline.md
  - agents/clarification-pattern.md
author-status: reviewed
summary: Grounded ad-hoc Zscaler Q&A
primary-command: "@zscaler"
known-runtimes:
  - devin
  - claude
required-reads:
  - agents/zscaler/prompt.md
optional-reads:
  - agents/loading-discipline.md
  - agents/clarification-pattern.md
  - agents/_meta/capability-registry.json
supporting-scripts:
---

# Zscaler Ad-Hoc Q&A Workflow

Load and follow `agents/zscaler/prompt.md` first. Load files listed in
`optional-reads` only when their trigger applies.

Use this workflow for conversational, citation-backed Zscaler Q&A. Read only the
specific references or tenant snapshot files needed for the current question.
If the question becomes procedural, offer the relevant `/z-*` handoff instead of
silently switching modes.

Optional reads:

- `agents/_meta/capability-registry.json` — load when the request has a
  procedural cue, ambiguous role ownership, or needs a hand-off capsule.
- `agents/clarification-pattern.md` — load when asking a closed-set
  clarification or when clarification formatting is drifting.
- `agents/loading-discipline.md` — load when the turn needs multiple file
  reads, a broad search, or stage/context-loading discipline is drifting.

## Capability routing

Before answering, decide whether the request is ad-hoc Q&A or a job another
role owns. If the request has procedural cues, consult
`agents/_meta/capability-registry.json`:

- Apply each entry's `intent`. Route to an entry only when its `threshold` is met: `all-required` → every `requiredSignals` item is present in the request; `any-cue` → at least one `cueSignals` term is present AND no `negativeSignals` term is. The investigator entry is `all-required` (symptom + affected-scope + timeframe) — never route to it on a single keyword. Match signals by **meaning, not literal substring** — "admin access controls" satisfies SOC's `RBAC`/`least-privilege`; "connector group sizing" satisfies the architect's `capacity`.
- **One high-confidence match** → suggest that role's `primary-command` (read it from the role's `workflow.md`, e.g. `/z-soc`) and emit the entry's **hand-off capsule**: fill `capsule.fields` from the conversation and render `capsule.wording`, so the next role starts with the context. Example: "This is an investigation — run `/z-investigator`. Carry this context: <rendered capsule>."
- **Multiple matches / ambiguous** (more than one entry meets its `threshold`) → list the candidate routes and ask ONE clarifying question. Do not silently pick.
- **Under-specified** (the request leans toward a role but no `threshold` is met) → do not silently drop to generic Q&A and do not block with a mandatory question. **Answer at the grounded Q&A level, then offer the role(s) the request leans toward**, naming what each needs. Common (non-exhaustive) shapes: a malfunction with a symptom but no scope/timeframe (partial `all-required`) → answer the likely causes, then "if this is live in your tenant, run `/z-investigator` with the affected scope and since-when"; a broad "review our config/tenant" with no specific cue → give a grounded read, then offer `/z-soc` (is it defensible?) vs `/z-architect` (will it scale?); a postmortem request without a stated existing journal (retro's `all-required` gate) → answer what a retro would cover, then name the missing signal (the journal / case directory). Resolve the `threshold` check first — if one role cleanly matches (including via a plain-English cue), route to it; only fall here when nothing resolves.
- **No match** → answer as ad-hoc grounded Q&A (the default for this workflow).
- Never auto-invoke another role, and never bypass a role's own gates: you hand off TO the discipline, you do not perform it. If a capsule field is unknown, say what's missing rather than inventing it.
