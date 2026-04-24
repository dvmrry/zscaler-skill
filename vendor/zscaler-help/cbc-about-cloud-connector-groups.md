# About Cloud Connector Groups

**Source:** https://help.zscaler.com/cloud-branch-connector/about-cloud-connector-groups
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Zscaler Cloud & Branch Connector Help 
Administration 
Cloud Connector Group Management 
About Cloud Connector Groups
Cloud & Branch Connector
About Cloud Connector Groups
Ask Zscaler

Cloud Connector groups are automatically created when you deploy a Zscaler Cloud Connector in Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).

Groups provide the following benefits and enable you to:

Apply policies to a group of deployed Cloud Connectors.
Upgrade Cloud Connectors belonging to a group to maintain redundancy while upgrades are being executed.

When deploying a Cloud Connector, only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template.

About the Overview Page

On the Overview page (Infrastructure > Connectors > Cloud > Management > Cloud Connector Groups), you can do the following:

Filter the list of groups by the following criteria:
Cloud: From the drop-down menu, select AWS, Azure, or GCP.
Group Type: From the drop-down menu, select Cloud Connector or Zero Trust Gateway.

Auto Scaling: From the drop-down menu, select True or False.

In the AWS Marketplace, autoscaling is referred to as Auto Scaling. In the Azure Marketplace, autoscaling is referred to as Virtual Machine Scale Sets (VMSS). In the Google Cloud Marketplace, autoscaling is referred to as a Managed Instance Group (MIG) with autoscaling. In the Zscaler Admin Console, references to autoscaling also refer to Auto Scaling, VMSS, and a MIG with autoscaling. To enable Auto Scaling, VMSS, or a MIG with autoscaling, contact Zscaler Support.

Location: From the drop-down menu, select your desired location.
Clear the filters applied to the list of groups.
Search for a Cloud Connector group or an individual Cloud Connector.
Modify the table and its columns.
Select two or more groups or multiple individual Cloud Connector checkboxes to apply actions to the selected Cloud Connectors:
Schedule Upgrade: Designate a day and time for periodic software updates. To learn more, see Managing Cloud & Branch Connector Upgrades.
Enable: Enable an individual Cloud Connector or group of Cloud Connectors.
Disable: Disable an individual Cloud Connector or group of Cloud Connectors, which stops traffic from processing. Disabling a Cloud Connector does not delete it.
View the following group details:
Name: The name of the Cloud Connector group.
Location: The location where the Cloud Connector group is deployed.
Group Type: The Cloud Connector group type (i.e., Cloud Connector or Zero Trust Gateway).
Operational Status: The operational status (i.e., Active, Inactive, or Disabled) of the Cloud Connector.
Availability Zone: The availability zone where the Cloud Connector is deployed.
Upgrade Window: The window of time scheduled for performing the Cloud Connector upgrades.
View more details about a Cloud Connector group. When a GCP instance deployed in an instance group is deleted, it is replaced by a new one. The new instance appears in this section of the table.
Edit a Cloud Connector group or an individual Cloud Connector. To learn more, see Editing Cloud Connectors.
Delete a Cloud Connector. This action cannot be undone.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Cloud Connector Groups
Editing Cloud Connectors
