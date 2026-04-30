---
description: Start an evidence-based troubleshooting investigation. For best results, the user's framing should include what fails, where (location/segment/user), scope, when first observed, and what works (adjacent successes).
---

# /z-investigate

## Fit check — run this BEFORE invoking the read tool

The user's framing follows this command in the chat. Read it now. Before loading the playbook, classify the framing per the table below. **If the dominant markers point at another command, output a redirect and stop — do not invoke the read tool.**

| If the framing has... | Output redirect to |
|---|---|
| Posture / threat-model words (RBAC, least-privilege, bypass exposure, telemetry coverage, DLP gap, admin activity, threat model) **with no active symptom** | `/z-soc` |
| Capacity / scaling words (growth, scale to, Nx, size, headroom, by Q<n>, add region) | `/z-architect` |
| Lint / hygiene words (audit references, file paths to .md, consistency, frontmatter, orphans, links) | `/z-audit` |

Investigation framing has: a **symptom** ("X is failing", "users can't reach Y"), a **scope** ("for user Z", "since 14:00 UTC"), and ideally **adjacent successes** ("port 443 still works"). If those are absent and the markers above dominate, output: *"Your framing looks like a `<other-persona>` task: `<one-line reason citing the markers>`. Re-invoke as `/z-<other-persona>`?"* — and stop.

If markers are mixed (e.g., "connector group disconnected, should we add capacity?" = symptom + capacity), proceed with `/z-investigate` (RCA first) but **flag the alternative** in your first response. Then continue to the read step below.

Full classification rubric: `references/_meta/command-routing.md` (load via read tool only if you need to disambiguate further).

## Load the playbook

**Use your file-read tool now to load `references/shared/investigate-prompt.md`** (path is relative to the Zscaler skill repo root). Then follow the playbook contained in that file. Do not respond until you have loaded the playbook.

## Best framing for the user's input

The user's framing should include:

- **What's failing** — destination/port/app/segment
- **Where** — location, segment, user/group, connector group
- **Scope** — one user / many in one location / all users / one connector
- **When first observed** — timestamp or relative time
- **What works** — adjacent successes that narrow hypotheses (e.g., port 443 succeeds, other locations unaffected)

Minimum viable: *what fails* + *where* + *what works*. If below minimum, ask one targeted clarifying question and stop.

The user's investigation framing follows this command in the chat. Parse it into a discovery journal ISSUE field, generate prioritized hypotheses with named evidence sources, and output the initial journal table.

Do not investigate yet — establish the plan first. If location, time, or scope is ambiguous, ask one targeted clarifying question.

Cross-reference: `references/shared/troubleshooting-methodology.md` for the full discipline (status values, anti-patterns, escalation criteria) — load it via your file-read tool when the playbook references it.
