---
product: zdx
topic: "zdx-overview"
title: "ZDX overview — architecture and scoring"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "https://help.zscaler.com/zdx/understanding-zdx-cloud-architecture"
  - "vendor/zscaler-help/understanding-zdx-cloud-architecture.md"
  - "https://help.zscaler.com/zdx/about-zdx-score"
  - "vendor/zscaler-help/about-zdx-score.md"
author-status: draft
---

# ZDX overview — architecture and scoring

What ZDX measures, what the score means, and how the score aggregates across users, applications, locations, and the organization. This is the foundation for every other ZDX question.

## Summary

ZDX continuously measures **user experience** across three dimensions:

1. **End-user device performance** — CPU, memory, Wi-Fi connectivity, health metrics gathered by Zscaler Client Connector.
2. **Cloud Path performance** — hop-by-hop network path metrics from user device to application.
3. **Application performance** — response time, DNS resolution, availability.

These feed a single **ZDX Score** on a 0-100 scale, aggregated at user, application, location, department, city, and organization levels. The score is the operational headline; the underlying metrics (Page Fetch Time, DNS Time, Server Response Time, TTFB, Hop Count, Packet Loss, Latency) are the drill-down.

## Mechanics

### ZDX components

From *Understanding the ZDX Cloud Architecture*:

| Component | Role |
|---|---|
| **ZDX Central Authority** | Control plane for ZDX — policy, software updates, config. "Design is similar to that of the Internet & SaaS CA" — implies active-passive topology like ZIA CA, not ZPA's active-active. |
| **Zscaler Client Connector** | Collects device metrics (negligible CPU cost per the help doc). Exchanges metrics ↔ policy with TPG. Provides lat/long geolocation if OS location services are enabled. |
| **Zero Trust Exchange integration** | Pulls users, departments, and locations from ZIA and ZPA clouds. Also integrates with ZCC Portal for ZIA definitions. Supports standalone ZDX tenants without ZIA/ZPA. |
| **Telemetry and Policy Gateway (TPG)** | Multi-tenant RESTful gateway. Routes metrics from ZCC to Microsoft Azure Data Explorer (ADX) and policies from ZDX cloud to ZCC. Stateless design for horizontal scale. |
| **ZDX Admin Portal** | Config, reporting, alerting, analysis UI. Integrates with ZIA/ZPA management for centralized config. RBAC with SSO. |
| **ZDX Analytics** | Runs on Microsoft Azure Data Explorer (ADX). The underlying analytics engine is Microsoft's, not Zscaler's. |
| **Call Quality Monitoring** | Integrates with Microsoft Graph API (for Teams) or Zoom to pull meeting / call-quality data. **Requires customer-specific onboarding** — not automatic. |

**Architectural quirk worth knowing**: ZDX's analytics backend is **Microsoft Azure Data Explorer**. Customer metrics land in Zscaler-owned ADX clusters. For customers with strict data-residency / cloud-provider constraints, this is a non-obvious dependency to flag.

**Cross-product**: ZDX is one of the three products that share the ZCC endpoint agent. ZCC entitlement via `ZdxGroupEntitlements` (see [`../zcc/entitlements.md`](../zcc/entitlements.md)) is the gate — users not entitled never report ZDX data regardless of portal config.

### ZDX Score — the headline metric

**Scale**: 0-100. **Buckets**:

| Bucket | Range | Color |
|---|---|---|
| Good | 66-100 | Green |
| Okay | 34-65 | Amber |
| Poor | 0-33 | Red |

**Primary input**: Page Fetch Time compared to the weighted average of peers in the same region, with a **baseline calculated daily on a rolling 7-day window**. Application availability also factors in — failed probes pull the score down.

### Score measurement cadence

- **Probes fire every 5 minutes** from ZCC to each app.
- **Each 5-minute measurement gets a 0-100 value.**
- **The lowest value within an hour becomes the hour's value** for that (user, app) pair.
- Hourly values roll up into the aggregates below.

"Lowest-value-wins within a time window" is the recurring pattern across ZDX's score aggregation. **ZDX reports the worst case, not the average** — a user who has one bad 5-minute window per hour gets a low hourly score even if the other 11 samples were fine. This is deliberate — UX problems manifest as occasional pain, not as linearly-degraded averages.

