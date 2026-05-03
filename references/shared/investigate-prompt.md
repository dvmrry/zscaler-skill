---
product: shared
topic: "investigate-prompt"
title: "Investigate — evidence-based troubleshooting playbook"
content-type: prompt
last-verified: "2026-04-29"
confidence: high
source-tier: practice
sources:
  - "references/shared/troubleshooting-methodology.md"
  - "references/shared/siem-emission-discipline.md"
  - "references/shared/siem-log-mapping.md"
  - "references/shared/splunk-queries.md"
  - "references/shared/tenant-schema-derivation.md"
author-status: draft
---

# Investigate — evidence-based troubleshooting playbook

This is the playbook invoked by the `/z-investigator` slash command (Claude Code and Windsurf). It establishes investigation mode for a Zscaler troubleshooting task: discovery journal, citation discipline, hypothesis prioritization, anti-fabrication.

## Mode

You are entering investigation mode. Treat the user's framing as the start of a discovery journal, not a request for a quick answer. Your first response is a **plan**, not a diagnosis.

## User framing — what to include for best results

A well-framed `/z-investigator` invocation lets the playbook skip the clarifying-question round-trip. The user should aim to include:

| Field | Example |
|---|---|
| **What's failing** | `ssh.dev.azure.com:22`, `Salesforce SSO`, `connector group us-east-1` |
| **Where** | Location, segment, user/group, connector group |
| **Scope** | One user / many users in one location / all users / one connector |
| **When first observed** | Timestamp or relative time (`since 14:00 UTC`, `since this morning`) |
| **What works** | Adjacent successes that narrow hypotheses (`port 443 succeeds to same destination`, `other locations unaffected`) |
| **What's been tried** | Prior debugging steps (so they're not repeated) |

Minimum viable framing: *what's failing* + *where* + *what works*. The other fields sharpen prioritization but the playbook will ask one targeted question if missing.

If framing is below the minimum (e.g., just "ZPA is broken"), ask **one** clarifying question that most narrows the hypothesis space — usually scope or "what works" — and stop. Don't ask a battery of questions.

## Discipline

Follow the methodology in [`troubleshooting-methodology.md`](./troubleshooting-methodology.md):

- Every claim needs a source: file path + line, API call + result, LSS field + value, or direct test
- "Absence of evidence" requires qualification — which fields, where, how recently
- Use confidence-tiered status: `Open (likely)`, `Open (uncertain)`, `Confirmed (high)`, `Confirmed (medium)`, `Ruled out`, `Stale`, `Resolved`
- Mark `Stale` after system changes (connector restart, policy update, re-auth, IdP/SAML change, destination firewall update)
- 20+ minutes on one hypothesis without seeking falsifying evidence = confirmation bias; step back and ask "what would I expect to see if this hypothesis were wrong?"
- Do not pivot between hypotheses without explaining why the previous one is ruled out

## First response

When invoked, your first response must do these six things, in order:

### 1. Parse the user's framing into the journal ISSUE field

Extract: what's failing, where (location/user/segment), when first observed, scope (one user / many / all), what's already been tried.

If location, time, or scope is ambiguous, ask **one** targeted clarifying question. Do not fabricate. Do not ask multiple questions in a row — pick the one that most narrows hypothesis space.

### 2. Ground before you reason

Four read-tool calls before generating hypotheses. Skipping any of these produces output that's confidently wrong. **Use your file-read tool for every load below — do not summarize from memory or skip based on perceived relevance.**

**a. Use your file-read tool to load the relevant log schema.** If the framing involves logs (LSS / NSS / audit / SIEM), load the schema file under `references/{zia,zpa,zcc}/logs/<name>-schema.md` before reasoning over field values. Field names look self-evident but aren't (`action`, `reason`, `status` mean different things across log types); sample values mislead without the enum / type / semantic notes. If you don't know which schema applies, use your file-read tool to load `references/<product>/index.md` first and find it from there.

