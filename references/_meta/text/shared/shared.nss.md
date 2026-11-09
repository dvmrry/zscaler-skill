# Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud (shared.nss)
Also called: nss; nanolog streaming service; nss architecture; how do zia logs get to the siem; nanolog; nss vs lss

NSS is the Internet & SaaS (ZIA) path from the Zscaler log store to a customer SIEM, and also the name of a collector that runs the other way. NSS is a family of products for exchanging event logs between the Zscaler cloud and third-party security solutions: Log Streaming sends logs from the Nanolog to a SIEM through VM-based NSS or Cloud NSS, and Log Collection streams logs from third-party firewall and web proxy devices to the Zscaler cloud through the NSS Collector. [shared.nss:family]

**The store and the copies.** Each NSS opens a secure tunnel to the Nanolog in the Zscaler cloud, the Nanolog streams copies of the logs to it in a highly compressed format, and the original logs are retained in the Nanolog. [shared.nss:originals-retained] What each NSS then does with its copy (decompress, detokenize, filter, convert) is [Web and Firewall logs are stored in the Nanolog in the Zscaler cloud; each NSS receives copies from the Nanolog, then decompresses, detokenizes, filters and converts them to the configured output format.](kb:zia.logs.nss-feed-format:one-store).

1. **Which delivery mode?** VM-based NSS in the customer network or Cloud NSS pushing from the Zscaler cloud, with their subscriptions and transports: [VM-based NSS and Cloud NSS: subscriptions, transport and what each needs](kb:shared.nss.delivery-modes).
2. **What survives an outage?** The VM memory buffer, the Duplicate Logs setting and the one-hour Nanolog recovery each cover a different leg: [What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery](kb:shared.nss.reliability).
3. **What does a feed send?** Feed limits, feed types, filters and the output format string: [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds). Per-kind destination settings are in [NSS feed destination and delivery settings by feed kind: TCP, HTTP, Cloud NSS and MCAS](kb:shared.nss.feed-settings), per-log-type filters in [What each NSS log type's feed can filter on, and the rules for matching](kb:shared.nss.feed-filters) and alert feeds in [NSS and Cloud NSS alert feeds: levels, triggers, thresholds and the Cloud NSS alert format](kb:shared.nss.alerts).
4. **Where does the VM run and how far does it scale?** The NSS server record, its certificate, platforms and Nanolog capacity: [NSS servers: the VM record, its certificate, platforms and Nanolog capacity](kb:shared.nss.servers). Per-platform deployment is in [Deploying the NSS VM on AWS, GCP, Azure, Hyper-V, Nutanix and vSphere](kb:shared.nss.vm-platforms), specs in [NSS VM specs: cores, memory by user count, disk, bandwidth and the console's sizing inputs](kb:shared.nss.vm-sizing), interfaces and firewall rules in [NSS VM interfaces and firewall requirements: management and service roles, outbound-only, no SSL inspection](kb:shared.nss.vm-network), the `nss` command set in [Operating and troubleshooting a deployed NSS VM: the nss command set, error codes and connection checks](kb:shared.nss.vm-operations) and extra interfaces, proxy and SSH settings in [Advanced NSS VM settings: extra interfaces, local NTP, explicit proxy, hostname and SSH](kb:shared.nss.vm-advanced-settings).

**The other direction.** The NSS Collector brings third-party firewall and proxy logs into the Zscaler cloud and is not an export path: [NSS Collector: third-party firewall and proxy logs into the SaaS Security Report](kb:shared.nss.collector).

**LSS is not NSS.** Private Access (ZPA) streams its logs through the Log Streaming Service and App Connectors, not NSS: [LSS captures log data about App Connectors and users in Private Access, while the Nanolog Streaming Service resides in Internet & SaaS (ZIA) and streams traffic logs from the Zscaler Nanolog to a SIEM.](kb:zpa.log-receivers.architecture:not-nss). How LSS is licensed is not stated [gap:shared.nss:lss-billing].

**What NSS emits.** The field lists are generated types: [ZIA web log (NSS web feed)](kb:zia/web-log), [ZIA firewall log (NSS firewall feed)](kb:zia/firewall-log) and [ZIA DNS log (NSS DNS feed)](kb:zia/dns-log). How to read the records: [What a ZIA web log record is and how its fields are named](kb:zia.logs.web-records), [What a ZIA firewall log record is: aggregates, action and field names](kb:zia.logs.firewall-records), [Reading a ZIA DNS log record: naming, encodings and field caveats](kb:zia.logs.dns-record-fields).

Not known (open gaps):
- Whether LSS is licensed separately from NSS [gap:shared.nss:lss-billing]: settled by support-ticket or source-read. Blocks: saying whether streaming ZPA logs needs a subscription beyond the ZPA one

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.nss.alerts.md (NSS and Cloud NSS alert feeds: levels, triggers, thresholds and the Cloud NSS alert format)
- links-to references/_meta/text/shared/shared.nss.collector.md (NSS Collector: third-party firewall and proxy logs into the SaaS Security Report)
- links-to references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs)
- links-to references/_meta/text/shared/shared.nss.feed-filters.md (What each NSS log type's feed can filter on, and the rules for matching)
- links-to references/_meta/text/shared/shared.nss.feed-settings.md (NSS feed destination and delivery settings by feed kind: TCP, HTTP, Cloud NSS and MCAS)
- links-to references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)
- links-to references/_meta/text/shared/shared.nss.reliability.md (What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery)
- links-to references/_meta/text/shared/shared.nss.servers.md (NSS servers: the VM record, its certificate, platforms and Nanolog capacity)
- links-to references/_meta/text/shared/shared.nss.vm-advanced-settings.md (Advanced NSS VM settings: extra interfaces, local NTP, explicit proxy, hostname and SSH)
- links-to references/_meta/text/shared/shared.nss.vm-network.md (NSS VM interfaces and firewall requirements: management and service roles, outbound-only, no SSL inspection)
- links-to references/_meta/text/shared/shared.nss.vm-operations.md (Operating and troubleshooting a deployed NSS VM: the nss command set, error codes and connection checks)
- links-to references/_meta/text/shared/shared.nss.vm-platforms.md (Deploying the NSS VM on AWS, GCP, Azure, Hyper-V, Nutanix and vSphere)
- links-to references/_meta/text/shared/shared.nss.vm-sizing.md (NSS VM specs: cores, memory by user count, disk, bandwidth and the console's sizing inputs)
- links-to references/_meta/text/zia/zia.logs.dns-record-fields.md (Reading a ZIA DNS log record: naming, encodings and field caveats)
- links-to references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)
- links-to references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)
- links-to references/_meta/text/zpa/zpa.log-receivers.architecture.md (How the Log Streaming Service reaches a SIEM)
