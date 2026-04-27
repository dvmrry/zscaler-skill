---
product: zcc
topic: zcc-sdk
title: "ZCC SDK reference — Python and Go service catalog"
content-type: reference
last-verified: "2026-04-26"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/"
author-status: draft
---

# ZCC SDK reference

## Overview

The ZCC SDK wraps the Zscaler Client Connector portal API (`/zcc/papi/public/v1`). It covers device enrollment management, policy configuration, secrets, and administrative tasks for the Client Connector agent fleet.

### Client construction — Python

ZCC has two coexisting Python client paths.

**Modern path (OneAPI / ZIdentity auth):**

```python
from zscaler import ZscalerClient

client = ZscalerClient(
    client_id="...",
    client_secret="...",
    vanity_domain="acme",
    cloud="zscloud",
)
# ZCC services are accessed via client.zcc.*
devices = client.zcc.devices.list_devices()
```

The `ZCCService` class (`zscaler/zcc/zcc_service.py`) is instantiated inside `ZscalerClient` and delegates to a shared `RequestExecutor`.

**Legacy path (ZCC portal token):**

`LegacyZCCClientHelper` (`zscaler/zcc/legacy.py`) handles tenants that have not migrated to OneAPI. It authenticates directly against:

```
POST https://api-mobile.<cloud>.net/papi/auth/v1/login
{ "apiKey": "<key>", "secretKey": "<secret>" }
```

The response `jwtToken` is attached as an `auth-token` header on every subsequent request. The helper refreshes the token automatically when it expires.

Rate limits enforced by `LegacyZCCClientHelper`:
- 100 calls per hour per IP address (enforced client-side and by server 429).
- `/downloadDevices` and `/downloadServiceStatus`: 3 calls per day. The client raises `ValueError` immediately for these endpoints on 429; it does not retry.
- Other endpoints: up to 3 retries on 429, backing off via the `X-Rate-Limit-Retry-After-Seconds` response header (default 60 s).

### Client construction — Go

```go
config, err := zscaler.NewConfiguration(
    zscaler.WithClientID("..."),
    zscaler.WithClientSecret("..."),
    zscaler.WithVanityDomain("acme"),
    zscaler.WithCloud("zscloud"),
)
service, err := zscaler.NewOneAPIClient(config)
// Pass service to individual package-level functions:
devices, err := devices.GetAll(ctx, service, nil)
```

Go ZCC services are package-level functions, not methods on a struct. The `NewZccRequestDo` transport method is used — callers must close `resp.Body` and decode manually.

### Authentication specifics

ZCC requires ZCC-scoped API credentials. When using OneAPI, the token request must include the `zcc.*` scope granted to the API client in ZIdentity. The legacy `LegacyZCCClientHelper` uses the ZCC-specific portal login, which is separate from ZIA/ZPA/ZDX authentication. The `x-partner-id` header is sent on every request when `partner_id` is configured.

### Pagination — Python

List endpoints accept `page` (1-indexed) and `page_size` (default 50, max 5000) as `query_params` keys. The `@zcc_param_mapper` decorator translates snake_case OS and registration type names to their numeric API equivalents before the request is sent.

The raw `response` object returned from every call supports client-side JMESPath filtering via `resp.search(expression)`.

### Pagination — Go

`common.ReadAllPages[T]` in `zscaler/zcc/services/common/common.go` iterates pages automatically (default 50, max 5000) and stops when `len(pageResults) < pageSize`. JMESPath filtering is applied after aggregation via `zscaler.ApplyJMESPathFromContext`.

### Return convention — Python

Every method returns a three-tuple `(result, response, error)`. Callers should check `error` before using `result`.

### Parameter mapping (`@zcc_param_mapper`)

The `zcc_param_mapper` decorator translates human-readable OS type strings (`"windows"`, `"macos"`, etc.) to integer codes required by the API (`3`, `4`, etc.), and registration type strings to their numeric equivalents. It also handles date-to-API-format conversion for endpoints that accept `start_date`/`end_date`.

