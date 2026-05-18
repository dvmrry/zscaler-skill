---
role: investigator
artifact: case-intake
title: "Investigator case intake — deterministic Step 1 artifact"
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

# Investigator Case Intake

This is the canonical Step 1 intake gate for `/z-investigator`.

The case intake turns the user's framing into durable artifacts before any
grounding files are loaded or hypotheses are rendered. Runtime adapters may
wrap this phase, but they should not redefine it.

## Purpose

The case intake phase creates and verifies:

- `_data/cases/<slug>/case-intake.md`
- `_data/cases/<slug>/case-intake.json`
- `_data/cases/<slug>/journal.md`
- `_data/cases/<slug>/workflow/02-turns.jsonl` after Step 3
- `_data/cases/<slug>/workflow/02-turn-state.json` after Step 3

The next phase must refuse to continue unless
`case-intake.md` exists with:

```text
Status: pass
Blocking Issues: none
```

If either field differs, the investigator is still in intake and must resolve
the blocker before loading evidence or generating hypotheses.

## Required Helper

Use the Node helper for artifact creation and verification:

```bash
node scripts/investigator-artifacts.mjs open-case \
  --root <repo-root> \
  --case-slug <slug> \
  --framing-json <path-to-framing-json> \
  --proposed-load agents/investigator/prompt.md \
  --proposed-load agents/investigator/harness.md
```

Then verify the gate before continuing:

```bash
node scripts/investigator-artifacts.mjs verify-case \
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

Required fields for a passing case intake:

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
directories. Every proposed load must exist under the repository root; a
missing file is a blocked intake, not a reason to invent a replacement path.

Telemetry references under `references/{zia,zpa,zcc}/logs/` are only valid when
the user's framing already mentions logs, metrics, SIEM data, LSS/NSS,
pre-collected evidence, Splunk, compact telemetry terms such as `syslog`,
`weblog`, or `log4j`, or an explicit evidence path. If the framing does not
contain that telemetry context, the helper marks the case intake blocked
instead of allowing a speculative telemetry load.

## Case Intake Fields

`case-intake.md` starts with plain top-level fields:

```text
Status: pass
Blocking Issues: none
Next Step: Run verify-case, then load only the proposed files.
```

For blocked case intakes:

```text
Status: blocked
Blocking Issues: <one-line issue summary>
Next Step: Resolve the blocking issue, then rerun open-case.
```

Keep these fields stable. Runtime adapters and reviewers can grep them without
parsing freeform prose.

## Phase Boundary

After `open-case`, stop. Do not load Step 2 files, enumerate snapshots,
generate hypotheses, or render a discovery journal table in the same response.

The load phase begins only after the user confirms continuation and
`verify-case` reports a passing case intake.

After Step 3 writes and verifies the first real discovery journal, initialize
the turn ledger before presenting the Step 3 checkpoint:

```bash
node scripts/investigator-artifacts.mjs initialize-turn-ledger \
  --root <repo-root> \
  --case-slug <slug>
```

Every later controller turn must run `begin-turn` before modifying the journal
and `complete-turn` after exactly one investigation action. Evidence handoffs
are two completed turns: first `request-user-evidence` or `query-request`, then
a later `record-user-evidence` turn when the user provides results. Do not keep
a pending turn open while waiting for the user.

Resolution is also a separate completed turn. The direct evidence supporting a
`mark-resolved` turn must already be recorded by a prior completed
`record-user-evidence` or `add-evidence` turn.

If a later turn becomes blocked after `begin-turn` and before journal mutation,
run `abandon-turn --reason "<reason>"` before halting. This restores the
helper-owned token only when `journal.md` is unchanged; if the journal changed,
halt and request repair instead of starting a new turn.

If the target case directory already contains `case-intake.md`,
`case-intake.json`, or `journal.md`, treat it as a resume path and run
`verify-case` instead of `open-case`. `open-case` refuses to overwrite existing
artifacts unless `--force` is explicitly supplied; adapters should not use
`--force` unless the user has asked to replace the case intake artifacts.

The user-facing command remains `/z-investigator`. If a runtime needs a
separate resume entry point, expose a load command that verifies an existing
case intake before continuing. Do not expose a separate new-case Step 1 command
as the primary user workflow.
