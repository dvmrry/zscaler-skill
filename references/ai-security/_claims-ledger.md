---
product: ai-security
topic: "ai-security-claims-ledger"
title: "AI Security claims ledger - Tier 2 first-pass refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/zguard-ai-integrations: 7da6ed977fb3987203001dc78e9146e507cb1407
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-help/ai-guard-users-help-index.md"
  - "vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md"
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/pyproject.toml"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_http_client.py"
  - "vendor/zscaler-sdk-python/zscaler/request_executor.py"
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
  - "vendor/zguard-ai-integrations/Windsurf/README.md"
  - "vendor/zguard-ai-integrations/n8n/README.md"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/README.md"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-skill/README.md"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md"
  - "vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
author-status: draft
---

# AI Security claims ledger

This ledger covers the AI Guard claims changed or explicitly guarded in the Tier 2 first-pass AI Security refresh. It is claims-led: rows either point to exact source lines or mark the item as an open question.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| AI Guard provides runtime protection for AI applications by enforcing policies on prompts and responses, including prompt injection, jailbreak, sensitive-data leakage, toxicity, and other AI-specific categories. | `ai-guard.md`, `overview.md` | `vendor/zscaler-help/ai-guard-what-is.md:8`, `vendor/zscaler-help/ai-guard-what-is.md:10`, `vendor/zscaler-help/ai-guard-what-is.md:12`, `vendor/zscaler-help/ai-guard-what-is.md:22` |
| The public Help capability list includes 15 named categories in the captured source, with Prompt Injection and Jailbreak presented as a combined capability. | `overview.md`, `api-divergences.md` | `vendor/zscaler-help/ai-guard-what-is.md:18`, `:20`, `:22`, `:24`, `:26`, `:28`, `:30`, `:32`, `:34`, `:36`, `:38`, `:40`, `:42`, `:44`, `:46` |
| The richer integration detector catalog is direction-specific and says prompt detectors use `IN` while response detectors use `OUT`. | `api-divergences.md` | `vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md:7`, `vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md:146`, `vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md:314` |
| Python SDK 1.9.39 moved the package to `zscaler/aiguard`; `client.aiguard` is canonical, `client.zguard` is a deprecated alias, and `LegacyAIGuardClient` replaces the removed `LegacyZGuardClient` name as the policy-detection entry point. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `terminology.md` | `vendor/zscaler-sdk-python/pyproject.toml:3`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385`, `:671-712`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:17-31` |
| `client.aiguard` exposes six OneAPI configuration resources with 39 callable methods: six policy, six match-rule, eight provider/provider-type, six provider-credential, six application, and seven application-credential methods. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `index.md`, `overview.md`, `portfolio-map.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412` |
| The Python SDK README lists Zscaler AI Guard API in the OneAPI-supported product list. | `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/README.md:256-273` |
| The SDK policy-detection methods send `content`, `direction`, optional `transactionId`, and optional `policyId` for explicit execution; docstrings describe direction as `IN` or `OUT`. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:57-71`, `:97-106`, `:138-150`, `:175-181` |
| The captured DAS Help page uses `https://api.zseclipse.net` for AI Guard runtime policy detection, while the legacy Python client and public integration examples still construct regional `api.<cloud>.zseclipse.net` hosts unless an override URL is supplied. Static sources do not resolve which host forms the live API accepts or prefers. | `ai-guard.md`, `api-divergences.md`, `clarifications.md` | `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:50`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:100`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:158`, `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:58`, `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:75`, `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:78`, `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:81`, `vendor/zguard-ai-integrations/Microsoft/README.md:519`, `vendor/zguard-ai-integrations/github-actions/README.md:66`, `vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py:38-42` |
| The DAS Help example uses `request` and `response` strings, not `IN` and `OUT`, so accepted direction aliases are not resolved by static sources alone. | `api-divergences.md`, `clarifications.md` | `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:80`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:196`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:200`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:204`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:208` |
| The Python SDK marks `policy_id` optional for `execute_policy`, while the DAS Help page states `policyId` is required for that option. | `api-divergences.md`, `clarifications.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:57-63`, `:102-103`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:78` |
| AI Guard response models expose per-detector responses and throttling details, including `retryAfterMillis`. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:70`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:119`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:133`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:135`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:216`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:225` |
| The OneAPI models map policy, match-rule, provider-credential, application, and application-credential Python attributes to their camelCase wire keys. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/models/policies.py:37-204`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_match_rules.py:37-162`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_provider_credentials.py:37-97`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_applications.py:37-105`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_application_credentials.py:37-68` |
| Integration failure posture is host-specific: Windsurf pre-hooks fail open on missing API key but fail closed on API errors, Claude Code file-read hooks fail open on missing key/API errors/exceptions, and n8n documents fail-closed behavior only for its "Continue On Fail" path. | `ai-guard.md`, `api-divergences.md` | `vendor/zguard-ai-integrations/Windsurf/README.md:17`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/README.md:377`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/README.md:379`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py:148`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py:165`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py:224`, `vendor/zguard-ai-integrations/n8n/README.md:96` |
| The current Automate snapshot validates 47 AI Guard operations across 29 paths with zero structural issues; Python wraps 39, while the inspected Go SDK, Terraform, MCP, Postman, and Automation Hub surfaces still do not wrap that admin plane. | `ai-guard-coverage.md`, `api-divergences.md`, `index.md`, `overview.md`, `portfolio-map.md` | `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-10`; `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:21-24`, `:40-43`; Python method inventories cited above; `CLIENT-WRAPPER GAP -> references/ai-security/api-divergences.md#automate-admin-plane-contract-vs-client-surfaces` |
| Eight Automate-documented operations are not callable in Python 1.9.39: policy enable, disable, referential check, and summaries, plus referential checks for providers, provider credentials, applications, and application credentials. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `index.md` | Python method inventories cited above; `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:1954-1966`, `:3956-3968`, `:5229-5241`, `:6142-6154`, `:7166-7178` |
| The four resource referential-check methods are commented out after an SDK-maintainer observation of HTTP 404 responses. This is an open live-acceptance discrepancy, not proof that the backend universally lacks the documented operations. | `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`; Automate referential-check entries cited above |
| The SDK changelog claims full OneAPI support and lists the four referential checks, and the README also presents referential checks as available for three resources, but the corresponding methods are commented out in code. | `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/CHANGELOG.md:112-163`; `vendor/zscaler-sdk-python/README.md:1445-1452`; commented method ranges cited above |
| Static inspection raises two legacy-runtime regression cautions that require live testing: the API-key helper contains Bearer injection while the generic dispatch path uses the standard session and suppresses OAuth for legacy clients, and throttling code looks for `zguard_legacy_client` while the executor stores `aiguard_legacy_client`. | `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:333-404`; `vendor/zscaler-sdk-python/zscaler/oneapi_http_client.py:318-325`; `vendor/zscaler-sdk-python/zscaler/request_executor.py:38-75`, `:101-107`, `:357-368`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:124-131`, `:199-204` |
| The Automate contract adds list/get provider-type discovery, with 23 allowed type identifiers and per-mode server acceptance, map-key, and allowed-value guidance. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7486-7703`, `:7720-7903` |
| The July contract publishes enable/disable, referential-check, and regenerate actions as slash-delimited subpaths and validates AI Guard with zero structural path issues. | `api-divergences.md`, `clarifications.md` | `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:4021-4033`; `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10` |
| The current LLM Application contract omits prior `defaultPolicyId` and application-level customer-managed-key fields; this is published-schema drift, not proof of backend field removal. | `api-divergences.md` | `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:135-148` |
| The current Help tree contains 24 AI Guard for Users articles; its index is captured, but several newly listed article bodies are not yet mined. | `index.md`, `ai-guard.md`, `ai-guard-coverage.md` | `vendor/zscaler-help/ai-guard-users-help-index.md:8-47`; `ARTICLE-BODY GAP -> references/ai-security/ai-guard-coverage.md#help-article-coverage` |
| The 2026 Help chronology documents tenant restriction, M365 Copilot streaming inspection, prompt allowlisting, custom RBAC, ADX/Splunk export, Codex support, and default-provider auto-provisioning. | `ai-guard.md`, `ai-guard-coverage.md` | `vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:9-55` |
| The current Automate snapshot separately exposes 11 read-only AI Security asset/findings operations for data stores, identities, issues, MCP servers/tools, and workloads under `/aisecurity/aispm`. | `overview.md`, `index.md`, `asset-management-api.md` | `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:8`; `vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:2-14`, `:443-455`, `:841-853`, `:1432-1444`, `:1678-1690`, `:1891-1903`, `:2260-2272` |
| The current Postman snapshot exposes 97 AI Red Teaming request definitions across 14 families under `/aisecurity/airt/api/v2`, but supplies no saved response examples; response schemas, tenant entitlement, live acceptance, and the AI Guard interlock remain unverified. | `overview.md`, `index.md` | `vendor/zscaler-api-specs/oneapi-postman-collection.json:139453-143529`, `:144273-144274`; `OPEN QUESTION -> references/ai-security/overview.md#open-questions` |
