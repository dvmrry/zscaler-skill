---
product: zcc
topic: acceptable-use-policy
title: "ZCC Acceptable Use Policy — in-app prompt for compliance and consent gating"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/configuring-acceptable-use-policy-zscaler-app.md"
  - "vendor/zscaler-help/configuring-end-user-notifications-zscaler-client-connector.md"
  - "vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/admin_roles/admin_roles.go"
  - "vendor/zscaler-help/ranges-limitations-zia.md"
author-status: draft
---

# ZCC Acceptable Use Policy — in-app prompt for compliance and consent gating

## What the ZCC AUP page is

The ZCC Acceptable Use Policy (AUP) is an in-app consent screen that Zscaler Client Connector displays to end users before they can connect to the internet or access internal resources through the Zscaler service. Users must accept the organization's policy to proceed; the screen appears inside the ZCC client application itself, not in a browser (Tier A — vendor/zscaler-help/configuring-acceptable-use-policy-zscaler-app.md).

### Distinction from the ZIA web block-page AUP

The ZCC AUP is a separate construct from the ZIA end-user notification AUP that appears as a browser block page when a user first connects through a ZIA proxy location. The ZIA variant is configured at the ZIA Admin Portal under Policy > End User Notifications and is tied to Location objects (`aupEnabled`, `aupBlockInternetUntilAccepted`, `aupTimeoutInDays` — ZIA SDK fields). It intercepts HTTP/S traffic for unauthenticated or first-time location users via the cloud proxy.

The ZCC AUP operates at the agent layer: it is shown in the ZCC application window before any tunnel is established, and applies regardless of forwarding mode (Z-Tunnel, PAC, or direct). An operator asking "how do I show users an acceptable-use screen at ZCC login" is asking about this construct. An operator asking "how do I show an AUP to guest Wi-Fi users going through ZIA" is asking about the ZIA Location AUP.

There is also a ZPA user portal AUP (`zpa_user_portal_aup` Terraform resource, `/userportal/aup` API endpoint), which controls the consent screen shown in the ZPA user portal web application — a third distinct construct. None of the three share configuration.

---

## Trigger conditions — when the AUP page displays

The ZCC AUP frequency is configured as a single tenant-wide setting. The available values are (Tier A — vendor/zscaler-help/configuring-acceptable-use-policy-zscaler-app.md):

| Frequency option | Behavior |
|---|---|
| Never | AUP is never shown. |
| After User Enrollment | AUP appears once, immediately after the user completes enrollment. |
| Daily | AUP appears on the first connect of each calendar day. |
| Weekly | AUP appears on the first connect of each calendar week. |
| Custom | AUP appears every N days, where N is 1–180 (admin-configured). |

When Custom is selected, an additional field "Custom Days" becomes visible in the portal. Valid range: 1 to 180 days (Tier A — vendor/zscaler-help/configuring-acceptable-use-policy-zscaler-app.md).

The vendor source does not document a "per policy change" trigger — that is, the AUP does not automatically re-prompt when the AUP message text is updated. The frequency setting alone controls display cadence. See deferred item `zcc-44` in `references/_clarifications.md`.

---

## User experience

When the trigger condition fires, ZCC displays the AUP screen in the application window before the tunnel establishes. The screen renders the configured AUP message text. Admins configure the message content in the ZCC Portal at Administration > Client Connector Notifications > Acceptable Use Policy (AUP) Settings (Tier A — vendor/zscaler-help/configuring-acceptable-use-policy-zscaler-app.md).

### Configurable fields

| Field | Notes |
|---|---|
| AUP Frequency | Dropdown: Never, After User Enrollment, Daily, Weekly, Custom. See trigger conditions above. |
| Custom Days | Integer, 1–180. Visible only when Frequency = Custom. |
| AUP Message | Free-form HTML. Static HTML tags are supported. Images are supported provided the image files are accessible from the public internet at display time. |
| Preview AUP Message | Button in the portal that renders the message as the user will see it. No saved value; display only. |

The AUP message field accepts static HTML markup. Dynamic scripting is not documented as supported. Image references must be publicly reachable — images hosted behind ZPA or on internal servers that require the ZCC tunnel to be up will not render correctly (the tunnel does not exist yet when the AUP is displayed).

### Fields not documented in vendor source

The following fields that commonly appear in AUP systems are not described in the vendor source for the ZCC AUP: custom URL redirect (e.g., "read the full policy at this URL"), signature capture, accept-only vs. accept/decline toggle, and per-language variants. See deferred items `zcc-45` through `zcc-48` in `references/_clarifications.md`.

---

## Behavior on accept vs. decline

