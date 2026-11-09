# Workflow Automation survey (questionnaire) templates: the mandatory Reason question, default families, toolbox question types and edit rules (zwa.notifications.survey-templates)
Also called: survey templates; questionnaire template; reason question; surveyjs; end-user justification questionnaire

A survey template sets the format of the survey a user or approver must complete when responding to an incident notification; its questions provide the justification for the incident. [zwa.notifications.survey-templates:purpose] A notification template can include a link that opens the Incidents page and the survey the recipient must complete for the incident; the Template Mappings settings determine which notification and survey templates are used per source DLP type and notification type. [zwa.notifications.survey-templates:notification-link] The notification templates are in [Workflow Automation notification templates (email, Slack, Teams): default families, status and edit rules, the digest flag and email builder settings](kb:zwa.notifications) and the mappings in [Workflow Automation incident and digest template mappings: which notification and survey templates are used per source type, source action and notification type](kb:zwa.notifications.template-mappings).

**Defaults and status.** The system default survey template families provided are End-user Justification - Questionnaire Template and Escalation - Questionnaire Template. [zwa.notifications.survey-templates:default-families] The type of a survey template is always Questionnaire, and its status is Draft, Published or System Default. [zwa.notifications.survey-templates:type-status] For each survey template family only one template can be created in each language. [zwa.notifications.survey-templates:one-per-language] System default survey templates cannot be edited or deleted. [zwa.notifications.survey-templates:default-protections] What admins can do with a system default survey template is stated two ways [divergence:zwa.notifications.survey-templates:default-actions].

**Editing.** Save as Draft is not available when editing a published survey template, and Workflow Automation only uses published templates for its surveys. [zwa.notifications.survey-templates:draft-button] The survey template page says template mappings can only be updated with templates in a published status. [zwa.notifications.survey-templates:published-for-mappings]

**Questions.** A survey template must contain at least one drop-down panel type question named Reason; the survey creator starts with a placeholder drop-down question titled Reason, and Workflow Automation uses the SurveyJS Survey Creator component. [zwa.notifications.survey-templates:reason-question] In the survey toolbox, Dropdown accepts only one answer while Multi-Select Dropdown accepts more than one, and Checkboxes accept multiple answers. [zwa.notifications.survey-templates:choice-types] Respondents can add and remove panels in a Dynamic Panel question and rows in a Dynamic Matrix question. [zwa.notifications.survey-templates:dynamic-types] The Image Picker, HTML and Image question types in the survey toolbox are used for presentation only. [zwa.notifications.survey-templates:presentation-only-types]

What to check:
1. Whether the survey template contains a drop-down panel type question named Reason.
2. Whether the survey template is published before expecting it to be used.

Sources disagree (name both sides):
- The survey templates page says admins can only view and clone the system default survey templates, and elsewhere says a system default template can be translated. [divergence:zwa.notifications.survey-templates:default-actions]
  - zscaler-help: Admins can only view and clone the default survey templates.
  - zscaler-help: A published, system default or draft template can be translated and cloned.
  Impact: The page does not say whether translating a system default template is allowed in addition to viewing and cloning it.

Area: zwa.notifications, its subjects in references/_meta/spine/zwa/zwa.notifications.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.notifications.md (Workflow Automation notification templates (email, Slack, Teams): default families, status and edit rules, the digest flag and email builder settings)
- links-to references/_meta/text/zwa/zwa.notifications.template-mappings.md (Workflow Automation incident and digest template mappings: which notification and survey templates are used per source type, source action and notification type)
