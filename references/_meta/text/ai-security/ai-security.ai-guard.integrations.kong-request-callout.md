# The Kong Konnect Request Callout recipe for AI Guard: a prompt-only scan described in a README, how it extracts the prompt, and where it passes traffic (ai-security.ai-guard.integrations.kong-request-callout)
Also called: ai guard kong konnect; ai guard request callout; kong request-callout ai guard; aiguard_request_scan

The Konnect variant expresses an AI Guard scan with Kong's built-in Request Callout plugin, because Konnect's SaaS gateways do not run custom Lua; at the pin it exists only as a README with Lua snippets. At the pin the Kong `request-callout` directory holds only its README; the `request-callout-zscaler-aiguard-config.json` the README tells users to apply and the `KONNECT-DEPLOYMENT.md` it points to are not in the repository. [ai-security.ai-guard.integrations.kong-request-callout:readme-only]

**Coverage.** The recipe scans only the request: the prompt is checked before the upstream call and the AI service's response is returned directly to the client; the README points to the custom plugin for response scanning. [ai-security.ai-guard.integrations.kong-request-callout:request-only] The Kong overview says both legs are scanned [divergence:ai-security.ai-guard.integrations.kong-request-callout:response-leg].

**Extracting the prompt.** The request snippet does not decode the JSON body: it applies a Lua pattern that captures the characters between `"content": "` and the next double quote after a `"role": "user"`, keeps the last such match, escapes it into a hand-built JSON payload with direction IN, and adds `transactionId` only when `ngx.var.request_id` is a UUID. [ai-security.ai-guard.integrations.kong-request-callout:prompt-pattern] A prompt containing an escaped double quote is scanned only up to the backslash before it, a message whose content is an array (multimodal parts) produces no match, and a body with no match sends an empty `content` string. [ai-security.ai-guard.integrations.kong-request-callout:pattern-gaps]

**Decision.** The response snippet reads the callout reply, upper-cases the `action` matched in it, and returns HTTP 403 unless it is ALLOW or DETECT, a missing action included; if no callout response is found it logs a warning and returns without blocking. [ai-security.ai-guard.integrations.kong-request-callout:decision] When the callout yields no response object, the request is forwarded upstream unscanned. [ai-security.ai-guard.integrations.kong-request-callout:no-response-passes] The README also describes a graceful fallback during outages [divergence:ai-security.ai-guard.integrations.kong-request-callout:outage-posture].

**Forwarding and settings.** Before forwarding, the snippet restores the original body and sets the `host` header to `api.openai.com`. [ai-security.ai-guard.integrations.kong-request-callout:upstream-host] The README's settings are the us1 resolve-and-execute endpoint, the key from Kong's vault, caching off, a 2000 ms connect and 10000 ms read and write timeout, and 2 retries. [ai-security.ai-guard.integrations.kong-request-callout:settings]

What to check:
1. Treat the response as unscanned on Konnect; only the prompt is checked by this recipe.
2. That prompts are plain strings without escaped quotes; multimodal or quoted content is truncated or sent empty by the pattern.
3. That the service is OpenAI, since the forwarding snippet fixes the Host header to api.openai.com.

