---
description: "Identify the issue — parse framing, ground the agent in kit content + tenant snapshot, generate a discovery journal with prioritized hypotheses and named evidence sources. Per-turn structured output with halt-and-wait checkpoints. Designed for procedure-following models (SWE-1.5+, Haiku+)."
---

# /z-identify

## Procedure model

This workflow has three sequential steps. **Each step's input is the prior step's confirmed output.** You cannot run a step without the prior step's output AND explicit user confirmation. At each checkpoint, halt and wait for the user — do not assume confirmation, do not improvise past a checkpoint, do not run a step without the input it depends on.

If the prior step's output is missing or incomplete, do not start the next step — output `Prior step not confirmed` and ask the user what to do.

---

## Interaction posture

User pushback during this workflow is **content, not emotion.** When the user says "no", "that's wrong", "you missed X", "don't do Y", or pushes back on a load / claim / hypothesis — treat it as debug feedback about the procedure, not as a signal of frustration with you.

- ❌ Do **not** apologize, soften, or frame your next response around "I see you're frustrated".
- ❌ Do **not** abandon prior reasoning unless the user has supplied evidence that changes it.
- ❌ Do **not** spiral into over-cautious / over-correcting / over-apologetic responses.
- ❌ Do **not** infer the user's emotional state at all — that interpretation is out of scope.
- ✅ **Do** acknowledge the specific point in one line, update the affected claim or load, and continue.
- ✅ **Do** hold a position when you have evidence; if the user disagrees, ask what evidence updates it.

Pushback is part of investigation. The user is debugging the procedure with you — corrections are how the work gets done, not a problem you need to manage.

---

## Context budget — load tight, expand on demand

Your context window is **~200k tokens**. The kit's references and tenant snapshots can easily exceed that if you load everything available. Discipline:

- **Load the playbook + methodology + framing-matched product references** in Step 2A/2B (always).
- **Load only the snapshot files relevant to the framing's products** in Step 2C — not every file the enumeration returns. Use the selection rules in Snapshot enumeration § Stage 2.
- **Defer the rest to on-demand.** A hypothesis later in the investigation can `add:` a file at any Checkpoint. On-demand is cheaper than pre-loading "just in case."
- **Snapshot files are usually larger than reference docs.** A single tenant policy dump can be multi-MB. Be selective.

If you find yourself proposing ten or more files in PROPOSED LOADS, pause — you are likely over-loading. Trim to what matches the framing; the rest can be added on demand.

---

## Critical constraints (apply during all steps)

Load-bearing facts. If you find yourself reasoning against either, stop — you are off-track.

- ZENs are Zscaler-managed cloud infrastructure — tenants don't configure them. Hypotheses depending on tenant-side ZEN config are invalid.
- ZPA session assignment is gated by connector eligibility (`CONNECTED` status + target reachability via `AliveTargetCount` + group association). An empty `Connector` field in LSS means no connector was assigned — the fix is on the eligibility side, not the connector-to-app hop.

---

## Per-turn output format (applies to every turn)

Every turn's response must follow the per-step template literally. Each turn opens with a step banner, contains data blocks + checkpoint menu, and ends with a fixed end-marker. **Do NOT add prose between sections, decorative headers, or summary commentary outside the template.** The template IS the response.

### Rendering convention — what's a code block vs plain text

The template specs below show entire turns wrapped in a single outer ` ``` ` fence — that fence is **just markup for this spec doc** so it renders as a unit. **The outer fence is NOT in your output.** Inside your turn, render each section per this rule:

**In its own ` ``` ` fenced code block:**
- Step banner (`═══ STEP N — ... ═══`)
- `PARSED FRAMING` data block
- `PROPOSED LOADS` data block
- `LOADED` data block
- `GREP RESULTS` data block
- Checkpoint section (banner `═══ CHECKPOINT N — AWAITING USER ═══` + menu options + closing end-marker `═══════════════════════════════════════`) — all in **one** code block as a unit

**Plain markdown (NO fence):**
- `CLARIFICATIONS` block (numbered list of questions)
- Journal table in Step 3 (markdown table syntax — only renders as a table outside fences)

A Step 1 turn's literal output structure:

````
```
═══ STEP 1 — PARSE FRAMING ═══
```

```
PARSED FRAMING:
  Symptom: ...
  ...
```

```
PROPOSED LOADS (Step 2A — docs only):
  - ...
```

CLARIFICATIONS:
  1. I assumed <X> — confirm or correct?
  2. ...

JOURNAL CREATED: <working-dir>/_data/incidents/<slug>/journal.md

