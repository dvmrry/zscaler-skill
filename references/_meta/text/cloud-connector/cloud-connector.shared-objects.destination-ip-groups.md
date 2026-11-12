# Destination IP groups in Cloud & Branch Connector: types, predefined groups and forwarding limits (cloud-connector.shared-objects.destination-ip-groups)
Also called: destination ipv4 groups; destination ip groups cloud connector; wildcard domain destination group; LAN Destinations Group; WAN Destinations Group; Zscaler Domains group

Destination IP groups are the named destination sets Cloud & Branch Connector policies reference. The About page says destination IP groups simplify policy creation by grouping multiple IP addresses into one destination, and that security and forwarding policies can be configured for a group of destinations based on IP addresses and fully qualified domain names. [cloud-connector.shared-objects.destination-ip-groups:purpose] The Cloud & Branch Connector help places the Destination IP Groups page under Internet Access > Resources > IP & FQDN Groups, on the Destination IPv4 Groups tab. [cloud-connector.shared-objects.destination-ip-groups:help-page-ipv4-tab]

**Types.** A destination IP group's Type is IP Address, FQDN, Wildcard Domain or Other. [cloud-connector.shared-objects.destination-ip-groups:types] An IP Address group takes individual addresses (for example 192.0.2.1), subnets (for example 192.0.2.0/24) and address ranges (for example 192.0.2.1 - 192.0.2.5). [cloud-connector.shared-objects.destination-ip-groups:ip-formats] The FQDN type is for applications with multiple IP addresses or with IP addresses that frequently change, which can be given as fully qualified domain names. [cloud-connector.shared-objects.destination-ip-groups:fqdn-type] The Wildcard Domain type takes specific wildcard domains, or * to denote all domains; *abc.example.com and abs.*.example.com are given as invalid examples, and Zscaler cannot match invalid items. [cloud-connector.shared-objects.destination-ip-groups:wildcard-type] Whether a group can hold countries is disputed between the pages [divergence:cloud-connector.shared-objects.destination-ip-groups:countries]. What the Other type is for is open [gap:cloud-connector.shared-objects.destination-ip-groups:other-type-purpose].

**Forwarding.** Destination IP groups can be created for Wildcard Domain and Other, but these types are currently not supported in Cloud & Branch Connector forwarding policies. [cloud-connector.shared-objects.destination-ip-groups:types-not-in-forwarding] To use wildcard FQDN destination IP groups, the help says to deploy workloads, servers and endpoints to route DNS queries through the Cloud Connector or Branch Connector; if forwarding HTTP/HTTPS traffic, DNS is not required for wildcard domain and FQDN traffic, but UDP and non-web traffic requires DNS. [cloud-connector.shared-objects.destination-ip-groups:wildcard-dns-required] How these two pages fit together is open [gap:cloud-connector.shared-objects.destination-ip-groups:wildcard-forwarding]. The wildcard syntax a forwarding rule takes inline is in [Cloud Connector forwarding rule criteria: scope, services, sources, destinations, FQDNs](kb:cloud-connector.forwarding.criteria).

**Predefined groups.** Zscaler creates predefined destination groups, disabled by default and able to be enabled, shown according to the licenses enabled in the tenant: the LAN Destinations Group (all LAN directly connected networks and configured static routes from a given Branch Connector), the WAN Destinations Group (all WAN directly connected networks and DNS servers) and Zscaler Domains (all Zscaler public cloud domains: Internet & SaaS, Private Access and ZDX). They apply only to hardware devices deployed in gateway mode. [cloud-connector.shared-objects.destination-ip-groups:predefined-groups] Whether an enabled predefined group can be edited is open [gap:cloud-connector.shared-objects.destination-ip-groups:predefined-editable].

**Names and limits.** A destination IP group name may contain only alphanumeric characters, underscores, hyphens and periods; the description cannot exceed 10,240 characters; adding a group ends with saving and activating the change. [cloud-connector.shared-objects.destination-ip-groups:name-description] No per-group entry limit, per-tenant group count or IPv6 group is described [gap:cloud-connector.shared-objects.destination-ip-groups:limits-and-ipv6].

**ZIA counterpart.** ZIA's destination groups, which these pages do not describe, are in [IP destination groups](kb:zia.firewall.destination-groups); the API marks destination IP groups as an object type of both products: [Source IP groups, destination IP groups, network services and network service groups are object types of both the ZIA and the Cloud & Branch Connector APIs.](kb:cloud-connector.shared-objects:twin-types).

What to check:
1. Whether a Wildcard Domain or Other group is being used in a forwarding policy, which the help currently says is unsupported.
2. Whether a predefined group is expected on a device that is not a hardware device in gateway mode.

Sources disagree (name both sides):
- The Cloud & Branch Connector destination IP group pages disagree on whether a group can hold countries. [divergence:cloud-connector.shared-objects.destination-ip-groups:countries]
  - zscaler-help: The About page says groups can be created of destination IP addresses, countries where servers are located and URL categories.
  - zscaler-help: The Configuring page intro says destinations can be grouped by IP addresses and countries where servers are located.
  - zscaler-help: The Configuring page's Other type says countries are the only option on the tab but cannot be configured.
  Impact: Neither page says how a country-based group is made, so whether a Cloud & Branch Connector destination group can hold countries is not settled by the help; ZIA's page lets its Other type take countries (see zia.firewall.destination-groups).

Not known (open gaps):
- What the Other destination group type is for [gap:cloud-connector.shared-objects.destination-ip-groups:other-type-purpose]: settled by lab-test or support-ticket
- How the wildcard DNS conditions relate to wildcard groups being unsupported in forwarding policies [gap:cloud-connector.shared-objects.destination-ip-groups:wildcard-forwarding]: settled by lab-test or support-ticket
- Whether predefined destination groups can be edited once enabled [gap:cloud-connector.shared-objects.destination-ip-groups:predefined-editable]: settled by lab-test
- Destination group limits and IPv6 [gap:cloud-connector.shared-objects.destination-ip-groups:limits-and-ipv6]: settled by source-read or support-ticket

Area: cloud-connector.shared-objects, its subjects in references/_meta/spine/cloud-connector/cloud-connector.shared-objects.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.forwarding.criteria.md (Cloud Connector forwarding rule criteria: scope, services, sources, destinations, FQDNs)
- links-to references/_meta/text/cloud-connector/cloud-connector.shared-objects.md (Objects ZIA and Cloud & Branch Connector share: IP groups and network services)
- links-to references/_meta/text/zia/zia.firewall.destination-groups.md (IP destination groups)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.source-ip-groups.md (Cloud Connector source IP groups: what they are and what is unknown about them)
