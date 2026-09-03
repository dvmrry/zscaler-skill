---
product: zpa
topic: zpa-sdk
title: "ZPA SDK — service and method catalog"
content-type: reference
last-verified: "2026-06-15"
verified-against:
  vendor/zscaler-sdk-go: 4b7101202cde25e1e60552f1cb215d2c70cdc3bd (new ZPA service surface section)
confidence: medium
source-tier: code
sources:
  - vendor/zscaler-sdk-python/pyproject.toml
  - vendor/zscaler-sdk-python/CHANGELOG.md
  - vendor/zscaler-sdk-python/zscaler/zpa/
  - vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py
  - vendor/zscaler-sdk-python/zscaler/zpa/legacy.py
  - vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py
  - vendor/zscaler-sdk-python/zscaler/zpa/policy_group_rule.py
  - vendor/zscaler-sdk-python/zscaler/zpa/policy_group_set.py
  - vendor/zscaler-sdk-python/zscaler/constants.py
  - vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py
  - vendor/zscaler-sdk-python/zscaler/request_executor.py
  - vendor/zscaler-sdk-python/docsrc/zs/guides/release_notes.rst
  - vendor/zscaler-sdk-python/README.md
  - vendor/zscaler-sdk-go/zscaler/zpa/services/
  - vendor/terraform-provider-zpa/docs/index.md
author-status: draft
---

# ZPA SDK — service and method catalog

Reference for the Zscaler Python SDK (`zscaler-sdk-python`) as applied to the ZPA product.
Go SDK parity is noted per service. All signatures are sourced from code in `vendor/zscaler-sdk-python/zscaler/zpa/`.

---

## 1. SDK overview

### 1.1 Client construction

**OneAPI (Zidentity OAuth 2.0) — recommended**

```python
from zscaler import ZscalerClient

config = {
    "clientId": "...",
    "clientSecret": "...",      # or use "privateKey" for JWT auth
    "vanityDomain": "acme",     # org vanity domain, not full URL
    "customerId": "...",        # required for ZPA
    "microtenantId": "...",     # optional; for microtenant scope
    "partnerId": "...",         # optional; adds x-partner-id header
    "cloud": "beta",            # optional; omit for production
    "logging": {"enabled": False, "verbose": False},
}

with ZscalerClient(config) as client:
    segments, resp, err = client.zpa.application_segment.list_segments()
```

Environment variable equivalents:
`ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET`, `ZSCALER_PRIVATE_KEY`,
`ZSCALER_VANITY_DOMAIN`, `ZSCALER_CLOUD`, `ZPA_CUSTOMER_ID`,
`ZPA_MICROTENANT_ID`, `ZSCALER_PARTNER_ID`.

**Legacy ZPA API (pre-Zidentity tenants)**

```python
from zscaler.oneapi_client import LegacyZPAClient

with LegacyZPAClient(config) as client:
    ...
```

Government-cloud OneAPI support is client- and version-specific, not
categorically unavailable. The current Python OneAPI client maps lowercase
`gov` / `govus` to dedicated FedRAMP identity and API-gateway hosts
(`vendor/zscaler-sdk-python/zscaler/constants.py:17-28`;
`vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:495-499`;
`vendor/zscaler-sdk-python/zscaler/request_executor.py:173-186`). Independently,
ZPA Terraform provider v4.4.6+ documents OneAPI support with those same cloud
values (`vendor/terraform-provider-zpa/docs/index.md:118-133`). This routing
support does not establish entitlement or ZIdentity API-client configuration
for every government tenant; pre-ZIdentity tenants and unsupported client
versions still require the legacy path.

### 1.2 Accessing ZPA sub-services

Every ZPA service is a property on `ZPAService`, which is accessed through
`client.zpa.<service_name>`. For example:

```python
client.zpa.application_segment.list_segments()
client.zpa.policies.list_rules("access")
client.zpa.scim_groups.list_scim_groups(idp_id="72058304855015574")
```

### 1.3 Return convention

Every method returns a three-tuple `(result, response, error)`:

- `result` — model instance or list of model instances (or `None` on error)
- `response` — raw `ZscalerAPIResponse` object (always present on HTTP calls)
- `error` — exception or error string on failure; `None` on success

Pattern:

```python
items, resp, err = client.zpa.segment_groups.list_groups()
if err:
    raise RuntimeError(err)
for item in items:
    print(item.as_dict())
```

### 1.4 Pagination

Server-side pagination uses `page` and `page_size` query parameters (default
page size 20, max 500). The response object exposes:

```python
items, resp, err = client.zpa.scim_groups.list_scim_groups(
    idp_id=idp_id, query_params={"page": "1", "page_size": "100"}
)
try:
    resp.next()    # advances to the next page
except StopIteration:
    pass           # no further pages
```

Some endpoints (tag namespaces, tag groups, tag keys, C2C IP ranges) use a
POST search pattern with `pageBy` in the request body; the `_post_search_all_pages`
helper iterates all pages automatically and is used internally by those service
classes.

### 1.5 Client-side filtering

All list responses support JMESPath filtering via `resp.search(expression)`:

```python
segments, resp, err = client.zpa.application_segment.list_segments()
enabled = resp.search("list[?enabled==`true`].{name: name, id: id}")
```

### 1.6 Error handling

Errors are returned as the third element of the tuple. They may be:
- Python exceptions (e.g., `ValueError`, `TypeError`)
- Formatted error strings from HTTP responses
- `None` on success

The SDK does not raise by default. Callers must check `err` explicitly.

### 1.7 Data model

All responses are plain Python `dict` objects (not Box objects). Model classes
(e.g., `ApplicationSegments`) wrap a dict and expose `.as_dict()` for
serialization and attribute access via the model's properties.

---

## 2. Service catalog

Services are listed in the order they appear in `zpa_service.py`. The
`ZPAService` property name is shown first, then the class name and file.

---

### 2.1 CustomerControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.customer_controller` |
| **Class** | `CustomerControllerAPI` |
| **File** | `zscaler/zpa/customer_controller.py` |
| **Go parity** | ✅ `customer_controller/` |

Reads authentication domain configuration and remote assistance settings for
the customer.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `get_auth_domains` | `() -> APIResult[dict]` | Returns auth domain info |
| `get_remote_assistance` | `() -> APIResult[RemoteAssistance]` | Returns remote assistance status |

---

### 2.2 ApplicationSegmentAPI

| | |
|---|---|
| **Property** | `client.zpa.application_segment` |
| **Class** | `ApplicationSegmentAPI` |
| **File** | `zscaler/zpa/application_segment.py` |
| **Go parity** | ✅ `applicationsegment/` |

Core application segment CRUD. Supports both legacy flat port-range format
(`tcp_port_ranges: ["80", "80"]`) and structured format
(`tcp_port_range: [{"from": "80", "to": "80"}]`). Mixing both in the same
call raises `ValueError`.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_segments` | `(query_params=None) -> APIResult[List[ApplicationSegments]]` | Server-side page/search |
| `get_segment` | `(segment_id: str, query_params=None) -> APIResult[ApplicationSegments]` | |
| `add_segment` | `(**kwargs) -> APIResult[ApplicationSegments]` | Required: `name`, `domain_names`, `segment_group_id`, `server_group_ids` |
| `update_segment` | `(segment_id: str, **kwargs) -> APIResult[ApplicationSegments]` | PUT; clears unspecified port ranges |
| `delete_segment` | `(segment_id: str, force_delete=False, microtenant_id=None) -> APIResult[None]` | `force_delete=True` removes segment-group mapping |
| `app_segment_move` | `(application_id: str, **kwargs) -> APIResult[dict]` | Move segment between microtenants |
| `app_segment_share` | `(application_id: str, **kwargs) -> APIResult[dict]` | Share to microtenants; pass empty list to remove |
| `add_segment_provision` | `(**kwargs) -> APIResult[dict]` | Provision with extranet/server group DTOs |
| `get_weighted_lb_config` | `(segment_id: str, query_params=None) -> APIResult[WeightedLBConfig]` | |
| `update_weighted_lb_config` | `(segment_id: str, query_params=None, **kwargs) -> APIResult[WeightedLBConfig]` | `application_to_server_group_mappings` list of `{id, weight, passive}` |
| `bulk_update_multimatch` | `(**kwargs) -> APIResult[dict]` | `application_ids`, `match_style` (`EXCLUSIVE`\|`INCLUSIVE`) |
| `get_multimatch_unsupported_references` | `(domains: list, **kwargs) -> APIResult[List[MultiMatchUnsupportedReferences]]` | Body is array of domain strings |
| `get_current_and_max_limit` | `() -> APIResult[dict]` | Returns `currentAppsCount`, `maxAppsLimit` |
| `get_application_segment_count` | `() -> APIResult[List[dict]]` | Historical count records |
| `get_application_segment_mappings` | `(segment_id: str, query_params=None) -> APIResult[List[dict]]` | Returns list of `{names, type}` |
| `application_segment_export` | `(query_params=None) -> APIResult[str]` | Returns CSV string; sets `Accept: text/csv` |

**Parameter shapes**

`server_group_ids` (list of str) is automatically reformatted to
`serverGroups: [{"id": "..."}]` by `add_id_groups`. `clientless_app_ids` is
reformatted to `clientlessApps`. On update, `clientless_app_ids` triggers a
lookup via `ApplicationSegmentByTypeAPI` to resolve the app's internal ID.

---

### 2.3 ApplicationSegmentBAAPI

| | |
|---|---|
| **Property** | `client.zpa.app_segments_ba` |
| **Class** | `ApplicationSegmentBAAPI` |
| **File** | `zscaler/zpa/app_segments_ba.py` |
| **Go parity** | ✅ `applicationsegmentbrowseraccess/` |

Browser Access application segments (v1). Shares the same underlying
`/application` endpoint as `ApplicationSegmentAPI` but provides a separate
client object and named methods for BA context. Update resolves `clientless_app_ids`
by matching on `domain` + `app_id` against `BROWSER_ACCESS` type segments.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_segments_ba` | `(query_params=None) -> APIResult[List[ApplicationSegments]]` | |
| `get_segment_ba` | `(segment_id: str, query_params=None) -> APIResult[dict]` | |
| `add_segment_ba` | `(**kwargs) -> APIResult[dict]` | Same required params as `add_segment` |
| `update_segment_ba` | `(segment_id: str, **kwargs) -> APIResult[dict]` | |
| `delete_segment_ba` | `(segment_id: str, force_delete=False, microtenant_id=None) -> APIResult[dict]` | |

---

### 2.4 AppSegmentsBAV2API

| | |
|---|---|
| **Property** | `client.zpa.app_segments_ba_v2` |
| **Class** | `AppSegmentsBAV2API` |
| **File** | `zscaler/zpa/app_segments_ba_v2.py` |
| **Go parity** | ✅ `applicationsegmentbrowseraccess/` |

