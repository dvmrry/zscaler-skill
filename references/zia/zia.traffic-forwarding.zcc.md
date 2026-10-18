Client Connector is the method that follows the user. {{remote-users}} {{benefits}}

**Costs and prerequisites.** {{limitations}} {{requirements}} The old reference said every forwarding method ends as a Location; for this one the vendor describes the app connecting 'from an unknown location' ([[zia.locations.model]] has the Road Warrior tag for such traffic).

**Tunnel modes.** {{z-tunnel-1}} {{z-tunnel-2}} {{z-tunnel-2-single-ip-nat}} The mechanism and bypass design live in the shared and Client Connector references (`references/zcc/z-tunnel.md`, `references/zcc/forwarding-profile.md`), which are converted separately. Which proxy mode each tunnel mode corresponds to is in [[zia.proxy-mode.forwarding-map]]; how a site's GRE egress can trigger the fallback is in [[zia.traffic-forwarding.mixed-deployments]].

Whether trusted-network detection defers to a GRE tunnel is not stated as such (gap `zcc-covers-gre-fallback`).

What to check: which tunnel mode the device is really in (a silent fallback to 1.0 changes what traffic is covered), the NAT in front of the device, and whether SSL Inspection rules reach Client Connector users ([[zia.ssl-inspection.criteria]]).
