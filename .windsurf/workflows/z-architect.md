---
description: Run a capacity / scaling architecture review. Config-first, metrics-augmented when available. Outputs a recommendation register with risk and confidence calibrated to evidence quality.
---

# /z-architect

## Required reads — do these now, in order

1. **Use your file-read tool to load `references/shared/architect-prompt.md`.** This is the playbook. It carries the First Response procedure, evidence-mapping logic, and recommendation register format.
2. **Use your file-read tool to load `references/shared/architect-methodology.md`.** This is the methodology. It carries the discipline the playbook depends on — register format, risk scale, confidence levels, status lifecycle.

Both paths are relative to the Zscaler skill repo root. **Do not respond until both files are loaded.** Then follow the playbook's First Response procedure with the methodology already in context.

## Best framing for the user's input

The user's scope and context should include:

- **Scope** — component (e.g., App Connector Group us-east-1) or topic (e.g., forwarding capacity for LATAM region)
- **Scaling context** — what changed or what's planned (e.g., "3x user growth by Q3", "saw saturation last week", "no specific driver — health check")
- **Evidence access** — what's available: Zscaler API, Splunk with relevant LSS feeds, generic infra metrics (Grafana / CloudWatch / pasted), or config-only

Minimum viable: scope + a one-line context. The playbook will ask for evidence layers if not stated.

The user's architect scope follows this command in the chat. Map evidence layers, run a config-first review, layer utilization analysis if metrics are available, and output the recommendation register grouped by risk.

Do not change tenant state — architect proposes, user decides. If scope or evidence access is unclear, ask one targeted clarifying question.
