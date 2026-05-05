---
product: zdx
topic: "zdx-administration"
title: "ZDX administration — read-only filter-helper API surface"
content-type: reference
last-verified: "2026-05-05"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zdx/admin.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/administration.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/common.py"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZDX administration — read-only filter-helper API surface

## Naming warning — this is not admin-user management

The `AdminAPI` class (Python) and the `administration` package (Go) are named misleadingly. Despite the name, this surface has **nothing to do with admin users, permissions, or tenant configuration**. It exposes only two read-only endpoints that return department and location reference data used as filter dimensions for other ZDX endpoints (scores, metrics, devices).

The Python docstring at `admin.py:35` compounds the confusion — it reads "Returns the list of Admin Users enrolled in the Client Connector Portal." This is wrong. The implementation at `admin.py:77–103` hits `/zdx/v1/administration/departments` and returns department `{id, name}` pairs. (`vendor/zscaler-sdk-python/zscaler/zdx/admin.py:35`, `vendor/zscaler-sdk-python/zscaler/zdx/admin.py:77–103`)

**There is no write capability.** No POST, PUT, PATCH, or DELETE operations are exposed. Modifications to departments or locations happen through the admin portal UI, not through the API.

## What this surface is for

Department and location IDs returned by these endpoints are used as filter parameters (`dept`, `loc`) in score, metrics, device, and application queries. The two methods exist to let callers enumerate valid filter values before constructing parameterized queries for other ZDX endpoints.

See [`./applications.md`](./applications.md), [`./devices.md`](./devices.md), and [`./score.md`](./score.md) for how these IDs appear as filter parameters.

## API endpoints

