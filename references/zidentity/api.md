---
product: zidentity
topic: "zidentity-api"
title: "ZIdentity API — SDK surface, Python/Go parity, wire format"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
source-tier: mixed
sources:
  - "https://help.zscaler.com/zidentity/understanding-zidentity-apis"
  - "vendor/zscaler-help/understanding-zidentity-apis.md"
  - "vendor/zscaler-sdk-python/zscaler/zid/"
  - "vendor/zscaler-sdk-go/zscaler/zid/services/"
author-status: draft
---

# ZIdentity API surface

The ZIdentity-specific API endpoints, as distinct from the ZIA/ZPA/ZDX product APIs that also flow through OneAPI. ZIdentity exposes user directory management, group management, API client management, and resource-server (service) introspection.

Note: **API client creation itself is not exposed via API** — the OneAPI authentication flow requires an admin-portal-created client. What the ZIdentity API does expose is user and group management (so SCIM-like provisioning can be scripted), plus read-only access to existing API clients.

## SDK services under `client.zid.*`

Per `vendor/zscaler-sdk-python/zscaler/zid/` and cross-checked against `vendor/zscaler-sdk-go/zscaler/zid/services/`:

| Service | Purpose | Python SDK methods | Go SDK notes |
|---|---|---|---|
| `client.zid.users` | User directory CRUD | `list_users`, `get_user`, `add_user`, `update_user`, `delete_user`, `list_user_group_details` | Go also exposes `GetGroupsByUser` (fetch all groups a user belongs to). Python SDK lacks this. |
| `client.zid.groups` | Group directory CRUD + membership | `list_groups`, `get_group`, `add_group`, `update_group`, `delete_group`, `list_group_users_details`, `add_user_to_group`, `add_users_to_group`, `replace_users_groups`, `remove_user_from_group` | Go additionally exposes `GetUsers` (fetch all members of a group). Python has `list_group_users_details` which likely overlaps; check SDK version for exact equivalence. |
| `client.zid.user_entitlement` | Admin and service entitlement lookup | `get_admin_entitlement`, `get_service_entitlement` | Parity. |
| `client.zid.resource_servers` | **Read-only in Python** | `list_resource_servers`, `get_resource_server` | **Go has full CRUD** (`Get`, `GetAll`, `GetByName`, Create, Update, Delete). Python callers that need to create or modify resource servers must use Go SDK or direct API. |

## Python vs Go SDK parity — gap summary

From the cross-SDK audit (2026-04-24):

**Gaps in Python SDK (Go-SDK-only):**

- **`users.GetGroupsByUser`** — fetch all groups a user belongs to. Useful inverse of `list_group_users_details`.
- **`groups.GetUsers`** — full member list of a group (Python's `list_group_users_details` is likely similar but without explicit cross-SDK verification).
- **`resource_servers` write methods** — Go has full CRUD; Python is read-only.

**Neither SDK exposes:**

- **API Client CRUD** — neither SDK exposes methods for creating/managing API clients. This is admin-portal-only. A tenant that wants to automate API client lifecycle would need to reach the ZIdentity UI-backing endpoints directly.
- **Authentication Level CRUD** — step-up authentication levels are portal-configured; no SDK coverage.
- **Step-up trigger policy** — which rules trigger step-up is configured on the ZIA/ZPA side, not through ZIdentity directly.
- **OIDC / SAML IdP configuration** — portal-only.

## Wire format

ZIdentity API endpoints are under the OneAPI gateway — same OAuth 2.0 auth flow as ZIA / ZPA / ZDX. All ZIdentity responses are JSON, camelCase keys (standard OneAPI convention).

Endpoint prefixes (inferred from SDK paths): `/zidentity/api/v1/` or similar — not captured from docs. Check SDK source for exact paths.

## Resource model (high-level)

### User

From the SDK model at `vendor/zscaler-sdk-python/zscaler/zid/models/users.py` (not deeply inspected in this pass). Typical fields: ID, login name, email, display name, attributes (department, location), group membership references, status (active/inactive), externally-sourced flag (SCIM vs. locally created).

### Group

From `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py`. Fields: ID, name, members (user IDs), externally-sourced flag, entitlement assignments.

### Resource Server

A Zscaler service exposed through OneAPI. ZIA, ZPA, ZDX, ZCC, ZBI each correspond to a resource server. API client scopes reference resource servers. Python SDK surface is read-only; Go is full CRUD.

### User Entitlement

Per-user assignment of Zscaler services and admin roles. `get_admin_entitlement(user_id)` returns admin role assignments; `get_service_entitlement(user_id)` returns which products the user has access to.

## Snapshotting ZIdentity

`scripts/snapshot-refresh.py` doesn't yet dump ZIdentity. A fork admin wanting to track ZIdentity state should add:

- `client.zid.users.list_users()` → `snapshot/zidentity/users.json`
- `client.zid.groups.list_groups()` → `snapshot/zidentity/groups.json`
- `client.zid.resource_servers.list_resource_servers()` → `snapshot/zidentity/resource-servers.json`

Per-user `user_entitlement` data would require iterating — expensive on large tenants. Defer unless a specific audit needs it.

**Caveat on PII**: ZIdentity user records contain email addresses, names, and possibly other PII. A fork admin committing snapshot data to a private repo should verify their compliance posture for storing user PII in version control.

## Related legacy-API endpoints

The help article *Understanding ZIdentity APIs* lists the top-level feature categories accessible via ZIdentity API:

- **API Clients** — admin-portal-only creation, per [`./api-clients.md`](./api-clients.md)
- **Users** — CRUD (SDK-exposed)
- **Groups** — CRUD (SDK-exposed)
- **Resource Servers** (a.k.a. API Resources) — read-only in Python SDK

## Open questions

- Exact endpoint paths for each service — not captured in this pass.
- Rate limit specifics for ZIdentity endpoints vs product-specific endpoints.
- Whether ZIdentity API supports filter/search query params comparable to ZIA's filter patterns.
- Whether there's a bulk-provisioning endpoint (beyond the SCIM IdP-push flow) for users/groups.

## Cross-links

- Overview — [`./overview.md`](./overview.md)
- API Clients (the authentication surface) — [`./api-clients.md`](./api-clients.md)
- Step-Up Authentication — [`./step-up-authentication.md`](./step-up-authentication.md)
- ZIA API authentication section — [`../zia/api.md`](../zia/api.md)
