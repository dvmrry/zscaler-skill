---
product: ai-security
topic: "ai-security-overview"
title: "AI Security family — AI Guard, AI Guardrails, AI Red Teaming, governance"
content-type: reasoning
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
  - "https://help.zscaler.com/ai-guard/what-ai-guard"
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-help-index.md"
  - "vendor/zscaler-help/ai-guard-users-help-index.md"
  - "vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md"
  - "vendor/zscaler-help/ai-guard-users-and-user-groups.md"
  - "vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md"
  - "vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-api-user-guide.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-help/ai-guard-dashboard.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-insights.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-usage.md"
  - "vendor/zscaler-help/ai-guard-managing-tenant-settings.md"
  - "vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-add-and-manage-ai-guard-policies.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-policy-control.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md"
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
  - "vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zguard-ai-integrations/README.md"
  - "vendor/zguard-ai-integrations/CHANGELOG.md"
  - "vendor/zguard-ai-integrations/AWS/README.md"
  - "vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md"
  - "vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py"
  - "vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md"
  - "vendor/zguard-ai-integrations/AWS/strands-agents/README.md"
  - "vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py"
  - "vendor/zguard-ai-integrations/Google/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md"
  - "vendor/zguard-ai-integrations/Google/cloudrun/README.md"
  - "vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py"
  - "https://www.zscaler.com/products-and-solutions/ai-security"
  - "vendor/zscaler-help/ai-security-marketing.md"
  - "vendor/zscaler-help/ai-access-security-marketing.md"
  - "https://www.zscaler.com/products-and-solutions/ai-guardrails"
  - "vendor/zscaler-help/ai-guardrails-marketing.md"
author-status: draft
---

# AI Security family — AI Guard, AI Guardrails, AI Red Teaming, governance

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-access-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

Zscaler's AI Security stack is **a family, not a single product**. Marketing groups four pillars under "AI Security"; current first-party surfaces name AI Access Security, AI Guard, AI Guardrails, and AI Red Teaming within that family. This page maps the family so the skill can route a user's question to the right component before claiming depth; publication of a named product page is not by itself evidence of GA, entitlement, or tenant enablement (`vendor/zscaler-help/ai-access-security-marketing.md:8-31`).

**Confidence is high for the captured AI Guard runtime API, the Python configuration surface introduced in 1.9.39 and retained in current v1.9.44, the retained last-known AI Guard Automate admin contract, the current structured AI Security contract, and the legacy May Help tree.** The six Python resources and their method inventories are exposed at `vendor/zscaler-sdk-python/CHANGELOG.md:141-206`, current version at `vendor/zscaler-sdk-python/pyproject.toml:3`, `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`, `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357`, `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363`, and `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412`. The current AI Guard for Users tree contains 25 indexed articles—six Getting Started, eight Configuration, two Best Practices, seven Monitoring, and two Troubleshooting—and now has current bodies captured for custom block messages and user/group synchronization; several other newly listed article bodies remain unmined (`vendor/zscaler-help/ai-guard-users-help-index.md:8-48`; `vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md:8-24`; `vendor/zscaler-help/ai-guard-users-and-user-groups.md:8-24`). The 2026-08-12 public Automate route table publishes 108 `ai-security` operations: 97 AI Red Teaming operations and 11 retained read-only AI Infrastructure asset/findings operations, with structured request and response schemas (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-20`; addition count and inventory at `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:49`, `:69-165`; representative schemas at `vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:2-701`). It publishes no `aiguard` routes; the prior 47-operation snapshot remains retained as last-known evidence, and that publication absence is not proof of endpoint retirement or backend unavailability (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:19-23`; `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160`). **Confidence remains medium for the current Help operating model and broader AI Security family**: Red Teaming tenant entitlement, authentication scopes, live acceptance, and its interlock with AI Guard remain unresolved; Python also lacks eight operations from the retained AI Guard contract, and other client wrappers remain gaps.

## The four pillars

