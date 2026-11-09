# The ZMS GraphQL API: one endpoint, read-only clients, customer scoping and pagination (zms.api)
Also called: zms graphql; /zms/graphql; zms api; client.zms; zmicroseg; zms pagination pagenum; zms fetchall; eyezid; zms mutations
Former IDs: zms-01

ZMS is programmed through GraphQL. The generated surface lists the Python SDK modules and methods (run `node scripts/kb.mjs surface zms`); this subject holds the conventions every query shares.

**Endpoint and clients.** The SDK's ZMS modules send every query as a POST to the single endpoint `/zms/graphql`. [zms.api:graphql-endpoint] The service is reached as `client.zms` or `client.zmicroseg` and uses OneAPI authentication only. [zms.api:oneapi-only] The Go SDK has no ZMS service, and no Terraform provider or Ansible collection manages ZMS; the Python SDK and the MCP server are the only clients. [zms.api:python-only]

**Reads only.** ZMS is read-only: the MCP conventions say there are no mutations, and the release notes that added the SDK's ZMS service (1.9.18) describe its nine modules with list operations plus a few gets (agent group TOTP secrets, a nonce by ID, resource group members). [zms.api:clients-read-only] Whether the API itself has mutations is disputed [divergence:zms.api:mutations] and open [gap:zms.api:write-api]. The portal's writes are in [The portal's write actions (accepting, editing, ignoring or deleting recommendations; adding, editing and deleting namespaces, tags and AppZones) have no published programmatic operation: the captured pages describe only the UI, and the Python SDK and MCP clients implement reads only.](kb:zms.portal:portal-no-contract).

**Arguments.** The queries take a required `customerId` variable, typed `ID!` in, for example, `ListAgents`, `ListResources` and `GetNonce`, and `String!` in `GetMetadata`; SDK methods such as `list_agents`, `get_nonce` and `get_metadata` take it as `customer_id`, the first argument after `self`. [zms.api:customer-id] Agents, agent groups and nonces are identified by a non-numeric `eyezId`, which the agent-group TOTP-secrets query and the single-nonce query type as `String!`. [zms.api:eyez-id] The types come only from the SDK's query strings [gap:zms.api:schema].

**Pagination.** Two pagination argument pairs exist: agents, agent groups and nonces take `page` and `pageSize`, while resources, resource groups, policy rules, app zones, app catalog and tags take `pageNum` and `pageSize`; the SDK defaults are page 1 and page size 20. [zms.api:pagination-dialects] List queries return a connection of `nodes` plus `pageInfo` with `pageNumber`, `pageSize`, `totalCount` and `totalPages`. [zms.api:page-info] `policyRules` takes a `fetchAll` flag (`fetch_all`, default False) that bypasses pagination; the MCP notes say to use it sparingly on large tenants. [zms.api:fetch-all] No other ZMS list method in the SDK carries a `fetchAll` argument. [zms.api:fetch-all-policy-rules-only] Whether the server accepts fetchAll elsewhere is open [gap:zms.api:fetch-all-server].

**Results.** The SDK's ZMS methods return the raw dictionary under the query's name in the GraphQL response's `data` member, rather than a typed model. [zms.api:raw-dicts] The typed classes in `zscaler/zms/models/common.py` (for example `AgentEntry`, which maps only part of the agents selection) are not what the query methods return, so the selection set in each module, not those classes, shows which fields come back. [zms.api:typed-models-unused]

**What is not implemented.** The resource-groups module's docstring lists getting recommended resource groups (ML-based), but the module defines only `list_resource_groups`, `get_resource_group_members` and `get_resource_group_protection_status`. [zms.api:recommended-groups-docstring] The SDK's ZMS enums module defines enums such as `RecommendedResourceGroupUserActionType`, `RecommendedTagUserActionType`, `MLRunStatus`, `MLRunType`, `AgentManagerStatus`, `PodPhase`, `TagScope` and `TagAssignmentUserAction`; the release notes count 35 enums and 17 input filter types. [zms.api:unused-enums] No implemented ZMS query uses these enums: `RecommendedResourceGroupUserActionType`, `RecommendedTagUserActionType`, `MLRunStatus`, `MLRunType`, `AgentManagerStatus`, `PodPhase`, `TagScope` and `TagAssignmentUserAction`. [zms.api:unused-enums-unreferenced] The ML and Kubernetes query surfaces are open [gap:zms.api:ml-surfaces].

**More.** Per-domain query notes are in [What each ZMS GraphQL query takes and returns: agents, resources, groups, rules, zones, catalog, tags](kb:zms.api.queries), enum values and filter inputs in [ZMS enum values and GraphQL filter inputs from the Python SDK](kb:zms.api.enums-and-filters), and the MCP tools in [The Zscaler MCP server's ZMS tools: inventory, customer ID and known defects](kb:zms.mcp).

What to check:
1. Which pagination pair the domain uses (page or pageNum) before paging a ZMS query.
2. Whether an expected field is in the module's query selection, since the methods return the raw GraphQL dict.
3. Whether a write is needed at all: no client implements ZMS mutations.

Inferred, not quoted (say so when an answer rests on one):
- [zms.api:python-only] Tier B: Rests on the generated surface for zms, which lists Python modules and no Go packages or Terraform resources, and on a grep of the Go SDK's zscaler/ tree (packages zcc, zdx, zia, ziam, zpa, ztw, zwa) and of the ZIA and ZPA Ansible plugins at their pins for microseg and /zms/ found nothing.
- [zms.api:typed-models-unused] Tier B: Rests on raw-dicts and a search of the SDK tree at the pin: no ZMS module imports `AgentEntry`; only `zscaler/zms/models/__init__.py` re-exports `common`.
- [zms.api:fetch-all-policy-rules-only] Tier B: Rests on a search of the nine zscaler/zms modules at the pin for fetchAll and fetch_all: only policy_rules.py has it.
- [zms.api:unused-enums-unreferenced] Tier B: Rests on a search of the SDK's zscaler/zms tree at the pin for each of the eight names: none occurs outside zscaler/zms/models/enums.py, so no query module or its selection set refers to them.

Sources disagree (name both sides):
- Two MCP sources disagree on whether the ZMS API has mutations. [divergence:zms.api:mutations]
  - mcp-server: ZMS has no mutations and is read-only.
  - mcp-server: The API supports create, update and delete mutations (for example policyRuleCreate, managedResourceGroupCreate, managedRecommendedResourceGroupUpdate) and a recommendedResourceGroups query, not yet exposed as MCP tools.
  Impact: Whether ZMS policy can be automated through the API is unsettled: no SDK, schema or Help page names the mutations, while the portal does perform writes.

Not known (open gaps):
- Whether the server accepts fetchAll on queries other than policyRules [gap:zms.api:fetch-all-server]: settled by lab-test or source-read. Blocks: answering how to fetch a complete list without paging on other ZMS queries
- Which GraphQL mutations ZMS accepts [gap:zms.api:write-api]: settled by source-read or lab-test. Blocks: automating ZMS policy, resource groups or tags
- No authoritative GraphQL schema for ZMS [gap:zms.api:schema] (data gap): filled by none; settled by source-read. Blocks: trusting argument types and filter inputs beyond what the SDK sends
- Query names and shapes for recommended resource groups and ML runs [gap:zms.api:ml-surfaces]: settled by source-read. Blocks: reading ML recommendation runs or Kubernetes detail through the API

Area: zms.api, its subjects in references/_meta/spine/zms/zms.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token): The service is reached as `client.zms` or `client.zmicroseg` and uses OneAPI authentication only. [zms.api:oneapi-only]
- links-to references/_meta/text/zms/zms.api.enums-and-filters.md (ZMS enum values and GraphQL filter inputs from the Python SDK)
- links-to references/_meta/text/zms/zms.api.queries.md (What each ZMS GraphQL query takes and returns: agents, resources, groups, rules, zones, catalog, tags)
- links-to references/_meta/text/zms/zms.mcp.md (The Zscaler MCP server's ZMS tools: inventory, customer ID and known defects)
- links-to references/_meta/text/zms/zms.portal.md (The Microsegmentation portal: Application Catalog, ML tag recommendations, tags and AppZones)
