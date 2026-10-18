{{firewall-module}} {{scope}} Whether a URL Filtering block also affects resolution is open {{gap:url-filtering-independent}}. The web side is in [[zia.url-filtering]].

{{firewall-prereq}} {{iterative-needs-config}}

**Evaluation.** {{ascending-order}} {{disabled-skipped}} Whether a match stops evaluation is open {{gap:first-match}}. {{default-rules}} {{limits}}

{{cbc-gateways-differ}} {{cbc-has-dns-policies}} The ZIA DNS Control action that redirects to a gateway is covered in [[zia.dns-control.actions]].

- Rules Zscaler ships, including the ZPA resolvers that Source IP Anchoring depends on: [[zia.dns-control.predefined-rules]].
- What a rule can match on: [[zia.dns-control.criteria]]. What it can do, and what each API action requires: [[zia.dns-control.actions]].
- DNS over HTTPS: [[zia.dns-control.doh]]. DNS tunneling: [[zia.dns-control.tunnel-detection]]. Newly registered domains and classification delay: [[zia.dns-control.nrod]].
- The REST resource, wire keys, and client divergences: [[zia.dns-control.api-rules]]. Rule ordering through Terraform: [[zia.terraform.rule-order]].
