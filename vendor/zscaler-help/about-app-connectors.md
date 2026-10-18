# About App Connectors

**Source:** https://help.zscaler.com/zpa/about-connectors
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1483541, revision 3245347

---

Watch a video about App Connectors (shows legacy UI)
App Connectors provide the secure authenticated interface between a customer's servers and the Private Access (ZPA) cloud.
App Connectors provide the following benefits and enable you to:
- Securely connect to private applications hosted in a data center, virtual private cloud (VPC), or virtual network (VNET).
- Deploy in a variety of physical and virtual environments, including virtual machines, private clouds, public clouds, and container orchestration platforms.
- Deploy App Connectors in your tenant using OAuth 2.0 enrollment tokens or provisioning keys.
- View individual App Connector connections and health status.
- Disable App Connectors from accepting traffic in an App Connector group.
- Force a staged update in advance of the update schedule.
App Connectors can be deployed in several forms. Zscaler distributes a standard virtual machine (VM) image for deployment in enterprise data centers, local private cloud environments such as VMware, or public cloud environments such as Amazon Web Services (AWS) EC2. Additionally, Zscaler provides packages that can be installed on supported Linux distributioons.
- List of Platforms Supported by Private Access
  - Amazon Web Services (AWS)
  - Docker
  - Google Cloud Platform (GCP)
  - Kubernetes
  - Linux (Red Hat Enterprise Linux 8 or 9)
  - Microsoft Azure
  - Nutanix
  - OpenShift
  - VMware vCenter or vSphere Hypervisor (ESXi)
