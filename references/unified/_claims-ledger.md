---
product: unified
topic: "unified-claims-ledger"
title: "Zscaler Experience Center claims ledger - Tier 3 thin-stub refresh"
content-type: reference
last-verified: "2026-07-16"
verified-against:
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
  vendor/terraform-provider-zia: 717926eb564bb21dea1f8e0c3222e6593b29f849
  vendor/terraform-provider-zpa: 8d7d7f3a8fc63bd428233b629eb08bce834e975c
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 84ab824d6ce5853c12add6ae3280dcfb8db273a2
  vendor/zscaler-mcp-server: 23912913f8588c650b104d3bd30c0c755d6962cd
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/unified-what-zscaler-experience-center.md"
author-status: draft
---

# Zscaler Experience Center claims ledger

This ledger covers the Tier 3 thin-stub refresh for the `unified` / Zscaler Experience Center reference. Rows either cite exact source lines, identify an open question, or mark an audit-scoped absence from the checked source families.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| Zscaler Experience Center is a unified, AI-powered administrative and operations console for the Zero Trust Exchange. | `overview.md` | `vendor/zscaler-help/unified-what-zscaler-experience-center.md:8` |
| The captured examples of services available through Experience Center include ZIA, ZPA, ZDX, and Zscaler Client Connector. | `overview.md` | `vendor/zscaler-help/unified-what-zscaler-experience-center.md:8` |
| Experience Center acts as an orchestration layer over shared data and identity architecture. | `overview.md` | `vendor/zscaler-help/unified-what-zscaler-experience-center.md:10-12` |
| Experience Center mechanisms include unified identity, integrated navigation, common policy framework, Copilot interactions, and unified data/analytics. | `overview.md` | `vendor/zscaler-help/unified-what-zscaler-experience-center.md:14-18` |
| Feature themes include centralized management, guided workflows, AI-powered operations, and persona-focused insights. | `overview.md` | `vendor/zscaler-help/unified-what-zscaler-experience-center.md:20-25` |
| The `/unified` help path maps to "Getting Started with Zscaler" documentation, not only Experience Center product pages. | `overview.md` | `vendor/zscaler-help/unified-what-zscaler-experience-center.md:27-29` |
| Go SDK has no standalone Experience Center / unified-console service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Experience Center or unified-console service found in `vendor/zscaler-sdk-go` during the 2026-06-16 surface sweep. |
| Python SDK has no standalone Experience Center / unified-console service in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Experience Center or unified-console service found in `vendor/zscaler-sdk-python` during the 2026-06-16 surface sweep. |
| Terraform has no standalone Experience Center / unified-console resource or data source in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Experience Center or unified-console resource/data-source surface found in `vendor/terraform-provider-zia` or `vendor/terraform-provider-zpa` during the 2026-06-16 surface sweep. |
| Ansible has no standalone Experience Center / unified-console module in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Experience Center or unified-console module found in `vendor/ziacloud-ansible` or `vendor/zpacloud-ansible` during the 2026-06-16 surface sweep. |
| MCP has no standalone Experience Center / unified-console tool in the audited source. | `overview.md` | AUDIT-SCOPED ABSENCE: no Experience Center or unified-console tool found in `vendor/zscaler-mcp-server` during the 2026-07-16 MCP re-check. |
| Postman has no standalone Experience Center / unified-console endpoint family in the audited OneAPI collection. | `overview.md` | AUDIT-SCOPED ABSENCE: no Experience Center or unified-console endpoint family found in `vendor/zscaler-api-specs/oneapi-postman-collection.json` during the 2026-06-16 surface sweep. |
| Experience Center standalone public API surface remains unresolved. | `overview.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#unified-01-experience-center-standalone-api-surface` |
