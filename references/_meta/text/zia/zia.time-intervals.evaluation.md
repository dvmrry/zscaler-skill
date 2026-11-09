# What a rule does outside its time interval (zia.time-intervals.evaluation)
Also called: rule skipped outside hours; after hours allow rule; time based rule falls through; holiday exception rule; overnight time interval; midnight spanning interval
Former IDs: zia-24

In the Time Intervals help example, a remote user's request is evaluated at the Public Service Edge's time (6:30 PM in Paris), which is outside the rule's Monday-to-Friday 9:00 AM - 5:00 PM interval, so the policy is not triggered and the user is allowed. [zia.time-intervals.evaluation:outside-window-not-triggered] A rule with a time interval does not trigger when the resolved time falls outside the interval. [zia.time-intervals.evaluation:outside-window-generalized] That matters for rule order, because the rule leaves the decision to whatever comes after it. An out-of-window rule yields no verdict of its own: evaluation continues down the ordered list, so an allow rule limited to business hours stops allowing after hours and the outcome depends on the rules below it, ending at the default rule. [zia.time-intervals.evaluation:falls-through] For the order mechanics see [URL Filtering rule order and first match](kb:zia.url-filtering.rule-order); for which clock decides "outside", see [Which time zone a time interval is evaluated in](kb:zia.time-intervals.timezone).

**Holidays and one-off closures.** A time interval cannot exclude dates such as public holidays; the schema has no date or calendar field. Staying outside a window on a given date means disabling or reordering the rule yourself. [zia.time-intervals.evaluation:no-holiday-exclusions]

**Overnight windows.** Whether a window can wrap past midnight is open [gap:zia.time-intervals.evaluation:midnight-spanning].

What to check:
1. Whether an overnight period is split into two intervals, one ending at 1439 and one starting at 0, since no source states that a window can wrap midnight.
2. Whether an after-hours request is blocked, since an out-of-window allow rule yields no verdict and the outcome depends on the rules below it.

Inferred, not quoted (say so when an answer rests on one):
- [zia.time-intervals.evaluation:outside-window-generalized] Tier B: Generalized from the help page's remote-user example (outside-window-not-triggered); the page states no general rule. The same page's first example describes a known-location user at 5:30 PM London time as blocked by the 9:00 AM - 5:00 PM rule, which the general rule does not explain.
- [zia.time-intervals.evaluation:falls-through] Tier B: Follows from first-match evaluation as documented for URL Filtering; the same behavior for other rule types was not read.
- [zia.time-intervals.evaluation:no-holiday-exclusions] Tier B: Absence of a date field in the schema and drawer; the remedy follows from rules being skipped when disabled (zia.url-filtering.rule-order:disabled-holds-slot).

Not known (open gaps):
- Whether an interval can cross midnight (end earlier than start) [gap:zia.time-intervals.evaluation:midnight-spanning]: settled by lab-test. Blocks: advising how to schedule overnight windows

Area: zia.time-intervals, its subjects in references/_meta/spine/zia/zia.time-intervals.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.time-intervals.timezone.md (Which time zone a time interval is evaluated in): If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- interacts-with references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match): An out-of-window rule yields no verdict of its own: evaluation continues down the ordered list, so an allow rule limited to business hours stops allowing after hours and the outcome depends on the rules below it, ending at the default rule. [zia.time-intervals.evaluation:falls-through]
- decided-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
