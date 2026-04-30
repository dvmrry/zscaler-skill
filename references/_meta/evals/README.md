---
product: shared
topic: "evals-index"
title: "Eval suite — behavioral specifications + runner usage"
content-type: reference
last-verified: "2026-04-30"
confidence: high
sources: []
author-status: draft
---

# Eval suite — `evals.json`

Hand-written behavioral specifications: 19 entries shaped as `{prompt, expected_output, assertions, must_cite_files, must_not_say, expected_confidence, tenant_data_required}`. Captures concrete examples of "what a correct answer looks like" for the skill across URL filtering, ZPA segments, ZCC forwarding, SSL inspection, and other Tier 1 areas.

## What this is — and isn't

**It is** a structured specification of expected skill behavior. Each entry encodes a realistic prompt plus the assertions / citations / traps / confidence level that a correct answer must satisfy.

**It isn't** an automated test harness. The eval suite *can* be exercised by `scripts/run-evals.py`, but execution is manual: the runner emits prompts for human-driven runs through Claude Code (or any session that loads the skill), then validates pasted-back responses against the eval criteria.

The separation keeps the runner cheap (no API key required) and lets the operator pick which model / session / fork to evaluate against.

## Running the suite

```bash
# Print all prompts for manual run
./scripts/run-evals.py list

# Print one specific eval
./scripts/run-evals.py list --id 2

# Validate captured responses (file format: {"<id>": "<response_text>", ...})
./scripts/run-evals.py validate responses.json
```

The validate command emits a markdown report to stdout and saves it under `_data/logs/eval-results-<UTC-date>.md`. Exit code: 0 if all responses pass, 1 if any fail validation, 2 on usage errors.

## Validation rules

Per eval, a response must:

- Contain each `assertions` substring (case-insensitive)
- Mention each `must_cite_files` path or filename (case-insensitive)
- NOT contain any `must_not_say` substring (case-insensitive)
- Claim a confidence level matching `expected_confidence` (advisory — not mechanically checked)

Failure on any of those four → eval fails.

## Maintenance

When a reference doc is materially updated, the corresponding eval (if one exists) should be re-run to confirm behavior didn't drift. New high-confidence ref content without a matching eval is a coverage gap — see `IMPROVEMENTS.md` "Eval coverage as a freshness signal."

The `must_cite_files` paths are validated by `scripts/check-hygiene.py` to catch eval-references-deleted-file rot. If you delete or rename a referenced file, update the eval too.

## Schema

See `evals.json` § `schema_notes` for field-level documentation.

## Cross-links

- [`scripts/run-evals.py`](../../../scripts/run-evals.py) — the runner
- [`scripts/check-hygiene.py`](../../../scripts/check-hygiene.py) — validates `must_cite_files` paths
- [`../../../IMPROVEMENTS.md`](../../../IMPROVEMENTS.md) — eval-coverage and runner improvements