Source: `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-access-security-marketing.md`; `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

From the AI Security product page, Zscaler's framing covers the full enterprise-AI lifecycle:

| Pillar | What it covers | Closest sub-product |
|---|---|---|
| **AI Asset Management** | Discovery of shadow AI apps, mapping AI models / dev tools, posture assessment across infrastructure and data pipelines. | The new AI Security Public API exposes data stores, identities, MCP servers/tools, workloads, and cross-asset issues. Packaging and tenant entitlement remain unresolved. |
| **Secure Access to AI Apps** | Discover and classify public AI, embedded SaaS AI, agents, and developer tools; provide prompt/response insights; allow, block, coach/warn, or isolate access; apply inline DLP and content moderation. | **AI Access Security** is the current named positioning surface. Route implementation-level web-control, DLP, and isolation mechanics to **ZIA URL Filtering**, **ZIA DLP**, and **ZBI** where captured. |
| **Secure AI Apps and Infrastructure** | Automated vulnerability assessment of customer-deployed LLM apps; 25+ prebuilt probes; custom risk scanning; remediation tracking. | **AI Red Teaming** (sub-product). |
| **AI Governance** | Real-time compliance monitoring, framework alignment, audit reporting. | Spans **AI Guard** (runtime enforcement) + reporting layer. |

The current AI Access Security page explicitly spans public generative-AI applications, AI embedded in SaaS, AI agents, and developer tools, and names discovery/classification, prompt/response insight, user/group access controls, inline DLP using more than 100 dictionaries, content moderation, and AI-IDE controls (`vendor/zscaler-help/ai-access-security-marketing.md:8-24`). That establishes a current product-positioning and capability surface, not GA or rollout stage, a tenant's entitlement or feature enablement, API/schema parity, or cloud-specific availability (`vendor/zscaler-help/ai-access-security-marketing.md:28-31`). The skill has deeper implementation-level policy coverage in the adjacent ZIA and ZBI references. AI Asset Management has a documented read-only API surface, and AI Red Teaming has machine-readable request coverage; governance workflows, Red Teaming response behavior, and live operating semantics remain thinner.

## AI Security asset inventory and findings

Source: `vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json`; `vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json`.

The current Automate snapshot carries 11 `GET` operations under `https://api.zsapi.net/aisecurity/aispm`: list/get data stores, identities, issues, MCP servers, and workloads, plus list tools for a discovered MCP server. They are the asset-management subset of the 108-operation `ai-security` publication, alongside 97 AI Red Teaming operations; both service base URLs are preserved in the combined OpenAPI (`vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json:42816-42826`). This remains distinct from AI Guard's prompt/response runtime and retained admin snapshot. See [`./asset-management-api.md`](./asset-management-api.md) for the operation map, cursor semantics, current schema drift, and client-wrapper boundary.

