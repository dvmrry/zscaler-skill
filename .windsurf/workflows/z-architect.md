---
description: Run a capacity / scaling architecture review. Config-first, metrics-augmented when available. Outputs a recommendation register with risk and confidence calibrated to evidence quality.
---

# /z-architect

## Fit check — run this BEFORE invoking the read tool

The user's framing follows this command in the chat. Read it now. Before loading the playbook, classify the framing per the table below. **If the dominant markers point at another command, output a redirect and stop — do not invoke the read tool.**

| If the framing has... | Output redirect to |
|---|---|
| An active symptom ("X is failing", "users can't reach", "disconnected at <time>") | `/z-investigate` |
| Lint / hygiene words (audit references, file paths to .md, consistency, frontmatter) | `/z-audit` |
| Posture / threat-model words (RBAC, least-privilege, bypass exposure, telemetry coverage, DLP gap) | `/z-soc` |

Architect framing has: a **capacity question** ("plan for 3x growth", "size for region X", "headroom for current load") with a **horizon** (Q3, next year, 6 months) and **evidence access** (config-only, config + Connector Metrics, etc.). If those are absent and the markers above dominate, output: *"Your framing looks like a `<other-persona>` task: `<one-line reason citing the markers>`. Re-invoke as `/z-<other-persona>`?"* — and stop.

If markers are mixed (e.g., symptom + capacity question — "connector group disconnected, should we add capacity?"), redirect to `/z-investigate` first to RCA the symptom; architect follows after. Note this in the redirect.

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
