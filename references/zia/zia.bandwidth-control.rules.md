A rule ties bandwidth classes to enforcement terms. {{rule-terms}} The terms themselves, and how minimum and maximum behave, are in [[zia.bandwidth-control.allocation]].

**Does the rule apply to this traffic?** {{criteria-expression}} A rule with a location the traffic does not come from, or a time window that has closed, does not apply however well its class matches. Also check that the location is in scope at all: [[zia.bandwidth-control.location-scope]].

**Order.** {{ascending-order}} {{order-is-priority}} Do not assume URL Filtering's first-match-wins model ([[zia.url-filtering.rule-order]]) carries over: Bandwidth Control hands out bandwidth rule by rule, and the gap below records what is not known when a class sits in two rules. The default rule's fixed last position is in [[zia.bandwidth-control.default-rule]].

**Disabled rules and rank.** {{disabled-holds-slot}} {{admin-rank}} Provider reorder and rank behavior for bandwidth rules is in [[zia.terraform.rule-order.registry]]; do not rederive it here.

What to check when a rule seems inert: state, the location and time criteria, whether another rule references the same class earlier, and the location toggle.
