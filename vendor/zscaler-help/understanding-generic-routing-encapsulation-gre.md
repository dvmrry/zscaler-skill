# Understanding Generic Routing Encapsulation (GRE)

**Source:** https://help.zscaler.com/zia/understanding-generic-routing-encapsulation-gre
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399106, revision 3207696

---

# GRE Tunnel Overview
A Generic Routing Encapsulation (GRE) tunnel is ideal for forwarding internet-bound traffic from your corporate network to the Zscaler service. GRE is a tunneling protocol for encapsulating packets inside a transport protocol. A GRE-capable router encapsulates a payload packet inside a GRE packet. It further encapsulates the GRE packet in a transport protocol, such as IP, as shown in the following diagram.
A GRE tunnel functions like a VPN but without encryption; it transports packets from one endpoint to another through the public network.
GRE tunnels typically use keepalive packets to determine if a tunnel is up. The GRE tunnel source creates the keepalive request and response packets that are encapsulated and sent together to the tunnel destination. When the tunnel destination receives an encapsulated packet, it just decapsulates the original packet and sends the inner response packet back to the originating peer. To learn more, refer to RFC 2784 Generic Routing Encapsulation (GRE).
# Benefits of Using GRE Tunnel
If your corporate router supports GRE and its egress port has a static IP address, Zscaler recommends that you configure a GRE tunnel to forward internet traffic from your corporate network to the Zscaler service. It provides the following benefits:
- Supports internet traffic
- Supports failover if the primary Public Service Edge for Internet & SaaS (ZIA) becomes unavailable
- Requires minimal overhead
- Requires no configuration on computers or laptops
- Does not allow the users on your corporate network to bypass the service
- Provides internal IP address information to Zscaler which can be used for enforcing policies and source IP logging
# Best Practices for Traffic Forwarding Using GRE Tunnels
Zscaler recommends the following traffic forwarding rules for organizations that use the Zscaler service:
- Use a combination of GRE tunneling, PAC files, Surrogate IP, and Zscaler Client Connector to forward traffic to the Zscaler service.
- Configure two GRE tunnels from an internal router behind the firewall to provide visibility into internal IP addresses, which can be used for enforcing security policies and source-IP logging. To learn more, see GRE Deployment Scenarios.
- Deploy mechanisms such as IP SLA to monitor tunnel health and enable fast failover for your organization.
- Install a PAC file for each user to ensure coverage outside the corporate network.
To learn more about traffic forwarding and best practices, see Best Practices for Traffic Forwarding.
# Supported Bandwidth for GRE Tunnels
Zscaler supports a maximum bandwidth of 1 Gbps for each GRE tunnel if the internal tunnel endpoint IP addresses are not source network address translated (NATed). If the internal tunnel endpoint IP addresses are source NATed, then Zscaler can only support up to 250 Mbps of traffic for each tunnel. This is because the Zscaler service uses the internal IP addresses of the GRE tunnel to load-balance GRE traffic over multiple servers. If the internal source IP address is the same for all traffic across multiple GRE tunnels, then the load-balancer cannot be effective in balancing the traffic across different nodes, resulting in lesser throughput for each tunnel.
If your organization wants to forward more than 1 Gbps of traffic, Zscaler recommends configuring more GRE tunnels with different public source IP addresses. For example, if your organization forwards 2 Gbps of traffic, you can configure two primary GRE tunnels and two backup GRE tunnels. If your organization forwards 3 Gbps of traffic, you can configure three primary GRE tunnels and three backup GRE tunnels. To learn more, see Configuring GRE Tunnels.
Zscaler set the bandwidth limit to 1 Gbps because a significant part of the internet infrastructure uses network links that are 1 Gbps. Multilink technologies such as Link Aggregation Control Protocol (LACP) still rely on aggregating multiple 1 Gbps interfaces, so having more than 1 Gbps of traffic from a single source IP address results in a bottleneck.
GRE tunnels configured on Virtual Service Edges are dynamically established with no internal IP addresses, similar to unnumbered GRE tunnels. To learn more, see About Virtual Service Edges for Internet & SaaS and Forwarding Traffic to Virtual Service Edges for Internet & SaaS.
