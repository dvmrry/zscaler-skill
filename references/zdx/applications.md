---
product: zdx
topic: "zdx-applications"
title: "ZDX applications — inventory, monitoring, API surface"
content-type: reference
last-verified: "2026-05-05"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zdx/apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/applications.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/application_users.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/common.py"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go"
author-status: draft
---

# ZDX applications — inventory, monitoring, API surface

Reference for the ZDX application surface: what the SDKs expose, field shapes for both Python and Go, query filter parameters, and SDK divergences.

For score model details, calculation, datapoint field shapes (`ApplicationScoreTrend` / `common.Metric`), and score-trend endpoint semantics, see [`./score.md`](./score.md).

## Application inventory model

ZDX ships with predefined applications (Zoom, Box, Salesforce, ServiceNow, and Microsoft 365 components: Teams, SharePoint Online, OneDrive for Business, Outlook). These come with pre-configured Web and Cloud Path probes. Customers can add custom applications with their own probes. Custom apps require at least one Web probe to enable monitoring; network-type custom apps need at least one Cloud Path probe instead.

The SDK exposes only **read** (reporting/monitoring) endpoints. Application creation, modification, deletion, and probe configuration are performed via the ZDX Admin Portal. Only applications with recent score data (i.e., active applications) are returned by list endpoints. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:38-40`)

**Application IDs**: integers. Python function signatures accept `app_id: str` on the wire; the Go SDK uses `int` natively. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:113`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:16`)

## API endpoints

Score-trend and metric-trend endpoint semantics (defaults, datapoint shapes) are documented in [`./score.md`](./score.md). The table below covers all application endpoints.

### Application endpoints

| Method | Path | Description | Python method | Go function | Citation |
|--------|------|-------------|---------------|-------------|----------|
| GET | `/zdx/v1/apps` | List all active applications with ZDX score, most impacted region, total users | `list_apps()` | `GetAllApps()` | `apps.py:38`, `applications.go:43` |
| GET | `/zdx/v1/apps/{app_id}` | Get single application with score, most impacted region, stats | `get_app()` | `GetApp()` | `apps.py:113`, `applications.go:53` |
| GET | `/zdx/v1/apps/{app_id}/score` | Get ZDX score trend (datapoints) for application; defaults to last 2 hours | `get_app_score()` | `GetAppScores()` | `apps.py:173`, `application_score_metrics.go:18` |
| GET | `/zdx/v1/apps/{app_id}/metrics` | Get metric trend (PFT, DNS, Availability) for application; defaults to last 2 hours | `get_app_metrics()` | `GetAppMetrics()` | `apps.py:242`, `application_score_metrics.go:45` |
| GET | `/zdx/v1/apps/{app_id}/users` | List users and devices that accessed the application; filterable by `score_bucket` | `list_app_users()` | — (no Go equivalent) | `apps.py:319` |
| GET | `/zdx/v1/apps/{app_id}/users/{user_id}` | Get single user and their devices for an application | `get_app_user()` | — (no Go equivalent) | `apps.py:402` |

### Device-level application endpoints

| Method | Path | Description | Python method | Go function | Citation |
|--------|------|-------------|---------------|-------------|----------|
| GET | `/zdx/v1/devices/{device_id}/apps` | List all active applications for a device with ZDX score | `get_device_apps()` | `GetDeviceAllApps()` | `devices.py:194`, `device_apps.go:34` |
| GET | `/zdx/v1/devices/{device_id}/apps/{app_id}` | Get single application for a device with score trend (datapoints) | `get_device_app()` | `GetDeviceApp()` | `devices.py:258`, `device_apps.go:23` |

## Field tables

### Application list fields — `ActiveApplications` (Python) / `Apps` (Go)

Returned by `list_apps()` / `GetAllApps()`. (`vendor/zscaler-sdk-python/zscaler/zdx/models/applications.py:23`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:15`)

| Python attr | Go field | Wire key | Type | Citation |
|-------------|----------|----------|------|----------|
| `id` | `ID` | `id` | int | `applications.py:38`, `applications.go:16` |
| `name` | `Name` | `name` | string | `applications.py:39`, `applications.go:17` |
| `score` | `Score` | `score` | float (Python), float32 (Go) | `applications.py:40`, `applications.go:18` |
| `total_users` | `TotalUsers` | `total_users` | int | `applications.py:41`, `applications.go:21` |
| `most_impacted_region` | `MostImpactedRegion` | `most_impacted_region` | nested object (see below) | `applications.py:43-51`, `applications.go:19` |

### Application detail fields — `ApplicationScore` (Python) / `Apps` (Go)

Returned by `get_app()` / `GetApp()`. Adds `stats` over the list response. (`vendor/zscaler-sdk-python/zscaler/zdx/models/applications.py:76`)

