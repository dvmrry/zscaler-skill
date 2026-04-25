---
product: zcc
topic: "zcc-devices"
title: "ZCC devices — inventory, lifecycle, and cleanup"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/devices.py"
author-status: draft
---

# ZCC devices — inventory, lifecycle, and cleanup

The Devices API surface is ZCC's per-endpoint inventory: every device that has ever registered with the tenant, its current state, last-seen time, tunnel version, and lifecycle actions (remove, force-remove, cleanup). Useful for answering "is this endpoint even in our inventory?" / "when did it last check in?" / "can we force it off the cloud?".

## Summary

A **Device** object represents a single ZCC install on a specific endpoint (identified by `udid`, plus machine hostname and user). Devices are created on first registration and stay in the inventory indefinitely unless an admin removes them — including after ZCC is uninstalled from the endpoint.

Two distinct "remove" operations exist:

- **Remove** (`remove_devices`) — normal deregistration; the endpoint is marked deregistered but retained for historical reference.
- **Force remove** (`force_remove_devices`) — aggressive cleanup; used when a machine has been decommissioned or cloned and its fingerprint is conflicting with another install.

Plus **Device Cleanup** settings (`get_device_cleanup_info` / `update_device_cleanup_info`) that control automatic periodic removal of devices that haven't checked in for N days.

## Mechanics

### Device fields

From `zscaler/zcc/models/devices.py`, a `Device` object carries:

| Field | Wire key | Role |
|---|---|---|
| `udid` | `udid` | Unique device identifier. Stable across ZCC reinstalls on the same endpoint. The primary key. |
| `user` | `user` | OS-level user associated with this ZCC install. |
| `owner` | `owner` | Owning user (may differ from logged-in user for shared devices). |
| `machine_hostname` | `machineHostname` | Endpoint hostname at registration. |
| `mac_address` | `macAddress` | Primary MAC at registration — used for correlation with NAC / inventory tools. |
| `manufacturer` | `manufacturer` | Hardware vendor (Apple, Dell, Lenovo, …). |
| `os_version` | `osVersion` | OS version string. |
| `type` | `type` | Device type (likely one of `windows` / `macos` / `linux` / `ios` / `android` — enum not explicitly declared in SDK). |
| `zapp_arch` | `zappArch` | CPU architecture (x86_64, arm64, etc.). |
| `agent_version` | `agentVersion` | Current ZCC client version on the device. |
| `tunnel_version` | `tunnelVersion` | Active Z-Tunnel version (likely `1.0` or `2.0`). |
| `upm_version` | `upmVersion` | User Posture Module version. |
| `state` | `state` | Registration state — likely one of `REGISTERED` / `DEREGISTERED` / `DISABLED` (enum not explicitly declared). |
| `registration_state` | `registrationState` | Finer-grained state tracking (possible distinction from `state` not documented). |
| `vpn_state` | `vpnState` | ZCC VPN state (likely indicates whether the Z-Tunnel is up). |
| `policy_name` | `policyName` | Currently-applied Web Policy name. Useful for "which policy is this user getting?" answers. |
| `registration_time` | `registration_time` (snake_case on wire) | Initial registration timestamp. |
| `deregistration_timestamp` | `deregistrationTimestamp` | Deregistration time (set on `remove`). |
| `last_seen_time` | `last_seen_time` | Most recent check-in time. |
| `keep_alive_time` | `keepAliveTime` | ZCC keep-alive heartbeat timestamp. |
| `config_download_time` | `config_download_time` | When this device last pulled fresh config. |
| `download_count` | `download_count` | Number of config downloads — high = churn (config regenerating repeatedly). |
| `hardware_fingerprint` | `hardwareFingerprint` | Stable fingerprint used to detect VM cloning / duplicate installs. |
| `company_name` | `companyName` | Tenant name (always the same value in a snapshot; useful only for multi-tenant correlation). |
| `detail` | `detail` | Free-form detail field (semantics vary). |

Mixed casing on the wire: `registration_time`, `last_seen_time`, `config_download_time`, `download_count` are snake_case; everything else is camelCase. Tooling must honor each field as-declared in the SDK model.

### Device states worth recognizing

Without a published enum, inferred states (to be confirmed against real tenant snapshot):

- **Registered and active** — `state` / `registration_state` indicate active; `last_seen_time` is recent; `vpn_state` indicates tunnel up.
- **Registered but stale** — `last_seen_time` far in the past. ZCC-bearing endpoint hasn't checked in; may be decommissioned, may be offline, may have had ZCC stopped.
- **Deregistered** — `deregistration_timestamp` is set. ZCC was removed or admin-deregistered.
- **Duplicate fingerprint** — two `Device` records with the same `hardware_fingerprint` but different `udid`s. VM-cloning pattern; both devices interfere with each other's policy / tunnel state. Use `force_remove_devices` on the older duplicate.

