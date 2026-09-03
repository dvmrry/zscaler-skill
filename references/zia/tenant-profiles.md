---
product: zia
topic: "tenant-profiles"
title: "Tenant Profiles — SaaS tenant restriction (corporate-only access)"
content-type: reasoning
last-verified: "2026-06-15"
verified-against:
  vendor/zscaler-help: dbe545d5918392c4067ff897e748698c80220fef
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zia/tenancy_restriction_profile.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/tenancy_restriction_profile.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/tenancy_restriction/tenancy_restriction.go"
  - "vendor/zscaler-help/about-tenant-profiles.md"
  - "https://help.zscaler.com/zia/adding-tenant-profiles"
  - "vendor/zscaler-help/adding-tenant-profiles.md"
  - "https://help.zscaler.com/zia/adding-ai-ml-applications-rule-cloud-app-control"
  - "vendor/zscaler-help/adding-ai-ml-applications-rule-cloud-app-control.md"
  - "vendor/zscaler-help/ranges-limitations-zia.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_cloud_app_control_rule.md"
  - "vendor/terraform-provider-zia/zia/resource_zia_tenant_restriction_profile.go"
  - "vendor/terraform-provider-zia/zia/data_source_zia_tenant_restriction_profile.go"
author-status: draft
---

# Tenant Profiles — SaaS tenant restriction (corporate-only access)

Source: `vendor/zscaler-help/about-tenant-profiles.md`; `vendor/zscaler-help/adding-tenant-profiles.md`.

A **Tenant Profile** is a named object that identifies a specific corporate tenant of a SaaS application. It gives Cloud App Control (CAC) the information it needs to distinguish "user signing into the company's Microsoft 365 tenant" from "user signing into a personal or third-party Microsoft 365 tenant" — even though both transactions go to the same Microsoft endpoints. Without a Tenant Profile, CAC can only act on the application as a whole; with one, it can scope a rule to the corporate tenant and allow/block everything else.

The feature has two moving parts: the Tenant Profile itself, and a CAC rule that references it as a criterion (`vendor/zscaler-help/about-tenant-profiles.md`). The current Help Add flow places Tenant Profiles at **Policies > Access Control > Internet & SaaS > Tenant Profiles** (`vendor/zscaler-help/adding-tenant-profiles.md:18-21`).

## What tenant profiles are — ZIA sub-tenant/MSP context

Despite the name "tenant profile," this feature is **not** about sub-tenants or MSP configuration in the ZIA management plane. It is about SaaS application tenant restriction — controlling which SaaS tenants (e.g., which Microsoft 365 directory) users can sign into while going through ZIA inspection.

Tenant Profiles belong to the ZIA **Tenant Restriction** capability, not to any ZIA multi-tenancy or MSP scoping feature. The current Help workflow places them under **Policies > Access Control > Internet & SaaS > Tenant Profiles** and applies them via Cloud App Control policy rules (`vendor/zscaler-help/adding-tenant-profiles.md:18-21`).

## Supported applications

Source: `vendor/zscaler-help/adding-tenant-profiles.md`; `vendor/zscaler-sdk-python/zscaler/zia/models/tenancy_restriction_profile.py`.

The current Help Add form lists 14 applications by display name: YouTube, Google Apps, Microsoft Login Services, Slack, Amazon Web Services, Dropbox, Webex Login Services, Zoho Login Services, Google Cloud Platform, Zoom, IBM SmartCloud, GitHub, ChatGPT, and Claude (`vendor/zscaler-help/adding-tenant-profiles.md:18-36`).

The SDK exposes 16 `app_type` token values — enumerated in the `add_restriction_profile` docstring (`vendor/zscaler-sdk-python/zscaler/zia/tenancy_restriction_profile.py:147-150`, and again in the `list_app_item_count` docstring at `:338-341`). The Python model itself (`models/tenancy_restriction_profile.py`) maps `appType` as a plain string field with no enum constraint, and the Go struct (`vendor/zscaler-sdk-go/zscaler/zia/services/tenancy_restriction/tenancy_restriction.go:22`) likewise stores `AppType` as a free string — so the docstring list is the only enumeration in source:

```
YOUTUBE, GOOGLE, MSLOGINSERVICES, SLACK, BOX, FACEBOOK, AWS, DROPBOX,
WEBEX_LOGIN_SERVICES, AMAZON_S3, ZOHO_LOGIN_SERVICES, GOOGLE_CLOUD_PLATFORM,
ZOOM, IBMSMARTCLOUD, GITHUB, CHATGPT_AI
```

The docstring count (16) is an SDK/API inventory, not a count of the current Help UI names: it includes `BOX`, `FACEBOOK`, and `AMAZON_S3`, which are not listed in the Help capture. The current Help body uses **Claude** as a display name and does not document an API token or SDK enum named `CLAUDE_AI`; do not infer that mapping from the Help label (`vendor/zscaler-help/adding-tenant-profiles.md:38-40`). The SDK docstring remains authoritative for the token list (`vendor/zscaler-sdk-python/zscaler/zia/tenancy_restriction_profile.py:147-150`).

## Help UI create flow

Source: `vendor/zscaler-help/adding-tenant-profiles.md:18-21,49-51`.

The current Help create flow starts at **Policies > Access Control > Internet &
SaaS > Tenant Profiles**, followed by **Add Tenant Profile**
(`vendor/zscaler-help/adding-tenant-profiles.md:18-21`). The form requires a
unique Tenant Profile Name, displays that name while configuring the related
Cloud App Control rule, permits an optional Description of at most 10,240
characters, and then asks the administrator to save and activate the change
(`vendor/zscaler-help/adding-tenant-profiles.md:49-51`). These are Help UI
fields and workflow steps; provider/SDK/API fields are described separately
below.

## How a Tenant Profile is constructed

Source: `vendor/zscaler-sdk-python/zscaler/zia/models/tenancy_restriction_profile.py`; `vendor/terraform-provider-zia/zia/resource_zia_tenant_restriction_profile.go`.

Each profile carries:

- `app_type` — which SaaS (one profile = one app).
- `item_type_primary` / `item_data_primary` — the primary identifier for the tenant. What this means varies by app.
- `item_type_secondary` / `item_data_secondary` — optional second identifier (e.g., tenant domain names alongside a directory ID).
- App-specific boolean flags (see below).
- `item_value` — for YouTube only: content category restrictions (Film & Animation, Music, Gaming, etc.).

### Per-app identifier shape

The same 18 item-type tokens are valid for both `item_type_primary` and `item_type_secondary` (the SDK docstring states the secondary list is "Same as item_type_primary"). The full set is enumerated in the `add_restriction_profile` docstring (`vendor/zscaler-sdk-python/zscaler/zia/tenancy_restriction_profile.py:152-160`) and repeated for the count helper at `:343-351`:

```
TENANT_RESTRICTION_TEAM_ID, TENANT_RESTRICTION_ALLOWED_WORKSPACE_ID,
TENANT_RESTRICTION_DOMAIN, TENANT_RESTRICTION_TENANT_NAME,
TENANT_RESTRICTION_TENANT_DIRECTORY, TENANT_RESTRICTION_CHANNEL_ID,
TENANT_RESTRICTION_CATEGORY_ID, TENANT_RESTRICTION_SCHOOL_ID,
TENANT_RESTRICTION_REQUEST_WORKSPACE_ID, TENANT_RESTRICTION_EXP_BUCKET_OWNERID,
TENANT_RESTRICTION_EXP_BUCKET_SRC_OWNERID, TENANT_RESTRICTION_RESTRICT_MSA,
TENANT_RESTRICTION_TENANT_POLICY_ID, TENANT_RESTRICTION_ACCOUNT_ID,
TENANT_RESTRICTION_TENANT_ORG_ID, TENANT_RESTRICTION_POLICY_LABEL,
TENANT_RESTRICTION_ENTERPRISE_SLUG, TENANT_RESTRICTION_WORKSPACE_ID
```

