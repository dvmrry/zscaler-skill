{{fields}} Everything about when an interval applies lives in the last three of those.

**Times are minutes, not clock strings.** {{minutes-from-midnight}} An interval for 08:00 to 17:00 is `startTime` 480 and `endTime` 1020; a full-day window would be 0 to 1439. What the API does with a string such as `"08:00"` is unobserved (gap `string-times`). In the Go SDK, {{go-starttime-always-sent}}

**Days.** {{days-values}} A weekday schedule is the five day names, not a range.

**One period only.** {{one-period}} {{weekly-recurrence-only}} For date exclusions such as holidays see [[zia.time-intervals.evaluation]].

Whether the end may be earlier than the start for an overnight window is also open: see the `midnight-spanning` gap in [[zia.time-intervals.evaluation]]. Name rules and counts are in [[zia.time-intervals.limits]]. The Go field-tag behavior is the same family of problem as [[zia.sdk-go.write-encoding]].
