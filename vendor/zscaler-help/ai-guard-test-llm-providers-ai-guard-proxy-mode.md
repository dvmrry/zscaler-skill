# Test LLM Providers in AI Guard Proxy Mode | Zscaler

**Source:** https://help.zscaler.com/ai-guard/test-llm-providers-ai-guard-proxy-mode
**Captured:** 2026-05-22 via Codex Browser.

---

This document provides a reference for testing supported Large Language Model (LLM) providers through AI Guard in proxy mode. Its purpose is to show, for each validated provider, the exact proxy URL path, required headers, and basic request body structure needed to successfully send a test prompt through the common AI Guard proxy endpoint. This is intended as a practical reference guide for administrators and engineers who need to configure or verify provider-specific proxy routing in AI Guard for services such as Anthropic, Azure Foundry, AWS Bedrock, Google Gemini, and Google Vertex, OpenAI, etc.

When configuring a proxy for Zscaler, use the following base URL endpoint: https://proxy.zseclipse.net

In proxy mode, the application is updated so it no longer sends requests directly to each individual LLM provider endpoint. Instead, the application sends its model requests to Zscaler AI Guard as the single destination, and AI Guard then proxies that traffic to the appropriate upstream LLM provider on the application’s behalf. This allows AI Guard to sit inline for routing, inspection, and policy enforcement while simplifying the application-side integration to a common proxy pattern.

App Flow Example

The following diagram is a simple visualization to show applications configured with AI Guard in proxy mode will have the prompts and responses flow from the application server to the AI Guard cloud service, which will then send the traffic to the destination LLM:

Providers List

The following table provides a list of all supported AI providers as well as hostname and proxy path information.

Provider Hostname Proxy Path

Anthropic Provider-specific upstream in AI Guard /v1/messages

AWS Bedrock Agent Provider-specific upstream in AI Guard /agents/<AGENT_ID>/agentAliases/<AGENT_ALIAS_ID>/sessions/<SESSION_ID>/text

AWS Bedrock Anthropic Provider-specific upstream in AI Guard /model/anthropic.<MODEL>/invoke

AWS Bedrock Invoke Provider-specific upstream in AI Guard /model/<MODEL>/converse

Azure Foundry <your-resource>.openai.azure.com /openai/v1/chat/completions

Google Gemini generativelanguage.googleapis.com /v1beta/models/<MODEL>:generateContent

Google Vertex aiplatform.googleapis.com /v1/projects/<PROJECT_ID>/locations/<REGION>/publishers/google/models/<MODEL>:generateContent

OpenAI Provider-specific upstream in AI Guard /v1/chat/completions

Provider Testing Information

Anthropic

Endpoint: POST https://proxy.zseclipse.net/v1/messages

Headers:

X-ApiKey: <ZSCALER_AI_GUARD_KEY>

Content-Type: application/json

anthropic-version: <VERSION>

Sample Body:

{

"model": "<MODEL>",

"max_tokens": 64,

"messages": [

{

"role": "user",

"content": "Reply with the single word OK."

}

]

}

## Fields explained

X-ApiKey: The AI Guard key for Anthropic.

Content-Type: Specifies the request payload format (always JSON).

Anthropic-version: This is the version of Anthropic you're using, i.e. 2023-06-01.

Model: The model to query, such as "claude-sonnet-4-2025051".

Messages: List of conversations containing:

Role: The sender’s role. Options include: "user", "assistant", and "system".

Content: The actual content or query to be processed.

AWS Bedrock Agent

Endpoint: POST https://proxy.zseclipse.net/agents/<AGENT_ID>/agentAliases/<AGENT_ALIAS_ID>/sessions/<SESSION_ID>/text

Headers:

X-ApiKey: <ZSCALER_AI_GUARD_KEY>

Content-Type: application/json

accept: application/json

Sample Body:

{

"inputText": "Reply with the single word OK.",

"enableTrace": false

}

## Fields explained

Agent ID: The Agent ID obtained from AWS Bedrock Agent

Agent Alias ID: The Agent Alias ID obtained from your AWS Bedrock Agent.

Session ID: Does not need to be pre-created in AWS. It is a client-supplied conversation ID. For example: lab-test-001

X-ApiKey: The AI Guard key for Bedrock.

Content-Type: Specifies the request payload format (always JSON).

AWS Bedrock Anthropic

Endpoint: POST https://proxy.zseclipse.net/model/<MODEL>/invoke

Headers:

X-ApiKey: <ZSCALER_AI_GUARD_KEY>

Content-Type: application/json

accept: application/json

Sample Body:

{

"anthropic_version": "<MODEL>",

"max_tokens": 64,

"messages": [

{

"role": "user",

"content": [

{

"type": "text",

"text": "Reply with the single word OK."

}

]

}

]

}

## Fields explained

Model: The model to query, such as anthropic.claude-3-haiku-20240307-v1:0.

X-ApiKey: The AI Guard key for Bedrock.

Content-Type: Specifies the request payload format (always JSON).

