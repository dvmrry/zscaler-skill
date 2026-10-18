Before deleting a group, the provider edits the rules that reference it to drop the group. {{helper-purpose}} {{helper-callers}} The helper is generic in shape, but what it sweeps is fixed by its caller. {{helper-sweeps-firewall-filtering-rules-only}} {{helper-label-selects-nothing}}

Two callers sweep a field that, by the SDK models, does not hold the deleted object type. DNS application groups: {{dns-group-delete-sweeps-src-ip-groups}} {{dns-rule-model-has-application-groups}} {{dns-group-references-not-detached}} {{dns-group-delete-can-strip-unrelated-source-groups}}

Network service groups: {{service-group-delete-sweeps-nw-application-groups}} {{filtering-rule-model-separates-service-groups}} {{service-group-references-not-detached}} {{service-group-delete-can-strip-unrelated-application-groups}}

Separately, the helper hides a failure for any caller. {{get-failure-skips-update-silently}} {{reread-result-discarded}} {{five-second-sleep-per-rule}} {{delete-follows-detach}} {{masked-read-failure-reaches-delete}}

What to check: before destroying a DNS application group, list the DNS control rules that reference it (`applicationGroups`); before destroying a network service group, list the firewall filtering rules that reference it (`nwServiceGroups`). Detach it by hand or in the same plan. After a destroy, re-read the rules that used the group instead of trusting a successful apply. Whether ZIA refuses or accepts a delete with live references is unproven here (gap `in-use-enforcement`), as is whether the ID-only match can hit an unrelated object (gap `id-namespace`). Related provider behavior that also reports success without confirming the result is in [[zia.terraform.rule-order]], and staged changes after a write are covered in [[zia.terraform.activation]].
