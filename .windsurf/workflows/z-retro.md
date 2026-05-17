---
description: Run a journal-first incident retro / postmortem. Loads the incident journal, extracts material warnings, writes or reviews postmortem.md, and ends with a proceed/stop decision gate.
---

# /z-retro

## Required reads — do these now, in order

<!-- adapter-deps:start -->
1. **Use your file-read tool to load `agents/retro/prompt.md`.** This is the playbook. It carries the artifact-loading order, warning-ledger extraction, and output shape.
2. **Use your file-read tool to load `agents/retro/methodology.md`.** This is the methodology. It defines the journal-first postmortem format, warning dispositions, and final decision gate.
3. **Use your file-read tool to load `agents/investigator/methodology.md`.** Claim status semantics for interpreting the investigation journal.
4. **Use your file-read tool to load `agents/clarification-pattern.md`.** Multiple-choice clarification pattern when the incident path is ambiguous.
<!-- adapter-deps:end -->

All paths are relative to the Zscaler skill repo root. **Do not respond until all files are loaded.** Then follow the retro playbook: locate the case directory, load `journal.md` first, extract material warnings, render/update `postmortem.md`, and close with the final gate.

## Best framing for the user's input

The user's retro scope should include:

- **Case directory** — `_data/cases/<YYYY-MM-DD>-<slug>/`
- **Concern** — what decision or warning the retro must address
- **Related PR / commit** — optional, but useful for `What changed`
- **Desired output** — write `postmortem.md`, review an existing postmortem, or produce warning ledger only

No journal means no retro. If unresolved material warnings remain, do not recommend pushing forward unless the user explicitly accepts the risk with an owner or guardrail.
