The API report is a CSV of audit information for calls made to the cloud service API; whether it also includes console actions is open {{gap:api-report-scope}}, so do not assume it equals the console trail in [[zia.audit-logs.what-is-recorded]]. It is produced through a request/poll/download sequence, not a direct list call.

**Lifecycle.** {{lifecycle}} {{single-report-overwritten}} {{status-id}} {{post-204}} {{status-shape}}

**Request filters.** {{request-filters}} {{spec-field-types}} {{go-request-struct}} The spec and the Go SDK disagree on those field types {{divergence:request-field-types}}. {{python-create}} Cancelling: {{sdk-omit-status-id}}

**Download.** {{download-csv}} Whether the API CSV's columns match the console's is open {{gap:csv-header}}.

**Access.** {{api-availability}} Which functional scope the audit endpoints need is open {{gap:reports-scope}}; the config audit endpoint's scope behavior is in [[zia.audit-logs.config-audit]]. Whether report calls interact with activation is open {{gap:activation-not-required}}; activation itself is covered in [activation](../shared/activation.md).

**Size and paging.** {{ranges-1000}} Whether `page` and `pageSize` change what the CSV contains is open {{gap:pagination}}, as is what `targetOrgId` does {{gap:target-org-id}}, and the unit of the time fields {{gap:start-time-units}}.

For continuous delivery instead of polling, see [[zia.audit-logs.streaming]].
