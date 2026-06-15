---
product: zcc
topic: "zcc-web-policy"
title: "ZCC web policy — on-device policy and per-platform overrides"
content-type: reference
last-verified: "2026-06-15"
verified-against:
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/failopen_policy/failopen_policy.go"
  - "vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md"
  - "vendor/zscaler-help/configuring-zscaler-client-connector-app-profiles.md"
author-status: draft
---

# ZCC web policy — on-device policy and per-platform overrides

The ZCC **Web Policy** object (called **App Profile** in the ZCC admin portal UI) is the on-endpoint policy that controls ZCC's own behavior — PAC URLs, which Forwarding Profile to use for ZIA/ZPA, whether ZCC installs the SSL root cert, uninstall-protection passwords, per-app bypasses, platform-specific settings, and disaster-recovery fallback behavior. It is **not** ZIA's URL filtering policy; those are different products in different places.

**Naming note**: `WebPolicy` is the SDK/API name (wire path: `/zcc/papi/public/v1/web/policy/...` — note the slash between `web` and `policy`, confirmed in `web_policy.py:76` and the Go const `baseWebPolicyEndpoint = "/zcc/papi/public/v1/web/policy"` at `web_policy.go:17`). **App Profile** is the admin-portal UI name for the same object. When an admin says "the user's App Profile" or "edit the Windows app profile rule," they mean a Web Policy entry scoped to those users/that platform. See [`clarification zcc-07`](../_meta/clarifications.md#zcc-07-forwarding-profile-assignment-to-usersdevices).

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`; `vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md`.

---

## What web policy controls

A Web Policy / App Profile is the central configuration object that decides what ZCC does on a given device. It controls:

1. **Forwarding profile assignment** — which Forwarding Profile the user's device gets (and therefore where ZCC sends their traffic on each network type).
2. **ZIA service controls** — PAC URL, SSL cert installation, log mode, disaster recovery fallback.
3. **ZPA service controls** — machine provisioning key for machine tunnel enrollment.
4. **Per-platform password gates** — uninstall, logout, and disable passwords that prevent users from removing or disabling ZCC without admin authorization.
5. **App bypass lists** — which applications bypass ZCC's interception entirely.
6. **On-Net behavior** — what ZCC does when the device is detected as "on the corporate network."

Multiple Web Policies can exist per tenant, scoped by user/group/device-group. They evaluate in rule order (first-match-wins) — the same pattern as ZIA and ZPA policies.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`; `vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md`.

---

## Distinction from ZIA URL filtering policy

ZCC Web Policy and ZIA URL filtering policy are entirely separate constructs:

| Aspect | ZCC Web Policy (App Profile) | ZIA URL Filtering Policy |
|---|---|---|
| Where configured | ZCC Portal | ZIA Admin Portal |
| What it controls | ZCC agent behavior, forwarding mode, passwords, SSL cert | Which URLs are allowed, blocked, or alerted on by ZIA cloud |
| Enforcement point | On the endpoint (ZCC agent) | In the ZIA cloud (Service Edge) |
| API object | `WebPolicy` / `/zcc/papi/public/v1/web/policy/` | ZIA URL Category / Rule resources |
| Effect on traffic | Determines whether traffic reaches ZIA at all (via Forwarding Profile) | Determines what ZIA does with traffic that reaches it |

ZCC Web Policy can bypass ZIA entirely (via Forwarding Profile action `NONE` on trusted networks) — in that case, ZIA URL filtering never runs for that traffic. Web Policy controls the gate; ZIA URL filtering controls what happens after the gate.

---

## WebPolicy SDK fields — top-level structure

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`.

From `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py` (Tier B — SDK/TF):

### Top-level vs `policyExtension` dual fields (the `*Top` pattern)

The Go `WebPolicy` struct is modeled on the ZCC admin UI's form-state, so **many settings appear twice on the wire** — once at the top level of the policy body and once inside `policyExtension` — with different wire types. The Go SDK names the top-level copy with a `Top` suffix and the `policyExtension` copy without it; the constructor populates both, and the API expects both (`web_policy.go:83–90`, comment block). Examples (top-level vs extension):

- `useDefaultAdapterForDNS` — top-level `string` (`web_policy.go:243`) and inside `policyExtension` `string` (`web_policy.go:560`).
- `enforceSplitDNS` / `disableDNSRouteExclusion` / `dropQuicTraffic` — top-level `string` (`web_policy.go:245–248`) vs extension `common.IntOrString` (`web_policy.go:572,578,579`).
- `useTunnelSDK4_3` — top-level JSON **number** (`int`, `web_policy.go:319`) but a **quoted string** inside the iOS sub-policy (`IosPolicy.UseTunnelSDK43`, `web_policy.go:375`) — the wire shapes diverge intentionally.

A tool that constructs a payload by hand and sets only one of the two copies can silently no-op or fail validation. When auditing snapshot JSON, expect to see both keys.

### Scope and evaluation

| Python field | Wire key | Type | Role |
|---|---|---|---|
| `rule_order` | `ruleOrder` | int | Evaluation order. Lower = higher priority. First-match-wins. |
| `active` | `active` | bool | Whether this policy is live. |
| `description` | `description` | str | Free-form admin notes. |
| `user_ids` / `user_names` | `userIds` / `userNames` | list | Specific users this policy applies to. |
| `group_ids` / `group_names` | `groupIds` / `groupNames` | list | User groups. |
| `device_group_ids` / `device_group_names` | `deviceGroupIds` / `deviceGroupNames` | list | Device groups. |
| `users` / `groups` | `users` / `groups` | list | Nested full user/group objects (for display; IDs are authoritative). |
| `group_all` | `groupAll` | bool | Applies to all groups. When true, group_ids are ignored — broader flag takes priority. |
| `enable_device_groups` | `enableDeviceGroups` | bool | Whether device-group scoping is in force. If false, `device_group_ids` is ignored. |
| `forwarding_profile_id` | `forwardingProfileId` | int | **The assignment link.** References which Forwarding Profile this policy's users get. This is how Forwarding Profiles are assigned to users — it is a field on Web Policy, not a separate object. (`webpolicy.py:98`, `web_policy.go:141`) See [`./forwarding-profile.md`](./forwarding-profile.md). |
| `zia_posture_config_id` | `ziaPostureConfigId` | int | ZIA device posture config reference. Cross-product hook for posture-gated access. `ziaPostureConfigId` is `omitempty` in Go — absent from a fresh create body. (`webpolicy.py:116`, `web_policy.go:143`) |

### App bypass fields

| Python field | Wire key | Role |
|---|---|---|
| `bypass_app_ids` | `bypassAppIds` | Predefined application IDs that bypass ZCC interception. |
| `bypass_custom_app_ids` | `bypassCustomAppIds` | Custom application IDs that bypass ZCC. |
| `app_identity_names` | `appIdentityNames` | Application identity names for process-based bypass. |
| `app_service_ids` / `app_service_names` | `appServiceIds` / `appServiceNames` | Application service references for bypass. |

---

## Top-level ZCC behavior knobs

| Python field | Wire key | Type | Role |
|---|---|---|---|
| `allow_unreachable_pac` | `allowUnreachablePac` | bool | Whether ZCC allows traffic if the configured PAC URL is unreachable. If false, traffic is blocked when PAC is down. Pairs with DR config. |
| `pac_url` | `pac_url` (snake_case on wire) | str | The PAC URL honored by users on this policy. **Literal snake_case on the wire** — confirmed in both Python (`webpolicy.py:106`) and Go (`PacURL string json:"pac_url"`, `web_policy.go:165`). Tools writing JSON by hand must preserve this case. |
| `tunnel_zapp_traffic` | `tunnelZappTraffic` | bool | Whether ZCC's own (ZApp) traffic goes through the Z-Tunnel (vs. direct). (`webpolicy.py:115`, `web_policy.go:205`) |
| `reauth_period` | `reauth_period` (snake_case on wire) | int | How often ZCC prompts users to re-authenticate (unit not documented in SDK). **snake_case wire key** confirmed in both SDKs (`webpolicy.py:110`, `ReauthPeriod ... json:"reauth_period"` `web_policy.go:208`). |
| `reactivate_web_security_minutes` | `reactivateWebSecurityMinutes` | int | If a user disables web security (where allowed), how long before ZCC re-enables it automatically. Pairs with `send_disable_service_reason`. |
| `send_disable_service_reason` | `sendDisableServiceReason` | bool | Whether ZCC prompts the user for a reason when disabling the service. Reason data surfaces in `download_disable_reasons()` CSV. |
| `log_level` | `logLevel` | str/int | Logging verbosity level on the endpoint. Maps to Error/Warn/Info/Debug modes. |
| `log_mode` | `logMode` | str/int | Log mode (may overlap with `log_level` — exact distinction not documented). |
| `log_file_size` | `logFileSize` | int | Maximum size of ZCC log files on the endpoint. |
| `highlight_active_control` | `highlightActiveControl` | bool | UI polish — highlight the active rule in ZCC's local admin UI. |

### `device_type` integer enum

`device_type` is serialized as a JSON number on the wire. The integer mapping is now documented directly in the Go SDK (`web_policy.go:65–69`, also reused by `GetWebPolicyByID` at `web_policy.go:708–709`):

| Integer | Platform |
|---|---|
| 1 | iOS |
| 2 | Android |
| 3 | Windows |
| 4 | macOS |
| 5 | Linux |

This is the value the `activate_web_policy` / `ActivateWebPolicy` call expects in its `device_type` / `DeviceType` field — see [§ Activation scope](#activation-scope-single-policy-device_type-not-bulk). The list endpoint's `device_type` **query param** uses the string form instead (`ios` / `android` / `windows` / `macos` / `linux`, `web_policy.py:45–46`). The same enum belongs in [`./api-schemas.md`](./api-schemas.md). The API also returns a companion `deviceType` string on reads (e.g. `"DEVICE_TYPE_MAC"`) that the Go SDK does not model (`web_policy.go:66–69`, `DeviceTypeAlt` field at `:323` is the read-only mirror).

### Captive-portal and fail-open knobs (top level)

The rewritten Go struct surfaces several top-level network-behavior toggles that the older doc did not cover (`web_policy.go:152–154`):

| Wire key | Go type | Role |
|---|---|---|
| `enableCaptivePortalDetection` | int | Whether ZCC detects captive portals (hotel/airport login pages) and temporarily relaxes interception so the user can authenticate. |
| `enableFailOpen` | int | Top-level fail-open switch — allow direct traffic when ZCC cannot establish the tunnel/proxy. The tenant-level equivalent lives in `FailOpenPolicy` — see [§ Disaster Recovery vs fail-open](#disaster-recovery-block). |
| `captivePortalWebSecDisableMinutes` | int | How long web security stays disabled while the captive-portal flow completes. |

These same three keys are also the core of the standalone `FailOpenPolicy` object (`failopen_policy.go:18,22,23`), so a tenant can express captive-portal/fail-open behavior at both the App Profile level and the tenant level.

The policy also carries an **`endToEndDiagnostics`** block keyed per network context — `trusted` / `vpnTrusted` / `offTrusted` / `splitVpnTrusted` ints (`web_policy.go:40–45`), surfaced at the WebPolicy top level (`web_policy.go:156`) and also embedded as JSON inside `policyExtension.zdxLiteConfigObj`. This toggles ZCC's end-to-end (ZDX-style) diagnostics independently for each trusted-network state.

---

## Per-platform sub-policies

Each platform has its own sub-policy block within the Web Policy. The five platforms are: `windowsPolicy`, `macPolicy`, `linuxPolicy`, `iosPolicy`, `androidPolicy`. A null sub-policy means "no platform-specific policy defined" — not "inherit defaults." Devices on an unscoped platform fall through to the tenant's default Web Policy.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`; `vendor/zscaler-help/configuring-zscaler-client-connector-app-profiles.md`.

Common fields across platforms (the wire keys vary by platform — see [§ install_ssl_certs wire-key matrix](#install_ssl_certs-wire-key-matrix) below):

| Field pattern | Role |
|---|---|
| `disable_password` | Password a user must enter to disable ZCC. Empty = no password required. |
| `logout_password` | Password a user must enter to log out of ZCC. |
| `uninstall_password` | Password a user must enter to uninstall ZCC. |
| install-SSL-cert (Python attr `install_ssl_certs` on Windows/Linux, `install_certs` on Android/macOS) | Whether ZCC pushes the Zscaler root CA into the OS certificate store. **Required for SSL inspection to work without cert errors.** Emitted wire key differs by platform AND by SDK — see matrix below. |

### Platform-specific fields (selected)

**Windows / macOS / Linux**: Primarily the password-based controls above plus log settings. No mobile-specific fields.

**Android-specific**:
- `allowed_apps` — allowlist of apps that ZCC manages on Android.
- `bypass_android_apps` — apps that bypass ZCC on Android.
- `bypass_mms_apps` — MMS/SMS apps that bypass ZCC (avoids MMS breakage from ZCC interception).
- `enforced` — whether ZCC is enforced (cannot be disabled) on Android.
- `quota_in_roaming` — whether cellular data quota applies during roaming.
- `billing_day` — monthly billing cycle start day for cellular quota tracking.
- `wifi_ssid` — SSID-based configuration for Android.
- `custom_text` — custom notification text shown to Android users.

**iOS**: The Go `IosPolicy` block is small — `disablePassword` / `logoutPassword` / `uninstallPassword` / `passcode` plus `ipv6Mode` (int) and `useTunnelSDK4_3` (quoted string) and `showVPNTunNotification` (`web_policy.go:368–376`). iOS carries no SSL-cert-install field (see matrix above). Most iOS-specific behavior lives in **top-level** iOS-only fields and two dedicated blocks rather than in the small `iosPolicy` sub-policy:

- **`notificationTemplateContract`** (`web_policy.go:430–454`) — an iOS-only block of ZIA notification toggles: `ziaFirewall` / `ziaFirewallPopup`, `ziaDNS` / `ziaDNSPopup`, `ziaIPS` / `ziaIPSPopup`, plus ZPA-reauth and device-posture-failure notification timers. Pointer-typed and `omitempty` on the parent (`web_policy.go:320`), so only iOS payloads emit it.
- **`enableZaisService`** (`web_policy.go:539`) — an iOS-only ZAIS service toggle inside `policyExtension`, emitted as a JSON number; `omitempty` keeps it off the wire for non-iOS device types.
- Top-level iOS-only mirrors: `ipv6Mode`, `showVPNTunNotification`, `useTunnelSDK4_3`, `useZscalerNotificationFramework`, `switchFocusToNotification` (`web_policy.go:317–325`), all `omitempty`.

### `install_ssl_certs = false` is a common SSL inspection gap

If the SSL-cert-install field is `false` on any platform sub-policy, ZCC does not push the Zscaler root CA to that platform's OS certificate store. Users on that platform will see certificate errors when ZIA performs SSL inspection on their traffic (because their OS doesn't trust the Zscaler CA). A tenant reporting "macOS users see cert errors but Windows users don't" should check the per-platform fields — the Windows sub-policy may have it true and the macOS sub-policy false.

#### `install_ssl_certs` wire-key matrix

The wire key for the per-OS SSL-cert-install field is **not consistent across platforms**, and the Python and Go SDKs disagree on **two** platforms (Windows *and* macOS) — in **opposite directions**. Tools constructing payloads by hand or auditing snapshot JSON must use the right key per platform AND per SDK, because a payload sent with the wrong key is silently ignored. (The Go MacPolicy carries an explicit comment that camelCase tags caused `{"success":"false","id":0}` on `/edit` until the field was switched to snake_case — `web_policy.go:389–394`.)

| Platform | Python emit key | Go wire key | Status |
|---|---|---|---|
| Windows | `install_ssl_certs` (snake_case) — `webpolicy.py:895` | `installCerts` (camelCase) — `WindowsPolicy.InstallCerts`, `web_policy.go:465` | **Conflict** — Python snake / Go camel. |
| macOS | `installCerts` (camelCase) — `webpolicy.py:1140` | `install_ssl_certs` (snake_case) — `MacPolicy.InstallSslCerts`, `web_policy.go:408` | **Conflict, INVERTED from Windows** — Python camel / Go snake. |
| Linux | `installCerts` — `webpolicy.py:946` | `installCerts` — `LinuxPolicy.InstallCerts`, `web_policy.go:380` | Consistent (both camelCase). |
| Android | `installCerts` — `webpolicy.py:1065` | `installCerts` — `AndroidPolicy.InstallCerts`, `web_policy.go:348` | Consistent (both camelCase). |
| iOS | **Not present** | **Not present** | iOS sub-policy has no SSL-cert-install field at all (Python `IOSPolicy` `webpolicy.py:954–999`, Go `IosPolicy` `web_policy.go:368–376`). iOS uses the device profile / MDM mechanism for cert install instead. |

Python attribute names are inconsistent too: Windows/Linux store it as `install_ssl_certs` but Android/macOS store it as `install_certs` — only the **emitted wire key** (above) matters for payloads.

**Go-only top-level `install_ssl_certs`**: separate from all of the per-OS fields above, the Go `WebPolicy` carries a top-level `InstallSslCertsTop common.IntOrString json:"install_ssl_certs"` (`web_policy.go:186`). This is a UI form-state mirror with **no Python top-level equivalent** — do not confuse it with the per-OS sub-policy field. A payload that sets the top-level `install_ssl_certs` but not the matching per-OS key (or vice versa) can behave unexpectedly.

**Operational implications**:
- A tenant reporting "macOS users see cert errors but Windows users don't" may have intended the same setting on both, but because the cert wire-key differs **per platform AND per SDK**, a hand-built payload that uses the wrong key for one platform silently no-ops there and leaves that platform without the cert. Check the actual emitted key, not the Python attribute name.
- A tenant deploying ZCC on iOS for the first time and expecting `install_ssl_certs = true` to push certs will be surprised — the field doesn't exist on iOS. iOS cert installation is an MDM concern, not a ZCC App Profile concern.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`.

---

## On-Net policy

The `onNetPolicy` sub-object controls what ZCC does when it detects it is on the corporate network. This is distinct from Trusted-Network evaluation in the Forwarding Profile (which controls where traffic goes per-network-type). Python models it as the `OnNetPolicy` class (`webpolicy.py:685–727`) wired into the parent `WebPolicy` as `on_net_policy` (`webpolicy.py:220–228`). Fields (`webpolicy.py:700–706`):

| Wire key | Python attr | Role |
|---|---|---|
| `id` | `id` | Sub-object ID. |
| `name` | `name` | Display name. |
| `conditionType` | `condition_type` | How criteria combine within this On-Net policy. **Yet another `conditionType` field** at a third level of the criteria tree — distinct from the Forwarding Profile's profile-level conditionType and from the per-TrustedNetwork conditionType. See [`./forwarding-profile.md § The profile object`](./forwarding-profile.md) and [`./trusted-networks.md § condition_type`](./trusted-networks.md). |
| `predefinedTrustedNetworks` | `predefined_trusted_networks` | List of predefined trusted networks for the On-Net check. |
| `predefinedTnAll` | `predefined_tn_all` | Shortcut: any predefined trusted network qualifies. |

**Go SDK does not expose `onNetPolicy`** — the Go `WebPolicy` struct (`web_policy.go:91–337`) has no `onNetPolicy` field anywhere; its nested blocks are limited to the five per-OS policies plus `policyExtension` and `disasterRecovery` (`web_policy.go:327–336`). Operators using the Go SDK cannot read or write On-Net policy through it. Python SDK is the only programmatic path. Confidence on the field semantics is low; lab-test before relying on this path.

When both `onNetPolicy` and Forwarding Profile trusted-network configuration are present, the order of evaluation and any override semantics are an open question.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`.

---

## Disaster Recovery block

The `disasterRecovery` sub-object and the `enableZiaDR` / `enableZpaDR` flags enable ZCC's DR fallback. If the ZIA or ZPA cloud is fully unreachable for an extended window, ZCC switches to a DR PAC or config to keep users working.

| Mechanism | Scope | Purpose |
|---|---|---|
| Disaster Recovery (`disasterRecovery` + `enableZiaDR`/`enableZpaDR`) | App Profile level | Prolonged ZIA or ZPA outage — ZCC switches to DR PAC/config for the duration |
| Fail-open (`FailOpenPolicy`) | Tenant level | Transient tunnel/proxy unreachability — ZCC allows direct traffic temporarily |
| `enableFailOpen` / `captivePortalWebSecDisableMinutes` | App Profile level | Top-level fail-open + captive-portal grace window on the policy itself (`web_policy.go:153–154`) |
| `allow_unreachable_pac` | App Profile level | PAC URL unreachable — allow or block traffic while PAC is down |

DR and fail-open are distinct mechanisms. DR is for multi-hour outages with an admin-provided fallback config; fail-open is for transient failures with a grace period. Fail-open exists at **two layers**: a top-level `enableFailOpen` on the App Profile (`web_policy.go:153`) and a standalone tenant-level `FailOpenPolicy` object served from its own endpoint `/zcc/papi/public/v1/webFailOpenPolicy` (`failopen_policy.go:13`). The standalone object exposes the finer-grained knobs:

| Wire key | Go field | Role |
|---|---|---|
| `enableWebSecOnProxyUnreachable` | `failopen_policy.go:25` | Keep web security on when the proxy is unreachable. |
| `enableWebSecOnTunnelFailure` | `failopen_policy.go:26` | Keep web security on when the tunnel fails. |
| `tunnelFailureRetryCount` | `failopen_policy.go:30` | How many times ZCC retries the tunnel before failing open. |
| `enableStrictEnforcementPrompt` / `strictEnforcementPromptDelayMinutes` / `strictEnforcementPromptMessage` | `failopen_policy.go:24,28,29` | Strict-enforcement prompt: warn the user (with a delayed countdown + custom message) before allowing direct traffic. |

See also [`./forwarding-profile.md`](./forwarding-profile.md).

### Python SDK SNAKE_CASE_KEYS bug — `enable_zia_dr`

Python SDK's `SNAKE_CASE_KEYS` set lists `"enable_zia_dr"` (`webpolicy.py:80`), implying the wire key should remain snake_case. But `DisasterRecovery.request_format()` actually emits `"enableZiaDR"` (camelCase, `webpolicy.py:665`), and the Go SDK confirms it: `EnableZiaDR bool json:"enableZiaDR"` (`web_policy.go:490`). **The SNAKE_CASE_KEYS entry for this field is a Python SDK bug — the wire format is camelCase.** Same pattern affects `truncate_large_udpdns_response` and `purge_kerberos_preferred_dc_cache` in `PolicyExtension`: SNAKE_CASE_KEYS lists them (`webpolicy.py:77–78`) but `request_format()` emits `truncateLargeUDPDNSResponse` / `purgeKerberosPreferredDCCache` (camelCase, `webpolicy.py:588, 590`), and the Go `PolicyExtension` confirms both as `common.IntOrString` with camelCase tags (`web_policy.go:596, 598`).

**Typing divergence**: Go now types these DR flags concretely — `EnableZiaDR` / `EnableZpaDR` / `AllowZiaTest` / `AllowZpaTest` as `bool` and `ZiaDRMethod` as `int` (`web_policy.go:488–494`) — while Python leaves them untyped (plain `config[...]` reads, `webpolicy.py:627–641`). A hand-built payload that quotes these booleans (`"enableZiaDR":"true"`) matches Python's loose shape but not Go's. This is a candidate row for [`./api-divergences.md`](./api-divergences.md) (not yet folded in).

### Go and Python `disasterRecovery` have converged

A previous version of this doc described a large field-set divergence between the SDKs. **That divergence is no longer real** — the two SDKs now emit essentially the same `disasterRecovery` field set. The fields below exist in BOTH (Go `DisasterRecovery` struct `web_policy.go:487–505`; Python `DisasterRecovery.request_format()` `webpolicy.py:664–680`):

| Wire key | Go field | Python emit | Role |
|---|---|---|---|
| `enableZiaDR` / `enableZpaDR` | `web_policy.go:490–491` | `webpolicy.py:665–666` | Enable ZIA / ZPA DR fallback. |
| `ziaDRMethod` | `web_policy.go:494` | `webpolicy.py:667` | DR method. Both SDKs use `ziaDRMethod` — Go has an explicit comment "`ziaDRMethod` (not `ziaDRRecoveryMethod`)" (`web_policy.go:480`). |
| `ziaCustomDbUrl` | `web_policy.go:495` | `webpolicy.py:668` | Custom DR database URL. |
| `useZiaGlobalDb` / `ziaGlobalDbUrl` / `ziaGlobalDbUrlv2` | `web_policy.go:493,497–498` | `webpolicy.py:669–671` | ZIA global DB selection / URLs. |
| `ziaDomainName` / `zpaDomainName` | `web_policy.go:496,502` | `webpolicy.py:672,675` | DR domain names. |
| `ziaRSAPubKey` / `ziaRSAPubKeyName` | `web_policy.go:500–501` | `webpolicy.py:673–674` | ZIA RSA public key (+ name). |
| `zpaRSAPubKey` / `zpaRSAPubKeyName` | `web_policy.go:503–504` | `webpolicy.py:677–678` | ZPA RSA public key (+ name). |
| `allowZiaTest` / `allowZpaTest` | `web_policy.go:488–489` | `webpolicy.py:678–679` | Allow ZIA / ZPA DR test mode. |

**The doc's previously-claimed Go-only secret-key fields** (`ziaSecretKeyData` / `ziaSecretKeyName` / `zpaSecretKeyData` / `zpaSecretKeyName`) and the `ziaDRRecoveryMethod` name **do not exist** anywhere in the current Go struct. The only genuine Go-side extras are read-side form-state, both `omitempty`:

- `policyId` (`web_policy.go:492`) — DR config's policy ID, populated on read.
- `ziaPacUrl` (`web_policy.go:499`) — ZIA DR PAC URL, populated on read.

The "meaningful gap, lab-test which set the API accepts" framing no longer applies — the field sets match. The remaining real differences are the typing divergence above and the `ziaPacUrl`/`policyId` read-only extras. Good candidate row for [`./api-divergences.md`](./api-divergences.md) (not yet folded in).

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`.

---

## Policy Extension

`policyExtension` (Python `PolicyExtension` class `webpolicy.py:320`; Go `PolicyExtension` struct `web_policy.go:512–631`) is a grab-bag sub-object for advanced settings — well over 60 fields, most rarely touched in normal operation. Selected high-signal fields (Python emit lines):

| Wire key | Role |
|---|---|
| `truncateLargeUDPDNSResponse` | Truncate large UDP DNS responses (avoids EDNS buffer overflow issues). Note: Python SNAKE_CASE_KEYS bug — listed there but actually emits camelCase (`webpolicy.py:588`, Go `web_policy.go:596`). |
| `purgeKerberosPreferredDCCache` | Force ZCC to clear its cached preferred domain controller. Resolves stale KDC issues after network topology changes. Same SNAKE_CASE_KEYS bug (`webpolicy.py:590`, Go `web_policy.go:598`). |
| `dropQuicTraffic` | Drop QUIC (UDP 443) traffic at ZCC. Emitted at `webpolicy.py:585` (Go `web_policy.go:579`); per-tenant operational effect on browser TCP fallback is operator-reported and not verified in this skill. |
| `enableAntiTampering` / `overrideATCmdByPolicy` / `reactivateAntiTamperingTime` | Anti-tampering controls — prevent users from killing/modifying the ZCC process. (`webpolicy.py:581–583`; Go `web_policy.go:575–576,597`) |
| `enforceSplitDNS` | Force split DNS handling. (`webpolicy.py:584`; Go `web_policy.go:578`) |
| `enableFlowBasedTunnel` | Flow-based tunnel mode (alternative to packet-based). (`webpolicy.py:606`; Go `web_policy.go:533`) |
| `zpaAuthExpOnSleep` / `zpaAuthExpOnSysRestart` / `zpaAuthExpOnNetIpChange` / `zpaAuthExpOnWinLogonSession` / `zpaAuthExpOnWinSessionLock` | Granular ZPA re-auth triggers. (`webpolicy.py:567,571`; Go `web_policy.go:547–552`) |
| `zccFailCloseSettingsLockdownOnTunnelProcessExit` / `...OnFirewallError` / `...OnDriverError` / `zccFailCloseSettingsExitUninstallPassword` | Fail-close lockdown options when ZCC core fails. (`webpolicy.py:596`; Go `web_policy.go:520,521,525,526`) These are the **fail-close** complement to the fail-open knobs above — fail-close locks the device down on ZCC failure rather than allowing direct traffic. |
| `enableZdpService` | Enable ZDP (Zscaler Data Protection / disable-protection) service. (`webpolicy.py:586`; Go `web_policy.go:626`) |
| `useDefaultAdapterForDNS` / `disableDNSRouteExclusion` / `prioritizeDnsExclusions` | DNS-handling controls. (`webpolicy.py:561,589`; Go `web_policy.go:560,572,602`) |
| `useV8JsEngine` | PAC engine selection — V8 vs the legacy JS engine. (`webpolicy.py:554`; Go `web_policy.go:581`) |
| `interceptZIATrafficAllAdapters` | Intercept ZIA traffic on all network adapters (vs primary only). (`webpolicy.py:580`; Go `web_policy.go:574`) |
| `locationRulesetPolicies` | Binds ruleset policies for `splitVpnTrusted` / `vpnTrusted` network contexts; the nested `{id}` entries are always present (id `0` when unbound). Go-modeled (`web_policy.go:51–58,603`). |

Most of these fields are rarely touched and need Zscaler Support context before reasoning about them.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`.

---

## What changes require an App Profile update vs a ZCC restart

**App Profile changes propagate only on ZCC logout/restart.** ZCC downloads updated App Profile settings only when the user logs out and back in, or restarts the computer. There is no continuous polling for App Profile changes (`about-zscaler-client-connector-app-profiles.md:17`).

| Change type | When it takes effect on connected devices |
|---|---|
| Forwarding Profile assignment (`forwarding_profile_id`) | Next ZCC login / restart |
| PAC URL (`pac_url`) | Next ZCC login / restart (then ZCC polls the PAC content separately) |
| Passwords (`disable_password`, etc.) | Next ZCC login / restart |
| `install_ssl_certs` | Next ZCC login / restart (cert is installed at startup) |
| Log mode (`log_level`, `log_mode`) | Next ZCC login / restart |
| Web Privacy settings (separate object) | Next ZCC login / restart |
| ZIA URL filtering policy (ZIA cloud, not ZCC) | Independent of ZCC restart — propagates via ZIA cloud, not the App Profile download |

An operator who pushes a critical forwarding or password policy change expecting it to take effect immediately on currently-connected devices will be surprised — those devices keep using the cached App Profile until their next ZCC restart/login event.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`; `vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md`.

---

## Web Policy vs Forwarding Profile — relationship

Web Policy is the scope + assignment object; Forwarding Profile is the traffic-behavior object. The relationship:

```
User / Device
    └── matches Web Policy (App Profile) by rule_order / group / device_group
            └── Web Policy.forwarding_profile_id → Forwarding Profile
                    ├── On-Trusted ZIA action (Tunnel / PAC / None)
                    ├── Off-Trusted ZIA action
                    ├── On-Trusted ZPA action
                    └── Off-Trusted ZPA action
```

A user can only have one active Web Policy (first-match-wins by `rule_order`). That Web Policy points to exactly one Forwarding Profile. Changing `forwarding_profile_id` on the Web Policy changes which traffic behavior the user gets — but only on their next ZCC login/restart.

**A Web Policy can reference a Forwarding Profile ID that does not exist** — the relationship is FK-shaped but not enforced at write time. `_data/snapshot/<cloud>/zcc/web-policy.json` joined with `_data/snapshot/<cloud>/zcc/forwarding-profiles.json` via ID is the way to detect orphaned references.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`.

---

## API surface

From `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py` and `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`, all methods on `client.zcc.web_policy`. **Note the wire path uses `/web/policy/` with a slash — not `/webPolicy/`.**

Go renamed its functions in the rewrite — the Go column below reflects the current names. The Python method names and HTTP verbs are unchanged.

| Python method | Go function | HTTP | Path | Source |
|---|---|---|---|---|
| `list_by_company(query_params={})` | `GetPolicyListByCompanyID(...)` | GET | `/zcc/papi/public/v1/web/policy/listByCompany` | `web_policy.py:35,73,76`; `web_policy.go:800,802` |
| — | `GetWebPolicyByID(ctx, svc, id, deviceType)` | GET | (builds on `listByCompany`, filters by id within a `deviceType`) | `web_policy.go:710` |
| `activate_web_policy(**kwargs)` | `ActivateWebPolicy(...)` | PUT | `/zcc/papi/public/v1/web/policy/activate` | `web_policy.py:101,124,127`; `web_policy.go:832,838` |
| `web_policy_edit(**kwargs)` | `UpdateWebPolicy(...)` | PUT | `/zcc/papi/public/v1/web/policy/edit` | `web_policy.py:152,449,452`; `web_policy.go:859,864` |
| `delete_web_policy(policy_id)` | `DeleteWebPolicy(...)` | DELETE | `/zcc/papi/public/v1/web/policy/{id}/delete` | `web_policy.py:473,492,495`; `web_policy.go:880,882` |

Note the Go function is `UpdateWebPolicy`, **not** `web_policy_edit` — both hit the `/edit` endpoint. The Go `baseWebPolicyEndpoint` const confirms the `/web/policy/` slashed path (`web_policy.go:17`).

**`GetWebPolicyByID` is new** and worth knowing for scripting: it lists by `deviceType`, matches a single id, and falls back to a minimal record (id/name/description/device_type/active) when the strict decode fails because the list endpoint quotes fields the struct types as numbers (`web_policy.go:677–743`).

**Create vs update signal**: `UpdateWebPolicy` is the single create-or-update path on `/edit`. The API treats **absence of `id`** in the PUT body as the "create" signal — the Go `WebPolicy.ID` field is `omitempty` precisely so a fresh create body has no `id` key (`web_policy.go:92–95`). It returns a bare `EditResponse {success, id}` (`web_policy.go:669–675`); callers refetch the full record via `GetWebPolicyByID` using the returned id + `deviceType` (`web_policy.go:853–858`). For scripting create-vs-update, drive it off the presence of `id`.

Query params for `list_by_company` (`web_policy.py:45–50`): `page` (int), `page_size` (int), `device_type` (string form `ios` / `android` / `windows` / `macos` / `linux`), `search` (str), `search_type` (str).

### Activation scope — single policy + device_type, not bulk

`activate_web_policy` takes `device_type` (int) and `policy_id` (int) as required kwargs (`web_policy.py:106–107`); the Go `ActivateWebPolicy` passes a `*WebPolicyActivation` struct with `DeviceType int` + `PolicyId int` (`web_policy.go:646–649`). The `device_type` here is the **integer** enum (1=iOS … 5=Linux — see [§ device_type integer enum](#device_type-integer-enum)), not the string form the list query param uses. **Activation is per-policy-per-platform**, not "activate everything." A tenant making changes across multiple policies or multiple platforms must call activate once per `(policy_id, device_type)` pair.

The HTTP method is `PUT`, not `POST`. Confirmed in both SDKs: Python `web_policy.py:124` and Go `ActivateWebPolicy` issues `"PUT"` against `/activate` (`web_policy.go:838,844`).

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`.

---

## Edge cases

- **`pac_url` is literal snake_case on the wire** (`pac_url`, not `pacUrl`). Tooling writing JSON by hand must preserve this exact key name. Three top-level fields stay snake_case in both Python and Go SDKs: `pac_url` (`webpolicy.py:106`, `web_policy.go:165`), `reauth_period` (`webpolicy.py:110`, `web_policy.go:208`), `device_type` (`webpolicy.py:96`, `web_policy.go:99`). The Go-only top-level `install_ssl_certs` mirror is also snake_case (`web_policy.go:186`).
- **Python `SNAKE_CASE_KEYS` set has bugs.** The set at `webpolicy.py:29–81` lists fields meant to bypass camelCase conversion, but at least three entries are actively wrong: `truncate_large_udpdns_response` (`:77`), `purge_kerberos_preferred_dc_cache` (`:78`), and `enable_zia_dr` (`:80`) are listed there but `request_format()` actually emits them as camelCase (`webpolicy.py:588, 590, 665`). The Go struct tags confirm camelCase is the wire format (`web_policy.go:596, 598, 490`). Don't trust SNAKE_CASE_KEYS membership as the source of truth — check `request_format()` output and the Go struct tags.
- **`group_all = true` with non-empty `group_ids`** — the broader flag takes priority at enforcement time; `group_ids` is effectively ignored. Audit for this as misconfiguration. Same for `enable_device_groups = false` with a populated `device_group_ids` list.
- **Per-platform sub-policy of None** — means "no policy defined for this platform," not "inherit defaults." Devices on that platform fall through to the next matching Web Policy or the tenant default policy. If the tenant default policy is permissive, this can be a security gap.
- **`activate_web_policy` is required** — Web Policy changes are staged until explicitly activated, analogous to ZIA's zone activation. Uncommitted changes are not served to endpoints. A tenant reporting "I made the change but it hasn't applied" should check whether activation was performed.
- **`forwarding_profile_id` orphan reference** — a Web Policy that references a deleted Forwarding Profile ID will fail silently or fall back to a default, depending on ZCC's resolution logic. The exact fallback behavior is not documented in available sources. Audit joins regularly.
- **Rule order gap management** — like ZIA policies, Web Policy rule order should be maintained with gaps (e.g., 10, 20, 30) rather than sequential integers to allow insertion without renumbering. The portal does not enforce contiguous ordering.

---

## Open questions

These claims are operationally useful but not backed by the vendor SDK/API source. Lab-test or confirm against Zscaler Support before relying on them:

- **`reauth_period` unit.** The field exists in both SDKs (`webpolicy.py:110`, `web_policy.go:208`) but neither documents whether the value is hours, days, or minutes. Verify against a tenant.
- **`forwarding_profile_id` orphan-reference resolution.** A Web Policy can reference a deleted Forwarding Profile ID (the relationship is FK-shaped but not enforced at write time). What ZCC actually does at enforcement — fall back to a default, fail silently, or block — is not described in any available source. See [clarification `zcc-97`](../_meta/clarifications.md#zcc-97-forwarding_profile_id-orphan-reference-resolution).
- **On-Net policy vs Forwarding Profile evaluation order.** When both `onNetPolicy` (Python-only) and Forwarding Profile trusted-network config are present, which wins and in what order is unverified. See [clarification `zcc-98`](../_meta/clarifications.md#zcc-98-on-net-policy-vs-forwarding-profile-evaluation-order).
- **iOS cert installation via MDM.** The claim that iOS cert install is "an MDM / device-profile concern" (because no `installCerts` field exists in the iOS sub-policy) is inference from the absent field, not a positively-sourced statement. The absence is sourced (`web_policy.go:368–376`, `webpolicy.py:954–999`); the MDM mechanism is not.
- **`dropQuicTraffic` browser-fallback effect.** The field exists (`web_policy.go:579`) but its operational effect on browser TCP fallback is operator-reported, not verified here. See [clarification `zcc-99`](../_meta/clarifications.md#zcc-99-dropquictraffic-browser-tcp-fallback-effect).
- **`tunnel_zapp_traffic` default / typical value.** The field exists in both SDKs but neither encodes a default or "typical" value; avoid asserting one without a tenant capture.

---

## Cross-links

- Forwarding Profile (pointed to from Web Policy via `forwarding_profile_id`) — [`./forwarding-profile.md`](./forwarding-profile.md)
- Forwarding Profiles portal configuration and assignment — [`./forwarding-profiles.md`](./forwarding-profiles.md)
- Trusted Networks (distinct from On-Net policy) — [`./trusted-networks.md`](./trusted-networks.md)
- Web Privacy (log collection; ZDX location; separate from App Profile) — [`./web-privacy.md`](./web-privacy.md)
- ZCC API surface — [`./api.md`](./api.md)
- ZIA device posture (cross-product hook via `zia_posture_config_id`) — not yet written up
- Wire-format schema for `_data/snapshot/<cloud>/zcc/web-policy.json` — [`./snapshot-schema.md`](./snapshot-schema.md)
