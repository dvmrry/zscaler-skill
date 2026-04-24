# API Authentication Overview | Zscaler OneAPI

**Source:** https://automate.zscaler.com/docs/getting-started/getting-started
**Captured:** 2026-04-24 via Playwright MCP.

---

## Primary Authentication: OneAPI OAuth 2.0 (ZIdentity)

For most Zscaler OneAPI products (ZIA, ZPA, ZIdentity, ZCC, ZTW, BI), authentication uses OAuth 2.0 Client Credentials flow via ZIdentity.

**Token Endpoint:**
```
POST https://<vanity-domain>.zslogin.net/oauth2/v1/token
```

**Required Parameters:**
- `grant_type`: `client_credentials`
- `client_id`: From ZIdentity Admin Portal
- `client_secret` OR `client_assertion`: (secret or JWT)
- `audience`: `https://api.zscaler.com` (REQUIRED)

**Successful Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6Ikp...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Usage in API calls:**
```
Authorization: Bearer <access_token>
```

---

## ZDX-Specific Authentication

ZDX has its own legacy authentication endpoint:

**POST** `https://api.zsapi.net/zdx/v1/oauth/token`

Request body:
```json
{
  "key_id": "your-api-key-id",
  "key_secret": "SHA256(secret_key:timestamp)",
  "timestamp": 1643829184
}
```

Note: `key_secret` must be SHA256 hash of `<secret_key>:<timestamp>`. Requests sent more than 15 minutes after the timestamp are invalid. Token is valid for 3600 seconds.

---

## ZCC-Specific Authentication (Legacy)

ZCC has its own authentication endpoint:

**POST** `https://api.zsapi.net/zcc/papi/auth/v1/login`

Request body:
```json
{
  "apiKey": "your-api-key",
  "secretKey": "your-secret-key"
}
```

Response:
```json
{
  "jwtToken": "...",
  "message": "..."
}
```

---

## Authentication Method Comparison

| Method | Best For | Rotation | Security |
|--------|----------|----------|----------|
| Client Secret | Testing, lab, POC | Manual | Low-Medium |
| JWKS URL (Private Key JWT) | Production automation | Automatic (no downtime) | High |
| Certificate/Public Key | Compliance, regulatory | Manual | High |

---

## Access Token Note

Access token lifetime is configurable in ZIdentity. The `expires_in` field in the response indicates the expiration in seconds (typically 3600 = 1 hour).

During ZIA maintenance/upgrade mode:
```
HTTP/1.1 403
x-zscaler-mode: read-only
{
  "code": "STATE_READONLY",
  "message": "The API service is undergoing a scheduled upgrade and is in read-only mode."
}
```
