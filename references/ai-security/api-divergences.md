---
product: ai-security
topic: "ai-guard-api-divergences"
title: "AI Guard API and integration divergences"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: e7f5f7efb56b6e24667f183e5dff3da03e039cc9
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
  vendor/zguard-ai-integrations: 71cbab024f369eb50748c9c4a74ec0158c084839
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
  - "vendor/zguard-ai-integrations/Google/apigee/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md"
  - "vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js"
  - "vendor/zguard-ai-integrations/Google/cloudrun/README.md"
  - "vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py"
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

The Python SDK policy-detection and dispatch claims refreshed below were reverified against v1.9.44 at gitlink `e7f5f7efb56b6e24667f183e5dff3da03e039cc9` on 2026-09-03. Other `verified-against` entries remain at their recorded pins because this bounded pass did not reverify those submodules.

## Runtime API surface

The Python SDK README lists **Zscaler AI Guard API** in the OneAPI-supported product list (`vendor/zscaler-sdk-python/README.md:256-273`). In SDK 1.9.39, the package moved to `zscaler.aiguard`; `client.aiguard` is canonical and `client.zguard` is a deprecated alias (`vendor/zscaler-sdk-python/CHANGELOG.md:141-206`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:343-385`). The current v1.9.44 legacy client class remains `LegacyAIGuardClient`; the prior `LegacyZGuardClient` entry-point name is removed (`vendor/zscaler-sdk-python/pyproject.toml:1-4`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:671-712`). `ZscalerClient` exposes six OneAPI configuration resources, while `LegacyAIGuardClient(...).aiguard.policy_detection` remains the separate runtime route (`vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:671-712`). This is Python-client routing; it is not evidence that the backend universally requires these exact authentication paths.

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

Source: `vendor/zguard-ai-integrations/README.md`; `vendor/zguard-ai-integrations/CHANGELOG.md`; `vendor/zguard-ai-integrations/Windsurf/README.md`; `vendor/zguard-ai-integrations/n8n/README.md`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py`.

The September 1, 2026 integration release presents a fail-closed default for
missing keys, API errors, non-verdict HTTP 200 responses, and unrecognised
actions (`vendor/zguard-ai-integrations/README.md:256-284`). That sentence is
not a universal enforcement contract: the same README records audit-only
Windsurf/Cline post-hooks, the audit-only Codex `Stop` hook, and passthrough for
unclassifiable gateway traffic unless `failClosedOnUnknown` is enabled
(`vendor/zguard-ai-integrations/README.md:286-293`).

The existing host-specific observations remain useful, but must be separated
from the new release:

- Windsurf pre-hooks allow traffic when `AIGUARD_API_KEY` is missing, but fail closed on API errors or unexpected responses; post-hooks cannot block and only log or alert (`vendor/zguard-ai-integrations/Windsurf/README.md:17`, `vendor/zguard-ai-integrations/Windsurf/README.md:19`).
- The 0.2.0 changelog says the Claude Code hooks' former fail-open paths were fixed, including missing key, API error, exception, and verdict-less responses (`vendor/zguard-ai-integrations/CHANGELOG.md:35-46`). Older Claude Code README/source claims that file reads intentionally fail open are stale relative to this checked-in head; this is a source-document comparison, not a runtime test.
- n8n documents fail-closed behavior only for internal errors when its "Continue On Fail" path is enabled (`vendor/zguard-ai-integrations/n8n/README.md:96`).
- Codex `Stop` runs after the response has streamed and displayed. It blocks on a `BLOCK` verdict, but its error branch deliberately returns `continue: true` (fail-open), and short messages are skipped (`vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:17-24`, `:186-191`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/scan_stop_response.py:47-81`).

Do not infer one host's failure posture from another host's example. These are
public integration implementations with distinct event and side-effect
boundaries, not a single AI Guard runtime contract.

## New integration boundaries and timing

