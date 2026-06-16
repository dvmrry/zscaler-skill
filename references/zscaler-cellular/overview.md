---
product: zscaler-cellular
topic: overview
title: "Zscaler Cellular - SIM and Cellular Edge forwarding into ZTE"
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
  - "vendor/zscaler-help/cellular-what-zscaler-cellular.md"
  - "vendor/zscaler-help/zscaler-cellular-marketing.md"
author-status: draft
---

# Zscaler Cellular - SIM and Cellular Edge forwarding into ZTE

This is a thin Tier-C reference. The refresh found Help/marketing coverage for Zscaler Cellular, but no product-specific SDK, Terraform, Ansible, MCP, or Postman surface in the audited vendor trees.

## Source-family sweep

| Family | Audit result |
|---|---|
| Go SDK | No Zscaler Cellular / Cellular Edge / Zscaler SIM product service surface found in the audited Go SDK tree. |
| Python SDK | No Zscaler Cellular / Cellular Edge / Zscaler SIM product service surface found in the audited Python SDK tree. |
| Terraform | No Zscaler Cellular resources or data sources found in the audited ZIA or ZPA providers. |
| Ansible | No Zscaler Cellular modules found in the audited ZIA or ZPA collections. |
| MCP | No Zscaler Cellular tools found in the audited MCP server. |
| Postman | No Zscaler Cellular endpoint family found in the audited OneAPI collection. |
| Help | Zscaler Cellular is covered by Cellular Help and marketing captures; Help describes two products, Zscaler SIM and Zscaler Cellular Edge (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:8`). |

## What it is

The Help capture describes Zscaler Cellular as a secure connectivity solution for IoT and mobile devices on a Zero Trust architecture, made up of Zscaler SIM and Zscaler Cellular Edge (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:8`). It says devices with Zscaler SIM connect to public 4G/5G networks, traffic routes to the nearest Cellular Edge, and Cellular Edge forwards traffic to the Zero Trust Exchange for inspection and policy enforcement (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:10-15`).

The architecture capture says Zscaler SIM is a data-only SIM that integrates directly with ZTE for IoT devices where agent-based solutions are not feasible (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:45-53`). It says Cellular Edge forwards traffic from or to a Zscaler SIM to the ZTE and acts as an egress point to funnel cellular traffic to the Zero Trust Exchange (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:56-63`).

## Policy and admin scope

The Help capture says policy enforcement can be based on IP address, IMEI, or IMSI (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:26-29`). It also says the admin portal supports SIM management, eSIM assignment and activation, network events, anomaly detection, SIM location groups, geofence anomaly policies, and Cellular Edge deployment/monitoring (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:65-67`).

The marketing capture lists Zscaler Cellular Service and Zscaler Cellular Partner Service as the two deployment/service motions (`vendor/zscaler-help/zscaler-cellular-marketing.md:26-27`).

## Programmability posture

No product-specific Zscaler Cellular Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees. The captured Help material supports portal-managed SIM/edge operations and policy identifiers, but it does not establish a public API, SDK operation set, or provider resource set. See [clarification `zscaler-cellular-01`](../_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface).

## Open questions

- `zscaler-cellular-01`: The captured sources do not identify a public Cellular Admin Portal API, SIM lifecycle endpoint set, eSIM activation API, Cellular Edge deployment API, or ZIA/ZPA policy object mapping for IP/IMEI/IMSI identifiers. See [clarification `zscaler-cellular-01`](../_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface).

## Cross-links

- ZIA: [`../zia/index.md`](../zia/index.md)
- ZPA: [`../zpa/index.md`](../zpa/index.md)
- Zero Trust Branch: [`../zero-trust-branch/overview.md`](../zero-trust-branch/overview.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
