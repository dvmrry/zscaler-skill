# ZIA Bandwidth Control (zia.bandwidth-control)
Also called: bandwidth control; bandwidth control rule; bandwidth shaping; why is my bandwidth rule not firing; zia bandwidth policy

Bandwidth Control decides how much of a location's internet bandwidth each traffic class gets. It is not an allow or block policy: a request is given full or reduced bandwidth, never refused by this module.

1. **Does the traffic reach Bandwidth Control at all?** It is the last step of the web module, after the firewall and every earlier web policy, and only certain TCP protocols are shaped: [Where Bandwidth Control sits in policy enforcement](kb:zia.bandwidth-control.pipeline-position), [How Bandwidth Control allocates bandwidth: minimum, maximum, contention](kb:zia.bandwidth-control.allocation).
2. **Is the location in scope?** Only configured locations are shaped, the location must enforce Bandwidth Control and have upload and download limits, and sublocations can share or own a slice: [Which traffic Bandwidth Control covers: locations and limits](kb:zia.bandwidth-control.location-scope).
3. **Which class is the traffic in?** Classes group URL categories, cloud applications and domains, plus the large-file, web conferencing and VoIP classes: [Bandwidth classes: what a class is and which exist](kb:zia.bandwidth-control.classes).
4. **Which rule references that class, and where is it in the order?** Criteria, order, admin rank and disabled rules: [Bandwidth Control rules: terms, order and rank](kb:zia.bandwidth-control.rules). Provider reorder and rank behavior is in [The ZIA provider's reorder registry: keys, locks and lifecycle across rule resources](kb:zia.terraform.rule-order.registry).
5. **What terms does the traffic get?** Minimum and maximum percentages are applied differently, and the minimum only matters under contention: [How Bandwidth Control allocates bandwidth: minimum, maximum, contention](kb:zia.bandwidth-control.allocation). A class no rule references lands in the default rule: [The default rule and unreferenced classes](kb:zia.bandwidth-control.default-rule).
6. **Is a cap in the way?** Rule, class and domain limits: [Bandwidth Control limits: rules, classes, domains](kb:zia.bandwidth-control.limits).

For API and Terraform work, field names, enums and provider resources are in [Bandwidth Control API, SDK and Terraform shape](kb:zia.bandwidth-control.api-surface). Firewall Control is a different module that allows or blocks flows: see [ZIA Firewall Control](kb:zia.firewall).

Area: zia.bandwidth-control, its subjects in references/_meta/spine/zia/zia.bandwidth-control.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.bandwidth-control.allocation.md (How Bandwidth Control allocates bandwidth: minimum, maximum, contention): The service distributes bandwidth rule by rule from top to bottom looking at the minimum first, then passes through each rule a second time to allocate what remains according to the maximums. [zia.bandwidth-control.allocation:two-pass]
- scoped-by references/_meta/text/zia/zia.bandwidth-control.location-scope.md (Which traffic Bandwidth Control covers: locations and limits): Bandwidth controls apply to traffic from configured locations only. They do not apply to remote users, whose traffic does not come from a configured location and whose source IP has unknown upload and download bandwidth. [zia.bandwidth-control.location-scope:known-locations-only]
- decided-by references/_meta/text/zia/zia.bandwidth-control.rules.md (Bandwidth Control rules: terms, order and rank): Bandwidth Control rules are evaluated in ascending numerical rule order, and the default rule is evaluated last. [zia.bandwidth-control.rules:ascending-order]
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path): Traffic blocked by the Firewall module or by an earlier web policy never reaches Bandwidth Control, so Bandwidth Control only shapes transactions that every earlier stage allowed. [zia.bandwidth-control.pipeline-position:only-surviving-traffic]
- depends-on references/_meta/text/zia/zia.locations.bandwidth.md (How a location and its sublocations share bandwidth limits): Bandwidth Control rules therefore shape a location's traffic only where that location enforces Bandwidth Control and has limits; with the switch off, rules and classes for that location have no effect. [zia.bandwidth-control.location-scope:toggle-gates-rules]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many): These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering): Bandwidth Control is the final entry in the ordered policy lists the web module applies to HTTP GET and POST requests, to responses, and to the domain-only pass on CONNECT or SNI. [zia.bandwidth-control.pipeline-position:last-in-web-order]
- links-to references/_meta/text/zia/zia.bandwidth-control.api-surface.md (Bandwidth Control API, SDK and Terraform shape)
- links-to references/_meta/text/zia/zia.bandwidth-control.classes.md (Bandwidth classes: what a class is and which exist)
- links-to references/_meta/text/zia/zia.bandwidth-control.default-rule.md (The default rule and unreferenced classes)
- links-to references/_meta/text/zia/zia.bandwidth-control.limits.md (Bandwidth Control limits: rules, classes, domains)
- links-to references/_meta/text/zia/zia.bandwidth-control.pipeline-position.md (Where Bandwidth Control sits in policy enforcement)
- links-to references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control)
- links-to references/_meta/text/zia/zia.terraform.rule-order.registry.md (The ZIA provider's reorder registry: keys, locks and lifecycle across rule resources)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/bandwidth-control-rules.md (config type)
- configured-via references/_meta/text/types/zia/bandwidth-classes.md (config type)
