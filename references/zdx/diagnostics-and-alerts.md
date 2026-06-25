---
product: zdx
topic: "zdx-diagnostics-and-alerts"
title: "ZDX Diagnostics Sessions (deeptraces) and Alerts"
content-type: reasoning
last-verified: "2026-06-21"
verified-against:
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/zdx/understanding-diagnostics-session-status"
  - "vendor/zscaler-help/understanding-diagnostics-session-status.md"
  - "https://help.zscaler.com/zdx/understanding-alert-status"
  - "vendor/zscaler-help/understanding-alert-status.md"
  - "vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/alerts.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/snapshot.py"
  - "vendor/zscaler-api-specs/automate-zscaler/zdx-api-reference.json"
  - "vendor/zscaler-sdk-python/zscaler/zdx/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/models/troubleshooting.py"
  - "vendor/zscaler-sdk-python/zscaler/utils.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/device_web_probes.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/device_cloudpath_probes.py"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/list_applications.py"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_web_probes.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go"
  - "vendor/zscaler-sdk-go/examples/zdx/deeptrace/deep_trace_start/main.go"
author-status: draft
---

# ZDX Diagnostics Sessions and Alerts

The two operator-facing workflows in ZDX beyond the dashboards: **Diagnostics Sessions** for on-demand deep investigation of a specific device, and **Alerts** for threshold-based notification when scores or metrics degrade.

## Summary

Source: `vendor/zscaler-help/understanding-diagnostics-session-status.md`; `vendor/zscaler-help/understanding-alert-status.md`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py`; `vendor/zscaler-sdk-python/zscaler/zdx/alerts.py`.

- **Diagnostics Session** — admin starts an on-demand probe campaign targeted at one device. ZCC runs intensified probes for a configured window, streams 1-minute-resolution data back to ZDX, and produces a detailed forensic report. Used for "this one user is reporting an issue and I need detail now." **The SDK/MCP term is "deeptrace"** — same thing, different vocabulary.
- **Alerts** — rule-based notifications when configured metrics cross thresholds. Surface in ZDX dashboard, can webhook out. Alert status lifecycle captures rule changes in the audit trail.

## Mechanics

Source: `vendor/zscaler-help/understanding-diagnostics-session-status.md`; `vendor/zscaler-help/understanding-alert-status.md`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py`; `vendor/zscaler-sdk-python/zscaler/zdx/alerts.py`.

### Diagnostics Session status lifecycle

From *Understanding the Diagnostics Session Status*, sessions progress through two tables (In Progress and History) with distinct status enums.

**In-progress statuses:**

| Status | Meaning |
|---|---|
| `Created` | Admin created the session in ZDX. Not yet acknowledged by ZCC. |
| `Started` | ZCC confirmed receipt of the request; probe execution begins. **May take a few minutes to transition from Created → Started.** |
| `In Progress` | ZCC is actively executing. Session provides updated data **every minute**. |

**Terminal statuses (History):**

| Status | Meaning |
|---|---|
| `Completed` | Happy path. Session ran to scheduled completion. |
| `Abort Initiated` | Admin canceled prematurely. Request forwarded to ZCC but ZCC hasn't yet acknowledged. |
| `Aborted` | ZCC acknowledged the abort; state updated. Transition from Abort Initiated → Aborted may take a few minutes. |
| `Expired` | Request timed out because ZCC never responded. Typically: device offline, device disconnected from ZCC tunnel, network issues preventing ZCC-cloud communication. |
| `Failed` | ZCC (possibly after a restart) could not run the scheduled probes due to internal errors. |
| `Incomplete` | Pipeline issue; partial data is available. |

**Operational patterns:**

- **Created → Expired** is the "user's device is offline" scenario. Start here before assuming the session failed.
- **In Progress → Aborted** is admin-initiated cancellation. Reason should be in admin audit logs.
- **Incomplete** still yields partial data — don't discard the session result just because status isn't Completed.
- **Sessions at 1-minute resolution** are significantly higher fidelity than the 5-minute probe cadence of baseline ZDX. Use them when the standard dashboards don't give enough detail.

### SDK surface for Diagnostics Sessions

From `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py`, the SDK uses "deeptrace" terminology:

