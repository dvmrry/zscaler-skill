# ZTC forwarding and DNS gateways in Terraform and the Go SDK: subclouds, manual proxies, and the two DNS gateway resources (cloud-connector.terraform.gateways)
Also called: ztc_forwarding_gateway subcloud; subcloud_primary; ztc manual_primary; ztc_dns_gateway vs ztc_dns_forwarding_gateway; dns_forwarding_gateway package; dnsGatewayType; ztc dns gateway type
Former IDs: cloud-connector-14, cloud-connector-15

Gateways are where traffic and DNS forwarding rules send traffic. Their arguments and enum values are generated (`node scripts/kb.mjs surface ztc_forwarding_gateway`, `ztc_dns_gateway`, `ztc_dns_forwarding_gateway`); this subject holds what the provider and SDK do with them and where their sources disagree.

## Forwarding gateways

**Proxy types.** For a forwarding gateway's primary and secondary proxy types, the provider schema describes AUTO as an automatic proxy, DC as a manual proxy through a selected data center, and MANUAL_OVERRIDE as forwarding through a specified IP address or domain; `manual_primary` and `manual_secondary` hold the data center, IP address or domain name, depending on the type. [cloud-connector.terraform.gateways:manual-override-meaning] How gateways fail over is in [Cloud Connector tunnels to Service Edges: primary, secondary, tertiary, fail-close and fail-open](kb:cloud-connector.overview.gateway-failover).

**Subclouds.** The forwarding gateway resource declares `subcloud_primary` and `subcloud_secondary` as single ID-and-name blocks for a manual (DC) proxy when the organization has subclouds, sends them in the request (`SubCloudPrimary`, `SubCloudSecondary`) and reads them back into state. [cloud-connector.terraform.gateways:provider-wires-subclouds] The SDK's own comment calls the fields not applicable to Cloud and Branch Connector [divergence:cloud-connector.terraform.gateways:subcloud-applicability], and whether the service honors them is open [gap:cloud-connector.terraform.gateways:subcloud-backend]. Subclouds in general are in [Subclouds: restricting which Service Edges handle a tenant's traffic](kb:shared.subclouds). A `fail_closed = false` cannot be sent on update: [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes).

## DNS gateways

**Two resources, two packages, one endpoint.** `ztc_dns_gateway` is implemented on the SDK's `dns_gateway` package and `ztc_dns_forwarding_gateway` on the `forwarding_gateways/dns_forwarding_gateway` package; both packages send their requests to /ztw/api/v1/dnsGateways. [cloud-connector.terraform.gateways:two-resources-two-packages] The two SDK structs differ: both carry `dnsGatewayType`, but only the `dns_forwarding_gateway` struct also has a `type` field, whose comment (repeated above `failureBehavior`, `primaryIp` and `ecDnsGatewayOptionsSecondary` too) says the supported types are ZIA and ECSELF. [cloud-connector.terraform.gateways:structs-differ] The `ztc_dns_forwarding_gateway` request builder sets only the ID, name, failure behavior, primary and secondary IPs and the two Edge Connector DNS options; it sets neither `Type` nor `DNSGatewayType`. The `ztc_dns_gateway` builder sets `DNSGatewayType` from `dns_gateway_type`. [cloud-connector.terraform.gateways:forwarding-resource-sends-no-type] So a DNS gateway created or updated through `ztc_dns_forwarding_gateway` is sent with no `type` and no `dnsGatewayType` key, because both fields are empty and tagged `omitempty`. [cloud-connector.terraform.gateways:forwarding-resource-omits-type-keys] In the API contract the DNS gateway create body has no `type` member and no required members, and its `dnsGatewayType` takes `OFW_PDNS_REDIR_GW` or `EC_DNS_GW`. [cloud-connector.terraform.gateways:contract-dns-gateway-shape] What the API does with a create that carries no type is open [gap:cloud-connector.terraform.gateways:dns-gateway-type-semantics]. The extra response value the `dns_forwarding_gateway` functions declare is always nil: [Cloud Connector forwarding and DNS gateways on the wire: two DNS gateway models, type and subcloud fields](kb:cloud-connector.api.gateways-wire).

