# Which ZIA rule types accept rule labels (zia.rule-labels.rule-types)
Also called: rule types with labels; labels attribute; which policies support rule labels; rule_label filter; ruleLabel parameter; label by id
Former IDs: zia-31

The ZIA Terraform provider documents a `labels` attribute on fifteen rule resources: firewall filtering, firewall DNS, firewall IPS, NAT control, traffic capture, URL filtering, SSL inspection, DLP web, file type control, Cloud App Control, forwarding control, sandbox, bandwidth control, and SaaS Security (CASB) DLP and malware. [zia.rule-labels.rule-types:terraform-rule-types-with-labels] The vendor help text speaks only of grouping "all your organization's policies" ([ZIA Rule Labels](kb:zia.rule-labels)), so the provider schema is the working enumeration; treat a type missing from it as unknown, not as unsupported.

**Reference by ID.** A rule references a label by numeric `id` (the Terraform examples pass `data.zia_rule_labels.this.id`), so one label can be attached to rules of different types and renaming it leaves the references intact. [zia.rule-labels.rule-types:reference-by-id] The `zia_rule_labels` data source looks a label up by `name`, and rule resources take its `id` in the `id` set of their `labels` block. [zia.rule-labels.rule-types:terraform-data-source-by-name] The `zia_rule_labels` resource can be imported by label ID or by label name. [zia.rule-labels.rule-types:terraform-import] The Terraform provider documents that a traffic capture rule takes at most one label. [zia.rule-labels.rule-types:traffic-capture-one-label] Other per-rule and per-tenant limits are in [ZIA rule label limits and constraints](kb:zia.rule-labels.constraints).

**Listing rules by label.** In the OpenAPI contract only the Cloud Firewall filtering rule list (and its count) accepts a `ruleLabel` filter, described as filtering rules by rule labels using the specified keywords. [zia.rule-labels.rule-types:openapi-label-filter] The Python SDK documents a `rule_label` list filter on firewall rules and on traffic capture rules, and on no other rule list. [zia.rule-labels.rule-types:python-sdk-label-filter] Whether the filter works on rule lists beyond the documented ones is open [gap:zia.rule-labels.rule-types:label-filter-server-support]. Make sure the rule list is complete first, because paginated reads can return a partial set: [Listing URL Filtering rules and URL categories without truncation](kb:zia.url-filtering.list-pagination), [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination).

Order and rank of the labelled rules are not affected by the label; see [URL Filtering rule order and first match](kb:zia.url-filtering.rule-order), [Firewall rule order, admin rank and predefined rules](kb:zia.firewall.rule-order) and [How the ZIA Terraform provider applies rule order](kb:zia.terraform.rule-order).

What to check:
1. Which rule list accepts a label filter (`ruleLabel` or `rule_label`) before relying on one: for any other rule type, read each rule's `labels` member instead.

Inferred, not quoted (say so when an answer rests on one):
- [zia.rule-labels.rule-types:terraform-rule-types-with-labels] Tier B: Provider documentation of the client schema, not a vendor list of policy types; the help text does not enumerate types, so a rule type absent from the provider docs is unknown rather than unsupported.
- [zia.rule-labels.rule-types:reference-by-id] Tier B: The by-ID reference is shown by the provider example; that a rename leaves rule references untouched is inferred from it plus the label update call changing only the label object, not observed.
- [zia.rule-labels.rule-types:traffic-capture-one-label] Tier B: Provider documentation; whether the API enforces the same limit is not shown.
- [zia.rule-labels.rule-types:openapi-label-filter] Tier B: Absence claim: every query parameter of every path in zia.openapi.json was scanned for a name containing `label`; only these two paths matched (beyond the ruleLabels paths themselves).
- [zia.rule-labels.rule-types:python-sdk-label-filter] Tier B: Absence claim: grep of zscaler/zia/*.py for `rule_label` finds the two docstrings below and nothing on other rule lists.

Not known (open gaps):
- Whether label filtering works on rule lists beyond the documented ones [gap:zia.rule-labels.rule-types:label-filter-server-support]: settled by lab-test. Blocks: relying on a label query parameter to select URL filtering, DLP or other rules

Area: zia.rule-labels, its subjects in references/_meta/spine/zia/zia.rule-labels.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/zia/zia.firewall.rule-order.md (Firewall rule order, admin rank and predefined rules)
- links-to references/_meta/text/zia/zia.rule-labels.md (ZIA Rule Labels)
- links-to references/_meta/text/zia/zia.rule-labels.constraints.md (ZIA rule label limits and constraints)
- links-to references/_meta/text/zia/zia.terraform.rule-order.md (How the ZIA Terraform provider applies rule order)
- links-to references/_meta/text/zia/zia.url-filtering.list-pagination.md (Listing URL Filtering rules and URL categories without truncation)
- links-to references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match)
