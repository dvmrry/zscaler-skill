---
product: zcc
topic: support-options
title: "ZCC End-User Support Options — diagnostics, feedback, and self-service controls"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/company.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/company_info.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/company/company.go"
  - "vendor/zscaler-help/legacy-about-error-codes-zcc.md"
  - "vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md"
author-status: draft
---

# ZCC End-User Support Options — diagnostics, feedback, and self-service controls

## Definition

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

Zscaler Client Connector exposes a support menu to end users through the More window and the system tray icon. Users reach these options by clicking "Report an Issue" from either surface. The admin-configurable options on this menu determine what users can do without involving IT: submit a support request, export encrypted diagnostic logs, disable or repair the agent, and view their identity. The controls are configured globally per tenant from the ZCC Portal at **Administration > Client Connector Support > App Supportability**.

These are distinct from:

- **Per-platform password gates** on the Web Policy (App Profile), which are per-OS controls for disable, logout, and uninstall passwords — see [`./web-policy.md`](./web-policy.md).
- **Web Privacy toggles**, which control what telemetry ZCC collects and what local log access non-admins have — see [`./web-privacy.md`](./web-privacy.md).
- **Install-time parameters**, which configure UI visibility and anti-tampering at deploy time — see [`./install-parameters.md`](./install-parameters.md).

---

## Configurable options

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

The following options appear on the App Supportability tab of the Client Connector Support page.

### Enable Support Access in Zscaler Client Connector

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

Master toggle. When enabled, users can access the "Report an Issue" form from the More window or system tray. The form submission sends an email containing the form data and an attachment of encrypted logs to the designated admin email address. Only Zscaler can decrypt those logs.

When this toggle is off, no "Report an Issue" option is visible to users. All other options in this section that depend on support access being enabled are effectively inert when this is off.

### Admin Email Address to Send Logs

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

Required when support access is enabled. One or more email addresses (comma-separated) that receive the Report an Issue submission, including the encrypted log attachment. This is the organization's support inbox or distribution list, not Zscaler Support.

### Enable End User Ticket Submission to Zscaler

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

Optional secondary action. When enabled, a support ticket is automatically opened with Zscaler Support whenever a user submits Report an Issue. Encrypted logs are attached to the Zscaler Support ticket automatically. This setting is only available when support access is enabled.

The two routing paths (internal admin email and Zscaler ticket) are independent: neither enables the other. An admin can route to Zscaler only, to the internal inbox only, or to both.

### Hide Logging Control on Zscaler Client Connector

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

When this toggle is enabled (hidden), users cannot export or clear logs, and cannot change the Log Mode that the Zscaler admin has set via App Profiles. When this toggle is disabled (visible), users can send an email copy of their Report an Issue form data along with encrypted logs from the ZCC interface.

Note the inverted naming: "Hide Logging Control" being enabled means the control is hidden from users.

### Client Connector App Logs (admin-side fetch)

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`; `vendor/zscaler-sdk-python/zscaler/zcc/models/company_info.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/company/company.go`.

Admins can fetch logs per enrolled device from the ZCC Portal at Enrolled Devices > Device Details > Fetch Logs. This is an admin-initiated action, not a user-facing option. It operates independently of whether user-facing support access is enabled.

The toggle has SDK backing on the company-info surface: `fetchLogsForAdminsEnabled` (`vendor/zscaler-sdk-python/zscaler/zcc/models/company_info.py`:67; Go `FetchLogsForAdminsEnabled int` at `vendor/zscaler-sdk-go/zscaler/zcc/services/company/company.go`:42). Like the other company-info support fields, it is readable from both SDKs but writable only via the Go `SetCompanyInfo` path (`company.go`:355, `PUT /zcc/papi/public/v1/setCompanyInfo` via endpoint constant at line 14); the Go field is `int`-typed, not `bool`.

---

## Per-platform password gates (Web Policy / App Profile)

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`.

