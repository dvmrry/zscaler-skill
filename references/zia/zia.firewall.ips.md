IPS Control is the signature half of Firewall Control. {{signature-detection}} {{protocol-coverage}} IPS Control requires Advanced Firewall ([[zia.firewall.licensing:ips-needs-advanced]]). {{per-location}} Forwarding through Z-Tunnel 1.0 or PAC needs the firewall option enabled first: see [[zia.firewall.traffic-path]].

**The default rule.** {{default-blocks-all}} {{recommended-policy-view}} Rule order is in [[zia.firewall.rule-order]].

**ATP and IPS.** {{atp-first}} Whether an ATP block appears in the IPS logs is open {{gap:atp-preempt-in-ips-logs}}.

**Custom signatures.** {{custom-signatures}} {{signature-needs-sid}} {{mcp-signature-tools}} {{create-validates-update-does-not}} The relevant caps are in [[zia.firewall.limits]]. {{two-resources}} The actions an IPS rule can take are in [[zia.firewall.actions]].

**Logs.** {{logging}}