Both endpoints are read-only. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:127206–127251`)

| Method | Path | Description | Python method | Go function | Citation |
|--------|------|-------------|---------------|-------------|----------|
| GET | `/zdx/v1/administration/departments` | Get departments registered by tenant | `list_departments()` | `GetDepartments()` | `admin.py:33`, `administration.go:39` |
| GET | `/zdx/v1/administration/locations` | Get Zscaler locations for the tenant | `list_locations()` | `GetLocations()` | `admin.py:106`, `administration.go:50` |

## Python methods

### `list_departments(query_params=None)`

`vendor/zscaler-sdk-python/zscaler/zdx/admin.py:33–103`

Returns configured departments. Accepts optional `query_params` dict. Returns a 3-tuple `(results, response, error)` where `results` is `List[Administration]`.

| Query parameter | Type | Description | Citation |
|----------------|------|-------------|----------|
| `since` | int | Hours to look back. Defaults to last 2 hours if omitted. | `admin.py:40–41` |
| `search` | str | Filter by department name or department ID. | `admin.py:43` |

### `list_locations(query_params=None)`

`vendor/zscaler-sdk-python/zscaler/zdx/admin.py:106–176`

Returns configured Zscaler locations. Same return shape as `list_departments()` — 3-tuple `(results, response, error)` where `results` is `List[Administration]`.

| Query parameter | Type | Description | Citation |
|----------------|------|-------------|----------|
| `since` | int | Hours to look back. Defaults to last 2 hours if omitted. | `admin.py:113–114` |
| `search` | str | Filter by location name or location ID. | `admin.py:116` |

## Go functions

### `GetDepartments`

`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:39–47`

```
GetDepartments(ctx context.Context, service *zscaler.Service, filters GetDepartmentsFilters) ([]Department, *http.Response, error)
```

### `GetLocations`

`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:50–58`

```
GetLocations(ctx context.Context, service *zscaler.Service, filters GetLocationsFilters) ([]Location, *http.Response, error)
```

## Field tables

### Python — `Administration` model

Used as the return type for both `list_departments()` and `list_locations()`. (`vendor/zscaler-sdk-python/zscaler/zdx/models/administration.py:21–49`)

| Python attr | Wire key | Type | Optional | Citation |
|-------------|----------|------|----------|----------|
| `id` | `id` | int | No | `administration.py:36` |
| `name` | `name` | str | No | `administration.py:37` |

Both endpoints return only `{id, name}` despite the generic model name.

### Go — `Department` struct

`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:15–18`

| Go field | Wire key | Type | Citation |
|----------|----------|------|----------|
| `ID` | `id` | int | `administration.go:16` |
| `Name` | `name` | string | `administration.go:17` |

### Go — `Location` struct

`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:20–23`

| Go field | Wire key | Type | Citation |
|----------|----------|------|----------|
| `ID` | `id` | int | `administration.go:21` |
| `Name` | `name` | string | `administration.go:22` |

### Go filter types

#### `GetDepartmentsFilters`

`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:25–29`

| Go field | Wire key | Type | Description | Citation |
|----------|----------|------|-------------|----------|
| `From` | `from` | int | Unix epoch seconds (start of range) | `administration.go:26` |
| `To` | `to` | int | Unix epoch seconds (end of range) | `administration.go:27` |
| `Search` | `search` | string | Filter by name or ID | `administration.go:28` |

#### `GetLocationsFilters`

`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:31–36`

| Go field | Wire key | Type | Description | Citation |
|----------|----------|------|-------------|----------|
| `From` | `from` | int | Unix epoch seconds (start of range) | `administration.go:32` |
| `To` | `to` | int | Unix epoch seconds (end of range) | `administration.go:33` |
| `Search` | `search` | string | Filter by name or ID | `administration.go:34` |
| `Q` | `q` | string | Alternative search alias — same semantics as `Search` | `administration.go:35` |

## Richer models in common.py (not used by AdminAPI)

Python defines two fuller representations in `models/common.py` used by other ZDX contexts (reports, device roll-ups). These are **not** returned by `AdminAPI` — they appear in richer response payloads from device and score endpoints.

| Model | Python attrs | Wire keys | Citation |
|-------|-------------|-----------|----------|
| `Departments` | `id` (int), `name` (str), `num_devices` (int) | `id`, `name`, `num_devices` | `common.py:64–97` |
| `Locations` | `id` (int), `name` (str), `num_devices` (int), `groups` (CommonIDName, optional) | `id`, `name`, `num_devices`, `groups` | `common.py:100–145` |

`AdminAPI` returns the flat `Administration` model — not these. The richer models appear in reporting contexts where device counts per department/location are also returned.

## SDK divergences

**Time filter semantics**: Python `since` is an integer number of hours to look back; Go `From`/`To` are Unix epoch seconds. Callers must convert before constructing Go filter values. (`vendor/zscaler-sdk-python/zscaler/zdx/admin.py:40–41`, `vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:26–27`)

**`Q` field on locations (Go only)**: `GetLocationsFilters` has both `Search` and `Q` fields. `GetDepartmentsFilters` has only `Search`. The Python SDK exposes only `search` for both endpoints. (`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:28,35`)

**Return type naming**: Python returns `List[Administration]` for both departments and locations — the same generic model. Go returns `[]Department` and `[]Location` — distinct typed structs with identical field shapes. (`vendor/zscaler-sdk-python/zscaler/zdx/models/administration.py:21`, `vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:15–23`)

## Edge cases and gotchas

**Misleading docstring**: `list_departments()` docstring says "Returns the list of Admin Users enrolled in the Client Connector Portal." This is incorrect — it returns departments. The docstring was not updated when the method was implemented. (`vendor/zscaler-sdk-python/zscaler/zdx/admin.py:35`)

**Time filters on reference data**: Both endpoints accept time-range filters (`since` / `From`+`To`). The semantic is likely "departments/locations that had active devices reporting in the given time window" — not a filter on when the department was created. This is not documented. (`vendor/zscaler-sdk-python/zscaler/zdx/admin.py:40–41`)

**`/active_geo` is not in this package**: The Postman collection groups `/active_geo` under the "administration" folder, but it is exposed in `DevicesAPI`, not `AdminAPI`. See [`./devices.md`](./devices.md). (`vendor/zscaler-api-specs/oneapi-postman-collection.json:127254`)

**Flat model, no enrichment**: `AdminAPI` returns only `{id, name}`. Device count per department (`num_devices`) is available only through the richer `Departments`/`Locations` models in `common.py`, which appear in reporting response payloads — not from these filter-helper endpoints. (`vendor/zscaler-sdk-python/zscaler/zdx/models/administration.py:36–37`, `vendor/zscaler-sdk-python/zscaler/zdx/models/common.py:64–97`)

## Open questions

- **Time filter semantics for organizational lists** — it is unclear whether the `since`/`From`+`To` filters select "departments/locations that had active devices in this window" or have some other meaning for reference data that doesn't change over time — *unverified, requires vendor doc or tenant-side check*
- **`Q` vs `Search` on `GetLocationsFilters`** — both fields appear to filter by name or ID; whether they differ in matching behavior (exact vs partial, case sensitivity) is not documented in the source — *unverified, requires vendor doc or lab test*

## Cross-links

- Department/location IDs as filter parameters — [`./applications.md`](./applications.md), [`./devices.md`](./devices.md), [`./score.md`](./score.md)
- Active geolocation listing (`/zdx/v1/active_geo`) — [`./devices.md`](./devices.md) (not in this package despite Postman grouping)
- ZDX architecture overview — [`./overview.md`](./overview.md)
