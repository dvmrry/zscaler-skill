---
product: zidentity
topic: "zidentity-groups"
title: "ZIdentity groups — CRUD, membership, dynamic vs static, policy-principal semantics"
content-type: reference
last-verified: "2026-06-15"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-sdk-go: 4b7101202cde25e1e60552f1cb215d2c70cdc3bd
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/groups.py"
  - "vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go"
  - "vendor/zscaler-sdk-go/tests/unit/ziam/services/groups_test.go"
  - "vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go"
  - "vendor/zscaler-sdk-go/zscaler/ziarequests.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZIdentity groups

ZIdentity groups provide full lifecycle management and membership control for both statically and dynamically defined collections of users. Groups are first-class policy principals: ZIA and ZPA policy rules reference groups by ID. The API exposes full CRUD plus four membership-mutation operations (single/bulk add, bulk replace, single remove) and a member-list read. Both SDKs cover the lifecycle and mutation surface, while the Go SDK's refreshed member-list model and pagination helpers differ from Python's wrapper return.

Base endpoint:
- **Python SDK**: `/ziam/admin/api/v1` (`vendor/zscaler-sdk-python/zscaler/zid/groups.py:31`)
- **Go SDK**: `/ziam/admin/api/v1` (`vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go:16-18`)

## Python SDK methods

Source: `vendor/zscaler-sdk-python/zscaler/zid/groups.py`.

Class `GroupsAPI` in `zscaler/zid/groups.py`. All methods return a 3-tuple `(result, response, error)`.

| Method | Signature | HTTP | Endpoint | Citation |
|---|---|---|---|---|
| `list_groups` | `list_groups(query_params: Optional[dict])` | GET | `/ziam/admin/api/v1/groups` | `groups.py:37` |
| `get_group` | `get_group(group_id: int)` | GET | `/ziam/admin/api/v1/groups/{group_id}` | `groups.py:113` |
| `add_group` | `add_group(**kwargs)` | POST | `/ziam/admin/api/v1/groups` | `groups.py:157` |
| `update_group` | `update_group(group_id: str, **kwargs)` | PUT | `/ziam/admin/api/v1/groups/{group_id}` | `groups.py:221` |
| `delete_group` | `delete_group(group_id: str)` | DELETE | `/ziam/admin/api/v1/groups/{group_id}` | `groups.py:276` |
| `list_group_users_details` | `list_group_users_details(group_id: str, query_params)` | GET | `/ziam/admin/api/v1/groups/{group_id}/users` | `groups.py:312` |
| `add_user_to_group` | `add_user_to_group(group_id: str, user_id: str, **kwargs)` | POST | `/ziam/admin/api/v1/groups/{group_id}/users/{user_id}` | `groups.py:384` |
| `add_users_to_group` | `add_users_to_group(group_id: str, **kwargs)` | POST | `/ziam/admin/api/v1/groups/{group_id}/users` | `groups.py:440` |
| `replace_users_groups` | `replace_users_groups(group_id: str, **kwargs)` | PUT | `/ziam/admin/api/v1/groups/{group_id}/users` | `groups.py:505` |
| `remove_user_from_group` | `remove_user_from_group(group_id: str, user_id: str)` | DELETE | `/ziam/admin/api/v1/groups/{group_id}/users/{user_id}` | `groups.py:571` |

## Go SDK functions

Source: `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`.

Package `groups` in `zscaler/ziam/services/groups/groups.go`. All functions are package-level with `ctx context.Context, service *zscaler.Service` as first two parameters.

