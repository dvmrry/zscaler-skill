---
product: zia
topic: zia-sdk
title: "ZIA SDK — service and method catalog"
content-type: reference
last-verified: 2026-04-26
confidence: medium
source-tier: code
sources:
  - vendor/zscaler-sdk-python/zscaler/zia/activate.py
  - vendor/zscaler-sdk-python/zscaler/zia/admin_roles.py
  - vendor/zscaler-sdk-python/zscaler/zia/admin_users.py
  - vendor/zscaler-sdk-python/zscaler/zia/advanced_settings.py
  - vendor/zscaler-sdk-python/zscaler/zia/alert_subscriptions.py
  - vendor/zscaler-sdk-python/zscaler/zia/apptotal.py
  - vendor/zscaler-sdk-python/zscaler/zia/atp_policy.py
  - vendor/zscaler-sdk-python/zscaler/zia/audit_logs.py
  - vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py
  - vendor/zscaler-sdk-python/zscaler/zia/bandwidth_classes.py
  - vendor/zscaler-sdk-python/zscaler/zia/bandwidth_control_rules.py
  - vendor/zscaler-sdk-python/zscaler/zia/browser_control_settings.py
  - vendor/zscaler-sdk-python/zscaler/zia/casb_dlp_rules.py
  - vendor/zscaler-sdk-python/zscaler/zia/casb_malware_rules.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_app_instances.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_applications.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_dns.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_ips.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall_rules.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_nss.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_to_cloud_ir.py
  - vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py
  - vendor/zscaler-sdk-python/zscaler/zia/custom_file_types.py
  - vendor/zscaler-sdk-python/zscaler/zia/dedicated_ip_gateways.py
  - vendor/zscaler-sdk-python/zscaler/zia/device_management.py
  - vendor/zscaler-sdk-python/zscaler/zia/dlp_dictionary.py
  - vendor/zscaler-sdk-python/zscaler/zia/dlp_engine.py
  - vendor/zscaler-sdk-python/zscaler/zia/dlp_resources.py
  - vendor/zscaler-sdk-python/zscaler/zia/dlp_templates.py
  - vendor/zscaler-sdk-python/zscaler/zia/dlp_web_rules.py
  - vendor/zscaler-sdk-python/zscaler/zia/dns_gatways.py
  - vendor/zscaler-sdk-python/zscaler/zia/end_user_notification.py
  - vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py
  - vendor/zscaler-sdk-python/zscaler/zia/forwarding_control.py
  - vendor/zscaler-sdk-python/zscaler/zia/ftp_control_policy.py
  - vendor/zscaler-sdk-python/zscaler/zia/gre_tunnel.py
  - vendor/zscaler-sdk-python/zscaler/zia/intermediate_certificates.py
  - vendor/zscaler-sdk-python/zscaler/zia/iot_report.py
  - vendor/zscaler-sdk-python/zscaler/zia/ipv6_config.py
  - vendor/zscaler-sdk-python/zscaler/zia/locations.py
  - vendor/zscaler-sdk-python/zscaler/zia/malware_protection_policy.py
  - vendor/zscaler-sdk-python/zscaler/zia/mobile_threat_settings.py
  - vendor/zscaler-sdk-python/zscaler/zia/nat_control_policy.py
  - vendor/zscaler-sdk-python/zscaler/zia/nss_servers.py
  - vendor/zscaler-sdk-python/zscaler/zia/organization_information.py
  - vendor/zscaler-sdk-python/zscaler/zia/pac_files.py
  - vendor/zscaler-sdk-python/zscaler/zia/policy_export.py
  - vendor/zscaler-sdk-python/zscaler/zia/proxies.py
  - vendor/zscaler-sdk-python/zscaler/zia/remote_assistance.py
  - vendor/zscaler-sdk-python/zscaler/zia/risk_profiles.py
  - vendor/zscaler-sdk-python/zscaler/zia/rule_labels.py
  - vendor/zscaler-sdk-python/zscaler/zia/saas_security_api.py
  - vendor/zscaler-sdk-python/zscaler/zia/sandbox.py
  - vendor/zscaler-sdk-python/zscaler/zia/sandbox_rules.py
  - vendor/zscaler-sdk-python/zscaler/zia/security_policy_settings.py
  - vendor/zscaler-sdk-python/zscaler/zia/shadow_it_report.py
  - vendor/zscaler-sdk-python/zscaler/zia/ssl_inspection_rules.py
  - vendor/zscaler-sdk-python/zscaler/zia/sub_clouds.py
  - vendor/zscaler-sdk-python/zscaler/zia/system_audit.py
  - vendor/zscaler-sdk-python/zscaler/zia/tenancy_restriction_profile.py
  - vendor/zscaler-sdk-python/zscaler/zia/time_intervals.py
  - vendor/zscaler-sdk-python/zscaler/zia/traffic_capture.py
  - vendor/zscaler-sdk-python/zscaler/zia/traffic_datacenters.py
  - vendor/zscaler-sdk-python/zscaler/zia/traffic_extranet.py
  - vendor/zscaler-sdk-python/zscaler/zia/traffic_static_ip.py
  - vendor/zscaler-sdk-python/zscaler/zia/traffic_vpn_credentials.py
  - vendor/zscaler-sdk-python/zscaler/zia/url_categories.py
  - vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py
  - vendor/zscaler-sdk-python/zscaler/zia/user_management.py
  - vendor/zscaler-sdk-python/zscaler/zia/vzen_clusters.py
  - vendor/zscaler-sdk-python/zscaler/zia/vzen_nodes.py
  - vendor/zscaler-sdk-python/zscaler/zia/workload_groups.py
  - vendor/zscaler-sdk-python/zscaler/zia/zia_service.py
  - vendor/zscaler-sdk-python/zscaler/zia/zpa_gateway.py
  - vendor/zscaler-sdk-python/README.md
author-status: draft
---

# ZIA SDK — service and method catalog

Comprehensive reference for the ZIA portion of the Zscaler Python SDK (`zscaler-sdk-python`). This document covers every service module under `zscaler/zia/`, with Go SDK parity notes drawn from `vendor/zscaler-sdk-go/zscaler/zia/services/`.

---

## 1. SDK overview

### Client construction

The SDK ships with two authentication paths that coexist in the same package.

**OneAPI (current — OAuth 2.0 via ZIdentity)**

```python
from zscaler import ZscalerClient

config = {
    "clientId": "...",
    "clientSecret": "...",   # or "privateKey": "..." for JWT auth
    "vanityDomain": "acme",  # forms https://acme.zslogin.net/oauth2/v1/token
    "cloud": "beta",         # optional; omit for production default
    "logging": {"enabled": False, "verbose": False},
}

with ZscalerClient(config) as client:
    users, resp, err = client.zia.user_management.list_users()
```

The `with` statement activates all staged ZIA configuration changes on context exit (implicit activation).

**Legacy framework (non-ZIdentity tenants)**

```python
from zscaler.oneapi_client import LegacyZIAClient

with LegacyZIAClient(config) as client:
    users, _, _ = client.user_management.list_users()
```

Government clouds (`zscalergov`, `zscalerten`, ZPA `GOV`, `GOVUS`) do not support OneAPI.

**Environment variables** (all optional when provided in config dict):

| Variable | Purpose |
|---|---|
| `ZSCALER_CLIENT_ID` | OAuth client ID |
| `ZSCALER_CLIENT_SECRET` | OAuth client secret |
| `ZSCALER_PRIVATE_KEY` | Private key for JWT auth |
| `ZSCALER_VANITY_DOMAIN` | ZIdentity vanity domain |
| `ZSCALER_CLOUD` | Target cloud name |
| `ZSCALER_PARTNER_ID` | Sets `x-partner-id` header on all requests |
| `ZSCALER_SANDBOX_TOKEN` | Sandbox submission token |
| `ZSCALER_SANDBOX_CLOUD` | Sandbox cloud (e.g. `zscaler`, `zscalertwo`) |

### Service accessor pattern

Every ZIA service is exposed as a property on `client.zia` (the `ZIAService` object). A new API client instance is created per property access — they are not cached.

```python
client.zia.user_management       # -> UserManagementAPI
client.zia.url_filtering         # -> URLFilteringAPI
client.zia.cloud_firewall_rules  # -> FirewallPolicyAPI
```

### Return value convention

Every method returns a 3-tuple: `(result, response, error)`.

- `result`: typed model instance or list; `None` on error.
- `response`: raw `ZscalerAPIResponse` object; always present unless request creation failed.
- `error`: `Exception` instance or `None`.

Callers must check `error` before using `result`:

```python
rules, resp, err = client.zia.url_filtering.list_rules()
if err:
    raise RuntimeError(f"API error: {err}")
```

### Pagination

List endpoints accept `query_params` with `page` (int, 1-based offset) and `page_size` (int, default 100, max varies by endpoint — 1000 for most, 10 000 for `/users`). The response object exposes `resp.has_next()` and `resp.next()` for manual iteration. Server-side filtering uses `query_params`; many list endpoints also perform a secondary client-side `search` filter on `name` after fetching the full page.

```python
users, resp, _ = client.zia.user_management.list_users(
    query_params={"page": 1, "page_size": 500}
)
# Manual next-page walk
while resp.has_next():
    more, resp, _ = resp.next()
```

### Client-side filtering with JMESPath

All list responses support `resp.search(expression)` for client-side projection:

```python
users, resp, _ = client.zia.user_management.list_users()
admins = resp.search("[?adminUser==`true`].{name: name, id: id}")
```

### `enabled` / `state` translation

Several rule-based services (`bandwidth_control_rules`, `dlp_web_rules`, `sandbox_rules`, etc.) accept a Python-friendly `enabled: bool` keyword argument. The SDK internally converts this to `state: "ENABLED" | "DISABLED"` before serializing the request body.

### `transform_common_id_fields`

Methods that accept list-of-ID parameters (e.g. `locations`, `groups`, `departments`) run `transform_common_id_fields(reformat_params, body, body)` before sending. This converts flat integer lists to the `[{"id": n}, ...]` shape expected by the API. Callers may pass plain integer lists; the SDK handles the reshaping.

### Error types

The SDK returns standard Python exceptions wrapped in the error position of the tuple. Common types include `ValueError` (invalid argument), `TypeError` (wrong argument type), and exceptions surfaced from the HTTP layer. There are no custom SDK exception classes as of the reviewed codebase.

---

## 2. Service catalog

Each entry lists the Python class name, the module file (relative to `vendor/zscaler-sdk-python/`), the `client.zia.<accessor>` name, key methods, and Go SDK parity.

Parity legend: **Yes** = Go SDK has an equivalent service directory, **Partial** = Go SDK directory exists but coverage differs, **No** = Python-only.

---

### ActivationAPI

**File:** `zscaler/zia/activate.py`  
**Accessor:** `client.zia.activate`  
**Purpose:** Manages the ZIA configuration change lifecycle — staging and committing changes, querying activation status, and managing the End User Subscription Agreement (EUSA).

| Method | Signature | Notes |
|---|---|---|
| `status` | `() -> APIResult[Activation]` | GET `/status` — returns current activation state. |
| `activate` | `() -> APIResult[Activation]` | POST `/status/activate` — commits all staged changes. |
| `get_eusa_status` | `() -> APIResult[EusaStatus]` | GET `/eusaStatus/latest` — returns latest EUSA acceptance record. |
| `update_eusa_status` | `(status_id: int, **kwargs) -> APIResult[EusaStatus]` | PUT `/eusaStatus/{id}` — set `acceptedStatus: bool`. |

