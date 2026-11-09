# ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off (zcc.api.rate-limits)
Also called: zcc rate limit; zcc 429; zcc 100 calls per hour; downloadDevices 3 per day; X-Rate-Limit-Retry-After-Seconds; X-Rate-Limit-Remaining; zcc too many requests; zcc download rate limit

The ZCC API limits calls per organization and source IP, with a much smaller daily allowance for the three CSV download endpoints. How each Python client reacts to a 429 differs, and both differ from the vendor's advice.

## The limits

For an organization, all endpoints called from a given IP address are limited to 100 calls per hour, except `/downloadDevices`, `/downloadServiceStatus` and `/downloadDisableReasons`, which are limited to 3 calls per day. [zcc.api.rate-limits:hourly-and-daily-limits] Each rate-limit window starts at the first call, not on a clock boundary, and calls may come more than once per second as long as the limits are not exceeded. [zcc.api.rate-limits:window-and-burst]

Whether the three download allowances are separate or one pool, and whether they count against the hourly budget, is open [gap:zcc.api.rate-limits:download-cap-scope]. Whether two credentials from one IP share a bucket, and whether the OneAPI and legacy paths share it, is open [gap:zcc.api.rate-limits:bucket-scope]. Whether Zscaler raises the limit on request is open [gap:zcc.api.rate-limits:limit-increase].

## Headers and the 429

When limits are enforced the response carries `X-Rate-Limit-Remaining`, the requests left in the current window, and `X-Rate-Limit-Retry-After-Seconds`, the seconds to wait before the next call once the limit is exceeded. Exceeding the limit returns HTTP 429. [zcc.api.rate-limits:headers] Clients subject to rate limits must back off exponentially to proceed further. [zcc.api.rate-limits:back-off-exponentially] What base delay, multiplier or retry count to use is open [gap:zcc.api.rate-limits:backoff-parameters].

Whether `X-Rate-Limit-Remaining` is sent on successful responses is open [gap:zcc.api.rate-limits:remaining-on-success], and so is the body of a 429 [gap:zcc.api.rate-limits:body-shape-429].

## Python legacy client

The Python legacy ZCC client counts calls locally in `check_rate_limit`, which it calls before sending: 100 per hour for every path, and 3 per day for a path containing `/downloadDevices`. That function, which ends after incrementing the hourly counter, has no daily check for `/downloadServiceStatus` or `/downloadDisableReasons`, which the vendor article also limits to 3 calls per day. [zcc.api.rate-limits:legacy-local-counters] When a counter runs out, the caller gets an AttributeError instead of the client's rate-limit message: [When a local counter is exhausted, the helper raises AttributeError ('str' object has no attribute 'isoformat') instead of its ValueError messages, because the exception class it raises requires a datetime.](kb:zcc.sdk-python.client-configuration:legacy-preflight-message). On a 429 from any path other than `/downloadDevices` and `/downloadServiceStatus`, the Python legacy client adds one to an attempt counter and raises a ValueError when the counter reaches three; otherwise it waits the `X-Rate-Limit-Retry-After-Seconds` value plus one second, or 60 seconds when the header is absent or not all digits, and sends again. The counter starts at zero for each call, and zero-remaining responses and network errors add to it too, so with only 429s the client gives up on the third. [zcc.api.rate-limits:legacy-429-retry] For `/downloadDevices` and `/downloadServiceStatus` the Python legacy client does not retry a 429: it raises a ValueError at once whose message gives the `X-Rate-Limit-Retry-After-Seconds` value plus one second, or 86400 seconds when the header is absent or not all digits. [zcc.api.rate-limits:legacy-download-raise] The Python legacy client treats `/downloadDisableReasons` as an ordinary endpoint: it neither counts it against a daily allowance nor stops on its 429, but retries it like any other path, although the server allows it 3 calls a day. [zcc.api.rate-limits:legacy-disable-reasons-general]

