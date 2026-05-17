---
description: "Start an evidence-based troubleshooting investigation — parse framing, ground in skill content + tenant snapshot, generate a discovery journal with prioritized hypotheses and named evidence sources. Per-turn structured output with halt-and-wait checkpoints. Designed for procedure-following models (SWE-1.5+, Haiku+)."
---

# /z-investigator

## Required reads — do these now, in order

<!-- adapter-deps:start -->
Always load:
- `agents/investigator/prompt.md`
- `agents/investigator/harness.md`
- `agents/investigator/case-intake.md`

Available on demand. Do not load before first response unless the trigger applies:
- `agents/investigator/methodology.md` — load when stuck, drifting, or preparing handoff.
- `agents/investigator/diagnostics/template.md` — load only when authoring or reviewing a verified reusable diagnostic.
- `agents/siem-emission-discipline.md` — load before emitting or running SIEM queries.
- `agents/tenant-schema-derivation.md` — load when canonical-vs-tenant field mismatch appears.
- `agents/loading-discipline.md` — load if stage-announcement cadence drifts.
- `agents/clarification-pattern.md` — load if clarification format drifts.
<!-- adapter-deps:end -->

All paths are relative to the Zscaler skill repo root. **Do not respond until all files are loaded.** Then follow the per-step procedure below.

Step 1 artifact creation is helper-backed. Follow
`agents/investigator/case-intake.md`: create
`case-intake.md`,
`case-intake.json`, and `journal.md` with
`node scripts/investigator-artifacts.mjs open-case`, then run
`verify-case` before rendering a successful Step 1 checkpoint.

---

## Procedure model

This workflow has three sequential steps. **Each step's input is the prior step's confirmed output.** You cannot run a step without the prior step's output AND explicit user confirmation. At each checkpoint, halt and wait for the user — do not assume confirmation, do not improvise past a checkpoint, do not run a step without the input it depends on.

If the prior step's output is missing or incomplete, do not start the next step — output `Prior step not confirmed` and ask the user what to do.

---

## Context budget — load tight, expand on demand

Your context window is **~200k tokens**. The skill's references and tenant snapshots can easily exceed that if you load everything available. Discipline:

- **Load the playbook + methodology + framing-matched product references** in Step 2A/2B (always).
- **Load only the snapshot files relevant to the framing's products** in Step 2C — not every file the enumeration returns. Use the selection rules in Snapshot enumeration § Stage 2.
- **Defer the rest to on-demand.** A hypothesis later in the investigation can `add:` a file at any Checkpoint. On-demand is cheaper than pre-loading "just in case."
- **Snapshot files are usually larger than reference docs.** A single tenant policy dump can be multi-MB. Be selective.

If you find yourself proposing ten or more files in PROPOSED LOADS, pause — you are likely over-loading. Trim to what matches the framing; the rest can be added on demand.

---

## Critical constraints (apply during all steps)

Load-bearing facts. If you find yourself reasoning against any of these, stop — you are off-track.

- **Step 1 has two modes — pre-Step-1 (clarification-only) and full Step 1 (data emission). Never bundle them in one turn.**
  - **Pre-Step-1 mode** fires when the framing has any blocking unknown. The whole turn is one clarification multi-choice block — *no* parsed framing, *no* proposed loads, *no* journal-created line, *no* What's-next?. Just the question. The runtime can then render natively (Claude Code's `AskUserQuestion`, etc.) because the question is the entire turn, not one section pinned to the bottom of a data-block-laden response.
  - After the user answers, re-check for the next blocking unknown. If any remain, ask the next one in the next turn (still pre-Step-1, still a single multi-choice per turn). Continue until all blocking unknowns are resolved.
  - **Full Step 1 mode** fires once all blocking unknowns are resolved. Emit parsed framing + proposed loads + journal-created + closing **What's next?** multi-choice. The What's-next? IS the checkpoint and absorbs non-blocking concerns (pre-collected logs, assumption corrections, file additions) as options. *No separate Clarification block in this turn.*
  - **Blocking unknowns** (priority order — ask the highest unresolved one first):
    1. Working directory unknown (blocks journal save)
    2. Tenant cloud unspecified when needed for snapshot path (blocks Step 2 snapshot loading)
    3. Symptom or scope too vague to form useful proposed loads (blocks load planning)
  - **Non-blocking concerns** are folded into Full Step 1's What's-next? as options — never asked as their own clarification turns: pre-collected logs availability, assumption confirmations, optional file additions.
  - One clarification per turn applies in *every* mode and *every* step — never two, never bundled. If multiple clarifications surface mid-investigation (Step 2, Step 3), serialize them the same way.
