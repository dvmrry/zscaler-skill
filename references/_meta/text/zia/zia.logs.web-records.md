# What a ZIA web log record is and how its fields are named (zia.logs.web-records)
Also called: web log record; nss specifier vs insights column; web insights column names; one record per transaction; pcapid capture; web logs; zia web logs; check the web logs

A web log record describes a web transaction. Most fields are named twice, once for NSS and once for the Insights console.

**What a record is.** Web log fields describe a transaction: time is the time and date of the transaction, epochtime its epoch time, and recordid a unique record identifier for each log. [zia.logs.web-records:per-transaction] Each GET request is logged as a transaction, and opening a single web page typically takes several GET requests to fetch the page's objects; the Web and Mobile Insights Logs columns pages both say so. [zia.logs.web-records:get-per-transaction] The unit of one record is not defined beyond that [gap:zia.logs.web-records:record-granularity].

**Two names.** Each web log field is listed under an NSS format specifier and, where one exists, an Insights Logs column name; the same field can carry different names in the two places. [zia.logs.web-records:two-names] Fields without an Insights name have a blank Insights column or are marked specific to NSS, and the time-part fields are marked as derived from Logged Time. [zia.logs.web-records:no-insights-name] Some Insights names differ from the NSS meaning: reqsize appears as Sent Bytes, respsize as Received Bytes, and riskscore as Suspicious Content. [zia.logs.web-records:insights-renames]

**Capture and forwarding.** The pcapid field holds the path of the packet capture file, formatted as company ID, directory and file name, where the directory is the log type; the file is downloaded from the Capture column of Web Insights Logs. [zia.logs.web-records:pcap-capture] Whether Zscaler keeps a copy of capture files is disputed in [zia.traffic-capture:pcap-storage](kb:zia.traffic-capture:pcap-storage). The trafficredirectmethod field records the traffic forwarding method used to reach ZIA Public Service Edges. [zia.logs.web-records:psedge-field]

Values and caveats of individual fields: [Value encodings and caveats of ZIA web log fields](kb:zia.logs.web-field-semantics). Fields that need extra enablement: [Which ZIA log fields are not logged until enabled](kb:zia.logs.field-enablement). Rule attribution: [Which rule decided a web transaction, from the logs](kb:zia.logs.web-rule-attribution).

What to check:
1. Which name the SIEM stores, the NSS specifier or the Insights column, before translating a query between them.
2. Whether a record can be traced to its capture through pcapid.
3. Whether trafficredirectmethod names the tenant's forwarding path.

Not known (open gaps):
- What exactly one web record covers [gap:zia.logs.web-records:record-granularity] (data gap): filled by operator; settled by tenant-data. Blocks: Counting transactions from record counts.

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.logs.field-enablement.md (Which ZIA log fields are not logged until enabled)
- links-to references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields)
- links-to references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs)
- links-to references/_meta/text/zia/zia.traffic-capture.md (Traffic Capture Essentials and Traffic Capture for NDR: storage, rules, limits and obfuscation)