### Aggregation hierarchy

Each scope has its own calculation rule:

**Application score**:

1. For each user who accessed the app during the selected time period, take the **lowest value** that user experienced for the app.
2. Average those lowest-per-user values across users.

> Three users accessed an application. Lowest values: 42, 76, 62. Score = (42+76+62)/3 = 60.

**Department / location / city score**:

1. Identify the lowest value for users accessing apps from that department/location/city during each time interval.
2. Average the interval-level lowest-values across intervals.
3. For a 24-hour time range, interval = 1 hour; divide by **25** (24 hours + 1 for the starting score).

**Organization score**:

1. For each time interval, find the **application with the lowest value** — that app is the organization's score for that interval.
2. Average across intervals (same divide-by-N+1 pattern).

**User score**: the lowest application score they experienced during the time range. Represents the user's worst digital experience, not their average.

All scores rounded to the nearest whole number.

### Low scores — common causes

From the help article, typical root causes:

- **Device-local**: restarts, high CPU usage, memory pressure.
- **Connectivity**: Wi-Fi signal strength, captive portal transitions, tunnel failures.
- **Slow applications**: slow upstream (app-side bug, CDN issue, origin slowness).
- **Network latency**: Wi-Fi, home network, ISP congestion.

When a score is low, operators start a **Diagnostics Session** (aka deeptrace) on the affected device to get sub-5-minute-resolution data. See [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md).

### What ZDX Score does NOT tell you

- **The score is user-perceived performance, not application-side availability.** An app that's up but slow-for-one-region scores badly for that region; an app that's completely down scores low everywhere.
- **The score doesn't attribute root cause.** A 35/100 could be device, network, or app — the score alone can't tell. Cloud Path hop-by-hop and device health metrics are the attribution layer.
- **Lowest-within-window bias** means a score jump from 90 → 40 in one hour could be a single 40-sample window, not a sustained drop. Reading the underlying metric trend matters more than the score number for rapid-change scenarios.

## Pre-defined vs custom applications

ZDX ships with **predefined applications** — Zoom, Box, Salesforce, ServiceNow, Microsoft 365 (Teams, SharePoint Online, OneDrive for Business, Outlook). These come with pre-configured Web and Cloud Path probes. Customers can add **custom applications** with their own probes.

For custom apps, at least one Web probe is required to enable monitoring; Network-type custom apps need at least one Cloud Path probe instead (per [`./probes.md`](./probes.md)).

## Edge cases

- **ZIA Private Service Edge dashboard** exists separately from the standard ZDX dashboards — for tenants running PSE/VSE, a separate view monitors the on-prem edge health. Noted in the Related Articles of the Score doc.
- **Devices with location services off** still report ZDX metrics but without lat/long. Location-based dashboards (Regions by ZDX Score) may show those users in the correct logical location (department/city via ZIA/ZPA config) but not on the map.
- **Score for a user who accessed no apps**: score is not calculated — the user doesn't show up in per-user roll-ups. This is different from score 0.
- **Baseline dependency**: the 7-day rolling baseline means a **newly-added application has no baseline for its first week** — scores during that window compare against a shifting baseline. Expect noisy scores during app onboarding.

## Open questions

- Exact weighting between Page Fetch Time vs Availability in the final score — not documented numerically.
- What happens when ZCC can't reach the TPG (temporary cloud unreachable) — metrics are presumably buffered on-device and flushed on reconnect, but buffer size/retention not stated.
- Whether "lowest value within the hour" excludes zero values (which would be probe failures) or includes them — the answer materially affects how availability affects the score.

## Cross-links

- Probes (Web + Cloud Path) — [`./probes.md`](./probes.md)
- Diagnostics Sessions and Alerts — [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md)
- API surface — [`./api.md`](./api.md)
- ZCC entitlement (ZDX gate) — [`../zcc/entitlements.md`](../zcc/entitlements.md)
- Location-collection dual-source — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- Shared cloud architecture (how ZDX CA fits into the broader platform) — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