| Method | Purpose |
|---|---|
| `list_deeptraces(device_id)` | List all sessions (in-progress + historical) for a device. |
| `start_deeptrace(device_id, **kwargs)` | Start a new session. |
| `get_deeptrace(device_id, trace_id)` | Fetch session metadata + status. |
| `delete_deeptrace(device_id, trace_id)` | Delete a session record. |
| `get_deeptrace_webprobe_metrics(device_id, trace_id)` | Fetch Web probe metrics captured during the session. |
| `get_deeptrace_cloudpath_metrics(device_id, trace_id)` | Fetch Cloud Path metrics. |
| `get_deeptrace_cloudpath(device_id, trace_id)` | Fetch the hop-by-hop Cloud Path visualization data. |
| `get_deeptrace_health_metrics(device_id, trace_id)` | Device health (CPU, memory, Wi-Fi, etc.) captured during the session. |
| `get_deeptrace_events(device_id, trace_id)` | Event log during the session (app starts, network transitions, etc.). |
| `list_top_processes(device_id, ...)` | Top processes by resource consumption on the device. |
| `start_analysis(**kwargs)` | Start a broader analysis job (multi-device or time-range analysis). |
| `get_analysis(...)` / `delete_analysis(...)` | Manage analysis jobs. |

**Terminology mapping**: the SDK method name `start_deeptrace` corresponds to the portal action "Start a New Diagnostics Session." When writing scripts or agent answers, use "deeptrace" when talking about the SDK/API; use "Diagnostics Session" when talking about the admin portal.

### Starting a deeptrace: the required pre-call read chain

Source: `vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py`; `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/apps.py`; `vendor/zscaler-sdk-go/examples/zdx/deeptrace/deep_trace_start/main.go`.

`start_deeptrace` cannot be called cold — it requires three IDs that must each be read from upstream endpoints first. The MCP `deeptrace_manage` tool's docstring spells out the mandatory pre-call sequence: (1) `zdx_list_applications` → `app_id`, (2) `zdx_get_web_probes(device_id, app_id)` → `web_probe_id`, (3) `zdx_list_cloudpath_probes(device_id, app_id)` → `cloudpath_probe_id`, (4) then start (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py:52-56`, REQUIRED WORKFLOW block). The MCP tool types all three IDs as REQUIRED `int` and names the upstream read for each one: `app_id` from `zdx_list_applications`, `web_probe_id` from `zdx_get_web_probes(device_id, app_id)`, `cloudpath_probe_id` from `zdx_list_cloudpath_probes(device_id, app_id)` (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py:14`, `:20`, `:26`; typed `int` with `REQUIRED` descriptions at `:11-28`). This is the MCP tool's pydantic surface, not the API contract — the Python SDK docstring types `app_id` / `web_probe_id` / `cloudpath_probe_id` as `str` (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:149`, `:153`, `:154`); for the wire form, the IDs are integers on the start payload in both SDKs (see the divergences section below).

The Go `deep_trace_start` example confirms the same ordering at the usage level: it prompts for device ID, app ID, web probe ID, and cloud path probe ID in that order, and only then constructs `DeepTraceSessionPayload` and calls `CreateDeepTraceSession` (`vendor/zscaler-sdk-go/examples/zdx/deeptrace/deep_trace_start/main.go:44-99`, `:101`).

**Step 1 reads applications tenant-wide.** Application listing is `GET /zdx/v1/apps` with no device/app path scoping — `list_apps` in the Python SDK (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py:82-85`) and `GetAllApps` in Go (`appsEndpoint = /zdx/v1/apps` at `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/applications.go:12`, `:43-45`). The MCP `list_applications` tool maps optional `location_id` / `department_id` / `geo_id` / `since` filters into `query_params` and calls `client.zdx.apps.list_apps(query_params=...)`, returning the app objects as dicts via `ActiveApplications.as_dict()` (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/list_applications.py:60-77`).

### Probe IDs are scoped to a (device, app) pair

Source: `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_web_probes.go`; `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go`.

`web_probe_id` and `cloudpath_probe_id` are not portable across apps or devices — both probe-read endpoints are nested under **both** `device_id` and `app_id`:

| Probe read | URL path | line |
|---|---|---|
| Web probes (Python) | `/zdx/v1/devices/{device_id}/apps/{app_id}/web-probes` | `vendor/zscaler-sdk-python/zscaler/zdx/devices.py:358-361` |
| Cloud-path probes (Python) | `/zdx/v1/devices/{device_id}/apps/{app_id}/cloudpath-probes` | `vendor/zscaler-sdk-python/zscaler/zdx/devices.py:486-489` |
| Web probes (Go) | same device+app nesting | `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_web_probes.go:25` |
| Cloud-path probes (Go) | same device+app nesting | `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_cloudpath_probes.go:71` |

The (device, app) scoping is enforced at the SDK call boundary: both read methods take `device_id` and `app_id` as positional args before `query_params` — `get_web_probes(self, device_id, app_id, query_params=None)` (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:321`) and `list_cloudpath_probes(self, device_id, app_id, query_params=None)` (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:457-459`).

**Read-key vs. payload-key remap.** The probe objects returned by the read steps carry the probe ID under the wire key `id` — not `web_probe_id` / `cloudpath_probe_id`. Both models read `self.id = config['id']`: `DeviceAppWebProbes` (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:530`) and `DeviceAppCloudPathProbes` (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:490`). The caller reads field `id` from the list response, then passes it as `web_probe_id` / `cloudpath_probe_id` into start — a name change the caller must perform by hand.

### `since` is hours on the SDK surface, epoch `from`/`to` on the wire

Source: `vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/device_web_probes.py`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/device_cloudpath_probes.py`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/list_applications.py`; `vendor/zscaler-sdk-python/zscaler/utils.py`; `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`; `vendor/zscaler-sdk-python/zscaler/zdx/apps.py`.

The probe-read and application-list tools take a `since` parameter documented and typed as **number of hours to look back, default 2h, `Optional[int]`** — `device_web_probes` (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/device_web_probes.py:11-13`, `:30`), `device_cloudpath_probes` (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/device_cloudpath_probes.py:12-14`, `:36`), and `list_applications`, whose example shows `since=10` meaning "the past 10 hours" (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/list_applications.py:19-21`, `:55-56`).