Inferred, not quoted (say so when an answer rests on one):
- [ai-security.ai-guard.integrations.kong-request-callout:readme-only] Tier B: Rests on the repository's file listing at d6bf200, where Kong/request-callout contains README.md alone and no file of either name exists elsewhere.
- [ai-security.ai-guard.integrations.kong-request-callout:pattern-gaps] Tier B: Follows from Lua pattern semantics ([^"]* stops at the first double-quote character); what AI Guard answers for empty content is not stated by any source (see ai-security.ai-guard.integrations.azure-apim:empty-content).
- [ai-security.ai-guard.integrations.kong-request-callout:no-response-passes] Tier B: Follows from the snippet's early return; whether the Request Callout plugin produces a response object on a network failure or timeout, or errors out itself, is not documented in the repository.

Sources disagree (name both sides):
- Whether Kong's Konnect variant scans the LLM response. [divergence:ai-security.ai-guard.integrations.kong-request-callout:response-leg]
  - zguard-integrations: The Kong overview README says both Kong forms scan the prompt on the way in and the LLM response on the way out.
  - zguard-integrations: The request-callout README says the current implementation scans requests only.
  Impact: On Konnect, model output reaches clients without an AI Guard check unless the custom plugin is used on hybrid data planes.
- What the Konnect recipe does when AI Guard is unreachable. [divergence:ai-security.ai-guard.integrations.kong-request-callout:outage-posture]
  - zguard-integrations: The Kong overview README says both forms fail closed when a verdict cannot be reached, and the request-callout README describes fail-fast 403 blocks.
  - zguard-integrations: The same README lists graceful fallback, continuing operation during AI Guard API outages, as a key component.
  Impact: The snippet blocks a reply without an action but passes when no callout response exists (no-response-passes); which path an outage takes depends on the Request Callout plugin and is untested.

Area: ai-security.ai-guard, its subjects in references/_meta/spine/ai-security/ai-security.ai-guard.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/ai-security/ai-security.ai-guard.runtime-api.md (Calling AI Guard at runtime: the proxy endpoint, the DAS detection API, its host, direction and policy ID, and throttling in the Python SDK): The root README's architecture section says AI Guard uses a DAS pattern in which each AI application integrates independently, with no proxy infrastructure required. [ai-security.ai-guard.integrations:das-pattern]
- interacts-with references/_meta/text/ai-security/ai-security.ai-guard.detectors.md (AI Guard's detectors: the capabilities Help lists and the detectors the policy editor configures), from ai-security.ai-guard: A policy is set by enabling detectors on prompts and responses; a tenant can have several policies, apply one per app, several to one app, or one to several apps. [ai-security.ai-guard.policies:policy-is-detectors]
- logged-in references/_meta/text/ai-security/ai-security.ai-guard.observability.md (AI Guard dashboards, Insights, Token Usage and log exports (ADX, CrowdStrike, S3, Splunk)), from ai-security.ai-guard: The Security Posture chart shows the share of Allowed, Blocked and Passthrough transactions across all AI traffic. [ai-security.ai-guard.observability:security-posture]
- decided-by references/_meta/text/ai-security/ai-security.ai-guard.policies.md (AI Guard policies: detector settings, policy control rules, first-match order, applications and testing), from ai-security.ai-guard: A policy configuration applies to traffic only through an enabled policy control that matches it first; a policy with no such rule, a disabled rule, or a rule below an earlier match is not applied to that traffic. [ai-security.ai-guard.policies:no-match-unapplied]
- depends-on references/_meta/text/ai-security/ai-security.ai-guard.tenant-settings.md (AI Guard tenant settings: prompt storage, encryption keys, ZIA sync, block messages, organization restrictions, Anthropic webhook), from ai-security.ai-guard: AI Guard has two deployment modes: in Proxy mode it is an inline reverse proxy between the AI application and the LLM provider; in DAS/API (Detection-as-a-Service) mode it is an API endpoint that the application must call for every prompt and every response. [ai-security.ai-guard:two-modes]
- reached-via references/_meta/text/ai-security/ai-security.ai-guard.zia-integration.md (Sending ZIA users' AI traffic to AI Guard by proxy chaining: prerequisites, proxy, QUIC rule and forwarding), from ai-security.ai-guard: ZIA can be configured to invoke AI Guard for processing users' AI traffic. [ai-security.ai-guard.zia-integration:invoke-from-zia]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/ai-security/ai-security.ai-guard.integrations.kong-plugin.md (The zscaler-aiguard-intercept Lua plugin for Kong Gateway: access and response phase scans, its configuration, and where it blocks or lets traffic pass)
