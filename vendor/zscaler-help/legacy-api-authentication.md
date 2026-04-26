# API Authentication

**Source:** https://help.zscaler.com/legacy-apis/api-authentication
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article/main).

---

Legacy Zscaler APIs Help
ZIA API
API Developer & Reference Guide
Reference Guide
API Authentication

## /authenticatedSession

### GET

Checks if there is an authentication session.

Parameters: No parameters

Model - SessionInfo

- authType (string): Login type. Enum: [ADMIN_LOGIN, ...9 Items]. readonly: true
- obfuscateApiKey (boolean, default: false): Whether API key was obfuscated or not. readonly: true
- passwordExpiryTime (integer/$int64): Password Expiry Time. readonly: true
- passwordExpiryDays (integer/$int32): Password Expiry Days. readonly: true

Responses:
- Code 200: Successful Operation. When an authenticated session exists, the response contains authType information. If authType is not present, the authenticated session has expired or it does not exist.

Example Value:
```json
{
  "authType": "ADMIN_LOGIN",
  "obfuscateApiKey": false,
  "passwordExpiryTime": 0,
  "passwordExpiryDays": 0
}
```
- Code 503: Service is temporarily unavailable due to maintenance

### POST

Creates an authenticated session. The response returns a cookie in the header called JSESSIONID that must be used in subsequent requests.

Parameters:

- credentials *required (object, body): User credential.

Example Value:
```json
{
  "apiKey": "string",
  "username": "string",
  "password": "string",
  "timestamp": "string"
}
```

Model - SessionInfo

- authType (string): Login type. Enum: [9 Items]. readonly: true
- obfuscateApiKey (boolean, default: false): Whether API key was obfuscated or not. readonly: true
- passwordExpiryTime (integer/$int64): Password Expiry Time. readonly: true
- passwordExpiryDays (integer/$int32): Password Expiry Days. readonly: true

Responses:
- Code 200: Successful Operation. The response contains authType information only when authentication has completed successfully, regardless of the response code given.

Example Value:
```json
{
  "authType": "ADMIN_LOGIN",
  "obfuscateApiKey": false,
  "passwordExpiryTime": 0,
  "passwordExpiryDays": 0
}
```

### DELETE

Ends an authenticated session.

Parameters: No parameters

Model - ActivationStatus: Organization Policy Edit/Update Activation status

- status (string): Enum: [3 Items]

Responses:
- Code 200: Successful Operation

Example Value:
```json
{
  "status": "ACTIVE"
}
```
