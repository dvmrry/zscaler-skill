---
product: zia
topic: zia-audit-logs
title: "ZIA Admin Audit Logs"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zia/audit_logs.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/system_audit.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/system_audit.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/adminauditlogs/adminauditlogs.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/eventlogentryreport/eventlogentryreport.go"
  - "vendor/zscaler-help/admin-rbac-captures.md"
  - "vendor/zscaler-help/legacy-understanding-zia-api.md"
  - "vendor/zscaler-help/understanding-nanolog-streaming-service.md"
  - "vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md"
  - "vendor/terraform-provider-zia/zia/resource_zia_cloud_nss_server.go"
  - "vendor/terraform-provider-zia/docs/guides/zia-activator-overview.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/cloud_nss.py"
author-status: draft
---

# ZIA Admin Audit Logs

ZIA records every action performed by administrators — whether through the ZIA Admin Portal UI or through the Cloud Service APIs — as audit log entries. These logs are distinct from the data-plane traffic logs (web, firewall, DNS) documented in `references/zia/logs/`. The audit surface answers "who changed what config, when, from where, and with what outcome."

Source: `vendor/zscaler-help/admin-rbac-captures.md`; `vendor/zscaler-sdk-python/zscaler/zia/audit_logs.py`; `vendor/zscaler-sdk-python/zscaler/zia/system_audit.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/adminauditlogs/adminauditlogs.go`; `vendor/zscaler-sdk-go/zscaler/zia/services/eventlogentryreport/eventlogentryreport.go`.

This document covers two ZIA audit-adjacent APIs: the **Admin Audit Log Entry Report** (the primary admin-action trail) and the **Event Log Entry Report** (system-level event recording). It also covers the **Config Audit** endpoint, which surfaces configuration-quality grading rather than change history.

## What is captured

Source: `vendor/zscaler-help/admin-rbac-captures.md`.

Per `vendor/zscaler-help/admin-rbac-captures.md` (sourced from `https://help.zscaler.com/zia/about-audit-logs`):

- Alterations to PAC files, URL filtering policy, and all other portal-configurable objects.
- Details of changes made by each admin during their login sessions.
- API-driven changes attributed to the API key or service account that issued them.
- Failed login attempts — if an admin account makes five unsuccessful login attempts within one minute, the account is locked for five minutes and the failed attempts are recorded.

Use cases supported by the audit log: compliance demonstration, change attribution, and detection or investigation of suspicious admin activity.

## Retention

Source: `vendor/zscaler-help/admin-rbac-captures.md`.

Audit logs are stored for up to **6 months**. This retention period applies to admin audit logs only; data-plane traffic logs have different retention governed by the NSS/Nanolog system.

## Where to read audit logs

Source: `vendor/zscaler-help/admin-rbac-captures.md`. Source (legacy NSS streams traffic logs only): `vendor/zscaler-help/understanding-nanolog-streaming-service.md`.

**Admin Portal:** Administration > Audit Logs (exact navigation path is not confirmed from available sources — open question below).

**API/SDK:** Programmatic access via the `auditlogEntryReport` endpoints described in this document.

