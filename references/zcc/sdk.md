---
product: zcc
topic: zcc-sdk
title: "ZCC SDK reference — Python and Go service catalog"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/zcc_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/_serialize.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/_field_introspect.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py"
  - "vendor/zscaler-sdk-python/zscaler/request_executor.py"
  - "vendor/zscaler-sdk-python/zscaler/utils.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go"
author-status: draft
---

# ZCC SDK reference

## Overview

Source: `vendor/zscaler-sdk-python/zscaler/zcc/zcc_service.py`; `vendor/zscaler-sdk-python/zscaler/zcc/legacy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go`.

The ZCC SDK wraps the Zscaler Client Connector portal API (`/zcc/papi/public/v1`). It covers device enrollment management, policy configuration, secrets, and administrative tasks for the Client Connector agent fleet.

### Client construction — Python

Source: `vendor/zscaler-sdk-python/zscaler/zcc/zcc_service.py`; `vendor/zscaler-sdk-python/zscaler/zcc/legacy.py`.

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

Source: `vendor/zscaler-sdk-python/zscaler/zcc/zcc_service.py`.

The `ZCCService` class (`zscaler/zcc/zcc_service.py`) is instantiated inside `ZscalerClient` and delegates to a shared `RequestExecutor`.

**Legacy path (ZCC portal token):**

Source: `vendor/zscaler-sdk-python/zscaler/zcc/legacy.py`.

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
// Pass service to individual package-level functions.
// GetAll takes username and osType filters (empty strings = no filter):
devices, err := devices.GetAll(ctx, service, "", "")
```

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go`; `vendor/zscaler-sdk-go/zscaler/zcc/services/devices/devices.go:90`.

Go ZCC services are package-level functions, not methods on a struct. The `NewZccRequestDo` transport method is used — callers must close `resp.Body` and decode manually.

### Authentication specifics

Source: `vendor/zscaler-sdk-python/zscaler/zcc/legacy.py`; `vendor/zscaler-sdk-python/zscaler/zcc/zcc_service.py`.

ZCC requires ZCC-scoped API credentials. When using OneAPI, the token request must include the `zcc.*` scope granted to the API client in ZIdentity. The legacy `LegacyZCCClientHelper` uses the ZCC-specific portal login, which is separate from ZIA/ZPA/ZDX authentication. The `x-partner-id` header is sent on every request when `partner_id` is configured.

### Pagination — Python

Source: `vendor/zscaler-sdk-python/zscaler/utils.py`; `vendor/zscaler-sdk-python/zscaler/zcc/devices.py`.

List endpoints accept `page` (1-indexed) and `page_size` (default 50, max 5000) as `query_params` keys. The `@zcc_param_mapper` decorator translates snake_case OS and registration type names to their numeric API equivalents before the request is sent.

The raw `response` object returned from every call supports client-side JMESPath filtering via `resp.search(expression)` (`vendor/zscaler-sdk-python/zscaler/oneapi_response.py:274`).

