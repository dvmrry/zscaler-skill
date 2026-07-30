---
product: risk360
topic: "risk360-overview"
title: "Risk360 - cyber risk quantification and audit-scoped API surface"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: e68b53e17f61870f3bec2a68bff3e3d4f1c6db05
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
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

# Risk360 - cyber risk quantification and audit-scoped API surface

Risk360 analyzes organizational security data and provides real-time risk metrics at the organization level and across four attack stages: External Attack Surface, Compromise, Lateral Propagation, and Data Loss (`vendor/zscaler-help/what-risk360.md:8-13`). The help capture frames Risk360 around holistic risk analysis, financial exposure through Monte Carlo simulation, stakeholder reporting, peer benchmarking, compliance support, and deployment through the Zero Trust Exchange without additional hardware upgrades (`vendor/zscaler-help/what-risk360.md:15-22`).

## Data And Risk Model

The product-marketing capture says Risk360 ingests data from an existing Zscaler deployment and creates a cyber-risk posture view with actionable insights (`vendor/zscaler-help/risk360-product-marketing.md:8-10`). The named telemetry sources are ZIA, ZPA, DLP policies, ThreatLabz security research, and external attack surface metrics (`vendor/zscaler-help/risk360-product-marketing.md:20-22`).

Risk360 logs are defined as duplicates of configuration and transaction logs from other Zscaler SaaS products such as ZIA and ZPA (`vendor/zscaler-help/risk360-logs-retention.md:8-12`). Retention is up to one year during the subscription term, and storage is in either the United States or the European Union (`vendor/zscaler-help/risk360-logs-retention.md:14-20`).

Factor count is a moving target in the captured sources: one marketing line says 140+ predefined factors, while another says more than 115 predefined factors (`vendor/zscaler-help/risk360-product-marketing.md:16-24`). Cite it as "115+ / 140+ depending on source" or "growing factor catalog"; do not make a high-confidence exact-count claim.

## Dashboard, Factors, And Asset-Level Risk

The Dashboard page exposes a Zscaler-computed risk score, industry peer average, category score trends, risk events by location, contributing factors by entity, and a Top 10 Factors section with a "Licensed?" column (`vendor/zscaler-help/risk360-about-dashboard.md:8-16`, `:27-48`). Severity ranges are captured as 0-25 Low, 26-50 Medium, 51-75 High, and 76-100 Critical (`vendor/zscaler-help/risk360-about-dashboard.md:18-25`).

The Factors page says Risk360 quantifies each factor according to risk weight and maps factors to MITRE and NIST (`vendor/zscaler-help/risk360-about-factors.md:8`). It also supports integrations with vendors such as CrowdStrike to gather risky events and translate them into factors (`vendor/zscaler-help/risk360-about-factors.md:10`). The captured views are Attack-Based and Entity-Based (`vendor/zscaler-help/risk360-about-factors.md:17-20`).

Asset-level risk aggregates asset counts, highlights risky assets, and supports drill-downs into the drivers of risk (`vendor/zscaler-help/risk360-about-asset-level-risk.md:8-10`). The asset-level model uses more than 65 indicators grouped into pre-infection behavior, post-infection behavior, and suspicious behavior (`vendor/zscaler-help/risk360-about-asset-level-risk.md:12-20`).

## Monte Carlo Financial Modeling

Risk360 runs a Monte Carlo simulation 1,000 times per day per organization (`vendor/zscaler-help/risk360-monte-carlo.md:10-12`). Each iteration randomizes a breach event and financial loss within a confidence interval (`vendor/zscaler-help/risk360-monte-carlo.md:14-17`). Outputs include yearly average loss and a loss exceedance curve (`vendor/zscaler-help/risk360-monte-carlo.md:18-23`).

The simulation runs four scenarios: Inherent risk, Residual risk after mitigating the top ten risk factors, Last 30-day average risk, and Industry peer risk (`vendor/zscaler-help/risk360-monte-carlo.md:25-34`).

## Source-Family Audit

| Family | Audit result |
|---|---|
| Go SDK | No product-specific Risk360 service found in this audit pass. |
| Python SDK | No product-specific Risk360 management service found. The only audited Python hit is an incidental ZIdentity resource-server cassette that names service `ZRA`, display name `Risk360`, and Risk360 read-only/super-admin role scopes (`vendor/zscaler-sdk-python/tests/integration/zid/cassettes/TestResourceServers.yaml:25-28`, `:132-135`). |
| Terraform | No product-specific Risk360 resource or data source found in this audit pass. |
| Ansible | No product-specific Risk360 module found in this audit pass. |
| MCP | No product-specific Risk360 tool found in this audit pass. |
| Postman | No Risk360 endpoint family found in the audited Postman collection. |
| Help captures | Risk model, dashboard, factors, asset-level risk, Monte Carlo, logs/retention, and marketing-positioning captures are available (`vendor/zscaler-help/what-risk360.md:8-22`, `vendor/zscaler-help/risk360-about-dashboard.md:8-48`, `vendor/zscaler-help/risk360-about-factors.md:8-20`, `vendor/zscaler-help/risk360-about-asset-level-risk.md:8-20`, `vendor/zscaler-help/risk360-monte-carlo.md:8-42`, `vendor/zscaler-help/risk360-logs-retention.md:8-20`). |

## API Surface

Do not claim a Risk360 public API from the current captures. The audited sources show a product UI/help surface and an incidental ZIdentity role/entitlement fixture, but no Risk360 SDK service, Terraform resource, Ansible module, MCP tool, or Postman endpoint family. This is an audit-scoped absence, not proof that no private or future Risk360 API exists. See [clarification risk360-01](../_meta/clarifications.md#risk360-01-risk360-programmable-api-and-export-surface).

## What Risk360 Is Not

- It is not evidenced here as a scanner or traffic enforcement engine; the source-backed model is risk quantification over telemetry and external signals (`vendor/zscaler-help/what-risk360.md:8-22`, `vendor/zscaler-help/risk360-product-marketing.md:20-22`).
- It is not evidenced as a standalone API product in the audited source families.
- It is not safe to quote one exact factor count without qualification; the captured sources cite both 140+ and more than 115 factors (`vendor/zscaler-help/risk360-product-marketing.md:18-24`).

## Open Questions

- Risk360 programmable API and export automation remain unresolved. See [clarification risk360-01](../_meta/clarifications.md#risk360-01-risk360-programmable-api-and-export-surface).
- The full factor catalog, per-factor weights, and peer-benchmark cohort methodology are not captured. See [clarification risk360-02](../_meta/clarifications.md#risk360-02-risk360-factor-catalog-weighting-and-peer-benchmark-methodology).

## Cross-Links

- Claims ledger for this refresh: [`./_claims-ledger.md`](./_claims-ledger.md)
- Risk360 hub: [`./index.md`](./index.md)
- ZIA telemetry source: [`../zia/index.md`](../zia/index.md)
- ZPA telemetry source: [`../zpa/index.md`](../zpa/index.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
