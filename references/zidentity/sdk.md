---
product: zidentity
topic: zidentity-sdk
title: "ZIdentity SDK reference — Python and Go service catalog"
content-type: reference
last-verified: 2026-04-26
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/"
---

# ZIdentity SDK reference

## Overview

The ZIdentity SDK wraps the ZIdentity admin API (`/ziam/admin/api/v1`). It covers user directory management, group membership management, API client lifecycle management (OAuth2 clients registered in ZIdentity), resource server introspection, and per-user entitlement lookups. ZIdentity is the authentication platform underlying all OneAPI token issuance across the Zscaler portfolio.

### Client construction — Python

ZIdentity is accessed exclusively via the OneAPI path — there is no legacy client for this product.

```python
from zscaler import ZscalerClient

client = ZscalerClient(
    client_id="...",
    client_secret="...",
    vanity_domain="acme",
    cloud="zscloud",
)
users = client.zid.users.list_users()
```

`ZIdService` (`zscaler/zid/zid_service.py`) is instantiated inside `ZscalerClient`. It takes a `RequestExecutor` directly (not a parent client object — note the constructor signature differs from ZCC and ZDX service classes). All service properties (`api_client`, `groups`, `users`, `user_entitlement`, `resource_servers`) instantiate their API class on each property access.

The base endpoint for all ZIdentity operations is `/ziam/admin/api/v1`.

### Client construction — Go

```go
config, err := zscaler.NewConfiguration(
    zscaler.WithClientID("..."),
    zscaler.WithClientSecret("..."),
    zscaler.WithVanityDomain("acme"),
    zscaler.WithCloud("zscloud"),
)
service, err := zscaler.NewOneAPIClient(config)
users, err := users.GetAll(ctx, service, nil)
```

Go ZIdentity services use `service.Client.Read` / `service.Client.Create` / `service.Client.UpdateWithPut` / `service.Client.Delete` (same interface as ZIA). String IDs (not integers). `GetByName` returns `[]T` using `strings.Contains` partial matching.

### Authentication specifics — OneAPI

ZIdentity is the token issuer for all OneAPI products. To call ZIdentity admin APIs, the calling API client must itself be a client registered in ZIdentity with appropriate ZIdentity admin scopes. The token exchange targets `https://<vanity>.zslogin.net/oauth2/v1/token`. No legacy auth path exists for the ZIdentity admin API.

### Pagination — Python

All list endpoints use `offset` + `limit` pagination (not page/page_size). The response envelope contains `results_total`, `page_offset`, `page_size`, `next_link`, `prev_link`, and `records`. Default page size is 100; maximum is 1000.

The `list_*` methods in the Python SDK do not automatically page — they return a single-page result wrapped in a typed object (e.g., `APIClients`, `Groups`, `Users`, `ResourceServers`). Callers iterate `result.records`. Full automatic pagination requires the Go SDK or a caller-managed loop with the `offset` param.

### Pagination — Go

`common.ReadAllPagesWithPagination[T]` in `vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go` iterates pages using `offset`/`limit` and stops when `next_link` is empty or `len(records) < limit`. `ReadAllPagesWithCursor` is an alternative that chases `next_link` directly. Both apply JMESPath filtering via `zscaler.ApplyJMESPathFromContext` after aggregation.

The `PaginationQueryParams` struct provides a fluent builder: `WithNameFilter`, `WithOffset`, `WithLimit`, `WithExcludeDynamicGroups`, `WithLoginName`, `WithLoginNameLike`, `WithDisplayNameLike`, `WithPrimaryEmailLike`, `WithDomainName`, `WithIDPName`.

### Return convention — Python

Every method returns a three-tuple `(result, response, error)`. The raw `response` object supports client-side JMESPath filtering via `resp.search(expression)`.

---

## Service catalog

### `api_client` — `APIClientAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zid/api_client.py`
**Go package:** Not identified as a dedicated package in `vendor/zscaler-sdk-go/zscaler/zid/services/`.

