---
product: zia
topic: "authentication"
title: "Authentication Policy — login flow, SAML, surrogate IP, frequency, step-up"
content-type: reasoning
last-verified: "2026-04-25"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zia/authentication_settings.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/authentication_settings.py"
  - "vendor/terraform-provider-zia/zia/resource_zia_location_management.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_advanced_settings.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_auth_settings_urls.go"
  - "vendor/zscaler-help/configuring-authentication-levels.md"
  - "vendor/zscaler-help/understanding-step-up-authentication.md"
  - "vendor/zscaler-help/understanding-step-up-authentication-zidentity.md"
author-status: draft
---

# Authentication Policy — login flow, SAML, surrogate IP, frequency, step-up

ZIA Authentication Policy is the **gate that runs before any other policy evaluates**. Until a user has an authenticated identity attached to their traffic — whether via a session cookie, a Surrogate IP binding, or a Kerberos ticket — policy rules that scope by user, group, or department cannot match, and the fallback is anonymous-user treatment. Authentication is enforced per location and sublocation; a sublocation can independently opt out even when its parent requires auth.

The three authentication methods are **SAML SSO** (redirect to an IdP; user gets a ZIA session cookie on return), **Hosted DB** (Zscaler-held username/password form), and **Kerberos** (AD Kerberos ticket passed transparently from a domain-joined machine). SAML and Kerberos are the production defaults for enterprise tenants. Hosted DB is primarily used for guest Wi-Fi or contractor populations without SSO coverage.

## Authentication frequency

Authentication frequency governs cookie lifetime — how long the PSE honors an existing session credential before demanding re-authentication. Controlled by `authFrequency` on the org-level auth settings object (`/zia/api/v1/authSettings`). (Tier A: SDK model `authentication_settings.py` lines 41–42.)

| `authFrequency` value | Behavior |
|---|---|
| `ALWAYS` | Authenticate on every new browser session (cookie discarded at browser close). Equivalent to session-only cookies. |
| `DAILY_COOKIE` | Cookie valid for one day. User re-authenticates at most once per day per device. |
| `WEEKLY_COOKIE` | Cookie valid for one week. |
| `MONTHLY_COOKIE` | Cookie valid for one month. |
| `CUSTOM_FREQUENCY` | Cookie valid for a custom duration in days. Set alongside `authCustomFrequency` (valid range: 1–180 days). |

Cookie lifetime applies to **browser-based** flows. Non-browser user agents (thick clients, service accounts, IoT devices) typically cannot follow a SAML redirect — they see a redirect as a failure. Those traffic sources should come from locations or sublocations where auth is not required, or should use Kerberos (transparent), or should arrive via a pre-authenticated proxy that injects identity headers. (Tier D inference — the redirect-failure behavior for non-browser UAs is a structural consequence of how SAML works, not explicitly documented in the captured sources.)

`authCustomFrequency` is an integer in days. Setting `auth_frequency = CUSTOM_FREQUENCY` without a valid `auth_custom_frequency` is an API-level error — the SDK docstring calls out the 1–180 day valid range. (Tier A: `authentication_settings.py` line 243.)

## Surrogate IP

Surrogate IP (also called IP Surrogate) is a **per-location opt-in feature** that binds an authenticated user identity to the source IP address seen by ZIA after the user successfully authenticates. Subsequent traffic from that IP during the binding TTL is attributed to that user without requiring a new cookie challenge. This is the primary mechanism for attributing identity to traffic from **non-browser sources** on a shared corporate network.

Per-location fields (Tier A: `resource_zia_location_management.go` lines 234–328):

| Field | Type | Description |
|---|---|---|
| `surrogate_ip` | bool | Enable IP Surrogate for this location. |
| `idle_time_in_minutes` | int | TTL for the IP-to-user binding. Required when `surrogate_ip` is true. |
| `surrogate_ip_enforced_for_known_browsers` | bool | Force browsers to also re-authenticate via cookie even when surrogacy is active. |
| `surrogate_refresh_time_in_minutes` | int | How often the surrogate binding is revalidated. Required when `surrogate_ip_enforced_for_known_browsers` is true. |
| `surrogate_refresh_time_unit` | string | `MINUTE`, `HOUR`, or `DAY`. |

The TF provider enforces these dependency rules at plan time (lines 483–494):

