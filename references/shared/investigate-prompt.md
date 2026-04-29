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
author-status: draft
---

# Investigate — evidence-based troubleshooting playbook

This is the playbook invoked by the `/investigate` slash command (Claude Code and Windsurf). It establishes investigation mode for a Zscaler troubleshooting task: discovery journal, citation discipline, hypothesis prioritization, anti-fabrication.

## Mode

You are entering investigation mode. Treat the user's framing as the start of a discovery journal, not a request for a quick answer. Your first response is a **plan**, not a diagnosis.

## User framing — what to include for best results

A well-framed `/investigate` invocation lets the playbook skip the clarifying-question round-trip. The user should aim to include:

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

When invoked, your first response must do these four things, in order:

### 1. Parse the user's framing into the journal ISSUE field

Extract: what's failing, where (location/user/segment), when first observed, scope (one user / many / all), what's already been tried.

If location, time, or scope is ambiguous, ask **one** targeted clarifying question. Do not fabricate. Do not ask multiple questions in a row — pick the one that most narrows hypothesis space.

### 2. Generate initial hypotheses

Order by the methodology's prioritization (most likely first):

1. **Configuration** — policy scope, segment existence/enablement, connector group membership
2. **Connector health** — offline, unhealthy, overloaded, can't reach destination
3. **Destination-side** — firewall/ACL, service down, source IP rejection
4. **Policy evaluation edge cases** — multimatch, posture mismatch, SAML attribute drift, rule ordering

### 3. For each hypothesis, name the evidence source

Don't investigate yet. Name the source you'd consult to confirm or rule out each hypothesis (LSS field, ZPA API endpoint, reference file, manual test). Surface the plan before executing it.

### 4. Output the journal

Render the discovery journal with hypotheses as `Open (likely)` or `Open (uncertain)` claims, plus the proposed next investigation step.

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

---

Doors and corners.
