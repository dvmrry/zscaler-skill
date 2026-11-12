# Cloud Connector metrics logs: VM, instance and resource samples (cloud-connector.logs.metrics-records)
Also called: cloud connector metrics log; cloud connector cpu memory; branch connector metrics; data-processing instance metrics; nodata metrics; cloud connector disk usage

Metrics logs are the streamed resource-usage samples of each connector. This subject covers their kinds, timing and missing values.

**Three kinds.** Each Cloud or Branch Connector generates three types of Metrics logs: VM (applicable to the whole VM), Instance (per data-processing instance) and Resource (per physical or logical resource that all data-processing instances use). [cloud-connector.logs.metrics-records:three-types] All three are collected at one-minute intervals, with one log line per minute for each connector, each data-processing instance and each resource respectively. [cloud-connector.logs.metrics-records:one-minute] Each Cloud or Branch Connector has between one and three data-processing instances, depending on the form factor. [cloud-connector.logs.metrics-records:instances-per-connector]

**Missing values.** Instance metrics carry a `nodata` field set to True when no data is available, which indicates an issue on the connector instance service in which the metrics samples were not collected. [cloud-connector.logs.metrics-records:nodata] On a resource line, metrics that do not apply to that resource type are set to zero or absent. [cloud-connector.logs.metrics-records:not-applicable]

**Use.** The vendor's stated use of VM metrics is SIEM-side alerts when CPU or memory utilization crosses a defined threshold, and of resource metrics is monitoring and notification on disk partition usage. [cloud-connector.logs.metrics-records:siem-thresholds] The state changes that accompany resource trouble are in [Cloud Connector event logs: state changes for health, tunnels, gateways and upgrades](kb:cloud-connector.logs.event-records).

What to check:
1. Whether a gap in instance metrics shows nodata set to True, which points at the connector instance service rather than at the feed.
2. Whether a zero metric on a resource line is a real value or a metric that does not apply to that resource type.

Area: cloud-connector.logs, its subjects in references/_meta/spine/cloud-connector/cloud-connector.logs.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/cloud-connector/cloud-connector.forwarding.log-and-control.md (Log and Control Forwarding: how a Connector's logs and control traffic reach the Zscaler cloud), from cloud-connector.logs: The policy configures the primary and secondary gateways used to set up control channels and forward logs. [cloud-connector.forwarding.log-and-control:gateways]
- depends-on references/_meta/text/cloud-connector/cloud-connector.nss-va.md (NSS for Cloud & Branch Connector: how connector logs reach a SIEM), from cloud-connector.logs: Both Cloud Connector and Branch Connector can generate Session, DNS, Event and Metrics logs, and an NSS feed specifies which log data the NSS sends to the SIEM. [cloud-connector.nss-va:log-types]
- links-to references/_meta/text/cloud-connector/cloud-connector.logs.event-records.md (Cloud Connector event logs: state changes for health, tunnels, gateways and upgrades)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them)
- see-also references/_meta/text/cloud-connector/cloud-connector.insights.alerting.md (Alerting on Cloud Connector health: event and metrics feeds and console checks)
