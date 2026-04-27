---
product: zdx
topic: zdx-sdk
title: "ZDX SDK reference — Python and Go service catalog"
content-type: reference
last-verified: 2026-04-26
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zdx/"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/"
---

# ZDX SDK reference

## Overview

The ZDX SDK wraps the Zscaler Digital Experience API (`/zdx/v1`). ZDX is primarily a **read-only** API surface: application metrics, device health, alert history, and troubleshooting session management. The platform does not expose configuration write operations (probe definitions, alert rules, application configuration) via API — those are console-driven.

The troubleshooting service is the exception: deep trace sessions and score analysis jobs can be started and deleted via the SDK.

### Client construction — Python

**Modern path (OneAPI / ZIdentity auth):**

```python
from zscaler import ZscalerClient

client = ZscalerClient(
    client_id="...",
    client_secret="...",
    vanity_domain="acme",
    cloud="zscloud",
)
metrics = client.zdx.devices.get_health_metrics("132559212")
```

`ZDXService` (`zscaler/zdx/zdx_service.py`) is instantiated inside `ZscalerClient` and delegates to a shared `RequestExecutor`. The base endpoint is `/zdx/v1`.

**Legacy path:**

`LegacyZDXClientHelper` (`zscaler/zdx/legacy.py`) handles tenants using the ZDX-specific `client_id` / `client_secret` key pair. It authenticates against `https://api.<cloud>.net` and uses HMAC-based token generation (SHA-256 of `client_id:client_secret:timestamp`). Both `client_id` and `client_secret` are required at construction; the helper raises `ValueError` if either is absent.

### Authentication specifics

ZDX uses a key/secret pair distinct from ZIA or ZPA credentials. When using OneAPI, the token must carry ZDX scopes. In the legacy path, the ZDX API uses a timestamp-signed HMAC signature rather than a static bearer token — this is unlike the ZCC portal login model. The `LegacyZDXClientHelper` manages token caching in a module-level `_token_cache` dict.

### Time range parameters (`@zdx_params`)

The `@zdx_params` decorator translates the human-readable `since` parameter (hours to look back) into the `from` / `to` Unix epoch pair the API requires. If `since` is omitted, the API defaults to the last 2 hours. The maximum look-back for alert endpoints is 14 days; other endpoints may have different limits.

All list endpoints also accept: `location_id` (list of int), `department_id` (list of int), `geo_id` (list of str), `offset` (cursor for next page), `limit` (int). ZDX uses **cursor-based** pagination: the `next_offset` token from the previous response must be passed as `offset` in the next call. When `next_offset` is null, the list is complete.

### Return convention — Python

Every method returns a three-tuple `(result, response, error)`. The raw `response` object supports client-side JMESPath filtering via `resp.search(expression)`.

### Go SDK architecture

ZDX Go services use `service.Client.NewRequestDo` (same interface as ZPA). Pagination is cursor-based via `next_offset`. There is no centralized `ReadAllPages` for ZDX — each package manages its own cursor loop. JMESPath filtering must be applied manually to ZDX results using `zscaler.ApplyJMESPathFilter` or `SearchJMESPath` after collecting all pages.

The Go common package (`vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go`) defines `GetFromToFilters` (from/to epoch, loc, dept, geo, offset, limit, metric_name) and `Metric` / `DataPoint` types used across all metric-returning endpoints.

---

## Service catalog

### `admin` — `AdminAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zdx/admin.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zdx/services/administration/`

Read-only access to ZDX administrative configuration data: departments and locations.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_departments` | `(query_params=None) -> APIResult[List[Administration]]` | GET | `/zdx/v1/administration/departments` |
| `list_locations` | `(query_params=None) -> APIResult[List[Administration]]` | GET | `/zdx/v1/administration/locations` |

**Notable behavior:**
- Both methods apply `@zdx_params` (since → from/to conversion).
- `query_params.search`: partial match on department or location name/ID.
- These endpoints are used to populate filter values (location IDs, department IDs) for other ZDX queries.

**Go parity:** ✅ `administration.GetDepartments`, `administration.GetLocations`.

---

### `alerts` — `AlertsAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zdx/alerts.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/`

Retrieves ongoing and historical alert rules, alert detail, and lists of devices affected by a given alert.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_ongoing` | `(query_params=None) -> APIResult[List[Alerts]]` | GET | `/zdx/v1/alerts/ongoing` |
| `list_historical` | `(query_params=None) -> APIResult[List[Alerts]]` | GET | `/zdx/v1/alerts/historical` |
| `get_alert` | `(alert_id: str) -> APIResult[AlertDetails]` | GET | `/zdx/v1/alerts/{alert_id}` |
| `list_affected_devices` | `(alert_id, query_params=None) -> APIResult[List[AffectedDevices]]` | GET | `/zdx/v1/alerts/{alert_id}/affected_devices` |

