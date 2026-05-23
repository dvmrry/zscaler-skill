---
product: ai-guard
topic: overview
title: "AI Guard — runtime protection and policy enforcement for AI/LLM applications"
content-type: reference
last-verified: "2026-05-22"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-help-index.md"
  - "vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-api-user-guide.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-help/ai-guard-dashboard.md"
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
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py"
  - "vendor/zguard-ai-integrations/README.md"
author-status: draft
---

# AI Guard — runtime protection and policy enforcement for AI/LLM applications

## Certification scope

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md`; `vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zguard-ai-integrations/README.md`.

As of the 2026-05-22 capture, this repository has captured and mapped every article visible in the public **AI Guard Help** category tree, plus the AI Guard policy-detection surface in the vendored Python SDK and the public `zscaler/zguard-ai-integrations` examples. In repo language, AI Guard is now **documented and certified for the discoverable public Help, SDK, and integration surfaces**.

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

Source: `vendor/zscaler-help/ai-guard-managing-tenant-settings.md`; `vendor/zscaler-help/ai-guard-managing-llm-providers-ai-guard.md`; `vendor/zscaler-help/ai-guard-managing-llm-provider-credentials-ai-guard.md`; `vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md`.

Tenant settings expose the tenant name, deployment mode (`Proxy` or `DaaS`), UUID, and Zscaler AWS Account ID. The AWS account ID is used for optional AWS integrations such as S3 log exports and customer-managed keys.

Operational tenant controls include:

- Network access control using IPv4 CIDR ranges.
- Custom request headers, including a conversation ID header and sensitive-header marking.
- Security settings to store prompts/responses for 90 days, enable event-detection feedback, encrypt sensitive custom headers, and use customer-managed content encryption.
- Customer-managed-key configuration; the captured page lists AWS as the currently supported KMS provider type.
- ZIA end-user and group sync, including an immediate `Start Sync` action outside the scheduled batch window.
- Custom block messages for prompt blocks and response blocks.
- Optional deletion of conversation history when a provider response is blocked.

Proxy mode also requires LLM Provider and LLM Provider Credential objects. Provider fields include provider name, provider type, public/private deployment, and provider-specific server selection. Credential fields include credential name, associated LLM provider, optional expiration date, and API key copied from the provider dashboard.

AI Guard RBAC supports custom roles for system users managed through ZIdentity or local hosted system users in AI Guard. The captured Help page says AI Guard previously supported Administrator, Editor, and Viewer roles; the newer RBAC model lets admins create roles from templates or custom permission/scope selections. Templates are Viewer (read-only access), Editor (read/create/update without delete), and Administrator (full access). Roles are assigned from System User Management.

## Observability

Source: `vendor/zscaler-help/ai-guard-dashboard.md`; `vendor/zscaler-help/ai-guard-about-ai-guard-insights.md`; `vendor/zscaler-help/ai-guard-about-ai-guard-usage.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`.

| Surface | Description |
|---|---|
| Dashboard | Operational transaction view across users or AI applications. Shows app/LLM/detection/transaction counts, per-transaction policy name, severity, prompt/response detections, LLM, and prompt/response action. Date range is capped at up to 90 days. |
| Insights | Executive overview of prompts, responses, active apps/LLMs, blocked counts, token counts, detection latency, trends over time, security posture, transactions by LLM/application, top detectors, and PII detections/categories. |
| Usage | Usage view by AI application or user, including prompt/response content size, prompt tokens, and response tokens. |
| Log Exports | Third-party export configuration for incident/event data. Captured destinations include ADX Event Hub, CrowdStrike HEC plus S3 content storage, AWS S3 metadata/content buckets, and Splunk HEC metadata/content endpoints. |
| System Users | View users in AI Guard's user registry |

Dashboard transaction details include Overview, Detection Summary, Performance & Network Stats, Custom Request Headers, and Prompt Details. This means AI Guard can support investigations where the key question is "which detector fired, on which app/user, with what prompt/response action, and with what latency?"

Log exports can be configured to export allowed/detected prompts and blocked prompts. Some destinations separate metadata and content streams or buckets, which matters for sensitive-content handling and SIEM ingestion design.

## API surface

Source: `vendor/zscaler-help/ai-guard-api-user-guide.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py`; `vendor/zguard-ai-integrations/README.md`.

AI Guard has an API surface:
- **Proxy-mode provider API pathing**: Applications send provider-shaped requests to `https://proxy.zseclipse.net` using provider-specific paths such as `/v1/messages`, `/v1/chat/completions`, Bedrock model paths, Gemini `generateContent`, and Vertex paths.
- **DaaS policy detection API**: Applications call `https://api.<cloud>.zseclipse.net/v1/detection/execute-policy` for an explicit policy ID, or `/v1/detection/resolve-and-execute-policy` for AI Guard policy resolution.
- **Python SDK**: `zscaler.zaiguard.policy_detection.PolicyDetectionAPI` exposes `execute_policy(content, direction, policy_id=None, transaction_id=None)` and `resolve_and_execute_policy(content, direction, transaction_id=None)`. Authentication uses `AIGUARD_API_KEY`, `AIGUARD_CLOUD`, and optional `AIGUARD_OVERRIDE_URL`.
- **Admin/config APIs**: No comprehensive public REST API reference for AI Guard administration was found in available sources.

