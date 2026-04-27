---
product: shared
topic: audit-logs
title: "Cross-product audit log framework"
content-type: reference
last-verified: "2026-04-26"
confidence: medium
source-tier: code
sources:
  - "references/zia/audit-logs.md"
  - "references/zpa/audit-logs.md"
  - "references/zwa/audit-logs.md"
  - "vendor/zscaler-help/about-log-streaming-service.md"
  - "vendor/zscaler-help/understanding-nanolog-streaming-service.md"
  - "vendor/zscaler-help/admin-rbac-captures.md"
  - "vendor/zscaler-help/cbc-about-log-and-control-forwarding.md"
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/adminauditlogs/adminauditlogs.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/eventlogentryreport/eventlogentryreport.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go"
  - "references/shared/admin-rbac.md"
author-status: draft
---

# Cross-product audit log framework

This document provides a cross-product view of the "who changed what config when" surface across the Zscaler portfolio. It identifies which products have admin audit logs, the access mechanisms available (portal, API, SDK, streaming), retention periods, and where gaps exist. Per-product detail is in the product-specific files linked below.

## Per-product reference documents

- ZIA admin audit logs: [`../zia/audit-logs.md`](../zia/audit-logs.md)
- ZPA admin audit logs: [`../zpa/audit-logs.md`](../zpa/audit-logs.md)
- ZWA customer audit logs: [`../zwa/audit-logs.md`](../zwa/audit-logs.md)

---

## Cross-product comparison matrix

| Product | Admin audit available? | Device/system events? | API access? | SIEM streaming? | Retention | Source |
|---------|----------------------|----------------------|-------------|-----------------|-----------|--------|
| **ZIA** | Yes — every portal action and API call | Yes — Event Log Entry Report (system events) | Yes — async report API (`/auditlogEntryReport`) + CSV download | Not confirmed via NSS | 6 months | `vendor/zscaler-help/admin-rbac-captures.md`; `vendor/zscaler-sdk-go/zscaler/zia/services/adminauditlogs/adminauditlogs.go` |
| **ZPA** | Yes — admin console sessions and config changes | No separate device event log in audit context | LSS streaming to SIEM only; no pull-based report API | Yes — LSS (`zpn_audit_log`) to SIEM over TCP | 6 months | `vendor/zscaler-help/about-log-streaming-service.md` |
| **ZWA** | Yes — every admin portal action and API call | No | Yes — POST-based filter API (`/zwa/dlp/v1/customer/audit`) | Not confirmed | Not confirmed | `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go` |
| **ZDX** | No admin audit log found | Yes — device events (Zscaler, hardware, software, network changes) | Yes — GET per-device events (`/zdx/v1/reports/devices/{id}/events`) | No streaming found | Defaults to last 2 hours if unspecified | `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go` |
| **ZCC** | No admin audit log found in SDK/sources | No | No audit API found | No | Unknown | Exhaustive grep found only admin-role management endpoints, no audit endpoints |
| **Cloud Connector (ZTW)** | No admin audit log found | No | No audit API found | No | Unknown | Log and Control Forwarding policy handles traffic/control channel routing, not admin audit |
| **ZIdentity** | Audit Logs module exists (view-only permission model) | No | Not exposed in available Go/Python SDK sources | No | Unknown | `vendor/zscaler-help/admin-rbac-captures.md` |

**Note on ZDX device events:** These are not admin config-change events; they record endpoint state transitions (Zscaler, hardware, software, network changes) for a specific device. They answer "what changed on this device" rather than "what did an admin change in the portal." They are included because they are the closest analog to a change audit in the ZDX surface.

---

## ZIA audit architecture

ZIA has the most complete audit API:

- **Two distinct log types**: Admin Audit Log (config changes by admins) and Event Log (system events).
- **Async report model**: POST to trigger, GET to poll, GET `/download` for CSV, DELETE to cancel.
- **Filter dimensions**: admin name, object name, action interface (UI/API), category, subcategories, action result (success/failure), action types, client IP, time range, page/pageSize.
- **`authType` field** in audit events distinguishes session source: standard login, SAML SSO, Zscaler Support access (full/partial/read-only), partner access, mobile app token. This enables isolation of support-access activity during change investigations.

The audit log API requires the **Reports** functional scope on the admin account. The Cloud Service API must be enabled by Zscaler Support for the tenant.

Full detail: [`../zia/audit-logs.md`](../zia/audit-logs.md)

---

## ZPA audit architecture: LSS

ZPA routes audit logs through the Log Streaming Service (LSS) rather than a dedicated pull-based API:

