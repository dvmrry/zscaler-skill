---
description: Run a journal-first incident retro / postmortem. Loads the incident journal, extracts material warnings, writes or reviews postmortem.md, and ends with a proceed/stop decision gate.
argument-hint: [incident-dir] — e.g., "_data/incidents/2026-05-14-ci-warning-regression/ write postmortem.md"
---

<!-- adapter-deps:start -->
Load and follow the playbook at @agents/retro/prompt.md.

Before the first response, also load each of its declared dependencies:
- `agents/retro/methodology.md` — journal-first postmortem format, warning ledger, decision gate
- `agents/investigator/methodology.md` — claim status semantics from the investigation journal
- `agents/clarification-pattern.md` — multiple-choice clarification pattern when the incident path is ambiguous
<!-- adapter-deps:end -->

The user's retro scope:

$ARGUMENTS

Locate the incident directory, load `journal.md` first, extract material warnings, and produce/update `postmortem.md` with a warning ledger and final gate. No journal means no retro. If unresolved material warnings remain, do not recommend pushing forward unless the user explicitly accepts the risk with an owner or guardrail.
