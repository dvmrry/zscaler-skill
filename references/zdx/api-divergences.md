---
product: zdx
topic: "api-divergences"
title: "ZDX API source divergences"
content-type: reference
source-tier: code
confidence: medium
last-verified: "2026-06-15"
verified-against:
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
sources:
  - "vendor/zscaler-sdk-python/zscaler/zdx/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/admin.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/common.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/call_quality_metrics.py"
  - "vendor/zscaler-sdk-go/zscaler/zdx/v2_config.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/inventory/inventory.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go"
  - "vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md"
author-status: draft
---

# ZDX API source divergences

ZDX is described by three independent views, each maintained on its own cadence: the **Python SDK** (`vendor/zscaler-sdk-python/zscaler/zdx/`), the **Go SDK** (`vendor/zscaler-sdk-go/zscaler/zdx/`), and the **help-site API reference** (`vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md`). Where they agree, confidence is high. Where they diverge, an engineer needs to know which one to trust before writing code — and the answer changes by transport, header, field, and endpoint.

This doc consolidates the cross-source disagreements that were previously scattered across [`api.md`](./api.md), [`devices.md`](./devices.md), [`diagnostics-and-alerts.md`](./diagnostics-and-alerts.md), [`reports.md`](./reports.md), [`score.md`](./score.md), and [`sdk.md`](./sdk.md). The transport / header / limiter cluster (the highest-value disagreements, because the two SDKs and the help site genuinely contradict each other on host, auth path, and rate-limit semantics) is written out in full below. The per-resource Python-vs-Go field divergences are summarized here with source citations; where a sibling doc already carries the operational walk-through, this doc links to it rather than duplicating.

**Quick trust hierarchy (applies unless an entry below overrides it):**

- For wire field names and types: trust the SDK that matches the transport you are actually using (the two SDKs hit *different hosts* — see the transport entry).
- The Go and Python SDKs both target the **direct ZDX cloud host** (`api.zdxcloud.net`); the help reference documents the **OneAPI gateway host** (`api.zsapi.net`). They are two real, separate entry points with different path prefixes — neither is wrong.
- ZDX IDs are typed inconsistently *within* each SDK and *between* them. Do not assume an ID's declared type is the wire type; the wire form for the deeptrace start payload is integer in both SDKs.

---

## Transport, auth, and rate limits

This is the cluster where the three sources most directly contradict one another. Two different hosts, two different auth path prefixes, two different rate-limit header families, and a hardcoded client-side limiter that does not match the documented server model.

### Token transport — two hosts (`api.zdxcloud.net` vs `api.zsapi.net`)

**What each source says:**

- **Python SDK (legacy):** builds the base host as `https://api.{cloud}.net` with `cloud` defaulting to `zdxcloud`, then posts the token request to `{self.url}/v1/oauth/token` — i.e. `https://api.zdxcloud.net/v1/oauth/token`. (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:55`, `:57`, `:173`)
- **Go SDK:** default `rawBaseURL = "https://api.zdxcloud.net"` (or `https://api.%s.net` for a user-specified cloud), and the token URL is `cfg.BaseURL.String() + "/v1/oauth/token"` — i.e. `https://api.zdxcloud.net/v1/oauth/token`. (`vendor/zscaler-sdk-go/zscaler/zdx/v2_config.go:150-152`, `vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:234`)
- **Help-site reference:** documents the token endpoint as the OneAPI gateway `POST https://api.zsapi.net/zdx/v1/oauth/token`, with the data base URL `https://api.zsapi.net/zdx/v1`. (`vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md:10`, `:16`)

**Significance / which to trust:** Both are live. The direct cloud host (`api.zdxcloud.net`) is what both vendored SDKs use today; the OneAPI gateway host (`api.zsapi.net`) is the front-door form the help site documents and is also the host the [`../shared/oneapi.md`](../shared/oneapi.md) ZDX-legacy row records. A hand-built client must pick a host and stay on it — the auth path prefix differs by host (next entry).

---

### Auth-vs-data path prefix asymmetry on the direct host

**What each source says:**

- **Go SDK (direct host):** the token path has **no** `/zdx` segment — `/v1/oauth/token` (`vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:234`). The data endpoint constants, by contrast, all carry the `/zdx` prefix: `appsEndpoint = "/zdx/v1/apps"` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:12`), `devicesEndpoint = "/zdx/v1/devices"` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:12`), `softwareEndpoint = "/zdx/v1/inventory/software"` (`vendor/zscaler-sdk-go/zscaler/zdx/services/inventory/inventory.go:12`).
- **Help-site reference (OneAPI host):** auth is at `https://api.zsapi.net/zdx/v1/oauth/token` — the auth path **does** carry `/zdx/v1`. (`vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md:16`)