This is a single flat list with no per-app correspondence in source. The Python model (`models/tenancy_restriction_profile.py:42,46`) and the Go struct (`tenancy_restriction.go:24-25`) carry `itemTypePrimary`/`itemTypeSecondary` as plain strings with no enum constraint, and the Terraform provider's `item_type_primary` / `item_type_secondary` schema (`resource_zia_tenant_restriction_profile.go:76-89`) deliberately does **not** validate the value — it points operators to the help API doc (`https://help.zscaler.com/zia/cloud-app-control-policy#/tenancyRestrictionProfile-get`) instead. So nothing in vendored source maps a token to a specific app.

The table below pairs each app with the token it most plausibly uses, based on token names and the SDK's Microsoft worked example (`tenancy_restriction_profile.py:202-205`, which uses `TENANT_RESTRICTION_TENANT_DIRECTORY` primary + `TENANT_RESTRICTION_TENANT_NAME` secondary for `MSLOGINSERVICES`). **Only the Microsoft row is confirmed by source; every other row is Tier C inference** from the token name, not a stated mapping:

| App | Primary identifier type | What it holds | Backing |
|---|---|---|---|
| Microsoft Login Services (`MSLOGINSERVICES`) | `TENANT_RESTRICTION_TENANT_DIRECTORY` | Azure AD tenant directory ID (UUID) | Tier A — SDK example `:202-205` |
| Microsoft Login Services | `TENANT_RESTRICTION_TENANT_NAME` (secondary) | Verified domain names for that tenant | Tier A — SDK example `:202-205` |
| Google / Google Apps | `TENANT_RESTRICTION_DOMAIN` | G Suite / Workspace domain (e.g., `example.com`) | Tier C — inferred |
| Slack | `TENANT_RESTRICTION_WORKSPACE_ID` | Slack workspace ID | Tier C — inferred |
| GitHub | `TENANT_RESTRICTION_ENTERPRISE_SLUG` | GitHub Enterprise slug | Tier C — inferred |
| YouTube | — (uses `item_value`) | Content category enum list | Tier C — inferred |
| AWS / Amazon S3 | `TENANT_RESTRICTION_ACCOUNT_ID` | AWS account ID | Tier C — inferred |
| Dropbox | `TENANT_RESTRICTION_TEAM_ID` | Dropbox team ID | Tier C — inferred |
| Zoom | `TENANT_RESTRICTION_TENANT_ORG_ID` | Zoom organization ID | Tier C — inferred |

The remaining tokens (`TENANT_RESTRICTION_ALLOWED_WORKSPACE_ID`, `TENANT_RESTRICTION_CHANNEL_ID`, `TENANT_RESTRICTION_CATEGORY_ID`, `TENANT_RESTRICTION_SCHOOL_ID`, `TENANT_RESTRICTION_REQUEST_WORKSPACE_ID`, `TENANT_RESTRICTION_EXP_BUCKET_OWNERID`, `TENANT_RESTRICTION_EXP_BUCKET_SRC_OWNERID`, `TENANT_RESTRICTION_RESTRICT_MSA`, `TENANT_RESTRICTION_POLICY_LABEL`, `TENANT_RESTRICTION_TENANT_POLICY_ID`) cover other apps and modes; the per-app pairing for these is not stated in any vendored source. To resolve a specific app's required token authoritatively, consult the help API doc the TF schema links, or read it off an existing profile.

### Microsoft-specific flags (Tier A, SDK)

Source: `vendor/terraform-provider-zia/zia/resource_zia_tenant_restriction_profile.go:90` (`restrict_personal_o365_domains`), `:100` (`ms_login_services_tr_v2`); also the Go struct `vendor/zscaler-sdk-go/zscaler/zia/services/tenancy_restriction/tenancy_restriction.go:26,28`.

- `restrict_personal_o365_domains` (bool) — blocks access from personal Microsoft Account (MSA) domains.
- `ms_login_services_tr_v2` (bool) — selects the v2 protocol for tenant restriction. Newer Microsoft tenants use v2. If corporate tenant restriction isn't working, check this flag — a v1/v2 mismatch is a common cause.

### Google-specific flags (Tier A, SDK)

