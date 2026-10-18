Forwarding Control decides where matching traffic is forwarded. {{overview}} Questions about it come in four shapes.

1. **What does the rule do with matching traffic?** The forward method decides, and each method has required and forbidden fields: [[zia.forwarding-control.methods]].
2. **Does the rule match, and in what order?** Criteria, limits and ordering: [[zia.forwarding-control.rules]]. Rules Zscaler ships, and what Terraform will not touch: [[zia.forwarding-control.predefined-rules]].
3. **Is it Source IP Anchoring?** The ZIA side is a Private Access gateway ([[zia.forwarding-control.zpa-gateway]]) plus a forwarding rule; the Private Access side and the DNS side are in [[zia.forwarding-control.sipa]] and [[zia.dns-control.predefined-rules]]. When ZIA is in disaster recovery: [[zia.forwarding-control.sipa-direct]].
4. **Is it Terraform?** The ZPA delay and retry, and the provider's handling of Forwarding Control objects: [[zia.forwarding-control.terraform]]. Selectors the provider never sends: [[zia.terraform.field-fidelity]].

Two neighbours are easy to confuse with Source IP Anchoring: customer-owned Dedicated IP addresses ([[zia.forwarding-control.byoip]]) and dedicated proxy ports ([[zia.forwarding-control.proxy-ports]]). The Z-Tunnel 1.0 and PAC firewall gate that also applies to Road Warrior forwarding rules is in [[zia.firewall.traffic-path]].

Where Forwarding Control sits relative to the other modules is open {{gap:pipeline-position}} for the general case; for Source IP Anchoring the inspection-before-hand-off statement is in [[zia.forwarding-control.sipa]]. Surrogate IP is covered in the legacy [Source IP Anchoring reference](../shared/source-ip-anchoring.md).