V2 Browser Access application segments. Provides the same operations as v1
BA API but is intended for the updated API response shape.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_segments_ba` | `(query_params=None, **kwargs) -> APIResult[List[ApplicationSegments]]` | |
| `get_segment_ba` | `(segment_id: str, query_params=None) -> APIResult[dict]` | |
| `add_segment_ba` | `(**kwargs) -> APIResult[dict]` | |
| `update_segment_ba` | `(segment_id: str, **kwargs) -> APIResult[dict]` | |
| `delete_segment_ba` | `(segment_id: str, force_delete=False, microtenant_id=None) -> APIResult[dict]` | |

---

### 2.5 AppSegmentsInspectionAPI

| | |
|---|---|
| **Property** | `client.zpa.app_segments_inspection` |
| **Class** | `AppSegmentsInspectionAPI` |
| **File** | `zscaler/zpa/app_segments_inspection.py` |
| **Go parity** | ✅ `applicationsegmentinspection/` |

Application segments for App Protection (Inspection) use case.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_segment_inspection` | `(query_params=None, **kwargs) -> APIResult[List[ApplicationSegments]]` | |
| `get_segment_inspection` | `(segment_id: str, query_params=None) -> APIResult[dict]` | |
| `add_segment_inspection` | `(**kwargs) -> APIResult[dict]` | |
| `update_segment_inspection` | `(segment_id: str, **kwargs) -> APIResult[dict]` | |
| `delete_segment_inspection` | `(segment_id: str, force_delete=False, microtenant_id=None) -> APIResult[dict]` | |

---

### 2.6 AppSegmentsPRAAPI

| | |
|---|---|
| **Property** | `client.zpa.app_segments_pra` |
| **Class** | `AppSegmentsPRAAPI` |
| **File** | `zscaler/zpa/app_segments_pra.py` |
| **Go parity** | ✅ `applicationsegmentpra/` |

Application segments for Privileged Remote Access (PRA).

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_segments_pra` | `(query_params=None, **kwargs) -> APIResult[List[ApplicationSegments]]` | |
| `get_segment_pra` | `(segment_id: str, query_params=None) -> APIResult[dict]` | |
| `add_segment_pra` | `(**kwargs) -> APIResult[dict]` | |
| `update_segment_pra` | `(segment_id: str, **kwargs) -> APIResult[dict]` | |
| `delete_segment_pra` | `(segment_id: str, force_delete=False, microtenant_id=None) -> APIResult[dict]` | |

---

### 2.7 ApplicationSegmentByTypeAPI

| | |
|---|---|
| **Property** | `client.zpa.app_segment_by_type` |
| **Class** | `ApplicationSegmentByTypeAPI` |
| **File** | `zscaler/zpa/app_segment_by_type.py` |
| **Go parity** | ✅ `applicationsegmentbytype/` |

Read-only lookup of application segments filtered by application type. Used
internally by BA update methods to resolve clientless app IDs.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `get_segments_by_type` | `(application_type: str, expand_all: bool = False, query_params=None, **kwargs) -> APIResult[dict]` | `application_type` must be `BROWSER_ACCESS`, `INSPECT`, or `SECURE_REMOTE_ACCESS` |

---

### 2.8 AppConnectorGroupAPI

| | |
|---|---|
| **Property** | `client.zpa.app_connector_groups` |
| **Class** | `AppConnectorGroupAPI` |
| **File** | `zscaler/zpa/app_connector_groups.py` |
| **Go parity** | ✅ `appconnectorgroup/` |

App Connector Group CRUD plus a summary listing.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_connector_groups` | `(query_params=None) -> APIResult[List[AppConnectorGroup]]` | |
| `list_connector_groups_summary` | `(query_params=None) -> APIResult[List[AppConnectorGroup]]` | Returns name/ID only |
| `get_connector_group` | `(group_id: str, query_params=None) -> APIResult[AppConnectorGroup]` | |
| `get_connector_group_sg` | `(group_id: str, query_params=None) -> APIResult[AppConnectorGroup]` | Includes server group details |
| `add_connector_group` | `(**kwargs) -> APIResult[AppConnectorGroup]` | Required: `name`, `latitude`, `longitude`, `location` |
| `update_connector_group` | `(group_id: str, **kwargs) -> APIResult[AppConnectorGroup]` | |
| `delete_connector_group` | `(group_id: str, microtenant_id=None) -> APIResult[None]` | |

**Key kwargs for `add_connector_group`**: `city_country`, `country_code`,
`dns_query_type` (`IPV4_IPV6`|`IPV4`|`IPV6`), `enabled`, `upgrade_day`,
`upgrade_time_in_secs`, `version_profile` (`default`|`previous_default`|`new_release`),
`override_version_profile`, `connector_ids`, `server_group_ids`.

---

### 2.9 AppConnectorControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.app_connectors` |
| **Class** | `AppConnectorControllerAPI` |
| **File** | `zscaler/zpa/app_connectors.py` |
| **Go parity** | ✅ `appconnectorcontroller/` |

Individual App Connector lifecycle management.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_connectors` | `(query_params=None) -> APIResult[List[AppConnectorController]]` | |
| `get_connector` | `(connector_id: str, query_params=None) -> APIResult[dict]` | |
| `update_connector` | `(connector_id: str, **kwargs) -> APIResult[dict]` | `name`, `description`, `enabled` |
| `delete_connector` | `(connector_id: str, microtenant_id=None) -> APIResult[dict]` | |
| `bulk_delete_connectors` | `(connector_ids: list, microtenant_id=None) -> APIResult[dict]` | POST to `/connector/bulkDelete` with `{"ids": [...]}` |

---

### 2.10 AppConnectorScheduleAPI

| | |
|---|---|
| **Property** | `client.zpa.app_connector_schedule` |
| **Class** | `AppConnectorScheduleAPI` |
| **File** | `zscaler/zpa/app_connector_schedule.py` |
| **Go parity** | ✅ `appconnectorschedule/` |

Configure automated deletion of inactive connectors.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `get_connector_schedule` | `(customer_id=None) -> APIResult[dict]` | Returns schedule frequency |
| `add_connector_schedule` | `(**kwargs) -> APIResult[dict]` | `frequency`, `interval`, `disabled`, `enabled` |
| `update_connector_schedule` | `(schedule_id: str, **kwargs) -> APIResult[dict]` | |

---

### 2.11 AppServersAPI

| | |
|---|---|
| **Property** | `client.zpa.servers` |
| **Class** | `AppServersAPI` |
| **File** | `zscaler/zpa/servers.py` |
| **Go parity** | ✅ `appservercontroller/` |

Application server (static IP/hostname) CRUD.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_servers` | `(query_params=None) -> APIResult[List[AppServers]]` | |
| `get_server` | `(server_id: str, query_params=None) -> APIResult[AppServers]` | |
| `add_server` | `(**kwargs) -> APIResult[AppServers]` | Required: `name`, `address` |
| `update_server` | `(server_id: str, **kwargs) -> APIResult[AppServers]` | |
| `delete_server` | `(server_id: str, microtenant_id=None) -> APIResult[None]` | |

---

### 2.12 Cloud Browser Isolation (CBI) — five sub-services

All five CBI services use the base endpoint
`/zpa/cbiconfig/cbi/api/customers/{customer_id}` rather than the standard
`mgmtconfig` path.

#### 2.12.1 CBIBannerAPI
| **Property** | `client.zpa.cbi_banner` | **File** | `zscaler/zpa/cbi_banner.py` | **Go parity** | ✅ `cloudbrowserisolation/` |

| Method | Signature |
|---|---|
| `list_cbi_banners` | `() -> APIResult[List[CBIBanner]]` |
| `get_cbi_banner` | `(banner_id: str) -> APIResult[CBIBanner]` |
| `add_cbi_banner` | `(**kwargs) -> APIResult[CBIBanner]` |
| `update_cbi_banner` | `(banner_id: str, **kwargs) -> APIResult[CBIBanner]` |
| `delete_cbi_banner` | `(banner_id: str) -> APIResult[None]` |

#### 2.12.2 CBICertificateAPI
| **Property** | `client.zpa.cbi_certificate` | **File** | `zscaler/zpa/cbi_certificate.py` | **Go parity** | ✅ |

| Method | Signature |
|---|---|
| `list_cbi_certificates` | `() -> APIResult[List[CBICertificate]]` |
| `get_cbi_certificate` | `(certificate_id: str) -> APIResult[CBICertificate]` |
| `add_cbi_certificate` | `(**kwargs) -> APIResult[CBICertificate]` |
| `delete_cbi_certificate` | `(certificate_id: str) -> APIResult[None]` |

#### 2.12.3 CBIProfileAPI
| **Property** | `client.zpa.cbi_profile` | **File** | `zscaler/zpa/cbi_profile.py` | **Go parity** | ✅ |

| Method | Signature |
|---|---|
| `list_cbi_profiles` | `() -> APIResult[List[CBIProfile]]` |
| `get_cbi_profile` | `(profile_id: str) -> APIResult[CBIProfile]` |
| `add_cbi_profile` | `(**kwargs) -> APIResult[CBIProfile]` |
| `update_cbi_profile` | `(profile_id: str, **kwargs) -> APIResult[CBIProfile]` |
| `delete_cbi_profile` | `(profile_id: str) -> APIResult[None]` |

#### 2.12.4 CBIRegionAPI
| **Property** | `client.zpa.cbi_region` | **File** | `zscaler/zpa/cbi_region.py` | **Go parity** | ✅ |

| Method | Signature |
|---|---|
| `list_cbi_regions` | `() -> APIResult[List[CBIRegion]]` |

#### 2.12.5 CBIZPAProfileAPI
| **Property** | `client.zpa.cbi_zpa_profile` | **File** | `zscaler/zpa/cbi_zpa_profile.py` | **Go parity** | ✅ |

| Method | Signature |
|---|---|
| `list_cbi_zpa_profiles` | `() -> APIResult[List[CBIZPAProfile]]` |
| `get_cbi_zpa_profile` | `(profile_id: str) -> APIResult[CBIZPAProfile]` |

---

### 2.13 CertificatesAPI

| | |
|---|---|
| **Property** | `client.zpa.certificates` |
| **Class** | `CertificatesAPI` |
| **File** | `zscaler/zpa/certificates.py` |
| **Go parity** | ✅ `bacertificate/` |

Browser Access (BA) certificate management. Uses both v1 and v2 endpoints.

**Methods**

| Method | Signature |
|---|---|
| `list_certificates` | `(query_params=None) -> APIResult[List[Certificate]]` |
| `get_certificate` | `(certificate_id: str, query_params=None) -> APIResult[Certificate]` |
| `add_certificate` | `(**kwargs) -> APIResult[Certificate]` |
| `delete_certificate` | `(certificate_id: str, microtenant_id=None) -> APIResult[None]` |

