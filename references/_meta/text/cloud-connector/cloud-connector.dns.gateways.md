# Cloud & Branch Connector DNS gateways: resolvers, failure behavior, predefined gateways (cloud-connector.dns.gateways)
Also called: cloud connector dns gateway; dnsGateways; ztc_dns_gateway; failureBehavior; FAIL_RET_ERR; FAIL_ALLOW_IGNORE_DNAT; LAN CTR; WAN CTR; dns gateway servfail

A DNS gateway is the redirect target a DNS policy rule can send queries to. Cloud & Branch Connector DNS gateways are a Cloud & Branch Connector feature with their own page (Zero Trust Cloud > Gateways > DNS Gateway): they redirect DNS requests received by the Connector to specific DNS servers. [cloud-connector.dns.gateways:cbc-gateways-differ] DNS gateways are meant to keep DNS highly available through primary and secondary DNS services and to meet requirements such as using a Protective DNS service. [cloud-connector.dns.gateways:benefits]

**Resolvers.** The primary and secondary DNS server are each chosen as a Custom DNS Server (an IP address, IPv4 only), the LAN Primary DNS Server, or the LAN Secondary DNS Server; the LAN choices reference DNS servers in the gateway-mode Branch Connector Configuration Template. [cloud-connector.dns.gateways:server-choices] In gateway mode, if the template dictates a WAN override the gateway uses WAN DNS resolvers; for non-gateway hardware devices the LAN DNS servers default to those configured in the forwarding interface section. [cloud-connector.dns.gateways:wan-override] Up to 255 DNS gateways can be created. [cloud-connector.dns.gateways:limit-255]

**When the resolver is unreachable.** If the DNS server is unreachable, the gateway either returns an error response (the help says SERVFAIL is returned) or forwards to the original DNS server, sending the DNS packet to the original destination IP. [cloud-connector.dns.gateways:failure-behavior] The API contract lists three `failureBehavior` values, FAIL_RET_ERR, FAIL_ALLOW_IGNORE_DNAT and FAIL_FORWARD_TO_ZTR, while the Terraform resource accepts only the first two. [cloud-connector.dns.gateways:contract-failure-values] Whether the secondary resolver is tried before the failure behavior applies is open [gap:cloud-connector.dns.gateways:failover-default-ipv6].

**Predefined and default gateways.** Zscaler predefines two gateways, disabled by default and not editable: LAN CTR (LAN Customer Trusted Resolver, from the LAN section of the branch configuration template) and WAN CTR (manually configured or DHCP-received servers from its WAN section); they apply only to hardware devices in gateway mode. [cloud-connector.dns.gateways:predefined] The default DNS gateway cannot be deleted. [cloud-connector.dns.gateways:default-undeletable]

**Resolver tokens in the API.** In the API contract the primary resolver option takes LAN_PRI_DNS_AS_PRI, LAN_SEC_DNS_AS_PRI or WAN_PRI_DNS_AS_PRI, and the secondary takes LAN_PRI_DNS_AS_SEC, LAN_SEC_DNS_AS_SEC or WAN_SEC_DNS_AS_SEC. [cloud-connector.dns.gateways:contract-option-tokens] Terraform accepts a different set for the same two members [divergence:cloud-connector.dns.gateways:option-tokens].

What to check:
1. The gateway's failure behavior: Return error response (clients see SERVFAIL) or Forward to Original DNS Server (the query goes to the IP the client originally asked).
2. Whether the configured custom resolver addresses are IPv4, the only kind the console accepts.
3. For a Terraform-managed gateway using LAN or WAN resolver slots, whether the tokens are ones the API contract lists for that slot.

Sources disagree (name both sides):
- Which tokens the primary and secondary resolver options accept. [divergence:cloud-connector.dns.gateways:option-tokens]
  - api-specs: The contract gives each slot its own three tokens: the primary takes LAN_SEC_DNS_AS_PRI for the LAN secondary server, and *_AS_SEC tokens belong to the secondary slot only.
  - tf-ztc: Terraform validates the primary option against LAN_PRI_DNS_AS_PRI, LAN_SEC_DNS_AS_SEC, WAN_PRI_DNS_AS_PRI and WAN_SEC_DNS_AS_SEC.
  - tf-ztc: Terraform validates the secondary option against the same four tokens.
  Impact: Terraform cannot express the console's LAN Secondary choice for the primary slot (LAN_SEC_DNS_AS_PRI) or LAN Primary for the secondary slot (LAN_PRI_DNS_AS_SEC), and it accepts secondary-slot tokens for the primary and the reverse, which the contract does not list.

Not known (open gaps):
- Secondary-resolver try order, default gateway configuration, IPv6 on referenced resolvers, and FAIL_FORWARD_TO_ZTR [gap:cloud-connector.dns.gateways:failover-default-ipv6]: settled by lab-test or source-read. Blocks: predicting client-visible DNS failures and configuring IPv6 resolvers

Area: cloud-connector.dns, its subjects in references/_meta/spine/cloud-connector/cloud-connector.dns.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/cloud-connector/cloud-connector.dns.policies.md (Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules), from cloud-connector.dns: DNS policies monitor and apply policy to all DNS requests and responses whatever the protocol and encryption, including UDP, TCP and DNS over HTTPS (DoH). [cloud-connector.dns.policies:scope-doh]
- interacts-with references/_meta/text/cloud-connector/cloud-connector.forwarding.criteria.md (Cloud Connector forwarding rule criteria: scope, services, sources, destinations, FQDNs), from cloud-connector.dns: Rules with wildcard domains or FQDNs need the workloads' DNS queries routed through the Cloud or Branch Connector; for HTTP/HTTPS traffic DNS is not required, but UDP and non-web traffic require it. [cloud-connector.forwarding.criteria:dns-required]
- logged-in references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them), from cloud-connector.dns: In DNS Insights logs the Response Action is always None, because the Zscaler service applies DNS policy only to requests; in the Response Rule Name column, a rule applied to the response is labeled None. [cloud-connector.logs:dns-response-none]
- depends-on references/_meta/text/cloud-connector/cloud-connector.sdwan.device-modes.md (Zero Trust SD-WAN devices: gateway and one-arm modes, zero touch provisioning): In gateway mode, if the template dictates a WAN override the gateway uses WAN DNS resolvers; for non-gateway hardware devices the LAN DNS servers default to those configured in the forwarding interface section. [cloud-connector.dns.gateways:wan-override]
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from cloud-connector.dns: The help names DNS conditions such as users, groups or departments, client locations, categorization of domains and IP addresses, DNS record types, and the location of resolved IP addresses. [cloud-connector.dns.policies:conditions]
- logged-in references/_meta/text/types/ztw/dns-log.md (Cloud & Branch Connector DNS log (NSS feed)), from cloud-connector.dns: In DNS Insights logs the Response Action is always None, because the Zscaler service applies DNS policy only to requests; in the Response Rule Name column, a rule applied to the response is labeled None. [cloud-connector.logs:dns-response-none]
