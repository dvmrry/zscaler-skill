# What Is Zscaler Business Insights?

**Source:** https://help.zscaler.com/business-insights/what-zscaler-business-insights
**Captured:** 2026-04-28 via Playwright MCP

---

Zscaler Business Insights provides 360-degree visibility into your organization's SaaS application usage and spending insights, along with workplace metrics to help you save money and manage your workplace efficiently.

## SaaS Application Management

Business Insights serves as a centralized engagement interface for all your licensed applications. By analyzing your application usage trends with Business Insights, you're equipped with accurate data to renew the correct number of licenses required by your organization.

Key Features and Benefits for application landscape:

- **Instant Discovery**: Configure your applications and start viewing their metrics instantly.
- **Engagement Data**: Glance into the application's engagement ratio, spending trends, saving opportunities, inactive user data, usage by department, etc.
- **Shadow IT**: View and calculate spending on Shadow IT applications purchased by departments or users within your organization.
- **SaaS Visibility**: Experience total visibility into your application landscape. View the list of all your applications in one place, including overlaps.
- **Cost Control**: Reduce unnecessary and redundant application expenses.

## Office Workplace & Workforce Management

Business Insights provides a better way to access workplace insights and visualize the trends granularly. HR and Workplace & Facilities leaders can conduct data-based office capacity planning and understand hour-by-hour office utilization down to department and employee levels.

Key Features and Benefits for office workplace utilization:

- **Workplace Insights**: Optimize office overheads with details on what days workers spend in the office vs. hybrid vs. remote.
- **Cost Control**: Rich insights and predictive cost-saving models.
- **Back-to-Office Strategy**: Leverage hour-by-hour office utilization data.
- **Workplace and Workforce Metrics**: Graphs and metrics for utilization tracking.

# Understanding Business Insights Architecture

**Source:** https://help.zscaler.com/business-insights/understanding-business-insights-architecture
**Captured:** 2026-04-28 via Playwright MCP

---

Business Insights receives signals and data from 4 data sources:

1. **Zscaler Internet Access (ZIA) service** — primary input feeder
2. **Identity providers (IdPs)** — Okta, Entra ID (login data)
3. **SaaS application connector integrations** — supported apps: Okta, M365, Salesforce, ServiceNow, Slack, Box, Google, GitHub
4. **Custom application signatures**

## Prerequisites

- To gain SaaS app insights: must be subscribed to ZIA
- To gain workplace insights: ZIA plus Zscaler Client Connector deployed on all relevant endpoints

## Discovery Scale

Zscaler can discover the usage of over 30K apps. By default, only a subset of these apps are shown in the portal, depending on business relevance.

## Key Data Capabilities

Business Insights can differentiate between subscribed apps vs. used apps by populating metadata fields that show subscription details: cost, license plans, contract start dates, end dates, etc.