**Significance / which to trust:** On the direct cloud host the SDKs use, authenticate at `/v1/oauth/*` (no `/zdx`) but call data at `/zdx/v1/*`. On the OneAPI gateway host the help site documents, both auth and data live under `/zdx/v1/*`. The prefix is not optional and not uniform across the host you choose — copy it from the host-matched source, not from the other host's examples.

---

### Rate-limit response headers — `X-Ratelimit-*-Second` (SDKs) vs `RateLimit-*` (help)

**What each source says:**

- **Python SDK:** reads `X-Ratelimit-Remaining-Second` and `X-Ratelimit-Limit-Second` from the response to drive proactive backoff. (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:97-98`)
- **Go SDK:** reads the same two headers, `X-Ratelimit-Remaining-Second` and `X-Ratelimit-Limit-Second`. (`vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:167-168`)
- **Help-site reference:** documents the rate-limit response headers as `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`. (`vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md:103`)

**Significance / which to trust:** A hand-built client that reads `RateLimit-Remaining` (the help name) against the direct cloud host the SDKs target may find it absent and silently lose its backoff signal — both SDKs read the `X-Ratelimit-*-Second` family. Conversely, code calling the OneAPI gateway should expect the `RateLimit-*` family. The header family is host-coupled, same as the path prefix. [`api.md § Rate limits`](./api.md) and [`../shared/oneapi.md § ZDX — tier-based by license count`](../shared/oneapi.md) document the `RateLimit-*` (gateway) form; this entry records the `X-Ratelimit-*-Second` form the SDKs actually parse.

---

### Go client-side limiter is hardcoded, not tier-by-license

**What each source says:**

- **Go SDK:** initializes a single global rate limiter at a fixed **100 requests / 60 seconds** with a **5-second** additional delay, regardless of tenant: `globalLimiter := rl.NewGlobalRateLimiter(100, 60)` and `AdditionalDelay: 5 * time.Second`. (`vendor/zscaler-sdk-go/zscaler/zdx/v2_config.go:314`, `:322`)
- **Server model (help-site / shared doc):** ZDX rate limits are **tiered by license count** — per-second/minute/hour/day caps that scale across four tiers (e.g. 30/min at tier 1 up to 180/min at tier 4). (`vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md:98-101`; tabulated in [`../shared/oneapi.md § ZDX — tier-based by license count`](../shared/oneapi.md))

**Significance / which to trust:** The Go SDK's client-side throttle is a conservative fixed ceiling, not a reflection of the tenant's actual server-side allowance. A large-license tenant (higher tier) is more permissively limited server-side than the Go client self-throttles to; a low-tier tenant could in principle exceed its per-minute server cap if the hardcoded 100/60s is more generous than its tier — the limiter is a static guard, not a tier-aware one. Trust the server tier table for the real budget; treat the Go limiter as a floor.

---

## Deeptrace (troubleshooting) divergences

The deeptrace start-payload and the Python-vs-Go package-shape divergences are written out in full, with the required pre-call read chain, in [`diagnostics-and-alerts.md § Python-vs-Go SDK divergences on the deeptrace path`](./diagnostics-and-alerts.md) and the Go-parity notes in [`sdk.md § troubleshooting`](./sdk.md). The headline disagreements, with citations:

### Cloudpath probe ID wire key — `cloud_path_probe_id` (Go start payload) vs `cloudpath_probe_id` (Python)

**What each source says:**

- **Go SDK:** the **start payload** struct `DeepTraceSessionPayload.CloudPathProbeID` serializes as JSON `cloud_path_probe_id` — with an underscore between `cloud` and `path`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:45`)
- **Python path:** the start body is assembled from `**kwargs` (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:182`), and the accepted keyword is documented as `cloudpath_probe_id` — no underscore between `cloud` and `path`. (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:154`)
- **Go SDK (response/list struct):** note the *response* struct `TraceDetails.CloudPathProbeID` (embedded in `DeepTraceSession.TraceDetails`) uses `cloudpath_probe_id` (no underscore) — so Go itself is internally inconsistent: request key `cloud_path_probe_id`, response key `cloudpath_probe_id`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:35`)

**Significance / which to trust:** Highest-impact divergence for anyone hand-building the POST body. The two SDKs send different keys for the same field, and the Go request/response keys disagree with each other. See the corroboration note in [`diagnostics-and-alerts.md § Open questions`](./diagnostics-and-alerts.md) (no test asserts the start-payload serialization; the key is confirmed by the struct tag).

### `session_length` request-vs-response key

**What each source says:**

- **Both SDKs (start payload):** use `session_length_minutes`. (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:155`; `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:46`)
- **Go SDK (response struct):** the `DeepTraceSession` response field uses `session_length`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:37`)

**Significance / which to trust:** Send `session_length_minutes`; read `session_length` back from the Go response shape. Whether request and response deliberately use different keys is tracked as unverified in [`diagnostics-and-alerts.md § Open questions`](./diagnostics-and-alerts.md).

### Package shape — Go deeptrace package has only 4 lifecycle funcs; 5 sub-metric endpoints are Python-only

**What each source says:**

- **Go SDK:** the `troubleshooting/deeptrace` package exposes exactly four funcs — `GetDeepTraces`, `GetDeepTraceSession`, `CreateDeepTraceSession`, `DeleteDeepTraceSession`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:50`, `:60`, `:69`, `:79`)
- **Python SDK:** additionally exposes five deeptrace sub-metric retrievers (`get_deeptrace_webprobe_metrics`, `get_deeptrace_cloudpath_metrics`, `get_deeptrace_cloudpath`, `get_deeptrace_health_metrics`, `get_deeptrace_events`) with no Go `deeptrace`-package equivalent. `list_top_processes` is reachable in Go only via a *different* package — `reports/devices.GetDeviceTopProcesses`, which builds the `.../deeptraces/{trace_id}/top-processes` path. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_top_process.go:32`, `:34`)
- **Function naming:** Go uses `Create*`/`Delete*Session` where Python uses `start_`/`delete_deeptrace`; Go `CreateAnalysis` where Python uses `start_analysis`. There is no `StartDeepTrace`/`StartAnalysis` in Go.

**Significance / which to trust:** A Go-only integration cannot retrieve the five deeptrace sub-metrics from the `deeptrace` package; it must either hand-build those `/deeptraces/{trace_id}/...` paths or fall back to the report-path equivalents (which are scoped by `app_id`/`device_id`, not by `trace_id`, so they are not drop-in substitutes). Full Go-parity table in [`sdk.md § troubleshooting`](./sdk.md).

### `device_id` typing on the deeptrace path — Go `int` (deeptrace) vs Go `string` (reports/devices) vs Python `str`

**What each source says:**

- **Go SDK (deeptrace):** `CreateDeepTraceSession` / `GetDeepTraces` / `DeleteDeepTraceSession` take `deviceID int` and format the path with `%d`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:50`, `:69`, `:79`)
- **Go SDK (reports/devices):** `GetDevice` / `GetDeviceApp` take `deviceID string`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:68`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go:23`)
- **Python SDK:** `start_deeptrace` / `delete_deeptrace` take `device_id` as `str`. (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:143`, `:203`)

**Significance / which to trust:** Same device-ID URL segment, three different declared types — and the Go inconsistency is *internal* (deeptrace package wants `int`, reports/devices wants `string`). Callers passing a device ID between the two Go packages must convert. The wire form is the same numeric path segment regardless.

### `since` (hours) vs precomputed epoch `from`/`to`

**What each source says:**

- **Python SDK:** metric/probe methods take `since` in hours via the `@zdx_params` decorator, which converts to epoch `from`/`to` query params. (`vendor/zscaler-sdk-python/zscaler/utils.py:424-429`)
- **Go SDK:** takes a `common.GetFromToFilters` struct whose `From`/`To` are `int` Unix-epoch seconds — the caller pre-computes epoch, no hours shorthand. (`vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go:16-20`)

**Significance / which to trust:** Same on-wire `from`/`to` epoch contract; only the SDK ergonomics differ. Pure ergonomics, not a wire disagreement — recorded here so cross-SDK readers stop hunting for a Go `since`.

---

## Device model divergences

The full device-field walk-through (Wi-Fi-only fields, `os_build`, etc.) is in [`devices.md`](./devices.md). Cross-source disagreements, with citations:

### Device events JSON tag — Go `instances` vs Python `events`

**What each source says:**

- **Go SDK:** `DeviceEvents.Events` carries json tag `instances`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:18`)
- **Python SDK:** reads the response key `events`. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:650`)

**Significance / which to trust:** The two SDKs deserialize the device-events list from a *different* JSON key. At most one can match the live wire key; the other relies on the API returning both, or silently produces an empty list. Verify the actual response key against a live tenant before hand-parsing.

### `os_build` — present in Python Software model, absent from Go

**What each source says:**

- **Python SDK:** `Software` model reads `os_build`. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:301`)
- **Go SDK:** the `Software` struct has no `os_build` field (only `os_name`, `os_ver`, `hostname`, `netbios`, `user`, `client_conn_ver`, `zdx_ver`). (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:57-65`)

**Significance / which to trust:** Go silently drops `os_build`. If the OS build string matters (patch-level compliance), read it via the Python SDK or the raw response.

### `Network` cardinality — both SDKs model a collection (parity, not a divergence)

**What each source says:**

- **Python SDK:** `DeviceModelInfo.network` is a *list* of `Network` objects, built via `ZscalerCollection.form_list(config["network"] if "network" in config else [], Network)`. (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:115`)
- **Go SDK:** `DeviceDetail.Network` is `[]Network` (a slice). (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:19`, fields at `:40-55`)

**Significance / which to trust:** A multi-homed device (Wi-Fi + Ethernet, or a VPN adapter) exposes multiple network records, and **both** SDKs surface all of them — Python as a list, Go as a slice. An earlier note in this doc claimed the Python model collapsed this to a single object; that is **not** correct against current source (`models/devices.py:229` is merely the `Network` *class* definition, not a single-valued field on the device detail). No cardinality divergence here.

### Wi-Fi fields — Go-only

**What each source says:**

- **Go SDK:** the `Network` struct carries `wifi_adapter`, `wifi_type`, `ssid`, `channel`, `bssid`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:50-54`)
- **Python SDK:** the `Network` model does not surface these Wi-Fi fields.

