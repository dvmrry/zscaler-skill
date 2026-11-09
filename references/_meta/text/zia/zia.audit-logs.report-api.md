# Exporting the ZIA admin audit log through the report API (zia.audit-logs.report-api)
Also called: auditlogEntryReport; audit log api; export audit log csv; audit report statusId; AuditLogEntryRequest; adminauditlogs sdk
Former IDs: zia-55

The API report is a CSV of audit information for calls made to the cloud service API; whether it also includes console actions is open [gap:zia.audit-logs.report-api:api-report-scope], so do not assume it equals the console trail in [What the ZIA admin audit log records and how the console shows it](kb:zia.audit-logs.what-is-recorded). It is produced through a request/poll/download sequence, not a direct list call.

**Lifecycle.** An admin audit report is generated asynchronously: POST /auditlogEntryReport starts it, GET /auditlogEntryReport reports status until it is COMPLETE, then GET /auditlogEntryReport/download returns the CSV; DELETE /auditlogEntryReport cancels the request. [zia.audit-logs.report-api:lifecycle] The most recent report replaces the previous one: creating a new audit log report overwrites the previously generated report, and the download returns the most recently created one. [zia.audit-logs.report-api:single-report-overwritten] The spec identifies a report by a `statusId` query parameter returned from the POST; it is required on DELETE (cancel) and optional on the status and download GETs. [zia.audit-logs.report-api:status-id] The POST returns 204 with no body, and the Go SDK treats any other status as an error. [zia.audit-logs.report-api:post-204] The status response carries status (INIT, EXECUTING, COMPLETE, CANCELLED, ERRORED, VALIDATING or STOP), progressItemsComplete, progressEndTime, errorMessage and errorCode. [zia.audit-logs.report-api:status-shape]

**Request filters.** The create request filters by startTime, endTime, adminName, objectName, actionInterface, category, subcategories, actionResult, actionTypes, clientIP, traceId, targetOrgId, page and pageSize; actionTypes values are SIGN_IN, SIGN_OUT, CREATE, UPDATE, DELETE, PATCH, AUDIT_OPERATION, ACTIVATE, FORCED_ACTIVATE, IMPORT, REPORT and DOWNLOAD. actionResult is Failure or Success, and actionInterface is Admin UI or API. [zia.audit-logs.report-api:request-filters] In the API spec clientIP and traceId are strings, pageSize is a 32-bit integer, and startTime and endTime are 64-bit integers. [zia.audit-logs.report-api:spec-field-types] The Go SDK request struct types ClientIP and TraceId as int, PageSize as string, and StartTime and EndTime as int. [zia.audit-logs.report-api:go-request-struct] The spec and the Go SDK disagree on those field types [divergence:zia.audit-logs.report-api:request-field-types]. The Python SDK create() takes only start_time and end_time and sends only startTime and endTime, with no filter parameters; after the POST it sleeps 2 seconds, then returns the status code. [zia.audit-logs.report-api:python-create] Cancelling: Neither SDK passes a statusId on cancel: the Go Delete and the Python cancel() call the bare endpoint. [zia.audit-logs.report-api:sdk-omit-status-id]

**Download.** The download is a CSV file; the Go SDK returns it as bytes and the Python SDK as a string. [zia.audit-logs.report-api:download-csv] Whether the API CSV's columns match the console's is open [gap:zia.audit-logs.report-api:csv-header].

**Access.** The cloud service API is availability-limited: enabling it for an organization requires contacting Zscaler Support. [zia.audit-logs.report-api:api-availability] Which functional scope the audit endpoints need is open [gap:zia.audit-logs.report-api:reports-scope]; the config audit endpoint's scope behavior is in [The ZIA configuration audit (System Audit Report) endpoint](kb:zia.audit-logs.config-audit). Whether report calls interact with activation is open [gap:zia.audit-logs.report-api:activation-not-required]; activation itself is covered in [Which Zscaler products stage changes behind an activation](kb:shared.activation).

