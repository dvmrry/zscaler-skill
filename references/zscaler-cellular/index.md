---
product: zscaler-cellular
topic: "zscaler-cellular-index"
title: "Zscaler Cellular / ZCell reference hub"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: c26c394767d7344a4ac41658d1d5fb2c4b7d4716
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
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
  - "vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/client.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/investigate_sim.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/audit_data_usage.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py"
  - "vendor/zscaler-mcp-server/tests/test_docgen.py"
  - "vendor/zscaler-mcp-server/tests/test_prompts.py"
author-status: draft
---

# Zscaler Cellular / ZCell reference hub

Entry point for Zscaler Cellular questions. The source picture changed after the original Tier-C pass: the product has Help/marketing coverage for SIM and Cellular Edge architecture, a captured 36-operation Automate contract (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:15`), a Python SDK `client.zcell` namespace (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:279-285`), and the pinned MCP v0.14 tree includes a 20-tool read-only layer with three guided prompts (`vendor/zscaler-mcp-server/tests/test_docgen.py:119-123`; prompt registrations at `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/investigate_sim.py:22-27`, `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/audit_data_usage.py:21-26`, and `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py:22-27`; prompt coverage at `vendor/zscaler-mcp-server/tests/test_prompts.py:166-244`). The prior audit recorded no Go SDK, Terraform, or Ansible ZCell surface; see the audit-scoped claim in [`./_claims-ledger.md`](./_claims-ledger.md).

The current Help index contains 21 articles spanning setup, dashboards/deployment, SIM/eSIM lifecycle, network events, anomaly/geofence management, and audit logs (`vendor/zscaler-help/zscaler-cellular-help-index.md:8-47`). Only the What Is and Architecture bodies are captured today; the index is a coverage map, not evidence that the remaining 19 article bodies have been mined.

## Topics

| Topic | File | Status |
|---|---|---|
| Overview — product shape, SIM / Cellular Edge flow, portal-admin scope, and remaining source boundaries | [`./overview.md`](./overview.md) | draft |
| API, SDK, and MCP surface — 36 captured operations, Python `client.zcell.*`, 20 MCP read tools across nine toolsets, three guided prompts, separate customer-ID scoping, and parity/divergence gaps | [`./api.md`](./api.md) | draft |
| Claims ledger — claim-by-claim source map and open-question forcing function | [`./_claims-ledger.md`](./_claims-ledger.md) | draft |

## Scope boundary

Use this hub for Zscaler SIM, Cellular Edge, ZCell API, SIM inventory/search/actions, SIM analytics, anomaly policies, tags, customer regions, and network-event search.

Do not treat the captured API or registered MCP tools as proof that a tenant owns or can call every endpoint. MCP provides visibility and guided investigation, not ZCell mutation/export parity; use the SDK/API for those operations and account for the request/response divergences in [`./api.md`](./api.md#mcp-v014-divergences-and-test-boundary). Tenant entitlement, backend acceptance, and the mapping between IP/IMEI/IMSI identifiers and ZIA/ZPA policy objects remain bounded by [clarification `zscaler-cellular-01`](../_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface).

For Help-sourced operational detail beyond the two captured bodies, answer at index-level only and route the missing article to a future capture. Do not infer credential workflows, SIM-state transitions, geofence semantics, or audit fields from titles alone (`vendor/zscaler-help/zscaler-cellular-help-index.md:6`, `:12-47`).
