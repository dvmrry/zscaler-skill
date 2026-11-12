# The Business Insights API: custom applications, report configurations and report downloads (business-insights.api)
Also called: business insights api; client.zbi; zbi python sdk; bi api; custom apps api; customapps; report configs; bi report download
Former IDs: business-insights-01

Paths and Python methods are generated: `node scripts/kb.mjs surface bi`; the Go SDK and the Terraform providers have no Business Insights entries there. In the Python SDK this API is `client.zbi`, which is not browser isolation: [In the Python SDK, the `zbi` service client is Zscaler Business Insights, not browser isolation.](kb:shared.terminology.product-names:zbi-is-business-insights).

**Host.** The contract's server URL for the Business Insights public API is `https://api.zsapi.net/bi`. [business-insights.api:base-url] The Python SDK sends `/bi` requests to the OneAPI gateway base URL: the dedicated gateway for a government cloud, `https://api.{self.cloud}.zsapi.net` for any other non-production cloud, and `https://api.zsapi.net` (the default `BASE_URL`) otherwise. [business-insights.api:python-routing]

**Custom applications.** Only HOST-based custom applications are supported through the public API, not URL-based ones; each needs at least 1 and at most 50 HOST signatures with valid hostnames, a name unique across custom apps, and a required description of at most 1024 characters without < or >, and there is a global limit of 1000 host-based custom apps. [business-insights.api:custom-app-limits] Listing custom applications with the `id` query parameter returns only that application, still in an array, and Python's `get_custom_app` uses this form and takes the first element. [business-insights.api:custom-app-get-by-id] Deleting a custom application also deletes any scheduled report associated with it. [business-insights.api:custom-app-delete-cascade]

**Reports.** Report configurations support only the `customapps` report type, which is also the Python SDK's default `report_type`. [business-insights.api:report-type-customapps] Listing reports takes a reportType of APPLICATION, WORKPLACE or DATA_EXPLORER and an optional subType that defaults to CustomDataFeed (custom app lists), with ScheduledReports and SaveAndSchedule (data explorer) as the other values. [business-insights.api:report-list-types] Downloading a report returns text/csv by default, or application/octet-stream when gzip compression is requested. [business-insights.api:report-download]

**Z-Insights.** The Python SDK keeps Z-Insights, the GraphQL Analytics API, as a separate `zins` service that does not support legacy client authentication, next to the Business Insights REST service `zbi`. [business-insights.api:zins-separate] The MCP server's Z-Insights tools explain a GraphQL INTERNAL_ERROR as possibly meaning no data for the query type or that Z-Insights or Business Insights is not licensed on the tenant. [business-insights.api:mcp-licensing-message] The Analytics API itself is in [The Analytics (Z-Insights) GraphQL API: endpoint, access and scope](kb:shared.analytics.graphql).

Whether other Business Insights functions have public APIs is open [gap:business-insights.api:api-coverage].

What to check:
1. Whether a custom application uses only HOST signatures and stays within 50 per app and 1000 apps in all.
2. Whether deleting a custom application will also delete a scheduled report tied to it.

Not known (open gaps):
- Business Insights functions with no public API [gap:business-insights.api:api-coverage]: settled by source-read. Blocks: automating Business Insights beyond custom apps and reports

Area: business-insights.api, its subjects in references/_meta/spine/business-insights/business-insights.api.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/shared/shared.oneapi.base-urls.md (OneAPI hosts and per-product base paths): The Python SDK sends `/bi` requests to the OneAPI gateway base URL: the dedicated gateway for a government cloud, `https://api.{self.cloud}.zsapi.net` for any other non-production cloud, and `https://api.zsapi.net` (the default `BASE_URL`) otherwise. [business-insights.api:python-routing]
- links-to references/_meta/text/shared/shared.analytics.graphql.md (The Analytics (Z-Insights) GraphQL API: endpoint, access and scope)
- links-to references/_meta/text/shared/shared.terminology.product-names.md (Product names and SDK or API names with a source: Internet & SaaS, Private Access, Zscaler App, Zero Trust Browser, ZBI, ZGuard, ecgroup, deep trace, ZTC)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/business-insights/business-insights.overview.md (Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources)
- see-also references/_meta/text/zbi/zbi.api.md (Automating browser isolation: where the API surface lives across Internet & SaaS and Private Access)
