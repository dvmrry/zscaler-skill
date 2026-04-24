---
product: zidentity
topic: "zidentity-index"
title: "ZIdentity reference hub"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: draft
---

# ZIdentity reference hub

Entry point for Zscaler's unified identity service — the authentication, user-directory, entitlement, and step-up-auth layer that underpins ZIA, ZPA, ZDX, ZCC, and ZBI. Previously the auth surface was per-product (ZIA API keys + obfuscated timestamps, ZPA separate credentials); ZIdentity consolidates it.

## Why ZIdentity matters to the other products

Every other product in this skill has a hook into ZIdentity:

- **OneAPI authentication** — the OAuth 2.0 flow used by all current SDKs routes through ZIdentity. `ZSCALER_VANITY_DOMAIN` points at a ZIdentity tenant.
- **Step-up authentication** — ZIA URL Filter's `Conditional` action and ZPA Access Policy's `Require Approval` action both delegate MFA/step-up challenges to ZIdentity.
- **User directory** — ZIA and ZPA pull users, groups, departments, locations from ZIdentity (or sync them via SAML JIT / SCIM).
- **Authentication levels** (AL1-AL4+) — policy hooks in ZIA/ZPA reference ZIdentity-configured authentication levels to gate sensitive resources.

Questions that land here: "how do I create API client credentials?", "why is step-up not prompting?", "what does authentication level AL2 mean?", "SAML vs OIDC — which do I need?", "is MFA required?"

## Topics

| Topic | File | Status |
|---|---|---|
| Overview — what ZIdentity is, MFA defaults, SAML JIT vs SCIM provisioning, admin access controls | [`./overview.md`](./overview.md) | draft |
| API Clients — OneAPI OAuth 2.0 flow, API client creation, roles and scopes, access tokens, revocation | [`./api-clients.md`](./api-clients.md) | draft |
| Step-Up Authentication — Authentication Levels (hierarchical tree, 32 max, depth 4), ZIA/ZPA integration via access policies, OIDC-only constraint, validity inversion gotcha | [`./step-up-authentication.md`](./step-up-authentication.md) | draft |
| API surface — `client.zid.*` methods, Python vs Go SDK parity, wire format | [`./api.md`](./api.md) | draft |

## What this hub does NOT cover yet

- **Identity provider integration specifics** (Microsoft Entra ID, AD FS, Okta, Ping, etc.) — each has its own help article. Referenced but not captured.
- **MFA method configuration** (SMS OTP, email OTP, TOTP via Google Authenticator, FIDO) — feature-enumeration level is in `overview.md`; per-method config is deferred.
- **Device token authentication** — ZCC-specific auth flow.
- **Admin role management** (RBAC within ZIdentity itself) — separate from user authentication.
- **Audit logs for ZIdentity configuration changes** — tracked; deferred.
- **Migration from legacy auth** — the "Migrating Zscaler Service Admins to ZIdentity" flow is operational, not reasoning-focused.

## When the question spans ZIdentity + another product

- **"Why didn't the Conditional Access prompt appear?"** — ZCC forwarding is required for step-up to work (GRE/IPSec users don't get it). See [`../shared/cross-product-integrations.md § ZIdentity`](../shared/cross-product-integrations.md) and [`./step-up-authentication.md`](./step-up-authentication.md).
- **"API call failed with 401"** — check OneAPI token expiry; tokens are OAuth 2.0 and have limited lifetimes. [`./api-clients.md`](./api-clients.md).
- **"Users aren't syncing from our IdP"** — SAML JIT requires a login event to create the user; SCIM pushes in advance. Different lifecycle. [`./overview.md`](./overview.md).
- **"How do I decide between OIDC and SAML for our IdP?"** — OIDC supports step-up auth; SAML does not. If you need Conditional Access or Require Approval actions anywhere in ZIA/ZPA policy, you need an OIDC IdP integration.
