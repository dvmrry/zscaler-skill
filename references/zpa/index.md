---
product: zpa
topic: "zpa-index"
title: "ZPA reference hub"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: reviewed
---

# ZPA reference hub

Entry point for Zscaler Private Access (ZPA) questions — application segments, policy precedence, and the ZPA API.

## Topics

| Topic | File | Status |
|---|---|---|
| Application segment matching — specificity-wins, Multimatch INCLUSIVE/EXCLUSIVE, Bypass precedence | [`./app-segments.md`](./app-segments.md) | draft |
| **Segment Groups and Server Groups** — ZPA's two grouping primitives; policy-scoping (Segment Group) vs traffic-delivery (Server Group), four-way relationship, dynamic discovery vs explicit servers, orphan gotchas | [`./segment-server-groups.md`](./segment-server-groups.md) | draft |
| Policy precedence — access, timeout, client forwarding, inspection | [`./policy-precedence.md`](./policy-precedence.md) | draft |
| App Connector — VM model, groups, provisioning keys, scheduled software updates, certificate enrollment | [`./app-connector.md`](./app-connector.md) | draft |
| **Browser Access** — clientless web-app access via browser (no ZCC), dual-access model, TLS-1.2 cipher requirement, wildcard-cert one-level-only gotcha, same-vs-different-hostname cert mechanics, mutual-exclusions with SIPA/Double-Encryption/Multimatch | [`./browser-access.md`](./browser-access.md) | draft |
| **Privileged Remote Access (PRA)** — clientless RDP/SSH/VNC gateway, credential pooling (3 credential types, immutable protocol), approval workflow (requester → approver → time-bounded), capabilities policy, session recording with 6-state lifecycle | [`./privileged-remote-access.md`](./privileged-remote-access.md) | draft |
| **AppProtection** (formerly Inspection) — inline WAF/IPS for ZPA-protected apps, 6 control categories (OWASP CRS 4.8 / ThreatLabZ / Active Directory Kerberos+SMB+LDAP / API / WebSocket / Custom), three-tier policy model (Controls → Profiles → Rules), Paranoia Levels 1-4, default `OWASP Top-10 for Visibility` profile, LSS log stream | [`./appprotection.md`](./appprotection.md) | draft |
| ZPA API — endpoints, authentication, response shapes | [`./api.md`](./api.md) | draft |
| **Snapshot schema** — what's in `snapshot/zpa/*.json`, list-wrapping, ruleOrder-as-string, embedded-objects pattern, common jq queries | [`./snapshot-schema.md`](./snapshot-schema.md) | draft |
| **Microtenants** — multi-org isolation within a single ZPA tenant; `microtenantId` propagates onto App Segments / Server Groups / Segment Groups / Connector Groups / Service Edge Groups; admin password shown ONCE at creation; disable triggers re-auth; SharedMicrotenantDetails for cross-Microtenant App Segment sharing | [`./microtenants.md`](./microtenants.md) | draft |

## Log schemas

| Schema | File | Status |
|---|---|---|
| LSS User Activity log fields — per-connection records; segment, connector, policy, timestamps, bytes | [`./logs/access-log-schema.md`](./logs/access-log-schema.md) | draft |

For SPL patterns see [`../shared/splunk-queries.md`](../shared/splunk-queries.md); for when to query see [`../shared/log-correlation.md`](../shared/log-correlation.md).

## When the question spans multiple topics

Start at [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md) for the cross-feature mental model, then descend into the specific topic file.
