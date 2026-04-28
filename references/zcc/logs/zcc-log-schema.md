---
product: zcc
topic: "zcc-log-schema"
title: "ZCC diagnostic and activity log schema — local endpoint logs"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py"
author-status: draft
---

# ZCC diagnostic and activity log schema — local endpoint logs

ZCC writes operational logs to the endpoint device. These logs cover tunnel lifecycle, authentication, posture evaluation, forwarding profile decisions, and ZCC internal errors. They do **not** carry individual web transaction records (URL, response code, policy action) — that data lives exclusively in ZIA's NSS/Nanolog stream. ZCC logs are transport-layer; ZIA logs are application-layer.

This document covers what ZCC logs contain, the log modes and their coverage, how to access logs, the SDK/API surface for log configuration, and the interaction with server-side cloud logging.

For the corresponding ZIA-side user/group policy that governs log visibility, see [`../user-logging-controls.md`](../user-logging-controls.md). For cross-product log correlation (how to join ZCC device context to ZIA/ZPA records), see [`../../shared/log-correlation.md`](../../shared/log-correlation.md).

---

## Architecture: client-side vs server-side logging

ZCC logging operates on two independent axes that are easy to conflate:

| Axis | What it covers | Who controls it | Where it lives |
|---|---|---|---|
| **ZCC client-side log** | Tunnel events, auth events, forwarding decisions, errors — endpoint-side perspective | Admin via App Profile + App Supportability toggle | Endpoint disk; user-accessible ZIP or support bundle |
| **ZIA NSS / Nanolog** | Web transactions, firewall sessions, DNS queries — cloud-side observation | Admin via NSS feed config | ZIA cloud → SIEM |
| **ZPA LSS** | ZPA application access sessions — cloud-side | Admin via LSS receiver config | ZPA cloud → App Connector → SIEM |

Reducing client-side log verbosity does **not** suppress cloud-side log capture. A user whose ZCC logging controls are hidden still generates full ZIA web logs and ZPA LSS records for every session (Tier A — vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md).

---

## Log modes and event coverage

ZCC supports five log modes. The active mode is configured in the App Profile (`WebPolicy.logMode`) (Tier A — vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md):

| Mode | Events recorded | Typical use |
|---|---|---|
| `Error` | Application-level failures affecting functionality. Lowest verbosity. | Production default (quiet) |
| `Warn` | Potential issues + all Error events | Recommended production baseline |
| `Info` | General app activity + all Warn events | Normal operations monitoring |
| `Debug` | All activity that could assist Zscaler Support in debugging | Active triage / support escalation |
| `Verbose` | External-event-triggered logging (Firebase Push Notification, Mobile Manager flags). **Android only, ZCC 1.5+.** | Mobile diagnostic scenarios |

### Event categories by minimum log mode

The following event categories are inferred from ZCC's functional architecture. Zscaler does not publish a formal category-to-mode mapping in available sources (Tier C — inferred from functional decomposition):

| Category | Available at | Description |
|---|---|---|
| Application errors | Error | Tunnel disconnections, driver errors, fatal ZCC failures. Always logged. |
| Authentication | Warn | ZIA/ZPA re-authentication, token refresh, SSO negotiation |
| Posture checks | Warn | Device posture profile evaluations, pass/fail results |
| Tunnel lifecycle | Info | Tunnel establishment/teardown, Service Edge selection, Z-Tunnel version negotiation (1.0 vs 2.0) |
| Forwarding profile events | Info | Trusted-network branch switches (on-network → off-network), PAC fetch events, bypass decisions |
| PAC evaluation | Info | PAC file download, parse, per-request PAC function evaluation results |
| Debug trace | Debug | Full request-by-request detail, DNS resolution, socket-level events, ZPA connector selection |

---

## Log access methods

### User access (when logging controls are visible)

From the ZCC More window and system tray menu (Tier A — vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md):

| Method | Description | Notes |
|---|---|---|
| In-app log viewer | View log entries at current verbosity in the ZCC More window | Available when logging controls are not hidden |
| Export as ZIP | Save log bundle to local device | On ZCC 2.1.2+ (Windows/macOS): exported ZIP is **plaintext-readable** by user. On earlier versions: always encrypted. |
| Report an Issue | Send encrypted log bundle by email to org support admin; optionally forward to Zscaler Support | Bundle is always encrypted regardless of ZCC version; user cannot read it |
| Clear logs | Remove current log contents | Available in More window |

