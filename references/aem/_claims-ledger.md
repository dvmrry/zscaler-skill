---
product: aem
topic: "aem-claims-ledger"
title: "AEM claims ledger - Tier 3 misc refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
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
| No product-specific AEM Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees. | `overview.md` | AUDIT-SCOPED ABSENCE -> 2026-06-16 search across the Go/Python SDK, Terraform, Ansible, and Postman families; MCP portion rechecked 2026-07-30 against v0.15.0 for AEM / Asset Exposure Management / CAASM. |
| AEM report/API/AnySource endpoint details are unresolved. | `overview.md`, `clarifications.md` | OPEN QUESTION -> `references/_meta/clarifications.md#aem-01-aem-anysource-report-and-api-endpoint-details` |
