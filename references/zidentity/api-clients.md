---
product: zidentity
topic: "zidentity-api-clients"
title: "ZIdentity API Clients — OneAPI OAuth 2.0 authentication"
content-type: reasoning
last-verified: "2026-06-15"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/zidentity-about-api-clients.md"
  - "vendor/zscaler-help/understanding-zidentity-apis.md"
  - "vendor/zscaler-sdk-python/zscaler/zid/api_client.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py"
  - "vendor/zscaler-sdk-go/zscaler/oneapiclient.go"
author-status: draft
---

# ZIdentity API Clients

The OAuth 2.0 client object that every OneAPI-authenticated script, SDK, Terraform provider, or direct HTTP caller needs. The env vars `ZSCALER_CLIENT_ID` / `ZSCALER_CLIENT_SECRET` (or `ZSCALER_PRIVATE_KEY` for JWT auth) that the skill's scripts require all point at a ZIdentity API Client configured in the admin portal.

## Summary

- **API Clients are OAuth 2.0 client-credentials identities.** An API client authenticates to ZIdentity (the authorization server), receives an access token, and uses the token against the OneAPI gateway.
- **Role-based access control**: each API client is assigned one or more roles that define which endpoints / operations it can access.
- **Scope-limited**: the scopes on the client determine which Zscaler service APIs (ZIA, ZPA, ZDX, etc.) it can reach. A client scoped only to `zia.*` can't call ZPA endpoints.
- **Bootstrapping the FIRST client is a human step; thereafter API clients are CRUD-able via API.** The very first API client is created in the admin portal (Administration > API Configuration > OneAPI > API Clients) because there is no token yet to authenticate with — the chicken-and-egg bootstrap. Once you hold a client with ZIdentity-admin scope, API clients are fully managed programmatically: the Python SDK exposes `add_api_client` (POST), `update_api_client` (PUT), `delete_api_client` (DELETE), plus the secret lifecycle `add_api_client_secret` / `get_api_client_secret` / `delete_api_client_secret`, all against `/ziam/admin/api/v1/api-clients` (vendor/zscaler-sdk-python/zscaler/zid/api_client.py:31,156,265,355,436). The Go SDK has no `api_client` service — this surface is Python-SDK-only (see [`./api.md § 4.1`](./api.md)). Portal create/edit/delete remains available too (Tier A — vendor/zscaler-help/zidentity-about-api-clients.md).

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
&audience=https://api.zscaler.com    # required — see audience note below
```

> **`audience` is injected automatically for SDK callers.** Both SDKs hardcode `audience=https://api.zscaler.com` on every token exchange (secret and JWT): Python at vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:298 (secret) and :375/:389 (JWT), Go at vendor/zscaler-sdk-go/zscaler/oneapiclient.go:260 (secret) and :321/:335 (JWT). So "forgot the audience" can only happen to a hand-rolled raw-HTTP caller — SDK, Terraform, and MCP users never hit it (this is misconfig #3 below).

ZIdentity returns a bearer token with an `expires_in` field. Read `expires_in` — don't hardcode a TTL assumption. The SDK falls back to 3600 seconds if the field is absent (vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:461); the actual TTL is tenant-configurable via Authentication Session settings. (Tier A — closed open question from prior version.)

For JWT private key auth, the caller signs a JWT assertion with the private key and presents it as `client_assertion` (RFC 7523 client authentication):

```
grant_type=client_credentials
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=<signed_jwt>
&audience=https://api.zscaler.com
```

### JWT assertion mechanics

When you authenticate with a private key, the SDK builds and signs the client assertion for you. The concrete behavior (identical in both SDKs):