- Private Access provides Security Technical Implementation Guide (STIG) images for AWS, GCP, Microsoft Azure, Nutanix, and VMware by default. To learn more, see App Connector Software by Platform.
App Connectors can be built in other hypervisor environments, such as VMware, and other cloud environments (i.e., Google Cloud Platform, Oracle Cloud, etc.) by deploying a Linux instance and following the RPM-based deployment instructions. To learn more, see App Connector Deployment Guide for Linux.
App Connectors can be co-located with your enterprise applications, or they can be deployed in any location that has connectivity to the applications. Private Access selects the closest App Connector given the location of the user and the App Connector-to-application latency. Typically, they are deployed on network segments that can access secured applications and the Private Access cloud simultaneously, such as in a DMZ. App Connectors only connect outbound; they do not need any inbound open ports to operate correctly. App Connectors are always active, so they are typically deployed in a redundant configuration. However, App Connectors never communicate with each other.
Before you begin, see App Connector Deployment Prerequisites which provides detailed information on VM image sizing and scalability, supported platform requirements, deployment best practices, and other essential guidelines.
Configuring connectors involves two main tasks:
- Adding App Connectors using the Zscaler Admin Console, which includes applying OAuth enrollment tokens (preferred) or obtaining an App Connector provisioning key.
- Deploying App Connectors on the supported platform of your choice.
After an App Connector is added and deployed, it is displayed on the App Connectors page.
You can perform additional software management and maintenance tasks after deployment. To learn more, see Managing Deployed App Connectors and App Connector Software Updates.
If any App Connectors have been disconnected for one year or more, an alert appears when you log in to the Zscaler Admin Console. Click the number of disconnected App Connectors in the alert to open this page, which is filtered by the disconnected App Connectors so you can review or delete them.
# About the App Connectors Page
On the App Connectors page (Private Access > Private Infrastructure > App Connectors), you can do the following:
- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view. To learn more, see Using Tables.
- Hide the filters on the page by clicking **Hide Filters**. Click **Show Filters** to show the filters.
- Refresh the App Connector page to reflect the most current information.
- Configure the App Connector settings. You can enable **Auto Delete** to remove disconnected or optionally disabled App Connectors after a set number of days.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
- Add a new App Connector.
- View a list of all deployed App Connectors. App Connectors that you've added, but have not deployed, are not listed. For each deployed App Connector, you can see:
  - **Name**: The name of the App Connector. OAuth-enabled App Connectors are added with a name format of GroupName-UserCode-TimeStamp. Click the name to view the details for the App Connector.
    - View details for each deployed App Connector.
      - **Description**: The description of the App Connector, if available.
      - **App Connector Group**: The App Connector group that the App Connector is a member of.
      - **Enrollment Certificate**: The certificate the App Connector uses for enrollment. You can click the **Edit** icon to edit the properties of the certificate.
      - In most cases, the following fields appear on the page. In cases where an App Connector is managed using a Branch Connector, Zscaler Deception, or a Host Dedicated IP (HDIP) address, the following fields do not appear:
        - **Host Platform**: The platform that the App Connector is deployed on (e.g., AWS). If you are using a ZPA Appliance, ZT-8010-Zscaler Red Hat Image appears in this field.
        - **App Connector Host OS**: The run time OS on which the App Connector is running (e.g., Red Hat Enterprise Linux 8 and Red Hat Enterprise Linux 9).
        - **App Connector Package OS**: The compile time OS on which the RPM binary is packaged (e.g., Enterprise Linux 9).
      - **Last Software Update**: The date and time the App Connector was last updated to a later software version.
      - **Last Manager Update**: The date and time the Manager software was last updated to a later software version.
      - **Last OS Update**: The date and time the OS was last updated to a later software version.
      - **Public Service Edge**: The Private Access Public Service Edge that the App Connector connects to.
      - **Last Connection to Zscaler**: The last time the App Connector connected to Zscaler.
      - **Last Disconnect from Zscaler**: The last time the App Connector disconnected from Zscaler.
      - **Location**: The location where the App Connector group that the App Connector belongs to is set up.
      - **Public IP**: The public IP address of the App Connector. Disconnected App Connectors show the last known public IP address.
      - **Private IP**: The private IP address of the App Connector. Disconnected App Connectors show the last known private IP address.
      - **Uptime**: The period of time the App Connector is available for use. Disconnected App Connectors show the value **Not Available**.
      - **Enrollment Time**: The date and time the App Connector was enrolled.
      - **Operating System Updates**: Indicates whether automatic updates for the OS are enabled or disabled.
      - Automated OS security updates are only available for prebuilt App Connector images on RHEL 9.x. App Connectors installed manually using an RPM file on a custom RHEL 9.x build are not supported.
      - **Secure Shell (SSH)**: Indicates whether the default OS SSH setting is overridden and enabled or disabled.
  - **Manager Version**: The version of the current App Connector Manager software. To learn more, see Understanding the Manager Software.
  - **Software Version**: The current App Connector software version.
  - **Version Profile**: The version profile applied to the App Connector. You can hover over the **Information** icon on the **Version Profile** column heading to view a description of the **Default**, **Previous Default**, or **New Release** for the version profile. If a **Custom** version profile is configured, you can hover over the **Custom** link in the table to view details for it.
  - **Connection Health**: The health of the App Connector connection (Connected or Disconnected).
  - **Software Update**: The status of the last App Connector software update.
  - **Status**: Indicates whether the App Connector is enabled or disabled.
  - **Manager Update**: The status of the App Connector update. You can hover over the **Information** icon next to the update status to view more information, such as the scheduled version and upgrade window.
  - **OS Update**: The status of the OS update. You can hover over the **Information** icon next to the update status to view more information, such as the update window and status of the update (**Scheduled**, **Not Scheduled**, **In Progress**, **Success**, or **Failure**).
- Modify the columns displayed in the table.
- View a configuration graph of connected objects.
- Edit the configuration of a deployed App Connector.
- App Connectors that are managed by Zscaler are read only and cannot be edited or deleted.
- Delete a deployed App Connector or update an App Connector now.
To replace a deployed App Connector, you must delete the configuration and then re-enroll it. However, you can apply the new App Connector provisioning key to the virtual machine (VM) image that you already deployed by replacing the old key.
If an App Connector is configured using Zscaler Deception, then the edit and delete options are unavailable.
See image.
- Display more rows or a different page of the table.