That `since=hours` value is **not** sent to the API as hours. The `zdx_params` decorator converts it into Unix-epoch `from`/`to` query params: it calls `calculate_epoch(value)` and sets `query_params['from']=past_time`, `query_params['to']=current_time`, where `calculate_epoch` computes `past_time = current_time - (hours*3600)` (`vendor/zscaler-sdk-python/zscaler/utils.py:408-409`, `:424-429`; `:385-387` for the `hours*3600`). The on-wire contract is `from`/`to` in epoch seconds; the SDK/tool surface takes hours. Because both probe-read methods carry `@zdx_params`, this conversion applies to `get_web_probes` and `list_cloudpath_probes` too, not only `list_devices` / `list_apps` (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:320`, `:456`; `list_apps` decorated at `vendor/zscaler-sdk-python/zscaler/zdx/apps.py:34`).

### The `start_deeptrace` POST and its payload

Source: `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go`.

`start_deeptrace` is `POST /zdx/v1/devices/{device_id}/deeptraces`. `device_id` is a path segment; the three required IDs go in the JSON body, which is the kwargs dict passed straight through (`session_name`, `app_id`, `web_probe_id`, `cloudpath_probe_id`, `session_length_minutes`, `probe_device`) (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:176-182`; MCP `sdk_kwargs` assembled at `vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py:92-99`).

`session_length_minutes` defaults to 5 and is constrained to the enumerated values **5, 15, 30, 60** in both the MCP tool (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py:29-34`) and the Python SDK docstring (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:155-156`). This resolves the prior open question about session duration: the supported set is 5/15/30/60 minutes, default 5.

`delete_deeptrace` is a separate destructive operation (not part of the prerequisite chain): `DELETE /zdx/v1/devices/{device_id}/deeptraces/{trace_id}` (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:223-227`); the MCP delete tool requires both `device_id` and `trace_id` (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py:148-155`).

### Python-vs-Go SDK divergences on the deeptrace path

Source: `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go`; `vendor/zscaler-sdk-python/zscaler/utils.py`.

