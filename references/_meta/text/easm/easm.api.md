# The EASM (ZEASM) API: organization scoping, clients, paging and the Postman collection (easm.api)
Also called: easm api; zeasm; client.zeasm; easm org_id; easm organizations; easm assets api; easm postman; external attack surface management api

Paths and methods are generated: run `node scripts/kb.mjs surface easm`, and read field descriptions and enums in `vendor/zscaler-api-specs/automate-zscaler/openapi/easm.openapi.json`. This subject holds how calls are scoped and paged and where the clients fall short.

**What it is.** The API is the External Attack Surface Management API; the Python SDK calls the product ZEASM and serves it at `/easm/easm-ui/v1`. [easm.api:name] The OneAPI base path is in [The guide's base paths are: ZIA `/zia/api/v1`; ZPA `/zpa/mgmtconfig/v1`, `/zpa/mgmtconfig/v2` and `/zpa/userconfig/v1` (the last for SCIM attribute and group endpoints); ZDX `/zdx/v1`; Authentication Service `/ziam/admin/api/v1`; Client Connector `/zcc/papi/public/v1`; Cloud & Branch Connector `/ztw/api/v1`; Business Insights `/bi/api/v1`; EASM `/easm/easm-ui/v1`; Cellular `/zcell/config/api/v1`; Event Monitoring & Notification `/event-monitoring`; Unified RBAC `/urbac/urbac`; AI Security `/aisecurity/aispm/v1` (AI Infrastructure) and `/aisecurity/airt/api/v2` (AI Red Teaming); AI Guard `/aiguard/v1`.](kb:shared.oneapi.base-urls:base-path-table), and the guide's example that drops the `/easm` prefix in [The same guide's EASM example request uses `https://api.zsapi.net/easm-ui/v1/organizations`, without the `/easm` prefix its base-path table gives.](kb:shared.oneapi.base-urls:easm-example-path).

**Organization first.** Organizations are listed with no arguments; the finding and lookalike methods take the organization ID first and build URLs under `/organizations/{org_id}`, using the `id` of an organization from that list. [easm.api:org-scoping] An organization has `id` and `name` (both strings); the organizations response also has `next_page`, `prev_page` and `total_results`. [easm.api:org-model] Whether tenants normally have several organizations is open [gap:easm.api:multi-org].

**Clients.** The SDK's `ZEASMService` exposes three resources, `organizations`, `findings` and `lookalike_domains`, added in release 1.9.6. [easm.api:sdk-resources] The asset endpoints (list assets, and an asset's certificates, services and technologies) are in the API contract but no SDK resource or MCP tool calls them. [easm.api:assets-api-only] No Go SDK package, Terraform resource or Ansible module covers EASM; the Python SDK and the MCP server are its only clients. [easm.api:python-only] The MCP tools are in [The Zscaler MCP server's EASM tools: inventory, full records and documentation mismatches](kb:easm.mcp).

**Paging.** Finding and lookalike list responses carry a results list and a total count (`results`, `total_results`) and no page fields, while the assets list returns `next_link` and `prev_link` URLs carrying a page offset. [easm.api:list-paging] The SDK's findings and lookalike-domains list methods take only the organization ID: their signatures have no paging, sorting or filter arguments. [easm.api:sdk-no-list-args] SDK responses support client-side filtering and projection over the current page of results with `resp.search(expression)` in JMESPath syntax. [easm.api:client-search]

**Postman.** The OneAPI Postman collection documents list-assets query parameters: `limit` (default 100, max 1000), `offset`, `sort`, `search`, `riskLevel`, `status`, `country`, `state`, `type`, `lastSeen`, `firstSeen` and `certificateExpiration`. [easm.api:postman-asset-params] The Postman list-lookalike-domains request carries `limit`, `offset`, `sort`, `search`, `status`, `riskLevel`, `riskCategory` and `deceptionMethods` query parameters. [easm.api:postman-lookalike-params] [divergence:easm.api:list-query-params] Three Postman EASM requests have malformed raw URLs: list assets appends an extra `}}` to `{{EASMBaseUrl}}`, get lookalike-domain details an extra `}`, and list lookalike domains omits the slash before `organizations`. [easm.api:postman-url-defects]

**Resources.** Findings are in [EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages](kb:easm.findings) and lookalike domains in [EASM lookalike domains: the raw-domain key, deception methods, risk categories and missing signals](kb:easm.lookalike-domains).

What to check:
1. Which organization ID the call uses: list organizations first and take the id.
2. For an asset inventory, whether a raw API call is needed, since no SDK or MCP client lists assets.
3. When copying a Postman EASM request, whether its raw URL is one of the three malformed ones.

Inferred, not quoted (say so when an answer rests on one):
- [easm.api:assets-api-only] Tier B: Rests on the generated surface for easm: the four /assets paths map to no Python method, and the MCP EASM toolsets list only organization, finding and lookalike tools.
- [easm.api:python-only] Tier B: Rests on the generated surface for easm, which lists Python modules and no Go packages or Terraform resources, and on a grep of the Go SDK's zscaler/ tree (packages zcc, zdx, zia, ziam, zpa, ztw, zwa) and of the ZIA and ZPA Ansible plugins at their pins for easm and zeasm found nothing.

Sources disagree (name both sides):
- The API contract lists no query parameters for the asset and lookalike lists; the Postman collection documents paging and filters for both. [divergence:easm.api:list-query-params]
  - api-specs: List assets takes only the Authorization header and the orgId path parameter.
  - api-specs: List assets takes limit, offset, sort, search and filter query parameters.
  Impact: Large inventories may need limit and offset, which only Postman documents and no SDK method sends; test them against a tenant before relying on them.

Not known (open gaps):
- How tenants use more than one EASM organization [gap:easm.api:multi-org]: settled by tenant-data or source-read. Blocks: answering which organization's findings a question is about

Area: easm.api, its subjects in references/_meta/spine/easm/easm.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.oneapi.base-urls.md (OneAPI hosts and per-product base paths)
- links-to references/_meta/text/easm/easm.findings.md (EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages)
- links-to references/_meta/text/easm/easm.lookalike-domains.md (EASM lookalike domains: the raw-domain key, deception methods, risk categories and missing signals)
- links-to references/_meta/text/easm/easm.mcp.md (The Zscaler MCP server's EASM tools: inventory, full records and documentation mismatches)