**Go parity:** Yes (`activation/`)

---

### AdminRolesAPI

**File:** `zscaler/zia/admin_roles.py`  
**Accessor:** `client.zia.admin_roles`  
**Purpose:** CRUD for ZIA admin roles, including granular feature permissions. Also exposes password expiry settings (not compatible with ZIdentity-migrated tenants).

| Method | Signature | Notes |
|---|---|---|
| `list_roles` | `(query_params=None) -> APIResult[List[AdminRoles]]` | GET `/adminRoles/lite`. Supports `search`, `include_auditor_role`, `include_partner_role`, `include_api_role` params. Client-side name filter applied post-fetch. |
| `get_role` | `(role_id: int) -> APIResult[AdminRoles]` | GET `/adminRoles/{id}`. |
| `add_role` | `(**kwargs) -> APIResult[AdminRoles]` | POST `/adminRoles`. Requires `name`, `role_type`. Accepts `feature_permissions: dict` mapping feature keys to `"READ_WRITE"` or `"READ_ONLY"`. SDK translates `feature_permissions` key to camelCase `featurePermissions`. |
| `update_role` | `(role_id: int, **kwargs) -> APIResult[AdminRoles]` | PUT `/adminRoles/{id}`. Same kwargs as `add_role`. |
| `delete_role` | `(role_id: int) -> APIResult[None]` | DELETE `/adminRoles/{id}`. |
| `get_password_expiry_settings` | `() -> APIResult[PasswordExpiry]` | GET `/passwordExpiry/settings`. Not compatible with ZIdentity tenants. |
| `update_password_expiry_settings` | `(**kwargs) -> APIResult[PasswordExpiry]` | PUT — note: source code sends to `/cyberThreatProtection/advancedThreatSettings` endpoint, which appears to be a copy-paste bug (see open questions). Accepts `password_expiration_enabled: bool`, `password_expiry_days: int`. |

**Go parity:** Yes (`adminuserrolemgmt/`)

---

### AdminUsersAPI

**File:** `zscaler/zia/admin_users.py`  
**Accessor:** `client.zia.admin_users`  
**Purpose:** CRUD for ZIA admin and auditor user accounts. Returns empty list for ZIdentity-migrated tenants.

| Method | Signature | Notes |
|---|---|---|
| `list_admin_users` | `(query_params=None) -> APIResult[List[AdminUser]]` | GET `/adminUsers`. Supports `page`, `page_size`, `search`, `include_auditor_users`, `include_admin_users`. |
| `get_admin_user` | `(user_id: str) -> APIResult[AdminUser]` | GET `/adminUsers/{id}`. |
| `add_admin_user` | `(name, login_name, email, password, **kwargs) -> APIResult[AdminUser]` | POST `/adminUsers`. `role_id: int` is translated to `{"role": {"id": role_id}}`. `admin_scope_type` values: `ORGANIZATION`, `DEPARTMENT`, `LOCATION`, `LOCATION_GROUP`. `scope_entity_ids: list` required for non-ORGANIZATION scopes. |
| `update_admin_user` | `(user_id: str, **kwargs) -> APIResult[AdminUser]` | PUT `/adminUsers/{id}`. Same optional kwargs as `add_admin_user`. |
| `delete_admin_user` | `(user_id: int) -> APIResult[None]` | DELETE `/adminUsers/{id}`. |
| `convert_to_user` | `(user_id: str, **kwargs) -> APIResult[UserManagement]` | POST `/adminUsers/{id}/convertToUser`. Removes admin privileges, retains the account as a regular user. |

**Go parity:** Yes (`adminuserrolemgmt/`)

---

### AdvancedSettingsAPI

**File:** `zscaler/zia/advanced_settings.py`  
**Accessor:** `client.zia.advanced_settings`  
**Purpose:** Singleton get/update for the ZIA advanced settings object covering auth bypass URLs, DNS optimization, session timeout, and HTTP/2 settings.

| Method | Signature | Notes |
|---|---|---|
| `get_advanced_settings` | `() -> APIResult[AdvancedSettings]` | GET `/advancedSettings`. |
| `update_advanced_settings` | `(**kwargs) -> APIResult[AdvancedSettings]` | PUT `/advancedSettings`. All fields are optional; pass only fields to change. |

Notable kwargs include `auth_bypass_urls`, `kerberos_bypass_urls`, `enable_office365: bool`, `ui_session_timeout: int`, `http2_nonbrowser_traffic_enabled: bool`, `block_connect_host_sni_mismatch: bool`.

**Go parity:** Yes (`advanced_settings/`)

---

### AlertSubscriptionsAPI

**File:** `zscaler/zia/alert_subscriptions.py`  
**Accessor:** `client.zia.alert_subscriptions`  
**Purpose:** CRUD for email alert subscriptions, configuring which severity levels a recipient receives per alert class.

| Method | Signature | Notes |
|---|---|---|
| `list_alert_subscriptions` | `() -> APIResult[List[AlertSubscriptions]]` | GET `/alertSubscriptions`. No pagination parameters. |
| `get_alert_subscription` | `(subscription_id: int) -> APIResult[AlertSubscriptions]` | GET `/alertSubscriptions/{id}`. |
| `add_alert_subscription` | `(**kwargs) -> APIResult[AlertSubscriptions]` | POST `/alertSubscriptions`. Key fields: `email`, `description`, per-class severity lists (`pt0_severities`, `secure_severities`, `manage_severities`, `comply_severities`, `system_severities`) each accepting values `CRITICAL`, `MAJOR`, `MINOR`, `INFO`, `DEBUG`. |
| `update_alert_subscription` | `(subscription_id: int, **kwargs) -> APIResult[AlertSubscriptions]` | PUT `/alertSubscriptions/{id}`. SDK injects `id` into body. |
| `delete_alert_subscription` | `(subscription_id: int) -> APIResult[None]` | DELETE `/alertSubscriptions/{id}`. |

**Go parity:** Yes (`alerts/`)

---

### AppTotalAPI

**File:** `zscaler/zia/apptotal.py`  
**Accessor:** `client.zia.apptotal`  
**Purpose:** Queries the AppTotal App Catalog for mobile/cloud application risk data. Supports lookup by ID or name, sandbox submission, and app-view browsing.

| Method | Signature | Notes |
|---|---|---|
| `get_app` | `(app_id: str, verbose: bool = False) -> APIResult[AppTotal]` | GET `/apps/app?appId=&verbose=`. If the app is not yet in the catalog it is submitted for analysis; a subsequent call is needed to retrieve results. |
| `scan_app` | `(app_id: str) -> APIResult[AppTotal]` | POST `/apps/app`. Explicitly submits an app to the AppTotal sandbox. |
| `search_app` | `(app_name: str) -> APIResult[AppTotalSearch]` | GET `/apps/search?appName=`. Returns up to 200 results. |
| `app_views` | `(app_view_id: str) -> APIResult[AppTotalSearch]` | GET `/app_views/{id}/apps`. Lists apps in a named app view. |

**Go parity:** Yes (`apptotal/`)

---

### ATPPolicyAPI

**File:** `zscaler/zia/atp_policy.py`  
**Accessor:** `client.zia.atp_policy`  
**Purpose:** Gets and updates Advanced Threat Protection policy settings, security exception bypass URLs, and the custom malicious URL denylist.

| Method | Signature | Notes |
|---|---|---|
| `get_atp_settings` | `() -> APIResult[AdvancedThreatProtectionSettings]` | GET `/cyberThreatProtection/advancedThreatSettings`. |
| `update_atp_settings` | `(**kwargs) -> APIResult[AdvancedThreatProtectionSettings]` | PUT same endpoint. Boolean flags per threat category (e.g. `cmd_ctl_server_blocked`, `malware_sites_blocked`, `tor_blocked`). `risk_tolerance: int` sets the maximum allowed risk score. `blocked_countries: list[str]`. |
| `get_atp_security_exceptions` | `() -> APIResult[list[str]]` | GET `/cyberThreatProtection/securityExceptions`. Returns `bypassUrls` list. |
| `update_atp_security_exceptions` | `(bypass_urls: list[str]) -> APIResult[list[str]]` | PUT same. Full replacement of the bypass list. |
| `get_atp_malicious_urls` | `() -> APIResult[list[str]]` | GET `/cyberThreatProtection/maliciousUrls`. Returns `maliciousUrls` list. |
| `add_atp_malicious_urls` | `(malicious_urls: list) -> APIResult[list[str]]` | PUT `…/maliciousUrls?action=ADD_TO_LIST`. Appends; re-fetches and returns the updated list. |
| `delete_atp_malicious_urls` | `(malicious_urls: list) -> APIResult[list[str]]` | PUT `…/maliciousUrls?action=REMOVE_FROM_LIST`. Removes; re-fetches and returns the updated list. |

**Go parity:** Yes (`advancedthreatsettings/`)

---

### AuditLogsAPI

**File:** `zscaler/zia/audit_logs.py`  
**Accessor:** `client.zia.audit_logs`  
**Purpose:** Asynchronous audit log report generation. The create/cancel/download pattern requires polling `get_status()` before calling `get_report()`.

| Method | Signature | Notes |
|---|---|---|
| `get_status` | `() -> dict` | GET `/auditlogEntryReport`. Returns raw body (not a typed tuple). |
| `create` | `(start_time: str, end_time: str) -> int` | POST `/auditlogEntryReport`. Accepts epoch ms timestamps. Sleeps 2 s internally after submission; returns HTTP status code (not a typed tuple). |
| `cancel` | `() -> int` | DELETE `/auditlogEntryReport`. Returns status code. |
| `get_report` | `() -> str` | GET `/auditlogEntryReport/download`. Returns CSV string. |

**Note:** `AuditLogsAPI` does not follow the standard `(result, response, error)` return convention — all methods return unwrapped values or `None` on error. See open question zia-sdk-01.

**Go parity:** Yes (`adminauditlogs/`)

---

### AuthenticationSettingsAPI

**File:** `zscaler/zia/authentication_settings.py`  
**Accessor:** `client.zia.authentication_settings`  
**Purpose:** Manages auth settings (SAML, Kerberos, LDAP, cookie expiry) and the cookie-authentication exemption list.

| Method | Signature | Notes |
|---|---|---|
| `get_exempted_urls` | `() -> APIResult[list[str]]` | GET `/authSettings/exemptedUrls`. Returns `urls` list. |
| `add_urls_to_exempt_list` | `(url_list: list) -> APIResult[list[str]]` | POST `/authSettings/exemptedUrls?action=ADD_TO_LIST`. Sleeps 2 s; re-fetches and returns the updated list. |
| `delete_urls_from_exempt_list` | `(url_list: list) -> APIResult[list[str]]` | POST `/authSettings/exemptedUrls?action=REMOVE_FROM_LIST`. Sleeps 2 s; re-fetches. |
| `get_authentication_settings` | `() -> APIResult[AuthenticationSettings]` | GET `/authSettings`. Full settings object. |
| `get_authentication_settings_lite` | `() -> APIResult[AuthenticationSettings]` | GET `/authSettings/lite`. Lightweight version. |
| `update_authentication_settings` | `(**kwargs) -> APIResult[AuthenticationSettings]` | PUT `/authSettings`. Key fields: `org_auth_type`, `saml_enabled: bool`, `kerberos_enabled: bool`, `auth_frequency`, `auth_custom_frequency: int` (1–180 days), `password_strength`, `password_expiry`, `auto_provision: bool`. |

