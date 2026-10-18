Which SSL rule applies is a first-match question with three wrinkles: rules you did not write (predefined and default), read-only flags that break writes if echoed back, and a size ceiling on the rule set.

**Order.** {{ascending-order}} {{disabled-holds-slot}} {{inspect-before-exempt}}

**Predefined and default rules.** Every tenant starts with rules it did not write. {{predefined-rules}} {{default-rule}} A terminal rule you did not write still decides unmatched traffic, so read it before reasoning about "what happens to everything else". Whether the Default action interacts with URL Filtering's own default is still open: see [[zia.ssl-inspection.pipeline]].

In tenant data these rules are told apart by flags. {{marker-fields}} {{predefined-management}} When automating, on predefined rules {{strip-readonly-on-put}} The Terraform side of reordering is in [[zia.terraform.rule-order]].

**Size and shape.** {{rule-cap}} {{name-length}} {{no-pagination}}

Criteria are in [[zia.ssl-inspection.criteria]], actions in [[zia.ssl-inspection.actions]], and exemption design in [[zia.ssl-inspection.exemptions]].
