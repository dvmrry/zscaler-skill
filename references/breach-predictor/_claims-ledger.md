---
product: breach-predictor
topic: "breach-predictor-claims-ledger"
title: "Breach Predictor claims ledger - Tier 3 thin-stub refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: cd24ac6b1f409d6752b5de8092e50dcab7b8c5c0
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: 41cac5f54065b1a2264d0ab057eba8d0b35fca25
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 47fe874551023bf8d138c24612aa4ea0f16aaa56
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
| MCP has no product-specific Breach Predictor tool in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Breach Predictor tool found in `vendor/zscaler-mcp-server` during the 2026-07-16 MCP re-check. |
| Postman has no Breach Predictor endpoint family in the audited collection. | `overview.md` | AUDIT-SCOPED ABSENCE: no Breach Predictor endpoint family found in `vendor/zscaler-api-specs/oneapi-postman-collection.json` during the 2026-06-16 surface sweep. |
| Breach Predictor data-source enumeration, API/integration surface, and endpoint/schema details remain unresolved. | `overview.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#breach-predictor-01-breach-predictor-api-integration-and-data-source-details` |
