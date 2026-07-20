---
product: risk360
topic: "risk360-index"
title: "Risk360 reference hub"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: 4371c9bab44d852526721b4b5999e2471dda5198
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: 6e6509f001ca71adcedfd4884250d09227395bf0
  vendor/terraform-provider-zpa: 02c88e27da98ec75f7a7a85f43486b4f0552dfa9
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 23912913f8588c650b104d3bd30c0c755d6962cd
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
