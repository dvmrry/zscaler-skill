---
title: "Investigator Evidence Batching Plan"
date: "2026-05-20"
status: partially-implemented-0.5.0
scope: "reduce /z-investigator long-run evidence-handling latency without weakening auditability"
intended-reviewers: "Claude, DeepSeek, Codex, Cascade, or similar architecture reviewers"
source-review: "2026-05-20 friction audit of a 25+ loop investigator run"
review-inputs:
  - "Claude review, 2026-05-20"
  - "DeepSeek review, 2026-05-20"
  - "Goose/Ollama DeepSeek review, 2026-05-20"
  - "OpenCode/Qwen review, 2026-05-20"
  - "OpenCode/Ollama DeepSeek implementation review, 2026-05-20"
---

# Investigator Evidence Batching Plan

> **Resolution note (2026-06-10):** Slice 1 (`import-evidence`) shipped in
> v0.5.0. Slice 2's intent is covered by `run-turn --turn-input-json` (v0.5.0).
> Slice 0 (journal Evidence Timeline / Dismissed Hypotheses sections) remains
> open.

## Executive Summary

The `/z-investigator` harness now has useful safety properties: explicit case
intake, verified resume state, a durable journal, case-local evidence, an
evidence manifest, and a turn ledger with pending-turn and hash-chain checks.

This is a soft-refactor plan, not a replacement plan. The current model works.
The goal is to refine the mechanics that make long investigations feel slow:
chat noise, repeated helper invocations, hand-written JSON, manual evidence
backfill, and repeated journal prose.

The current long-run cost is that evidence handling is too turn-expensive. In
a 25+ loop investigation, most useful work was evidence. The investigation did
not feel slow because grounding files were large; it felt slow because every
evidence item required a full transaction dance:

```text
begin-turn -> inspect/record one item -> edit journal -> create turn JSON ->
complete-turn -> halt
```

The proposed direction is not to make the investigator looser around truth. It
is to keep the safety invariants while moving clerical work into deterministic
helper code. Batch transactions are explicitly deferred; they would be a
deliberate step up the stack from prompt-owned workflow state toward
script-owned workflow state, and that shift needs fresh-case evidence, tests,
and reviewer agreement before it becomes canonical behavior.

More real cases should drive this work. Every case can produce a journal,
evidence artifacts, turn records, and a retro. Those packets are how the skill
self-improves with proof rather than with retro prose alone.

This document is a proposal for review. It does not change the canonical
investigator runtime contract by itself.

Current PR state: Slice 1 helper-only evidence import has an opening
implementation. The remaining review question is no longer "should we build a
helper at all?" It is "is the Shape A helper mechanically tight enough to wire
into the canonical workflow after focused hardening and measurement?"

## Review Convergence

Claude and DeepSeek agreed on the core diagnosis:

- The real drag is clerical ceremony per evidence item, not the existence of
  evidence or grounding.
- Case-local evidence, manifest rows, resume verification, pending-turn
  detection, hash-chain consistency, and the resolution gate must remain.
- Helper code should first handle file copying, evidence naming, manifest
  appends, and compact evidence refs. Turn JSON generation is a separate slice
  with stricter hash-ordering tests.
- `mark-resolved` must remain separate from evidence recording.
- Journal authorship should stay with the agent, except possibly an
  append-only evidence timeline section.
- The helper command should be named `import-evidence`, not `add-evidence`, so
  it does not collide with the existing ledger `actionType: "add-evidence"`.
- Implementation review of the current Shape A helper found no journal, turn
  state, or turn log mutation and no obvious path traversal issue. The useful
  follow-up is focused hardening coverage, not expanding the helper into Shape
  B.

Key refinement from review: do not introduce three named canonical modes
(`Strict`, `Assisted`, `Strong-Runtime`). That multiplies the drift surface
between the canonical workflow, portable skill, and runtime adapters. Instead,
keep one workflow. The helper is either available for a step or it is not; weak
runtimes continue following the current explicit protocol until local tests
prove they can use the helper safely.

## Observed Friction

The friction audit of the recent long investigation found:

| Category | Observed shape |
|---|---|
| Case intake / setup | Around 3 setup checkpoints before investigation, plus turn-ledger initialization |
| Loading / grounding | Initial Step 2 grounding plus at least one explicit later `load-file` turn |
| Requesting evidence | Multiple ledgered query-request turns |
| Recording evidence | Many ledgered record-evidence turns |
| Journal updates | Effectively every post-setup turn, often restating stable context |

The largest overhead was not evidence gathering itself. It was the
one-action-per-turn transaction model plus manually creating turn JSON files
for each result.

Specific pain points:

- `request-user-evidence` and `record-user-evidence` are separate completed
  ledger turns even when the request is simply "run this Splunk query" and the
  user immediately provides a result file.
- Every evidence file requires `begin-turn`, a journal edit, turn JSON
  creation, and `complete-turn`.
- The journal repeatedly restates stable context: same hypotheses, same known
  hosts, same proxy-path facts, same explanatory notes.
- Evidence artifacts are not automatically copied or renamed into
  `evidence/`; the agent can end up backfilling manually.
- The helper enforces a journal mutation for most actions even when the durable
  evidence is already represented in the manifest or turn event.

## What The Current Design Gets Right

Do not remove these protections casually:

- Resume must verify the existing case and must not create sibling cases.
- Placeholder SIEM indexes must be rejected or visibly flagged.
- Evidence must be copied into case-local `evidence/`, not left in Downloads or
  another transient path.
- `evidence/MANIFEST.md` must be required.
- `pendingTurn` detection must remain.
- Hash-chain / state consistency should remain.
- Resolution must require positive supporting evidence, not only "we ruled
  everything else out."
- Weak-agent runs should still enforce Step 1 / Step 2 / Step 3 checkpoints.

The turn ledger did catch a real mistake during the audited run: after manual
backfill and reference rewrites, the helper detected that
`02-turn-state.json` did not agree with the last `02-turns.jsonl` event. That
is a real protection. Its highest value is resume integrity and corruption
detection, not better investigation reasoning on every single item.

## Design Goal

Reduce user-visible turns and manual artifact handling while preserving the
same durable evidence guarantees.

Near-term success is not "batch everything." Near-term success is:

- a shorter, less repetitive journal shape;
- helper-owned evidence import;
- helper-generated turn JSON;
- less chat-visible machinery;
- measured helper overhead per turn;
- no change to the resolution gate;
- no new canonical workflow variants.

## Artifact Visibility Tiers

Auditability for the system does not require verbosity for the user. The
workflow should distinguish machine-visible state from human-facing progress.

User-visible artifacts and summaries:

- current issue state;
- leading hypothesis and changed claim statuses;
- evidence considered in plain language;
- evidence destination paths when newly imported;
- next evidence needed or decision needed;
- blockers, warnings, or repair needs;
- `pendingTurn` existence when it blocks progress.

Review-visible artifacts:

- `journal.md`;
- `evidence/MANIFEST.md`;
- evidence timeline;
- retro / postmortem;
- selected raw evidence when needed for review.

Machine-visible artifacts:

- turn JSON;
- pending-turn state;
- hashes / change tokens;
- helper transaction files;
- ledger sequence and previous-hash details.

The agent should not paste full turn JSON, hash values, or helper internals into
chat unless a failure requires human repair. The normal user-facing output
should be closer to:

```text
Recorded 3 evidence files, updated the manifest, and advanced H3 to Confirmed (medium).
Next evidence: check Azure flow deny logs for the competing network-path hypothesis.
```

The detailed artifacts remain on disk for replay, audit, review, and future
training/eval packets.

Helper stdout should follow the same rule: one compact JSON result on success,
full diagnostics only on `--verbose` or failure. Agents should summarize the
result for the user rather than pasting helper internals into chat.

## Performance Budget

Small per-turn overhead compounds. A helper step that adds only a few seconds
can become a minute of dead air across a 25+ turn investigation, and it also
breaks operator flow.

Before changing integrity primitives, benchmark the current helper path:

- `begin-turn`;
- `complete-turn`;
- `initialize-turn-ledger`;
- any future `import-evidence`;
- any future generated-turn-JSON helper.

Initial targets:

- normal turn bookkeeping on small case artifacts: under 250 ms per helper
  command where practical;
