---
product: zcc
topic: "zcc-web-privacy"
title: "ZCC web privacy — telemetry and log-collection policy"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py"
  - "vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md"
  - "vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md"
author-status: draft
---

# ZCC web privacy — telemetry and log-collection policy

`WebPrivacy` is the admin-configurable object that controls what ZCC collects from endpoints, what it reports back to the Zscaler cloud, and what access end users have to their local ZCC logs and support tools. It is relevant to privacy/compliance conversations, to "why is this data in our Zscaler logs?" questions, and to "why can't users export logs?" help desk escalations.

## What web privacy controls are

Web privacy settings are admin-configurable limits on what ZCC logs about user activity and what it reports to the Zscaler cloud. They do not affect ZIA policy enforcement — they affect what telemetry is collected and surfaced. A tenant with strict privacy requirements (e.g., regulated industries, works councils in the EU) uses these settings to narrow the data ZCC reports, independently of whether ZIA or ZPA policy is enforced.

Two distinct configuration surfaces govern web privacy:

1. **The `WebPrivacy` API object** — a single per-tenant singleton that controls data-collection flags (hostname collection, user identity collection, ZDX location, crash reporting, packet capture, log folder access). Configurable via API/SDK.
2. **The App Supportability page** in the ZCC Portal (Administration > Client Connector Support > App Supportability tab) — controls user-facing logging and support actions (hide/show logging controls, support access, log forwarding to Zscaler Support). Configurable only through the admin console UI.

These two surfaces are separate. A privacy-forward admin must configure both.

---

## What ZCC sees vs what ZIA cloud logs

ZCC acts as a local agent that intercepts traffic before it enters the Z-Tunnel. It has access to endpoint context that ZIA cloud never sees directly:

| Data element | ZCC sees | ZIA cloud logs | Controlled by |
|---|---|---|---|
| Machine hostname | Yes — at registration | Yes, if `collectMachineHostname = true` | `WebPrivacy.collect_machine_hostname` |
| OS-level username | Yes — at login | Yes, if `collectUserInfo = true` | `WebPrivacy.collect_user_info` |
| ZDX endpoint location / network path | Yes — via UPM sensors | Yes, if both ZDX location toggles are true | `WebPrivacy.collect_zdx_location` + `ZdxGroupEntitlements.collect_zdx_location` |
| Crash telemetry (mobile) | Yes — via Crashlytics | Goes to Google infrastructure, not ZIA | `WebPrivacy.disable_crashlytics` |
| Local packet captures | Yes — if enabled | Not forwarded to cloud (local only) | `WebPrivacy.enable_packet_capture` |
| Remote packet captures (admin-triggered) | Yes — if allowed | Controlled separately | `WebPrivacy.restrict_remote_packet_capture` |
| User identity (SAML/LDAP) | Yes — at auth | Always present in ZIA logs post-auth | Not controllable via WebPrivacy |
| URL categories and destinations | Yes — for forwarding decisions | Always present in ZIA traffic logs | ZIA URL filtering policy, not ZCC |

The key distinction: **ZCC can suppress endpoint-context metadata** (hostname, OS username, location) from being reported upward. It cannot suppress ZIA's visibility into what traffic flows through the Z-Tunnel — ZIA cloud logs traffic details independently.

---

## WebPrivacy SDK fields — full reference

From `vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py` (Tier B — SDK/TF):

| Python field | Wire key (camelCase) | Type | Role |
|---|---|---|---|
| `id` | `id` | int | Tenant-scoped ID of this singleton object. |
| `active` | `active` | bool | Whether this web-privacy config is live. Single-object per tenant; typically always true. |
| `collect_machine_hostname` | `collectMachineHostname` | bool | When true, ZCC reports the endpoint's machine hostname to the Zscaler cloud. When false, hostnames are redacted from NSS/LSS fields and the ZCC portal device inventory. |
| `collect_user_info` | `collectUserInfo` | bool | When true, ZCC reports the OS-level logged-in username to the cloud. When false, logs show device-level identity (UDID) without the OS username. |
| `collect_zdx_location` | `collectZdxLocation` | bool | When true (at WebPrivacy level), enables ZDX location data collection. **Must also be true on `ZdxGroupEntitlements.collect_zdx_location`** — both must be set for collection to occur. |
| `disable_crashlytics` | `disableCrashlytics` | bool | When true, disables Google Crashlytics crash reporting on mobile ZCC builds (iOS, Android). When false, crash telemetry leaves ZCC toward Google infrastructure. |
| `enable_packet_capture` | `enablePacketCapture` | bool | When true, allows endpoints to capture network packets locally for diagnostic purposes. Capture stays on the device; not forwarded to cloud. Rarely enabled org-wide. |
| `restrict_remote_packet_capture` | `restrictRemotePacketCapture` | bool | When true, prevents admin-triggered remote packet capture from the ZCC portal. Independent of local packet capture above. |
| `export_logs_for_non_admin` | `exportLogsForNonAdmin` | bool | When true, non-admin local users can export ZCC's local log bundle (ZIP file via system tray). When false, only local admins/root can export. |
| `grant_access_to_zscaler_log_folder` | `grantAccessToZscalerLogFolder` | bool | When true, the Zscaler log folder on the endpoint is readable by standard OS users. When false, only admin/root can access the folder path. |
| `override_t2_protocol_setting` | `overrideT2ProtocolSetting` | bool | Overrides the Z-Tunnel 2.0 protocol selection behavior at the tenant level. Leave false unless debugging Z-Tunnel 2.0 transport issues under Zscaler Support direction. |

