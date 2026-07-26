---
product: zidentity
topic: "api-divergences"
title: "ZIdentity API source divergences"
content-type: reference
source-tier: code
confidence: medium
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/**"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py"
  - "vendor/zscaler-sdk-python/zscaler/request_executor.py"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/**"
  - "vendor/zscaler-sdk-go/zscaler/oneapiclient.go"
  - "vendor/zscaler-sdk-go/zscaler/oneapiconfig.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZIdentity API source divergences

The Go SDK (`zscaler-sdk-go/zscaler/zid/services/`), the Python SDK (`zscaler-sdk-python/zscaler/zid/`), and the OneAPI Postman collection (`vendor/zscaler-api-specs/oneapi-postman-collection.json`) are three independent views of the same ZIdentity (`ziam`) admin API, produced separately and updated at different cadences. Where they agree, confidence is high. Where they diverge, an engineer needs to know which source to trust before writing code — and for ZIdentity the divergences start at the request URL itself: the two SDKs do not even target the same host.

This doc records the source-vs-source disagreements found across the `zid` surface. Each entry confirms the claim against the cited file line before stating which source to trust.

**Quick trust hierarchy (applies unless an entry below overrides it):**

- SDK service-layer source (Python `zid/` + Go `zid/services/`) is ground truth for which methods and wire params exist.
- Postman request/response samples confirm endpoint existence and live wire shapes, and beat SDK docstrings on field-name spelling.
- Both SDKs use `string` for all ZIdentity IDs; Postman's `<long>` annotations are a schema artifact — treat them as strings.

---

## Base path and host differ by SDK

### Python and Go target different hosts and different path prefixes

**What each source says:**

- **Python SDK:** every `zid` service class sets `_zidentity_base_endpoint = "/ziam/admin/api/v1"`. (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:31`, `vendor/zscaler-sdk-python/zscaler/zid/users.py:31`, `vendor/zscaler-sdk-python/zscaler/zid/groups.py:31`, `vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py:31`) The request executor resolves the host to `https://api.zsapi.net` for production (`vendor/zscaler-sdk-python/zscaler/request_executor.py:33`) or `https://api.{cloud}.zsapi.net` for non-government non-production clouds (`vendor/zscaler-sdk-python/zscaler/request_executor.py:186-189`). Net production URL: `https://api.zsapi.net/ziam/admin/api/v1/...`
- **Go SDK:** every `zid` service constant uses the bare `/admin/api/v1` prefix (`vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go:16`, `vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go:17`, `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:13`, `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:12`). The client detects a ZIdentity request by the substring `/admin/api/v1` and rewrites the host to the vanity-domain admin host: `https://{vanity}-admin.zslogin.net` for production, `https://{vanity}-admin.zslogin{cloud}.net` otherwise. (`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:388,410,412`) Net production URL: `https://{vanity}-admin.zslogin.net/admin/api/v1/...`
- **Postman:** the `ZIAMBase` collection variable is `{{oneAPIBaseUrl}}/ziam/admin/api/v1` (`vendor/zscaler-api-specs/oneapi-postman-collection.json:136360`), matching the Python prefix.

**Significance / which to trust:** This is the headline divergence. The same logical API is reached two different ways: Python and Postman hit `api.zsapi.net/ziam/admin/api/v1`; Go hits `{vanity}-admin.zslogin.net/admin/api/v1`. Anyone tracing traffic, writing a raw-HTTP caller, or configuring an allowlist must know which SDK they are mirroring — the host and the `/ziam` prefix both change. Trust each SDK's own constant for that SDK; trust Postman/Python for the `api.zsapi.net` path.

### Government OneAPI uses dedicated identity and API domains

The current Python SDK special-cases the FedRAMP cloud selectors rather than
feeding them into the commercial hostname pattern:

- `gov` authenticates at `https://{vanity}.zidentitygov.net/oauth2/v1/token`
  and sends API traffic to `https://api.zscalergov.net`.
- `govus` authenticates at `https://{vanity}.zidentitygov.us/oauth2/v1/token`
  and sends API traffic to `https://api.zscalergov.us`.

Source: `vendor/zscaler-sdk-python/zscaler/constants.py:21-29`; `vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:480-501`; `vendor/zscaler-sdk-python/zscaler/request_executor.py:172-189`.

Do not construct government URLs as `api.gov.zsapi.net` or
`{vanity}.zslogingov.net`; those follow the old commercial-pattern inference,
not the current SDK contract.

---

## Resource servers are read-only everywhere

### No create/update/delete in either SDK or the API

**What each source says:**

- **Python SDK:** `ResourceServersAPI` exposes only `list_resource_servers` and `get_resource_server`, both issuing `GET`. (`vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py:37,115`) There are no add/update/delete methods.
- **Go SDK:** the `resourceservers` package exposes only `Get`, `GetAll`, and `GetByName` — all read paths via `service.Client.Read`. (`vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:46,58,63`) There is no `Create`, `Update`, or `Delete` function in the package.
- **Postman:** the `resource-servers` folder contains only `GET` requests (list and get-by-id); no POST/PUT/DELETE entries exist. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:132113,132126,132275`)

**Significance / which to trust:** Resource servers are a read-only OAuth registry in all three sources. Any prior claim that the Go SDK offers full CRUD on resource servers is incorrect — the Go package mutates nothing here. (For contrast, the Go `users` package *does* have `Create`/`Update`/`Delete` at `vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go:94,109,120`, so the read-only constraint is specific to resource servers, not a blanket Go limitation.) Scope assignment is done from the API-client side via the client's resource linkage, not by mutating a resource server.

---

## API clients are Python-SDK-only

### Full client + secret lifecycle in Python; no Go service, no MCP tool

**What each source says:**

- **Python SDK:** `APIClientAPI` provides the full lifecycle — `list_api_clients`, `get_api_client`, `add_api_client`, `update_api_client`, `delete_api_client`, plus secret operations `get_api_client_secret`, `add_api_client_secret`, `delete_api_client_secret`. (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:37,112,156,265,355,392,436,491`) It is registered on the service as `api_client`. (`vendor/zscaler-sdk-python/zscaler/zid/zid_service.py`, `APIClientAPI` property)
- **Go SDK:** the `zid/services/` directory contains only `common`, `groups`, `resource_servers`, `user_entitlement`, and `users` — there is no `api_client` (or `api_clients`) package at all.
- **Postman:** the API-client endpoints exist on the wire (`{{ZIAMBase}}/api-clients`, `.../api-clients/:id`, `.../api-clients/:id/secrets`). (`vendor/zscaler-api-specs/oneapi-postman-collection.json:129315,129557,128576`)

**Significance / which to trust:** Programmatic API-client management is a Python-SDK capability with no Go equivalent. A Go caller who needs to create or rotate API clients must craft raw HTTP requests against the wire endpoints the Postman collection documents; the SDK will not help. (Scope rule: MCP-server tool coverage is out of scope here — this entry concerns the product SDKs and API surface only.)

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

- **Python SDK:** the groups list docstring exposes the `query_params` keys as `exclude_dynamic_groups` (`vendor/zscaler-sdk-python/zscaler/zid/groups.py:53`) and the partial-match filter as `name[like]` (`vendor/zscaler-sdk-python/zscaler/zid/groups.py:52`, `vendor/zscaler-sdk-python/zscaler/zid/api_client.py:52`). Those are the *method-argument* spellings, not the wire spellings: `create_request` routes the params dict through `_prepare_params`, and because a ZIdentity URL (`/ziam/admin/api/v1`) resolves to the non-ZPA service type `"ziam"` (`vendor/zscaler-sdk-python/zscaler/request_executor.py:183-184`), it takes the non-ZPA else-branch (`:466-468`) which calls `convert_keys_to_camel_case(params)` (`:468`). That helper lower-camelCases each key via `to_lower_camel_case` (`vendor/zscaler-sdk-python/zscaler/helpers.py:341`, `:152-314`), so Python actually sends `excludeDynamicGroups` on the wire (and `loginName` / `displayName[like]` / `primaryEmail[like]` for the per-user filters). The `name[like]` filter has no underscore, so it passes through unchanged (`helpers.py:301-302`).
- **Go SDK:** the shared `PaginationQueryParams` struct maps the exclude flag to the run-together lowercase wire key `excludedynamicgroups` (`url:"excludedynamicgroups,omitempty"`) and the filter to `name[like]` with the brackets preserved (`url:"name[like],omitempty"`). (`vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:35,36`) The `ToURLValues` serializer emits exactly `values.Set("excludedynamicgroups", "true")` and `values.Set("name[like]", ...)`. (`vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:113,116`)
- **Postman:** request URLs spell the filter with brackets on the wire, e.g. `.../api-clients?...&name[like]=ut`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:129152`)

**Significance / which to trust:** The two SDKs send *different* wire spellings for the same logical filter, and neither matches the snake_case method-argument name. Python emits **camelCase** (`excludeDynamicGroups`, `loginName`, `displayName[like]`); Go emits **run-together lowercase** (`excludedynamicgroups`, `loginname`, `displayname[like]`). So the real divergence is Python-camelCase vs Go-run-together — *not* underscored-vs-run-together. The earlier framing that the Python `exclude_dynamic_groups` "is the binding-layer name and `excludedynamicgroups` is the wire key" was wrong on the Python side: Python never sends the underscored form, but it does not send Go's run-together form either. A raw-HTTP caller must pick one spelling deliberately — Python's camelCase or Go's run-together lowercase — and not copy the SDK's underscored argument names. The `[like]` filters (`name[like]`, and per-user `loginname[like]` / `displayname[like]` / `primaryemail[like]` on the Go side at `vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:39,40,41`; `loginName[like]` / `displayName[like]` / `primaryEmail[like]` on the Python side) carry literal square brackets in the query string either way, and must be URL-encoded.

---

## Open questions

- The `JWKS` `authType` value is documented in the Python SDK docstring (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:167`); the captured Postman samples exercise only `SECRET` and `PUBKEYCERT` bodies, so a live `JWKS`-configured client body was not observed in the vendored sources. — see [clarification `zid-14`](../_meta/clarifications.md#zid-14-jwks-authtype-request-body-unobserved-in-vendored-sources)
- Whether the API accepts the bare `/admin/api/v1` prefix on the `api.zsapi.net` host (or only on the `{vanity}-admin.zslogin.net` host the Go SDK uses) is not determinable from source alone — the two SDKs pair their prefix with their own host and neither crosses over. — see [clarification `zid-15`](../_meta/clarifications.md#zid-15-bare-adminapiv1-prefix-acceptance-on-the-apizsapinet-host)
