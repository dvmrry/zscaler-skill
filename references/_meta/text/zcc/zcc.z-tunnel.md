# Z-Tunnel (zcc.z-tunnel)
Also called: z-tunnel; zscaler tunnel; ztunnel 2.0; client connector tunnel

The Z-Tunnel is how Client Connector carries traffic to a Public Service Edge when a forwarding profile's action is Tunnel. "Why did this traffic (not) go through the tunnel?" needs three questions answered in order.

1. **Which version does the profile select?** Z-Tunnel 1.0 carries only proxy-aware or web traffic, 2.0 all ports and protocols, and 2.0 profiles still send some web traffic over 1.0: [Z-Tunnel 1.0 and 2.0: what each carries and how a profile selects one](kb:zcc.z-tunnel.versions).
2. **Is the destination bypassed?** VPN gateway bypasses first, then destination inclusions and exclusions by specificity, and PAC-based domain bypasses for web traffic: [Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses](kb:zcc.z-tunnel.bypasses).
3. **Did the tunnel come up?** Transport, fallback and the setup failure behavior: [Z-Tunnel 2.0 transport: DTLS and TLS, fallback, MTU, and what happens when the tunnel cannot be set up](kb:zcc.z-tunnel.transport); the tenant-wide failover settings: [Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures](kb:zcc.forwarding-profiles.fail-open).

The vendor's rollout and migration procedures, and the GRE caution, are in [Rolling out Z-Tunnel 2.0 and migrating from 1.0](kb:zcc.z-tunnel.deployment). Where the Z-Tunnel sits among ZIA forwarding methods is in [Client Connector as a forwarding method: benefits, limits and Z-Tunnel modes](kb:zia.traffic-forwarding.zcc).

Area: zcc.z-tunnel, its subjects in references/_meta/spine/zcc/zcc.z-tunnel.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/shared/shared.z-tunnel.md (Z-Tunnel 1.0 and 2.0: where each question is answered): The NSS web and firewall log formats both carry `ztunnelversion`, the Z-Tunnel version of Client Connector traffic, with ZTUNNEL_1_0 as the documented example value. [shared.z-tunnel:log-field]
- decided-by references/_meta/text/zcc/zcc.forwarding-profiles.internet-actions.md (Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None): In Tunnel mode the forwarding profile's Tunnel Version Selection chooses the Z-Tunnel version, and the field appears only when the Packet Filter-Based driver is selected; choosing Z-Tunnel 2.0 opens the Advanced Z-Tunnel Configuration settings. [zcc.z-tunnel.versions:version-select-needs-pf]
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.fail-open.md (Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures)
- links-to references/_meta/text/zcc/zcc.z-tunnel.bypasses.md (Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses)
- links-to references/_meta/text/zcc/zcc.z-tunnel.deployment.md (Rolling out Z-Tunnel 2.0 and migrating from 1.0)
- links-to references/_meta/text/zcc/zcc.z-tunnel.transport.md (Z-Tunnel 2.0 transport: DTLS and TLS, fallback, MTU, and what happens when the tunnel cannot be set up)
- links-to references/_meta/text/zcc/zcc.z-tunnel.versions.md (Z-Tunnel 1.0 and 2.0: what each carries and how a profile selects one)
- links-to references/_meta/text/zia/zia.traffic-forwarding.zcc.md (Client Connector as a forwarding method: benefits, limits and Z-Tunnel modes)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.forwarding-profiles.md (ZCC forwarding profiles)
