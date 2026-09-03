---
product: zidentity
topic: "api-divergences"
title: "ZIdentity API source divergences"
content-type: reference
source-tier: code
confidence: medium
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-sdk-go: 4b7101202cde25e1e60552f1cb215d2c70cdc3bd
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/**"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py"
  - "vendor/zscaler-sdk-python/zscaler/request_executor.py"
  - "vendor/zscaler-sdk-go/zscaler/ziam/services/**"
  - "vendor/zscaler-sdk-go/zscaler/ziam/services/api_clients/api_clients.go"
  - "vendor/zscaler-sdk-go/zscaler/oneapiclient.go"
  - "vendor/zscaler-sdk-go/zscaler/oneapiconfig.go"
  - "vendor/zscaler-sdk-go/zscaler/errorx/errors.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZIdentity API source divergences

The Go SDK (`zscaler-sdk-go/zscaler/ziam/services/`), the Python SDK (`zscaler-sdk-python/zscaler/zid/`), and the OneAPI Postman collection (`vendor/zscaler-api-specs/oneapi-postman-collection.json`) are three independent views of the same ZIdentity (`ziam`) admin API, produced separately and updated at different cadences. Where they agree, confidence is high. Where they diverge, an engineer needs to know which source to trust before writing code. The refreshed Go SDK moved its package and endpoints onto the OneAPI `/ziam` route; the remaining divergences are service coverage, return/model shapes, query serialization, and stale Go release metadata.

This doc records the source-vs-source disagreements found across the `zid` surface. Each entry confirms the claim against the cited file line before stating which source to trust.

### Release metadata is internally inconsistent (tooling/open metadata)

The exact Go source pin exposes `VERSION = "3.8.48"` in
`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:45-51`, while the vendored
`CHANGELOG.md` starts with `3.8.49` and dates the OneAPI/ZIAM changes to
September 1, 2026 (`vendor/zscaler-sdk-go/CHANGELOG.md:1-16`). Treat this as a
release/tooling metadata mismatch. The commit-pinned source files and their
tests are the evidence for current wrapper behavior; the mismatch is not
product evidence and must not be used to infer backend availability or tenant
entitlement.

**Quick trust hierarchy (applies unless an entry below overrides it):**

- SDK service-layer source (Python `zid/` + Go `ziam/services/`) is ground truth for which methods and wire params exist.
- Postman request/response samples confirm endpoint existence and live wire shapes, and beat SDK docstrings on field-name spelling.
- Both SDKs use `string` for all ZIdentity IDs; Postman's `<long>` annotations are a schema artifact — treat them as strings.

---

## OneAPI route is aligned; legacy Go routing is historical

### Current Python and Go use the `/ziam` OneAPI path

**What each source says:**

- **Python SDK:** every `zid` service class sets `_zidentity_base_endpoint = "/ziam/admin/api/v1"`. (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:31`, `vendor/zscaler-sdk-python/zscaler/zid/users.py:31`, `vendor/zscaler-sdk-python/zscaler/zid/groups.py:31`, `vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py:31`) The request executor resolves the host to `https://api.zsapi.net` for production (`vendor/zscaler-sdk-python/zscaler/request_executor.py:32`) or `https://api.{cloud}.zsapi.net` for non-government non-production clouds (`vendor/zscaler-sdk-python/zscaler/request_executor.py:188-190`). Net production URL: `https://api.zsapi.net/ziam/admin/api/v1/...`
- **Go SDK:** the refreshed `ziam` service constants use `/ziam/admin/api/v1` (`vendor/zscaler-sdk-go/zscaler/ziam/services/users/users.go:18-20`, `groups/groups.go:16-18`, `resource_servers/resource_servers.go:12-14`, `user_entitlement/user_entitlement.go:11-13`, `api_clients/api_clients.go:16-18`). `detectServiceType` recognizes `ziam` before `zia` (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:385-410`), and `GetAPIBaseURL` supplies the OneAPI host (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:441-455`). The request builder treats ZIAM as a normal OneAPI service (`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:408-449`).
- **Postman:** the `ZIAMBaseUrl` collection variable is `{{oneAPIBaseUrl}}/ziam/admin/api/v1` (`vendor/zscaler-api-specs/oneapi-postman-collection.json:144261-144262`), matching the Python prefix.

**Significance / which to trust:** The prior claim that current Go uses `{vanity}-admin.zslogin.net/admin/api/v1` is stale. At the new pin, both SDKs model the `/ziam/admin/api/v1` OneAPI route; Go's `ziam`-before-`zia` dispatch avoids misclassification. The SDK source still does not prove that every tenant has the same backend routing or that legacy aliases remain available.

### Government OneAPI uses dedicated identity and API domains

The current Python SDK special-cases the FedRAMP cloud selectors rather than
feeding them into the commercial hostname pattern:

- `gov` authenticates at `https://{vanity}.zidentitygov.net/oauth2/v1/token`
  and sends API traffic to `https://api.zscalergov.net`.
- `govus` authenticates at `https://{vanity}.zidentitygov.us/oauth2/v1/token`
  and sends API traffic to `https://api.zscalergov.us`.

Source: `vendor/zscaler-sdk-python/zscaler/constants.py:21-29`; `vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:480-501`; `vendor/zscaler-sdk-python/zscaler/request_executor.py:173-190`.

Do not construct government URLs as `api.gov.zsapi.net` or
`{vanity}.zslogingov.net`; those follow the old commercial-pattern inference,
not the current SDK contract.

---

## Resource servers are read-only everywhere

### No create/update/delete in either SDK or the API

**What each source says:**

- **Python SDK:** `ResourceServersAPI` exposes only `list_resource_servers` and `get_resource_server`, both issuing `GET`. (`vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py:37,115`) There are no add/update/delete methods.
- **Go SDK:** the `resourceservers` package exposes only `Get`, `GetAll`, and `GetByName` — all read paths via `service.Client.Read`. (`vendor/zscaler-sdk-go/zscaler/ziam/services/resource_servers/resource_servers.go:60-74,76-109`) There is no `Create`, `Update`, or `Delete` function in the package.
- **Postman:** the `resource-servers` folder contains only `GET` requests (list and get-by-id); no POST/PUT/DELETE entries exist. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:132113,132126,132275`)

**Significance / which to trust:** Resource servers are a read-only OAuth registry in all three sources. Any prior claim that the Go SDK offers full CRUD on resource servers is incorrect — the Go package mutates nothing here. (For contrast, the Go `users` package *does* have `Create`/`Update`/`Delete` at `vendor/zscaler-sdk-go/zscaler/ziam/services/users/users.go:99,121,137`, so the read-only constraint is specific to resource servers, not a blanket Go limitation.) Scope assignment is done from the API-client side via the client's resource linkage, not by mutating a resource server.

---

## API clients now have Go and Python SDK coverage

### Full client + secret lifecycle in both SDKs; no MCP tool

**What each source says:**

- **Python SDK:** `APIClientAPI` provides the full lifecycle — `list_api_clients`, `get_api_client`, `add_api_client`, `update_api_client`, `delete_api_client`, plus secret operations `get_api_client_secret`, `add_api_client_secret`, `delete_api_client_secret`. (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:37,112,156,265,355,392,436,491`) It is registered on the service as `api_client`. (`vendor/zscaler-sdk-python/zscaler/zid/zid_service.py`, `APIClientAPI` property)
- **Go SDK:** the refreshed `ziam/services/api_clients` package provides typed `Get`, `GetAll`, `GetPage`, `GetByName`, `Create`, `Update`, `Delete`, `GetSecrets`, `AddSecret`, and `DeleteSecret` (`vendor/zscaler-sdk-go/zscaler/ziam/services/api_clients/api_clients.go:181-201,214-247,249-306,312-385`).
- **Postman:** the API-client endpoints exist on the wire (`{{ZIAMBaseUrl}}/api-clients`, `.../api-clients/:id`, `.../api-clients/:id/secrets`). (`vendor/zscaler-api-specs/oneapi-postman-collection.json:129315,129557,128576`)

**Significance / which to trust:** Programmatic API-client management is now represented in both SDKs. The Go package uses the same `/ziam/admin/api/v1/api-clients` endpoint and adds explicit secret handling; its declarations establish client-side coverage only, not backend availability or tenant entitlement. MCP still exposes no API-client tool. (Scope rule: MCP-server tool coverage is out of scope here — this entry concerns the product SDKs and API surface only.)

---

## Client authentication type enum

### `authType` is SECRET / PUBKEYCERT / JWKS

**What each source says:**

- **Python SDK:** the `add_api_client` / `update_api_client` docstrings document `auth_type` values as `"SECRET"`, `"PUBKEYCERT"`, `"JWKS"`. (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:167`) The model round-trips the raw wire key `authType`. (`vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py:151,173`)
- **Postman:** sample `clientAuthentication` bodies carry `"authType": "SECRET"` and `"authType": "PUBKEYCERT"`, alongside a sibling `clientJWKsUrl` field used by the JWKS variant. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:129232,129375`)

**Significance / which to trust:** Trust the three-value enum `SECRET` / `PUBKEYCERT` / `JWKS`. `SECRET` selects client-secret authentication, `PUBKEYCERT` selects an uploaded public-key certificate (`clientCertificates`/`publicKeys`), and `JWKS` selects a JWKS-URL configuration (`clientJWKsUrl`). Do not invent alternate spellings such as `PRIVATE_KEY_JWT`, `JWKS_URL`, or `PUBLIC_KEY` — the wire value is one of the three above.

---

## Audience is auto-injected on token exchange

### Both SDKs hardcode `audience=https://api.zscaler.com`

**What each source says:**

- **Python SDK:** the client-secret token request sets `"audience": "https://api.zscaler.com"` in the form body (`vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:298`); the private-key path sets the same `audience` form field and an `"aud": "https://api.zscaler.com"` JWT claim (`vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:389,375`).
- **Go SDK:** the client-secret token request sets `data.Set("audience", "https://api.zscaler.com")` (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:255`); the cert path sets the JWT `"aud": "https://api.zscaler.com"` claim and the `audience` form field (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:316,330`).

**Significance / which to trust:** The `audience` value is a fixed constant set by the SDK on every token exchange — it is not a caller-supplied parameter, and it is the same string (`https://api.zscaler.com`) for both client-secret and JWT-bearer grants in both SDKs. Any documentation that frames `audience` as a required manual input is wrong; the SDK injects it. A raw-HTTP caller reproducing the token exchange must send this exact audience.

---

## Wire parameter naming differs from SDK field names

### Python camelCases query keys on the wire (`excludeDynamicGroups`); Go uses run-together lowercase (`excludedynamicgroups`); `[like]` keeps its brackets in both

**What each source says:**

- **Python SDK:** the groups list docstring exposes the `query_params` keys as `exclude_dynamic_groups` (`vendor/zscaler-sdk-python/zscaler/zid/groups.py:53`) and the partial-match filter as `name[like]` (`vendor/zscaler-sdk-python/zscaler/zid/groups.py:52`, `vendor/zscaler-sdk-python/zscaler/zid/api_client.py:52`). Those are the *method-argument* spellings, not the wire spellings: `create_request` routes the params dict through `_prepare_params`, and because a ZIdentity URL (`/ziam/admin/api/v1`) resolves to the non-ZPA service type `"ziam"` (`vendor/zscaler-sdk-python/zscaler/request_executor.py:196-197`), it takes the non-ZPA else-branch (`:503-506`) which calls `convert_keys_to_camel_case(params)` (`:505`). That helper lower-camelCases each key via `to_lower_camel_case` (`vendor/zscaler-sdk-python/zscaler/helpers.py:162-342`, `:357-374`), so Python actually sends `excludeDynamicGroups` on the wire (and `loginName` / `displayName[like]` / `primaryEmail[like]` for the per-user filters). The `name[like]` filter has no underscore, so it passes through unchanged (`helpers.py:329-342`).
- **Go SDK:** the shared `PaginationQueryParams` struct maps the exclude flag to the run-together lowercase wire key `excludedynamicgroups` (`url:"excludedynamicgroups,omitempty"`) and the filter to `name[like]` with the brackets preserved (`url:"name[like],omitempty"`). (`vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go:31-44`) The `ToURLValues` serializer emits exactly `values.Set("excludedynamicgroups", "true")` and `values.Set("name[like]", ...)`. (`vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go:102-145`)
- **Postman:** request URLs spell the filter with brackets on the wire, e.g. `.../api-clients?...&name[like]=ut`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:129152`)

**Significance / which to trust:** The two SDKs send *different* wire spellings for the same logical filter, and neither matches the snake_case method-argument name. Python emits **camelCase** (`excludeDynamicGroups`, `loginName`, `displayName[like]`); Go emits **run-together lowercase** (`excludedynamicgroups`, `loginname`, `displayname[like]`). So the real divergence is Python-camelCase vs Go-run-together — *not* underscored-vs-run-together. A raw-HTTP caller must pick one spelling deliberately — Python's camelCase or Go's run-together lowercase — and not copy the SDK's underscored argument names. The `[like]` filters (`name[like]`, and per-user `loginname[like]` / `displayname[like]` / `primaryemail[like]` on the Go side at `vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go:38-41`; `loginName[like]` / `displayName[like]` / `primaryEmail[like]` on the Python side) carry literal square brackets in the query string either way, and must be URL-encoded.

---

## Go OneAPI retry and error-path boundary

ZIdentity calls made through the Go unified client share OneAPI's transport.
Its 5xx retry callback uses `IsRetryableServerError`
(`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:382-405`), an SDK heuristic that
does not retry 501, always retries 502/503/504, recognizes four exact
case-sensitive transient body strings on other 5xx responses, and otherwise
stops only for a top-level nonempty string JSON `code`
(`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:279-364`). This is not a
ZIdentity backend error taxonomy.

When retry exhaustion leaves an HTTP response and no transport error, the
inner handler returns that response for the outer request layer to classify
(`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:211-233`). Ordinary non-success
status paths call `CheckErrorInResponse`, whose `ErrorResponse` retains the
response/status, parsed code/message/ID/reason/exception, and raw body text;
the parser reads and closes the original body
(`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:843-850`;
`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:13-28,57-110`). Transport,
request-timeout, session-exhaustion, and long-`Retry-After` exits are not all
converted to that structure
(`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:619-626,633-650,714-718`).

The default OneAPI retry configuration also applies 10 to both the inner
`RetryMax` and the outer request-loop limit. A response path that traverses
both layers can therefore consume up to 110 HTTP attempts; that number is an
SDK implementation budget, not server behavior
(`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:32-39,160-165,608-617`).

---

## Open questions

- The `JWKS` `authType` value is documented in the Python SDK docstring (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:167`); the captured Postman samples exercise only `SECRET` and `PUBKEYCERT` bodies, so a live `JWKS`-configured client body was not observed in the vendored sources. — see [clarification `zid-14`](../_meta/clarifications.md#zid-14-jwks-authtype-request-body-unobserved-in-vendored-sources)
- Whether tenants continue to accept the legacy Go client's bare `/admin/api/v1` vanity-admin URL after the OneAPI migration is not determinable from the refreshed source. Current Go code emits `/ziam/admin/api/v1` through OneAPI; SDK declarations do not establish which legacy URL aliases remain live. — see [clarification `zid-15`](../_meta/clarifications.md#zid-15-bare-adminapiv1-prefix-acceptance-on-the-apizsapinet-host)
