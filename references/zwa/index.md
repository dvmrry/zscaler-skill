---
product: zwa
topic: "zwa-index"
title: "Workflow Automation (ZWA) reference hub"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
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
  - "vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py"
  - "vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py"
  - "vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go"
  - "vendor/zscaler-sdk-go/zscaler/errorx/errors.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/discovery.py"
  - "vendor/zscaler-mcp-server/docs/guides/supported-tools.md"
  - "vendor/terraform-provider-zia/zia/data_source_zia_dlp_incident_receiver_servers.go"
  - "vendor/ziacloud-ansible/plugins/modules/zia_dlp_incident_receiver_info.py"
author-status: draft
---

# Zscaler Workflow Automation (ZWA) reference hub

Source: `vendor/zscaler-help/what-workflow-automation.md`; `vendor/zscaler-help/zwa-managing-incidents.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`.

Entry point for Zscaler Workflow Automation: the DLP incident management and remediation product. Zscaler describes Workflow Automation as an application for governance admins to automate management and resolution of Data Loss Prevention incidents, and says it integrates with Internet & SaaS to capture Data Protection incidents generated from DLP policies (`vendor/zscaler-help/what-workflow-automation.md:14`). The product's Incidents page is a closed-loop review/remediation surface that lists incident metadata and the data that triggered the incident (`vendor/zscaler-help/what-workflow-automation.md:16`).

## Where ZWA sits

Source: `vendor/zscaler-help/what-workflow-automation.md`; `vendor/zscaler-help/zwa-managing-incidents.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`.

Use ZWA when the question is about **what happens after a DLP policy violation becomes an incident**: review, assign, prioritize, notify, escalate, create tickets, label, close, or audit the incident lifecycle. The captured help article for Managing Incidents says the Incidents page records transactions that violated Inline DLP, Endpoint DLP, Email DLP, and SaaS Security DLP policies configured in the Zscaler Admin Console (`vendor/zscaler-help/zwa-managing-incidents.md:16`). That is broader than a ZIA-inline-only mental model.

ZWA is downstream of DLP detection, not a replacement for DLP policy authoring. Workflow Automation groups incidents into incident groups and assigns priorities/admin ownership (`vendor/zscaler-help/what-workflow-automation.md:18`), then admins can remediate manually or configure predefined/custom workflows that automatically notify users, escalate, create tickets, or close incidents (`vendor/zscaler-help/understanding-workflows-workflow-automation.md:16-23`, `:27-43`).

Questions that land here: "what happens after DLP fires?", "can I search for a DLP incident by transaction ID?", "how do I notify or escalate a user-facing DLP incident?", "can the SDK fetch evidence or generated tickets?", "why is my ZWA API client using API key auth instead of OneAPI?"

## Topics

Source: `vendor/zscaler-help/what-workflow-automation.md`; `vendor/zscaler-help/zwa-managing-incidents.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`; `vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`.

| Topic | File | Status |
|---|---|---|
| Overview - product model, incident lifecycle, portal actions, workflow templates and mappings | [`./overview.md`](./overview.md) | draft |
| API surface - Python/Go incident services, audit logs, current-vs-legacy auth, explicit non-surfaces | [`./api.md`](./api.md) | draft |
| Audit logs - customer audit query shape, SDK models, open retention/streaming questions | [`./audit-logs.md`](./audit-logs.md) | draft |
| Claims ledger - claim-by-claim source map and open-question forcing function for this refresh | [`./_claims-ledger.md`](./_claims-ledger.md) | draft |

## Scope

Source: `vendor/zscaler-help/zwa-managing-incidents.md`; `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py`; `vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`.

In scope:

- DLP incident lifecycle in the Workflow Automation console.
- Incident grouping, priority, DLP admin assignment, user notification, escalation, labeling, and closure actions from the captured help surface (`vendor/zscaler-help/zwa-managing-incidents.md:214-221`, `:267-285`, `:288-367`).
- Python `client.zwa.dlp_incidents` and `client.zwa.audit_logs`, which are the only two current Python service properties under ZWA (`vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py:27-41`).
- Go `zwa/services/dlp_incidents` and `zwa/services/customeraudit`, including the Go-only `DeleteDLPIncident` function that should not be projected onto Python (`vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:256-270`).
- Auth differences between Python current OneAPI client, Python `LegacyZWAClient`, Go ZWA API-key auth, and the legacy help captures (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:173-184`, `:738-758`; `vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:245-327`; `vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md:8-37`).
- Go v3.8.43 ZWA retry/error behavior, including its shared 5xx retry heuristic and the structured-error path that consumes the response body (`vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:107-129,222-237,495-515`; `vendor/zscaler-sdk-go/zscaler/errorx/errors.go:13-28,57-110,279-364`). Treat these as SDK mechanics, not ZWA backend error taxonomy.

Not in scope or explicitly absent from this source pass:

- No SDK/MCP/Postman/Terraform/Ansible workflow template or workflow mapping create/update/delete/list operation was found; treat workflow configuration programmability as unresolved, not as a supported automation target. See [clarification zwa-01](../_meta/clarifications.md#zwa-01-workflow-configuration-programmability).
- No ZWA Workflow Automation MCP tool was found in the inspected MCP server source. Current discovery imports the complete tool tree, and the generated service inventory contains no ZWA family (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/discovery.py:1-35`; `vendor/zscaler-mcp-server/docs/guides/supported-tools.md:11-22`). This is an audit-scoped absence, not proof about future/private tools.
- No ZWA Workflow Automation Postman surface was found in the inspected OneAPI Postman collection. The lone "DLP Incident Receiver" hit is a ZIA ICAP/DLP Incident Receiver configuration area (`vendor/zscaler-api-specs/oneapi-postman-collection.json:1928-1955`).
- Terraform and Ansible hits in this pass are ZIA DLP Incident Receiver lookup surfaces, not ZWA incident lifecycle or workflow automation surfaces (`vendor/terraform-provider-zia/zia/data_source_zia_dlp_incident_receiver_servers.go:10`, `:51-64`; `vendor/ziacloud-ansible/plugins/modules/zia_dlp_incident_receiver_info.py:31`, `:119-124`).

## Routing notes

Source: `vendor/zscaler-help/zwa-managing-incidents.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`.

- **"DLP triggered but no ZWA incident appears"** - first verify the upstream DLP policy and source type. ZWA is downstream of the recorded DLP incident; the Incidents page is populated by transactions violating configured DLP policies (`vendor/zscaler-help/zwa-managing-incidents.md:16`). For inline web DLP, cross-check ZIA SSL/TLS Inspection and DLP policy scope in [`../zia/dlp.md`](../zia/dlp.md) and [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md).
- **"Incident exists but workflow did not run"** - workflow configuration is separate from incident ingestion. Zscaler says admins must map a workflow to incident transaction attributes before it automatically triggers (`vendor/zscaler-help/understanding-workflows-workflow-automation.md:43`).
- **"Can I automate this?"** - incident search/retrieval, notes, labels, close, evidence URL, generated tickets, and audit-log search have SDK surfaces; workflow template/mapping configuration is not source-backed as programmable in this pass.
