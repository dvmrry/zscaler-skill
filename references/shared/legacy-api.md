---
product: shared
topic: "legacy-api"
title: "Legacy Zscaler APIs — auth, session management, rate limits, and error codes"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/legacy-api-authentication.md"
  - "vendor/zscaler-help/legacy-getting-started-zia-api.md"
  - "vendor/zscaler-help/legacy-getting-started-zpa-api.md"
  - "vendor/zscaler-help/legacy-getting-started-zdx-api.md"
  - "vendor/zscaler-help/legacy-getting-started-client-connector-api.md"
  - "vendor/zscaler-help/legacy-getting-started-cloud-branch-connector-api.md"
  - "vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md"
  - "vendor/zscaler-help/legacy-understanding-zia-api.md"
  - "vendor/zscaler-help/legacy-understanding-zpa-api.md"
  - "vendor/zscaler-help/legacy-understanding-zscaler-client-connector-api.md"
  - "vendor/zscaler-help/legacy-api-rate-limit-summary.md"
  - "vendor/zscaler-help/legacy-api-response-codes-and-error-messages.md"
  - "vendor/zscaler-help/legacy-understanding-rate-limiting.md"
  - "vendor/zscaler-help/legacy-activation.md"
  - "vendor/zscaler-help/legacy-api-authentication-zdx.md"
  - "vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md"
  - "vendor/zscaler-help/legacy-securing-zia-apis-oauth-2.0.md"
  - "vendor/zscaler-help/legacy-authentication-settings.md"
  - "vendor/zscaler-help/legacy-apis-home.md"
author-status: draft
---

# Legacy Zscaler APIs — auth, session management, rate limits, and error codes

Reference for the pre-OneAPI ("legacy") Zscaler API layer. Legacy APIs are being replaced by OneAPI but remain active for tenants not yet migrated to ZIdentity, gov clouds, and several products that have not yet published OneAPI endpoints. The help portal hosts them at `help.zscaler.com/legacy-apis`.

**Migration note**: Zscaler is progressively migrating documentation to `automate.zscaler.com`. New integrations should use OneAPI where available. See [`./oneapi.md`](./oneapi.md).

---

## Auth model by product

Each product uses a different legacy auth model. These are not interchangeable.

| Product | Auth mechanism | Token/session type |
|---|---|---|
| **ZIA Cloud Service API** | API key + username + password + obfuscated timestamp | `JSESSIONID` cookie |
| **ZIA (OAuth 2.0 variant)** | Client Credentials via external IdP (PingFederate, Okta, Entra ID) | JWT Bearer token |
| **ZIA Sandbox Submission** | API token (separate from API key) | Per-request header |
| **ZIA 3rd-Party App Governance** | API key only | Per-request header, no session |
| **ZPA** | Client ID + Client Secret + Customer ID | Session |
| **ZDX** | `key_id` + `key_secret` | JWT Bearer token (3600s) |
| **ZCC** | API key | Session |
| **Cloud & Branch Connector (CBC)** | API key | Session |
| **Workflow Automation** | `key_id` + `key_secret` | Bearer token |

---

## ZIA legacy auth — API key + session cookie

### Auth flow

1. Retrieve base URL: `https://<cloud>.zscaler.net/api/v1` (cloud name per tenant — e.g., `zscaler.net`, `zscalerone.net`, `zscalertwo.net`).
2. Obfuscate the API key against the current Unix timestamp (see below).
3. POST `/authenticatedSession` with credentials → receive `JSESSIONID` cookie.
4. Include `JSESSIONID` in all subsequent requests.
5. After write operations, POST `/status/activate` to push changes live.
6. DELETE `/authenticatedSession` to end session.

### `POST /authenticatedSession` — create session

Request body:

```json
{
  "apiKey": "<obfuscated_api_key>",
  "username": "admin@example.com",
  "password": "admin_password",
  "timestamp": "1678886400000"
}
```

