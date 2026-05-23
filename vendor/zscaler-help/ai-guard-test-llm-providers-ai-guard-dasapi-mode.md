# Test LLM Providers in AI Guard DAS/API Mode | Zscaler

**Source:** https://help.zscaler.com/ai-guard/test-llm-providers-ai-guard-dasapi-mode
**Captured:** 2026-05-22 via Codex Browser.

---

In DAS/API mode, AI Guard is not inline from a network-routing perspective. The application still talks to the Large Language Model (LLM) directly, but the application code should be updated so that it calls AI Guard before sending the prompt to the model, and then calls AI Guard again on the model response before returning that response to the end user.

When configuring a proxy for Zscaler, use the following base URL endpoint: https://proxy.zseclipse.net

In other words, DAS/API mode depends on application logic:

Application sends prompt content to AI Guard.

If allowed, the application sends the prompt to the LLM.

The application receives the LLM response.

The application sends the response content to AI Guard.

If allowed, the application returns the response to the user.

This is different from proxy mode:

Proxy mode routes traffic through AI Guard inline.

DAS/API mode adds explicit API calls in the application code.

The approach is agnostic across LLMs. The application still uses its normal model or provider, but the prompt and response are inspected by AI Guard using API calls.

App Flow Example

The following diagram shows that applications configured with AI Guard in DAS/API Mode will continue to have the prompt and responses sent from the application to the LLM directly, but the application code logic will include steps to send the prompts and responses to the AI Guard cloud service API endpoints:

DAS/API Endpoints

There are two primary endpoints for DAS/API mode:

Option 1: Execute a specific policy

Use this when:

You want to explicitly reference a specific AI Guard policy.

The application should always be checked against one known policy ID.

Endpoint:

https://api.zseclipse.net/v1/detection/execute-policy

Request shape:

self.zag_key = "<insert-api-key-generated-in-aiguard>"

ZAG_POLICY_ID = <insert-policy-id-number>

headers = {

"Authorization": f"Bearer {self.zag_key}",

"Content-Type": "application/json",

}

payload = {

"policyId": ZAG_POLICY_ID,

"direction": direction,

"content": content or "",

}

Notes:

policyId is required.

direction should indicate whether this is the outbound prompt or inbound response.

content is the text being evaluated.

Option 2: Resolve and execute policy

Use this when:

You want AI Guard to resolve which policy should match.

The application should not hard-code a single policy ID.

Requirements:

DAS/API policies must exist in AI Guard.

AI Guard evaluates those policies and determines the matching policy.

Endpoint:

https://api.zseclipse.net/v1/detection/resolve-and-execute-policy

Request shape:

self.zag_key = "<insert-api-key-generated-in-aiguard>"

headers = {

"Authorization": f"Bearer {self.zag_key}",

"Content-Type": "application/json",

}

payload = {

"direction": direction,

"content": content or "",

}

Notes:

policyId is not sent.

AI Guard resolves and applies the appropriate policy.

Direction Handling

The application should inspect both sides of the interaction:

The prompt before it is sent to the model.

The response before it is shown back to the user.

For example:

def inspect_with_ai_guard(content: str, direction: str):

headers = {

"Authorization": f"Bearer {self.zag_key}",

"Content-Type": "application/json",

}

payload = {

"direction": direction,

"content": content or "",

}

return requests.post(

"https://api.zseclipse.net/v1/detection/resolve-and-execute-policy",

json=payload,

headers=headers,

timeout=30,

)

Common usage pattern:

Call once with prompt content and outbound direction.

Call again with model output and inbound direction.

Suggested Integration Pattern

At a high level, the application code should look like this:

prompt_result = inspect_prompt_with_ai_guard(user_prompt)

if prompt_result_is_blocked(prompt_result):

return blocked_message()

llm_response = call_llm(user_prompt)

response_result = inspect_response_with_ai_guard(llm_response)

if response_result_is_blocked(response_result):

return blocked_message()

return llm_response

For explicit policy binding:

prompt_result = execute_specific_policy(user_prompt, "request", ZAG_POLICY_ID)

...

response_result = execute_specific_policy(llm_response, "response", ZAG_POLICY_ID)

For policy resolution:

prompt_result = resolve_and_execute_policy(user_prompt, "request")

...

response_result = resolve_and_execute_policy(llm_response, "response")

When to Use Each Endpoint

Use execute-policy when:

You want deterministic use of one exact policy.

The application owner knows which policy should always apply.

The policy routing should be controlled in the application code.

Use resolve-and-execute-policy when:

The policy selection is handled by AI Guard.

Multiple DAS/API policies may apply.

The application should stay light and avoid hard-coded policy IDs.

Configuration Requirements

For DAS/API mode, customers should expect to configure:

AI Guard API key.

DAS/API policy or policies.

Fixed policy ID if using execute-policy.

The application team should be prepared to add:

AI Guard API call before the prompt is sent to the model.

AI Guard API call before the response is returned to the user.

Error handling for failed inspections.

Return message verbiage for blocked inspections.

Implementation Considerations

Use a short request timeout for AI Guard inspection.

Handle AI Guard failures explicitly.

Log blocked events safely without exposing sensitive content broadly.

Ensure both prompt and response paths are instrumented.

Do not bypass the response-side call if output enforcement is required.
