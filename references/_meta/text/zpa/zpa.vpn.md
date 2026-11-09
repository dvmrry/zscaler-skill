# ZPA VPN (for Legacy Apps): what it is, its components and where each question goes (zpa.vpn)
Also called: vpn for legacy apps; zpa vpn; zpa layer 3 vpn; network connector vpn tunnel; voip over zpa; active ftp over zpa; real ip address binding

With VPN (for Legacy Apps), Private Access can natively support a secondary Layer 3 network-based VPN tunnel for applications and services, such as VoIP or server-to-client, that require Layer 3 IP-based connectivity. It enables support for legacy applications that require server-to-client traffic using real IP address binding, such as VoIP or Active FTP. [zpa.vpn:definition] The service uses VPN Service Edges, Network Connectors, Network segments and Zscaler Client Connector. A VPN Service Edge manages the connections between Client Connector and Network Connectors, the Network Connector is deployed within the application server's data center and connects to all known VPN Service Edges, and Network segments define which traffic flows through the VPN tunnel from Client Connector. [zpa.vpn:components]

**Requirements.** Organizations must configure the route to the client IP pool using the Network Connector's IP address as the next hop. [zpa.vpn:return-route] VPN (for Legacy Apps) connections are only established if each entity (Network Connectors, VPN Service Edges and Zscaler Client Connector) has the public and private key pairs of the other entities. [zpa.vpn:key-pairs] Private Access supports Windows and macOS platforms for VPN (for Legacy Apps), and the feature is available to users running supported Zscaler Client Connector versions. [zpa.vpn:client-platforms] The macOS Client Connector version is in [macOS system extensions, VPN payloads and privacy profiles for Client Connector](kb:zcc.install.macos-extensions); the Windows minimum is open [gap:zpa.vpn:windows-client-version].

**Scope and roles.** The Default Microtenant restriction is in [These features are supported only for a Default Microtenant and not for a standard Microtenant: AI-Powered Recommendations for Application Segments, Application Segments Usage, AppProtection for Private Application Traffic, Authentication Service, Browser Access with CORS, Client Hostname Validation, Disaster Recovery, Extranet Application Support, Inspect Traffic with ZIA, Log Streaming Service, Source IP-Anchor enabled applications, VPN (for Legacy Apps), Zscaler Branch Connector and Zscaler Cloud Connector.](kb:zpa.microtenants.limits:default-only-features) and the admin role feature in [A Private Access admin role enables access per feature, chosen from these features: Administration Control, API Key Management, App Connector Management, Authentication, Business Continuity Management, B2B Exchange, Certificate Management, Client Connector Portal, Client Sessions, Cloud Connector Management, Company Information, Configuration, Dashboard, Diagnostics, Log Streaming, Machine Management, Notification Management, Policies, Private Service Edge Management, Privileged Remote Access, Privileged Sessions, Security Management, SCIM Management and VPN (For Legacy Apps). Each grants Full or Read Only access, except Client Connector Portal (Full) and Dashboard (Read Only).](kb:shared.admin-rbac.zpa:feature-list).

1. **What must exist before it is enabled, and in what order is it configured?** [VPN (for Legacy Apps) prerequisites and configuration order](kb:zpa.vpn.setup); the Client Connector bypass step links to [Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses](kb:zcc.z-tunnel.bypasses).
2. **What is a VPN Service Edge?** [VPN Service Edges: what they are, statuses, client IP pools, update schedule, BGP configuration mode and China](kb:zpa.vpn.service-edges).
3. **What is a Network Connector and its group?** [Network Connectors and Network Connector groups (VPN for Legacy Apps)](kb:zpa.vpn.network-connectors); enrollment in [Network Connector enrollment: OAuth 2.0 tokens and provisioning keys](kb:zpa.vpn.network-connectors.enrollment) and platforms, sizing, firewall and install in [Network Connector platforms, sizing, prerequisites, firewall and install (VPN for Legacy Apps)](kb:zpa.vpn.network-connectors.deployment).
4. **Which traffic goes through the tunnel?** [VPN network segments: LAN subnets or FQDNs assigned to Network Connector groups](kb:zpa.vpn.network-segments).
5. **Who may open a tunnel, and what may the tunnel carry?** [VPN user enablement rules: who may open a VPN tunnel](kb:zpa.vpn.user-enablement) for users, [VPN access policy rules: source, destination, default block, rule order and limits](kb:zpa.vpn.access-policy) for traffic, and [VPN access policy objects: IP address objects and IdP attribute objects](kb:zpa.vpn.policy-objects) for the reusable objects. The application access policy is a different rule set: [ZPA policy evaluation](kb:zpa.policy).
6. **How does it survive a failure?** [BGP for VPN Service Edges and Network Connectors: AS numbers, failure detection, external routers](kb:zpa.vpn.bgp) and [VPN redundancy: failure scenarios, BGP group settings, platform settings, replacing and migrating Network Connectors](kb:zpa.vpn.redundancy).
7. **How is it monitored and diagnosed?** [VPN Service Edges, Network Connectors and BGP Peers dashboards](kb:zpa.vpn.dashboards), [VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data](kb:zpa.vpn.diagnostics) and [VPN Support Information: diagnostic sessions and commands on VPN Service Edges and Network Connectors](kb:zpa.vpn.support-information); the App Connector and Private Service Edge counterparts start at [Troubleshooting ZPA access: from symptom to layer](kb:zpa.troubleshooting).
8. **How does it differ from the other connector and Service Edge types?** [ZPA App Connectors](kb:zpa.app-connectors) and [ZPA Private Service Edges](kb:zpa.private-service-edges).

