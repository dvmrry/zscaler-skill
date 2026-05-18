---
description: Resume an existing investigator case from a verified case-intake artifact.
argument-hint: <case-slug>
---

<!-- adapter-deps:start -->
Always load:
- `agents/investigator/prompt.md`
- `agents/investigator/harness.md`
- `agents/investigator/case-intake.md`
<!-- adapter-deps:end -->

Case slug or path:

$ARGUMENTS

Use this command only to resume an existing case directory. For a new
investigation, use `/z-investigator`.

Before loading proposed files or continuing the investigation, run:

```bash
node scripts/investigator-artifacts.mjs verify-case --root <repo-root> --case-slug <slug>
```

If verification fails, stop and report the failure. Do not load Step 2 files,
enumerate snapshots, or generate hypotheses.

If verification passes, continue with `agents/investigator/harness.md` Step 2
or the next journal update, using the proposed loads from
`_data/cases/<slug>/case-intake.json`.
