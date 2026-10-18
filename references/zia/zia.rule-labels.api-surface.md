{{crud-endpoints}} The label itself is small and its server-set members are fixed: {{read-only-fields}}

Listing: {{list-params}} {{go-getall-paginates}} Page boundaries and truncated reads are covered in [[shared.sdk-go.list-pagination]]. The Python SDK documents one more parameter on the list calls, which the contract does not {{divergence:list-search-param}}. In Go the lookup by name is local: {{go-name-lookup}}

**One call in a single SDK.** {{python-ruletype-endpoint}} Whether that call is a stable surface is open {{gap:rule-type-endpoint-backing}}.
