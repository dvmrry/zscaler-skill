---
product: ai-guard
topic: coverage
title: "AI Guard public-source coverage manifest"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-help: dbe545d5918392c4067ff897e748698c80220fef
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: e7f5f7efb56b6e24667f183e5dff3da03e039cc9
  vendor/zguard-ai-integrations: 71cbab024f369eb50748c9c4a74ec0158c084839
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/terraform-provider-ztc: 6516b4a032ef4a5ece183a0f42a5026b11ac94ca
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
  vendor/zscaler-terraform-skills: d8226c37f7fc7c544cbf60a9faf59eaa49051980
  vendor/zscaler-terraformer: fcb50986af75dd683587b0d86f37fe0c1f93ac71
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md"
  - ".gitmodules"
  - "vendor/README.md"
  - "vendor/zscaler-help/ai-guard-help-index.md"
  - "vendor/zscaler-help/ai-guard-users-help-index.md"
  - "vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md"
  - "vendor/zscaler-help/ai-guard-users-and-user-groups.md"
  - "vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md"
  - "vendor/zscaler-help/adding-ai-ml-applications-rule-cloud-app-control.md"
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
  - "vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md"
  - "vendor/zscaler-help/ai-guard-users-dashboard.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-insights.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-usage.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md"
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/pyproject.toml"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_http_client.py"
  - "vendor/zscaler-sdk-python/zscaler/request_executor.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py"
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
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
  - "vendor/zguard-ai-integrations/README.md"
  - "vendor/zguard-ai-integrations/CHANGELOG.md"
  - "vendor/zguard-ai-integrations/docs/ARCHITECTURE.md"
  - "vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md"
  - "vendor/zguard-ai-integrations/AWS/README.md"
  - "vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md"
  - "vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py"
  - "vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/README.md"
  - "vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py"
  - "vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md"
  - "vendor/zguard-ai-integrations/AWS/strands-agents/README.md"
  - "vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py"
  - "vendor/zguard-ai-integrations/OpenAI/README.md"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/aiguard_utils.py"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py"
  - "vendor/zguard-ai-integrations/Google/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js"
  - "vendor/zguard-ai-integrations/Google/cloudrun/README.md"
  - "vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/bootstrap.py"
  - "vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py"
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
  - "vendor/zscaler-terraformer/"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-help/dlp-incidents-workflow-automation-api.md"
  - "vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md"
  - "vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md"
  - "vendor/zscaler-help/understanding-workflows-workflow-automation.md"
  - "vendor/zscaler-help/what-workflow-automation.md"
author-status: reviewed
---

# AI Guard public-source coverage manifest

