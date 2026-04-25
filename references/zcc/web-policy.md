---
product: zcc
topic: "zcc-web-policy"
title: "ZCC web policy — on-device policy and per-platform overrides"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py"
  - "https://help.zscaler.com/zscaler-client-connector/about-zscaler-client-connector-app-profiles"
  - "vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md"
author-status: draft
---

# ZCC web policy — on-device policy and per-platform overrides

The ZCC **Web Policy** object (called **App Profile** in the ZCC admin portal UI) is the on-endpoint policy that controls ZCC's own behavior — PAC URLs, which Forwarding Profile to use for ZIA/ZPA, whether ZCC installs the SSL root cert, uninstall-protection passwords, per-app bypasses, platform-specific settings, and disaster-recovery fallback behavior. It is **not** ZIA's URL filtering policy; those are different products living in different places. An operator asking "why is the user prompted for a password when uninstalling ZCC" or "why is ZCC using a specific PAC URL" or "which forwarding profile is this user getting?" lands here.

**Naming note**: `WebPolicy` is the SDK / API name (wire path: `/zcc/papi/public/v1/webPolicy/...`). **App Profile** is the admin-portal UI name for the same object. When an admin says "the user's App Profile" or "edit the Windows app profile rule," they mean a Web Policy entry scoped to those users/that platform. See [`clarification zcc-07`](../_clarifications.md#zcc-07-forwarding-profile-assignment-to-users-devices).

## Summary

A Web Policy applies to a set of users/groups/device-groups and carries:

1. **Top-level ZCC behavior** — PAC URL, forwarding-profile reference, ZIA-DR toggle, reactivation/reauth periods, log settings.
2. **Per-platform sub-policies** — `windowsPolicy`, `macPolicy`, `linuxPolicy`, `iosPolicy`, `androidPolicy`. Each carries OS-specific knobs (uninstall/logout/disable passwords, SSL cert install, MMS/SMS bypasses on Android, allowed-apps list, etc.).
3. **On-Net policy** (`onNetPolicy`) — behavior when ZCC detects it's on the corporate network.
4. **Disaster Recovery block** (`disasterRecovery`) — fallback PAC / config when ZIA cloud is unreachable for extended outages. `enable_zia_dr` is the master toggle.
5. **Policy Extension** (`policyExtension`) — misc advanced settings (e.g. `truncate_large_udpdns_response`, `purge_kerberos_preferred_dc_cache`).

Multiple web policies can exist per tenant, scoped by `group_ids` / `user_ids` / `device_group_ids`. They evaluate by `rule_order` (top-level field), first-match-wins — same pattern as ZIA/ZPA policies.

## Mechanics

### Scope and evaluation

From `zscaler/zcc/models/webpolicy.py`:

- **`rule_order`** (`ruleOrder`) — per-policy order value; policies evaluate top-down. First-match-wins.
- **`active`** — whether the policy is live.
- **`description`** — free-form text.
- **Scope fields**:
  - `user_ids` / `user_names` — specific users
  - `group_ids` / `group_names` — groups
  - `device_group_ids` / `device_group_names` — device groups
  - `users` / `groups` — nested full objects (Users / Groups sub-models)
  - `group_all` — applies to all groups (shortcut)
  - `enable_device_groups` — whether device-group scoping is in force
  - `bypass_app_ids` / `bypass_custom_app_ids` / `app_identity_names` / `app_service_ids` / `app_service_names` — exception lists that remove traffic from ZCC's scope (e.g. for specific apps that should bypass ZCC)
- **`forwarding_profile_id`** — the Forwarding Profile this Web Policy's users get. **This is the assignment link** for which profile each user/device uses; it ties Web Policy scope → Forwarding Profile. Partially answers [`clarification zcc-07`](../_clarifications.md#zcc-07-forwarding-profile-assignment-mechanism) — the assignment is NOT a separate App Profile object; it's a field on Web Policy.
- **`zia_posture_config_id`** — ZIA device-posture config reference. Cross-product hook for posture-gated access.

### Top-level ZCC behavior knobs

| Field | Wire key | Role |
|---|---|---|
| `allow_unreachable_pac` | `allowUnreachablePac` | Whether ZCC allows traffic if the configured PAC URL is unreachable. Pairs with DR config. |
| `pac_url` | `pac_url` (snake_case on wire) | The PAC URL users on this policy honor. |
| `tunnel_zapp_traffic` | `tunnelZappTraffic` | Whether ZCC's own traffic goes through the Z-Tunnel (vs. direct — typically off for most tenants). |
| `reauth_period` | `reauth_period` | How often ZCC prompts users to re-authenticate. |
| `reactivate_web_security_minutes` | `reactivateWebSecurityMinutes` | If a user disables web security (where allowed), how long before ZCC re-enables it automatically. Pairs with `send_disable_service_reason`. |
| `send_disable_service_reason` | `sendDisableServiceReason` | Whether ZCC prompts / telemeters the reason when a user disables it. |
| `log_level` / `log_mode` / `log_file_size` | | Logging verbosity and rotation on the endpoint. |
| `highlight_active_control` | `highlightActiveControl` | UI polish — highlight the active rule in ZCC's local admin UI. |

### Per-platform sub-policies

Each platform (`windowsPolicy`, `macPolicy`, `linuxPolicy`, `iosPolicy`, `androidPolicy`) has its own sub-model. Fields vary but common patterns:

- **`disable_password` / `logout_password` / `uninstall_password`** — gate password for the respective end-user action. Blocks users from removing or disabling ZCC without admin support.
- **`install_ssl_certs`** — whether ZCC pushes the Zscaler root CA into the OS certificate store automatically. Required for SSL inspection to work without cert errors.
- **Platform-specific:**
  - **Android** — `allowed_apps`, `bypass_android_apps`, `bypass_mms_apps`, `enforced`, `quota_in_roaming`, `limit`, `billing_day`, `wifi_ssid`, `custom_text`
  - **iOS** — overlaps with Android for mobile-specific fields
  - **Windows / macOS / Linux** — mostly the password-based controls

The `WebPolicy.SNAKE_CASE_KEYS` set (top of the model file) is the authoritative list of fields that stay snake_case on the wire — uniquely among ZCC models, `WebPolicy` mixes casing.

### On-Net policy

`onNetPolicy` sub-object controls what happens when ZCC detects it's on the corporate network. Separate from Trusted-Network evaluation on the Forwarding Profile (which lives on `forwardingProfileActions`); this is a simpler "on-net / off-net" toggle at the Web Policy level. When both are configured, order of evaluation is not documented — possible [future clarification].

### Disaster Recovery

`disasterRecovery` sub-object + the `enable_zia_dr` flag enable ZCC's DR fallback — if the ZIA cloud is fully unreachable for an extended window, ZCC switches to a DR PAC / config to keep users working. Distinct from fail-open (`FailOpenPolicy`), which handles transient unreachability. DR is for prolonged outages.

### Policy Extension

A grab-bag of advanced settings including `truncate_large_udpdns_response` (DNS UDP truncation) and `purge_kerberos_preferred_dc_cache` (Kerberos cache management). Rarely touched; when they appear in snapshot JSON, cite them but don't reason heavily.

## API surface

From `zscaler/zcc/web_policy.py`, all methods hang off `client.zcc.web_policy`:

- `list_by_company(query_params={...})` — `GET /zcc/papi/public/v1/webPolicy/listByCompany`. Paginated; query params `page`, `page_size`, `search`.
- `activate_web_policy(**kwargs)` — **Activation is explicit.** Changes to web policies don't take effect on endpoints until activated — mirroring ZIA's activation gate. The exact scope (which policy, or all) needs tenant-side confirmation.
- `web_policy_edit(**kwargs)` — update a policy.
- `delete_web_policy(policy_id)` — delete a policy.

## Edge cases

- **The PAC URL field is literal snake_case on the wire** (`pac_url`, not `pacUrl`). Tooling writing JSON by hand must preserve case.
- **A web policy can reference a forwarding profile ID that doesn't exist** — the relationship is FK-shaped but not enforced at write time. `snapshot/zcc/web-policy.json` paired with `snapshot/zcc/forwarding-profiles.json` via an ID join is the way to detect orphaned references.
- **`group_all = true` with non-empty `group_ids`** — the broader flag takes priority at ZCC enforcement time (the narrow list is effectively ignored). Audit for this as misconfiguration.
- **Per-platform sub-policy of None** — means "no policy defined for this platform", not "inherit defaults." Devices on an unscoped platform get the tenant's default Web Policy, which may not be what the admin intends.
- **`install_ssl_certs = false` on any platform** — breaks SSL inspection for that platform (users see cert errors on decrypted traffic). A tenant reporting "macOS users see cert errors but Windows users don't" should check the per-platform `install_ssl_certs` flags first.

## Open questions

- On-Net policy vs Trusted-Network-at-Forwarding-Profile precedence — not documented.
- `activate_web_policy` scope (single policy vs full web-policy set) — needs lab or tenant check.

## Cross-links

- Forwarding Profile (pointed-to from Web Policy via `forwarding_profile_id`) — [`./forwarding-profile.md`](./forwarding-profile.md)
- Trusted Networks (distinct from On-Net policy) — [`./trusted-networks.md`](./trusted-networks.md)
- ZCC API / wire format — [`./api.md`](./api.md)
- ZIA device posture (cross-product hook via `zia_posture_config_id`) — not yet written up; tenant-specific
