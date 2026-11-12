# The Go SDK for ZDX: how it reaches the API and where its ZDX behavior is covered (zdx.sdk-go)
Also called: zdx go sdk; zscaler-sdk-go zdx; GetFromToFilters; go zdx time range

The Go SDK's ZDX packages (administration, alerts, inventory, reports and troubleshooting) and their functions and endpoints are generated: run `node scripts/kb.mjs surface zdx`. This subject points to the behavior around them.

**Time ranges.** Go ZDX report and alert functions such as `GetAllApps` and `GetOngoingAlerts` take the time range as `From` and `To` in Unix epoch seconds inside a `GetFromToFilters` struct, documented as returning the last 2 hours when not entered. [zdx.sdk-go:epoch-filters] The Python SDK's hours shorthand is in [A `since` value is a number of hours: the decorator sets `to` to the current Unix time and `from` to that time minus the hours times 3,600, unless the caller already set `from` or `to`.](kb:zdx.sdk-python.request-shaping:since-to-epoch).

**Clients.** The ZDX service functions work through the OneAPI client; the OneAPI client's ZDX limiter is in [The Go SDK builds its ZDX limiter with the same arguments as the ZCC one, commented as 100 calls per hour and 3 per day for downloadDevices.](kb:shared.oneapi.rate-limits:go-zdx-limiter-copies-zcc) and its request handling in [How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes](kb:shared.sdk-go.request-handling). The separate direct ZDX client, and why the services do not reach it, is in [The Go SDK's direct (legacy) ZDX client: credentials, sign-in, retries and limits, and why the ZDX services do not use it](kb:zdx.sdk-go.legacy-client).

**Defects.** Structs and functions that disagree with the contract are in [Go SDK ZDX services: where the structs and functions disagree with the contract](kb:zdx.sdk-go.service-defects); the deep-trace start payload's probe key is in [The Go SDK's `DeepTraceSessionPayload` serializes `session_name`, `app_id`, `web_probe_id`, `cloud_path_probe_id`, `session_length_minutes` and `probe_device`, with the three IDs and the length typed as Go `int`.](kb:zdx.diagnostics.start-request:go-payload). Which ZDX operations Go covers is in [Which ZDX API operations the Python and Go SDKs cover, and the configuration API neither calls](kb:zdx.api.client-coverage).

Area: zdx.sdk-go, its subjects in references/_meta/spine/zdx/zdx.sdk-go.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.oneapi.rate-limits.md (OneAPI rate limits by product, and how the Go SDK throttles)
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
- links-to references/_meta/text/zdx/zdx.api.client-coverage.md (Which ZDX API operations the Python and Go SDKs cover, and the configuration API neither calls)
- links-to references/_meta/text/zdx/zdx.diagnostics.start-request.md (Starting a deep trace through the API: the read chain, the request body, and where the clients disagree)
- links-to references/_meta/text/zdx/zdx.sdk-go.legacy-client.md (The Go SDK's direct (legacy) ZDX client: credentials, sign-in, retries and limits, and why the ZDX services do not use it)
- links-to references/_meta/text/zdx/zdx.sdk-go.service-defects.md (Go SDK ZDX services: where the structs and functions disagree with the contract)
- links-to references/_meta/text/zdx/zdx.sdk-python.request-shaping.md (How the Python SDK turns ZDX arguments into query parameters and bodies)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.sdk-python.md (The Python SDK for ZDX: where its ZDX behavior is covered)
- see-also references/_meta/text/zdx/zdx.api.md (The ZDX API from a client's side: hosts, limits, conventions, coverage and wire notes)
