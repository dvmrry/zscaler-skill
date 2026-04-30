---
description: "[A/B TEST VARIANT] Experimental copy of /z-investigate for iterating on doc-load reliability. Use this for testing changes; production version remains /z-investigate."
---

# /z-investigate-test

## ⚠️ How to read this workflow

This file is **procedure, not guidance**. Every instruction is mandatory. Specifically:

- **No shortcuts.** Do not skip a step because you think you already know the answer. Do not skip a file load because the topic seems familiar. Do not skip a checkpoint because the previous step "felt" complete. The procedure exists because shortcuts produce confidently wrong output.
- **No summarizing from memory.** When the procedure says "use your file-read tool to load X," you must actually invoke the read tool. Reciting what you remember about X is not equivalent and is a procedure violation.
- **No fuzzy interpretation.** "Use your file-read tool to load X" means invoke the tool. "If framing mentions Y, load Z" means: check, and if yes, invoke the tool. There is no third interpretation.
- **Visible accountability.** Every checkpoint requires a YES/NO self-check. The first response begins with a `Grounding files loaded:` block listing every file actually read. Skipping is allowed to be visible — it is not allowed to be silent.

You are starting an investigation. **This workflow has three steps and three CHECKPOINTS. Each CHECKPOINT is a hard gate — you cannot proceed past it without completing the work above. Skipping a CHECKPOINT is a procedure violation.**

---

## Step 1 — Read the user's framing (in chat)

The user's investigation framing follows this command in the chat. Read it now. Identify:

- **What's failing** — destination, port, segment, app
- **Products / features mentioned** — App Connector, SIPA, segments, URL filtering, SSL inspection, Service Edge, etc.
- **Tenant cloud** — `zs1` / `zs2` / `zs3` / etc., inferable from the API base URL or framed by the user
- **Scope and recency** — one user / many users / all users; since when

If the framing is below minimum (no symptom + no scope), ask one targeted clarifying question and stop. Do not proceed to Step 2.

### 🛑 CHECKPOINT 1 — DO NOT PASS WITHOUT COMPLETING

Before continuing to Step 2, mentally answer:

