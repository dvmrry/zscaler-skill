---
product: zdx
topic: "zdx-cloud-architecture"
title: "ZDX cloud architecture — components, telemetry path, regional model, auth boundary"
content-type: reasoning
last-verified: "2026-05-05"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-zdx-cloud-architecture.md"
  - "vendor/zscaler-help/about-zdx-score.md"
  - "vendor/zscaler-help/understanding-zdx-api.md"
  - "vendor/zscaler-help/legacy-api-authentication-zdx.md"
  - "vendor/zscaler-help/legacy-getting-started-zdx-api.md"
  - "vendor/zscaler-help/viewing-and-configuring-zdx-module-upgrades.md"
author-status: draft
---

# ZDX cloud architecture

Component-level picture of the ZDX cloud — Central Authority, TPG, ZDX Analytics, the telemetry path from ZCC to ADX, the regional baseline model, the API auth boundary, and module deployment mechanics.

## Summary

ZDX is a distinct Zscaler product with its own control plane (ZDX Central Authority), its own metrics gateway (Telemetry and Policy Gateway), and its own analytics engine (Microsoft Azure Data Explorer). It is not built on ZIA or ZPA data-plane infrastructure. ZIA/ZPA are integration points for user/department/location metadata, not for telemetry transit.

The end-to-end telemetry path is:

```
ZCC (device) → TPG (metrics gateway) → Microsoft ADX (Zscaler-owned clusters)
                     ↑ policy returned to ZCC
```

API access uses a separate OAuth 2.0 credential stack (API key_id + key_secret), not ZIdentity/OneAPI.

## Components

### ZDX Central Authority (CA)

The ZDX CA is the control plane for ZDX. It provides a central location for software and database updates, policy, and configuration settings. Its design is described as "similar to that of the Internet & SaaS CA," meaning an active-passive topology is implied — but this is not explicitly confirmed for ZDX. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:46-48`)

What the ZDX CA does:

- Manages policy and configuration distribution to ZCC (via the TPG).
- Orchestrates software updates to ZDX Module on ZCC.
- Does not handle customer traffic — it is a control plane only.

For the ZIA CA topology (active + two passive standbys) and ZPA CA topology (active-active distributed), see [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md).

### Zscaler Client Connector (ZCC)

ZCC is the on-device agent responsible for all ZDX telemetry collection. It continuously gathers:

- Device performance metrics: CPU usage, memory usage, Wi-Fi connectivity.
- Application performance metrics: DNS resolution time, response time, availability.

ZCC exchanges information bidirectionally with the Telemetry and Policy Gateway — reporting metrics upward and receiving ZDX configuration (policy) downward. The additional CPU cost of ZDX metric collection is described as negligible. ZCC also provides latitude and longitude coordinates for geolocation, but only if the operating system's location services are enabled. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:50-52`)

ZDX is one of three products that share the ZCC endpoint agent. Users not entitled to ZDX do not report ZDX metrics regardless of portal configuration — see [`../zcc/entitlements.md`](../zcc/entitlements.md).

### Zero Trust Exchange (ZTE) integration

The ZDX cloud connects and authenticates to ZIA (Internet & SaaS) and ZPA (Private Access) clouds to retrieve users, departments, and locations. It also connects to the Zscaler Client Connector Portal for integrated management of ZCC and ZIA definitions. Standalone ZDX deployments without ZIA or ZPA are supported — user-definition infrastructure is included for that case. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:54-56`)

This integration is for **metadata** (identity, location, department), not for telemetry transit. ZDX telemetry does not flow through ZIA or ZPA data-plane components.

### Telemetry and Policy Gateway (TPG)

The TPG is a multi-tenant RESTful application that acts as the bidirectional gateway between ZCC and the ZDX cloud. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:58-60`)

- Receives metrics from ZCC and routes them to Microsoft Azure Data Explorer (ADX).
- Returns ZDX policy/configuration to ZCC.
- Stateless design for horizontal scalability.

The TPG is distinct from ZIA/ZPA data-plane components. It is not a Service Edge and does not participate in ZIA log routing or ZPA M-Tunnel management.

### ZDX Admin Portal

The ZDX Admin Portal provides administrator access for configuration, reporting, alerting, and analysis. It integrates with ZIA/ZPA management to provide centralized configuration. ZDX provides granular role-based access control (RBAC) with single sign-on (SSO) via the Zscaler Client Connector Portal. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:62-64`)

### ZDX Analytics

ZDX Analytics runs on Microsoft Azure Data Explorer (ADX). The underlying analytics engine is Microsoft's; Zscaler operates its own ADX clusters and routes customer metrics into them. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:66-68`)

