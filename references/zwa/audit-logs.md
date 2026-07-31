---
product: zwa
topic: zwa-audit-logs
title: "ZWA audit logs - customer audit API"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: c26c394767d7344a4ac41658d1d5fb2c4b7d4716
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go"
author-status: draft
---

# ZWA audit logs - customer audit API

Source: `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`.

ZWA audit-log access is a pull API exposed by the Python and Go SDKs. The Python docstring describes the result as audit information for actions made by admins in the Workflow Automation Admin Portal and actions made through APIs (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:33-39`). This page covers that SDK-visible customer audit API only; retention, streaming, and SIEM export support are not documented in the inspected ZWA sources.

## Accessors and endpoint

Source: `vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py`; `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`.

| SDK | Accessor | Endpoint | Lines |
|---|---|---|---|
| Python | `client.zwa.audit_logs.audit_logs(...)` | `POST /zwa/dlp/v1/customer/audit` | `vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py:27-33`; `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:33-135` |
| Go | `customeraudit.GetCustomerAudit(ctx, service, filters, paginationParams)` | `POST /dlp/v1/customer/audit` resolved against the configured ZWA host | `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:12-47` |

Python and Go both use a POST-based filter/search model rather than a simple GET. Python builds a body with `fields` and `timeRange` and passes query params for pagination (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:108-122`). Go passes `common.CommonDLPIncidentFiltering` into the shared pager, also using POST (`vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:36-47`; `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:148-178`).

## Request shape

Source: `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go`.

Python signature:

```python
client.zwa.audit_logs.audit_logs(
    query_params=None,
    fields=None,
    time_range=None,
    **kwargs,
)
```

The Python docstring lists supported filter fields `Action`, `Resource`, `Admin`, and `Module` (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:40-46`). It documents pagination query params `page`, `page_size`, and `page_id`, with max page size 100 (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:52-60`). The request body is `{"fields": fields or [], "timeRange": time_range or {}}`, with any extra keyword args merged into the body (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:111-115`).

Go uses the shared request structs:

| Struct | Wire fields | Lines |
|---|---|---|
| `CommonDLPIncidentFiltering` | `fields`, `timeRange` | `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:148-152` |
| `Fields` | `name`, `value` | `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:154-157` |
| `TimeRange` | `startTime`, `endTime` | `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:159-162` |
| `PaginationParams` | `page`, `pageSize`, `pageId` | `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:173-178` |

## Response shape

Source: `vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`.

Python model:

| Model | Fields | Lines |
|---|---|---|
| `AuditLogs` | `cursor`, `logs` | `vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py:24-53` |
| `Logs` | `action`, `module`, `resource` | `vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py:65-106` |
| `Action` | `action` | `vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py:109-137` |

Go model:

| Model | Fields | Lines |
|---|---|---|
| `AuditLogsResponse` | `cursor`, `logs` | `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:16-19` |
| `AuditLog` | `action`, `module`, `resource`, `changedAt`, `changedBy`, `oldRowJson`, `newRowJson`, `changeNote` | `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:21-30` |
| `Action` | `action` | `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:32-34` |

The Go model is richer than the Python model in this snapshot. Do not claim Python returns `changedAt`, `changedBy`, `oldRowJson`, `newRowJson`, or `changeNote` as first-class model attributes unless you verify raw-response handling or SDK changes.

## Pagination and limits

Source: `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go`.

Python documents `page`, `page_size`, and `page_id`; its docstring states max page size is 100 (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:52-60`). Go's shared code defines `pageSize = 1000` and defaults to 1000 inside `ReadAllPages` unless overridden (`vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:13`, `:190-203`). Treat this as an SDK/documentation mismatch, not proof that the server accepts 1000. When writing portable examples, use page sizes at or below the documented 100 until a tenant/lab confirms otherwise.

The shared Go pager collects response items from a `logs` field (`vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:222-245`). That is consistent with audit-log responses, but it is also used by some incident functions; avoid over-claiming incident-search pagination behavior from static code alone.

## Example patterns

Source: `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`; `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go`.

Python:

```python
logs, response, error = client.zwa.audit_logs.audit_logs(
    fields=[{"name": "Module", "value": ["DLP"]}],
    time_range={
        "startTime": "2026-06-16T00:00:00Z",
        "endTime": "2026-06-16T01:00:00Z",
    },
    query_params={"page": 1, "page_size": 100},
)
if error:
    raise RuntimeError(error)
for entry in logs.logs:
    print(entry.action.action, entry.module, entry.resource)
```

Go:

```go
filters := common.CommonDLPIncidentFiltering{
    Fields: []common.Fields{
        {Name: "Module", Value: []string{"DLP"}},
    },
    TimeRange: common.TimeRange{
        StartTime: "2026-06-16T00:00:00Z",
        EndTime:   "2026-06-16T01:00:00Z",
    },
}
pageSize := common.IntPtr(100)
logs, cursor, err := customeraudit.GetCustomerAudit(ctx, service, filters, &common.PaginationParams{PageSize: pageSize})
if err != nil {
    return err
}
_ = cursor
for _, entry := range logs {
    fmt.Println(entry.Action.Action, entry.Module, entry.Resource, entry.ChangedAt)
}
```

## Security and operations notes

Source: `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`.

- The audit feed is control-plane oriented: admin-portal actions and API actions in Workflow Automation (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:33-39`). Do not confuse it with DLP incident evidence or DLP event logging.
- Go exposes before/after JSON fields (`oldRowJson`, `newRowJson`) that may contain configuration details (`vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:21-30`). Treat audit exports as sensitive admin/configuration data.
- No push/streaming destination equivalent to ZIA NSS or ZPA LSS was found for ZWA audit logs in this pass. Phrase that as an inspected-source absence, not a universal product impossibility.

## Open questions

Source: `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`.

- **Retention period** - not documented in the inspected ZWA sources. See [clarification zwa-03](../_meta/clarifications.md#zwa-03-zwa-audit-log-retention-and-streaming).
- **Streaming/SIEM forwarding** - no ZWA-specific streaming mechanism was found in SDK/help captures. See [clarification zwa-03](../_meta/clarifications.md#zwa-03-zwa-audit-log-retention-and-streaming).
- **Complete module/action value sets** - Python documents filter field names but not full accepted values (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:40-46`).
- **Server page-size max** - Python says max 100, Go defaults to 1000; server behavior needs lab/tenant confirmation (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:55-60`; `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:13`, `:190-203`).

## Cross-links

- Full API surface and auth split - [`./api.md`](./api.md)
- Product and workflow model - [`./overview.md`](./overview.md)
- Claims ledger - [`./_claims-ledger.md`](./_claims-ledger.md)
