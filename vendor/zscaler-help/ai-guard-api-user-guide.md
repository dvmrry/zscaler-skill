# AI Guard API Request Construction User Guide | Zscaler

**Source:** https://help.zscaler.com/ai-guard/ai-guard-api-user-guide
**Captured:** 2026-05-22 via Codex Browser.

---

AI Guard offers seamless integration with leading Large Language Model (LLM) providers, leveraging state-of-the-art Zscaler AI guardrails to safeguard AI-driven applications with LLM-powered detectors. These advanced guardrails provide robust protection, ensuring secure, reliable, and efficient operations while delivering the power of AI innovation to enterprises.

This article provides step-by-step guidance on constructing requests for different providers. Each provider’s request structure is explained in detail, breaking down fields and parameters for clarity. Follow these examples to quickly configure and interact with the APIs in your AI-based applications.

Complete the specific request constructions for your chosen application:

Anthropic

## Request overview

Anthropic provides text-generation capabilities using conversational "Claude" models.

## cURL example

bash

curl --location 'https://proxy.zseclipse.net/v1/messages' \

--header 'X-ApiKey: <API Key>' \

--header 'anthropic-version: 2023-06-01' \

--header 'Content-Type: application/json' \

--data '{

"model": "claude-3-haiku-20240307",

"messages": [{"role": "user", "content": "hey, generate 2 line c code"}],

"max_tokens": 1024

}'

## Fields explained

URL: https://proxy.zseclipse.net/v1/messages (Anthropic endpoint).

Headers:

X-ApiKey: The AI Guard application key which is mandatory for authentication.

Anthropic-version: API version in use (e.g., 2023-06-01).

Content-Type: Specifies the request payload format (always JSON).

Payload:

Messages: List of conversations containing:

Role: Sender’s role. Options: "user", "assistant", "system".

Content: Actual content or query to be processed.

Max_tokens: Maximum response token allowance.

Azure

## Request overview

Azure integrates OpenAI capabilities on its cloud using endpoints matching data center locations.

## cURL example

bash

curl --location 'https://proxy.zseclipse.net/openai/v1/chat/completions' \

--header 'X-ApiKey: <API Key>' \

--header 'Content-Type: application/json' \

--data '{

"model": "gpt-4",

"messages": [

{

"role": "user",

"content": "Hey, generate 2 line French poem and c code"

}

]

}'

## Fields explained

URL: https://proxy.zseclipse.net/v1/chat/completions (API endpoint)

Headers:

X-ApiKey: The AI Guard application key which is mandatory for authentication.

Content-Type: Specifies the request payload format (always JSON).

Payload (--data):

Model: The model to query, such as "gpt-4".

Messages: List of conversations containing:

Role: The sender’s role. Options include: "user", "assistant", and "system".

Content: The actual content or query to be processed.

Bedrock Anthropic

## Request overview

Amazon Bedrock supports Anthropic Claude models via customizable endpoints.

## cURL example

bash

curl --location 'https://proxy.zseclipse.net/model/<MODEL>/invoke' \

--header 'X-ApiKey: <API Key>' \

--header 'Content-Type: application/json' \

--data '{

"anthropic_version": "bedrock-2023-05-31",

"max_tokens": 10,

"messages": [

{

"role": "user",

"content": "hello are you there detectors EAST??"

}

]

}'

## Fields explained

Headers:

Model: The model to query, such as "anthropic.claude-3-5-sonnet-20240620-v1:0".

X-ApiKey: The AI Guard application key which is mandatory for authentication.

Content-Type: Specifies the request payload format (always JSON).

Payload:

Anthropic-version: API version in use (e.g., 2023-06-01).

Max_tokens: Maximum response token allowance.

Messages: List of conversations containing:

Role: Sender’s role. Options: "user", "assistant", "system".

Content: Actual content or query to be processed.

Bedrock Unified

## Request overview

Unified models on Bedrock operate on consistent message structures.

## cURL example

bash

curl --location 'https://proxy.zseclipse.net/model/<MODEL>/converse' \

--header 'X-ApiKey: <API Key>' \

--header 'Content-Type: application/json' \

--data '{ "messages": [ { "role": "user", "content": [ { "text": "Give me some code in 2 line python" } ] } ] }'

