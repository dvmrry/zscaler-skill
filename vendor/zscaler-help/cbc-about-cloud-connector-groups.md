# About Cloud Connector Groups

**Source:** https://help.zscaler.com/cloud-branch-connector/about-cloud-connector-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1420476, revision 3240589

---

Cloud Connector groups are automatically created when you deploy a Zscaler Cloud Connector in Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
Groups provide the following benefits and enable you to:
- Apply policies to a group of deployed Cloud Connectors.
- Upgrade Cloud Connectors belonging to a group to maintain redundancy while upgrades are being executed.
When deploying a Cloud Connector, only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template.
# About the Overview Page
On the Overview page (Zero Trust Cloud > Cloud Connector > Cloud Connector Groups > Overview), you can do the following:
- Filter the list of groups by the following criteria:
  - Cloud: From the drop-down menu, select AWS, Azure, or GCP.
  - Group Type: From the drop-down menu, select Cloud Connector or Zero Trust Gateway.
  - Auto Scaling: From the drop-down menu, select True or False.
  - In the AWS Marketplace, autoscaling is referred to as Auto Scaling. In the Azure Marketplace, autoscaling is referred to as Virtual Machine Scale Sets (VMSS). In the Google Cloud Marketplace, autoscaling is referred to as a Managed Instance Group (MIG) with autoscaling. In the Zscaler Admin Console, references to autoscaling also refer to Auto Scaling, VMSS, and a MIG with autoscaling. To enable Auto Scaling, VMSS, or a MIG with autoscaling, contact Zscaler Support.
  - Location: From the drop-down menu, select your desired location.
- Clear the filters applied to the list of groups.
- Search for a Cloud Connector group or an individual Cloud Connector.
- Modify the table and its columns.
- Select two or more groups or multiple individual Cloud Connector checkboxes to apply actions to the selected Cloud Connectors:
  - Schedule Upgrade: Designate a day and time for periodic software updates. To learn more, see Managing Cloud & Branch Connector Upgrades.
  - Manage Cleanup Frequency: Update the frequency at which Cloud Connector groups are automatically deleted by selecting Never, 60 Days, 90 Days, or 120 Days. This only applies to Cloud Connector groups. To learn more, see About Cleanup Activity.
  - Cleanup Activity is in Limited Availability (LA). To enable this feature, contact Zscaler Support.
  - Enable: Enable an individual Cloud Connector or group of Cloud Connectors.
  - Disable: Disable an individual Cloud Connector or group of Cloud Connectors, which stops traffic from processing. Disabling a Cloud Connector does not delete it.
  - Upgrade Release Channel: Update the release channel by selecting Stable, Beta, or Latest. To learn more, see Managing Cloud & Branch Connector Upgrades.
- View the following group details:
  - Name: The name of the Cloud Connector group.
  - Location: The location where the Cloud Connector group is deployed.
  - Group Type: The Cloud Connector group type (i.e., Cloud Connector or Zero Trust Gateway).
  - Operational Status: The operational status (i.e., Active, Inactive, or Disabled) of the Cloud Connector.
  - Availability Zone: The availability zone where the Cloud Connector is deployed.
  - Upgrade Window: The window of time scheduled for performing the Cloud Connector upgrades.
- Edit a Cloud Connector group or an individual Cloud Connector. To learn more, see Editing Cloud Connectors.
- View more details about the virtual machines (VMs) in a Cloud Connector group. When a GCP instance deployed in an instance group is deleted, it is replaced by a new one. The new instance appears in this section of the table.
- Delete a Cloud Connector. This action cannot be undone.
- Go to the Upgrade Manager page.
- Go to the Cleanup Activity page.