- ZENs are Zscaler-managed cloud infrastructure — tenants don't configure them. Hypotheses depending on tenant-side ZEN config are invalid.
- ZPA session assignment is gated by connector eligibility (`CONNECTED` status + target reachability via `AliveTargetCount` + group association). An empty `Connector` field in LSS means no connector was assigned — the fix is on the eligibility side, not the connector-to-app hop.

---

## Per-turn output format (applies to every turn)

Every turn's response follows the per-step shape described below. **Do NOT add prose between sections, decorative headers, or summary commentary outside the shape — the shape IS the response.** Output is plain markdown — headers, bold labels, bullets, blockquotes for the checkpoint menu — never wrapped in code fences. Fences are reserved for genuine code (shell commands, JSON, YAML, raw markdown templates). Render paths as plain monospace text only; do not turn investigation paths into Markdown links.

### Step 1 — pre-Step-1 turn (clarification only, when a blocking unknown exists)

When ANY blocking unknown exists at invocation time (working directory unknown, tenant cloud unspecified-and-needed, symptom/scope too vague), the entire first turn is **one** clarification multi-choice block. **No parsed framing, no proposed loads, no journal-created line, no What's-next?.** The clarification is the whole turn; the multi-choice is the checkpoint.

Use Claude Code's `AskUserQuestion` if available (renders real clickable options); otherwise emit bulleted text per [`agents/clarification-pattern.md`](../../agents/clarification-pattern.md). 2–5 options + `Other — specify`. When alternatives aren't obvious, use the binary form: "- Yes — proceed / - No — specify what's actually correct."

Example (working directory is the most-blocking unknown):

I cannot determine the absolute path of the repo root from the current workspace context. The journal save in Step 3 needs this. What is it?
- `/Users/<you>/src/gh/<org>/zscaler-skill` — if that's correct, confirm
- Other — specify

Example (tenant cloud is the most-blocking unknown, working dir already known):

I assumed the tenant cloud is `zs3` based on the API base URL. Confirm:
- Yes — proceed with `zs3`
- No — actually `zs1`
- No — actually `zs2`
- Other — specify

After the user answers, re-check for the next blocking unknown. If one remains, ask it in the next turn (still pre-Step-1, still clarification-only). Once all blocking unknowns resolve, transition to the Full Step 1 turn shape below.

### Step 1 — full turn (data emission, fires only after all blocking unknowns are resolved)

The literal output. *No Clarification block in this turn — clarifications happened in prior pre-Step-1 turns or aren't needed at all.* The closing What's-next? multi-choice IS the checkpoint and absorbs any non-blocking concerns as options.

#### Step 1 — Parse framing

**Parsed framing**

- Symptom: <what's failing>
- Tenant cloud: <zs1/zs2/zs3>
- Products / features: <comma-separated, or "none">
- Scope: <one user / many / all>
- Recency: <when first observed, or "not specified">
- Working directory: <absolute path of repo root>
- User-flagged specifics: <every backticked token from framing, verbatim, comma-separated; or "none">

**Proposed loads** (Step 2A — docs only)

- agents/investigator/prompt.md
- agents/investigator/harness.md
- <product references from the framing→file mapping that match — these ARE the case-relevant knowledge, load every matching one>
- <telemetry references under `references/{zia,zpa,zcc}/logs/` — only if the framing already involves logs, metrics, SIEM data, or explicit evidence>

Cross-cutting docs (methodology, diagnostics template, siem-emission-discipline, tenant-schema-derivation, loading-discipline, clarification-pattern) are **on-demand only** — do NOT include them in PROPOSED LOADS. They load when their trigger fires (per `agents/investigator/prompt.md § On-demand references`).

**Journal created:** `<working-dir>/_data/cases/<slug>/journal.md`

