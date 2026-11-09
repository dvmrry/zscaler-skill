# Bandwidth Control limits: rules, classes, domains (zia.bandwidth-control.limits)
Also called: bandwidth control rule limit; bandwidth class limit; 245 custom classes; 8 classes with domains; 25000 bandwidth class domains; 125 bandwidth rules

Several counts matter for Bandwidth Control. An organization can have 125 Bandwidth Control policy rules. [zia.bandwidth-control.limits:rules-125] The Ranges and Limitations table lists 125 Bandwidth Control rules per organization, against 1,000 for URL Filtering and 1,024 for all other policy rules such as DLP and IPS Control. [zia.bandwidth-control.limits:rules-lower-than-other-policies] A per-department or per-application rule design therefore reaches the cap sooner.

**Classes.** An organization can have up to 245 custom bandwidth classes. [zia.bandwidth-control.limits:custom-classes-245] The Ranges and Limitations page lists 8 predefined bandwidth classes. [zia.bandwidth-control.limits:predefined-8] A bandwidth class name can be up to 255 characters. [zia.bandwidth-control.limits:name-255] How the eight predefined classes map to the tabs and API types is in [Bandwidth Control API, SDK and Terraform shape](kb:zia.bandwidth-control.api-surface).

**Domains.** At most 8 bandwidth classes can have custom domains. This is a cap on the number of classes that use the Domains field, not on domains. [zia.bandwidth-control.limits:domain-classes-8] Up to 25,000 domains can be added across all bandwidth classes, including those from URL categories. [zia.bandwidth-control.limits:domains-25000] Bandwidth Class Domains are among the entries counted in the Custom URLs/TLDs limit (25K by default, extendable by subscription); duplicates are counted once. [zia.bandwidth-control.limits:counts-toward-custom-urls] The class Domains list shows up to 500 items per page. [zia.bandwidth-control.limits:page-500]

Whether any of these caps is enforced by the API is open [gap:zia.bandwidth-control.limits:caps-api-enforced], and how the pools nest is open [gap:zia.bandwidth-control.limits:domain-pool-relationship].

What to check:
1. Whether the policy's rule count is near the cap of 125 rules.
2. Whether any class carries custom domains, counting against the cap of 8 classes that may use the Domains field.
3. Whether domains from URL categories are being counted toward the same 25,000-domain cap.

Not known (open gaps):
- Whether the rule, class and domain caps are enforced by the API [gap:zia.bandwidth-control.limits:caps-api-enforced]: settled by lab-test or support-ticket. Blocks: deciding whether automation needs its own guard before hitting a cap
- Class domain cap versus the custom URL pool [gap:zia.bandwidth-control.limits:domain-pool-relationship]: settled by support-ticket or tenant-data

Area: zia.bandwidth-control, its subjects in references/_meta/spine/zia/zia.bandwidth-control.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.bandwidth-control.allocation.md (How Bandwidth Control allocates bandwidth: minimum, maximum, contention), from zia.bandwidth-control: The service distributes bandwidth rule by rule from top to bottom looking at the minimum first, then passes through each rule a second time to allocate what remains according to the maximums. [zia.bandwidth-control.allocation:two-pass]
- scoped-by references/_meta/text/zia/zia.bandwidth-control.location-scope.md (Which traffic Bandwidth Control covers: locations and limits), from zia.bandwidth-control: Bandwidth controls apply to traffic from configured locations only. They do not apply to remote users, whose traffic does not come from a configured location and whose source IP has unknown upload and download bandwidth. [zia.bandwidth-control.location-scope:known-locations-only]
- decided-by references/_meta/text/zia/zia.bandwidth-control.rules.md (Bandwidth Control rules: terms, order and rank), from zia.bandwidth-control: Bandwidth Control rules are evaluated in ascending numerical rule order, and the default rule is evaluated last. [zia.bandwidth-control.rules:ascending-order]
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path), from zia.bandwidth-control: Traffic blocked by the Firewall module or by an earlier web policy never reaches Bandwidth Control, so Bandwidth Control only shapes transactions that every earlier stage allowed. [zia.bandwidth-control.pipeline-position:only-surviving-traffic]
- depends-on references/_meta/text/zia/zia.locations.bandwidth.md (How a location and its sublocations share bandwidth limits), from zia.bandwidth-control: Bandwidth Control rules therefore shape a location's traffic only where that location enforces Bandwidth Control and has limits; with the switch off, rules and classes for that location have no effect. [zia.bandwidth-control.location-scope:toggle-gates-rules]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.bandwidth-control: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.bandwidth-control: Bandwidth Control is the final entry in the ordered policy lists the web module applies to HTTP GET and POST requests, to responses, and to the domain-only pass on CONNECT or SNI. [zia.bandwidth-control.pipeline-position:last-in-web-order]
- links-to references/_meta/text/zia/zia.bandwidth-control.api-surface.md (Bandwidth Control API, SDK and Terraform shape)
