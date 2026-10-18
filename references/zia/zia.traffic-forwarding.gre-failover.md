A GRE tunnel that is up on the router can still be useless, so health has two layers. {{keepalive-limit}} {{monitoring-required}} {{health-checks}} {{no-popular-site-checks}}

Failover is a trade between speed and false alarms. {{failover-profiles}} {{delay-down-up}}

The old reference quoted the profiles as "30-42 seconds worst case" and "120-185 seconds worst case". Those ranges mix best-case and worst-case rows; the published values are above. The tunnel design itself (primary and secondary in different data centers) is in [[zia.traffic-forwarding.gre]].

What to check: which profile the router actually runs, that the health check targets the Zscaler VPN test URL and not a public site, and that the track is wired to the route (the failover only happens if monitoring drives it).