**Go parity:** Yes (`user_authentication_settings/`)

---

### BandwidthClassesAPI

**File:** `zscaler/zia/bandwidth_classes.py`  
**Accessor:** `client.zia.bandwidth_classes`  
**Purpose:** CRUD for bandwidth class objects (groupings of web applications, URLs, and URL categories used in bandwidth control rules).

| Method | Signature | Notes |
|---|---|---|
| `list_classes` | `(query_params=None) -> APIResult[List[BandwidthClasses]]` | GET `/bandwidthClasses`. Supports `search` (client-side). |
| `list_classes_lite` | `() -> APIResult[List[BandwidthClasses]]` | GET `/bandwidthClasses/lite`. Name+ID only. |
| `get_class` | `(class_id: int) -> APIResult[BandwidthClasses]` | GET `/bandwidthClasses/{id}`. |
| `add_class` | `(**kwargs) -> APIResult[BandwidthClasses]` | POST `/bandwidthClasses`. Fields: `name`, `web_applications: list[str]`, `urls: list[str]`, `url_categories: list[str]`. |
| `update_class` | `(class_id: int, **kwargs) -> APIResult[BandwidthClasses]` | PUT `/bandwidthClasses/{id}`. |
| `delete_class` | `(class_id: int) -> APIResult[None]` | DELETE `/bandwidthClasses/{id}`. |

**Go parity:** Yes (`bandwidth_control/`)

---

### BandwidthControlRulesAPI

**File:** `zscaler/zia/bandwidth_control_rules.py`  
**Accessor:** `client.zia.bandwidth_control_rules`  
**Purpose:** CRUD for bandwidth control rules. Only accessible via OneAPI (not legacy API framework).

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None) -> APIResult[List[BandwidthControlRules]]` | GET `/bandwidthControlRules`. Client-side `search` filter. |
| `list_rules_lite` | `() -> APIResult[List[BandwidthControlRules]]` | GET `/bandwidthControlRules/lite`. |
| `get_rule` | `(rule_id: int) -> APIResult[BandwidthControlRules]` | GET `/bandwidthControlRules/{id}`. |
| `add_rule` | `(**kwargs) -> APIResult[BandwidthControlRules]` | POST `/bandwidthControlRules`. `enabled: bool` is translated to `state`. Key fields: `name`, `order`, `rank`, `max_bandwidth: int`, `min_bandwidth: int`, `bandwidth_class_ids: list`, `protocols: list`, `locations`, `location_groups`, `time_windows`, `labels`. |
| `update_rule` | `(rule_id: int, **kwargs) -> APIResult[BandwidthControlRules]` | PUT `/bandwidthControlRules/{id}`. SDK injects `id` into body. |
| `delete_rule` | `(rule_id: int) -> APIResult[None]` | DELETE `/bandwidthControlRules/{id}`. |

**Go parity:** Yes (`bandwidth_control/`)

---

### BrowserControlSettingsPI

**File:** `zscaler/zia/browser_control_settings.py`  
**Accessor:** `client.zia.browser_control_settings`  
**Purpose:** Singleton get/update for browser control settings. Class name has a typo (`PI` not `API`) — see open question zia-sdk-02.

| Method | Signature | Notes |
|---|---|---|
| `get_browser_control_settings` | `() -> APIResult[BrowserControlSettings]` | GET `/browserControl`. |
| `update_browser_control_settings` | `(**kwargs) -> APIResult[BrowserControlSettings]` | PUT `/browserControl`. |

**Go parity:** Yes (`browser_control_settings/`)

---

### CasbdDlpRulesAPI

**File:** `zscaler/zia/casb_dlp_rules.py`  
**Accessor:** `client.zia.casb_dlp_rules`  
**Purpose:** CRUD for CASB DLP rules that apply to SaaS applications.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None) -> APIResult[List]` | GET `/casbDlpRules`. |
| `get_rule` | `(rule_id: int)` | GET `/casbDlpRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/casbDlpRules`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/casbDlpRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/casbDlpRules/{id}`. |

**Go parity:** No (not found in Go SDK services list)

---

### CasbMalwareRulesAPI

**File:** `zscaler/zia/casb_malware_rules.py`  
**Accessor:** `client.zia.casb_malware_rules`  
**Purpose:** CRUD for CASB malware scanning rules applied to SaaS applications.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None)` | GET `/casbMalwareRules`. |
| `get_rule` | `(rule_id: int)` | GET `/casbMalwareRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/casbMalwareRules`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/casbMalwareRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/casbMalwareRules/{id}`. |

**Go parity:** No

---

### CBIProfileAPI

**File:** `zscaler/zia/cloud_browser_isolation.py`  
**Accessor:** `client.zia.cloud_browser_isolation`  
**Purpose:** Read-only listing of Cloud Browser Isolation (CBI) profiles for use in URL filtering rules.

| Method | Signature | Notes |
|---|---|---|
| `list_isolation_profiles` | `(query_params=None) -> APIResult[List[CBIProfile]]` | GET `/browserIsolation/profiles`. Supports `search`. |
| `get_isolation_profile` | `(profile_id)` | GET `/browserIsolation/profiles/{id}`. |

**Go parity:** Yes (`browser_isolation/`)

---

### CloudAppControlAPI

**File:** `zscaler/zia/cloudappcontrol.py`  
**Accessor:** `client.zia.cloudappcontrol`  
**Purpose:** CRUD for Cloud App Control rules (formerly Web Application Rules). Supports listing available actions per rule type.

| Method | Signature | Notes |
|---|---|---|
| `list_available_actions` | `(rule_type: str, cloud_apps: list) -> APIResult[list[str]]` | POST `/webApplicationRules/{rule_type}/availableActions`. |
| `list_rules` | `(rule_type: str, query_params=None)` | GET `/webApplicationRules/{rule_type}`. |
| `get_rule` | `(rule_type: str, rule_id: int)` | GET `/webApplicationRules/{rule_type}/{id}`. |
| `add_rule` | `(rule_type: str, **kwargs)` | POST `/webApplicationRules/{rule_type}`. |
| `update_rule` | `(rule_type: str, rule_id: int, **kwargs)` | PUT `/webApplicationRules/{rule_type}/{id}`. |
| `delete_rule` | `(rule_type: str, rule_id: int)` | DELETE `/webApplicationRules/{rule_type}/{id}`. |

`rule_type` values include `STREAMING_MEDIA`, `SOCIAL_NETWORKING`, `OFFICE_PROGRAMS`, and others per the Zscaler API.

**Go parity:** Yes (`cloudappcontrol/`)

---

### CloudApplicationInstancesAPI

**File:** `zscaler/zia/cloud_app_instances.py`  
**Accessor:** `client.zia.cloud_app_instances`  
**Purpose:** Lists and manages cloud application tenant instances for application isolation policies.

| Method | Signature | Notes |
|---|---|---|
| `list_app_instances` | `(query_params=None)` | GET `/cloudApplicationInstances`. |
| `get_app_instance` | `(instance_id: int)` | GET `/cloudApplicationInstances/{id}`. |
| `add_app_instance` | `(**kwargs)` | POST `/cloudApplicationInstances`. |
| `update_app_instance` | `(instance_id: int, **kwargs)` | PUT `/cloudApplicationInstances/{id}`. |
| `delete_app_instance` | `(instance_id: int)` | DELETE `/cloudApplicationInstances/{id}`. |

**Go parity:** Yes (`cloud_app_instances/`)

---

### CloudApplicationsAPI

**File:** `zscaler/zia/cloud_applications.py`  
**Accessor:** `client.zia.cloud_applications`  
**Purpose:** Read-only catalog of predefined and visible cloud applications. Used for reference when building policies.

| Method | Signature | Notes |
|---|---|---|
| `list_cloud_applications` | `(query_params=None)` | GET `/cloudApplications`. |
| `get_cloud_application` | `(app_id)` | GET `/cloudApplications/{id}`. |

**Go parity:** Yes (`cloudapplications/`)

---

### CloudNSSAPI

**File:** `zscaler/zia/cloud_nss.py`  
**Accessor:** `client.zia.cloud_nss`  
**Purpose:** CRUD for Cloud NSS (Nanolog Streaming Service) feeds. Supports connectivity testing.

| Method | Signature | Notes |
|---|---|---|
| `list_nss_feed` | `(query_params=None) -> APIResult[List[NssFeeds]]` | GET `/nssFeeds`. Supports `feed_type` param. |
| `get_nss_feed` | `(feed_id: int)` | GET `/nssFeeds/{id}`. |
| `add_nss_feed` | `(**kwargs)` | POST `/nssFeeds`. |
| `update_nss_feed` | `(feed_id: int, **kwargs)` | PUT `/nssFeeds/{id}`. |
| `delete_nss_feed` | `(feed_id: int)` | DELETE `/nssFeeds/{id}`. |
| `test_nss_connectivity` | `(**kwargs) -> APIResult[NSSTestConnectivity]` | POST `/nssFeeds/testConnectivity`. |

**Go parity:** Yes (`cloudnss/`)

---

### CloudToCloudIRAPI

**File:** `zscaler/zia/cloud_to_cloud_ir.py`  
**Accessor:** `client.zia.cloud_to_cloud_ir`  
**Purpose:** Manages Cloud-to-Cloud Incident Receiver configuration for SaaS security integrations.

| Method | Signature | Notes |
|---|---|---|
| `list_c2c_ir` | `(query_params=None)` | GET `/cloud2cloudIncidentReceiver`. |
| `get_c2c_ir` | `(ir_id: int)` | GET `/cloud2cloudIncidentReceiver/{id}`. |
| `add_c2c_ir` | `(**kwargs)` | POST `/cloud2cloudIncidentReceiver`. |
| `update_c2c_ir` | `(ir_id: int, **kwargs)` | PUT `/cloud2cloudIncidentReceiver/{id}`. |
| `delete_c2c_ir` | `(ir_id: int)` | DELETE `/cloud2cloudIncidentReceiver/{id}`. |

**Go parity:** Yes (`c2c_incident_receiver/`)

---

### CustomFileTypesAPI

**File:** `zscaler/zia/custom_file_types.py`  
**Accessor:** `client.zia.custom_file_types`  
**Purpose:** CRUD for custom file type definitions used in file type control rules.

| Method | Signature | Notes |
|---|---|---|
| `list_custom_file_types` | `(query_params=None)` | GET `/customFileTypes`. |
| `get_custom_file_type` | `(type_id: int)` | GET `/customFileTypes/{id}`. |
| `add_custom_file_type` | `(**kwargs)` | POST `/customFileTypes`. |
| `update_custom_file_type` | `(type_id: int, **kwargs)` | PUT `/customFileTypes/{id}`. |
| `delete_custom_file_type` | `(type_id: int)` | DELETE `/customFileTypes/{id}`. |

**Go parity:** No (not found in Go SDK services list)

---

### DedicatedIPGatewaysAPI

**File:** `zscaler/zia/dedicated_ip_gateways.py`  
**Accessor:** `client.zia.dedicated_ip_gateways`  
**Purpose:** Lists and manages dedicated IP gateways (static egress IPs assigned to locations).

| Method | Signature | Notes |
|---|---|---|
| `list_dedicated_ip_gateways` | `(query_params=None)` | GET `/dedicatedIpGateways`. |
| `get_dedicated_ip_gateway` | `(gw_id: int)` | GET `/dedicatedIpGateways/{id}`. |
| `add_dedicated_ip_gateway` | `(**kwargs)` | POST `/dedicatedIpGateways`. |
| `update_dedicated_ip_gateway` | `(gw_id: int, **kwargs)` | PUT `/dedicatedIpGateways/{id}`. |
| `delete_dedicated_ip_gateway` | `(gw_id: int)` | DELETE `/dedicatedIpGateways/{id}`. |

**Go parity:** No

---

### DeviceManagementAPI

**File:** `zscaler/zia/device_management.py`  
**Accessor:** `client.zia.device_management`  
**Purpose:** Reads device groups and device records. Primarily read-only.

| Method | Signature | Notes |
|---|---|---|
| `list_device_groups` | `(query_params=None)` | GET `/deviceGroups`. |
| `list_devices` | `(query_params=None)` | GET `/deviceGroups/devices`. |

**Go parity:** Yes (`devicegroups/`)

---

### DLPDictionaryAPI

**File:** `zscaler/zia/dlp_dictionary.py`  
**Accessor:** `client.zia.dlp_dictionary`  
**Purpose:** CRUD for DLP dictionaries (custom phrase/pattern libraries). Includes pattern validation and predefined-identifier lookup.

| Method | Signature | Notes |
|---|---|---|
| `list_dicts` | `(query_params=None) -> APIResult[List[DLPDictionary]]` | GET `/dlpDictionaries`. Supports `search` server-side. |
| `list_dicts_lite` | `(query_params=None) -> APIResult[List[DLPDictionary]]` | GET `/dlpDictionaries/lite`. Client-side `search`. |
| `get_dict` | `(dict_id: int) -> APIResult[DLPDictionary]` | GET `/dlpDictionaries/{id}`. |
| `add_dict` | `(name, custom_phrase_match_type, dictionary_type, **kwargs) -> APIResult[DLPDictionary]` | POST `/dlpDictionaries`. `phrases: list[tuple(action, phrase)]` and `patterns: list[tuple(action, pattern)]` are accepted as Python tuples and converted to the API shape `[{"action": ..., "phrase": ...}]`. |
| `update_dict` | `(dict_id: int, **kwargs) -> APIResult[DLPDictionary]` | PUT `/dlpDictionaries/{id}`. Same tuple format for phrases/patterns. |
| `delete_dict` | `(dict_id: str) -> APIResult[None]` | DELETE `/dlpDictionaries/{id}`. |
| `validate_dict` | `(pattern: str) -> APIResult[DLPPatternValidation]` | POST `/dlpDictionaries/validateDlpPattern`. Validation reliability is noted as uncertain in source code comments. |
| `list_dict_predefined_identifiers` | `(dict_name: str) -> APIResult[list]` | GET `/dlpDictionaries/{id}/predefinedIdentifiers`. Resolves name to ID first via `list_dicts()`. Supported names: `ASPP_LEAKAGE`, `CRED_LEAKAGE`, `EUIBAN_LEAKAGE`, `PPEU_LEAKAGE`, `USDL_LEAKAGE`. |

**Go parity:** Yes (`dlp/`)

---

### DLPEngineAPI

**File:** `zscaler/zia/dlp_engine.py`  
**Accessor:** `client.zia.dlp_engine`  
**Purpose:** CRUD for DLP engines. Supports expression validation.

| Method | Signature | Notes |
|---|---|---|
| `list_dlp_engines` | `(query_params=None) -> APIResult[List[DLPEngine]]` | GET `/dlpEngines`. Supports `search`. |
| `list_dlp_engines_lite` | `(query_params=None)` | GET `/dlpEngines/lite`. |
| `get_dlp_engine` | `(engine_id: int)` | GET `/dlpEngines/{id}`. |
| `add_dlp_engine` | `(**kwargs)` | POST `/dlpEngines`. |
| `update_dlp_engine` | `(engine_id: int, **kwargs)` | PUT `/dlpEngines/{id}`. |
| `delete_dlp_engine` | `(engine_id: int)` | DELETE `/dlpEngines/{id}`. |
| `validate_dlp_expression` | `(**kwargs) -> APIResult[DLPVAlidateExpression]` | POST `/dlpEngines/validateDlpExpr`. |

**Go parity:** Yes (`dlp/`)

---

### DLPResourcesAPI

**File:** `zscaler/zia/dlp_resources.py`  
**Accessor:** `client.zia.dlp_resources`  
**Purpose:** Read-only listing of DLP incident receiver and ICAP server resources used in web DLP rules.

| Method | Signature | Notes |
|---|---|---|
| `list_icap_servers` | `(query_params=None)` | GET `/icapServers`. |
| `get_icap_server` | `(server_id: int)` | GET `/icapServers/{id}`. |
| `list_incident_receiver_servers` | `(query_params=None)` | GET `/incidentReceiverServers`. |
| `get_incident_receiver_server` | `(server_id: int)` | GET `/incidentReceiverServers/{id}`. |
| `list_idm_profiles` | `(query_params=None)` | GET `/idmprofile`. |
| `get_idm_profile` | `(profile_id: int)` | GET `/idmprofile/{id}`. |

**Go parity:** Partial (Go has `dlp/` but IDM/ICAP mapping is unclear)

---

### DLPTemplatesAPI

**File:** `zscaler/zia/dlp_templates.py`  
**Accessor:** `client.zia.dlp_templates`  
**Purpose:** CRUD for DLP notification templates (email templates sent to users or auditors on policy match).

| Method | Signature | Notes |
|---|---|---|
| `list_dlp_templates` | `(query_params=None) -> APIResult[List[DLPTemplates]]` | GET `/dlpNotificationTemplates`. Client-side `search`. |
| `get_dlp_template` | `(template_id: int)` | GET `/dlpNotificationTemplates/{id}`. |
| `add_dlp_template` | `(**kwargs)` | POST `/dlpNotificationTemplates`. |
| `update_dlp_template` | `(template_id: int, **kwargs)` | PUT `/dlpNotificationTemplates/{id}`. |
| `delete_dlp_template` | `(template_id: int)` | DELETE `/dlpNotificationTemplates/{id}`. |

**Go parity:** Yes (`dlp/`)

---

### DLPWebRuleAPI

**File:** `zscaler/zia/dlp_web_rules.py`  
**Accessor:** `client.zia.dlp_web_rules`  
**Purpose:** CRUD for web DLP policy rules. Not applicable to SaaS Security API DLP rules.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None) -> APIResult[List[DLPWebRules]]` | GET `/webDlpRules`. Client-side `search`. |
| `list_rules_lite` | `(query_params=None)` | GET `/webDlpRules/lite`. |
| `get_rule` | `(rule_id: int) -> APIResult[DLPWebRules]` | GET `/webDlpRules/{id}`. |
| `add_rule` | `(**kwargs) -> APIResult[DLPWebRules]` | POST `/webDlpRules`. `enabled` bool translated to `state`. Key fields: `name`, `action`, `order`, `rank`, `dlp_engines`, `file_types`, `departments`, `groups`, `users`, `locations`, `location_groups`, `time_windows`, `labels`, `url_categories`, `ocr_enabled: bool`, `without_content_inspection: bool`, `min_size`. |
| `update_rule` | `(rule_id: str, **kwargs) -> APIResult[DLPWebRules]` | PUT `/webDlpRules/{id}`. |
| `delete_rule` | `(rule_id: int) -> APIResult[None]` | DELETE `/webDlpRules/{id}`. |

