---
product: zidentity
topic: "zidentity-groups"
title: "ZIdentity groups — CRUD, membership, dynamic vs static, policy-principal semantics"
content-type: reference
last-verified: "2026-05-05"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/groups.py"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZIdentity groups

ZIdentity groups provide full lifecycle management and membership control for both statically and dynamically defined collections of users. Groups are first-class policy principals: ZIA and ZPA policy rules reference groups by ID. The API exposes full CRUD plus six distinct membership-mutation operations. Both SDKs cover the same surface symmetrically.

Base endpoint:
- **Python SDK**: `/ziam/admin/api/v1` (`vendor/zscaler-sdk-python/zscaler/zid/groups.py:31`)
- **Go SDK**: `/admin/api/v1` (`vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go:17`)

## Python SDK methods

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

Package `groups` in `zscaler/zid/services/groups/groups.go`. All functions are package-level with `ctx context.Context, service *zscaler.Service` as first two parameters.

| Function | Returns | HTTP | Endpoint | Citation |
|---|---|---|---|---|
| `Get(ctx, service, groupID string)` | `(*Groups, error)` | GET | `/admin/api/v1/groups/{groupID}` | `groups.go:39` |
| `GetAll(ctx, service, queryParams *PaginationQueryParams)` | `([]Groups, error)` | GET | `/admin/api/v1/groups` | `groups.go:51` |
| `GetByName(ctx, service, name string)` | `([]Groups, error)` | GET | `/admin/api/v1/groups` (client-side substring) | `groups.go:56` |
| `GetUsers(ctx, service, groupID string, queryParams)` | `([]interface{}, error)` | GET | `/admin/api/v1/groups/{groupID}/users` | `groups.go:92` |
| `Create(ctx, service, groups *Groups)` | `(*Groups, *http.Response, error)` | POST | `/admin/api/v1/groups` | `groups.go:97` |
| `Update(ctx, service, groupID int, groups *Groups)` | `(*Groups, *http.Response, error)` | PUT | `/admin/api/v1/groups/{groupID}` | `groups.go:112` |
| `Delete(ctx, service, groupID string)` | `(*http.Response, error)` | DELETE | `/admin/api/v1/groups/{groupID}` | `groups.go:123` |
| `AddUserListToGroup(ctx, service, groupID string, userIDs []string)` | `(*Groups, *http.Response, error)` | POST | `/admin/api/v1/groups/{groupID}/users` | `groups.go:132` |
| `ReplaceUserListInGroup(ctx, service, groupID string, userIDs []string)` | `(*Groups, *http.Response, error)` | PUT | `/admin/api/v1/groups/{groupID}/users` | `groups.go:155` |
| `AddUserToGroup(ctx, service, groupID, userID string)` | `(*http.Response, error)` | POST | `/admin/api/v1/groups/{groupID}/users/{userID}` | `groups.go:177` |
| `DeleteUserFromGroup(ctx, service, groupID, userID string)` | `(*http.Response, error)` | DELETE | `/admin/api/v1/groups/{groupID}/users/{userID}` | `groups.go:189` |

## Postman collection endpoints

Variable `{{ZIAMBase}}` resolves to the ZIdentity ZIAM base URL. (`vendor/zscaler-api-specs/oneapi-postman-collection.json`)

| Method | Path |
|---|---|
| GET | `{{ZIAMBase}}/groups?offset=...&limit=...&name[like]=...&excludedynamicgroups=...` |
| GET | `{{ZIAMBase}}/groups/:id` |
| POST | `{{ZIAMBase}}/groups` |
| PUT | `{{ZIAMBase}}/groups/:id` |
| DELETE | `{{ZIAMBase}}/groups/:id` |
| GET | `{{ZIAMBase}}/groups/:id/users` |
| POST | `{{ZIAMBase}}/groups/:id/users` |
| PUT | `{{ZIAMBase}}/groups/:id/users` |
| POST | `{{ZIAMBase}}/groups/:id/users/:userId` |
| DELETE | `{{ZIAMBase}}/groups/:id/users/:userId` |