**Significance / which to trust:** Wi-Fi diagnostics (SSID/BSSID/channel) are available only through the Go SDK's network shape. A Python-based Wi-Fi-root-cause workflow must read the raw response.

### `get_device_app` return shape — Python timeseries vs Go single object

**What each source says:**

- **Python SDK:** `get_device_app` returns a `DeviceAppScoreTrend` — a metric/datapoints timeseries. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:314`)
- **Go SDK:** `GetDeviceApp` returns `*App` — a single `{id, name, score}` record. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go:16-31`)

**Significance / which to trust:** Same GET `.../apps/{appID}` endpoint, two genuinely different response shapes between SDKs. A caller expecting a score *trend* from the Go SDK gets a single point; a caller expecting a single point from Python gets a series. Verify which the live endpoint returns before relying on either; do not assume cross-SDK parity here.

### Device-list filters — `mac_address` / `private_ipv4` are Python-only

**What each source says:**

- **Python SDK:** `list_devices` accepts `mac_address` and `private_ipv4` filters. (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:68`, `:70`)
- **Go SDK:** `GetDevicesFilters` (used by `GetAllDevices`) carries `UserIDs`, `Emails`, `Loc`, `Dept`, `Geo`, `Offset`, `Limit` — but no `mac_address` and no `private_ipv4`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go:5-21`)

