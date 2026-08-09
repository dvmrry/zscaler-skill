---
product: ai-security
topic: "ai-guard-api-divergences"
title: "AI Guard API and integration divergences"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
  vendor/zguard-ai-integrations: 7da6ed977fb3987203001dc78e9146e507cb1407
confidence: medium
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
  - "vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policies.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py"
  - "vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py"
  - "vendor/zguard-ai-integrations/Microsoft/README.md"
  - "vendor/zguard-ai-integrations/github-actions/README.md"
  - "vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py"
  - "vendor/zguard-ai-integrations/Windsurf/README.md"
  - "vendor/zguard-ai-integrations/n8n/README.md"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/README.md"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-skill/README.md"
  - "vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md"
  - "vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json"
  - "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md"
  - "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md"
  - "vendor/zscaler-sdk-go/"
  - "vendor/terraform-provider-zia/"
  - "vendor/terraform-provider-zpa/"
  - "vendor/terraform-provider-ztc/"
  - "vendor/zscaler-mcp-server/"
  - "vendor/zscaler-terraform-skills/"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-help/dlp-incidents-workflow-automation-api.md"
  - "vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md"
  - "vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md"
  - "vendor/zscaler-help/understanding-workflows-workflow-automation.md"
  - "vendor/zscaler-help/what-workflow-automation.md"
author-status: draft
---

# AI Guard API and integration divergences

This page records the differences between public Help, the Python SDK, the reconstructed Automate contract, and the public integration examples. Use it when a question depends on exact request shape, detector taxonomy, or failure posture rather than on product-level positioning.

## Runtime API surface

The Python SDK README lists **Zscaler AI Guard API** in the OneAPI-supported product list (`vendor/zscaler-sdk-python/README.md:256-273`). In SDK 1.9.39, the package moved to `zscaler.aiguard`; `client.aiguard` is canonical and `client.zguard` is a deprecated alias (`vendor/zscaler-sdk-python/pyproject.toml:1-4`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385`). The current legacy client class is `LegacyAIGuardClient`; the prior `LegacyZGuardClient` entry-point name is removed (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:671-712`). `ZscalerClient` exposes six OneAPI configuration resources, while `LegacyAIGuardClient(...).aiguard.policy_detection` remains the separate runtime route (`vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:671-712`). This is Python-client routing; it is not evidence that the backend universally requires these exact authentication paths.

The legacy runtime methods are:

| Method | Endpoint | Notes |
|---|---|---|
| `execute_policy(content, direction, policy_id=None, transaction_id=None)` | `/v1/detection/execute-policy` | Explicit policy execution. SDK marks `policy_id` optional, but Help says `policyId` is required for the explicit option. |
| `resolve_and_execute_policy(content, direction, transaction_id=None)` | `/v1/detection/resolve-and-execute-policy` | Automatic policy resolution for the API key/application association. |

The SDK body sends `content` and `direction`, adds `policyId` only when provided, and adds `transactionId` only when provided (`vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:97-106`, `:175-181`). The response model includes top-level action, severity, direction, detector responses, and throttling details with `retryAfterMillis` (`vendor/zscaler-sdk-python/zscaler/aiguard/models/policy_detection.py:208-227`, `:133-149`).

## Runtime endpoint host divergence

