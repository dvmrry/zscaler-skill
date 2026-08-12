---
product: zwa
topic: "zwa-claims-ledger"
title: "ZWA claims ledger - Tier 3 first-pass refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/what-workflow-automation.md"
  - "vendor/zscaler-help/zwa-managing-incidents.md"
  - "vendor/zscaler-help/understanding-workflows-workflow-automation.md"
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
  - "vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py"
  - "vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/errorx/errors.go"
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

# ZWA claims ledger

This ledger covers the Workflow Automation claims changed or explicitly guarded in the Tier 3 first-pass ZWA refresh. Rows either point to exact source lines or mark the item as an open question / audit-scoped absence.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| ZWA is Zscaler Workflow Automation for governance-admin management and resolution of DLP incidents. | `index.md`, `overview.md` | `vendor/zscaler-help/what-workflow-automation.md:14` |
| Workflow Automation integrates with Internet & SaaS to capture Data Protection incidents generated from DLP policies. | `index.md`, `overview.md` | `vendor/zscaler-help/what-workflow-automation.md:14` |
| The Incidents page lists metadata and the data that triggered the incident. | `index.md`, `overview.md`, `api.md` | `vendor/zscaler-help/what-workflow-automation.md:16` |
| Workflow Automation can group incidents into incident groups, assign priorities to those groups, and route groups to admins. | `index.md`, `overview.md` | `vendor/zscaler-help/what-workflow-automation.md:18` |
| ZWA workflow management supports notifying users, escalating to managers/approvers, and automatically performing remediation actions. | `overview.md` | `vendor/zscaler-help/what-workflow-automation.md:20-25` |
| The Incidents page records transactions violating Inline DLP, Endpoint DLP, Email DLP, and SaaS Security DLP policies configured in the Zscaler Admin Console. | `index.md`, `overview.md` | `vendor/zscaler-help/zwa-managing-incidents.md:16` |
| Incident dashboard/status widgets include Open, Unassigned, Resolved, Waiting Feedback, Escalated, and Response Available states. | `overview.md` | `vendor/zscaler-help/zwa-managing-incidents.md:47-57` |
| Incident table fields include transaction ID, priority, severity, DLP admin, source DLP type, DLP type, labels, status, engines, dictionaries, rules, action, destination, incident date, incident groups, user, file, application, and DLP-source-specific fields. | `overview.md`, `api.md` | `vendor/zscaler-help/zwa-managing-incidents.md:82-141` |
| Incidents can be searched by free-form All search, Transaction ID, and date/time filters; Transaction ID search supports up to 10 IDs. | `overview.md` | `vendor/zscaler-help/zwa-managing-incidents.md:60-80`, `:154-200` |
| Available portal actions include assign DLP admin, assign to me, assign priority, close incident, notify user, investigating, escalate, label, and update incident group. | `overview.md` | `vendor/zscaler-help/zwa-managing-incidents.md:214-221`, `:267-285`, `:288-367` |
| Closed incidents have status Resolved, and after closure admins can still perform all other actions except Investigating and Escalate while status remains Resolved. | `overview.md` | `vendor/zscaler-help/zwa-managing-incidents.md:267-285` |
| Predefined workflow templates include auto-close, auto-create-ticket, auto-escalate, auto-notify, notify-and-close, concurrent notify/escalate, sequential notify/escalate, and notify/escalate-to-manager variants. | `overview.md` | `vendor/zscaler-help/understanding-workflows-workflow-automation.md:27-39` |
| Workflow mappings are required after configuring a predefined or custom workflow; the mapping chooses incident attributes that trigger the workflow. | `overview.md` | `vendor/zscaler-help/understanding-workflows-workflow-automation.md:43` |
| Python current-client `client.zwa` resolves to `ZWAService` unless the client is in legacy mode. | `api.md`, `index.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:287-293` |
| Python `ZWAService` exposes only `audit_logs` and `dlp_incidents` service properties. | `api.md`, `audit-logs.md` | `vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py:21-41` |
| Python OneAPI configuration uses `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` or `ZSCALER_PRIVATE_KEY`, and `ZSCALER_VANITY_DOMAIN` for current-client auth. | `api.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:173-184`, `:241-252` |
| Python `LegacyZWAClient` uses `key_id`, `key_secret`, `cloud`, and optional `partnerId`, with environment variables `ZWA_CLIENT_ID`, `ZWA_CLIENT_SECRET`, and `ZWA_CLOUD`. | `api.md` | `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:738-758` |
| Python `LegacyZWAClientHelper` defaults to `https://api.<cloud>.zsworkflow.net`, requires key ID and secret, obtains a token from `/v1/auth/api-key/token`, and sets `Authorization: Bearer <token>`. | `api.md` | `vendor/zscaler-sdk-python/zscaler/zwa/legacy.py:47-65`, `:120-126`, `:140-185` |
| Legacy help says ZWA API authentication uses API key ID + key secret, `POST /v1/auth/api-key/token`, token/token_type/expires_in, and bearer-token use for subsequent requests. | `api.md` | `vendor/zscaler-help/legacy-getting-started-workflow-automation-api.md:8-17`, `vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md:8-37` |
| Go ZWA configuration uses `ZWA_API_KEY_ID`, `ZWA_API_SECRET`, optional `ZWA_CLOUD`, and `https://api.<cloud>.zsworkflow.net`; it authenticates against `/v1/auth/api-key/token`. | `api.md` | `vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go:45-49`, `:80-105`, `:140-180`; `vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:245-327` |
| Go SDK v3.8.43 ZWA 5xx retry decisions use the shared SDK heuristic; 501 is not retried, 502/503/504 always are, and other 5xx responses stop only for a top-level nonempty string JSON `code` when no exact transient marker is present. This is client behavior, not a ZWA backend taxonomy. | `api.md`, `index.md` | `vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:222-237`; `vendor/zscaler-sdk-go/zscaler/errorx/errors.go:279-364` |
| The Go ZWA retry-exhaustion handler can preserve the last response for normal `ErrorResponse` classification; the structured error retains HTTP/parsed fields and raw body text while consuming and closing the original body. | `api.md`, `index.md` | `vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:107-129,495-515`; `vendor/zscaler-sdk-go/zscaler/errorx/errors.go:13-28,57-110` |
| Python DLP incident methods cover transaction lookup, detail lookup, change history, triggers, generated tickets, evidence URL, incident search, incident group search, labels, notes, and close. | `api.md` | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:39`, `:92`, `:145`, `:192`, `:240`, `:293`, `:341`, `:452`, `:494`, `:540`, `:586` |
| Python DLP methods use `/zwa/dlp/v1` as the base endpoint. | `api.md` | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:32-37` |
| Python incident search is a POST to `/zwa/dlp/v1/incidents/search`, accepts fields/timeRange, and documents max `page_size` 100. | `api.md` | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:341-450`, especially `:369-374`, `:422-427` |
| Python evidence method returns an evidence URL and the model exposes `fileName`, `fileType`, `additionalInfo`, and `evidenceURL`. | `api.md` | `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:293-339`, `vendor/zscaler-sdk-python/zscaler/zwa/models/incident_evidence.py:22-57` |
| Go DLP incident functions include note creation, status close, assign labels, incident search, incident group assignment/search, transaction lookup, detail lookup, delete, history, ticket lookup, triggers, and evidence. | `api.md` | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:102`, `:120`, `:146`, `:168`, `:181`, `:206`, `:224`, `:256`, `:274`, `:295`, `:312`, `:332` |
| Go DLP incident package endpoint base is `/dlp/v1/incidents`; when used through the ZWA client, the configured base URL is the `api.<cloud>.zsworkflow.net` host. | `api.md` | `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:14-16`, `vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go:146-159` |
| Legacy help lists DELETE and GET on `/dlp/v1/incidents/{dlpIncidentId}`, plus search, close, notes, labels, tickets, triggers, evidence, change-history, and incident-groups/search endpoints. | `api.md` | `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:23-45`, `:215-249`, `:1380-1397`, `:1592-1648` |
| Python audit logs expose a single `audit_logs()` method under `client.zwa.audit_logs`. | `audit-logs.md`, `api.md` | `vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py:27-33`, `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:33-135` |
| Python audit-log method uses POST `/zwa/dlp/v1/customer/audit`, field filters, and a `timeRange` body. | `audit-logs.md`, `api.md` | `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:33-39`, `:40-60`, `:108-122` |
| Python audit-log model exposes `cursor` and `logs`; each log object exposes `action`, `module`, and `resource`. | `audit-logs.md` | `vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py:24-53`, `:65-106` |
| Go audit logs expose `customeraudit.GetCustomerAudit`, POST `/dlp/v1/customer/audit`, and fields including action, module, resource, changedAt, changedBy, oldRowJson, newRowJson, and changeNote. | `audit-logs.md`, `api.md` | `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:12-47` |
| Go shared `CommonDLPIncidentFiltering` uses `fields` and `timeRange`; `PaginationParams` uses `page`, `pageSize`, and `pageId`. | `audit-logs.md`, `api.md` | `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:148-178` |
| Go shared paging default is 1000, while Python DLP/audit docstrings and legacy help document max page size 100; runtime max remains unverified here. | `audit-logs.md`, `api.md` | `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:13`, `:190-203`; `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:55-60`; `vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:1407-1412` |
| No MCP Workflow Automation/ZWA tool was found in the inspected MCP server source. | `index.md`, `api.md` | AUDIT-SCOPED ABSENCE: registry discovery imports every current tool module (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/discovery.py:1-35`), and the generated service inventory contains no ZWA family (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:11-22`); the 2026-07-16 re-check found no ZWA/DLP-incident/customer-audit tool or prompt under `src/zscaler_mcp/tools` or `src/zscaler_mcp/prompts/catalog`. |
| No ZWA Workflow Automation Postman surface was found in the OneAPI Postman collection; the lone "DLP Incident Receiver" hit is under ZIA ICAP/DLP Incident Receiver config. | `index.md`, `api.md` | `vendor/zscaler-api-specs/oneapi-postman-collection.json:1928-1955`; `UNSUPPORTED / audit-scoped absence -> rg -n -i "workflow automation|ZWA|dlp incident|dlp_incident|customeraudit" vendor/zscaler-api-specs` |
| Terraform and Ansible hits are ZIA DLP Incident Receiver read surfaces, not ZWA Workflow Automation incident lifecycle/configuration surfaces. | `index.md`, `api.md` | `vendor/terraform-provider-zia/zia/data_source_zia_dlp_incident_receiver_servers.go:10`, `:51-64`; `vendor/ziacloud-ansible/plugins/modules/zia_dlp_incident_receiver_info.py:31`, `:119-124`; `UNSUPPORTED / audit-scoped absence -> rg -n -i "workflow automation|\\bzwa\\b|zsworkflow|customeraudit|customer/audit" vendor/terraform-provider-* vendor/*ansible*` |
| No SDK/MCP/Postman/Terraform/Ansible source in this pass exposes workflow template, workflow mapping, or custom workflow create/update/delete/list operations. | `api.md`, `overview.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zwa-01-workflow-configuration-programmability` |
| Go exposes `DeleteDLPIncident` and legacy help documents DELETE, but Python does not expose delete and sources do not explain runtime semantics or whether this differs from close/resolved. | `api.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zwa-02-dlp-incident-delete-semantics` |
| ZWA audit-log retention period and push/streaming/SIEM export support are not documented in the inspected sources. | `audit-logs.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zwa-03-zwa-audit-log-retention-and-streaming` |
| The exact current-vs-legacy support boundary across Python OneAPI, Python LegacyZWAClient, Go ZWA, and legacy help pages remains a migration question rather than a single hard rule. | `api.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zwa-04-current-vs-legacy-auth-boundary` |
| Help documents optional `fetchTriggerContext` for trigger downloads, while Python and Go trigger methods expose only `incident_id`; SDK parity and workaround are unresolved. | `api.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zwa-05-trigger-context-query-param-sdk-coverage` |
