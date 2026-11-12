# Forwarding profile actions for Private Access (ZPA): Tunnel or None per network type (zcc.forwarding-profiles.private-access-actions)
Also called: forwarding profile action for zpa; private access forwarding action; zpa not working on vpn; zpa disabled on trusted network; dynamic zpa service edge assignment; send trusted network result to zpa; zpa trusted_network rule never matches

The Private Access half of the forwarding profile decides, per network type, whether the app carries ZPA traffic at all.

**The choice.** For each network type (On-Trusted, VPN-Trusted, Off-Trusted, Split VPN-Trusted) the profile sets the Private Access action to Tunnel or None. [zcc.forwarding-profiles.private-access-actions:tunnel-or-none] Here too VPN-Trusted and Off-Trusted can be set to Same as "On-Trusted Network". [zcc.forwarding-profiles.private-access-actions:same-as-on-trusted] The Private Access action is set separately from the Internet & SaaS action for the same network type, so one profile can, for example, send no internet traffic through the app on a trusted network while still tunneling Private Access there. [zcc.forwarding-profiles.private-access-actions:independent-of-internet]

**Per network type.**
- **On-Trusted.** On a trusted network, Tunnel means the app uses Private Access to give users access to internal applications even though they are on a trusted network. [zcc.forwarding-profiles.private-access-actions:on-trusted-tunnel] On a trusted network, None disables Private Access: the app gives no access to internal applications and users reach them directly. [zcc.forwarding-profiles.private-access-actions:none-direct]
- **VPN-Trusted.** The vendor says not to select Tunnel for VPN-Trusted Network: with Tunnel, the app does not forward user traffic for Private Access while a VPN is also running on the device. [zcc.forwarding-profiles.private-access-actions:vpn-trusted-no-tunnel]
- **Off-Trusted.** Off a trusted network, None disables Private Access, and users reach internal applications only if they have another mechanism for reaching internal networks. [zcc.forwarding-profiles.private-access-actions:off-trusted-none]
- **Split VPN-Trusted.** On a Split VPN-Trusted network, Tunnel lets the app forward to Private Access any traffic that is not going through the split-tunnel VPN, which can require the VPN to be configured to exclude Private Access infrastructure. [zcc.forwarding-profiles.private-access-actions:split-vpn-tunnel]

**The default profile.** Zscaler's default forwarding profile uses Private Access on On-Trusted and Off-Trusted networks and disables it on VPN-Trusted networks. [zcc.forwarding-profiles.private-access-actions:default-private-access]

**Service Edge selection.** With Tunnel, Dynamic ZPA Service Edge Assignment sets a probe interval (30 to 600 seconds in 30-second steps, default 30), a probe sample size (default 5) and a threshold rank (1 to 5) for switching between primary and secondary Public Service Edges, and can be enabled for machine tunnels. [zcc.forwarding-profiles.private-access-actions:dynamic-zpa-se]

**After Tunnel is chosen.** Private Access evaluates this profile first and checks an application segment's own Bypass setting when the profile has sent the user to Private Access; that setting's On Corporate Network option relies on this profile's trusted network: [The Bypass setting is applied at the domain level; Private Access first evaluates the forwarding profile, and when the profile specifies that the user must use Private Access, it checks the application's Bypass setting.](kb:zpa.app-segments.bypass:bypass-domain-level), [The Bypass setting offers Use Client Forwarding Policy (the default), Always, and On Corporate Network, which lets users bypass Private Access from a trusted network defined in the Zscaler Client Connector forwarding profile.](kb:zpa.app-segments.bypass:bypass-options).

