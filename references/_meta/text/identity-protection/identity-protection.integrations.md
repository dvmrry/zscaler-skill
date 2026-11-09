# What the ITDR Admin Portal help describes for integrations: Okta setup and retention, ServiceNow ITSM configuration, webhook, tickets and incident view (identity-protection.integrations)
Also called: itdr okta integration; itdr servicenow; itsm integration; servicenow webhook; itdr configurations page

## Okta

The Okta integration (ITDR > Manage > Okta) takes Enabled, the tenant Base URL and an API Token, and the Okta permissions okta.roles.read, okta.users.read, okta.logs.read and okta.users.manage must be enabled before the API token is generated. [identity-protection.integrations:okta-config-fields] Click Test confirms the connection when the credentials are valid and Okta can communicate with ITDR; if the credentials do not match or Okta cannot connect, regenerate the API token on the Okta tenant, enter it and test again. [identity-protection.integrations:okta-test] The Okta integration page states that Okta system logs for threat detection are retained for only 14 days, after which they are permanently deleted. [identity-protection.integrations:okta-log-retention] [Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated](kb:identity-protection.overview)

## ServiceNow

The Configurations page (ITDR > Integrations > Configurations) lists the available ITSM integrations with an Enabled status and the configured ITSM tool, and ServiceNow is the example ITSM tool named. [identity-protection.integrations:itsm-configurations-page] ServiceNow tickets track issues across the ITDR Admin Portal (AD domain, Entra ID, credential issues) and bad changes detected in the AD domain and Entra ID. [identity-protection.integrations:servicenow-scope] Configuring ServiceNow in ITDR takes Enabled, the Base URL of the ServiceNow instance, a Username and a Password, with an optional Test; only one ticket can be created for an issue, and a ServiceNow webhook must be configured afterwards. [identity-protection.integrations:servicenow-config]

The ServiceNow webhook is a business rule on the Incident [incident] table with the Advanced checkbox selected; the script's endpoint URL and API key are replaced with the Webhook URL and Webhook API Key copied from the ITDR Configurations page. [identity-protection.integrations:webhook-business-rule] The supplied script only triggers the webhook when short_description, description, work_notes, state, impact or urgency change; as printed, the condition joins impact and urgency with a single | rather than ||. [identity-protection.integrations:webhook-script-trigger] The page's line numbers for the script edits do not match the printed script [gap:identity-protection.integrations:webhook-script-lines]. The script's POST payload carries incident_number, short_description, description, work_notes, state, impact, urgency, updated_by and updated_on, with a Content-Type of application/json and an x-service-now-auth header carrying the API key. [identity-protection.integrations:webhook-script-payload]

A ServiceNow ticket can be created from the Active Directory Posture, Active Directory Change Detection, Endpoint Credential Exposure, Entra ID Posture and Entra ID Change Detection dashboards, with Short Description, Description, Impact and Urgency auto-populated. [identity-protection.integrations:ticket-sources-fields] The ServiceNow page (ITDR > ServiceNow) lists incidents with Incident Number, Short Description, Impact, Urgency, Status (Open or Resolved in the ITDR Admin Portal), Incident State (New, In Progress, On Hold, Resolved, Closed or Cancelled in ServiceNow), Incident Type (AD, Entra or Credential Exposure), Domain, Issue Name, Description, Last Work Note, Created At and Last Updated. [identity-protection.integrations:incident-view-columns]

What to check:
1. For which API token permissions the Okta integration needs, the four named before the token is generated.
2. For which events a ServiceNow incident change sends to ITDR, the properties the supplied script tests as printed.

Not known (open gaps):
- Which lines of the printed ServiceNow webhook script the page's edit instructions refer to [gap:identity-protection.integrations:webhook-script-lines]: settled by lab-test or support-ticket

Area: identity-protection.integrations, its subjects in references/_meta/spine/identity-protection/identity-protection.integrations.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)