Beyond the App Supportability controls above, the Web Policy object (called App Profile in the admin UI) carries per-platform password gates for user actions that could remove or disable ZCC protection. These are configured per-platform under the per-platform sub-policy blocks and are separate from the App Supportability toggles.

The password fields exist on every per-platform sub-policy, but **the wire key is not uniform across platforms** — the Windows and Android sub-policies read snake_case keys while macOS, Linux, and iOS read camelCase. A reader who copies a single camelCase key (or a single snake_case key) into a payload for the wrong platform will have it silently dropped on read. The SDK Python attribute name (`disable_password` / `logout_password` / `uninstall_password`) is uniform; only the JSON wire key differs:

| SDK attribute | Purpose | Windows wire key | macOS / Linux / iOS wire key | Android wire key |
|---|---|---|---|---|
| `disable_password` | Password required for a user to disable ZCC service components | `disable_password` | `disablePassword` | `disable_password` |
| `logout_password` | Password required for a user to log out of ZCC | `logout_password` | `logoutPassword` | `logout_password` |
| `uninstall_password` | Password required for a user to uninstall ZCC | `uninstall_password` | `uninstallPassword` | `uninstall_password` |

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`. `WindowsPolicy` (class at line 804) reads `config["disable_password"]` (line 820), `config["logout_password"]` (line 841), and `config["uninstall_password"]` (line 848). `LinuxPolicy` (class at line 914) reads `config["disablePassword"]` (line 929), `config["logoutPassword"]` (line 931), and `config["uninstallPassword"]` (line 932). `IOSPolicy` (class at line 954) reads `config["disablePassword"]` (line 969), `config["logoutPassword"]` (line 970), and `config["uninstallPassword"]` (line 971). `MacOSPolicy` (class at line 1077) reads `config["disablePassword"]` (line 1095) and `config["logoutPassword"]` (line 1107). `AndroidPolicy` (class at line 1002) is mixed: it reads `config["disable_password"]` (line 1022), `config["logout_password"]` (line 1027), and `config["uninstall_password"]` (line 1029) in snake_case, but `config["installCerts"]` (line 1025) in camelCase.

The `request_format()` serializers are mostly symmetric with the read keys — Windows writes `disable_password` (line 888) / `logout_password` (line 897) / `uninstall_password` (line 904); Linux writes `disablePassword` (line 945); iOS writes `disablePassword` (line 991) — **with one exception**: `MacOSPolicy` reads camelCase but *writes snake_case* — its `request_format()` emits `disable_password` (line 1135), `logout_password` (line 1141), and `uninstall_password` (line 1143) even though `__init__` read those values from `disablePassword` / `logoutPassword` / `uninstallPassword`. The macOS read key and write key therefore differ, which means a naive read-modify-write through the Python model can move the macOS password between key names.

These passwords are stored per platform sub-policy on the Web Policy object. Setting them to empty removes the gate. The passwords are not stored in plain text in snapshots — they are represented as empty strings on read and replaced on write.

> This camelCase/snake_case split per sub-policy is a cross-source divergence captured in [`./api-divergences.md`](./api-divergences.md) (see the *Web Policy — Python per-class wire-key serializer* and `install_ssl_certs` / `installCerts` entries): the same logical field uses different wire keys depending on platform, with no uniform SDK abstraction over the JSON key — and `MacOSPolicy` even reads one casing and writes the other (per the serializer note above).

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`; `vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py`.

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

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py`; `vendor/zscaler-sdk-python/zscaler/zcc/zcc_service.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`.

The Python SDK has the matching `ManagePass` model but has no service module exposing the POST call through `ZCCService`. Operators needing to manage passwords programmatically must use the Go SDK or call `POST /zcc/papi/public/v1/managePass` directly.

### Two surfaces for per-product disable passwords

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`.