**Go parity:** Yes (`dlp/`)

---

### DNSGatewayAPI

**File:** `zscaler/zia/dns_gatways.py` (note: filename has typo — `gatways`)  
**Accessor:** `client.zia.dns_gateways`  
**Purpose:** Manages DNS gateway configurations. See open question zia-sdk-03.

| Method | Signature | Notes |
|---|---|---|
| `list_dns_gateways` | `(query_params=None)` | GET `/dnsGateway`. |
| `get_dns_gateway` | `(gw_id: int)` | GET `/dnsGateway/{id}`. |
| `add_dns_gateway` | `(**kwargs)` | POST `/dnsGateway`. |
| `update_dns_gateway` | `(gw_id: int, **kwargs)` | PUT `/dnsGateway/{id}`. |
| `delete_dns_gateway` | `(gw_id: int)` | DELETE `/dnsGateway/{id}`. |

**Go parity:** No

---

### EndUserNotificationAPI

**File:** `zscaler/zia/end_user_notification.py`  
**Accessor:** `client.zia.end_user_notification`  
**Purpose:** Singleton get/update for the end-user block/notification page settings.

| Method | Signature | Notes |
|---|---|---|
| `get_eun_settings` | `() -> APIResult[EndUserNotification]` | GET `/eun`. |
| `update_eun_settings` | `(**kwargs) -> APIResult[EndUserNotification]` | PUT `/eun`. |

**Go parity:** Yes (`end_user_notification/`)

---

### FileTypeControlRuleAPI

**File:** `zscaler/zia/file_type_control_rule.py`  
**Accessor:** `client.zia.file_type_control_rule`  
**Purpose:** CRUD for file type control rules (block or allow by MIME type/extension).

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None)` | GET `/fileTypeControlRules`. |
| `list_rules_lite` | `()` | GET `/fileTypeControlRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/fileTypeControlRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/fileTypeControlRules`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/fileTypeControlRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/fileTypeControlRules/{id}`. |

**Go parity:** Yes (`filetypecontrol/`)

---

### FirewallResourcesAPI

**File:** `zscaler/zia/cloud_firewall.py`  
**Accessor:** `client.zia.cloud_firewall`  
**Purpose:** CRUD for cloud firewall resource objects: IP destination groups, IP source groups, network application groups, network applications (read-only), network service groups, network services, and time windows.

| Method | Signature | Notes |
|---|---|---|
| `list_ip_destination_groups` | `(exclude_type=None, query_params=None)` | GET `/ipDestinationGroups`. `exclude_type` values: `DSTN_IP`, `DSTN_FQDN`, `DSTN_DOMAIN`, `DSTN_OTHER`. |
| `list_ipv6_destination_groups` | `(query_params=None)` | GET `/ipv6DestinationGroups`. |
| `list_ip_destination_groups_lite` | `()` | GET `/ipDestinationGroups/lite`. |
| `get_ip_destination_group` | `(group_id: int)` | GET `/ipDestinationGroups/{id}`. |
| `add_ip_destination_group` | `(**kwargs)` | POST `/ipDestinationGroups`. |
| `update_ip_destination_group` | `(group_id: str, **kwargs)` | PUT `/ipDestinationGroups/{id}`. |
| `delete_ip_destination_group` | `(group_id: int)` | DELETE `/ipDestinationGroups/{id}`. |
| `list_ip_source_groups` | `(query_params=None)` | GET `/ipSourceGroups`. |
| `list_ipv6_source_groups` | `(query_params=None)` | GET `/ipv6SourceGroups`. |
| `list_ip_source_groups_lite` | `()` | GET `/ipSourceGroups/lite`. |
| `get_ip_source_group` | `(group_id)` | GET `/ipSourceGroups/{id}`. |
| `add_ip_source_group` | `(**kwargs)` | POST `/ipSourceGroups`. |
| `update_ip_source_group` | `(group_id: int, **kwargs)` | PUT `/ipSourceGroups/{id}`. |
| `delete_ip_source_group` | `(group_id: int)` | DELETE `/ipSourceGroups/{id}`. |
| `list_network_app_groups` | `(query_params=None)` | GET `/networkApplicationGroups`. |
| `get_network_app_group` | `(group_id)` | GET `/networkApplicationGroups/{id}`. |
| `add_network_app_group` | `(**kwargs)` | POST `/networkApplicationGroups`. |
| `update_network_app_group` | `(group_id: int, **kwargs)` | PUT `/networkApplicationGroups/{id}`. |
| `delete_network_app_group` | `(group_id)` | DELETE `/networkApplicationGroups/{id}`. |
| `list_network_apps` | `(query_params=None)` | GET `/networkApplications`. Read-only. |
| `get_network_app` | `(app_id: int)` | GET `/networkApplications/{id}`. |
| `list_network_svc_groups` | `(query_params=None)` | GET `/networkServiceGroups`. |
| `list_network_svc_groups_lite` | `()` | GET `/networkServiceGroups/lite`. |
| `get_network_svc_group` | `(group_id: int)` | GET `/networkServiceGroups/{id}`. |
| `add_network_svc_group` | `(**kwargs)` | POST `/networkServiceGroups`. |
| `update_network_svc_group` | `(group_id: int, **kwargs)` | PUT `/networkServiceGroups/{id}`. |
| `delete_network_svc_group` | `(group_id)` | DELETE `/networkServiceGroups/{id}`. |
| `list_network_services` | `(query_params=None)` | GET `/networkServices`. |
| `list_network_services_lite` | `(query_params=None)` | GET `/networkServices/lite`. |
| `get_network_service` | `(service_id: int)` | GET `/networkServices/{id}`. |
| `add_network_service` | `(ports=None, **kwargs)` | POST `/networkServices`. `ports` is a list of port range dicts. |
| `update_network_service` | `(service_id: str, ports=None, **kwargs)` | PUT `/networkServices/{id}`. |
| `delete_network_service` | `(service_id: int)` | DELETE `/networkServices/{id}`. |
| `list_time_windows` | `()` | GET `/timeWindows`. |
| `list_time_windows_lite` | `()` | GET `/timeWindows/lite`. |

