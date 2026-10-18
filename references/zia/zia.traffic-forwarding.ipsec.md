IPSec is the tunnel for routers that cannot do GRE and for sites with changing addresses. {{when-ipsec}} The credential that identifies the site is its own object: [[zia.traffic-forwarding.vpn-credentials]].

**Capacity and resilience.** {{bandwidth-limit}} {{two-tunnels}} GRE's limits are in [[zia.traffic-forwarding.gre]].

**Negotiation.** {{ike-versions}} {{ikev1-modes}} {{ikev2-parameters}} {{nat-traversal}} {{dpd}} {{local-id}}

**MTU and IPv6.** {{mtu-mss}} The ESP overhead and effective payload MTU are open {{gap:esp-overhead-range}}, and whether missing MSS clamping fails more often than under GRE is open {{gap:failing-mss-symptom}}. {{ipv6-selectors}}
