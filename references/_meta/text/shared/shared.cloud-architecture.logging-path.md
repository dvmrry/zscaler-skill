# Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS (shared.cloud-architecture.logging-path)
Also called: nanolog; nanolog cluster; log routers; where are zia logs stored; log path; nss vs lss

Internet & SaaS and Private Access log through different systems. Log data generated for every transaction on a ZIA Public Service Edge is compressed, tokenized and exported over TLS to Log Routers, which direct each organization's logs to the Nanolog cluster hosted in the appropriate geographical region. [shared.cloud-architecture.logging-path:edge-log-export]

**The Nanolog.** Nanolog clusters store transaction logs and provide reports. Every second a Nanolog cluster receives logs from all over the world, correlates them to a specific customer organization and writes them to disk for high-speed retrieval for reporting and analytics. [shared.cloud-architecture.logging-path:nanolog-role] Each Nanolog cluster has one active server and two passive standbys; the active Nanolog replicates data to the other two immediately, so any can become active with no data loss, and each server is hosted in a separate location. [shared.cloud-architecture.logging-path:nanolog-topology] A Nanolog cluster processes up to 1.2+ billion logs per day. [shared.cloud-architecture.logging-path:nanolog-volume]

**Streaming out of ZIA.** The Nanolog Streaming Service (NSS) uses a virtual appliance to stream web and firewall traffic logs in real time from the Zscaler Nanolog to the customer's SIEM. [shared.cloud-architecture.logging-path:nss] Both NSS forms read the same Nanolog store: [Web and Firewall logs are stored in the Nanolog in the Zscaler cloud; each NSS receives copies from the Nanolog, then decompresses, detokenizes, filters and converts them to the configured output format.](kb:zia.logs.nss-feed-format:one-store).

**Private Access.** [Log data for Public Service Edges is exported to log routers, which direct it to the Log Streaming Service hosted in the geographic region for each organization; the Log Streaming Service analyzes events reported primarily by Public or Private Service Edges.](kb:zpa.public-service-edges.what-it-is:log-routing) [LSS captures log data about App Connectors and users in Private Access, while the Nanolog Streaming Service resides in Internet & SaaS (ZIA) and streams traffic logs from the Zscaler Nanolog to a SIEM.](kb:zpa.log-receivers.architecture:not-nss) Private Access does not store information on any persistent media (disk) unless the organization configures it to, and the information can be obfuscated according to the organization's preferences. [shared.cloud-architecture.logging-path:lss-no-persistent-storage]

What a Nanolog outage does to logging and to streams is open: [What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs](kb:shared.cloud-architecture.failure-domains).

What to check:
1. For ZIA web or firewall logs, trace Service Edge to Log Router to the tenant's regional Nanolog to NSS; for ZPA, Service Edge to log router to LSS to a log receiver.

Area: shared.cloud-architecture, its subjects in references/_meta/spine/shared/shared.cloud-architecture.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.cloud-architecture.failure-domains.md (What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs)
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)
- links-to references/_meta/text/zpa/zpa.log-receivers.architecture.md (How the Log Streaming Service reaches a SIEM)
- links-to references/_meta/text/zpa/zpa.public-service-edges.what-it-is.md (What a ZPA Public Service Edge is)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.cloud-architecture.md (Zscaler cloud architecture)
