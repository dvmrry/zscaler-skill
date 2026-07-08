---
product: zscaler-cellular
topic: "zscaler-cellular-claims-ledger"
title: "Zscaler Cellular claims ledger - Tier 3 misc refresh"
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
source-tier: doc
sources:
  - "vendor/zscaler-help/cellular-what-zscaler-cellular.md"
  - "vendor/zscaler-help/zscaler-cellular-marketing.md"
author-status: draft
---

# Zscaler Cellular claims ledger

| Claim | Reference surface | Source line(s) |
|---|---|---|
| Zscaler Cellular is a zero trust connectivity solution for IoT/mobile devices and includes Zscaler SIM plus Zscaler Cellular Edge. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:8` |
| Zscaler SIM devices connect to 4G/5G, traffic routes to Cellular Edge, and Cellular Edge forwards to ZTE for inspection and policy enforcement. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:10-15` |
| Policy enforcement can use IP address, IMEI, or IMSI. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:26-29` |
| Zscaler SIM is a data-only SIM for IoT devices where agents are not feasible, and can enforce policy via ZIA/ZPA based on IP/IMEI/IMSI. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:45-53` |
| Cellular Edge forwards traffic from or to a Zscaler SIM to the ZTE and provides traffic aggregation, bidirectional control, HA, and telemetry insights. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:56-63` |
| Cellular Admin Portal capabilities include SIM management, eSIM assignment/activation, network events, anomaly detection, SIM location groups, geofence policies, and Cellular Edge deployment/monitoring. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:65-67` |
| Marketing capture lists Zscaler Cellular Service and Zscaler Cellular Partner Service as two service motions. | `overview.md` | `vendor/zscaler-help/zscaler-cellular-marketing.md:26-27` |
| ZCell now has a captured Automate API contract with 36 operations across nine families. | `index.md`, `overview.md`, `api.md` | `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:28`; `vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md:14`; `vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:2-6458` |
| Python SDK exposes `client.zcell` as a OneAPI-only service with nine subclients. | `index.md`, `overview.md`, `api.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:281-287`; `vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py:37-103` |
| ZCell API calls are customer-scoped with `zcellCustomerId` / `ZCELL_CUSTOMER_ID`, separate from ZPA `customerId`. | `api.md` | `vendor/zscaler-sdk-python/zscaler/config/config_setter.py:23-28`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:159-172`; `vendor/zscaler-sdk-python/README.md:385-402` |
| No product-specific Zscaler Cellular Go SDK, Terraform, Ansible, or MCP surface was found in the audited vendor trees. | `overview.md`, `api.md` | AUDIT-SCOPED ABSENCE -> 2026-07-08 search across Go SDK, Terraform providers, Ansible collections, and MCP server for ZCell / Zscaler Cellular service surfaces. |
| Cellular admin/API surface is partially resolved: public contract + Python SDK are now source-backed, while tenant entitlement, backend acceptance, and ZIA/ZPA policy-object mapping remain unresolved. | `overview.md`, `api.md`, `clarifications.md` | PARTIAL -> `references/_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface` |
