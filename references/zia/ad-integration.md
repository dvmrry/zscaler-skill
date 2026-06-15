---
product: zia
topic: "zia-ad-integration"
title: "ZIA Active Directory integration — user/group provisioning, auth methods, and the ZIA auth stack"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/authentication_settings.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/auth_settings/auth_settings.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/user_authentication_settings/user_authentication_settings.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_group_api.go"
  - "vendor/zscaler-sdk-go/zscaler/service.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_auth_settings_urls.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_user_management_users.go"
  - "https://help.zscaler.com/zia/understanding-scim"
  - "vendor/zscaler-help/understanding-scim-zia.md"
  - "https://help.zscaler.com/legacy-apis/authentication-settings"
  - "vendor/zscaler-help/legacy-authentication-settings.md"
  - "vendor/zscaler-help/about-saml-attributes.md"
  - "vendor/zscaler-help/about-active-directory-controls.md"
author-status: draft
---

# ZIA Active Directory integration — user/group provisioning, auth methods, and the ZIA auth stack

ZIA uses Active Directory (AD) data for two distinct purposes: **provisioning** (populating the ZIA user and group database with identities from AD) and **authentication** (validating user identity at proxy-time). These are separate systems and can be mixed. A tenant can provision users from AD via SCIM while authenticating them via SAML SSO, for example.

This document covers the ZIA auth stack, how AD user/group data reaches ZIA, configuration objects and their fields, the relationship between LDAP sync, SCIM, and SAML, the API surface, and common operational gotchas.

For ZPA-side Active Directory controls (AppProtection AD inspection of Kerberos/SMB/LDAP protocols through ZPA application segments), see the separate ZPA AppProtection documentation — that is a different feature with a different configuration surface.

## What ZIA AD integration provides

When AD data is in ZIA, the policy engine can scope rules to **users**, **groups**, and **departments**. Without this data:

- All URL filtering, cloud app control, and SSL inspection rules that reference users/groups/departments silently do not match — only IP-based rules fire.
- Per-user reporting in ZIA Web Insights shows `anonymous` or the source IP rather than the user's login name.
- ZPA policy rules that cross-reference ZIA user identity have no data to match on.

With AD data provisioned, ZIA can enforce per-user and per-group policy independent of source IP, and generate user-attributed logs (the `%s{login}` and `%s{dept}` fields in NSS web/firewall/DNS logs).

## Auth type enum and configuration objects

The `GET/PUT /authSettings` endpoint controls the tenant's authentication mode. The `orgAuthType` field is the primary switch (Tier A — vendor/zscaler-help/legacy-authentication-settings.md):

| `orgAuthType` value | What it means |
|---|---|
| `ANY` | Accept any valid authentication method |
| `NONE` | No authentication; all traffic treated as anonymous |
| `LDAP_GROUP` | Authenticate using LDAP; match users by group membership |
| `LDAP_USER` | Authenticate using LDAP; match users individually |
| `AD_GROUP` | Active Directory group-based authentication |
| `AD_USER` | Active Directory user-based authentication |
| `SAML` | SAML SSO only; user identity from the IdP assertion |
| `ZIDENTITY` | Zscaler Identity (ZIdentity); modern identity federation |
| `ZIDENTITY_GUEST` | ZIdentity with guest access support |

**Full `AuthSettings` object fields:**

| Field | Type | Description |
|---|---|---|
| `orgAuthType` | enum | Primary authentication method (see table above) |
| `samlEnabled` | boolean | Enable SAML SSO alongside or instead of directory auth |
| `kerberosEnabled` | boolean | Enable Kerberos authentication (transparent SSO for domain-joined devices) |
| `kerberosPwd` | string | Read-only; set via `GET /authSettings/generateKerberosPassword` |
| `authFrequency` | enum | Cookie expiration: `DAILY_COOKIE`, `WEEKLY_COOKIE`, `MONTHLY_COOKIE`, `SESSION_COOKIE` |
| `authCustomFrequency` | int | Custom auth frequency in days (1–180); overrides `authFrequency` when set |
| `oneTimeAuth` | enum | For `NONE` auth type: `OTP_DISABLED`, `OTP_ENABLED`, `OTP_MANDATORY` |
| `passwordStrength` | enum | For hosted-DB users: `NONE`, `LOW`, `HIGH` |
| `passwordExpiry` | enum | For hosted-DB users: `NEVER`, `MONTHLY`, `QUARTERLY`, `SEMIANNUALLY` |
| `lastSyncStartTime` | int (epoch) | Timestamp of last LDAP sync start. Reset on auth type change. |
| `lastSyncEndTime` | int (epoch) | Timestamp of last LDAP sync completion |
| `mobileAdminSamlIdpEnabled` | boolean | Indicate the use of Mobile Admin as IdP (Tier A — vendor/zscaler-help/legacy-authentication-settings.md:27; SDK model field vendor/zscaler-sdk-python/zscaler/zia/models/authentication_settings.py:48, vendor/zscaler-sdk-go/zscaler/zia/services/auth_settings/auth_settings.go:51) |
| `autoProvision` | boolean | Enable SAML auto-provisioning (create users on first SAML login) |
| `directorySyncMigrateToScimEnabled` | boolean | Disable directory sync to migrate to SCIM or SAML auto-provisioning |