### Pagination — Go

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go`.

`common.ReadAllPages[T]` in `zscaler/zcc/services/common/common.go` iterates pages automatically (default 50, max 5000) and stops when `len(pageResults) < pageSize`. JMESPath filtering is applied after aggregation via `zscaler.ApplyJMESPathFromContext`.

### Return convention — Python

Source: `vendor/zscaler-sdk-python/zscaler/zcc/devices.py`; `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`; `vendor/zscaler-sdk-python/zscaler/zcc/trusted_networks.py`.

Every method returns a three-tuple `(result, response, error)`. Callers should check `error` before using `result`.

### Parameter mapping (`@zcc_param_mapper`)

Source: `vendor/zscaler-sdk-python/zscaler/utils.py`.

The `zcc_param_mapper` decorator translates human-readable OS type strings (`"windows"`, `"macos"`, etc.) to integer codes required by the API (`3`, `4`, etc.), and registration type strings to their numeric equivalents. It also handles date-to-API-format conversion for endpoints that accept `start_date`/`end_date`.

### Request-body wire-key serialization (ZCC-only `_serialize` / `_field_introspect`)

Source: `vendor/zscaler-sdk-python/zscaler/zcc/_serialize.py`; `vendor/zscaler-sdk-python/zscaler/zcc/_field_introspect.py`; `vendor/zscaler-sdk-python/zscaler/request_executor.py`.

For request *bodies* (as opposed to the OS/date *query-parameter* mapping above), ZCC has its own serializer that supersedes the generic heuristic snake_case→camelCase converter. The module docstring states the design directly: "The model class is the single source of truth for wire keys" and "No reliance on heuristic snake-to-camel conversion or hand-maintained `FIELD_EXCEPTIONS` tables" (`_serialize.py:10,11-12`). It applies to ZCC only and "must not be used by other services" (`_serialize.py:20`).

How it works:

- `zcc_to_wire(body, schema_cls)` (`_serialize.py:104`) walks the user body and rewrites each key to the exact wire form declared by the model class's `request_format` method. The wire key for each provided key is resolved in a fixed order (`_serialize.py:60-83`): (1) if the key is a snake_case attribute the model declares, use the wire key from `request_format`; (2) if the key is already a wire-form key the model declares, keep it as-is; (3) if the key is in the legacy `WebPolicy.SNAKE_CASE_KEYS` set, preserve it as snake_case; (4) otherwise fall back to `to_lower_camel_case` (a no-op for keys already in camelCase, so camelCase the caller passes survives unchanged). Unknown keys pass through rather than being dropped or mangled (`_serialize.py:17-18`).
- The wire keys are derived per-class by `_field_introspect.field_map(cls)` (`_field_introspect.py:66-80`), which traces the model's `request_format` to produce `{snake_attr -> wire_key}`. Nested model classes are detected from the model's `__init__` (`_field_introspect.py:128-174`) so sub-trees are serialized against the right schema.
- The result is wrapped in a `_ZccWireBody` marker dict (`_serialize.py:47-57`). When the request executor sees the body is a `_ZccWireBody` it returns it verbatim and skips the legacy `convert_keys_to_camel_case_selective` step (`request_executor.py:358-368`); endpoints not yet migrated to the serializer still go through that legacy selective converter with `WebPolicy.SNAKE_CASE_KEYS` (`request_executor.py:370-372`).

The key consequence — and the reason ZCC casing looks chaotic — is that the wire key is scoped per model class, so the same snake_case attribute can map to different wire keys on different platforms. The docstring's illustrative example is `WindowsPolicy.disable_password` → `disable_password` (snake) vs `LinuxPolicy.disable_password` → `disablePassword` (camel) (`_serialize.py:14-16`). The Go struct tags corroborate that this per-platform divergence is real (though the specific platform that diverges differs from the Python docstring's example): in `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`, `MacPolicy.DisablePassword` carries the snake-case tag `json:"disable_password"` (`web_policy.go:403`) while `WindowsPolicy.DisablePassword` (`web_policy.go:461`) and `LinuxPolicy.DisablePassword` (`web_policy.go:379`) carry the camelCase tag `json:"disablePassword"`. The Go comment explains why MacPolicy is snake-cased: "earlier versions of this struct used camelCase tags which the API silently ignored, leading to `{"success":"false","id":0}` on /edit" (`web_policy.go:391-393`).

This is the path `web_policy_edit` and `update_forwarding_profile` now use: each calls `zcc_to_wire(body, <Model>)` before building the request (`web_policy.py:457`; `forwarding_profile.py:126`).

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

Source: `vendor/zscaler-sdk-python/zscaler/zcc/forwarding_profile.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`; `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile_request.go`.

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

Source: `vendor/zscaler-sdk-python/zscaler/zcc/fail_open_policy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/failopen_policy/failopen_policy.go`.

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

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go`.

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
- `web_policy_edit` serializes its body via `zcc_to_wire(body, WebPolicy)` (`web_policy.py:457`) before building the request — the model-driven wire-key serializer described under "Request-body wire-key serialization" above, not the older `transform_common_id_fields` path.

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

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/web_privacy/web_privacy.go`.

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

Source: `vendor/zscaler-sdk-python/zscaler/zcc/trusted_networks.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go`.

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

## Additional service parity notes

The following services are easy to misclassify because older captures showed them as Go-only. The current inspected Python SDK exposes the application-app surfaces through `ZCCService`; `manage_pass` remains model-only in Python.

Source: `vendor/zscaler-sdk-python/zscaler/zcc/zcc_service.py`; `vendor/zscaler-sdk-python/zscaler/zcc/application_profiles.py`; `vendor/zscaler-sdk-python/zscaler/zcc/custom_ip_base_apps.py`; `vendor/zscaler-sdk-python/zscaler/zcc/predefined_ip_based_apps.py`; `vendor/zscaler-sdk-python/zscaler/zcc/process_based_apps.py`; `vendor/zscaler-sdk-python/zscaler/zcc/models/manage_pass.py`; `vendor/zscaler-sdk-go/zscaler/zcc/services/application_profiles/application_profiles.go`; `vendor/zscaler-sdk-go/zscaler/zcc/services/custom_ip_apps/custom_ip_apps.go`; `vendor/zscaler-sdk-go/zscaler/zcc/services/predefined_ip_apps/predefined_ip_apps.go`; `vendor/zscaler-sdk-go/zscaler/zcc/services/process_based_apps/process_based_apps.go`; `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`.

| Surface | Endpoint | Python | Go | Notes |
|---|---|---|---|---|
| `application_profiles` | `/zcc/papi/public/v1/application-profiles` | `application_profiles.py` | `application_profiles/application_profiles.go` | Python supports list/get/update; Go supports list/get helpers. |
| `custom_ip_apps` | `/zcc/papi/public/v1/custom-ip-based-apps` | `custom_ip_base_apps.py` | `custom_ip_apps/custom_ip_apps.go` | Read-only app catalog in inspected SDKs. |
| `predefined_ip_apps` | `/zcc/papi/public/v1/predefined-ip-based-apps` | `predefined_ip_based_apps.py` | `predefined_ip_apps/predefined_ip_apps.go` | Read-only predefined IP application catalog. |
| `process_based_apps` | `/zcc/papi/public/v1/process-based-apps` | `process_based_apps.py` | `process_based_apps/process_based_apps.go` | Read-only process-based application catalog. |
| `manage_pass` | `/zcc/papi/public/v1/managePass` | Model only (`models/manage_pass.py`) | `manage_pass/manage_pass.go` | Bulk password management remains Go/direct-HTTP for writes. |
| `remove_devices` | `/zcc/papi/public/v1/removeDevices` | `devices.py` | `remove_devices/zcc_remove_devices.go` | Device removal is a separate package in Go but bundled in Python `devices.py`. |
| `download_devices` | `/zcc/papi/public/v1/downloadDevices` | `devices.py` | `download_devices/download_devices.go` | CSV export is a separate package in Go but bundled in Python `devices.py`. |

---

## Per-product nuances

### Device enrollment and OS type mapping

The ZCC API represents OS types as integers: iOS=1, Android=2, Windows=3, macOS=4, Linux=5. The Python SDK uses the `@zcc_param_mapper` decorator and `zcc_param_map` dict to convert string names to these integers transparently. The Go SDK provides `common.GetDeviceTypeByName()` for the same conversion. Passing an invalid OS type name raises `ValueError` in Python.

### `remove_devices` vs `force_remove_devices`

`/removeDevices` sends a removal request that waits for agent acknowledgment. `/forceRemoveDevices` marks the device removed immediately in the portal regardless of agent state. Both accept `client_connector_version`, `os_type`, `udids` (list), and `username`.

### CSV download endpoints

Both `/downloadDevices` and `/downloadServiceStatus` are subject to a 3-calls-per-day limit, but they are enforced differently in `LegacyZCCClientHelper`. `/downloadDevices` is tracked client-side: `check_rate_limit` keeps a rolling `download_devices_count` that resets daily and raises `RateLimitExceededError` once it reaches `DOWNLOAD_DEVICES_LIMIT` (`vendor/zscaler-sdk-python/zscaler/zcc/legacy.py:242,247,250`). `/downloadServiceStatus` has no client-side counter — it is only caught reactively when the server returns 429, at which point `send` raises immediately without retrying (`vendor/zscaler-sdk-python/zscaler/zcc/legacy.py:306-310`). The response is binary (`application/octet-stream`). The Python implementation validates the response's `Content-Type` header and the first line of the CSV body before writing to disk.

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

2. `get_web_privacy` returns `None` on error rather than a three-tuple, unlike every other method in the SDK. This is either an oversight or an intentional deviation. Callers must handle `None` rather than checking the third tuple element. See [clarification `zcc-86`](../_meta/clarifications.md#zcc-86-get_web_privacy-returns-none-on-error).

Source: `vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py:58,61,65` (the three `return None` error paths).

**Q3 — Re-verified 2026-06-15 (superseded; behavior changed in source).** `web_policy_edit` no longer calls `transform_common_id_fields`. The current source serializes the body with the ZCC-only model-driven serializer: `body = zcc_to_wire(body, WebPolicy)` (`vendor/zscaler-sdk-python/zscaler/zcc/web_policy.py:457`). See the "Request-body wire-key serialization" subsection above for how wire keys are derived per model class. The older `transform_common_id_fields(reformat_params, body, body)` description that previously appeared here was for a prior SDK snapshot and no longer reflects `web_policy.py`.

**Q4 — Resolved 2026-05-16.** Application profiles, custom IP apps, predefined IP apps, and process-based apps are no longer Go-only in the inspected SDK snapshot. `ZCCService` exposes `application_profiles`, `custom_ip_base_apps`, `predefined_ip_based_apps`, and `process_based_apps`. Application profiles support update in Python; custom/predefined/process-based app modules expose read methods. Treat older "Go-only" notes for these services as stale.

**Q5 — Resolved 2026-04-26.** The `manage_pass` endpoint is confirmed in Go at `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`. The `ManagePass` struct accepts: `companyId`, `deviceType`, `exitPass`, `logoutPass`, `policyName`, `uninstallPass`, `zadDisablePass`, `zdpDisablePass`, `zdxDisablePass`, `ziaDisablePass`, `zpaDisablePass`. The Python SDK has `models/manage_pass.py` with the matching model but no service module exposing the PUT call. Callers must use the Go SDK or call `POST /zcc/papi/public/v1/managePass` directly.

6. Rate-limit headers returned by the ZCC API (`X-Rate-Limit-Remaining`, `X-Rate-Limit-Retry-After-Seconds`) are consumed by `LegacyZCCClientHelper` but their behavior for the OneAPI path is not documented in the SDK source. See [clarification `zcc-87`](../_meta/clarifications.md#zcc-87-zcc-rate-limit-header-behavior-on-the-oneapi-path).
