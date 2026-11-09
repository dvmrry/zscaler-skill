# Bandwidth classes: what a class is and which exist (zia.bandwidth-control.classes)
Also called: bandwidth class; predefined bandwidth classes; general surfing class; large files bandwidth class; voip bandwidth class; web conferencing bandwidth class; custom bandwidth class

A bandwidth class is the matcher that Bandwidth Control rules point at. A bandwidth class identifies the URL categories and cloud applications to which the service allocates bandwidth. Classes must be configured before Bandwidth Control rules can reference them. [zia.bandwidth-control.classes:purpose] A rule never matches a URL or application directly; if traffic is not in a class that a rule references, that rule does not shape it ([Bandwidth Control rules: terms, order and rank](kb:zia.bandwidth-control.rules)).

**Custom classes.** A custom class on the Cloud Applications tab is built from URL categories, cloud applications (categories or individual applications) and a Domains list of URLs. [zia.bandwidth-control.classes:custom-matchers] Domain counts are capped: see [Bandwidth Control limits: rules, classes, domains](kb:zia.bandwidth-control.limits). The URL categories picked here resolve the usual way ([Which URL category a URL belongs to](kb:zia.url-categories.membership)).

**The four tabs.** The Bandwidth Classes page has four tabs: Cloud Applications (custom and predefined classes, managed by adding or removing URL domains), Large Files (minimum file size), Web Conference Applications (enable or disable applications) and VoIP Applications (enable or disable applications). [zia.bandwidth-control.classes:four-tabs]

**Predefined classes.** The Cloud Applications tab lists five predefined classes: File Share, Finance, General Surfing, Sales/Support Apps and Streaming Media. A predefined class cannot be deleted, but domains can be added to it and existing domains edited or removed. [zia.bandwidth-control.classes:predefined-cloud-apps] General Surfing holds all URL categories and cloud applications that do not belong to the Webmail, Instant Messaging, Streaming Media, File Share, and Social Networks/Blogging groups, and it cannot be edited. [zia.bandwidth-control.classes:general-surfing] Which items each predefined class contains is not captured [gap:zia.bandwidth-control.classes:predefined-membership].

**Large Files, VoIP and Web Conferencing.** The Large Files class takes a minimum file size chosen from a drop-down, and the service throttles bandwidth when users download or upload files at or above that size. [zia.bandwidth-control.classes:large-files] The VoIP Applications and Web Conferencing Applications tabs each let an administrator enable or disable applications for the class; each tab displays a list of its applications that can be included in the class. [zia.bandwidth-control.classes:voip-webconf-apps] In the API these plausibly correspond to typed classes of the same object, with eight predefined type values; no source states that mapping (see [Bandwidth Control API, SDK and Terraform shape](kb:zia.bandwidth-control.api-surface), claim types-match-predefined).

**Microsoft 365.** To define a bandwidth management policy for Microsoft 365, Zscaler recommends adding Office 365 to a bandwidth class and then defining the appropriate bandwidth rule for that class. [zia.bandwidth-control.classes:office365-class-recommendation]

**Activation.** Class edits are saved and then activated from the console; the documented procedures for predefined, custom, Large Files, VoIP and Web Conferencing classes all end with a save-and-activate step, so a saved class is not necessarily live. [zia.bandwidth-control.classes:save-then-activate] The staged-versus-live activation gate is described in the legacy doc [Which Zscaler products stage changes behind an activation](kb:shared.activation), which is not yet a subject.

What to check:
1. Whether the class is referenced by a rule, since an unreferenced custom class falls into the location's default rule.
2. Whether the class sits on the tab that matches its kind, given that the Cloud Applications tab holds the custom and predefined classes.
3. Whether the change was activated, since a saved class is not necessarily live.

Inferred, not quoted (say so when an answer rests on one):
- [zia.bandwidth-control.classes:save-then-activate] Tier B: Derived from the procedure text; no source states the staged-versus-live state of an unactivated class edit.

Not known (open gaps):
- Console lists for Large Files sizes and VoIP or Web Conferencing applications [gap:zia.bandwidth-control.classes:console-application-lists] (data gap): filled by live; run `zscalerctl zia bandwidth-classes list`; settled by tenant-data or lab-test
- What the predefined classes actually contain [gap:zia.bandwidth-control.classes:predefined-membership] (data gap): filled by live; run `zscalerctl zia bandwidth-classes list`; settled by tenant-data

Area: zia.bandwidth-control, its subjects in references/_meta/spine/zia/zia.bandwidth-control.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.bandwidth-control.rules.md (Bandwidth Control rules: terms, order and rank), from zia.bandwidth-control: Bandwidth Control rules are evaluated in ascending numerical rule order, and the default rule is evaluated last. [zia.bandwidth-control.rules:ascending-order]
- depends-on references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to): A custom class on the Cloud Applications tab is built from URL categories, cloud applications (categories or individual applications) and a Domains list of URLs. [zia.bandwidth-control.classes:custom-matchers]
- decided-by references/_meta/text/zia/zia.bandwidth-control.allocation.md (How Bandwidth Control allocates bandwidth: minimum, maximum, contention), from zia.bandwidth-control: The service distributes bandwidth rule by rule from top to bottom looking at the minimum first, then passes through each rule a second time to allocate what remains according to the maximums. [zia.bandwidth-control.allocation:two-pass]
- scoped-by references/_meta/text/zia/zia.bandwidth-control.location-scope.md (Which traffic Bandwidth Control covers: locations and limits), from zia.bandwidth-control: Bandwidth controls apply to traffic from configured locations only. They do not apply to remote users, whose traffic does not come from a configured location and whose source IP has unknown upload and download bandwidth. [zia.bandwidth-control.location-scope:known-locations-only]
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path), from zia.bandwidth-control: Traffic blocked by the Firewall module or by an earlier web policy never reaches Bandwidth Control, so Bandwidth Control only shapes transactions that every earlier stage allowed. [zia.bandwidth-control.pipeline-position:only-surviving-traffic]
- depends-on references/_meta/text/zia/zia.locations.bandwidth.md (How a location and its sublocations share bandwidth limits), from zia.bandwidth-control: Bandwidth Control rules therefore shape a location's traffic only where that location enforces Bandwidth Control and has limits; with the switch off, rules and classes for that location have no effect. [zia.bandwidth-control.location-scope:toggle-gates-rules]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.bandwidth-control: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.bandwidth-control: Bandwidth Control is the final entry in the ordered policy lists the web module applies to HTTP GET and POST requests, to responses, and to the domain-only pass on CONNECT or SNI. [zia.bandwidth-control.pipeline-position:last-in-web-order]
- links-to references/_meta/text/shared/shared.activation.md (Which Zscaler products stage changes behind an activation)
- links-to references/_meta/text/zia/zia.bandwidth-control.api-surface.md (Bandwidth Control API, SDK and Terraform shape)
- links-to references/_meta/text/zia/zia.bandwidth-control.limits.md (Bandwidth Control limits: rules, classes, domains)