Source: `vendor/zscaler-help/ai-guard-help-index.md`; `vendor/zscaler-help/ai-guard-users-help-index.md`; `vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md`; `vendor/zscaler-help/ai-guard-users-and-user-groups.md`; `vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md`; `vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md`; `vendor/zscaler-help/adding-ai-ml-applications-rule-cloud-app-control.md`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-sdk-python/pyproject.toml`; `vendor/zguard-ai-integrations/README.md`; `vendor/zguard-ai-integrations/CHANGELOG.md`; `vendor/zguard-ai-integrations/AWS/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md`; `vendor/zguard-ai-integrations/AWS/strands-agents/README.md`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md`; `vendor/zguard-ai-integrations/Google/README.md`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md`; `vendor/zguard-ai-integrations/Google/cloudrun/README.md`.

This manifest is the certification boundary for AI Guard coverage in this repo. The 2026-05-22 **Secure AI Apps & Infrastructure** tree was captured article by article, but the current public `/secure-ai-users` root publishes a different 25-article **AI Guard for Users** tree and separate current dashboard articles for **Users** and **Apps & Infrastructure** (`vendor/zscaler-help/ai-guard-users-help-index.md:1-48`; `vendor/zscaler-help/ai-guard-users-dashboard.md:8-16`; `vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md:8-16`). The current ZIA integration body is published at `/secure-ai-users/integrating-zia-ai-guard` with status 200, and its supported-application table is marked last updated September 2, 2026 (`vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md:3-9`, `:30-64`). The same September 3 Help JSON probe observed the former integration route as `301` and the former `/ai-guard` root as `403` / **Help Article in Maintenance**; these are route/discoverability observations only, not product-retirement, availability, or entitlement evidence (`vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md:94-101`). Both dashboard bodies, current bodies for **Configuring Custom Block Messages** and **Users and User Groups**, the current tree index, the current ZIA integration body, the AI/ML Cloud App Control body, and the 2026 release chronology are captured (`vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md:8-24`; `vendor/zscaler-help/ai-guard-users-and-user-groups.md:8-24`; `vendor/zscaler-help/adding-ai-ml-applications-rule-cloud-app-control.md:14-43`). The newly listed architecture, quick-start, prompt-allowlist, best-practice, topology, token-usage, audit, detection-summary, and troubleshooting bodies are not yet individually captured (`vendor/zscaler-help/ai-guard-users-help-index.md:8-48`). Public integration coverage now also includes the September 1, 2026 `zguard-ai-integrations` head: the new AWS, OpenAI Codex, and Google examples are captured as implementation sources, while their runtime behavior remains unverified in this repository (`vendor/zguard-ai-integrations/README.md:44-65`; `vendor/zguard-ai-integrations/CHANGELOG.md:3-18`).

The Python SDK portions of this manifest were reverified against v1.9.44 at gitlink `e7f5f7efb56b6e24667f183e5dff3da03e039cc9` on 2026-09-03. This refresh covers the legacy policy-detection dispatch/Bearer path and does not advance or rewrite the other source pins. Runtime dependency pins in separately versioned consumers such as the MCP server remain independent of this parent SDK pointer.

Acceptable shorthand: **the legacy May Help tree, both current dashboard bodies, the current custom-block-message and user/group-sync bodies, the Python SDK's 1.9.39-introduced configuration and legacy-runtime surfaces as retained in current v1.9.44, the retained last-known AI Guard Automate contract, and public integrations are captured; the current public route table does not publish AI Guard, and the rest of the current AI Guard for Users Help tree is indexed but only partially mined at article-body depth**. The 1.9.39 introduction is recorded in the changelog (`vendor/zscaler-sdk-python/CHANGELOG.md:141-206`), the current package pin is v1.9.44 (`vendor/zscaler-sdk-python/pyproject.toml:1-4`), and its canonical accessor and separate legacy-runtime route remain at `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385` and `:671-712`. Publication absence does not establish endpoint retirement or backend unavailability (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160`).

Do not extend that sentence to private roadmap features, unpublished tenant entitlements, commercial packaging, field-level log schemas not present in Help, or client-wrapper coverage not present in public SDK/API sources.

## Source classes checked

