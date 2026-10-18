# Accessing Cloud & Branch Connector Monitoring

**Source:** https://help.zscaler.com/cloud-branch-connector/accessing-cloud-branch-connector-monitoring
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1420526, revision 3243619

---

The Cloud & Branch Connector Monitoring pages provide information on the name, group, location, geolocation, and status of your Cloud and Branch Connector virtual machines (VMs) deployed in your cloud or branch accounts. You can use the Refresh icon to refresh the dashboard to view the most recent information. To view the Cloud Connector Monitoring page, from the navigation menu, go to Zero Trust Cloud > Cloud Connector > Cloud Connector Overview. To view the Branch Connector Monitoring Page, go to Infrastructure > Branch Connector > Branch Connector Monitoring.
# Accessing the Cloud & Branch Connector Monitoring Pages
On the Cloud & Branch Connector Monitoring page, you can view and configure location filtering, widgets, and the Cloud & Branch Connector Monitoring table.
## Filtering
You can filter Cloud Connectors by the following criteria:
- Cloud: The cloud provider (i.e., Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP))
- Regions: The region in your account
- Account ID: The AWS account ID, the Azure subscription ID, or the GCP project name
- Auto Scaling: The status of autoscaling (i.e., True or False)
- VPC/Vnet: The VPC or VNet of the Cloud Connector
- Sub-Network: The sub-network of the Cloud Connector
- Host ID: The host ID of the Cloud Connector
- Location: The location of the Cloud Connector
- Status: The status of the Cloud Connector (i.e., Active, Inactive, or Disabled)
You can filter Branch Connectors by the following criteria:
- Location: The location of the Branch Connector
- Status: The status of the Branch Connector (i.e., Active, Inactive, or Disabled)
- Branch Connector Location: The location of your Branch Connector
See image.
## Widgets
The Cloud & Branch Connector Monitoring page provides the following widgets:
- Total Entitled
- The Total Entitled chart displays the number of Cloud and Branch Connectors deployed over the filtered locations. The total entitled number is the number of Cloud Connectors/Branch Connectors you can deploy in your environments.
- Deployment statuses are:
  - Deployed: This shows the quota of Cloud Connectors/Branch Connectors from your entitlement that are deployed on your cloud or branch account.
  - Ready to Deploy: This shows the quota of remaining Cloud Connectors/Branch Connectors from your entitlement that can be deployed.
- You can hover over the chart to see the number of deployed and ready to deploy Cloud and Branch Connectors.
- See image.
- Deployed Devices
- The Deployed Devices chart displays the number of Cloud and Branch Connectors that are active, inactive, or disabled according to your filters.
- Activity statuses are:
  - Active: All active Cloud and Branch Connectors that are deployed according to your filters.
  - Inactive: All inactive Cloud and Branch Connectors that are deployed according to your filters. When a Cloud Connector is inactive, it cannot contact the management plane of the Cloud Connector. In cases where the data plane is healthy, but the management plane is unhealthy, the Cloud Connector status is inactive. This status has no service impact, and the Cloud Connector still processes the data, but it occurs because the Zscaler service cannot establish the management plane connection.
  - Disabled: All disabled Cloud and Branch Connectors that are deployed according to your filters. Cloud Connectors are only disabled when they have been administratively disabled in the Zscaler Admin Console.
- You can hover over the chart to see the number of active, inactive, or disabled Cloud and Branch Connectors.
- See image.
- Geoview
- The Geoview provides the geographic locations of all Cloud and Branch Connectors deployed on your cloud or branch accounts. You can use the location filtering to filter particular Cloud and Branch Connectors based on your requirements. The map displays the number of Cloud and Branch Connectors deployed in different regions. You can click the cluster to view all the Cloud and Branch Connectors in a particular region along with their cloud provider type (i.e., AWS, Azure, GCP, VMware). You can also click any Cloud or Branch Connector to view more information such as Deployment Type, Group, Availability Zone, etc. If a Cloud or Branch Connector is inactive, the reason for the connector's inactive status is displayed.
- You can click and drag the map to view different regions. You can also zoom in and out of the map to better view regions of interest.
- See image.
## Cloud & Branch Connector Monitoring Table
The table displays:
- Name: The name of the Cloud or Branch Connector
- Type: The cloud provider type, hypervisor host, or hardware device
- Group: The name of the group to which the Cloud or Branch Connector VM is assigned
- Location: The location of the Cloud or Branch Connector Group
- Account ID: The AWS account ID, the Azure subscription ID, or the GCP project name. This column only applies to Cloud Connector.
- Geo Location: The physical location of the Cloud or Branch Connector when deployed
- Auto Scaling: The status of auto scaling (i.e., True or False). This column only applies to Cloud Connector
- Status: The status of the Cloud Connector (i.e., Active or Inactive)
- HA Status: The high availability (HA) status of the Branch Connector. This column only applies to Branch Connector
- VM Size: The size of the virtual machine (i.e., Small or Medium)
- More information about the Cloud and Branch Connectors. Click the View icon to access the Cloud Connector Details or Branch Connector Details page, where the general, management, and traffic forwarding information for the selected Cloud or Branch Connector is available.
See image.
