# Which policies scope by location and location group (zia.locations.rule-scoping)
Also called: rules by location; rule locations; location group in rule; scope a rule to a location; locations per rule; authentication location setting

URL Filtering, SSL Inspection, Cloud App Control, Firewall Filtering, Web DLP and Bandwidth Control rules each carry both a `locations` array and a `locationGroups` array, so a rule can name individual locations as well as groups. [zia.locations.rule-scoping:rules-take-both] Because a sublocation is a location, a rule's `locations` array can name a sublocation directly, as well as through a group. [zia.locations.rule-scoping:sublocations-are-nameable] A rule that scopes only by group does not name individual locations, and a rule that scopes by location does not follow a location into new groups; read both arrays.

Authentication is enforced by the location's own setting (`authRequired`, Enforce Authentication), which the service checks when traffic arrives from a known location. [zia.locations.rule-scoping:authentication-is-a-location-setting] Any rule type is limited to 32 locations and 32 location groups. [zia.locations.rule-scoping:per-rule-caps]

To cover a changing population such as all corporate locations in one city, scoping a rule to a dynamic group (for example name starts with NYC and a Location Type condition) lets new matching locations join the rule's scope with no edit to the rule. [zia.locations.rule-scoping:dynamic-group-for-populations]

Admin scope uses groups too: [Location groups: manual and dynamic, conditions, limits, predefined groups](kb:zia.locations.groups). Per-module behavior: [ZIA URL Filtering](kb:zia.url-filtering), [ZIA SSL/TLS inspection](kb:zia.ssl-inspection), [ZIA Cloud App Control](kb:zia.cloud-app-control), [ZIA Firewall Control](kb:zia.firewall), [ZIA Data Loss Prevention](kb:zia.dlp). Memberships that appear without an edit: [How locations land in groups: location type, defaults, exclusion flags and Terraform support](kb:zia.locations.group-assignment).

Inferred, not quoted (say so when an answer rests on one):
- [zia.locations.rule-scoping:sublocations-are-nameable] Tier B: Derived; the rule schemas describe the array as locations and do not mention sublocations.
- [zia.locations.rule-scoping:dynamic-group-for-populations] Tier B: Derived from automatic group updating; the example conditions are illustrative.

Area: zia.locations, its subjects in references/_meta/spine/zia/zia.locations.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.locations.groups.md (Location groups: manual and dynamic, conditions, limits, predefined groups): Location groups define an admin's scope and can be selected in policies and in reporting such as Insights and Dashboards. [zia.locations.groups:what-groups-are-for]
- interacts-with references/_meta/text/zia/zia.authentication.location-enforcement.md (Requiring authentication per location and sublocation): Authentication is enforced by the location's own setting (`authRequired`, Enforce Authentication), which the service checks when traffic arrives from a known location. [zia.locations.rule-scoping:authentication-is-a-location-setting]
- reached-via references/_meta/text/zia/zia.private-service-edge.location-binding.md (Binding a Private Service Edge cluster to a Location, and the open-proxy hazard), from zia.locations: Adding a location to a Private Service Edge cluster allows transaction logs to be viewed, categorized and reported per cluster, lets the organization manage authentication settings, IP Surrogacy settings, XFF consumption and Location group settings for SSL inspection and web filtering policies, and maps traffic and enforcement in a NAT environment. [zia.private-service-edge.location-binding:location-benefits]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding), from zia.locations: A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.locations: When Zscaler Client Connector traffic matches none of a location's listed IP addresses, the location is tagged as Road Warrior in the logs. [zia.locations.model:road-warrior]
- links-to references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control)
- links-to references/_meta/text/zia/zia.dlp.md (ZIA Data Loss Prevention)
- links-to references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control)
- links-to references/_meta/text/zia/zia.locations.group-assignment.md (How locations land in groups: location type, defaults, exclusion flags and Terraform support)
- links-to references/_meta/text/zia/zia.ssl-inspection.md (ZIA SSL/TLS inspection)
- links-to references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/locations.md (config type)
- configured-via references/_meta/text/types/zia/location-groups.md (config type)
- see-also references/_meta/text/zia/zia.locations.md (ZIA locations, sublocations and location groups)
- see-also references/_meta/text/zia/zia.locations.sublocations.md (Sublocations: what they are, the auto-created other sublocations, naming and limits)
