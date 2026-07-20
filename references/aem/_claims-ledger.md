---
product: aem
topic: "aem-claims-ledger"
title: "AEM claims ledger - Tier 3 misc refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 4371c9bab44d852526721b4b5999e2471dda5198
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: 6e6509f001ca71adcedfd4884250d09227395bf0
  vendor/terraform-provider-zpa: 02c88e27da98ec75f7a7a85f43486b4f0552dfa9
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 23912913f8588c650b104d3bd30c0c755d6962cd
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
| No product-specific AEM Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees. | `overview.md` | AUDIT-SCOPED ABSENCE -> 2026-06-16 search across the Go/Python SDK, Terraform, Ansible, and Postman families; MCP portion rechecked 2026-07-16 against v0.13.1 for AEM / Asset Exposure Management / CAASM. |
| AEM report/API/AnySource endpoint details are unresolved. | `overview.md`, `clarifications.md` | OPEN QUESTION -> `references/_meta/clarifications.md#aem-01-aem-anysource-report-and-api-endpoint-details` |
