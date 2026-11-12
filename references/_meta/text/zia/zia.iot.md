# ZIA IoT Report and IoT policy (zia.iot)
Also called: iot; iot report; iot devices; iot visibility; iot discovery policy; device visibility

IoT questions come in four kinds.

1. **Why is a location or device missing from the report, and what does the report mean?** [What the IoT Report discovers, and what it takes to get data](kb:zia.iot.discovery).
2. **What does a type, category, classification, UUID or Unknown mean?** [How IoT devices are classified: type, category, classification](kb:zia.iot.classification).
3. **Can a rule target IoT devices, and what must a location enable first?** [How IoT traffic is targeted by policy](kb:zia.iot.policy-use).
4. **How do I pull the data programmatically?** [IoT Report through the API: REST, Z-Insights GraphQL, SDKs, MCP](kb:zia.iot.api-surface).

The predefined IoT Traffic Group is in [Location groups: manual and dynamic, conditions, limits, predefined groups](kb:zia.locations.groups) and the Cloud App Control IoT predefined rules are in [Cloud App Control categories (rule types), limits and predefined rules](kb:zia.cloud-app-control.rule-types); they are linked here, not repeated.

Area: zia.iot, its subjects in references/_meta/spine/zia/zia.iot.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.cloud-app-control.rule-types.md (Cloud App Control categories (rule types), limits and predefined rules): Cloud App Control rules apply to IoT devices from a location or sublocation that has Enforce IoT Policy Control enabled, to devices the AI/ML engine identified and classified (for example printers, sensors) under the IoT group in the Device Groups criterion. [zia.iot.policy-use:cac-iot-needs-enforce]
- scoped-by references/_meta/text/zia/zia.iot.discovery.md (What the IoT Report discovers, and what it takes to get data): The report is filtered to locations that have IoT discovery enabled, and a location must have IoT enabled on the Location Management page for a report to be generated for it. [zia.iot.discovery:per-location-enable]
- scoped-by references/_meta/text/zia/zia.locations.groups.md (Location groups: manual and dynamic, conditions, limits, predefined groups): Targeting IoT traffic through the IoT Traffic Group selects by the location's type, so it covers every device at that location, not only IoT-classified ones. [zia.iot.policy-use:group-is-by-location]
- links-to references/_meta/text/zia/zia.iot.api-surface.md (IoT Report through the API: REST, Z-Insights GraphQL, SDKs, MCP)
- links-to references/_meta/text/zia/zia.iot.classification.md (How IoT devices are classified: type, category, classification)
- links-to references/_meta/text/zia/zia.iot.policy-use.md (How IoT traffic is targeted by policy)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/locations.md (config type)
- configured-via references/_meta/text/shared/shared.analytics.graphql.md (The Analytics (Z-Insights) GraphQL API: endpoint, access and scope)
