---
description: "[A/B TEST VARIANT] Experimental copy of /z-investigate for iterating on doc-load reliability. Use this for testing changes; production version remains /z-investigate."
---

# /z-investigate-test

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
- ZPA session assignment is gated by connector eligibility — an empty `Connector` field in LSS means no connector was assigned; the fix is on the eligibility side, not the connector-to-app hop.

---

## 📋 Step 1 — Parse framing

> **Input:** the user's framing in chat (next message)
> **Output:** a `PARSED FRAMING` block + a `PROPOSED LOADS` block (templates below)
> **Halts at:** Checkpoint 1
> **In context at this step:** the workflow body (this file) + the user's framing message. No `file-read` tool invocations happen here; actual file loads run in Step 2.

Read the framing. Compose the data blocks below by filling in the bracketed fields. Use the **Framing → file mapping** to populate `PROPOSED LOADS`. Snapshot enumeration runs in Step 2B after docs are loaded — do not enumerate the snapshot here.

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
```

The `Working directory` field is the absolute path the workflow's relative paths (`references/...`, `_data/incidents/...`) resolve against. Infer from the workspace context if you can; if you cannot determine it confidently, set it to `unknown` — that triggers a required clarification (see below). Do **not** guess; do **not** assume `.` will resolve correctly at file-write time.

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

**2B.1 — Snapshot.** Tenant snapshots are the canonical source for "what's actually configured" — do not propose live API calls for config the snapshot already has. If `Tenant cloud` was specified in PARSED FRAMING, run a recursive listing of `_data/snapshot/<cloud>/` (or `_data/<cloud>/` for the fork-specific layout). **Print every path the command returns — no truncation, no `...`, no abbreviation.** The enumeration block must be a complete, exhaustive list:

```
Snapshot enumeration (find _data/snapshot/zs3/ -type f):
  - _data/snapshot/zs3/zia/url-filtering-rules.json
  - _data/snapshot/zs3/zpa/segments.json
  - _data/snapshot/zs3/zpa/server-groups.json
  <every file the recursive listing returned, listed in full>
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

2C is **selection only — no file loads happen here**. Loads run in 2D after the SELECTED block is printed. Do not conflate the two.

Now that docs are loaded, use them along with the entry-point rules below to pick a single starting snapshot file per product. Bulk-loading every snapshot file for a product blows the context budget; chain-traverse the rest on demand.

**Snapshot entry points (one per product mentioned in framing):**

| If `Products / features` includes... | Single entry-point file |
|---|---|
| Anything ZPA-related (segment, server group, connector, policy, SIPA) | `<cloud>/zpa/application-segments.json` (or `segments.json`) — segments are the natural entry; server-groups / connector-groups / policies load on demand |
| Anything ZIA URL-filtering related | `<cloud>/zia/url-filtering-rules.json` — categories, advanced policy on demand |
| Anything ZIA SSL-inspection related | `<cloud>/zia/ssl-inspection-rules.json` (or similarly named) |
| Anything ZIA DLP related | `<cloud>/zia/dlp-rules.json` — dictionaries, engines on demand |
| Anything ZCC-related (forwarding, app profiles, posture) | `<cloud>/zcc/forwarding-profiles.json` (or whichever profile file most closely matches) |
| Anything else / unsure | one file whose name most closely matches the central concept; or skip and add on-demand |

If the docs you loaded in 2A name a more specific entry point than the table suggests, prefer the docs' guidance — they are more current.

**Existing evidence files (from 2B.2 enumeration):** include every log / capture / dump the user identified as relevant in their Step 1 clarification reply, plus any `MANIFEST.md` files in the evidence directories. These are direct evidence — small files, high relevance. If the evidence directory has many large files (e.g., a packet capture > 100MB), preview the manifest first and select specific files based on what the user named or what the docs say is relevant.

**Output the SELECTED block before 2D loads.** The block lists every file 2D will read, with a one-line reason. The user reads this block to verify the selection plan; 2D only runs against this list.

```
SELECTED (entry points + evidence — files 2D will load):
  - _data/snapshot/zs3/zpa/application-segments.json   reason: ZPA chain entry point (segment is the natural start)
  - _data/incidents/<slug>/evidence/MANIFEST.md         reason: catalog of pre-collected evidence
  - _data/incidents/<slug>/evidence/<log file>          reason: user-identified pre-collected log
```

**Verification rule.** Every path in SELECTED must appear in the 2B enumeration above (snapshot enumeration OR evidence enumeration). If a path you want to select is not in the enumeration, that's a procedure violation — halt and re-run enumeration. Do not load files that aren't enumerated.

#### 2D — Load the selected snapshot + evidence files

Use your file-read tool to load **exactly** the files listed in 2C's SELECTED block — no more, no fewer. **Do not load files that aren't in SELECTED**; chain-traversal on subsequent turns will load deeper links as needed via `add: <path>` at Checkpoint 3.

If during loading you realize an additional file is needed, do NOT load it on your own — halt at Checkpoint 2 and let the user direct via `add:`.

After all loads complete (docs from 2A + snapshot entry points + existing evidence from 2D), output the consolidated LOADED block:

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
