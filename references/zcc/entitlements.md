---
product: zcc
topic: "zcc-entitlements"
title: "ZCC entitlements — which users/groups get ZPA and ZDX"
content-type: reference
last-verified: "2026-05-01"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/zpagroupentitlements.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/zdxgroupentitlements.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/entitlements.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/entitlements/entitlements.go"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go"
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

From `vendor/zscaler-sdk-python/zscaler/zcc/models/zpagroupentitlements.py` (lines 25–71) and `vendor/zscaler-sdk-go/zscaler/zcc/services/entitlements/entitlements.go` (lines 40–47).

**Note**: The Python model file carries an `# AUTO-GENERATED! DO NOT EDIT FILE DIRECTLY` marker at line 18 — direct edits to that file will be overwritten on regeneration.

| Wire key | Python attr | Go field | Type | Role |
|---|---|---|---|---|
| `zpaEnableForAll` | `zpa_enable_for_all` | `ZpaEnableForAll` | int (Go) / untyped (Python) | Tenant-wide "all users get ZPA" shortcut. When true (1), `group_list` and `device_group_list` are effectively ignored. (`zpagroupentitlements.py:51`, `entitlements.go:46`) |
| `groupList` | `group_list` | `GroupList` | `List[str]` (Python) / `[]GroupListItem` struct (Go) | List of user groups entitled to ZPA. Only consulted when `zpa_enable_for_all = false`. **Material SDK divergence — see [§ Python list types throw away structure](#python-list-types-throw-away-structure).** (`zpagroupentitlements.py:46`, `entitlements.go:43`) |
| `deviceGroupList` | `device_group_list` | `DeviceGroupList` | `List[str]` (Python) / `[]DeviceGroupItem` struct (Go) | List of device groups entitled to ZPA. Same SDK divergence as `groupList`. (`zpagroupentitlements.py:43–45`, `entitlements.go:42`) |
| `computeDeviceGroupsForZPA` | `compute_device_groups_for_zpa` | `ComputeDeviceGroupsForZPA` | int (Go) / untyped (Python) | Whether device-group membership is evaluated for ZPA entitlement. If false, `device_group_list` is ignored even if populated. (`zpagroupentitlements.py:40–42`, `entitlements.go:41`) |
| `machineTunEnabledForAll` | `machine_tun_enabled_for_all` | `MachineTunEnabledForAll` | int (Go) / untyped (Python) | Whether Machine Tunnel (device-identity ZPA tunnel for pre-login / always-on access) is enabled for all devices. All-or-nothing toggle at this level — no per-group machine-tunnel scoping. (`zpagroupentitlements.py:47–49`, `entitlements.go:44`) |
| `totalCount` | `total_count` | `TotalCount` | int | Count of entitled groups (server-computed; informational only). (`zpagroupentitlements.py:50`, `entitlements.go:45`) |

### The `zpa_enable_for_all` trump card

Setting `zpa_enable_for_all = true` disables the effect of `group_list`. An operator adding specific groups to `group_list` while this flag is true is still entitling everyone — the narrow config is dormant. If the flag is later toggled back to false, the stale `group_list` becomes authoritative again and may entitle users who should not have access. Audit the full object on toggle changes.

### Machine Tunnel entitlement

Machine Tunnel — the ZPA mode where the device (not the user) establishes a tunnel, used for pre-login access to domain controllers and internal resources before the user authenticates — requires `machine_tun_enabled_for_all = true`. There is no per-group machine-tunnel entitlement at the `ZpaGroupEntitlements` level. It is an all-devices-or-none toggle here; per-device scoping is handled via Machine Groups in ZPA and the App Profile machine provisioning key. See [`./azure-vm-deployment.md`](./azure-vm-deployment.md) for the machine tunnel deployment model.

---

## ZdxGroupEntitlements — full field reference

From `vendor/zscaler-sdk-python/zscaler/zcc/models/zdxgroupentitlements.py` (lines 23–70) and `vendor/zscaler-sdk-go/zscaler/zcc/services/entitlements/entitlements.go` (lines 22–30).

| Wire key | Python attr | Go field | Type | Role |
|---|---|---|---|---|
| `upmEnableForAll` | `upm_enable_for_all` | `UpmEnableForAll` | int (Go) / untyped (Python) | **Tenant-wide "all users get ZDX" shortcut.** When true (1), `upm_group_list` and `upm_device_group_list` are effectively ignored — every enrolled user gets ZDX. Parallel to ZPA's `zpa_enable_for_all`. (`zdxgroupentitlements.py:47`, `entitlements.go:28`) |
| `upmGroupList` | `upm_group_list` | `UpmGroupList` | `List[str]` (Python) / `[]DeviceGroup` struct (Go) | List of **user groups** entitled to ZDX. Distinct from `upmDeviceGroupList` (device groups). Only consulted when `upm_enable_for_all = false`. (`zdxgroupentitlements.py:48`, `entitlements.go:29`) |
| `upmDeviceGroupList` | `upm_device_group_list` | `UpmDeviceGroupList` | `List[str]` (Python) / `[]DeviceGroup` struct (Go) | List of **device groups** entitled to ZDX. "UPM" = User Posture Module (the component that runs ZDX sensors on the endpoint). (`zdxgroupentitlements.py:44–46`, `entitlements.go:27`) |
| `computeDeviceGroupsForZDX` | `compute_device_groups_for_zdx` | `ComputeDeviceGroupsForZDX` | int (Go) / untyped (Python) | Whether device-group membership is evaluated for ZDX entitlement. If false, `upm_device_group_list` is ignored. (`zdxgroupentitlements.py:39–41`, `entitlements.go:24`) |
| `collectZdxLocation` | `collect_zdx_location` | `CollectZdxLocation` | int (Go) / untyped (Python) | Tenant-level toggle: collect ZDX location / network data. **Must AND with `WebPrivacy.collect_zdx_location`** for location collection to occur. (`zdxgroupentitlements.py:38`, `entitlements.go:23`) |
| `logoutZCCForZDXService` | `logout_zcc_for_zdx_service` | `LogoutZCCForZDXService` | int (Go) / untyped (Python) | When a user loses ZDX entitlement (e.g. group membership change), whether ZCC is forced to log them out to re-evaluate entitlements. No parallel flag exists for ZPA de-entitlement. (`zdxgroupentitlements.py:42`, `entitlements.go:25`) |
| `totalCount` | `total_count` | `TotalCount` | int | Count of entitled groups (server-computed; informational). (`zdxgroupentitlements.py:43`, `entitlements.go:26`) |

### `upm_enable_for_all` is the ZDX equivalent of `zpa_enable_for_all`

Earlier versions of this doc said "no zdx_enable_for_all shortcut" — that was wrong. The field exists, just with a different name: `upmEnableForAll` (`zdxgroupentitlements.py:47`, `entitlements.go:28`). Same semantics as ZPA's `zpa_enable_for_all` — when true, `upm_group_list` and `upm_device_group_list` are ignored and ZDX is enabled tenant-wide.

The naming follows the "UPM" prefix convention: UPM = User Posture Module (the ZDX endpoint component). All three of `upmEnableForAll`, `upmGroupList`, and `upmDeviceGroupList` use this prefix; the older docs referred to ZDX entitlement only via the device-group path and missed the user-group + all-users variants.

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

All methods on `client.zcc.entitlements`. **Endpoint URL paths and the singleton-vs-list shape differ from earlier doc claims** — this section was previously wrong on multiple counts.

| Method | HTTP | Full path | Source |
|---|---|---|---|
| `get_zpa_group_entitlements(query_params={})` | GET | `/zcc/papi/public/v1/getZpaGroupEntitlements` | `entitlements.py:132–136`, `entitlements.go:18` |
| `update_zpa_group_entitlement()` | PUT | `/zcc/papi/public/v1/updateZpaGroupEntitlement` | `entitlements.py:170–174`, `entitlements.go:19, 122` |
| `get_zdx_group_entitlements(query_params={})` | GET | `/zcc/papi/public/v1/getZdxGroupEntitlements` | `entitlements.py:53–57`, `entitlements.go:16` |
| `update_zdx_group_entitlement()` | PUT | `/zcc/papi/public/v1/updateZdxGroupEntitlement` | `entitlements.py:91–95`, `entitlements.go:17, 84` |

**Wire path quirk**: unlike most ZCC endpoints (which use `/zcc/papi/public/v1/<resource>/<action>` form), entitlements endpoints embed the verb in the URL itself (`getZpa...` / `updateZpa...`). The Go SDK declares them as endpoint constants (`entitlements.go:15–20`).

### These are paginated GETs, not singletons

Earlier doc claim "tenant-wide singletons: get-only + single-object-no-list" was **wrong**. The reality:

- **GET endpoints are paginated lists.** Both Python (`entitlements.py:75, 154` — iterates `response.get_results()`) and Go (`entitlements.go:69, 109` — uses `common.ReadAllPages[T]`) treat the response as a paginated collection. Default page size 50, max 5000 (`vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go:13–14`). Query params: `page`, `page_size`, `search`, `search_type`.
- **The PUT endpoints return a single object** — that's where the singleton shape applies, not GET.

Operationally: a tenant with many entitled groups will see multiple pages on GET; tooling that takes the first response without paginating will see truncated data.

### Python update methods take no payload

The Python SDK `update_zpa_group_entitlement()` and `update_zdx_group_entitlement()` methods take **no parameters** in their signatures (`entitlements.py:160, 81`) and send a hardcoded empty body `{}` (`entitlements.py:177, 98`). Calling them does not actually push entitlement changes — it issues a PUT with an empty body to the API. Whether the API silently no-ops or errors on empty PUTs is unverified.

The Go SDK requires the full struct as a parameter, with nil-guards (`entitlements.go:73–75, 113–115`):

```go
UpdateZpaGroupEntitlements(ctx, service, updateZpaGroup *ZpaGroupEntitlements) (*ZpaGroupEntitlements, error)
```

**For programmatic entitlement updates, use the Go SDK or direct HTTP calls.** The Python SDK update path is broken until it gains a `**kwargs` or `payload` parameter.

### Python list types throw away structure

The biggest divergence between Python and Go SDKs: the group-list fields (`group_list`, `device_group_list`, `upm_device_group_list`, `upm_group_list`) are typed as `List[str]` in Python but as full structs in Go.

**Go's struct shape** for ZPA group entries (`entitlements.go:49–63`):

```go
type DeviceGroupItem struct {
    Active     int    `json:"active"`
    AuthType   string `json:"authType"`
    GroupID    int    `json:"groupId"`
    GroupName  string `json:"groupName"`
    ZpaEnabled int    `json:"zpaEnabled"`
}
```

For ZDX (`entitlements.go:32–38`), the same shape but the last field is `UpmEnabled` instead of `ZpaEnabled`.

The Python SDK reads these as plain strings, **discarding `active`, `authType`, `groupId`, `groupName`, and `zpaEnabled`/`upmEnabled` fields**. A Python caller cannot tell, from the SDK return value alone, whether a group is currently active, what its authType is, or whether ZPA is actually enabled within that group entry. Use the Go SDK or direct API calls if these fields matter.

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

1. Check `ZdxGroupEntitlements`: is `upm_enable_for_all = true`? If yes, the user is entitled — move to step 3.
2. Is the user's group in `upm_group_list` OR the user's device group in `upm_device_group_list` (with `compute_device_groups_for_zdx = true`)? If neither, the user is not entitled.
3. Check `ZdxGroupEntitlements.collect_zdx_location` — is it true?
4. Check `WebPrivacy.collect_zdx_location` — is it true? Both must be true (the dual-toggle).
5. Is the user's device running a ZCC version that includes the User Posture Module? Check `upm_version` in the Device record.

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
- **No Terraform resource for ZCC entitlements**: There is no ZCC Terraform provider in the available vendor sources. Entitlement configuration is managed via the Go SDK, direct HTTP calls, or the ZCC portal. **The Python SDK's update methods take no payload** (see [§ Python update methods take no payload](#python-update-methods-take-no-payload)) — IaC pipelines should use Go SDK or direct API calls for writes, not Python SDK.
- **Python SDK group-list fields are stringly-typed**: When reading ZPA or ZDX entitlements via Python, group entries are bare strings — no per-group `active`, `authType`, `groupId`, or `*Enabled` flags. The Go SDK exposes these. A Python-only audit of "are entitled groups currently active" cannot be done from the SDK return values alone — it requires direct API access to read the structured response.
- **`upmEnableForAll` was missing from earlier docs**: The previous version of this doc claimed there was no `zdx_enable_for_all` shortcut. There is — it's just named `upmEnableForAll` (UPM = User Posture Module). Same for `upmGroupList` (user-group entitlement, distinct from device-group). Both were documented as absent and are present in both SDKs.

---

## Cross-links

- Web Privacy (`collect_zdx_location` dual-source) — [`./web-privacy.md`](./web-privacy.md)
- Azure VM / Machine Tunnel deployment — [`./azure-vm-deployment.md`](./azure-vm-deployment.md)
- ZPA Access Policy (where entitled users still need rules to match) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- Forwarding Profile (where ZPA tunnel action is configured per network type) — [`./forwarding-profile.md`](./forwarding-profile.md)
- ZCC API surface — [`./api.md`](./api.md)
