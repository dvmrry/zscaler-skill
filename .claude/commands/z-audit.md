---
description: Run an editorial / structural audit of skill kit references. Mechanical lint via existing CI scripts, plus agent-driven editorial pass (voice, structural shape, confidence calibration, content/frontmatter agreement, cross-link reciprocity, dangling concepts, open-question hygiene, citation discipline).
argument-hint: [scope: directory, file, "." for whole repo, or topic keyword]
---

Load and follow the playbook at @references/shared/audit-prompt.md.

The user's audit scope:

$ARGUMENTS

Parse the scope, run the mechanical CI checks (`scripts/check-hygiene.py`, `scripts/check-citations.sh` — note this now includes inference-without-citation detection, `scripts/check-staleness.sh`, `scripts/check-orphans.py`, `scripts/check-doc-links.py` if scope touches docs/), then perform the eight-check editorial pass per the playbook. Output an audit register with findings grouped by severity. Do not edit files — produce findings only. If scope is ambiguous, ask one clarifying question.
