---
description: Start an evidence-based troubleshooting investigation — parse framing, ground in kit content + tenant snapshot, generate a discovery journal with prioritized hypotheses and named evidence sources. Per-turn structured output with halt-and-wait checkpoints. Designed for procedure-following models (SWE-1.5+, Haiku+, Sonnet, Opus).
argument-hint: [what fails] in [where], [scope], since [when]; backtick `<literal-token>` any user-flagged specifics
---

Load and follow the workflow at @.windsurf/workflows/z-investigate.md.

The user's framing:

$ARGUMENTS

Follow the workflow's per-turn output format strictly. Each turn opens with a `═══ STEP N — ... ═══` banner, contains data blocks + checkpoint menu, and ends with the fixed end-marker. Banners and data blocks render as fenced code blocks; clarifications and journal table render as plain markdown. Halt at each checkpoint and wait for explicit user reply (`go` / `correct:` / `add:` / `skip:` / `redirect:` / `focus:` / `pause` per the per-step menu).

Step 1 must include the early-journal-creation step: write a stub journal to `<working-dir>/_data/incidents/<slug>/journal.md` immediately after composing PARSED FRAMING, before Checkpoint 1 fires. The artifact must exist on disk from Step 1 onward.
