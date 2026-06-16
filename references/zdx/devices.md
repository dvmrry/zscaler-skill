---
product: zdx
topic: "zdx-devices"
title: "ZDX devices — inventory, health metrics, events, geolocation, API surface"
content-type: reference
last-verified: "2026-06-15"
verified-against:
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zdx/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/geo_locations.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/call_quality_metrics.py"
author-status: draft
---

# ZDX devices — inventory, health metrics, events, geolocation, API surface

Reference for the ZDX device surface: what the SDKs expose, field shapes for Python and Go, query filter parameters, health metrics, device events, geolocation handling, and SDK divergences.

Per-device application listings and per-device app score trends are documented in [`./applications.md`](./applications.md). ZDX score model and score endpoints are in [`./score.md`](./score.md). Probe mechanics are in [`./probes.md`](./probes.md).

## Device inventory model

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go`.

The device inventory is a paginated list of device metadata. Pagination uses a cursor token (`next_offset`). When `next_offset` is returned, the caller must loop manually — neither SDK auto-handles multi-page traversal. When `next_offset` becomes null the list is complete. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:69`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:81`)

**Python inventory model** (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:24-56`):
- `Devices` — top-level wrapper; fields: `next_offset` (pagination cursor, string) and `devices` (list of `DeviceDetail`)
- `DeviceDetail` — basic list item, class at line 59: `id` (str), `name` (str), `userid` (str)
- Full hardware/network/software detail is returned only by `get_device()`, which returns `DeviceModelInfo` — not `DeviceDetail`

