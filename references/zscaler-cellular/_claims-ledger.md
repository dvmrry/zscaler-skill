---
product: zscaler-cellular
topic: "zscaler-cellular-claims-ledger"
title: "Zscaler Cellular claims ledger - Tier 3 misc refresh"
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
| No product-specific Zscaler Cellular Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface was found in the audited vendor trees. | `overview.md` | AUDIT-SCOPED ABSENCE -> 2026-06-16 search across all six requested families for Zscaler Cellular / Cellular Edge / Zscaler SIM product surface. |
| Cellular admin/API surface remains unresolved. | `overview.md`, `clarifications.md` | OPEN QUESTION -> `references/_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface` |
