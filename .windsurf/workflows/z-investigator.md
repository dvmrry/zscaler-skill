---
description: "Start an evidence-based Zscaler troubleshooting investigation. Loads the canonical investigator prompt, harness, and case-intake gate."
---

# /z-investigator

Workflow metadata: `agents/investigator/workflow.md`

## Required reads

<!-- adapter-deps:start -->
Always load these files before responding:

1. `agents/investigator/prompt.md`
2. `agents/investigator/harness.md`
3. `agents/investigator/case-intake.md`

Available on demand. Do not load before first response unless the trigger applies:

- `agents/investigator/methodology.md` — load when stuck, drifting, or preparing handoff.
- `agents/investigator/diagnostics/template.md` — load only when authoring or reviewing a verified reusable diagnostic.
- `agents/siem-emission-discipline.md` — load before emitting or running SIEM queries.
- `agents/tenant-schema-derivation.md` — load when canonical-vs-tenant field mismatch appears.
- `agents/loading-discipline.md` — load if stage-announcement cadence drifts.
- `agents/clarification-pattern.md` — load if clarification format drifts.
<!-- adapter-deps:end -->

All paths are relative to the Zscaler skill repo root. Do not respond until the
three required files are loaded.

## Runtime adapter rules

Follow the per-turn shape in `agents/investigator/harness.md`. Do not duplicate,
summarize, or replace the canonical procedure here.

- Ask at most one clarification per turn.
- Do not hand-write case-intake artifacts or the initial journal stub.
- Do not load Step 2 files, enumerate snapshots, or generate hypotheses until
  `verify-case` passes.
- Step 1 displayed proposed loads must exactly match the verified
  `case-intake.json` `proposedLoads` array. Do not append extra paths in chat.
  To change the list, rerun `open-case` with the corrected `--proposed-load`
  arguments and rerun `verify-case`.
- Do not use `--force` unless the user explicitly asks to replace existing case
  intake artifacts.
- After Step 3, use the turn ledger commands before and after every later
  investigation action.
- A request turn is a completed turn. `query-request` and
  `request-user-evidence` must run through `begin-turn` and `complete-turn`,
  then halt. The user's returned evidence starts a new `record-user-evidence`
  turn.
- Do not leave `pendingTurn` open across a user checkpoint or evidence handoff.
- If this is a dry-run or simulated test, say so. Do not claim helper commands
  ran, files were written, or `journal.md` was saved unless the runtime actually
  performed those actions.

## Step 1 helper gate

For a new case, follow `agents/investigator/case-intake.md`: create the framing
JSON, run `open-case`, then run `verify-case` before reporting Step 1 success.

```bash
node scripts/investigator-artifacts.mjs open-case \
  --root <repo-root> \
  --case-slug <slug> \
  --framing-json <path-to-framing-json> \
  --proposed-load agents/investigator/prompt.md \
  --proposed-load agents/investigator/harness.md
```

```bash
node scripts/investigator-artifacts.mjs verify-case \
  --root <repo-root> \
  --case-slug <slug>
```

If the target case directory already contains `case-intake.md`,
`case-intake.json`, or `journal.md`, do not run `open-case`. Run `verify-case`
and continue through `/z-investigator-resume`.

After `verify-case`, read `case-intake.json` and render proposed loads only from
its `proposedLoads` array. If the displayed Step 1 list differs from the JSON,
stop before Step 2 and report `Case intake mismatch`.

## Step 3 and later turns

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

For request turns, `complete-turn` happens before asking the user for results.
Do not wait with an open pending transaction.
