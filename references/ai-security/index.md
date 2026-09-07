---
product: ai-security
topic: "ai-security-index"
title: "AI Security family reference hub"
content-type: reference
last-verified: "2026-07-20"
confidence: medium
source-tier: mixed
verified-against:
  vendor/zscaler-api-specs: b3e1bd909a3486d240e045029961fc44c0cb483b
  vendor/zscaler-help: 96e69d73438c058c45739f741053bd68d47d234c
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
  - "vendor/zscaler-help/ai-guard-release-update-2026-09-02.md"
  - "vendor/zscaler-help/ai-guard-step-step-configuration-guide-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-configuring-zia-proxy-chain-ai-guard.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-proxy-mode.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-help/ai-guard-dashboard.md"
  - "vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md"
  - "vendor/zscaler-help/ai-guard-users-dashboard.md"
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
  - "vendor/zscaler-help/ai-security-marketing.md"
  - "vendor/zscaler-help/ai-access-security-marketing.md"
  - "vendor/zscaler-help/ai-guardrails-marketing.md"
author-status: reviewed
---

# AI Security reference hub

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-access-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`; `vendor/zscaler-help/ai-guard-release-update-2026-09-02.md`.

Entry point for **Zscaler AI Security** questions — the family of products that secures enterprise AI usage, including AI Guard (runtime guardrails), AI Guardrails (marketing/runtime-guardrails surface for AI Guard; no separate technical Help surface captured), AI Red Teaming (vulnerability assessment for customer LLM apps), AI infrastructure inventory/findings, and the broader four-pillar governance framework.

The current AI Access Security product page names public generative-AI applications, AI embedded in SaaS, AI agents, and developer tools as its scope, with discovery, prompt/response insight, access controls, inline DLP, content moderation, and AI-IDE controls (`vendor/zscaler-help/ai-access-security-marketing.md:8-24`). This is product-positioning evidence only: it does not establish GA or rollout stage, tenant entitlement or enablement, API/schema parity, or cloud-specific availability (`vendor/zscaler-help/ai-access-security-marketing.md:28-31`).

Confidence is **high for the captured AI Guard runtime API, the Python configuration surface introduced in 1.9.39 and retained in current v1.9.44, the current AI Guard Automate admin contract, the current structured AI Security contract, legacy May Help material, the two current dashboard bodies, and the two newly captured current operating articles**. Python exposes 39 callable configuration methods across six resources, plus two separately routed legacy policy-detection methods (`vendor/zscaler-sdk-python/CHANGELOG.md:141-206`; current version at `vendor/zscaler-sdk-python/pyproject.toml:3`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:57-63`, `:138-143`). The current portal splits dashboard documentation into Users and Apps & Infrastructure; the Apps & Infrastructure body captured on **2026-08-04** documents connected multi-prompt conversation threads and says conversation-thread viewing is exclusive to DAS/API mode and does not appear in Proxy mode. A separate **September 2, 2026** release entry announces Proxy-mode multi-turn conversation viewing; retain this as a release/body disagreement rather than a resolved current-state claim (`vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md:4`, `:23-28`; `vendor/zscaler-help/ai-guard-release-update-2026-09-02.md:1-11`, `:25-30`). The current AI Guard for Users tree now contains 25 indexed articles—six Getting Started, eight Configuration, two Best Practices, seven Monitoring, and two Troubleshooting—and the custom-block-message and user/group-sync bodies are captured, while several other current article bodies remain unmined (`vendor/zscaler-help/ai-guard-users-help-index.md:8-48`; `vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md:8-24`; `vendor/zscaler-help/ai-guard-users-and-user-groups.md:8-24`). The current 2026-09-07 Automate capture decoded all 1,322 route blobs with zero failures and reports no retained publication absences. It publishes 114 `ai-security` operations—17 AI Security inventory/findings operations plus 97 AI Red Teaming operations—and 47 AI Guard operations across 29 paths; the comparison matches all 47 AI Guard operations with zero schema-changed operations and records eight colon-action route corrections (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:3`, `:9-21`, `:27-28`, `:47-48`, `:119-126`; `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-10`; current operation counts and service URLs at `vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json:18-34`, `:49186-49202`; representative current routes at `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`). The earlier 2026-08-12 no-AI-Guard observation remains dated historical context only; it is not a current publication absence, endpoint-retirement, backend-availability, or live-acceptance conclusion. Confidence remains **medium for the rest of the current Help operating model and broader AI Security family** because the remaining article bodies and AI Guardrails remain thin, and Red Teaming tenant entitlement, authentication scopes, live acceptance, and AI Guard interlock remain open; Python also lacks eight operations from the current AI Guard contract, and no Go SDK, Terraform, Ansible, or MCP AI Guard wrapper is established.

The current public Automate operation pages enumerate **114 `ai-security` operations**: **17 read-only AI Security inventory/findings operations** plus 97 AI Red Teaming operations. The 17 inventory operations cover agents, code repositories, data stores, guardrails, identities, issues, MCP servers/tools, and workloads; the operation map and direct citations are maintained in [`./asset-management-api.md`](./asset-management-api.md). The durable 2026-08-12 capture described below records the earlier 108-operation composition (11 inventory plus 97 Red Teaming) and should be read as a baseline. The current public operation pages also publish the 47-operation AI Guard admin set; the current comparison matches all 47 with zero schema-changed operations and records eight colon-action route corrections (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:9-21`, `:27-28`, `:47-48`, `:119-126`; current route examples at `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:4021-4033`). The earlier no-AI-Guard observation is dated historical context only, while the current capture reports no retained publication absences. This publication change does not establish entitlement, runtime acceptance, endpoint retirement, or backend availability; Python still exposes 39 callable AI Guard configuration methods. Representative current pages include [list agents](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/ai-security/aisecurity/v1-assets-agents/agents-list-agents), [list guardrails](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/ai-security/aisecurity/v1-resources-guardrails/guardrails-list-guardrails), and [disable detection policy](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/aiguard/detection-policies/detections-policy-resource-disable-detections-policy).