`manage_pass` is **not** the only place per-product disable passwords live. The top-level `WebPolicy` object also carries per-product disable-password fields directly, alongside an agent-level exit password:

| WebPolicy attribute | Wire key | webpolicy.py line |
|---|---|---|
| `exit_password` | `exitPassword` | 354 |
| `zdx_disable_password` | `zdxDisablePassword` | 356 |
| `zd_disable_password` | `zdDisablePassword` | 357 |
| `zpa_disable_password` | `zpaDisablePassword` | 358 |
| `zdp_disable_password` | `zdpDisablePassword` | 359 |
| `zcc_fail_close_settings_exit_uninstall_password` | `zccFailCloseSettingsExitUninstallPassword` | 434 |

So the same per-product passwords are reachable two ways, and they differ in shape:

- **WebPolicy fields** are read+write on the policy object itself (`PUT /web/policy/edit`, `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`:152 / endpoint at line 452), so they round-trip on read and are editable in place. These are the per-product passwords that travel with the App Profile.
- **`manage_pass` fields** are a write-only bulk POST keyed per `policyName` / `deviceType` (`PolicyName` / `DeviceType` declared on the `ManagePass` struct at `manage_pass.go`:22 / :19; `POST /zcc/papi/public/v1/managePass` via endpoint constant `manage_pass.go`:14 and the `NewZccRequestDo` POST at line 41) with no corresponding read on that endpoint.

The mapping is not one-to-one: `manage_pass` exposes `ZiaDisablePass` (`ziaDisablePass`) but the WebPolicy top-level object has no `ziaDisablePassword` field; conversely WebPolicy carries `zdDisablePassword` (a "ZD"-prefixed key, line 357) that the `manage_pass` `ZadDisablePass` (`zadDisablePass`) does not obviously name the same way. Which surface is authoritative when both are set — and how the `ziaDisablePass` / `zdDisablePassword` naming reconciles — is not determinable from the SDK source alone; see "## Open questions".

---

## Per-platform availability

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`; `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`.

The App Supportability toggles are applied at the tenant level and affect ZCC on all platforms where those UI surfaces exist. Platform-specific notes:

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`.

| Platform | Report an Issue / support form | Logging control visibility | disable / logout / uninstall password fields on the sub-policy |
|---|---|---|---|
| Windows | Available via system tray More menu and ZCC window | Configurable | All three present (`WindowsPolicy`, lines 820 / 841 / 848) |
| macOS | Available via menu bar icon More menu and ZCC window | Configurable | All three present (`MacOSPolicy`, lines 1095 / 1107 / 1111) |
| Linux | Available | Configurable | All three present (`LinuxPolicy`, lines 929 / 931 / 932) |
| iOS | Available via in-app menu | Configurable | All three present (`IOSPolicy`, lines 969 / 970 / 971) |
| Android / ChromeOS | Available via in-app menu | Configurable | All three present (`AndroidPolicy`, lines 1022 / 1027 / 1029) |

All five per-platform sub-policy classes carry the same three password fields (`disable_password`, `logout_password`, `uninstall_password`) as model attributes; the earlier characterization of mobile (iOS/Android) carrying only a "subset" is not borne out by the SDK model. Whether each gate surfaces as a user-facing UI action on a given OS is a client-runtime behavior the SDK model does not assert — see "## Open questions".

---

## Default-on vs default-off

The following summarizes which options are enabled for a new tenant before any configuration:

