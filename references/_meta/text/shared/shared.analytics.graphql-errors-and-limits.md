# Analytics GraphQL errors and rate limits: errors under HTTP 200, status codes, 1,000 calls a second (shared.analytics.graphql-errors-and-limits)
Also called: zins errors array; graphql 200 with errors; zins rate limit; analytics api 1000 per second; zins 403 insights reader; zins user-agent format; zdx graphql rate limit tier
Former IDs: shared-29

**Errors under 200.** A request can return HTTP 200 while one or more of its GraphQL queries failed; the errors are in the `errors` array of the response body. Causes include an upstream service failure for one data domain, a malformed query, invalid parameters such as `start_time`, `end_time` or `limit`, or requesting domains or fields the API client's role does not permit. [shared.analytics.graphql-errors-and-limits:errors-under-200] Each error carries `message`, `locations`, `path` and `extensions` with a `code`, an `http_status` and a `classification`; the example shows a `FORBIDDEN` 403 for one query under `data` that still holds an empty result. [shared.analytics.graphql-errors-and-limits:error-shape]

**Status codes.** 401 means missing or invalid credentials: no Authorization header, an expired, revoked or wrongly generated token, wrong audience or issuer claims, a token from another environment or tenant, or missing roles. [shared.analytics.graphql-errors-and-limits:status-401] 403 means the request is authenticated but the API client lacks the role for the data domain or function, or a platform security policy blocks access; the troubleshooting step is to verify that the API client has the Zscaler Insights Reader role. [shared.analytics.graphql-errors-and-limits:status-403] 400 means malformed syntax: GraphQL syntax errors or invalid JSON variables, or a required header such as User-Agent in the wrong format, which must be `PartnerName/AppName/Version (Device; OS Version) Region=COUNTRY`. [shared.analytics.graphql-errors-and-limits:status-400] 500 is an internal server error. [shared.analytics.graphql-errors-and-limits:status-500]

**Troubleshooting.** When a multi-domain query fails, isolate the individual queries; when every query fails, a successful introspection (where supported) confirms that authentication and connectivity work. [shared.analytics.graphql-errors-and-limits:troubleshooting]

**Rate limits.** All Analytics API endpoints are limited to 1,000 calls per second per tenant, and responses carry `x-ratelimit-limit`, `x-ratelimit-remaining` and `x-ratelimit-reset` (seconds remaining in the window). [shared.analytics.graphql-errors-and-limits:analytics-rate-limit] The earlier question about Z-Insights limits is closed [gap:shared.analytics.graphql-errors-and-limits:rate-limits]. The ZDX GraphQL API within Analytics is limited by license tier, from 5 per second, 30 per minute, 1,000 per hour and 10,000 per day at tier 1 (5,000 licenses) to 12 per second, 450 per minute, 22,500 per hour and 150,000 per day at tier 5 (more than 100,000). [shared.analytics.graphql-errors-and-limits:zdx-graphql-limits]

What to check:
1. Read the errors array of every response, including HTTP 200 ones, and isolate the failing domain query.
2. For 401 versus 403, whether the token is invalid (audience, issuer, environment or tenant) or valid but lacks the Zscaler Insights Reader role.
3. For a 400, whether the User-Agent header follows PartnerName/AppName/Version (Device; OS Version) Region=COUNTRY.

Area: shared.analytics, its subjects in references/_meta/spine/shared/shared.analytics.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.analytics.graphql.md (The Analytics (Z-Insights) GraphQL API: endpoint, access and scope)
- see-also references/_meta/text/shared/shared.oneapi.response-codes.md (OneAPI status codes, ZIA maintenance read-only mode, and 403 and 409 causes)
- see-also references/_meta/text/shared/shared.oneapi.rate-limits.md (OneAPI rate limits by product, and how the Go SDK throttles)