Source: `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md`; `vendor/zguard-ai-integrations/AWS/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md`; `vendor/zguard-ai-integrations/AWS/strands-agents/README.md`; `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md`; `vendor/zguard-ai-integrations/Google/apigee/README.md`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md`.

The new AWS, OpenAI, and Google examples are implementation-level coverage:

- AgentCore is an explicit four-leg guard. Prompt and tool input are scanned before the model/tool call; tool output is scanned before re-entry to the model. Async tools are awaited and generators are drained before scanning, while streamed response granularity remains the caller's responsibility (`vendor/zguard-ai-integrations/AWS/bedrock-agentcore/README.md:1-18`, `:50-82`, `:108-118`).
- The Bedrock boto3 hook intercepts client calls before/after the SDK operation, but complete stream responses are skipped at `after_call` (`vendor/zguard-ai-integrations/AWS/README.md:13-18`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:671-693`). Lambda sees only one prompt and one response at the handler boundary; HTTP proxy callers receive 403, while direct and async event sources raise so retry/DLQ behavior is preserved (`vendor/zguard-ai-integrations/AWS/lambda-decorator/README.md:49-87`).
- Strands exposes prompt, response, tool-input, and tool-output lifecycle events. Response blocks request retries and ultimately raise; tool output can be replaced only after the tool has run. Streams can emit before the final verdict, and `Agent.structured_output()` is outside the hook loop (`vendor/zguard-ai-integrations/AWS/strands-agents/README.md:1-18`, `:181-198`; `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py:655-743`).
- Codex covers `UserPromptSubmit`, Bash/MCP pre-tool input, Bash/MCP post-tool output, and `Stop`; it does not cover `apply_patch`, non-Bash/non-MCP tools, or stream interception. Post-tool hooks cannot undo completed side effects (`vendor/zguard-ai-integrations/OpenAI/codex-hooks/README.md:9-24`, `:48-70`).
- Apigee inline is synchronous Gemini-only, while the SharedFlow covers Gemini, OpenAI, Anthropic, MCP, and SSE. Inline blocks use 403; SharedFlow blocks preserve caller-shaped HTTP 200 responses (`vendor/zguard-ai-integrations/Google/apigee/README.md:1-29`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md:13-22`, `:76-130`).

## Opaque content and mixed-response gap

Source: `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/README.md`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md`; `vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js`.

**Static implementation finding; no runtime model matrix was executed.** The
Bedrock response walker returns both extracted text and an `opaque` flag, but
the Converse and InvokeModel response helpers discard the second value
(`vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:358-389`). The `after_call` path applies `on_unscannable` only when no response text is present (`:712-731`). Therefore a mixed response containing text plus an image, document, or unknown block can be scanned on its text alone in the current static code, despite the integration README's mixed-content fail-closed description. This is an open source divergence, not a verified bypass result.

The Apigee SharedFlow has a separate static coverage boundary: its MCP
extractor copies only `result.content[*].text` to the tool-event output and
silently omits non-text result members (`vendor/zguard-ai-integrations/Google/apigee/sharedflow/ZSCALER-AIGUARD/sharedflowbundle/resources/jsc/extract-content.js:68-101`). The SharedFlow README describes MCP arguments as `IN` and results as `OUT` (`vendor/zguard-ai-integrations/Google/apigee/sharedflow/README.md:19-22`), so non-text result handling requires source correction or runtime validation before claiming complete MCP-result coverage.

## Policy-ID parsing and stale-ID divergence

Source: `vendor/zguard-ai-integrations/README.md`; `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py`; `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py`; `vendor/zguard-ai-integrations/AWS/lambda-decorator/aiguard_decorator.py`; `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py`; `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/aiguard_utils.py`.

The new Python integrations strip quotes, attempt `int()`, and return `None` on
a malformed/non-numeric explicit policy ID. `None` selects auto-resolution, so
an invalid configured ID is silently treated like an unset ID:

- AgentCore: `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py:202-216`
- Bedrock boto3: `vendor/zguard-ai-integrations/AWS/bedrock-sdk-hooks/python/aiguard_boto3_hook.py:456-470`
- Lambda: `vendor/zguard-ai-integrations/AWS/lambda-decorator/aiguard_decorator.py:285-299`
- Strands: `vendor/zguard-ai-integrations/AWS/strands-agents/aiguard_strands.py:180-194`
- Codex: `vendor/zguard-ai-integrations/OpenAI/codex-hooks/.codex/hooks/aiguard_utils.py:155-168`

That behavior is inconsistent with the root warning that a stale explicit ID
can return HTTP 200 with no action and fail closed (`vendor/zguard-ai-integrations/README.md:272-293`). It is a static configuration inconsistency; no runtime result establishes which behavior users observe in each integration.

## Invalid and contradictory vendor documentation

Source: `vendor/zguard-ai-integrations/AWS/strands-agents/README.md`; `vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md`; `vendor/zguard-ai-integrations/docs/ARCHITECTURE.md`; `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py`; `vendor/zguard-ai-integrations/Google/cloudrun/README.md`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py`.

- The Strands README's constructor example has two bare `policy_id=` assignments and cannot be executed as written (`vendor/zguard-ai-integrations/AWS/strands-agents/README.md:132-149`).
- The agentic integration guide labels Agent→LLM prompts `OUT`, scans `llm_prompt` with `direction="OUT"`, and returns the generated response without a final scan, while the architecture direction table and AgentCore leg mapping use prompt `IN` and response `OUT` (`vendor/zguard-ai-integrations/docs/AGENTIC_AI_INTEGRATION.md:157-171`, `:205-262`, `:305-310`; `vendor/zguard-ai-integrations/docs/ARCHITECTURE.md:318-338`; `vendor/zguard-ai-integrations/AWS/bedrock-agentcore/aiguard_agentcore.py:238-269`). Treat that guide as contradictory illustrative prose, not as a direction contract.
- Cloud Run README wording says pipelines configure an existing Apigee org and do not create one, while `provision_org.py` explicitly creates the org/runtime/environment/group/attachments. The source supports a two-stage workflow—bootstrap/provision first, pipeline deploy second—but does not support conflating the two (`vendor/zguard-ai-integrations/Google/cloudrun/README.md:51-73`; `vendor/zguard-ai-integrations/Google/cloudrun/flow/setup/provision_org.py:98-154`).

## Python SDK minimum-version alignment

Source: `vendor/zguard-ai-integrations/CHANGELOG.md`; `vendor/zscaler-sdk-python/pyproject.toml`.

The zguard 0.2.0 release requires `zscaler-sdk-python>=1.9.44` because earlier
versions did not attach the Bearer token to AI Guard policy-detection calls
(`vendor/zguard-ai-integrations/CHANGELOG.md:3-9`). The parent repository now
pins v1.9.44 (`vendor/zscaler-sdk-python/pyproject.toml:1-4`), so the declared
minimum-version gap is closed. This alignment does not substitute for a live
compatibility run of each integration example.

## Automate admin-plane contract vs client surfaces

Source: `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json`; `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md`; `vendor/zscaler-sdk-go`; `vendor/terraform-provider-zia`; `vendor/terraform-provider-zpa`; `vendor/terraform-provider-ztc`; `vendor/zscaler-mcp-server`; `vendor/zscaler-terraform-skills`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

The current public Automate operation pages publish the **47 AI Guard operations across 29 paths** represented by the retained contract. The durable 2026-08-12 route table recorded no `aiguard` operations, so its `absent-from-current-public-route-table` status is historical for that capture rather than the current publication state (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:19-23`; `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:10`, `:156-160`). Current citations include [disable detection policy](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/aiguard/detection-policies/detections-policy-resource-disable-detections-policy), [referential-check detection policy](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/aiguard/detection-policies/detections-policy-resource-referential-check-detections-policy), and [regenerate LLM application credential](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/aiguard/llm-application-credentials/llm-application-credentials-resource-regenerate-llm-application-credentials). Current publication still does not establish endpoint entitlement, live acceptance, or backend availability.

