# Support systems of a Zscaler cloud, and Feed Central (shared.cloud-architecture.support-systems)
Also called: feed central; zscaler feed central; sandbox servers; pac file servers; admin console multi-tenant; threat intel feed distribution; url database updates

Besides the Central Authority, the Service Edges and the Nanolog, each cloud runs supporting systems, and one separate cloud feeds them all. Each cloud has support systems and servers, including Sandbox servers (files selected for behavioral analysis are sent there and reports are stored), PAC file servers (hosting Zscaler PAC files and custom PAC files uploaded to Zscaler), the multi-tenant Zscaler Admin Console for policy management and reporting, and Log Routers. [shared.cloud-architecture.support-systems:support-systems]

All components communicate with each other over an encrypted SSL/TLS tunnel. [shared.cloud-architecture.support-systems:encrypted-links] Sandbox behavior is in [ZIA Sandbox](kb:zia.sandbox), hosted PAC files in [PAC file forwarding: limits, versions and what it cannot cover](kb:zia.traffic-forwarding.pac), and Log Routers in [Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS](kb:shared.cloud-architecture.logging-path).

## Feed Central

Zscaler Feed Central is a separate Zscaler cloud used solely for the centralized distribution of various feeds to the Zscaler clouds. [shared.cloud-architecture.support-systems:feed-central] Zscaler has partnerships with Microsoft, Google, RSA, Verisign and others for data feeds, including feeds for URL filtering, anti-virus definitions and IP reputation. [shared.cloud-architecture.support-systems:feed-partners] Feed Central distributes its threat intelligence and other feeds to the Central Authority, which sends updates to the Public Service Edges, so that every Public Service Edge has the latest URL database and malware and threat information. [shared.cloud-architecture.support-systems:feed-path]

What happens to classification while Feed Central is unreachable is open: [What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs](kb:shared.cloud-architecture.failure-domains).

Area: shared.cloud-architecture, its subjects in references/_meta/spine/shared/shared.cloud-architecture.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.cloud-architecture.failure-domains.md (What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs)
- links-to references/_meta/text/shared/shared.cloud-architecture.logging-path.md (Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS)
- links-to references/_meta/text/zia/zia.sandbox.md (ZIA Sandbox)
- links-to references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.cloud-architecture.md (Zscaler cloud architecture)
- see-also references/_meta/text/shared/shared.cloud-architecture.central-authority.md (The Central Authority: what it holds, and how ZIA and ZPA cluster it differently)
