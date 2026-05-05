---
product: zidentity
topic: "zidentity-users"
title: "ZIdentity users — CRUD, fields, filters, IdP-sourced vs internal"
content-type: reference
last-verified: "2026-05-05"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/users.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/users.py"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZIdentity users

The ZIdentity Users API manages user lifecycle, group membership, and entitlements for both IdP-sourced (SAML/SCIM) and ZIdentity-internal users. The API exposes full CRUD, user search with multiple filter parameters, pagination, user-to-group associations, and quick access to admin/service entitlements.

Base endpoint:
- **Python SDK**: `/ziam/admin/api/v1` (`vendor/zscaler-sdk-python/zscaler/zid/users.py:31`)
- **Go SDK**: `/admin/api/v1` (`vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go:16`)

## Python SDK methods

Class `UsersAPI` in `zscaler/zid/users.py`. All methods return a 3-tuple `(result, response, error)`.

| Method | Signature | Returns | HTTP method | Endpoint | Citation |
|---|---|---|---|---|---|
| `list_users` | `list_users(query_params: Optional[dict])` | `(Users, response, error)` | GET | `/ziam/admin/api/v1/users` | `users.py:37` |
| `get_user` | `get_user(user_id: str)` | `(UserRecord, response, error)` | GET | `/ziam/admin/api/v1/users/{user_id}` | `users.py:122` |
| `add_user` | `add_user(**kwargs)` | `(UserRecord, response, error)` | POST | `/ziam/admin/api/v1/users` | `users.py:166` |
| `update_user` | `update_user(user_id, **kwargs)` | `(UserRecord, response, error)` | PUT | `/ziam/admin/api/v1/users/{user_id}` | `users.py:239` |
| `delete_user` | `delete_user(user_id)` | `(None, response, error)` | DELETE | `/ziam/admin/api/v1/users/{user_id}` | `users.py:297` |
| `list_user_group_details` | `list_user_group_details(user_id, query_params)` | `(List[UserRecord], response, error)` | GET | `/ziam/admin/api/v1/users/{user_id}/groups` | `users.py:333` |

## Go SDK functions

Package `users` in `zscaler/zid/services/users/users.go`. All functions are package-level with `ctx context.Context, service *zscaler.Service` as first two parameters.

| Function | Returns | HTTP method | Endpoint | Citation |
|---|---|---|---|---|
| `GetUser(ctx, service, userID string)` | `(*Users, error)` | GET | `/admin/api/v1/users/{userID}` | `users.go:36` |
| `GetAll(ctx, service, queryParams)` | `([]Users, error)` | GET | `/admin/api/v1/users` | `users.go:47` |
| `GetByName(ctx, service, name string)` | `([]Users, error)` | GET | `/admin/api/v1/users` (paginated, client-side filter) | `users.go:53` |
| `Create(ctx, service, user *Users)` | `(*Users, *http.Response, error)` | POST | `/admin/api/v1/users` | `users.go:94` |
| `Update(ctx, service, userID, user *Users)` | `(*Users, *http.Response, error)` | PUT | `/admin/api/v1/users/{userID}` | `users.go:109` |
| `Delete(ctx, service, userID)` | `(*http.Response, error)` | DELETE | `/admin/api/v1/users/{userID}` | `users.go:120` |
| `GetGroupsByUser(ctx, service, userID, queryParams)` | `(*PaginationResponse[Groups], error)` | GET | `/admin/api/v1/users/{userID}/groups` | `users.go:129` |

## Postman collection endpoints

Variable `{{ZIAMBase}}` resolves to the ZIdentity ZIAM base URL. (`vendor/zscaler-api-specs/oneapi-postman-collection.json`)

| Method | Path | Notes |
|---|---|---|
| GET | `{{ZIAMBase}}/users?offset=...&limit=...&[filters]` | List with pagination / filters |
| GET | `{{ZIAMBase}}/users/:id` | Get single user |
| POST | `{{ZIAMBase}}/users` | Create user |
| PUT | `{{ZIAMBase}}/users/:id` | Update user |
| DELETE | `{{ZIAMBase}}/users/:id` | Delete user |
| GET | `{{ZIAMBase}}/users/:id/groups` | Get groups for user |
| GET | `{{ZIAMBase}}/users/:id/admin-entitlements` | Admin entitlements — see [`admin-rbac.md`](./admin-rbac.md) |
| GET | `{{ZIAMBase}}/users/:id/service-entitlements` | Service entitlements — see [`admin-rbac.md`](./admin-rbac.md) |
| POST | `{{ZIAMBase}}/users/:id:resetpassword` | Reset password — **NOT in SDK** |
| POST | `{{ZIAMBase}}/users/:id:setskipmfa` | Set skip MFA — **NOT in SDK** |
| PUT | `{{ZIAMBase}}/users/:id:updatepassword` | Update password — **NOT in SDK** |
| POST | `{{ZIAMBase}}/users/bulkDelete` | Bulk delete — **NOT in SDK** |

