---
product: zcc
topic: macos-install-customization
title: "ZCC macOS Install Customization — MDM, plist keys, .pkg flags, and silent deployment"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/customizing-zscaler-client-connector-install-options-macos.md"
  - "vendor/zscaler-help/supported-parameters-zscaler-client-connector-macos.md"
  - "vendor/zscaler-help/about-machine-tunnels.md"
  - "vendor/zscaler-help/what-is-zscaler-client-connector.md"
author-status: draft
---

# ZCC macOS Install Customization — MDM, plist keys, .pkg flags, and silent deployment

This document covers macOS-specific deployment mechanics for Zscaler Client Connector (ZCC): how to deliver the `.pkg`, how to inject configuration via plist before first launch, and the system-level entitlements (Network Extension, PPPC) required for a fully unattended fleet deployment. It complements the cross-platform parameter catalog at [`./install-parameters.md`](./install-parameters.md), which documents parameter semantics shared across Windows, macOS, iOS, and Android. Duplicate parameter-semantics coverage is intentionally omitted here.

---

## 1. Scope

This document covers:

- `.pkg` installer delivery and command-line invocation.
- MDM-pushed property list (plist) configuration — the macOS equivalent of Windows MSI properties.
- System Extension and Network Extension entitlement provisioning via MDM.
- Privacy Preferences Policy Control (PPPC) payload for Full Disk Access and network filtering.
- Silent install behavior, auto-launch controls, update channel, uninstall, and logging.

It does **not** cover:

- Runtime forwarding behavior — see [`./forwarding-profile.md`](./forwarding-profile.md).
- App Profile / Web Policy assignment — see [`./web-policy.md`](./web-policy.md).
- Device inventory and lifecycle API — see [`./devices.md`](./devices.md).
- Windows, iOS, or Android install parameters — see [`./install-parameters.md`](./install-parameters.md).

---

## 2. Distribution channel options

ZCC for macOS is distributed as a signed `.pkg` installer. The two standard delivery paths are:

**Direct download.** The package is downloaded from the Zscaler Client Connector Portal or from the Zscaler download portal and installed by the end user or an IT technician by double-clicking the installer or invoking it from the command line.

**MDM-pushed package.** The `.pkg` is hosted on the MDM server (Jamf Pro, Microsoft Intune, Kandji, Mosyle, Workspace ONE) and pushed to enrolled endpoints. This is the standard path for fleet deployments. Plist configuration is pushed as a separate managed preference profile alongside the package, ensuring configuration is in place before ZCC first launches.

**App Store version.** ZCC is also available from the Mac App Store. The App Store version receives updates through App Store mechanisms rather than via the portal-controlled update channel. The App Store version does not support MDM-managed plist configuration in the same way as the `.pkg` version, and Zscaler's deployment guides for MDM configuration reference the `.pkg` path. The App Store version is documented as an alternative in the vendor help portal but deployment mechanics for App Store distribution under MDM managed-app-config are not captured in available vendor sources.

**Source note:** The Zscaler help page for "Customizing Zscaler Client Connector with Install Options for macOS" (`vendor/zscaler-help/customizing-zscaler-client-connector-install-options-macos.md`) redirected at capture time and contains no usable content. Claims in this document that would normally cite that page are flagged as unsourced in Section 14.

---

## 3. Supported macOS versions

Zscaler does not enumerate a minimum supported macOS version in the captured vendor sources. The Network Extension Framework (NEX) required by ZCC's tunnel and content-filter components has been available since macOS 10.15 (Catalina). Operators should consult the current [Zscaler Client Connector release notes](https://help.zscaler.com/zscaler-client-connector) for the active support matrix before deploying to macOS versions older than Ventura (13.x).

---

## 4. Required system entitlements

ZCC on macOS uses two macOS system extension frameworks that must be approved by the operating system before ZCC can capture and inspect traffic. Without these approvals, ZCC installs but cannot enforce policy.

### 4.1 Network Extension Framework — System Extension allowlist

ZCC installs a System Extension that implements a Network Extension provider. On managed devices, MDM can pre-approve the extension via a System Extension Policy profile (payload type `com.apple.system-extension-policy`), which prevents the user from seeing a "System Extension Blocked" dialog.

Required fields in the System Extension Policy profile:

| Field | Value |
|---|---|
| `AllowedSystemExtensions` | Dictionary keyed by the ZCC Team ID, value is an array containing the extension bundle identifier. |
| `AllowedSystemExtensionTypes` | Dictionary keyed by the ZCC Team ID, value is an array containing `NetworkExtension`. |

