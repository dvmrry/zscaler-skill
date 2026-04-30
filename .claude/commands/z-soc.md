---
description: Run a SOC / security-posture review of tenant configuration, telemetry, or access state. Posture-driven (vs. /z-audit lint or /z-investigate hypothesis). Outputs a posture register with severity calibrated to security impact.
argument-hint: [scope] — e.g., "ZPA admin RBAC", "ZIA URL filtering rules, threat model: data exfil", "telemetry coverage, subtype: coverage"
---

Load and follow the playbook at @references/shared/soc-prompt.md.

The user's SOC review scope:

$ARGUMENTS

Parse scope, infer or accept the subtype (`policy` / `access` / `coverage` / `config` / `activity`), note the threat model if given. Ground before reasoning per Step 2 (read schemas and product references; check disk-first evidence in `_data/snapshot/<cloud>/`, the operative incident directory's `evidence/`, and `_data/logs/`). Apply the subtype check-set, output the posture register grouped by severity, and save to `_data/incidents/<slug>/posture.md`. Do not change tenant state — propose only. If scope is ambiguous, ask one targeted clarifying question.
