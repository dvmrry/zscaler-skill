The event log report mirrors the audit report API but is a different dataset. {{separate-endpoint}} It has the same endpoints and statusId parameters as in [[zia.audit-logs.report-api]].

**Request.** {{request-fields}}

**Download.** {{download-exists}} {{go-sdk-surface}} {{spec-status-object}} The Go SDK and the spec disagree on the status shape {{divergence:event-status-shape}}.

**Purpose.** {{system-events}} What the events actually contain is open {{gap:event-contents}}, and so is paging {{gap:event-pagination}}.
