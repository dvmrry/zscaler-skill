---
product: zidentity
topic: "zidentity-user-entitlements"
title: "ZIdentity user entitlements — read-only admin & service entitlement query API"
content-type: reference
last-verified: "2026-05-05"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/common.py"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go"
  - "vendor/zscaler-sdk-go/tests/unit/zid/services/user_entitlement_test.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-help/what-zidentity.md"
  - "vendor/zscaler-help/zidentity-about-api-clients.md"
author-status: draft
---

# ZIdentity user entitlements — read-only admin & service entitlement query API

ZIdentity maintains two separate entitlement records per user: **admin entitlements** (role + scope + service, one record per Zscaler product the user has admin access to) and **service entitlements** (flat list of Zscaler products the user can access). Both are query-only.

> **This is the deep-dive reference.** For role-assignment workflow, federation context, and the full ZIdentity 25-module permission matrix, see [`admin-rbac.md`](./admin-rbac.md).

ZIdentity is described by Zscaler as "a unified identity service for Zscaler that centralizes and simplifies identity management, user authentication, and entitlement assignment for users to Zscaler services, such as Internet & SaaS (ZIA), Private Access (ZPA), etc." (`vendor/zscaler-help/what-zidentity.md`). API clients access Zscaler resources "across all Zscaler services with entitlements via role-based access control." (`vendor/zscaler-help/zidentity-about-api-clients.md:16-22`)

## Read-only surface

**No mutation endpoints exist.** Both SDKs expose only `Get*` functions. There are no `Create*`, `Update*`, `Assign*`, or `Delete*` methods for entitlements in either the Python or Go SDK, and the Postman collection contains only two GET items under entitlements — no POST/PUT/PATCH/DELETE variants.

This is by design: admin role assignment is performed through the Zscaler Admin Console UI, not via API. See [`admin-rbac.md`](./admin-rbac.md) for the assignment workflow.

## Base endpoints

| SDK | Base constant | Citation |
|---|---|---|
| Python (`EntitlementAPI`) | `/ziam/admin/api/v1` | `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:31` |
| Go (`user_entitlement` package) | `/admin/api/v1/users` | `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:12` |

The Python base includes the `/ziam` prefix absent from the Go constant. The full wire paths are functionally equivalent once the Go base has the user-ID and suffix appended.

## Python SDK methods

Class `EntitlementAPI` in `zscaler/zid/user_entitlement.py`. All methods return a 3-tuple `(result, response, error)`.

| Method | HTTP | Path | Return type | Citation |
|---|---|---|---|---|
| `get_admin_entitlement(user_id: str)` | GET | `/ziam/admin/api/v1/users/{user_id}/admin-entitlements` | `Entitlements` wrapper (`.entitlements` list) | `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:37-79` |
| `get_service_entitlement(user_id: str)` | GET | `/ziam/admin/api/v1/users/{user_id}/service-entitlements` | `Service` collection | `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:81-123` |

`get_admin_entitlement` deserializes the response into an `Entitlements` wrapper object, which holds the list at `.entitlements`. (`vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:71,76`)

`get_service_entitlement` deserializes into a `Service` object constructed from the raw response body. (`vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:115,120`)

## Go SDK functions

Package `user_entitlement` in `zscaler/zid/services/user_entitlement/user_entitlement.go`. All functions take `ctx context.Context, service *zscaler.Service, userID string`.

| Function | HTTP | Path | Return type | Citation |
|---|---|---|---|---|
| `GetAdminEntitlement(ctx, service, userID)` | GET | `/admin/api/v1/users/{userID}/admin-entitlements` | `([]Entitlements, error)` | `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:34-43` |
| `GetServiceEntitlement(ctx, service, userID)` | GET | `/admin/api/v1/users/{userID}/service-entitlements` | `([]Service, error)` | `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:45-54` |

Both functions return slices directly. There is no wrapper object.

