---
product: zidentity
topic: "zidentity-api-clients"
title: "ZIdentity API Clients — OneAPI OAuth 2.0 authentication"
content-type: reasoning
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/zidentity-about-api-clients.md"
  - "vendor/zscaler-help/understanding-zidentity-apis.md"
author-status: draft
---

# ZIdentity API Clients

The OAuth 2.0 client object that every OneAPI-authenticated script, SDK, Terraform provider, or direct HTTP caller needs. The env vars `ZSCALER_CLIENT_ID` / `ZSCALER_CLIENT_SECRET` (or `ZSCALER_PRIVATE_KEY` for JWT auth) that the skill's scripts require all point at a ZIdentity API Client configured in the admin portal.

## Summary

- **API Clients are OAuth 2.0 client-credentials identities.** An API client authenticates to ZIdentity (the authorization server), receives an access token, and uses the token against the OneAPI gateway.
- **Role-based access control**: each API client is assigned one or more roles that define which endpoints / operations it can access.
- **Scope-limited**: the scopes on the client determine which Zscaler service APIs (ZIA, ZPA, ZDX, etc.) it can reach. A client scoped only to `zia.*` can't call ZPA endpoints.
- **Portal-only creation**: API clients are created in the admin portal (Administration > API Configuration > OneAPI > API Clients). **There is no API to create API clients** — bootstrapping is always a human step. (Tier A — vendor/zscaler-help/zidentity-about-api-clients.md.)

## API client types

ZIdentity API clients are all client-credentials clients for programmatic/machine access. The vendor documentation distinguishes clients by how they authenticate and what they are used for:

| Client type | Authentication credential | Typical use case |
|---|---|---|
| **Confidential (client secret)** | Shared secret (`ZSCALER_CLIENT_SECRET`) | Server-side scripts, CI/CD pipelines, automation that can securely store a secret |
| **Confidential (private key / JWT)** | Private key PEM (`ZSCALER_PRIVATE_KEY`) | Higher-security automation; key stored in HSM or cloud KMS |
| **Service account** | Either credential type | Long-running services (Terraform provider, SDK-based integrations, monitoring agents) with a stable identity |

There is no "public" OAuth 2.0 client type (PKCE/device-code flow) for API clients — those flows are for interactive user authentication. API clients exclusively use the **client credentials grant** (machine-to-machine).

The vendor documentation refers to these as "API clients" without a formal confidential/public split; the practical distinction is secret vs JWT private key auth. Both are confidential clients in OAuth 2.0 terms.

## OAuth 2.0 flows supported

API clients support one OAuth 2.0 grant type: **client credentials (`grant_type=client_credentials`)**. The token exchange:

```
POST https://<vanity>.zslogin.net/oauth2/v1/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=<client_id>
&client_secret=<client_secret>       # OR use JWT assertion
&audience=https://api.zscaler.com    # REQUIRED — see oneapi.md
```

ZIdentity returns a bearer token with `expires_in` field. Read `expires_in` — don't hardcode a TTL assumption. Default is 3600 seconds (tenant-configurable via Authentication Session settings). (Tier A — closed open question from prior version.)

For JWT private key auth, the caller signs a JWT assertion with the private key and presents it as `client_assertion` (RFC 7523 client authentication):

```
grant_type=client_credentials
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=<signed_jwt>
&audience=https://api.zscaler.com
```

The SDK handles the OAuth 2.0 flow internally — callers using `ZscalerClient` don't implement token exchange manually.

## Scope format and available scopes

Scopes determine which Zscaler service APIs the client can reach. The format is service-prefix:operation or service-prefix:* for all operations in a service.

Common scope patterns (Tier D — exact scope strings inferred from SDK config and operator documentation patterns; verify in the admin portal for current list):

| Scope pattern | Access |
|---|---|
| `zia.read` | ZIA read operations |
| `zia.write` | ZIA write operations |
| `zpa.read` | ZPA read operations |
| `zpa.write` | ZPA write operations |
| `zdx.read` | ZDX read operations |
| `zcc.read` | ZCC read operations |

