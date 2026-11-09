# Legacy (pre-OneAPI) authentication by product (shared.legacy-api.auth-models)
Also called: legacy api authentication; pre-zidentity api auth; zdx legacy oauth token key_secret sha256; zdx 15 minute timestamp; workflow automation api key token; cloud branch connector legacy auth; legacy vs oneapi auth; when do I need the legacy api

Each product's legacy API has its own credentials and token or session model. Whether a tenant is on the legacy path is a property of the tenant and the client, not of the product: [A tenant that has not migrated to Zidentity must use the SDK's legacy API client, which uses the product's own credentials; for ZIA the legacy credentials are username, password and an API key.](kb:zia.sdk-python.authentication:legacy-framework).

**ZIA.** The admin-plus-API-key session is in [ZIA legacy API sessions: API key obfuscation, JSESSIONID and the cloud service API key](kb:shared.legacy-api.zia-session) and the external-IdP OAuth path in [ZIA legacy OAuth 2.0 through an external identity provider](kb:shared.legacy-api.zia-oauth).

**ZPA.** Signing in to the legacy ZPA API and its hosts are in [How a client authenticates to the ZPA API: OneAPI, legacy and government clouds](kb:zpa.api.authentication) and [The Python SDK's legacy host table maps cloud names to config hosts: PRODUCTION to config.private.zscaler.com, ZPATWO to config.zpatwo.net, BETA to config.zpabeta.net, GOV to config.zpagov.net, GOVUS to config.zpagov.us and PREVIEW to config.zpapreview.net.](kb:zpa.api.base-paths:legacy-hosts). Whether the legacy ZPA portal allows several API keys per tenant is open [gap:shared.legacy-api.auth-models:zpa-multiple-keys].

**Client Connector.** The legacy login is [The legacy API is signed in to with a POST to `/papi/auth/v1/login` carrying `apiKey` and `secretKey`; the response's `jwtToken` is the token passed on subsequent calls.](kb:zcc.api.authentication:legacy-login-request), and its token travels in a header, not a cookie: [On the legacy path the JWT is sent in an `auth-token` request header: the help article's example uses `auth-token`, and both SDKs' legacy ZCC clients set that header.](kb:zcc.api.authentication:legacy-auth-token-header).

**Cloud & Branch Connector.** The legacy Cloud & Branch Connector API must be enabled for the organization by Zscaler Support, and needs an admin role with API Key Management permission and an API key. [shared.legacy-api.auth-models:cbc-prereqs] A POST to /auth with an obfuscated API key, the admin's username and password, and a millisecond timestamp returns a `JSESSIONID` cookie, which by default expires 30 minutes after the session's last activity or at a DELETE to /auth; a later call returns 401. [shared.legacy-api.auth-models:cbc-session] The session follows the same obfuscated-key login as legacy ZIA ([POST /authenticatedSession with `username`, `password`, the obfuscated `apiKey` and `timestamp` creates a session and returns a `JSESSIONID` cookie in the Set-Cookie header, which must be passed on subsequent requests.](kb:shared.legacy-api.zia-session:create-session)). Legacy Cloud & Branch Connector changes are activated with a PUT to /ecAdminActivateStatus/activate. [shared.legacy-api.auth-models:cbc-activate-put]

**ZDX.** The legacy ZDX API needs an API key (key ID and key secret) and the ZDX Advanced Plan; a bearer token lasts 3,600 seconds. [shared.legacy-api.auth-models:zdx-prereqs] The legacy ZDX reference posts `key_id` and `key_secret` to /oauth/token on the production server `https://api.zdxcloud.net/v1` and returns a token valid for 3600 seconds. [shared.legacy-api.auth-models:zdx-legacy-token] The OneAPI ZDX contract's /v1/oauth/token takes `key_secret` as SHA256 of the secret key and timestamp (`SHA256('secret key:timestamp')`) and a `timestamp` in epoch seconds, and requests sent after 15 minutes are invalid. [shared.legacy-api.auth-models:zdx-signed-secret] The ZDX auth reference also has GET /oauth/jwks, returning the public keys that verify the JWT tokens, and GET /oauth/validate, which checks whether the token is valid. [shared.legacy-api.auth-models:zdx-jwks-validate] The two ZDX hosts and paths are discussed in [The ZDX API from a client's side: hosts, limits, conventions, coverage and wire notes](kb:zdx.api).

**Workflow Automation.** Workflow Automation's API is enabled with its subscription; a POST of `key_id` and `key_secret` to /v1/auth/api-key/token on `https://api.us1.zsworkflow.net` returns 201 with a bearer token and its `expires_in` (43200 in the example), and a call after the token expires returns 401. [shared.legacy-api.auth-models:wa-token] A Workflow Automation API key expires only when its Expire after option is enabled, and its key secret is visible only when the key is first created. [shared.legacy-api.auth-models:wa-key-expiry] A failed Workflow Automation token request returns 401 when the API key is expired or disabled and 500 when the request is corrupt. [shared.legacy-api.auth-models:wa-errors]

**Migration.** Python SDK v2 drops the legacy clients: [Python SDK v2.x is a public-preview line that supports OneAPI only and does not provide the legacy clients such as LegacyZIAClient, while v1.x remains the GA release.](kb:zia.sdk-python.authentication:v2-oneapi-only). Whether legacy credentials keep working after a tenant moves to ZIdentity is open [gap:shared.legacy-api.auth-models:legacy-oneapi-coexistence].

What to check:
1. Which path the tenant and the client use (OneAPI through Authentication Service, or the product's legacy API), before choosing credentials.
2. For a ZDX legacy token request refused for its timestamp, whether the key_secret is SHA256 of secret:timestamp and the timestamp is within 15 minutes.
3. For a Cloud & Branch Connector legacy 401, whether the session sat idle for 30 minutes.

Not known (open gaps):
- Whether legacy credentials keep working after a tenant migrates to ZIdentity [gap:shared.legacy-api.auth-models:legacy-oneapi-coexistence]: settled by support-ticket or tenant-data. Blocks: telling an operator whether a migrated tenant's legacy API keys are still live
- Whether a ZPA tenant can hold several legacy API keys [gap:shared.legacy-api.auth-models:zpa-multiple-keys]: settled by source-read or tenant-data. Blocks: planning one key per script on a legacy ZPA tenant

Area: shared.legacy-api, its subjects in references/_meta/spine/shared/shared.legacy-api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.legacy-api.zia-session.md (ZIA legacy API sessions: API key obfuscation, JSESSIONID and the cloud service API key)
- links-to references/_meta/text/zcc/zcc.api.authentication.md (Reaching and signing in to the ZCC API: OneAPI gateway and legacy login)
- links-to references/_meta/text/zia/zia.sdk-python.authentication.md (How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy)
- links-to references/_meta/text/shared/shared.legacy-api.zia-oauth.md (ZIA legacy OAuth 2.0 through an external identity provider)
- links-to references/_meta/text/zdx/zdx.api.md (The ZDX API from a client's side: hosts, limits, conventions, coverage and wire notes)
- links-to references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds)
- links-to references/_meta/text/zpa/zpa.api.base-paths.md (ZPA API base paths: hosts, the /zpa prefix, v1 and v2 versions, userconfig and cbiconfig)
