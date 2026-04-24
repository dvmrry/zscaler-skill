# Understanding Workflows in Workflow Automation

**Source:** https://help.zscaler.com/workflow-automation/understanding-workflows-workflow-automation
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Workflow Automation Help 
Workflow Automation for Data Protection 
Workflows 
Understanding Workflows in Workflow Automation
Workflow Automation
Understanding Workflows in Workflow Automation
Ask Zscaler

Workflow Automation enables admins to view and remediate data protection incidents that have occurred in their organization. To remediate incidents, admins can:

Manually perform different actions (e.g., investigate, notify user, escalate, create ticket, and close incident) for one or more incidents using the Incidents page and Incident Details page. To learn more, see Managing Incidents and Viewing & Managing Incident Details.
Configure predefined and custom workflows that automatically perform the different actions (e.g., notify user, escalate, create ticket, and close incident) for one or more incidents. To learn more, see Managing Workflow Templates, Managing Workflows, and Managing Workflow Mappings.

Admins can use one or both of these methods to remediate the incidents. Depending on the number and type of incidents that occur in your organization, one method might be preferred over the other.

The users, managers, and approvers respond to the actions that a workflow generates (e.g., notify user and escalate) in the same way as if an admin manually performed those actions on the Incidents page or Incident Details page.

Workflow Configuration

You can configure predefined workflows and custom workflows in Workflow Automation. When you configure a predefined workflow, you must select a workflow template on which to base the workflow and also enter the details for the workflow steps within that particular workflow template. Depending on the workflow template, there might be one or more steps and different details required for each step, such as notification channel and time to wait for user response. Workflow Automation provides the following workflow templates that you can use:

Auto Close Data Protection Incident With Resolution Label: This template automatically sets the status of the incident as Resolved and adds a resolution label for the closure.
Auto Close Data Protection Incident: This template automatically sets the status of the incident as Resolved.
Auto Create Tickets: This template automatically creates a ticket in the ticketing integration application (e.g., ServiceNow or Jira Software).
Auto Escalate: This template automatically escalates the incident to the user's manager or to an approver if the manager is not found in the system.
Auto Notify: This template automatically notifies the user who generated the incident, through the configured channel (i.e., email, Slack, or Microsoft Teams).
Auto Notify User and Close Incident: This template automatically notifies the user who generated the incident, through the configured channel (i.e., email, Slack, or Microsoft Teams), and closes the incident if a response is not received from the user after a configurable time period in seconds.
Auto Notify User and Concurrently Escalate: This template automatically notifies the user who generated the incident, through the configured channel (i.e., email, Slack, or Microsoft Teams), as well as automatically escalating the incident to the manager or approver without waiting for a response from the user.
Auto Notify User and Escalate: This template automatically notifies the user who generated the incident, through the configured channel (i.e., email, Slack, or Microsoft Teams), and escalates to their manager or approver if the user doesn't respond after a configurable time period in seconds.
Auto Notify User and Escalate to Manager: This template automatically notifies the user who generated the incident, through the configured channel (i.e., email, Slack, or Microsoft Teams), and optionally escalates to their manager if the user doesn't respond after a configurable time period in seconds.

When you configure a custom workflow, you choose and configure the different steps and actions required for the workflow without using one of the templates.

To learn more, see Managing Workflow Templates and Managing Workflows.

After you configure a predefined or custom workflow, you must specify the incidents that use this workflow by mapping the workflow to one or more of the attributes available in an incident transaction. Then, when an incident occurs in your organization that contains those attributes, the workflow automatically triggers and performs those actions specified in the workflow. To learn more, see Managing Workflow Mappings.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Understanding Workflows in Workflow Automation
Managing Workflow Templates
Managing Workflows
Managing Workflow Mappings
