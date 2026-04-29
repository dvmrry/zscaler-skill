---
product: shared
topic: "architect-methodology"
title: "Architect methodology — evidence-based recommendation discipline"
content-type: reference
last-verified: "2026-04-29"
confidence: high
source-tier: practice
sources:
  - "references/shared/troubleshooting-methodology.md (parallel discipline)"
  - "references/shared/audit-methodology.md (parallel discipline)"
author-status: draft
---

# Architect methodology — evidence-based recommendation discipline

A framework for design-driven analysis: capacity, topology, scaling, migration. Parallel to [`troubleshooting-methodology.md`](./troubleshooting-methodology.md) and [`audit-methodology.md`](./audit-methodology.md) — same anti-fabrication and citation discipline, different deliverable shape.

| Archetype | Question | Artifact |
|---|---|---|
| **Investigate** | Why is X broken? | Discovery journal of claims with status |
| **Audit** | Does Y meet spec? | Audit register of findings with severity |
| **Architect** | Will Z scale (or how should it change)? | Recommendation register with risk and confidence |

The architect produces **forward-looking recommendations** with rationale and risk, not findings or root causes. Each recommendation is backed by evidence — config inspection, utilization metrics, or both — and calibrated to the strength of that evidence.

## Core discipline: the recommendation register

For each recommendation, document:

| Field | Content |
|---|---|
| **Recommendation** | One-sentence proposed action ("Add a second connector to App Connector Group X") |
| **Rationale** | Why this is needed — the design / scaling argument |
| **Risk if not addressed** | What goes wrong without this. Use the [Risk scale](#risk-scale) below. |
| **Evidence** | Citations: config refs (Zscaler API / SDK source / our reference docs), metrics (Splunk patterns, generic infra metrics), or both |
| **Confidence** | How strongly the evidence supports the recommendation. See [Confidence in recommendations](#confidence-in-recommendations) |
| **Status** | `Proposed` / `Accepted` / `Rejected` / `Deferred` / `Resolved` |
| **Notes** | Dependencies, alternatives considered, related recommendations |

## Risk scale

Captures **what happens if we don't act**, not the cost of acting.

| Risk | Definition |
|---|---|
| **Critical** | Imminent failure or outage risk under expected load (within current capacity / quarter) |
| **High** | Degraded performance likely under known peak load; failover gaps that will activate under foreseeable conditions |
| **Medium** | Tail-risk under unusual conditions (regional incident, unanticipated load spike, single-host failure) |
| **Low** | Efficiency / cost concern; sub-optimal but not a reliability or capacity issue |
| **Info** | Observation; no real risk. Worth noting for future planning. |

Pick the lowest applicable level — inflated risk drowns real urgency. When in doubt between two adjacent levels, choose the lower one.

## Confidence in recommendations

Recommendations have confidence calibrated to evidence quality. Borrows from the troubleshooting methodology's status tiers but reframed for design choices.

| Confidence | Backed by |
|---|---|
| **High** | Both config evidence and utilization metrics align; the conclusion is over-determined |
| **Medium** | Config evidence alone (no metrics) OR metrics alone (config inspected but not deeply), with a clear causal argument |
| **Low** | Pattern-based ("this looks like a typical SPOF") without specific evidence; or speculative future-load reasoning without a baseline |

Be honest. A recommendation backed by two reasoning patterns and zero data is `Low`, not `Medium`. The user is better served by a calibrated `Low` they can decide to weight than by an inflated `Medium` they trust unjustifiably.

## Status lifecycle

| Status | Meaning |
|---|---|
| **Proposed** | Just identified; awaiting user review |
| **Accepted** | User agrees; will action (with optional timeline in Notes) |
| **Rejected** | User disagrees with the recommendation. Note why — design context the architect didn't have, alternative approach planned, etc. |
| **Deferred** | Agreed in principle, deferred to later cycle. Note when to revisit. |
| **Resolved** | Action has been taken; recommendation no longer active |

`Rejected` is a healthy status — architects propose, users decide. Recording rejection rationale is valuable; it educates the next architect cycle.

## Two evidence layers

The architect draws on two evidence layers, with very different sources and maturity:

### Layer 1: Config evidence (always available)

Reading current configuration to identify structural issues:

- Zscaler API config dumps (via SDK / Postman — see references in `zpa/`, `zia/`, `zcc/`)
- Reference docs documenting Zscaler concepts (segments, connector groups, policies, etc.)
- Snapshot exports if maintained in the user's private fork

Config-only recommendations are common and valuable — many scaling issues are visible from layout alone (single-connector groups, missing LSS receivers, regional SPOFs, sticky-session LB misconfig, etc.).

### Layer 2: Utilization evidence (when available)

Generic infrastructure metrics describing actual load:

- **Hardware utilization** — CPU %, memory %, disk %, network throughput, per-host (whatever monitoring system: Grafana over Prometheus, CloudWatch, Azure Monitor, Datadog, or hand-pasted)
- **Capacity metrics** — active connections, peak concurrent sessions, port pool usage, request rate
- **Application metrics** — latency percentiles, error rates, queue depths
- **User / device metrics** — concurrent user count, geographic distribution, device-type mix

These are **not Zscaler-specific** — same shape across cloud providers and monitoring stacks. The architect doesn't dictate format; it accepts whatever the user provides and asks for specific dimensions when needed.

A few Zscaler-specific utilization sources do exist when configured:
- ZPA App Connector Metrics LSS — CPU, memory, throughput, active connections per connector
- ZPA Private Service Edge metrics — same shape, for PSE
- ZPA Private Cloud Controller metrics — for PCC

When these LSS feeds are configured, the architect uses them via the SIEM emission discipline. When they aren't, the architect's first recommendation is often "configure these feeds to enable utilization analysis."

## Anti-patterns

### ❌ Confidence inflation

```
Recommendation: Add three connectors to ACG-east
Rationale: looks undersized
Confidence: High
```
Better:
```
Recommendation: Add at least one connector to ACG-east; reassess after one week
Rationale: ACG-east has one connector serving 12 application segments including
           three high-traffic SaaS apps; single-connector group has no failover,
           and CPU LSS is not configured so utilization is unverified
Confidence: Medium (config evidence; utilization unknown)
Risk: High — single connector serves multi-app group, any restart drops all
              segments simultaneously
Evidence: ZPA API GET /appConnectorGroup/<id> shows count=1; segments listed
          per /application?appConnectorGroupId=<id>
Status: Proposed
Notes: Configure App Connector Metrics LSS in parallel to enable
       utilization-based sizing in the next cycle.
```

### ❌ "Will scale" without timeframe

A recommendation about future scaling without a horizon is unfalsifiable. Always anchor: "to support 2× current concurrent users by Q3" or "to handle the projected India regional rollout."

### ❌ Silent extrapolation

Taking a one-day metric snapshot and concluding "this is overloaded" without context (peak hour? business day? after a known incident?). Annotate the metric window in the Evidence field.

### ❌ Architect editing config

Architects propose; users decide and execute. The architect doesn't make API calls that change tenant state, even if it has access. Recommendations land in the register; the user actions them.

### ❌ Recommending the user re-architect when simple changes suffice

A connector group with one connector should get "add a second connector," not "redesign your connector topology." Match recommendation scope to the issue. Bigger changes get bigger recommendations only when smaller ones won't suffice.

## Practical guidelines

### When to open a recommendation

- Every structural issue identified from config (SPOF, oversubscription, missing observability, latency-coupled failure modes)
- Every utilization signal that exceeds typical headroom thresholds (80% CPU sustained, 90% port pool, etc.) — when metrics are available
- Every architectural mismatch between current state and stated future state ("planned 3× growth" + "current at 70% utilization")
- Observations about the architect's own evidence gaps ("Configure LSS to enable utilization analysis")

### What counts as evidence

- **Config citation**: API endpoint + response excerpt; reference doc + line; SDK source path + line
- **Metric citation**: query (with placeholder plumbing if Splunk; or generic shape for paste-in metrics) + result summary; window of observation
- **Cross-reference**: config + metric tied together ("connector count=1 per API + active connection peak 92% per metrics → undersized")
- **Pattern citation**: when reasoning from architectural patterns alone (no metrics), cite the pattern source ("per ZPA app connector best practices" or named anti-pattern)

### Confidence calibration shortcut

| Evidence base | Default confidence |
|---|---|
| Config + metrics agree | High |
| Config alone | Medium |
| Metrics alone | Medium |
| Pattern reasoning, no specific evidence | Low |
| Speculative future-load argument | Low |

Bumps allowed with justification (e.g., a config-only finding can be `High` if the SPOF is unambiguous and severity/urgency is critical).

## Escalation criteria

Stop and surface to the user (rather than producing more recommendations) when:

| Criterion | Action |
|---|---|
| Recommendation requires changes outside Zscaler's scope (cloud infra, IdP, network) | Surface as a cross-domain recommendation; tag with the affected domain; expect user to coordinate |
| Recommendation conflicts with a known constraint the user has stated | Mark `Deferred` with the constraint cited; ask if the constraint can be revisited |
| Evidence gaps prevent confident recommendations across most of the scope | Stop. Output an "evidence gap" recommendation set first ("configure X feed, provide Y metrics") and pause until data lands |
| Architect cycle has produced >10 recommendations | Stop, triage. Long lists become noise; user can ask for the next cycle after acting on the current set |

## Handoff format

```
ARCHITECT: <scope>
STATUS: <Proposed / Triaged / Closed>
TIMESTAMP: <when>
EVIDENCE LAYERS USED: <Config only / Config + metrics / etc.>

RECOMMENDATIONS BY RISK:
- Critical: <count>
- High: <count>
- Medium: <count>
- Low: <count>
- Info: <count>

[full recommendation register]

EVIDENCE GAPS:
- <missing metrics, missing config visibility, etc.>

NEXT STEPS:
- Triage recommendations ≥ Medium risk
- Action accepted recommendations
- Re-run architect cycle after gap remediation OR after planned-load milestone
```

## Cross-links

- [`troubleshooting-methodology.md`](./troubleshooting-methodology.md) — parallel discipline (hypothesis-driven)
- [`audit-methodology.md`](./audit-methodology.md) — parallel discipline (checklist-driven)
- [`architect-prompt.md`](./architect-prompt.md) — `/z-architect` slash command playbook
- [`siem-emission-discipline.md`](./siem-emission-discipline.md) — applies when architect queries SIEMs for utilization