## Fields explained

Model: The model to query, such as "meta.llama3-1-8b-instruct-v1:0".

X-ApiKey: The AI Guard application key which is mandatory for authentication.

Content-Type: Specifies the request payload format (always JSON).

Messages:

Role: Sender’s role. Options: "user", "assistant", "system".

Content: The input message string inside an array-like structure.

Bedrock Agent

## Request overview

Bedrock functionality that uses your agent in an application by making a request with a runtime endpoint.

## cURL example

bash

curl --location 'https://proxy.zseclipse.net/agents/<AGENT_ID>/agentAliases/<AGENT_ALIAS_ID>/sessions/<SESSION_ID>/text' \

--header 'X-ApiKey: <API Key>' \

--header 'Content-Type: application/json' \

--data '{"inputText": "What is the capital of Japan?","enableTrace": true}'

## Fields explained

Agent_ID: (Path Parameter) The unique identifier for the specific agent you wish to interact with.

Agent_Alias_ID: (Path Parameter) The unique identifier for the specific alias of the agent. Aliases often represent different versions or configurations of an agent.

Session ID: (Path Parameter) The unique identifier for the conversation session. This allows for maintaining context across multiple interactions.

X-ApiKey: The AI Guard application key which is mandatory for authentication.

Content-Type: Specifies the request payload format (always JSON).

InputText: The textual query or message to be processed by the agent.

EnableTrace (Optional): A boolean flag. When set to true, the response will include detailed trace information regarding the agent's execution path.

Gemini

## Request overview

Used to connect API interactions with Google's Gemini models.

## cURL example

bash

curl --location 'https://proxy.zseclipse.net/v1beta/models/<MODEL>:generateContent' \

--header 'X-ApiKey: <API Key>' \

--header 'Content-Type: application/json' \

--data '{"contents": [{"parts": [{"text": "give me python code for printing a string"}]}]}'

## Fields explained

Model: The model to query, such as "gemini-2.5-flash".

X-ApiKey: The AI Guard application key which is mandatory for authentication.

Content-Type: Specifies the request payload format (always JSON).

Contents: Input structure to be processed. Contains an array of text parts:

Parts: Includes an object with a key "text" for instructions for the Gemini model.

OpenAI

## Request overview

OpenAI's API allows you to interact with their GPT models to generate text responses through AI Guard.

## cURL example

bash

curl --location 'https://proxy.zseclipse.net/v1/chat/completions' \

--header 'X-ApiKey: <API Key>' \

--header 'Content-Type: application/json' \

--data '{

"model": "gpt-4o-mini",

"messages": [

{

"role": "user",

"content": "Generate a poem"

}]

}'

## Fields explained

URL: https://proxy.zseclipse.net/v1/chat/completions (API endpoint)

Headers:

X-ApiKey: The AI Guard application key which is mandatory for authentication.

Content-Type: Specifies the request payload format (always JSON).

Payload (--data):

Model: The model to query, such as "gpt-4o-mini".

Messages: List of conversations containing:

Role: The sender’s role. Options include: "user", "assistant", and "system".

Content: The actual content or query to be processed.

Vertex AI

## Request overview

Google Vertex API interacts with Gemini models utilizing a Bearer token for authentication.

## cURL example

bash

curl --location 'https://proxy.zseclipse.net/v1/projects/<google-project>/locations/global/publishers/google/models/<MODEL>:generateContent' \

--header 'X-ApiKey: <API Key>' \

--header 'Authorization: <Bearer Access Token>' \

--header 'Content-Type: application/json' \

--data '{

"contents": [

{

"role": "user",

"parts": [

{

"text": "Testing google vertex api gemini endpoint."

}

]

}

]

}'

## Fields explained

Model: The model to query, such as "gemini-2.5-flash".

X-ApiKey: The AI Guard application key which is mandatory for authentication.

Authorization: Use the Google-generated Bearer token (gcloud auth print-access-token). JSON payload is split into input roles, parts, and text.

Content-Type: Specifies the request payload format (always JSON).

Contents: JSON payload is split into the following input:

Role: The sender’s role. Options include: "user", "assistant", and "system".

Parts: Includes an object with a key "text" for instructions for the Gemini model.

For implementation assistance, contact Zscaler Support.
