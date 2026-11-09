# Writing Analytics GraphQL queries: time range, units, limits, filters and open schema questions (shared.analytics.graphql-queries)
Also called: zins query start_time end_time milliseconds; WebTrafficUnits; TRANSACTIONS BYTES traffic_unit; zins limit pagination; zins obfuscated flag; categorize_by LOCATION_ID; zins filter_by StringFilter in; zins mutation
Former IDs: shared-31, shared-32, shared-33, shared-35, shared-36

A single request can carry several queries across data domains, and the guide's example declares the query variables `$start_time`, `$end_time` and `$unit`, noting that the same start_time and end_time values can be used across all queries. [shared.analytics.graphql-queries:multi-domain-request]

**Time range.** `start_time` and `end_time` are given in milliseconds (type `Long`), for example 1743552000000. [shared.analytics.graphql-queries:time-in-milliseconds]

**Units.** In the guide's multi-domain query example, the WEB_TRAFFIC queries `protocols`, `threat_super_categories` and `threat_class` take a `traffic_unit` bound to `$unit`, declared `WebTrafficUnits!`, and `user` passes `traffic_unit: TRANSACTIONS`; the example's variables set `unit` to `TRANSACTIONS`. [shared.analytics.graphql-queries:units-sample] The Python SDK's `WebTrafficUnits` enum defines `TRANSACTIONS` and `BYTES`. [shared.analytics.graphql-queries:sdk-web-traffic-units] Whether the server accepts `BYTES` is not yet confirmed [gap:shared.analytics.graphql-queries:bytes-unit].

**Limits and paging.** `limit` is an argument of a query's `entries` and sets the number of entries in that response, for example `entries(limit: 5)`. [shared.analytics.graphql-queries:limit-per-entries] Whether `limit` is the whole paging model, and what the default and maximum are, is open [gap:shared.analytics.graphql-queries:pagination]. The ZDX GraphQL API pages differently: The ZDX GraphQL API pages with a cursor: `first` (at most 1000) and `end_cursor` until `has_next_page` is false, with `end_cursor` an empty string on the last page. [shared.analytics.graphql-queries:zdx-graphql-cursor]

**Filtering, ordering and grouping.** `entries` takes a `filter_by` argument; the guide filters threat classes by name with an `in` list, for example `name: { in: ["BEHAVIORAL_ANALYSIS", "ADVANCED"] }`. [shared.analytics.graphql-queries:filter-in] Queries can also take `order_by`, `order` and `filter_by` options, depending on the use case. [shared.analytics.graphql-queries:other-options] The `CYBER_SECURITY` domain's `cyber_security_location` query takes `categorize_by`, for example `LOCATION_ID`, to group incidents by location, returning `id`, `name` and `total` entries. [shared.analytics.graphql-queries:categorize-by]

**Obfuscated names.** Several queries return an `obfuscated` field beside their `entries`, for example `casb_app` and the firewall `location_firewall`, `action`, `overall_traffic` and `network_service` queries. [shared.analytics.graphql-queries:obfuscated-field] What turns it on is open [gap:shared.analytics.graphql-queries:obfuscated-source].

**IoT device stats.** The IoT `device_stats` query takes no time window: [The IOT device_stats query takes no start or end time: it reflects the present network state, not a time-windowed log slice.](kb:zia.iot.api-surface:graphql-no-time-window). That question is largely settled [gap:shared.analytics.graphql-queries:iot-time-range].

**Schema.** The Python SDK's Z-Insights modules and the MCP server's Z-Insights tools send only GraphQL queries; neither contains a mutation. [shared.analytics.graphql-queries:sdk-queries-only] Whether the schema has mutations at all is open [gap:shared.analytics.graphql-queries:mutations], as is the full type and field inventory [gap:shared.analytics.graphql-queries:schema-inventory].

What to check:
1. Whether start_time and end_time are in milliseconds, not seconds.
2. Whether a result that looks short hit the entries limit rather than the end of the data.
3. Before reporting entity names from a response, whether its obfuscated flag is true.

Inferred, not quoted (say so when an answer rests on one):
- [shared.analytics.graphql-queries:sdk-queries-only] Tier B: Search of `zscaler/zins` in the Python SDK and `src/zscaler_mcp/tools/zins` in the MCP server for 'mutation' at the pins found nothing; an absence in clients does not show the schema has none.

Not known (open gaps):
- Whether WebTrafficUnits BYTES is accepted [gap:shared.analytics.graphql-queries:bytes-unit]: settled by lab-test or source-read. Blocks: telling a caller to request byte totals instead of transaction counts
- Paging and truncation in Z-Insights queries [gap:shared.analytics.graphql-queries:pagination]: settled by lab-test or source-read. Blocks: knowing whether a Z-Insights result is complete
- What sets the obfuscated flag [gap:shared.analytics.graphql-queries:obfuscated-source]: settled by source-read or tenant-data. Blocks: explaining masked names in Z-Insights results
- Whether IoT device_stats has a time window [gap:shared.analytics.graphql-queries:iot-time-range]: settled by source-read
- Whether the Z-Insights schema has mutations [gap:shared.analytics.graphql-queries:mutations]: settled by lab-test. Blocks: answering whether Z-Insights can change anything
- The Z-Insights type and field inventory [gap:shared.analytics.graphql-queries:schema-inventory] (data gap): filled by operator; settled by source-read or lab-test. Blocks: answering field-level questions without running introspection

Area: shared.analytics, its subjects in references/_meta/spine/shared/shared.analytics.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.iot.api-surface.md (IoT Report through the API: REST, Z-Insights GraphQL, SDKs, MCP)
