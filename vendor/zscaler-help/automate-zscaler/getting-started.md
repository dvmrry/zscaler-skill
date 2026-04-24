# Getting Started | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/getting-started/getting-started
**Captured:** 2026-04-24 via Playwright MCP.

---

Zscaler OneAPI provides unified programmatic access to different Zscaler services with consistency in API design and experience across all products, reliability, and high performance. Zscaler OneAPI allows for a centralized management of key components and features of APIs, including but not limited to API authentication, tenant access policies and management, rate limiting, caching, API lifecycle management, etc., thereby providing a consistent and uniform cross-product API experience and offering enhanced support for automation and integration with external services.

The journey is broken into four clear stages:

- Getting Access - Set up ZIdentity, link your service tenants, and create API Clients with the right roles and resources.
- Authenticating - Prove your client's identity using OAuth 2.0. Start with a client secret in the lab, then move to stronger JWT- or certificate-based methods for production.
- Automate - Use your bearer token to make authenticated API requests against Zscaler endpoints. Learn how to locate your base URL, structure calls, and follow best practices.

## Getting Access

Before you can build against Zscaler OneAPI, you need to set up the foundation: access, resources, and clients. This process ensures your organization is provisioned, that API roles are defined, and that client credentials are created in ZIdentity.

Zscaler OneAPI uses the OAuth 2.0 authorization framework to provide secure access to Zscaler Internet Access (ZIA), Zscaler Private Access (ZPA), Zscaler Client Connector, and Zscaler Cloud & Branch Connector APIs. OAuth 2.0 allows third-party applications to obtain controlled access to protected resources using access tokens. OneAPI uses the Client Credentials OAuth flow.

Zscaler's unified identity platform, ZIdentity, serves as the authorization server for OneAPI and supports:
- API Resource Management
- API Client Management
- Token Endpoint: `https://<vanity-domain>.zslogin.net/oauth2/v1/token`

### Prerequisites

- Your organization must have a subscription to ZIdentity.
- Register client applications in ZIdentity with the necessary scope.

### Understanding API Resources and Roles

Zscaler API resources are groupings of endpoints that represent a combination of a Zscaler service (e.g., ZIA, ZPA, ZDX, etc.) and an associated RBAC Role (e.g., SuperAdmin, ReadOnly). Access is governed by Role-Based Access Control (RBAC).

## Authenticating

### Authentication Methods

The following client authentication mechanisms are supported by ZIdentity for accessing OneAPI resources:

1. **Client Secret** - A client secret generated in ZIdentity (best for testing/lab)
2. **Private Key JWT (JWKS URL)** - JWT signed by private key, ZIdentity validates via JWKS URL (best for production)
3. **Certificates/Public Keys** - JWT signed by private key, ZIdentity validates against uploaded public key (best for compliance requirements)

### ZIdentity Token Endpoint

```
https://<vanity-domain>.zslogin.net/oauth2/v1/token
```

### Option 1: Using a Client Secret

```
POST /oauth2/v1/token HTTP/1.1
Host: <vanity-domain>.zslogin.net
Content-Type: application/x-www-form-urlencoded

{
  "grant_type": "client_credentials",
  "client_id": "<Client ID>",
  "client_secret": "<Client Secret>",
  "audience": "https://api.zscaler.com"
}
```

### Option 2: Using a JWKS URL

Generate a private/public key pair, host the public key at a JWKS URL, configure the JWKS URL in ZIdentity.

### Option 3: Using Certificates and Public Keys

Upload the client's public key (.pem) or X.509 certificate directly into ZIdentity.

### JWT Signing Pseudocode

```
header    = base64url_encode({ "alg": "RS256", "typ": "JWT" })
payload   = base64url_encode({
              "iss": client_id,
              "sub": client_id,
              "aud": "https://api.zscaler.com",
              "exp": now() + 600  // expires in 10 minutes
            })
unsigned  = header + "." + payload
signature = sign_with_private_key(unsigned, algorithm="RS256")
jwt       = unsigned + "." + base64url_encode(signature)
```

