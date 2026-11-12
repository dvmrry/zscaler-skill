# Time windows versus time intervals (zia.time-intervals.time-windows)
Also called: timeWindows endpoint; firewall time window data source; zia_firewall_filtering_time_window; Work hours Weekends Off hours; predefined time interval; terraform time interval resource
Former IDs: zia-23, zia-25

ZIA has two schedule objects with nearly the same shape. Time intervals are the ones an admin creates, in [Time interval fields: days, minutes and the single window](kb:zia.time-intervals.schema). The time window catalog is a second, separate list. `GET /timeWindows` and `GET /timeWindows/lite` list the time intervals used by the Firewall policy or the URL Filtering policy; they are separate from `/timeIntervals`. [zia.time-intervals.time-windows:catalog-endpoints] The time window catalog is read-only in the API specification: both paths expose only GET. [zia.time-intervals.time-windows:read-only]

A time window names its days in `dayOfWeek` (singular), where a time interval uses `daysOfWeek`; the other four fields match. [zia.time-intervals.time-windows:day-key-singular]

**Terraform.** The Terraform provider exposes the catalog as the data source `zia_firewall_filtering_time_window`, looked up by `id` or `name` (documented examples: Work hours, Weekends, Off hours). Its schema returns `start_time` and `end_time` as integers and `day_of_week` as a list of strings. [zia.time-intervals.time-windows:tf-data-source] The docs give other types for its outputs [divergence:zia.time-intervals.time-windows:tf-data-source-types]. The Terraform provider has no managed resource or data source for user-created time intervals; only the time window data source exists in the documentation. [zia.time-intervals.time-windows:no-managed-resource] Whether that is intentional is open [gap:zia.time-intervals.time-windows:terraform-resource-intent]. Whether the catalog's predefined names also exist among intervals is open [gap:zia.time-intervals.time-windows:predefined-intervals]. In the Terraform provider's examples, the Firewall Filtering, Firewall DNS, Firewall IPS, Forwarding Control and Traffic Capture rules fill their time windows with the id of the `zia_firewall_filtering_time_window` data source. [zia.time-intervals.time-windows:tf-examples-use-time-window-catalog] Which of the two objects the other rule types' `timeWindows` entry accepts is open [gap:zia.time-intervals.time-windows:rule-field-references]; see [Which ZIA rules take a time interval, and how many](kb:zia.time-intervals.rule-usage).

What to check:
1. Whether the catalog's predefined names, such as Work hours, appear in a live list of intervals.

Inferred, not quoted (say so when an answer rests on one):
- [zia.time-intervals.time-windows:read-only] Tier B: Absence of any other method on the two paths in the captured OpenAPI document.
- [zia.time-intervals.time-windows:no-managed-resource] Tier B: Absence: the provider docs directories at the pin contain no time interval resource or data source page.

Sources disagree (name both sides):
- The time window data source docs type start_time, end_time and day_of_week as strings and name as required; the schema types the times as integers, day_of_week as a list of strings, and name as optional. [divergence:zia.time-intervals.time-windows:tf-data-source-types]
  - tf-zia: The docs list name as required and start_time, end_time and day_of_week as strings.
  - tf-zia: The schema declares name optional, start_time and end_time as TypeInt, and day_of_week as a list of strings.
  Impact: Expressions that treat day_of_week as one string (for example string functions on it) fail type checks, and start_time and end_time come back as numbers; write configurations against the schema types.

Not known (open gaps):
- Whether a Terraform time interval resource is planned or deliberately excluded [gap:zia.time-intervals.time-windows:terraform-resource-intent]: settled by source-read or support-ticket
- Whether predefined objects such as Work hours also exist in /timeIntervals [gap:zia.time-intervals.time-windows:predefined-intervals] (data gap): filled by live; run `zscalerctl zia time-intervals list`; settled by tenant-data
- Which object a rule's timeWindows entry references: an interval or a window [gap:zia.time-intervals.time-windows:rule-field-references]: settled by lab-test or source-read

Area: zia.time-intervals, its subjects in references/_meta/spine/zia/zia.time-intervals.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- decided-by references/_meta/text/zia/zia.time-intervals.evaluation.md (What a rule does outside its time interval), from zia.time-intervals: A rule with a time interval does not trigger when the resolved time falls outside the interval. [zia.time-intervals.evaluation:outside-window-generalized]
- decided-by references/_meta/text/zia/zia.time-intervals.timezone.md (Which time zone a time interval is evaluated in), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- interacts-with references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match), from zia.time-intervals: An out-of-window rule yields no verdict of its own: evaluation continues down the ordered list, so an allow rule limited to business hours stops allowing after hours and the outcome depends on the rules below it, ending at the default rule. [zia.time-intervals.evaluation:falls-through]
- links-to references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many)
- links-to references/_meta/text/zia/zia.time-intervals.schema.md (Time interval fields: days, minutes and the single window)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/time-windows.md (config type)
- configured-via references/_meta/text/types/zia/time-intervals.md (config type)
- see-also references/_meta/text/zia/zia.time-intervals.api-surface.md (Time interval API operations, updates and activation)
