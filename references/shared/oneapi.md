---
product: shared
topic: "oneapi"
title: "OneAPI — unified API gateway, auth flows, rate limits, error model"
content-type: reasoning
last-verified: "2026-06-21"
verified-against:
  vendor/zscaler-sdk-go: 8a73a5fcf0bbb8507a47c09e9a6f379447ce3807
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/automate-zscaler/getting-started.md"
  - "vendor/zscaler-help/automate-zscaler/guides-rate-limiting.md"
  - "vendor/zscaler-help/automate-zscaler/guides-response-codes.md"
  - "vendor/zscaler-help/automate-zscaler/guides-understanding-oneapi.md"
  - "vendor/zscaler-help/automate-zscaler/api-authentication-overview.md"
  - "vendor/zscaler-help/automate-zscaler/postman-collection-note.md"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json"
  - "vendor/zscaler-help/legacy-api-authentication.md"
  - "vendor/zscaler-help/legacy-getting-started-zia-api.md"
  - "vendor/zscaler-help/legacy-getting-started-zpa-api.md"
  - "vendor/zscaler-help/legacy-managing-cloud-service-api-key.md"
  - "vendor/zscaler-help/legacy-securing-zia-apis-oauth-2.0.md"
  - "vendor/zscaler-help/legacy-understanding-zia-api.md"
  - "vendor/zscaler-help/legacy-understanding-zpa-api.md"
  - "vendor/zscaler-help/legacy-api-rate-limit-summary.md"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/constants.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py"
  - "vendor/zscaler-sdk-python/zscaler/request_executor.py"
  - "vendor/zscaler-sdk-go/zscaler/oneapiclient.go"
  - "vendor/zscaler-sdk-go/zscaler/oneapiconfig.go"
  - "vendor/zscaler-sdk-go/zscaler/errorx/errors.go"
  - "vendor/zscaler-sdk-go/zscaler/zcc/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go"
  - "vendor/terraform-provider-zia/docs/index.md"
  - "vendor/terraform-provider-zpa/docs/index.md"
  - "vendor/terraform-provider-zpa/CHANGELOG.md"
  - "vendor/terraform-provider-zpa/go.mod"
  - "scripts/automate-capture/README.md"
  - "vendor/zscaler-api-specs/automate-zscaler/rosetta.md"
author-status: draft
---

# OneAPI — unified API gateway, auth flows, rate limits, error model