All fields are boolean. The object is a singleton — `get_web_privacy()` returns exactly one object; there is no list.

---

## App Supportability page — logging control settings

Navigation: ZCC Portal > Administration > Client Connector Support > App Supportability tab (Tier A — vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md).

This page controls what users can do with logging and support features from the ZCC system tray and More window. These settings are separate from the `WebPrivacy` API object — they are console-only and have no corresponding SDK fields.

### Logging controls for users

The **Hide Logging Controls on Zscaler Client Connector** toggle (Tier A — vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md):

| Toggle state | What users can do |
|---|---|
| **Disabled** (logging controls visible) | See where encrypted logs are stored; export logs as ZIP; send encrypted logs by email; change log mode; clear logs |
| **Enabled** (logging controls hidden) | None of the above — all logging controls are hidden from the ZCC UI |

When logging controls are visible, users can change the log mode from the More window. The available log modes (set by App Profile, surfaced to users if the control is not hidden):

| Log mode | What it logs |
|---|---|
| `Error` | Only when the app encounters an error affecting functionality |
| `Warn` | Potential issues or any Error conditions |
| `Info` | General app activity plus Warn conditions |
| `Debug` | All app activity useful for Zscaler Support debugging, plus Info conditions |
| `Verbose` | Invoked by external events (Firebase Push Notification, Mobile Manager flags). Android only, ZCC 1.5+. |

Admins set the log mode baseline in the App Profile. The App Supportability toggle controls whether users can override it locally.

**Encryption note:** For ZCC 2.1.2+ (Windows and macOS), exported logs are unencrypted but logs sent via Report an Issue are encrypted. For versions before 2.1.2, all exported logs are encrypted and users cannot view them (Tier A — vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md).

### Support access settings

The **Enable Support Access in Zscaler Client Connector** setting controls user access to the Report an Issue form (Tier A — vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md):

| Setting | Description |
|---|---|
| `Enable Support Access` | Allows users to access Report an Issue. Encrypted logs attach automatically to the submitted email. |
| `Admin Email Address to Send Logs` | Destination for user support requests. Accepts multiple addresses separated by commas. |
| `Enable End User Ticket Submission to Zscaler` | When enabled, a ticket is automatically sent to Zscaler Support whenever a user submits Report an Issue. Encrypted logs attach. Only Zscaler can decrypt these logs. |
| `Client Connector App Logs` | Allows per-device log collection from the Enrolled Devices view (Device Details tab > Fetch Logs). Admin-side action. |

---

## Log mode and App Profile relationship

The App Profile (WebPolicy) sets the baseline log mode for each user population. The App Supportability toggle controls whether users can change it locally. These are independent knobs:

- `WebPrivacy` controls what telemetry reaches the cloud.
- App Profile `log_level` / `log_mode` controls the verbosity of ZCC's own operational logs on the endpoint.
- App Supportability controls user access to change or export those local logs.