**Significance / which to trust:** Filtering the device list by MAC or private IPv4 is only possible through the Python SDK. No `private_ipv6` filter exists in either SDK. The Go SDK caller must list and filter client-side.

> **Note on geolocations:** an earlier audit note suggested the geolocation *list* endpoint was Python-only. That is **not** correct against current Go source — Go ships both a `GeoLocationFilter` type (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/types.go:23`) **and** a `GetGeoLocations` list function (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/geo_locations.go:30`). The only nuance is the search-key name (Go `parent_geo_id`/`search`; Python `parent_geo_id`/`q`). Both SDKs ship the endpoint — no divergence on availability.

---

## Application and metrics divergences

The applications surface is documented in [`applications.md`](./applications.md) and [`score.md`](./score.md). Cross-source disagreements:

### `MostImpactedRegion` field width — Go wider than Python

**What each source says:**

- **Go SDK:** `MostImpactedRegion` carries `id`, `city`, `region`, `country`, `geo_type`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:24-30`)
- **Python SDK:** the `MostImpactedRegion` model carries only `id` and `country`. (`vendor/zscaler-sdk-python/zscaler/zdx/models/common.py:258-259`)

**Significance / which to trust:** Python silently drops `city`, `region`, and `geo_type` from the most-impacted-region object. For geographic drilldown on an app's impact, the Go shape is richer. (Python *does* model the wider 5-field set on a separate class, `MostImpactedGeos` at `vendor/zscaler-sdk-python/zscaler/zdx/models/common.py:188` — but that is a different object than `MostImpactedRegion`.)

### `get_app_metrics` metric_name set — Python docstring narrower than Go

**What each source says:**

- **Python SDK:** the `get_app_metrics` docstring lists only `pft` (Page Fetch Time), `dns` (DNS Time), and `availability`. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:257-260`)
- **Go SDK:** the `GetAppMetrics` doc-comment documents Server Response Time in addition to PFT/DNS/Availability for Web Probes, plus the full CloudPath latency set (End to End, Client–Egress, Egress–Application, ZIA Service Edge–Egress, ZIA Service Edge–Application). (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go:38-41`)

**Significance / which to trust:** The Python docstring is an incomplete enumeration, not an API restriction — Go documents the broader, more accurate metric set. A Python caller can still pass the additional `metric_name` values as raw strings; the docstring just doesn't list them.

### App-users endpoints — Python-only

**What each source says:**

- **Python SDK:** `list_app_users` (GET `/apps/{app_id}/users`) and `get_app_user` (GET `/apps/{app_id}/users/{user_id}`). (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:316`, `:374`, `:399`, `:440`)
- **Go SDK:** the `reports/applications` package has no app-users function.

