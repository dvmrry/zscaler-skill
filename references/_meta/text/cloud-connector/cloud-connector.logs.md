# Cloud Connector logs: which log types exist and where to read them (cloud-connector.logs)
Also called: cloud connector log types; cloud connector log schema; branch connector logs; cbc session logs; cbc dns logs; cloud connector nss fields; cloud connector log retention; cloud connector tunnel logs

Cloud and Branch Connectors write their own log types, which are kept in the Nanolog and read either in the Admin Console or through an NSS feed. This subject lists them and where each is read.

**Retention.** Cloud & Branch Connector logs are stored for 180 days in the Zscaler Nanolog servers. [cloud-connector.logs:nanolog-180] How the console's Insights logs are filtered and downloaded is in [Cloud Connector Insights pages and Insights logs: time range, aggregation and limits](kb:cloud-connector.insights.analytics).

**Streamed log types.** The four log types an NSS feed can carry are in [NSS for Cloud & Branch Connector: how connector logs reach a SIEM](kb:cloud-connector.nss-va). Each streamed log type has its own NSS feed output format (Session, DNS, Event and Metrics), and a feed includes one or more of its fields. In the Session and DNS formats some string fields that a SIEM may fail to parse have Base64 versions, and turning on Base64 for all supported fields may cost about 20% performance; separately, the service always hex-encodes nonprintable ASCII characters in URLs as %HH. [cloud-connector.logs:feed-formats] The pages' URL hex-encoding example for a newline differs [divergence:cloud-connector.logs:url-newline-hex]. The Cloud & Branch Connector Session format is its own field set, not the ZIA firewall format: it names the client source IP `clt_src_ip` and the forwarding rule `rdrrulename`, where the ZIA firewall format uses `csip` and `rdr_rulename`. [cloud-connector.logs:not-zia-firewall] Tunnel logs are read in the console's Insights logs; the log types an NSS feed can carry are Session, DNS, Event and Metrics, so no Tunnel feed is listed. [cloud-connector.logs:tunnel-console-only]

**DNS records.** In DNS Insights logs the Response Action is always None, because the Zscaler service applies DNS policy only to requests; in the Response Rule Name column, a rule applied to the response is labeled None. [cloud-connector.logs:dns-response-none] DNS policy itself is in [Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules](kb:cloud-connector.dns.policies).

**Per type.** Session aggregation and rule attribution are in [Cloud Connector session records: aggregation and rule attribution](kb:cloud-connector.logs.session-records). Status-change events, including upgrade results, are in [Cloud Connector event logs: state changes for health, tunnels, gateways and upgrades](kb:cloud-connector.logs.event-records). CPU, memory, throughput and disk samples are in [Cloud Connector metrics logs: VM, instance and resource samples](kb:cloud-connector.logs.metrics-records).

**ZIA and ZPA side.** When Cloud Connector traffic cannot be monitored in the Admin Console, the Azure troubleshooting checks for Internet & SaaS are that the Cloud Connector location is registered, tunnel logs show traffic to Internet & SaaS, the Internet & SaaS filter is used and the traffic forwarding method is Internet & SaaS; for Private Access they are that Cloud Connector is registered and the forwarding filter is Private Access. [cloud-connector.logs:console-monitoring-checks] Seeing Cloud Connector traffic on the Internet & SaaS side depends on the traffic forwarding rule's method being Internet & SaaS; traffic forwarded another way is not expected there. [cloud-connector.logs:zia-needs-zia-forwarding] Which Cloud Connector traffic leaves no ZIA or ZPA record, and where Direct-forwarded sessions are logged, is open [gap:cloud-connector.logs:direct-traffic-logging]. How to join a connector record to the ZIA or ZPA record of the same session is open [gap:cloud-connector.logs:cross-product-join]. The ZIA firewall record itself is in [What a ZIA firewall log record is: aggregates, action and field names](kb:zia.logs.firewall-records), and the ZPA side in [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers).

What to check:
1. Which log type the question needs (Session, DNS, Event, Metrics, or the console-only Tunnel logs) before choosing the console or a feed.
2. Whether the SIEM parser expects ZIA firewall field names, which Cloud Connector session records do not use.
3. Whether the traffic was forwarded to Internet & SaaS before looking for it in ZIA logs.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.logs:tunnel-console-only] Tier B: Rests on the complete log-type sentence of the NSS feeds article set against the three Insights logs pages; no source says that tunnel logs cannot be streamed.
- [cloud-connector.logs:zia-needs-zia-forwarding] Tier B: Inferred from the troubleshooting check list, which names the Internet & SaaS forwarding method as a precondition for monitoring; no source states what is logged for other methods.

Sources disagree (name both sides):
- How the Cloud & Branch Connector NSS pages write a newline in their URL hex-encoding example. [divergence:cloud-connector.logs:url-newline-hex]
  - zscaler-help: The DNS feed output format page states the %HH rule and then gives a newline as 0A, without the %.
  - zscaler-help: The NSS feed guidelines page states the same rule and the same 0A example.
  - zscaler-help: The Session feed output format page gives a newline as %0A.
  Impact: The rule all three pages state (%HH) gives %0A for a newline; the bare 0A in two examples is not of that form. No captured feed sample shows either.

Not known (open gaps):
- Where Direct-forwarded and dropped Cloud Connector sessions are logged [gap:cloud-connector.logs:direct-traffic-logging]: settled by lab-test or source-read. Blocks: finding the log record of a workload session the connector did not send to ZIA or ZPA
- Joining a Cloud Connector session record to the ZIA or ZPA record of the same session [gap:cloud-connector.logs:cross-product-join]: settled by lab-test or tenant-data. Blocks: tracing one workload session across connector, ZIA and ZPA logs

Area: cloud-connector.logs, its subjects in references/_meta/spine/cloud-connector/cloud-connector.logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.nss-va.md (NSS for Cloud & Branch Connector: how connector logs reach a SIEM): Both Cloud Connector and Branch Connector can generate Session, DNS, Event and Metrics logs, and an NSS feed specifies which log data the NSS sends to the SIEM. [cloud-connector.nss-va:log-types]
- reached-via references/_meta/text/cloud-connector/cloud-connector.forwarding.log-and-control.md (Log and Control Forwarding: how a Connector's logs and control traffic reach the Zscaler cloud): The policy configures the primary and secondary gateways used to set up control channels and forward logs. [cloud-connector.forwarding.log-and-control:gateways]
- links-to references/_meta/text/cloud-connector/cloud-connector.dns.policies.md (Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules)
- links-to references/_meta/text/cloud-connector/cloud-connector.insights.analytics.md (Cloud Connector Insights pages and Insights logs: time range, aggregation and limits)
- links-to references/_meta/text/cloud-connector/cloud-connector.logs.event-records.md (Cloud Connector event logs: state changes for health, tunnels, gateways and upgrades)
- links-to references/_meta/text/cloud-connector/cloud-connector.logs.metrics-records.md (Cloud Connector metrics logs: VM, instance and resource samples)
- links-to references/_meta/text/cloud-connector/cloud-connector.logs.session-records.md (Cloud Connector session records: aggregation and rule attribution)
- links-to references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- links-to references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service)
