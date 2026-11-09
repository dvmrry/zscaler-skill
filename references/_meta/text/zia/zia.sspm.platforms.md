# Connecting platforms to Advanced SSPM: the platforms the connect page lists and what each needs (zia.sspm.platforms)
Also called: advanced sspm integrations; advanced sspm connect platform; add integration

The Advanced SSPM connect page lists the API-based platforms Airtable, Bitwarden, Databricks, Lucid, OneLogin, OpenAI, Sentry, Smartsheet and Zendesk, and says that onboarding some API-based platforms redirects to the Add SaaS Application Tenant page in the Zscaler Admin Console. [zia.sspm.platforms:direct-connect-list] Connecting a platform to Advanced SSPM is dependent on the license. [zia.sspm.platforms:advanced-license] After a connection is achieved, pulling and ingesting the application data might take a while depending on the tenant's size. After integration completes, a success message appears and the integration status, first connected time and last synced time are updated on the Settings page; if the connection fails, an error message appears. [zia.sspm.platforms:connect-result]

**Role and credentials per platform.** Each platform's page names its connecting role and credentials. Airtable needs an Airtable Admin and the Enterprise Account ID, then Grant access. Bitwarden needs an Owner and the domain suffix, client ID and client secret from the Organization info page. Databricks needs an Account Admin, the account ID and the client ID and secret of an account-level service principal with the Account Admin role. Lucid needs an Account Admin, SCIM integration enabled, a SCIM token and an API key. OneLogin needs an Account Owner or Admin and the subdomain, client ID and client secret. OpenAI needs an Organization Owner and an API key set to Read-only. Sentry needs a Manager or Owner, and shows the consent window on the first integration. Smartsheet needs a System Admin and an API access token, with a product selection if the tenant is in a non-default region. Zendesk needs an Admin, an API token and the token owner's email address. [zia.sspm.platforms:platform-roles-and-credentials] The Lucid API key is set with the permissions Documents Readonly, Folders Readonly, Users View, Accounts Admin, Teams Admin and Licenses None, and the page recommends an expiration date at least one year away to avoid reintegrating the platform frequently. [zia.sspm.platforms:lucid-api-key]

**What the pages do not say.** The nine per-platform pages carry no permissions table, reconnect, edit or delete section, or ingest-delay note [gap:zia.sspm.platforms:missing-per-platform-data]. The application lists on other pages differ, see [SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM](kb:zia.sspm).

Not known (open gaps):
- What the Advanced SSPM platform pages leave out [gap:zia.sspm.platforms:missing-per-platform-data]: settled by source-read or support-ticket

Area: zia.sspm, its subjects in references/_meta/spine/zia/zia.sspm.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.sspm.md (SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM)
