Groups and departments are two different ZIA objects, and SCIM fills both, in different ways. {{group-object}} The department is a user attribute, mapped in [[zia.scim.attribute-mapping]]; the object it must resolve to is the open question below.

**How rules see them.** {{policy-uses-groups}} {{zpa-contrast}} Where identity criteria are accepted, and what each rule type needs for them, is owned by the rule areas: [[zia.url-filtering.criteria]], [[zia.ssl-inspection.criteria]], [[zia.forwarding-control.rules]], [[zia.dlp.rules]] (including the rule for unauthenticated traffic) and [[zia.firewall.licensing]] (identity criteria need Advanced Firewall). Per-rule caps are in [[zia.firewall.limits]].

**Missing group.** {{unpushed-group}} The objects and limits are in [[zia.ad-integration.identity-objects]].

Two questions are open: what ZIA does with a department string that matches no department, and how a rule scoped to a never-created group behaves.

What to check: the connector's group scope, whether the group exists in ZIA at all, and whether the department string exactly equals an existing department name.
