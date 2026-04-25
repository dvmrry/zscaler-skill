---
product: shared
topic: "scim-provisioning"
title: "SCIM provisioning — user/group lifecycle across ZIA, ZPA, ZIdentity"
content-type: reasoning
last-verified: "2026-04-24"
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

SCIM (System for Cross-domain Identity Management) is the protocol Zscaler uses for **automated user and group lifecycle management** from an external IdP. Handles create / update / deprovision + attribute + group-membership sync. Without SCIM, tenants manually create users, or rely on SAML JIT (which only creates users the first time they authenticate — doesn't cover updates, deletes, or pre-populating policy dropdowns).

**SCIM is separate from SAML.** SAML is authentication; SCIM is provisioning. Tenants typically use the **same IdP for both** (per *About SCIM* ZPA: "Most of the time, the IdP you set up for SAML authentication will be the same one you use for SCIM identity management"), but they're distinct protocols handling distinct concerns.

## Summary

- **SCIM 2.0 only.** Zscaler supports version 2.0 of the SCIM standard. 1.x is not supported.
- **SAML is a prerequisite** for SCIM provisioning in ZIA: "SAML must be used as your authentication method to use SCIM for provisioning."
- **Username + SAML `nameID` must match** for ZPA SCIM: "The SCIM username attribute must match nameID in the SAML attribute." Cross-product constraint.
- **ZPA SCIM Attributes are read-only** — no custom attributes supported. ZIA supports a broader, but still Zscaler-maintained, attribute set.
- **Domain pre-registration** required for usernames in ZIA: the domain part of a SCIM username (e.g., `safemarch.com` in `user@safemarch.com`) must be pre-registered with Zscaler via Support.
- **Max 128 groups per user** in ZIA. Exceeding this caps what the user's policy can inherit from groups.
- **Partners**: Zscaler has published IdP config guides for Microsoft Entra ID, Okta, PingFederate, PingOne, Google Workspace, AD FS, OneLogin, CA Single Sign-On. Any SCIM-2.0-compliant IdP (e.g., SailPoint) will also work.

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

### Authentication for SCIM clients

Two paths:

1. **IdP-driven (most tenants).** The partnered IdP handles auth to Zscaler using OAuth or Bearer-token credentials provisioned in the IdP-Zscaler integration. Zscaler publishes per-IdP config guides.
2. **Custom SCIM clients.** Tenants can make REST API calls directly to Zscaler's SCIM endpoints using the same OAuth 2.0 OneAPI flow as other Zscaler APIs (see [`../zidentity/api-clients.md`](../zidentity/api-clients.md)). Relevant when a tenant has a homegrown provisioning tool or uses a less-common IdP.

## Cross-SDK parity

From the earlier cross-SDK sweep (`commit 1cdd2c5`):

- **Go SDK has full SCIM CRUD** for both ZIA and ZPA:
  - `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go` (and `scim_group_api.go`)
  - `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/`
- **Python SDK has partial coverage**: `scim_groups.py` and `scim_attributes.py` modules for ZPA, but no full SCIM user CRUD surface. ZIA Python SDK has no `scim_api` module at all.

Implication: automations that need to programmatically create/update/delete ZIA users via SCIM need the Go SDK or direct HTTP. Python callers can read but not fully provision.

### Python-vs-Go SDK method snapshot

| Service | Python SDK | Go SDK | Gap |
|---|---|---|---|
| ZIA SCIM users CRUD | (no module) | `scim_user_api.go` full CRUD | Full gap |
| ZIA SCIM groups CRUD | (no module) | `scim_group_api.go` full CRUD | Full gap |
| ZPA SCIM attributes | `scim_attributes.py` | `scim_api` full CRUD | Write ops only in Go |
| ZPA SCIM groups | `scim_groups.py` | `scim_api` full CRUD | Write ops only in Go |

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
| "Python SDK can't create ZIA users." | No Python SDK SCIM surface for ZIA. Use Go SDK or direct HTTP. | [Cross-SDK parity](#cross-sdk-parity) |
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

## Cross-links

- ZIdentity unified identity service — [`../zidentity/overview.md`](../zidentity/overview.md)
- API clients (OAuth 2.0 auth flow also used by custom SCIM clients) — [`../zidentity/api-clients.md`](../zidentity/api-clients.md)
- Cross-product user / group / department / location sync — [`./cross-product-integrations.md § ZIdentity → all products`](./cross-product-integrations.md)
- Authentication (SAML is the paired auth surface) — [`./cloud-architecture.md`](./cloud-architecture.md)