| Option | Backing field (SDK) | Default state |
|---|---|---|
| Enable Support Access in Zscaler Client Connector | `supportEnabled` | Off (users see no Report an Issue form) |
| Admin Email Address to Send Logs | `supportAdminEmail` | Empty (must be configured before enabling support access) |
| Enable End User Ticket Submission to Zscaler | `supportTicketEnabled` | Off |
| Hide Logging Control on Zscaler Client Connector | `disableLoggingControls` | Off (logging controls are visible to users by default) |
| Admin-side log fetch from Enrolled Devices | `fetchLogsForAdminsEnabled` | Off (admins enable before fetching device logs) |
| Disable / logout / uninstall passwords on Web Policy | per-platform sub-policy fields | Not set (no password gate by default) |

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`; `vendor/zscaler-sdk-python/zscaler/zcc/models/company_info.py`.

The backing-field column maps each toggle to its named field on the `CompanyInfo` model: `supportEnabled` (`company_info.py`:65), `supportAdminEmail` (line 64), `supportTicketEnabled` (line 70), `disableLoggingControls` (line 73), and `fetchLogsForAdminsEnabled` (line 67). The *default values themselves* are inferred from the vendor documentation's description of configuration steps required to activate each option; the SDK model declares the fields but does not assert their tenant-default value, so the "Default state" column remains help-doc-sourced — see "## Open questions".

---

## Diagnostic bundle contents

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

When a user submits Report an Issue, ZCC assembles an encrypted log bundle attached to the outbound email and (if configured) to the Zscaler Support ticket. Key characteristics:

- **Encryption**: Logs are encrypted. Only Zscaler can decrypt them. The admin receiving the email receives the encrypted attachment but cannot read its contents directly.
- **Contents inferred from ZCC's logging architecture**: The bundle is expected to include ZCC client operational logs, ZCC service logs, and system metadata. The vendor source does not enumerate specific file names or directories included in the bundle.
- **Storage and routing**: The bundle is attached to an email sent to the configured admin inbox. If Zscaler ticket submission is enabled, the same bundle is attached to the resulting support ticket. No separate cloud-side storage of bundles is described in the vendor documentation.
- **Admin-initiated fetch**: Admins can also trigger log collection per enrolled device from the ZCC Portal (Enrolled Devices > Device Details > Fetch Logs). This is distinct from the user-initiated bundle and does not require the user to take any action.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py`.

The `export_logs_for_non_admin` flag on the `WebPrivacy` object controls whether non-admin local OS users can export ZCC's local log bundle independently. The `grant_access_to_zscaler_log_folder` flag controls whether the Zscaler log folder on the endpoint is readable by standard local users. Both default to off in enterprise tenants.

Specific file paths, log rotation behavior, bundle size limits, and PII content of the encrypted bundle are not documented in available vendor sources. See "## Open questions".

---

## Disable and repair gating

### Disabling ZCC

Preventing users from disabling ZCC is achieved through two independent mechanisms:

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`.

1. **Password gate on the Web Policy per-platform sub-policy**: The disable-password field on each per-platform sub-policy requires users to enter a password before the disable action completes; an empty value means no password is required. All five sub-policy classes carry it (`WindowsPolicy` `disable_password` at `webpolicy.py`:820, `MacOSPolicy` `disablePassword` at line 1095, `LinuxPolicy` `disablePassword` at line 929, `IOSPolicy` `disablePassword` at line 969, `AndroidPolicy` `disable_password` at line 1022) — note the wire key is snake_case on Windows/Android and camelCase on macOS/Linux/iOS (see the per-platform wire-key matrix above).

2. **Anti-tampering at the install parameter level** (`ENABLEANTITAMPERING=1` on Windows): Prevents users from stopping or modifying ZCC services at the OS service layer, not just at the ZCC UI level. This is configured at install time and can be overridden by the App Profile "Override Anti Tampering" setting. See [`./install-parameters.md`](./install-parameters.md) for the install-parameter source detail.

These two mechanisms operate at different layers. A password gate blocks the ZCC UI action; anti-tampering blocks OS-level service manipulation regardless of UI. For maximum enforcement, both should be configured.

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`; `vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`.