**NSS (streaming):** Admin audit logs are separate from data-plane traffic logs. The legacy on-prem/VM NSS streams traffic logs only (web, firewall), but Cloud NSS exposes a dedicated `ADMIN_AUDIT` feed type for continuously streaming admin audit logs to a SIEM/storage destination — see [Streaming destinations](#streaming-destinations).

---

## API surface: Admin Audit Log Entry Report

Source: `vendor/zscaler-sdk-go/zscaler/zia/services/adminauditlogs/adminauditlogs.go`.

Base path: `/zia/api/v1/auditlogEntryReport`

### Report lifecycle

Generating an audit log report is an **asynchronous** operation with three steps:

1. **Create** (POST) — trigger report generation for a time range.
2. **Poll status** (GET) — check whether the report is ready.
3. **Download** (GET `/download`) — retrieve the report as CSV.
4. **Cancel** (DELETE) — abort an in-progress report.

The Python SDK (`vendor/zscaler-sdk-python/zscaler/zia/audit_logs.py`) inserts a 2-second `time.sleep()` between POST and checking the response, signaling that generation is not instantaneous.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/zia/api/v1/auditlogEntryReport` | Trigger report generation |
| GET | `/zia/api/v1/auditlogEntryReport` | Poll report status |
| GET | `/zia/api/v1/auditlogEntryReport/download` | Download CSV report |
| DELETE | `/zia/api/v1/auditlogEntryReport` | Cancel in-progress report |

### Request schema (`AuditLogEntryRequest`)

Source: `vendor/zscaler-sdk-go/zscaler/zia/services/adminauditlogs/adminauditlogs.go`.

| Field | Type | Description |
|-------|------|-------------|
| `startTime` | int (epoch ms) | Start of the time window |
| `endTime` | int (epoch ms) | End of the time window |
| `adminName` | string | Filter by admin login name |
| `objectName` | string | Filter by the name of the object changed |
| `actionInterface` | string | Filter by interface — UI or API |
| `category` | string | Filter by action category |
| `subcategories` | []string | Filter by subcategories within the category |
| `actionResult` | string | Filter by outcome: `Failure` or `Success` |
| `actionTypes` | []string | Filter by action type(s) |
| `clientIP` | int | Filter by the IP address of the admin client |
| `targetOrgId` | int | (Partner/MSP use) target organization ID |
| `traceId` | int | Filter by trace ID |
| `page` | int | Page number for paginated results |
| `pageSize` | string | Page size for paginated results |

Source: `vendor/zscaler-sdk-python/zscaler/zia/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/adminauditlogs/adminauditlogs.go`.

The Python SDK exposes only `start_time` and `end_time` as required parameters to `create()`; additional filters from the Go struct are available via the REST API directly.

### Status response schema (`AuditLogEntryReportTaskInfo`)

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Status of the running task |
| `progressItemsComplete` | int | Number of items processed so far |
| `progressEndTime` | int | Epoch timestamp of when processing ended |
| `errorMessage` | string | Error description if the task failed |
| `errorCode` | string | Machine-readable error code |

### Download format

The report downloads as **CSV**. The Python SDK writes it as a string (`str`) and the Go SDK as `[]byte`. Per `vendor/zscaler-help/admin-rbac-captures.md`, per-log columns include:

| Column | Description |
|--------|-------------|
| Timestamp | When the action was recorded |
| Action | The operation performed (create, update, delete, login, etc.) |
| Category | Top-level classification of the action |
| Sub-Category | Sub-classification within the category |
| Resource | The object acted upon |
| Admin ID | Identity of the admin who performed the action |
| Client IP | Source IP of the admin's request |
| Interface | `Admin UI` or `API` |
| Trace ID | Correlation ID linking related operations |
| Result | `Success` or `Failure` |

Source: `vendor/zscaler-help/admin-rbac-captures.md`; `vendor/zscaler-sdk-python/zscaler/zia/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/adminauditlogs/adminauditlogs.go`.

The exact set of CSV columns in the report download is inferred from the help portal capture; the CSV header row is not confirmed from source code.

---

## API surface: Event Log Entry Report

Base path: `/zia/api/v1/eventlogEntryReport`

Source: `vendor/zscaler-sdk-go/zscaler/zia/services/eventlogentryreport/eventlogentryreport.go`.

The Event Log Entry Report is a separate API from the Admin Audit Log. The purpose distinction is not fully documented in available sources. The request schema overlaps but differs from the audit log request — it lacks admin-name and client-IP filters, and adds `message`, `errorCode`, and `statusCode` text-search fields. This suggests it targets system events (service errors, subsystem state changes) rather than admin config changes. Open question below.

### Request schema (`EventLogEntryReport`)

| Field | Type | Description |
|-------|------|-------------|
| `startTime` | int (epoch ms) | Start of the time window |
| `endTime` | int (epoch ms) | End of the time window |
| `category` | string | Filter by category |
| `subcategories` | []string | Filter by subcategories |
| `actionResult` | string | Filter by outcome: `Failure` or `Success` |
| `message` | string | Text search against event log message |
| `errorCode` | string | Text search against error code |
| `statusCode` | string | Text search against status code |
| `page` | int | Page number |
| `pageSize` | string | Page size |

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/zia/api/v1/eventlogEntryReport` | Trigger event log report |
| GET | `/zia/api/v1/eventlogEntryReport` | Poll status (returns array) |
| DELETE | `/zia/api/v1/eventlogEntryReport` | Cancel report |

Note: The Go SDK `GetAll` for event logs returns `[]EventLogEntryReportTaskInfo` (an array), whereas the admin audit log returns a single `AuditLogEntryReportTaskInfo` struct. Whether there is a download endpoint for event logs is not confirmed — the Go SDK does not expose one.

Source: `vendor/zscaler-sdk-go/zscaler/zia/services/eventlogentryreport/eventlogentryreport.go`; `vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md`.

---

## API surface: Config Audit (`/zia/api/v1/configAudit`)

Source: `vendor/zscaler-sdk-python/zscaler/zia/system_audit.py`; `vendor/zscaler-sdk-python/zscaler/zia/models/system_audit.py`.

The Config Audit endpoint is different in character from the change-history endpoints above. It returns a **configuration quality assessment** — a grading report across dimensions such as GRE tunnel configuration, PAC file configuration, authentication frequency, Office 365 settings, and IP visibility. It does not return a log of who changed what.

The Python SDK notes this endpoint requires `Reports` functional scope (`RBA_LIMITED` error is returned when that scope is missing).

### Config Audit response fields (`ConfigAudit` model)

| Field | Description |
|-------|-------------|
| `overallGrade` | Overall configuration quality grade |
| `highAvailabilityGrade` | HA configuration grade |
| `userPerformanceGrade` | User performance configuration grade |
| `otherGrade` | Miscellaneous configuration grade |
| `greTunnelGrade` | GRE tunnel configuration grade |
| `pacFileGrade` | PAC file configuration grade |
| `authFrequencyGrade` | Authentication frequency grade |
| `pacfileSizeGrade` | PAC file size grade |
| `office365Flag` | Boolean flag for Office 365 detection |
| `office365Grade` | Office 365 configuration grade |
| `ipVisibilityGrade` | IP visibility configuration grade |
| `reportTimestamp` | When the report was generated |
| `dataPresent` | Whether data was available to grade |
| `greTunnelRecommendedConfiguration` | Recommended GRE tunnel settings |
| `pacFileRecommendedConfiguration` | Recommended PAC file settings |
| `authFrequencyRecommendedConfiguration` | Recommended auth frequency settings |
| `pacFileSizeRecommendedConfiguration` | Recommended PAC file size settings |
| `office365RecommendedConfiguration` | Recommended Office 365 settings |
| `ipVisibilityRecommendedConfiguration` | Recommended IP visibility settings |

Sub-objects also exist for `AuthFrequency` (`authFrequency`, `authCustomFrequency`), `IPVisibility` (`totalGreLocations`, `recommendation`, `details`, `locationsWithNat`), and `PacFile` (`totalPacFiles`, `pacWithStaticIPs`).

Source: `vendor/zscaler-sdk-python/zscaler/zia/system_audit.py`; `vendor/zscaler-sdk-python/zscaler/zia/models/system_audit.py`.

This endpoint is **not an audit trail**; it is a best-practice compliance report against the current configuration state.

---

## SDK access patterns

### Python SDK

Module: `zscaler.zia.audit_logs.AuditLogsAPI` (accessed via `client.zia.audit_logs`)

```python
# Trigger report generation
status_code = client.zia.audit_logs.create(
    start_time='1627221600000',
    end_time='1627271676622'
)

# Poll status
status = client.zia.audit_logs.get_status()

# Download report as CSV string
report_csv = client.zia.audit_logs.get_report()
with open("audit_log.csv", "w+") as fh:
    fh.write(report_csv)

# Cancel in-progress report
client.zia.audit_logs.cancel()
```

Module: `zscaler.zia.system_audit.SystemAuditReportAPI` (accessed via `client.zia.system_audit`)

```python
# Retrieve config audit (requires Reports functional scope)
result, response, error = client.zia.system_audit.get_config_audit()
```

### Go SDK

Package: `github.com/zscaler/zscaler-sdk-go/v3/zscaler/zia/services/adminauditlogs`

```go
// Poll status
taskInfo, err := adminauditlogs.GetAll(ctx, service)

// Trigger report
exportReq := adminauditlogs.AuditLogEntryRequest{
    StartTime:    1627221600,
    EndTime:      1627271676,
    AdminName:    "admin@example.com",
    ActionResult: "Success",
}
httpResp, err := adminauditlogs.CreateAdminAuditLogsExport(ctx, service, exportReq)
// Expects 204 No Content on success

// Download CSV
csvBytes, err := adminauditlogs.GetAdminAuditLogsDownload(ctx, service)

// Cancel
adminauditlogs.Delete(ctx, service)
```

Package: `github.com/zscaler/zscaler-sdk-go/v3/zscaler/zia/services/eventlogentryreport`

```go
// Poll status (returns slice)
statuses, err := eventlogentryreport.GetAll(ctx, service)

// Trigger event log report
report := &eventlogentryreport.EventLogEntryReport{
    StartTime:    1627221600,
    EndTime:      1627271676,
    Category:     "Admin",
    ActionResult: "Failure",
}
created, err := eventlogentryreport.Create(ctx, service, report)

// Cancel
eventlogentryreport.Delete(ctx, service)
```

### Authentication requirement

Source: `vendor/zscaler-help/legacy-understanding-zia-api.md`; `vendor/zscaler-sdk-python/zscaler/zia/system_audit.py`.

Both the audit log and event log APIs require ZIA Cloud Service API access. Per `vendor/zscaler-help/legacy-understanding-zia-api.md`, this API is availability-limited — contact Zscaler Support to enable. The admin account used must have the `Reports` functional scope to access audit log endpoints (the system audit endpoint returns `RBA_LIMITED` without it).

### Activation

ZIA configuration writes use the activation gate; deliberate workflows should activate explicitly, while session end can also autoactivate pending configuration (`vendor/terraform-provider-zia/docs/guides/zia-activator-overview.md:64-70`). Audit-log queries are read-only and do not require activation. Canceling a report (DELETE) likewise does not require activation.

---

## Streaming destinations

Source: `vendor/zscaler-help/understanding-nanolog-streaming-service.md`; `vendor/terraform-provider-zia/zia/resource_zia_cloud_nss_server.go`; `vendor/zscaler-sdk-python/zscaler/zia/models/cloud_nss.py`.

There are two distinct ways to get admin audit logs out of ZIA, and which one applies depends on which NSS you mean.

**Legacy on-prem/VM NSS — traffic logs only.** The legacy Nanolog Streaming Service (the customer-hosted NSS VM/appliance) is documented in `vendor/zscaler-help/understanding-nanolog-streaming-service.md` as handling data-plane traffic logs — specifically NSS for Web and NSS for Firewall (`understanding-nanolog-streaming-service.md:25-26`). Admin audit logs are not part of that traffic-log stream.

**Cloud NSS — has a dedicated `ADMIN_AUDIT` feed.** The cloud-hosted NSS feed model does support admin audit logs. `ADMIN_AUDIT` is a valid `nss_log_type` value on the Cloud NSS feed resource (`vendor/terraform-provider-zia/zia/resource_zia_cloud_nss_server.go:70`), and the Cloud NSS feed model carries a dedicated `audit_log_type` (`auditLogType`) filter field for narrowing which audit log categories are streamed (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_nss.py:249`). A Cloud NSS feed configured with `nss_log_type = ADMIN_AUDIT` delivers admin audit events continuously to a SIEM or cloud-storage destination.

So the two extraction paths are complementary, not exclusive:

- **On-demand pull** — the `auditlogEntryReport` API described above (trigger → poll → download CSV). Best for ad-hoc compliance exports and investigations over a chosen time window.
- **Continuous push** — a Cloud NSS feed with `nss_log_type = ADMIN_AUDIT`, streaming to a SIEM/S3-style sink. Best for keeping a downstream system in sync without polling.

Cloud NSS feed configuration (including the full `nss_log_type` enumeration and the `audit_log_type` sub-filter) is documented in [`references/zia/api.md` §Cloud NSS feeds](./api.md#cloud-nss-feeds).

---

## Terraform

The `auditlogEntryReport` API itself has no Terraform resource — it is query-only (trigger, poll, download, cancel) and does not manage persistent configuration. However, a Cloud NSS feed that streams admin audit logs *is* a Terraform-manageable resource: set `nss_log_type = "ADMIN_AUDIT"` on the Cloud NSS server resource (`vendor/terraform-provider-zia/zia/resource_zia_cloud_nss_server.go:70`). See [`references/zia/api.md` §Cloud NSS feeds](./api.md#cloud-nss-feeds) for the resource's full field set.

---

## Open questions

Source: `vendor/zscaler-help/admin-rbac-captures.md`.

1. **Resolved 2026-04-26.** ZIA Audit Log navigation path is confirmed from the help portal capture section "ZIA: About Audit Logs". The audit log is accessible at Administration > (implied) Audit Logs within the ZIA Admin Portal. The page records every admin action in the portal and through the API. Per-log columns: Timestamp, Action, Category, Sub-Category, Resource, Admin ID, Client IP, Interface (Admin UI or API), Trace ID, Result.

Source: `vendor/zscaler-sdk-go/zscaler/zia/services/eventlogentryreport/eventlogentryreport.go`.

2. **Resolved 2026-04-26.** Event Log Entry Report scope confirmed. The endpoint is `/zia/api/v1/eventlogEntryReport` (distinct from `/auditlogEntryReport`). The Go SDK exposes `GetAll`, `Create`, and `Delete` for event log reports but no download function. The event log report captures system events (error codes, messages, status codes) rather than admin configuration changes.

3. **Resolved 2026-04-26.** Event Log download endpoint: the Go SDK (`vendor/zscaler-sdk-go/zscaler/zia/services/eventlogentryreport/eventlogentryreport.go`) does not expose a download function. The Python SDK's `audit_logs.py` `get_report()` method calls `/auditlogEntryReport/download` for the admin audit log — a parallel download endpoint for event logs is not visible in available sources.

4. **Resolved 2026-06-15.** NSS/SIEM streaming for ZIA admin audit logs is supported via Cloud NSS, not the legacy on-prem/VM NSS. `ADMIN_AUDIT` is a valid `nss_log_type` on the Cloud NSS feed resource (`vendor/terraform-provider-zia/zia/resource_zia_cloud_nss_server.go:70`) and the feed model carries a dedicated `audit_log_type` filter (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_nss.py:249`). The `auditlogEntryReport` API is the on-demand pull path; a Cloud NSS `ADMIN_AUDIT` feed is the continuous-push path. See [Streaming destinations](#streaming-destinations).

5. **Resolved 2026-04-26.** CSV column names confirmed from help portal capture: Timestamp, Action, Category, Sub-Category, Resource, Admin ID, Client IP, Interface (Admin UI or API), Trace ID, Result (success/failure).

6. **Pagination semantics** — the `page` and `pageSize` fields appear in the request schema. The Go SDK's `ReadAllPages` helper would handle pagination, but the ZIA admin audit log report endpoint uses an async request model (POST to queue → poll status → GET download) rather than a direct paginated list. Whether the downloaded CSV itself is paginated or returned in full is not confirmed. (Tracked as `zia-55` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-55-admin-audit-report-pagination-and-targetorgid-semantics).)

7. **`targetOrgId` usage** — the Go SDK struct includes `targetOrgId` suggesting MSP/partner-mode audit access across managed organizations. Full semantics not confirmed from available sources. (Tracked as `zia-55` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-55-admin-audit-report-pagination-and-targetorgid-semantics).)

8. **Resolved 2026-04-26.** Retention period is 6 months. Whether the window is rolling or absolute, and whether it can be extended via subscription, is not confirmed.
