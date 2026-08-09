---
product: shared
topic: "scim-provisioning"
title: "SCIM provisioning — user/group lifecycle across ZIA, ZPA, ZIdentity"
content-type: reasoning
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 8a73a5fcf0bbb8507a47c09e9a6f379447ce3807
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/zia/understanding-scim"
  - "vendor/zscaler-help/understanding-scim-zia.md"
  - "https://help.zscaler.com/zpa/about-scim"
  - "vendor/zscaler-help/about-scim-zpa.md"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/"
author-status: draft
---

# SCIM provisioning

SCIM (System for Cross-domain Identity Management) is the protocol Zscaler uses for **automated user and group lifecycle management** from an external IdP. For ZIA, the help capture names user and group provisioning, group and department updates, and user deprovisioning as supported SCIM use cases (`vendor/zscaler-help/understanding-scim-zia.md:17`, `vendor/zscaler-help/understanding-scim-zia.md:21`, `vendor/zscaler-help/understanding-scim-zia.md:22`, `vendor/zscaler-help/understanding-scim-zia.md:23`). For ZPA, the help capture says SCIM allows Private Access to remove users when disabled or deleted in the directory and to enforce policy based on SCIM attributes and groups (`vendor/zscaler-help/about-scim-zpa.md:16`, `vendor/zscaler-help/about-scim-zpa.md:20`, `vendor/zscaler-help/about-scim-zpa.md:21`).

**SCIM is separate from SAML.** SAML is authentication; SCIM is provisioning. ZPA's SCIM help notes that the SAML IdP and SCIM IdP are usually the same provider, while ZIA requires SAML as the authentication method before SCIM provisioning is used (`vendor/zscaler-help/about-scim-zpa.md:33`, `vendor/zscaler-help/understanding-scim-zia.md:35`).

## Summary

- **SCIM 2.0 only.** ZIA and ZPA help captures both state that Zscaler supports only SCIM version 2.0 (`vendor/zscaler-help/understanding-scim-zia.md:35`, `vendor/zscaler-help/about-scim-zpa.md:35`).
- **SAML is a prerequisite** for SCIM provisioning in ZIA (`vendor/zscaler-help/understanding-scim-zia.md:35`).
- **Username + SAML `nameID` must match** for ZPA SCIM; the ZPA attributes page lists username as the only required and unique attribute, and says the SCIM username attribute must match the SAML `nameID` (`vendor/zscaler-help/about-scim-zpa.md:54`, `vendor/zscaler-help/about-scim-zpa.md:56`, `vendor/zscaler-help/about-scim-zpa.md:58`).
- **ZPA SCIM Attributes are read-only** and Private Access does not support custom attributes (`vendor/zscaler-help/about-scim-zpa.md:41`).
- **Domain pre-registration** is required for usernames in ZIA: the domain part of a SCIM username must be registered to the tenant, and Zscaler Support assists with that process (`vendor/zscaler-help/understanding-scim-zia.md:33`).
- **Max 128 groups per user** in ZIA (`vendor/zscaler-help/understanding-scim-zia.md:33`).
- **Partners**: the ZIA help capture links Microsoft Entra ID, Okta, PingFederate, PingOne, Google Workspace, AD FS, OneLogin, and CA Single Sign-On configuration guides; the ZPA capture also says Private Access works with any IdP that supports the SCIM standard, giving SailPoint as an example (`vendor/zscaler-help/understanding-scim-zia.md:114`, `vendor/zscaler-help/understanding-scim-zia.md:115`, `vendor/zscaler-help/understanding-scim-zia.md:116`, `vendor/zscaler-help/understanding-scim-zia.md:117`, `vendor/zscaler-help/understanding-scim-zia.md:118`, `vendor/zscaler-help/understanding-scim-zia.md:119`, `vendor/zscaler-help/understanding-scim-zia.md:120`, `vendor/zscaler-help/understanding-scim-zia.md:121`, `vendor/zscaler-help/understanding-scim-zia.md:122`, `vendor/zscaler-help/about-scim-zpa.md:26`).