## AI Guard — runtime guardrails

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`.

The flagship sub-product. **Inline content inspection for prompts and responses** to and from LLMs.

### What it inspects

15 named detector categories (from `ai-guard-what-is.md`):

| Category | Purpose |
|---|---|
| **Visibility & Access Control** | Track which apps access private LLMs; enforce per-user / per-app permissions. |
| **Prompt Injection & Jailbreak Protection** | Detect and neutralize adversarial prompts that try to bypass model safety. |
| **Toxicity** | Real-time filtering of toxic language in prompts and responses. |
| **Sensitive Data Protection** | Inline inspection + classification of prompts to prevent data exfiltration through LLM APIs. |
| **Off-Topic Response Detection** | Catch LLMs going off-purpose (model drift, scope creep). |
| **Malicious URL Detection** | Scan links in prompts/responses; block known-bad URLs. |
| **Language Detection & Enforcement** | Restrict allowed languages (compliance / regional policy). |
| **Code Injection & Execution** | Block embedded code in prompts/responses. |
| **Gibberish & Low-Quality Filter** | Detect garbage in / garbage out — coherence guarantee. |
| **Refusal Detection & Intervention** | Flag *unexpected* model refusals — could be a prompt attack pattern (refusal-as-DoS). |
| **Finance Advice** | Block actionable financial guidance (investing, trading, tax); allow neutral facts. |
| **Prompt Tagging-based Access Control** | Auto-classify prompts into categories for governance / RBAC enforcement. |
| **Competitor Discussion Detection** | Block prompts referencing competitors / pricing comparisons. |
| **URL Reachability Detection** | Verify URL accessibility — guards against hallucinated / dead URLs. |
| **Legal Advice** | Block prompts seeking legal interpretation; allow neutral facts. |

These are **intent-based detectors** — not pattern matches. The categories combine GPU-based inference with classifier models. Multiple detectors run per prompt/response pair.

### Deployment modes

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

Three modes, with sharply different traffic patterns:

| Mode | Traffic shape | When to use |
|---|---|---|
| **SaaS / Proxy mode** | AI Guard inline between AI app and LLM provider — AI Guard sees every prompt/response in the path and can block. | Users / apps reach LLM providers via Zscaler. Like ZIA inline inspection but for LLM API traffic. |
| **DaaS (Detection as a Service)** | AI Guard sidecar; the application explicitly calls AI Guard's API before sending each prompt and again before returning each response. | The customer's app needs LLM-content inspection but keeps direct LLM-provider routing. App developer adds API calls to AI Guard explicitly. |
| **OnPrem hybrid** | AI Guard deployed on-prem with cloud control plane. | Data residency / compliance requires inspection happen on the customer's infrastructure. |

In **DaaS mode AI Guard is not inline** — the customer must wire it in at the application layer. The Help guide documents two policy-detection endpoints: `/v1/detection/execute-policy` when the app binds to a specific policy ID, and `/v1/detection/resolve-and-execute-policy` when AI Guard resolves policy selection. The Python SDK wraps both.

### Current public integration boundaries

The public integration examples expose different enforcement seats, so coverage
must be described at the host boundary rather than as a universal AI Guard
guarantee:

| Family | Boundary | Timing caveat |
|---|---|---|
| AWS AgentCore / Strands | Four legs: prompt, response, tool input, and tool output. | Tool input is before execution; tool output is before model re-entry. Strands response blocking retries and eventually raises, while tool output replacement happens after the tool has run (`vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md:1-18`, `:50-82`; `vendor/zguard-ai-integrations/AWS/strands-agents/README.md:181-198`). |
| AWS Lambda / Bedrock boto3 | Lambda sees only the handler prompt/response boundary; boto3 sees Bedrock client calls. | Lambda raises for asynchronous event sources to preserve retry/DLQ behavior; boto3 skips complete streaming responses at `after_call` (`vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md:49-87`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:671-693`). |
| OpenAI Codex CLI | User prompt, Bash/MCP pre-tool, Bash/MCP post-tool, and `Stop` hooks. | Post-tool hooks run after side effects; `Stop` runs after streaming, blocks only on a block verdict, and fails open on scan errors (`vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:9-24`, `:48-70`, `:186-191`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py:47-81`). |
| Google Apigee / Cloud Run | Inline proxy is synchronous Gemini-only; SharedFlow/flow supports multiple caller dialects and SSE. | Inline/proxy blocks use 403; SharedFlow/flow returns caller-shaped 200 refusals. Cloud Run bootstrap and Apigee-org provisioning are separate stages (`vendor/zguard-ai-integrations/Google/apigee/README.md:1-29`; `vendor/zguard-ai-integrations/Google/cloudrun/README.md:17-27`, `:51-73`). |

These are static implementation examples, not runtime verification. The root
repository's fail-closed statement must be read with its documented audit-only
and unknown-content exceptions (`vendor/zguard-ai-integrations/README.md:256-293`).

Zscaler's `zguard-ai-integrations` repo provides DAS examples for developer tools, CI/CD systems, gateways, orchestration platforms, and AI guardrail libraries. The September 1, 2026 head adds AWS Bedrock AgentCore/boto3/Lambda/Strands, OpenAI Codex CLI, and Google Apigee/Cloud Run examples (`vendor/zguard-ai-integrations/README.md:44-65`; `vendor/zguard-ai-integrations/CHANGELOG.md:3-18`). Use those examples to reason about interception and deployment patterns, while keeping policy/admin configuration claims tied to Help and SDK sources. The release requires `zscaler-sdk-python>=1.9.44` (`vendor/zguard-ai-integrations/CHANGELOG.md:7-9`), and this parent repository now pins v1.9.44 (`vendor/zscaler-sdk-python/pyproject.toml:1-4`). That closes the declared minimum-version gap but does not certify live behavior for every example.

For exact implementation caveats, see [`./api-divergences.md`](./api-divergences.md): SDK and integration sources use `IN`/`OUT` direction literals while the DAS Help examples use `request`/`response`, the `execute-policy` `policyId` requirement is ambiguous across sources, detector counts differ between Help and integration references, fail-open/fail-closed behavior is integration-specific, and the new source set contains explicit timing, opaque-content, malformed-example, policy-ID parsing, and Cloud Run provisioning divergences. The root integration README's “every integration fails closed” sentence has documented exceptions for audit-only post-hooks/Codex `Stop` and unknown gateway traffic unless `failClosedOnUnknown` is enabled (`vendor/zguard-ai-integrations/README.md:256-293`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:186-191`).