## Postman collection endpoints

Variable `{{ZIAMBase}}` resolves to the ZIdentity ZIAM base URL.

| Method | Path | Description | Response codes | Citation |
|---|---|---|---|---|
| GET | `{{ZIAMBase}}/users/:id/admin-entitlements` | "Retrieves the administrative entitlements for a specific user by their user ID." | 200, 401 | `vendor/zscaler-api-specs/oneapi-postman-collection.json:132388-132675` |
| GET | `{{ZIAMBase}}/users/:id/service-entitlements` | "Retrieves service entitlements for a specified user ID." | 200, 401 | `vendor/zscaler-api-specs/oneapi-postman-collection.json:132676-132812` |

Both entries document only `200 OK` and `401 Unauthorized`. No other response codes are enumerated.

## Entitlement model — Python

### `Entitlement` (single record)

`vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py:23-74`

| Python attr | Wire key | Type | Default | Citation |
|---|---|---|---|---|
| `roles` | `roles` | `List[CommonIDNameDisplayName]` | `[]` | `models/user_entitlement.py:38-40` |
| `service` | `service` | `Service` (nested) | `None` | `models/user_entitlement.py:42-50` |
| `scope` | `scope` | `CommonIDNameDisplayName` (singular) | `None` | `models/user_entitlement.py:52-60` |

`request_format()` at `models/user_entitlement.py:67-74` serializes to camelCase keys for API requests.

### `Entitlements` (collection wrapper)

`vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py:123-149`

Holds `entitlements: List[Entitlement]`. The list is populated at line 138 via `ZscalerCollection.form_list()`. This is the type returned by `get_admin_entitlement()`.

```python
# Accessing admin entitlements (Python)
entitlements_obj, _, error = client.zid.user_entitlement.get_admin_entitlement(user_id)
for ent in entitlements_obj.entitlements:
    print(ent.service.service_name, ent.scope.name, [r.name for r in ent.roles])
```

### `Service` (service identity)

`vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py:77-120`

| Python attr | Wire key | Type | Citation |
|---|---|---|---|
| `id` | `id` | `str` | `models/user_entitlement.py:92` |
| `service_name` | `serviceName` | `str` | `models/user_entitlement.py:93` |
| `cloud_name` | `cloudName` | `str` | `models/user_entitlement.py:94` |
| `cloud_domain_name` | `cloudDomainName` | `str` | `models/user_entitlement.py:95` |
| `org_name` | `orgName` | `str` | `models/user_entitlement.py:96` |
| `org_id` | `orgId` | `str` | `models/user_entitlement.py:97` |

### `CommonIDNameDisplayName` (shared base)

`vendor/zscaler-sdk-python/zscaler/zid/models/common.py:21-55`

Used for both individual role entries and the `scope` field.

| Python attr | Wire key | Type | Citation |
|---|---|---|---|
| `id` | `id` | `str` | `models/common.py:36` |
| `name` | `name` | `str` | `models/common.py:37` |
| `display_name` | `displayName` | `str` | `models/common.py:38` |

## Entitlement model — Go

### `Entitlements` struct

`vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:15-19`

| Go field | JSON key | Type | Citation |
|---|---|---|---|
| `Roles` | `roles` | `[]common.IDNameDisplayName` | `user_entitlement.go:16` |
| `Scope` | `scope` | `common.IDNameDisplayName` | `user_entitlement.go:17` |
| `Service` | `service` | `Service` | `user_entitlement.go:18` |

### `Service` struct

`vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:25-32`

| Go field | JSON key | Type | Citation |
|---|---|---|---|
| `ID` | `id` | `string` | `user_entitlement.go:26` |
| `ServiceName` | `serviceName` | `string` | `user_entitlement.go:27` |
| `CloudName` | `cloudName` | `string` | `user_entitlement.go:28` |
| `CloudDomainName` | `cloudDomainName` | `string` | `user_entitlement.go:29` |
| `OrgName` | `orgName` | `string` | `user_entitlement.go:30` |
| `OrgID` | `orgId` | `string` | `user_entitlement.go:31` |

