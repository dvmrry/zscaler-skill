# Configuring an IPSec VPN Tunnel

**Source:** https://help.zscaler.com/zia/configuring-ipsec-vpn-tunnel
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399026, revision 3244843

---

You can configure an IPSec VPN tunnel between the gateway of your corporate network and a Public Service Edge for Internet & SaaS (ZIA). Zscaler recommends configuring two separate VPNs to two different Public Service Edges for high availability. If the primary IPSec VPN tunnel or if an intermediate connection goes down, all traffic is then rerouted through the backup IPSec VPN tunnel to the backup Public Service Edge.
Zscaler IPSec tunnels support a limit of 400 Mbps for each public source IP address. If your organization wants to forward more than 400 Mbps of traffic, Zscaler recommends using one of the following configurations:
- Configure multiple IPSec tunnels with different public source IP addresses.
- Configure multiple IPSec VPN tunnels with the same public source IP address using NAT-T and source port randomization with IKEv2 for all the configured tunnels.
For example, if your organization forwards 800 Mbps of traffic, you can configure two primary VPN tunnels and two backup VPN tunnels.
# Prerequisites
Ensure that you have the following information for each tunnel:
- IP address or hostname of your local gateway
- Shared secret
- IP addresses or hostnames of the Public Service Edges
# Configuring an IPSec VPN Tunnel
To configure an IPSec VPN to a Public Service Edge:
- Review the supported IPSec VPN parameters
- Add VPN credentials in the Zscaler Admin Console
- Link the VPN credentials to a location
- Configure your router or firewall to forward traffic to the Zscaler service. See the following configuration guides:
If you want to forward IPv6 traffic to Internet & SaaS (ZIA), you must configure IPv6 traffic selectors for both IKEv1 and IKEv2 on your device. You must also ensure that IPv6 support is enabled for your organization and locations in the Zscaler Admin Console to forward IPv6 traffic.
- IPSec VPN Configuration Guide for Cisco ASA 55xx
- IPSec VPN Configuration Guide for Cisco 881 ISR
- IPSec VPN Configuration Guide for Juniper SRX
- IPSec VPN Configuration Guide for Juniper SSG 20
- IPSec VPN Configuration Guide for FortiGate Firewall
- IPSec VPN Configuration Guide for Palo Alto Networks Firewall
- IPSec VPN Configuration Guide for SonicWall TZ 350
To learn more, see the Interoperability List.
# Integrating Zscaler with Check Point
To forward traffic from Check Point (GAIA version R80.30 or later), follow the steps recorded in the Check Point documentation.
Check Point doesn't support Layer 7 health checks on third-party vendors.
# Troubleshooting
From the navigation menu, you can go to Data Explorer > Internet & SaaS > Tunnel Insights to see data as well as monitor the health and status of your configured IPSec VPN tunnels. To learn more, see About Insights and About Insights Logs.
