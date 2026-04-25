---
product: zidentity
topic: "zidentity-overview"
title: "ZIdentity overview — unified identity across Zscaler services"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zidentity/what-zidentity"
  - "vendor/zscaler-help/what-zidentity.md"
author-status: draft
---

# ZIdentity overview

Zscaler's unified identity service. Centralizes user authentication, directory management, and entitlement assignment across ZIA, ZPA, ZDX, ZCC, and ZBI. Replaces per-product auth configs (ZIA API keys, ZPA separate credentials) with a single ZIdentity tenant that everyone logs into.

## Summary

- **Single sign-on across subscribed Zscaler services.** One login credential; all subscribed services (ZIA, ZPA, ZDX, ZCC, etc.) accessible without separate passwords.
- **Multi-factor authentication required by default.** MFA is enabled out of the box; Zscaler recommends keeping it on. Supported second factors: password + SMS OTP / email OTP / TOTP (Google Authenticator) / FIDO.
- **User directory options**: manage users directly in ZIdentity, or sync from an external IdP via **SAML JIT (just-in-time)** or **SCIM**.
- **Admin access controls**: source-IP restriction, admin role management, audit reports for config changes.
- **IdP integration**: SAML (legacy) or OIDC (for step-up auth support). OIDC integrations unlock the [Step-Up Authentication](./step-up-authentication.md) feature; SAML integrations do not.

## Mechanics

### User provisioning paths

From *What Is ZIdentity?*:

> You can use the ZIdentity service to enroll users to your subscribed Zscaler services using the ZIdentity user database. This mitigates the time-consuming effort of creating a separate user database in each Zscaler service to provision users.

Three ways to populate the user directory:

1. **Direct creation in ZIdentity** — create users manually via admin portal or via ZIdentity API (`POST /users`). Simplest; no external IdP needed.
2. **SAML just-in-time (JIT) provisioning** — user record is created when a user first authenticates via the SAML IdP. Lazy; no user exists until they log in.
3. **SCIM provisioning** — external IdP pushes user/group changes to ZIdentity proactively. Users exist in ZIdentity before first login; groups, attributes, and deprovisioning are all kept in sync.

**Operational trade-off**: JIT is simpler but users you've never-login-tested aren't in the directory, so you can't pre-configure per-user ZIA/ZPA policy before they authenticate. SCIM is more robust for large-org onboarding and termination workflows.

### Authentication factors

Per *What Is ZIdentity?*:

- Password
- Password + **SMS one-time password (OTP)**
- Password + **email OTP**
- Password + **TOTP** (Google Authenticator / equivalent)
- Password + **FIDO** (hardware security keys, platform authenticators)

**MFA is on by default.** A tenant explicitly has to disable MFA (against Zscaler's recommendation) to allow password-only auth. The per-MFA-method configuration pages ("Configuring MFA Types") are operational and not captured here.

### Identity provider (IdP) integration

ZIdentity supports two IdP integration protocols:

| Protocol | Use case | Step-up auth support |
|---|---|---|
| **SAML** | Traditional enterprise SSO; works with any SAML 2.0 IdP | **No** |
| **OIDC** | Modern OAuth-based SSO | **Yes** — required for step-up |

**Critical constraint**: step-up authentication (see [`./step-up-authentication.md`](./step-up-authentication.md)) is **OIDC-only**. If the tenant uses a SAML-only IdP integration and any ZIA or ZPA rule depends on Conditional Access / Require Approval, those rules silently won't escalate. Migrating from SAML to OIDC is a prerequisite for step-up.

**Vendor-specific help articles exist for**:

- Microsoft Entra ID (Azure AD)
- Microsoft AD FS
- Okta
- Other SAML 2.0 / OIDC providers

Not captured in detail here — each has its own Zscaler help article with step-by-step config.

### Admin controls

- **IP-based admin access restriction**: limit admin portal access to specific source IPs. Tenant-level setting.
- **Admin role management**: RBAC within ZIdentity for delegating portal access without handing over full admin.
- **Audit reports**: configuration-change log. Shows what admin changed what setting, when.

### Relationship to OneAPI

**ZIdentity is the authorization server for OneAPI**. API clients authenticate to ZIdentity via OAuth 2.0 client credentials flow; ZIdentity issues access tokens that the OneAPI gateway validates. See [`./api-clients.md`](./api-clients.md) for the flow and the API client object model.

The env var `ZSCALER_VANITY_DOMAIN` (used in every script and SDK call) points at the tenant's ZIdentity instance — typically in the form `<vanity>.zslogin.net` or similar.

### Cross-product user / group / department / location sync

ZIdentity is the **source of truth** for user, group, department, and location data across ZIA, ZPA, ZDX, ZBI. The other products pull from ZIdentity at regular sync intervals (not real-time). Implications:

- **New user added in ZIdentity**: won't immediately appear in ZIA/ZPA policy dropdowns — expect minutes-to-hours propagation.
- **User removed from a group in ZIdentity**: existing ZPA sessions may retain access until the next sync + their session timeout.
- **Renamed department**: old department name may persist in ZIA/ZPA logs for already-enforced policies until resync.

This is the pattern referenced in [`../zdx/overview.md`](../zdx/overview.md) where ZDX pulls users/departments/locations from the ZTE. The sync is ZIdentity-outbound to each product, not the reverse.

## Edge cases

- **Single-service tenant**: even if you only use ZIA (no ZPA/ZDX/etc.), ZIdentity is still the auth layer — you can't opt out.
- **Tenant on a single cloud for multiple organizations**: ZIdentity supports multi-org-single-login patterns; one user credential can access multiple orgs they're entitled to.
- **MFA "required by default" can be turned off**: tenants can disable MFA. Audit-finding: tenants with MFA disabled should be flagged as a security posture regression.
- **SAML IdP + step-up auth expectation**: a tenant that sets up Conditional Access rules in ZIA URL Filter expecting step-up prompts, but has a SAML-only IdP integration, will see rules that never produce the expected prompt. Switching the IdP integration to OIDC is required.
- **Legacy auth coexistence**: tenants not yet migrated to ZIdentity still use the product-specific auth paths (ZIA API keys + obfuscated timestamps, ZPA separate credentials). See [`../zia/api.md § Authentication`](../zia/api.md) for the legacy path, which is still supported but superseded.

## Open questions

- Exact sync cadence for user/group data from ZIdentity to other products — not documented.
- Whether SCIM deprovisioning propagates immediately to other products or waits for the next sync.
- Where the per-tenant MFA-required default can be disabled (admin portal path not captured).

## Cross-links

- API Clients (the OneAPI authentication surface) — [`./api-clients.md`](./api-clients.md)
- Step-Up Authentication (Conditional Access mechanics) — [`./step-up-authentication.md`](./step-up-authentication.md)
- API surface — [`./api.md`](./api.md)
- Cross-product integration hooks — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- ZIA URL Filtering Conditional action — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA Require Approval action — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
