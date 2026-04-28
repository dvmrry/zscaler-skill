---
product: zia
topic: "tenant-profiles"
title: "Tenant Profiles — SaaS tenant restriction (corporate-only access)"
content-type: reasoning
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zia/tenancy_restriction_profile.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/tenancy_restriction_profile.py"
  - "vendor/zscaler-help/about-tenant-profiles.md"
  - "vendor/zscaler-help/adding-tenant-profiles.md"
  - "vendor/terraform-provider-zia/zia/resource_zia_tenant_restriction_profile.go"
  - "vendor/terraform-provider-zia/zia/data_source_zia_tenant_restriction_profile.go"
author-status: draft
---

# Tenant Profiles — SaaS tenant restriction (corporate-only access)

A **Tenant Profile** is a named object that identifies a specific corporate tenant of a SaaS application. It gives Cloud App Control (CAC) the information it needs to distinguish "user signing into the company's Microsoft 365 tenant" from "user signing into a personal or third-party Microsoft 365 tenant" — even though both transactions go to the same Microsoft endpoints. Without a Tenant Profile, CAC can only act on the application as a whole; with one, it can scope a rule to the corporate tenant and allow/block everything else.

The feature has two moving parts: the Tenant Profile itself (Administration > Tenant Profiles), and a CAC rule that references it as a criterion. (Tier A — vendor/zscaler-help/about-tenant-profiles.md.)

## What tenant profiles are — ZIA sub-tenant/MSP context

Despite the name "tenant profile," this feature is **not** about sub-tenants or MSP configuration in the ZIA management plane. It is about SaaS application tenant restriction — controlling which SaaS tenants (e.g., which Microsoft 365 directory) users can sign into while going through ZIA inspection.

Tenant Profiles belong to the ZIA **Tenant Restriction** capability, not to any ZIA multi-tenancy or MSP scoping feature. They appear under Administration > Tenant Profiles and are applied via Cloud App Control policy rules.

## Supported applications

Tier A — vendor/zscaler-help/adding-tenant-profiles.md lists 13 applications by display name; the SDK `app_type` enum has 16 entries:

```
YOUTUBE, GOOGLE, MSLOGINSERVICES, SLACK, BOX, FACEBOOK, AWS, DROPBOX,
WEBEX_LOGIN_SERVICES, AMAZON_S3, ZOHO_LOGIN_SERVICES, GOOGLE_CLOUD_PLATFORM,
ZOOM, IBMSMARTCLOUD, GITHUB, CHATGPT_AI
```

The help article lists: YouTube, Google Apps, Microsoft Login Services, Slack, Amazon Web Services, Dropbox, Webex Login Services, Zoho Login Services, Google Cloud Platform, Zoom, IBM SmartCloud, GitHub, ChatGPT. The SDK enum is the authoritative count.

## How a Tenant Profile is constructed

Each profile carries:

- `app_type` — which SaaS (one profile = one app).
- `item_type_primary` / `item_data_primary` — the primary identifier for the tenant. What this means varies by app.
- `item_type_secondary` / `item_data_secondary` — optional second identifier (e.g., tenant domain names alongside a directory ID).
- App-specific boolean flags (see below).
- `item_value` — for YouTube only: content category restrictions (Film & Animation, Music, Gaming, etc.).

### Per-app identifier shape

The `item_type_primary` enum spans 18 possible values covering all supported apps (Tier A, SDK source):

| App | Primary identifier type | What it holds |
|---|---|---|
| Microsoft Login Services (`MSLOGINSERVICES`) | `TENANT_RESTRICTION_TENANT_DIRECTORY` | Azure AD tenant directory ID (UUID) |
| Microsoft Login Services | `TENANT_RESTRICTION_TENANT_NAME` (secondary) | Verified domain names for that tenant |
| Google / Google Apps | `TENANT_RESTRICTION_DOMAIN` | G Suite / Workspace domain (e.g., `example.com`) |
| Slack | `TENANT_RESTRICTION_WORKSPACE_ID` | Slack workspace ID |
| GitHub | `TENANT_RESTRICTION_ENTERPRISE_SLUG` | GitHub Enterprise slug |
| YouTube | — (uses `item_value`) | Content category enum list |
| AWS / Amazon S3 | `TENANT_RESTRICTION_ACCOUNT_ID` | AWS account ID |
| Dropbox | `TENANT_RESTRICTION_TEAM_ID` | Dropbox team ID |
| Zoom | `TENANT_RESTRICTION_TENANT_ORG_ID` | Zoom organization ID |

