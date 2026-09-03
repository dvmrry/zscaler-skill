---
product: zidentity
topic: "zidentity-user-entitlements"
title: "ZIdentity user entitlements — read-only admin & service entitlement query API"
content-type: reference
last-verified: "2026-06-15"
verified-against:
  vendor/zscaler-api-specs: 10291a2d91e2d8d1188461c65bf67b8cb1b140cf
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
  vendor/zscaler-sdk-go: 4b7101202cde25e1e60552f1cb215d2c70cdc3bd
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/common.py"
  - "vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go"
  - "vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go"
  - "vendor/zscaler-sdk-go/tests/unit/ziam/services/user_entitlement_test.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-help/what-zidentity.md"
  - "vendor/zscaler-help/zidentity-about-api-clients.md"
author-status: draft
---

# ZIdentity user entitlements — read-only admin & service entitlement query API

Source: `vendor/zscaler-help/what-zidentity.md`; `vendor/zscaler-help/zidentity-about-api-clients.md`; `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`.

ZIdentity maintains two separate entitlement records per user: **admin entitlements** (role + scope + service, one record per Zscaler product the user has admin access to) and **service entitlements** (flat list of Zscaler products the user can access). Both are query-only.

> **This is the deep-dive reference.** For role-assignment workflow, federation context, and the full ZIdentity 25-module permission matrix, see [`admin-rbac.md`](./admin-rbac.md).

ZIdentity is described by Zscaler as "a unified identity service for Zscaler that centralizes and simplifies identity management, user authentication, and entitlement assignment for users to Zscaler services, such as Internet & SaaS (ZIA), Private Access (ZPA), etc." (`vendor/zscaler-help/what-zidentity.md`). API clients access Zscaler resources "across all Zscaler services with entitlements via role-based access control." (`vendor/zscaler-help/zidentity-about-api-clients.md:16-22`)

## Read-only surface

