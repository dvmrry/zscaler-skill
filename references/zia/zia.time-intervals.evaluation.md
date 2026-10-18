{{outside-window-not-triggered}} That matters for rule order, because the rule leaves the decision to whatever comes after it. {{falls-through}} An allow rule limited to business hours therefore does not mean "blocked after hours": check the rules below it and the default rule. For the order mechanics see [[zia.url-filtering.rule-order]]; for which clock decides "outside", see [[zia.time-intervals.timezone]].

**Holidays and one-off closures.** {{no-holiday-exclusions}}

**Overnight windows.** Whether a window can wrap past midnight is gap `midnight-spanning`; until tested, use two intervals (one ending at 1439, one starting at 0) and keep each period inside a single day. That workaround follows from the single-period schema in [[zia.time-intervals.schema]], not from a source.
