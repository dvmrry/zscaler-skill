DNS Control is its own rule module of Zscaler Firewall. {{firewall-module}} {{scope}} Whether a URL Filtering block also affects resolution is untested (gap `url-filtering-independent`); see [[zia.url-filtering]] for the web side and plan both modules when a domain must be unreachable at both layers.

When someone says DNS Control rules are not firing, check the prerequisites before the rules. {{firewall-prereq}} A rule list that looks correct tells you nothing about whether the location sends DNS through the firewall; check the location's firewall setting first. Whether the client's DNS reaches Zscaler at all is also a precondition, and {{iterative-needs-config}}

Evaluation: {{ascending-order}} {{disabled-skipped}} Whether a match stops evaluation is not stated; see the open gap `first-match`. {{default-rules}} {{limits}}

If an operator says "DNS gateway", ask which product they mean. {{cbc-gateways-differ}} Cloud & Branch Connector also has its own rule engine: {{cbc-has-dns-policies}} The ZIA DNS Control action that redirects to a gateway is covered in [[zia.dns-control.actions]].

The rest of the area, one question each:

- Rules Zscaler ships, including the ZPA resolvers that Source IP Anchoring depends on: [[zia.dns-control.predefined-rules]].
- What a rule can match on: [[zia.dns-control.criteria]]. What it can do, and what each API action requires: [[zia.dns-control.actions]].
- DNS over HTTPS: [[zia.dns-control.doh]]. DNS tunneling: [[zia.dns-control.tunnel-detection]]. Newly registered domains and classification delay: [[zia.dns-control.nrod]].
- The REST resource, wire keys, and client divergences: [[zia.dns-control.api-rules]]. Rule ordering through Terraform: [[zia.terraform.rule-order]].
