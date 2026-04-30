---
description: Run an editorial / structural audit of skill kit references. Mechanical lint via existing CI scripts, plus agent-driven editorial pass (voice, structural shape, confidence calibration, content/frontmatter agreement, cross-link reciprocity, dangling concepts, open-question hygiene).
---

# /z-audit

## Fit check — run this BEFORE invoking the read tool

The user's framing follows this command in the chat. Read it now. Before loading the playbook, classify the framing per the table below. **If the dominant markers point at another command, output a redirect and stop — do not invoke the read tool.**

| If the framing has... | Output redirect to |
|---|---|
| An active symptom ("X is failing", "users can't reach", "since 14:00") with a tenant scope | `/z-investigate` |
| Capacity / scaling words (growth, scale to, Nx, size, headroom, by Q<n>) | `/z-architect` |
| Posture / threat-model words (RBAC, least-privilege, bypass exposure, telemetry coverage, DLP gap, admin activity, threat model) | `/z-soc` |

Audit framing has: a **lint scope** — files, directories, `recent`, or a topic keyword (e.g., `splunk`) — and structural / hygiene focus ("consistency", "frontmatter", "links", "orphans"). If the framing is clearly tenant-shaped (live system + symptom OR posture / capacity question), output: *"Your framing looks like a `<other-persona>` task: `<one-line reason citing the markers>`. Re-invoke as `/z-<other-persona>`?"* — and stop.

If markers are mixed, proceed here but **flag the alternative** in your first response. Then continue to the read step below.

Full classification rubric: `references/_meta/command-routing.md`.

## Load the playbook

**Use your file-read tool now to load `references/shared/audit-prompt.md`** (path is relative to the Zscaler skill repo root). Then follow the playbook contained in that file. Do not respond until you have loaded the playbook.

## Best framing for the user's input

The user's scope should be one of:

- **Directory** — `references/zia/logs/`, `references/shared/`, etc.
- **File** — `references/shared/siem-log-mapping.md`
- **Whole repo** — `.` or empty
- **Topic** — keyword across paths (e.g., `splunk`)
- **Recent changes** — `recent` (last N modified files)

Optional second arg: a check subset (e.g., `confidence`, `cross-links`).

The user's audit scope follows this command in the chat. Parse it, run the mechanical CI checks, perform the seven-check editorial pass, and output the audit register grouped by severity.

Do not edit files mid-audit — produce findings only. If scope is ambiguous, ask one targeted clarifying question.

Cross-reference: `references/shared/audit-methodology.md` for register format, severity scale, and status lifecycle — load it via your file-read tool when the playbook references it.
