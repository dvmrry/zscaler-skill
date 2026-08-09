---
product: zscaler-cellular
topic: overview
title: "Zscaler Cellular - SIM and Cellular Edge forwarding into ZTE"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 8a73a5fcf0bbb8507a47c09e9a6f379447ce3807
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/cellular-what-zscaler-cellular.md"
  - "vendor/zscaler-help/zscaler-cellular-help-index.md"
  - "vendor/zscaler-help/zscaler-cellular-marketing.md"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json"
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-mcp-server/docs/guides/toolsets.md"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/client.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/_common.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/investigate_sim.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/audit_data_usage.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py"
  - "vendor/zscaler-mcp-server/tests/test_docgen.py"
  - "vendor/zscaler-mcp-server/tests/test_prompts.py"
author-status: draft
---

# Zscaler Cellular - SIM and Cellular Edge forwarding into ZTE

This began as a thin Tier-C reference, but the current source set now includes a captured Automate ZCell contract, a Python SDK `client.zcell` namespace, and a read-only MCP layer. Treat it as a documented API + Python SDK + MCP-read surface; the prior audit found no Terraform, Ansible, or Go SDK ZCell family.

## Source-family sweep

| Family | Audit result |
|---|---|
| Go SDK | No Zscaler Cellular / Cellular Edge / Zscaler SIM product service surface found in the audited Go SDK tree. |
| Python SDK | `client.zcell` is a OneAPI-only service and exposes nine subclients for anomaly policy, audit data, customer data, customer regions, network events, SIM analytics, SIM handling, SIM location groups, and tags (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:279-285`; `vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py:37-106`). |
| Terraform | No Zscaler Cellular resources or data sources found in the audited ZIA or ZPA providers. |
| Ansible | No Zscaler Cellular modules found in the audited ZIA or ZPA collections. |
| MCP | v0.15 exposes 20 read-only tools across nine ZCell toolsets plus three guided prompts (`vendor/zscaler-mcp-server/tests/test_docgen.py:119-123`; `vendor/zscaler-mcp-server/docs/guides/toolsets.md:141-153`; prompt registrations at `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/investigate_sim.py:22-27`, `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/audit_data_usage.py:21-26`, and `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py:22-27`; prompt coverage at `vendor/zscaler-mcp-server/tests/test_prompts.py:166-244`). |
| Automate contract | 36 ZCell operations captured (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:15`). |
| Help | The live index exposes 21 articles, while only the What Is and Architecture bodies are captured. The captured body describes Zscaler SIM and Zscaler Cellular Edge; the remaining titles establish a capture backlog, not article semantics (`vendor/zscaler-help/zscaler-cellular-help-index.md:8-47`; `vendor/zscaler-help/cellular-what-zscaler-cellular.md:8`). |

## What it is

The Help capture describes Zscaler Cellular as a secure connectivity solution for IoT and mobile devices on a Zero Trust architecture, made up of Zscaler SIM and Zscaler Cellular Edge (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:8`). It says devices with Zscaler SIM connect to public 4G/5G networks, traffic routes to the nearest Cellular Edge, and Cellular Edge forwards traffic to the Zero Trust Exchange for inspection and policy enforcement (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:10-15`).

The architecture capture says Zscaler SIM is a data-only SIM that integrates directly with ZTE for IoT devices where agent-based solutions are not feasible (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:45-53`). It says Cellular Edge forwards traffic from or to a Zscaler SIM to the ZTE and acts as an egress point to funnel cellular traffic to the Zero Trust Exchange (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:56-63`).

## Policy and admin scope

The Help capture says policy enforcement can be based on IP address, IMEI, or IMSI (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:26-29`). It also says the admin portal supports SIM management, eSIM assignment and activation, network events, anomaly detection, SIM location groups, geofence anomaly policies, and Cellular Edge deployment/monitoring (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:65-67`).

The marketing capture lists Zscaler Cellular Service and Zscaler Cellular Partner Service as the two deployment/service motions (`vendor/zscaler-help/zscaler-cellular-marketing.md:26-27`).

## Programmability posture

ZCell has a documented API surface, a Python SDK wrapper, and a read-only MCP layer. The contract covers anomaly policies, audit search/metadata, customer data, customer regions, network events, SIM analytics, SIM actions/search/details, SIM location groups, and tags (`vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json:2-14`, `:1506-1518`, `:1956-2079`, `:2430-2583`, `:2812-2824`, `:3280-3713`, `:3801-5594`, `:5673-6458`). The Python SDK exposes the same product as `client.zcell`; its README states that ZCell uses OneAPI OAuth2 credentials and a separate `zcellCustomerId` / `ZCELL_CUSTOMER_ID` value for `/customers/{id}` scoping (`vendor/zscaler-sdk-python/README.md:385-402`). MCP enforces that separate customer ID at client construction and does not ask callers to pass it into each tool (`vendor/zscaler-mcp-server/src/zscaler_mcp/client.py:24-40`, `:48-98`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/_common.py:17-19`).

MCP covers SIM inventory/detail, analytics, location-group reads, anomaly reads, customer/region reads, audit, network events, and tags, with 20 read-only registrations across those toolsets (`vendor/zscaler-mcp-server/tests/test_docgen.py:119-123`; `vendor/zscaler-mcp-server/docs/guides/toolsets.md:141-153`). It does not expose the contract/SDK mutation or export operations: anomaly-policy management, customer/region updates, SIM download/tag/lock/status/eSIM actions, location-group management, or tag creation (SDK gap sources summarized in [`./api.md`](./api.md#mcp-v015-surface)). The Help portal's management scope is broader still, including SIM/eSIM activation, anomaly policies, and location-group management (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:65-67`). Do not infer Terraform manageability, full client parity, or live entitlement from the presence of MCP tool registrations.

## Open questions

- `zscaler-cellular-01`: The contract, Python SDK, and MCP read layer resolve the broad surface question, but tenant entitlement, live backend acceptance, and exact ZIA/ZPA policy-object mapping for IP/IMEI/IMSI identifiers remain open. See [clarification `zscaler-cellular-01`](../_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface).
- MCP request/response divergences for anomaly violations, SIM pagination, and audit filters are tracked in [`./api.md`](./api.md#mcp-v015-divergences-and-test-boundary) and clarifications `zscaler-cellular-02`–`zscaler-cellular-04`.
- Nineteen current Help article bodies remain uncaptured across setup, deployment/credentials, SIM/eSIM lifecycle, network events, anomaly/geofence operations, and audit logs (`vendor/zscaler-help/zscaler-cellular-help-index.md:12-47`).

## Cross-links

- ZIA: [`../zia/index.md`](../zia/index.md)
- ZPA: [`../zpa/index.md`](../zpa/index.md)
- Zero Trust Branch: [`../zero-trust-branch/overview.md`](../zero-trust-branch/overview.md)
- API and SDK surface: [`./api.md`](./api.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
