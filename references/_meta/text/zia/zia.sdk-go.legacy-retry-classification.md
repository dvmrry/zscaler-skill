# How the Go legacy ZIA client decides which 5xx to retry and what it returns (zia.sdk-go.legacy-retry-classification)
Also called: go sdk retry 500 unexpected error; retry budget 100 to 10; IsRetryableServerError; giving up after attempts; go sdk 5xx retried

These are details of the Go legacy ZIA client's retry and error handling at the pinned SDK. The general retry policy and the OneAPI client are in [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries).

**Budget.** The Go legacy ZIA client's default retry budget is 10, lowered from 100; it can be overridden by the client configuration, the `WithRateLimitMaxRetries` option, or the `ZIA_CLIENT_RATE_LIMIT_MAX_RETRIES` environment variable. [zia.sdk-go.legacy-retry-classification:legacy-retry-budget-ten]

**Which 5xx are retried.** The legacy client's retry check hands every 5xx response to `IsRetryableServerError`. It never retries a status below 500 or 501, always retries 502, 503 and 504, retries any other 5xx whose body contains a transient marker (EDIT_LOCK_NOT_AVAILABLE, Resource Access Blocked, an org-barrier failure or a failed-precondition message), and otherwise refuses the retry only when the body is a JSON object with a nonempty string `code`. [zia.sdk-go.legacy-retry-classification:five-xx-classification] A 500 with an empty, malformed, HTML, code-less, numeric-code, empty-code, nested-code or array body is still retried by the legacy client's check, so it spends the whole retry budget. [zia.sdk-go.legacy-retry-classification:five-xx-unparsed-bodies-retried]

**When retries run out.** When the legacy client's retries run out without a transport error, its error handler returns the last response rather than a bare giving-up error, and logs the status. [zia.sdk-go.legacy-retry-classification:legacy-exhaustion-returns-response] On a non-success status the legacy request path builds an `ErrorResponse` with `CheckErrorInResponse`, which reads the whole response body and closes it, keeping the response with its HTTP status, any parsed code and message, and the body text as a string, but not a readable response body. [zia.sdk-go.legacy-retry-classification:error-response-consumes-body]

What to check:
1. Which SDK version the provider build carries, since the 5xx classification and the retry budget changed in the v3.8.4x releases.
2. That a permanent 500 was not simply retried to exhaustion before its API message was shown.
3. That code reading a failed call's response body expects it to be consumed.

Inferred, not quoted (say so when an answer rests on one):
- [zia.sdk-go.legacy-retry-classification:five-xx-unparsed-bodies-retried] Tier B: Holds because only a JSON object whose top-level `code` is a nonempty string is refused; the check is a client heuristic and not a ZIA error classification.

Area: zia.sdk-go, its subjects in references/_meta/spine/zia/zia.sdk-go.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
