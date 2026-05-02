---
product: zcc
topic: "zcc-web-policy"
title: "ZCC web policy — on-device policy and per-platform overrides"
content-type: reference
last-verified: "2026-05-01"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go"
  - "vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md"
  - "vendor/zscaler-help/configuring-zscaler-client-connector-app-profiles.md"
author-status: draft
---

# ZCC web policy — on-device policy and per-platform overrides

The ZCC **Web Policy** object (called **App Profile** in the ZCC admin portal UI) is the on-endpoint policy that controls ZCC's own behavior — PAC URLs, which Forwarding Profile to use for ZIA/ZPA, whether ZCC installs the SSL root cert, uninstall-protection passwords, per-app bypasses, platform-specific settings, and disaster-recovery fallback behavior. It is **not** ZIA's URL filtering policy; those are different products in different places.

**Naming note**: `WebPolicy` is the SDK/API name (wire path: `/zcc/papi/public/v1/web/policy/...` — note the slash between `web` and `policy`, confirmed in `web_policy.py:71` and `web_policy.go:14`). **App Profile** is the admin-portal UI name for the same object. When an admin says "the user's App Profile" or "edit the Windows app profile rule," they mean a Web Policy entry scoped to those users/that platform. See [`clarification zcc-07`](../_meta/clarifications.md#zcc-07-forwarding-profile-assignment-to-usersdevices).

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

---

## Distinction from ZIA URL filtering policy

ZCC Web Policy and ZIA URL filtering policy are entirely separate constructs:

| Aspect | ZCC Web Policy (App Profile) | ZIA URL Filtering Policy |
|---|---|---|
| Where configured | ZCC Portal | ZIA Admin Portal |
| What it controls | ZCC agent behavior, forwarding mode, passwords, SSL cert | Which URLs are allowed, blocked, or alerted on by ZIA cloud |
| Enforcement point | On the endpoint (ZCC agent) | In the ZIA cloud (Service Edge) |
| API object | `WebPolicy` / `/zcc/papi/public/v1/webPolicy/` | ZIA URL Category / Rule resources |
| Effect on traffic | Determines whether traffic reaches ZIA at all (via Forwarding Profile) | Determines what ZIA does with traffic that reaches it |

ZCC Web Policy can bypass ZIA entirely (via Forwarding Profile action `NONE` on trusted networks) — in that case, ZIA URL filtering never runs for that traffic. Web Policy controls the gate; ZIA URL filtering controls what happens after the gate.

---

## WebPolicy SDK fields — top-level structure

From `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py` (Tier B — SDK/TF):

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
| `forwarding_profile_id` | `forwardingProfileId` | int | **The assignment link.** References which Forwarding Profile this policy's users get. This is how Forwarding Profiles are assigned to users — it is a field on Web Policy, not a separate object. (`webpolicy.py:97`, `web_policy.go:33`) See [`./forwarding-profile.md`](./forwarding-profile.md). |
| `zia_posture_config_id` | `ziaPostureConfigId` | int | ZIA device posture config reference. Cross-product hook for posture-gated access. (`webpolicy.py:115`, `web_policy.go:56`) |

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
| `pac_url` | `pac_url` (snake_case on wire) | str | The PAC URL honored by users on this policy. **Literal snake_case on the wire** — confirmed in both Python (`webpolicy.py:105, 303`) and Go (`web_policy.go:46`). Tools writing JSON by hand must preserve this case. |
| `tunnel_zapp_traffic` | `tunnelZappTraffic` | bool | Whether ZCC's own traffic goes through the Z-Tunnel (vs. direct). Typically off for most tenants — ZCC's own management traffic bypasses inspection. (`webpolicy.py:114`) |
| `reauth_period` | `reauth_period` (snake_case on wire) | int | How often ZCC prompts users to re-authenticate (in hours or days — exact unit not documented in SDK). **snake_case wire key** confirmed in both SDKs (`webpolicy.py:109, 306`, `web_policy.go:49`). |
| `reactivate_web_security_minutes` | `reactivateWebSecurityMinutes` | int | If a user disables web security (where allowed), how long before ZCC re-enables it automatically. Pairs with `send_disable_service_reason`. |
| `send_disable_service_reason` | `sendDisableServiceReason` | bool | Whether ZCC prompts the user for a reason when disabling the service. Reason data surfaces in `download_disable_reasons()` CSV. |
| `log_level` | `logLevel` | str/int | Logging verbosity level on the endpoint. Maps to Error/Warn/Info/Debug modes. |
| `log_mode` | `logMode` | str/int | Log mode (may overlap with `log_level` — exact distinction not documented). |
| `log_file_size` | `logFileSize` | int | Maximum size of ZCC log files on the endpoint. |
| `highlight_active_control` | `highlightActiveControl` | bool | UI polish — highlight the active rule in ZCC's local admin UI. |

---

## Per-platform sub-policies

Each platform has its own sub-policy block within the Web Policy. The five platforms are: `windowsPolicy`, `macPolicy`, `linuxPolicy`, `iosPolicy`, `androidPolicy`. A null sub-policy means "no platform-specific policy defined" — not "inherit defaults." Devices on an unscoped platform fall through to the tenant's default Web Policy.

Common fields across platforms (the wire keys vary by platform — see [§ install_ssl_certs wire-key matrix](#install_ssl_certs-wire-key-matrix) below):

| Field pattern | Role |
|---|---|
| `disable_password` | Password a user must enter to disable ZCC. Empty = no password required. |
| `logout_password` | Password a user must enter to log out of ZCC. |
| `uninstall_password` | Password a user must enter to uninstall ZCC. |
| `install_ssl_certs` (Python) / `install_certs` (Python — Android/macOS) | Whether ZCC pushes the Zscaler root CA into the OS certificate store. **Required for SSL inspection to work without cert errors.** Wire key differs by platform and SDK — see matrix below. |

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

**iOS**: Overlaps with Android for mobile-specific fields.

### `install_ssl_certs = false` is a common SSL inspection gap

If the SSL-cert-install field is `false` on any platform sub-policy, ZCC does not push the Zscaler root CA to that platform's OS certificate store. Users on that platform will see certificate errors when ZIA performs SSL inspection on their traffic (because their OS doesn't trust the Zscaler CA). A tenant reporting "macOS users see cert errors but Windows users don't" should check the per-platform fields — the Windows sub-policy may have it true and the macOS sub-policy false.

#### `install_ssl_certs` wire-key matrix

The wire key for the SSL-cert-install field is **not consistent across platforms**, and the Python and Go SDKs disagree on Windows. Tools constructing payloads by hand or auditing snapshot JSON must use the right key per platform:

| Platform | Python wire key | Go wire key | Notes |
|---|---|---|---|
| Windows | `install_ssl_certs` (snake_case) — `webpolicy.py:834, 892` | `installCerts` (camelCase) — `web_policy.go:206` | **SDK conflict** — one of the two is wrong on the wire. Verify against a real tenant before scripting. |
| Linux | `installCerts` — `webpolicy.py:927, 943` | `installCerts` — `web_policy.go:106` | Consistent. |
| macOS | `installCerts` — `webpolicy.py:1098, 1132` | `installCerts` — `web_policy.go:120` | Consistent. Python attr is `install_certs`, not `install_ssl_certs`. |
| Android | `installCerts` — `webpolicy.py:1022, 1058` | `installCerts` — `web_policy.go:68` | Consistent. Python attr is `install_certs`. |
| iOS | **Not present** | **Not present** | iOS sub-policy has no SSL-cert-install field at all (`webpolicy.py:951–972`, `web_policy.go:95–102`). iOS uses the device profile / MDM mechanism for cert install instead. |

**Operational implication**: a tenant deploying ZCC on iOS for the first time and expecting `install_ssl_certs = true` to push certs will be surprised — the field doesn't exist on iOS. iOS cert installation is an MDM concern, not a ZCC App Profile concern.

---

## On-Net policy

The `onNetPolicy` sub-object controls what ZCC does when it detects it is on the corporate network. This is distinct from Trusted-Network evaluation in the Forwarding Profile (which controls where traffic goes per-network-type). Fields (`webpolicy.py:697–703`):

| Wire key | Python attr | Role |
|---|---|---|
| `id` | `id` | Sub-object ID. |
| `name` | `name` | Display name. |
| `conditionType` | `condition_type` | How criteria combine within this On-Net policy. **Yet another `conditionType` field** at a third level of the criteria tree — distinct from the Forwarding Profile's profile-level conditionType and from the per-TrustedNetwork conditionType. See [`./forwarding-profile.md § The profile object`](./forwarding-profile.md) and [`./trusted-networks.md § condition_type`](./trusted-networks.md). |
| `predefinedTrustedNetworks` | `predefined_trusted_networks` | List of predefined trusted networks for the On-Net check. |
| `predefinedTnAll` | `predefined_tn_all` | Shortcut: any predefined trusted network qualifies. |

**Go SDK does not expose `onNetPolicy`** — the Go `WebPolicy` struct (`web_policy.go:18–57`) lacks this sub-object entirely. Operators using the Go SDK cannot read or write On-Net policy through it. Python SDK is the only programmatic path. Confidence on the field semantics is low; lab-test before relying on this path.

When both `onNetPolicy` and Forwarding Profile trusted-network configuration are present, the order of evaluation and any override semantics are an open question.

---

## Disaster Recovery block

The `disasterRecovery` sub-object and the `enableZiaDR` / `enableZpaDR` flags enable ZCC's DR fallback. If the ZIA or ZPA cloud is fully unreachable for an extended window, ZCC switches to a DR PAC or config to keep users working.

| Mechanism | Scope | Purpose |
|---|---|---|
| Disaster Recovery (`disasterRecovery` + `enableZiaDR`/`enableZpaDR`) | App Profile level | Prolonged ZIA or ZPA outage — ZCC switches to DR PAC/config for the duration |
| Fail-open (`FailOpenPolicy`) | Tenant level | Transient tunnel/proxy unreachability — ZCC allows direct traffic temporarily |
| `allow_unreachable_pac` | App Profile level | PAC URL unreachable — allow or block traffic while PAC is down |

DR and fail-open are distinct mechanisms. DR is for multi-hour outages with an admin-provided fallback config; fail-open is for transient failures with a grace period. See [`./forwarding-profile.md`](./forwarding-profile.md) for FailOpenPolicy detail.

### Python SDK SNAKE_CASE_KEYS bug — `enable_zia_dr`

Python SDK's `SNAKE_CASE_KEYS` set lists `"enable_zia_dr"` (`webpolicy.py:79`), implying the wire key should remain snake_case. But `DisasterRecovery.request_format()` actually emits `"enableZiaDR"` (camelCase, `webpolicy.py:662`), and the Go SDK confirms `"enableZiaDR"` (`web_policy.go:79`). **The SNAKE_CASE_KEYS entry for this field is a Python SDK bug — the wire format is camelCase.** Same pattern affects `truncate_large_udpdns_response` and `purge_kerberos_preferred_dc_cache` in `PolicyExtension`: SNAKE_CASE_KEYS lists them but `request_format()` emits camelCase (`webpolicy.py:585, 587`).

### Go vs Python `disasterRecovery` field divergence

The two SDKs disagree on the field set. Fields in **Go only** (`web_policy.go:76–93`):

- `policyId` — DR config's policy ID
- `ziaPacUrl` — ZIA DR PAC URL
- `ziaSecretKeyData` / `ziaSecretKeyName` — ZIA DR secret
- `zpaSecretKeyData` / `zpaSecretKeyName` — ZPA DR secret
- `ziaDRRecoveryMethod` (int) — Go's name for the DR method field

Fields in **Python only** (`webpolicy.py:624–638`):

- `ziaCustomDbUrl` — custom database URL
- `ziaRSAPubKey` / `ziaRSAPubKeyName` — ZIA RSA public key
- `zpaRSAPubKey` / `zpaRSAPubKeyName` — ZPA RSA public key
- `ziaDRMethod` — Python's name for the DR method field (Go calls it `ziaDRRecoveryMethod`)

This is a meaningful gap — the two SDKs are managing different aspects of the DR config. Lab-test which set the API actually accepts before scripting either path.

---

## Policy Extension

`policyExtension` (`webpolicy.py:336–468`, `web_policy.go:126–189`) is a grab-bag sub-object for advanced settings. **~60 fields total** — most rarely touched in normal operation. Selected high-signal fields:

| Wire key | Role |
|---|---|
| `truncateLargeUDPDNSResponse` | Truncate large UDP DNS responses (avoids EDNS buffer overflow issues). Note: Python SNAKE_CASE_KEYS bug — listed there but actually emits camelCase. |
| `purgeKerberosPreferredDCCache` | Force ZCC to clear its cached preferred domain controller. Resolves stale KDC issues after network topology changes. Same SNAKE_CASE_KEYS bug. |
| `dropQuicTraffic` | **Drop QUIC (UDP 443) traffic at ZCC.** Forces browsers to fall back to TCP where ZIA's forward proxy can intercept. The lever for QUIC bypass scenarios — see [`./forwarding-profile.md § QUIC / HTTP3 traffic bypasses`](./forwarding-profile.md). (`webpolicy.py:417`) |
| `enableAntiTampering` / `overrideATCmdByPolicy` / `reactivateAntiTamperingTime` | Anti-tampering controls — prevent users from killing/modifying the ZCC process. (`webpolicy.py:411–415`) |
| `enforceSplitDNS` | Force split DNS handling. (`webpolicy.py:416`) |
| `enableFlowBasedTunnel` | Flow-based tunnel mode (alternative to packet-based). (`webpolicy.py:468`) |
| `zpaAuthExpOnSleep` / `zpaAuthExpOnSysRestart` / `zpaAuthExpOnNetIpChange` / `zpaAuthExpOnWinLogonSession` / `zpaAuthExpOnWinSessionLock` | Granular ZPA re-auth triggers. (`webpolicy.py:377–387`) |
| `zccFailCloseSettingsLockdownOnTunnelProcessExit` / `...OnFirewallError` / `...OnDriverError` / `zccFailCloseSettingsExitUninstallPassword` | Fail-close lockdown options when ZCC core fails. (`webpolicy.py:435–453`) Distinct from the FailOpenPolicy described in [`./forwarding-profile.md`](./forwarding-profile.md) — fail-close locks the device down on ZCC failure rather than allowing direct traffic. |
| `enableZdpService` | Enable ZDP (Zscaler Data Protection / disable-protection) service. (`webpolicy.py:418`) |
| `useDefaultAdapterForDNS` / `disableDNSRouteExclusion` / `prioritizeDnsExclusions` | DNS-handling controls. (`webpolicy.py:363–365, 402–404, 423`) |
| `useV8JsEngine` | PAC engine selection — V8 vs the legacy JS engine. (`webpolicy.py:356`) |
| `interceptZIATrafficAllAdapters` | Intercept ZIA traffic on all network adapters (vs primary only). (`webpolicy.py:408–410`) |

The QUIC drop field (`dropQuicTraffic`) is the most operationally significant of these — it's the direct toggle for the bypass scenario where Safari/Chrome QUIC traffic skips ZIA proxy inspection.

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
| ZIA URL filtering policy (ZIA cloud, not ZCC) | Near-immediate (ZIA cloud propagation ~15 min) — independent of ZCC restart |

An operator who pushes a critical forwarding or password policy change expecting it to take effect immediately on currently-connected devices will be surprised — those devices keep using the cached App Profile until their next ZCC restart/login event.

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

**A Web Policy can reference a Forwarding Profile ID that does not exist** — the relationship is FK-shaped but not enforced at write time. `_data/snapshot/zcc/web-policy.json` joined with `_data/snapshot/zcc/forwarding-profiles.json` via ID is the way to detect orphaned references.

---

## API surface

From `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py` and `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`, all methods on `client.zcc.web_policy`. **Note the wire path uses `/web/policy/` with a slash — not `/webPolicy/`.**

| Method | HTTP | Path | Source |
|---|---|---|---|
| `list_by_company(query_params={})` | GET | `/zcc/papi/public/v1/web/policy/listByCompany` | `web_policy.py:71`, `web_policy.go:226` |
| `activate_web_policy(**kwargs)` | PUT | `/zcc/papi/public/v1/web/policy/activate` | `web_policy.py:121`, `web_policy.go:262` |
| `web_policy_edit(**kwargs)` | PUT | `/zcc/papi/public/v1/web/policy/edit` | `web_policy.py:157`, `web_policy.go:283` |
| `delete_web_policy(policy_id)` | DELETE | `/zcc/papi/public/v1/web/policy/{id}/delete` | `web_policy.py:191`, `web_policy.go:300` |

Query params for `list_by_company` (`web_policy.py:39–50`): `page` (int), `page_size` (int), `device_type` (`ios` / `android` / `windows` / `macos` / `linux`), `search` (str), `search_type` (str).

### Activation scope — single policy + device_type, not bulk

`activate_web_policy` takes `device_type` (int) and `policy_id` (int) as required kwargs (`web_policy.py:103–104`); the Go equivalent passes a `*WebPolicyActivation` struct with `DeviceType int` + `PolicyId int` (`web_policy.go:219–222`). **Activation is per-policy-per-platform**, not "activate everything." A tenant making changes across multiple policies or multiple platforms must call `activate_web_policy` once per `(policy_id, device_type)` pair.

The HTTP method is `PUT`, not `POST` — earlier wording in this doc said `POST` and was wrong. Confirmed in both SDKs: Python `web_policy.py:121` and Go `web_policy.go:268`.

---

## Edge cases

- **`pac_url` is literal snake_case on the wire** (`pac_url`, not `pacUrl`). Tooling writing JSON by hand must preserve this exact key name. Three top-level fields stay snake_case in both Python and Go SDKs: `pac_url` (`webpolicy.py:105`, `web_policy.go:46`), `reauth_period` (`webpolicy.py:109`, `web_policy.go:49`), `device_type` (`webpolicy.py:95`, `web_policy.go:30`).
- **Python `SNAKE_CASE_KEYS` set has bugs.** The set at `webpolicy.py:28–80` lists fields meant to bypass camelCase conversion, but at least three entries are actively wrong: `truncate_large_udpdns_response`, `purge_kerberos_preferred_dc_cache`, and `enable_zia_dr` are listed there but `request_format()` actually emits them as camelCase. The Go SDK confirms camelCase is the wire format. Don't trust SNAKE_CASE_KEYS membership as the source of truth — check `request_format()` output and the Go struct tags.
- **`group_all = true` with non-empty `group_ids`** — the broader flag takes priority at enforcement time; `group_ids` is effectively ignored. Audit for this as misconfiguration. Same for `enable_device_groups = false` with a populated `device_group_ids` list.
- **Per-platform sub-policy of None** — means "no policy defined for this platform," not "inherit defaults." Devices on that platform fall through to the next matching Web Policy or the tenant default policy. If the tenant default policy is permissive, this can be a security gap.
- **`activate_web_policy` is required** — Web Policy changes are staged until explicitly activated, analogous to ZIA's zone activation. Uncommitted changes are not served to endpoints. A tenant reporting "I made the change but it hasn't applied" should check whether activation was performed.
- **`forwarding_profile_id` orphan reference** — a Web Policy that references a deleted Forwarding Profile ID will fail silently or fall back to a default, depending on ZCC's resolution logic. The exact fallback behavior is not documented in available sources. Audit joins regularly.
- **Rule order gap management** — like ZIA policies, Web Policy rule order should be maintained with gaps (e.g., 10, 20, 30) rather than sequential integers to allow insertion without renumbering. The portal does not enforce contiguous ordering.

---

## Cross-links

- Forwarding Profile (pointed to from Web Policy via `forwarding_profile_id`) — [`./forwarding-profile.md`](./forwarding-profile.md)
- Forwarding Profiles portal configuration and assignment — [`./forwarding-profiles.md`](./forwarding-profiles.md)
- Trusted Networks (distinct from On-Net policy) — [`./trusted-networks.md`](./trusted-networks.md)
- Web Privacy (log collection; ZDX location; separate from App Profile) — [`./web-privacy.md`](./web-privacy.md)
- ZCC API surface — [`./api.md`](./api.md)
- ZIA device posture (cross-product hook via `zia_posture_config_id`) — not yet written up
- Wire-format schema for `_data/snapshot/zcc/web-policy.json` — [`./snapshot-schema.md`](./snapshot-schema.md)
