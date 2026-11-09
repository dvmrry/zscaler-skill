# VPN Service Edges: what they are, statuses, client IP pools, update schedule, BGP configuration mode and China (zpa.vpn.service-edges)
Also called: vpn service edge; vpn service edges; client ip pool; client networks; bgp configuration tab; vpn service edge in china

VPN Service Edges are a single-tenant instance deployed in the Zscaler cloud, and are managed and maintained by Zscaler. A VPN Service Edge assigns Zscaler Client Connector the region and an IP address based on the client IP address pool assigned to it. [zpa.vpn.service-edges:what-it-is] The other Service Edge types are [ZPA Public Service Edges](kb:zpa.public-service-edges) and [ZPA Private Service Edges](kb:zpa.private-service-edges).

**Count and pools.** The configuration guide says: "You can use one VPN Service Edge for a tenant, with a default of three VPN Service Edges. Each VPN Service Edge requires a different client IP pool." [zpa.vpn.service-edges:count-and-pools] Which of the two numbers is the default or the limit is open [gap:zpa.vpn.service-edges:service-edge-count].

**Table and statuses.** The VPN Service Edges table includes Region (where the instance is hosted), IP Address, Client Networks (the range the VPN Service Edge assigns to Client Connector), Listener Port (the port it listens on for connection requests from clients and Network Connectors), Local Router ID, and Redundant Mode (the BGP redundancy mode, Enabled or Disabled). [zpa.vpn.service-edges:table-fields] Operational Status is Down when the VPN Service Edge is off and Up when it is on. The status values are Disabled, Enrolling, Enrolled, Online, Unenrolling and Unhealthy, where Unhealthy means the connection is online but new clients cannot use it. [zpa.vpn.service-edges:statuses]

**Adding and editing.** A new VPN Service Edge takes a name, which cannot contain special characters except periods, hyphens and underscores, a Region, and a client IP pool used to assign the IP address to Client Connector. The Default UDP Listen Port is viewed, not entered, and cannot be edited later. [zpa.vpn.service-edges:create-fields] The listener port value is open [gap:zpa.vpn.service-edges:default-udp-port].

**Updates.** If an update window is not set, the VPN Service Edge software updates on Sunday at 2:00 AM UTC. Zscaler strongly recommends scheduling updates to avoid service interruption when the device reboots during a software update. [zpa.vpn.service-edges:update-schedule]

**BGP configuration.** The BGP config file lists the BGP peers (the Network Connectors) and their config parameters, such as remote IP, ASN and session keepalive timers, and feeds the FRR daemon, which is essential for BGP peering. For Configuration Mode, Generated has the Zscaler service create the file, and Override, which is shown when the file was manually uploaded, is intended for emergency procedures only. [zpa.vpn.service-edges:bgp-config-mode] Reload Configuration is Incremental, which updates only the specific parts of the configuration that have changes, or Full, which updates the entire configuration file. The option is grayed out if Override is selected for Configuration Mode. [zpa.vpn.service-edges:reload-configuration] BGP itself is in [BGP for VPN Service Edges and Network Connectors: AS numbers, failure detection, external routers](kb:zpa.vpn.bgp) and redundancy in [VPN redundancy: failure scenarios, BGP group settings, platform settings, replacing and migrating Network Connectors](kb:zpa.vpn.redundancy).

**China.** Private Access supports deploying a VPN Service Edge in Beijing, China, for specific use cases, and only when all the listed conditions are met, which include that the user is located in China, connects to the VPN Service Edge in China, and the target application is hosted in China. Users outside China cannot connect to applications in China via it, users in China cannot access applications hosted outside China via it, and Zscaler reserves the right to delete any VPN Service Edge in China that violates these terms. [zpa.vpn.service-edges:china] The component name is missing from the capture's wording of the other conditions [gap:zpa.vpn.service-edges:china-names-missing].

The hub is [ZPA VPN (for Legacy Apps): what it is, its components and where each question goes](kb:zpa.vpn), the configuration order in [VPN (for Legacy Apps) prerequisites and configuration order](kb:zpa.vpn.setup) and the dashboard in [VPN Service Edges, Network Connectors and BGP Peers dashboards](kb:zpa.vpn.dashboards).

What to check:
1. Whether a tenant's VPN Service Edge count rests on the ambiguous configuration-guide sentence.
2. Whether a software update window is set, since the device reboots during a software update.

Not known (open gaps):
- How many VPN Service Edges a tenant can have, and which number is the default [gap:zpa.vpn.service-edges:service-edge-count]: settled by support-ticket or tenant-data
- The value of the Default UDP Listen Port [gap:zpa.vpn.service-edges:default-udp-port]: settled by tenant-data or support-ticket
- Which component is deployed in China [gap:zpa.vpn.service-edges:china-names-missing]: settled by source-read

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.private-service-edges.md (ZPA Private Service Edges)
- links-to references/_meta/text/zpa/zpa.public-service-edges.md (ZPA Public Service Edges)
- links-to references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
- links-to references/_meta/text/zpa/zpa.vpn.bgp.md (BGP for VPN Service Edges and Network Connectors: AS numbers, failure detection, external routers)
- links-to references/_meta/text/zpa/zpa.vpn.dashboards.md (VPN Service Edges, Network Connectors and BGP Peers dashboards)
- links-to references/_meta/text/zpa/zpa.vpn.redundancy.md (VPN redundancy: failure scenarios, BGP group settings, platform settings, replacing and migrating Network Connectors)
- links-to references/_meta/text/zpa/zpa.vpn.setup.md (VPN (for Legacy Apps) prerequisites and configuration order)
