# About SaaS Application Tenants

**Source:** https://help.zscaler.com/zia/about-saas-application-tenants
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401251, revision 3238347

---

Watch a video about SaaS Application Tenants (shows legacy UI).
Zscaler Data at Rest Scanning provides visibility and security for sanctioned SaaS applications used in your organization. You can authorize sanctioned SaaS applications with Zscaler by adding them as tenants. You can see general information about each tenant, such as the authorization status and configured policies.
SaaS Application Tenants provides the following benefits and allows you to:
- Add or edit SaaS application tenants.
- View general information about each tenant.
- Manage SaaS application sites and site groups to use in Data Loss Prevention (DLP) policies.
Zscaler has multiple SaaS application tenant technology partners. To learn more about Zscaler's SaaS application tenant integrations, see Zscaler and SaaS Application Tenant Technology Partner Deployment Guides.
# About the SaaS Application Tenants Page
On the SaaS Application Tenants page (Data Security > DSPM > SaaS Application Tenants), you can do the following:
- Go to the Add SaaS Application Tenant page.
- Go to the Manage SaaS Application Components page.
- Add a SaaS application tenant.
- Search for a configured SaaS application tenant.
- View a list of all configured SaaS application tenants. For each tenant, you can see the following:
  - **Application**: The type of sanctioned SaaS application (e.g., Box, Microsoft OneDrive, SharePoint, etc.).
  - **Tenant Name**: The name of the SaaS application tenant that is displayed when configuring the DLP policy, Malware Detection policy, and Scan Configuration.
  - **Status**: The status of the SaaS application tenant. The following states appear:
    - **Active**: The tenant is in use. Policies are enforced for this SaaS application.
    - **Inactive**: The tenant is not in use. Policies are not enforced for this SaaS application.
    - **Validation Failed**: There were issues validating the admin credentials and authorizing the SaaS application. To learn more, see SaaS Application Validation Error Codes​​​​​.
    - **Reauthorization Required**: Edit the tenant, and click **Reauthorize** to log in to the SaaS application and give Zscaler access to it.
    - See image.
    - If you're reauthorizing GitHub, you must revoke the existing Zscaler OAuth application authorization in the GitHub portal. To learn more, refer to the GitHub documentation.
  - **Last Modified On**: The last time the SaaS application tenant was edited.
  - **Last Modified By**: The name of the admin who last edited the SaaS application tenant.
  - **Owner**: Indicates whether the SaaS application tenant was created in Internet & SaaS (ZIA) or Digital Experience (ZDX). If the tenant was created in ZDX, the delete functionality is removed in Internet & SaaS. Edits in Internet & SaaS for tenants created in ZDX are allowed on any fields except those relating to Workflow Automation.
  - To learn more about adding or editing applications in ZDX, see About Applications.
  - **Policy Configured**: The Data at Rest Scanning policies (DLP and Malware Detection) configured for the SaaS application tenant.
  - **External Trusted Domain Profiles**: Displays the total number of added external trusted domains. Click to view a list of the domains. This only applies to email SaaS application tenants.
  - See image.
  - **External Trusted User Profiles**: Displays the total number of added external trusted users. Click to view a list of the users. This only applies to email SaaS application tenants.
  - See image.
- Edit a SaaS application tenant.
- Modify the table and its columns.
- Delete the SaaS application tenant.
