# About Virtual Service Edges for Internet & SaaS

**Source:** https://help.zscaler.com/zia/about-virtual-service-edges-internet-saas
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401226, revision 3241894

---

Watch a video about Virtual Service Edges for Internet & SaaS (ZIA) (shows legacy UI).
New or clean deployment of Virtual Service Edge requires a virtual machine (VM) image running on Zscaler OS version 24 or later.
Zscaler typically recommends that organizations forward traffic to the Public Service Edges for Internet & SaaS in the Zscaler cloud. However, some organizations might require different traffic flow because of factors such as:
- Locations with certain geopolitical requirements and regulations.
- Locations that experience high latency when connecting to a Public Service Edge.
- Applications that require an organization's IP address as the source IP address.
- Users who need to see localized content.
If your organization has similar requirements, then with Zscaler's approval, you can extend the Zscaler patented cloud architecture to your organization's premises by licensing and deploying Virtual Service Edges. Virtual Service Edges use a VM to function as a full-featured Public Service Edge dedicated to your organization's traffic. Virtual Service Edges perform the same service as the Public Service Edges in the Zscaler cloud, including support for features, such as Firewall, Sandbox, and Data Loss Prevention (DLP).
The Source IP Anchoring feature is not supported with Virtual Service Edges.
Virtual Service Edges provide the following benefits and allow you to:
- Retain your organization's Source IP address when accessing SaaS or internet applications that require it.
- Let users access certain geolocal content.
- Use a fully managed, on-premises Service Edge with automated, non-intrusive, and periodic software upgrades and security updates.
Virtual Service Edges are part of the Zscaler cloud. They communicate with the Zscaler cloud for user authentication, policy updates, logging, and reporting. Admins define policies only once through the Zscaler Admin Console. Additionally, after users are signed in and authenticated to the Zscaler service, the service always applies their policies, whether they connect to an on-premises Virtual Service Edge or to a Public Service Edge anywhere in the world. Logs are transmitted to and stored on the Zscaler cloud as a central repository for integrated analytics, so you can view and monitor internet traffic activity on the dashboard and make full use of the real-time logging and interactive reporting capabilities of the service. Your organization has full access to the Virtual Service Edges for monitoring and configuration. Zscaler does not require access to the Virtual Service Edges.
Virtual Service Edges are supported on VMware ESX/ESXi, Microsoft Azure, Amazon Web Services (AWS) EC2, Microsoft Hyper-V, and Google Cloud Platform (GCP).
Ensure that your firewall allows the outbound connections listed on the Virtual Service Edge config page (i.e., config.zscaler.com/<Zscaler Cloud Name>/zia-v-sedge) and access to and from the IP addresses on the Zscaler Hub IP Addresses page (i.e., config.zscaler.com/<Zscaler Cloud Name>/hubs).
You can find the name of your cloud in the Account Settings menu. For example, if your organization's Zscaler cloud name is zscalertwo.net. In this case, you should go to config.zscaler.com/zscalertwo.net/zia-v-sedge. To learn more about Zscaler cloud names, see Understanding Zscaler Cloud Names.
# Specifications and Sizing
Virtual Service Edges are available in a single-sized VM that supports up to 600 Mbps of total throughput. An SSL acceleration card (sold separately) is recommended for deployments requiring a throughput of 100 Mbps or more in order to perform SSL inspection on Virtual Service Edges. Alternately, you can horizontally scale (deploy more) Virtual Service Edges for processing throughput in excess of 100 Mbps.
Following are the Virtual Service Edge specifications and sizing:
| Virtual Service Edge |  |  |  |  |  |
|---|---|---|---|---|---|
| Hypervisor Support | VMware ESXi 6.0 and later | Microsoft Azure | AWS EC2 | Microsoft Hyper-V | GCP |
| Number of Public Service Edge Instances per VM | 1 | 1 | 1 | 1 | 1 |
| Number of Load Balancers per VM | 1 | 1 | 1 | 1 | - |
| Maximum VMs per Cluster | 16 | - | - | 16 | - |
| vMotion Support | VMware ESXi 7.0 and above | - | - | - | - |
| Hypervisor Resource Requirements |  |  |  |  |  |
| Number of V-CPUs | 4 | 4 | 4 | 4 | 4 |
| Minimum Required Memory Allocation for Standalone Deployments | 48 GB | 48 GB | 48 GB | 48 GB | 48 GB |
| Minimum Required Memory Allocation for Cluster Deployments | 48 GB | - | - | 48 GB | - |
| Virtual Interfaces | 3 | 3 | 3 | 3 | 3 |
| SSL Acceleration Card per VM | 1 x Marvell NITROX CNN3510-500-C5-NHB-2.0-G | - | - | - | - |
| Disk Space | 500 GB | 500 GB | 500 GB | 500 GB | 500 GB |
| Throughput & SSL Specifications |  |  |  |  |  |
| Total Throughput | 600 Mbps | - | - | - | - |
| SSL CPS with Acceleration Card | 3500 CPS | - | - | - | - |
| SSL CPS without Acceleration Card | 400 CPS | 400 CPS | 400 CPS | 400 CPS | 400 CPS |
Zscaler recommends Virtual Service Edge clusters with at least two Virtual Service Edge instances to provide n+1 redundancy for production. In the VMware ESXi and Microsoft Hyper-V environments, Zscaler recommends utilizing the in-built load balancer for Virtual Service Edges deployed in cluster mode. In certain situations, the Virtual Service Edges with an External Load Balancer are deployed. In public cloud environments such as Microsoft Azure, AWS EC2, Microsoft Hyper-V, and GCP, the native cluster mode of deployment is not supported, and you can use public cloud load balancers to ensure redundancy between the Virtual Service Edges.
# Maintenance
The Zscaler service automatically upgrades Virtual Service Edges during scheduled maintenance windows. The dates of these maintenance windows are published in the Zscaler Trust Portal. This does not require intervention from an admin or Zscaler Cloud Operations. In addition, the Virtual Service Edges aren't monitored or managed by the Zscaler Cloud Operations team.
# Hardening
The Virtual Service Edge virtual appliance is locked down by allowing only a limited number of commands to be run on the appliance. This setup is commonly referred to as a "jailed environment." The operating system itself is hardened and all unnecessary packages and libraries are removed to minimize the attack surface.
Zscaler also hardens the TCP stack used for proxying and keeps up with any Common Vulnerabilities and Exposures (CVEs) that are disclosed. CVEs are patched immediately if they can potentially cause harm to the system. Updates and patches are also automatically downloaded and applied, so no manual updating or patching is required.
Access to the Virtual Service Edge virtual appliance is limited to the VMware console and Microsoft Azure web console view, and Hyper-V Manager console, as well as the management interface for SSH access. Access to the Virtual Service Edge can be locked down by setting up proper access control to the console and the management interface. Consider using methods such as access control lists, authentication, and authorization to achieve this.
Authentication attempts as well as an audit log of the commands run on the appliance, are accessible and stored in /var/log/auth.log. You can monitor this file remotely or check it periodically to detect unauthorized commands or authentication attempts.
# About the Virtual Service Edges Page
On the Virtual Service Edges page (Infrastructure > Internet & SaaS > Virtual Service Edges), you can do the following:
- Add a Virtual Service Edge instance.
- Download a VM image:
  - Download a Virtual Service Edge VM.
  - Download the SNMP MIB files.
  - Download the Hyper-V VM.
  - Download the Nutanix VM.
- Search for a Virtual Service Edge.
- View a list of all Virtual Service Edges that were configured for your organization. For each Virtual Service Edge, you can see the following:
  - Name: The name of the Virtual Service Edge. You can sort this column.
  - Status: Displays whether the Virtual Service Edge is enabled or disabled. You can sort this column.
  - Type: The Virtual Service Edge subscription type.
  - Deployment Status: The Virtual Service Edge deployment status (In Production or Trial).
  - Deployment Mode: The Virtual Service Edge deployment mode (Cluster or Standalone). You can sort this column.
  - Load Balancer IP Address: The load balancer IP address for Virtual Service Edges in Cluster deployment mode. You can sort this column.
  - Proxy IP Address: The proxy IP address for the Virtual Service Edge. You can sort this column.
  - Cluster Name: The Virtual Service Edge cluster name. You can sort this column.
  - IPSec Local Termination: The status of IPSec local termination for the Virtual Service Edge.
- Modify the table and its columns.
- Download the Virtual Service Edge SSL certificate.
- Open the New Client Certificate window. You can upload provisioning blob data.
- Edit or view a Virtual Service Edge configuration.
- View the Virtual Service Edge Clusters page.
