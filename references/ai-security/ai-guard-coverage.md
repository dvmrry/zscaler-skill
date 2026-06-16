---
product: ai-guard
topic: coverage
title: "AI Guard public-source coverage manifest"
content-type: reference
last-verified: "2026-06-16"
verified-against:
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
  vendor/zguard-ai-integrations: 7da6ed977fb3987203001dc78e9146e507cb1407
  vendor/terraform-provider-zia: 717926eb564bb21dea1f8e0c3222e6593b29f849
  vendor/terraform-provider-zpa: 8d7d7f3a8fc63bd428233b629eb08bce834e975c
  vendor/terraform-provider-ztc: 766a6c1e0be3266203a3cea4b5255ab4a6f26695
  vendor/zscaler-mcp-server: a2162c384e1ffb68b3bf14783ea9a1a762c85ff5
  vendor/zscaler-terraform-skills: b5d2c5ef0aa3d583ee79e949a9072352af71265b
confidence: high
source-tier: mixed
sources:
  - ".gitmodules"
  - "vendor/README.md"
  - "vendor/zscaler-help/ai-guard-help-index.md"
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-users.md"
  - "vendor/zscaler-help/ai-guard-api-user-guide.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-managing-llm-providers-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-managing-llm-provider-credentials-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-add-and-manage-ai-applications-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-add-and-manage-ai-guard-policies.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-policy-control.md"
  - "vendor/zscaler-help/ai-guard-ai-guard-policy-testing.md"
  - "vendor/zscaler-help/ai-guard-managing-tenant-settings.md"
  - "vendor/zscaler-help/ai-guard-dashboard.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-insights.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-usage.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py"
  - "vendor/zguard-ai-integrations/README.md"
  - "vendor/zguard-ai-integrations/github-actions/README.md"
  - "vendor/zguard-ai-integrations/Windsurf/README.md"
  - "vendor/zguard-ai-integrations/n8n/README.md"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read_README.md"
  - "vendor/zscaler-sdk-go/"
  - "vendor/terraform-provider-zia/"
  - "vendor/terraform-provider-zpa/"
  - "vendor/terraform-provider-ztc/"
  - "vendor/zscaler-mcp-server/"
  - "vendor/zscaler-terraform-skills/"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-help/dlp-incidents-workflow-automation-api.md"
  - "vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md"
  - "vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md"
  - "vendor/zscaler-help/understanding-workflows-workflow-automation.md"
  - "vendor/zscaler-help/what-workflow-automation.md"
author-status: reviewed
---

# AI Guard public-source coverage manifest

Source: `vendor/zscaler-help/ai-guard-help-index.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py`; `vendor/zguard-ai-integrations/README.md`.

This manifest is the certification boundary for AI Guard coverage in this repo. As of 2026-05-22, every article visible in the public **AI Guard Help** category tree is captured under `vendor/zscaler-help/` and mapped into the AI Security reference set. The runtime policy-detection SDK surface and public integration examples are also captured.

Acceptable shorthand: **all publicly discoverable Zscaler AI Guard Help features are documented and certified in this repo as of 2026-05-22**.

Do not extend that sentence to private roadmap features, unpublished tenant entitlements, commercial packaging, field-level log schemas not present in Help, or broad admin APIs not present in public SDK/API sources.

## Source classes checked

Source: `.gitmodules`; `vendor/README.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zguard-ai-integrations/README.md`; `vendor/zscaler-sdk-go`; `vendor/terraform-provider-zia`; `vendor/terraform-provider-zpa`; `vendor/terraform-provider-ztc`; `vendor/zscaler-mcp-server`; `vendor/zscaler-terraform-skills`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md`; `vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md`; `vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`; `vendor/zscaler-help/what-workflow-automation.md`.

This pass checked the captured public Help tree, the Python SDK policy-detection surface, public `zguard-ai-integrations` examples, and the vendored Go SDK, Terraform providers, Terraform skills, MCP server, Postman API specs, and local Automation Hub captures available in this repository. The positive AI Guard programmable surface found in those sources is the Python SDK / DaaS policy-detection API plus integration examples; no AI Guard admin-plane API, Go SDK service, Terraform resource, MCP tool, Postman endpoint, or Automation Hub procedure was found in the captured source classes. Treat that as an audit-scoped absence claim, not as proof about private or future surfaces; see [`./api-divergences.md`](./api-divergences.md#source-classes-with-no-ai-guard-admin-plane-hit).

## Help article coverage

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`.

