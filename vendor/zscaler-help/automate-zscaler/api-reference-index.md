# API Reference Index | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/UnderstandingOneAPI
**Captured:** 2026-04-24 via Playwright MCP.

---

## API Products and Base URLs

| API Product | Base Path(s) | Base URL(s) |
|-------------|--------------|-------------|
| ZIA (Zscaler Internet Access) | /zia/api/v1 | https://api.zsapi.net/zia/api/v1 |
| ZPA (Zscaler Private Access) | /zpa/mgmtconfig/v1, /zpa/mgmtconfig/v2, /zpa/userconfig/v1 | https://api.zsapi.net/zpa/mgmtconfig/v1, /v2, /userconfig/v1 |
| ZDX (Zscaler Digital Experience) | /zdx/v1 | https://api.zsapi.net/zdx/v1 |
| ZIdentity | /ziam/admin/api/v1 | https://api.zsapi.net/ziam/admin/api/v1 |
| ZCC (Zscaler Client Connector) | /zcc/papi/public/v1 | https://api.zsapi.net/zcc/papi/public/v1 |
| ZTW (Zscaler Cloud & Branch Connector) | /ztw/api/v1 | https://api.zsapi.net/ztw/api/v1 |
| BI (Business Insights) | /bi/api/v1 | https://api.zsapi.net/bi/api/v1 |
| Zscaler Analytics (GraphQL) | /zins/graphql | https://api.zsapi.net/zins/graphql |

**Beta environment:** Use `api.beta.zsapi.net` instead of `api.zsapi.net`

## API Coverage on automate.zscaler.com

Products with documented API references (500+ endpoint pages):
- **ZIA** - Extensive: Admin Role Management, Activation, Alerts, Authentication, Authentication Settings, Bandwidth Control, Browser Control, Browser Isolation, Cloud App Control Policy, Cloud Applications, Cloud NSS, Data Loss Prevention, Device Groups, DNS Control, End User Notifications, Event Logs, File Type Control, Firewall Policies, and many more
- **ZCC** - Credential Controller, Login Controller, Public API Controller (devices, policies, profiles, trusted networks, admin users, applications, credentials, entitlements, reporting)
- **ZDX** - Administration, Alerts, API Authentication, Inventory, Reports, Troubleshooting, Snapshots
- **ZCloudConnector** - Activation, Admin & Role Management, Authentication, Cloud Branch Connector Groups, DNS Control, DNS Gateway, Forwarding Gateways, Location Management, Log & Control Forwarding, Partner Integrations (AWS), Policy Management, Policy Resources, Private APIs, Provisioning
- **BI** - Custom Applications, Report Configurations, Reports
- **Zscaler Analytics** - GraphQL API with domains: SaaS Security, Cyber Security, Zero Trust Firewall, IoT, Shadow IT, Web Traffic

**Note:** ZPA and ZIdentity are referenced in sidebar navigation but their pages were not found in the sitemap crawl. ZPA APIs are mentioned in the Getting Started page (base URLs: `/zpa/mgmtconfig/v1`, `/zpa/mgmtconfig/v2`, `/zpa/userconfig/v1`).

## Sitemap URL Count

500+ individual endpoint documentation pages at:
`https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/{product}/{category}/{endpoint-slug}`

## Postman Collection

**Download:** https://automate.zscaler.com/downloads/OneAPI_postman_collection_03_05_2026.json

## Key Guide Pages

- Getting Started: https://automate.zscaler.com/docs/getting-started/getting-started
- Understanding OneAPI: https://automate.zscaler.com/docs/api-reference-and-guides/guides/UnderstandingOneAPI
- Rate Limiting Overview: https://automate.zscaler.com/docs/api-reference-and-guides/guides/rate-limiting/overview
- Response Codes: https://automate.zscaler.com/docs/api-reference-and-guides/guides/response-codes/oneapi
- Postman Setup: https://automate.zscaler.com/docs/tools/postman/installing-configuring-postman
- Analytics API: https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/
