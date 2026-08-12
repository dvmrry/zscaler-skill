---
product: zwa
topic: "zwa-overview"
title: "ZWA overview - incidents, workflows, templates"
content-type: reasoning
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/workflow-automation/what-workflow-automation"
  - "vendor/zscaler-help/what-workflow-automation.md"
  - "https://help.zscaler.com/workflow-automation/managing-incidents"
  - "vendor/zscaler-help/zwa-managing-incidents.md"
  - "https://help.zscaler.com/workflow-automation/understanding-workflows-workflow-automation"
  - "vendor/zscaler-help/understanding-workflows-workflow-automation.md"
  - "vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py"
  - "vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go"
author-status: draft
---

# ZWA overview - incidents, workflows, and templates

Source: `vendor/zscaler-help/what-workflow-automation.md`; `vendor/zscaler-help/zwa-managing-incidents.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`.

Workflow Automation turns DLP policy violations into trackable incidents that governance admins can review, assign, prioritize, notify on, escalate, ticket, label, and close. Zscaler's overview says ZWA automates management and resolution of DLP incidents and integrates with Internet & SaaS to capture Data Protection incidents generated from configured DLP policies (`vendor/zscaler-help/what-workflow-automation.md:14`). The Managing Incidents capture widens the incident source list to Inline DLP, Endpoint DLP, Email DLP, and SaaS Security DLP policies in the Zscaler Admin Console (`vendor/zscaler-help/zwa-managing-incidents.md:16`).

## Core objects

Source: `vendor/zscaler-help/what-workflow-automation.md`; `vendor/zscaler-help/zwa-managing-incidents.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`.

- **Incident** - a recorded transaction that violated a Data Protection policy. The Incidents page records metadata and the data that triggered the incident (`vendor/zscaler-help/what-workflow-automation.md:16`).
- **Incident group** - a grouping/priority/ownership construct. ZWA can group incidents, assign priorities to those groups, and assign groups to admins (`vendor/zscaler-help/what-workflow-automation.md:18`).
- **Workflow** - an automated remediation sequence. Predefined and custom workflows perform actions such as notify user, escalate, create ticket, and close incident (`vendor/zscaler-help/understanding-workflows-workflow-automation.md:16-21`).
- **Workflow mapping** - the binding between incident attributes and a workflow. After configuring a workflow, admins must map it to incident transaction attributes so matching incidents trigger the workflow (`vendor/zscaler-help/understanding-workflows-workflow-automation.md:43`).

## Incident lifecycle

Source: `vendor/zscaler-help/zwa-managing-incidents.md`.

The source-backed manual process is:

1. A transaction violates one of the configured Data Protection policies and becomes a ZWA incident (`vendor/zscaler-help/zwa-managing-incidents.md:16`).
2. Workflow Automation assigns the incident to an admin who has edit access to the incident group; unmapped groups are not auto-assigned and require super-admin assignment (`vendor/zscaler-help/zwa-managing-incidents.md:20-24`).
3. The admin reviews the incident, investigates, and chooses whether to notify the end user or escalate to a manager/approver depending on severity (`vendor/zscaler-help/zwa-managing-incidents.md:26-31`).
4. The user, manager, or approver can provide justification/advice; the admin proceeds with the incident or closes it based on the response (`vendor/zscaler-help/zwa-managing-incidents.md:27-29`).

The Incidents page supports dashboard widgets for All, Open, Unassigned, Resolved, Waiting Feedback, Escalated, and Response Available states (`vendor/zscaler-help/zwa-managing-incidents.md:47-57`). It also exposes incident search by free-form All search or by up to 10 transaction IDs (`vendor/zscaler-help/zwa-managing-incidents.md:60-80`), date/time filtering with a custom range limit of incidents up to six months old and a maximum three-month rolling window (`vendor/zscaler-help/zwa-managing-incidents.md:154-200`), and CSV export with at most three concurrent bulk activities/downloads (`vendor/zscaler-help/zwa-managing-incidents.md:207-211`).

## Incident fields

Source: `vendor/zscaler-help/zwa-managing-incidents.md`; `vendor/zscaler-sdk-python/zscaler/zwa/models/incident_details.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go`.

Incident records are rich enough to drive triage, ownership, and evidence handling. The portal field list includes transaction ID, duplicate count, creation/change dates, priority, severity, DLP admin, source DLP type, DLP type, labels, status, engine/dictionary/rule/action, destination, incident date, incident groups, justification fields, username, client IP, file fields, application fields, integration, channel, collaborator/share metadata, recipient metadata, protocol, groups, destination type, component/content/workspace/domains, and other source-specific fields (`vendor/zscaler-help/zwa-managing-incidents.md:82-141`). The SDK models overlap with this shape: Python `IncidentDLPDetails` includes `internal_id`, `integration_type`, `transaction_id`, source fields, severity, priority, matching policies, user/application/content/network info, status, resolution, notes, tickets, groups, and labels (`vendor/zscaler-sdk-python/zscaler/zwa/models/incident_details.py:24-75`, `:168-204`), and Go `IncidentDetails` maps the same major JSON fields (`vendor/zscaler-sdk-go/zscaler/zwa/services/common/common.go:15-45`).

