{{terraform-rule-types-with-labels}} The vendor help text speaks only of grouping "all your organization's policies" ([[zia.rule-labels]]), so the provider schema is the working enumeration; treat a type missing from it as unknown, not as unsupported.

A rule points at a label by ID. {{reference-by-id}} {{terraform-data-source-by-name}} {{terraform-import}} {{traffic-capture-one-label}} Other per-rule and per-tenant limits are in [[zia.rule-labels.constraints]].

To list the rules that carry a label, there is a server-side filter on only some lists. {{openapi-label-filter}} {{python-sdk-label-filter}} For any other rule type, list the rules and read each rule's `labels` member rather than assuming the parameter works (gap `label-filter-server-support`). Make sure the rule list is complete first, because paginated reads can return a partial set: [[zia.url-filtering.list-pagination]], [[shared.sdk-go.list-pagination]].

Order and rank of the labelled rules are not affected by the label; see [[zia.url-filtering.rule-order]], [[zia.firewall.rule-order]] and [[zia.terraform.rule-order]].
