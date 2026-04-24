# About Tenant Profiles

**Source:** https://help.zscaler.com/zia/about-tenant-profiles
**Captured:** 2026-04-23 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help — Policies — Cloud Apps — Tenant Restriction — About Tenant Profiles

Zscaler's tenancy restriction feature allows you to restrict access either to personal accounts, business accounts, or both for certain cloud applications. It consists of two parts, creating tenant profiles and associating them with the Cloud App Control policy rules.

You can provide restricted access to the cloud applications that support tenancy restrictions by creating tenant profiles for these apps and associating them with the respective Cloud App Control policy rules. For example, you can restrict access to content specific to your organization on YouTube by creating a tenant profile, corporate YouTube channel with your organization's YouTube channel ID, and associating it to a YouTube Cloud App Control policy rule with Allow action.

## About the Tenant Profiles Page

On the Tenant Profiles page (Administration > Tenant Profiles), you can do the following:

- Add a tenant profile.
- Search for a configured tenant profile.
- View a list of all configured tenant profiles. For each tenant profile, you can see the following:
  - **Profile Name**: The name of the tenant profile that is displayed when configuring the Cloud App Control policy rule. You can sort this column.
  - **Cloud Application**: The cloud application for which the tenant profile is created (e.g., Dropbox, Google, Microsoft Login Services, etc.).
  - **Details**: The configuration details of the tenant profile.
  - **Description**: The description of the tenant profile if available.
- Edit, duplicate, or delete a tenant profile.
- Modify the table and its columns.
