---
product: zcc
topic: support-options
title: "ZCC End-User Support Options — diagnostics, feedback, and self-service controls"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py"
  - "vendor/zscaler-help/legacy-about-error-codes-zcc.md"
  - "vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md"
  - "references/zcc/web-policy.md"
  - "references/zcc/web-privacy.md"
  - "references/zcc/sdk.md"
  - "references/zcc/install-parameters.md"
author-status: draft
---

# ZCC End-User Support Options — diagnostics, feedback, and self-service controls

## Definition

Zscaler Client Connector exposes a support menu to end users through the More window and the system tray icon. Users reach these options by clicking "Report an Issue" from either surface. The admin-configurable options on this menu determine what users can do without involving IT: submit a support request, export encrypted diagnostic logs, disable or repair the agent, and view their identity. The controls are configured globally per tenant from the ZCC Portal at **Administration > Client Connector Support > App Supportability**. [Source: vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md]

These are distinct from:

- **Per-platform password gates** on the Web Policy (App Profile), which are per-OS controls for disable, logout, and uninstall passwords — see [`./web-policy.md`](./web-policy.md).
- **Web Privacy toggles**, which control what telemetry ZCC collects and what local log access non-admins have — see [`./web-privacy.md`](./web-privacy.md).
- **Install-time parameters**, which configure UI visibility and anti-tampering at deploy time — see [`./install-parameters.md`](./install-parameters.md).

---

## Configurable options

The following options appear on the App Supportability tab of the Client Connector Support page. [Source: vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md]

### Enable Support Access in Zscaler Client Connector

Master toggle. When enabled, users can access the "Report an Issue" form from the More window or system tray. The form submission sends an email containing the form data and an attachment of encrypted logs to the designated admin email address. Only Zscaler can decrypt those logs.

When this toggle is off, no "Report an Issue" option is visible to users. All other options in this section that depend on support access being enabled are effectively inert when this is off.

### Admin Email Address to Send Logs

Required when support access is enabled. One or more email addresses (comma-separated) that receive the Report an Issue submission, including the encrypted log attachment. This is the organization's support inbox or distribution list, not Zscaler Support.

### Enable End User Ticket Submission to Zscaler

Optional secondary action. When enabled, a support ticket is automatically opened with Zscaler Support whenever a user submits Report an Issue. Encrypted logs are attached to the Zscaler Support ticket automatically. This setting is only available when support access is enabled.

The two routing paths (internal admin email and Zscaler ticket) are independent: neither enables the other. An admin can route to Zscaler only, to the internal inbox only, or to both.

### Hide Logging Control on Zscaler Client Connector

When this toggle is enabled (hidden), users cannot export or clear logs, and cannot change the Log Mode that the Zscaler admin has set via App Profiles. When this toggle is disabled (visible), users can send an email copy of their Report an Issue form data along with encrypted logs from the ZCC interface. [Source: vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md]

Note the inverted naming: "Hide Logging Control" being enabled means the control is hidden from users.

### Client Connector App Logs (admin-side fetch)

Admins can fetch logs per enrolled device from the ZCC Portal at Enrolled Devices > Device Details > Fetch Logs. This is an admin-initiated action, not a user-facing option. It operates independently of whether user-facing support access is enabled. [Source: vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md]

---

## Per-platform password gates (Web Policy / App Profile)

Beyond the App Supportability controls above, the Web Policy object (called App Profile in the admin UI) carries per-platform password gates for user actions that could remove or disable ZCC protection. These are configured per-platform under the per-platform sub-policy blocks and are separate from the App Supportability toggles. [Source: references/zcc/web-policy.md]

The password fields applicable across platforms are:

| Field | Wire key | Platform availability | Purpose |
|---|---|---|---|
| `disable_password` | `disablePassword` | Windows, macOS, Linux | Password required for a user to disable ZCC service components |
| `logout_password` | `logoutPassword` | Windows, macOS, Linux, Android, iOS | Password required for a user to log out of ZCC |
| `uninstall_password` | `uninstallPassword` | Windows, macOS, Linux | Password required for a user to uninstall ZCC |

These passwords are stored per platform sub-policy on the Web Policy object. Setting them to empty removes the gate. The passwords are not stored in plain text in snapshots — they are represented as empty strings on read and replaced on write.

For bulk programmatic management, the `manage_pass` endpoint at `/zcc/papi/public/v1/managePass` (Go SDK only; no Python service module) accepts a `ManagePass` struct per `policyName` and `deviceType` with the following fields:

| Go field | Wire key | Purpose |
|---|---|---|
| `ExitPass` | `exitPass` | Password to exit or quit ZCC |
| `LogoutPass` | `logoutPass` | Password to log out |
| `UninstallPass` | `uninstallPass` | Password to uninstall |
| `ZadDisablePass` | `zadDisablePass` | Password to disable ZAD (device posture) |
| `ZdpDisablePass` | `zdpDisablePass` | Password to disable ZDP |
| `ZdxDisablePass` | `zdxDisablePass` | Password to disable ZDX |
| `ZiaDisablePass` | `ziaDisablePass` | Password to disable ZIA |
| `ZpaDisablePass` | `zpaDisablePass` | Password to disable ZPA |

[Source: vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go]

The Python SDK has the matching `ManagePass` model in `vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py` but has no service module exposing the POST call. Operators needing to manage passwords programmatically must use the Go SDK or call `POST /zcc/papi/public/v1/managePass` directly.

---

## Per-platform availability

The App Supportability toggles are applied at the tenant level and affect ZCC on all platforms where those UI surfaces exist. Platform-specific notes:

| Platform | Report an Issue / support form | Logging control visibility | Password gates (disable / logout / uninstall) |
|---|---|---|---|
| Windows | Available via system tray More menu and ZCC window | Configurable | All three available via Web Policy windowsPolicy |
| macOS | Available via menu bar icon More menu and ZCC window | Configurable | All three available via Web Policy macPolicy |
| Linux | Available | Configurable | Available via Web Policy linuxPolicy |
| iOS | Available via in-app menu | Configurable | Subset available via Web Policy iosPolicy |
| Android / ChromeOS | Available via in-app menu | Configurable | Subset available via Web Policy androidPolicy |

Platform-specific password field availability for mobile (iOS, Android) differs from desktop — mobile sub-policies carry `logout_password` but the uninstall and disable paths may not surface as UI-gated actions in the same way. Exact mobile field enumeration should be verified against a live tenant's Web Policy sub-policy objects. [Partially sourced; see Deferred section.]

---

## Default-on vs default-off

The following summarizes which options are enabled for a new tenant before any configuration:

| Option | Default state |
|---|---|
| Enable Support Access in Zscaler Client Connector | Off (users see no Report an Issue form) |
| Admin Email Address to Send Logs | Empty (must be configured before enabling support access) |
| Enable End User Ticket Submission to Zscaler | Off |
| Hide Logging Control on Zscaler Client Connector | Off (logging controls are visible to users by default) |
| Disable / logout / uninstall passwords on Web Policy | Not set (no password gate by default) |

Defaults are inferred from the vendor documentation's description of configuration steps required to activate each option. The source does not explicitly enumerate "default state" per toggle. [Partially inferred; see Deferred section.]

---

## Diagnostic bundle contents

When a user submits Report an Issue, ZCC assembles an encrypted log bundle attached to the outbound email and (if configured) to the Zscaler Support ticket. Key characteristics:

- **Encryption**: Logs are encrypted. Only Zscaler can decrypt them. The admin receiving the email receives the encrypted attachment but cannot read its contents directly. [Source: vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md]
- **Contents inferred from ZCC's logging architecture**: The bundle is expected to include ZCC client operational logs, ZCC service logs, and system metadata. The vendor source does not enumerate specific file names or directories included in the bundle.
- **Storage and routing**: The bundle is attached to an email sent to the configured admin inbox. If Zscaler ticket submission is enabled, the same bundle is attached to the resulting support ticket. No separate cloud-side storage of bundles is described in the vendor documentation.
- **Admin-initiated fetch**: Admins can also trigger log collection per enrolled device from the ZCC Portal (Enrolled Devices > Device Details > Fetch Logs). This is distinct from the user-initiated bundle and does not require the user to take any action.

The `export_logs_for_non_admin` flag on the `WebPrivacy` object controls whether non-admin local OS users can export ZCC's local log bundle independently. The `grant_access_to_zscaler_log_folder` flag controls whether the Zscaler log folder on the endpoint is readable by standard local users. Both default to off in enterprise tenants. [Source: references/zcc/web-privacy.md]

Specific file paths, log rotation behavior, bundle size limits, and PII content of the encrypted bundle are not documented in available vendor sources. [See Deferred section.]

---

## Disable and repair gating

### Disabling ZCC

Preventing users from disabling ZCC is achieved through two independent mechanisms:

1. **Password gate on the Web Policy per-platform sub-policy**: The `disable_password` field on `windowsPolicy`, `macPolicy`, and `linuxPolicy` requires users to enter a password before the disable action completes. An empty value means no password is required.

2. **Anti-tampering at the install parameter level** (`ENABLEANTITAMPERING=1` on Windows): Prevents users from stopping or modifying ZCC services at the OS service layer, not just at the ZCC UI level. This is configured at install time and can be overridden by the App Profile "Override Anti Tampering" setting. [Source: references/zcc/install-parameters.md]

These two mechanisms operate at different layers. A password gate blocks the ZCC UI action; anti-tampering blocks OS-level service manipulation regardless of UI. For maximum enforcement, both should be configured.

Per-product disable passwords (ZIA, ZPA, ZDX, ZDP, ZAD) are managed through the `manage_pass` endpoint and are independent of the whole-agent disable password. A user with no whole-agent disable password but with a `ziaDisablePass` set must enter a password only to disable ZIA, not to disable ZPA or the agent itself.

### Password rotation

Passwords on the Web Policy per-platform sub-policies are updated by editing the sub-policy object via the API and writing a new password value. The `manage_pass` endpoint similarly accepts a full replacement set of passwords per policy name and device type. There is no password history or rotation enforcement in the API; the operator supplies the new value and it takes effect immediately on next policy sync to enrolled devices.

Policy changes propagate to enrolled devices on the next ZCC restart or user logout/login event, not immediately. [Source: references/zcc/forwarding-profile.md — app profile update propagation note]

---

## Logging and admin visibility

The vendor documentation does not describe an audit trail for user-invoked support actions (Report an Issue submissions, log exports). The ZCC admin portal does expose the Enrolled Devices view with device-level details, and the Fetch Logs action is admin-initiated rather than user-initiated.

For admin-side audit coverage of configuration changes to the App Supportability settings themselves, ZCC does not have a documented admin audit log API in available sources. The shared audit log reference (`references/shared/audit-logs.md`) confirms that no ZCC audit API package was found in either SDK. [Source: references/_clarifications.md — shared/audit-logs.md findings]

The `download_disable_reasons` endpoint (`GET /downloadDisableReasons`, available via the Python SDK `devices.download_disable_reasons()`) provides a CSV export of reasons users gave when disabling ZCC. This is the closest available admin-side visibility into user-initiated disable events. [Source: references/zcc/sdk.md]

---

## SDK and API configuration

### App Supportability settings

The App Supportability page toggles (support access, admin email, Zscaler ticket routing, logging control visibility) are managed through the ZCC Portal UI or via direct API calls to the ZCC management API. Neither the Python SDK nor the Go SDK exposes a named service module for the App Supportability endpoint. Operators configuring these settings programmatically must call the underlying API directly. [Deferred — no SDK source confirms the endpoint path; see Deferred section.]

### Password management

The `manage_pass` endpoint provides API access to per-policy per-platform per-product password management:

- **Endpoint**: `POST /zcc/papi/public/v1/managePass`
- **Go SDK**: `manage_pass.UpdateManagePass(ctx, service, &managePass)` — available in `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/`
- **Python SDK**: No service module. The model class `ManagePass` exists at `vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py` but the POST call must be made directly or through the Go SDK.

[Source: vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go; vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py]

### Web Privacy settings

`export_logs_for_non_admin` and `grant_access_to_zscaler_log_folder` are configurable via the Web Privacy API:

- **Python SDK**: `client.zcc.web_privacy.set_web_privacy_info(export_logs_for_non_admin=False, grant_access_to_zscaler_log_folder=False)`
- **Endpoint**: `PUT /zcc/papi/public/v1/setWebPrivacyInfo`

[Source: references/zcc/web-privacy.md; references/zcc/sdk.md]

### Per-platform password gates via Web Policy

Managed through the Web Policy edit endpoint:

- **Python SDK**: `client.zcc.web_policy.web_policy_edit(**kwargs)` — `PUT /zcc/papi/public/v1/web/policy/edit`
- **Go SDK**: `web_policy.GetAll`, edit functions in `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/`

Password fields are nested inside the per-platform sub-policy objects (`windowsPolicy.disablePassword`, etc.). Changes require an activation call to take effect: `client.zcc.web_policy.activate_web_policy(device_type=..., policy_id=...)`. [Source: references/zcc/web-policy.md; references/zcc/sdk.md]

---

## Privacy and compliance considerations

### Diagnostic bundles and PII

Diagnostic log bundles submitted through Report an Issue contain ZCC client logs. The vendor documentation states logs are encrypted and only Zscaler can decrypt them. Despite this encryption, the bundle may contain:

- Network connection metadata (destination IPs, ports, hostnames)
- User identity information (username, tenant domain)
- Device identifiers (UDID, machine hostname)
- Timestamps of user activity correlated with connection events

Admins should consider whether submitting bundles to Zscaler Support is consistent with their organization's data residency and privacy requirements, particularly where local-only log handling is mandated. The admin email path keeps the bundle within the organization's mail infrastructure; the Zscaler ticket path sends it to Zscaler's support systems.

### Web Privacy controls and PII collection scope

The `WebPrivacy` object governs what ZCC collects at the endpoint:

- `collect_machine_hostname`: When off, hostnames are redacted from cloud logs.
- `collect_user_info`: When off, user identity is anonymized or device-only in Zscaler cloud logs.
- `disable_crashlytics`: When false, crash telemetry on mobile ZCC builds may reach Google infrastructure (Crashlytics). Compliance reviewers should account for this third-party data flow.

[Source: references/zcc/web-privacy.md]

### Log export by non-admin users

`export_logs_for_non_admin` and `grant_access_to_zscaler_log_folder` both default to off. Enabling either gives standard local OS users access to ZCC's operational logs, which may contain sensitive network activity metadata. These flags should remain off in regulated environments unless there is a specific operational need.

---

## Operational gotchas

### Locking out users from all support options creates help-desk burden

Disabling all end-user support access (no Report an Issue, no logging controls, anti-tampering enabled, all passwords set) means users cannot self-serve any diagnostic or connectivity issue. Every ZCC problem becomes a help-desk ticket requiring an admin to either fetch logs remotely from the Enrolled Devices view, or to temporarily unlock the device. In environments with a low IT-to-user ratio, this can create significant operational drag during ZCC incidents affecting many users simultaneously.

A common middle-ground posture: enable support access and the Report an Issue form (so users can submit logs to the help desk), hide logging controls (so users cannot change log verbosity or clear logs), and set uninstall and disable passwords (so users cannot remove or bypass ZCC). This provides a diagnostic path without giving users the ability to weaken the security posture.

### Encrypted-logs-only means admin triage is Zscaler-dependent

Because the log bundle attached to Report an Issue is encrypted and only Zscaler can decrypt it, the admin inbox receives a bundle they cannot inspect directly. If Zscaler ticket submission is not enabled, the admin must manually open a Zscaler Support ticket and forward the encrypted attachment. Enabling "End User Ticket Submission to Zscaler" automates this but means every user-submitted Report an Issue automatically creates a Zscaler Support ticket, which may not be appropriate for all issue types.

Consider the volume implications before enabling automatic Zscaler ticket creation in large deployments.

### Policy propagation delay

Changes to App Supportability settings, Web Policy password gates, and Web Privacy flags propagate to enrolled endpoints on the next ZCC restart or user logout/login event. There is no real-time push. An admin who enables a new password gate expecting it to protect devices immediately will find existing sessions are unaffected until those devices reconnect. [Source: references/zcc/forwarding-profile.md — app profile update propagation note]

### `download_disable_reasons` rate limit

The `GET /downloadDisableReasons` endpoint shares the 3-calls-per-day rate limit bucket with `/downloadDevices` and `/downloadServiceStatus`. Automated reporting pipelines that pull all three CSV exports daily must account for this combined limit against the 3-per-day cap per IP per organization. [Source: vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md]

### Anti-tampering and Citrix VDI

On Windows with Citrix VDI, `ENABLEANTITAMPERING` interacts with `HIDEAPPUIONLAUNCH`. If `STRICTENFORCEMENT=1` is also in play, `HIDEAPPUIONLAUNCH` must be set to `0` for non-persistent Citrix VDIs. Anti-tampering in VDI environments should be validated in a test deployment before fleet rollout. [Source: references/zcc/install-parameters.md]

---

## Cross-links

- Per-platform disable, logout, and uninstall password configuration — [`./web-policy.md`](./web-policy.md)
- Telemetry, log-collection scope, and non-admin log export flags — [`./web-privacy.md`](./web-privacy.md)
- SDK service catalog including `manage_pass`, `devices.download_disable_reasons`, and Web Privacy API — [`./sdk.md`](./sdk.md)
- Anti-tampering, `HIDEAPPUIONLAUNCH`, and install-time UI controls — [`./install-parameters.md`](./install-parameters.md)
- App Profile update propagation timing — [`./forwarding-profile.md`](./forwarding-profile.md)