## User model fields

Python model: `UserRecord` in `zscaler/zid/models/users.py`. Go struct: `Users` in `zscaler/zid/services/users/users.go`.

| Python attr | Go field | Wire key (JSON) | Type | Notes | Citation |
|---|---|---|---|---|---|
| `id` | `ID` | `id` | string | Auto-generated on create | `models/users.py:91`, `users.go:20` |
| `source` | `Source` | `source` | string | Values: `UI`, `API`, `SCIM`, `JIT` | `models/users.py:92`, `users.go:21` |
| `login_name` | `LoginName` | `loginName` | string | | `models/users.py:84`, `users.go:22` |
| `display_name` | `DisplayName` | `displayName` | string | | `models/users.py:85`, `users.go:23` |
| `first_name` | `FirstName` | `firstName` | string | | `models/users.py:86`, `users.go:24` |
| `last_name` | `LastName` | `lastName` | string | | `models/users.py:87`, `users.go:25` |
| `primary_email` | `PrimaryEmail` | `primaryEmail` | string | | `models/users.py:88`, `users.go:26` |
| `secondary_email` | `SecondaryEmail` | `secondaryEmail` | string | | `models/users.py:89`, `users.go:27` |
| `status` | `Status` | `status` | boolean | `true` = active, `false` = disabled | `models/users.py:90`, `users.go:28` |
| `department` | `Department` | `department` | nested struct (`IDNameDisplayName`) | | `models/users.py:112`, `users.go:29` |
| `idp` | `IDP` | `idp` | nested struct (`IDNameDisplayName`) | Populated for IdP-sourced users | `models/users.py:101`, `users.go:30` |
| `custom_attrs_info` | `CustomAttrsInfo` | `customAttrsInfo` | dict / `map[string]interface{}` | Free-form key-value pairs | `models/users.py:99`, `users.go:31` |
| `is_dynamic_group` | — | `isDynamicGroup` | boolean | Python only | `models/users.py:93` |
| `dynamic_group` | — | `dynamicGroup` | object | Python only | `models/users.py:94` |
| `admin_entitlement_enabled` | — | `adminEntitlementEnabled` | boolean | Python only | `models/users.py:95` |
| `service_entitlement_enabled` | — | `serviceEntitlementEnabled` | boolean | Python only | `models/users.py:96` |

The `IDNameDisplayName` nested struct (Go) has fields `ID string`, `Name string`, `DisplayName string`. (`vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:14`)

### Pagination envelope

The Python `Users` wrapper object (returned by `list_users`) carries pagination metadata:

| Python attr | Wire key | Go field | Citation |
|---|---|---|---|
| `results_total` | `results_total` | `ResultsTotal` | `models/users.py:38`, `common.go:23` |
| `page_offset` | `pageOffset` | `PageOffset` | `models/users.py:39`, `common.go:24` |
| `page_size` | `pageSize` | `PageSize` | `models/users.py:40`, `common.go:25` |
| `next_link` | `next_link` | `NextLink` | `models/users.py:41`, `common.go:26` |
| `prev_link` | `prev_link` | `PrevLink` | `models/users.py:42`, `common.go:27` |
| `records` | `records` | `Records` | `models/users.py:43`, `common.go:28` |

## Filter / query parameters

`PaginationQueryParams` struct in `vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:32`. Python docstring at `users.py:47`.

| Wire param | Go field | Type | Purpose | Citation |
|---|---|---|---|---|
| `offset` | `Offset` | int | Starting record position for pagination | `users.py:47`, `common.go:33` |
| `limit` | `Limit` | int | Max records per page (0–1000) | `users.py:51`, `common.go:34` |
| `loginname` | `LoginName` | `[]string` | Exact match on one or more login names | `users.py:49`, `common.go:38` |
| `loginname[like]` | `LoginNameLike` | string | Case-insensitive partial match on login name | `users.py:53`, `common.go:39` |
| `displayname[like]` | `DisplayNameLike` | string | Case-insensitive partial match on display name | `users.py:55`, `common.go:40` |
| `primaryemail[like]` | `PrimaryEmailLike` | string | Case-insensitive partial match on primary email | `users.py:57`, `common.go:41` |
| `domainname` | `DomainName` | `[]string` | Exact match by email domain | `users.py:59`, `common.go:42` |
| `idpname` | `IDPName` | `[]string` | Filter by identity provider name | `users.py:61`, `common.go:43` |

**Pagination termination**: results end when `next_link` is empty or `len(records) < limit`. (`common.go:180`)

