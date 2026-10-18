Most tenants mix methods, and the combinations fail in specific ways.

**Tunnels and Client Connector.** {{gre-ztunnel2-egress}} Check the NAT and ECMP design on the egress path when a device shows Z-Tunnel 1.0 unexpectedly: [[zia.traffic-forwarding.zcc]], [[zia.traffic-forwarding.gre]]. The old reference said the fallback is silent; the vendor does not say so.

**PAC users on a tunnel site.** {{pac-users-fall-to-other}} Audit the rules that reach `other` for any location whose tunnel also carries PAC users: [[zia.locations.sublocations]], [[zia.traffic-forwarding.pac]].

**Rules that depend on the path.** SSL Inspection rules scoped by the CONNECT User-Agent match only explicit-mode traffic and never tunnel traffic: [[zia.ssl-inspection.criteria]]. Rules that need a user need Client Connector or Surrogate IP: [[zia.ssl-inspection.pipeline]], [[zia.authentication.unauthenticated-traffic]].

Two other legacy claims are carried as gaps: dynamic Location Groups catching the wrong methods (`location-group-mixing`), and each method creating its own Location (`location-per-method-mixed`). Group behavior in general is [[zia.locations.groups]].

What to check: per site, which methods carry which users, and what the unmatched-address (`other`) rules would do to the traffic you did not plan for.
