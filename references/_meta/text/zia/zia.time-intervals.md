# ZIA Time Intervals (zia.time-intervals)
Also called: time intervals; time interval; time windows; schedule a policy rule; business hours rule; rule only during working hours; time based policy

A time interval is a named schedule (days of the week and one time-of-day period) that a ZIA rule can reference so it applies only at certain times ([Time interval fields: days, minutes and the single window](kb:zia.time-intervals.schema)). "Why did this rule fire, or not fire, at that hour?" takes five questions in order.

1. **Does this rule type take a time at all?** Most do; SSL Inspection is disputed: [Which ZIA rules take a time interval, and how many](kb:zia.time-intervals.rule-usage).
2. **Which clock is used?** The user's configured location, or the edge's clock for remote users and Client Connector: [Which time zone a time interval is evaluated in](kb:zia.time-intervals.timezone), with the location's own time zone in [What a ZIA location is and what the console enforces for it](kb:zia.locations.model).
3. **What does the interval actually contain?** Minutes from midnight, a day list, and a single period: [Time interval fields: days, minutes and the single window](kb:zia.time-intervals.schema).
4. **What happens outside the window?** The rule is skipped and evaluation moves on: [What a rule does outside its time interval](kb:zia.time-intervals.evaluation), and the first-match rule in [URL Filtering rule order and first match](kb:zia.url-filtering.rule-order).
5. **Is it a time interval or a time window?** Two similarly named objects exist: [Time windows versus time intervals](kb:zia.time-intervals.time-windows).

Limits on counts, per-rule caps and name characters are in [Time interval limits: object cap, per-rule cap and name characters](kb:zia.time-intervals.limits); the API operations, update behavior and activation are in [Time interval API operations, updates and activation](kb:zia.time-intervals.api-surface).

Area: zia.time-intervals, its subjects in references/_meta/spine/zia/zia.time-intervals.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it): If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- decided-by references/_meta/text/zia/zia.time-intervals.evaluation.md (What a rule does outside its time interval): A rule with a time interval does not trigger when the resolved time falls outside the interval. [zia.time-intervals.evaluation:outside-window-generalized]
- decided-by references/_meta/text/zia/zia.time-intervals.timezone.md (Which time zone a time interval is evaluated in): If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- interacts-with references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match): An out-of-window rule yields no verdict of its own: evaluation continues down the ordered list, so an allow rule limited to business hours stops allowing after hours and the outcome depends on the rules below it, ending at the default rule. [zia.time-intervals.evaluation:falls-through]
- links-to references/_meta/text/zia/zia.time-intervals.schema.md (Time interval fields: days, minutes and the single window)
- links-to references/_meta/text/zia/zia.time-intervals.api-surface.md (Time interval API operations, updates and activation)
- links-to references/_meta/text/zia/zia.time-intervals.limits.md (Time interval limits: object cap, per-rule cap and name characters)
- links-to references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many)
- links-to references/_meta/text/zia/zia.time-intervals.time-windows.md (Time windows versus time intervals)
