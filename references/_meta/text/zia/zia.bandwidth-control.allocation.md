# How Bandwidth Control allocates bandwidth: minimum, maximum, contention (zia.bandwidth-control.allocation)
Also called: bandwidth limits ignored; guaranteed bandwidth; maximum bandwidth percentage; bandwidth contention; when does bandwidth control enforce; bandwidth control not limiting off-peak

Minimum and maximum behave differently. A rule's maximum is the largest percentage of total bandwidth the class can use at a point in time; its minimum is the guaranteed percentage available to the class. [zia.bandwidth-control.allocation:min-max-meaning] In a rule's Actions, Min. Bandwidth is the minimum percentage of a location's bandwidth you want to be guaranteed for each selected bandwidth class, and the Max. Bandwidth description uses the same words, the maximum percentage of a location's bandwidth you want to be guaranteed for each selected class; each percentage includes bandwidth for uploads and downloads. [zia.bandwidth-control.allocation:min-max-per-class-both-directions] The two pages word the maximum differently [divergence:zia.bandwidth-control.allocation:max-bandwidth-meaning].

**Maximum is a standing cap.** The maximum percentage is applied at all times: traffic can only take up to that percentage of the location's bandwidth, whether or not there is congestion. [zia.bandwidth-control.allocation:max-always] The vendor describes the always-applied maximum as useful for suppressing, but not blocking, non-business traffic. [zia.bandwidth-control.allocation:max-suppress-not-block]

**Minimum is a contention guarantee.** The minimum percentage is enforced only when there is contention on the location's connection and traffic from the specified classes is present. [zia.bandwidth-control.allocation:min-only-in-contention] Under contention the service gives each competing class its guaranteed minimum and divides the remainder by the prioritized rules; the total of the minimums must therefore be less than 100%. [zia.bandwidth-control.allocation:total-min-below-100]

**How it is divided.** The service distributes bandwidth rule by rule from top to bottom looking at the minimum first, then passes through each rule a second time to allocate what remains according to the maximums. [zia.bandwidth-control.allocation:two-pass] The service rebalances bandwidth in real time and buffers packets of classes that reach their quota during one-second intervals; in Zscaler's policy example, the bandwidth left after the guaranteed minimums is allocated based on traffic from other application classes during each one-second interval. [zia.bandwidth-control.allocation:one-second-rebalance] When a class uses less than its minimum, the service allocates the idle bandwidth to the other classes according to the prioritized rules. [zia.bandwidth-control.allocation:idle-reallocated]

**When contention happens.** The Bandwidth Control policy is relevant during periods of contention, which occurs when bandwidth is saturated between the location and Zscaler and typically recurs at predictable periods on weekdays. [zia.bandwidth-control.allocation:contention] Vendor guidance is to observe traffic patterns for a while and then create time-based policies for the contention periods. [zia.bandwidth-control.allocation:observe-then-time-window] What saturation is measured against is open [gap:zia.bandwidth-control.allocation:contention-measure].

**What is shaped.** Bandwidth Control applies only to TCP traffic for HTTP, HTTPS, HTTP Proxy, SSL/TLS, Native FTP, DNS over HTTPS and Tunnel SSL/TLS, from known locations. SSL inspection is not required because it works at the TCP level. [zia.bandwidth-control.allocation:tcp-protocols-only] The Adding Rules page offers more protocol choices than that list [divergence:zia.bandwidth-control.allocation:help-protocol-count]. Traffic from remote users and unconfigured locations is outside this: [Which traffic Bandwidth Control covers: locations and limits](kb:zia.bandwidth-control.location-scope). Where it sits in the policy order: [Where Bandwidth Control sits in policy enforcement](kb:zia.bandwidth-control.pipeline-position).

**Seeing it.** A Bandwidth Control dashboard shows organization bandwidth usage in real time, and Interactive Reports hold the standard Bandwidth Control reports and custom reports. [zia.bandwidth-control.allocation:dashboard-reports]

