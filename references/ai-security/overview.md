---
product: ai-security
topic: "ai-security-overview"
title: "AI Security family — AI Guard, AI Guardrails, AI Red Teaming, governance"
content-type: reasoning
last-verified: "2026-07-20"
confidence: medium
source-tier: mixed
verified-against:
  vendor/zscaler-sdk-go: 4371c9bab44d852526721b4b5999e2471dda5198
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/zguard-ai-integrations: 7da6ed977fb3987203001dc78e9146e507cb1407
sources:
  - "https://help.zscaler.com/ai-guard/what-ai-guard"
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
  - "vendor/zscaler-help/ai-guard-managing-role-based-access-control-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-add-and-manage-ai-guard-policies.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-policy-control.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py"
  - "vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zguard-ai-integrations/README.md"
  - "https://www.zscaler.com/products-and-solutions/ai-security"
  - "vendor/zscaler-help/ai-security-marketing.md"
  - "https://www.zscaler.com/products-and-solutions/ai-guardrails"
  - "vendor/zscaler-help/ai-guardrails-marketing.md"
author-status: draft
---

# AI Security family — AI Guard, AI Guardrails, AI Red Teaming, governance

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

Zscaler's AI Security stack is **a family, not a single product**. Marketing groups four pillars under "AI Security"; help-portal docs treat individual sub-products (AI Guard, AI Guardrails, AI Red Teaming) as discrete services. This page maps the family so the skill can route a user's question to the right component before claiming depth.

