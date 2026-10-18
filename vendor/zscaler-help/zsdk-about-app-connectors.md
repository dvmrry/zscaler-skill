# About App Connectors

**Source:** https://help.zscaler.com/zsdk/about-app-connectors
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1507546, revision 3015006

---

App Connectors provide a secure authenticated interface between a customer’s servers and the ZSDK cloud.
App Connectors provide the following benefits and enable you to:
- Securely connect to private applications hosted in a data center, virtual private cloud, or virtual network.
- Deploy in a variety of physical and virtual environments, including virtual machines (VMs), private clouds, public clouds, and container orchestration platforms.
- View individual App Connector connections and health status.
- Disable App Connectors from accepting traffic in a specific App Connector group.
- Force a staged update in advance of the update schedule.
App Connectors can be deployed in several form factors. Zscaler distributes a standard VM image for deployment in enterprise data centers, local private cloud environments such as VMware, or public cloud environments such as Amazon Web Services (AWS) EC2. Additionally, Zscaler provides packages that can be installed on supported Linux distributions.
- List of Platforms Supported
  - Amazon Web Services (AWS)
  - Google Cloud Platform (GCP)
  - Linux (Red Hat Enterprise Linux 8 or 9)
  - Microsoft Azure
  - VMware vCenter or vSphere Hypervisor (ESXi)
  - Nutanix
  - Docker
  - OpenShift
App Connectors can be co-located with your applications, or they can be deployed in any location that has connectivity to the applications. ZSDK selects the closest App Connector given the location of the user and the App Connector-to-application latency. Typically, App Connectors are deployed on network segments that can access secured applications and the ZSDK cloud simultaneously, such as in a Demilitarized Zone. App Connectors only connect outbound; they do not need any inbound open ports to operate correctly. App Connectors are always active, so they are typically deployed in a redundant configuration. However, App Connectors never communicate with each other.
# About the App Connectors Page
On the App Connectors page (Configuration & Control > Private Infrastucture > App Connector Management > App Connectors), you can do the following:
- Configure the App Connector Settings.
- Expand all the rows or one row to learn more about the App Connector.
  - Expanding the App Connector Name
  - When you expand the App Connector, the following information displays depending on the defined App Connector:
    - **Description**: The description of the App Connector, if available.
    - **App Connector Group**: The App Connector group that the App Connector is a member of.
    - **App Connector Host Platform**: The platform that the App Connector is deployed on (e.g., AWS, Azure, ESXi, Docker, or Nutanix).
    - **App Connector Host OS**: The run-time OS on which the App Connector is running (e.g., CentOS Linux 7, Red Hat Enterprise Linux 7, Red Hat Enterprise Linux 8, Red Hat Enterprise Linux 9).
    - **App Connector Package OS**: The compile-time OS on which the .rpm binary is packaged (e.g., Enterprise Linux 7).
    - **Last Software Update**: The date and time the App Connector was last updated to a newer software version.
    - **Public Service Edge**: The ZSDK Public Service Edge that the App Connector connects to.
    - **Last Connection to Zscaler**: The last time when the App Connector connected to Zscaler.
    - **Last Disconnect from Zscaler**: The last time when the App Connector disconnected from Zscaler.
    - **Location**: The location where the App Connector group that the App Connector belongs to is set up.
    - **Public IP**: The public IP address of the App Connector. Disconnected App Connectors show the last known public IP address.
    - **Private IP**: The private IP address of the App Connector. Disconnected App Connectors show the last known private IP address.
    - **Uptime**: The period of time the App Connector is available for use. Disconnected App Connectors show the value **Not Available**.
    - **Enrollment Certificate**: The certificate the App Connector uses for enrollment.
- Add, edit, or delete an App Connector.
- Refresh the App Connectors page to reflect the most current information.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all deployed App Connectors. For each deployed App Connector, you can see:
  - **Name**: The name of the App Connector.
  - **Manager Version**: The version of the current App Connector Manager software.
  - **Current Software Version**: The current App Connector software version.
  - **Connection Status**: The status of the App Connector connection.
  - **Upgrade Status**: The status of the last App Connector software update.
  - **Status**: Whether the App Connector is enabled or disabled.
- App Connectors that you've added, but have not deployed, are not listed.
- View a configuration graph of connected objects.
- Go to the App Connector Groups or App Connector Provisioning Keys pages.