- `surrogate_ip = true` requires `idle_time_in_minutes > 0`
- `surrogate_ip = true` requires `auth_required = true`
- `surrogate_ip_enforced_for_known_browsers = true` requires `surrogate_ip = true`
- `surrogate_ip_enforced_for_known_browsers = true` requires a non-zero `surrogate_refresh_time_in_minutes` or `surrogate_refresh_time_unit`

There is also a global Advanced Settings flag `enforce_surrogate_ip_for_windows_app` (bool) that extends IP Surrogate attribution to Zscaler Client Connector Windows app traffic, independent of the per-location toggle. (Tier A: `resource_zia_advanced_settings.go` line 247.)

**NAT / shared-IP edge case:** IP Surrogate assumes one user per source IP within the binding TTL. Behind a NAT pool, many users share a small set of egress IPs. If User A authenticates and binds to 10.1.1.5, and User B subsequently sends traffic from the same IP (because DHCP reassigned it, or they share a NAT device), User B's traffic is attributed to User A until the binding expires or a new auth event overwrites it. See gotchas below.

## Auth required vs not required

Authentication enforcement is toggled **per location / per sublocation** via `auth_required` (bool). When `auth_required = false`, traffic from that source is forwarded without a user identity — it becomes anonymous traffic. Policy rules scoped by user, group, or department do not match anonymous traffic; only rules with no user/group scope (or explicit "any" user rules) apply.

Sublocations independently inherit or override the parent location's auth setting. The parent can have `auth_required = true` while a guest sublocation has `auth_required = false` — the sublocation's value wins for traffic that maps to it.

When a location has `auth_required = true` but a browser user hasn't authenticated yet, ZIA redirects HTTP traffic to the captive-portal / login page. HTTPS traffic that can't be redirected (pre-auth, no SSL inspection yet) is typically blocked or shows an error.

## Authentication exemptions

Two exemption layers govern which destinations skip the auth challenge:

**1. URL-level exempt list** (`/zia/api/v1/authSettings/exemptedUrls`): a flat list of domains/URLs where no cookie challenge is issued. Managed via `zia_auth_settings_urls` TF resource (up to 25,000 entries — Tier A: `resource_zia_auth_settings_urls.go` line 44). Typical entries: OS update endpoints, WPAD/PAC file servers, captive-portal detection URLs.

**2. Advanced Settings bypass lists** (Tier A: `resource_zia_advanced_settings.go` lines 31–196): more granular per-auth-method exemptions:

| Field | Bypasses |
|---|---|
| `auth_bypass_urls` / `auth_bypass_apps` / `auth_bypass_url_categories` | Cookie auth entirely |
| `kerberos_bypass_urls` / `kerberos_bypass_apps` / `kerberos_bypass_url_categories` | Kerberos auth only |
| `basic_bypass_apps` | Basic auth |
| `digest_auth_bypass_urls` / `digest_auth_bypass_apps` / `digest_auth_bypass_url_categories` | Digest auth |

Destinations on these lists reach ZIA without triggering an auth redirect. This is how OS auto-update traffic, captive-portal probes (`connectivitycheck.gstatic.com`, `msftconnecttest.com`), and ZCC registration endpoints are typically allowed to proceed before user identity is established.

## Auth methods — field-level detail

From the SDK model (Tier A: `authentication_settings.py`):

| Field | Purpose |
|---|---|
| `org_auth_type` | Primary authentication type for the org (`ANY`, `SAML`, `KERBEROS_SERVICE`, `LDAP`, `NONE`, etc.). |
| `saml_enabled` | Toggle for SAML SSO. |
| `kerberos_enabled` | Toggle for Kerberos. |
| `kerberos_pwd` | Read-only. Set only via the generate-KerberosPassword API — not writable directly. |
| `one_time_auth` | When `org_auth_type = NONE`, controls how initial passwords are delivered to new users. |
| `auto_provision` | SAML Auto-Provisioning — creates ZIA user records on first SAML assertion. |
| `directory_sync_migrate_to_scim_enabled` | Disables legacy LDAP/AD sync in favor of SCIM. |
| `password_strength` | For Hosted DB users: `NONE`, `MEDIUM`, or `STRONG`. |
| `password_expiry` | Hosted DB password rotation: `NEVER`, `ONE_MONTH`, `THREE_MONTHS`, `SIX_MONTHS`. |

Per-location additional methods (Tier A: `resource_zia_location_management.go`):

- `basic_auth_enabled` — enable HTTP Basic auth at this location
- `digest_auth_enabled` — enable HTTP Digest auth
- `kerberos_auth` — enable Kerberos at this location

