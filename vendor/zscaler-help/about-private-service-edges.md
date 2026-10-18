# About Private Service Edges

**Source:** https://help.zscaler.com/zpa/about-private-service-edges
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1484466, revision 3236354

---

Watch a video about Private Service Edges (shows legacy UI).
Private Service Edges for Private Access (ZPA) are single-tenant instance brokers that provide the functionality of a Public Service Edge for Private Access in an organization’s environment. Your organization hosts them either within your site or on a cloud service, but Zscaler manages them. On the other hand, Public Service Edges are deployed in Zscaler data centers around the world. To learn more, see Understanding Private Service Edges.
As with a Public Service Edge, a Private Service Edge manages the connections between Zscaler Client Connector and App Connectors. It registers with the Private Access Cloud. This allows a Private Service Edge to download the relevant policies and configurations so it can enforce all Private Access policies. It also caches path selection decisions.
Private Service Edges provide the following benefits and enable you to:
- Implement Zero Trust Network Access (ZTNA) for on-premises users.
- Securely access applications when Public Service Edges in data centers are not conveniently located between users and the applications they need to reach.
- Ensure business continuity and continued access to critical apps during disaster events.
- Keep application data traffic local to help meet compliance and regulatory requirements.
Private Service Edges can be deployed in several forms. Zscaler distributes images for deployment in enterprise data centers and local private cloud environments such as VMware.
- List of platforms supported by Private Access
  - Amazon Web Services (AWS)
  - Docker
  - Google Cloud Platform (GCP)
  - Linux
  - Microsoft Azure
  - VMware Platforms