**Open.** The limits the pages point to are open [gap:zpa.vpn:ranges-limitations]. The provisioning key pages are in [Network Connector enrollment: OAuth 2.0 tokens and provisioning keys](kb:zpa.vpn.network-connectors.enrollment).

Not known (open gaps):
- Minimum Client Connector version for VPN (for Legacy Apps) on Windows [gap:zpa.vpn:windows-client-version]: settled by source-read or support-ticket
- The Ranges & Limitations values for VPN (for Legacy Apps) [gap:zpa.vpn:ranges-limitations]: settled by source-read

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.vpn.network-connectors.enrollment.md (Network Connector enrollment: OAuth 2.0 tokens and provisioning keys)
- links-to references/_meta/text/shared/shared.admin-rbac.zpa.md (ZPA admin roles: feature permissions, effective access and propagation delay)
- links-to references/_meta/text/zcc/zcc.install.macos-extensions.md (macOS system extensions, VPN payloads and privacy profiles for Client Connector)
- links-to references/_meta/text/zcc/zcc.z-tunnel.bypasses.md (Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses)
- links-to references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors)
- links-to references/_meta/text/zpa/zpa.microtenants.limits.md (Microtenant limits and unsupported features)
- links-to references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation)
- links-to references/_meta/text/zpa/zpa.private-service-edges.md (ZPA Private Service Edges)
- links-to references/_meta/text/zpa/zpa.troubleshooting.md (Troubleshooting ZPA access: from symptom to layer)
- links-to references/_meta/text/zpa/zpa.vpn.access-policy.md (VPN access policy rules: source, destination, default block, rule order and limits)
- links-to references/_meta/text/zpa/zpa.vpn.bgp.md (BGP for VPN Service Edges and Network Connectors: AS numbers, failure detection, external routers)
- links-to references/_meta/text/zpa/zpa.vpn.dashboards.md (VPN Service Edges, Network Connectors and BGP Peers dashboards)
- links-to references/_meta/text/zpa/zpa.vpn.diagnostics.md (VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data)
- links-to references/_meta/text/zpa/zpa.vpn.network-connectors.md (Network Connectors and Network Connector groups (VPN for Legacy Apps))
- links-to references/_meta/text/zpa/zpa.vpn.network-connectors.deployment.md (Network Connector platforms, sizing, prerequisites, firewall and install (VPN for Legacy Apps))
- links-to references/_meta/text/zpa/zpa.vpn.network-segments.md (VPN network segments: LAN subnets or FQDNs assigned to Network Connector groups)
- links-to references/_meta/text/zpa/zpa.vpn.policy-objects.md (VPN access policy objects: IP address objects and IdP attribute objects)
- links-to references/_meta/text/zpa/zpa.vpn.redundancy.md (VPN redundancy: failure scenarios, BGP group settings, platform settings, replacing and migrating Network Connectors)
- links-to references/_meta/text/zpa/zpa.vpn.service-edges.md (VPN Service Edges: what they are, statuses, client IP pools, update schedule, BGP configuration mode and China)
- links-to references/_meta/text/zpa/zpa.vpn.setup.md (VPN (for Legacy Apps) prerequisites and configuration order)
- links-to references/_meta/text/zpa/zpa.vpn.support-information.md (VPN Support Information: diagnostic sessions and commands on VPN Service Edges and Network Connectors)
- links-to references/_meta/text/zpa/zpa.vpn.user-enablement.md (VPN user enablement rules: who may open a VPN tunnel)