| Function | Returns | HTTP | Endpoint | Citation |
|---|---|---|---|---|
| `Get(ctx, service, groupID string)` | `(*Groups, error)` | GET | `/ziam/admin/api/v1/groups/{groupID}` | `groups.go:66-75` |
| `GetAll(ctx, service, queryParams *PaginationQueryParams)` | `([]Groups, error)` | GET | `/ziam/admin/api/v1/groups` | `groups.go:77-80` |
| `GetByName(ctx, service, name string)` | `([]Groups, error)` | GET | `/ziam/admin/api/v1/groups` (client-side substring) | `groups.go:82-116` |
| `GetUsers(ctx, service, groupID string, queryParams)` | `([]GroupUser, error)` | GET | `/ziam/admin/api/v1/groups/{groupID}/users` (all pages) | `groups.go:118-122` |
| `GetUsersPage(ctx, service, groupID string, queryParams)` | `(*GroupUsersResponse, error)` | GET | `/ziam/admin/api/v1/groups/{groupID}/users` (single page) | `groups.go:124-129` |
| `Create(ctx, service, groups *Groups)` | `(*Groups, *http.Response, error)` | POST | `/ziam/admin/api/v1/groups` | `groups.go:131-144` |
| `Update(ctx, service, groupID int, groups *Groups)` | `(*Groups, *http.Response, error)` | PUT | `/ziam/admin/api/v1/groups/{groupID}` | `groups.go:146-155` |
| `Delete(ctx, service, groupID string)` | `(*http.Response, error)` | DELETE | `/ziam/admin/api/v1/groups/{groupID}` | `groups.go:157-164` |
| `AddUserListToGroup(ctx, service, groupID string, userIDs []string)` | `(*Groups, *http.Response, error)` | POST | `/ziam/admin/api/v1/groups/{groupID}/users` | `groups.go:166-187` |
| `ReplaceUserListInGroup(ctx, service, groupID string, userIDs []string)` | `(*Groups, *http.Response, error)` | PUT | `/ziam/admin/api/v1/groups/{groupID}/users` | `groups.go:189-209` |
| `AddUserToGroup(ctx, service, groupID, userID string)` | `(*http.Response, error)` | POST | `/ziam/admin/api/v1/groups/{groupID}/users/{userID}` | `groups.go:211-221` |
| `DeleteUserFromGroup(ctx, service, groupID, userID string)` | `(*http.Response, error)` | DELETE | `/ziam/admin/api/v1/groups/{groupID}/users/{userID}` | `groups.go:223-230` |

## Postman collection endpoints

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

Variable `{{ZIAMBaseUrl}}` resolves to the ZIdentity ZIAM base URL. (`vendor/zscaler-api-specs/oneapi-postman-collection.json`)

| Method | Path |
|---|---|
| GET | `{{ZIAMBaseUrl}}/groups?offset=...&limit=...&name[like]=...&excludedynamicgroups=...` |
| GET | `{{ZIAMBaseUrl}}/groups/:id` |
| POST | `{{ZIAMBaseUrl}}/groups` |
| PUT | `{{ZIAMBaseUrl}}/groups/:id` |
| DELETE | `{{ZIAMBaseUrl}}/groups/:id` |
| GET | `{{ZIAMBaseUrl}}/groups/:id/users` |
| POST | `{{ZIAMBaseUrl}}/groups/:id/users` |
| PUT | `{{ZIAMBaseUrl}}/groups/:id/users` |
| POST | `{{ZIAMBaseUrl}}/groups/:id/users/:userId` |
| DELETE | `{{ZIAMBaseUrl}}/groups/:id/users/:userId` |

## Group model fields

Source: `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`; `vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go`.

Python model: `GroupRecord` in `zscaler/zid/models/groups.py`. Go struct: `Groups` in `zscaler/ziam/services/groups/groups.go`.

