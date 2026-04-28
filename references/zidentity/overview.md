---
product: zidentity
topic: "zidentity-overview"
title: "ZIdentity overview — unified identity across Zscaler services"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zidentity/what-zidentity"
  - "vendor/zscaler-help/what-zidentity.md"
  - "vendor/zscaler-help/understanding-zidentity-apis.md"
  - "vendor/zscaler-help/understanding-step-up-authentication-zidentity.md"
  - "vendor/zscaler-help/understanding-step-up-authentication.md"
author-status: draft
---

# ZIdentity overview

ZIdentity is Zscaler's unified identity platform. It is the IdP and authorization server layer for the entire Zscaler product suite, centralizing user authentication, MFA, directory management, and entitlement assignment across ZIA, ZPA, ZDX, ZCC, and ZBI. It replaces per-product authentication configurations — ZIA API keys, ZPA separate credentials, per-product SAML setups — with a single tenant that all users and administrators authenticate through.

---

## 1. Role in the platform

### 1.1 ZIdentity as the IdP layer

ZIdentity is the **Identity Provider (IdP) layer** for all Zscaler services. Prior to ZIdentity, each product maintained its own authentication surface: ZIA used API key plus obfuscated timestamp auth, ZPA used separate admin portal credentials, and admin SSO was product-specific. ZIdentity replaces all of this with:

- A single login credential that spans subscribed services (ZIA, ZPA, ZDX, ZCC, ZBI).
- A single admin console authentication surface (Experience Center / unified admin console).
- A unified OAuth 2.0 authorization server for machine-to-machine API access (OneAPI).

ZIdentity is not optional. Even tenants using only a single product (e.g., ZIA only) authenticate through ZIdentity. The product-specific auth paths exist in legacy form for backward compatibility but are superseded.

### 1.2 Relationship to ZIA and ZPA authentication flows

**ZIA** — user traffic authentication (web proxy auth, user identification) continues to use ZIA-configured methods (Surrogate IP, Cookie-based auth, SAML, Kerberos). ZIdentity is the admin authentication layer for ZIA, not the end-user traffic authentication layer. Exception: ZIA URL filtering Conditional Access rules (which trigger step-up) integrate with ZIdentity at the policy enforcement level.

**ZPA** — end-user authentication to ZPA apps goes through the configured IdP (SAML or OIDC), which may be ZIdentity itself or an external IdP federated through ZIdentity. ZPA admin authentication uses ZIdentity. ZPA access policy step-up authentication requires ZIdentity as the OIDC authority (see §5).

**Products that use ZIdentity vs standalone SAML:**

| Authentication path | ZIdentity involved? | Notes |
|---|---|---|
| Admin portal login (all products) | Yes — always | ZIdentity is the admin auth surface |
| OneAPI machine auth (SDK/Terraform) | Yes — always | OAuth 2.0 client credentials through ZIdentity |
| ZPA end-user SAML (legacy IdP) | Indirectly — ZIdentity may federate to external IdP | ZIdentity can act as SP toward enterprise IdP |
| ZIA end-user traffic auth | No — ZIA-native | Surrogate IP, cookie, Kerberos managed inside ZIA |
| Step-up auth (ZIA/ZPA policy) | Yes — required | ZIdentity is the step-up authority; OIDC-only |

### 1.3 Experience Center / unified admin console

The **Experience Center** is Zscaler's unified admin console that spans all Zscaler products. Administrators authenticate to Experience Center through ZIdentity. A single ZIdentity admin credential grants access to every product the admin is entitled to — ZIA, ZPA, ZDX, ZCC — within the same browser session, with RBAC scoping determining which product panels are visible and editable.

Before Experience Center, admins maintained separate login sessions per product. ZIdentity SSO across the console eliminates this; the session token from ZIdentity is presented to each product's backend as proof of authentication.

---

## 2. User directory

### 2.1 Provisioning paths

Three ways to populate the ZIdentity user directory:

1. **Direct creation** — users created manually via the admin portal or via ZIdentity API (`POST /ziam/admin/api/v1/users`). Simplest; no external IdP required.
2. **SAML JIT (just-in-time)** — user record is created the first time the user authenticates via a SAML IdP. Lazy provisioning; users don't exist in ZIdentity until they log in.
3. **SCIM provisioning** — an external IdP pushes user and group changes to ZIdentity proactively. Users, groups, attributes, and deprovisioning events are all kept in sync. Users exist in ZIdentity before first login.

