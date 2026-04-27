---
product: shared
topic: analytics-graphql
title: "Analytics GraphQL API — ZDX trends + SaaS Security Report"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md"
  - "vendor/zscaler-help/automate-zscaler/guides-analytics-api.md"
  - "vendor/zscaler-help/automate-zscaler/guides-understanding-oneapi.md"
  - "vendor/zscaler-help/automate-zscaler/api-reference-index.md"
  - "vendor/zscaler-help/about-saas-security-report.md"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/zinsights/"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/guides/zscaler-analytics/working-with-zscaler-analytics"
author-status: draft
---

# Analytics GraphQL API — ZDX trends + SaaS Security Report

## Overview

The Zscaler Analytics GraphQL API (internally called **ZInsights**, path prefix `/zins/`) is a GraphQL-only endpoint that powers the trend charts and report dashboards that do not surface through any OneAPI REST path. It is the sole programmatic interface for:

- **ZDX trend data** — the time-series data behind the ZDX Analytics dashboards (web traffic protocols, threat classifications, firewall activity over a chosen time window)
- **ZINS / SaaS Security Report dashboards** — CASB app usage, shadow IT app discovery, cybersecurity incidents, IoT device classification, and Zero Trust Firewall location/action aggregations as displayed in the ZIA Analytics section
- **BI API complement** — the REST-based Business Insights API (`/bi/api/v1`) handles saved report configurations and bulk downloads; the GraphQL API handles live, parameterized, cross-domain queries against the same underlying data warehouse

The endpoint is listed alongside all other OneAPI products at `automate.zscaler.com` and is included in the downloadable OneAPI Postman collection.

### Distinction from related APIs

| API | What it covers | Protocol |
|---|---|---|
| ZDX REST (`/zdx/v1`) | Per-device metrics, alerts, deeptraces, inventory | REST |
| Business Insights (`/bi/api/v1`) | Saved reports, scheduled report configs, bulk download | REST |
| ZInsights GraphQL (`/zins/graphql`) | Trend queries across web traffic, firewalls, SaaS, shadow IT, IoT, cybersecurity | GraphQL |

The ZDX REST API returns device-level and probe-level data. The GraphQL API returns aggregated organizational trend data — suitable for dashboard widgets and executive summaries, not per-device diagnostics.

---

## Endpoints

| Environment | URL |
|---|---|
| Production | `https://api.zsapi.net/zins/graphql` |
| Beta | `https://api.beta.zsapi.net/zins/graphql` |

Both environments accept the same request shape. Introspection (see below) is documented as fully supported in the Beta environment; production introspection behavior is not separately confirmed in captured sources.

**HTTP method:** All requests use `POST`. GraphQL queries and mutations are delivered in the request body as JSON.

---

## Authentication

The GraphQL endpoint uses the same **OneAPI OAuth 2.0 Client Credentials flow** as ZIA, ZPA, and the Business Insights API. There is no separate auth system for ZInsights.

### Token acquisition

```http
POST /oauth2/v1/token HTTP/1.1
Host: <vanity-domain>.zslogin.net
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=<Client ID>
&client_secret=<Client Secret>
&audience=https://api.zscaler.com
```

The `audience` parameter is required. Omitting it produces a token that is rejected at the OneAPI gateway with HTTP 401, even though the token request itself succeeds.

Successful response:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6Ikp...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Using the token

```http
POST /zins/graphql HTTP/1.1
Host: api.zsapi.net
Authorization: Bearer <access_token>
Content-Type: application/json

{ "query": "...", "variables": { ... } }
```

### RBAC prerequisite

The API client must be registered in ZIdentity with a role that grants analytics read access. The default role for this purpose is **Zscaler Insights Reader**. Clients without this role will receive HTTP 403 responses.

For the full OneAPI auth flow (including private-key / JWT variant and gov-cloud limitations) see [`./oneapi.md`](./oneapi.md).

---

## Request shape

Every request is an HTTP POST with a JSON body containing a `query` string and an optional `variables` object:

```json
{
  "query": "query MyQuery($start_time: Long!, $end_time: Long!, $unit: WebTrafficUnits!) { ... }",
  "variables": {
    "start_time": 1743552000000,
    "end_time":   1744761600000,
    "unit": "TRANSACTIONS"
  }
}
```

Key conventions:

- **`start_time` / `end_time`** are Unix milliseconds (type `Long`), not seconds. This differs from the ZDX REST API and ZCC download endpoints, which use seconds.
- **`traffic_unit`** (or `unit`) is an enum (`WebTrafficUnits`). Known values include `TRANSACTIONS` and `BYTES`.
- **`limit`** controls how many entries are returned inside a given sub-query. It is per-sub-query, not a global page size.
- **`filter_by`** accepts strongly typed filter objects (e.g., `StringFilter` with `in: [...]` for name filtering).
- **`categorize_by`** selects the grouping dimension for certain queries (e.g., `LOCATION_ID` for cybersecurity location breakdown).

---

## Schema overview

The schema is organized around **six domain objects** at the top-level query type. Each domain exposes a set of query fields returning aggregated entries.

| Domain | Top-level field | Queries available | Summary |
|---|---|---|---|
| Web Traffic | `WEB_TRAFFIC` | 5 | ZIA web traffic report data: protocols, threat super-categories, threat class, web trends, web protocols |
| SaaS Security | `SAAS_SECURITY` | 1 | CASB data: app usage entries (upload/download bytes, transaction count) by cloud application |
| Cyber Security | `CYBER_SECURITY` | 2 | Cybersecurity incident entries by location or by incident type |
| Zero Trust Firewall | `ZERO_TRUST_FIREWALL` | 5 | Firewall report data: location, action, network service, overall traffic, insights |
| Shadow IT | `SHADOW_IT` | 2 | Unsanctioned app discovery entries and app-level data |
| IoT | `IOT` | 1 | IoT device visibility counts (total, user, IoT, server, unclassified) |

The pattern for all domain queries is:

```graphql
query {
  DOMAIN_NAME {
    query_field(args...) {
      # optional pagination / filter args at this level
      entries(limit: N) {
        id
        name
        total
      }
      obfuscated   # boolean — true when tenant settings mask entry names
    }
  }
}
```

### Obfuscation flag

Several domain queries return an `obfuscated` boolean alongside their `entries` array. When `obfuscated: true`, entry names have been masked by tenant policy (e.g., location or user names replaced with anonymized identifiers). Callers should surface this to end users rather than silently treating the masked names as real values.

### Known GraphQL types (complete list from introspection)

`ActionStatus`, `AppsOnlyResponse`, `AppsResponse`, `CasbAppReport`, `CasbAppReportResponse`, `CasbEntriesFilterBy`, `CasbEntryOrderBy`, `CasbReportDataQuery`, `CyberSecurityEntriesSearchFilterBy`, `CyberSecurityEntryOrderBy`, `CyberSecurityIncidentEntry`, `CyberSecurityIncidentsResponse`, `CyberSecurityIncidentsResponseWithId`, `CyberSecurityReportDataQuery`, `CyberSecurityResponse`, `CyberSecurityResponseId`, `DeviceStat`, `DlpEngineFilter`, `EntriesResponse`, `FirewallActionReport`, `FirewallEntriesFilterBy`, `FirewallEntryOrderBy`, `FirewallInsightsEntry`, `FirewallInsightsReport`, `FirewallInsightUnits`, `FirewallLocationReport`, `FirewallNetworkServiceReport`, `FirewallOverallTrafficReport`, `FirewallReportData`, `FirewallReportDataId`, `FirewallReportDataIsName`, `FirewallReportDataQuery`, `GroupByEntriesResponse`, `IncidentsGroupBy`, `IncidentsWithIdGroupBy`, `IotDataQuery`, `IoTDeviceFilterBy`, `IoTDeviceOrderBy`, `IoTDeviceStat`, `Long`, `ProtocolReportEntry`, `ReportDataWebTrendResponse`, `ShadowITAppsOrderBy`, `shadowITAppsSearchFilterBy`, `ShadowITDashboardResponse`, `shadowITEntriesSearchFilterBy`, `ShadowITEntryOrderBy`, `ShadowITReportDataQuery`, `SortOrder`, `StringFilter`, `SummaryAppCatResponse`, `SummaryOthersResponse`, `ThreatSuperCategoryReportEntry`, `TrendInterval`, `WebEntriesFilterBy`, `WebOrderBy`, `WebProtocolReport`, `WebReportData`, `WebReportDataQuery`, `WebReportDataTrend`, `WebThreatClassResponse`, `WebThreatSuperCategoryReport`, `WebTrafficUnits`, `WebTrend`

