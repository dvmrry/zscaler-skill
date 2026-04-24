# ZIA API Sample Endpoints | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zia/
**Captured:** 2026-04-24 via Playwright MCP.

---

## Endpoint Documentation Format

Each endpoint page contains:
- HTTP Method (GET, POST, PUT, DELETE, PATCH)
- Full URL (e.g., `https://api.zsapi.net/zia/api/v1/...`)
- Description
- Query parameters (with types, descriptions, defaults, required flags)
- Request body schema (JSON, with field types, descriptions, defaults, required flags)
- Response schemas (200, 400, 404, 429, 503, etc.)
- Code samples in: cURL, Java, Python, Go, JavaScript, C#, PowerShell, Node.js, Ruby, PHP, Dart, C, Objective-C, OCaml, R, Swift, Kotlin, Rust

---

## Sample: Get Authenticated Session

**GET** `https://api.zsapi.net/zia/api/v1/authenticatedSession`

Checks if there is an authentication session.

**Response (200):**
```json
{
  "authType": "ADMIN_LOGIN",  // Possible: ADMIN_LOGIN, SUPPORT_ACCESS_PARTIAL, SUPPORT_ACCESS_FULL, PARTNER_ACCESS, INTEGRATION_PARTNER_ACCESS, DEFAULT_LOGIN, ADMIN_SAML_SSO_LOGIN, SUPPORT_ACCESS_READ_ONLY, MOBILE_APP_TOKEN
  "obfuscateApiKey": false,
  "passwordExpiryTime": 0,
  "passwordExpiryDays": 0
}
```

---

## Sample: Activate Organizational Changes

**POST** `https://api.zsapi.net/zia/api/v1/status/activate`

Activates the saved configuration changes. Required after any ZIA configuration change.

**Response (200):**
```json
{
  "status": "ACTIVE"  // Possible: ACTIVE, PENDING, INPROGRESS
}
```

---

## Sample: Add Admin User

**POST** `https://api.zsapi.net/zia/api/v1/adminUsers`

Creates an admin or auditor user.

**Query Parameters:**
- `associateWithExistingAdmin` (boolean, default: false) - Set to true to update an admin user that already exists in other Zscaler services but does not exist in ZIA

**Request Body (required fields):**
- `loginName` (string, REQUIRED) - Email format login name using the domain name associated with the Zscaler account
- `userName` (string, REQUIRED) - Admin's username
- `email` (string, REQUIRED) - Admin's email address
- `role` (object) - Role assignment
- `id` (int32) - Admin/auditor user ID
- `comments` (string) - Additional info
- `adminScope` (object) - Scope configuration
- `isNonEditable` (boolean, default: false)
- `disabled` (boolean)
- `isAuditor` (boolean, default: false)
- `password` (string) - Required for POST if SSO is disabled
- `isPasswordLoginAllowed` (boolean, default: false)
- `isSecurityReportCommEnabled` (boolean, default: false)
- `isServiceUpdateCommEnabled` (boolean, default: false)
- `isProductUpdateCommEnabled` (boolean, default: false)
- `isPasswordExpired` (boolean, default: false)
- `isExecMobileAppEnabled` (boolean, default: false)
- `newLocationCreateAllowed` (boolean)

**Example cURL:**
```bash
curl -L 'https://api.zsapi.net/zia/api/v1/adminUsers' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "loginName": "admin@example.com",
    "userName": "admin",
    "email": "admin@example.com",
    "role": {"id": 0},
    "adminScope": {"Type": "ORGANIZATION"}
  }'
```