| Python attr | Go field | Wire key | Type | Notes | Citation |
|---|---|---|---|---|---|
| `name` | `Name` | `name` | string | | `models/groups.py:84`, `groups.go:22` |
| `description` | `Description` | `description` | string | | `models/groups.py:85`, `groups.go:23` |
| `id` | `ID` | `id` | string | Auto-generated; immutable post-create | `models/groups.py:86`, `groups.go:24` |
| `source` | `Source` | `source` | string | Values include `SCIM`, `MANUAL` | `models/groups.py:87`, `groups.go:25` |
| `is_dynamic_group` | `IsDynamicGroup` | `isDynamicGroup` | boolean | See dynamic vs static section | `models/groups.py:88`, `groups.go:26` |
| `dynamic_group` | `DynamicGroup` | `dynamicGroup` | boolean | Semantically duplicate of `isDynamicGroup`; both fields present in wire format | `models/groups.py:89`, `groups.go:27` |
| `admin_entitlement_enabled` | `AdminEntitlementEnabled` | `adminEntitlementEnabled` | boolean | | `models/groups.py:90`, `groups.go:28` |
| `service_entitlement_enabled` | `ServiceEntitlementEnabled` | `serviceEntitlementEnabled` | boolean | | `models/groups.py:91`, `groups.go:29` |
| `idp` | `IDP` | `idp` | nested `IDNameDisplayName` | Populated for IdP-sourced (e.g. SCIM) groups | `models/groups.py:104`, `groups.go:30` |
| `custom_attrs_info` | — | `customAttrsInfo` | dict | Python only; assigned from the raw config dict | `models/groups.py:94` |

`IDNameDisplayName` nested struct (Go) has fields `ID string`, `Name string`, `DisplayName string`. (`vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go:14-18`)

### User-attribute fields on `GroupRecord` (Python only)

When a group-members response includes user data, the following fields are also populated on `GroupRecord`. These are absent from the Go `Groups` struct.

| Python attr | Wire key | Type | Citation |
|---|---|---|---|
| `login_name` | `loginName` | string | `models/groups.py:96` |
| `display_name` | `displayName` | string | `models/groups.py:97` |
| `first_name` | `firstName` | string | `models/groups.py:98` |
| `last_name` | `lastName` | string | `models/groups.py:99` |
| `primary_email` | `primaryEmail` | string | `models/groups.py:100` |
| `secondary_email` | `secondaryEmail` | string | `models/groups.py:101` |
| `status` | `status` | string | `models/groups.py:102` |
| `department` | `department` | nested `IDNameDisplayName` | `models/groups.py:115` |

### Pagination envelope

`list_groups` returns a `Groups` wrapper object (Python) or the Go `GetAll` returns a flat `[]Groups` slice. The Python wrapper carries:

| Python attr | Wire key | Go equivalent | Citation |
|---|---|---|---|
| `results_total` | `results_total` | `PaginationResponse.ResultsTotal` | `models/groups.py:38`, `common.go:23` |
| `page_offset` | `pageOffset` | `PaginationResponse.PageOffset` | `models/groups.py:39`, `common.go:24` |
| `page_size` | `pageSize` | `PaginationResponse.PageSize` | `models/groups.py:40`, `common.go:25` |
| `next_link` | `next_link` | `PaginationResponse.NextLink` | `models/groups.py:41`, `common.go:26` |
| `prev_link` | `prev_link` | `PaginationResponse.PrevLink` | `models/groups.py:42`, `common.go:27` |
| `records` | `records` | `PaginationResponse.Records` | `models/groups.py:43`, `common.go:28` |

## Filter / query parameters

Source: `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`.

### `list_groups` / `GetAll`

`PaginationQueryParams` struct at `vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go:31-44`.

| Wire param | Python kwarg | Go field | Type | Notes | Citation |
|---|---|---|---|---|---|
| `offset` | `offset` | `Offset` | int | Starting record position | `groups.py:49`, `common.go:33` |
| `limit` | `limit` | `Limit` | int | Max records per page; maximum 1000 | `groups.py:51`, `common.go:34` |
| `name[like]` | `name[like]` | `NameLike` | string | Case-insensitive substring match on group name | `groups.py:52`, `common.go:35` |
| `excludedynamicgroups` | `exclude_dynamic_groups` | `ExcludeDynamicGroups` | bool | Omit dynamic groups from response | `groups.py:53`, `common.go:36` |

Pagination terminates when `next_link` is empty or `len(records) < limit`. (`common.go:180`)

**JMESPath client-side filtering**: The Python response object supports `resp.search(expression)`. The Go `GetAll` / `GetByName` functions apply JMESPath from context automatically via `ApplyJMESPathFromContext`. (`common.go:188`)

### `list_group_users_details` / `GetUsers`

Accepts the same user-filter parameters as the users endpoint. (`groups.py:317`)