## Mechanics

### ZIA SCIM endpoints

From *Understanding SCIM (ZIA)*:

| Endpoint | Operation | HTTP |
|---|---|---|
| `/Users` | Create user | `POST` |
| `/Users` | Retrieve all users (up to 1,000 per page) | `GET` |
| `/Users?startIndex=<n>` | Paginate | `GET` |
| `/Users/{id}` | Retrieve specific user | `GET` |
| `/Users?filter=userName eq <v>` | Filter by username | `GET` |
| `/Users?filter=externalID eq <v>` | Filter by external ID | `GET` |
| `/Users?filter=id eq <v>` | Filter by ID | `GET` |
| `/Users?filter=meta.lastModified gt <v>` | Filter by modification date | `GET` |
| `/Users/{id}` | Update user | `PUT` or `PATCH` |
| `/Users/{id}` | Delete user | `DELETE` |
| `/Groups` | Create group | `POST` |
| `/Groups` | List groups (1,000 per page) | `GET` |
| `/Groups/{id}` | Retrieve specific group | `GET` |
| `/Groups?filter=displayName eq <v> and members.value eq <v>` | Filter groups | `GET` |
| `/Groups/{id}` | Update group | `PUT` or `PATCH` |
| `/Groups/{id}` | Delete group | `DELETE` |
| `/Bulk` | Bulk modify resources | `POST` |
| `/Schemas` | Retrieve all resource schemas | `GET` |
| `/Schemas/{id}` | Retrieve specific schema | `GET` |
| `/ServiceProviderConfig` | Retrieve service provider config | `GET` |
| `/ResourceTypes` | List resource types | `GET` |
| `/ResourceTypes/{id}` | Retrieve specific resource type | `GET` |
| `[prefix]/.search` | Search resources | `POST` |

**Pagination**: 1,000-entry cap per page; use `startIndex` to walk.

### ZIA attribute mapping

| SCIM attribute | Zscaler field | Notes |
|---|---|---|
| `id` | `<unique_id>` | Zscaler-generated UUID-like ID. |
| `externalId` | `scim_externalid` | IdP-side external ID, passed through. |
| `userName` | `login_name` (User ID) | Format `user@domain`. Domain must be pre-registered. |
| `displayName` | `user_name` | Display name. |
| `groups` | Groups | Group memberships (subject to 128-group cap per user). |
| `active=true`/`false` | Enable/disable user | `false` disables rather than deletes. |
| `department` | Department | |
| `name.givenName` | First name | |
| `name.familyName` | Last name | |
| `emails.value` | `scim_emails` | |

### ZPA SCIM attributes

From *About SCIM* (ZPA):

| SCIM attribute | Description |
|---|---|
| `active` | `true` = enabled; **`false` = DELETED** (not just disabled — differs from ZIA semantics). |
| `costCenter` | Cost center. |
| `department` | Department. |
| `displayName` | Display name. |
| `division` | Division. |
| `emails.value` | Email. |
| `names.givenName` | First name. **Note plural `names` — differs from ZIA's `name.givenName`.** |
| `name.formatted` | Formatted name (singular `name`). |
| `name.familyName` | Last name. |
| `id` | Zscaler-generated UUID. |
| `organization` | Organization. |
| `title` | Title. |
| `userName` | Format `user@domain.com`. Must match SAML `nameID`. |

**Key ZPA vs ZIA differences**:

- **`active=false` deletes the user in ZPA, disables in ZIA.** A SCIM client sending `active=false` expects "disabled" semantics on ZIA and gets "deleted" semantics on ZPA. If the IdP reactivates the user later, ZIA flips back instantly; ZPA requires re-provisioning (recreating) the user.
- **ZPA uses `names.givenName` (plural)** vs ZIA's `name.givenName` (singular). A SCIM client writing both products must handle the attribute-name difference or the data won't sync correctly.
- **ZPA SCIM Attributes page is read-only** — no custom attributes. ZIA is similarly constrained but the attribute surface is larger.

### ZPA SCIM Groups (sourced from SDK; help portal page broken)

