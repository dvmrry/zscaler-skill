# Understanding Rate Limiting (Zscaler Client Connector API)

**Source:** https://help.zscaler.com/legacy-apis/understanding-rate-limiting-3
**Captured:** 2026-04-26 via Playwright MCP (snapshot extraction).

---

Rate limits throttle the number of API calls you can make for any essential CRUD operation.

For an organization, the system rate limits all endpoints called from a given IP address to **100 API calls per hour** except for the `/downloadDevices`, `/downloadServiceStatus`, and `/downloadDisableReasons` endpoints, for which the rate limit is **3 API calls per day.**

All rate limits start as soon as the first call is executed. Calls can occur more than once per second, but no more than the limits for each operation type.

Clients subject to rate limits must back off exponentially to proceed further.

## Rate Limit Headers

Rate Limit headers in the response provide information about the current status of API rate limits. This helps users plan ahead for their API integrations to avoid reaching the rate limit and receiving the `429` (Too Many Requests) error code. The system sets the following headers when rate limits are enforced:

- `X-Rate-Limit-Remaining`: Indicates the number of API requests remaining within the current rate limit window.
- `X-Rate-Limit-Retry-After-Seconds`: Specifies the number of seconds the client must wait before making another API call if the rate limit has exceeded.

## Summary

| Endpoint Group | Rate Limit |
|---|---|
| All endpoints (per IP, per org) | 100 API calls per hour |
| `/downloadDevices`, `/downloadServiceStatus`, `/downloadDisableReasons` | 3 API calls per day |
