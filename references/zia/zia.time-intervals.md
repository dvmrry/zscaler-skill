A time interval is a named schedule (days of the week and one time-of-day period) that a ZIA rule can reference so it applies only at certain times ([[zia.time-intervals.schema]]). "Why did this rule fire, or not fire, at that hour?" takes five questions in order.

1. **Does this rule type take a time at all?** Most do; SSL Inspection is disputed: [[zia.time-intervals.rule-usage]].
2. **Which clock is used?** The user's configured location, or the edge's clock for remote users and Client Connector: [[zia.time-intervals.timezone]], with the location's own time zone in [[zia.locations.model]].
3. **What does the interval actually contain?** Minutes from midnight, a day list, and a single period: [[zia.time-intervals.schema]].
4. **What happens outside the window?** The rule is skipped and evaluation moves on: [[zia.time-intervals.evaluation]], and the first-match rule in [[zia.url-filtering.rule-order]].
5. **Is it a time interval or a time window?** Two similarly named objects exist: [[zia.time-intervals.time-windows]].

Limits on counts, per-rule caps and name characters are in [[zia.time-intervals.limits]]; the API operations, update behavior and activation are in [[zia.time-intervals.api-surface]].
