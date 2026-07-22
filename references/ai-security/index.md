---
product: ai-security
topic: "ai-security-index"
title: "AI Security family reference hub"
content-type: reference
last-verified: "2026-07-20"
confidence: medium
source-tier: mixed
verified-against:
  vendor/zscaler-sdk-go: cd24ac6b1f409d6752b5de8092e50dcab7b8c5c0
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/zguard-ai-integrations: 7da6ed977fb3987203001dc78e9146e507cb1407
sources:
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-help-index.md"
  - "vendor/zscaler-help/ai-guard-users-help-index.md"
  - "vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md"
  - "vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md"
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
  - "vendor/zscaler-help/ai-security-marketing.md"
  - "vendor/zscaler-help/ai-guardrails-marketing.md"
author-status: reviewed
---

# AI Security reference hub

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

Entry point for **Zscaler AI Security** questions — the family of products that secures enterprise AI usage, including AI Guard (runtime guardrails), AI Guardrails (marketing/runtime-guardrails surface for AI Guard; no separate technical Help surface captured), AI Red Teaming (vulnerability assessment for customer LLM apps), AI infrastructure inventory/findings, and the broader four-pillar governance framework.

Confidence is **high for the captured AI Guard runtime API, Automate admin contract, and legacy May Help material**. The current July portal's 24-article AI Guard for Users tree is indexed and its release chronology is captured, but several newly listed article bodies remain unmined (`vendor/zscaler-help/ai-guard-users-help-index.md:8-47`). The reconstructed Automate snapshot contains two distinct programmable contracts: 47 AI Guard admin-plane operations and 11 read-only AI Security asset/findings operations (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:9-10`). Confidence remains **medium for the current Help operating model and broader AI Security family** because the new article bodies, AI Guardrails, and AI Red Teaming are not yet covered to the same depth, and no dedicated SDK, Terraform, Ansible, or MCP wrapper for either captured contract is established.

## Topics

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

| Topic | File | Status |
|---|---|---|
| Four-pillar framework, AI Guard detector categories, deployment modes (Proxy / DaaS / OnPrem), ZIA proxy-chain integration, Python policy-detection SDK surface, AI Red Teaming, edge cases | [`./overview.md`](./overview.md) | draft |
| AI Guard runtime enforcement, admin objects, policy control, tenant/provider/app setup, observability, log exports, and SDK/API surface | [`./ai-guard.md`](./ai-guard.md) | draft |
| AI Guard API and integration divergences — direction literals, `policyId`, detector taxonomy, integration failure posture, Automate admin-plane contract, and client-wrapper gaps | [`./api-divergences.md`](./api-divergences.md) | draft |
| AI Security Public API — 11 read-only operations for data stores, identities, issues, MCP servers/tools, and workloads; pagination and wrapper gaps | [`./asset-management-api.md`](./asset-management-api.md) | draft |
| AI Guard public-source coverage manifest and certification boundary | [`./ai-guard-coverage.md`](./ai-guard-coverage.md) | draft |
| AI Security claims ledger for this Tier 2 refresh | [`./_claims-ledger.md`](./_claims-ledger.md) | draft |

## Why AI Security matters in the suite

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

AI Security is **the suite-spanning offering**, not a standalone product:

- In **Proxy mode**, AI Guard is configured through the captured ZIA proxy-chain integration and can interact with existing ZIA forwarding, decryption, access-control, and DLP posture.
- It is decoupled from the suite entirely in **DaaS mode** (application-layer integration with no traffic detour through Zscaler).
- For broader "Secure Access to AI Apps" questions, route to the ZIA/ZBI references that own category-level access, DLP, SSL inspection, and isolation behavior.

The skill should treat questions about "AI security in the Zscaler stack" as a layered question: AI Guard adds LLM-content inspection when deployed inline or called by the application; it does not replace the existing ZIA/ZBI controls. Use the ZIA/ZBI references as routing targets for those products, not as source evidence for AI Guard-specific behavior.

## When to start here vs elsewhere

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

- **Start here** for: "what is AI Guard?" / "what's the difference between AI Guard and AI Guardrails?" / "what are the AI Security pillars?" / "how does Zscaler protect against prompt injection?"
- **Start in [`../zia/url-filtering.md`](../zia/url-filtering.md)** for: "how does Zscaler block ChatGPT?" — that is a category-level AI app access-control question, not an AI Guard detector question.
- **Start in [`../zia/dlp.md`](../zia/dlp.md)** for: "how does Zscaler stop sensitive data going into LLM prompts?" — use the ZIA DLP reference for existing DLP behavior, then return to AI Guard for LLM detector behavior.
- **Start in [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)** for: "I configured AI Guard inline and it's not catching anything" — check decryption and bypass posture before assuming an AI Guard detector failure.
- **Start in [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)** for: "is AI Security in scope for this skill?" — coverage tier check.

## Coverage gaps (deferred)

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

- Pricing / packaging (which AI Security capabilities bundle into which Zscaler edition).
- Latency / performance numbers for inline mode.
- Custom-detector authoring — fixed-set vs extensible.
- Log export event schema and exact SIEM field mapping. Destinations are captured, but field-level schema is not.
- AI Red Teaming + AI Guard interlock — does Red Teaming output configure Guard rules?
- Full AI Guard admin-configuration automation client coverage. The reconstructed Automate snapshot documents admin-plane operations, but the captured client wrappers do not yet expose them.
- Go SDK, Terraform, MCP, Postman, and Automation Hub coverage for AI Guard admin-plane automation remains absent from the captured client/source classes even though the reconstructed Automate contract now exposes the admin-plane API surface. See [API divergences](./api-divergences.md#automate-admin-plane-contract-vs-client-surfaces).
- Current AI Guard for Users article bodies for architecture, quick starts, prompt allowlisting, best practices, topology, token usage, audit logs, detection summary, and latency.
- A source-backed mapping between Help's User-mode/application provider labels and the narrower Automate admin-plane provider-type enum. See [clarification ai-security-07](../_meta/clarifications.md#ai-security-07-help-provider-labels-vs-automate-provider-types).
- Gov-cloud availability (likely deferred until commercial cloud GA stabilizes).

These don't block conceptual answers; they limit operational depth.