---

## Service catalog

### `devices` — `DevicesAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/devices.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zcc/services/devices/`

Manages device enrollment records in the Client Connector portal. Covers listing, CSV export, cleanup policy, and removal operations.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_devices` | `(query_params=None) -> APIResult[List[Device]]` | GET | `/getDevices` |
| `get_device_details` | `(query_params=None) -> APIResult[DeviceDetails]` | GET | `/getDeviceDetails` |
| `get_device_cleanup_info` | `() -> APIResult[DeviceCleanup]` | GET | `/getDeviceCleanupInfo` |
| `update_device_cleanup_info` | `(**kwargs) -> APIResult[SetDeviceCleanupInfo]` | PUT | `/setDeviceCleanupInfo` |
| `remove_devices` | `(query_params=None, **kwargs) -> APIResult` | POST | `/removeDevices` |
| `force_remove_devices` | `(query_params=None, **kwargs) -> APIResult` | POST | `/forceRemoveDevices` |
| `remove_machine_tunnel` | `(query_params=None, **kwargs) -> APIResult` | POST | `/removeMachineTunnel` |
| `download_devices` | `(query_params=None, filename=None) -> str` | GET | `/downloadDevices` |
| `download_service_status` | `(query_params=None, filename=None) -> str` | GET | `/downloadServiceStatus` |
| `download_disable_reasons` | `(query_params=None, filename=None) -> str` | GET | `/downloadDisableReasons` |

**Notable behavior:**
- `download_devices`, `download_service_status`, and `download_disable_reasons` write binary content directly to disk and return the filename. They expect `application/octet-stream` or a CSV starting with `"User","Device type"`. The rate limit for `/downloadDevices` is 3 calls per day; the legacy client enforces this both client-side and via 429 handling.
- `remove_devices` performs a graceful unenrollment; `force_remove_devices` bypasses agent acknowledgment.
- `remove_machine_tunnel` targets machine-tunnel (system-level ZPA) registrations by hostname or machine token, not user-registered devices.
- `get_device_details` returns a single object (not a list), so the implementation wraps `DeviceDetails(response.get_body())` directly rather than iterating.
- `list_devices` filters: `os_type` (string name, mapped to int), `username`, `page`, `page_size`.

**Go parity:** ✅ `devices.GetAll`, `devices.GetDeviceCleanupInfo`, `devices.SetDeviceCleanupInfo`. Also has `download_devices` / `download_service_status` in `download_devices/` package.

---

### `secrets` — `SecretsAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/secrets.py`
**Go packages:** `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/`, `secrets/getpasswords/`

Retrieves device-specific OTP codes and password bundles used for agent unlock operations.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `get_otp` | `(query_params=None) -> APIResult[OtpResponse]` | GET | `/getOtp` |
| `get_passwords` | `(query_params=None) -> APIResult[Passwords]` | GET | `/getPasswords` |

**Notable behavior:**
- `get_otp` accepts either `device_id` or `udid` as a query parameter; `device_id` is silently aliased to `udid` before the request is made.
- `get_passwords` accepts `username` and `os_type` (string name via `@zcc_param_mapper`).
- These are sensitive endpoints. Both return single objects (not lists).

**Go parity:** ✅ `getotp.GetOtp`, `getpasswords.GetPasswords`.

---

### `admin_user` — `AdminUserAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/admin_user.py`
**Go packages:** `vendor/zscaler-sdk-go/zscaler/zcc/services/admin_users/`, `admin_roles/`

Manages admin user accounts and roles in the Client Connector portal, plus ZIA/ZDX/ZPA admin sync operations.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_admin_users` | `(query_params=None) -> APIResult[List[AdminUser]]` | GET | `/getAdminUsers` |
| `get_admin_user_sync_info` | `() -> APIResult[AdminUserSyncInfo]` | GET | `/getAdminUsersSyncInfo` |
| `list_admin_roles` | `(query_params=None) -> APIResult[List[AdminRoles]]` | GET | `/getAdminRoles` |
| `sync_zia_zdx_admin_users` | `() -> APIResult` | POST | `/syncZiaZdxAdminUsers` |
| `sync_zpa_admin_users` | `() -> APIResult` | POST | `/syncZpaAdminUsers` |

