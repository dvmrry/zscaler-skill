# Which time zone a time interval is evaluated in (zia.time-intervals.timezone)
Also called: time interval time zone; rule fires at the wrong hour; remote user time based policy; client connector time zone policy; time rule london paris; time interval dst
Former IDs: zia-21

The time zone used to evaluate an interval depends on who the user is, not on where they are. If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location] A remote user, including a Zscaler Client Connector user with no matching location, is evaluated on the time at the Public Service Edge they are connected to, not on the user's own clock. [zia.time-intervals.timezone:remote-user]

Help's example: a Social Networking block on Monday to Friday, 9:00 AM to 5:00 PM, through a Paris Public Service Edge, at 5:30 PM London time on a Tuesday. A user from a known location with the Europe/London time zone is blocked; a London user with no configured location is allowed, because the Paris edge's clock reads 6:30 PM. [zia.time-intervals.timezone:worked-example] The example's blocked outcome falls outside the rule's own window [divergence:zia.time-intervals.timezone:worked-example-outside-window].

So the window follows the location's configured time zone, not the user's geography: a user whose location is configured in another zone sees the rule start and stop at that zone's hours, and remote users in one city who connect through different edges can see different windows. [zia.time-intervals.timezone:window-follows-location-not-user] The location model is in [What a ZIA location is and what the console enforces for it](kb:zia.locations.model), and the time zone values are in [Location country and time zone values, THE_ prefix and Terraform validation](kb:zia.locations.country-timezone). The Define Time Intervals page words the rule differently: time intervals use the time zone of the locations selected for the policy rule. [zia.time-intervals.timezone:rule-locations-wording] Whose location sets the zone when a rule selects other locations is open [gap:zia.time-intervals.timezone:rule-locations-versus-user-location].

No per-rule or tenant-wide time zone setting for time intervals is documented: the Add Time Interval drawer asks only for a name, days, and a time period, and the API object carries only `startTime`, `endTime` and `daysOfWeek`. [zia.time-intervals.timezone:no-override-documented]

Whether daylight saving applies is open [gap:zia.time-intervals.timezone:dst-handling]. What happens outside the window is in [What a rule does outside its time interval](kb:zia.time-intervals.evaluation).

What to check:
1. Which clock applied when a rule fired at an unexpected hour: the known location's zone, or the time at the Public Service Edge for a remote user.
2. Whether the user's traffic matches a configured location, since that location's time zone sets the window.
3. Whether a time-bound rule shifts by an hour twice a year, which no source confirms.

Inferred, not quoted (say so when an answer rests on one):
- [zia.time-intervals.timezone:window-follows-location-not-user] Tier B: Consequence of the two rules; Help gives the London and Paris case but does not state the same-city, different-edge case.
- [zia.time-intervals.timezone:no-override-documented] Tier B: Absence in the captured Help page and the OpenAPI document, not a statement by either.

Sources disagree (name both sides):
- The About Time Intervals example blocks a known-location user at 5:30 PM London time under a rule that runs from 9:00 AM to 5:00 PM. [divergence:zia.time-intervals.timezone:worked-example-outside-window]
  - zscaler-help: The example rule blocks the Social Networking category Monday to Friday from 9:00 AM to 5:00 PM.
  - zscaler-help: A user from a known location with the Europe/London time zone, at 5:30 PM on a Tuesday, is blocked, and the page gives the location's time zone as the reason.
  - zscaler-help: For the remote user the page sets London's 5:30 PM against the Paris edge's 6:30 PM as the reason the rule does not fire.
  Impact: The remote-user reasoning reads as if 5:30 PM were inside the window. By the stated window neither clock in the example (5:30 PM London, 6:30 PM Paris) is inside 9:00 AM to 5:00 PM, so the known-location user's block does not follow from the page's own rule. The example still shows which clock applies (known-location, remote-user); do not cite its outcomes as evidence that a request just after a window's end is blocked.

Not known (open gaps):
- Whether time-interval start and end follow daylight saving time [gap:zia.time-intervals.timezone:dst-handling]: settled by lab-test or support-ticket. Blocks: saying whether a time-bound rule shifts by an hour twice a year
- Whose location sets the time zone when the rule selects different locations [gap:zia.time-intervals.timezone:rule-locations-versus-user-location]: settled by lab-test

Area: zia.time-intervals, its subjects in references/_meta/spine/zia/zia.time-intervals.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it): If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- decided-by references/_meta/text/zia/zia.time-intervals.evaluation.md (What a rule does outside its time interval), from zia.time-intervals: A rule with a time interval does not trigger when the resolved time falls outside the interval. [zia.time-intervals.evaluation:outside-window-generalized]
- interacts-with references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match), from zia.time-intervals: An out-of-window rule yields no verdict of its own: evaluation continues down the ordered list, so an allow rule limited to business hours stops allowing after hours and the outcome depends on the rules below it, ending at the default rule. [zia.time-intervals.evaluation:falls-through]
- links-to references/_meta/text/zia/zia.locations.country-timezone.md (Location country and time zone values, THE_ prefix and Terraform validation)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/time-intervals.md (config type)
- configured-via references/_meta/text/types/zia/locations.md (config type)