| Wire param | Go field | Type | Citation |
|---|---|---|---|
| `offset` | `Offset` | int | `common.go:33` |
| `limit` | `Limit` | int | `common.go:34` |
| `loginname` | `LoginName` | `[]string` | `common.go:38` |
| `loginname[like]` | `LoginNameLike` | string | `common.go:39` |
| `displayname[like]` | `DisplayNameLike` | string | `common.go:40` |
| `primaryemail[like]` | `PrimaryEmailLike` | string | `common.go:41` |
| `domainname` | `DomainName` | `[]string` | `common.go:42` |
| `idpname` | `IDPName` | `[]string` | `common.go:43` |

## CRUD notes

Source: `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`.

Full CRUD is supported. No activation step is required — changes take effect immediately.

**Create**: `add_group` / `Create` — POST to the collection endpoint. `id` is auto-generated by the server. (`groups.py:157`, `groups.go:131-144`)

**Update**: `update_group` / `Update` — full PUT replacement. See SDK divergences for the `groupID` type mismatch on the Go side. (`groups.py:221`, `groups.go:146-155`)

**Delete**: `delete_group` / `Delete` — returns no body on success. Cascade behavior when group has members is undocumented. (`groups.py:276`, `groups.go:157-164`)

## Membership management

Source: `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`.

Five distinct operations cover single-user and bulk-user membership — **four mutations plus one member-list read**:

| Operation | Python | Go | HTTP | Citation |
|---|---|---|---|---|
| Single add | `add_user_to_group(group_id, user_id)` | `AddUserToGroup(ctx, svc, groupID, userID)` | POST `/groups/{id}/users/{uid}` | `groups.py:384`, `groups.go:211-221` |
| Bulk add | `add_users_to_group(group_id, id=[...])` | `AddUserListToGroup(ctx, svc, groupID, []string)` | POST `/groups/{id}/users` | `groups.py:440`, `groups.go:166-187` |
| Bulk replace (PUT semantics) | `replace_users_groups(group_id, id=[...])` | `ReplaceUserListInGroup(ctx, svc, groupID, []string)` | PUT `/groups/{id}/users` | `groups.py:505`, `groups.go:189-209` |
| Single remove | `remove_user_from_group(group_id, user_id)` | `DeleteUserFromGroup(ctx, svc, groupID, userID)` | DELETE `/groups/{id}/users/{uid}` | `groups.py:571`, `groups.go:223-230` |
| Read members | `list_group_users_details(group_id)` | `GetUsers(ctx, svc, groupID, queryParams)` | GET `/groups/{id}/users` | `groups.py:312`, `groups.go:118-122` |

### Bulk-add payload transformation

Both SDKs transform a flat list of IDs into the `[{"id": "..."}]` array format required by the wire protocol.

**Python** (`add_users_to_group` and `replace_users_groups`): When `id` kwarg is a list, the function iterates and wraps each element as `{"id": user_id}`. (`groups.py:478-482`)

**Go** (`AddUserListToGroup` and `ReplaceUserListInGroup`): Accepts `[]string` and builds `[]UserID` internally before posting. (`groups.go:166-170`, `groups.go:189-193`)

## Static vs dynamic groups

Source: `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`.

Groups carry two boolean flags that together determine dynamic vs static classification. (`models/groups.py:88-89`, `groups.go:26-27`)

| Group type | `is_dynamic_group` / `isDynamicGroup` | `dynamic_group` / `dynamicGroup` |
|---|---|---|
| Static | `false` | `false` |
| Dynamic | `true` | `true` |

The current Go unit tests exercise matching values rather than only one flag: the marshal fixture sets both `IsDynamicGroup` and `DynamicGroup` to `false`, while the unmarshal fixture sets and asserts both to `true` (`vendor/zscaler-sdk-go/tests/unit/ziam/services/groups_test.go:21-35,47-75`; response fixtures also cover matching false/true pairs at `vendor/zscaler-sdk-go/tests/unit/ziam/services/groups_test.go:109-163`). They do not test disagreement, so the semantics of setting the two flags to differing values are not documented in the SDK.

