Whatever the provisioning method, the result is the same three objects, and the same limits apply.

**Users.** {{user-id-form}} **Departments.** {{one-department}} **Groups.** {{groups-per-user}} The cap appears as 128 in two articles and 127 in the limits table, which the divergence record keeps visible; the over-cap behavior and whether the cap can be raised are open questions. A rule that depends on a user's membership in many groups should be checked against the cap first.

Provisioning is not the only way these objects arrive. {{added-in-policy}}

**Sizes.** {{org-limits}} {{name-lengths}} Per-rule caps (for example 32 users, groups or departments on a rule) belong to each rule type, see [[zia.firewall.limits]] and [[zia.forwarding-control.rules]].

The SCIM attribute names that populate these fields are in [[zia.scim.attribute-mapping]], and how SCIM groups and departments land is in [[zia.scim.groups-and-departments]].

What to check: the user's group count, whether the user really has a single department, and whether the group or department already exists before a rule is scoped to it.
