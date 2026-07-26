---
product: zwa
topic: "zwa-api"
title: "ZWA API - incident search, evidence URL, audit logs, auth split"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: e68b53e17f61870f3bec2a68bff3e3d4f1c6db05
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 70e67db347441caa31f94da8f904389064db0664
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md"
  - "vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md"
  - "vendor/zscaler-help/dlp-incidents-workflow-automation-api.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_http_client.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/models/incident_details.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/models/incident_evidence.py"
  - "vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/discovery.py"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
  - "vendor/terraform-provider-zia/zia/data_source_zia_dlp_incident_receiver_servers.go"
  - "vendor/ziacloud-ansible/plugins/modules/zia_dlp_incident_receiver_info.py"
author-status: draft
---

# ZWA API - incident search, evidence URL, audit logs, auth split

Source: `vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py`; `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py`; `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`.

ZWA has a real SDK surface, but it is narrow: DLP incident lifecycle operations and customer audit-log search. Do not describe it as workflow template or workflow mapping management. In the current Python client, `client.zwa` returns `ZWAService` unless the client is in legacy mode (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:271-277`), and `ZWAService` exposes only `audit_logs` and `dlp_incidents` properties (`vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py:21-41`).

## Auth and client naming

Source: `vendor/zscaler-sdk-python/zscaler/oneapi_client.py`; `vendor/zscaler-sdk-python/zscaler/zwa/legacy.py`; `vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go`; `vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go`; `vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md`; `vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md`.

**Python current client.** The general OneAPI `Client` reads `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` or `ZSCALER_PRIVATE_KEY`, and `ZSCALER_VANITY_DOMAIN`; it obtains an OAuth token and updates the default authorization header (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:165-184`, `:233-244`). In that mode, `client.zwa` is the current `ZWAService` wrapper (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:271-277`).

**Python legacy client.** `LegacyZWAClient` reads `key_id`, `key_secret`, and `cloud` from config or `ZWA_CLIENT_ID`, `ZWA_CLIENT_SECRET`, and `ZWA_CLOUD`; it builds a `LegacyZWAClientHelper` and flips `use_legacy_client=True` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:636-656`). The helper requires key ID/secret, defaults the cloud to `us1`, targets `https://api.<cloud>.zsworkflow.net`, posts to `/v1/auth/api-key/token`, and stores the returned bearer token for subsequent requests (`vendor/zscaler-sdk-python/zscaler/zwa/legacy.py:47-65`, `:120-126`, `:140-185`).

**Go SDK.** The Go ZWA package is also API-key based: config fields and environment variables are `ZWA_API_KEY_ID`, `ZWA_API_SECRET`, and `ZWA_CLOUD`; the base URL is `https://api.<cloud>.zsworkflow.net`; authentication posts `key_id` and `key_secret` to `/v1/auth/api-key/token` and parses `token`, `token_type`, and `expires_in` (`vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go:45-49`, `:80-105`, `:140-180`; `vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:212-294`).