### Introspection

Schema introspection is supported. The standard GraphQL introspection query works against the beta environment and can be used to enumerate all available types, fields, and their arguments:

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

In Postman, point the collection variable for the ZInsights endpoint at `https://api.beta.zsapi.net/zins/graphql`, then use the schema explorer (GraphQL mode) to auto-fetch and browse the schema interactively.

---

## Worked examples

### Example 1: Web traffic protocols + threat categories (trend dashboard)

A two-sub-query request combining two `WEB_TRAFFIC` fields into one round trip — the pattern underlying the ZIA Analytics trend widgets.

```graphql
query webTrend(
  $start_time: Long!
  $end_time: Long!
  $unit: WebTrafficUnits!
) {
  WEB_TRAFFIC {
    protocols(
      start_time: $start_time
      end_time: $end_time
      traffic_unit: $unit
    ) {
      entries { name total }
    }
    threat_super_categories(
      start_time: $start_time
      end_time: $end_time
      traffic_unit: $unit
    ) {
      entries { name total }
    }
  }
}
```

Variables:

```json
{
  "start_time": 1743552000000,
  "end_time":   1744761600000,
  "unit": "TRANSACTIONS"
}
```

Returns: a list of protocol names (e.g., `HTTP`, `HTTPS`, `FTP`) with transaction counts, and a list of threat super-category names with their counts, for the specified window.

---

### Example 2: SaaS Security Report — CASB app entries

Pulls the data that populates the Cloud Applications table in the ZIA SaaS Security Report page (Analytics > Internet & SaaS > Analytics > SaaS Security Report).

```graphql
query saasSecurityReport(
  $start_time: Long!
  $end_time: Long!
) {
  SAAS_SECURITY {
    casb_app(start_time: $start_time, end_time: $end_time) {
      obfuscated
      entries { name total }
    }
  }
}
```

Variables:

```json
{
  "start_time": 1743552000000,
  "end_time":   1744761600000
}
```

The `obfuscated` field indicates whether app names are masked. `total` represents the aggregate transaction count for the application. For byte-level breakdown (upload vs. download) the CASB-specific response type `CasbAppReport` is likely used — exact field names should be confirmed via introspection.

---

### Example 3: Threat class filtering (selective threat visibility)

Uses `StringFilter` to return only a subset of threat classes — useful for dashboard widgets that focus on specific threat categories.

```graphql
query threatClassFiltered(
  $start_time: Long!
  $end_time: Long!
  $unit: WebTrafficUnits!
) {
  WEB_TRAFFIC {
    threat_class(
      start_time: $start_time
      end_time: $end_time
      traffic_unit: $unit
    ) {
      entries(
        filter_by: {
          name: { in: ["BEHAVIORAL_ANALYSIS", "ADVANCED"] }
        }
      ) {
        name
        total
      }
    }
  }
}
```

The `in` operator on `StringFilter` accepts an array of exact name strings. Case-sensitivity is unconfirmed in captured sources — use the values as they appear in unfiltered responses.

---

### Example 4: Multi-domain cross-product query

A single request covering four domains simultaneously — the pattern for a consolidated analytics dashboard that mixes firewall, CASB, IoT, and web traffic signals.