Source: `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

**No mutation endpoints exist.** Both SDKs expose only `Get*` functions. There are no `Create*`, `Update*`, `Assign*`, or `Delete*` methods for entitlements in either the Python or Go SDK, and the Postman collection contains only two GET items under entitlements — no POST/PUT/PATCH/DELETE variants.

This is by design: admin role assignment is performed through the Zscaler Admin Console UI, not via API. See [`admin-rbac.md`](./admin-rbac.md) for the assignment workflow.

## Base endpoints

Source: `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`.

| SDK | Base constant | Citation |
|---|---|---|
| Python (`EntitlementAPI`) | `/ziam/admin/api/v1` | `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:31` |
| Go (`user_entitlement` package) | `/ziam/admin/api/v1/users` | `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:11-13` |

Both current SDKs include the `/ziam` prefix. The Go constant includes the `/users` collection segment, while the Python service keeps `/ziam/admin/api/v1` as its base and appends `/users/{id}/...` in each method. The previous bare-prefix Go constant was removed with the old `zid` package; the refreshed source does not establish a second host or route.

## Python SDK methods

Source: `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`.

Class `EntitlementAPI` in `zscaler/zid/user_entitlement.py`. All methods return a 3-tuple `(result, response, error)`.

| Method | HTTP | Path | Return type | Citation |
|---|---|---|---|---|
| `get_admin_entitlement(user_id: str)` | GET | `/ziam/admin/api/v1/users/{user_id}/admin-entitlements` | `Entitlements` wrapper (`.entitlements` list) | `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:37-79` |
| `get_service_entitlement(user_id: str)` | GET | `/ziam/admin/api/v1/users/{user_id}/service-entitlements` | `Service` collection | `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:81-123` |

`get_admin_entitlement` deserializes the response into an `Entitlements` wrapper object, which holds the list at `.entitlements`. (`vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:71,76`)

`get_service_entitlement` deserializes into a `Service` object constructed from the raw response body. (`vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:115,120`)

## Go SDK functions

Source: `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`.

Package `user_entitlement` in `zscaler/ziam/services/user_entitlement/user_entitlement.go`. All functions take `ctx context.Context, service *zscaler.Service, userID string`.

| Function | HTTP | Path | Return type | Citation |
|---|---|---|---|---|
| `GetAdminEntitlement(ctx, service, userID)` | GET | `/ziam/admin/api/v1/users/{userID}/admin-entitlements` | `([]Entitlements, error)` | `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:50-58` |
| `GetServiceEntitlement(ctx, service, userID)` | GET | `/ziam/admin/api/v1/users/{userID}/service-entitlements` | `([]ServiceEntitlement, error)` | `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:61-74` |

Both functions return slices directly. `GetServiceEntitlement` now returns `[]ServiceEntitlement`, whose elements wrap the nested `service` object; it no longer decodes directly into `[]Service`.

## Postman collection endpoints

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

Variable `{{ZIAMBaseUrl}}` resolves to the ZIdentity ZIAM base URL.

| Method | Path | Description | Response codes | Citation |
|---|---|---|---|---|
| GET | `{{ZIAMBaseUrl}}/users/:id/admin-entitlements` | "Retrieves the administrative entitlements for a specific user by their user ID." | 200, 401 | `vendor/zscaler-api-specs/oneapi-postman-collection.json:132388-132498` |
| GET | `{{ZIAMBaseUrl}}/users/:id/service-entitlements` | "Retrieves service entitlements for a specified user ID." | 200, 401 | `vendor/zscaler-api-specs/oneapi-postman-collection.json:132676-132786` |

Both entries document only `200 OK` and `401 Unauthorized`. No other response codes are enumerated.

## Entitlement model — Python

Source: `vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py`; `vendor/zscaler-sdk-python/zscaler/zid/models/common.py`.

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

Source: `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`; `vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go`.

### `Entitlements` struct

`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:24-28`

| Go field | JSON key | Type | Citation |
|---|---|---|---|
| `Roles` | `roles` | `[]common.IDNameDisplayName` | `user_entitlement.go:25` |
| `Scope` | `scope` | `*common.IDNameDisplayName` | `user_entitlement.go:26` |
| `Service` | `service` | `*Service` | `user_entitlement.go:27` |

### `Service` struct

`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:30-48`

| Go field | JSON key | Type | Citation |
|---|---|---|---|
| `ID` | `id` | `string` | `user_entitlement.go:42` |
| `ServiceName` | `serviceName` | `string` | `user_entitlement.go:43` |
| `CloudName` | `cloudName` | `string` | `user_entitlement.go:44` |
| `CloudDomainName` | `cloudDomainName` | `string` | `user_entitlement.go:45` |
| `OrgName` | `orgName` | `string` | `user_entitlement.go:46` |
| `OrgID` | `orgId` | `string` | `user_entitlement.go:47` |

### `IDNameDisplayName` (shared)

`vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go:13-18`

| Go field | JSON key | Type |
|---|---|---|
| `ID` | `id` | `string` |
| `Name` | `name` | `string` |
| `DisplayName` | `displayName` | `string` |

### Scope shape and service-entitlement envelope

The refreshed Go package no longer declares the old unused `Scope` wrapper. Its
`Entitlements.Scope` is a pointer to one `common.IDNameDisplayName`, and
`Entitlements.Service` is a pointer because both keys are optional in the
response (`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:18-28`).
Service entitlements are represented by a separate `ServiceEntitlement` envelope
whose `Service` field is a pointer (`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:30-39`). The current source comments explain
that decoding the response directly into `[]Service` previously produced
zero-valued elements because the wire objects wrap `service` (`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:30-36`).

## Scope and roles deep dive

Source: `vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`.

### Scope field

`scope` is a **singular** `CommonIDNameDisplayName` / pointer to one `common.IDNameDisplayName` in the refreshed Go model — one scope per entitlement record. (`models/user_entitlement.py:52-60`, `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:24-28`)

Fixture examples include `Global`, `Limited`, `GlobalScope`, `AllResources`, `Scope1`, and `Scope2`. These values are examples only: **no enum constants are exported by either SDK**, and the live API may return other values.

### Roles field

`roles` is a **list** of `CommonIDNameDisplayName` / `common.IDNameDisplayName` entries — a user may have multiple roles within a single service entitlement. (`models/user_entitlement.py:38-40`, `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:24-28`)

Fixture examples include `SuperAdmin`, `Admin`, `ReadOnly`, `PolicyAdmin`, and `Auditor`. These values are examples only: **no enum constants are exported by either SDK**.

### Admin vs service entitlement payload asymmetry

Admin entitlements include `roles + scope + service` per record. Service-entitlement response elements carry a nested `service` object with only service identity fields (`id`, `serviceName`, `cloudName`, `cloudDomainName`, `orgName`, `orgId`), with no roles or scope; the refreshed Go model preserves that envelope in `ServiceEntitlement`. Querying which role a user holds on ZIA requires the admin endpoint, not the service endpoint.

## Cross-product mapping

Source: `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`; `vendor/zscaler-help/what-zidentity.md`; `vendor/zscaler-help/zidentity-about-api-clients.md`.

A single user can have **multiple admin entitlement records**, one per Zscaler product. The SDK return shapes support that: Go returns `[]Entitlements` from `GetAdminEntitlement`, and Python wraps a list of `Entitlement` objects in `Entitlements.entitlements`.

Fixture examples include `serviceName` values `ZPA`, `ZIA`, and `ZDX`; treat these as examples, not an exhaustive service enum.

## SDK divergences

Source: `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`.

| Aspect | Python | Go | Citations |
|---|---|---|---|
| `get_admin_entitlement` return | `Entitlements` wrapper — access list at `.entitlements` | `[]Entitlements` slice directly | Python: `user_entitlement.py:71,76`; Go: `user_entitlement.go:50-58` |
| `get_service_entitlement` return | `Service` object (constructed from raw response body) | `[]ServiceEntitlement` envelope slice; each element has a `Service` pointer | Python: `user_entitlement.py:115,120`; Go: `user_entitlement.go:30-39,61-74` |
| Scope field type | `CommonIDNameDisplayName` (singular) | `*common.IDNameDisplayName` (singular, optional) | Python: `models/user_entitlement.py:52-60`; Go: `user_entitlement.go:24-28` |
| `Scope` wrapper | Not present | Removed from the refreshed package; only the pointer field remains | Go: `user_entitlement.go:24-39` |
| Endpoint base constant | `/ziam/admin/api/v1` | `/ziam/admin/api/v1/users` | Python: `user_entitlement.py:31`; Go: `user_entitlement.go:11-13` |

The Python-wraps-Go return-type divergence is the most significant practical difference: Python callers must unpack `result.entitlements` to iterate records from `get_admin_entitlement`, while Go callers iterate the slice directly. For `get_service_entitlement`, the refreshed Go return is `[]ServiceEntitlement` (an envelope around each nested `service` object), while the Python return is a single `Service` object constructed from the raw response — behavior for multi-service responses may differ between SDKs.

## Gaps

Source: `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`.

1. **No role/scope enums exported** — fixture examples include role names such as `SuperAdmin`, `Admin`, `ReadOnly`, `PolicyAdmin`, and `Auditor`, and scope names such as `Global`, `Limited`, and `AllResources`. Because these come from unit fixtures rather than exported constants, treat them as observed examples only.

2. **No IdP-source distinction** — both SDKs accept only `user_id` as input. Neither distinguishes user provisioning source (SCIM, JIT, UI, API) when querying entitlements. The Users API carries a `source` field (see [`users.md`](./users.md)) but the entitlement API does not propagate it. Whether behavior differs for SCIM-provisioned vs ZIdentity-internal users is not addressed in either SDK.

3. **No exported list-of-scopes scaffold at the refreshed Go pin** — the old Go `Scope` wrapper was removed with the `zid` package. The current `Entitlements.Scope` is a pointer to one `common.IDNameDisplayName` (`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:24-28`). A future list-shaped wire response would therefore still require a model change; neither SDK documents such a response.

## Open questions

Source: `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go`.

- **`scope` field semantics** — the field is populated but no enum is documented in vendor sources. Fixture examples include `Global`, `Limited`, and `AllResources`, but the operational meaning of each scope value (e.g., what resources "Limited" restricts access to) is not stated in either SDK. — *unverified, requires vendor documentation or tenant-side check* — see [clarification `zid-05`](../_meta/clarifications.md#zid-05-scope-field-semantics-and-value-enum)

- **`get_service_entitlement` Python return shape for multi-service users** — the refreshed Go SDK returns `[]ServiceEntitlement`, where each element wraps a `Service` object (`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:30-39,61-74`), but the Python SDK constructs a single `Service` object from the raw response body at `user_entitlement.py:118` (`Service(self.form_response_body(response.get_body()))`). The construction mechanism is now traced, but the wire-level behavior for a user with multiple service entitlements is still undemonstrated in fixtures: a single `Service.__init__` over an array-shaped body would parse it oddly rather than yield a list. Contrast `get_admin_entitlement`, whose `Entitlements.__init__` (`models/user_entitlement.py:139`) does `form_list(config if isinstance(config, list) else [], Entitlement)` — so it yields an **empty** `.entitlements` list whenever the response body is not a top-level JSON array. — *unverified, requires lab test to confirm the live service-entitlement body shape* — see [clarification `zid-07`](../_meta/clarifications.md#zid-07-get_service_entitlement-return-shape-for-multi-service-users)

- **IdP-source behavior difference** — whether the entitlement API returns different results for SCIM-provisioned vs ZIdentity-internal users is not addressed by either SDK. The `source` field on the user record (see [`users.md`](./users.md)) provides user origin, but no entitlement endpoint accepts or exposes it. — *unverified, requires tenant-side check* — see [clarification `zid-08`](../_meta/clarifications.md#zid-08-entitlement-api-behavior-by-user-idp-source)

- **Scope wire-shape evolution** — the refreshed Go model has only a pointer to one `IDNameDisplayName` (`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:24-28`); the former unused list wrapper is gone. Whether the API could ever change that field to a list remains undocumented and would require a future source/spec check. — *unverified, requires vendor API spec or changelog review* — see [clarification `zid-09`](../_meta/clarifications.md#zid-09-scope-forward-compatibility-single-object-vs-list)

- **Role enum completeness** — observed role names (`SuperAdmin`, `Admin`, `ReadOnly`, `PolicyAdmin`, `Auditor`) in test fixtures may not be exhaustive. No enum constants are exported. — *requires vendor role documentation or live API enumeration* — see [clarification `zid-10`](../_meta/clarifications.md#zid-10-entitlement-role-name-enum-completeness)

## Cross-links

- [`admin-rbac.md`](./admin-rbac.md) — federation context, role assignment via UI, ZIdentity 25-module permission matrix; lists Administrative Entitlements and Service Entitlements as permission modules; covers the full role-assignment workflow
- [`users.md`](./users.md) — user-side `source` field (`UI`, `API`, `SCIM`, `JIT`); relevant to the IdP-source open question above
- [`api-clients.md`](./api-clients.md) — entitlements gate API client access to specific services; scopes on the client determine which ZIdentity service APIs it can reach
