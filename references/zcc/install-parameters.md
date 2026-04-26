---
product: zcc
topic: "install-parameters"
title: "ZCC install-time parameters — Windows / macOS / iOS / Android reference"
content-type: reasoning
last-verified: "2026-04-26"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/supported-parameters-zscaler-client-connector-windows.md"
  - "vendor/zscaler-help/supported-parameters-zscaler-client-connector-macos.md"
  - "vendor/zscaler-help/supported-parameters-zscaler-client-connector-ios.md"
  - "vendor/zscaler-help/parameters-guide-zscaler-client-connector-android-and-android-chromeos.md"
author-status: draft
---

# ZCC install-time parameters — Windows / macOS / iOS / Android reference

## What install parameters are (and aren't)

Install parameters are values baked into ZCC at deployment time — passed via MSI properties, plist keys pushed by MDM, or managed-app-config dictionaries. They control behavior that either must be present before the agent can enroll, or that the agent cannot safely change after first boot without a reinstall.

They are **not** the same as:

- **Forwarding profile** — runtime policy evaluated live on the endpoint, configurable from the admin console without touching the endpoint. See [`./forwarding-profile.md`](./forwarding-profile.md).
- **App Profile / Web Policy** — the profile-assignment policy that maps users to forwarding profiles, captive-portal grace periods, and related settings. See [`./web-policy.md`](./web-policy.md).
- **profile.json** — the downloaded app policy bundle; populated from the admin console, not the installer.

**Lifecycle.** Parameters are read at install time. Most are stored locally and persist across upgrades. Changing them typically requires reinstalling ZCC (or at minimum a silent reinstall passing the new values). A small number — `POLICYTOKEN` notably — are superseded after enrollment when the user's group-matched App Profile takes over; that replacement is expected behavior, not a bug.

**Delivery mechanisms by platform:**

| Platform | Mechanism |
|---|---|
| Windows | MSI property flags (`msiexec /i ZCC.msi PARAM=value`) or EXE command-line args |
| macOS | PLIST keys deployed via MDM (Intune, Jamf Pro) alongside the pkg |
| iOS | MDM managed-app-config dictionary (AppConfig standard) |
| Android / ChromeOS | MDM managed-config keys (Android Enterprise) |

---

## Parameter categories

### Identity / enrollment

These parameters identify the tenant and user to ZCC before it has a policy bundle. Without them, ZCC shows an enrollment screen where users type a domain; with them, ZCC can proceed straight to SSO or silent enroll.

**Windows** (MSI / EXE):

| Parameter (MSI / EXE) | Type | Default | Description |
|---|---|---|---|
| `USERDOMAIN` / `userDomain` | string | — | Primary domain for the tenant. Must match the SAML NameID domain exactly. Allows ZCC to skip the enrollment domain-entry screen and go straight to SSO. |
| `CLOUDNAME` / `cloudName` | string | — | ZIA cloud name (e.g., `zscalertwo`). Required when `STRICTENFORCEMENT` is set. Unnecessary if the tenant has one cloud. |
| `DEVICETOKEN` / `deviceToken` | string | — | Device token from the ZCC Portal, for ZCC-Portal-as-IdP flows. ZIA only; ZPA requires ZIdentity. |
| `UNAME` / `userName` | string | — | Username (no domain part). Requires `USERDOMAIN`. MDM macros supported. |
| `EXTERNALDEVICEID` / `externalDeviceId` | string | `0` (off) | Associates MDM device record with ZCC Portal record. MDM macros supported. Requires ZCC 4.1+ on Windows. |
| `ENABLEFIPS` / `enableFips` | bool | `0` | Use FIPS-compliant libraries. Enable only where FIPS is a hard requirement. |

**macOS** (PLIST key name is identical to the EXE form above): `userDomain`, `cloudName`, `deviceToken`, `userName`, `externalDeviceId` (requires ZCC 4.2+), `enableFips`. Semantics identical to Windows; delivered via MDM-pushed plist.

**iOS** (MDM managed-app-config):

| Key | Type | Default | Description |
|---|---|---|---|
| `userDomain` | string | — | Same as Windows. |
| `cloudname` | string | — | Note lowercase `n` — differs from other platforms. Required with `strictEnforcement`. |
| `deviceToken` | string | — | ZIA only; ZPA requires ZIdentity. |
| `username` | string | — | Note all-lowercase. Requires `userDomain`. MDM macros supported. |
| `externalDeviceId` | string | `0` | MDM-to-ZCC Portal device correlation. MDM macros supported. |
| `enableFips` | bool | `0` | FIPS-compliant libraries. |
| `authByTunnel` | int | `0` | Auto-enrollment mode: `0` = off, `1` = always re-enroll after logout, `2` = one-time. ZIA only. |
| `ownership` | string | — | Populates the Ownership Variable device posture type. Push via managed-app-config only, not VPN profile. |

