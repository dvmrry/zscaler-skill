---
role: investigator
artifact: harness
title: "Investigator harness — checkpoint and phase contract"
content-type: prompt
last-verified: "2026-05-17"
confidence: high
source-tier: practice
sources:
  - ".windsurf/workflows/z-investigator.md"
  - "agents/investigator/prompt.md"
  - "agents/investigator/case-intake.md"
  - "agents/_meta/runtime-adapters.md"
  - "agents/_meta/windsurf-runtime-notes.md"
  - "scripts/investigator-artifacts.mjs"
author-status: draft
---

# Investigator Harness

This is the canonical checkpoint and phase contract for the investigator role.
The investigator prompt defines the reasoning discipline. This harness defines
the runtime behavior that makes the investigation safe across turns: phase
order, halt-and-wait checkpoints, output shapes, journal creation timing,
snapshot-load discipline, and subsequent-turn cadence.

Runtime adapters may reinforce this harness for weaker models, but they should
not invent a separate checkpoint contract.

Step 1's deterministic artifact contract lives in
[`case-intake.md`](./case-intake.md). Use the Node helper named there for
case intake and journal creation instead of relying on prose-only file-write
instructions.

## Procedure Model

The investigation has three sequential setup steps followed by repeated
investigation turns:

1. **Step 1 — Parse framing and create case intake artifacts.**
2. **Step 2 — Load files.**
3. **Step 3 — Generate and save the discovery journal.**
4. **Subsequent turns — update one hypothesis or evidence path per turn.**

Each step's input is the prior step's confirmed output. Do not run a step
without the prior step's output and explicit user confirmation.

At each checkpoint, halt and wait for the user. Do not assume confirmation,
improvise past a checkpoint, or run a step without the input it depends on.
If the prior step's output is missing or incomplete, output
`Prior step not confirmed — cannot proceed` and ask the user which step to
resume.

## Context Budget

Load tight and expand on demand.

- Load the investigator prompt, this harness, and case-relevant references.
- Load snapshot files only when the framing and already-loaded references make
  them relevant.
- Prefer entry points first; traverse deeper chains on later turns.
- Do not bulk-load `_data/snapshot/<cloud>/`.
- Do not browse sibling case directories unless the user explicitly points to
  one.

## Critical Constraints

Apply these during every step and every subsequent turn.

- **One clarification per turn.** Never ask two clarifications in one response.
- **Pre-Step-1 and full Step 1 are different turn modes.** Do not bundle them.
- **Blocking unknowns stop data emission.** If a blocking unknown exists, the
  whole turn is one clarification block.
- **Non-blocking concerns fold into the checkpoint menu.** Do not emit a
  separate clarification section after data emission.
- **No unsupported hypotheses before grounding.** Step 1 proposes docs; Step 2
  loads docs and selected evidence; Step 3 writes the first journal.
- **The output shape is part of the contract.** Do not add decorative prose,
  extra sections, or summaries outside the per-step shape.
- **Every journal claim needs a source.** Use loaded references, snapshot files,
  operative evidence, log fields, query outputs, or direct tests.
- **The journal save is mandatory.** Do not ask permission to write it and do
  not skip it silently.

Blocking unknown priority:

1. Working directory unknown; blocks journal save.
2. Tenant cloud unspecified when needed for snapshot loading.
3. Symptom or scope too vague to form proposed loads.

Other concerns, such as pre-collected logs or optional assumption corrections,
are non-blocking. Fold them into the next checkpoint menu.

## Turn Shapes

Use plain markdown. Do not wrap the whole response in a code fence. Code fences
are reserved for real code, shell commands, JSON, YAML, or raw templates.
Render paths as plain monospace text only. Do not turn investigation paths into
Markdown links; runtime linkification can obscure the exact path string and
make journal artifacts harder to copy, diff, or grep.

### Step 1 — Clarification-Only Turn

Use this when any blocking unknown exists at invocation time.

The whole response is one clarification multi-choice block. Do not include
parsed framing, proposed loads, journal-created lines, hypotheses, or a separate
"What's next?" section.

Template:

```text
I cannot determine <blocking unknown>. <why it blocks the investigation>

- <option 1>
- <option 2>
- Other — specify
```

