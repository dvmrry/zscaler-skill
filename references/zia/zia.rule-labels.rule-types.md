{{terraform-rule-types-with-labels}} The vendor help text speaks only of grouping "all your organization's policies" ([[zia.rule-labels]]), so the provider schema is the working enumeration; treat a type missing from it as unknown, not as unsupported.

**Reference by ID.** {{reference-by-id}} {{terraform-data-source-by-name}} {{terraform-import}} {{traffic-capture-one-label}} Other per-rule and per-tenant limits are in [[zia.rule-labels.constraints]].

**Listing rules by label.** {{openapi-label-filter}} {{python-sdk-label-filter}} Whether the filter works on rule lists beyond the documented ones is open {{gap:label-filter-server-support}}. Make sure the rule list is complete first, because paginated reads can return a partial set: [[zia.url-filtering.list-pagination]], [[shared.sdk-go.list-pagination]].

Order and rank of the labelled rules are not affected by the label; see [[zia.url-filtering.rule-order]], [[zia.firewall.rule-order]] and [[zia.terraform.rule-order]].
