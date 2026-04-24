---
product: zdx
topic: "zdx-api"
title: "ZDX API — SDK surface and endpoint summary"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
sources:
  - "https://help.zscaler.com/legacy-apis/understanding-zdx-api"
  - "vendor/zscaler-help/understanding-zdx-api.md"
  - "vendor/zscaler-sdk-python/zscaler/zdx/"
author-status: draft
---

# ZDX API surface

Endpoint and SDK summary for ZDX. Unlike ZIA / ZPA, ZDX is primarily a **read-only** API — the configuration surface (probes, alerts, applications) is console-driven; the API mostly exposes **metric and status retrieval**.

## Base endpoint

All ZDX paths live under `/zdx/v1` (legacy API). Accessed via `ZscalerClient` / OneAPI auth like ZIA and ZPA, though ZDX has its own legacy auth path (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py`) for older tenants.

## SDK services under `client.zdx.*`

| Service | Purpose | Notes |
|---|---|---|
| `client.zdx.admin` | Administration config read | Service Desk roles, RBAC read. |
| `client.zdx.alerts` | Alert retrieval and affected-device listing | See [`./diagnostics-and-alerts.md § Alerts`](./diagnostics-and-alerts.md). |
| `client.zdx.apps` | Application metrics, score, users | Core analytics surface. |
| `client.zdx.devices` | Per-device metrics, web probes, cloud path probes, call quality | Highest-volume method set. |
| `client.zdx.inventory` | Software inventory per device | Audit surface. |
| `client.zdx.snapshot` | (Role unclear without SDK deep-dive) | Likely point-in-time state capture. |
| `client.zdx.troubleshooting` | Diagnostics Sessions (SDK calls them "deeptraces"), analysis jobs, top processes | On-demand deep investigation workflow. |
| `client.zdx.users` | User-level queries | User lookups, user-to-device mapping. |

### `client.zdx.apps`

Application-centric retrieval:

| Method | Purpose |
|---|---|
| `list_apps(query_params)` | All applications with recent activity. |
| `get_app(app_id, query_params)` | Detail for a specific application. |
| `get_app_score(app_id, query_params)` | ZDX Score for the app over a time range. |
| `get_app_metrics(app_id, query_params)` | Metric detail (Page Fetch Time, DNS Time, TTFB, etc.). |
| `list_app_users(app_id, query_params)` | Users who accessed the app in the time range. |
| `get_app_user(app_id, user_id, query_params)` | One user's experience with one app. |

Time-range query params are universal across this service.

### `client.zdx.devices`

Per-device retrieval:

| Method | Purpose |
|---|---|
| `list_devices(query_params)` | All devices reporting to ZDX. |
| `get_device(device_id, query_params)` | Device detail. |
| `get_device_apps(device_id, query_params)` | Apps this device has used. |
| `get_device_app(device_id, app_id, query_params)` | Device's specific experience with an app. |
| `get_web_probes(device_id, app_id, query_params)` | Web probe results for (device, app). |
| `get_web_probe(device_id, app_id, probe_id, query_params)` | Specific Web probe result. |
| `list_cloudpath_probes(device_id, app_id, query_params)` | Cloud Path probe results. |
| `get_cloudpath_probe(device_id, app_id, probe_id, query_params)` | Specific Cloud Path result. |
| `get_cloudpath(device_id, app_id, probe_id, query_params)` | The hop-by-hop visualization data. |
| `get_call_quality_metrics(device_id, app_id, query_params)` | Teams / Zoom call-quality data. Only meaningful for predefined apps that integrate with the call-quality telemetry feed. |

### `client.zdx.troubleshooting` (a.k.a. deeptraces)

See [`./diagnostics-and-alerts.md § SDK surface for Diagnostics Sessions`](./diagnostics-and-alerts.md) for the full list. Summary:

- 4 CRUD methods on deeptraces (`list`, `start`, `get`, `delete`).
- 5 metric-retrieval methods on completed deeptraces (webprobe, cloudpath, cloudpath metrics, health, events).
- `list_top_processes` for device-level process visibility.
- 3 methods for broader multi-device / time-range `analysis` jobs.

### `client.zdx.alerts`

| Method | Purpose |
|---|---|
| `list_ongoing(query_params)` | Currently-firing alerts. |
| `list_historical(query_params)` | Past alerts. |
| `get_alert(alert_id)` | Alert detail. |
| `list_affected_devices(alert_id, query_params)` | Which devices are affected — the operational superpower for "is this local or fleet-wide?" |

### `client.zdx.inventory`

| Method | Purpose |
|---|---|
| `list_softwares(query_params)` | All installed software across devices — useful for ShadowIT / compliance audits. |
| `list_software_keys(...)` | Specific software / license key listings. |

Backed by the MCP `audit-software-inventory` skill under `vendor/zscaler-mcp-server/skills/zdx/audit-software-inventory/`.

## Auth

ZDX auth follows the OneAPI ZIdentity pattern in current tenants:

- `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` (or `ZSCALER_PRIVATE_KEY`), `ZSCALER_VANITY_DOMAIN`, optional `ZSCALER_CLOUD` — same as ZIA / ZPA.

For pre-ZIdentity tenants, the legacy path (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py`) uses ZDX-specific credentials — operator needs a ZDX API key pair provisioned in the ZDX admin portal.

See [`../zia/api.md § Authentication`](../zia/api.md) for the shared pattern.

## Wire format quirks

- **Terminology split**: SDK uses "deeptrace" on method names and object keys; admin portal UI uses "Diagnostics Session." Both refer to the same resource.
- **Read-only emphasis**: `apps`, `devices`, `users`, `inventory` are all read-only. Configuration (adding apps, creating probes, defining alert rules) goes through the admin portal, not the API. A fork admin looking for "add a probe programmatically" will not find it in the current SDK surface.
- **Time-range parameters** are expected on most metric endpoints (`from`, `to`, or similar date params). Exact parameter names vary per endpoint — check SDK method signatures before calling.

## Snapshotting ZDX

`scripts/snapshot-refresh.py` doesn't yet dump ZDX. Adding it would mean:

- `client.zdx.apps.list_apps` → `snapshot/zdx/apps.json`
- `client.zdx.devices.list_devices` → `snapshot/zdx/devices.json`
- `client.zdx.alerts.list_ongoing` + `list_historical` → `snapshot/zdx/alerts-ongoing.json` + `snapshot/zdx/alerts-historical.json`
- `client.zdx.inventory.list_softwares` → `snapshot/zdx/software-inventory.json`

**Caveat**: ZDX data is fundamentally time-series — a single snapshot captures a point-in-time view of what ZDX currently reports. Unlike ZIA/ZPA config (which changes slowly), ZDX metrics update every 5 minutes. A snapshot is useful for "what's the current state?" but not for historical analysis — use the time-range query params on live API calls for that.

## Open questions

- Exact endpoint paths for each SDK method (not yet reviewed line-by-line).
- Query parameter schemas per endpoint.
- Rate-limit behavior (ZDX's rate-limit page exists but wasn't captured in this pass).

## Cross-links

- Architecture overview — [`./overview.md`](./overview.md)
- Probes (data source for most SDK methods) — [`./probes.md`](./probes.md)
- Diagnostics Sessions and Alerts — [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md)
- Shared auth pattern — [`../zia/api.md § Authentication`](../zia/api.md)
