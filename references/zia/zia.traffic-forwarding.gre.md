GRE is the tunnel for sites whose router can build it. This subject covers what the tunnel needs and how it scales; health checks and failover are in [[zia.traffic-forwarding.gre-failover]], and which method to pick is in [[zia.traffic-forwarding.methods]].

**What it is and what it needs.** {{overview}} {{static-ip-required}} {{source-ip-provisioned}}

**How much it carries.** {{bandwidth-limit}} {{nat-limit-reason}} {{scale-out}} {{client-persistence}}

**Where to build it.** {{internal-router}} {{border-router}} {{primary-backup-per-egress}} A sublocation matches IP addresses carried inside the parent's tunnel (or XFF client addresses) and adds no forwarding path of its own ([[zia.locations.ip-scoping]]).

**No default route.** {{explicit-via-global-edges}} What explicit mode means for the traffic is in [[zia.proxy-mode.forwarding-map]].

**Provisioning.** {{provisioning}} {{vip-selection}} {{api-surface}} The firewall module's view of tunnel traffic is in [[zia.firewall.traffic-path]]; the bandwidth Bandwidth Control enforces per location is in [[zia.locations.bandwidth]].

**MTU and MSS.** {{mtu-mss}} The old reference said an unclamped MSS is a common cause of "browsing works but large transfers hang"; the vendor says only that a wrong MTU degrades performance (gap `mss-symptom`). It also said premium data centers need a Support ticket; the vendor says only that the picker excludes them (gap `premium-dc-support`). Whether GRE carries IPv6 is not stated (gap `ipv6-coverage`); for IPSec it is: [[zia.traffic-forwarding.ipsec]].

What to check: the tunnel's source IP is a provisioned static IP, whether the inner addresses are NATed (that sets 1 Gbps versus 250 Mbps), and that the primary and secondary VIPs are in different data centers.