The Zscaler Team ID and exact extension bundle identifier must be obtained from current Zscaler deployment documentation or by inspecting the installed package contents under `/Applications/Zscaler/Zscaler.app/Contents/Library/SystemExtensions/`. These values are not reproduced here because they are version-specific and subject to change.

**Without MDM pre-approval:** macOS presents the user with a dialog requiring them to open System Settings and manually approve the extension. On Apple silicon devices (M1/M2/M3/M4), this approval sequence may additionally require the device not to be in a restricted management mode. In either case, the extension block prevents ZCC from tunneling any traffic until resolved, making it unsuitable for unattended deployment without the MDM profile.

### 4.2 Content Filter Provider approval

ZCC's SSL inspection and traffic-interception component registers as a Content Filter Provider under the Network Extension Framework. On managed devices, the System Extension allowlist profile (above) covers this if `NetworkExtension` is included in the allowed extension types. No separate content-filter profile is required, but the extension type array must include `ContentFilter` if the System Extension Policy profile uses the granular type listing rather than the general `NetworkExtension` type. Confirm against the Zscaler MDM deployment guide for the exact type strings.

### 4.3 Privacy Preferences Policy Control (PPPC)

ZCC may require Full Disk Access on some macOS versions to read certain filesystem paths for endpoint DLP and device posture evaluation. Without a PPPC profile pre-granting the permission, macOS prompts the user at the point ZCC first accesses a protected path (or silently denies it if the endpoint is in MDM-restricted mode).

A PPPC profile is delivered as a Configuration Profile with payload type `com.apple.TCC.configuration-profile-policy`. Each access request is a dictionary entry with:

| Key | Value |
|---|---|
| `Identifier` | The bundle identifier of the ZCC process requesting access (e.g., `com.zscaler.ZscalerTunnel` or similar — verify against installed package). |
| `IdentifierType` | `bundleID` |
| `CodeRequirement` | The code-signing requirement string for the ZCC process. |
| `Services` | Dictionary containing `SystemPolicyAllFiles` (Full Disk Access) set to `Allow`. |

**Practical note.** Deploying ZCC without a PPPC profile and relying on user approval is not suitable for unattended fleet deployment. Users on lockdown devices (where TCC prompts are blocked by MDM) will silently lose access to any ZCC feature requiring Full Disk Access. Deploy the PPPC profile simultaneously with or before the ZCC package installation.

---

## 5. `.pkg` installer command-line invocation

The standard macOS installer command to silently install ZCC from the command line or an MDM script is:

```
sudo installer -pkg /path/to/ZscalerClientConnector.pkg -target /
```

- `-target /` installs to the boot volume. Alternate volume targets are not supported for system-extension-dependent software.
- The installer must run as root (`sudo` or equivalent MDM privilege elevation).
- No interactive prompts are displayed when invoked this way, provided the System Extension profile is already deployed.

**Accepted environment variables and preflight files.** The vendor help page for macOS install option customization (the primary source for this section) was unavailable at capture time. Whether ZCC's macOS `.pkg` accepts installer-plugin hooks, preflight scripts, or environment variables beyond the standard `installer` flags is not confirmed from available sources. The plist-based configuration mechanism (Section 6) is the documented path for pre-seeding configuration values.

---

## 6. Plist keys — preference domain and key catalog

ZCC on macOS reads install-time configuration from a managed preferences plist pushed by MDM. The preference domain is not confirmed from available captured vendor sources; the Jamf Pro and Intune deployment guides referenced by the parameters vendor doc are not captured locally. Based on the parameter naming conventions and the standard Zscaler bundle naming pattern, the expected preference domain is `com.zscaler.zclient`, but this should be verified against the current Jamf or Intune deployment guide before deployment.

The plist is typically deployed as a Custom Settings payload (`com.apple.ManagedClient.preferences`) in a Configuration Profile, targeting the relevant preference domain. MDM solutions push it as a managed preference, which means it is read-only at the endpoint and cannot be modified by the user.

### 6.1 Parameter catalog — macOS plist keys

All parameters below are sourced from `vendor/zscaler-help/supported-parameters-zscaler-client-connector-macos.md`.

