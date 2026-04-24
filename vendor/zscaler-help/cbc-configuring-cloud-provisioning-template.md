# Configuring a Cloud Provisioning Template

**Source:** https://help.zscaler.com/cloud-branch-connector/configuring-cloud-provisioning-template
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Zscaler Cloud & Branch Connector Help 
Administration 
Provisioning & Configuration 
Configuring a Cloud Provisioning Template
Cloud & Branch Connector
Configuring a Cloud Provisioning Template
Ask Zscaler

Watch a video about Cloud Provisioning Templates (shows legacy UI).

This article provides information on how to configure a cloud provisioning template to create a cloud provisioning URL within the Zscaler Admin Console. This URL is used for deploying Cloud Connector as a virtual machine (VM) in Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP). To learn more, see Deploying Zscaler Cloud Connector with Amazon Web Services, Deploying Zscaler Cloud Connector with Microsoft Azure, and Deploying Zscaler Cloud Connector on the Google Cloud Platform.

When deploying a Cloud Connector, only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template.

To add a Cloud Connector Provisioning Template:

Go to Infrastructure > Connectors > Cloud > Management > Provisioning.
Click Add Cloud Connector Provisioning Template.
On the page:

On the General Information tab:

Name: Enter a name for your provisioning template.
Description: (Optional) Enter additional information about the provisioning template.

See image.

Close

On the Cloud Provider tab, select Amazon Web Services, Azure, or Google Cloud as the cloud provider for which you want to deploy the Cloud Connector.

See image.

Close

On the Location tab:
Location Creation: This field is set to Automatic.

Location Template: Select a location template from the drop-down menu based on your requirements. To learn more, see About Location Templates.

See image.

Close

On the Group Information tab:
Cloud Connector Group Creation: This field is set to Automatic.
VM Size: Depending on your selected cloud provider, you can configure your Cloud Connector VM size.
Amazon Web Services: Select from Small, Medium, or Large. Small is set by default when auto scaling is enabled.
Azure: Small is set by default.
GCP: Small is set by default.

Auto Scaling: Enable or disable autoscaling for AWS, Azure, or GCP.

In the AWS Marketplace, autoscaling is referred to as Auto Scaling. In the Azure Marketplace, autoscaling is referred to as Virtual Machine Scale Sets (VMSS). In the Google Cloud Marketplace, autoscaling is referred to as a Managed Instance Group (MIG) with autoscaling. In the Zscaler Cloud & Branch Connector Admin Portal, references to autoscaling also refer to Auto Scaling, VMSS, and a MIG with autoscaling. To enable Auto Scaling, VMSS, or a MIG with autoscaling, contact Zscaler Support.

See image.

Close

On the Review tab, review the values and settings entered.

See image.

Close

Click Save. A cloud provisioning URL is created.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Cloud Provisioning Templates
Configuring a Cloud Provisioning Template
About Branch Configuration Templates
Configuring a Branch Connector Configuration Template
