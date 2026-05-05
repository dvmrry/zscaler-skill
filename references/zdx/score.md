---
product: zdx
topic: "zdx-score"
title: "ZDX Score — model, calculation, scopes, API surface"
content-type: reasoning
last-verified: "2026-05-04"
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/about-zdx-score.md"
  - "vendor/zscaler-sdk-python/zscaler/zdx/apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/applications.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/common.py"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go"
author-status: draft
---

# ZDX Score — model, calculation, scopes, API surface

Deep reference for the ZDX Score: how it is defined, how each scope aggregates, the SDK/API surface to retrieve it, and the field shapes returned by both the Python and Go SDKs.

For the architectural overview and score bucket definitions in narrative form, see [`./overview.md`](./overview.md).

## Score model

**Scale**: 0–100. 0 is the lowest (worst) and 100 is the highest (best). (`vendor/zscaler-help/about-zdx-score.md:19`)

**Scope**: A ZDX Score represents all users in an organization, across all applications, all locations, and all cities. Depending on the time period and filters applied in the dashboard, the score adjusts accordingly. (`vendor/zscaler-help/about-zdx-score.md:17`)

**Rounding**: All scores are rounded to the nearest whole number. (`vendor/zscaler-help/about-zdx-score.md:69`)

### Score buckets

| Bucket | Range | Color |
|--------|-------|-------|
| Good | 66–100 | Green |
| Okay | 34–65 | Amber |
| Poor | 0–33 | Red |

(`vendor/zscaler-help/about-zdx-score.md:21-25`)

## Score calculation

### Primary input

The ZDX Score for applications is based primarily on the **Page Fetch Time (PFT)** of an application compared against the weighted average Page Fetch Time of peers in the same region. (`vendor/zscaler-help/about-zdx-score.md:44`)

- **Baseline**: calculated daily for each application on a rolling 7-day window, specific to each region with at least one active device. (`vendor/zscaler-help/about-zdx-score.md:44`)
- **Availability factor**: application availability also impacts the score — probe failures (when the network is down) pull the score down. (`vendor/zscaler-help/about-zdx-score.md:44`)
- The score is a single composite metric, not a weighted sum of named sub-scores. The exact numerical weighting between PFT and availability is not documented. (`vendor/zscaler-help/about-zdx-score.md:44`)

### Measurement cadence

- Zscaler Client Connector sends a probe to each application **every 5 minutes**. (`vendor/zscaler-help/about-zdx-score.md:38`)
- For each 5-minute period, measurements are given a numerical value from 0 to 100. (`vendor/zscaler-help/about-zdx-score.md:38`)
- **The lowest value within an hour becomes that hour's value.** This is the "lowest-value-wins" rollup. (`vendor/zscaler-help/about-zdx-score.md:38`)
- Baseline is recalculated daily on a rolling 7-day window per region per application. (`vendor/zscaler-help/about-zdx-score.md:44`)

**Default time window**: when no time range is specified, score endpoints default to the **last 2 hours**. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go:17`)

## Score scopes

Each scope applies the "lowest-value-wins" pattern at a different aggregation level. (`vendor/zscaler-help/about-zdx-score.md:38`)

### Application scope

1. For each user who accessed the app during the selected time period, find the **lowest value** that user experienced for the app. (`vendor/zscaler-help/about-zdx-score.md:40-42`)
2. Average those lowest-per-user values across all users.

> Example: three users accessed an application during a 24-hour period. Their lowest values are 42, 76, and 62. Application score = (42 + 76 + 62) / 3 = **60**. (`vendor/zscaler-help/about-zdx-score.md:46`)

### Department / location / city scope

1. Identify the lowest value for users accessing apps from that department, location, or city during each time interval. (`vendor/zscaler-help/about-zdx-score.md:49-53`)
2. Average those interval-level lowest-values across all intervals.
3. For a 24-hour range, the time interval is one hour; the sum is divided by **25** (24 hours + 1 for the starting score). (`vendor/zscaler-help/about-zdx-score.md:53`)

### Organization scope

1. For each time interval, find the **application with the lowest value** — that app's value is the organization's score for that interval. (`vendor/zscaler-help/about-zdx-score.md:56-60`)
2. Average across intervals (same divide-by-N+1 pattern as department/location/city). (`vendor/zscaler-help/about-zdx-score.md:60`)

### User scope

A user's ZDX Score is the **lowest application score** the user experienced during the selected time range — representing the user's poorest digital experience, not their average. (`vendor/zscaler-help/about-zdx-score.md:63-65`)

## API endpoints

All endpoints require a time-range filter; if omitted, the last 2 hours are used. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go:17`, `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go:17-20`)

