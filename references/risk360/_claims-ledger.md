---
product: risk360
topic: "risk360-claims-ledger"
title: "Risk360 claims ledger - Tier 3 thin-stub refresh"
content-type: reference
last-verified: "2026-06-16"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
  vendor/terraform-provider-zia: 717926eb564bb21dea1f8e0c3222e6593b29f849
  vendor/terraform-provider-zpa: 8d7d7f3a8fc63bd428233b629eb08bce834e975c
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 84ab824d6ce5853c12add6ae3280dcfb8db273a2
  vendor/zscaler-mcp-server: a2162c384e1ffb68b3bf14783ea9a1a762c85ff5
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/what-risk360.md"
  - "vendor/zscaler-help/risk360-about-dashboard.md"
  - "vendor/zscaler-help/risk360-about-factors.md"
  - "vendor/zscaler-help/risk360-about-asset-level-risk.md"
  - "vendor/zscaler-help/risk360-monte-carlo.md"
  - "vendor/zscaler-help/risk360-logs-retention.md"
  - "vendor/zscaler-help/risk360-product-marketing.md"
  - "vendor/zscaler-sdk-python/tests/integration/zid/cassettes/TestResourceServers.yaml"
author-status: draft
---

# Risk360 claims ledger

This ledger covers the Tier 3 thin-stub refresh for Risk360. Rows either cite exact source lines, identify an open question, or mark an audit-scoped absence from the checked source families.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| Risk360 provides real-time risk metrics at organization level and across four attack stages. | `index.md`, `overview.md` | `vendor/zscaler-help/what-risk360.md:8-13` |
| Risk360 help frames benefits around holistic analysis, Monte Carlo financial exposure, stakeholder reporting, peer benchmarking, compliance, ZTE integration, and no additional hardware upgrades. | `overview.md` | `vendor/zscaler-help/what-risk360.md:15-22` |
| Risk360 ingests data from an existing Zscaler deployment and produces cyber-risk posture insights. | `index.md`, `overview.md` | `vendor/zscaler-help/risk360-product-marketing.md:8-10` |
| Named Risk360 telemetry sources include ZIA, ZPA, DLP policies, ThreatLabz, and external attack surface metrics. | `overview.md` | `vendor/zscaler-help/risk360-product-marketing.md:20-22` |
| Risk360 logs are duplicates of configuration and transaction logs from other Zscaler SaaS products such as ZIA/ZPA. | `overview.md` | `vendor/zscaler-help/risk360-logs-retention.md:8-12` |
| Risk360 log retention is up to one year during subscription, with storage in the United States or European Union. | `overview.md` | `vendor/zscaler-help/risk360-logs-retention.md:14-20` |
| Captured factor counts differ: one marketing line says 140+, another says more than 115. | `overview.md` | `vendor/zscaler-help/risk360-product-marketing.md:16-24` |
| Dashboard exposes risk score, industry-peer average, risk trends, risk events by location, contributing factors by entity, and Top 10 Factors with a `Licensed?` column. | `index.md`, `overview.md` | `vendor/zscaler-help/risk360-about-dashboard.md:8-16`, `:27-48` |
| Risk360 severity ranges are 0-25 Low, 26-50 Medium, 51-75 High, and 76-100 Critical. | `overview.md` | `vendor/zscaler-help/risk360-about-dashboard.md:18-25` |
| Factors are quantified by risk weight and mapped to MITRE and NIST. | `overview.md` | `vendor/zscaler-help/risk360-about-factors.md:8` |
| CrowdStrike is named as a vendor integration that contributes risky events and activities to Risk360 factors. | `overview.md` | `vendor/zscaler-help/risk360-about-factors.md:10` |
| Factor views are Attack-Based and Entity-Based. | `overview.md` | `vendor/zscaler-help/risk360-about-factors.md:17-20` |
| Asset-level risk highlights risky assets and supports drill-downs; the model uses 65+ indicators across pre-infection, post-infection, and suspicious behavior. | `overview.md` | `vendor/zscaler-help/risk360-about-asset-level-risk.md:8-20` |
| Risk360 runs Monte Carlo simulation 1,000 times per day per organization. | `index.md`, `overview.md` | `vendor/zscaler-help/risk360-monte-carlo.md:10-12` |
| Monte Carlo iterations randomize breach event and financial loss within a confidence interval. | `overview.md` | `vendor/zscaler-help/risk360-monte-carlo.md:14-17` |
| Monte Carlo outputs include yearly average loss and loss exceedance curve. | `index.md`, `overview.md` | `vendor/zscaler-help/risk360-monte-carlo.md:18-23` |
| Monte Carlo scenarios are inherent risk, residual risk after top-ten mitigation, last 30-day average risk, and industry peer risk. | `index.md`, `overview.md` | `vendor/zscaler-help/risk360-monte-carlo.md:25-34` |
| Python source has only an incidental ZIdentity resource-server fixture for service `ZRA` / display name `Risk360` and Risk360 role scopes; it is not a Risk360 management service. | `index.md`, `overview.md` | `vendor/zscaler-sdk-python/tests/integration/zid/cassettes/TestResourceServers.yaml:25-28`, `:132-135` |
| Go SDK has no product-specific Risk360 service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Risk360 service found in `vendor/zscaler-sdk-go` during the 2026-06-16 surface sweep. |
| Terraform has no product-specific Risk360 resource or data source in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Risk360 resource/data-source surface found in `vendor/terraform-provider-zia` or `vendor/terraform-provider-zpa` during the 2026-06-16 surface sweep. |
| Ansible has no product-specific Risk360 module in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Risk360 module found in `vendor/ziacloud-ansible` or `vendor/zpacloud-ansible` during the 2026-06-16 surface sweep. |
| MCP has no product-specific Risk360 tool in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Risk360 tool found in `vendor/zscaler-mcp-server` during the 2026-06-16 surface sweep. |
| Postman has no Risk360 endpoint family in the audited collection. | `overview.md` | AUDIT-SCOPED ABSENCE: no Risk360 endpoint family found in `vendor/zscaler-api-specs/oneapi-postman-collection.json` during the 2026-06-16 surface sweep. |
| Risk360 programmable API and export automation remain unresolved. | `index.md`, `overview.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#risk360-01-risk360-programmable-api-and-export-surface` |
| Risk360 factor catalog, factor weights, and peer-benchmark cohort methodology remain unresolved. | `index.md`, `overview.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#risk360-02-risk360-factor-catalog-weighting-and-peer-benchmark-methodology` |
