# IoT Report through the API: REST, Z-Insights GraphQL, SDKs, MCP (zia.iot.api-surface)
Also called: iotDiscovery; iot deviceList; iot deviceTypes; iot_report sdk; zins iot device_stats; zins_get_iot_device_stats; iot terraform; iot api permission

There are two ways to read IoT data programmatically, with different contents: the ZIA REST endpoints give the device inventory, and Z-Insights GraphQL gives counts.

**REST (per device).** Four read-only GET endpoints under the ZIA API back the report: /iotDiscovery/deviceTypes, /iotDiscovery/categories, /iotDiscovery/classifications and /iotDiscovery/deviceList. [zia.iot.api-surface:rest-endpoints] The IoT Report has no create, update or delete operation: the OpenAPI spec lists only GET for these paths and the Go SDK exposes only four read functions. [zia.iot.api-surface:no-write-operations] The three taxonomy endpoints each return an array of objects with `uuid`, `name` and `parent_uuid`; `parent_uuid` does not apply to device types. [zia.iot.api-surface:taxonomy-response-shape] deviceList returns an object with `cloudName`, `customerId` and a `devices` array; each device has `locationId`, `deviceUuid`, `ipAddress`, `deviceTypeUuid`, `autoLabel`, `classificationUuid`, `categoryUuid`, and `flowStartTime` and `flowEndTime` as epoch-second integers. [zia.iot.api-surface:device-list-shape] The deviceList records carry only UUIDs for device type, category and classification, so their names come from joining to the three taxonomy lists, which return name with uuid. [zia.iot.api-surface:device-names-from-taxonomy] What the levels and UUIDs mean is in [How IoT devices are classified: type, category, classification](kb:zia.iot.classification).

**Go SDK.** The Go SDK's GetDeviceTypes, GetIOTCategories and GetIOTClassifications decode the response into a single `CommonIOTReport` struct, but the endpoints return arrays, so the decode would be expected to fail rather than return the taxonomy. Use the REST call for the taxonomy. [zia.iot.api-surface:go-taxonomy-decodes-into-struct]

**GraphQL (aggregates).** The Z-Insights GraphQL API has an IOT domain whose `device_stats` query returns `devices_count`, `iot_devices_count`, `user_devices_count`, `server_devices_count`, `un_classified_devices_count` and `entries` (each with `classifications`, `classification_uuid`, `category` and `total`). [zia.iot.api-surface:graphql-device-stats] device_stats returns aggregate counts and per-classification totals, not per-device records. [zia.iot.api-surface:graphql-aggregates-only] `filter_by` accepts `classifications`, `classification_uuid` and `category`, each a StringFilter (`eq`, `ne`, `in_list`, `nin` in the Python SDK); `order_by` accepts `classifications`, `classification_uuid`, `category` and `total`. [zia.iot.api-surface:graphql-filter-order] The IOT device_stats query takes no start or end time: it reflects the present network state, not a time-windowed log slice. [zia.iot.api-surface:graphql-no-time-window] A Z-Insights GraphQL API client is registered with Authentication Service and given a role; the default role is Zscaler Insights Reader. [zia.iot.api-surface:graphql-role]

**MCP.** The MCP tool `zins_get_iot_device_stats` is read-only, takes only `limit` (1 to 1000, default 50) and returns the single stats object with the per-classification `entries`. An empty or zeroed result means no IoT devices were detected or IoT Device Visibility is not enabled. [zia.iot.api-surface:mcp-tool]

**Terraform.** The ZIA Terraform provider has no resource or data source for the IoT Report. Its only IoT surface is the IoT flags on the location management resource (`iot_discovery_enabled` and `iot_enforce_policy_set`) and, on the location data source, `iot_discovery_enabled` alone, which is read back (`d.Set`); the data source does not expose `iot_enforce_policy_set`. [zia.iot.api-surface:no-terraform]

The inventory is only as complete as location discovery allows: [What the IoT Report discovers, and what it takes to get data](kb:zia.iot.discovery). Which role the REST calls need is open [gap:zia.iot.api-surface:rest-permissions].

What to check:
1. Which role the REST calls need, since the integration test for them may fail on permissions.

Inferred, not quoted (say so when an answer rests on one):
- [zia.iot.api-surface:no-write-operations] Tier B: Rests on a search: the spec paths carry only a get member, and iotreport.go defines only the four Get functions.
- [zia.iot.api-surface:go-taxonomy-decodes-into-struct] Tier B: Derived from reading: the OpenAPI response is an array and the Go client unmarshals the body straight into the struct. Not run against a tenant; encoding/json rejects an array into a struct.
- [zia.iot.api-surface:no-terraform] Tier B: Rests on a search of the pinned provider for IoT-named resources and data sources, and on the location data source containing no iot_enforce_policy_set.
- [zia.iot.api-surface:graphql-aggregates-only] Tier B: Derived from the query: its selection set holds only counts and entries, with no IP address or device fields; per-device data is REST deviceList.
- [zia.iot.api-surface:device-names-from-taxonomy] Tier B: Assumes the UUIDs in the device record are the same identifiers as the taxonomy uuid values; the field names suggest it but no source says it.

Not known (open gaps):
- What role or entitlement the /iotDiscovery REST endpoints need [gap:zia.iot.api-surface:rest-permissions]: settled by tenant-data or support-ticket. Blocks: diagnosing a permission error from the IoT REST endpoints

Area: zia.iot, its subjects in references/_meta/spine/zia/zia.iot.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.iot.classification.md (How IoT devices are classified: type, category, classification): The deviceList records carry only UUIDs for device type, category and classification, so their names come from joining to the three taxonomy lists, which return name with uuid. [zia.iot.api-surface:device-names-from-taxonomy]
- scoped-by references/_meta/text/zia/zia.iot.discovery.md (What the IoT Report discovers, and what it takes to get data), from zia.iot: The report is filtered to locations that have IoT discovery enabled, and a location must have IoT enabled on the Location Management page for a report to be generated for it. [zia.iot.discovery:per-location-enable]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.rule-types.md (Cloud App Control categories (rule types), limits and predefined rules), from zia.iot: Cloud App Control rules apply to IoT devices from a location or sublocation that has Enforce IoT Policy Control enabled, to devices the AI/ML engine identified and classified (for example printers, sensors) under the IoT group in the Device Groups criterion. [zia.iot.policy-use:cac-iot-needs-enforce]
- scoped-by references/_meta/text/zia/zia.locations.groups.md (Location groups: manual and dynamic, conditions, limits, predefined groups), from zia.iot: Targeting IoT traffic through the IoT Traffic Group selects by the location's type, so it covers every device at that location, not only IoT-classified ones. [zia.iot.policy-use:group-is-by-location]

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/shared/shared.analytics.graphql.md (The Analytics (Z-Insights) GraphQL API: endpoint, access and scope)
