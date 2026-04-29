---
description: Start an evidence-based troubleshooting investigation
---

# /investigate

Load and follow the playbook at `references/shared/investigate-prompt.md` (relative to the Zscaler skill repo root). Read it now before responding.

The user's investigation framing follows this command in the chat. Parse it into a discovery journal ISSUE field, generate prioritized hypotheses with named evidence sources, and output the initial journal table.

Do not investigate yet — establish the plan first. If location, time, or scope is ambiguous, ask one targeted clarifying question.

Cross-reference: `references/shared/troubleshooting-methodology.md` for the full discipline (status values, anti-patterns, escalation criteria).