## Group model fields

Python model: `GroupRecord` in `zscaler/zid/models/groups.py`. Go struct: `Groups` in `zscaler/zid/services/groups/groups.go`.

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

`IDNameDisplayName` nested struct (Go) has fields `ID string`, `Name string`, `DisplayName string`. (`vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:14`)

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

### `list_groups` / `GetAll`

`PaginationQueryParams` struct at `vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:32`.

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

Full CRUD is supported. No activation step is required — changes take effect immediately.

**Create**: `add_group` / `Create` — POST to the collection endpoint. `id` is auto-generated by the server. (`groups.py:157`, `groups.go:97`)

**Update**: `update_group` / `Update` — full PUT replacement. See SDK divergences for the `groupID` type mismatch on the Go side. (`groups.py:221`, `groups.go:112`)

**Delete**: `delete_group` / `Delete` — returns no body on success. Cascade behavior when group has members is undocumented. (`groups.py:276`, `groups.go:123`)

## Membership management

Six distinct operations cover single-user and bulk-user membership changes:

| Operation | Python | Go | HTTP | Citation |
|---|---|---|---|---|
| Single add | `add_user_to_group(group_id, user_id)` | `AddUserToGroup(ctx, svc, groupID, userID)` | POST `/groups/{id}/users/{uid}` | `groups.py:384`, `groups.go:177` |
| Bulk add | `add_users_to_group(group_id, id=[...])` | `AddUserListToGroup(ctx, svc, groupID, []string)` | POST `/groups/{id}/users` | `groups.py:440`, `groups.go:132` |
| Bulk replace (PUT semantics) | `replace_users_groups(group_id, id=[...])` | `ReplaceUserListInGroup(ctx, svc, groupID, []string)` | PUT `/groups/{id}/users` | `groups.py:505`, `groups.go:155` |
| Single remove | `remove_user_from_group(group_id, user_id)` | `DeleteUserFromGroup(ctx, svc, groupID, userID)` | DELETE `/groups/{id}/users/{uid}` | `groups.py:571`, `groups.go:189` |
| Read members | `list_group_users_details(group_id)` | `GetUsers(ctx, svc, groupID, queryParams)` | GET `/groups/{id}/users` | `groups.py:312`, `groups.go:92` |

### Bulk-add payload transformation

Both SDKs transform a flat list of IDs into the `[{"id": "..."}]` array format required by the wire protocol.

**Python** (`add_users_to_group` and `replace_users_groups`): When `id` kwarg is a list, the function iterates and wraps each element as `{"id": user_id}`. (`groups.py:478-482`)

**Go** (`AddUserListToGroup` and `ReplaceUserListInGroup`): Accepts `[]string` and builds `[]UserID` internally before posting. (`groups.go:133-135`, `groups.go:156-158`)

## Static vs dynamic groups

Groups carry two boolean flags that together determine dynamic vs static classification. (`models/groups.py:88-89`, `groups.go:26-27`)

| Group type | `is_dynamic_group` / `isDynamicGroup` | `dynamic_group` / `dynamicGroup` |
|---|---|---|
| Static | `false` | `false` |
| Dynamic | `true` | `true` |

The integration test in `groups_test.go` sets only `DynamicGroup: true` (not `IsDynamicGroup`) when creating a dynamic-classified group. (`vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups_test.go:32`) The semantics of setting the two flags to differing values are not documented in the SDK.

**Dynamic group criteria**: The SDK does not expose the conditions/rules that drive dynamic group membership. Criteria are managed through the admin UI or a separate interface; they are not readable or writable via either SDK. (`models/groups.py:88-89`, `groups.go:26-27`)

## Groups as policy principals

ZIdentity groups are referenced by ID in ZIA and ZPA policy rules.