The configuration surface introduced in Python SDK 1.9.39 remains present in current v1.9.44: six resources and 39 callable methods (`vendor/zscaler-sdk-python/CHANGELOG.md:141-206`; current version at `vendor/zscaler-sdk-python/pyproject.toml:3`):

| Resource | Count | Source |
|---|---:|---|
| Policies | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357` |
| Policy match rules | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338` |
| LLM providers and provider types | 8 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457` |
| LLM provider credentials | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362` |
| LLM applications | 6 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363` |
| LLM application credentials, including regenerate | 7 | `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412` |

Two read-only provider-type discovery operations are present in the retained last-known capture:

| Method | Path | Contract result |
|---|---|---|
| `GET` | `/v1/llm-provider-types` | All supported provider types with server guidance. |
| `GET` | `/v1/llm-provider-types/{type}` | One provider type selected by a constrained `type` path parameter. |

The single-type operation constrains `type` to 23 captured identifiers, from `openai`, `anthropic`, and `azure` through Bedrock, Gemini, Copilot, MaxAI, OpenCode, Perplexity, Vertex, and `xai` variants (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7486-7533`). Its response returns `type`, `name`, `description`, and public/private `servers` guidance. Each deployment-mode entry says whether servers are accepted, which map key to use, and any fixed allowed values (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7538-7703`). Use these discovery operations before constructing an LLM provider rather than hard-coding a provider-to-server map.

Do not conflate that contract with the **AI Security Public API**, which is a separate current 17-operation read-only inventory/findings surface for agents, code repositories, data stores, guardrails, identities, MCP servers/tools, workloads, and issues. See [`./asset-management-api.md`](./asset-management-api.md) for the direct current operation-page citations and the 8/12 baseline.

That does **not** mean the client surfaces have full parity. Python wraps 39 of the 47 operations in the current public set; the same pass still found no matching Go SDK service, Terraform resource, MCP tool, Postman endpoint, or Automation Hub procedure in the inspected client/source classes. Treat the current operation pages and retained contract as documented method/path/field evidence, and each client inventory as its own coverage boundary. Do not infer tenant entitlement, live endpoint acceptance, endpoint retirement, or backend unavailability from the wrapper inventory or from changes in route publication. See [clarification ai-security-04](../_meta/clarifications.md#ai-security-04-ai-guard-admin-plane-programmability) for the broader wrapper boundary and [clarification ai-security-08](../_meta/clarifications.md#ai-security-08-python-sdk-ai-guard-admin-operation-gap) for the Python gap.

The retained July 20 contract resolves the earlier adjacent-template encoding defect. Enable/disable are `/v1/detections/policies/{id}/enable` and `/v1/detections/policies/{id}/disable`, referential checks use `/{id}/referential-check`, and credential rotation uses `/{id}/regenerate` (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:4021-4033`). The previous `ai-security-05` clarification remains closed for the retained documented shape; current publication, live authorization, and tenant acceptance are separate concerns.

