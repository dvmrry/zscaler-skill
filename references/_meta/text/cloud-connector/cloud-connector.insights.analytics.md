# Cloud Connector Insights pages and Insights logs: time range, aggregation and limits (cloud-connector.insights.analytics)
Also called: session insights; dns insights; tunnel insights; insights logs download; insights 92 days; tunnel insights bytes; dpd received
Former IDs: cloud-connector-21

The Insights pages chart connector traffic, and each has a Logs tab with the underlying records. Their limits shape what an investigation in the console can show.

**Charts.** Session Insights is measured in Sessions or Bytes, DNS Insights in Transactions, and Tunnel Insights in DPD Received, Received Bytes, Received Packets, Sent Bytes and Sent Packets. [cloud-connector.insights.analytics:units] A custom time frame can end up to 92 days after its start date, and selecting multiple days shows the sum of bytes or transactions per day in whichever chart type is selected. [cloud-connector.insights.analytics:time-frame] For certain data types the chart can show the top 5, 10, 25, 50 or 100 items; trend and pie charts show only the top 5, with the rest grouped as Other. [cloud-connector.insights.analytics:top-n] How per-day aggregation treats day boundaries is open [gap:cloud-connector.insights.analytics:multi-day-aggregation].

**Working a chart.** Filters, some of which take multiple values, are applied with Apply Filters; hovering on a chart item and selecting Click for more info opens the logs for it. [cloud-connector.insights.analytics:drilldown] The history bar keeps up to 50 versions of the chart, deleting the oldest beyond that; changing an earlier version deletes all versions after it. [cloud-connector.insights.analytics:history-bar]

**Logs pages.** Each Insights page has a Logs tab (the Session, DNS and Tunnel logs pages) with filters, a custom time frame ending up to 92 days after its start, a choice of Display or Download, and selectable columns; downloads are in the time zone set on the My Profile page. [cloud-connector.insights.analytics:insights-logs-pages] How far back a query can start, against the 180-day storage in [Cloud & Branch Connector logs are stored for 180 days in the Zscaler Nanolog servers.](kb:cloud-connector.logs:nanolog-180), is open [gap:cloud-connector.insights.analytics:query-range-vs-retention]. A programmatic read of these logs is open [gap:cloud-connector.insights.analytics:insights-log-api].

**Tunnel Insights.** Besides Overall Traffic, a Tunnel Insights chart can break traffic down by Location, Tunnel Destination IP and Tunnel Source IP, and filters such as Location narrow it. [cloud-connector.insights.analytics:tunnel-data-types] Tunnel log byte and packet counts are taken from Zscaler's side over a one-minute sample interval: Bytes Received and Packets Received are what Zscaler received through the tunnel from the organization, and Bytes Sent and Packets Sent what Zscaler sent through the tunnel to the organization. [cloud-connector.insights.analytics:tunnel-bytes-perspective] Whether these byte counts match the session records for the same traffic is open [gap:cloud-connector.insights.analytics:byte-count-parity]. Whether a chart can be narrowed to one connector VM is open [gap:cloud-connector.insights.analytics:tunnel-per-connector], and what a fall in DPD Received means is open [gap:cloud-connector.insights.analytics:dpd-semantics].

**Session Insights filters.** Session Insights can be viewed by the data types Overall Traffic, Traffic Direction, TS Direction (traffic stream direction), Traffic Type, Connector Instance, Connector Group, Azure Subscription ID, Platform, Forwarding Rule, Forwarding Type and Location. [cloud-connector.insights.analytics:session-data-types] Session Insights filters include AWS Availability Zone (the zone where Cloud Connector for AWS is deployed), CC VM (traffic of one Cloud Connector VM), Cloud Connector Instance (the specific Zscaler software instance), Platform (the hypervisor or cloud platform), TS Direction (transmitted TX or received RX traffic) and Traffic Type (ZIA, ZPA or direct). [cloud-connector.insights.analytics:session-filters] The Traffic Direction filter's definition is cut off in the capture [gap:cloud-connector.insights.analytics:traffic-direction-definition]. Session Insights logs filters include Application Segment, Client Destination Name (for Advanced Firewall, a specific destination FQDN), Cloud Connector Source Port (the source port of the Cloud Connector used to connect to the forwarding gateway), Gateway Name, Network Service and Server Source Port. [cloud-connector.insights.analytics:session-log-filters]

