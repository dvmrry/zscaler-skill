---
product: zwa
topic: zwa-audit-logs
title: "ZWA Customer Audit Logs"
content-type: reference
last-verified: "2026-04-26"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go"
author-status: draft
---

# ZWA Customer Audit Logs

Zscaler Workflow Automation (ZWA) maintains an audit log of every action performed by administrators in the Workflow Automation Admin Portal and through the ZWA APIs. The audit surface answers: who performed what action, on which resource, in which module, and when.

This is distinct from ZWA DLP incident logs (which record data-plane policy match events). The audit log records control-plane changes — configuration, workflow, and policy modifications made by admins.

## What is captured

Per `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`:

> The result includes audit information for every action made by the admins in the Workflow Automation Admin Portal and the actions made through APIs.

Filterable dimensions include: `Action`, `Resource`, `Admin`, and `Module`.

## API surface

**Endpoint:** `POST /zwa/dlp/v1/customer/audit`

The audit log API uses a **POST-based filter and search** model rather than a GET with query parameters. Filters and time range are passed in the request body.

### Request body

| Field | Type | Description |
|-------|------|-------------|
| `fields` | []Fields | List of field-value filter pairs |
| `timeRange` | TimeRange | Start and end time for the query |

#### `Fields` structure

```json
{
  "name": "Action",
  "value": ["CREATE", "UPDATE"]
}
```

Supported `name` values: `Action`, `Resource`, `Admin`, `Module`.

#### `TimeRange` structure

```json
{
  "startTime": "2025-03-03T18:04:52.074Z",
  "endTime": "2025-03-03T18:04:52.074Z"
}
```

Times are ISO 8601 strings.

### Pagination query parameters

Pagination parameters are passed as URL query parameters on the POST request:

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number (1-based) |
| `pageSize` | int | Records per page; max 100 |
| `pageId` | string | Page ID for cursor-based pagination (alternative to `page`) |

### Response structure

Source: `vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py`, `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`

The response is an `AuditLogsResponse` envelope:

| Field | Type | Description |
|-------|------|-------------|
| `cursor` | Cursor | Pagination state |
| `logs` | []AuditLog | The audit log entries for this page |

#### Cursor fields

Source: `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go`

| Field | Type | Description |
|-------|------|-------------|
| `totalPages` | int | Total number of pages |
| `currentPageNumber` | int | Current page number |
| `currentPageSize` | int | Number of records on this page |
| `pageId` | string | Cursor token for the current page |
| `totalElements` | int | Total matching records across all pages |

#### `AuditLog` entry fields

Source: `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`

| Field | JSON key | Type | Description |
|-------|----------|------|-------------|
| Action | `action.action` | string | The action performed (e.g., CREATE, UPDATE, DELETE) |
| Module | `module` | string | The portal module where the action occurred |
| Resource | `resource` | string | The resource that was acted upon |
| Changed at | `changedAt` | string | Timestamp when the change was made |
| Changed by | `changedBy` | string | Identity of the admin who made the change |
| Old value | `oldRowJson` | string | JSON snapshot of the resource before the change |
| New value | `newRowJson` | string | JSON snapshot of the resource after the change |
| Change note | `changeNote` | string | Optional note attached to the change |

The `action` field is nested inside an `Action` sub-object: `{"action": {"action": "CREATE"}}`. The Go model uses `Action struct { Action string }`, and the Python model likewise wraps it.

The `oldRowJson` and `newRowJson` fields provide before/after snapshots of the changed resource as serialized JSON strings. This is the primary mechanism for determining what specifically changed within a resource.

---

## SDK access patterns

### Python SDK

Module: `zscaler.zwa.audit_logs.AuditLogsAPI`

The Python SDK method is named `audit_logs()` and accessed via `client.zwa.audit_logs.audit_logs()`.