OneAPI is Zscaler's unified API gateway — a single host (`api.zsapi.net`)
fronting multiple product APIs behind a shared authentication and tenant-routing
model, while limits and some error behavior remain product-specific. The
current Postman snapshot includes ZIA, ZPA, ZIdentity/Authentication Service,
ZDX, ZCC, ZTW (Cloud & Branch Connector), BI (Business Insights), EASM, AI Red
Teaming, and AI Infrastructure. Some products (ZDX, ZCC) also retain dedicated legacy auth
flows for non-ZIdentity / government tenants or legacy tooling — see
[§ Authentication mechanisms](#authentication-mechanisms-5-paths-in-the-wild).

This doc consolidates **everything that's true cross-product** — the auth flows, base URL table, rate-limit math per product, error codes, maintenance-mode behavior, and how the Postman collection covers each product. Use this as the entry point for any "how do I authenticate / call / rate-limit / handle errors" question; descend into product-specific `api.md` docs only for endpoint-shape details.

## Public source-of-truth — `automate.zscaler.com`

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/automate-zscaler/postman-collection-note.md`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

Zscaler maintains a public OneAPI documentation hub at `https://automate.zscaler.com/`. **No login wall.** Three top sections:

- `/docs/getting-started/` — auth + onboarding
- `/docs/api-reference-and-guides/` — the API catalog + rate limits + response codes
- `/docs/tools/` — Postman + SDK pointers

We've vendored the relevant captures under `vendor/zscaler-help/automate-zscaler/`.

**No standalone OpenAPI/Swagger spec is published.** Confirmed via thorough sweep — no `/swagger.json`, no `/openapi.yaml`, no downloadable spec link. The API reference data lives inside the Docusaurus JS bundle. This repository now has a best-effort extractor that rebuilds per-product OpenAPI-compatible snapshots from the embedded `frontMatter.api` objects, but those files are reconstructed artifacts, not vendor-published specifications (`scripts/automate-capture/README.md:110-141`; `vendor/zscaler-api-specs/automate-zscaler/rosetta.md:22-31`).

**The Postman collection remains useful, but no longer stands alone as the only machine-readable surface.** Vendored at `vendor/zscaler-api-specs/oneapi-postman-collection.json` (~14 MB, Postman v2.1.0 schema). The reconstructed Automate contracts feed the rosetta reconciliation for ZIA, ZPA, ZCC, and ZTW/Cloud Connector, while Postman is treated as reference-only rather than a constraint-bearing reconciliation leg (`vendor/zscaler-api-specs/automate-zscaler/rosetta.md:22-24`).

## Authentication mechanisms (5 paths in the wild)

Source: `vendor/zscaler-help/automate-zscaler/api-authentication-overview.md`; `vendor/zscaler-help/legacy-api-authentication.md`.

Related references: [`legacy-api.md`](./legacy-api.md), [`../zia/api.md`](../zia/api.md), [`../zpa/api.md`](../zpa/api.md), [`../zcc/api.md`](../zcc/api.md), and [`../zdx/api.md`](../zdx/api.md).

OneAPI is the modern path. **Four legacy paths still exist** because (a) government-cloud support is SDK/provider/version-specific, not uniform across every client surface, (b) some products retain a dedicated legacy auth flow in parallel with OneAPI (ZDX SHA256-signed flow, ZCC legacy path), and (c) plenty of tenants haven't migrated to ZIdentity yet. Operational reality: any code touching multiple Zscaler products today must be prepared to deal with 2–3 different auth flows.

| Mechanism | Used by | Endpoint | Notes |
|---|---|---|---|
| **OneAPI OAuth 2.0** | ZIA, ZPA, ZIdentity, ZCC (OneAPI path), ZTW, BI | Commercial: `https://<vanity>.zslogin.net/oauth2/v1/token`; FedRAMP-capable SDK/provider paths: `https://<vanity>.zidentitygov.net/oauth2/v1/token` or `https://<vanity>.zidentitygov.us/oauth2/v1/token` | Modern path. Client-credentials flow via ZIdentity. Current Go and Python SDKs model `cloud=gov` / `cloud=govus` with dedicated auth and API hosts (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:404-438`; `vendor/zscaler-sdk-python/zscaler/constants.py:17-28`). ZIA Terraform v4.7.25+ and ZPA Terraform v4.4.6+ document FedRAMP OneAPI support via the same lowercase cloud values (`vendor/terraform-provider-zia/docs/index.md:140-149`; `vendor/terraform-provider-zpa/docs/index.md:118-133`). Client/provider routing support does not prove entitlement or ZIdentity API-client configuration for every government tenant. |
| **ZIA legacy** | ZIA (pre-ZIdentity tenants + gov clouds) | `POST https://<cloud>.zscaler.net/api/v1/authenticatedSession` | Username + password + API key + obfuscated timestamp. Algorithm below. |
| **ZPA legacy** | ZPA (pre-ZIdentity tenants and client/provider versions without the required OneAPI environment support) | `POST /signin` (per cloud) | `client_id`, `client_secret`, `customer_id` issued in ZPA Admin Portal. Uppercase `GOV` / `GOVUS` are legacy-client cloud values (`vendor/terraform-provider-zpa/docs/index.md:214-218`). |
| **ZDX legacy** | ZDX (legacy tenants / direct-cloud host path) | `POST https://api.zdxcloud.net/v1/oauth/token` or `POST https://api.zsapi.net/zdx/v1/oauth/token` | SHA256-signed `key+timestamp`. **15-minute timestamp window.** ZDX also supports the OneAPI OAuth 2.0 path (see [`../zdx/api.md § Auth`](../zdx/api.md)). |
| **ZCC legacy** | ZCC (legacy path) | `POST https://api.zsapi.net/zcc/papi/auth/v1/login` | apiKey + secretKey, returns JWT. |

**When you need a legacy path** (any one of these → must use the corresponding legacy auth):
- The selected client/provider does not support the tenant's government cloud. Current Go and Python SDK releases model FedRAMP OneAPI routing for `cloud=gov` / `cloud=govus` (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:404-438`; `vendor/zscaler-sdk-python/zscaler/request_executor.py:176-185`; `vendor/zscaler-sdk-python/zscaler/oneapi_oauth_client.py:495-499`). ZIA Terraform v4.7.25+ and ZPA Terraform v4.4.6+ document the same lowercase OneAPI values (`vendor/terraform-provider-zia/docs/index.md:140-149`; `vendor/terraform-provider-zpa/docs/index.md:118-133`). Earlier provider releases and pre-ZIdentity tenants still need their product-specific legacy paths.
- Tenant hasn't migrated to ZIdentity yet (some enterprises remain on legacy auth indefinitely; the migration is opt-in, not forced).
- The product is ZDX and the tenant or tooling requires the direct SHA256-signed legacy flow (e.g. using `LegacyZDXClient` / `WithZdxLegacyClient`).
- Code is interfacing with an older automation script written before OneAPI shipped.

**Migration consideration:** when a tenant migrates to ZIdentity, the legacy auth keys keep working in parallel for a transition period. Don't assume legacy is "off" just because OneAPI is enabled — both can coexist on the same tenant. This means an audit script must be explicit about which path it's using; running with stale legacy creds against a ZIdentity-enabled tenant works silently and may produce different results than the modern OneAPI flow against the same data.

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

### ZIA legacy — obfuscated timestamp + username/password

The ZIA legacy flow predates OAuth and uses an in-house obfuscation scheme that mixes an **API key** (from the ZIA admin console) with a **timestamp** and an admin **username + password**. The obfuscation algorithm matters because hand-rolling this auth (curl, Postman without the SDK helper) requires implementing it yourself; the SDK abstracts it via `LegacyZIAClient`.

Auth flow:

```http
POST https://<cloud>.zscaler.net/api/v1/authenticatedSession HTTP/1.1
Content-Type: application/json

{
  "apiKey":    "<obfuscated-key>",
  "timestamp": <unix-epoch-ms>,
  "username":  "admin@example.com",
  "password":  "<password>"
}
```

The **`apiKey` field is NOT the raw key** from the admin console — it's an obfuscation derived from the raw key + the current timestamp. Algorithm (per `vendor/zscaler-sdk-python/zscaler/utils.py:obfuscate_api_key`):

```python
def obfuscate_api_key(seed: list):
    # seed is the raw API key as a list of characters
    now = int(time.time() * 1000)              # ms epoch
    n = str(now)[-6:]                          # last 6 digits of timestamp
    r = str(int(n) >> 1).zfill(6)              # n right-shifted by 1, zero-padded to 6
    key = "".join(seed[int(str(n)[i])] for i in range(len(str(n))))   # index seed by digits of n
    for j in range(len(r)):
        key += seed[int(r[j]) + 2]                                    # append more chars indexed by r+2
    return {"timestamp": now, "key": key}
```

Properties:
- The obfuscated key is **per-request** (depends on the timestamp), so caching or replay across timestamps fails.
- The seed (raw API key) must be at least ~20 characters — the algorithm indexes positions up to digit+2.
- The server unwinds the obfuscation server-side using the same algorithm against its stored key.
- `timestamp` and `apiKey` are submitted together; the server validates the obfuscation matches.

Returned: a session cookie (`JSESSIONID`) used on subsequent calls. Sessions expire after the configured timeout — re-auth is required, with a fresh obfuscation each time. The SDK handles this automatically; hand-coded clients must re-obfuscate before each new session.

**Why this matters:** the algorithm is publicly known but not centrally documented in Zscaler's help portal — the SDK source is the canonical reference. Hand-coded clients implementing ZIA legacy auth without referencing the SDK risk obfuscation drift; the SDK's `legacy.py` is the authoritative reference implementation.

### ZPA legacy — Client ID + Client Secret + customer ID

ZPA's pre-ZIdentity auth model. Client ID and Client Secret are issued in the ZPA Admin Portal (under API Keys); the customer ID is the tenant's ZPA customer identifier (numeric, visible in the admin console URL).

Auth flow:

```http
POST https://config.zpacloud.com/signin HTTP/1.1
Content-Type: application/x-www-form-urlencoded

client_id=<id>
&client_secret=<secret>
```

Returns a Bearer token (~1-hour TTL). The customer ID enters subsequent API call paths as `/mgmtconfig/v1/admin/customers/{customerId}/...`.

ZPA legacy is required for:
- Pre-ZIdentity ZPA tenants
- ZPA gov clouds (`GOV`, `GOVUS`) which have not been migrated to OneAPI

The Python SDK `LegacyZPAClient` handles this transparently. Hand-coded clients must POST credentials, capture the bearer token, and inject the customer ID into all paths.

### ZDX legacy — SHA256-signed timestamp

ZDX retains a dedicated legacy SHA256-signed token flow **in addition to** OneAPI (the SDKs route ZDX through ZIdentity OAuth when not using a legacy client — `vendor/zscaler-sdk-go/zscaler/oneapiclient.go:376-377,396-397`). Use this legacy flow on non-ZIdentity / gov tenants or tooling pinned to it. The flow:

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

Source: `vendor/zscaler-help/automate-zscaler/guides-understanding-oneapi.md`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

Related references: [`legacy-api.md`](./legacy-api.md), [`../zia/api.md`](../zia/api.md), [`../zpa/api.md`](../zpa/api.md), [`../zcc/api.md`](../zcc/api.md), and [`../zdx/api.md`](../zdx/api.md).

Single host, per-product paths:

| Product | Base path | Full URL |
|---|---|---|
| ZIA | `/zia/api/v1` | `https://api.zsapi.net/zia/api/v1` |
| ZPA | `/zpa/mgmtconfig/v1`, `v2`, `/zpa/userconfig/v1` | `https://api.zsapi.net/zpa/mgmtconfig/v1` etc. |
| ZDX | `/zdx/v1` | `https://api.zsapi.net/zdx/v1` |
| ZIdentity | `/ziam/admin/api/v1` (Python/Postman); `/admin/api/v1` (Go — different host) | `https://api.zsapi.net/ziam/admin/api/v1` (Python/Postman); `https://{vanity}-admin.zslogin.net/admin/api/v1` (Go SDK) — see [api-divergences](../zidentity/api-divergences.md#base-path-and-host-differ-by-sdk) |
| ZCC | `/zcc/papi/public/v1` | `https://api.zsapi.net/zcc/papi/public/v1` |
| Cloud & Branch Connector | `/ztw/api/v1` | `https://api.zsapi.net/ztw/api/v1` |
| Business Insights | `/bi/api/v1` | `https://api.zsapi.net/bi/api/v1` |
| Zscaler EASM | `/easm/easm-ui/v1` | `https://api.zsapi.net/easm/easm-ui/v1` (`EASMBaseUrl`; `vendor/zscaler-api-specs/oneapi-postman-collection.json:144269-144270`) |
| AI Red Teaming | `/aisecurity/airt` | `https://api.zsapi.net/aisecurity/airt` (`AIRedTeamingBaseUrl`; `vendor/zscaler-api-specs/oneapi-postman-collection.json:144273-144274`) |
| AI Infrastructure | `/aisecurity/aispm` | `https://api.zsapi.net/aisecurity/aispm` (`AIInfrastructureBaseUrl`; `vendor/zscaler-api-specs/oneapi-postman-collection.json:144277-144278`) |
| GraphQL Analytics | (single endpoint) | `https://api.zsapi.net/zins/graphql` |

**Beta endpoint:** `api.beta.zsapi.net` — same path structure, separate environment for early access.

**ZPA `customerId` parameter:** ZPA endpoints under `/mgmtconfig/v1/admin/customers/{customerId}/...` require the customer ID (the ZPA tenant ID). Other products derive tenant from the auth token; ZPA additionally requires it explicitly in the URL.

## Rate limits — different model per product

Source: `vendor/zscaler-help/automate-zscaler/guides-rate-limiting.md`; `vendor/zscaler-help/legacy-api-rate-limit-summary.md`.

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

Headers (OneAPI gateway path, help-documented): `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` (UTC epoch seconds — different naming + different value shape from ZIA). Note: the SDK direct-cloud transport reads `X-Ratelimit-Remaining-Second` / `X-Ratelimit-Limit-Second` instead; the per-host header family is inferred, not live-confirmed — see [`../zdx/api-divergences.md § Rate-limit response headers`](../zdx/api-divergences.md).

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

Source: `vendor/zscaler-help/automate-zscaler/guides-response-codes.md`.

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

Source: `vendor/zscaler-help/automate-zscaler/guides-response-codes.md`.

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

Source: `vendor/zscaler-help/automate-zscaler/guides-understanding-oneapi.md`; `vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json:2-14`.

See also: `references/shared/activation.md`.

Configuration changes for ZIA and CBC are staged behind an activation gate. The explicit activation endpoints are below; ZIA also autoactivates pending changes when an API/admin session ends, so an explicit call is not the only publication trigger (see `references/shared/activation.md`):

- ZIA: `POST /zia/api/v1/status/activate`
- CBC: `PUT /ztw/api/v1/ecAdminActivateStatus/activate`

ZPA, ZDX, ZIdentity, ZCC, and BI **do not have an activation gate** — config changes apply immediately on the underlying write.

**Concurrent edits cause `409 EDIT_LOCK_NOT_AVAILABLE`.** This is the failure mode when:
- Two scripts write at the same time
- A script runs while a human edits via UI
- Two processes hold edit locks against the same tenant

The fix is sequence: take an explicit lock, write, activate, release. Don't run parallel writers against the same ZIA tenant.

## API client best practices

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/automate-zscaler/guides-rate-limiting.md`; `vendor/zscaler-help/automate-zscaler/guides-response-codes.md`.

From the captured *Getting Started > Best Practices*:

- **Adjust token lifetime** in ZIdentity to match your operational needs. Short-lived tokens limit blast radius; long-lived tokens reduce token-refresh chatter.
- **Always fetch before update.** Send a `GET` for the resource before issuing a `PUT/POST`. Most resources have version fields or modification timestamps that the API uses to detect concurrent edits.
- **UTF-8 always.** Every request and response is UTF-8.
- **Activation required.** Stated above; worth repeating because it's the #1 cause of "I made my change and it didn't take effect" debugging on ZIA / CBC.
- **Avoid race conditions.** Don't mix UI edits with running scripts. The `409 EDIT_LOCK_NOT_AVAILABLE` is the symptom; serialize writes to avoid it.

## Postman collection coverage

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/zscaler-help/automate-zscaler/postman-collection-note.md`.

The current vendored Postman snapshot is named **`OneAPI`** and contains nine
top-level product or service folders
(`vendor/zscaler-api-specs/oneapi-postman-collection.json:1-10`, `:9988`,
`:123758`, `:124165`, `:127196`, `:128557`, `:134314`, `:136221`,
`:139453`). The counts below are computed from each top-level folder's direct
`item` children; they are structural folder counts, not endpoint or operation
counts.

| Top-level folder | Direct child folders |
|---|---|
| Zscaler Internet Access (ZIA) | 23 |
| Zscaler Private Access (ZPA) | 36 |
| Zscaler Client Connector | 9 |
| Zscaler Cloud & Branch Connector | 10 |
| Zscaler Digital Experience (ZDX) | 6 |
| Authentication Service | 4 |
| Zscaler Business Insights | 2 |
| Zscaler EASM | 1 |
| AI Security | 2 |

The two AI Security children are distinct surfaces: **AI Red Teaming** exposes
97 request definitions under `/aisecurity/airt/api/v2`, while **AI
Infrastructure** exposes 11 read-only asset and issue requests under
`/aisecurity/aispm/v1` (`vendor/zscaler-api-specs/oneapi-postman-collection.json:139453-143529`).
The Red Teaming entries contain no saved response examples, so the collection
establishes published request coverage but not live response schemas, tenant
entitlement, or endpoint acceptance.

**ZPA now has a reconstructed Automate contract in this repo.** The earlier
2026-04-24 sitemap pass found no ZPA URLs, but the later Docusaurus-blob
capture recovered ZPA operation metadata from automate.zscaler.com's embedded
`frontMatter.api` objects. The current reconstructed snapshot records **188 ZPA
operations across 125 paths with 0 structural validation issues**
(`vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md:7-19`)
and preserves per-operation source URLs and blob hashes
(`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:2-14`). The
Postman collection is still useful as a published collection and historical
coverage cross-check, but it is no longer the only machine-readable ZPA surface
available to this repository.

When answering questions about ZPA endpoint shapes, response payloads, or URI
patterns, prefer the reconstructed Automate contract and rosetta outputs for
the captured snapshot, then cross-check Postman and SDK source when the
question is about publication status or client implementation drift. Preserve
the caveat: these are reconstructed artifacts, not an official static
`openapi.json` published by Zscaler.

## GraphQL Analytics API

Source: `vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

Zscaler ships a GraphQL endpoint at `https://api.zsapi.net/zins/graphql` — beta, covers SaaS Security / Cyber Security / Zero Trust Firewall / IoT / Shadow IT / Web Traffic with strongly-typed schema and introspection. Distinct from REST endpoints; same OneAPI auth.

Useful when REST pagination would be heavy or when a structured cross-domain query is needed. Not yet codified in the skill's product-specific docs — see [`vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md`](../../vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md) for capture details.

## SDK relationship

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-sdk-python/README.md`; `vendor/zscaler-sdk-go/README.md`.

The Python SDK (`vendor/zscaler-sdk-python/`) and Go SDK (`vendor/zscaler-sdk-go/`) handle OneAPI auth internally — callers don't implement the OAuth flow. They consume:

- `ZSCALER_CLIENT_ID`
- `ZSCALER_CLIENT_SECRET` or `ZSCALER_PRIVATE_KEY` (JWT)
- `ZSCALER_VANITY_DOMAIN`
- `ZSCALER_CLOUD` (optional; for non-default clouds)

For the legacy auth path, set `ZSCALER_USE_LEGACY=true` and product-specific env vars (`ZIA_USERNAME`, `ZIA_API_KEY`, etc.). See `README.md § Set up ZIA + ZPA credentials` for the full walkthrough.

### Go SDK v3.8.43 retry and error boundary

At the vendored Go SDK v3.8.43 source pin, the OneAPI, ZCC, ZDX, ZIA,
ZPA, ZTW, and ZWA retry callbacks route 5xx decisions through the shared
`errorx.IsRetryableServerError` helper
(`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:382-405`;
`vendor/zscaler-sdk-go/zscaler/zcc/v2_client.go:206-222`;
`vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:225-240`;
`vendor/zscaler-sdk-go/zscaler/zia/v2_client.go:527-560`;
`vendor/zscaler-sdk-go/zscaler/zpa/v2_client.go:227-283`;
`vendor/zscaler-sdk-go/zscaler/ztw/v2_client.go:492-525`;
`vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:222-237`). This is an SDK
retry heuristic, not a Zscaler backend error taxonomy.

| Input to `IsRetryableServerError` | Helper result |
|---|---|
| Nil response; status below 500; or 501 | Not retryable by this helper (`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:320-327`) |
| 502, 503, or 504 | Always retryable, without classifying the body (`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:290-302,329-334`) |
| Another status at or above 500 whose raw body contains `EDIT_LOCK_NOT_AVAILABLE`, `Resource Access Blocked`, `Failed during enter Org barrier`, or `Request processing failed, possibly because an expected precondition was not met` | Retryable; matching is an exact, case-sensitive substring search (`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:279-288,347-353`) |
| Another status at or above 500 with a well-formed JSON object whose top-level `code` is a nonempty string, and no transient marker above | Not retryable (`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:355-361`) |
| Another status at or above 500 with a nil or empty body, malformed JSON, HTML, JSON without `code`, or a numeric, empty, nested, or array-shaped `code` | Retryable because none yields a top-level nonempty string code (`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:335-364`) |

The OneAPI, ZDX, ZIA, ZPA, ZTW, and ZWA clients install retry-exhaustion
handlers that return the last HTTP response when the retry loop gives up with
a response and no transport error. ZCC installs the same handler only when it
constructs its own HTTP client and `BackoffConf` is present and enabled; a
custom client or disabled/missing backoff configuration bypasses that retry
transport. A missing response or non-nil transport/context error remains an
ordinary error
(`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:211-233`;
`vendor/zscaler-sdk-go/zscaler/zcc/v2_client.go:73-108`;
`vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:118-140`;
`vendor/zscaler-sdk-go/zscaler/zia/v2_client.go:398-420`;
`vendor/zscaler-sdk-go/zscaler/zpa/v2_client.go:125-147`;
`vendor/zscaler-sdk-go/zscaler/ztw/v2_client.go:363-385`;
`vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:107-129`). Their normal
non-success request paths then call `CheckErrorInResponse`
(`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:843-850`;
`vendor/zscaler-sdk-go/zscaler/zcc/v2_client.go:420-432`;
`vendor/zscaler-sdk-go/zscaler/zdx/v2_client.go:477-497`;
`vendor/zscaler-sdk-go/zscaler/zia/v2_client.go:785-799`;
`vendor/zscaler-sdk-go/zscaler/zpa/v2_client.go:584-605`;
`vendor/zscaler-sdk-go/zscaler/ztw/v2_client.go:720-730`;
`vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:495-515`).

`ErrorResponse` retains the HTTP response plus a parsed status, code, message,
ID, reason, and exception, and copies the raw body text into its own `Message`
field (`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:13-28,74-110`). JSON
field extraction runs only when `Content-Type` contains the lowercase literal
`application/json`; `CheckErrorInResponse` reads and closes the original body
without rewinding it, so callers must not assume that body remains readable
(`vendor/zscaler-sdk-go/zscaler/errorx/errors.go:57-67,80-110`). This does not
make every OneAPI failure structured: transport failures, request-timeout
exits, session-retry exhaustion, and very long `Retry-After` exits return other
errors (`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:619-626,633-650,714-718`).

OneAPI also has two retry layers. The default `MaxNumOfRetries` is 10, the
inner `retryablehttp` client uses that value as `RetryMax`, and the outer
request loop is capped by the same value; for a response path that traverses
both layers, the SDK implementation budget can therefore reach 110 HTTP
attempts (ten outer executions, each allowing an initial request plus ten
inner retries), not merely ten
(`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:32-39,160-165,608-617`). This is
a client-side attempt ceiling, not server behavior. The ZPA Terraform provider
v4.4.10 remains pinned to Go SDK v3.8.42, so these v3.8.43 transport details
must not be attributed to that provider
(`vendor/terraform-provider-zpa/CHANGELOG.md:3-8`;
`vendor/terraform-provider-zpa/go.mod:14`).

## Surprises worth flagging

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/automate-zscaler/guides-rate-limiting.md`; `vendor/zscaler-help/automate-zscaler/guides-response-codes.md`.

Note: This section summarizes the cited OneAPI mechanics above.

1. **`audience=https://api.zscaler.com` is REQUIRED** on the OneAPI token request. Tokens issued without it succeed at exchange but fail at the OneAPI gateway with 401. Common debugging trap.

2. **Three coexisting auth flows.** ZDX is OneAPI-capable (both SDKs route it through ZIdentity OAuth), but it also retains a dedicated SHA256-signed legacy flow used on non-ZIdentity / gov tenants. Legacy ZCC similarly coexists with the OneAPI path. A multi-product script that touches ZDX on a non-ZIdentity tenant must implement SHA256(secret:timestamp) auth; on a ZIdentity-configured tenant, the standard OneAPI OAuth flow applies.

3. **Rate-limit response headers differ per product.** Code that polls `x-ratelimit-remaining` for ZIA needs to switch to `RateLimit-Remaining` for ZDX (OneAPI gateway path, help-documented; the SDK direct-cloud transport reads `X-Ratelimit-*-Second` — the per-host mapping is inferred, see [`../zdx/api-divergences.md`](../zdx/api-divergences.md)) and `X-Rate-Limit-Remaining` for ZCC. Same conceptual field, three names.

4. **ZPA has reconstructed Automate contract coverage in this repo, but still no official downloadable OpenAPI.** Treat the generated ZPA snapshot as a captured contract artifact, not as a vendor-published static spec.

5. **No vendor-published OpenAPI / Swagger download.** Confirmed. The Automate site embeds enough per-operation schema data for this repo to reconstruct OpenAPI-compatible snapshots, but they are best-effort derived artifacts with explicit caveats, not an official static `openapi.json` from Zscaler (`scripts/automate-capture/README.md:110-141`).

6. **ZIA + CBC require activation; nothing else does.** A script that activates ZIA changes correctly but never activates CBC changes will silently leave CBC in an inactive-config state.

7. **`409 EDIT_LOCK_NOT_AVAILABLE` is concurrent edits, not auth.** First-time encounters often misdiagnose this as an auth problem. Serialize writers.

8. **Token TTL is tenant-configurable.** Default is typically 3600 seconds but admins can shorten it for security or lengthen it for operational convenience. Don't assume 3600 in code — read `expires_in` from the response.

---

## Legacy Authentication

Source: `vendor/zscaler-help/legacy-api-authentication.md`.

Related references: [`legacy-api.md`](./legacy-api.md), [`../zia/api.md`](../zia/api.md), [`../zpa/api.md`](../zpa/api.md), [`../zcc/api.md`](../zcc/api.md), and [`../zdx/api.md`](../zdx/api.md).

Legacy authentication covers the pre-OneAPI, pre-ZIdentity API auth patterns for ZIA and ZPA. These paths remain in active use for pre-ZIdentity tenants, older client/provider versions, government environments unsupported by the selected client, and code written before OneAPI shipped. ZPA Terraform v4.4.6+ no longer belongs to that legacy-only set: it documents FedRAMP OneAPI with lowercase `gov` / `govus` (`vendor/terraform-provider-zpa/docs/index.md:118-133`).

The table above (§ Authentication mechanisms) summarizes the five auth paths. This section provides operational detail for the two legacy paths most commonly needed: ZIA legacy and ZPA legacy.

### When legacy auth is required

- **Gov clouds**: support is client/version-specific. The vendored Go and Python SDKs model FedRAMP OneAPI routing for `cloud=gov` / `cloud=govus`, with `zidentitygov.net` / `zidentitygov.us` auth domains and `api.zscalergov.net` / `api.zscalergov.us` API gateways (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:404-438`; `vendor/zscaler-sdk-python/zscaler/constants.py:17-28`). ZIA Terraform v4.7.25+ and ZPA Terraform v4.4.6+ also document the lowercase `gov` / `govus` OneAPI path (`vendor/terraform-provider-zia/docs/index.md:140-149`; `vendor/terraform-provider-zpa/docs/index.md:118-133`). ZPA's uppercase `GOV` / `GOVUS` values belong to its legacy-client configuration (`vendor/terraform-provider-zpa/docs/index.md:214-218`). Routing support does not prove tenant entitlement or ZIdentity API-client setup.
- **Pre-ZIdentity tenants**: Enterprises that have not migrated to ZIdentity remain on legacy auth indefinitely — migration is opt-in.
- **ZDX**: OneAPI-capable (the SDKs route ZDX via ZIdentity OAuth), but it also retains a dedicated legacy SHA256-signed token flow used on non-ZIdentity / gov tenants or by tooling pinned to it.
- **Legacy automation code**: Existing scripts targeting the product-specific legacy APIs.

OneAPI and legacy auth can coexist on a ZIdentity-enabled tenant during the migration transition period. Do not assume legacy creds are inactive just because the tenant has ZIdentity enabled.

### ZIA legacy — session-based cookie auth

ZIA's legacy API uses a session cookie (`JSESSIONID`) obtained from `POST /api/v1/authenticatedSession`. The tenant API key is obfuscated with a timestamp before submission; the raw key is never sent on the wire (Tier A — vendor/zscaler-help/legacy-api-authentication.md).

**Session lifecycle:**

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/authenticatedSession` | Create session; returns `JSESSIONID` cookie |
| `GET` | `/api/v1/authenticatedSession` | Check if current session exists and is valid |
| `DELETE` | `/api/v1/authenticatedSession` | End session (logout) |

Request body for `POST`:

```json
{
  "apiKey":    "<obfuscated-key>",
  "username":  "admin@example.com",
  "password":  "<password>",
  "timestamp": "<unix-epoch-ms>"
}
```

The `apiKey` field is **not** the raw key from the ZIA Admin Console — it is derived from the raw key + current timestamp using the obfuscation algorithm documented in the OneAPI auth section above and implemented in `vendor/zscaler-sdk-python/zscaler/utils.py:obfuscate_api_key`. Submitting the raw key here fails with 401.

Successful response returns `JSESSIONID` in a Set-Cookie header and a JSON body:

```json
{
  "authType": "ADMIN_LOGIN",
  "obfuscateApiKey": false,
  "passwordExpiryTime": 0,
  "passwordExpiryDays": 0
}
```

The `JSESSIONID` cookie must be included in all subsequent ZIA legacy API calls. Sessions expire after the configured tenant timeout; each new session requires a fresh obfuscation calculation (the obfuscated key is single-use per timestamp).

**ZIA API key management:** An organization has exactly one cloud service API key. Keys are provisioned by Zscaler, displayed in the ZIA Admin Console at Administration > API Key Management. The key can be regenerated (which invalidates all sessions using the old key) but not rotated without human action. A key disabled by Zscaler (due to over-quota or ToS violation) cannot be re-enabled without contacting Support (Tier A — vendor/zscaler-help/legacy-managing-cloud-service-api-key.md).

**ZIA APIs covered by legacy auth:** The cloud service API exposes the full ZIA feature set programmatically: URL Filtering, SSL Inspection, Firewall Policy, DLP, DNS Control, Location Management, Admin & Role Management, NSS (Cloud Nanolog Streaming), and approximately 40 other feature areas. Availability requires an API subscription (contact Zscaler Support to enable) (Tier A — vendor/zscaler-help/legacy-understanding-zia-api.md).

A separate **Sandbox Submission API** uses a different credential (API token, not API key) and supports up to 100 files/day for behavioral analysis (400 MB max per file). A **3rd-Party App Governance API** uses its own API key issued by Zscaler account team. Neither of these uses `JSESSIONID` (Tier A — vendor/zscaler-help/legacy-getting-started-zia-api.md).

### ZIA legacy — OAuth 2.0 integration (external IdP, not ZIdentity)

ZIA supports a legacy OAuth 2.0 path via **external** identity providers (PingFederate, Okta, Microsoft Entra ID). This is distinct from OneAPI OAuth 2.0 via ZIdentity. Key differences:

- Authorization server is an external provider, not ZIdentity.
- JWT scope claim format: `<Zscaler Cloud Name>::<Org ID>::<API Role>` — distinct from OneAPI's `audience=https://api.zscaler.com`.
- API Roles (not admin roles) are created in the ZIA Admin Console and assigned to client applications via the external OAuth provider.
- API operations authenticated via this path generate an auto-created Admin ID in audit logs: `oauth-<rolename>$@<orgid>.<cloud_domain>`.

This path offers granular access control (API roles scope permissions to specific endpoint categories) and avoids embedding admin credentials in client applications (Tier A — vendor/zscaler-help/legacy-securing-zia-apis-oauth-2.0.md).

Zscaler recommends the OneAPI OAuth 2.0 path (via ZIdentity) for new integrations. The legacy OAuth 2.0 path via external IdP predates ZIdentity and requires the external IdP to be configured separately.

### ZPA legacy — Client ID + Secret + customer ID

ZPA's pre-ZIdentity auth uses client credentials issued in the ZPA Admin Portal (Administration > API Key Management). Only admins with the API Key Management role can create keys (Tier A — vendor/zscaler-help/legacy-getting-started-zpa-api.md).

Auth endpoint and base URL vary by ZPA cloud. The customer ID (numeric ZPA tenant identifier, visible in the admin console URL) is embedded in all subsequent API call paths: `/mgmtconfig/v1/admin/customers/{customerId}/...`.

ZPA legacy returns a Bearer token with approximately 1-hour TTL. Unlike ZIA, there is no session cookie — the token is sent as `Authorization: Bearer <token>` on subsequent calls.

**ZPA legacy APIs covered:** The ZPA API gives programmatic access to the full ZPA feature set: Application Segments, Segment Groups, App Connectors, Access Policies, SAML Attributes, SCIM, LSS, Microtenants, Privileged Remote Access, Posture Profiles, Trusted Networks, Enrollment Certificates, Isolation Profiles, and approximately 40 other feature areas (Tier A — vendor/zscaler-help/legacy-understanding-zpa-api.md).

Note: ZPA's legacy API documentation is not published on help.zscaler.com. The
Postman collection in `vendor/zscaler-api-specs/oneapi-postman-collection.json`
remains the published collection surface; this repo also carries the
reconstructed Automate ZPA contract described above.

### Legacy vs OneAPI — comparison

| Dimension | Legacy ZIA | Legacy ZPA | OneAPI (ZIdentity) |
|---|---|---|---|
| Auth token type | Session cookie (`JSESSIONID`) | Bearer token (~1 hr TTL) | OAuth 2.0 Bearer token |
| Credential type | API key (obfuscated) + username/password | Client ID + Client Secret | Client ID + Client Secret (or JWT) |
| Key source | ZIA Admin Console (one per org) | ZPA Admin Portal (multiple keys) | ZIdentity API client |
| Key management | Manual; single key per org; Support required to re-enable | Multiple keys; managed in ZPA portal | ZIdentity console; supports JWKS URL rotation |
| Scope control | Admin role on the user account | Admin role on the ZPA admin | API scope (`audience` + ZIdentity API client permissions) |
| Gov cloud support | Used by legacy-only clients and pre-ZIdentity tenants | Used by legacy-only clients and pre-ZIdentity tenants; uppercase `GOV` / `GOVUS` select the ZPA legacy clouds | Supported by current Go/Python SDKs, ZIA Terraform v4.7.25+, and ZPA Terraform v4.4.6+ via lowercase `gov` / `govus`; support still depends on the selected client/version and tenant configuration (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:404-438`; `vendor/zscaler-sdk-python/zscaler/constants.py:17-28`; `vendor/terraform-provider-zia/docs/index.md:140-149`; `vendor/terraform-provider-zpa/docs/index.md:118-133,178-182,214-218`) |
| Rate limit model | Weight-based (GET 2/sec 1000/hr, POST/PUT 1/sec 400/hr, DELETE 1/min 4/hr) | Per-IP (20 GET / 10 write per 10 sec) | Same per-product limits apply |
| Activation required | Yes — `POST /status/activate` | No | Yes (ZIA/CBC) / No (ZPA, ZCC, others) |

### ZIA legacy rate limits

The ZIA legacy API uses the same weight-based rate limit model as OneAPI ZIA. Per the rate limit summary (Tier A — vendor/zscaler-help/legacy-api-rate-limit-summary.md):

- **GET (Light)**: 2 req/sec and 1,000 req/hr
- **POST/PUT (Medium)**: 1 req/sec and 400 req/hr
- **DELETE (Heavy)**: 1 req/min and 4 req/hr

The `/authenticatedSession` endpoint itself has GET/POST at 2/sec and 1,000/hr, and DELETE at 2/sec and 1,000/hr. Rate limit headers on ZIA legacy responses: `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`.

A downloadable ZIA Cloud Service Postman collection is available from Zscaler's help portal (not vendored here; see vendor/zscaler-help/legacy-api-rate-limit-summary.md for the download path).

### Migration path to OneAPI

Migration steps at a high level:

1. Enable ZIdentity on the tenant (Zscaler-assisted).
2. Create API clients in ZIdentity with appropriate scopes.
3. Update automation to use `POST <vanity>.zslogin.net/oauth2/v1/token` with `audience=https://api.zscaler.com` and `grant_type=client_credentials`.
4. Replace `JSESSIONID` cookie / Bearer-token patterns with `Authorization: Bearer <oneapi_token>`.
5. Retire legacy API key credentials after confirming OneAPI path is stable.

During transition, both auth paths can coexist on a ZIdentity-enabled tenant. The activation requirement (`POST /status/activate`) is unchanged between legacy and OneAPI for ZIA and CBC.

---

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
