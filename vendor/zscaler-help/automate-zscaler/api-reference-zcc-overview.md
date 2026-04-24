# Zscaler Client Connector (ZCC) API Overview | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zcc/zscaler-client-connector-api
**Captured:** 2026-04-24 via Playwright MCP.

---

## Version: 1.0

Base URL: `https://api.zsapi.net/zcc/papi/public/v1`

## Authentication (ZCC-Specific)

ZCC uses its own legacy authentication endpoint:

**POST** `https://api.zsapi.net/zcc/papi/auth/v1/login`

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

## Rate Limits

- All endpoints: **100 API calls per hour** at the tenant level
- Exception: `/downloadDevices`, `/downloadServiceStatus`, `/downloadDisableReasons`: **3 API calls per day**

Rate limit response headers:
- `X-Rate-Limit-Remaining`: Requests remaining in current window
- `X-Rate-Limit-Retry-After-Seconds`: Seconds to wait when limit exceeded

## Key Endpoints

### Devices
- `GET /zcc/papi/public/v1/devices` — List all enrolled devices (basic details)
- `GET /zcc/papi/public/v1/devices/details` — List device details
- `DELETE /zcc/papi/public/v1/devices` — Force remove devices
- `DELETE /zcc/papi/public/v1/devices/soft` — Soft remove devices
- `DELETE /zcc/papi/public/v1/devices/machineTunnel` — Remove machine tunnel devices

### Credentials & OTP
- `GET /zcc/papi/public/v1/getOtp?udid={udid}` — Get one-time password for device
- `GET /zcc/papi/public/v1/getAppProfilePassword` — Get app profile password for device

### Policies & Profiles
- `GET /zcc/papi/public/v1/policy` — List policies
- `POST/PUT /zcc/papi/public/v1/policy` — Add/update policy
- `DELETE /zcc/papi/public/v1/policy` — Delete policy
- `GET /zcc/papi/public/v1/appProfiles` — List application profile policies

### Admin Users
- `GET /zcc/papi/public/v1/admins` — List admin users
- `GET /zcc/papi/public/v1/adminRoles` — List admin roles
- `PUT /zcc/papi/public/v1/admins` — Update admin user

### Organization
- `GET /zcc/papi/public/v1/orgInfo` — Get organization information

### Reporting (rate limited: 3/day)
- `GET /zcc/papi/public/v1/downloadDevices` — Export device info as CSV
- `GET /zcc/papi/public/v1/downloadDisableReasons` — Export disable reasons as CSV
- `GET /zcc/papi/public/v1/downloadServiceStatus` — Export service status as CSV

## Example: Get OTP for Device

```python
import requests

url = "https://api.zsapi.net/zcc/papi/public/v1/getOtp"
params = {"udid": "{udid}"}
headers = {"Authorization": "Bearer <Access Token>"}
response = requests.get(url, headers=headers, params=params)
# Response: {"otp": "kg08abdcp1"}
```

Note: To prevent call caching, add a dummy random argument:
`GET /getOtp?_=123456?`