- **Cloudpath probe wire key (highest-value divergence for anyone hand-building the body):** Go serializes the cloudpath probe ID as JSON key `cloud_path_probe_id` (with an underscore between `cloud` and `path`) — `DeepTraceSessionPayload.CloudPathProbeID` has tag `json:"cloud_path_probe_id"` (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:45`). The Python path sends `cloudpath_probe_id` (no underscore) (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py:96`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:182`).
- **Payload ID types agree (both int):** Go types `AppID` / `WebProbeID` / `CloudPathProbeID` / `SessionLengthMinutes` as `int` (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:41-48`); the Python MCP tool coerces `app_id` / `web_probe_id` / `cloudpath_probe_id` to `int(...)` before sending (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py:93-96`). IDs are integers on the wire for the start payload in both.
- **`device_id` type in the path:** Go's `CreateDeepTraceSession` / `GetDeepTraces` / `DeleteDeepTraceSession` take `deviceID` as `int` and format the path with `%d` (`CreateDeepTraceSession` int signature at `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:69`; `GetDeepTraces` int signature at `:50`; `DeleteDeepTraceSession` int signature plus `%d` path at `:79-80`); Python's `start_deeptrace` / `delete_deeptrace` take `device_id` as `str` (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:143`; `delete_deeptrace` def at `:203`). Same URL shape, different declared type.
- **`since` / time-range ergonomics:** Go probe-read functions take a `common.GetFromToFilters` struct whose `From`/`To` are `int` Unix-epoch seconds with no hours shorthand — the caller pre-computes epoch (`vendor/zscaler-sdk-go/zscaler/zdx/services/common/common.go:16-20`). Python takes `since` in hours and auto-converts via `zdx_params` (`vendor/zscaler-sdk-python/zscaler/utils.py:424-429`). The on-wire `from`/`to` params are identical; only the SDK surface differs.

### When to start a Diagnostics Session

From *About the ZDX Score*:

> You can start a Diagnostics session to help evaluate and troubleshoot issues related to low scores.

Decision heuristic:

- **Score is low for one user, not the user's group**: device-level issue. Session captures 1-min-res device health + probes.
- **Score is low for a group but not all users**: possibly location / network issue. Start sessions on 2-3 users in the affected group to confirm pattern.
- **Score is low organization-wide**: check for a global incident first (application down, Feed Central issue, Service Edge outage) before starting sessions — sessions won't help diagnose a universal problem.

### Alert status lifecycle

From *Understanding the Alert Status*:

| Status | Meaning |
|---|---|
| `Started` | Alert just fired. |
| `Ongoing` | Condition still true; alert persists. |
| `Completed` | Condition cleared normally. |
| `Completed by Exceeded Time` | Alert's configured duration elapsed without the condition clearing. |
| `Completed by Rule Deletion` | Admin deleted the rule that was driving the alert. |
| `Completed by Modified Rule` | Admin modified the alert rule; the old-rule alert closed (the new rule starts fresh). |

**Why the three "Completed by X" statuses exist**: they separate "condition cleared" from "admin action changed the alert's fate" — important audit signal. A dashboard showing a burst of "Completed by Modified Rule" suggests an admin is actively tuning thresholds. A burst of "Completed by Exceeded Time" suggests the alert duration is set too short or rules aren't catching persistent conditions.

### SDK surface for Alerts

From `vendor/zscaler-sdk-python/zscaler/zdx/alerts.py`:

| Method | Purpose |
|---|---|
| `list_ongoing(query_params)` | List currently-firing alerts. |
| `list_historical(query_params)` | List past alerts. |
| `get_alert(alert_id)` | Fetch a specific alert's detail. |
| `list_affected_devices(alert_id, query_params)` | Which devices are affected by the alert — useful for "is this user-specific or fleet-wide?" |

The `list_affected_devices` endpoint is the operational superpower: an alert that says "Microsoft Teams degraded" becomes actionable when you know it's 2 users in Tokyo versus 200 users across 5 locations.

### Sharing an alert snapshot

Source: `vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py`; `vendor/zscaler-sdk-python/zscaler/zdx/models/snapshot.py`; `vendor/zscaler-sdk-python/zscaler/zdx/legacy.py`; `vendor/zscaler-sdk-python/zscaler/utils.py`.