### How it integrates with the existing ZIA stack

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

AI Guard chains into ZIA in **proxy mode**. The AI Guard proxy-chain article covers the AI Guard-specific forwarding/proxy-chain requirements: AI Guard proxy-chain certificate, proxy gateway, `forward.zseclipse.net:9443` endpoint, fail-close behavior, QUIC block/drop, wildcard destination groups, and Forwarding Control rules for supported AI-provider domains.

AI Guard adds a **content-aware LLM inspection** layer for prompts and responses; it does not replace existing ZIA or ZBI controls. Treat the exact ZIA/ZBI policy order as a cross-product routing question rather than as an AI Guard-only claim.

### Operational pre-reqs

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

- **Inline mode requires SSL inspection** — prompt/response payloads are HTTPS to LLM providers, so SSL bypass on LLM domains can prevent AI Guard inline inspection. Cross-link to [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md) for operational SSL-bypass diagnosis.
- **ZIA proxy-chain mode requires forwarding hygiene** — the guide calls for the AI Guard proxy-chain certificate, proxy gateway, `forward.zseclipse.net:9443` endpoint, fail-close behavior, QUIC block/drop, wildcard destination groups, and Forwarding Control rules for supported AI-provider domains.
- **DaaS mode requires application changes** — every prompt/response path needs API calls. Not a pure "drop in" deploy.
- **GPU-based inference** is part of AI Guard's detector model. Placement depends on deployment mode: SaaS/proxy and DaaS call the Zscaler service, while OnPrem hybrid is documented for data-residency/compliance cases. No published latency numbers are captured.

### Admin and observability model

Source: `vendor/zscaler-help/ai-guard-dashboard.md`; `vendor/zscaler-help/ai-guard-about-ai-guard-insights.md`; `vendor/zscaler-help/ai-guard-about-ai-guard-usage.md`; `vendor/zscaler-help/ai-guard-managing-tenant-settings.md`; `vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md`; `vendor/zscaler-help/ai-guard-add-and-manage-ai-guard-policies.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-policy-control.md`; `vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md`.

AI Guard's Help docs now expose enough admin detail to treat the product as Tier 2+ rather than awareness-only:

- **Configuration objects:** AI Applications, AI Application Groups, LLM Providers, LLM Provider Credentials, Policy Configurations, Policy Control rules, RBAC roles, tenant settings, and log exports.
- **Policy binding:** Policy Configurations define detector behavior, while Policy Control rules decide where those policies apply. Matching can use users/groups, LLM/model, applications/credentials, application groups, custom request headers, and source IPs.
- **Operational dashboards:** Dashboard, Insights, and Usage expose transaction count, detections, prompt/response actions, token counts, content size, detection latency, top detectors, PII categories, active apps, and active LLMs.
- **External exports:** Captured destinations include ADX Event Hub, CrowdStrike HEC plus S3 content storage, AWS S3 metadata/content buckets, and Splunk HEC metadata/content endpoints.

The configuration surface introduced in Python SDK 1.9.39 remains present in current v1.9.44, exposing six OneAPI resources with 39 callable methods, while the separate `LegacyAIGuardClient` retains runtime policy detection (`vendor/zscaler-sdk-python/CHANGELOG.md:141-206`; current version at `vendor/zscaler-sdk-python/pyproject.toml:3`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385`, `:671-712`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; method inventories cited above). Against the retained 47-operation AI Guard admin snapshot, eight documented actions remain outside the callable Python inventory. The current public Automate route table does not publish AI Guard, so this comparison is last-known contract versus current SDK, not a claim about current public publication or backend availability (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160`; `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:19-23`).

## AI Guardrails — marketing umbrella

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

"AI Guardrails" appears on the product website but the help-portal doc that explains it is `what-ai-guard`. AI Guardrails appears to be the marketing/runtime-guardrails surface for AI Guard; no separate technical Help surface is captured. The Guardrails marketing emphasis adds:

- **100+ predefined DLP dictionaries** integrated for prompt scanning.
- **Dashboards** to see all prompts sent to models, track policy violations, and test policies before enforcement.
- **Compliance support** for AI-deployment regulatory frameworks.

