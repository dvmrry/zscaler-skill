# Configuring Virtual Service Edge Clusters for Internet & SaaS

**Source:** https://help.zscaler.com/zia/configuring-virtual-service-edge-clusters-internet-saas
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398861, revision 3242098

---

You can deploy Virtual Service Edges for Internet & SaaS (ZIA) in a cluster or in standalone mode. Zscaler recommends deploying Virtual Service Edges in clusters to achieve redundancy and update software seamlessly during scheduled update cycles. To learn more about deploying Virtual Service Edges in standalone mode, see Adding Virtual Service Edge Instances.
Zscaler does not recommend using external load balancers (LBs). However, if your organization must use an external LB, see Using an External Load Balancer with Virtual Service Edges.
# Requirements
Ensure that you meet all the following requirements:
- A Virtual Service Edge cluster must contain at least two Virtual Service Edge instances to provide n+1 redundancy for production. It can contain a maximum of 16 Virtual Service Edge instances. You need a subscription license count for each Virtual Service Edge in a cluster. Additionally, ensure that all Virtual Service Edges in a cluster have the Large subscription type.
- Virtual Service Edges require only outbound connections to the Zscaler cloud. Configure your firewall to allow the necessary outbound connections. To view the firewall requirements, go to config.zscaler.com/<Zscaler Cloud Name>/fcr.
- You can find the name of your cloud in the Account Settings menu. For example, if your organization's Zscaler cloud name is zscalertwo.net. In this case, you should go to config.zscaler.com/zscalertwo.net/fcr. To learn more about Zscaler cloud names, see Understanding Zscaler Cloud Names.
- Verify that your licensing is appropriate to your needs. Go to Administration > Subscriptions > Internet & SaaS, and look for the Virtual Service Edges, noting the server count.
- To improve the connections per second for SSL-inspected traffic, Virtual Service Edges support a Cavium NITROX SSL card. A single card cannot be shared across multiple Virtual Service Edges in a single VMware host, meaning that one card is required for each large Virtual Service Edge in a cluster. To learn more about the Cavium NITROX card model, see About Virtual Service Edges.
- Virtual Machine specs for a Virtual Service Edge cluster:
  - Hypervisor: VMware ESX/ESXi v5.0 and later.
    - The Promiscuous Mode option must be enabled (i.e., set to Accept) on the vSphere switch (vSwitch) or at the port group level. Zscaler LBs and Public Service Edges for Internet & SaaS use the Common Address Redundancy Protocol (CARP) to process traffic across multiple Public Service Edge instances. To support this, enabling promiscuous mode on your Virtual Service Edge interfaces is required.
    - The MAC Address Changes option must be enabled on the vSwitch or port group.
    - The Forged Transmits option must be enabled on the vSwitch or port group.
    - Virtual Service Edges often share the vSwitch with other corporate VMs and settings applied on the vSwitch level are applied to all VMs on the vSwitch. Having Promiscuous Mode enabled means other VMs may be able to sniff traffic going through the Virtual Service Edge. To avoid this risk, Zscaler recommends you create and use a port group for your Virtual Service Edge interfaces.
    - If multiple physical ports exist on the same vSwitch, then the Net.ReversePathFwdCheckPromisc advanced option must be enabled (i.e., set to 1) on the ESXi host. To learn more, refer to the VMware documentation.
    - If it is not, then multicast traffic loops back to the host, causing CARP not to function properly, and "link states coalesced" messages to be sent. To learn more, refer to the VMware documentation.
  - CPUs: 4 CPU cores. Each CPU core independently handles a portion of the traffic for the Virtual Service Edge.
  - Minimum Required RAM: 48 GB for standalone and nodes of a cluster, and 8 GB of extra free memory from the VM host whenever the SSL card is to be installed.
  - Scanning large files without adversely impacting performance requires more memory on the Virtual Service Edges. To scan large files and maintain the performance of Virtual Service Edges, you can deploy them with 64 GB RAM (in standalone or cluster mode).
  - If you expand memory to 64 GB, the system automatically inserts a section into the configuration files to enable a third antivirus (AV) process. After the expansion, starting the Virtual Service Edges spawns the third AV process on each instance.
  - Disk: 500 GB (thin provisioned). Zscaler recommends using SSDs.
  - Network Interfaces: 3 interfaces (one for Management, one for the Virtual Service Edge, and one for the LB). These interfaces should be on the same VLAN. This VLAN should be accessible by user traffic and have outbound access to the internet. To learn more about the dual arm configuration of Virtual Service Edges, see Virtual Service Edge Configuration Guide for Dual Arm Mode.
  - The required IP addresses are listed in the following table.