| Key | Type | Default | Description |
|---|---|---|---|
| `userDomain` | String | — | The organization's primary domain name. Must match the SAML NameID field exactly. Enables ZCC to skip the enrollment domain-entry screen and proceed directly to SSO login. If SSO is integrated (e.g., Microsoft Enterprise SSO Plug-In), users are enrolled automatically without seeing any login prompt. Required if `strictEnforcement` is set. |
| `cloudName` | String | — | The ZIA cloud name (e.g., `zscalertwo` or `zscalertwo.net`). Required when the tenant is provisioned on more than one cloud, and required when `strictEnforcement` is enabled. Omit if the tenant has a single cloud — ZCC resolves the cloud automatically in that case. |
| `deviceToken` | String | — | Device token from the ZCC Portal, used when the ZCC Portal functions as the IdP. Enables silent provisioning and authentication. Applies to ZIA only; ZPA support requires ZIdentity. Must be generated in the ZCC Portal before use. |
| `userName` | String | — | Username portion without domain (e.g., `j.doe` for `j.doe@example.com`). Maximum 255 characters. MDM variable macros may be used to auto-populate this value — consult the MDM vendor documentation for the macro syntax. Requires `userDomain` to be set. |
| `enableFips` | Integer | `0` | `1` = use FIPS-compliant cryptographic libraries for communication with Zscaler infrastructure. `0` = disabled. Enable only where FIPS is a hard compliance requirement. |
| `externalDeviceId` | String | `0` (disabled) | Identifier that correlates MDM device records with ZCC Portal device records. MDM variable macros may be used to auto-populate this value. Not supported on ZCC 4.1 and earlier for macOS; requires ZCC 4.2 or later. |
| `hideAppUIOnLaunch` | Integer | `0` | `1` = force the ZCC application window to remain hidden until the user manually opens it. The system tray icon remains accessible. `0` = default behavior (window may appear on launch). Use `1` for silent fleet deployments where UI interruption is undesirable. |
| `policyToken` | String | — | Specifies which App Profile policy to enforce before the user enrolls. The policy applies until enrollment, at which point the user's group-matched App Profile supersedes it. Required when `strictEnforcement` is enabled, and required when machine tunnel is configured so that ZPA resources are reachable before login. The PAC file in the referenced App Profile must include a bypass for the IdP login page. |
| `strictEnforcement` | Integer | `0` | `1` = block all internet traffic until the user enrolls with ZCC. Traffic is also blocked after logout and after an administrator removes the device. Does not affect users who remain logged in and disable ZIA manually. Requires `cloudName` and `policyToken` to be set. Only effective when the forwarding profile action is Tunnel or Tunnel with Local Proxy. |
| `launchTray` | Integer | `1` | `1` = ZCC starts its services and UI automatically after installation (default). `0` = ZCC does not start automatically after installation; the user must open ZCC manually, or ZCC starts automatically on the next reboot. |
| `externalRedirect` | Integer | `0` | `1` = redirect SAML authentication to the organization's IdP through the default browser and Safari. On first redirect, the user must select "Remember Me" on the IdP login page; subsequent authentications proceed without prompts. `0` = in-app authentication flow. |

**Parameter cross-reference:** For semantics shared with Windows (including `strictEnforcement` gotchas, `policyToken` lifecycle, and `externalDeviceId` version requirements), see [`./install-parameters.md`](./install-parameters.md).

---

## 7. MDM payload examples

### 7.1 Jamf Pro — Custom Settings profile

In Jamf Pro, ZCC configuration is deployed as a Custom Settings payload under a Configuration Profile. The preference domain must match the ZCC preference domain (confirm with current Jamf deployment guide — the domain is provisionally `com.zscaler.zclient`).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
    "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>userDomain</key>
    <string>example.com</string>
    <key>cloudName</key>
    <string>zscalertwo</string>
    <key>hideAppUIOnLaunch</key>
    <integer>1</integer>
    <key>strictEnforcement</key>
    <integer>1</integer>
    <key>policyToken</key>
    <string>123456677754</string>
    <key>launchTray</key>
    <integer>1</integer>