```graphql
query partnerPortalQuery(
  $start_time: Long!
  $end_time: Long!
  $unit: WebTrafficUnits!
) {
  WEB_TRAFFIC {
    protocols(end_time: $end_time, start_time: $start_time, traffic_unit: $unit) {
      entries { name total }
    }
    threat_super_categories(end_time: $end_time, start_time: $start_time, traffic_unit: $unit) {
      entries { name total }
    }
  }
  SAAS_SECURITY {
    casb_app(start_time: $start_time, end_time: $end_time) {
      obfuscated
      entries { name total }
    }
  }
  IOT {
    device_stats {
      devices_count
      user_devices_count
      iot_devices_count
      server_devices_count
      un_classified_devices_count
    }
  }
  ZERO_TRUST_FIREWALL {
    location_firewall(start_time: $start_time, end_time: $end_time) {
      obfuscated
      entries(limit: 5) { id name total }
    }
    action(start_time: $start_time, end_time: $end_time) {
      obfuscated
      entries { name total }
    }
  }
}
```

Variables:

```json
{
  "start_time": 1743552000000,
  "end_time":   1744761600000,
  "unit": "TRANSACTIONS"
}
```

Note: `IOT.device_stats` does not take time range arguments in the observed schema — it returns current device counts. All other sub-queries above accept `start_time` and `end_time`.

---

### Example 5: Cybersecurity incidents by location

```graphql
query cyberByLocation {
  CYBER_SECURITY {
    cyber_security_location(
      categorize_by: LOCATION_ID
      start_time: 1743552000000
      end_time:   1744761600000
    ) {
      entries(limit: 10) {
        id
        name
        total
      }
    }
  }
}
```

`categorize_by: LOCATION_ID` groups incident counts by ZIA location. The `id` field can be used to cross-reference against ZIA location IDs from the REST API (`GET /zia/api/v1/locations`).

---

## Pagination

The Analytics GraphQL API does not implement cursor-based or offset-based pagination in the style of the ZIA or ZPA REST APIs. Instead:

- Each sub-query's `entries` field accepts a `limit` integer argument that caps the number of returned entries.
- There is no `pageToken`, `nextCursor`, or `offset` argument visible in captured sources.
- Repeated queries with different time windows are the intended mechanism for temporal slicing.
- The SaaS Security Report UI caps its Cloud Applications table at 50,000 apps — no evidence in captured sources that the API enforces a hard cap below that, but the effective limit is not documented.

For use cases requiring all entries beyond a `limit` value, the approach is to omit the `limit` argument (rely on server-side default) or confirm maximum limits via introspection. The exact server-side default when `limit` is omitted is not confirmed in captured sources.

---

## Rate limits

No rate-limit documentation specific to the GraphQL Analytics endpoint was found in captured sources. The general OneAPI rate-limit guide at `automate.zscaler.com` covers ZIA, ZPA, ZDX, ZCC, Cloud & Branch Connector, and Business Insights — but does not include a ZInsights section.

The endpoint sits behind the same OneAPI gateway as all other products. Applying the general guidance:

- Treat HTTP 429 as a hard signal; implement exponential backoff.
- Monitor response headers on each call for `RateLimit-Remaining` or similar fields (exact header names for ZInsights are unconfirmed).
- Because each POST can carry multiple domain queries in one round trip, batch domain sub-queries within a single request rather than issuing one request per domain.

---

## Error shape

No ZInsights-specific error format is documented in captured sources. GraphQL APIs typically return HTTP 200 for all responses and embed errors in the response body:

```json
{
  "data": null,
  "errors": [
    {
      "message": "...",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["WEB_TRAFFIC", "protocols"]
    }
  ]
}
```

OneAPI gateway-level errors (auth failure, rate limiting) follow the standard OneAPI HTTP status code table and arrive before the GraphQL response layer:

| Code | Meaning |
|---|---|
| 401 | Bearer token missing, expired, or issued without `audience=https://api.zscaler.com` |
| 403 | API client lacks the Zscaler Insights Reader role or equivalent |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Endpoint temporarily unavailable |

