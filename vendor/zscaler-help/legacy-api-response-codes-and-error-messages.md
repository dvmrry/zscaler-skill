# API Response Codes and Error Messages

**Source:** https://help.zscaler.com/legacy-apis/api-response-codes-and-error-messages
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400411, revision 2603646

---

The following HTTP status codes are returned by the API:
| Code | Description |
|---|---|
| 200 | Successful |
| 204 | Successful. No content returned. |
| 400 | Invalid or bad request |
| 401 | Session is not authenticated or timed out |
| 403 | This code is returned due to one of the following reasons:The API key was disabled by your service providerUser's role has no access permissions or functional scopeA required SKU subscription is missingAPI operations that use POST, PUT, or DELETE methods are performed when the ZIA Admin Portal is in maintenance mode during a scheduled upgradeContact Zscaler Support or your Zscaler Account team for assistance. |
| 404 | Resource does not exist |
| 405 | Method not allowed. This error is returned when the request method is not supported by the target resource. |
| 409 | Request could not be processed because of possible edit conflict occurred. Another admin might be saving a configuration change at the same time. In this scenario, the client is expected to retry after a short time period. |
| 415 | Unsupported media type. This error is returned if you don't include application/json as the Content-Type in the request header (for example, Content-Type: application/json). |
| 429 | Exceeded the rate limit or quota. The response includes a Retry-After value. |
| 500 | Unexpected error |
| 503 | Service is temporarily unavailable |
