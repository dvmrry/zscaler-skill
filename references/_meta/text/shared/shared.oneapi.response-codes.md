# OneAPI status codes, ZIA maintenance read-only mode, and 403 and 409 causes (shared.oneapi.response-codes)
Also called: oneapi status codes; STATE_READONLY; x-zscaler-mode read-only; 403 during maintenance; 409 edit conflict oneapi; 415 unsupported media type zia; oneapi error codes

OneAPI returns 401 for an invalid, expired or missing authorization token, 403 when the API client lacks access to the resource, 404 for a resource not found, 408 when the client took too long to send the request, 413 when the request exceeds the maximum size, 429 when the client exceeded the rate limit or quota, 500 for an internal server error, 503 when the resource is temporarily unavailable and 504 when the server took too long to respond. [shared.oneapi.response-codes:common-codes] The APIs of specific Zscaler services may also use status codes exclusive to that service. [shared.oneapi.response-codes:product-specific-codes]

**Maintenance read-only mode.** When a ZIA call fails because of an upgrade or scheduled maintenance of the API service, it returns 403 with the header `x-zscaler-mode: read-only` and a body whose code is `STATE_READONLY`; during that period the API service supports only read operations via GET. [shared.oneapi.response-codes:read-only-mode] A maintenance 403 can therefore be told apart from a permission 403 by the `x-zscaler-mode: read-only` header or the `STATE_READONLY` code; a 403 without them points to the role, SKU or access causes. [shared.oneapi.response-codes:read-only-distinguishable]

**ZIA.** ZIA returns 403 when the user's role has no access permissions or functional scope, when a required SKU subscription is missing, or when POST, PUT or DELETE operations are made while the admin portal is in maintenance mode during a scheduled upgrade. [shared.oneapi.response-codes:zia-403-causes] ZIA returns 409 when a possible edit conflict occurred, for example another admin saving a change at the same time; the OneAPI page says the API client then retries automatically after a short time. [shared.oneapi.response-codes:zia-409] ZIA returns 415 when the request does not carry `Content-Type: application/json`. [shared.oneapi.response-codes:zia-415]

**Cloud & Branch Connector.** Cloud & Branch Connector returns 403 when the API key was disabled by the service provider, the role lacks permission or functional scope, or a POST, PUT or DELETE was made during maintenance mode, and 409 on a possible edit conflict with another admin saving at the same time; its 429 includes a Retry-After value. [shared.oneapi.response-codes:cbc-403-409]

**Other products.** Client Connector's codes are in [The ZCC API's documented status codes are 200, 400, 401, 403, 404, 415 (Unsupported Media Type), 429 and 500. 429 means too many requests: the rate limit or a device threshold was exceeded. The table labels 500 "Not Implemented".](kb:zcc.api.conventions:status-codes). The Analytics API's codes, including errors returned under HTTP 200, are in [Analytics GraphQL errors and rate limits: errors under HTTP 200, status codes, 1,000 calls a second](kb:shared.analytics.graphql-errors-and-limits). The legacy ZIA codes are in [ZIA legacy API status codes and per-endpoint rate limits](kb:shared.legacy-api.zia-errors-and-limits).

Whether the Cloud & Branch Connector maintenance 403 carries the same header and code is not shown [gap:shared.oneapi.response-codes:cbc-readonly-body].

One status-to-code pairing is documented in the SDK: The Go SDK documents that validating an invalid custom ZIA IPS signature rule text with POST /ipsSignatureRules/validateRuleText returns HTTP 400 with a standard error envelope carrying INVALID_INPUT_ARGUMENT. [shared.oneapi.response-codes:sdk-400-invalid-input]

What to check:
1. For a 403 from ZIA, whether the response carries x-zscaler-mode: read-only or the STATE_READONLY code (maintenance) or neither (role, SKU or permission).
2. For a 409 from ZIA or Cloud & Branch Connector, whether another admin or script was saving at the same time.
3. For a 400 with DUPLICATE_ITEM or INVALID_INPUT_ARGUMENT, read the message for the field, then fix the request or reuse the existing object; the status code is unconfirmed.
4. For a 401, the token is missing, expired or invalid: check the token request and its audience, then the credentials.
5. For a 403, check the API client's resource for the product first. A maintenance 403 is told apart from a permission 403 by its header and code.
6. For a 404, verify the resource ID, the customer ID for ZPA, and the path.
7. For a 409 EDIT_LOCK_NOT_AVAILABLE, wait a few seconds and retry. The Python SDK's lock retry starts at 5 seconds, doubles, and is capped at 60.
8. For another 409 from ZIA, treat it as an edit conflict and retry after a short wait.
9. For a 409 about activation queues or invalid pending changes, follow the activation checks rather than retrying the write.
10. For a 429, wait for the Retry-After or reset-header interval before the next call.
11. For a 403 whose header is `x-zscaler-mode: read-only` and whose code is `STATE_READONLY`, wait for the maintenance window to end; reads still work.
12. For a 5xx, do not assume the Python SDK retries it: its executor retries only 429, 503 and 504, so a 500 or 502 needs your own retry.

Inferred, not quoted (say so when an answer rests on one):
- [shared.oneapi.response-codes:read-only-distinguishable] Tier B: Inference from the sample response; no source says every maintenance 403 carries the header or that no other 403 does.

Not known (open gaps):
- Body and header of a Cloud & Branch Connector maintenance 403 [gap:shared.oneapi.response-codes:cbc-readonly-body]: settled by lab-test or support-ticket. Blocks: telling a Cloud & Branch Connector maintenance refusal from a permissions error
- Which HTTP status carries DUPLICATE_ITEM and INVALID_INPUT_ARGUMENT [gap:shared.oneapi.response-codes:status-400-codes]: settled by source-read
- How to recover from a 5xx response [gap:shared.oneapi.response-codes:server-error-recovery]: settled by source-read

Area: shared.oneapi, its subjects in references/_meta/spine/shared/shared.oneapi.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.analytics.graphql-errors-and-limits.md (Analytics GraphQL errors and rate limits: errors under HTTP 200, status codes, 1,000 calls a second)
- links-to references/_meta/text/shared/shared.legacy-api.zia-errors-and-limits.md (ZIA legacy API status codes and per-endpoint rate limits)
- links-to references/_meta/text/zcc/zcc.api.conventions.md (Conventions of the ZCC v1 API: casing, query parameters, caching, status codes)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.oneapi.write-practices.md (Writing through OneAPI: fetch before update, activation, edit locks)