Anthropic-version: This is the version of Anthropic you're using, i.e. 2023-06-01.

Messages: List of conversations containing:

Role: The sender’s role. Options include: "user", "assistant", and "system".

Content: The actual content or query to be processed.

AWS Bedrock Invoke

Endpoint: POST https://proxy.zseclipse.net/model/<MODEL>/converse

Headers:

X-ApiKey: <ZSCALER_AI_GUARD_KEY>

Content-Type: application/json

accept: application/json

Sample Body:

{

"messages": [

{

"role": "user",

"content": [

{

"text": "Reply with the single word OK."

}

]

}

],

"inferenceConfig": {

"maxTokens": 64,

"temperature": 0

}

}

## Fields explained

Model: The model to query, such as "amazon.nova-lite-v1:0".

X-ApiKey: The AI Guard key for Bedrock.

Content-Type: Specifies the request payload format (always JSON).

Messages: List of conversations containing:

Role: The sender’s role. Options include: "user", "assistant", and "system".

Content: The actual content or query to be processed.

Azure Foundry

AI Guard hostname/FQDN: <your-resource>.openai.azure.com

Endpoint: POST https://proxy.zseclipse.net/openai/v1/chat/completions

Headers:

X-ApiKey: <ZSCALER_AI_GUARD_KEY>

Content-Type: application/json

Sample Body:

{

"model": "<MODEL>",

"messages": [

{

"role": "user",

"content": "Reply with the single word OK."

}

],

"max_tokens": 64

}

## Fields explained

Your-resource: The prefix to your Azure Foundry OpenAI service.

X-ApiKey: The AI Guard key for OpenAI.

Content-Type: Specifies the request payload format (always JSON).

Model: The model to query, such as "claude-sonnet-4-2025051".

Messages: List of conversations containing:

Role: The sender’s role. Options include: "user", "assistant", and "system".

Content: The actual content or query to be processed.

Google Gemini

AI Guard hostname/FQDN: generativelanguage.googleapis.com

Endpoint: POST https://proxy.zseclipse.net/v1beta/models/<MODEL>:generateContent

Headers:

X-ApiKey: <ZSCALER_AI_GUARD_KEY>

Content-Type: application/json

Minimal sample body aligned with Google Gemini:

{

"contents": [

{

"parts": [

{

"text": "Reply with the single word OK."

}

]

}

]

}

Script-compatible sample body:

{

"contents": [

{

"role": "user",

"parts": [

{

"text": "Reply with the single word OK."

}

]

}

],

"generationConfig": {

"maxOutputTokens": 64

}

}

## Fields explained

Model: The model being called, such as gemini-2.5-flash.

X-ApiKey: The AI Guard key for Gemini.

Content-Type: Specifies the request payload format (always JSON).

Upstream provider credential in AI Guard is a Gemini API key from Google AI Studio.

Google Vertex

AI Guard hostname/FQDN: aiplatform.googleapis.com

Endpoint: POST https://proxy.zseclipse.net/v1/projects/<PROJECT_ID>/locations/<REGION>/publishers/google/models/<MODEL>:generateContent

Headers:

X-ApiKey: <ZSCALER_AI_GUARD_KEY>

Content-Type: application/json

Authorization: Bearer <GOOGLE_OAUTH_ACCESS_TOKEN>

X-Goog-User-Project: <PROJECT_ID>

Minimal sample body aligned with Google Gemini:

{

"contents": [

{

"parts": [

{

"text": "Reply with the single word OK."

}

]

}

]

}

Script-compatible sample body:

{

"contents": [

{

"role": "user",

"parts": [

{

"text": "Reply with the single word OK."

}

]

}

],

"generationConfig": {

"maxOutputTokens": 64

}

}

## Fields explained

Project_ID: The GCP project ID for Vertex.

Region: The GCP region for Vertex, such as us-central1.

Model: The model being called, such as gemini-2.5-flash.

X-ApiKey: The AI Guard key for Vertex.

Content-Type: Specifies the request payload format (always JSON).

Google_OAuth_Access_Token: This is an access token obtained from the Google authorization server.

Contents: List of conversations containing:

Role: The sender’s role. Options include: "user", "assistant", and "system".

Content: The actual content or query to be processed.

Vertex does not use a Gemini API key in the request.

It also requires a short-lived Google OAuth bearer token in the original request. AI Guard forwards the bearer token upstream.

OpenAI

Endpoint: POST https://proxy.zseclipse.net/v1/chat/completions

Headers:

X-ApiKey: <ZSCALER_AI_GUARD_KEY>

Content-Type: application/json

Sample Body:

{

"model": "<MODEL>",

"messages": [

{

"role": "user",

"content": "Reply with the single word OK."

}

],

"max_tokens": 64

}

## Fields explained

X-ApiKey: The AI Guard key for OpenAI.

Content-Type: Specifies the request payload format (always JSON).

Model: The model to query, such as gpt-4o-mini.

Messages: List of conversations containing:

Role: The sender’s role. Options include: "user", "assistant", and "system".

Content: The actual content or query to be processed.