The vendor source states that users must accept the AUP before they can connect. It does not explicitly describe what happens on decline: whether ZCC presents a decline button, whether decline blocks the tunnel, forces logout, or leaves ZCC in a degraded state (Tier A — vendor/zscaler-help/configuring-acceptable-use-policy-zscaler-app.md).

The operational implication is that accept is the only path forward — the screen is framed as a gate, not as a choice. Whether a decline action exists in the UI and what its consequence is remains unconfirmed from available sources. See deferred item `zcc-45`.

---

## Per-platform support

The vendor source describes the AUP as a ZCC-wide feature without platform exclusions. The configuration page in the ZCC Portal does not differentiate by OS platform (Windows, macOS, iOS, Android, Linux, ChromeOS). The AUP settings tab exists in the Notifications section, which is a tenant-wide configuration, not a per-App-Profile configuration (Tier A — vendor/zscaler-help/configuring-acceptable-use-policy-zscaler-app.md).

The configuring-zscaler-client-connector-app-profiles.md vendor source lists five platforms (Windows, macOS, Linux, iOS, Android) without mentioning AUP as a per-platform field. ChromeOS is addressed as a variant of Android in the install parameters documentation but is not called out separately for AUP purposes.

Whether certain platform versions of ZCC display the AUP differently, or whether older ZCC agent versions ignore the AUP setting, is not documented in the available vendor sources. See deferred item `zcc-49`.

---

## Configuration via the ZCC Portal

### Navigation path

ZCC Portal > Administration > Client Connector Notifications > Acceptable Use Policy (AUP) Settings tab (Tier A — vendor/zscaler-help/configuring-acceptable-use-policy-zscaler-app.md).

### Relationship to App Profiles and other policy objects

The AUP is configured in the Notifications section, which is separate from App Profiles (WebPolicy objects). App Profiles control forwarding behavior, platform-specific passwords, SSL cert installation, and PAC URLs — they do not carry AUP frequency or message fields (Tier A — vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md; vendor/zscaler-help/configuring-zscaler-client-connector-app-profiles.md).

The AUP setting applies across all users in the tenant regardless of which App Profile they are assigned. There is no per-profile AUP override documented in available sources.

The End User Notifications tab (a sibling tab in the same Notifications section) controls separate notification types: app update notifications, service status notifications, ZIA notifications, and ZPA reauthentication prompts. These are distinct from AUP. If a tenant uses Notification Templates (configured on the Notification Templates tab), the End User Notifications tab is suppressed and settings are managed on the templates tab instead — the AUP tab relationship to this mode is not described in the vendor source. See deferred item `zcc-50` (Tier A — vendor/zscaler-help/configuring-end-user-notifications-zscaler-client-connector.md).

### Admin role permission

The Go SDK AdminRole struct (`vendor/zscaler-sdk-go/zscaler/zcc/services/admin_roles/admin_roles.go`) includes a `ClientConnectorNotifications` permission field (`json:"clientConnectorNotifications"`). This permission controls access to the Notifications section in the ZCC Portal, which includes the AUP Settings tab. Admins without this permission cannot configure the AUP (Tier B — SDK/TF).

---

## SDK and Terraform support

### Python SDK

There is no ZCC AUP service module in the Python ZCC SDK (`vendor/zscaler-sdk-python/zscaler/zcc/`). The module directory contains: admin_user, company, devices, entitlements, fail_open_policy, forwarding_profile, legacy, secrets, trusted_networks, web_app_service, web_policy, web_privacy, and the ZCC service root. No notifications or AUP module exists (Tier B — SDK/TF).

### Go SDK

There is no AUP or notifications service package under `vendor/zscaler-sdk-go/zscaler/zcc/services/`. The services directory contains: admin_roles, admin_users, application_profiles, common, company, custom_ip_apps, devices, download_devices, entitlements, failopen_policy, forwarding_profile, manage_pass, predefined_ip_apps, process_based_apps, remove_devices, secrets, trusted_network, web_app_service, web_policy, and web_privacy. No notifications package exists (Tier B — SDK/TF).

### Terraform

There is no ZCC Terraform provider in the vendor sources (`vendor/` contains terraform-provider-zia, terraform-provider-zpa, and terraform-provider-ztc — no terraform-provider-zcc). The ZIA provider has `resource_zia_end_user_notification.go` which manages the ZIA web-block-page AUP fields (`aup_frequency`, `aup_custom_frequency`, `aup_day_offset`, `aup_message`) — this is a ZIA construct, not ZCC (Tier B — SDK/TF).

The ZPA provider has `resource_zpa_user_portal_aup.go` which manages the ZPA user portal AUP — also a separate construct.

### Conclusion: admin-console-only for ZCC AUP

