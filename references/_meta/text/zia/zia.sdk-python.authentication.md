# How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy (zia.sdk-python.authentication)
Also called: zia api authentication; oneapi credentials python; ZSCALER_CLIENT_ID; ZSCALER_VANITY_DOMAIN; zscalergov fedramp oneapi; legacy zia api key python; x-partner-id

OneAPI is the unified Zidentity OAuth client; the older ZIA-specific key framework is the fallback for tenants not yet on Zidentity. The product-level OneAPI notes are in [OneAPI: Zscaler's unified API gateway, and where each part of calling it is covered](kb:shared.oneapi) and the legacy framework in [Legacy (pre-OneAPI) authentication by product](kb:shared.legacy-api.auth-models).

**Credentials.** The Python SDK reads OneAPI credentials from the environment variables ZSCALER_CLIENT_ID, ZSCALER_CLIENT_SECRET, ZSCALER_VANITY_DOMAIN, ZSCALER_CLOUD and ZSCALER_PARTNER_ID, and a private key from ZSCALER_PRIVATE_KEY. [zia.sdk-python.authentication:oneapi-env-vars] The vanity domain is the organization's Zidentity domain, and for the production cloud the OAuth token endpoint is built from it as https://<vanity_domain>.zslogin.net/oauth2/v1/token. [zia.sdk-python.authentication:vanity-domain-token-url] The Python OAuth client always sends `audience=https://api.zscaler.com` in the client-credentials and JWT-assertion token requests. [zia.sdk-python.authentication:oauth-audience] The cloud attribute (ZSCALER_CLOUD) is optional and only required when authenticating to an alternative Zidentity cloud environment; without it the SDK uses the default base URL. [zia.sdk-python.authentication:cloud-optional] When a partner ID is supplied through configuration or ZSCALER_PARTNER_ID the SDK adds an x-partner-id header to every request, on both the OneAPI and the legacy clients; without one the header is not sent. [zia.sdk-python.authentication:partner-id-header]

**Government clouds.** With cloud set to `gov` or `govus` the Python SDK sends OAuth to a zidentitygov.net or zidentitygov.us identity provider and API calls to api.zscalergov.net or api.zscalergov.us, instead of the commercial gateway. [zia.sdk-python.authentication:gov-cloud-routing] The changelog records OneAPI support for the government clouds in release 1.9.32 (PR #534), and the same entry also appears under 1.9.31 (Issue #526); it notes that before the change these clouds produced non-resolvable hostnames and failed on every call. [zia.sdk-python.authentication:gov-since-1-9-32] The 1.0.0, 1.0.2 and 1.0.3 release notes of the Python SDK warn that OneAPI and Zidentity are not supported for the zscalergov and zscalerten ZIA clouds or the ZPA GOV and GOVUS clouds, and point government customers to the legacy framework. [zia.sdk-python.authentication:older-sdk-gov-unsupported]

**Legacy.** A tenant that has not migrated to Zidentity must use the SDK's legacy API client, which uses the product's own credentials; for ZIA the legacy credentials are username, password and an API key. [zia.sdk-python.authentication:legacy-framework] Python SDK v2.x is a public-preview line that supports OneAPI only and does not provide the legacy clients such as LegacyZIAClient, while v1.x remains the GA release. [zia.sdk-python.authentication:v2-oneapi-only] The Python SDK's LegacyZIAClient reads its username, password, API key and cloud from the environment variables ZIA_USERNAME, ZIA_PASSWORD, ZIA_API_KEY and ZIA_CLOUD. [zia.sdk-python.authentication:legacy-zia-env]

What to check:
1. Whether the tenant is on Zidentity (OneAPI) or still on the legacy ZIA framework, and which SDK major version is in use.
2. Whether the tenant is a government (FedRAMP) cloud, and whether the client version routes `gov` and `govus` at all.

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token): OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/shared/shared.legacy-api.auth-models.md (Legacy (pre-OneAPI) authentication by product)
- links-to references/_meta/text/shared/shared.oneapi.md (OneAPI: Zscaler's unified API gateway, and where each part of calling it is covered)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.api.md (The ZIA API from a client's side: activation, limits, SDK coverage and wire notes)
- see-also references/_meta/text/zia/zia.sdk-python.response-shape.md (What the Python SDK returns: result, response and error, and why try/except misses API errors)
