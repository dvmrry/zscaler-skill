---
product: identity-protection
topic: "identity-protection-claims-ledger"
title: "Identity Protection claims ledger - Tier 3 misc refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
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
  - "vendor/zscaler-help/itdr-what-identity-protection.md"
author-status: draft
---

# Identity Protection claims ledger

| Claim | Reference surface | Source line(s) |
|---|---|---|
| Identity Protection detects anomalous activity such as compromised credentials and suspicious logins and provides continuous unified visibility into identity risks. | `overview.md` | `vendor/zscaler-help/itdr-what-identity-protection.md:8` |
| Identity Protection is part of the SecOps platform alongside UVM, AEM, and SOC Workbench. | `overview.md` | `vendor/zscaler-help/itdr-what-identity-protection.md:10` |
| Identity Protection architecture includes the Identities App, ITDR Connector, Data Fabric Cluster, and ZTE integration. | `overview.md` | `vendor/zscaler-help/itdr-what-identity-protection.md:35-42` |
| ZTE integration provides visibility, enrichment, containment, and access-policy controls for compromised users through ZIA/ZPA context. | `overview.md` | `vendor/zscaler-help/itdr-what-identity-protection.md:42` |
| Identity Protection capabilities include identity posture scan, AD posture scan, Entra ID posture scan, Okta integration, change detection, credential exposure scan, and identity threat detection. | `overview.md` | `vendor/zscaler-help/itdr-what-identity-protection.md:44-52` |
| AD posture scans, credential exposure scans, and identity threat detection have ZCC dependencies in the captured Help source. | `overview.md` | `vendor/zscaler-help/itdr-what-identity-protection.md:46-52` |
| Current Identity Protection is the SecOps UI generation; the Help portal still has legacy ITDR links for advanced tasks. | `overview.md` | `vendor/zscaler-help/itdr-what-identity-protection.md:54-56` |
| No product-specific Identity Protection Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees. | `overview.md` | AUDIT-SCOPED ABSENCE -> 2026-06-16 search across the Go/Python SDK, Terraform, Ansible, and Postman families; MCP portion rechecked 2026-07-30 against v0.15.0 for Identity Protection / ITDR product surface. |
| Identity Protection API/integration surface and current-vs-legacy parity remain unresolved. | `overview.md`, `clarifications.md` | OPEN QUESTION -> `references/_meta/clarifications.md#identity-protection-01-identity-protection-api-integration-surface-and-legacy-itdr-parity` |