**Go parity:** Yes (`firewallpolicies/`, `firewalldnscontrolpolicies/`, `firewallipscontrolpolicies/`)

---

### FirewallPolicyAPI

**File:** `zscaler/zia/cloud_firewall_rules.py`  
**Accessor:** `client.zia.cloud_firewall_rules`  
**Purpose:** CRUD for cloud firewall filter rules.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None) -> APIResult[List[FirewallRule]]` | GET `/firewallFilteringRules`. Rich filter params: `rule_name`, `rule_label`, `rule_order`, `rule_action`, `location`, `department`, `group`, `user`, `device`, `src_ips`, `dest_addresses`, `src_ip_groups`, `dest_ip_groups`, `nw_application`, `nw_services`, etc. |
| `list_rules_lite` | `()` | GET `/firewallFilteringRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/firewallFilteringRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/firewallFilteringRules`. `enabled` bool translated to `state`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/firewallFilteringRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/firewallFilteringRules/{id}`. |

**Go parity:** Yes (`firewallpolicies/`)

---

### FirewallDNSRulesAPI

**File:** `zscaler/zia/cloud_firewall_dns.py`  
**Accessor:** `client.zia.cloud_firewall_dns`  
**Purpose:** CRUD for firewall DNS control policy rules.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None) -> APIResult[List[FirewallDNSRules]]` | GET `/firewallDnsRules`. Client-side `search`. |
| `list_rules_lite` | `()` | GET `/firewallDnsRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/firewallDnsRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/firewallDnsRules`. `enabled` bool translated to `state`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/firewallDnsRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/firewallDnsRules/{id}`. |

**Go parity:** Yes (`firewalldnscontrolpolicies/`)

---

### FirewallIPSRulesAPI

**File:** `zscaler/zia/cloud_firewall_ips.py`  
**Accessor:** `client.zia.cloud_firewall_ips`  
**Purpose:** CRUD for firewall IPS (Intrusion Prevention System) control policy rules.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None) -> APIResult[List[FirewallIPSrules]]` | GET `/firewallIpsRules`. Client-side `search`. |
| `list_rules_lite` | `()` | GET `/firewallIpsRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/firewallIpsRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/firewallIpsRules`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/firewallIpsRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/firewallIpsRules/{id}`. |

**Go parity:** Yes (`firewallipscontrolpolicies/`)

---

### ForwardingControlAPI

**File:** `zscaler/zia/forwarding_control.py`  
**Accessor:** `client.zia.forwarding_control`  
**Purpose:** CRUD for forwarding control rules (determines how traffic is forwarded: direct, proxy chaining, ZPA, etc.).

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None) -> APIResult[List[ForwardingControlRule]]` | GET `/forwardingRules`. Client-side `search`. |
| `list_rules_lite` | `()` | GET `/forwardingRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/forwardingRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/forwardingRules`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/forwardingRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/forwardingRules/{id}`. |

**Go parity:** Yes (`forwarding_control_policy/`)

---

### FTPControlPolicyAPI

**File:** `zscaler/zia/ftp_control_policy.py`  
**Accessor:** `client.zia.ftp_control_policy`  
**Purpose:** CRUD for FTP control policy rules.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None)` | GET `/ftpRules`. Client-side `search`. |
| `list_rules_lite` | `()` | GET `/ftpRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/ftpRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/ftpRules`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/ftpRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/ftpRules/{id}`. |

**Go parity:** Yes (`ftp_control_policy/`)

---

### TrafficForwardingGRETunnelAPI

**File:** `zscaler/zia/gre_tunnel.py`  
**Accessor:** `client.zia.gre_tunnel`  
**Purpose:** CRUD for GRE tunnels plus helper lookups: recommended VIPs, VIP info, and tunnel-within-location queries.

| Method | Signature | Notes |
|---|---|---|
| `list_gre_tunnels` | `(query_params=None) -> APIResult[List[TrafficGRETunnel]]` | GET `/greTunnels`. Supports `page`, `page_size`. |
| `get_gre_tunnel` | `(tunnel_id: int)` | GET `/greTunnels/{id}`. |
| `add_gre_tunnel` | `(**kwargs)` | POST `/greTunnels`. |
| `update_gre_tunnel` | `(tunnel_id: int, **kwargs)` | PUT `/greTunnels/{id}`. |
| `delete_gre_tunnel` | `(tunnel_id: int)` | DELETE `/greTunnels/{id}`. |
| `get_recommended_vips` | `(**kwargs)` | GET `/vips/recommendedList`. |
| `list_vips` | `(query_params=None)` | GET `/vips`. |
| `list_vips_by_datacenter` | `(query_params=None)` | GET `/vips/groupByDatacenter`. |
| `get_gre_tunnel_info` | `(tunnel_id)` | GET `/greTunnels/{id}/info`. |

**Go parity:** Yes (`trafficforwarding/`)

---

### IntermediateCertsAPI

**File:** `zscaler/zia/intermediate_certificates.py`  
**Accessor:** `client.zia.intermediate_certificates`  
**Purpose:** CRUD for intermediate CA certificates used in SSL inspection.

| Method | Signature | Notes |
|---|---|---|
| `list_intermediate_certs` | `(query_params=None)` | GET `/intermediateCaCertificate`. |
| `list_intermediate_certs_lite` | `()` | GET `/intermediateCaCertificate/lite`. |
| `get_intermediate_cert` | `(cert_id: int)` | GET `/intermediateCaCertificate/{id}`. |
| `add_intermediate_cert` | `(**kwargs)` | POST `/intermediateCaCertificate`. |
| `update_intermediate_cert` | `(cert_id: int, **kwargs)` | PUT `/intermediateCaCertificate/{id}`. |
| `delete_intermediate_cert` | `(cert_id: int)` | DELETE `/intermediateCaCertificate/{id}`. |
| `verify_intermediate_cert` | `(cert_id: int)` | POST `/intermediateCaCertificate/{id}/verify`. |
| `get_csr` | `(**kwargs)` | POST `/intermediateCaCertificate/csr`. |
| `sign_cert` | `(cert_id: int, **kwargs)` | POST `/intermediateCaCertificate/{id}/attachSignedCertificate`. |

**Go parity:** Yes (`intermediatecacertificates/`)

---

### IOTReportAPI

**File:** `zscaler/zia/iot_report.py`  
**Accessor:** `client.zia.iot_report`  
**Purpose:** Read-only IoT device discovery reporting.

| Method | Signature | Notes |
|---|---|---|
| `get_iot_report` | `(query_params=None)` | GET `/iotDiscovery/devices`. |

**Go parity:** Yes (`iotreport/`)

---

### TrafficIPV6ConfigAPI

**File:** `zscaler/zia/ipv6_config.py`  
**Accessor:** `client.zia.ipv6_config`  
**Purpose:** Singleton get/update for IPv6 traffic forwarding configuration.

| Method | Signature | Notes |
|---|---|---|
| `get_ipv6_config` | `()` | GET `/ipv6config`. |
| `update_ipv6_config` | `(**kwargs)` | PUT `/ipv6config`. |
| `list_dns64_prefixes` | `(query_params=None)` | GET `/ipv6config/dns64prefix`. |

**Go parity:** No

---

### LocationsAPI

**File:** `zscaler/zia/locations.py`  
**Accessor:** `client.zia.locations`  
**Purpose:** CRUD for locations and location groups. Locations represent branch offices, data centers, or other network segments.

| Method | Signature | Notes |
|---|---|---|
| `list_locations` | `(query_params=None) -> APIResult[List[LocationManagement]]` | GET `/locations`. Supports `page`, `page_size`, `search`, `ssl_scan_enabled`, `xff_enabled`, `auth_required`, `bw_enforced`, `enable_iot`. |
| `list_locations_lite` | `(query_params=None)` | GET `/locations/lite`. |
| `get_location` | `(location_id: int)` | GET `/locations/{id}`. |
| `add_location` | `(**kwargs)` | POST `/locations`. |
| `update_location` | `(location_id: int, **kwargs)` | PUT `/locations/{id}`. |
| `delete_location` | `(location_id: int)` | DELETE `/locations/{id}`. |
| `bulk_delete_locations` | `(location_ids: list)` | POST `/locations/bulkDelete`. |
| `list_location_groups` | `(query_params=None)` | GET `/locationGroup`. |
| `list_location_groups_lite` | `()` | GET `/locationGroup/lite`. |
| `get_location_group` | `(group_id: int)` | GET `/locationGroup/{id}`. |
| `add_location_group` | `(**kwargs)` | POST `/locationGroup`. |
| `update_location_group` | `(group_id: int, **kwargs)` | PUT `/locationGroup/{id}`. |
| `delete_location_group` | `(group_id: int)` | DELETE `/locationGroup/{id}`. |
| `list_regions` | `(query_params=None)` | GET `/region/city`. Returns `RegionInfo`. |

**Go parity:** Yes (`location/`)

---

### MalwareProtectionPolicyAPI

**File:** `zscaler/zia/malware_protection_policy.py`  
**Accessor:** `client.zia.malware_protection_policy`  
**Purpose:** Singleton get/update for malware protection policy settings and URL/IP exception lists.

| Method | Signature | Notes |
|---|---|---|
| `get_malware_settings` | `()` | GET `/malwareProtection`. |
| `update_malware_settings` | `(**kwargs)` | PUT `/malwareProtection`. |
| `get_malware_policy` | `()` | GET `/malwareProtection/policy`. |
| `update_malware_policy` | `(**kwargs)` | PUT `/malwareProtection/policy`. |

**Go parity:** Yes (`malware_protection/`)

---

### MobileAdvancedSettingsAPI

