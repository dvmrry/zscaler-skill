# Alerting on Cloud Connector health: event and metrics feeds and console checks (cloud-connector.insights.alerting)
Also called: cloud connector alerts; cloud connector alerting; cloud connector down notification; cloud connector snmp; cloud connector zdx; cloud connector self-traffic

Connector health reaches an operator through streamed records or through checks run in the console. This subject sets out both and what is still open.

**Through a SIEM.** Alerting on connector state runs through a SIEM: Event logs are written on status changes of health checks, tunnels and upgrades and Metrics logs on resource usage, both streamed by NSS feeds, while the captured monitoring pages are refreshed manually. [cloud-connector.insights.alerting:siem-alerting-path] Whether the console can notify by email or webhook is open [gap:cloud-connector.insights.alerting:native-notifications], and so is whether alerts travel over Log and Control Forwarding [gap:cloud-connector.insights.alerting:alerts-via-lc].

**Console checks.** The Azure and AWS troubleshooting checks for the connectivity from the Cloud Connector to Internet & SaaS include that the Internet Access Gateway is populated in the Admin Console, session logs display the Cloud Connector self-traffic, and tunnel insights are displayed. [cloud-connector.insights.alerting:connectivity-checks] The checks for seeing connector traffic in ZIA and ZPA are in [Cloud Connector logs: which log types exist and where to read them](kb:cloud-connector.logs).

**Other tools.** Whether connector VMs can be polled with SNMP is open [gap:cloud-connector.insights.alerting:snmp]. Whether ZDX reports anything about Cloud Connectors is open [gap:cloud-connector.insights.alerting:zdx]. Cloud-provider health alarms on the load balancer belong to the deployment, in [How cloud load balancers spread traffic across Cloud Connectors and take unhealthy ones out](kb:cloud-connector.overview.load-balancing).

What to check:
1. Whether the tenant has an Event feed to its SIEM, without which connector state changes leave no streamed record.
2. Whether session logs show the connector's own self-traffic and Tunnel Insights shows traffic, when connectivity to Internet & SaaS is in doubt.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.insights.alerting:siem-alerting-path] Tier B: Chain of evidence from the event and metrics feed articles and the monitoring page; it rests on no captured article describing a console notification, which is not proof that none exists.

Not known (open gaps):
- Whether the console notifies on connector state changes [gap:cloud-connector.insights.alerting:native-notifications]: settled by source-read or support-ticket. Blocks: choosing between a SIEM-built alert and a console notification for a connector going Inactive
- Whether connector VMs can be monitored with SNMP [gap:cloud-connector.insights.alerting:snmp]: settled by source-read. Blocks: integrating connectors into an SNMP-based network monitoring system
- Whether ZDX reports Cloud Connector health or performance [gap:cloud-connector.insights.alerting:zdx]: settled by source-read. Blocks: choosing a monitoring toolchain for connectors
- Whether connector alerts travel over Log and Control Forwarding [gap:cloud-connector.insights.alerting:alerts-via-lc]: settled by source-read or lab-test. Blocks: deciding whether a broken Log and Control path also silences connector alerts

Area: cloud-connector.insights, its subjects in references/_meta/spine/cloud-connector/cloud-connector.insights.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.logs.event-records.md (Cloud Connector event logs: state changes for health, tunnels, gateways and upgrades): Alerting on connector state runs through a SIEM: Event logs are written on status changes of health checks, tunnels and upgrades and Metrics logs on resource usage, both streamed by NSS feeds, while the captured monitoring pages are refreshed manually. [cloud-connector.insights.alerting:siem-alerting-path]
- depends-on references/_meta/text/cloud-connector/cloud-connector.nss-va.md (NSS for Cloud & Branch Connector: how connector logs reach a SIEM): Both Cloud Connector and Branch Connector can generate Session, DNS, Event and Metrics logs, and an NSS feed specifies which log data the NSS sends to the SIEM. [cloud-connector.nss-va:log-types]
- links-to references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.load-balancing.md (How cloud load balancers spread traffic across Cloud Connectors and take unhealthy ones out)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.insights.md (Monitoring Cloud Connectors: which surface answers which question)
- see-also references/_meta/text/cloud-connector/cloud-connector.logs.metrics-records.md (Cloud Connector metrics logs: VM, instance and resource samples)