**Go inventory model** (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:15-65`):
- `DeviceDetail` struct (lines 15-21): `ID` (int), `Name` (string), `Hardware *Hardware`, `Network []Network`, `Software *Software`
- `GetAllDevices()` unmarshals the `devices` array into `[]DeviceDetail` but wraps `next_offset` internally (line 80-83) — the caller only receives the slice, not the cursor

**Key difference**: The Python list response returns minimal `DeviceDetail` (id/name/userid only). Full hardware/network/software detail requires a separate `get_device(device_id)` call. The Go `GetAllDevices()` returns the full `DeviceDetail` struct (with hardware/network/software nested) directly in the list response. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:59-94`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:15-21`)

## Device metadata fields

Source: `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go`.

### Hardware fields

| Python attr | Go field | Wire key | Type (Py / Go) | Citation |
|-------------|----------|----------|-----------------|----------|
| `hw_model` | `HWModel` | `hw_model` | str / string | `models/devices.py:174`, `devices.go:24` |
| `hw_mfg` | `HWMFG` | `hw_mfg` | str / string | `models/devices.py:175`, `devices.go:25` |
| `hw_type` | `HWType` | `hw_type` | str / string | `models/devices.py:176`, `devices.go:26` |
| `hw_serial` | `HWSerial` | `hw_serial` | str / string | `models/devices.py:177`, `devices.go:27` |
| `tot_mem` | `TotMem` | `tot_mem` | int / int | `models/devices.py:178`, `devices.go:28` |
| `gpu` | `GPU` | `gpu` | str / string | `models/devices.py:179`, `devices.go:29` |
| `disk_size` | `DiskSize` | `disk_size` | int / int | `models/devices.py:180`, `devices.go:30` |
| `disk_model` | `DiskModel` | `disk_model` | str / string | `models/devices.py:181`, `devices.go:31` |
| `disk_type` | `DiskType` | `disk_type` | str / string | `models/devices.py:182`, `devices.go:32` |
| `cpu_mfg` | `CPUMFG` | `cpu_mfg` | str / string | `models/devices.py:183`, `devices.go:33` |
| `cpu_model` | `CPUModel` | `cpu_model` | str / string | `models/devices.py:184`, `devices.go:34` |
| `speed_ghz` | `SpeedGHZ` | `speed_ghz` | float / float32 | `models/devices.py:185`, `devices.go:35` |
| `logical_proc` | `LogicalProc` | `logical_proc` | int / int | `models/devices.py:186`, `devices.go:36` |
| `num_cores` | `NumCores` | `num_cores` | int / int | `models/devices.py:187`, `devices.go:37` |

Python class: `Hardware` in `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:159`. Go struct: `Hardware` in `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:23-38`.

### Network fields

Python models a single `Network` object per device; Go models `[]Network` (a slice), explicitly allowing multiple interfaces. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:229`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:40-55`)

| Python attr | Go field | Wire key | Type (Py / Go) | Notes | Citation |
|-------------|----------|----------|-----------------|-------|----------|
| `net_type` | `NetType` | `net_type` | str / string | Wired/wireless/cellular | `models/devices.py:244`, `devices.go:41` |
| `status` | `Status` | `status` | str / string | Connected/disconnected | `models/devices.py:245`, `devices.go:42` |
| `ipv4` | `IPv4` | `ipv4` | str / string | | `models/devices.py:246`, `devices.go:43` |
| `ipv6` | `IPv6` | `ipv6` | str / string | | `models/devices.py:247`, `devices.go:44` |
| `dns_srvs` | `DNSSRVS` | `dns_srvs` | str / string | DNS servers | `models/devices.py:248`, `devices.go:45` |
| `dns_suffix` | `DNSSuffix` | `dns_suffix` | str / string | DNS search suffix | `models/devices.py:249`, `devices.go:46` |
| `gateway` | `Gateway` | `gateway` | str / string | Default gateway | `models/devices.py:250`, `devices.go:47` |
| `mac` | `MAC` | `mac` | str / string | MAC address | `models/devices.py:251`, `devices.go:48` |
| `guid` | `GUID` | `guid` | str / string | Network interface GUID (Windows) | `models/devices.py:252`, `devices.go:49` |
| — | `WiFiAdapter` | `wifi_adapter` | — / string | Go only | `devices.go:50` |
| — | `WiFiType` | `wifi_type` | — / string | Go only | `devices.go:51` |
| — | `SSID` | `ssid` | — / string | Go only | `devices.go:52` |
| — | `Channel` | `channel` | — / string | Go only | `devices.go:53` |
| — | `BSSID` | `bssid` | — / string | Go only | `devices.go:54` |

Wi-Fi-specific fields (`wifi_adapter`, `wifi_type`, `ssid`, `channel`, `bssid`) are present in the Go `Network` struct but not exposed in the Python `Network` model.

### Software fields

| Python attr | Go field | Wire key | Type (Py / Go) | Notes | Citation |
|-------------|----------|----------|-----------------|-------|----------|
| `os_name` | `OSName` | `os_name` | str / string | Windows/macOS/Linux | `models/devices.py:299`, `devices.go:58` |
| `os_ver` | `OSVer` | `os_ver` | str / string | OS version string | `models/devices.py:300`, `devices.go:59` |
| `os_build` | — | `os_build` | str / **missing** | **Python only** — not in Go struct | `models/devices.py:301` |
| `hostname` | `Hostname` | `hostname` | str / string | | `models/devices.py:302`, `devices.go:60` |
| `netbios` | `NetBios` | `netbios` | str / string | NetBIOS name (Windows) | `models/devices.py:303`, `devices.go:61` |
| `user` | `User` | `user` | str / string | Logged-in user at sample time | `models/devices.py:304`, `devices.go:62` |
| `client_conn_ver` | `ClientConnVer` | `client_conn_ver` | str / string | Zscaler Client Connector version | `models/devices.py:305`, `devices.go:63` |
| `zdx_ver` | `ZDXVer` | `zdx_ver` | str / string | ZDX agent version | `models/devices.py:306`, `devices.go:64` |

`os_build` is present in the Python `Software` model and presumably in the API response, but the Go `Software` struct omits it — the field is silently ignored when Go unmarshals the response. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:301`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:57-64`)

### Device list identity fields

| Python attr | Go field | Wire key | Type (Py / Go) | Citation |
|-------------|----------|----------|-----------------|----------|
| `id` | `ID` | `id` | str / int | `models/devices.py:74`, `devices.go:16` |
| `name` | `Name` | `name` | str / string | `models/devices.py:75`, `devices.go:17` |
| `userid` | `UserID` | `userid` | str / int | Python list response; not a top-level field in Go `DeviceDetail` | `models/devices.py:76` |

Device `id` is typed `str` in Python and `int` in Go. Conversion is required when migrating between SDKs.

## API endpoints

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go`.

Time range defaults to the last 2 hours when no range is specified. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:51`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:78`)

Per-device application endpoints (`/devices/{id}/apps`, `/devices/{id}/apps/{appID}`) are documented in [`./applications.md`](./applications.md). The per-device Web-probe, Cloud Path-probe, and Cloud Path hop-data endpoints below are the read steps documented in detail in [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md); they are listed here so the full device surface is visible in one place.