</dict>
</plist>
```

This plist is uploaded to the Jamf Pro Custom Settings payload with the preference domain set to the ZCC domain. Jamf Pro converts it to a managed preference and deploys it to target devices.

Jamf Pro also deploys the System Extension policy and PPPC profile as separate Configuration Profile payloads within the same or a different profile object. Zscaler publishes a Jamf Pro deployment guide (referenced by the parameters vendor doc as "Deploying Zscaler Client Connector with Jamf Pro for macOS") that provides payload-ready XML for the System Extension and PPPC components. That guide is not captured in available local sources.

### 7.2 Microsoft Intune — Custom Configuration Profile

Intune delivers macOS Configuration Profiles via the Device Configuration blade. For ZCC plist configuration, the deployment type is a "Custom" profile with a property list payload. The plist content is the same XML structure as shown in the Jamf example. Intune MDM variable substitution syntax (e.g., `{{deviceid}}`) can be used in string values to populate `externalDeviceId` or `userName` dynamically.

The System Extension and PPPC payloads are configured under separate Intune profile types:
- System Extensions: **Device Configuration > Profiles > Create profile > macOS > Templates > Extensions**.
- PPPC: **Device Configuration > Profiles > Create profile > macOS > Templates > Privacy preferences policy control**.

Intune's built-in templates for these payload types guide field entry. Zscaler publishes a dedicated "Deploying Zscaler Client Connector with Microsoft Intune for macOS" guide (referenced by the parameters vendor doc) that is not captured in available local sources.

### 7.3 Kandji, Mosyle, and Workspace ONE

Kandji, Mosyle, and Workspace ONE UEM all support Custom Profiles using the same Apple Configuration Profile XML format. The plist content, System Extension policy XML, and PPPC XML are identical to the Jamf Pro structures above. The MDM-specific difference is in how each platform uploads or creates the profile:

- **Kandji**: Library > Custom Profiles — upload a signed `.mobileconfig` file or paste XML.
- **Mosyle**: Management > Configuration Profiles > Add Profile > Custom — paste or upload the profile XML.
- **Workspace ONE**: Resources > Profiles > Add Profile > macOS > Custom Settings — paste the plist content directly.

Zscaler does not publish dedicated deployment guides for Kandji or Mosyle in the captured vendor sources. The principles from the Jamf and Intune guides apply to any MDM that supports Apple Configuration Profiles.

---

## 8. Silent install

Silent installation means no user-visible prompts during or after package installation. On macOS, full silence requires:

1. **MDM-pushed package delivery.** The MDM runs the installer in the background; no Finder dialog appears.
2. **System Extension pre-approval.** The System Extension Policy profile must be deployed to the device before the package is installed. If the profile arrives after the extension loads, macOS may still prompt.
3. **PPPC pre-deployment.** Deploy the PPPC profile before or simultaneously with the package.
4. **`hideAppUIOnLaunch = 1`.** Prevents the ZCC application window from appearing immediately after installation.
5. **`launchTray = 1` (default).** ZCC services start immediately so policy enforcement begins without waiting for a manual launch or reboot.

With all five conditions met, ZCC installs, the system extension loads silently, and traffic interception begins without any user interaction.

---

## 9. Auto-launch and login item

`launchTray` (default `1`) controls whether ZCC auto-starts after installation. On macOS 13 (Ventura) and later, background items added by installers appear in System Settings > General > Login Items & Extensions and can be toggled by users unless MDM restricts that setting. Zscaler's use of a System Extension (rather than a traditional Launch Agent or Login Item) means the network-level enforcement continues as long as the extension is approved, independent of the Login Items toggle for the UI component. The exact interaction between the `launchTray = 0` setting and the persistence of the system extension on macOS 13+ is not confirmed from available vendor sources.

---

## 10. Update channel

ZCC for macOS receives updates through the Zscaler Client Connector Portal's update controls. Administrators configure the permitted version and update schedule in the ZCC Portal under App Store settings or Client Connector Portal update policy. ZCC checks for updates automatically at a cadence controlled by the portal policy and downloads and applies them silently.

For MDM-managed deployments, operators can also push an updated `.pkg` directly via MDM (e.g., Jamf Self Service, Intune Line-of-Business app update). In this case, the MDM-pushed version must be equal to or newer than the portal's minimum enforced version to avoid a version-mismatch loop.

**Configuring app updates for App Store-distributed ZCC** is documented separately in `vendor/zscaler-help/configuring-app-update-zscaler-client-connector-app-store.md`, which is available locally but not reviewed for this document; consult it for App Store update management details.

The specific plist key or portal field that pins the macOS update channel (e.g., stable vs. early-access ring) is not confirmed from the captured sources. Zscaler documentation distinguishes update availability by portal configuration rather than a client-side plist key.

---

## 11. Uninstall

### 11.1 Official uninstall mechanism

ZCC provides an uninstall script or mechanism distributed with the package. The standard uninstall path on macOS is through the ZCC application itself (via the ZCC menu) or by running an uninstall script provided by Zscaler. For MDM-managed deployments, the MDM can also send a "Remove Application" command.

The exact path to the Zscaler-provided uninstall script (e.g., something under `/Applications/Zscaler/`) and its invocation syntax are not confirmed from available captured vendor sources. See the Deferred items in Section 14.

### 11.2 Residual files

After uninstall, residual files may remain in the following standard locations:

- `~/Library/Application Support/Zscaler/` — per-user ZCC data, logs, and cached configuration.
- `/Library/Application Support/Zscaler/` — system-level ZCC data.
- `/var/log/` — ZCC may have written syslog entries or a dedicated log file.
- `/Library/LaunchDaemons/` and `/Library/LaunchAgents/` — ZCC-registered daemon and agent plists, if not cleaned up by the uninstall script.

### 11.3 System Extension cleanup

On macOS 12 (Monterey) and later, a System Extension that is no longer needed must be explicitly deactivated. The uninstall script or MDM removal command should handle deactivation. If the extension is not properly deactivated, it appears in `systemextensionsctl list` as "awaiting user approval" or in a stalled state. Clean up with:

```
sudo systemextensionsctl uninstall <team-id> <bundle-id>
```

Replace `<team-id>` and `<bundle-id>` with the ZCC-specific values. After deactivation, the extension entry is removed from the System Extensions list. The device does not require a reboot for extension deactivation on most macOS versions, but behavior may differ on older versions.

---

## 12. Machine tunnel on macOS

ZCC supports ZPA Machine Tunnel on both Windows and macOS. Machine Tunnel establishes a ZPA connection before any user logs in, enabling ZPA-protected resources (such as an Active Directory domain controller) to be reachable at the macOS login window.

**Key differences from Windows machine tunnel:**

- Machine Tunnel on macOS must be enabled by Zscaler Support. Contact Zscaler Support to activate this feature before configuring it. [Source: `vendor/zscaler-help/about-machine-tunnels.md`]
- WebView2 authentication is not supported for Machine Tunnels on any platform.
- `policyToken` must be set (via plist/MDM) to specify the App Profile enforced before user login. The PAC file in that App Profile must bypass the IdP login page so authentication is not blocked by strict enforcement.
- Machine Tunnel configuration also requires Machine Groups and Machine Provisioning Keys configured in the ZPA Admin Portal, and those keys added to the App Profile rules for macOS.

For cross-platform machine tunnel configuration, see the ZPA admin documentation. For the `policyToken` parameter semantics, see [`./install-parameters.md`](./install-parameters.md).

---

## 13. Common failure modes

| Failure | Symptom | Resolution |
|---|---|---|
| System Extension blocked — user prompt not answered | ZCC installs but no traffic is intercepted; no tunnel established | Deploy System Extension Policy profile via MDM before package install; or approve manually in System Settings > Privacy & Security |
| System Extension blocked — MDM profile arrived after extension loaded | Same as above; profile was deployed correctly but timing was wrong | Re-push the profile; on some macOS versions a reboot is required after profile arrival for the extension to reload cleanly |
| PPPC missing — Full Disk Access denied | Endpoint DLP or certain device posture checks silently fail; no user prompt on lockdown devices | Deploy PPPC profile before or simultaneously with the ZCC package |
| TCC prompts at runtime | User sees repeated permission dialogs for microphone, camera, contacts (if ZCC triggers these paths) | Extend the PPPC profile to cover the additional TCC categories ZCC requests |
| `policyToken` + `strictEnforcement` — wrong or expired token | All internet traffic blocked immediately after install; device cannot reach IdP to fix | Reinstall with a corrected `policyToken`; validate token in a test deployment before fleet rollout. See [`./install-parameters.md` — POLICYTOKEN gotcha](./install-parameters.md#policytoken-strictenforcement-fail-close-if-misconfigured) |
| Apple silicon (M-series) — architecture mismatch | If a non-universal binary or x86_64-only `.pkg` is deployed, ZCC fails to run or runs under Rosetta 2 with degraded performance | Confirm the downloaded `.pkg` is a Universal Binary (contains both x86_64 and arm64 slices) before fleet deployment. Device `zapp_arch` reported as `arm64` in ZCC Portal device inventory indicates M-series hardware |
| `launchTray = 0` — services do not start | Policy enforcement does not begin until user manually opens ZCC or reboots | Use default `launchTray = 1` for production deployments; reserve `0` only for staged rollouts where deliberate deferral is intended |
| `userDomain` contains wrong domain | ZCC enrollment page fails or routes to wrong IdP; SAML NameID mismatch | The value must exactly match the domain present in the SAML NameID field — confirm with the IdP administrator |

---

## 14. Logging during install

### 14.1 Installer log

macOS records all `installer` invocations to the system log. To capture install output to a file:

```
sudo installer -pkg ZscalerClientConnector.pkg -target / -verbose 2>&1 | tee /tmp/zcc-install.log
```

The installer log captures package receipt verification, payload expansion, and script execution (pre-install, post-install).

### 14.2 System log and Console.app

After installation, ZCC writes to the macOS unified logging system (Apple's OSLog / `os_log`). To stream ZCC-related log entries in real time:

```
log stream --predicate 'subsystem CONTAINS "zscaler" OR process CONTAINS "Zscaler"' --info --debug
```

To filter historical log entries in Console.app:
- Open Console.app, select the local Mac in the left sidebar.
- Use the search bar with filter: `process:Zscaler` or `subsystem:com.zscaler`.
- Adjust the time range and log level (Action > Include Info/Debug Messages).

### 14.3 System Extension log entries

System Extension lifecycle events (load, activate, crash, deactivate) are logged with the subsystem `com.apple.SystemExtensions`. Filter in Console.app with:

```
log stream --predicate 'subsystem == "com.apple.SystemExtensions"' --info
```

These entries are useful when diagnosing a blocked or stalled extension.

### 14.4 ZCC-specific log files

ZCC may write its own log files to a location under `/var/log/` or under the application support directory. The exact paths are not confirmed from available captured vendor sources. The ZCC application itself provides a "Send Feedback" and log export mechanism in the ZCC menu that packages relevant logs for support submission.

---

## 15. Deferred — ZCC macOS install

Items registered in [`_clarifications.md`](../_clarifications.md) as `zcc-14` through `zcc-23`.

| Clarification ID | Claim requiring confirmation |
|---|---|
| [`zcc-14`](../_clarifications.md#zcc-14-macos-preference-domain-for-zcc-managed-preferences) | The preference domain for ZCC managed preferences (`com.zscaler.zclient` or similar) |
| [`zcc-15`](../_clarifications.md#zcc-15-system-extension-profile-timing-on-macos) | ZCC `.pkg` post-install behavior when System Extension profile arrives after package install |
| [`zcc-16`](../_clarifications.md#zcc-16-zcc-macos-uninstall-script-path) | Exact path to the Zscaler-provided uninstall script on macOS |
| [`zcc-17`](../_clarifications.md#zcc-17-launchtray-0-vs-system-extension-activation) | Whether `launchTray = 0` prevents only the UI or also prevents system extension activation |
| [`zcc-18`](../_clarifications.md#zcc-18-app-store-zcc-mdm-managed-preferences) | App Store-distributed ZCC plist/MDM managed-app-config support |
| [`zcc-19`](../_clarifications.md#zcc-19-zcc-team-id-and-system-extension-bundle-identifier) | Exact Team ID and System Extension bundle identifier for current ZCC release |
| [`zcc-20`](../_clarifications.md#zcc-20-full-disk-access-pppc-requirement-scope) | Whether Full Disk Access via PPPC is required for all features or only DLP/posture |
| [`zcc-21`](../_clarifications.md#zcc-21-minimum-supported-macos-version) | Minimum supported macOS version (explicit statement) |
| [`zcc-22`](../_clarifications.md#zcc-22-macos-update-channel-plist-key) | Whether a portal-side plist key controls the macOS update channel |
| [`zcc-23`](../_clarifications.md#zcc-23-system-extension-behavior-after-launchtray-0-on-macos-13) | ZCC System Extension behavior after `launchTray = 0` on macOS 13+ with Login Items restrictions |

---

## Cross-links

- Cross-platform install parameter semantics (Windows / macOS / iOS / Android) — [`./install-parameters.md`](./install-parameters.md)
- Runtime forwarding behavior (Tunnel vs. PAC, fail-open, trusted-network detection) — [`./forwarding-profile.md`](./forwarding-profile.md)
- App Profile / Web Policy (where `policyToken` resolves, per-platform overrides) — [`./web-policy.md`](./web-policy.md)
- Device inventory, `zapp_arch`, and lifecycle API — [`./devices.md`](./devices.md)
