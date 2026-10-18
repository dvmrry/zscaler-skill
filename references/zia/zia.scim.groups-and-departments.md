Groups and departments are two different ZIA objects, and SCIM fills both, in different ways. {{group-object}} The department is a user attribute, mapped in [[zia.scim.attribute-mapping]]; what the department string must resolve to is open {{gap:department-no-match}}.

**How rules see them.** {{policy-uses-groups}} {{zpa-contrast}} Where identity criteria are accepted, and what each rule type needs for them, is owned by the rule areas: [[zia.url-filtering.criteria]], [[zia.ssl-inspection.criteria]], [[zia.forwarding-control.rules]], [[zia.dlp.rules]] (including the rule for unauthenticated traffic) and [[zia.firewall.licensing]] (identity criteria need Advanced Firewall). Per-rule caps are in [[zia.firewall.limits]].

**Missing group.** {{unpushed-group}} How a rule scoped to a never-created group behaves is open {{gap:missing-group-in-rules}}. The objects and limits are in [[zia.ad-integration.identity-objects]].
