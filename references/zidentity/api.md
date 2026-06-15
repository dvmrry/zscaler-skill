---
product: zidentity
topic: "zidentity-api"
title: "ZIdentity API — endpoint catalog, API clients, and auth flow"
content-type: reference
last-verified: "2026-06-15"
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/zidentity/understanding-zidentity-apis"
  - "vendor/zscaler-help/understanding-zidentity-apis.md"
  - "vendor/zscaler-help/zidentity-about-api-clients.md"
  - "vendor/zscaler-sdk-python/zscaler/zid/"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py"
  - "vendor/zscaler-sdk-python/zscaler/request_executor.py"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/"
  - "vendor/zscaler-sdk-go/zscaler/oneapiclient.go"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zid/"
author-status: draft
---

# ZIdentity API surface

The ZIdentity API provides programmatic access to identity lifecycle management and API client management for the ZIdentity platform. It is accessed through the same OneAPI gateway as ZIA, ZPA, and ZDX, using OAuth 2.0 token auth issued by ZIdentity itself.

ZIdentity API base path **and host** both differ between the two SDKs — this is a headline wire divergence (see [`./api-divergences.md § 1`](./api-divergences.md)):

- **Python SDK:** `/ziam/admin/api/v1` (`_zidentity_base_endpoint` in all five service files — `vendor/zscaler-sdk-python/zscaler/zid/users.py:31`, `api_client.py:31`, `groups.py:31`, `resource_servers.py:31`, `user_entitlement.py:29`).
- **Go SDK:** `/admin/api/v1` — no `/ziam` prefix (`usersEndpoint = "/admin/api/v1/users"` `vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go:16`; `groupsEndpoint` `groups.go:17`; `resourceServerEndpoint` `resource_servers.go:13`; `entitlementEndpoint = "/admin/api/v1/users"` `user_entitlement.go:12`).

