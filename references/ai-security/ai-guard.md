---
product: ai-guard
topic: overview
title: "AI Guard — runtime protection and policy enforcement for AI/LLM applications"
content-type: reference
last-verified: "2026-07-20"
confidence: medium
source-tier: mixed
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: e7f5f7efb56b6e24667f183e5dff3da03e039cc9
  vendor/zguard-ai-integrations: 71cbab024f369eb50748c9c4a74ec0158c084839
sources:
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-help-index.md"
  - "vendor/zscaler-help/ai-guard-users-help-index.md"
  - "vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md"
  - "vendor/zscaler-help/ai-guard-users-and-user-groups.md"
  - "vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md"
  - "vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-api-user-guide.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-users.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-help/ai-guard-dashboard.md"
  - "vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md"
  - "vendor/zscaler-help/ai-guard-users-dashboard.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-insights.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-usage.md"
  - "vendor/zscaler-help/ai-guard-managing-tenant-settings.md"
  - "vendor/zscaler-help/ai-guard-managing-llm-providers-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-managing-llm-provider-credentials-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-add-and-manage-ai-applications-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-add-and-manage-ai-guard-policies.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-policy-control.md"
  - "vendor/zscaler-help/ai-guard-ai-guard-policy-testing.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md"
  - "vendor/zscaler-sdk-python/pyproject.toml"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policies.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/models/policies.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_match_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_provider_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_applications.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_application_credentials.py"
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
  - "vendor/zguard-ai-integrations/AWS/lambda-decorator/aiguard_decorator.py"
  - "vendor/zguard-ai-integrations/AWS/strands-agents/README.md"
  - "vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py"
  - "vendor/zguard-ai-integrations/OpenAI/README.md"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/aiguard_utils.py"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py"
  - "vendor/zguard-ai-integrations/Google/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/ARCHITECTURE.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/ARCHITECTURE.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js"
  - "vendor/zguard-ai-integrations/Google/cloudrun/README.md"
  - "vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/bootstrap.py"
  - "vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py"
  - "vendor/zguard-ai-integrations/github-actions/README.md"
  - "vendor/zguard-ai-integrations/github-actions/config/test-prompts.yaml"
  - "vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py"
  - "vendor/zguard-ai-integrations/github-actions/.github/workflows/model-security-scan.yml"
  - "vendor/zguard-ai-integrations/Microsoft/README.md"
  - "vendor/zguard-ai-integrations/Windsurf/README.md"
  - "vendor/zguard-ai-integrations/n8n/README.md"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read_README.md"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py"
author-status: draft
---

# AI Guard — runtime protection and policy enforcement for AI/LLM applications

## Certification scope

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-users-help-index.md`; `vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md`; `vendor/zscaler-help/ai-guard-users-and-user-groups.md`; `vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md`; `vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-sdk-python/pyproject.toml`; `vendor/zguard-ai-integrations/README.md`; `vendor/zguard-ai-integrations/CHANGELOG.md`; `vendor/zguard-ai-integrations/AWS/README.md`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md`; `vendor/zguard-ai-integrations/Google/README.md`.

The 2026-05-22 AI Guard Help tree is captured and mapped at article-body depth, along with the Python SDK's 1.9.39-introduced OneAPI configuration and separately routed legacy policy-detection surfaces as retained in current v1.9.44 (`vendor/zscaler-sdk-python/CHANGELOG.md:141-206`; `vendor/zscaler-sdk-python/pyproject.toml:1-4`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385`, `:671-712`) and public `zscaler/zguard-ai-integrations` examples. The current public `/secure-ai-users` root contains 25 AI Guard for Users articles—six Getting Started, eight Configuration, two Best Practices, seven Monitoring, and two Troubleshooting (`vendor/zscaler-help/ai-guard-users-help-index.md:1-48`). The portal separates dashboard documentation into **AI Guard for Users** and **Apps & Infrastructure** surfaces (`vendor/zscaler-help/ai-guard-users-dashboard.md:8-16`; `vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md:8-16`); both dashboard bodies are captured, as are current custom-block-message and user/group-sync bodies (`vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md:8-24`; `vendor/zscaler-help/ai-guard-users-and-user-groups.md:8-24`). The rest of the current tree remains only partially mined. Treat current Help coverage as indexed and partial rather than fully certified.

This certification does not assert private roadmap features, tenant-specific entitlements, commercial packaging, unpublished admin APIs, or portal behavior not present in the captured public sources. Those remain explicit open questions rather than hidden assumptions.

## What it is

