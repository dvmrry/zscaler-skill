---
product: ai-security
topic: "ai-security-overview"
title: "AI Security family — AI Guard, AI Guardrails, AI Red Teaming, governance"
content-type: reasoning
last-verified: "2026-04-25"
confidence: medium
source-tier: doc
sources:
  - "https://help.zscaler.com/ai-guard/what-ai-guard"
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "https://www.zscaler.com/products-and-solutions/ai-security"
  - "vendor/zscaler-help/ai-security-marketing.md"
  - "https://www.zscaler.com/products-and-solutions/ai-guardrails"
  - "vendor/zscaler-help/ai-guardrails-marketing.md"
author-status: draft
---

# AI Security family — AI Guard, AI Guardrails, AI Red Teaming, governance

Zscaler's AI Security stack is **a family, not a single product**. Marketing groups four pillars under "AI Security"; help-portal docs treat individual sub-products (AI Guard, AI Guardrails, AI Red Teaming) as discrete services. This page maps the family so the skill can route a user's question to the right component before claiming depth.

**Confidence is medium** — the entire family is documented from marketing pages and one help-portal article. There is no SDK module (`zaiguard` does not exist in the Python or Go SDK as of the current pinned versions), no Terraform resource, and no captured Postman collection coverage. Operational depth questions need Zscaler docs / TAM.

## The four pillars

From the AI Security product page, Zscaler's framing covers the full enterprise-AI lifecycle:

| Pillar | What it covers | Closest sub-product |
|---|---|---|
| **AI Asset Management** | Discovery of shadow AI apps, mapping AI models / dev tools, posture assessment across infrastructure and data pipelines. | Capability of the broader Zscaler Data Fabric + ZIA observability — no dedicated SKU surfaced. |
| **Secure Access to AI Apps** | Warn / block / isolate user access to public AI apps (ChatGPT, Claude, Gemini, etc.); enforce DLP on prompts; content moderation. | Implemented via **ZIA URL Filtering** (12 GenAI categories), **ZIA DLP** prompt scanning, **ZBI** (isolation for risky AI usage). Not a separate product — leverages the Tier 1 ZIA stack. |
| **Secure AI Apps and Infrastructure** | Automated vulnerability assessment of customer-deployed LLM apps; 25+ prebuilt probes; custom risk scanning; remediation tracking. | **AI Red Teaming** (sub-product). |
| **AI Governance** | Real-time compliance monitoring, framework alignment, audit reporting. | Spans **AI Guard** (runtime enforcement) + reporting layer. |

The "Secure Access to AI Apps" pillar is where the existing skill already has coverage. The other three are new ground.

## AI Guard — runtime guardrails

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

Three modes, with sharply different traffic patterns:

| Mode | Traffic shape | When to use |
|---|---|---|
| **SaaS / Proxy mode** | AI Guard inline between AI app and LLM provider — AI Guard sees every prompt/response in the path and can block. | Users / apps reach LLM providers via Zscaler. Like ZIA inline inspection but for LLM API traffic. |
| **DaaS (Detection as a Service)** | AI Guard sidecar; the application explicitly calls AI Guard's API for each prompt and each response. | The customer's app needs LLM-content inspection but doesn't route LLM traffic through Zscaler. App developer adds API calls to AI Guard explicitly. |
| **OnPrem hybrid** | AI Guard deployed on-prem with cloud control plane. | Data residency / compliance requires inspection happen on the customer's infrastructure. |

In **DaaS mode AI Guard is not inline** — the customer must wire it in at the application layer. That's a meaningful integration burden but unlocks any LLM provider (not just ones reachable via the Zscaler proxy).

### How it integrates with the existing ZIA stack

AI Guard chains into ZIA in **proxy mode**. The traffic path looks like:

```
user → ZCC → ZIA URL Filter (catches GenAI categories) → ZIA DLP (prompt scanning)
     → AI Guard (15 detectors) → LLM provider
     ← responses flow back through the same pipeline
```

The existing skill coverage of GenAI URL categories (in `references/zia/url-filtering.md`) and DLP GenAI prompt scanning (in `references/zia/dlp.md`) handles the URL-Filter + DLP layers. AI Guard adds the **content-aware inline inspection** layer that sits between DLP and the LLM provider. This is a **prepend, not a replace** — DLP still runs.

### Operational pre-reqs

- **Inline mode requires SSL inspection** — prompt/response payloads are HTTPS to LLM providers; same SSL-inspection rule that DLP needs. SSL bypass on LLM domains kills AI Guard inline mode just like it kills DLP. Cross-link to [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md).
- **DaaS mode requires application changes** — every prompt/response site needs API calls. Not a pure "drop in" deploy.
- **GPU-based inference** is in Zscaler's cloud — implies non-trivial latency cost compared to a pattern-match inspector. No published latency numbers.

## AI Guardrails — marketing umbrella

"AI Guardrails" appears on the product website but the help-portal doc that explains it is `what-ai-guard`. **AI Guardrails is the marketing name; AI Guard is the product**. Both refer to the same runtime-protection service. The Guardrails marketing emphasis adds:

- **100+ predefined DLP dictionaries** integrated for prompt scanning.
- **Dashboards** to see all prompts sent to models, track policy violations, and test policies before enforcement.
- **Compliance support** for AI-deployment regulatory frameworks.

