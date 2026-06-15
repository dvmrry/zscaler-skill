---
product: zdx
topic: "zdx-api"
title: "ZDX API — SDK surface and endpoint summary"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: mixed
sources:
  - "https://help.zscaler.com/legacy-apis/understanding-zdx-api"
  - "vendor/zscaler-help/understanding-zdx-api.md"
  - "vendor/zscaler-help/automate-zscaler/api-authentication-overview.md"
  - "vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md"
  - "vendor/zscaler-sdk-python/zscaler/zdx/"
  - "vendor/zscaler-sdk-go/zscaler/zdx/"
author-status: draft
---

# ZDX API surface

Endpoint and SDK summary for ZDX. Unlike ZIA / ZPA, ZDX is **read-dominant** — the configuration surface (probes, alert rules, applications) is console-driven, and most of the API exposes **metric and status retrieval**. It is not write-free, however: the SDK exposes an on-demand diagnostic / sharing write surface — `start_deeptrace` / `delete_deeptrace`, `start_analysis` / `delete_analysis`, and `share_snapshot` are all API writes (see [Write surface](#write-surface)).

## Base endpoint

ZDX **data** endpoints live under `/zdx/v1` on both transports (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:12`, `.../reports/devices/devices.go:12`, `.../inventory/inventory.go:12`). Two transports reach them: the OneAPI gateway (`https://api.zsapi.net/zdx/v1/...`) and the legacy direct-cloud host the SDKs build (`https://api.zdxcloud.net`, default cloud `zdxcloud`; `vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:55`,`57`). The two differ in their auth-path prefix — see [Auth](#auth). ZDX retains its own SHA256-signed auth flow (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py`) rather than the ZIdentity OAuth exchange ZIA/ZPA use under OneAPI.

## SDK services under `client.zdx.*`

| Service | Purpose | Notes |
|---|---|---|
| `client.zdx.admin` | Administration config read | Service Desk roles, RBAC read. |
| `client.zdx.alerts` | Alert retrieval and affected-device listing | See [`./diagnostics-and-alerts.md § Alerts`](./diagnostics-and-alerts.md). |
| `client.zdx.apps` | Application metrics, score, users | Core analytics surface. |
| `client.zdx.devices` | Per-device metrics, web probes, cloud path probes, call quality | Highest-volume method set. |
| `client.zdx.inventory` | Software inventory per device | Audit surface. |
| `client.zdx.snapshot` | Share an alert-detail snapshot (a **write**) | Single method `share_snapshot` — POSTs a shareable alert snapshot with an expiry and optional field obfuscation. Not a state-capture read. |
| `client.zdx.troubleshooting` | Diagnostics Sessions (SDK calls them "deeptraces"), analysis jobs, top processes | On-demand deep investigation workflow. Contains **writes** (start/delete deeptrace, start/delete analysis). |
| `client.zdx.users` | User-level queries | User lookups, user-to-device mapping. See [`### client.zdx.users`](#clientzdxusers). |

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

- 4 CRUD methods on deeptraces (`list`, `start`, `get`, `delete`) — `start_deeptrace` and `delete_deeptrace` are **writes** (POST `/zdx/v1/devices/{device_id}/deeptraces` and DELETE; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:176-180`,`223`).
- 5 metric-retrieval methods on completed deeptraces (webprobe, cloudpath, cloudpath metrics, health, events).
- `list_top_processes` for device-level process visibility.
- 3 methods for broader multi-device / time-range `analysis` jobs — `start_analysis` (POST `/zdx/v1/analysis`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:549`) and `delete_analysis` (DELETE `/zdx/v1/analysis/{analysis_id}`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:647`) are **writes**; `get_analysis` is a read.

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
| `list_softwares(query_params)` | Which software versions are present across the device fleet (`vendor/zscaler-sdk-python/zscaler/zdx/inventory.py:36`). |
| `list_software_keys(...)` | Specific software / license key listings. |

Backed by the MCP `audit-software-inventory` skill under `vendor/zscaler-mcp-server/skills/zdx/audit-software-inventory/`.

### `client.zdx.users`

User-centric retrieval. If no time range is supplied, the endpoint defaults to the last 2 hours (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go:44`,`55`).

| Method | Purpose |
|---|---|
| `list_users(query_params)` | All active users, with their devices, active geolocations, and Zscaler locations. GET `/zdx/v1/users` (`vendor/zscaler-sdk-python/zscaler/zdx/users.py:91-95`; Go `GetAllUsers`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go:56`,`62`). |
| `get_user(user_id, query_params)` | One user's detail — device, geolocation, and Zscaler-location info. GET `/zdx/v1/users/{user_id}` (`vendor/zscaler-sdk-python/zscaler/zdx/users.py:145-149`; Go `GetUser`, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go:45`,`47`). |

The Go `reports/users` types expose `User`, `Devices`, `UserLocation`, and `ZSLocation` structs (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/users/users.go:15-42`). `list_users` supports server-side filters (`since`, `location_id`, `department_id`, `geo_id`) and `offset`/`limit` pagination (`vendor/zscaler-sdk-python/zscaler/zdx/users.py:42-59`).

### `client.zdx.snapshot`

| Method | Purpose |
|---|---|
| `share_snapshot(name, alert_id, expiry, obfuscation)` | Create a shareable snapshot of an alert's details. POST `/zdx/v1/snapshot/alert` (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:83-87`). |

`expiry` is in hours and must be between **2 hours and 90 days** (default 2 hours); the SDK converts it to a Unix-epoch value (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:40-42`,`105`). `obfuscation` is a list selecting which fields to redact in the shared snapshot — valid values are `USER_NAME`, `LOCATION`, `DEVICE_NAME`, `IP_ADDRESS`, `WIFI_NAME` (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:43-45`). **Note:** as of the reviewed SDK commit, `obfuscation` is accepted as a kwarg but **not placed in the POST body** by the Python client — `share_snapshot` builds the body from `name`/`alert_id`/`expiry` only (`snapshot.py:91-106`), so these values describe the API contract, not confirmed SDK behavior (see [clarification `zdx-35`](../_meta/clarifications.md#zdx-35-share_snapshot-obfuscation-transmission)). This is a **write**, not a state read.

## Auth

ZDX has **two auth paths** depending on tenant migration state. Both end with a bearer token used in `Authorization: Bearer <token>` on subsequent calls.

### OneAPI path (modern tenants)

Same as ZIA / ZPA:

- `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` (or `ZSCALER_PRIVATE_KEY`), `ZSCALER_VANITY_DOMAIN`, optional `ZSCALER_CLOUD`. The SDK handles token exchange via ZIdentity.
- Token endpoint: `https://<vanity>.zslogin.net/oauth2/v1/token` with `audience=https://api.zscaler.com` (see [`../shared/oneapi.md`](../shared/oneapi.md)).

### ZDX-specific legacy auth

ZDX retains a dedicated SHA256-signed auth flow distinct from OneAPI. It is reached over **two different hosts** depending on transport, and the request body is identical on both:

```http
POST <host>/<auth-path>
Content-Type: application/json

{
  "key_id": "<api-key-id>",
  "key_secret": "SHA256(<secret_key>:<timestamp>)",
  "timestamp": <unix-epoch-seconds>
}
```

**Transport 1 — OneAPI gateway.** `https://api.zsapi.net/zdx/v1/oauth/token` (`vendor/zscaler-help/automate-zscaler/api-authentication-overview.md:43`, `vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md:16`). This is the gateway convention — data endpoints live under the same `/zdx/v1/...` prefix as auth.

**Transport 2 — legacy direct cloud (what the SDKs build).** Host is `https://api.{cloud}.net`, where `cloud` defaults to `zdxcloud` (so `https://api.zdxcloud.net`); valid clouds are `zdxcloud` and `zdxbeta` (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:33`,`55`,`57`). On this host, **auth lives at `/v1/oauth/token` (no `/zdx` prefix)** while data endpoints use `/zdx/v1/...` — a path-prefix asymmetry unique to the direct-cloud transport (Python `legacy.py:173` → `{base}/v1/oauth/token`; Go `vendor/zscaler-sdk-go/zscaler/zdx/v2_config.go:150-152` builds the base, `v2_client.go:234` appends `/v1/oauth/token`; data-path consts `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:12`, `.../reports/devices/devices.go:12`, `.../inventory/inventory.go:12` are all `/zdx/v1/...`).

SDK env vars and inputs:

- **Go** uses `ZDX_API_KEY_ID`, `ZDX_API_SECRET`, and `ZDX_CLOUD` (`vendor/zscaler-sdk-go/zscaler/zdx/v2_config.go:47-48`,`84`), or the `WithZDXAPIKeyID` / `WithZDXAPISecret` / `WithZDXCloud` setters.
- **Python** `LegacyZDXClientHelper` uses `ZDX_CLIENT_ID`, `ZDX_CLIENT_SECRET`, and `ZDX_CLOUD` (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:53-55`).

Mechanics:

- `key_secret` is the SHA256 hex digest of `<secret_key>:<timestamp>` (literal colon-concatenation) (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:164-165`; Go `generateHash`, `vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:374-378`).
- **Requests are rejected if more than 15 minutes have elapsed** between the supplied `timestamp` and ZDX's clock (`vendor/zscaler-help/automate-zscaler/api-authentication-overview.md:54`, `vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md:27`).
- Returned token is valid for **3600 seconds**.

The Python SDK's `vendor/zscaler-sdk-python/zscaler/zdx/legacy.py` implements this flow. Hand-written callers (curl, Postman without the helper) must produce the SHA256 themselves.

### Partner / MSP access

Both SDKs support a partner ID for multi-tenant / MSP access, sent as an `x-partner-id` request header:

- **Go**: `WithPartnerID` setter or `ZSCALER_PARTNER_ID` env var (`vendor/zscaler-sdk-go/zscaler/zdx/v2_config.go:85`,`214-218`); the header is set on each request (`vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:437-438`).
- **Python**: `partner_id` argument or `ZSCALER_PARTNER_ID` env var (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:49`,`56`); flows into the default headers as `x-partner-id` (`vendor/zscaler-sdk-python/zscaler/request_executor.py:114-116`).

### Token re-authentication (Go)

The Go client transparently re-authenticates on a `401`/`403` response and retries the original request once (`vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:348-369`). Useful operationally: a long-running Go job survives token expiry without caller intervention.

### Auth-utility endpoints

ZDX exposes two introspection endpoints that the OneAPI path doesn't:

- `GET /zdx/v1/oauth/jwks` — JWKS public-key set used to verify ZDX-issued JWTs.
- `GET /zdx/v1/oauth/validate` — checks whether a presented JWT is valid. Useful for token-validity probing in long-running scripts.

See [`../shared/oneapi.md § Three authentication mechanisms`](../shared/oneapi.md) for the cross-product comparison (OneAPI / ZDX legacy / ZCC legacy).

## Wire format quirks

- **Terminology split**: SDK uses "deeptrace" on method names and object keys; admin portal UI uses "Diagnostics Session." Both refer to the same resource.
- **Read-dominant, not read-only**: `apps`, `devices`, `users`, and `inventory` are read-only. **Config** (adding apps, creating probes, defining alert rules) is portal-only — there is no "add a probe programmatically" in the SDK. But the diagnostic/sharing surface does write: see [Write surface](#write-surface).
- **Time-range parameters** are expected on most metric endpoints (`from`, `to`, or similar date params). Exact parameter names vary per endpoint — check SDK method signatures before calling.

## Write surface

ZDX is read-dominant, but the SDK exposes five mutating endpoints. None of them touch ZDX *configuration* (probes, alert rules, app definitions remain portal-only); they drive on-demand diagnostics and alert sharing:

| Method | Verb / path | Source |
|---|---|---|
| `start_deeptrace(device_id, ...)` | POST `/zdx/v1/devices/{device_id}/deeptraces` | `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:176-180` |
| `delete_deeptrace(device_id, trace_id)` | DELETE `/zdx/v1/devices/{device_id}/deeptraces/{trace_id}` | `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:223` |
| `start_analysis(...)` | POST `/zdx/v1/analysis` | `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:549` |
| `delete_analysis(analysis_id)` | DELETE `/zdx/v1/analysis/{analysis_id}` | `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:647` |
| `share_snapshot(name, alert_id, ...)` | POST `/zdx/v1/snapshot/alert` | `vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:83-87` |

## Rate limits

The server-side tier table (limits keyed to license count, different from ZIA's weight-based / ZPA's per-IP) lives in [`../shared/oneapi.md § ZDX — tier-based by license count`](../shared/oneapi.md).

**Two response-header families exist, by transport.** The form you parse depends on which path you hit:

- **Legacy direct-cloud path (SDK-honored).** Both SDKs read **per-second sliding-window** headers: `X-Ratelimit-Remaining-Second` and `X-Ratelimit-Limit-Second`. They use these to back off proactively before a 429 (Python `vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:97-98`; Go `vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:167-168`). This is the authoritative client-honored behavior.
- **OneAPI gateway path (help-documented).** The gateway returns `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` (UTC epoch seconds) — distinct from ZIA's lowercase `x-ratelimit-*` (`vendor/zscaler-help/automate-zscaler/api-reference-zdx-overview.md:103`). The SDK code does not read these; the `X-Ratelimit-*-Second` form above is what the SDK transport honors.

**Go SDK client-side limiter.** Independent of the server tier table, the Go SDK installs a flat **global limiter of 100 requests / 60 s** with an additional **5 s delay** baked into the rate-limit transport (`vendor/zscaler-sdk-go/zscaler/zdx/v2_config.go:314`,`322`). So the Go client self-throttles at a fixed rate rather than reading the server's tier-based allowance.

## Open questions

- Whether the OneAPI gateway (`api.zsapi.net`) actually enforces the per-second `X-Ratelimit-*-Second` window or only the `RateLimit-*` family — the SDK code only reads the `X-Ratelimit-*-Second` form, and the gateway-header claim rests on the help capture, which the SDK transport does not parse. Server behavior on the gateway is not confirmable from SDK source. See [clarification zdx-04](../_meta/clarifications.md#zdx-04-zdx-rate-limit-header-family-per-host).
- Whether the server-side tier table (license-count limits) and the Go SDK's flat 100 req/60 s client limiter are reconciled anywhere, or whether the client limiter is simply a conservative floor independent of the negotiated tier. See [clarification zdx-05](../_meta/clarifications.md#zdx-05-zdx-server-tier-table-vs-client-flat-limiter).
- Full query-parameter schemas per metric endpoint (only the `client.zdx.users` filters are enumerated here from `users.py`; other services' params still need per-method review).
- Whether the Python SDK has an equivalent of the Go auto-reauth-on-401/403 retry (the Go path is confirmed at `v2_client.go:348-369`; the Python legacy path caches tokens but its 401/403 re-auth behavior was not traced).

## Cross-links

- Architecture overview — [`./overview.md`](./overview.md)
- Probes (data source for most SDK methods) — [`./probes.md`](./probes.md)
- Diagnostics Sessions and Alerts — [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md)
- Shared auth pattern — [`../zia/api.md § Authentication`](../zia/api.md)
