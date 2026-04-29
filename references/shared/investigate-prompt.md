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

## Escalation

Stop and escalate (with a handoff summary per the methodology doc) when:

- You need access you don't have (connector SSH, destination firewall logs, support tickets)
- The evidence source you need doesn't exist (LSS field gap, undocumented API behavior)
- Investigation has run >30 minutes with the main claim still `Open`

## Handoff format

When the investigation pauses or hands off to another agent/person, output the handoff format from the methodology doc: confirmed facts, open questions, current root cause hypothesis, next steps, what tools/access you had vs. didn't.

---

Doors and corners.