- `timestamp`: Unix epoch in **milliseconds** as a string.
- `apiKey`: The raw API key is **not** sent as-is — it must be obfuscated against the timestamp (see obfuscation below).

Response: `200 OK` with body:

```json
{
  "authType": "ADMIN_LOGIN",
  "obfuscateApiKey": false,
  "passwordExpiryTime": 0,
  "passwordExpiryDays": 0
}
```

The `JSESSIONID` cookie is returned in the response headers. Include it in all subsequent requests:

```
Cookie: JSESSIONID=<value>
```

**SessionInfo model**:

| Field | Type | Description |
|---|---|---|
| `authType` | string | Login type. Enum: `ADMIN_LOGIN` (+ 8 others). Read-only. |
| `obfuscateApiKey` | boolean | Whether the API key was obfuscated. Default `false`. Read-only. |
| `passwordExpiryTime` | integer/$int64 | Password expiry timestamp. Read-only. |
| `passwordExpiryDays` | integer/$int32 | Days until password expires. Read-only. |

### `GET /authenticatedSession` — check session

Returns `200` with `SessionInfo` if a session exists. If `authType` is absent in the response body, the session has expired or does not exist.

### `DELETE /authenticatedSession` — end session

No body. Returns `200` with `ActivationStatus` object: `{"status": "ACTIVE"}`.

### API key obfuscation

The ZIA legacy API key must be obfuscated before use. The obfuscation algorithm scrambles the raw API key using the timestamp to prevent replay attacks. The SDK handles this automatically via `LegacyZIAClient`. For direct HTTP callers:

- The algorithm is not published in the vendor docs captured here.
- The Python SDK implementation is at `vendor/zscaler-sdk-python/zscaler/legacy.py`.
- The Go SDK implementation is at `vendor/zscaler-sdk-go/zscaler/legacy.go`.

Use the SDK rather than reimplementing the algorithm.

---

## ZIA legacy auth — OAuth 2.0 (external IdP variant)

This is **distinct from OneAPI OAuth 2.0**. It uses an external IdP (PingFederate, Okta, or Microsoft Entra ID) — **not ZIdentity**. It is an older integration path for organizations that have an external OAuth infrastructure but have not migrated to OneAPI.

### Flow

1. Register a client application with the external IdP.
2. Configure API Roles in the ZIA Admin Portal (`Policy > API Roles`). API Roles are separate from admin roles — they are associated with client applications, not admin users.
3. Configure an OAuth 2.0 Authorization Server in ZIA (`Administration > OAuth 2.0 Authorization Servers`).
4. Client requests access token from the external IdP using Client Credentials grant type.
5. External IdP returns a signed JWT.
6. Client sends the JWT in the `Authorization: Bearer <token>` header on ZIA API requests.
7. ZIA validates the JWT signature using the external IdP's public key, then validates the scope claim.

### JWT scope format

```
<Zscaler Cloud Name>::<Org ID>::<API Role>
```

Example: `zscaler.net::12345::read-only-api-role`

This is **different** from OneAPI's audience (`https://api.zscaler.com`). ZIA validates the scope claim against the API Roles configured in the admin console.

### Audit log identity

API calls authenticated via OAuth 2.0 are attributed to an auto-generated Admin ID in the format:

```
oauth-<rolename>$@<orgid>.<cloud_domain>
```

### Supported IdPs

PingFederate, Okta, and Microsoft Entra ID. ZIdentity is **not** used for this flow — this is the legacy external-IdP OAuth integration.

---

## ZIA activation — required after write operations

ZIA configuration changes do not take effect until explicitly activated. This applies to all write operations (POST, PUT, DELETE) against most configuration endpoints.

### `GET /status` — check activation status

```json
{ "status": "ACTIVE" }
```

**ActivationStatus enum**: `ACTIVE` | `PENDING` | `INPROGRESS`