Full CRUD for OAuth2 API clients registered in ZIdentity, plus secret lifecycle management. An API client is the entity that receives `client_id` / `client_secret` credentials for OneAPI access.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_api_clients` | `(query_params=None) -> APIResult[APIClients]` | GET | `/ziam/admin/api/v1/api-clients` |
| `get_api_client` | `(client_id: str) -> APIResult[APIClientRecords]` | GET | `/ziam/admin/api/v1/api-clients/{client_id}` |
| `add_api_client` | `(**kwargs) -> APIResult[APIClientRecords]` | POST | `/ziam/admin/api/v1/api-clients` |
| `update_api_client` | `(client_id: str, **kwargs) -> APIResult[APIClientRecords]` | PUT | `/ziam/admin/api/v1/api-clients/{client_id}` |
| `delete_api_client` | `(client_id: str) -> APIResult` | DELETE | `/ziam/admin/api/v1/api-clients/{client_id}` |
| `get_api_client_secret` | `(client_id: str) -> APIResult[APIClientSecrets]` | GET | `/ziam/admin/api/v1/api-clients/{client_id}/secrets` |
| `add_api_client_secret` | `(client_id: str, **kwargs) -> APIResult[APIClientSecrets]` | POST | `/ziam/admin/api/v1/api-clients/{client_id}/secrets` |
| `delete_api_client_secret` | `(client_id: str, secret_id: str) -> APIResult` | DELETE | `/ziam/admin/api/v1/api-clients/{client_id}/secrets/{secret_id}` |

**Notable behavior:**
- `list_api_clients` query params: `offset`, `limit`, `name[like]`. Returns an `APIClients` wrapper; individual records are in `result.records`.
- `add_api_client` accepts a complex nested structure:
  - `name`, `description`, `status` (bool), `access_token_life_time` (int, seconds).
  - `client_authentication`: `auth_type` (`"SECRET"`, `"PUBKEYCERT"`, `"JWKS"`), `client_jw_ks_url`, `public_keys`, `client_certificates`.
  - `client_resources`: list of resource objects, each with `id`, `name`, `default_api` (bool), `selected_scopes` (list of `{id, name}` scope references).
- `add_api_client_secret` is applicable only when `auth_type` is `"SECRET"`. Accepts `expires_at` (Unix epoch string).
- Secret values are returned only at creation time; `get_api_client_secret` returns metadata, not the secret value.
- `delete_api_client` is permanent and unrecoverable per SDK docstring.

**Go parity:** ❌ No dedicated `api-clients` Go package identified in the service directory. This surface is Python-only in the SDK.

---

### `groups` — `GroupsAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zid/groups.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zid/services/groups/`

Full CRUD for groups, plus group membership management (add/remove/replace users, list group members).

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_groups` | `(query_params=None) -> APIResult[Groups]` | GET | `/ziam/admin/api/v1/groups` |
| `get_group` | `(group_id: int) -> APIResult[GroupRecord]` | GET | `/ziam/admin/api/v1/groups/{group_id}` |
| `add_group` | `(**kwargs) -> APIResult[GroupRecord]` | POST | `/ziam/admin/api/v1/groups` |
| `update_group` | `(group_id: str, **kwargs) -> APIResult[GroupRecord]` | PUT | `/ziam/admin/api/v1/groups/{group_id}` |
| `delete_group` | `(group_id: str) -> APIResult` | DELETE | `/ziam/admin/api/v1/groups/{group_id}` |
| `list_group_users_details` | `(group_id: str, query_params=None) -> APIResult[Groups]` | GET | `/ziam/admin/api/v1/groups/{group_id}/users` |
| `add_user_to_group` | `(group_id: str, user_id: str, **kwargs) -> APIResult[GroupRecord]` | POST | `/ziam/admin/api/v1/groups/{group_id}/users/{user_id}` |
| `add_users_to_group` | `(group_id: str, **kwargs) -> APIResult[GroupRecord]` | POST | `/ziam/admin/api/v1/groups/{group_id}/users` |
| `replace_users_groups` | `(group_id: str, **kwargs) -> APIResult[GroupRecord]` | PUT | `/ziam/admin/api/v1/groups/{group_id}/users` |
| `remove_user_from_group` | `(group_id: str, user_id: str) -> APIResult` | DELETE | `/ziam/admin/api/v1/groups/{group_id}/users/{user_id}` |