| Help category | Public article | Captured file | Coverage status |
|---|---|---|---|
| Getting Started | What Is AI Guard? | `vendor/zscaler-help/ai-guard-what-is.md` | Covered in [`./ai-guard.md`](./ai-guard.md) and [`./overview.md`](./overview.md) |
| Getting Started | Step-by-Step Configuration Guide for AI Guard | `vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md` | Covered in configuration workflow |
| Getting Started | Integrating ZIA with AI Guard | `vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md` | Covered in ZIA integration and operational notes |
| Getting Started | Viewing AI Guard System Users | `vendor/zscaler-help/ai-guard-managing-ai-guard-users.md` | Covered as system-user surface and RBAC linkage |
| Getting Started | AI Guard API Request Construction User Guide | `vendor/zscaler-help/ai-guard-api-user-guide.md` | Covered in provider/API surface |
| Getting Started | Test LLM Providers in AI Guard Proxy Mode | `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md` | Covered in provider/API surface |
| Getting Started | Test LLM Providers in AI Guard DAS/API Mode | `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md` | Covered in DaaS/API surface |
| Configuration | Managing Role-Based Access Control in AI Guard | `vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md` | Covered in tenant/provider configuration |
| Configuration | Managing LLM Providers for AI Guard | `vendor/zscaler-help/ai-guard-managing-llm-providers-ai-guard.md` | Covered in tenant/provider configuration |
| Configuration | Managing LLM Provider Credentials for AI Guard | `vendor/zscaler-help/ai-guard-managing-llm-provider-credentials-ai-guard.md` | Covered in tenant/provider configuration |
| Configuration | Adding and Managing AI Applications for AI Guard | `vendor/zscaler-help/ai-guard-add-and-manage-ai-applications-ai-guard.md` | Covered in policy management |
| Configuration | Adding and Managing AI Guard Policy Configurations | `vendor/zscaler-help/ai-guard-add-and-manage-ai-guard-policies.md` | Covered in policy management |
| Configuration | Managing AI Guard Policy Control | `vendor/zscaler-help/ai-guard-managing-ai-guard-policy-control.md` | Covered in policy management |
| Configuration | AI Guard Policy Testing | `vendor/zscaler-help/ai-guard-ai-guard-policy-testing.md` | Covered in policy management |
| Configuration | Managing Tenant Settings | `vendor/zscaler-help/ai-guard-managing-tenant-settings.md` | Covered in tenant/provider configuration |
| Dashboard & Diagnostics | About AI Guard Dashboard | `vendor/zscaler-help/ai-guard-dashboard.md` | Covered in observability |
| Dashboard & Diagnostics | About AI Guard Insights | `vendor/zscaler-help/ai-guard-about-ai-guard-insights.md` | Covered in observability |
| Dashboard & Diagnostics | About AI Guard Usage | `vendor/zscaler-help/ai-guard-about-ai-guard-usage.md` | Covered in observability |
| Dashboard & Diagnostics | Managing AI Guard Log Exports | `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md` | Covered in observability |

## SDK and API coverage

Source: `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py`; `vendor/zscaler-sdk-python/CHANGELOG.md`.

The vendored Python SDK exposes AI Guard runtime policy detection under `zscaler.zaiguard` / `client.zguard.policy_detection`:

| Surface | Coverage status |
|---|---|
| `/v1/detection/execute-policy` | Covered: explicit policy execution with optional `policyId` and `transactionId` |
| `/v1/detection/resolve-and-execute-policy` | Covered: automatic policy resolution with optional `transactionId` |
| Request fields | Covered: `content`, `direction`, optional `policyId`, optional `transactionId` |
| Response fields | Covered: action/severity/status/error/detector response/throttling model summarized in [`./ai-guard.md`](./ai-guard.md) |
| Admin/config APIs | Not found in public SDK/API sources. Portal-admin objects are documented from Help, not claimed as programmable. |

No broad AI Guard admin-plane surface was found in the vendored Go SDK, Terraform providers, MCP server, Postman API specs, or Automation Hub captures during this pass. The positive programmable surface remains Python SDK policy detection plus public DaaS integration examples.

## Integration coverage

Source: `vendor/zguard-ai-integrations/README.md`; `vendor/zguard-ai-integrations/github-actions/README.md`; `vendor/zguard-ai-integrations/Windsurf/README.md`; `vendor/zguard-ai-integrations/n8n/README.md`; `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read_README.md`.

The public `zguard-ai-integrations` repository is captured as a submodule and summarized in [`./ai-guard.md`](./ai-guard.md). It provides implementation examples for IDE/agent hooks, gateways/proxies, CI/CD validation, app/orchestration integrations, and guardrail frameworks. The current synthesis covers the repository-level DAS pattern plus representative GitHub Actions, Windsurf, n8n, Claude Code file-read, and Azure APIM examples. Treat these as example integration patterns, not as evidence of admin-plane programmability.

## Open verification gaps

Source: `vendor/zscaler-help/ai-guard-about-ai-guard-insights.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py`.

- Commercial packaging, SKU boundaries, and entitlement behavior are not captured.
- Inline/proxy latency budgets are not published in captured Help.
- Log-export destinations are captured, but field-level export schemas are not.
- Custom detector authoring beyond the documented detector configuration fields is not confirmed.
- AI Red Teaming and AI Guard workflow interlock is not confirmed.
- Broad admin automation for LLM providers, credentials, applications, policy configurations, policy controls, RBAC roles, tenant settings, dashboard data, insights, usage, or log exports is not found in public SDK/API captures.

These gaps do not mean the public AI Guard Help surface is incomplete in this repo. They mark boundaries where public Help/SDK sources do not expose enough detail to certify behavior beyond the documented surface.

## Cross-links

- AI Guard reference: [`./ai-guard.md`](./ai-guard.md)
- API and integration divergences: [`./api-divergences.md`](./api-divergences.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
- AI Security overview: [`./overview.md`](./overview.md)
- AI Security index: [`./index.md`](./index.md)
- Portfolio classification: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
