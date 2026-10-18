Rule order is the first thing to check when two firewall rules both seem to match. What the captures state differs by policy, so read the policy you are asking about.

**IPS Control.** {{ips-ascending-order}} Admin rank limits where an admin can put a rule. {{rank-bounds-order}} That is also how the shipped block-all rule is overridden: {{ips-allow-rules-need-precedence}} Details of the default rule are in [[zia.firewall.ips]]. {{ips-views}}

**NAT Control.** {{nat-order-nth}} The same capture lists each NAT rule's rank beside its order; see [[zia.firewall.nat]].

**Firewall Filtering.** The Filtering rule's order and rank fields are described only as "rule order number" and "admin rank" of the rule. No captured source says Filtering stops at the first matching rule, or how rank interacts with order for it; see the gap. URL Filtering's documented behavior, first match, disabled rules holding their slot and rank bounding order, is in [[zia.url-filtering.rule-order]]. Treat that as the likely shape for Filtering but not as established for it.

**Predefined rules.** {{predefined-rules-protected}} This is a client check, not a statement that ZIA refuses the delete; the other Terraform ordering and delete behavior is in [[zia.terraform.rule-order]] and [[zia.terraform.delete-detach]].

What to check: the rule's `order` and `rank`, whether admin ranking is on, and whether the rule you expect to win is a predefined or default rule that cannot be reordered or removed through Terraform.
