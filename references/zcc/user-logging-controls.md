---
product: zcc
topic: user-logging-controls
title: "ZCC User Logging Controls — what end users can see and suppress in client logs"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py"
author-status: draft
---

# ZCC User Logging Controls

## Scope

This document covers what **end users** can observe in their local ZCC client logs, how administrators can restrict or expand that view, and the interaction between client-side log generation and server-side cloud capture.

"Client-side logging" refers to the operational log files that ZCC writes on the endpoint device. "Server-side logging" refers to NSS/Nanolog traffic logs and ZPA LSS records that the Zscaler cloud generates independently of ZCC's local log state. These are two separate systems. Administrators control each independently. A user who cannot see their ZCC logs still generates full server-side log records — reducing client-side visibility does not suppress cloud-side capture.

This doc is complementary to [`./web-privacy.md`](./web-privacy.md), which covers what telemetry ZCC sends to the Zscaler cloud. That doc covers *collection toward the cloud*; this doc covers *visibility to the user on the device*.

---

## Two-axis control model

ZCC logging controls operate on two independent axes:

**Axis 1 — What ZCC logs locally (verbosity).** The App Profile (called "Web Policy" in the API) carries `logLevel` and `logMode` fields. These determine whether ZCC writes Error-only events, all activity at Debug, or something in between. Users can change `logMode` from the ZCC More window if the admin has not hidden logging controls.

**Axis 2 — Whether users can access those logs (visibility).** A separate global toggle, "Hide Logging Controls on Zscaler Client Connector," controls whether the logging controls surface appears to the user at all. When hidden, users cannot view logs, export them, change the log mode, or clear them — even though ZCC continues writing at whatever verbosity is configured.

These axes are independent. An admin can:

- Leave logging controls visible to the user but lock `logMode` to Error (low verbosity, user can see logs but they contain little).
- Configure Debug logging but hide logging controls (high verbosity locally, user cannot access).
- Enable both (user has full access at Debug level — typical in support triage scenarios).
- Disable both (Error logging, controls hidden — quiet by default, no user-side investigation possible without admin escalation).

Source: `vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md`; `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py` (`logLevel`, `logMode`, `logFileSize` fields on `WebPolicy`).

---

## Axis 1 — Log verbosity (log modes)

ZCC supports the following log modes, available on Windows, macOS, iOS, and Android (with the exception noted for Verbose):

| Mode | What it records |
|---|---|
| Error | Records only when the app encounters an error that affects functionality. Lowest verbosity. |
| Warn | Records potential issues and all Error-level events. |
| Info | Records general app activity plus all Warn-level events. Default in most deployments. |
| Debug | Records all app activity that could assist Zscaler Support in debugging. Highest standard verbosity. |
| Verbose | Records when invoked by external events (e.g., Firebase Push Notification or Mobile Manager flags). Android only; available on ZCC 1.5 and later for Android. |

Source: `vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md`.

The default log mode for a new App Profile is not documented in available sources — see the clarifications section below. The admin sets the allowed modes via the App Profile in the ZCC Portal; users then select among the permitted modes from the More window.

