# Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources (business-insights.overview)
Also called: business insights; zscaler business insights; saas usage analytics; workplace utilization; office utilization; shadow it spend; license rightsizing

Business Insights gives visibility into an organization's SaaS application usage and spending, along with workplace metrics. [business-insights.overview:purpose]

**SaaS applications.** For SaaS applications it offers instant discovery, engagement data (engagement ratio, spending trends, saving opportunities, inactive users, usage by department), Shadow IT spending, visibility of all applications including overlaps, and cost control. [business-insights.overview:saas-features] Usage data is meant to help renew the correct number of licenses; Zscaler's example is an organization that bought more Microsoft 365 licenses than required analyzing how many are actually used and then reducing the number during the renewal process. [business-insights.overview:license-example]

**Workplace.** For the workplace it shows days in the office versus hybrid versus remote and which departments come in most, predictive cost-saving models, hour-by-hour office utilization with weekly, monthly and quarterly data across office locations, and workplace and workforce metrics. [business-insights.overview:workplace-features]

**Prerequisites.** SaaS app insights require an Internet & SaaS subscription; workplace insights also require Client Connector deployed on all the endpoints to be tracked for office utilization. [business-insights.overview:prerequisites]

**Data sources.** Business Insights receives signals from 4 data sources; the architecture article names Internet & SaaS, identity providers such as Okta and Entra ID, and SaaS application connector integrations (for apps such as Okta, M365, Salesforce, ServiceNow, Slack, Box, Google and GitHub). [business-insights.overview:data-sources] The onboarding article names four Business Insights data sources: Internet & SaaS (ZIA), identity providers, direct SaaS application connector integrations, and custom application signatures. [business-insights.overview:fourth-source-custom-signatures] Business Insights presents app usage and workplace data by analyzing Internet & SaaS traffic, identity provider login data, or API integrations (direct app connectors). [business-insights.overview:usage-inputs] It distinguishes subscribed apps from used apps through metadata fields for subscription details such as cost, license plans and contract start and end dates, all of which can be filtered for reports. [business-insights.overview:subscribed-vs-used] Zscaler can discover the usage of over 30K apps, but by default the portal shows only a subset chosen by business relevance. [business-insights.overview:discovery-scale]

**Where the details are.** Application Insights, the All Applications list and application details are in [Business Insights Application Insights: discovered apps, overlap, cost savings, All Applications and application details](kb:business-insights.applications). Connecting an application is in [Onboarding a SaaS application to Business Insights: connector or plan information, and per-application prerequisites](kb:business-insights.onboarding). Workplace Insights, discovered locations and the map and chart views are in [Business Insights Workplace Insights: discovered locations, map and chart views, workplace details, filters and occupancy and attendance formulas](kb:business-insights.workplace), configured offices and their occupancy and attendance goals are in [Business Insights offices: configuring an office and organization- and office-level occupancy and attendance goals](kb:business-insights.offices), and scheduled reports, the exclusion list and Data Explorer are in [Business Insights scheduled reports: workplace, application and Data Explorer reports, and the exclusion list](kb:business-insights.reports).

The API is in [The Business Insights API: custom applications, report configurations and report downloads](kb:business-insights.api); the separate Z-Insights analytics API is in [The Analytics (Z-Insights) GraphQL API: endpoint, access and scope](kb:shared.analytics.graphql).

**Legacy version.** The legacy Business Insights help is in [Legacy Business Insights help: architecture, data sources and terminology (hub)](kb:business-insights.legacy).

What to check:
1. Whether the tenant has Internet & SaaS, and for workplace insights Client Connector on the endpoints to be tracked.

Area: business-insights.overview, its subjects in references/_meta/spine/business-insights/business-insights.overview.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zcc/zcc.install.md (Client Connector install parameters and deployment): SaaS app insights require an Internet & SaaS subscription; workplace insights also require Client Connector deployed on all the endpoints to be tracked for office utilization. [business-insights.overview:prerequisites]
- links-to references/_meta/text/business-insights/business-insights.api.md (The Business Insights API: custom applications, report configurations and report downloads)
- links-to references/_meta/text/business-insights/business-insights.applications.md (Business Insights Application Insights: discovered apps, overlap, cost savings, All Applications and application details)
- links-to references/_meta/text/business-insights/business-insights.legacy.md (Legacy Business Insights help: architecture, data sources and terminology (hub))
- links-to references/_meta/text/business-insights/business-insights.offices.md (Business Insights offices: configuring an office and organization- and office-level occupancy and attendance goals)
- links-to references/_meta/text/business-insights/business-insights.onboarding.md (Onboarding a SaaS application to Business Insights: connector or plan information, and per-application prerequisites)
- links-to references/_meta/text/business-insights/business-insights.reports.md (Business Insights scheduled reports: workplace, application and Data Explorer reports, and the exclusion list)
- links-to references/_meta/text/business-insights/business-insights.workplace.md (Business Insights Workplace Insights: discovered locations, map and chart views, workplace details, filters and occupancy and attendance formulas)
- links-to references/_meta/text/shared/shared.analytics.graphql.md (The Analytics (Z-Insights) GraphQL API: endpoint, access and scope)
