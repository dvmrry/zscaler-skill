---
role: investigator
artifact: grounding
title: "ZPA connector assignment — investigation grounding card"
content-type: reference
last-verified: "2026-05-07"
confidence: medium
source-tier: practice
sources:
  - "`kb:zpa.app-connectors`"
  - "`kb:zpa.server-groups`"
  - "`kb:zpa.app-segments`"
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

- [`zpa.app-connectors`](kb:zpa.app-connectors) — the eligibility gates (CONNECTED status, target reachability via `AliveTargetCount`, group association). An empty `Connector` field in LSS means no connector was eligible — fix is on the eligibility side, not the connector→app hop.
- [`zpa.server-groups`](kb:zpa.server-groups) — the per-link verification recipe.

## Load docs

- `kb:zpa.app-connectors`
- `kb:zpa.server-groups`
- `kb:zpa.app-segments`
- `references/zpa/logs/app-connector-metrics.md`

## Inspect tenant config

- The overlay's IaC (when `overlay.json` declares `iac`) for `zpa/app-segments`, `zpa/server-groups`, `zpa/connector-groups`, and `zpa/app-connectors`
- Live, read-only, only when IaC cannot answer or for drift: `zscalerctl zpa app-segments list`, `zscalerctl zpa server-groups list`, `zscalerctl zpa connector-groups list`, `zscalerctl zpa app-connectors list` (connector status is live-only state)

(Do not scan broad `_data/`. Use `node scripts/kb.mjs resolve <type-id>` for field shapes.)

## Use runtime logs only when

- The config chain (segment → server group → connector group → connectors) is intact in the tenant config, AND
- Target reachability or per-port health needs to be confirmed at runtime, OR
- Assignment reason (connector picked or not picked, why) needs LSS evidence the tenant config can't provide
