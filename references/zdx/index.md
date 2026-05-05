---
product: zdx
topic: "zdx-index"
title: "ZDX reference hub"
content-type: reference
last-verified: "2026-05-05"
confidence: medium
sources: []
author-status: draft
---

# Zscaler Digital Experience (ZDX) reference hub

Entry point for ZDX questions — user experience monitoring, app health, Cloud Path hop visualization, Diagnostics Sessions (a.k.a. "deeptraces" in the SDK/MCP), and alerts. Distinct from ZIA/ZPA: ZDX is observational / UX-telemetry-focused, not policy enforcement.

## Why ZDX is a different question shape

ZIA/ZPA/ZCC answers are about policy precedence and configuration — "what will happen to this traffic?" ZDX answers are about **user experience** — "why is this user reporting Slack is slow?", "is it the network or the app?", "is this a one-user problem or a fleet-wide issue?". The reasoning patterns that dominate ZIA (first-match-wins, specificity-wins) don't apply here. ZDX is a metrics product, and the skill's job is to route operator questions to the right metric, probe, or diagnostic session.

## Topics

| Topic | File | Status |
|---|---|---|
| Architecture and ZDX Score — components (CA, TPG, ZCC client-side), the 0-100 score, how scores aggregate across users/apps/locations | [`./overview.md`](./overview.md) | draft |
| **ZDX Score** — 0-100 score model deep-dive: PFT input, regional baseline (7-day rolling), 5-minute probe cadence, lowest-value-wins hourly rollup, score-retrieval API endpoints | [`./score.md`](./score.md) | draft |
| **Cloud architecture** — Central Authority, ZCC, TPG (multi-tenant RESTful gateway), ADX storage, Admin Portal; 20-minute reporting delay; OAuth 2.0 auth distinct from ZIdentity OneAPI | [`./cloud-architecture.md`](./cloud-architecture.md) | draft |
| **Applications** — pre-defined apps (Zoom, Box, Salesforce, ServiceNow, M365), classification, read-only API surface, MostImpactedRegion field asymmetry between Python and Go | [`./applications.md`](./applications.md) | draft |
| **Devices** — device inventory, hardware/network/software fields, Wi-Fi-specific Go-only fields (`wifi_adapter`, `ssid`, `bssid`), `os_build` Python-only | [`./devices.md`](./devices.md) | draft |
| **Reports** — umbrella over apps/devices/users (NOT an aggregation engine); call-quality-metrics (Microsoft Teams/Zoom), top-processes, deeptrace endpoints | [`./reports.md`](./reports.md) | draft |
| **Administration** — SDK is misnamed: it's read-only filter helpers (departments + locations lookup), NOT admin user management | [`./administration.md`](./administration.md) | draft |
| Probes — Web probes vs Cloud Path probes, what each measures, probe-criteria AND/OR logic | [`./probes.md`](./probes.md) | draft |
| Diagnostics Sessions and Alerts — on-demand deep-investigation workflow (SDK calls these "deeptraces"; help site calls them Diagnostics Sessions), alert status lifecycle | [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md) | draft |
| ZDX API — SDK surface under `client.zdx.*`, wire terminology ("deeptrace" ≠ "Diagnostics Session") | [`./api.md`](./api.md) | draft |
| **ZDX SDK** — Python and Go service catalog (`client.zdx.*`); method summary; "deeptrace" terminology map | [`./sdk.md`](./sdk.md) | draft |
| **API schemas** — endpoint catalog and response-shape reference derived from the ZDX SDK | [`./api-schemas.md`](./api-schemas.md) | draft |

## Terminology watchout

- **"Deeptrace"** is the SDK/MCP name for what the admin portal calls **"Diagnostics Session"**. Both refer to the same on-demand investigation workflow. Operators reading the admin portal UI use "Diagnostics Session"; operators using the API use "deeptrace." Route based on which context the question came from.
- **Cloud Path** is the hop-by-hop network-path visualization feature, not to be confused with generic "cloud path" as a phrase.
- **Probe** is ZDX-specific — different from ZIA ATP's "malicious URL probes" or ZPA's internal health checks.

## What this hub does NOT cover

- **Zscaler Hosted Probes** (server-side probe configuration for apps users don't directly access). Mentioned in `about-probes.md` but not deep-dived.
- **Service Desk / RBAC roles** for ZDX admin delegation.
- **Adaptive Mode** probing — referenced in help articles as a dynamic probe-frequency adjustment mechanism; not yet codified.

## When the question spans ZDX + another product

- **"User's ZIA traffic is slow" → actually a ZPA issue, or vice versa.** Cloud Path can distinguish "client to Service Edge slow" from "Service Edge to destination slow" — the hop-by-hop visualization is the discriminator. Start at [`./probes.md § Cloud Path`](./probes.md).
- **"ZDX has no data for this user" → entitlement check.** ZDX requires the user to be entitled via `ZdxGroupEntitlements` on ZCC (see [`../zcc/entitlements.md`](../zcc/entitlements.md)). Entitled-but-not-reporting is different from not-entitled.
- **"ZDX collects location but it's wrong/missing" → two-flag dependency.** Requires `WebPrivacy.collect_zdx_location = true` AND `ZdxGroupEntitlements.collect_zdx_location = true`. See [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md).
