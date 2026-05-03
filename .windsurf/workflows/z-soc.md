---
description: Run a SOC / security-posture review of tenant configuration, telemetry, or access state. Posture-driven (vs. /z-auditor lint or /z-investigator hypothesis). Outputs a posture register with severity calibrated to security impact.
---

# /z-soc

## Required reads — do these now, in order

1. **Use your file-read tool to load `references/shared/soc-prompt.md`.** This is the playbook. It carries the First Response procedure, the five subtype check-sets, and the posture register format.
2. **Use your file-read tool to load `references/shared/audit-methodology.md`.** This is the shared methodology (used by both `/z-auditor` and `/z-soc`). It carries the discipline the playbook depends on — register format, severity scale, status lifecycle, anti-patterns.

Both paths are relative to the Zscaler skill repo root. **Do not respond until both files are loaded.** Then follow the playbook's First Response procedure with the methodology already in context.

## Best framing for the user's input

The user's scope should include:

- **Scope** — `ZPA admin RBAC`, `ZIA URL filtering rules`, `telemetry coverage`, `Salesforce app segment`, `the whole tenant`
- **Subtype** (optional) — one of: `policy`, `access`, `coverage`, `config`, `activity`. If omitted, infer from scope.
- **Threat model** (optional) — `external attacker w/ stolen credentials`, `compromised admin`, `data exfil via cloud apps`, `ransomware lateral movement`, or "general"
- **Tenant cloud** (helps) — `zs2`, `zs3`, etc., so the agent can locate snapshot data

The user's SOC review scope follows this command in the chat. Parse scope and subtype, ground before reasoning per Step 2 (read schemas and product references; check `_data/snapshot/<cloud>/`, the operative incident directory's `evidence/`, and `_data/logs/` first), apply the relevant subtype check-set, and output the posture register grouped by severity.

Save the register to `_data/incidents/<slug>/posture.md` per Step 5. For routine (non-incident-driven) reviews use slug `<YYYY-MM-DD>-soc-<scope-descriptor>`.

Do not change tenant state — propose only. If scope is ambiguous, ask one targeted clarifying question.