- ledger replay under 100 ms for a 100-event `02-turns.jsonl`, or an explicit
  measured explanation before landing a helper change;
- helper changes should stay under 500 ms on a realistic 50+ turn case; if a
  regression exceeds that, the PR must include a measured explanation and
  reviewer acceptance;
- evidence import: proportional to file size, with no repeated full-file
  hashing inside one transaction;
- chat-visible helper detail: summary only unless repair is required;
- fewer helper invocations per evidence item, not more.

The likely bottleneck is not only the hash primitive. It may be process spawn,
repeated file reads, JSONL parsing, journal hashing, state write/readback, and
agent-visible output interpretation. Measure before replacing primitives.

Integrity checks should match the threat model:

- local turn consistency needs cheap accidental-change detection;
- evidence import benefits from a durable file digest;
- exported learning packets can use stronger digests for cross-machine review.

Implementation options to evaluate:

- keep SHA-256 where files become durable evidence or exported learning data;
- use cheaper local change tokens for purely local turn-state checks, such as
  file size + mtime + an optional content digest;
- consider a faster digest such as BLAKE3 only if dependency policy allows it
  and measurement shows hashing is material;
- keep the script output quiet regardless of digest choice.

Do not weaken evidence-file hashing based on instinct alone. If hashing is not
the measured bottleneck, keep durable evidence digests boring and strong, and
look first at process count, repeated ledger replay, journal hashing, and chat
verbosity.

## Slice 0: Journal Shape First

Land the journal shape change before helper code.

This is the lowest-risk slice: no new helper behavior, no state-machine change,
and no runtime adapter branching. It targets one large source of friction
directly: repeated claim-row prose.

Long investigations should stop expanding the same claim row with repeated
stable context. Prefer:

- short active claim table that preserves the existing claim-table header and
  status vocabulary;
- append-only evidence timeline;
- dismissed hypotheses section;
- compact current-state summary.

Slice 0 must not change the helper-visible claim table contract. The `## Claims`
section keeps the exact table header
`| Claim | Source | Status | Next evidence needed | Timestamp | Notes |`, keeps
resolved/root-cause claims in that table, and uses the existing status
vocabulary. If a future journal shape wants different columns or moves
resolved/root-cause claims out of `## Claims`, that is no longer a no-code
Slice 0 change; update the helper and tests in the same slice.

Proposed journal sections:

```text
## Claims

short table with current status and next evidence only

## Evidence Timeline

append-only bullets keyed by timestamp and evidence ref

## Dismissed Hypotheses

claims no longer active, with last decisive evidence ref

## Resolution
```

Run a second investigation against this journal shape before implementing
batch transactions. If journal discipline alone removes most of the repeated
context, the later helper can stay narrower.

## Helper Direction

The first helper should not patch the claims table. Journal reasoning stays
agent-owned.

Allowed helper-owned behavior:

- copy / rename evidence files into case-local `evidence/`;
- create `evidence/MANIFEST.md` if missing;
- append manifest rows;
- compute source file hashes;
- emit evidence refs and metadata;
- generate valid turn JSON from `pendingTurn` plus explicit arguments in a
  later slice.

Disallowed helper-owned behavior:

- update claim statuses;
- rewrite free-form journal prose;
- touch `## Claims`, `## Dismissed Hypotheses`, or `## Resolution`;
- record evidence and mark resolved in the same transaction.

For Slice 1, the helper should not mutate `journal.md` at all. If helper-owned
journal patching ever lands, scope it to append-only `## Evidence Timeline`
entries and nothing else, with explicit hash ordering and tests.

The helper should also be quiet by default: write artifacts, return a compact
machine-readable result, and let the agent summarize the outcome for the user.
Verbose helper details should be opt-in or failure-only.

The helper must expose capability discovery, either as a `capabilities`
subcommand or a stable parseable `--help` section. The canonical workflow can
then say "use the helper when it reports support for this operation; otherwise
follow the current manual protocol" without introducing runtime modes.

Preferred capability output:

```json
{
  "status": "ok",
  "operation": "capabilities",
  "version": "0.2.0",
  "supported": [
    "open-case",
    "verify-case",
    "initialize-turn-ledger",
    "begin-turn",
    "complete-turn",
    "import-evidence"
  ]
}
```