**`logFileSize`** on the `WebPolicy` model controls the maximum size of the local log file. The exact values and rotation behavior are not enumerated in the SDK model — see clarifications below. When the log file reaches its size limit, ZCC rotates it, overwriting or archiving earlier entries.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py` (`log_file_size`, `log_level`, `log_mode` fields).

---

## Axis 2 — User access to logging controls

The "Hide Logging Controls on Zscaler Client Connector" toggle lives at:

**ZCC Portal > Administration > Client Connector Support > App Supportability tab.**

When **disabled** (controls are visible), users can perform all of the following from the ZCC More window and system tray shortcut menu:

- View the location of encrypted logs on their device (via Show/Hide Logs in the Report an Issue form).
- Export logs as a ZIP file to their local device. On ZCC 2.1.2 and later for Windows and macOS, exported logs are **not encrypted** and users can read them. On versions before 2.1.2, exported logs are always encrypted and users cannot read the contents.
- Send encrypted logs to support by email. When a user requests support from the app, an encrypted log bundle is automatically emailed to the organization's support admin. If the option is enabled, it is also forwarded to Zscaler Support. Users can CC additional recipients. Users cannot read the encrypted logs sent in this path.
- Change the log mode (subject to the modes allowed in the App Profile).
- Clear logs.

When **enabled** (controls are hidden), all of the above is blocked from the user. ZCC continues writing logs at the configured verbosity, but the user has no in-app mechanism to access, export, or change them.

Source: `vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md`.

**API surface.** The hide-logging-controls toggle is a tenant-wide configuration on the App Supportability page. It is not exposed as a named field on the `WebPolicy` or `WebPrivacy` SDK models in available sources. The `export_logs_for_non_admin` field on the `WebPrivacy` object (`vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py`) controls a related but distinct concern: whether non-administrator *local OS users* can export ZCC's log bundle. These are separate controls targeting different actor classes.

---

## WebPrivacy fields that interact with logging visibility

The `WebPrivacy` object (one per tenant, managed via `client.zcc.web_privacy`) carries several fields that interact with user log access. These complement the App Supportability toggle:

| Field (Python) | Wire key | Effect on logging |
|---|---|---|
| `export_logs_for_non_admin` | `exportLogsForNonAdmin` | Whether non-admin local OS users can export ZCC's local log bundle. Off in most enterprise deployments. |
| `grant_access_to_zscaler_log_folder` | `grantAccessToZscalerLogFolder` | Whether the Zscaler log folder on the endpoint is readable by standard local OS users. Off means only admin or root can access the directory directly. |
| `enable_packet_capture` | `enablePacketCapture` | Whether endpoint users can initiate local packet captures (diagnostic use). Rarely enabled org-wide. |
| `restrict_remote_packet_capture` | `restrictRemotePacketCapture` | Whether admin-initiated remote packet capture from the ZCC Portal is permitted. Orthogonal to local capture. |

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py`.

Note: the `web_privacy.py` SDK file's `set_web_privacy_info` method also accepts `enable_auto_log_snippet` as a parameter (observed in the SDK service file), but this field is absent from the `WebPrivacy` model class. Its function is not confirmed from available sources — see clarifications below.

---

## Logged event categories

ZCC's local log contains events across several functional categories. Which categories are included depends on the active `logMode`:

| Category | Included at minimum log mode | Notes |
|---|---|---|
| Error states | Error | Application-level failures, tunnel disconnections, driver errors. Always logged. |
| Authentication events | Warn | ZIA/ZPA re-authentication attempts, token refresh, SSO negotiation. |
| Posture events | Warn | Device posture check results (posture profile evaluations, pass/fail). |
| Connection events | Info | Tunnel establishment, tunnel teardown, Service Edge selection, Z-Tunnel version negotiation. |
| Traffic redirection events | Info | Forwarding profile branch switches (trusted-to-untrusted transitions), PAC fetch events, bypass decisions. |
| PAC evaluation | Info | PAC file download, parse, and per-request PAC function evaluation results. |
| Debug trace | Debug | Full request-by-request detail, DNS resolution, socket-level events, ZPA connector selection. |

The categories above are inferred from ZCC's functional architecture; the help portal source does not enumerate log categories by name. See clarifications below.

---

## Per-platform behavior

### Windows

ZCC writes logs to a local directory under the Zscaler program data path (exact default path not confirmed from available sources). The `WindowsPolicy` sub-object on `WebPolicy` includes a `flow_logger_config` field (`flowLoggerConfig`), suggesting a separate Windows-specific flow-logging subsystem exists, though its relationship to the main ZCC operational log is not documented in available sources.

