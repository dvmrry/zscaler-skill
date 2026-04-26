# About Forwarding Profiles

**Source:** https://help.zscaler.com/zscaler-client-connector/about-forwarding-profiles
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Forwarding Traffic Management 
About Forwarding Profiles
Client Connector
About Forwarding Profiles
Ask Zscaler

Watch a video about forwarding profiles.

The forwarding profile tells Zscaler Client Connector how to treat traffic from your users' systems in different network environments for the Internet & SaaS and Private Access services.

Zscaler Client Connector Forwarding Profiles provide the following benefits and allow you to:

Control how traffic flows from user devices in various network environments.
Configure different forwarding profiles with different network settings within multiple locations.
Save time locating a profile using the Search feature.
Easily manage existing profiles using view, edit, copy, and delete features.

Zscaler Client Connector recognizes the following network environments:

On-Trusted Network: When a user is connected to a private network that belongs to your organization. To allow the app to detect this network, you must set the Trusted Network Criteria.

VPN-Trusted Network: When a user is connected to a trusted network through a VPN in full-tunnel mode. The VPN must be configured to capture all, and not just some, of the user's traffic to the trusted network by installing a default route in the routing table of the client device.

The app does not consider the network a VPN-Trusted network and treats the user as connected to an Off-Trusted Network in the following scenarios:

The VPN doesn't install a default route and uses some other mechanism to capture all of the user's traffic.

The default interface description does not contain the words Cisco, Juniper, Fortinet, PanGP, or VPN.

macOS does not check the interface description for keywords. Instead, it only checks if the VPN created an utun, PPP, or GPD interface.

The VPN runs in split-tunnel mode, so that the app takes only some of the user traffic. The VPN can do this by only installing routes for some subnets (e.g., 10/8 or 192.168/16) or by installing a DNS on the device to resolve specific requests.
Off-Trusted Network: When a user is connected to an untrusted network.
Split VPN-Trusted Network: When a user is connected to a trusted network in split-tunnel mode through a VPN. The app does not consider the network a Split VPN-Trusted Network if:
The VPN runs as a default adapter.
The VPN interface description does not contain the words Cisco, Juniper, Fortinet, PanGP, or VPN. If these words are missing, the app treats the user as connected to an Off-Trusted Network.
The defined Trusted Network Criteria evaluated against the VPN adapter does not match.

When a user connects to a network, the app checks to determine what type of network the user is connected to and displays the network type on the Internet Security window and the Private Access window. You can configure as many forwarding profiles as you need, and then select the appropriate one when configuring your app profiles. For example, if you have multiple locations with different network information, you can configure different forwarding profiles so that the app can recognize the correct network for different users and know how to respond upon detecting those networks.

If your users are running the app in conjunction with a VPN client, see Best Practices for Zscaler Client Connector and VPN Client Interoperability for important additional steps.

About the Forwarding Profile Page

On the Forwarding Profile page (go to Infrastructure > Connectors > Client > Forwarding Profile for Platforms), you can do the following:

Add a forwarding profile.
Search for a forwarding profile.
View a list of all configured forwarding profiles.
Edit a forwarding profile.
Copy an existing forwarding profile that you can customize to create a new profile.
Delete a forwarding profile.
View the default forwarding profile.
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
