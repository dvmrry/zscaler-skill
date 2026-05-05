---
product: zidentity
topic: "zidentity-admin-rbac"
title: "ZIdentity admin RBAC — role model, federation, entitlements API"
content-type: reasoning
last-verified: "2026-05-05"
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/admin-rbac-captures.md"
  - "vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py"
  - "vendor/zscaler-sdk-python/zscaler/zid/users.py"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZIdentity admin RBAC — role model, federation, entitlements API

## Role model overview

ZIdentity provides a unified, module-based admin role system distinct from per-product RBAC (ZIA rank-based, ZPA feature-flag). ZIdentity roles are system-defined only (not custom-definable) and are assigned through the **Zscaler Admin Console**, not within ZIdentity itself.

Key facts:

- ZIdentity admin roles are part of the cross-product federation story — identity and assignment are centralized in ZIdentity, while per-product authorization still applies at the product level (`vendor/zscaler-help/admin-rbac-captures.md:107-128`)
- For ZIdentity-enabled tenants, admin roles **must be assigned in the Zscaler Admin Console**, not in ZIdentity (`vendor/zscaler-help/admin-rbac-captures.md:118`)
- Users and user groups must be added to ZIdentity before admin roles can be assigned (`vendor/zscaler-help/admin-rbac-captures.md:116`)
- At least View Only permission on Users and User Groups modules is required to submit a Zscaler Support ticket for migrated tenants (`vendor/zscaler-help/admin-rbac-captures.md:120`)

## Built-in roles

Four predefined system roles; no custom roles are documented. (`vendor/zscaler-help/admin-rbac-captures.md:109-114`)

| Role name | Description |
|---|---|
| Super Admin | System role, full permissions across all modules (`vendor/zscaler-help/admin-rbac-captures.md:111`) |
| View Only Admin | System role, view-only access across all modules (`vendor/zscaler-help/admin-rbac-captures.md:112`) |
| User Admin | System role, user-management permission only (`vendor/zscaler-help/admin-rbac-captures.md:113`) |
| CXO Insight User | System role, CXO insight permission only (`vendor/zscaler-help/admin-rbac-captures.md:114`) |

## Permission categories and scopes

ZIdentity permissions are granular per-module with four permission levels: Full / View Only / Restricted / None. (`vendor/zscaler-help/admin-rbac-captures.md:124`)

The permission matrix covers 25+ modules. The full matrix is authoritative only from the live Zscaler Help portal; the vendor doc capture is summary-level (`vendor/zscaler-help/admin-rbac-captures.md:128`).

Documented module list (`vendor/zscaler-help/admin-rbac-captures.md:126`):

- Admin Sign on Policy
- Authentication Methods
- Users and Groups
- User Credentials
- Roles
- External Identities
- IP Locations & Groups
- Authentication Session
- **Administrative Entitlements** — federation module; grants access to ZIA and/or ZPA
- **Service Entitlements** — federation module; defines which services a user or admin can access
- Audit Logs
- Guest Domain
- Remote Assistance
- Branding
- API Clients & Resources
- Executive Insights
- Token Validators
- Log Streaming

## Role assignment workflow

1. Create the user or user group in ZIdentity (Users API or group provisioning) (`vendor/zscaler-help/admin-rbac-captures.md:116`)
2. Assign the admin role through the **Zscaler Admin Console** (not ZIdentity UI) (`vendor/zscaler-help/admin-rbac-captures.md:118`)
3. Assignment grants module-level permissions per the role definition
4. For federated tenants, the single admin identity grants access across ZIA and ZPA; per-product scope and feature flags still apply at the product level (`vendor/zscaler-help/admin-rbac-captures.md:107-121`)

## Custom roles

Not supported. ZIdentity provides only the four system-defined roles documented above. No custom-role feature is documented for ZIdentity, in contrast with ZPA (which allows custom roles with equal-or-lower privileges) and ZIA (which allows custom permission combinations). (`vendor/zscaler-help/admin-rbac-captures.md:109`)

## API surface — entitlements

The ZIdentity SDK supports **reading** admin and service entitlements. Role management (listing role definitions, assigning roles, modifying permissions) is not exposed via SDK or documented API.

### Endpoint summary

| Operation | Python SDK function | Go SDK function | HTTP method + path | Python citation | Go citation |
|---|---|---|---|---|---|
| Get admin entitlements for user | `user_entitlement.get_admin_entitlement(user_id)` | `user_entitlement.GetAdminEntitlement(ctx, service, userID)` | `GET /admin/api/v1/users/{id}/admin-entitlements` | `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:37-79` | `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:34-43` |
| Get service entitlements for user | `user_entitlement.get_service_entitlement(user_id)` | `user_entitlement.GetServiceEntitlement(ctx, service, userID)` | `GET /admin/api/v1/users/{id}/service-entitlements` | `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:81-123` | `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:45-54` |
| List users | `users.list_users(query_params)` | `users.GetAll(ctx, service, queryParams)` | `GET /admin/api/v1/users` | `vendor/zscaler-sdk-python/zscaler/zid/users.py:37-80` | `vendor/zscaler-sdk-go/zscaler/zid/services/users/users.go:48-50` |

