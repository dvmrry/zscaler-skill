---
description: Run a capacity / scaling architecture review. Config-first, metrics-augmented when available. Outputs a recommendation register with risk and confidence calibrated to evidence quality.
argument-hint: [scope] — e.g., "App Connector Group us-east-1, planning 3x growth by Q3, Splunk has Connector Metrics"
---

Load and follow the playbook at @references/shared/architect-prompt.md.

The user's architect scope and context:

$ARGUMENTS

Parse scope, planning horizon, and evidence access. Map evidence layers (config-only / config + metrics / mixed). Walk config for structural issues first; layer in utilization analysis if metrics are available. Output a recommendation register grouped by risk. Do not change tenant state — propose only. If scope or evidence access is unclear, ask one targeted clarifying question.