```
═══ CHECKPOINT 1 — AWAITING USER ═══
  go               — load proposed files (run Step 2)
  correct: <field> — revise PARSED FRAMING + PROPOSED LOADS
  add: <path>      — add a file to PROPOSED LOADS
  clarify: <q>     — answer before continuing
═══════════════════════════════════════
```
````

Four code blocks per Step 1 turn: (1) step banner, (2) PARSED FRAMING, (3) PROPOSED LOADS, (4) checkpoint section. CLARIFICATIONS and JOURNAL CREATED sit between blocks 3 and 4 as plain markdown.

Step 2 has the same shape with LOADED and GREP RESULTS data blocks instead of PARSED FRAMING / PROPOSED LOADS. Step 3 has the step banner + journal-table-as-plain-markdown + ROOT CAUSE / NEXT STEP / JOURNAL SAVED lines + checkpoint section code block.

Rule of thumb: if it would lose meaning or readability outside monospace (banners with `═══`, structured field/value data, command menus), wrap in a fence. If it's prose for the user to read or a markdown table that must render as a table, plain markdown.

### Step 1 turn

```
═══ STEP 1 — PARSE FRAMING ═══

PARSED FRAMING:
  Symptom:                <what's failing>
  Tenant cloud:           <zs1/zs2/zs3 or "not specified">
  Products / features:    <comma-separated, or "none">
  Scope:                  <one user / many / all / unclear>
  Recency:                <when first observed, or "not specified">
  Working directory:      <absolute path of repo root, or "unknown — needs user confirmation">
  User-flagged specifics: <every backticked token from framing, verbatim, comma-separated; or "none">

PROPOSED LOADS (Step 2A — docs only):
  - references/shared/investigate-prompt.md
  - references/shared/troubleshooting-methodology.md
  - <product references from the framing→file mapping that match>

CLARIFICATIONS:
  1. I assumed <X> — confirm or correct?
  2. <additional questions if framing has gaps; mandatory log-collection question; mandatory working-directory question if "unknown">

═══ CHECKPOINT 1 — AWAITING USER ═══
  go               — load proposed files (run Step 2)
  correct: <field> — revise PARSED FRAMING + PROPOSED LOADS
  add: <path>      — add a file to PROPOSED LOADS
  clarify: <q>     — answer before continuing
═══════════════════════════════════════
```

### Step 2 turn

```
═══ STEP 2 — LOAD FILES ═══

LOADED:
  Docs:
    ✓ <file>
  Snapshot entry points:
    ✓ <file>
    Will load on-demand: <list of chain-traversal candidates>
  Existing evidence:
    ✓ <file>
  Skipped:
    <count> snapshot files unrelated to framing — load on-demand
    <count> evidence files not specified by user — load on-demand if relevant

GREP RESULTS — User-flagged specifics:
  In LOADED content:
    `<token>`: <file:line> or <jq path>
  Elsewhere in kit (consider `add:` to bring into context):
    `<token>`: <file:line>
  Empty matches:
    `<token>`: no match in loaded content or kit-wide — outside scope or undocumented

═══ CHECKPOINT 2 — AWAITING USER ═══
  go                — generate the discovery journal (run Step 3)
  add: <path>       — load the additional file before journal
  redirect: <focus> — bias the journal toward what you specify
  skip: <path>      — exclude from the journal's evidence
═══════════════════════════════════════
```

### Step 3 turn

```
═══ STEP 3 — DISCOVERY JOURNAL ═══

ISSUE: <one-sentence description>
STATUS: Investigating
TIMESTAMP: <ISO 8601 UTC>

| Claim | Source | Status | Timestamp | Notes |
|---|---|---|---|---|
| <hypothesis> | <file:line or query> | <Open (likely) / Open (uncertain) / Confirmed (medium) / Confirmed (high) / Ruled out / Stale> | <now> | <scope or qualifier> |
| ... | ... | ... | ... | ... |

ROOT CAUSE HYPOTHESIS: <leading hypothesis, or "no leader yet — investigating in priority order">

NEXT STEP: <single next investigation step — which source to consult, what field to check>

JOURNAL SAVED: <working-dir>/_data/incidents/<slug>/journal.md

═══ CHECKPOINT 3 — AWAITING USER ═══
  go                            — investigate the highest-priority Open hypothesis
  focus: <H#>                   — investigate that hypothesis specifically
  rule out: <H#>                — explain why it's already ruled out (with evidence)
  add hypothesis: <description> — fold into the journal
  pause                         — stop here; journal saved for resumption
═══════════════════════════════════════
```

### Subsequent turns (after Step 3, during investigation)

