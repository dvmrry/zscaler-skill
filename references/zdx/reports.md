---
product: zdx
topic: "zdx-reports"
title: "ZDX reports — service structure, drilldown endpoints, what's not there"
content-type: reference
last-verified: "2026-05-05"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_web_probes.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_top_process.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/geo_locations.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go"
  - "vendor/zscaler-sdk-python/zscaler/zdx/apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/users.py"
author-status: draft
---

# ZDX reports — service structure, drilldown endpoints, what's not there

The `reports/` path in the ZDX Go SDK is not a reporting or aggregation engine. It is a structural umbrella grouping three read-only subsystems: **applications**, **devices**, and **users**. All endpoints are either tenant-wide paginated lists with server-side filters, or entity-scoped drilldowns. There are no cross-cutting aggregations, rollups, or top-N queries.

This file:
1. Maps the three subsystems to the refs that document them in full.
2. Documents the endpoints not covered anywhere else: call quality metrics and top-processes drilldown.
3. States explicitly what the `reports/` service does not expose.

## Subsystem map

| Subsystem | Go path | Python class | Full documentation |
|-----------|---------|--------------|-------------------|
| applications | `reports/applications/` | `AppsAPI` | [`./applications.md`](./applications.md) |
| devices | `reports/devices/` | `DevicesAPI` | [`./devices.md`](./devices.md) |
| users | `reports/users/` | `UsersAPI` | See [Users](#users) below |

### applications/

Documented in full at [`./applications.md`](./applications.md). Entry points:

- `GetAllApps()`, `GetApp()` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:43-61`
- `GetAppScores()`, `GetAppMetrics()` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go:18-62`

Score model, datapoint field shapes, and score-trend endpoint semantics are documented at [`./score.md`](./score.md).

### devices/

Largest subsystem. Documented in full at [`./devices.md`](./devices.md):

- `GetDevice()`, `GetAllDevices()` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:68-91`
- `GetHealthMetrics()` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go:29-37`
- `GetEvents()` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:31-39`
- `GetDeviceAllApps()`, `GetDeviceApp()` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go:23-42`

Probe-related endpoints documented at [`./probes.md`](./probes.md):

- `GetAllWebProbes()`, `GetWebProbes()` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_web_probes.go:36-64`
- `GetAllCloudPathProbes()`, `GetDeviceAppCloudPathProbe()`, `GetCloudPathAppDevice()` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go:69-103`

### users/

| Method | Path | Description | Go function | Python method | Citation |
|--------|------|-------------|-------------|---------------|----------|
| GET | `/zdx/v1/users` | List all active users with nested devices, geolocations, and ZS locations | `GetAllUsers()` | `list_users()` | `users.go:56`, `users.py:34` |
| GET | `/zdx/v1/users/{user_id}` | Get single user with nested devices, geolocations, and ZS locations | `GetUser()` | `get_user()` | `users.go:45`, `users.py:119` |

#### Go `User` model

Fields on `User` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go:15-27`):

| Go field | Wire key | Type | Notes |
|----------|----------|------|-------|
| `ID` | `id` | `int` | |
| `Name` | `name` | `string` | |
| `Email` | `email` | `string` | |
| `Devices` | `devices` | `[]Devices` | Nested slice |

Fields on nested `Devices` (`users.go:22-27`):

| Go field | Wire key | Type | Notes |
|----------|----------|------|-------|
| `ID` | `id` | `int` | |
| `Name` | `name` | `string` | |
| `UserLocation` | `geo_loc` | `[]UserLocation` | Active geo location |
| `ZSLocation` | `zs_loc` | `[]ZSLocation` | Zscaler location |

Fields on `UserLocation` (`users.go:29-38`):

| Go field | Wire key | Type |
|----------|----------|------|
| `ID` | `id` | `string` |
| `City` | `city` | `string` |
| `State` | `state` | `string` |
| `Country` | `country` | `string` |
| `GeoLat` | `geo_lat` | `float32` |
| `GeoLong` | `geo_long` | `float32` |
| `GeoDetection` | `geo_detection` | `string` |

Fields on `ZSLocation` (`users.go:40-43`):

| Go field | Wire key | Type |
|----------|----------|------|
| `ID` | `id` | `int` |
| `Name` | `name` | `string` |

Pagination uses `next_offset` cursor — caller manages multi-page traversal manually. (`users.go:57-68`)

Python `UsersAPI` exposes only `list_users()` and `get_user()`. (`vendor/zscaler-sdk-python/zscaler/zdx/users.py:34`, `119`)

## New endpoints not covered in other refs

### Call quality metrics (Microsoft Teams / Zoom)

Per-device, per-app call quality drilldown. Used for video conferencing applications (Microsoft Teams via Microsoft Graph API integration, Zoom).

| Method | Path |
|--------|------|
| GET | `/zdx/v1/devices/{deviceID}/apps/{appID}/call-quality-metrics` |

Go function: `GetQualityMetrics(ctx, service, deviceID, appID int, filters common.GetFromToFilters) ([]CallQualityMetrics, *http.Response, error)` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go:25-33`)

