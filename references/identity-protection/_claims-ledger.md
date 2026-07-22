---
product: identity-protection
topic: "identity-protection-claims-ledger"
title: "Identity Protection claims ledger - Tier 3 misc refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: cd24ac6b1f409d6752b5de8092e50dcab7b8c5c0
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: 41cac5f54065b1a2264d0ab057eba8d0b35fca25
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 47fe874551023bf8d138c24612aa4ea0f16aaa56
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
| No product-specific Identity Protection Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees. | `overview.md` | AUDIT-SCOPED ABSENCE -> 2026-06-16 search across the Go/Python SDK, Terraform, Ansible, and Postman families; MCP portion rechecked 2026-07-22 against v0.13.3 for Identity Protection / ITDR product surface. |
| Identity Protection API/integration surface and current-vs-legacy parity remain unresolved. | `overview.md`, `clarifications.md` | OPEN QUESTION -> `references/_meta/clarifications.md#identity-protection-01-identity-protection-api-integration-surface-and-legacy-itdr-parity` |
