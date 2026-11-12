# The Cloud & Branch Connector Dashboard: Traffic Monitoring widgets, Geo View, monitoring table and Traffic Flow (cloud-connector.insights.dashboard)
Also called: traffic monitoring page; throughput across services; sessions across services; geo view cloud connector; traffic flow cloud connector; dns monitor cloud connector

The Traffic Monitoring page of the Dashboard shows the name, group, location, throughput and session data across services of a Cloud or Branch Connector, and a Refresh icon refreshes the dashboard to the most recent information. [cloud-connector.insights.dashboard:scope] Cloud Connectors can be filtered under AWS Regions, Azure and GCP and Branch Connectors under Branch Connector Locations; the filter is Any by default, which means no filter is applied. [cloud-connector.insights.dashboard:location-filters]

**Widgets.** The Throughput Across Services chart displays the throughput of traffic flowing through Zscaler Internet Access (ZIA), Zscaler Private Access (ZPA), Direct, and Log & Control, in Mbps. [cloud-connector.insights.dashboard:throughput-widget] The Sessions Across Services chart displays the session count data of ZIA, ZPA, Direct, and Log & Control. [cloud-connector.insights.dashboard:sessions-widget] Clicking a cluster in the Geo View shows the Cloud and Branch Connectors in a region with their cloud provider type (AWS, Azure, GCP, Branch Cloud), and clicking a connector shows its throughput and session count data. [cloud-connector.insights.dashboard:geo-view] No refresh cadence or retention is given for the widgets, and the time filter's default and range are not given [gap:cloud-connector.insights.dashboard:widget-time-range].

**Monitoring table.** The monitoring table lists, for each connector, the throughput and session data forwarded through ZIA, through ZPA and directly, and its View icon opens the Traffic Flow page. [cloud-connector.insights.dashboard:monitoring-table]

**Traffic Flow.** The Traffic Flow page's Session Count Trend lists the session count across the Internet & SaaS, Private Access, Direct, Log & Control GW, and total services, and a Log & Control GW figure gives the session count forwarded through the Log and Control gateway. [cloud-connector.insights.dashboard:traffic-overview] The Traffic Flow page defines Rx Bytes as the number of inbound bytes received by the service per second and Tx Bytes as the number of inbound bytes transmitted by the service per second. [cloud-connector.insights.dashboard:total-traffic] What "inbound" means in the Tx Bytes definition is open [gap:cloud-connector.insights.dashboard:tx-bytes-definition]. Selecting a point on a Traffic Flow graph shows the value for that time period, and Click for more info displays the session logs, with real-time log consolidation for each transaction. [cloud-connector.insights.dashboard:drill-to-logs]

**DNS.** The Traffic Flow page's DNS Monitor table displays data about the DNS traffic configured by the DNS Filtering Rule, with Block silently blocking matching requests and responses and Resolve by ZPA asking the connector to resolve requests using the Private Access IP pool; a DNS Transaction Trend lists transactions allowed, blocked or resolved by Private Access. [cloud-connector.insights.dashboard:dns-overview] The rule and its actions are in [Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules](kb:cloud-connector.dns.policies).

What to check:
1. For DNS traffic handled by the DNS Filtering Rule, the DNS Monitor's blocked and resolved-by-Private-Access counts, with the rule's actions in the DNS policies subject.

Not known (open gaps):
- Time range, refresh cadence and retention of the Dashboard widgets [gap:cloud-connector.insights.dashboard:widget-time-range]: settled by lab-test or source-read. Blocks: saying how recent or how old a Dashboard figure is
- What the Tx Bytes definition's "inbound" means [gap:cloud-connector.insights.dashboard:tx-bytes-definition]: settled by lab-test or support-ticket

Area: cloud-connector.insights, its subjects in references/_meta/spine/cloud-connector/cloud-connector.insights.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.dns.policies.md (Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.insights.md (Monitoring Cloud Connectors: which surface answers which question)
- see-also references/_meta/text/cloud-connector/cloud-connector.insights.connector-status.md (Cloud Connector status: what Active, Inactive and Disabled mean, and the per-VM API record)
- see-also references/_meta/text/cloud-connector/cloud-connector.insights.analytics.md (Cloud Connector Insights pages and Insights logs: time range, aggregation and limits)
