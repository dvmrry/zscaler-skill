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
  - "agents/investigator/workflow-report.md"
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
[`workflow-report.md`](./workflow-report.md). Use the Node helper named there for
workflow report and journal creation instead of relying on prose-only file-write
instructions.

## Procedure Model

The investigation has three sequential setup steps followed by repeated
investigation turns:

1. **Step 1 — Parse framing and create workflow report artifacts.**
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

**Workflow report:** `<working-dir>/_data/cases/<slug>/workflow-zscaler-investigator-report.md`
**Workflow report JSON:** `<working-dir>/_data/cases/<slug>/workflow-zscaler-investigator-report.json`
**Journal created:** `<working-dir>/_data/cases/<slug>/journal.md`

**What's next?**
- Proceed — load the proposed files (run Step 2)
- Add or correct framing — specify
- Add pre-collected evidence path — specify
- Pause — stop here
```

Only emit these artifact paths after
`node scripts/investigator-artifacts.mjs create-report` creates them and
`node scripts/investigator-artifacts.mjs verify-report` verifies a passing
report. If creation or verification fails, emit `Workflow report not ready:
<reason>` and make fixing the workflow report artifact the next checkpoint
option.

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
- Add a hypothesis — specify
- Pause — stop here; journal saved for resumption
```

The closing menu is Checkpoint 3. Halt after it. First response is a plan, not
a diagnosis.

### Subsequent Investigation Turn

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
- Add evidence — specify
- Mark resolved — summarize verified root cause
- Pause — stop here
```

Do one investigation action per turn, update the journal, save it, and halt.
This cadence repeats until the user explicitly pauses or closes the
investigation.

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
framing's vocabulary. Include log schemas only when logs, SIEM data, LSS/NSS,
or a user-provided log/evidence path is part of the framing. Prefer explicit
framing-to-file matches over model inference; companion references are often
needed together.

If a matching file exists under `agents/investigator/grounding/`, prefer that
grounding card before falling back to keyword-only topic loading.

### Workflow Report Artifact Creation

After composing the parsed framing and proposed loads, follow
[`workflow-report.md`](./workflow-report.md). Do not summarize or collapse the
helper-backed transaction:

1. Resolve `case_dir` to `<working-dir>/_data/cases/<slug>`.
2. Write the parsed framing to a JSON file.
3. Run `node scripts/investigator-artifacts.mjs create-report` with the repo
   root, slug, framing JSON, and proposed load list.
4. If the report status is `pass`, run
   `node scripts/investigator-artifacts.mjs verify-report`.
5. Only after verification succeeds, emit the workflow report, report JSON, and
   journal paths in the Step 1 output.

Do this before Checkpoint 1. `workflow-zscaler-investigator-report.md`,
`workflow-zscaler-investigator-report.json`, and `journal.md` must exist from
Step 1 onward, even if the journal only contains framing and empty claims.

Slug selection:

- If the user referenced an existing case path, use that slug.
- If the user-referenced or current case directory already contains
  `journal.md`, continue that journal.
- Otherwise derive a short slug from date + symptom, for example
  `2026-05-17-zpa-connector-assignment`.

Do not browse sibling case directories to find a matching prior journal. The
only continuation signals are an explicit user path/slug or the current target
directory already containing `journal.md`.

The stub bodies are deterministic and owned by
`scripts/investigator-artifacts.mjs`. Do not hand-author a different workflow
report or journal shape in a runtime adapter.

If the working directory is unknown, do not create the stub. Ask the working
directory clarification as the whole turn.

If directory creation, write, readback, or marker verification fails, do not
claim the workflow report is ready. Surface `Workflow report not ready:
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
