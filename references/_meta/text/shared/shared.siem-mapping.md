# Zscaler log types and where they land in a SIEM (shared.siem-mapping)
Also called: siem log mapping; zscaler sourcetype; zscalernss-web; zscalernss-fw; which index has zscaler logs; sentinel zscaler table; chronicle zscaler log type; elastic zscaler index; sumo logic zscaler source category; log type catalog

Zscaler defines the log types and their fields; where the records land in a SIEM, and under what names, is the tenant's own configuration. This catalog covers the first half and says what vendor sources state about the second.

## Log types, fields and meaning

| Log type | Path | Fields | Reading the records |
| --- | --- | --- | --- |
| ZIA Web | NSS feed [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds) | [ZIA web log (NSS web feed)](kb:zia/web-log) | [What a ZIA web log record is and how its fields are named](kb:zia.logs.web-records), [Which rule decided a web transaction, from the logs](kb:zia.logs.web-rule-attribution) |
| ZIA Firewall | NSS feed [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds) | [ZIA firewall log (NSS firewall feed)](kb:zia/firewall-log) | [What a ZIA firewall log record is: aggregates, action and field names](kb:zia.logs.firewall-records) |
| ZIA DNS | NSS feed [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds) | [ZIA DNS log (NSS DNS feed)](kb:zia/dns-log) | [Reading a ZIA DNS log record: naming, encodings and field caveats](kb:zia.logs.dns-record-fields) |
| ZIA Tunnel and the other ZIA feed types | NSS feed [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds) | Not captured [gap:shared.siem-mapping:uncaptured-feed-fields] |  |
| ZIA SaaS Security | NSS feed [CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming](kb:zia.casb.insights-logs) | Open in [CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming](kb:zia.casb.insights-logs) | [CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming](kb:zia.casb.insights-logs) |
| ZIA admin audit | Admin audit feed [Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT)](kb:zia.audit-logs.streaming) | Open in [Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT)](kb:zia.audit-logs.streaming) | [What the ZIA admin audit log records and how the console shows it](kb:zia.audit-logs.what-is-recorded) |
| ZIA NSS alerts | Alert feed [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds) |  |  |
| ZPA User Activity | Log receiver [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers) | [ZPA User Activity Log (LSS zpn_trans_log)](kb:zpa/user-activity-log) | [What a ZPA User Activity log record says and does not say](kb:zpa.logs.user-activity) |
| ZPA User Status | Log receiver [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers) | [ZPA User Status Log (LSS zpn_auth_log)](kb:zpa/user-status-log) | [What a ZPA User Status log record says and does not say](kb:zpa.logs.user-status) |
| ZPA App Connector Status | Log receiver [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers) | [ZPA App Connector Status Log (LSS zpn_ast_auth_log)](kb:zpa/app-connector-status-log) | [ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers](kb:zpa.logs.control-session-status) |
| ZPA App Connector Metrics | Log receiver [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers) | [ZPA App Connector Metrics Log (LSS zpn_ast_comprehensive_stats)](kb:zpa/app-connector-metrics-log) | [What the ZPA App Connector Metrics log reports and what it leaves open](kb:zpa.logs.app-connector-metrics) |
| ZPA Browser Access | Log receiver [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers) | [ZPA Browser Access Log (LSS zpn_http_trans_log)](kb:zpa/browser-access-log) | [What a ZPA Browser Access log record says and does not say](kb:zpa.logs.browser-access) |
| ZPA Microsegmentation Flow | Log receiver [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers) | [ZPA Microsegmentation Flow Log (LSS zms_flow_log)](kb:zpa/microsegmentation-flow-log) | [What a ZPA Microsegmentation Flow log record says and does not say](kb:zpa.logs.microsegmentation-flow) |
| ZPA Audit | Log receiver [Streaming ZPA audit logs to a SIEM: log type, fields, filtering](kb:zpa.audit-logs.streaming) | [ZPA Audit Log (LSS zpn_audit_log)](kb:zpa/audit-log) | [What the ZPA admin audit log records, how long it is kept, and whether it can be pulled](kb:zpa.audit-logs.what-is-recorded) |
| ZPA Private Service Edge status and metrics | Log receiver [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers) | [ZPA Private Service Edge Status Log (LSS zpn_sys_auth_log)](kb:zpa/private-service-edge-status-log), [ZPA Private Service Edge Metrics Log (LSS zpn_pbroker_comprehensive_stats)](kb:zpa/private-service-edge-metrics-log) | [ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers](kb:zpa.logs.control-session-status), [Private Service Edge and Private Cloud Controller Metrics logs](kb:zpa.logs.service-edge-metrics) |
| ZPA Private Cloud Controller status and metrics | Log receiver [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers) | [ZPA Private Cloud Controller Status Log (LSS zpn_sitec_auth_log)](kb:zpa/private-cloud-controller-status-log), [ZPA Private Cloud Controller Metrics Log (LSS zpn_sitec_comprehensive_stats)](kb:zpa/private-cloud-controller-metrics-log) | [ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers](kb:zpa.logs.control-session-status), [Private Service Edge and Private Cloud Controller Metrics logs](kb:zpa.logs.service-edge-metrics) |
| Client Connector | None; device files [Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures](kb:zcc.logging.collection) |  | [What the Client Connector log on the device records](kb:zcc.logs.client-log) |
| ZDX | ZDX API [Getting ZDX data out: the ZDX API, its windows and delays](kb:shared.log-export.zdx) |  |  |