- `ACTIVE`: No pending changes; current config is live.
- `PENDING`: Changes have been saved but not yet pushed.
- `INPROGRESS`: Activation is in progress.

### `POST /status/activate` — activate pending changes

No body required. Returns `ActivationStatus`. Best practice: poll `GET /status` after calling activate until `status = ACTIVE`.

### EUSA endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/eusaStatus/latest` | GET | Retrieve End User Subscription Agreement acceptance status |
| `/eusaStatus/{eusaStatusId}` | PUT | Update EUSA acceptance status |

EUSA acceptance is a one-time prerequisite for some tenants and is not part of normal activation flow.

---

## ZDX legacy auth

Uses `key_id` + `key_secret` (created in the ZDX Admin Portal). Returns a JWT Bearer token.

### `POST /oauth/token`

Request:

```json
{
  "key_id": "1&zj&7u0dihns4th3pt7&s1om2b6usl9",
  "key_secret": "p*99n!4b3jpnrs&&$61jxnx$je5j1ek0:1643829184"
}
```

Response:

```json
{
  "token": "eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Token valid for **3600 seconds** (1 hour). Clients must handle refresh.

### ZDX JWKS and validation

| Endpoint | Method | Description |
|---|---|---|
| `/oauth/jwks` | GET | Returns public keys for JWT signature verification |
| `/oauth/validate` | GET | Returns `{"valid": true/false}` for the current token |

---

## Workflow Automation legacy auth

### `POST /v1/auth/api-key/token`

Request:

```json
{ "key_id": "string", "key_secret": "string" }
```

Response (`201 Created`):

```json
{ "token": "string", "token_type": "string", "expires_in": 0 }
```

Token expires; clients must handle refresh. Bearer token sent in `Authorization` header on subsequent requests.

---

## ZPA legacy auth

Uses Client ID + Client Secret + Customer ID issued from the ZPA Admin Portal. Flow is session-based (similar to ZIA). The SDK wraps this via `LegacyZPAClient`. No official Postman collection is provided by Zscaler for ZPA (unlike ZIA and ZDX).

Base URL is cloud-dependent — references to `config.private.zscaler.com` within ZPA docs differ per tenant cloud assignment. See What Is My Cloud Name for ZPA (`/zpa/what-my-cloud-name-zpa`).

---

## ZCC and CBC legacy auth

Both use an API key issued from their respective admin portals and require the API to be explicitly enabled by Zscaler Support before the key can be used. Session-based (cookie), with explicit activation required for CBC write operations. ZCC scope is limited to: Login, Devices, Application Profiles.

---

## ZIA rate limits

Two bounds per endpoint: per-second/per-minute burst limit and per-hour sustained limit.

**Default weights:**

| Weight | Typical method | Per-second | Per-minute | Per-hour |
|---|---|---|---|---|
| Heavy | DELETE | — | 1 | 4 |
| Medium | POST, PUT | 1 | — | 400 |
| Light | GET | 2 | — | 1000 |

Specific endpoints may differ from the defaults above. Rate limit violations return `429` with a `Retry-After` field in the JSON body:

```json
{ "message": "Rate Limit (1/SECOND) exceeded", "Retry-After": "0 seconds" }
```

**Best practice**: add a `time.sleep()` or equivalent wait between calls in automation scripts.

### Selected endpoint rate limits

The full table runs to ~200+ endpoints. Key entries:

| Endpoint | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| `/authenticatedSession` | 2/sec, 1000/hr | 2/sec, 1000/hr | — | 2/sec, 1000/hr |
| `/status/activate` | — | 1/sec, 400/hr | — | — |
| `/adminUsers` | 2/sec, 1000/hr | 1/sec, 400/hr | — | — |
| `/adminUsers/{userId}` | — | — | 1/sec, 400/hr | 1/sec, 400/hr |
| `/urlFilteringRules` | 1/sec, 400/hr | 1/sec, 400/hr | — | — |
| `/urlFilteringRules/{ruleId}` | 1/sec, 400/hr | — | 1/sec, 400/hr | 1/sec, 400/hr |
| `/urlCategories` | 2/sec, 1000/hr | 1/sec, 400/hr | — | — |
| `/auditlogEntryReport` | 2/sec, 1000/hr | 10/min, 40/hr | — | 2/sec, 1000/hr |
| `/configAudit` | 1/hr, 8/day | — | — | — |
| `/cloudApplications/bulkUpdate` | — | — | 1/min, 4/hr | — |
| `/app_view/{id}/apps` (App Governance) | 25/day (trial), 1000/day (license) | — | — | — |

Full table: `vendor/zscaler-help/legacy-api-rate-limit-summary.md`.

A ZIA Cloud Service Postman collection is available from Zscaler at `/sites/default/files/zia_cloud_service.postman_collection_06_23_2025.json`.

---

## HTTP status codes (ZIA — same model used by ZPA, ZCC, CBC)

| Code | Meaning |
|---|---|
| `200` | Successful |
| `204` | Successful, no content returned |
| `400` | Invalid or bad request |
| `401` | Session not authenticated or timed out |
| `403` | API key disabled by provider; role lacks access; required SKU missing; write during maintenance mode |
| `404` | Resource does not exist |
| `405` | Method not allowed |
| `409` | Edit conflict — another admin is saving simultaneously; retry after a short wait |
| `415` | Unsupported media type — include `Content-Type: application/json` in request header |
| `429` | Rate limit exceeded — check `Retry-After` in response body |
| `500` | Unexpected error |
| `503` | Service temporarily unavailable (maintenance) |

The `403` code covers four distinct failure modes that the API does not distinguish between in the response body. When debugging a 403, check: API key status, admin role functional scope, SKU subscription, and whether the portal is in maintenance mode.

---

## ZIA `/authSettings` schema

The authentication settings endpoint is commonly read during audit and integration work. Full schema:

**`GET /authSettings`** — retrieve, **`PUT /authSettings`** — update.

| Field | Type | Description |
|---|---|---|
| `orgAuthType` | string | User auth type. Enum: `ANY`, `NONE`, `LDAP_GROUP`, `LDAP_USER`, `SAML`, `AD_GROUP`, `AD_USER`, `ZIDENTITY`, `ZIDENTITY_GUEST` |
| `oneTimeAuth` | string | One-time token behavior for unauthenticated users. Enum: `OTP_DISABLED`, `OTP_ENABLED`, `OTP_MANDATORY`. Not applicable when SAML SSO is enabled. |
| `samlEnabled` | boolean | Authenticate users via SAML SSO. Requires complete SamlSettings. |
| `kerberosEnabled` | boolean | Authenticate users via Kerberos |
| `kerberosPwd` | string | Read-only. Set via `generateKerberosPassword` endpoint only. |
| `authFrequency` | string | Cookie expiration after first auth. Enum: `DAILY_COOKIE`, `WEEKLY_COOKIE`, `MONTHLY_COOKIE`, `SESSION_COOKIE`. Not in Lite API. |
| `authCustomFrequency` | integer | Custom auth frequency in days (1–180). Not in Lite API. |
| `passwordStrength` | string | For form-based auth of hosted DB users. Enum: `NONE`, `LOW`, `HIGH` |
| `passwordExpiry` | string | For form-based auth of hosted DB users. Enum: `NEVER`, `MONTHLY`, `QUARTERLY`, `SEMIANNUALLY` |
| `lastSyncStartTime` | integer | Epoch seconds — start of last LDAP sync. Not in Lite API. |
| `lastSyncEndTime` | integer | Epoch seconds — end of last LDAP sync. Not in Lite API. |
| `mobileAdminSamlIdpEnabled` | boolean | Use Mobile Admin as IdP |
| `autoProvision` | boolean | Enable SAML Auto-Provisioning |
| `directorySyncMigrateToScimEnabled` | boolean | Disables directory sync to allow SCIM or SAML auto-provisioning. One-way flag — see `references/zia/ad-integration.md`. |

**`GET /authSettings/lite`** — same model but `authFrequency`, `authCustomFrequency`, `lastSyncStartTime`, `lastSyncEndTime` are not returned.

---

## Feature scope by product

### ZIA Cloud Service API

Activation, Admin Audit Logs, Admin & Role Management, Advanced Settings, Advanced Threat Protection Policy, Alerts, API Authentication, Authentication Settings, Bandwidth Control & Classes, Browser Control Policy, Browser Isolation, Cloud Applications, Cloud App Control Policy, Cloud NSS, Data Loss Prevention (DLP), Device Groups, DNS Control Policy, End User Notifications, Event Logs, File Type Control Policy, Firewall Policies, Forwarding Control Policy, FTP Control Policy, Intermediate CA Certificates, IoT Report, IPS Control Policy, Location Management and Traffic Forwarding, Malware Protection Policy, Mobile Malware Protection Policy, NAT Control Policy, Organization Details, PAC Files, Policy Export, Remote Assistance Support, Rule Labels, SaaS Security API, Sandbox Policy & Settings, Sandbox Report, Security Policy Settings, Service Edges, Shadow IT Report, SSL Inspection Policy, System Audit Report, Time Intervals, Traffic Capture Policy, URL Categories, URL Filtering Policy, URL & Cloud App Control Policy Settings, User Authentication Settings, User Management, Workload Groups.

### ZPA API

Admin SSO, Alternative Cloud Domains, API Keys, Application Segments, Segment Groups, AppProtection Controls, AppProtection Profiles, App Connectors, App Connector Groups, Certificates, Cloud Connector Groups, Customers, Customer Domains, Emergency Access, Enrollment Certificates, Feature Configurations, IdP Configurations, Isolation Profiles, Access Policies, Client Forwarding Policies, Timeout Policies, AppProtection Policies, Isolation Policies, Privileged Policies, Redirection Policies, LSS Configurations, Machine Groups, Microtenants, Posture Profiles, Private Service Edges, Private Service Edge Groups, Private Cloud Controllers, Private Cloud Controller Groups, Privileged Approvals, Privileged Consoles, Privileged Credentials, Privileged Portals, Provisioning Keys, SAML Attributes, SCIM Attributes, SCIM Groups, Servers, Server Groups, Trusted Networks, User Portals, User Portal Links, Version Profiles, VPN (for Legacy Apps), Zscaler Virtual IP Address Ranges.

### ZCC API

Login, Devices, Application Profiles. API access requires explicit enablement by Zscaler Support.

---

## SDK usage for legacy auth

The Python SDK exposes legacy clients directly:

```python
from zscaler.oneapi_client import LegacyZIAClient, LegacyZPAClient

with LegacyZIAClient(config) as client:
    users, _, _ = client.user_management.list_users()

with LegacyZPAClient(config) as client:
    segments, _, _ = client.app_segments.list_segments()
```

Enable via env var on the unified client path: `ZSCALER_USE_LEGACY=true`. Per-product legacy credential vars are documented in `vendor/zscaler-sdk-python/README.md § Legacy API Framework`.

Gov clouds (`GOV`, `GOVUS`) do not support OneAPI and must use the legacy client path.

---

## Cross-links

- OneAPI (the replacement auth layer) — [`./oneapi.md`](./oneapi.md)
- ZIA API reference (SDK surface, asymmetries, snapshot schema) — [`../zia/api.md`](../zia/api.md)
- ZPA API reference — [`../zpa/api.md`](../zpa/api.md)
- ZCC API reference — [`../zcc/api.md`](../zcc/api.md)
- ZIA AD integration (`directorySyncMigrateToScimEnabled` flag context) — [`../zia/ad-integration.md`](../zia/ad-integration.md)
