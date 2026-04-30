---
product: shared
topic: "primer-identity"
title: "Primer — identity, SAML, OIDC, and federation"
content-type: primer
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: draft
audience: "non-networking professional who needs to reason about Zscaler"
---

# Primer — identity, SAML, OIDC, and federation

Identity is the keystone of zero-trust. Every Zscaler policy decision starts with "who is this user, and how do I know?" Understanding identity protocols is prerequisite to understanding ZIdentity, step-up auth, ZIA / ZPA SAML configuration, and OneAPI authentication.

## The three actors

Almost every identity flow involves three parties:

| Actor | Role |
|---|---|
| **User** | The human (or process) trying to access something |
| **Identity Provider (IdP)** | Authoritative source of identity. Stores user accounts, validates credentials, issues identity assertions. Examples: Okta, Microsoft Entra ID (Azure AD), Google Workspace, ZIdentity. |
| **Service Provider (SP)** / **Relying Party (RP)** | The application/service the user wants to access. Trusts the IdP to vouch for users; enforces its own authorization on top. Examples: Salesforce, ZIA, ZPA. |

The user authenticates **once** to the IdP. The IdP issues a token / assertion. The user presents that to the SP, which validates it and grants access. **The SP never sees the user's password.**

This is **federation** — the IdP federates identity claims to multiple SPs, decoupling authentication (IdP's job) from authorization (SP's job).

## SAML — the older federation protocol

SAML (Security Assertion Markup Language) is the dominant enterprise SSO protocol. XML-based, dating from the early 2000s.

### How a SAML flow works

```
1. User opens Salesforce → "I'm not logged in"
2. Salesforce redirects browser to Okta (IdP) with a SAMLRequest
3. Okta authenticates user (password + MFA, etc.)
4. Okta generates a signed XML SAMLResponse (the "assertion") and tells the browser to POST it back to Salesforce
5. Salesforce validates the signature, reads the user identity + attributes, logs the user in
```

### Key SAML pieces

- **SAMLRequest** — request from SP to IdP: "please authenticate this user."
- **SAMLResponse** — IdP's reply, including the assertion.
- **Assertion** — XML document containing user identity (subject), attributes (groups, email, employee ID), and the IdP's signature.
- **NameID** — the identifier for the user. Could be email, employee ID, opaque token.
- **Attributes** — extra info the IdP shares (department, role, group memberships).
- **Metadata** — XML doc describing the IdP or SP's endpoints, certificates, supported features. Used to bootstrap a federation between the two.

### SAML signing and trust

- IdP signs the assertion with its private key.
- SP has the IdP's public certificate (from metadata) and verifies the signature.
- Signed assertion + valid signature = "this came from a trusted IdP and wasn't tampered with."

### Where Zscaler uses SAML

- **ZIA admin SSO** — admins authenticate via the org's IdP rather than ZIA's local account.
- **ZPA user authentication** — when a user opens a ZPA-protected app, ZPA initiates a SAML flow to the configured IdP.
- **ZIdentity** can act as either IdP or SP depending on configuration — federate to upstream IdPs (Okta, Entra) and re-issue identity to Zscaler products.
- **SAML attribute mapping** — ZPA Access Policy can match on SAML attributes (e.g., "user's department = Engineering") via the `SAML_ATTRIBUTE` operand type.

## OIDC — the modern variant

OIDC (OpenID Connect) is built on top of OAuth 2.0. JSON-based instead of XML. Cleaner, more browser-friendly.

### How an OIDC flow works

```
1. User opens app → "I'm not logged in"
2. App redirects browser to IdP with an authorization request (includes scopes + redirect URI)
3. IdP authenticates user
4. IdP redirects browser back to app with a one-time code
5. App exchanges code for an ID Token (and optionally an Access Token) at the IdP's token endpoint (server-to-server, with client credentials)
6. App validates the ID Token's signature and reads user claims
```

### Key OIDC pieces