Per-product disable passwords (ZIA, ZPA, ZDX, ZDP, ZAD) are independent of the whole-agent disable password — a user with no whole-agent disable password but with a `ziaDisablePass` set must enter a password only to disable ZIA, not to disable ZPA or the agent itself. These per-product passwords exist on **two** surfaces, not just `manage_pass`: the top-level `WebPolicy` object carries `zdxDisablePassword` (`webpolicy.py`:356), `zdDisablePassword` (line 357), `zpaDisablePassword` (line 358), and `zdpDisablePassword` (line 359) directly, alongside an agent-level `exitPassword` (line 354), while `manage_pass` carries the write-only bulk set (`ZiaDisablePass` / `ZpaDisablePass` / `ZdxDisablePass` / `ZdpDisablePass` / `ZadDisablePass`). See "## Two surfaces for per-product disable passwords" above for the field-by-field comparison and the open question of which surface is authoritative.

### Password rotation

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`.

Passwords on the Web Policy per-platform sub-policies are updated by editing the sub-policy object via the API and writing a new password value. The `manage_pass` endpoint similarly accepts a full replacement set of passwords per policy name and device type. There is no password history or rotation enforcement in the API; the operator supplies the new value and it takes effect immediately on next policy sync to enrolled devices.

Policy changes propagate to enrolled devices on the next ZCC restart or user logout/login event, not immediately. See [`./forwarding-profile.md`](./forwarding-profile.md) for the App Profile propagation note.

---

## Logging and admin visibility

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

The vendor documentation does not describe an audit trail for user-invoked support actions (Report an Issue submissions, log exports). The ZCC admin portal does expose the Enrolled Devices view with device-level details, and the Fetch Logs action is admin-initiated rather than user-initiated.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/zcc_service.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/admin_roles.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/company_info.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/admin_roles/admin_roles.go`; `vendor/zscaler-sdk-go/zscaler/zcc/services/company/company.go`.

For admin-side audit coverage of configuration changes to the App Supportability settings themselves, the SDKs expose admin role fields such as `auditLogs` / `clientConnectorSupport` and company supportability fields such as `supportEnabled`, `supportAdminEmail`, `supportTicketEnabled`, and `disableLoggingControls`. A dedicated ZCC audit-log query service is not exposed in the inspected SDK service catalogs.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/devices.py`.

The `download_disable_reasons` endpoint (`GET /downloadDisableReasons`, available via the Python SDK `devices.download_disable_reasons()`) provides a CSV export of reasons users gave when disabling ZCC. This is the closest available admin-side visibility into user-initiated disable events.

---

## SDK and API configuration

### App Supportability settings

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`; `vendor/zscaler-sdk-python/zscaler/zcc/company.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/company_info.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/company/company.go`.

The App Supportability page toggles live on the company-info surface, and the programmatic management path is now resolvable from source rather than left to the ZCC Portal UI. All four toggles are named fields on the `CompanyInfo` model: `supportAdminEmail` (`vendor/zscaler-sdk-python/zscaler/zcc/models/company_info.py`:64), `supportEnabled` (line 65), `supportTicketEnabled` (line 70), and `disableLoggingControls` (line 73).

The read/write split is asymmetric across the two SDKs:

- **Read (both SDKs)**: Python `get_company_info()` (`vendor/zscaler-sdk-python/zscaler/zcc/company.py`:31, `GET /getCompanyInfo`) and Go `GetCompanyInfo` (`vendor/zscaler-sdk-go/zscaler/zcc/services/company/company.go`:342, `GET /getCompanyInfo` at line 13) both return the support fields.
- **Write (Go only)**: Go `SetCompanyInfo` (`vendor/zscaler-sdk-go/zscaler/zcc/services/company/company.go`:355) issues `PUT /zcc/papi/public/v1/setCompanyInfo` (endpoint constant at line 14) and carries the support fields in the request body. The **Python SDK is read-only here** — `company.py` exposes only `get_company_info()` (line 31) and has no `set_company_info`. So the writable programmatic path is the Go SDK or a direct `PUT /zcc/papi/public/v1/setCompanyInfo`, exactly paralleling the `manage_pass` Python-vs-Go gap documented below.

