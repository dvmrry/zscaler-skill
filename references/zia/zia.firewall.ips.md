IPS Control is the signature half of Firewall Control. {{signature-detection}} {{protocol-coverage}} It is licensed with Advanced Firewall ([[zia.firewall.licensing]]) and enabled per location. {{per-location}} Forwarding through Z-Tunnel 1.0 or PAC needs the firewall option enabled first: [[zia.firewall.traffic-path]].

**The default rule.** {{default-blocks-all}} Turning the policy on without allow rules for ordinary business traffic can block widely, so check which rules sit above the default and their ranks ([[zia.firewall.rule-order]]). Before enabling, compare against the recommended policy. {{recommended-policy-view}} What it contains is not captured.

**ATP and IPS.** {{atp-first}} An ATP block therefore decides before any IPS rule is consulted. Whether such a block is visible in the IPS logs is not stated (the old reference said it is silent); see the gap. Which engine blocked is a question for the ATP log fields, not covered here.

**Custom signatures.** {{custom-signatures}} Do not equate "Snort-like" with Snort: the old reference called Zscaler's parser a Snort subset, which no captured source says. {{signature-needs-sid}} {{mcp-signature-tools}} {{create-validates-update-does-not}} The relevant caps are in [[zia.firewall.limits]]. The two resources are easy to mix up in automation: {{two-resources}} The actions an IPS rule can take are in [[zia.firewall.actions]].

**Logs.** {{logging}}

What to check: the default rule's position and the rank of any allow rule, whether ATP is licensed (it evaluates first), and the rule name in the firewall log.
