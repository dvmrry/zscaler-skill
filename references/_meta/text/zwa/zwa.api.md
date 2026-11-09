# The Workflow Automation API from a client's side: hosts, the Python and Go clients, and what neither SDK covers (zwa.api)
Also called: zwa api; workflow automation api; zsworkflow; client.zwa; LegacyZWAClient; ZWA_API_KEY_ID; ZWA_CLIENT_ID; zwa sdk; zwa mcp; workflow automation mcp
Former IDs: zwa-04

Methods and paths of both SDKs are generated: `node scripts/kb.mjs surface zwa`; no OpenAPI capture of this API is in the generated layer, so the reference is the help API page. Signing in with an API key is in [Workflow Automation's API is enabled with its subscription; a POST of `key_id` and `key_secret` to /v1/auth/api-key/token on `https://api.us1.zsworkflow.net` returns 201 with a bearer token and its `expires_in` (43200 in the example), and a call after the token expires returns 401.](kb:shared.legacy-api.auth-models:wa-token), [A Workflow Automation API key expires only when its Expire after option is enabled, and its key secret is visible only when the key is first created.](kb:shared.legacy-api.auth-models:wa-key-expiry) and [A failed Workflow Automation token request returns 401 when the API key is expired or disabled and 500 when the request is corrupt.](kb:shared.legacy-api.auth-models:wa-errors).

## Python

The Python SDK's `ZWAService` exposes two services, `audit_logs` and `dlp_incidents`. [zwa.api:python-services] The Python ZWA modules build paths under `/zwa/dlp/v1`; in legacy mode the request executor strips the `/zwa` prefix and sends the request to the legacy helper's base URL, `https://api.{self._env_cloud}.zsworkflow.net`. [zwa.api:python-oneapi-paths] Python's `LegacyZWAClient` takes `key_id`, `key_secret` and `cloud` from its configuration or from `ZWA_CLIENT_ID`, `ZWA_CLIENT_SECRET` and `ZWA_CLOUD` (default `us1`) and passes them to its helper, which sets its URL to the `zsworkflow.net` API host for that cloud and posts the key ID and secret to `/v1/auth/api-key/token` on it. [zwa.api:python-legacy-client] With a legacy client, `client.zwa` returns the legacy helper itself, which has its own `audit_logs` and `dlp_incidents` properties; otherwise it returns a `ZWAService`. [zwa.api:python-legacy-accessor] The docstring examples of `audit_logs` and `dlp_incident_search` call `client.zwa.incident_search`, while `ZWAService` defines the properties `audit_logs` and `dlp_incidents`. [zwa.api:python-docstring-accessor] So `incident_search` is not a `ZWAService` property and the docstring examples fail as written; the methods are reached through `client.zwa.audit_logs` and `client.zwa.dlp_incidents`. [zwa.api:python-docstring-accessor-broken]

## Go

The Go ZWA services take a `zwa.Client`, configured from `ZWA_API_KEY_ID`, `ZWA_API_SECRET` and `ZWA_CLOUD`, whose base URL is `https://api.%s.zsworkflow.net` for the configured cloud or `https://api.us1.zsworkflow.net` when none is set; it signs in at `/v1/auth/api-key/token` on that base. [zwa.api:go-client] So the Go SDK reaches Workflow Automation only through the API-key client on the Workflow Automation host; it has no OneAPI path for ZWA, unlike Python. [zwa.api:go-legacy-only] The two SDKs read different environment variables for the same API key: the Go client reads `ZWA_API_KEY_ID` and `ZWA_API_SECRET`, Python's legacy client `ZWA_CLIENT_ID` and `ZWA_CLIENT_SECRET`; both read `ZWA_CLOUD`. [zwa.api:env-names-differ] The Go config's environment tag for the rate-limit maximum wait is `ZZWA_CLIENT_RATE_LIMIT_MAX_WAIT`, with a doubled Z, while the minimum-wait tag is `ZWA_CLIENT_RATE_LIMIT_MIN_WAIT`, with the `ZWA_` prefix. [zwa.api:go-env-typo]

The Go client's 5xx retry decision is shared with the other products: [The OneAPI client's retry policy and the ZCC, ZDX, ZIA, ZPA, ZTW and ZWA v2 clients' retry policies all hand a 5xx response without a transport error to the shared `errorx.IsRetryableServerError` helper.](kb:shared.sdk-go.retries:shared-5xx-classifier). When the Go ZWA client's retry budget runs out while the policy still wants to retry, its error handler returns the final response instead of retryablehttp's bare give-up error, so the request layer can build a structured error from the API's code and message; a transport error is still returned as an error. [zwa.api:go-exhaustion-returns-response]

## Coverage

The API reference also documents releasing quarantined emails and reading the release status, importing CSV user attributes and downloading them, and a v2 triggers path; neither SDK calls any of them. [zwa.api:uncovered-operations] The MCP server has no Workflow Automation tools: the table of contents of its generated tool reference lists ZIA, ZPA, ZDX, ZCC, ZTW, ZIdentity, EASM, Z-Insights, ZMS and ZCell, and no Workflow Automation section. [zwa.api:mcp-no-zwa] Incident and audit wire behavior is in [DLP incident API wire behavior: list envelopes, paging, close, delete, triggers and evidence, and where the SDKs part from the contract](kb:zwa.api.incidents-wire) and [Workflow Automation audit logs: the customer audit search, what it records, and how the SDKs read it](kb:zwa.audit-logs). Which credentials and host a tenant should use is open [gap:zwa.api:auth-boundary].

What to check:
1. Whether the Python client is in legacy mode, which decides between the OneAPI path with the /zwa prefix and the legacy Workflow Automation host.
2. Whether the environment variables set match the SDK in use, since Go and Python read different names.

Inferred, not quoted (say so when an answer rests on one):
- [zwa.api:python-docstring-accessor-broken] Tier B: Read from zscaler/zwa/zwa_service.py at the pin: the class defines only `__init__` and the two quoted properties. The failing call was not run.
- [zwa.api:go-legacy-only] Tier B: Rests on a search of the Go SDK at its pin: outside zscaler/zwa, only zscaler/jmespath.go mentions zwa, and the ZWA service struct holds only the zwa.Client.
- [zwa.api:uncovered-operations] Tier B: Compared against the Python dlp_incidents and audit_logs modules and the Go dlp_incidents and customeraudit packages at their pins, whose paths are all under /dlp/v1/incidents and /dlp/v1/customer/audit.
- [zwa.api:mcp-no-zwa] Tier B: Rests on the generated supported-tools page's table of contents at the pin, which the page says is rebuilt from the live tool inventory, and on the server's tools tree at the pin, whose service packages are easm, zcc, zcell, zdx, zia, zid, zins, zms, zpa and ztw with no zwa package. A newer or private server is not ruled out.

Not known (open gaps):
- Which tenants use OneAPI and which use the Workflow Automation API key for ZWA [gap:zwa.api:auth-boundary]: settled by source-read or lab-test. Blocks: choosing credentials and host for a Workflow Automation integration

Area: zwa.api, its subjects in references/_meta/spine/zwa/zwa.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.legacy-api.auth-models.md (Legacy (pre-OneAPI) authentication by product)
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/zwa/zwa.api.incidents-wire.md (DLP incident API wire behavior: list envelopes, paging, close, delete, triggers and evidence, and where the SDKs part from the contract)
- links-to references/_meta/text/zwa/zwa.audit-logs.md (Workflow Automation audit logs: the customer audit search, what it records, and how the SDKs read it)