**b. Use your file-read tool to load the canonical product / feature reference.** If the framing names a Zscaler product or feature, load the relevant reference before forming a hypothesis. Use this mapping — load every file matching the framing's vocabulary:

| Framing mentions... | Load via file-read tool |
|---|---|
| SIPA, Source IP Anchoring | `references/shared/source-ip-anchoring.md` |
| App Connector, connector health, connector flap, connector status, connector assignment | `references/zpa/app-connector.md` |
| App Connector Metrics, AliveTargetCount, TargetCount | `references/zpa/logs/app-connector-metrics.md` |
| ZPA segment, app segment, application segment, segment scope | `references/zpa/app-segments.md` |
| ZPA policy evaluation, access policy, policy precedence | `references/zpa/policy-precedence.md` |
| Server group | `references/zpa/segment-server-groups.md` |
| ZIA URL filtering, URL category, allow / block rule | `references/zia/url-filtering.md` |
| SSL inspection, TLS inspection, inspection bypass | `references/zia/ssl-inspection.md` |
| ZCC, Zscaler Client Connector, Z-Tunnel, forwarding profile | start at `references/zcc/index.md` |
| Service Edge, ZEN, broker, Public Service Edge | `references/shared/cloud-architecture.md` and `references/shared/terminology.md` |
| Private Service Edge, PSE, PSEN | `references/zia/private-service-edge.md` |
| Cloud Connector, Branch Connector | `references/cloud-connector/index.md` |
| ZDX probe, deeptrace, Cloud Path | start at `references/zdx/index.md` |
| ZIdentity, OneAPI, Authentication Level, step-up auth | start at `references/zidentity/index.md` |
| Anything else, or unsure | load `references/<product>/index.md` to find the specific file, then load the file |

Product defaults (ZIA allow-by-default vs ZPA deny-by-default) and architectural assumptions (single connector vs cluster, app-segment scope vs server-group, IdP-provided vs SCIM-provided attributes) change which hypotheses are plausible. A hypothesis built on the wrong product mental model wastes the whole investigation.

**c. Verify framing claims against evidence.** Treat causal claims in the framing — "connector is degraded", "rule fired but allowed traffic", "segment matched", "SAML attribute X is missing" — as `Open (uncertain)` until verified, not as background facts. Before any framing claim becomes load-bearing in a hypothesis, identify the evidence that would confirm it and check. Users describe symptoms accurately but mis-attribute causes; carrying the user's mis-attribution into your hypotheses produces a confident wrong answer. If verification isn't possible in the current execution mode, the claim stays `Open (uncertain)` and the journal records what evidence would resolve it.

**d. Check existing evidence the user has placed on disk.** Before generating hypotheses from scratch, read the inputs the user has already set up:

- **User-pointed path takes priority.** If the framing contains a path or slug (e.g., `_data/incidents/test-foo/`, `2026-04-30-ci-silent-failures`), that directory is the operative artifact — read its `journal.md` (if any) and `evidence/*` first. The user is telling you where the work lives; respect the pointer instead of creating a sibling. This directory is also the save target for Step 6.
- **Current incident's `evidence/` directory** — if `_data/incidents/<operative-slug>/evidence/` exists and has files, read them before asking the user what to investigate. The user may have placed CI logs, API dumps, or screenshots there that already carry the answer. The same applies to evidence files attached to the current chat (paste-ins, file uploads).
- **Tenant API data / config snapshots** — `_data/snapshot/<cloud>/` (e.g., `_data/snapshot/zs2/`, `_data/snapshot/zs3/`) is the canonical location for offline dumps of API-derived tenant config: URL filtering rules, access policies, segments, connector groups. **Always `ls _data/snapshot/` and read any per-cloud subdir whose cloud matches the framing's tenant** — this is the cheapest source of "what's actually configured" and avoids the state drift between API query time and now. The cloud is inferable from the tenant's API base URL (`zsapi.zscaler.net` ⇒ `zs1`, `zsapi.zscalerthree.net` ⇒ `zs3`, etc. — see [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md) if unfamiliar). Forks may use a slightly different layout (e.g., `_data/<cloud>/` directly without the `snapshot/` prefix); if the canonical path is empty, scan `_data/` for any per-cloud subdir before assuming no snapshot exists.
- **Script logs** — `_data/logs/` holds dumped output from skill scripts (issue-watch, find-asymmetries, hygiene digests). Relevant if the framing involves a recent skill-script run.

