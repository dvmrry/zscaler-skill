---
role: investigator
artifact: route
title: "ZPA connector assignment — investigation route card"
content-type: reference
last-verified: "2026-05-07"
confidence: medium
source-tier: practice
sources:
  - "references/zpa/app-connector.md"
  - "references/zpa/segment-server-groups.md"
  - "references/zpa/app-segments.md"
  - "references/zpa/logs/app-connector-metrics.md"
author-status: draft
---

# ZPA connector assignment

## Use when

- LSS access log has empty `Connector` field
- User reports "no connector available" or session never reaches the app
- Private app fails after policy appears to allow access
- Connector group is healthy on its own but app sessions still aren't being assigned

## Expected behavior anchors

Read these *before* interpreting any logs. Establish what *should* happen in the segment → server group → connector chain before reasoning about why it didn't.

- [`references/zpa/app-connector.md § How sessions are assigned to App Connectors`](../../../references/zpa/app-connector.md) — the eligibility gates (CONNECTED status, target reachability via `AliveTargetCount`, group association). An empty `Connector` field in LSS means no connector was eligible — fix is on the eligibility side, not the connector→app hop.
- [`references/zpa/segment-server-groups.md § Verifying the segment → server group → connector chain (snapshot recipe)`](../../../references/zpa/segment-server-groups.md) — the per-link verification recipe.

## Load docs

- `references/zpa/app-connector.md`
- `references/zpa/segment-server-groups.md`
- `references/zpa/app-segments.md`
- `references/zpa/logs/app-connector-metrics.md`

## Inspect snapshot

- `_data/snapshot/<cloud>/zpa/app-segments.json`
- `_data/snapshot/<cloud>/zpa/server-groups.json`
- `_data/snapshot/<cloud>/zpa/connector-groups.json`
- `_data/snapshot/<cloud>/zpa/app-connectors.json`

(Fork layouts may use `_data/<cloud>/zpa/...` or `_data/snapshot/zpa/...` without the `<cloud>/` segment — scan `_data/` for the actual layout if the canonical path is empty.)

## Use runtime logs only when

- The config chain (segment → server group → connector group → connectors) is intact in the snapshot, AND
- Target reachability or per-port health needs to be confirmed at runtime, OR
- Assignment reason (connector picked or not picked, why) needs LSS evidence the snapshot can't provide
