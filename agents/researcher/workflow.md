---
id: z-researcher
title: Zscaler Researcher
role: researcher
artifact: workflow
content-type: reference
last-verified: "2026-07-26"
confidence: medium
sources:
  - agents/researcher/prompt.md
  - agents/researcher/grounding/index.md
  - agents/researcher/writer.md
  - agents/researcher/verifier.md
  - agents/declared-records.md
  - scripts/prepare-overlay-submission.mjs
  - docs/data-contract/knowledge.md
author-status: reviewed
summary: Citation-backed reference expansion workflow
primary-command: /z-researcher
known-runtimes:
  - codex
  - devin
  - claude
required-reads:
  - agents/researcher/prompt.md
  - agents/researcher/grounding/index.md
  - agents/declared-records.md
optional-reads:
  - agents/researcher/writer.md
  - agents/researcher/verifier.md
supporting-scripts:
  - scripts/check-hygiene.py
  - scripts/check-citations.sh
  - scripts/check-orphans.py
  - scripts/prepare-overlay-submission.mjs
---

# Zscaler Researcher Workflow

Load and follow the files listed in `required-reads`. Load
`agents/researcher/writer.md` only for Step 3a and
`agents/researcher/verifier.md` only for Step 3b, or let a runtime-specific
subagent wrapper load those files.

Use this workflow to expand reference docs from source material. Follow the
parse, extract, write, and verify checkpoints in `agents/researcher/prompt.md`.
The checkpoints are audit/attestation gates, not helper-enforced structural
gates.

## Operational-knowledge exclusion

Never load or search `<mount>/knowledge/` during a researcher run, even when a
broad search or user-supplied scope would include it. Researcher output is
upstream-bound; private operational records, their evidence, and overlay paths
must not enter reference prose. A human may instead provide a brief authored
from a public source, which is evaluated like any other public input.

Supporting scripts:

- `scripts/check-hygiene.py`
- `scripts/check-citations.sh`
- `scripts/check-orphans.py`
- `scripts/prepare-overlay-submission.mjs`

## Closeout Option

If the research run produced durable runtime-data artifacts such as schema
notes, evidence summaries, or plans, first respect the configured runtime-data
tracking mode. In a private work mirror with `runtimeData.tracking: "tracked"`,
the closeout is an ordinary local commit in that mirror. For installations that
still use a separate overlay repository, offer overlay submission only as an
explicit user choice after verification. Submission must never happen
automatically.

Use:

```bash
node scripts/prepare-overlay-submission.mjs \
  --root <repo-root> \
  --artifact <path-under-_data> \
  --approve
```

Report the helper JSON and stop for user review.
