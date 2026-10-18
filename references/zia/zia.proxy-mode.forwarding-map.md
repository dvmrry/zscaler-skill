The mode is a property of how a flow arrives, not a setting: {{not-a-setting}}

| Arrival | Mode | Claim |
|---|---|---|
| Browser with a PAC file or manual proxy | Explicit | {{pac-explicit}} |
| GRE or IPSec tunnel, no browser configuration | Transparent | {{tunnel-transparent}} |
| Tunnel carrying PAC-directed traffic | Explicit | {{explicit-over-tunnel}} |
| Z-Tunnel 1.0 | Not labeled | {{z-tunnel-1-connect}} |
| Z-Tunnel 2.0 | Not stated | {{gap:z-tunnel-2-mode}} |
| Chained on-premises proxy | Not stated | {{gap:chained-proxy-mode}} |

Mode details are in [[zia.proxy-mode.explicit]] and [[zia.proxy-mode.transparent]]; the methods are in [[zia.traffic-forwarding.gre]], [[zia.traffic-forwarding.ipsec]], [[zia.traffic-forwarding.pac]], [[zia.traffic-forwarding.zcc]] and [[zia.traffic-forwarding.proxy-chaining]].
