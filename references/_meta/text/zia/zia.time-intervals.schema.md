# Time interval fields: days, minutes and the single window (zia.time-intervals.schema)
Also called: time interval fields; startTime endTime minutes; daysOfWeek values; EVERYDAY ANY NONE; minutes from midnight; split shift time interval; two windows in one day

A time interval has five fields: a system-generated integer `id`, a `name`, integer `startTime` and `endTime`, and a `daysOfWeek` list. [zia.time-intervals.schema:fields] Everything about when an interval applies lives in the last three of those.

**Times are minutes, not clock strings.** `startTime` and `endTime` are minutes from midnight, 0 to 1439 (480 is 08:00, 1020 is 17:00), not clock strings. The OpenAPI document says only "start time" and "end time"; the unit comes from the MCP server's tool description and the SDK example. [zia.time-intervals.schema:minutes-from-midnight] What the API does with a string such as `"08:00"` is open [gap:zia.time-intervals.schema:string-times]. In the Go SDK `startTime` has no `omitempty` while `endTime`, `id`, `name` and `daysOfWeek` do, so a zero start (midnight) is always sent and a zero end is dropped from the body. The Python model's request format lists all five keys with no condition, but the Python add and update calls send the caller's keyword arguments as the body. [zia.time-intervals.schema:go-starttime-always-sent]

**Days.** `daysOfWeek` takes ANY, NONE, EVERYDAY, SUN, MON, TUE, WED, THU, FRI and SAT; EVERYDAY selects all seven days. The Python docstring and the MCP tool description list EVERYDAY and the seven day names without ANY or NONE; the Terraform time window data source's `day_of_week` lists ANY and NONE as well. [zia.time-intervals.schema:days-values] `daysOfWeek` has no weekday or range value, so a Monday-to-Friday interval lists the five names MON, TUE, WED, THU and FRI. [zia.time-intervals.schema:weekday-schedule-lists-days]

**One period only.** An interval holds one time period applied to its chosen days; the console allows only one period at a time. A split shift (08:00 to 12:00 and 14:00 to 18:00) therefore needs two intervals. [zia.time-intervals.schema:one-period] The only recurrence is the weekly one given by `daysOfWeek`; the object has no date, exclusion or calendar field. [zia.time-intervals.schema:weekly-recurrence-only] For date exclusions such as holidays see [What a rule does outside its time interval](kb:zia.time-intervals.evaluation).

Whether the end may be earlier than the start for an overnight window is also open [Whether an interval can cross midnight (end earlier than start)](kb:zia.time-intervals.evaluation:midnight-spanning). Name rules and counts are in [Time interval limits: object cap, per-rule cap and name characters](kb:zia.time-intervals.limits). The Go field-tag behavior is the same family of problem as [How the Go SDK encodes ZIA writes (omitted zero values, empty responses)](kb:zia.sdk-go.write-encoding).

Inferred, not quoted (say so when an answer rests on one):
- [zia.time-intervals.schema:one-period] Tier B: The one-period limit is stated by the Help page; the two-interval remedy is inference from the schema and the rule field being a list (zia.time-intervals.rule-usage).
- [zia.time-intervals.schema:weekly-recurrence-only] Tier B: Absence from the five-field schema and the console drawer.
- [zia.time-intervals.schema:weekday-schedule-lists-days] Tier B: Assumes the enum in days-values is exhaustive for the field.

Not known (open gaps):
- What the API does with HH:MM strings for startTime and endTime [gap:zia.time-intervals.schema:string-times]: settled by lab-test

Area: zia.time-intervals, its subjects in references/_meta/spine/zia/zia.time-intervals.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.time-intervals.evaluation.md (What a rule does outside its time interval), from zia.time-intervals: A rule with a time interval does not trigger when the resolved time falls outside the interval. [zia.time-intervals.evaluation:outside-window-generalized]
- decided-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- decided-by references/_meta/text/zia/zia.time-intervals.timezone.md (Which time zone a time interval is evaluated in), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- interacts-with references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match), from zia.time-intervals: An out-of-window rule yields no verdict of its own: evaluation continues down the ordered list, so an allow rule limited to business hours stops allowing after hours and the outcome depends on the rules below it, ending at the default rule. [zia.time-intervals.evaluation:falls-through]
- links-to references/_meta/text/zia/zia.sdk-go.write-encoding.md (How the Go SDK encodes ZIA writes (omitted zero values, empty responses))
- links-to references/_meta/text/zia/zia.time-intervals.limits.md (Time interval limits: object cap, per-rule cap and name characters)