**The Zscaler help-portal page for ZPA SCIM Groups is SPA-broken** as of April 2026 — it reroutes to unrelated content. This section is sourced from `vendor/zscaler-sdk-python/zscaler/zpa/scim_groups.py` + `vendor/zscaler-sdk-python/zscaler/zpa/models/scim_groups.py`. Confidence: medium.

ZPA SCIM Groups are **read-only views** of the groups your IdP synchronizes via SCIM. The SDK exposes:

- `list_scim_groups(idp_id, query_params)` — paginated list per IdP (default page size 20, max 500). Supports search by name, time-range filtering.
- `get_scim_group(scim_group_id)` — single group by Zscaler-generated UUID.

Key fields on the `SCIMGroup` model:
- `id` (Zscaler UUID — opaque)
- `name`, `idp_id`, `idp_name` (which IdP it came from)
- `creation_time`, `modified_time`
- `internal_id` (separate from `id`; relationship not documented in SDK source)

**Operational implications:**

- **Provisioning is IdP-driven, not Zscaler-side.** You can't create / delete / rename SCIM Groups directly via the ZPA API; the IdP's SCIM client does that based on group changes in the IdP. ZPA mirrors what the IdP sends.
- **Multiple IdPs per tenant** — each `idp_id` maintains its own SCIM Group namespace; group names can collide across IdPs.
- **SCIM Groups are referenced by Access Policy criteria** — Access Policy rules can scope by SCIM Group membership (operator filter `EQUALS scim_group <id>`).
- **`active=false` semantics on the user side delete the user**, but on the group side what happens when an IdP removes a member or deletes the group entirely isn't documented in the SDK source — Tier D inference: the membership disappears but the SCIM Group object may persist until the IdP's next sync removes it.

For the cross-product attribute mapping (which fields on user records sync across), see § ZPA SCIM attributes above. SCIM Groups carry only the group-identity surface, not user attributes.

### Authentication for SCIM clients

Two paths:

1. **IdP-driven (most tenants).** The partnered IdP handles auth to Zscaler using OAuth or Bearer-token credentials provisioned in the IdP-Zscaler integration. Zscaler publishes per-IdP config guides.
2. **Custom SCIM clients.** Tenants can make REST API calls directly to Zscaler's SCIM endpoints using the same OAuth 2.0 OneAPI flow as other Zscaler APIs (see [`../zidentity/api-clients.md`](../zidentity/api-clients.md)). Relevant when a tenant has a homegrown provisioning tool or uses a less-common IdP.

## SDK surface snapshot

The SDK claim here is intentionally function-level. Do not collapse it to a blanket CRUD-coverage statement without re-reading the cited package in the current vendor pin.

