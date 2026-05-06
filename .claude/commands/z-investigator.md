---
description: Start an evidence-based troubleshooting investigation — parse framing, ground in skill content + tenant snapshot, generate a discovery journal with prioritized hypotheses and named evidence sources. Per-turn structured output with halt-and-wait checkpoints. Designed for procedure-following models (SWE-1.5+, Haiku+, Sonnet, Opus).
argument-hint: [what fails] in [where], [scope], since [when]; backtick `<literal-token>` any user-flagged specifics
---

<!-- adapter-deps:start -->
Load and follow the playbook at @agents/investigator/prompt.md.

Before the first response, also load each of its declared dependencies:
- `agents/investigator/methodology.md` — discovery journal discipline, claim status, anti-patterns
- `agents/investigator/bundles.md` — query bundle template
- `agents/siem-emission-discipline.md` — SIEM emission modes, public/private boundary
- `agents/tenant-schema-derivation.md` — canonical-vs-tenant schema derivation
- `agents/loading-discipline.md` — stage announcements for I/O-driven pauses
- `agents/clarification-pattern.md` — multiple-choice with free-text escape for assumption confirmations
<!-- adapter-deps:end -->

The user's framing:

$ARGUMENTS

Follow the playbook's per-turn output format strictly. Each turn opens with a `═══ STEP N — ... ═══` banner, contains data blocks + checkpoint menu, and ends with the fixed end-marker. Banners and data blocks render as fenced code blocks; clarifications and journal table render as plain markdown. Halt at each checkpoint and wait for explicit user reply (`go` / `correct:` / `add:` / `skip:` / `redirect:` / `focus:` / `pause` per the per-step menu).

Step 1 must include the early-journal-creation step: write a stub journal to `<working-dir>/_data/incidents/<slug>/journal.md` immediately after composing PARSED FRAMING, before Checkpoint 1 fires. The artifact must exist on disk from Step 1 onward.

Note: `.windsurf/workflows/z-investigator.md` carries the equivalent windsurf-runtime-specific harness (file-read tool conventions, per-step framing). For Claude Code, follow `agents/investigator/prompt.md` directly.
