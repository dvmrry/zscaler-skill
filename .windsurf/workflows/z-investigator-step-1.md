---
description: "Internal investigator Step 1 gate — create and verify workflow report artifacts, then stop. Normal users should start with /z-investigator."
---

# /z-investigator-step-1

This is a runtime gate for Windsurf validation and recovery, not the normal
user entry point. Prefer `/z-investigator` for ordinary use.

## Required reads

Load these files before responding:

- `agents/investigator/prompt.md`
- `agents/investigator/workflow-report.md`

## Runtime behavior

Follow `agents/investigator/workflow-report.md` exactly.

This command performs only Step 1:

1. Parse the user's framing into a short JSON object.
2. Write that JSON object to a temporary or case-local file.
3. Run `node scripts/investigator-artifacts.mjs create-report`.
4. If the helper returns `Status: pass`, run `node scripts/investigator-artifacts.mjs verify-report`.
5. Report the status, the `workflow-zscaler-investigator-report.md` path, the
   `workflow-zscaler-investigator-report.json` path, and the `journal.md` path.
6. Stop.

Do not load Step 2 files, enumerate snapshots, generate hypotheses, or continue
the investigation in this command. The normal continuation path is
`/z-investigator`; this step command exists so weaker runtimes can be tested
against the hard artifact gate independently.
