---
product: zidentity
topic: "zidentity-resource-servers"
title: "ZIdentity resource servers — read-only OAuth resource registry, service-grouped scopes, API client linkage"
content-type: reference
last-verified: "2026-05-05"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/resource_servers.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py"
  - "vendor/zscaler-sdk-python/tests/integration/zid/test_resource_servers.py"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go"
  - "vendor/zscaler-sdk-go/tests/unit/zid/services/resource_servers_test.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZIdentity resource servers

A resource server is a read-only registry entry that declares an OAuth audience (`primaryAud`) and the scopes it exposes, grouped by Zscaler service. Resource servers are system-defined — neither SDK exposes Create, Update, or Delete operations. Scopes are read-only nested sub-resources of the resource server; assignment to an API client is performed on the API-client side via `clientResources`.

## Base endpoints

| SDK | Constant | Value | Source |
|---|---|---|---|
| Python | `_zidentity_base_endpoint` | `/ziam/admin/api/v1` | `vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py:31` |
| Go | `resourceServerEndpoint` | `/admin/api/v1/resource-servers` | `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:13` |

The Python SDK prepends the full `/ziam/admin/api/v1` prefix; the Go SDK constant stores the path from `/admin/api/v1` onward. Both resolve to the same wire URL (`/ziam/admin/api/v1/resource-servers`) when the client's base URL is applied.

## Python SDK methods

Module: `zscaler.zid.resource_servers` (`vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py`)

### `list_resource_servers`

```
list_resource_servers(query_params: Optional[dict] = None) -> APIResult[ResourceServers]
```

- **HTTP**: `GET /ziam/admin/api/v1/resource-servers` (`resource_servers.py:88-92`)
- **Returns**: `tuple (ResourceServers instance, Response, error)` (`resource_servers.py:58`)
- **Response wrapper**: `ResourceServers` — pagination envelope wrapping a list of `ResourceServersRecord` (`resource_servers.py:109`)
- **Query parameters** (`resource_servers.py:49-55`):

| Parameter | Type | Description |
|---|---|---|
| `offset` | int | Pagination start — number of records to skip |
| `limit` | int | Max records per request; range \[0, 1000\] |
| `name[like]` | str | Case-insensitive partial name match |

### `get_resource_server`

```
get_resource_server(resource_id: str) -> APIResult[ResourceServersRecord]
```

- **HTTP**: `GET /ziam/admin/api/v1/resource-servers/{resource_id}` (`resource_servers.py:135-139`)
- **Returns**: `tuple (ResourceServersRecord instance, Response, error)` (`resource_servers.py:123`)
- **Known bug**: the docstring at `resource_servers.py:120` declares `resource_id (int)` but the actual parameter type is `str` — pass a string ID.

## Go SDK functions

Package: `resourceservers` (`vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go`)

### `Get`

```go
Get(ctx context.Context, service *zscaler.Service, resourceID string) (*ResourceServers, error)
```

- **HTTP**: `GET /admin/api/v1/resource-servers/{resourceID}` via `service.Client.Read` (`resource_servers.go:48`)
- **Returns**: `(*ResourceServers, error)` (`resource_servers.go:46`)

### `GetAll`

```go
GetAll(ctx context.Context, service *zscaler.Service, queryParams *common.PaginationQueryParams) ([]ResourceServers, error)
```

- **HTTP**: `GET /admin/api/v1/resource-servers` (`resource_servers.go:58-59`)
- **Implementation**: delegates to `common.ReadAllPagesWithPagination[ResourceServers]()` (`resource_servers.go:59`)

### `GetByName` (Go only)

```go
GetByName(ctx context.Context, service *zscaler.Service, name string) ([]ResourceServers, error)
```

- **HTTP**: paginated `GET /admin/api/v1/resource-servers` with client-side filtering (`resource_servers.go:62-96`)
- **Page size**: hard-coded 100 (`resource_servers.go:66`); not configurable by the caller
- **Filter**: `strings.Contains(strings.ToLower(group.Name), strings.ToLower(name))` — substring, case-insensitive (`resource_servers.go:81`)
- **Stop condition**: `len(pageResponse.Records) < pageSize` OR `pageResponse.NextLink == ""` (`resource_servers.go:87`)
- **Returns**: `[]ResourceServers` — all partial matches; empty slice (no error) if no records match (`resource_servers.go:95`)
- **Python equivalent**: not implemented