**Significance / which to trust:** Per-app user listing and per-(app, user) drilldown are Python-only. A Go integration must reach the same data via the device/users surfaces, not the apps surface.

### `CallQualityMetrics.metrics` typing — Python `list[str]` vs Go `[]Metric`

**What each source says:**

- **Python SDK:** `CallQualityMetrics.metrics` is a list of strings. (`vendor/zscaler-sdk-python/zscaler/zdx/models/call_quality_metrics.py:41`)
- **Go SDK:** `CallQualityMetrics.Metrics` is `[]common.Metric` (structured metric objects). (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go:20`)

**Significance / which to trust:** Same call-quality endpoint, structurally different `metrics` shape between SDKs. The Go shape carries structured metric objects; the Python shape carries bare strings. Verify the live response shape before relying on either typing.

### `GetApp` appID is a string path param despite an integer `id` field (internal Go note)

**What each source says:**

- **Go SDK:** `GetApp` takes `appID string` and builds the path as `appsEndpoint + "/" + appID`, even though the `Apps.ID` field it returns is typed `int`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:53`, `:55`; `Apps.ID int` at `:16`)
- **Python SDK:** `get_app` likewise takes `app_id: str`. (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:110`)

**Significance / which to trust:** Both SDKs take the app ID as a string path segment; the Go `Apps.ID` being `int` is an internal type mismatch (read an `int`, pass it back as a `string`), not a cross-SDK divergence. Recorded here because the int/string mix is a recurring ZDX-ID footgun.

---

## Administration divergences

The administration surface (departments/locations filter-lookup, not admin-user management) is documented in [`administration.md`](./administration.md). Cross-source disagreements:

### `Q` filter field — Go locations carry both `search` and `q`; departments carry `search` only

**What each source says:**

- **Go SDK:** `GetLocationsFilters` carries **both** a `Search` field and a `Q` field; `GetDepartmentsFilters` carries `Search` but **no** `Q`. (`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:31-36` for locations, `:25-29` for departments)
- **Python SDK:** both `list_departments` and `list_locations` accept a `search` query param. (`vendor/zscaler-sdk-python/zscaler/zdx/admin.py:44`, `:114`)

**Significance / which to trust:** Server-side name search on the departments lookup **is** available through Go — `GetDepartmentsFilters.Search` (`administration.go:28`) maps to the `search` query param, same as Python. The actual divergence is narrower: the Go locations filter additionally exposes a `Q` field (`administration.go:35`) that the departments filter lacks. The `q` vs `search` distinction mirrors the geolocations search-key nuance noted under device-list filters.

### `since` (Python hours) vs `from`/`to` (Go epoch) on the admin lookups

**What each source says:**

- **Python SDK:** `list_departments` / `list_locations` carry `@zdx_params` and accept `since` in hours. (`vendor/zscaler-sdk-python/zscaler/zdx/admin.py:33`, `:41`, `:106`, `:114`)
- **Go SDK:** `GetDepartmentsFilters` / `GetLocationsFilters` expose `From`/`To` epoch ints, no hours shorthand. (`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:26-27`, `:32-33`)

**Significance / which to trust:** Same `from`/`to` epoch contract on the wire; Python adds the hours-shorthand ergonomic, Go does not. Same pattern as the metric endpoints.

---

## Cross-SDK ergonomics (no wire disagreement)

These are SDK-shape differences that do not change the wire contract, recorded so cross-SDK integrators don't misread them as protocol divergences:

- **No `ReadAllPages` helper in either SDK for ZDX.** ZDX uses cursor-based pagination (`next_offset`); neither SDK centralizes the cursor loop, so each caller implements its own. (See [`sdk.md § Cursor-based pagination`](./sdk.md).)
- **`x-partner-id` (MSP / partner access) is supported by both SDKs** — Python via `ZSCALER_PARTNER_ID` → `partnerId` config → `x-partner-id` header (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:56`, `:329`); Go via `WithPartnerID` / `ZSCALER_PARTNER_ID` → `x-partner-id` header (`vendor/zscaler-sdk-go/zscaler/zdx/v2_config.go:85`, `vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:437-438`). This is parity, not a divergence.
- **Snapshot (`POST /zdx/v1/snapshot/alert`) is Python-only** — no Go `snapshot` package exists. Documented as a write-surface capability in [`sdk.md § snapshot`](./sdk.md) and [`diagnostics-and-alerts.md § Sharing an alert snapshot`](./diagnostics-and-alerts.md), and tracked there as a resolved open question. Listed here only as a pointer; the operational detail lives in those docs.