These framing differences don't currently establish a separate programmable product surface. Treat the names as closely related unless a customer / Zscaler doc explicitly distinguishes them.

## AI Red Teaming

Source: `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json`; `vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json`; `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

Separate sub-product. **Automated vulnerability assessment for customer-deployed LLM applications**:

- 25+ prebuilt probes across risk categories (jailbreak, data exfil, prompt injection, etc.).
- Custom risk scanning — define scenarios specific to the customer's app.
- Actionable remediation guidance with progress tracking.

Positioned for development teams hardening their own LLM apps. **Distinct from AI Guard**: AI Guard is runtime enforcement; AI Red Teaming is offline / scheduled testing. Use both in tandem if you build LLM apps.

The current public Automate route table publishes **97 AI Red Teaming operations** under the `ai-security/airedteaming` route family, in addition to the 11 existing AI Security asset/findings operations. The complete addition inventory spans AI apps and integration tests, business units, file uploads, model benchmarks, probes and probe runs, remediation and policy generation, reports, scheduled tests, test-case results, test runs, and trigger operations (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:49`, `:69-165`). The combined OpenAPI preserves the Red Teaming service URL `https://api.zsapi.net/aisecurity/airt` separately from the asset-management URL (`vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json:42816-42826`).

This is now **structured contract coverage**, not only a Postman request inventory. For example, `POST /api/v2/ai-apps/create` carries a nested request body, a structured `200` response, explicit response statuses, and a JSON request example (`vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:2-701`). The Postman collection remains useful corroboration for its 97 requests across 14 folders, even though its saved-response arrays are empty (`vendor/zscaler-api-specs/oneapi-postman-collection.json:139456-143527`, `:144273-144274`). Neither static source establishes tenant entitlement, authentication scopes, live endpoint acceptance, or whether remediation/policy-generation output can be applied to AI Guard automatically.

## Where AI Security fits relative to existing skill content

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-access-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

| Existing reference | AI Security touchpoint |
|---|---|
| [`../zia/url-filtering.md`](../zia/url-filtering.md) — GenAI URL Filter categories | Navigation target for category-level AI app access questions. |
| [`../zia/dlp.md`](../zia/dlp.md) — DLP GenAI prompt scanning, HTTP GET query inspection | Navigation target for sensitive-data-in-prompt questions. |
| [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md) | Navigation target for SSL bypass and decrypt prerequisites that can affect inline inspection. |
| [`../zbi/policy-integration.md`](../zbi/policy-integration.md) — Isolate action | Navigation target for AI app isolation questions under the Secure Access pillar. |
| [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md) | Future cross-product hook target. |

## Edge cases / gotchas

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

