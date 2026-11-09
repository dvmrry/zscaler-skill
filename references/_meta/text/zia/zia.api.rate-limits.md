# ZIA API rate limits and how the Python SDK retries (zia.api.rate-limits)
Also called: zia api rate limit; 429 too many requests zia; x-ratelimit-reset; EDIT_LOCK_NOT_AVAILABLE; python sdk retries; maxRetries rateLimit; RetryTooLong

ZIA enforces per-endpoint limits and answers 429 when they are exceeded; the Python SDK retries a small set of statuses on its own. The Go SDK's retry behavior is in [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries), and the SCIM limit is in [ZIA SCIM server operations, paging and rate limit](kb:zia.scim.operations).

**The limits.** Every ZIA endpoint has two rate limits: a lower-bound limit against short bursts and an upper-bound limit against sustained volume. [zia.api.rate-limits:zia-two-bounds] Endpoints are weighted: Heavy, typically DELETE, defaults to 1 request per minute and 4 per hour; Medium, POST and PUT, to 1 per second and 400 per hour; Light, GET, to 2 per second and 1,000 per hour. [zia.api.rate-limits:zia-default-weights] An exceeded limit returns HTTP 429, and ZIA responses carry x-ratelimit-limit, x-ratelimit-remaining and x-ratelimit-reset, the last being the seconds left in the current window. [zia.api.rate-limits:zia-429-headers]

**SDK retries.** [The executor reads `client.rateLimit.maxRetries` from the configuration with a default of 2, and rejects a negative value.](kb:shared.sdk-python.retries:max-retries) Which statuses the executor retries is in [The Python executor's retryable-status helper documents 429, 500, 502, 503 and 504 as retryable, but its code tests only 429, 503 and 504, so a 500 or 502 is not retried by it.](kb:shared.sdk-python.retries:retryable-statuses). The SDK's two lists of retryable statuses disagree [divergence:zia.api.rate-limits:retryable-status-sets]. [The retry wait comes from Retry-After plus one second, or else from the rate-limit reset header plus one second; with neither header the request is not retried and an error is returned.](kb:shared.sdk-python.retries:wait-from-headers) [A rateLimit maxRetrySeconds setting caps the wait: a computed backoff above it raises RetryTooLong instead of sleeping.](kb:shared.sdk-python.retries:max-retry-seconds)

**Edit lock.** For ZIA a 409 whose body contains EDIT_LOCK_NOT_AVAILABLE, meaning another admin session holds the edit lock, is retried with a backoff of 5 seconds doubling per attempt and capped at 60. [zia.api.rate-limits:zia-edit-lock-retry]

What to check:
1. Which weight class the failing call falls in (delete, write, read) against the per-second, per-minute and per-hour ceilings.
2. Whether the client retried: the status was one the SDK retries, and the retry budget was not exhausted or capped by maxRetrySeconds.
3. Whether a 409 on a write was the edit lock held by another admin session, which the SDK retries on its own schedule.

Sources disagree (name both sides):
- The SDK holds two different sets of retryable statuses: a constant and a helper that include 500 and 502, and the executor's own check that does not. [divergence:zia.api.rate-limits:retryable-status-sets]
  - sdk-python: RETRYABLE_STATUS_CODES is {429, 500, 502, 503, 504}, and the utils helper tests membership in it.
  - sdk-python: The executor's is_retryable_status returns true only for 429, 503 and 504, though its docstring lists 500 and 502 too.
  Impact: A 500 or 502 from ZIA is not retried by the request executor's rate-limit path even though the constant suggests it would be.

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.retries.md (How the Python SDK retries: budget, statuses, waits, re-authentication)
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/zia/zia.scim.operations.md (ZIA SCIM server operations, paging and rate limit)