Direction values are documented in the SDK as `IN` and `OUT`. The DAS/API Help page describes the pattern as scanning prompt content before model submission and response content before user return.

The SDK request/response model matters for resilient DaaS integrations:

| Area | Fields / behavior |
|---|---|
| Request | `content`, `direction`, optional `policyId`, optional `transactionId` |
| Top-level response | `transactionId`, `statusCode`, `errorMsg`, `detectorErrorCount`, `action`, `severity`, `direction`, `detectorResponses`, `throttlingDetails` |
| Per-detector response | `statusCode`, `errorMsg`, `triggered`, `action`, `latency`, `deviceType`, `details`, `severity`, optional `contentHash` |
| Throttling | `throttlingDetails` carries `rlcId`, `metric`, and `retryAfterMillis`; integrations must treat this as retry/backoff input rather than a generic failure. |

The public Python SDK exposes runtime policy detection only. It does not expose Help-documented portal objects such as LLM Provider, LLM Provider Credential, AI Application, Policy Configuration, Policy Control, Tenant Settings, RBAC Role, Dashboard, Insights, Usage, or Log Export management.

## Integration examples

Zscaler publishes `zguard-ai-integrations` as an example repository for AI Guard DAS integrations. Captured completed integrations include Claude Code, Cursor, Cline, Windsurf, GitHub Actions, Jenkins, Azure AI Gateway / APIM, Google Apigee X, Kong Gateway, LiteLLM, NeMo Guardrails, Portkey AI Gateway, TrueFoundry, and n8n. Treat these as implementation examples, not as proof that the core AI Guard admin plane is programmable.

| Integration family | Examples | Surface protected |
|---|---|---|
| IDE / agent hooks | Claude Code, Cursor, Cline, Windsurf | User prompts, agent responses, tool/MCP requests, post-tool output, URL/file-read hooks where the host supports those interception points. |
| AI gateways / proxies | LiteLLM, Portkey, Kong, Azure APIM, Google Apigee | Gateway request and response paths around LLM provider traffic. |
| CI/CD policy validation | GitHub Actions, Jenkins | Synthetic prompt/response test cases before deployment, usually using `resolve-and-execute-policy` unless a specific policy ID is supplied. |
| App / orchestration frameworks | TrueFoundry, NeMo Guardrails, n8n | Application-level prompt and response scanning embedded in app, guardrail, or workflow logic. |

## Relationship to ZIA AI features

ZIA has its own AI-related features (AI app controls, AI-generated content detection in DLP, Generative AI category in URL filtering). AI Guard is a separate, deeper product:
- ZIA AI controls: network-level visibility into which AI apps employees use, basic access control
- AI Guard: runtime protection of the prompt/response content within enterprise AI applications

For operators asking "how do I control GenAI app usage across the org" → ZIA. For operators asking "how do I protect our custom AI application's LLM interactions" → AI Guard.

## Key operational notes

- AI Guard uses GPU-based AI inference for detection — detectors are not simple pattern-match rules. This means detection quality depends on the AI models Zscaler maintains.
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

- Not a web content filter. Use ZIA URL filtering for general internet AI app access control.
- Not an LLM provider. AI Guard wraps LLMs; it does not run its own language model (the underlying LLMs are from OpenAI, Anthropic, Google, AWS, etc.).
- Not a full CASB for AI apps. For visibility into which AI SaaS apps employees are using across the org, ZIA CASB or Business Insights is more appropriate.

## Cross-links

- ZIA AI app controls (network-level AI app visibility and access): [`../zia/index.md`](../zia/index.md)
- ZIA DLP (data-in-motion sensitive data protection): [`../zia/dlp.md`](../zia/dlp.md)
- AI Guard is in the ai-security reference directory alongside: [`./index.md`](./index.md), [`./overview.md`](./overview.md), [`./ai-guard-coverage.md`](./ai-guard-coverage.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
