---
product: zidentity
topic: "zidentity-api-clients"
title: "ZIdentity API Clients — OneAPI OAuth 2.0 authentication"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zidentity/about-api-clients"
  - "vendor/zscaler-help/zidentity-about-api-clients.md"
  - "https://help.zscaler.com/zidentity/understanding-zidentity-apis"
  - "vendor/zscaler-help/understanding-zidentity-apis.md"
author-status: draft
---

# ZIdentity API Clients

The OAuth 2.0 client object that every OneAPI-authenticated script, SDK, Terraform provider, or direct HTTP caller needs. The env vars `ZSCALER_CLIENT_ID` / `ZSCALER_CLIENT_SECRET` (or `ZSCALER_PRIVATE_KEY` for JWT auth) that the skill's scripts require all point at a ZIdentity API Client configured in the admin portal.

## Summary

- **API Clients are OAuth 2.0 client-credentials identities.** An API client authenticates to ZIdentity (the authorization server), receives an access token, and uses the token against the OneAPI gateway.
- **Role-based access control**: each API client is assigned one or more roles that define which endpoints / operations it can access.
- **Scope-limited**: the scopes on the client determine which Zscaler service APIs (ZIA, ZPA, ZDX, etc.) it can reach. A client scoped only to `zia.*` can't call ZPA endpoints.
- **Portal-only creation**: API clients are created in the admin portal (Administration > API Configuration > OneAPI > API Clients). **There is no API to create API clients** — bootstrapping is always a human step.

## Mechanics

### OAuth 2.0 client credentials flow

The flow per *About API Clients*:

1. **Admin configures an API client** in the admin portal with:
   - Client name (display only)
   - Authentication credential: **client secret** (shared secret) OR **private key PEM** (JWT-based auth — stronger)
   - One or more **roles** (determines which endpoints it can hit)
   - Scopes (which product services it can access)
2. **API client authenticates** to ZIdentity's token endpoint (`https://<vanity>.zslogin.net/oauth2/v1/token`), presenting its client ID, either secret or signed JWT, and **`audience=https://api.zscaler.com` (REQUIRED — see [`../shared/oneapi.md § The audience parameter is REQUIRED`](../shared/oneapi.md))**.
3. **ZIdentity returns an access token**. Lifetime is tenant-configurable (default 3600 seconds) via Authentication Session settings; read `expires_in` from the response rather than assuming.
4. **Client calls OneAPI** with the access token in `Authorization: Bearer <token>` header.
5. **OneAPI validates the token** against ZIdentity and routes to the appropriate service (ZIA / ZPA / ZDX / ZCC endpoint).

**Failure modes:**

- **401 Unauthorized on API call**: token expired. Refresh via the auth flow.
- **403 Forbidden on specific endpoint**: API client lacks the role or scope for that endpoint. Check client config in portal.
- **Invalid client credentials**: client was deleted, disabled, or secret/key rotated without updating the caller.

### API Client fields

Per the admin portal's *About API Clients* page, each API client carries:

| Field | Meaning |
|---|---|
| `Name` | Display name for the client. |
| `Client ID` | Unique identifier. Used as `ZSCALER_CLIENT_ID` in SDK/script env. |
| `Status` | `Active` or `Inactive`. Disabling a client immediately stops all tokens from working; existing tokens remain valid until their TTL expires. |
| Credential | Either client secret OR private key (JWT auth). Shown once at creation; must be copied immediately. |
| Roles | Which API endpoints and operations the client can access. Role assignments enforced at token-validation time. |
| Scopes | Which Zscaler service APIs the client is authorized to call. A client with only `zia.*` scopes calling a ZPA endpoint fails at the OneAPI gateway. |

### The client-secret-shown-once pattern

When an API client is created, the client secret (or private key) is displayed **once** in the admin portal. After navigating away, the secret is not retrievable — **admins who don't copy it at creation time must rotate the credential (which invalidates any caller using the old secret)**.

This is a common operator pain point. The skill answer for "I forgot the secret, what do I do?" is: regenerate the credential in the portal, update every caller (scripts, Terraform, SDK configs, CI secrets) with the new secret.

### Access tokens

Tokens carry:

- The API client's identity (via `client_id`)
- The authorized scopes
- The TTL (typically 30-60 minutes, controlled by ZIdentity's Authentication Session config)
- A signature that OneAPI can verify against ZIdentity's public key

**Revocation** is supported: an admin can revoke outstanding tokens if a credential leaks. Revocation takes effect at the next OneAPI call by that token (the token is rejected). Relevant help articles: *About Access Tokens*, *Revoking Access Tokens* (not captured).

### API Client Access Policy

Beyond per-client roles and scopes, there's a separate **API Client Access Policy** that applies tenant-wide rules to all API clients. Referenced in the *About the API Client Access Policy* help article (not captured). Typical use: restrict API client access by source IP, time of day, or other environmental factors — analogous to the admin IP restriction for human admins but for programmatic access.

## Authentication method: client secret vs JWT private key

Two auth paths documented:

| Method | Env var | Pros | Cons |
|---|---|---|---|
| **Client secret** | `ZSCALER_CLIENT_SECRET` | Simplest; one string | Secret must be stored somewhere; rotation requires updating every caller |
| **JWT (private key)** | `ZSCALER_PRIVATE_KEY` | Key can live in a hardware security module or cloud KMS; never needs to transit as a shared secret | More complex to set up; caller must sign JWT assertions |

**Recommendation for production**: JWT with private key stored in a KMS. Avoid client-secret auth for services that can reach secure key storage.

## Relationship to the skill's auth setup

`README.md § Set up ZIA + ZPA credentials` walks the fork admin through:

1. Create an API client in ZIdentity portal
2. Grant scopes for the Zscaler products the skill's scripts need (ZIA, ZPA read at minimum; ZCC / ZDX read if those scripts are wanted)
3. Copy Client ID + secret (or download private key)
4. Export as env vars: `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` / `ZSCALER_PRIVATE_KEY`, `ZSCALER_VANITY_DOMAIN`, optional `ZSCALER_CLOUD`

The SDKs handle the OAuth 2.0 flow internally — callers don't have to implement the token exchange.

## Edge cases

- **Disabled client + cached token**: disabling a client in the portal doesn't immediately invalidate outstanding tokens. There's a window (up to the token TTL, typically 30-60 minutes) where a disabled client's in-flight token still works. For urgent revocation, use the Revoke Access Tokens flow.
- **Client with insufficient scopes**: calls to out-of-scope endpoints fail at OneAPI, not at ZIdentity. Token exchange succeeds; API call returns 403. Debugging: check the error response body for which scope was missing.
- **Client secret rotation**: rotating the secret in the portal invalidates the old secret immediately for new token requests. Existing tokens (issued against the old secret) remain valid until TTL expires.
- **JWT auth clock skew**: JWTs are signed with a timestamp; clients whose system clock is significantly off can produce JWTs that ZIdentity rejects as invalid. If a freshly-issued JWT is rejected, check system time sync.
- **Legacy tenants without ZIdentity**: can't use the OneAPI OAuth flow. They must use the product-specific legacy auth paths. See [`../zia/api.md § Legacy`](../zia/api.md).

## Open questions

- Whether JWT auth supports key rotation with multiple valid keys during a rollover window.
- Rate limits on the token endpoint — not documented anywhere we've captured (but per-product rate limits are documented in [`../shared/oneapi.md § Rate limits`](../shared/oneapi.md)).

**Closed (2026-04-24 via automate.zscaler.com captures):**
- Token TTL — tenant-configurable via Authentication Session settings; default 3600 seconds; carried in `expires_in` field of the token response.
- `audience` parameter — REQUIRED, value `https://api.zscaler.com`. Tokens issued without it succeed at exchange but fail at OneAPI with 401.

## Cross-links

- **OneAPI gateway, base URLs, rate limits, error model, Postman collection** — [`../shared/oneapi.md`](../shared/oneapi.md). Start there for any cross-product API question; this doc covers the API Client object model only.
- Overview — [`./overview.md`](./overview.md)
- ZIdentity API surface (`client.zid.*` in SDK) — [`./api.md`](./api.md)
- ZIA API authentication section (where legacy vs OneAPI paths are compared) — [`../zia/api.md`](../zia/api.md)
- ZPA API authentication — [`../zpa/api.md`](../zpa/api.md)
- Step-Up Authentication (the other major ZIdentity feature) — [`./step-up-authentication.md`](./step-up-authentication.md)