1. Group IDs are immutable (auto-generated at creation). Policy rules that reference a group by ID are unaffected by group renames. (`models/groups.py:86`, `groups.go:24`)
2. Membership changes take effect immediately — no activation step. Changes propagate to policy evaluation without a publish cycle.
3. No nested or parent-child group structure is exposed in the SDK.
4. Groups are tenant-wide with no product-level or region-level scoping visible in the SDK.
5. `admin_entitlement_enabled` and `service_entitlement_enabled` flags control entitlement grants separately from policy membership. (`models/groups.py:90-91`, `groups.go:28-29`) — see [`admin-rbac.md`](./admin-rbac.md)

## SDK divergences

| Aspect | Python | Go | Impact |
|---|---|---|---|
| `Update` group ID type | `str` (`groups.py:221`) | `int` (`groups.go:112`) | Type mismatch with struct `ID string`; appears to be a Go SDK bug — the URL format call uses `%d` on an int while `Get` and `Delete` accept `string` |
| Member list response type | `Groups` wrapper with pagination metadata | `[]interface{}` raw slice (`groups.go:92`) | Python preserves `results_total`, `next_link`, etc.; Go loses pagination metadata |
| `GetByName` | Not exposed | Client-side substring match on all pages (`groups.go:56`) | Go convenience function; expensive for large tenants |
| Single `AddUserToGroup` POST body | `kwargs` dict (typically empty) | Empty `struct{}{}` (`groups.go:179`) | Endpoint takes no body; both implementations are functionally equivalent |
| `list_groups` vs `GetAll` return | `(Groups envelope, response, error)` | `([]Groups, error)` — metadata consumed internally | Python exposes pagination links; Go hides them |

## Known bugs and edge cases

1. **Go `Update` `groupID int` vs struct `ID string`**: The `Update` function signature accepts `groupID int` and formats the URL with `%d`, while `Get`, `Delete`, `AddUserListToGroup`, and `ReplaceUserListInGroup` all accept `groupID string`. The struct's `ID` field is also `string`. This inconsistency means callers must convert types when passing the same group ID to `Update` vs other functions. (`groups.go:112` vs `groups.go:39`, `groups.go:123`)

2. **Python `list_group_users_details` return-type docstring**: The docstring at line 335 claims the return is "list of Groups instances" but the actual response is user records, not group records. (`groups.py:335`)

3. **Dynamic group membership mutation**: The SDK allows `add_user_to_group` on groups where `is_dynamic_group: true`. Server-side rejection behavior in this case is undocumented. (`groups.py:384`, `groups.go:177`)

4. **`custom_attrs_info` assignment in Python**: `GroupRecord` assigns `self.custom_attrs_info = config if isinstance(config, dict) else {}` — this assigns the entire raw config dict, not a filtered custom-attributes sub-key. (`models/groups.py:94`)

5. **Dual `isDynamicGroup` + `dynamicGroup` flags**: The wire protocol carries both. Their intended distinction and the behavior when they disagree is not documented in the SDK. (`models/groups.py:88-89`, `groups.go:26-27`)

## Gaps

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

- **Dual-flag semantics (`isDynamicGroup` vs `dynamicGroup`)** — what the server does when the two flags disagree is undocumented; the Go test only sets `DynamicGroup: true` — *unverified, requires API spec review or lab test*
- **Dynamic group membership mutation server behavior** — whether `add_user_to_group` on a dynamic group is rejected server-side or silently succeeds is unknown — *unverified, requires lab test*
- **User deduplication in bulk add** — whether duplicate user IDs in `add_users_to_group` result in rejection, deduplication, or silent ignore is unknown — *unverified, requires lab test*
- **IdP-sourced group (`source: SCIM`) mutation semantics** — whether SDK CRUD operations on SCIM-provisioned groups are rejected by the server is undocumented — *unverified, requires lab test or vendor documentation*

## Cross-links

- [`users.md`](./users.md) — user-side group association (`list_user_group_details` / `GetGroupsByUser`)
- [`admin-rbac.md`](./admin-rbac.md) — `admin_entitlement_enabled` / `service_entitlement_enabled` entitlement flags
- [`api-clients.md`](./api-clients.md) — OAuth 2.0 API client setup required to call these endpoints
- [`overview.md`](./overview.md) — federation context for IdP-sourced vs internal groups
