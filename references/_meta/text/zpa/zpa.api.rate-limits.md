# ZPA API rate limits (zpa.api.rate-limits)
Also called: zpa api 429; zpa rate limit 20 per 10 seconds; retry-after 13s; zpa too many requests

ZPA limits calls per source IP in a 10-second window and answers 429 with a retry-after header. The ZIA limits are different, in [ZIA API rate limits and how the Python SDK retries](kb:zia.api.rate-limits).

**The limits.** For each organization, ZPA API calls from one IP address are limited to 20 GET calls and 10 POST, PUT or DELETE calls in a 10-second interval. [zpa.api.rate-limits:limits] The rate limits start as soon as the first call is executed, and calls may occur more than once per second within the limits. [zpa.api.rate-limits:window-start]

**When exceeded.** A call over the limit gets HTTP 429 with a retry-after response header (for example 13s) giving the time to wait before the next call. [zpa.api.rate-limits:retry-after]

What to check:
1. Whether bursts of reads exceed 20 in 10 seconds, or writes 10 in 10 seconds, from one source IP.
2. Whether the client waited the retry-after interval before retrying.

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zia/zia.api.rate-limits.md (ZIA API rate limits and how the Python SDK retries)
