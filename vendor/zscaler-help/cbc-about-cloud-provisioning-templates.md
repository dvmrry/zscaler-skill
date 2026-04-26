# About Cloud Provisioning Templates

**Source:** https://help.zscaler.com/cloud-branch-connector/about-cloud-provisioning-templates
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Administration 
Provisioning & Configuration 
About Cloud Provisioning Templates
Cloud & Branch Connector
About Cloud Provisioning Templates
Ask Zscaler

Watch a video about Cloud Provisioning Templates (shows legacy UI).

The cloud provisioning URL is a prerequisite for deploying the Cloud Connector as a virtual machine (VM) in Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP). To obtain a provisioning URL, you must configure the provisioning template.

When deploying a Cloud Connector, only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template.

Cloud Connector Provisioning Templates provide the following benefits and enable you to:

Set up required preconfigurations for deployment.
Use the same provisioning URL multiple times based on your requirements.

You must use the same provisioning URL for the Cloud Connector VMs deployed in a single Virtual Private Cloud (VPC).

About the Cloud Provisioning Template Page

On the Cloud Provisioning Templates page (Infrastructure > Connectors > Cloud > Management > Provisioning), you can do the following:

Refresh the table.
Search for a cloud provisioning template.
Add a Cloud Connector Provisioning Template.
View a list of all cloud provisioning templates that are configured for your organization.
Template Name: The name of the template.
Cloud Provider Type: The Cloud Provider (AWS, Azure, or GCP).
Status: The status of the template deployment.
VM Size: The size of the virtual machine.

Auto Scaling: The status of autoscaling (i.e., True or False). Zscaler supports autoscaling in AWS, Azure, and GCP.

In the AWS Marketplace, autoscaling is referred to as Auto Scaling. In the Azure Marketplace, autoscaling is referred to as Virtual Machine Scale Sets (VMSS). In the Google Cloud Marketplace, autoscaling is referred to as a Managed Instance Group (MIG) with autoscaling. In the Zscaler Cloud & Branch Connector Admin Portal, references to autoscaling also refer to VMSS and a MIG with autoscaling. To enable Auto Scaling, VMSS, or a MIG with autoscaling, contact Zscaler Support.

Last Modified By: The last admin to modify the template.
Last Modified On: The date and time the template was last modified.
Modify the table and its columns.
Click the arrow in the Template Name field to copy the cloud provisioning URL.
Edit the cloud provisioning template.
Delete the cloud provisioning template.
View the cloud provisioning template configurations.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Cloud Provisioning Templates
Configuring a Cloud Provisioning Template
About Branch Configuration Templates
Configuring a Branch Connector Configuration Template
