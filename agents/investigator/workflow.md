---
id: z-investigator
title: Zscaler Investigator
role: investigator
artifact: workflow
content-type: reference
last-verified: "2026-06-12"
confidence: medium
sources:
  - agents/investigator/prompt.md
  - agents/investigator/harness.md
  - agents/investigator/case-intake.md
  - agents/investigator/grounding/index.md
  - agents/siem-emission-discipline.md
  - scripts/investigator-artifacts.mjs
author-status: reviewed
summary: Evidence-based Zscaler troubleshooting investigation
primary-command: /z-investigator
known-runtimes:
  - codex
  - devin
  - claude
required-reads:
  - agents/investigator/prompt.md
  - agents/investigator/harness.md
  - agents/investigator/case-intake.md
  - agents/investigator/grounding/index.md
  - agents/siem-emission-discipline.md
optional-reads:
  - agents/investigator/methodology.md
  - agents/investigator/diagnostics/template.md
  - agents/tenant-schema-derivation.md
  - agents/loading-discipline.md
  - agents/clarification-pattern.md
supporting-scripts:
  - scripts/investigator-artifacts.mjs
  - scripts/investigator-mcp-server.mjs
  - scripts/prepare-overlay-submission.mjs
---

# Zscaler Investigator Workflow

Load and follow the canonical investigator files listed in `required-reads`.

Runtime adapters must preserve:

- Step 1 case intake gate (open-case)
- Step 2 file-load checkpoint
- Step 2 load-recording gate (record-loads gate before Step 3)
- Step 3 journal save and turn-ledger initialization gate
- Post-Step-3 status-first recovery (status before any action when resuming or after failure)
- Post-Step-3 atomic turn transaction (journal write + ledger event, validated before write)
- One investigation action per turn
- Resolution completion gate (completionGate on mark-resolved)

The metadata gives adapter docs and repo checks a stable place to point.

Supporting scripts: `scripts/investigator-artifacts.mjs`,
`scripts/investigator-mcp-server.mjs`.

On MCP runtimes, the role entrypoint is server-provided (prompt `investigate`),
and the final investigation answer is produced by the `render_report` tool — not
by model narration. Claim statuses in the answer come from the on-disk journal;
the turn history comes from the ledger. See
[`agents/_meta/runtime-adapters.md`](../_meta/runtime-adapters.md) for the
answer-from-artifact rule and available resource URIs.

## Transport selection

Both transports enforce the identical gates (same helper core) and share the
identical reasoning discipline (`prompt.md`, `harness.md`, `grounding/`). The
only difference is whether gate calls go through MCP tools or shell commands.
Choose once per case — never mix transports mid-case.

**MCP path (preferred when available).** If the `zscaler-investigator` MCP
server is mounted — that is, the runtime offers tools named `status`,
`open_case`, `run_turn`, `render_report`, etc. — use the MCP path. Retrieve
the server's `investigate` prompt (`prompts/get investigate`) and follow it:
it carries the gated order, premise-challenge, status-first, and
answer-from-artifact rules. Drive every gate as its MCP tool. The final answer
to the user is the output of `render_report` (or the
`investigator://case/{slug}/report` resource) — never model narration. The
same discipline files (`prompt.md`, `harness.md`, `grounding/index.md`) still
govern reasoning; the MCP entrypoint at
`agents/investigator/mcp-entrypoint.md` is what the server returns for the
`investigate` prompt.

**CLI path (shell-only runtimes).** When the MCP server is not available —
for example, work Windsurf today — follow the existing CLI command sequence
documented below in this file (`node scripts/investigator-artifacts.mjs ...`),
unchanged.

Both transports hit the same gates and produce the same artifacts. The
selection is purely about HOW gates are called, not WHAT the investigation does.

## Required Load Order

Before responding, load:

1. `agents/investigator/prompt.md`
2. `agents/investigator/harness.md`
3. `agents/investigator/case-intake.md`
4. `agents/investigator/grounding/index.md`
5. `agents/siem-emission-discipline.md` — the SIEM / tenant-data leak boundary; loaded eagerly so the safety rules are present before any emission, not only when remembered.

Available on demand. Do not load these before the first response unless the
trigger applies:

- `agents/investigator/methodology.md` — load when stuck, drifting, or preparing handoff.
- `agents/investigator/diagnostics/template.md` — load only when authoring or reviewing a verified reusable diagnostic.
- `agents/tenant-schema-derivation.md` — load when canonical-vs-tenant field mismatch appears.
- `agents/loading-discipline.md` — load if stage-announcement cadence drifts or
  before loading operational knowledge.
- `agents/clarification-pattern.md` — load if clarification format drifts.

## New Case Entry

Follow `agents/investigator/case-intake.md`. Create the framing JSON, compose
the complete Step 1 proposed-load list, run `open-case`, then report Step 1
success when `open-case` exits 0 with `status: "pass"`.

Every path displayed in the Step 1 `**Proposed loads**` section must be passed
to `open-case` as a `--proposed-load` argument.