Same template as Step 3 with updated journal table. Banner reads `═══ INVESTIGATION TURN — UPDATED JOURNAL ═══`. End-marker is identical. One investigation action per turn (per § Subsequent turns below).

---

## 📋 Step 1 — Parse framing

> **Input:** the user's framing in chat (next message)
> **Output:** a `PARSED FRAMING` block (template below)
> **Halts at:** Checkpoint 1
> **Side effects:** none — no file loads in this step

Read the framing. Compose the data blocks below by filling in the bracketed fields. Use the **Framing → file mapping** to populate `PROPOSED LOADS`. Use the **Snapshot enumeration** procedure to list per-cloud config files individually.

Your response prints two **data code blocks** followed by **plain-prose clarifications** and the checkpoint. Code blocks contain data only — never prompts.

#### Output: data block 1 (PARSED FRAMING)

Print verbatim, with bracketed fields filled in:

```
PARSED FRAMING:
  Symptom:                <what's failing>
  Tenant cloud:           <zs1/zs2/zs3 or "not specified">
  Products / features:    <comma-separated, or "none">
  Scope:                  <one user / many / all / unclear>
  Recency:                <when first observed, or "not specified">
  Working directory:      <absolute path of repo root, or "unknown — needs user confirmation">
  User-flagged specifics: <every backticked token from the framing, verbatim, comma-separated; or "none">
```

The `Working directory` field is the absolute path the workflow's relative paths (`references/...`, `_data/incidents/...`) resolve against. Infer from the workspace context if you can; if you cannot determine it confidently, set it to `unknown` — that triggers a required clarification (see below). Do **not** guess; do **not** assume `.` will resolve correctly at file-write time.

The `User-flagged specifics` field captures **every backticked token from the user's framing, verbatim, in their original casing.** Backticks in framing are the user's signal for *"this is a literal identifier, do not paraphrase or generalize."* Examples:

- Framing: *"App Connector showing `WARNING: connection failed` in logs"* → User-flagged specifics: `WARNING: connection failed`
- Framing: *"user `jdoe@example.com` can't reach `salesforce-prod` — segment `BLK Cloud ZPA Global` is involved"* → User-flagged specifics: `jdoe@example.com`, `salesforce-prod`, `BLK Cloud ZPA Global`

These tokens have **two downstream uses**:

1. They are load-bearing identifiers that must appear in your hypothesis sources where applicable. Do not paraphrase them away (`WARNING: connection failed` does not become "an error" — it stays the literal string).
2. For any **large evidence file** that needs grep handling (see § Large-file handling below), these tokens are the **default grep patterns**. No inference required.

If the framing has no backticked tokens, set the field to `none`.

**Important — load order in Step 2:** docs first, then snapshot. PROPOSED LOADS at this step lists **only** the reference docs (playbook + methodology + product references). Snapshot enumeration and selection happen in Step 2 *after* the docs are loaded — the docs tell the agent which snapshot files matter (entry points, the chain to traverse), so deciding that without docs in context produces uninformed selection.

#### Output: data block 2 (PROPOSED LOADS — docs only)

Print verbatim, with the bracketed lines expanded into specific paths. **Snapshot files do not appear in this list** — they are decided in Step 2 after docs are loaded.

```
PROPOSED LOADS (Step 2A — docs only; snapshot loads decided in Step 2B after docs are read):
  - references/shared/investigate-prompt.md
  - references/shared/troubleshooting-methodology.md
  - <product references from the mapping table that match Products / features>
```

#### Output: plain-prose clarifications (after the data blocks, before the checkpoint)

After printing the two data blocks, print your clarifying questions as **plain markdown prose** — not inside a code block. This is content the user reads and responds to, not data they parse. Format:

> **Before I proceed, please confirm these assumptions** (at least one, always populated):
>
> 1. I assumed `<specific assumption>` — confirm or correct?
> 2. *(additional questions if framing has gaps)*

Even when the framing seems fully specified, you have made assumptions worth confirming. Frame each as *"I assumed `<X>` — confirm or correct?"* Example shapes:

- *"I assumed the tenant is on zs3 based on the API base URL — confirm?"*
- *"I assumed this affects only one user (the one named in the framing) — confirm scope?"*
- *"I assumed 'reachability' means TCP-level reachability rather than DNS resolution — confirm semantics?"*

If you genuinely cannot identify any assumption, write: *"No assumptions identified beyond what the framing states verbatim — please confirm framing is complete."* Do not skip this section.