ZCC on Windows does not natively write to the Windows Event Log for operational entries in standard deployments. Diagnostic bundles exported via the Report an Issue form contain the ZCC log files as well as supporting system artifacts.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py` (`WindowsPolicy.flow_logger_config`).

### macOS

On macOS, ZCC writes to a local log directory. Whether ZCC also emits entries to the macOS Unified Logging System (OSLog / `log show`) is not confirmed in available sources. The macOS platform sub-policy (`MacOSPolicy`) carries no log-specific fields in the SDK model.

### Linux

Linux is supported as a ZCC platform. The `LinuxPolicy` sub-object on `WebPolicy` carries only password and certificate fields; no Linux-specific log configuration fields appear in the model. Whether ZCC on Linux integrates with the system journal (journald / syslog) is not confirmed from available sources. See clarifications.

### Android

The `AndroidPolicy` sub-object on `WebPolicy` includes `enable_verbose_log` (`enableVerboseLog`). This field enables the Verbose log mode on Android, which corresponds to the Verbose log mode described in the log modes table above (Firebase/Mobile Manager triggered, ZCC 1.5+). This is the only per-platform log verbosity field visible in the model.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py` (`AndroidPolicy.enable_verbose_log`).

### iOS

The `IOSPolicy` sub-object carries no log-specific fields. The Verbose log mode is Android-only. User-accessible log controls on iOS follow the same App Supportability toggle as other platforms, but the iOS ZCC app's UI capabilities and platform constraints differ from desktop. Specific iOS limitations on log export or in-app viewer are not enumerated in available sources. See clarifications.

---

## Log levels vs log modes

ZCC uses two related but distinct concepts:

**Log mode** (user-facing term in the ZCC UI and help documentation) — the operational verbosity level: Error, Warn, Info, Debug, Verbose. Users select log mode from the More window; admins configure which modes are available in the App Profile.

**Log level** — the `logLevel` field on the `WebPolicy` SDK object. The relationship between `logLevel` (an API field) and `logMode` (a UI/help concept) is not fully documented in available sources. They may be the same concept with different naming conventions across API and UI layers, or they may represent distinct dimensions. See clarifications below.

---

## Diagnostic bundle vs in-UI log viewer

ZCC provides two mechanisms for log access:

**In-UI log viewer** — the in-app log view available from the More window when logging controls are not hidden. Shows entries at the current log mode verbosity.

**Diagnostic bundle** — the ZIP file produced by "Export Logs" (from the system tray menu) or the encrypted bundle sent via "Report an Issue." The diagnostic bundle includes the full ZCC log files. On ZCC 2.1.2 and later for Windows and macOS, the exported (non-encrypted) ZIP is readable by the user. The encrypted bundle sent via Report an Issue is not readable by the user.

Key distinction: the diagnostic bundle produced at the moment of export reflects whatever has been logged on disk, which may include entries from a previous log mode (e.g., a brief Debug session followed by reversion to Info). The in-UI viewer may apply a filter that only shows the current session or the current mode. Whether the bundle and the viewer always reflect the same log content is not confirmed in available sources. See clarifications.

---

## Retention and rotation

Client-side log retention is governed by `logFileSize` on the `WebPolicy` object. When the log file reaches the configured maximum size, ZCC rotates it. Specific rotation semantics — whether ZCC keeps a fixed number of rotated archives, the default file size limit, and the maximum configurable limit — are not enumerated in the SDK model or available help source. See clarifications below.

The server-side data-plane logs (ZIA NSS/Nanolog, ZPA LSS) have their own retention policies independent of client-side log rotation. ZIA admin audit logs are retained for 6 months (source: `vendor/zscaler-help/admin-rbac-captures.md`). ZIA traffic data-plane logs follow NSS/Nanolog retention, which is cloud-side and not affected by ZCC client log settings.

---

## Configuration — App Profile fields that drive logging

The `WebPolicy` object (App Profile in the admin console) carries the primary logging knobs:

| Field (Python) | Wire key | Function |
|---|---|---|
| `log_level` | `logLevel` | Log level / verbosity setting at the policy layer. Relationship to `logMode` not fully resolved — see clarifications. |
| `log_mode` | `logMode` | Log mode (Error / Warn / Info / Debug). Drives what ZCC writes locally. Users can change within this mode if controls are visible. |
| `log_file_size` | `logFileSize` | Maximum size of the local log file before rotation. Exact units and values not enumerated in SDK. |

