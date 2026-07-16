---
product: identity-protection
topic: overview
title: "Identity Protection (ITDR) - identity risk and SecOps posture"
content-type: reference
last-verified: "2026-07-16"
verified-against:
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
  vendor/terraform-provider-zia: 717926eb564bb21dea1f8e0c3222e6593b29f849
  vendor/terraform-provider-zpa: 8d7d7f3a8fc63bd428233b629eb08bce834e975c
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 84ab824d6ce5853c12add6ae3280dcfb8db273a2
  vendor/zscaler-mcp-server: 23912913f8588c650b104d3bd30c0c755d6962cd
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/itdr-what-identity-protection.md"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
author-status: draft
---

# Identity Protection (ITDR) - identity risk and SecOps posture

This is a thin Tier-C reference. The refresh found Identity Protection / ITDR Help coverage, but no product-specific SDK, Terraform, Ansible, MCP, or Postman surface in the audited vendor trees.

## Source-family sweep

| Family | Audit result |
|---|---|
| Go SDK | No Identity Protection / ITDR product service surface found in the audited Go SDK tree. |
| Python SDK | No Identity Protection / ITDR product service surface found in the audited Python SDK tree. |
| Terraform | No Identity Protection / ITDR resources or data sources found in the audited ZIA or ZPA providers. |
| Ansible | No Identity Protection / ITDR modules found in the audited ZIA or ZPA collections. |
| MCP | No Identity Protection / ITDR tools found in the audited MCP server. The MCP ZIdentity family is limited to user/group lookup and membership operations; it is not Identity Protection/ITDR posture or threat detection (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:400-415`). |
| Postman | No Identity Protection / ITDR endpoint family found in the audited OneAPI collection. |
| Help | Identity Protection is covered by the ITDR Help capture. The capture says it detects anomalous activities and provides continuous unified visibility into identity risks (`vendor/zscaler-help/itdr-what-identity-protection.md:8`). |

## What it is

Identity Protection helps organizations detect anomalous identity activity such as compromised credentials, suspicious logins, and sensitive data theft, and gives continuous visibility into identity risk (`vendor/zscaler-help/itdr-what-identity-protection.md:8`). The capture places it in the Zscaler SecOps platform alongside UVM, AEM, and SOC Workbench (`vendor/zscaler-help/itdr-what-identity-protection.md:10`).

The architecture section says Identity Protection is an ITDR solution integrated with the SecOps platform, with an Identities App, an ITDR Connector, a Data Fabric Cluster, and Zero Trust Exchange integration (`vendor/zscaler-help/itdr-what-identity-protection.md:35-42`). The Zero Trust Exchange integration is described as providing ZIA/ZPA visibility, enrichment, and containment, including access-policy controls to block compromised users when identity attacks are detected (`vendor/zscaler-help/itdr-what-identity-protection.md:42`).

## Capability scope

The Help capture lists detection and posture capabilities: identity posture scanning, AD posture scans, Entra ID posture scans, Okta integration, real-time identity change detection, credential exposure scanning, and identity threat detection (`vendor/zscaler-help/itdr-what-identity-protection.md:44-52`). It specifically says AD posture scan requires ZCC on a domain-joined Windows machine, Credential Exposure Scan requires ZCC, and Identity Threat Detection is enabled as an endpoint policy on designated machines with ZCC installed (`vendor/zscaler-help/itdr-what-identity-protection.md:46-52`).

The legacy note says the Help portal includes an ITDR entry under "Zscaler Legacy" and that Identity Protection in the new SecOps platform UI is the current generation; advanced tasks can redirect to the legacy ITDR experience (`vendor/zscaler-help/itdr-what-identity-protection.md:54-56`).

## Programmability posture

No product-specific Identity Protection Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees. The captured Help material supports portal/SecOps architecture and ZTE/ZCC integration concepts, but it does not establish an Identity Protection public API, SDK operation set, or provider resource set. See [clarification `identity-protection-01`](../_meta/clarifications.md#identity-protection-01-identity-protection-api-integration-surface-and-legacy-itdr-parity).

## Open questions

- `identity-protection-01`: The public captures do not identify the authoritative API surface, connector configuration API, report/export API, or exact parity between the current SecOps UI and legacy ITDR experience. See [clarification `identity-protection-01`](../_meta/clarifications.md#identity-protection-01-identity-protection-api-integration-surface-and-legacy-itdr-parity).

## Cross-links

- AEM: [`../aem/overview.md`](../aem/overview.md)
- SOC Workbench: [`../soc-workbench/overview.md`](../soc-workbench/overview.md)
- ZCC: [`../zcc/index.md`](../zcc/index.md)
- ZPA: [`../zpa/index.md`](../zpa/index.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