Source: `vendor/zscaler-sdk-python/zscaler/zia/models/tenancy_restriction_profile.py`; `vendor/terraform-provider-zia/zia/resource_zia_tenant_restriction_profile.go`.

- `allow_google_consumers` (bool) — allows personal Google accounts to pass through (tenant restriction applies to Workspace, but consumer Gmail is not blocked).
- `allow_google_visitors` (bool) — allows "visitor" sessions (Google account login flows used for external sharing).
- `allow_gcp_cloud_storage_read` (bool) — allows read-only GCP Cloud Storage access even when the GCP tenant restriction would otherwise block it.

## How CAC uses Tenant Profiles

Source: `vendor/zscaler-help/adding-tenant-profiles.md:16,42-47`.

A CAC rule can reference a Tenant Profile as a criterion. When it does, the rule fires only when the user is accessing the matching SaaS tenant. The general pattern for tenant restriction:

1. Create a Tenant Profile identifying the corporate tenant.
2. Create a CAC rule: `Action = Allow`, `Tenant Profile = <corporate profile>`.
3. Allow-for-the-corporate-tenant automatically blocks other tenants for most apps — the Help article states this explicitly: "Allowing a specific tenant automatically blocks other tenants for most of the cloud applications, and subsequent policies are not evaluated." For **YouTube** and **Amazon Web Services**, subsequent policies are evaluated, so an explicit block policy is required for other tenants (`vendor/zscaler-help/adding-tenant-profiles.md:42`).

**YouTube and AWS are exceptions** (Tier A, help doc): for these two apps, subsequent policies continue to be evaluated, so allowing the corporate tenant does not implicitly block others. An explicit block rule is required for other-tenant traffic to YouTube or AWS.

## How tenant profiles interact with policy inheritance

Source: `vendor/zscaler-help/adding-tenant-profiles.md`; `vendor/zscaler-sdk-python/zscaler/zia/tenancy_restriction_profile.py`.

Tenant Profiles are referenced in CAC rules. CAC rules in ZIA inherit the standard ZIA policy evaluation model — rules are evaluated top-to-bottom, first match wins (with the YouTube/AWS exceptions above). Tenant Profile criteria compose with other rule criteria (user, department, location, URL category) using AND logic within a rule.

A Tenant Profile set on one CAC rule does not affect other rules. If a tenant profile is deleted, CAC rules referencing it may behave unexpectedly — the profile reference becomes stale. ZIA does not prevent deletion of profiles referenced by active rules.

## Help UI visibility in AI/ML Applications rules

Source: `vendor/zscaler-help/adding-ai-ml-applications-rule-cloud-app-control.md:45-50`.

When configuring an AI/ML Applications Cloud App Control rule, the Help capture
says **Tenant Profiles** appears only when ChatGPT or Claude is selected and the
selected applications are not exempted from SSL/TLS Inspection. This is a Help
UI visibility condition, separate from the provider/SDK/API token inventory
above (`vendor/zscaler-help/adding-ai-ml-applications-rule-cloud-app-control.md:45-50`).

## SSL inspection is a hard prerequisite

Source: `vendor/zscaler-help/adding-tenant-profiles.md:44-47`.

The Help article requires selecting the relevant cloud applications as criteria
in an SSL Inspection rule when their Tenant Profiles are associated with a
Cloud App Control rule (`vendor/zscaler-help/adding-tenant-profiles.md:44`). The
capture does not describe the on-wire tenant-restriction mechanism.

The same passage gives the per-app SSL-inspection targets and ordering
(`vendor/zscaler-help/adding-tenant-profiles.md:44-47`):

- **Office 365**: select **Microsoft Login Services** as the cloud application, with a rule order **higher than** the Office 365 One Click Rule (`vendor/zscaler-help/adding-tenant-profiles.md:45`).
- **Google Apps**: select **Google Login Services** as the cloud application (`vendor/zscaler-help/adding-tenant-profiles.md:46`).
- **Webex Teams / Webex Meetings**: select **Webex Login Services** as the cloud application (`vendor/zscaler-help/adding-tenant-profiles.md:47`).