The captured DAS Help page uses the global host `https://api.zseclipse.net` for both explicit policy execution and policy resolution (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:50`, `:100`, `:158`). The Python legacy AI Guard client still defaults to `https://api.us1.zseclipse.net`, accepts `AIGUARD_CLOUD`, and constructs `https://api.<cloud>.zseclipse.net` unless `AIGUARD_OVERRIDE_URL` / `override_url` is supplied (`vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:58`, `:75`, `:78`, `:81`). Public integration examples also still describe region-derived hosts such as `https://api.{cloud}.zseclipse.net` (`vendor/zguard-ai-integrations/Microsoft/README.md:519`; `vendor/zguard-ai-integrations/github-actions/README.md:66`; `vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py:38-42`).

An open upstream integration-doc issue reports the same likely direction: `api.{cloud}.zseclipse.net` no longer working for policy resolution and `https://api.zseclipse.net` working instead ([zguard-ai-integrations#10](https://github.com/zscaler/zguard-ai-integrations/issues/10)). Treat this as corroborating issue-report context, not as a runtime acceptance result: static sources do not prove whether global and regional hosts both work, whether one is preferred, or whether the regional examples are stale. Use the Help-global host when following the current Help page, but use SDK/integration override knobs when an implementation needs to pin the host. See [clarification ai-security-06](../_meta/clarifications.md#ai-security-06-ai-guard-das-endpoint-host-selection).

## Direction value divergence

For SDK calls and integration examples, use `IN` for prompt/request-side scanning and `OUT` for response/output-side scanning. The SDK docstrings define `direction` as `IN` or `OUT` (`vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:67-71`, `:147-150`), and the n8n integration documents the same request body shape (`vendor/zguard-ai-integrations/n8n/README.md:91`, `vendor/zguard-ai-integrations/n8n/README.md:95`).

The DAS Help page is inconsistent with that literal set: its prose says direction should identify outbound prompt vs inbound response, and examples pass `"request"` and `"response"` (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:80`, `:196`, `:200`, `:204`, `:208`). Treat `request`/`response` as unresolved Help-example literals until a live API check confirms whether they are accepted aliases. See [clarification ai-security-01](../_meta/clarifications.md#ai-security-01-ai-guard-direction-literal-aliases).

## `policyId` requirement divergence

The DAS Help page states `policyId` is required for the explicit-policy option (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:78`). The Python SDK signature marks `policy_id` optional and only emits `policyId` if a caller supplies it (`vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:57-63`, `:102-103`). Until a live API check resolves this, prefer `resolve_and_execute_policy` when there is no explicit policy ID and require an explicit policy ID when calling `execute_policy`. See [clarification ai-security-02](../_meta/clarifications.md#ai-security-02-ai-guard-execute-policy-without-policyid).

## Detector taxonomy divergence

Use the Help article as the canonical public capability list for product summaries. It presents 15 named AI Guard capability categories in the capture, including the combined **Prompt Injection & Jailbreak Protection** category and **Visibility & Access Control** (`vendor/zscaler-help/ai-guard-what-is.md:18`, `:20`, `:22`, `:24`, `:26`, `:28`, `:30`, `:32`, `:34`, `:36`, `:38`, `:40`, `:42`, `:44`, `:46`).

The public integration skill carries a richer direction-specific detector reference: it says there are 19 prompt detectors and 21 response detectors, with prompt detectors under `Direction: IN` and response detectors under `Direction: OUT` (`vendor/zguard-ai-integrations/Anthropic/claude-code-skill/README.md:21`, `vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md:7`, `vendor/zguard-ai-integrations/Anthropic/claude-code-skill/references/threat-categories.md:146`). Treat that reference as integration taxonomy unless a future Help capture confirms the same count and names in the product console. See [clarification ai-security-03](../_meta/clarifications.md#ai-security-03-ai-guard-detector-taxonomy-source-of-truth).

## Integration failure posture is not uniform

Do not generalize fail-open or fail-closed behavior across integrations:

- Windsurf pre-hooks allow traffic when `AIGUARD_API_KEY` is missing, but fail closed on API errors or unexpected responses; post-hooks cannot block and only log or alert (`vendor/zguard-ai-integrations/Windsurf/README.md:17`, `vendor/zguard-ai-integrations/Windsurf/README.md:19`).
- Claude Code file-read hooks are explicitly fail-open to avoid blocking Claude Code when AI Guard is unavailable (`vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/README.md:377`, `vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/README.md:379`). The hook code allows file reads when the API key is missing, when the API call returns an error, or when an exception occurs (`vendor/zguard-ai-integrations/Anthropic/claude-code-aiguard/hooks/scan_file_read.py:148`, `:165`, `:224`).
- n8n documents fail-closed behavior only for internal errors when its "Continue On Fail" path is enabled (`vendor/zguard-ai-integrations/n8n/README.md:96`).

## Automate admin-plane contract vs client surfaces

Source: `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json`; `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md`; `vendor/zscaler-sdk-go`; `vendor/terraform-provider-zia`; `vendor/terraform-provider-zpa`; `vendor/terraform-provider-ztc`; `vendor/zscaler-mcp-server`; `vendor/zscaler-terraform-skills`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

The reconstructed Automate snapshot exposes **47 AI Guard operations across 29 paths with zero structural issues** (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-10`). The live-snapshot comparison records 47 operations, 45 route-key matches, two added operations, and eight route changes (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:21-24`, `:40-43`). This resolves the earlier audit-scoped absence of a documented AI Guard admin-plane API.

Python SDK 1.9.39 exposes six configuration resources and 39 callable methods:

| Resource | Count | Source |
|---|---:|---|
| Policies | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357` |
| Policy match rules | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338` |
| LLM providers and provider types | 8 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457` |
| LLM provider credentials | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362` |
| LLM applications | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363` |
| LLM application credentials, including regenerate | 7 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412` |

Two read-only provider-type discovery operations are new in this capture:

| Method | Path | Contract result |
|---|---|---|
| `GET` | `/v1/llm-provider-types` | All supported provider types with server guidance. |
| `GET` | `/v1/llm-provider-types/{type}` | One provider type selected by a constrained `type` path parameter. |

The single-type operation constrains `type` to 23 captured identifiers, from `openai`, `anthropic`, and `azure` through Bedrock, Gemini, Copilot, MaxAI, OpenCode, Perplexity, Vertex, and `xai` variants (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7486-7533`). Its response returns `type`, `name`, `description`, and public/private `servers` guidance. Each deployment-mode entry says whether servers are accepted, which map key to use, and any fixed allowed values (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7538-7703`). Use these discovery operations before constructing an LLM provider rather than hard-coding a provider-to-server map.

Do not conflate that contract with the newly captured **AI Security Public API**, which is a separate 11-operation read-only inventory/findings surface for data stores, identities, MCP servers/tools, workloads, and issues. See [`./asset-management-api.md`](./asset-management-api.md).

That does **not** mean the client surfaces have full parity. Python wraps 39 of the 47 Automate operations; the same pass still found no matching Go SDK service, Terraform resource, MCP tool, Postman endpoint, or Automation Hub procedure in the inspected client/source classes. Treat the Automate contract as the documented method/path/field surface and each client inventory as its own coverage boundary. Do not infer tenant entitlement or live endpoint acceptance from either inventory. See [clarification ai-security-04](../_meta/clarifications.md#ai-security-04-ai-guard-admin-plane-programmability) for the broader wrapper boundary and [clarification ai-security-08](../_meta/clarifications.md#ai-security-08-python-sdk-ai-guard-admin-operation-gap) for the Python gap.

The July 20 capture resolves the earlier adjacent-template encoding defect in the published contract. Enable/disable are now `/v1/detections/policies/{id}/enable` and `/v1/detections/policies/{id}/disable`, referential checks use `/{id}/referential-check`, and credential rotation uses `/{id}/regenerate` (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:4021-4033`). Structural validation now reports zero AI Guard path issues (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`). The previous `ai-security-05` clarification is closed for the documented Automate contract; live authorization and tenant acceptance remain separate concerns.

### Python SDK coverage gap

Eight Automate-documented operations are not callable in the Python inventory: policy enable, disable, referential check, and summaries, plus referential checks for providers, provider credentials, applications, and application credentials (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:1954-1966`, `:3956-3968`, `:5229-5241`, `:6142-6154`, `:7166-7178`; Python inventories above). The application-credential regenerate action is callable in Python (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:290-333`) and remains documented by Automate (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:4021-4033`).

The four resource referential-check implementations are commented out with notes that an SDK maintainer observed HTTP 404 responses even with Postman and known-good IDs (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`). Record this as an open live-acceptance discrepancy, not as proof that Automate is wrong or that the backend universally returns 404. The SDK changelog nevertheless claims full OneAPI support and lists all four referential checks, while the README presents three of them as available (`vendor/zscaler-sdk-python/CHANGELOG.md:112-163`; `vendor/zscaler-sdk-python/README.md:1445-1452`). For callable coverage, prefer the current source inventory over those broader documentation claims.

### Legacy runtime static regression cautions

These are static-code cautions and have not been live-tested. The legacy helper's `send` path attaches the AI Guard API key as a Bearer token (`vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:333-404`), but the inspected generic HTTP path falls through to the standard session (`vendor/zscaler-sdk-python/zscaler/oneapi_http_client.py:318-325`), while `RequestExecutor` marks the AI Guard helper as legacy and suppresses OAuth without adding a replacement header in its generic header path (`vendor/zscaler-sdk-python/zscaler/request_executor.py:38-75`, `:101-107`, `:357-368`). This creates a regression risk in the legacy dispatch path; it is not a confirmed authentication failure. Track validation under [clarification ai-security-09](../_meta/clarifications.md#ai-security-09-python-sdk-legacy-policy-detection-authentication-path).

The runtime policy methods also look for `zguard_legacy_client` when handling throttling details (`vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:124-131`, `:199-204`), while the executor stores the helper as `aiguard_legacy_client` (`vendor/zscaler-sdk-python/zscaler/request_executor.py:38-75`). This name mismatch may bypass helper-level throttling handling and needs a live or unit-level regression check; it does not change the response model's documented `throttlingDetails` fields.

The same capture changed the enable/disable response from the prior full-policy shape to a `PolicyControlUpdateResult`: `enabled`, affected `matchRules[]` (`id`, `name`, `enabled`), `policyId`, and `updatedCount` (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:505-592`). This is documented-contract drift, not proof that older live tenants reject the previous response shape.

The current LLM Application create/update/read schemas also omit `defaultPolicyId` and `applicationSettings.customerManagedKey.{kmsKeyId,kmsProviderType}`, which were present in the prior captured contract (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:135-148`). Treat this as published-schema drift only. It does not prove that the backend removed the fields, that existing stored values were deleted, or that tenant-level customer-managed-key configuration was removed.

## Help provider labels vs Automate provider types

The 2026 Help chronology names supported applications/providers that do not all appear in the 23-value Automate `type` enum. Examples include GitHub Copilot, ElevenLabs, Windsurf, Mistral Vibe, Gamma, and Builder.io (`vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:14-50`; Automate enum at `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7503-7533`). These may represent User-mode application labels, built-in providers that are not customer-created admin objects, or documentation/API timing differences. Static sources do not establish a one-to-one mapping; track the boundary under [clarification ai-security-07](../_meta/clarifications.md#ai-security-07-help-provider-labels-vs-automate-provider-types).

## Cross-links

- AI Guard reference: [`./ai-guard.md`](./ai-guard.md)
- AI Guard coverage manifest: [`./ai-guard-coverage.md`](./ai-guard-coverage.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
