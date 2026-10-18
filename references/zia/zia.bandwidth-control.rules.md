A rule ties bandwidth classes to enforcement terms. {{rule-terms}} The terms themselves, and how minimum and maximum behave, are in [[zia.bandwidth-control.allocation]].

**Does the rule apply to this traffic?** {{criteria-expression}} Location scope is covered in [[zia.bandwidth-control.location-scope]].

**Order.** {{ascending-order}} {{order-is-priority}} Whether the order matches the first-match-wins model of [[zia.url-filtering.rule-order]] is open {{gap:multi-rule-class}}. The default rule's fixed last position is in [[zia.bandwidth-control.default-rule]].

**Disabled rules and rank.** {{disabled-holds-slot}} {{admin-rank}} Provider reorder and rank behavior for bandwidth rules is in [[zia.terraform.rule-order.registry]].
