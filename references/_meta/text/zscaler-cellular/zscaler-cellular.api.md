# The Zscaler Cellular (ZCell) API: customer scoping, clients and where the contract and SDK disagree (zscaler-cellular.api)
Also called: zcell api; client.zcell; zcellcustomerid; zcell_customer_id; cellular api customer id; zcell audit metadata; zcell python sdk

ZCell's operations, paths, request and response fields and the Python SDK's modules and methods are generated: run `node scripts/kb.mjs surface zcell` and read `vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json`. This subject holds what the generated layer does not.

**Calling it.** The OneAPI base path is in [The guide's base paths are: ZIA `/zia/api/v1`; ZPA `/zpa/mgmtconfig/v1`, `/zpa/mgmtconfig/v2` and `/zpa/userconfig/v1` (the last for SCIM attribute and group endpoints); ZDX `/zdx/v1`; Authentication Service `/ziam/admin/api/v1`; Client Connector `/zcc/papi/public/v1`; Cloud & Branch Connector `/ztw/api/v1`; Business Insights `/bi/api/v1`; EASM `/easm/easm-ui/v1`; Cellular `/zcell/config/api/v1`; Event Monitoring & Notification `/event-monitoring`; Unified RBAC `/urbac/urbac`; AI Security `/aisecurity/aispm/v1` (AI Infrastructure) and `/aisecurity/airt/api/v2` (AI Red Teaming); AI Guard `/aiguard/v1`.](kb:shared.oneapi.base-urls:base-path-table). The Python SDK reaches ZCell only through OneAPI, as `client.zcell`, with no legacy client. [zscaler-cellular.api:oneapi-only] ZCell endpoints are scoped to a customer in the `/customers/{id}` path; the SDK takes that ID from the `zcellCustomerId` config attribute or the `ZCELL_CUSTOMER_ID` environment variable and injects it, independently of ZPA's `customerId`, while authentication uses the same ZIdentity OAuth2 credentials as other products. [zscaler-cellular.api:customer-scoping] An explicit `id` argument on a ZCell method wins over the `zcellCustomerId` config attribute, which wins over `ZCELL_CUSTOMER_ID`. [zscaler-cellular.api:id-precedence] The OneAPI Postman collection sets `{{ZCellBaseUrl}}` to `{{oneAPIBaseUrl}}/zcell/config` and appends `/api/v1/...` to it, with the customer ID as the `:id` path variable, for example `{{ZCellBaseUrl}}/api/v1/customers/:id/sims/search`. [zscaler-cellular.api:postman-base-url] The OneAPI guide's own note on the Cellular customer ID is [Cellular requests likewise need a `customer_id`, the customer's Cellular tenant ID (spelled 'Celullar' in the guide).](kb:shared.oneapi.base-urls:cellular-customer-id).

**Clients.** The Python SDK and the MCP server are the only clients for ZCell: no Go SDK package, Terraform resource or Ansible module covers it. [zscaler-cellular.api:python-only] The MCP tools are a read subset: [The Zscaler MCP server's ZCell tools: 20 reads, the customer ID, time windows, prompts and gaps](kb:zscaler-cellular.mcp).

**Audit metadata.** The SDK's `list_audit_metadata` calls `/audit/metadata` under the ZCell base endpoint `/zcell/config/api/v1`, and the MCP server exposes it as `zcell_list_audit_metadata`. [zscaler-cellular.api:sdk-audit-metadata] The contract does not publish that path [divergence:zscaler-cellular.api:audit-metadata]. The Postman collection's 36 Cellular requests are the same method-and-path set as the contract's 36 operations, so it adds no ZCell endpoint; like the contract it has no audit metadata request (`/audit/metadata`), which only the SDK and MCP server call. [zscaler-cellular.api:postman-matches-contract]

**Wire notes.** Paging, time windows, SIM search, violations, SIM lock and tower-location history are in [ZCell wire notes: paging, time windows, SIM search, violations, audit search, SIM lock and tower history](kb:zscaler-cellular.api.wire-notes). SIM location group writes through the SDK are in [Python SDK SIM location group writes: the geofence is dropped on create and snake_case keys are ignored](kb:zscaler-cellular.sdk-python.location-groups). Entitlement is open in [Zscaler Cellular: Zscaler SIM, Cellular Edge and how SIM traffic reaches ZIA and ZPA policy](kb:zscaler-cellular.overview).

What to check:
1. Whether the ZCell customer ID (not ZPA's customerId) is set as zcellCustomerId or ZCELL_CUSTOMER_ID, or passed as id.

Inferred, not quoted (say so when an answer rests on one):
- [zscaler-cellular.api:python-only] Tier B: Rests on the generated surface for zcell, which lists Python modules and no Go packages or Terraform resources, and on a grep of the Go SDK's zscaler/ tree (packages zcc, zdx, zia, ziam, zpa, ztw, zwa) and of the ZIA and ZPA Ansible plugins at their pins for zcell and cellular found nothing.
- [zscaler-cellular.api:postman-matches-contract] Tier B: Comparison of every request in the collection whose URL starts with `{{ZCellBaseUrl}}` (36, all under the Cellular API folder) against the 36 method/path pairs of automate-zscaler/openapi/zcell.openapi.json at the pin, with `:param` read as `{param}`; a search of the collection for audit/metadata finds nothing.

Sources disagree (name both sides):
- The SDK and MCP server call an audit metadata endpoint that the captured API contract does not publish. [divergence:zscaler-cellular.api:audit-metadata]
  - sdk-python: The SDK builds `/zcell/config/api/v1/audit/metadata` for `list_audit_metadata`.
  - api-specs: The contract's paths include audit search but no audit metadata path.
  Impact: Whether `/audit/metadata` still works is unknown; the contract's absence does not show the backend retired it, and the SDK's presence does not show a tenant accepts it.

Area: zscaler-cellular.api, its subjects in references/_meta/spine/zscaler-cellular/zscaler-cellular.api.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/shared/shared.oneapi.base-urls.md (OneAPI hosts and per-product base paths): The OneAPI Postman collection sets `{{ZCellBaseUrl}}` to `{{oneAPIBaseUrl}}/zcell/config` and appends `/api/v1/...` to it, with the customer ID as the `:id` path variable, for example `{{ZCellBaseUrl}}/api/v1/customers/:id/sims/search`. [zscaler-cellular.api:postman-base-url]
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.api.wire-notes.md (ZCell wire notes: paging, time windows, SIM search, violations, audit search, SIM lock and tower history)
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.mcp.md (The Zscaler MCP server's ZCell tools: 20 reads, the customer ID, time windows, prompts and gaps)
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.overview.md (Zscaler Cellular: Zscaler SIM, Cellular Edge and how SIM traffic reaches ZIA and ZPA policy)
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.sdk-python.location-groups.md (Python SDK SIM location group writes: the geofence is dropped on create and snake_case keys are ignored)
