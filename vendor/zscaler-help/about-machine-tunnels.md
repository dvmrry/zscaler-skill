# About Machine Tunnels

**Source:** https://help.zscaler.com/zscaler-client-connector/about-machine-tunnels
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1370131, revision 3241348

---

A machine tunnel allows a user's Windows or macOS device to establish a connection to a service before the user is logged in to Zscaler Client Connector. Zscaler Client Connector doesn't support machine tunnels for iOS, Linux, Android, and Android on ChromeOS.
- Admins can enable **ZPA Machine Authentication** in App Profiles to require users to authenticate against their IdP before the machine tunnel starts.
- WebView2 authentication is not supported for Machine Tunnels.
- Machine tunnels used with Transparent Proxy-based Interception mode enabled must have inbound traffic to ZscalerTunnel allowed in firewall rules to allow access to Private Access apps. In addition, be sure to disable FileVault to allow Private Access connections before a user logs in to Zscaler Client Connector on their device. To learn more, see Zscaler Client Connector Processes to Allowlist.
To use a machine tunnel, you must configure Machines groups and Machine Provisioning keys in the Zscaler Admin Console, add keys to Zscaler Client Connector app profile rules for Windows or macOS, and enable the Private Access machine tunnel for all.
The Machine Tunnel page provides the following benefits and enables you to:
- View a list of machines and details for your organization.
- Search for a machine tunnel by hostname, filter by operating system and status, and export machine tunnel details as a CSV file.
- View details for a machine tunnel and copy the token for each machine.
- Remove machine tunnels from the Zscaler Admin Console.
# About the Machine Tunnel Page
On the Machine Tunnel page (Infrastructure > Client Connector > Machine Tunnel), you can do the following:
- Filter the list of enrolled devices with the following options:
  - View machines for a specific operating system.
  - View machines by status:
    - **Active**: The default status. The machine tunnel is connected to Private Access before user login.
    - **Inactive**: The machine tunnel is not connected to Private Access for various reasons, including the following:
      - The machine tunnel was turned off by the admin and cannot establish a connection.
      - The device was turned off or disconnected from the network.
      - The machine tunnel failed to establish a connection because of connection issues or failed authentication.
      - The machine tunnel was not enabled for the device in Zscaler Service Entitlement.
    - **Removed:** The machine tunnel configuration was deleted or deactivated from the Zscaler Admin Console.
    - **Unregistered:** The machine tunnel is no longer connected to Zscaler services or policies.
- Remove selected machine tunnels from the Zscaler Admin Console by either clicking **Delete** from the **Actions** drop-down menu or clicking the **Delete** icon.
- Search for a machine tunnel by **Hostname**, **Machine Tunnel Token**, **Hardware Fingerprint**, or **Zscaler Client Connector Version**.
- View a list of machines for your organization. For each machine tunnel, you can see:
  - **Hostname**: The name of the machine.
  - **OS Type**: The operating system of the machine.
  - **Device Model**: The model of the machine.
  - **Zscaler Client Connector Version**: The Zscaler Client Connector version installed on the machine.
  - **Status**: The status of the machine tunnel.
- View the details for a machine tunnel. You can view and copy the token for each machine.
- Select machine tunnels for removal from the Zscaler Admin Console.
- Export the machine tunnel details as a CSV file for all items listed in the table, as determined by the filters.