## September 2, 2026 AI Guard release update

The supplemental release entry records three updates:

- **Proxy-mode conversation view:** multi-turn conversation viewing in the AI
  Guard dashboard, so administrators can inspect a conversation thread instead
  of reviewing each transaction separately (`vendor/zscaler-help/ai-guard-release-update-2026-09-02.md:7-11`).
- **Anthropic webhook connection test:** administrators can test the AI Guard
  webhook connection from the Anthropic console; the entry links to *Managing
  Tenant Settings* (`vendor/zscaler-help/ai-guard-release-update-2026-09-02.md:13-17`).
- **Dashboard enhancements:** the events view adds a **Policy Control Name**
  column identifying the policy control matched by an event, and dashboard
  columns can be resized (`vendor/zscaler-help/ai-guard-release-update-2026-09-02.md:19-23`).

The release date does not establish when the entry first appeared on Help, and
the capture does not establish tenant rollout or API coverage. Keep this
release evidence separate from the **2026-08-04** Apps & Infrastructure body
evidence; the two sources disagree about Proxy-mode conversation viewing
(`vendor/zscaler-help/ai-guard-release-update-2026-09-02.md:25-30`; `vendor/zscaler-help/ai-guard-apps-infrastructure-dashboard.md:4`, `:23-28`).

## Topics

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-access-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

| Topic | File | Status |
|---|---|---|
| Four-pillar framework, AI Guard detector categories, deployment modes (Proxy / DaaS / OnPrem), ZIA proxy-chain integration, Python configuration and legacy policy-detection surfaces, structured AI Red Teaming contract, edge cases | [`./overview.md`](./overview.md) | draft |
| AI Guard runtime enforcement, admin objects, policy control, tenant/provider/app setup, Users vs Apps & Infrastructure dashboard behavior, log exports, and SDK/API surface | [`./ai-guard.md`](./ai-guard.md) | draft |
| AI Guard API and integration divergences — direction literals, `policyId`, detector taxonomy, integration failure posture, Python-to-Automate gaps, documentation drift, and legacy-routing cautions | [`./api-divergences.md`](./api-divergences.md) | draft |
| AI Security Public API — 17 read-only operations for agents, code repositories, data stores, guardrails, identities, issues, MCP servers/tools, and workloads; pagination, schema, and wrapper gaps | [`./asset-management-api.md`](./asset-management-api.md) | draft |
| AI Guard public-source coverage manifest and certification boundary | [`./ai-guard-coverage.md`](./ai-guard-coverage.md) | draft |
| AI Security claims ledger for this Tier 2 refresh | [`./_claims-ledger.md`](./_claims-ledger.md) | draft |