These fields apply at the App Profile level, meaning different user groups can receive different logging configurations by assigning them to different App Profiles. See [`./web-policy.md`](./web-policy.md) for App Profile structure.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`.

**App Supportability toggle** (hide logging controls) is configured via the ZCC Portal admin console at Administration > Client Connector Support > App Supportability tab. It is tenant-wide rather than per-profile. A single toggle covers all users in the tenant.

Source: `vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md`.

### SDK access

App Profile logging fields are read and written via `client.zcc.web_policy`:

```python
# Read current App Profile (includes logMode, logLevel, logFileSize)
profiles, response, error = client.zcc.web_policy.list_by_company()

# Update log mode on an existing profile
updated, response, error = client.zcc.web_policy.web_policy_edit(
    id=profile_id,
    log_mode="Debug",
    log_level="Debug",
)
```

WebPrivacy log-folder access fields are read and written via `client.zcc.web_privacy`:

```python
# Restrict log folder access to local admins only
result, response, error = client.zcc.web_privacy.set_web_privacy_info(
    export_logs_for_non_admin=False,
    grant_access_to_zscaler_log_folder=False,
)
```

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py`; `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`.

---

## Privacy-driven suppression and compliance considerations

### What "hiding logging controls" does and does not do

Hiding the logging controls from users (App Supportability toggle) prevents users from viewing, exporting, or modifying local ZCC logs through the ZCC UI. It does not:

- Suppress ZCC local log file creation. ZCC continues writing at the configured verbosity.
- Suppress cloud-side log capture. ZIA NSS records, ZPA LSS records, and ZIA admin audit logs continue independently.
- Prevent a local OS administrator from reading the log files directly (unless `grant_access_to_zscaler_log_folder` is also disabled via WebPrivacy).

For organizations with HIPAA, GDPR, or similar obligations that require minimizing what endpoint users can see about their own traffic (e.g., shared clinical workstations, kiosk deployments), the correct combination is:

1. Enable "Hide Logging Controls" at the App Supportability level — user cannot access in-app log view or export.
2. Set `grant_access_to_zscaler_log_folder = false` via WebPrivacy — standard OS users cannot browse the log directory.
3. Set `export_logs_for_non_admin = false` via WebPrivacy — non-admin users cannot export the log bundle.
4. Set `log_mode` to Error or Warn via App Profile — minimizes volume of data written locally.

Even with all four in place, the ZCC diagnostic log files remain on the endpoint's disk and are accessible to any local OS administrator. An endpoint user with administrator privileges, or an attacker with local admin access, can read the log files directly regardless of ZCC's UI controls. The files may contain hostnames, IP addresses, and connection metadata at Info or Debug verbosity.

### Diagnostic bundle contents under privacy suppression

When a support engineer requests a diagnostic bundle from a device (via "Report an Issue"), the encrypted bundle contains the current on-disk log files at their full verbosity — even if the user-facing controls are hidden. An admin who processes the encrypted bundle at Zscaler Support receives the log content at whatever `logMode` was active. If Debug logging was enabled for triage and then reverted, rotated logs from the Debug session may still be included in the bundle. This is a common compliance oversight: the bundle escapes the same content that the UI suppression was intended to hide from the user.

For regulated environments, consider setting `logMode` to Info or Warn as the standing configuration, increasing to Debug only for confirmed triage windows, and confirming that old rotated logs from Debug sessions are cleared before closing the triage window.

### What remains in the diagnostic bundle

At Info log mode, a diagnostic bundle typically contains connection events, authentication events, and traffic redirection events. Hostnames and IP addresses appear in connection and redirection events. URL paths do not appear in ZCC's own operational log (ZCC is a transport-layer client, not a content proxy; individual URL paths are a ZIA-side concern). Whether the diagnostic bundle includes any ZIA traffic metadata beyond what ZCC writes itself is not confirmed. See clarifications.

---

## ZIA-side logging independent of ZCC client settings

ZIA generates its own traffic logs regardless of what ZCC logs or exposes locally. These include:

- Web transaction logs (URL, response code, action, category, user identity) — streamed via NSS/Nanolog.
- Firewall logs — for traffic handled by the ZIA cloud firewall.
- DNS logs — for DNS queries resolved by ZIA.
- ZIA admin audit logs (6-month retention) — changes made by ZIA administrators.

