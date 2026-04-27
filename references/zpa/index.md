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
| **Posture Profiles** — ZPA policy-side consumer of ZCC posture signals; read-only from operator (Zscaler-provisioned); `posture_udid` is the policy `lhs` not `id` (TF plan-time validation); SDK + TF-derived (help portal 404). Tier source: code | [`./posture-profiles.md`](./posture-profiles.md) | draft |
| **Trusted Networks** — ZPA policy primitive (distinct from ZCC trusted-network detection); read-only data source only (no TF resource); policy condition uses `networkId` as `lhs`; v2 schema drops `rhs=false`; PSE Groups bind via `trusted_networks` list. SDK + TF-derived (help portal 404) | [`./trusted-networks.md`](./trusted-networks.md) | draft |
| **Public Service Edges** — Zscaler-managed ZPA service edge (operator-invisible most of the time); SDK exposes CRUD but update/delete only meaningful for Private SE instances; read-only via TF data source. Distinguished from Private/Cloud-Connector-deployed SEs. SDK-derived (help portal 404) | [`./public-service-edges.md`](./public-service-edges.md) | draft |
| **Emergency Access** — time-bounded out-of-band ZPA access via Okta-only IdP + email OTP; users live in Okta (not ZPA); destroy = deactivate (not delete); `email_id` is ForceNew; hidden inside Microtenants when Privileged Approvals disabled. Limited Availability — Zscaler Support to enable | [`./emergency-access.md`](./emergency-access.md) | draft |
| **Log Receivers (LSS configuration)** — SDK + TF surface for the LSS config primitive; 9 accepted `source_log_type` codes (16 log types exposed but only 9 streamable); 5 log types reject status-code filters; per-log-type policy `object_type` differences; no TLS cert/CA field. SDK + TF-derived (help portal 404) | [`./log-receivers.md`](./log-receivers.md) | draft |
| **Machine Tunnels** — pre-authentication ZPA access; device-identity-based policy before user login; ZCC machine tunnel enrollment; AD/LDAP reachability prerequisite | [`./machine-tunnels.md`](./machine-tunnels.md) | draft |
| **Machine Groups** — enrollment-driven device grouping consumed by Machine Tunnel policy; ZCC enrollment attributes used for group membership | [`./machine-groups.md`](./machine-groups.md) | draft |
| **Private Service Edges** — on-prem ZPA Service Edge deployment; cluster architecture; brokering private app access without sending traffic through Zscaler cloud | [`./private-service-edges.md`](./private-service-edges.md) | draft |
| **Segment Groups** — policy-scoping primitive grouping App Segments; semantics, membership, and how Access Policy rules reference them | [`./segment-groups.md`](./segment-groups.md) | draft |
| **SCIM policy mapping** — how SCIM / IdP group attributes map to ZPA access policy conditions; `lhs`/`rhs` attribute references; group-membership evaluation | [`./scim-policy-mapping.md`](./scim-policy-mapping.md) | draft |
| **ZPA SDK** — service and method catalog (`client.zpa.*`); Python and Go coverage; method-to-endpoint mapping | [`./sdk.md`](./sdk.md) | draft |
| **ZPA Terraform** — `zpa_*` resource catalog; provider configuration; known quirks (ruleOrder-as-string, embedded-object gotchas) | [`./terraform.md`](./terraform.md) | draft |
| **Troubleshooting** — access verification workflow; common failure signals (policy miss, connector down, segment mismatch, DNS resolution); diagnostic signal sources | [`./troubleshooting.md`](./troubleshooting.md) | draft |
| **Admin audit logs** — ZPA admin change events; retention; available fields; cross-product correlation | [`./audit-logs.md`](./audit-logs.md) | draft |

## Log schemas

| Schema | File | Status |
|---|---|---|
| LSS User Activity log fields — per-connection records; segment, connector, policy, timestamps, bytes | [`./logs/access-log-schema.md`](./logs/access-log-schema.md) | draft |

For SPL patterns see [`../shared/splunk-queries.md`](../shared/splunk-queries.md); for when to query see [`../shared/log-correlation.md`](../shared/log-correlation.md).

## When the question spans multiple topics

Start at [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md) for the cross-feature mental model, then descend into the specific topic file.