What to check:
1. Whether the class is held by a maximum, which applies at all times, or only guaranteed a minimum, which applies under contention.
2. Whether the link was saturated when the limit looked ignored, on the Bandwidth Control dashboard.
3. Which rule holds the class, or whether it fell to the location's default rule.

Sources disagree (name both sides):
- What the maximum bandwidth is: a cap on what a class can use on the About Bandwidth Control page, a percentage the admin wants to be guaranteed on the Adding Rules page. [divergence:zia.bandwidth-control.allocation:max-bandwidth-meaning]
  - zscaler-help: The maximum is the largest percentage of total bandwidth the class can use at a given point in time.
  - zscaler-help: Max. Bandwidth is the maximum percentage of a location's bandwidth you want to be guaranteed for each selected class.
  Impact: A maximum read as a guarantee is a floor and as a cap is a ceiling; the pages do not say which governs.
- Which protocols Bandwidth Control applies to: About Bandwidth Control lists seven TCP protocols, and the Adding Rules page offers eleven protocol choices. [divergence:zia.bandwidth-control.allocation:help-protocol-count]
  - zscaler-help: Bandwidth Control only applies to TCP traffic for HTTP, HTTPS, HTTP Proxy, SSL/TLS, Native FTP, DNS over HTTPS and Tunnel SSL/TLS.
  - zscaler-help: The Protocols condition also offers FTP over HTTP, Tunnel, WebSocket and WebSocket SSL/TLS.
  Impact: Traffic on FTP over HTTP, Tunnel or WebSocket is inside the rule's Protocols choices under one page and outside the stated scope of Bandwidth Control under the other; the pages do not say which governs.

Not known (open gaps):
- What saturation is measured against [gap:zia.bandwidth-control.allocation:contention-measure]: settled by support-ticket or lab-test

Area: zia.bandwidth-control, its subjects in references/_meta/spine/zia/zia.bandwidth-control.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zia/zia.bandwidth-control.location-scope.md (Which traffic Bandwidth Control covers: locations and limits): Bandwidth Control applies only to TCP traffic for HTTP, HTTPS, HTTP Proxy, SSL/TLS, Native FTP, DNS over HTTPS and Tunnel SSL/TLS, from known locations. SSL inspection is not required because it works at the TCP level. [zia.bandwidth-control.allocation:tcp-protocols-only]
- decided-by references/_meta/text/zia/zia.bandwidth-control.rules.md (Bandwidth Control rules: terms, order and rank): The service distributes bandwidth rule by rule from top to bottom looking at the minimum first, then passes through each rule a second time to allocate what remains according to the maximums. [zia.bandwidth-control.allocation:two-pass]
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path), from zia.bandwidth-control: Traffic blocked by the Firewall module or by an earlier web policy never reaches Bandwidth Control, so Bandwidth Control only shapes transactions that every earlier stage allowed. [zia.bandwidth-control.pipeline-position:only-surviving-traffic]
- depends-on references/_meta/text/zia/zia.locations.bandwidth.md (How a location and its sublocations share bandwidth limits), from zia.bandwidth-control: Bandwidth Control rules therefore shape a location's traffic only where that location enforces Bandwidth Control and has limits; with the switch off, rules and classes for that location have no effect. [zia.bandwidth-control.location-scope:toggle-gates-rules]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.bandwidth-control: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.bandwidth-control: Bandwidth Control is the final entry in the ordered policy lists the web module applies to HTTP GET and POST requests, to responses, and to the domain-only pass on CONNECT or SNI. [zia.bandwidth-control.pipeline-position:last-in-web-order]
- links-to references/_meta/text/zia/zia.bandwidth-control.pipeline-position.md (Where Bandwidth Control sits in policy enforcement)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/bandwidth-control-rules.md (config type)
- see-also references/_meta/text/zia/zia.bandwidth-control.default-rule.md (The default rule and unreferenced classes)