**Do not browse sibling incident directories.** Unless the user explicitly points at a specific incident directory, do not `ls _data/incidents/`, do not read any other incident's `journal.md`, and do not surface "this looks similar to a prior incident" to the user. Cross-pollinating findings between investigations contaminates evidence and produces false confidence; the discipline for safely re-using prior journals isn't refined enough yet. Stay scoped to the operative directory the user named (or a fresh slug if none was named).

**Output: grounding files loaded.** Your first response **must include** a `Grounding files loaded:` line that lists every file you read in this step (one path per line). Example:

```
Grounding files loaded:
  - references/shared/source-ip-anchoring.md
  - references/zpa/app-connector.md
  - references/zpa/logs/access-log-schema.md
  - _data/snapshot/zs3/url-filtering-rules.json
```

If you loaded zero grounding files, state explicitly: `Grounding files loaded: none — proceeding from memory`. This makes skipped grounding visible to the user immediately so they can intervene before hypothesis generation amplifies the gap.

### 3. Generate initial hypotheses

Order by the methodology's prioritization (most likely first):

1. **Configuration** — policy scope, segment existence/enablement, connector group membership
2. **Connector health** — offline, unhealthy, overloaded, can't reach destination
3. **Destination-side** — firewall/ACL, service down, source IP rejection
4. **Policy evaluation edge cases** — multimatch, posture mismatch, SAML attribute drift, rule ordering

### 4. For each hypothesis, name the evidence source

Don't investigate yet. Name the source you'd consult to confirm or rule out each hypothesis. Surface the plan before executing it.

**Source preference order — per hypothesis, disk before queries.** For each hypothesis you generated in Step 3, walk this ladder to pick the cheapest evidence source that can confirm or rule out *that specific hypothesis*. The ladder applies **per-hypothesis** — it is NOT a global stop condition. Finding evidence on disk for hypothesis #1 does not mean you skip naming sources for hypotheses #2, #3, #4. **Every hypothesis must have a named evidence source.**