After the user answers, re-check for the next blocking unknown. If one remains,
ask it in the next turn. Once all blocking unknowns are resolved, transition to
the full Step 1 turn.

### Step 1 — Full Turn

Use this only after all blocking unknowns are resolved.

Template:

```text
#### Step 1 — Parse framing

**Parsed framing**
- Working directory: `<absolute path>`
- Symptom: `<what is failing>`
- Tenant cloud: `<cloud or unknown/not needed>`
- Products / features: `<products/features>`
- Scope: `<one user / many / all / location / segment / connector group>`
- Recency: `<timeframe>`
- What works: `<adjacent successes>`
- Already tried: `<prior steps>`
- User-flagged specifics: `<literal tokens, paths, IDs, or none>`

**Proposed loads** (Step 2A — docs only)
- `<path>`
- `<path>`

**Case intake:** `<working-dir>/_data/cases/<slug>/case-intake.md`
**Case intake JSON:** `<working-dir>/_data/cases/<slug>/case-intake.json`
**Journal created:** `<working-dir>/_data/cases/<slug>/journal.md`

**What's next?**
- Proceed — load the proposed files (run Step 2)
- Add or correct framing — specify
- Add pre-collected evidence path — specify
- Pause — stop here
```

Only emit these artifact paths after
`node scripts/investigator-artifacts.mjs open-case` creates them and
`node scripts/investigator-artifacts.mjs verify-case` verifies a passing
case intake. If creation or verification fails, emit `Case intake not ready:
<reason>` and make fixing the case intake artifact the next checkpoint
option.

Render the `**Proposed loads**` list from the verified `case-intake.json`.
Do not add, remove, or rewrite paths in chat after `verify-case`. If the list is
wrong, rerun `open-case` with the corrected `--proposed-load` arguments, rerun
`verify-case`, and then render the updated helper-owned list.

The closing menu is Checkpoint 1. Halt after it. Do not load files, generate
hypotheses, output a journal table, or run Step 2 before the user confirms.

### Step 2 Turn

Template:

```text
#### Step 2 — Load files

**Loaded / grounding files loaded**
- Docs:
  - `agents/investigator/prompt.md` — `canonical investigator prompt`
  - `agents/investigator/harness.md` — `canonical checkpoint contract`
  - `<path>` — `<why loaded>`
- Snapshot:
  - `<path>` — `<why loaded>`
- Existing evidence:
  - `<working-dir>/_data/cases/<slug>/journal.md` — `operative journal`
  - `<path>` — `<why loaded>`
- Skipped / deferred:
  - `<count or path>` — `<why skipped or deferred>`
- Failed loads:
  - `<path>` — `<error or none>`

**Snapshot enumeration**
- `<path>`
- `<path>`

**Evidence enumeration**
- `<path or no files returned>`

**Selected snapshot/evidence entry points**
- `<path>` — `<why selected>`

**User-flagged specific search**
- `<token>` — `<where found or not found>`
- Elsewhere in the skill:
  - `<token>` — `<path or not found>`

**What's next?**
- Generate the discovery journal (run Step 3)
- Load one additional linked file — specify
- Redirect — bias the journal toward a specific focus
- Skip a file from the journal evidence — specify
- Pause — stop here
```

Before Step 2 loads anything, compare the Step 1 displayed proposed loads to
`_data/cases/<slug>/case-intake.json.proposedLoads`. If they differ, stop with
`Case intake mismatch` and fix Step 1 by rerunning `open-case` + `verify-case`.
Do not proceed from a chat-only proposed load.

The closing menu is Checkpoint 2. Halt after it. Do not output a journal,
generate hypotheses, or run Step 3 before the user confirms.

### Step 3 Turn

Template:

```text
#### Step 3 — Discovery journal

**Issue:** `<one-sentence description of what is failing>`
**Status:** Investigating
**Timestamp:** `<ISO 8601 UTC>`

| Claim | Source | Status | Next evidence needed | Timestamp | Notes |
|---|---|---|---|---|---|
| `<hypothesis>` | `<source>` | Open (likely/uncertain) | `<next evidence>` | `<now>` | `<scope or qualifier>` |

**Root cause hypothesis (current):** `<leading hypothesis, or no leader yet>`
**Next step:** `<single next evidence action>`

**Journal saved:** `<working-dir>/_data/cases/<slug>/journal.md`

**What's next?**
- Investigate H1 — gather the next evidence
- Focus another hypothesis — specify
- Request user evidence — name the catalog pattern or exact evidence request
- Add a hypothesis — specify
- Pause — stop here; journal saved for resumption
```

The closing menu is Checkpoint 3. Halt after it. First response is a plan, not
a diagnosis. Before emitting Checkpoint 3, initialize the turn ledger:

```bash
node scripts/investigator-artifacts.mjs initialize-turn-ledger \
  --root <working-dir> \
  --case-slug <slug>
```

If the command fails, do not claim Step 3 is complete. Surface
`Turn ledger not ready: <reason>` and make retrying the helper the next
checkpoint option.

### Subsequent Investigation Turn

Every post-Step-3 controller turn is a helper-bracketed transaction. Before
reading new evidence, updating claims, or recording a user-provided result, run:

```bash
node scripts/investigator-artifacts.mjs begin-turn \
  --root <working-dir> \
  --case-slug <slug> \
  --user-action <continue-top-open|investigate-different-claim|request-user-evidence|record-user-evidence|add-evidence|mark-resolved|pause>
```

When the helper is available, check its capabilities before relying on optional
mechanical helpers:

```bash
node scripts/investigator-artifacts.mjs capabilities
```

If `supported` includes `import-evidence`, use it for
`record-user-evidence` and `add-evidence` turns that need to save returned
files or result artifacts. If the capability is missing or the command fails,
fall back to the manual evidence convention and surface the failure plainly.
Do not invent a separate runtime mode.

`import-evidence` is additive-only and requires the current turn to already
have an open `pendingTurn` from `begin-turn`. It may verify case and turn
state, copy files into case-local `evidence/`, compute source hashes over raw
file bytes, append `evidence/MANIFEST.md`, and return evidence refs plus the
pending turn sequence/token/userAction. It must not replace the journal update
or `complete-turn`, and it must not mutate `journal.md`,
`workflow/02-turns.jsonl`, or `workflow/02-turn-state.json`.

Single-item form:

```bash
node scripts/investigator-artifacts.mjs import-evidence \
  --root <working-dir> \
  --case-slug <slug> \
  --source-file <path-to-result> \
  --name <short-evidence-name> \
  --source <source-system-or-tool> \
  --query-file <repo-relative-query-file> \
  --summary "<one-line-summary>" \
  --captured-at <ISO-8601-UTC> \
  --touched-claim "<exact journal claim>" \
  --active-hypothesis <Hn-or-short-tag>
```

Use `--query "<text>"` or `--request-text "<text>"` instead of
`--query-file` when the query/request text is not already saved in the repo;
do not leak local absolute query paths into the manifest. Query/request
metadata must not contain unresolved SIEM placeholders such as `$INDEX_*`,
`<your_*>`, blank `index=`, or blank `sourcetype=` unless the import is
explicitly recording invalidated/corrective evidence. For a small related
evidence wave in one `record-user-evidence` or `add-evidence` turn, pass an
`--input-json` file with `items[]`. This is still one ledger action, not a
`record-evidence-batch` transaction.

After exactly one investigation action, update `journal.md`, write a turn JSON
file, and close the transaction:

```bash
node scripts/investigator-artifacts.mjs complete-turn \
  --root <working-dir> \
  --case-slug <slug> \
  --turn-json <path-to-turn-json>
```

`actionType` must be one of: `load-file`, `query-request`,
`request-user-evidence`, `record-user-evidence`, `add-evidence`,
`mark-resolved`, or `pause`. Do not invent synonyms such as
`record-evidence`.

If `begin-turn` succeeded but the chosen action becomes blocked before any
journal mutation, do not leave the case wedged with an open `pendingTurn`.
Run:

```bash
node scripts/investigator-artifacts.mjs abandon-turn \
  --root <working-dir> \
  --case-slug <slug> \
  --reason "<why the turn was blocked before mutation>"
```