The exact wire mechanic by which ZIA conveys the tenant constraint to the SaaS vendor is not described in this Help capture — see Open questions.

## API surface

Source: `vendor/zscaler-sdk-python/zscaler/zia/tenancy_restriction_profile.py:28,63`; `vendor/zscaler-sdk-go/zscaler/zia/services/tenancy_restriction/tenancy_restriction.go:16`.

**Endpoint:** `GET/POST/PUT/DELETE /zia/api/v1/tenancyRestrictionProfile` (base `/zia/api/v1` at `tenancy_restriction_profile.py:28`, path fragment at `:63`; Go const `tenantRestrictionEndpoint` at `tenancy_restriction.go:16`).

**Python SDK service** (`client.zia.tenancy_restriction_profile`) — note the method names all carry the `_restriction_profile` suffix; the bare `*_profile` names do not exist and will raise `AttributeError`:

| Method | Signature | Source line | Notes |
|---|---|---|---|
| `list_restriction_profile` | `(query_params=None) -> APIResult[List]` | `:34` | Lists all profiles; supports a client-side `search` query param |
| `get_restriction_profile` | `(profile_id) -> APIResult` | `:94` | Get by ID |
| `add_restriction_profile` | `(**kwargs) -> APIResult` | `:138` | Create |
| `update_restriction_profile` | `(profile_id, **kwargs) -> APIResult` | `:239` | Update (HTTP PUT) |
| `delete_restriction_profile` | `(profile_id) -> APIResult` | `:291` | Delete |
| `list_app_item_count` | `(app_type, item_type) -> APIResult` | `:328` | Count items in use per type — useful for capacity checks |

The `list_app_item_count` helper at `/tenancyRestrictionProfile/app-item-count/{app_type}/{item_type}` (`:374`) returns how many items of a given type are already in use across profiles. The Python signature exposes only `app_type` and `item_type`; the docstring mentions an `exclude_profile` argument (`:352`) but the implementation does not accept it — the Go SDK does (below).

**Go SDK service** (`vendor/zscaler-sdk-go/.../tenancy_restriction/tenancy_restriction.go`) — function-based, not method-based:

| Function | Source line | Notes |
|---|---|---|
| `Get(profileID)` | `:38` | Get by ID |
| `GetByName(profileName)` | `:49` | Case-insensitive name lookup over all pages |
| `Create(profile)` | `:63` | Create |
| `Update(id, profile)` | `:78` | Update via `UpdateWithPut` (HTTP PUT) |
| `Delete(profileID)` | `:89` | Delete |
| `GetAll()` | `:98` | List all (paged) |
| `GetAppItemCount(appType, itemType, excludeProfile...)` | `:104` | Count helper; accepts an optional `excludeProfile` ID as an `?excludeProfile=` query param (`:107-109`) |

The Go `TenancyRestrictionProfile` struct (`tenancy_restriction.go:19-36`) carries two read-only fields the Python model omits: `lastModifiedTime` (`:34`) and `lastModifiedUserId` (`:35`).

**Terraform resource:** `zia_tenant_restriction_profile`. All profile fields map directly to Terraform schema attributes; the only computed-only fields are `id` and `profile_id` (`resource_zia_tenant_restriction_profile.go:49-58`). The `last_modified_time` / `last_modified_user_id` fields exposed by the Go struct surface through the data source, not the managed resource.

## Per-app capacity limits

Source: `vendor/zscaler-help/ranges-limitations-zia.md:247-269`.

The published limits table gives concrete per-app identifier capacities (Tier A — `ranges-limitations-zia.md`). These are the numbers to check before assuming a profile or rule has room:

