---
description: Run a SOC / security-posture review of tenant configuration, telemetry, or access state. Posture-driven (vs. /z-auditor lint or /z-investigator hypothesis). Outputs a posture register with severity calibrated to security impact.
argument-hint: [scope] — e.g., "ZPA admin RBAC", "ZIA URL filtering rules, threat model: data exfil", "telemetry coverage, subtype: coverage"
---

<!-- adapter-deps:start -->
Load and follow the playbook at @agents/soc/prompt.md.

Before the first response, also load each of its declared dependencies:
- `agents/soc/harness.md` — scope/subtype, grounding, posture finding, and save gates
- `agents/soc/grounding/index.md` — posture, identity, policy, and telemetry grounding load map
- `agents/auditor/methodology.md` — register format, severity scale, status lifecycle (shared with `/z-auditor`)
- `agents/investigator/methodology.md` — evidence discipline, claim status (used in subsequent investigation handoffs)
- `agents/siem-emission-discipline.md` — SIEM emission modes, public/private boundary
- `agents/clarification-pattern.md` — multiple-choice with free-text escape for closed-set decisions (subtype selection, etc.)
<!-- adapter-deps:end -->

The user's SOC review scope:

$ARGUMENTS

Parse scope, infer or accept the subtype (`policy` / `access` / `coverage` / `config` / `activity`), note the threat model if given. Ground before reasoning per Step 2 (read schemas and product references; check disk-first evidence in `_data/snapshot/<cloud>/`, the operative case directory's `evidence/`, and `_data/schemas/`). Apply the subtype check-set, output the posture register grouped by severity, and save to `_data/cases/<slug>/posture.md`. Do not change tenant state — propose only. If scope is ambiguous, ask one targeted clarifying question.
