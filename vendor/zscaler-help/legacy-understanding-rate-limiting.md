# Understanding Rate Limiting

**Source:** https://help.zscaler.com/legacy-apis/understanding-rate-limiting
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Every endpoint and action has two rate limit types:

- A lower bound limit that protects against high bursts of requests over a short period of time
- An upper bound limit that protects against a high volume of requests over a long period of time

These limits throttle the number of API calls you can make. Every endpoint has a weight, and every weight has a default rate limit, but some endpoints have exceptions. To learn more, see the API Rate Limit Summary (`/zia/api-rate-limit-summary`).

The following table provides the typical assignment for each weight. However, specific operations can have a different weight from these typical values.

| Weight | Typical Assignment | Req/sec | Req/min | Req/hr |
|--------|-------------------|---------|---------|--------|
| Heavy  | DELETE            | -       | 1       | 4      |
| Medium | POST, PUT         | 1       | -       | 400    |
| Light  | GET               | 2       | -       | 1000   |

As a best practice, after each call to an endpoint, your script should include a wait (or sleep) period. For example in Python, you would use the `time.sleep()` function. When the rate limit is exceeded, a 429 HTTP error message (`/zia/api-response-codes-and-error-messages`) is returned with a `Retry-After` response in the Body. For example:

```json
{ "message": "Rate Limit (1/SECOND) exceeded", "Retry-After": "0 seconds" }
```