| Python attr | Go field | Wire key | Type | Citation |
|-------------|----------|----------|------|----------|
| `id` | `ID` | `id` | int | `applications.py:91`, `applications.go:16` |
| `name` | `Name` | `name` | string | `applications.py:92`, `applications.go:17` |
| `score` | `Score` | `score` | float (Python), float32 (Go) | `applications.py:93`, `applications.go:18` |
| `most_impacted_region` | `MostImpactedRegion` | `most_impacted_region` | nested object | `applications.py:95-103`, `applications.go:19` |
| `stats` | `Stats` | `stats` | nested object (see below) | `applications.py:105-113`, `applications.go:20` |

Python `get_app()` wraps the single `ApplicationScore` object in a list — it returns `[ApplicationScore(...)]`. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:166`)

### Most Impacted Region fields

**Asymmetry**: The Python `MostImpactedRegion` model exposes only `id` and `country`. The Go struct exposes the full set of geo fields.

| Python attr | Go field | Wire key | Type | Python citation | Go citation |
|-------------|----------|----------|------|-----------------|-------------|
| `id` | `ID` | `id` | string | `common.py:257` | `applications.go:25` |
| `country` | `Country` | `country` | string | `common.py:258` | `applications.go:28` |
| — | `City` | `city` | string | not in Python model | `applications.go:26` |
| — | `Region` | `region` | string | not in Python model | `applications.go:27` |
| — | `GeoType` | `geo_type` | string | not in Python model | `applications.go:29` |

### Stats fields

Present in the application detail response only (`ApplicationScore.stats` / `Apps.Stats`). These are user-count breakdowns by score bucket, not score values themselves.

| Python attr | Go field | Wire key | Type | Citation |
|-------------|----------|----------|------|----------|
| `active_users` | `ActiveUsers` | `active_users` | int | `applications.py:152`, `applications.go:33` |
| `active_devices` | `ActiveDevices` | `active_devices` | int | `applications.py:153`, `applications.go:34` |
| `num_poor` | `NumPoor` | `num_poor` | int | `applications.py:154`, `applications.go:35` |
| `num_okay` | `NumOkay` | `num_okay` | int | `applications.py:155`, `applications.go:36` |
| `num_good` | `NumGood` | `num_good` | int | `applications.py:156`, `applications.go:37` |

### Device-level application fields — `App` (Go) / Python device model

Returned by device-level application endpoints. Shape is simpler than the application-level response — no `most_impacted_region` or `stats`.

| Python attr | Go field | Wire key | Type | Citation |
|-------------|----------|----------|------|----------|
| `id` | `ID` | `id` | int | `devices.py:350`, `device_apps.go:17` |
| `name` | `Name` | `name` | string | `devices.py:351`, `device_apps.go:18` |
| `score` | `Score` | `score` | float (Python), float32 (Go) | `devices.py:352`, `device_apps.go:19` |

### Application user fields — Python only

**`ApplicationActiveUsers`** (list response from `list_app_users()`):

| Python attr | Wire key | Type | Citation |
|-------------|----------|------|----------|
| `next_offset` | `next_offset` | string | `application_users.py:38` |
| `users` | `users` | array of `CommonIDName` | `application_users.py:40` |

**`ApplicationUserDetails`** (detail response from `get_app_user()`):

| Python attr | Wire key | Type | Citation |
|-------------|----------|------|----------|
| `id` | `id` | int | `application_users.py:73` |
| `name` | `name` | string | `application_users.py:74` |
| `email` | `email` | string | `application_users.py:75` |
| `score` | `score` | float/int | `application_users.py:76` |
| `devices` | `devices` | array of `Devices` | `application_users.py:77` |

Pagination on user lists is cursor-based: `next_offset` token is returned when more pages are available. (`vendor/zscaler-sdk-python/zscaler/zdx/models/application_users.py:38`)

### Score trend and metric trend fields

See [`./score.md`](./score.md) — field tables for `ApplicationScoreTrend` / `common.Metric` / `DataPoint` are documented there against the same sources.

## Query filter parameters

All application endpoints accept the same `GetFromToFilters` struct (Go) / `query_params` dict (Python). If no time range is specified the endpoints default to the last 2 hours. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go:17`)

| Go field | Python key | Wire key | Type | Default | Citation |
|----------|------------|----------|------|---------|----------|
| `From` | `since` (hours, converted) | `from` | int (Unix epoch seconds) | last 2 hours | `common.go:18`, `apps.py:45` |
| `To` | — | `to` | int (Unix epoch seconds) | now | `common.go:20` |
| `Loc` | `location_id` | `loc` | []int | — | `common.go:21`, `apps.py:47` |
| `Dept` | `department_id` | `dept` | []int | — | `common.go:22`, `apps.py:49` |
| `Geo` | `geo_id` | `geo` | []string | — | `common.go:23`, `apps.py:50` |
| `LocationGroups` | — | `location_groups` | []string | — | `common.go:24` |
| `MetricName` | `metric_name` | `metric_name` | string | `pft` | `common.go:25`, `apps.py:260-263` |
| `Offset` | — | `offset` | string | — | `common.go:26` |
| `Limit` | — | `limit` | int | — | `common.go:28` |
| `Q` | — | `q` | string | — | `common.go:30` |

