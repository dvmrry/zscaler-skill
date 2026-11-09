# ZIA Insights: the Admin Console's traffic charts, log viewer and dashboards (zia.insights)
Also called: insights pages; web insights; firewall insights; dns insights; tunnel insights; threat insights; data explorer insights; analyze chart

The Insights pages chart each transaction processed by Zscaler on a chart type of the admin's choice and drill down through filters and operators, for Web, Mobile, Firewall, DNS, Tunnel, Threat (which the page calls different from the other Insights pages), SaaS Security, Endpoint DLP, Email DLP and Extranet traffic. [zia.insights:traffic-types]

**Where to look.** Insights charts a traffic family ([ZIA Insights chart settings: units, chart types, top-N, filters, history and the data types that appear only on an Insights page](kb:zia.insights.data-types)); the Logs tab lists the transactions ([ZIA Insights Logs: log families, time frame, export and background queries, filters and console-only columns](kb:zia.insights.logs)), and what a record's fields mean is per family: [What a ZIA web log record is and how its fields are named](kb:zia.logs.web-records), [What a ZIA firewall log record is: aggregates, action and field names](kb:zia.logs.firewall-records), [What happened to a DNS query: rules, actions, response values and errors](kb:zia.logs.dns-outcome), [What a ZIA tunnel log record is: log types, tunnel status, event reasons and sample counters](kb:zia.logs.tunnel-records), [CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming](kb:zia.casb.insights-logs). Dashboards and widgets: [ZIA dashboards, widgets and notes: predefined dashboards, limits, units, time frames and drill-down](kb:zia.insights.dashboards). Streaming the same logs out: [How NSS feeds encode and deliver ZIA log fields](kb:zia.logs.nss-feed-format). Retention and consolidation latency: [The ZIA Insights Logs article says logs are stored for 180 days in the Zscaler Nanolog servers, and that NSS, a virtual machine, can stream web traffic logs in real time from the Nanolog to a SIEM, enabling real-time alerting, correlation with the logs of firewalls and other devices, and long-term local log archival.](kb:shared.log-correlation.streams:zia-retention). The Cloud Connector counterpart is [Cloud Connector Insights pages and Insights logs: time range, aggregation and limits](kb:cloud-connector.insights.analytics).

**From a chart to transactions.** Analyze Chart on a dashboard or report chart opens it on an Insights page for drill-down to individual transactions; an analysis can also start from the Logs tab of any Insights page. [zia.insights:analyze-chart]

**Threat Insights.** Threat Insights (Cyberthreat Protection > Insights > Threat Insights) shows organization-specific threats as paths from origins to targets on a 2D map or a 3D globe, with top threat names, categories, origins and targets that can be sorted by trending, severity or volume. [zia.insights:threat-insights]

**Zscaler Support.** Zscaler Support can view Tunnel Insights even if remote assistance is disabled; the Insights and the Insights Logs articles both say so. [zia.insights:support-tunnel-view]

**Open.** Whether the chart data is reachable through an API is open [gap:zia.insights:insights-api].

What to check:
1. Which Insights page a question belongs to, remembering that Threat Insights is described as different from the other Insights pages.
2. Whether an analysis of a dashboard or report chart can continue to individual transactions through Analyze Chart.

Not known (open gaps):
- Whether the Insights chart data has an API [gap:zia.insights:insights-api]: settled by source-read

Area: zia.insights, its subjects in references/_meta/spine/zia/zia.insights.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.insights.analytics.md (Cloud Connector Insights pages and Insights logs: time range, aggregation and limits)
- links-to references/_meta/text/shared/shared.log-correlation.streams.md (Where ZIA, ZPA and Client Connector logs can be read, and for how long)
- links-to references/_meta/text/zia/zia.casb.insights-logs.md (CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming)
- links-to references/_meta/text/zia/zia.insights.dashboards.md (ZIA dashboards, widgets and notes: predefined dashboards, limits, units, time frames and drill-down)
- links-to references/_meta/text/zia/zia.insights.data-types.md (ZIA Insights chart settings: units, chart types, top-N, filters, history and the data types that appear only on an Insights page)
- links-to references/_meta/text/zia/zia.insights.logs.md (ZIA Insights Logs: log families, time frame, export and background queries, filters and console-only columns)
- links-to references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors)
- links-to references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)
- links-to references/_meta/text/zia/zia.logs.tunnel-records.md (What a ZIA tunnel log record is: log types, tunnel status, event reasons and sample counters)
- links-to references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)
