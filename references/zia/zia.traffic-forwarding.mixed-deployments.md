Most tenants mix methods, and the combinations fail in specific ways.

**Tunnels and Client Connector.** {{gre-ztunnel2-egress}} The Client Connector and tunnel designs are in [[zia.traffic-forwarding.zcc]] and [[zia.traffic-forwarding.gre]].

**PAC users on a tunnel site.** {{pac-users-fall-to-other}} Sublocations are in [[zia.locations.sublocations]], and PAC forwarding is in [[zia.traffic-forwarding.pac]].

**Rules that depend on the path.** SSL Inspection rules scoped by the CONNECT User-Agent match only explicit-mode traffic and never tunnel traffic: [[zia.ssl-inspection.criteria]]. Rules that need a user need Client Connector or Surrogate IP: [[zia.ssl-inspection.pipeline]], [[zia.authentication.unauthenticated-traffic]].

Dynamic Location Groups catching the wrong methods is open {{gap:location-group-mixing}}, and whether each method creates its own Location is open {{gap:location-per-method-mixed}}. Group behavior in general is [[zia.locations.groups]].
