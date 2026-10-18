# About Amazon Web Services Account Groups

**Source:** https://help.zscaler.com/cloud-branch-connector/about-amazon-web-services-account-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1479491, revision 3240658

---

Amazon Web Services (AWS) account groups enable Zscaler Cloud Connector to be aware of other accounts it can get the workload tags from. Therefore, the Cloud Connector is not tied to the account where it is deployed.
AWS account groups provide the following benefits and enable you to:
- Tie the Cloud Connector to a list of accounts.
- Enable Cloud Connector to learn workload tags from multiple accounts.
- Simplify deployment with a centralized model that links all accounts to a single Cloud Connector group.
To use AWS tags with Zero Trust Gateways, you must configure AWS groups as described below. This is required to associate one or more AWS accounts in a group with a Zero Trust Gateway, which serves as the security enforcement point for workloads.
# About the Groups Page
On the Account Groups page (Zero Trust Cloud > Common Resources > AWS > Account Groups), you can do the following:
- Filter the list of groups by the following criteria:
  - **Account ID**: The ID of the account.
  - **Name**: The name of the account.
  - **Cloud Connector**: The Cloud Connector assigned to the group.
- Add an AWS group.
- Search for a group.
- View a list of all groups. For each group, you can view:
  - **Name**: The name of the group. Select an account group name to view the dashboard details.
  - **Number of Accounts**: The number of accounts in the account group.
  - **Cloud Connector Groups**: The number of Cloud Connector groups associated with the AWS group.
  - **Description**: The description of the group.
- Modify the table and its columns.
- Edit a group.
- Delete a group.
- Go to the Microsoft Azure Accounts page.
- Go to the GCP Accounts page.
- Go to the AWS Accounts page.