The Postman collection documents the same entitlement endpoints using the `{{ZIAMBase}}` variable (`vendor/zscaler-api-specs/oneapi-postman-collection.json`):

- `GET {{ZIAMBase}}/users/:id/admin-entitlements`
- `GET {{ZIAMBase}}/users/:id/service-entitlements`

### Entitlement model

The Python SDK `Entitlement` model represents the role payload returned by both entitlement endpoints. Roles are returned as a list of `(id, name, displayName)` tuples — no permission-level granularity is included in the API response. (`vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py:38-40`)

### What the SDK does NOT expose

- List available role definitions
- Create custom roles
- Assign roles to users (UI-only, via Zscaler Admin Console)
- Modify role permissions
- Query the full permission matrix at runtime

## Comparison: ZIdentity vs product-specific admin RBAC

| Aspect | ZIdentity | ZIA | ZPA |
|---|---|---|---|
| **Role model** | Module-based (25+ modules, 4 permission levels) | Rank-based + permission categories + functional scope | Feature-flag permissions (23 modules) |
| **Hierarchy** | None — system roles are independent | Yes — admin rank gates role-management | No — two predefined roles only |
| **Scope mechanism** | None explicitly documented | Org / Dept / Location / Location Group (one only) | Microtenant isolation (implicit) |
| **Role definition** | System-provided, fixed | System + custom (admin-creatable) | System + custom (admin-creatable) |
| **Assignment location** | Zscaler Admin Console | ZIA Admin Portal | ZPA Admin Console |
| **Federation** | Yes — ZIdentity is the central identity source | Separate identity per product (legacy) | Separate identity per product (legacy) |

### Federation story

**Legacy (pre-ZIdentity):** ZIA admin and ZPA admin are separate accounts with independent role-assignment paths.

**Modern (with ZIdentity):** A single admin identity lives in ZIdentity. The **Administrative Entitlements** module grants access to ZIA and/or ZPA. Per-product scope and feature flags still apply at the product level. (`vendor/zscaler-help/admin-rbac-captures.md:107-128`)

## Edge cases

1. **Support ticket submission requires View Only on Users + User Groups** — for ZIdentity tenants migrated to the Zscaler Admin Console, the submitting admin must hold at least View Only permission on both the Users and User Groups modules. (`vendor/zscaler-help/admin-rbac-captures.md:120`)

2. **Role assignment is not via ZIdentity UI** — despite ZIdentity being the central identity source, admin roles are assigned through the Zscaler Admin Console, not within ZIdentity itself. (`vendor/zscaler-help/admin-rbac-captures.md:118`)

3. **Users and groups must exist before role assignment** — provisioning order matters; populate ZIdentity users or groups before attempting role assignment. (`vendor/zscaler-help/admin-rbac-captures.md:116`)

4. **Entitlement API response carries roles as id/name/displayName only** — the `Entitlement.roles` field in the Python SDK model is a list of `CommonIDNameDisplayName` tuples; no per-module permission levels are included. (`vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py:38-40`)

## Open questions

- **Full permission matrix (25+ modules × 4 levels) not captured** — the vendor doc capture explicitly defers to the live help portal for the authoritative matrix. (`vendor/zscaler-help/admin-rbac-captures.md:128`) — *requires re-capture of live article*

- **Role management APIs not exposed in SDKs** — no endpoint to list role definitions, create custom roles, assign roles, or query the permission matrix at runtime. Confirmed absent from the SDK surface by extraction report; no workaround documented.

- **Relationship between ZIdentity roles and per-product scope/feature flags** — it is unclear whether a ZIdentity "User Admin" role combined with Full Administrative Entitlements automatically inherits any ZIA admin scope, or whether that must be configured separately. — *unverified, requires tenant-side check or Zscaler documentation*

- **"Restricted Full" and "Restrictive View" permission levels** — the extraction report notes that shared docs reference four permission levels but the vendor capture at `vendor/zscaler-help/admin-rbac-captures.md:124` lists only Full / View Only / Restricted / None. Authoritative enum unclear. — *unverified, requires live help article re-capture*

- **Admin role assignment audit trail** — no audit endpoint is documented in the SDK for ZIdentity role-assignment changes. — *requires live API or vendor doc check*

- **`Entitlement.scope` field semantics** — the field is populated by the SDK but its meaning is not documented. (`vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py:52-60`) — *unverified, requires SDK source review*

- **When to use service entitlements vs administrative entitlements** — both `get_service_entitlement` and `get_admin_entitlement` exist, but no vendor guidance documents the distinction in API usage. (`vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:37,81`) — *unverified, requires vendor doc or SDK source review*

## Cross-links

- `references/shared/admin-rbac.md` — federation story covering ZIA, ZPA, and ZIdentity admin RBAC
- `references/zidentity/api-clients.md` — API client management via ZIdentity
- `references/zidentity/users.md` — ZIdentity users reference (Task 8)
