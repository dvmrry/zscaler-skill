---
product: business-insights
topic: overview
title: "Business Insights — SaaS usage analytics and workplace utilization"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/bi-what-zscaler-business-insights.md"
author-status: draft
---

# Business Insights — SaaS usage analytics and workplace utilization

## What it is

Business Insights is a Zscaler product that provides visibility into two distinct domains:

1. **SaaS Application Management**: Which licensed SaaS apps are actually being used, by whom, how often, and at what cost. Enables license right-sizing, shadow IT discovery, and spend optimization across the application portfolio.
2. **Workplace and Workforce Management**: Office utilization data — who is in the office, when, at which location — to support return-to-office strategy, capacity planning, and hybrid work analytics.

It is not a security product. Business Insights is a business analytics product that happens to be powered by Zscaler's network visibility. Audience is IT leadership, finance, HR, and workplace/facilities teams in addition to security admins (Tier A — vendor/zscaler-help/bi-what-zscaler-business-insights.md).

## Prerequisites

- SaaS app insights require ZIA subscription
- Workplace insights require ZIA plus ZCC deployed on relevant endpoints

## Data sources

Business Insights ingests from four sources:

| Source | Type | Data contributed |
|---|---|---|
| **ZIA** | Zscaler-native | Web traffic analysis — discovers app usage from network traffic |
| **Identity Providers** | Third-party (Okta, Entra ID) | Login data, user identity, authentication events |
| **SaaS app connectors** | Direct API integrations | Per-app: license counts, engagement, subscription details |
| **Custom application signatures** | Admin-configured | Coverage for apps not in Zscaler's catalog |

### Supported SaaS app connectors

Okta, Microsoft 365, Salesforce, ServiceNow, Slack, Box, Google Workspace, GitHub.

### App discovery scale

Zscaler can discover usage of over 30,000 apps via ZIA traffic analysis. By default only a business-relevant subset is shown in the portal.

## Key capabilities

### SaaS Application Management

- **Engagement metrics**: Usage frequency, active vs. inactive users, usage by department
- **Spending insights**: Contract costs, license plans, start/end dates, per-seat cost
- **License optimization**: Identifies over-provisioned licenses; supports right-sizing at renewal
- **Shadow IT discovery**: Surfaces apps purchased by departments or individuals outside IT control
- **Portfolio overlap detection**: Identifies apps with overlapping functionality that could be consolidated
- **Instant discovery**: Metrics available as soon as an app is configured

### Workplace & Workforce Management

- **In-office vs. hybrid vs. remote tracking**: Per employee, per department, per location
- **Hour-by-hour utilization**: Fine-grained time-series data, not just daily counts
- **Capacity planning**: Which office locations are underused or overused
- **Weekly/monthly/quarterly trends**: Multi-cadence reporting for planning cycles
- **Cost savings modeling**: Predictive models for cost reduction through occupancy optimization

## Admin portal

The Business Insights Admin Portal is a separate console from the ZIA/ZPA admin portals. It has its own authentication, user accounts, and RBAC (system roles + custom roles). Navigation: accessible via the Zscaler Experience Center or directly.

## API surface

The help portal does not prominently document a public API for Business Insights. The product is primarily portal-driven. No API reference was found in available sources — treat as console-only unless confirmed otherwise.

## How it relates to ZIA

Business Insights does not proxy or inspect traffic itself. It uses the traffic logs and metadata already captured by ZIA as its primary signal. The relationship is read-only: Business Insights consumes ZIA data; it does not write policies or change ZIA configuration.

## What Business Insights is not

- Not a CASB or DLP product. It does not enforce data security policies.
- Not a real-time monitoring tool. It provides analytics over historical traffic data.
- Not limited to Zscaler-managed apps — shadow IT discovery specifically surfaces non-IT-sanctioned app usage.
- Not the same as ZIA reporting/analytics. Business Insights is a dedicated product with its own portal, not just a tab in ZIA.

## Operational notes

- License overlap detection is actionable: it can identify when an org pays for both Slack and Teams at full capacity, for example.
- The workplace utilization feature requires ZCC because ZIA alone cannot determine physical office presence — ZCC location signals are needed.
- The 30K+ app discovery capability comes from ZIA's URL/app categorization; Business Insights adds the business-context layer (cost, license plans, IdP login correlation) on top.

## Common questions

- **"What is Business Insights?"** → A Zscaler analytics product for SaaS app usage analytics (license optimization, shadow IT, spend) and workplace utilization metrics (hybrid/remote/in-office tracking).
- **"Does Business Insights require ZIA?"** → Yes. ZIA is required for the traffic analysis that powers SaaS app discovery. Without ZIA, Business Insights has no network signal.
- **"Does Business Insights require ZCC?"** → Only for workplace utilization features. SaaS app analytics work with ZIA alone.
- **"Can Business Insights see which users are using Microsoft 365?"** → Yes, via the M365 SaaS app connector plus ZIA traffic — it can show per-user engagement, license usage, and inactive users.
- **"Is Business Insights a security product?"** → Not primarily. It is a business analytics product. The security team may use it for shadow IT visibility, but the primary value is cost optimization and workplace planning.
- **"Does Business Insights have an API?"** → Not confirmed in available sources. Treat as portal-only unless your Zscaler TAM confirms an API exists.

## Licensing and availability

Business Insights is a separate SKU from ZIA. Specific pricing tiers are not publicly documented. The product requires ZIA as a dependency. Confirm licensing requirements with your Zscaler account team before deploying.

## Terminology disambiguation

- **Business Insights** (this product) — SaaS spend/usage analytics and workplace utilization
- **Executive Insights** — A different Zscaler surface within Experience Center for executive-audience dashboards (not the same product)
- **ZIA Analytics** — Raw traffic analytics available within ZIA admin portal; different from Business Insights' business-context layer

## Cross-links

- ZIA (source of network traffic data that Business Insights analyzes): [`../zia/index.md`](../zia/index.md)
- ZCC (required for workplace utilization feature): [`../zcc/index.md`](../zcc/index.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