| Method | Path | Description | Python method | Go function | Citation |
|--------|------|-------------|---------------|-------------|----------|
| GET | `/zdx/v1/apps` | List all active applications with ZDX score (defaults to last 2 hours) | `list_apps()` | `GetAllApps()` | `apps.py:38`, `applications.go:43` |
| GET | `/zdx/v1/apps/{app_id}` | Get application info including ZDX score, most impacted region, total users | `get_app()` | `GetApp()` | `apps.py:113`, `applications.go:53` |
| GET | `/zdx/v1/apps/{app_id}/score` | Get the ZDX score trend for a specified application | `get_app_score()` | `GetAppScores()` | `apps.py:173`, `application_score_metrics.go:18` |
| GET | `/zdx/v1/apps/{app_id}/metrics` | Get metric trend (PFT, DNS, Availability) for a specified application | `get_app_metrics()` | `GetAppMetrics()` | `apps.py:242`, `application_score_metrics.go:45` |
| GET | `/zdx/v1/devices/{device_id}/apps` | List all active applications for a device with ZDX score | `get_device_apps()` | `GetDeviceAllApps()` | `devices.py:194`, `device_apps.go:34` |
| GET | `/zdx/v1/devices/{device_id}/apps/{app_id}` | Get a single application for a device, including ZDX score trend | `get_device_app()` | `GetDeviceApp()` | `devices.py:258`, `device_apps.go:23` |
| GET | `/zdx/v1/apps/{app_id}/users` | List users and devices for an application, filterable by `score_bucket` (poor/okay/good) | `list_app_users()` | — | `apps.py:319` |

Go SDK does not expose a `list_app_users` equivalent in the reviewed source. Device-level Go equivalents exist at `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go:23,34` (`GetDeviceApp`, `GetDeviceAllApps`).

## Field tables

### Application list / score fields (`Apps` struct / `ActiveApplications` model)

Python: `vendor/zscaler-sdk-python/zscaler/zdx/models/applications.py` (the `ActiveApplications` class)
Go: `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go` (the `Apps` struct)

| Python attr | Go field | Wire key | Type | Citation |
|-------------|----------|----------|------|----------|
| `id` | `ID` | `id` | int | `models/applications.py:38`, `applications.go:16` |
| `name` | `Name` | `name` | string | `models/applications.py:39`, `applications.go:17` |
| `score` | `Score` | `score` | float (Python), float32 (Go) | `models/applications.py:40`, `applications.go:18` |
| `total_users` | `TotalUsers` | `total_users` | int | `models/applications.py:41`, `applications.go:21` |
| `most_impacted_region` | `MostImpactedRegion` | `most_impacted_region` | nested object (see below) | `models/applications.py:43-47`, `applications.go:19` |

### Most Impacted Region fields

The Python `MostImpactedRegion` model (`common.py:242`) exposes only `id` and `country`. The Go `MostImpactedRegion` struct (`applications.go:24-30`) exposes the full set of geo fields.

| Python attr | Go field | Wire key | Type | Python citation | Go citation |
|-------------|----------|----------|------|-----------------|-------------|
| `id` | `ID` | `id` | string | `common.py:257` | `applications.go:25` |
| `country` | `Country` | `country` | string | `common.py:258` | `applications.go:28` |
| — | `City` | `city` | string | not in Python model | `applications.go:26` |
| — | `Region` | `region` | string | not in Python model | `applications.go:27` |
| — | `GeoType` | `geo_type` | string | not in Python model | `applications.go:29` |