ZDX has a separate `snapshot` service whose single operation shares a point-in-time snapshot of one alert's details — useful for handing an alert to someone who isn't in the ZDX console (e.g. an app owner or a vendor) without giving them tenant access. It is keyed by alert ID, so it lives alongside the Alerts surface, not the Diagnostics surface.

`client.zdx.snapshot.share_snapshot(...)` is `POST /zdx/v1/snapshot/alert` (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:31`, `vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:83-87`; service exposed as the `snapshot` property at `vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:427-434`). It is the only method on the service.

| Field | Type | Meaning |
|---|---|---|
| `name` | `str` | The name of the snapshot (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:36`, `:94-95`). |
| `alert_id` | `str` | The alert the snapshot is taken of — the snapshot is alert-scoped, one alert per call (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:37`, `:96-97`). |
| `expiry` | `int` | How long the share link stays live, **passed as hours**, default 2h, documented valid range **2 hours to 90 days** (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:40-42`). |
| `obfuscation` | `list` | Which PII fields to mask in the shared snapshot — documented set `USER_NAME`, `LOCATION`, `DEVICE_NAME`, `IP_ADDRESS`, `WIFI_NAME` (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:43-45`). |

The response record carries `id`, `name`, `alert_id`, `expiry` (in Unix epoch), `obfuscation`, `url` (where the snapshot can be viewed), and `status` (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:48-55`; the `Snapshot` model parses these same fields at `vendor/zscaler-sdk-python/zscaler/zdx/models/snapshot.py:38-44`).

