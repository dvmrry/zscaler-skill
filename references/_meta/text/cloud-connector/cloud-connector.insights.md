# Monitoring Cloud Connectors: which surface answers which question (cloud-connector.insights)
Also called: cloud connector monitoring; cloud connector insights; branch connector monitoring; cloud connector health; cloud connector dashboard; insights api cloud connector

Cloud and Branch Connector health and traffic are visible in the Admin Console, in streamed logs, and in a few API reads. This subject points each question at the surface that answers it.

**Fleet and status.** The Cloud & Branch Connector Monitoring pages show the name, group, location, geolocation and status of deployed connector VMs, and are refreshed on demand with a Refresh icon. [cloud-connector.insights:monitoring-pages] What Active, Inactive and Disabled mean, and what the API reports per VM, is in [Cloud Connector status: what Active, Inactive and Disabled mean, and the per-VM API record](kb:cloud-connector.insights.connector-status).

**Traffic.** The Insights pages (Session, DNS and Tunnel Insights) chart each transaction processed by the Zscaler service and let an admin drill down with filters and operators. [cloud-connector.insights:insights-pages] Their controls, logs pages and limits are in [Cloud Connector Insights pages and Insights logs: time range, aggregation and limits](kb:cloud-connector.insights.analytics). The Dashboard's Traffic Monitoring and Traffic Flow pages are in [The Cloud & Branch Connector Dashboard: Traffic Monitoring widgets, Geo View, monitoring table and Traffic Flow](kb:cloud-connector.insights.dashboard).

**Programmatic access.** No Insights or Insights-logs read appears in the Cloud & Branch Connector API: the captured API reference has no path for Session, DNS or Tunnel insights or their logs, and the help's API overview lists no such feature. [cloud-connector.insights:no-insights-api] Streamed logs are the programmatic path, in [Cloud Connector logs: which log types exist and where to read them](kb:cloud-connector.logs) and [NSS for Cloud & Branch Connector: how connector logs reach a SIEM](kb:cloud-connector.nss-va). Upgrade state has its own API read, in [Watching Cloud Connector upgrades: VM record fields, upgrade metrics and upgrade events](kb:cloud-connector.upgrades.monitoring).

**Alerts.** How state changes reach an operator is in [Alerting on Cloud Connector health: event and metrics feeds and console checks](kb:cloud-connector.insights.alerting).

What to check:
1. Whether the question is about connector state (Monitoring page, VM record) or about traffic (Insights, session logs), before choosing a surface.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.insights:no-insights-api] Tier B: Rests on a search: the 96 paths of the captured Cloud & Branch Connector OpenAPI document contain no insight path (the only log-like paths are the audit log report and its download), and the API overview's feature list names no Insights area. The console offers a log Download (cloud-connector.insights.analytics:insights-logs-pages), which is not an API.

Area: cloud-connector.insights, its subjects in references/_meta/spine/cloud-connector/cloud-connector.insights.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.insights.alerting.md (Alerting on Cloud Connector health: event and metrics feeds and console checks)
- links-to references/_meta/text/cloud-connector/cloud-connector.insights.analytics.md (Cloud Connector Insights pages and Insights logs: time range, aggregation and limits)
- links-to references/_meta/text/cloud-connector/cloud-connector.insights.connector-status.md (Cloud Connector status: what Active, Inactive and Disabled mean, and the per-VM API record)
- links-to references/_meta/text/cloud-connector/cloud-connector.insights.dashboard.md (The Cloud & Branch Connector Dashboard: Traffic Monitoring widgets, Geo View, monitoring table and Traffic Flow)
- links-to references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them)
- links-to references/_meta/text/cloud-connector/cloud-connector.nss-va.md (NSS for Cloud & Branch Connector: how connector logs reach a SIEM)
- links-to references/_meta/text/cloud-connector/cloud-connector.upgrades.monitoring.md (Watching Cloud Connector upgrades: VM record fields, upgrade metrics and upgrade events)
