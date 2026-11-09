# VPN (for Legacy Apps) prerequisites and configuration order (zpa.vpn.setup)
Also called: vpn for legacy apps step by step; vpn configuration order; vpn client ip pool prerequisite; udp 51820 to 53000

Before the feature can be enabled, a private IP address range is needed for the VPN client's IP address pool, and the range must not overlap with existing subnets. [zpa.vpn.setup:prereq-client-pool] The servers need a route to the VPN Service Edge's client IP address pools using a Network Connector's IP address as the next hop, and the Network Connector needs a route to the Network segments (the servers) that are accessed via VPN. [zpa.vpn.setup:prereq-routes] Each Network Connector needs an outbound firewall rule to the internet. If its traffic to the internet needs to be restricted, an outbound connection to the VPN Service Edge's IP address on the UDP port range from 51820 to 53000 must be allowed, because it is required to establish a VPN tunnel between the Network Connector and the VPN Service Edge. [zpa.vpn.setup:prereq-firewall]

**Order.** The configuration guide's steps are, in order: Step 1 configuring user enablement, Step 2 (optional) adding an external router, Step 3 configuring a VPN Service Edge, Step 4 adding a Network Connector, Step 5 deploying the Network Connector, Step 6 verifying the Network Connector is added, Step 7 adding Network segments, Step 8 adding access policies, Step 9 configuring the Client Connector app profile bypass for the VPN Service Edge, and Step 10 verifying connected users. [zpa.vpn.setup:config-order] The order with a BGP router is in [VPN redundancy: failure scenarios, BGP group settings, platform settings, replacing and migrating Network Connectors](kb:zpa.vpn.redundancy).

**Steps.** To configure a user enablement rule, the users must first be defined: the SAML or SCIM attributes for users of VPN (for Legacy Apps), and optionally a posture profile validation. [zpa.vpn.setup:users-first] The user enablement rule is in [VPN user enablement rules: who may open a VPN tunnel](kb:zpa.vpn.user-enablement). In the Client Connector app profile bypass step, the IP address of a VPN Service Edge is copied from the VPN Service Edges page and pasted into the Hostname or IP Address Bypass for VPN Gateway field. [zpa.vpn.setup:client-bypass] The bypass field is also in [Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses](kb:zcc.z-tunnel.bypasses). After deploying the Network Connector and restarting the service, the Network Connectors page should show the Network Connector in the table. [zpa.vpn.setup:verify-connector]

The components are in [VPN Service Edges: what they are, statuses, client IP pools, update schedule, BGP configuration mode and China](kb:zpa.vpn.service-edges), [Network Connectors and Network Connector groups (VPN for Legacy Apps)](kb:zpa.vpn.network-connectors) and [Network Connector enrollment: OAuth 2.0 tokens and provisioning keys](kb:zpa.vpn.network-connectors.enrollment); the hub is [ZPA VPN (for Legacy Apps): what it is, its components and where each question goes](kb:zpa.vpn).

What to check:
1. Whether the servers have a route to the client IP pool through a Network Connector, and the Network Connector a route to the Network segments.
2. Whether outbound UDP 51820 to 53000 to the VPN Service Edge's IP address is allowed when the Network Connector's internet traffic is restricted.

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.z-tunnel.bypasses.md (Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses)
- links-to references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
- links-to references/_meta/text/zpa/zpa.vpn.network-connectors.md (Network Connectors and Network Connector groups (VPN for Legacy Apps))
- links-to references/_meta/text/zpa/zpa.vpn.network-connectors.enrollment.md (Network Connector enrollment: OAuth 2.0 tokens and provisioning keys)
- links-to references/_meta/text/zpa/zpa.vpn.redundancy.md (VPN redundancy: failure scenarios, BGP group settings, platform settings, replacing and migrating Network Connectors)
- links-to references/_meta/text/zpa/zpa.vpn.service-edges.md (VPN Service Edges: what they are, statuses, client IP pools, update schedule, BGP configuration mode and China)
- links-to references/_meta/text/zpa/zpa.vpn.user-enablement.md (VPN user enablement rules: who may open a VPN tunnel)