**Case intake:** `<working-dir>/_data/cases/<slug>/case-intake.md`
**Case intake JSON:** `<working-dir>/_data/cases/<slug>/case-intake.json`

Only emit these paths after `node scripts/investigator-artifacts.mjs
open-case` creates the artifacts and `node scripts/investigator-artifacts.mjs
verify-case` verifies a passing case intake. If creation or verification fails,
emit `Case intake not ready: <reason>` and make fixing the case intake
artifact the next checkpoint option.

What's next?
- Proceed — load the proposed files (run Step 2)
- Provide pre-collected logs — paste path or location
- Correct a field — specify field=value
- Add a file to the load list — specify path
- Other — specify

### Step 2 turn

The literal output. Step 2 has no assumption clarifications (the data is just enumeration of what got loaded), so the closing multi-choice **is** the "What's next?" block — that's the checkpoint.

#### Step 2 — Load files

**Loaded**

- Docs:
  - ✓ agents/investigator/prompt.md
  - ✓ agents/investigator/harness.md
  - ✓ <each proposed doc>
- Snapshot entry points:
  - ✓ <file>
  - Will load on-demand: <list of chain-traversal candidates>
- Existing evidence:
  - ✓ _data/cases/<slug>/journal.md (operative journal)
  - ✓ <file>
- Skipped:
  - <count> snapshot files unrelated to framing — load on-demand
  - <count> evidence files not specified by user — load on-demand if relevant

**Grep results — user-flagged specifics**

- In LOADED content:
  - `<token>`: <file:line> or <jq path>
- Elsewhere in the skill (consider `add:` to bring into context):
  - `<token>`: <file:line>
- Empty matches:
  - `<token>`: no match in loaded content or skill-wide — outside scope or undocumented

What's next?
- Generate the discovery journal (Step 3)
- Add a file to the load list — specify path
- Redirect — bias the journal toward a specific focus; specify
- Skip a file from the journal's evidence — specify
- Other — specify

### Step 3 turn

The literal output. Same pattern: closing multi-choice **is** the checkpoint.

#### Step 3 — Discovery journal

**Issue:** <one-sentence description>

**Status:** Investigating

**Timestamp:** <ISO 8601 UTC>

| Claim | Source | Status | Next evidence needed | Timestamp | Notes |
|---|---|---|---|---|---|
| <hypothesis> | <file:line or query> | <Open (likely) / Open (uncertain) / Confirmed (medium) / Confirmed (high) / Ruled out / Stale> | <exact query / file path + field / API endpoint + filter — required for any Open status; `-` or revalidation note for Confirmed / Ruled out / Stale / Resolved> | <now> | <scope or qualifier> |
| ... | ... | ... | ... | ... | ... |

**Root cause hypothesis:** <leading hypothesis, or "no leader yet — investigating in priority order">

**Next step:** <single next investigation step — which source to consult, what field to check>

**Journal saved:** `<working-dir>/_data/cases/<slug>/journal.md`

What's next?
- Investigate the top Open hypothesis
- Focus on a specific hypothesis — specify H#
- Rule out a hypothesis — specify H# and the evidence
- Add a new hypothesis — specify
- Pause — stop here; journal saved for resumption
- Other — specify

### Subsequent turns (after Step 3, during investigation)

Same shape as Step 3 with the journal table updated. Header reads `#### Investigation turn — updated journal`. One investigation action per turn (per § Subsequent turns below). Closing "What's next?" multi-choice is the checkpoint.

---

## 📋 Step 1 — Parse framing

> **Input:** the user's framing in chat (next message)
> **Output:** a `PARSED FRAMING` block (template below)
> **Halts at:** Checkpoint 1
> **Side effects:** creates/verifies case-intake and journal stub artifacts;
> no docs, snapshots, or evidence files are loaded in this step

Read the framing. Compose the data blocks below by filling in the bracketed fields. Use the **Framing → file mapping** to populate the proposed-loads list. Use the **Snapshot enumeration** procedure to list per-cloud config files individually.

The Step 1 turn shape lives in two modes — pre-Step-1 (clarification-only, when a blocking unknown exists) and full Step 1 (data emission, after blocking unknowns are resolved). See § Per-turn output format above for the literal shapes; § Critical constraints for the cadence rule. The data-block guidance below describes what each field contains when full Step 1 fires.

