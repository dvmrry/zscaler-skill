# Understanding Response Codes & Error Messages | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/response-codes/oneapi
**Captured:** 2026-04-24 via Playwright MCP.

---

The following HTTP status codes are returned by Zscaler OneAPI. In addition, the APIs for specific Zscaler services might use a set of status codes that is exclusive to that service.

## OneAPI HTTP Status Codes

| Code | Description |
|------|-------------|
| 401  | The authorization token is invalid, expired, or missing. |
| 403  | The API client does not have access to the requested resource. |
| 404  | The requested API resource could not be found. |
| 408  | The client took too long to send a complete request. |
| 413  | The HTTP request exceeds the maximum allowable size. |
| 429  | The API client exceeded the rate limit or quota. Too many requests have been made in a short period. |
| 500  | An internal server error occurred while processing the request. |
| 503  | The requested resource is temporarily unavailable. |
| 504  | The server took too long to respond to the request. |

## Read-Only Mode (ZIA)

During scheduled maintenance, ZIA APIs return HTTP 403 with:
```json
{
  "code": "STATE_READONLY",
  "message": "The API service is undergoing a scheduled upgrade and is in read-only mode."
}
```

The response header `x-zscaler-mode: read-only` is also included.