A client with only `zia.*` scopes calling a ZPA endpoint fails at the OneAPI gateway (403, not at ZIdentity token exchange). The token exchange succeeds; the scope check happens when the token is presented to OneAPI.

## API Client fields

Per the admin portal's About API Clients page and SDK documentation, each API client carries:

| Field | Meaning |
|---|---|
| `Name` | Display name for the client. |
| `Client ID` | Unique identifier. Used as `ZSCALER_CLIENT_ID` in SDK/script env. |
| `Status` | `Active` or `Inactive`. Disabling a client stops new token exchanges; existing tokens remain valid until TTL expires. |
| Credential | Either client secret OR private key (JWT auth). Shown once at creation; must be copied immediately. |
| Roles | Which API endpoints and operations the client can access. Role assignments enforced at token-validation time by OneAPI. |
| Scopes | Which Zscaler service APIs the client is authorized to call. |

## Client secret rotation

When an API client is created, the client secret (or private key) is displayed **once** in the admin portal. After navigating away, the secret is not retrievable — admins who don't copy it at creation time must rotate the credential (which invalidates any caller using the old secret). (Tier A — from portal behavior described in vendor docs.)

**Rotation procedure:**
1. Regenerate the credential in the admin portal.
2. The old secret is immediately invalidated for new token requests.
3. Existing tokens issued against the old secret remain valid until their TTL expires (up to 60 minutes).
4. Update every caller (scripts, Terraform state/vars, SDK configs, CI secrets) with the new secret before tokens expire to avoid a service gap.

This is the most common operator pain point. The skill answer for "I forgot the secret, what do I do?" is: regenerate the credential in the portal, then update every caller.

## Access tokens

Tokens carry:

