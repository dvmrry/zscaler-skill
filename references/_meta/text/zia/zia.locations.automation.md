# Locations through the API, SDK, Terraform and Ansible (zia.locations.automation)
Also called: zia_location_management; location bulk delete; location api; locations terraform import; ansible location; sub_loc terraform; profile values; description 1024; sublocation data source

**API.** Bulk deletion takes at most 100 location IDs per request, and the response returns the IDs that were deleted; the Python SDK rejects a larger list before sending. [zia.locations.automation:bulk-delete-100] A location or sublocation description cannot exceed 1,024 characters. [zia.locations.automation:description-1024]

**Terraform.** Terraform manages locations and sublocations with one resource, `zia_location_management`; a sublocation is the same resource with `parent_id` set, and `other_sub_location` and `other6_sub_location` flag the auto-created catch-alls. Import takes the location ID or name. [zia.locations.automation:tf-one-resource] The Terraform `zia_location_management` data source also finds sublocations, and `parent_name` lets a lookup span parents when names repeat. [zia.locations.automation:tf-sublocation-search] The data source also drops group arrays: [What ZIA Terraform data sources return, drop, or get wrong](kb:zia.terraform.data-source-fidelity). Group-related arguments: [How locations land in groups: location type, defaults, exclusion flags and Terraform support](kb:zia.locations.group-assignment).

**Ansible.** Terraform lists `profile` values NONE, CORPORATE, SERVER, GUESTWIFI, IOT and WORKLOAD; the Ansible module lists NONE, CORPORATE, SERVER, GUESTWIFI, IOT and EXTRANET. [zia.locations.automation:profile-values] The Ansible module takes `extranet`, `extranet_dns`, `extranet_ip_pool`, `default_extranet_dns` and `default_extranet_ts_pool` only when `profile` is EXTRANET; they assign the location's extranet resource, DNS server configuration and traffic selector IP pool. [zia.locations.automation:ansible-extranet-fields] The module's sublocation lookup goes through the parent: [Sublocations: what they are, the auto-created other sublocations, naming and limits](kb:zia.locations.sublocations).

SDK lookup defects that return "not found" on errors are in [ZIA Go SDK service functions that return wrong results, mutate inputs, or reject valid input](kb:zia.sdk-go.service-defects); do not repeat that diagnosis here.

Sources disagree (name both sides):
- Terraform and Ansible list different `profile` values for a location: WORKLOAD only in Terraform, EXTRANET only in Ansible. [divergence:zia.locations.automation:profile-choices]
  - tf-zia: WORKLOAD is a supported profile; EXTRANET is not listed.
  - ansible-zia: EXTRANET is a supported profile; WORKLOAD is not listed.
  Impact: A tool cannot set a Workload profile through Ansible or an Extranet profile through the documented Terraform list,.

Not known (open gaps):
- How Extranet locations behave beyond group scoping [gap:zia.locations.automation:extranet-locations-depth]: settled by lab-test

Area: zia.locations, its subjects in references/_meta/spine/zia/zia.locations.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zia/zia.private-service-edge.location-binding.md (Binding a Private Service Edge cluster to a Location, and the open-proxy hazard), from zia.locations: Adding a location to a Private Service Edge cluster allows transaction logs to be viewed, categorized and reported per cluster, lets the organization manage authentication settings, IP Surrogacy settings, XFF consumption and Location group settings for SSL inspection and web filtering policies, and maps traffic and enforcement in a NAT environment. [zia.private-service-edge.location-binding:location-benefits]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding), from zia.locations: A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.locations: When Zscaler Client Connector traffic matches none of a location's listed IP addresses, the location is tagged as Road Warrior in the logs. [zia.locations.model:road-warrior]
- links-to references/_meta/text/zia/zia.locations.group-assignment.md (How locations land in groups: location type, defaults, exclusion flags and Terraform support)
- links-to references/_meta/text/zia/zia.locations.sublocations.md (Sublocations: what they are, the auto-created other sublocations, naming and limits)
- links-to references/_meta/text/zia/zia.sdk-go.service-defects.md (ZIA Go SDK service functions that return wrong results, mutate inputs, or reject valid input)
- links-to references/_meta/text/zia/zia.terraform.data-source-fidelity.md (What ZIA Terraform data sources return, drop, or get wrong)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/locations.md (config type)
- configured-via references/_meta/text/types/zia/sublocations.md (config type)
- configured-via references/_meta/text/types/zia/locations-lite.md (config type)
- configured-via references/_meta/text/types/zia/location-groups.md (config type)
- see-also references/_meta/text/zia/zia.locations.md (ZIA locations, sublocations and location groups)
- see-also references/_meta/text/zia/zia.terraform.field-fidelity.md (ZIA Terraform resource fields that are not sent, not read back, or sent wrongly)
