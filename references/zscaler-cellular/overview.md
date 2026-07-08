---
product: zscaler-cellular
topic: overview
title: "Zscaler Cellular - SIM and Cellular Edge forwarding into ZTE"
content-type: reference
last-verified: "2026-07-08"
verified-against:
  vendor/zscaler-sdk-go: 4371c9bab44d852526721b4b5999e2471dda5198
  vendor/zscaler-sdk-python: 1a994d0447a4aa5da19471111954cfca2cda3acb
  vendor/terraform-provider-zia: 6e6509f001ca71adcedfd4884250d09227395bf0
  vendor/terraform-provider-zpa: dcf12469a9a8f648be0691c74e9816fc94ec7ddc
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 82d3ff7de6e5939c258e4019db43f138e36c2a7c
  vendor/zscaler-mcp-server: a2162c384e1ffb68b3bf14783ea9a1a762c85ff5
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/cellular-what-zscaler-cellular.md"
  - "vendor/zscaler-help/zscaler-cellular-marketing.md"
  - "vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json"
  - "vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
author-status: draft
---

# Zscaler Cellular - SIM and Cellular Edge forwarding into ZTE

This began as a thin Tier-C reference, but the current audited source set now includes a captured Automate ZCell contract plus a Python SDK `client.zcell` namespace. Treat it as a documented API + Python surface with no Terraform/Ansible/MCP/Go coverage found in this repository.

## Source-family sweep

| Family | Audit result |
|---|---|
| Go SDK | No Zscaler Cellular / Cellular Edge / Zscaler SIM product service surface found in the audited Go SDK tree. |
| Python SDK | `client.zcell` is a OneAPI-only service and exposes nine subclients for anomaly policy, audit data, customer data, customer regions, network events, SIM analytics, SIM handling, SIM location groups, and tags (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:281-287`; `vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py:37-103`). |
| Terraform | No Zscaler Cellular resources or data sources found in the audited ZIA or ZPA providers. |
| Ansible | No Zscaler Cellular modules found in the audited ZIA or ZPA collections. |
| MCP | No Zscaler Cellular tools found in the audited MCP server. |
| Automate contract | 36 ZCell operations captured across nine families (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:28`; `vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md:14`). |
| Help | Zscaler Cellular is covered by Cellular Help and marketing captures; Help describes two products, Zscaler SIM and Zscaler Cellular Edge (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:8`). |

## What it is

The Help capture describes Zscaler Cellular as a secure connectivity solution for IoT and mobile devices on a Zero Trust architecture, made up of Zscaler SIM and Zscaler Cellular Edge (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:8`). It says devices with Zscaler SIM connect to public 4G/5G networks, traffic routes to the nearest Cellular Edge, and Cellular Edge forwards traffic to the Zero Trust Exchange for inspection and policy enforcement (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:10-15`).

The architecture capture says Zscaler SIM is a data-only SIM that integrates directly with ZTE for IoT devices where agent-based solutions are not feasible (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:45-53`). It says Cellular Edge forwards traffic from or to a Zscaler SIM to the ZTE and acts as an egress point to funnel cellular traffic to the Zero Trust Exchange (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:56-63`).

## Policy and admin scope

The Help capture says policy enforcement can be based on IP address, IMEI, or IMSI (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:26-29`). It also says the admin portal supports SIM management, eSIM assignment and activation, network events, anomaly detection, SIM location groups, geofence anomaly policies, and Cellular Edge deployment/monitoring (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:65-67`).

The marketing capture lists Zscaler Cellular Service and Zscaler Cellular Partner Service as the two deployment/service motions (`vendor/zscaler-help/zscaler-cellular-marketing.md:26-27`).

## Programmability posture

ZCell has a documented API surface and a Python SDK wrapper. The contract covers anomaly policies, audit search/metadata, customer data, customer regions, network events, SIM analytics, SIM actions/search/details, SIM location groups, and tags (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:2-14`, `:1506-1518`, `:1956-2079`, `:2430-2583`, `:2812-2824`, `:3280-3713`, `:3801-5594`, `:5673-6458`). The Python SDK exposes the same product as `client.zcell`; its README states that ZCell uses OneAPI OAuth2 credentials and a separate `zcellCustomerId` / `ZCELL_CUSTOMER_ID` value for `/customers/{id}` scoping (`vendor/zscaler-sdk-python/README.md:385-402`).

No Terraform, Ansible, MCP, or Go SDK ZCell family was found in the audited source set. Do not infer Terraform manageability or cross-client parity from the contract alone.

## Open questions

- `zscaler-cellular-01`: The contract and Python SDK resolve the broad API/SDK-surface part of the old question, but tenant entitlement, live backend acceptance, and exact ZIA/ZPA policy-object mapping for IP/IMEI/IMSI identifiers remain open. See [clarification `zscaler-cellular-01`](../_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface).

## Cross-links

- ZIA: [`../zia/index.md`](../zia/index.md)
- ZPA: [`../zpa/index.md`](../zpa/index.md)
- Zero Trust Branch: [`../zero-trust-branch/overview.md`](../zero-trust-branch/overview.md)
- API and SDK surface: [`./api.md`](./api.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
