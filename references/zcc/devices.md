---
product: zcc
topic: "zcc-devices"
title: "ZCC devices — inventory, lifecycle, and cleanup"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/devices.py"
  - "vendor/zscaler-help/configuring-automated-device-cleanup.md"
  - "vendor/zscaler-help/configuring-zscaler-client-connector-collect-hostnames.md"
  - "vendor/zscaler-help/configuring-zscaler-client-connector-collect-device-owner-information.md"
author-status: draft
---

# ZCC devices — inventory, lifecycle, and cleanup

The Devices API surface is ZCC's per-endpoint inventory: every device that has ever registered with the tenant, its current state, last-seen time, tunnel version, and lifecycle actions (remove, force-remove, cleanup). Useful for "is this endpoint even in our inventory?", "when did it last check in?", "can we force it off the cloud?", and for compliance audits of enrolled device populations.

---

## Device registration lifecycle

A device enters the ZCC inventory when ZCC first enrolls with the tenant. The lifecycle from that point:

```
Installation + first login
    └── Enrollment → REGISTERED / active
            └── Regular heartbeat (keepAliveTime updated)
                    └── User deregisters, admin removes, or inactivity threshold hit
                            └── DEREGISTERED / REMOVED / UNREGISTERED
                                    └── Optional permanent purge after autoPurgeDays
```

### Lifecycle states

| State | Meaning | How to get here |
|---|---|---|
| Registered (active) | ZCC is enrolled, checking in, tunnel up or recently seen | Normal healthy state after enrollment |
| Registered (stale) | ZCC is enrolled but `last_seen_time` / `keepAliveTime` is far in the past | Device offline, ZCC stopped, or machine decommissioned without admin deregistration |
| Deregistered / Removed | Admin or user initiated removal; ZCC was soft-removed from portal | `remove_devices()` call or portal removal action |
| Unregistered | Machine tunnel or enrollment is no longer connected to Zscaler services or policies | Typically: machine tunnel removed; ZCC uninstalled without portal cleanup |
| Permanently deleted | Purged from inventory entirely after `autoPurgeDays` threshold | Only after device has been in Removed/Unregistered state for the configured period |

**Important**: Removing a device record from the portal does NOT uninstall ZCC from the endpoint. If ZCC is still installed and comes online, it will re-register — creating a fresh record (new `udid`) and losing the history. To prevent re-registration, also revoke the user's entitlement or change group membership. See [`./entitlements.md`](./entitlements.md).

---

## Device object fields — `Device` model

From `vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py` (Tier B — SDK/TF):

| Python field | Wire key | Type | Role |
|---|---|---|---|
| `udid` | `udid` | str | Unique device identifier. Primary key. Stable across ZCC reinstalls on the same endpoint (fingerprint-based). Tenant-scoped — same physical device in two tenants gets two different UDIDs. |
| `user` | `user` | str | OS-level user associated with this ZCC install. |
| `owner` | `owner` | str | Owning user (may differ from logged-in user for shared devices). |
| `machine_hostname` | `machineHostname` | str | Endpoint hostname at registration. Only populated if `WebPrivacy.collect_machine_hostname = true`. |
| `mac_address` | `macAddress` | str | Primary MAC at registration. Used for correlation with NAC / inventory tools. |
| `manufacturer` | `manufacturer` | str | Hardware vendor (Apple, Dell, Lenovo, …). |
| `os_version` | `osVersion` | str | OS version string at last check-in. |
| `type` | `type` | str | Device platform. Values observed: `windows`, `macos`, `linux`, `ios`, `android` (enum not explicitly declared in SDK). |
| `zapp_arch` | `zappArch` | str | CPU architecture (x86_64, arm64, etc.). |
| `agent_version` | `agentVersion` | str | Current ZCC client version installed on the device. |
| `tunnel_version` | `tunnelVersion` | str | Active Z-Tunnel version (`1.0` or `2.0`). |
| `upm_version` | `upmVersion` | str | User Posture Module version (ZDX component). |
| `state` | `state` | str | Registration state. Observed values: `REGISTERED`, `DEREGISTERED`, `DISABLED` (enum not explicitly declared in SDK). |
| `registration_state` | `registrationState` | str | Finer-grained state tracking. Exact distinction from `state` not documented in available sources. |
| `vpn_state` | `vpnState` | str | ZCC VPN / tunnel state (likely indicates whether Z-Tunnel is up). |
| `policy_name` | `policyName` | str | Currently-applied Web Policy (App Profile) name at last config download. Informational — may be stale if policy was renamed or device hasn't checked in recently. |
| `registration_time` | `registration_time` (snake_case on wire) | str | Initial registration timestamp. |
| `deregistration_timestamp` | `deregistrationTimestamp` | str | Deregistration time (set on removal). |
| `last_seen_time` | `last_seen_time` (snake_case on wire) | str | Most recent check-in time. Key field for staleness detection. |
| `keep_alive_time` | `keepAliveTime` | str | ZCC keep-alive heartbeat timestamp. Used by automated cleanup to measure inactivity. |
| `config_download_time` | `config_download_time` (snake_case on wire) | str | When this device last pulled fresh App Profile config. |
| `download_count` | `download_count` (snake_case on wire) | int | Number of config downloads. High count = config churning repeatedly (investigate). |
| `hardware_fingerprint` | `hardwareFingerprint` | str | Stable fingerprint used to detect VM cloning / duplicate installs. |
| `company_name` | `companyName` | str | Tenant name. Constant within a tenant; useful for multi-tenant correlation only. |
| `detail` | `detail` | str | Free-form detail field (semantics vary by platform/context). |

