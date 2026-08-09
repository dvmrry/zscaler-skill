---
product: uvm
topic: "uvm-claims-ledger"
title: "UVM claims ledger - Tier 3 thin-stub refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/uvm-anysource-connector.md"
  - "vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md"
author-status: draft
---

# UVM claims ledger

This ledger covers the Tier 3 thin-stub refresh for Unified Vulnerability Management. Rows either cite exact source lines, identify an open question, or mark an audit-scoped absence from the checked source families.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| UVM is captured as a single platform for managing vulnerabilities and simplifying identification/remediation of security risks. | `overview.md` | `vendor/zscaler-help/uvm-anysource-connector.md:73-78` |
| UVM marketing frames the product as risk prioritization with contextual insights into risk factors and mitigating controls. | `overview.md` | `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:8-19` |
| UVM data sources can use dedicated vendor connectors or AnySource, and AnySource allows file uploads directly to the platform. | `overview.md` | `vendor/zscaler-help/uvm-anysource-connector.md:8` |
| Captured AnySource methods are Upload File, AWS S3, GCP, Webhook, and Upload File API. | `overview.md` | `vendor/zscaler-help/uvm-anysource-connector.md:10-16` |
| The captured vendor connector list is partial and includes examples such as Veracode, Apiiro, Aqua, Armis, AWS, Azure, CrowdStrike, GitHub Advanced Security, Mandiant ASM, Microsoft Defender, Prisma Cloud, and Tenable. | `overview.md` | `vendor/zscaler-help/uvm-anysource-connector.md:18-45` |
| Marketing claims 150+ prebuilt integrations, AnySource for flat files/webhooks, and AnyTarget for downstream outputs. | `overview.md` | `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:21-24` |
| Recommended AnySource fields are split between asset fields and finding/vulnerability fields. | `overview.md` | `vendor/zscaler-help/uvm-anysource-connector.md:47-71` |
| Marketing describes dashboards, reports, dynamically updated feeds, custom workflows, two-way ticketing integration, and exception management. | `overview.md` | `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:26-35` |
| UVM is marketed as powered by Data Fabric for Security and correlating findings across identity, assets, user behavior, mitigating controls, business processes, and organizational hierarchy. | `overview.md` | `vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:37-47` |
| Go SDK has no product-specific UVM service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no UVM service found in `vendor/zscaler-sdk-go` during the 2026-06-16 surface sweep. |
| Python SDK has no product-specific UVM service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no UVM service found in `vendor/zscaler-sdk-python` during the 2026-06-16 surface sweep. |
| Terraform has no product-specific UVM resource or data source in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no UVM resource/data-source surface found in `vendor/terraform-provider-zia` or `vendor/terraform-provider-zpa` during the 2026-06-16 surface sweep. |
| Ansible has no product-specific UVM module in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no UVM module found in `vendor/ziacloud-ansible` or `vendor/zpacloud-ansible` during the 2026-06-16 surface sweep. |
| MCP has no product-specific UVM tool in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no UVM tool found in `vendor/zscaler-mcp-server` during the 2026-07-16 MCP re-check. |
| Postman has no UVM endpoint family in the audited collection. | `overview.md` | AUDIT-SCOPED ABSENCE: no UVM endpoint family found in `vendor/zscaler-api-specs/oneapi-postman-collection.json` during the 2026-06-16 surface sweep. |
| UVM Upload File API endpoint/schema and broader API surface remain unresolved. | `overview.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#uvm-01-uvm-anysource-upload-file-api-endpoint-and-broader-api-surface` |
