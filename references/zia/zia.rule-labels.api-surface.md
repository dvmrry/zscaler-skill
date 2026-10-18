{{crud-endpoints}} The label itself is small and its server-set members are fixed: {{read-only-fields}}

Listing: {{list-params}} {{go-getall-paginates}} Page boundaries and truncated reads are covered in [[shared.sdk-go.list-pagination]]. The Python SDK documents one more parameter on the list calls, which the contract does not (see divergence `list-search-param`); do not assume a server-side name search. In Go the lookup by name is local: {{go-name-lookup}}

One call exists in a single SDK only. {{python-ruletype-endpoint}} Treat it as unconfirmed until the gap `rule-type-endpoint-backing` is settled; the enum of rule types quoted in older notes is not in any pinned source.

What to check before scripting against labels: use only the five contract calls, read `referencedRuleCount` as a count of referencing rules ([[zia.rule-labels.delete]]), and do not infer name uniqueness from the by-name lookup ([[zia.rule-labels.constraints]]).