The admin controls visibility of all the above via the **App Supportability** toggle: Administration > Client Connector Support > App Supportability > `Hide Logging Controls on Zscaler Client Connector`. This is tenant-wide (applies to all users) (Tier A — vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md).

### Admin/support access

- **ZCC Portal diagnostic bundle**: admins can request a diagnostic bundle from a specific device via the ZCC Portal. The bundle contains the full on-disk log files at their current verbosity, regardless of whether user-facing controls are hidden.
- **Direct file access**: log files are written to a local directory on the endpoint. Local OS administrators can read the files directly. The `grantAccessToZscalerLogFolder` WebPrivacy field controls whether non-admin OS users can access the directory.

---

## Log file format and storage

ZCC does not emit structured JSON or syslog format to an external receiver. Logs are written as flat operational event files on the endpoint. The file format is opaque — ZCC's log viewer renders the entries; exported plaintext ZIPs are human-readable but are not in a standard ingestion format (JSON, CEF, syslog) for SIEM parsing.

**File location**: the exact default path is platform-specific and not confirmed in available captures. On Windows, logs are in the Zscaler program data directory. On macOS, in the Zscaler application support directory.

**Rotation**: controlled by `logFileSize` on the `WebPolicy` object. When the log file reaches the configured size, ZCC rotates it. The number of retained rotated archives, default size limit, and maximum configurable size are not documented in available sources (Tier D — not confirmed from captures).

**Platform-specific behavior**:

| Platform | Notes |
|---|---|
| Windows | `WindowsPolicy.flowLoggerConfig` field on `WebPolicy` suggests a separate Windows-specific flow logging subsystem. Relationship to main operational log is not confirmed. ZCC does not write to Windows Event Log in standard deployments. |
| macOS | ZCC writes to a local log directory. Whether it integrates with macOS Unified Logging (OSLog) is not confirmed. |
| Linux | Supported as a ZCC platform. Whether ZCC integrates with journald/syslog is not confirmed. |
| Android | `AndroidPolicy.enableVerboseLog` enables the Verbose log mode (Firebase/Mobile Manager triggered, ZCC 1.5+). |
| iOS | No log-specific platform fields in available sources. The Verbose mode is Android-only. |

---

## SDK and API surface for log configuration

Log verbosity and access controls are configured via the `WebPolicy` and `WebPrivacy` SDK objects.

### WebPolicy (App Profile) — log verbosity fields

Managed via `client.zcc.web_policy` (Tier A — vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py):

| Python field | Wire key | Function |
|---|---|---|
| `log_level` | `logLevel` | Log level at the policy layer. Relationship to `logMode` not fully resolved — may be the same concept with different naming across API/UI layers. |
| `log_mode` | `logMode` | Active log mode: `Error`, `Warn`, `Info`, `Debug`. |
| `log_file_size` | `logFileSize` | Maximum local log file size before rotation. Units and values not enumerated in SDK. |

App Profile changes propagate to connected endpoints **only on user logout/login or ZCC restart** — there is no real-time push to currently-connected devices.

```python
# Read current App Profile (includes logMode, logLevel, logFileSize)
profiles, response, error = client.zcc.web_policy.list_by_company()

# Set to Debug for a triage window
updated, response, error = client.zcc.web_policy.web_policy_edit(
    id=profile_id,
    log_mode="Debug",
    log_level="Debug",
)
```

### WebPrivacy — log folder and export access controls

Managed via `client.zcc.web_privacy` (Tier A — vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py):

| Python field | Wire key | Effect |
|---|---|---|
| `export_logs_for_non_admin` | `exportLogsForNonAdmin` | Whether non-admin local OS users can export ZCC's log bundle |
| `grant_access_to_zscaler_log_folder` | `grantAccessToZscalerLogFolder` | Whether the ZCC log folder on disk is readable by standard local OS users |
| `enable_packet_capture` | `enablePacketCapture` | Whether endpoint users can initiate local packet captures |
| `restrict_remote_packet_capture` | `restrictRemotePacketCapture` | Whether admin-initiated remote packet capture from the ZCC Portal is permitted |