**Trade-offs:** JIT is simpler operationally but means users who have never logged in don't appear in ZPA/ZIA policy dropdowns. SCIM is required for any workflow that needs users pre-provisioned (e.g., pre-assigning ZPA segments to new joiners before their first login day) or that needs reliable deprovisioning.

### 2.2 Cross-product user data propagation

ZIdentity is the **source of truth** for user, group, department, and location data across ZIA, ZPA, ZDX, and ZBI. The other products pull from ZIdentity at regular sync intervals. This means:

- A new user added in ZIdentity will not immediately appear in ZIA/ZPA policy dropdowns — expect minutes-to-hours propagation.
- A user removed from a group in ZIdentity may retain ZPA access until the next sync plus their current session timeout expires.
- Renamed departments may persist in ZIA/ZPA logs under the old name for already-enforced policies until resync.

### 2.3 Migration from legacy admin accounts

Tenants migrating from per-product admin accounts to ZIdentity follow a one-way migration:

1. ZIdentity tenant is provisioned and linked to the Zscaler subscription.
2. Existing per-product admin accounts are mapped or recreated in ZIdentity.
3. The per-product auth paths (ZIA admin portal with separate credentials, ZPA separate login) are deprecated and eventually disabled.

During the migration window, both paths coexist. After migration, all admin access flows through ZIdentity; legacy credentials stop working.

---

## 3. Authentication factors