## Step-up authentication and ZIdentity

**Naming note:** Step-up authentication in the current Zscaler product family is branded under **ZIdentity**, Zscaler's unified identity platform. Legacy documentation and some ZIA admin UI screens may still use the phrase "authentication levels" without the ZIdentity branding. Treat them as the same feature.

ZIdentity authentication levels are **hierarchical strength descriptors** (e.g., AL1 → AL4, where higher = stronger). A user authenticated at AL3 satisfies any policy requiring AL3 or below. Levels are configured under Administration > Identity > ZIdentity > Authentication Levels. Each level carries a **validity period** (minutes / hours / days). A parent level's validity must be shorter than any sub-level's validity. Max 32 levels total, max 4 levels of depth. (Tier A: `configuring-authentication-levels.md`.)

Step-up trigger flow (Tier A: `understanding-step-up-authentication-zidentity.md`):

1. User is authenticated at baseline (e.g., username/password → AL1).
2. User attempts access to a resource gated by a higher-level ZIA or ZPA policy.
3. ZIdentity compares the user's current authentication level against the policy requirement.
4. If the current level is insufficient, ZIdentity — via ZCC — prompts the user to re-authenticate with a stronger method (typically MFA).
5. On success, the user's level is raised; access is granted.

**Important constraint:** step-up authentication requires **OIDC-based external IdP integration**. It does not work with Hosted DB or SAML-only tenants that haven't migrated to an OIDC IdP via ZIdentity. (Tier A: both step-up docs state this explicitly.)

The ZIA authentication policy (cookie/surrogate model) and ZIdentity authentication levels operate in layers: ZIA enforces that the user is authenticated at all before any policy rule, then per-resource ZIA or ZPA rules can express a required ZIdentity level, triggering step-up if the user's current level is insufficient.

## Gotchas

1. **Surrogate IP TTL too long → wrong-user attribution.** If `idle_time_in_minutes` is set to, say, 480 minutes (8 hours) and DHCP reassigns that IP within the shift, the next user from that IP inherits the previous user's identity for up to 8 hours. Policy violations, reporting, and DLP incidents all land on the wrong user. Set idle time to match realistic DHCP lease or session durations. (Tier D inference from structural behavior + TF provider enforcement requirement for non-zero idle time.)

2. **Auth-required sublocation behind a NAT device.** If a sublocation requires auth and there are non-browser devices (printers, scanners, servers) behind a NAT that shares an IP with user workstations, those devices cannot authenticate and their traffic either fails or contaminates another user's Surrogate IP binding. Common fix: create a separate sublocation for server/IoT IPs with `auth_required = false`.

3. **Non-browser user agents that can't follow SAML redirects.** Command-line tools, service accounts, and apps using OS-level HTTP stacks typically cannot complete the IdP redirect. Any HTTP request from these agents to an auth-required location returns an HTML redirect page, which the agent treats as an error. The fix is either Kerberos (transparent for domain-joined machines), Surrogate IP (auth done once by a browser on the same IP), or a no-auth sublocation/exemption for those source IPs.

4. **`auto_provision = true` creates ZIA users on first SAML assertion.** With SAML auto-provisioning on, any user whose IdP account is in scope for the ZIA SAML app will have a ZIA user record created at first login. This can cause user-count surprises and may violate license terms if the IdP scoping is wider than intended.

5. **`kerberos_pwd` is read-only.** Setting it in an `update_authentication_settings` call is silently ignored. Kerberos password is set only through the dedicated generate-KerberosPassword API endpoint. Attempts to rotate it via the SDK's `update_authentication_settings` will appear to succeed (the field is accepted in the payload) but won't change the credential. (Tier A: SDK docstring line 240: "Read-only. Can only be set through the generate KerberosPassword API.")

6. **Disabling legacy directory sync is irreversible without support.** Setting `directory_sync_migrate_to_scim_enabled = true` disables the legacy LDAP sync. Rolling it back is not a self-service operation. Confirm SCIM is fully operational before enabling.

## Cross-links

- Location / sublocation auth enforcement toggle: [`./locations.md`](./locations.md)
- URL category references (for auth exemption by category): [`./url-filtering.md`](./url-filtering.md)
- ZIdentity authentication levels and step-up: [`../zidentity/`](../zidentity/)
- Policy evaluation order (where auth gate sits relative to other modules): [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md)
