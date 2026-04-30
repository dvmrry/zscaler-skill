---
description: Run an editorial / structural audit of skill kit references. Mechanical lint via existing CI scripts, plus agent-driven editorial pass (voice, structural shape, confidence calibration, content/frontmatter agreement, cross-link reciprocity, dangling concepts, open-question hygiene).
---

# /z-audit

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
