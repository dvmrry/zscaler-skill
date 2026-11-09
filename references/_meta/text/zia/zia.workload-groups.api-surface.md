# Reading and writing workload groups: API, SDKs, Terraform, MCP (zia.workload-groups.api-surface)
Also called: /workloadGroups; zia_workload_groups; GetByName workload group; list workload groups; workload group name lookup; zia_list_workload_groups; workload group pagination; import workload group

The API supports list, get, create, update and delete; clients differ in what they expose and in how lookup by name works.

**The API.** The ZIA API exposes list and create on `/workloadGroups`, and get, update (PUT) and delete on `/workloadGroups/{workloadGroupId}`; the Go SDK uses the endpoint `/zia/api/v1/workloadGroups`. [zia.workload-groups.api-surface:crud-endpoints] The OneAPI Postman collection has list, add, get-by-ID, update and delete requests for ZIA workload groups. [zia.workload-groups.api-surface:postman-full-crud] In the API contract, `lastModifiedBy` is a reference object with `id`, `name` (read-only) and optional `extensions`, and `lastModifiedTime` is an integer timestamp. [zia.workload-groups.api-surface:field-types]

**Listing and finding one by name.** Listing takes `page` and `pageSize`; the contract states a default page size of 250 and a maximum of 1,000, and the Python SDK documents the same. [zia.workload-groups.api-surface:list-paging] The list endpoint has no server-side name filter: the contract defines only `page` and `pageSize`, and the MCP workflow says to filter by name client-side. [zia.workload-groups.api-surface:no-name-filter] The Go SDK's `GetByName` reads every page and compares names with `strings.EqualFold`, so a lookup by name is client-side and case-insensitive. [zia.workload-groups.api-surface:go-getbyname-client-side] Because the Go SDK walks every page for a name lookup, the general page-size and truncation hazards in [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination) apply to it.

**MCP.** The MCP list tool takes only `page` and `page_size`; the bridge adds an optional JMESPath `query` applied to the results after the API call. [zia.workload-groups.api-surface:mcp-jmespath-query] A name lookup through the MCP `query` therefore filters only the page the API call returned, not the whole tenant, unless the caller pages through the results. [zia.workload-groups.api-surface:mcp-query-one-page] The MCP server exposes workload groups read-only; authoring them is left to the ZIA console. [zia.workload-groups.api-surface:mcp-read-only]

**Terraform.** The Terraform `zia_workload_groups` resource imports by numeric ID or, if the argument is not numeric, by name through `GetByName`; it exposes `group_id` as a computed alias for the ID. [zia.workload-groups.api-surface:tf-import] Create, update and delete of the Terraform resource trigger activation only when `ZIA_ACTIVATION` is set to a truthy value. [zia.workload-groups.api-surface:tf-activation-guard] The environment gate and what activation publishes are in [When the ZIA Terraform provider activates configuration](kb:zia.terraform.activation). In the console, a saved workload group change must be activated. [zia.workload-groups.api-surface:console-activation]

For what goes in `expressionJson` and which fields are writable in which tool, see [What a workload group expression can contain](kb:zia.workload-groups.expressions).

What to check:
1. Whether a name that MCP reports as not found sits on a later page, by requesting further pages explicitly.
2. Whether the count matches the console when a name is not found, since the Go lookup walks every page.

Inferred, not quoted (say so when an answer rests on one):
- [zia.workload-groups.api-surface:mcp-query-one-page] Tier B: Derived from the tool passing only page and page_size to the API and the bridge applying query after the call; no source tests a name lookup across pages.

Not known (open gaps):
- Whether name is required on create and the unit of lastModifiedTime [gap:zia.workload-groups.api-surface:name-required-and-epoch]: settled by lab-test. Blocks: stating validation behavior and converting the timestamp

Area: zia.workload-groups, its subjects in references/_meta/spine/zia/zia.workload-groups.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.workload-groups.expressions.md (What a workload group expression can contain), from zia.workload-groups: Membership comes from cloud-native metadata: workloads with user-defined tags and provider-defined attributes that match the group's expression belong to the group, and their traffic is forwarded by Cloud Connectors to the Zero Trust Exchange where the selected policies apply. [zia.workload-groups:cloud-metadata-source]
- depends-on references/_meta/text/cloud-connector/cloud-connector.workload-discovery.md (AWS workload discovery for Cloud Connector: what it is and how the pieces fit), from zia.workload-groups: The deployed workloads and their discovered tags can be viewed on the Cloud & Branch Connector Partner Integrations page in the Admin Console. [zia.workload-groups:discovered-in-cloud-connector]
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/zia/zia.terraform.activation.md (When the ZIA Terraform provider activates configuration)