**Legacy help.** The captured Workflow Automation API getting-started/auth pages match the API-key flow: API management is enabled with a Workflow Automation subscription, authentication uses API key ID + key secret, and `POST /v1/auth/api-key/token` returns a bearer token with expiration (`vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md:8-17`; `vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md:8-37`). Because Python current-client, Python legacy, Go, and the legacy help pages do not express the same migration boundary, keep the exact boundary open in [clarification zwa-04](../_meta/clarifications.md#zwa-04-current-vs-legacy-auth-boundary).

## DLP incidents - Python

Source: `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py`; `vendor/zscaler-sdk-python/zscaler/zwa/models/incident_details.py`; `vendor/zscaler-sdk-python/zscaler/zwa/models/incident_evidence.py`.

Python `client.zwa.dlp_incidents` uses `/zwa/dlp/v1` as its base endpoint (`vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:32-37`). The method surface is:

| Method | HTTP/path | What it supports | Lines |
|---|---|---|---|
| `get_incident_transactions(transaction_id, query_params=None)` | `GET /incidents/transactions/{transaction_id}` | Look up incidents associated with a transaction ID. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:39-90` |
| `get_incident_details(incident_id, query_params=None)` | `GET /incidents/{incident_id}` | Fetch incident details, optionally with `fields`. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:92-143` |
| `change_history(incident_id, query_params=None)` | `GET /incidents/{incident_id}/change-history` | Fetch incident update history. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:145-190` |
| `get_incident_triggers(incident_id)` | `GET /incidents/{incident_id}/triggers` | Fetch trigger data. No `fetchTriggerContext` argument is exposed. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:192-238` |
| `get_generated_tickets(incident_id)` | `GET /incidents/{incident_id}/tickets` | Fetch generated ticket data. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:240-291` |
| `get_incident_evidence(incident_id)` | `GET /incidents/{incident_id}/evidence` | Fetch evidence metadata/evidence URL, not inline payload bytes. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:293-339` |
| `dlp_incident_search(query_params=None, fields=None, time_range=None, **kwargs)` | `POST /incidents/search` | Search incidents by field filters/time range and pagination. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:341-450` |
| `incident_group_search(incident_id, incident_group_ids=None)` | `POST /incidents/{incident_id}/incident-groups/search` | Filter incident groups for an incident. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:452-492` |
| `assign_labels(incident_id, labels=None)` | `POST /incidents/{incident_id}/labels` | Attach labels to an incident. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:494-538` |
| `incident_notes(incident_id, notes=None)` | `POST /incidents/{incident_id}/notes` | Add notes to an incident. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:540-584` |
| `incident_close(incident_id, resolution_label=None, resolution_code=None, notes=None)` | `POST /incidents/{incident_id}/close` | Close/resolve an incident with optional label/code/notes. | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:586-645` |

Python does **not** expose an incident delete method in this file. Do not infer Python DELETE support from the Go SDK or legacy help.

The evidence method deserves careful wording. The Python docstring says it gets the evidence URL and that the link can be used to view/download the XML file with the actual triggering data (`vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:293-300`). The model exposes `fileName`, `fileType`, `additionalInfo`, and `evidenceURL` (`vendor/zscaler-sdk-python/zscaler/zwa/models/incident_evidence.py:22-57`). Treat the linked/downloadable evidence as sensitive DLP content, but do not say the API response always returns raw payload inline.

## DLP incidents - Go

Source: `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go`; `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go`.

Go service paths are rooted at `baseIncidentEndpoint = "/dlp/v1/incidents"` (`vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:14-16`), which is resolved against the configured ZWA host (`vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go:146-159`). The Go package exposes these functions:

| Function | HTTP/path | What it supports | Lines |
|---|---|---|---|
| `CreateNotes(ctx, service, dlpIncidentID, note)` | `POST /notes/{id}` | Add note. The path shape differs from Python/help ordering. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:102-118` |
| `UpdateIncidentStatus(ctx, service, dlpIncidentID, close)` | `POST /{id}/close` | Close incident with notes only. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:120-144` |
| `AssignLabels(ctx, service, dlpIncidentID, labels)` | `POST /{id}/labels` | Assign labels. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:146-166` |
| `FilterIncidentSearch(ctx, service, filters, paginationParams)` | `POST /search` | Search incidents with `CommonDLPIncidentFiltering`. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:168-179` |
| `AssignIncidentGroups(ctx, service, dlpIncidentID, groupIDs)` | `POST /{id}/incident-groups/search` | Search/filter incident groups, despite the "Assign" function name. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:181-201` |
| `GetIncidentTransactions(ctx, service, transactionID, paginationParams)` | `GET /transactions/{transactionID}` | Fetch incidents by transaction ID. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:204-221` |
| `GetDLPIncident(ctx, service, dlpIncidentID, fields)` | `GET /{id}` | Fetch incident details with optional field query params. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:223-253` |
| `DeleteDLPIncident(ctx, service, dlpIncidentID)` | `DELETE /{id}` | Go-only delete function in inspected SDKs. Runtime semantics are open. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:255-270` |
| `HistoryDLPIncident(ctx, service, dlpIncidentID)` | `GET /{id}/change-history` | Fetch change history. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:273-292` |
| `GetDLPIncidentTickets(ctx, service, dlpIncidentID, paginationParams)` | `GET /tickets/{id}` | Fetch generated ticket records. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:294-310` |
| `GetDLPIncidentTriggers(ctx, service, dlpIncidentID)` | `GET /{id}/triggers` | Fetch trigger data. No `fetchTriggerContext` argument is exposed. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:312-330` |
| `GetDLPIncidentEvidence(ctx, service, dlpIncidentID)` | `GET /{id}/evidence` | Fetch evidence metadata/evidence URL. | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:332-350` |

The Go shared incident model carries the same broad incident record fields used by search/detail calls: internal ID, transaction ID, source type/subtype/actions, severity, priority, matching policies, user/application/content/network info, status, resolution, assigned admin, notes, incident groups, tickets, and labels (`vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:15-45`). The shared filter body uses `fields` and `timeRange`, and pagination uses `page`, `pageSize`, and `pageId` (`vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:148-178`).

## Legacy help API map

Source: `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md`.

The legacy help capture lists these DLP incident endpoints in the Workflow Automation API reference:

| Method | Path | Help line(s) |
|---|---|---|
| GET | `/dlp/v1/incidents/transactions/{transactionId}` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:23-24`, `:47-50` |
| GET / DELETE | `/dlp/v1/incidents/{dlpIncidentId}` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:25-27`, `:215-249` |
| GET | `/dlp/v1/incidents/{dlpIncidentId}/change-history` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:28-29`, `:475-503` |
| GET | `/dlp/v1/incidents/{dlpIncidentId}/tickets` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:30-31`, `:541-560` |
| POST | `/dlp/v1/incidents/{dlpIncidentId}/incident-groups/search` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:32-33`, `:604-633` |
| POST | `/dlp/v1/incidents/{dlpIncidentId}/close` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:34-35`, `:668-692` |
| POST | `/dlp/v1/incidents/{dlpIncidentId}/notes` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:36-37`, `:907-926` |
| POST | `/dlp/v1/incidents/{dlpIncidentId}/labels` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:38-39`, `:1141-1165` |
| POST | `/dlp/v1/incidents/search` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:40-41`, `:1380-1433` |
| GET | `/dlp/v1/incidents/{dlpIncidentId}/triggers` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:42-43`, `:1592-1621` |
| GET | `/dlp/v1/incidents/{dlpIncidentId}/evidence` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:44-45`, `:1644-1686` |

Two divergences are worth preserving:

- Help documents optional `fetchTriggerContext` on trigger downloads (`vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:1592-1617`), while Python and Go trigger methods expose only `incident_id` (`vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:192-238`; `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:312-330`). Track this in [clarification zwa-05](../_meta/clarifications.md#zwa-05-trigger-context-query-param-sdk-coverage).
- Help and Go expose incident DELETE, while Python does not. Do not describe ZWA as create/read/update/delete complete; delete semantics and parity remain open in [clarification zwa-02](../_meta/clarifications.md#zwa-02-dlp-incident-delete-semantics).

## Audit logs

Source: `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`; `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go`.

Python exposes one audit-log method: `client.zwa.audit_logs.audit_logs(query_params=None, fields=None, time_range=None, **kwargs)` (`vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py:27-33`; `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:33-135`). It uses `POST /zwa/dlp/v1/customer/audit`, accepts field filters and a `timeRange` request body, and documents supported filter fields `Action`, `Resource`, `Admin`, and `Module` (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:33-60`, `:108-122`).

Go exposes `customeraudit.GetCustomerAudit(ctx, service, filters, paginationParams)` against `/dlp/v1/customer/audit`, using POST and the same shared `CommonDLPIncidentFiltering` body (`vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:12-47`; `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:148-178`). Go's `AuditLog` struct includes `action`, `module`, `resource`, `changedAt`, `changedBy`, `oldRowJson`, `newRowJson`, and `changeNote` (`vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:21-34`).

See [`./audit-logs.md`](./audit-logs.md) for the dedicated audit-log model and open retention/streaming questions.

## Non-surfaces from this pass

Source: `vendor/zscaler-api-specs/oneapi-postman-collection.json`; `vendor/terraform-provider-zia/zia/data_source_zia_dlp_incident_receiver_servers.go`; `vendor/ziacloud-ansible/plugins/modules/zia_dlp_incident_receiver_info.py`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/discovery.py`; `vendor/zscaler-mcp-server/docs/guides/supported-tools.md`.

- **MCP:** no ZWA Workflow Automation tool was found in the inspected MCP server source. Current discovery imports every module under `src/zscaler_mcp/tools`, and the generated service inventory has no ZWA family (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/discovery.py:1-35`; `vendor/zscaler-mcp-server/docs/guides/supported-tools.md:11-22`). This is an audit-scoped absence, not a claim about future/private tooling.
- **Postman:** no ZWA Workflow Automation surface was found in the inspected OneAPI Postman collection. The collection contains a "DLP Incident Receiver" group, but it is under ZIA ICAP/DLP Incident Receiver configuration (`vendor/zscaler-api-specs/oneapi-postman-collection.json:1928-1955`).
- **Terraform/Ansible:** ZIA DLP Incident Receiver read surfaces exist (`vendor/terraform-provider-zia/zia/data_source_zia_dlp_incident_receiver_servers.go:10`, `:51-64`; `vendor/ziacloud-ansible/plugins/modules/zia_dlp_incident_receiver_info.py:31`, `:119-124`), but this pass did not find Terraform or Ansible ZWA Workflow Automation incident lifecycle, audit-log, workflow-template, or workflow-mapping resources/modules.

## Usage guardrails

Source: `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go`; `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md`.

- Say **incident lifecycle API**, not workflow management API. Incident search/detail/history/tickets/triggers/evidence/labels/notes/close are source-backed; workflow template/mapping create-update-delete-list operations are not source-backed in this pass.
- Say **evidence URL / downloadable evidence XML**, not "raw evidence always returned inline" (`vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:293-300`; `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:1644-1686`).
- Preserve cross-SDK differences: Python does not expose delete; Go and help do (`vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:255-270`; `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:215-244`).
- Preserve auth differences: Python current `client.zwa` is OneAPI-client-shaped, while Python legacy and Go are API-key/token-shaped (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:165-184`, `:636-656`; `vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:212-294`).

## Open questions

- **Workflow configuration programmability** - see [clarification zwa-01](../_meta/clarifications.md#zwa-01-workflow-configuration-programmability).
- **DLP incident delete semantics** - see [clarification zwa-02](../_meta/clarifications.md#zwa-02-dlp-incident-delete-semantics).
- **Audit-log retention and streaming/SIEM support** - see [clarification zwa-03](../_meta/clarifications.md#zwa-03-zwa-audit-log-retention-and-streaming).
- **Current-vs-legacy auth boundary** - see [clarification zwa-04](../_meta/clarifications.md#zwa-04-current-vs-legacy-auth-boundary).
- **Trigger context query parameter SDK coverage** - see [clarification zwa-05](../_meta/clarifications.md#zwa-05-trigger-context-query-param-sdk-coverage).

## Cross-links

- Product model and workflow templates - [`./overview.md`](./overview.md)
- Audit-log details - [`./audit-logs.md`](./audit-logs.md)
- Claims ledger - [`./_claims-ledger.md`](./_claims-ledger.md)
