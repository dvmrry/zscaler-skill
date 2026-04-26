# Analyzing Amazon Web Services Account Group Details

**Source:** https://help.zscaler.com/cloud-branch-connector/analyzing-amazon-web-services-account-group-details
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Administration 
Cloud Connector Partner Integrations 
Analyzing Amazon Web Services Account Group Details
Cloud & Branch Connector
Analyzing Amazon Web Services Account Group Details
Ask Zscaler

The Amazon Web Services (AWS) account group details page provides general and management information for a selected AWS account group. You can access the AWS account group details page by clicking the name of an account group on the AWS Groups page.

Analyzing the AWS Account Group Details Page

On the AWS account group details page, you can do the following:

View the name of the account group.
Edit an account group.
Delete an account group.
View the description of the account group.
From the drop-down menu, select the Cloud Connector groups where tag information is sent.
Filter the list of accounts by the following criteria:
Account ID
Name
Search for an account.
View a list of accounts in the group. For each account, you can view:
Account ID: The ID of the AWS account.
Name: The name of the account.
Last Modified By: The admin who last modified the account.
Last Modified On: The date and time when the account was last modified.
Permission: The permission status of the account:
Allowed: The IAM role was correctly deployed, and the service can discover tags.
Denied: The service cannot assume the role that you provided. Ensure that the role is properly deployed and the trust policy uses the correct Zscaler role and external ID.
Pending: The account was added to the Zscaler service, but it is waiting for the role to be deployed. When the role is deployed and the Zscaler admin syncs it, the role moves into the Allowed or Denied status.
Modify the table and its columns.
Select an account ID to access the AWS account details page.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Amazon Web Services Accounts
Adding an Amazon Web Services Account
Analyzing Amazon Web Services Account Details
About Amazon Web Services Account Groups
Adding an Amazon Web Services Account Group
Analyzing Amazon Web Services Account Group Details
Configuring Workload Discovery for Workloads in Amazon Web Services
About Microsoft Azure Accounts
Configuring the Workload Discovery Service for Microsoft Azure Accounts
Analyzing Microsoft Azure Account Details
Configuring IAM Roles and Permissions for Microsoft Azure
Understanding Namespaces for Amazon Web Services and Microsoft Azure Accounts
About Google Cloud Platform Accounts
Adding a Google Cloud Platform Account
Analyzing Google Cloud Platform Account Details
Configuring Workload Discovery for Workloads in Google Cloud Platform