MFA is **enabled by default**. Tenants can disable it (against Zscaler's recommendation), but audit tooling should flag tenants with MFA disabled as a posture regression.

Supported second factors (Tier A — vendor doc):

| Factor | Notes |
|---|---|
| Password only | Baseline; MFA off |
| Password + SMS OTP | One-time password via SMS |
| Password + email OTP | One-time password via email |
| Password + TOTP | Google Authenticator / compatible TOTP app |
| Password + FIDO | Hardware security keys, platform authenticators (e.g., Touch ID) |

---

## 4. IdP integration

ZIdentity supports two integration protocols for external IdPs:

| Protocol | Step-up auth support | Notes |
|---|---|---|
| **SAML 2.0** | No | Works with any SAML 2.0 compliant IdP (Okta, Entra, ADFS, Ping, etc.) |
| **OIDC** | Yes — required | Modern OAuth-based SSO; prerequisite for step-up authentication |

**Critical constraint (Tier A — vendor doc):** Step-up authentication is OIDC-only. A tenant with a SAML-only IdP integration that configures Conditional Access rules in ZIA URL Filtering or ZPA access policy expecting step-up prompts will see those rules silently fail to escalate. Switching from SAML to OIDC IdP integration is a prerequisite for step-up.

Vendor-specific help exists for: Microsoft Entra ID (Azure AD), Microsoft AD FS, Okta, and generic SAML 2.0/OIDC providers.

---

## 5. Step-up authentication

Step-up authentication allows ZIA or ZPA policy rules to demand a higher authentication assurance level before granting access to a specific resource. It is configured in ZIdentity and enforced by ZIA/ZPA at policy evaluation time.

### 5.1 What it is

Step-up authentication uses **authentication levels (AL1–AL4)** representing increasing authentication strength, where higher levels provide stronger assurance. A user who authenticated at a lower level (e.g., password-only = AL1) may be forced to reauthenticate with MFA (e.g., TOTP = AL2 or FIDO = AL3) when attempting to reach a resource that requires the higher level.

This is distinct from standard MFA at login time. Step-up is **triggered on resource access**, not at login, and only for resources configured to require it.

### 5.2 When it triggers

Step-up triggers when all of the following are true (Tier A — vendor doc):

- The accessing resource (ZIA URL category policy action or ZPA access policy) is configured with a Require Authentication Level condition.
- The user's current authentication level (recorded in their ZIdentity session token) is below the required level.
- The IdP integration is OIDC (not SAML).

Common trigger scenarios:
- **Sensitive resource access** — financial systems, M&A data, privileged admin consoles.
- **Risk signal detection** — unusual device, unrecognized location, behavior anomaly.
- **Regulatory compliance** — resources requiring MFA-backed access to satisfy audit requirements.

### 5.3 Step-up flow

1. User logs in to ZIdentity with standard credentials (e.g., password → AL1).
2. User accesses an application. ZIA or ZPA evaluates access policy.
3. Policy finds a Require Authentication Level condition that the user's current AL does not satisfy.
4. ZIdentity prompts the user to reauthenticate, typically via ZCC or browser redirect, with the required higher factor (e.g., TOTP for AL2, FIDO for AL3).
5. On successful reauthentication, ZIdentity upgrades the session's recorded AL.
6. The access policy re-evaluates and grants access.

### 5.4 How it's configured

Configuration lives in ZIdentity admin portal under Authentication. The operator:

1. Defines authentication levels (AL1–AL4) and maps MFA methods to each level.
2. Configures Authentication Session settings (session duration, when step-up is forgotten).
3. In ZPA access policy or ZIA URL filtering, applies a Conditional Access / Require Authentication Level action to the relevant rule.

The ZPA SDK exposes a read-only surface for step-up auth levels (`client.zpa.stepup_auth_level.get_step_up_auth_levels()`). The level definitions themselves are portal-configured in ZIdentity, not via the ZPA API.

---

## 6. ZIdentity as the OneAPI authorization server

ZIdentity is the **OAuth 2.0 authorization server** for all OneAPI-based API access. The flow:

1. An API client (created in ZIdentity admin portal) is issued a `client_id` and `client_secret` (or private key for JWT auth).
2. The SDK/script exchanges these credentials at `https://<vanity>.zslogin.net/oauth2/v1/token` for a bearer access token.
3. The access token is presented as `Authorization: Bearer <token>` on all OneAPI requests.
4. ZIdentity validates the token and enforces the scopes associated with the API client.

The `ZSCALER_VANITY_DOMAIN` environment variable (used in every SDK call) is the tenant's ZIdentity vanity domain — typically in the form `<tenant>` and resolved to `<tenant>.zslogin.net`.

Government clouds (`zscalergov`, `zscalerten`, ZPA GOV, GOVUS) are not supported on OneAPI; those tenants use legacy per-product auth.

---

## 7. Admin controls

- **IP-based admin access restriction** — limit admin portal access to specific source IP ranges. Tenant-level setting in ZIdentity.
- **Admin role management** — RBAC within ZIdentity for delegating portal access without granting full admin.
- **Audit reports** — configuration-change log; shows what admin changed what setting and when.
- **API Client Access Policy** — controls which API clients are permitted to call which scopes. Enforced by ZIdentity at token issuance.

---

## 8. Edge cases and gotchas

- **Single-service tenant:** even if only ZIA is subscribed, ZIdentity is the auth layer. It cannot be opted out of.
- **SAML + step-up expectation mismatch:** a tenant with a SAML IdP integration that configures Conditional Access rules expecting step-up prompts will see those rules silently not escalate. OIDC is required.
- **Sync lag:** users added via SCIM or ZIdentity API do not immediately propagate to ZIA/ZPA policy. Expect minutes-to-hours propagation delay.
- **SCIM deprovisioning propagation cadence:** whether SCIM deprovisioning propagates immediately to ZIA/ZPA or waits for the next sync is not documented. Treat as sync-cadence-bounded, not instant.
- **MFA "required by default" can be disabled:** tenants with MFA disabled should be flagged as a posture regression in security audits.
- **Legacy auth coexistence during migration:** tenants not yet migrated to ZIdentity still use product-specific auth paths. See [`../zia/api.md`](../zia/api.md) for the legacy ZIA path.

---

## Cross-links

- API surface overview — [`./api.md`](./api.md)
- API client types, scopes, and OneAPI auth flow — [`./sdk.md`](./sdk.md)
- Step-up authentication detail — [`./step-up-authentication.md`](./step-up-authentication.md)
- ZPA step-up auth level SDK object — [`../zpa/sdk.md §2.62 StepUpAuthLevelAPI`](../zpa/sdk.md)
- Cross-product integration hooks — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- ZIA URL Filtering Conditional action — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA Require Approval / Conditional Access — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