**Dynamic group criteria**: The SDK does not expose the conditions/rules that drive dynamic group membership. Criteria are managed through the admin UI or a separate interface; they are not readable or writable via either SDK. (`models/groups.py:88-89`, `groups.go:26-27`)

## Groups as policy principals

Source: `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`.

ZIdentity groups are referenced by ID in ZIA and ZPA policy rules.

1. Group IDs are immutable (auto-generated at creation). Policy rules that reference a group by ID are unaffected by group renames. (`models/groups.py:86`, `groups.go:24`)
2. Membership changes take effect immediately — no activation step. Changes propagate to policy evaluation without a publish cycle.
3. No nested or parent-child group structure is exposed in the SDK.
4. Groups are tenant-wide with no product-level or region-level scoping visible in the SDK.
5. `admin_entitlement_enabled` and `service_entitlement_enabled` flags control entitlement grants separately from policy membership. (`models/groups.py:90-91`, `groups.go:28-29`) — see [`admin-rbac.md`](./admin-rbac.md)

## SDK divergences

Source: `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`; `vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go`.

| Aspect | Python | Go | Impact |
|---|---|---|---|
| `Update` group ID type | `str` (`groups.py:221`) | `int` (`groups.go:146-155`) | Type mismatch with struct `ID string`; appears to be a Go SDK bug — the URL format call uses `%d` on an int while `Get` and `Delete` accept `string` |
| Member list response type | `Groups` wrapper with pagination metadata | `[]GroupUser` from all-page `GetUsers`; `GetUsersPage` preserves `PaginationResponse[GroupUser]` (`groups.go:118-129`) | Go is now typed and has a metadata-preserving page variant; `GetUsers` still consumes metadata while aggregating |
| `GetByName` | Not exposed | Client-side substring match on all pages (`groups.go:82-116`) | Go convenience function; expensive for large tenants |
| Single `AddUserToGroup` POST body | `kwargs` dict (typically empty) | Empty `struct{}{}` (`groups.go:211-220`) | Endpoint takes no body. NOT functionally equivalent on the return value: Python parses the response into a `GroupRecord` (`groups.py:430-438`); Go discards it — see `AddUserToGroup` return-value bug below |
| `list_groups` vs `GetAll` return | `(Groups envelope, response, error)` | `([]Groups, error)` — metadata consumed internally | Python exposes pagination links; Go hides them |

## Known bugs and edge cases

Source: `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`.

1. **Go `Update` `groupID int` vs struct `ID string`**: The `Update` function signature accepts `groupID int` and formats the URL with `%d`, while `Get`, `Delete`, `AddUserListToGroup`, and `ReplaceUserListInGroup` all accept `groupID string`. The struct's `ID` field is also `string`. This inconsistency means callers must convert types when passing the same group ID to `Update` vs other functions. (`groups.go:146-155` vs `groups.go:66-75`, `groups.go:157-164`)

2. **Python `list_group_users_details` return-type docstring**: The docstring at line 335 claims the return is "list of Groups instances" but the actual response is user records, not group records. (`groups.py:335`)

3. **Dynamic group membership mutation**: The SDK allows `add_user_to_group` on groups where `is_dynamic_group: true`. Server-side rejection behavior in this case is undocumented. (`groups.py:384`, `groups.go:211-215`)

4. **`custom_attrs_info` assignment in Python**: `GroupRecord` assigns `self.custom_attrs_info = config if isinstance(config, dict) else {}` — this assigns the entire raw config dict, not a filtered custom-attributes sub-key. (`models/groups.py:94`)

5. **Dual `isDynamicGroup` + `dynamicGroup` flags**: The wire protocol carries both. Their intended distinction and the behavior when they disagree is not documented in the SDK. (`models/groups.py:88-89`, `groups.go:26-27`)

