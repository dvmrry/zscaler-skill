**Everything is public.** {{addresses-must-be-public}}

**The per-node budget** depends on the design from [[zia.private-service-edge.sizing]]. {{integrated-lb-budget}} {{dedicated-lb-budget}} Budget the pool per node, multiplied by the node count, plus the switch ports. The page labels the cluster VIP "per cluster" but counts it per node ([[zia.private-service-edge.ip-requirements:vip-count-wording]]); confirm the VIP count with Zscaler before ordering address space. {{sfps-not-shipped}}

**IPv6.** {{ipv6-optional}} {{ipv6-tunnel-extra-address}}

**NAT.** {{nat-one-to-one-no-ipv6}} So a tenant that needs IPv6 cannot sit behind NAT, and an RFC 1918 deployment gives up IPv6 by construction. Whether a many-to-one (overloaded) NAT merely forfeits IPv6 or breaks the PSE outright is not stated ([[zia.private-service-edge.ip-requirements:shared-nat-behavior]]); use 1:1 static NAT.

**What Zscaler needs from you.** {{customer-supplied-network-info}}

**Firewall.** {{cloud-ops-remote-access}} The deployment article points to a different published list (`config.zscaler.com/<cloud>/fcr`) for the firewall rules; see [[zia.private-service-edge.deployment]].