| Method | Path | Description | Python method | Go function | Citation |
|--------|------|-------------|---------------|-------------|----------|
| GET | `/zdx/v1/devices` | List active devices with basic metadata; cursor-paginated | `list_devices()` | `GetAllDevices()` | `devices.py:48`, `devices.go:79` |
| GET | `/zdx/v1/devices/{deviceID}` | Get device with full hardware/network/software detail | `get_device(device_id)` | `GetDevice(deviceID)` | `devices.py:135`, `devices.go:68` |
| GET | `/zdx/v1/devices/{deviceID}/health-metrics` | Device CPU/memory/disk/network/Wi-Fi metric trends | `get_health_metrics(device_id)` | `GetHealthMetrics(deviceID)` | `devices.py:687`, `device_health_metrics.go:29` |
| GET | `/zdx/v1/devices/{deviceID}/events` | Device connect/disconnect/network/location/user events | `get_events(device_id)` | `GetEvents(deviceID)` | `devices.py:742`, `device_events.go:31` |
| GET | `/zdx/v1/devices/{deviceID}/apps/{appID}/call-quality-metrics` | Per-device Teams/Zoom call-quality metrics (meet ID/session/subject + metric series) | `get_call_quality_metrics(device_id, app_id)` | `GetQualityMetrics(deviceID, appID)` | `devices.py:634` (imports `CallQualityMetrics` at `devices.py:23`), `device_quality_metrics.go:25` (endpoint `call-quality-metrics` at `:13`, path at `:27`) |
| GET | `/zdx/v1/devices/{deviceID}/apps/{appID}/web-probes` | Per-device Web-probe list for a (device, app) pair | `get_web_probes(device_id, app_id)` | `GetAllWebProbes(deviceID, appID)` | `devices.py:321`, `device_web_probes.go:56` (path built at `:25`) |
| GET | `/zdx/v1/devices/{deviceID}/apps/{appID}/cloudpath-probes` | Per-device Cloud Path-probe list for a (device, app) pair | `list_cloudpath_probes(device_id, app_id)` | `GetAllCloudPathProbes(deviceID, appID)` | `devices.py:457`, `device_cloudpath_probes.go:69` (path built at `:71`) |
| GET | `/zdx/v1/devices/{deviceID}/apps/{appID}/cloudpath-probes/{probeID}/cloudpath` | Per-device Cloud Path hop-by-hop data (`DeviceCloudPathProbesHopData` → `CloudPath` → `Hops`) | (read via cloudpath-probe detail) | — | `models/devices.py:711` |
| GET | `/zdx/v1/active_geo` | Geolocation hierarchy (country → region → city → custom) | `list_geolocations()` | `GetGeoLocations()` | `devices.py:797`, `geo_locations.go:30` (endpoint `v1/active_geo` at `:11`) |

## Query filter parameters

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go`.

Python uses a `query_params` dict. Go uses `GetDevicesFilters` (embedding `common.GetFromToFilters`) for `GetAllDevices` and `common.GetFromToFilters` for the metric/event endpoints. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go:5-21`, `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go:16-31`)

| Go field | Python key | Wire key | Type | Notes | Citation |
|----------|------------|----------|------|-------|----------|
| `From` | `since` (hours, converted) | `from` | int (Unix epoch seconds) | Defaults to 2 hours ago | `common.go:18`, `devices.py:56` |
| `To` | — | `to` | int (Unix epoch seconds) | Defaults to now | `common.go:20` |
| `Loc` | `location_id` | `loc` | []int | Filter by location IDs | `common.go:21`, `devices.py:58` |
| `Dept` | `department_id` | `dept` | []int | Filter by department IDs | `common.go:22`, `devices.py:60` |
| `Geo` | `geo_id` | `geo` | []string | Filter by geolocation IDs | `common.go:23`, `devices.py:62` |
| `LocationGroups` | — | `location_groups` | []string | | `common.go:24` |
| `Offset` | `offset` | `offset` | string | Pagination cursor (next_offset value) | `common.go:26`, `devices.py:72` |
| `Limit` | — | `limit` | int | Items per page; no documented default | `types.go:20` |
| `UserIDs` | `user_ids` | `userids` | []int / []list | Filter by user IDs | `types.go:8`, `devices.py:64` |
| `Emails` | `emails` | `emails` | []string | Filter by email addresses | `types.go:10`, `devices.py:66` |
| — | `mac_address` | `mac_address` | str | Python only; singular, not a list | `devices.py:68` |
| — | `private_ipv4` | `private_ipv4` | str | Python only; no IPv6 equivalent | `devices.py:70` |

