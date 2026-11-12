# ZIA locations, sublocations and location groups (zia.locations)
Also called: locations; sublocations; location groups; which location policy applies; location management

"Which policy applies to this traffic's location?" needs more than the location's name. A location identifies a network the service recognizes by its settings, it can be split into sublocations that match by IP, and rules reach both directly and through groups. Work down this list; the parent [ZIA Firewall Control](kb:zia.firewall) and rule subjects are linked at the end.

1. **What is the location, and what does the service do with it?** Known locations are processed by their settings; anything else is remote-user traffic: [What a ZIA location is and what the console enforces for it](kb:zia.locations.model).
2. **Is the traffic in a sublocation?** Matching is by the IP inside the tunnel or the XFF address, sublocations cannot overlap, and unmatched traffic falls to `other`: [Sublocations: what they are, the auto-created other sublocations, naming and limits](kb:zia.locations.sublocations), [Which IP addresses a sublocation matches, overlap rules and XFF](kb:zia.locations.ip-scoping).
3. **Which settings does the sublocation have of its own?** Some are parent-only in the API, and the console and API disagree on firewall: [Which location settings a sublocation has of its own and which it takes from the parent](kb:zia.locations.inheritance). Bandwidth has its own modes: [How a location and its sublocations share bandwidth limits](kb:zia.locations.bandwidth).
4. **Which groups is it in?** Location type, defaults and exclusion flags decide this at creation, and dynamic groups change it later: [Location groups: manual and dynamic, conditions, limits, predefined groups](kb:zia.locations.groups), [How locations land in groups: location type, defaults, exclusion flags and Terraform support](kb:zia.locations.group-assignment).
5. **Which rules reach it?** Rules take locations and groups: [Which policies scope by location and location group](kb:zia.locations.rule-scoping). Per-module effects are in [ZIA URL Filtering](kb:zia.url-filtering), [ZIA SSL/TLS inspection](kb:zia.ssl-inspection), [ZIA Cloud App Control](kb:zia.cloud-app-control), [ZIA Firewall Control](kb:zia.firewall) and [ZIA Data Loss Prevention](kb:zia.dlp).

Workload sublocations on AWS have scopes and different overlap rules: [AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace)](kb:zia.locations.workload-scopes). Country and time zone values, including the `THE_` prefix: [Location country and time zone values, THE_ prefix and Terraform validation](kb:zia.locations.country-timezone). Writing locations through the API, Terraform or Ansible, including lookups that miss sublocations: [Locations through the API, SDK, Terraform and Ansible](kb:zia.locations.automation), [ZIA Go SDK service functions that return wrong results, mutate inputs, or reject valid input](kb:zia.sdk-go.service-defects), [What ZIA Terraform data sources return, drop, or get wrong](kb:zia.terraform.data-source-fidelity). Bulk changes through the console's CSV import: [Bulk location and sublocation changes by CSV: row types, field rules, export and limits](kb:zia.locations.csv-import).

Area: zia.locations, its subjects in references/_meta/spine/zia/zia.locations.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control)
- reached-via references/_meta/text/zia/zia.private-service-edge.location-binding.md (Binding a Private Service Edge cluster to a Location, and the open-proxy hazard): Adding a location to a Private Service Edge cluster allows transaction logs to be viewed, categorized and reported per cluster, lets the organization manage authentication settings, IP Surrogacy settings, XFF consumption and Location group settings for SSL inspection and web filtering policies, and maps traffic and enforcement in a NAT environment. [zia.private-service-edge.location-binding:location-benefits]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment): A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings): A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding): A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)): When Zscaler Client Connector traffic matches none of a location's listed IP addresses, the location is tagged as Road Warrior in the logs. [zia.locations.model:road-warrior]
- links-to references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control)
- links-to references/_meta/text/zia/zia.dlp.md (ZIA Data Loss Prevention)
- links-to references/_meta/text/zia/zia.locations.automation.md (Locations through the API, SDK, Terraform and Ansible)
- links-to references/_meta/text/zia/zia.locations.bandwidth.md (How a location and its sublocations share bandwidth limits)
- links-to references/_meta/text/zia/zia.locations.country-timezone.md (Location country and time zone values, THE_ prefix and Terraform validation)
- links-to references/_meta/text/zia/zia.locations.csv-import.md (Bulk location and sublocation changes by CSV: row types, field rules, export and limits)
- links-to references/_meta/text/zia/zia.locations.group-assignment.md (How locations land in groups: location type, defaults, exclusion flags and Terraform support)
- links-to references/_meta/text/zia/zia.locations.groups.md (Location groups: manual and dynamic, conditions, limits, predefined groups)
- links-to references/_meta/text/zia/zia.locations.inheritance.md (Which location settings a sublocation has of its own and which it takes from the parent)
- links-to references/_meta/text/zia/zia.locations.ip-scoping.md (Which IP addresses a sublocation matches, overlap rules and XFF)
- links-to references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it)
- links-to references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group)
- links-to references/_meta/text/zia/zia.locations.sublocations.md (Sublocations: what they are, the auto-created other sublocations, naming and limits)
- links-to references/_meta/text/zia/zia.locations.workload-scopes.md (AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace))
- links-to references/_meta/text/zia/zia.sdk-go.service-defects.md (ZIA Go SDK service functions that return wrong results, mutate inputs, or reject valid input)
- links-to references/_meta/text/zia/zia.ssl-inspection.md (ZIA SSL/TLS inspection)
- links-to references/_meta/text/zia/zia.terraform.data-source-fidelity.md (What ZIA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/locations.md (config type)
- configured-via references/_meta/text/types/zia/sublocations.md (config type)
- configured-via references/_meta/text/types/zia/location-groups.md (config type)