AI Guard is a Zscaler service that provides runtime protection for AI applications built on large language models (LLMs). It enforces enterprise policies on both the prompts users send to LLMs and the responses LLMs return — detecting and blocking prompt injections, jailbreak attempts, sensitive data leakage, toxicity, and other AI-specific threat categories (Tier A — vendor/zscaler-help/ai-guard-what-is.md).

It is distinct from ZIA (which handles general internet security) and ZPA (which handles private app access). AI Guard specifically addresses the **AI application layer** — the interaction between users, enterprise AI applications, and LLM providers (OpenAI, Anthropic, Azure OpenAI, Google Gemini, AWS Bedrock, etc.).

## Deployment modes

AI Guard offers three deployment options:

| Mode | How it works | Use case |
|---|---|---|
| **Proxy (inline)** | The application sends model requests to AI Guard's proxy endpoint; AI Guard inspects traffic and proxies it to the configured upstream LLM provider. | Default for enterprise deployments where the app can route LLM traffic through AI Guard |
| **DaaS (Detection as a Service)** | AI Guard is not inline. Application code calls AI Guard before sending the prompt to the model and again before returning the model response. | When inline placement is not possible or the application should keep direct LLM-provider routing |
| **OnPrem hybrid** | On-premises deployment of AI Guard components | Organizations requiring data residency or on-premises processing |

**Key DaaS distinction**: In DaaS mode, AI Guard does not require manually adding the LLM provider to the configuration. The application controls which LLM it calls; AI Guard inspects the content only. In Proxy mode, AI Guard is aware of and configured with the LLM provider.

## Configuration workflow

The Help configuration guide lays out the operational sequence:

1. Provision end users by linking ZIA with AI Guard.
2. Configure LLM providers and provider credentials when using Proxy mode.
3. Add AI applications to AI Guard.
4. Configure policies by enabling detectors on prompts and responses.
5. Optionally configure incident log exports.
6. Optionally configure tenant-wide settings.

System users are managed in ZIdentity and can be viewed from AI Guard's System User Management page.

## Detector categories

AI Guard enforces "intent-based detectors" using AI models and GPUs for inference. Categories:

| Detector | What it blocks/detects |
|---|---|
| **Prompt Injection** | Adversarial prompts designed to manipulate LLM behavior or bypass restrictions |
| **Jailbreak Protection** | Attempts to get LLM to ignore safety guidelines |
| **Toxicity** | Harmful or inappropriate language in prompts or responses |
| **Sensitive Data Protection** | PII, credentials, secrets in prompts before they reach LLM APIs |
| **Off-Topic Response Detection** | LLM responses outside the app's intended scope |
| **Malicious URL Detection** | Links in prompts/responses that point to malicious destinations |
| **Language Detection & Enforcement** | Enforce approved languages; block unauthorized language use |
| **Code Injection & Execution Detection** | Unauthorized code snippets embedded in AI interactions |
| **Gibberish / Low-Quality Filtering** | Meaningless text, irrelevant output |
| **Refusal Detection & Intervention** | When LLM refuses valid queries — may indicate DoS-style attack on the AI app |
| **Finance Advice Detection** | Block actionable financial guidance; allow neutral financial facts |
| **Prompt Tagging / Access Control** | Classify prompts into categories for governance and compliance |
| **Competitor Discussion Detection** | Block prompts referencing competitors, rival products, pricing comparisons |
| **URL Reachability Detection** | Verify whether URLs in prompts are accessible, safe, or broken |
| **Legal Advice Detection** | Block prompts seeking legal advice; allow neutral legal information |

## LLM provider integrations

AI Guard supports the following LLM providers (API request construction guides documented):
- Anthropic (Claude)
- Azure Foundry / OpenAI-compatible chat completions
- AWS Bedrock (Anthropic models)
- AWS Bedrock Unified
- AWS Bedrock Agent
- Google Gemini
- OpenAI (GPT)
- Google Vertex AI

## ZIA integration

AI Guard can be invoked from ZIA by proxy chaining supported AI-app traffic to AI Guard. The integration guide requires:

- AI Guard subscription and linked ZIA / AI Guard tenants.
- AI Guard endpoint CA certificate uploaded to ZIA as a proxy-chaining root certificate.
- ZIA proxy pointing at `forward.zseclipse.net` on port `9443` as of the captured guide.
- Proxy gateway configured fail-closed.
- A firewall rule to block/drop QUIC so traffic does not bypass the proxy path.
- Wildcard FQDN destination groups and Forwarding Control rules for the supported AI-provider domains.

Treat the supported-app/domain list as date-sensitive. The captured guide states the listed supported generative AI applications were last updated on April 14, 2026.

## Policy management

