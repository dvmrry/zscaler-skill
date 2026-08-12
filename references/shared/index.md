---
product: shared
topic: "shared-index"
title: "Shared / cross-product reference hub"
content-type: reference
last-verified: "2026-07-22"
confidence: high
source-tier: mixed
sources: []
author-status: draft
---

# Shared / cross-product reference hub

Docs under `references/shared/` are **not tied to a single Zscaler product**. They cover cross-cutting concerns: mental models for policy evaluation, the cloud architecture that hosts all products, activation mechanics, the glossary that translates between product naming conventions, and the catalog of inter-product configuration hooks.

## Topics

| Topic | File | Status |
|---|---|---|
| Policy evaluation meta-model — how ZIA and ZPA rule-evaluation differ (default-allow vs default-deny), what's shared, what isn't | [`./policy-evaluation.md`](./policy-evaluation.md) | draft |
| Cloud architecture — public production cloud-name map, Central Authority (ZIA active-passive vs ZPA active-active), Service Edge form factors, Nanolog, Feed Central, Business Continuity Cloud, Z-Tunnel vs M-Tunnel, PKI | [`./cloud-architecture.md`](./cloud-architecture.md) | draft |
| **Cross-product integrations** — the canonical catalog of hooks between ZIA, ZPA, ZCC, ZDX, ZBI, ZIdentity, Cloud Connector, ZWA — organized by direction of coupling, with failure-mode notes and a question-shape routing table | [`./cross-product-integrations.md`](./cross-product-integrations.md) | draft |
| Activation lifecycle — ZIA staged-vs-live gate, API endpoints, EUSA, ZPA contrast | [`./activation.md`](./activation.md) | draft |
| Terminology — legacy / current / log-field aliases across all products (ZEN, PSEN, Z-App, App Profile vs Web Policy, ZTW vs ZTC, etc.) | [`./terminology.md`](./terminology.md) | draft |
| Source IP Anchoring (SIPA) — ZIA+ZPA cross-product feature for preserving customer-controlled source IP at destination (Office 365 Conditional Access, IP-allowlist apps) | [`./source-ip-anchoring.md`](./source-ip-anchoring.md) | draft |
| SCIM provisioning — cross-product user/group lifecycle (ZIA + ZPA + ZIdentity), attribute-mapping differences, function-level Go SDK surface, and Python SDK verification gap | [`./scim-provisioning.md`](./scim-provisioning.md) | draft |
| **Secret-bearing API surfaces** — which read (GET/list) surfaces reveal secrets in cleartext (ZPA provisioning keys, ZTW `/apiKeys` + `/provUrl`, ZCC device secrets) vs withhold/mask them (ZIA admin password, sandbox token, ZIdentity OAuth client secret); the least-privilege API-client exclusion list; "read-only ≠ secret-free" | [`./secret-bearing-api-surfaces.md`](./secret-bearing-api-surfaces.md) | draft |
| **PAC files** — forwarding layer used by ZIA direct-PAC, ZCC PAC action, ZPA Browser Access, and Kerberos auth; Zscaler-specific variables (`${GATEWAY}` etc.) and their substitution mechanic | [`./pac-files.md`](./pac-files.md) | draft |
| **Device Posture** — cross-product (ZCC evaluates, ZPA + ZIA consume); posture types, evaluation cadence, Machine Tunnel integration, existing-connection immunity | [`./device-posture.md`](./device-posture.md) | draft |
| **Subclouds** — named subset of PSEs overriding geolocation default; three types (public / private / mixed), subcloud-qualified PAC variables, Zscaler-managed `CONUS`, propagation cascade (5m PAC / 15m ZCC / 10-20m effective) | [`./subclouds.md`](./subclouds.md) | draft |
| **NSS architecture** — log-egress layer (VM-based raw-TCP vs Cloud NSS HTTPS), 5-step NSS pipeline, one-hour replay (opt-in), feed-count caps (16 VM / 1-per-type Cloud), NSS-Collector distinction (Shadow IT ingestion, 10K eps cap), LSS-is-different | [`./nss-architecture.md`](./nss-architecture.md) | draft |
| **Admin RBAC** — three systems (ZIA rank+scope / ZPA feature-flags / ZIdentity modules), federation via Administrative Entitlements, API Clients ≠ admin users, ZIA scope is single-dimension-only, 6-month audit-log retention | [`./admin-rbac.md`](./admin-rbac.md) | draft |
| **OneAPI** — unified gateway (`api.zsapi.net` for commercial, FedRAMP-specific gateway/auth hosts for capable gov clients), four auth flows (OneAPI OAuth — including ZDX on ZIdentity tenants — plus ZDX legacy SHA256, ZCC legacy, and ZIA/ZPA legacy for pre-ZIdentity or client/provider-specific gov paths), `audience=https://api.zscaler.com` is REQUIRED, per-product rate limits + headers (different names per product), HTTP status codes, read-only mode, ZIA+CBC activation gate, Postman + reconstructed Automate contracts as machine-readable surfaces | [`./oneapi.md`](./oneapi.md) | draft |
| **Event Monitoring API** — shared event catalog, subscription CRUD, notification-channel discovery, SNS role/policy requirements, and topic-access verification | [`./event-monitoring.md`](./event-monitoring.md) | draft |
| Log-correlation guidance — when to consult logs vs rely on config, cross-product correlation patterns | [`./log-correlation.md`](./log-correlation.md) | draft |
| SPL query patterns — canonical SPL snippets for Zscaler log analysis | [`./splunk-queries.md`](./splunk-queries.md) | draft |
| **Analytics GraphQL API** — ZInsights reporting domains via GraphQL; query shape; authentication; pagination; ZDX REST contrast | [`./analytics-graphql.md`](./analytics-graphql.md) | draft |
| **Cross-product audit logs** — audit-log framework across ZIA, ZPA, ZDX; field alignment; retention periods by product; query approach | [`./audit-logs.md`](./audit-logs.md) | draft |
| **M365 Conditional Access via SIPA** — IP-based Conditional Access policy with Zscaler egress anchoring; setup pattern; limitations and failure modes | [`./m365-conditional-access.md`](./m365-conditional-access.md) | draft |
| **Multi-cluster load sharing** — ZIA policy enforcement and traffic distribution across data center clusters; failover semantics; cluster selection | [`./multi-cluster-load-sharing.md`](./multi-cluster-load-sharing.md) | draft |
| **Zscaler SDK landscape** — Python and Go SDK structure across products, client construction, auth flows, common patterns | [`./zsdk.md`](./zsdk.md) | draft |
| **MCP server** — cross-product transport hardening, Host validation, executable write-tool gating, upstream documentation contradiction, and inventory/dependency provenance | [`./mcp-server.md`](./mcp-server.md) | draft |
| **Claims ledger** — first-pass Tier 2 audit ledger for source-backed shared claims changed or explicitly guarded in this refresh | [`./_claims-ledger.md`](./_claims-ledger.md) | draft |
| **Devin runtime notes** (agent infrastructure) — how Devin processes `.devin/workflows/` and `.devin/rules/`; conventions for authoring workflow shims that work across CC and Devin | [`../../agents/_meta/devin-runtime-notes.md`](../../agents/_meta/devin-runtime-notes.md) | draft |

## When to start here vs a product directory

- **Start here** when a question doesn't obviously belong to one product — "how does Zscaler authenticate API calls?", "how do these products fit together?", "what does ZEN mean?", "why is my change not taking effect?"
- **Start in a product directory** (`references/zia/`, `references/zpa/`, etc.) when the question names a specific feature of one product.
- **Start in `cross-product-integrations.md`** when the question smells multi-product — "traffic hit ZIA then ZPA, something's weird" or "why didn't this feature work across products?"

## What the `_meta/clarifications.md` at the parent level is for

`references/_meta/clarifications.md` is the canonical index of open and resolved questions across the skill — each with a stable ID (`zia-03`, `shared-02`, etc.) that reference docs cross-link to. Skim it when reading any doc that cites a clarification; answer confidence should match the current status.