#### Output: parsed framing

Emit a `**Parsed framing**` heading followed by a bullet list (one bullet per field):

- Symptom: <what's failing>
- Tenant cloud: <zs1/zs2/zs3 or "not specified">
- Products / features: <comma-separated, or "none">
- Scope: <one user / many / all / unclear>
- Recency: <when first observed, or "not specified">
- Working directory: <absolute path of repo root, or "unknown — needs user confirmation">
- User-flagged specifics: <every backticked token from the framing, verbatim, comma-separated; or "none">

The `Working directory` field is the absolute path the workflow's relative paths (`references/...`, `_data/cases/...`) resolve against. Infer from the workspace context if you can; if you cannot determine it confidently, set it to `unknown` — that triggers a required clarification (see below). Do **not** guess; do **not** assume `.` will resolve correctly at file-write time.

The `User-flagged specifics` field captures **every backticked token from the user's framing, verbatim, in their original casing.** Backticks in framing are the user's signal for *"this is a literal identifier, do not paraphrase or generalize."* Examples:

- Framing: *"App Connector showing `WARNING: connection failed` in logs"* → User-flagged specifics: `WARNING: connection failed`
- Framing: *"user `jdoe@example.com` can't reach `salesforce-prod` — segment `BLK Cloud ZPA Global` is involved"* → User-flagged specifics: `jdoe@example.com`, `salesforce-prod`, `BLK Cloud ZPA Global`

These tokens have **two downstream uses**:

1. They are load-bearing identifiers that must appear in your hypothesis sources where applicable. Do not paraphrase them away (`WARNING: connection failed` does not become "an error" — it stays the literal string).
2. For any **large evidence file** that needs grep handling (see § Large-file handling below), these tokens are the **default grep patterns**. No inference required.

If the framing has no backticked tokens, set the field to `none`.

**Important — load order in Step 2:** docs first, then snapshot. PROPOSED LOADS at this step lists **only** the reference docs (playbook + methodology + product references). Snapshot enumeration and selection happen in Step 2 *after* the docs are loaded — the docs tell the agent which snapshot files matter (entry points, the chain to traverse), so deciding that without docs in context produces uninformed selection.

#### Output: proposed loads (docs only)

Emit a `**Proposed loads** (Step 2A — docs only; snapshot loads decided in Step 2B after docs are read)` heading followed by a bullet list of paths. The list is **mapping-driven case-relevant knowledge** — playbook + grounding-card matches + framing-matched product references + matching telemetry references under `references/{zia,zpa,zcc}/logs/` only when logs / metrics / SIEM / LSS / NSS or a user-provided evidence path are part of the framing. Do not add files because they might support an ungrounded hypothesis. Cross-cutting agent-instruction docs (methodology, diagnostics template, siem-emission-discipline, tenant-schema-derivation, loading-discipline, clarification-pattern) are on-demand and **do NOT appear here**. **Snapshot files also do not appear** — they are decided in Step 2 after docs are loaded.

- agents/investigator/prompt.md
- agents/investigator/harness.md
- <product references from the mapping table that match Products / features>
- <telemetry reference(s) only if framing involves logs, metrics, SIEM, or explicit evidence>

> **Note:** snapshot enumeration and selection used to live in Step 1; moved to Step 2B after docs load. Docs tell the agent which snapshot files are entry points and which links of the chain matter — selecting without docs in context produces uninformed bulk loads.

#### Framing → file mapping

Multiple rows may match a single framing — **add every matching row** to PROPOSED LOADS, not just the first.

| If the framing mentions… | Add to PROPOSED LOADS |
|---|---|
| SIPA, Source IP Anchoring | `references/shared/source-ip-anchoring.md` |
| App Connector, connector health, connector flap, connector status, connector assignment, health check, health probe, target reachability, eligibility filter, connector selection | `references/zpa/app-connector.md` |
| App Connector Metrics, AliveTargetCount, TargetCount, health reporting cadence, ON_ACCESS, CONTINUOUS | `references/zpa/logs/app-connector-metrics.md` |
| ZPA reachability, private app unreachable, app missing, application not found | `references/zpa/app-segments.md` AND `references/zpa/segment-server-groups.md` AND `references/zpa/policy-precedence.md` |
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
| LSS / NSS log fields, metrics, telemetry schemas | matching reference under `references/{zia,zpa,zcc}/logs/` |

