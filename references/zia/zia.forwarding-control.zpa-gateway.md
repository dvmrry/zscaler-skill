Source IP Anchoring needs an object on the ZIA side that a rule can point at. {{zia-side-object}} {{segments-follow-group}}

**Fields.** {{fields}} {{sdk-requires-segments}}

**From the rule.** A ZPA rule needs a gateway and segments (see [[zia.forwarding-control.methods]]). {{rule-needs-common-gateway}} In Terraform, {{needs-zpa-provider}}

**Provider behavior.** {{auto-gateway-name}} What the Auto ZPA Gateway does is not stated by any captured source (gap `auto-gateway-behavior`). {{read-via-get-all}} Check the real segments on the tenant rather than trusting a by-ID read through another client.

The Private Access side that makes the anchoring work is in [[zia.forwarding-control.sipa]]; the ZPA-method delay is in [[zia.forwarding-control.terraform]].
