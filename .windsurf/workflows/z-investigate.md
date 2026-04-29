---
description: Start an evidence-based troubleshooting investigation. For best results, the user's framing should include what fails, where (location/segment/user), scope, when first observed, and what works (adjacent successes).
---

# /z-investigate

Load and follow the playbook at `references/shared/investigate-prompt.md` (relative to the Zscaler skill repo root). Read it now before responding.

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

Cross-reference: `references/shared/troubleshooting-methodology.md` for the full discipline (status values, anti-patterns, escalation criteria).
