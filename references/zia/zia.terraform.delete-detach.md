Before deleting a group, the provider edits the rules that reference it to drop the group. {{helper-purpose}} {{helper-callers}} The helper is generic in shape, but what it sweeps is fixed by its caller. {{helper-sweeps-firewall-filtering-rules-only}} {{helper-label-selects-nothing}}

**DNS application groups.** {{dns-group-delete-sweeps-src-ip-groups}} {{dns-rule-model-has-application-groups}} {{dns-group-references-not-detached}} {{dns-group-delete-can-strip-unrelated-source-groups}}

**Network service groups.** {{service-group-delete-sweeps-nw-application-groups}} {{filtering-rule-model-separates-service-groups}} {{service-group-references-not-detached}} {{service-group-delete-can-strip-unrelated-application-groups}}

**Failures during detach.** {{get-failure-skips-update-silently}} {{reread-result-discarded}} {{five-second-sleep-per-rule}} {{delete-follows-detach}} {{masked-read-failure-reaches-delete}}

Related provider behavior that also reports success without confirming the result is in [[zia.terraform.rule-order]], and staged changes after a write are covered in [[zia.terraform.activation]].
