# Configuring Workload Discovery for Workloads in Amazon Web Services

**Source:** https://help.zscaler.com/cloud-branch-connector/configuring-workload-discovery-workloads-amazon-web-services
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Administration 
Cloud Connector Partner Integrations 
Configuring Workload Discovery for Workloads in Amazon Web Services
Cloud & Branch Connector
Configuring Workload Discovery for Workloads in Amazon Web Services
Ask Zscaler

The workload discovery service is a Zscaler-managed service that discovers workloads in your Amazon Web Services (AWS) account. The service also fetches associated metadata such as user-defined tags and cloud service provider-generated attributes. These user-defined tags and cloud service provider-generated attributes are used in security policies.

Zscaler supports the following attributes:

GroupId: The ID of the security group assigned to the attached Elastic Network Interface (ENI). This attribute can identify the AWS Lambda function workload.
GroupName: The name of the security group assigned to the attached ENI.
ImageId: The ID of the image used to launch the instance.
PlatformDetails: The platform. Zscaler also supports AWS Lambda and other services when not used in the context of Amazon Elastic Compute Cloud (EC2).
Vpc-id: The ID of the virtual private cloud (VPC) that the ENI runs in.
IamInstanceProfile-Arn: The Amazon Resource Name (ARN) of the Identity Access Management (IAM) instance profile.
Configuring Workload Discovery Services

To enable workload discovery services, onboard your AWS account into the Zscaler Admin Console. After your AWS account appears in the Zscaler Admin Console, create a configuration in your AWS account. To learn more about adding an AWS account, see Adding an Amazon Web Services Account. The following changes are required to add a configuration to your AWS account:

Create a Role
Update the Cloud Connector Role for SQS Permissions
Configure EventBridge
Configure Namespace and Duplicate IP Addresses
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
