---
product: zdx
topic: "zdx-diagnostics-and-alerts"
title: "ZDX Diagnostics Sessions (deeptraces) and Alerts"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/zdx/understanding-diagnostics-session-status"
  - "vendor/zscaler-help/understanding-diagnostics-session-status.md"
  - "https://help.zscaler.com/zdx/understanding-alert-status"
  - "vendor/zscaler-help/understanding-alert-status.md"
  - "vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py"
  - "vendor/zscaler-sdk-python/zscaler/zdx/alerts.py"
author-status: draft
---

# ZDX Diagnostics Sessions and Alerts

The two operator-facing workflows in ZDX beyond the dashboards: **Diagnostics Sessions** for on-demand deep investigation of a specific device, and **Alerts** for threshold-based notification when scores or metrics degrade.

## Summary

- **Diagnostics Session** — admin starts an on-demand probe campaign targeted at one device. ZCC runs intensified probes for a configured window, streams 1-minute-resolution data back to ZDX, and produces a detailed forensic report. Used for "this one user is reporting an issue and I need detail now." **The SDK/MCP term is "deeptrace"** — same thing, different vocabulary.
- **Alerts** — rule-based notifications when configured metrics cross thresholds. Surface in ZDX dashboard, can webhook out. Alert status lifecycle captures rule changes in the audit trail.

## Mechanics

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

## Edge cases

- **Session started on a newly-enrolled device**: initial probes may have no baseline to compare against. Score during the session shows raw metrics rather than a useful 0-100 number.
- **Session across a network transition** (user disconnects from Wi-Fi, switches to LTE mid-session): data stream may show a gap. Events endpoint (`get_deeptrace_events`) correlates the gap with the network-interface change.
- **Session started but device is on a trusted network with ZCC `actionType: NONE`**: probes still run — ZCC's probe path is independent of the forwarding-profile branch. A common operator surprise ("why does ZDX work on trusted networks when ZIA doesn't?" — because ZDX uses its own probe path, not the ZIA tunnel).
- **Alerts on 0-availability probes**: may fire briefly on a transient network issue (one failed probe → availability = 0 for that window). Tune alert duration minimums to avoid flap.
- **Historical alerts with status `Completed by Modified Rule`**: the alert's thresholds as-displayed may be the new-rule thresholds, not the thresholds that were active when the alert fired. Treat thresholds on historical alerts as "current rule snapshot," not "as-fired."

## Open questions

- What the configurable session duration range is (the help doc doesn't specify minimum or maximum).
- Per-probe cadence during a session — is it still 5 minutes, or does the session intensify to faster cadence?
- How many concurrent sessions are allowed per tenant, per device.
- Alert rule-evaluation cadence — alerts fire "when condition crosses threshold," but the evaluation interval (every score update? every hour? continuously?) isn't stated.

## Cross-links

- ZDX Score and baseline metrics (the input to most alert rules) — [`./overview.md`](./overview.md)
- Probes (what Diagnostics Sessions ultimately invoke) — [`./probes.md`](./probes.md)
- SDK surface (all the `client.zdx.troubleshooting.*` and `client.zdx.alerts.*` methods) — [`./api.md`](./api.md)
- ZCC entitlement (a prerequisite for ZDX data to flow at all) — [`../zcc/entitlements.md`](../zcc/entitlements.md)
