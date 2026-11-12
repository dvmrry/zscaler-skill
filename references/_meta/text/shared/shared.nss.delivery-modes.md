# VM-based NSS and Cloud NSS: subscriptions, transport and what each needs (shared.nss.delivery-modes)
Also called: vm-based nss vs cloud nss; cloud nss; nss for web; nss for firewall; cloud nss subscription; nss transport tcp https; send the same logs to two siems; multi-siem fan-out

Both modes read the same Nanolog; they differ in where the streaming component runs, how it reaches the SIEM and how it is bought. [Web and Firewall logs are stored in the Nanolog in the Zscaler cloud; each NSS receives copies from the Nanolog, then decompresses, detokenizes, filters and converts them to the configured output format.](kb:zia.logs.nss-feed-format:one-store)

## VM-based NSS

Its two subscriptions are [VM-based NSS is offered as NSS for Web (web and mobile traffic logs) and NSS for Firewall (Zscaler Firewall logs).](kb:zia.audit-logs.streaming:vm-nss-subscriptions). VM-based NSS uses a VM in the customer network to stream logs to the SIEM over a raw TCP connection or an HTTP connection: a TCP feed uses a TCP connection between NSS and the SIEM, and an HTTPS feed uses TLS to load-balance and encrypt syslog feeds between them. [shared.nss.delivery-modes:vm-transport] The vendor comparison lists for VM-based NSS a customizable feed format, a separate alert feed for monitoring, buffering in VM memory, and TCP and HTTP(S) connections for interoperability with most SIEMs. [shared.nss.delivery-modes:vm-comparison] It needs a virtual appliance: [NSS servers: the VM record, its certificate, platforms and Nanolog capacity](kb:shared.nss.servers).

## Cloud NSS

Cloud NSS uses an HTTPS API feed to push logs from the Zscaler cloud to an HTTPS API-based log collector on the SIEM, for all Internet & SaaS (ZIA) log types and without on-premises connectors; Zscaler offers Cloud NSS for Web and Cloud NSS for Firewall subscriptions. [shared.nss.delivery-modes:cloud-push] Cloud NSS has a customizable HTTPS outbound connector for cloud-based SIEMs that support a stateless log ingestion API; Zscaler can POST batches of logs if the SIEM exposes a publicly routable HTTPS log collection API, for example Splunk HTTP Event Collector. [shared.nss.delivery-modes:cloud-siem-requirement] Cloud NSS requires a separate concurrent subscription, and its geo-availability and qualifications are obtained from Zscaler Support. [shared.nss.delivery-modes:cloud-subscription] Cloud NSS comes with continuous monitoring and alerting by Zscaler CloudOps, given in the comparison as 24/7. [shared.nss.delivery-modes:cloud-cloudops] Its HTTPS-only endpoint URLs and OAuth fields are in [Cloud NSS feed settings: HTTPS-only URLs and OAuth fields](kb:zia.api.cloud-nss-feeds), and the one-feed-per-log-type rule and JSON recommendation in [A Cloud NSS instance supports one feed per Internet and SaaS log type, and the feed format is customizable, with JSON recommended.](kb:zia.logs.nss-feed-format:cloud-feed-limit).

## Which logs each subscription carries

Which subscription carries DNS, tunnel and the other log types is not stated in the captured help [gap:shared.nss.delivery-modes:subscription-log-types].

## One log type to two SIEMs

Sending one ZIA log type to two SIEM destinations through Cloud NSS takes a second Cloud NSS instance, because an instance holds one feed per log type; a VM-based NSS server can hold several Web or Firewall feeds, up to 8 of each, each with its own filters, fields and output format. [shared.nss.delivery-modes:same-type-two-destinations] Whether one VM-based feed can itself send to two destinations is open [gap:shared.nss.delivery-modes:feed-destinations].

|  | VM-based NSS | Cloud NSS |
| --- | --- | --- |
| Runs | A VM in the customer network [shared.nss.delivery-modes:vm-transport] | In the Zscaler cloud, no on-premises connector [shared.nss.delivery-modes:cloud-push] |
| Transport to the SIEM | TCP feed or HTTPS feed [shared.nss.delivery-modes:vm-transport] | HTTPS POST of batches to a publicly routable collector [shared.nss.delivery-modes:cloud-siem-requirement] |
| Feeds | Up to 16 per server [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds) | One per log type per instance [How NSS feeds encode and deliver ZIA log fields](kb:zia.logs.nss-feed-format) |
| Buffering and recovery | VM memory buffer, Nanolog one-hour recovery [What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery](kb:shared.nss.reliability) | Batch retry up to one hour, Nanolog one-hour recovery [What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery](kb:shared.nss.reliability) |
| Monitoring | Separate alert feed [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds) | Zscaler CloudOps [shared.nss.delivery-modes:cloud-cloudops] |
| Subscription | NSS for Web, NSS for Firewall [Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT)](kb:zia.audit-logs.streaming) | Separate concurrent subscription [shared.nss.delivery-modes:cloud-subscription] |

What to check:
1. Which mode the tenant runs, and for Cloud NSS which subscription the log type falls under.
2. For a Cloud NSS feed, whether the SIEM exposes a publicly routable HTTPS collection endpoint.
3. For a second destination of the same log type, whether a second Cloud NSS instance or a second VM feed is available.

Inferred, not quoted (say so when an answer rests on one):
- [shared.nss.delivery-modes:same-type-two-destinations] Tier B: Follows from the per-instance and per-server feed limits; no source describes sending one log type to several SIEMs. Whether one VM-based feed can have more than one SIEM destination is open (feed-destinations).

Not known (open gaps):
- Which subscription carries each log type [gap:shared.nss.delivery-modes:subscription-log-types]: settled by support-ticket or tenant-data. Blocks: saying whether a tenant's subscription allows a DNS, Tunnel, SaaS Security or audit feed
- Whether one VM-based NSS feed can send to more than one SIEM destination [gap:shared.nss.delivery-modes:feed-destinations]: settled by source-read or lab-test. Blocks: planning a second SIEM destination for the same VM-based feed

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)
- links-to references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)
- links-to references/_meta/text/shared/shared.nss.reliability.md (What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery)
- links-to references/_meta/text/zia/zia.audit-logs.streaming.md (Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT))
- links-to references/_meta/text/shared/shared.nss.servers.md (NSS servers: the VM record, its certificate, platforms and Nanolog capacity)
- links-to references/_meta/text/zia/zia.api.cloud-nss-feeds.md (Cloud NSS feed settings: HTTPS-only URLs and OAuth fields)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.nss.sentinel-module.md (Terraform module for Cloud NSS to Microsoft Sentinel)
- see-also references/_meta/text/shared/shared.nss.md (Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud)
- see-also references/_meta/text/shared/shared.siem-mapping.md (Zscaler log types and where they land in a SIEM)
