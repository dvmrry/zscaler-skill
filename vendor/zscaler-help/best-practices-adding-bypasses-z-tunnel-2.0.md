# Best Practices for Adding Bypasses for Z-Tunnel 2.0

**Source:** https://help.zscaler.com/zscaler-client-connector/best-practices-adding-bypasses-z-tunnel-2.0
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1349806, revision 3212430

---

This article covers best practices to configure IP-based bypasses and domain-based bypasses for Zscaler Tunnel (Z-Tunnel) 2.0.
# IP-Based Bypasses
For Z-Tunnel 1.0, you can add network bypasses to the app profile PAC file. But if you are using Z-Tunnel 2.0, do not add network bypasses to the Zscaler Client Connector profile policy’s PAC file. For Z-Tunnel 2.0, you must add the network bypasses as VPN gateway bypasses or destination exclusions.
The following are the best practices for IP-based bypasses:
- VPN Gateway Bypasses
- VPN Gateway bypasses allow you to create routes and filters for direct traffic. You can use IPs, subnets, or FQDNs. This type of bypass has the highest priority over all other bypass types. These bypasses can also affect IP-based applications by directly sending traffic. When you create a VPN gateway bypass, the system sets a filter to ignore VPN traffic without Zscaler Client Connector needing to process the bypass.
- Add network bypasses to the Hostname or IP Address Bypass for VPN Gateway field in the Zscaler Client Connector app profile.
- If you use a hostname in the VPN Gateway Bypasses, Zscaler Client Connector resolves the hostname to an IP address before adding it to the bypass. For every hostname entered, a DNS resolution is performed by the client.
- Destination Exclusions and Inclusions
- You can add specific subnets to the Destination Exclusions and Destination Inclusion fields in the Zscaler Client Connector app profile, allowing you to send a specific subset of your traffic to the Public Service Edge for Internet & SaaS through Z-Tunnel 2.0.
- The subnet 0.0.0.0/0 stands for all possible subnets. Zscaler recommends that you use one of the following configurations:
  - Include specific subnets only by adding 0.0.0.0/0 to Destination Exclusions and entering specific subnets to the Destination Inclusions.
  - Exclude specific subnets only by adding 0.0.0.0/0 to Destination Inclusions and entering specific subnets to the Destination Exclusions.
- To learn more about adding specific subnets, see Configuring Zscaler Client Connector App Profiles.
- If there are conflicts between the exclusion and inclusions rules:
  - Z-Tunnel 2.0 chooses the rule with the more specific netmask. For example, 10.0.0.0/24 is chosen over 10.0.0.0/16.
  - If the subnet mask is the same, Z-Tunnel 2.0 chooses the rule with the highest number of fields (therefore more specific), after taking all ports, port ranges, and protocols into account. For example:
    - 10.0.0.0/8:443 is chosen over 10.0.0.0/8
    - 10.0.0.0/8:443:tcp is chosen over 10.0.0.0/8:443
  - If the exclusions and inclusions rules are identical, Z-Tunnel 2.0 chooses the inclusions.