**Server choices.** In the console each of the Primary DNS Server and Secondary DNS Server settings is one drop-down choice: a custom DNS server (an IPv4 address) or a LAN primary or secondary DNS server reference. [cloud-connector.terraform.gateways:console-one-choice-per-slot] Neither DNS gateway resource checks at plan time that a slot is given only one of a custom IP (`primary_ip`, `secondary_ip`) and an Edge Connector DNS option (`ec_dns_gateway_options_primary`, `ec_dns_gateway_options_secondary`); a configuration setting both is sent to the API as written. [cloud-connector.terraform.gateways:no-plan-time-conflict-check]

What to check:
1. Which DNS gateway resource manages the object; ztc_dns_gateway sends dns_gateway_type, ztc_dns_forwarding_gateway sends no type at all.
2. Before relying on subcloud_primary or subcloud_secondary, read the gateway back from the API and confirm the subcloud stuck and is used for DC proxy selection.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.terraform.gateways:forwarding-resource-omits-type-keys] Tier B: Follows from the `dns_forwarding_gateway` package sending the struct through `CreateResource` on create and `UpdateWithPutResource` on update (quoted), which marshal the caller's struct (ztw-writes-marshal-caller-struct), and from Go's encoding/json omitempty handling of empty strings: both fields are plain strings, and the package defines no MarshalJSON. Not run against the API.
- [cloud-connector.terraform.gateways:no-plan-time-conflict-check] Tier B: Absence: both resource files were searched at the pin for ConflictsWith, ExactlyOneOf and CustomizeDiff; none found. The legacy doc called the two modes mutually exclusive; no source says how the API treats both being set.

Sources disagree (name both sides):
- The SDK's forwarding gateway struct calls the subcloud fields not applicable to Cloud and Branch Connector; the ZTC provider schema documents them for DC proxies and sends them, and the API contract carries them without an applicability note. [divergence:cloud-connector.terraform.gateways:subcloud-applicability]
  - sdk-go: SubCloudPrimary and SubCloudSecondary are not applicable to Cloud & Branch Connector.
  - tf-ztc: With a manual (DC) proxy and subclouds associated with the organization, a subcloud can be specified for the selected data center.
  - api-specs: The forwarding gateway create body carries subcloudPrimary and subcloudSecondary as entity references, with no note that they do not apply.
  Impact: An operator cannot tell from the sources whether setting a subcloud on a Cloud Connector gateway changes DC proxy selection or is ignored.

Not known (open gaps):
- Whether Cloud and Branch Connector honors subclouds on a DC-proxy forwarding gateway [gap:cloud-connector.terraform.gateways:subcloud-backend]: settled by lab-test. Blocks: Whether subcloud_primary and subcloud_secondary steer DC proxy selection for Cloud Connector traffic.
- What the DNS gateway API does with a create that omits dnsGatewayType [gap:cloud-connector.terraform.gateways:dns-gateway-type-semantics]: settled by lab-test or code-read. Blocks: Whether ztc_dns_gateway and ztc_dns_forwarding_gateway create the same kind of object, and whether either is canonical.

Area: cloud-connector.terraform, its subjects in references/_meta/spine/cloud-connector/cloud-connector.terraform.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/shared/shared.subclouds.md (Subclouds: restricting which Service Edges handle a tenant's traffic): The forwarding gateway resource declares `subcloud_primary` and `subcloud_secondary` as single ID-and-name blocks for a manual (DC) proxy when the organization has subclouds, sends them in the request (`SubCloudPrimary`, `SubCloudSecondary`) and reads them back into state. [cloud-connector.terraform.gateways:provider-wires-subclouds]
- links-to references/_meta/text/cloud-connector/cloud-connector.api.gateways-wire.md (Cloud Connector forwarding and DNS gateways on the wire: two DNS gateway models, type and subcloud fields)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.gateway-failover.md (Cloud Connector tunnels to Service Edges: primary, secondary, tertiary, fail-close and fail-open)
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/ztw/forwarding-gateways.md (config type)
- configured-via references/_meta/text/types/ztw/dns-gateways.md (config type)
- see-also references/_meta/text/cloud-connector/cloud-connector.terraform.provider-behavior.md (ZTC Terraform provider: configuration, field handling and read behavior)