**`expiry` is hours on the surface, epoch on the wire** — same shape as the `since` conversion elsewhere in ZDX, but a *different field*. `expiry` flows through the `@zdx_params` decorator (which moves it into `query_params` — `vendor/zscaler-sdk-python/zscaler/utils.py:420`), then `share_snapshot` pops it back out and converts hours to an absolute epoch with `int(time.time()) + expiry_hours * 3600` before placing it in the request body (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:100-106`). So the API receives an absolute epoch expiry timestamp; the SDK caller supplies a relative hour count. (The obfuscation flow is flagged in Open questions below.)

## Edge cases

Source: `vendor/zscaler-help/understanding-diagnostics-session-status.md`; `vendor/zscaler-help/understanding-alert-status.md`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py`; `vendor/zscaler-sdk-python/zscaler/zdx/alerts.py`.

- **Session started on a newly-enrolled device**: initial probes may have no baseline to compare against. Score during the session shows raw metrics rather than a useful 0-100 number.
- **Session across a network transition** (user disconnects from Wi-Fi, switches to LTE mid-session): data stream may show a gap. Events endpoint (`get_deeptrace_events`) correlates the gap with the network-interface change.
- **Session started but device is on a trusted network with ZCC `actionType: NONE`**: probes still run — ZCC's probe path is independent of the forwarding-profile branch. A common operator surprise ("why does ZDX work on trusted networks when ZIA doesn't?" — because ZDX uses its own probe path, not the ZIA tunnel).
- **Alerts on 0-availability probes**: may fire briefly on a transient network issue (one failed probe → availability = 0 for that window). Tune alert duration minimums to avoid flap.
- **Historical alerts with status `Completed by Modified Rule`**: the alert's thresholds as-displayed may be the new-rule thresholds, not the thresholds that were active when the alert fired. Treat thresholds on historical alerts as "current rule snapshot," not "as-fired."

## Open questions

Source: `vendor/zscaler-help/understanding-diagnostics-session-status.md`; `vendor/zscaler-help/understanding-alert-status.md`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py`; `vendor/zscaler-sdk-python/zscaler/zdx/alerts.py`; `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go`; `vendor/zscaler-sdk-python/zscaler/zdx/models/troubleshooting.py`; `vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py`.

- ~~What the configurable session duration range is~~ — **resolved** from SDK source: `session_length_minutes` is constrained to 5, 15, 30, 60 (default 5) (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/deeptrace_manage.py:29-34`; `vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:155-156`). See the start-payload section above.
- Per-probe cadence during a session — is it still 5 minutes, or does the session intensify to faster cadence? (Not stated in any of the cited source files.) See [clarification zdx-30](../_meta/clarifications.md#zdx-30-per-probe-cadence-during-a-diagnostics-session).
- How many concurrent sessions are allowed per tenant, per device. (Not stated in source.) (Tracked as `zdx-02` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zdx-02-concurrent-deeptrace-session-limits).)
- Alert rule-evaluation cadence — alerts fire "when condition crosses threshold," but the evaluation interval (every score update? every hour? continuously?) isn't stated. See [clarification zdx-31](../_meta/clarifications.md#zdx-31-alert-rule-evaluation-cadence).
- **Session-name wire field name (unverified).** No source enumerates the on-wire JSON field the start endpoint expects for the session name. Python `TraceDetails.request_format` maps `session_name` → `name` (`vendor/zscaler-sdk-python/zscaler/zdx/models/troubleshooting.py:120`), but the `start_deeptrace` POST body is built straight from kwargs with key `session_name` (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:182`). Whether the live API expects `name` or `session_name` is not confirmable from source. See [clarification zdx-32](../_meta/clarifications.md#zdx-32-deeptrace-session-name-wire-field).
- **`session_length` request-vs-response key (unverified).** Both the Python and Go start payloads use key `session_length_minutes` (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:182`; `vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:46`), but the Go **response** struct `TraceDetails` uses `session_length` (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:37`). Whether request and response deliberately use different keys for the same field is not confirmable from source beyond these tags. See [clarification zdx-33](../_meta/clarifications.md#zdx-33-session_length-request-vs-response-key).
- **Server-side behavior for a mismatched/non-portable probe ID (unverified).** The non-portability of `web_probe_id` / `cloudpath_probe_id` across (device, app) pairs is inferred from the device+app-nested read paths (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:358-361`, `:486-489`), not from a stated validation rule. The actual API error when a probe ID from one pair is submitted against another is not stated in source. (Tracked as `zdx-01` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zdx-01-probe-id-non-portability-server-behavior).)
- **Maximum `since` / look-back window and probe-ID expiry (unverified).** Only the 2h default is documented (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/device_web_probes.py:30`; `vendor/zscaler-mcp-server/zscaler_mcp/tools/zdx/device_cloudpath_probes.py:36`). No source states a max look-back window or whether probe IDs expire after the look-back window. See [clarification zdx-34](../_meta/clarifications.md#zdx-34-maximum-look-back-window-and-probe-id-expiry).
- **`cloud_path_probe_id` corroboration (partial).** `deeptrace_test.go` produced no grep hits for the start-payload wire keys, so the `cloud_path_probe_id` key is corroborated by the production struct tag (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:45`) and the example, but not by a serialization assertion in tests.
- **Whether `share_snapshot` actually transmits `obfuscation` (unverified).** The `share_snapshot` docstring documents an `obfuscation` argument (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:43-45`), and the reconstructed Automate contract models `obfuscation` as an optional request-body field with the documented values (`vendor/zscaler-api-specs/automate-zscaler/zdx-api-reference.json:91575-91588`). However, the body-builder only copies `name`, `alert_id`, and the converted `expiry` into the request body (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:91-106`); `obfuscation` is not in the `@zdx_params` shorthand list (`vendor/zscaler-sdk-python/zscaler/utils.py:408-420`) and is not extracted into the body here. From source alone it is unclear whether an `obfuscation` value passed by a caller reaches the API in this SDK version. The contract vocabulary is now pinned; only this Python client's transmission of the field remains open. See [clarification zdx-35](../_meta/clarifications.md#zdx-35-share_snapshot-obfuscation-transmission).

## Cross-links

- ZDX Score and baseline metrics (the input to most alert rules) — [`./overview.md`](./overview.md)
- Probes (what Diagnostics Sessions ultimately invoke) — [`./probes.md`](./probes.md)
- SDK surface (all the `client.zdx.troubleshooting.*` and `client.zdx.alerts.*` methods) — [`./api.md`](./api.md)
- ZCC entitlement (a prerequisite for ZDX data to flow at all) — [`../zcc/entitlements.md`](../zcc/entitlements.md)