```python
# Filter by severity and time range
search, response, error = client.zwa.audit_logs.audit_logs(
    fields=[
        {"name": "Action", "value": ["CREATE", "UPDATE"]},
        {"name": "Module", "value": ["DLP"]}
    ],
    time_range={
        "startTime": "2025-03-03T18:04:52.074Z",
        "endTime": "2025-03-04T18:04:52.074Z"
    }
)

if error:
    print(f"Error fetching audit logs: {error}")
else:
    for log in search.logs:
        print(log.as_dict())

# With pagination
search, response, error = client.zwa.audit_logs.audit_logs(
    query_params={"page": 2, "page_size": 50},
    time_range={
        "startTime": "2025-03-01T00:00:00.000Z",
        "endTime": "2025-03-31T23:59:59.999Z"
    }
)
```

The Python response is an `AuditLogs` model object with a `cursor` attribute and a `logs` list of `Logs` objects. Each `Logs` object has `action` (an `Action` sub-object), `module`, and `resource` fields. The Go SDK exposes the richer set of fields (`changedAt`, `changedBy`, `oldRowJson`, `newRowJson`, `changeNote`).

### Go SDK

Package: `github.com/zscaler/zscaler-sdk-go/v3/zscaler/zwa/services/customeraudit`

```go
filters := common.CommonDLPIncidentFiltering{
    Fields: []common.Fields{
        {Name: "Action", Value: []string{"CREATE", "UPDATE"}},
        {Name: "Module", Value: []string{"DLP"}},
    },
    TimeRange: common.TimeRange{
        StartTime: "2025-03-03T18:04:52.074Z",
        EndTime:   "2025-03-04T18:04:52.074Z",
    },
}

pageSize := 100
paginationParams := &common.PaginationParams{
    PageSize: common.IntPtr(pageSize),
}

auditLogs, cursor, err := customeraudit.GetCustomerAudit(ctx, service, filters, paginationParams)
if err != nil {
    // handle error
}

for _, log := range auditLogs {
    fmt.Printf("Action: %s | Module: %s | Resource: %s\n",
        log.Action.Action, log.Module, log.Resource)
    fmt.Printf("Changed by: %s at %s\n", log.ChangedBy, log.ChangedAt)
}
```

`GetCustomerAudit` internally calls `common.ReadAllPages[AuditLog]` with `http.MethodPost`, automatically fetching all pages. The returned `cursor` reflects the final pagination state.

### Pagination behavior

Source: `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go`

The ZWA pagination engine (`common.ReadAllPages`) uses a **cursor + total pages** model:

- Default `pageSize` is 1000 (SDK default, but the API max for this endpoint is 100 per Python docstring).
- Pagination continues until `currentPageSize < pageSize` or `page >= totalPages - 1`.
- Either numeric page (`page`) or cursor token (`pageId`) can be used for navigation.
- JMESPath client-side filtering is applied after all pages are aggregated (via `zscaler.ApplyJMESPathFromContext`).

---

## Streaming destinations

No streaming destination mechanism (equivalent to ZIA NSS or ZPA LSS) is documented in available sources for ZWA audit logs. The customer audit API is the only access mechanism visible in the SDKs.

---

## Open questions

1. **Python model field gap** — the Python `Logs` model only exposes `action`, `module`, and `resource`. The Go `AuditLog` struct also has `changedAt`, `changedBy`, `oldRowJson`, `newRowJson`, and `changeNote`. Whether the Python model is incomplete or the Python API response genuinely omits these fields is not confirmed.

2. **Supported `Action` values** — the full set of valid action strings (e.g., `CREATE`, `UPDATE`, `DELETE`, `LOGIN`) for the `Action` field filter is not documented in available sources.

3. **Supported `Module` values** — the full set of module names is not documented. Only DLP-related module names are implied by the surrounding code context.

4. **Retention** — the retention period for ZWA customer audit logs is not documented in available sources.

5. **SIEM integration** — whether ZWA audit logs can be forwarded to a SIEM via streaming (push-based) or only retrieved via pull (API) is not confirmed.

6. **`changeNote` usage** — the `changeNote` field is present in the Go model but not mentioned in the Python docstring. Whether this field is admin-supplied or system-generated is not confirmed.

7. **API version** — the base path is `/zwa/dlp/v1/customer/audit`. Whether a v2 exists or is planned is unknown.