**Notable behavior:**
- `list_admin_users` accepts `user_type`, `page`, `page_size`.
- `sync_zia_zdx_admin_users` and `sync_zpa_admin_users` trigger background synchronization of admin user data from ZIA/ZDX or ZPA respectively. The response body contains sync status items, iterated as a raw list.
- `get_admin_user_sync_info` returns a single `AdminUserSyncInfo` object with the last sync timestamp and status.

**Go parity:** ✅ `admin_users.GetAll`, `admin_roles.GetAll`. Sync operations are Go-only write methods.

---

### `company` — `CompanyInfoAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/company.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zcc/services/company/`

Read-only access to organizational metadata.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `get_company_info` | `() -> APIResult[List[GetCompanyInfo]]` | GET | `/getCompanyInfo` |

**Notable behavior:**
- The API docstring notes: "This API endpoint is allowed if called via OneAPI or if the token has admin or read-only admin privileges." Legacy portal tokens with insufficient scope will receive 403.
- Returns a list of company info objects (typically one per call).

**Go parity:** ✅ `company.GetCompanyInfo`.

---

### `entitlements` — `EntitlementAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/entitlements.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zcc/services/entitlements/`

Controls which ZDX and ZPA groups are entitled to use the Client Connector.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `get_zdx_group_entitlements` | `(query_params=None) -> APIResult[List[ZdxGroupEntitlements]]` | GET | `/getZdxGroupEntitlements` |
| `update_zdx_group_entitlement` | `() -> APIResult[ZdxGroupEntitlements]` | PUT | `/updateZdxGroupEntitlement` |
| `get_zpa_group_entitlements` | `(query_params=None) -> APIResult[List[ZpaGroupEntitlements]]` | GET | `/getZpaGroupEntitlements` |
| `update_zpa_group_entitlement` | `() -> APIResult[ZpaGroupEntitlements]` | PUT | `/updateZpaGroupEntitlement` |

**Notable behavior:**
- Both update methods accept no explicit keyword arguments in the current Python implementation — the body is empty `{}`. This appears incomplete; open question below.
- `query_params` for list methods: `page`, `page_size`, `search`.

**Go parity:** ✅ `entitlements.GetZdxGroupEntitlements`, `entitlements.GetZpaGroupEntitlements`, and corresponding update functions.

---

### `forwarding_profile` — `ForwardingProfileAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/forwarding_profile.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/`

Manages web forwarding profiles (PAC file / Zscaler tunnel forwarding configuration) per company.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_by_company` | `(query_params=None) -> APIResult[List[ForwardingProfile]]` | GET | `/webForwardingProfile/listByCompany` |
| `update_forwarding_profile` | `(**kwargs) -> APIResult[ForwardingProfile]` | POST | `/webForwardingProfile/edit` |
| `delete_forwarding_profile` | `(profile_id: int) -> APIResult` | DELETE | `/webForwardingProfile/{profile_id}/delete` |

**Notable behavior:**
- `update_forwarding_profile` uses POST for both create and update (the portal API does not distinguish create vs. edit via separate HTTP methods here).
- `delete_forwarding_profile` takes an integer `profile_id`.
- The Go SDK additionally has a `forwarding_profile_request.go` file that likely defines the request body struct.

**Go parity:** ✅ `forwarding_profile.GetAll`, create/update/delete.

---

### `fail_open_policy` — `FailOpenPolicyAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/fail_open_policy.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zcc/services/failopen_policy/`

Controls what the agent does when the Zscaler cloud is unreachable — captive portal handling, tunnel failure behavior, and strict enforcement prompts.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_by_company` | `(query_params=None) -> APIResult[List[FailOpenPolicy]]` | GET | `/webFailOpenPolicy/listByCompany` |
| `update_failopen_policy` | `(**kwargs) -> APIResult[FailOpenPolicy]` | PUT | `/webFailOpenPolicy/edit` |

