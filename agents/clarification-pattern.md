---
topic: "clarification-pattern"
title: "Clarification pattern — multiple-choice questions for closed-set decisions"
content-type: reference
last-verified: "2026-05-06"
confidence: medium
source-tier: practice
sources:
  - "Internal UX practice — multiple-choice clarifications with a free-text escape are a near-universal AI-chat pattern"
  - "agents/loading-discipline.md (parallel cross-cutting discipline pattern)"
author-status: draft
---

# Clarification pattern

When asking the user a question that has a small, closed set of valid answers, present the answers as a numbered multiple-choice list with an escape hatch for free input. Some runtimes render this as clickable buttons (a real UX upgrade — one click instead of typed parsing); others fall back to numbered plain text; pure-CLI surfaces show only the text. The pattern works on all of them; the host's structured-question facility, when present, just makes it nicer.

This file is the contract for those questions. It applies to clarifying questions, escalation prompts, subtype routing, and similar closed-set decisions. It does **not** apply to procedural command vocabularies (see Anti-patterns).

## When to use it

Use the pattern when:

- The answer space is small and closed (2–5 distinct options).
- Each option is concrete and short enough to fit on one line.
- A user picking the wrong meaning from a free-text response is a real risk — typos, paraphrase, ambiguity.
- The decision has one clear axis (yes/no, this/that, subtype-A/subtype-B/subtype-C).

Do not use it when:

- The answer is genuinely open-ended (*"describe the symptom in your own words"*).
- The set is large (>5 options) — flat lists become noise; split the question.
- The "options" are really command tokens with their own arguments (see Anti-patterns).

## Contract

A clarification:

1. Has **2–5 options**. Binary clarifications (continue here vs. hand off) are a valid use case; 3–5 is common; more than 5 is a sign the question should be split.
2. Always provides an **escape hatch for free text** — either as the last option (`Other — specify`) or through the runtime's built-in *other / specify* affordance, whichever the host renders cleanly.
3. **One clarification per turn — never multiple.** A turn that emits two or more clarification blocks bundles axes and gets partial answers. If multiple clarifications are needed, serialize them across turns: ask the most-blocking one first; ask the next one in the next turn after the user answers.
4. Has options that are **short and concrete** — fragments, not sentences. The user is choosing, not reading prose.
5. **Echoes the chosen option in the next turn.** Some runtimes hide button-clicks from the visible chat scrollback; restating the choice keeps the structured selection part of the record.
6. Uses the **runtime's structured-question facility when one exists** (e.g., Claude Code's `AskUserQuestion`, which renders real clickable options); falls back to bulleted text otherwise. Bullets render more cleanly than numbered lists in most chat-style runtimes (e.g., Cascade) — prefer them as the default text form.

## Examples

### `@zscaler` escalation handoff

When a question turns investigation-shaped (symptom + affected scope + recency), `@zscaler`'s escalation test fires. The clarification:

> This question is investigation-shaped (symptom + affected scope + recency). Want me to:
>
> - Hand off to `/z-investigator` (produces a discovery journal with prioritized hypotheses)
> - Stay here and answer ad-hoc (faster, no journal artifact)
> - Other — specify

Two structured options plus the escape. The user gets a clear pick or types their own preference.

### `/z-soc` subtype selection

When SOC scope is given without an explicit subtype, the agent infers — but should confirm rather than assume:

> Which SOC subtype best matches this scope?
>
> - `policy` — policy correctness and precedence
> - `access` — who-can-do-what (RBAC, admin scopes)
> - `coverage` — telemetry / log coverage gaps
> - `config` — hygienic / structural config issues
> - Other — specify

Four options drawn from the closed set defined in `agents/soc/prompt.md`, plus the escape. If the user picks `Other`, the scope is non-standard — useful signal in itself.

### `/z-investigator` assumption confirmation

Step 1 parses the user's framing and lists assumptions to confirm. Each assumption is a clarification:

> I assumed the tenant cloud is `zs3` based on the API base URL. Confirm:
>
> - Yes — proceed with `zs3`
> - No — actually `zs1`
> - No — actually `zs2`
> - Other — specify

Common clouds plus escape; keep the concrete options scoped to what the framing makes plausible. Avoids ambiguity from free-text replies like *"yes that's right"* or *"no I meant the other one"*.

## Anti-patterns

- ✗ **Do not use this for procedural command vocabularies.** The investigator's per-step checkpoint menu (`go` / `correct: <field>` / `add: <path>` / `clarify: <q>`) is *not* a clarification — it's a turn-control vocabulary where each token carries its own argument shape. Wrapping it as multiple-choice strips the argument slot and forces the user back into free text anyway. Procedural menus stay as text.
- ✗ **Do not bundle questions.** *"Pick the cloud, the affected scope, and the recency"* as a single multi-axis clarification produces partial answers. Ask one axis at a time.
- ✗ **Do not pad the option set with throwaway choices.** *"Yes / No / Maybe / Cancel / Other"* is fake structure — the real answer space was always Yes/No plus escape.
- ✗ **Do not use the pattern when the answer is genuinely open-ended.** *"Describe the symptom in your own words"* is a free-text question; reframing it as a bulleted multi-choice constrains the user worse than not asking the structured form at all.
- ✗ **Do not promote this pattern over conversational discipline for trivial decisions.** A throwaway *"ok?"* needs no clarification at all, and certainly no menu.

## Failure modes this pattern does not solve

- **Genuinely ambiguous framing.** If the user's question has no small closed set of resolutions, no clarification pattern saves you — ask an open question.
- **Runtimes without structured-question facilities.** Cascade currently has no documented agent-side multi-choice tool — the fallback (bulleted text) is functional but loses the click-vs-type UX win. Claude Code does have one (`AskUserQuestion`); use it where available. The pattern is documented either way; let each runtime do what it can.
- **Static eval can't verify runtime application.** Whether a model actually emits a multi-choice block when it should isn't checkable from the prompt source — same limitation as loading-discipline.
