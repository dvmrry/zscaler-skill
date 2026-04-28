---
product: zcc
topic: "zcc-web-policy"
title: "ZCC web policy — on-device policy and per-platform overrides"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py"
  - "vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md"
  - "vendor/zscaler-help/configuring-zscaler-client-connector-app-profiles.md"
author-status: draft
---

# ZCC web policy — on-device policy and per-platform overrides

The ZCC **Web Policy** object (called **App Profile** in the ZCC admin portal UI) is the on-endpoint policy that controls ZCC's own behavior — PAC URLs, which Forwarding Profile to use for ZIA/ZPA, whether ZCC installs the SSL root cert, uninstall-protection passwords, per-app bypasses, platform-specific settings, and disaster-recovery fallback behavior. It is **not** ZIA's URL filtering policy; those are different products in different places.

**Naming note**: `WebPolicy` is the SDK/API name (wire path: `/zcc/papi/public/v1/webPolicy/...`). **App Profile** is the admin-portal UI name for the same object. When an admin says "the user's App Profile" or "edit the Windows app profile rule," they mean a Web Policy entry scoped to those users/that platform. See [`clarification zcc-07`](../_clarifications.md#zcc-07-forwarding-profile-assignment-to-usersdevices).

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
| `forwarding_profile_id` | `forwardingProfileId` | int | **The assignment link.** References which Forwarding Profile this policy's users get. This is how Forwarding Profiles are assigned to users — it is a field on Web Policy, not a separate object. See [`./forwarding-profiles.md`](./forwarding-profiles.md). |
| `zia_posture_config_id` | `ziaPostureConfigId` | int | ZIA device posture config reference. Cross-product hook for posture-gated access. |

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
| `pac_url` | `pac_url` (snake_case on wire) | str | The PAC URL honored by users on this policy. **Note: this field is literal snake_case on the wire** — not `pacUrl`. Tools writing JSON by hand must preserve this case. |
| `tunnel_zapp_traffic` | `tunnelZappTraffic` | bool | Whether ZCC's own traffic goes through the Z-Tunnel (vs. direct). Typically off for most tenants — ZCC's own management traffic bypasses inspection. |
| `reauth_period` | `reauth_period` (snake_case on wire) | int | How often ZCC prompts users to re-authenticate (in hours or days — exact unit not documented in SDK). |
| `reactivate_web_security_minutes` | `reactivateWebSecurityMinutes` | int | If a user disables web security (where allowed), how long before ZCC re-enables it automatically. Pairs with `send_disable_service_reason`. |
| `send_disable_service_reason` | `sendDisableServiceReason` | bool | Whether ZCC prompts the user for a reason when disabling the service. Reason data surfaces in `download_disable_reasons()` CSV. |
| `log_level` | `logLevel` | str/int | Logging verbosity level on the endpoint. Maps to Error/Warn/Info/Debug modes. |
| `log_mode` | `logMode` | str/int | Log mode (may overlap with `log_level` — exact distinction not documented). |
| `log_file_size` | `logFileSize` | int | Maximum size of ZCC log files on the endpoint. |
| `highlight_active_control` | `highlightActiveControl` | bool | UI polish — highlight the active rule in ZCC's local admin UI. |

---

## Per-platform sub-policies

Each platform has its own sub-policy block within the Web Policy. The five platforms are: `windowsPolicy`, `macPolicy`, `linuxPolicy`, `iosPolicy`, `androidPolicy`. A null sub-policy means "no platform-specific policy defined" — not "inherit defaults." Devices on an unscoped platform fall through to the tenant's default Web Policy.

Common fields across platforms:

| Field pattern | Role |
|---|---|
| `disable_password` | Password a user must enter to disable ZCC. Empty = no password required. |
| `logout_password` | Password a user must enter to log out of ZCC. |
| `uninstall_password` | Password a user must enter to uninstall ZCC. |
| `install_ssl_certs` | Whether ZCC pushes the Zscaler root CA into the OS certificate store. **Required for SSL inspection to work without cert errors.** |

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

If `install_ssl_certs = false` on any platform sub-policy, ZCC does not push the Zscaler root CA to that platform's OS certificate store. Users on that platform will see certificate errors when ZIA performs SSL inspection on their traffic (because their OS doesn't trust the Zscaler CA). A tenant reporting "macOS users see cert errors but Windows users don't" should check the per-platform `install_ssl_certs` flags — the Windows sub-policy may have it true and the macOS sub-policy false.