Source: `.gitmodules`; `vendor/README.md`; `vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md`; `vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md`; `vendor/zscaler-help/adding-ai-ml-applications-rule-cloud-app-control.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zguard-ai-integrations/README.md`; `vendor/zscaler-sdk-go`; `vendor/terraform-provider-zia`; `vendor/terraform-provider-zpa`; `vendor/terraform-provider-ztc`; `vendor/zscaler-mcp-server`; `vendor/zscaler-terraform-skills`; `vendor/zscaler-terraformer`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md`; `vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md`; `vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`; `vendor/zscaler-help/what-workflow-automation.md`.

This pass checked both captured Help indexes, the current ZIA integration body and AI/ML Cloud App Control body, the 2026 release chronology, the current Python SDK v1.9.44 tree (including the AI Guard surface introduced in 1.9.39), public `zguard-ai-integrations` examples at the September 1, 2026 head, the retained Automate snapshot and current publication state, and the vendored Go SDK, Terraform providers, Terraform skills, Terraformer, MCP server, Postman API specs, and local Automation Hub captures available in this repository. The Python SDK exposes six OneAPI configuration resources plus a separately routed legacy policy-detection interface (`vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-380`, `:671-712`). Its six configuration resources contain 39 callable methods, compared with 47 operations across 29 paths in the retained last-known Automate snapshot (`vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412`; retention status at `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160`). The integration repository and parent now agree on the v1.9.44 minimum required for AI Guard policy-detection Bearer dispatch (`vendor/zguard-ai-integrations/CHANGELOG.md:7-9`; `vendor/zscaler-sdk-python/pyproject.toml:1-4`).

No Go SDK service, Terraform-provider resource, Terraformer generator, Postman endpoint, or Automation Hub procedure for that admin plane was found in the captured source classes. At the historical MCP v0.15.0 evidence pin recorded in front matter, the registry derives the available toolset IDs from registered specs (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/registry.py:61-67`), and the complete generated toolset catalog contains no AI Guard toolset (`vendor/zscaler-mcp-server/docs/guides/toolsets.md:33-153`). MCP can govern AI applications through adjacent ZIA Cloud App Control rules—including the `AI_ML` category and apps such as ChatGPT—but that is ZIA traffic-policy enforcement, not an AI Guard service or AI Guard API wrapper (`vendor/zscaler-mcp-server/skills/zia/create-cloud-app-control-rule/SKILL.md:3-22`, `:85`). Treat the remaining client gaps as coverage boundaries, not as proof about entitlements, private surfaces, or future support; see [`./api-divergences.md`](./api-divergences.md#automate-admin-plane-contract-vs-client-surfaces). The separate AI Security asset/findings API is covered in [`./asset-management-api.md`](./asset-management-api.md).

## Help article coverage

Source: `vendor/zscaler-help/ai-guard-help-index.md`; `vendor/zscaler-help/ai-guard-users-help-index.md`; `vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md`; `vendor/zscaler-help/ai-guard-users-and-user-groups.md`; `vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`; `vendor/zscaler-help/adding-ai-ml-applications-rule-cloud-app-control.md`; `vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md`.

The current tree contains 25 articles: six Getting Started, eight Configuration, two Best Practices, seven Monitoring, and two Troubleshooting entries (`vendor/zscaler-help/ai-guard-users-help-index.md:8-48`). Newly indexed topics include architecture, multilingual support, Microsoft 365 Copilot and ChatGPT quick starts, prompt allowlisting, custom block messages, detector best-practice runbooks, user/group synchronization, user-group/provider topology, token usage, audit logs, detection summaries, and latency. The current ZIA integration body now lists the `/secure-ai-users/integrating-zia-ai-guard` route, a September 2 supported-application-table date, Gemini Workspaces, the one-tenant/one-domain mapping prerequisite, Experience Center, and explicit `X-Authenticated-User` proxy settings (`vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md:18-32`, `:65-92`). The release capture independently records shipped additions through August 26, including CrowdStrike Direct Export/parser, Tools-field filtering, tenant restriction, M365 Copilot streaming inspection, encrypted prompt allowlisting, custom RBAC, ADX and Splunk export, Codex and GitHub Copilot handling, default-provider auto-provisioning, and newer provider/detector support (`vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:15-77`, `:100-145`).

Two newly captured current article bodies add these operating details:

| Current article | Captured behavior | Coverage boundary |
|---|---|---|
| Configuring Custom Block Messages | Administrator-defined prompt and response block messages, plus optional conversation deletion on a blocked response (`vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md:8-20`) | The configured message is sent to the LLM; the article warns that an LLM can interpret the instruction as malicious, refuse it, or return an unexpected response (`vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md:22-24`) |
| Users and User Groups | A linked ZIA tenant supplies users, groups, and domains; administrators can enable sync or trigger `Start Sync`, and imported users/groups feed Policy Control (`vendor/zscaler-help/ai-guard-users-and-user-groups.md:8-24`) | The article documents the sync and policy-selection surfaces, not propagation timing, failure behavior, or tenant entitlement |

Current ZIA integration and adjacent AI/ML control coverage is:

| Current Help capture | Captured behavior | Coverage boundary |
|---|---|---|
| Integrating ZIA with AI Guard | Current proxy-chain route, prerequisites, `forward.zseclipse.net:9443`, X-Authenticated-User settings, QUIC block, wildcard FQDN forwarding, and Google Gemini Workspaces domain (`vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md:18-82`, `:87-101`) | The supported-domain table is date-sensitive; 301/403 results for former Help routes are route observations only and do not establish retirement, availability, or entitlement |
| Adding an AI/ML Applications Rule for Cloud App Control | App-specific granular actions and **Capture Prompts** with a 2 KB prompt limit, organization-defined log period, and authorized log-access visibility (`vendor/zscaler-help/adding-ai-ml-applications-rule-cloud-app-control.md:14-43`) | This is a ZIA Cloud App Control surface, not evidence of equivalent AI Guard retention, runtime policy, or visibility semantics |

The AI Guard tenant-settings capture separately documents a 90-day
Store Prompts/Responses setting for auditing (`vendor/zscaler-help/ai-guard-managing-tenant-settings.md:72-90`). The two retention statements belong to different product surfaces and are not merged into one retention contract.

The current log-export body is not captured locally at article-body depth. The
legacy 2026-05-22 capture documents ADX metadata/content Event Hubs, CrowdStrike
HEC plus S3 content, separate S3 metadata/content buckets, Splunk metadata HEC
plus optional content HEC, and allowed/detected versus blocked prompt filters
(`vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md:15-99`). The
September 3 release capture reports that both current log-export bodies return
200 but still describe the S3-dependent CrowdStrike path and omit Direct Export,
SIEM, and `zscaler-aiguard`, despite the August 26 release note; it preserves
the discrepancy without selecting an authority (`vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:79-96`).

Current dashboard coverage is split rather than represented by one combined
article:

| Current dashboard article | Captured behavior | Coverage boundary |
|---|---|---|
| Users | Users tab; user/LLM/detection/transaction counts; up-to-90-day filtering; transaction fields and detail sections (`vendor/zscaler-help/ai-guard-users-dashboard.md:11-28`) | The article does not document a Conversations view; availability for user transactions is not inferred (`vendor/zscaler-help/ai-guard-users-dashboard.md:30-32`) |
| Apps & Infrastructure | AI Applications tab; app/LLM/detection/transaction counts; individual transactions and connected multi-prompt conversations (`vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md:11-35`) | Conversation threads are documented only for DAS/API mode and not Proxy mode (`vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md:23-31`) |

The table below is the article-body coverage for the **May 22 legacy tree**, not a certification of the current tree.

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
| Dashboard & Diagnostics | About AI Guard Dashboard (legacy combined capture) | `vendor/zscaler-help/ai-guard-dashboard.md` | Superseded for current dashboard wording by the two current captures above |
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

Policy detection remains a separate two-method `LegacyAIGuardClient(...).aiguard.policy_detection` route for `execute_policy` and `resolve_and_execute_policy` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:671-712`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:35-49`, `:57-63`, `:138-143`). In v1.9.44, those requests are dispatched through the AI Guard legacy helper, which applies the API key as a Bearer token (`vendor/zscaler-sdk-python/zscaler/oneapi_http_client.py:319-337`; `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:333-386`; fix recorded in `vendor/zscaler-sdk-python/CHANGELOG.md:3-11`). This is Python-client routing and static auth evidence, not a universal claim about backend authentication or endpoint availability. The separate throttling attribute-name mismatch remains open; see [`./api-divergences.md#legacy-runtime-dispatch-and-throttling-boundaries`](./api-divergences.md#legacy-runtime-dispatch-and-throttling-boundaries).

The retained 47-operation Automate contract therefore exceeds the callable Python configuration surface by eight operations: policy enable, disable, referential check, and summaries, plus referential checks for providers, provider credentials, applications, and application credentials (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:1954-1966`, `:3956-3968`, `:5229-5241`, `:6142-6154`, `:7166-7178`). The four resource referential-check methods are commented out with an SDK-maintainer note that they returned HTTP 404, so their status is an open live-acceptance discrepancy rather than a backend conclusion (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`). The changelog's “full OneAPI support” claim and referential-check inventory, plus the README's availability list, conflict with that callable code state (`vendor/zscaler-sdk-python/CHANGELOG.md:141-192`; `vendor/zscaler-sdk-python/README.md:1445-1452`). The current Automate publication absence does not resolve the live-acceptance discrepancy in either direction.

## Integration coverage

Source: `vendor/zguard-ai-integrations/README.md`; `vendor/zguard-ai-integrations/CHANGELOG.md`; `vendor/zguard-ai-integrations/docs/ARCHITECTURE.md`; `vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md`; `vendor/zguard-ai-integrations/github-actions/README.md`; `vendor/zguard-ai-integrations/Windsurf/README.md`; `vendor/zguard-ai-integrations/n8n/README.md`; `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read_README.md`; `vendor/zguard-ai-integrations/AWS/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md`; `vendor/zguard-ai-integrations/AWS/strands-agents/README.md`; `vendor/zguard-ai-integrations/OpenAI/README.md`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py`; `vendor/zguard-ai-integrations/Google/README.md`; `vendor/zguard-ai-integrations/Google/apigee/README.md`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js`; `vendor/zguard-ai-integrations/Google/cloudrun/README.md`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/bootstrap.py`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py`.

The public `zguard-ai-integrations` repository is captured as a submodule and summarized in [`./ai-guard.md`](./ai-guard.md). The September 1, 2026 head adds AWS Bedrock AgentCore, boto3 hooks, Lambda, Strands, OpenAI Codex CLI, Google Apigee X, and Google Cloud Run to the earlier IDE/agent, gateway, CI/CD, and orchestration examples (`vendor/zguard-ai-integrations/README.md:44-65`; `vendor/zguard-ai-integrations/CHANGELOG.md:3-18`). These are public implementation patterns, not evidence of admin-plane programmability, tenant entitlement, or live runtime acceptance.

| Integration | Static coverage boundary | Timing or deployment fact | Source |
|---|---|---|---|
| AWS Bedrock AgentCore | Explicit four-leg guard: prompt, response, tool input, and tool output as `tool_event`s. | Tool input is before execution; tool output is before model re-entry; async/generator output is materialized before scanning. | `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md:1-18`, `:50-82`, `:108-118` |
| AWS Bedrock boto3 | Client-native prompt/response interception for Bedrock calls. | Complete streaming responses are skipped at `after_call`; a static mixed opaque-content gap is recorded in [`./api-divergences.md`](./api-divergences.md#opaque-content-and-mixed-response-gap). | `vendor/zguard-ai-integrations/AWS/README.md:13-18`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:671-731` |
| AWS Lambda | Handler boundary only; model/tool calls inside the handler are not visible. | HTTP proxy events return 403; direct and asynchronous event sources raise to preserve retry/DLQ semantics. | `vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md:49-87` |
| AWS Strands | Framework prompt, response, tool-input, and tool-output hooks. | Response blocks request retries and ultimately raise; tool output can be replaced only after the tool runs; structured output is outside coverage. | `vendor/zguard-ai-integrations/AWS/strands-agents/README.md:1-18`, `:181-198`; `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py:655-743` |
| OpenAI Codex CLI | Six hooks cover prompt, Bash/MCP pre-tool, Bash/MCP post-tool, and `Stop`; apply_patch, other tools, and streaming interception are absent. | Post-tool hooks run after side effects; `Stop` is post-stream and fails open on scan errors. | `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:9-24`, `:48-70`, `:186-191`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py:47-81` |
| Google Apigee / Cloud Run | Inline proxy is synchronous Gemini-only; SharedFlow covers Gemini, OpenAI, Anthropic, MCP, and SSE. | Inline/proxy blocks are HTTP 403; SharedFlow/flow blocks preserve caller-shaped HTTP 200 responses. Cloud Run bootstrap and Apigee-org provisioning are separate stages. | `vendor/zguard-ai-integrations/Google/apigee/README.md:1-29`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md:13-22`; `vendor/zguard-ai-integrations/Google/cloudrun/README.md:17-27`, `:51-73` |

The root README's fail-closed table must be read with its documented exceptions: Windsurf/Cline post-hooks and Codex `Stop` are audit-only, and unknown gateway traffic passes unless `failClosedOnUnknown` is enabled (`vendor/zguard-ai-integrations/README.md:256-293`). The source repository's changelog also says Claude Code fail-open paths were fixed in this release (`vendor/zguard-ai-integrations/CHANGELOG.md:35-46`); older Claude file-read fail-open prose in this repository is stale. No runtime integration tests were run as part of this coverage update.

The following source divergences remain open and are intentionally not certified as product behavior: the Strands README's duplicate bare `policy_id=` example is invalid Python (`vendor/zguard-ai-integrations/AWS/strands-agents/README.md:132-149`); the agentic guide reverses prompt direction and omits a final response scan in its illustrative code (`vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md:157-171`, `:205-262`, `:305-310`; the contrasting direction table is `vendor/zguard-ai-integrations/docs/ARCHITECTURE.md:318-338`); Bedrock response extraction drops opaque-content status when text is also present (`vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:358-389`, `:671-731`); and the Apigee MCP extractor copies only text result members (`vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js:68-101`). See [`./api-divergences.md`](./api-divergences.md) for the source-boundary register.

## Open verification gaps

Source: `vendor/zscaler-help/ai-guard-about-ai-guard-insights.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py`.

- Commercial packaging, SKU boundaries, and entitlement behavior are not captured.
- Inline/proxy latency budgets are not published in captured Help.
- Log-export destinations and selected metadata/content routing fields are captured in the legacy body, but the current Users and Apps & Infrastructure body HTML and field-level export schemas are not captured locally. The release note's CrowdStrike Direct Export/parser claim remains unresolved against those current-body observations (`vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md:15-99`; `vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:79-96`).
- Custom detector authoring beyond the documented detector configuration fields is not confirmed.
- AI Red Teaming and AI Guard workflow interlock is not confirmed.
- Python does not yet wrap eight Automate-documented operations; four referential-check methods are commented out after an SDK-maintainer 404 observation and require live acceptance testing (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`).
- The new integration release requires `zscaler-sdk-python>=1.9.44`, and this repository now pins v1.9.44; the declared minimum is satisfied, but the examples have not been live-tested here (`vendor/zguard-ai-integrations/CHANGELOG.md:7-9`; `vendor/zscaler-sdk-python/pyproject.toml:1-4`).
- The new public integration source contains unresolved static issues: an invalid Strands README constructor block, an agentic-guide prompt-direction/final-output contradiction, a Bedrock mixed opaque-content extraction gap, and an Apigee MCP non-text-result omission (`vendor/zguard-ai-integrations/AWS/strands-agents/README.md:132-149`; `vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md:157-171`, `:205-262`, `:305-310`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:358-389`, `:671-731`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js:68-101`). These require source correction or runtime validation and are not certified behavior.
- Go SDK, Terraform-provider, Terraformer, MCP, Postman, and Automation Hub wrappers for the AI Guard admin-plane contract are not present in the inspected captured sources; do not infer entitlement or backend availability from that coverage gap.
- Current AI Guard for Users article bodies beyond the two dashboards, custom block messages, user/group synchronization, the current ZIA integration body, and overlapping legacy captures have not yet been mined individually. The current log-export body is represented only by the release capture's metadata/discrepancy record, not a local body extraction.
- Help calls GitHub Copilot, ElevenLabs, Windsurf, Mistral Vibe, Gamma, and Builder.io supported providers/applications, while the Automate provider-type enum uses a narrower/different identifier set; the relationship between Help provider labels and admin-plane provider types is unresolved.

These gaps mean current Help coverage is **indexed but incomplete at article-body depth**. They also mark boundaries where public Help/SDK sources do not expose enough detail to certify behavior beyond the documented surface.

## Cross-links

- AI Guard reference: [`./ai-guard.md`](./ai-guard.md)
- API and integration divergences: [`./api-divergences.md`](./api-divergences.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
- AI Security overview: [`./overview.md`](./overview.md)
- AI Security index: [`./index.md`](./index.md)
- Portfolio classification: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
