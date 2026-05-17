---
role: investigator
artifact: workflow-report
title: "Investigator workflow report — deterministic Step 1 artifact"
content-type: prompt
last-verified: "2026-05-17"
confidence: high
source-tier: practice
sources:
  - "agents/investigator/harness.md"
  - "agents/_meta/workflow-artifacts.md"
  - "scripts/investigator-artifacts.mjs"
author-status: draft
---

# Investigator Workflow Report

This is the canonical Step 1 intake gate for `/z-investigator`.

The workflow report turns the user's framing into durable artifacts before any
grounding files are loaded or hypotheses are rendered. Runtime adapters may
wrap this phase, but they should not redefine it.

## Purpose

The report phase creates and verifies:

- `_data/cases/<slug>/workflow-zscaler-investigator-report.md`
- `_data/cases/<slug>/workflow-zscaler-investigator-report.json`
- `_data/cases/<slug>/journal.md`

The next phase must refuse to continue unless
`workflow-zscaler-investigator-report.md` exists with:

```text
Status: pass
Blocking Issues: none
```

If either field differs, the investigator is still in intake and must resolve
the blocker before loading evidence or generating hypotheses.

## Required Helper

Use the Node helper for artifact creation and verification:

```bash
node scripts/investigator-artifacts.mjs create-report \
  --root <repo-root> \
  --case-slug <slug> \
  --framing-json <path-to-framing-json> \
  --proposed-load agents/investigator/prompt.md \
  --proposed-load agents/investigator/harness.md
```

Then verify the gate before continuing:

```bash
node scripts/investigator-artifacts.mjs verify-report \
  --root <repo-root> \
  --case-slug <slug>
```

The helper uses only Node standard libraries. It is intentionally small so
runtime adapters can invoke the same brittle boundary instead of relying on
prose-only instruction following.

## Framing JSON

The helper accepts a JSON file so runtimes do not need to pass complex
multi-line strings through shell arguments. Keep the shape simple:

```json
{
  "workingDirectory": "/absolute/path/to/zscaler-skill",
  "symptom": "ZPA users intermittently fail to reach wiki.internal",
  "tenantCloud": "zs2",
  "products": ["zpa", "zcc"],
  "scope": "many users",
  "recency": "started this morning",
  "whatWorks": "other apps on the same segment work",
  "alreadyTried": "restarted connector group",
  "userFlaggedSpecifics": ["wiki.internal"],
  "evidencePaths": []
}
```

Required fields for a `pass` report:

- `workingDirectory`
- `symptom`
- `scope`

`tenantCloud` is required only when the proposed loads or framing need tenant
snapshot access. If unknown, use `unknown` and keep snapshot loads out of Step
1 until the user confirms the cloud.

## Proposed Load Guardrails

Step 1 proposed loads are docs-only. They must include:

- `agents/investigator/prompt.md`
- `agents/investigator/harness.md`

They may include grounding cards or product references that match the framing.
They must not include snapshot files, sibling case journals, or broad data
directories.

Log-schema references are only valid when the user's framing already mentions
logs, SIEM data, LSS/NSS, pre-collected evidence, Splunk, or an explicit
evidence/log path. If the framing does not contain that log context, the helper
marks the report blocked instead of allowing a speculative log-schema load.

## Report Fields

`workflow-zscaler-investigator-report.md` starts with plain top-level fields:

```text
Status: pass
Blocking Issues: none
Next Step: Run verify-report, then load only the proposed files.
```

For blocked reports:

```text
Status: blocked
Blocking Issues: <one-line issue summary>
Next Step: Resolve the blocking issue, then rerun create-report.
```

Keep these fields stable. Runtime adapters and reviewers can grep them without
parsing freeform prose.

## Phase Boundary

After `create-report`, stop. Do not load Step 2 files, enumerate snapshots,
generate hypotheses, or render a discovery journal table in the same response.

The load phase begins only after the user confirms continuation and
`verify-report` reports a passing workflow report.

The user-facing command remains `/z-investigator`. If a runtime cannot
reliably honor this as one monolithic command, expose internal step gates such
as `/z-investigator-step-1` and `/z-investigator-step-2` for adapter validation
and recovery. Those step commands should not become the primary user workflow.
