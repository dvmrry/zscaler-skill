IPSec is the tunnel for routers that cannot do GRE and for sites with changing addresses. {{when-ipsec}} The credential that identifies the site is its own object: [[zia.traffic-forwarding.vpn-credentials]].

**Capacity and resilience.** {{bandwidth-limit}} {{two-tunnels}} Compare GRE's limits in [[zia.traffic-forwarding.gre]].

**Negotiation.** {{ike-versions}} {{ikev1-modes}} {{ikev2-parameters}} {{nat-traversal}} {{dpd}} {{local-id}}

**MTU and IPv6.** {{mtu-mss}} The old reference derived an ESP overhead of 50 to 80 bytes and a payload MTU of 1380 to 1420 bytes from protocol knowledge, and said missing MSS clamping fails more often under IPSec than GRE; neither is stated by the vendor, whose figures are above (gaps `esp-overhead-range`, `failing-mss-symptom`). {{ipv6-selectors}}

What to check: IKE version and, for IKEv1, the mode; the local ID against the credential type; and whether the site is under the 400 Mbps per source IP limit.
