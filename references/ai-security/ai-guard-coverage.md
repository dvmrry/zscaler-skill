---
product: ai-guard
topic: coverage
title: "AI Guard public-source coverage manifest"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/zguard-ai-integrations: 7da6ed977fb3987203001dc78e9146e507cb1407
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: e68b53e17f61870f3bec2a68bff3e3d4f1c6db05
  vendor/terraform-provider-ztc: 6516b4a032ef4a5ece183a0f42a5026b11ac94ca
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
  vendor/zscaler-terraform-skills: f85c5bc723a7ff948d53a0a92d69cbcaaacb8452
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md"
  - ".gitmodules"
  - "vendor/README.md"
  - "vendor/zscaler-help/ai-guard-help-index.md"
  - "vendor/zscaler-help/ai-guard-users-help-index.md"
  - "vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md"
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
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/pyproject.toml"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policies.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py"
  - "vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
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
  - "vendor/zscaler-mcp-server/pyproject.toml"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py"
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

Source: `vendor/zscaler-help/ai-guard-help-index.md`; `vendor/zscaler-help/ai-guard-users-help-index.md`; `vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zguard-ai-integrations/README.md`.

This manifest is the certification boundary for AI Guard coverage in this repo. The 2026-05-22 **Secure AI Apps & Infrastructure** tree was captured article by article, but the current 2026-07-20 portal publishes a different 24-article **AI Guard for Users** tree. Its index and 2026 release chronology are captured; the bodies of the newly listed architecture, quick-start, prompt-allowlist, best-practice, topology, token-usage, audit, and troubleshooting articles are not yet individually captured (`vendor/zscaler-help/ai-guard-users-help-index.md:8-47`).

Acceptable shorthand: **the legacy May Help tree, Python SDK 1.9.39 configuration and legacy-runtime surfaces, Automate contract, and public integrations are captured; the current AI Guard for Users Help tree is indexed but only partially mined at article-body depth**. Python SDK 1.9.39 is pinned at `vendor/zscaler-sdk-python/pyproject.toml:1-4`; its canonical accessor and separate legacy-runtime route are documented at `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385` and `:671-712`.

Do not extend that sentence to private roadmap features, unpublished tenant entitlements, commercial packaging, field-level log schemas not present in Help, or client-wrapper coverage not present in public SDK/API sources.

## Source classes checked

