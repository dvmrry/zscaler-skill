# Understanding Global Public Service Edges for Internet & SaaS

**Source:** https://help.zscaler.com/zia/about-global-public-service-edges
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400866, revision 3239406

---

Zscaler has configured several Global, or Ghost, Public Service Edges for Internet & SaaS (ZIA) across its clouds. The addresses of these Public Service Edges do not listen for traffic but are dummy addresses that all Public Service Edges know about. They can be useful when working in no default route environments. To learn more, see Implementing Zscaler in No Default Route Environments.
You can use the following as Global Public Service Edge IP addresses:
- 185.46.212.88
- 185.46.212.89
- 185.46.212.90
- 185.46.212.91
- 185.46.212.92
- 185.46.212.93
- 185.46.212.97
- 185.46.212.98
# No Default Route Example
In order to send packets to a Global Public Service Edge (185.46.212.88), a user's traffic with PAC configured first resolves their PAC server address to http://pac.<Zscaler Cloud Name>.net/<your organization's domain>/No-Default-Route. Because the user is coming from a Public Service Edge IP via a tunnel, the PAC server returns the Zscaler Global IP.
You can find the <Zscaler Cloud Name> in the Account Settings menu. To learn more about Zscaler cloud names, see Understanding Zscaler Cloud Names. ​​​​​​
Use PAC files to direct the corporate user traffic to the Global Public Service Edge IP address.
Ensure that you route the traffic destined to the Global Public Service Edge IP address through a GRE or an IPSec tunnel.
If the user is outside the corporate network and is coming from a non-Zscaler Public Service Edge IP and non-customer public IP, then the PAC file uses the "${GATEWAY_FX}" variable instead.
In the above solution, each of the customer location configurations remains the same, providing a simple method of deploying configuration without differences between locations. This minimizes configuration and deployment complexity. In addition, a single PAC can accommodate both internal and external scenarios.
You can also detect whether the user is present on premises (by resolving an internal domain) and then return the Global Public Service Edge IP. A sample PAC file is given below:
var egressip = "${SRCIP}"; /*Assuming HQ source IP is 172.16.1.1*/ if (shExpMatch(egressip,"172.16.1.1")) { /* User is in the HQ*/ return "PROXY 185.46.212.88:80; PROXY ${COUNTRY_GATEWAY_FX}:80; PROXY ${COUNTRY_SECONDARY_GATEWAY_FX}:80 "; } return "PROXY ${COUNTRY_GATEWAY_FX}:80; PROXY ${COUNTRY_SECONDARY_GATEWAY_FX}:80";