## API surface summary

| Operation | Python | Go | HTTP | Full endpoint |
|---|---|---|---|---|
| List | `list_resource_servers(query_params)` | `GetAll(ctx, service, queryParams)` | GET | `/ziam/admin/api/v1/resource-servers` |
| Get by ID | `get_resource_server(resource_id)` | `Get(ctx, service, id)` | GET | `/ziam/admin/api/v1/resource-servers/{id}` |
| Search by name | — | `GetByName(ctx, service, name)` | GET (paginated, client-side filter) | `/ziam/admin/api/v1/resource-servers` |
| Create / Update / Delete | — | — | — | — |

## Postman collection endpoints

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`

| Name | Method | Raw URL | Line |
|---|---|---|---|
| Resource Servers Ops list | GET | `{{ZIAMBase}}/resource-servers?offset=...&limit=...&name[like]=...` | 132116 |
| Resource Servers Ops get | GET | `{{ZIAMBase}}/resource-servers/:id` | 132265 |

`{{ZIAMBase}}` is the Postman environment variable for the ZIAM base URL. Combined with the Python SDK constant, the resolved paths are `GET /ziam/admin/api/v1/resource-servers` and `GET /ziam/admin/api/v1/resource-servers/{id}` respectively.

No POST, PUT, or DELETE operations for resource servers appear in the Postman collection (`oneapi-postman-collection.json`).

Query parameter descriptions from Postman (`oneapi-postman-collection.json:132135-132148`):

| Parameter | Description |
|---|---|
| `offset` | "The starting point for pagination, with the number of records that can be skipped before fetching results." |
| `limit` | "The maximum number of records to return per request. Minimum: 0, Maximum: 1000" |
| `name[like]` | "Filters resource servers by name using a case-insensitive partial match." |

## Model fields

### `ResourceServers` — pagination envelope

Python source: `vendor/zscaler-sdk-python/zscaler/zid/models/resource_servers.py:23-66`
Go source: `vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:22-29` (generic `PaginationResponse[T]`)

| Python attr | Go field | Wire key | Type | Notes |
|---|---|---|---|---|
| `results_total` | `ResultsTotal` | `results_total` | int | Total record count |
| `page_offset` | `PageOffset` | `pageOffset` | int | Current page offset |
| `page_size` | `PageSize` | `pageSize` | int | Page size used |
| `next_link` | `NextLink` | `next_link` | str / string | Next page cursor URL; empty string signals last page |
| `prev_link` | `PrevLink` | `prev_link` | str / string | Previous page cursor URL |
| `records` | `Records` | `records` | `List[ResourceServersRecord]` / `[]T` | Page of resource server objects |

Go uses the shared generic `common.PaginationResponse[ResourceServers]` aliased as `ResourceServersResponse` (`resource_servers.go:44`). Python defines `ResourceServers` directly (`models/resource_servers.py:23`).

### `ResourceServersRecord` — single resource server

Python source: `vendor/zscaler-sdk-python/zscaler/zid/models/resource_servers.py:69-117`
Go source: `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:16-24`

| Python attr | Go field | Wire key | Type | Notes |
|---|---|---|---|---|
| `id` | `ID` | `id` | str / string | Resource server identifier |
| `name` | `Name` | `name` | str / string | Internal name |
| `display_name` | `DisplayName` | `displayName` | str / string | Human-readable label |
| `description` | `Description` | `description` | str / string | Optional description |
| `primary_aud` | `PrimaryAud` | `primaryAud` | str / string | OAuth audience claim value |
| `default_api` | `DefaultApi` | `defaultApi` | bool | When true, resource server is implicitly available |
| `service_scopes` | `ServiceScopes` | `serviceScopes` | `List[ServiceScopes]` / `[]ServiceScopes` | Scopes grouped by service |

Both SDKs have identical fields. No type mismatches between Python and Go representations.

### `ServiceScopes` — scopes for one service

Python source: `vendor/zscaler-sdk-python/zscaler/zid/models/resource_servers.py:120-157`
Go source: `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:26-29`

| Python attr | Go field | Wire key | Type |
|---|---|---|---|
| `service` | `Service` | `service` | `Service` object |
| `scopes` | `Scopes` | `scopes` | `List[CommonIDName]` / `[]Scopes` |

### `Service` — service metadata

Python source: `vendor/zscaler-sdk-python/zscaler/zid/models/resource_servers.py:160-200`
Go source: `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:31-37`

| Python attr | Go field | Wire key | Type |
|---|---|---|---|
| `id` | `ID` | `id` | str / string |
| `name` | `Name` | `name` | str / string |
| `display_name` | `DisplayName` | `displayName` | str / string |
| `cloud_name` | `CloudName` | `cloudName` | str / string |
| `org_name` | `OrgName` | `orgName` | str / string |

### `Scopes` / `CommonIDName` — individual scope

Python: uses shared `common.CommonIDName` imported at `models/resource_servers.py:135` (`{id: str, name: str}`)
Go: local `Scopes` struct at `resource_servers.go:39-42`

| Python attr | Go field | Wire key | Type |
|---|---|---|---|
| `id` | `ID` | `id` | str / string |
| `name` | `Name` | `name` | str / string |

Go test validation example (`resource_servers_test.go:134-145`): `{ID: "scope-admin", Name: "admin:all"}` → `{"id":"scope-admin","name":"admin:all"}`.

## Scope model — read-only nested sub-resource

Scopes live at `ResourceServersRecord.serviceScopes[].scopes[]` (Python `models/resource_servers.py:90-91`; Go `resource_servers.go:23`). There are no independent CRUD operations on scopes: no Create, Update, Delete, or dedicated `GET /scopes` endpoint in either SDK. Scope definitions are authority of the resource server; assignment to an API client happens at the API-client level (see OneAPI client linkage below).

A resource server can carry multiple `ServiceScopes` entries — one per Zscaler service. Example structure (from Go unit test `resource_servers_test.go:187-229`):

```json
{
  "serviceScopes": [
    {
      "service": {"id": "svc-1", "name": "service-a", "displayName": "Service A"},
      "scopes": [
        {"id": "s1", "name": "scope-a-read"},
        {"id": "s2", "name": "scope-a-write"}
      ]
    },
    {
      "service": {"id": "svc-2", "name": "service-b", "displayName": "Service B"},
      "scopes": [{"id": "s3", "name": "scope-b-read"}]
    }
  ]
}
```

## Query parameters and pagination

### Parameters relevant to resource-server endpoints

Source: Python docstring `resource_servers.py:49-55`; Go `PaginationQueryParams` `common.go:32-44`

| Parameter | Wire key | Type | Constraint | Notes |
|---|---|---|---|---|
| `offset` | `offset` | int | >= 0 (Go builder enforces at `common.go:89`) | Pagination start — records to skip |
| `limit` | `limit` | int | \[1, 1000\] (Go builder clamps at `common.go:96`); Python docstring states \[0, 1000\] | Max records per request |
| `name[like]` | `name[like]` | str | — | Case-insensitive partial match on resource server name |

`PaginationQueryParams` also defines fields for `loginname`, `displayname[like]`, `primaryemail[like]`, `domainname`, `idpname`, and `excludedynamicgroups` (`common.go:37-43`), but these are not applicable to resource-server endpoints.

### Go fluent builder (`common.go:60-103`)

```go
params := common.NewPaginationQueryParams(pageSize)  // common.go:61; clamps to [1, 1000]
params.WithNameFilter("my-server")                   // common.go:75
params.WithOffset(200)                               // common.go:87; no-op if offset < 0
params.WithLimit(50)                                 // common.go:95; no-op outside [1, 1000]
urlValues := params.ToURLValues()                    // common.go:103
```

### Pagination mechanics

- Strategy: offset-based (`common.go:160`, `resource_servers.go:92`)
- Default page size: 100 (`common.go:55-56`)
- Stop condition: `len(records) < limit` OR `next_link == ""` (`common.go:180`)
- JMESPath post-aggregation filter applied when expression is present in context (`common.go:188`)

## OneAPI client linkage

Resource servers register available scopes. Assignment of scopes to an API client happens on the API-client side:

- `APIClientRecords.client_resources` (`List[ClientResources]`, JSON: `clientResources`) holds the back-reference from the OAuth client to its authorized resource servers (`vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py:93-95`).
- Resource servers do **not** carry a back-reference to which API clients can access them.

Linkage flow:

1. **API client → resource server**: the OAuth client's `clientResources` list references one or more resource servers (`api_client.py:93-95`).
2. **Resource server → scopes**: the resource server exposes scopes grouped by service (`serviceScopes`).
3. **Scope consumption**: when provisioning an API client, scopes are drawn from specific resource servers via `clientResources`.

See [`api-clients.md`](./api-clients.md) for the full `clientResources` field model and OAuth client provisioning flow.

## SDK divergences

| Aspect | Python | Go |
|---|---|---|
| List function | `list_resource_servers(query_params=None)` (`resource_servers.py:37`) | `GetAll(ctx, service, queryParams)` (`resource_servers.go:58`) |
| Search by name | Not implemented | `GetByName(ctx, service, name)` (`resource_servers.go:63`) |
| Pagination params | Untyped `dict` via `query_params` | Typed `*PaginationQueryParams` with fluent builder (`common.go:32-100`) |
| Scope model import | Shared `common.CommonIDName` (`models/resource_servers.py:135`) | Local `Scopes` struct (`resource_servers.go:39-42`) |
| Get return shape | `(result, response, error)` tuple (`resource_servers.py:58`) | `(*ResourceServers, error)` (`resource_servers.go:46`) |
| Endpoint base constant | `/ziam/admin/api/v1` (`resource_servers.py:31`) | `/admin/api/v1` (prefix within constant) (`resource_servers.go:13`) |

## Known bugs and edge cases

1. **Python docstring type mismatch**: `resource_servers.py:120` declares `resource_id (int)` but the parameter is `str`. Pass a string ID. (`resource_servers.py:115`)
2. **Go `GetByName` hard-coded page size**: 100 at `resource_servers.go:66`; not configurable by the caller.
3. **No scope mutation endpoints**: scopes are server-defined and read-only in both SDKs; no Create, Update, or Delete.
4. **Go `GetByName` empty results**: returns an empty slice with no error when no names match. The Go unit test at `resource_servers_test.go:313` expects 2 matches for name `"ZPA"` from a fixture of 3 records.

## Test coverage notes

**Python integration test** (`vendor/zscaler-sdk-python/tests/integration/zid/test_resource_servers.py:25-62`):
- VCR-recorded (`@pytest.mark.vcr()` at line 30)
- Calls `list_resource_servers()` (line 38), unpacks tuple, iterates `.records`
- Extracts first record ID (line 44), calls `get_resource_server(resource_id)` (line 52), asserts ID match (line 56)

**Go unit tests** (`vendor/zscaler-sdk-go/tests/unit/zid/services/resource_servers_test.go`):
- `TestResourceServers_Structure` (lines 16-145) — JSON marshal/unmarshal of all four model types
- `TestResourceServers_ResponseParsing` (lines 148-230) — `PaginationResponse` wrapper with multiple records
- `TestResourceServers_Get_SDK` (lines 236-261) — HTTP mock, `Get(ctx, service, resourceID)`
- `TestResourceServers_GetAll_SDK` (lines 263-287) — HTTP mock, `GetAll(ctx, service, nil)`
- `TestResourceServers_GetByName_SDK` (lines 289-314) — HTTP mock returns 3 fixtures; `GetByName(ctx, service, "ZPA")` returns 2 matches

Neither SDK has tests covering pagination query parameters, server-side name filtering, or error cases.

## Open questions

- **Empty `serviceScopes` array semantics** — meaning of a resource server with an empty `serviceScopes` slice (vs a populated one) is not documented in either SDK. Requires review of live API behavior or vendor docs. *Unverified, requires tenant-side check or vendor documentation.*
- **`defaultApi` flag behavior** — the `defaultApi` boolean field on `ResourceServersRecord` is present in both SDKs but its operational semantics (which clients it applies to, override behavior) are not described in any vendored source. *Unverified, requires vendor documentation or lab test.*
- **Go endpoint base prefix discrepancy** — Python uses `/ziam/admin/api/v1` as the full prefix (`resource_servers.py:31`); Go uses `/admin/api/v1` (`resource_servers.go:13`). Both resolve correctly through their respective client base-URL configuration, but the prefix difference should be confirmed against the actual wire URL in a live tenant. *Unverified, requires live API trace.*

## Cross-links

- [`api-clients.md`](./api-clients.md) — OAuth API clients; covers `clientResources` field, scope assignment, token exchange. Resource servers register available scopes; assignment to API clients happens via `clientResources` on the API-client side.
- [`admin-rbac.md`](./admin-rbac.md) — ZIdentity admin RBAC and entitlements; entitlements govern which scopes a user or admin can access. Resource servers are the authority on scope definitions.
