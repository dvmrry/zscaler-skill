# Terraform GRE tunnel, static IP, VPN credential and location resources (zia.terraform.traffic-forwarding-resources)
Also called: zia_traffic_forwarding_gre_tunnel; zia_traffic_forwarding_static_ip geo_override; Missing geo Coordinates; zia_location_management ip_addresses vpn_credentials; sub-location parent_id terraform

These resources build the egress path a location uses to reach Zscaler. If `primary_dest_vip` and `secondary_dest_vip` are not set, the provider queries the Zscaler cloud for the GRE tunnel's primary and secondary destination datacenter and VIP; the blocks can override this. [zia.terraform.traffic-forwarding-resources:gre-vips-auto-selected] Within a destination VIP block only one of `datacenter` and `virtual_ip` is required; given a datacenter name such as YVR1 the provider selects the available VIP. [zia.terraform.traffic-forwarding-resources:gre-vip-one-attribute]

**Static IPs.** `latitude` and `longitude` on a static IP are optional and computed; when not provided the API determines them from the IP address. [zia.terraform.traffic-forwarding-resources:static-ip-coordinates-optional] The provider describes `geo_override` as: if not set, coordinates and city are determined from the IP address; otherwise the latitude and longitude must be provided. [zia.terraform.traffic-forwarding-resources:static-ip-geo-override-wording] Since provider v4.6.2 the static IP resource determines coordinates automatically when `geo_override = true` but none are given, which removed the "Missing geo Coordinates" API error. [zia.terraform.traffic-forwarding-resources:static-ip-v4-6-2-auto-coordinates] How coordinate discovery writes: [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes).

**VPN credentials.** The `pre_shared_key` is omitted from the output for security reasons. [zia.terraform.traffic-forwarding-resources:vpn-credential-psk-omitted] What the credential types are: [VPN credentials for IPSec: types, immutability and keys](kb:zia.traffic-forwarding.vpn-credentials).

**Locations.** The provider documents `ip_addresses` as required if `vpn_credentials` are not defined and `vpn_credentials` as required if `ip_addresses` are not defined; the schema marks both Optional and declares no cross-field constraint on them. [zia.terraform.traffic-forwarding-resources:location-ip-or-vpn] Creating a sub-location (a non-zero `parent_id`) fails when `ip_addresses` is empty. [zia.terraform.traffic-forwarding-resources:sub-location-needs-ips] Dynamic location group handling: [How locations land in groups: location type, defaults, exclusion flags and Terraform support](kb:zia.locations.group-assignment).

What to check:
1. Whether a static IP with `geo_override = true` supplies coordinates or leaves them to the API.
2. Whether a location carries IP addresses or VPN credentials, and for a sub-location IP addresses.

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.locations.group-assignment.md (How locations land in groups: location type, defaults, exclusion flags and Terraform support)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)
- links-to references/_meta/text/zia/zia.traffic-forwarding.vpn-credentials.md (VPN credentials for IPSec: types, immutability and keys)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.locations.sublocations.md (Sublocations: what they are, the auto-created other sublocations, naming and limits)