This is a non-obvious architectural dependency: customer telemetry lands in Microsoft Azure infrastructure (Zscaler-owned clusters). Customers with strict cloud-provider or data-residency constraints should be aware. Data-residency configuration options are not documented in vendor sources.

### Call Quality Monitoring

ZDX integrates with Microsoft Graph API (for Microsoft Teams) or Zoom to read meeting and call quality data. Customer-specific onboarding is required — integration does not activate automatically. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:70-72`)

## Telemetry path (step by step)

| Step | What happens | Source |
|---|---|---|
| 1. Collection | ZCC continuously gathers device metrics (CPU, memory, Wi-Fi) and app metrics (DNS resolution, response time). Probes fire every 5 minutes per app. | `vendor/zscaler-help/understanding-zdx-cloud-architecture.md:22-35`, `vendor/zscaler-help/about-zdx-score.md:38` |
| 2. Transmission | ZCC reports metrics to TPG. TPG returns policy to ZCC. | `vendor/zscaler-help/understanding-zdx-cloud-architecture.md:50-52, 58-60` |
| 3. Ingestion | TPG receives metrics and routes them to Microsoft Azure Data Explorer (Zscaler-owned ADX clusters). | `vendor/zscaler-help/understanding-zdx-cloud-architecture.md:58-60` |
| 4. Storage & analytics | ADX stores metrics. ZDX Analytics processes metrics for scoring and dashboard display. | `vendor/zscaler-help/understanding-zdx-cloud-architecture.md:66-68` |
| 5. Retrieval | ZDX Admin Portal queries ZDX Analytics. ZDX Public API also exposes this data programmatically. | `vendor/zscaler-help/understanding-zdx-api.md:29-30`, `vendor/zscaler-help/understanding-zdx-cloud-architecture.md:62-64` |

**Reporting delay:** The ZDX API documentation explicitly states an estimated **20-minute delay from collection to reporting**. ZCC does the work of collecting and reporting telemetry; this processing causes the latency. To retrieve the full data for a given hour, callers must adjust timestamps to account for this delay. (`vendor/zscaler-help/understanding-zdx-api.md:68-69`)

**API data vs. UI data:** The ZDX API may return values that differ marginally from the ZDX UI — up to approximately 2% — because aggregated metrics use approximate functions for performance. Example: Page Fetch Time shown as 89ms in UI may appear as 90ms via API. (`vendor/zscaler-help/understanding-zdx-api.md:62-64`)

**No Service Edge involvement in ZDX collection.** Service Edges (ZIA/ZPA data plane) are part of the network path that Cloud Path probes measure, not part of the ZDX telemetry collection infrastructure. ZDX has its own metrics gateway (TPG) separate from ZIA's log routing to Nanolog. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:58-60`)

## Regional model

**Regional score aggregation** is done by country location of all users accessing a selected application. "Regions by ZDX Score assesses the country locations of all users accessing a selected application." (`vendor/zscaler-help/about-zdx-score.md:43-44`)

**Baseline calculation:** The ZDX Score for applications is based primarily on Page Fetch Time compared to the weighted average of others in the same region. Baseline metrics are calculated daily for each application on a rolling 7-day window. A region must have at least one active device to have a baseline. (`vendor/zscaler-help/about-zdx-score.md:43-44`)

**Geolocation data source:** ZCC provides latitude and longitude coordinates for geolocation if the operating system's location services are enabled. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:52`) How ZDX determines region boundaries from lat/long coordinates (country vs. city vs. continent), or the fallback when location services are off, is not documented in vendor sources.

**Baseline onboarding effect:** Because baselines are calculated on a rolling 7-day window, a newly-added application has no stable baseline for its first week. Scores during that window reflect a shifting baseline — expect noisier scores during application onboarding.

## Auth boundary

### ZDX API authentication

ZDX uses OAuth 2.0 with API key_id + key_secret credentials obtained from the ZDX Admin Portal. This is **not** ZIdentity/OneAPI. (`vendor/zscaler-help/legacy-api-authentication-zdx.md:8-27`)