| IP Address | Purpose | Requirements |
|---|---|---|
| Management IP Address | This is used to make an SSH connection to the Virtual Service Edge VM for management. It is also used to download Virtual Service Edge builds from the Zscaler cloud. | Accessible via SSH by the Virtual Service Edge administrator during installation, and requires outbound access to the internet. This is configured in the Virtual Service Edge CLI. |
| Proxy IP Address | This is used for the following:Outbound data connection (proxied traffic)Outbound control connection to the Zscaler cloudHealth monitoring by the LBIn a Virtual Service Edge standalone, it is used to listen for user traffic | It must be in the same subnet as the LB and cluster IP addresses. This is used when creating a Virtual Service Edge instance in the Zscaler Admin Console. |
| LB IP Address | This is used to make an outbound control connection to the Zscaler cloud, as well as to receive initial requests from users. | It must be in the same subnet as the proxy and cluster IP addresses. It is not required for a Virtual Service Edge standalone. |
| Cluster IP Address | In a Virtual Service Edge cluster, it provides fault tolerance and is used to listen for user traffic. This interface does not explicitly get an IP address. | It must be in the same VLAN as the proxy and LB IP addresses. It is not required for a Virtual Service Edge standalone. |
  - Virtual Service Edges support IPv6 traffic if it's only forwarded via IPSec or GRE tunnels. Contact Zscaler Support to enable and configure IPv6 for your organization.
# Configuring a Virtual Service Edge Cluster
If you are configuring a Virtual Service Edge cluster, you must create at least two Virtual Service Edge instances and download their respective SSL certificates. Each Virtual Service Edge VM requires a unique SSL certificate which can be downloaded from the Zscaler Admin Console.
To configure a Virtual Service Edge cluster:
- 1. Add the Virtual Service Edge Instances
- 2. Download the Virtual Service Edge Certificates
- 3. Download the Virtual Service Edge VMs
- 4. Add the Virtual Service Edge Cluster
- 5. Bind the Virtual Service Edge Cluster to a Location
- Add a location and bind the Virtual Service Edge cluster (or standalone Virtual Service Edge) to it, so your organization can enable features such as authentication, firewall, SSL/TLS inspection, and location-level policies. The service associates the traffic that it receives on the Virtual Service Edge with its location and applies the features and policies configured for the location.
- To bind a Virtual Service Edge or a Virtual Service Edge cluster to a location:
  - From the navigation menu, go to Infrastructure > Location Management > Legacy Locations.
  - Click Add Location or click the Edit icon for an existing location.
  - The Add Location or Edit Location window appears.
  - In the Add Location or Edit Location window, do one of the following:
    - Virtual Service Edges: Select the standalone Virtual Service Edge you want to bind to the location.
    - Virtual Service Edge Clusters: Select the Virtual Service Edge cluster you want to bind to the location.
    - See image.
  - To learn more about the other fields, see Configuring Locations.
  - Click Save.
- 6. Create a Firewall Filtering Rule to Bypass Virtual Service Edge IP Addresses
- Zscaler performs ICMP and HTTP monitoring from the LB to the Virtual Service Edge to monitor the health of the Virtual Service Edge and ensure that traffic is distributed appropriately. For health probes to work, you must create a Firewall Filtering rule to allow all Virtual Service Edge proxy, LB, and cluster IP addresses.
- To create a Firewall Filtering rule:
  - From the navigation menu, go to Internet Access > Policy > Firewall Control > Firewall Filtering Policy.
  - Click Add Firewall Filtering Rule.
  - The Add Firewall Filtering Rule window appears.
  - In Add Firewall Filtering Rule window, click the Source IP tab.
  - In IP Addresses, add the following IP address for your Virtual Service Edges:
    - Proxy IP address
    - LB IP address
    - Cluster IP address
    - These are the IP addresses you created while adding the Virtual Service Edge Cluster. To learn more about the other fields, see Configuring Firewall Filtering Policy.
  - Under Network Traffic, select Allow.
  - Click Save and activate the change.