For GraphQL-layer errors (malformed query, unknown field, type mismatch), the HTTP status is 200 and the `errors` array in the response body carries the diagnostic.

---

## Relationship to ZDX REST and BI APIs

The three analytics-adjacent APIs serve distinct use cases:

**ZDX REST (`/zdx/v1`):** Device-level and probe-level telemetry. Use for per-user or per-device diagnostics, deeptrace orchestration, and alert triage. Data granularity is at the device or probe level. See [`../zdx/api.md`](../zdx/api.md).

**Business Insights REST (`/bi/api/v1`):** Saved report management. Use to list, configure, and download reports produced by the ZIA Business Insights feature (Application Reports, Workplace Reports, Data Explorer Reports). Reports are asynchronous artifacts — configure them in the UI or via the BI API, then download via `GET /bi/api/v1/report/download`. See the BI API overview at `vendor/zscaler-help/automate-zscaler/api-reference-bi-overview.md`.

**ZInsights GraphQL (`/zins/graphql`):** Aggregated trend and dashboard data. Use for live parameterized queries across web traffic, CASB, shadow IT, IoT, cybersecurity, and firewall domains. No saved-report overhead — submit a query, receive aggregated results directly.

---

## Open questions register

**graphql-01** — Rate limits unconfirmed. The ZInsights endpoint is absent from the OneAPI rate-limiting guide. Whether it shares a bucket with Business Insights or has its own limits, and which response headers carry limit state, is unknown.

**graphql-02** — Introspection on production. Sources confirm introspection on the Beta environment. Production introspection support is not explicitly confirmed or denied. Until verified, treat production introspection as potentially disabled.

**graphql-03** — Pagination mechanism. No cursor or offset pagination is visible in the query examples. Whether `limit`-only is the intended design, or whether the API silently truncates results above some undocumented cap, is not confirmed.

**graphql-04** — `obfuscated` flag behavior. The flag is present on CASB, firewall location, and other domain responses. The exact tenant setting that enables obfuscation (e.g., a ZIA privacy setting) is not identified in captured sources. Callers should handle both `true` and `false` states defensively.

**graphql-05** — IoT `device_stats` time range. The multi-domain example shows `device_stats` called without time range arguments, while all other sub-queries take `start_time`/`end_time`. Whether `device_stats` is genuinely time-agnostic or has an implicit window is not confirmed.

**graphql-06** — ZDX trend linkage. The captured source names the ZDX trends dashboard as a consumer of this API, but no ZDX-specific domain or field is visible in the schema — the web traffic and firewall domains are ZIA-sourced. The exact mechanism by which ZDX Analytics trend data surfaces (same endpoint, separate domain not yet captured, or a different path) is unresolved.

**graphql-07** — Mutation support. The introspection query template retrieves `mutationType { name }`, implying mutations may exist. No mutation examples are present in captured sources. Whether any write operations are exposed (e.g., configuring report parameters) is unknown.

**graphql-08** — `BYTES` unit behavior. The `WebTrafficUnits` enum is documented as having at least `TRANSACTIONS`. A `BYTES` value is implied by the SaaS Security Report UI (which shows Total Bytes, Upload Bytes, Download Bytes) but is not confirmed as a valid enum value in the API.

---

## Cross-links

- OneAPI auth and gateway reference — [`./oneapi.md`](./oneapi.md)
- ZDX REST API (device-level data) — [`../zdx/api.md`](../zdx/api.md)
- SaaS Security Report (UI context) — `vendor/zscaler-help/about-saas-security-report.md`
- Business Insights API (saved reports) — `vendor/zscaler-help/automate-zscaler/api-reference-bi-overview.md`
- GraphQL source capture — `vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md`
- Analytics API guide capture — `vendor/zscaler-help/automate-zscaler/guides-analytics-api.md`
- Upstream reference — `https://automate.zscaler.com/docs/api-reference-and-guides/graphql-api-references/zinsights/`
