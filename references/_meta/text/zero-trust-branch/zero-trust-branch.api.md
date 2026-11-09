# Automating Zero Trust Branch: the Python SDK client, its API-key sign-in, and what no other client covers (zero-trust-branch.api)
Also called: ztb api; zero trust branch api; ztb python sdk; LegacyZTBClient; client.ztb; ztb api key; goairgap api; ztb terraform; ztb oneapi

The Python SDK's `ztb` package is the only Zero Trust Branch client in the vendored sources; its modules, methods and paths are generated: run `node scripts/kb.mjs surface ztb`. This subject holds how that client signs in and where its own documentation and code disagree.

**Which clients.** Of the vendored clients, only the Python SDK covers the Zero Trust Branch API: no ZTB service was found in the Go SDK, the ZIA, ZPA, ZCC or ZTC Terraform providers, the ZIA or ZPA Ansible collections, the MCP server or the OneAPI Postman collection, and the captured Automate contract has no ZTB operations. [zero-trust-branch.api:no-other-clients] The Go SDK's `branch_connector` package is a ZPA service (it sits under `zscaler/zpa/services`): its endpoint is `/branchConnector` under the ZPA management path `/zpa/mgmtconfig/v1/admin/customers/`. [zero-trust-branch.api:go-branch-connector-is-zpa] The MCP server has no Zero Trust Branch tools: its OneAPI entitlement map has no ZTB product code, and its `ztw` tool family is documented as the Cloud & Branch Connector tools. [zero-trust-branch.api:mcp-no-ztb] The MCP server's own name for its `ztw` family is not settled [gap:zero-trust-branch.api:mcp-ztw-label]. The SDK's 2.x beta leaves ZTB on 1.x: [The Python SDK's v2.x beta (`2.0.0bN`), announced in release 1.9.23, covers ZIA, ZDX and ZIdentity only; ZPA, ZCC, ZTW, ZTB and ZWA remain on v1.x, which stays the recommended GA release.](kb:cloud-connector.api.client-coverage:python-v2-excludes-ztw).

## Signing in

The SDK signs in to ZTB with an API key: it posts `{"api_key": "..."}` to `POST /api/v3/api-key-auth/login`, takes the `delegate_token` from the response, and sends it as a Bearer token on later requests; ZTB does not use JSESSIONID session cookies. [zero-trust-branch.api:api-key-login] The legacy helper reads the key from `api_key` or `ZTB_API_KEY`, the cloud from `cloud` or `ZTB_CLOUD`, and builds the base URL `https://{cloud}.goairgap.com` unless `override_url` or `ZTB_OVERRIDE_URL` is set. [zero-trust-branch.api:base-url] The Zero Trust Branch cloud domain is listed in [The same list gives `goairgap.com` for Zero Trust Branch, `ztsim.com` for Zscaler Cellular, `zscalerrisk.net` for Zscaler Risk360 and `zslogin.net` for the Authentication Service.](kb:shared.cloud-architecture.cloud-names:other-services).

**OneAPI or legacy.** On the Python SDK's OneAPI client (`oneapi_client.py`), the `ztb` property creates a `ZTBService` once and returns it when `use_legacy_client` is off, and requires the ZTB legacy client when it is on. [zero-trust-branch.api:oneapi-accessor] The `ZTBService` docstring says the service is used through the OneAPI authentication path, and that standalone or legacy token-based access should use `LegacyZTBClient` or `LegacyZTBClientHelper`. [zero-trust-branch.api:service-docstring] The SDK README says ZTB is available only through the legacy client (`LegacyZTBClient`) and that OneAPI/OAuth2 is not supported for ZTB. [zero-trust-branch.api:readme-legacy-only] The two say different things [divergence:zero-trust-branch.api:oneapi-support], and which path the ZTB API accepts is open [gap:zero-trust-branch.api:auth-mode].

**Client settings.** The legacy helper raises a `ValueError` when no cloud is given through `cloud` or `ZTB_CLOUD`; the check sits in the file above the `# --- URL construction ---` section that reads the override URL, and `LegacyZTBClient` passes the config's `cloud` value (or `ZTB_CLOUD`) straight through. [zero-trust-branch.api:cloud-required-in-code] The README says otherwise [divergence:zero-trust-branch.api:override-without-cloud]. `LegacyZTBClient` reads `api_key`, `cloud`, `override_url`, `partnerId`, `timeout`, `cache`, `failSafe` and `requestExecutor` from its config and passes no retry count, so the helper keeps its default of 5 retries. [zero-trust-branch.api:legacy-config-keys] The README's option names differ [divergence:zero-trust-branch.api:config-keys].

## Requests

