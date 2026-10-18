# Configuring a Cloud Provisioning Template

**Source:** https://help.zscaler.com/cloud-branch-connector/configuring-cloud-provisioning-template
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1420466, revision 3240496

---

Watch a video about Cloud Provisioning Templates (shows legacy UI).
This article provides information on how to configure a cloud provisioning template to create a cloud provisioning URL within the Zscaler Admin Console. This URL is used for deploying Cloud Connector as a virtual machine (VM) in Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP). To learn more, see Deploying Zscaler Cloud Connector with Amazon Web Services, Deploying Zscaler Cloud Connector with Microsoft Azure, and Deploying Zscaler Cloud Connector on the Google Cloud Platform.
To add a Cloud Connector Provisioning Template:
- From the navigation menu, go to Zero Trust Cloud > Cloud Connector > Provisioning Templates.
- Click Add Cloud Connector Provisioning Template.
- On the Add Cloud Connector Provisioning Template page:
  - On the General Information tab:
    - Name: Enter a name for your provisioning template.
    - Description: (Optional) Enter additional information about the provisioning template.
  - See image.
  - On the Cloud Provider tab, select Amazon Web Services, Azure, or Google Cloud as the cloud provider for which you want to deploy the Cloud Connector.
  - See image.
  - On the Location tab:
    - Location Creation: This field is set to Automatic.
    - Location Template: Select a location template from the drop-down menu based on your requirements. To learn more, see About Location Templates.
    - See image.
  - On the Group Information tab:
    - Cloud Connector Group Creation: This field is set to Automatic.
    - VM Size: Depending on your selected cloud provider, you can configure your Cloud Connector VM size.
      - Amazon Web Services: Select from Small, Medium, or Large. Small is set by default when autoscaling is enabled.
      - Azure: Small is set by default.
      - GCP: Small is set by default.
    - Auto Scaling: Enable or disable autoscaling for AWS, Azure, or GCP.
    - In the AWS Marketplace, autoscaling is referred to as Auto Scaling. In the Azure Marketplace, autoscaling is referred to as Virtual Machine Scale Sets (VMSS). In the Google Cloud Marketplace, autoscaling is referred to as a Managed Instance Group (MIG) with autoscaling. In the Zscaler Admin Console, references to autoscaling also refer to Auto Scaling, VMSS, and a MIG with autoscaling. To enable Auto Scaling, VMSS, or a MIG with autoscaling, contact Zscaler Support.
    - Choose release channel: From the drop-down menu, select Stable, Latest, or Beta:
      - Stable: Select Stable to deploy your Cloud Connector on the channel that has been widely adopted and tested in real environments.
      - Latest: Select Latest to deploy your Cloud Connector on the channel that has the most recent production release.
      - Beta: Select Beta to deploy your Cloud Connector on the channel that has early access to new features and improvements. This channel might contain bugs and instability.
    - Auto Cleanup Frequency: From the drop-down menu, select Never, 60 Days, 90 Days, or 120 Days. The number of days you select determines when the Cloud Connector group auto-deletes inactive instances.
    - Forced Delete: Select the checkbox to allow the deletion of Cloud Connectors, even if they are used by Internet & SaaS or Private Access traffic forwarding policies. If the deleted connector was the only location, the policy is bypassed. If not, the policy continues to apply to the remaining locations or Cloud Connector groups.
    - Auto Cleanup and Forced Delete are in Limited Availability (LA). To enable this feature, contact Zscaler Support.
    - See image.
  - On the Review tab, review the values and settings entered.
  - See image.
- Click Save. A cloud provisioning URL is created.
