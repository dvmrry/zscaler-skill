# Cloud Connector API rate limits and how the Go and Python clients back off and retry (cloud-connector.api.rate-limits)
Also called: ztw rate limit; cloud connector api rate limits; cbc api 429; ztw retry-after; ztw heavy medium light; ztw retry policy

The Cloud & Branch Connector API documents weighted per-endpoint limits, while the Go SDK throttles on its own, simpler model. This subject records both, how they differ, and how the clients react to a 429 or a failing request.

## Documented limits

Cloud & Branch Connector weights its endpoints by method, as ZIA does: [Cloud & Branch Connector gives every endpoint a weight with a default rate limit; the typical defaults are Heavy (DELETE) 1 per minute and 40 per hour, Medium (POST, PUT) 1 per second and 400 per hour, and Light (GET) 2 per second and 1,000 per hour, and specific operations can carry a different weight.](kb:shared.oneapi.rate-limits:cbc-weights). An exceeded limit returns 429 with the retry interval in the body: [An exceeded Cloud & Branch Connector limit returns 429 with the retry interval in the response body, for example `{"message": "Rate Limit (1/SECOND) exceeded", "Retry-After": "0 seconds"}`.](kb:shared.oneapi.rate-limits:cbc-429-body).

## Client-side throttling

The Go SDK's OneAPI client limits ZTW and ZIA separately: [The Go SDK's OneAPI client throttles on the client side with a limiter per service: ZIA and ZTW, each at 20 GET and 10 POST/PUT/DELETE calls per 10 seconds. At v3.8.55 both had hourly caps of 950 GET, 950 POST/PUT and 380 DELETE per method; at v3.8.58 ZIA's hourly caps are per endpoint (method plus path, IDs normalized) at 950 GET, 380 POST/PUT and 380 DELETE, while ZTW keeps the per-method 950, 950 and 380. ZPA has 20 GET and 10 POST/PUT/DELETE calls per 10 seconds. ZCC and ZDX each get a limiter built as `NewRateLimiter(100, 3, 3600, 86400)`, whose arguments set 100 GET calls per 3,600 seconds and 3 POST/PUT/DELETE calls per 86,400 seconds whatever the path; its comment says 'downloadDevices: 3 per day', but `DownloadDevices` sends a GET. ZIdentity paths (prefix `ziam`), `/admin` paths and any path no service prefix matches use a default limiter, `NewRateLimiter(2, 1, 1, 1)`.](kb:shared.oneapi.rate-limits:go-client-limiters). The Go SDK's legacy ZTW client builds its rate limiter as 20 GET requests per 10 seconds and 10 POST, PUT or DELETE requests per 10 seconds. [cloud-connector.api.rate-limits:go-legacy-limiter] In the Go limiter's `Wait`, a DELETE is added to the same request list as POST and PUT (`postPutDeleteRequests`) and checked against the same limit; only the hourly cap, when one is set, is tracked separately for DELETE. [cloud-connector.api.rate-limits:go-delete-shares-write-window]

The Go SDK's ZTW limiters are looser than the documented server limits: they let DELETE run in the 10-per-10-seconds write window rather than 1 a minute, and the OneAPI ZTW limiter's hourly caps (380 DELETE, 950 POST or PUT) are above the documented 40 and 400, while the legacy limiter has no hourly cap. A Go client deleting or writing in bulk can therefore draw 429s that its own limiter did not prevent. [cloud-connector.api.rate-limits:go-limits-above-documented]

On a 429 the Python SDK's legacy ZTW client reads `Retry-After` from the response headers (defaulting to 2 when absent), strips a " seconds" suffix, and waits at least 1 second before retrying. [cloud-connector.api.rate-limits:python-legacy-retry-after]

## Retries in the legacy Go client

The legacy Go ZTW client's retry callback (`checkRetry`) retries any Too Many Requests response (`StatusTooManyRequests`, the one code `getRetryOnStatusCodes` returns) while the request context is live. For an Unauthorized, Conflict or Precondition Failed response (`StatusUnauthorized`, `StatusConflict`, `StatusPreconditionFailed`) it reads the JSON body and retries when it carries one of these markers: code `EDIT_LOCK_NOT_AVAILABLE`, message "Resource Access Blocked", or code `UNEXPECTED_ERROR` with the message "Failed during enter Org barrier" or "Request processing failed, possibly because an expected precondition was not met"; any other such response falls through to retryablehttp's `DefaultRetryPolicy`. [cloud-connector.api.rate-limits:legacy-retry-statuses] For a 5xx the same callback returns the SDK's shared server-error rule, `IsRetryableServerError`, which never retries Not Implemented (`StatusNotImplemented`) and always retries 502, 503 and 504. [cloud-connector.api.rate-limits:legacy-5xx-heuristic] How that rule treats other 5xx bodies is in [The legacy client's retry check hands every 5xx response to `IsRetryableServerError`. It never retries a status below 500 or 501, always retries 502, 503 and 504, retries any other 5xx whose body contains a transient marker (EDIT_LOCK_NOT_AVAILABLE, Resource Access Blocked, an org-barrier failure or a failed-precondition message), and otherwise refuses the retry only when the body is a JSON object with a nonempty string `code`.](kb:zia.sdk-go.legacy-retry-classification:five-xx-classification). When the legacy Go ZTW client runs out of retries while the callback still wants to retry, it hands back the last response rather than retryablehttp's bare "giving up" error, so the request layer can build an error from it. [cloud-connector.api.rate-limits:legacy-exhaustion-returns-response]

In the legacy Go ZTW client the API's error body survives to the error the caller gets. `do` replaces the first response's body with an in-memory copy, and the response logger it calls on every response (also the one it re-sends after a session refresh) dumps the response with its body, which replaces the body with an in-memory copy too. So `GenericRequest` closing the body before `CheckErrorInResponse` reads it loses nothing, including for a 401 that survives all attempts. [cloud-connector.api.rate-limits:legacy-error-body-kept] Retry behavior common to all Go products, including write replay, is in [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries).

What to check:
1. Whether a bulk delete loop stays under the documented Heavy weight (1 DELETE a minute, 40 an hour) rather than the Go limiter's write window, which lets DELETE run at the POST and PUT rate.
2. For a 429, whether the script reads Retry-After from the response body, where the API guide puts it, or from a header, which is where the Python legacy client looks.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.api.rate-limits:go-limits-above-documented] Tier B: Comparison of the documented typical weights with the limiter arguments; specific operations can carry other weights, and the client retries 429s. Not run.
- [cloud-connector.api.rate-limits:legacy-error-body-kept] Tier B: Code read at the pin, not run: `httputil.DumpResponse(resp, true)` replacing the body with a buffered copy is Go standard library behavior; the client's logger is always set (GetDefaultLogger). A caller-supplied HTTP client or logger is not considered. Corrects the legacy statement that a persistent 401's code and message cannot be parsed.

Area: cloud-connector.api, its subjects in references/_meta/spine/cloud-connector/cloud-connector.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.oneapi.rate-limits.md (OneAPI rate limits by product, and how the Go SDK throttles)
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/zia/zia.sdk-go.legacy-retry-classification.md (How the Go legacy ZIA client decides which 5xx to retry and what it returns)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.api.md (The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes)
- see-also references/_meta/text/cloud-connector/cloud-connector.api.conventions.md (Conventions of the Cloud Connector API capture: base path, default responses, paging and decoding)
- see-also references/_meta/text/zia/zia.api.rate-limits.md (ZIA API rate limits and how the Python SDK retries)
