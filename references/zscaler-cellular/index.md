---
product: zscaler-cellular
topic: "zscaler-cellular-index"
title: "Zscaler Cellular / ZCell reference hub"
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

# Zscaler Cellular / ZCell reference hub

Entry point for Zscaler Cellular questions. The source picture changed after the original Tier-C pass: the product still has Help/marketing coverage for SIM and Cellular Edge architecture, but it now also has a captured Automate contract and a Python SDK `client.zcell` namespace. It still has no Go SDK, Terraform, Ansible, or MCP surface found in this repository.

## Topics

| Topic | File | Status |
|---|---|---|
| Overview — product shape, SIM / Cellular Edge flow, portal-admin scope, and remaining source boundaries | [`./overview.md`](./overview.md) | draft |
| API and SDK surface — 36 captured Automate operations, Python `client.zcell.*` service families, OneAPI customer-ID scoping, and non-Python absence | [`./api.md`](./api.md) | draft |
| Claims ledger — claim-by-claim source map and open-question forcing function | [`./_claims-ledger.md`](./_claims-ledger.md) | draft |

## Scope boundary

Use this hub for Zscaler SIM, Cellular Edge, ZCell API, SIM inventory/search/actions, SIM analytics, anomaly policies, tags, customer regions, and network-event search.

Do not treat the captured API as proof that a tenant owns or can call every endpoint. Tenant entitlement, backend acceptance, and the mapping between IP/IMEI/IMSI identifiers and ZIA/ZPA policy objects remain bounded by [clarification `zscaler-cellular-01`](../_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface).