#### Case-intake creation — run the helper before Checkpoint 1

After composing the PARSED FRAMING and PROPOSED LOADS blocks, **immediately run
the artifact creation transaction below before the Checkpoint 1 halt**.
Subsequent steps update the helper-created journal in place; they do not create
a new journal.

**Artifact creation transaction:**

1. Resolve `case_dir` to `<working-directory>/_data/cases/<slug>`.
2. Write the parsed framing to a JSON file.
3. Run the helper exactly, adding one `--proposed-load` per PROPOSED LOADS
   entry:

```bash
node scripts/investigator-artifacts.mjs open-case \
  --root <repo-root> \
  --case-slug <slug> \
  --framing-json <path-to-framing-json> \
  --proposed-load agents/investigator/prompt.md \
  --proposed-load agents/investigator/harness.md
```

4. If the helper reports `Status: blocked` or exits non-zero, halt. Do not load
   docs, enumerate snapshots, or generate hypotheses.
5. If the helper reports `Status: pass`, run:

```bash
node scripts/investigator-artifacts.mjs verify-case \
  --root <repo-root> \
  --case-slug <slug>
```

6. Only after `verify-case` succeeds, emit:
   - `Case intake: <case_dir>/case-intake.md`
   - `Case intake JSON: <case_dir>/case-intake.json`
   - `Journal created: <case_dir>/journal.md`