| App | Per-profile limit | Cross-profile / per-rule notes | Identifier length |
|---|---|---|---|
| Amazon Web Services | 256 account IDs (12 digits each) | max 2,048 across profiles | — |
| ChatGPT | 128 workspace IDs | max 16 profiles **or** 20 workspace IDs per rule | up to 64 chars |
| Dropbox Team ID | 100 team IDs | — | up to 64 chars |
| GitHub | 1 enterprise slug | max 100 profiles per org; 1 profile per rule | up to 256 chars |
| Google App Domains | 100 domains | max 2,048 across profiles | up to 160 chars |
| Google Cloud Platform | 100 organization IDs | max 2,048 across profiles | up to 64 chars |
| IBM SmartCloud | 100 account IDs | max 100 per rule, 256 across profiles | up to 64 chars |
| Microsoft Login Services (v1) — Tenant Directory ID | 1 tenant directory | — | up to 64 chars |
| Microsoft Login Services (v2) — Tenant Directory ID:Policy ID | 1 | — | up to 256 chars |
| Microsoft Login Services (v1) — M365 Tenants / Tenant IDs | 500 | — | up to 64 chars |
| Slack — Your Workspace ID | 100 workspace IDs | — | up to 64 chars |
| Slack — Allowed Workspace ID | 256 workspace IDs | — | up to 64 chars |
| YouTube — Channel ID | 200 channel IDs | — | up to 100 chars |
| YouTube — School ID | 100 school IDs | — | up to 127 chars |
| Webex Login Services | 100 Webex tenants | max 250 across profiles | — |
| Zoho Login Services | 120 Zoho IDs | max 2,048 across profiles | up to 127 chars |
| Zoom | 1 policy label | — | up to 64 chars |

Two org/rule-level caps sit alongside the per-app numbers (`ranges-limitations-zia.md:226,247`): **16 tenants per SaaS application** (contact support to increase, `:226`) and **16 Tenant Profiles per Rule** (`:247`). The "16 profiles or 20 workspace IDs per rule" ChatGPT note above is the per-app instance of that rule-level cap.

## Gotchas

Source: `vendor/zscaler-help/adding-tenant-profiles.md`; `vendor/zscaler-help/ranges-limitations-zia.md`; `vendor/terraform-provider-zia/zia/resource_zia_tenant_restriction_profile.go`; `vendor/terraform-provider-zia/zia/data_source_zia_tenant_restriction_profile.go`.

**1. SSL inspection is a hard prerequisite — and easy to silently break.**
The Help article requires SSL Inspection for the relevant cloud application when its Tenant Profile is associated with a Cloud App Control rule (`vendor/zscaler-help/adding-tenant-profiles.md:44`). The capture does not document what happens on the wire when inspection is bypassed; see Open questions.

**2. Login service ≠ content service — target the right app in SSL inspection.**
Source: `vendor/zscaler-help/adding-tenant-profiles.md:44-47`.

For SSL Inspection, the Help article names the login-service cloud applications to select: **Microsoft Login Services** for Office 365, **Google Login Services** for Google Apps, and **Webex Login Services** for Webex (`vendor/zscaler-help/adding-tenant-profiles.md:44-47`). It does not state a separate wire distinction between login and content services.

**3. Corporate tenant ID rotation.**
If the Azure AD directory ID or Google Workspace primary domain changes (tenant migration, merger, domain rename), the Tenant Profile's `item_data_primary` becomes stale. The profile keeps matching at the rule level, but it now carries the old identifier and the SaaS vendor rejects or misidentifies the tenant. No Zscaler-side error is visible — audit Tenant Profile data when a tenant identity change occurs.

**4. Unmanaged devices bypass the proxy.**
Tenant restriction only applies to traffic that flows through ZIA. Unmanaged personal devices that connect direct-to-internet, or managed devices using a split-tunnel VPN that doesn't route SaaS traffic through ZIA, are invisible to CAC and tenant restriction. The feature is an on-path control, not a SaaS-side one.

**5. v1 vs v2 protocol mismatch for Microsoft.**
The `ms_login_services_tr_v2` flag selects v1 vs v2 tenant restriction for `MSLOGINSERVICES` (`resource_zia_tenant_restriction_profile.go:100-103`). The limits table separates a v1 Tenant Directory ID (up to 64 chars) from a v2 Tenant Directory ID:Policy ID (up to 256 chars — `ranges-limitations-zia.md:260-261`), so the two modes carry differently-shaped identifiers. If the flag is `false` (v1) but the tenant requires v2, the restriction can fail open — symptom: corporate tenant restriction appears to allow all sign-ins. Fix: set `ms_login_services_tr_v2 = true`. (The precise on-wire v1/v2 difference is an Open question.)