---

### 2.14 CloudConnectorGroupsAPI

| | |
|---|---|
| **Property** | `client.zpa.cloud_connector_groups` |
| **Class** | `CloudConnectorGroupsAPI` |
| **File** | `zscaler/zpa/cloud_connector_groups.py` |
| **Go parity** | ✅ `cloud_connector_group/` |

Read-only listing of Cloud Connector Groups (ZTW-sourced).

**Methods**

| Method | Signature |
|---|---|
| `list_cloud_connector_groups` | `(query_params=None) -> APIResult[List[CloudConnectorGroup]]` |
| `get_cloud_connector_group` | `(group_id: str, query_params=None) -> APIResult[CloudConnectorGroup]` |

---

### 2.15 CustomerVersionProfileAPI

| | |
|---|---|
| **Property** | `client.zpa.customer_version_profile` |
| **Class** | `CustomerVersionProfileAPI` |
| **File** | `zscaler/zpa/customer_version_profile.py` |
| **Go parity** | ✅ `customerversionprofile/` |

**Methods**

| Method | Signature |
|---|---|
| `list_version_profiles` | `(query_params=None) -> APIResult[List[CustomerVersionProfile]]` |
| `get_version_profile` | `(profile_id: str) -> APIResult[CustomerVersionProfile]` |

---

### 2.16 EmergencyAccessAPI

| | |
|---|---|
| **Property** | `client.zpa.emergency_access` |
| **Class** | `EmergencyAccessAPI` |
| **File** | `zscaler/zpa/emergency_access.py` |
| **Go parity** | ✅ `emergencyaccess/` |

Emergency access user management. Uses `page_id` (not `page`) as the
pagination key, unlike most other services.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_users` | `(query_params=None, **kwargs) -> APIResult[List[EmergencyAccessUser]]` | `search` supports `first_name+EQ+Emily` style |
| `get_user` | `(user_id: str, query_params=None) -> APIResult[EmergencyAccessUser]` | |
| `add_user` | `(**kwargs) -> APIResult[EmergencyAccessUser]` | |
| `update_user` | `(user_id: str, **kwargs) -> APIResult[EmergencyAccessUser]` | |
| `delete_user` | `(user_id: str) -> APIResult[None]` | |

---

### 2.17 EnrollmentCertificateAPI

| | |
|---|---|
| **Property** | `client.zpa.enrollment_certificates` |
| **Class** | `EnrollmentCertificateAPI` |
| **File** | `zscaler/zpa/enrollment_certificates.py` |
| **Go parity** | ✅ `enrollmentcert/` |

Connector/Service Edge enrollment certificates.

**Methods**

| Method | Signature |
|---|---|
| `list_enrolment` | `(query_params=None) -> APIResult[List[EnrollmentCertificate]]` |
| `get_enrolment` | `(certificate_id: str, query_params=None) -> APIResult[EnrollmentCertificate]` |
| `add_enrolment` | `(**kwargs) -> APIResult[EnrollmentCertificate]` |
| `update_enrolment` | `(certificate_id: str, **kwargs) -> APIResult[EnrollmentCertificate]` |
| `delete_enrolment` | `(certificate_id: str) -> APIResult[None]` |

---

### 2.18 IDPControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.idp` |
| **Class** | `IDPControllerAPI` |
| **File** | `zscaler/zpa/idp.py` |
| **Go parity** | ✅ `idpcontroller/` |

Identity Provider (IdP) configuration. Uses both v1 and v2 endpoints.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_idps` | `(query_params=None) -> APIResult[List[IDPController]]` | `scim_enabled`, `user_attributes` query filters supported |
| `get_idp` | `(idp_id: str, query_params=None) -> APIResult[IDPController]` | |
| `add_idp` | `(**kwargs) -> APIResult[IDPController]` | |
| `update_idp` | `(idp_id: str, **kwargs) -> APIResult[IDPController]` | |
| `delete_idp` | `(idp_id: str) -> APIResult[None]` | |

---

### 2.19 InspectionControllerAPI (App Protection)

| | |
|---|---|
| **Property** | `client.zpa.app_protection` |
| **Class** | `InspectionControllerAPI` |
| **File** | `zscaler/zpa/app_protection.py` |
| **Go parity** | ✅ `inspectioncontrol/` |

Manages App Protection (Inspection) profiles and custom/predefined controls.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_profiles` | `(query_params=None) -> APIResult[List[AppProtectionProfile]]` | |
| `get_profile` | `(profile_id: str) -> APIResult[AppProtectionProfile]` | |
| `add_profile` | `(**kwargs) -> APIResult[AppProtectionProfile]` | |
| `update_profile` | `(profile_id: str, **kwargs) -> APIResult[AppProtectionProfile]` | |
| `delete_profile` | `(profile_id: str) -> APIResult[None]` | |
| `list_custom_controls` | `(query_params=None) -> APIResult[List[CustomControls]]` | |
| `get_custom_control` | `(control_id: str) -> APIResult[CustomControls]` | |
| `add_custom_control` | `(**kwargs) -> APIResult[CustomControls]` | Uses `_create_rule()` to build rule set |
| `update_custom_control` | `(control_id: str, **kwargs) -> APIResult[CustomControls]` | |
| `delete_custom_control` | `(control_id: str) -> APIResult[None]` | |
| `list_predefined_controls` | `(query_params=None) -> APIResult[List[PredefinedInspectionControlResource]]` | |
| `get_predefined_control` | `(control_id: str) -> APIResult[PredefinedInspectionControlResource]` | |
| `get_predefined_control_version` | `(version: str, query_params=None) -> APIResult[dict]` | |

---

### 2.20 MachineGroupsAPI

| | |
|---|---|
| **Property** | `client.zpa.machine_groups` |
| **Class** | `MachineGroupsAPI` |
| **File** | `zscaler/zpa/machine_groups.py` |
| **Go parity** | ✅ `machinegroup/` |

Read-only listing of machine groups.

**Methods**

| Method | Signature |
|---|---|
| `list_machine_groups` | `(query_params=None) -> APIResult[List[MachineGroup]]` |
| `get_machine_group` | `(group_id: str, query_params=None) -> APIResult[MachineGroup]` |

---

### 2.21 MicrotenantsAPI

| | |
|---|---|
| **Property** | `client.zpa.microtenants` |
| **Class** | `MicrotenantsAPI` |
| **File** | `zscaler/zpa/microtenants.py` |
| **Go parity** | ✅ `microtenants/` |

Microtenant CRUD. Uses `CommonFilterSearch` for search.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_microtenants` | `(query_params=None) -> APIResult[List[Microtenant]]` | `include_roles` query param |
| `get_microtenant` | `(microtenant_id: str, query_params=None) -> APIResult[Microtenant]` | |
| `add_microtenant` | `(**kwargs) -> APIResult[Microtenant]` | |
| `update_microtenant` | `(microtenant_id: str, **kwargs) -> APIResult[Microtenant]` | |
| `delete_microtenant` | `(microtenant_id: str) -> APIResult[None]` | |
| `get_microtenant_summary` | `(query_params=None) -> APIResult[List[Microtenant]]` | Name/ID summary only |

---

### 2.22 LSSConfigControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.lss` |
| **Class** | `LSSConfigControllerAPI` |
| **File** | `zscaler/zpa/lss.py` |
| **Go parity** | ✅ `lssconfigcontroller/` |

Log Streaming Service (LSS) receiver configuration. Uses the v2 endpoint
`/zpa/mgmtconfig/v2/admin/customers/{customer_id}/lssConfig`.

**Source log type map** (internal): `app_connector_metrics` → `zpn_ast_comprehensive_stats`,
`app_connector_status` → `zpn_ast_auth_log`, `audit_logs` → `zpn_audit_log`,
`browser_access` → `zpn_http_trans_log`, `private_svc_edge_status` → `zpn_sys_auth_log`,
`user_activity` → `zpn_trans_log`, `user_status` → `zpn_auth_log`,
`web_inspection` → `zpn_waf_http_exchanges_log`.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_configs` | `(query_params=None) -> APIResult[List[LSSResourceModel]]` | |
| `get_config` | `(lss_config_id: str, query_params=None) -> APIResult[LSSResourceModel]` | |
| `add_lss_config` | `(lss_host, lss_port, name, source_log_type, app_connector_group_ids=None, enabled=True, source_log_format="csv", use_tls=False, **kwargs) -> APIResult[dict]` | |
| `update_lss_config` | `(lss_config_id: str, **kwargs) -> APIResult[dict]` | |
| `delete_lss_config` | `(lss_config_id: str) -> APIResult[None]` | |
| `get_log_formats` | `() -> APIResult[dict]` | Returns supported log formats |
| `get_client_types` | `() -> dict` | Returns client type map (not an API call) |
| `get_status_codes` | `(log_type: str) -> APIResult[dict]` | |

---

### 2.23 PolicySetControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.policies` |
| **Class** | `PolicySetControllerAPI` |
| **File** | `zscaler/zpa/policies.py` |
| **Go parity** | ✅ `policysetcontroller/` and `policysetcontrollerv2/` |

Unified policy management across all ZPA policy types. Uses both v1 and v2
API endpoints. Rule-modifying methods (`add_*_rule`, `update_*_rule`) use a
global thread lock to prevent race conditions.

