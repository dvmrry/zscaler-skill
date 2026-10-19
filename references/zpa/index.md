---
product: zpa
topic: "zpa-index"
title: "ZPA reference hub"
content-type: reference
last-verified: "2026-07-22"
confidence: high
sources:
  - "vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.json"
author-status: reviewed
---

# ZPA reference hub

Entry point for Zscaler Private Access (ZPA) questions — application segments, policy precedence, and the ZPA API.

## Topics

| Topic | File | Status |
|---|---|---|
| Application segment matching — specificity-wins, Multimatch INCLUSIVE/EXCLUSIVE, Bypass precedence | [`zpa.app-segments`](kb:zpa.app-segments) | draft |
| **Segment Groups and Server Groups** — ZPA's two grouping primitives; policy-scoping (Segment Group) vs traffic-delivery (Server Group), four-way relationship, dynamic discovery vs explicit servers, orphan gotchas | [`zpa.server-groups`](kb:zpa.server-groups) | draft |
| Policy precedence — access, timeout, client forwarding, inspection | [`zpa.policy`](kb:zpa.policy) | draft |
| App Connector — VM model, groups, provisioning keys, scheduled software updates, certificate enrollment | [`zpa.app-connectors`](kb:zpa.app-connectors) | draft |
| **Browser Access** — clientless web-app access via browser (no ZCC), dual-access model, TLS-1.2 cipher requirement, wildcard-cert one-level-only gotcha, same-vs-different-hostname cert mechanics, mutual-exclusions with SIPA/Double-Encryption/Multimatch | [`zpa.browser-access`](kb:zpa.browser-access) | draft |
| **Privileged Remote Access (PRA)** — clientless RDP/SSH/VNC gateway, credential pooling (3 credential types, immutable protocol), approval workflow (requester → approver → time-bounded), capabilities policy, session recording with 6-state lifecycle | [`zpa.pra`](kb:zpa.pra) | draft |
| **Business-to-Business Federation** — limited-availability partner trust, incoming/outgoing federation requests, federated-partner management, and application-segment federation with granular controls (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.json:55-63`) | [`zpa.b2b-federation`](kb:zpa.b2b-federation) | draft |
| **AppProtection** (formerly Inspection) — inline WAF/IPS for ZPA-protected apps, 6 control categories (OWASP CRS 4.8 / ThreatLabZ / Active Directory Kerberos+SMB+LDAP / API / WebSocket / Custom), three-tier policy model (Controls → Profiles → Rules), Paranoia Levels 1-4, default `OWASP Top-10 for Visibility` profile, LSS log stream | [`zpa.appprotection`](kb:zpa.appprotection) | draft |
| ZPA API — endpoints, authentication, response shapes | [`zpa.api`](kb:zpa.api) | draft |
| **Snapshot schema** — what's in `_data/snapshot/<cloud>/zpa/*.json`, list-wrapping, ruleOrder-as-string, embedded-objects pattern, common jq queries | [retired: field shapes via `kb.mjs resolve`](../_meta/layering-model.md) | draft |
| **Microtenants** — multi-org isolation within a single ZPA tenant; `microtenantId` propagates onto App Segments / Server Groups / Segment Groups / Connector Groups / Service Edge Groups; admin password shown ONCE at creation; disable triggers re-auth; SharedMicrotenantDetails for cross-Microtenant App Segment sharing | [`zpa.microtenants`](kb:zpa.microtenants) | draft |
| **Posture Profiles** — ZPA policy-side consumer of ZCC posture signals; read-only from operator (Zscaler-provisioned); `posture_udid` is the policy `lhs` not `id` (TF plan-time validation); SDK + TF-derived (help portal 404). Tier source: code | [`zpa.posture-profiles`](kb:zpa.posture-profiles) | draft |
| **Trusted Networks** — ZPA policy primitive (distinct from ZCC trusted-network detection); read-only data source only (no TF resource); policy condition uses `networkId` as `lhs`; v2 schema drops `rhs=false`; PSE Groups bind via `trusted_networks` list. SDK + TF-derived (help portal 404) | [`zpa.trusted-networks`](kb:zpa.trusted-networks) | draft |
| **Public Service Edges** — Zscaler-managed ZPA service edge (operator-invisible most of the time); SDK exposes CRUD but update/delete only meaningful for Private SE instances; read-only via TF data source. Distinguished from Private/Cloud-Connector-deployed SEs. SDK-derived (help portal 404) | [`zpa.public-service-edges`](kb:zpa.public-service-edges) | draft |
| **Emergency Access** — time-bounded out-of-band ZPA access via Okta-only IdP + email OTP; users live in Okta (not ZPA); destroy = deactivate (not delete); `email_id` is ForceNew; hidden inside Microtenants when Privileged Approvals disabled. Limited Availability — Zscaler Support to enable | [`zpa.emergency-access`](kb:zpa.emergency-access) | draft |
| **Log Receivers (LSS configuration)** — SDK + TF surface for the LSS config primitive; 9 confirmed `source_log_type` codes (16 log types exposed; 9 confirmed streamable via TF resource, 7 format-only candidates unresolved — see [zpa-41](kb:zpa.log-receivers.log-types:format-only-codes)); 5 log types reject status-code filters; per-log-type policy `object_type` differences; no TLS cert/CA field. SDK + TF-derived (help portal 404) | [`zpa.log-receivers`](kb:zpa.log-receivers) | draft |
| **Machine Tunnels** — pre-authentication ZPA access; device-identity-based policy before user login; ZCC machine tunnel enrollment; AD/LDAP reachability prerequisite | [`zpa.machine-tunnels`](kb:zpa.machine-tunnels) | draft |
| **Machine Groups** — enrollment-driven device grouping consumed by Machine Tunnel policy; ZCC enrollment attributes used for group membership | [`zpa.machine-groups`](kb:zpa.machine-groups) | draft |
| **Private Service Edges** — on-prem ZPA Service Edge deployment; cluster architecture; brokering private app access without sending traffic through Zscaler cloud | [`zpa.private-service-edges`](kb:zpa.private-service-edges) | draft |
| **Segment Groups** — policy-scoping primitive grouping App Segments; semantics, membership, and how Access Policy rules reference them | [`zpa.segment-groups`](kb:zpa.segment-groups) | draft |
| **SCIM policy mapping** — how SCIM / IdP group attributes map to ZPA access policy conditions; `lhs`/`rhs` attribute references; group-membership evaluation | [`zpa.scim`](kb:zpa.scim) | draft |
| **ZPA SDK** — service and method catalog (`client.zpa.*`); Python and Go coverage; method-to-endpoint mapping | [`zpa.sdk-python`](kb:zpa.sdk-python) | draft |
| **ZPA Terraform** — `zpa_*` resource catalog; provider configuration; known quirks (ruleOrder-as-string, embedded-object gotchas) | [`zpa.terraform`](kb:zpa.terraform) | draft |
| **Troubleshooting** — access verification workflow; common failure signals (policy miss, connector down, segment mismatch, DNS resolution); diagnostic signal sources | [`zpa.troubleshooting`](kb:zpa.troubleshooting) | draft |
| **Admin audit logs** — ZPA admin change events; retention; available fields; cross-product correlation | [`zpa.audit-logs`](kb:zpa.audit-logs) | draft |

## Log schemas

| Schema | File | Status |
|---|---|---|
| LSS User Activity log fields — per-connection records; segment, connector, policy, timestamps, bytes | [`zpa.logs.user-activity`](kb:zpa.logs.user-activity) | draft |

For SPL patterns see [`shared.splunk`](kb:shared.splunk); for when to query see [`shared.log-correlation`](kb:shared.log-correlation).

## API schema references

Field-and-endpoint-level catalogs derived from Zscaler SDKs and Postman collections.

| Schema | File | Status |
|---|---|---|
| API endpoint inventory — full ZPA REST endpoint catalog with request/response shapes | [`zpa.api`](kb:zpa.api) | draft |
| **Legacy API endpoint reference** — complete `config.private.zscaler.com` endpoint surface (the legacy counterpart to the OneAPI surface in [`zpa.api`](kb:zpa.api)); v1/v2 mgmtconfig + userconfig + CBI base URLs, per-service endpoint tables extracted from the Go SDK service layer | [`zpa.api.legacy-endpoints`](kb:zpa.api.legacy-endpoints) | draft |
| Postman-collection-derived schemas — extracted struct shapes and parameter types from the ZPA Postman collection | [`zpa.api`](kb:zpa.api) | draft |
| **API source divergences** — where the Go SDK, Python SDK, and Postman collection disagree with each other and with field observations; which source to trust per area | [`zpa.api`](kb:zpa.api) | draft |
| SAML attribute reference — attributes available for ZPA policy criteria and how they're sourced from the IdP | [`zpa.saml-attributes`](kb:zpa.saml-attributes) | draft |

## When the question spans multiple topics

Start at [`shared.policy-evaluation`](kb:shared.policy-evaluation) for the cross-feature mental model, then descend into the specific topic file.

## Open questions

- **Status column does not yet carry signal.** Every linked doc currently self-declares `author-status: draft` in its own frontmatter (verified across `machine-groups.md:28`, `legacy-endpoints.md:13`, `app-segments.md`, `segment-server-groups.md`, `api.md`), so the index status column correctly mirrors `draft` for all rows. The audit suggested promoting demonstrably-complete docs (e.g. `machine-groups.md`) to a higher status, but doing so here would contradict the doc's own frontmatter. Promotion should be driven from each doc's `author-status` (and supporting `confidence`/`source-tier`) being raised first — e.g. `machine-groups.md` is still `confidence: medium`, `source-tier: doc`, `last-verified: 2026-04-27` — after which the index column can be regenerated to match. Deferred until the per-doc statuses are advanced.
