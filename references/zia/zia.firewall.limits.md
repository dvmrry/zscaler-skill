Capacity figures for the firewall come from the product's limits table, and the Terraform provider applies different numbers of its own {{divergence:time-window-cap}}.

**Rule counts.** {{filtering-rule-cap}} {{nat-and-ips-rule-caps}} How NAT rules count against the Filtering row is open [[zia.firewall.nat:dnat-count-bucket]]. Other policies' caps are in [[zia.url-filtering]], [[zia.ssl-inspection]] and [[zia.dns-control]].

**Per-rule criteria.** {{per-rule-identity-caps}} {{per-rule-address-caps}}

**Groups and signatures.** {{dest-group-org-caps}} The per-group FQDN limit, 100 by default, is in [[zia.firewall.destination-groups]], and the service count in [[zia.firewall.network-services]]. {{custom-ips-caps}}

**What the provider enforces.** {{provider-caps}} The places it differs from the product table are {{divergence:time-window-cap}} and {{divergence:workload-group-cap}}. The other provider behavior is in [[zia.terraform.field-fidelity]].