**Policy type map**: `access` → `ACCESS_POLICY`, `capabilities` → `CAPABILITIES_POLICY`,
`client_forwarding` → `CLIENT_FORWARDING_POLICY`, `clientless` → `CLIENTLESS_SESSION_PROTECTION_POLICY`,
`credential` → `CREDENTIAL_POLICY`, `portal_policy` → `PRIVILEGED_PORTAL_POLICY`,
`vpn_policy` → `VPN_TUNNEL_POLICY`, `inspection` → `INSPECTION_POLICY`,
`isolation` → `ISOLATION_POLICY`, `redirection` → `REDIRECTION_POLICY`,
`siem` → `SIEM_POLICY`, `timeout` → `TIMEOUT_POLICY`, `user_portal` → `USER_PORTAL`.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `get_policy` | `(policy_type: str, query_params=None) -> APIResult[dict]` | Returns policy set container |
| `get_rule` | `(policy_type: str, rule_id: str, query_params=None) -> APIResult[dict]` | Resolves policy set ID internally |
| `list_rules` | `(policy_type: str, query_params=None) -> APIResult[List[PolicySetControllerV1]]` | |
| `add_access_rule` | `(name: str, action: str, app_connector_group_ids=[], app_server_group_ids=[], **kwargs) -> APIResult[dict]` | `action`: `allow`\|`deny` |
| `update_access_rule` | `(rule_id: str, name=None, action=None, ..., **kwargs) -> APIResult[dict]` | |
| `add_timeout_rule` | `(**kwargs) -> APIResult[dict]` | |
| `update_timeout_rule` | `(rule_id: str, **kwargs) -> APIResult[dict]` | |
| `add_client_forwarding_rule` | `(**kwargs) -> APIResult[dict]` | |
| `update_client_forwarding_rule` | `(rule_id: str, **kwargs) -> APIResult[dict]` | |
| `add_isolation_rule` | `(**kwargs) -> APIResult[dict]` | |
| `update_isolation_rule` | `(rule_id: str, **kwargs) -> APIResult[dict]` | |
| `add_inspection_rule` | `(**kwargs) -> APIResult[dict]` | |
| `update_inspection_rule` | `(rule_id: str, **kwargs) -> APIResult[dict]` | |
| `add_credential_rule` | `(**kwargs) -> APIResult[dict]` | |
| `update_credential_rule` | `(rule_id: str, **kwargs) -> APIResult[dict]` | |
| `add_capabilities_rule` | `(**kwargs) -> APIResult[dict]` | |
| `update_capabilities_rule` | `(rule_id: str, **kwargs) -> APIResult[dict]` | |
| `add_siem_rule` | `(**kwargs) -> APIResult[dict]` | |
| `update_siem_rule` | `(rule_id: str, **kwargs) -> APIResult[dict]` | |
| `delete_rule` | `(policy_type: str, rule_id: str, microtenant_id=None) -> APIResult[None]` | |
| `reorder_rule` | `(policy_type: str, rule_id: str, rule_order: str, microtenant_id=None) -> APIResult[dict]` | |
| `bulk_delete_rules` | `(policy_type: str, rule_ids: list, microtenant_id=None) -> APIResult[None]` | |

**Conditions format** (`conditions` kwarg): list of tuples. Object type
determines structure:

```python
conditions = [
    ("app", "id", "99999"),
    ("app_group", "id", "88888"),
    ("client_type", ["zpn_client_type_zapp"]),
    ("trusted_network", [("network-udid", True)]),
    ("saml", [("attr-id", "value")]),
    ("scim_group", [("idp-id", "group-id")]),
    ("posture", [("posture-udid", True)]),
    ("country_code", [("", "US")]),
]
```

---

### 2.24 PostureProfilesAPI

| | |
|---|---|
| **Property** | `client.zpa.posture_profiles` |
| **Class** | `PostureProfilesAPI` |
| **File** | `zscaler/zpa/posture_profiles.py` |
| **Go parity** | ✅ `postureprofile/` |

Read-only listing of posture profiles. Uses both v1 and v2 endpoints.

**Methods**

| Method | Signature |
|---|---|
| `list_posture_profiles` | `(query_params=None) -> APIResult[List[PostureProfile]]` |
| `get_posture_profile` | `(profile_id: str, query_params=None) -> APIResult[PostureProfile]` |

---

### 2.25 PRAApprovalAPI

| | |
|---|---|
| **Property** | `client.zpa.pra_approval` |
| **Class** | `PRAApprovalAPI` |
| **File** | `zscaler/zpa/pra_approval.py` |
| **Go parity** | ✅ `privilegedremoteaccess/` |

Manages time-bounded access approvals for PRA sessions.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_approval` | `(query_params=None) -> APIResult[List[PrivilegedRemoteAccessApproval]]` | `sort_by`, `sort_dir` (`ASC`\|`DESC`) supported |
| `get_approval` | `(approval_id: str, query_params=None) -> APIResult[PrivilegedRemoteAccessApproval]` | |
| `add_approval` | `(**kwargs) -> APIResult[PrivilegedRemoteAccessApproval]` | Uses `validate_and_convert_times` for time fields; v1.9.34 only serializes `workingHours` when `working_hours` is explicitly provided (`vendor/zscaler-sdk-python/docsrc/zs/guides/release_notes.rst:44-55`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py:193-220`) |
| `update_approval` | `(approval_id: str, **kwargs) -> APIResult[PrivilegedRemoteAccessApproval]` | Same `working_hours` behavior as create (`vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py:285-312`) |
| `delete_approval` | `(approval_id: str, microtenant_id=None) -> APIResult[None]` | |

---

### 2.26 PRAConsoleAPI

| | |
|---|---|
| **Property** | `client.zpa.pra_console` |
| **Class** | `PRAConsoleAPI` |
| **File** | `zscaler/zpa/pra_console.py` |
| **Go parity** | ✅ `privilegedremoteaccess/` |

PRA console configuration CRUD.

**Methods**

| Method | Signature |
|---|---|
| `list_consoles` | `(query_params=None) -> APIResult[List[PrivilegedRemoteAccessConsole]]` |
| `get_console` | `(console_id: str, query_params=None) -> APIResult[PrivilegedRemoteAccessConsole]` |
| `add_console` | `(**kwargs) -> APIResult[PrivilegedRemoteAccessConsole]` |
| `update_console` | `(console_id: str, **kwargs) -> APIResult[PrivilegedRemoteAccessConsole]` |
| `delete_console` | `(console_id: str, microtenant_id=None) -> APIResult[None]` |

---

### 2.27 PRACredentialAPI

| | |
|---|---|
| **Property** | `client.zpa.pra_credential` |
| **Class** | `PRACredentialAPI` |
| **File** | `zscaler/zpa/pra_credential.py` |
| **Go parity** | ✅ `privilegedremoteaccess/` |

PRA credential vault management. SSH key validation is performed via
`is_valid_ssh_key` before submission.

**Methods**

| Method | Signature |
|---|---|
| `list_credentials` | `(query_params=None) -> APIResult[List[PrivilegedRemoteAccessCredential]]` |
| `get_credential` | `(credential_id: str, query_params=None) -> APIResult[PrivilegedRemoteAccessCredential]` |
| `add_credential` | `(**kwargs) -> APIResult[PrivilegedRemoteAccessCredential]` |
| `update_credential` | `(credential_id: str, **kwargs) -> APIResult[PrivilegedRemoteAccessCredential]` |
| `delete_credential` | `(credential_id: str, microtenant_id=None) -> APIResult[None]` |

---

### 2.28 PRACredentialPoolAPI

| | |
|---|---|
| **Property** | `client.zpa.pra_credential_pool` |
| **Class** | `PRACredentialPoolAPI` |
| **File** | `zscaler/zpa/pra_credential_pool.py` |
| **Go parity** | ✅ `privilegedremoteaccess/` |

Credential pool management (grouping of PRA credentials).

**Methods**

| Method | Signature |
|---|---|
| `list_credential_pools` | `(query_params=None) -> APIResult[List]` |
| `get_credential_pool` | `(pool_id: str, query_params=None) -> APIResult[dict]` |
| `add_credential_pool` | `(**kwargs) -> APIResult[dict]` |
| `update_credential_pool` | `(pool_id: str, **kwargs) -> APIResult[dict]` |
| `delete_credential_pool` | `(pool_id: str, microtenant_id=None) -> APIResult[None]` |

---

### 2.29 PRAPortalAPI

| | |
|---|---|
| **Property** | `client.zpa.pra_portal` |
| **Class** | `PRAPortalAPI` |
| **File** | `zscaler/zpa/pra_portal.py` |
| **Go parity** | ✅ `privilegedremoteaccess/` |

PRA portal configuration.

**Methods**

| Method | Signature |
|---|---|
| `list_portals` | `(query_params=None) -> APIResult[List[PrivilegedRemoteAccessPortal]]` |
| `get_portal` | `(portal_id: str, query_params=None) -> APIResult[PrivilegedRemoteAccessPortal]` |
| `add_portal` | `(**kwargs) -> APIResult[PrivilegedRemoteAccessPortal]` |
| `update_portal` | `(portal_id: str, **kwargs) -> APIResult[PrivilegedRemoteAccessPortal]` |
| `delete_portal` | `(portal_id: str, microtenant_id=None) -> APIResult[None]` |

---

### 2.30 ProvisioningKeyAPI

| | |
|---|---|
| **Property** | `client.zpa.provisioning` |
| **Class** | `ProvisioningKeyAPI` |
| **File** | `zscaler/zpa/provisioning.py` |
| **Go parity** | ✅ `provisioningkey/` |

Provisioning key management for connectors and service edges.
`key_type` must be `connector` or `service_edge`; the helper `simplify_key_type()`
maps these to `CONNECTOR_GRP` / `SERVICE_EDGE_GRP`.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_provisioning_keys` | `(key_type: str, query_params=None) -> APIResult[List[ProvisioningKey]]` | |
| `get_provisioning_key` | `(key_type: str, key_id: str, query_params=None) -> APIResult[ProvisioningKey]` | |
| `add_provisioning_key` | `(key_type: str, **kwargs) -> APIResult[ProvisioningKey]` | |
| `update_provisioning_key` | `(key_type: str, key_id: str, **kwargs) -> APIResult[ProvisioningKey]` | |
| `delete_provisioning_key` | `(key_type: str, key_id: str) -> APIResult[None]` | |

---

### 2.31 SAMLAttributesAPI

| | |
|---|---|
| **Property** | `client.zpa.saml_attributes` |
| **Class** | `SAMLAttributesAPI` |
| **File** | `zscaler/zpa/saml_attributes.py` |
| **Go parity** | ✅ `samlattribute/` (Create/Update/Delete confirmed) |

Full CRUD. The list methods target the v2 base endpoint
(`_zpa_base_endpoint_v2`, `saml_attributes.py:73,133`) while
get/add/update/delete target v1 (`saml_attributes.py:35,174,221,267,313`). SAML
attributes are **not** read-only.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_saml_attributes` | `(query_params=None) -> APIResult[List[SAMLAttribute]]` | v2 endpoint (`saml_attributes.py:73`) |
| `get_saml_attribute` | `(attribute_id: str, query_params=None) -> APIResult[SAMLAttribute]` | v1 (`saml_attributes.py:174`) |
| `list_saml_attributes_by_idp` | `(idp_id: str, query_params=None) -> APIResult[List[SAMLAttribute]]` | v2 endpoint (`saml_attributes.py:133`) |
| `add_saml_attribute` | `(**kwargs) -> APIResult[SAMLAttribute]` | POST v1 `/samlAttribute` (`saml_attributes.py:194,219-222`). Key kwargs: `name`, `saml_name`, `idp_id`, `idp_name`, `user_attribute` (bool) (`saml_attributes.py:199-203`) |
| `update_saml_attribute` | `(attribute_id: str, **kwargs) -> APIResult[SAMLAttribute]` | PUT v1 (`saml_attributes.py:241,265-269`) |
| `delete_saml_attribute` | `(attribute_id: str, microtenant_id=None) -> APIResult[None]` | DELETE v1 (`saml_attributes.py:292,311-315`) |

---

### 2.32 ScimAttributeHeaderAPI

