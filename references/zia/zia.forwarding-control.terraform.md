Terraform runs of ZPA-method rules are slow on purpose. {{zpa-delay}} A run that appears to hang for a minute per rule is this, not a failure. {{other-methods-unaffected}}

If the ZPA segment is not yet active when the rule is sent, the provider retries. {{zpa-retry}} A persistent failure with that message points at the Private Access segment (the segment is not, or is no longer, an active Source IP Anchored segment): [[zia.forwarding-control.sipa]].

Other provider behavior for this resource: required and forbidden fields per method are in [[zia.forwarding-control.methods]]; predefined rule handling in [[zia.forwarding-control.predefined-rules]]; the gateway resource's read workaround in [[zia.forwarding-control.zpa-gateway]]; selectors the provider never sends in [[zia.terraform.field-fidelity]]; order handling in [[zia.terraform.rule-order]].
