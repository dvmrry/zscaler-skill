The firewall comes in a standard and an Advanced tier, and the difference shows up in what a rule can match, not only in how many rules fit. {{identity-and-apps-need-advanced}} {{ips-needs-advanced}}

A standard-tier tenant can still write firewall rules, but they are scoped by address, port and the other criteria the sources do not restrict. "Allow the finance team to reach ERP" becomes an address-range rule, which drifts as address pools change. Whether a particular other criterion (location, network service, time) is available on the standard tier is not stated, so do not assume either way; see the gap.

Advanced Firewall also raises numeric limits. The rule cap and the FQDN-per-group cap both differ by tier: [[zia.firewall.limits]].

What to check: when a rule cannot be created with a user, group, department or network application, or an IPS rule cannot be created at all, check the license before looking at the rule. This subject records what the captures say about the tiers; the console and API behavior when a standard-tier tenant submits such a rule is not documented.