**Notable behavior:**
- `list_ongoing` returns alerts without an "Ended On" date. `list_historical` returns alerts that have an end date.
- Both list methods apply `@zdx_params` and accept `department_id`, `location_id`, `geo_id`, `offset`, `limit` filters.
- Cannot exceed the 14-day time range limit for alert rule queries.
- `list_ongoing` and `list_historical` wrap the entire response body in a single `Alerts(...)` object rather than iterating items — the response envelope is the list.
- `list_affected_devices` additionally accepts `location_groups`.

**Go parity:** ✅ `alerts.GetOngoingAlerts`, `alerts.GetHistoricalAlerts`, `alerts.GetAlert`, `alerts.GetAffectedDevices`.

---

### `apps` — `AppsAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zdx/apps.py`
**Go packages:** `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/`

Application-centric metrics: ZDX Score, score trends, aggregate metrics, and per-user experience within an application.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_apps` | `(query_params=None) -> APIResult[List[ActiveApplications]]` | GET | `/zdx/v1/apps` |
| `get_app` | `(app_id: str, query_params=None) -> APIResult[ApplicationScore]` | GET | `/zdx/v1/apps/{app_id}` |
| `get_app_score` | `(app_id: str, query_params=None) -> APIResult[ApplicationScoreTrend]` | GET | `/zdx/v1/apps/{app_id}/score` |
| `get_app_metrics` | `(app_id: str, query_params=None) -> APIResult[List[ApplicationMetrics]]` | GET | `/zdx/v1/apps/{app_id}/metrics` |
| `list_app_users` | `(app_id: str, query_params=None) -> APIResult[ApplicationActiveUsers]` | GET | `/zdx/v1/apps/{app_id}/users` |
| `get_app_user` | `(app_id: str, user_id: str, query_params=None) -> APIResult[ApplicationUserDetails]` | GET | `/zdx/v1/apps/{app_id}/users/{user_id}` |

**Notable behavior:**
- All methods apply `@zdx_params`; all accept `since`, `location_id`, `department_id`, `geo_id`.
- `get_app_metrics` additionally accepts `metric_name`: `"pft"` (Page Fetch Time), `"dns"` (DNS Time), or `"availability"`.
- `list_app_users` additionally accepts `score_bucket`: `"poor"` (0–33), `"okay"` (34–65), `"good"` (66–100).
- `list_app_users` returns a single `ApplicationActiveUsers` wrapper object; `list_apps` iterates individual items.
- `get_app_score` returns time-series data points (`ApplicationScoreTrend`).

**Go parity:** ✅ `applications.GetAllApps`, `applications.GetApp`. Score metrics are in `application_score_metrics` package.

---

### `devices` — `DevicesAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`
**Go packages:** `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/`

The largest service surface in ZDX. Covers per-device summary, application scores, web probes, cloudpath probes, call quality metrics, health metrics, events, and geolocation data.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_devices` | `(query_params=None) -> APIResult[Devices]` | GET | `/zdx/v1/devices` |
| `get_device` | `(device_id: str, query_params=None) -> APIResult[DeviceModelInfo]` | GET | `/zdx/v1/devices/{device_id}` |
| `get_device_apps` | `(device_id: str, query_params=None) -> APIResult[DeviceActiveApplications]` | GET | `/zdx/v1/devices/{device_id}/apps` |
| `get_device_app` | `(device_id: str, app_id: str, query_params=None) -> APIResult[DeviceAppScoreTrend]` | GET | `/zdx/v1/devices/{device_id}/apps/{app_id}` |
| `get_web_probes` | `(device_id: str, app_id: str, query_params=None) -> APIResult[List[DeviceAppWebProbes]]` | GET | `/zdx/v1/devices/{device_id}/apps/{app_id}/web-probes` |
| `get_web_probe` | `(device_id: str, app_id: str, probe_id: str, query_params=None) -> APIResult[List[DeviceWebProbePageFetch]]` | GET | `/zdx/v1/devices/{device_id}/apps/{app_id}/web-probes/{probe_id}` |
| `list_cloudpath_probes` | `(device_id: str, app_id: str, query_params=None) -> APIResult[List[DeviceAppCloudPathProbes]]` | GET | `/zdx/v1/devices/{device_id}/apps/{app_id}/cloudpath-probes` |
| `get_cloudpath_probe` | `(device_id: str, app_id: str, probe_id: str, query_params=None) -> APIResult[List[DeviceCloudPathProbesMetric]]` | GET | `/zdx/v1/devices/{device_id}/apps/{app_id}/cloudpath-probes/{probe_id}` |
| `get_cloudpath` | `(device_id: str, app_id: str, probe_id: str, query_params=None) -> APIResult[List[DeviceCloudPathProbesHopData]]` | GET | `/zdx/v1/devices/{device_id}/apps/{app_id}/cloudpath-probes/{probe_id}/cloudpath` |
| `get_call_quality_metrics` | `(device_id: str, app_id: str, query_params=None) -> APIResult[List[CallQualityMetrics]]` | GET | `/zdx/v1/devices/{device_id}/apps/{app_id}/call-quality-metrics` |
| `get_health_metrics` | `(device_id: str, query_params=None) -> APIResult[List[DeviceHealthMetrics]]` | GET | `/zdx/v1/devices/{device_id}/health-metrics` |
| `get_events` | `(device_id: str, query_params=None) -> APIResult[List[DeviceEvents]]` | GET | `/zdx/v1/devices/{device_id}/events` |
| `list_geolocations` | `(query_params=None) -> APIResult[List[DeviceActiveGeo]]` | GET | `/zdx/v1/active_geo` |

