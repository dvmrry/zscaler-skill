---
description: Start an evidence-based troubleshooting investigation
argument-hint: [issue description in natural language]
---

Load and follow the playbook at @references/shared/investigate-prompt.md.

The user's investigation framing:

$ARGUMENTS

Parse the framing into a discovery journal ISSUE field, generate prioritized hypotheses with named evidence sources, and output the initial journal table. Do not investigate yet — establish the plan first. If location, time, or scope is ambiguous, ask one targeted clarifying question.
