---
id: z-investigator
title: Zscaler Investigator
role: investigator
artifact: workflow
content-type: reference
last-verified: "2026-05-18"
confidence: medium
sources:
  - agents/investigator/prompt.md
  - agents/investigator/harness.md
  - agents/investigator/case-intake.md
  - agents/investigator/grounding/index.md
  - scripts/investigator-artifacts.mjs
author-status: draft
summary: Evidence-based Zscaler troubleshooting investigation
primary-command: /z-investigator
known-runtimes:
  - codex
  - windsurf
  - claude
required-reads:
  - agents/investigator/prompt.md
  - agents/investigator/harness.md
  - agents/investigator/case-intake.md
  - agents/investigator/grounding/index.md
optional-reads:
  - agents/investigator/methodology.md
  - agents/investigator/diagnostics/template.md
  - agents/siem-emission-discipline.md
  - agents/tenant-schema-derivation.md
  - agents/loading-discipline.md
  - agents/clarification-pattern.md
supporting-scripts:
  - scripts/investigator-artifacts.mjs
  - scripts/prepare-overlay-submission.mjs
---

# Zscaler Investigator Workflow

Load and follow the canonical investigator files listed in `required-reads`.

Runtime adapters must preserve:

- Step 1 case intake gate
- Step 2 file-load checkpoint
- Step 3 journal and turn-ledger initialization
- Post-Step-3 begin/complete/abandon turn transaction
- One action per turn
- Resolution completion gate

The metadata gives adapter docs and repo checks a stable place to point.

Supporting script: `scripts/investigator-artifacts.mjs`

## Required Load Order

Before responding, load:

1. `agents/investigator/prompt.md`
2. `agents/investigator/harness.md`
3. `agents/investigator/case-intake.md`
4. `agents/investigator/grounding/index.md`

Available on demand. Do not load these before the first response unless the
trigger applies:

- `agents/investigator/methodology.md` — load when stuck, drifting, or preparing handoff.
- `agents/investigator/diagnostics/template.md` — load only when authoring or reviewing a verified reusable diagnostic.
- `agents/siem-emission-discipline.md` — load before emitting or running SIEM queries.
- `agents/tenant-schema-derivation.md` — load when canonical-vs-tenant field mismatch appears.
- `agents/loading-discipline.md` — load if stage-announcement cadence drifts.
- `agents/clarification-pattern.md` — load if clarification format drifts.

## New Case Entry

Follow `agents/investigator/case-intake.md`. Create the framing JSON, compose
the complete Step 1 proposed-load list, run `open-case`, then run `verify-case`
before reporting Step 1 success.

Every path displayed in the Step 1 `**Proposed loads**` section must be passed
to `open-case` as a `--proposed-load` argument.

```bash
node scripts/investigator-artifacts.mjs open-case \
  --root <repo-root> \
  --case-slug <slug> \
  --framing-json <path-to-framing-json> \
  --proposed-load <displayed-load-1> \
  --proposed-load <displayed-load-2> \
  --proposed-load <displayed-load-N>
```

```bash
node scripts/investigator-artifacts.mjs verify-case \
  --root <repo-root> \
  --case-slug <slug>
```

After `verify-case`, render proposed loads only from the verified
`case-intake.json` `proposedLoads` array. If the displayed Step 1 list differs
from the JSON, stop before Step 2 and report `Case intake mismatch`.

Do not hand-write case-intake artifacts or the initial journal stub. Do not use
`--force` unless the user explicitly asks to replace existing case-intake
artifacts.

## Resume Entry

Use resume only for an existing case directory. Before loading proposed files or
continuing the investigation, run:

```bash
node scripts/investigator-artifacts.mjs verify-case --root <repo-root> --case-slug <slug>
```

If verification fails, stop and report the failure. Do not load Step 2 files,
enumerate snapshots, or generate hypotheses.

If verification passes, continue with `agents/investigator/harness.md` Step 2 or
the next journal update, using the proposed loads from
`_data/cases/<slug>/case-intake.json`.

## Later Turns

After Step 3 saves the first real `journal.md`, initialize the turn ledger before
presenting the Step 3 checkpoint:

```bash
node scripts/investigator-artifacts.mjs initialize-turn-ledger \
  --root <repo-root> \
  --case-slug <slug>
```

For every later controller turn, run `begin-turn`, perform exactly one
investigation action, then run `complete-turn`. If the action blocks after
`begin-turn` and before journal mutation, run `abandon-turn --reason "<reason>"`
before halting.

A request turn is a completed turn. `query-request` and
`request-user-evidence` must run through `begin-turn` and `complete-turn`, then
halt. The user's returned evidence starts a new `record-user-evidence` turn. Do
not leave `pendingTurn` open across a user checkpoint or evidence handoff.

If this is a dry-run or simulated test, say so. Use "would write", "would run",
or "would save" phrasing. Do not claim helper commands ran, files were written,
or `journal.md` was saved unless the runtime actually performed those actions.

## Closeout Option

After a case has useful durable artifacts, offer this only as an explicit user
choice:

- Prepare overlay submission
- Archive locally
- Pause

Submission must never happen automatically. If the user chooses submission, run
the deterministic helper with explicit approval:

```bash
node scripts/prepare-overlay-submission.mjs \
  --root <repo-root> \
  --case-path _data/cases/<case-slug> \
  --approve
```

Report the helper JSON. Do not hand-assemble git commands or claim that a PR
was created unless the helper or a follow-up command actually did it.
