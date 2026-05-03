---
description: Run an editorial / structural audit of skill kit references. Mechanical lint via existing CI scripts, plus agent-driven editorial pass (voice, structural shape, confidence calibration, content/frontmatter agreement, cross-link reciprocity, dangling concepts, open-question hygiene, citation discipline).
---

# /z-audit

## Required reads — do these now, in order

1. **Use your file-read tool to load `references/shared/audit-prompt.md`.** This is the playbook. It carries the First Response procedure, mechanical CI invocations, the eight-check editorial pass, and the audit register format.
2. **Use your file-read tool to load `references/shared/audit-methodology.md`.** This is the methodology. It carries the discipline the playbook depends on — register format, severity scale, status lifecycle, anti-patterns.

Both paths are relative to the Zscaler skill repo root. **Do not respond until both files are loaded.** Then follow the playbook's First Response procedure with the methodology already in context.

## Best framing for the user's input

The user's scope should be one of:

- **Directory** — `references/zia/logs/`, `references/shared/`, etc.
- **File** — `references/shared/siem-log-mapping.md`
- **Whole repo** — `.` or empty
- **Topic** — keyword across paths (e.g., `splunk`)
- **Recent changes** — `recent` (last N modified files)

Optional second arg: a check subset (e.g., `confidence`, `cross-links`).

The user's audit scope follows this command in the chat. Parse it, run the mechanical CI checks, perform the eight-check editorial pass, and output the audit register grouped by severity.

Do not edit files mid-audit — produce findings only. If scope is ambiguous, ask one targeted clarifying question.