---

## Open questions

The following are unresolved after cross-referencing the available sources. Each requires live-tenant verification.

1. **Which host a given tenant authenticates against.** Both SDKs default to `api.zdxcloud.net`; the help reference documents `api.zsapi.net`. Whether a specific tenant's credentials work against one host, the other, or both is not determinable from source. See [clarification zdx-03](../_meta/clarifications.md#zdx-03-zdx-token-host-per-tenant).

2. **Whether the rate-limit header family is host-coupled as inferred.** The `X-Ratelimit-*-Second` (SDK) vs `RateLimit-*` (help) split is read off two different sources hitting two different hosts; whether each host actually emits the family its source expects needs a live response capture. See [clarification zdx-04](../_meta/clarifications.md#zdx-04-zdx-rate-limit-header-family-per-host).

3. **`get_device_app` live response shape.** Python models a `DeviceAppScoreTrend` timeseries and Go models a single `*App`. The actual shape returned by GET `.../apps/{appID}` is not determinable from source alone. See [clarification zdx-06](../_meta/clarifications.md#zdx-06-get_device_app-live-response-shape).

4. **`DeviceEvents` live response key.** Go reads `instances`, Python reads `events`. Which key the live API actually returns (or whether both are present) is unverified. See [clarification zdx-07](../_meta/clarifications.md#zdx-07-deviceevents-live-response-key).

5. **`CallQualityMetrics.metrics` live shape.** Python expects `list[str]`, Go expects structured `[]Metric`. The wire shape is unverified. See [clarification zdx-08](../_meta/clarifications.md#zdx-08-callqualitymetricsmetrics-live-shape).

6. **`cloud_path_probe_id` start-payload serialization.** Corroborated by the Go struct tag (`deeptrace.go:45`) and the Go example, but no test asserts the serialized key. (Carried as the matching open question in [`diagnostics-and-alerts.md`](./diagnostics-and-alerts.md).)

## Cross-links

- ZDX API surface and auth — [`./api.md`](./api.md)
- ZDX SDK service catalog and Go-parity table — [`./sdk.md`](./sdk.md)
- Device fields (Wi-Fi, `os_build`, network) — [`./devices.md`](./devices.md)
- Deeptrace start chain and snapshot sharing — [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md)
- Cross-product auth / rate-limit comparison — [`../shared/oneapi.md`](../shared/oneapi.md)
- Sibling divergence docs — [`../zia/api-divergences.md`](../zia/api-divergences.md), [`../zpa/api-divergences.md`](../zpa/api-divergences.md)