Successful helper output should be one JSON object with a stable envelope:

```json
{
  "status": "ok",
  "operation": "import-evidence",
  "evidenceRefs": [
    "_data/cases/<slug>/evidence/<file-1>",
    "_data/cases/<slug>/evidence/<file-2>"
  ],
  "manifestPath": "_data/cases/<slug>/evidence/MANIFEST.md",
  "manifestRows": ["| ... |"],
  "turnJsonPath": null,
  "warnings": []
}
```

Failures and partial failures should also be machine-readable:

```json
{
  "status": "partial",
  "operation": "import-evidence",
  "completed": ["copied-file"],
  "failed": ["manifest-append"],
  "repair": "rerun import-evidence after resolving duplicate manifest row"
}
```

Agents must check exit status and `status` before summarizing success.
Any helper `warnings` should be surfaced to the user as plain prose, not raw
JSON, when they affect trust, repair, or next action.

## Shape A: Evidence Import Helper

This is the recommended first code slice after Slice 0.

Add a helper command to `scripts/investigator-artifacts.mjs`:

```bash
node scripts/investigator-artifacts.mjs import-evidence \
  --root <repo-root> \
  --case-slug <slug> \
  --source-file <path-to-result> \
  --name <evidence-name> \
  --source <source-system-or-tool> \
  --query-file <path-to-query-or-request-text> \
  --summary <one-line-summary> \
  --captured-at <ISO-8601-UTC> \
  --touched-claim <exact-journal-claim> \
  --active-hypothesis <Hn-or-short-tag>
```

Slice 1 should support a small evidence wave without becoming Shape B. It may
do this with repeatable `--source-file` groups or an `--input-json` file with
`items[]`. The helper remains additive-only: copy each file, compute one hash
per file, append one manifest row per item, return `evidenceRefs[]`, and leave
journal reasoning plus ledger completion to the agent.

Example compact input:

```json
{
  "items": [
    {
      "sourceFile": "/absolute/path/proxy-path.json",
      "name": "managed-proxy-path",
      "source": "Splunk",
      "queryFile": "queries/managed-proxy-path.spl",
      "summary": "Managed proxy path shows allowed CONNECT/SSL.",
      "capturedAt": "2026-05-20T14:10:00Z",
      "touchedClaims": ["H2: Managed proxy path is healthy"]
    },
    {
      "sourceFile": "/absolute/path/direct-egress.json",
      "name": "unmanaged-direct-egress-deny",
      "source": "Splunk",
      "queryFile": "queries/direct-egress.spl",
      "summary": "Unmanaged direct egress to the same SaaS is denied or dropped.",
      "capturedAt": "2026-05-20T14:12:00Z",
      "touchedClaims": ["H3: Unmanaged direct egress path is failing"]
    }
  ]
}
```

The helper:

- verifies the case and turn state;
- copies / renames the file into `evidence/` using a deterministic naming
  convention;
- computes `sourceFileHash` as SHA-256 over raw file bytes before copying each
  file;
- appends `evidence/MANIFEST.md` once per imported item;
- emits or writes JSON refs suitable for turn completion.

Slice 1 `import-evidence` is purely additive and normally requires an open
`pendingTurn` created by `begin-turn`. It must not create, complete, abandon,
or mutate `pendingTurn`; it reads turn state only for validation/context and
returns the pending turn sequence/token/userAction in its output so the agent
can connect imported refs to the later turn JSON. It writes only under
case-local `evidence/` and `evidence/MANIFEST.md`; it must not modify
`journal.md`, `workflow/02-turns.jsonl`, or `workflow/02-turn-state.json`.
Out-of-band evidence backfill, if ever needed, should be a separate explicit
mode with its own ledger story rather than the default import path.

The turn-state read is intentional even though `import-evidence` does not write
turn state. It preserves the resume/pending-turn checkpoint while keeping the
helper additive-only.

Before coding, lock these small contracts:

- **Destination name**: `<source-slug>-<name-slug>-<captured-at-basic>.<ext>`,
  where `captured-at-basic` is UTC `YYYYMMDDTHHMMSSZ` and all non-alphanumeric
  slug runs collapse to `-`. Reject destination collisions by default; do not
  overwrite unless a future `--force` behavior is explicitly designed and
  tested.
- **Required metadata**: `sourceFileHash`, `capturedAt` as ISO 8601 UTC,
  `source`, query/request text or query file, one-line `summary`, and exact
  `touchedClaims`.
- **SIEM placeholders**: query/request metadata must not contain unresolved
  placeholders such as `$INDEX_*`, `<your_*>`, blank `index=`, or blank
  `sourcetype=` unless the evidence is explicitly recorded as
  invalidated/corrective evidence.
- **Manifest row**: use a stable Markdown table with columns
  `Evidence Ref | Source | Captured At | Source File Hash | Query/Request Ref | Summary | Touched Claims`.
  `Touched Claims` should contain compact claim IDs or exact claim labels
  joined with `; ` when IDs are not available.
- **Path safety**: reject unsafe paths and never leave recorded evidence
  outside case-local `evidence/`.
- **Filename bounds**: deterministic destination names should be bounded so
  unusually long names or summaries cannot create filesystem-dependent
  failures. Prefer rejecting or truncating only the slug component with a
  stable rule and tests.
- **Special characters**: source names, evidence names, summaries, query refs,
  and claim labels may contain Markdown-significant characters. Manifest rows
  must remain parseable and readable.

### Shape A Implementation Review Notes

Current reviewer convergence for the implemented `import-evidence` slice:

- The helper stays safely short of Shape B: no `journal.md`, turn log, turn
  state, claim-status, or resolution mutation.
- Path handling appears bounded by repo/path-safety checks and case-local
  evidence destinations.
- Manifest append failure cleanup is load-bearing and should remain covered by
  tests.
- Partial-copy rollback is load-bearing: if a later copy fails after an
  earlier item was copied, the helper must remove the earlier copied evidence
  file and leave no orphaned unmanifested evidence.
- Evidence refs should remain repo-relative in helper output to avoid leaking
  local absolute paths into chat, turn JSON, or exported review packets.

Useful hardening before canonical workflow wiring:

- add/keep tests for unsafe source/query paths;
- add tests that import without an open `pendingTurn` is rejected and that the
  helper output includes pending turn sequence/token/userAction;
- add tests for special-character filenames, source labels, summaries, query
  refs, and touched-claim labels;
- add tests for unresolved SIEM placeholder query metadata;
- add at least one binary/non-UTF8 evidence fixture proving `sourceFileHash`
  is SHA-256 over raw bytes;
- add a test or explicit guard for excessive destination filename length;
- add a partial-copy rollback test where item 2 fails after item 1 was copied;
- keep malformed-manifest and partial-failure cleanup tests;
- benchmark helper runtime on a realistic case directory.

Out of scope for this slice unless the contract changes:

- concurrent `import-evidence` calls against the same case;
- preserving source-file permissions on imported evidence;
- helper-owned journal timeline appends;
- helper-generated turn JSON.

## Shape A2: Turn JSON Generation

This is a separate slice from evidence import.

Recommended flow:

```text
agent runs begin-turn
agent does one evidence action
agent updates journal.md
agent runs helper to import evidence
agent runs helper to generate turn JSON from the current pendingTurn
agent runs complete-turn --turn-json <generated-path>
```

Hard rule: the agent journals first; then the helper re-hashes `journal.md` at
turn-JSON generation time; then the agent immediately runs `complete-turn`.
The helper must not accept a caller-supplied `journalHashAfter`.

Together, Shape A plus Shape A2 remove manual artifact handling and hand-written
turn JSON without changing the one-action-per-turn contract. This is the safest
place to measure whether helper support solves enough of the latency.

## Request / Result Collapse Rule

Default to the narrow safe form:

- If the agent asks the user to run a query or gather evidence and then halts,
  that request is a completed turn. Returned evidence must be recorded in a
  later turn. Do not hold `pendingTurn` open across that user checkpoint.
- Once the user returns a file, path, or pasted result, assistant-side
  bookkeeping for that result should collapse into one `record-user-evidence`
  turn: import the returned file(s), append manifest rows, update the journal
  timeline/claims, generate turn JSON, and run `complete-turn`.
