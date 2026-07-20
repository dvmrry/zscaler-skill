---
product: ai-security
topic: "ai-guard-api-divergences"
title: "AI Guard API and integration divergences"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 4371c9bab44d852526721b4b5999e2471dda5198
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/zguard-ai-integrations: 7da6ed977fb3987203001dc78e9146e507cb1407
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/ai-guard-what-is.md"
  - "vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md"
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/zaiguard_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py"
  - "vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py"
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

The Python SDK README lists **Zscaler AI Guard API** in the OneAPI-supported product list (`vendor/zscaler-sdk-python/README.md:256-273`). The SDK exposes it through the `zguard` property and a narrow `ZGuardService` wrapper: `client.zguard.policy_detection` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:345-350`; `vendor/zscaler-sdk-python/zscaler/zaiguard/zaiguard_service.py:21-33`).

The exposed methods are:

| Method | Endpoint | Notes |
|---|---|---|
| `execute_policy(content, direction, policy_id=None, transaction_id=None)` | `/v1/detection/execute-policy` | Explicit policy execution. SDK marks `policy_id` optional, but Help says `policyId` is required for the explicit option. |
| `resolve_and_execute_policy(content, direction, transaction_id=None)` | `/v1/detection/resolve-and-execute-policy` | Automatic policy resolution for the API key/application association. |

The SDK body sends `content` and `direction`, adds `policyId` only when provided, and adds `transactionId` only when provided (`vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:79`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:84`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:87`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:157`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:162`). The response model includes top-level action, severity, direction, detector responses, and throttling details with `retryAfterMillis` (`vendor/zscaler-sdk-python/zscaler/zaiguard/models/policy_detection.py:208`, `:212`, `:214`, `:216`, `:225`, `:135`).

## Runtime endpoint host divergence

The captured DAS Help page uses the global host `https://api.zseclipse.net` for both explicit policy execution and policy resolution (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:50`, `:100`, `:158`). The Python legacy AI Guard client still defaults to `https://api.us1.zseclipse.net`, accepts `AIGUARD_CLOUD`, and constructs `https://api.<cloud>.zseclipse.net` unless `AIGUARD_OVERRIDE_URL` / `override_url` is supplied (`vendor/zscaler-sdk-python/zscaler/zaiguard/legacy.py:58`, `:75`, `:78`, `:81`). Public integration examples also still describe region-derived hosts such as `https://api.{cloud}.zseclipse.net` (`vendor/zguard-ai-integrations/Microsoft/README.md:519`; `vendor/zguard-ai-integrations/github-actions/README.md:66`; `vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py:38-42`).

An open upstream integration-doc issue reports the same likely direction: `api.{cloud}.zseclipse.net` no longer working for policy resolution and `https://api.zseclipse.net` working instead ([zguard-ai-integrations#10](https://github.com/zscaler/zguard-ai-integrations/issues/10)). Treat this as corroborating issue-report context, not as a runtime acceptance result: static sources do not prove whether global and regional hosts both work, whether one is preferred, or whether the regional examples are stale. Use the Help-global host when following the current Help page, but use SDK/integration override knobs when an implementation needs to pin the host. See [clarification ai-security-06](../_meta/clarifications.md#ai-security-06-ai-guard-das-endpoint-host-selection).

## Direction value divergence

For SDK calls and integration examples, use `IN` for prompt/request-side scanning and `OUT` for response/output-side scanning. The SDK docstrings define `direction` as `IN` or `OUT` (`vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:51`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:131`), and the n8n integration documents the same request body shape (`vendor/zguard-ai-integrations/n8n/README.md:91`, `vendor/zguard-ai-integrations/n8n/README.md:95`).

The DAS Help page is inconsistent with that literal set: its prose says direction should identify outbound prompt vs inbound response, and examples pass `"request"` and `"response"` (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:80`, `:196`, `:200`, `:204`, `:208`). Treat `request`/`response` as unresolved Help-example literals until a live API check confirms whether they are accepted aliases. See [clarification ai-security-01](../_meta/clarifications.md#ai-security-01-ai-guard-direction-literal-aliases).

## `policyId` requirement divergence

The DAS Help page states `policyId` is required for the explicit-policy option (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:78`). The Python SDK signature marks `policy_id` optional and only emits `policyId` if a caller supplies it (`vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:43`, `vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:84`). Until a live API check resolves this, prefer `resolve_and_execute_policy` when there is no explicit policy ID and require an explicit policy ID when calling `execute_policy`. See [clarification ai-security-02](../_meta/clarifications.md#ai-security-02-ai-guard-execute-policy-without-policyid).

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

The reconstructed Automate snapshot now exposes **47 AI Guard operations** across detection policies, detection-policy match rules, LLM applications, LLM providers, provider types, and application/provider credential objects (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:9`; operation inventory in `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json`). This resolves the earlier audit-scoped absence of a documented AI Guard admin-plane API.

Do not conflate that contract with the newly captured **AI Security Public API**, which is a separate 11-operation read-only inventory/findings surface for data stores, identities, MCP servers/tools, workloads, and issues. See [`./asset-management-api.md`](./asset-management-api.md).

That does **not** mean the client surfaces are caught up. The same pass still found no matching Go SDK service, Terraform resource, MCP tool, Postman endpoint, or Automation Hub procedure in the inspected client/source classes. Treat the Automate contract as the documented method/path/field surface, and treat client absence as a wrapper-coverage gap until a client source adds those operations. See [clarification ai-security-04](../_meta/clarifications.md#ai-security-04-ai-guard-admin-plane-programmability).

One caveat remains on the reconstructed paths: the structural validation report flags eight AI Guard action paths with adjacent path-template fragments such as `/v1/detections/policies/{id}{disable}` and `/v1/llm-application-credentials/{id}{regenerate}` (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:23`, `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:29-36`). Those paths come from the embedded Docusaurus API object, but the colon/subpath form the live gateway accepts is not confirmed by static sources. Track that under [clarification ai-security-05](../_meta/clarifications.md#ai-security-05-ai-guard-adjacent-action-path-template-encoding).

## Cross-links

- AI Guard reference: [`./ai-guard.md`](./ai-guard.md)
- AI Guard coverage manifest: [`./ai-guard-coverage.md`](./ai-guard-coverage.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