Source: `.gitmodules`; `vendor/README.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zguard-ai-integrations/README.md`; `vendor/zscaler-sdk-go`; `vendor/terraform-provider-zia`; `vendor/terraform-provider-zpa`; `vendor/terraform-provider-ztc`; `vendor/zscaler-mcp-server`; `vendor/zscaler-terraform-skills`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md`; `vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md`; `vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`; `vendor/zscaler-help/what-workflow-automation.md`.

This pass checked both captured Help indexes, the 2026 release chronology, Python SDK 1.9.39, public `zguard-ai-integrations` examples, the reconstructed Automate snapshot, and the vendored Go SDK, Terraform providers, Terraform skills, MCP server, Postman API specs, and local Automation Hub captures available in this repository. The Python SDK now exposes six OneAPI configuration resources plus a separately routed legacy policy-detection interface (`vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-380`, `:671-712`). Its six configuration resources contain 39 callable methods, while Automate validates 47 operations across 29 paths with zero structural issues (`vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412`; `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-10`).

No Go SDK service, Terraform resource, Postman endpoint, or Automation Hub procedure for that admin plane was found in the captured source classes. The MCP pin is now v0.14.0 (`vendor/zscaler-mcp-server/pyproject.toml:1-4`); its registry derives the available toolset IDs from registered specs (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:61-67`), and the complete generated toolset catalog contains no AI Guard toolset (`vendor/zscaler-mcp-server/docs/guides/toolsets.md:33-153`). MCP can govern AI applications through adjacent ZIA Cloud App Control rules—including the `AI_ML` category and apps such as ChatGPT—but that is ZIA traffic-policy enforcement, not an AI Guard service or AI Guard API wrapper (`vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md:3-22`, `:85`). Treat the remaining client gaps as coverage boundaries, not as proof about entitlements, private surfaces, or future support; see [`./api-divergences.md`](./api-divergences.md#automate-admin-plane-contract-vs-client-surfaces). The separate AI Security asset/findings API is covered in [`./asset-management-api.md`](./asset-management-api.md).

## Help article coverage

Source: `vendor/zscaler-help/ai-guard-help-index.md`; `vendor/zscaler-help/ai-guard-users-help-index.md`; `vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md`.

The current tree contains 24 articles: six Getting Started, seven Configuration, two Best Practices, six Monitoring, and three Troubleshooting entries (`vendor/zscaler-help/ai-guard-users-help-index.md:10-47`). Newly indexed topics include architecture, multilingual support, Microsoft 365 Copilot and ChatGPT quick starts, prompt allowlisting, detector best-practice runbooks, user-group/provider topology, token usage, audit logs, detection summaries, and latency. The release capture independently records shipped additions through July 10, including tenant restriction, M365 Copilot streaming inspection, encrypted prompt allowlisting, custom RBAC, ADX and Splunk export, Codex and GitHub Copilot handling, default-provider auto-provisioning, and newer provider/detector support (`vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:9-55`).

The table below is the article-body coverage for the **May 22 legacy tree**, not a certification of the current July tree.

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

Source: `vendor/zscaler-sdk-python/zscaler/oneapi_client.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-sdk-python/CHANGELOG.md`; `vendor/zscaler-sdk-python/README.md`.

The package is now `zscaler.aiguard`, with `client.aiguard` as the canonical accessor and `client.zguard` retained only as a deprecated alias (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385`). The SDK's OneAPI configuration inventory is:

| `client.aiguard` resource | Callable methods | Count | Source |
|---|---|---:|---|
| `policies` | list, get by ID/name, create, update, delete | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357` |
| `policy_match_rules` | list, get by ID/name, create, update, delete | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338` |
| `llm_providers` | list/get providers, list/get provider types, create, update, delete | 8 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457` |
| `llm_provider_credentials` | list, get by ID/name, create, update, delete | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362` |
| `llm_applications` | list, get by ID/name, create, update, delete | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363` |
| `llm_application_credentials` | list, get by ID/name, create, regenerate, update, delete | 7 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412` |

Policy detection remains a separate two-method `LegacyAIGuardClient(...).aiguard.policy_detection` route for `execute_policy` and `resolve_and_execute_policy` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:671-712`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:35-49`, `:57-63`, `:138-143`). This is Python-client routing, not a universal claim about backend authentication or endpoint availability.

The 47-operation Automate contract therefore exceeds the callable Python configuration surface by eight operations: policy enable, disable, referential check, and summaries, plus referential checks for providers, provider credentials, applications, and application credentials (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:1954-1966`, `:3956-3968`, `:5229-5241`, `:6142-6154`, `:7166-7178`). The four resource referential-check methods are commented out with an SDK-maintainer note that they returned HTTP 404, so their status is an open live-acceptance discrepancy rather than a backend conclusion (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`). The changelog's “full OneAPI support” claim and referential-check inventory, plus the README's availability list, conflict with that callable code state (`vendor/zscaler-sdk-python/CHANGELOG.md:112-163`; `vendor/zscaler-sdk-python/README.md:1445-1452`).

## Integration coverage

Source: `vendor/zguard-ai-integrations/README.md`; `vendor/zguard-ai-integrations/github-actions/README.md`; `vendor/zguard-ai-integrations/Windsurf/README.md`; `vendor/zguard-ai-integrations/n8n/README.md`; `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read_README.md`.

The public `zguard-ai-integrations` repository is captured as a submodule and summarized in [`./ai-guard.md`](./ai-guard.md). It provides implementation examples for IDE/agent hooks, gateways/proxies, CI/CD validation, app/orchestration integrations, and guardrail frameworks. The current synthesis covers the repository-level DAS pattern plus representative GitHub Actions, Windsurf, n8n, Claude Code file-read, and Azure APIM examples. Treat these as example integration patterns, not as evidence of admin-plane programmability.

## Open verification gaps

Source: `vendor/zscaler-help/ai-guard-about-ai-guard-insights.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py`.

- Commercial packaging, SKU boundaries, and entitlement behavior are not captured.
- Inline/proxy latency budgets are not published in captured Help.
- Log-export destinations are captured, but field-level export schemas are not.
- Custom detector authoring beyond the documented detector configuration fields is not confirmed.
- AI Red Teaming and AI Guard workflow interlock is not confirmed.
- Python does not yet wrap eight Automate-documented operations; four referential-check methods are commented out after an SDK-maintainer 404 observation and require live acceptance testing (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`).
- Go SDK, Terraform, MCP, Postman, and Automation Hub wrappers for the AI Guard admin-plane contract are not present in the inspected captured sources; do not infer entitlement or backend availability from that coverage gap.
- Current AI Guard for Users article bodies beyond the overlapping legacy captures have not yet been mined individually.
- Help calls GitHub Copilot, ElevenLabs, Windsurf, Mistral Vibe, Gamma, and Builder.io supported providers/applications, while the Automate provider-type enum uses a narrower/different identifier set; the relationship between Help provider labels and admin-plane provider types is unresolved.

These gaps mean current Help coverage is **indexed but incomplete at article-body depth**. They also mark boundaries where public Help/SDK sources do not expose enough detail to certify behavior beyond the documented surface.

## Cross-links

- AI Guard reference: [`./ai-guard.md`](./ai-guard.md)
- API and integration divergences: [`./api-divergences.md`](./api-divergences.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
- AI Security overview: [`./overview.md`](./overview.md)
- AI Security index: [`./index.md`](./index.md)
- Portfolio classification: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