**Notable behavior:**
- `list_devices` accepts `user_ids` (list), `emails` (list), `mac_address`, `private_ipv4`, `offset` in addition to the standard time/location filters.
- `list_geolocations` accepts `parent_geo_id` and `q` (name search) in addition to standard filters.
- Probe-level methods return time-series data (page fetch times, latency readings, hop data).
- `get_events` returns device-level events: Zscaler, Hardware, Software, and Network changes.
- `get_health_metrics` covers CPU, memory, and network utilization trends.
- `get_call_quality_metrics` is relevant for UCaaS applications (Teams, Zoom, etc.) where RTP/RTCP quality metrics are collected.
- `list_devices` wraps the entire response body as a single `Devices` envelope; individual devices are accessed via its attributes.

**Go parity:** ✅ All methods have Go equivalents split across multiple files in `reports/devices/`: `devices.go`, `device_apps.go`, `device_web_probes.go`, `device_cloudpath_probes.go`, `device_quality_metrics.go`, `device_health_metrics.go`, `device_events.go`, `geo_locations.go`.

---

### `inventory` — `InventoryAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zdx/inventory.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zdx/services/inventory/`

Software inventory collection — which software versions are present across the device fleet.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_softwares` | `(query_params=None) -> APIResult[List[DeviceSoftwareInventory]]` | GET | `/zdx/v1/inventory/software` |
| `list_software_keys` | `(software_key: str, query_params=None) -> APIResult[List[DeviceSoftwareInventory]]` | GET | `/zdx/v1/inventory/software/{software_key}` |

**Notable behavior:**
- Both methods return results via a `SoftwareList` wrapper; the actual list is extracted from `software_list_wrapper.software`.
- `list_softwares` accepts: `location_id`, `department_id`, `geo_id`, `user_ids`, `device_ids` (no time range).
- `list_software_keys` looks up which users and devices have a specific software name+version key installed.
- The `software_key` is an opaque identifier (e.g., `"screencaptureui2"`), not a human-readable name.

**Go parity:** ✅ `inventory.GetAllSoftware`, `inventory.GetSoftwareKey`.

---

### `troubleshooting` — `TroubleshootingAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py`
**Go packages:** `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/`, `troubleshooting/analysis/`

The only ZDX service with write operations. Manages deep trace sessions (packet captures, network path recording) and ZDX Score analysis jobs.

**Deep trace methods:**

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_deeptraces` | `(device_id: str) -> APIResult[List[DeviceDeepTraces]]` | GET | `/zdx/v1/devices/{device_id}/deeptraces` |
| `get_deeptrace` | `(device_id: str, trace_id: str) -> APIResult[DeviceDeepTraces]` | GET | `/zdx/v1/devices/{device_id}/deeptraces/{trace_id}` |
| `start_deeptrace` | `(device_id: str, **kwargs) -> APIResult[TraceDetails]` | POST | `/zdx/v1/devices/{device_id}/deeptraces` |
| `delete_deeptrace` | `(device_id: str, trace_id: str) -> APIResult` | DELETE | `/zdx/v1/devices/{device_id}/deeptraces/{trace_id}` |
| `list_top_processes` | `(device_id: str, trace_id: str) -> APIResult[DeviceTopProcesses]` | GET | `/zdx/v1/devices/{device_id}/deeptraces/{trace_id}/top-processes` |
| `get_deeptrace_webprobe_metrics` | `(device_id: str, trace_id: str) -> APIResult[DeepTraceWebProbeMetrics]` | GET | `/zdx/v1/devices/{device_id}/deeptraces/{trace_id}/webprobe-metrics` |
| `get_deeptrace_cloudpath_metrics` | `(device_id: str, trace_id: str) -> APIResult[DeepTraceCloudPathMetric]` | GET | `/zdx/v1/devices/{device_id}/deeptraces/{trace_id}/cloudpath-metrics` |
| `get_deeptrace_cloudpath` | `(device_id: str, trace_id: str) -> APIResult[DeepTraceCloudPath]` | GET | `/zdx/v1/devices/{device_id}/deeptraces/{trace_id}/cloudpath` |
| `get_deeptrace_health_metrics` | `(device_id: str, trace_id: str) -> APIResult[DeepTraceHealthMetrics]` | GET | `/zdx/v1/devices/{device_id}/deeptraces/{trace_id}/health-metrics` |
| `get_deeptrace_events` | `(device_id: str, trace_id: str) -> APIResult[DeepTraceEvents]` | GET | `/zdx/v1/devices/{device_id}/deeptraces/{trace_id}/events` |