6. **Go `AddUserToGroup` returns an effectively-nil `*http.Response`**: The function posts an empty `struct{}{}` via `service.Client.Create` and then does `httpResp, _ := resp.(*http.Response)` (`groups.go:211-220`). But `Client.Create` does not return an `*http.Response` when the server replies with a JSON body — it unmarshals the body into a `reflect.New` of the *payload* type and returns that (`ziarequests.go:44-52`), i.e. a `*struct{}` here, not an `*http.Response`. The type assertion therefore fails and is swallowed by the `_`, so the returned `*http.Response` is `nil` whenever the server returns a JSON body. `Create` returns a real `*http.Response` only when the body is empty or non-JSON (`ziarequests.go:53-58`). Either way the assertion result is discarded silently. Callers cannot rely on the returned `*http.Response` for status or headers. Contrast Python's `add_user_to_group`, which parses the response into a `GroupRecord` (`groups.py:430-438`). (`groups.go:211-220`, `ziarequests.go:18-58`)

7. **Go `Update` can still panic on an empty successful response**: after `UpdateWithPut`, the function asserts the response but does not check whether `updatedGroup` is nil before dereferencing `updatedGroup.ID` (`groups.go:146-154`). A tenant returning `204 No Content` can therefore turn a successful update into a process panic; re-read the group after a no-body response is not possible through this function.

8. **Go `Create` logs a string with an integer format verb**: the created group ID is a string, but the debug log uses `%d` (`groups.go:142`). This does not alter the request or returned model, but produces a malformed diagnostic message.

## Gaps

Source: `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

The following capabilities are absent from both SDKs:

1. **Dynamic group criteria** — rule conditions driving dynamic membership are not readable or writable via SDK
2. **Nested/recursive groups** — no parent-child group structure in SDK
3. **Group member count without enumeration** — no count-only endpoint
4. **Bulk get-by-IDs** — no batch group-retrieval by a list of IDs
5. **Member audit history** — no who/when membership-change tracking
6. **Group ownership / delegated admin** — only tenant-wide RBAC; no per-group owner concept
7. **Cleanup on user delete** — whether deleted users are automatically removed from groups is undocumented
8. **Bulk operation size limit** — no documented cap on the list accepted by `add_users_to_group` / `ReplaceUserListInGroup`
9. **User deduplication in bulk add** — behavior when the same user ID appears twice in the list is undocumented

## Open questions

Source: `vendor/zscaler-sdk-python/zscaler/zid/groups.py`; `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go`.

- **Dual-flag semantics (`isDynamicGroup` vs `dynamicGroup`)** — what the server does when the two flags disagree is undocumented; the current Go fixtures exercise matching false/true pairs but do not cover disagreement — *unverified, requires API spec review or lab test* — see [clarification `zid-17`](../_meta/clarifications.md#zid-17-group-dual-flag-semantics-isdynamicgroup-vs-dynamicgroup)
- **Dynamic group membership mutation server behavior** — whether `add_user_to_group` on a dynamic group is rejected server-side or silently succeeds is unknown — *unverified, requires lab test* — see [clarification `zid-18`](../_meta/clarifications.md#zid-18-dynamic-group-membership-mutation-behavior)
- **User deduplication in bulk add** — whether duplicate user IDs in `add_users_to_group` result in rejection, deduplication, or silent ignore is unknown — *unverified, requires lab test* — see [clarification `zid-19`](../_meta/clarifications.md#zid-19-user-deduplication-in-bulk-add)
- **IdP-sourced group (`source: SCIM`) mutation semantics** — whether SDK CRUD operations on SCIM-provisioned groups are rejected by the server is undocumented — *unverified, requires lab test or vendor documentation* — see [clarification `zid-20`](../_meta/clarifications.md#zid-20-scim-sourced-group-mutation-semantics)

## Cross-links

- [`users.md`](./users.md) — user-side group association (`list_user_group_details` / `GetGroupsByUser`)
- [`admin-rbac.md`](./admin-rbac.md) — `admin_entitlement_enabled` / `service_entitlement_enabled` entitlement flags
- [`api-clients.md`](./api-clients.md) — OAuth 2.0 API client setup required to call these endpoints
- [`overview.md`](./overview.md) — federation context for IdP-sourced vs internal groups
