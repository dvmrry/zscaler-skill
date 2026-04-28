---
product: zcc
topic: "zcc-entitlements"
title: "ZCC entitlements — which users/groups get ZPA and ZDX"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/zpagroupentitlements.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/zdxgroupentitlements.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/entitlements.py"
  - "vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md"
  - "vendor/zscaler-help/configuring-zscaler-client-connector-app-profiles.md"
author-status: draft
---

# ZCC entitlements — which users/groups get ZPA and ZDX

Entitlements decide, per user/group, whether ZCC enables the **ZPA** (private-app access) and **ZDX** (digital experience monitoring) services on top of its baseline ZIA functionality. Both are add-on services billed per-seat. Users who are not entitled do not get the relevant features even if the policy objects exist in the tenant.

## What entitlements control

ZCC's baseline capability is ZIA traffic forwarding — every enrolled user gets that regardless of entitlement state. Entitlements gate additional services:

| Service | Entitlement object | What it unlocks |
|---|---|---|
| ZPA (Zscaler Private Access) | `ZpaGroupEntitlements` | ZCC establishes a ZPA microtunnel for access to internal/private apps via ZPA App Connectors. Without entitlement, ZPA is simply not activated; internal apps are unreachable via ZPA. |
| ZDX (Zscaler Digital Experience) | `ZdxGroupEntitlements` | ZCC runs ZDX probes and reports endpoint metrics (app performance, network path quality, location). Without entitlement, no ZDX data is collected for this user. |

**ZIA is always on for enrolled users** — there is no "ZIA entitlement" object. A ZCC install that reaches the Zscaler cloud can always be inspected by ZIA policy.

---

## How entitlements interact with ZIA, ZPA, and ZDX forwarding

The flow from a user's ZCC to the services depends on layered checks:

```
User enrolls ZCC
    └── ZIA traffic forwarding: always active (governed by Forwarding Profile)
    └── ZPA microtunnel: active only if ZpaGroupEntitlements grants access
    └── ZDX probes: active only if ZdxGroupEntitlements grants access
              AND WebPrivacy.collect_zdx_location = true
              AND ZdxGroupEntitlements.collect_zdx_location = true
```

Entitlement is **not** the same as ZPA Access Policy. An entitled user still needs a matching ZPA Access Policy rule to reach a specific application. Entitlement is the gate to the ZPA product; ZPA policies gate access within the product. Sequence for diagnosing "user can't reach internal app":

1. Is the user's group in `ZpaGroupEntitlements.group_list`, or is `zpa_enable_for_all = true`? If not — stop here. ZPA is not active for this user.
2. Does a matching ZPA Access Policy rule exist for this user + app? If not — ZPA evaluates and denies. LSS records are generated.
3. Is the App Connector reachable, healthy, and scoped to the segment? App Connector layer.

---

## ZpaGroupEntitlements — full field reference

From `vendor/zscaler-sdk-python/zscaler/zcc/models/zpagroupentitlements.py` (Tier B — SDK/TF):

| Python field | Wire key | Type | Role |
|---|---|---|---|
| `zpa_enable_for_all` | `zpaEnableForAll` | bool | Tenant-wide "all users get ZPA" shortcut. When true, `group_list` and `device_group_list` are effectively ignored — every enrolled user gets ZPA. |
| `group_list` | `groupList` | list[str] | List of user-group IDs entitled to ZPA. Only consulted when `zpa_enable_for_all = false`. |
| `device_group_list` | `deviceGroupList` | list[str] | List of device-group IDs entitled to ZPA. Separate from user groups; allows device-centric entitlement scoping. |
| `compute_device_groups_for_zpa` | `computeDeviceGroupsForZPA` | bool | Whether device-group membership is evaluated for ZPA entitlement at all. If false, `device_group_list` is ignored even if populated. |
| `machine_tun_enabled_for_all` | `machineTunEnabledForAll` | bool | Whether Machine Tunnel (device-identity ZPA tunnel for pre-login / always-on access) is enabled for all devices. All-or-nothing toggle at this level — no per-group machine-tunnel scoping. |
| `total_count` | `totalCount` | int | Count of entitled groups (server-computed; informational only). |

### The `zpa_enable_for_all` trump card

Setting `zpa_enable_for_all = true` disables the effect of `group_list`. An operator adding specific groups to `group_list` while this flag is true is still entitling everyone — the narrow config is dormant. If the flag is later toggled back to false, the stale `group_list` becomes authoritative again and may entitle users who should not have access. Audit the full object on toggle changes.

### Machine Tunnel entitlement

Machine Tunnel — the ZPA mode where the device (not the user) establishes a tunnel, used for pre-login access to domain controllers and internal resources before the user authenticates — requires `machine_tun_enabled_for_all = true`. There is no per-group machine-tunnel entitlement at the `ZpaGroupEntitlements` level. It is an all-devices-or-none toggle here; per-device scoping is handled via Machine Groups in ZPA and the App Profile machine provisioning key. See [`./azure-vm-deployment.md`](./azure-vm-deployment.md) for the machine tunnel deployment model.