Type note: in the Go `CompanyInfo` struct these toggles are `int`-typed, not `bool` — `SupportEnabled int` (`company.go`:41), `SupportTicketEnabled int` (line 44), `DisableLoggingControls int` (line 45), `FetchLogsForAdminsEnabled int` (line 42). Callers must compare against integer values (0/1), not test for boolean truthiness.

### Password management

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`; `vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py`.

The `manage_pass` endpoint provides API access to per-policy per-platform per-product password management:

- **Endpoint**: `POST /zcc/papi/public/v1/managePass`
- **Go SDK**: `manage_pass.UpdateManagePass(ctx, service, &managePass)` — available in `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/`
- **Python SDK**: No service module. The model class `ManagePass` exists at `vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py` but the POST call must be made directly or through the Go SDK.

### Web Privacy settings

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py`.

`export_logs_for_non_admin` and `grant_access_to_zscaler_log_folder` are configurable via the Web Privacy API:

- **Python SDK**: `client.zcc.web_privacy.set_web_privacy_info(export_logs_for_non_admin=False, grant_access_to_zscaler_log_folder=False)`
- **Endpoint**: `PUT /zcc/papi/public/v1/setWebPrivacyInfo`

### Per-platform password gates via Web Policy

Managed through the Web Policy edit endpoint:

- **Python SDK**: `client.zcc.web_policy.web_policy_edit(**kwargs)` — `PUT /zcc/papi/public/v1/web/policy/edit`
- **Go SDK**: `web_policy.GetAll`, edit functions in `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/`

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`.

Password fields are nested inside the per-platform sub-policy objects (`windowsPolicy.disablePassword`, etc.). Changes require an activation call to take effect: `client.zcc.web_policy.activate_web_policy(device_type=..., policy_id=...)`.

---

## Privacy and compliance considerations

### Diagnostic bundles and PII

Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

Diagnostic log bundles submitted through Report an Issue contain ZCC client logs. The vendor documentation states logs are encrypted and only Zscaler can decrypt them. Despite this encryption, the bundle may contain:

- Network connection metadata (destination IPs, ports, hostnames)
- User identity information (username, tenant domain)
- Device identifiers (UDID, machine hostname)
- Timestamps of user activity correlated with connection events

Admins should consider whether submitting bundles to Zscaler Support is consistent with their organization's data residency and privacy requirements, particularly where local-only log handling is mandated. The admin email path keeps the bundle within the organization's mail infrastructure; the Zscaler ticket path sends it to Zscaler's support systems.

### Web Privacy controls and PII collection scope

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webprivacy.py`.

The `WebPrivacy` object governs what ZCC collects at the endpoint:

- `collect_machine_hostname`: When off, hostnames are redacted from cloud logs.
- `collect_user_info`: When off, user identity is anonymized or device-only in Zscaler cloud logs.
- `disable_crashlytics`: When false, crash telemetry on mobile ZCC builds may reach Google infrastructure (Crashlytics). Compliance reviewers should account for this third-party data flow.

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

Changes to App Supportability settings, Web Policy password gates, and Web Privacy flags propagate to enrolled endpoints on the next ZCC restart or user logout/login event. There is no real-time push. An admin who enables a new password gate expecting it to protect devices immediately will find existing sessions are unaffected until those devices reconnect. See [`./forwarding-profile.md`](./forwarding-profile.md) for the App Profile propagation note.

### `download_disable_reasons` rate limit

Source: `vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md`.

The `GET /downloadDisableReasons` endpoint shares the 3-calls-per-day rate limit bucket with `/downloadDevices` and `/downloadServiceStatus`. Automated reporting pipelines that pull all three CSV exports daily must account for this combined limit against the 3-per-day cap per IP per organization.

### Anti-tampering and Citrix VDI

