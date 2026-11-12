# Cloud Connector session records: aggregation and rule attribution (cloud-connector.logs.session-records)
Also called: cloud connector session log; cloud connector aggregate logs; full session logs; aggregated session last session; forwarding rule logged as 0; self rule name cloud connector

A Cloud Connector session record can stand for one session or for an aggregate of many. Reading it correctly depends on which, and on which rule it names.

**Individual or aggregated.** A Session feed records Full Session Logs (every session of the rule individually, except HTTP and HTTPS), Aggregate Logs (sessions grouped by user, rule, network service and network application and recorded periodically), or both. [cloud-connector.logs.session-records:session-log-type] What a Full Session Logs feed records for HTTP and HTTPS sessions is open [gap:cloud-connector.logs.session-records:full-mode-http].

**Reading an aggregate.** In an aggregated record the client and server IP addresses and ports are those of the last session in the aggregate. [cloud-connector.logs.session-records:aggregate-last-session] In the console's Session Insights logs, Session Duration is in milliseconds and, for an aggregate, is the sum of the individual session durations. [cloud-connector.logs.session-records:aggregate-duration] The ZIA firewall record aggregates in a similar way, with its own open questions, in [What a ZIA firewall log record is: aggregates, action and field names](kb:zia.logs.firewall-records).

**Which rule.** A session record can name two rules: the redirect (traffic forwarding) rule applied to the transaction, and the Cloud or Branch Connector self-rule applied to it. [cloud-connector.logs.session-records:rule-fields] When the client destination IP is the service IP of the Cloud or Branch Connector instance, the forwarding rule is logged as 0. [cloud-connector.logs.session-records:forwarding-rule-zero]

**Cloud account ID.** On the Cloud Provider Account Import page the imported ID is added to the session logs to correlate workloads with the AWS account, Azure subscription and/or GCP subscription, with Import Account ID (the account ID of the Cloud Connector deployed with AWS), Import Subscription ID (Azure) and Import Project ID (GCP) each enabled or disabled. [cloud-connector.logs.session-records:account-import] Neither the default state of the toggles nor the log field they write is stated [gap:cloud-connector.logs.session-records:account-import-field].

What to check:
1. Whether the feed sends Full Session Logs, Aggregate Logs or both, before treating one record as one connection.
2. Whether a forwarding rule of 0 is traffic addressed to the connector's own service IP rather than a missing rule.

Not known (open gaps):
- The default of the Cloud Provider Account Import toggles and the session log field they write [gap:cloud-connector.logs.session-records:account-import-field]: settled by source-read or lab-test
- What a Full Session Logs feed records for HTTP and HTTPS sessions [gap:cloud-connector.logs.session-records:full-mode-http]: settled by lab-test or source-read. Blocks: deciding whether a missing HTTP or HTTPS session in a Full Session Logs feed is expected

Area: cloud-connector.logs, its subjects in references/_meta/spine/cloud-connector/cloud-connector.logs.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/cloud-connector/cloud-connector.forwarding.log-and-control.md (Log and Control Forwarding: how a Connector's logs and control traffic reach the Zscaler cloud), from cloud-connector.logs: The policy configures the primary and secondary gateways used to set up control channels and forward logs. [cloud-connector.forwarding.log-and-control:gateways]
- depends-on references/_meta/text/cloud-connector/cloud-connector.nss-va.md (NSS for Cloud & Branch Connector: how connector logs reach a SIEM), from cloud-connector.logs: Both Cloud Connector and Branch Connector can generate Session, DNS, Event and Metrics logs, and an NSS feed specifies which log data the NSS sends to the SIEM. [cloud-connector.nss-va:log-types]
- links-to references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them)
- see-also references/_meta/text/cloud-connector/cloud-connector.nss-va.feeds.md (NSS feeds for Cloud & Branch Connector: limits, output and SIEM destination)