An admin who wants maximum diagnostic data without user interference sets: App Profile log mode = `Debug`, App Supportability = logging controls hidden (users can't lower verbosity), WebPrivacy collection flags as needed.

---

## Interactions worth knowing

### `collect_user_info = false`

ZIA and ZPA logs show ZCC-connection-level identity (device UDID, ZCC session) but not the OS username. Operators who assume user-level attribution in logs while this flag is false will see "anonymous" or device-only entries. This is the first flag to check when a tenant reports "our Zscaler logs don't show usernames." It affects all future logs — existing historical data is not changed.

### ZDX location dual-toggle

`collect_zdx_location` on `WebPrivacy` AND `collect_zdx_location` on `ZdxGroupEntitlements` must both be true for ZDX to collect location data. If a tenant enables ZDX location via Web Privacy and sees no location data, check the entitlement-side flag (and vice versa). See [`./entitlements.md`](./entitlements.md).

### `enable_packet_capture` and `restrict_remote_packet_capture` are orthogonal

Local packet capture (end-user or admin on the device) is governed by `enable_packet_capture`. Admin-triggered remote capture from the ZCC portal is governed by `restrict_remote_packet_capture`. Both can independently be on or off:

| `enable_packet_capture` | `restrict_remote_packet_capture` | Effect |
|---|---|---|
| true | false | Local and remote capture both allowed |
| true | true | Local capture allowed; remote capture blocked |
| false | false | Local capture blocked; remote capture allowed |
| false | true | Both blocked |

### Crashlytics is third-party telemetry

`disable_crashlytics = false` (the default) means crash telemetry from mobile ZCC builds may leave the device toward Google Crashlytics infrastructure. Compliance reviewers in regulated environments should be aware. Enable `disable_crashlytics = true` to suppress.

### Changes affect future logs only

Web privacy settings apply from the moment they are saved forward. Historical NSS/LSS data retains whatever collection state was active at the time those events were generated. Enabling `collect_machine_hostname` after-the-fact does not backfill hostnames into historical records.

---

## API surface

From `vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py` (Tier B — SDK/TF), all methods on `client.zcc.web_privacy`:

| Method | HTTP | Path | Notes |
|---|---|---|---|
| `get_web_privacy()` | GET | `/zcc/papi/public/v1/webPrivacy/listByCompany` | Returns the single per-tenant WebPrivacy object. |
| `set_web_privacy_info(**kwargs)` | PUT/POST | `/zcc/papi/public/v1/webPrivacy/edit` | Updates fields. Pass the full object shape; partial updates may not be supported. |

No `list` method exists — the single-object pattern is enforced at the SDK layer.

---

## Privacy compliance patterns

### EU Works Council / GDPR-sensitive deployment

Typical configuration for highest-privacy deployment:

- `collect_machine_hostname = false` — no endpoint hostnames in cloud logs.
- `collect_user_info = false` — no OS usernames in cloud logs.
- `collect_zdx_location = false` (both objects) — no endpoint location data collected.
- `disable_crashlytics = true` — no crash data to Google.
- `export_logs_for_non_admin = false` — users cannot self-export logs.
- `grant_access_to_zscaler_log_folder = false` — users cannot browse log files.
- App Supportability: Hide Logging Controls = enabled (users cannot change log mode or export).
- App Supportability: Enable Support Access = disabled (no Report an Issue to Zscaler).

### Standard enterprise deployment

Typical configuration for a standard enterprise:

- `collect_machine_hostname = true` — needed for device inventory correlation.
- `collect_user_info = true` — needed for user-level attribution in ZIA logs.
- `collect_zdx_location = true` (both objects) — needed for ZDX digital-experience monitoring.
- `disable_crashlytics = false` — allow Zscaler to receive crash data for product improvement.
- `export_logs_for_non_admin = false` — prevent casual log export; require IT involvement.
- `grant_access_to_zscaler_log_folder = false` — same.
- App Supportability: Enable Support Access = enabled; Admin Email = helpdesk@company.com.

---

## Operational gotchas

- **Hostname collection and device inventory**: `collect_machine_hostname = false` means the ZCC portal Enrolled Devices list may show blank or placeholder hostnames. Inventory tools that rely on hostname-enriched ZCC data (e.g., SIEM correlation) will miss this field.
- **`WebPrivacy` vs `WebPolicy` log settings confusion**: `WebPrivacy` controls what gets collected and where it's exposed; `WebPolicy.log_level` / `log_mode` controls verbosity of ZCC's own operational logs. Distinct dimensions. An admin asking "how do I make ZCC logs more verbose for debugging" wants `WebPolicy`; an admin asking "how do I stop ZCC from reporting usernames" wants `WebPrivacy`.
- **No Terraform resource**: There is no ZCC Terraform provider in the vendor sources. `WebPrivacy` is configurable only via the Python SDK API method `set_web_privacy_info` or directly through the ZCC Portal's UI. IaC management requires direct API calls.
- **App Supportability is console-only**: The App Supportability settings (logging controls visibility, support access) have no SDK methods and no API surface in the available vendor sources. These settings must be managed through the ZCC Portal UI.

---

## Cross-links

- Entitlements (ZDX location dual-toggle dependency) — [`./entitlements.md`](./entitlements.md)
- Web Policy (log verbosity, App Profile log mode setting) — [`./web-policy.md`](./web-policy.md)
- Devices (device inventory, hostname display) — [`./devices.md`](./devices.md)
- ZCC API surface — [`./api.md`](./api.md)
