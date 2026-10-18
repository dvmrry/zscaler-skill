The API report is a CSV of audit information for calls made to the cloud service API; the spec does not say whether it also includes console actions (gap `api-report-scope`), so do not assume it equals the console trail in [[zia.audit-logs.what-is-recorded]]. It is produced through a request/poll/download sequence, not a direct list call.

Lifecycle: {{lifecycle}} {{single-report-overwritten}} {{status-id}} {{post-204}} {{status-shape}}

What to send: {{request-filters}} {{spec-field-types}} {{go-request-struct}} The disagreement is recorded as the divergence `request-field-types`. {{python-create}} Cancelling: {{sdk-omit-status-id}}

What comes back: {{download-csv}} The console documents its own columns and timezone; whether the API CSV matches is open (gap `csv-header`).

Access: {{api-availability}} Which functional scope the audit endpoints need is not sourced (gap `reports-scope`); the config audit endpoint's scope behavior is in [[zia.audit-logs.config-audit]]. Whether report calls interact with activation is also unsourced (gap `activation-not-required`); activation itself is covered in references/shared/activation.md.

Size and paging: {{ranges-1000}} Whether `page` and `pageSize` change what the CSV contains is open (gap `pagination`), as is `targetOrgId` (gap `target-org-id`) and the unit of the time fields (gap `start-time-units`).

Check before automating an export: poll until the status is COMPLETE rather than relying on a delay, treat the stored report as shared (gap `report-scope`), and filter IP or trace ID values in the CSV rather than through the Go struct. For continuous delivery instead of polling, see [[zia.audit-logs.streaming]].
