There are two ways to read IoT data programmatically, with different contents: the ZIA REST endpoints give the device inventory, and Z-Insights GraphQL gives counts.

**REST (per device).** {{rest-endpoints}} {{no-write-operations}} {{taxonomy-response-shape}} {{device-list-shape}} What the levels and UUIDs mean is in [[zia.iot.classification]]. Names are not in the device records, so join to the taxonomy lists.

**Go SDK.** {{go-taxonomy-decodes-into-struct}}

**GraphQL (aggregates).** {{graphql-device-stats}} {{graphql-aggregates-only}} {{graphql-filter-order}} {{graphql-no-time-window}} {{graphql-role}}

**MCP.** {{mcp-tool}}

**Terraform.** {{no-terraform}}

The inventory is only as complete as location discovery allows: [[zia.iot.discovery]]. If a REST call returns a permission error, the required role is an open question on this subject; do not assume the Insights Reader role covers it.