- If the user provides a result file/output in the same assistant response where
  the agent is already recording evidence, the helper may include the
  query/request text and returned result together in the import metadata.

Do not erase the request-then-result audit trail for evidence that arrives
later. The completed request turn remains the audit record for what was asked;
the cheaper transaction is the later assistant-side result-recording work.

## Deferred: Shape B Batch Evidence Transaction

Only consider this after Slice 0 and Shape A have been tested on fresh cases.
This section is an annex, not active implementation scope. Re-open it only if
Slice 0 plus Shape A/A2 do not bring long-run friction below the agreed target.

Add a post-Step-3 action type:

```text
record-evidence-batch
```

Semantics:

- Accepts N evidence files or result summaries from a tightly related evidence
  handoff.
- Copies each file into the case-local `evidence/` directory.
- Appends one `evidence/MANIFEST.md` row per evidence file/result.
- Adds one or more append-only evidence timeline entries.
- Creates one ledger event with all evidence refs.
- Does not update claim statuses.
- Does not mark the case resolved.

Allowed when:

- `initialize-turn-ledger` has already passed.
- No `pendingTurn` exists.
- All evidence items relate to the same active hypothesis or a clearly named
  set of touched claims.
- Every file/result has source, query/parameters or request text, captured
  timestamp, summary, interpretation, and touched claim metadata.

Rejected when:

- The case has an unresolved pending turn.
- Any source file path is outside the approved readable scope.
- Any evidence item lacks source/query/request metadata.
- Any evidence item lacks `capturedAt`.
- Any file item lacks `sourceFileHash` after helper inspection.
- The batch attempts to record evidence and mark resolved in the same event.
- Touched claims are missing from `journal.md`.
- The requested action would require browsing sibling case directories.

## Deferred Shape B Batch Input Shape

A batch file avoids huge shell invocations and makes review easier:

```json
{
  "activeHypothesis": "H3",
  "actionSummary": "Recorded returned Splunk evidence for Salesforce proxy path.",
  "items": [
    {
      "sourceFile": "/absolute/path/to/export.json",
      "sourceFileHash": "sha256:<computed-by-helper>",
      "name": "splunk-zia-live-bld002-dev-azure",
      "source": "Splunk",
      "query": "index=zscaler_proxy sourcetype=zscalernss-web ...",
      "summary": "Live bld002 showed allowed CONNECT/SSL with large response bytes.",
      "interpretation": "Supports proxy-path success; does not prove destination-side success.",
      "capturedAt": "2026-05-19T18:42:00Z",
      "touchedClaims": [
        "H3: Salesforce traffic is traversing ZIA proxy path successfully"
      ]
    }
  ],
  "evidenceTimelineEntries": [
    "2026-05-19T18:42:00Z - Splunk web logs show allowed CONNECT/SSL via bld002 with large response bytes."
  ]
}
```

`allowedNext` belongs in the resulting turn event, not in the batch input.
Resolution should require a later completed turn after the evidence has already
been recorded, so `allowedNext` must exclude `mark-resolved` for any batch
event.

The exact schema should stay small. Avoid building a full workflow engine while
solving a batching problem.

## Deferred Shape B Partial Batch Recovery

Batching makes failure larger. The helper must be designed around recoverable
step boundaries.

A batch transaction should record helper-visible progress in a temporary
transaction file under the case workflow directory, for example:

```text
_data/cases/<slug>/workflow/pending-evidence-batch.json
```

The helper should verify hash-chain / state consistency after each boundary:

1. validate case, journal, turn state, and batch input;
2. compute source file hashes;
3. copy files to deterministic temporary paths;
4. rename temporary files into `evidence/`;
5. append manifest rows;
6. append evidence timeline entries, if enabled;
7. append ledger event;
8. update turn state;
9. remove the pending batch file.

If interrupted, resume verification must detect the pending batch and report a
repair path. It must not silently continue as if the case were clean.

Scenario tests should interrupt the batch at every step boundary and verify
that resume either completes idempotently or blocks with an explicit repair
message.

## Estimated Impact