**File:** `zscaler/zia/mobile_threat_settings.py`  
**Accessor:** `client.zia.mobile_threat_settings`  
**Purpose:** Singleton get/update for mobile threat defense advanced settings.

| Method | Signature | Notes |
|---|---|---|
| `get_mobile_settings` | `()` | GET `/mobileAdvancedThreatSettings`. |
| `update_mobile_settings` | `(**kwargs)` | PUT `/mobileAdvancedThreatSettings`. |

**Go parity:** Yes (`mobile_threat_settings/`)

---

### NatControlPolicyAPI

**File:** `zscaler/zia/nat_control_policy.py`  
**Accessor:** `client.zia.nat_control_policy`  
**Purpose:** CRUD for NAT control policy rules.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None)` | GET `/natRules`. Client-side `search`. |
| `list_rules_lite` | `()` | GET `/natRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/natRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/natRules`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/natRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/natRules/{id}`. |

**Go parity:** Yes (`nat_control_policies/`)

---

### NssServersAPI

**File:** `zscaler/zia/nss_servers.py`  
**Accessor:** `client.zia.nss_servers`  
**Purpose:** Lists NSS server objects (on-premises Nanolog Streaming Service servers).

| Method | Signature | Notes |
|---|---|---|
| `list_nss_servers` | `(query_params=None)` | GET `/nssServers`. |
| `get_nss_server` | `(server_id: int)` | GET `/nssServers/{id}`. |

**Go parity:** No (separate from Cloud NSS)

---

### OrganizationInformationAPI

**File:** `zscaler/zia/organization_information.py`  
**Accessor:** `client.zia.organization_information`  
**Purpose:** Read-only retrieval of organization details (tenant name, ID, locale settings).

| Method | Signature | Notes |
|---|---|---|
| `get_org_information` | `()` | GET `/orgInformation`. |
| `get_org_information_lite` | `()` | GET `/orgInformation/lite`. |

**Go parity:** Yes (`organization_details/`)

---

### PacFilesAPI

**File:** `zscaler/zia/pac_files.py`  
**Accessor:** `client.zia.pac_files`  
**Purpose:** CRUD for hosted PAC (Proxy Auto-Config) files. Includes validation.

| Method | Signature | Notes |
|---|---|---|
| `list_pac_files` | `(query_params=None)` | GET `/pacFiles`. Supports `search`, `filter` (e.g. `pac_content` to exclude file body). |
| `get_pac_file` | `(pac_id: int)` | GET `/pacFiles/{id}`. |
| `add_pac_file` | `(**kwargs)` | POST `/pacFiles`. |
| `update_pac_file` | `(pac_id: int, **kwargs)` | PUT `/pacFiles/{id}`. |
| `delete_pac_file` | `(pac_id: int)` | DELETE `/pacFiles/{id}`. |
| `validate_pac_file` | `(**kwargs) -> APIResult[PacFileValidationResponse]` | POST `/pacFiles/validate`. |
| `clone_pac_file` | `(pac_id: int)` | POST `/pacFiles/{id}/clone`. |

**Go parity:** Yes (`pacfiles/`)

---

### PolicyExportAPI

**File:** `zscaler/zia/policy_export.py`  
**Accessor:** `client.zia.policy_export`  
**Purpose:** Exports ZIA policy configuration as a JSON document.

| Method | Signature | Notes |
|---|---|---|
| `export_config` | `(query_params=None)` | GET `/policyExport`. Optionally filtered by policy resource type. |

**Go parity:** Yes (`policy_export/`)

---

### ProxiesAPI

**File:** `zscaler/zia/proxies.py`  
**Accessor:** `client.zia.proxies`  
**Purpose:** Lists proxy gateway definitions and manages proxy chaining configurations.

| Method | Signature | Notes |
|---|---|---|
| `list_proxy_gateways` | `()` | GET `/proxyGateways`. |
| `list_proxies` | `(query_params=None)` | GET `/proxies`. |
| `get_proxy` | `(proxy_id: int)` | GET `/proxies/{id}`. |
| `add_proxy` | `(**kwargs)` | POST `/proxies`. |
| `update_proxy` | `(proxy_id: int, **kwargs)` | PUT `/proxies/{id}`. |
| `delete_proxy` | `(proxy_id: int)` | DELETE `/proxies/{id}`. |

**Go parity:** No (proxies not found in Go SDK services list)

---

### RemoteAssistanceAPI

**File:** `zscaler/zia/remote_assistance.py`  
**Accessor:** `client.zia.remote_assistance`  
**Purpose:** Singleton get/update for remote assistance settings (allows Zscaler support to access the tenant).

| Method | Signature | Notes |
|---|---|---|
| `get_remote_assistance` | `()` | GET `/remoteAssistance`. |
| `update_remote_assistance` | `(**kwargs)` | PUT `/remoteAssistance`. |

**Go parity:** Yes (`remote_assistance/`)

---

### RiskProfilesAPI

**File:** `zscaler/zia/risk_profiles.py`  
**Accessor:** `client.zia.risk_profiles`  
**Purpose:** CRUD for user risk profiles used in dynamic access control.

| Method | Signature | Notes |
|---|---|---|
| `list_risk_profiles` | `(query_params=None)` | GET `/riskProfiles`. |
| `get_risk_profile` | `(profile_id: int)` | GET `/riskProfiles/{id}`. |
| `add_risk_profile` | `(**kwargs)` | POST `/riskProfiles`. |
| `update_risk_profile` | `(profile_id: int, **kwargs)` | PUT `/riskProfiles/{id}`. |
| `delete_risk_profile` | `(profile_id: int)` | DELETE `/riskProfiles/{id}`. |

**Go parity:** No

---

### RuleLabelsAPI

**File:** `zscaler/zia/rule_labels.py`  
**Accessor:** `client.zia.rule_labels`  
**Purpose:** CRUD for rule label objects (arbitrary tags attachable to any policy rule).

| Method | Signature | Notes |
|---|---|---|
| `list_labels` | `(query_params=None)` | GET `/ruleLabels`. Supports `page`, `page_size`, `search`. |
| `list_labels_lite` | `()` | GET `/ruleLabels/lite`. |
| `get_label` | `(label_id: int)` | GET `/ruleLabels/{id}`. |
| `add_label` | `(**kwargs)` | POST `/ruleLabels`. Fields: `name`, `description`. |
| `update_label` | `(label_id: int, **kwargs)` | PUT `/ruleLabels/{id}`. |
| `delete_label` | `(label_id: int)` | DELETE `/ruleLabels/{id}`. |

**Go parity:** Yes (`rule_labels/`)

---

### SaaSSecurityAPI

**File:** `zscaler/zia/saas_security_api.py`  
**Accessor:** `client.zia.saas_security_api`  
**Purpose:** Manages SaaS Security API DLP policy rules, which are distinct from standard web DLP rules.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None)` | GET `/saasSecurityDlpRules`. |
| `get_rule` | `(rule_id: int)` | GET `/saasSecurityDlpRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/saasSecurityDlpRules`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/saasSecurityDlpRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/saasSecurityDlpRules/{id}`. |

**Go parity:** Yes (`saas_security_api/`)

---

### CloudSandboxAPI

**File:** `zscaler/zia/sandbox.py`  
**Accessor:** `client.zia.sandbox`  
**Purpose:** Cloud sandbox file submission, analysis report retrieval, behavioral analysis settings (MD5 blocklist), and sandbox quota.

| Method | Signature | Notes |
|---|---|---|
| `submit_file` | `(file_path: str, force: bool = False)` | POST `/zscsb/submit`. Sends raw binary. `force=True` bypasses cache. Different base endpoint (`/zscsb/`). |
| `submit_file_for_inspection` | `(file_path: str)` | POST `/zscsb/discan`. Content-type is guessed from extension. |
| `get_quota` | `()` | GET `/sandbox/report/quota`. |
| `get_report` | `(md5_hash: str, report_details: str = "summary")` | GET `/sandbox/report/{md5_hash}?details={summary|full}`. |
| `get_behavioral_analysis` | `()` | GET `/behavioralAnalysisAdvancedSettings`. Returns `BehavioralAnalysisAdvancedSettings` (MD5 blocklist). |
| `get_file_hash_count` | `()` | GET `/behavioralAnalysisAdvancedSettings/fileHashCount`. |
| `update_behavioral_analysis` | `(**kwargs)` | PUT `/behavioralAnalysisAdvancedSettings`. |
| `add_hash_to_block_list` | `(md5_hashes: list)` | POST or PUT to update the MD5 block list (action=ADD_TO_LIST). |
| `delete_hash_from_block_list` | `(md5_hashes: list)` | PUT (action=REMOVE_FROM_LIST). |

**Note:** Sandbox submission uses the `/zscsb/` base path, not `/zia/api/v1/`. The `sandboxToken` and `sandboxCloud` credentials are required for file submission.

**Go parity:** Yes (`sandbox/`)

---

### SandboxRulesAPI

**File:** `zscaler/zia/sandbox_rules.py`  
**Accessor:** `client.zia.sandbox_rules`  
**Purpose:** CRUD for sandbox policy rules (determines which traffic is sent to the cloud sandbox for inspection).

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None)` | GET `/sandboxRules`. Client-side `search`. |
| `list_rules_lite` | `()` | GET `/sandboxRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/sandboxRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/sandboxRules`. `enabled` bool translated to `state`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/sandboxRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/sandboxRules/{id}`. |

**Go parity:** No (not found in Go SDK services list)

---

### SecurityPolicyAPI

**File:** `zscaler/zia/security_policy_settings.py`  
**Accessor:** `client.zia.security_policy_settings`  
**Purpose:** Manages the global allowlist and denylist URL lists used in the Zscaler Security policy.

| Method | Signature | Notes |
|---|---|---|
| `get_whitelist` | `()` | GET `/security`. Returns allowlisted URLs. |
| `update_whitelist` | `(**kwargs)` | PUT `/security`. |
| `get_blacklist` | `()` | GET `/security/advanced`. Returns denylisted URLs. |
| `update_blacklist` | `(**kwargs)` | PUT `/security/advanced`. |
| `add_urls_to_whitelist` | `(url_list: list)` | POST `/security/advanced/blacklistUrls?action=ADD_TO_LIST` (note: endpoint adds to the allowlist despite path name — verify in practice). |
| `delete_urls_from_whitelist` | `(url_list: list)` | POST with `action=REMOVE_FROM_LIST`. |
| `add_urls_to_blacklist` | `(url_list: list)` | Adds to the URL denylist. |
| `erase_blacklist` | `()` | Clears the URL denylist. |

**Go parity:** Yes (`security_policy_settings/`)

---

### ShadowITAPI

**File:** `zscaler/zia/shadow_it_report.py`  
**Accessor:** `client.zia.shadow_it_report`  
**Purpose:** Read-only shadow IT reporting — lists discovered applications and their risk attributes.

| Method | Signature | Notes |
|---|---|---|
| `get_shadow_it_report` | `(query_params=None)` | GET `/shadowIT/applications`. |

**Go parity:** Yes (`shadowitreport/`)

---

### SSLInspectionAPI

**File:** `zscaler/zia/ssl_inspection_rules.py`  
**Accessor:** `client.zia.ssl_inspection_rules`  
**Purpose:** CRUD for SSL inspection policy rules.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None) -> APIResult[List[SSLInspectionRules]]` | GET `/sslInspectionRules`. Client-side `search`. |
| `list_rules_lite` | `()` | GET `/sslInspectionRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/sslInspectionRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/sslInspectionRules`. `enabled` bool translated to `state`. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/sslInspectionRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/sslInspectionRules/{id}`. |

