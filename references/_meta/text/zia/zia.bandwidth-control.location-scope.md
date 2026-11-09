# Which traffic Bandwidth Control covers: locations and limits (zia.bandwidth-control.location-scope)
Also called: enforce bandwidth control; sublocation bandwidth; guest sublocation using corporate bandwidth; remote users bandwidth control; location bandwidth limits; bandwidth control toggle

Rules are only half of Bandwidth Control; the location decides whether a flow is shaped and against what total. Bandwidth Control starts with maximum upload and download limits per location, which apply to traffic proxied to Zscaler. These limits are required before the class-based rules (the second level) can be used. [zia.bandwidth-control.location-scope:limits-per-location] Bandwidth controls apply to traffic from configured locations only. They do not apply to remote users, whose traffic does not come from a configured location and whose source IP has unknown upload and download bandwidth. [zia.bandwidth-control.location-scope:known-locations-only]

**The switch.** A location's Bandwidth Control section has an Enforce Bandwidth Control switch plus Download and Upload maximums in Mbps. [zia.bandwidth-control.location-scope:enforce-toggle] Bandwidth Control rules therefore shape a location's traffic only where that location enforces Bandwidth Control and has limits; with the switch off, rules and classes for that location have no effect. [zia.bandwidth-control.location-scope:toggle-gates-rules]

**Sublocations.** Whether a sublocation shares its location's limits, holds its own, or is exempt, and how the parent and child limits must relate, is in [How a location and its sublocations share bandwidth limits](kb:zia.locations.bandwidth); the Bandwidth Control consequence is that a sublocation in the default shared mode shares its location's limits ([How a location and its sublocations share bandwidth limits](kb:zia.locations.bandwidth), claim shared-by-default). Enforcing a specific bandwidth limit on a sublocation, rather than letting it use the location's bandwidth, is described as particularly useful for guest Wi-Fi networks. [zia.bandwidth-control.location-scope:guest-wifi]

**Sizing the limits.** Location limits should leave out UDP traffic sent to Zscaler and traffic not forwarded to Zscaler and are best set to 70-80% of the location's overall bandwidth; the service does not count TCP overhead, such as packet headers, in its bandwidth calculations. [zia.bandwidth-control.location-scope:sizing] The vendor's overhead figure is stated inconsistently [divergence:zia.bandwidth-control.location-scope:overhead-percentage].

Class and rule mechanics: [How Bandwidth Control allocates bandwidth: minimum, maximum, contention](kb:zia.bandwidth-control.allocation).

What to check:
1. Whether the location's Enforce Bandwidth Control switch is on and its maximums are set, since rules do not shape its traffic otherwise.
2. Each sublocation's mode, since a sublocation in the shared mode shares its location's limits.
3. Whether the traffic comes from a configured location rather than a remote user, which these limits do not cover.

Inferred, not quoted (say so when an answer rests on one):
- [zia.bandwidth-control.location-scope:toggle-gates-rules] Tier B: Derived from the toggle's description and the requirement for limits; no source states the outcome of a rule for a location with the toggle off.

Sources disagree (name both sides):
- How much of a location's bandwidth to subtract as TCP overhead [divergence:zia.bandwidth-control.location-scope:overhead-percentage]
  - zscaler-help: About 5-7% of TCP traffic is overhead that the service leaves out of its bandwidth calculations.
  - zscaler-help: The sizing equation subtracts 10-15% overhead from actual bandwidth.
  Impact: A limit computed with the wrong overhead is off by several percent of the link; use the 70-80% guidance as the planning point and treat the exact overhead as unresolved.

Not known (open gaps):
- How shared sublocation bandwidth is divided under contention [gap:zia.bandwidth-control.location-scope:sublocation-share-detail]: settled by lab-test or support-ticket

Area: zia.bandwidth-control, its subjects in references/_meta/spine/zia/zia.bandwidth-control.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.locations.bandwidth.md (How a location and its sublocations share bandwidth limits): Bandwidth Control rules therefore shape a location's traffic only where that location enforces Bandwidth Control and has limits; with the switch off, rules and classes for that location have no effect. [zia.bandwidth-control.location-scope:toggle-gates-rules]
- decided-by references/_meta/text/zia/zia.bandwidth-control.allocation.md (How Bandwidth Control allocates bandwidth: minimum, maximum, contention), from zia.bandwidth-control: The service distributes bandwidth rule by rule from top to bottom looking at the minimum first, then passes through each rule a second time to allocate what remains according to the maximums. [zia.bandwidth-control.allocation:two-pass]
- decided-by references/_meta/text/zia/zia.bandwidth-control.rules.md (Bandwidth Control rules: terms, order and rank), from zia.bandwidth-control: Bandwidth Control rules are evaluated in ascending numerical rule order, and the default rule is evaluated last. [zia.bandwidth-control.rules:ascending-order]
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path), from zia.bandwidth-control: Traffic blocked by the Firewall module or by an earlier web policy never reaches Bandwidth Control, so Bandwidth Control only shapes transactions that every earlier stage allowed. [zia.bandwidth-control.pipeline-position:only-surviving-traffic]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.bandwidth-control: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.bandwidth-control: Bandwidth Control is the final entry in the ordered policy lists the web module applies to HTTP GET and POST requests, to responses, and to the domain-only pass on CONNECT or SNI. [zia.bandwidth-control.pipeline-position:last-in-web-order]