**Notable behavior:**
- `list_groups` query params: `offset`, `limit`, `name[like]`, `exclude_dynamic_groups` (bool). Returns a `Groups` wrapper.
- `list_group_users_details` query params: `offset`, `limit`, `login_name`, `login_name[like]`, `display_name[like]`, `primary_email[like]`, `domain_name` (list), `idp_name` (list).
- `add_group` kwargs: `name`, `id`, `source` (`"SCIM"`, `"MANUAL"`, etc.), `is_dynamic_group` (bool), `admin_entitlement_enabled` (bool), `service_entitlement_enabled` (bool), `description`, `idp` (dict).
- `add_users_to_group` and `replace_users_groups` accept `id` as a list of user ID strings. The SDK automatically transforms `["id1", "id2"]` into the required `[{"id": "id1"}, {"id": "id2"}]` format before sending.
- `add_user_to_group` adds one user; `add_users_to_group` adds multiple in one request.
- `replace_users_groups` performs a full replacement of the group's user membership — existing members not in the new list are removed.
- `get_group` accepts `int` in the signature but uses string IDs in practice (consistent with Go string IDs).

**Go parity:** ✅ `groups.Get`, `groups.GetAll`, `groups.GetByName`, create/update/delete, `groups.GetUsers` (member list). Go `GetByName` uses `strings.Contains` partial match and returns `[]Groups`.

---

### `users` — `UsersAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zid/users.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zid/services/users/`

