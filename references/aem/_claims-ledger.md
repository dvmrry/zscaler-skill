---
product: aem
topic: "aem-claims-ledger"
title: "AEM claims ledger - Tier 3 misc refresh"
content-type: reference
last-verified: "2026-06-16"
verified-against:
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
  vendor/terraform-provider-zia: 717926eb564bb21dea1f8e0c3222e6593b29f849
  vendor/terraform-provider-zpa: 8d7d7f3a8fc63bd428233b629eb08bce834e975c
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 84ab824d6ce5853c12add6ae3280dcfb8db273a2
  vendor/zscaler-mcp-server: a2162c384e1ffb68b3bf14783ea9a1a762c85ff5
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/aem-what-zscaler-security-operations.md"
  - "vendor/zscaler-help/asset-exposure-management-caasm-marketing.md"
author-status: draft
---

# AEM claims ledger

| Claim | Reference surface | Source line(s) |
|---|---|---|
| AEM is one of the SecOps applications and supports asset collection, inventory/coverage tracking, attack-surface understanding, policies, violation tracking, and remediation. | `overview.md` | `vendor/zscaler-help/aem-what-zscaler-security-operations.md:10-13` |
| SecOps centralizes and enriches data from Zscaler telemetry and third-party tools through a data fabric. | `overview.md` | `vendor/zscaler-help/aem-what-zscaler-security-operations.md:17-19` |
| AEM data-source setup includes Details, Retrieval, Scheduling, Remediation Detection Settings, and Suppression Rules. | `overview.md` | `vendor/zscaler-help/aem-what-zscaler-security-operations.md:30-37` |
| AnySource can upload or extract files from storage platforms such as GCP and AWS S3. | `overview.md` | `vendor/zscaler-help/aem-what-zscaler-security-operations.md:39-41` |
| Captured AEM/SOC Workbench connectors include Azure Blob, Azure Cloud Assets, CrowdStrike, Microsoft Defender, Microsoft Entra ID, SentinelOne, Snyk, Wiz, ZCC Devices, ZIA Devices and Users, and AnySource. | `overview.md` | `vendor/zscaler-help/aem-what-zscaler-security-operations.md:43-57` |
| Captured outegrations include Jira, ServiceNow, and Azure DevOps with webhooks. | `overview.md` | `vendor/zscaler-help/aem-what-zscaler-security-operations.md:59-63` |
| AEM marketing positions the product around a unified asset "golden record", coverage-gap analysis, CMDB health, remediation actions, and reporting/analytics. | `overview.md` | `vendor/zscaler-help/asset-exposure-management-caasm-marketing.md:20-49` |
| AEM informs Risk360 and UVM by improving asset context and risk quantification. | `overview.md` | `vendor/zscaler-help/asset-exposure-management-caasm-marketing.md:55-59` |
| No product-specific AEM Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees. | `overview.md` | AUDIT-SCOPED ABSENCE -> 2026-06-16 search across `vendor/zscaler-sdk-go`, `vendor/zscaler-sdk-python`, `vendor/terraform-provider-*`, `vendor/*ansible`, `vendor/zscaler-mcp-server`, and `vendor/zscaler-api-specs` for AEM / Asset Exposure Management / CAASM. |
| AEM report/API/AnySource endpoint details are unresolved. | `overview.md`, `clarifications.md` | OPEN QUESTION -> `references/_meta/clarifications.md#aem-01-aem-anysource-report-and-api-endpoint-details` |