**Tunnel Insights filters.** Tunnel Insights chart filters include Location (the default is All; the filter lists 200 results at a time with search fields), Tunnel Destination IP and Tunnel Source IP. [cloud-connector.insights.analytics:tunnel-chart-filters] The Tunnel Insights logs filters include a Data Center filter, and the Tunnel Destination IP and Tunnel Source IP filters can each take a range of IP addresses (for example 192.0.2.0-192.0.2.100) or a subnet mask (for example 192.0.2.0/24) when filtering by multiple IP addresses. [cloud-connector.insights.analytics:tunnel-log-filters]

**DNS Insights logs filters.** DNS Insights logs filters include DNS Gateway Flag, DNS Rule Name (the rule triggered by the DNS request, response or both), Protocol Type (TCP or UDP), Request Action (the action the DNS Control policy took), and a Requested Domain filter taking Contains, Starts With, Ends With, Exact Match, Does Not Contain, Does Not End With, Not Null or Is Null; locations can be included or excluded. [cloud-connector.insights.analytics:dns-log-filters] In the DNS Insights logs, the In Bytes filter limits the data to packets sent from the server to the client within a specific size range, and Out Bytes to packets the server received within a specific size range. [cloud-connector.insights.analytics:dns-bytes]

**Freshness.** How soon a transaction appears in Insights is open [gap:cloud-connector.insights.analytics:insights-latency].

What to check:
1. Whether the chart spans several days, in which case values are per-day sums and an intraday spike is hidden; narrow to one day.
2. Whether a trend or pie chart is hiding the item of interest in Other, since those charts show only the top 5.
3. Which side a tunnel byte count is measured from before comparing it with workload-side numbers.

Not known (open gaps):
- What the Traffic Direction filter limits the data to [gap:cloud-connector.insights.analytics:traffic-direction-definition]: settled by source-read
- Whether Tunnel Insights byte counts match session-record byte counts for the same traffic [gap:cloud-connector.insights.analytics:byte-count-parity]: settled by lab-test. Blocks: reconciling tunnel throughput with per-session volumes
- Whether Insights logs can be read through an API [gap:cloud-connector.insights.analytics:insights-log-api]: settled by source-read. Blocks: automating the export of connector Insights logs without an NSS feed
- How multi-day Insights charts aggregate per day [gap:cloud-connector.insights.analytics:multi-day-aggregation]: settled by lab-test or source-read. Blocks: comparing per-day Insights values with SIEM counts bucketed in another time zone
- How far back an Insights query can start [gap:cloud-connector.insights.analytics:query-range-vs-retention]: settled by lab-test. Blocks: deciding whether the console can answer a question about traffic more than a few months old
- Delay between a transaction and its appearance in Insights [gap:cloud-connector.insights.analytics:insights-latency]: settled by lab-test. Blocks: deciding during an incident whether missing Insights data is a delay or a real absence
- Whether Tunnel Insights can be narrowed to one connector VM [gap:cloud-connector.insights.analytics:tunnel-per-connector]: settled by lab-test. Blocks: isolating one failing connector's tunnel statistics
- What a drop in DPD Received means [gap:cloud-connector.insights.analytics:dpd-semantics]: settled by source-read or lab-test. Blocks: telling an upstream tunnel fault from a connector fault in Tunnel Insights

Area: cloud-connector.insights, its subjects in references/_meta/spine/cloud-connector/cloud-connector.insights.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.insights.md (Monitoring Cloud Connectors: which surface answers which question)