**6. YouTube and AWS require an explicit block rule.**
As noted above, these two apps don't inherit an implicit "block everything else" from the allow rule. Without a separate CAC block rule scoped to "all other YouTube/AWS tenants," the allow rule for the corporate tenant coexists with unconstrained access to other tenants.

**7. Rule-level and per-app caps, not just the CAC rule count.**
Two caps bite specifically on tenant restriction (see "Per-app capacity limits" above): a hard **16 Tenant Profiles per Rule** (`ranges-limitations-zia.md:247`) and per-app identifier ceilings (e.g., GitHub allows only 1 profile per rule; ChatGPT caps at 16 profiles or 20 workspace IDs per rule). These are easier to hit than the generic CAC rule-count cap when consolidating many tenants into one rule. The underlying CAC rules also count against the standard per-category rule cap like any other CAC rule.

**8. Profile deletion does not cascade to CAC rules.**
Deleting a Tenant Profile that is referenced by an active CAC rule leaves a stale reference. ZIA does not prevent this operation or warn about dependent rules. Audit dependent CAC rules before deleting a profile.

**9. Terraform provider versions before v4.7.23 capped CAC tenant profile references too low.**
Upstream issue [zscaler/terraform-provider-zia#577](https://github.com/zscaler/terraform-provider-zia/issues/577) reported that `zia_cloud_app_control_rule.tenancy_profile_ids` was limited to eight IDs by provider schema even though the API can return more. The provider removed local caps from `tenancy_profile_ids` and `cloud_app_instances` in v4.7.23. Treat the effective limit as API-owned, not provider-owned; if a tenant uses more than eight tenant profiles in one CAC rule, require provider v4.7.23 or later before interpreting the plan as policy drift.

## Open questions

These claims are plausible and widely documented by the SaaS vendors themselves, but are **not backed by any vendored Zscaler source** — a grep of both help captures (`about-tenant-profiles.md`, `adding-tenant-profiles.md`) returns zero hits for "header", "Restrict-Access", "X-GoogApps", or "inject". They are recorded here as unverified pending a Zscaler-sourced citation (e.g., a TR/header-mechanic help article not yet vendored). All three are tracked together as `zia-67` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-67-tenant-profile-per-app-wire-mechanic-and-v1v2-protocol-semantics).

- **Wire mechanic for Microsoft 365 tenant restriction.** Microsoft's own tenant-restriction documentation defines the `Restrict-Access-To-Tenants` (allowed tenant list) and `Restrict-Access-Context` (directory ID) request headers, and ZIA is presumed to inject these into the inspected login flow. Vendored Zscaler source does not state this; only the SSL-inspection prerequisite (above) is confirmed.
- **Wire mechanic for Google Workspace tenant restriction.** Google defines the `X-GoogApps-Allowed-Domains` header for the same purpose. Same status: vendor-documented in general, not confirmed in vendored Zscaler source.
- **v1 vs v2 protocol semantics.** The `ms_login_services_tr_v2` flag selects "v2 for tenant restriction on MSLOGINSERVICES" (`resource_zia_tenant_restriction_profile.go:100-103`), and the limits table distinguishes v1 (Tenant Directory ID, up to 64 chars) from v2 (Tenant Directory ID:Policy ID, up to 256 chars — `ranges-limitations-zia.md:260-261`). What the two protocol versions differ in on the wire, and which Microsoft tenants require v2, is not described in vendored source.

## Cross-links

- CAC rule mechanics and how criteria compose: [`./cloud-app-control.md`](./cloud-app-control.md)
- SSL inspection — pipeline position, One-Click bypass, how inspection gates post-decrypt feature enforcement: [`./ssl-inspection.md`](./ssl-inspection.md)
- DLP with tenant-restricted context (e.g., allowing data upload only to the corporate tenant): [`./dlp.md`](./dlp.md)