- Have I read the user's framing? **YES / NO**
- Have I identified the products / features mentioned in the framing? **YES / NO**
- Have I identified the tenant cloud (or noted that it's not specified)? **YES / NO**

**If any answer is NO, stop here and complete Step 1.** Do not generate hypotheses. Do not load files until this checkpoint passes.

---

## Step 2 — Load required files NOW, in order

**Use your file-read tool for every file below.** Do not skip. Do not summarize from memory. Every file in 2A is mandatory; every row in 2B that matches the framing is mandatory; every applicable file in 2C is mandatory.

### 2A. Playbook + methodology (always load both)

1. **Use your file-read tool to load `references/shared/investigate-prompt.md`.** Playbook — First Response procedure, status enums, output format.
2. **Use your file-read tool to load `references/shared/troubleshooting-methodology.md`.** Methodology — confidence-tiered claim status, anti-patterns, escalation criteria.

### 2B. Product / feature references (load every row whose framing matches what you identified in Step 1)

**Multiple rows may match a single framing. Load every matching row — not just the first one.** A framing that mentions both "App Connector" and "segment" must load BOTH the connector reference AND the segment reference. Stopping after one match is a procedure violation.

| If the framing mentions... | Use your file-read tool to load |
|---|---|
| SIPA, Source IP Anchoring | `references/shared/source-ip-anchoring.md` |
| App Connector, connector health, connector flap, connector status, connector assignment, health check, health checks, health probe, reachability probe, target reachability, eligibility filter, connector selection | `references/zpa/app-connector.md` |
| App Connector Metrics, AliveTargetCount, TargetCount, health reporting cadence, ON_ACCESS, CONTINUOUS | `references/zpa/logs/app-connector-metrics.md` |
| ZPA segment, app segment, application segment, segment scope, `health_reporting` setting | `references/zpa/app-segments.md` |
| ZPA policy, access policy, policy precedence, policy evaluation | `references/zpa/policy-precedence.md` |
| Server group | `references/zpa/segment-server-groups.md` |
| ZIA URL filtering, URL category, allow rule, block rule | `references/zia/url-filtering.md` |
| SSL inspection, TLS inspection, inspection bypass | `references/zia/ssl-inspection.md` |
| ZCC, Zscaler Client Connector, Z-Tunnel, forwarding profile | `references/zcc/index.md` (start here) |
| Service Edge, ZEN, broker, Public Service Edge | `references/shared/cloud-architecture.md` and `references/shared/terminology.md` |
| Private Service Edge, PSE, PSEN | `references/zia/private-service-edge.md` |
| Cloud Connector, Branch Connector | `references/cloud-connector/index.md` (start here) |
| ZDX probe, deeptrace, Cloud Path | `references/zdx/index.md` (start here) |
| ZIdentity, OneAPI, Authentication Level, step-up auth | `references/zidentity/index.md` (start here) |
| LSS / NSS log fields, log schema, specific field names | the matching schema file under `references/{zia,zpa,zcc}/logs/` |

If a product is mentioned that's not in this table, use your file-read tool to load `references/<product>/index.md` first, then load the specific file from there.

### 2C. Existing on-disk evidence

1. If the framing names a directory or slug (e.g., `_data/incidents/test-foo/`), use your file-read tool to load that directory's `journal.md` (if exists) and `evidence/MANIFEST.md` (if exists).
2. List `_data/snapshot/` and use your file-read tool to load any per-cloud subdir whose cloud matches the framing's tenant. Forks may use `_data/<cloud>/` directly without the `snapshot/` prefix — check both.

### 🛑 CHECKPOINT 2 — DO NOT PASS WITHOUT COMPLETING ALL LOADS

Before continuing to Step 3, mentally answer:

- Did I use my file-read tool to load `references/shared/investigate-prompt.md`? **YES / NO**
- Did I use my file-read tool to load `references/shared/troubleshooting-methodology.md`? **YES / NO**
- For every product / feature I identified in Step 1, did I load every matching file from the 2B table? **YES / NO** (if no products applied, this is a vacuous YES — but state that explicitly)
- Did I check `_data/snapshot/` for tenant config and load applicable files in 2C? **YES / NO**

**If any answer is NO, STOP. Go back and complete the loads. Do not generate hypotheses. Do not output a journal. Do not respond until this checkpoint passes.**

---

## Step 3 — Output the first response

You loaded the playbook in 2A. Now follow its First Response steps starting at "Step 1: Parse the user's framing into the journal ISSUE field." The playbook's own Step 2 grounding section assumes you already did Step 2 here in the workflow — treat it as a verification checklist, not a fresh load.

### 🛑 CHECKPOINT 3 — Output format (do this BEFORE the journal)

Your first response **must start with** a `Grounding files loaded:` block. This is the first thing the user sees. Example:

```
Grounding files loaded:
  - references/shared/investigate-prompt.md
  - references/shared/troubleshooting-methodology.md
  - references/shared/source-ip-anchoring.md
  - references/zpa/app-connector.md
  - _data/snapshot/zs3/connector-groups.json
```

If 2B and 2C produced zero matches, list only the 2A files. If you somehow loaded zero files, output `Grounding files loaded: none — proceeding from memory` so the user knows to intervene immediately.

**After the Grounding block**, output the discovery journal table per the playbook's format. The first response is a plan, not a diagnosis — do not investigate yet. If location, time, or scope is ambiguous, ask one targeted clarifying question instead.

---

## Best framing for the user's input (reference)

A well-framed `/z-investigate` invocation lets the playbook skip the clarifying-question round-trip:

- **What's failing** — destination/port/app/segment
- **Where** — location, segment, user/group, connector group
- **Scope** — one user / many in one location / all users / one connector
- **When first observed** — timestamp or relative time
- **What works** — adjacent successes that narrow hypotheses (e.g., port 443 succeeds, other locations unaffected)

Minimum viable: *what fails* + *where* + *what works*.
