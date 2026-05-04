---
product: zwa
topic: "zwa-overview"
title: "ZWA overview — incidents, workflows, templates"
content-type: reasoning
last-verified: "2026-05-04"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/workflow-automation/what-workflow-automation"
  - "vendor/zscaler-help/what-workflow-automation.md"
  - "https://help.zscaler.com/workflow-automation/managing-incidents"
  - "vendor/zscaler-help/zwa-managing-incidents.md"
  - "https://help.zscaler.com/workflow-automation/understanding-workflows-workflow-automation"
  - "vendor/zscaler-help/understanding-workflows-workflow-automation.md"
author-status: draft
---

# ZWA overview — incidents, workflows, and templates

How Workflow Automation turns raw ZIA DLP detections into trackable incidents, and how admins remediate them either by hand or via configurable workflows.

## Summary

- **Incident** = a single DLP policy violation captured from ZIA. Each incident carries metadata (who, what, when, which policy) plus the data that triggered it (the actual payload fragment DLP matched on).
- **Incident Group** = a collection of incidents grouped for assignment / prioritization. Admins can bulk-triage groups.
- **Workflow** = a sequence of remediation actions that fires when an incident matches a **workflow mapping**. Can be predefined (from a template) or custom.
- **Workflow Template** = one of 9 Zscaler-provided workflow patterns (auto-close, auto-create-ticket, auto-notify, auto-escalate, and variants).
- **Workflow Mapping** = the link between incident attributes and a workflow. "When an incident has attributes X, Y, Z → fire workflow A."
- **Incident Group Mapping** = a *named concept distinct from Workflow Mapping* — rules that automatically assign incoming incidents to incident groups based on attributes (vs. a Workflow Mapping, which fires a remediation workflow).
- **Duplicate Incidents** = a *named concept* in ZWA — detection and handling of repeated incidents arising from the same activity (deduplication semantics for noise reduction).
- **Approvers** = designated escalation recipients beyond the manager chain. If a user has no manager in the directory, escalation falls back to a configured approver.

Two remediation modes:

1. **Manual** — admin reviews each incident on the Incidents page, takes actions (investigate, notify user, escalate, create ticket, close).
2. **Automated** — workflows run the same actions without admin intervention when mappings match.

Users, managers, and approvers **respond to workflow-generated notifications identically to manually-triggered ones** — the end-user experience is the same whether a human or an automated workflow initiated the notification.

## What ZWA is not

Boundary disclaimers — what operators sometimes assume ZWA does, but doesn't:

- **Not a SOAR platform.** ZWA is DLP-incident-specific, not a general security orchestration product. No arbitrary playbook engine, no integrations beyond the named ticketing/notification channels.
- **Not a ZPA workflow tool.** ZPA has its own policy management; ZWA is **ZIA DLP only**. Operators asking about ZPA access automation should look elsewhere.
- **Not an email security tool.** Slack / Teams / email notifications are *delivery channels for DLP incident notifications*, not inbound email security or anti-phishing.
- **Not a SIEM integration layer.** For log forwarding to SIEM, use ZIA NSS (Network Security Services) or log streaming — not ZWA.
- **Not an automation surface for non-DLP ZIA events.** ZWA does not handle ZIA threat events, web filtering blocks, sandbox detections, or any other Zscaler product's alerts — strictly ZIA DLP incidents.

## Mechanics

### Incident lifecycle

From *Managing Incidents* and *Understanding Workflows in Workflow Automation*:

```
ZIA DLP detection
    │
    ▼
Incident created in ZWA (Incidents page)
    │
    ├──────────────────────────────────┐
    ▼                                  ▼
Manual triage                    Workflow match (via workflow mapping)
    │                                  │
    │ Admin actions:                   │ Automated actions:
    │ - Investigate                    │ - Notify user
    │ - Notify user                    │ - Escalate to manager/approver
    │ - Escalate                       │ - Create ticket
    │ - Create ticket                  │ - Close incident
    │ - Close incident                 │ - (+ various combinations via templates)
    ▼                                  ▼
Resolved / Closed state
```

Both paths can operate concurrently on the same tenant — a workflow handles common-case incidents automatically while admins manually triage exception cases.

### Incident attributes

Incidents carry metadata fields that are both display-useful and **the basis for workflow mapping criteria**:

- User identity (who triggered the incident)
- User's department / manager
- DLP policy that fired
- Severity / risk level
- Matched DLP engine (built-in vs custom dictionary)
- Source channel (web upload, file transfer, email, etc.)
- Destination (where the data was being sent)
- Matched content (the actual payload excerpt — stored as evidence)
- Timestamp
- Status (Open / In Progress / Resolved / Closed)
- Labels (freeform tags admins or workflows assign)

