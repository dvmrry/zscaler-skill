---
product: zscaler-cellular
topic: "zscaler-cellular-index"
title: "Zscaler Cellular / ZCell reference hub"
content-type: reference
last-verified: "2026-07-16"
verified-against:
  vendor/zscaler-sdk-go: 4371c9bab44d852526721b4b5999e2471dda5198
  vendor/zscaler-sdk-python: 1a994d0447a4aa5da19471111954cfca2cda3acb
  vendor/terraform-provider-zia: 6e6509f001ca71adcedfd4884250d09227395bf0
  vendor/terraform-provider-zpa: dcf12469a9a8f648be0691c74e9816fc94ec7ddc
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 82d3ff7de6e5939c258e4019db43f138e36c2a7c
  vendor/zscaler-mcp-server: 23912913f8588c650b104d3bd30c0c755d6962cd
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/cellular-what-zscaler-cellular.md"
  - "vendor/zscaler-help/zscaler-cellular-marketing.md"
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
  - "vendor/zscaler-api-specs/automate-zscaler/zcell-api-reference.json"
  - "vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
  - "vendor/zscaler-mcp-server/docs/guides/toolsets.md"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/client.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/investigate_sim.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/audit_data_usage.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py"
author-status: draft
---

# Zscaler Cellular / ZCell reference hub

Entry point for Zscaler Cellular questions. The source picture changed after the original Tier-C pass: the product has Help/marketing coverage for SIM and Cellular Edge architecture, a captured 36-operation Automate contract (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:28`), a Python SDK `client.zcell` namespace (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:281-287`), and the pinned MCP v0.13.1 tree includes a 20-tool read-only layer with three guided prompts (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:489-514`; prompt registrations at `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/investigate_sim.py:22-27`, `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/audit_data_usage.py:21-26`, and `vendor/zscaler-mcp-server/src/zscaler_mcp/prompts/catalog/zcell/review_anomaly_policies.py:22-27`). The prior audit recorded no Go SDK, Terraform, or Ansible ZCell surface; see the audit-scoped claim in [`./_claims-ledger.md`](./_claims-ledger.md).

## Topics

| Topic | File | Status |
|---|---|---|
| Overview — product shape, SIM / Cellular Edge flow, portal-admin scope, and remaining source boundaries | [`./overview.md`](./overview.md) | draft |
| API, SDK, and MCP surface — 36 captured operations, Python `client.zcell.*`, 20 MCP read tools across nine toolsets, three guided prompts, separate customer-ID scoping, and parity/divergence gaps | [`./api.md`](./api.md) | draft |
| Claims ledger — claim-by-claim source map and open-question forcing function | [`./_claims-ledger.md`](./_claims-ledger.md) | draft |

## Scope boundary

Use this hub for Zscaler SIM, Cellular Edge, ZCell API, SIM inventory/search/actions, SIM analytics, anomaly policies, tags, customer regions, and network-event search.

Do not treat the captured API or registered MCP tools as proof that a tenant owns or can call every endpoint. MCP provides visibility and guided investigation, not ZCell mutation/export parity; use the SDK/API for those operations and account for the request/response divergences in [`./api.md`](./api.md#mcp-v0131-divergences-and-test-boundary). Tenant entitlement, backend acceptance, and the mapping between IP/IMEI/IMSI identifiers and ZIA/ZPA policy objects remain bounded by [clarification `zscaler-cellular-01`](../_meta/clarifications.md#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface).
