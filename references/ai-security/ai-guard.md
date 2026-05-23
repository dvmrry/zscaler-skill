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
  - "vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-api-user-guide.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py"
  - "vendor/zguard-ai-integrations/README.md"
author-status: draft
---

# AI Guard — runtime protection and policy enforcement for AI/LLM applications

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

AI Guard policies are configured in the AI Guard Admin Portal:
- **AI Applications**: Define which LLM-backed applications are managed
- **LLM Providers**: Configure which LLM APIs are in scope
- **LLM Provider Credentials**: Manage API credentials
- **Policy Configurations**: Enable/disable detectors, set actions (log, block, alert)
- **Policy Control**: Manage enforcement per policy
- **Policy Testing**: Test policies against sample prompts before deployment

## Observability

| Surface | Description |
|---|---|
| Dashboard | Overview of AI Guard activity, detector hits, enforcement actions |
| Insights | Detailed findings and trends |
| Usage | LLM usage metrics (tokens, requests, cost tracking) |
| Log Exports | Export AI Guard logs for SIEM or further analysis |
| System Users | View users in AI Guard's user registry |

## API surface

AI Guard has an API surface:
- **Proxy-mode provider API pathing**: Applications send provider-shaped requests to `https://proxy.zseclipse.net` using provider-specific paths such as `/v1/messages`, `/v1/chat/completions`, Bedrock model paths, Gemini `generateContent`, and Vertex paths.
- **DaaS policy detection API**: Applications call `https://api.<cloud>.zseclipse.net/v1/detection/execute-policy` for an explicit policy ID, or `/v1/detection/resolve-and-execute-policy` for AI Guard policy resolution.
- **Python SDK**: `zscaler.zaiguard.policy_detection.PolicyDetectionAPI` exposes `execute_policy(content, direction, policy_id=None, transaction_id=None)` and `resolve_and_execute_policy(content, direction, transaction_id=None)`. Authentication uses `AIGUARD_API_KEY`, `AIGUARD_CLOUD`, and optional `AIGUARD_OVERRIDE_URL`.
- **Admin/config APIs**: No comprehensive public REST API reference for AI Guard administration was found in available sources.

Direction values are documented in the SDK as `IN` and `OUT`. The DAS/API Help page describes the pattern as scanning prompt content before model submission and response content before user return.

## Integration examples

Zscaler publishes `zguard-ai-integrations` as an example repository for AI Guard DAS integrations. Captured completed integrations include Claude Code, Cursor, Cline, Windsurf, GitHub Actions, Jenkins, Azure AI Gateway / APIM, Google Apigee X, Kong Gateway, LiteLLM, NeMo Guardrails, Portkey AI Gateway, TrueFoundry, and n8n. Treat these as implementation examples, not as proof that the core AI Guard admin plane is programmable.

## Relationship to ZIA AI features

ZIA has its own AI-related features (AI app controls, AI-generated content detection in DLP, Generative AI category in URL filtering). AI Guard is a separate, deeper product:
- ZIA AI controls: network-level visibility into which AI apps employees use, basic access control
- AI Guard: runtime protection of the prompt/response content within enterprise AI applications

For operators asking "how do I control GenAI app usage across the org" → ZIA. For operators asking "how do I protect our custom AI application's LLM interactions" → AI Guard.

## Key operational notes

- AI Guard uses GPU-based AI inference for detection — detectors are not simple pattern-match rules. This means detection quality depends on the AI models Zscaler maintains.
- In Proxy mode, AI Guard is configured with LLM provider credentials. This means AI Guard sits in the trust chain for LLM API calls.
- DaaS mode requires application code changes (the application must make the AI Guard API call). This is a development integration, not a transparent network proxy.
- DaaS mode should instrument both prompt and response paths. Do not assume prompt-only inspection enforces output-side policy.
- Proxy-mode ZIA integration should fail closed and block QUIC, otherwise AI-app traffic can bypass the intended inspection path.
- The "Refusal Detection" feature is notable — it protects against scenarios where adversaries attempt to overwhelm an AI application by causing it to refuse legitimate queries (a denial-of-service pattern against AI apps).

## What AI Guard is not

- Not a web content filter. Use ZIA URL filtering for general internet AI app access control.
- Not an LLM provider. AI Guard wraps LLMs; it does not run its own language model (the underlying LLMs are from OpenAI, Anthropic, Google, AWS, etc.).
- Not a full CASB for AI apps. For visibility into which AI SaaS apps employees are using across the org, ZIA CASB or Business Insights is more appropriate.

## Cross-links

- ZIA AI app controls (network-level AI app visibility and access): [`../zia/index.md`](../zia/index.md)
- ZIA DLP (data-in-motion sensitive data protection): [`../zia/dlp.md`](../zia/dlp.md)
- AI Guard is in the ai-security reference directory alongside: [`./index.md`](./index.md), [`./overview.md`](./overview.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