**Mixed casing on the wire**: `registration_time`, `last_seen_time`, `config_download_time`, `download_count` are snake_case; everything else is camelCase. Tools writing raw JSON payloads must honor each field as declared in the SDK model.

---

## DeviceDetails — extended per-device fields

`get_device_details()` returns a richer `DeviceDetails` object beyond the list fields. Notable additional fields from `vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py` (Tier B — SDK/TF):

| Python field | Wire key | Role |
|---|---|---|
| `zia_enabled` | `ziaEnabled` | Whether ZIA service is active on this device. |
| `zpa_enabled` | `zpaEnabled` | Whether ZPA service is active on this device. |
| `zdx_enabled` | `zdxEnabled` | Whether ZDX service is active on this device. |
| `zia_health` / `zpa_health` / `zdx_health` | `ziaHealth` / `zpaHealth` / `zdxHealth` | Per-service health status string. |
| `zpa_last_seen_time` | `zpaLastSeenTime` | Last time ZPA service was seen active. |
| `zdx_last_seen_time` | `zdxLastSeenTime` | Last time ZDX service was seen active. |
| `serial_number` | `serialNumber` | Hardware serial number. |
| `vdi` | `vdi` | VDI flag — whether this device is a Virtual Desktop Infrastructure session. |
| `strict_enforcement` | `strictEnforcement` | Whether strict enforcement mode is active on this device. |
| `anti_tampering_status` | `antiTamperingStatus` | Anti-tamper protection state. |
| `device_trust` | `deviceTrust` | Device trust level / posture assessment result. |
| `zcc_tunnel_version` | `zccTunnelVersion` | ZCC tunnel version (may differ from `tunnelVersion` in the basic Device model). |
| `expected_zcc_version` | `expectedZCCVersion` | The ZCC version the tenant has configured for this device via App Store. |
| `zcc_upgrade_status` | `zccUpgradeStatus` | Status of any in-progress ZCC upgrade. |
| `log_fetch_info` | `logFetchInfo` | `LogFetchInfo` sub-object for remote log fetch state (see below). |

### LogFetchInfo sub-object

| Python field | Wire key | Role |
|---|---|---|
| `log_ts` | `logTs` | Timestamp when log fetch was requested. |
| `log_ack_ts` | `logAckTs` | Timestamp when the device acknowledged the log fetch request. |
| `error` | `error` | Error message if log fetch failed. |
| `log_fetch_pcap_enabled` | `logFetchPCAPEnabled` | Whether packet capture logs are included in the fetch. |
| `log_fetch_db_enabled` | `logFetchDBEnabled` | Whether database logs are included in the fetch. |
| `log_fetch_from_no_of_days` | `logFetchFromNoOfDays` | How many days of logs to fetch. |

