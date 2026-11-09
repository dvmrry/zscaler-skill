# The ZIA event log report and how it differs from the admin audit report (zia.audit-logs.event-log-report)
Also called: eventlogEntryReport; event log report; zia event log csv; EventLogEntryReport sdk

The event log report mirrors the audit report API but is a different dataset. The event log report is a separate API (tag Event Logs) at /eventlogEntryReport with the same request/poll/download/cancel shape as the audit report; its create description covers event log information for every call made to the ZIA API in the period, and a new report overwrites the previous one. [zia.audit-logs.event-log-report:separate-endpoint] It has the same endpoints and statusId parameters as in [Exporting the ZIA admin audit log through the report API](kb:zia.audit-logs.report-api).

**Request.** The event log request filters by startTime, endTime, category, subcategories and actionResult, and adds text-search fields message, errorCode and statusCode; it has no adminName, clientIP, objectName or traceId filter. [zia.audit-logs.event-log-report:request-fields]

**Download.** The event log report has a download endpoint, GET /eventlogEntryReport/download, which returns the file only when the generation status is COMPLETE. [zia.audit-logs.event-log-report:download-exists] The Go SDK's event log report package defines GetAll, Create and Delete, and GetAll decodes the status into a slice. [zia.audit-logs.event-log-report:go-sdk-surface] The Go SDK has no function that downloads an event log report; its package stops at GetAll, Create and Delete. [zia.audit-logs.event-log-report:go-sdk-no-download] The spec describes the event log status response as a single object, like the audit report's. [zia.audit-logs.event-log-report:spec-status-object] The Go SDK and the spec disagree on the status shape [divergence:zia.audit-logs.event-log-report:event-status-shape].

**Purpose.** The event log report appears, from its filter fields, to target service-side events (message, error code, status code) rather than admin changes; the source does not say. [zia.audit-logs.event-log-report:system-events] What the events actually contain is open [gap:zia.audit-logs.event-log-report:event-contents], and so is paging [gap:zia.audit-logs.event-log-report:event-pagination].

What to check:
1. Whether to use the event log or the audit report for an investigation: use the audit report for who changed a thing, and treat the event log as service-side (errors and status codes) until its contents are confirmed.
2. Whether to call the REST endpoint directly when Go SDK status decoding misbehaves, since the SDK decodes the status as a slice and the spec describes one object.

Inferred, not quoted (say so when an answer rests on one):
- [zia.audit-logs.event-log-report:go-sdk-no-download] Tier B: A read of the one file in the eventlogentryreport package found only those three top-level functions; no other Go package was searched for a download call.
- [zia.audit-logs.event-log-report:system-events] Tier B: Inferred from the filter fields: no source states what events the report contains beyond "event log information for every call made to the ZIA API".

Sources disagree (name both sides):
- The Go SDK reads the event log status as an array while the spec shows a single object. [divergence:zia.audit-logs.event-log-report:event-status-shape]
  - sdk-go: GetAll returns a slice of status records.
  - api-specs: The 200 response schema is an object.
  Impact: Decoding a status object into a slice can fail or yield nothing; check which shape the tenant actually returns before depending on the SDK's GetAll.

Not known (open gaps):
- What the event log report contains [gap:zia.audit-logs.event-log-report:event-contents]: settled by lab-test or tenant-data
- Paging of the event log report [gap:zia.audit-logs.event-log-report:event-pagination]: settled by lab-test

Area: zia.audit-logs, its subjects in references/_meta/spine/zia/zia.audit-logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs), from zia.audit-logs: Cloud NSS requires a separate concurrent subscription, and its geo-availability and qualifications are obtained from Zscaler Support. [shared.nss.delivery-modes:cloud-subscription]
- links-to references/_meta/text/zia/zia.audit-logs.report-api.md (Exporting the ZIA admin audit log through the report API)