On Windows with Citrix VDI, `ENABLEANTITAMPERING` interacts with `HIDEAPPUIONLAUNCH`. If `STRICTENFORCEMENT=1` is also in play, `HIDEAPPUIONLAUNCH` must be set to `0` for non-persistent Citrix VDIs. Anti-tampering in VDI environments should be validated in a test deployment before fleet rollout. See [`./install-parameters.md`](./install-parameters.md) for the install-parameter source detail.

---

## Cross-links

- Per-platform disable, logout, and uninstall password configuration — [`./web-policy.md`](./web-policy.md)
- Telemetry, log-collection scope, and non-admin log export flags — [`./web-privacy.md`](./web-privacy.md)
- SDK service catalog including `manage_pass`, `devices.download_disable_reasons`, and Web Privacy API — [`./sdk.md`](./sdk.md)
- Anti-tampering, `HIDEAPPUIONLAUNCH`, and install-time UI controls — [`./install-parameters.md`](./install-parameters.md)
- App Profile update propagation timing — [`./forwarding-profile.md`](./forwarding-profile.md)

---

## Open questions

The following claims appear in this doc or are commonly asked but are **not** answerable from the inspected SDK service-layer source (Python + Go) or the cited help captures. They need a live tenant or vendor confirmation.

- **Tenant-default values of the App Supportability toggles.** The `CompanyInfo` model declares `supportEnabled`, `supportAdminEmail`, `supportTicketEnabled`, `disableLoggingControls`, and `fetchLogsForAdminsEnabled`, but the SDK does not assert their out-of-box default value. The "Default-on vs default-off" table's default column is inferred from the help doc's described configuration steps, not from source. See [clarification `zcc-91`](../_meta/clarifications.md#zcc-91-app-supportability-toggle-tenant-defaults).
- **Which per-product disable-password surface is authoritative when both are set.** The same logical passwords exist on the top-level `WebPolicy` object (`zdxDisablePassword`/`zdDisablePassword`/`zpaDisablePassword`/`zdpDisablePassword`, plus `exitPassword`) and on the write-only `manage_pass` bulk POST. The SDK source does not state precedence when a value is set on both, nor how the `manage_pass` `ZiaDisablePass`/`ZadDisablePass` names reconcile with the WebPolicy keys (WebPolicy has no `ziaDisablePassword`; it carries a `zdDisablePassword` whose product mapping vs `ZadDisablePass` is not stated in source). See [clarification `zcc-92`](../_meta/clarifications.md#zcc-92-per-product-disable-password-authority-webpolicy-vs-manage_pass).
- **macOS read-key vs write-key asymmetry behavior.** `MacOSPolicy` reads `disablePassword`/`logoutPassword`/`uninstallPassword` (camelCase) but `request_format()` emits `disable_password`/`logout_password`/`uninstall_password` (snake_case). Whether the live API accepts the snake_case write form for macOS, ignores it, or stores it under a different key than it reads is not determinable from the model alone and should be tested against a tenant. See [clarification `zcc-93`](../_meta/clarifications.md#zcc-93-macos-password-read-key-vs-write-key-api-behavior).
- **Whether each per-platform disable/logout/uninstall gate surfaces as a user-facing UI action on every OS.** All five sub-policy classes carry all three password fields as model attributes, but the SDK model does not assert which gates render as actual user-facing UI actions per OS (e.g. whether mobile exposes an uninstall-password prompt the same way desktop does). See [clarification `zcc-94`](../_meta/clarifications.md#zcc-94-per-platform-password-gate-ui-surface-per-os).
- **Diagnostic bundle internals.** Specific file paths, log rotation behavior, bundle size limits, and PII content of the encrypted Report-an-Issue bundle are not documented in the available vendor sources.
- **Audit trail for user-invoked support actions.** No SDK service or help capture describes an audit-log query surface for Report an Issue submissions or user-initiated log exports; `download_disable_reasons` (CSV of user-supplied disable reasons) is the closest available signal.
