---
product: zdx
topic: "api-schemas"
title: "ZDX API resource schemas"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/**"
author-status: draft
---

# ZDX API resource schemas

Resource-level schemas for the ZDX API, extracted from the Go SDK service layer
(`vendor/zscaler-sdk-go/zscaler/zdx/services/**`). Each struct is a Go type that
the SDK unmarshals an API response into (or, for the `troubleshooting` POST
payloads, marshals into a request body); the JSON tag is the wire field name.

Several services declare their own `Department`, `Location`, and `Geolocation`
types with different shapes. Where two services define a type with the same
name, the heading is qualified with the service in parentheses (e.g.
`Department (administration)` vs `Department (alerts)`) so heading anchors and
cross-links resolve unambiguously.

Query-parameter request structs (`GetDepartmentsFilters`, `GetLocationsFilters`,
`GetFromToFilters`, `GetSoftwareFilters`, `GetDevicesFilters`,
`GeoLocationFilter`, `GetUsersFilters`) are not resource schemas and are not
covered here — see Open questions.

## administration service

### Department (administration)

**Service:** `administration` — `vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:15`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |

### Location (administration)

**Service:** `administration` — `vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:20`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |

## alerts service

### AlertsResponse

**Service:** `alerts` — `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/alerts.go:20`

Wrapper for the ongoing/historical alert list endpoints.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Alerts | alerts | []Alert |  |  |
| NextOffset | next_offset | string |  | Pagination cursor |

### Alert

**Service:** `alerts` — `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/alerts.go:25`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| RuleName | rule_name | string | ✓ |  |
| Severity | severity | string | ✓ |  |
| AlertType | alert_type | string | ✓ |  |
| AlertStatus | alert_status | string | ✓ |  |
| NumGeolocations | num_geolocations | int | ✓ |  |
| NumDevices | num_devices | int | ✓ |  |
| StartedOn | started_on | int | ✓ | Unix epoch seconds |
| EndedOn | ended_on | int | ✓ | Unix epoch seconds |
| Application | application | Application | ✓ |  |
| Departments | departments | []Department | ✓ | alerts-service Department |
| Locations | locations | []Location | ✓ | alerts-service Location |
| Geolocations | geolocations | []Geolocation | ✓ |  |

### Application

**Service:** `alerts` — `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/alerts.go:41`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |

### Department (alerts)

**Service:** `alerts` — `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/alerts.go:46`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |
| NumDevices | num_devices | int |  |  |

### Geolocation

**Service:** `alerts` — `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/alerts.go:52`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  | String id (unlike Department/Location int ids) |
| Name | name | string |  |  |
| NumDevices | num_devices | int |  |  |

### Location (alerts)

**Service:** `alerts` — `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/alerts.go:58`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |
| NumDevices | num_devices | int |  |  |
| Groups | groups | []Group |  |  |

### Group

**Service:** `alerts` — `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/alerts.go:65`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |

### Device (alerts)

**Service:** `alerts` — `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/alerts.go:70`

Affected-device record returned by the per-alert affected-devices endpoint.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |
| UserID | userid | int |  |  |
| UserName | userName | string |  | camelCase tag |
| UserEmail | userEmail | string |  | camelCase tag |

### AffectedDevicesResponse

**Service:** `alerts` — `vendor/zscaler-sdk-go/zscaler/zdx/services/alerts/alerts.go:78`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Devices | devices | []Device |  | alerts-service Device |
| NextOffset | next_offset | string |  | Pagination cursor |

## common service

### Metric

**Service:** `common` — `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go:5`

Time-series container reused across web-probe, cloud-path, health, and
call-quality endpoints.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Metric | metric | string | ✓ |  |
| Unit | unit | string | ✓ |  |
| DataPoints | datapoints | []DataPoint |  |  |

### DataPoint

**Service:** `common` — `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go:11`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TimeStamp | timestamp | int | ✓ | Unix epoch seconds |
| Value | value | float64 | ✓ |  |

## reports/applications service

### Apps

**Service:** `reports/applications` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:15`

Per-application ZDX score record from the apps list / single-app endpoints.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Score | score | float32 |  |  |
| MostImpactedRegion | most_impacted_region | *MostImpactedRegion | ✓ | Pointer |
| Stats | stats | *Stats | ✓ | Pointer |
| TotalUsers | total_users | int | ✓ |  |

### MostImpactedRegion

**Service:** `reports/applications` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:24`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| City | city | string | ✓ |  |
| Region | region | string | ✓ |  |
| Country | country | string | ✓ |  |
| GeoType | geo_type | string | ✓ |  |

### Stats

**Service:** `reports/applications` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:32`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ActiveUsers | active_users | int |  |  |
| ActiveDevices | active_devices | int |  |  |
| NumPoor | num_poor | int |  |  |
| NumOkay | num_okay | int |  |  |
| NumGood | num_good | int |  |  |

## reports/devices service

### DeviceDetail

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:15`

Device record from the devices list / single-device endpoints.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Hardware | hardware | *Hardware | ✓ | Pointer |
| Network | network | []Network | ✓ |  |
| Software | software | *Software | ✓ | Pointer |

### Hardware

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:23`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| HWModel | hw_model | string | ✓ |  |
| HWMFG | hw_mfg | string | ✓ |  |
| HWType | hw_type | string | ✓ |  |
| HWSerial | hw_serial | string | ✓ |  |
| TotMem | tot_mem | int | ✓ |  |
| GPU | gpu | string | ✓ |  |
| DiskSize | disk_size | int | ✓ |  |
| DiskModel | disk_model | string | ✓ |  |
| DiskType | disk_type | string | ✓ |  |
| CPUMFG | cpu_mfg | string | ✓ |  |
| CPUModel | cpu_model | string | ✓ |  |
| SpeedGHZ | speed_ghz | float32 | ✓ |  |
| LogicalProc | logical_proc | int | ✓ |  |
| NumCores | num_cores | int | ✓ |  |

### Network

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:40`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| NetType | net_type | string | ✓ |  |
| Status | status | string | ✓ |  |
| IPv4 | ipv4 | string | ✓ |  |
| IPv6 | ipv6 | string | ✓ |  |
| DNSSRVS | dns_srvs | string | ✓ |  |
| DNSSuffix | dns_suffix | string | ✓ |  |
| Gateway | gateway | string | ✓ |  |
| MAC | mac | string | ✓ |  |
| GUID | guid | string | ✓ |  |
| WiFiAdapter | wifi_adapter | string | ✓ |  |
| WiFiType | wifi_type | string | ✓ |  |
| SSID | ssid | string | ✓ |  |
| Channel | channel | string | ✓ |  |
| BSSID | bssid | string | ✓ |  |

### Software

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:57`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| OSName | os_name | string | ✓ |  |
| OSVer | os_ver | string | ✓ |  |
| Hostname | hostname | string | ✓ |  |
| NetBios | netbios | string | ✓ |  |
| User | user | string | ✓ |  |
| ClientConnVer | client_conn_ver | string | ✓ |  |
| ZDXVer | zdx_ver | string | ✓ |  |

### App (reports/devices)

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go:16`

Per-device application score record.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Score | score | float32 | ✓ |  |

### DeviceWebProbe

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_web_probes.go:16`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| NumProbes | num_probes | int | ✓ |  |
| AvgScore | avg_score | float32 | ✓ |  |
| AvgPFT | avg_pft | float32 | ✓ | Page Fetch Time |

### DeviceCloudPathProbe

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go:17`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| NumProbes | num_probes | int | ✓ |  |
| AverageLatency | avg_latencies | []AverageLatency | ✓ |  |

### AverageLatency

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go:24`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| LegSRC | leg_src | string | ✓ |  |
| LegDst | leg_dst | string | ✓ |  |
| Latency | latency | float32 | ✓ |  |

### NetworkStats

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go:31`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| LegSRC | leg_src | string | ✓ |  |
| LegDst | leg_dst | string | ✓ |  |
| Stats | stats | []common.Metric | ✓ |  |

### CloudPathProbe

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go:38`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TimeStamp | timestamp | int | ✓ | Unix epoch seconds |
| CloudPath | cloudpath | []CloudPath | ✓ |  |

### CloudPath

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go:43`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SRC | src | string | ✓ |  |
| DST | dst | string | ✓ |  |
| NumHops | num_hops | int | ✓ |  |
| Latency | latency | float32 | ✓ |  |
| Loss | loss | float32 | ✓ |  |
| NumUnrespHops | num_unresp_hops | int | ✓ |  |
| TunnelType | tunnel_type | int | ✓ |  |
| Hops | hops | []Hops | ✓ |  |

### Hops

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go:54`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| IP | ip | string | ✓ |  |
| GWMac | gw_mac | string | ✓ |  |
| GWMacVendor | gw_mac_vendor | string | ✓ |  |
| PktSent | pkt_sent | int | ✓ |  |
| PktRcvd | pkt_rcvd | int | ✓ |  |
| LatencyMin | latency_min | int | ✓ |  |
| LatencyMax | latency_max | int | ✓ |  |
| LatencyAvg | latency_avg | int | ✓ |  |
| LatencyDiff | latency_diff | int | ✓ |  |

### HealthMetrics

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go:16`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Category | category | string | ✓ |  |
| Instances | instances | []Instances | ✓ |  |

### Instances

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go:21`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | metric | string | ✓ | Go field `Name`, JSON tag `metric` |
| Metrics | metrics | []common.Metric | ✓ |  |

### CallQualityMetrics

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go:16`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| MeetID | meet_id | string | ✓ |  |
| MeetSessionID | meet_session_id | string | ✓ |  |
| MeetSubject | meet_subject | string | ✓ |  |
| Metrics | metrics | []common.Metric | ✓ |  |

### DeviceTopProcesses

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_top_process.go:16`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TimeStamp | timestamp | int | ✓ | Unix epoch seconds |
| TopProcesses | top_processes | []TopProcesses | ✓ |  |

### TopProcesses

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_top_process.go:21`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Category | category | string | ✓ |  |
| Processes | processes | []Processes | ✓ |  |

### Processes

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_top_process.go:26`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

### DeviceEvents

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:16`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TimeStamp | timestamp | int | ✓ | Unix epoch seconds |
| Events | instances | []Events | ✓ | Go field `Events`, JSON tag `instances` |

### Events

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:21`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Category | category | string | ✓ |  |
| Name | name | string | ✓ |  |
| DisplayName | display_name | string | ✓ |  |
| Prev | prev | string | ✓ |  |
| Curr | curr | string | ✓ |  |

### GeoLocation (reports/devices)

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/geo_locations.go:14`

Active-geolocation tree from the active_geo endpoint.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Name | name | string | ✓ |  |
| GeoType | geo_type | string | ✓ |  |
| Description | description | string | ✓ |  |
| Children | children | []Children | ✓ |  |

### Children

**Service:** `reports/devices` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/geo_locations.go:22`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Description | description | string | ✓ |  |
| GeoType | geo_type | string | ✓ |  |

## reports/users service

### User

**Service:** `reports/users` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go:15`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Email | email | string | ✓ |  |
| Devices | devices | []Devices | ✓ |  |

### Devices

**Service:** `reports/users` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go:22`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| UserLocation | geo_loc | []UserLocation | ✓ | Go field `UserLocation`, JSON tag `geo_loc` |
| ZSLocation | zs_loc | []ZSLocation | ✓ |  |

### UserLocation

**Service:** `reports/users` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go:29`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| City | city | string | ✓ |  |
| State | state | string | ✓ |  |
| Country | country | string | ✓ |  |
| GeoLat | geo_lat | float32 | ✓ |  |
| GeoLong | geo_long | float32 | ✓ |  |
| GeoDetection | geo_detection | string | ✓ |  |

### ZSLocation

**Service:** `reports/users` — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go:39`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |

## inventory service

### SoftwareOverviewResponse

**Service:** `inventory` — `vendor/zscaler-sdk-go/zscaler/zdx/services/inventory/inventory.go:16`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Software | software | []SoftwareOverview |  |  |
| NextOffset | next_offset | string | ✓ | Pagination cursor |

### SoftwareKeyResponse

**Service:** `inventory` — `vendor/zscaler-sdk-go/zscaler/zdx/services/inventory/inventory.go:21`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Software | software | []SoftwareUserList |  |  |
| NextOffset | next_offset | string | ✓ | Pagination cursor |

### SoftwareOverview

**Service:** `inventory` — `vendor/zscaler-sdk-go/zscaler/zdx/services/inventory/inventory.go:26`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SoftwareKey | software_key | string | ✓ |  |
| SoftwareName | software_name | string | ✓ |  |
| Vendor | vendor | string | ✓ |  |
| SoftwareGroup | software_group | string | ✓ |  |
| SoftwareInstallType | sw_install_type | string | ✓ |  |
| UserTotal | user_total | int | ✓ |  |
| DeviceTotal | device_total | int | ✓ |  |

### SoftwareUserList

**Service:** `inventory` — `vendor/zscaler-sdk-go/zscaler/zdx/services/inventory/inventory.go:36`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SoftwareKey | software_key | string | ✓ |  |
| SoftwareName | software_name | string | ✓ |  |
| SoftwareVersion | software_version | string | ✓ |  |
| SoftwareGroup | software_group | string | ✓ |  |
| OS | os | string | ✓ |  |
| Vendor | vendor | string | ✓ |  |
| UserID | user_id | int | ✓ |  |
| DeviceID | device_id | int | ✓ |  |
| Hostname | hostname | string | ✓ |  |
| Username | username | string | ✓ |  |
| InstallDate | install_date | string | ✓ |  |

## troubleshooting service

### DeepTraceSession

**Service:** `troubleshooting/deeptrace` — `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:15`

Deep-trace session record (GET / POST response).

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TraceID | trace_id | string |  |  |
| TraceDetails | trace_details | TraceDetails | ✓ |  |
| Status | status | string | ✓ |  |
| CreatedAt | created_at | int | ✓ | Unix epoch seconds |
| StartedAt | started_at | int | ✓ | Unix epoch seconds |
| EndedAt | ended_at | int | ✓ | Unix epoch seconds |
| ExpectedTimeMinutes | expected_time_minutes | int | ✓ |  |

### TraceDetails

**Service:** `troubleshooting/deeptrace` — `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:25`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SessionName | session_name | string |  |  |
| AppID | app_id | string |  | String id (note: payload AppID is int) |
| AppName | app_name | string |  |  |
| UserID | user_id | string | ✓ |  |
| Username | username | string | ✓ |  |
| DeviceID | device_id | string | ✓ |  |
| DeviceName | device_name | string | ✓ |  |
| WebProbeID | web_probe_id | string | ✓ |  |
| WebProbeName | web_probe_name | string | ✓ |  |
| CloudPathProbeID | cloudpath_probe_id | string | ✓ |  |
| CloudPathProbeName | cloud_path_name | string | ✓ | JSON tag is `cloud_path_name` |
| SessionLength | session_length | int | ✓ |  |
| ProbeDevice | probe_device | bool | ✓ |  |

### DeepTraceSessionPayload

**Service:** `troubleshooting/deeptrace` — `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:41`

Request body for creating a deep-trace session (POST). All fields are sent
(no `omitempty`).

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SessionName | session_name | string |  |  |
| AppID | app_id | int |  | int here (response TraceDetails.AppID is string) |
| WebProbeID | web_probe_id | int |  |  |
| CloudPathProbeID | cloud_path_probe_id | int |  |  |
| SessionLengthMinutes | session_length_minutes | int |  |  |
| ProbeDevice | probe_device | bool |  |  |

### AnalysisRequest

**Service:** `troubleshooting/analysis` — `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/analysis/analysis.go:15`

Request body for creating an analysis (POST).

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DeviceID | device_id | int |  |  |
| AppID | app_id | int |  |  |
| T0 | t0 | int |  | Unix epoch seconds (range start) |
| T1 | t1 | int |  | Unix epoch seconds (range end) |

### AnalysisResult

**Service:** `troubleshooting/analysis` — `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/analysis/analysis.go:22`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ErrMsg | err_msg | string |  |  |
| Result | result | Result |  |  |

### Result

**Service:** `troubleshooting/analysis` — `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/analysis/analysis.go:27`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Issue | issue | string |  |  |
| Confidence | confidence | int |  |  |
| Message | message | string |  |  |
| Times | times | []int |  | Unix epoch seconds |

## Open questions

- Query-parameter request structs are out of scope for this resource-schema
  doc and are not documented here: `GetDepartmentsFilters` /
  `GetLocationsFilters` (administration.go:25,31), `GetFromToFilters`
  (common.go:16), `GetSoftwareFilters` (inventory/types.go:5),
  `GetDevicesFilters` / `GeoLocationFilter` (reports/devices/types.go:5,23),
  and `GetUsersFilters` (reports/users/types.go:5). These describe the query
  parameters each endpoint accepts (from/to/loc/dept/geo/limit/offset/q, etc.)
  rather than response shapes. Decide whether they belong in an endpoint/
  query-parameter reference instead, then link the two docs.
- The `Optional` column reflects the presence of the Go `,omitempty` JSON tag
  option, which controls only marshal-time omission on the SDK side. It is not
  a statement that the ZDX API itself never returns the field, nor that the
  field is optional in a request. The alerts-service `Department`/`Location`/
  `Geolocation`/`Group`/`Device` structs have no `omitempty` on any field; the
  administration-service `Department`/`Location` mark only `Name` as
  `omitempty`. Whether the live API actually omits these fields is unverified
  against captured responses.