The 429 branch of the Python legacy client's send loop always raises or retries, so the next check sees only other responses: when one carries `X-Rate-Limit-Remaining` set to 0, the client treats it as a soft 429, sleeps 60 seconds and goes back to the top of the loop, which sends the request again, raising a ValueError once the attempts reach `max_attempts` (3). This check comes before the response is checked for errors. [zcc.api.rate-limits:legacy-remaining-zero-resend]

## Python OneAPI client

The Python OneAPI request executor treats 429 as retryable and, absent a `Retry-After` header, takes its wait, plus one second, from the first of `x-ratelimit-reset`, `X-RateLimit-Reset`, `RateLimit-Reset`, `X-Rate-Limit-Retry-After-Seconds` and `X-Rate-Limit-Remaining` that is present, the last read as seconds. [zcc.api.rate-limits:oneapi-retry-headers] [A rateLimit maxRetrySeconds setting caps the wait: a computed backoff above it raises RetryTooLong instead of sleeping.](kb:shared.sdk-python.retries:max-retry-seconds) [The retry wait comes from Retry-After plus one second, or else from the rate-limit reset header plus one second; with neither header the request is not retried and an error is returned.](kb:shared.sdk-python.retries:wait-from-headers)

Go SDK retry behavior, shared across products, is in [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries).

What to check:
1. How many calls the tenant made from the same egress IP in the hour before the 429, counting every script and credential on that IP.
2. Whether the failing call was one of the three download endpoints, which allow 3 calls a day rather than 100 an hour.
3. Whether the client waited for `X-Rate-Limit-Retry-After-Seconds` before retrying, and for a Python legacy client, whether it resent a write after a response that reported 0 remaining.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.api.rate-limits:legacy-disable-reasons-general] Tier B: The special cases in the legacy client test the path for `/downloadDevices` and `/downloadServiceStatus` only.

Not known (open gaps):
- What exponential back-off the ZCC API expects [gap:zcc.api.rate-limits:backoff-parameters]: settled by support-ticket. Blocks: stating a back-off schedule the vendor considers compliant
- Whether the 3-a-day download allowance is per endpoint and separate from the hourly budget [gap:zcc.api.rate-limits:download-cap-scope]: settled by lab-test or support-ticket. Blocks: planning how many CSV exports a day a tenant can run and whether they starve other automation
- What shares a rate-limit bucket: credentials, auth paths, other products [gap:zcc.api.rate-limits:bucket-scope]: settled by lab-test or support-ticket. Blocks: deciding whether separate keys or the OneAPI path buy more ZCC throughput
- Whether ZCC rate limits can be raised [gap:zcc.api.rate-limits:limit-increase]: settled by support-ticket. Blocks: advising a large tenant that cannot finish its automation within 100 calls an hour
- Whether X-Rate-Limit-Remaining is sent on successful responses [gap:zcc.api.rate-limits:remaining-on-success]: settled by lab-test. Blocks: pacing a client from the remaining count instead of waiting for a 429
- The body of a ZCC 429 response [gap:zcc.api.rate-limits:body-shape-429]: settled by lab-test. Blocks: telling a rate-limit 429 from a device-threshold 429 in client logs

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.retries.md (How the Python SDK retries: budget, statuses, waits, re-authentication)
- decided-by references/_meta/text/shared/shared.oneapi.rate-limits.md (OneAPI rate limits by product, and how the Go SDK throttles): The OneAPI Client Connector page limits all endpoints to 100 calls per hour at the tenant level, except `/downloadDevices`, `/downloadServiceStatus` and `/downloadDisableReasons` at 3 calls per day, and sets `x-ratelimit-limit`, `x-ratelimit-remaining` and `x-ratelimit-reset` when limits are enforced. [shared.oneapi.rate-limits:zcc-oneapi-page]
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/zcc/zcc.sdk-python.client-configuration.md (The Python SDK's two ZCC clients: OneAPI service and legacy helper)