> **Enum caveat — trust the API tokens, not the Python SDK docstring.** The `passwordStrength` and `passwordExpiry` enums above follow the API definition (`NONE`/`LOW`/`HIGH` and `NEVER`/`MONTHLY`/`QUARTERLY`/`SEMIANNUALLY`) from the help capture (vendor/zscaler-help/legacy-authentication-settings.md:23-24). The Python SDK's `update_authentication_settings` docstring lists *different* tokens — `passwordStrength` = `NONE`/`MEDIUM`/`STRONG` and `passwordExpiry` = `NEVER`/`ONE_MONTH`/`THREE_MONTHS`/`SIX_MONTHS` (vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py:242-245). The Go struct carries no enum values and so does not arbitrate (vendor/zscaler-sdk-go/zscaler/zia/services/auth_settings/auth_settings.go:39-42). The SDK docstring tokens appear to be wrong; use the API-documented enums when writing values. See `references/zia/api-divergences.md` for the cross-source entry.

## The ZIA auth stack — three provisioning paths

### Path 1: LDAP/AD directory sync (legacy)

ZIA connects to an LDAP/AD server and periodically syncs users and groups into its internal user database. The `lastSyncStartTime` and `lastSyncEndTime` fields on `AuthSettings` track the most recent sync cycle.

The LDAP sync path is now considered legacy — Zscaler's help documentation explicitly references a "LDAP to SCIM Migration Guide," and the `directorySyncMigrateToScimEnabled` flag exists specifically to transition tenants off LDAP sync (Tier A — vendor/zscaler-help/understanding-scim-zia.md, vendor/zscaler-help/legacy-authentication-settings.md).

Characteristics:
- **Sync frequency**: periodic (not real-time). Group changes in AD may take one full sync cycle to propagate to ZIA policy.
- **Nested groups**: LDAP sync behavior with nested groups is not confirmed in available captures. Some LDAP implementations do not recurse nested group membership by default — this is a common gotcha for organizations that rely on AD group nesting.
- **Sync scope**: configurable — you can limit which OUs or groups are synced.

### Path 2: SCIM provisioning (current standard)

SCIM 2.0 is Zscaler's current recommended provisioning mechanism for ZIA. SAML must be enabled as the authentication method to use SCIM (Tier A — vendor/zscaler-help/understanding-scim-zia.md).

The ZIA SCIM server is at a tenant-specific endpoint. Supported operations:

| Endpoint | Operations |
|---|---|
| `/Users` | Create, Retrieve (all or filtered), Update (PUT or PATCH), Delete |
| `/Groups` | Create, Retrieve (all or filtered), Update (PUT or PATCH), Delete |
| `/Bulk` | Bulk modify resources (POST) |
| `/Schemas` | Retrieve schemas |
| `/ServiceProviderConfig` | Retrieve configuration |
| `/ResourceTypes` | Retrieve resource types |
| `[prefix]/.search` | Search resource types (POST) |

**User attribute mapping** (Tier A — vendor/zscaler-help/understanding-scim-zia.md):

