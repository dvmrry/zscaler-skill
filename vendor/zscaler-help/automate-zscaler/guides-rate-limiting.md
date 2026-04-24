# Understanding Rate Limiting | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/rate-limiting/overview
**Captured:** 2026-04-24 via Playwright MCP.

---

Rate limits throttle the number of API calls that are made within a specific time frame. The following sections provide a summary of the rate limits used by Zscaler OneAPI.

## ZIA API Rate Limits

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/rate-limiting/zia

Every ZIA endpoint has two different types of rate limit:
- A lower bound limit (protects against high bursts over a short period)
- An upper bound limit (protects against high volume over a long period)

Every endpoint is assigned a weight with a default rate limit:

| Weight | Typical Assignment | Requests/second | Requests/minute | Requests/hour |
|--------|--------------------|----------------|----------------|---------------|
| Heavy  | DELETE             | -              | 1              | 4             |
| Medium | POST, PUT          | 1              | -              | 400           |
| Light  | GET                | 2              | -              | 1,000         |

When the rate limit is exceeded, an HTTP 429 response code is returned.

**ZIA Rate Limit Response Headers:**
- `x-ratelimit-limit`: The rate limit ceiling for the current API request
- `x-ratelimit-remaining`: Number of API requests remaining for the current rate limit window
- `x-ratelimit-reset`: Time (in seconds) remaining in the current window after which rate limit resets

## ZPA API Rate Limits

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/rate-limiting/zpa

All ZPA API endpoints called from a specific IP address are subject to:
- 20 times in a 10-second interval for GET calls
- 10 times in a 10-second interval for POST/PUT/DELETE calls

All rate limits start as soon as the first call is executed. When exceeded, HTTP 429 is returned with a `retry-after` header:

```json
{
  "content-type": "application/json",
  "date": "Wed, 6 Mar 2024 11:38 GMT",
  "retry-after": "13s"
}
```

## ZDX API Rate Limits

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/rate-limiting/zdx

ZDX rate limits are based on Tier Level (by number of licenses):

| Tier | Number of Licenses | Requests/second | Requests/minute | Requests/hour | Requests/day |
|------|-------------------|----------------|----------------|---------------|--------------|
| 1    | 5,000             | 5              | 30             | 1,000         | 10,000       |
| 2    | 20,000            | 5              | 60             | 3,000         | 15,000       |
| 3    | 100,000           | 5              | 120            | 6,000         | 30,000       |
| 4    | More than 100,000 | 5              | 180            | 9,000         | 60,000       |

**ZDX Rate Limit Response Headers:**
- `RateLimit-Limit`: Rate limit ceiling for current request
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Time at which rate limit resets (UTC epoch seconds)

## Zscaler Client Connector (ZCC) API Rate Limits

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/rate-limiting/client-connector

All endpoints: **100 API calls per hour** at the tenant level.

Exceptions:
- `/downloadDevices`, `/downloadServiceStatus`, `/downloadDisableReasons`: **3 API calls per day**

**ZCC Rate Limit Response Headers:**
- `X-Rate-Limit-Remaining`: API requests remaining in current window
- `X-Rate-Limit-Retry-After-Seconds`: Seconds to wait before next call when limit exceeded

## Zscaler Cloud & Branch Connector API Rate Limits

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/rate-limiting/cloud-branch-connector

| Weight | Typical Assignment | Requests/second | Requests/minute | Requests/hour |
|--------|--------------------|----------------|----------------|---------------|
| Heavy  | DELETE             | -              | 1              | 4             |
| Medium | POST, PUT          | 1              | -              | 400           |
| Light  | GET                | 2              | -              | 1,000         |

When exceeded, returns HTTP 429 with body:
```json
{
  "message": "Rate Limit (1/SECOND) exceeded",
  "Retry-After": "0 seconds"
}
```

## Business Insights API Rate Limits

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/rate-limiting/bi

| Tier  | Requests/Second | Requests/Hour | Applies To |
|-------|----------------|---------------|------------|
| Heavy | 1              | 400           | Custom Applications (CRUD), Report Configurations (CRUD) |
| Light | 2              | 1,000         | Reports: List All, Download |

When exceeded, returns HTTP 429:
```json
{
  "errorCode": "RATE_LIMIT_EXCEEDED",
  "errorDetails": "Rate limit exceeded. Maximum 2 requests per second and 1000 requests per hour is allowed.",
  "timestamp": 1772573283919
}
```

## Best Practices

- Implement Exponential Backoff when receiving 429 responses
- Monitor usage to stay within limits
- Batch Operations for Custom Applications and Report Configurations
- Cache Results where possible
- Include a `wait`/`sleep` period between endpoint calls in scripts