- Port-Based Bypasses
- Configuring port-based bypasses is only possible for Windows and macOS.
- To add a port-based bypass, add the port to the network bypass in the Destination Exclusions field in the Zscaler Client Connector app profile. You must add the port to the end of the network bypass.
- For example, to bypass port 80 for the subnet 192.168.1/24, add 80 to the end of the subnet. The port-based bypass is 192.168.1/24:80.
- You can also bypass a range of ports by adding the port range to the end of the network bypass. In this example, the subnet is 192.168.1/24 and the port range is from 80 to 85. The port-based bypass is 192.168.1/24:80-85.
# Domain-Based Bypasses
You can configure domain-based bypasses with custom PAC files for the forwarding profile and the app profile. For Zscaler Client Connector version 3.8 and later for Windows, you can enable Forwarding Profile options that don’t require configuring a system proxy PAC in the forwarding profile. This allows you to create bypasses for domain-based applications (i.e., applications that can’t be resolved to a single IP address).
This bypass requires Z-Tunnel 1.0 listener, which can only bypass the web traffic (i.e., HTTP/HTTPS traffic) originating from the system proxy. You must route system proxy traffic to the listener and then bypass the domains in the app profile PAC.
To configure domain-based bypasses:
- For Zscaler Client Connector Version 3.7 and Earlier for Windows
  - 1. Configure the Forwarding Profile PAC File.
  - Configure the forwarding profile PAC file to include the Z-Tunnel 2.0 bypass return statement for any destinations you want to send directly.
  - In Tunnel mode, you must only use the forwarding profile PAC file to bypass traffic away from Zscaler Client Connector or to tunnel traffic to Zscaler Client Connector. Do not use it to tunnel traffic to the Zscaler cloud.
  - function FindProxyForURL(url, host) { /* Updates are directly accessible */ if (dnsDomainIs(host, "<domain>")) return "PROXY ${ZAPP_TUNNEL2_BYPASS}"; /* Default Traffic Forwarding. Return DIRECT to tunnel using Tunnel2 */ return "DIRECT"; }
  - For <domain>, enter the domain URL or wildcard you want to bypass for Z-Tunnel 2.0. Use one of the following examples to use wildcards:
    - In this example, a leading period (.) is treated as a wildcard in this function: (dnsDomainIs(host, ".domain.com"))
    - In this example, a leading asterisk (*) is treated as a wildcard in the function: (shExpMatch(host,"*.domain.com"))
  - 2. Configure the App Profile PAC File.
  - Configure the app profile PAC file to include a return direct statement for the domain:
  - function FindProxyForURL(url, host) { var privateIP = /^(0|10|127|192\.168|172\.1[6789]|172\.2[0-9]|172\.3[01]|169\.254|192\.88\.99)\.[0-9.]+$/; var resolved_ip = dnsResolve(host); /* Updates are directly accessible */ if (dnsDomainIs(host, "<domain>")) return "DIRECT"; /* Default Traffic Forwarding */ return "PROXY ${GATEWAY}:443"; }
  - For <domain>, enter the same domain URL or wildcard you configured in the forwarding profile PAC.
- For Zscaler Client Connector Version 3.8 and Later for Windows
- Configure the app profile PAC file and select from the following Forwarding Profile options:
  - Select Redirect Web Traffic to Zscaler Client Connector Listening Proxy to split traffic so that the TCP port 80 and TCP port 443 traffic go to the Zscaler Client Connector Listening Proxy, with the remaining traffic passing through Z-Tunnel 2.0. By using this option, bypasses in the app profile PAC can be applied to web traffic without a forwarding profile PAC.
  - Z-Tunnel 2.0 inclusions and exclusions and VPN hostname bypasses are applied before sending traffic to the listening proxy. Hence, only the TCP 80/443 traffic covered by the Z-Tunnel 2.0 inclusions is sent to the listening proxy when this option is enabled.
  - Select Use Z-Tunnel 2.0 for Proxied Web Traffic to have Zscaler Client Connector use the Z-Tunnel 2.0 protocol to tunnel web traffic received on the Zscaler Client Connector listening proxy.
  - Use Z-Tunnel 2.0 for Proxied Web Traffic is applied to connections arriving on the Zscaler Client Connector listening proxy only if they match the default return statement in the app profile PAC. If the request matches a particular statement in the app profile PAC that redirects traffic to a specific Public Service Edge for Internet & SaaS, then this option is ignored and traffic is sent using Z-Tunnel 1.0.
  - If this option is disabled and Redirect Web Traffic to Zscaler Client Connector Listening Proxy is enabled, Zscaler Client Connector uses Z-Tunnel 1.0 for web traffic and Z-Tunnel 2.0 for the remaining system traffic.
# Possible Configurations and Results
- The following table describes how traffic is handled depending on how you enable these options in the Forwarding Profile:
| Redirect Web Traffic to Zscaler Client Connector Listening Proxy option | Use Z-Tunnel 2.0 for Proxied Web Traffic option | Web Traffic | Non-Web Traffic |
|---|---|---|---|
| Enabled | Disabled | Forward to the listening proxy through Z-Tunnel 1.0 | Send directly to Z-Tunnel 2.0 |
| Disabled | Enabled | If using a system proxy (like 127.0.0.1:9000), forward to the Zscaler listening proxy and then send to Z-Tunnel 2.0.If not using a system proxy, send directly to Z-Tunnel 2.0. | Send directly to Z-Tunnel 2.0 |
| Enabled | Enabled | Forward to the listening proxy through Z-Tunnel 2.0. | Send directly to Z-Tunnel 2.0 |