**Go parity:** Yes (`sslinspection/`)

---

### SubCloudsAPI

**File:** `zscaler/zia/sub_clouds.py`  
**Accessor:** `client.zia.sub_clouds`  
**Purpose:** Manages sub-cloud configurations (tenant-specific Zscaler cloud subdivisions).

| Method | Signature | Notes |
|---|---|---|
| `list_sub_clouds` | `(query_params=None)` | GET `/subCloud`. |
| `get_sub_cloud` | `(cloud_id: int)` | GET `/subCloud/{id}`. |
| `add_sub_cloud` | `(**kwargs)` | POST `/subCloud`. |
| `update_sub_cloud` | `(cloud_id: int, **kwargs)` | PUT `/subCloud/{id}`. |
| `delete_sub_cloud` | `(cloud_id: int)` | DELETE `/subCloud/{id}`. |

**Go parity:** No (not found in Go SDK services list)

---

### SystemAuditReportAPI

**File:** `zscaler/zia/system_audit.py`  
**Accessor:** `client.zia.system_audit`  
**Purpose:** Manages system-level audit report generation (distinct from admin audit logs).

| Method | Signature | Notes |
|---|---|---|
| `get_system_audit_status` | `()` | GET `/systemAuditReport`. |
| `create_system_audit_report` | `(**kwargs)` | POST `/systemAuditReport`. |
| `cancel_system_audit_report` | `()` | DELETE `/systemAuditReport`. |
| `download_system_audit_report` | `()` | GET `/systemAuditReport/download`. |

**Go parity:** No

---

### TenancyRestrictionProfileAPI

**File:** `zscaler/zia/tenancy_restriction_profile.py`  
**Accessor:** `client.zia.tenancy_restriction_profile`  
**Purpose:** CRUD for tenancy restriction profiles (limits which Microsoft 365 or Google tenants users can access).

| Method | Signature | Notes |
|---|---|---|
| `list_profiles` | `(query_params=None)` | GET `/tenancyRestrictionProfile`. |
| `get_profile` | `(profile_id: int)` | GET `/tenancyRestrictionProfile/{id}`. |
| `add_profile` | `(**kwargs)` | POST `/tenancyRestrictionProfile`. |
| `update_profile` | `(profile_id: int, **kwargs)` | PUT `/tenancyRestrictionProfile/{id}`. |
| `delete_profile` | `(profile_id: int)` | DELETE `/tenancyRestrictionProfile/{id}`. |

**Go parity:** Yes (`tenancy_restriction/`)

---

### TimeIntervalsAPI

**File:** `zscaler/zia/time_intervals.py`  
**Accessor:** `client.zia.time_intervals`  
**Purpose:** CRUD for time interval objects (named schedules referenced by policy rules).

| Method | Signature | Notes |
|---|---|---|
| `list_time_intervals` | `(query_params=None)` | GET `/timeIntervals`. Supports `page`, `page_size`, `search`. |
| `list_time_intervals_lite` | `()` | GET `/timeIntervals/lite`. |
| `get_time_interval` | `(interval_id: int)` | GET `/timeIntervals/{id}`. |
| `add_time_interval` | `(**kwargs)` | POST `/timeIntervals`. |
| `update_time_interval` | `(interval_id: int, **kwargs)` | PUT `/timeIntervals/{id}`. |
| `delete_time_interval` | `(interval_id: int)` | DELETE `/timeIntervals/{id}`. |

**Go parity:** Yes (`time_intervals/`)

---

### TrafficCaptureAPI

**File:** `zscaler/zia/traffic_capture.py`  
**Accessor:** `client.zia.traffic_capture`  
**Purpose:** Manages traffic capture sessions for diagnostic packet capture.

| Method | Signature | Notes |
|---|---|---|
| `start_traffic_capture` | `(**kwargs)` | POST `/trafficCapture`. |
| `stop_traffic_capture` | `()` | DELETE `/trafficCapture`. |
| `get_traffic_capture_status` | `()` | GET `/trafficCapture`. |
| `download_traffic_capture` | `()` | GET `/trafficCapture/download`. |

**Go parity:** Yes (`traffic_capture/`)

---

### TrafficDatacentersAPI

**File:** `zscaler/zia/traffic_datacenters.py`  
**Accessor:** `client.zia.traffic_datacenters`  
**Purpose:** Read-only lookup of Zscaler datacenter VIP addresses and geographical regions.

| Method | Signature | Notes |
|---|---|---|
| `list_vips` | `(query_params=None)` | GET `/vips`. All VIPs. |
| `list_vips_by_datacenter` | `(query_params=None)` | GET `/vips/groupByDatacenter`. |
| `list_pac_vips` | `(query_params=None)` | GET `/pacVips`. PAC-file VIPs. |
| `list_pac_vips_by_datacenter` | `(query_params=None)` | GET `/pacVips/groupByDatacenter`. |

**Go parity:** Partial (covered indirectly under `trafficforwarding/`)

---

### TrafficExtranetAPI

**File:** `zscaler/zia/traffic_extranet.py`  
**Accessor:** `client.zia.traffic_extranet`  
**Purpose:** CRUD for extranet configurations (Zscaler Extranet connects branch offices without GRE/VPN).

| Method | Signature | Notes |
|---|---|---|
| `list_extranets` | `(query_params=None)` | GET `/extranet`. |
| `get_extranet` | `(extranet_id: int)` | GET `/extranet/{id}`. |
| `add_extranet` | `(**kwargs)` | POST `/extranet`. |
| `update_extranet` | `(extranet_id: int, **kwargs)` | PUT `/extranet/{id}`. |
| `delete_extranet` | `(extranet_id: int)` | DELETE `/extranet/{id}`. |

**Go parity:** No

---

### TrafficStaticIPAPI

**File:** `zscaler/zia/traffic_static_ip.py`  
**Accessor:** `client.zia.traffic_static_ip`  
**Purpose:** CRUD for static IP addresses registered in ZIA (used as source IPs for GRE tunnels).

| Method | Signature | Notes |
|---|---|---|
| `list_static_ips` | `(query_params=None) -> APIResult[List[TrafficStaticIP]]` | GET `/staticIP`. Supports `page`, `page_size`, `available_for_gre_tunnel: bool`. |
| `get_static_ip` | `(static_ip_id: int)` | GET `/staticIP/{id}`. |
| `add_static_ip` | `(**kwargs)` | POST `/staticIP`. |
| `update_static_ip` | `(static_ip_id: int, **kwargs)` | PUT `/staticIP/{id}`. |
| `delete_static_ip` | `(static_ip_id: int)` | DELETE `/staticIP/{id}`. |
| `validate_static_ip` | `(**kwargs)` | POST `/staticIP/validate`. |

**Go parity:** Yes (`trafficforwarding/`)

---

### TrafficVPNCredentialAPI

**File:** `zscaler/zia/traffic_vpn_credentials.py`  
**Accessor:** `client.zia.traffic_vpn_credentials`  
**Purpose:** CRUD for VPN credentials used with IPSec tunnels.

| Method | Signature | Notes |
|---|---|---|
| `list_vpn_credentials` | `(query_params=None) -> APIResult[List[TrafficVPNCredentials]]` | GET `/vpnCredentials`. Supports `page`, `page_size`, `search`, `type` (`CN`, `IP`, `UFQDN`, `XAUTH`), `include_only_without_location`, `location_id`, `managed_by`. |
| `get_vpn_credential` | `(cred_id: int)` | GET `/vpnCredentials/{id}`. |
| `add_vpn_credential` | `(**kwargs)` | POST `/vpnCredentials`. |
| `update_vpn_credential` | `(cred_id: int, **kwargs)` | PUT `/vpnCredentials/{id}`. |
| `delete_vpn_credential` | `(cred_id: int)` | DELETE `/vpnCredentials/{id}`. |
| `bulk_delete_vpn_credentials` | `(cred_ids: list)` | POST `/vpnCredentials/bulkDelete`. |

**Go parity:** Yes (`trafficforwarding/`)

---

### URLCategoriesAPI

**File:** `zscaler/zia/url_categories.py`  
**Accessor:** `client.zia.url_categories`  
**Purpose:** CRUD for URL categories (custom and predefined). Custom categories support keyword overrides of predefined categories.

| Method | Signature | Notes |
|---|---|---|
| `list_categories` | `(query_params=None) -> APIResult[List[URLCategory]]` | GET `/urlCategories`. Supports `custom_only: bool`, `include_only_url_keyword_counts: bool`, `type` (`URL_CATEGORY`, `TLD_CATEGORY`, `ALL`). Client-side `search` applied post-fetch. |
| `list_categories_lite` | `(query_params=None)` | GET `/urlCategories/lite`. |
| `get_category` | `(category_id: str)` | GET `/urlCategories/{id}`. ID is typically a string like `CUSTOM_01`. |
| `add_category` | `(**kwargs)` | POST `/urlCategories`. Fields: `configured_name`, `urls: list[str]`, `db_categorized_urls: list[str]`, `keywords: list[str]`, `custom_category: bool`. |
| `update_category` | `(category_id: str, **kwargs)` | PUT `/urlCategories/{id}`. |
| `delete_category` | `(category_id: str)` | DELETE `/urlCategories/{id}`. |
| `lookup_url` | `(urls: list[str])` | POST `/urlLookup`. Returns category classification for each URL. Uses chunker utility to batch requests (max 100 URLs per request). |
| `get_quota` | `()` | GET `/urlCategories/urlQuota`. Returns custom category URL quota usage. |

**Go parity:** Yes (`urlcategories/`)

---

### URLFilteringAPI

**File:** `zscaler/zia/url_filtering.py`  
**Accessor:** `client.zia.url_filtering`  
**Purpose:** CRUD for URL filtering policy rules and advanced URL/cloud-app filter settings.

| Method | Signature | Notes |
|---|---|---|
| `list_rules` | `(query_params=None) -> APIResult[List[URLFilteringRule]]` | GET `/urlFilteringRules`. Supports `page`, `page_size`, and client-side `search`. |
| `list_rules_lite` | `()` | GET `/urlFilteringRules/lite`. |
| `get_rule` | `(rule_id: int)` | GET `/urlFilteringRules/{id}`. |
| `add_rule` | `(**kwargs)` | POST `/urlFilteringRules`. `enabled` bool translated to `state`. Key ID-list fields: `departments`, `devices`, `device_groups`, `groups`, `labels`, `locations`, `location_groups`, `override_users`, `override_groups`, `time_windows`, `workload_groups`, `users`. `cbi_profile: dict` for Cloud Browser Isolation. |
| `update_rule` | `(rule_id: int, **kwargs)` | PUT `/urlFilteringRules/{id}`. |
| `delete_rule` | `(rule_id: int)` | DELETE `/urlFilteringRules/{id}`. |
| `get_url_filter_cloud_app_settings` | `()` | GET `/urlAndAppSettings`. Returns `AdvancedUrlFilterAndCloudAppSettings`. |
| `update_url_filter_cloud_app_settings` | `(**kwargs)` | PUT `/urlAndAppSettings`. |

**Go parity:** Yes (`urlfilteringpolicies/`)

---

### UserManagementAPI

**File:** `zscaler/zia/user_management.py`  
**Accessor:** `client.zia.user_management`  
**Purpose:** CRUD for end users, user groups, and departments.

