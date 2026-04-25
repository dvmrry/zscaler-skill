---
product: zcc
topic: "zcc-entitlements"
title: "ZCC entitlements — which users/groups get ZPA and ZDX"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/zpagroupentitlements.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/zdxgroupentitlements.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/entitlements.py"
author-status: draft
---

# ZCC entitlements — which users get ZPA and ZDX service

Entitlements decide, per user/group, whether ZCC enables the **ZPA** (private-app access) and **ZDX** (digital experience) services on top of its baseline ZIA functionality. Both are add-on services billed per-seat; users not entitled do not get the relevant features even if the policy objects exist in the tenant.

## Summary

Two distinct entitlement objects, one each for ZPA and ZDX:

- **`ZpaGroupEntitlements`** — controls which groups / device-groups get ZPA. Plus a tenant-wide "enable for everyone" fast-path (`zpa_enable_for_all`).
- **`ZdxGroupEntitlements`** — parallel structure for ZDX. Plus a ZDX-specific `logout_zcc_for_zdx_service` toggle for forced-logout behavior.

Both are **per-tenant singletons** — get / update only, no list. A tenant has exactly one of each.

If a user's group is not in the entitled list (and the `*_enable_for_all` flag is false), ZCC simply does not activate that service for them — regardless of what's configured in the ZPA access policies or ZDX probes.

## Mechanics

### ZpaGroupEntitlements

From `zscaler/zcc/models/zpagroupentitlements.py`:

| Field | Wire key | Role |
|---|---|---|
| `zpa_enable_for_all` | `zpaEnableForAll` | Tenant-wide "everyone gets ZPA" shortcut. When true, group lists are effectively ignored. |
| `group_list` | `groupList` | List of group IDs entitled to ZPA (strings). |
| `device_group_list` | `deviceGroupList` | List of device-group IDs entitled to ZPA. Distinct from user groups — device-group-scoped entitlement. |
| `compute_device_groups_for_zpa` | `computeDeviceGroupsForZPA` | Whether device-group membership is evaluated for ZPA entitlement at all. If false, `device_group_list` is ignored. |
| `machine_tun_enabled_for_all` | `machineTunEnabledForAll` | Whether Machine Tunnel (device-identity ZPA tunnel, distinct from user tunnel) is enabled for all devices. |
| `total_count` | `totalCount` | Count of entitled groups (server-set; informational). |

**The `enable_for_all` flag is the trump card.** Setting it true disables the effect of `group_list`. An operator adding specific groups to `group_list` while `zpa_enable_for_all = true` is still entitling everyone — the narrow config is dormant. Audit for this.

**Machine Tunnel is separately gated.** Machine Tunnel — the ZPA variant where the device (not the user) has a tunnel, used for pre-login / always-on access — requires `machine_tun_enabled_for_all`. Group-level machine-tunnel gating is not surfaced in this model; it's an all-or-nothing toggle at this level.

### ZdxGroupEntitlements

From `zscaler/zcc/models/zdxgroupentitlements.py`:

| Field | Wire key | Role |
|---|---|---|
| `upm_device_group_list` | `upmDeviceGroupList` | Device groups entitled to ZDX (User Posture Module naming convention — `upm` = UPM / posture). |
| `compute_device_groups_for_zdx` | `computeDeviceGroupsForZDX` | Whether device-group membership is evaluated for ZDX entitlement. If false, the list is ignored. |
| `collect_zdx_location` | `collectZdxLocation` | Tenant-level "collect ZDX location data" toggle. **Must AND with `WebPrivacy.collect_zdx_location`** for ZDX to actually gather location data — see [`./web-privacy.md`](./web-privacy.md). |
| `logout_zcc_for_zdx_service` | `logoutZCCForZDXService` | When a user loses ZDX entitlement (e.g. group membership change), whether ZCC is forced to log them out to re-evaluate entitlements. |
| `total_count` | `totalCount` | Count of entitled groups (server-set). |

A **ZDX-only** field: `collect_zdx_location`. Present here AND on `WebPrivacy`. Both must be true for location collection to occur. An operator who enables ZDX location via Web Privacy and sees no data should check the entitlement-side flag too — and vice versa. This dual-toggle pattern is not common in Zscaler; most settings are single-source-of-truth.

Note: there is no `zdx_enable_for_all` parallel to `zpa_enable_for_all`. ZDX entitlement is always group-scoped; there's no tenant-wide shortcut at the model level.

### What happens when a user is not entitled

- **Not entitled to ZPA**: ZCC does not establish the ZPA microtunnel. ZPA access-policy rules never evaluate for this user — the request never reaches ZPA. From the user's perspective, internal apps that require ZPA are simply unreachable (or fall through to whatever routing the forwarding profile specifies for non-ZPA paths).
- **Not entitled to ZDX**: no deeptraces, no app-health metrics, no probes from this user's endpoint. The ZDX portal shows no data for this user.

This is distinct from being entitled but having a Deny policy — in an entitled-but-Deny case, ZPA actively evaluates and denies, producing LSS records. In the not-entitled case, nothing evaluates; there's nothing in logs from this user's ZPA/ZDX surface.

## API surface

From `zscaler/zcc/entitlements.py`, all under `client.zcc.entitlements`:

- `get_zpa_group_entitlements(query_params={...})` — fetch the ZPA entitlement singleton.
- `update_zpa_group_entitlement()` — update it. **No kwargs in the signature** — body shape likely derived from whatever is passed in, so callers need to build the full payload (check SDK tests for shape if writing programmatically).
- `get_zdx_group_entitlements(query_params={...})` — fetch ZDX singleton.
- `update_zdx_group_entitlement()` — update it.

Get-only + single-object-no-list confirms these are tenant-wide config, not list-scoped objects.

## Edge cases

- **`enable_for_all = true` plus stale `group_list`** — the group list stays in the object but is ignored. If the admin later toggles `enable_for_all` back to false, the stale group list is suddenly authoritative again — potentially entitling users who shouldn't have access. Audit the full object on toggle changes.
- **Device-group entitlement vs user-group entitlement** — a user can be entitled via either. `compute_device_groups_for_zpa` must be true AND the device's group must be in `device_group_list` for device-group-based entitlement to apply. Same pattern for ZDX.
- **Entitlement removal doesn't immediately purge device state.** A user removed from a ZPA-entitled group may retain an active microtunnel until their next check-in or ZCC restart. The `logout_zcc_for_zdx_service` flag exists specifically to force-log-out on ZDX entitlement loss; no parallel flag exists for ZPA, so ZPA de-entitlement relies on natural reconnect.
- **Entitlement does not equal access policy success.** Entitled users still need a matching ZPA Access Policy rule to actually access apps. Entitlement is the gate *to* the product; ZPA policies gate access *within* the product. A user reporting "I can't reach any ZPA apps" needs both checked — entitlement first (cheaper to verify), then policy.

## Cross-links

- Web Privacy (`collect_zdx_location` dual-source) — [`./web-privacy.md`](./web-privacy.md)
- ZPA access policy (where entitled users still need rules to match) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- ZCC API / wire format — [`./api.md`](./api.md)
