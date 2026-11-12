# How the Python SDK's unified client is configured: OneAPI or legacy, settings, environment variables (shared.sdk-python.client-configuration)
Also called: ZscalerClient; use_legacy_client; python sdk environment variables; ZSCALER_CLIENT_ID; python sdk legacy client; python sdk timeout

These are claims about the Python SDK's unified client (`ZscalerClient`), shared by every product it reaches. How a token is obtained is in [How a client gets and uses a OneAPI access token](kb:shared.oneapi.authentication).

**OneAPI or legacy.** The Python SDK's unified client switches to a legacy client when its `use_legacy_client` constructor argument (default False) is true and a product's legacy client helper is passed, using that helper as its request executor. [shared.sdk-python.client-configuration:legacy-switch] The Python SDK's legacy (non-OneAPI) clients cover ZPA, ZIA, ZTW, ZCC, AI Guard, ZDX, ZWA and ZTB. [shared.sdk-python.client-configuration:legacy-clients] There is no legacy client for ZIdentity: `oneapi_client.py` imports a legacy helper for each of the eight products but only the service module for ZIdentity. [shared.sdk-python.client-configuration:no-zidentity-legacy] The Python SDK sets the `Authorization` header to `Bearer` plus the OAuth access token when the client is not a legacy client and the endpoint does not contain `/zscsb`. [shared.sdk-python.client-configuration:bearer-header] Each product's legacy client and its settings are in that product's client-configuration subject, for example [The Python SDK's two ZCC clients: OneAPI service and legacy helper](kb:zcc.sdk-python.client-configuration) and [The Python SDK against Cloud and Branch Connector: legacy client settings and session logout on exit](kb:cloud-connector.sdk-python.client-configuration).

**Settings.** The Python OneAPI configuration setter reads each client setting from an environment variable named ZSCALER_ followed by the upper-cased snake_case form of the setting key. [shared.sdk-python.client-configuration:env-key-format] The executor reads `client.requestTimeout` with a default of 240 seconds. [shared.sdk-python.client-configuration:request-timeout] Retry settings are in [How the Python SDK retries: budget, statuses, waits, re-authentication](kb:shared.sdk-python.retries).

**TLS settings.** From v1.11.3 the Python SDK honors TLS verification settings (`sslContext`) only when they are passed to the client constructor: an `sslContext` in a `zscaler.yaml` is dropped with a warning, a client built with `sslContext=False` logs a warning that certificate verification is disabled, and applying a `zscaler.yaml` from the current working directory also logs a warning. [shared.sdk-python.client-configuration:tls-settings-constructor-only]

**Proxy with httpx 0.28 (zssdk).** Python SDK issue #498, open, reports that a proxy configured on the `zssdk` package (`zssdk.Session` with a `Proxy` in its `Config`) fails with httpx 0.28 or later: `httpx.Client` rejects the `proxies` keyword that `zssdk/zscore/httpsession.py` passes, raising a TypeError. The reporter's suggested fix passes `proxy` instead; a reply on 2026-04-29 from an account with no association to the repository says a fix is in the pipeline. [shared.sdk-python.client-configuration:zssdk-proxy-httpx-028]

Inferred, not quoted (say so when an answer rests on one):
- [shared.sdk-python.client-configuration:no-zidentity-legacy] Tier B: An absence: a read of oneapi_client.py at the pin finds the eight Legacy*Client classes in legacy-clients and no ZIdentity one, and its sorted import block (quoted around zid) brings in no zid legacy helper.

Area: shared.sdk-python, its subjects in references/_meta/spine/shared/shared.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-python.client-configuration.md (The Python SDK against Cloud and Branch Connector: legacy client settings and session logout on exit)
- links-to references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token)
- links-to references/_meta/text/shared/shared.sdk-python.retries.md (How the Python SDK retries: budget, statuses, waits, re-authentication)
- links-to references/_meta/text/zcc/zcc.sdk-python.client-configuration.md (The Python SDK's two ZCC clients: OneAPI service and legacy helper)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.sdk-python.request-handling.md (How the Python SDK builds a request: body and query key casing, ID lists)