### Python SDK coverage gap

Eight Automate-documented operations are not callable in the Python inventory: policy enable, disable, referential check, and summaries, plus referential checks for providers, provider credentials, applications, and application credentials (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:1954-1966`, `:3956-3968`, `:5229-5241`, `:6142-6154`, `:7166-7178`; Python inventories above). The application-credential regenerate action is callable in Python (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:290-333`) and remains documented by Automate (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:4021-4033`).

The four resource referential-check implementations are commented out with notes that an SDK maintainer observed HTTP 404 responses even with Postman and known-good IDs (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`). Record this as an open live-acceptance discrepancy, not as proof that Automate is wrong or that the backend universally returns 404. The SDK changelog nevertheless claims full OneAPI support and lists all four referential checks, while the README presents three of them as available (`vendor/zscaler-sdk-python/CHANGELOG.md:141-192`; `vendor/zscaler-sdk-python/README.md:1445-1452`). For callable coverage, prefer the current source inventory over those broader documentation claims.

### Legacy runtime dispatch and throttling boundaries

The exact static dispatch/auth regression is resolved in the v1.9.44 source. The changelog identifies that `execute_policy` and `resolve_and_execute_policy` previously fell through to the standard OneAPI session without the AI Guard API key and were fixed in v1.9.44 (`vendor/zscaler-sdk-python/CHANGELOG.md:3-11`). `RequestExecutor` carries the helper as `aiguard_legacy_client` and marks it as the legacy path (`vendor/zscaler-sdk-python/zscaler/request_executor.py:64-77`); `HTTPClient` now routes requests through `aiguard_legacy_client.send(...)` when that helper is present (`vendor/zscaler-sdk-python/zscaler/oneapi_http_client.py:319-337`). The helper prepares the request and applies `Authorization: Bearer <api_key>` before sending it (`vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:333-386`). This closes the former static generic-session/Bearer-header regression, but it is still source evidence only: no live request was run, and it does not establish host selection, backend acceptance, or tenant authorization.

The separate throttling helper-name mismatch remains open. The runtime policy methods still look for `zguard_legacy_client` when handling throttling details (`vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:124-131`, `:199-204`), while the executor stores the helper as `aiguard_legacy_client` (`vendor/zscaler-sdk-python/zscaler/request_executor.py:64-77`). The v1.9.44 dispatch fix does not rename this attribute, so helper-level throttling handling may still be bypassed and needs a live or unit-level regression check; this does not change the response model's documented `throttlingDetails` fields.

The retained enable/disable response is a `PolicyControlUpdateResult`: `enabled`, affected `matchRules[]` (`id`, `name`, `enabled`), `policyId`, and `updatedCount` (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:505-592`). This is last-known documented shape, not proof of current publication or live tenant response behavior.

The retained LLM Application create/update/read schemas do not expose `defaultPolicyId` or `applicationSettings.customerManagedKey.{kmsKeyId,kmsProviderType}` (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:4464-4712`, `:4768-5073`, `:5294-5542`). Treat the omission as a last-known contract boundary only. It does not prove that the backend removed the fields, that existing stored values were deleted, or that tenant-level customer-managed-key configuration was removed.

## Help provider labels vs Automate provider types

The 2026 Help chronology names supported applications/providers that do not all appear in the retained last-known 23-value Automate `type` enum. Examples include GitHub Copilot, ElevenLabs, Windsurf, Mistral Vibe, Gamma, and Builder.io (`vendor/zscaler-help/ai-guard-release-upgrade-summary-2026.md:14-50`; retained Automate enum at `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7503-7533`). These may represent User-mode application labels, built-in providers that are not customer-created admin objects, or documentation/API timing differences. Static sources do not establish a one-to-one mapping; track the boundary under [clarification ai-security-07](../_meta/clarifications.md#ai-security-07-help-provider-labels-vs-automate-provider-types).

## Cross-links

- AI Guard reference: [`./ai-guard.md`](./ai-guard.md)
- AI Guard coverage manifest: [`./ai-guard-coverage.md`](./ai-guard-coverage.md)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