- **Algorithm**: RS256 (vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:381; vendor/zscaler-sdk-go/zscaler/oneapiclient.go:318).
- **Assertion lifetime**: `exp = now + 600` — a 10-minute assertion window (vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:376; vendor/zscaler-sdk-go/zscaler/oneapiclient.go:322). This 10-minute window is the actual clock-skew tolerance budget (see misconfig #6).
- **Claims**: `iss` and `sub` are both the `client_id`; `aud` is `https://api.zscaler.com` (vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:373-375).
- **Minimum key strength**: the Python SDK rejects RSA keys below 2048 bits, raising `ValueError` before any network call — `MIN_RSA_KEY_SIZE = 2048`, validated in `validate_rsa_key_strength` (vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:24,43-51; addresses CWE-326). The Go SDK does not enforce a minimum key size.
- **`privateKey` accepts three forms**: a raw PEM string (`BEGIN PRIVATE KEY`), a JWK JSON string (starts with `{`), or a filesystem path to a PEM file (vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:344-365).

The SDK handles the OAuth 2.0 flow internally — callers using `ZscalerClient` don't implement token exchange manually.

## Scope format and available scopes

Each scope a client holds is expressed as a long structured string that encodes the target product, its cloud, an org/customer ID, and a role. The general shape is `zs:config:<product-cloud>:<org-id>:config:<role-id>:<role-name>`, but the live SDK `add_api_client` example shows the format varies per product (vendor/zscaler-sdk-python/zscaler/zid/api_client.py:204-228):

| Product | Example scope string |
|---|---|
| ZIA | `zs:config:zia.zscalerbeta.net:8061240:config:33860:ZIA_API_Role01` |
| ZCC | `zs:config:zcc.zscalerbeta.net:8061240:config:1:Super Admin` |
| Cloud Connector | `zs:config:cloud_connector.zscalerbeta.net:8061240:config:18350:Super Admin` |
| ZDX | `zs:config:zdx.zscalerbeta.net:8061240:config:18347:ZDX Super Admin` |
| **ZIdentity (self)** | `zs:config:ziam:0:config:9h6p7ebv903k4:Super Admin` |
| ZPA | `zs:config:zpa.zpabeta.net:72058304855015424:config:Default:Default:28:FullAccess` |

Two things to note from the live example (vendor/zscaler-sdk-python/zscaler/zid/api_client.py:204-228):

- **The ZIdentity-self scope** uses the literal product token `ziam` and org-id `0` (not a cloud hostname and not a numeric org ID). This is the concrete answer to "how do I scope a client to call the ZIdentity admin API itself" — give it a `ziam:0:config:<role>:<role-name>` scope alongside (or instead of) its product scopes (cross-link [`./api.md § 2.1`](./api.md)).
- **ZPA carries an extra segment** (`...:config:Default:Default:28:FullAccess`) and a 17-digit customer ID (`72058304855015424`, `vendor/zscaler-sdk-python/zscaler/zid/api_client.py:227`), unlike the other products' shapes.
- **Scope IDs come in two colon shapes.** Each selected scope has an `id` field that is either `resourceId::scopeId` (double colon, e.g. `hhlm44raf07ps::hpopqi71j075n`) or `resourceId:subId:scopeId` (single colons, e.g. `hhlm44rae07ib:mplm44rqi07jb:hplm44rqvg7n5`) — both appear in the same example (vendor/zscaler-sdk-python/zscaler/zid/api_client.py:206 vs :226).

A client whose scopes cover only one product (say ZIA) calling another product's endpoint (ZPA) fails at the OneAPI gateway (403, not at ZIdentity token exchange). The token exchange succeeds; the scope check happens when the token is presented to OneAPI.

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

The skill answer for "I forgot the secret, what do I do?" is: regenerate the credential in the portal, then update every caller. (As of current SDK source, the portal does not let you re-display a secret after navigating away; programmatic rotation via `add_api_client_secret` is available given an admin-scoped bootstrap client — vendor/zscaler-sdk-python/zscaler/zid/api_client.py:436.)

## Access tokens

Tokens carry:

- The API client's identity (via `client_id`)
- The authorized scopes
- The TTL (typically 30-60 minutes, controlled by ZIdentity's Authentication Session config; default 3600 seconds)
- A signature that OneAPI can verify against ZIdentity's public key

**Revocation:** an admin can revoke outstanding tokens if a credential leaks. Revocation takes effect at the next OneAPI call by that token. The supporting help articles `About Access Tokens` and `Revoking Access Tokens` are referenced in the vendor doc's related-articles list but are NOT captured in `vendor/zscaler-help/`, so the revocation timing is an uncaptured-reference claim — see Open questions.

## API Client Access Policy

Beyond per-client roles and scopes, there is a separate **API Client Access Policy** that applies tenant-wide rules to all API clients. (Referenced in vendor/zscaler-help/zidentity-about-api-clients.md related articles; the dedicated policy help page is NOT captured in `vendor/zscaler-help/` — see Open questions.) Use: restrict API client access by source IP, time of day, or other environmental factors — analogous to admin IP restriction for human admins but for programmatic access.

## Authentication method: client secret vs JWT private key

Two auth paths:

| Method | Env var | Pros | Cons |
|---|---|---|---|
| **Client secret** | `ZSCALER_CLIENT_SECRET` | Simplest; one string | Secret must be stored somewhere; rotation requires updating every caller |
| **JWT (private key)** | `ZSCALER_PRIVATE_KEY` | Key can live in a hardware security module or cloud KMS; never needs to transit as a shared secret | More complex to set up; caller must sign JWT assertions (SDK handles this automatically) |

**Recommendation for production:** JWT with private key stored in a KMS. Avoid client-secret auth for services that can reach secure key storage. The Python SDK enforces a 2048-bit RSA minimum and signs RS256 assertions with a 10-minute lifetime — see [JWT assertion mechanics](#jwt-assertion-mechanics) above.

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

**3. `audience` parameter missing from token request (raw-HTTP callers only).**
Tokens issued without `audience=https://api.zscaler.com` succeed at exchange but fail at OneAPI with 401. This is a subtle misconfiguration that looks like an authentication failure but is actually a token-content issue. **This can only happen to a hand-rolled raw-HTTP caller** — both SDKs hardcode the audience on every token exchange (vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:298; vendor/zscaler-sdk-go/zscaler/oneapiclient.go:260), so SDK, Terraform, and MCP users never hit this. (Tier A — `references/shared/oneapi.md § The audience parameter is REQUIRED`.)

**4. Disabled client + cached token.**
Disabling a client in the portal doesn't immediately invalidate outstanding tokens. There's a window (up to the token TTL, typically 30-60 minutes) where a disabled client's in-flight token still works. For urgent revocation, use the Revoke Access Tokens flow.

**5. Client secret rotation without updating all callers.**
Rotating the secret in the portal invalidates the old secret immediately for new token requests. Existing tokens (issued against the old secret) remain valid until TTL expires. After rotation, callers using the old secret will fail to get new tokens once their current token expires — often noticed ~1 hour after rotation when current tokens expire. Update all callers before tokens expire to avoid a service gap.

**6. JWT auth clock skew.**
The SDK signs each client assertion with `exp = now + 600`, a 10-minute window (vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:376; vendor/zscaler-sdk-go/zscaler/oneapiclient.go:322). That 10 minutes is the entire tolerance budget: if the caller's clock is more than ~10 minutes fast, the assertion can arrive already-expired and ZIdentity rejects it. If a freshly-issued JWT is rejected, check system time sync.

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

## Open questions

- **Revocation timing and the Access-Tokens help pages.** The `About Access Tokens` and `Revoking Access Tokens` articles are named in the related-articles list of vendor/zscaler-help/zidentity-about-api-clients.md but are not captured in `vendor/zscaler-help/`. The "revocation takes effect at the next OneAPI call" timing and the post-revocation propagation window are therefore unverified against source — capture those pages or confirm against tenant behavior. — see [clarification `zid-33`](../_meta/clarifications.md#zid-33-about-revoking-access-tokens-articles-uncaptured)
- **API Client Access Policy details.** The policy's existence is referenced in the captured API-clients help page, but the dedicated policy page is uncaptured. The specific knobs (source-IP / time-of-day / other conditions) are inferred by analogy to admin IP restriction, not read from source. — see [clarification `zid-34`](../_meta/clarifications.md#zid-34-api-client-access-policy-article-uncaptured)
- **Token revocation via SDK.** The Python SDK exposes API-client and secret CRUD (vendor/zscaler-sdk-python/zscaler/zid/api_client.py:156-530) but no token-revocation endpoint. Whether outstanding access tokens can be revoked via API (vs portal-only) is unconfirmed in SDK source. — see [clarification `zid-12`](../_meta/clarifications.md#zid-12-token-revocation-via-sdk-api)
- **`access_token_life_time` semantics.** `add_api_client` accepts `access_token_life_time` (example value `86400` = 24h, vendor/zscaler-sdk-python/zscaler/zid/api_client.py:195) and the docstring labels it as the active flag, which contradicts the field name. Whether this is a per-client token-TTL override (and how it interacts with the tenant Authentication Session default) is unresolved from source. — see [clarification `zid-11`](../_meta/clarifications.md#zid-11-access_token_life_time-field-semantics)

## Cross-links

- **OneAPI gateway, base URLs, rate limits, error model, Postman collection** — [`../shared/oneapi.md`](../shared/oneapi.md). Start there for any cross-product API question; this doc covers the API Client object model only.
- ZIdentity overview — [`./overview.md`](./overview.md)
- ZIdentity API surface (`client.zid.*` in SDK) — [`./api.md`](./api.md)
- ZIA API authentication section (where legacy vs OneAPI paths are compared) — [`../zia/api.md`](../zia/api.md)
- ZPA API authentication — [`../zpa/api.md`](../zpa/api.md)
- Step-Up Authentication (the other major ZIdentity feature) — [`./step-up-authentication.md`](./step-up-authentication.md)