- Private Access provides Security Technical Implementation Guide (STIG) images are available for AWS, GCP, Microsoft Azure, and VMware by default. To learn more, see Private Service Edge Software by Platform.
Before you begin, see Private Service Edges Deployment Prerequisites, which provides detailed information on virtual image (VM) sizing and scalability, supported platform requirements, deployment best practices, and other essential guidelines.
Configuring Private Service Edges involves two main tasks:
- Adding Private Service Edges using the Zscaler Admin Console, which includes applying enrollment tokens (preferred) or obtaining a Private Service Edge provisioning key.
- Deploying Private Service Edges on the supported platform of your choice.
After a Private Service Edge is added and deployed, it is displayed on the Private Service Edge page. You can perform additional software management and maintenance tasks after deployment. To learn more, see Managing Deployed Software Components and About Private Service Edge Software Updates.
The Private Service Edge uses the public IP address of the user who connects to the Private Service Edge to access private resources. After a user connects to a Private Service Edge, the location of the user is determined by its public IP address, and then a country-based policy for the mapped country is enforced. To learn more, see About Access Policy.
If a user connects to a Private Service Edge with an RFC 1918 IP address, then the location of the Private Service Edge is used to evaluate policies with country criteria.
If the location of the Private Service Edge Group is updated for an existing connection, the Private Service Edge uses the old location until the next time it makes a new connection. Location changes via a GeoIP configuration override are not supported for Private Service Edges. To learn more, contact Zscaler Support.
# About the Private Service Edges Page
On the Private Service Edges page (Private Access > Private Infrastructure > Private Service Edges), you can do the following:
- Configure the Private Service Edge settings. You can enable **Auto Delete** to remove disconnected or optionally disabled Private Service Edges after a set number of days.
- Add a new Private Service Edge.
- Private Service Edges that are managed by Zscaler are read only and cannot be configured.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
- Refresh the Private Service Edges page to reflect the most current information.
- Modify the columns displayed in the table.
- View a list of all deployed Private Service Edges. Private Service Edges that you've added but have not deployed are not listed.
  - **Name**: The name of the Private Service Edge. OAuth-enabled Private Service Edges are added with a name format of GroupName-UserCode-TimeStamp. When expanded, the following information is displayed depending on the defined Private Service Edge:
  - View details for each deployed Private Service Edge.
    - **Description**: The description of the Private Service Edge, if available.
    - **Private Service Edge Group**: The Private Service Edge group that the Private Service Edge is a member of.
    - **Enrollment Certificate**: The certificate used to authenticate Private Service Edges during the enrollment process. You can click the **Edit** icon to edit the properties of the certificate.
    - **Next Periodic Software Update:** The date and time of the next scheduled software update for the Private Service Edge group.
    - **Private Service Edge Host Platform**: The platform that the Private Service Edge is deployed on (e.g., AWS). If you are using a ZPA Appliance, ZT-8010-Zscaler Red Hat Image appears in this field.
    - **Private Service Edge Host OS**: The run time OS on which the Private Service Edge is running (e.g., Enterprise Linux 9).
    - **Private Service Edge Package OS**: The compile time OS on which the RPM binary is packaged (e.g., Red Hat Enterprise Linux 9).
    - **Last Software Update**: The date and time the Private Service Edge was last updated to a newer software version.
    - **Last Manager Update**: The date and time the Manager software was last updated to a later software version.
    - **Last OS Update**: The date and time the OS was last updated to a later software version.
    - **Public Service Edge**: The Public Service Edge that the Private Service Edge connects to.
    - **Last Connection to Zscaler**: The last time the Private Service Edge connected to Zscaler.
    - **Last Disconnect from Zscaler**: The last time the Private Service Edge disconnected from Zscaler.
    - **Location**: The location where the Private Service Edge group that the Private Service Edge belongs to is set up.
    - **Public IP**: The public IP address of the Private Service Edge. Disconnected Private Service Edges show the last known public IP address.
    - **Private IP**: The private IP address of the Private Service Edge. Disconnected Private Service Edges show the last known private IP address.
    - **Uptime**: The period of time the Private Service Edge is available for use. Disconnected Private Service Edges show the value **Not Available**.
    - **Supporting Files Upgrade Status**: When enabled, this field indicates the upgrade status and current version of the supporting files used to map the public IP address of the Private Service Edge to the country where the IP address is registered.
    - The Private Service Edge indicates Partial Failure for the Upgrade Status if a supporting file fails to upgrade. The **Information** icon appears next to the supporting file that failed to upgrade. To learn more, see Troubleshooting Private Service Edges.
    - ​​​​See image.
    - **Publish IPs or Domains**: The IP addresses and domains that clients and App Connectors can use to open a connection to the Private Service Edge. If this is not specified, then the clients and App Connectors try to connect using the Listen IPs.
    - **Listen IPs**: The IP addresses that the Private Service Edge listens for connection requests from clients and App Connectors only at set addresses. If not configured, the Private Service Edge listens to all interfaces.
    - **Operating System Updates**: Indicates whether automatic updates for the OS are **Enabled** or **Disabled**.
    - Automated OS security updates are only available for prebuilt Private Service Edge images on RHEL 9.x. Private Service Edges installed manually using an RPM file on a custom RHEL 9.x build are not supported.
    - **Platform Version**: The version of the Zscaler virtual image.
  - **Manager Version**: The version of the current Private Service Edge Manager software. To learn more, see Understanding the Manager Software.
  - **Software Version**: The current Private Service Edge software version.
  - **Version Profile**: The version profile applied to the Private Service Edge. You can hover over the **Information** icon on the **Version Profile** column heading to view a description of the **Default**, **Previous Default**, or **New Release** for the version profile. If a **Custom** version profile is configured, you can hover over the **Custom** link in the table to view details for it.
  - **Connection Health**: The health of the Private Service Edge connection (Connected or Disconnected).
  - **Software Update**: The status of the last Private Service Edge software update.
  - **Status**: Indicates whether the Private Service Edge is enabled or disabled.
  - **Manager Update**: The status of the Private Service Edge update. You can hover over the **Information** icon next to the update status to view more information, such as the scheduled version and upgrade window.
  - **OS Update**: The status of the OS update. You can hover over the **Information** icon next to the update status to view more information, such as the update window and status of the update (**Scheduled**, **Not Scheduled**, **In Progress**, **Success**, or **Failure**).
- Edit the configuration of a deployed Private Service Edge.
- Delete a deployed Private Service Edge configuration.
- Private Service Edges that are managed by Zscaler are read only and cannot be edited or deleted.
- Display more rows or a different page of the table.
