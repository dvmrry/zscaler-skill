---
product: zscaler-cellular
topic: "zscaler-cellular-claims-ledger"
title: "Zscaler Cellular claims ledger - Tier 3 misc refresh"
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
  - "vendor/zscaler-help/cellular-what-zscaler-cellular.md"
  - "vendor/zscaler-help/zscaler-cellular-help-index.md"
  - "vendor/zscaler-help/zscaler-cellular-marketing.md"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json"
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_response.py"
  - "vendor/zscaler-sdk-python/zscaler/config/config_setter.py"
  - "vendor/zscaler-sdk-python/zscaler/utils.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/anomaly_policy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/customer_data_handling.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/customer_region_handling.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/sim_handling.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/sim_location_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/models/sim_location_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zcell/tag_handling.py"
  - "vendor/zscaler-mcp-server/CHANGELOG.md"
  - "vendor/zscaler-mcp-server/docs/guides/toolsets.md"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/client.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/_common.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/anomaly_policy.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/audit_data_handling.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/sim_handling.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/investigate_sim.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/audit_data_usage.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/security/entitlements.py"
  - "vendor/zscaler-mcp-server/tests/test_docgen.py"
  - "vendor/zscaler-mcp-server/tests/test_prompts.py"
  - "vendor/zscaler-mcp-server/tests/test_shaping_helpers.py"
author-status: draft
---

# Zscaler Cellular claims ledger