Source: `vendor/zscaler-help/ai-guard-add-and-manage-ai-applications-ai-guard.md`; `vendor/zscaler-help/ai-guard-add-and-manage-ai-guard-policies.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-policy-control.md`; `vendor/zscaler-help/ai-guard-ai-guard-policy-testing.md`.

AI Guard policy setup has three distinct objects:

| Object | Purpose | Operational notes |
|---|---|---|
| **AI Applications** | Register the AI apps or chatbots AI Guard will manage. | DaaS-mode apps use an AI Guard API key. Proxy-mode apps use an identity broker. Applications can be grouped into AI Application Groups. |
| **Policy Configurations** | Define detector behavior for prompts and responses. | Most prompt detectors expose `Enabled`, `Severity`, `Threshold`, and `Action`. Actions include Allow, Block, and Detect; some detectors also expose Disabled. |
| **Policy Control** | Bind a policy configuration to matching users or applications. | Rule order and status are explicit. At least one match criterion is required. |

Policy configurations support detector-specific fields. Examples from the captured Help page include programming languages for Code, regex patterns for Text, competitor names for Competition, allowed languages for Language, secret types for Secrets, PII types, custom topics, prompt-tag categories, and sensitive context for Intellectual Property. Competition and Topic entries are limited to 10 at a time for a single policy.

Policy Control has two shapes:

- **User policy control** matches policy configurations against LLM provider/model plus users and/or user groups.
- **AI application policy control** matches against LLM/model, application and credentials, application groups, custom request headers, and source IPs.

Policy Testing lets an admin select a provider credential, policy, LLM model, and test prompt before production enforcement. Treat this as pre-enforcement validation, not as proof of production traffic behavior.

## Tenant and provider configuration

Source: `vendor/zscaler-help/ai-guard-managing-tenant-settings.md`; `vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md`; `vendor/zscaler-help/ai-guard-users-and-user-groups.md`; `vendor/zscaler-help/ai-guard-managing-llm-providers-ai-guard.md`; `vendor/zscaler-help/ai-guard-managing-llm-provider-credentials-ai-guard.md`; `vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md`.

Tenant settings expose the tenant name, deployment mode (`Proxy` or `DaaS`), UUID, and Zscaler AWS Account ID. The AWS account ID is used for optional AWS integrations such as S3 log exports and customer-managed keys.

Operational tenant controls include:

- Network access control using IPv4 CIDR ranges.
- Custom request headers, including a conversation ID header and sensitive-header marking.
- Security settings to store prompts/responses for 90 days, enable event-detection feedback, encrypt sensitive custom headers, and use customer-managed content encryption.
- Customer-managed-key configuration; the captured page lists AWS as the currently supported KMS provider type.
- User- or group-scoped policy evaluation requires a linked ZIA tenant. AI Guard can import ZIA users, groups, and domains, and `Advanced Actions > Start Sync` triggers an immediate synchronization outside the scheduled batch window (`vendor/zscaler-help/ai-guard-users-and-user-groups.md:8-20`). Imported users and user groups appear on separate **AI Users** tabs, while Policy Control is the documented surface for applying policies to them (`vendor/zscaler-help/ai-guard-users-and-user-groups.md:22-24`).
- Custom prompt and response block messages can replace blocked content, and response blocking can optionally delete the conversation history (`vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md:8-20`). AI Guard sends the configured message to the LLM with an instruction to return it; the Help article warns that an LLM can treat the instruction as malicious, refuse it, or return an unexpected response (`vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md:22-24`).

Proxy mode also requires LLM Provider and LLM Provider Credential objects. Provider fields include provider name, provider type, public/private deployment, and provider-specific server selection. Credential fields include credential name, associated LLM provider, optional expiration date, and API key copied from the provider dashboard.

AI Guard RBAC supports custom roles for system users managed through ZIdentity or local hosted system users in AI Guard. The captured Help page says AI Guard previously supported Administrator, Editor, and Viewer roles; the newer RBAC model lets admins create roles from templates or custom permission/scope selections. Templates are Viewer (read-only access), Editor (read/create/update without delete), and Administrator (full access). Roles are assigned from System User Management.

## Observability

Source: `vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md`; `vendor/zscaler-help/ai-guard-users-dashboard.md`; `vendor/zscaler-help/ai-guard-about-ai-guard-insights.md`; `vendor/zscaler-help/ai-guard-about-ai-guard-usage.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`.

