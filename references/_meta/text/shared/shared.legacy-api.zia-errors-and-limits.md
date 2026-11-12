# ZIA legacy API status codes and per-endpoint rate limits (shared.legacy-api.zia-errors-and-limits)
Also called: zia legacy status codes; zia legacy 403 causes; zia api rate limit summary; status activate rate limit; authenticatedSession rate limit; configAudit rate limit; Rate Limit (1/SECOND) exceeded

The legacy ZIA API returns 200 and 204 on success, 400 for an invalid request, 401 when the session is not authenticated or timed out, 403, 404 when the resource does not exist, 405 for an unsupported method, 409 for an edit conflict, 415 without an application/json Content-Type, 429 over the rate limit or quota (with a Retry-After value), 500 for an unexpected error and 503 when the service is temporarily unavailable. [shared.legacy-api.zia-errors-and-limits:status-codes] A legacy 403 has one of four causes: the API key was disabled by the service provider, the user's role lacks access permissions or functional scope, a required SKU subscription is missing, or a POST, PUT or DELETE was made while the admin portal was in maintenance mode during a scheduled upgrade. [shared.legacy-api.zia-errors-and-limits:four-403-causes] A legacy 409 means a possible edit conflict, for example another admin saving at the same time, and the client is expected to retry after a short time. [shared.legacy-api.zia-errors-and-limits:legacy-409]

**Default limits.** The default weights and the rate-limit headers are in [ZIA API rate limits and how the Python SDK retries](kb:zia.api.rate-limits). An exceeded limit returns 429 with the retry interval in the response body, for example `{ "message": "Rate Limit (1/SECOND) exceeded", "Retry-After": "0 seconds" }`. [shared.legacy-api.zia-errors-and-limits:legacy-429-body]

**Per-endpoint exceptions.** The vendor's rate limit summary lists each ZIA resource URI's limit per method and says the limits are subject to change. [shared.legacy-api.zia-errors-and-limits:summary-subject-to-change] `/authenticatedSession` allows 2 per second and 1,000 per hour for GET, POST and DELETE, and `/status` 2 per second and 1,000 per hour for GET. [shared.legacy-api.zia-errors-and-limits:session-endpoint-limits] `/status/activate` allows POST at 10 per minute and 40 per hour. [shared.legacy-api.zia-errors-and-limits:activate-endpoint-limit] The provider documentation gives the same activation budget: [The provider documentation gives the activation endpoint a budget of 10 POST requests per minute and 40 per hour, which a configuration of any meaningful size exhausts when every resource activates in flight.](kb:zia.terraform.activation-methods:activation-endpoint-budget). Every endpoint has a weight with a default rate limit, but some endpoints have exceptions; the API Rate Limit Summary gives per-endpoint limits such as `/configAudit` GET at 1 per hour and 8 per day, `/cloudApplications/bulkUpdate` PUT at 1 per minute and up to 4 per hour, `/auditlogEntryReport` POST at 10 per minute and 40 per hour, and `/app_view/{appViewId}/apps` GET at 25 per day on a trial or 1,000 per day with a license. [shared.legacy-api.zia-errors-and-limits:endpoint-exceptions]

What to check:
1. For a 403 from the legacy API, which of the four causes applies: disabled API key, role scope, missing SKU, or a write during maintenance.
2. For a 429 on activation, whether the script activates more than 10 times a minute or 40 times an hour.
3. For an endpoint not in the default weights, its own row in the rate limit summary.

Area: shared.legacy-api, its subjects in references/_meta/spine/shared/shared.legacy-api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.api.rate-limits.md (ZIA API rate limits and how the Python SDK retries)
- links-to references/_meta/text/zia/zia.terraform.activation-methods.md (Activating ZIA changes from Terraform: methods, session end and concurrent applies)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.oneapi.response-codes.md (OneAPI status codes, ZIA maintenance read-only mode, and 403 and 409 causes)
- see-also references/_meta/text/shared/shared.legacy-api.zia-session.md (ZIA legacy API sessions: API key obfuscation, JSESSIONID and the cloud service API key)