| SCIM attribute | ZIA field | Notes |
|---|---|---|
| `id` | Zscaler-generated unique ID | Format: `1a234567-1b23-1200-1234-123c` |
| `externalId` | `scim_externalid` | External ID from the IdP/directory |
| `userName` | User ID (`login_name`) | Must be in `user@domain` format; domain must be pre-registered with Zscaler |
| `displayName` | User display name | |
| `groups` | Group membership | Total groups per user cannot exceed **128** |
| `active` | User enabled/disabled | `false` → user disabled in ZIA |
| `department` | Department | Used for department-scoped policy rules |
| `name.givenName` | First name | |
| `name.familyName` | Last name | |
| `emails.value` | Email | |

**Group attribute mapping** (Tier A — vendor/zscaler-help/understanding-scim-zia.md):

| SCIM attribute | ZIA field | Notes |
|---|---|---|
| `id` | Zscaler-generated unique ID | |
| `externalId` | `scim_externalid` | External ID from IdP |
| `displayName` | Group name | Used in policy rules under `Groups` criterion |

**Domain constraint**: the domain part of `userName` must be pre-registered with Zscaler. A user with `login_name = user@example.com` cannot be provisioned until `example.com` is registered to the tenant. Registration requires a Zscaler Support interaction (Tier A — vendor/zscaler-help/understanding-scim-zia.md).

**Group limit**: a single user cannot belong to more than **128 groups** in ZIA. SCIM provisioning fails for users whose AD group membership exceeds this limit. This is a hard constraint — it is not configurable.

SCIM bulk operations support up to 1,000 entries per page on the raw REST `GET /Users` (and `GET /Groups`) path (Tier A — vendor/zscaler-help/understanding-scim-zia.md:41-55, which documents "Retrieve All Users (up to 1,000 entries) GET /Users" with `?startIndex=<value>` paging). For tenants with >1,000 users or groups, pagination via `startIndex` is required.

**SDK divergence — the Go SCIM SDK pages at 100, not 1,000.** The Go SCIM client does not use the `GET /Users` 1,000-per-page path for list/lookup; `GetAllUsers` and `GetUserByName` retrieve via `POST /Users/.search` capped at `100 // max per Zscaler SCIM API`, and the group equivalents use `POST /Groups/.search` at the same cap (vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go:104-112, :54, vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_group_api.go:99-107, :49). So the effective per-page size differs by call path: 1,000 if you call the raw REST `GET`, 100 if you go through the SDK's search-based list — your paging math changes accordingly.

### Path 3: SAML auto-provisioning

With `autoProvision = true` on `AuthSettings`, ZIA creates a user record on first SAML login using the attributes from the SAML assertion. Groups and departments are populated from the assertion if the IdP is configured to include them.

SAML assertions in ZIA are restricted to **user identity, group, and department attributes** — a narrower attribute set than ZPA, which supports arbitrary SAML attributes for policy criteria (Tier A — vendor/zscaler-help/about-saml-attributes.md).

## Relationship to SCIM and SAML in the ZIA auth stack

| Mechanism | Purpose | Interaction |
|---|---|---|
| LDAP/AD sync | Provision users and groups from AD | Legacy; deprecated in favor of SCIM |
| SCIM | Lifecycle management (create, update, deprovision) | Requires SAML as the auth method; commonly IdP-driven, but the ZIA SCIM SDK client (`scim_api`) can also drive it directly |
| SAML SSO | Authenticate user at proxy time | Required if SCIM is used; assertion carries user identity |
| Kerberos | Transparent SSO for domain-joined devices | Supplements SAML/LDAP; eliminates auth prompts on-LAN |
| Surrogate IP | Map source IP to authenticated user identity | Used with GRE/IPsec tunnels where per-user auth is not per-connection; identity inference rather than real-time auth |

**Surrogate IP** is the mechanism that allows GRE/IPsec-forwarded traffic to carry user identity. After a user authenticates once (SAML or Kerberos), ZIA maps the client IP to the user for a configurable duration. Subsequent requests from that IP are attributed to that user without re-authentication. The map expires on disconnect or after the auth frequency window. This is the primary way that GRE/IPsec deployments achieve per-user policy enforcement without per-connection auth prompts.

## API surface