---

## ZdxGroupEntitlements — full field reference

From `vendor/zscaler-sdk-python/zscaler/zcc/models/zdxgroupentitlements.py` (Tier B — SDK/TF):

| Python field | Wire key | Type | Role |
|---|---|---|---|
| `upm_device_group_list` | `upmDeviceGroupList` | list[str] | Device groups entitled to ZDX. "UPM" = User Posture Module (the component that runs ZDX sensors on the endpoint). |
| `compute_device_groups_for_zdx` | `computeDeviceGroupsForZDX` | bool | Whether device-group membership is evaluated for ZDX entitlement. If false, `upm_device_group_list` is ignored. |
| `collect_zdx_location` | `collectZdxLocation` | bool | Tenant-level toggle: collect ZDX location / network data. **Must AND with `WebPrivacy.collect_zdx_location`** for location collection to occur. |
| `logout_zcc_for_zdx_service` | `logoutZCCForZDXService` | bool | When a user loses ZDX entitlement (e.g. group membership change), whether ZCC is forced to log them out to re-evaluate entitlements. No parallel flag exists for ZPA de-entitlement. |
| `total_count` | `totalCount` | int | Count of entitled groups (server-computed; informational). |

### No `zdx_enable_for_all` shortcut

Unlike ZPA, there is no `zdx_enable_for_all` flag. ZDX entitlement is always group-scoped via `upm_device_group_list`. An operator who wants all devices entitled to ZDX must add all device groups to the list, or add a catch-all device group.

### The ZDX location dual-toggle

`collect_zdx_location` exists on BOTH `ZdxGroupEntitlements` AND `WebPrivacy`. Both must be true for ZDX to actually gather location data. This dual-toggle is unusual in Zscaler's model; most settings are single-source-of-truth. An operator seeing no ZDX location data should check both objects:

| `WebPrivacy.collect_zdx_location` | `ZdxGroupEntitlements.collect_zdx_location` | Location data collected? |
|---|---|---|
| true | true | Yes |
| true | false | No |
| false | true | No |
| false | false | No |

See [`./web-privacy.md`](./web-privacy.md) for the WebPrivacy side.

---

## What happens when a user is not entitled

### Not entitled to ZPA

ZCC does not establish a ZPA microtunnel. ZPA Access Policy rules never evaluate for this user — the request never reaches ZPA. From the user's perspective, internal apps that require ZPA are simply unreachable (or fall through to whatever routing the forwarding profile specifies for non-ZPA destinations).

**Logging distinction:** In an entitled-but-Deny case, ZPA actively evaluates and denies, producing LSS records. In the not-entitled case, nothing evaluates — there are no LSS records from this user's ZPA surface. A user reporting "I have no ZPA access logs" may not be entitled at all.

### Not entitled to ZDX

No deep traces, no app-health metrics, no probes from this user's endpoint. The ZDX portal shows no data for this user. The ZDX-side entitlement check (`compute_device_groups_for_zdx = false` or device group not in `upm_device_group_list`) silently prevents ZDX from activating.

### Entitled but App Profile scoping is wrong

A user can be entitled to ZPA at the entitlement level but still not get ZPA forwarding if their App Profile's Forwarding Profile has ZPA actions set to `NONE` on all network types. Entitlement opens the product; the Forwarding Profile controls the traffic path. Check both layers.

---

## App Profile entitlement-related fields

The App Profile (Web Policy) interacts with entitlements in the following ways (Tier A — vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md):

- **Forwarding Profile selection** (`forwarding_profile_id` on WebPolicy) — determines whether ZPA microtunnel is active per network type. An App Profile can reference a Forwarding Profile with ZPA tunneling disabled on all network types, effectively nullifying ZPA even for entitled users.
- **Machine Provisioning Key** — the App Profile carries the machine provisioning key (from ZPA) that allows Machine Tunnel enrollment. Without the key in the App Profile, machine tunnels cannot enroll even if `machine_tun_enabled_for_all = true`.
- **ZIA service entitlement** — App Profiles reference a Forwarding Profile that controls ZIA forwarding mode. ZIA itself is always licensed at the tenant level; App Profile controls whether each user's traffic goes through ZIA inspection or bypasses it.

---

## SDK API surface

From `vendor/zscaler-sdk-python/zscaler/zcc/entitlements.py` (Tier B — SDK/TF), all methods on `client.zcc.entitlements`:

| Method | HTTP | Notes |
|---|---|---|
| `get_zpa_group_entitlements(query_params={})` | GET | Fetch the ZPA entitlement singleton. Returns one `ZpaGroupEntitlements` object. |
| `update_zpa_group_entitlement()` | PUT | Update ZPA entitlement. No kwargs in the signature — callers must build the full payload. Check SDK tests for the expected shape. |
| `get_zdx_group_entitlements(query_params={})` | GET | Fetch the ZDX entitlement singleton. Returns one `ZdxGroupEntitlements` object. |
| `update_zdx_group_entitlement()` | PUT | Update ZDX entitlement. Same pattern as ZPA. |

