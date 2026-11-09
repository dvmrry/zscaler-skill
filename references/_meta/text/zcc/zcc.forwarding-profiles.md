# ZCC forwarding profiles (zcc.forwarding-profiles)
Also called: forwarding profile; zcc forwarding profile; how does zcc decide where to send traffic; traffic bypassed zscaler; web forwarding profile; zcc_forwarding_profile; traffic goes direct instead of through zscaler; why didn't zia see this traffic; app ignores the system proxy; proxy-unaware application
Former IDs: zcc-84

A forwarding profile tells Client Connector how to treat traffic from users' systems in different network environments, for the Internet & SaaS and Private Access services. [zcc.forwarding-profiles:purpose] "Where did this device's traffic go?" needs four questions answered in order.

1. **Which forwarding profile does the device run?** The one its app profile selects, as of the last login or restart: [Which forwarding profile a device uses, and when a change reaches it](kb:zcc.forwarding-profiles.assignment).
2. **Which network type was the device in?** On-Trusted, VPN-Trusted, Split VPN-Trusted or Off-Trusted: [The four network types Client Connector detects: On-Trusted, VPN-Trusted, Split VPN-Trusted, Off-Trusted](kb:zcc.forwarding-profiles.network-types), decided for On-Trusted by the trusted network criteria in [How Client Connector decides it is on a trusted network](kb:zcc.trusted-networks.detection).
3. **What does the profile do on that network type?** Separately for internet traffic and for Private Access: [Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None](kb:zcc.forwarding-profiles.internet-actions), [Forwarding profile actions for Private Access (ZPA): Tunnel or None per network type](kb:zcc.forwarding-profiles.private-access-actions).
4. **If it tunnels, how?** Z-Tunnel version, transport and bypasses: [Z-Tunnel](kb:zcc.z-tunnel).

When the app cannot protect traffic at all, the fail-open settings decide: [Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures](kb:zcc.forwarding-profiles.fail-open). Reading or writing profiles through the API, including the undocumented integer codes: [ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ](kb:zcc.api.forwarding-profile-wire).

**Copying and finding profiles.** A forwarding profile can be copied and customized instead of configuring each setting in a new profile; the default profile cannot be copied, and a maximum of 10 profiles can be copied at the same time. [zcc.forwarding-profiles:copy] Where the copy lands in the table conflicts with the default profile always being last, [If no other forwarding profile is configured, Zscaler applies a default forwarding profile automatically; it is always the last profile in the Forwarding Profile table.](kb:zcc.forwarding-profiles.assignment:default-profile) [divergence:zcc.forwarding-profiles:copy-position]. The Forwarding Profile page can be searched by profile name, with Enter displaying the results. [zcc.forwarding-profiles:search]

**Dedicated proxy port.** Client Connector's dedicated proxy port page is described with the ZIA proxy ports: [Client Connector can use a dedicated proxy port: on the Dedicated Proxy Port page (Infrastructure > Client Connector > Dedicated Proxy Port) an admin enables Dedicated Proxy Port and selects an available port, and Client Connector attempts connections with that port before using 443 or 80, in that order.](kb:zia.forwarding-control.proxy-ports:client-connector-port).

**Unified tunnel.** Profiles can also carry an `enableUnifiedTunnel` flag and a unified tunnel list, whose entries each name a network type and carry separate ZIA and ZPA action codes: [Both SDKs model an `enableUnifiedTunnel` flag and a `unifiedTunnel` list whose entries each name a `networkType` and carry separate `actionTypeZIA` and `actionTypeZPA` codes alongside transport, MTU, fallback, IPv6 and system proxy settings and a `sameAsOnTrusted` flag; the Go entry also carries `sendAllDNSToTrustedServer`.](kb:zcc.api.forwarding-profile-wire:unified-tunnel-shape). What unified tunnel mode changes for the device is open [gap:zcc.forwarding-profiles:unified-tunnel-semantics].

What to check:
1. Before reading ZIA policy for traffic ZIA never logged: which network type the device was in, and whether the profile's Internet & SaaS action for it is None, which tunnels nothing.
2. Whether the trusted network criteria matched where the user actually was, which puts the device On-Trusted and selects the On-Trusted actions.
3. When a Private Access application is not reached and its segment configuration looks right: the profile's Private Access action for the device's network type, which is set separately from the internet action and can be None.

Sources disagree (name both sides):
- The Copying a Forwarding Profile page says a copied profile appears at the bottom of the Forwarding Profile table, while About Forwarding Profiles says the default profile is always the last profile in the table. [divergence:zcc.forwarding-profiles:copy-position]
  - zscaler-help: A copied profile appears at the bottom of the Forwarding Profile table.
  - zscaler-help: The default forwarding profile is always the last profile in the table (existing claim zcc.forwarding-profiles.assignment:default-profile).
  Impact: If copies go to the bottom, the default profile cannot always be last; the pages do not say which order the table shows after a copy.

Not known (open gaps):
- What unified tunnel mode changes for the device [gap:zcc.forwarding-profiles:unified-tunnel-semantics]: settled by source-read or lab-test. Blocks: explaining tunnel behavior on a profile with unified tunnel enabled

Area: zcc.forwarding-profiles, its subjects in references/_meta/spine/zcc/zcc.forwarding-profiles.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zcc/zcc.forwarding-profiles.network-types.md (The four network types Client Connector detects: On-Trusted, VPN-Trusted, Split VPN-Trusted, Off-Trusted): When a user connects to a network, the app determines its network type and displays it on the Internet Security window and the Private Access window. [zcc.forwarding-profiles.network-types:network-type-displayed]
- decided-by references/_meta/text/zcc/zcc.trusted-networks.detection.md (How Client Connector decides it is on a trusted network): A forwarding profile's Trusted Network Criteria define the network information and conditions a network must meet for Client Connector to verify that it is one of the organization's trusted networks. [zcc.trusted-networks.detection:criteria-defined]
- links-to references/_meta/text/zcc/zcc.api.forwarding-profile-wire.md (ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.assignment.md (Which forwarding profile a device uses, and when a change reaches it)
- logged-in references/_meta/text/shared/shared.z-tunnel.md (Z-Tunnel 1.0 and 2.0: where each question is answered): The NSS web and firewall log formats both carry `ztunnelversion`, the Z-Tunnel version of Client Connector traffic, with ZTUNNEL_1_0 as the documented example value. [shared.z-tunnel:log-field]
- scoped-by references/_meta/text/zcc/zcc.app-profiles.selection.md (Which app profile a device gets: rule order, groups and the longest match): An app profile selects the forwarding profile for Internet & SaaS and Private Access; forwarding profiles are configured first and then chosen when configuring app profiles. [zcc.forwarding-profiles.assignment:app-profile-selects]
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named): The trafficredirectmethod field records the traffic forwarding method used to reach ZIA Public Service Edges. [zia.logs.web-records:psedge-field]
- interacts-with references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks): The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.fail-open.md (Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.internet-actions.md (Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.private-access-actions.md (Forwarding profile actions for Private Access (ZPA): Tunnel or None per network type)
- links-to references/_meta/text/zcc/zcc.z-tunnel.md (Z-Tunnel)
- links-to references/_meta/text/zia/zia.forwarding-control.proxy-ports.md (Dedicated proxy ports)