Then halt and surface `Turn abandoned before journal mutation: <reason>`. If
`abandon-turn` reports that `journal.md` changed, do not continue; surface
`Pending turn requires repair` and ask the user whether to complete the turn
with a valid turn JSON or manually reconcile the journal.

Use `actionType: "query-request"` only for a SIEM/Splunk catalog-pattern
request. It must include `queryPatterns` from
`references/shared/splunk-queries.md`.

Use `actionType: "request-user-evidence"` for non-Splunk evidence requests
such as Azure changes, API/manual lookups, screenshots, support tickets, or
operator-provided files. It must include `evidenceRequest` with the exact
requested evidence. Request turns must complete immediately after journaling the
request. When the user returns query rows, logs, screenshots, or other
evidence, start a fresh `begin-turn` with `--user-action record-user-evidence`;
do not hold `pendingTurn` open across a user checkpoint.

When recording returned evidence, summarize the helper result in chat instead
of pasting full helper JSON, hashes, or turn JSON. The normal user-visible
shape is: evidence count, destination refs, claim status change, and next
evidence. Surface raw helper diagnostics only when repair is needed.

Use `actionType: "mark-resolved"` only when the resolution gate is satisfied.
The helper rejects completion unless the turn JSON includes `completionGate`
with:

- `rootCauseClaim`: the exact journal claim that is the resolved/confirmed
  root cause.
- `userConfirmedResolution: true`: the user confirmed the fix or rollback holds.
- `supportingEvidenceRefs`: one or more direct evidence references.

The journal must have no `Open (likely)` or `Open (uncertain)` claims, and the
root-cause claim must be `Resolved` or `Confirmed (high)`. Supporting evidence
must already have been recorded in an earlier completed turn; do not record
returned evidence and mark resolved in the same turn. Do not resolve by
elimination alone.

Template:

```text
#### Investigation turn — updated journal

**Active hypothesis:** `<Hn or short tag>`
**Evidence action:** `<one evidence source checked or proposed>`

**Issue:** `<one-sentence description of what is failing>`
**Status:** Investigating
**Timestamp:** `<ISO 8601 UTC>`

| Claim | Source | Status | Next evidence needed | Timestamp | Notes |
|---|---|---|---|---|---|
| `<hypothesis>` | `<source>` | `<status>` | `<next evidence>` | `<now>` | `<scope or qualifier>` |

**Root cause hypothesis (current):** `<leading hypothesis, or no leader yet>`
**Next step:** `<single next evidence action>`

**Journal saved:** `<working-dir>/_data/cases/<slug>/journal.md`

**What's next?**
- Continue with top Open claim
- Investigate a different claim — specify
- Request user evidence — name the catalog pattern or exact evidence request
- Record user-provided evidence
- Add evidence — specify
- Mark resolved — summarize verified root cause
- Pause — stop here
```

Do one investigation action per turn, update the journal, complete the helper
transaction, save it, and halt. This cadence repeats until the user explicitly
pauses or closes the investigation.

## Step 1 Details

### Parse Framing

Extract:

- what is failing
- where it is failing
- affected scope
- when it began
- adjacent successes or "what works"
- what has already been tried
- literal tokens, paths, IDs, users, locations, domains, URLs, app names, or
  timestamps supplied by the user

Treat user causal claims as unverified until evidence confirms them. Record
them as candidate claims or framing notes, not settled facts.

### Proposed Loads

The Step 1 proposed load list is docs-only and mapping-driven. Do not choose
files because they might support a hypothesis you have not grounded yet. Use
the explicit grounding-card and framing-to-file mappings in the investigator
prompt, then stop. Snapshot enumeration and selection happen in Step 2 after
docs are loaded.

Always include:

- `agents/investigator/prompt.md`
- `agents/investigator/harness.md`

Then include every grounding card and product reference that matches the
framing's vocabulary. Include telemetry references under
`references/{zia,zpa,zcc}/logs/` only when logs, metrics, SIEM data, LSS/NSS,
compact telemetry terms such as `syslog`, `weblog`, or `log4j`, or a
user-provided evidence path is part of the framing. Prefer explicit
framing-to-file matches over model inference; companion references are often
needed together. Every proposed load must exist under the repository root
before Step 1 can pass.

