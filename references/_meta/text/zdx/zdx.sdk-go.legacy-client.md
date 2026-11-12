# The Go SDK's direct (legacy) ZDX client: credentials, sign-in, retries and limits, and why the ZDX services do not use it (zdx.sdk-go.legacy-client)
Also called: zdx go legacy client; NewLegacyZdxClient; ZDX_API_KEY_ID; ZDX_API_SECRET; ZDX_CLOUD go; zdx v2_client; go zdx rate limiter; go zdx retries; legacy client is not set

Besides the OneAPI client, the Go SDK ships a ZDX client that signs in with a ZDX API key against the direct ZDX host. Its settings matter only for calls that actually go through it.

**Configuration and sign-in.** The Go ZDX client reads `ZDX_API_KEY_ID`, `ZDX_API_SECRET` and `ZDX_CLOUD`, and uses `https://api.zdxcloud.net` by default or the `https://api.%s.net` pattern filled with a named cloud. [zdx.sdk-go.legacy-client:env-and-host] It posts the sign-in to the base URL plus `/v1/oauth/token`, with the key ID, the current Unix timestamp and a key secret computed as the hex SHA-256 of the API secret, a colon and the timestamp. [zdx.sdk-go.legacy-client:token-request] Before each request it signs in again when it has no token or the token has expired. [zdx.sdk-go.legacy-client:token-expiry] A partner ID from `ZSCALER_PARTNER_ID` is sent on each request as the `x-partner-id` header. [zdx.sdk-go.legacy-client:partner-header]

**Retries.** On an unauthorized or forbidden response the client calls `Authenticate` again and retries the original request once; `Authenticate` requests a new token only when the cached one is missing, empty or expired, and otherwise returns the cached token. [zdx.sdk-go.legacy-client:reauth] Requests go through a retrying HTTP client whose defaults are 100 retries with waits of 5 to 20 seconds, and a maximum-retries setting of 0 means retrying without a practical limit (`math.MaxInt32`). [zdx.sdk-go.legacy-client:retry-defaults] Its backoff reads `X-Ratelimit-Remaining-Second` and `X-Ratelimit-Limit-Second`. When there is a response it waits 1 second plus up to 500 ms of jitter if fewer than the threshold (2 by default) requests remain, otherwise 2 seconds after a 429 and 500 ms for any other response; it backs off exponentially only when there is no response. [zdx.sdk-go.legacy-client:backoff] When the retry budget runs out without a transport error, the client returns the last API response instead of a bare give-up error. [zdx.sdk-go.legacy-client:retry-exhaustion] The 5xx classification shared by all Go clients is in [The OneAPI client's retry policy and the ZCC, ZDX, ZIA, ZPA, ZTW and ZWA v2 clients' retry policies all hand a 5xx response without a transport error to the shared `errorx.IsRetryableServerError` helper.](kb:shared.sdk-go.retries:shared-5xx-classifier).

**The fixed limiter.** The client's configuration installs a global limiter of 100 requests per 60 seconds with an additional 5-second delay on `cfg.HTTPClient`, the client the sign-in request uses; each API request instead builds a fresh retrying client with `getHTTPClient` and no rate limiter, whose transport is a plain `http.Transport` wrapped by `errorx.TrackAttempts`. [zdx.sdk-go.legacy-client:global-limiter] So the fixed 100-per-60-seconds limiter paces only sign-in requests; API calls through this client are paced only by the backoff and the server's limits. [zdx.sdk-go.legacy-client:limiter-auth-only]

**Which calls use this client.** The ZDX service functions call `service.Client.NewRequestDo`, which on a service configured for legacy clients forwards to the legacy ZPA client and fails with 'legacy client is not set' when that client is nil; the function that forwards to the legacy ZDX client is `NewZdxRequestDo`. [zdx.sdk-go.legacy-client:service-routing] So a service built with `NewLegacyZdxClient` cannot run the ZDX service functions: they reach the missing legacy ZPA client and return an error, and the direct ZDX client's sign-in, retries and limiter never apply to them; the SDK's ZDX example builds a OneAPI service instead. [zdx.sdk-go.legacy-client:services-not-routed]

What to check:
1. Whether the Go program built a OneAPI service or a legacy ZDX service: the ZDX service functions fail on a legacy service that has no ZPA client.
2. Whether request pacing was expected from the 100-per-minute limiter, which throttles only the sign-in call.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.sdk-go.legacy-client:limiter-auth-only] Tier B: Read from where each HTTP client is used at the pin; `getHTTPClient` never references its rate-limiter argument.
- [zdx.sdk-go.legacy-client:services-not-routed] Tier B: A search of `zscaler/zdx/services` at the pin finds every ZDX service function calling `service.Client.NewRequestDo` and none calling `NewZdxRequestDo`, which only a unit test calls; not run against a tenant.

Area: zdx.sdk-go, its subjects in references/_meta/spine/zdx/zdx.sdk-go.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.sdk-go.md (The Go SDK for ZDX: how it reaches the API and where its ZDX behavior is covered)
- see-also references/_meta/text/zdx/zdx.api.hosts-and-auth.md (ZDX API hosts and sign-in: the OneAPI gateway, the direct ZDX host, and which paths go where)
- see-also references/_meta/text/zdx/zdx.api.rate-limits.md (ZDX API rate limits: the license tiers, the headers, and how the clients pace themselves)
