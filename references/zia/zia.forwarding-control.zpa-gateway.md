Source IP Anchoring needs an object on the ZIA side that a rule can point at. {{zia-side-object}} {{segments-follow-group}}

**Fields.** {{fields}} {{sdk-requires-segments}}

**From the rule.** {{rule-needs-common-gateway}} {{needs-zpa-provider}} The rule side is in [[zia.forwarding-control.methods]].

**Provider behavior.** {{auto-gateway-name}} What the Auto ZPA Gateway does is open {{gap:auto-gateway-behavior}}. {{read-via-get-all}}

The Private Access side that makes the anchoring work is in [[zia.forwarding-control.sipa]]; the ZPA-method delay is in [[zia.forwarding-control.terraform]].
