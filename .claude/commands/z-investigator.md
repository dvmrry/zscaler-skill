---
description: Start an evidence-based troubleshooting investigation — parse framing, ground in skill content + tenant snapshot, generate a discovery journal with prioritized hypotheses and named evidence sources. Per-turn structured output with halt-and-wait checkpoints. Designed for procedure-following models (SWE-1.5+, Haiku+, Sonnet, Opus).
argument-hint: [what fails] in [where], [scope], since [when]; backtick `<literal-token>` any user-flagged specifics
---

<!-- adapter-deps:start -->
Workflow metadata: `agents/investigator/workflow.md`

Always load:
- `agents/investigator/prompt.md`
- `agents/investigator/harness.md`
- `agents/investigator/case-intake.md`

Available on demand. Do not load before first response unless the trigger applies:
- `agents/investigator/methodology.md` — load when stuck, drifting, or preparing handoff.
- `agents/investigator/diagnostics/template.md` — load only when authoring or reviewing a verified reusable diagnostic.
- `agents/siem-emission-discipline.md` — load before emitting or running SIEM queries.
- `agents/tenant-schema-derivation.md` — load when canonical-vs-tenant field mismatch appears.
- `agents/loading-discipline.md` — load if stage-announcement cadence drifts.
- `agents/clarification-pattern.md` — load if clarification format drifts.
<!-- adapter-deps:end -->

The user's framing:

$ARGUMENTS

Follow the per-turn shape defined in the canonical playbook. Output is plain markdown — headers, bold labels, bullets, blockquotes, real markdown tables — never wrapped in code fences except for genuine code/YAML/JSON. Per [`agents/clarification-pattern.md`](../../agents/clarification-pattern.md), ask **one clarification per turn, never multiple**; when the question has 2–5 closed-set options, use Claude Code's `AskUserQuestion` tool so the user gets native clickable options. The closing multi-choice IS the checkpoint — no separate `═══ CHECKPOINT N` banner or verb-list reply guide is emitted.

Step 1 must use the case-intake helper; do not hand-write the journal stub.
If the target case directory already exists with `case-intake.md`,
`case-intake.json`, or `journal.md`, run `verify-case` and resume through
`/z-investigator-resume`; do not use `--force` unless the user explicitly asks to
replace the intake artifacts.
After composing the parsed framing and proposed loads, run the literal command
shape from `agents/investigator/case-intake.md`:

```bash
node scripts/investigator-artifacts.mjs open-case \
  --root <repo-root> \
  --case-slug <slug> \
  --framing-json <path-to-framing-json> \
  --proposed-load agents/investigator/prompt.md \
  --proposed-load agents/investigator/harness.md
```

Then verify before rendering a successful Step 1 checkpoint:

```bash
node scripts/investigator-artifacts.mjs verify-case \
  --root <repo-root> \
  --case-slug <slug>
```

Only after verification passes may you report `case-intake.md`,
`case-intake.json`, and `journal.md` as created.
Render proposed loads only from the verified `case-intake.json`
`proposedLoads` array. Do not append extra paths in chat. If the proposed load
list needs changes, rerun `open-case` with corrected `--proposed-load`
arguments and rerun `verify-case`.

Step 3 and later turns must use the turn transaction gates defined in
`agents/investigator/harness.md` and `agents/investigator/case-intake.md`:
`initialize-turn-ledger` after the first real journal is saved, then
`begin-turn` / `complete-turn` around every subsequent investigation turn.

Note: `.windsurf/workflows/z-investigator.md` contains Windsurf-specific adapter instructions. For Claude Code, follow `agents/investigator/prompt.md`, `agents/investigator/harness.md`, and `agents/investigator/case-intake.md` directly; this command adds Claude-specific loading and helper gates.
