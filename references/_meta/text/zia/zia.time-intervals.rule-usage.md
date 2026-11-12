# Which ZIA rules take a time interval, and how many (zia.time-intervals.rule-usage)
Also called: time windows on rules; which rules support time; schedule a rule; timeWindows field; ssl inspection time of day; rule schedule support; Always time criterion

**Which rules take an interval.** These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types] Traffic Capture rules (`/trafficCaptureRules`) also carry a `timeWindows` list in the Go SDK struct; the captured OpenAPI document has no Traffic Capture path. [zia.time-intervals.rule-usage:traffic-capture-rules] Firewall Filtering Help says a rule's Time field is set to Always by default, and URL Filtering Help offers Always, which applies the rule to all time intervals, or up to two time intervals. [zia.time-intervals.rule-usage:default-always] A rule with no time interval selected applies at all times. [zia.time-intervals.rule-usage:no-interval-applies-always] The policy pages say two intervals per rule where the limits table says eight [divergence:zia.time-intervals.rule-usage:time-intervals-per-rule]. IPS Control rules are covered in [IPS Control](kb:zia.firewall.ips).

The rule field is a list, so a rule can reference more than one interval; the sources do not say how several intervals combine (any one matching versus all). [zia.time-intervals.rule-usage:rule-field-is-list] Time is one criterion among a rule's others: the rule is eligible only while the clock is inside the interval, and its other criteria still have to match. [zia.time-intervals.rule-usage:time-in-rule-criteria] The effect of being outside the window is in [What a rule does outside its time interval](kb:zia.time-intervals.evaluation).

**SSL Inspection is disputed.** The API specification, the SDKs and the Terraform schema carry a `timeWindows` list on SSL Inspection rules, while the MCP workflow skill says there is no such attribute [divergence:zia.time-intervals.rule-usage:ssl-inspection-time-windows]. Whether the service honors the field is open [gap:zia.time-intervals.rule-usage:ssl-time-enforced]. The rule list is in [SSL/TLS inspection rule order, predefined and default rules, limits](kb:zia.ssl-inspection.rules).

Rule types outside the list are open [gap:zia.time-intervals.rule-usage:rule-types-without-time], and whether ZPA has a schedule criterion is open [gap:zia.time-intervals.rule-usage:zpa-no-schedule]. Per-rule caps are in [Time interval limits: object cap, per-rule cap and name characters](kb:zia.time-intervals.limits) and [Firewall rule, criteria and group limits](kb:zia.firewall.limits). Which object supplies the ID is [Time windows versus time intervals](kb:zia.time-intervals.time-windows).

What to check:
1. Whether an SSL Inspection rule is time-gated, which no observation confirms, so do not rely on the schedule.

Inferred, not quoted (say so when an answer rests on one):
- [zia.time-intervals.rule-usage:no-interval-applies-always] Tier B: Rests on Always being the Time field's default and applying the rule to all time intervals (default-always). No source states that a rule with no interval selected, such as one whose `timeWindows` list is empty in the API, behaves as Always.
- [zia.time-intervals.rule-usage:rule-field-is-list] Tier B: Inference from the field being an array and Help saying "up to two time intervals". No source states the combination rule.
- [zia.time-intervals.rule-usage:time-in-rule-criteria] Tier B: Inference from Time being listed with the other rule criteria in the configuration pages; no source spells out the conjunction.

Sources disagree (name both sides):
- How many time intervals a policy rule can take: the Traffic Capture, Firewall Filtering, URL Filtering, IPS Control and NAT Control policy pages say up to two, while the limits table gives 8 times per rule for all policy rule types. [divergence:zia.time-intervals.rule-usage:time-intervals-per-rule]
  - zscaler-help: Up to two time intervals on a Traffic Capture rule.
  - zscaler-help: Up to two time intervals on a Firewall Filtering rule.
  - zscaler-help: Always, or up to two time intervals on a URL Filtering rule.
  - zscaler-help: Up to two time intervals on an IPS Control rule.
  - zscaler-help: Up to two time intervals on a NAT Control rule, Always by default.
  - zscaler-help: 8 times per rule, in the limits table's row for all policy rule types.
  Impact: An answer about how many time intervals a rule can carry depends on which page is used; the pages do not say whether 8 applies to some rule types and two to others.
- SSL Inspection rules carry `timeWindows` in the OpenAPI document, the Go and Python SDKs and the Terraform schema (which caps it at 2), while the MCP server's workflow skill says the API has no time attribute for them. [divergence:zia.time-intervals.rule-usage:ssl-inspection-time-windows]
  - api-specs: The SSL Inspection rule request body has a `timeWindows` list of time-interval references.
  - sdk-go: The Go SDK SSL Inspection rule struct has the same field.
  - sdk-python: The Python SSL Inspection rule model reads and writes `timeWindows`.
  - tf-zia: The Terraform SSL Inspection rule schema has `time_windows`, capped at 2 entries.
  - mcp-server: The MCP workflow skill states SSL Inspection has no time-of-day attribute and sends admins to Firewall Filtering or URL Filtering for a schedule.
  Impact: An agent told to schedule decryption by time of day may refuse on the strength of the skill, or set the field through Terraform and assume it is honored. Whether the service enforces the field on SSL rules is unobserved.

Not known (open gaps):
- Whether ZIA enforces a time interval set on an SSL Inspection rule [gap:zia.time-intervals.rule-usage:ssl-time-enforced]: settled by lab-test
- Rule types without a time criterion [gap:zia.time-intervals.rule-usage:rule-types-without-time] (data gap): filled by none; settled by source-read
- Whether ZPA has any schedule or time-of-day policy criterion [gap:zia.time-intervals.rule-usage:zpa-no-schedule]: settled by source-read

Area: zia.time-intervals, its subjects in references/_meta/spine/zia/zia.time-intervals.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.time-intervals.evaluation.md (What a rule does outside its time interval), from zia.time-intervals: A rule with a time interval does not trigger when the resolved time falls outside the interval. [zia.time-intervals.evaluation:outside-window-generalized]
- decided-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- decided-by references/_meta/text/zia/zia.time-intervals.timezone.md (Which time zone a time interval is evaluated in), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- interacts-with references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match), from zia.time-intervals: An out-of-window rule yields no verdict of its own: evaluation continues down the ordered list, so an allow rule limited to business hours stops allowing after hours and the outcome depends on the rules below it, ending at the default rule. [zia.time-intervals.evaluation:falls-through]
- links-to references/_meta/text/zia/zia.firewall.ips.md (IPS Control)
- links-to references/_meta/text/zia/zia.firewall.limits.md (Firewall rule, criteria and group limits)
- links-to references/_meta/text/zia/zia.ssl-inspection.rules.md (SSL/TLS inspection rule order, predefined and default rules, limits)
- links-to references/_meta/text/zia/zia.time-intervals.limits.md (Time interval limits: object cap, per-rule cap and name characters)
- links-to references/_meta/text/zia/zia.time-intervals.time-windows.md (Time windows versus time intervals)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/time-intervals.md (config type)
- configured-via references/_meta/text/types/zia/time-windows.md (config type)
- see-also references/_meta/text/zia/zia.time-intervals.schema.md (Time interval fields: days, minutes and the single window)
