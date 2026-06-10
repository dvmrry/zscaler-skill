---
role: investigator
artifact: case-intake
title: "Investigator case intake — deterministic Step 1 artifact"
content-type: prompt
last-verified: "2026-06-10"
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
  --proposed-load <displayed-load-1> \
  --proposed-load <displayed-load-2> \
  --proposed-load <displayed-load-N>
```

Compose the complete Step 1 proposed-load list before running `open-case`.
Every path shown in the Step 1 `**Proposed loads**` section must be passed as a
`--proposed-load` argument. At minimum, that list includes
`agents/investigator/prompt.md` and `agents/investigator/harness.md`; if the
displayed list includes product references or grounding cards, those paths must
also be included in the helper command.

A `status: "pass"` response from `open-case` is the verification for that turn —
`open-case` already writes and reads back all artifacts. Run `verify-case` only
when resuming an existing case or re-checking after repair:

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

After a passing `open-case`, the Step 1 response must render proposed loads from
the verified `case-intake.json` / `case-intake.md` artifacts. Do not append,
rewrite, or "helpfully" add extra paths in chat. If the proposed load list is
wrong or incomplete, rerun `open-case` with the corrected `--proposed-load`
arguments before showing the new list. Run `verify-case` only when resuming an
existing case or re-checking after a repair — not as a required second step
after a passing `open-case`.

Telemetry references under `references/{zia,zpa,zcc}/logs/` are only valid when
the user's framing already mentions logs, metrics, SIEM data, LSS/NSS,
pre-collected evidence, Splunk, compact telemetry terms such as `syslog`,
`weblog`, or `log4j`, or an explicit evidence path. If the framing does not
contain that telemetry context, the helper marks the case intake blocked
instead of allowing a speculative telemetry load. Telemetry mentions inside
user-flagged phrases (for example `LSS shows connector status log gap`) and
bare flagged telemetry keywords (for example `LSS`) count as that context;
bare flagged host or ID tokens (for example `log.example.invalid`) do not. Do
not invent extra framing JSON fields to satisfy the guardrail; put the
telemetry context in the framing fields the user actually expressed it in.

## Case Intake Fields

`case-intake.md` starts with plain top-level fields:

```text
Status: pass
Blocking Issues: none
Next Step: Load only the proposed files (open-case already verified this intake).
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

The load phase begins only after the user confirms continuation. A passing
`open-case` is the intake verification; `verify-case` is the resume/repair
check — run it only when resuming an existing case or re-checking after a
repair, not after a passing `open-case`.

Step 2 may load only the proposed loads stored in the verified
`case-intake.json`, plus later user-approved additions. If the chat-rendered
Step 1 list differs from `case-intake.json`, treat Step 1 as invalid and fix the
case intake before continuing.

After Step 2 loads are complete and before Step 3 begins, record every loaded
and deferred path with the helper:

```bash
node scripts/investigator-artifacts.mjs record-loads \
  --root <repo-root> \
  --case-slug <slug> \
  --loaded agents/investigator/prompt.md \
  --loaded agents/investigator/harness.md \
  --loaded <every-other-path-actually-read> \
  --deferred <path>=<reason>
```

A passing `record-loads` result is sufficient to proceed. `verify-loads` is
a resume/repair command — run it only when resuming an existing case or
re-checking after a repair, not in the same turn after a passing `record-loads`.

`initialize-turn-ledger` will refuse to run unless `workflow/01-loads.json`
exists and recomputes to pass. Step 3 cannot begin without a passing loads
artifact.

After Step 3 generates the first real discovery journal, render it to a temp
file and initialize the turn ledger in one press:

```bash
node scripts/investigator-artifacts.mjs initialize-turn-ledger \
  --root <repo-root> \
  --case-slug <slug> \
  --journal-file <temp-path>
```

This saves the journal and initializes the ledger atomically. If the journal
content is invalid or loads are not passing, nothing is written. If you need
to save the journal separately first (e.g. repair path), use `save-journal`:

```bash
node scripts/investigator-artifacts.mjs save-journal \
  --root <repo-root> \
  --case-slug <slug> \
  --content-file <temp-path>
```

The saved file must keep the stub's full section skeleton (`## Framing`,
`## Proposed Loads`, `## Claims` with the canonical table, `## Resolution`).
The chat turn shape and the saved file shape are not the same — see the
"Journal file template" in `agents/investigator/harness.md` Step 3 Details.

Every later controller turn should use `run-turn` as the canonical single-press
command: perform the action, render the updated journal to a temp file, write the
turn input JSON, then:

```bash
node scripts/investigator-artifacts.mjs run-turn \
  --root <repo-root> \
  --case-slug <slug> \
  --user-action <action> \
  --journal-file <path-to-rendered-updated-journal> \
  --turn-input-json <path-to-agent-owned-turn-fields>
```

`run-turn` is all-or-nothing: a failed `run-turn` leaves no pending turn to
clean up. Fix the reported problem and rerun it.

Use the split `begin-turn` / `save-journal` / `complete-turn` form for:
- Turns that need `import-evidence` (which requires an open `pendingTurn`).
- Repair flows after a failure that left state mid-transaction.

Evidence handoffs are two completed turns: first `request-user-evidence` or
`query-request` (using `run-turn`), then a later `record-user-evidence` turn
when the user provides results. Do not keep a pending turn open while waiting
for the user.

When the helper capabilities include `import-evidence`, use it during
`record-user-evidence` or `add-evidence` turns to move returned files into
case-local `evidence/` and append `evidence/MANIFEST.md`. This does not replace
the journal update or `complete-turn`; it only removes manual file copying,
hashing, naming, and manifest-row work. If the helper is unavailable, follow
the manual evidence convention instead.

Use `query-request` for Splunk/SIEM catalog-pattern requests. Use
`request-user-evidence` for non-Splunk evidence and include the exact
`evidenceRequest` in the turn JSON.

Resolution is also a separate completed turn. The direct evidence supporting a
`mark-resolved` turn must already be recorded by a prior completed
`record-user-evidence` or `add-evidence` turn.

When using the split form: if a turn becomes blocked after `begin-turn` and
before journal mutation, run `abandon-turn --reason "<reason>"` before halting.
This restores the helper-owned token only when `journal.md` is unchanged; if
the journal changed, halt and request repair instead of starting a new turn.
When using `run-turn`, a failed run leaves no pending turn — simply fix the
reported error and rerun.

If the target case directory already contains `case-intake.md`,
`case-intake.json`, or `journal.md`, treat it as a resume path and run
`verify-case` instead of `open-case`. `open-case` refuses to overwrite existing
artifacts unless `--force` is explicitly supplied; adapters should not use
`--force` unless the user has asked to replace the case intake artifacts.

The user-facing command remains `/z-investigator`. If a runtime needs a
separate resume entry point, expose a load command that verifies an existing
case intake before continuing. Do not expose a separate new-case Step 1 command
as the primary user workflow.