**Notable behavior:**
- Key fields accepted by `update_failopen_policy`: `id`, `active`, `enable_fail_open`, `enable_captive_portal_detection`, `captive_portal_web_sec_disable_minutes`, `enable_strict_enforcement_prompt`, `strict_enforcement_prompt_delay_minutes`, `strict_enforcement_prompt_message`, `enable_web_sec_on_tunnel_failure`, `enable_web_sec_on_proxy_unreachable`, `tunnel_failure_retry_count`.
- No delete operation — policies are updated in place.

**Go parity:** ✅ `failopen_policy.GetAll`, update.

---

### `web_policy` — `WebPolicyAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/`

Manages per-platform agent policy assignments (the set of policies active for each OS type).

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_by_company` | `(query_params=None) -> APIResult[List[WebPolicy]]` | GET | `/web/policy/listByCompany` |
| `activate_web_policy` | `(**kwargs) -> APIResult[WebPolicy]` | PUT | `/web/policy/activate` |
| `web_policy_edit` | `(**kwargs) -> APIResult[WebPolicy]` | PUT | `/web/policy/edit` |
| `delete_web_policy` | `(policy_id: int) -> APIResult` | DELETE | `/web/policy/{policy_id}/delete` |

**Notable behavior:**
- `list_by_company` accepts `device_type` (OS string, mapped by `@zcc_param_mapper`), `page`, `page_size`, `search`, `search_type`.
- `activate_web_policy` enables or disables a policy for a platform; takes `device_type` (int) and `policy_id` (int). If the response body is empty, an empty `WebPolicy()` object is returned rather than failing.
- `web_policy_edit` calls `transform_common_id_fields(reformat_params, body, body)` to normalize ID field references before sending.

**Go parity:** ✅ `web_policy.GetAll`, activate, edit, delete.

---

### `web_app_service` — `WebAppServiceAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/web_app_service.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zcc/services/web_app_service/`

Lists web application service definitions used by forwarding policies.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_by_company` | `(query_params=None) -> APIResult[List[WebAppService]]` | GET | `/webAppService/listByCompany` |

**Notable behavior:**
- Read-only at the Python SDK level — no create, update, or delete methods.
- `query_params`: `page`, `page_size`, `search`.

**Go parity:** ✅ `web_app_service.GetAll`. No write methods in Go either.

---

### `web_privacy` — `WebPrivacyAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zcc/services/web_privacy/`

Controls which end-user and device PII the agent is permitted to collect (machine hostname, user info, ZDX location, packet capture, etc.).

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `get_web_privacy` | `() -> dict` | GET | `/getWebPrivacyInfo` |
| `set_web_privacy_info` | `(**kwargs) -> APIResult[WebPrivacy]` | PUT | `/setWebPrivacyInfo` |

**Notable behavior:**
- `get_web_privacy` is inconsistent with other methods: it returns `None` on error rather than a tuple, and returns the raw dict body directly on success (not a model object).
- `set_web_privacy_info` accepts: `id`, `active`, `collect_machine_hostname`, `collect_user_info`, `collect_zdx_location`, `disable_crashlytics`, `enable_packet_capture`, `export_logs_for_non_admin`, `grant_access_to_zscaler_log_folder`, `override_t2_protocol_setting`, `restrict_remote_packet_capture`, `enable_auto_log_snippet`.

**Go parity:** ✅ `web_privacy.GetWebPrivacyInfo`, `web_privacy.SetWebPrivacyInfo`.

---

### `trusted_networks` — `TrustedNetworksAPI`

