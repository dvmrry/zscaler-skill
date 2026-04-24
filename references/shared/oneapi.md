---
product: shared
topic: "oneapi"
title: "OneAPI — unified API gateway, auth flows, rate limits, error model"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "vendor/zscaler-help/automate-zscaler/getting-started.md"
  - "vendor/zscaler-help/automate-zscaler/guides-rate-limiting.md"
  - "vendor/zscaler-help/automate-zscaler/guides-response-codes.md"
  - "vendor/zscaler-help/automate-zscaler/guides-understanding-oneapi.md"
  - "vendor/zscaler-help/automate-zscaler/api-authentication-overview.md"
  - "vendor/zscaler-help/automate-zscaler/postman-collection-note.md"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# OneAPI — unified API gateway, auth flows, rate limits, error model

OneAPI is Zscaler's unified API gateway — a single host (`api.zsapi.net`) fronting every product API with consistent authentication, rate limiting, error semantics, and tenant routing. It's distinct from product-specific legacy APIs (ZDX has its own auth path, ZCC has its own login endpoint) but is the modern path for ZIA, ZPA, ZIdentity, ZCC, ZTW (Cloud & Branch Connector), and BI (Business Insights).

This doc consolidates **everything that's true cross-product** — the auth flows, base URL table, rate-limit math per product, error codes, maintenance-mode behavior, and how the Postman collection covers each product. Use this as the entry point for any "how do I authenticate / call / rate-limit / handle errors" question; descend into product-specific `api.md` docs only for endpoint-shape details.

## Public source-of-truth — `automate.zscaler.com`

Zscaler maintains a public OneAPI documentation hub at `https://automate.zscaler.com/`. **No login wall.** Three top sections:

- `/docs/getting-started/` — auth + onboarding
- `/docs/api-reference-and-guides/` — the API catalog + rate limits + response codes
- `/docs/tools/` — Postman + SDK pointers

We've vendored the relevant captures under `vendor/zscaler-help/automate-zscaler/`.

**No standalone OpenAPI/Swagger spec is published.** Confirmed via thorough sweep — no `/swagger.json`, no `/openapi.yaml`, no downloadable spec link. The API reference data lives inside the Docusaurus JS bundle and isn't extractable as a standard spec. Zscaler's chatbot was correct to be ambiguous.

**The Postman collection is the closest thing to a machine-readable API surface.** Vendored at `vendor/zscaler-api-specs/oneapi-postman-collection.json` (~14 MB, Postman v2.1.0 schema). 7 product folders covering every OneAPI surface — including the only ZPA documentation Zscaler publishes (web docs are absent for ZPA on automate.zscaler.com).

## Three authentication mechanisms

| Mechanism | Used by | Token endpoint | Notes |
|---|---|---|---|
| **OneAPI OAuth 2.0** | ZIA, ZPA, ZIdentity, ZCC (OneAPI path), ZTW, BI | `https://<vanity>.zslogin.net/oauth2/v1/token` | Modern path. Client-credentials flow via ZIdentity. |
| **ZDX legacy** | ZDX only | `POST https://api.zsapi.net/zdx/v1/oauth/token` | SHA256-signed `key+timestamp`. **15-minute timestamp window.** |
| **ZCC legacy** | ZCC (legacy path) | `POST https://api.zsapi.net/zcc/papi/auth/v1/login` | apiKey + secretKey, returns JWT. |

A multi-product workflow that touches ZDX or legacy ZCC must handle multiple auth flows. OneAPI alone can't be assumed — there's no unified token across all three.

### OneAPI OAuth 2.0 — the audience parameter is REQUIRED

The token request body **must** include `audience: https://api.zscaler.com`. Forgetting it is a common cause of "my OAuth flow returns 401 even though my creds are right" debugging — the token request succeeds but the issued token isn't valid for OneAPI without the audience claim.

```http
POST /oauth2/v1/token HTTP/1.1
Host: <vanity-domain>.zslogin.net
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=<Client ID>
&client_secret=<Client Secret>
&audience=https://api.zscaler.com
```

Successful response (lifetime is tenant-configurable, default 3600 seconds):

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6Ikp...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Use the token as `Authorization: Bearer <access_token>` on every subsequent OneAPI call.

### OneAPI OAuth 2.0 — JWT (private key) auth

Production deployments should prefer JWT auth over client secret. The flow is the same except the request body uses a `client_assertion` instead of `client_secret`:

```http
POST /oauth2/v1/token HTTP/1.1
Host: <vanity-domain>.zslogin.net
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=<Client ID>
&client_assertion=<jwt>
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&audience=https://api.zscaler.com
```

