# The ZDX API from a client's side: hosts, limits, conventions, coverage and wire notes (zdx.api)
Also called: zdx api; digital experience api; how to automate zdx; zdx api divergences; zdx api schemas; zdx sdk; zdx endpoints

Endpoint lists, HTTP methods, request and response fields, and the Go and Python SDK functions for ZDX are generated from the captured contract and the SDKs: run `node scripts/kb.mjs surface zdx` and read `vendor/zscaler-api-specs/automate-zscaler/openapi/zdx.openapi.json`. This subject family holds only the behavior around them and the places where those sources disagree.

**Calling the API.** Hosts and signing in, on the OneAPI gateway or the direct ZDX host, are in [ZDX API hosts and sign-in: the OneAPI gateway, the direct ZDX host, and which paths go where](kb:zdx.api.hosts-and-auth). Limits and how the clients pace themselves are in [ZDX API rate limits: the license tiers, the headers, and how the clients pace themselves](kb:zdx.api.rate-limits). Time ranges, paging and how API numbers relate to the console are in [ZDX API conventions: time ranges, paging, reporting delay and how API numbers differ from the console](kb:zdx.api.conventions). What each SDK covers, and the configuration API neither calls, is in [Which ZDX API operations the Python and Go SDKs cover, and the configuration API neither calls](kb:zdx.api.client-coverage).

**Wire notes by area.** Deep traces: [Starting a deep trace through the API: the read chain, the request body, and where the clients disagree](kb:zdx.diagnostics.start-request) and [Reading and deleting a deep trace through the API: the session record and its keys](kb:zdx.diagnostics.session-records). Score analysis: [ZDX Score analysis jobs through the API: starting one, polling it, and what the clients return](kb:zdx.diagnostics.analysis). Alerts: [ZDX alerts: how rules trigger, what an alert's status means, and reading alerts through the API](kb:zdx.alerts). Snapshots: [Sharing a ZDX snapshot of an alert or a user: the contract, the Python client and the path question](kb:zdx.alerts.snapshot).

**Clients.** The Python SDK's request shaping, result models and legacy client are in [The Python SDK for ZDX: where its ZDX behavior is covered](kb:zdx.sdk-python); the Go SDK's struct defects and direct client are in [The Go SDK for ZDX: how it reaches the API and where its ZDX behavior is covered](kb:zdx.sdk-go); the MCP server's deep-trace tools are in [The MCP server's ZDX deep-trace tools and troubleshooting prompt: inputs, results and mismatches](kb:zdx.diagnostics.mcp-tools). Behavior shared by all Go products is in [How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes](kb:shared.sdk-go.request-handling) and [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries).

Area: zdx.api, its subjects in references/_meta/spine/zdx/zdx.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/zdx/zdx.alerts.md (ZDX alerts: how rules trigger, what an alert's status means, and reading alerts through the API)
- links-to references/_meta/text/zdx/zdx.alerts.snapshot.md (Sharing a ZDX snapshot of an alert or a user: the contract, the Python client and the path question)
- links-to references/_meta/text/zdx/zdx.api.client-coverage.md (Which ZDX API operations the Python and Go SDKs cover, and the configuration API neither calls)
- links-to references/_meta/text/zdx/zdx.api.conventions.md (ZDX API conventions: time ranges, paging, reporting delay and how API numbers differ from the console)
- links-to references/_meta/text/zdx/zdx.api.hosts-and-auth.md (ZDX API hosts and sign-in: the OneAPI gateway, the direct ZDX host, and which paths go where)
- links-to references/_meta/text/zdx/zdx.api.rate-limits.md (ZDX API rate limits: the license tiers, the headers, and how the clients pace themselves)
- links-to references/_meta/text/zdx/zdx.diagnostics.analysis.md (ZDX Score analysis jobs through the API: starting one, polling it, and what the clients return)
- links-to references/_meta/text/zdx/zdx.diagnostics.mcp-tools.md (The MCP server's ZDX deep-trace tools and troubleshooting prompt: inputs, results and mismatches)
- links-to references/_meta/text/zdx/zdx.diagnostics.session-records.md (Reading and deleting a deep trace through the API: the session record and its keys)
- links-to references/_meta/text/zdx/zdx.diagnostics.start-request.md (Starting a deep trace through the API: the read chain, the request body, and where the clients disagree)
- links-to references/_meta/text/zdx/zdx.sdk-go.md (The Go SDK for ZDX: how it reaches the API and where its ZDX behavior is covered)
- links-to references/_meta/text/zdx/zdx.sdk-python.md (The Python SDK for ZDX: where its ZDX behavior is covered)
