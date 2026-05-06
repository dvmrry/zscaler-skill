---
product: zwa
topic: "zwa-api"
title: "ZWA API — incident search, evidence, audit logs"
content-type: reference
last-verified: "2026-05-06"
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/legacy-apis/dlp-incidents-workflow-automation-api"
  - "vendor/zscaler-help/dlp-incidents-workflow-automation-api.md"
  - "https://help.zscaler.com/legacy-apis/api-authentication-workflow-automation-api"
  - "vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md"
  - "vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py"
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

### OneAPI (current path)

Standard OneAPI OAuth 2.0 via ZIdentity — same env vars as other products (`ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` or `ZSCALER_PRIVATE_KEY`, `ZSCALER_VANITY_DOMAIN`). API client must have ZWA scope granted in the ZIdentity portal; without it, calls return 403.

### Legacy (pre-ZIdentity tenants)

For tenants that haven't migrated to ZIdentity, ZWA exposes a legacy API-key flow at `POST /v1/auth/api-key/token` (`vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md:8`):

- **Body**: `{"key_id": "string", "key_secret": "string"}` (`legacy-api-authentication-workflow-automation-api.md:14-17`)
- **Response (201)**: `{"token": "...", "token_type": "...", "expires_in": <int>}` — the `token` value goes into the `Bearer` header on subsequent requests (`legacy-api-authentication-workflow-automation-api.md:10, 24-28`)
- **Response (401)**: authorization failure (`legacy-api-authentication-workflow-automation-api.md:29`)
- Tokens expire per `expires_in`; clients must handle refresh (`legacy-api-authentication-workflow-automation-api.md:37`)

The legacy auth uses an API key ID + secret pair, not username/password/session cookie like ZIA legacy (`legacy-api-authentication-workflow-automation-api.md:35`). New integrations should use OneAPI; treat this section as a fallback for tenants pre-migration.

## Wire format

Standard OneAPI conventions: JSON request/response, camelCase keys. Endpoint prefix is `/zwa/dlp/v1/` for both incidents and audit logs (`vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:36`, `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:30`). Specific paths: `/zwa/dlp/v1/incidents/search` (`dlp_incidents.py:422`), `/zwa/dlp/v1/incidents/{id}/incident-groups/search` (`dlp_incidents.py:470`), `/zwa/dlp/v1/customer/audit` (`audit_logs.py:108`).

## Legacy API reference

The help article *DLP Incidents (Workflow Automation API)* lives at `help.zscaler.com/legacy-apis/dlp-incidents-workflow-automation-api` — it's a Swagger-UI-style reference with endpoint listings. The article is ~32k chars (from capture); full endpoint schemas are there for operators who need wire-level detail.

> **Caveat — legacy vs. current API surface.** The help portal still ships a "Legacy UI: Workflow Automation" entry whose API doc lives under `/legacy-apis/`, while the current-generation surface documented above (the `/zwa/dlp/v1/` endpoints exposed via the Python and Go SDK service layers) is what new integrations should target. Treat the SDK source as ground truth for current-gen endpoint paths and method shapes; the legacy-UI API doc may describe a parallel-but-different surface that's not the SDK target. If you find a discrepancy between this doc and the legacy help article, the SDK wins.

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