If a matching file exists under `agents/investigator/grounding/`, prefer that
grounding card before falling back to keyword-only topic loading.

### Case Intake Artifact Creation

After composing the parsed framing and proposed loads, follow
[`case-intake.md`](./case-intake.md). Do not summarize or collapse the
helper-backed transaction:

1. Resolve `case_dir` to `<working-dir>/_data/cases/<slug>`.
2. Write the parsed framing to a JSON file.
3. Run `node scripts/investigator-artifacts.mjs open-case` with the repo
   root, slug, framing JSON, and proposed load list.
4. If the case intake status is `pass`, run
   `node scripts/investigator-artifacts.mjs verify-case`.
5. Only after verification succeeds, emit the case intake, case intake JSON,
   and journal paths in the Step 1 output.

Do this before Checkpoint 1. `case-intake.md`,
`case-intake.json`, and `journal.md` must exist from
Step 1 onward, even if the journal only contains framing and empty claims.

Slug selection:

- If the user referenced an existing case path, use that slug.
- If the user-referenced or current case directory already contains
  `case-intake.md`, `case-intake.json`, or `journal.md`, run `verify-case` and
  resume that case instead of rerunning `open-case`.
- Otherwise derive a short slug from date + symptom, for example
  `2026-05-17-zpa-connector-assignment`.

Do not browse sibling case directories to find a matching prior journal. The
only continuation signals are an explicit user path/slug or the current target
directory already containing `journal.md`.

The stub bodies are deterministic and owned by
`scripts/investigator-artifacts.mjs`. Do not hand-author a different case
intake or journal shape in a runtime adapter. `open-case` refuses to overwrite
existing artifacts unless `--force` is explicitly supplied; do not use
`--force` unless the user has asked to replace the intake artifacts.

If the working directory is unknown, do not create the stub. Ask the working
directory clarification as the whole turn.

If directory creation, write, readback, or marker verification fails, do not
claim the case intake is ready. Surface `Case intake not ready:
<failed transaction step> - <reason>` and halt at Checkpoint 1 with a retry
option. Do not run Step 2 while artifact creation is incomplete.

## Step 2 Details

Step 2 has five sub-steps. Do them in order.

### 2A — Load Docs

Use the file-read tool to load every path in Step 1 proposed loads. Do not
summarize from memory. Do not skip a file because it seems obvious.

### 2B — Enumerate Snapshot and Existing Evidence

If tenant cloud is specified, enumerate:

```text
_data/snapshot/<cloud>/
```

Use a recursive file-listing tool. The canonical public path is singular
`_data/snapshot/<cloud>/`.

If the fork-specific `_data/<cloud>/` layout exists and the canonical path is
empty, show both attempts plainly.

The fallback is cloud-level only. If `_data/snapshot/<cloud>/` exists but a
product subtree such as `_data/snapshot/<cloud>/zpa/` is absent, report `no ZPA
snapshot subtree found for <cloud>` and continue from references/evidence. Do
not infer product state from sibling product subtrees, another cloud, broad
`_data/`, or the fork-specific fallback unless the canonical cloud path itself
was absent or empty.

Also enumerate existing evidence for the current case:

```text
<working-dir>/_data/cases/<slug>/evidence/
<working-dir>/_data/cases/<slug>/journal.md
```

If the user named another evidence path, enumerate that path too. Paste the
literal file enumeration as plain monospace paths, one path per line where the
runtime allows it. Do not browse sibling case directories unless the user
explicitly points to them.

### 2C — Select Entry Points

Use the loaded docs and grounding cards to choose snapshot and evidence entry
points. This selection is mapping-driven: start from the grounding card's
`Inspect snapshot` list or the product/reference mapping, then narrow by the
user's literal tokens. Cap initial snapshot loads at five files total across
products unless the user explicitly directs otherwise.

Prefer entry points that identify policy objects, app segments, server groups,
connector groups, locations, forwarding profiles, log schemas, or named
objects from the user's framing.

Default entry points by product:

| Product / framing | Start with |
|---|---|
| ZPA segment, connector assignment, access policy | application segments, server groups, connector groups, access policy |
| ZIA URL filtering or Cloud App Control | URL filtering rules, URL categories, Cloud App Control rules if present |
| SSL inspection or bypass | SSL inspection rules, bypass lists, forwarding profile context |
| ZCC forwarding or tunnel behavior | forwarding profile, app profile, device/user assignment context |
| Cloud Connector | cloud connector inventory, workload discovery, forwarding or policy attachment context |
| Unknown product | product index plus the narrowest snapshot files named by user tokens |

### 2D — Load Selected Files

Load selected snapshot and evidence files with the file-read tool. Also read
`<working-dir>/_data/cases/<slug>/journal.md` as the operative artifact so
Step 3 updates the same file rather than creating a new one. Do not load
unselected snapshot files. For files larger than 100 MB, search for
user-flagged specifics first instead of loading blindly. If no search pattern
can be derived from the framing or loaded context, ask one clarification before
loading the file.

JSON snapshot files often contain nested arrays and objects. Use structured
queries such as `jq` when walking IDs or relationships; plain text search can
miss nested structure.

### 2E — Search User-Flagged Specifics

For each literal token in the parsed framing, search across loaded content and
selected evidence. Record where it appears or that it was not found in the
loaded set.

If there are no user-flagged specifics, skip this sub-step.

## Step 3 Details

### Generate Journal

Use the investigator prompt and methodology to generate the first discovery
journal. Every hypothesis must cite loaded evidence or explicitly state what
evidence would resolve it.

Apply the evidence-basis rule from the investigator prompt: the `Notes` column
must say whether each hypothesis is `reference-grounded`, `snapshot-grounded`,
`runtime-evidence grounded`, or `mixed`. Use `Open (likely)` only when loaded
tenant snapshot, runtime evidence, or user-provided evidence points toward the
hypothesis. If the loaded set contains only product references, keep the status
at `Open (uncertain)` and state that no tenant snapshot or runtime evidence was
available.

Do not identify a root cause in Step 3 unless the loaded evidence directly
supports it and plausible alternatives have been ruled out.

### Save Journal

After generating the journal in chat, immediately save the same journal to:

```text
<working-dir>/_data/cases/<slug>/journal.md
```

This save is unconditional. Do not ask permission. Do not defer it.

If the working directory is missing or not absolute, halt with:

```text
Cannot save journal — working directory unknown. Reply with the absolute path
of the repo root and I will retry the save.
```

Use the same transaction shape as Step 1:

1. Write the full rendered journal to `journal_path`.
2. Read `journal_path` back.
3. Verify the readback contains:
   - `# Discovery Journal`
   - `| Claim | Source | Status | Next evidence needed | Timestamp | Notes |`
   - `## Resolution`
4. Only after verification succeeds, emit `Journal saved: <journal_path>`.

Without write, readback, and marker verification, Step 3 is incomplete and
Checkpoint 3 cannot fire.

### Initialize Turn Ledger

After the journal save verification succeeds, initialize the helper-owned turn
ledger before presenting Checkpoint 3. This creates
`_data/cases/<slug>/workflow/02-turns.jsonl` and
`_data/cases/<slug>/workflow/02-turn-state.json`. Subsequent turns are not
valid unless this ledger exists and `begin-turn` succeeds.

## Chain Traversal

After Step 2 loads entry points, later turns may traverse relationships by
reading IDs from one loaded file and adding the next linked file at the next
checkpoint.

Example for a ZPA segment investigation:

1. Load application segment entry point.
2. Identify relevant `serverGroups[]` IDs.
3. Add the server group file as next evidence.
4. Identify `appConnectorGroups[]` IDs.
5. Add connector group or connector status evidence.

Do not traverse every possible chain in one turn. Pick the cheapest next source
that closes the active evidence gap.

## Completion

An investigation is complete only when:

- the likely root cause is supported by cited evidence;
- competing plausible hypotheses are ruled out or explicitly marked as open;
- the journal is saved;
- the user confirms the resolution or asks for RCA/retro output.

Until then, continue the one-action, journal-update, save, halt cadence.
