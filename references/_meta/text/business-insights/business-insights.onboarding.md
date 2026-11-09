# Onboarding a SaaS application to Business Insights: connector or plan information, and per-application prerequisites (business-insights.onboarding)
Also called: saas app connector; application connector; onboard saas apps; box connector; okta connector; salesforce connector; servicenow connector

Zscaler recommends a direct SaaS application connector (which requires admin access to the app) for supported apps; when a connector cannot be configured, metrics can still be viewed from Internet & SaaS and IdP data by specifying plan information. [business-insights.onboarding:connector-recommended] The onboarding article gives connector configuration steps for eight applications: Box, GitHub, Google Workspace, Microsoft 365, Okta, Salesforce, ServiceNow and Slack. [business-insights.onboarding:connector-apps]

**Connection.** The Business Insights service begins to retrieve subscription details and establish an API connection, which might take a few minutes or hours; the admin can navigate away and is notified when the connector is configured. [business-insights.onboarding:connection-time] The connector configuration can be skipped by providing only licensing information, for an app where the admin lacks admin access or does not want a connector. [business-insights.onboarding:skip-connector] Onboarding collects subscription details: Purchased Seats, Assigned Seats, Per User License Cost (the cost of one seat per month), Contract Start Date and Contract End Date. [business-insights.onboarding:subscription-fields]

**Box.** For Box, the Zscaler SaaS Connector value is needed when adding a custom application for Box and is entered as the Client ID, and the Box Enterprise ID entered in the Zscaler Admin Console identifies the tenant. [business-insights.onboarding:box-tenant-id]

**Google Workspace.** Google Workspace onboarding adds the Zscaler connector as an API client under domain-wide delegation, with Overwrite existing client ID deselected; the OAuth scope grants read-only access to the usage reporting API. [business-insights.onboarding:google-delegation]

**Okta.** Okta onboarding needs an OIDC web-application integration named Business Insights with the Authorization Code and Refresh Token grant types and the redirect URI https://admin.zscaleranalytics.net/admin/onboarding-wizard. [business-insights.onboarding:okta-app-integration] Okta onboarding grants four API scopes: okta.apps.read, okta.logs.read, okta.userTypes.read and okta.users.read, and then assigns the Okta admin account to the Business Insights app. [business-insights.onboarding:okta-scopes] [gap:business-insights.onboarding:okta-client-secret-step]

**Salesforce.** Salesforce onboarding installs the ZscalerBIPackage with Install for Admins Only selected, and enables Salesforce CRM Content, auto-assignment of feature licenses to existing and new users, and Files sharing with libraries. [business-insights.onboarding:salesforce-package-and-content] Salesforce onboarding sets the Zscaler SaaS Connector connected app to Admin approved users are pre-authorized, Relax IP restrictions and Refresh token is valid until revoked, and assigns the System Administrator profile. [business-insights.onboarding:salesforce-connected-app-policies] A Salesforce tenant is added as a Sandbox account (test.salesforce.com) or Production account (login.salesforce.com); both can be added separately, but a tenant's type cannot be changed between sandbox and production. [business-insights.onboarding:salesforce-tenant-type]

**ServiceNow.** ServiceNow onboarding requires the OAuth 2.0 plugin to be installed and the com.snc.platform.security.oauth.is.active system property to be true, and asks for the OAuth client ID and secret, instance URL, and the user ID and password of the user who configured the OAuth client application. [business-insights.onboarding:servicenow-prerequisites] In the ServiceNow onboarding steps the OAuth client's Refresh Token Lifespan defaults to 8,640,000 seconds (100 days); Zscaler recommends a larger value such as 157,700,000 seconds (5 years), because ServiceNow must be configured as a new tenant after the refresh token expires. [business-insights.onboarding:servicenow-refresh-token]

**Slack.** For Slack onboarding, the workspace must be chosen from the Other workspaces section, not the Your organizations section. [business-insights.onboarding:slack-workspace]

[gap:business-insights.onboarding:connector-details] What the discovered apps look like is in [Business Insights Application Insights: discovered apps, overlap, cost savings, All Applications and application details](kb:business-insights.applications); the product overview is in [Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources](kb:business-insights.overview).

Not known (open gaps):
- What the GitHub and Microsoft 365 connectors need, and what happens when other connections expire [gap:business-insights.onboarding:connector-details]: settled by source-read or lab-test
- Whether the Okta Client Secret step is a typo [gap:business-insights.onboarding:okta-client-secret-step]: settled by lab-test or support-ticket

Area: business-insights.onboarding, its subjects in references/_meta/spine/business-insights/business-insights.onboarding.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/business-insights/business-insights.applications.md (Business Insights Application Insights: discovered apps, overlap, cost savings, All Applications and application details)
- links-to references/_meta/text/business-insights/business-insights.overview.md (Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources)