## Manual actions

Source: `vendor/zscaler-help/zwa-managing-incidents.md`.

The captured portal action set is broader than the SDK action set. From the Incidents page, admins can assign DLP admin, assign to self, assign priority, close incident, notify user, mark investigating, escalate, add/remove labels, and update incident groups (`vendor/zscaler-help/zwa-managing-incidents.md:214-221`, `:222-260`, `:267-367`). Bulk actions repeat many of those operations across selected incidents or all filtered incidents (`vendor/zscaler-help/zwa-managing-incidents.md:443-560`).

Two source-backed details matter operationally:

- Closing an incident sets status to Resolved; after closure, admins can still perform all other actions except Investigating and Escalate, while status remains Resolved (`vendor/zscaler-help/zwa-managing-incidents.md:267-285`).
- Updating incident groups can add/delete assigned groups, choose a default group to avoid unassigned incidents, and update admin assignment; priority may change based on the final incident group list (`vendor/zscaler-help/zwa-managing-incidents.md:367-435`).

## Workflow templates

Source: `vendor/zscaler-help/understanding-workflows-workflow-automation.md`.

Zscaler documents nine predefined workflow templates (`vendor/zscaler-help/understanding-workflows-workflow-automation.md:27-38`):

| Template | Source-backed behavior |
|---|---|
| Auto Close Data Protection Incident With Resolution Label | Sets incident status to Resolved and adds a resolution label. |
| Auto Close Data Protection Incident | Sets incident status to Resolved. |
| Auto Create Tickets | Creates a ticket in a ticketing integration such as ServiceNow or Jira Software. |
| Auto Escalate | Escalates to the user's manager, or an approver if the manager is not found. |
| Auto Notify | Notifies the user through email, Slack, or Microsoft Teams. |
| Auto Notify User and Close Incident | Notifies the user and closes if no response arrives after a configured number of seconds. |
| Auto Notify User and Concurrently Escalate | Notifies the user and escalates to manager/approver without waiting for user response. |
| Auto Notify User and Escalate | Notifies the user, then escalates if the user does not respond after a configured number of seconds. |
| Auto Notify User and Escalate to Manager | Notifies the user and optionally escalates to the manager if the user does not respond after a configured number of seconds. |

Custom workflows are also supported in the portal: admins choose and configure steps/actions without using a template (`vendor/zscaler-help/understanding-workflows-workflow-automation.md:39`). This refresh did **not** find SDK, MCP, Postman, Terraform, or Ansible create/update/delete/list operations for workflow templates, custom workflows, or workflow mappings. Treat workflow configuration as portal-backed unless [clarification zwa-01](../_meta/clarifications.md#zwa-01-workflow-configuration-programmability) is resolved.

## What ZWA is not

Source: `vendor/zscaler-help/what-workflow-automation.md`; `vendor/zscaler-help/zwa-managing-incidents.md`; `vendor/zscaler-help/understanding-workflows-workflow-automation.md`.

- **Not DLP policy authoring.** DLP policies exist upstream in the Zscaler Admin Console; ZWA records incidents after those policies are violated (`vendor/zscaler-help/zwa-managing-incidents.md:16`).
- **Not a general SOAR platform in the captured sources.** The documented workflow templates are DLP-incident-specific actions such as notify, escalate, ticket, and close (`vendor/zscaler-help/understanding-workflows-workflow-automation.md:27-38`).
- **Not ZPA access automation.** The captured ZWA sources talk about Data Protection incidents and Workflow Automation for Data Protection, not Private Access policy automation.
- **Not a ZIA DLP Incident Receiver.** Terraform/Ansible/Postman hits for "DLP Incident Receiver" in this pass are ZIA ICAP/DLP receiver configuration surfaces, not ZWA incident lifecycle APIs (`vendor/zscaler-api-specs/oneapi-postman-collection.json:1928-1955`).

## Open questions

Source: `vendor/zscaler-help/understanding-workflows-workflow-automation.md`; `vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go`.

- **Workflow configuration programmability** - no SDK/MCP/Postman/Terraform/Ansible workflow template or mapping create/update/delete/list operation was found in this pass. See [clarification zwa-01](../_meta/clarifications.md#zwa-01-workflow-configuration-programmability).
- **Go incident delete semantics** - Go and legacy help expose DELETE, but Python does not, and the runtime effect compared with closing/resolving is not established. See [clarification zwa-02](../_meta/clarifications.md#zwa-02-dlp-incident-delete-semantics).
- **Exact current-vs-legacy auth boundary** - Python current, Python legacy, Go, and legacy help do not collapse to one simple rule. See [clarification zwa-04](../_meta/clarifications.md#zwa-04-current-vs-legacy-auth-boundary).

## Cross-links

- API surface and auth details - [`./api.md`](./api.md)
- ZWA audit logs - [`./audit-logs.md`](./audit-logs.md)
- Upstream ZIA DLP - [`../zia/dlp.md`](../zia/dlp.md)
- Upstream ZIA SSL/TLS Inspection for inline DLP visibility - [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- Cross-product DLP dependencies - [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