## Device-level health metrics

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go`.

The health-metrics endpoint returns time-series metric data grouped by category.

**Python model** — `DeviceHealthMetrics` (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:405`):
- `category` (string) — metric category name
- `instances` — list of `Instances` objects, each with `metrics` (list of `CommonMetrics`)

**Go model** — `HealthMetrics` and `Instances` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go:16-24`):
- `Category` (string, json: `category`)
- `Instances []Instances` (json: `instances`) — each `Instances` has `Name` (json: `metric`) and `Metrics []common.Metric`

**`common.Metric` shape** (`vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go:5-9`):
- `Metric` (string) — metric label
- `Unit` (string) — unit of measure
- `DataPoints []DataPoint` (json: `datapoints`) — time-series points

**`DataPoint` shape** (`vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go:11-14`):
- `TimeStamp` (int, Unix seconds)
- `Value` (float64)

**Categories supported** (from `device_health_metrics.go:28` docstring comment):
CPU, Memory, Disk I/O, Network I/O, Wi-Fi, Network Bandwidth

**Endpoint behavior**: defaults to last 2 hours; accepts `from`/`to` Unix epoch (Go) or `since` hour offset (Python). (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:687`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go:27`)

## Device events

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go`.

The events endpoint returns timestamped buckets of events grouped by category.

**Event categories**: the Go `GetEvents` docstring comment enumerates four (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:30`):
- Zscaler — ZCC-specific events
- Hardware — device detection changes
- Software — agent version changes
- Network — network type changes (e.g., Wi-Fi → Ethernet)

(Whether the API emits further categories such as Location or User is not enumerated in source — see Open questions.)

**Python model** — `DeviceEvents` (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:634`):
- `timestamp` (int) — bucket timestamp
- `events` (list of `Events`) — reads config key `"events"`

**Go model** — `DeviceEvents` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:16-19`):
- `TimeStamp` (int, json: `timestamp`)
- `Events []Events` (json: **`"instances"`**) — the Go JSON tag is `instances`, not `events`

This is a wire-key inconsistency: Python reads the response using key `"events"` while the Go struct serializes/deserializes the same field under key `"instances"`. Exercise caution when comparing raw JSON from both SDKs or handcrafting request/response payloads. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:650`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:18`)

**`Events` fields** (both Python and Go) — `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:668`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:21-27`:

| Python attr | Go field | Wire key | Type | Description |
|-------------|----------|----------|------|-------------|
| `category` | `Category` | `category` | string | Event category |
| `name` | `Name` | `name` | string | Event identifier (e.g., `network_change`) |
| `display_name` | `DisplayName` | `display_name` | string | Human-readable label |
| `prev` | `Prev` | `prev` | string | Previous value |
| `curr` | `Curr` | `curr` | string | Current value |

## Geolocation handling

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/geo_locations.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go`.

ZDX geolocation is categorical, not coordinate-based. The device inventory and detail APIs do not return latitude/longitude. Geolocation is expressed as a hierarchy: country → region → city → custom. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:855`)

**`DeviceActiveGeo` model** (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:855`):

| Python attr | Wire key | Type | Description | Citation |
|-------------|----------|------|-------------|----------|
| `id` | `id` | string | Geo identifier (e.g., `"0.0.us.ca"`) | `models/devices.py:855` |
| `name` | `name` | string | Display name | `models/devices.py:855` |
| `geo_type` | `geo_type` | string | `"country"` / `"region"` / `"city"` / custom | `models/devices.py:872` |
| `children` | `children` | list of `Children` | Nested geo regions | `models/devices.py:873` |

`Children` model fields (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:890`): `id`, `description` (`:906`), `geo_type` (`:907`).

**`list_geolocations()` filter parameters** (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:797`):
- `parent_geo_id` — filter children of a specific geo node (`devices.py:808`)
- `q` — search by name (`devices.py:810`)

**Go now exposes geolocation too.** As of the pinned Go SHA, the `reports/devices` package has `geo_locations.go` with a real `GetGeoLocations(filters GeoLocationFilter)` function (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/geo_locations.go:30`) hitting endpoint `v1/active_geo` (`geo_locations.go:11`). It returns `[]GeoLocation` (`id`/`name`/`geo_type`/`description`/`children`, `geo_locations.go:14-20`) — the Go-side counterpart to the Python `DeviceActiveGeo` hierarchy. The Go docstring notes state/city data is returned only for the US (`geo_locations.go:28-29`).

