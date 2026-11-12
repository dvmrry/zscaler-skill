# The Python SDK for ZDX: where its ZDX behavior is covered (zdx.sdk-python)
Also called: zdx python sdk; zscaler-sdk-python zdx; client.zdx; ZDXService

The Python SDK reaches ZDX through `client.zdx` on a OneAPI client or through the legacy ZDX client; its ZDX modules, methods and endpoints are generated: run `node scripts/kb.mjs surface zdx`. This subject points to the behavior around them.

**Versions.** The 2.x beta line covers ZDX and drops the legacy clients: [The Python SDK's v2.x beta (`2.0.0bN`), announced in release 1.9.23, covers ZIA, ZDX and ZIdentity only; ZPA, ZCC, ZTW, ZTB and ZWA remain on v1.x, which stays the recommended GA release.](kb:cloud-connector.api.client-coverage:python-v2-excludes-ztw) and [The Python SDK's 2.x beta supports OneAPI only, with no LegacyZPAClient, and covers only ZIA, ZDX and ZIdentity so far; ZPA stays on 1.x.](kb:zpa.sdk-python.client-configuration:python-v2-no-legacy).

**Requests.** How arguments become query parameters, and the filters that go out under other names, are in [How the Python SDK turns ZDX arguments into query parameters and bodies](kb:zdx.sdk-python.request-shaping).

**Results.** Envelopes, attributes that come back None, and paging are in [What the Python SDK's ZDX results contain: envelopes, missing fields and paging](kb:zdx.sdk-python.response-models).

**Legacy client.** The direct-host client, its token cache and its behavior after the token expires are in [The Python SDK's legacy ZDX client: credentials, host and paths, token caching, and what happens when the token expires](kb:zdx.sdk-python.legacy-client).

**Per area.** Deep traces: [Starting a deep trace through the API: the read chain, the request body, and where the clients disagree](kb:zdx.diagnostics.start-request) and [Reading and deleting a deep trace through the API: the session record and its keys](kb:zdx.diagnostics.session-records). Score analysis: [ZDX Score analysis jobs through the API: starting one, polling it, and what the clients return](kb:zdx.diagnostics.analysis). Snapshots: [Sharing a ZDX snapshot of an alert or a user: the contract, the Python client and the path question](kb:zdx.alerts.snapshot). Coverage against Go and the contract: [Which ZDX API operations the Python and Go SDKs cover, and the configuration API neither calls](kb:zdx.api.client-coverage).

Area: zdx.sdk-python, its subjects in references/_meta/spine/zdx/zdx.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.api.client-coverage.md (Which clients cover which parts of the Cloud Connector API: Python v1 and v2, Go, Terraform)
- links-to references/_meta/text/zdx/zdx.alerts.snapshot.md (Sharing a ZDX snapshot of an alert or a user: the contract, the Python client and the path question)
- links-to references/_meta/text/zdx/zdx.api.client-coverage.md (Which ZDX API operations the Python and Go SDKs cover, and the configuration API neither calls)
- links-to references/_meta/text/zdx/zdx.diagnostics.analysis.md (ZDX Score analysis jobs through the API: starting one, polling it, and what the clients return)
- links-to references/_meta/text/zdx/zdx.diagnostics.session-records.md (Reading and deleting a deep trace through the API: the session record and its keys)
- links-to references/_meta/text/zdx/zdx.diagnostics.start-request.md (Starting a deep trace through the API: the read chain, the request body, and where the clients disagree)
- links-to references/_meta/text/zdx/zdx.sdk-python.legacy-client.md (The Python SDK's legacy ZDX client: credentials, host and paths, token caching, and what happens when the token expires)
- links-to references/_meta/text/zdx/zdx.sdk-python.request-shaping.md (How the Python SDK turns ZDX arguments into query parameters and bodies)
- links-to references/_meta/text/zdx/zdx.sdk-python.response-models.md (What the Python SDK's ZDX results contain: envelopes, missing fields and paging)
- links-to references/_meta/text/zpa/zpa.sdk-python.client-configuration.md (Python SDK settings for ZPA: credentials, tenant ID, microtenant, environment variables and the legacy client)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.sdk-go.md (The Go SDK for ZDX: how it reaches the API and where its ZDX behavior is covered)
- see-also references/_meta/text/zdx/zdx.api.md (The ZDX API from a client's side: hosts, limits, conventions, coverage and wire notes)