### Token Request with JWT Assertion

```
POST /oauth2/v1/token HTTP/1.1
Host: <vanity-domain>.zslogin.net
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=<Client ID>
&client_assertion=<jwt>
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&audience=https://api.zscaler.com
```

### Successful Token Response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6Ikp...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Automate

### Base URLs

All API calls use `api.zsapi.net` as the host. Base URLs by product:

| API | Base Path | Base URL |
|-----|-----------|----------|
| ZIA API | /zia/api/v1 | https://api.zsapi.net/zia/api/v1 |
| ZPA API | /zpa/mgmtconfig/v1, /zpa/mgmtconfig/v2, /zpa/userconfig/v1 | https://api.zsapi.net/zpa/mgmtconfig/v1 etc. |
| ZDX API | /zdx/v1 | https://api.zsapi.net/zdx/v1 |
| ZIdentity API | /ziam/admin/api/v1 | https://api.zsapi.net/ziam/admin/api/v1 |
| ZCC API | /zcc/papi/public/v1 | https://api.zsapi.net/zcc/papi/public/v1 |
| Cloud & Branch Connector API | /ztw/api/v1 | https://api.zsapi.net/ztw/api/v1 |
| Business Insights API | /bi/api/v1 | https://api.zsapi.net/bi/api/v1 |

Beta endpoint uses `api.beta.zsapi.net`.

### Making an API Call

All requests require:
```
Authorization: Bearer <access_token>
```

### Example ZIA API Request

```python
url = "https://api.zsapi.net/zia/api/v1/urlLookup"
payload = [ "viruses.org", "facebook.com", "bbc.com" ]
headers = {
  "Authorization": "Bearer <Access Token>"
}
response = requests.post(url, headers=headers, json=payload)
```

### Example ZPA API Request

ZPA requires a `customerId` parameter (ZPA tenant ID).

```python
url = "https://api.zsapi.net/zpa/mgmtconfig/v1/admin/customers/{customerId}/application"
params = {"page": 1, "pagesize": 100}
headers = {"Authorization": "Bearer <Access Token>"}
response = requests.get(url, headers=headers, params=params)
```

### Example ZDX API Request

```python
url = "https://api.zsapi.net/zdx/v1/devices/{device_id}/deeptraces"
payload = {
  "session_name": "{sessionName}",
  "session_length_minutes": 5,
  "probe_device": True
}
headers = {"Authorization": "Bearer <Access Token>"}
response = requests.post(url, headers=headers, json=payload)
```

### Example ZCC API Request

```python
url = "https://api.zsapi.net/zcc/papi/public/v1/getOtp"
params = {"udid": "{udid}"}
headers = {"Authorization": "Bearer <Access Token>"}
response = requests.get(url, headers=headers, params=params)
```

### Example Cloud & Branch Connector API Request

```python
url = "https://api.zsapi.net/ztw/api/v1/ecgroup"
headers = {"Authorization": "Bearer <Access Token>"}
response = requests.get(url, headers=headers)
```

## API Best Practices

- Adjust the token lifetime in ZIdentity to balance convenience and security.
- Always fetch before update: Send GET before PUT/POST.
- Always use UTF-8 encoding.
- Activation required: For ZIA and Cloud & Branch Connector APIs, configuration changes must be explicitly activated with POST to `/status/activate` or `/ecAdminActivateStatus/activate`.
- Avoid race conditions: Do not manually change config settings via UI while scripts are running. A 409 error (EDIT_LOCK_NOT_AVAILABLE) indicates a race condition.

## Read-Only Mode During Maintenance

```
HTTP/1.1 403
x-zscaler-mode: read-only
{
  "code": "STATE_READONLY",
  "message": "The API service is undergoing a scheduled upgrade and is in read-only mode."
}
```
