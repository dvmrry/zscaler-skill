# Analyzing Amazon Web Services Account Details

**Source:** https://help.zscaler.com/cloud-branch-connector/analyzing-amazon-web-services-account-details
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Administration 
Cloud Connector Partner Integrations 
Analyzing Amazon Web Services Account Details
Cloud & Branch Connector
Analyzing Amazon Web Services Account Details
Ask Zscaler

The Amazon Web Services (AWS) account details page provides general and management information for a selected AWS account. You can access the AWS account details page by going to the Partner Integrations page and clicking the name of an account on the AWS Accounts page.

Analyzing the AWS Account Details Page

On the AWS account details page, you can view the following:

Account Name: The name of the AWS account.
External ID: The ID in the trust relationship of the IAM role that calls AWS while fetching the tag information.
Last Modified On: The date and time when the AWS account was last modified.
Last Modified By: The admin who last modified the AWS account.
Role Name: The name of the role in your account that Zscaler uses to fetch data.
Trusted Account ID: The ID of the Zscaler account that is required in the AWS trust policy.
Event Bus Name: The name of the event bus that sends notifications to the Zscaler service using EventBridge. This event bus is the target of the EventBridge. To learn more, see Configuring Workload Discovery for Workloads in Amazon Web Services.

Trusted Role: The Zscaler role that assumes the role name provided, which is required for the AWS trust policy.

See image.

In the Regions section, you can view a table of regional information:

Name: The name of the region. Select the name of a region to view the Workloads table and its details:

Private IP Address: The private IP address of the workload. Select a private IP address to view the following:

Attributes
User-Defined Tags
VPC ID: The ID of the VPC assigned to the workload. You can use this attribute in policies.
Namespace: A set of VPC endpoints. To learn more, see Understanding Namespaces for Amazon Web Services and Microsoft Azure Accounts.
User-Defined Tags: The number of user-defined tags in the workload.

Last Updates: The date and time when the workload was last modified.

See image.

Discovery Service Status: The status of the discovery service. The following statuses are the most commonly displayed:
Success: The service is running as expected.
Disabled: The service is disabled. To re-enable data collection, go to the AWS Accounts page.
Error: The service has discovered an issue.
Starting Discovery: Data collection has not been started.
No of Duplicates IP: The number of duplicate IP addresses in the region. If you have any duplicate IP addresses in a region, use namespaces to resolve them.

No of Private IP Addresses: The number of workloads that the tag discovery service has discovered. Each IP address represents a workload. If a workload has multiple IP addresses within it, it is shown as multiple workloads.

See image.

Supported regions for AWS include:

Region Code	Region Name
us-east-1	N. Virginia
us-east-2	Ohio
us-west-1	N. California
us-west-2	Oregon
eu-central-1	Frankfurt
eu-west-1	Ireland
eu-west-2	London
ap-southeast-1	Singapore
ap-south-1	Mumbai
ap-southeast-2	Sydney
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
