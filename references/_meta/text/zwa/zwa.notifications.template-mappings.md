# Workflow Automation incident and digest template mappings: which notification and survey templates are used per source type, source action and notification type (zwa.notifications.template-mappings)
Also called: template mappings; incident template mapping; digest template mapping; source action; source type; template family mapping

Incident template mappings determine which notification and survey templates Workflow Automation uses for end user notification and escalation notifications; the digest template mapping determines the templates used for digest notifications. [zwa.notifications.template-mappings:purpose] Workflow Automation provides a default source action for each source DLP type (Inline, Email, Endpoint and SaaS Security), mapped to the default notification and survey templates; the templates on these default mappings can be changed and the mappings deleted. [zwa.notifications.template-mappings:default-mappings] The templates being mapped are in [Workflow Automation notification templates (email, Slack, Teams): default families, status and edit rules, the digest flag and email builder settings](kb:zwa.notifications) and [Workflow Automation survey (questionnaire) templates: the mandatory Reason question, default families, toolbox question types and edit rules](kb:zwa.notifications.survey-templates).

**Incident mappings.** Before adding an incident template mapping, notification templates must be added on the Notification Templates page and survey templates on the Survey Templates page. [zwa.notifications.template-mappings:incident-prereqs] Adding an incident template mapping asks for a source type (Email, Endpoint, Inline or SaaS Security), a source action (which depends on the source type) and a notification type (End User Notification or Escalation). [zwa.notifications.template-mappings:source-and-notification-types] An incident template mapping's Template Family section has Email, Slack, Teams and Survey fields for choosing a template family; the Slack field is only available with the Slack integration and the Teams field only with the Microsoft Teams integration, and on an existing mapping only the Template Family values can be edited. [zwa.notifications.template-mappings:template-family-fields]

**Source actions.** Inline source actions for a template mapping include Violates Compliance Category Archived To Mailbox, Violates Compliance Category Archive To Mailbox Failed, Allowed And Archived To Mailbox and Allowed And Archived to Mailbox Failed. [zwa.notifications.template-mappings:inline-actions] SaaS Security source actions for a template mapping include Report Malware, Apply Email Tag, Report Incident, Notify End User, Apply Azure Information Protection Label, Apply BOX Tag, Move To Restricted Folder, Apply Google Drive Label, Remove Public Link Sharing and Quarantine To User Root Folder. [zwa.notifications.template-mappings:saas-actions] The Endpoint source actions for a template mapping are Default, Allow, Block and Confirm. [zwa.notifications.template-mappings:endpoint-actions] The Email source actions for a template mapping are Default, Quarantine, Allow, Block, Custom Header Insertion, Justify and Caution. [zwa.notifications.template-mappings:email-actions] The full Inline and SaaS Security action lists are open [gap:zwa.notifications.template-mappings:unquoted-actions].

**Digest mappings.** Before adding a digest template mapping, user and DLP admin digest notification templates must be added on the Notification Templates page. [zwa.notifications.template-mappings:digest-prereq] The Digest tab of Template Mappings has, under both User and DLP Admin, Email, Slack and Teams template drop-downs for digest template families; the Slack Template field is only available with the Slack integration and the Teams Template field only with the Microsoft Teams integration. [zwa.notifications.template-mappings:digest-mapping-fields]

What to check:
1. Whether the notification and survey templates have been added before adding an incident template mapping.
2. Whether the user and DLP admin digest notification templates exist before adding a digest template mapping.

Not known (open gaps):
- What are the full Inline and SaaS Security source action lists? [gap:zwa.notifications.template-mappings:unquoted-actions]: settled by source-read

Area: zwa.notifications, its subjects in references/_meta/spine/zwa/zwa.notifications.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.notifications.md (Workflow Automation notification templates (email, Slack, Teams): default families, status and edit rules, the digest flag and email builder settings)
- links-to references/_meta/text/zwa/zwa.notifications.survey-templates.md (Workflow Automation survey (questionnaire) templates: the mandatory Reason question, default families, toolbox question types and edit rules)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zwa/zwa.incidents.md (Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting)