## Why AI Security matters in the suite

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

AI Security is **the suite-spanning offering**, not a standalone product:

- In **Proxy mode**, AI Guard is configured through the captured ZIA proxy-chain integration and can interact with existing ZIA forwarding, decryption, access-control, and DLP posture.
- It is decoupled from the suite entirely in **DaaS mode** (application-layer integration with no traffic detour through Zscaler).
- For broader "Secure Access to AI Apps" questions, route to the ZIA/ZBI references that own category-level access, DLP, SSL inspection, and isolation behavior.

The skill should treat questions about "AI security in the Zscaler stack" as a layered question: AI Guard adds LLM-content inspection when deployed inline or called by the application; it does not replace the existing ZIA/ZBI controls. Use the ZIA/ZBI references as routing targets for those products, not as source evidence for AI Guard-specific behavior.

## When to start here vs elsewhere

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

- **Start here** for: "what is AI Guard?" / "what's the difference between AI Guard and AI Guardrails?" / "what are the AI Security pillars?" / "how does Zscaler protect against prompt injection?"
- **Start in [`../zia/url-filtering.md`](../zia/url-filtering.md)** for: "how does Zscaler block ChatGPT?" — that is a category-level AI app access-control question, not an AI Guard detector question.
- **Start in [`../zia/dlp.md`](../zia/dlp.md)** for: "how does Zscaler stop sensitive data going into LLM prompts?" — use the ZIA DLP reference for existing DLP behavior, then return to AI Guard for LLM detector behavior.
- **Start in [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)** for: "I configured AI Guard inline and it's not catching anything" — check decryption and bypass posture before assuming an AI Guard detector failure.
- **Start in [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)** for: "is AI Security in scope for this skill?" — coverage tier check.

## Coverage gaps (deferred)

Source: `vendor/zscaler-help/ai-guard-what-is.md`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py`; `vendor/zscaler-help/ai-security-marketing.md`; `vendor/zscaler-help/ai-guardrails-marketing.md`.

- Pricing / packaging (which AI Security capabilities bundle into which Zscaler edition).
- Latency / performance numbers for inline mode.
- Custom-detector authoring — fixed-set vs extensible.
- Log export event schema and exact SIEM field mapping. Destinations are captured, but field-level schema is not.
- AI Red Teaming tenant entitlement, authentication scopes, live acceptance, and AI Guard interlock — request and response schemas are captured, but static documentation does not establish whether Red Teaming output configures Guard rules.
- Full Python parity with the current AI Guard Automate contract. Python exposes 39 callable configuration methods, leaving policy enable/disable/referential-check/summaries and four resource referential checks outside its inventory. The current comparison matches all 47 operations with zero schema-changed operations and records eight colon-action route corrections; its 39 loose common method/path signatures are a route-correction comparison artifact, not the Python callable count (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:27-28`, `:47-48`, `:119-126`; current operations at `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:1954-1966`, `:3956-3968`, `:4021-4033`, `:5229-5241`, `:6142-6154`, `:7166-7178`).
- Go SDK, Terraform, MCP, Postman, and Automation Hub coverage for AI Guard admin-plane automation remains absent from the captured client/source classes even though the current reconstructed contract documents that API surface. See [API divergences](./api-divergences.md#automate-admin-plane-contract-vs-client-surfaces).
- Current AI Guard for Users article bodies beyond the two dashboards, custom block messages, user/group synchronization, and overlapping legacy captures: architecture, quick starts, prompt allowlisting, best practices, topology, token usage, audit logs, detection summary, and latency.
- A source-backed mapping between Help's User-mode/application provider labels and the narrower Automate admin-plane provider-type enum. See [clarification ai-security-07](../_meta/clarifications.md#ai-security-07-help-provider-labels-vs-automate-provider-types).
- Gov-cloud availability (likely deferred until commercial cloud GA stabilizes).

These don't block conceptual answers; they limit operational depth.