**`GeoLocationFilter` in Go** (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go:23`):
- `ParentGeoID` (json: `parent_geo_id`) (`types.go:26`)
- `Search` (json: `search`) (`types.go:28`)

**Geo filtering on device list**: both SDKs support `geo_id` as a filter on `list_devices()` / `GetAllDevices()` — the geolocation list API is only needed when discovering available geo IDs. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:62`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go:16`)

## SDK divergences

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go`.

| Aspect | Python | Go | Impact |
|--------|--------|----|----|
| Device ID type | `str` | `int` | Conversion needed when migrating between SDKs | `models/devices.py:74`, `devices.go:16` |
| List response shape | Minimal (`id`/`name`/`userid` only in `DeviceDetail`) | Full struct (hardware/network/software included) | Python requires a second call to `get_device()` for hardware detail | `models/devices.py:59-94`, `devices.go:15-21` |
| Network field cardinality | Single `Network` object | `[]Network` slice | Go explicitly models multiple network interfaces | `models/devices.py:229`, `devices.go:19` |
| Wi-Fi-specific fields | Not exposed in Python `Network` | `wifi_adapter`/`wifi_type`/`ssid`/`channel`/`bssid` in Go `Network` | Richer Wi-Fi metadata available only via Go | `devices.go:50-54` |
| `os_build` field | Exposed in Python `Software` | Not in Go `Software` struct | Field silently dropped during Go unmarshalling | `models/devices.py:301`, `devices.go:57-64` |
| Events wire key | Python reads `"events"` from response | Go field `Events` has JSON tag `"instances"` | JSON serialization inconsistency between SDKs | `models/devices.py:650`, `device_events.go:18` |
| `get_device_app()` return type | Returns `DeviceAppScoreTrend` (score timeseries) | `GetDeviceApp()` returns `*App` (single score value) | Same endpoint URL, incompatible return semantics | `devices.py:261`, `device_apps.go:23` |
| Time range abstraction | `since` (int, hours offset from now) | `From`/`To` (Unix epoch seconds) via `common.GetFromToFilters` | Python abstracts to hour offsets | `devices.py:56`, `common.go:18-20` |
| `mac_address` filter | Supported (singular string) | Not in `GetDevicesFilters` | Python-only filter | `devices.py:68`, `types.go:5-21` |
| `private_ipv4` filter | Supported | Not in `GetDevicesFilters` | Python-only filter; no IPv6 equivalent | `devices.py:70` |
| Geolocation list endpoint | `list_geolocations()` exposed | `GetGeoLocations()` now exposed in `reports/devices` (no longer Python-only) | Both SDKs can list geolocations; both also accept the `geo_id` filter on the device list | `devices.py:797`, `geo_locations.go:30` |
| Call-quality metrics return | `get_call_quality_metrics()` builds a list of `CallQualityMetrics` | `GetQualityMetrics()` returns `[]CallQualityMetrics` | Parity surface; per-meeting Teams/Zoom call quality | `devices.py:634`, `device_quality_metrics.go:25` |

## Edge cases and gotchas

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go`.

**Pagination is manual**: When `next_offset` is non-null, the caller must pass it back as `offset` in the next request. Neither SDK provides a built-in loop. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:72`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:81`)

**Time range defaults to last 2 hours**: If `since` or `from`/`to` are not specified, data is scoped to the previous 2 hours. Older events and metrics are not returned. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:51`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:78`)

**Network as single vs. slice**: Python wraps the API response into a single `Network` object. Go defines `Network` as a slice (`[]Network`). The actual API may return multiple interfaces; Go more faithfully models this. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:229`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:19`)

**`os_build` silently dropped in Go**: The Go `Software` struct has no `os_build` field. If the API returns this field, Go silently discards it during unmarshalling. Python surfaces it. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:301`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:57-64`)

**Events JSON tag mismatch**: The Go `DeviceEvents.Events` field serializes with JSON tag `"instances"`, not `"events"`. Python reads key `"events"` from the raw response. Handcrafted JSON or inter-SDK comparisons must account for this key difference. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:650`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:18`)

**`get_device_app()` vs `GetDeviceApp()` return semantics**: Both call `GET /zdx/v1/devices/{id}/apps/{appID}` but Python returns `DeviceAppScoreTrend` (a score timeseries) while Go returns `*App` (a single score point). These are incompatible response shapes from the same endpoint. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:261`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go:23`)

**`mac_address` filter is singular**: Python's `mac_address` filter is a single string, not a list. Behavior with multiple MAC values is not documented. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:68`)