### `IDNameDisplayName` (shared)

`vendor/zscaler-sdk-go/zscaler/zid/services/common/common.go:14-18`

| Go field | JSON key | Type |
|---|---|---|
| `ID` | `id` | `string` |
| `Name` | `name` | `string` |
| `DisplayName` | `displayName` | `string` |

### `Scope` struct (defined but unused)

`vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:21-23`

```go
type Scope struct {
    Scope []common.IDNameDisplayName `json:"scope,omitempty"`
}
```

This struct is **declared but not returned by any public function**. `GetAdminEntitlement` returns `[]Entitlements`, where `Entitlements.Scope` is a singular `common.IDNameDisplayName` (not a slice). The `Scope` struct appears to have been scaffolded for a list-of-scopes case that does not match the current API response shape.

## Scope and roles deep dive

### Scope field

`scope` is a **singular** `CommonIDNameDisplayName` / `common.IDNameDisplayName` in both SDKs — one scope per entitlement record. (`models/user_entitlement.py:52-60`, `user_entitlement.go:17`)

Observed `scope.name` values from test fixtures: `Global`, `Limited`, `AllResources`. (`vendor/zscaler-sdk-go/tests/unit/zid/services/user_entitlement_test.go:25-29`, `:56-60`, `:222-226`) **No enum constants are exported by either SDK.** These values come from test fixtures only; the live API may return other values.

### Roles field

`roles` is a **list** of `CommonIDNameDisplayName` / `common.IDNameDisplayName` entries — a user may have multiple roles within a single service entitlement. (`models/user_entitlement.py:38-40`, `user_entitlement.go:16`)

Observed `role.name` values from test fixtures: `SuperAdmin`, `Admin`, `ReadOnly`, `PolicyAdmin`, `Auditor`. (`vendor/zscaler-sdk-go/tests/unit/zid/services/user_entitlement_test.go:219-244`) **No enum constants are exported by either SDK.** Test-fixture values only.

### Admin vs service entitlement payload asymmetry

Admin entitlements include `roles + scope + service` per record. Service entitlements are flat: only service identity fields (`id`, `serviceName`, `cloudName`, `cloudDomainName`, `orgName`, `orgId`), with no roles or scope. Querying which role a user holds on ZIA requires the admin endpoint, not the service endpoint.

## Cross-product mapping

A single user can have **multiple admin entitlement records**, one per Zscaler product. The test fixture for `GetAdminEntitlement` returns an array of two records — one for ZPA with role `Admin` + scope `Global`, one for ZIA with role `ReadOnly` + scope `Limited`. (`vendor/zscaler-sdk-go/tests/unit/zid/services/user_entitlement_test.go:123-167`)

Confirmed `serviceName` values appearing in test fixtures: `ZPA`, `ZIA`, `ZDX`. (`vendor/zscaler-sdk-go/tests/unit/zid/services/user_entitlement_test.go:169-211`)

## SDK divergences

| Aspect | Python | Go | Citations |
|---|---|---|---|
| `get_admin_entitlement` return | `Entitlements` wrapper — access list at `.entitlements` | `[]Entitlements` slice directly | Python: `user_entitlement.py:71,76`; Go: `user_entitlement.go:34-43` |
| `get_service_entitlement` return | `Service` object (constructed from raw response body) | `[]Service` slice directly | Python: `user_entitlement.py:115,120`; Go: `user_entitlement.go:45-54` |
| Scope field type | `CommonIDNameDisplayName` (singular) | `common.IDNameDisplayName` (singular) | Python: `models/user_entitlement.py:52-60`; Go: `user_entitlement.go:17` |
| Unused `Scope` struct | Not present | Present (`user_entitlement.go:21-23`) — defined, not returned | Go: `user_entitlement.go:21-23` |
| Endpoint base constant | `/ziam/admin/api/v1` | `/admin/api/v1/users` | Python: `user_entitlement.py:31`; Go: `user_entitlement.go:12` |

