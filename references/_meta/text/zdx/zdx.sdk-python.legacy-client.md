# The Python SDK's legacy ZDX client: credentials, host and paths, token caching, and what happens when the token expires (zdx.sdk-python.legacy-client)
Also called: LegacyZDXClient; LegacyZDXClientHelper; ZDX_CLIENT_ID; ZDX_CLIENT_SECRET; ZDX_CLOUD; python zdx legacy auth; python zdx 401 after an hour; zdxbeta

The Python SDK's legacy ZDX client signs in with a ZDX API key against the direct ZDX host instead of using a ZIdentity OneAPI client. It is the one Python ZDX path whose host, paths and token handling differ from OneAPI.

**Configuration.** The legacy ZDX client takes `key_id` and `key_secret` (or `ZDX_CLIENT_ID` and `ZDX_CLIENT_SECRET`) and `ZDX_CLOUD` (default `zdxcloud`; `zdxbeta` is the other documented value), refuses to start without both credentials, and targets the host `https://api.{self._env_cloud}.net`. [zdx.sdk-python.legacy-client:env-and-host] A partner ID from the `partnerId` setting or `ZSCALER_PARTNER_ID` is added to every request as the `x-partner-id` header. [zdx.sdk-python.legacy-client:partner-header]

**Sign-in.** It signs in by posting `key_id`, a `key_secret` equal to the hex SHA-256 of the client secret, a colon and the current epoch time, and that `timestamp`, to the host's `/v1/oauth/token`. [zdx.sdk-python.legacy-client:token-request]

**Paths.** On the legacy client the request executor strips the leading `/zdx` from each endpoint (the services build `/zdx/v1` paths) and joins the rest to the host, so data calls go to the host under `/v1`, the same prefix as the sign-in. [zdx.sdk-python.legacy-client:prefix-stripped]

**Token lifetime.** The client keeps tokens in a module-level `_token_cache` keyed by client ID and secret; its constructor builds the session, which calls `create_token`, and `create_token` reuses a cached token whenever one exists for the key. [zdx.sdk-python.legacy-client:token-cache] The request executor creates no OAuth handler for legacy clients (a ZDX legacy client makes the executor a legacy one), and on a 401 it re-authenticates only when one exists, so a 401 on the legacy ZDX client is returned as an error ('401 Unauthorized - token refresh attempts exhausted or OAuth not available.'). [zdx.sdk-python.legacy-client:no-reauth] So once the cached token expires (ZDX tokens last 3,600 seconds), every request from that process, including from newly built legacy clients with the same credentials, gets a 401 until the process restarts. [zdx.sdk-python.legacy-client:stale-token]

**Rate-limit headers.** The client reads `X-Ratelimit-Remaining-Second` only on a 429 to its sign-in and in its JWKS fetch; its general rate-limited GET helper, which also reads `X-Ratelimit-Limit-Second`, is defined but not called. [zdx.sdk-python.legacy-client:second-headers] Retries for API calls follow the executor's general rule, [The retry wait comes from Retry-After plus one second, or else from the rate-limit reset header plus one second; with neither header the request is not retried and an error is returned.](kb:shared.sdk-python.retries:wait-from-headers).

What to check:
1. Whether a long-running Python process on the legacy ZDX client started getting 401 responses about an hour after its first sign-in; a new process signs in again.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.sdk-python.legacy-client:stale-token] Tier B: Read from the code at the pin: `create_token` is called only from `_build_session`, and the cache check does not look at the token's age. Not observed against a tenant.
- [zdx.sdk-python.legacy-client:second-headers] Tier B: A search of `zscaler/` at the pin finds no call to `_get_with_rate_limiting`; data requests go through the client's `send`, which reads no rate-limit header.

Area: zdx.sdk-python, its subjects in references/_meta/spine/zdx/zdx.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.retries.md (How the Python SDK retries: budget, statuses, waits, re-authentication)
