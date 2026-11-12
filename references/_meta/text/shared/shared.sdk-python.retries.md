# How the Python SDK retries: budget, statuses, waits, re-authentication (shared.sdk-python.retries)
Also called: python sdk retries; maxRetries; maxRetrySeconds; RetryTooLong; python sdk 429; python sdk 401 reauth; Retry-After python

These are claims about the Python SDK's OneAPI request executor, shared by every product. The Go SDK's retries are in [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries); each product's own rate limits and wait headers are in its rate-limits subject, for example [ZIA API rate limits and how the Python SDK retries](kb:zia.api.rate-limits) and [ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off](kb:zcc.api.rate-limits).

**Budget.** The executor reads `client.rateLimit.maxRetries` from the configuration with a default of 2, and rejects a negative value. [shared.sdk-python.retries:max-retries] A rateLimit maxRetrySeconds setting caps the wait: a computed backoff above it raises RetryTooLong instead of sleeping. [shared.sdk-python.retries:max-retry-seconds]

**What is retried.** The Python executor's retryable-status helper documents 429, 500, 502, 503 and 504 as retryable, but its code tests only 429, 503 and 504, so a 500 or 502 is not retried by it. [shared.sdk-python.retries:retryable-statuses] [divergence:shared.sdk-python.retries:retryable-docstring] The branch that retries the retryable statuses (`TOO_MANY_REQUESTS`, `SERVICE_UNAVAILABLE` and `GATEWAY_TIMEOUT`) is decided by `attempts < max_retries` and `is_retryable_status(response.status_code)`, and `is_retryable_status` takes only the status; the request method is not consulted. [shared.sdk-python.retries:method-not-consulted] The retry wait comes from Retry-After plus one second, or else from the rate-limit reset header plus one second; with neither header the request is not retried and an error is returned. [shared.sdk-python.retries:wait-from-headers]

**Expired tokens.** On a 401 the executor clears the OAuth token, fetches a new one and retries while attempts remain; otherwise it returns a token-refresh-exhausted error. [shared.sdk-python.retries:reauth-on-401] A legacy client has no OAuth handler to re-authenticate with: [The request executor creates no OAuth handler for legacy clients (a ZDX legacy client makes the executor a legacy one), and on a 401 it re-authenticates only when one exists, so a 401 on the legacy ZDX client is returned as an error ('401 Unauthorized - token refresh attempts exhausted or OAuth not available.').](kb:zdx.sdk-python.legacy-client:no-reauth).

**Client-side throttling.** The ZIA, ZPA, ZTW and ZTB legacy clients each build a `RateLimiter` and keep it as `self.rate_limiter` (the ZPA one commented as allowing 20 GET and 10 POST/PUT/DELETE requests per 10 seconds), but no code in the `zscaler` package calls the limiter's `wait` or `update_limits`, so none of these clients paces its requests with it. [shared.sdk-python.retries:legacy-rate-limiter-unused]

What to check:
1. Whether a write that timed out with a 503 or 504 was retried and so possibly applied twice, since the retry does not look at the method.

Sources disagree (name both sides):
- The is_retryable_status docstring and its code list different retryable statuses. [divergence:shared.sdk-python.retries:retryable-docstring]
  - sdk-python: The docstring lists 429, 500, 502, 503 and 504 as retryable.
  - sdk-python: The code returns True only for 429, 503 and 504.
  Impact: Trusting the docstring assumes 500 and 502 responses are retried; the executor does not retry them.

Area: shared.sdk-python, its subjects in references/_meta/spine/shared/shared.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/zcc/zcc.api.rate-limits.md (ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off)
- links-to references/_meta/text/zdx/zdx.sdk-python.legacy-client.md (The Python SDK's legacy ZDX client: credentials, host and paths, token caching, and what happens when the token expires)
- links-to references/_meta/text/zia/zia.api.rate-limits.md (ZIA API rate limits and how the Python SDK retries)