If Shape B were ever built, the audited case suggests a full
`record-evidence-batch` flow might remove roughly 8-12 user-visible turns
without losing auditability. That estimate is self-measured from the same run
that diagnosed the problem, so it should not be treated as proof or as a live
implementation target.

Before Shape B lands, re-measure after Slice 0 and Shape A/A2:

- Did the shorter journal shape reduce repeated-context churn?
- Did helper-owned evidence import remove manual backfill?
- Did generated turn JSON remove the most error-prone clerical step?
- Is the remaining turn count still unacceptable?

## Implementation Slices

### Slice 0: Journal Shape Change

- Update the investigator journal guidance to prefer short claim rows and an
  append-only evidence timeline.
- Do not add helper code.
- Run a second investigation and measure repeated-context reduction.
- Keep per-turn artifacts on disk but summarize them in chat.

### Slice 1: Helper-Only Evidence Import

- Add `import-evidence` helper command.
- Add helper capability discovery.
- Define stable helper output schema.
- Use the destination naming and manifest row schema defined above.
- Support a small evidence wave through repeatable file inputs or `items[]`
  input JSON without creating a ledger batch transaction.
- Copy / rename files into case-local `evidence/`.
- Compute source file hash before copying each file.
- Create `evidence/MANIFEST.md` if missing.
- Append one manifest row per item.
- Emit JSON refs for turn completion.
- Emit compact helper output by default.
- Benchmark helper runtime.
- Benchmark the combined `begin-turn` + `import-evidence` + `complete-turn`
  path, not only individual helper commands.
- Add tests for naming, manifest append, unsafe paths, duplicate names,
  missing metadata, file hash recording, special characters, excessive
  destination filename length, malformed manifests, and partial-failure
  cleanup.

### Slice 2: Turn JSON Generation

- Let the helper generate a valid turn JSON file from current `pendingTurn`.
- Keep the agent responsible for journal mutation.
- Require the agent to update `journal.md` before turn JSON generation.
- Re-hash `journal.md` inside the helper at generation time; do not accept a
  caller-supplied `journalHashAfter`.
- Run existing `complete-turn` validation.
- Avoid printing generated turn JSON to chat unless repair is needed.
- Benchmark combined import + turn JSON generation.
- Add tests that generated turn JSON rejects missing touched claims, mismatched
  turn tokens, placeholder query metadata, missing evidence refs, and
  `mark-resolved` mixed with evidence recording.

### Slice 3: Batch Transaction Decision

- Re-measure latency after Slice 0 plus Slices 1-2.
- Decide whether `record-evidence-batch` is still needed.
- If needed, re-open the deferred Shape B annex and review the action type,
  batch schema, and recovery contract as a separate proposal.
- Keep claim status mutation agent-owned.
- Add partial-failure recovery tests before any canonical harness update.

### Slice 4: Canonical Workflow Update

- Update `agents/investigator/harness.md` only after helper behavior and tests
  exist.
- Keep the current explicit protocol as the default fallback when helper
  support is missing or the runtime has not been validated.
- Update portable skill and runtime adapters only after the canonical harness
  has the policy.

## Test Matrix

Minimum tests before changing the canonical harness:

| Runtime / capability | Must verify |
|---|---|
| Codex | helper removes manual artifact handling and preserves ledger integrity |
| Claude Code | generated turn JSON works without journal drift |
| DeepSeek review | failure modes and blocking evals are explicit |
| Cascade baseline | current Step 1 / 2 / 3 behavior remains reliable |
| Weak model baseline | helper-bracketed instructions are not accidentally followed without capability discovery |

Repository tests:

- `node --test scripts/investigator-artifacts.test.mjs`
- targeted new helper tests for evidence import and generated turn JSON
- hygiene checks if documentation changes land

Scenario tests:

- immediate SIEM handoff with result file already available;
- evidence bundle: 3 related files supplied together;
- ADO-style split-path evidence: managed proxy path is healthy, but
  unmanaged/direct egress to the same SaaS is denied or dropped; preserve both
  evidence streams without burying the distinction in repeated journal prose,
  and assert each path lands as a distinct manifest row with its own touched
  claim;