The JWT is signed with the client's private key:

```
header   = base64url_encode({ "alg": "RS256", "typ": "JWT" })
payload  = base64url_encode({
             "iss": client_id,
             "sub": client_id,
             "aud": "https://api.zscaler.com",
             "exp": now() + 600   // 10-minute window
           })
unsigned = header + "." + payload
sig      = sign_with_private_key(unsigned, "RS256")
jwt      = unsigned + "." + base64url_encode(sig)
```

Two JWT-key registration paths: **JWKS URL** (ZIdentity fetches public key from a URL — best for production, no manual rotation) and **uploaded certificate / public key** (.pem upload — best for compliance/regulatory tenants requiring static keys).

### ZDX legacy — SHA256-signed timestamp

ZDX has not migrated to OneAPI auth (as of capture date 2026-04-24). The flow:

```http
POST https://api.zsapi.net/zdx/v1/oauth/token HTTP/1.1
Content-Type: application/json

{
  "key_id": "<api-key-id>",
  "key_secret": "SHA256(<secret_key>:<timestamp>)",
  "timestamp": <unix-epoch-seconds>
}
```

Constraints:
- `key_secret` is the SHA256 hex of `<secret_key>:<timestamp>` (literal colon-concatenation).
- Requests sent more than **15 minutes** after the timestamp are rejected.
- Token TTL: 3600 seconds.

### ZCC legacy

```http
POST https://api.zsapi.net/zcc/papi/auth/v1/login HTTP/1.1
Content-Type: application/json

{ "apiKey": "<key>", "secretKey": "<secret>" }
```

Returns:

```json
{ "jwtToken": "...", "message": "..." }
```

The returned JWT is used as a bearer token on subsequent ZCC API calls.

## Per-product base URLs

Single host, per-product paths:

| Product | Base path | Full URL |
|---|---|---|
| ZIA | `/zia/api/v1` | `https://api.zsapi.net/zia/api/v1` |
| ZPA | `/zpa/mgmtconfig/v1`, `v2`, `/zpa/userconfig/v1` | `https://api.zsapi.net/zpa/mgmtconfig/v1` etc. |
| ZDX | `/zdx/v1` | `https://api.zsapi.net/zdx/v1` |
| ZIdentity | `/ziam/admin/api/v1` | `https://api.zsapi.net/ziam/admin/api/v1` |
| ZCC | `/zcc/papi/public/v1` | `https://api.zsapi.net/zcc/papi/public/v1` |
| Cloud & Branch Connector | `/ztw/api/v1` | `https://api.zsapi.net/ztw/api/v1` |
| Business Insights | `/bi/api/v1` | `https://api.zsapi.net/bi/api/v1` |
| GraphQL Analytics | (single endpoint) | `https://api.zsapi.net/zins/graphql` |

**Beta endpoint:** `api.beta.zsapi.net` — same path structure, separate environment for early access.

**ZPA `customerId` parameter:** ZPA endpoints under `/mgmtconfig/v1/admin/customers/{customerId}/...` require the customer ID (the ZPA tenant ID). Other products derive tenant from the auth token; ZPA additionally requires it explicitly in the URL.

## Rate limits — different model per product

Rate limits are NOT unified across products. Each product has its own model, response-header naming, and failure-payload shape. Plan multi-product automation accordingly.

### ZIA — weight-based

Every endpoint is assigned a weight, with both a lower-bound (burst) and upper-bound (sustained) limit:

| Weight | Verbs | Per-second | Per-minute | Per-hour |
|---|---|---|---|---|
| Heavy | DELETE | — | 1 | 4 |
| Medium | POST, PUT | 1 | — | 400 |
| Light | GET | 2 | — | 1,000 |

Headers on every response: `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset` (seconds remaining in window).

### ZPA — per-IP

20 GET / 10 write operations per 10-second window, per source IP. HTTP 429 carries a `retry-after` header (seconds).

```json
{
  "content-type": "application/json",
  "date": "Wed, 6 Mar 2024 11:38 GMT",
  "retry-after": "13s"
}
```

### ZDX — tier-based by license count

| Tier | Licenses | /sec | /min | /hour | /day |
|---|---|---|---|---|---|
| 1 | 5,000 | 5 | 30 | 1,000 | 10,000 |
| 2 | 20,000 | 5 | 60 | 3,000 | 15,000 |
| 3 | 100,000 | 5 | 120 | 6,000 | 30,000 |
| 4 | >100,000 | 5 | 180 | 9,000 | 60,000 |

Headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` (UTC epoch seconds — different naming + different value shape from ZIA).

### ZCC — flat tenant-wide

100 API calls per hour at the tenant level, with **special download endpoints capped at 3 per day**:
- `/downloadDevices`
- `/downloadServiceStatus`
- `/downloadDisableReasons`

Headers: `X-Rate-Limit-Remaining`, `X-Rate-Limit-Retry-After-Seconds`.

### Cloud & Branch Connector — same as ZIA weight model

Same Heavy/Medium/Light table as ZIA. 429 body carries `Retry-After: 0 seconds` style:

```json
{ "message": "Rate Limit (1/SECOND) exceeded", "Retry-After": "0 seconds" }
```

### Business Insights

| Tier | /sec | /hour | Applies to |
|---|---|---|---|
| Heavy | 1 | 400 | Custom Applications CRUD, Report Configurations CRUD |
| Light | 2 | 1,000 | Reports list / download |

### Best practices for any product

- Implement exponential backoff on 429.
- Monitor usage via the response headers proactively.
- Batch operations where supported.
- Cache results where safe.
- Insert sleep/wait between calls in scripts.

## OneAPI HTTP status codes

| Code | Meaning |
|---|---|
| 401 | Auth token invalid, expired, or missing |
| 403 | API client lacks access to the resource (or read-only mode — see below) |
| 404 | Resource not found |
| 408 | Client took too long sending the request |
| 413 | Request body exceeds maximum size |
| 429 | Rate limit / quota exceeded |
| 500 | Internal server error |
| 503 | Resource temporarily unavailable |
| 504 | Server response timeout |

Specific products may add their own codes — see product-specific `api.md` files.

## Read-only mode (ZIA scheduled maintenance)

During scheduled maintenance, ZIA returns:

```http
HTTP/1.1 403
x-zscaler-mode: read-only

{
  "code": "STATE_READONLY",
  "message": "The API service is undergoing a scheduled upgrade and is in read-only mode."
}
```

Both the `x-zscaler-mode` header and the `STATE_READONLY` code are reliable discriminators — distinguish maintenance-window 403 from permissions 403. Scripts should treat `x-zscaler-mode: read-only` as transient and retry with backoff, but treat plain 403 (no header) as an authorization issue requiring config fix.

## Activation gate (ZIA + Cloud & Branch Connector only)

Configuration changes for ZIA and CBC do not take effect until **explicitly activated**. The relevant endpoints:

- ZIA: `POST /zia/api/v1/status/activate`
- CBC: `POST /ztw/api/v1/ecAdminActivateStatus/activate`

ZPA, ZDX, ZIdentity, ZCC, and BI **do not have an activation gate** — config changes apply immediately on the underlying write.

**Concurrent edits cause `409 EDIT_LOCK_NOT_AVAILABLE`.** This is the failure mode when:
- Two scripts write at the same time
- A script runs while a human edits via UI
- Two processes hold edit locks against the same tenant

The fix is sequence: take an explicit lock, write, activate, release. Don't run parallel writers against the same ZIA tenant.

## API client best practices

From the captured *Getting Started > Best Practices*:

- **Adjust token lifetime** in ZIdentity to match your operational needs. Short-lived tokens limit blast radius; long-lived tokens reduce token-refresh chatter.
- **Always fetch before update.** Send a `GET` for the resource before issuing a `PUT/POST`. Most resources have version fields or modification timestamps that the API uses to detect concurrent edits.
- **UTF-8 always.** Every request and response is UTF-8.
- **Activation required.** Stated above; worth repeating because it's the #1 cause of "I made my change and it didn't take effect" debugging on ZIA / CBC.
- **Avoid race conditions.** Don't mix UI edits with running scripts. The `409 EDIT_LOCK_NOT_AVAILABLE` is the symptom; serialize writes to avoid it.

## Postman collection coverage

The vendored Postman collection (`vendor/zscaler-api-specs/oneapi-postman-collection.json`) covers all 7 OneAPI products:

| Product | Folder count |
|---|---|
| Zscaler Internet Access (ZIA) | 23 |
| Zscaler Private Access (ZPA) | 36 |
| Zscaler Client Connector | 9 |
| Zscaler Cloud & Branch Connector | 10 |
| Zscaler Digital Experience (ZDX) | 6 |
| ZIdentity | 4 |
| Zscaler Business Insights | 2 |

**ZPA's web-published docs are absent** from automate.zscaler.com — sitemap returns 0 ZPA URLs as of 2026-04-24. The Postman collection is the **only machine-readable ZPA reference** Zscaler publishes. Categories include: Application / Policy Set / Microtenant / PRA Approval / PRA Console / PRA Portal / Service Edge / SCIM / LSS / Connector / Server Group / Customer / IdP / SAML Attribute / Provisioning Key / Trusted Network / Inspection Profile / Isolation Profile / Posture Profile (full list in `vendor/zscaler-help/automate-zscaler/postman-collection-note.md`).

When answering questions about ZPA endpoint shapes, response payloads, or URI patterns, the Postman collection is the authoritative source — not help.zscaler.com (which has no ZPA reference) and not the SDK source (which lags new endpoints).

The collection is named "OneAPI Copy 3" internally — Zscaler naming artifact, ignore.

## GraphQL Analytics API

Zscaler ships a GraphQL endpoint at `https://api.zsapi.net/zins/graphql` — beta, covers SaaS Security / Cyber Security / Zero Trust Firewall / IoT / Shadow IT / Web Traffic with strongly-typed schema and introspection. Distinct from REST endpoints; same OneAPI auth.