```python
# Lock log folder to local admins only
result, response, error = client.zcc.web_privacy.set_web_privacy_info(
    export_logs_for_non_admin=False,
    grant_access_to_zscaler_log_folder=False,
)
```

---

## What ZCC logs contain vs do not contain

| Data element | In ZCC log? | Where to find it instead |
|---|---|---|
| Tunnel establishment/teardown | Yes (Info+) | ZCC log |
| Z-Tunnel version negotiated (1.0 vs 2.0) | Yes (Info+) | ZCC log; also `%s{ztunnelversion}` in ZIA NSS web/firewall logs |
| ZPA connector selected for session | Yes (Debug) | ZCC log |
| Forwarding profile branch switch | Yes (Info+) | ZCC log |
| Individual web transaction URL | **No** | ZIA NSS web log: `%s{url}`, `%s{host}` |
| HTTP response code | **No** | ZIA NSS web log: `%s{respcode}` |
| Policy action (allow/block) | **No** | ZIA NSS web log: `%s{action}`, `%s{rulelabel}` |
| DLP event | **No** | ZIA NSS web log: `%s{dlpdict}`, `%s{dlpeng}` |
| ZPA application access (per-session) | **No** | ZPA LSS User Activity: `ApplicationName`, `ConnectionStatus` |
| Device posture result | Yes (Warn+) | ZCC log; also surfaces in ZIA policy engine |

**Key misunderstanding to correct**: users who see ZCC as "blocking" a site are misattributing a ZIA cloud block to ZCC. ZCC's log shows tunnel activity (traffic delivered to ZIA); it does not show ZIA's policy action. Directing users to read ZCC logs to diagnose a ZIA URL filter block is misdirection — the block decision is in ZIA web logs, not in ZCC logs.

---

## Operational gotchas

### Debug logs in diagnostic bundles after reversion

If Debug logging was enabled for a triage session and then reverted to Info, rotated log files from the Debug session may still be on disk and included in the next diagnostic bundle export. This can expose detailed connection and DNS resolution information that the reversion to Info was intended to suppress. Clear rotated logs explicitly after closing a Debug triage window.

### ZCC 2.1.2 threshold: encrypted vs readable exports

On ZCC before 2.1.2 (Windows/macOS): exported logs are always encrypted; users cannot read them. On 2.1.2 and later: the exported ZIP is plaintext-readable. Tenants that upgraded past 2.1.2 with user-facing logging controls still visible transitioned from "export but cannot read" to "export and read." Verify App Supportability toggle state after upgrading (Tier A — vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md).

### App Profile update propagation delay

`logMode` and `logLevel` changes take effect on the next ZCC restart or user re-login. An admin who raises logMode to Debug during an active triage session must confirm the ZCC restart has occurred before expecting Debug-level entries. There is no real-time push.

### Client log granularity vs ZIA granularity

ZCC logs connection-level events. ZIA NSS logs transaction-level events. A single ZCC "tunnel established" log entry may correspond to 50+ ZIA web transaction records (one per HTTP/2 stream). Investigating a user complaint using only ZCC logs produces a dramatically less granular picture than the ZIA NSS feed. Always pull the ZIA-side logs for URL-level investigation.

---

## Cross-links

- User logging controls (admin configuration of log visibility and verbosity) — [`../user-logging-controls.md`](../user-logging-controls.md)
- WebPolicy / App Profile structure — [`../web-policy.md`](../web-policy.md)
- WebPrivacy (telemetry collection, log folder access) — [`../web-privacy.md`](../web-privacy.md)
- Cross-product log correlation (how to join ZCC device context to ZIA/ZPA records) — [`../../shared/log-correlation.md`](../../shared/log-correlation.md)
- ZIA web log schema (where URL-level transaction data lives) — [`../../zia/logs/web-log-schema.md`](../../zia/logs/web-log-schema.md)
- ZPA LSS access log schema (where ZPA session data lives) — [`../../zpa/logs/access-log-schema.md`](../../zpa/logs/access-log-schema.md)