### Stats fields (application detail response)

Present in Python `ApplicationScore.stats` (`models/applications.py:105-113`) and Go `Apps.Stats` (`applications.go:32-38`).

| Python attr | Go field | Wire key | Type | Citation |
|-------------|----------|----------|------|----------|
| `active_users` | `ActiveUsers` | `active_users` | int | `models/applications.py:152`, `applications.go:33` |
| `active_devices` | `ActiveDevices` | `active_devices` | int | `models/applications.py:153`, `applications.go:34` |
| `num_poor` | `NumPoor` | `num_poor` | int | `models/applications.py:154`, `applications.go:35` |
| `num_okay` | `NumOkay` | `num_okay` | int | `models/applications.py:155`, `applications.go:36` |
| `num_good` | `NumGood` | `num_good` | int | `models/applications.py:156`, `applications.go:37` |

### Score trend / metric trend fields (`Metric` struct / `ApplicationScoreTrend` model)

Python: `models/applications.py:180` (`ApplicationScoreTrend`), `models/applications.py:220` (`ApplicationMetrics`)
Go: `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go` (`Metric` struct, line 5)

Both `get_app_score` and `get_app_metrics` return the same field shape.

| Python attr | Go field | Wire key | Type | Citation |
|-------------|----------|----------|------|----------|
| `metric` | `Metric` | `metric` | string | `models/applications.py:195`, `common.go:6` |
| `unit` | `Unit` | `unit` | string | `models/applications.py:196`, `common.go:7` |
| `datapoints` | `DataPoints` | `datapoints` | array of DataPoint | `models/applications.py:198-199`, `common.go:8` |

### DataPoint fields

| Python attr | Go field | Wire key | Type | Citation |
|-------------|----------|----------|------|----------|
| `timestamp` | `TimeStamp` | `timestamp` | int (Unix epoch seconds) | `common.py:292`, `common.go:12` |
| `value` | `Value` | `value` | float64 | `common.py:293`, `common.go:13` |

### Query filter fields (`GetFromToFilters` / `query_params`)

Go: `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go:16-31`
Python: `query_params` dict; keys documented in each method's docstring.

| Go field | Python key | Wire key | Type | Citation |
|----------|------------|----------|------|----------|
| `From` | `since` (hours) | `from` | int (Unix epoch) | `common.go:18` |
| `To` | — | `to` | int (Unix epoch) | `common.go:20` |
| `Loc` | `location_id` | `loc` | []int | `common.go:21`, `apps.py:47` |
| `Dept` | `department_id` | `dept` | []int | `common.go:22`, `apps.py:49` |
| `Geo` | `geo_id` | `geo` | []string | `common.go:23`, `apps.py:50` |
| `LocationGroups` | — | `location_groups` | []string | `common.go:24` |
| `MetricName` | `metric_name` | `metric_name` | string | `common.go:25` |
| `Offset` | — | `offset` | string | `common.go:26` |
| `Limit` | — | `limit` | int | `common.go:28` |
| `Q` | — | `q` | string (search) | `common.go:30` |

Python also exposes a `score_bucket` filter on `list_app_users()` (values: `poor`, `okay`, `good`) with no Go SDK equivalent in the reviewed source. (`apps.py:338-339`)

## SDK divergences

**Python response wrapping**: Python SDK wraps responses in model classes (`ApplicationScore`, `ApplicationScoreTrend`, `ApplicationMetrics`) that inherit from `ZscalerObject`. (`models/applications.py:76`, `models/applications.py:180`, `models/applications.py:220`)

**Go flat structs**: Go SDK returns typed structs directly (`[]Apps`, `*Apps`, `[]common.Metric`). (`applications.go:43-50`, `application_score_metrics.go:18,45`)

**Single-object list wrap in Python**: `get_app()` returns the single `ApplicationScore` object wrapped in a list — `[ApplicationScore(...)]`. (`apps.py:166`)