| Operation | Endpoint | Notes |
|---|---|---|
| Get auth settings | `GET /zia/api/v1/authSettings` | Returns full `AuthSettings` object |
| Update auth settings | `PUT /zia/api/v1/authSettings` | Sets `orgAuthType`, `samlEnabled`, `kerberosEnabled`, etc. |
| Lightweight auth settings | `GET /zia/api/v1/authSettings/lite` | Subset of fields; omits sync timestamps and frequency |
| Generate Kerberos password | (endpoint not captured) | Required before enabling Kerberos; result populates `kerberosPwd` |
| SCIM Users | `GET/POST/PUT/PATCH/DELETE /scim/v2/Users` | ZIA SCIM endpoint; URL varies by cloud |
| SCIM Groups | `GET/POST/PUT/PATCH/DELETE /scim/v2/Groups` | |
| SCIM Bulk | `POST /scim/v2/Bulk` | |

**SDK**: both the Python and Go SDKs carry dedicated AuthSettings and SCIM surfaces — auth settings are not "API-direct only," and SCIM is not only IdP-driven.

- **Python SDK — AuthSettings.** `vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py` exposes `get_authentication_settings` (:141), `get_authentication_settings_lite` (:182), and `update_authentication_settings` (:223), backed by the `AuthenticationSettings` model in `vendor/zscaler-sdk-python/zscaler/zia/models/authentication_settings.py`. The same module manages the cookie-auth exempted-URL list: `get_exempted_urls` (:37), `add_urls_to_exempt_list` (:69), and `delete_urls_from_exempt_list` (:105).
- **Go SDK — AuthSettings.** `vendor/zscaler-sdk-go/zscaler/zia/services/auth_settings/auth_settings.go` exposes `Get` (:60), `GetLite` (:71), and `UpdateAuthSettings` (:82) over the `AuthenticationSettings` struct. The exempted-URL list lives in a separate service: `vendor/zscaler-sdk-go/zscaler/zia/services/user_authentication_settings/user_authentication_settings.go` (`Get` :23, `Update` :34, which diffs current-vs-desired and POSTs `?action=ADD_TO_LIST` / `?action=REMOVE_FROM_LIST`).
- **Go SDK — ZIA SCIM.** There IS a dedicated ZIA SCIM client surface for programmatic provisioning beyond IdP push: `vendor/zscaler-sdk-go/zscaler/zia/services/scim_api/scim_user_api.go` exposes `GetUser` (:44), `GetUserByName` (:54), `CreateUser` (:73), `UpdateUser` (:84), `DeleteUser` (:94), and `GetAllUsers` (:104); `scim_group_api.go` has the group equivalents (`GetGroup`, `GetGroupByName`, `CreateGroup`, `UpdateGroup`, `DeleteGroup`, `GetAllGroups`). These run over a dedicated `ScimZIAService` client constructed by `NewZIAScimService` (`vendor/zscaler-sdk-go/zscaler/service.go:211-235`), which carries its own SCIM token and tenant ID. So while IdP-driven SCIM (Entra ID, Okta, Ping) is the common path, the SDK can also drive SCIM directly.

**SDK-backed `AuthenticationSettings` model fields** (Python model `vendor/zscaler-sdk-python/zscaler/zia/models/authentication_settings.py:37-54`; Go struct `vendor/zscaler-sdk-go/zscaler/zia/services/auth_settings/auth_settings.go:16-58` — the model fields map 1:1 to the API wire fields):

| SDK field (Python `snake_case` / Go) | Wire field |
|---|---|
| `org_auth_type` / `OrgAuthType` | `orgAuthType` |
| `one_time_auth` / `OneTimeAuth` | `oneTimeAuth` |
| `saml_enabled` / `SamlEnabled` | `samlEnabled` |
| `kerberos_enabled` / `KerberosEnabled` | `kerberosEnabled` |
| `kerberos_pwd` / `KerberosPwd` | `kerberosPwd` |
| `auth_frequency` / `AuthFrequency` | `authFrequency` |
| `auth_custom_frequency` / `AuthCustomFrequency` | `authCustomFrequency` |
| `password_strength` / `PasswordStrength` | `passwordStrength` |
| `password_expiry` / `PasswordExpiry` | `passwordExpiry` |
| `last_sync_start_time` / `LastSyncStartTime` | `lastSyncStartTime` |
| `last_sync_end_time` / `LastSyncEndTime` | `lastSyncEndTime` |
| `mobile_admin_saml_idp_enabled` / `MobileAdminSamlIdpEnabled` | `mobileAdminSamlIdpEnabled` |
| `auto_provision` / `AutoProvision` | `autoProvision` |
| `directory_sync_migrate_to_scim_enabled` / `DirectorySyncMigrateToScimEnabled` | `directorySyncMigrateToScimEnabled` |