| | |
|---|---|
| **Property** | `client.zpa.scim_attributes` |
| **Class** | `ScimAttributeHeaderAPI` |
| **File** | `zscaler/zpa/scim_attributes.py` |
| **Go parity** | ✅ `scimattributeheader/` |

Uses both `mgmtconfig` and `userconfig` base endpoints.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_scim_attributes` | `(idp_id: str, query_params=None) -> APIResult[List[SCIMAttributeHeader]]` | |
| `get_scim_attribute` | `(idp_id: str, attribute_id: str, query_params=None) -> APIResult[SCIMAttributeHeader]` | |
| `get_scim_values` | `(idp_id: str, attribute_id: str, query_params=None) -> APIResult[dict]` | Returns attribute value list from the `userconfig` endpoint (`scim_attributes.py:137,165-167`) |

---

### 2.33 SCIMGroupsAPI

| | |
|---|---|
| **Property** | `client.zpa.scim_groups` |
| **Class** | `SCIMGroupsAPI` |
| **File** | `zscaler/zpa/scim_groups.py` |
| **Go parity** | ✅ `scimgroup/` |

Uses the `userconfig` base endpoint (`/zpa/userconfig/v1/customers/{customer_id}`).

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_scim_groups` | `(idp_id: str, query_params=None) -> APIResult[List[SCIMGroup]]` | `idp_group_id`, `scim_user_id`, `scim_user_name`, `start_time`, `end_time`, `sort_order` supported |
| `get_scim_group` | `(idp_id: str, group_id: str, query_params=None) -> APIResult[SCIMGroup]` | |

---

### 2.34 SegmentGroupsAPI

| | |
|---|---|
| **Property** | `client.zpa.segment_groups` |
| **Class** | `SegmentGroupsAPI` |
| **File** | `zscaler/zpa/segment_groups.py` |
| **Go parity** | ✅ `segmentgroup/` |

Uses both v1 and v2 endpoints.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_groups` | `(query_params=None) -> APIResult[List[SegmentGroup]]` | |
| `get_group` | `(group_id: str, query_params=None) -> APIResult[SegmentGroup]` | |
| `add_group` | `(**kwargs) -> APIResult[SegmentGroup]` | |
| `update_group` | `(group_id: str, **kwargs) -> APIResult[SegmentGroup]` | PUT v1 `/segmentGroup/{id}` (`segment_groups.py:236-240`) |
| `update_group_v2` | `(group_id: str, **kwargs) -> APIResult[SegmentGroup]` | Identical to `update_group` but targets the v2 mgmtconfig base endpoint (`_zpa_base_endpoint_v2`, `segment_groups.py:36`); PUT v2 `/segmentGroup/{id}` (`segment_groups.py:267,297-301`) |
| `delete_group` | `(group_id: str, microtenant_id=None) -> APIResult[None]` | |

---

### 2.35 ServerGroupsAPI

| | |
|---|---|
| **Property** | `client.zpa.server_groups` |
| **Class** | `ServerGroupsAPI` |
| **File** | `zscaler/zpa/server_groups.py` |
| **Go parity** | ✅ `servergroup/` |

`server_ids` and `app_connector_group_ids` are reformatted to nested
`{"id": "..."}` structures by `add_id_groups`.

**Methods**

| Method | Signature |
|---|---|
| `list_groups` | `(query_params=None) -> APIResult[List[ServerGroup]]` |
| `get_group` | `(group_id: str, query_params=None) -> APIResult[ServerGroup]` |
| `add_group` | `(**kwargs) -> APIResult[ServerGroup]` |
| `update_group` | `(group_id: str, **kwargs) -> APIResult[ServerGroup]` |
| `delete_group` | `(group_id: str, microtenant_id=None) -> APIResult[None]` |

---

### 2.36 ServiceEdgeControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.service_edges` |
| **Class** | `ServiceEdgeControllerAPI` |
| **File** | `zscaler/zpa/service_edges.py` |
| **Go parity** | ✅ `serviceedgecontroller/` |

**Methods**

| Method | Signature |
|---|---|
| `list_service_edges` | `(query_params=None) -> APIResult[List[ServiceEdge]]` |
| `get_service_edge` | `(service_edge_id: str, query_params=None) -> APIResult[ServiceEdge]` |
| `update_service_edge` | `(service_edge_id: str, **kwargs) -> APIResult[ServiceEdge]` |
| `delete_service_edge` | `(service_edge_id: str, microtenant_id=None) -> APIResult[None]` |
| `bulk_delete_service_edges` | `(service_edge_ids: list, microtenant_id=None) -> APIResult[dict]` |

---

### 2.37 ServiceEdgeGroupAPI

| | |
|---|---|
| **Property** | `client.zpa.service_edge_group` |
| **Class** | `ServiceEdgeGroupAPI` |
| **File** | `zscaler/zpa/service_edge_group.py` |
| **Go parity** | ✅ `serviceedgegroup/` |

**Methods**

| Method | Signature |
|---|---|
| `list_service_edge_groups` | `(query_params=None) -> APIResult[List[ServiceEdgeGroup]]` |
| `get_service_edge_group` | `(group_id: str, query_params=None) -> APIResult[ServiceEdgeGroup]` |
| `add_service_edge_group` | `(**kwargs) -> APIResult[ServiceEdgeGroup]` |
| `update_service_edge_group` | `(group_id: str, **kwargs) -> APIResult[ServiceEdgeGroup]` |
| `delete_service_edge_group` | `(group_id: str, microtenant_id=None) -> APIResult[None]` |

---

### 2.38 ServiceEdgeScheduleAPI

| | |
|---|---|
| **Property** | `client.zpa.service_edge_schedule` |
| **Class** | `ServiceEdgeScheduleAPI` |
| **File** | `zscaler/zpa/service_edge_schedule.py` |
| **Go parity** | ✅ `serviceedgeschedule/` |

**Methods**

| Method | Signature |
|---|---|
| `get_service_edge_schedule` | `(customer_id=None) -> APIResult[dict]` |
| `add_service_edge_schedule` | `(**kwargs) -> APIResult[dict]` |
| `update_service_edge_schedule` | `(schedule_id: str, **kwargs) -> APIResult[dict]` |

---

### 2.39 TrustedNetworksAPI

| | |
|---|---|
| **Property** | `client.zpa.trusted_networks` |
| **Class** | `TrustedNetworksAPI` |
| **File** | `zscaler/zpa/trusted_networks.py` |
| **Go parity** | ✅ `trustednetwork/` |

Read-only. Uses both v1 and v2 endpoints.

**Methods**

| Method | Signature |
|---|---|
| `list_trusted_networks` | `(query_params=None) -> APIResult[List[TrustedNetwork]]` |
| `get_trusted_network` | `(network_id: str, query_params=None) -> APIResult[TrustedNetwork]` |

---

### 2.40 AdministratorControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.administrator_controller` |
| **Class** | `AdministratorControllerAPI` |
| **File** | `zscaler/zpa/administrator_controller.py` |
| **Go parity** | ✅ `administrator_controller/` |

Maximum 200 administrators returned per request (not 500).

**Methods**

| Method | Signature |
|---|---|
| `list_administrators` | `(query_params=None) -> APIResult[List[AdministratorController]]` |
| `get_administrator` | `(admin_id: str, query_params=None) -> APIResult[AdministratorController]` |
| `add_administrator` | `(**kwargs) -> APIResult[AdministratorController]` |
| `update_administrator` | `(admin_id: str, **kwargs) -> APIResult[AdministratorController]` |
| `delete_administrator` | `(admin_id: str, microtenant_id=None) -> APIResult[None]` |

---

### 2.41 AdminSSOControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.admin_sso_controller` |
| **Class** | `AdminSSOControllerAPI` |
| **File** | `zscaler/zpa/admin_sso_controller.py` |
| **Go parity** | ✅ `admin_sso_controller/` |

Admin SSO login configuration.

**Methods**

| Method | Signature |
|---|---|
| `list_admin_sso` | `(query_params=None) -> APIResult[List]` |
| `get_admin_sso` | `(sso_id: str) -> APIResult[dict]` |
| `update_admin_sso` | `(sso_id: str, **kwargs) -> APIResult[dict]` |

---

### 2.42 RoleControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.role_controller` |
| **Class** | `RoleControllerAPI` |
| **File** | `zscaler/zpa/role_controller.py` |
| **Go parity** | ✅ `role_controller/` |

**Methods**

| Method | Signature |
|---|---|
| `list_roles` | `(query_params=None) -> APIResult[List[RoleController]]` |
| `get_role` | `(role_id: str, query_params=None) -> APIResult[RoleController]` |
| `add_role` | `(**kwargs) -> APIResult[RoleController]` |
| `update_role` | `(role_id: str, **kwargs) -> APIResult[RoleController]` |
| `delete_role` | `(role_id: str) -> APIResult[None]` |
| `list_permission_groups` | `(query_params=None) -> APIResult[List[ClassPermissionGroups]]` |

---

### 2.43 ClientSettingsAPI

| | |
|---|---|
| **Property** | `client.zpa.client_settings` |
| **Class** | `ClientSettingsAPI` |
| **File** | `zscaler/zpa/client_settings.py` |
| **Go parity** | ✅ `client_settings/` |

**Methods**

| Method | Signature |
|---|---|
| `get_client_settings` | `(query_params=None) -> APIResult[dict]` |
| `update_client_settings` | `(**kwargs) -> APIResult[dict]` |

---

### 2.44 IPRangesAPI (C2C IP Ranges)

| | |
|---|---|
| **Property** | `client.zpa.c2c_ip_ranges` |
| **Class** | `IPRangesAPI` |
| **File** | `zscaler/zpa/c2c_ip_ranges.py` |
| **Go parity** | ✅ `c2c_ip_ranges/` |

Uses the versioned endpoint `/zpa/mgmtconfig/v1/admin/customers/{customer_id}/v2`.
Uses `CommonFilterSearch` POST-search pattern internally.

**Methods**

| Method | Signature |
|---|---|
| `list_ip_ranges` | `() -> APIResult[List[IpRanges]]` |
| `get_ip_range` | `(range_id: str) -> APIResult[IpRanges]` |

---

### 2.45 ApiKeysAPI

| | |
|---|---|
| **Property** | `client.zpa.api_keys` |
| **Class** | `ApiKeysAPI` |
| **File** | `zscaler/zpa/api_keys.py` |
| **Go parity** | ✅ `api_keys/` |

**Methods**

| Method | Signature |
|---|---|
| `list_api_keys` | `(query_params=None) -> APIResult[List[ApiKeys]]` |
| `get_api_key` | `(key_id: str, query_params=None) -> APIResult[ApiKeys]` |
| `add_api_key` | `(**kwargs) -> APIResult[ApiKeys]` |
| `update_api_key` | `(key_id: str, **kwargs) -> APIResult[ApiKeys]` |
| `delete_api_key` | `(key_id: str, microtenant_id=None) -> APIResult[None]` |
| `regenerate_api_key` | `(key_id: str) -> APIResult[ApiKeys]` |