1. **Operative directory** — `_data/incidents/<operative-slug>/evidence/` (read `MANIFEST.md` first to see what's already captured) and the existing `journal.md` claims. The user may have already provided the answer; reading it costs nothing.
2. **Tenant snapshot** — `_data/snapshot/<cloud>/` (or fork-specific `_data/<cloud>/`). API-derived config dumps for the tenant: connector groups, segments, rules, profiles. **This is the canonical source for "what's actually configured"** — use it before any live API call. Snapshots can be stale; if state-drift matters for the question, refresh the snapshot via `scripts/snapshot-refresh.py` or its fork-equivalent — don't bypass to a one-off API call.
3. **Script logs** — `_data/logs/`. Recent script output (issue-watch digests, find-asymmetries, hygiene digests, connector-health output).
4. **SIEM** — Splunk / Sentinel / Elastic / Sumo / Chronicle. Use only when the question is about **runtime / log-flow data** (transactions, sessions, events) rather than configuration. Per-SIEM emission discipline lives in [`./siem-emission-discipline.md`](./siem-emission-discipline.md).
5. **Live API** — only when both the snapshot doesn't have the answer and the question requires *now-state* (in-flight session counts, current connector status, etc.). When you do call an API, save the response to `evidence/` per the manifest convention so the next investigation can use it from disk.
6. **Portal / admin console** — last resort, manual lookup. Cite the navigation path in the source field; if the result is informative enough to keep, screenshot to `evidence/` with a manifest entry.

How to apply, per hypothesis:

- Find the lowest-numbered tier that has the relevant evidence for **this** hypothesis.
- Cite that file path / query as the source for that hypothesis.
- Then move to the next hypothesis and walk the ladder again. **Do not stop investigation just because one source had data; do not declare the investigation complete after reading one file.**

What this rule does NOT do:

- Does not replace Step 2 grounding. Schemas and product references still apply regardless of where evidence ultimately lives.
- Does not gate hypothesis generation. Generate the full hypothesis set in Step 3 first; THEN walk the ladder per hypothesis.
- Does not mean "if a snapshot exists, you're done." The snapshot answers some questions; the journal still needs hypotheses, evidence-per-hypothesis, and verification.

The point of disk-first is **avoiding redundant queries**, not stopping investigation early. Calling out to a SIEM / API / portal when `_data/` has the answer wastes the user's tokens; treating a single on-disk file as the answer to the entire investigation is the opposite failure — confidence without coverage.

Files added to `evidence/` follow the naming and manifest convention in [`../../_data/incidents/README.md § evidence/`](../../_data/incidents/README.md). Both the rename and the manifest row are written at save time, in the same step.

### 5. Output the journal

Render the discovery journal with hypotheses as `Open (likely)` or `Open (uncertain)` claims, plus the proposed next investigation step.

### 6. Save the journal to disk

After rendering in chat, write the same journal to `_data/incidents/<slug>/journal.md`. **This save is unconditional** — every `/z-investigator` invocation persists its journal, regardless of whether the investigation later turns out to be an incident or stays exploratory. Subsequent turns update the same file in place.

**Path selection — check before minting a new slug:**

1. **User named a path or slug in the framing** → use that directory. If the framing contains a path like `_data/incidents/test-foo/` or `2026-04-30-ci-silent-failures`, treat it as the operative directory. Do not create a sibling with a fresh slug — the user is pointing you at the artifact they want updated.
2. **The directory already exists with a `journal.md`** → this is a continuation, not a new investigation. Read the existing journal, treat its claims as the starting state, and update in place. Don't overwrite — preserve prior claim history (use `Stale` / `Ruled out` to retire entries, not deletion).
3. **No path given and no obvious match in `_data/incidents/`** (Step 2d's scan should have flagged any match) → mint a new slug: `<YYYY-MM-DD>-<short-kebab-descriptor>`. Date is today in UTC; slug is recognizable from a directory listing six months later. Examples: `ssh-azure-port-22`, `salesforce-sso-loop`, `connector-group-us-east-1-disconnected`. Create the directory.

**Path conventions:**

- The journal lives at `_data/incidents/<slug>/journal.md`.
- `_data/incidents/*` is gitignored by default, so the journal stays local-only unless the engineer explicitly opts in to publish it.
- If the user's named path doesn't start with `_data/incidents/` (e.g., they pointed at a path elsewhere in the tree), respect their pointer but flag the deviation in your reply — they may have a reason (a fork's internal convention) or it may be a typo worth confirming.

`_data/incidents/` is the skill's umbrella home for any saved `/z-investigator` artifact — the name reflects that incidents are the most common shape, not that every saved investigation must be one. If the investigation turns out to be incident-shaped (production break, regression, hygiene failure), the same directory becomes the home for `timeline.md` + `postmortem.md` + `evidence/` per § "Saving as an incident artifact." If it stays exploratory, only `journal.md` exists in the directory — that's fine.

If the user explicitly indicates they don't want a save (e.g., "don't save this, just answering a quick question"), skip step 6 and note the skip in your reply. Otherwise save by default.

## Journal template

```
ISSUE: [one-sentence description of what's failing]
STATUS: Investigating
TIMESTAMP: [ISO 8601 UTC]

| Claim | Source | Status | Timestamp | Notes |
|---|---|---|---|---|
| [hypothesis] | [where you'd check] | Open (likely\|uncertain) | [now] | [scope or qualifier] |
| ... | ... | ... | ... | ... |

ROOT CAUSE HYPOTHESIS (current):
[leading hypothesis, or "no leader yet — investigating in priority order"]

NEXT STEPS:
[the single next investigation step — which source to consult, what field to check]
```

## Subsequent turns

After the first response, continue the investigation by:

- Updating claim statuses as evidence comes in (`Open (likely)` → `Confirmed (medium)` → `Confirmed (high)`)
- Adding new claims when new hypotheses emerge or new evidence is consumed
- Marking `Stale` when system changes invalidate prior evidence
- Archiving `Ruled out` claims into a "Dismissed hypotheses" section when the journal exceeds ~10 active rows
- Naming the **next** evidence source explicitly at the end of each turn

Do not declare `Resolved` for the overall issue until:
1. Root cause is confirmed (`Confirmed (high)`)
2. You can explain why the other hypotheses were ruled out

## SIEM query emission

You may or may not have direct API access to the user's SIEM (Splunk, Sentinel, Chronicle, Elastic, Sumo, etc.). The full execution-mode framework and discipline live in [`siem-emission-discipline.md`](./siem-emission-discipline.md). Quick reference:

- **Agent-direct** — you have SIEM API access; run queries yourself, capture results inline.
- **User-handoff** — emit the query as an evidence-source plan; the user runs it and pastes results back.
- **Coworking** — common case; mix of both, journal is the shared artifact.

When emitting a query for any SIEM:

1. **Identify the Zscaler log type** the investigation needs. [`siem-log-mapping.md`](./siem-log-mapping.md) is the catalog — each Zscaler log type, its schema file, and common SIEM landing patterns (Splunk sourcetype, Sentinel table, Chronicle log type, Elastic index pattern, Sumo source category).

2. **Cite a pattern from the SIEM-specific catalog.** For Splunk, reference a named pattern in [`splunk-queries.md`](./splunk-queries.md) (e.g., "use `§ rule-hit-history`"). For other SIEMs, cite the relevant catalog when one exists; otherwise emit a query against the schema and note "no catalog yet for this SIEM" so the pattern can be added.

3. **Use placeholder plumbing.** Index / sourcetype / table / index-pattern / source-category values are env-var placeholders or `<your_*>` markers in the catalogs — never literal tenant values. Preserve when emitting.

4. **Use only Zscaler-published field names.** Cite the schema reference for any field used (e.g., `references/zia/logs/web-log-schema.md` for `urlcategory`, `references/zpa/logs/access-log-schema.md` for `InternalReason`). Do not invent or rename fields.

5. **Substitute user plumbing if available.** If the user has SIEM plumbing in CLAUDE.md, project config, or memory, substitute it into the placeholders before running (agent-direct) or emitting (user-handoff). Otherwise emit placeholders with a one-line "fill these in" note appropriate to their SIEM (Splunk: `| metadata type=sourcetypes`; Sentinel: list available tables; etc.).

6. **Treat the query as a plan until results exist.**
   - **Agent-direct**: after running, capture results as a `Confirmed (medium)` or `(high)` claim with the query as source.
   - **User-handoff**: until the user reports back, the claim stays `Open (likely)` or `Open (uncertain)`. When results arrive, capture them as `Confirmed (medium)` with the query + result rows as source.
   - **Either mode**: if the underlying system changed between query time and now (connector restart, policy update, re-auth), mark the claim `Stale` and re-run.

7. **Handoffs don't change claim status.** Switching between agent-direct and user-handoff (in either direction) is normal. A claim's status reflects evidence quality, not who gathered it.

8. **Cross-reference canonical and tenant schemas when both are available.** Canonical schemas under `references/{zia,zpa,zcc}/logs/` document what fields *could* exist per Zscaler — types, enums, semantic meaning. A tenant schema (if the user has generated one and stored it in CLAUDE.md / memory) documents what's *actually* extracted in their SIEM after TA / parser / pipeline processing. Confirm a canonical field is present in the tenant view before relying on it. Mismatches are findings:
   - Canonical field missing from tenant → TA not installed, sourcetype misconfigured, or Zscaler-Support-enablement-required (e.g., `clt_sport`, `srv_dport`, `dlprulename`)
   - Tenant field not in canonical → custom enrichment, local extraction, or TA CIM alias
   - Values diverge from canonical enums → stale TA version or out-of-band transformation

   See [`tenant-schema-derivation.md`](./tenant-schema-derivation.md) for the derivation recipes per SIEM and the storage template.

See [`siem-emission-discipline.md`](./siem-emission-discipline.md) for the full framework and [`siem-log-mapping.md`](./siem-log-mapping.md) for the Zscaler log type catalog.

## Escalation

Stop and escalate (with a handoff summary per the methodology doc) when:

- You need access you don't have (connector SSH, destination firewall logs, support tickets)
- The evidence source you need doesn't exist (LSS field gap, undocumented API behavior)
- Investigation has run >30 minutes with the main claim still `Open`

## Handoff format

When the investigation pauses or hands off to another agent/person, output the handoff format from the methodology doc: confirmed facts, open questions, current root cause hypothesis, next steps, what tools/access you had vs. didn't.

## Saving as an incident artifact

The journal itself is always saved per Step 6 above. This section covers the **incident-shape add-ons** — `timeline.md`, `postmortem.md`, and `evidence/` — that are written *in addition to* the journal when an investigation turns out to be an incident.

When this investigation is an **incident** — a production break, regression, hygiene failure, or other reactive triage with consequences worth remembering — author the additional artifacts alongside the journal in the same `_data/incidents/<YYYY-MM-DD>-<slug>/` directory:

1. **`timeline.md`** — author from the chat history + commit log; chronological events with ISO-8601 timestamps. Short — a glance gives the shape.
2. **`postmortem.md`** — author after the dust settles (within ~24h while context is fresh): root cause, why-not-caught-earlier, what changed, lessons, follow-ups. Blameless and brief.
3. **`evidence/`** — raw artifacts that the journal cites (CI logs, command output, API dumps, screenshots). Gitignored by default per the privacy posture in [`../../_data/incidents/README.md`](../../_data/incidents/README.md).

The whole `_data/incidents/<slug>/` tree is gitignored by default (private posture); engineers explicitly opt-in to publish a skill-internal incident by adding `!`-overrides per-incident. So an incident journal stays local-only unless deliberately published.

If the investigation stays exploratory (no production stakes, no consequences worth remembering), the directory just contains `journal.md` — that's the expected and correct shape. Don't author a postmortem for a "how does X work?" exploration.

If the investigation is NOT incident-shaped — exploratory, hypothesis-driven, no production stakes — there's no need to save the artifact. Chat-ephemeral is fine.

## Query bundles

When the same hypothesis comes up repeatedly, capture the verified query sequence as a **bundle** — a named, ordered list of queries with decision logic mapping results to claim statuses. See [`investigation-bundles.md`](./investigation-bundles.md) for the template and the public/private boundary (verified bundles can ship; speculative ones stay private). The agent should consult locally-available bundles before reasoning queries from scratch.

## Cross-links

- [`troubleshooting-methodology.md`](./troubleshooting-methodology.md) — discovery journal, claim status, anti-patterns
- [`investigation-bundles.md`](./investigation-bundles.md) — query bundle template (verified sequences for common hypotheses)
- [`siem-emission-discipline.md`](./siem-emission-discipline.md) — agent execution modes, public/private boundary
- [`siem-log-mapping.md`](./siem-log-mapping.md) — Zscaler log type catalog
- [`splunk-queries.md`](./splunk-queries.md) — Splunk SPL pattern catalog
- [`tenant-schema-derivation.md`](./tenant-schema-derivation.md) — canonical vs. tenant schemas, derivation recipes
- [`audit-prompt.md`](./audit-prompt.md) — `/z-auditor` playbook (checklist-driven sibling)
- [`soc-prompt.md`](./soc-prompt.md) — `/z-soc` playbook (security-posture sibling)
- [`architect-prompt.md`](./architect-prompt.md) — `/z-architect` playbook (design-driven sibling)

---

Doors and corners.