**JMESPath client-side filtering**: The Python response object supports `resp.search(expression)` for client-side filtering and projection. (`users.py:87`) The Go `GetAll` / `GetByName` functions apply JMESPath from context automatically via `ApplyJMESPathFromContext`. (`common.go:188`)

## CRUD notes

Full CRUD is supported. No activation step required — changes take effect immediately. (`vendor/zscaler-sdk-go/CLAUDE.md` — ZID cloud section)

**Creating a user**: `add_user` accepts `id` as a kwarg but the docstring example shows it as caller-supplied. It is not documented whether omitting `id` triggers server-side auto-generation. (`users.py:186`)

**Deleting a user**: `delete_user` / `Delete` return `(None, response, None)` / `(*http.Response, nil)` on success — no body. (`users.py:297`, `users.go:120`)

**Activating / deactivating**: Toggle the `status` boolean field via `update_user` / `Update`. There is no separate workflow endpoint. (`models/users.py:90`)

## IdP-sourced vs ZIdentity-internal users

Both types appear in the same list endpoint. Distinguish by the `source` field: (`models/users.py:92`, `users.go:21`)

| User type | `source` values | `idp` field |
|---|---|---|
| SCIM-provisioned (IdP-sourced) | `SCIM` | Populated |
| JIT-provisioned (IdP-sourced) | `JIT` | Populated |
| Created via API | `API` | May be null |
| Created via UI | `UI` | May be null |

Filter to IdP-sourced users using the `idpname` query parameter. (`users.py:61`)

## SDK divergences

| Aspect | Python | Go |
|---|---|---|
| List return type | `(Users envelope, response, error)` — pagination metadata in wrapper object | `([]Users, error)` — Go flattens to slice; metadata consumed internally |
| Get return type | `(UserRecord, response, error)` | `(*Users, error)` — Go pointer, no raw response |
| GetByName | Not exposed | `GetByName(name)` — fetches all pages, `strings.Contains` on `DisplayName`; expensive for large tenants (`users.go:53`) |
| Group association | `list_user_group_details()` returns `List[UserRecord]` | `GetGroupsByUser()` returns `*PaginationResponse[Groups]` — different return shapes |
| Error tuple | 3-tuple `(result, response, error)` | Standard Go `(result, error)` or `(result, *http.Response, error)` |

## Known bugs and edge cases

**Go — variable-shadowing bug in `GetUsers`**: The local declaration `usersEndpoint := fmt.Sprintf(...)` on line 90 shadows the package-level `usersEndpoint` constant, making the function build the wrong path (`/admin/api/v1/users/{userID}/users`). This function is not listed in the primary CRUD surface and appears vestigial — `GetGroupsByUser` is the correct group-association function. (`users.go:88`)

**Go — `GetByName` cost**: `GetByName` fetches all pages client-side and filters with `strings.Contains` on `DisplayName`. For large tenants this is expensive. Prefer server-side `displayname[like]` via `GetAll` with query params. (`users.go:53`)

**Python — `list_user_group_details` return type**: Despite the function name suggesting groups, the function returns `List[UserRecord]` (not group objects). (`users.py:333`)

## Gaps

The following capabilities appear in the Postman collection but are absent from both SDKs:

1. **Password reset** — `POST /users/:id:resetpassword` — Postman only; commented-out stub exists in Go SDK (`users.go:134`)
2. **Set skip MFA** — `POST /users/:id:setskipmfa` — Postman only; commented-out stub in Go SDK (`users.go:143`)
3. **Update password** — `PUT /users/:id:updatepassword` — Postman only
4. **Bulk delete** — `POST /users/bulkDelete` — Postman only
5. **Group mutation via users API** — group association is read-only here; mutations go through the groups API (see [`groups.md`](./groups.md))
6. **Provisioning source change** — `source` field is readable but not documented as changeable post-creation
7. **Custom attributes validation** — `customAttrsInfo` accepted as free-form dict/map; backend constraints unknown

Admin/service entitlements endpoints (`/users/:id/admin-entitlements`, `/users/:id/service-entitlements`) are covered in [`admin-rbac.md`](./admin-rbac.md) and are not duplicated here.

## Open questions

- **Omitting `id` on create** — `add_user` docstring example passes `id` explicitly; it is unverified whether omitting `id` triggers server-side auto-generation or returns an error — *unverified, requires lab test or API spec review*

## Cross-links

- [`admin-rbac.md`](./admin-rbac.md) — admin-entitlements and service-entitlements endpoints
- [`groups.md`](./groups.md) — group CRUD and group-member mutation (Task 9)
- [`api-clients.md`](./api-clients.md) — OAuth 2.0 API client setup required to call these endpoints
- [`overview.md`](./overview.md) — federation context for IdP-sourced vs internal users
