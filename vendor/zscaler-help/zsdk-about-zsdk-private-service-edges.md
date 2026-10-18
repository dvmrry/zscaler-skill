# About ZSDK Private Service Edges

**Source:** https://help.zscaler.com/zsdk/about-zsdk-private-service-edges
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1510296, revision 3114790

---

ZSDK Private Service Edges are single-tenant instance brokers that provide similar functionality of Public Service Edge in an organization’s environment instead of a Zscaler data center. Your organization hosts them either within your site or on a cloud service, but Zscaler manages them.
Similar to Public Service Edges, Private Service Edges manage the connections from App Connectors. Private Service Edges register with the ZSDK cloud, which allows them to download the relevant policies and configurations in order to enforce all policies.
Private Service Edges provide the following benefits and enable you to:
- Implement Zero Trust Network Access (ZTNA) for all of your users.
- Securely access applications when Public Service Edges in data centers are not conveniently located between users and the applications they need to reach.
- Ensure business continuity and continued access to critical services during disaster events.
- Keep application data traffic local to help meet compliance and regulatory requirements.
Private Service Edges can be deployed in different forms. Zscaler distributes images for deployment in enterprise data centers and local private cloud environments (e.g., VMware). Zscaler recommends reading the Private Service Edge Deployment Prerequisites prior to deploying Private Service Edges.
After you add and deploy a Private Service Edge, it displays on the Private Service Edges page. You can continue performing additional software management and maintenance tasks after deployment.
A user connects to the Private Service Edge to access resources through a public IP address. After a user connects to a Private Service Edge, the user's location is determined by its public IP address, and then a country-based policy for the mapped country is enforced. To learn more, see About Access Policy.
If the location of the Private Service Edge group is updated for an existing connection, the Public Service Edge uses the old location until the next time it makes a new connection. Location changes via a GeoIP configuration override are not supported for Private Service Edges.
# About the Private Service Edges Page
On the Private Service Edges page (Configuration & Control > Private Infrastructure > Private Service Edge Management > Private Service Edges), you can do the following:
- Filter the information that appears in the table. By default, no filters are applied.
  - Filter Actions
  - You can also save applied filters to your preferences so that they're visible in future user sessions.
  - View a list of applied filters available from the current and previous user sessions. You must save applied filters to the user session before viewing them. Use the drop-down menu to select the applied filters to view.
  - Hide the filters on the page by clicking Hide Filters. After the filters are hidden, click Show Filters to show them again.
- Refresh the Private Service Edges page to reflect the most current information.
- Add a new Private Service Edge.
- Expand all rows or one row in the table to see more information about each Private Service Edge.
  - Private Service Edge Details
  - When you expand a Private Service Edge, the following information displays:
    - Description: The description of the Private Service Edge.
    - Private Service Edge Group: The assigned Private Service Edge group for the Private Service Edge.
    - Private Service Edge Host Platform: The platform that the Private Service Edge is hosted on (e.g., AWS, ESXi, VMware).
    - Private Service Edge Host OS: The run-time OS on which the Private Service Edge is running (e.g., CentOS Linux 7).
    - Private Service Edge Package OS: The compile-time OS on which the .rpm binary is packaged (e.g., Enterprise Linux 7).
    - Last Software Update: The date and time when the Private Service Edge was last updated to a software version.
    - Public Service Edge: The Public Service Edge that the Private Service Edge connects to.
    - Last Connection to Zscaler: The last time the Private Service Edge connected to Zscaler.
    - Last Disconnect from Zscaler: The last time the Private Service Edge disconnected from Zscaler.
    - Location: The location of the Private Service Edge group that is assigned to the Private Service Edge.
    - Public IP: The public IP address of the Private Service Edge. If the Private Service Edge was disconnected, the last known public IP address displays.
    - Private IP: The private IP address of the Private Service Edge. If the Private Service Edge was disconnected, the last known private IP address displays.
    - Uptime: The time duration when the Private Service Edge is available for use. If the Private Service Edge is disconnected, Not Available displays as the value.
    - Enrollment Certificate The enrollment certificate used for the Private Service Edge.
    - Supporting Files Upgrade Status: When enabled, this field indicates the upgrade status and current version of the supporting files used to map the public IP address of the Private Service Edge to the country where the IP address is registered.
    - The Information icon appears next to the supporting file to indicate the supporting file failed to upgrade.
    - Publish IPs or Domains: The IP addresses and domains that clients and App Connectors can use to open a connection to the Private Service Edge. If these are not specified, then the clients and App Connectors try to connect using the Listen IPs.
    - Listen IPs: The IP addresses that the Private Service Edge listens for connection requests from clients and App Connectors at set addresses. If this is not configured, then the Private Service Edge listens to all interfaces.
- View a list of all deployed Private Service Edges. For each deployed Private Service Edge, you see:
  - Name: The name of the Private Service Edge.
  - Manager Version: The current version of the Private Service Edge Manager software.
  - Current Software Version: The current Private Service Edge software version.
  - Connection Status: The connection status of the Private Service Edge.
  - Upgrade Status: The status when Private Service Edge was last updated.
  - Status: Whether the Private Service Edge is enabled or disabled.
  - Actions: The actions you can take.
- Added but undeployed Private Service Edges are not listed.
- Modify the columns displayed in the table.
- Edit the deployed Private Service Edge.
- Delete the deployed Private Service Edge.
- Configure the number of rows for the table.
- Move between pages of deployed Private Service Edges.
- Go to one of the following pages:
  - Private Service Edge Groups: Manage your Private Service Edge groups.
  - Private Service Edge Provisioning Keys: Manage your Private Service Edge provisioning keys.
