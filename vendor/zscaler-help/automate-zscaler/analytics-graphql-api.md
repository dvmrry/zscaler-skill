# Analytics API Reference - Zscaler Analytics GraphQL | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/zinsights/
**Captured:** 2026-04-24 via Playwright MCP.

---

## Overview

Zscaler Analytics GraphQL API for analytics and reporting.

**Endpoint:** `https://api.zsapi.net/zins/graphql`

**Authentication:** Bearer token in Authorization header:
```
Authorization: Bearer YOUR_BEARER_TOKEN
```

## API Domains

| Domain | Description | Queries |
|--------|-------------|---------|
| SaaS Security | CASB data (Cloud Access Security Broker) - data and threat protection for data at rest in cloud services | 1 |
| Cyber Security | Cybersecurity incident data and policies, networks, devices protection | 2 |
| Zero Trust Firewall | Zero Trust Firewall report data (location, action, etc.) | 5 |
| IOT | IoT device visibility and classification data | 1 |
| Shadow IT | Unsanctioned apps discovery data | 2 |
| Web Traffic | ZIA web traffic report data (protocols, threat categories) | 5 |

## Usage Pattern

```graphql
query {
  DOMAIN_NAME {
    # Domain-specific queries here
  }
}
```

## Domain Pages

- SaaS Security: https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/zinsights/domains/saas-security/
- Cyber Security: https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/zinsights/domains/cyber-security/
- Zero Trust Firewall: https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/zinsights/domains/zero-trust-firewall/
- IOT: https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/zinsights/domains/iot/
- Shadow IT: https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/zinsights/domains/shadow-it/
- Web Traffic: https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/zinsights/domains/web-traffic/

## Schema Introspection

```graphql
query IntrospectionQuery {
  __schema {
    queryType { name }
    mutationType { name }
    types {
      name
      kind
      description
    }
  }
}
```

## Available Types

ActionStatus, AppsOnlyResponse, AppsResponse, CasbAppReport, CasbAppReportResponse, CasbEntriesFilterBy, CasbEntryOrderBy, CasbReportDataQuery, CyberSecurityEntriesSearchFilterBy, CyberSecurityEntryOrderBy, CyberSecurityIncidentEntry, CyberSecurityIncidentsResponse, CyberSecurityIncidentsResponseWithId, CyberSecurityReportDataQuery, CyberSecurityResponse, CyberSecurityResponseId, DeviceStat, DlpEngineFilter, EntriesResponse, FirewallActionReport, FirewallEntriesFilterBy, FirewallEntryOrderBy, FirewallInsightsEntry, FirewallInsightsReport, FirewallInsightUnits, FirewallLocationReport, FirewallNetworkServiceReport, FirewallOverallTrafficReport, FirewallReportData, FirewallReportDataId, FirewallReportDataIsName, FirewallReportDataQuery, GroupByEntriesResponse, IncidentsGroupBy, IncidentsWithIdGroupBy, IotDataQuery, IoTDeviceFilterBy, IoTDeviceOrderBy, IoTDeviceStat, Long, ProtocolReportEntry, ReportDataWebTrendResponse, ShadowITAppsOrderBy, shadowITAppsSearchFilterBy, ShadowITDashboardResponse, shadowITEntriesSearchFilterBy, ShadowITEntryOrderBy, ShadowITReportDataQuery, SortOrder, StringFilter, SummaryAppCatResponse, SummaryOthersResponse, ThreatSuperCategoryReportEntry, TrendInterval, WebEntriesFilterBy, WebOrderBy, WebProtocolReport, WebReportData, WebReportDataQuery, WebReportDataTrend, WebThreatClassResponse, WebThreatSuperCategoryReport, WebTrafficUnits, WebTrend
