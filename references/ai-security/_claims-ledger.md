---
product: ai-security
topic: "ai-security-claims-ledger"
title: "AI Security claims ledger - Tier 2 first-pass refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 4371c9bab44d852526721b4b5999e2471dda5198
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/zguard-ai-integrations: 7da6ed977fb3987203001dc78e9146e507cb1407
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/zaiguard_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py"
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
author-status: draft
---

# AI Security claims ledger

This ledger covers the AI Guard claims changed or explicitly guarded in the Tier 2 first-pass AI Security refresh. It is claims-led: rows either point to exact source lines or mark the item as an open question.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| AI Guard provides runtime protection for AI applications by enforcing policies on prompts and responses, including prompt injection, jailbreak, sensitive-data leakage, toxicity, and other AI-specific categories. | `ai-guard.md`, `overview.md` | `vendor/zscaler-help/ai-guard-what-is.md:8`, `vendor/zscaler-help/ai-guard-what-is.md:10`, `vendor/zscaler-help/ai-guard-what-is.md:12`, `vendor/zscaler-help/ai-guard-what-is.md:22` |
| The public Help capability list includes 15 named categories in the captured source, with Prompt Injection and Jailbreak presented as a combined capability. | `overview.md`, `api-divergences.md` | `vendor/zscaler-help/ai-guard-what-is.md:18`, `:20`, `:22`, `:24`, `:26`, `:28`, `:30`, `:32`, `:34`, `:36`, `:38`, `:40`, `:42`, `:44`, `:46` |
| The richer integration detector catalog is direction-specific and says prompt detectors use `IN` while response detectors use `OUT`. | `api-divergences.md` | `vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md:7`, `vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md:146`, `vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md:314` |
| The Python SDK exposes AI Guard under `client.zguard.policy_detection`; the service wrapper only exposes the policy-detection interface. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:345-350`; `vendor/zscaler-sdk-python/zscaler/zaiguard/zaiguard_service.py:21-33` |
| The Python SDK README lists Zscaler AI Guard API in the OneAPI-supported product list. | `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/README.md:256-273` |
| The SDK policy-detection methods send `content`, `direction`, optional `transactionId`, and optional `policyId` for explicit execution; docstrings describe direction as `IN` or `OUT`. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:51`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:79`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:84`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:87`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:131`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:157`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:162` |
| The captured DAS Help page uses `https://api.zseclipse.net` for AI Guard runtime policy detection, while the legacy Python client and public integration examples still construct regional `api.<cloud>.zseclipse.net` hosts unless an override URL is supplied. Static sources do not resolve which host forms the live API accepts or prefers. | `ai-guard.md`, `api-divergences.md`, `clarifications.md` | `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:50`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:100`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:158`, `vendor/zscaler-sdk-python/zscaler/zaiguard/legacy.py:58`, `vendor/zscaler-sdk-python/zscaler/zaiguard/legacy.py:75`, `vendor/zscaler-sdk-python/zscaler/zaiguard/legacy.py:78`, `vendor/zscaler-sdk-python/zscaler/zaiguard/legacy.py:81`, `vendor/zguard-ai-integrations/Microsoft/README.md:519`, `vendor/zguard-ai-integrations/github-actions/README.md:66`, `vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py:38-42` |
| The DAS Help example uses `request` and `response` strings, not `IN` and `OUT`, so accepted direction aliases are not resolved by static sources alone. | `api-divergences.md`, `clarifications.md` | `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:80`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:196`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:200`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:204`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:208` |
| The Python SDK marks `policy_id` optional for `execute_policy`, while the DAS Help page states `policyId` is required for that option. | `api-divergences.md`, `clarifications.md` | `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:43`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:84`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:78` |
| AI Guard response models expose per-detector responses and throttling details, including `retryAfterMillis`. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py:70`, `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py:119`, `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py:133`, `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py:135`, `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py:216`, `vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py:225` |
| Integration failure posture is host-specific: Windsurf pre-hooks fail open on missing API key but fail closed on API errors, Claude Code file-read hooks fail open on missing key/API errors/exceptions, and n8n documents fail-closed behavior only for its "Continue On Fail" path. | `ai-guard.md`, `api-divergences.md` | `vendor/zguard-ai-integrations/Windsurf/README.md:17`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/README.md:377`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/README.md:379`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py:148`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py:165`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py:224`, `vendor/zguard-ai-integrations/n8n/README.md:96` |
| The reconstructed Automate snapshot exposes a documented AI Guard admin-plane contract, while the inspected Go SDK, Terraform, MCP, Postman, and Automation Hub client/source classes still do not wrap that admin plane. | `ai-guard-coverage.md`, `api-divergences.md`, `clarifications.md` | `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:9`; `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:1`; `CLIENT-WRAPPER GAP -> references/ai-security/api-divergences.md#automate-admin-plane-contract-vs-client-surfaces` |
| The current Automate snapshot separately exposes 11 read-only AI Security asset/findings operations for data stores, identities, issues, MCP servers/tools, and workloads under `/aisecurity/aispm`. | `overview.md`, `index.md`, `asset-management-api.md` | `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:8`; `vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:2-14`, `:443-455`, `:841-853`, `:1432-1444`, `:1678-1690`, `:1891-1903`, `:2260-2272` |