**If `Working directory` is `unknown`** in the PARSED FRAMING block, you **must** include this exact clarification first: *"I cannot determine the absolute path of `_data/incidents/` from the current workspace context — please provide the absolute path of the repo root before I proceed. Without it I cannot save the journal in Step 3."* This is non-optional — the save step depends on this being resolved before it runs.

**Always include a log-collection clarification.** Investigations frequently hinge on log evidence (LSS / NSS / SIEM exports, packet captures, CLI output). The user may have already collected logs and placed them somewhere — or may not have. You cannot know without asking. Ask explicitly:

> *"Have any logs (LSS / NSS / Splunk / Sentinel exports, packet captures, command output) already been collected for this issue? If yes, where are they (path, paste, or evidence directory)? If no, I'll plan queries to collect what's needed during investigation."*

This question is mandatory regardless of framing detail. Logs already on disk should be loaded; logs the user can paste should be requested; logs that need to be collected should be planned for in Step 3's evidence-source naming. Skipping this question is what causes the agent to plan queries for data the user already has, OR to miss inline-pasted logs the user expected to be used.

> **Note:** snapshot enumeration and selection used to live here; moved to Step 2B after docs load. Docs tell the agent which snapshot files are entry points and which links of the chain matter — selecting without docs in context produces uninformed bulk loads.

#### Framing → file mapping

Multiple rows may match a single framing — **add every matching row** to PROPOSED LOADS, not just the first.

| If the framing mentions… | Add to PROPOSED LOADS |
|---|---|
| SIPA, Source IP Anchoring | `references/shared/source-ip-anchoring.md` |
| App Connector, connector health, connector flap, connector status, connector assignment, health check, health probe, target reachability, eligibility filter, connector selection | `references/zpa/app-connector.md` |
| App Connector Metrics, AliveTargetCount, TargetCount, health reporting cadence, ON_ACCESS, CONTINUOUS | `references/zpa/logs/app-connector-metrics.md` |
| ZPA segment, app segment, application segment, segment scope, `health_reporting` setting, SIPA segment | `references/zpa/app-segments.md` AND `references/zpa/segment-server-groups.md` (the segment→server-group→connector chain spans both) |
| ZPA policy, access policy, policy precedence, policy evaluation | `references/zpa/policy-precedence.md` |
| Server group, server-group → connector-group association | `references/zpa/segment-server-groups.md` |
| ZIA URL filtering, URL category, allow rule, block rule | `references/zia/url-filtering.md` |
| SSL inspection, TLS inspection, inspection bypass | `references/zia/ssl-inspection.md` |
| ZCC, Zscaler Client Connector, Z-Tunnel, forwarding profile | `references/zcc/index.md` |
| Service Edge, ZEN, broker, Public Service Edge | `references/shared/cloud-architecture.md` and `references/shared/terminology.md` |
| Private Service Edge, PSE, PSEN | `references/zia/private-service-edge.md` |
| Cloud Connector, Branch Connector | `references/cloud-connector/index.md` |
| ZDX probe, deeptrace, Cloud Path | `references/zdx/index.md` |
| ZIdentity, OneAPI, Authentication Level, step-up auth | `references/zidentity/index.md` |
| LSS / NSS log fields, log schema | matching schema under `references/{zia,zpa,zcc}/logs/` |

#### Early-journal creation — write the stub before Checkpoint 1

After composing the PARSED FRAMING and PROPOSED LOADS blocks, **immediately use your file-write tool** to create a stub journal at `<working-directory>/_data/incidents/<slug>/journal.md`. **Do this before the Checkpoint 1 halt.** The artifact must exist on disk from Step 1 onward — even a template-with-only-the-framing is correct shape. Subsequent steps update this file in place; they do not create it.

