Every rule has one forward method, and the method decides which other fields are required, allowed or ignored. {{console-methods}} {{direct-meaning}}

The API and provider accept more values than the console shows. {{enum-values}} The published contract disagrees (divergence `contract-enum`). {{tf-doc-meanings}} A Dedicated IP rule also needs a gateway. {{dedicated-ip-gateway}} What ZIA, DROP, ECSELF and INVALID do, and what happens when no rule matches, is not stated by any captured source (gaps `method-semantics`, `no-match-default`).

**Terraform plan-time checks.** {{provider-field-requirements}} {{dest-fields-gate}} For ZPA, the rule needs a gateway and segments: see [[zia.forwarding-control.zpa-gateway]]. {{eczpa-selectors}} The provider never sends the ECZPA or IPv6 selectors it accepts: [[zia.terraform.field-fidelity]].

What to check when a plan is rejected: the rule's method, then the field named in the error. When a rule exists but forwards unexpectedly, read its `forwardMethod` from the tenant before reasoning about its fields; criteria and ordering are in [[zia.forwarding-control.rules]].
