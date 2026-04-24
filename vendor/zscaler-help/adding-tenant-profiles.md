# Adding Tenant Profiles

**Source:** https://help.zscaler.com/zia/adding-tenant-profiles
**Captured:** 2026-04-23 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help — Policies — Cloud Apps — Tenant Restriction — Adding Tenant Profiles

Zscaler's tenancy restriction feature allows you to restrict access either to personal accounts, business accounts, or both for certain cloud applications. The feature consists of two parts: creating tenant profiles and associating the profiles with the Cloud App Control policy rules.

To add a tenant profile:

1. Go to Administration > Tenant Profiles.
2. Click Add Tenant Profile. The Add Tenant Profile page appears.
3. In the **Cloud Application** field, select one of the following applications and configure it accordingly:
   - YouTube
   - Google Apps
   - Microsoft Login Services
   - Slack
   - Amazon Web Services
   - Dropbox
   - Webex Login Services
   - Zoho Login Services
   - Google Cloud Platform
   - Zoom
   - IBM SmartCloud
   - GitHub
   - ChatGPT

   Allowing a specific tenant automatically blocks other tenants for most of the cloud applications, and subsequent policies are not evaluated. However, for **YouTube** and **Amazon Web Services**, subsequent policies are evaluated, so an explicit block policy is required to block other tenants for them.

   Ensure to select these cloud applications as a criterion in an SSL Inspection rule if their tenant profiles are associated with a cloud application rule. In the SSL Inspection rule, for the following cloud applications, do as follows:
   - **Office 365**: Select Microsoft Login Services as the cloud application with a rule order higher than Office 365 One Click Rule.
   - **Google Apps**: Select Google Login Services as the cloud application.
   - **Webex Teams/Webex Meetings**: Select Webex Login Services as the cloud application.

4. In the **Tenant Profile Name** field, enter a unique name for the tenant profile. This name is displayed while configuring the respective Cloud App Control policy rules.
5. **Description**: (Optional) Enter any additional comments or information. The description cannot exceed 10,240 characters.
6. Click Save and activate the change.