| Surface | Description |
|---|---|
| Dashboard — Users | The **Users** tab reports user, LLM, policy-detection, and transaction counts. Rows expose date/time, user, policy name, severity, prompt/response detections, LLM, and prompt/response actions; the article documents date ranges of up to 90 days (`vendor/zscaler-help/ai-guard-users-dashboard.md:11-28`). |
| Dashboard — Apps & Infrastructure | The **AI Applications** tab reports application, LLM, policy-detection, and transaction counts. It can show individual transactions or connected multi-prompt conversation threads; conversation-thread viewing is documented as exclusive to DAS/API mode and absent from Proxy mode (`vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md:11-35`). |
| Insights | Executive overview of prompts, responses, active apps/LLMs, blocked counts, token counts, detection latency, trends over time, security posture, transactions by LLM/application, top detectors, and PII detections/categories. |
| Usage | Usage view by AI application or user, including prompt/response content size, prompt tokens, and response tokens. |
| Log Exports | Third-party export configuration for incident/event data. Captured destinations include ADX Event Hub, CrowdStrike HEC plus S3 content storage, AWS S3 metadata/content buckets, and Splunk HEC metadata/content endpoints. |
| System Users | View users in AI Guard's user registry |

Both current dashboard articles organize transaction details into Overview,
Detection Summary, Performance & Network Stats, Custom Request Headers, and
Prompt Details (`vendor/zscaler-help/ai-guard-users-dashboard.md:23-28`;
`vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md:32-35`). The
current Users article does not document the multi-prompt Conversations view;
that absence does not establish whether conversation threads are available or
unavailable for user transactions (`vendor/zscaler-help/ai-guard-users-dashboard.md:30-32`).

Log exports can be configured to export allowed/detected prompts and blocked prompts. Some destinations separate metadata and content streams or buckets, which matters for sensitive-content handling and SIEM ingestion design.

## API surface

Source: `vendor/zscaler-help/ai-guard-api-user-guide.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py`; `vendor/zguard-ai-integrations/Microsoft/README.md`; `vendor/zguard-ai-integrations/github-actions/README.md`; `vendor/zguard-ai-integrations/n8n/README.md`.

The September 1, 2026 integration release requires `zscaler-sdk-python>=1.9.44`; its changelog attributes the minimum to the Bearer token required by AI Guard policy-detection calls (`vendor/zguard-ai-integrations/CHANGELOG.md:3-9`). This repository now carries Python SDK v1.9.44 (`vendor/zscaler-sdk-python/pyproject.toml:1-4`), satisfying the declared minimum. That version alignment does not establish that every integration example has been exercised successfully.