Workflow mappings match on these attributes. A mapping might say: "Department=Finance AND Severity>=High → workflow `Auto-Escalate-to-Finance-Manager`."

### Incident statuses and resolution labels

From the captured material (partial):

- **Open** — newly created, unassigned.
- **In Progress** — assigned to an admin or a workflow is acting.
- **Resolved** — admin or workflow closed it. A *resolution label* (e.g., "False Positive," "Policy Violation Acknowledged," "User Notified") can be attached to categorize the closure.
- **Closed** — terminal.

The workflow template `Auto Close Data Protection Incident With Resolution Label` specifically adds a label on auto-close — distinct from `Auto Close Data Protection Incident` (no label).

### The 9 predefined workflow templates

From *Understanding Workflows in Workflow Automation*:

| Template | What it does |
|---|---|
| `Auto Close Data Protection Incident With Resolution Label` | Sets incident status to Resolved and attaches a specified label. |
| `Auto Close Data Protection Incident` | Sets incident status to Resolved (no label). |
| `Auto Create Tickets` | Creates a ticket in the configured ticketing integration (ServiceNow or Jira Software). |
| `Auto Escalate` | Escalates the incident to the user's manager; if manager is not found, to a fallback approver. |
| `Auto Notify` | Notifies the user who generated the incident via configured channel (email / Slack / Microsoft Teams). |
| `Auto Notify User and Close Incident` | Notifies user; if no response within configurable seconds, closes the incident. |
| `Auto Notify User and Concurrently Escalate` | Notifies user AND immediately escalates to manager/approver without waiting for user response. |
| `Auto Notify User and Escalate` | Notifies user; if no response within configurable seconds, escalates to manager/approver. |
| `Auto Notify User and Escalate to Manager` | Notifies user; optionally escalates to manager only (no approver fallback) if no response. |

**Template details to configure** (varies per template):

- Notification channel (email / Slack / Microsoft Teams)
- Wait period for user response (seconds)
- Resolution label (for auto-close variants)
- Ticketing integration (for auto-create-tickets)

> **Operational note — wait periods are configured in seconds.** This is an unusual unit for incident-response timing (most products use minutes/hours). Worth flagging when operators configure response windows: a "30" in the wait field is 30 seconds, not 30 minutes. Easy misconfiguration trap.

> **Concurrent vs. sequential escalation — distinct operational behaviors.** The `Auto Notify User and Concurrently Escalate` template fires the user notification AND the manager/approver escalation **in parallel**, with no wait for user response. The `Auto Notify User and Escalate` template (without "Concurrently") instead waits the configured response window before escalating. Choose concurrent for high-severity incidents where manager awareness is required regardless of user response; choose sequential for lower-severity cases where the user should get a chance to self-remediate first.

**Custom workflows**: admins can build workflows that don't use a template — pick any combination of actions + steps. Used for edge-case remediation patterns the templates don't cover.

### Workflow mappings — the trigger model

A workflow doesn't fire on its own — it needs a **workflow mapping** that says "this workflow runs on incidents matching these attributes."

From the help doc:

> After you configure a predefined or custom workflow, you must specify the incidents that use this workflow by mapping the workflow to one or more of the attributes available in an incident transaction.

Mapping criteria use the same incident attribute fields (user, department, DLP policy, severity, etc.) that display on the Incidents page.

**First-match semantics** across workflow mappings: not explicitly documented in captured material. Unclear whether multiple mappings can fire per incident or only the first-matching one. Likely first-match-wins parallel to ZIA rule evaluation, but flag as [clarification candidate].

### Integration with ticketing systems

The `Auto Create Tickets` template (and manual "Create Ticket" actions) integrates with **ServiceNow** and **Jira Software**. Each integration requires:

- Credentials for the target system (API key / OAuth).
- Field mapping between incident fields and ticket fields.
- Configured destination (project/queue for Jira; table for ServiceNow).

Integration setup is operational (per-tenant), not covered in the reasoning docs. The skill should route "how do I connect ServiceNow?" to Zscaler's integration-specific help articles (`managing-dlp-*-application-integrations-workflow-automation`).

### Notification channels

Three supported out of the box:

