"How does this traffic get to ZIA?" splits into questions answered in order.

1. **Which methods exist, and which fits the site or user?** [[zia.traffic-forwarding.methods]].
2. **Tunnels from a site.** GRE needs a static IP and has per-tunnel bandwidth limits: [[zia.traffic-forwarding.gre]], with health and failover in [[zia.traffic-forwarding.gre-failover]]. IPSec is the option for routers without GRE and for dynamic IPs: [[zia.traffic-forwarding.ipsec]], with its credential object in [[zia.traffic-forwarding.vpn-credentials]].
3. **Browsers and existing proxies.** [[zia.traffic-forwarding.pac]] and [[zia.traffic-forwarding.proxy-chaining]].
4. **Users who leave the network.** [[zia.traffic-forwarding.zcc]].
5. **Several at once.** [[zia.traffic-forwarding.mixed-deployments]].

What the service does once the traffic arrives is a different question. How it learns the destination host (explicit versus transparent) is [[zia.proxy-mode]]; where ZIA sends traffic onward is [[zia.forwarding-control]]; how users are identified on each path is [[zia.authentication]]; which source networks are known is [[zia.locations]]; and how the firewall sees each path is [[zia.firewall.traffic-path]].