- **Log type**: `zpn_audit_log`
- **Delivery**: push-based, from App Connector to a SIEM log receiver over TCP (optionally mutual TLS)
- **Special delivery guarantee**: audit logs are the only LSS log type that receives retransmission handling during App Connector connectivity interruptions. Other log types (user activity, user status, app connector status) do not retransmit data generated during a connection loss between App Connector and SIEM. Audit logs do retransmit the last 15 minutes after connection restoration, though delivery is still "not guaranteed."
- **Retention in cloud**: 6 months. LSS is necessary to retain beyond that window.
- **Formats**: JSON, CSV, TSV (selectable per receiver configuration)
- **Provisioned via**: Terraform (`zpa_lss_config_controller`), Go SDK (`lssconfigcontroller` package), Python SDK (`client.zpa.lss`)

Full detail: [`../zpa/audit-logs.md`](../zpa/audit-logs.md)

---

## ZWA audit architecture

ZWA has a direct query API for customer audit logs:

- **Access model**: POST filter with `fields` (Action, Resource, Admin, Module) and `timeRange` filters
- **Before/after snapshots**: `oldRowJson` and `newRowJson` fields in each log entry provide JSON snapshots of the resource state before and after the change — the richest diff model in the portfolio
- **Pagination**: cursor-based with `page`, `pageSize`, and `pageId` parameters
- **Admin attribution**: `changedBy` field on each log entry

Full detail: [`../zwa/audit-logs.md`](../zwa/audit-logs.md)

---

## ZDX device events (not admin audit)

ZDX exposes per-device event metrics at `/zdx/v1/reports/devices/{deviceId}/events`. These record endpoint-side state changes:

```go
type Events struct {
    Category    string `json:"category,omitempty"`
    Name        string `json:"name,omitempty"`
    DisplayName string `json:"display_name,omitempty"`
    Prev        string `json:"prev,omitempty"`
    Curr        string `json:"curr,omitempty"`
}
```

Event categories: Zscaler, Hardware, Software, and Network changes. The `Prev` and `Curr` fields capture what a device property changed from and to. Default time window is 2 hours if no `from`/`to` is supplied.

This is a device telemetry feed, not an admin audit trail. It answers "what changed on the endpoint" — useful for correlating network or software changes with degraded user experience.

Source: `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go`

---

## NSS vs LSS roles in audit log delivery

| Mechanism | Product | What it streams | Audit log role |
|-----------|---------|-----------------|---------------|
| **NSS (Nanolog Streaming Service)** | ZIA | Web, firewall, DNS traffic logs | Does NOT stream admin audit logs |
| **LSS (Log Streaming Service)** | ZPA | User activity, user status, app connector status, **audit logs**, and more | Streams `zpn_audit_log` to SIEM |
| **ZWA audit API** | ZWA | Customer audit logs via POST query | Pull-based only; no streaming |
| **ZIA audit API** | ZIA | Admin audit log + event log via async report | Pull-based CSV download; no push |

NSS operates in ZIA and streams traffic logs. It has no connection to admin audit logs.
LSS operates in ZPA and streams multiple log types including audit logs.
There is no unified cross-product log streaming bus for admin audit logs.

Source: `vendor/zscaler-help/understanding-nanolog-streaming-service.md`; `vendor/zscaler-help/about-log-streaming-service.md`

---

## ZIdentity and audit log federation

ZIdentity serves as the identity plane for ZIA and ZPA in modern (OneAPI) deployments. Per `vendor/zscaler-help/admin-rbac-captures.md`:

- ZIdentity has an **Audit Logs** module in its permission matrix. Admins must have at minimum view-only access to this module to see ZIdentity audit events.
- The **Administrative Entitlements** module in ZIdentity controls which ZIA/ZPA products an admin can access. Changes to entitlements are presumably captured in ZIdentity's own audit log.
- OneAPI **Trace IDs** link API calls to admin identities. When debugging cross-product "who made this call," the Trace ID is the stable correlator across ZIA, ZPA, and ZIdentity audit logs.

ZIdentity audit log field schema and API access are not exposed in available SDK sources. The ZIdentity module is present in the ZIdentity admin permission matrix as a permission-gated view, implying a portal UI but not confirming an API.

**Pre-ZIdentity (legacy) tenants** have two separate audit streams — ZIA's and ZPA's — with no shared identity correlator. Correlating admin actions across products requires matching admin names or session timestamps manually.

---

## Cloud & Branch Connector (ZTW) — no admin audit

The Cloud & Branch Connector (ZTW) has a "Log and Control Forwarding" policy (per `vendor/zscaler-help/cbc-about-log-and-control-forwarding.md`) that controls how traffic logs and operational messages route to the Zscaler cloud. This is a data-plane forwarding policy — not an admin audit surface. It manages items such as enrollment, policy changes, software updates, and log sending through gateway routing rules.

