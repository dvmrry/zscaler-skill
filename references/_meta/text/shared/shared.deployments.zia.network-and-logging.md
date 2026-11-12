# What the ZIA local breakouts and SIEM integration deployment guides say about data center choice, tunnels and NSS log delivery (shared.deployments.zia.network-and-logging)
Also called: zia siem integration guide; zia local breakouts guide

**Local breakouts.** Data centers with a regional surcharge, or not marked Auto Geo Proximity Enabled, are not chosen as preferred data centers. [shared.deployments.zia.network-and-logging:lb-surcharge-dcs] For flapping tunnels the guide says to review the GRE and IPSec configuration guidelines and check Zscaler Trust for an associated outage; performance can be analyzed with the Zscaler Cloud Performance Test Tool. [shared.deployments.zia.network-and-logging:lb-tunnel-troubleshooting] See [How traffic reaches ZIA](kb:zia.traffic-forwarding).

**SIEM integration.** ZIA logs reach a SIEM through NSS (a virtual device between the Zscaler Cloud Nanolog cluster and the SIEM that decrypts, uncompresses and de-tokenizes logs received from the cloud, then converts them into a format the SIEM can process) or through cloud-to-cloud log streaming over HTTPS API; NSS appliances are included with ZIA Essentials Edition or later, with optional additions: for cloud NSS, ZIA Transformational Edition and later plus a Cloud NSS subscription; for one-hour log recovery capability, ZIA Transformational Edition and later plus an NSS Log Recovery subscription. [shared.deployments.zia.network-and-logging:siem-two-methods-and-subscriptions] Separate NSS appliances are required for web and firewall logging. [shared.deployments.zia.network-and-logging:siem-separate-web-firewall] Cloud-to-cloud logging is supported only if the SIEM infrastructure is in the cloud, and only if the SIEM vendor supports API-based feeds. [shared.deployments.zia.network-and-logging:siem-cloud-to-cloud-condition] See [Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud](kb:shared.nss).

**NSS availability and feeds.** The guide says NSS VMs cannot be deployed active-active (only one NSS server connects to the cloud at a time) and a fault-tolerant deployment uses active-standby, where the standby stays disconnected until the other NSS is completely disconnected; two VMs using the same certificate can give inconsistent logging. [shared.deployments.zia.network-and-logging:siem-ha] The SIEM integration guide says NSS buffers logs for up to one hour if the NSS-to-SIEM link is interrupted, and that each NSS server supports a maximum of 8 configured NSS feeds in different formats to different SIEM IP addresses on different ports. [shared.deployments.zia.network-and-logging:siem-feeds-and-buffer] The active-active disagreement is [divergence:shared.deployments.zia.network-and-logging:nss-active-active], the feed count is [divergence:shared.deployments.zia.network-and-logging:siem-feed-count] and the buffer duration is [divergence:shared.deployments.zia.network-and-logging:siem-buffer-duration]. See [What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery](kb:shared.nss.reliability) and [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds).

Sources disagree (name both sides):
- How many feeds one NSS server takes: the SIEM and ZIA guide gives a flat maximum of 8, the NSS feeds article gives 16 in total with Web and Firewall each limited to 8. [divergence:shared.deployments.zia.network-and-logging:siem-feed-count]
  - zscaler-help: Each NSS server supports a maximum of 8 configured NSS feeds.
  - zscaler-help: An NSS server takes as many as 16 feeds, with Web and Firewall each limited to 8 per server.
  Impact: Sizing feeds per NSS server from the SIEM guide alone undercounts what the feeds article allows; see shared.nss.feeds for the per-type limits.
- How long NSS buffers logs when the SIEM is unreachable: the SIEM and ZIA guide says up to one hour, the NSS deployment articles say at least one hour. [divergence:shared.deployments.zia.network-and-logging:siem-buffer-duration]
  - zscaler-help: NSS buffers logs for up to one hour.
  - zscaler-help: The NSS buffers the logs for at least one hour.
  Impact: Whether one hour is a floor or a ceiling decides how long a SIEM outage can last before logs are lost; the vendor text does not settle it.
- Whether NSS runs active-active: the NSS deployment guide recommends two NSS servers per NSS type as an active-active pair, and the SIEM and ZIA guide says NSS VMs cannot be active-active yet in its next bullet recommends two NSS services, one VM for web and one for firewall, for a fault-tolerant active-active solution. [divergence:shared.deployments.zia.network-and-logging:nss-active-active]
  - zscaler-help: Zscaler recommends two NSS servers per NSS type deployed as an active-active pair.
  - zscaler-help: NSS VMs cannot be deployed in active-active mode; only one NSS server can connect to the cloud at a time.
  - zscaler-help: For a fault-tolerant active-active solution, subscribe to two NSS services for web and firewall and run one VM for web and one VM for firewall logs.
  Impact: A high-availability design for NSS depends on which page applies; confirm against the deployment guide in use before choosing active-active or active-standby.

Area: shared.deployments, its subjects in references/_meta/spine/shared/shared.deployments.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.nss.md (Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud)
- links-to references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)
- links-to references/_meta/text/shared/shared.nss.reliability.md (What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery)
- links-to references/_meta/text/zia/zia.traffic-forwarding.md (How traffic reaches ZIA)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.deployments.md (Where the ZIA and ZPA deployment and operations guides and leading practices guides are recorded)