The full list of ZPA log types and their codes is [Log types a ZPA log receiver can carry, and their codes](kb:zpa.log-receivers.log-types). Whether one receiver carries one log type or several is not settled [gap:shared.siem-mapping:receiver-log-types].

## What vendor sources say about SIEMs

Zscaler publishes deployment guides for integrating Cloud NSS with named cloud-based SIEMs, among them Splunk, Microsoft Sentinel, Google SecOps, Elastic, Sumo Logic, IBM QRadar and Amazon S3. [shared.siem-mapping:cloud-siem-guides] Zscaler publishes deployment guides for integrating VM-based NSS with named SIEMs, among them Splunk, Microsoft Sentinel, Elastic, Sumo Logic, IBM QRadar and LogRhythm. [shared.siem-mapping:vm-siem-guides] The Cloud NSS feed names its SIEM type, with OAuth fields for Azure Sentinel: [A Cloud NSS feed has an oauth_authentication switch, and its authentication URL is described as applying when the SIEM type is Azure Sentinel.](kb:zia.api.cloud-nss-feeds:oauth-fields).

**Splunk.** The Terraform provider's Cloud NSS feed examples wrap each record in a JSON envelope that names a Splunk sourcetype: the example headed NSS Splunk Feed is a `WEBLOG` feed with siem_type `SPLUNK` and sourcetype `zscalernss-web`, and the example headed NSS Splunk Feed - Google Chronicle is an `FWLOG` feed with siem_type `SPLUNK`, a Google Chronicle connection URL and sourcetype `zscalernss-fw`. [shared.siem-mapping:splunk-example] Name-value output, which Splunk can parse without a fixed order: [Both the NSS feed guidelines and the LSS log stream content guidelines suggest name-value pairs where the SIEM supports them, and say some SIEMs, such as Splunk, can parse name-value formats and auto-detect field names regardless of order.](kb:shared.splunk:name-value-pairs). Other Splunk names, including add-on defaults and ZPA indexes, are tenant data [gap:shared.siem-mapping:splunk-landing].

**Other SIEMs.** Table, log-type and index names in Sentinel, Google SecOps, Elastic and Sumo Logic are tenant data [gap:shared.siem-mapping:other-siem-landing].

What to check:
1. Ask the operator, or read the SIEM, for the index, sourcetype, table or log type each Zscaler log type lands in before writing a query.
2. For a Cloud NSS feed, read the feed's output format: a JSON envelope can set the SIEM-side name itself.

Not known (open gaps):
- Splunk sourcetypes and indexes for each Zscaler log type [gap:shared.siem-mapping:splunk-landing] (data gap): filled by operator; settled by tenant-data. Blocks: writing a Splunk search against a tenant's Zscaler data
- Table, log-type and index names in other SIEMs [gap:shared.siem-mapping:other-siem-landing] (data gap): filled by operator; settled by tenant-data. Blocks: writing a query in a non-Splunk SIEM against a tenant's Zscaler data
- Field lists for ZIA feed types other than Web, Firewall and DNS [gap:shared.siem-mapping:uncaptured-feed-fields]: settled by source-read. Blocks: naming fields or writing queries for those feeds
- Whether one ZPA log receiver carries one log type or several [gap:shared.siem-mapping:receiver-log-types]: settled by tenant-data or lab-test. Blocks: deciding whether each ZPA log type lands in its own SIEM input

Area: shared.siem-mapping, its subjects in references/_meta/spine/shared/shared.siem-mapping.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service)
- links-to references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)
- links-to references/_meta/text/zia/zia.casb.insights-logs.md (CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming)
- links-to references/_meta/text/zpa/zpa.logs.control-session-status.md (ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers)
- links-to references/_meta/text/zia/zia.audit-logs.streaming.md (Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT))
- links-to references/_meta/text/zpa/zpa.logs.service-edge-metrics.md (Private Service Edge and Private Cloud Controller Metrics logs)
- links-to references/_meta/text/shared/shared.log-export.zdx.md (Getting ZDX data out: the ZDX API, its windows and delays)
- links-to references/_meta/text/shared/shared.splunk.md (Searching Zscaler logs in Splunk: field names, placeholders and validation searches)
- links-to references/_meta/text/zcc/zcc.logging.collection.md (Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures)
- links-to references/_meta/text/zcc/zcc.logs.client-log.md (What the Client Connector log on the device records)
- links-to references/_meta/text/zia/zia.api.cloud-nss-feeds.md (Cloud NSS feed settings: HTTPS-only URLs and OAuth fields)
- links-to references/_meta/text/zia/zia.audit-logs.what-is-recorded.md (What the ZIA admin audit log records and how the console shows it)
- links-to references/_meta/text/zia/zia.logs.dns-record-fields.md (Reading a ZIA DNS log record: naming, encodings and field caveats)
- links-to references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- links-to references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)
- links-to references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs)
- links-to references/_meta/text/zpa/zpa.audit-logs.streaming.md (Streaming ZPA audit logs to a SIEM: log type, fields, filtering)
- links-to references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled)
- links-to references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
- links-to references/_meta/text/zpa/zpa.logs.app-connector-metrics.md (What the ZPA App Connector Metrics log reports and what it leaves open)
- links-to references/_meta/text/zpa/zpa.logs.browser-access.md (What a ZPA Browser Access log record says and does not say)
- links-to references/_meta/text/zpa/zpa.logs.microsegmentation-flow.md (What a ZPA Microsegmentation Flow log record says and does not say)
- links-to references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say)
- links-to references/_meta/text/zpa/zpa.logs.user-status.md (What a ZPA User Status log record says and does not say)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.log-export.md (Where each Zscaler product's logs go and how to get them out)
- see-also references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs)
