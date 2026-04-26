# Getting Started (ZPA API)

**Source:** https://help.zscaler.com/legacy-apis/getting-started-zpa-api
**Captured:** 2026-04-26 via Playwright MCP (snapshot extraction).

---

Your organization must meet the following prerequisites before you can access and use the ZPA API:

- Add an API key (`/zpa/about-api-keys`). Only admins with full access to the API Key Management role (`/zpa/configuring-administrator-roles#APIkey`) can create keys.
- Use an API management tool, or use the Zscaler Help Portal (`/zpa/zpa-api/api-developer-reference-guide/reference-guide`). Note: Zscaler does **not** officially provide a Postman collection for ZPA (unlike ZIA).

If you need to obtain API keys, authenticate into, and make calls using Zscaler OneAPI endpoints, see API Client Authentication (`/zslogin/authentication/api-client-authentication`) in ZIdentity and Getting Started (`/oneapi/getting-started`) with OneAPI.

**Note:** The request URLs and references to `config.private.zscaler.com` within this article differ depending on your organization's assigned cloud. See What Is My Cloud Name for ZPA? (`/zpa/what-my-cloud-name-zpa`).

After these prerequisites are met, you can:
1. Locate your base URI
2. Authenticate and create an API session
3. Make an API call
4. Log out of the API

To learn more about rate limiting and HTTP status codes, see About Rate Limiting (`/zpa/about-rate-limiting`) and About Error Codes (`/zpa/about-error-codes`).

## Navigation (sidebar structure)

The ZPA API section under `legacy-apis` contains:
- Understanding the ZPA API (`/legacy-apis/understanding-zpa-api`)
- API Developer & Reference Guide (expandable)
  - Getting Started (`/legacy-apis/getting-started-zpa-api`) ← this page
  - Configuring the Postman REST API Client (`/legacy-apis/configuring-postman-rest-api-client-1`)
  - Understanding Rate Limiting (`/legacy-apis/understanding-rate-limiting-1`)
  - API Response Codes and Error Messages (`/legacy-apis/api-response-codes-and-error-messages-1`)
  - Reference Guide (expandable)
  - Working with APIs (expandable)