The available ZTW SDK sources (`vendor/zscaler-sdk-go/zscaler/ztw/services/`) expose admin user and role management endpoints but no audit log query endpoints. Admin-level audit logging for Cloud Connector configuration changes is not confirmed in available sources.

---

## ZCC — no admin audit found

An exhaustive grep of the ZCC SDK sources (`vendor/zscaler-sdk-go/zscaler/zcc/`, `vendor/zscaler-sdk-python/zscaler/zcc/`) found only admin role and admin user management endpoints — no audit log query API. ZCC maintains a local copy of admin users synced from ZIA/ZPA/ZDX via explicit sync endpoints (`POST /zcc/papi/public/v1/sync/admins`, etc.), but no audit trail of ZCC configuration changes is visible in available sources.

---

## SIEM integration patterns

### ZIA

No native push from ZIA to a SIEM for audit logs. Integration requires:

1. Scheduling `POST /zia/api/v1/auditlogEntryReport` with desired filters and time window
2. Polling `GET /zia/api/v1/auditlogEntryReport` until status indicates completion
3. Downloading the CSV from `GET /zia/api/v1/auditlogEntryReport/download`
4. Parsing and ingesting the CSV into the SIEM

Given the 6-month retention, daily or weekly scheduled pulls are the practical pattern.

### ZPA

LSS streams `zpn_audit_log` continuously to a configured SIEM log receiver. The SIEM must expose a TCP port reachable from the App Connector network. Mutual TLS is supported and the receiver certificate must be signed by a public root CA.

Third-party SIEM integrations documented by Zscaler include Splunk. Other SIEMs that accept raw TCP log streams are compatible.

### ZWA

No push-based streaming documented. Integration requires periodic POST calls to `/zwa/dlp/v1/customer/audit` with time range filters, followed by cursor-based pagination to retrieve all pages.

---

## Open questions register

1. **ZIdentity audit log API** — no SDK implementation found for querying ZIdentity audit logs programmatically. The `vendor/zscaler-sdk-go/zscaler/zid/services/` directory contains only `common`, `groups`, `resource_servers`, `user_entitlement`, and `users` — no audit package. Whether a REST endpoint exists is unknown.

2. **ZIA NSS audit streaming** — NSS documentation covers only traffic logs (web, firewall). Source: `vendor/zscaler-help/about-log-streaming-service.md` confirms ZPA LSS covers "Audit Logs" but makes no mention of ZIA admin audit log streaming. ZIA admin audit logs appear to be pull-only via `auditlogEntryReport`. Not confirmed from available sources.

3. **ZCC admin audit** — no audit endpoint found in ZCC SDK. `vendor/zscaler-sdk-python/zscaler/zcc/` and `vendor/zscaler-sdk-go/zscaler/zcc/services/` do not include an audit package. Whether ZCC configuration changes are recorded elsewhere is unknown.

4. **ZTW admin audit** — same gap as ZCC. No audit package found in `vendor/zscaler-sdk-go/zscaler/ztw/services/`. Whether Cloud & Branch Connector admin config changes are captured in an audit trail is not confirmed.

5. **ZDX admin audit** — ZDX administration changes (departments, locations, alert thresholds) are not visibly captured in an audit log. No audit package found in `vendor/zscaler-sdk-go/zscaler/zdx/` or `vendor/zscaler-sdk-python/zscaler/zdx/`.

6. **Cross-product trace ID** — the OneAPI Trace ID appears in ZIA audit log columns (source: `vendor/zscaler-help/admin-rbac-captures.md` line 78). Whether this Trace ID is surfaced in ZWA, ZDX, or ZCC audit contexts is not confirmed from available sources.

7. **Resolved 2026-04-26.** ZPA pull-based audit export: confirmed absent. ZPA has no equivalent to the ZIA `auditlogEntryReport` API. Source: `vendor/zscaler-help/about-log-streaming-service.md` — ZPA audit logs are available in the ZPA Admin Console for 14 days and via LSS for longer retention. For tenants without App Connectors deployed, LSS cannot be used and audit logs are only accessible via the 14-day Admin Console window.

8. **ZWA retention** — the ZWA audit log retention period is not documented in available sources. No retention field or constant found in `vendor/zscaler-sdk-python/zscaler/zwa/` or `vendor/zscaler-sdk-go/zscaler/zwa/`.

9. **Unified audit bus** — whether Zscaler is building a unified admin audit log surface across products is not visible from available SDK sources. The current architecture is per-product (ZIA async report, ZPA LSS streaming, ZWA POST-filter pull) with no cross-product aggregation point.
