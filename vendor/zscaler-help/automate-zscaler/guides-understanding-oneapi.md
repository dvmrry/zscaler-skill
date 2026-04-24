# Understanding OneAPI | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/UnderstandingOneAPI
**Captured:** 2026-04-24 via Playwright MCP.

---

Zscaler OneAPI provides programmatic access to different Zscaler services with consistency in API design and experience across all products, reliability, and high performance of the APIs. Zscaler OneAPI allows for a centralized management of key components and features of APIs, including but not limited to API authentication, tenant access policies and management, rate limiting, caching, API lifecycle management, etc., thereby providing a consistent and uniform cross-product API experience and offering enhanced support for automation and integration with external services.

Before using the APIs, Zscaler recommends reviewing Getting Started for information regarding prerequisites, authentication, and how to make API calls. This API Reference contains detailed information on all available API calls, endpoints, and parameters. For a summary of the rate limits used by the endpoints, see Understanding Rate Limiting. To try out requests and responses for API calls using the Postman application, see Configuring the Postman REST API Client.

Zscaler can make periodic updates to the request and response parameters used by OneAPI endpoints.

## API Products Covered

- Zscaler Internet Access (ZIA) API - Base URL: `https://api.zsapi.net/zia/api/v1`
- Zscaler Private Access (ZPA) API - Base URLs: `https://api.zsapi.net/zpa/mgmtconfig/v1`, `v2`, `userconfig/v1`
- Zscaler Digital Experience (ZDX) API - Base URL: `https://api.zsapi.net/zdx/v1`
- ZIdentity API - Base URL: `https://api.zsapi.net/ziam/admin/api/v1`
- Zscaler Client Connector (ZCC) API - Base URL: `https://api.zsapi.net/zcc/papi/public/v1`
- Zscaler Cloud & Branch Connector API - Base URL: `https://api.zsapi.net/ztw/api/v1`
- Business Insights (BI) API - Base URL: `https://api.zsapi.net/bi/api/v1`
- Zscaler Analytics GraphQL API - Endpoint: `https://api.zsapi.net/zins/graphql`
