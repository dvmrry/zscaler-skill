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

## Critical constraints (apply during all steps, regardless of which references load)

These are load-bearing facts that survive whether or not the corresponding reference file ends up in PROPOSED LOADS. Internalize them before any reasoning. **If you find yourself reasoning against any of these, stop — you are off-track.**

- **ZENs / Public Service Edges / brokers are Zscaler-managed cloud infrastructure.** Tenants cannot configure them, select them, or modify them. Do NOT search tenant snapshots (`_data/snapshot/...`) for ZEN configuration — there is none to find. ZEN values in logs are diagnostic (*which* Zscaler-operated edge handled this session), not actionable. The customer-controlled equivalents are **App Connectors** (`Connector`, `ConnectorIP`, `ConnectorPort` fields). If a hypothesis depends on tenant-side ZEN configuration, it is invalid — discard and re-frame.
- **Connector eligibility gates session assignment in ZPA.** Connectors are filtered by `CONNECTED` status + target reachability (`AliveTargetCount` includes the target) + group association (Server Group → App Connector Group) BEFORE latency-based selection picks among survivors. An LSS record with an empty `Connector` field means no connector was assigned — eligibility filtering rejected every candidate. Do not hypothesize about the connector-to-app hop in that case; the fix is on the eligibility side.
- **Tenant snapshots are the canonical "what's actually configured" source.** When the framing names a cloud, enumerate `_data/snapshot/<cloud>/` recursively; do not propose live API calls for config the snapshot already has. (See Snapshot enumeration in Step 1.)

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
```

#### Output: data block 2 (PROPOSED LOADS)

Print verbatim, with the bracketed lines expanded into specific paths:

```
PROPOSED LOADS (will load in Step 2 — do NOT load now):
  - references/shared/investigate-prompt.md
  - references/shared/troubleshooting-methodology.md
  - <product references from the mapping table that match Products / features>
  - <each file enumerated from _data/snapshot/<cloud>/ — see Snapshot enumeration>
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

#### Snapshot enumeration (when tenant cloud is specified)

You must run a **recursive** listing of `_data/snapshot/<cloud>/` and **paste the actual command output** into PROPOSED LOADS. Do NOT report empty without showing the command result.

Required: run one of these and capture output verbatim:

- `find _data/snapshot/<cloud>/ -type f` (preferred — flat list of files only)
- `ls -R _data/snapshot/<cloud>/`
- your file-list tool's recursive option

Format your output as:

```
Snapshot enumeration (find _data/snapshot/zs3/ -type f):
  - _data/snapshot/zs3/zia/url-filtering-rules.json
  - _data/snapshot/zs3/zia/access-policies.json
  - _data/snapshot/zs3/zpa/connector-groups.json
  - _data/snapshot/zs3/zpa/segments.json
```

If the command genuinely returns no files, output the empty result explicitly:

```
Snapshot enumeration (find _data/snapshot/zs3/ -type f): no files returned.
Also tried: find _data/zs3/ -type f → no files returned.
```

This makes the difference between "I checked and it's empty" and "I didn't check and assumed empty" visible to the user.

- The directory typically has nested per-product subdirs (`zia/`, `zpa/`, `zdx/`). The recursive command finds all nested files automatically; a non-recursive `ls` only shows the top-level subdir names and is **wrong** for this purpose.
- Add each file in the find output to PROPOSED LOADS individually — not the directory path.
- If `_data/snapshot/<cloud>/` returns nothing, also try the fork-specific layout `_data/<cloud>/` (some forks omit the `snapshot/` prefix). Show both attempts in your output if both are empty.

#### Framing → file mapping

Multiple rows may match a single framing — **add every matching row** to PROPOSED LOADS, not just the first.

| If the framing mentions… | Add to PROPOSED LOADS |
|---|---|
| SIPA, Source IP Anchoring | `references/shared/source-ip-anchoring.md` |
| App Connector, connector health, connector flap, connector status, connector assignment, health check, health probe, target reachability, eligibility filter, connector selection | `references/zpa/app-connector.md` |
| App Connector Metrics, AliveTargetCount, TargetCount, health reporting cadence, ON_ACCESS, CONTINUOUS | `references/zpa/logs/app-connector-metrics.md` |
| ZPA segment, app segment, application segment, segment scope, `health_reporting` setting | `references/zpa/app-segments.md` |
| ZPA policy, access policy, policy precedence, policy evaluation | `references/zpa/policy-precedence.md` |
| Server group | `references/zpa/segment-server-groups.md` |
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

For each file in the confirmed PROPOSED LOADS, **use your file-read tool** to load it. After all loads complete, output:

```
LOADED:
  ✓ <path 1>
  ✓ <path 2>
  ✗ <path 3>  (FAILED: <reason>)
  ...
```

If any load fails (file not found, permission denied, parse error), mark it with `✗` and the reason; continue with the remaining loads. Do NOT skip a file silently.

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

## 📓 Step 3 — Generate discovery journal

> **Input:** user-confirmed `LOADED` block from Step 2 + the actual file content read in Step 2
> **Output:** a discovery journal table per the playbook
> **Halts at:** end of first response (further turns continue investigation)

**Precondition:** Step 2's `LOADED` block was produced AND the user replied with explicit confirmation. If either is missing, halt with `Prior step not confirmed — cannot proceed to Step 3` and re-run the missing step.

Now follow the **First Response procedure in `references/shared/investigate-prompt.md`** (loaded in Step 2). Generate the discovery journal table per its format. Every claim must cite a source from the `LOADED` block.

**The first response is a plan, not a diagnosis.** Do not investigate yet — establish the hypothesis space and named evidence sources first. Subsequent turns continue the investigation.