**`score_bucket` filter** (Python `list_app_users()` only): `poor` / `okay` / `good`. No Go SDK equivalent. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:338-341`)

**Valid `metric_name` values** for Web Probes: `pft` (Page Fetch Time, default), `dns` (DNS Time), `availability`. For Cloud Path Probes the parameter selects latency segment metrics; if not specified, defaults to End-to-End latency. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:260-263`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go:38-42`)

## SDK divergences

1. **Response wrapping**: Python wraps responses in model classes (`ActiveApplications`, `ApplicationScore`, `ApplicationScoreTrend`, `ApplicationMetrics`) that inherit from `ZscalerObject`. Go returns typed structs directly (`[]Apps`, `*Apps`, `[]common.Metric`). (`vendor/zscaler-sdk-python/zscaler/zdx/models/applications.py:23,76`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:43-50`)

2. **Single-object list wrap in Python**: `get_app()` returns the single `ApplicationScore` object wrapped in a list — `[ApplicationScore(...)]`. `GetApp()` returns `*Apps`. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:166`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:53`)

3. **`MostImpactedRegion` asymmetry**: Python `common.MostImpactedRegion` exposes only `id` and `country`; Go struct additionally has `city`, `region`, and `geo_type`. (`vendor/zscaler-sdk-python/zscaler/zdx/models/common.py:257-258`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:25-29`)

4. **User-level endpoints**: Python SDK exposes `list_app_users()` and `get_app_user()` with cursor-based pagination and `score_bucket` filtering. Go SDK has no equivalents for either. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:319,402`)

5. **Score-bucket filter**: Available only in Python (`list_app_users()`). (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:338-341`)

6. **Metric return type**: Python `get_app_metrics()` returns a list of `ApplicationMetrics` objects; Go `GetAppMetrics()` returns `[]common.Metric`. Both carry the same `metric / unit / datapoints` wire shape. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:310-312`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go:45`)

7. **`GetApp()` ID type**: Go `GetApp()` and `GetDeviceApp()` accept `appID string` (not `int`) despite `Apps.ID` being typed as `int`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:53`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go:23`)

## Edge cases and gotchas

**Only active applications are returned**: List endpoints return only applications with recent ZDX score data. An application that has had no active probes during the time window will not appear — this does not mean the application is deleted. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:38-40`)

**Stats are user counts, not score values**: `num_poor`, `num_okay`, `num_good` in the `Stats` block count users in each score bucket for the application — they are not score percentages or score values. (`vendor/zscaler-sdk-python/zscaler/zdx/models/applications.py:154-156`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:35-37`)

**Cursor-based pagination on user lists**: `list_app_users()` returns a `next_offset` token in the response. To retrieve all pages, pass the token back as the `offset` query parameter on the next request. (`vendor/zscaler-sdk-python/zscaler/zdx/models/application_users.py:38`)

**`metric_name` case**: Use lowercase (`pft`, `dns`, `availability`). The docstring and Go comment both show lowercase. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:260-263`)

**Lowest-value-wins and baseline lag**: See [`./score.md`](./score.md) for the hourly rollup mechanic (a single bad 5-minute sample pulls the hour's score down) and the 7-day baseline initialization lag for newly-added applications.

**Users with no app access**: A user who accessed no applications during the time range does not appear in `list_app_users()` results. This is distinct from a user with score 0. See [`./score.md`](./score.md).

## Open questions

- **Metric names exhaustive list** — the Python docstring documents `pft`, `dns`, `availability` for Web Probes and the Go comment references additional Cloud Path segment metrics, but neither source provides an exhaustive enumerated list of all valid `metric_name` values — *unverified, requires vendor API doc or lab test*
- **Tenant-level application inventory** — it is unverified whether the SDK can list applications that have no recent probe data (i.e., unconfigured or inactive apps) — *unverified, requires vendor doc or tenant-side check*
- **Probe metadata per application** — no SDK endpoint surfaces which probes are attached to a given application ID — *unverified, portal-only, requires vendor doc*
- **Application auto-detection** — whether ZDX automatically discovers applications or requires manual configuration in the portal is not surfaced in the SDK source — *unverified, requires vendor doc*

## Cross-links

- ZDX Score model, calculation, and score/metric trend field shapes — [`./score.md`](./score.md)
- ZDX architecture and probe types (Web + Cloud Path) — [`./overview.md`](./overview.md)
- Probes reference — [`./probes.md`](./probes.md)
- Diagnostics and alerts — [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md)
