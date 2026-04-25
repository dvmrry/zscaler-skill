---
product: zwa
topic: "zwa-api"
title: "ZWA API — incident search, evidence, audit logs"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
source-tier: mixed
sources:
  - "https://help.zscaler.com/legacy-apis/dlp-incidents-workflow-automation-api"
  - "vendor/zscaler-help/dlp-incidents-workflow-automation-api.md"
  - "vendor/zscaler-sdk-python/zscaler/zwa/"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/"
author-status: draft
---

# ZWA API surface

Narrow surface — 2 services, ~14 methods total. Both Python and Go SDKs expose similar functionality with minor method-set differences. Focused on **incident retrieval, evidence, labels/notes, and close actions**. Workflow *configuration* is largely portal-only; API covers post-detection incident lifecycle.

## SDK services under `client.zwa.*`

### `client.zwa.dlp_incidents` (Python) / `client.zwa.dlp_incidents` (Go)

Python methods (per `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py`):

| Method | Purpose |
|---|---|
| `get_incident_transactions(transaction_id, query_params)` | Fetch the raw DLP transaction that generated the incident. |
| `get_incident_details(incident_id, query_params)` | Full detail for an incident — metadata + evidence + state. |
| `change_history(incident_id, query_params)` | Audit trail of changes to this incident (status transitions, assignments, etc.). |
| `get_incident_triggers(...)` | What triggered the incident (DLP engine, dictionary, pattern). |
| `get_generated_tickets(...)` | Tickets (ServiceNow / Jira) created from this incident. |
| `get_incident_evidence(...)` | The actual matched payload content that triggered the DLP rule. Treat output as sensitive. |
| `dlp_incident_search(...)` | Filtered search across incidents — time range, user, policy, severity, etc. |
| `incident_group_search(incident_id, incident_group_ids)` | Find incident groups matching criteria. |
| `assign_labels(incident_id, labels)` | Attach labels to an incident. |
| `incident_notes(incident_id, notes)` | Add investigator notes. |
| `incident_close(...)` | Close an incident — terminal status change. |

Go methods (per `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/`): largely same shape, plus `CreateNote`, `UpdateIncidentStatus`, `AssignLabels`, `FilterIncidentSearch`, `AssignIncidentGroups`, `GetIncidentTransactions`, `GetDLPIncident`.

### Cross-SDK parity notes

From the cross-SDK audit (2026-04-24):

- **Python has** (Go doesn't): `get_incident_triggers`, `get_generated_tickets`, `incident_group_search`.
- **Go has** (Python doesn't): `AssignIncidentGroups`, explicit status-update method (`UpdateIncidentStatus`) separate from close.

Neither SDK exposes CRUD for workflows, workflow templates, or workflow mappings — **workflow configuration is admin-portal-only**. A tenant that wants to manage workflows programmatically has no supported path.

### `client.zwa.audit_logs` (Python) / `client.zwa.customeraudit` (Go)

Python methods (per `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`):

- `audit_logs(query_params, fields, time_range, **kwargs)` — retrieve ZWA admin audit logs.

Go methods (per `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/`): equivalent coverage under the `customeraudit` service name.

Both cover the same audit log feed — who changed what workflow, when, etc.

## Authentication

Standard OneAPI OAuth 2.0 via ZIdentity — same env vars as other products (`ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` or `ZSCALER_PRIVATE_KEY`, `ZSCALER_VANITY_DOMAIN`). API client must have ZWA scope granted in the ZIdentity portal; without it, calls return 403.

## Wire format

Standard OneAPI conventions: JSON request/response, camelCase keys. Endpoint prefix is likely `/zwa/api/v1/` (not explicitly captured; check SDK source for exact paths).

## Legacy API reference

The help article *DLP Incidents (Workflow Automation API)* lives at `help.zscaler.com/legacy-apis/dlp-incidents-workflow-automation-api` — it's a Swagger-UI-style reference with endpoint listings. The article is ~32k chars (from capture); full endpoint schemas are there for operators who need wire-level detail.

## Sensitive data considerations

**`get_incident_evidence` returns the actual matched content** — the exact text/payload that tripped the DLP rule. Callers should:

- Never log the evidence output (it's the exact data DLP was trying to protect).
- Apply strict RBAC to API clients with ZWA scope.
- Consider whether audit logs of API calls themselves accidentally expose payload (Zscaler's own audit log wouldn't, but customer wrappers might).

**Matched payload data also appears in the admin portal Incidents page**. Admin-portal RBAC effectively controls access to the DLP-tripped content.

## What the API can't do

Gaps that portal-only users must handle:

- **Workflow definition** — templates, custom workflows, and mappings are portal-only. No API CRUD.
- **Notification channel configuration** — Slack/Teams webhooks and email templates set up in portal.
- **Ticketing integration config** — ServiceNow/Jira connections portal-only.
- **User/manager/approver hierarchy** — pulled from ZIdentity / ZIA user data; not configured in ZWA.

Fork teams automating ZWA should scope ambitions to incident lifecycle (search, retrieve, assign labels/notes, close) rather than workflow-config automation.

## Open questions

- Exact endpoint paths per SDK method — not captured line-by-line.
- Rate limits on ZWA endpoints — not captured.
- Whether `get_incident_evidence` returns raw or redacted content, and whether there's a payload-size cap.
- Retention window for audit logs.

## Cross-links

- Overview (incident lifecycle, workflow templates) — [`./overview.md`](./overview.md)
- ZIA DLP (upstream detection source) — [`../zia/dlp.md`](../zia/dlp.md)
- Cross-product integration (SSL-must-decrypt-for-DLP dependency) — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
