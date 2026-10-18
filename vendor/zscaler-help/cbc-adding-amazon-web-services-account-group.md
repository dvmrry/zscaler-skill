# Adding an Amazon Web Services Account Group

**Source:** https://help.zscaler.com/cloud-branch-connector/adding-amazon-web-services-account-group
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1479496, revision 3244144

---

This article provides information on how to add an Amazon Web Services (AWS) account group in the Zscaler Admin Console. To learn more, see About Amazon Web Services Account Groups.
# Adding an AWS Account Group
To add an AWS account group:
- From the navigation menu, go to **Zero Trust Cloud** > **Common Resources** > **AWS** > **Account Groups**.
- Click **Add Group**.
- See image.
- The **Add AWS Group** window appears.
- In the **Add AWS Group** window:
  - **Name**: Enter a name for the AWS account group.
  - **Description**: Enter a description for the AWS account group.
  - **Cloud Connector Group**: From the drop-down menu, select the Cloud Connector group(s) to associate with the account group.
  - From the table, select the AWS accounts to associate with the group. You can sort AWS accounts by the following criteria:
    - **Account ID**: The ID of the AWS account where workloads are deployed.
    - **Name**: The name of the AWS account.
    - **Last Modified By**: The last admin to modify the account.
    - **Last Modified On**: The date and time when the account was last modified.
    - **Permission**: The permission status of the account (i.e., **Pending**, **Allowed**, or **Denied**).
    - **Latest Sync**: The last time the account synced. After you refresh the account, this column displays the time when you clicked the **Refresh** button.
  - See image.
- Confirm that the information is correct and click **Save**.
