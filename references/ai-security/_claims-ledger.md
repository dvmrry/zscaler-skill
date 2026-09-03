---
product: ai-security
topic: "ai-security-claims-ledger"
title: "AI Security claims ledger - Tier 2 first-pass refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: e7f5f7efb56b6e24667f183e5dff3da03e039cc9
  vendor/zguard-ai-integrations: 71cbab024f369eb50748c9c4a74ec0158c084839
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-help/ai-guard-users-help-index.md"
  - "vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md"
  - "vendor/zscaler-help/ai-guard-users-and-user-groups.md"
  - "vendor/zscaler-help/ai-access-security-marketing.md"
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
  - "vendor/zguard-ai-integrations/README.md"
  - "vendor/zguard-ai-integrations/CHANGELOG.md"
  - "vendor/zguard-ai-integrations/docs/ARCHITECTURE.md"
  - "vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md"
  - "vendor/zguard-ai-integrations/AWS/README.md"
  - "vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md"
  - "vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py"
  - "vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/README.md"
  - "vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py"
  - "vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md"
  - "vendor/zguard-ai-integrations/AWS/lambda-decorator/aiguard_decorator.py"
  - "vendor/zguard-ai-integrations/AWS/strands-agents/README.md"
  - "vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py"
  - "vendor/zguard-ai-integrations/OpenAI/README.md"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/aiguard_utils.py"
  - "vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py"
  - "vendor/zguard-ai-integrations/Google/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js"
  - "vendor/zguard-ai-integrations/Google/cloudrun/README.md"
  - "vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py"
  - "vendor/zguard-ai-integrations/Microsoft/README.md"
  - "vendor/zguard-ai-integrations/github-actions/README.md"
  - "vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py"
  - "vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zscaler-api-specs/automate-zscaler/rosetta.md"
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
| The September 1, 2026 zguard integration head adds OpenAI Codex CLI, AWS Bedrock AgentCore/boto3/Lambda/Strands, Google Apigee X, and Google Cloud Run examples. | `ai-guard.md`, `ai-guard-coverage.md`, `overview.md` | `vendor/zguard-ai-integrations/README.md:44-65`; `vendor/zguard-ai-integrations/CHANGELOG.md:3-18` |
| zguard 0.2.0 requires `zscaler-sdk-python>=1.9.44` because earlier SDK releases did not attach the Bearer token to AI Guard policy-detection calls; this parent repository now pins v1.9.44 and satisfies that declared minimum, although the examples have not been live-tested here. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `overview.md` | `vendor/zguard-ai-integrations/CHANGELOG.md:3-9`; current parent pin `vendor/zscaler-sdk-python/pyproject.toml:1-4` |
| The zguard root README's fail-closed table is qualified by audit-only Windsurf/Cline post-hooks, the Codex `Stop` hook, and passthrough for unknown gateway traffic unless `failClosedOnUnknown` is enabled; Codex `Stop` errors fail open after the response has streamed. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `overview.md` | `vendor/zguard-ai-integrations/README.md:256-293`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:186-191`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py:47-81` |
| Integration timing is host-specific: AgentCore scans tool input before execution and tool output before model re-entry; Lambda sees only handler-boundary prompt/response and raises for asynchronous sources; Strands retries response blocks but replaces tool output only after execution; Codex post-tool/Stop hooks run after side effects or streaming. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md:1-18`, `:50-82`, `:108-118`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md:49-87`; `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py:655-743`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:9-24` |
| The Strands README configuration block is invalid Python because it contains two bare `policy_id=` assignments. | `api-divergences.md`, `ai-guard-coverage.md` | `vendor/zguard-ai-integrations/AWS/strands-agents/README.md:132-149` |
| The agentic guide conflicts with the architecture direction table and AgentCore leg mapping by labeling Agent→LLM prompts `OUT`, scanning `llm_prompt` with `direction="OUT"`, and returning generated output without a final response scan in its example. | `api-divergences.md`, `ai-guard-coverage.md` | `vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md:157-171`, `:205-262`, `:305-310`; `vendor/zguard-ai-integrations/docs/ARCHITECTURE.md:318-338`; `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py:238-269` |
| Static Bedrock response extraction discards the opaque-content flag and only applies `on_unscannable` when no text is extracted, leaving a possible mixed text-plus-opaque response gap; no runtime model matrix has verified the result. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:358-389`, `:671-731` |
| The Apigee SharedFlow MCP extractor copies only `result.content[*].text` into the tool-event output, omitting non-text result members despite the README's general MCP `OUT` claim. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md:19-22`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js:68-101` |
| AgentCore, Bedrock, Lambda, Strands, and Codex policy helpers turn malformed/non-numeric `AIGUARD_POLICY_ID` values into `None`, silently selecting auto-resolution; this differs from the root stale-ID/no-verdict warning and is a static configuration inconsistency. | `ai-guard.md`, `api-divergences.md` | `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py:202-216`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:456-470`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/aiguard_decorator.py:285-299`; `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py:180-194`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/aiguard_utils.py:155-168` |
| Cloud Run documentation separates pipeline configuration from the `provision_org.py` helper that creates the Apigee organization/runtime/environment/group/attachments; the source supports a two-stage workflow and the wording needs that distinction. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `overview.md` | `vendor/zguard-ai-integrations/Google/cloudrun/README.md:51-73`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py:98-154` |
| Python SDK 1.9.39 moved the package to `zscaler/aiguard`; `client.aiguard` is canonical, `client.zguard` is a deprecated alias, and `LegacyAIGuardClient` replaces the removed `LegacyZGuardClient` name as the policy-detection entry point. The surface remains present in current v1.9.44. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `terminology.md` | `vendor/zscaler-sdk-python/CHANGELOG.md:141-206`; current version at `vendor/zscaler-sdk-python/pyproject.toml:3`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385`, `:671-712`; `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:17-31` |
| `client.aiguard` exposes six OneAPI configuration resources with 39 callable methods: six policy, six match-rule, eight provider/provider-type, six provider-credential, six application, and seven application-credential methods. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `index.md`, `overview.md`, `portfolio-map.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357`; `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412` |
| The Python SDK README lists Zscaler AI Guard API in the OneAPI-supported product list. | `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/README.md:256-273` |
| The SDK policy-detection methods send `content`, `direction`, optional `transactionId`, and optional `policyId` for explicit execution; docstrings describe direction as `IN` or `OUT`. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:57-71`, `:97-106`, `:138-150`, `:175-181` |
| The captured DAS Help page uses `https://api.zseclipse.net` for AI Guard runtime policy detection, while the legacy Python client and public integration examples still construct regional `api.<cloud>.zseclipse.net` hosts unless an override URL is supplied. Static sources do not resolve which host forms the live API accepts or prefers. | `ai-guard.md`, `api-divergences.md`, `clarifications.md` | `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:50`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:100`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:158`, `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:58`, `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:75`, `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:78`, `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:81`, `vendor/zguard-ai-integrations/Microsoft/README.md:519`, `vendor/zguard-ai-integrations/github-actions/README.md:66`, `vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py:38-42` |
| The DAS Help example uses `request` and `response` strings, not `IN` and `OUT`, so accepted direction aliases are not resolved by static sources alone. | `api-divergences.md`, `clarifications.md` | `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:80`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:196`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:200`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:204`, `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:208` |
| The Python SDK marks `policy_id` optional for `execute_policy`, while the DAS Help page states `policyId` is required for that option. | `api-divergences.md`, `clarifications.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:57-63`, `:102-103`; `vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:78` |
| AI Guard response models expose per-detector responses and throttling details, including `retryAfterMillis`. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:70`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:119`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:133`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:135`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:216`, `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:225` |
| The OneAPI models map policy, match-rule, provider-credential, application, and application-credential Python attributes to their camelCase wire keys. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/models/policies.py:37-204`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_match_rules.py:37-162`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_provider_credentials.py:37-97`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_applications.py:37-105`; `vendor/zscaler-sdk-python/zscaler/aiguard/models/llm_application_credentials.py:37-68` |
| Integration failure posture is host-specific: Windsurf pre-hooks allow a missing API key but fail closed on API errors; current Claude Code file-read hooks block missing keys, API errors, verdict-less responses, and exceptions while intentionally allowing non-sensitive paths and unreadable files; n8n documents fail-closed behavior only for its "Continue On Fail" path. | `ai-guard.md`, `api-divergences.md` | `vendor/zguard-ai-integrations/Windsurf/README.md:17-19`; `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py:151-183`, `:236-239`; `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read_README.md:281-299`; `vendor/zguard-ai-integrations/CHANGELOG.md:35-46`; `vendor/zguard-ai-integrations/n8n/README.md:96` |
| The last-known Automate snapshot contains 47 AI Guard operations across 29 paths; Python wraps 39, while the inspected Go SDK, Terraform, MCP, Postman, and Automation Hub surfaces still do not wrap that admin plane. The current public route table publishes no AI Guard operations, so the snapshot is retained and no endpoint-retirement or backend-availability conclusion follows from the publication absence. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `index.md`, `overview.md`, `portfolio-map.md` | `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:19-23`; `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160`; Python method inventories cited above; `CLIENT-WRAPPER GAP -> references/ai-security/api-divergences.md#automate-admin-plane-contract-vs-client-surfaces` |
| Eight Automate-documented operations remain outside the callable Python inventory in current v1.9.44 (the configuration surface was introduced in 1.9.39): policy enable, disable, referential check, and summaries, plus referential checks for providers, provider credentials, applications, and application credentials. | `ai-guard.md`, `ai-guard-coverage.md`, `api-divergences.md`, `index.md` | Python method inventories cited above; current version at `vendor/zscaler-sdk-python/pyproject.toml:3`; `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:1954-1966`, `:3956-3968`, `:5229-5241`, `:6142-6154`, `:7166-7178` |
| The four resource referential-check methods are commented out after an SDK-maintainer observation of HTTP 404 responses. This is an open live-acceptance discrepancy, not proof that the backend universally lacks the documented operations. | `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`; Automate referential-check entries cited above |
| The SDK changelog claims full OneAPI support and lists the four referential checks, and the README also presents referential checks as available for three resources, but the corresponding methods are commented out in code. | `ai-guard-coverage.md`, `api-divergences.md` | `vendor/zscaler-sdk-python/CHANGELOG.md:141-192`; `vendor/zscaler-sdk-python/README.md:1445-1452`; commented method ranges cited above |
| Python SDK v1.9.44 routes AI Guard policy detection through the legacy helper that applies the Bearer credential, closing the dispatch mismatch; throttling still looks for `zguard_legacy_client` while the executor stores `aiguard_legacy_client`. | `api-divergences.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_http_client.py:319-337`; `vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:333-386`; `vendor/zscaler-sdk-python/zscaler/request_executor.py:38-75`, `:101-107`, `:357-368`; fix recorded in `vendor/zscaler-sdk-python/CHANGELOG.md:3-11` |
| The retained last-known Automate contract includes list/get provider-type discovery, with 23 allowed type identifiers and per-mode server acceptance, map-key, and allowed-value guidance. | `ai-guard.md`, `api-divergences.md` | `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7486-7703`, `:7720-7903` |
| The retained July contract publishes enable/disable, referential-check, and regenerate actions as slash-delimited subpaths. Current public-route absence does not invalidate or revalidate those last-known paths. | `api-divergences.md`, `clarifications.md` | `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:4021-4033`; publication state at `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160` |
| The retained LLM Application create/update/read schemas omit `defaultPolicyId` and application-level customer-managed-key fields; this is a last-known contract boundary, not proof of backend field removal. | `api-divergences.md` | `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:4464-4712`, `:4768-5073`, `:5294-5542` |
| The current public `/secure-ai-users` tree contains 25 AI Guard for Users articles: six Getting Started, eight Configuration, two Best Practices, seven Monitoring, and two Troubleshooting entries. Its index and two newly listed article bodies are captured, while several other bodies remain unmined. | `index.md`, `overview.md`, `ai-guard.md`, `ai-guard-coverage.md` | `vendor/zscaler-help/ai-guard-users-help-index.md:1-48`; `ARTICLE-BODY GAP -> references/ai-security/ai-guard-coverage.md#help-article-coverage` |
| The former `/ai-guard` Help root returned a maintenance status in the current capture while `/secure-ai-users` returned the live tree. This is Help-route drift, not evidence about product entitlement or availability. | `ai-guard-coverage.md` | `vendor/zscaler-help/ai-guard-users-help-index.md:50-55` |
| User- and user-group-scoped AI Guard policy evaluation requires a linked ZIA tenant; AI Guard can synchronize ZIA users, groups, and domains, expose imported users/groups in AI Users, and use Policy Control to apply policy to them. | `ai-guard.md`, `ai-guard-coverage.md` | `vendor/zscaler-help/ai-guard-users-and-user-groups.md:8-24` |
| Administrators can define prompt and response block messages and optionally delete conversation history when a response is blocked. AI Guard sends the configured message to the LLM, which can treat the instruction as malicious, refuse it, or return an unexpected response. | `ai-guard.md`, `ai-guard-coverage.md` | `vendor/zscaler-help/ai-guard-configuring-custom-block-messages.md:8-24` |
| The current AI Access Security marketing page positions the product across public generative-AI applications, embedded SaaS AI, agents, and developer tools, with discovery, prompt/response insight, access controls, inline DLP, moderation, and AI-IDE controls. Publication establishes positioning, not GA or rollout stage, tenant entitlement or enablement, API/schema parity, or cloud availability. | `index.md`, `overview.md` | `vendor/zscaler-help/ai-access-security-marketing.md:8-24`, `:28-31` |
| The 2026 Help chronology documents tenant restriction, M365 Copilot streaming inspection, prompt allowlisting, custom RBAC, ADX/Splunk export, Codex support, and default-provider auto-provisioning. | `ai-guard.md`, `ai-guard-coverage.md` | `vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:9-55` |
| The current Automate snapshot exposes 11 read-only AI Security asset/findings operations for data stores, identities, issues, MCP servers/tools, and workloads under `/aisecurity/aispm`; they are the asset subset of a combined 108-operation `ai-security` publication. | `overview.md`, `index.md`, `asset-management-api.md` | `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-20`; service URLs at `vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json:42816-42826`; asset operation ranges at `vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:20833-23511` |
| The current Automate snapshot adds 97 structured AI Red Teaming operations under `/aisecurity/airt/api/v2`; request bodies, response schemas, response statuses, and examples are captured where published. Tenant entitlement, authentication scopes, live acceptance, and the AI Guard interlock remain unverified. | `overview.md`, `index.md` | Addition count and inventory at `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:49`, `:69-165`; representative create operation at `vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:2-701`; service URLs at `vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json:42816-42826`; `OPEN QUESTION -> references/ai-security/overview.md#open-questions` |
| The 11 asset operations retained their HTTP methods and paths but all received route-key renames; seven also show schema drift, including identity-list `id` removal and MCP-server `path` removal plus sanction/type metadata changes. | `asset-management-api.md` | `vendor/zscaler-api-specs/automate-zscaler/rosetta.md:40-58`; `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:177-193` |