- **ID Token** — a JWT (JSON Web Token) containing user identity claims. Three parts: header, payload (claims), signature.
- **Access Token** — bearer token used to call APIs on behalf of the user. Often opaque.
- **Refresh Token** — long-lived token for getting new access tokens without re-prompting the user.
- **Scopes** — what the app is asking for (`openid`, `profile`, `email`, custom scopes).
- **Claims** — assertions in the ID Token (`sub` = subject, `iss` = issuer, `aud` = audience, `exp` = expiration).
- **JWKS** — JSON Web Key Set — IdP's public keys for verifying tokens. Published at a known URL.

### How OIDC differs from SAML

| | SAML | OIDC |
|---|---|---|
| Format | XML | JSON / JWT |
| Use case | Enterprise SSO to web apps | Mobile, SPA, API auth, modern web |
| Token style | XML assertion | Compact JWT |
| Mobile-friendly | Awkward | Native |
| Adoption | Mature, enterprise-heavy | Newer, growing fast |
| Discovery | Metadata XML | JSON `.well-known/openid-configuration` |

For new integrations, OIDC is preferred. SAML persists for legacy enterprise apps.

### Where Zscaler uses OIDC

- **OneAPI authentication** — Zscaler's API uses OAuth 2.0 client-credentials flow (a non-OIDC OAuth pattern, but same family). API clients get tokens from ZIdentity's `/oauth2/v1/token` endpoint.
- **Step-up authentication** — Zscaler's step-up auth is **OIDC-only** — explicitly called out in `references/zidentity/step-up-authentication.md`. SAML IdPs cannot be used.
- **`acr` (Authentication Context Class Reference)** value — OIDC's mechanism for indicating "this user authenticated at level X." Zscaler maps Authentication Levels to `acr` values for OIDC step-up flows.

## OAuth 2.0 — the authorization framework underneath

OAuth 2.0 isn't strictly authentication — it's authorization. "Let app X access resource Y on behalf of user Z." OIDC is an authentication layer on top of OAuth 2.0 specifically for "let me log in as user Z."

### Flows you'll see

- **Authorization Code** — interactive user login. The dominant browser flow. (Steps 1-5 in the OIDC example above.)
- **Client Credentials** — non-interactive, for server-to-server. App authenticates as itself, not on behalf of a user. Used by Zscaler's OneAPI for automation.
- **Device Code** — for devices without browsers (smart TVs etc.).
- **Implicit** — deprecated. Don't use.
- **Resource Owner Password** — deprecated. Don't use.

### Client credentials specifically

OneAPI uses this. The dance:

```
1. API client has client_id + client_secret (or signed JWT)
2. POST to /oauth2/v1/token with grant_type=client_credentials, client_id, client_secret, audience
3. ZIdentity returns access_token (a JWT) with expires_in seconds
4. Use access_token in Authorization: Bearer <token> on subsequent API calls
5. When token expires, repeat from step 2
```

The `audience` parameter is **REQUIRED** for OneAPI — `audience=https://api.zscaler.com`. Forgetting it causes 401 errors with otherwise-valid credentials. See [`../../shared/oneapi.md`](../../shared/oneapi.md).

## SCIM — provisioning, not authentication

SCIM (System for Cross-domain Identity Management) is **identity provisioning**, distinct from SAML/OIDC authentication.

- SAML / OIDC: "is this person authentic right now?"
- SCIM: "create / update / delete this person's account in your system, so authentication can succeed when they show up."

SCIM is how Okta automatically creates a Salesforce account when a new hire is added in Okta. The IdP is the source of truth; SCIM-aware SPs are kept in sync.

Zscaler's SCIM coverage is in `references/shared/scim-provisioning.md`. ZIA and ZPA both support SCIM, with subtly different attribute schemas.

## MFA / multi-factor authentication

MFA strengthens authentication by requiring **multiple factors**:

| Factor type | Examples |
|---|---|
| **Something you know** | Password, PIN, security questions |
| **Something you have** | Phone (SMS, app push, TOTP), hardware key (YubiKey, FIDO2) |
| **Something you are** | Fingerprint, face recognition, voice |

Multi-factor = at least two of these categories. Two passwords ≠ MFA (both are "know"). Password + phone push = MFA.

### MFA in OIDC vs SAML