### Device cleanup (automated)

`get_device_cleanup_info` returns a `DeviceCleanup` object controlling auto-removal of stale devices. `update_device_cleanup_info` sets it. The specific fields (retention-days threshold, enabled/disabled, scope by OS type) are in the `DeviceCleanup` sub-model — read the SDK for field names; they're relatively self-documenting.

**Operational note:** cleanup affects inventory only. It does not uninstall ZCC from the endpoint. If a user's machine has been offline for 90 days and cleanup removes the record, the machine will re-register on next boot — creating a fresh record (new `udid`) and losing the history.

### Removing devices

Three related operations:

- **`remove_devices(query_params, **kwargs)`** — standard removal. Accepts filters (likely `udid` or user-identifying fields) to scope which devices are affected. Marks deregistered; retains the record.
- **`force_remove_devices(query_params, **kwargs)`** — aggressive removal. Used when standard remove doesn't work, typically when a device has cloned fingerprints or stuck state. The `ForceRemoveDevices` sub-model is the request body shape.
- **`remove_machine_tunnel(query_params, **kwargs)`** — remove the machine-tunnel component only (leaving the user tunnel / ZCC install otherwise intact). Scoped removal for the Machine Tunnel feature.

### CSV downloads

Three "download-as-CSV" methods exist for ad-hoc reporting:

- **`download_devices(query_params, filename)`** — full inventory as CSV. Accepts filters: `os_types` (`ios`/`android`/`windows`/`macos`/`linux`), plus likely registration state / last-seen-window filters.
- **`download_service_status(query_params, filename)`** — per-device status of ZCC services (tunnel state, web security state, etc.) as CSV.
- **`download_disable_reasons(query_params, filename)`** — when users disable ZCC (where allowed), the reasons they provide. Correlates with Web Policy `send_disable_service_reason`.

These CSV endpoints are useful for point-in-time snapshots into spreadsheets; the JSON `list_devices` endpoint is what snapshot tooling should prefer for structured data.

## API surface

From `zscaler/zcc/devices.py`, all under `client.zcc.devices`:

- `list_devices(query_params={...})` — paginated JSON device list.
- `download_devices(query_params, filename)` — CSV dump with filters.
- `download_service_status(query_params, filename)` — CSV of service state.
- `download_disable_reasons(query_params, filename)` — CSV of disable reasons.
- `get_device_cleanup_info()` / `update_device_cleanup_info(**kwargs)` — auto-cleanup settings.
- `get_device_details(query_params)` — detailed per-device view.
- `remove_devices(query_params, **kwargs)` — standard deregistration.
- `force_remove_devices(query_params, **kwargs)` — aggressive cleanup.
- `remove_machine_tunnel(query_params, **kwargs)` — machine-tunnel-only removal.

The `zcc_param_mapper` decorator on `download_devices` translates Python-friendly filter kwargs into the portal's expected query-string keys. Callers writing HTTP directly need to know the mapping (check `vendor/zscaler-sdk-python/zscaler/utils.py` for `zcc_param_map`).

## Edge cases

- **Duplicate `udid` across tenants does not exist** — `udid` is tenant-scoped. If a user moves from one tenant to another (e.g. M&A), the same physical device gets a new `udid`.
- **`last_seen_time` lags.** The exact heartbeat cadence (`keep_alive_time` interval) is not in the SDK. Treat `last_seen_time` as "within a few minutes of check-in" rather than live.
- **`hardware_fingerprint` collisions indicate cloning.** Sibling VMs that inherited an OS image before ZCC re-fingerprint will report the same hardware ID until forcibly re-enrolled. The MCP `troubleshoot-connector` skill references this pattern at the App Connector layer; same class of issue on ZCC-managed user endpoints.
- **Removed devices can re-register immediately** if ZCC is still installed and the endpoint comes online — meaning `remove_devices` isn't a lockout mechanism. To prevent re-registration, also revoke the user's entitlement (see [`./entitlements.md`](./entitlements.md)) or change the user's group membership.
- **`policy_name` is informational, not authoritative.** It reports the policy name at the device's last config download. If policies have since been renamed or the device hasn't checked in, this field may be stale.

## Cross-links

- Web Policy assignment (which policy this device has) — [`./web-policy.md`](./web-policy.md)
- Forwarding Profile (what this device does with traffic, via the Web Policy's `forwarding_profile_id`) — [`./forwarding-profile.md`](./forwarding-profile.md)
- Entitlements (which services this user is entitled to) — [`./entitlements.md`](./entitlements.md)
- ZCC API / wire format — [`./api.md`](./api.md)
