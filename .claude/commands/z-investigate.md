---
description: Start an evidence-based troubleshooting investigation. Best framing includes what's failing, where (location/segment/user), scope (one user vs. many), when first observed, and what works (adjacent successes that narrow hypotheses).
argument-hint: [what fails] from [where], [scope], since [when], [what works]
---

Load and follow the playbook at @references/shared/investigate-prompt.md.

The user's investigation framing:

$ARGUMENTS

Parse the framing into a discovery journal ISSUE field, generate prioritized hypotheses with named evidence sources, and output the initial journal table. Do not investigate yet — establish the plan first. If location, time, or scope is ambiguous, ask one targeted clarifying question.
