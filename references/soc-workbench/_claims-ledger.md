---
product: soc-workbench
topic: "soc-workbench-claims-ledger"
title: "SOC Workbench claims ledger - Tier 3 thin-stub refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: e68b53e17f61870f3bec2a68bff3e3d4f1c6db05
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 70e67db347441caa31f94da8f904389064db0664
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/soc-what-zscaler-soc-workbench.md"
author-status: draft
---

# SOC Workbench claims ledger

This ledger covers the Tier 3 thin-stub refresh for SOC Workbench. Rows either cite exact source lines, identify an open question, or mark an audit-scoped absence from the checked source families.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| SOC Workbench helps SOC teams with faster threat detection and response by prioritizing and triaging context-rich incidents. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:8-10` |
| SOC Workbench emphasizes risk-based prioritization, automated correlation, context enrichment, actionable incidents, and proactive attack prediction. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:12-18` |
| SOC Workbench is powered by the Zscaler Data Fabric for Security and turns isolated alerts into a prioritized, holistic threat view. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:27` |
| SOC Workbench is part of the SecOps portfolio and connects exposure insights with threat prioritization. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:29` |
| SOC Workbench unifies Zscaler and third-party alerts in a single console. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:33` |
| SOC Workbench's AI-driven analysis turns raw alerts into contextualized threats and highlights the first items to address. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:34` |
| SOC Workbench supports investigation workflows with threat details, log search, asset-impact context, and response support on one screen. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:35` |
| Core day-to-day capabilities include ingestion, enrichment, correlation, prioritization, investigation, and resolution. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:37-44` |
| The captured connector list includes named third-party tools, ZCC/ZIA devices and users, and AnySource ingestion via AWS S3, GCP, webhook, or upload-file API. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:46-48` |
| The source uses "Outegrations" for outbound integrations and names Jira and ServiceNow with webhook support. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:50-52` |
| The help capture documents "Report Export via API" as a capability but does not include endpoint details. | `overview.md` | `vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:62` |
| Go SDK has no product-specific SOC Workbench service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no SOC Workbench service found in `vendor/zscaler-sdk-go` during the 2026-06-16 surface sweep. |
| Python SDK has no product-specific SOC Workbench service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no SOC Workbench service found in `vendor/zscaler-sdk-python` during the 2026-06-16 surface sweep. |
| Terraform has no product-specific SOC Workbench resource or data source in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no SOC Workbench resource/data-source surface found in `vendor/terraform-provider-zia` or `vendor/terraform-provider-zpa` during the 2026-06-16 surface sweep. |
| Ansible has no product-specific SOC Workbench module in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no SOC Workbench module found in `vendor/ziacloud-ansible` or `vendor/zpacloud-ansible` during the 2026-06-16 surface sweep. |
| MCP has no product-specific SOC Workbench tool in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no SOC Workbench tool found in `vendor/zscaler-mcp-server` during the 2026-07-16 MCP re-check. |
| Postman has no SOC Workbench endpoint family in the audited OneAPI collection. | `overview.md` | AUDIT-SCOPED ABSENCE: no SOC Workbench endpoint family found in `vendor/zscaler-api-specs/oneapi-postman-collection.json` during the 2026-06-16 surface sweep. |
| SOC Workbench report-export endpoint, schema, authentication scope, and response shape remain unresolved. | `overview.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#soc-workbench-01-soc-workbench-report-export-api-details` |
