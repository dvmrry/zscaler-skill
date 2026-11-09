# Choosing OneAPI or a legacy auth path for a tenant: cloud, products in scope, and whether a ZIdentity API client exists (shared.oneapi.auth-selection)
Also called: oneapi or legacy; which auth path; auth decision tree; legacy or oneapi; gov cloud auth path; which auth does my script use; auth path for tenant

Three facts pick the path: the tenant's cloud, the products in scope, and whether the tenant has a ZIdentity API client [Before using OneAPI, the organization needs a subscription to Authentication Service, and the client applications must be registered in Authentication Service with the necessary scope.](kb:shared.oneapi.authentication:auth-service-subscription).

## Choosing a path

| Tenant | Products | Path |
| --- | --- | --- |
| Commercial, ZIdentity API client exists | ZIA, ZPA, Client Connector, Cloud & Branch Connector, Business Insights | OneAPI OAuth 2.0 [OneAPI's OAuth 2.0 access covers the ZIA, ZPA, ZDX, Client Connector, Cloud & Branch Connector, Business Insights, EASM, Cellular, Event Monitoring & Notification and AI Security APIs.](kb:shared.oneapi:products) |
| Commercial, ZIdentity API client exists | ZDX | OneAPI: Both SDKs route ZDX through OneAPI: the Go SDK maps endpoints beginning /zdx to the zdx service and its ZDX HTTP client, and the Python OneAPI client exposes a ZDXService through its zdx property. [shared.oneapi.auth-selection:zdx-oneapi-routing] ZDX legacy sign-in is the fallback [It signs in by posting `key_id`, a `key_secret` equal to the hex SHA-256 of the client secret, a colon and the current epoch time, and that `timestamp`, to the host's `/v1/oauth/token`.](kb:zdx.sdk-python.legacy-client:token-request). |
| Commercial, no ZIdentity API client | ZIA | ZIA legacy session with an obfuscated key [POST /authenticatedSession with `username`, `password`, the obfuscated `apiKey` and `timestamp` creates a session and returns a `JSESSIONID` cookie in the Set-Cookie header, which must be passed on subsequent requests.](kb:shared.legacy-api.zia-session:create-session) |
| Commercial, no ZIdentity API client | ZPA | ZPA legacy sign-in with client ID and customer ID [The legacy ZPA API signs in with a form-encoded POST of `client_id` and `client_secret` to `/signin` on the tenant's config host (config.private.zscaler.com in the article, which differs by cloud) and returns a Bearer token with `expires_in` 3600; the token is sent as `Authorization: Bearer` and `/signout` ends it.](kb:zpa.api.authentication:legacy-signin) |
| Commercial, no ZIdentity API client | Client Connector | Legacy login with API key and secret [The legacy API is signed in to with a POST to `/papi/auth/v1/login` carrying `apiKey` and `secretKey`; the response's `jwtToken` is the token passed on subsequent calls.](kb:zcc.api.authentication:legacy-login-request) |
| Commercial, no ZIdentity API client | ZDX | ZDX legacy SHA-256 sign-in [The OneAPI ZDX contract's /v1/oauth/token takes `key_secret` as SHA256 of the secret key and timestamp (`SHA256('secret key:timestamp')`) and a `timestamp` in epoch seconds, and requests sent after 15 minutes are invalid.](kb:shared.legacy-api.auth-models:zdx-signed-secret) |
| Government, gov or govus values | Any | OneAPI only where the client version routes it and the tenant has an API client [The Go SDK maps the cloud values `gov` and `govus` (case-insensitive) to the token hosts zidentitygov.net and zidentitygov.us and to the API gateways `https://api.zscalergov.net` and `https://api.zscalergov.us`, instead of the commercial zslogin and zsapi hosts.](kb:shared.oneapi.government-clouds:go-gov-routing); otherwise the product's legacy API |

## Confirming OneAPI

A ZIdentity API client is created in the admin console [Applications, services, and AI agents that need to access Zscaler API resources must be provisioned in the Zscaler Admin Console, and Authentication Service administrators with Full permission on the API Clients and API Resources modules can configure API clients.](kb:zidentity.api-clients:console-provisioning), and the API Clients page lists each client's status [On the API Clients and AI Agents page an admin can search, export the list as CSV, add, edit, delete, and disable API clients and AI agents; the list shows each client's name, status (Active or Inactive) and client ID.](kb:zidentity.api-clients:console-page). The admin host and menu path are open [gap:shared.oneapi.auth-selection:zidentity-admin-host].

## Which path a script uses

The Python SDK switches to a legacy client when its use_legacy_client argument (default False) is true and a product's legacy client helper is passed [The Python SDK's unified client switches to a legacy client when its `use_legacy_client` constructor argument (default False) is true and a product's legacy client helper is passed, using that helper as its request executor.](kb:shared.sdk-python.client-configuration:legacy-switch). It reads no ZSCALER_USE_LEGACY variable [The Python SDK reads no `ZSCALER_USE_LEGACY` environment variable; the legacy path is selected in code, not by that variable.](kb:shared.oneapi:no-use-legacy-env). The ZIA and ZPA Terraform providers read ZSCALER_USE_LEGACY_CLIENT instead [The provider chooses the legacy ZIA client when use_legacy_client is true, from the provider attribute or, when that is unset, from ZSCALER_USE_LEGACY_CLIENT being the string true.](kb:zia.terraform.provider-modes:legacy-client-switch) [The provider chooses the legacy ZPA client when use_legacy_client is true, from the provider attribute or, when that is unset, from ZSCALER_USE_LEGACY_CLIENT being the string true.](kb:zpa.terraform.provider-config:legacy-client-switch).

The OneAPI variables are [The Python SDK reads OneAPI credentials from the environment variables ZSCALER_CLIENT_ID, ZSCALER_CLIENT_SECRET, ZSCALER_VANITY_DOMAIN, ZSCALER_CLOUD and ZSCALER_PARTNER_ID, and a private key from ZSCALER_PRIVATE_KEY.](kb:zia.sdk-python.authentication:oneapi-env-vars). The legacy variables are [The Python SDK's LegacyZIAClient reads its username, password, API key and cloud from the environment variables ZIA_USERNAME, ZIA_PASSWORD, ZIA_API_KEY and ZIA_CLOUD.](kb:zia.sdk-python.authentication:legacy-zia-env), [The Python LegacyZPAClient reads its settings from the configuration or from the environment variables ZPA_CLIENT_ID, ZPA_CLIENT_SECRET, ZPA_CUSTOMER_ID, ZPA_MICROTENANT_ID and ZSCALER_PARTNER_ID, and takes the cloud from ZSCALER_CLOUD with PRODUCTION as the default.](kb:zpa.sdk-python.client-configuration:legacy-client-env), [The Python SDK's LegacyZCCClient takes its API key and secret key from the environment variables ZCC_CLIENT_ID and ZCC_CLIENT_SECRET.](kb:zcc.api.authentication:legacy-zcc-env) and [The legacy ZDX client takes `key_id` and `key_secret` (or `ZDX_CLIENT_ID` and `ZDX_CLIENT_SECRET`) and `ZDX_CLOUD` (default `zdxcloud`; `zdxbeta` is the other documented value), refuses to start without both credentials, and targets the host `https://api.{self._env_cloud}.net`.](kb:zdx.sdk-python.legacy-client:env-and-host).

## Cloud and government

The tenant's cloud is named by its admin login host [The cloud name is also in the URL admins use to log in: an organization that logs in to admin.zscalertwo.net is on zscalertwo.net.](kb:shared.cloud-architecture.cloud-names:name-from-admin-url) and the ZIA cloud names are in [The ZIA Terraform provider's documentation lists nine ZIA cloud names: zscaler, zscloud, zscalerone, zscalertwo, zscalerthree, zscalerbeta, zscalergov, zscalerten and zspreview.](kb:shared.cloud-architecture.cloud-names:zia-provider-cloud-names). An unset ZSCALER_CLOUD means production [When no cloud is given in configuration and ZSCALER_CLOUD is unset, the Python SDK's base client uses PRODUCTION as its cloud, and the ZIA provider's activation CLI likewise uses the default production cloud when ZSCALER_CLOUD is unset or empty.](kb:shared.cloud-architecture.cloud-names:unset-cloud-production), and the cloud setting is needed only for an alternative cloud environment [The cloud attribute (ZSCALER_CLOUD) is optional and only required when authenticating to an alternative Zidentity cloud environment; without it the SDK uses the default base URL.](kb:zia.sdk-python.authentication:cloud-optional).

Government routing for gov and govus is in [The Go SDK maps the cloud values `gov` and `govus` (case-insensitive) to the token hosts zidentitygov.net and zidentitygov.us and to the API gateways `https://api.zscalergov.net` and `https://api.zscalergov.us`, instead of the commercial zslogin and zsapi hosts.](kb:shared.oneapi.government-clouds:go-gov-routing). Whether a given government tenant is entitled to it is open [Whether a government tenant can use OneAPI](kb:shared.oneapi.government-clouds:tenant-entitlement).

Whether a sub-cloud follows its parent cloud's auth path is open [gap:shared.oneapi.auth-selection:subcloud-auth].

## Fallback and mixed use

A legacy path needs its own credentials and a tenant that still accepts them [In Authentication Service-enabled tenants, admins calling the ZIA APIs this way must be hosted on Authentication Service with roles assigned from ZIA; users provisioned through third-party identity providers cannot authenticate to the APIs.](kb:shared.legacy-api.zia-session:zidentity-tenants). Whether legacy credentials keep working after migration is open [Whether legacy credentials keep working after a tenant migrates to ZIdentity](kb:shared.legacy-api.auth-models:legacy-oneapi-coexistence), and whether legacy and OneAPI return the same data for one tenant is open [gap:shared.oneapi.auth-selection:coexistence-rbac].

What to check:
1. Whether the tenant is commercial or government, from its admin login host or the ZSCALER_CLOUD value, before choosing a path.
2. For a government cloud, confirm the client version routes gov or govus and the tenant has a ZIdentity API client. Do not treat routing support as entitlement.
3. Whether a ZIdentity API client exists for the tenant, from the API Clients page. With none, use the product's legacy path.
4. For a commercial tenant without a ZIdentity API client, a ZIA script uses the legacy session: POST to /authenticatedSession with the obfuscated key and a millisecond timestamp.
5. For a commercial tenant without a ZIdentity API client, a ZPA script uses the legacy sign-in with its client ID and customer ID.
6. For a commercial tenant without a ZIdentity API client, a Client Connector script logs in with the legacy API key and secret.
7. For a commercial tenant without a ZIdentity API client, a ZDX script signs in with the SHA-256 signed secret.
8. Identify a script's path from its SDK client and variables. A plain client without use_legacy_client is OneAPI; the Legacy classes name a legacy client; OneAPI needs ZSCALER_CLIENT_ID, ZSCALER_VANITY_DOMAIN and ZSCALER_CLIENT_SECRET or ZSCALER_PRIVATE_KEY.
9. Do not treat ZSCALER_CLOUD as needed for a production commercial tenant. Set it only for an alternative cloud environment.
10. Treat a fallback from OneAPI to legacy as a migration-window measure, and confirm the legacy path works for the tenant before relying on it.
11. Before relying on a legacy call in a ZIdentity-enabled tenant, check whether its results match OneAPI's for the same data.
12. For a sub-cloud (CONUS or tenant-specific), do not assume the parent cloud's auth path.
13. For a tenant whose cloud the admin URL and environment do not show, the cloud is unresolved; do not infer it.

Not known (open gaps):
- Whether a sub-cloud follows its parent cloud's auth path [gap:shared.oneapi.auth-selection:subcloud-auth]: settled by source-read
- ZIdentity admin host and API Clients menu path [gap:shared.oneapi.auth-selection:zidentity-admin-host]: settled by source-read
- Whether legacy and OneAPI calls return the same data for one tenant [gap:shared.oneapi.auth-selection:coexistence-rbac]: settled by source-read

Area: shared.oneapi, its subjects in references/_meta/spine/shared/shared.oneapi.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.cloud-architecture.cloud-names.md (Zscaler cloud names: which cloud a tenant is on, and the production name list)
- links-to references/_meta/text/shared/shared.oneapi.government-clouds.md (Reaching OneAPI on government (FedRAMP) and non-production clouds)
- links-to references/_meta/text/zia/zia.sdk-python.authentication.md (How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy)
- links-to references/_meta/text/shared/shared.legacy-api.auth-models.md (Legacy (pre-OneAPI) authentication by product)
- links-to references/_meta/text/shared/shared.legacy-api.zia-session.md (ZIA legacy API sessions: API key obfuscation, JSESSIONID and the cloud service API key)
- links-to references/_meta/text/zcc/zcc.api.authentication.md (Reaching and signing in to the ZCC API: OneAPI gateway and legacy login)
- links-to references/_meta/text/zdx/zdx.sdk-python.legacy-client.md (The Python SDK's legacy ZDX client: credentials, host and paths, token caching, and what happens when the token expires)
- links-to references/_meta/text/zidentity/zidentity.api-clients.md (ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime)
- links-to references/_meta/text/shared/shared.oneapi.md (OneAPI: Zscaler's unified API gateway, and where each part of calling it is covered)
- links-to references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token)
- links-to references/_meta/text/shared/shared.sdk-python.client-configuration.md (How the Python SDK's unified client is configured: OneAPI or legacy, settings, environment variables)
- links-to references/_meta/text/zia/zia.terraform.provider-modes.md (ZIA Terraform provider authentication, client modes and rate limiting)
- links-to references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds)
- links-to references/_meta/text/zpa/zpa.sdk-python.client-configuration.md (Python SDK settings for ZPA: credentials, tenant ID, microtenant, environment variables and the legacy client)
- links-to references/_meta/text/zpa/zpa.terraform.provider-config.md (ZPA Terraform provider configuration: no-credential mode, authentication framework, clouds and rate limits)
