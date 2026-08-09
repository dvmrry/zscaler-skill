---
product: risk360
topic: "risk360-index"
title: "Risk360 reference hub"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: 8a73a5fcf0bbb8507a47c09e9a6f379447ce3807
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/what-risk360.md"
  - "vendor/zscaler-help/risk360-about-dashboard.md"
  - "vendor/zscaler-help/risk360-about-factors.md"
  - "vendor/zscaler-help/risk360-monte-carlo.md"
  - "vendor/zscaler-help/risk360-product-marketing.md"
  - "vendor/zscaler-sdk-python/tests/integration/zid/cassettes/TestResourceServers.yaml"
author-status: draft
---

# Risk360 reference hub

Risk360 is the Zscaler risk-quantification reference area. Start with [`./overview.md`](./overview.md) for the current audit-scoped summary of its risk model, dashboard, factors, Monte Carlo financial modeling, and source-family coverage. The product-help capture says Risk360 provides real-time risk metrics at the organization level and across four attack stages (`vendor/zscaler-help/what-risk360.md:8-13`), while the marketing capture emphasizes cyber risk posture, actionable insights, and financial exposure framing (`vendor/zscaler-help/risk360-product-marketing.md:8-24`).

## Topics

| Topic | File | Status |
|---|---|---|
| Risk model, telemetry/log sources, dashboard, factors, Monte Carlo, and API-surface audit | [`./overview.md`](./overview.md) | draft |
| Claim-by-claim ledger for this refresh | [`./_claims-ledger.md`](./_claims-ledger.md) | draft |

## Use This Reference For

- Explaining the four Risk360 attack-stage categories: External Attack Surface, Compromise, Lateral Propagation, and Data Loss (`vendor/zscaler-help/what-risk360.md:8-13`).
- Answering dashboard questions about organization risk score, peer average, severity ranges, and Top 10 Factors (`vendor/zscaler-help/risk360-about-dashboard.md:8-48`).
- Explaining Monte Carlo output: yearly average loss and loss exceedance curves across four scenarios (`vendor/zscaler-help/risk360-monte-carlo.md:12-34`).
- Guarding against API over-claims: the audited sources do not show a Risk360 management API, only an incidental ZIdentity role fixture for Risk360 entitlements (`vendor/zscaler-sdk-python/tests/integration/zid/cassettes/TestResourceServers.yaml:25-28`, `:132-135`).

## Current Limits

- The full current factor catalog, factor weights, and peer-benchmark methodology are not captured. See [clarification risk360-02](../_meta/clarifications.md#risk360-02-risk360-factor-catalog-weighting-and-peer-benchmark-methodology).
- Risk360 programmable API or export automation is unresolved. See [clarification risk360-01](../_meta/clarifications.md#risk360-01-risk360-programmable-api-and-export-surface).

## Cross-Links

- ZIA: [`../zia/index.md`](../zia/index.md)
- ZPA: [`../zpa/index.md`](../zpa/index.md)
- Shared admin/RBAC context: [`../shared/admin-rbac.md`](../shared/admin-rbac.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