- 7. Configure the Virtual Service Edge VM
- If you are deploying a Virtual Service Edge cluster, you must configure each Virtual Service Edge instance as a VM on the ESX/ESXi server.
- To configure the Virtual Service Edge on the ESX/ESXi server,
  - Log in to the vSphere client.
  - Go to File > Deploy OVF Template.
  - Use the Deploy OVF Template wizard to deploy the Virtual Service Edge VM.
  - Accept all defaults to import the Virtual Service Edge VM.
  - Ensure that you enable Promiscuous Mode, Forged Transmits, and Mac Address Changes on the port group of the Virtual Service Edge.
  - Select the Virtual Service Edge VM and click either the Power On button or Power On the virtual machine.
  - On the Console tab, log in to the FreeBSD command prompt with the following credentials:
    - Username: zsroot
    - Password: zsroot
  - After you log in with the default credentials, you are prompted to change the default password.
  - Change the default password:
    - New Password: Enter a new password that meets your organization's password standards.
    - Retype New Password: Re-enter the new password.
  - See image.
  - Direct root login is not permitted. Administrators must use the sudo utility to run a command with higher privileges.
  - (Optional) If you want Zscaler to enforce password complexity for the password you set, run the following command:
  - vzen enforce-password-complexity
  - The current password expires after running this command.
  - See image.
  - A valid password contains a mix of upper- and lowercase letters, numbers, and other characters. You can use a 24-character password with characters from at least three of these categories, or a 16-character password containing characters from all the categories. Characters that form a common pattern are discarded by the check. If you use a passphrase, use at least 4 words to form a phrase that is 32 to 40 characters long and contains enough different characters.
  - Run the following command to configure the network:
  - sudo vzen configure-network
  - Specify the following information:
    - Address of the DNS server (e.g., 10.84.0.100) used for name resolution of Zscaler cloud domains and also for domain names in the proxy traffic.
    - Management interface IP with CIDR netmask. You use the management IP address (e.g., 10.84.0.110/24) for SSH or FTP.
    - Default gateway IP address (e.g., 10.84.0.200).
    - Hostname of the Virtual Service Edge
  - Install the SSL certificates of the Virtual Service Edge instances in the cluster. These are the certificates that you downloaded from the Zscaler Admin Console. A Virtual Service Edge uses this certificate to authenticate itself to the Zscaler service. When you configure a Virtual Service Edge cluster, ensure that you upload the correct certificate for each Virtual Service Edge instance.
    - Navigate to the SSL certificate that you saved.
    - Use SCP or SFTP to upload it to the management IP address of the Virtual Service Edge.
    - On the vSphere client, click the Console tab, and log in with the following credentials:
    - Username: zsroot
    - Password: zsroot
    - Go to the Console tab or use SSH to connect to the management IP address.
    - Run the following command:
    - sudo vzen install-cert <cert-bundle.zip>
    - Ensure to specify the absolute path to the SSL certificates (e.g., sudo vzen install-cert /tmp/cert-bundle.zip).
  - If you installed the Cavium NITROX card in your server, do the following:
    - On the vSphere client, click the Configuration tab.
    - Click Edit...
    - In the Mark devices for passthrough window, select the Cavium NITROX card.
    - See image.
    - Select the Virtual Service Edge to which the Cavium NITROX card needs to be added. Ensure that the Virtual Service Edge is powered off. Then, click Edit virtual machine settings. In the Virtual Machine Properties window, click Add...
    - See image.
    - Select PCI Device, then click Next.
    - See image.
    - Select the Cavium NITROX card from the drop-down menu, then click Next.
    - See image.
    - Click Finish to add the Cavium NITROX card.
    - See image.
    - Click OK to finish the setup.
    - See image.
    - Run the following command to configure the card:
    - sudo vzen install-nitrox
  - (Optional) if you want to use an SNMP management system to monitor the Virtual Service Edge cluster, enable SNMP for Virtual Service Edge and configure SNMP parameters. Virtual Service Edges support SNMPv3 only.
    - Run the following command:
    - sudo vzen snmp-admin-configure
    - Enter a user name for the SNMPv3 management system that sends queries to the Virtual Service Edge. The Virtual Service Edge accepts queries from this user name only.
    - Enter a password that the Virtual Service Edge uses to authenticate the SNMP management system.
    - Specify which authentication protocol the Virtual Service Edge can use to authenticate the SNMP user. Enter either MD5 or SHA1.
    - Specify the encryption method the Virtual Service Edge can use to authenticate the SNMP user. Enter either DES or AES.
    - Run the following command:
    - sudo vzen snmp-trap-configure
    - When asked which traps you want to configure, enter v3 traps.
    - Enter the IP address of the SNMP trap management system to which the Virtual Service Edge sends traps.
    - Enter a user name for the SNMP management system.
    - Enter a password that the Virtual Service Edge uses to authenticate the SNMP management system.
    - Specify which authentication protocol the Virtual Service Edge can use to authenticate the SNMP user. Enter either MD5 or SHA1.
    - Specify the encryption method the Virtual Service Edge can use to authenticate the SNMP user. Enter either DES or AES.
  - Download the Virtual Service Edge build and start the Virtual Service Edge.
    - On the vSphere client, click the Console tab or use SSH to connect to the management IP address.
    - Run the following command to download the Virtual Service Edge build:
    - sudo vzen download-build
    - The initial build is around 1 GB, so it may take a while depending on your internet connection. The downloaded build is automatically installed. The Virtual Service Edge automatically starts after the installation is complete.
