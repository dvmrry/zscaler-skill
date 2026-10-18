Zscaler describes seven ways to get traffic to the service, and a tenant normally uses several at once. {{supported-set}} {{recommended-combination}} {{alternative-combinations}}

Choosing for a site: {{tunnel-choice}} The numbers that separate them (per-tunnel bandwidth) are in [[zia.traffic-forwarding.gre]] and [[zia.traffic-forwarding.ipsec]]. {{tunnel-benefits}} {{tunnels-do-not-follow-users}} Remote users are covered by [[zia.traffic-forwarding.zcc]] or by a PAC file ([[zia.traffic-forwarding.pac]]); an existing on-premises proxy can be chained ([[zia.traffic-forwarding.proxy-chaining]]).

{{connector-products}}

The throughput threshold for choosing GRE over IPSec is open {{gap:throughput-threshold}}, the recommended pairings by site type are open {{gap:combined-patterns}}, and whether every method surfaces as a Location is open {{gap:location-per-method}}. Traffic from an unconfigured source is remote user traffic: [[zia.locations.model]].