The ZCC AUP is configurable only through the ZCC Portal admin console. There is no API endpoint, SDK method, or Terraform resource to read or write the ZCC AUP configuration from automation tooling. Any IaC or automation that needs to manage ZCC AUP settings must do so through the admin console UI or via direct API calls to an undocumented endpoint (if one exists — not confirmed from available sources).

---

## Logging and audit

Whether ZCC logs individual user accept or decline events for the AUP (e.g., a record of "user X accepted the AUP at timestamp Y") is not described in the vendor source for the AUP configuration page. The Go SDK AdminRole struct includes an `AuditLogs` permission field (`json:"auditLogs"`), which gates access to ZCC portal audit logs, but the schema of those audit log entries and whether AUP acceptance events appear in them is not confirmed from available sources (Tier B — SDK/TF).

Whether AUP accept/decline events surface in ZIA NSS streams or ZIA log analytics is not documented. The AUP screen fires before the ZCC tunnel is up, so there is no Z-Tunnel session context at the moment of display in which a ZIA event could be generated.

See deferred item `zcc-51`.

---

## Localization

Language selection, multi-language support, and fallback behavior when the user's device locale does not match a supported language are not described in the vendor source. The AUP message field is a single HTML field — there is no documented mechanism for language variants or locale-based display logic. Admins who need multi-language AUP content would need to embed the text of all languages in the single message field or use a URL redirect to a multi-language page (if redirect is supported — see deferred item `zcc-46`).

See deferred item `zcc-52`.

---

## Operational gotchas

### AUP message size limit

The ZIA ranges-and-limitations vendor doc records a limit of 15K–30K bytes for notification/AUP/categorization/security/DLP/caution messages (Tier A — vendor/zscaler-help/ranges-limitations-zia.md). This limit entry is in a ZIA context, but it likely applies to the ZCC AUP message as well, given both are processed by the Zscaler cloud notification infrastructure. Treat 15KB as a practical upper bound for the AUP HTML content; do not rely on this figure for ZCC without explicit confirmation. See deferred item `zcc-53`.

### MDM-driven silent install does not bypass the AUP

Install-time parameters control enrollment behavior (strict enforcement, tunnel mode, user domain) but do not include any parameter to disable or pre-accept the AUP. The AUP frequency and message are tenant-wide settings stored in the ZCC Portal, not install-time flags. An MDM-deployed ZCC instance will still display the AUP according to the configured frequency once the user logs in (Tier A — vendor/zscaler-help/supported-parameters-zscaler-client-connector-windows.md; vendor/zscaler-help/supported-parameters-zscaler-client-connector-macos.md; vendor/zscaler-help/supported-parameters-zscaler-client-connector-ios.md; vendor/zscaler-help/parameters-guide-zscaler-client-connector-android-and-android-chromeos.md).

There is no documented `skipAUP`, `aupFrequency`, or equivalent install parameter on any platform.

### Machine Tunnel and AUP

Machine Tunnel (a ZPA feature establishing a pre-login tunnel at the Windows login screen) operates before any user session exists. Whether the AUP screen is shown in machine-tunnel-only mode — before the user logs in — is not documented. The AUP is described as requiring user acceptance; a machine tunnel scenario with no interactive user would logically bypass it, but this is not confirmed. See deferred item `zcc-54`.

### Kiosk mode

Kiosk or shared-device deployments where ZCC is configured for a non-interactive user session may encounter the AUP gate if the AUP frequency is set to anything other than Never. The AUP screen requires user interaction. Whether ZCC has a mechanism to skip the AUP in kiosk configurations is not documented in available sources. See deferred item `zcc-54`.

### App profile update propagation and AUP reset

ZCC downloads app profile changes only when users log out and back in, or restart their computers (Tier A — vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md). Whether a change to the AUP message or frequency in the ZCC Portal triggers an immediate re-display on connected devices, or whether it takes effect only on the next connect cycle, is not documented. The notification configuration sits in the portal (server-side), so the message content may update server-side immediately, but the display trigger cadence may still follow the agent's cached state. See deferred item `zcc-55`.

### Version skew

Older ZCC agent versions may render the HTML AUP message differently or may not support all HTML tags. The vendor source does not document minimum agent version requirements for the AUP feature or for specific HTML capabilities in the message field. See deferred item `zcc-49`.

---

## Cross-links

- App Profiles and Web Policy (per-platform policy; does not carry AUP fields) — [`./web-policy.md`](./web-policy.md)
- Install parameters (MDM deployment, enrollment; no AUP skip parameter) — [`./install-parameters.md`](./install-parameters.md)
- ZCC SDK service catalog (confirms no notifications/AUP API surface) — [`./sdk.md`](./sdk.md)
- Forwarding Profile (tunnel behavior after AUP accept) — [`./forwarding-profile.md`](./forwarding-profile.md)
