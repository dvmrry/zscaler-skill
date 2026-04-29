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
| **Status** | `Open` (still investigating), `Confirmed` (evidence supports), `Ruled out` (contradicted or disproven), `Resolved` (root cause found) |
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

### When to mark status
- **Open**: hypothesis is under investigation; evidence is incomplete or ambiguous
- **Confirmed**: evidence directly supports the claim
- **Ruled out**: evidence contradicts or logic eliminates this possibility
- **Resolved**: root cause identified and verified; action taken or documented

Do not use "Resolved" for the overall issue until root cause is confirmed AND you can explain why previous hypotheses were ruled out.

### Timeline awareness
- Issues that appear location-specific, time-specific, or intermittent need temporal metadata (when first observed, frequency, affected locations)
- If the investigation spans hours, note when you're switching between data sources or time windows
- Example: "Claim confirmed at 14:35 UTC; connector restarted at 15:00; need to verify if behavior changed post-restart"

## Cross-referencing the references

Use the discovery journal to point to relevant reference docs and to call out gaps:

```
Claim: Policy scope includes Location X
Source: references/zpa/policy-precedence.md (scope evaluation order) + direct API check showing Location X in segment's adminScopes
Status: Confirmed

Gap: references/zpa/troubleshooting.md doesn't explain port-level filtering or per-port health checks; need to consult LSS documentation or API schema
```

This helps future readers understand both what was investigated and what tooling/docs were insufficient.

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
