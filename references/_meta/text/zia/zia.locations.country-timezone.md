# Location country and time zone values, THE_ prefix and Terraform validation (zia.locations.country-timezone)
Also called: THE_NETHERLANDS; tz enum; country enum; timezone prefix; location tz drift; NETHERLANDS_EUROPE_AMSTERDAM; terraform tz validation

A location's `country` and `tz` have been read and written in different forms.

**Write enum.** The Terraform provider's validator enum, kept in its source, writes the Netherlands as `THE_NETHERLANDS` for country and `THE_NETHERLANDS_EUROPE_AMSTERDAM` for time zone, while Netherlands Antilles values (`NETHERLANDS_ANTILLES`, `NETHERLANDS_ANTILLES_AMERICA_CURACAO`) are unprefixed. [zia.locations.country-timezone:validator-enum-prefixed] The `THE_` prefix is applied to country names that carry the English article, not to every country; other such names were not checked. [zia.locations.country-timezone:prefix-is-selective]

**What changed.** Terraform 4.7.18 (April 17, 2026) removed `country` and `tz` validation from `zia_location_management` "to align with recent API changes"; the schema entries that used the validating helpers are commented out in the source and both attributes are now plain optional strings, so the provider no longer validates either value. [zia.locations.country-timezone:validators-removed] The Python SDK's location model copies `tz` and `country` from its input config and into the request unchanged. [zia.locations.country-timezone:python-sdk-passes-through]

**What to do.** Before 4.7.18 the provider validated `country` and `tz`, so a value outside its validator enum was rejected by the provider; from 4.7.18 the provider validates neither, so a rejected write comes from the ZIA API itself. [zia.locations.country-timezone:check-which-layer-rejects] Field-level Terraform drift is in [ZIA Terraform resource fields that are not sent, not read back, or sent wrongly](kb:zia.terraform.field-fidelity).

What to check:
1. Whether a value read from the API is in the form the API accepts on write, before treating the difference as a provider bug.

Inferred, not quoted (say so when an answer rests on one):
- [zia.locations.country-timezone:prefix-is-selective] Tier B: Derived from one country's prefixed values against its unprefixed neighbor; the full list was not audited.
- [zia.locations.country-timezone:check-which-layer-rejects] Tier B: Derived from the removal of the validating helpers (validators-removed) and the enum lookup in the provider's validator source (validator-enum-prefixed). That the rejection came at plan time, before any call to the API, rests on Terraform running a schema's ValidateDiagFunc while validating the configuration, which is terraform-plugin-sdk behavior no registered source states. The API's error text was not captured, so which form it asks for is unknown.

Not known (open gaps):
- Whether the API now returns country and time zone without the THE_ prefix [gap:zia.locations.country-timezone:read-form] (data gap): filled by iac or operator; settled by tenant-data or lab-test
- Which form of country and tz the write API accepts today [gap:zia.locations.country-timezone:write-form-today]: settled by lab-test. Blocks: advising whether Python-read to Terraform-apply pipelines need value normalization

Area: zia.locations, its subjects in references/_meta/spine/zia/zia.locations.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zia/zia.private-service-edge.location-binding.md (Binding a Private Service Edge cluster to a Location, and the open-proxy hazard), from zia.locations: Adding a location to a Private Service Edge cluster allows transaction logs to be viewed, categorized and reported per cluster, lets the organization manage authentication settings, IP Surrogacy settings, XFF consumption and Location group settings for SSL inspection and web filtering policies, and maps traffic and enforcement in a NAT environment. [zia.private-service-edge.location-binding:location-benefits]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings), from zia.locations: A location associates a VPN credential, static IP address and GRE tunnel, Virtual Service Edges, and upload/download bandwidth limits, and enables per-location features: firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic. [zia.locations.model:what-a-location-holds]
- reached-via references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding), from zia.locations: A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.locations: When Zscaler Client Connector traffic matches none of a location's listed IP addresses, the location is tagged as Road Warrior in the logs. [zia.locations.model:road-warrior]
- links-to references/_meta/text/zia/zia.terraform.field-fidelity.md (ZIA Terraform resource fields that are not sent, not read back, or sent wrongly)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/locations.md (config type)
- see-also references/_meta/text/zia/zia.locations.automation.md (Locations through the API, SDK, Terraform and Ansible)
- see-also references/_meta/text/zia/zia.locations.md (ZIA locations, sublocations and location groups)
