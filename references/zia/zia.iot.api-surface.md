There are two ways to read IoT data programmatically, with different contents: the ZIA REST endpoints give the device inventory, and Z-Insights GraphQL gives counts.

**REST (per device).** {{rest-endpoints}} {{no-write-operations}} {{taxonomy-response-shape}} {{device-list-shape}} {{device-names-from-taxonomy}} What the levels and UUIDs mean is in [[zia.iot.classification]].

**Go SDK.** {{go-taxonomy-decodes-into-struct}}

**GraphQL (aggregates).** {{graphql-device-stats}} {{graphql-aggregates-only}} {{graphql-filter-order}} {{graphql-no-time-window}} {{graphql-role}}

**MCP.** {{mcp-tool}}

**Terraform.** {{no-terraform}}

The inventory is only as complete as location discovery allows: [[zia.iot.discovery]]. Which role the REST calls need is open {{gap:rest-permissions}}.
