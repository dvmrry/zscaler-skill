# How a location and its sublocations share bandwidth limits (zia.locations.bandwidth)
Also called: sublocation bandwidth; shared bandwidth; use location bandwidth; override bandwidth; up_bandwidth; dn_bandwidth; bandwidth isolation sublocation; guest wifi bandwidth

**Units.** `upBandwidth` and `dnBandwidth` are in kbps and 0 means no Bandwidth Control enforcement; the console shows Mbps. [zia.locations.bandwidth:units]

**How sublocations share.** All sublocations share the bandwidth limits of their location unless a sublocation is given a fixed bandwidth of its own. [zia.locations.bandwidth:shared-by-default] When the parent enforces bandwidth control, a sublocation is set to Use Location Bandwidth (the parent's limits), Override (its own limits, dedicated and not shared), or Disable (exempt from Bandwidth Management policies, limited to the available Shared Bandwidth). [zia.locations.bandwidth:three-modes] With Use Location Bandwidth or Disable selected, a sublocation's unused bandwidth returns to the parent's bandwidth; the Shared Bandwidth shown is the parent's bandwidth plus every sublocation using Use Location Bandwidth. [zia.locations.bandwidth:unused-returns-to-parent]

**Ordering rules.** Disabling Enforce Bandwidth Control on a location disables it on all its sublocations, but a sublocation can still be enabled with its own download and upload limits. [zia.locations.bandwidth:parent-disable-cascades] When the main location enables Bandwidth Control after its sublocations, its limits must be at least the total of its sublocations' limits; a sublocation set equal to the main location's bandwidth disables Bandwidth Control on all other sublocations. [zia.locations.bandwidth:parent-must-cover-children]

**Isolation.** A sublocation in Override mode holds dedicated bandwidth that other sublocations cannot use, so isolation within one location is possible; sublocations in the other modes share and can burst into idle bandwidth. [zia.locations.bandwidth:override-is-isolation] The older statements on isolation are recorded as unverified [gap:zia.locations.bandwidth:legacy-bandwidth-isolation].

Bandwidth Control rules themselves scope by location and group: [Which policies scope by location and location group](kb:zia.locations.rule-scoping). Rule-side allocation is in [How Bandwidth Control allocates bandwidth: minimum, maximum, contention](kb:zia.bandwidth-control.allocation).

What to check:
1. Whether the parent's mode and each sublocation's mode (Use Location Bandwidth, Override or Disable) are the ones intended.
2. Whether the parent's limit still covers the total of its sublocations' limits.

Inferred, not quoted (say so when an answer rests on one):
- [zia.locations.bandwidth:override-is-isolation] Tier B: Derived from the dedicated-versus-shared wording; contention behavior between modes was not tested.

Sources disagree (name both sides):
- Bandwidth fields are kbps in the API and SDK and bytes in the Terraform docs. [divergence:zia.locations.bandwidth:bytes-or-kbps]
  - api-specs: Download bandwidth in kbps; 0 means no enforcement.
  - tf-zia: Download bandwidth in bytes.
  Impact: A value copied from the console or an API read into Terraform, or the reverse, is off by a unit if either description is taken literally.

Not known (open gaps):
- Whether `up_bandwidth` and `dn_bandwidth` are kbps or bytes [gap:zia.locations.bandwidth:terraform-bandwidth-unit] (data gap): filled by iac or operator; settled by lab-test
- Legacy claim that bandwidth is never isolated within a location [gap:zia.locations.bandwidth:legacy-bandwidth-isolation]: settled by lab-test

Area: zia.locations, its subjects in references/_meta/spine/zia/zia.locations.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.bandwidth-control.location-scope.md (Which traffic Bandwidth Control covers: locations and limits): Bandwidth Control starts with maximum upload and download limits per location, which apply to traffic proxied to Zscaler. These limits are required before the class-based rules (the second level) can be used. [zia.bandwidth-control.location-scope:limits-per-location]
- reached-via references/_meta/text/zia/zia.private-service-edge.location-binding.md (Binding a Private Service Edge cluster to a Location, and the open-proxy hazard), from zia.locations: Adding a location to a Private Service Edge cluster allows transaction logs to be viewed, categorized and reported per cluster, lets the organization manage authentication settings, IP Surrogacy settings, XFF consumption and Location group settings for SSL inspection and web filtering policies, and maps traffic and enforcement in a NAT environment. [zia.private-service-edge.location-binding:location-benefits]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding), from zia.locations: A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.locations: When Zscaler Client Connector traffic matches none of a location's listed IP addresses, the location is tagged as Road Warrior in the logs. [zia.locations.model:road-warrior]
- links-to references/_meta/text/zia/zia.bandwidth-control.allocation.md (How Bandwidth Control allocates bandwidth: minimum, maximum, contention)
- links-to references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/locations.md (config type)
- configured-via references/_meta/text/types/zia/sublocations.md (config type)
- see-also references/_meta/text/zia/zia.locations.sublocations.md (Sublocations: what they are, the auto-created other sublocations, naming and limits)
- see-also references/_meta/text/zia/zia.locations.inheritance.md (Which location settings a sublocation has of its own and which it takes from the parent)