**Telling ZPA the network type.** The ZPA action carries a Send Trusted Network Result to ZPA setting: [A Client Connector forwarding profile's ZPA action has a Send Trusted Network Result to ZPA setting, described by the Client Connector API as indicating whether it is enabled.](kb:zpa.trusted-networks.zcc-relationship:send-result-setting). What ZPA rules see when it is off is open [gap:zcc.forwarding-profiles.private-access-actions:send-result-effect], and how the result travels is open in [Trusted networks in ZPA and in Client Connector](kb:zpa.trusted-networks.zcc-relationship).

What to check:
1. The device's network type and the Private Access action for it; None means the app gives no access to internal applications on that network.
2. For a user on a full-tunnel VPN: the VPN-Trusted action, which the vendor says should not be Tunnel and under which the app forwards nothing while a VPN runs.
3. For a ZPA rule with a trusted network condition that never matches: the ZPA action's Send Trusted Network Result to ZPA setting for the device's network type, keeping in mind its effect is unconfirmed.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.forwarding-profiles.private-access-actions:independent-of-internet] Tier B: Follows from the two settings being separate per network type; the help does not discuss combinations.

Not known (open gaps):
- Whether ZPA trusted network conditions stop matching when Send Trusted Network Result to ZPA is off [gap:zcc.forwarding-profiles.private-access-actions:send-result-effect]: settled by lab-test or support-ticket. Blocks: naming this setting as the cause of a ZPA trusted network rule that never matches

Area: zcc.forwarding-profiles, its subjects in references/_meta/spine/zcc/zcc.forwarding-profiles.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks): The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- interacts-with references/_meta/text/zpa/zpa.trusted-networks.zcc-relationship.md (Trusted networks in ZPA and in Client Connector): A Client Connector forwarding profile's ZPA action has a Send Trusted Network Result to ZPA setting, described by the Client Connector API as indicating whether it is enabled. [zpa.trusted-networks.zcc-relationship:send-result-setting]
- decided-by references/_meta/text/zcc/zcc.forwarding-profiles.network-types.md (The four network types Client Connector detects: On-Trusted, VPN-Trusted, Split VPN-Trusted, Off-Trusted): On-Trusted Network is when the user is connected to a private network that belongs to the organization; for the app to detect it, the Trusted Network Criteria must be set. [zcc.forwarding-profiles.network-types:on-trusted]
- logged-in references/_meta/text/shared/shared.z-tunnel.md (Z-Tunnel 1.0 and 2.0: where each question is answered), from zcc.forwarding-profiles: The NSS web and firewall log formats both carry `ztunnelversion`, the Z-Tunnel version of Client Connector traffic, with ZTUNNEL_1_0 as the documented example value. [shared.z-tunnel:log-field]
- scoped-by references/_meta/text/zcc/zcc.app-profiles.selection.md (Which app profile a device gets: rule order, groups and the longest match), from zcc.forwarding-profiles: An app profile selects the forwarding profile for Internet & SaaS and Private Access; forwarding profiles are configured first and then chosen when configuring app profiles. [zcc.forwarding-profiles.assignment:app-profile-selects]
- decided-by references/_meta/text/zcc/zcc.trusted-networks.detection.md (How Client Connector decides it is on a trusted network), from zcc.forwarding-profiles: A forwarding profile's Trusted Network Criteria define the network information and conditions a network must meet for Client Connector to verify that it is one of the organization's trusted networks. [zcc.trusted-networks.detection:criteria-defined]
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named), from zcc.forwarding-profiles: The trafficredirectmethod field records the traffic forwarding method used to reach ZIA Public Service Edges. [zia.logs.web-records:psedge-field]
- interacts-with references/_meta/text/zpa/zpa.policy.actions.md (Rule actions on ZPA policy types): The forwarding actions are BYPASS, where traffic goes directly to the destination and skips ZPA entirely; INTERCEPT, where it is routed through ZPA; and INTERCEPT_ACCESSIBLE, where it is intercepted only if the destination is reachable through ZPA. [zpa.policy.actions:forwarding-actions]

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zcc/zcc.api.forwarding-profile-wire.md (ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ)
- configured-via references/_meta/text/types/zcc/forwarding-profiles.md (config type)
- see-also references/_meta/text/zcc/zcc.forwarding-profiles.internet-actions.md (Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None)
