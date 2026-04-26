# API Authentication (ZDX API)

**Source:** https://help.zscaler.com/legacy-apis/api-authentication-1
**Captured:** 2026-04-26 via Playwright MCP (snapshot extraction).

---

## POST /oauth/token

Authenticate using the API key_id and key_secret from the ZDX Admin Portal to access ZDX Public APIs. The response returns a token that must be used in subsequent requests.

Parameters: No parameters

Request Body (required):
```json
{ "key_id": "1&zj&7u0dihns4th3pt7&s1om2b6usl9", "key_secret": "p*99n!4b3jpnrs&&$61jxnx$je5j1ek0:1643829184" }
```

Response Model:
- `token*` (string): Token
- `token_type*` (string): Token Type — default: `Bearer`
- `expires_in*` (integer): The expiry time in seconds — default: `3600`

Responses:
- **200**: Successful Operation. The response contains the token and the token type. The token is valid for 3600 seconds.
  ```json
  { "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5qVkJSalk1TURsQ01VSXdOelU0UlRBMlF6WkZNRFE0UXpRMk1EQXlRalZETmprMVJUTTJRZyJ9...", "token_type": "Bearer", "expires_in": 3600 }
  ```
- **401**: Unauthorized
- **403**: Forbidden

Postman collection: `/sites/default/files/ZDX_postman_collection_02_29_2024.json`

---

## GET /oauth/jwks

Returns a JSON Web Key Set (JWKS) that contains the public keys that can be used to verify the JWT tokens.

Parameters: No parameters

Response Model:
- `keys` (array): Array of JWK objects

Responses:
- **200**: Successful Operation
- **401**: Unauthorized
- **403**: Forbidden

---

## GET /oauth/validate

Checks if the JWT token is valid.

Parameters: No parameters

Response Model:
- `valid` (boolean): Indicates whether the JWT token is valid or not.

Responses:
- **200**: Successful Operation. The JWKS keys are valid.
  ```json
  { "valid": true }
  ```
- **401**: Unauthorized
- **403**: Forbidden

---

## Notes

- ZDX uses OAuth 2.0 with API key_id + key_secret (not ZIdentity)
- Token type: `Bearer`, default expiry: **3600 seconds** (1 hour)
- JWKS endpoint allows clients to fetch public keys for JWT signature verification
- Validate endpoint allows checking token validity without attempting an API call
- Reference Guide also contains: Administration, Alerts, Inventory, Reports, Troubleshooting, ZDX Snapshots sections
