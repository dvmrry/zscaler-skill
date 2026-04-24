---
product: zwa
topic: "zwa-index"
title: "Workflow Automation (ZWA) reference hub"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: draft
---

# Zscaler Workflow Automation (ZWA) reference hub

Entry point for Workflow Automation — Zscaler's **DLP incident lifecycle management** product. Closes the loop between ZIA Data Protection (which detects DLP violations) and operator remediation (review, notify user, escalate, create ticket, close) either manually or via configurable automated workflows.

## What ZWA is for

ZIA's DLP engine detects data-loss policy violations during traffic inspection (see [`../zia/malware-and-atp.md`](../zia/malware-and-atp.md) for the adjacent cybersecurity-policy model and [`../zia/ssl-inspection.md § SSL bypass is a cross-policy gate`](../zia/ssl-inspection.md) for the DLP-needs-decrypt dependency). ZWA picks up where detection ends: each DLP event lands as an **incident** in ZWA's admin console. Admins can triage manually or configure **workflows** that auto-notify users, escalate to managers, create tickets in external systems (ServiceNow, Jira), or close the incident.

Questions that land here: "what happens after DLP fires?", "how do I notify users about DLP violations?", "can I auto-create Jira tickets from DLP incidents?", "what's the difference between incident status Resolved vs Closed?"

## Topics

| Topic | File | Status |
|---|---|---|
| Overview — incident model, workflow templates (9 predefined), manual vs automated remediation, ZIA→ZWA integration | [`./overview.md`](./overview.md) | draft |
| API surface — `client.zwa.*` in Python and Go SDKs, incident search/triggers/tickets/evidence, audit logs | [`./api.md`](./api.md) | draft |

## Scope

In scope:

- Incident lifecycle (detection via ZIA DLP → Workflow Automation ingestion → triage → remediation)
- Incident groups + priority assignment + admin ownership
- Workflow templates (9 predefined: Auto Close, Auto Create Tickets, Auto Escalate, Auto Notify variants)
- Custom workflows
- Workflow mappings (which incidents trigger which workflow)
- Notification channels (email, Slack, Microsoft Teams)
- Ticketing integration (ServiceNow, Jira Software)
- API surface: both Python and Go SDK `zwa` modules, audit logs

Not in scope (explicitly deferred):

- **Per-cloud DLP integration configuration** (Azure DLP, AWS DLP integration) — help articles exist (`configuring-azure-dlp-application-integration-*`, `configuring-amazon-web-services-dlp-application-integration-*`) but are operational and vendor-specific.
- **Notification channel setup** (configuring Slack webhooks, Teams bots, email templates) — operational config; not reasoning-focused.
- **Ticketing integration setup** (ServiceNow, Jira auth + field mapping) — integration-specific; operational.

## When the question spans ZWA + another product

- **"DLP triggered but no incident appears in Workflow Automation"** — ZIA side didn't produce an incident. Check ZIA DLP is inspecting (SSL must decrypt — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)), and check ZWA integration with ZIA is enabled.
- **"DLP incident fires but workflow doesn't trigger"** — workflow mapping missing for the incident's attributes, or workflow is disabled. See [`./overview.md § Workflow mappings`](./overview.md).
- **"Why does ZWA get partial data from ZIA?"** — DLP only sees decrypted content. SSL bypass upstream means ZIA DLP saw nothing, so ZWA has nothing to ingest. Cross-ref [`../shared/cross-product-integrations.md § SSL Inspection`](../shared/cross-product-integrations.md).