The full item-type enum includes `TENANT_RESTRICTION_ALLOWED_WORKSPACE_ID`, `TENANT_RESTRICTION_CHANNEL_ID`, `TENANT_RESTRICTION_CATEGORY_ID`, `TENANT_RESTRICTION_SCHOOL_ID`, `TENANT_RESTRICTION_REQUEST_WORKSPACE_ID`, `TENANT_RESTRICTION_EXP_BUCKET_OWNERID`, `TENANT_RESTRICTION_EXP_BUCKET_SRC_OWNERID`, `TENANT_RESTRICTION_RESTRICT_MSA`, `TENANT_RESTRICTION_POLICY_LABEL`, `TENANT_RESTRICTION_POLICY_ID` for additional apps. Per-app mapping for apps not in the table above is Tier D (inferred from enum names, not confirmed by help docs).

### Microsoft-specific flags (Tier A, SDK)

- `restrict_personal_o365_domains` (bool) — blocks access from personal Microsoft Account (MSA) domains.
- `ms_login_services_tr_v2` (bool) — selects the v2 protocol for tenant restriction. Newer Microsoft tenants use v2. If corporate tenant restriction isn't working, check this flag — a v1/v2 mismatch is a common cause. Source: `resource_zia_tenant_restriction_profile.go:101–104`.

### Google-specific flags (Tier A, SDK)

- `allow_google_consumers` (bool) — allows personal Google accounts to pass through (tenant restriction applies to Workspace, but consumer Gmail is not blocked).
- `allow_google_visitors` (bool) — allows "visitor" sessions (Google account login flows used for external sharing).
- `allow_gcp_cloud_storage_read` (bool) — allows read-only GCP Cloud Storage access even when the GCP tenant restriction would otherwise block it.

## How CAC uses Tenant Profiles

A CAC rule can reference a Tenant Profile as a criterion. When it does, the rule fires only when the user is accessing the matching SaaS tenant. The general pattern for tenant restriction:

1. Create a Tenant Profile identifying the corporate tenant.
2. Create a CAC rule: `Action = Allow`, `Tenant Profile = <corporate profile>`.
3. Allow-for-the-corporate-tenant automatically blocks other tenants for most apps — the help article states this explicitly: "Allowing a specific tenant automatically blocks other tenants for most of the cloud applications, and subsequent policies are not evaluated." Source: `adding-tenant-profiles.md`.

**YouTube and AWS are exceptions** (Tier A, help doc): for these two apps, subsequent policies continue to be evaluated, so allowing the corporate tenant does not implicitly block others. An explicit block rule is required for other-tenant traffic to YouTube or AWS.

## How tenant profiles interact with policy inheritance

Tenant Profiles are referenced in CAC rules. CAC rules in ZIA inherit the standard ZIA policy evaluation model — rules are evaluated top-to-bottom, first match wins (with the YouTube/AWS exceptions above). Tenant Profile criteria compose with other rule criteria (user, department, location, URL category) using AND logic within a rule.

A Tenant Profile set on one CAC rule does not affect other rules. If a tenant profile is deleted, CAC rules referencing it may behave unexpectedly — the profile reference becomes stale. ZIA does not prevent deletion of profiles referenced by active rules.

## Header-injection mechanic

Tenant restriction works at the protocol level by injecting HTTP request headers that the SaaS vendor reads server-side to enforce tenant access.

- For Microsoft 365: `Restrict-Access-To-Tenants` carries the allowed tenant IDs; `Restrict-Access-Context` carries the directory ID. These headers cause Microsoft's authentication endpoints to reject sign-in attempts targeting other tenants.
- For Google Workspace: `X-GoogApps-Allowed-Domains` lists the allowed Workspace domains. Google's authentication flow rejects sign-in to accounts outside those domains.

**This injection requires SSL inspection.** The traffic between the user's browser and the SaaS vendor's auth endpoint is TLS-encrypted. ZIA must terminate and re-encrypt (inspect) the TLS session to insert headers into the plaintext request before re-encrypting and forwarding. If SSL inspection is bypassed for Office 365 (e.g., via the M365 One-Click bypass), tenant restriction headers cannot be injected and the feature silently stops working. (Tier A — vendor/zscaler-help/adding-tenant-profiles.md: "Ensure to select these cloud applications as a criterion in an SSL Inspection rule if their tenant profiles are associated with a cloud application rule.")

SSL Inspection rule ordering for O365: the SSL Inspection rule selecting Microsoft Login Services must have a **higher rule order** (evaluated earlier) than the Office 365 One-Click Rule. (Tier A — vendor/zscaler-help/adding-tenant-profiles.md.)

