# The Zscaler MCP server's ZMS tools: inventory, customer ID and known defects (zms.mcp)
Also called: zms mcp tools; zms_list_app_catalog error; zms tools zscaler_customer_id; microsegmentation mcp

The MCP server wraps the Python SDK's ZMS queries as tools. Toolset selection and entitlement filtering are shared with other products: [Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate](kb:shared.mcp-server.tool-inventory).

**Inventory and scoping.** The MCP server registers 20 ZMS tools in one `zms` toolset across nine domains, all read-only. [zms.mcp:tool-count] ZMS tools take the tenant ID from `ZSCALER_CUSTOMER_ID` in the server environment: `require_customer_id` reads it and, when it is missing, raises an error naming that variable. [zms.mcp:customer-id-env] Every ZMS tool calls `require_customer_id` for the tenant ID, and none takes the ID as a tool argument. [zms.mcp:customer-id-not-argument]

**Defects.** The app catalog tool builds its name and category filter by importing `AppCatalogFilter` from `zscaler.zms.models.inputs`, and the import runs only when a name or category is given; the class that SDK module defines for app catalog filters is `AppCatalogQueryFilter`. [zms.mcp:app-catalog-import] A `zms_list_app_catalog` call with a name or category filter fails with an import error before any request is sent; an unfiltered call works. [zms.mcp:app-catalog-filter-fails] The nonce tool's promised fields are in [Microsegmentation agent provisioning keys (nonces): portal, fields and API](kb:zms.provisioning-keys).

**Writes.** The ZMS audit skill names mutations that no client implements: [The ZMS GraphQL API: one endpoint, read-only clients, customer scoping and pagination](kb:zms.api).

What to check:
1. Whether ZSCALER_CUSTOMER_ID is set in the MCP server environment when ZMS tools fail.
2. For an app catalog call that errors, whether it passed a name or category filter.

Inferred, not quoted (say so when an answer rests on one):
- [zms.mcp:app-catalog-filter-fails] Tier B: Follows from app-catalog-import and a search of the SDK tree at the pin finding no AppCatalogFilter class; not observed on a running server.
- [zms.mcp:customer-id-not-argument] Tier B: Rests on a search of src/zscaler_mcp/tools/zms at the pin: each of the 20 tool functions sets customer_id from require_customer_id(), and no input model declares a customer_id field.

Area: zms.mcp, its subjects in references/_meta/spine/zms/zms.mcp.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zms/zms.api.md (The ZMS GraphQL API: one endpoint, read-only clients, customer scoping and pagination): The Go SDK has no ZMS service, and no Terraform provider or Ansible collection manages ZMS; the Python SDK and the MCP server are the only clients. [zms.api:python-only]
- links-to references/_meta/text/shared/shared.mcp-server.tool-inventory.md (Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate)
- links-to references/_meta/text/zms/zms.provisioning-keys.md (Microsegmentation agent provisioning keys (nonces): portal, fields and API)
