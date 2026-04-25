---
product: zcc
topic: "zcc-web-privacy"
title: "ZCC web privacy — telemetry and log-collection policy"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py"
author-status: draft
---

# ZCC web privacy — telemetry and log-collection policy

`WebPrivacy` is a small tenant-scoped object that controls what telemetry ZCC collects from endpoints and what access end-users have to their local ZCC logs. Relevant to privacy/compliance conversations and to "why is this info in our Zscaler logs" questions.

## Summary

Single per-tenant object (the `list_by_company` / `get_web_privacy` pattern returns one) carrying ~10 boolean-or-enum flags. Each flag either widens or narrows what ZCC reports back to the Zscaler cloud or what the user / local admin can access on-device.

## Mechanics

### Fields

From `zscaler/zcc/models/webprivacy.py`:

| Field | Wire key | Role |
|---|---|---|
| `active` | `active` | Whether this web-privacy config is live (single-object, so typically always true). |
| `collect_machine_hostname` | `collectMachineHostname` | Send the endpoint's machine hostname up to Zscaler. Off = hostnames redacted in logs. Affects NSS/LSS `hostname`-equivalent fields. |
| `collect_user_info` | `collectUserInfo` | Whether ZCC reports user identity (logged-in OS user) to the cloud. Off = logs show anonymized or device-only identity. Privacy-forward tenants commonly disable. |
| `collect_zdx_location` | `collectZdxLocation` | Whether ZDX collects location/network data for user-experience monitoring. **Also referenced from `ZdxGroupEntitlements`** — both objects must agree for ZDX location collection to fire. |
| `disable_crashlytics` | `disableCrashlytics` | Disable Google Crashlytics crash reporting on mobile ZCC builds. |
| `enable_packet_capture` | `enablePacketCapture` | Whether endpoints can capture packets locally (diagnostic only; rarely enabled org-wide). |
| `restrict_remote_packet_capture` | `restrictRemotePacketCapture` | Whether admin-initiated remote packet capture from ZCC portal is allowed. |
| `export_logs_for_non_admin` | `exportLogsForNonAdmin` | Whether non-admin local users can export ZCC's local log bundle. Usually off in enterprise tenants. |
| `grant_access_to_zscaler_log_folder` | `grantAccessToZscalerLogFolder` | Whether the Zscaler log folder on the endpoint is readable by standard local users. Off means only admin/root can access. |
| `override_t2_protocol_setting` | `overrideT2ProtocolSetting` | Overrides the Z-Tunnel 2.0 protocol selection behavior — rarely touched, leave alone unless debugging Z-Tunnel 2.0 transport issues. |

### Interactions worth knowing

- **`collect_user_info = false`** means ZIA/ZPA logs may show ZCC-connection-level identity (device UDID) but not the OS username. A tenant that sees "anonymized" logs while operators assume user-level tracking is enabled should check this flag first.
- **`collect_zdx_location`** is ignored at the ZCC level if ZDX entitlement doesn't also include the user. See [`./entitlements.md`](./entitlements.md) — `ZdxGroupEntitlements.collect_zdx_location` is the ZDX-side toggle.
- **`enable_packet_capture` + `restrict_remote_packet_capture`** are orthogonal: local end-user capture vs admin-triggered remote capture. Both can be on, both can be off, either can be on independently.

## API surface

From `zscaler/zcc/web_privacy.py`, all methods hang off `client.zcc.web_privacy`:

- `get_web_privacy()` — retrieve the single per-tenant web-privacy object.
- `set_web_privacy_info(**kwargs)` — update fields.

There is no `list` — the single-object pattern is enforced at the SDK layer.

## Edge cases

- **A change here affects future logs only.** Historical NSS/LSS data retains whatever collection state was active at the time. "I just turned on `collect_user_info`; why don't old logs have usernames?" — they never will; only new events are affected.
- **Inconsistency with `WebPolicy.log_level` / `log_mode`** is possible — Web Privacy controls *what gets collected and where it's exposed*; Web Policy's log settings control *verbosity of ZCC's own operational logs*. Distinct dimensions.
- **Crash reporting involves a third-party (Crashlytics)** — `disable_crashlytics = false` means crash telemetry may leave ZCC toward Google infrastructure. Compliance reviewers should know.

## Cross-links

- Entitlements (ZDX location-collection dependency) — [`./entitlements.md`](./entitlements.md)
- Web policy (log verbosity / uninstall protections) — [`./web-policy.md`](./web-policy.md)
- ZCC API / wire format — [`./api.md`](./api.md)
