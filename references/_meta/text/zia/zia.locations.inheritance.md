# Which location settings a sublocation has of its own and which it takes from the parent (zia.locations.inheritance)
Also called: sublocation inherit; sublocation settings; sublocation firewall; sublocation xff read-only; top applicableTo; ip surrogate sublocation; sublocation authentication

"Does this sublocation have its own firewall, authentication or XFF setting?" has a different answer for each setting.

**Parent-only in the API.** The OpenAPI schema marks `ofwEnabled` (Enable Firewall), `ipsControl`, `xffForwardEnabled`, `ports`, `vpnCredentials`, `ipv6Enabled` and `ipv6Dns64Prefix` as applying to top-level locations only. For a sublocation `xffForwardEnabled` is read-only and inherited from the parent. [zia.locations.inheritance:parent-only-fields]

**Set on the sublocation.** The schema applies `authRequired`, `aupEnabled`, `cautionEnabled`, `surrogateIP`, `upBandwidth`, `dnBandwidth`, `profile` and `ipAddresses` to both parent locations and sublocations. [zia.locations.inheritance:shared-fields] Enforce Authentication is a per-sublocation setting, which is what lets a corporate sublocation authenticate while a guest sublocation under the same tunnel does not. [zia.locations.inheritance:sublocation-auth-per-sublocation] A sublocation does not inherit its parent's IP Surrogate setting; it is configured on the sublocation separately, and its Idle Time to Disassociation and known-browser options are set there. [zia.locations.inheritance:surrogate-not-inherited]

**Firewall is where the sources disagree.** The Add Sublocation window offers Enforce Firewall Control and Enable IPS Control among its Gateway Options. [zia.locations.inheritance:console-sublocation-firewall-toggles] The console and the API disagree on whether a sublocation has its own firewall flag [divergence:zia.locations.inheritance:sublocation-firewall-and-ips], and whether that flag is stored, ignored or inherited is open [gap:zia.locations.inheritance:sublocation-firewall-source]. Firewall enablement and rule behavior per location are in [ZIA Firewall Control](kb:zia.firewall).

Whether a new sublocation inherits the parent's auth, firewall or SSL settings is open [gap:zia.locations.inheritance:inherit-everything]. See [Sublocations: what they are, the auto-created other sublocations, naming and limits](kb:zia.locations.sublocations). Surrogate IP and per-location authentication are covered in [Surrogate IP: mapping a private IP to an authenticated user](kb:zia.authentication.surrogate-ip) and [Requiring authentication per location and sublocation](kb:zia.authentication.location-enforcement).

What to check:
1. Whether the setting is parent-only in the API, and what the console shows for it, before assuming a sublocation has its own value.
2. Each setting on a new sublocation against its parent, since whether most settings are inherited is open.

Sources disagree (name both sides):
- The console presents firewall and IPS enablement as sublocation settings, while the API schema limits them to top-level locations. [divergence:zia.locations.inheritance:sublocation-firewall-and-ips]
  - zscaler-help: Enforce Firewall Control and Enable IPS Control are set in the Add Sublocation window.
  - api-specs: `ofwEnabled` is marked as applying to top-level locations only (TOP).
  - api-specs: `ipsControl` is likewise marked top-level only (TOP).
  Impact: An agent or script that sets `ofwEnabled` on a sublocation through the API may be writing a value that is ignored or overridden, and a legacy note that sublocations carry their own firewall flag is not safe to repeat.

Not known (open gaps):
- Whether a new sublocation starts from the parent's settings [gap:zia.locations.inheritance:inherit-everything]: settled by lab-test or tenant-data
- Where a sublocation's firewall enablement comes from [gap:zia.locations.inheritance:sublocation-firewall-source]: settled by lab-test or tenant-data. Blocks: stating whether a location-scoped firewall rule can reach a sublocation's traffic

Area: zia.locations, its subjects in references/_meta/spine/zia/zia.locations.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.authentication.location-enforcement.md (Requiring authentication per location and sublocation): Enforce Authentication is a per-sublocation setting, which is what lets a corporate sublocation authenticate while a guest sublocation under the same tunnel does not. [zia.locations.inheritance:sublocation-auth-per-sublocation]
- interacts-with references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user): A sublocation does not inherit its parent's IP Surrogate setting; it is configured on the sublocation separately, and its Idle Time to Disassociation and known-browser options are set there. [zia.locations.inheritance:surrogate-not-inherited]
- interacts-with references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control): The OpenAPI schema marks `ofwEnabled` (Enable Firewall), `ipsControl`, `xffForwardEnabled`, `ports`, `vpnCredentials`, `ipv6Enabled` and `ipv6Dns64Prefix` as applying to top-level locations only. For a sublocation `xffForwardEnabled` is read-only and inherited from the parent. [zia.locations.inheritance:parent-only-fields]
- reached-via references/_meta/text/zia/zia.private-service-edge.location-binding.md (Binding a Private Service Edge cluster to a Location, and the open-proxy hazard), from zia.locations: Adding a location to a Private Service Edge cluster allows transaction logs to be viewed, categorized and reported per cluster, lets the organization manage authentication settings, IP Surrogacy settings, XFF consumption and Location group settings for SSL inspection and web filtering policies, and maps traffic and enforcement in a NAT environment. [zia.private-service-edge.location-binding:location-benefits]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding), from zia.locations: A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.locations: When Zscaler Client Connector traffic matches none of a location's listed IP addresses, the location is tagged as Road Warrior in the logs. [zia.locations.model:road-warrior]
- links-to references/_meta/text/zia/zia.locations.sublocations.md (Sublocations: what they are, the auto-created other sublocations, naming and limits)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/sublocations.md (config type)
- configured-via references/_meta/text/types/zia/locations.md (config type)
- see-also references/_meta/text/zia/zia.locations.ip-scoping.md (Which IP addresses a sublocation matches, overlap rules and XFF)
- see-also references/_meta/text/zia/zia.locations.md (ZIA locations, sublocations and location groups)
