---
product: ai-security
topic: "ai-security-index"
title: "AI Security family reference hub"
content-type: reference
last-verified: "2026-05-22"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-help/ai-guard-dashboard.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-insights.md"
  - "vendor/zscaler-help/ai-guard-about-ai-guard-usage.md"
  - "vendor/zscaler-help/ai-guard-managing-tenant-settings.md"
  - "vendor/zscaler-help/ai-guard-add-and-manage-ai-guard-policies.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-policy-matching.md"
  - "vendor/zscaler-help/ai-guard-managing-ai-guard-log-exports.md"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py"
  - "vendor/zguard-ai-integrations/README.md"
  - "vendor/zscaler-help/ai-security-marketing.md"
  - "vendor/zscaler-help/ai-guardrails-marketing.md"
author-status: reviewed
---

# AI Security reference hub

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

Entry point for **Zscaler AI Security** questions — the family of products that secures enterprise AI usage, including AI Guard (runtime guardrails), AI Guardrails (marketing umbrella for the same), AI Red Teaming (vulnerability assessment for customer LLM apps), and the broader four-pillar governance framework.

Confidence is **high for AI Guard runtime detection, deployment shape, and admin-portal operating model** because Help documents Proxy / DaaS flows, policy/app/provider objects, policy-control matching, dashboards, usage, insights, tenant settings, and log-export destinations. Confidence remains **medium for the broader AI Security family** because AI Guardrails and AI Red Teaming still have mostly marketing-level coverage, and no Terraform, Go SDK, Postman, or broad admin-configuration API surface is captured.

## Topics

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

| Topic | File | Status |
|---|---|---|
| Four-pillar framework, AI Guard detector categories, deployment modes (Proxy / DaaS / OnPrem), ZIA proxy-chain integration, Python policy-detection SDK surface, AI Red Teaming, edge cases | [`./overview.md`](./overview.md) | draft |
| AI Guard runtime enforcement, admin objects, policy control, tenant/provider/app setup, observability, log exports, and SDK/API surface | [`./ai-guard.md`](./ai-guard.md) | draft |

## Why AI Security matters in the suite

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

AI Security is **the suite-spanning offering**, not a standalone product:

- It depends on existing ZIA (URL Filter, DLP, SSL inspection) for the inline path in **Proxy mode**.
- It is decoupled from the suite entirely in **DaaS mode** (application-layer integration with no traffic detour through Zscaler).
- It complements ZBI when "Secure Access to AI Apps" requires isolation for unmanaged-device scenarios.

The skill should treat questions about "AI security in the Zscaler stack" as a layered question — AI Guard sits *on top of* the existing URL Filter + DLP + SSL inspection layers, not in place of them.

## When to start here vs elsewhere

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

- **Start here** for: "what is AI Guard?" / "what's the difference between AI Guard and AI Guardrails?" / "what are the AI Security pillars?" / "how does Zscaler protect against prompt injection?"
- **Start in [`../zia/url-filtering.md`](../zia/url-filtering.md)** for: "how does Zscaler block ChatGPT?" — the URL Filter GenAI categories handle category-level blocking before AI Guard's content layer fires.
- **Start in [`../zia/dlp.md`](../zia/dlp.md)** for: "how does Zscaler stop sensitive data going into LLM prompts?" — DLP prompt scanning is the existing capability; AI Guard *adds to* it, not replaces.
- **Start in [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)** for: "I configured AI Guard inline and it's not catching anything" — most likely SSL bypass on the LLM provider domain.
- **Start in [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)** for: "is AI Security in scope for this skill?" — coverage tier check.

## Coverage gaps (deferred)

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

- Pricing / packaging (which AI Security capabilities bundle into which Zscaler edition).
- Latency / performance numbers for inline mode.
- Custom-detector authoring — fixed-set vs extensible.
- Log export event schema and exact SIEM field mapping. Destinations are captured, but field-level schema is not.
- AI Red Teaming + AI Guard interlock — does Red Teaming output configure Guard rules?
- Full AI Guard admin-configuration automation surface.
- Go SDK, Terraform, and Postman coverage for AI Guard.
- Gov-cloud availability (likely deferred until commercial cloud GA stabilizes).

These don't block conceptual answers; they limit operational depth.