The request URLs differ in **both host and path**: Python POSTs `https://api.zsapi.net/ziam/admin/api/v1/users`; Go rewrites the host to `https://{vanity}-admin.zslogin.net` and POSTs `https://{vanity}-admin.zslogin.net/admin/api/v1/users` (`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:388,402-414`). The `/admin` prefix is also how the Go client detects a ZIdentity call — `detectServiceType` maps a `/admin` path prefix to the `"admin"` service type (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:409`) — then substitutes the vanity-admin host. If you write a raw-HTTP caller, match **both** host and prefix to the SDK you are mirroring. The endpoint tables in §1 and §4 below use the Python `/ziam`-prefixed form against `api.zsapi.net`; strip `/ziam` and swap the host for the Go equivalents.

Source: `vendor/zscaler-help/understanding-zidentity-apis.md`; `vendor/zscaler-help/zidentity-about-api-clients.md`; `vendor/zscaler-sdk-python/zscaler/zid/zid_service.py`; `vendor/zscaler-sdk-python/zscaler/zid/api_client.py`; `vendor/zscaler-sdk-python/zscaler/zid/users.py`; `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py`; `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go`; `vendor/zscaler-sdk-go/zscaler/oneapiclient.go`; `vendor/zscaler-sdk-python/zscaler/request_executor.py`.

---

## 1. API endpoint categories

ZIdentity exposes four top-level feature categories via its API (Tier A — vendor doc, `understanding-zidentity-apis.md`):

| Category | Purpose | Python SDK | Go SDK | MCP server |
|---|---|---|---|---|
| **API Clients** | Create and manage OAuth 2.0 API clients; secret lifecycle | Full CRUD | Not available | Not available |
| **Users** | User directory CRUD; group membership | Full CRUD | Full CRUD | Read-only (5 tools) |
| **Groups** | Group CRUD; member management | Full CRUD | Full CRUD | Read-only (5 tools) |
| **Resource Servers** | Introspect available API resources and scopes | Read-only | Read-only | Not available |

The MCP server only implements a read-only slice of ZIdentity: `users` + `groups` (the `zid/` tools directory contains only `vendor/zscaler-mcp-server/zscaler_mcp/tools/zid/groups.py` and `vendor/zscaler-mcp-server/zscaler_mcp/tools/zid/users.py`; the `ZIDService` registers ten read tools and declares `self.write_tools = []  # ZIdentity has no write operations` — `vendor/zscaler-mcp-server/zscaler_mcp/services.py:2465`, `:2518`). There are no MCP tools for API clients, resource servers, or entitlements. The practical consequence: **the only programmatic path to manage API clients is the Python SDK `api_client` service** — Go has no `api-clients` package and the MCP server exposes no such tool.

Source: `vendor/zscaler-mcp-server/zscaler_mcp/tools/zid/groups.py`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zid/users.py`; `vendor/zscaler-mcp-server/zscaler_mcp/services.py:2465`; `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:46`.

Each category has a corresponding base path (shown in the **Python** `/ziam`-prefixed form; the Go SDK omits the `/ziam` prefix — see base-path divergence at the top of this doc):

| Category | Base path |
|---|---|
| API Clients | `/ziam/admin/api/v1/api-clients` |
| Users | `/ziam/admin/api/v1/users` |
| Groups | `/ziam/admin/api/v1/groups` |
| Resource Servers | `/ziam/admin/api/v1/resource-servers` |
| User entitlements (admin) | `/ziam/admin/api/v1/users/{user_id}/admin-entitlements` |
| User entitlements (service) | `/ziam/admin/api/v1/users/{user_id}/service-entitlements` |

---

## 2. Authentication flow for ZIdentity API access

Source: `vendor/zscaler-help/understanding-zidentity-apis.md`; `vendor/zscaler-help/zidentity-about-api-clients.md`; `vendor/zscaler-sdk-python/zscaler/zid/`.

### 2.1 How it differs from ZIA/ZPA OneAPI

ZIA and ZPA OneAPI calls use a token issued by ZIdentity but scoped to ZIA or ZPA resource servers. Calling the **ZIdentity admin API itself** requires a token scoped to ZIdentity admin resources. The calling API client must be registered in ZIdentity with ZIdentity admin scopes — not just ZIA or ZPA scopes.

This means a ZPA-only API client cannot call the ZIdentity admin API. The API client must have `client_resources` that include the ZIdentity resource server and the appropriate admin scopes.

### 2.2 Token issuance endpoint

All OneAPI tokens are issued at:

```
POST https://<vanity>.zslogin.net/oauth2/v1/token
```

Request body (client credentials flow):

```
grant_type=client_credentials
&client_id=<client_id>
&client_secret=<client_secret>
```

Or, for private key JWT authentication:

```
grant_type=client_credentials
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=<signed_jwt>
```

The issued access token is a Bearer token, passed as `Authorization: Bearer <token>` on all subsequent API requests.

**Private-key JWT assertion mechanics** (from the Python OAuth client, `vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py`):

- Signing algorithm is fixed at **RS256** (`:381`, `pyjwt.encode(payload, private_key_obj, algorithm="RS256")`).
- The assertion payload sets `iss` and `sub` to the `client_id`, `aud` to `https://api.zscaler.com`, and `exp` to **now + 600 seconds (10-minute lifetime)** (`:372-377`).
- RSA private keys are validated to be **at least 2048 bits** (`MIN_RSA_KEY_SIZE = 2048`, `:24`); shorter keys are rejected to mitigate CWE-326 (`:44-50`, `:367`).
- The `private_key` input accepts a PEM string, a JWK object, or a file path (`:344-365`).

### 2.3 Token lifecycle

- `access_token_life_time` is an SDK-accepted integer field at API client creation (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:164`, `:195`). Its semantics are unresolved: the field name implies a per-client token-TTL override (seconds), but the field's docstring reads "Whether the client is active" — an active-flag description that contradicts the name. Whether it actually controls token lifetime is not determinable from SDK source alone — see [clarification `zid-11`](../_meta/clarifications.md#zid-11-access_token_life_time-field-semantics).
- No refresh token flow is documented for the client credentials grant in available SDK source.
- Token revocation: a "Revoking Access Tokens" capability is referenced in the related-articles list of the captured API-clients help page (`vendor/zscaler-help/zidentity-about-api-clients.md:47`), but that page itself is **not captured** in `vendor/zscaler-help/` — treat revocation behavior as an uncaptured reference, not confirmed source. No SDK-level revocation endpoint exists in the `api_client` service (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py` — methods are limited to client + secret CRUD).
- Secrets (`client_secret`) are managed via the `api_client` SDK service — `get_api_client_secret`, `add_api_client_secret`, `delete_api_client_secret` (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py`). The secret model carries `id`, `expires_at` (Unix epoch string), `created_at`, and `value` (`vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py:301-310`). Whether `value` is populated only on creation versus also on read is an API-server behavior not determinable from SDK source — see Open questions.

---

## 3. API client types and scopes

### 3.1 What an API client is

An API client is an application or service identity registered in ZIdentity that can receive OAuth 2.0 credentials and call Zscaler APIs via the OneAPI gateway. It is the machine equivalent of a human admin account. (Tier A — vendor doc, `zidentity-about-api-clients.md`).

Key features:
- One API client can be granted access to multiple products simultaneously by including multiple resource servers in `client_resources` (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:199-228` — example with ZIA, ZCC, Cloud Connector, ZIdentity, ZDX, and ZPA scopes in one request).
- Access is controlled by ZIdentity's authorization layer; the API client must have explicit scope grants for each product API it calls (`vendor/zscaler-help/zidentity-about-api-clients.md:16`).
- An **API Client Access Policy** is referenced in the related-articles list of the captured API-clients help page (`vendor/zscaler-help/zidentity-about-api-clients.md:48-49`: "About the API Client Access Policy", "Adding API Client Access Policy Rule"), but those pages are **not captured** in `vendor/zscaler-help/` — treat the access-policy mechanism as an uncaptured reference, not confirmed source.

### 3.2 API client configuration fields

From the SDK (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py`):

| Field | Type | Notes |
|---|---|---|
| `name` | string | Display name |
| `description` | string | Optional |
| `status` | bool | `true` = active |
| `access_token_life_time` | int | Token TTL in seconds (field name), but docstring reads as active-flag — semantics unresolved; see [zid-11](../_meta/clarifications.md#zid-11-access_token_life_time-field-semantics) |
| `client_authentication.auth_type` | enum | `"SECRET"`, `"PUBKEYCERT"`, `"JWKS"` |
| `client_authentication.client_jw_ks_url` | string | JWKS endpoint URL (JWKS auth type) |
| `client_authentication.public_keys` | list | Public keys (PUBKEYCERT auth type) |
| `client_authentication.client_certificates` | list | Client certs (PUBKEYCERT auth type) |
| `client_resources` | list | Resource servers + scope grants |
| `client_resources[].id` | string | Resource server ID |
| `client_resources[].name` | string | Resource server name |
| `client_resources[].default_api` | bool | Whether this is a default API |
| `client_resources[].selected_scopes` | list of `{id, name}` | Scopes granted on this resource. `id` = opaque `resourceId::scopeId` key; `name` = `zs:config:...` scope string (see §3.3) |

### 3.3 Scope name format

Each entry in `selected_scopes` is an `{id, name}` pair — they are **two different identifiers**, not one (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:204-229`):

- `selected_scopes[].id` is an opaque colon-/double-colon-joined `resourceId::scopeId` key, e.g. `"hhlm44raf07ps::hpopqi71j075n"`. ZPA uses a three-part form, e.g. `"hhlm44rae07ib:mplm44rqi07jb:hplm44rqvg7n5"` (`api_client.py:228`).
- `selected_scopes[].name` is the human-readable `zs:config:...` scope string.

The `zs:config:...` string is the **name**, not the id. Its shape varies by product (all from `vendor/zscaler-sdk-python/zscaler/zid/api_client.py:207-228`):

| Product | Example `name` |
|---|---|
| ZIA | `zs:config:zia.zscalerbeta.net:8061240:config:33860:ZIA_API_Role01` |
| ZCC | `zs:config:zcc.zscalerbeta.net:8061240:config:1:Super Admin` |
| Cloud Connector | `zs:config:cloud_connector.zscalerbeta.net:8061240:config:18350:Super Admin` |
| ZIdentity (self) | `zs:config:ziam:0:config:9h6p7ebv903k4:Super Admin` |
| ZDX | `zs:config:zdx.zscalerbeta.net:8061240:config:18347:ZDX Super Admin` |
| ZPA | `zs:config:zpa.zpabeta.net:72058304855015424:config:Default:Default:28:FullAccess` |

The ZIA/ZCC/Cloud Connector/ZDX shape is `zs:config:<product-cloud>:<org-id>:config:<role-id>:<role-name>`. ZPA adds a `Default:Default` segment and an extra colon level. **The ZIdentity self-scope uses the literal `ziam:0` segment in place of a product-cloud:org-id** (`api_client.py:219`) — this is the scope a client needs to call the ZIdentity admin API itself (the unresolved question raised in §2.1). The `client_resources[].id` references the resource server ID in ZIdentity; scope `id`/`name` pairs can be discovered via `list_resource_servers` / `get_resource_server`.

### 3.4 Admin portal management

Source: `vendor/zscaler-help/zidentity-about-api-clients.md`; `vendor/zscaler-sdk-python/zscaler/zid/api_client.py`.

API client **creation** is available via the admin portal (Administration > API Configuration > OneAPI > API Clients) and also via the Python SDK `add_api_client`. On the admin portal page, each client shows: Name, Client ID, Status. Enabling, disabling, editing, and deleting are all supported from the portal. (Tier A — vendor doc, `zidentity-about-api-clients.md`).

---

## 4. SDK services under `client.zid.*`

Source: `vendor/zscaler-sdk-python/zscaler/zid/zid_service.py`; `vendor/zscaler-sdk-python/zscaler/zid/api_client.py`; `vendor/zscaler-sdk-python/zscaler/zid/users.py`; `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py`; `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go`.

The ZIdentity SDK is accessed via `client.zid.<service>`. The endpoint tables below use the **Python** base endpoint `/ziam/admin/api/v1` (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:31`). The Go SDK uses `/admin/api/v1` (no `/ziam` prefix) **and a different host** — `https://{vanity}-admin.zslogin.net`, not `api.zsapi.net` (`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:404-414`). For the Go equivalent of each path below, strip `/ziam` **and** swap the host (see base-path divergence at the top of this doc).

### 4.1 `api_client` — `APIClientAPI`

Full CRUD for OAuth2 API clients registered in ZIdentity, including secret lifecycle management.

| Method | HTTP | Endpoint |
|---|---|---|
| `list_api_clients(query_params=None)` | GET | `/ziam/admin/api/v1/api-clients` |
| `get_api_client(client_id)` | GET | `/ziam/admin/api/v1/api-clients/{client_id}` |
| `add_api_client(**kwargs)` | POST | `/ziam/admin/api/v1/api-clients` |
| `update_api_client(client_id, **kwargs)` | PUT | `/ziam/admin/api/v1/api-clients/{client_id}` |
| `delete_api_client(client_id)` | DELETE | `/ziam/admin/api/v1/api-clients/{client_id}` |
| `get_api_client_secret(client_id)` | GET | `/ziam/admin/api/v1/api-clients/{client_id}/secrets` |
| `add_api_client_secret(client_id, **kwargs)` | POST | `/ziam/admin/api/v1/api-clients/{client_id}/secrets` |
| `delete_api_client_secret(client_id, secret_id)` | DELETE | `/ziam/admin/api/v1/api-clients/{client_id}/secrets/{secret_id}` |

Go SDK parity: No dedicated `api-clients` Go package identified. API client CRUD is Python-only in the SDK.

### 4.2 `groups` — `GroupsAPI`

Full CRUD for groups plus group membership management.

| Method | HTTP | Endpoint |
|---|---|---|
| `list_groups(query_params=None)` | GET | `/ziam/admin/api/v1/groups` |
| `get_group(group_id)` | GET | `/ziam/admin/api/v1/groups/{group_id}` |
| `add_group(**kwargs)` | POST | `/ziam/admin/api/v1/groups` |
| `update_group(group_id, **kwargs)` | PUT | `/ziam/admin/api/v1/groups/{group_id}` |
| `delete_group(group_id)` | DELETE | `/ziam/admin/api/v1/groups/{group_id}` |
| `list_group_users_details(group_id, query_params=None)` | GET | `/ziam/admin/api/v1/groups/{group_id}/users` |
| `add_user_to_group(group_id, user_id, **kwargs)` | POST | `/ziam/admin/api/v1/groups/{group_id}/users/{user_id}` |
| `add_users_to_group(group_id, **kwargs)` | POST | `/ziam/admin/api/v1/groups/{group_id}/users` |
| `replace_users_groups(group_id, **kwargs)` | PUT | `/ziam/admin/api/v1/groups/{group_id}/users` |
| `remove_user_from_group(group_id, user_id)` | DELETE | `/ziam/admin/api/v1/groups/{group_id}/users/{user_id}` |

`replace_users_groups` performs a full membership replacement — existing members not in the new list are removed. The SDK auto-transforms `["id1", "id2"]` to `[{"id": "id1"}, {"id": "id2"}]` before sending. Go SDK parity: full CRUD plus `GetUsers`.

### 4.3 `users` — `UsersAPI`

Full CRUD for user directory records plus per-user group membership lookup.

| Method | HTTP | Endpoint |
|---|---|---|
| `list_users(query_params=None)` | GET | `/ziam/admin/api/v1/users` |
| `get_user(user_id)` | GET | `/ziam/admin/api/v1/users/{user_id}` |
| `add_user(**kwargs)` | POST | `/ziam/admin/api/v1/users` |
| `update_user(user_id, **kwargs)` | PUT | `/ziam/admin/api/v1/users/{user_id}` |
| `delete_user(user_id)` | DELETE | `/ziam/admin/api/v1/users/{user_id}` |
| `list_user_group_details(user_id, query_params=None)` | GET | `/ziam/admin/api/v1/users/{user_id}/groups` |

Key `add_user`/`update_user` fields: `login_name`, `display_name`, `first_name`, `last_name`, `primary_email`, `status` (bool), `source` (`"UI"`, `"API"`, `"SCIM"`, `"JIT"`), `department`, `idp`. SCIM-sourced users may conflict if modified directly — SCIM provisioner takes precedence on next sync.

### 4.4 `user_entitlement` — `EntitlementAPI`

Read-only per-user entitlement lookups.

| Method | HTTP | Endpoint |
|---|---|---|
| `get_admin_entitlement(user_id)` | GET | `/ziam/admin/api/v1/users/{user_id}/admin-entitlements` |
| `get_service_entitlement(user_id)` | GET | `/ziam/admin/api/v1/users/{user_id}/service-entitlements` |

`get_admin_entitlement` returns the product roles (ZIA admin, ZPA admin, etc.) assigned to the user. `get_service_entitlement` returns which Zscaler service/tenant the user is provisioned into. Both are read-only; no list-all endpoint exists — always per-user lookups.

### 4.5 `resource_servers` — `ResourceServersAPI`

Introspection of resource server (OAuth2 protected API) registrations.

| Method | HTTP | Endpoint |
|---|---|---|
| `list_resource_servers(query_params=None)` | GET | `/ziam/admin/api/v1/resource-servers` |
| `get_resource_server(resource_id)` | GET | `/ziam/admin/api/v1/resource-servers/{resource_id}` |

Both SDKs are read-only here. The Go package exposes only `Get`, `GetAll`, `GetByName` — there are no `Create`/`Update`/`Delete` methods (`vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:46`, `:58`, `:63`). A resource server record includes: `id`, `name`, `display_name`, `description`, `primary_aud`, `default_api`, `service_scopes` (list of service + scope associations). Use this to discover available scope IDs for `add_api_client`.

---

## 5. Pagination

ZIdentity uses `offset`/`limit` pagination — distinct from ZIA (`page`/`pageSize`) and ZPA (`page`/`page_size`). Response envelope fields: `results_total`, `page_offset`, `page_size`, `next_link`, `prev_link`, `records`. Default page size: 100; maximum: 1000.

**Python SDK:** list methods return a single-page result wrapped in a typed object (e.g., `APIClients`, `Groups`, `Users`). Individual records are in `result.records`. Full pagination requires a caller-managed loop incrementing the `offset` query param.

**Go SDK:** `common.ReadAllPagesWithPagination[T]` iterates pages using `offset`/`limit` and stops when `next_link` is empty or `len(records) < limit`. `ReadAllPagesWithCursor` chases `next_link` directly.

Query params for `list_users` / `list_group_users_details` differ on the wire between the two SDKs — and neither sends the SDK's own snake_case method-argument spelling. The **Python** SDK does *not* pass the `query_params` dict through verbatim: `create_request` routes every params dict through `_prepare_params`, and because a ZIdentity URL (`/ziam/admin/api/v1`) resolves to a non-ZPA service type (`"ziam"`, `vendor/zscaler-sdk-python/zscaler/request_executor.py:183-184`), it falls into the non-ZPA else-branch (`vendor/zscaler-sdk-python/zscaler/request_executor.py:466-468`) which calls `convert_keys_to_camel_case(params)` (`:468`). That helper lower-camelCases every key via `to_lower_camel_case` (`vendor/zscaler-sdk-python/zscaler/helpers.py:341`, `:152-314`), so Python emits **camelCase** wire keys: `login_name`→`loginName`, the bracket form `login_name[like]`→`loginName[like]`, `exclude_dynamic_groups`→`excludeDynamicGroups`. The **Go** SDK emits **run-together (no-underscore) lowercase** wire keys via its `url` struct tags (`vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:32-42`) and the matching `ToURLValues` emitter (`:103-145`):

| Filter | SDK method arg (snake_case) | Python wire key (camelCase) | Go wire key (run-together) |
|---|---|---|---|
| offset / limit | `offset`, `limit` | `offset`, `limit` | `offset`, `limit` |
| login name (exact, list) | `login_name` | `loginName` | `loginname` |
| login name (partial) | `login_name[like]` | `loginName[like]` | `loginname[like]` |
| display name (partial) | `display_name[like]` | `displayName[like]` | `displayname[like]` |
| primary email (partial) | `primary_email[like]` | `primaryEmail[like]` | `primaryemail[like]` |
| domain name (list) | `domain_name` | `domainName` | `domainname` |
| IdP name (list) | `idp_name` | `idpName` | `idpname` |
| name (partial, groups) | `name[like]` | `name[like]` | `name[like]` |
| exclude dynamic groups | `exclude_dynamic_groups` | `excludeDynamicGroups` | `excludedynamicgroups` |

Both keep the bracket suffix for `[like]` partial-match params on the wire — Python carries the `[like]` through unchanged while camelCasing the field token (`name[like]` has no underscore so it passes through verbatim, `helpers.py:301-302`); Go declares the bracket form literally in its `url` tags (`common.go:35`, `:39`) and emits it via `values.Set(...)` (`:113`, `:125`). A direct-HTTP caller must pick one spelling deliberately and cannot copy the SDK's snake_case argument names: send Python's camelCase form (`loginName`, `excludeDynamicGroups`) or Go's run-together form (`loginname`, `excludedynamicgroups`); the underscored snake_case spelling appears on the wire from neither SDK. This is a real Python-vs-Go wire divergence: the two SDKs send different query strings for the same logical filter.

Source: `vendor/zscaler-sdk-python/zscaler/zid/users.py`; `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-python/zscaler/request_executor.py`; `vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go`.

---

## 6. Rate limits

Rate limit specifics for ZIdentity endpoints are not documented in available SDK source or vendor help captures. Treat ZIdentity API as subject to OneAPI gateway rate limiting consistent with other Zscaler product APIs. No SDK-level rate-limit header parsing is implemented. The `RequestExecutor` handles intelligent retries on transient failures.

---

## 7. Python / Go SDK parity summary

| Service | Python | Go | MCP server | Gap |
|---|---|---|---|---|
| `api_client` | Full CRUD + secret lifecycle | None identified | None | Python-only — the sole programmatic path for API clients |
| `groups` | Full CRUD + membership management | Full CRUD + `GetUsers` | Read-only (5 tools) | SDKs functionally equivalent; MCP read-only |
| `users` | Full CRUD + `list_user_group_details` | Full CRUD + `GetGroupsByUser` | Read-only (5 tools) | SDKs functionally equivalent; MCP read-only |
| `user_entitlement` | `get_admin_entitlement`, `get_service_entitlement` | Same (read-only) | None | SDK parity, both read-only |
| `resource_servers` | Read-only (`list`, `get`) | Read-only (`Get`, `GetAll`, `GetByName`) | None | Read-only everywhere — no write surface in either SDK |

Note the wire divergences beyond method parity: base path (`/ziam/admin/api/v1` Python vs `/admin/api/v1` Go, top of doc) and query-param key spelling (§5).

Source: `vendor/zscaler-sdk-python/zscaler/zid/api_client.py`; `vendor/zscaler-sdk-python/zscaler/zid/users.py`; `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py`; `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go`; `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go`.

---

## 8. SDK cross-reference

For the full SDK service catalog with method signatures, endpoint paths, model classes, and pagination patterns, see [`./sdk.md`](./sdk.md).

For API client creation in the context of setting up OneAPI credentials for ZPA or ZIA automation, see the client construction examples in [`../zpa/sdk.md §1.1`](../zpa/sdk.md).

---

## 9. Open questions

- Exact rate limits for ZIdentity endpoints vs other product endpoints — not documented.
- Whether bulk-provisioning endpoints (beyond SCIM push flow) exist for users or groups.
- Whether `list_resource_servers` returns all resource servers including Zscaler-internal ones, or only tenant-visible ones.
- Acceptable range for `add_api_client_secret` `expires_at` parameter; behavior when omitted.
- Whether the API client secret `value` is returned only at creation versus also on `get_api_client_secret`. The SDK secret model deserializes `value` whenever it is present in the response (`vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py:305`), so this is a server-side behavior the SDK does not constrain; needs live confirmation.
- Token revocation mechanics and the API Client Access Policy rule model are referenced in the captured API-clients help page's related-articles list (`vendor/zscaler-help/zidentity-about-api-clients.md:47-49`) but the underlying help pages are not captured — capture "About Access Tokens", "Revoking Access Tokens", "About the API Client Access Policy", and "Adding API Client Access Policy Rule" to back these claims.
- Whether the base-path/host divergence (Python `https://api.zsapi.net/ziam/admin/api/v1` vs Go `https://{vanity}-admin.zslogin.net/admin/api/v1`, `oneapiconfig.go:404-414`) means a live tenant serves both forms or the two SDKs target genuinely distinct front-ends — source pins each SDK to its own host+prefix; only live testing confirms whether the other form also resolves.

---

## Cross-links

- Overview (ZIdentity role, migration, step-up) — [`./overview.md`](./overview.md)
- Full SDK service catalog — [`./sdk.md`](./sdk.md)
- Step-up authentication — [`./step-up-authentication.md`](./step-up-authentication.md)
- ZIA API authentication section (legacy vs OneAPI) — [`../zia/api.md`](../zia/api.md)
- ZPA SDK client construction — [`../zpa/sdk.md §1.1`](../zpa/sdk.md)
