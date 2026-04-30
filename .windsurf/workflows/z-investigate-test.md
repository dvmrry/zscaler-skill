---
description: "[A/B TEST VARIANT] Experimental copy of /z-investigate for iterating on doc-load reliability. Use this for testing changes; production version remains /z-investigate."
---

# /z-investigate-test

## Procedure model

This workflow has three sequential steps. **Each step's input is the prior step's confirmed output.** You cannot run a step without the prior step's output AND explicit user confirmation. At each checkpoint, halt and wait for the user to confirm — do not assume confirmation, do not improvise past a checkpoint, do not run a step without the input it depends on.

If the prior step's output is missing or incomplete, do not start the next step — output "Prior step not confirmed" and ask the user what to do.

---

## Critical constraints (apply during all steps, regardless of which references load)

These are load-bearing facts that survive whether or not the corresponding reference file ends up in PROPOSED LOADS. Internalize them before any reasoning. **If you find yourself reasoning against any of these, stop — you are off-track.**

- **ZENs / Public Service Edges / brokers are Zscaler-managed cloud infrastructure.** Tenants cannot configure them, select them, or modify them. Do NOT search tenant snapshots (`_data/snapshot/...`) for ZEN configuration — there is none to find. ZEN values in logs are diagnostic (*which* Zscaler-operated edge handled this session), not actionable. The customer-controlled equivalents are **App Connectors** (`Connector`, `ConnectorIP`, `ConnectorPort` fields). If a hypothesis depends on tenant-side ZEN configuration, it is invalid — discard and re-frame.
- **Connector eligibility gates session assignment in ZPA.** Connectors are filtered by `CONNECTED` status + target reachability (`AliveTargetCount` includes the target) + group association (Server Group → App Connector Group) BEFORE latency-based selection picks among survivors. An LSS record with an empty `Connector` field means no connector was assigned — eligibility filtering rejected every candidate. Do not hypothesize about the connector-to-app hop in that case; the fix is on the eligibility side.
- **Tenant snapshots are the canonical "what's actually configured" source.** When the framing names a cloud, enumerate `_data/snapshot/<cloud>/` recursively; do not propose live API calls for config the snapshot already has. (See Snapshot enumeration in Step 1.)

---

## Step 1 — Parse framing (input: user's chat message)

Read the user's framing from the chat. **Output** this block, filling in the bracketed fields. Do not load any files in this step.

```
PARSED FRAMING:
- Symptom: <what's failing>
- Tenant cloud: <zs1/zs2/zs3 or "not specified">
- Products / features mentioned: <comma-separated, or "none">
- Scope: <one user / many / all / unclear>
- Recency: <when first observed, or "not specified">

CLARIFICATIONS NEEDED:
- <one targeted question, if framing is below minimum; otherwise "none">

PROPOSED LOADS (will load in Step 2 — do NOT load now):
- references/shared/investigate-prompt.md
- references/shared/troubleshooting-methodology.md
- <product references from the mapping table below that match Products / features>
- <every file enumerated under _data/snapshot/<cloud>/ — see "Snapshot enumeration" below for how to list them>
```

### Snapshot enumeration (if tenant cloud is specified)

When the framing names a tenant cloud (zs1 / zs2 / zs3 / etc.), you must enumerate `_data/snapshot/<cloud>/` **recursively** and add each individual file path to PROPOSED LOADS — not the directory path itself.

- Use a **recursive** listing: `find _data/snapshot/<cloud>/ -type f`, or `ls -R _data/snapshot/<cloud>/`, or your file-list tool's recursive option. A non-recursive `ls` will only show top-level subdirectories (e.g., `zia/`, `zpa/`) and miss the actual files inside them.
- The directory typically has nested per-product subdirs (`zia/`, `zpa/`, `zdx/`, etc.). Descend into every one.
- Add **each individual file path** to PROPOSED LOADS, one per line. Do NOT abbreviate as a directory.
- If `_data/snapshot/<cloud>/` doesn't exist or is empty, also try the fork-specific layout `_data/<cloud>/` (some forks omit the `snapshot/` prefix). If both are empty, list `_data/snapshot/ — empty` in PROPOSED LOADS so the user knows the snapshot is missing rather than that you skipped it.

Example PROPOSED LOADS additions (snapshot section) when cloud = zs3:

```
- _data/snapshot/zs3/zia/url-filtering-rules.json
- _data/snapshot/zs3/zia/access-policies.json
- _data/snapshot/zs3/zpa/connector-groups.json
- _data/snapshot/zs3/zpa/segments.json
```

### Framing → file mapping (use this to compose PROPOSED LOADS)

| If the framing mentions... | Add to PROPOSED LOADS |
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
| LSS / NSS log fields, log schema | the matching schema under `references/{zia,zpa,zcc}/logs/` |

Multiple rows may match a single framing. Add every matching row.

### 🛑 Checkpoint 1 — halt and wait

After printing the PARSED FRAMING / CLARIFICATIONS / PROPOSED LOADS block, end your response with literally this line:

```
Awaiting confirmation. Reply "go" to load the proposed files, or correct any field above and I'll revise.
```

**Do not load any files. Do not generate hypotheses. Do not output a journal. Do not run Step 2.** Wait for the user to reply with one of: `go`, `yes`, `proceed`, `confirm`. If the user replies with corrections instead, re-do Step 1 incorporating them and ask for confirmation again.

---

## Step 2 — Load files (input: user-confirmed PROPOSED LOADS from Step 1)

**Precondition:** Step 1's PROPOSED LOADS block was produced AND the user replied with explicit confirmation. If either is missing, halt with "Prior step not confirmed — cannot proceed to Step 2" and re-run Step 1.

For each file in the confirmed PROPOSED LOADS list, use your file-read tool to load it. After all loads complete, output:

```
LOADED:
- <path 1>
- <path 2>
- ...
```

If any load fails (file not found, permission denied), include it in the LOADED list with a `(FAILED: <reason>)` suffix and continue with the rest.

### 🛑 Checkpoint 2 — halt and wait

End your response with literally this line:

```
All files loaded. Reply "go" to proceed to the discovery journal, or tell me what to load next / differently.
```

**Do not output a journal. Do not generate hypotheses. Do not run Step 3.** Wait for the user to reply with explicit confirmation.

---

## Step 3 — Output discovery journal (input: confirmed LOADED content from Step 2)

**Precondition:** Step 2's LOADED list was produced AND the user replied with explicit confirmation. If either is missing, halt with "Prior step not confirmed — cannot proceed to Step 3."

Now follow the playbook's First Response procedure (you loaded `references/shared/investigate-prompt.md` in Step 2). Generate the discovery journal table per its format. Every claim must cite a source from the LOADED list.

The first response is a plan, not a diagnosis. Do not investigate yet.
