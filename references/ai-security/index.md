---
product: ai-security
topic: "ai-security-index"
title: "AI Security family reference hub"
content-type: reference
last-verified: "2026-04-25"
confidence: medium
sources: []
author-status: reviewed
---

# AI Security reference hub

Entry point for **Zscaler AI Security** questions — the family of products that secures enterprise AI usage, including AI Guard (runtime guardrails), AI Guardrails (marketing umbrella for the same), AI Red Teaming (vulnerability assessment for customer LLM apps), and the broader four-pillar governance framework.

Confidence is **medium** because all coverage is sourced from marketing material + one help-portal article. There is **no SDK module** (`zaiguard` does not exist in either Python or Go SDKs), no Terraform resource, and no Postman coverage captured. Operational depth questions need Zscaler docs / TAM.

## Topics

| Topic | File | Status |
|---|---|---|
| Four-pillar framework, AI Guard 15 detectors, deployment modes (Proxy / DaaS / OnPrem), integration with ZIA URL Filter + DLP + ZBI, AI Red Teaming, edge cases | [`./overview.md`](./overview.md) | draft |

## Why AI Security matters in the suite

AI Security is **the suite-spanning offering**, not a standalone product:

- It depends on existing ZIA (URL Filter, DLP, SSL inspection) for the inline path in **Proxy mode**.
- It is decoupled from the suite entirely in **DaaS mode** (application-layer integration with no traffic detour through Zscaler).
- It complements ZBI when "Secure Access to AI Apps" requires isolation for unmanaged-device scenarios.

The skill should treat questions about "AI security in the Zscaler stack" as a layered question — AI Guard sits *on top of* the existing URL Filter + DLP + SSL inspection layers, not in place of them.

## When to start here vs elsewhere

- **Start here** for: "what is AI Guard?" / "what's the difference between AI Guard and AI Guardrails?" / "what are the AI Security pillars?" / "how does Zscaler protect against prompt injection?"
- **Start in [`../zia/url-filtering.md`](../zia/url-filtering.md)** for: "how does Zscaler block ChatGPT?" — the URL Filter GenAI categories handle category-level blocking before AI Guard's content layer fires.
- **Start in [`../zia/dlp.md`](../zia/dlp.md)** for: "how does Zscaler stop sensitive data going into LLM prompts?" — DLP prompt scanning is the existing capability; AI Guard *adds to* it, not replaces.
- **Start in [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)** for: "I configured AI Guard inline and it's not catching anything" — most likely SSL bypass on the LLM provider domain.
- **Start in [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)** for: "is AI Security in scope for this skill?" — coverage tier check.

## Coverage gaps (deferred)

- Pricing / packaging (which AI Security capabilities bundle into which Zscaler edition).
- Latency / performance numbers for inline mode.
- Custom-detector authoring — fixed-set vs extensible.
- Logging / SIEM integration channels (NSS? LSS? own stream?).
- AI Red Teaming + AI Guard interlock — does Red Teaming output configure Guard rules?
- LLM-provider compatibility list for proxy mode.
- DaaS mode integration patterns / SDK shape (no SDK exists; what's the API contract?).
- Gov-cloud availability (likely deferred until commercial cloud GA stabilizes).

These don't block conceptual answers; they limit operational depth.