AI Guard has an API surface:
- **Proxy-mode provider API pathing**: Applications send provider-shaped requests to `https://proxy.zseclipse.net` using provider-specific paths such as `/v1/messages`, `/v1/chat/completions`, Bedrock model paths, Gemini `generateContent`, and Vertex paths.
- **DaaS policy detection API**: The captured DAS Help page uses the global host `https://api.zseclipse.net` for both `POST /v1/detection/execute-policy` and `POST /v1/detection/resolve-and-execute-policy` (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:50`, `:100`, `:158`). Some SDK and integration examples still construct regional hosts such as `https://api.us1.zseclipse.net` or `https://api.{cloud}.zseclipse.net`; treat host selection as an open source divergence rather than proof that either spelling is universally accepted.
- **Python SDK routing**: `client.aiguard` is canonical and `client.zguard` is a deprecated alias. `ZscalerClient` routes the six configuration resources through OneAPI, while `LegacyAIGuardClient(...).aiguard.policy_detection` retains the two runtime methods (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385`, `:671-712`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`). Treat this as Python-client routing, not as a universal backend authentication or availability rule.
- **Legacy runtime detection**: `PolicyDetectionAPI` exposes `execute_policy(content, direction, policy_id=None, transaction_id=None)` and `resolve_and_execute_policy(content, direction, transaction_id=None)` (`vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:57-63`, `:138-143`). The legacy helper defaults to `AIGUARD_CLOUD=us1`, constructs `https://api.<cloud>.zseclipse.net`, and allows `AIGUARD_OVERRIDE_URL` for an explicit host (`vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:58`, `:75`, `:78-81`).
- **Admin/config APIs**: The last-known Automate snapshot contains 47 operations across 29 paths, while Python exposes 39 callable configuration methods; no Go SDK, Terraform, MCP, Postman, or Automation Hub wrapper is captured for that contract. The current public route table publishes no AI Guard operations, so the 47-operation snapshot is retained and the publication absence must not be presented as endpoint retirement or backend unavailability (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:19-23`; `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160`; Python inventories below; `references/ai-security/api-divergences.md#automate-admin-plane-contract-vs-client-surfaces`).
- **Provider-type discovery**: In the retained last-known contract, `GET /v1/llm-provider-types` and `GET /v1/llm-provider-types/{type}` return the supported admin-plane provider identifiers plus public/private server-key and allowed-value guidance (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7486-7703`, `:7720-7903`).

The callable OneAPI configuration inventory is:

| `client.aiguard` resource | Callable methods | Count | Source |
|---|---|---:|---|
| `policies` | list, get by ID/name, create, update, delete | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357` |
| `policy_match_rules` | list, get by ID/name, create, update, delete | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338` |
| `llm_providers` | list/get providers, list/get provider types, create, update, delete | 8 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457` |
| `llm_provider_credentials` | list, get by ID/name, create, update, delete | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362` |
| `llm_applications` | list, get by ID/name, create, update, delete | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363` |
| `llm_application_credentials` | list, get by ID/name, create, regenerate, update, delete | 7 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412` |

The eight Automate-documented operations outside that callable Python inventory are policy enable, disable, referential check, and summaries, plus referential checks for providers, provider credentials, applications, and application credentials (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:1954-1966`, `:3956-3968`, `:5229-5241`, `:6142-6154`, `:7166-7178`). Four resource referential methods are commented out after an SDK-maintainer observation of HTTP 404 responses; this is an open live-acceptance discrepancy, not proof that those documented backend operations are universally absent (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`).

The 2026 Help chronology adds an important second vocabulary layer: User-mode and application support includes labels such as GitHub Copilot, ElevenLabs, Windsurf, Mistral Vibe, Gamma, and Builder.io that are not all present in the admin-plane `type` enum (`vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:14-50`). Do not assume that Help application/provider labels map one-to-one to customer-creatable LLM provider types; see [clarification ai-security-07](../_meta/clarifications.md#ai-security-07-help-provider-labels-vs-automate-provider-types).

Current release-backed additions also include tenant restriction, Microsoft 365 Copilot streaming inspection, encrypted prompt allowlisting, custom RBAC, ADX/Splunk export, Codex request/response blocking, and default-provider auto-provisioning (`vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:9-45`). These are dated Help claims; tenant entitlement and rollout state still require tenant-side confirmation.

Direction values are documented in the SDK and most integration examples as `IN` and `OUT`. The DAS/API Help page examples use `request` and `response` strings instead; accepted alias behavior is unresolved by static sources, so SDK callers should use `IN`/`OUT` and track the divergence in [`./api-divergences.md`](./api-divergences.md#direction-value-divergence) and [clarification ai-security-01](../_meta/clarifications.md#ai-security-01-ai-guard-direction-literal-aliases). Conceptually, `IN` covers user prompts, tool input, command arguments, or file content before the AI application consumes it; `OUT` covers model responses, tool output, URL checks, or response content before it is returned downstream.

The SDK request/response model matters for resilient DaaS integrations:

| Area | Fields / behavior |
|---|---|
| Request | `content`, `direction`, optional `policyId`, optional `transactionId` |
| Top-level response | `transactionId`, `statusCode`, `errorMsg`, `detectorErrorCount`, `action`, `severity`, `direction`, `detectorResponses`, `throttlingDetails` |
| Per-detector response | `statusCode`, `errorMsg`, `triggered`, `action`, `latency`, `deviceType`, `details`, `severity`, optional `contentHash` |
| Throttling | `throttlingDetails` carries `rlcId`, `metric`, and `retryAfterMillis`; integrations must treat this as retry/backoff input rather than a generic failure. |

The OneAPI configuration models expose these principal Python-attribute/wire-key mappings:

| Model | Python attributes → wire keys | Source |
|---|---|---|
| Policy | `create_time_millis` → `createTimeMillis`; `input_detector_policies` / `output_detector_policies` → `inputDetectorPolicies` / `outputDetectorPolicies`; nested configuration includes `default_action`, `replace_with_masked_content`, and `entity_type` mappings. | `vendor/zscaler-sdk-python/zscaler/aiguard/models/policies.py:37-204` |
| Policy match rule | `policy_id`, `rule_order`, and `match_criteria` → `policyId`, `ruleOrder`, and `matchCriteria`; criteria map applications, source IPs, groups, and custom headers. | `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_match_rules.py:37-162` |
| Provider credential | `provider_id`, `expire_time_millis`, and `api_credentials` → `providerId`, `expireTimeMillis`, and `apiCredentials`. | `vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_provider_credentials.py:37-97` |
| Application | `owner_email`, timestamp fields, and `application_settings` → `ownerEmail`, timestamp wire keys, and `applicationSettings`; settings map include/encrypt event-content flags. | `vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_applications.py:37-105` |
| Application credential | Application/provider references and timestamps map to `applicationId`, `providerId`, `providerCredentialsId`, `createTimeMillis`, and `updateTimeMillis`. | `vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_application_credentials.py:37-68` |

When a policy ID is supplied, examples call `execute-policy`. When no policy ID is supplied, examples call `resolve-and-execute-policy`, relying on the API key's associated application and policy to resolve the effective policy. The Python SDK model also shows that the resolved-policy response can include `policyId`, `policyName`, and `policyVersion`, while the explicit execution response model does not expose those fields as top-level attributes.

The public Python SDK now exposes the six configuration resources above as well as separately routed runtime policy detection. It does not provide full parity with the retained last-known Automate snapshot: the eight documented actions listed above remain outside the callable Python inventory. Current public-route absence is a separate publication state, not evidence that those backend operations were retired.

For implementation caveats, see [`./api-divergences.md`](./api-divergences.md): it records the SDK-vs-Help direction literal mismatch, `policyId` ambiguity for `execute-policy`, detector-taxonomy differences, integration failure posture, Python-to-Automate operation gaps, documentation drift, and static legacy-routing regression cautions.

## Integration examples

Source: `vendor/zguard-ai-integrations/README.md`; `vendor/zguard-ai-integrations/CHANGELOG.md`; `vendor/zguard-ai-integrations/docs/ARCHITECTURE.md`; `vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md`; `vendor/zguard-ai-integrations/github-actions/README.md`; `vendor/zguard-ai-integrations/github-actions/config/test-prompts.yaml`; `vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py`; `vendor/zguard-ai-integrations/github-actions/.github/workflows/model-security-scan.yml`; `vendor/zguard-ai-integrations/Windsurf/README.md`; `vendor/zguard-ai-integrations/n8n/README.md`; `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read_README.md`; `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py`; `vendor/zguard-ai-integrations/AWS/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/aiguard_decorator.py`; `vendor/zguard-ai-integrations/AWS/strands-agents/README.md`; `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py`; `vendor/zguard-ai-integrations/OpenAI/README.md`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/aiguard_utils.py`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py`; `vendor/zguard-ai-integrations/Google/README.md`; `vendor/zguard-ai-integrations/Google/apigee/README.md`; `vendor/zguard-ai-integrations/Google/apigee/ARCHITECTURE.md`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/ARCHITECTURE.md`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js`; `vendor/zguard-ai-integrations/Google/cloudrun/README.md`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/bootstrap.py`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py`.

Zscaler publishes `zguard-ai-integrations` as an example repository for AI Guard DAS integrations. The September 1, 2026 head adds OpenAI Codex CLI, AWS Bedrock AgentCore/boto3/Lambda/Strands, Google Apigee X, and Google Cloud Run alongside the earlier IDE, gateway, CI/CD, and orchestration examples (`vendor/zguard-ai-integrations/README.md:44-65`; `vendor/zguard-ai-integrations/CHANGELOG.md:3-18`). The repository describes DAS as application-by-application wiring without a proxy infrastructure requirement (`vendor/zguard-ai-integrations/README.md:17-42`). Treat all of these as public implementation examples, not as proof that the AI Guard admin plane is programmable or that a host's documented example has been live-tested here.

The same release requires `zscaler-sdk-python>=1.9.44` because earlier releases did not attach the Bearer token to policy-detection calls (`vendor/zguard-ai-integrations/CHANGELOG.md:7-9`). This repository now pins Python SDK v1.9.44 (`vendor/zscaler-sdk-python/pyproject.toml:1-4`), satisfying the declared minimum; the examples remain static source coverage rather than live compatibility certification.

### Enforcement posture and interception timing

The vendor README presents a default fail-closed table: `ALLOW` permits, `DETECT` is monitor-only, `BLOCK` blocks, and missing keys, API errors, HTTP 401/403, HTTP 200 without an `action`, and unknown verdicts block (`vendor/zguard-ai-integrations/README.md:256-284`). That is not an unqualified all-integration contract. The same README records that Windsurf/Cline post-hooks and the Codex `Stop` hook are audit-only, and that unclassifiable gateway traffic passes unless `failClosedOnUnknown` is enabled (`vendor/zguard-ai-integrations/README.md:286-293`). Codex `Stop` scan errors explicitly fail open because the response has already streamed and been displayed (`vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:186-191`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py:47-66`).

The useful deployment distinction is the physical interception seat, not the integration name:

| Integration family | Interception boundary | Enforcement and timing |
|---|---|---|
| AWS Bedrock AgentCore | The caller explicitly places prompt, response, tool-input, and tool-output calls in its agent loop; tool values are sent as first-class `tool_event`s (`vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md:1-18`, `:50-82`). | Tool input is scanned before the tool runs; tool output is scanned before it re-enters the model. Async tools are awaited and generators are drained before output scanning, while streamed response granularity remains the caller's responsibility (`vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md:10-18`, `:108-118`). |
| AWS Bedrock boto3 hook | A client-native `before-call`/`after-call` interceptor sees Bedrock model calls without changing application call sites (`vendor/zguard-ai-integrations/AWS/README.md:13-18`). | Streaming operations are skipped at `after_call` because no complete response exists there (`vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:671-693`). A static extractor gap currently discards opaque-content status and only treats a response as unscannable when no text is extracted (`vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:358-389`, `:712-731`); see [`./api-divergences.md`](./api-divergences.md#opaque-content-and-mixed-response-gap) before treating mixed content as fail-closed. |
| AWS Lambda decorator | A handler boundary sees one extracted prompt before invocation and one extracted response after the handler; model/tool calls inside the handler are invisible (`vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md:49-82`). | HTTP proxy events receive HTTP 403 on a block; direct invoke and asynchronous event sources raise `AIGuardBlocked` so Lambda retry/DLQ/failure-destination semantics are preserved (`vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md:80-87`). |
| AWS Strands HookProvider | The framework lifecycle exposes prompt, response, tool-input, and tool-output events (`vendor/zguard-ai-integrations/AWS/strands-agents/README.md:1-18`). | A blocked response can only request a retry; after the retry limit the hook raises. Tool input is canceled before execution, while tool output can be replaced only after the tool has already run (`vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py:655-743`). Streams may emit before the final verdict, and `Agent.structured_output()` is outside this hook coverage (`vendor/zguard-ai-integrations/AWS/strands-agents/README.md:181-198`). |
| OpenAI Codex CLI | Six hooks cover user prompts, Bash/MCP pre-tool input, Bash/MCP post-tool output, and `Stop`; `apply_patch`, non-Bash/non-MCP tools, and streaming interception are not covered (`vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:9-24`, `:48-70`). | Prompt/pre-tool hooks can block before execution; post-tool hooks run after side effects; `Stop` runs after the response is streamed. `Stop` blocks on a `BLOCK` verdict but fails open on scan errors and skips short content (`vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:169-191`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py:47-81`). |
| Google Apigee inline proxy | A single synchronous Gemini/Vertex proxy scans prompt `IN` before Vertex and response `OUT` before the caller; tools and streaming belong to the SharedFlow pattern (`vendor/zguard-ai-integrations/Google/apigee/README.md:1-29`). | Inline blocks use HTTP 403. The reusable SharedFlow supports Gemini, OpenAI, Anthropic, MCP, and SSE caller-shaped responses, with `failClosedOnUnknown` controlling otherwise-unclassifiable traffic (`vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md:13-22`, `:99-157`). |
| Google Cloud Run pipelines | Cloud Build → Cloud Run Jobs provision either the Apigee SharedFlow or inline proxy, then deploy the copied bundles (`vendor/zguard-ai-integrations/Google/cloudrun/README.md:1-28`, `:37-49`). | The flow pipeline returns caller-native HTTP 200 refusals; the proxy pipeline returns JSON HTTP 403 (`vendor/zguard-ai-integrations/Google/cloudrun/README.md:17-27`). The separate `provision_org.py` helper creates the Apigee organization/runtime/environment/group/attachments and waits for the runtime; bootstrap itself prepares project APIs and service accounts (`vendor/zguard-ai-integrations/Google/cloudrun/README.md:51-73`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/bootstrap.py:1-21`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py:1-27`, `:98-210`). |

### Source divergences and unverified boundaries

These are static-source findings, not runtime results:

- The Strands setup block is invalid Python because it contains two bare `policy_id=` assignments (`vendor/zguard-ai-integrations/AWS/strands-agents/README.md:132-149`). Do not copy that block as a working configuration example.
- The agentic integration guide says Agent→LLM prompts are `OUT` and its illustrative `llm_prompt` scan uses `direction="OUT"`, while the architecture direction table and AgentCore leg mapping treat model prompts as `IN`. The same guide's sample returns the generated response without a final response scan despite prose describing final aggregated output scanning (`vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md:157-171`, `:205-262`, `:305-310`; `vendor/zguard-ai-integrations/docs/ARCHITECTURE.md:318-338`; `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py:238-269`). Treat the guide as contradictory illustrative prose, not as a direction contract.
- Bedrock response helpers receive `(texts, opaque)` but discard the opaque flag; the after-call path only applies `on_unscannable` when no response text exists. A mixed text plus image/document/unknown response can therefore be scanned on text alone in the static implementation (`vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:358-389`, `:671-731`). No runtime model matrix was executed.
- Apigee SharedFlow's MCP extractor only copies `result.content[*].text` into the tool-event output. Non-text result members are omitted even though the README describes MCP results generally as `OUT` (`vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md:19-22`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js:68-101`).
- AgentCore, Bedrock, Lambda, and Strands policy helpers, plus Codex utility code, convert a malformed/non-numeric explicit `AIGUARD_POLICY_ID` to `None`, which selects auto-resolution rather than rejecting the configuration (`vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py:202-216`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:456-470`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/aiguard_decorator.py:285-299`; `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py:180-194`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/aiguard_utils.py:155-168`). This is inconsistent with the root warning that a stale explicit ID can fail closed, and needs a deliberate configuration decision or runtime test.
- Cloud Run documentation says pipelines configure an existing Apigee org but do not create one, while the separately invoked `provision_org.py` helper explicitly creates the org and runtime. The source supports a two-stage workflow; it does not support saying that the pipeline itself always creates an org (`vendor/zguard-ai-integrations/Google/cloudrun/README.md:51-73`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py:98-154`).

The earlier Claude Code file-read fail-open claim is superseded by the 0.2.0 changelog, which says the Claude hooks now block on missing keys, API errors, and exceptions (`vendor/zguard-ai-integrations/CHANGELOG.md:35-46`). Keep any older integration prose in this repository marked as stale rather than presenting it as current behavior. Do not generalize the remaining host-specific posture: post-hooks and Codex `Stop` are constrained by their event timing, and gateway unknown-content handling remains controlled by `failClosedOnUnknown`.

## Relationship to ZIA AI features

AI Guard is not the source of truth for ZIA AI-app access control, ZIA DLP, ZIA SSL inspection, or ZBI isolation behavior. Use this page for the captured AI Guard runtime-protection surface, and route broader GenAI access or DLP questions to the owning product references.

For operators asking "how do I control GenAI app usage across the org" → ZIA. For operators asking "how do I protect our custom AI application's LLM interactions" → AI Guard.

## Key operational notes

- AI Guard uses GPU-based AI inference for detection — detectors are not simple pattern-match rules. Deployment placement varies by Proxy, DaaS, and OnPrem hybrid mode.
- In Proxy mode, AI Guard is configured with LLM provider credentials. This means AI Guard sits in the trust chain for LLM API calls.
- Proxy mode requires AI Application, LLM Provider, and LLM Provider Credential configuration. DaaS mode requires application API-key handling instead.
- DaaS mode requires application code changes (the application must make the AI Guard API call). This is a development integration, not a transparent network proxy.
- DaaS mode should instrument both prompt and response paths. Do not assume prompt-only inspection enforces output-side policy.
- Proxy-mode ZIA integration should fail closed and block QUIC, otherwise AI-app traffic can bypass the intended inspection path.
- Policy Control is a binding layer separate from policy configuration. A policy can exist but not enforce as expected if its match rule order, enabled state, user/app scope, LLM/model, custom-header, or source-IP criteria are wrong.
- Custom request headers can become policy-match criteria and can be marked sensitive. Treat header naming and encryption settings as part of policy design, not just metadata decoration.
- Storing prompt/response history is an explicit tenant setting with a 90-day history window in the captured Help page. Do not assume full prompt text is always retained.
- The "Refusal Detection" feature is notable — it protects against scenarios where adversaries attempt to overwhelm an AI application by causing it to refuse legitimate queries (a denial-of-service pattern against AI apps).

## What AI Guard is not

- Not a web content filter. Route general internet AI app access-control questions to ZIA URL filtering.
- Not an LLM provider. AI Guard wraps LLMs; it does not run its own language model (the underlying LLMs are from OpenAI, Anthropic, Google, AWS, etc.).
- Not a full CASB for AI apps. Route broader AI SaaS discovery and posture questions to the owning ZIA / Business Insights references.

## Cross-links

- ZIA AI app access-control routing target: [`../zia/index.md`](../zia/index.md)
- ZIA DLP routing target: [`../zia/dlp.md`](../zia/dlp.md)
- AI Guard is in the ai-security reference directory alongside: [`./index.md`](./index.md), [`./overview.md`](./overview.md), [`./ai-guard-coverage.md`](./ai-guard-coverage.md)
- API and integration divergences: [`./api-divergences.md`](./api-divergences.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