**Size and paging.** The ZIA ranges table lists "Admin Audit Log" with a limit of 1,000 entries. [zia.audit-logs.report-api:ranges-1000] Whether `page` and `pageSize` change what the CSV contains is open [gap:zia.audit-logs.report-api:pagination], as is what `targetOrgId` does [gap:zia.audit-logs.report-api:target-org-id], and the unit of the time fields [gap:zia.audit-logs.report-api:start-time-units].

For continuous delivery instead of polling, see [Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT)](kb:zia.audit-logs.streaming). The console reports are in [ZIA reports: which subject describes each report family](kb:zia.reports).

What to check:
1. Whether the export is complete before downloading: poll until the status is COMPLETE rather than relying on a delay.
2. Whether the stored report is shared between admins before automating an export, since a new report overwrites the previous one.
3. Which filters to apply in the CSV rather than through the Go request struct, since the Go struct types ClientIP and TraceId as int.

Inferred, not quoted (say so when an answer rests on one):
- [zia.audit-logs.report-api:sdk-omit-status-id] Tier B: Read from the Go Delete function and the Python cancel() body, which builds the request with empty parameters; whether the service accepts a cancel without statusId was not observed.

Sources disagree (name both sides):
- The Go SDK and the API spec disagree on the types of the audit request fields clientIP, traceId and pageSize. [divergence:zia.audit-logs.report-api:request-field-types]
  - api-specs: clientIP and traceId are strings; pageSize is a 32-bit integer.
  - sdk-go: ClientIP and TraceId are int and PageSize is string.
  Impact: A dotted IP address cannot be sent as ClientIP through the Go struct, and a numeric trace ID loses any non-numeric form. Filter by client IP or trace ID with a direct REST call, or filter the downloaded CSV.

Not known (open gaps):
- Whether page and pageSize apply to the report or its CSV [gap:zia.audit-logs.report-api:pagination]: settled by lab-test. Blocks: knowing whether one report covers the whole time window
- What targetOrgId does on the audit report [gap:zia.audit-logs.report-api:target-org-id]: settled by tenant-data or lab-test
- Unit of startTime and endTime [gap:zia.audit-logs.report-api:start-time-units]: settled by lab-test
- How a client obtains statusId [gap:zia.audit-logs.report-api:status-id-source]: settled by lab-test
- Whether the single stored report is per admin or per organization [gap:zia.audit-logs.report-api:report-scope]: settled by lab-test
- Functional scope needed for the audit report endpoints [gap:zia.audit-logs.report-api:reports-scope]: settled by lab-test or tenant-data. Blocks: diagnosing a 403 or RBA_LIMITED on an audit export
- Whether report calls interact with activation [gap:zia.audit-logs.report-api:activation-not-required]: settled by lab-test
- Whether the API report includes console (Admin UI) actions [gap:zia.audit-logs.report-api:api-report-scope]: settled by lab-test
- Exact header row of the API-generated CSV [gap:zia.audit-logs.report-api:csv-header] (data gap): filled by operator; settled by lab-test
- What the 1,000-entry audit log limit bounds [gap:zia.audit-logs.report-api:ranges-1000-meaning]: settled by support-ticket or lab-test

Area: zia.audit-logs, its subjects in references/_meta/spine/zia/zia.audit-logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs), from zia.audit-logs: Cloud NSS requires a separate concurrent subscription, and its geo-availability and qualifications are obtained from Zscaler Support. [shared.nss.delivery-modes:cloud-subscription]
- links-to references/_meta/text/shared/shared.activation.md (Which Zscaler products stage changes behind an activation)
- links-to references/_meta/text/zia/zia.audit-logs.config-audit.md (The ZIA configuration audit (System Audit Report) endpoint)
- links-to references/_meta/text/zia/zia.audit-logs.streaming.md (Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT))
- links-to references/_meta/text/zia/zia.audit-logs.what-is-recorded.md (What the ZIA admin audit log records and how the console shows it)
- links-to references/_meta/text/zia/zia.reports.md (ZIA reports: which subject describes each report family)
