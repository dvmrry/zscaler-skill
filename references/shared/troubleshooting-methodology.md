---
product: shared
topic: "troubleshooting-methodology"
title: "Troubleshooting methodology — evidence-based diagnostics"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: practice
sources:
  - "Lessons from SIPA troubleshooting (April 2026)"
author-status: draft
---

# Troubleshooting methodology — evidence-based diagnostics

A framework for systematic, citation-heavy troubleshooting that prevents hallucination, premature closure, and rootless pivoting between hypotheses.

## Core discipline: the discovery journal

When diagnosing a complex issue (SIPA, policy evaluation, LSS behavior, connector health, etc.), maintain a **discovery journal** that documents every claim with its source. This serves three purposes:

1. **Prevents fabrication** — agent/analyst cannot invent evidence
2. **Prevents pivoting** — changing the root cause hypothesis requires explaining why the previous one is ruled out
3. **Surfaces real misconfiguration** — forced rigor catches issues that loose pattern-matching misses

## Discovery journal format

For each claim or finding, document:

| Field | Content |
|---|---|
| **Claim** | One-sentence hypothesis or observation (e.g., "Connector health check is failing") |
| **Source(s)** | Exact reference(s): file path + line number, API query + result, LSS field + value, or direct query output |
| **Status** | See [Status values](#status-values) below — captures both the state of the claim and your confidence in the evidence |
| **Timestamp** | When discovered (helps track investigation timeline) |
| **Notes** | Any caveats or metadata (e.g., "only saw this in Location A", "absent on 3 of 5 connectors") |

## Example workflow

**Bad (premature closure, no evidence trail):**
```
Issue: ssh.dev.azure.com:22 fails from Location X
Diagnosis: Connector network is blocking port 22
Status: Closed — "other ports work, so connectors are fine"
```

(Problem: No citation. No investigation of what "other ports work" actually means. No evidence of network health.)

**Good (evidence-based, falsifiable):**
```
Claim 1: Connector assignment fails for ssh.dev.azure.com:22 from Location X
Source: ZPA API GET /userActivity filtered by failed sessions, Location X, destination ssh.dev.azure.com:22 → "no connector available" in status
Status: Confirmed
Timestamp: 2026-04-28 14:30 UTC

Claim 2: Other port/URL combinations reach the same app segment + connectors from Location X
Source: ZPA API GET /userActivity, same location, other destinations on same segment → sessions show "assigned to [Connector A, Connector B]"
Status: Confirmed
Timestamp: 2026-04-28 14:32 UTC
Notes: Port 443 (HTTPS) and port 80 (HTTP) both succeed; only 22 fails on all three tested URLs

Claim 3: Connector health is degraded (candidate for port 22 assignment failure)
Source: LSS /lssConfig/userActivity filtered by failed sessions, field InternalReason = "CONNECTOR_UNHEALTHY" 
Status: Open — awaiting LSS data with full health metrics
Timestamp: 2026-04-28 14:35 UTC
Notes: If confirmed, explains why port 22 specifically fails (health check may be port-specific)

Claim 4: Destination firewall is blocking port 22 from ZPA connector IPs
Source: Manual test from connector IP to ssh.dev.azure.com:22 — would require temporary SSH access
Status: Not yet investigated (requires access)
Timestamp: 2026-04-28 14:40 UTC

Root cause hypothesis (pending):
Port 22 health check is failing on one or more connectors. Likely causes (in order of probability):
1. Connector-level firewall rule blocking 22 outbound
2. Destination server rejecting connections from connector IP range
3. Policy misconfiguration limiting port 22 to subset of connectors
```

(Better: each claim has a source, status, and timestamp. Pivoting between hypotheses is visible and justified by evidence gaps.)

## Anti-patterns to avoid

### ❌ Absence of evidence treated as evidence of absence
```
"We didn't see connector health issues in the logs, so connectors are healthy"
```
Better:
```
"Checked LSS /lssConfig/userActivity with fields [HealthStatus, InternalReason]. For connectors handling this segment, health status shows OK. However, LSS may not expose granular per-port health checks. Need to verify via direct API health endpoint if available."
```

### ❌ Pivoting without explanation
```
Issue: Connector assignment fails
First hypothesis: Network blocking
(no evidence found)
New hypothesis: Policy misconfiguration
(no explanation for why network blocking was ruled out)
```
Better:
```
Hypothesis 1: Network blocking
Source: "other ports work on same connector" from ZPA API
Status: Ruled out — if network were blocking, all ports to that destination would fail. Port 443 succeeds, so connectivity to destination is open.

Hypothesis 2: Policy misconfiguration
Source: ZPA API GET /policySet/rules — policy for ssh.dev.azure.com includes Location X and segment includes these connectors
Status: Open — policy allows connection. Investigating why assignment engine isn't selecting a connector.
```

### ❌ Premature "root cause identified"
```
Status: Resolved
Root cause: "Connector health check failed"
(but no LSS data confirming this, and no investigation of why specifically port 22)
```
Better:
```
Status: Open — investigating
Likely cause: Connector health check or port-specific filtering (see Claims 3–4 above)
Next steps: Pull LSS data with [InternalReason, ConnectorID, DestinationPort] fields; if unavailable, use direct API health endpoint
```

### ❌ Confirmation bias — only looking for evidence that supports the current hypothesis

Once you've settled on a leading root cause, it's tempting to keep gathering sources that reinforce it. That's not investigation — that's prosecution.

```
Hypothesis: Connector health is degraded
(spent 20 minutes pulling more LSS health metrics, all consistent with degraded health)
Status: Confirmed
```
Better:
```
Hypothesis: Connector health is degraded
Confirming evidence: LSS InternalReason = CONNECTOR_UNHEALTHY (12 sessions)
Contradicting evidence sought: Same connectors are passing health checks for port 443 traffic in the same window — if connector were broadly degraded, 443 should fail too
Status: Open (likely) — health is degraded for port 22 specifically, not globally. Investigate port-specific health checks before promoting to Confirmed.
```

If you've been investigating the same hypothesis for 20+ minutes and haven't actively sought evidence that would falsify it, you're in confirmation-bias territory. Step back. Ask: what would I expect to see if this hypothesis were wrong? Then go look for that.

### ❌ Context loss between claims
```
Claim 1: Connectors are healthy (from API)
Claim 2: Connector assignment failed (from LSS)
(no connection made between these — treated as separate issues)
```
Better:
```
Claim 1: Connectors are healthy per API
Claim 2: Connector assignment failed for port 22 per LSS
Contradiction: If connectors are healthy, why did assignment fail? 
Possible resolution: Health status is aggregated/generic; port 22 may have a specific health check that fails even if overall health is OK. Need port-level health telemetry.
```

### ❌ Reasoning over field values without reading the schema

```
LSS field `Action = 0` — that means the rule allowed the traffic.
(no schema consulted; `0` is being interpreted by analogy from another log type)
```
Better:
```
Before reasoning: read references/zia/logs/web-log-schema.md for `action` enum.
Schema says: `action` for ZIA web logs is a string ("Allowed" / "Blocked"), not an integer. Numeric `0` would not appear in this field — investigate why the value looks numeric (parsing issue? wrong log type? TA version mismatch?).
```
Field names look self-evident but rarely are. `action`, `reason`, `status`, `result` mean different things across ZIA / ZPA / ZDX / ZCC log types. Read the schema before any claim built on a field value becomes load-bearing.

### ❌ Hypothesizing without grounding in product architecture

```
Issue: ZPA segment isn't matching for user X.
Hypothesis: Default-allow policy is shadowing the segment match.
(no reference to ZPA's deny-by-default model; analyzing as if ZIA semantics apply)
```
Better:
```
Before hypothesizing: read references/zpa/policy-evaluation.md (or equivalent feature reference).
ZPA is deny-by-default — there is no "default-allow shadow." The hypothesis space is: (a) segment doesn't include this user's IdP attributes, (b) connector group isn't reachable from user's location, (c) rule ordering with a higher-priority deny, (d) posture / timeout / SAML attribute drift.
```
Product defaults and architectural assumptions (deny-by-default vs. allow-by-default, per-app vs. per-segment, IdP-claim vs. SCIM-claim) shape which hypotheses are even plausible. A hypothesis built on the wrong product mental model wastes the whole investigation.

### ❌ Reasoning from scratch when the user already placed evidence in the operative directory

```
User: "/z-investigate connector flap in _data/incidents/test-flap/"
Agent: "Let me hypothesize causes and propose investigation steps..."
(no read of _data/incidents/test-flap/evidence/, no check of
_data/snapshot/<cloud>/ for the relevant tenant config dump,
no read of an existing journal.md the user may already have
seeded in that directory)
```
Better:
```
Agent first reads:
  _data/incidents/test-flap/evidence/  — finds connector-status.json
  _data/incidents/test-flap/journal.md — finds existing claims
                                         (or none, if fresh)
  _data/snapshot/<cloud>/                — finds connector-groups.json

Hypothesis 1: Connector group reachability
  Source: _data/snapshot/<cloud>/connector-groups.json line 47 —
          group's last-seen timestamp is 14h old.
  Status: Confirmed (medium)

Hypothesis 2: ...
```
The operative directory is wherever the user pointed `/z-investigate`. Read its `evidence/` and `journal.md` first; the user may have already provided the answer or seeded prior claims that are the starting state of the investigation. Then read tenant config from `_data/snapshot/<cloud>/`. Do not browse sibling incident directories — that's a separate discipline that isn't refined enough yet.

### ❌ Carrying user framing claims unverified into hypotheses

```
User: "The connector is degraded and the rule fired but allowed traffic anyway."
Hypothesis 1: Connector degradation is causing partial policy enforcement.
Hypothesis 2: The fired rule has a permit action shadowing a deny.
(both hypotheses build on the user's causal claims as if they were verified)
```
Better:
```
Framing claims, treated as Open (uncertain) until verified:
- Claim A: Connector is degraded — Source: pending. Will check LSS HealthStatus / API connector health endpoint.
- Claim B: Rule X fired — Source: pending. Will check policy evaluation log / LSS for the matching rule ID.
- Claim C: Traffic was allowed despite the rule — Source: pending. Will reconcile with web/access log action field.

Until A/B/C are verified, hypotheses are framed as conditional ("if A, then…"); not load-bearing.
```
Users describe symptoms accurately but mis-attribute causes. "The connector is degraded" is often a guess based on the symptom; carrying it forward as a fact produces a confident wrong answer. Verify framing claims before they anchor reasoning, or mark them `Open (uncertain)` and identify the evidence that would resolve them.

## Practical guidelines

### When to open a claim
- Every hypothesis or observation (even "connectors appear healthy")
- Every time evidence is consumed (API call, log query, document reference)
- When pivoting from one root cause to another

### What counts as a source
- **File reference**: `references/zpa/troubleshooting.md` line 87
- **API query result**: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/policySet/rules?policyType=ACCESS_POLICY` → returned 3 rules matching criteria
- **LSS field**: `LSS /lssConfig/userActivity` with `InternalReason = CONNECTOR_UNHEALTHY` (count: 12 sessions)
- **Direct query/test**: "Ran `curl -v https://ssh.dev.azure.com:22 --connect-timeout 5` from connector IP, got TCP timeout"
- **Absence with qualification**: "Checked [specific fields] in LSS, no records found for this scenario" (not just "didn't see it")

### Status values

Real investigations live in the gray. Use these values to capture both the state of a claim and your confidence in the underlying evidence.

| Status | When to use |
|---|---|
| **Open (likely)** | Leading hypothesis with partial evidence; still investigating but pointing this direction |
| **Open (uncertain)** | Multiple competing hypotheses; need more data before any one is leading |
| **Confirmed (high)** | Multiple independent sources align; evidence is direct and strong |
| **Confirmed (medium)** | Single high-quality source, OR multiple sources that share an upstream dependency (could fail together) |
| **Ruled out** | Evidence contradicts the claim, or logic eliminates the possibility |
| **Stale** | Evidence was valid when gathered, but the underlying system changed afterward (connector restart, policy update, user re-auth, etc.). Needs re-verification, not just re-citation |
| **Resolved** | Root cause identified AND verified; action taken or documented |

Do not use "Resolved" for the overall issue until the root cause is confirmed AND you can explain why previous hypotheses were ruled out. Be honest about confidence: inflating "Confirmed (medium)" to "Confirmed (high)" is the same failure mode as premature closure.

### Timeline awareness
- Issues that appear location-specific, time-specific, or intermittent need temporal metadata (when first observed, frequency, affected locations)
- If the investigation spans hours, note when you're switching between data sources or time windows
- Example: "Claim confirmed at 14:35 UTC; connector restarted at 15:00; need to verify if behavior changed post-restart"

### Evidence staleness

Evidence has a half-life. When the underlying system changes, claims based on pre-change data become stale — not wrong, but no longer load-bearing.

Mark a claim `Stale` (and re-investigate before relying on it) when any of these happen after the evidence was gathered:

- Connector restart, redeploy, or version change
- Policy update, segment edit, or connector group membership change
- User re-auth, posture change, or device certificate rotation
- IdP/SAML attribute change
- Destination-side firewall/ACL update or service restart

Stale claims need fresh evidence, not just a re-citation of the old source. "I checked LSS at 14:35" doesn't carry forward across a 15:00 connector restart.

### Journal scalability

For investigations spanning more than ~30 minutes or ~10 claims, the active table gets unwieldy. Keep it readable:

- **Archive ruled-out claims** into a "Dismissed hypotheses" section once you've moved on. They stay in the journal (so handoff can see your reasoning), but they don't crowd the active table.
- **Promote the leading hypothesis** to the top so anyone reading the journal sees the current state immediately.
- **Date-stamp section breaks** when the investigation pauses and resumes — the gap matters for staleness.

## Tool selection guidance

Different claims require different evidence sources. Use this decision tree to avoid wasting time on unavailable data:

| Claim type | Best tool | Alternatives | Avoid |
|---|---|---|---|
| Connector health | LSS `/lssConfig/userActivity` (InternalReason, ConnectorStatus) | Direct ZPA API `/connector/{id}/health` if exposed | Looking at overall connector count (won't show health) |
| Policy matches this location? | ZPA API `/policySet/rules` + inspect adminScopes | ZPA portal policy UI | Assuming from success of other locations |
| Session failed at assignment? | LSS User Activity with SessionID, InternalReason, ConnectorAssignmentReason | ZPA API with session ID filter if available | Generic "connection failed" logs |
| Destination firewall blocking? | Manual SSH/curl from connector IP to destination | NSS logs (shows dropped packets) | Absence of evidence (may be silently dropped) |
| Policy syntax/scope error? | references/zpa/policy-precedence.md + ZPA API policy dump | ZPA portal, audit logs | Trial and error |
| Traffic forwarding path | ZPA API `/application` (segment config) + LSS (what actually happened) | references/zpa/policy-precedence.md | Assumption based on one successful session |

## Hypothesis prioritization

When multiple root causes are possible, investigate in this order (most likely first):

1. **Configuration — the simplest cause**
   - Policy scope doesn't include location/user/device
   - Segment doesn't exist or is disabled
   - Connector group is disabled
   - Check via: ZPA API + references/zpa/policy-precedence.md

2. **Connector health — single point of failure**
   - Connector offline, unhealthy, or overloaded
   - Connector can't reach destination (firewall, network path)
   - Check via: LSS `/lssConfig/userActivity` (InternalReason field), direct health API if available

3. **Destination-side — outside your control but worth confirming**
   - Destination firewall/ACL blocking source IP
   - Destination service down or not listening
   - Check via: manual test from connector IP (requires connector access or test tool)

4. **Policy evaluation edge case — the hard one**
   - Policy matched but contradicted by another rule
   - Multimatch behavior or rule order issues
   - Posture or SAML attribute mismatch
   - Check via: deep policy comparison in ZPA API, cross-reference with references/zpa/policy-precedence.md

**Why this order:** Configuration issues are easiest to spot and fix. Connector issues affect many sessions at once (easier to pattern-match). Destination issues are infrastructure, not Zscaler. Policy edge cases require deep knowledge and lots of data.

## Escalation criteria

Stop investigating and escalate when:

| Criterion | Action |
|---|---|
| Need direct connector SSH/health API access (not available to you) | Escalate to ops/connector owner. Provide: connector ID, failing destination, LSS session ID showing failure |
| Need destination-side firewall/service logs | Escalate to destination owner. Provide: source IP (connector IP from LSS), destination, port, session timestamp, "connection rejected or timeout" |
| Confirmed Zscaler bug (claim is well-documented, source is API response or LSS, and behavior contradicts docs) | File Zscaler support ticket. Include: full discovery journal, affected customer/tenant ID, reproduction steps, version info |
| Missing tooling (e.g., LSS doesn't expose the field you need to confirm a claim) | Document the gap in the journal. Note: "InternalReason field shows X, but port-level health is not available in LSS. Need direct API or support to confirm port 22 health." Move to "requires escalation." |
| Investigation has taken >30 minutes and you're still in "Open" status on the main claim | Step back. Review the journal. Are you investigating the right thing? Are you asking for evidence that doesn't exist? Escalate with what you have. |

## Quick reference summary

## Discovery journal template (blank)

Copy and paste this to start a new investigation:

```
ISSUE: [One-sentence description]
STATUS: [Open/Investigating]
TIMESTAMP: [When investigation started]

| Claim | Source | Status | Timestamp | Notes |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

ROOT CAUSE HYPOTHESIS (current):
[What you think is happening]

NEXT STEPS:
[What to investigate next]
```

---

When handing off or summarizing findings:

**Format:**
```
ISSUE: [One-sentence description]
STATUS: [Confirmed / Unconfirmed / Escalated]

CONFIRMED FACTS:
- [Claim + source]
- [Claim + source]

OPEN QUESTIONS:
- [Claim with "Open" status + why it matters]

ROOT CAUSE (if found):
- [Confirmed cause + evidence]
- [Why other hypotheses were ruled out]

NEXT STEPS:
- [What to investigate if continuing]
- [Who to escalate to and why]
```

**Example:**
```
ISSUE: User in Location A cannot SSH to internal server via SIPA, but can browse HTTPS apps
STATUS: Escalated

CONFIRMED FACTS:
- SIPA policy allows Location A (ZPA API /policySet/rules confirms)
- Connector group is healthy and online (LSS reports no InternalReason errors)
- Port 443 succeeds, port 22 fails from same location (ZPA API session logs)
- Other users in Location A can reach other port 22 destinations (manual test successful)

OPEN QUESTIONS:
- Is this specific server blocking port 22 from connector IP? (requires server-side firewall check)
- Is connector filtering port 22 outbound? (requires connector health API access)

ROOT CAUSE: Likely destination firewall or connector port-level filtering, not Zscaler policy

NEXT STEPS:
- Have ops check connector outbound ACLs for port 22
- Have server owner check firewall rules against connector IP ranges
```

## Collaboration handoff

When passing findings to another person or agent:

**Include:**
1. **Full discovery journal** (even if it's long) — the other person needs to see your reasoning
2. **Status summary** (quick reference above) — they need the executive summary
3. **Source accessibility** — note if you had access to LSS, API, portals, or if you had to infer from limited data
4. **Unknowns explicitly** — "we couldn't investigate X because [reason]" is better than leaving them guessing

**Format for handoff:**
```
[Quick reference summary]

---

FULL DISCOVERY JOURNAL:
[Full journal with all claims, sources, statuses]

---

NOTES FOR NEXT PERSON:
- Had access to: ZPA API, references, LSS (basic queries only)
- Did NOT have access to: connector SSH, destination firewall logs, support escalation
- This investigation took [X] time; recommend [next tool or escalation path]
```

**What NOT to do:**
- Don't summarize away the sources ("It's probably X")
- Don't drop the failed hypotheses (they explain why you ruled things out)
- Don't say "need more data" without specifying what data and why
- Don't hand off with Open status on the main claim unless you clearly state why it stayed open

## When the journal prevents issues

Real example: During SIPA troubleshooting, forced citation uncovered a legitimate misconfiguration that loose pattern-matching would have missed because:
- The visible failure was "no connector available" (vague)
- Other destinations worked fine (suggested connector health was okay)
- But journaling each claim forced examination of LSS metadata
- Metadata revealed the actual issue was either whitelisting at the destination or port-specific filtering at the connector
- Without citation discipline, this would have been diagnosed as "unclear, need API dump" and left unsolved

---

## Cross-links

- SIPA troubleshooting (example case): [`../zpa/troubleshooting.md`](../zpa/troubleshooting.md)
- Policy evaluation (common troubleshooting target): [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- LSS and logging (evidence sources): [`../zpa/log-receivers.md`](../zpa/log-receivers.md)