- **Email** — to a specified address or per-incident dynamic (user's email).
- **Slack** — via webhook / Slack app integration.
- **Microsoft Teams** — via Teams app integration.

Channel configuration is per-tenant; individual workflows pick which configured channel to use for their notifications.

### Incident groups and admin ownership

From *What Is Workflow Automation?*:

> Workflow Automation provides the capability to group individual incidents into incident groups and assign priorities to those incident groups. These incident groups can then be assigned to different admins.

Use case: during a large DLP event (departing employee, mass accidental disclosure), admins can batch-group dozens of incidents, assign priority, and route ownership — then triage in one workflow-queue view rather than per-incident.

### RBAC — roles within ZWA

ZWA has its own RBAC surface, with four named role types:

| Role | What they do |
|---|---|
| **Governance admins** | Manage workflows, configure mappings, view all incidents, and own the ZWA configuration surface. |
| **Approvers** | Designated recipients for escalated incidents. Can approve or reject the proposed remediation. Used by `Auto Escalate` and the *Concurrently / sequentially escalate* templates when a user's manager isn't available in the directory. |
| **Integration users** | System accounts for ticketing-system integration (ServiceNow / Jira). Used by the `Auto Create Tickets` workflow template. |
| **User roles** | Regular end-users who *receive* notifications and can respond / justify their action that triggered the DLP incident. |

**Important caveat — RBAC inheritance.** Per `vendor/zscaler-help/what-workflow-automation.md`, ZWA RBAC is **managed within ZWA, not inherited from ZIA admin roles** — i.e., a ZIA admin doesn't automatically get ZWA permissions. *(Source: workflow-automation/overview.md as merged 2026-05-04; not independently confirmed against current ZWA admin help docs — verify before relying for tenant-config decisions.)*

## Dependencies — what ZWA needs upstream

**ZWA is downstream of ZIA DLP.** Without ZIA DLP detections, there's nothing for ZWA to ingest. Which means ZWA inherits ZIA DLP's dependencies:

| Dependency | Effect on ZWA |
|---|---|
| SSL Inspection must decrypt | Without decrypt, DLP can't see content, ZIA doesn't detect, ZWA gets no incidents. See [`../zia/ssl-inspection.md § SSL bypass is a cross-policy gate`](../zia/ssl-inspection.md). |
| DLP policies must be configured in ZIA | ZIA DLP rules are the detection source. No ZIA DLP rules → no ZWA incidents. |
| ZIA→ZWA integration must be enabled | Tenant-level toggle; if off, ZIA detects but nothing feeds ZWA. |

**Operator diagnostic flow** for "DLP incidents not appearing in ZWA":

1. Verify ZIA DLP rules exist and are enabled.
2. Verify SSL Inspection is decrypting the relevant traffic (not in a bypass).
3. Check ZIA→ZWA integration status.
4. Check ZWA ingestion is working (audit log / system status).
5. Only then look at workflow mappings and rules inside ZWA.

## Edge cases

- **Incident fires but no workflow triggers**: workflow mapping either doesn't match the incident's attributes or the workflow is disabled. Review mappings against incident attributes on the Incidents page.
- **User never responds to notification**: auto-notify-and-escalate/close templates have configurable wait times. After expiration, escalation or closure proceeds. Users on PTO or terminated users may routinely trigger timeout paths.
- **Manager not found during auto-escalate**: fallback to approver. If no approver configured, escalation silently fails — incident stays in In Progress.
- **Ticket creation fails**: ServiceNow/Jira API errors produce a workflow failure. Incident status may get stuck; admin intervention required to investigate and re-attempt.
- **Resolution label on non-auto-close workflows**: labels are free-form. Inconsistent labeling makes trend analysis harder — org should standardize a label vocabulary.
- **Dashboard-level sensitive data exposure**: ZWA admin console shows matched payload data (the evidence that triggered the incident). Admin-portal access to ZWA effectively = access to the DLP-tripped content. Scope admin RBAC tightly.

## Open questions

- Workflow mapping evaluation order — first-match-wins, multi-fire, or something else? Not explicitly documented.
- Max number of workflows / workflow mappings per tenant — not captured.
- Retention period for closed incidents in ZWA.
- Whether incidents can be re-opened once closed, or if they're immutable at terminal status.
- Whether ZWA receives DLP events from ZIA inline DLP, Endpoint DLP, Email DLP, or some subset.

## Cross-links

- API surface (Python + Go SDK methods) — [`./api.md`](./api.md)
- ZIA SSL Inspection (upstream decryption dependency for DLP detection) — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- ZIA Malware & ATP (adjacent cybersecurity-policy product family; distinct from DLP but same pipeline position) — [`../zia/malware-and-atp.md`](../zia/malware-and-atp.md)
- Cross-product integration catalog — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