## API surface

**Endpoint:** `GET/POST/PUT/DELETE /zia/api/v1/tenancyRestrictionProfile`. Source: `tenancy_restriction_profile.py:63`.

**SDK service** (`client.zia.tenancy_restriction_profile`):

| Method | Signature | Notes |
|---|---|---|
| `list_profiles` | `(query_params=None) -> APIResult[List]` | Lists all profiles |
| `get_profile` | `(profile_id) -> APIResult` | Get by ID |
| `add_profile` | `(**kwargs) -> APIResult` | Create |
| `update_profile` | `(profile_id, **kwargs) -> APIResult` | Update |
| `delete_profile` | `(profile_id) -> APIResult` | Delete |
| `list_app_item_count` | `(app_type, item_type) -> APIResult` | Count items in use per type — useful for capacity checks |

The `list_app_item_count` helper at `/tenancyRestrictionProfile/app-item-count/{app_type}/{item_type}` returns how many items of a given type are already in use across profiles, useful for capacity checks.

**Terraform resource:** `zia_tenant_restriction_profile`. All profile fields map directly to Terraform schema attributes; no computed-only fields except `id`/`profile_id` and `last_modified_time`/`last_modified_user_id` (data source only).

## Gotchas

**1. SSL inspection is a hard prerequisite — and easy to silently break.**
If SSL inspection is bypassed for the SaaS app in question (One-Click rules, URL-category bypass, or per-rule bypass), the header injection path doesn't exist. The tenant restriction CAC rule may still match the app, but it can't enforce the tenant constraint — users will reach any tenant. This fails silently; there's no error, just enforcement absence. Always verify SSL inspection is active for the login service (not just the app's content domains).

**2. Login service ≠ content service — target the right app in SSL inspection.**
For M365, the tenant-restriction header must be injected during the **login flow** (`login.microsoftonline.com`), not during content access. The SSL inspection rule must select **Microsoft Login Services** as the cloud application, not the generic "Microsoft Office 365" or "MS O365 Optimize" categories. Same applies to Google (Google Login Services) and Webex (Webex Login Services). Source: `adding-tenant-profiles.md`.

**3. Corporate tenant ID rotation.**
If the Azure AD directory ID or Google Workspace primary domain changes (tenant migration, merger, domain rename), the Tenant Profile's `item_data_primary` becomes stale. The profile keeps matching at the rule level, but the injected header carries the old identifier and Microsoft/Google rejects or misidentifies the tenant. No Zscaler-side error is visible — audit Tenant Profile data when a tenant identity change occurs.

**4. Unmanaged devices bypass the proxy.**
Tenant restriction only applies to traffic that flows through ZIA. Unmanaged personal devices that connect direct-to-internet, or managed devices using a split-tunnel VPN that doesn't route SaaS traffic through ZIA, are invisible to CAC and tenant restriction. The feature is an on-path control, not a SaaS-side one.

**5. v1 vs v2 protocol mismatch for Microsoft.**
If `ms_login_services_tr_v2` is set to `false` (v1) but the tenant uses modern Microsoft tenant restriction (v2), the injected headers may be ignored or misinterpreted by Microsoft's auth layer. Symptom: corporate tenant restriction appears to allow all sign-ins. Fix: enable `ms_login_services_tr_v2 = true`.

**6. YouTube and AWS require an explicit block rule.**
As noted above, these two apps don't inherit an implicit "block everything else" from the allow rule. Without a separate CAC block rule scoped to "all other YouTube/AWS tenants," the allow rule for the corporate tenant coexists with unconstrained access to other tenants.

**7. Per-category rule cap applies.**
Tenant restriction profiles are referenced in CAC rules. The 127-rules-per-category cap (extendable to 2,048 via support) applies to those rules like any other CAC rule. In orgs with fine-grained departmental CAC rules, the cap can be relevant.

**8. Profile deletion does not cascade to CAC rules.**
Deleting a Tenant Profile that is referenced by an active CAC rule leaves a stale reference. ZIA does not prevent this operation or warn about dependent rules. Audit dependent CAC rules before deleting a profile.

## Cross-links

- CAC rule mechanics and how criteria compose: [`./cloud-app-control.md`](./cloud-app-control.md)
- SSL inspection — pipeline position, One-Click bypass, how inspection gates post-decrypt feature enforcement: [`./ssl-inspection.md`](./ssl-inspection.md)
- DLP with tenant-restricted context (e.g., allowing data upload only to the corporate tenant): [`./dlp.md`](./dlp.md)
