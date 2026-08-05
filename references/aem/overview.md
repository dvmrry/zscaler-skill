---
product: aem
topic: overview
title: "Asset Exposure Management (AEM) - asset inventory and attack surface tracking"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/aem-what-zscaler-security-operations.md"
  - "vendor/zscaler-help/asset-exposure-management-caasm-marketing.md"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
author-status: draft
---

# Asset Exposure Management (AEM) - asset inventory and attack surface tracking

This is a thin Tier-C reference. The refresh found sourceable Help and marketing captures for AEM, but no product-specific SDK, Terraform, Ansible, MCP, or Postman surface in the audited vendor trees. Treat automation claims as unverified unless they point to a concrete source in [`_claims-ledger.md`](./_claims-ledger.md).

## Source-family sweep

| Family | Audit result |
|---|---|
| Go SDK | No AEM / Asset Exposure Management / CAASM service surface found in the audited Go SDK tree. |
| Python SDK | No AEM / Asset Exposure Management / CAASM service surface found in the audited Python SDK tree. |
| Terraform | No AEM / Asset Exposure Management / CAASM resources or data sources found in the audited ZIA or ZPA providers. |
| Ansible | No AEM / Asset Exposure Management / CAASM modules found in the audited ZIA or ZPA collections. |
| MCP | No AEM / Asset Exposure Management / CAASM tools found in the audited MCP server. EASM inventory and ZMS resource-protection tools are adjacent surfaces, not AEM/CAASM coverage (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:419-431`, `:460-485`). |
| Postman | No AEM / Asset Exposure Management / CAASM endpoint family found in the audited OneAPI collection. |
| Help | AEM is covered by the SecOps/AEM capture and CAASM marketing capture. AEM is described as one of two Zscaler SecOps applications and as collecting/managing asset data to track inventory, attack surface, policy violations, and remediation (`vendor/zscaler-help/aem-what-zscaler-security-operations.md:10-13`). |

## What it is

Asset Exposure Management (AEM) is one of the Zscaler Security Operations applications. The Help capture says AEM collects and manages asset data from multiple sources, tracks inventory and coverage, helps understand attack surface, and supports policies plus violation remediation (`vendor/zscaler-help/aem-what-zscaler-security-operations.md:12`). The same capture describes the SecOps platform data fabric as centralizing, transforming, harmonizing, deduplicating, correlating, and enriching data from Zscaler telemetry and third-party tools (`vendor/zscaler-help/aem-what-zscaler-security-operations.md:17-19`).

The marketing capture positions AEM around a unified asset inventory or "golden record", with asset visibility, relationship identification, coverage-gap analysis, CMDB health, remediation actions, and reporting/analytics (`vendor/zscaler-help/asset-exposure-management-caasm-marketing.md:20-49`). It also says AEM informs Risk360 and UVM by improving asset context and risk quantification (`vendor/zscaler-help/asset-exposure-management-caasm-marketing.md:55-59`).

## Data-source and workflow scope

The captured AEM data-source setup flow includes Details, Retrieval, Scheduling, Remediation Detection Settings, and Suppression Rules (`vendor/zscaler-help/aem-what-zscaler-security-operations.md:30-37`). The generic AnySource connector supports upload or extraction from storage platforms such as GCP and AWS S3 (`vendor/zscaler-help/aem-what-zscaler-security-operations.md:39-41`).

The captured connector list includes Azure Blob, Azure Cloud Assets, CrowdStrike, CrowdStrike Identity Protection, Microsoft Defender sources, Microsoft Entra ID, SentinelOne, Snyk, Wiz, Zscaler Client Connector Devices, ZIA Devices and Users, and AnySource (`vendor/zscaler-help/aem-what-zscaler-security-operations.md:43-57`). Outbound integrations in the capture are Jira, ServiceNow, and Azure DevOps with webhooks (`vendor/zscaler-help/aem-what-zscaler-security-operations.md:59-63`).

## Programmability posture

No product-specific AEM Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees. The Help capture supports a portal/data-source workflow and an AnySource ingestion concept, but it does not establish a public AEM configuration/query API or SDK operation set. See [clarification `aem-01`](../_meta/clarifications.md#aem-01-aem-anysource-report-and-api-endpoint-details).

## Open questions

- `aem-01`: The public captures do not identify the authoritative AEM API surface, report-export endpoint details, AnySource upload contract, or whether those are exposed through OneAPI/SDK/provider tooling. See [clarification `aem-01`](../_meta/clarifications.md#aem-01-aem-anysource-report-and-api-endpoint-details).

## Cross-links

- UVM: [`../uvm/overview.md`](../uvm/overview.md)
- SOC Workbench: [`../soc-workbench/overview.md`](../soc-workbench/overview.md)
- Identity Protection: [`../identity-protection/overview.md`](../identity-protection/overview.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