- **ZIA Go SCIM user functions**: `GetUser`, `GetUserByName`, `CreateUser`, `UpdateUser`, `DeleteUser`, and `GetAllUsers` are live declarations in `scim_user_api.go` (`vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go:44`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go:54`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go:73`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go:84`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go:94`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go:104`).
- **ZIA Go SCIM group functions**: `GetGroup`, `GetGroupByName`, `CreateGroup`, `UpdateGroup`, `DeleteGroup`, and `GetAllGroups` are live declarations in `scim_group_api.go` (`vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_group_api.go:39`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_group_api.go:49`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_group_api.go:68`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_group_api.go:79`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_group_api.go:89`, `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_group_api.go:99`).
- **ZPA Go SCIM user functions**: `GetUser`, `GetUserByName`, `CreateUser`, `UpdateUser`, `PatchUser`, `DeleteUser`, and `GetAllUsers` are live declarations in `scim_user_api.go` (`vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:64`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:74`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:93`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:104`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:113`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:122`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:132`).
- **ZPA Go SCIM group functions**: `GetGroup`, `GetGroupByName`, `CreateGroup`, `UpdateGroup`, `PatchGroup`, `DeleteGroup`, and `GetAllGroups` are live declarations in `scim_group_api.go` (`vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_group_api.go:42`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_group_api.go:52`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_group_api.go:71`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_group_api.go:82`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_group_api.go:91`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_group_api.go:100`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_group_api.go:110`).
- **Python SDK ZPA SCIM read surfaces found in this pass**: `SCIMGroupsAPI` exposes `list_scim_groups` and `get_scim_group`; `ScimAttributeHeaderAPI` exposes `list_scim_attributes`, `get_scim_attribute`, and `get_scim_values` (`vendor/zscaler-sdk-python/zscaler/zpa/scim_groups.py:26`, `vendor/zscaler-sdk-python/zscaler/zpa/scim_groups.py:37`, `vendor/zscaler-sdk-python/zscaler/zpa/scim_groups.py:120`, `vendor/zscaler-sdk-python/zscaler/zpa/scim_attributes.py:26`, `vendor/zscaler-sdk-python/zscaler/zpa/scim_attributes.py:38`, `vendor/zscaler-sdk-python/zscaler/zpa/scim_attributes.py:101`, `vendor/zscaler-sdk-python/zscaler/zpa/scim_attributes.py:137`).

Implication: Go is the currently documented SDK path for SCIM provisioning operations in this source set. Python automation should use the documented REST endpoints directly for provisioning operations unless a newer Python SDK release exposes a SCIM provisioning module; see [clarification shared-28](../_meta/clarifications.md#shared-28-python-zia-scim-wrapper-surface).

### Python-vs-Go SDK method snapshot

| Service | Python SDK | Go SDK | Gap |
|---|---|---|---|
| ZIA SCIM users | See [clarification shared-28](../_meta/clarifications.md#shared-28-python-zia-scim-wrapper-surface) | `GetUser`, `GetUserByName`, `CreateUser`, `UpdateUser`, `DeleteUser`, `GetAllUsers` | Go function list verified; Python wrapper presence remains open for future releases |
| ZIA SCIM groups | See [clarification shared-28](../_meta/clarifications.md#shared-28-python-zia-scim-wrapper-surface) | `GetGroup`, `GetGroupByName`, `CreateGroup`, `UpdateGroup`, `DeleteGroup`, `GetAllGroups` | Go function list verified; Python wrapper presence remains open for future releases |
| ZPA SCIM attributes | `list_scim_attributes`, `get_scim_attribute`, `get_scim_values` | Not part of `zpa/services/scim_api`; ZPA Go SCIM user/group APIs are separate | Python surface is read-oriented for attributes |
| ZPA SCIM groups | `list_scim_groups`, `get_scim_group` | `GetGroup`, `GetGroupByName`, `CreateGroup`, `UpdateGroup`, `PatchGroup`, `DeleteGroup`, `GetAllGroups` | Python surface is read-oriented; Go user/group SCIM API includes write functions |

## Okta-specific gotcha (ZPA)

From *About SCIM* (ZPA):

> Users might encounter a connection error in Zscaler Client Connector when enabling SCIM sync with Okta. Okta does not sync users to Private Access in the Okta IdP before you enable SCIM. As a result, users do not initially appear in the SCIM user database when SCIM is enabled in Private Access.

**Remedy**: enable `PROVISION_OUT_OF_SYNC_USERS` in Okta, and unassign/reassign all users/groups from Zscaler Private Access in Okta. Wait for the sync. One-time setup, but if skipped causes "users can't connect via ZCC" errors that look like SCIM is broken when it's actually the first-sync condition.

## Common question shapes

| Question | Likely explanation | Start |
|---|---|---|
| "SAML users show up but don't appear in ZIA policy dropdowns." | JIT-only — users are created on first login but aren't pre-populated. Enable SCIM for proactive sync. | [ZIA SCIM mechanics](#zia-scim-endpoints) |
| "User deleted in Okta but still in ZPA." | ZPA SCIM expects `active=false` to delete. Verify IdP is sending that. | [ZPA SCIM attributes](#zpa-scim-attributes) |
| "User disabled in Entra ID but still showing as active in ZIA." | ZIA SCIM uses `active=false` to disable (not delete). IdP must actually send `active=false`, not just delete from the SCIM group. | Same |
| "New user has no groups in ZPA." | `displayName` → Zscaler Group matching. If IdP sends group `displayName` that doesn't match ZPA's group records, sync doesn't link. | Attribute mapping |
| "SCIM sync error about username mismatch." | ZPA requires SCIM `userName` to match SAML `nameID` — the IdP might be sending different values | [Cross-product constraint](#summary) |
| "Okta-to-ZPA sync shows no users initially." | `PROVISION_OUT_OF_SYNC_USERS` flag not enabled in Okta | [Okta-specific gotcha](#okta-specific-gotcha-zpa) |
| "Can the Python SDK create ZIA users via SCIM?" | This source pass verified Go SCIM user/group functions and ZPA Python read surfaces, but did not confirm a Python ZIA SCIM provisioning wrapper. Use direct HTTP or verify the installed Python SDK release before relying on one. | [SDK surface snapshot](#sdk-surface-snapshot) |
| "User exceeded a group limit." | ZIA: 128 groups/user max. IdP-side group sprawl. | ZIA mechanics |

## Edge cases

- **SCIM sync is periodic, not real-time.** Changes in the IdP take minutes to propagate depending on the IdP's sync schedule. Operators expecting instant effect from "I just disabled this user" may wait longer than intended.
- **SAML `nameID` / SCIM `userName` drift** — if a user's email address changes in the IdP and the IdP updates both SAML `nameID` and SCIM `userName`, but Zscaler's records link by the old value, sync can fail silently. Some IdPs emit a "userName change" event; others just push the new value and expect Zscaler to match on `externalId`.
- **Bulk operations on ZIA have a separate endpoint** (`/Bulk`) that's POST-only. Large provisioning batches benefit from this over individual POSTs for rate-limit reasons.
- **ZPA doesn't support custom SCIM attributes.** Tenants pushing custom attributes from their IdP will see them ignored. Only the documented attribute set syncs.
- **Re-enrollment after ZPA `active=false`**: deleting a ZPA user via SCIM loses their per-user settings. A reactivated user has to be re-provisioned from scratch.
- **Sync order matters for groups + users.** If a user is created with a group reference but the group doesn't exist yet, the user record may end up with empty group memberships. IdPs typically sync groups before users for this reason.
- **SCIM deprovisioning doesn't revoke OAuth tokens.** Disabling a user via SCIM removes their access going forward but doesn't invalidate tokens they already have. Tenants needing hard revocation should pair SCIM deprovisioning with a ZIdentity `revokeToken` call (see [`../zidentity/api-clients.md § Revocation`](../zidentity/api-clients.md)).

## Open questions

- **Exact sync cadence** for each IdP integration — Okta, Entra, Ping all have different sync intervals. Not consolidated.
- **Rate limits on SCIM endpoints** — general ZIA/ZPA rate limits apply, but SCIM-specific guidance isn't captured here.
- **Group nesting** — SCIM 2.0 supports group members that are themselves groups, but Zscaler's treatment of nested groups isn't documented.
- **Per-IdP attribute mapping quirks** — Entra ID vs Okta vs Ping vs Google Workspace each have subtle differences in how they populate SCIM fields. Referenced in per-IdP config guides that aren't captured here.
- **Python ZIA SCIM wrapper surface** — this pass verified Go SCIM provisioning functions and Python ZPA read surfaces, but did not establish whether a current or future Python SDK release exposes ZIA SCIM provisioning wrappers. See [clarification shared-28](../_meta/clarifications.md#shared-28-python-zia-scim-wrapper-surface).

## Cross-links

- ZIdentity unified identity service — [`../zidentity/overview.md`](../zidentity/overview.md)
- API clients (OAuth 2.0 auth flow also used by custom SCIM clients) — [`../zidentity/api-clients.md`](../zidentity/api-clients.md)
- Cross-product user / group / department / location sync — [`./cross-product-integrations.md § ZIdentity → all products`](./cross-product-integrations.md)
- Authentication (SAML is the paired auth surface) — [`./cloud-architecture.md`](./cloud-architecture.md)