These framing differences don't appear to be feature differences. Treat the names as synonymous unless a customer / Zscaler doc explicitly distinguishes them.

## AI Red Teaming

Separate sub-product. **Automated vulnerability assessment for customer-deployed LLM applications**:

- 25+ prebuilt probes across risk categories (jailbreak, data exfil, prompt injection, etc.).
- Custom risk scanning — define scenarios specific to the customer's app.
- Actionable remediation guidance with progress tracking.

Positioned for development teams hardening their own LLM apps. **Distinct from AI Guard**: AI Guard is runtime enforcement; AI Red Teaming is offline / scheduled testing. Use both in tandem if you build LLM apps.

No deeper material captured. Treat as awareness-only within the deep-dive — recommend Zscaler docs / TAM for adoption.

## Where AI Security fits relative to existing skill content

| Existing reference | AI Security touchpoint |
|---|---|
| [`../zia/url-filtering.md`](../zia/url-filtering.md) — 12 GenAI URL Filter categories | These pre-classify AI-related traffic *before* it hits AI Guard. URL Filter blocks at the category level; AI Guard does deep content inspection. |
| [`../zia/dlp.md`](../zia/dlp.md) — DLP GenAI prompt scanning, HTTP GET query inspection | DLP applies dictionary / regex / EDM matchers on prompts. AI Guard adds intent-classification matchers (jailbreak, toxicity, etc.) that pure DLP can't do. |
| [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md) | Required for AI Guard inline mode. SSL bypass on LLM provider domains breaks AI Guard. |
| [`../zbi/policy-integration.md`](../zbi/policy-integration.md) — Isolate action | "Secure Access" pillar uses ZBI to isolate risky AI app sessions. AI Guard doesn't replace ZBI; it complements it. |
| [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md) | AI Guard + ZIA + ZBI form a chain — should be added as a cross-product hook. |

## Edge cases / gotchas

1. **"AI Guard" vs "AI Guardrails" is a naming inconsistency, not a product split.** Operators will use either name. Skill should accept both as equivalent.
2. **AI Guard is not in any SDK.** Configuration is portal-only. Don't suggest `client.aiguard.*` Python or `client.zaiguard.*` Go — neither exists.
3. **DaaS mode bypasses Zscaler's inline path entirely.** A tenant deploying DaaS mode does NOT need ZIA inline; it's an application-layer integration. This breaks the "Zscaler is always inline" mental model. Conversely, a tenant with proxy-mode AI Guard does need SSL inspection on LLM traffic.
4. **Pricing/packaging not captured.** AI Guard appears separately licensed but the SKU / tier mapping isn't in the captures. Treat licensing questions as unanswered.
5. **The "15 detectors" figure is from one capture.** Zscaler may add detectors over time. Don't quote the exact count if the operator signals it might be stale; instead say "15+ as of 2026-04 capture".
6. **Refusal Detection exists specifically because over-blocking is itself an attack vector.** A jailbreak prompt that *causes* a model to refuse can be used to lock legitimate users out. AI Guard flags excessive refusals as a *signal*, not just a behavior — different mental model from typical content filters.
7. **Categories like Finance Advice / Legal Advice are *blockers*, not classifiers.** They don't tag the prompt; they refuse it. Important for operators who want soft-routing (route legal questions to a different model) — AI Guard isn't that; it's enforce/block.
8. **Brand / competitor detection is a content-policy enforcement layer.** This is unusual for a security product (normally a marketing-ops concern). Operators asking "can AI Guard prevent my chatbot from saying nice things about $competitor?" — answer is yes, that's a documented use case.

## Open questions

- **Token / call accounting** — AI Guard inline mode adds GPU inference per request; how is that billed? Per-call, per-token, flat-rate per seat? Not in captures.
- **Latency budget** — what does a typical inline-mode prompt round-trip look like added to LLM provider latency? No data.
- **Custom detector authoring** — can operators add their own intent classifiers, or are the 15 categories fixed? Not in captures.
- **Logging / SIEM integration** — does AI Guard feed NSS / Cloud NSS / LSS, or its own dedicated log stream? Not captured. Cross-reference [`../shared/nss-architecture.md`](../shared/nss-architecture.md) when this is resolved.
- **Provider compatibility for proxy mode** — which LLM providers' endpoints are auto-recognized? Captures mention "must add LLM provider" only for proxy mode without enumerating supported providers.
- **AI Red Teaming integration with AI Guard** — does AI Red Teaming output configure AI Guard rules automatically (probe found a jailbreak → AI Guard blocks it next time)? Captures imply but don't confirm.

## Cross-links

- Skill index: [`./index.md`](./index.md)
- Portfolio map (where AI Security sits in the Zscaler portfolio): [`../_portfolio-map.md`](../_portfolio-map.md)
- ZIA URL Filtering (GenAI categories that pre-classify AI traffic): [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZIA DLP (prompt scanning before AI Guard inspection): [`../zia/dlp.md`](../zia/dlp.md)
- SSL inspection (required for AI Guard inline mode): [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- ZBI (isolation for risky AI app sessions): [`../zbi/overview.md`](../zbi/overview.md)
