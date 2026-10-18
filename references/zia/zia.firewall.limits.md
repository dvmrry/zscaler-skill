Capacity answers for the firewall come from the vendor limits table, and the Terraform provider applies different numbers of its own, so check both.

**Rule counts.** {{filtering-rule-cap}} The 10-rule standard-tier cap is the one that bites: almost any non-trivial rule set outgrows it. {{nat-and-ips-rule-caps}} How NAT rules count against the Filtering row is a gap in [[zia.firewall.nat]]. Other policies' caps (URL Filtering, SSL Inspection, DNS Control) are covered where those policies are.

**Per-rule criteria.** {{per-rule-identity-caps}} {{per-rule-address-caps}}

**Groups and signatures.** {{dest-group-org-caps}} The per-group FQDN limit, 100 by default, is in [[zia.firewall.destination-groups]], and the service count in [[zia.firewall.network-services]]. {{custom-ips-caps}}

**What the provider enforces.** {{provider-caps}} That differs from the table in two places, which are recorded as divergences below: Terraform stops at two time windows when the product allows eight, and accepts 255 workload groups when the product allows eight. In the second case a plan is not rejected locally; no source shows how the API responds. The other provider behavior is in [[zia.terraform.field-fidelity]].

What to check: which tier the tenant is on, which cap the failing criterion hits, and whether the number comes from the product or from the provider's schema.
