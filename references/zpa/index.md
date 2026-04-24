---
product: zpa
topic: "zpa-index"
title: "ZPA reference hub"
content-type: reference
last-verified: "2026-04-23"
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
| Policy precedence — access, timeout, client forwarding, inspection | [`./policy-precedence.md`](./policy-precedence.md) | stub |
| App Connector — VM model, groups, provisioning keys, scheduled software updates, certificate enrollment | [`./app-connector.md`](./app-connector.md) | draft |
| ZPA API — endpoints, authentication, response shapes | [`./api.md`](./api.md) | stub |

## Log schemas

| Schema | File | Status |
|---|---|---|
| LSS User Activity log fields — per-connection records; segment, connector, policy, timestamps, bytes | [`./logs/access-log-schema.md`](./logs/access-log-schema.md) | draft |

For SPL patterns see [`../shared/splunk-queries.md`](../shared/splunk-queries.md); for when to query see [`../shared/log-correlation.md`](../shared/log-correlation.md).

## When the question spans multiple topics

Start at [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md) for the cross-feature mental model, then descend into the specific topic file.