---

## On-Net policy

The `onNetPolicy` sub-object controls what ZCC does when it detects it is on the corporate network. This is distinct from Trusted-Network evaluation in the Forwarding Profile (which controls where traffic goes per-network-type). The `onNetPolicy` at the Web Policy level is a simpler "on-net / off-net" behavioral toggle — its exact fields and precedence relationship with the Forwarding Profile's trusted-network evaluation are not fully documented in available sources.

When both `onNetPolicy` and Forwarding Profile trusted-network configuration are present, the order of evaluation and any override semantics are an open question. See deferred clarification.

---

## Disaster Recovery block

The `disasterRecovery` sub-object and the `enable_zia_dr` flag enable ZCC's DR fallback. If the ZIA cloud is fully unreachable for an extended window, ZCC switches to a DR PAC or config to keep users working.

| Mechanism | Scope | Purpose |
|---|---|---|
| Disaster Recovery (`disasterRecovery` + `enable_zia_dr`) | App Profile level | Prolonged ZIA outage — ZCC switches to DR PAC/config for the duration |
| Fail-open (`FailOpenPolicy`) | Tenant level | Transient tunnel/proxy unreachability — ZCC allows direct traffic temporarily |
| `allow_unreachable_pac` | App Profile level | PAC URL unreachable — allow or block traffic while PAC is down |

DR and fail-open are distinct mechanisms. DR is for multi-hour outages with an admin-provided fallback config; fail-open is for transient failures with a grace period. See [`./forwarding-profile.md`](./forwarding-profile.md) for FailOpenPolicy detail.

---

## Policy Extension

`policyExtension` is a grab-bag sub-object for advanced settings. Documented examples from SDK:

- `truncate_large_udpdns_response` — truncate large UDP DNS responses (avoids EDNS buffer overflow issues in some environments).
- `purge_kerberos_preferred_dc_cache` — force ZCC to clear its cached preferred domain controller (resolves stale KDC issues after network topology changes).

Rarely touched in normal operation. When these fields appear in snapshot JSON, record them but do not reason heavily without specific context from Zscaler Support guidance.

---

## What changes require an App Profile update vs a ZCC restart

**App Profile changes propagate only on ZCC logout/restart.** ZCC downloads updated App Profile settings only when the user logs out and back in, or restarts the computer. There is no continuous polling for App Profile changes (Tier A — vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md).

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

**A Web Policy can reference a Forwarding Profile ID that does not exist** — the relationship is FK-shaped but not enforced at write time. `snapshot/zcc/web-policy.json` joined with `snapshot/zcc/forwarding-profiles.json` via ID is the way to detect orphaned references.

---

## API surface

From `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py` (Tier B — SDK/TF), all methods on `client.zcc.web_policy`:

| Method | HTTP | Path | Notes |
|---|---|---|---|
| `list_by_company(query_params={})` | GET | `/zcc/papi/public/v1/webPolicy/listByCompany` | Paginated. Query params: `page`, `page_size`, `search`. |
| `activate_web_policy(**kwargs)` | POST | `/zcc/papi/public/v1/webPolicy/activate` | **Activation is explicit.** Policy changes do not take effect on endpoints until activated — mirroring ZIA's activation gate. Scope (single policy vs. all) needs tenant-side confirmation. |
| `web_policy_edit(**kwargs)` | PUT | `/zcc/papi/public/v1/webPolicy/edit` | Update a policy. |
| `delete_web_policy(policy_id)` | DELETE | `/zcc/papi/public/v1/webPolicy/{id}/delete` | Delete a policy. |

---

## Edge cases

- **`pac_url` is literal snake_case on the wire** (`pac_url`, not `pacUrl`). Tooling writing JSON by hand must preserve this exact key name. This is one of several fields on `WebPolicy` that stay snake_case; most are camelCase. The `WebPolicy.SNAKE_CASE_KEYS` set in the model file is the authoritative list.
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
- Wire-format schema for `snapshot/zcc/web-policy.json` — [`./snapshot-schema.md`](./snapshot-schema.md)