**Analysis methods:**

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `start_analysis` | `(**kwargs) -> APIResult[DeviceApplicationAnalysis]` | POST | `/zdx/v1/analysis` |
| `get_analysis` | `(analysis_id: str) -> APIResult` | GET | `/zdx/v1/analysis/{analysis_id}` |
| `delete_analysis` | `(analysis_id: str) -> APIResult` | DELETE | `/zdx/v1/analysis/{analysis_id}` |

**Notable behavior:**
- `start_deeptrace` kwargs: `session_name` (str), `session_length_minutes` (int; supported values: 5, 15, 30, 60; default 5), `probe_device` (bool), `web_probe_id` (str), `cloudpath_probe_id` (str), `app_id` (str).
- `delete_deeptrace` cancels the session and removes associated data.
- `start_analysis` kwargs: `device_id`, `app_id`, `t0` (int, epoch), `t1` (int, epoch). Returns a job object; status is polled via `get_analysis`.
- `get_analysis` returns a raw dict (not a model object) from `form_response_body(response.get_body())`.
- `list_deeptraces` and `list_top_processes` do not accept time-range params.

**Go parity:** ✅ `deeptrace.GetDeepTraces`, `deeptrace.StartDeepTrace`, `deeptrace.DeleteDeepTrace`, and sub-metric retrievers. Analysis in `analysis.StartAnalysis`.

---

### `users` — `UsersAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zdx/users.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/`

