# Working with the Zscaler Analytics API | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/guides/zscaler-analytics/working-with-zscaler-analytics
**Captured:** 2026-04-24 via Playwright MCP.

---

Zscaler Analytics API implements GraphQL-based architecture and can be accessed via the Zscaler OneAPI gateway. It integrates with ZIdentity for authorization and role-based access control.

## Endpoints

- **Production:** `https://api.zsapi.net/zins/graphql`
- **Beta:** `https://api.beta.zsapi.net/zins/graphql`

## Authentication

Uses the same OAuth 2.0 Client Credentials flow as all OneAPI endpoints.

Token endpoint: `https://<ZIdentity-Tenant-Domain>/oauth2/v1/token`

Required parameters:
- `audience`: `https://api.zscaler.com` (must be in request body)

## Prerequisites

- Register API client in ZIdentity with appropriate role
- Default role available: **Zscaler Insights Reader**

## Schema Introspection

GraphQL introspection is supported (Beta cloud environment only). In Postman, introspection auto-fetches the schema and displays available data fields in an interactive schema explorer.

## Multi-Domain Query Example

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
       threat_class(end_time: $end_time, start_time: $start_time, traffic_unit: $unit) {
           entries(filter_by: { name: { in: ["BEHAVIORAL_ANALYSIS", "ADVANCED"] } }) {
               name total
           }
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
  "end_time": 1744761600000,
  "unit": "TRANSACTIONS"
}
```

## Single Domain Query Example (Cybersecurity)

```graphql
query {
  CYBER_SECURITY {
    cyber_security_location(
      categorize_by: LOCATION_ID,
      start_time: 1743552000000,
      end_time: 1744761600000
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
