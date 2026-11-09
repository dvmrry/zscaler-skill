# OneAPI: Zscaler's unified API gateway, and where each part of calling it is covered (shared.oneapi)
Also called: oneapi; automate.zscaler.com; zscaler unified api; how do I call the zscaler api; oneapi vs legacy api; zscaler sdk oneapi; use_legacy_client

OneAPI provides unified programmatic access to different Zscaler services with a consistent API design across products. [shared.oneapi:unified-access] It centralizes API authentication, tenant access policies and management, rate limiting, caching and API lifecycle management. [shared.oneapi:central-management]

**Products.** OneAPI's OAuth 2.0 access covers the ZIA, ZPA, ZDX, Client Connector, Cloud & Branch Connector, Business Insights, EASM, Cellular, Event Monitoring & Notification and AI Security APIs. [shared.oneapi:products] Zscaler may periodically change the request and response parameters of OneAPI endpoints. [shared.oneapi:periodic-updates]

**Calling it.** Getting a token is in [How a client gets and uses a OneAPI access token](kb:shared.oneapi.authentication), hosts and base paths in [OneAPI hosts and per-product base paths](kb:shared.oneapi.base-urls), and government and beta clouds in [Reaching OneAPI on government (FedRAMP) and non-production clouds](kb:shared.oneapi.government-clouds).

**Limits and errors.** Limits differ by product: [OneAPI rate limits by product, and how the Go SDK throttles](kb:shared.oneapi.rate-limits). Status codes and the ZIA maintenance mode are in [OneAPI status codes, ZIA maintenance read-only mode, and 403 and 409 causes](kb:shared.oneapi.response-codes), and fetching before update, activation and edit locks in [Writing through OneAPI: fetch before update, activation, edit locks](kb:shared.oneapi.write-practices).

**Other OneAPI services.** The Analytics GraphQL API is in [The Analytics (Z-Insights) GraphQL API: endpoint, access and scope](kb:shared.analytics.graphql) and the Event Monitoring & Notification API in [The Event Monitoring & Notification API: what it does, access, headers and limits](kb:shared.event-monitoring.api).

**Products' own API subjects.** Endpoint-level behavior is in [The ZIA API from a client's side: activation, limits, SDK coverage and wire notes](kb:zia.api), [The ZPA API from a client's side: paths, authentication, paging, limits and wire notes](kb:zpa.api) and [The ZCC API from a client's side: hosts, sign-in, limits, conventions and wire notes](kb:zcc.api); ZDX, ZIdentity and Cloud & Branch Connector are in [The ZDX API from a client's side: hosts, limits, conventions, coverage and wire notes](kb:zdx.api), [The ZIdentity (Authentication Service) admin API from a client's side: route, coverage and wire notes](kb:zidentity.api) and [The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes](kb:cloud-connector.api).

**SDKs.** Zscaler's tools page describes Python SDK v1 as multi-product, using OneAPI with a single OAuth2 client and backward compatible with legacy APIs, Python SDK v2 as covering Authentication Service, ZDX and ZIA so far, and the Go SDK as supporting Authentication Service, Client Connector, Workflow Automation, ZDX, ZIA and ZPA on both the OneAPI and legacy frameworks. [shared.oneapi:sdk-support] [The Python SDK's unified client switches to a legacy client when its `use_legacy_client` constructor argument (default False) is true and a product's legacy client helper is passed, using that helper as its request executor.](kb:shared.sdk-python.client-configuration:legacy-switch) The Python SDK reads no `ZSCALER_USE_LEGACY` environment variable; the legacy path is selected in code, not by that variable. [shared.oneapi:no-use-legacy-env] The environment variables the Python SDK reads are [The Python SDK reads OneAPI credentials from the environment variables ZSCALER_CLIENT_ID, ZSCALER_CLIENT_SECRET, ZSCALER_VANITY_DOMAIN, ZSCALER_CLOUD and ZSCALER_PARTNER_ID, and a private key from ZSCALER_PRIVATE_KEY.](kb:zia.sdk-python.authentication:oneapi-env-vars). Go SDK token renewal, retries and request handling are in [How the Go SDK obtains and renews OneAPI tokens](kb:shared.sdk-go.auth-lifecycle), [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries) and [How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes](kb:shared.sdk-go.request-handling).

**Legacy APIs.** The pre-OneAPI per-product APIs are in [Legacy (pre-OneAPI) authentication by product](kb:shared.legacy-api.auth-models).

What to check:
1. Whether the tenant and client use OneAPI or a product's legacy API, before applying anything here.
2. Which product's limits and status codes apply to the failing call.

Inferred, not quoted (say so when an answer rests on one):
- [shared.oneapi:no-use-legacy-env] Tier B: Search of the pinned Python SDK (code and README) for USE_LEGACY found nothing. The ZPA Terraform provider has its own ZSCALER_USE_LEGACY_CLIENT variable (zpa.terraform.provider-config:legacy-client-switch).

Area: shared.oneapi, its subjects in references/_meta/spine/shared/shared.oneapi.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.api.md (The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes)
- links-to references/_meta/text/shared/shared.analytics.graphql.md (The Analytics (Z-Insights) GraphQL API: endpoint, access and scope)
- links-to references/_meta/text/shared/shared.event-monitoring.api.md (The Event Monitoring & Notification API: what it does, access, headers and limits)
- links-to references/_meta/text/shared/shared.legacy-api.auth-models.md (Legacy (pre-OneAPI) authentication by product)
- links-to references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token)
- links-to references/_meta/text/shared/shared.oneapi.base-urls.md (OneAPI hosts and per-product base paths)
- links-to references/_meta/text/shared/shared.oneapi.government-clouds.md (Reaching OneAPI on government (FedRAMP) and non-production clouds)
- links-to references/_meta/text/shared/shared.oneapi.rate-limits.md (OneAPI rate limits by product, and how the Go SDK throttles)
- links-to references/_meta/text/shared/shared.oneapi.response-codes.md (OneAPI status codes, ZIA maintenance read-only mode, and 403 and 409 causes)
- links-to references/_meta/text/shared/shared.oneapi.write-practices.md (Writing through OneAPI: fetch before update, activation, edit locks)
- links-to references/_meta/text/shared/shared.sdk-go.auth-lifecycle.md (How the Go SDK obtains and renews OneAPI tokens)
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/shared/shared.sdk-python.client-configuration.md (How the Python SDK's unified client is configured: OneAPI or legacy, settings, environment variables)
- links-to references/_meta/text/zcc/zcc.api.md (The ZCC API from a client's side: hosts, sign-in, limits, conventions and wire notes)
- links-to references/_meta/text/zdx/zdx.api.md (The ZDX API from a client's side: hosts, limits, conventions, coverage and wire notes)
- links-to references/_meta/text/zia/zia.api.md (The ZIA API from a client's side: activation, limits, SDK coverage and wire notes)
- links-to references/_meta/text/zia/zia.sdk-python.authentication.md (How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy)
- links-to references/_meta/text/zidentity/zidentity.api.md (The ZIdentity (Authentication Service) admin API from a client's side: route, coverage and wire notes)
- links-to references/_meta/text/zpa/zpa.api.md (The ZPA API from a client's side: paths, authentication, paging, limits and wire notes)