User-level ZDX queries. Returns active users and per-user device details.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_users` | `(query_params=None) -> APIResult[ActiveUsers]` | GET | `/zdx/v1/users` |
| `get_user` | `(user_id: str, query_params=None) -> APIResult[UserDeviceDetails]` | GET | `/zdx/v1/users/{user_id}` |

**Notable behavior:**
- `list_users` additionally accepts `exclude_loc` (list of location IDs to exclude) and `exclude_dept` (list of department IDs to exclude).
- Both methods apply `@zdx_params`.
- Both return single wrapper objects rather than item lists.

**Go parity:** ✅ `users.GetAllUsers`, `users.GetUser`.

---

### `snapshot` — `SnapshotAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py`
**Go package:** Not identified in Go SDK directory listing.

Generates a shareable, optionally obfuscated snapshot of ZDX alert data.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `share_snapshot` | `(**kwargs) -> APIResult[Snapshot]` | POST | `/zdx/v1/snapshot/alert` |

**Notable behavior:**
- `share_snapshot` kwargs: `name` (str), `alert_id` (str), `expiry` (int, hours; must be between 2 hours and 90 days), `obfuscation` (list of strings: `"USER_NAME"`, `"LOCATION"`, `"DEVICE_NAME"`, `"IP_ADDRESS"`, `"WIFI_NAME"`).
- The `expiry` value is converted from hours to Unix epoch (`current_time + hours * 3600`) inside the method before sending.
- The `@zdx_params` decorator is applied, so `expiry` is routed through `query_params` first and then extracted to the body.
- Returns a `Snapshot` object with `id`, `name`, `alert_id`, `expiry` (epoch), `obfuscation`, `url`, `status`.

**Go parity:** ❌ No equivalent found in `vendor/zscaler-sdk-go/zscaler/zdx/services/`.

---

## Per-product nuances

### Read-mostly surface

ZDX exposes no write operations for application configuration, probe configuration, alert rule configuration, or department/location definitions. All of those are managed via the ZDX console. The SDK is appropriate for monitoring integrations, dashboarding, incident investigation tooling, and automated report generation.

The only exceptions are:
- `troubleshooting.start_deeptrace` / `delete_deeptrace`
- `troubleshooting.start_analysis` / `delete_analysis`
- `snapshot.share_snapshot`

### Cursor-based pagination

ZDX does not use page/page_size offsets. Callers pass `offset` (the `next_offset` token from the previous response) in `query_params`. When `next_offset` is `null` in the response, the list is complete. The `limit` param controls batch size. There is no `ReadAllPages` helper in ZDX — callers must implement their own cursor loop.

### Time range window

All metric endpoints default to the last 2 hours when no time range is specified. The `@zdx_params` decorator converts `since` (hours) to `from`/`to` Unix epoch. Alert endpoints cap at 14 days. No stated maximum for device/app metric endpoints; in practice, large ranges may time out.

### ZDX Score

The ZDX Score is a 0–100 composite quality indicator. It is the primary metric exposed by `apps.get_app`, `apps.get_app_score`, `devices.get_device_app`, and related endpoints. Score bucket filtering (`poor`, `okay`, `good`) is available on `apps.list_app_users`.

---

## Open questions

1. `SnapshotAPI.share_snapshot` has no corresponding implementation in the Go SDK directory. Whether this endpoint exists in the Go SDK under a different path, or is Python-only, is unclear.

2. The `@zdx_params` decorator's handling of `expiry` in `share_snapshot` routes the value through `query_params` rather than the request body, then the method extracts it back into the body. This is inconsistent with how the expiry field would be sent in a direct API call, and may produce unexpected behavior if other `query_params` are also present.

3. The `get_analysis` return type is a raw dict rather than a typed model object (`DeviceApplicationAnalysis`), unlike `start_analysis`. This inconsistency means callers of `get_analysis` must know the response field names without IDE assistance.

4. ZDX cursor-based pagination requires callers to implement their own loop. The Go SDK has no centralized `ReadAllPages` for ZDX either. It is unknown whether Zscaler plans to add pagination helpers for ZDX, or whether the cursor tokens are expected to be managed by each caller.

5. `list_softwares` does not accept a time range parameter (`since`), despite applying `@zdx_params`. Whether the software inventory endpoint supports time filtering via the API is unclear.