---

### 2.46 CustomerDomainControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.customer_domain` |
| **Class** | `CustomerDomainControllerAPI` |
| **File** | `zscaler/zpa/customer_domain.py` |
| **Go parity** | ✅ `customer_domain_controller/` (read-only at the refreshed Go pin) |

**Methods**

| Method | Signature and endpoint |
|---|---|
| `list_domains` | `(type: str, query_params=None)` — GET `/v2/associationtype/{type}/domains` (`vendor/zscaler-sdk-python/zscaler/zpa/customer_domain.py:26-90`; Go: `vendor/zscaler-sdk-go/zscaler/zpa/services/customer_domain_controller/customer_domain_controller.go:12-40`). |
| `add_update_domain` | `(type: str, domain_list: list, microtenant_id=None)` — POST `/v2/associationtype/{type}/domains`; Python-only write method at this pin (`vendor/zscaler-sdk-python/zscaler/zpa/customer_domain.py:92-171`). |

The Go package decodes the GET response as a bare `[]CustomerDomainController`
and does not export a POST wrapper. The Go changelog nevertheless lists both
GET and POST for this endpoint (`vendor/zscaler-sdk-go/CHANGELOG.md:88-90`), so
the write-operation parity and the changelog wording remain an open contract
question. SDK presence is not evidence of tenant entitlement.

---

### 2.47 PrivateCloudGroupAPI

| | |
|---|---|
| **Property** | `client.zpa.private_cloud_group` |
| **Class** | `PrivateCloudGroupAPI` |
| **File** | `zscaler/zpa/private_cloud_group.py` |
| **Go parity** | ✅ `private_cloud_group/` |

**Methods**

| Method | Signature |
|---|---|
| `list_private_cloud_groups` | `(query_params=None) -> APIResult[List]` |
| `get_private_cloud_group` | `(group_id: str) -> APIResult[dict]` |

---

### 2.48 PrivateCloudControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.private_cloud_controller` |
| **Class** | `PrivateCloudControllerAPI` |
| **File** | `zscaler/zpa/private_cloud_controller.py` |
| **Go parity** | ✅ `private_cloud_controller/` |

**Methods**

| Method | Signature |
|---|---|
| `list_private_cloud_controllers` | `(query_params=None) -> APIResult[List]` |
| `get_private_cloud_controller` | `(controller_id: str) -> APIResult[dict]` |

---

### 2.49 UserPortalControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.user_portal_controller` |
| **Class** | `UserPortalControllerAPI` |
| **File** | `zscaler/zpa/user_portal_controller.py` |
| **Go parity** | ✅ `userportal/` |

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_user_portals` | `(query_params=None) -> APIResult[List[UserPortalController]]` | `ui_config` filter supported |
| `get_user_portal` | `(portal_id: str, query_params=None) -> APIResult[UserPortalController]` | |
| `add_user_portal` | `(**kwargs) -> APIResult[UserPortalController]` | |
| `update_user_portal` | `(portal_id: str, **kwargs) -> APIResult[UserPortalController]` | |
| `delete_user_portal` | `(portal_id: str, microtenant_id=None) -> APIResult[None]` | |

---

### 2.50 UserPortalLinkAPI

| | |
|---|---|
| **Property** | `client.zpa.user_portal_link` |
| **Class** | `UserPortalLinkAPI` |
| **File** | `zscaler/zpa/user_portal_link.py` |
| **Go parity** | ✅ `userportal/` |

**Methods**

| Method | Signature |
|---|---|
| `list_user_portal_links` | `(query_params=None) -> APIResult[List]` |
| `get_user_portal_link` | `(link_id: str) -> APIResult[dict]` |
| `add_user_portal_link` | `(**kwargs) -> APIResult[dict]` |
| `update_user_portal_link` | `(link_id: str, **kwargs) -> APIResult[dict]` |
| `delete_user_portal_link` | `(link_id: str) -> APIResult[None]` |

---

### 2.51 NPNClientControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.npn_client_controller` |
| **Class** | `NPNClientControllerAPI` |
| **File** | `zscaler/zpa/npn_client_controller.py` |
| **Go parity** | ✅ `np_client/` |

VPN-connected users (NPN = Network Private Access node).

**Methods**

| Method | Signature |
|---|---|
| `list_npn_clients` | `(query_params=None) -> APIResult[List]` |
| `get_npn_client` | `(client_id: str) -> APIResult[dict]` |

---

### 2.52 ConfigOverrideControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.config_override_controller` |
| **Class** | `ConfigOverrideControllerAPI` |
| **File** | `zscaler/zpa/config_override_controller.py` |
| **Go parity** | ✅ `config_override/` |

**Methods**

| Method | Signature |
|---|---|
| `list_config_overrides` | `(query_params=None) -> APIResult[List]` |
| `get_config_override` | `(override_id: str) -> APIResult[dict]` |
| `add_config_override` | `(**kwargs) -> APIResult[dict]` |
| `update_config_override` | `(override_id: str, **kwargs) -> APIResult[dict]` |
| `delete_config_override` | `(override_id: str) -> APIResult[None]` |

---

### 2.53 BranchConnectorGroupAPI

| | |
|---|---|
| **Property** | `client.zpa.branch_connector_group` |
| **Class** | `BranchConnectorGroupAPI` |
| **File** | `zscaler/zpa/branch_connector_group.py` |
| **Go parity** | ✅ `branch_connector_group/` |

**Methods**

| Method | Signature |
|---|---|
| `list_branch_connector_groups` | `(query_params=None) -> APIResult[List]` |
| `get_branch_connector_group` | `(group_id: str) -> APIResult[dict]` |

---

### 2.54 BranchConnectorControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.branch_connectors` |
| **Class** | `BranchConnectorControllerAPI` |
| **File** | `zscaler/zpa/branch_connectors.py` |
| **Go parity** | ✅ `branch_connector/` |

**Methods**

| Method | Signature |
|---|---|
| `list_branch_connectors` | `(query_params=None) -> APIResult[List[BranchConnectorController]]` |
| `get_branch_connector` | `(connector_id: str, query_params=None) -> APIResult[BranchConnectorController]` |
| `update_branch_connector` | `(connector_id: str, **kwargs) -> APIResult[BranchConnectorController]` |
| `delete_branch_connector` | `(connector_id: str) -> APIResult[None]` |

---

### 2.55 BrowserProtectionProfileAPI

| | |
|---|---|
| **Property** | `client.zpa.browser_protection` |
| **Class** | `BrowserProtectionProfileAPI` |
| **File** | `zscaler/zpa/browser_protection.py` |
| **Go parity** | ✅ `browser_protection/` |

Read-only retrieval of the active browser protection profile.

**Methods**

| Method | Signature |
|---|---|
| `list_active_browser_protection_profile` | `() -> APIResult[List[BrowserProtectionProfile]]` |

---

### 2.56 ZIACustomerConfigAPI

| | |
|---|---|
| **Property** | `client.zpa.zia_customer_config` |
| **Class** | `ZIACustomerConfigAPI` |
| **File** | `zscaler/zpa/zia_customer_config.py` |
| **Go parity** | ⚠ not confirmed |

ZIA/ZPA integration customer configuration.

**Methods**

| Method | Signature |
|---|---|
| `get_zia_customer_config` | `() -> APIResult[dict]` |
| `update_zia_customer_config` | `(**kwargs) -> APIResult[dict]` |

---

### 2.57 CustomerDRToolVersionAPI

| | |
|---|---|
| **Property** | `client.zpa.customer_dr_tool` |
| **Class** | `CustomerDRToolVersionAPI` |
| **File** | `zscaler/zpa/customer_dr_tool.py` |
| **Go parity** | ✅ `customer_dr_tool/` |

Disaster Recovery tool version management.

**Methods**

| Method | Signature |
|---|---|
| `list_dr_tool_versions` | `(query_params=None) -> APIResult[List]` |
| `get_dr_tool_version` | `(version_id: str) -> APIResult[dict]` |

---

### 2.58 ExtranetResourceAPI

| | |
|---|---|
| **Property** | `client.zpa.extranet_resource` |
| **Class** | `ExtranetResourceAPI` |
| **File** | `zscaler/zpa/extranet_resource.py` |
| **Go parity** | ✅ `extranet_resource/` |

Extranet resource management for ZPA-ZIA integration (Extranet Application).
Uses `CommonIDName` model.

**Methods**

| Method | Signature | Notes |
|---|---|---|
| `list_extranet_resources_partner` | `(query_params=None) -> APIResult[List[CommonIDName]]` | Partner view |
| `list_extranet_resources` | `(query_params=None) -> APIResult[List[CommonIDName]]` | Customer view |
| `get_extranet_resource` | `(resource_id: str, query_params=None) -> APIResult[CommonIDName]` | |
| `add_extranet_resource` | `(**kwargs) -> APIResult[CommonIDName]` | |
| `update_extranet_resource` | `(resource_id: str, **kwargs) -> APIResult[CommonIDName]` | |
| `delete_extranet_resource` | `(resource_id: str) -> APIResult[None]` | |

---

### 2.59 CloudConnectorControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.cloud_connector_controller` |
| **Class** | `CloudConnectorControllerAPI` |
| **File** | `zscaler/zpa/cloud_connector_controller.py` |
| **Go parity** | ✅ `cloud_connector/` |

Individual cloud connector instances.

**Methods**

| Method | Signature |
|---|---|
| `list_cloud_connectors` | `(query_params=None) -> APIResult[List[CloudConnectorController]]` |
| `get_cloud_connector` | `(connector_id: str, query_params=None) -> APIResult[CloudConnectorController]` |

---

### 2.60 ManagedBrowserProfileAPI

| | |
|---|---|
| **Property** | `client.zpa.managed_browser_profile` |
| **Class** | `ManagedBrowserProfileAPI` |
| **File** | `zscaler/zpa/managed_browser_profile.py` |
| **Go parity** | ✅ `managed_browser/` |

**Methods**

| Method | Signature |
|---|---|
| `list_managed_browser_profiles` | `(query_params=None) -> APIResult[List[ManagedBrowserProfile]]` |
| `get_managed_browser_profile` | `(profile_id: str, query_params=None) -> APIResult[ManagedBrowserProfile]` |
| `add_managed_browser_profile` | `(**kwargs) -> APIResult[ManagedBrowserProfile]` |
| `update_managed_browser_profile` | `(profile_id: str, **kwargs) -> APIResult[ManagedBrowserProfile]` |
| `delete_managed_browser_profile` | `(profile_id: str) -> APIResult[None]` |

---

### 2.61 OAuth2UserCodeAPI