**File:** `vendor/zscaler-sdk-python/zscaler/zcc/trusted_networks.py`
**Go package:** `vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/`

Full CRUD for trusted network definitions — IP subnets, DNS servers, SSIDs, gateways, and DHCP servers that the agent uses to determine whether it is on a trusted network.

| Method | Signature | HTTP | Endpoint |
|---|---|---|---|
| `list_by_company` | `(query_params=None) -> APIResult[List[TrustedNetworks]]` | GET | `/webTrustedNetwork/listByCompany` |
| `add_trusted_network` | `(**kwargs) -> APIResult[TrustedNetworks]` | POST | `/webTrustedNetwork/create` |
| `update_trusted_network` | `(**kwargs) -> APIResult[TrustedNetworks]` | PUT | `/webTrustedNetwork/edit` |
| `delete_trusted_network` | `(network_id: int) -> APIResult` | DELETE | `/webTrustedNetwork/{network_id}/delete` |

**Notable behavior:**
- `list_by_company` extracts results from `response_body["trustedNetworkContracts"]` — a non-standard wrapper key compared with other ZCC list endpoints.
- Key fields: `network_name`, `dns_servers`, `dns_search_domains`, `hostnames`, `trusted_subnets`, `trusted_gateways`, `trusted_dhcp_servers`, `trusted_egress_ips`, `ssids`, `condition_type`, `active`.
- Fields accept comma-separated string values (not lists).

**Go parity:** ✅ `trusted_network.GetAll`, create, update, delete.

---

## Go-only services (no Python equivalent)

The following Go packages expose functionality not present in the Python ZCC SDK:

| Go package | Endpoint | Notes |
|---|---|---|
| `application_profiles` | `/zcc/papi/public/v1/application-profiles` | Application profiles (policy groups, device groups). Full CRUD. |
| `custom_ip_apps` | `/zcc/papi/public/v1/custom-ip-based-apps` | Custom IP-based application definitions. |
| `predefined_ip_apps` | `/zcc/papi/public/v1/predefined-ip-based-apps` | Predefined IP application catalog. Read-only. |
| `process_based_apps` | `/zcc/papi/public/v1/process-based-apps` | Process-based application definitions. |
| `manage_pass` | `/zcc/papi/public/v1/managePass` | Bulk password management (exit, logout, uninstall, per-product disable passwords). |
| `remove_devices` | `/zcc/papi/public/v1/removeDevices` | Device removal (separate package in Go; bundled in Python `devices.py`). |
| `download_devices` | `/zcc/papi/public/v1/downloadDevices` | CSV export (separate Go package; bundled in Python `devices.py`). |

---

## Per-product nuances

### Device enrollment and OS type mapping

The ZCC API represents OS types as integers: iOS=1, Android=2, Windows=3, macOS=4, Linux=5. The Python SDK uses the `@zcc_param_mapper` decorator and `zcc_param_map` dict to convert string names to these integers transparently. The Go SDK provides `common.GetDeviceTypeByName()` for the same conversion. Passing an invalid OS type name raises `ValueError` in Python.

### `remove_devices` vs `force_remove_devices`

`/removeDevices` sends a removal request that waits for agent acknowledgment. `/forceRemoveDevices` marks the device removed immediately in the portal regardless of agent state. Both accept `client_connector_version`, `os_type`, `udids` (list), and `username`.

### CSV download endpoints

`/downloadDevices` and `/downloadServiceStatus` have a combined rate limit of 3 calls per day (enforced by both the server 429 and client-side counters in `LegacyZCCClientHelper`). The response is binary (`application/octet-stream`). The Python implementation validates the response's `Content-Type` header and the first line of the CSV body before writing to disk.

### Machine tunnel removal

`/removeMachineTunnel` targets ZPA machine tunnel registrations (system-level, not user-bound). It accepts `host_names` (list) or `machine_token` as body parameters. This is distinct from the user-device removal flow.

### Legacy vs. OneAPI client

