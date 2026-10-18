**Which rules take an interval.** {{rule-types}} {{traffic-capture-rules}} A rule with no interval is not scheduled: {{default-always}}

{{rule-field-is-list}} {{time-in-rule-criteria}} The effect of being outside the window is in [[zia.time-intervals.evaluation]].

**SSL Inspection is disputed.** The API specification, the Go and Python SDKs and the Terraform schema all carry a `timeWindows` list on SSL Inspection rules, while the MCP server's workflow skill says there is no such attribute and sends the admin to Firewall Filtering or URL Filtering for a schedule. The conflict is divergence `ssl-inspection-time-windows`; whether the service honors the field is gap `ssl-time-enforced`. Until observed, do not rely on an SSL Inspection rule being time-gated; the rule list is in [[zia.ssl-inspection.rules]] (its order and exemption rules apply regardless of any schedule).

Rule types that do not appear in the list are tracked in gap `rule-types-without-time`, and ZPA's lack of a schedule criterion in `zpa-no-schedule`. Per-rule caps are in [[zia.time-intervals.limits]] and [[zia.firewall.limits]]. Which object supplies the ID is [[zia.time-intervals.time-windows]].
