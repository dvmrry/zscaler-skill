The event log report mirrors the audit report API but is a different dataset. {{separate-endpoint}} It has the same endpoints and statusId parameters as in [[zia.audit-logs.report-api]].

Request: {{request-fields}}

Download: {{download-exists}} An older reading of this area said no download endpoint was visible; that was true of the Go SDK only: {{go-sdk-surface}} {{spec-status-object}} The mismatch is the divergence `event-status-shape`.

Purpose: {{system-events}} What the events actually contain is open (gap `event-contents`), and so is paging (gap `event-pagination`).

Check before using it for an investigation: pick the audit report ([[zia.audit-logs.what-is-recorded]]) for "who changed this", and treat the event log as probably service-side (errors and status codes) until its contents are confirmed, and call the REST endpoint directly if the Go SDK status decoding misbehaves.