Python method: `get_call_quality_metrics()` on `DevicesAPI` (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py`)

#### `CallQualityMetrics` model (`device_quality_metrics.go:16-21`)

| Go field | Wire key | Type | Notes |
|----------|----------|------|-------|
| `MeetID` | `meet_id` | `string` | Meeting ID |
| `MeetSessionID` | `meet_session_id` | `string` | Session ID within the meeting |
| `MeetSubject` | `meet_subject` | `string` | Meeting subject / title |
| `Metrics` | `metrics` | `[]common.Metric` | Per-meeting quality metric datapoints |

If the time range is not specified, the endpoint defaults to the last 2 hours. (`device_quality_metrics.go:23`)

### Top processes / deeptrace drilldown

Per-trace drilldown returning top-CPU and top-memory processes captured during a Diagnostics Session (deeptrace).

| Method | Path |
|--------|------|
| GET | `/zdx/v1/devices/{deviceID}/deeptraces/{traceID}/top-processes` |

Go function: `GetDeviceTopProcesses(ctx context.Context, service *zscaler.Service, deviceID int, traceID string, filters common.GetFromToFilters) ([]DeviceTopProcesses, *http.Response, error)` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_top_process.go:32-40`)

For the deeptrace lifecycle (when traceIDs are created and become available), see [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md).

#### Response models (`device_top_process.go:16-29`)

`DeviceTopProcesses` — top-level per-timestamp entry:

| Go field | Wire key | Type |
|----------|----------|------|
| `TimeStamp` | `timestamp` | `int` |
| `TopProcesses` | `top_processes` | `[]TopProcesses` |

`TopProcesses` — per-category grouping:

| Go field | Wire key | Type |
|----------|----------|------|
| `Category` | `category` | `string` |
| `Processes` | `processes` | `[]Processes` |

`Processes` — individual process entry:

| Go field | Wire key | Type |
|----------|----------|------|
| `ID` | `id` | `int` |
| `Name` | `name` | `string` |

**TraceID discovery caveat**: `GetDeviceTopProcesses()` requires a `traceID` string, but the `reports/` subsystem provides no endpoint to list or discover valid traceIDs. Callers must obtain traceIDs from the deeptrace lifecycle endpoints documented in [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md).

## What the reports service does NOT expose

The `reports/` umbrella has no:

- **Top-N queries** — no "top apps by poor score," "top users by device count," or equivalent ranked lists.
- **Department-level or location-level aggregations** — filters (`department_id`, `location_id`, `geo_id`) slice the per-entity data; the API does not aggregate or group results by those dimensions.
- **Time-bounded rollups** — no 24h summary, 7d trend, or similar pre-computed summaries. Clients receive raw datapoints and must compute their own aggregations.
- **Tenant-wide summary statistics** — no active-user count, active-device count, or affected-application count endpoints.
- **Write operations** — the entire `reports/` service is read-only. Application creation, probe configuration, and user management are performed via the ZDX Admin Portal.

