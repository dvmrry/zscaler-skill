---
product: zidentity
topic: "zidentity-api"
title: "ZIdentity API — endpoint catalog, API clients, and auth flow"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "https://help.zscaler.com/zidentity/understanding-zidentity-apis"
  - "vendor/zscaler-help/understanding-zidentity-apis.md"
  - "vendor/zscaler-help/zidentity-about-api-clients.md"
  - "vendor/zscaler-sdk-python/zscaler/zid/"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/"
author-status: draft
---

# ZIdentity API surface

The ZIdentity API provides programmatic access to identity lifecycle management and API client management for the ZIdentity platform. It is accessed through the same OneAPI gateway as ZIA, ZPA, and ZDX, using OAuth 2.0 token auth issued by ZIdentity itself.

ZIdentity API base path: `/ziam/admin/api/v1` (Tier A — confirmed from SDK source).

---

## 1. API endpoint categories

ZIdentity exposes four top-level feature categories via its API (Tier A — vendor doc, `understanding-zidentity-apis.md`):

| Category | Purpose | SDK-exposed? |
|---|---|---|
| **API Clients** | Create and manage OAuth 2.0 API clients; secret lifecycle | Python full CRUD; Go not available |
| **Users** | User directory CRUD; group membership | Python + Go full CRUD |
| **Groups** | Group CRUD; member management | Python + Go full CRUD |
| **Resource Servers** | Introspect available API resources and scopes | Python read-only; Go full CRUD |

Each category has a corresponding base path:

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

### 2.3 Token lifecycle

- Access tokens are short-lived (exact duration configurable at API client creation via `access_token_life_time` in seconds).
- No refresh token flow is documented for client credentials grant.
- Token revocation: the ZIdentity admin portal exposes a **Revoking Access Tokens** capability. No SDK-level revocation endpoint has been confirmed.
- Secrets (`client_secret`) can be managed via the `api_client` SDK service — `get_api_client_secret`, `add_api_client_secret`, `delete_api_client_secret`. Secrets have an optional `expires_at` (Unix epoch string). Secret values are returned only at creation time; `get_api_client_secret` returns metadata only.

---

## 3. API client types and scopes

### 3.1 What an API client is

An API client is an application or service identity registered in ZIdentity that can receive OAuth 2.0 credentials and call Zscaler APIs via the OneAPI gateway. It is the machine equivalent of a human admin account. (Tier A — vendor doc, `zidentity-about-api-clients.md`).

Key features:
- One API client can be granted access to multiple products simultaneously by including multiple resource servers in `client_resources`.
- Access is controlled by ZIdentity's authorization layer; the API client must have explicit scope grants for each product API it calls.
- An **API Client Access Policy** can further restrict which API clients are permitted to call which operations.

### 3.2 API client configuration fields

From the SDK (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py`):

| Field | Type | Notes |
|---|---|---|
| `name` | string | Display name |
| `description` | string | Optional |
| `status` | bool | `true` = active |
| `access_token_life_time` | int (seconds) | Token expiry duration |
| `client_authentication.auth_type` | enum | `"SECRET"`, `"PUBKEYCERT"`, `"JWKS"` |
| `client_authentication.client_jw_ks_url` | string | JWKS endpoint URL (JWKS auth type) |
| `client_authentication.public_keys` | list | Public keys (PUBKEYCERT auth type) |
| `client_authentication.client_certificates` | list | Client certs (PUBKEYCERT auth type) |
| `client_resources` | list | Resource servers + scope grants |
| `client_resources[].id` | string | Resource server ID |
| `client_resources[].name` | string | Resource server name |
| `client_resources[].default_api` | bool | Whether this is a default API |
| `client_resources[].selected_scopes` | list of `{id, name}` | Scopes granted on this resource |

### 3.3 Scope name format

Scope identifiers follow a compound key format (Tier A — SDK source):

```
zs:config:<product-cloud>:<org-id>:config:<role-id>:<role-name>
```

The `client_resources[].id` references the resource server ID in ZIdentity. The `selected_scopes[].id` uses a colon-separated compound key referencing resource and scope IDs. Scope IDs can be discovered via `list_resource_servers` / `get_resource_server`.

### 3.4 Admin portal management

API client **creation** is available via the admin portal (Administration > API Configuration > OneAPI > API Clients) and also via the Python SDK `add_api_client`. On the admin portal page, each client shows: Name, Client ID, Status. Enabling, disabling, editing, and deleting are all supported from the portal. (Tier A — vendor doc, `zidentity-about-api-clients.md`).

---

## 4. SDK services under `client.zid.*`

The ZIdentity SDK is accessed via `client.zid.<service>`. All services use the base endpoint `/ziam/admin/api/v1`.

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

Python SDK is read-only. Go SDK adds `Create`, `Update`, `Delete`. A resource server record includes: `id`, `name`, `display_name`, `description`, `primary_aud`, `default_api`, `service_scopes` (list of service + scope associations). Use this to discover available scope IDs for `add_api_client`.

---

## 5. Pagination

ZIdentity uses `offset`/`limit` pagination — distinct from ZIA (`page`/`pageSize`) and ZPA (`page`/`page_size`). Response envelope fields: `results_total`, `page_offset`, `page_size`, `next_link`, `prev_link`, `records`. Default page size: 100; maximum: 1000.

**Python SDK:** list methods return a single-page result wrapped in a typed object (e.g., `APIClients`, `Groups`, `Users`). Individual records are in `result.records`. Full pagination requires a caller-managed loop incrementing the `offset` query param.

**Go SDK:** `common.ReadAllPagesWithPagination[T]` iterates pages using `offset`/`limit` and stops when `next_link` is empty or `len(records) < limit`. `ReadAllPagesWithCursor` chases `next_link` directly.

Useful query params for `list_users` / `list_group_users_details`:
`offset`, `limit`, `login_name`, `login_name[like]`, `display_name[like]`, `primary_email[like]`, `domain_name` (list), `idp_name` (list).

---

## 6. Rate limits

Rate limit specifics for ZIdentity endpoints are not documented in available SDK source or vendor help captures. Treat ZIdentity API as subject to OneAPI gateway rate limiting consistent with other Zscaler product APIs. No SDK-level rate-limit header parsing is implemented. The `RequestExecutor` handles intelligent retries on transient failures.

---

## 7. Python / Go SDK parity summary

| Service | Python | Go | Gap |
|---|---|---|---|
| `api_client` | Full CRUD + secret lifecycle | None identified | Go missing; Python-only |
| `groups` | Full CRUD + membership management | Full CRUD + `GetUsers` | Functionally equivalent |
| `users` | Full CRUD + `list_user_group_details` | Full CRUD + `GetGroupsByUser` | Functionally equivalent |
| `user_entitlement` | `get_admin_entitlement`, `get_service_entitlement` | Same | Parity |
| `resource_servers` | Read-only (list, get) | Full CRUD | Python missing Create/Update/Delete |

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

---

## Cross-links

- Overview (ZIdentity role, migration, step-up) — [`./overview.md`](./overview.md)
- Full SDK service catalog — [`./sdk.md`](./sdk.md)
- Step-up authentication — [`./step-up-authentication.md`](./step-up-authentication.md)
- ZIA API authentication section (legacy vs OneAPI) — [`../zia/api.md`](../zia/api.md)
- ZPA SDK client construction — [`../zpa/sdk.md §1.1`](../zpa/sdk.md)
