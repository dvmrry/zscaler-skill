Zscaler describes seven ways to get traffic to the service, and a tenant normally uses several at once. {{supported-set}} {{recommended-combination}} {{alternative-combinations}}

Choosing for a site: {{tunnel-choice}} The numbers that separate them (per-tunnel bandwidth) are in [[zia.traffic-forwarding.gre]] and [[zia.traffic-forwarding.ipsec]]. {{tunnel-benefits}} {{tunnels-do-not-follow-users}} Remote users are covered by [[zia.traffic-forwarding.zcc]] or by a PAC file ([[zia.traffic-forwarding.pac]]); an existing on-premises proxy can be chained ([[zia.traffic-forwarding.proxy-chaining]]).

{{connector-products}}

The old reference also gave a throughput threshold for choosing GRE over IPSec, two pairing recommendations and a statement that every method ends as a Location. None is stated by a captured source (gaps `throughput-threshold`, `combined-patterns`, `location-per-method`). What the sources do say about locations is that traffic from an unconfigured source is remote user traffic: [[zia.locations.model]].

What to check: which method each site actually uses (the location's tunnel or credential, not the diagram), and whether remote users have a second method.