The Python-wraps-Go return-type divergence is the most significant practical difference: Python callers must unpack `result.entitlements` to iterate records from `get_admin_entitlement`, while Go callers iterate the slice directly. For `get_service_entitlement`, the Go return is `[]Service`, but the Python return is a single `Service` object constructed from the raw response — behavior for multi-service responses may differ between SDKs.

## Gaps

1. **No role/scope enums exported** — observed values (`SuperAdmin`, `Admin`, `ReadOnly`, `PolicyAdmin`, `Auditor`, `Global`, `Limited`, `AllResources`) appear only in test fixtures. Neither SDK exports constants. (`vendor/zscaler-sdk-go/tests/unit/zid/services/user_entitlement_test.go:219-244`)

2. **No IdP-source distinction** — both SDKs accept only `user_id` as input. Neither distinguishes user provisioning source (SCIM, JIT, UI, API) when querying entitlements. The Users API carries a `source` field (see [`users.md`](./users.md)) but the entitlement API does not propagate it. Whether behavior differs for SCIM-provisioned vs ZIdentity-internal users is not addressed in either SDK.

3. **`Scope` struct forward-compat** — the Go SDK declares a `Scope` struct that wraps a `[]common.IDNameDisplayName` slice, but the actual `Entitlements.Scope` field is a single `IDNameDisplayName`. If the API ever returns a scope list, only the Go struct has any scaffolding for it. (`vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:21-23`)

## Open questions

- **`scope` field semantics** — the field is populated but no enum is documented in vendor sources. Values `Global`, `Limited`, `AllResources` are observed in test fixtures only (`vendor/zscaler-sdk-go/tests/unit/zid/services/user_entitlement_test.go:25-29`). The operational meaning of each scope value (e.g., what resources "Limited" restricts access to) is not stated in either SDK. — *unverified, requires vendor documentation or tenant-side check*

- **`get_service_entitlement` Python return shape for multi-service users** — the Go SDK returns `[]Service` for service entitlements, but the Python SDK constructs a single `Service` object from the raw response body (`user_entitlement.py:120`). How the Python SDK behaves when a user has multiple service entitlements is not demonstrated in test fixtures or docstrings. — *unverified, requires lab test or source inspection of `form_response_body` behavior on arrays*

- **IdP-source behavior difference** — whether the entitlement API returns different results for SCIM-provisioned vs ZIdentity-internal users is not addressed by either SDK. The `source` field on the user record (see [`users.md`](./users.md)) provides user origin, but no entitlement endpoint accepts or exposes it. — *unverified, requires tenant-side check*

- **Scope forward-compatibility** — the unused `Scope` struct in the Go SDK (`user_entitlement.go:21-23`) suggests a list-of-scopes design was considered or may be planned. Whether the API wire format will ever change from a single scope object to a list is unknown. — *unverified, requires vendor API spec or changelog review*

- **Role enum completeness** — observed role names (`SuperAdmin`, `Admin`, `ReadOnly`, `PolicyAdmin`, `Auditor`) in test fixtures may not be exhaustive. No enum constants are exported. — *requires vendor role documentation or live API enumeration*

## Cross-links

- [`admin-rbac.md`](./admin-rbac.md) — federation context, role assignment via UI, ZIdentity 25-module permission matrix; lists Administrative Entitlements and Service Entitlements as permission modules; covers the full role-assignment workflow
- [`users.md`](./users.md) — user-side `source` field (`UI`, `API`, `SCIM`, `JIT`); relevant to the IdP-source open question above
- [`api-clients.md`](./api-clients.md) — entitlements gate API client access to specific services; scopes on the client determine which ZIdentity service APIs it can reach