None of these are affected by ZCC client-side log settings. An organization that sets `logMode=Error` and hides logging controls from users still produces full ZIA web logs for every URL the user visits. The user cannot see these logs through the ZCC client; they are accessible only to ZIA administrators via the NSS feed or the ZIA Admin Portal.

ZPA LSS logs — which record application access sessions through ZPA — are similarly cloud-side and independent of ZCC client log settings.

See [`../zia/api.md`](../zia/api.md) for ZIA API surface, and the ZIA logs directory (`references/zia/logs/`) for NSS/Nanolog field schemas.

---

## Operational gotchas

### Disabling user-visible logging while leaving cloud logging on

Hiding logging controls does not suppress cloud-side log capture. An operator who hides logging controls to "reduce logging" for privacy has only affected what the user can view locally. ZIA, ZPA, and ZDX continue to capture data at their normal granularity. This is frequently misunderstood in privacy conversations: the ZCC client UI is not the data collection layer; it is the user-visibility layer.

### Users blaming the client when the block is cloud-side

When logging controls are visible and a user sees connection activity in the ZCC log, they may conclude that ZCC is "blocking" a site when the block decision was made at the ZIA cloud. ZCC's log shows tunnel activity (connection established, traffic forwarded) but does not show ZIA's policy action (block, allow, bypass). Users who see "I can see the connection in my ZCC log but the site is blocked" are correctly observing that ZCC delivered the traffic to ZIA — the block happened at the service edge, not in the client. Directing users to the ZCC log to diagnose ZIA policy blocks is misdirection.

### Client-side vs ZIA-side log granularity mismatch

ZCC logs connection-level events. ZIA logs transaction-level events. A user's ZCC log at Info mode may show a single "tunnel connection established" event for an HTTPS session that, at the ZIA side, produced 50 web transaction log entries (for each HTTP/2 stream over the connection). An admin investigating a user complaint by reading only the ZCC log will see a dramatically less granular picture than the ZIA NSS feed provides.

### App Profile update propagation

App Profile changes (including `logMode`, `logLevel`, and `logFileSize` changes) propagate to connected endpoints only when the user logs out and logs back in, or when ZCC restarts. There is no real-time push to currently-connected devices. An admin who increases `logMode` to Debug during a triage window should confirm the ZCC restart has occurred before expecting Debug-level logs. Source: `vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md` (referenced in [`./forwarding-profile.md`](./forwarding-profile.md)).

### `export_logs_for_non_admin` vs App Supportability toggle

These two controls address different actors. The App Supportability "Hide Logging Controls" toggle is a UI-level control that applies to all users of the ZCC app regardless of their local OS role. The `export_logs_for_non_admin` WebPrivacy field applies at the OS-user level: it restricts whether a local OS non-administrator account can export ZCC logs through whatever mechanism ZCC exposes at the OS level (distinct from the in-app export button). Both should be configured consistently for regulated environments.

### ZCC version 2.1.2 threshold for readable exports

On ZCC before 2.1.2 (Windows and macOS), exported logs are always encrypted and users cannot read them. On 2.1.2 and later, the exported ZIP is plaintext-readable. Tenants that upgraded to 2.1.2+ and left "Hide Logging Controls" disabled transitioned from a state where users could export but not read the logs, to a state where users can both export and read them. This is a behavior change that may have compliance implications if the organization previously relied on the encryption as a control.

Source: `vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md`.

---

## Cross-links

- WebPrivacy object (telemetry collection, hostname/user info collection, packet capture, crashlytics) — [`./web-privacy.md`](./web-privacy.md)
- App Profile / WebPolicy structure (logMode, logLevel, logFileSize, per-platform sub-policies) — [`./web-policy.md`](./web-policy.md)
- Install-time parameters (no install-time logging parameters documented; relevant for VDI and anti-tampering) — [`./install-parameters.md`](./install-parameters.md)
- Forwarding profile (traffic forwarding decisions visible in ZCC connection logs) — [`./forwarding-profile.md`](./forwarding-profile.md)
- ZCC SDK (web_policy and web_privacy API access patterns) — [`./sdk.md`](./sdk.md)
- ZIA API (ZIA-side log APIs, admin audit logs, NSS/Nanolog) — [`../zia/api.md`](../zia/api.md)