## Python SDK coverage map

| Go subsystem | Python class | Notable methods | Citation |
|--------------|--------------|-----------------|----------|
| applications | `AppsAPI` | `list_apps()`, `get_app()`, `get_app_score()`, `get_app_metrics()`, `list_app_users()`, `get_app_user()` | `vendor/zscaler-sdk-python/zscaler/zdx/apps.py:30-466` |
| devices | `DevicesAPI` | `list_devices()`, `get_device()`, `get_device_apps()`, `get_device_app()`, `get_web_probes()`, `get_web_probe()`, `list_cloudpath_probes()`, `get_cloudpath_probe()`, `get_cloudpath()`, `get_call_quality_metrics()`, `get_health_metrics()`, `get_events()`, `list_geolocations()` | `vendor/zscaler-sdk-python/zscaler/zdx/devices.py:39-794` |
| users | `UsersAPI` | `list_users()`, `get_user()` | `vendor/zscaler-sdk-python/zscaler/zdx/users.py:34-170` |

**SDK divergence — app-users endpoints**: Python `AppsAPI` includes `list_app_users()` (`apps.py:319`) and `get_app_user()` for listing and retrieving users who accessed a specific application. The Go SDK `applications/` package has no equivalent functions. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go`)

## Edge cases and SDK behavior notes

**Metric dual-unmarshalling fallback**: `GetAppScores()`, `GetAppMetrics()`, and `GetWebProbes()` in Go attempt to unmarshal the response as `[]common.Metric` first; if that fails, they retry as a single `common.Metric` and wrap it in a slice. This handles an API inconsistency where some endpoint responses return a single object instead of an array. (`application_score_metrics.go:18-35`, `device_web_probes.go:36-53`)

**No auto-pagination**: Cursor pagination uses `next_offset` token. Neither Go nor Python SDK manages multi-page traversal automatically — callers must loop until `next_offset` is null. (`devices.go:79-91`, `users.go:56-68`)

**Geolocation scope**: `GetGeoLocations()` is a tenant-wide endpoint, not scoped to a device. Its path is `v1/active_geo` (relative to the ZDX base), not under `/devices/`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/geo_locations.go:11-38`)

**Device detail depth**: Go `GetAllDevices()` returns `DeviceDetail` with nested `Hardware`, `Network`, and `Software` fields in the list response. (`devices.go:15-21`, `79-91`). Python `list_devices()` returns minimal fields; full hardware/network/software detail requires a separate `get_device(device_id)` call.

## Gaps — what isn't there

1. **No per-user operational metrics**: User inventory (devices, geolocations, ZS locations) is available. Per-user score trends, per-user app metrics, and per-user device metrics are not exposed.
2. **No aggregation endpoints**: No rollups, summaries, or ranked queries of any kind.
3. **Missing Go app-users coverage**: Python exposes `list_app_users()` and `get_app_user()`; Go has no equivalent in the `applications/` package.
4. **No deeptrace listing or initiation in reports/**: The `GetDeviceTopProcesses()` endpoint requires a traceID but the `reports/` subsystem provides no way to enumerate valid traceIDs.

## Cross-links

- [`./applications.md`](./applications.md) — Application inventory and monitoring, full field tables, score/metrics endpoints
- [`./score.md`](./score.md) — ZDX score model, calculation, datapoint field shapes
- [`./devices.md`](./devices.md) — Device inventory, health metrics, events, geolocation
- [`./probes.md`](./probes.md) — Web probe and Cloud Path probe mechanics
- [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md) — Deeptrace lifecycle, traceID availability, alerts