The `LegacyZCCClientHelper` attaches `auth-token` (not `Authorization: Bearer`) as the authentication header. When migrating to OneAPI, callers switch to the standard `ZCCService` accessed through `ZscalerClient`. The service interface (property names, method signatures) is identical between the two paths — only the client construction differs.

### Partner ID header

If `partner_id` is set, the `x-partner-id` header is included on every request in both the legacy and modern client paths.

---

## Open questions

<!-- Resolved clarifications 2026-04-26 -->

**Q1 — Resolved 2026-04-26.** `update_zdx_group_entitlement` and `update_zpa_group_entitlement` in the Python SDK send an empty body `{}`, but the Go SDK (`vendor/zscaler-sdk-go/zscaler/zcc/services/entitlements/entitlements.go`) passes a fully populated struct: `ZdxGroupEntitlements` (fields: `collectZdxLocation`, `computeDeviceGroupsForZDX`, `logoutZCCForZDXService`, `totalCount`, `upmDeviceGroupList`, `upmEnableForAll`, `upmGroupList`) or `ZpaGroupEntitlements` (fields: `computeDeviceGroupsForZPA`, `deviceGroupList`, `groupList`, `machineTunEnabledForAll`, `totalCount`, `zpaEnableForAll`). The Python implementation is incomplete — callers must use the Go SDK or construct the PUT body manually from these struct definitions to make meaningful updates.

2. `get_web_privacy` returns `None` on error rather than a three-tuple, unlike every other method in the SDK. This is either an oversight or an intentional deviation. Callers must handle `None` rather than checking the third tuple element.

**Q3 — Resolved 2026-04-26.** `web_policy_edit` calls `transform_common_id_fields(reformat_params, body, body)` where `reformat_params` is the global list defined in `vendor/zscaler-sdk-python/zscaler/utils.py` (lines 42–93). It converts snake_case keyword argument keys into their camelCase API equivalents for every object-reference field: `app_services → appServices`, `app_service_groups → appServiceGroups`, `devices → devices`, `device_groups → deviceGroups`, `departments → departments`, `groups → groups`, `users → users`, `labels → labels`, `locations → locations`, `location_groups → locationGroups`, `nw_services → nwServices`, `nw_service_groups → nwServiceGroups`, `src_ip_groups → srcIpGroups`, `time_windows → timeWindows`, plus ZPA-specific fields (`zpa_app_segments`, `zpa_application_segments`, `zpa_application_segment_groups`) and others. Source: `vendor/zscaler-sdk-python/zscaler/utils.py`.

**Q4 — Resolved 2026-04-26.** Application profiles, custom IP apps, predefined IP apps, and process-based apps exist in the Go SDK (`vendor/zscaler-sdk-go/zscaler/zcc/services/application_profiles/`, `custom_ip_apps/`, `predefined_ip_apps/`, `process_based_apps/`) and have no Python equivalent. The Python ZCC service file list (`vendor/zscaler-sdk-python/zscaler/zcc/`) contains no corresponding modules, confirming these are not yet implemented in the Python SDK (not intentionally excluded).

**Q5 — Resolved 2026-04-26.** The `manage_pass` endpoint is confirmed in Go at `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`. The `ManagePass` struct accepts: `companyId`, `deviceType`, `exitPass`, `logoutPass`, `policyName`, `uninstallPass`, `zadDisablePass`, `zdpDisablePass`, `zdxDisablePass`, `ziaDisablePass`, `zpaDisablePass`. The Python SDK has `models/manage_pass.py` with the matching model but no service module exposing the PUT call. Callers must use the Go SDK or call `POST /zcc/papi/public/v1/managePass` directly.

6. Rate-limit headers returned by the ZCC API (`X-Rate-Limit-Remaining`, `X-Rate-Limit-Retry-After-Seconds`) are consumed by `LegacyZCCClientHelper` but their behavior for the OneAPI path is not documented in the SDK source.
