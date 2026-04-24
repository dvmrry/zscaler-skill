# About Z-Tunnel 1.0 & Z-Tunnel 2.0

**Source:** https://help.zscaler.com/zscaler-client-connector/about-z-tunnel-1.0-z-tunnel-2.0
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Zscaler Client Connector Help 
Forwarding Traffic Management 
About Z-Tunnel 1.0 & Z-Tunnel 2.0
Client Connector
About Z-Tunnel 1.0 & Z-Tunnel 2.0
Ask Zscaler

Watch a video about Z-Tunnel 1.0 & 2.0.

Z-Tunnel 1.0

Z-Tunnel 1.0 forwards traffic to the Zscaler cloud via CONNECT requests, much like a traditional proxy. Z-Tunnel 1.0 sends all proxy-aware traffic or port 80/443 traffic to the Zscaler service, depending on the forwarding profile configuration.

To use Z-Tunnel 1.0, select Z-Tunnel 1.0 when configuring a forwarding profile with Tunnel mode and the packet filter driver is enabled.

You can migrate from Z-Tunnel 1.0 to Z-Tunnel 2.0. To learn more, see Migrating from Z-Tunnel 1.0 to Z-Tunnel 2.0.

Z-Tunnel 2.0

For Z-Tunnel 2.0, use a NAT device that uses a single IP for all connections from a single device. Otherwise, you’ll encounter load-balancing issues where control and data connections land on different Service Edges, and Z-Tunnel 2.0 fails to establish and falls back to Z-Tunnel 1.0.

Z-Tunnel 2.0 has a tunneling architecture that uses DTLS or TLS to send packets to the Zscaler service. Because of this, Z-Tunnel 2.0 is capable of sending all ports and protocols.

To use Z-Tunnel 2.0:

Deploy Zscaler Client Connector for your supported version.
Select Z-Tunnel 2.0 when configuring a forwarding profile with Tunnel mode and the packet filter driver is enabled.
Configure bypasses for Z-Tunnel 2.0 in App Profiles. To learn more, see Best Practices for Adding Bypasses for Z-Tunnel 2.0.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Forwarding Profiles
Configuring Forwarding Profiles for Zscaler Client Connector
Searching for a Forwarding Profile
About Trusted Networks
Configuring Trusted Networks for Zscaler Client Connector
Searching for a Trusted Network
About Z-Tunnel 1.0 & Z-Tunnel 2.0
Best Practices for Deploying Z-Tunnel 2.0
Migrating from Z-Tunnel 1.0 to Z-Tunnel 2.0
Configuring Dedicated Proxy Ports
Copying a Forwarding Profile