| Claim | Reference surface | Source line(s) |
|---|---|---|
| Zscaler Cellular is a zero trust connectivity solution for IoT/mobile devices and includes Zscaler SIM plus Zscaler Cellular Edge. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:8` |
| The current public ZCell Help index exposes 21 articles; only two article bodies are captured, so 19 remain a body-level coverage gap. | `index.md`, `overview.md` | `vendor/zscaler-help/zscaler-cellular-help-index.md:8-47`; `ARTICLE-BODY GAP -> references/zscaler-cellular/index.md#scope-boundary` |
| Zscaler SIM devices connect to 4G/5G, traffic routes to Cellular Edge, and Cellular Edge forwards to ZTE for inspection and policy enforcement. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:10-15` |
| Policy enforcement can use IP address, IMEI, or IMSI. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:26-29` |
| Zscaler SIM is a data-only SIM for IoT devices where agents are not feasible, and can enforce policy via ZIA/ZPA based on IP/IMEI/IMSI. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:45-53` |
| Cellular Edge forwards traffic from or to a Zscaler SIM to the ZTE and provides traffic aggregation, bidirectional control, HA, and telemetry insights. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:56-63` |
| Cellular Admin Portal capabilities include SIM management, eSIM assignment/activation, network events, anomaly detection, SIM location groups, geofence policies, and Cellular Edge deployment/monitoring. | `overview.md` | `vendor/zscaler-help/cellular-what-zscaler-cellular.md:65-67` |
| Marketing capture lists Zscaler Cellular Service and Zscaler Cellular Partner Service as two service motions. | `overview.md` | `vendor/zscaler-help/zscaler-cellular-marketing.md:26-27` |
| ZCell has a captured Automate API contract with 36 operations across nine families. | `index.md`, `overview.md`, `api.md` | `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:15`; `vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:2-6458` |
| Python SDK exposes `client.zcell` as a OneAPI-only service with nine subclients. | `index.md`, `overview.md`, `api.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:279-285`; `vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py:37-106` |
| ZCell API calls are customer-scoped with `zcellCustomerId` / `ZCELL_CUSTOMER_ID`, separate from ZPA `customerId`. | `api.md` | `vendor/zscaler-sdk-python/zscaler/config/config_setter.py:23-28`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:156-171`; `vendor/zscaler-sdk-python/README.md:385-402` |
| No product-specific Zscaler Cellular Go SDK, Terraform, or Ansible surface was found in the prior audited trees; those three absence claims were not re-audited during the MCP v0.15 refresh. | `overview.md`, `api.md` | AUDIT-SCOPED ABSENCE -> 2026-07-08 search across Go SDK, Terraform providers, and Ansible collections for ZCell / Zscaler Cellular service surfaces; current MCP release at `vendor/zscaler-mcp-server/CHANGELOG.md:3-7`. |
| MCP v0.15 includes 20 read-only ZCell tools across nine ZCell toolsets. | `index.md`, `overview.md`, `api.md` | `vendor/zscaler-mcp-server/CHANGELOG.md:140-159`; `vendor/zscaler-mcp-server/tests/test_docgen.py:119-123`; `vendor/zscaler-mcp-server/docs/guides/toolsets.md:141-153` |
| MCP adds three guided ZCell prompts: investigate a SIM, audit data usage, and review anomaly policies. Prompts orchestrate the read tools; they do not add mutation coverage. | `index.md`, `api.md` | `vendor/zscaler-mcp-server/tests/test_prompts.py:166-244`; read-only inventory at `vendor/zscaler-mcp-server/tests/test_docgen.py:119-123` |
| ZCell tools require the shared OneAPI credentials plus a separate `ZCELL_CUSTOMER_ID`; the customer ID is injected into `zcellCustomerId` and is not a per-call tool argument. | `api.md` | `vendor/zscaler-mcp-server/src/zscaler_mcp/client.py:24-40`, `:48-98`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/_common.py:17-19` |
| Time-bounded MCP reads expose a local `days` shorthand, default 7 and constrained to 1–365; they do not expose raw start/end timestamps. | `api.md` | `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/_common.py:35-56`; `vendor/zscaler-sdk-python/zscaler/utils.py:485-558` |
| MCP v0.15 record tools preserve every attribute carried by their decoded SDK model or dictionary input. ZCell audit rows and SIM detail/search therefore return the full decoded records or envelope; this is not raw-HTTP fidelity, and fields such as `old_data`, `new_data`, or `usageVal` appear only if the SDK model's `as_dict()` result carries them. | `api.md` | `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:43-56`; `vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:50-113`; `vendor/zscaler-mcp-server/tests/test_shaping_helpers.py:45-89`, `:97-134`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/_common.py:59-77`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/audit_data_handling.py:83-113`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/sim_handling.py:100-122`, `:125-162`; contract field at `vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:11720-11726` |
| Anomaly-violation ICCID strings can still be lost before MCP shaping: the SDK response cleaner drops non-dictionary ZCell page items, while the MCP violation tool now passes through every decoded item it receives. | `api.md` | `vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:4080-4200`; `vendor/zscaler-sdk-python/zscaler/oneapi_response.py:260-290`; `vendor/zscaler-sdk-python/zscaler/zcell/anomaly_policy.py:363-430`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/anomaly_policy.py:149-177` |
| MCP is a 20-operation read/search subset, not parity with the captured 36-operation contract; 16 mutation/export operations remain SDK/API-only. | `api.md` | Totals: `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:15`; `vendor/zscaler-mcp-server/tests/test_docgen.py:119-123`. Omitted operation families: `vendor/zscaler-sdk-python/zscaler/zcell/anomaly_policy.py:117-241`, `:311-347`; `vendor/zscaler-sdk-python/zscaler/zcell/customer_data_handling.py:74-108`; `vendor/zscaler-sdk-python/zscaler/zcell/customer_region_handling.py:85-116`; `vendor/zscaler-sdk-python/zscaler/zcell/sim_handling.py:96-177`, `:179-284`, `:328-454`; `vendor/zscaler-sdk-python/zscaler/zcell/sim_location_groups.py:131-268`; `vendor/zscaler-sdk-python/zscaler/zcell/tag_handling.py:91-121` |
| Python v1.9.40 repairs the SIM location-group get-by-ID geofence model, but create still serializes through the old model: it drops `geo_fence_details` and recognizes tracked devices only as exact wire-case `trackedDevices`. Update likewise recognizes only wire-case `geoFenceData` / `trackedDevices` before request conversion. | `api.md` | Release claim: `vendor/zscaler-sdk-python/CHANGELOG.md:21-30`; create contract: `vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:6548-6617`; service/model mismatch: `vendor/zscaler-sdk-python/zscaler/zcell/sim_location_groups.py:23-28,91-172`; `vendor/zscaler-sdk-python/zscaler/zcell/models/sim_location_groups.py:22-51,81-188,249-283` |
| Cellular admin/API surface is partially resolved: public contract, Python SDK, and read-only MCP automation are source-backed, while live entitlement/backend acceptance, ZIA/ZPA policy-object mapping, and several MCP request/response divergences remain unresolved. | `overview.md`, `api.md`, `clarifications.md` | PARTIAL -> `references/_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface`; `references/_meta/clarifications.md#zscaler-cellular-02-mcp-violation-response-shape`; `references/_meta/clarifications.md#zscaler-cellular-03-mcp-sim-pagination-routing`; `references/_meta/clarifications.md#zscaler-cellular-04-mcp-audit-request-contract` |
