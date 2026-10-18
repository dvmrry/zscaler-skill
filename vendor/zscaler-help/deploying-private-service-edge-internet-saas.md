# Deploying Private Service Edge for Internet & SaaS

**Source:** https://help.zscaler.com/zia/deploying-private-service-edge-internet-saas
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401241, revision 3243664

---

A Private Service Edge for Internet & SaaS (ZIA) is part of the Zscaler cloud. It communicates with other nodes in the cloud, such as the Zscaler Central Authority (CA), for user authentication and policy updates, and the cloud routers and Nanolog clusters for logging and reporting. To learn more, see Understanding Private Service Edge for Internet & SaaS.
To deploy a Private Service Edge:
- Review the following deployment methods and determine the best one for your environment:
  - Deploy inside the DMZ
  - This deployment method requires configuration changes to your firewall to allow Zscaler cloud communications. These changes can impact firewall performance because internet traffic is sent through the firewall to the Private Service Edge in the DMZ, and then through the firewall again to the internet. This might lead to port or session table exhaustion.
  - The following requirements must be met for this deployment method:
    - Configure the firewall to allow the Private Service Edges to communicate with the other nodes in the Zscaler cloud and allow Zscaler Operations to maintain and monitor the Private Service Edges. This deployment also requires ongoing maintenance as the Zscaler cloud expands. To learn more, see Firewall Configuration Requirements: Private Service Edge for Internet & SaaS Deployments.
    - For redundancy, configure a backup tunnel to Private Service Edges at another data center or to a Public Service Edges for Internet & SaaS.
    - Assign multiple public IP addresses per Private Service Edge. To learn more, see Network and IP Address Requirements.
  - Deploy outside the Corporate Firewall
  - Zscaler highly recommends that you send your HTTP/HTTPS traffic through a GRE or IPSec tunnel from your firewall to the Private Service Edges. The primary incentive is to group all outbound internet traffic inside a tunnel to remediate and avoid potential port or session table exhaustion on the firewall. This arrangement does not require configuration changes to your firewall to accommodate the communication requirements of the Private Service Edge.
  - If you use PAC files to forward your traffic to the Private Service Edges, see Using PAC Files: Private Service Edge for Internet & SaaS Deployments.
  - The following requirements must be met for this deployment method:
    - Configure GRE or IPSec VPN tunnels to the Private Service Edges.
      - Send only HTTP/HTTPS traffic to the Private Service Edges. Send all other traffic directly to the internet.
      - Send un-NATed traffic through the tunnels for visibility into user traffic.
    - To learn more, see Understanding Generic Routing Encapsulation (GRE) and Understanding IPSec VPNs.
    - For redundancy, configure backup tunnels to Private Service Edges at another data center or to a Public Service Edges.
    - Assign multiple public IP addresses per Private Service Edge. To learn more, see Network and IP Address Requirements.
  - Deploy behind the Network Firewall
  - You might decide to install the Private Service Edges behind the corporate firewall. This deployment option also requires configuration changes to the firewall.
  - The following requirements must be met for this deployment method:
    - Configure the firewall to allow the Private Service Edges to communicate with the other nodes in the Zscaler cloud and allow Zscaler Operations to maintain and monitor the Private Service Edges. This deployment also requires ongoing maintenance as the Zscaler cloud expands. To learn more, see Firewall Configuration Requirements: Private Service Edge for Internet & SaaS Deployments.
    - For redundancy, configure a backup tunnel to Private Service Edges at another data center or to a Public Service Edge.
    - Assign multiple public IP addresses and multiple RFC 1918 IP addresses per Private Service Edge, along with 1:1 static NAT on your organization's NAT devices. To learn more, see Network and IP Address Requirements.
- For all design review questions and architecture considerations, contact your Zscaler Sales representative, who assists in choosing the appropriate Private Service Edge deployment option depending on your environment and requirements.
- Ensure that you provide Zscaler with the necessary network and IP address requirements.
- After you receive the Private Service Edges from Zscaler, install them.
- Configure the network as follows:
  - If the Private Service Edges are deployed in the DMZ of your organization, inside your internal network or behind any network device that might filter or otherwise interfere with communication to and from the Zscaler service, configure all relevant network devices to allow the necessary traffic per the firewall rules posted on config.zscaler.com/<zscaler cloud name>/fcr.
  - For Direct Server Return (DSR) load balancing to function correctly, enable Gratuitous ARP (GARP) on the network switches directly connected to the Private Service Edges.
  - Set the switch ports connecting to the Private Service Edges or load balancers (LBs) to Access mode so that traffic between the Private Service Edges and LB NIC ports is not VLAN tagged. The Private Service Edges and LBs do not support VLAN tagging.
  - Disable Link Level Discovery Protocol (LLDP) on the network switch ports connected to the Private Service Edges.
  - Most switches offer a Layer 2 flow control option or feature. Disable this feature on all switch ports serving the Internet & SaaS Private Infrastructure VLANs. Internet & SaaS has its own Layer 4 flow control feature embedded in the TCP stack.
- Contact your network equipment provider for best practices and network configuration if required.
- Zscaler Operations provisions the Private Service Edges and inform your organization after the Private Service Edges are operational. Zscaler Operations are responsible for the ongoing maintenance of the Private Service Edges. To learn more, see Hardware Usage Terms.
- Test the deployment:
  - If authentication is enabled for your location, browse to an external site and verify that the Zscaler service requests your credentials before it allows access to the internet.
  - Ensure that your policies are enforced. Verify that the service blocks access to a site due to policy.
  - View and check the logs using the dashboard in the Zscaler Admin Console.
  - If you have a Digital Experience (ZDX) subscription, check whether you can see your ZIA Private Service Edges' health information on the ZIA PSE Health Dashboard page.
- (Optional) If your organization uses PAC files to forward traffic to the Zscaler service, edit the PAC files and ensure that the variables that point to the Private Service Edges specify the subcloud that Zscaler configured for your organization. To learn more, see Using PAC Files: Private Service Edge for Internet & SaaS Deployments. Also, if applicable, ensure that your firewall allows the devices from your internal network to reach the Zscaler PAC servers.
- (Optional) If your organization uses GRE tunnels to forward traffic to the Zscaler service, follow the standard procedure for Self-Provisioning of GRE Tunnels. Private Service Edge VIP addresses are available for selection on the GRE Tunnels page in the Zscaler Admin Console.
- Self-provisioning of GRE tunnels towards Private Service Edge clusters is only supported for clusters deployed on public IP space (i.e., a non-NAT environment). If you need to build a GRE tunnel toward a Private Service Edge cluster deployed within a NAT environment, submit a support ticket from your Zscaler Admin Console.