**Confidence is high for AI Guard runtime detection, deployment shape, and portal operating model**, because every article visible in the public AI Guard Help category tree was captured on 2026-05-22 and mapped into this repo, and the pinned Python SDK policy-detection methods/models are also captured. The reconstructed Automate snapshot now adds a documented AI Guard admin-plane contract with 47 operations plus a separate 11-operation AI Security asset/findings API (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:8-9`). **Confidence remains medium for the broader AI Security family**: AI Guardrails and AI Red Teaming still have mostly marketing-level coverage, and dedicated client wrappers for both newly captured contracts remain gaps.

## The four pillars

Source: `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

From the AI Security product page, Zscaler's framing covers the full enterprise-AI lifecycle:

| Pillar | What it covers | Closest sub-product |
|---|---|---|
| **AI Asset Management** | Discovery of shadow AI apps, mapping AI models / dev tools, posture assessment across infrastructure and data pipelines. | The new AI Security Public API exposes data stores, identities, MCP servers/tools, workloads, and cross-asset issues. Packaging and tenant entitlement remain unresolved. |
| **Secure Access to AI Apps** | Warn / block / isolate user access to public AI apps (ChatGPT, Claude, Gemini, etc.); enforce DLP on prompts; content moderation. | Closest routing targets in this skill are **ZIA URL Filtering**, **ZIA DLP**, and **ZBI**. Treat exact product behavior as owned by those product references, not by AI Guard. |
| **Secure AI Apps and Infrastructure** | Automated vulnerability assessment of customer-deployed LLM apps; 25+ prebuilt probes; custom risk scanning; remediation tracking. | **AI Red Teaming** (sub-product). |
| **AI Governance** | Real-time compliance monitoring, framework alignment, audit reporting. | Spans **AI Guard** (runtime enforcement) + reporting layer. |

The "Secure Access to AI Apps" pillar is where the existing skill already has deep policy coverage. AI Asset Management now has a documented read-only API surface; governance workflow and Red Teaming remain thinner.

## AI Security asset inventory and findings

Source: `vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json`; `vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json`.

The current Automate snapshot adds 11 `GET` operations under `https://api.zsapi.net/aisecurity/aispm`: list/get data stores, identities, issues, MCP servers, and workloads, plus list tools for a discovered MCP server. This is the first captured programmable surface for the broader AI Security asset-management/governance pillar; it is distinct from AI Guard's prompt/response runtime and admin APIs. See [`./asset-management-api.md`](./asset-management-api.md) for the operation map, cursor semantics, enum inconsistency, and client-wrapper boundary.

## AI Guard — runtime guardrails

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`.

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

Zscaler's `zguard-ai-integrations` repo provides working DAS examples for developer tools, CI/CD systems, gateways, orchestration platforms, and AI guardrail libraries. Use those examples to reason about integration patterns, while keeping policy/admin configuration claims tied to Help and SDK sources.

For exact implementation caveats, see [`./api-divergences.md`](./api-divergences.md): SDK and integration sources use `IN`/`OUT` direction literals while the DAS Help examples use `request`/`response`, the `execute-policy` `policyId` requirement is ambiguous across sources, detector counts differ between Help and integration references, and fail-open/fail-closed behavior is integration-specific.

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

## AI Guardrails — marketing umbrella

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

"AI Guardrails" appears on the product website but the help-portal doc that explains it is `what-ai-guard`. AI Guardrails appears to be the marketing/runtime-guardrails surface for AI Guard; no separate technical Help surface is captured. The Guardrails marketing emphasis adds:

- **100+ predefined DLP dictionaries** integrated for prompt scanning.
- **Dashboards** to see all prompts sent to models, track policy violations, and test policies before enforcement.
- **Compliance support** for AI-deployment regulatory frameworks.

These framing differences don't currently establish a separate programmable product surface. Treat the names as closely related unless a customer / Zscaler doc explicitly distinguishes them.

## AI Red Teaming

Source: `vendor/zscaler-help/ai-security-marketing.md`.

Separate sub-product. **Automated vulnerability assessment for customer-deployed LLM applications**:

- 25+ prebuilt probes across risk categories (jailbreak, data exfil, prompt injection, etc.).
- Custom risk scanning — define scenarios specific to the customer's app.
- Actionable remediation guidance with progress tracking.

Positioned for development teams hardening their own LLM apps. **Distinct from AI Guard**: AI Guard is runtime enforcement; AI Red Teaming is offline / scheduled testing. Use both in tandem if you build LLM apps.

No deeper material captured. Treat as awareness-only within the deep-dive — recommend Zscaler docs / TAM for adoption.

## Where AI Security fits relative to existing skill content

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

| Existing reference | AI Security touchpoint |
|---|---|
| [`../zia/url-filtering.md`](../zia/url-filtering.md) — GenAI URL Filter categories | Navigation target for category-level AI app access questions. |
| [`../zia/dlp.md`](../zia/dlp.md) — DLP GenAI prompt scanning, HTTP GET query inspection | Navigation target for sensitive-data-in-prompt questions. |
| [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md) | Navigation target for SSL bypass and decrypt prerequisites that can affect inline inspection. |
| [`../zbi/policy-integration.md`](../zbi/policy-integration.md) — Isolate action | Navigation target for AI app isolation questions under the Secure Access pillar. |
| [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md) | Future cross-product hook target. |

## Edge cases / gotchas

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

1. **"AI Guard" vs "AI Guardrails" is a naming inconsistency in captured sources, not a verified technical split.** Operators will use either name. Skill should route both to this family reference while noting that no separate AI Guardrails Help/admin surface is captured.
2. **AI Guard has a narrow Python SDK surface, not full admin automation.** The Python SDK exposes `zscaler.zaiguard` / `client.zguard.policy_detection` methods for runtime policy detection. Do not imply this covers portal configuration, LLM provider management, policy authoring, or Terraform.
3. **DaaS mode bypasses Zscaler's inline path entirely.** A tenant deploying DaaS mode does NOT need ZIA inline; it's an application-layer integration. This breaks the "Zscaler is always inline" mental model. Conversely, a tenant with proxy-mode AI Guard does need SSL inspection on LLM traffic.
4. **Pricing/packaging not captured.** AI Guard appears separately licensed but the SKU / tier mapping isn't in the captures. Treat licensing questions as unanswered.
5. **Detector counts are date-sensitive.** The April 2026 Help capture names 15 detector categories, while Zscaler marketing may use higher "N+" phrasing as capabilities expand. Prefer detector-category names over exact counts unless the answer is explicitly tied to a capture date.
6. **Refusal Detection exists specifically because over-blocking is itself an attack vector.** A jailbreak prompt that *causes* a model to refuse can be used to lock legitimate users out. AI Guard flags excessive refusals as a *signal*, not just a behavior — different mental model from typical content filters.
7. **Categories like Finance Advice / Legal Advice are *blockers*, not classifiers.** They don't tag the prompt; they refuse it. Important for operators who want soft-routing (route legal questions to a different model) — AI Guard isn't that; it's enforce/block.
8. **Brand / competitor detection is a content-policy enforcement layer.** This is unusual for a security product (normally a marketing-ops concern). Operators asking "can AI Guard prevent my chatbot from saying nice things about $competitor?" — answer is yes, that's a documented use case.

## Open questions

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

- **Token / call accounting** — AI Guard inline mode adds GPU inference per request; how is that billed? Per-call, per-token, flat-rate per seat? Not in captures.
- **Latency budget** — what does a typical inline-mode prompt round-trip look like added to LLM provider latency? No data.
- **Custom detector authoring** — can operators add their own intent classifiers, or are the 15 categories fixed? Not in captures.
- **Log export schema details** — Help confirms ADX, CrowdStrike, S3, and Splunk export destinations, including separate metadata/content targets for some destinations, but not the field-level event schema.
- **Provider compatibility freshness** — proxy-mode captures list supported provider paths and a ZIA app/domain table dated April 14, 2026. Treat this as time-sensitive.
- **AI Red Teaming integration with AI Guard** — does AI Red Teaming output configure AI Guard rules automatically (probe found a jailbreak → AI Guard blocks it next time)? Captures imply but don't confirm.
- **AI Guard direction literal aliases** — SDK and integration examples use `IN`/`OUT`, while the DAS Help page examples use `request`/`response`; see [clarification ai-security-01](../_meta/clarifications.md#ai-security-01-ai-guard-direction-literal-aliases).

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
