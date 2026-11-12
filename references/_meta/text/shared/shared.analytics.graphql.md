# The Analytics (Z-Insights) GraphQL API: endpoint, access and scope (shared.analytics.graphql)
Also called: zins graphql; z-insights api; zinsights; analytics api graphql; api.zsapi.net/zins/graphql; zscaler insights reader; graphql introspection production; zdx graphql api
Former IDs: shared-30, shared-34

The Analytics API gives programmatic access to Zscaler analytics data for custom dashboards, trends and insights on SaaS Security, Shadow IT, IoT Security, Zero Trust Firewall, cybersecurity posture and web traffic. [shared.analytics.graphql:what-it-is] It is a GraphQL API reached through the OneAPI gateway, with a single endpoint that takes queries across multiple data domains. [shared.analytics.graphql:single-endpoint]

**Endpoints.** The GraphQL endpoint is `https://api.zsapi.net/zins/graphql` in production and `https://api.beta.zsapi.net/zins/graphql` in beta. [shared.analytics.graphql:endpoints]

**Access.** It uses OneAPI's OAuth 2.0 Client Credentials flow with Authentication Service as the authorization server; the audience parameter is required in the token request, and the access token is sent with every request. [shared.analytics.graphql:oneapi-auth] The token request itself is in [How a client gets and uses a OneAPI access token](kb:shared.oneapi.authentication). The role an API client needs is [A Z-Insights GraphQL API client is registered with Authentication Service and given a role; the default role is Zscaler Insights Reader.](kb:zia.iot.api-surface:graphql-role).

**Data domains.** The guide's multi-domain example queries the `WEB_TRAFFIC`, `SAAS_SECURITY`, `IOT` and `ZERO_TRUST_FIREWALL` domains in one request, and its introspection example uses `CYBER_SECURITY`. [shared.analytics.graphql:domains] The Python SDK's Z-Insights service, which posts to `/zins/graphql`, exposes web traffic, SaaS security (CASB), cyber security, zero trust firewall, IoT device visibility and Shadow IT discovery interfaces. [shared.analytics.graphql:sdk-domain-services] The Analytics API also provides ZDX-related data, through a ZDX GraphQL API supported within it. [shared.analytics.graphql:zdx-data] Which ZDX dashboards draw on it is still open [gap:shared.analytics.graphql:zdx-linkage]. Whether it reads the same data as the Business Insights reports is open [gap:shared.analytics.graphql:bi-relationship].

**Introspection.** Schema introspection is available only in the Beta cloud environment. [shared.analytics.graphql:introspection-beta-only] The earlier question about production introspection is closed [gap:shared.analytics.graphql:production-introspection].

**Writing queries and handling errors.** Query arguments, filters and open schema questions are in [Writing Analytics GraphQL queries: time range, units, limits, filters and open schema questions](kb:shared.analytics.graphql-queries); status codes, the errors array and rate limits are in [Analytics GraphQL errors and rate limits: errors under HTTP 200, status codes, 1,000 calls a second](kb:shared.analytics.graphql-errors-and-limits).

What to check:
1. Whether the API client is registered in Authentication Service with a role that grants the data domains queried, such as Zscaler Insights Reader.
2. Whether the request goes to the production or the beta endpoint, and whether introspection is expected to work there.

Not known (open gaps):
- How ZDX trend data relates to the Analytics GraphQL API [gap:shared.analytics.graphql:zdx-linkage]: settled by source-read. Blocks: telling a caller which API backs a given ZDX dashboard
- How the Analytics GraphQL API relates to the Business Insights REST API [gap:shared.analytics.graphql:bi-relationship]: settled by source-read or lab-test. Blocks: telling a caller whether a Business Insights report and a GraphQL query should return the same numbers

Area: shared.analytics, its subjects in references/_meta/spine/shared/shared.analytics.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.analytics.graphql-errors-and-limits.md (Analytics GraphQL errors and rate limits: errors under HTTP 200, status codes, 1,000 calls a second)
- links-to references/_meta/text/shared/shared.analytics.graphql-queries.md (Writing Analytics GraphQL queries: time range, units, limits, filters and open schema questions)
- links-to references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token)
- links-to references/_meta/text/zia/zia.iot.api-surface.md (IoT Report through the API: REST, Z-Insights GraphQL, SDKs, MCP)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/portfolio/portfolio.saas-security-report.md (Shadow IT Report (also SaaS Security Report, ZINS): shadow IT discovery, risk index and API surface)