| | |
|---|---|
| **Property** | `client.zpa.oauth2_user_code` |
| **Class** | `OAuth2UserCodeAPI` |
| **File** | `zscaler/zpa/oauth2_user_code.py` |
| **Go parity** | ✅ `oauth2_user/` |

**Methods**

| Method | Signature |
|---|---|
| `get_oauth2_user_code` | `(query_params=None) -> APIResult[dict]` |

---

### 2.62 StepUpAuthLevelAPI

| | |
|---|---|
| **Property** | `client.zpa.stepup_auth_level` |
| **Class** | `StepUpAuthLevelAPI` |
| **File** | `zscaler/zpa/stepup_auth_level.py` |
| **Go parity** | ✅ `step_up_auth/` |

Read-only listing of step-up authentication levels.

**Methods**

| Method | Signature |
|---|---|
| `get_step_up_auth_levels` | `(query_params=None) -> APIResult[List[StepUpAuthLevel]]` |

---

### 2.63 UserPortalAUPAPI

| | |
|---|---|
| **Property** | `client.zpa.user_portal_aup` |
| **Class** | `UserPortalAUPAPI` |
| **File** | `zscaler/zpa/user_portal_aup.py` |
| **Go parity** | ✅ `userportal/` |

Acceptable Use Policy configuration for user portals.

**Methods**

| Method | Signature |
|---|---|
| `get_user_portal_aup` | `(query_params=None) -> APIResult[dict]` |
| `update_user_portal_aup` | `(**kwargs) -> APIResult[dict]` |

---

### 2.64 LocationControllerAPI

| | |
|---|---|
| **Property** | `client.zpa.location_controller` |
| **Class** | `LocationControllerAPI` |
| **File** | `zscaler/zpa/location_controller.py` |
| **Go parity** | ✅ `location_controller/` |

**Methods**

| Method | Signature |
|---|---|
| `list_locations` | `(query_params=None) -> APIResult[List]` |
| `get_location` | `(location_id: str) -> APIResult[dict]` |

---

### 2.65 WorkloadTagGroupAPI

| | |
|---|---|
| **Property** | `client.zpa.workload_tag_group` |
| **Class** | `WorkloadTagGroupAPI` |
| **File** | `zscaler/zpa/workload_tag_group.py` |
| **Go parity** | ✅ `workload_tag_group/` |

**Methods**

| Method | Signature |
|---|---|
| `get_workload_tag_group_summary` | `(query_params=None) -> APIResult[List[CommonIDName]]` |

---

### 2.66 TagGroupAPI

| | |
|---|---|
| **Property** | `client.zpa.tag_group` |
| **Class** | `TagGroupAPI` |
| **File** | `zscaler/zpa/tag_group.py` |
| **Go parity** | ✅ `tag_controller/` |

Uses POST search endpoint (`/tagGroup/search`) via `_post_search_all_pages`.

**Methods**

| Method | Signature |
|---|---|
| `list_tag_groups` | `(query_params=None) -> APIResult[List[TagGroup]]` |
| `get_tag_group` | `(group_id: str, query_params=None) -> APIResult[TagGroup]` |
| `add_tag_group` | `(**kwargs) -> APIResult[TagGroup]` |
| `update_tag_group` | `(group_id: str, **kwargs) -> APIResult[TagGroup]` |
| `delete_tag_group` | `(group_id: str, microtenant_id=None) -> APIResult[None]` |
| `add_tag_to_group` | `(group_id: str, **kwargs) -> APIResult[TagGroupTag]` |
| `delete_tag_from_group` | `(group_id: str, tag_id: str) -> APIResult[None]` |

---

### 2.67 TagKeyAPI

| | |
|---|---|
| **Property** | `client.zpa.tag_key` |
| **Class** | `TagKeyAPI` |
| **File** | `zscaler/zpa/tag_key.py` |
| **Go parity** | ✅ `tag_controller/` |

Uses POST search endpoint via `_post_search_all_pages`.

**Methods**

| Method | Signature |
|---|---|
| `list_tag_keys` | `(query_params=None) -> APIResult[List]` |
| `get_tag_key` | `(key_id: str, query_params=None) -> APIResult[dict]` |
| `add_tag_key` | `(**kwargs) -> APIResult[dict]` |
| `update_tag_key` | `(key_id: str, **kwargs) -> APIResult[dict]` |
| `delete_tag_key` | `(key_id: str, microtenant_id=None) -> APIResult[None]` |

---

### 2.68 TagNamespaceAPI

| | |
|---|---|
| **Property** | `client.zpa.tag_namespace` |
| **Class** | `TagNamespaceAPI` |
| **File** | `zscaler/zpa/tag_namespace.py` |
| **Go parity** | ✅ `tag_controller/` |

Uses POST search endpoint (`/namespace/search`) via `_post_search_all_pages`.
Also defines `_post_search_all_pages` as a module-level helper used by
`TagGroupAPI` and `TagKeyAPI`.

**Methods**

| Method | Signature |
|---|---|
| `list_namespaces` | `(query_params=None) -> APIResult[List[Namespace]]` |
| `get_namespace` | `(namespace_id: str, query_params=None) -> APIResult[Namespace]` |
| `add_namespace` | `(**kwargs) -> APIResult[Namespace]` |
| `update_namespace` | `(namespace_id: str, **kwargs) -> APIResult[Namespace]` |
| `delete_namespace` | `(namespace_id: str, microtenant_id=None) -> APIResult[None]` |
| `update_namespace_status` | `(namespace_id: str, **kwargs) -> APIResult[UpdateStatusRequest]` |

---

### 2.69 PolicyGroupAPI

| | |
|---|---|
| **Property** | `client.zpa.policy_group` |
| **Class** | `PolicyGroupAPI` |
| **File** | `zscaler/zpa/policy_group.py` |
| **Base path** | `/zpa/mgmtconfig/v1/admin/customers/{customerId}` |

**Methods**

| Method | Signature and endpoint |
|---|---|
| `add_group` | `(group_set_id: str, **kwargs)` — POST `/policyGroupSet/{groupSetId}/group` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:38-96`). |
| `list_groups` | `(group_set_id: str, query_params=None)` — GET `/policyGroupSet/{groupSetId}/group/all` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:98-165`). |
| `search_groups` | `(group_set_id: str, **kwargs)` — POST `/policyGroupSet/{groupSetId}/group/search`; `group_set_id` is a required positional argument (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:167-210`). |
| `get_group` | `(group_set_id: str, group_id: str, query_params=None)` — GET `/policyGroupSet/{groupSetId}/group/{groupId}` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:250-295`). |
| `update_group` | `(group_set_id: str, group_id: str, **kwargs)` — PUT `/policyGroupSet/{groupSetId}/group/{groupId}` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:297-362`). |
| `delete_group` | `(group_set_id: str, group_id: str, microtenant_id=None)` — DELETE `/policyGroupSet/{groupSetId}/group/{groupId}` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:212-248`). |
| `reorder_group` | `(group_set_id: str, group_id: str, new_order: str, microtenant_id=None)` — PUT `/policyGroupSet/{groupSetId}/group/{groupId}/reorder/{newOrder}` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:364-388`). |

The base prefix is constructed from the configured customer ID
(`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:32-36`). List results
contain the current response page; callers use the shared response pagination
surface for subsequent pages (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:140-165`).

---

### 2.70 PolicyGroupRuleAPI

| | |
|---|---|
| **Property** | `client.zpa.policy_group_rule` |
| **Class** | `PolicyGroupRuleAPI` |
| **File** | `zscaler/zpa/policy_group_rule.py` |
| **Base path** | `/zpa/mgmtconfig/v1/admin/customers/{customerId}` |

**Methods**