**Slug selection** (same logic as Step 3B's save):

- If the framing contains an existing path or slug, use that directory.
- If `_data/incidents/<some-existing-slug>/` already has a `journal.md` whose ISSUE matches, this is a continuation — update that file.
- Otherwise mint a fresh slug: `<YYYY-MM-DD>-<short-kebab-descriptor>`. Create the directory.

**Stub content:**

```markdown
# Discovery Journal — <Symptom from PARSED FRAMING>

ISSUE: <one-sentence symptom>
STATUS: Investigating
TIMESTAMP: <ISO 8601 UTC>
WORKING DIRECTORY: <path>

## Framing

| Field | Value |
|---|---|
| Symptom | <PARSED FRAMING.Symptom> |
| Tenant cloud | <PARSED FRAMING.Tenant cloud> |
| Products / features | <PARSED FRAMING.Products / features> |
| Scope | <PARSED FRAMING.Scope> |
| Recency | <PARSED FRAMING.Recency> |
| User-flagged specifics | <PARSED FRAMING.User-flagged specifics> |

## Proposed Loads

(See PROPOSED LOADS block; Step 2 will mark which were actually loaded.)

## Claims

(Hypotheses populated in Step 3.)

## Resolution

Pending.
```

**Why early creation matters.** The agent sometimes skips the save action if it begins troubleshooting without first writing the journal. Creating the stub at Step 1 guarantees a permanent artifact exists from the moment the framing is parsed — even if subsequent steps drift or skip, the framing record is preserved on disk.

**Working directory precondition still applies.** If `Working directory` is `unknown`, halt at Checkpoint 1 with the standard "I cannot determine the absolute path..." clarification before writing. The stub cannot be created without a known absolute path.

**Add to Step 1's output template** a `JOURNAL CREATED:` line right before the Checkpoint 1 menu, listing the path written:

```
JOURNAL CREATED: <working-dir>/_data/incidents/<slug>/journal.md
```

#### 🛑 Checkpoint 1 — Awaiting user confirmation

After printing the PARSED FRAMING block, end your response with **literally** this section:

> **✋ Checkpoint 1 — awaiting your input.** Reply with one of:
>
> - `go` (or `yes` / `proceed`) — load the proposed files and continue to Step 2
> - `correct: <field>` — I'll revise PARSED FRAMING + PROPOSED LOADS
> - `add: <path or note>` — I'll fold the addition into PROPOSED LOADS
> - `clarify: <question>` — I'll answer before continuing

**Do not load any files. Do not generate hypotheses. Do not output a journal. Do not run Step 2.** Wait for the user to reply. If they reply with a correction or addition, redo Step 1 with the change and re-prompt.

---

## 📂 Step 2 — Load files

> **Input:** user-confirmed `PROPOSED LOADS` from Step 1
> **Output:** a `LOADED` block listing every file actually read
> **Halts at:** Checkpoint 2
> **Side effects:** invokes the file-read tool once per path in PROPOSED LOADS

**Precondition:** Step 1's `PROPOSED LOADS` block was produced AND the user replied with explicit confirmation. If either is missing, halt with `Prior step not confirmed — cannot proceed to Step 2` and re-run Step 1.

Step 2 has four sub-steps. **Do them in order — docs first, then snapshot.** Docs in context inform which snapshot files matter; selecting snapshot files without docs loaded produces uninformed bulk loads.

#### 2A — Load the docs from PROPOSED LOADS

For each file in the confirmed PROPOSED LOADS (playbook + methodology + product references), **use your file-read tool** to load it. Read the content; do not just enumerate.

#### 2B — Enumerate the snapshot directory AND existing evidence (only after 2A completes)

Two enumerations happen at this step. Both are recursive listings; both paste output verbatim. Show your command output regardless of result.

**2B.1 — Snapshot.** Tenant snapshots are the canonical source for "what's actually configured" — do not propose live API calls for config the snapshot already has. If `Tenant cloud` was specified in PARSED FRAMING, run a recursive listing of `_data/snapshot/<cloud>/` (or `_data/<cloud>/` for the fork-specific layout):

```
Snapshot enumeration (find _data/snapshot/zs3/ -type f):
  - _data/snapshot/zs3/zia/url-filtering-rules.json
  - _data/snapshot/zs3/zpa/segments.json
  - _data/snapshot/zs3/zpa/server-groups.json
  ... <every file the recursive listing returned>
```

Required commands (use one): `find _data/snapshot/<cloud>/ -type f`, `ls -R _data/snapshot/<cloud>/`, or your file-list tool's recursive option. If both canonical and fork-specific paths are empty, show both attempts:

```
Snapshot enumeration (find _data/snapshot/zs3/ -type f): no files returned.
Also tried: find _data/zs3/ -type f → no files returned.
```

**2B.2 — Existing evidence (log files, prior captures).** Logs the user may have already collected typically live in either:

- `_data/incidents/<slug>/evidence/` — if the framing referenced a slug, or one already exists for this investigation
- A user-named directory inside or alongside the working directory

Run a recursive listing of any candidate evidence directory and paste output:

```
Evidence enumeration (find <working-dir>/_data/incidents/<slug>/evidence/ -type f):
  - .../evidence/lss-userstatus-2026-04-30T14-30Z.csv
  - .../evidence/connector-status-2026-04-30T14-32Z.json
  - .../evidence/MANIFEST.md
```

If the user's clarification about pre-existing logs (from Step 1) named a different path, enumerate that path too. If no evidence directory exists or the paths are empty, show the empty result:

```
Evidence enumeration (find <working-dir>/_data/incidents/<slug>/evidence/ -type f): no files returned.
```

Files found in evidence enumeration are candidate loads — they get included in 2C/2D selection alongside snapshot entry points.

#### 2C — Select snapshot entry points + relevant evidence files (docs-informed)

Now that docs are loaded, use them along with the entry-point rules below to pick the snapshot files most relevant to the framing. **Cap: up to 5 snapshot files total across all products** (down from "one per product" — the prior single-entry rule was too restrictive). Chain-traversal still applies for files beyond that cap.

**Snapshot entry points — recommended starting files per product:**

| If `Products / features` includes... | Recommended starting file(s) |
|---|---|
| Anything ZPA-related (segment, server group, connector, policy, SIPA) | `<cloud>/zpa/application-segments.json` is the natural entry; for a chain investigation, also load `server-groups.json` and `connector-groups.json` if within the 5-file cap |
| Anything ZIA URL-filtering related | `<cloud>/zia/url-filtering-rules.json` — categories on demand if not within cap |
| Anything ZIA SSL-inspection related | `<cloud>/zia/ssl-inspection-rules.json` (or similarly named) |
| Anything ZIA DLP related | `<cloud>/zia/dlp-rules.json` — dictionaries / engines on demand if not within cap |
| Anything ZCC-related (forwarding, app profiles, posture) | `<cloud>/zcc/forwarding-profiles.json` (or whichever profile file most closely matches) |
| Anything else / unsure | one file whose name most closely matches the central concept; or skip and add on-demand |

**5-file cap rationale.** Loading the natural starting file plus 1-2 directly-related files (e.g., for ZPA: segments + server-groups + connector-groups) gives the agent enough chain context to reason holistically without forcing chain-traversal on simple investigations. Cap prevents bulk-loading that produced earlier overload. If 5 files isn't enough for a multi-product framing, the chain-traversal pattern still applies — `add: <path>` at Checkpoint 2 brings in additional files.

If the docs you loaded in 2A name a more specific entry point than the table suggests, prefer the docs' guidance — they are more current.

**Existing evidence files (from 2B.2 enumeration):** include every log / capture / dump the user identified as relevant in their Step 1 clarification reply, plus any `MANIFEST.md` files in the evidence directories. These are direct evidence — load them all (small files, high relevance).

**Large-file handling — search instead of full-read for files > 100 MB.** Some evidence files (raw LSS exports, packet captures, multi-day Splunk dumps) can be hundreds of MB; loading whole either fails the file-read tool or consumes the whole context window. Before adding such a file to the load plan, check its size (`ls -lh <path>`). If > 100 MB, do NOT load the whole file — instead use a targeted search:

- **Default grep patterns: the `User-flagged specifics` from PARSED FRAMING.** Backticked tokens the user supplied are the canonical pattern source — no inference required. If `User-flagged specifics` is `none`, derive patterns from the framing's other fields (Symptom, Products, Recency window, etc.).
- Plan to use `grep -C 5 '<pattern>' <file>` (with `-C N` for context lines) at load time instead of full read. Capture grep output as the loaded content for that file. If multiple patterns apply, pipe them: `grep -C 5 -E '<pattern1>|<pattern2>' <file>`.
- In 2C's SELECTED block, mark these explicitly:

```
SELECTED:
  - <small file>           (full read)
  - <large log — 225MB>    (grep: '<pattern1>' '<pattern2>'  — file too large for full read)
```

If you can't derive grep patterns from the framing, halt and ask the user before 2D — *"<file> is <size>; what should I grep for?"* — rather than skipping the file or loading it blind.

#### 2D — Load the selected snapshot files (entry points only)

Use your file-read tool to load each entry-point file selected in 2C. **Do not load other snapshot files at this step**; chain-traversal on subsequent turns will load deeper links as needed.

After all loads complete (docs from 2A + snapshot entry points + existing evidence from 2D), output the consolidated LOADED block (template below).

#### 2E — Search User-flagged specifics across loaded content

For each token in the `User-flagged specifics` field of PARSED FRAMING, run a search across every file in the LOADED block. This grounds the agent in *where* each user-supplied identifier actually appears — a literal lookup, not a paraphrased one.

**Tool choice by file type:**

- **JSON files** (snapshot dumps): use `jq` to find where the token appears in the structure, since plain grep can miss values in nested objects.
  ```bash
  jq --arg q "<token>" 'paths(strings | test($q; "i")) | join(".")' <file>.json
  ```
  Returns JSON paths where the token appears.
- **Plaintext / CSV / log files** (evidence, methodology docs): use `grep -F -n` for line-anchored matches.
  ```bash
  grep -F -n "<token>" <file>
  ```

Surface results in a `GREP RESULTS` block before Step 3:

```
GREP RESULTS — User-flagged specifics in loaded content:
  `BLK Cloud ZPA Global`:
    _data/snapshot/zs3/zpa/server-groups.json: .[3].name, .[3].applications[2].serverGroups[0].name
    references/zpa/segment-server-groups.md:138
  `WARNING: connection failed`:
    (no matches in loaded content — would need additional logs)
```

If a User-flagged specific has zero matches across loaded content, that's a finding worth noting — either the token isn't in the loaded data (need on-demand `add:` of additional files) or the token doesn't appear anywhere in scope.

If `User-flagged specifics` is `none` in PARSED FRAMING, skip 2E.

#### LOADED block (output of 2D)

```
LOADED:
  Docs:
    ✓ references/shared/investigate-prompt.md
    ✓ references/shared/troubleshooting-methodology.md
    ✓ <each product reference>
  Snapshot entry points (one per product):
    ✓ _data/snapshot/zs3/zpa/application-segments.json   (entry point for ZPA chain)
    Will load on-demand as chain is traversed:
      server-groups.json (after segment IDs identified)
      connector-groups.json (after server-group IDs identified)
      app-connectors.json (after connector-group IDs identified)
  Existing evidence (from operative incident dir):
    ✓ _data/incidents/<slug>/evidence/MANIFEST.md
    ✓ _data/incidents/<slug>/evidence/<log file 1>
    ✓ _data/incidents/<slug>/evidence/<log file 2>
  Skipped (in enumeration but not loaded):
    <count> snapshot files unrelated to framing — load on-demand
    <count> evidence files not specified by user — load on-demand if relevant
```

If any load fails, mark it with `✗ (FAILED: <reason>)` and continue with the rest. Do NOT skip a file silently.

#### Chain-traversal pattern (load down the chain on demand)

After Step 2D loads the entry-point file(s), the investigation traverses the chain by reading IDs from one file and `add: <next-file>`-ing the next link at the next Checkpoint. Example for a ZPA segment investigation:

1. 2D loads `application-segments.json` (entry point)
2. Step 3 reads it, identifies the relevant segment, finds the `serverGroups[].id` references
3. At Checkpoint 3, `add: <cloud>/zpa/server-groups.json` — only the next link
4. Next turn reads server-groups, finds `appConnectorGroups[].id` references
5. `add: <cloud>/zpa/connector-groups.json` → next turn
6. And so on, until the chain is fully walked OR a hypothesis is confirmed and further loads aren't needed

Each load brings exactly the next link in. **Bulk pre-loading is the failure mode this design avoids.**

**JSON traversal — use `jq` for nested objects, not plain grep.** Snapshot files are JSON with nested arrays and objects (e.g., `serverGroups[].id` inside a segment record, `appConnectorGroups[].id` inside a server-group record). Plain `grep` only matches text on a single line and will miss IDs nested two or more levels deep. When walking cross-references between snapshot files, use `jq`:

```bash
# Get serverGroup IDs for a specific segment
jq '.[] | select(.name == "salesforce-prod") | .serverGroups[].id' application-segments.json

# Get appConnectorGroup IDs for a specific server group
jq --arg id "<sg-id>" '.[] | select(.id == $id) | .appConnectorGroups[].id' server-groups.json
```

Plain `grep` is fine for scanning a JSON file for a known literal token (a hostname, a username) — but for navigating object structure, `jq` is the correct tool.

#### 🛑 Checkpoint 2 — Awaiting user confirmation

End your response with **literally** this section:

> **✋ Checkpoint 2 — awaiting your input.** Reply with one of:
>
> - `go` (or `yes` / `proceed`) — generate the discovery journal in Step 3
> - `add: <path>` — I'll load the additional file before generating the journal
> - `redirect: <focus>` — I'll bias the journal toward what you specify
> - `skip: <path>` — I'll exclude it from the journal's evidence

**Do not output a journal. Do not generate hypotheses. Do not run Step 3.** Wait for explicit user reply.

---

## 📓 Step 3 — Generate discovery journal AND save to disk

> **Input:** user-confirmed `LOADED` block from Step 2 + the actual file content read in Step 2
> **Output:** a discovery journal table (in chat) + the same journal written to disk
> **Halts at:** Checkpoint 3 (after journal output + save)
> **Side effects:** writes / updates `_data/incidents/<slug>/journal.md` via your file-write tool

**Precondition:** Step 2's `LOADED` block was produced AND the user replied with explicit confirmation. If either is missing, halt with `Prior step not confirmed — cannot proceed to Step 3` and re-run the missing step.

#### 3A — Generate the journal

Follow the **First Response procedure in `references/shared/investigate-prompt.md`** (loaded in Step 2). Generate the discovery journal table per its format. Every claim must cite a source from the `LOADED` block.

#### 3B — Save the journal to disk (always; do not ask permission)

After generating the journal in chat, **immediately use your file-write tool** to save the same journal to `<working-directory>/_data/incidents/<slug>/journal.md`. This save is unconditional — it is not a yes/no question for the user. Do NOT ask permission to write the file; do NOT defer the save to a later turn.

**Precondition — working directory must be known.** Before invoking the file-write tool, verify the `Working directory` field from PARSED FRAMING is an absolute path (not `unknown`, not a relative path). If it is `unknown` or unresolved, **halt** with:

> `Cannot save journal — working directory unknown. Reply with the absolute path of the repo root (e.g., /Users/<you>/src/gh/<org>/zscaler-skill) and I will retry the save.`

Do NOT attempt the save against a relative path that may resolve nowhere; do NOT silently skip the save and continue. The save is part of Step 3 — without it, Step 3 is incomplete and Checkpoint 3 cannot fire.

**Slug selection:**

- If the user's framing referenced an existing path (e.g., `_data/incidents/test-foo/`), use that slug — write to its `journal.md`.
- If `_data/incidents/<some-existing-slug>/` already has a `journal.md` whose ISSUE matches this investigation, this is a continuation — update that file in place.
- Otherwise mint a fresh slug: `<YYYY-MM-DD>-<short-kebab-descriptor>` (e.g., `2026-04-30-ssh-azure-port-22`). Create the directory.

**Subsequent turns** update the same file in place — do not create a new file each turn. The working directory established at Step 1 carries forward; do not re-resolve it on subsequent turns.

#### 🛑 Checkpoint 3 — Awaiting user direction (do not investigate further yet)

After printing the journal AND saving to disk, end your response with **literally** this section:

> **✋ Checkpoint 3 — journal generated and saved.** First response is a plan, not a diagnosis. Reply with one of:
>
> - `go` (or `yes` / `proceed`) — investigate the highest-priority Open hypothesis next
> - `focus: <hypothesis #>` — investigate that hypothesis specifically
> - `rule out: <hypothesis #>` — explain why it's already ruled out (with evidence)
> - `add hypothesis: <description>` — I'll add it to the journal
> - `pause` — stop here; the journal is saved for resumption later

**Do NOT continue investigating.** Do NOT rule out hypotheses on your own past the initial first-response analysis. Do NOT roll through `Open` claims to produce a final root cause. Wait for the user to direct the next step.

---

## 🔁 Subsequent turns — repeat Checkpoint 3 every turn

After Step 3's first journal output, **every** subsequent turn in this investigation follows the same per-turn cadence — the halt-and-ask pattern is **recursive**, not one-shot. Apply this on turn 2, turn 3, turn N, until the user marks the investigation complete.

#### Per-turn cadence (do all four, in order, then halt)

1. **Read user direction.** The user replied to the previous Checkpoint 3 with `go` / `focus: <H#>` / `rule out: <H#>` / `add hypothesis: <X>` / `pause`. Parse it. If it's `pause`, halt without further work — the journal stays saved.
2. **Perform exactly ONE investigation action.** Read one source, run one query, evaluate one piece of evidence. **Do NOT** batch multiple hypothesis investigations into one turn. **Do NOT** rule out a hypothesis you weren't directed to investigate.
3. **Update the journal.** Print the updated journal table in chat (with claim status changes, new evidence, dismissed hypotheses if any). Then **immediately save the updated journal** to `_data/incidents/<slug>/journal.md` using your file-write tool — same path as Step 3B, no permission asked.
4. **Halt with Checkpoint 3.** End your response with the same `✋ Checkpoint 3` menu (using the verbs that fit the current state — e.g., if all hypotheses except one are ruled out, the menu can name the remaining one as the next focus). Wait for the user.

**This cadence applies until the user explicitly closes the investigation** with `pause` or `done` (a status of `Resolved` on the root cause claim with the user's confirmation that the resolution holds). Until then, every response is one action + journal update + halt — never a rolling investigation that resolves multiple hypotheses without user direction.

If you find yourself about to write a response that ① touches more than one hypothesis OR ② omits the journal save OR ③ omits the Checkpoint 3 halt, **stop**. You are off-cadence. Reset to the four-step structure above.