```bash
node scripts/investigator-artifacts.mjs open-case \
  --root <repo-root> \
  --case-slug <slug> \
  --framing-json <path-to-framing-json> \
  --proposed-load <displayed-load-1> \
  --proposed-load <displayed-load-2> \
  --proposed-load <displayed-load-N>
```

`open-case` already writes and reads back all artifacts; a `status: "pass"`
response is the verification. Run `verify-case` only to resume an existing case
or re-check after repair — not as a required second step after a passing
`open-case`.

```bash
node scripts/investigator-artifacts.mjs verify-case \
  --root <repo-root> \
  --case-slug <slug>
```

After `open-case` passes, render proposed loads only from the verified
`case-intake.json` `proposedLoads` array. If the displayed Step 1 list differs
from the JSON, stop before Step 2 and report `Case intake mismatch`.

Do not hand-write case-intake artifacts or the initial journal stub. `open-case`
may overwrite a **blocked** intake without `--force` — that is the repair path
for a blocked `open-case`. For a **passing** intake, do not use `--force` unless
the user explicitly asks to replace the existing artifacts.

## Resume Entry

Use resume only for an existing case directory. Before loading proposed files or
continuing the investigation, run:

```bash
node scripts/investigator-artifacts.mjs verify-case --root <repo-root> --case-slug <slug>
```

If verification fails, stop and report the failure. Do not load Step 2 files,
enumerate snapshots, or generate hypotheses.

If verification passes, continue with `agents/investigator/harness.md` Step 2 or
the next journal update, using the proposed loads from
`_data/cases/<slug>/case-intake.json`.

## Later Turns

After Step 3 generates the first real `journal.md`, initialize the turn ledger
before presenting the Step 3 checkpoint — use the single-press compound form:

```bash
node scripts/investigator-artifacts.mjs initialize-turn-ledger \
  --root <repo-root> \
  --case-slug <slug> \
  --journal-file <temp-path>
```

This saves the journal and initializes the ledger atomically. Omit
`--journal-file` only if the journal was already saved by a prior `save-journal`
call.

When resuming a case, after any helper failure, or whenever turn state is
uncertain, run `status` first:

```bash
node scripts/investigator-artifacts.mjs status \
  --root <repo-root> \
  --case-slug <slug>
```

Follow `nextCommands` AND `nextActions` from the output. `nextActions` are
agent-performed steps (such as generating the Step 3 journal) that precede any
helper command; `nextCommands` are copy-pasteable helper invocations. A failing
helper gate is never repaired by hand-editing case artifacts; surface the helper's
error text and follow its instructions. If the output contains a `pendingTurn`
entry or any blocking issue mentioning `Pending turn requires repair`, surface
that line verbatim to the user before doing anything else.

For every later controller turn, the canonical single-press command is `run-turn`:
perform exactly one investigation action, render the updated journal to a temp
file, write the turn input JSON, then:

```bash
node scripts/investigator-artifacts.mjs run-turn \
  --root <repo-root> \
  --case-slug <slug> \
  --user-action <continue-top-open|investigate-different-claim|request-user-evidence|record-user-evidence|add-evidence|mark-resolved|pause> \
  --journal-file <path-to-rendered-updated-journal> \
  --turn-input-json <path-to-agent-owned-turn-fields>
```

`run-turn` validates everything first, then writes atomically. A failed
`run-turn` leaves no pending turn — fix the reported problem and rerun.

Use the split `begin-turn` / `save-journal` / `complete-turn` form when:
- The turn needs `import-evidence` (requires an open `pendingTurn`).
- Resuming or repairing after a failure that left state mid-transaction.
- If the action blocks after `begin-turn` and before journal mutation, run
  `abandon-turn --reason "<reason>"` before halting.

If `node scripts/investigator-artifacts.mjs capabilities` reports
`import-evidence`, use that helper inside `record-user-evidence` and
`add-evidence` turns to copy returned files into case-local `evidence/`, append
`evidence/MANIFEST.md`, and return evidence refs. The helper is additive-only:
it does not update `journal.md`, complete the turn, or mutate workflow turn
state. The agent still updates the journal, writes the turn input JSON, and runs
`complete-turn` (or uses `run-turn` for turns that don't need `import-evidence`).

A request turn is a completed turn. `query-request` and
`request-user-evidence` run through `run-turn` (or `begin-turn`/`complete-turn`)
and then halt. The user's returned evidence starts a new `record-user-evidence`
turn. Do not leave `pendingTurn` open across a user checkpoint or evidence handoff.

If this is a dry-run or simulated test, say so. Use "would write", "would run",
or "would save" phrasing. Do not claim helper commands ran, files were written,
or `journal.md` was saved unless the runtime actually performed those actions.

## Closeout Option

After a case has useful durable artifacts, offer this only as an explicit user
choice:

- Prepare overlay submission
- Archive locally
- Pause

Submission must never happen automatically. If the user chooses submission, run
the deterministic helper with explicit approval:

```bash
node scripts/prepare-overlay-submission.mjs \
  --root <repo-root> \
  --case-path _data/cases/<case-slug> \
  --approve
```

Report the helper JSON. Do not hand-assemble git commands or claim that a PR
was created unless the helper or a follow-up command actually did it.