**Android / ChromeOS** (managed-config):

| Key | Type | Default | Description |
|---|---|---|---|
| `userDomain` | string | — | Same semantics. |
| `cloudName` | string | — | Same. |
| `deviceToken` | string | — | ZIA only; ZPA not supported. |
| `userName` | string | — | Requires `userDomain`. Intune supports `{{partialupn}}` macro. |
| `externalDeviceId` | string | `0` | Requires ZCC 3.7+ on Android. |
| `enableFips` | bool | `0` | |
| `autoEnrollWithMDM` | int | `0` | `0` = off, `1` = always, `2` = one-time. When `1` or `2`: `deviceToken`, `cloudName`, `userDomain` must also be set. |
| `Ownership` | string | — | Note capital `O` — differs from iOS. Device posture variable. |

---

### Strict Enforcement

Strict Enforcement blocks all internet traffic until ZCC is enrolled and a policy is in effect. It is the primary fail-close mechanism at the **enrollment** layer (distinct from SE Fail Close, which operates post-enrollment).

**`STRICTENFORCEMENT` / `strictEnforcement`** — Windows, macOS, iOS.

| Aspect | Detail |
|---|---|
| Type | bool |
| Default | `0` (disabled) |
| Requires | `CLOUDNAME`/`cloudName` + `POLICYTOKEN`/`policyToken` on all platforms |
| Forwarding profile constraint | Only effective when forwarding profile action is **Tunnel** or **Tunnel with Local Proxy**. Has no effect in PAC or Direct mode. |
| Blocks on | Pre-enrollment; after logout; after administrator removes device. Does **not** affect users who remain logged in and disable ZIA manually. |
| Citrix VDI note (Windows) | Must set `HIDEAPPUIONLAUNCH=0` for non-persistent Citrix VDIs. |

**SE Fail Close** (Windows only, ZCC 4.6+) — extends strict enforcement with a pre-downloaded fail-close config so ZCC can enforce policy even during a cloud outage:

| Parameter (MSI / EXE) | Description |
|---|---|
| `IMPORTSEFAILCLOSECONFIG` / `importSEFailCloseConfig` | Path to pre-downloaded fail-close config file. Requires `STRICTENFORCEMENT` + `SEFAILCLOSECONFIGTHUMBPRINT`. |
| `SEFAILCLOSECONFIGTHUMBPRINT` / `failCloseConfigThumbprint` | Public-key thumbprint for the fail-close config file. |

**iOS strict enforcement** additionally requires `excludeList` (see Tunnel mode section) to enumerate domains reachable before enrollment (MDM server, IdP, etc.).

---

### Machine Tunnel

Machine Tunnel is a ZPA feature that establishes a tunnel before any user logs in, allowing ZPA-protected resources to be reachable at the Windows login screen (e.g., AD authentication over ZPA).

| Parameter (MSI / EXE) | Platform | Type | Default | Description |
|---|---|---|---|---|
| `MTAUTHREQUIRED` / `mtAuthRequired` | Windows | bool | `0` | Require users to authenticate against the IdP before the machine tunnel starts. Without this, the machine tunnel runs unauthenticated (device identity only). |
| `POLICYTOKEN` / `policyToken` | Windows, macOS, iOS | string | — | **Required** when configuring machine tunnel (in addition to strict enforcement). Enforces the named App Profile before user login. The PAC file in that profile must include a bypass for the IdP login page. |

---

### Tunnel mode / network stack

These parameters select or constrain ZCC's traffic interception approach. Most are Windows-specific because Windows has multiple driver architectures.

**Windows LWF (Lightweight Filter) driver:**