| Method | Signature and endpoint |
|---|---|
| `list_rules` | `(group_set_id: str, group_id: str, query_params=None)` — GET `/policyGroupSet/{groupSetId}/group/{groupId}/rule` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_rule.py:37-104`). |
| `add_rule` | `(group_set_id: str, group_id: str, **kwargs)` — POST `/policyGroupSet/{groupSetId}/group/{groupId}/rule` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_rule.py:106-203`). |
| `get_rule` | `(group_set_id: str, group_id: str, rule_id: str, query_params=None)` — GET `/policyGroupSet/{groupSetId}/group/{groupId}/rule/{ruleId}` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_rule.py:244-292`). |
| `delete_rule` | `(group_set_id: str, group_id: str, rule_id: str, microtenant_id=None)` — DELETE `/policyGroupSet/{groupSetId}/group/{groupId}/rule/{ruleId}` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_rule.py:205-242`). |
| `reorder_rule` | `(group_set_id: str, group_id: str, rule_id: str, new_order: str, microtenant_id=None)` — PUT `/policyGroupSet/{groupSetId}/group/{groupId}/rule/{ruleId}/reorder/{newOrder}` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_rule.py:294-321`). |

There is no direct rule-update method in this controller; its exported surface
is list, create, get, delete, and reorder
(`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_rule.py:37-321`).

---

### 2.71 PolicyGroupSetAPI

| | |
|---|---|
| **Property** | `client.zpa.policy_group_set` |
| **Class** | `PolicyGroupSetAPI` |
| **File** | `zscaler/zpa/policy_group_set.py` |
| **Base path** | `/zpa/mgmtconfig/v1/admin/customers/{customerId}` |

This controller is read-only in the current Python surface:

| Method | Signature and endpoint |
|---|---|
| `list_sets` | `(query_params=None)` — GET `/policyGroupSet` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_set.py:40-103`). |
| `get_set_by_policy_type` | `(policy_type: str, query_params=None)` — GET `/policyGroupSet/policyType/{policyType}` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_set.py:105-151`). |
| `list_rules` | `(policy_type: str, query_params=None)` — GET `/policyGroupSet/policyType/{policyType}/rules` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_set.py:153-219`). |
| `get_set_summary` | `(policy_type: str, query_params=None)` — GET `/policyGroupSet/policyType/{policyType}/summary` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_set.py:221-265`). |
| `get_set_summary_stats` | `(policy_type: str, query_params=None)` — GET `/policyGroupSet/policyType/{policyType}/summaryStats` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_set.py:267-313`). |
| `get_set` | `(group_set_id: str, query_params=None)` — GET `/policyGroupSet/{groupSetId}` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_set.py:315-340`). |

Python v1.9.39 introduced all three controllers; they remain registered on the
current unified `ZPAService`
(`vendor/zscaler-sdk-python/CHANGELOG.md:115-139`;
`vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py:504-517`). The equivalent
legacy properties remain commented out, so these accessors are unified-client
only (`vendor/zscaler-sdk-python/zscaler/zpa/legacy.py:1070-1098`).

---

### 2.72 Go SDK additions at 4b710120

The Go pin adds several ZPA packages, some of which overlap Python modules with
different paths, methods, or models and some of which have no corresponding
Python service module. They are source-level client wrappers only: a package,
method, or changelog entry does not establish backend availability or tenant
entitlement. The detailed reconciliation and live-verification questions are
tracked in [`./api-divergences.md`](./api-divergences.md#pr-456-zpa-additions-executable-go-surface-versus-python-and-changelog).

| Go package | Current source-declared surface | Cross-SDK / release-note difference |
|---|---|---|
| `b2b_policy_controller` | Admin-customer `GET /policySet/rules/policyType/GLOBAL_POLICY/guest/{guestID}` through the shared all-pages paginator; returns typed `[]PolicyRule` (`vendor/zscaler-sdk-go/zscaler/zpa/services/b2b_policy_controller/b2b_policy_controller.go:13-35`; `vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:231-260`). | Python uses the non-admin customer base, also uses GET, and returns a raw response (`vendor/zscaler-sdk-python/zscaler/zpa/b2b_policy.py:23-59`). The Go changelog says PUT (`vendor/zscaler-sdk-go/CHANGELOG.md:83-87`). |
| `federated_application` | Typed paginated `GET /application/host/{hostID}` and `PUT /application/federate` (`vendor/zscaler-sdk-go/zscaler/zpa/services/federated_application/federated_application.go:28-66`). | Python lists `/application/host` without an ID and updates `/application/{application_id}` (`vendor/zscaler-sdk-python/zscaler/zpa/application_federation.py:26-68,70-104`). |
| `customer_domain_controller` | Admin-customer GET `/v2/associationtype/{type}/domains`, bare-array response; no Go write method (`vendor/zscaler-sdk-go/zscaler/zpa/services/customer_domain_controller/customer_domain_controller.go:12-40`). | Python also exposes POST `add_update_domain`, and the Go changelog lists GET plus POST (`vendor/zscaler-sdk-python/zscaler/zpa/customer_domain.py:26-90,92-171`; `vendor/zscaler-sdk-go/CHANGELOG.md:88-90`). |
| `browser_access_groups` | Admin-customer `/browserAccessGroups`; typed model with read-only `GetAll` and `Get` (`vendor/zscaler-sdk-go/zscaler/zpa/services/browser_access_groups/browser_access_groups.go:28-67,179-195`). | No corresponding Python service module is captured; the closest Python Browser Access package is for application segments (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba.py:19-31`). The PR #456 changelog list is silent (`vendor/zscaler-sdk-go/CHANGELOG.md:57-90`). |
| `one_identity_controller` | Admin-customer GET `/iamidpmapping`, returned as one typed object (`vendor/zscaler-sdk-go/zscaler/zpa/services/one_identity_controller/one_identity_controller.go:11-42`). | Python treats the same path as a list and models nested `syncVersion`, absent from the Go type (`vendor/zscaler-sdk-python/zscaler/zpa/one_identity.py:26-68`; `vendor/zscaler-sdk-python/zscaler/zpa/models/one_identity.py:59-89`). |
| `policy_group`, `policy_group_rule`, `policy_group_set` | Typed policy-group reads/update/delete/all/reorder, rule list/create/get/delete/reorder, and read-only set/rule/summary/statistics methods (`vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group/policy_group.go:37-159`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_rule/policy_group_rule.go:31-133`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_set/policy_group_set.go:29-166`). | Go `CreateRule` posts to `/policyGroupSet/{set}/rule` and Go `ReorderGroup` uses `PUT .../rule/{group}/reorder`; Python creates at `POST .../group` and reorders at `PUT .../group/{group}/reorder`, while the Go changelog describes `GET .../group` as "Add a new Policy Group" and lists reorder as POST (`vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group/policy_group.go:102-150`; `vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:38-77,364-388`; `vendor/zscaler-sdk-go/CHANGELOG.md:57-73`). |

The policy additions share `DesktopPolicyMappings`, and the v2 policy model
includes `groupId`, `linkText`, and `url` (`vendor/zscaler-sdk-go/zscaler/zpa/services/policycommon/policycommon.go:1-22`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:124-166`). The method/path conflicts above are unresolved client-contract gaps, not evidence that the service is enabled.

### 2.73 Go/Python/changelog gaps to resolve

- Confirm the B2B method and whether `/admin/customers` or `/customers` is the
  canonical base.
- Confirm whether customer-domain POST is supported even though the Go wrapper
  omits it.
- Confirm whether federated-application host-ID and application-ID routes are
  alternate operations or one SDK's stale path.
- Confirm whether Browser Access Groups is intentionally Go-only and whether
  the One Identity response is a single object or list; also resolve Python's
  `syncVersion` model field versus Go's omission.
- Confirm whether Go `CreateRule` is intentionally a policy-group-set rule
  operation and whether `ReorderGroup` should use `/rule/` or `/group/`.

## 3. Cross-cutting patterns

### 3.1 Pagination

Standard GET endpoints accept `page` (str) and `page_size` (str, max 500,
default 20) query parameters. The `ZscalerAPIResponse` object on the response
supports:

- `resp.get_results()` — returns the current page's list items
- `resp.next()` — fetches the next page; raises `StopIteration` when exhausted
- `resp.has_next()` — returns boolean (if implemented on the response class)

POST search endpoints (tag namespaces, tag groups, tag keys, C2C IP ranges)
use `pageBy: {page, pageSize, validPage, validPageSize}` in the request body.
The `_post_search_all_pages` helper in `tag_namespace.py` handles these
automatically by looping until `page >= totalPages`.

`AdministratorControllerAPI.list_administrators` has a lower max page size of
200, not 500.

### 3.2 Microtenant scoping

Most methods accept `microtenant_id` either as a keyword argument or within
`query_params`. It is translated to the `microtenantId` query parameter before
the HTTP request is sent. For POST/PUT operations it is sent as a query
parameter, not in the request body.

### 3.3 ID group reformatting

Many services define `reformat_params` lists such as:

```python
reformat_params = [
    ("server_group_ids", "serverGroups"),
    ("app_connector_group_ids", "appConnectorGroups"),
]
```

The `add_id_groups` utility in `zscaler/utils.py` uses these to transform flat
lists of string IDs in the kwargs into the nested `[{"id": "..."}]` structures
the API expects.

### 3.4 Rate limiting and retries

The underlying `RequestExecutor` performs intelligent retries on transient
failures. Rate limiting behaviour and retry counts are not exposed as
configurable parameters in the service-level API; they are managed by the
executor. There is no SDK-level rate-limit header parsing documented in the
service files.

### 3.5 Error handling

Errors are returned as the third tuple element. Sources:
- `ValueError` — raised by parameter validation (e.g., mixed port range
  formats, invalid key type, invalid policy type)
- `TypeError` — raised by condition builder (`_create_rule`)
- HTTP error strings — formatted by the response executor
- Exception objects — from model construction failures

The SDK does not use Python exceptions for HTTP errors by default; callers
must inspect the third tuple element.

### 3.6 Thread safety

`PolicySetControllerAPI` rule-mutation methods (`add_*_rule`, `update_*_rule`)
use a module-level `threading.Lock` (`global_rule_lock`) to serialize
concurrent rule writes. No other service applies locking.

### 3.7 CSV export

`ApplicationSegmentAPI.application_segment_export` is the only method that
sets a non-JSON `Accept` header (`text/csv`) and returns a raw string rather
than a model instance.

---

## 4. Open questions / clarifications register

Source: `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba.py`; `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py`.

**zpa-sdk-01** — Resolved 2026-04-26. `app_segments_ba.py` and `application_segment.py` both call `/application` but are differentiated by a helper method `get_segments_by_type(application_type="BROWSER_ACCESS")` in `application_segment.py` (line 416). `app_segments_ba` is a convenience wrapper that targets only Browser Access segments without requiring the caller to pass a type filter. Both service modules are legitimate; `app_segments_ba` should be used when working exclusively with Browser Access segments.

Source: `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba.py`; `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba_v2.py`.

**zpa-sdk-02** — V1 vs V2 Browser Access segment modules: the endpoint URL appears identical in both. The distinction likely relates to the underlying request/response model (v2 may use a different pagination or field structure). For new integrations use `app_segments_ba_v2.py` if it is the more recent module; but this cannot be confirmed without a live API test.

**zpa-sdk-03** — Method lists for `CustomerDomainControllerAPI`, `UserPortalAUPAPI`, `ConfigOverrideControllerAPI`, `NPNClientControllerAPI` remain inferred from module structure. These were not fully read in the available review window.

**zpa-sdk-04** — `customer_dr_tool.py`, `oauth2_user_code.py`, `location_controller.py` write operations not fully confirmed from available sources.

**zpa-sdk-05** — `AdminSSOControllerAPI` method list is an inference from module structure. The Python file was not fully read in the available review window.

**zpa-sdk-06** — `ZIACustomerConfigAPI.update_zia_customer_config` HTTP method (PUT vs PATCH) not confirmed from available sources.

**zpa-sdk-07** — Resolved 2026-04-26. `portal_policy` and `user_portal` are present in `POLICY_MAP` (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py`, lines 64 and 71) and map to `PRIVILEGED_PORTAL_POLICY` and `USER_PORTAL` respectively. They are usable in `get_policy()` and `list_rules()` — the method uses `POLICY_MAP.get(policy_type)` without type-filtering these values, so they work the same as any other policy type. However, they are omitted from the docstring's "Accepted values" list, meaning they are undocumented but functional. Whether `add_rule`, `update_rule`, and `delete_rule` also work for these policy types requires live API confirmation.

**zpa-sdk-08** — Resolved 2026-04-26. `IPRangesAPI` (C2C IP Ranges) uses `_zpa_base_endpoint = f"/zpa/mgmtconfig/v1/admin/customers/{customer_id}/v2"` (source: `vendor/zscaler-sdk-python/zscaler/zpa/c2c_ip_ranges.py`, line 35). The `/v2` is a literal path suffix appended to the v1 admin customer base — making the full path `/zpa/mgmtconfig/v1/admin/customers/{id}/v2/...`. The same pattern appears in `customer_domain.py`. This is intentional API design (not a bug) — these endpoints are under a v2 sub-path within the v1 admin API namespace.

Source: `vendor/zscaler-sdk-python/zscaler/zpa/emergency_access.py`.

**zpa-sdk-09** — Resolved 2026-04-26. `emergency_access.py` uses `page_id` (not `page`) as its pagination parameter. Line 45 docstring explicitly lists `page_id` as the page number parameter. This appears to be specific to the emergency access endpoint's pagination contract; it is not a defect.

**zpa-sdk-10** — Go SDK parity for `zia_customer_config`, `user_portal_aup`, and `workload_tag_group` was not confirmed in the reviewed Go SDK directory listing. `customer_domain` is now confirmed by `customer_domain_controller/` at Go `4b710120`; its write-operation parity remains an open question (see §2.46 and §2.72).