- 8. (Optional) Schedule Virtual Service Edge Cluster Updates
- Zscaler updates Virtual Service Edges regularly to ensure the latest software updates are available. You can schedule the updates to begin at a time no later than 24 hours of the maintenance window for the cloud that the Virtual Service Edge is a part of.
- By design, Virtual Service Edges in a cluster are updated consecutively, so there is no down time.
- However, to provide flexibility in the update times by up to 24 hours, please run the following command on each node of the Virtual Service Edge cluster:
- sudo vzen delay-upgrade HH:MM
- HH:MM is in the UTC 24-hour format.
- For example, the following command runs the update at 13:00 UTC:
- sudo vzen delay-upgrade 13:00
- In a Virtual Service Edge cluster, it is recommended that there is a minimum difference of one hour between the delay-upgrade time configured in the nodes of the cluster. In the preceding example, if node 1 of the cluster has been configured with a delay-upgrade at 13:00, then node 2 of the cluster must be configured with a delay-upgrade of either 12:00 or 14:00. This ensures that there is minimal downtime during the cluster upgrade process.
- If you are using Virtual Service Edges in standalone mode with an external LB instead of clustering, you can minimize downtime by splitting your Virtual Service Edges into two logic groups. Configure the first group of Virtual Service Edges to update at X hours and the second group at X+1 hour. For example, if you configure the first group of Virtual Service Edges at 00:00 hrs, the second group should be at least an hour after (i.e., 1:00 hrs).
- 9. (Optional) Enable Virtual Service Edge Communication with Zscaler cloud on Port 443
- If you want to establish Virtual Service Edge communication with Zscaler cloud on port 443 instead of ports 9422, 9431, and 9442 listed in the Zscaler config page (https://config.zscaler.com/<Zscaler Cloud Name>/zia-v-sedge), enable the standard port.
- You can find the <Zscaler Cloud Name> in the Account Settings menu. For example, if your organization's Zscaler cloud name is zscalertwo.net. In this case, you should go to config.zscaler.com/zscalertwo.net/zia-v-sedge. To learn more about Zscaler cloud names, see Understanding Zscaler Cloud Names.
- To enable a standard port:
  - On the vSphere client, click the Console tab or use SSH to connect to the management IP address.
  - Run the following command on Virtual Service Edge:
  - sudo vzen enable-stdport
  - Enter one of the following subcmd:
    - ca: Enables Virtual Service Edge to authenticate and retrieve policy on port 443.
    - cds: Enables Virtual Service Edge to download the Virtual Service Edge network configuration on port 443.
    - smsm: Enables Virtual Service Edge to transmit logs to Zscaler nanolog for analytics on port 443.
    - all: Enables Virtual Service Edge to authenticate and retrieve policy, download the Virtual Service Edge network configuration, and transmit logs to Zscaler nanolog for analytics on port 443.
  - Restart the Virtual Service Edge using the following command:
  - sudo vzen restart
- Your firewall configuration must be updated to allow outbound connections from the Virtual Service Edge only on port 443 (replacing 9422, 9431 and 9442). The other outbound connection requirements remain the same.
- To disable a standard port:
  - On the vSphere client, click the Console tab or use SSH to connect to the management IP address.
  - Run the following command on Virtual Service Edge:
  - vzen disable-stdport
  - Enter one of the following subcmd:
    - ca: Disables Virtual Service Edge to authenticate and retrieve policy on port 443.
    - cds: Disables Virtual Service Edge to download the Virtual Service Edge network configuration on port 443.
    - smsm: Disables Virtual Service Edge to transmit logs to Zscaler nanolog for analytics on port 443.
    - all: Disables Virtual Service Edge to authenticate and retrieve policy, download the Virtual Service Edge network configuration, and transmit logs to Zscaler nanolog for analytics on port 443.
  - Restart the Virtual Service Edge using the following command:
  - sudo vzen restart
- To verify the connections:
  - On the vSphere client, click the Console tab or use SSH to connect to the management IP address.
  - Run the following command to check Virtual Service Edge or LB connection on port 443:
  - vzen troubleshoot connection
  - If a standard port is enabled, a stable Virtual Service Edge or LB connection exists.
  - See image.
  - Run the following command to check Virtual Service Edge connectivity to the Zscaler cloud service on port 443:
  - cmd :: sockstat | grep smcdsc
  - See image.
# Testing the Configuration
To test the configuration:
- On the vSphere client, click the Console tab or use SSH to connect to the management IP address.
- Run the following command:
- sudo vzen status
- The output should show that the Virtual Service Edge service and LB are running.
- See image.
- Run the following command:
- sudo vzen troubleshoot connection | grep 9422
- The output should show an established connection.
After you configure a Virtual Service Edge cluster, you can then forward your internet traffic to it using one of the mechanisms described in Forwarding Traffic to Virtual Service Edges. To learn more about monitoring the Virtual Service Edge cluster, including how to monitor Virtual Service Edge health, see Monitoring Virtual Service Edge Clusters.
