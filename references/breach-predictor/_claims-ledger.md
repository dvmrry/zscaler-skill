---
product: breach-predictor
topic: "breach-predictor-claims-ledger"
title: "Breach Predictor claims ledger - Tier 3 thin-stub refresh"
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
source-tier: doc
sources:
  - "vendor/zscaler-help/bp-what-zscaler-breach-predictor.md"
author-status: draft
---

# Breach Predictor claims ledger

This ledger covers the Tier 3 thin-stub refresh for Breach Predictor. Rows either cite exact source lines, identify an open question, or mark an audit-scoped absence from the checked source families.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| Breach Predictor anticipates threats, provides threat context, and helps prevent access to sensitive data. | `overview.md` | `vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:8` |
| Captured benefits are Enhanced Attack Visibility, Proactive Breach Risk Reduction, and Improved Security Posture. | `overview.md` | `vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:10-16` |
| Breach Predictor supplements rather than replaces reactive security tools. | `overview.md` | `vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:25` |
| Breach Predictor uses predictive intelligence to identify policy problems before threats move to the next stage. | `overview.md` | `vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:27-29` |
| Breach Predictor workflow is to track data from multiple sources, use generative AI, and draw conclusions for visibility and guidance. | `overview.md` | `vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:31-37` |
| Product concepts include Overall Breach Probability, Sankey charts, MITRE ATT&CK tables, AI Assist Dashboard, Dashboard, Findings, Events, Threat Landscape, Tickets, Profiles, and Alerts & Remediation. | `overview.md` | `vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:39-48` |
| Go SDK has no product-specific Breach Predictor service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Breach Predictor service found in `vendor/zscaler-sdk-go` during the 2026-06-16 surface sweep. |
| Python SDK has no product-specific Breach Predictor service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Breach Predictor service found in `vendor/zscaler-sdk-python` during the 2026-06-16 surface sweep. |
| Terraform has no product-specific Breach Predictor resource or data source in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Breach Predictor resource/data-source surface found in `vendor/terraform-provider-zia` or `vendor/terraform-provider-zpa` during the 2026-06-16 surface sweep. |
| Ansible has no product-specific Breach Predictor module in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Breach Predictor module found in `vendor/ziacloud-ansible` or `vendor/zpacloud-ansible` during the 2026-06-16 surface sweep. |
| MCP has no product-specific Breach Predictor tool in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Breach Predictor tool found in `vendor/zscaler-mcp-server` during the 2026-06-16 surface sweep. |
| Postman has no Breach Predictor endpoint family in the audited collection. | `overview.md` | AUDIT-SCOPED ABSENCE: no Breach Predictor endpoint family found in `vendor/zscaler-api-specs/oneapi-postman-collection.json` during the 2026-06-16 surface sweep. |
| Breach Predictor data-source enumeration, API/integration surface, and endpoint/schema details remain unresolved. | `overview.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#breach-predictor-01-breach-predictor-api-integration-and-data-source-details` |