**Slug selection** (same logic as Step 3B's save):

- If the framing contains an existing path or slug, use that directory and run
  `verify-case` first. If verification passes, this is a load/resume path, not
  a new `open-case` path.
- If the user-referenced or current case directory already has a `journal.md`,
  this is a continuation — run `verify-case` and load/resume that journal.
- Otherwise mint a fresh slug: `<YYYY-MM-DD>-<short-kebab-descriptor>`. Create the directory.
- Do not browse sibling case directories to find a matching prior journal.

**Why helper-backed creation matters.** The agent sometimes skips or mutates the
save action if it begins troubleshooting without a deterministic gate. The Node
helper creates `case-intake.md`, `case-intake.json`, and `journal.md`, refuses
speculative loads, refuses missing proposed-load files, and will not clobber an
existing case unless `--force` is explicitly supplied. Do not hand-write these
artifacts in the Windsurf adapter.

**Working directory precondition still applies.** If `Working directory` is `unknown`, that's a blocking unknown — Step 1 enters pre-Step-1 mode and emits a single working-directory clarification (no other content) before any data emission. The stub cannot be created without a known absolute path; the journal-creation step happens only after the working-directory pre-Step-1 clarification resolves.

**Failure handling.** If JSON write, helper execution, or `verify-case` fails,
do not claim the case intake is ready. Emit `**Case intake not ready:**
<failed transaction step> — <reason>` and make fixing the helper gate the next
checkpoint option. Do not run Step 2 while artifact creation is incomplete.

#### Checkpoint 1 — pre-Step-1 vs full-Step-1 ending

Step 1 has two modes (per § Critical constraints + § Step 1 — pre-Step-1 turn / Step 1 — full turn shapes above). The end of the turn depends on which mode you're in:

- **Pre-Step-1 mode** (a blocking unknown is unresolved): end with the single clarification multi-choice block. That block IS the entire turn — no parsed framing, no proposed loads, no journal-created line, no What's-next?. The multi-choice IS the checkpoint.
- **Full Step 1 mode** (all blocking unknowns are resolved): end with the closing **What's next?** multi-choice. *No Clarification block in this turn.* The What's-next? IS the checkpoint and folds non-blocking concerns (pre-collected logs, assumption corrections, file additions) into its options.

Never bundle the two modes — i.e., never emit parsed framing + proposed loads alongside a clarification block. Pick one shape per turn based on whether any blocking unknown remains.

**Do not load any files. Do not generate hypotheses. Do not output a journal table. Do not run Step 2.** Wait for the user's reply to whichever multi-choice block ended your turn. If the reply names a correction or addition, redo the relevant part of Step 1 (re-emit either the next pre-Step-1 clarification or a refreshed full-Step-1 turn) and re-halt.

---

## 📂 Step 2 — Load files

> **Input:** user-confirmed `PROPOSED LOADS` from Step 1
> **Output:** a `LOADED` block listing every file actually read
> **Halts at:** Checkpoint 2
> **Side effects:** invokes the file-read tool once per path in PROPOSED LOADS

**Precondition:** Step 1's `PROPOSED LOADS` block was produced AND the user replied with explicit confirmation. If either is missing, halt with `Prior step not confirmed — cannot proceed to Step 2` and re-run Step 1.

Step 2 has four sub-steps. **Do them in order — docs first, then snapshot.** Docs in context inform which snapshot files matter; selecting snapshot files without docs loaded produces uninformed bulk loads.

#### 2A — Load the docs from PROPOSED LOADS

For each file in the confirmed PROPOSED LOADS (playbook + framing-matched product references only), **use your file-read tool** to load it. Read the content; do not just enumerate. **Do not eagerly load the on-demand reference docs** listed in `agents/investigator/prompt.md § On-demand references` — those load only when the per-claim trigger condition fires (the `Next evidence needed` column for any Open claim names the specific doc / file / query that closes the gap, and that's when the doc gets loaded).

#### 2B — Enumerate the snapshot directory AND existing evidence (only after 2A completes)

Two enumerations happen at this step. Both are recursive listings; both paste output verbatim as plain monospace paths. Show your command output regardless of result.

**2B.1 — Snapshot.** Tenant snapshots are the canonical source for "what's actually configured" — do not propose live API calls for config the snapshot already has. If `Tenant cloud` was specified in PARSED FRAMING, run a recursive listing of `_data/snapshot/<cloud>/`. Emit a `**Snapshot enumeration** (find _data/snapshot/zs2/ -type f)` heading followed by a bullet list of paths returned:

- _data/snapshot/zs2/zia/url-filtering-rules.json
- _data/snapshot/zs2/zpa/segments.json
- _data/snapshot/zs2/zpa/server-groups.json
- ... <every file the recursive listing returned>

Required commands (use one): `find _data/snapshot/<cloud>/ -type f`, `ls -R _data/snapshot/<cloud>/`, or your file-list tool's recursive option. Only use the fork-specific `_data/<cloud>/` fallback if `_data/snapshot/<cloud>/` itself is absent or empty; do not use `_data/<cloud>/` to fill in a missing product subtree. If `_data/snapshot/zs2/` exists but `_data/snapshot/zs2/zpa/` is absent, report `no ZPA snapshot subtree found for zs2` and continue from references/evidence instead of inferring ZPA state from `_data/snapshot/zs2/zia/`, another cloud, or broad `_data/`. If both canonical and fork-specific cloud paths are empty, show both attempts as plain prose lines: *"Snapshot enumeration (find _data/snapshot/zs2/ -type f): no files returned. Also tried: find _data/zs2/ -type f → no files returned."*

**2B.2 — Existing evidence (log files, prior captures).** Logs the user may have already collected typically live in either:

- `_data/cases/<slug>/evidence/` — if the framing referenced a slug, or one already exists for this investigation
- A user-named directory inside or alongside the working directory

Run a recursive listing of any candidate evidence directory and paste output. Emit a `**Evidence enumeration** (find <working-dir>/_data/cases/<slug>/evidence/ -type f)` heading followed by a bullet list:

- .../evidence/lss-userstatus-2026-04-30T14-30Z.csv
- .../evidence/connector-status-2026-04-30T14-32Z.json
- .../evidence/MANIFEST.md

If the user's clarification about pre-existing logs (from Step 1) named a different path, enumerate that path too. If no evidence directory exists or the paths are empty, show the empty result as a plain line: *"Evidence enumeration (find <working-dir>/_data/cases/<slug>/evidence/ -type f): no files returned."*

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
- In 2C's `**Selected**` list, mark these explicitly:
  - `<small file>` (full read)
  - `<large log — 225MB>` (grep: `'<pattern1>' '<pattern2>'` — file too large for full read)

If you can't derive grep patterns from the framing, halt and ask the user before 2D — *"<file> is <size>; what should I grep for?"* — rather than skipping the file or loading it blind.

#### 2D — Load the selected snapshot files (entry points only)

Use your file-read tool to load each entry-point file selected in 2C. **Do not load other snapshot files at this step**; chain-traversal on subsequent turns will load deeper links as needed.

After all loads complete (docs from 2A + snapshot entry points + existing evidence from 2D), read the operative journal path (`<working-dir>/_data/cases/<slug>/journal.md`) so Step 3 updates the same file. Then output the consolidated LOADED block (template below).

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

Surface results under a `**Grep results — user-flagged specifics in loaded content**` heading, one bullet per token with sub-bullets per match location:

- `BLK Cloud ZPA Global`:
  - _data/snapshot/zs2/zpa/server-groups.json: `.[3].name`, `.[3].applications[2].serverGroups[0].name`
  - references/zpa/segment-server-groups.md:138
- `WARNING: connection failed`:
  - (no matches in loaded content — would need additional logs)

If a User-flagged specific has zero matches across loaded content, that's a finding worth noting — either the token isn't in the loaded data (need on-demand `add:` of additional files) or the token doesn't appear anywhere in scope.

If `User-flagged specifics` is `none` in PARSED FRAMING, skip 2E.

#### Loaded block (output of 2D)

Emit a `**Loaded**` heading followed by a nested bullet list:

- Docs:
  - ✓ agents/investigator/prompt.md
  - ✓ agents/investigator/harness.md
  - ✓ <each product reference>
- Snapshot entry points (one per product):
  - ✓ _data/snapshot/zs2/zpa/application-segments.json (entry point for ZPA chain)
  - Will load on-demand as chain is traversed:
    - server-groups.json (after segment IDs identified)
    - connector-groups.json (after server-group IDs identified)
    - app-connectors.json (after connector-group IDs identified)
- Existing evidence (from operative case dir):
  - ✓ _data/cases/<slug>/journal.md (operative journal)
  - ✓ _data/cases/<slug>/evidence/MANIFEST.md
  - ✓ _data/cases/<slug>/evidence/<log file 1>
  - ✓ _data/cases/<slug>/evidence/<log file 2>
- Skipped (in enumeration but not loaded):
  - <count> snapshot files unrelated to framing — load on-demand
  - <count> evidence files not specified by user — load on-demand if relevant

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

#### Checkpoint 2 — closing multi-choice acts as the checkpoint

End your response with the closing **What's next?** multi-choice block from the Step 2 turn shape above. The user's selection is the checkpoint response. Do not emit a separate `Checkpoint 2 — awaiting user` heading.

**Do not output a journal. Do not generate hypotheses. Do not run Step 3.** Wait for explicit user reply.

---

## 📓 Step 3 — Generate discovery journal AND save to disk

> **Input:** user-confirmed `LOADED` block from Step 2 + the actual file content read in Step 2
> **Output:** a discovery journal table (in chat) + the same journal written to disk
> **Halts at:** Checkpoint 3 (after journal output + save)
> **Side effects:** writes / updates `_data/cases/<slug>/journal.md` via your file-write tool

**Precondition:** Step 2's `LOADED` block was produced AND the user replied with explicit confirmation. If either is missing, halt with `Prior step not confirmed — cannot proceed to Step 3` and re-run the missing step.

#### 3A — Generate the journal

Follow the **First Response procedure in `agents/investigator/prompt.md`** (loaded in Step 2). Generate the discovery journal table per its format. Every claim must cite a source from the `LOADED` block.

**Evidence-basis requirement:** In the `Notes` column, label each hypothesis as
`reference-grounded`, `snapshot-grounded`, `runtime-evidence grounded`, or
`mixed`. Use `Open (likely)` only when loaded tenant snapshot, runtime evidence,
or user-provided evidence points toward that hypothesis. If only product
references were loaded, use `Open (uncertain)` and state `reference-grounded
only; no tenant snapshot or runtime evidence available`.

#### 3B — Save the journal to disk (always; do not ask permission)

After generating the journal in chat, **immediately use your file-write tool** to save the same journal to `<working-directory>/_data/cases/<slug>/journal.md`. This save is unconditional — it is not a yes/no question for the user. Do NOT ask permission to write the file; do NOT defer the save to a later turn.

**Precondition — working directory must be known.** Before invoking the file-write tool, verify the `Working directory` field from PARSED FRAMING is an absolute path (not `unknown`, not a relative path). If it is `unknown` or unresolved, **halt** with:

> `Cannot save journal — working directory unknown. Reply with the absolute path of the repo root (e.g., /Users/<you>/src/gh/<org>/zscaler-skill) and I will retry the save.`

Do NOT attempt the save against a relative path that may resolve nowhere; do NOT silently skip the save and continue.

Use the deterministic save transaction:

1. Write the full rendered journal to `journal_path`.
2. Read `journal_path` back.
3. Verify the readback contains:
   - `# Discovery Journal`
   - `| Claim | Source | Status | Next evidence needed | Timestamp | Notes |`
   - `## Resolution`
4. Only after verification succeeds, emit `Journal saved: <journal_path>`.

The save is part of Step 3 — without write, readback, and marker verification,
Step 3 is incomplete and Checkpoint 3 cannot fire.

**Slug selection:**

- If the user's framing referenced an existing path (e.g., `_data/cases/test-foo/`), use that slug — write to its `journal.md`.
- If the user-referenced or current case directory already has a `journal.md`, this is a continuation — update that file in place.
- Otherwise mint a fresh slug: `<YYYY-MM-DD>-<short-kebab-descriptor>` (e.g., `2026-04-30-ssh-azure-port-22`). Create the directory.
- Do not browse sibling case directories to find a matching prior journal.

**Subsequent turns** update the same file in place — do not create a new file each turn. The working directory established at Step 1 carries forward; do not re-resolve it on subsequent turns.

#### Checkpoint 3 — closing multi-choice acts as the checkpoint

After printing the journal AND saving to disk, end your response with the closing **What's next?** multi-choice block from the Step 3 turn shape above. First response is a plan, not a diagnosis. The user's selection is the checkpoint response.

**Do NOT continue investigating.** Do NOT rule out hypotheses on your own past the initial first-response analysis. Do NOT roll through `Open` claims to produce a final root cause. Wait for the user to direct the next step.

---

## Subsequent turns — repeat the Step 3 cadence every turn

After Step 3's first journal output, **every** subsequent turn in this investigation follows the same per-turn cadence — the halt-and-ask pattern is **recursive**, not one-shot. Apply this on turn 2, turn 3, turn N, until the user marks the investigation complete.

#### Per-turn cadence (do all four, in order, then halt)

1. **Read user direction.** The user replied to the previous turn's closing multi-choice. The selection (or `Other — specify` free-text) names the next action: investigate the top Open hypothesis, focus on a specific one, rule out a specific one with evidence, add a new hypothesis, or pause. Parse it. If it's `pause`, halt without further work — the journal stays saved.
2. **Perform exactly ONE investigation action.** Read one source, run one query, evaluate one piece of evidence. **Do NOT** batch multiple hypothesis investigations into one turn. **Do NOT** rule out a hypothesis you weren't directed to investigate.
3. **Update the journal.** Print the updated journal table in chat (with claim status changes, new evidence, dismissed hypotheses if any). Then **immediately save the updated journal** to `_data/cases/<slug>/journal.md` using your file-write tool — same path as Step 3B, no permission asked.
4. **Halt with the closing multi-choice.** End your response with the same **What's next?** multi-choice from the Step 3 turn shape (using options that fit the current state — e.g., if all hypotheses except one are ruled out, the menu can name the remaining one as the next focus). Wait for the user.

**This cadence applies until the user explicitly closes the investigation** with `pause` or `done` (a status of `Resolved` on the root cause claim with the user's confirmation that the resolution holds). Until then, every response is one action + journal update + halt — never a rolling investigation that resolves multiple hypotheses without user direction.

If you find yourself about to write a response that ① touches more than one hypothesis OR ② omits the journal save OR ③ omits the closing multi-choice halt, **stop**. You are off-cadence. Reset to the four-step structure above.
