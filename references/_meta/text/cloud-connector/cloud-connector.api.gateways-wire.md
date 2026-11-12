# Cloud Connector forwarding and DNS gateways on the wire: two DNS gateway models, type and subcloud fields (cloud-connector.api.gateways-wire)
Also called: ztw dnsGateways; ztw gateways api; dns_forwarding_gateway vs dns_gateway; ztw subcloud gateway; log and control gateway api

Forwarding gateways (`/gateways`, including the Log and Control gateway) and DNS gateways (`/dnsGateways`) are separate endpoints whose paths and fields are generated. The Go SDK models DNS gateways twice, and the sources disagree on a few fields.

**Two DNS gateway models.** The Go SDK has two packages and the provider two resources for the one DNS gateway endpoint, with different structs: [`ztc_dns_gateway` is implemented on the SDK's `dns_gateway` package and `ztc_dns_forwarding_gateway` on the `forwarding_gateways/dns_forwarding_gateway` package; both packages send their requests to /ztw/api/v1/dnsGateways.](kb:cloud-connector.terraform.gateways:two-resources-two-packages), [The two SDK structs differ: both carry `dnsGatewayType`, but only the `dns_forwarding_gateway` struct also has a `type` field, whose comment (repeated above `failureBehavior`, `primaryIp` and `ecDnsGatewayOptionsSecondary` too) says the supported types are ZIA and ECSELF.](kb:cloud-connector.terraform.gateways:structs-differ). The `dns_forwarding_gateway` package's `Get`, `Create` and `Update` declare an `*http.Response` result but always return nil for it, so the extra return value carries no status or headers. [cloud-connector.api.gateways-wire:dns-forwarding-gateway-nil-response]

**The type field.** The `type` values ZIA and ECSELF belong to the forwarding gateway, and the contract's DNS gateway has no `type`: [The Log and Control gateway is a forwarding gateway on the API's `/gateways` endpoint: its `type` enum is PROXYCHAIN, ZIA and ECSELF, with ECSELF described as the Log and Control gateway.](kb:cloud-connector.forwarding.log-and-control:gateway-type), [The contract's DNS gateway object (`/dnsGateways`) has no `type` member; it carries `dnsGatewayType` instead, with the values OFW_PDNS_REDIR_GW and EC_DNS_GW.](kb:cloud-connector.forwarding.log-and-control:dns-gateway-no-type). Whether the DNS gateway API needs either type field is open in [What the DNS gateway API does with a create that omits dnsGatewayType](kb:cloud-connector.terraform.gateways:dns-gateway-type-semantics).

**Resolver options.** The contract and Terraform accept different resolver option and failure-behavior tokens: [cloud-connector.dns.gateways:option-tokens](kb:cloud-connector.dns.gateways:option-tokens), [The API contract lists three `failureBehavior` values, FAIL_RET_ERR, FAIL_ALLOW_IGNORE_DNAT and FAIL_FORWARD_TO_ZTR, while the Terraform resource accepts only the first two.](kb:cloud-connector.dns.gateways:contract-failure-values).

**Subclouds.** The Go SDK calls the forwarding gateway's subcloud fields not applicable while the provider writes them: [cloud-connector.terraform.gateways:subcloud-applicability](kb:cloud-connector.terraform.gateways:subcloud-applicability), with the open question in [Whether Cloud and Branch Connector honors subclouds on a DC-proxy forwarding gateway](kb:cloud-connector.terraform.gateways:subcloud-backend).

What to check:
1. Whether Go code reads an HTTP status from the `dns_forwarding_gateway` functions' response value, which is always nil.

Area: cloud-connector.api, its subjects in references/_meta/spine/cloud-connector/cloud-connector.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.gateways.md (ZTC forwarding and DNS gateways in Terraform and the Go SDK: subclouds, manual proxies, and the two DNS gateway resources)
- links-to references/_meta/text/cloud-connector/cloud-connector.dns.gateways.md (Cloud & Branch Connector DNS gateways: resolvers, failure behavior, predefined gateways)
- links-to references/_meta/text/cloud-connector/cloud-connector.forwarding.log-and-control.md (Log and Control Forwarding: how a Connector's logs and control traffic reach the Zscaler cloud)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/ztw/forwarding-gateways.md (config type)
- configured-via references/_meta/text/types/ztw/dns-gateways.md (config type)
- see-also references/_meta/text/cloud-connector/cloud-connector.api.md (The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes)
