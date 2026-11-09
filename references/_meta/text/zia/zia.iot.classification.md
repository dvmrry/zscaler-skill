# How IoT devices are classified: type, category, classification (zia.iot.classification)
Also called: iot device type category classification; iot taxonomy; iot uuid; autoLabel; iot classification uuid; unknown device type

**Hierarchy.** Classification is a three-level hierarchy: a device category's parent is a device type, and a device classification's parent is a device category. [zia.iot.classification:three-level-parentage] Each discovered device record carries a device-type UUID, a category UUID and a classification UUID, plus `autoLabel`, a label the AI/ML engine generates to describe the device's prominent characteristics. [zia.iot.classification:device-carries-all-levels]

**Names need a lookup.** The UUID-to-name mappings for device types, categories and classifications are served by three separate read-only GET endpoints; a device record holds only UUIDs, so names need a lookup against those lists. [zia.iot.classification:taxonomy-served-by-endpoints] The endpoints and record fields are in [IoT Report through the API: REST, Z-Insights GraphQL, SDKs, MCP](kb:zia.iot.api-surface).

**Unknown and the evaluation window.** A device the engine cannot classify lands in the Unknown device type, which the help page defines as devices not classified due to limited information for the AI/ML engine. [zia.iot.classification:unknown-means-limited-information] Each device record has `flowStartTime` and `flowEndTime`, in epoch seconds, marking when the engine started and stopped evaluating the device's weblog records. [zia.iot.classification:evaluation-window] How long a device stays in view and when a location starts producing data is in [What the IoT Report discovers, and what it takes to get data](kb:zia.iot.discovery).

**Categories and feedback.** The Discovered Devices page's device categories include Automotive, Business & Industrial, Consumer Electronics, Laptops & Desktops, Networking & Storage, Servers, Smart Home & Office, Smart Phones, Tablets & Watches, and Unknown. [zia.iot.classification:categories] The feedback form's classification list includes, for example, Point of Sale & Money Handling, Industrial Automation & Controls, Healthcare, Lab & Dental, Virtual Machines, Load Balancers and IoT Platform. [zia.iot.classification:classification-examples] An admin can provide feedback when a device classification seems inaccurate or the AI/ML engine classified a device as Unknown for limited information in the IoT Discovery Report, selecting Other from the classification list and adding a suggested classification name and related details in the Description field. Zscaler analyzes and validates the feedback before it is updated to the AI/ML engine and reflected in the IoT Discovery Report, and replies to the work email address the admin enters. [zia.iot.classification:feedback]

The inputs, thresholds and confidence of the engine are open [gap:zia.iot.classification:classification-inputs]; see the input-signals gap in [What the IoT Report discovers, and what it takes to get data](kb:zia.iot.discovery).

What to check:
1. Whether stored UUIDs are still current, since whether they are stable across model updates is open.

Inferred, not quoted (say so when an answer rests on one):
- [zia.iot.classification:taxonomy-served-by-endpoints] Tier B: Chain of evidence: the deviceList schema has UUID fields and no name fields, while the three taxonomy endpoints return uuid, name and parent_uuid.

Not known (open gaps):
- Whether taxonomy UUIDs are stable across Zscaler model updates [gap:zia.iot.classification:uuid-stability]: settled by support-ticket or tenant-data. Blocks: storing UUIDs in automation or filters
- What evidence the engine needs to assign a classification [gap:zia.iot.classification:classification-inputs]: settled by support-ticket or lab-test

Area: zia.iot, its subjects in references/_meta/spine/zia/zia.iot.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.iot.discovery.md (What the IoT Report discovers, and what it takes to get data): The IoT Report shows the device inventory discovered from unauthenticated web traffic; Zscaler's AI/ML engine classifies all unauthenticated devices automatically to help generate it. [zia.iot.discovery:report-scope]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.rule-types.md (Cloud App Control categories (rule types), limits and predefined rules), from zia.iot: Cloud App Control rules apply to IoT devices from a location or sublocation that has Enforce IoT Policy Control enabled, to devices the AI/ML engine identified and classified (for example printers, sensors) under the IoT group in the Device Groups criterion. [zia.iot.policy-use:cac-iot-needs-enforce]
- scoped-by references/_meta/text/zia/zia.locations.groups.md (Location groups: manual and dynamic, conditions, limits, predefined groups), from zia.iot: Targeting IoT traffic through the IoT Traffic Group selects by the location's type, so it covers every device at that location, not only IoT-classified ones. [zia.iot.policy-use:group-is-by-location]
- links-to references/_meta/text/zia/zia.iot.api-surface.md (IoT Report through the API: REST, Z-Insights GraphQL, SDKs, MCP)
