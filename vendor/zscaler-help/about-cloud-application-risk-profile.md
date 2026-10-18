# About Cloud Application Risk Profile

**Source:** https://help.zscaler.com/zia/about-cloud-application-risk-profile
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1402271, revision 3243527

---

The cloud application risk profile feature allows you to control how cloud applications are used in your organization. The feature consists of two parts: creating a cloud application risk profile and associating the profile with the Cloud App Control policy rules.
The feature enables you to create the Cloud App Control policy rules based on the cloud application attributes. The policy applies to cloud applications with attributes that match the risk profile criteria.
For example, if a risk profile is created with its criteria set as follows: Risk Index to 5 (AND) Application Status to Unsanctioned (AND) Poor Terms of Service to Yes, and the profile is associated with the File Sharing Cloud App Control policy with the Upload action set to Blocked, then the upload action for all the File Sharing apps that match the risk profile criteria is blocked.
The Cloud App Control policy rule applies to all specified cloud applications if the cloud application risk profile criterion is selected.
Risk profiles provide the following benefits and allow you to:
- Group cloud applications into profiles based on risk index.
- Identify applications that fall into risk categories that require tighter controls.
- Control application access based on application status, hosting information, and security information.
# About the Risk Profiles Page
On the Risk Profiles page (Data Security > Inline CASB > Risk Profiles), you can do the following:
- Search for a configured cloud application risk profile.
- Add a cloud application risk profile.
- Modify the column option to view the risk profiles accordingly.
- View a list of all configured cloud application risk profiles. For each cloud application risk profile, you can see the following:
  - Profile Name: The name of the cloud application risk profile that is displayed when configuring the Cloud App Control policy rule. You can sort this column.
  - Application Status: The state of the application (Sanctioned or Unsanctioned). You can sort this column.
  - Risk Index: The risk index number of the cloud applications. It represents the risk score assigned to each cloud application based on the risk attribute values.
  - All the cloud applications, including those with risk index overrides from the Application Information page, are evaluated in the policy if the risk index criterion matches.
  - Certifications: The types of certifications that the cloud applications support. You can choose to include or exclude certificates.
  - Details: The details of the cloud application risk profile.
- Edit, duplicate, or delete a cloud application risk profile.
