---
description: Start an evidence-based troubleshooting investigation — parse framing, ground in skill content + tenant snapshot, generate a discovery journal with prioritized hypotheses and named evidence sources. Per-turn structured output with halt-and-wait checkpoints. Designed for procedure-following models (SWE-1.5+, Haiku+, Sonnet, Opus).
argument-hint: [what fails] in [where], [scope], since [when]; backtick `<literal-token>` any user-flagged specifics
---

<!-- adapter-deps:start -->
Always load:
- `agents/investigator/prompt.md`

Available on demand. Do not load before first response unless the trigger applies:
- `agents/investigator/methodology.md` — load when stuck, drifting, or preparing handoff.
- `agents/investigator/bundles.md` — load when the issue matches a known repeated investigation pattern.
- `agents/siem-emission-discipline.md` — load before emitting or running SIEM queries.
- `agents/tenant-schema-derivation.md` — load when canonical-vs-tenant field mismatch appears.
- `agents/loading-discipline.md` — load if stage-announcement cadence drifts.
- `agents/clarification-pattern.md` — load if clarification format drifts.
<!-- adapter-deps:end -->

The user's framing:

$ARGUMENTS

Follow the per-turn shape defined in the canonical playbook. Output is plain markdown — headers, bold labels, bullets, blockquotes, real markdown tables — never wrapped in code fences except for genuine code/YAML/JSON. Per [`agents/clarification-pattern.md`](../../agents/clarification-pattern.md), ask **one clarification per turn, never multiple**; when the question has 2–5 closed-set options, use Claude Code's `AskUserQuestion` tool so the user gets native clickable options. The closing multi-choice IS the checkpoint — no separate `═══ CHECKPOINT N` banner or verb-list reply guide is emitted.

Step 1 must include the early-journal-creation step: write a stub journal to `<working-dir>/_data/incidents/<slug>/journal.md` immediately after composing the parsed framing. The artifact must exist on disk from Step 1 onward.

Note: `.windsurf/workflows/z-investigator.md` carries the equivalent windsurf-runtime-specific harness. For Claude Code, follow `agents/investigator/prompt.md` directly — this command is a thin loader, not a re-statement of the playbook.