With a legacy client the request executor strips a leading `/ztb` from the SDK's endpoint paths and sends the request to the ZTB helper's base URL. [zero-trust-branch.api:legacy-path-prefix] The request executor does not camel-case ZTB request bodies: `_prepare_body` returns the body unconverted when the ZTB legacy client is in use and when the endpoint contains `/ztb/`. [zero-trust-branch.api:snake-case-bodies] The README says that on a 401 the client re-authenticates and retries once, and on a 429 or a 502, 503 or 504 it retries with exponential backoff, up to `max_retries` (default 5). [zero-trust-branch.api:retries] The helper's client-side rate limits are an assumption, not published limits: the code says ZTB rate limits are unknown and sets conservative defaults of 5 requests per 1-second window for reads and for writes. [zero-trust-branch.api:rate-limit-assumption] Whether the helper's limiter paces requests at all is in [The ZIA, ZPA, ZTW and ZTB legacy clients each build a `RateLimiter` and keep it as `self.rate_limiter` (the ZPA one commented as allowing 20 GET and 10 POST/PUT/DELETE requests per 10 seconds), but no code in the `zscaler` package calls the limiter's `wait` or `update_limits`, so none of these clients paces its requests with it.](kb:shared.sdk-python.retries:legacy-rate-limiter-unused).

What to check:
1. Whether the script builds the client with `LegacyZTBClient` and an API key; the README says OneAPI is not supported for ZTB, although `client.ztb` also exists on the OneAPI client.
2. Whether `cloud` (or `ZTB_CLOUD`) is set even when an override URL is given, since the helper raises an error without it.
3. Whether a partner ID is passed as `partnerId` in the config or through `ZSCALER_PARTNER_ID`, and whether a custom retry count is expected to take effect.
4. Whether request bodies are written with the API's own (snake_case) keys, since the SDK does not convert them.

Inferred, not quoted (say so when an answer rests on one):
- [zero-trust-branch.api:no-other-clients] Tier B: Rests on an absence. At the pins, `git grep -i -E 'ztb|zero.trust.branch|goairgap'` finds no Zero Trust Branch service in the Go SDK (only unrelated base64 test data), the four Terraform providers, the two Ansible collections or the MCP server, and the OneAPI Postman collection has no match. The generated surface for `ztb` has empty Go SDK, Terraform and API sections.
- [zero-trust-branch.api:mcp-no-ztb] Tier B: Rests on an absence: `PRD_TO_SERVICE` maps ZIA, ZPA, ZDX, ZCC, ZTW, ZIdentity, EASM, Z-Insights, ZMS and Cellular codes and has no ZTB key, and `git grep -i -E 'ztb|zero.trust.branch'` at the MCP pin finds nothing.
- [zero-trust-branch.api:legacy-config-keys] Tier B: Rests on the complete `LegacyZTBClient.__init__` at the pin: the quoted config reads (plus `cloud` and `cache`) are every `config.get` it makes, and the helper call passes no `max_retries`.

Sources disagree (name both sides):
- The README says ZTB is reachable only through the legacy API-key client, while the main client exposes `client.ztb` on its OneAPI path and the service's docstring says that is how it is used. [divergence:zero-trust-branch.api:oneapi-support]
  - sdk-python: ZTB is available only through `LegacyZTBClient`; OneAPI/OAuth2 is not supported for ZTB.
  - sdk-python: `ZTBService` is used through the OneAPI authentication path; the OneAPI client builds it for `client.ztb`.
  Impact: A script that builds a OneAPI client and calls `client.ztb` gets a service object, but the README says the API does not accept OneAPI tokens; which one works is not shown by any source.
- The README says `cloud` is not required when an override URL is set; the helper's code requires a cloud before it reads the override. [divergence:zero-trust-branch.api:override-without-cloud]
  - sdk-python: If `ZTB_OVERRIDE_URL` is set, `cloud` is not required; when `override_url` is set, `cloud` is ignored.
  - sdk-python: Without `cloud` or `ZTB_CLOUD` the helper raises `ValueError` before the override URL is considered.
  Impact: A configuration that sets only `override_url`, as the README's override example does, fails at client construction unless `ZTB_CLOUD` happens to be set in the environment.
- The README's configuration table names `partner_id` and `max_retries`; `LegacyZTBClient` reads `partnerId` and never reads a retry count from the config. [divergence:zero-trust-branch.api:config-keys]
  - sdk-python: Configuration options include `partner_id` (for the `x-partner-id` header) and `max_retries` (default 5).
  - sdk-python: The client reads the partner ID from the `partnerId` key (or `ZSCALER_PARTNER_ID`) and passes no `max_retries` to the helper.
  Impact: A config written from the README with `partner_id` sends no `x-partner-id` header, and a `max_retries` setting has no effect; the retry count stays 5.

Not known (open gaps):
- Whether the ZTB API accepts OneAPI tokens or only its own API-key login [gap:zero-trust-branch.api:auth-mode]: settled by lab-test or support-ticket or source-read. Blocks: telling an operator which credentials and client construction to use for Zero Trust Branch automation
- The MCP server's product label for its `ztw` tool family [gap:zero-trust-branch.api:mcp-ztw-label]: settled by support-ticket or source-read. Blocks: matching an MCP tool family to the right product when a question mentions branch connectivity

Area: zero-trust-branch.api, its subjects in references/_meta/spine/zero-trust-branch/zero-trust-branch.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.api.client-coverage.md (Which clients cover which parts of the Cloud Connector API: Python v1 and v2, Go, Terraform)
- links-to references/_meta/text/shared/shared.cloud-architecture.cloud-names.md (Zscaler cloud names: which cloud a tenant is on, and the production name list)
- links-to references/_meta/text/shared/shared.sdk-python.retries.md (How the Python SDK retries: budget, statuses, waits, re-authentication)
