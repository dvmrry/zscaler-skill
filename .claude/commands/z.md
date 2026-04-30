---
description: Front-door router — classifies your framing and dispatches to the right persona (/z-investigate, /z-audit, /z-architect, /z-soc). Use this when you don't know which specific command to pick.
argument-hint: [free-text framing of what you want to do]
---

Load `@references/_meta/command-routing.md` and use it as the classification rubric.

The user's framing:

$ARGUMENTS

## Procedure

1. **Classify the framing** per the marker table in the rubric:
   - Symptom + scope words (failing, broken, since <time>, can't reach) → `/z-investigate`
   - Lint / hygiene words (audit references, file paths, consistency, frontmatter) → `/z-audit`
   - Capacity / horizon words (growth, scale, size, headroom) → `/z-architect`
   - Posture / threat words (RBAC, bypass exposure, telemetry coverage, threat model) → `/z-soc`

2. **If the framing maps cleanly to one persona** — load the corresponding playbook from `references/shared/` (`investigate-prompt.md` / `audit-prompt.md` / `architect-prompt.md` / `soc-prompt.md`) and follow it from Step 1 onward, treating `$ARGUMENTS` as the user's framing for that persona. Output your first response in the persona's voice (discovery journal / audit register / recommendation register / posture register).

3. **If the framing is ambiguous or has mixed markers** — do not pick silently. Output a brief disambiguation: name the two or three personas that could fit, cite the framing markers that point to each, and ask the user which they want. Then stop and wait for their reply.

4. **If the framing is too thin to classify** (e.g., `/z something something`) — ask one clarifying question (what's failing? what's the scope? are you reviewing config or planning capacity?) and stop.

## Note

This router is Claude-Code-only. Windsurf users invoke the kit via `/zscaler` (a downstream-owned shim) or directly via `/z-investigate` / `/z-audit` / `/z-architect` / `/z-soc`; each of those workflow files contains a fit-check that performs the same redirect logic per-command. See [`proposals/windsurf-routing-and-fit-check.md`](../../proposals/windsurf-routing-and-fit-check.md) for the full design rationale.