- The API client's identity (via `client_id`)
- The authorized scopes
- The TTL (typically 30-60 minutes, controlled by ZIdentity's Authentication Session config; default 3600 seconds)
- A signature that OneAPI can verify against ZIdentity's public key

**Revocation:** an admin can revoke outstanding tokens if a credential leaks. Revocation takes effect at the next OneAPI call by that token. Relevant help articles: `About Access Tokens`, `Revoking Access Tokens` (referenced in vendor doc related articles list).

## API Client Access Policy

Beyond per-client roles and scopes, there is a separate **API Client Access Policy** that applies tenant-wide rules to all API clients. (Tier A — referenced in vendor/zscaler-help/zidentity-about-api-clients.md related articles.) Typical use: restrict API client access by source IP, time of day, or other environmental factors — analogous to admin IP restriction for human admins but for programmatic access.

## Authentication method: client secret vs JWT private key

Two auth paths:

| Method | Env var | Pros | Cons |
|---|---|---|---|
| **Client secret** | `ZSCALER_CLIENT_SECRET` | Simplest; one string | Secret must be stored somewhere; rotation requires updating every caller |
| **JWT (private key)** | `ZSCALER_PRIVATE_KEY` | Key can live in a hardware security module or cloud KMS; never needs to transit as a shared secret | More complex to set up; caller must sign JWT assertions (SDK handles this automatically) |

**Recommendation for production:** JWT with private key stored in a KMS. Avoid client-secret auth for services that can reach secure key storage.

## SDK representation

The SDK is configured with the API client credentials at the `ZscalerClient` constructor:

```python
from zscaler import ZscalerClient

config = {
    "clientId": "...",              # ZSCALER_CLIENT_ID
    "clientSecret": "...",          # ZSCALER_CLIENT_SECRET (secret auth)
    # OR:
    "privateKey": "...",            # ZSCALER_PRIVATE_KEY (JWT auth)
    "vanityDomain": "acme",         # org vanity domain
    "customerId": "...",            # required for ZPA
    "cloud": "beta",                # optional; omit for production
}

with ZscalerClient(config) as client:
    # SDK handles token exchange internally
    segments, resp, err = client.zpa.application_segment.list_segments()
```

Environment variable equivalents: `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET`, `ZSCALER_PRIVATE_KEY`, `ZSCALER_VANITY_DOMAIN`, `ZSCALER_CLOUD`, `ZPA_CUSTOMER_ID`, `ZPA_MICROTENANT_ID`, `ZSCALER_PARTNER_ID`.

The SDK handles token refresh automatically — callers don't need to manage token expiry.

## Common misconfiguration patterns

**1. Wrong grant type for the use case.**
API clients use `client_credentials` exclusively. If a caller attempts to use `authorization_code` or `implicit` flows with an API client, the token exchange will fail. For user-interactive flows (delegated access), a different credential type (user-facing OIDC application, not an API client) is needed. API clients are machine-to-machine only.

**2. Scope mismatch — token succeeds but API call fails 403.**
A client scoped to `zia.*` calling ZPA APIs will get 403 from OneAPI. The token exchange to ZIdentity succeeds (the token is valid), but the scope check fails at the OneAPI gateway. Symptom: successful `POST /oauth2/v1/token`, then immediate 403 on the first API call. Fix: add the required ZPA scope to the API client in the admin portal.

**3. `audience` parameter missing from token request.**
Tokens issued without `audience=https://api.zscaler.com` succeed at exchange but fail at OneAPI with 401. This is a subtle misconfiguration that looks like an authentication failure but is actually a token-content issue. (Tier A — `references/shared/oneapi.md § The audience parameter is REQUIRED`.)

**4. Disabled client + cached token.**
Disabling a client in the portal doesn't immediately invalidate outstanding tokens. There's a window (up to the token TTL, typically 30-60 minutes) where a disabled client's in-flight token still works. For urgent revocation, use the Revoke Access Tokens flow.

**5. Client secret rotation without updating all callers.**
Rotating the secret in the portal invalidates the old secret immediately for new token requests. Existing tokens (issued against the old secret) remain valid until TTL expires. After rotation, callers using the old secret will fail to get new tokens once their current token expires — often noticed ~1 hour after rotation when current tokens expire. Update all callers before tokens expire to avoid a service gap.

**6. JWT auth clock skew.**
JWTs are signed with a timestamp; clients whose system clock is significantly off can produce JWTs that ZIdentity rejects as invalid. If a freshly-issued JWT is rejected, check system time sync.

**7. Insufficient roles — correct scope, wrong endpoint.**
Roles restrict which specific endpoints/operations are accessible. A client with `zpa.read` scope but no role granting access to `GET /appSegments` will fail at the ZPA API level (not at the token level). Roles and scopes are complementary controls; both must be correct.

**8. Legacy tenants without ZIdentity.**
Legacy tenants (pre-OneAPI migration) cannot use the OAuth 2.0 flow described here. They must use the product-specific legacy auth paths. See [`../zia/api.md § Legacy`](../zia/api.md).

## Relationship to the skill's auth setup

`README.md § Set up ZIA + ZPA credentials` walks through:

1. Create an API client in ZIdentity portal
2. Grant scopes for the Zscaler products the skill's scripts need (ZIA, ZPA read at minimum; ZCC / ZDX read if those scripts are wanted)
3. Copy Client ID + secret (or download private key)
4. Export as env vars: `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` / `ZSCALER_PRIVATE_KEY`, `ZSCALER_VANITY_DOMAIN`, optional `ZSCALER_CLOUD`

The SDKs handle the OAuth 2.0 flow internally — callers don't have to implement the token exchange.

## Cross-links

- **OneAPI gateway, base URLs, rate limits, error model, Postman collection** — [`../shared/oneapi.md`](../shared/oneapi.md). Start there for any cross-product API question; this doc covers the API Client object model only.
- ZIdentity overview — [`./overview.md`](./overview.md)
- ZIdentity API surface (`client.zid.*` in SDK) — [`./api.md`](./api.md)
- ZIA API authentication section (where legacy vs OneAPI paths are compared) — [`../zia/api.md`](../zia/api.md)
- ZPA API authentication — [`../zpa/api.md`](../zpa/api.md)
- Step-Up Authentication (the other major ZIdentity feature) — [`./step-up-authentication.md`](./step-up-authentication.md)