1. **"AI Guard" vs "AI Guardrails" is a naming inconsistency in captured sources, not a verified technical split.** Operators will use either name. Skill should route both to this family reference while noting that no separate AI Guardrails Help/admin surface is captured.
2. **AI Guard has a substantial but incomplete Python SDK surface.** The canonical `client.aiguard` accessor exposes six OneAPI configuration resources; `client.zguard` is only a deprecated alias, and runtime detection stays on `LegacyAIGuardClient(...).aiguard.policy_detection` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385`, `:671-712`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`). Python has 39 callable configuration methods versus 47 operations in the retained last-known Automate snapshot. The current public route table publishes no AI Guard operations, so do not present either the eight-operation wrapper gap or the publication absence as proof of tenant entitlement, endpoint retirement, backend unavailability, or Terraform coverage (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160`).
3. **DaaS mode bypasses Zscaler's inline path entirely.** A tenant deploying DaaS mode does NOT need ZIA inline; it's an application-layer integration. This breaks the "Zscaler is always inline" mental model. Conversely, a tenant with proxy-mode AI Guard does need SSL inspection on LLM traffic.
4. **Pricing/packaging not captured.** AI Guard appears separately licensed but the SKU / tier mapping isn't in the captures. Treat licensing questions as unanswered.
5. **Detector counts are date-sensitive.** The April 2026 Help capture names 15 detector categories, while Zscaler marketing may use higher "N+" phrasing as capabilities expand. Prefer detector-category names over exact counts unless the answer is explicitly tied to a capture date.
6. **Refusal Detection exists specifically because over-blocking is itself an attack vector.** A jailbreak prompt that *causes* a model to refuse can be used to lock legitimate users out. AI Guard flags excessive refusals as a *signal*, not just a behavior — different mental model from typical content filters.
7. **Categories like Finance Advice / Legal Advice are *blockers*, not classifiers.** They don't tag the prompt; they refuse it. Important for operators who want soft-routing (route legal questions to a different model) — AI Guard isn't that; it's enforce/block.
8. **Brand / competitor detection is a content-policy enforcement layer.** This is unusual for a security product (normally a marketing-ops concern). Operators asking "can AI Guard prevent my chatbot from saying nice things about $competitor?" — answer is yes, that's a documented use case.
9. **Integration failure posture has explicit source exceptions.** The zguard root README's fail-closed table is qualified by audit-only Windsurf/Cline post-hooks, the Codex `Stop` hook, and unknown gateway traffic unless `failClosedOnUnknown` is enabled; Codex `Stop` fails open on scan errors after output has streamed (`vendor/zguard-ai-integrations/README.md:256-293`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py:47-81`).
10. **The new integration examples have host-specific side-effect timing.** AgentCore scans tool output before model re-entry; Lambda's asynchronous block path raises to preserve retry/DLQ semantics; Strands can only retry a blocked response and replaces tool output after the tool executes; Codex post-tool hooks cannot undo completed side effects (`vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md:50-82`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md:80-87`; `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py:655-743`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:17-24`).
11. **Several vendor examples are not safe to promote verbatim.** The Strands README constructor block is invalid Python, the agentic guide reverses prompt direction and omits a final response scan in its sample, Bedrock response extraction has a static mixed opaque-content gap, and Apigee MCP extraction omits non-text result members. These are source divergences/open issues, not certified product behavior; see [`./api-divergences.md`](./api-divergences.md#invalid-and-contradictory-vendor-documentation).

## Open questions

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

- **Token / call accounting** — AI Guard inline mode adds GPU inference per request; how is that billed? Per-call, per-token, flat-rate per seat? Not in captures.
- **Latency budget** — what does a typical inline-mode prompt round-trip look like added to LLM provider latency? No data.
- **Custom detector authoring** — can operators add their own intent classifiers, or are the 15 categories fixed? Not in captures.
- **Log export schema details** — Help confirms ADX, CrowdStrike, S3, and Splunk export destinations, including separate metadata/content targets for some destinations, but not the field-level event schema.
- **Provider compatibility freshness** — proxy-mode captures list supported provider paths and a ZIA app/domain table dated April 14, 2026. Treat this as time-sensitive.
- **AI Red Teaming operating boundary** — static request and response schemas are captured, but tenant entitlement, authentication scopes, live endpoint acceptance, and whether Red Teaming output configures AI Guard rules automatically remain unverified.
- **AI Guard direction literal aliases** — SDK and integration examples use `IN`/`OUT`, while the DAS Help page examples use `request`/`response`; see [clarification ai-security-01](../_meta/clarifications.md#ai-security-01-ai-guard-direction-literal-aliases).
- **Integration compatibility** — zguard 0.2.0 requires Python SDK `>=1.9.44`, and this repository now pins v1.9.44; no integration-specific live compatibility run was performed (`vendor/zguard-ai-integrations/CHANGELOG.md:7-9`; `vendor/zscaler-sdk-python/pyproject.toml:1-4`).
- **Integration source divergences** — a runtime matrix is needed to confirm the static Bedrock mixed opaque-content gap, Apigee non-text MCP-result omission, malformed policy-ID fallback, and the two contradictory vendor guides; see [`./api-divergences.md`](./api-divergences.md#opaque-content-and-mixed-response-gap).

## Cross-links

- Skill index: [`./index.md`](./index.md)
- AI Guard coverage manifest: [`./ai-guard-coverage.md`](./ai-guard-coverage.md)
- AI Guard API divergences: [`./api-divergences.md`](./api-divergences.md)
- AI Security claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
- Portfolio map (where AI Security sits in the Zscaler portfolio): [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
- ZIA URL Filtering routing target: [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZIA DLP routing target: [`../zia/dlp.md`](../zia/dlp.md)
- SSL inspection routing target for inline inspection prerequisites: [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- ZBI routing target: [`../zbi/overview.md`](../zbi/overview.md)