| Method | Signature | Notes |
|---|---|---|
| `list_users` | `(query_params=None) -> APIResult[List[UserManagement]]` | GET `/users`. Supports `page`, `page_size` (default 100, max 10 000), `name`, `dept`, `group`. |
| `get_user` | `(user_id: int)` | GET `/users/{id}`. |
| `add_user` | `(**kwargs)` | POST `/users`. Required: `name`, `email`, `groups`, `department`. |
| `update_user` | `(user_id: int, **kwargs)` | PUT `/users/{id}`. |
| `delete_user` | `(user_id: int)` | DELETE `/users/{id}`. |
| `bulk_delete_users` | `(user_ids: list)` | POST `/users/bulkDelete`. |
| `list_groups` | `(query_params=None) -> APIResult[List[Groups]]` | GET `/groups`. Supports `search`. |
| `list_groups_lite` | `()` | GET `/groups/lite`. |
| `get_group` | `(group_id: int)` | GET `/groups/{id}`. |
| `list_departments` | `(query_params=None) -> APIResult[List[Department]]` | GET `/departments`. Supports `search`, `department_id`, `limit_search`. |
| `list_departments_lite` | `()` | GET `/departments/lite`. |
| `get_department` | `(dept_id: int)` | GET `/departments/{id}`. |

**Go parity:** Yes (`usermanagement/`)

---

### VZENClustersAPI

**File:** `zscaler/zia/vzen_clusters.py`  
**Accessor:** `client.zia.vzen_clusters`  
**Purpose:** CRUD for Virtual Zscaler Enforcement Node (VZEN) cluster configurations.

| Method | Signature | Notes |
|---|---|---|
| `list_vzen_clusters` | `(query_params=None)` | GET `/vzenClusters`. |
| `get_vzen_cluster` | `(cluster_id: int)` | GET `/vzenClusters/{id}`. |
| `add_vzen_cluster` | `(**kwargs)` | POST `/vzenClusters`. |
| `update_vzen_cluster` | `(cluster_id: int, **kwargs)` | PUT `/vzenClusters/{id}`. |
| `delete_vzen_cluster` | `(cluster_id: int)` | DELETE `/vzenClusters/{id}`. |

**Go parity:** Yes (`vzen_clusters/`)

---

### VZENNodesAPI

**File:** `zscaler/zia/vzen_nodes.py`  
**Accessor:** `client.zia.vzen_nodes`  
**Purpose:** Lists and manages individual VZEN node instances within clusters.

| Method | Signature | Notes |
|---|---|---|
| `list_vzen_nodes` | `(query_params=None)` | GET `/vzenNodes`. |
| `get_vzen_node` | `(node_id: int)` | GET `/vzenNodes/{id}`. |
| `add_vzen_node` | `(**kwargs)` | POST `/vzenNodes`. |
| `update_vzen_node` | `(node_id: int, **kwargs)` | PUT `/vzenNodes/{id}`. |
| `delete_vzen_node` | `(node_id: int)` | DELETE `/vzenNodes/{id}`. |

**Go parity:** Yes (`vzen_nodes/`)

---

### WorkloadGroupsAPI

**File:** `zscaler/zia/workload_groups.py`  
**Accessor:** `client.zia.workload_groups`  
**Purpose:** Lists workload groups for cloud workload policy scoping.

| Method | Signature | Notes |
|---|---|---|
| `list_workload_groups` | `(query_params=None)` | GET `/workloadGroups`. |
| `get_workload_group` | `(group_id: int)` | GET `/workloadGroups/{id}`. |

**Go parity:** Yes (`workloadgroups/`)

---

### ZPAGatewayAPI

**File:** `zscaler/zia/zpa_gateway.py`  
**Accessor:** `client.zia.zpa_gateway`  
**Purpose:** CRUD for ZPA gateway objects referenced in ZIA forwarding control rules (enables ZIA-to-ZPA traffic redirection).

| Method | Signature | Notes |
|---|---|---|
| `list_gateways` | `(query_params=None) -> APIResult[List[ZPAGateway]]` | GET `/zpaGateways`. Supports `app_segment: list`, `search`. |
| `list_gateways_lite` | `()` | GET `/zpaGateways/lite`. |
| `get_gateway` | `(gw_id: int)` | GET `/zpaGateways/{id}`. |
| `add_gateway` | `(**kwargs)` | POST `/zpaGateways`. |
| `update_gateway` | `(gw_id: int, **kwargs)` | PUT `/zpaGateways/{id}`. |
| `delete_gateway` | `(gw_id: int)` | DELETE `/zpaGateways/{id}`. |

**Go parity:** No (ZPA Gateway is a ZIA-specific concept for routing ZIA traffic into ZPA)

---

## 3. Cross-cutting patterns

### Activation lifecycle

ZIA uses a staged-commit model. Every write operation queues a change; none take effect until activation is called. The `ActivationAPI.activate()` method commits all queued changes. When using `ZscalerClient` as a context manager (`with` statement), deauthentication at context exit triggers implicit activation.

For scripts that must make changes without a context manager:

```python
client.zia.activate.activate()
```

### Pagination

The standard pattern for paginated list endpoints:

- Default `page_size` is 100 for most endpoints.
- Maximum `page_size` is 1000 for locations, GRE tunnels, VPN credentials; 10 000 for users.
- The `resp.next()` / `resp.has_next()` methods on the response object implement cursor-based iteration.
- Many endpoints do not support server-side `page` + `page_size` at all (they return the full list) — this is inconsistent across services and must be tested per endpoint.

### Client-side search filtering

Multiple list endpoints accept `search` inside `query_params` but handle it client-side after a full fetch. The SDK pops `search` from `query_params` before sending the HTTP request, then filters the results list by `name` attribute. This means the API call always retrieves a full page regardless of `search` value. Server-side search exists only where the API itself supports it (check individual endpoint docs).

### Rate limiting and retries

The SDK uses a custom `RequestExecutor` with built-in retry logic. The exact retry strategy (backoff, attempt count) is not exposed in the ZIA service modules and would require reading `zscaler/request_executor.py` for detail. No explicit rate-limit headers or `429` handling is visible in the ZIA-layer source code.

### The `enabled` / `state` convention

Rule modules that accept `enabled: bool` (bandwidth control, DLP web rules, URL filtering, firewall rules, sandbox rules, SSL inspection rules, forwarding control) translate `enabled=True` to `state="ENABLED"` before sending. Passing `state` directly also works. The API only accepts the string form.

### ID list reshaping

Any kwarg whose value is a list of integers and whose name matches one of the `reformat_params` entries (e.g. `locations`, `groups`, `departments`, `labels`, `time_windows`, `users`) is reshaped from `[1, 2, 3]` to `[{"id": 1}, {"id": 2}, {"id": 3}]` by `transform_common_id_fields`. Callers do not need to pre-format these fields.

### Sandbox credentials

File submission to the cloud sandbox (`sandbox.submit_file`, `sandbox.submit_file_for_inspection`) uses a different base endpoint (`/zscsb/`) and requires `ZSCALER_SANDBOX_TOKEN` and `ZSCALER_SANDBOX_CLOUD` environment variables (or equivalent config keys). The ZIA API credentials are used for reporting (`get_report`, `get_quota`) but not for file submission.

### EUSA and password expiry (ZIdentity compatibility)

`ActivationAPI.get_eusa_status` / `update_eusa_status` and `AdminRolesAPI.get_password_expiry_settings` / `update_password_expiry_settings` are noted in source as not compatible with ZIdentity-migrated tenants.

---

## 4. Open questions / clarifications register

**zia-sdk-01** — Resolved 2026-04-26. `AuditLogsAPI` return convention is intentionally non-standard. Source: `vendor/zscaler-sdk-python/zscaler/zia/audit_logs.py`. Each method returns a raw value rather than a `(result, response, error)` tuple: `get_status()` returns `response.get_body()` (dict); `create()` returns `response.get_status()` (int HTTP status code); `cancel()` returns `response.status_code` (int); `get_report()` returns `response.get_body()` (str CSV). All four return `None` on either request creation error or execution error — errors are indistinguishable from a successful empty response. This is a known limitation of the legacy-style `AuditLogsAPI` implementation; the async report pattern (POST → poll → download) doesn't map cleanly to the standard tuple.

**zia-sdk-02** — Resolved 2026-04-26. `BrowserControlSettingsPI` class name typo confirmed. Source: `vendor/zscaler-sdk-python/zscaler/zia/browser_control_settings.py` line 25 — class is named `BrowserControlSettingsPI` (missing the `A`). All imports in `zia_service.py` and `legacy.py` use this same incorrect name. Callers using the `client.zia.browser_control_settings` accessor are unaffected; the typo is only visible when importing the class directly.

**zia-sdk-03** — Resolved 2026-04-26. `dns_gatways.py` filename typo confirmed. Source: `vendor/zscaler-sdk-python/zscaler/zia/dns_gatways.py` exists with the misspelled name. The `ZIAService` accessor imports from this file and exposes it as `dns_gateways` (correctly spelled), so all callers via `client.zia.dns_gateways` are unaffected. Direct file imports would require the misspelled path.

**zia-sdk-04** — Resolved 2026-04-26. `AdminRolesAPI.update_password_expiry_settings` endpoint mismatch confirmed as a copy-paste bug. Source: `vendor/zscaler-sdk-python/zscaler/zia/admin_roles.py` — the docstring at line 571 shows the correct endpoint `/passwordExpiry/settings` but the implementation at line 623 sends a PUT to `/cyberThreatProtection/advancedThreatSettings`. The method is functionally broken — it updates ATP settings instead of password expiry settings.

**zia-sdk-05** — Resolved 2026-04-26. `SecurityPolicyAPI` whitelist/blacklist URL mutation is fully clarified. Source: `vendor/zscaler-sdk-python/zscaler/zia/security_policy_settings.py`. `add_urls_to_whitelist` and `delete_urls_from_whitelist` are client-side helpers that call `get_whitelist()` → modify the list → call `replace_whitelist()` (which sends a PUT to `/security/whitelist`). For blacklist: `add_urls_to_blacklist` sends a POST to `/security/advanced/blacklistUrls` with `{"blacklistUrls": [...]}`. No action query parameter is used. The comment about "blacklistUrls" in whitelist methods was misleading — whitelist operations use `/security/whitelist`, not the blacklist endpoint.

**zia-sdk-06** — Resolved 2026-04-26. VIP listing overlap clarified. `TrafficDatacentersAPI` in `vendor/zscaler-sdk-python/zscaler/zia/traffic_datacenters.py` exposes `list_datacenters` (not `list_vips`). The VIP listing methods (`list_vips`, `list_vips_by_datacenter`, `list_vips_recommended`) are in `vendor/zscaler-sdk-python/zscaler/zia/gre_tunnel.py` (confirmed via grep). There is no duplicate — `TrafficDatacentersAPI` and `TrafficForwardingGRETunnelAPI` do not both expose VIP listing; only the GRE tunnel service does.

**zia-sdk-07** — Go SDK parity for newer services remains unverified. The parity flags in this document reflect the state of `vendor/zscaler-sdk-go/zscaler/zia/services/` at the time of last review (2026-04-26). Services that were Python-only at that time (CASB DLP/Malware rules, custom file types, dedicated IP gateways, DNS gateways, risk profiles, sandbox rules, sub-clouds, system audit, traffic extranet, ZPA gateway) should be re-checked against the Go SDK when using them in automation.

**zia-sdk-08** — `DLPResourcesAPI` IDM profile endpoint. `list_idm_profiles` and `get_idm_profile` use `/idmprofile` as the base path. Contents not further confirmed from available sources; model structure not inspected.
