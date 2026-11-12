# BGP for VPN Service Edges and Network Connectors: AS numbers, failure detection, external routers (zpa.vpn.bgp)

Border Gateway Protocol provides alternate paths to reach applications during Network Connector node failures and Network Connector to VPN Service Edge path or link failures. If a failure occurs in a Network Connector, VPN Service Edges use BGP to reroute traffic to another Network Connector within the same Network Connector group for the specific IP address subnet or FQDN. [zpa.vpn.bgp:purpose] VPN Service Edges have the maximum path set to 256 and ECMP enabled to support BGP. [zpa.vpn.bgp:vse-ecmp]

**AS numbers.** BGP is configured in separate pages for VPN Service Edges and for Network Connectors, each with a Local AS Number, described as the local autonomous system number used by the router for bidirectional traffic. The VPN Service Edges page says the value of the Local AS Number must be different for VPN Service Edges and Network Connectors. [zpa.vpn.bgp:local-as]

**Failure detection.** Session failure detection uses either BGP timers or BFD. BGP sends empty keepalive messages over the TCP connection between two peers, with settings for how frequently keepalive messages are sent (keepalive) and the number of seconds to wait for them before determining the peer is down (holdtimer). BFD sends packets between peers in milliseconds, with settings for the RX interval, TX interval and how many consecutive BFD packets can be dropped before the peer is declared down (detect multiplier). The page says the same session failure detection method must be used for VPN Service Edges and Network Connectors for proper routing. [zpa.vpn.bgp:failure-detection] The pages give no timer or BFD values [gap:zpa.vpn.bgp:timer-values].

**Network Connector BGP.** The Configuring BGP for Network Connectors page says the feature is in limited availability and to contact Zscaler Support. BGP can be configured at a global level, or the global BGP can be overridden when adding or editing individual Network Connector groups. [zpa.vpn.bgp:connector-bgp-availability]

**External routers.** BGP relies on external routers called BGP peers, and peering occurs when BGP peers form connections with other BGP peers. [zpa.vpn.bgp:external-routers] Up to 64 external routers can be added. Each takes a Router AS Number (the ASN of the external router), a Router IP Address (the internal router the Network Connector peers with) and an optional MD5 BGP authentication password, which must be configured with the same value on both BGP peers. [zpa.vpn.bgp:router-fields] Which Network Connector group option turns BGP on is named and described differently across the pages [divergence:zpa.vpn.bgp:lan-segments-setting].

What to check:
1. Before telling an operator which Network Connector group setting enables BGP, give both the name and the purpose each page states.
2. Before advising on session failure detection, check VPN Service Edges and Network Connectors use the same method.

Sources disagree (name both sides):
- The help pages name the Network Connector group option that enables BGP differently, and the replace article presents the same settings as being for a static route. [divergence:zpa.vpn.bgp:lan-segments-setting]
  - zscaler-help: About External Routers: the option is Advertise LAN Segments Locally, and BGP is enabled when it is disabled.
  - zscaler-help: VPN Redundancy Deployment Guide: the option is Advertise LAN Segments, and Disabled is selected to use BGP.
  - zscaler-help: Replacing or Migrating Network Connectors: the same list of options, with Advertise LAN Segments Locally set to Disabled, is introduced as what to set to use a static route.
  Impact: The option appears as Advertise LAN Segments in one article and Advertise LAN Segments Locally in the other two. Two pages say disabling it enables BGP, while the third frames the disabled settings as being for a static route, so the pages conflict on what disabling it is for.

Not known (open gaps):
- BGP timer and BFD values, and the BGP Override file format [gap:zpa.vpn.bgp:timer-values]: settled by lab-test or support-ticket

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
- see-also references/_meta/text/zpa/zpa.vpn.redundancy.md (VPN redundancy: failure scenarios, BGP group settings, platform settings, replacing and migrating Network Connectors)
- see-also references/_meta/text/zpa/zpa.vpn.network-connectors.md (Network Connectors and Network Connector groups (VPN for Legacy Apps))
