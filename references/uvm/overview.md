---
product: uvm
topic: overview
title: "Unified Vulnerability Management - AnySource ingestion and audit-scoped API surface"
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
  - "vendor/zscaler-help/uvm-anysource-connector.md"
  - "vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md"
author-status: draft
---

# Unified Vulnerability Management - AnySource ingestion and audit-scoped API surface

Unified Vulnerability Management (UVM) is described in the captured SecOps context as a single platform for managing vulnerabilities and simplifying identification and remediation of security risks (`vendor/zscaler-help/uvm-anysource-connector.md:73-78`). The marketing capture frames UVM as risk prioritization with contextual insights into risk factors and mitigating controls (`vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:8-19`).

## Ingestion And Data Model

The AnySource capture says UVM can create data sources using either dedicated vendor connectors or the AnySource connector, with AnySource allowing file uploads directly to the platform (`vendor/zscaler-help/uvm-anysource-connector.md:8`). Captured AnySource upload methods are Upload File, AWS S3, GCP, Webhook, and Upload File API (`vendor/zscaler-help/uvm-anysource-connector.md:10-16`).

The same capture includes a partial vendor connector list with examples such as Veracode, Apiiro, Aqua Security, Armis, AWS, Azure Blob, Azure Cloud Assets, CrowdStrike, Dragos, GitHub Advanced Security, Mandiant ASM, Microsoft Defender, Prisma Cloud, and Tenable (`vendor/zscaler-help/uvm-anysource-connector.md:18-45`). The marketing capture separately claims 150+ prebuilt integrations and names AnySource for flat files/webhooks and AnyTarget for downstream outputs (`vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:21-24`).

Recommended AnySource fields are split between assets and findings: asset fields include hostname, type, IP, OS, owner, location, status, tags, software, and criticality; finding fields include vulnerability ID/name, severity/CVSS, description, affected asset, CVE, threat intel, tags, first/last seen timestamps, recommendations, and affected component (`vendor/zscaler-help/uvm-anysource-connector.md:47-71`).

## Reporting And Workflows

The marketing capture describes prebuilt and custom dashboards, dynamically updated feeds, custom workflows, two-way ticketing integration, and exception management (`vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:26-35`). It says UVM is powered by the Data Fabric for Security and correlates findings across identity, assets, user behavior, mitigating controls, business processes, and organizational hierarchy (`vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:37-47`).

## Source-Family Audit

| Family | Audit result |
|---|---|
| Go SDK | No product-specific UVM service found in this audit pass. |
| Python SDK | No product-specific UVM service found in this audit pass. |
| Terraform | No product-specific UVM resource or data source found in this audit pass. |
| Ansible | No product-specific UVM module found in this audit pass. |
| MCP | No product-specific UVM tool found in this audit pass. |
| Postman | No UVM endpoint family found in the audited Postman collection. |
| Help captures | AnySource ingestion methods, partial vendor connector examples, recommended fields, SecOps context, marketing positioning, reporting, and workflow claims are captured (`vendor/zscaler-help/uvm-anysource-connector.md:8-78`, `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:16-47`). |

## API Surface

The only source-backed API phrase in this refresh is "Upload File API" as an AnySource ingestion method (`vendor/zscaler-help/uvm-anysource-connector.md:10-16`). The audited SDK, Terraform, Ansible, MCP, and Postman sources did not expose an endpoint path, schema, auth scope, or broader UVM administration API. See [clarification uvm-01](../_meta/clarifications.md#uvm-01-uvm-anysource-upload-file-api-endpoint-and-broader-api-surface).

## What UVM Is Not

- It is not evidenced here as a vulnerability scanner; the captured UVM surface focuses on vulnerability management, ingestion, correlation, prioritization, workflows, and remediation tracking (`vendor/zscaler-help/uvm-anysource-connector.md:8-16`, `:73-78`, `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:16-47`).
- It is not evidenced as a broad public REST API product in the audited source families.
- Do not treat the partial connector examples as a complete connector catalog; one capture labels the list partial and another marketing capture gives a broader 150+ integration claim (`vendor/zscaler-help/uvm-anysource-connector.md:18-20`, `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:21-24`).

## Open Questions

- UVM Upload File API endpoint/schema and broader API surface remain unresolved. See [clarification uvm-01](../_meta/clarifications.md#uvm-01-uvm-anysource-upload-file-api-endpoint-and-broader-api-surface).

## Cross-Links

- Claims ledger for this refresh: [`./_claims-ledger.md`](./_claims-ledger.md)
- AEM: [`../aem/overview.md`](../aem/overview.md)
- SOC Workbench: [`../soc-workbench/overview.md`](../soc-workbench/overview.md)
- Risk360: [`../risk360/overview.md`](../risk360/overview.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