- malformed evidence: missing query text;
- malformed evidence: missing `capturedAt`;
- unsafe path: source file outside allowed roots;
- duplicate evidence name;
- pending turn exists;
- hash-chain mismatch;
- touched claim not present in `journal.md`;
- attempt to record evidence and mark resolved in one action.
- special-character evidence metadata;
- excessive evidence destination name length.

Deferred Shape B scenario tests:

- interrupted batch after each step boundary;
- partial batch recovery detects pending transaction state;
- batch event `allowedNext` excludes `mark-resolved`.

Blocking evals for the first helper implementation:

- helper lacks capability discovery for `import-evidence`;
- helper output is not a stable machine-readable JSON envelope;
- helper records an evidence file without source/query/request metadata;
- helper records an evidence file without `capturedAt`;
- helper accepts non-UTC or invalid `capturedAt`;
- helper imports evidence without an open pending turn;
- helper accepts unresolved SIEM placeholder query metadata, such as
  `$INDEX_*`, `<your_*>`, blank `index=`, or blank `sourcetype=`, unless the
  item is explicitly invalidated/corrective evidence;
- helper references a touched claim not present in `journal.md`;
- helper permits evidence recording and `mark-resolved` in one action;
- helper silently overwrites an existing evidence destination;
- helper leaves copied evidence outside case-local `evidence/`;
- helper-generated turn JSON is rejected by `complete-turn` due to schema or
  hash mismatch;
- helper leaves a pending transaction that resume does not detect;
- helper adds more than the accepted performance budget for normal turn
  bookkeeping without a measured explanation.
- helper output leaks local absolute evidence paths on success.

## Reviewer Questions Still Open

Ask remaining reviewers to focus on these:

1. Is Slice 0 sufficient to test before helper code?
2. Is Shape A now narrow enough for the first helper slice?
3. Is Shape A2 turn JSON generation sufficiently ordered and testable?
4. What is the smallest eval that should block the deferred Shape B?
5. What recovery behavior should a partial batch guarantee if Shape B reopens:
   automatic idempotent completion, explicit repair only, or both depending on
   boundary?
6. Which artifacts should be hidden from chat by default, and which must remain
   user-visible?
7. Which integrity checks are actually load-bearing for this threat model, and
   which can become cheaper local change detection?
8. What helper runtime budget should block a mechanical refactor on a 50+
   turn case?

## Non-Goals

Do not use this plan to:

- remove evidence citation requirements;
- remove case-local evidence storage;
- remove manifest requirements;
- remove resume verification;
- remove pending-turn detection;
- allow resolution by elimination alone;
- let weak-agent runs skip Step 1 / Step 2 / Step 3 checkpoints;
- create three parallel canonical workflow modes;
- build a full workflow engine before proving the smaller helper shape;
- optimize cryptographic strength before measuring actual helper overhead.
- add same-case concurrent import support before there is a demonstrated need;
- preserve source-file permissions as part of import semantics unless that
  becomes an explicit evidence-handling requirement.

## Open Decisions

- Should helper-owned timeline append ever be enabled, or should journal
  mutation remain agent-owned indefinitely?
- Should runtime adapters select helper usage, or should the canonical workflow
  simply say "use helper when available, otherwise follow the current manual
  protocol"?
- Exact schema placement for helper provenance. Current leaning: record helper
  command/version in each ledger event that depends on helper-created refs or
  helper-generated turn JSON, rather than introduce a persistent runtime mode.
- Should local turn checks use SHA-256 everywhere, or reserve stronger digests
  for durable evidence / exported learning packets after benchmarking?

## Recommended Next Step

Treat the second review pass as enough to keep the Shape A implementation in
review. Ask reviewers to check only the current Slice 1 helper boundary and the
hardening list above:

- does `import-evidence` remain additive-only;
- are the path, manifest, and metadata contracts sufficient;
- are special-character and excessive-name cases the right remaining tests;
- is anything here merge-blocking before canonical workflow wiring.

Do not re-open Shape B or runtime-mode design during this review unless a
reviewer identifies a concrete safety failure in Shape A. Future retros should
keep feeding small operational and mechanical improvements back into this plan
rather than forcing a large redesign up front.
