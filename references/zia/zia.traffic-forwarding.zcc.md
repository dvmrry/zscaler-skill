Client Connector is the method that follows the user. {{remote-users}} {{benefits}}

**Costs and prerequisites.** {{limitations}} {{requirements}} The old reference said every forwarding method ends as a Location; for this one the vendor describes the app connecting 'from an unknown location' ([[zia.locations.model]] has the Road Warrior tag for such traffic).

**Tunnel modes.** {{z-tunnel-1}} {{z-tunnel-2}} {{z-tunnel-2-single-ip-nat}} The mechanism and bypass design are in [z-tunnel](../zcc/z-tunnel.md) and [forwarding profile](../zcc/forwarding-profile.md). Which proxy mode each tunnel mode corresponds to is in [[zia.proxy-mode.forwarding-map]]; how a site's GRE egress can trigger the fallback is in [[zia.traffic-forwarding.mixed-deployments]].

Whether trusted-network detection defers to a GRE tunnel is open {{gap:zcc-covers-gre-fallback}}.

SSL Inspection rules are in [[zia.ssl-inspection.criteria]].
