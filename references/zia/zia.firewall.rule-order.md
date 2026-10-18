Order and rank are described per policy. IPS and NAT Control state their order; how Firewall Filtering orders and ranks rules is open {{gap:filtering-first-match}}.

**IPS Control.** {{ips-ascending-order}} {{rank-bounds-order}} {{ips-allow-rules-need-precedence}} The default rule is in [[zia.firewall.ips]]. {{ips-views}}

**NAT Control.** {{nat-order-nth}} Rule details are in [[zia.firewall.nat]].

**Firewall Filtering.** URL Filtering's documented behavior is in [[zia.url-filtering.rule-order]].

**Predefined rules.** {{predefined-rules-protected}} Other Terraform ordering and delete behavior is in [[zia.terraform.rule-order]] and [[zia.terraform.delete-detach]].
