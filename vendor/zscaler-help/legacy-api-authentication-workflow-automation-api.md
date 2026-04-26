# API Authentication (Workflow Automation API)

**Source:** https://help.zscaler.com/legacy-apis/api-authentication-workflow-automation-api
**Captured:** 2026-04-26 via Playwright MCP (snapshot extraction).

---

## POST /v1/auth/api-key/token

Authenticate using the `key_id` and the `key_secret`. The response returns a session token in the header called `Bearer Token` that must be used in subsequent requests.

Parameters: No parameters

Request Body (required):
```json
{ "key_id": "string", "key_secret": "string" }
```

Response Model — ZSDLPGetSessionTokenResponse:
- `token` (string): The session token.
- `token_type` (string): The type of the session token.
- `expires_in` (integer): The expiration time of the session token.

Responses:
- **201**: Successful operation. A new authorization token is created.
  ```json
  { "token": "string", "token_type": "string", "expires_in": 0 }
  ```
- **401**: Authorization failure

Postman collection: `/sites/default/files/workflow_automation_postman_collection_09_24_2024_0.json`

## Notes

- Authentication uses **API key ID + key secret** (not username/password/session cookie like ZIA legacy)
- Session token returned as a `Bearer Token` header value
- Returned token expires (`expires_in` field); clients must handle token refresh
- Only endpoint in the API Authentication reference group
- Reference Guide also contains: Audit Logs, DLP Incidents sections, and API Rate Limit Summary