| Parameter (MSI / EXE) | Type | Default | Description |
|---|---|---|---|
| `LWFBOOTSTART` / `LWFBootStart` | bool | `0` | Sets LWF driver start type to **Boot** (starts before user session, required for machine tunnel and early-boot enforcement). |
| `USELWFDRIVER` / `useLWFDriver` | bool | `0` | Enable the packet-filter-based LWF driver. **Overrides** the Tunnel Driver Type setting in the forwarding profile at the admin console. See [§ LWF gotchas](#gotchas) below. |
| `INSTALLLWFDRIVER` / `installLWFDriver` | bool | `0` | Install the NDIS 6 LWF driver. Separate from enabling it — installs the driver binary without activating it. |
| `REINSTALLDRIVER` / `reinstallDriver` | bool | `0` | Force reinstall of the driver, even if one exists. Use when the existing driver is corrupt. |

**Multi-platform:**

| Parameter | Platform | Type | Default | Description |
|---|---|---|---|---|
| `newBindFlow` | iOS | bool | `1` | Multithreaded microservices binding with the ZCC virtual interface. Per-app VPN only. |
| `DropNonRoutingTraffic` | iOS | bool | `0` | Drop traffic without matching routes. |
| `PAVConnectionSynced` | iOS | bool | `0` | Delay per-app VPN connection until ZCC is connected. Per-app VPN only. |
| `SkipInterfaceInstallation` | iOS | bool | `0` | Only show VPN icon when user is logged in. Requires Tunnel SDK 3.7+. |
| `MatchDomainsNoSearch` | iOS | bool | `0` | Prevent ZPA match domains from being appended as DNS search domains. |
| `SystemDNSEnabled` | iOS | int | `2` (disabled) | `1` = use system DNS for non-Zscaler queries; falls back to Google DNS on failure. |
| `customDNS` | Android | string | — | Override default DNS server with a specific IP. |

---

### BCP (Business Continuity)

BCP parameters allow ZCC to enroll new users during a ZPA cloud outage or ISP outage by using a pre-downloaded configuration bundle. Windows only, ZCC 4.6+.

| Parameter (MSI / EXE) | Type | Description |
|---|---|---|
| `BCPCONFIGFILEPATH` / `bcpConfigFilePath` | string (path) | Path to the pre-downloaded BCP config file from the ZPA Admin Portal. Must be paired with `BCPMAPUBKEYHASH`. |
| `BCPMAPUBKEYHASH` / `bcpMAPublicKeyHash` | string (base64) | Public key thumbprint for the BCP config file. Example: `sYxSOjkj9DP1Ksw3LQ/FrPsBPfcsURrM5vNuH7Kmf1A=`. Must be paired with `BCPCONFIGFILEPATH`. |

Both keys must be set together. Neither works alone.

---

### UI / user access

| Parameter (MSI / EXE or PLIST) | Platform | Type | Default | Description |
|---|---|---|---|---|
| `HIDEAPPUIONLAUNCH` / `hideAppUIOnLaunch` | Windows, macOS | bool | `0` | Hide ZCC window until user opens it. Users can still access via system tray. On Windows + Citrix: must be `0` with `STRICTENFORCEMENT`. |
| `LAUNCHTRAY` / `launchTray` | Windows, macOS | bool | `1` | Auto-start ZCC UI and services after install. Set to `0` to defer until next reboot or manual launch. |
| `ENABLEANTITAMPERING` / `enableAntiTampering` | Windows | bool | `0` | Prevent users from stopping or modifying ZCC services. Can be overridden by the App Profile "Override Anti Tampering" setting. |
| `EXTERNALREDIRECT` / `externalRedirect` | Windows, macOS | bool | `0` | Redirect SAML auth to the system browser. On macOS, covers Safari; user must select **Remember Me** on first auth. |
| `disableCaptivePortalNotification` | iOS | bool | `0` | Suppress captive-portal detection notifications. |
| `VDI` / `vdi` | Windows | bool | `0` | Marks installation as VDI. Adjusts ZCC behavior for virtual desktop scenarios. |

---

### Logging / telemetry

| Parameter (MSI / EXE) | Platform | Type | Default | Description |
|---|---|---|---|---|
| `CONFIGTIMEOUT` / `configTimeout` | Windows | int | `0` | Seconds to wait for config file if not already present on first launch. |
| `ENABLECUSTOMPROXYDETECTION` / `enableCustomProxyDetection` | Windows | bool | `0` | Parse system proxy via custom PAC download rather than Microsoft APIs, before initial policy download. Reverts to App Profile setting post-enrollment and after logout. |

---

### Update / install management

| Parameter (MSI / EXE) | Platform | Type | Description |
|---|---|---|---|
| `UPGRADEPASSWORDCMDLINE` / `upgradePasswordCmdLine` | Windows | string | Password for silent upgrade; must match the Upgrade Password in the ZCC Portal. |
| `UNINSTALLPASSWORDCMDLINE` / `uninstallPasswordCmdLine` | Windows | string | Password for silent uninstall via GPO/SCCM. Requires ZCC 4.2.1+. |
| `REVERTPASSWORDCMDLINE` / `revertPasswordCmdLine` | Windows | string | Password for silent revert to previous version. Requires ZCC 4.2.1+. |
| `revertzcc` (EXE only) | Windows | bool | Silent revert. Use the installer path of the pre-upgrade version. |
| `mode` / `unattendedmodeui` (EXE only) | Windows | enum | Silent install mode and UI verbosity. `mode=unattended` required for `unattendedmodeui`. |
| `installer-language` (EXE only) | Windows | enum | Installer language (`en`/`fr`). ZCC 4.5+ only. Does not change app UI language. |
| `INSTALLWEBVIEW2` / `installWebView2` | Windows | bool | Install WebView2 framework. Testing only; pair with `ENABLESSO`/`enableSSO` to test WebView2 SSO. |
| `ENABLESSO` / `enableSSO` | Windows | int | `2` (policy-controlled) | `1` = enable, `0` = disable Azure AD Primary Account SSO. |
| `allowRunningOnRootedDevice` | Android | bool | `0` | Allow ZCC on rooted devices. ZCC 3.7+. Formerly `allowZccOnRootedDevice`. |
| `allowRunningOnEmulator` | Android | bool | `0` | Allow ZCC on emulators. Formerly `allowZccOnEmulator`. |
| `ENABLEIMPRIVATAINTEGRATION` / `enableImprivataIntegration` | Windows | bool | `0` | Enable Imprivata OneSign silent login integration. ZCC 4.4+. |

---

## Gotchas

### POLICYTOKEN + STRICTENFORCEMENT = fail-close if misconfigured

When `STRICTENFORCEMENT=1` is set, ZCC blocks **all** internet traffic until a valid policy is in effect. `POLICYTOKEN` specifies which App Profile applies before user enrollment. If the policy token is wrong, expired, or the referenced App Profile has no valid PAC bypass for the IdP, the device blocks its own auth path. The user cannot authenticate to fix it. Resolution requires a reinstall with a corrected token or disabling strict enforcement at the MSI level. Always validate `POLICYTOKEN` in a test deployment before fleet rollout.

### USERLWFDRIVER overrides the forwarding profile

`USELWFDRIVER=1` at install time forces the LWF packet-filter driver regardless of the **Tunnel Driver Type** selector in the forwarding profile in the admin console. The admin console setting is silently ignored. If operators are seeing unexpected driver behavior after an admin console change, check whether `USELWFDRIVER` was set at install. Reversing it requires reinstall. See also `enableLWFDriver` on the ForwardingProfile object in [`./forwarding-profile.md`](./forwarding-profile.md) — that field controls the same behavior at runtime for profiles that were not locked by the install parameter.

### LWFBOOTSTART and machine tunnel

`LWFBOOTSTART=1` is required for machine tunnel scenarios where ZPA connectivity must exist before the user session starts (e.g., reaching an AD domain controller over ZPA during Windows login). Without it, the LWF driver loads after the user session starts, making machine-tunnel-dependent resources unavailable at the login screen.

### macOS install option customization page

The Zscaler help page for "Customizing Zscaler Client Connector with Install Options for macOS" redirected at capture time and yielded no content. The macOS parameter set documented here is sourced from the supported-parameters page only. Operators needing macOS pkg-level install option customization (beyond plist keys) should consult current Zscaler documentation directly.

### Parameters read once vs parameters consulted repeatedly

Most parameters are read at install and cached. `POLICYTOKEN` is an exception: it is active only until the user enrolls, after which the user's group-matched App Profile supersedes it. `ENABLECUSTOMPROXYDETECTION` has a similar lifecycle: it governs pre-policy-download behavior, then the App Profile's proxy detection setting takes over post-enrollment and after logout.

### iOS `excludeList` required with strict enforcement

On iOS, `strictEnforcement=1` without `excludeList` blocks access to the MDM server itself, preventing the MDM from pushing updates or commands. At minimum, the MDM server domain and the ZPA auth endpoint (`authsp.prod.zpath.net`) must be listed. Check your MDM's own documentation for additional required exclusions.

### Android `autoEnrollWithMDM` dependencies

Setting `autoEnrollWithMDM=1` or `=2` without also setting `deviceToken`, `cloudName`, and `userDomain` causes enrollment to fail silently. All four parameters must be present together.

---

## Cross-links

- Forwarding profile (runtime tunnel/proxy behavior, LWF driver override, fail-open policy) — [`./forwarding-profile.md`](./forwarding-profile.md)
- Web Policy / App Profile (where policyToken resolves, per-profile captive portal, platform sub-policies) — [`./web-policy.md`](./web-policy.md)
- Z-Tunnel 1.0 vs 2.0 and driver selection — [`./z-tunnel.md`](./z-tunnel.md)
- Devices and posture (externalDeviceId, ownership variable usage) — [`./devices.md`](./devices.md)
- Trusted networks (criteria evaluated by the forwarding profile at runtime) — [`./trusted-networks.md`](./trusted-networks.md)