- **OIDC** has formal MFA-strength signaling via `acr` claim. The IdP says "this token represents an MFA-authenticated session at level X." Apps can require minimum `acr` levels.
- **SAML** has `AuthenticationContext` element for similar purpose. Less consistently used.

Zscaler's step-up auth requires the OIDC `acr` mechanism — it's why step-up only works with OIDC IdPs.

## Sessions and tokens — the validity model

After authentication, the user gets a session. How long does it last? What revokes it?

### Session lifetimes

- **Access token** — short (typically 1 hour). Bears claims; presented on each request.
- **Refresh token** — longer (days to weeks). Used to mint new access tokens without re-authentication.
- **Session cookie** (web apps) — varies; can be browser-session-only or persistent.
- **SAML assertion** — valid for the time window the IdP set (often minutes); used to bootstrap an SP-side session.

### Revocation

A typical issue: "I disabled this user in Okta. Are their existing tokens still valid?" Usually yes, until the access token expires. Refresh tokens can be revoked at the IdP, which prevents new access tokens from being issued, but the current access token persists for its TTL.

This means: identity revocation is **eventually consistent**, not instant. Zero-trust architectures account for this with short token lifetimes + posture checks at each request.

### Where Zscaler intersects

- **Reauth Timeout** in ZPA Access Policy — bounds how long a user can stay connected before reauthenticating. Forces a fresh SAML/OIDC flow.
- **Step-up auth** triggers re-authentication for sensitive actions; doesn't replace the underlying session.
- **API access tokens** are typically 3600s; client must refresh.
- **Device posture** is re-evaluated periodically (15 min default in ZCC); existing tunnels aren't affected, but new connections see updated posture.

## Where IdP / SP get confused

Some products (including ZIdentity) act as both IdP and SP:

- **As SP**: ZIdentity accepts SAML / OIDC from upstream IdPs (Okta, Entra). Users authenticate at upstream, ZIdentity validates the assertion.
- **As IdP**: ZIdentity issues SAML / OIDC tokens to downstream Zscaler products (ZIA, ZPA, ZCC). Those products accept ZIdentity's assertions.

This makes ZIdentity a **federation hub** — one upstream IdP can serve all of Zscaler without configuring federation per-product.

## Surprises / common confusions

1. **SAML and OIDC are not interchangeable.** Step-up auth requires OIDC. ZIA/ZPA admin SSO works with either. Don't pick one without checking.

2. **"SSO" is ambiguous.** Some say SSO meaning federated SAML/OIDC; some say SSO meaning Kerberos in a Windows domain. Different mechanisms.

3. **OAuth 2.0 ≠ OIDC.** OAuth is the framework; OIDC is an authentication-specific layer. OneAPI uses pure OAuth (client credentials), not OIDC.

4. **The `audience` claim matters.** A valid token for one audience is not valid for another. OneAPI specifically requires `audience=https://api.zscaler.com`. Common debugging trap.

5. **JWTs are not encrypted.** They're signed. Anyone who has a JWT can decode and read its claims (paste into jwt.io). The signature prevents tampering, not reading. Don't put secrets in JWT claims.

6. **MFA bypass via password reset.** Many apps let users reset password via email — and the email account may not have MFA. Single-factor email = single-factor account, regardless of how the app is configured.

7. **Disabled-account propagation lag.** Disabling a user in the IdP doesn't immediately log them out everywhere. Existing sessions continue until they expire or are revoked.

## Cross-links

- ZIdentity overview: [`../../zidentity/overview.md`](../../zidentity/overview.md)
- Step-up authentication: [`../../zidentity/step-up-authentication.md`](../../zidentity/step-up-authentication.md)
- API client (OAuth client credentials): [`../../zidentity/api-clients.md`](../../zidentity/api-clients.md)
- OneAPI gateway and audience parameter: [`../../shared/oneapi.md`](../../shared/oneapi.md)
- SCIM provisioning: [`../../shared/scim-provisioning.md`](../../shared/scim-provisioning.md)
- Zero-trust mental model: [`./zero-trust.md`](./zero-trust.md)
