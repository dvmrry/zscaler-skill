The API supports list, get, create, update and delete; clients differ in what they expose and in how lookup by name works.

**The API.** {{crud-endpoints}} {{postman-get-all-only}} {{field-types}}

**Listing and finding one by name.** {{list-paging}} {{no-name-filter}} {{go-getbyname-client-side}} Because the Go SDK walks every page for a name lookup, the general page-size and truncation hazards in [[shared.sdk-go.list-pagination]] apply to it; check the count against the console when a name is not found.

**MCP.** {{mcp-jmespath-query}} {{mcp-query-one-page}} {{mcp-read-only}} A name that is "not found" by MCP may exist on a later page; request further pages explicitly.

**Terraform.** {{tf-import}} {{tf-activation-guard}} The environment gate and what activation publishes are in [[zia.terraform.activation]]. {{console-activation}}

For what goes in `expressionJson` and which fields are writable in which tool, see [[zia.workload-groups.expressions]].