**Token endpoint:**

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/oauth/token` | Authenticate with key_id + key_secret; returns Bearer token |
| `GET` | `/oauth/jwks` | Returns JWKS public keys for JWT signature verification |
| `GET` | `/oauth/validate` | Checks if a JWT token is valid |

Request body for `/oauth/token`:

```json
{ "key_id": "<key_id>", "key_secret": "<key_secret>" }
```

Response fields: `token` (string), `token_type` (default: `Bearer`), `expires_in` (default: `3600` seconds). (`vendor/zscaler-help/legacy-api-authentication-zdx.md:19-27`)

A score of `-1` returned by the API indicates no data is available for the queried parameters — it is not an error code. (`vendor/zscaler-help/understanding-zdx-api.md:72-74`)

**Distinction from ZIdentity/OneAPI:** The Getting Started guide explicitly distinguishes ZDX API from OneAPI: "If you need to obtain API keys, authenticate into, and make calls using Zscaler OneAPI endpoints, see About API Clients in ZIdentity..." — i.e., ZDX API authentication is a separate credential system and does not use the ZIdentity/OneAPI stack. (`vendor/zscaler-help/legacy-getting-started-zdx-api.md:17`)

**Prerequisites for API access:** The organization must create an API key and must be a ZDX Advanced Plan subscriber. (`vendor/zscaler-help/legacy-getting-started-zdx-api.md:13-15`)

**Alert and Report API time-range constraint:** Most Alert and Report API endpoints require a 2-hour maximum time range per request. To retrieve data covering longer periods, multiple requests with non-overlapping 2-hour windows must be made. Exceptions: `/alerts/{alert_id}`, `/alerts/{alert_id}/affected_devices`, and `/devices/{deviceid}/events` do not require a time range. (`vendor/zscaler-help/understanding-zdx-api.md:31-49`)

### Admin portal authentication

The ZDX Admin Portal provides RBAC with SSO via the Zscaler Client Connector Portal. (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:64`) The specific auth protocol (OIDC, SAML, OAuth) is not documented in vendor sources.

## ZDX Module deployment and upgrades

ZDX functionality on ZCC is delivered as a separately versioned ZDX Module. The module lifecycle is managed through ZCC.

**Automatic rollout:** Zscaler regularly releases new versions of the ZDX Module compatible with ZCC for Windows and macOS. ZCC automatically rolls out the latest version. (`vendor/zscaler-help/viewing-and-configuring-zdx-module-upgrades.md:16`)

**Delayed rollout:** Organizations can configure a delayed rollout to apply a ZDX Module version to selected user groups for testing, for up to 180 days. This feature requires enablement by Zscaler Support. (`vendor/zscaler-help/viewing-and-configuring-zdx-module-upgrades.md:16, 18`)

**Manual deployment:** Organizations can download a ZDX Module upgrade package and deploy it manually via Mobile Device Management (MDM) or CLI. This feature is available in ZCC version 4.7 and later for Windows only. (`vendor/zscaler-help/viewing-and-configuring-zdx-module-upgrades.md:20`)

Which ZDX cloud component (CA, TPG, or separate service) orchestrates delayed rollout version targeting is not documented in vendor sources.

## Multi-tenancy

The TPG is explicitly described as a "multi-tenant RESTFUL application." (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:58`) Customer metrics are routed to Zscaler-owned ADX clusters. The specific isolation mechanism within ADX (RBAC, table partitioning, encryption at rest) is not documented in vendor sources. Data retention periods are also not documented.

## Open questions

- **ZDX CA topology (active-passive vs. active-active)** — the source states design is "similar to that of the Internet & SaaS CA" (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:48`), implying active-passive, but ZDX CA topology is not explicitly confirmed. Requires Zscaler documentation or lab verification.
- **Region boundary definition** — how ZDX converts lat/long or IP to a region (country vs. city vs. continent), and what fallback applies when OS location services are off. Not documented in vendor sources.
- **Data retention and GDPR** — no documented retention period, purge policies, or data-residency configuration options. The Microsoft ADX dependency may be material for customers with cloud-provider constraints.
- **TPG geo-distribution and failover** — stateless design is documented; SLA, regional deployment footprint, and failure-domain handling for the TPG itself are not documented.
- **ZCC buffer behavior when TPG is unreachable** — whether ZCC buffers metrics on-device and flushes on reconnect, buffer size, and flush behavior are not documented.
- **Cloud Path probe routing through Service Edges** — sources note that Cloud Path probes can visualize tunneling through a Public Service Edge, but whether this is mandatory, conditional on network path, or per-probe-config optional is not documented.
- **Call Quality Monitoring data flow** — polling frequency, latency, and failure modes for Microsoft Graph / Zoom integration are not documented.
- **ADX tenant isolation mechanism** — specific isolation at the ADX layer (partitioning, RBAC, encryption) is not documented.

## Cross-links

- ZDX overview and score mechanics — [`./overview.md`](./overview.md)
- Probe measurement types and targeting — [`./probes.md`](./probes.md)
- ZCC entitlement (ZDX gate for metrics reporting) — [`../zcc/entitlements.md`](../zcc/entitlements.md)
- Shared Zscaler cloud architecture (CA topology, ZIA CA active-passive, ZPA CA active-active) — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
