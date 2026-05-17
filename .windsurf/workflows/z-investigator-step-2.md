---
description: "Internal investigator Step 2 gate — continue only from a verified passing workflow report. Normal users should continue with /z-investigator."
---

# /z-investigator-step-2

This is a runtime gate for Windsurf validation and recovery, not the normal
user entry point. Prefer `/z-investigator` for ordinary use.

## Required reads

Load these files before responding:

- `agents/investigator/prompt.md`
- `agents/investigator/harness.md`
- `agents/investigator/workflow-report.md`

## Entry gate

Before loading any proposed files, run:

```bash
node scripts/investigator-artifacts.mjs verify-report --root <repo-root> --case-slug <slug>
```

If verification fails, stop and report the failure. Do not load Step 2 files,
enumerate snapshots, or generate hypotheses.

If verification passes, continue with `agents/investigator/harness.md` Step 2
using the proposed loads from
`_data/cases/<slug>/workflow-zscaler-investigator-report.json`.