**No `private_ipv6` filter**: `private_ipv4` filter is available in Python but there is no corresponding `private_ipv6` parameter. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:70`)

**No documented page-size default**: `GetDevicesFilters.Limit` accepts a value but no default page size is documented in either SDK. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go:20`)

**Geolocation is categorical only**: The device inventory and detail APIs return no latitude/longitude. Geolocation is expressed at country/region/city level via the `DeviceActiveGeo` hierarchy. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:855`)

## Open questions

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go`.

- **`get_device_app()` response shape discrepancy** — Python returns `DeviceAppScoreTrend` (timeseries) and Go returns `*App` (single score) from the same endpoint — it is unverified which shape matches the actual API wire response — *unverified, requires lab test or vendor API doc*. See [clarification zdx-06](../_meta/clarifications.md#zdx-06-get_device_app-live-response-shape).
- **Wi-Fi field availability in API response** — Go exposes `wifi_adapter`/`wifi_type`/`ssid`/`channel`/`bssid` in the `Network` struct but Python does not; it is unverified whether these fields are present in the API response for all device types or only wireless-capable devices — *unverified, requires vendor doc or tenant-side check*. See [clarification zdx-23](../_meta/clarifications.md#zdx-23-wi-fi-field-availability-in-device-api-response).
- **Exact metric category enumeration** — the `device_health_metrics.go:28` docstring lists CPU, Memory, Disk I/O, Network I/O, Wi-Fi, Network Bandwidth as supported categories, but this is a comment, not an enumerated type — exhaustive list unverified — *unverified, requires vendor API doc or lab test*. See [clarification zdx-24](../_meta/clarifications.md#zdx-24-device-health-metric-category-enumeration).
- **`os_build` API presence** — it is assumed `os_build` appears in the API response (since Python models it) but silently dropped by Go — unconfirmed without a raw response sample — *unverified, requires lab test*. See [clarification zdx-25](../_meta/clarifications.md#zdx-25-os_build-api-presence).
- **Geolocation hierarchy traversal** — `DeviceActiveGeo.children` holds nested `Children` objects but recursive traversal via repeated `parent_geo_id` filter calls is implied rather than stated — *unverified, requires vendor doc*. See [clarification zdx-26](../_meta/clarifications.md#zdx-26-geolocation-hierarchy-traversal).
- **Device-event category enumeration** — the Go `GetEvents` docstring comment lists only Zscaler, Hardware, Software, Network (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:30`); neither SDK model nor any vendored help capture enumerates a fixed category set, so whether the API also emits Location, User, or other event categories is unconfirmed — *unverified, requires vendor API doc or a raw response sample*. See [clarification zdx-27](../_meta/clarifications.md#zdx-27-device-event-category-enumeration).
- **Call-quality-metrics scope** — `get_call_quality_metrics` / `GetQualityMetrics` carry `meet_id` / `meet_session_id` / `meet_subject` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go:17-19`), implying meeting-app (Teams/Zoom) scope, but which applications populate this surface and which metric labels appear in the `metrics` series is not enumerated in source — *unverified, requires vendor doc or lab test*. See [clarification zdx-28](../_meta/clarifications.md#zdx-28-call-quality-metrics-application-scope-and-metric-labels).
- **Device grouping / cohorts** — not present in either SDK; may be a portal-only feature — *unverified, requires vendor doc*. See [clarification zdx-29](../_meta/clarifications.md#zdx-29-device-grouping-cohorts).

## Cross-links

- Per-device application listings and per-device app score trends — [`./applications.md`](./applications.md)
- ZDX score model, calculation, and score/metric trend field shapes — [`./score.md`](./score.md)
- Probe mechanics (Web and Cloud Path) — [`./probes.md`](./probes.md)
- Cloud architecture context (TPG, ADX) — [`./cloud-architecture.md`](./cloud-architecture.md)
