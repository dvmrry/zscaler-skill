# About Tenant Profiles

**Source:** https://help.zscaler.com/zia/about-tenant-profiles
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401741, revision 3243513

---

Zscaler's tenancy restriction feature allows you to restrict access either to personal accounts, business accounts, or both for certain cloud applications. It consists of two parts: creating tenant profiles and associating them with the Cloud App Control policy rules.
You can provide restricted access to the cloud applications that support tenancy restrictions by creating tenant profiles for these apps and associating them with the respective Cloud App Control policy rules. For example, you can restrict access to content specific to your organization on YouTube by creating a tenant profile and corporate YouTube channel with your organization's YouTube channel ID, and then associating them to a YouTube Cloud App Control policy rule with Allow action.
Tenant profiles provide the following benefits and allow you to:
- Retain multiple tenants for cloud applications that support tenancy restrictions organized under named profiles.
- Reduce repeated steps to move between tenants during day-to-day administration.
# About the Tenant Profiles Page
On the Tenant Profiles page (Data Security > Inline CASB > Tenant Profiles), you can do the following:
- Search for a configured tenant profile.
- Add a tenant profile.
- Modify the column options to view the tenant profiles accordingly.
- View a list of all configured tenant profiles. For each tenant profile, you can see the following:
  - Profile Name: The name of the tenant profile that is displayed when configuring the Cloud App Control policy rule. You can sort this column.
  - Cloud Application: The cloud application for which the tenant profile is created (e.g., Dropbox, Google, Microsoft Login Services).
  - Details: The configuration details of the tenant profile.
  - Description: A description of the tenant profile if available.
- Edit, duplicate, or delete a tenant profile.
