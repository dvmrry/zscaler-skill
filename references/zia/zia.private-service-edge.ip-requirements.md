**Everything is public.** {{addresses-must-be-public}}

**The per-node budget** depends on the design from [[zia.private-service-edge.sizing]]. {{integrated-lb-budget}} {{dedicated-lb-budget}} The cluster VIP is labelled per cluster but counted per node {{gap:vip-count-wording}}. {{sfps-not-shipped}}

**IPv6.** {{ipv6-optional}} {{ipv6-tunnel-extra-address}}

**NAT.** {{nat-one-to-one-no-ipv6}} Whether a many-to-one (overloaded) NAT merely forfeits IPv6 or breaks the PSE outright is open {{gap:shared-nat-behavior}}.

**What Zscaler needs from you.** {{customer-supplied-network-info}}

**Firewall.** {{cloud-ops-remote-access}} Which published firewall list applies is open [[zia.private-service-edge.deployment:firewall-list-source]].