Full CRUD for user directory records, plus per-user group membership lookup.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_users` | `(query_params=None) -> APIResult[Users]` | GET | `/ziam/admin/api/v1/users` |
| `get_user` | `(user_id: str) -> APIResult[UserRecord]` | GET | `/ziam/admin/api/v1/users/{user_id}` |
| `add_user` | `(**kwargs) -> APIResult[UserRecord]` | POST | `/ziam/admin/api/v1/users` |
| `update_user` | `(user_id: str, **kwargs) -> APIResult[UserRecord]` | PUT | `/ziam/admin/api/v1/users/{user_id}` |
| `delete_user` | `(user_id: str) -> APIResult` | DELETE | `/ziam/admin/api/v1/users/{user_id}` |
| `list_user_group_details` | `(user_id: str, query_params=None) -> APIResult[List[UserRecord]]` | GET | `/ziam/admin/api/v1/users/{user_id}/groups` |

**Notable behavior:**
- `list_users` query params: `offset`, `limit`, `login_name`, `login_name[like]`, `display_name[like]`, `primary_email[like]`, `domain_name` (list), `idp_name` (list). Returns a `Users` wrapper.
- `add_user` and `update_user` kwargs: `login_name`, `display_name`, `first_name`, `last_name`, `primary_email`, `secondary_email`, `department` (dict), `status` (bool, `True`=active), `custom_attrs_info` (dict), `id`, `source` (`"UI"`, `"API"`, `"SCIM"`, `"JIT"`), `idp` (dict with `id`).
- `list_user_group_details` returns a list of `UserRecord` objects (not a wrapper) — iterating `response.get_results()` directly.
- Source values represent the creation origin of the user record. SCIM-sourced users may have restrictions on direct modification.

**Go parity:** ✅ `users.Get`, `users.GetAll`, `users.GetByName`, create/update/delete. Go also exposes `users.GetGroupsByUser` (inverse lookup: groups a user belongs to) — Python has `list_user_group_details` at the same endpoint, so parity is functionally equivalent.

---

### `user_entitlement` — `EntitlementAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/`

Read-only retrieval of per-user admin and service entitlements. Entitlements define which product roles (ZIA admin, ZPA admin, ZDX admin, etc.) a user holds.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `get_admin_entitlement` | `(user_id: str) -> APIResult[Entitlements]` | GET | `/ziam/admin/api/v1/users/{user_id}/admin-entitlements` |
| `get_service_entitlement` | `(user_id: str) -> APIResult[Service]` | GET | `/ziam/admin/api/v1/users/{user_id}/service-entitlements` |

**Notable behavior:**
- `get_admin_entitlement` returns an `Entitlements` collection — the roles assigned to the user across all Zscaler products.
- `get_service_entitlement` returns a `Service` object representing the user's service-level entitlements.
- Both are read-only; entitlement assignment is managed through role configuration in the respective product portals or via ZIdentity SCIM provisioning, not through these endpoints.
- No list-all endpoint — these are always per-user lookups.

**Go parity:** ✅ `user_entitlement.GetAdminEntitlement`, `user_entitlement.GetServiceEntitlement`.

---

### `resource_servers` — `ResourceServersAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/`

Introspection of resource server (OAuth2 protected API) registrations. Resource servers define the APIs that API clients can be granted access to, along with available scopes.

| Method | Signature (Python) | HTTP | Endpoint |
|---|---|---|---|
| `list_resource_servers` | `(query_params=None) -> APIResult[ResourceServers]` | GET | `/ziam/admin/api/v1/resource-servers` |
| `get_resource_server` | `(resource_id: str) -> APIResult[ResourceServersRecord]` | GET | `/ziam/admin/api/v1/resource-servers/{resource_id}` |

**Notable behavior (Python):**
- `list_resource_servers` query params: `offset`, `limit`, `name[like]`. Returns a `ResourceServers` wrapper.
- `get_resource_server` returns a `ResourceServersRecord` with fields: `id`, `name`, `display_name`, `description`, `primary_aud`, `default_api`, `service_scopes` (list of service+scope associations).
- The Python SDK exposes **only read operations** for resource servers. No create, update, or delete.

**Go SDK — additional write operations:**

The Go `resource_servers` package exposes full CRUD:

| Go function | HTTP |
|---|---|
| `Get(ctx, service, resourceID)` | GET |
| `GetAll(ctx, service, queryParams)` | GET (paginated) |
| `GetByName(ctx, service, name)` | GET (search) |
| `Create(ctx, service, resource)` | POST |
| `Update(ctx, service, resourceID, resource)` | PUT |
| `Delete(ctx, service, resourceID)` | DELETE |

The `ResourceServers` Go struct includes: `ID`, `Name`, `DisplayName`, `Description`, `PrimaryAud`, `DefaultApi`, `ServiceScopes` (with nested `Service` and `Scopes`).

**Go parity:** ⚠ Go has full CRUD; Python is read-only. Automation that needs to create or modify resource server registrations must use the Go SDK or the direct API.

---

## Per-product nuances

### API client introspection surface

The `api_client` service is notable because it manages the OAuth2 clients that themselves issue the tokens used to call all other Zscaler APIs. A single call to `add_api_client` with appropriate `client_resources` and `selected_scopes` can create a fully-authorized API credential set for ZIA, ZPA, ZCC, ZDX, and ZIdentity simultaneously — the scope identifiers in `selected_scopes` reference the resource+role combinations registered in ZIdentity.

The scope name format used in the SDK example is:
```
zs:config:<product-cloud>:<org-id>:config:<role-id>:<role-name>
```

The `client_resources[].id` field references the resource server ID in ZIdentity; `selected_scopes[].id` uses a double-colon-separated compound key (`resource_id::scope_id` or `resource_id:sub_resource_id:scope_id`).

### Resource server / API client relationship

A resource server defines a protected API and its available scopes. An API client is granted access to one or more resource servers by including the resource server in `client_resources` and selecting specific scopes from that resource server's scope catalog. The `resource_servers` service is the read surface for discovering which resource servers and scopes exist in the tenant.

### `ZIdService` constructor difference

Unlike `ZCCService` and `ZDXService`, which accept a `client` object and pull `client._request_executor` from it, `ZIdService.__init__` accepts a `RequestExecutor` directly. This means `ZIdService` is constructed differently internally. From the caller's perspective the access pattern (`client.zid.*`) is identical, but SDK contributors extending this service should note the constructor signature.

### SCIM-sourced entities

Users and groups with `source="SCIM"` are provisioned by an external identity provider via SCIM. Directly modifying SCIM-sourced users or groups through the ZIdentity SDK may conflict with the SCIM provisioning cycle. The SDK does not enforce any guard against this; conflict resolution behavior depends on the SCIM provisioner configuration.

### Pagination model difference from ZCC/ZIA

ZIdentity uses `offset`/`limit` with `next_link`/`prev_link` cursor links in the response envelope. This differs from ZCC (`page`/`page_size`) and ZIA (`page`/`pageSize` with stop-at-shorter-page). The Python SDK returns single-page results; the `offset` param must be manually incremented to page through large sets. The Go SDK's `ReadAllPagesWithPagination` handles this automatically.

---

## Python / Go parity summary

| Service | Python methods | Go methods | Gap |
|---|---|---|---|
| `api_client` | `list_api_clients`, `get_api_client`, `add_api_client`, `update_api_client`, `delete_api_client`, `get_api_client_secret`, `add_api_client_secret`, `delete_api_client_secret` | None identified | Go SDK missing `api-clients` package |
| `groups` | `list_groups`, `get_group`, `add_group`, `update_group`, `delete_group`, `list_group_users_details`, `add_user_to_group`, `add_users_to_group`, `replace_users_groups`, `remove_user_from_group` | `Get`, `GetAll`, `GetByName`, `Create`, `Update`, `Delete`, `GetUsers` | Go adds `GetUsers`; Python has equivalent via `list_group_users_details` |
| `users` | `list_users`, `get_user`, `add_user`, `update_user`, `delete_user`, `list_user_group_details` | `Get`, `GetAll`, `GetByName`, `Create`, `Update`, `Delete`, `GetGroupsByUser` | Functionally equivalent |
| `user_entitlement` | `get_admin_entitlement`, `get_service_entitlement` | `GetAdminEntitlement`, `GetServiceEntitlement` | ✅ Parity |
| `resource_servers` | `list_resource_servers`, `get_resource_server` | `Get`, `GetAll`, `GetByName`, `Create`, `Update`, `Delete` | Python read-only; Go has full CRUD |

## Model classes

All model classes live under `vendor/zscaler-sdk-python/zscaler/zid/models/`.

| Model file | Classes | Used by |
|---|---|---|
| `models/api_client.py` | `APIClients`, `APIClientRecords`, `APIClientSecrets` | `api_client.py` |
| `models/groups.py` | `Groups`, `GroupRecord` | `groups.py` |
| `models/users.py` | `Users`, `UserRecord` | `users.py` |
| `models/user_entitlement.py` | `Entitlement`, `Entitlements`, `Service` | `user_entitlement.py` |
| `models/resource_servers.py` | `ResourceServers`, `ResourceServersRecord` | `resource_servers.py` |
| `models/common.py` | Shared types | Shared across services |

`APIClients` and `Groups` and `Users` and `ResourceServers` are **envelope wrappers** — they hold `records` (a list of individual items) plus pagination metadata (`results_total`, `page_offset`, `page_size`, `next_link`, `prev_link`). `APIClientRecords`, `GroupRecord`, `UserRecord`, and `ResourceServersRecord` represent **individual items** returned by `get_*` and write operations.

---

## Open questions

1. The Go SDK `api-clients` package does not appear in the `vendor/zscaler-sdk-go/zscaler/zid/services/` directory listing. Whether this is a genuine omission in the Go SDK (Python-only surface) or whether the package exists under a different name (e.g., `apiclient` or integrated into another package) requires verification.

2. `add_api_client_secret` accepts `expires_at` as a string Unix epoch. The API behavior when `expires_at` is omitted or set to a past value is not documented in the SDK source. The acceptable range for `expires_at` is also not stated.

3. `get_group` declares `group_id: int` in its signature but ZIdentity IDs are strings (e.g., `"ihlmch6ikg7m1"`). This type annotation is incorrect and may confuse static analyzers.

4. `list_user_group_details` returns a raw list by iterating `response.get_results()`, while `list_groups` returns a `Groups` wrapper object with a `records` attribute. This inconsistency within the same product's SDK makes iteration patterns non-uniform.

5. `get_admin_entitlement` uses model class `Entitlements` while `get_service_entitlement` uses `Service`. The naming suggests different response shapes but the distinction between admin entitlements and service entitlements is not explained in the SDK source or docstrings.

6. The `resource_servers.get_resource_server` response contains `service_scopes` (a list of service+scope associations). It is not clear from the SDK alone whether all resource servers in a tenant are enumerable via `list_resource_servers` or whether some are Zscaler-internal and filtered from the list.

7. Group `source` values (`"SCIM"`, `"MANUAL"`, etc.) are accepted on write but the full enumeration of valid source values is not documented in the Python SDK. The Go struct uses `omitempty` and does not enumerate them either.