Useful when REST pagination would be heavy or when a structured cross-domain query is needed. Not yet codified in the skill's product-specific docs — see [`vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md`](../../vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md) for capture details.

## SDK relationship

The Python SDK (`vendor/zscaler-sdk-python/`) and Go SDK (`vendor/zscaler-sdk-go/`) handle OneAPI auth internally — callers don't implement the OAuth flow. They consume:

- `ZSCALER_CLIENT_ID`
- `ZSCALER_CLIENT_SECRET` or `ZSCALER_PRIVATE_KEY` (JWT)
- `ZSCALER_VANITY_DOMAIN`
- `ZSCALER_CLOUD` (optional; for non-default clouds)

For the legacy auth path, set `ZSCALER_USE_LEGACY=true` and product-specific env vars (`ZIA_USERNAME`, `ZIA_API_KEY`, etc.). See `README.md § Set up ZIA + ZPA credentials` for the full walkthrough.

## Surprises worth flagging

1. **`audience=https://api.zscaler.com` is REQUIRED** on the OneAPI token request. Tokens issued without it succeed at exchange but fail at the OneAPI gateway with 401. Common debugging trap.

2. **Three coexisting auth flows.** ZDX and legacy ZCC do not use OneAPI OAuth. A multi-product script that touches ZDX must implement SHA256(secret:timestamp) auth alongside the OneAPI flow.

3. **Rate-limit response headers differ per product.** Code that polls `x-ratelimit-remaining` for ZIA needs to switch to `RateLimit-Remaining` for ZDX and `X-Rate-Limit-Remaining` for ZCC. Same conceptual field, three names.

4. **ZPA web reference docs don't exist** at automate.zscaler.com — Postman is the only published API surface. This is a staged rollout per Zscaler; check periodically for ZPA web pages.

5. **No public OpenAPI / Swagger spec.** Confirmed. The Postman collection is the closest equivalent. Tooling that wants OpenAPI must either reverse-engineer from Postman or wait for Zscaler to publish.

6. **ZIA + CBC require activation; nothing else does.** A script that activates ZIA changes correctly but never activates CBC changes will silently leave CBC in an inactive-config state.

7. **`409 EDIT_LOCK_NOT_AVAILABLE` is concurrent edits, not auth.** First-time encounters often misdiagnose this as an auth problem. Serialize writers.

8. **Token TTL is tenant-configurable.** Default is typically 3600 seconds but admins can shorten it for security or lengthen it for operational convenience. Don't assume 3600 in code — read `expires_in` from the response.

## Cross-links

- ZIdentity API Client object model: [`../zidentity/api-clients.md`](../zidentity/api-clients.md).
- ZIA-specific API: [`../zia/api.md`](../zia/api.md).
- ZPA-specific API: [`../zpa/api.md`](../zpa/api.md).
- ZCC-specific API: [`../zcc/api.md`](../zcc/api.md).
- ZDX-specific API: [`../zdx/api.md`](../zdx/api.md).
- ZIdentity API: [`../zidentity/api.md`](../zidentity/api.md).
- Cloud Connector / CBC API: [`../cloud-connector/api.md`](../cloud-connector/api.md).
- ZWA API: [`../zwa/api.md`](../zwa/api.md).
- Activation lifecycle deep-dive: [`./activation.md`](./activation.md).
- Admin RBAC + API Clients vs admin users: [`./admin-rbac.md`](./admin-rbac.md).
