---
product: zcc
topic: "zcc-devices"
title: "ZCC devices — inventory, lifecycle, and cleanup"
content-type: reference
last-verified: "2026-05-01"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/devices.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/devices/devices.go"
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
| `type` | `type` | **int (Go) / untyped (Python)** | Device platform. Wire-format ambiguous — Go SDK declares `int` on the list endpoint (`devices.go:42`) but `string` on the detail endpoint (`devices.go:82`); Python untyped (`models/devices.py:52`). Caller-side strings (`windows`, `macos`, `linux`, `ios`, `android`) are translated to integer codes via `zcc_param_map["os"]` before sending — see [§ Mobile filtering and OS-type integer encoding](#mobile-filtering-and-os-type-integer-encoding). |
| `zapp_arch` | `zappArch` | str | CPU architecture (x86_64, arm64, etc.). |
| `agent_version` | `agentVersion` | str | Current ZCC client version installed on the device. |
| `tunnel_version` | `tunnelVersion` | str | Active Z-Tunnel version (`1.0` or `2.0`). |
| `upm_version` | `upmVersion` | str | User Posture Module version (ZDX component). |
| `state` | `state` | **int (Go list) / string (Go detail) / untyped (Python)** | Registration state. **Go SDK is internally inconsistent**: `GetDevices` (list endpoint) declares `int` (`devices.go:40`); `DeviceDetails` (detail endpoint) declares `string` (`devices.go:80`). Same wire field, two different declared types in the same SDK. Python is untyped (`models/devices.py:50`). Observed values from operator reports: `REGISTERED`, `DEREGISTERED`, `DISABLED` — but if the wire actually returns ints, the Go list-endpoint type wins. **Confidence: low** until tenant verification. |
| `registration_state` | `registrationState` | str | Finer-grained state tracking. Exact distinction from `state` not documented in available sources. |
| `vpn_state` | `vpnState` | int (Go) / untyped (Python) | ZCC VPN / tunnel state. Integer code on the wire (`devices.go:46`); enum values undocumented in either SDK. Present on `Device`/`GetDevices` (list) **only** — does NOT appear on `DeviceDetails` (detail) in either SDK. |
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

`get_device_details()` returns a richer `DeviceDetails` object beyond the list fields. **Major Python/Go SDK divergence**: Python `DeviceDetails` (`models/devices.py:283–499`) carries ~50 fields; Go `DeviceDetails` (`devices.go:61–88`) carries only ~25. Most of the service-state and posture fields are Python-only.

### Fields present in both Python and Go DeviceDetails

| Wire key | Role | Python line | Go line |
|---|---|---|---|
| `agentVersion` / `agent_version` | ZCC agent version on device | 299 | 62 |
| `carrier` | Cellular carrier name (mobile-relevant) | 300 | 63 |
| `config_download_time` | Last config download timestamp | 301 | 64 |
| `deregistration_time` | Deregistration timestamp | 302 | 66 |
| `devicePolicyName` | Currently-applied App Profile name | 303 | 67 |
| `device_locale` / `deviceLocale` | Device locale string (mobile-relevant) | 304 | 65 |
| `download_count` | Config download count | 305 | 68 |
| `external_model` / `externalModel` | Externally-visible model identifier | 306 | 69 |
| `hardwareFingerprint` | Stable HW fingerprint | 307 | 70 |
| `keep_alive_time` / `keepAliveTime` | Keepalive heartbeat timestamp | 308 | 71 |
| `last_seen_time` / `lastSeenTime` | Most recent check-in | 309 | 72 |
| `mac_address` / `macAddress` | Primary MAC | 310 | 73 |
| `machineHostname` | Endpoint hostname (gated by `WebPrivacy.collect_machine_hostname`) | 311 | 74 |
| `manufacturer` | Hardware vendor | 312 | 75 |
| `os_version` / `osVersion` | OS version string | 313 | 76 |
| `owner` | Owning user (gated by `WebPrivacy.collect_user_info`) | 314 | 77 |
| `registration_time` / `registrationTime` | Initial registration | 315 | 78 |
| `rooted` | Jailbreak/root detection (mobile-relevant); Go `int`, Python untyped | 316 | 79 |
| `state` | Registration state — **Go declares `string` here but `int` on list endpoint** | 317 | 80 |
| `tunnel_version` / `tunnelVersion` | Active Z-Tunnel version | 318 | 81 |
| `type` | Device platform — **same Go list-vs-detail type inconsistency** | 319 | 82 |
| `unique_id` / `uniqueId` | Alternate stable ID | 320 | 83 |
| `upm_version` / `upmVersion` | UPM (User Posture Module) version | 321 | 84 |
| `user_name` / `userName` | OS-level username | 322 | 85 |
| `zad_version` / `zadVersion` | ZAD version (Zscaler App Daemon) | 323 | 86 |
| `zapp_arch` / `zappArch` | CPU architecture | 324 | 87 |

Note: Python `DeviceDetails.__init__` uses **dual-key lookup** (snake_case OR camelCase) for these fields (`models/devices.py:299–324`) — defensive read against the API returning either form.

### Fields Python-only — absent from Go DeviceDetails

These ~25 fields exist in the Python model and are read from API responses, but the Go SDK doesn't expose them. A Go-only consumer cannot see service health, ZIA/ZPA/ZDX state, posture trust, VDI flag, anti-tamper status, expected ZCC version, or log fetch state from the GetDeviceDetails call.

| Wire key | Role | Python line |
|---|---|---|
| `id` | Device record ID | 327 |
| `internal_model` | Internal model identifier | 328 |
| `serialNumber` | Hardware serial | 330 |
| `ziaEnabled` / `zpaEnabled` / `zdxEnabled` / `zdEnabled` / `zdpEnabled` | Per-service enabled flags | 331–335 |
| `ziaHealth` / `zpaHealth` / `zdxHealth` / `zdHealth` / `zdpHealth` | Per-service health strings | 336–340 |
| `zpaLastSeenTime` / `zdxLastSeenTime` / `zdLastSeenTime` / `zdpLastSeenTime` | Per-service last-seen | 341–344 |
| `zccLoggedInUserType` | User type for shared/MDM-managed devices (mobile-relevant) | 345 |
| `externalDeviceId` | External device ID | 346 |
| `zccForceRevert` | Force-revert flag | 347 |
| `antiTamperingStatus` | Anti-tamper protection state | 348 |
| `deviceTrust` | Device trust level / posture assessment | 349 |
| `zccTunnelVersion` | ZCC tunnel version (may differ from list `tunnelVersion`) | 350 |
| `vdi` | VDI flag (Virtual Desktop Infrastructure) | 351 |
| `strictEnforcement` | Strict enforcement mode active | 352 |
| `expectedZCCVersion` / `expectedZCCVersionTimestamp` | Configured target ZCC version + when set | 353–356 |
| `zccUpgradeStatus` | ZCC upgrade progress state | 357 |
| `deviceOtpArray` | Device OTP array (`ZscalerCollection` of str) | 359–361 |
| `logFetchInfo` | `LogFetchInfo` sub-object — Python-only nested struct | 363–371 |

For posture/health/upgrade audits, **the Python SDK or direct API calls are the only path** — Go won't surface these fields even if the API returns them.

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

**Vendor source captures failed**: both `configuring-zscaler-client-connector-collect-hostnames.md` and `configuring-zscaler-client-connector-collect-device-owner-information.md` are SPA-routed in the help portal and the captures redirected away before content was extracted. The captured files contain only stub messages noting the redirect target (line 8 of each). Confidence on this section is therefore **medium** — based on SDK field semantics and cross-references rather than authoritative help-article text. Re-capture or fetch live for definitive content.

Based on SDK model fields and cross-references:

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

All methods on `client.zcc.devices` from Python SDK (`vendor/zscaler-sdk-python/zscaler/zcc/devices.py`) and Go SDK (`vendor/zscaler-sdk-go/zscaler/zcc/services/devices/devices.go`).

| Method | HTTP | Full path | Python | Go |
|---|---|---|---|---|
| `list_devices` / `GetAll` | GET | `/zcc/papi/public/v1/getDevices` | `devices.py:335–339` | `devices.go:90–96` |
| `get_device_details` / `GetDeviceDetails` | GET | `/zcc/papi/public/v1/getDeviceDetails` | `devices.py:483–487` | `devices.go:121–145` |
| `get_device_cleanup_info` / `GetDeviceCleanupInfo` | GET | `/zcc/papi/public/v1/getDeviceCleanupInfo` | `devices.py:382–386` | `devices.go:98–119` |
| `update_device_cleanup_info` / `SetDeviceCleanupInfo` | PUT | `/zcc/papi/public/v1/setDeviceCleanupInfo` | `devices.py:431–435` | `devices.go:147–158` |
| `download_devices` | GET | `/zcc/papi/public/v1/downloadDevices` | `devices.py:96–97` | **Not in Go SDK** |
| `download_service_status` | GET | `/zcc/papi/public/v1/downloadServiceStatus` | `devices.py:177–178` | **Not in Go SDK** |
| `download_disable_reasons` | GET | `/zcc/papi/public/v1/downloadDisableReasons` | `devices.py:265–266` | **Not in Go SDK** |
| `remove_devices` | POST | `/zcc/papi/public/v1/removeDevices` | `devices.py:545–549` | **Not in Go SDK** |
| `force_remove_devices` | POST | `/zcc/papi/public/v1/forceRemoveDevices` | `devices.py:609–613` | **Not in Go SDK** |
| `remove_machine_tunnel` | POST | `/zcc/papi/public/v1/removeMachineTunnel` | `devices.py:665–669` | **Not in Go SDK** |

**SDK divergence**: 6 of 10 endpoints are Python-SDK-only. The Go SDK exposes only the four read endpoints plus the cleanup-info update. **Bulk CSV exports, deregistration, force-removal, and machine-tunnel removal are not callable from the Go SDK** — Go consumers need to drop to direct HTTP for these.

### Pagination divergence

| Endpoint | Python default page size | Python max | Go behavior |
|---|---|---|---|
| `list_devices` / `getDevices` | 50 (`devices.py:308–310`) | 5000 | Hardcoded `pageSize=1000` (`devices.go:96`); auto-paginates via `common.ReadAllPages`; **caller cannot control page size** |
| `remove_devices`, `force_remove_devices` | 30 (`devices.py:519, 584`) | 5000 | N/A (Python-only) |

A Go caller that needs a different page size has no SDK lever — must use direct HTTP.

### Mobile filtering and OS-type integer encoding

Both `os_type` (singular, `list_devices`) and `os_types` (plural list, the download endpoints) accept human-readable strings: `ios`, `android`, `windows`, `macos`, `linux`. **The Python SDK translates these to integer codes via `zcc_param_map["os"]`** (`devices.py:81–84, 163–166`) before sending — the actual wire values are integers. The mapping table lives in `zscaler/utils.py` (not vendored at the field-level here).

The `@zcc_param_mapper` decorator is applied to: `download_devices`, `download_service_status`, `download_disable_reasons`, `list_devices`, `remove_devices`, `force_remove_devices`. It is **not** applied to `get_device_cleanup_info`, `update_device_cleanup_info`, `get_device_details`, or `remove_machine_tunnel` — the latter uses `convert_keys_to_camel_case` instead (`devices.py:671–672`) because its params are structural key-renames rather than enum-value translations.

Direct HTTP callers must send the integer codes, not the strings. Tools writing JSON without going through the Python SDK will fail with the human-readable strings.

### Registration type filter — six values, not three

`download_devices` accepts `registration_types` (list) with six valid values per `devices.py:50–52`:

- `all`
- `registered`
- `unregistered`
- `removal_pending`
- `removed`
- `quarantined`

These are also integer-encoded via `zcc_param_map["reg_type"]` (`devices.py:88–94, 169–175`). Earlier doc text mentioning only registered/unregistered/removed missed `removal_pending` and `quarantined` — both of which are operationally important (transitional removal-in-progress and quarantine-by-policy states).

### Date params on `download_disable_reasons`

`download_disable_reasons` accepts `start_date` and `end_date` in multiple formats (`devices.py:211–217`): `YYYY-MM-DD`, `YYYY-MM-DD HH:MM:SS`, or `YYYY-MM-DDTHH:MM:SS`. A `time_zone` query param accepts IANA tz strings (`America/New_York`, `UTC`, `Europe/London`, etc.) and is sent as a `Time-Zone` HTTP header rather than a query string parameter (`devices.py:271`). Tools constructing the request directly must remember the header — putting `Time-Zone` in the query string will be ignored.

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

## Mobile-specific fields

iOS and Android devices surface fields that desktop devices don't. These appear on `DeviceDetails` (the detail endpoint), not on the basic device list.

| Field | Wire key | Where | Role |
|---|---|---|---|
| `carrier` | `carrier` | DeviceDetails (both SDKs, `devices.py:300`, `devices.go:63`) | Cellular carrier name. Empty on desktop devices. |
| `device_locale` | `device_locale` / `deviceLocale` (dual-key Python) | DeviceDetails (both SDKs, `devices.py:304`, `devices.go:65`) | Device locale string. |
| `rooted` | `rooted` | DeviceDetails (both SDKs, `devices.py:316`, `devices.go:79`) | Jailbreak / root detection state. Go types as `int`, Python untyped. |
| `zad_version` | `zadVersion` | DeviceDetails (both SDKs, `devices.py:323`, `devices.go:86`) | ZAD version (Zscaler App Daemon — relevant on Android). |
| `zcc_logged_in_user_type` | `zccLoggedInUserType` | DeviceDetails (**Python only**, `devices.py:345`) | Distinguishes user types for shared / MDM-managed devices. Operationally relevant on enterprise mobile fleets where one device may have multiple user contexts. Go SDK can't read this. |
| `zia_health` / `zpa_health` / `zdx_health` | `ziaHealth` / `zpaHealth` / `zdxHealth` | DeviceDetails (**Python only**) | Per-service health on mobile. Go SDK can't read these. |

**Cross-link to App Profile platform sub-policies**: device-level inventory fields here are read-only views of the device's state. The control plane for what ZCC actually does on iOS / Android / Windows / macOS / Linux lives in the App Profile's per-platform sub-policies — `iosPolicy` / `androidPolicy` / `macPolicy` / `windowsPolicy` / `linuxPolicy`. Notable mobile-specific App Profile fields documented in [`./web-policy.md`](./web-policy.md):

- **iOS**: `passcode`, `ipv6Mode`, `showVPNTunNotification`. **No SSL cert install field** — iOS cert install is MDM-managed, not ZCC App Profile-managed.
- **Android**: `allowedApps`, `bypassAndroidApps`, `bypassMmsApps` (avoid breaking MMS/SMS), `enforced` (whether ZCC can be disabled), `quotaRoaming`, `billingDay`, `wifissid`, `customText`, `installCerts` (camelCase wire key).

### Mobile filtering against the Devices API

Filter the list to mobile-only via the `os_type` / `os_types` query params on `list_devices` and the download endpoints — `ios`, `android` are translated to integer codes via `zcc_param_map["os"]` per [§ Mobile filtering and OS-type integer encoding](#mobile-filtering-and-os-type-integer-encoding) above.

A common audit shape: "show me all jailbroken iOS devices that are entitled to ZPA" — combines `os_type=ios` filter on `list_devices` + `rooted` field on each device's `DeviceDetails` + ZPA entitlement check from [`./entitlements.md`](./entitlements.md). All three pieces are needed; the Devices API alone won't tell you entitlement state.

---

## Cross-links

- Web Privacy (hostname and user info collection controls; `collect_machine_hostname` and `collect_user_info` gate the matching device fields) — [`./web-privacy.md`](./web-privacy.md)
- Entitlements (which services this device's user is entitled to; prevent re-registration) — [`./entitlements.md`](./entitlements.md)
- Web Policy / App Profile (per-platform sub-policies including iOS/Android-specific fields; `policy_name` field on Device record reflects which one is currently downloaded) — [`./web-policy.md`](./web-policy.md)
- Forwarding Profile (what this device does with traffic; the device's active profile is selected via the App Profile's `forwarding_profile_id`) — [`./forwarding-profile.md`](./forwarding-profile.md)
- Azure VM deployment (machine tunnel device records show up in the same Devices inventory) — [`./azure-vm-deployment.md`](./azure-vm-deployment.md)
- ZCC API surface — [`./api.md`](./api.md)