**Terraform**: there is no single `resource_zia_auth_settings` resource that manages the full `AuthSettings` object as code, so the tenant-wide auth mode (`orgAuthType`, `samlEnabled`, etc.) is still configured once at tenant setup rather than in Terraform. But two related surfaces ARE Terraform-managed: `vendor/terraform-provider-zia/zia/resource_zia_auth_settings_urls.go` manages the cookie-auth exempted-URL list as code (Create/Update call `user_authentication_settings.Update`), and `vendor/terraform-provider-zia/zia/resource_zia_user_management_users.go` manages ZIA users.

## Common gotchas

### Sync frequency lag

LDAP sync is periodic, not real-time. A user added to an AD group may not have that group membership reflected in ZIA policy until the next sync cycle completes. The `lastSyncStartTime` and `lastSyncEndTime` fields on `AuthSettings` show when the last sync ran. There is no manual "sync now" API endpoint confirmed in available captures — syncs are scheduled by Zscaler's backend. If immediate group membership updates are needed, SCIM (which can push changes in near-real-time when the IdP triggers PATCH operations) is the better path.

### Nested groups

Nested AD group membership (group A is a member of group B; user is in group A and should be recognized as a member of group B) behavior under LDAP sync is not confirmed in available captures. AD's native `memberOf` attribute in many LDAP directory configurations does not automatically include nested group membership — the attribute lists only the direct parent group. Tenants relying on nested group inheritance for ZIA policy should test this explicitly and may need to flatten group membership in AD or use SCIM with explicit group membership expansion from the IdP.

### Group limit: 128 groups per user

ZIA enforces a hard limit of 128 groups per user. SCIM provisioning fails for users exceeding this limit. This affects large enterprises with fine-grained AD security groups where users routinely hold dozens or hundreds of group memberships. Solutions: (1) consolidate group membership before provisioning to ZIA; (2) use department-level policy instead of group-level for broad policy; (3) filter which groups are synced to ZIA (sync only ZIA-relevant groups, not all AD groups).

### Domain registration required before SCIM provisioning

The domain in the `userName` field must be pre-registered with Zscaler before any users with that domain can be provisioned via SCIM. Attempting to POST a user with an unregistered domain returns an error. This registration is done via Zscaler Support and can be a blocking step for tenants with multiple email domains.

### `directorySyncMigrateToScimEnabled` — one-way switch behavior

Setting `directorySyncMigrateToScimEnabled = true` disables LDAP directory synchronization for the tenant. This is intended as a one-way migration step. Toggling it back restores LDAP sync, but any SCIM-provisioned users that did not exist under LDAP sync may create duplicate or orphaned records. Test the migration in a staging tenant before applying to production.

### SAML assertion attribute scope (ZIA vs ZPA)

ZIA SAML assertions are restricted to user identity, group, and department attributes. ZPA supports arbitrary SAML attributes as policy criteria. A policy requirement like "route based on user's cost center attribute" is possible in ZPA but not directly in ZIA. ZIA can approximate this by mapping cost center to a department value, but this requires IdP-side attribute mapping configuration.

### Kerberos auth and GRE/IPsec tunnels

Kerberos transparent SSO works for domain-joined devices using Windows Integrated Authentication. Traffic arriving via GRE or IPsec tunnels without a Surrogate IP mapping cannot be attributed to a user via Kerberos alone — Kerberos authenticates the HTTP connection, but non-browser traffic (which doesn't go through a proxy-aware stack) doesn't carry Kerberos credentials. Enable Surrogate IP on the location to bridge non-browser GRE-forwarded traffic to authenticated user identity.

## Cross-links

- SCIM provisioning shared reference — [`../shared/scim-provisioning.md`](../shared/scim-provisioning.md)
- ZIA locations and Surrogate IP model — [`./locations.md`](./locations.md)
- GRE/IPsec with Surrogate IP for user identity — [`../shared/gre-tunnels.md`](../shared/gre-tunnels.md)
- SSL inspection — identity-based SSL rules require ZCC or Surrogate IP — [`./ssl-inspection.md § Edge cases`](./ssl-inspection.md)
- ZIA web log schema — `%s{login}`, `%s{dept}` user attribution fields — [`./logs/web-log-schema.md`](./logs/web-log-schema.md)