Both are tenant-wide singletons: get-only + single-object-no-list. There is no "create" because the objects always exist; only update applies.

---

## Diagnosing entitlement problems

A structured diagnostic sequence for common entitlement complaints:

### "ZPA isn't working for this user"

1. Check `ZpaGroupEntitlements`: is `zpa_enable_for_all = true`? If yes, the user is entitled — move to step 3.
2. Is the user's group in `group_list`? Is the device's group in `device_group_list` (with `compute_device_groups_for_zpa = true`)? If neither, the user is not entitled — add to group or enable for all.
3. Is the Forwarding Profile's ZPA action set to `NONE` on all network types? If so, ZPA tunnel is disabled at the forwarding layer even for entitled users. Fix the Forwarding Profile.
4. Does a matching ZPA Access Policy rule exist? If not, ZPA denies (LSS records generated). Fix the Access Policy.
5. Is the App Connector healthy and scoped to the application segment? App Connector layer.

### "ZDX shows no data for this user"

1. Check `ZdxGroupEntitlements`: is the user's device group in `upm_device_group_list`? Is `compute_device_groups_for_zdx = true`?
2. Check `ZdxGroupEntitlements.collect_zdx_location` — is it true?
3. Check `WebPrivacy.collect_zdx_location` — is it true? Both must be true.
4. Is the user's device running a ZCC version that includes the User Posture Module? Check `upm_version` in the Device record.

### "User was de-entitled but still has ZPA access"

ZPA de-entitlement relies on natural reconnect — there is no force-logout equivalent for ZPA. The user's active microtunnel stays up until their next ZCC login/restart. Options:
- Wait for the user to log out and back in, or restart the device.
- Ask the user to manually disconnect and reconnect ZCC.
- Remove the device record from the portal (forces re-enrollment on next connect, at which point entitlement is re-evaluated).

For ZDX, `logout_zcc_for_zdx_service = true` forces an immediate ZCC logout when ZDX entitlement is removed. This is the only force-logout mechanism in the entitlement model.

---

## Entitlements and App Profile propagation

App Profile (Web Policy) changes — including changes that affect which Forwarding Profile a user gets — propagate only on ZCC logout/restart. **Entitlement changes are not subject to this lag** — entitlement evaluation happens at the Zscaler service layer when ZCC attempts to establish a service session, not at App Profile download time. However, if an App Profile change is needed alongside an entitlement change (e.g., adding machine provisioning key while enabling `machine_tun_enabled_for_all`), the App Profile half does not take effect until next restart.

---

## Edge cases

- **`zpa_enable_for_all = true` with stale `group_list`**: The group list stays in the object but is ignored. If the admin later toggles `zpa_enable_for_all` back to false, the stale group list is suddenly authoritative again — potentially entitling users who shouldn't have access. Audit the full object on every toggle change.
- **Device-group vs user-group entitlement**: A user can be entitled via either user-group (`group_list`) or device-group (`device_group_list`). `compute_device_groups_for_zpa` must be true AND the device's group must be in `device_group_list` for device-group-based entitlement to apply. If both mechanisms exist, either alone is sufficient (OR semantics inferred from model structure).
- **Entitlement removal doesn't immediately purge device state**: A user removed from a ZPA-entitled group may retain an active microtunnel until their next ZCC check-in or restart. The `logout_zcc_for_zdx_service` flag exists specifically to force-log-out on ZDX entitlement loss; no parallel flag exists for ZPA de-entitlement, so ZPA de-entitlement relies on natural reconnect.
- **`compute_device_groups_for_zdx = false` silences the device group list**: Setting this to false while `upm_device_group_list` is populated is a common misconfiguration — the list is present but ignored. Check this flag first when ZDX entitlement appears correct in the portal but no devices are getting ZDX.
- **Machine Tunnel requires ZPA product license**: `machine_tun_enabled_for_all` is meaningless without a ZPA subscription. If ZPA is not licensed, toggling this flag has no effect.
- **No Terraform resource for ZCC entitlements**: There is no ZCC Terraform provider in the available vendor sources. Entitlement configuration is managed via the Python SDK API methods or directly through the ZCC portal. IaC pipelines must use the Python SDK or direct API calls.

---

## Cross-links

- Web Privacy (`collect_zdx_location` dual-source) — [`./web-privacy.md`](./web-privacy.md)
- Azure VM / Machine Tunnel deployment — [`./azure-vm-deployment.md`](./azure-vm-deployment.md)
- ZPA Access Policy (where entitled users still need rules to match) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- Forwarding Profile (where ZPA tunnel action is configured per network type) — [`./forwarding-profile.md`](./forwarding-profile.md)
- ZCC API surface — [`./api.md`](./api.md)