**Score trend return type**: Python `get_app_score()` returns `ApplicationScoreTrend`; Go `GetAppScores()` returns `[]common.Metric`. Both carry the same `metric / unit / datapoints` fields. (`apps.py:235`, `application_score_metrics.go:18`)

**Python `MostImpactedRegion` is narrower than Go**: The Python `common.MostImpactedRegion` model has only `id` and `country`; the Go `MostImpactedRegion` struct has `id`, `city`, `region`, `country`, `geo_type`. (`common.py:257-258`, `applications.go:25-29`)

**Device-level endpoints**: both SDKs expose per-device application score endpoints — Python `get_device_apps()` / `get_device_app()` (`devices.py:194`, `devices.py:258`) and Go `GetDeviceAllApps()` / `GetDeviceApp()` (`device_apps.go:34`, `device_apps.go:23`).

## Edge cases and gotchas

**Lowest-value-wins creates apparent spikes**: ZDX reports the worst case within each time window, not the average. A single bad 5-minute probe result pulls the entire hour's score down. A score jump from 90 to 40 in one hour may reflect only one poor sample, not a sustained degradation. (`vendor/zscaler-help/about-zdx-score.md:38`)

**Baseline initialization lag**: Newly-added applications have no baseline for their first week because the 7-day rolling baseline is still forming. Expect noisy or unstable scores during app onboarding. (`vendor/zscaler-help/about-zdx-score.md:44`)

**Users with no app access have no score**: A user who accessed no applications during the time range does not have a calculated score and will not appear in per-user roll-ups. This is distinct from a user with score 0. (`vendor/zscaler-help/about-zdx-score.md:63-65`)

**Region-specific baselines**: Page Fetch Time is compared against a weighted average of peers in the same region. Moving a user to a different region may shift their scores due to different regional baselines. (`vendor/zscaler-help/about-zdx-score.md:44`)

**Availability vs responsiveness**: The score reflects user-perceived performance (latency, response time), not application-side availability. A slow-but-up app scores badly for a region; a fully-down app scores low everywhere. (`vendor/zscaler-help/about-zdx-score.md:44`)

**Devices with location services off**: Devices without OS location services still report ZDX metrics but without lat/long coordinates. They appear correctly in department and city roll-ups via ZIA/ZPA configuration but may not appear on map-based dashboards. (`vendor/zscaler-help/about-zdx-score.md:44`)

## Open questions

- **Exact numerical weighting between PFT and Availability** — the docs state both are inputs but do not document the weighting formula or relative weight — *unverified, requires vendor doc or lab test*
- **Zero-value handling in the lowest-value-within-hour rollup** — unclear whether probe failures (zero or null values) are included or excluded in lowest-value selection, which materially affects how availability impacts the hourly score — *unverified, requires vendor doc or tenant-side check*
- **Metrics beyond PFT, DNS, and Availability** — the source mentions PFT as the primary input and DNS/Availability as named options for `get_app_metrics`, but does not exhaustively list all metrics that feed the score — *unverified, requires vendor doc*
- **Score recalculation lag for new users or devices** — when a new user or device comes online, how long before it appears in user/device-level scores — *unverified, requires vendor doc or lab test*
- **Geographic weighting logic** — "weighted average of peers in the same region" is stated but the region boundary definition (geolocation ID, country, city?) and the weighting function are not specified — *unverified, requires vendor doc*
- **Device-level vs user-level aggregation** — the source mentions "all users, their devices, and their locations" but does not clarify whether the score is calculated per (user, device) pair or rolled up per user across devices — *unverified, requires vendor doc*

## Cross-links

- ZDX architecture and scoring narrative — [`./overview.md`](./overview.md)
- Probes (Web + Cloud Path) — [`./probes.md`](./probes.md)
- Diagnostics Sessions and Alerts — [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md)
- ZCC entitlement (ZDX gate) — [`../zcc/entitlements.md`](../zcc/entitlements.md)
