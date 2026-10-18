**Which rules take an interval.** {{rule-types}} {{traffic-capture-rules}} A rule with no interval is not scheduled: {{default-always}}

{{rule-field-is-list}} {{time-in-rule-criteria}} The effect of being outside the window is in [[zia.time-intervals.evaluation]].

**SSL Inspection is disputed.** The API specification, the SDKs and the Terraform schema carry a `timeWindows` list on SSL Inspection rules, while the MCP workflow skill says there is no such attribute {{divergence:ssl-inspection-time-windows}}. Whether the service honors the field is open {{gap:ssl-time-enforced}}. The rule list is in [[zia.ssl-inspection.rules]].

Rule types outside the list are open {{gap:rule-types-without-time}}, and whether ZPA has a schedule criterion is open {{gap:zpa-no-schedule}}. Per-rule caps are in [[zia.time-intervals.limits]] and [[zia.firewall.limits]]. Which object supplies the ID is [[zia.time-intervals.time-windows]].