Remote log fetch (via the portal's "Fetch Logs" action on Device Details) requires `Client Connector App Logs` to be enabled on the App Supportability tab. See [`./web-privacy.md`](./web-privacy.md).

---

## Hostname and device owner collection

The vendor sources for these two settings (configuring-zscaler-client-connector-collect-hostnames.md and configuring-zscaler-client-connector-collect-device-owner-information.md) failed to capture due to SPA routing issues. Based on SDK model fields and cross-references:

**Hostname collection** is controlled by `WebPrivacy.collect_machine_hostname`. When true, ZCC reports the endpoint's machine hostname to the cloud; the `machineHostname` field in Device records is populated. When false, hostnames are redacted — Device records show blank or placeholder hostnames, and ZIA/ZPA logs lack endpoint hostname context.

Privacy implications: machine hostnames can reveal device naming conventions (asset tags, usernames embedded in hostnames) that some organizations consider sensitive. A tenant that embeds employee names in hostnames (e.g., `john-smith-mbp`) may choose to disable hostname collection.

**Device owner information** corresponds to `WebPrivacy.collect_user_info`. When true, the OS-level logged-in username is reported to the cloud and appears in ZIA/ZPA logs. When false, logs show device-level identity (UDID) without the OS username. The `owner` field in Device records reflects this — it may be blank when user info collection is disabled.

See [`./web-privacy.md`](./web-privacy.md) for the full field-level reference on both settings.

---

## Automated device cleanup

Configuration navigation: ZCC Portal > Administration > Client Connector Support > Device Cleanup tab (Tier A — vendor/zscaler-help/configuring-automated-device-cleanup.md).

### SDK model — `SetDeviceCleanupInfo` / `DeviceCleanup`

From `vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py` (Tier B — SDK/TF):

| Python field | Wire key | Type | Role |
|---|---|---|---|
| `active` | `active` | bool | Whether automated cleanup is enabled. |
| `auto_removal_days` | `autoRemovalDays` | int | Days of ZIA inactivity (no keepAlive heartbeat) after which a device is automatically force-removed. Portal options: 30, 60, 90, 120, 150, 180 days, or Never (0 / null). A device becomes inactive when `keepAliveTime` is older than this threshold. Default: Never. |
| `auto_purge_days` | `autoPurgeDays` | int | Days in Removed or Unregistered state after which the device record is permanently deleted. Portal options: 60, 90, 120, 150, 180 days. Uses `deregistrationTimestamp` (last deregistration time) to measure duration. |
| `device_exceed_limit` | `deviceExceedLimit` | int | Threshold: maximum number of devices a single user can enroll. If a user tries to enroll beyond this limit, the oldest device is force-removed. Portal range: 1–16. Default: Restrict (no removal; error shown when user exceeds 16 devices). Contact Zscaler Support to set minimum to 1. |
| `force_remove_type` | `forceRemoveType` | int | Integer enum indicating which type of force-remove to apply on threshold breach. |
| `force_remove_type_string` | `forceRemoveTypeString` | str | String representation of the above for display. |
| `company_id` | `companyId` | int | Tenant ID (server-set). |
| `created_by` / `edited_by` | `createdBy` / `editedBy` | str | Admin audit fields. |
| `id` | `id` | int | Record ID. |

### Cleanup behavior

**Inactivity-based removal** (`auto_removal_days`): The portal explicitly states that a device becomes inactive when the most recent KeepAlive Timestamp is older than the defined period. This is the `keepAliveTime` field on the Device record. After `auto_removal_days` of no keepAlive contact, ZCC force-removes the device from the portal. The device does not receive a notification; the removal is automatic (Tier A — vendor/zscaler-help/configuring-automated-device-cleanup.md).

**Permanent purge** (`auto_purge_days`): After a device has been in Removed or Unregistered state for `auto_purge_days`, the record is permanently deleted. Uses `deregistrationTimestamp`. Once purged, there is no recovery of the historical record.

**Per-user device limit** (`device_exceed_limit`): When a user attempts to enroll beyond the threshold, the oldest device by registration time is force-removed. Minimum threshold can be 1 (contact Zscaler Support to set); maximum is 16 (Tier A — vendor/zscaler-help/configuring-automated-device-cleanup.md).

**Portal update lag**: After modifying cleanup settings, it can take up to a week for Enrolled Devices to reflect changes. Do not expect immediate effect (Tier A — vendor/zscaler-help/configuring-automated-device-cleanup.md).

**Cleanup affects inventory only**: Automated cleanup removes device records from the ZCC portal. It does not uninstall ZCC from the endpoint. If the machine comes back online with ZCC still installed, it will re-register — creating a new record (new `udid`).

---

## Removing devices

Three related operations in the SDK:

### `remove_devices` — standard deregistration

Marks the device as deregistered; retains the record in the portal (in Removed state). The device retains its history; it can be permanently purged later via `autoPurgeDays`. Accepts filters (likely `udid` or user-identifying fields) to scope which devices are affected.

Use case: clean deregistration of a device that is being decommissioned but where audit history should be retained.

### `force_remove_devices` — aggressive cleanup

Aggressive removal. Used when standard remove doesn't work — typically when a device has cloned fingerprints, stuck state, or conflicting registration. The `ForceRemoveDevices` request body shape:

| Python field | Wire key | Type | Role |
|---|---|---|---|
| `udids` | `udids` | list[str] | Specific device UDIDs to force-remove. |
| `username` | `username` | str | Remove all devices for this username. |
| `os_type` | `osType` | str | Filter by OS type (combined with username). |
| `client_connector_version` | `clientConnectorVersion` | list[str] | Filter by ZCC version (combined with username). |
| `devices_removed` | `devicesRemoved` | int | Response field: count of devices removed. |
| `error_msg` | `errorMsg` | str | Response field: error message if any. |

### `remove_machine_tunnel` — machine-tunnel-only removal

Removes the machine-tunnel component from a device record, leaving the user tunnel and ZCC install otherwise intact. Used to clean up stale or conflicting machine tunnel registrations without full device deregistration.

---

## CSV downloads

Three bulk-export methods exist for ad-hoc reporting and offline analysis:

| Method | What it exports | Key filters |
|---|---|---|
| `download_devices(query_params, filename)` | Full inventory as CSV | `os_types` (`ios`/`android`/`windows`/`macos`/`linux`); registration state; last-seen window filters |
| `download_service_status(query_params, filename)` | Per-device status of ZCC services (tunnel state, web security state, etc.) | Same OS type filters |
| `download_disable_reasons(query_params, filename)` | When users disable ZCC (where allowed), the reasons they provided | Pairs with `WebPolicy.send_disable_service_reason` |

The `zcc_param_mapper` decorator on `download_devices` translates Python-friendly filter kwargs into the portal's expected query-string keys. Tools writing HTTP directly need to check `vendor/zscaler-sdk-python/zscaler/utils.py` for the `zcc_param_map` mapping.

---

## Full API surface

From `vendor/zscaler-sdk-python/zscaler/zcc/devices.py` (Tier B — SDK/TF), all methods on `client.zcc.devices`:

| Method | Notes |
|---|---|
| `list_devices(query_params={})` | Paginated JSON device list. Preferred over CSV for structured tooling. |
| `download_devices(query_params, filename)` | CSV dump with OS type and state filters. |
| `download_service_status(query_params, filename)` | CSV of ZCC service state per device. |
| `download_disable_reasons(query_params, filename)` | CSV of user-provided ZCC disable reasons. |
| `get_device_cleanup_info()` | Retrieve current automated cleanup settings (`DeviceCleanup`). |
| `update_device_cleanup_info(**kwargs)` | Update cleanup settings (`SetDeviceCleanupInfo`). |
| `get_device_details(query_params)` | Detailed per-device view (`DeviceDetails`). |
| `remove_devices(query_params, **kwargs)` | Standard deregistration (soft remove). |
| `force_remove_devices(query_params, **kwargs)` | Aggressive cleanup (`ForceRemoveDevices` body). |
| `remove_machine_tunnel(query_params, **kwargs)` | Machine-tunnel-only removal. |

---

## Edge cases

- **Duplicate `udid` across tenants does not exist** — `udid` is tenant-scoped. A device that moves from one tenant to another (M&A) gets a new `udid` in the destination tenant.
- **`last_seen_time` lags** — the exact heartbeat cadence (`keepAliveTime` interval) is not in the SDK. Treat `last_seen_time` as "within a few minutes of check-in" rather than live. For staleness detection, use `keepAliveTime` compared to the `autoRemovalDays` threshold.
- **`hardware_fingerprint` collisions indicate cloning** — sibling VMs that inherited an OS image before ZCC re-fingerprinting will report the same hardware ID. Both devices interfere with each other's policy and tunnel state until forcibly re-enrolled via `force_remove_devices` on the older duplicate.
- **`removed devices re-register immediately`** — `remove_devices` is not a lockout mechanism. If ZCC is still installed and the endpoint comes online, it re-registers. To prevent re-registration, also revoke the user's entitlement (see [`./entitlements.md`](./entitlements.md)) or change group membership.
- **`policy_name` is informational, not authoritative** — it reports the policy name at the device's last config download. If policies were renamed since, or the device hasn't checked in, this field may be stale. Use the policy's ID in `forwarding_profile_id` for authoritative joins.
- **`device_exceed_limit` default is 16-max / no auto-removal** — the default setting allows up to 16 devices but does not auto-remove. An organization that wants to enforce single-device-per-user must contact Zscaler Support to set the minimum to 1 and then enable force-removal on exceed.
- **`autoPurgeDays` purge is irreversible** — permanently deleted device records cannot be recovered. The purge window should be long enough for audit purposes. Set conservatively (180 days) for regulated environments.

---

## Cross-links

- Web Privacy (hostname and user info collection controls) — [`./web-privacy.md`](./web-privacy.md)
- Entitlements (which services this device's user is entitled to; prevent re-registration) — [`./entitlements.md`](./entitlements.md)
- Web Policy (which App Profile this device has; `policy_name` field) — [`./web-policy.md`](./web-policy.md)
- Forwarding Profile (what this device does with traffic) — [`./forwarding-profile.md`](./forwarding-profile.md)
- Azure VM deployment (machine tunnel device records) — [`./azure-vm-deployment.md`](./azure-vm-deployment.md)
- ZCC API surface — [`./api.md`](./api.md)
