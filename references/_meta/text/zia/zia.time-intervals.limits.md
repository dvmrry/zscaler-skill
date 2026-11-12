# Time interval limits: object cap, per-rule cap and name characters (zia.time-intervals.limits)
Also called: how many time intervals; time interval limit; 64 intervals; times per rule; time interval name rules; time interval name digits

**How many intervals.** The limits table allows 64 time intervals per organization. [zia.time-intervals.limits:object-cap]

**How many per rule.** The same table lists "Times per Rule" as 8 times, in its "All Policy Rule Types" group. [zia.time-intervals.limits:times-per-rule-table] The rule pages and the Terraform schema cap it lower [divergence:zia.time-intervals.limits:per-rule-cap]. The other limits for firewall rules are in [Firewall rule, criteria and group limits](kb:zia.firewall.limits).

**What characters a name may contain.** For all features, string inputs accept letters, digits, underscores, hyphens, periods and spaces, must begin with a letter, digit, underscore, hyphen or period, and reject characters such as #, @ and $. [zia.time-intervals.limits:string-inputs] The sources disagree [divergence:zia.time-intervals.limits:name-characters]. The MCP workflow skill says the create tool validates the interval name client-side and raises ValueError before the API call; the tool's create function passes the name to the SDK as given (`name=args.name`). [zia.time-intervals.limits:mcp-name-check-absent] The server-side rule is open [gap:zia.time-intervals.limits:name-server-rule].

What to check:
1. Whether a URL Filtering or Firewall Filtering rule carries more than two time intervals, since the rule pages and Terraform schema cap it at two.
2. Whether the name is limited to letters and spaces, such as `Business Hours`, which the sources accept under every reading.

Sources disagree (name both sides):
- How many time intervals one rule may carry: the limits table says 8, the URL Filtering, Bandwidth Control and Mobile App Store Control Help pages say up to two, and the Terraform firewall schema caps the list at 2. [divergence:zia.time-intervals.limits:per-rule-cap]
  - zscaler-help: Eight times per rule, on any policy.
  - zscaler-help: URL Filtering takes up to two intervals.
  - zscaler-help: Bandwidth Control takes up to two time intervals.
  - zscaler-help: Mobile App Store Control takes up to two time windows.
  - tf-zia: The Terraform firewall filtering schema allows two.
  Impact: Planning more than two schedule windows on one rule may be refused by the console or by Terraform even though the table allows eight; the per-rule cap may differ by rule type.
- Which characters a time interval name may contain: the MCP server describes ASCII letters and spaces only, the limits table allows digits, underscores, hyphens and periods, and the Python SDK's own example name contains digits and an underscore. [divergence:zia.time-intervals.limits:name-characters]
  - mcp-server: Names are ASCII letters and spaces only (a field description; the create function forwards the name unvalidated).
  - mcp-server: ZIA rejects digits and special characters, and the tool validates client-side and raises ValueError before the API call.
  - zscaler-help: String inputs for all features accept digits, underscores, hyphens, periods and spaces.
  - sdk-python: The SDK examples create and update intervals with names containing digits and an underscore.
  Impact: A name such as `Q1 Maintenance` may be accepted or rejected; the safe choice is letters and spaces only until observed. The skill's claim of client-side validation does not match the tool code, which sends the name as given.

Not known (open gaps):
- The server-side rule for time interval names [gap:zia.time-intervals.limits:name-server-rule]: settled by lab-test or support-ticket

Area: zia.time-intervals, its subjects in references/_meta/spine/zia/zia.time-intervals.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- decided-by references/_meta/text/zia/zia.time-intervals.evaluation.md (What a rule does outside its time interval), from zia.time-intervals: A rule with a time interval does not trigger when the resolved time falls outside the interval. [zia.time-intervals.evaluation:outside-window-generalized]
- decided-by references/_meta/text/zia/zia.time-intervals.timezone.md (Which time zone a time interval is evaluated in), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- interacts-with references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match), from zia.time-intervals: An out-of-window rule yields no verdict of its own: evaluation continues down the ordered list, so an allow rule limited to business hours stops allowing after hours and the outcome depends on the rules below it, ending at the default rule. [zia.time-intervals.evaluation:falls-through]
- links-to references/_meta/text/zia/zia.firewall.limits.md (Firewall rule, criteria and group limits)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/time-intervals.md (config type)
- see-also references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many)
- see-also references/_meta/text/zia/zia.time-intervals.schema.md (Time interval fields: days, minutes and the single window)
