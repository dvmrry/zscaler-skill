# About Cloud Application Risk Profile

**Source:** https://help.zscaler.com/zia/about-cloud-application-risk-profile
**Captured:** 2026-04-23 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help — Policies — Cloud Apps — Risk Profiles — About Cloud Application Risk Profile

The cloud application risk profile feature allows you to control how cloud applications are used in your organization. The feature consists of two parts: creating a cloud application risk profile and associating the profile with the Cloud App Control policy rules.

The feature enables you to create the Cloud App Control policy rules based on the cloud application attributes. The policy applies to cloud applications with attributes that match the risk profile criteria.

For example, if a risk profile is created with its criteria set as follows: Risk Index to 5 (AND) Application Status to Unsanctioned (AND) Poor Terms of Service to Yes, and the profile is associated with the File Sharing cloud app control policy with the Upload action set to Blocked, then the upload action for all the File Sharing apps that match the risk profile criteria is blocked.

The Cloud App Control policy rule applies to all specified cloud applications if the cloud application risk profile criterion is selected.

## About the Cloud Application Page

On the Cloud Application page (Administration > Risk Profiles), you can do the following:

- Add a cloud application risk profile.
- Search for a configured cloud application risk profile.
- View a list of all configured cloud application risk profiles. For each cloud application risk profile, you can see the following:
  - **Profile Name**: The name of the cloud application risk profile that is displayed when configuring the Cloud App Control policy rule. You can sort this column.
  - **Application Status**: The state of the application (Sanctioned or Unsanctioned).
  - **Risk Index**: The risk index number of the cloud applications. It represents the risk score assigned to each cloud application based on the risk attribute values.

  All the cloud applications, including those with risk index overrides from the Application Information page, are evaluated in the policy if the risk index criterion matches.

  - **Certifications Supported**: The types of certifications that the cloud applications support. You can choose to include or exclude certificates.
  - **Details**: The details of the cloud application risk profile.
- Edit, duplicate, or delete a cloud application risk profile.
